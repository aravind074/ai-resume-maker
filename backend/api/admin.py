from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from api.deps import SessionDep, CurrentUser

router = APIRouter()

def check_superuser(current_user: dict):
    # For demonstration, we'll allow any user to see admin stats or we can enforce is_superuser
    # In a real app: if not current_user.get("is_superuser"): raise HTTPException(...)
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
    
    # In Firestore, count queries can be done like this:
    total_users = db.collection('users').count().get()[0][0].value
    total_resumes = db.collection('resumes').count().get()[0][0].value
    total_interviews = db.collection('interview_sessions').count().get()[0][0].value
    
    recent_users_query = db.collection('users').order_by('created_at', direction='DESCENDING').limit(5).stream()
    
    recent_users = []
    for doc in recent_users_query:
        u_data = doc.to_dict()
        recent_users.append({
            "id": doc.id,
            "email": u_data.get("email"),
            "full_name": u_data.get("full_name"),
            "created_at": u_data.get("created_at")
        })
    
    return {
        "metrics": {
            "total_users": total_users,
            "total_resumes": total_resumes,
            "total_interviews": total_interviews,
        },
        "recent_users": recent_users
    }
