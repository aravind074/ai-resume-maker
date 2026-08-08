from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any, List
from datetime import datetime
import uuid
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
    user_id = current_user["id"]
    query = db.collection('resumes').where('user_id', '==', user_id).stream()
    
    resumes = []
    for doc in query:
        r_data = doc.to_dict()
        r_data["id"] = doc.id
        # Ensure default empty lists for subcomponents
        for key in ["educations", "experiences", "projects", "skills", "certifications"]:
            if key not in r_data:
                r_data[key] = []
        resumes.append(r_data)
        
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
    user_id = current_user["id"]
    resume_data = {
        "title": resume_in.title,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "educations": [],
        "experiences": [],
        "projects": [],
        "skills": [],
        "certifications": []
    }
    
    _, doc_ref = db.collection('resumes').add(resume_data)
    resume_data["id"] = doc_ref.id
    return resume_data

@router.get("/{resume_id}", response_model=schemas.ResumeFullResponse)
def get_resume(
    resume_id: str,
    db: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Get specific resume by ID.
    """
    doc_ref = db.collection('resumes').document(resume_id)
    doc = doc_ref.get()
    
    if not doc.exists or doc.to_dict().get("user_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    r_data = doc.to_dict()
    r_data["id"] = doc.id
    for key in ["educations", "experiences", "projects", "skills", "certifications"]:
        if key not in r_data:
            r_data[key] = []
    return r_data

@router.delete("/{resume_id}")
def delete_resume(
    resume_id: str,
    db: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Delete a resume.
    """
    doc_ref = db.collection('resumes').document(resume_id)
    doc = doc_ref.get()
    
    if not doc.exists or doc.to_dict().get("user_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    doc_ref.delete()
    return {"message": "Resume deleted successfully"}

@router.post("/{resume_id}/education", response_model=schemas.EducationResponse)
def add_education(
    resume_id: str,
    *,
    db: SessionDep,
    edu_in: schemas.EducationBase,
    current_user: CurrentUser,
) -> Any:
    doc_ref = db.collection('resumes').document(resume_id)
    doc = doc_ref.get()
    
    if not doc.exists or doc.to_dict().get("user_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    r_data = doc.to_dict()
    educations = r_data.get("educations", [])
    
    edu_item = edu_in.model_dump()
    edu_item["id"] = uuid.uuid4().hex
    
    educations.append(edu_item)
    doc_ref.update({
        "educations": educations,
        "updated_at": datetime.utcnow()
    })
    
    return edu_item
