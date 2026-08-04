from fastapi import APIRouter, Depends, HTTPException
from typing import Any
import models
import schemas
from api.deps import SessionDep, CurrentUser

router = APIRouter()

@router.get("/", response_model=schemas.ProfileResponse)
def get_profile(
    db: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Get current user profile.
    """
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/", response_model=schemas.ProfileResponse)
def update_profile(
    *,
    db: SessionDep,
    profile_in: schemas.ProfileUpdate,
    current_user: CurrentUser,
) -> Any:
    """
    Update current user profile.
    """
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        # Create one if missing for some reason
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
    
    update_data = profile_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    return profile
