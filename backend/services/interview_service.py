import openai
from config import settings

client = openai.OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

def generate_interview_questions(job_role: str, job_description: str = "", count: int = 5) -> list[str]:
    """
    Generates a list of interview questions based on the role and JD.
    """
    if not settings.OPENAI_API_KEY:
        return [
            f"Tell me about a time you faced a challenge as a {job_role}.",
            "What are your greatest strengths and weaknesses?",
            "How do you handle tight deadlines?",
            "Can you describe a successful project you led?",
            "Why do you want to work here?"
        ]

    prompt = f"""
    You are an expert technical interviewer.
    Generate exactly {count} interview questions for a candidate applying for the role of '{job_role}'.
    Job Description context (if any):
    {job_description}
    
    Return ONLY a list of questions, one per line. Do not number them. Do not include any other text.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a professional interviewer."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )
        content = response.choices[0].message.content.strip()
        questions = [q.strip("- \t1234567890.") for q in content.split('\n') if q.strip()]
        return questions[:count]
    except Exception as e:
        print(f"OpenAI Interview Error: {e}")
        return ["Can you tell me about your background?"]

def evaluate_interview_answer(question: str, answer: str) -> dict:
    """
    Evaluates an interview answer using GPT-4o.
    """
    if not settings.OPENAI_API_KEY:
        return {
            "score": 85,
            "feedback": "[AI Mock Feedback] Good answer, try to use the STAR method next time."
        }
        
    prompt = f"""
    You are an expert interviewer. Evaluate the candidate's answer to the question.
    
    Question: {question}
    Answer: {answer}
    
    Provide a score out of 100 and a brief constructive feedback (1-2 sentences).
    Return ONLY JSON with this structure:
    {{
      "score": int,
      "feedback": "string"
    }}
    """
    
    try:
        import json
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a professional interviewer API."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" },
            max_tokens=150,
            temperature=0.3
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"OpenAI Evaluate Error: {e}")
        return {"score": 0, "feedback": "Evaluation failed."}
