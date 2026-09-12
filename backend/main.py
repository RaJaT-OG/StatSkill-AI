import os
import re
import json
import hashlib
import random
import time
from pathlib import Path
from typing import Any

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader
from google import genai
from google.genai import types

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / ".env")
except ImportError:
    pass

app = FastAPI(title="StatSkill AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------
# Gemini configuration
# -------------------------------------------------------------------

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY is not set. Quiz generation will not work.")

gemini_client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

# -------------------------------------------------------------------
# Local quiz history
# -------------------------------------------------------------------

QUIZ_DIR = Path(__file__).parent / ".quiz_cache"
QUIZ_DIR.mkdir(exist_ok=True)


def _pdf_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8", errors="ignore")).hexdigest()[:24]


def _history_path(pdf_id: str) -> Path:
    return QUIZ_DIR / f"{pdf_id}_history.json"


def _load_history(pdf_id: str) -> list[str]:
    path = _history_path(pdf_id)
    if not path.exists():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except Exception:
        return []


def _save_history(pdf_id: str, questions: list[str]) -> None:
    # Keep a reasonably small history so old questions can eventually return.
    questions = questions[-40:]
    _history_path(pdf_id).write_text(
        json.dumps(questions, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


# -------------------------------------------------------------------
# General models / endpoints
# -------------------------------------------------------------------

class Profile(BaseModel):
    name: str = ""
    employee_id: str = ""
    designation: str = ""
    department: str = ""
    role: str = ""
    assignment: str = ""
    education: str = ""
    experience: str = ""
    trainings: str = ""


class CompetencyAssessment(BaseModel):
    python: float = 0
    r: float = 0
    sql: float = 0
    statistics: float = 0
    data_visualization: float = 0
    ai_ml: float = 0


class RecommendationRequest(BaseModel):
    assessment: CompetencyAssessment
    profile: Profile = Profile()


class LearningPlanRequest(BaseModel):
    assessment: CompetencyAssessment
    profile: Profile = Profile()


COURSE_MAP = {
    "python": "Python for Data Analysis",
    "r": "R Programming Fundamentals",
    "sql": "SQL for Data Management",
    "statistics": "Statistics for Official Data Analysis",
    "data_visualization": "Data Visualization Fundamentals",
    "ai_ml": "Introduction to Artificial Intelligence and Machine Learning",
}

NSSTA_MAP = {
    "python": "Advanced Python for Statistical Computing",
    "r": "Advanced R for Official Statistics",
    "sql": "SQL and Database Management for Official Data",
    "statistics": "Advanced Statistics for Official Data Analysis",
    "data_visualization": "Data Visualization and Statistical Communication",
    "ai_ml": "Applied AI/ML for Official Statistics",
}

SKILL_LABELS = {
    "python": "Python",
    "r": "R",
    "sql": "SQL",
    "statistics": "Statistics",
    "data_visualization": "Data Visualization",
    "ai_ml": "AI / Machine Learning",
}


@app.get("/")
def root():
    return {"message": "StatSkill AI backend is running"}


@app.post("/employee/profile")
def save_profile(profile: Profile):
    return {"message": "Profile saved", "profile": profile.model_dump()}


@app.post("/assessment")
def save_assessment(assessment: CompetencyAssessment):
    values = assessment.model_dump()
    overall = round(sum(values.values()) / len(values), 2)
    return {
        "message": "Assessment saved",
        "assessment": values,
        "overall_score": overall,
    }


@app.post("/skill-gap")
def skill_gap(assessment: CompetencyAssessment):
    values = assessment.model_dump()
    gaps = []

    for skill, score in values.items():
        if score < 60:
            priority = "High" if score < 40 else "Medium"
            gaps.append({
                "skill": skill,
                "label": SKILL_LABELS[skill],
                "score": score,
                "priority": priority,
                "gap": round(60 - score, 2),
            })

    gaps.sort(key=lambda x: x["score"])
    return {"skill_gaps": gaps}


@app.post("/recommendations")
def recommendations(request: RecommendationRequest):
    values = request.assessment.model_dump()
    profile = request.profile
    recommendations_list = []

    role_context = ""
    if profile.role or profile.designation or profile.assignment or profile.department:
        role_context = (
            f" Considering the employee's role ({profile.role or 'not specified'}), "
            f"designation ({profile.designation or 'not specified'}), assignment "
            f"({profile.assignment or 'not specified'}), and department "
            f"({profile.department or 'not specified'}), this learning path is "
            "prioritized for practical job relevance."
        )

    for skill, score in sorted(values.items(), key=lambda item: item[1]):
        if score < 60:
            recommendations_list.append({
                "skill": skill,
                "label": SKILL_LABELS[skill],
                "score": score,
                "priority": "High" if score < 40 else "Medium",
                "course": COURSE_MAP[skill],
                "platform": "iGOT Karmayogi",
                "nssta_training": NSSTA_MAP[skill],
                "reason": (
                    f"Your current {SKILL_LABELS[skill]} score is {score}. "
                    "Strengthening this area can improve your overall competency."
                    + role_context
                ),
            })

    return {"recommendations": recommendations_list}


LEARNING_PLAN_SCHEMA = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "summary": {"type": "string"},
        "weeks": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "week": {"type": "integer"},
                    "focus": {"type": "string"},
                    "activities": {"type": "array", "items": {"type": "string"}},
                    "resources": {"type": "array", "items": {"type": "string"}},
                    "outcome": {"type": "string"}
                },
                "required": ["week", "focus", "activities", "resources", "outcome"]
            }
        }
    },
    "required": ["title", "summary", "weeks"]
}


