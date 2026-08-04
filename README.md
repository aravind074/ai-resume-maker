# ResumeMaker AI

An AI-powered career platform featuring a drag-and-drop resume builder, real-time ATS scoring, and a dynamic interview coach. Built with Next.js and FastAPI.

## Features

- **AI Resume Builder**: Drag-and-drop builder with live PDF rendering. GPT-4o automatically enhances your bullet points.
- **ATS Analyzer**: Paste any Job Description. Our algorithm scores your resume and tells you exactly what keywords to add.
- **AI Interview Coach**: Practice answering dynamic, role-specific questions and receive instant constructive feedback.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion, Zustand
- **Backend**: Python, FastAPI, SQLAlchemy, Alembic

## Getting Started

### Prerequisites

- Node.js
- Python 3.8+
- PostgreSQL or SQLite (depending on your setup)

### Local Development

#### 1. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```
The frontend will be running at `http://localhost:3000`.

#### 2. Setup Backend

```bash
cd backend
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On Mac/Linux
# source venv/bin/activate

pip install -r requirements.txt # (if available, or install dependencies manually)
uvicorn main:app --reload
```
The backend API will be running at `http://127.0.0.1:8000`. You can view the API documentation at `http://127.0.0.1:8000/docs`.

## License

This project is open source and available under the MIT License.
