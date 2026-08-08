import firebase_admin
from firebase_admin import credentials, firestore
from config import settings
import os

import json

# Initialize Firebase Admin
if not firebase_admin._apps:
    cred_var = settings.FIREBASE_CREDENTIALS_PATH or settings.GOOGLE_APPLICATION_CREDENTIALS
    
    if cred_var:
        if os.path.exists(cred_var):
            # It's a file path
            cred = credentials.Certificate(cred_var)
        else:
            # It might be a raw JSON string from Vercel Environment Variables
            try:
                cred_dict = json.loads(cred_var)
                cred = credentials.Certificate(cred_dict)
            except Exception as e:
                raise ValueError("Invalid Firebase credentials: not a valid file path or JSON string.")
        
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
