# Project Requirements: ResumeMaker AI

## 1. Introduction
ResumeMaker AI is an AI-powered career platform featuring a drag-and-drop resume builder, real-time ATS scoring, and a dynamic interview coach. This document outlines the functional and non-functional requirements for the project.

## 2. Technical Stack
- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion, Zustand
- **Backend**: Python, FastAPI, SQLAlchemy, Alembic
- **Database**: PostgreSQL / SQLite (Configurable)
- **Authentication**: JWT (JSON Web Tokens) with OAuth2 password flow
- **AI Integration**: OpenAI (GPT-4o) / Gemini API

## 3. Functional Requirements

### 3.1 Authentication & User Management
- Users must be able to register an account using an email and password.
- Users must be able to log in and receive a JWT for authenticated requests.
- Users can manage their profiles and career goals.

### 3.2 AI Resume Builder
- Users can create, edit, and delete multiple resumes.
- Drag-and-drop builder interface for ordering sections (experience, education, skills, etc.).
- Real-time PDF rendering and live preview.
- AI-powered content enhancement: Users can ask GPT-4o to improve their bullet points.

### 3.3 ATS Analyzer
- Users can input a specific Job Description (JD).
- The system will analyze the user's resume against the provided JD.
- Provide a match score and actionable feedback.
- Suggest specific missing keywords that are relevant to the job.

### 3.4 AI Interview Coach
- Users can start a practice interview based on a specific role or their current resume.
- The system generates dynamic, role-specific questions.
- Users can type their answers and receive instant, constructive AI feedback.

## 4. Non-Functional Requirements
- **Performance**: API responses should be under 200ms on average (excluding AI API calls). Frontend rendering should be smooth, with dynamic transitions using Framer Motion.
- **Security**: Passwords must be securely hashed. All API endpoints must enforce authorization rules.
- **Scalability**: The backend must handle concurrent connections efficiently (FastAPI provides async support). Database queries should be optimized.
- **Maintainability**: The codebase should follow clean architecture. Frontend components should be reusable. Backend logic should be decoupled into services.

## 5. Deployment Setup
- The repository contains a `render.yaml` and `railway.toml` for standard PaaS deployments.
- Ensure the frontend connects to the backend properly using Next.js proxy rewrites in development and matching domains in production.
