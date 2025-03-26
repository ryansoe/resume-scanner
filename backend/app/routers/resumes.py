import os
import uuid
import shutil
from typing import List, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from app.schemas.resume import (
    ResumeUploadResponse,
    JobDescription,
    ResumeAnalysis,
    ResumeRankingResponse
)
from app.utils.resume_parser import extract_text_from_resume
from app.utils.openai_helper import (
    extract_skills_from_text,
    match_skills,
    calculate_overall_score,
    generate_feedback
)

router = APIRouter(prefix="/resumes", tags=["resumes"])

# In-memory storage for uploaded resumes
# In a production app, you would use a database
UPLOADED_RESUMES = {}
UPLOAD_FOLDER = "uploads"

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/upload", response_model=List[ResumeUploadResponse])
async def upload_resumes(files: List[UploadFile] = File(...)):
    """Upload multiple resume files (PDF, DOCX)"""
    responses = []
    
    for file in files:
        # Validate file extension
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in ['.pdf', '.docx']:
            responses.append(
                ResumeUploadResponse(
                    filename=file.filename,
                    status="error: unsupported file format"
                )
            )
            continue
        
        # Generate unique ID for the resume
        resume_id = str(uuid.uuid4())
        
        # Save file to disk
        file_path = os.path.join(UPLOAD_FOLDER, f"{resume_id}{file_extension}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Store file info in memory
        UPLOADED_RESUMES[resume_id] = {
            "id": resume_id,
            "filename": file.filename,
            "file_path": file_path
        }
        
        responses.append(
            ResumeUploadResponse(
                filename=file.filename,
                status="success"
            )
        )
    
    return responses

@router.post("/analyze", response_model=ResumeRankingResponse)
async def analyze_resumes(job_description: JobDescription):
    """Analyze uploaded resumes against a job description"""
    if not UPLOADED_RESUMES:
        raise HTTPException(
            status_code=400,
            detail="No resumes uploaded. Please upload resumes first."
        )
    
    # Extract skills from job description
    job_skills = extract_skills_from_text(job_description.text)
    
    # Process each resume
    resume_analyses = []
    for resume_id, resume_info in UPLOADED_RESUMES.items():
        # Extract text from resume
        resume_text = extract_text_from_resume(resume_info["file_path"])
        
        # Extract skills from resume
        resume_skills = extract_skills_from_text(resume_text)
        
        # Match skills
        skill_matches = match_skills(resume_skills, job_skills)
        
        # Calculate overall score
        overall_score = calculate_overall_score(skill_matches)
        
        # Generate feedback
        feedback_result = generate_feedback(resume_text, job_description.text, skill_matches)
        
        # Create resume analysis
        analysis = ResumeAnalysis(
            resume_id=resume_id,
            filename=resume_info["filename"],
            extracted_skills=resume_skills,
            job_skills=job_skills,
            skill_matches=skill_matches,
            overall_match_score=overall_score,
            feedback=feedback_result.get("feedback", ""),
            strengths=feedback_result.get("strengths", []),
            improvement_areas=feedback_result.get("improvement_areas", [])
        )
        
        resume_analyses.append(analysis)
    
    # Sort resumes by overall match score (descending)
    resume_analyses.sort(key=lambda x: x.overall_match_score, reverse=True)
    
    return ResumeRankingResponse(resumes=resume_analyses)

@router.delete("/clear")
async def clear_resumes():
    """Clear all uploaded resumes"""
    # Delete files
    for resume_info in UPLOADED_RESUMES.values():
        file_path = resume_info["file_path"]
        if os.path.exists(file_path):
            os.remove(file_path)
    
    # Clear in-memory storage
    UPLOADED_RESUMES.clear()
    
    return {"message": "All resumes cleared successfully"} 