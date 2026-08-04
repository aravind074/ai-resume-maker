from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
import models
import schemas
from api.deps import SessionDep, CurrentUser
from core.security import verify_password, get_password_hash, create_access_token
from config import settings

router = APIRouter()

@router.post("/register", response_model=schemas.UserResponse)
def register(*, db: SessionDep, user_in: schemas.UserCreate) -> Any:
    """
    Register a new user.
    """
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    hashed_password = get_password_hash(user_in.password)
    db_user = models.User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Auto-create empty profile
    db_profile = models.Profile(user_id=db_user.id)
    db.add(db_profile)
    db.commit()
    
    return db_user

@router.post("/login")
def login(
    db: SessionDep, form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.get("/me", response_model=schemas.UserResponse)
def read_current_user(current_user: CurrentUser) -> Any:
    """
    Get current user details.
    """
    return current_user
