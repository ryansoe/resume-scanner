import os
from pathlib import Path
from typing import Optional, List
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "Resume Scanner API"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # OpenAI settings
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    
    # MongoDB settings (optional)
    MONGODB_URL: Optional[str] = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "resume_scanner")
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://resume-scanner-frontend.vercel.app",  # Vercel default domain
        "https://resume-scanner-ryansoe.vercel.app",   # Your potential Vercel subdomain
    ]
    
    # Allow adding additional CORS origins from environment variable
    if os.getenv("ADDITIONAL_CORS_ORIGINS"):
        additional_origins = os.getenv("ADDITIONAL_CORS_ORIGINS").split(",")
        BACKEND_CORS_ORIGINS.extend([origin.strip() for origin in additional_origins])

settings = Settings() 