@app.post("/learning-plan")
def learning_plan(request: LearningPlanRequest):
    if gemini_client is None:
        raise HTTPException(status_code=500, detail="Gemini API key is not configured. Set GEMINI_API_KEY and restart the backend.")

    scores = request.assessment.model_dump()
    weakest = sorted(scores.items(), key=lambda item: item[1])[:3]
    weak_text = ", ".join(f"{SKILL_LABELS[k]} ({v}/100)" for k, v in weakest)
    p = request.profile

    prompt = f"""Create a practical 4-week personalized learning plan for an employee in India's official statistical system.
Use the assessment and profile below. Prioritize the weakest skills, make activities realistic for a working professional, and connect resources to iGOT Karmayogi and NSSTA/TPAC where appropriate. Do not invent specific course URLs.

PROFILE:
Role: {p.role}
Designation: {p.designation}
Department: {p.department}
Assignment: {p.assignment}
Experience: {p.experience}

ASSESSMENT:
{json.dumps(scores)}

WEAKEST AREAS:
{weak_text}

Return exactly 4 weekly stages."""

    try:
        response = gemini_client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=LEARNING_PLAN_SCHEMA,
                thinking_config=types.ThinkingConfig(thinking_level="minimal"),
            ),
        )
        data = json.loads(response.text)
        return {"plan": data}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI learning plan generation failed: {exc}")


# -------------------------------------------------------------------
# PDF extraction
# -------------------------------------------------------------------

def extract_pdf_text(file_bytes: bytes) -> str:
    try:
        import io
        reader = PdfReader(io.BytesIO(file_bytes))
        pages = []

        for page in reader.pages:
            text = page.extract_text() or ""
            if text.strip():
                pages.append(text)

        text = "\n\n".join(pages).strip()

        if not text:
            raise HTTPException(
                status_code=400,
                detail="The PDF does not contain readable text."
            )

        return text

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Could not read the PDF: {exc}"
        )


def clean_pdf_text(text: str, max_chars: int = 40000) -> str:
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\b\d{1,3}:\d{2}\b", " ", text)
    text = text.strip()

    # Keep the prompt manageable while preserving the beginning and end.
    if len(text) > max_chars:
        half = max_chars // 2
        text = text[:half] + "\n\n[...middle omitted...]\n\n" + text[-half:]

    return text


# -------------------------------------------------------------------
# Gemini MCQ generation
# -------------------------------------------------------------------

QUIZ_SCHEMA = {
    "type": "object",
    "properties": {
        "topic": {
            "type": "string",
            "description": "A concise 2-6 word topic describing the main subject of the uploaded learning material."
        },
        "questions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "question": {
                        "type": "string",
                        "description": "A complete, natural multiple-choice question."
                    },
                    "options": {
                        "type": "array",
                        "items": {"type": "string"},
                        "minItems": 4,
                        "maxItems": 4,
                        "description": "Exactly four plausible answer choices."
                    },
                    "correct_index": {
                        "type": "integer",
                        "description": "Zero-based index of the correct option."
                    },
                    "explanation": {
                        "type": "string",
                        "description": "A short explanation of why the answer is correct."
                    }
                },
                "required": [
                    "question",
                    "options",
                    "correct_index",
                    "explanation"
                ]
            }
        }
    },
    "required": ["topic", "questions"]
}


