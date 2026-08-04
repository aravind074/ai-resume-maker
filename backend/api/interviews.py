from fastapi import APIRouter, Depends, HTTPException
from typing import Any
import models
import schemas
from api.deps import SessionDep, CurrentUser
from services import interview_service

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
    session = models.InterviewSession(
        user_id=current_user.id,
        job_role=request.job_role,
        job_description=request.job_description
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    questions = interview_service.generate_interview_questions(
        request.job_role, 
        request.job_description or "", 
        5
    )
    
    for i, q_text in enumerate(questions):
        q = models.InterviewQuestion(
            session_id=session.id,
            question_text=q_text,
            question_order=i+1
        )
        db.add(q)
    
    db.commit()
    db.refresh(session)
    return session

@router.get("/{session_id}", response_model=schemas.InterviewSessionResponse)
def get_session(
    session_id: int,
    db: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Get an interview session by ID.
    """
    session = db.query(models.InterviewSession).filter(
        models.InterviewSession.id == session_id,
        models.InterviewSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/questions/{question_id}/answer", response_model=schemas.InterviewAnswerResponse)
def submit_answer(
    question_id: int,
    *,
    db: SessionDep,
    request: schemas.InterviewAnswerRequest,
    current_user: CurrentUser,
) -> Any:
    """
    Submit an answer to a question and get feedback.
    """
    question = db.query(models.InterviewQuestion).join(models.InterviewSession).filter(
        models.InterviewQuestion.id == question_id,
        models.InterviewSession.user_id == current_user.id
    ).first()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    if question.is_answered:
        raise HTTPException(status_code=400, detail="Question already answered")
    
    evaluation = interview_service.evaluate_interview_answer(
        question.question_text, 
        request.answer_text
    )
    
    answer = models.InterviewAnswer(
        question_id=question.id,
        answer_text=request.answer_text,
        score=evaluation.get("score", 0),
        feedback=evaluation.get("feedback", "No feedback provided.")
    )
    db.add(answer)
    
    question.is_answered = True
    db.commit()
    db.refresh(answer)
    
    # Check if all questions in session are answered
    session = question.session
    all_answered = all(q.is_answered for q in session.questions)
    if all_answered:
        session.is_completed = True
        total_score = sum(q.answer.score for q in session.questions if q.answer)
        session.overall_score = total_score // len(session.questions)
        db.commit()
    
    return answer
