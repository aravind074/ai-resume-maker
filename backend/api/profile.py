from fastapi import APIRouter, Depends, HTTPException
from typing import Any
import schemas
from api.deps import SessionDep, CurrentUser

router = APIRouter()

@router.get("", response_model=schemas.ProfileResponse)
def get_profile(
    db: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Get current user profile.
    """
    user_id = current_user["id"]
    query = db.collection('profiles').where('user_id', '==', user_id).limit(1).stream()
    docs = list(query)
    
    if not docs:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    profile_data = docs[0].to_dict()
    profile_data["id"] = docs[0].id
    return profile_data

@router.put("", response_model=schemas.ProfileResponse)
def update_profile(
    *,
    db: SessionDep,
    profile_in: schemas.ProfileUpdate,
    current_user: CurrentUser,
) -> Any:
    """
    Update current user profile.
    """
    user_id = current_user["id"]
    query = db.collection('profiles').where('user_id', '==', user_id).limit(1).stream()
    docs = list(query)
    
    update_data = profile_in.model_dump(exclude_unset=True)
    
    if not docs:
        # Create one if missing for some reason
        update_data["user_id"] = user_id
        _, doc_ref = db.collection('profiles').add(update_data)
        update_data["id"] = doc_ref.id
        return update_data
    
    doc_ref = docs[0].reference
    doc_ref.update(update_data)
    
    profile_data = doc_ref.get().to_dict()
    profile_data["id"] = doc_ref.id
    return profile_data
