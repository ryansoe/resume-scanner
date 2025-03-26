import json
from typing import List, Dict, Any
from openai import OpenAI
from app.core.config import settings

# Initialize OpenAI client with simplified configuration
client = OpenAI(api_key=settings.OPENAI_API_KEY)

def extract_skills_from_text(text: str) -> List[Dict[str, Any]]:
    """
    Extract skills from text using OpenAI API.
    
    Args:
        text: Text content to extract skills from
        
    Returns:
        List of extracted skills with confidence scores
    """
    prompt = f"""
    Extract technical skills, soft skills, and competencies from the following text. 
    Focus on skills that would be relevant to a job application.
    
    Text:
    {text}
    
    Return the results as a JSON object with the following structure:
    {{
        "skills": [
            {{"name": "skill name", "confidence": confidence_score_between_0_and_1}}
        ]
    }}
    
    Where confidence score reflects how confident you are that this is a relevant skill.
    """
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that extracts skills from resumes and job descriptions."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"},
        temperature=0.1
    )
    
    # Parse the response
    content = response.choices[0].message.content
    try:
        result = json.loads(content)
        # Ensure we always return a list of dictionaries with name and confidence keys
        skills = result.get("skills", [])
        
        # Validate each skill has the required format
        formatted_skills = []
        for skill in skills:
            if isinstance(skill, dict) and "name" in skill and "confidence" in skill:
                formatted_skills.append(skill)
            elif isinstance(skill, str):
                # Handle case where skill is just a string
                formatted_skills.append({"name": skill, "confidence": 0.8})
            
        return formatted_skills
    except json.JSONDecodeError:
        # Fallback in case the response is not valid JSON
        return []

def match_skills(resume_skills: List[Dict[str, Any]], job_skills: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Match skills from a resume against skills from a job description.
    
    Args:
        resume_skills: List of skills extracted from resume
        job_skills: List of skills extracted from job description
        
    Returns:
        List of skill matches with match scores
    """
    skill_matches = []
    
    # Ensure we're working with properly formatted skill dictionaries
    formatted_resume_skills = []
    for skill in resume_skills:
        if isinstance(skill, dict) and "name" in skill:
            formatted_resume_skills.append(skill)
        elif isinstance(skill, str):
            formatted_resume_skills.append({"name": skill, "confidence": 0.8})
    
    formatted_job_skills = []
    for skill in job_skills:
        if isinstance(skill, dict) and "name" in skill:
            formatted_job_skills.append(skill)
        elif isinstance(skill, str):
            formatted_job_skills.append({"name": skill, "confidence": 0.8})
    
    # Extract skill names for easier matching
    resume_skill_names = [skill["name"].lower() for skill in formatted_resume_skills]
    job_skill_names = [skill["name"].lower() for skill in formatted_job_skills]
    
    # Match job skills with resume skills
    for job_skill in formatted_job_skills:
        skill_name = job_skill["name"].lower()
        match = {
            "skill": job_skill["name"],
            "in_job_description": True,
            "in_resume": skill_name in resume_skill_names,
            "match_score": 1.0 if skill_name in resume_skill_names else 0.0
        }
        skill_matches.append(match)
    
    # Add resume skills that weren't already matched
    for resume_skill in formatted_resume_skills:
        skill_name = resume_skill["name"].lower()
        if skill_name not in job_skill_names:
            match = {
                "skill": resume_skill["name"],
                "in_resume": True,
                "in_job_description": False,
                "match_score": 0.5  # Partially valuable but not in job description
            }
            skill_matches.append(match)
    
    return skill_matches

def calculate_overall_score(skill_matches: List[Dict[str, Any]]) -> float:
    """
    Calculate overall match score based on skill matches.
    
    Args:
        skill_matches: List of skill matches
        
    Returns:
        Overall match score between 0 and 1
    """
    # Only count skills in the job description for the overall score
    job_skills = [match for match in skill_matches if match.get("in_job_description", False)]
    
    if not job_skills:
        return 0.0
    
    # Calculate the average match score for job skills
    try:
        total_score = sum(match.get("match_score", 0.0) for match in job_skills)
        return total_score / len(job_skills)
    except (TypeError, ZeroDivisionError):
        return 0.0

def generate_feedback(resume_text: str, job_description: str, skill_matches: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generate feedback for a resume based on job description and skill matches.
    
    Args:
        resume_text: Text content of the resume
        job_description: Text content of the job description
        skill_matches: List of skill matches
        
    Returns:
        Dictionary containing feedback, strengths, and areas for improvement
    """
    # Prepare skill match summary for the prompt
    try:
        matched_skills = [match["skill"] for match in skill_matches 
                         if match.get("in_resume", False) and match.get("in_job_description", False)]
        missing_skills = [match["skill"] for match in skill_matches 
                         if not match.get("in_resume", False) and match.get("in_job_description", False)]
        extra_skills = [match["skill"] for match in skill_matches 
                        if match.get("in_resume", False) and not match.get("in_job_description", False)]
    except (KeyError, TypeError):
        # Fallback in case skill_matches has unexpected format
        matched_skills = []
        missing_skills = []
        extra_skills = []
    
    prompt = f"""
    Analyze this resume against the job description and provide constructive feedback.
    
    Resume:
    {resume_text}
    
    Job Description:
    {job_description}
    
    Skills that match the job description:
    {', '.join(matched_skills) if matched_skills else 'None'}
    
    Skills in the job description but missing from the resume:
    {', '.join(missing_skills) if missing_skills else 'None'}
    
    Additional skills in the resume not mentioned in the job description:
    {', '.join(extra_skills) if extra_skills else 'None'}
    
    Please provide:
    1. A paragraph of overall feedback on how well the resume matches the job description
    2. 3-5 key strengths of this candidate for this specific role
    3. 2-4 areas where the candidate could improve their resume to better match this job
    
    Return the results as a JSON object with the following structure:
    {{
        "feedback": "overall feedback paragraph",
        "strengths": ["strength 1", "strength 2", ...],
        "improvement_areas": ["area 1", "area 2", ...]
    }}
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that provides constructive feedback on resumes."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        
        # Parse the response
        content = response.choices[0].message.content
        result = json.loads(content)
        return result
    except (json.JSONDecodeError, Exception) as e:
        # Fallback in case of any errors
        print(f"Error generating feedback: {str(e)}")
        return {
            "feedback": "Unable to generate feedback at this time.",
            "strengths": [],
            "improvement_areas": []
        } 