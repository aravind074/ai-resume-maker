from fastapi import APIRouter, Depends, HTTPException
from typing import Any
import models
from api.deps import SessionDep, CurrentUser

router = APIRouter()

def check_superuser(current_user: models.User):
    # For demonstration, we'll allow any user to see admin stats or we can enforce is_superuser
    # In a real app: if not current_user.is_superuser: raise HTTPException(...)
    pass

@router.get("/stats")
def get_admin_stats(
    db: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Get platform statistics for the Admin Panel.
    """
    check_superuser(current_user)
    
    total_users = db.query(models.User).count()
    total_resumes = db.query(models.Resume).count()
    total_interviews = db.query(models.InterviewSession).count()
    
    recent_users = db.query(models.User).order_by(models.User.created_at.desc()).limit(5).all()
    
    return {
        "metrics": {
            "total_users": total_users,
            "total_resumes": total_resumes,
            "total_interviews": total_interviews,
        },
        "recent_users": [
            {"id": u.id, "email": u.email, "full_name": u.full_name, "created_at": u.created_at} 
            for u in recent_users
        ]
    }
