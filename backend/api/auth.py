from datetime import timedelta, datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from backend import schemas
from backend.api.deps import SessionDep, CurrentUser
from backend.core.security import verify_password, get_password_hash, create_access_token
from backend.config import settings

router = APIRouter()

@router.post("/register", response_model=schemas.UserResponse)
def register(*, db: SessionDep, user_in: schemas.UserCreate) -> Any:
    """
    Register a new user.
    """
    users_ref = db.collection('users')
    query = users_ref.where('email', '==', user_in.email).limit(1).stream()
    if any(True for _ in query):
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    hashed_password = get_password_hash(user_in.password)
    user_data = {
        "email": user_in.email,
        "hashed_password": hashed_password,
        "full_name": user_in.full_name,
        "is_active": True,
        "is_superuser": False,
        "created_at": datetime.utcnow()
    }
    
    _, user_ref = users_ref.add(user_data)
    
    # Auto-create empty profile
    profile_data = {
        "user_id": user_ref.id,
    }
    db.collection('profiles').add(profile_data)
    
    user_data["id"] = user_ref.id
    return user_data

@router.post("/login")
def login(
    db: SessionDep, form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    query = db.collection('users').where('email', '==', form_data.username).limit(1).stream()
    docs = list(query)
    
    if not docs:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    user_doc = docs[0]
    user_data = user_doc.to_dict()
    
    if not verify_password(form_data.password, user_data.get("hashed_password")):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user_data.get("is_active", True):
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user_doc.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.get("/me", response_model=schemas.UserResponse)
def read_current_user(current_user: CurrentUser) -> Any:
    """
    Get current user details.
    """
    return current_user
