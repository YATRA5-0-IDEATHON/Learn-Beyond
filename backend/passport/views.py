from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from accounts.models import StudentProfile
from certifications.models import Certification
from certifications.serializers import CertificationSerializer
from submissions.models import Submission
from chains.models import Enrollment
from collaborations.models import Collaborator
from .models import SkillReport, StudyComment
from .serializers import SkillReportSerializer, StudyCommentSerializer


User = get_user_model()

RECOMMENDATION_LABEL = {"low": "Low", "medium": "Medium", "high": "High"}


def _portfolio_payload(user):
    """Assemble the full public portfolio for a student user."""
    profile = StudentProfile.objects.filter(user=user).first()
    certs = Certification.objects.filter(student=user, is_active=True).order_by("-issued_at")
    reports = SkillReport.objects.filter(student=user)
    comments = StudyComment.objects.filter(student=user)

    verified_tasks = Submission.objects.filter(student=user, status="approved").count()

    # Overall proficiency = average of graded skill areas (falls back to 0).
    if reports:
        overall = round(sum(r.grade_points for r in reports) / len(reports))
    else:
        overall = 0

    cert_data = CertificationSerializer(certs, many=True).data
    latest_cert = cert_data[0] if cert_data else None

    # Real paid-project collaborations this student has completed.
    paid_collabs = Collaborator.objects.filter(
        student=user, status="accepted", paid=True
    ).select_related("project")
    project_earnings = sum(c.net_earnings for c in paid_collabs)
    completed_projects = [
        {
            "title": c.project.title,
            "skill": c.project.skill,
            "role": c.role,
            "earnings": c.net_earnings,
        }
        for c in paid_collabs
    ]

    return {
        "name": user.name,
        "slug": profile.public_slug if profile else "",
        "headline": (profile.headline or profile.career_goal) if profile else "",
        "bio": profile.bio if profile else "",
        "location": profile.location if profile else "",
        "study_field": profile.current_study_field if profile else "",
        "career_goal": profile.career_goal if profile else "",
        "avatar_url": profile.avatar_url if profile else "",
        "linkedin_url": profile.linkedin_url if profile else "",
        "github_url": profile.github_url if profile else "",
        "mentor_recommendation": RECOMMENDATION_LABEL.get(
            profile.mentor_recommendation if profile else "", ""
        ),
        "verified_tasks": verified_tasks,
        "overall_proficiency": overall,
        "project_earnings": project_earnings,
        "completed_projects": completed_projects,
        "latest_certification": latest_cert,
        "certifications": cert_data,
        "skill_reports": SkillReportSerializer(reports, many=True).data,
        "study_comments": StudyCommentSerializer(comments, many=True).data,
    }


@api_view(["GET"])
@permission_classes([AllowAny])
def passport_view(request, user_id):
    """Legacy passport lookup by user UUID."""
    try:
        user = User.objects.get(id=user_id, role="student")
    except User.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)
    return Response(_portfolio_payload(user))


@api_view(["GET"])
@permission_classes([AllowAny])
def portfolio_by_slug_view(request, slug):
    """Public, shareable portfolio card by slug."""
    profile = StudentProfile.objects.filter(public_slug=slug).select_related("user").first()
    if not profile:
        return Response({"error": "Portfolio not found"}, status=404)
    return Response(_portfolio_payload(profile.user))


def _mentor_or_403(request):
    return getattr(request.user, "mentor_profile", None)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upsert_skill_report_view(request):
    """Mentor adds or updates a graded skill area for a student."""
    mentor = _mentor_or_403(request)
    if not mentor:
        return Response({"error": "Mentor only"}, status=403)

    student_id = request.data.get("student_id")
    skill_area = (request.data.get("skill_area") or "").strip()
    if not student_id or not skill_area:
        return Response({"error": "student_id and skill_area are required"}, status=400)

    try:
        student = User.objects.get(id=student_id, role="student")
    except User.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)

    report, _ = SkillReport.objects.update_or_create(
        student=student, skill_area=skill_area,
        defaults={
            "mentor": mentor,
            "grade": request.data.get("grade", "B"),
            "practical_hours": request.data.get("practical_hours", 0) or 0,
            "tasks_completed": request.data.get("tasks_completed", 0) or 0,
            "tasks_total": request.data.get("tasks_total", 0) or 0,
        },
    )
    return Response(SkillReportSerializer(report).data, status=201)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_study_comment_view(request):
    """Mentor logs a study-tracking comment on a student."""
    mentor = _mentor_or_403(request)
    if not mentor:
        return Response({"error": "Mentor only"}, status=403)

    student_id = request.data.get("student_id")
    text = (request.data.get("text") or "").strip()
    if not student_id or not text:
        return Response({"error": "student_id and text are required"}, status=400)

    try:
        student = User.objects.get(id=student_id, role="student")
    except User.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)

    comment = StudyComment.objects.create(student=student, mentor=mentor, text=text)
    return Response(StudyCommentSerializer(comment).data, status=201)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def set_recommendation_view(request):
    """Mentor sets a student's recommendation level and public headline."""
    mentor = _mentor_or_403(request)
    if not mentor:
        return Response({"error": "Mentor only"}, status=403)

    student_id = request.data.get("student_id")
    try:
        profile = StudentProfile.objects.get(user__id=student_id, user__role="student")
    except StudentProfile.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)

    rec = request.data.get("mentor_recommendation")
    if rec is not None:
        profile.mentor_recommendation = rec
    headline = request.data.get("headline")
    if headline is not None:
        profile.headline = headline
    profile.save()
    return Response({
        "mentor_recommendation": profile.mentor_recommendation,
        "headline": profile.headline,
        "slug": profile.public_slug,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mentor_students_view(request):
    """Students enrolled in this mentor's chains, with their current portfolio data."""
    mentor = _mentor_or_403(request)
    if not mentor:
        return Response({"error": "Mentor only"}, status=403)

    enrollments = Enrollment.objects.filter(
        chain__mentor=mentor
    ).select_related("student", "chain")

    seen = {}
    for e in enrollments:
        sid = str(e.student.id)
        if sid not in seen:
            profile = StudentProfile.objects.filter(user=e.student).first()
            seen[sid] = {
                "student_id": sid,
                "student_name": e.student.name,
                "slug": profile.public_slug if profile else "",
                "headline": (profile.headline if profile else "") or "",
                "mentor_recommendation": profile.mentor_recommendation if profile else "",
                "chains": [],
                "skill_reports": SkillReportSerializer(
                    SkillReport.objects.filter(student=e.student), many=True
                ).data,
                "study_comments": StudyCommentSerializer(
                    StudyComment.objects.filter(student=e.student), many=True
                ).data,
            }
        seen[sid]["chains"].append(e.chain.title)

    return Response(list(seen.values()))


