"""AI task-chain generator.

A mentor uploads one or more PDFs (a real-world problem brief, lecture notes,
a rubric...). We extract the text, ask Google Gemini to turn it into a
structured, ordered task chain, and return a JSON draft the mentor can edit
before publishing. Everything degrades gracefully: if there's no API key, the
PDF can't be read, or the model misbehaves, we fall back to a sensible template
so the demo never hard-fails.
"""
import os
import io
import json
import requests

from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response

from mentors.models import MentorProfile
from .models import TaskChain, Task
from .serializers import TaskChainDetailSerializer

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-flash-latest:generateContent"
)

OUTPUT_TYPES = {"text", "file", "image", "github_url", "live_url", "code"}
MAX_PDF_CHARS = 8000  # cap text sent to the model to control latency/cost


# --------------------------------------------------------------------------- #
# PDF text extraction
# --------------------------------------------------------------------------- #
def _extract_pdf_text(uploaded_files) -> str:
    """Best-effort text extraction from uploaded PDFs (digital, not scanned)."""
    try:
        from pypdf import PdfReader
    except Exception:
        return ""

    chunks = []
    for f in uploaded_files:
        try:
            reader = PdfReader(io.BytesIO(f.read()))
            for page in reader.pages:
                chunks.append(page.extract_text() or "")
        except Exception:
            continue
        finally:
            try:
                f.seek(0)
            except Exception:
                pass
    return "\n".join(chunks).strip()


# --------------------------------------------------------------------------- #
# Gemini call
# --------------------------------------------------------------------------- #
def _ask_gemini(brief: str, skill: str, level: str):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    types = ", ".join(sorted(OUTPUT_TYPES))
    prompt = (
        "You are LearnBeyond's curriculum designer. A mentor wants to turn the "
        "material below into a hands-on, project-based TASK CHAIN for a student "
        f"learning '{skill}' at '{level}' level.\n\n"
        "Break the work into 3-6 sequential tasks that build on each other. "
        "For EACH task provide: a short title, a clear description of the "
        "deliverable, the single most appropriate expected_output_type from "
        f"[{types}], a list of 2-4 'learning_topics' (concepts the student must "
        "learn or cover to finish the task), and 1-3 practical 'hints'.\n\n"
        "Respond with STRICT JSON only, no markdown, in exactly this shape:\n"
        '{"title": "...", "description": "...", "skill": "%s", "level": "%s", '
        '"tasks": [{"title": "...", "description": "...", '
        '"expected_output_type": "code", "learning_topics": ["..."], '
        '"hints": ["..."]}]}\n\n'
        "MATERIAL:\n\"\"\"\n%s\n\"\"\""
    ) % (skill, level, brief[:MAX_PDF_CHARS])

    try:
        resp = requests.post(
            GEMINI_URL,
            headers={"Content-Type": "application/json", "X-goog-api-key": api_key},
            json={"contents": [{"parts": [{"text": prompt}]}]},
            timeout=25,
        )
        resp.raise_for_status()
        text = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        text = (
            text.strip()
            .removeprefix("```json")
            .removeprefix("```")
            .removesuffix("```")
            .strip()
        )
        return json.loads(text)
    except Exception:
        return None


def _fallback_draft(brief: str, skill: str, level: str, title_hint: str):
    """Offline template used when AI is unavailable or fails."""
    topic = (title_hint or skill or "the assigned problem").strip()
    return {
        "title": title_hint or f"{skill.replace('_', ' ').title()} Practical Challenge",
        "description": (
            f"A hands-on {level} challenge covering {topic}. Work through each "
            "stage and submit your deliverable for mentor review."
        ),
        "skill": skill,
        "level": level,
        "tasks": [
            {
                "title": "Understand the problem & plan",
                "description": (
                    "Read the brief carefully and write a short plan describing "
                    "how you'll approach the solution."
                ),
                "expected_output_type": "text",
                "learning_topics": ["Requirement analysis", "Planning"],
                "hints": ["List your assumptions", "Break the work into steps"],
            },
            {
                "title": "Build the core solution",
                "description": "Implement the main part of the deliverable.",
                "expected_output_type": "code",
                "learning_topics": ["Core implementation", "Best practices"],
                "hints": ["Keep it simple first, then refine"],
            },
            {
                "title": "Show your result",
                "description": (
                    "Upload a screenshot or file showing your finished work."
                ),
                "expected_output_type": "image",
                "learning_topics": ["Presentation", "Verification"],
                "hints": ["Make sure the output is clearly visible"],
            },
        ],
    }


