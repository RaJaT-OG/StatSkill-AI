# StatSkill AI

## AI-Enabled Skill Intelligence and Learning Platform

StatSkill AI is a web-based learning and competency platform designed to help officials in the Official Statistical System identify skill gaps, receive personalized learning recommendations, and practice using AI-generated quizzes from their own learning material.

The platform combines competency assessment, skill-gap analysis, role-aware recommendations, PDF-based AI quiz generation, quiz performance tracking, and AI-generated learning plans in one application.

---

## Key Features

### 1. Employee Profile

Users can provide profile information such as:
- Role
- Designation
- Department
- Assignment

The profile information is used to personalize learning recommendations.

### 2. Competency Assessment

Users assess themselves across six skill areas:
- Python
- R
- SQL
- Statistics
- Data Visualization
- AI / Machine Learning

Scores are evaluated on a 0–100 scale.

### 3. Skill-Gap Analysis

The Results dashboard presents:
- Overall skill score
- Individual skill scores
- Strong and developing areas
- Priority focus areas
- Visual skill progress

Lower-scoring skills are highlighted as areas where focused learning can help.

### 4. Personalized Learning Recommendations

StatSkill AI recommends learning opportunities based on identified skill gaps.

Recommendations include:
- iGOT Karmayogi learning resources
- NSSTA / TPAC training
- Explanation of why a skill is recommended
- Role, designation, department, and assignment context

### 5. AI Learning Plan

Gemini generates a practical four-week learning plan using the user's skill gaps and profile information.

The plan can include:
- Weekly focus areas
- Learning activities
- Suggested resources
- Expected outcomes

### 6. AI Quiz from PDF

Users can upload PDF learning material and generate an AI-powered practice quiz.

Supported quiz sizes:
- 5 questions
- 10 questions
- 15 questions

The topic is detected automatically from the uploaded material; users do not need to manually select a skill.

### 7. Quiz Evaluation

After completing a quiz, the platform provides:
- Score
- Percentage
- Correct/incorrect evaluation
- Answer review
- Explanations
- Quiz performance evidence

Quiz performance can also be reflected on the Results dashboard.

### 8. Dark / Light Mode

The application supports:
- Light mode
- Dark mode
- Persistent theme preference across refreshes

### 9. Validation and Error Handling

The application handles common user and service errors, including:
- Missing profile information
- Invalid assessment scores
- Missing PDF uploads
- Non-PDF uploads
- Backend/API connection failures

---

## Technology Stack

### Frontend
- React
- Vite
- JavaScript / JSX
- CSS

### Backend
- Python
- FastAPI
- Uvicorn

### AI
- Google Gemini API
- `google-genai`

### Document Processing
- `pypdf`

### Environment Configuration
- `python-dotenv`

---

## Project Structure

```text
SIH Project3/
│
├── backend/
│   ├── .env
│   ├── .gitignore
│   ├── main.py
│   ├── requirements.txt
│   ├── venv/
│   ├── .quiz_cache/
│   └── __pycache__/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── ...
```

`venv`, `node_modules`, `.quiz_cache`, `__pycache__`, and `.env` are local/generated or secret files and should not be committed to Git.

---

## Prerequisites

Install the following before running the project:

- Python 3.x
- Node.js and npm
- Git
- A Google Gemini API key

---

## Clone the Repository

To get a local copy of StatSkill AI, clone the GitHub repository.

### 1. Clone the repository

Open a terminal and run:

```powershell
git clone https://github.com/RaJaT-OG/StatSkill-AI
```


### 2. Open the project folder

```powershell
cd StatSkill-AI
```

### 3. Open the project in VS Code

```powershell
code .
```

If the `code` command is not available, open the `StatSkill-AI` folder manually in VS Code.

### 4. Continue with the setup

After cloning the repository, follow the **Backend Setup** and **Frontend Setup** sections below.

---

## Backend Setup

Open a terminal in the backend directory:

```powershell
cd backend
```

Create the virtual environment if required:

```powershell
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

### Configure Gemini

Create:

```text
backend/.env
```

Add:

```env
GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY
GEMINI_MODEL=gemini-3.5-flash-lite
```

Never commit the real `.env` file or expose the API key publicly.

### Run the backend

```powershell
uvicorn main:app --reload
```

The backend runs locally on:

```text
http://127.0.0.1:8000
```

---

## Frontend Setup

Open a second terminal:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Run the development server:

```powershell
npm run dev
```

Vite will display the local frontend URL in the terminal.

---

## Running the Application

Run both services at the same time.

### Terminal 1 — Backend

```powershell
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```

### Terminal 2 — Frontend

```powershell
cd frontend
npm run dev
```

Then open the local frontend URL shown by Vite.

---

## Typical User Workflow

```text
Profile
   ↓
Assessment
   ↓
Results
   ├── Skill Profile
   ├── Skill Gaps
   ├── Personalized Recommendations
   ├── Role-Based Learning Guidance
   └── AI Learning Plan
          ↑
          │
AI Quiz ──┘
   ↓
Upload PDF
   ↓
Automatic Topic Detection
   ↓
Generate 5 / 10 / 15 Questions
   ↓
Complete Quiz
   ↓
Score + Answer Review
   ↓
Quiz Evidence in Results
```

---

## Security

- Store the Gemini API key only in `backend/.env`.
- `.env` is excluded through `.gitignore`.
- Never commit API keys to GitHub.
- Never paste the real API key into documentation, screenshots, or source code.
- Keep generated/cache files out of version control.

---

## Development Notes

The application runs as two local services:

1. FastAPI backend
2. React/Vite frontend

The frontend communicates with the backend through HTTP API endpoints.

For development, run both terminals at the same time.

---

## Current Testing Coverage

The main application flow has been tested for:

- Profile validation
- Assessment score validation
- PDF-only upload validation
- Missing PDF handling
- 5-question generation
- 10-question generation
- 15-question generation
- Quiz scoring
- Answer review
- Quiz evidence
- Profile/assessment/quiz persistence after refresh
- Backend recovery
- API connection failure handling
- AI learning-plan generation
- Dark/light theme
- Dark-mode readability
- End-to-end Profile → Assessment → Results → AI Quiz → Results flow

---

## Purpose

StatSkill AI aims to provide a focused, personalized learning experience by connecting competency assessment with actionable learning opportunities and AI-assisted practice.

The platform is designed around the broader objective of strengthening data and statistical capabilities through targeted learning, practice, and continuous skill development.
