from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Resume Maker"
    API_V1_STR: str = "/api/v1"
    
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    
    # AI Services
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    
    # Firebase
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = None
    FIREBASE_CREDENTIALS_PATH: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore")

settings = Settings()
