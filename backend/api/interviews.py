from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from datetime import datetime
import schemas
from backend.api.deps import SessionDep, CurrentUser
from backend.services import interview_service

router = APIRouter()

@router.post("/start", response_model=schemas.InterviewSessionResponse)
def start_interview(
    *,
    db: SessionDep,
    request: schemas.InterviewStartRequest,
    current_user: CurrentUser,
) -> Any:
    """
    Start a new interview session and generate questions.
    """
    user_id = current_user["id"]
    
    session_data = {
        "user_id": user_id,
        "job_role": request.job_role,
        "job_description": request.job_description,
        "created_at": datetime.utcnow(),
        "is_completed": False,
        "overall_score": None
    }
    
    _, session_ref = db.collection('interview_sessions').add(session_data)
    session_data["id"] = session_ref.id
    
    questions_list = interview_service.generate_interview_questions(
        request.job_role, 
        request.job_description or "", 
        5
    )
    
    questions_resp = []
    for i, q_text in enumerate(questions_list):
        q_data = {
            "session_id": session_ref.id,
            "question_text": q_text,
            "question_order": i+1,
            "is_answered": False,
            "answer": None
        }
        _, q_ref = db.collection('interview_questions').add(q_data)
        q_data["id"] = q_ref.id
        questions_resp.append(q_data)
        
    session_data["questions"] = questions_resp
    return session_data

@router.get("/{session_id}", response_model=schemas.InterviewSessionResponse)
def get_session(
    session_id: str,
    db: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Get an interview session by ID.
    """
    doc_ref = db.collection('interview_sessions').document(session_id)
    doc = doc_ref.get()
    
    if not doc.exists or doc.to_dict().get("user_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Session not found")
        
    session_data = doc.to_dict()
    session_data["id"] = doc.id
    
    # Fetch questions
    q_query = db.collection('interview_questions').where('session_id', '==', session_id).stream()
    questions = []
    for q_doc in q_query:
        q_data = q_doc.to_dict()
        q_data["id"] = q_doc.id
        questions.append(q_data)
        
    # Sort by order
    questions.sort(key=lambda x: x["question_order"])
    session_data["questions"] = questions
    
    return session_data

@router.post("/questions/{question_id}/answer", response_model=schemas.InterviewAnswerResponse)
def submit_answer(
    question_id: str,
    *,
    db: SessionDep,
    request: schemas.InterviewAnswerRequest,
    current_user: CurrentUser,
) -> Any:
    """
    Submit an answer to a question and get feedback.
    """
    q_ref = db.collection('interview_questions').document(question_id)
    q_doc = q_ref.get()
    
    if not q_doc.exists:
        raise HTTPException(status_code=404, detail="Question not found")
        
    q_data = q_doc.to_dict()
    
    # Verify session belongs to user
    session_ref = db.collection('interview_sessions').document(q_data["session_id"])
    session_doc = session_ref.get()
    if not session_doc.exists or session_doc.to_dict().get("user_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Question not found")
        
    if q_data.get("is_answered"):
        raise HTTPException(status_code=400, detail="Question already answered")
        
    evaluation = interview_service.evaluate_interview_answer(
        q_data["question_text"], 
        request.answer_text
    )
    
    answer_data = {
        "id": "ans_" + question_id, # Mocking an ID since answer is nested in question
        "question_id": question_id,
        "answer_text": request.answer_text,
        "score": evaluation.get("score", 0),
        "feedback": evaluation.get("feedback", "No feedback provided.")
    }
    
    # Update question with answer
    q_ref.update({
        "is_answered": True,
        "answer": answer_data
    })
    
    # Check if all questions in session are answered
    q_query = db.collection('interview_questions').where('session_id', '==', q_data["session_id"]).stream()
    all_answered = True
    total_score = 0
    q_count = 0
    
    for doc in q_query:
        doc_data = doc.to_dict()
        q_count += 1
        # Include current question update
        if doc.id == question_id:
            total_score += answer_data["score"]
        else:
            if not doc_data.get("is_answered"):
                all_answered = False
            if doc_data.get("answer"):
                total_score += doc_data["answer"].get("score", 0)
                
    if all_answered and q_count > 0:
        session_ref.update({
            "is_completed": True,
            "overall_score": total_score // q_count
        })
        
    return answer_data
