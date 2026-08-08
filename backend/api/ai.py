from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Any
from backend.api.deps import CurrentUser
from backend.services import ai_service

router = APIRouter()

class BulletImproveRequest(BaseModel):
    bullet: str
    role: str

class SummaryGenerateRequest(BaseModel):
    role: str
    years_experience: int
    key_skills: str

@router.post("/improve-bullet")
def improve_bullet(
    request: BulletImproveRequest,
    current_user: CurrentUser
) -> Any:
    """
    Improve a resume bullet point using AI.
    """
    improved = ai_service.improve_bullet_point(request.bullet, request.role)
    return {"improved_bullet": improved}

@router.post("/generate-summary")
def generate_summary(
    request: SummaryGenerateRequest,
    current_user: CurrentUser
) -> Any:
    """
    Generate a professional summary using AI.
    """
    summary = ai_service.generate_professional_summary(
        request.role, 
        request.years_experience, 
        request.key_skills
    )
    return {"summary": summary}
