"""AI onboarding assistant powered by Google Gemini (with a safe fallback)."""
import os
import json
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from mentors.models import MentorProfile
from mentors.serializers import MentorProfileSerializer

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-flash-latest:generateContent"
)

# Canonical skills we can recommend + friendly labels.
SKILL_LABELS = {
    "blockchain": "Blockchain / Web3 Development",
    "full_stack": "Full-Stack Web Development",
    "web_dev": "Web Development",
    "accounting": "Accounting",
    "business": "Business Analysis",
    "civil": "Civil Engineering",
    "agriculture": "Agriculture",
    "electrical": "Electrical Engineering",
    "finance": "Finance",
}


# Keyword hints for the offline fallback matcher.
KEYWORDS = {
    "blockchain": ["blockchain", "block chain", "web3", "web 3", "crypto", "cryptocurrency",
                   "smart contract", "solidity", "ethereum", "defi", "nft", "dapp", "bitcoin"],
    "full_stack": ["full stack", "full-stack", "fullstack", "react", "web dev", "web development",
                   "frontend", "backend", "javascript", "computer", "software", "mern"],

    "civil": ["civil", "structure", "construction", "surveying"],
    "agriculture": ["agri", "agriculture", "farming", "crop", "soil"],
    "electrical": ["electrical", "electronics", "circuit", "power"],
    "finance": ["finance", "financial", "investment", "banking", "stock"],
    "accounting": ["account", "accounting", "audit", "tax", "ledger"],
    "business": ["business", "management", "marketing", "analyst"],
}


def _match_skill_offline(text: str) -> str:
    text = (text or "").lower()
    for skill, words in KEYWORDS.items():
        if any(w in text for w in words):
            return skill
    return "full_stack"


def _ask_gemini(study_field: str, interests: str):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    skills = ", ".join(SKILL_LABELS.keys())
    prompt = (
        "You are LearnBeyond's friendly career mentor for students in Nepal. "
        f"A student is studying '{study_field}' and is interested in '{interests}'. "
        "Recommend ONE learning path for them. "
        f"Choose the single best matching skill key from this list: {skills}. "
        "Respond ONLY with strict JSON like "
        '{\"skill\": \"full_stack\", \"message\": \"<2-3 warm encouraging sentences that '
        'name the recommended path and why it fits them>\"}. No markdown, no extra text.'
    )
    try:
        resp = requests.post(
            GEMINI_URL,
            headers={"Content-Type": "application/json", "X-goog-api-key": api_key},
            json={"contents": [{"parts": [{"text": prompt}]}]},
            timeout=12,
        )
        resp.raise_for_status()
        text = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        text = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        data = json.loads(text)
        skill = data.get("skill", "").strip()
        if skill not in SKILL_LABELS:
            skill = _match_skill_offline(f"{study_field} {interests}")
        return {"skill": skill, "message": data.get("message", "").strip()}
    except Exception:
        return None


@api_view(["POST"])
@permission_classes([AllowAny])
def ai_onboard_view(request):
    study_field = request.data.get("study_field", "")
    interests = request.data.get("interests", "")

    result = _ask_gemini(study_field, interests)
    if not result:
        skill = _match_skill_offline(f"{study_field} {interests}")
        label = SKILL_LABELS[skill]
        result = {
            "skill": skill,
            "message": (
                f"Great choice! Based on your background in {study_field or 'your studies'} "
                f"and interest in {interests or 'this area'}, I recommend the "
                f"{label} path. It's hands-on and industry-verified — perfect for building "
                f"a job-ready portfolio."
            ),
        }

    skill = result["skill"]
    label = SKILL_LABELS.get(skill, skill.replace("_", " ").title())

    # Match mentors who teach this skill; fall back to any verified mentors.
    mentors = [m for m in MentorProfile.objects.filter(is_verified=True) if skill in (m.skills or [])]
    if not mentors:
        mentors = list(MentorProfile.objects.filter(is_verified=True)[:3])
    mentors = sorted(mentors, key=lambda m: m.rating, reverse=True)[:3]

    return Response({
        "message": result["message"],
        "recommended_skill": skill,
        "recommended_label": label,
        "mentors": MentorProfileSerializer(mentors, many=True).data,
    })
