from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ProfileBase(BaseModel):
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    current_role: Optional[str] = None
    career_goal: Optional[str] = None

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class EducationBase(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None

class EducationResponse(EducationBase):
    id: int

    class Config:
        from_attributes = True

class ExperienceBase(BaseModel):
    company: str
    position: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None

class ExperienceResponse(ExperienceBase):
    id: int

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    link: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: int

    class Config:
        from_attributes = True

class SkillBase(BaseModel):
    name: str
    level: Optional[str] = None

class SkillResponse(SkillBase):
    id: int

    class Config:
        from_attributes = True

class CertificationBase(BaseModel):
    name: str
    issuer: Optional[str] = None
    date: Optional[str] = None

class CertificationResponse(CertificationBase):
    id: int

    class Config:
        from_attributes = True

class ResumeBase(BaseModel):
    title: str

class ResumeCreate(ResumeBase):
    pass

class ResumeUpdate(ResumeBase):
    pass

class ResumeFullResponse(ResumeBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    educations: list[EducationResponse] = []
    experiences: list[ExperienceResponse] = []
    projects: list[ProjectResponse] = []
    skills: list[SkillResponse] = []
    certifications: list[CertificationResponse] = []

    class Config:
        from_attributes = True

class InterviewStartRequest(BaseModel):
    job_role: str
    job_description: Optional[str] = None

class InterviewAnswerRequest(BaseModel):
    answer_text: str

class InterviewAnswerResponse(BaseModel):
    id: int
    question_id: int
    answer_text: str
    score: Optional[int] = None
    feedback: Optional[str] = None

    class Config:
        from_attributes = True

class InterviewQuestionResponse(BaseModel):
    id: int
    session_id: int
    question_text: str
    question_order: int
    is_answered: bool
    answer: Optional[InterviewAnswerResponse] = None

    class Config:
        from_attributes = True

class InterviewSessionResponse(BaseModel):
    id: int
    user_id: int
    job_role: str
    created_at: datetime
    is_completed: bool
    overall_score: Optional[int] = None
    questions: list[InterviewQuestionResponse] = []

    class Config:
        from_attributes = True
