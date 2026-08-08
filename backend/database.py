import firebase_admin
from firebase_admin import credentials, firestore
from config import settings
import os

# Initialize Firebase Admin
if not firebase_admin._apps:
    cred_path = settings.FIREBASE_CREDENTIALS_PATH or settings.GOOGLE_APPLICATION_CREDENTIALS
    
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        # Fallback to Application Default Credentials
        firebase_admin.initialize_app()

db = firestore.client()

def get_db():
    """
    Returns the Firestore database instance.
    For compatibility with FastAPI Depends.
    """
    yield db