def _normalize(draft: dict, skill: str, level: str, title_hint: str) -> dict:
    """Coerce the model output into a safe, predictable shape."""
    if not isinstance(draft, dict):
        return _fallback_draft("", skill, level, title_hint)

    tasks = draft.get("tasks")
    if not isinstance(tasks, list) or not tasks:
        return _fallback_draft("", skill, level, title_hint)

    clean_tasks = []
    for i, t in enumerate(tasks[:8], start=1):
        if not isinstance(t, dict):
            continue
        out_type = str(t.get("expected_output_type", "text")).strip()
        if out_type not in OUTPUT_TYPES:
            out_type = "text"
        topics = t.get("learning_topics") or []
        hints = t.get("hints") or []
        clean_tasks.append({
            "order_number": i,
            "title": str(t.get("title", f"Task {i}")).strip()[:200] or f"Task {i}",
            "description": str(t.get("description", "")).strip(),
            "expected_output_type": out_type,
            "learning_topics": [str(x).strip() for x in topics if str(x).strip()][:6],
            "hints": [str(x).strip() for x in hints if str(x).strip()][:5],
        })

    if not clean_tasks:
        return _fallback_draft("", skill, level, title_hint)

    return {
        "title": str(draft.get("title") or title_hint or "Untitled Chain").strip()[:200],
        "description": str(draft.get("description", "")).strip(),
        "skill": str(draft.get("skill") or skill).strip() or skill,
        "level": str(draft.get("level") or level).strip() or level,
        "tasks": clean_tasks,
    }


# --------------------------------------------------------------------------- #
# Endpoints
# --------------------------------------------------------------------------- #
@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def generate_chain_view(request):
    """Mentor uploads PDF(s) + hints → returns an editable AI-drafted chain."""
    if not hasattr(request.user, "mentor_profile"):
        return Response({"error": "Mentor only"}, status=403)

    skill = (request.data.get("skill") or "web_dev").strip()
    level = (request.data.get("level") or "beginner").strip()
    title_hint = (request.data.get("title") or "").strip()
    extra_notes = (request.data.get("notes") or "").strip()

    files = request.FILES.getlist("pdfs") or request.FILES.getlist("pdf")
    brief = _extract_pdf_text(files)
    if extra_notes:
        brief = f"{extra_notes}\n\n{brief}".strip()

    used_ai = False
    draft = None
    if brief:
        draft = _ask_gemini(brief, skill, level)
        used_ai = draft is not None

    if not draft:
        draft = _fallback_draft(brief, skill, level, title_hint)

    draft = _normalize(draft, skill, level, title_hint)
    return Response({
        "generated_by": "ai" if used_ai else "template",
        "pdf_text_found": bool(brief),
        "draft": draft,
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_chain_view(request):
    """Persist a (mentor-edited) chain + its tasks."""
    if not hasattr(request.user, "mentor_profile"):
        return Response({"error": "Mentor only"}, status=403)

    mentor: MentorProfile = request.user.mentor_profile
    data = request.data
    title = (data.get("title") or "").strip()
    tasks = data.get("tasks") or []

    if not title:
        return Response({"error": "Title is required"}, status=400)
    if not isinstance(tasks, list) or not tasks:
        return Response({"error": "At least one task is required"}, status=400)

    chain = TaskChain.objects.create(
        mentor=mentor,
        skill=(data.get("skill") or "web_dev").strip(),
        level=(data.get("level") or "beginner").strip(),
        title=title,
        description=(data.get("description") or "").strip(),
        is_published=bool(data.get("is_published", True)),
    )

    for i, t in enumerate(tasks, start=1):
        out_type = str(t.get("expected_output_type", "text")).strip()
        if out_type not in OUTPUT_TYPES:
            out_type = "text"
        Task.objects.create(
            chain=chain,
            title=str(t.get("title", f"Task {i}")).strip()[:200] or f"Task {i}",
            description=str(t.get("description", "")).strip(),
            order_number=i,
            expected_output_type=out_type,
            learning_topics=[str(x).strip() for x in (t.get("learning_topics") or []) if str(x).strip()],
            hints=[str(x).strip() for x in (t.get("hints") or []) if str(x).strip()],
            video_url=str(t.get("video_url", "")).strip(),
        )

    return Response(
        TaskChainDetailSerializer(chain, context={"current_task_order": None}).data,
        status=201,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_chains_view(request):
    """List chains created by the logged-in mentor."""
    if not hasattr(request.user, "mentor_profile"):
        return Response({"error": "Mentor only"}, status=403)
    chains = TaskChain.objects.filter(mentor=request.user.mentor_profile)
    from .serializers import TaskChainListSerializer
    return Response(TaskChainListSerializer(chains, many=True).data)
