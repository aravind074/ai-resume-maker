from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
import PyPDF2
import io
from pydantic import BaseModel
from typing import Any
from api.deps import CurrentUser
from services import ats_service

router = APIRouter()

class ATSAnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/analyze")
def analyze_resume(
    request: ATSAnalyzeRequest
) -> Any:
    """
    Analyze a resume against a job description.
    """
    analysis_result = ats_service.analyze_resume_against_jd(
        request.resume_text, 
        request.job_description
    )
    return analysis_result

class ATSTailorRequest(BaseModel):
    resume_data: dict
    job_description: str

@router.post("/tailor")
def tailor_resume(
    request: ATSTailorRequest
) -> Any:
    """
    Tailor a resume against a job description.
    """
    tailored_result = ats_service.tailor_resume(
        request.resume_data, 
        request.job_description
    )
    return tailored_result

@router.post("/analyze-file")
async def analyze_uploaded_file(
    file: UploadFile = File(...),
    job_description: str = Form(...)
) -> Any:
    """
    Analyze an uploaded PDF resume against a job description.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    try:
        contents = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
            
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the PDF. It might be an image-based PDF.")
            
        analysis_result = ats_service.analyze_resume_against_jd(text, job_description)
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
