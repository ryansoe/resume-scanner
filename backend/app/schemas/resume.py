from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class ResumeUploadResponse(BaseModel):
    filename: str
    status: str

class JobDescription(BaseModel):
    text: str

class Skill(BaseModel):
    name: str
    confidence: float

class SkillMatch(BaseModel):
    skill: str
    in_resume: bool
    in_job_description: bool
    match_score: float

class ResumeAnalysis(BaseModel):
    resume_id: str
    filename: str
    extracted_skills: List[Skill]
    job_skills: List[Skill]
    skill_matches: List[SkillMatch]
    overall_match_score: float
    feedback: str
    strengths: List[str]
    improvement_areas: List[str]

class ResumeRankingResponse(BaseModel):
    resumes: List[ResumeAnalysis] 