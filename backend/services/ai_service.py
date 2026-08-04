import openai
from config import settings
from typing import Optional

# Initialize OpenAI client safely
client = openai.OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

def improve_bullet_point(bullet: str, role: str) -> str:
    """
    Improves a single resume bullet point using AI.
    """
    if not settings.OPENAI_API_KEY:
        return f"[AI Mock] Improved bullet for {role}: {bullet}"

    prompt = f"""
    You are an expert ATS resume writer and recruiter.
    I have a bullet point for a {role} position. 
    Rewrite it to be more impactful, using strong action verbs and quantifying results where possible.
    Keep it to one concise sentence.
    
    Original bullet point: {bullet}
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a professional resume writer."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"OpenAI Error: {e}")
        return bullet

def generate_professional_summary(role: str, years_experience: int, key_skills: str) -> str:
    """
    Generates a professional summary for the top of the resume.
    """
    if not settings.OPENAI_API_KEY:
        return f"[AI Mock] Professional summary for {role} with {years_experience} years of experience specializing in {key_skills}."

    prompt = f"""
    Write a highly compelling, ATS-optimized professional summary for a resume.
    Target Role: {role}
    Years of Experience: {years_experience}
    Key Skills: {key_skills}
    
    The summary should be 3-4 sentences long, highlighting core expertise, major achievements, and value proposition.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a professional resume writer."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"OpenAI Error: {e}")
        return "Could not generate summary at this time."
