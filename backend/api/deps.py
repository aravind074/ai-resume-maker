from typing import Generator, Annotated, Any, Dict
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from google.cloud.firestore import Client
from database import get_db
from config import settings

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

SessionDep = Annotated[Client, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]

def get_current_user(db: SessionDep, token: TokenDep) -> Dict[str, Any]:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    
    user_doc = db.collection('users').document(user_id).get()
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = user_doc.to_dict()
    user["id"] = user_doc.id
    
    if not user.get("is_active", True):
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return user

CurrentUser = Annotated[Dict[str, Any], Depends(get_current_user)]
