import json
import google.generativeai as genai
from config import settings

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

def analyze_resume_against_jd(resume_text: str, job_description: str) -> dict:
    """
    Analyzes a resume against a job description using Gemini and returns a JSON score.
    """
    if not settings.GEMINI_API_KEY:
        return {
            "overall_score": 75,
            "keyword_match_score": 80,
            "impact_score": 70,
            "feedback": ["Add more keywords from the job description.", "[AI Mock Data]"]
        }

    prompt = f"""
    You are an expert ATS (Applicant Tracking System).
    Analyze the provided Resume Text against the Job Description.
    Return ONLY a raw JSON object (without markdown code blocks) containing the following schema:
    {{
      "overall_score": integer (0-100),
      "keyword_match_score": integer (0-100),
      "impact_score": integer (0-100),
      "feedback": list of strings (actionable advice to improve the score)
    }}
    
    Job Description:
    {job_description}
    
    Resume Text:
    {resume_text}
    """
    
    try:
        model = genai.GenerativeModel('gemini-flash-latest', generation_config={"response_mime_type": "application/json"})
        response = model.generate_content(prompt)
        result = json.loads(response.text)
        return result
    except Exception as e:
        print(f"Gemini ATS Error: {e}")
        return {
            "overall_score": 0,
            "error": f"Gemini API Error: {str(e)}"
        }

def tailor_resume(resume_data: dict, job_description: str) -> dict:
    """
    Tailors a resume JSON based on a job description using Gemini.
    """
    if not settings.GEMINI_API_KEY:
        resume_data["summary"] = "[AI Mock] Tailored summary based on JD."
        return resume_data

    prompt = f"""
    You are an expert ATS resume writer.
    I will provide you with a Job Description and a Resume in JSON format.
    Your task is to tailor the Resume to match the Job Description.
    
    Guidelines:
    1. Rewrite the "summary" to strongly align with the job description.
    2. Rewrite "description" in "experience" and "projects" to emphasize relevant skills and achievements using strong action verbs.
    3. Do NOT invent new jobs, degrees, or fake experiences. Only enhance the existing ones.
    4. Keep the exact same JSON structure, just modify the text values.
    
    Job Description:
    {job_description}
    
    Original Resume JSON:
    {json.dumps(resume_data, indent=2)}
    
    Return ONLY the modified raw JSON object.
    """
    
    try:
        model = genai.GenerativeModel('gemini-flash-latest', generation_config={"response_mime_type": "application/json"})
        response = model.generate_content(prompt)
        result = json.loads(response.text)
        return result
    except Exception as e:
        print(f"Gemini Tailor Error: {e}")
        return resume_data