def normalize_question(question: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", question.lower()).strip()


def validate_questions(raw: Any, requested: int) -> list[dict]:
    if not isinstance(raw, dict):
        return []

    items = raw.get("questions", [])
    if not isinstance(items, list):
        return []

    valid = []
    seen = set()

    for item in items:
        if not isinstance(item, dict):
            continue

        question = str(item.get("question", "")).strip()
        options = item.get("options")
        explanation = str(item.get("explanation", "")).strip()

        try:
            correct_index = int(item.get("correct_index"))
        except (TypeError, ValueError):
            continue

        if not question or not isinstance(options, list) or len(options) != 4:
            continue

        options = [str(x).strip() for x in options]

        if any(not x for x in options):
            continue

        if len({x.lower() for x in options}) != 4:
            continue

        if correct_index not in range(4):
            continue

        key = normalize_question(question)

        if len(key.split()) < 5 or key in seen:
            continue

        seen.add(key)

        valid.append({
            "question": question,
            "options": options,
            "correct_index": correct_index,
            # The React quiz compares the selected option text with
            # question.answer, so expose the actual correct option text too.
            "answer": options[correct_index],
            "explanation": explanation,
        })

        if len(valid) >= requested:
            break

    return valid


def generate_gemini_quiz(
    source_text: str, requested: int, previously_used: list[str]
) -> list[dict]:
    if gemini_client is None:
        raise HTTPException(status_code=500, detail="Gemini API key is not configured. Set GEMINI_API_KEY and restart the backend.")

    collected = []
    used = list(previously_used)
    detected_topic = "Learning Material"

    for attempt in range(3):
        needed = requested - len(collected)
        if needed <= 0:
            break
        recent = used[-25:]
        previous_text = ("\nDO NOT REUSE THESE QUESTIONS:\n" + "\n".join(f"- {q}" for q in recent)) if recent else ""
        prompt = f"""You are the question-generation engine for StatSkill AI.

Create EXACTLY {needed} high-quality multiple-choice questions from the learning material below.
Use ONLY information supported by the source. Write natural questions. Test different meaningful concepts. Avoid page numbers, timestamps, authors, slide numbers, or document metadata. Give exactly four plausible options, only one correct answer, and a short one-sentence explanation. Return EXACTLY {needed} questions.
{previous_text}

LEARNING MATERIAL:
------------------
{source_text}
------------------
"""
        try:
            response = gemini_client.models.generate_content(
                model=GEMINI_MODEL, contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json", response_schema=QUIZ_SCHEMA,
                    thinking_config=types.ThinkingConfig(thinking_level="minimal"),
                ),
            )
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"Gemini quiz generation failed: {exc}")
        try:
            data = json.loads(response.text)
        except Exception:
            continue
        detected_topic = str(data.get("topic") or detected_topic).strip()[:100] or detected_topic
        batch = validate_questions(data, needed)
        collected.extend(batch)
        used.extend(q["question"] for q in batch)

    if len(collected) != requested:
        raise HTTPException(status_code=502, detail=f"Gemini generated {len(collected)} reliable questions out of {requested}. Please try again.")
    return collected[:requested], detected_topic


@app.post("/generate-quiz")
async def generate_quiz(
    file: UploadFile = File(...),
    number_of_questions: int = Form(10),
):
    if number_of_questions not in (5, 10, 15):
        raise HTTPException(
            status_code=400,
            detail="number_of_questions must be 5, 10, or 15."
        )

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file."
        )

    file_bytes = await file.read()

    if not file_bytes:
        raise HTTPException(status_code=400, detail="The uploaded PDF is empty.")

    raw_text = extract_pdf_text(file_bytes)
    source_text = clean_pdf_text(raw_text)

    pdf_id = _pdf_hash(raw_text)
    previous_questions = _load_history(pdf_id)

    generation_started = time.perf_counter()
    questions, detected_topic = generate_gemini_quiz(
        source_text=source_text, requested=number_of_questions,
        previously_used=previous_questions,
    )
    generation_time_seconds = round(time.perf_counter() - generation_started, 2)

    # Store the question text so the next quiz request avoids recent repeats.
    updated_history = previous_questions + [q["question"] for q in questions]
    _save_history(pdf_id, updated_history)

    return {
        "questions": questions,
        "topic": detected_topic,
        "number_of_questions": len(questions),
        "file_name": file.filename,
        "source_id": pdf_id,
        "model": GEMINI_MODEL,
        "generation_time_seconds": generation_time_seconds,
    }
