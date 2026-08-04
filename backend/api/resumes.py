from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any, List
import models
import schemas
from api.deps import SessionDep, CurrentUser

router = APIRouter()

@router.get("/", response_model=List[schemas.ResumeFullResponse])
def get_resumes(
    db: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Get all resumes for current user.
    """
    resumes = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).all()
    return resumes

@router.post("/", response_model=schemas.ResumeFullResponse)
def create_resume(
    *,
    db: SessionDep,
    resume_in: schemas.ResumeCreate,
    current_user: CurrentUser,
) -> Any:
    """
    Create new resume.
    """
    resume = models.Resume(
        title=resume_in.title,
        user_id=current_user.id
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume

@router.get("/{resume_id}", response_model=schemas.ResumeFullResponse)
def get_resume(
    resume_id: int,
    db: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Get specific resume by ID.
    """
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    db: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Delete a resume.
    """
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted successfully"}

# --- Subcomponents (Education, Experience, etc.) would be added here ---
# To save space in the initial scaffold, we provide basic endpoints for one subcomponent.
# Others follow the exact same pattern.

@router.post("/{resume_id}/education", response_model=schemas.EducationResponse)
def add_education(
    resume_id: int,
    *,
    db: SessionDep,
    edu_in: schemas.EducationBase,
    current_user: CurrentUser,
) -> Any:
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    edu = models.Education(**edu_in.model_dump(), resume_id=resume.id)
    db.add(edu)
    db.commit()
    db.refresh(edu)
    return edu
