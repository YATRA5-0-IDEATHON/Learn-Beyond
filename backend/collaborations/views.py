from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from chains.models import TaskChain
from certifications.models import Certification
from .models import Project, Collaborator, Contribution
from .serializers import (
    ProjectSerializer, CollaboratorSerializer, ContributionSerializer,
)

User = get_user_model()


def _mentor(request):
    return getattr(request.user, "mentor_profile", None)


# ---------------------------------------------------------------- Mentor side
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_project_view(request):
    mentor = _mentor(request)
    if not mentor:
        return Response({"error": "Mentor only"}, status=403)

    chain = None
    chain_id = request.data.get("chain")
    if chain_id:
        chain = TaskChain.objects.filter(id=chain_id, mentor=mentor).first()

    project = Project.objects.create(
        mentor=mentor,
        chain=chain,
        skill=request.data.get("skill", chain.skill if chain else ""),
        title=request.data.get("title", "Untitled Project"),
        description=request.data.get("description", ""),
        budget=request.data.get("budget", 0) or 0,
    )
    return Response(ProjectSerializer(project).data, status=201)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_projects_view(request):
    """Projects owned by the logged-in mentor."""
    mentor = _mentor(request)
    if not mentor:
        return Response({"error": "Mentor only"}, status=403)
    projects = Project.objects.filter(mentor=mentor).order_by("-created_at")
    return Response(ProjectSerializer(projects, many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def eligible_students_view(request):
    """Certified students the mentor can invite (certified on this mentor's chains).

    Optional ?skill= filter narrows to a specific skill.
    """
    mentor = _mentor(request)
    if not mentor:
        return Response({"error": "Mentor only"}, status=403)

    skill = request.query_params.get("skill")
    certs = Certification.objects.filter(
        certified_by=mentor, is_active=True
    ).select_related("student", "chain")
    if skill:
        certs = certs.filter(skill=skill)

    seen, out = set(), []
    for c in certs:
        sid = str(c.student.id)
        if sid in seen:
            continue
        seen.add(sid)
        out.append({
            "student_id": sid,
            "student_name": c.student.name,
            "skill": c.skill,
            "level": c.level,
            "chain_title": c.chain.title if c.chain else "",
            "cert_id": c.cert_unique_id,
        })
    return Response(out)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def invite_view(request, project_id):
    """Invite a certified student to a project."""
    mentor = _mentor(request)
    if not mentor:
        return Response({"error": "Mentor only"}, status=403)
    try:
        project = Project.objects.get(id=project_id, mentor=mentor)
    except Project.DoesNotExist:
        return Response({"error": "Project not found"}, status=404)

    student_id = request.data.get("student_id")
    try:
        student = User.objects.get(id=student_id, role="student")
    except User.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)

    # Enforce the core rule: student must hold an active certification from
    # this mentor for the project's skill.
    has_cert = Certification.objects.filter(
        student=student, certified_by=mentor, is_active=True, skill=project.skill
    ).exists()
    if not has_cert:
        return Response(
            {"error": "Student is not certified in this skill by you."}, status=400
        )

    collab, created = Collaborator.objects.get_or_create(
        project=project, student=student,
        defaults={
            "role": request.data.get("role", ""),
            "pay_share": request.data.get("pay_share", 0) or 0,
        },
    )
    if not created:
        return Response({"error": "Already invited"}, status=400)

    if project.status == "open":
        project.status = "in_progress"
        project.save()

    return Response(CollaboratorSerializer(collab).data, status=201)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def review_contribution_view(request, contribution_id):
    """Mentor approves / requests revision on a contribution."""
    mentor = _mentor(request)
    if not mentor:
        return Response({"error": "Mentor only"}, status=403)
    try:
        contrib = Contribution.objects.select_related("project").get(
            id=contribution_id, project__mentor=mentor
        )
    except Contribution.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    status_val = request.data.get("status")
    if status_val not in ("approved", "revision_requested"):
        return Response({"error": "Invalid status"}, status=400)
    contrib.status = status_val
    contrib.mentor_feedback = request.data.get("mentor_feedback", "")
    contrib.reviewed_at = timezone.now()
    contrib.save()
    return Response(ContributionSerializer(contrib).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_project_view(request, project_id):
    """Mentor marks the project complete → settle payouts to accepted collaborators."""
    mentor = _mentor(request)
    if not mentor:
        return Response({"error": "Mentor only"}, status=403)
    try:
        project = Project.objects.get(id=project_id, mentor=mentor)
    except Project.DoesNotExist:
        return Response({"error": "Project not found"}, status=404)

    for collab in project.collaborators.filter(status="accepted"):
        collab.settle()

    project.status = "completed"
    project.completed_at = timezone.now()
    project.save()
    return Response(ProjectSerializer(project).data)


# --------------------------------------------------------------- Student side
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def invited_projects_view(request):
    """Projects the logged-in student is invited to / collaborating on."""
    collabs = Collaborator.objects.filter(
        student=request.user
    ).select_related("project", "project__mentor__user").order_by("-invited_at")

    out = []
    for c in collabs:
        p = c.project
        out.append({
            "collaborator_id": str(c.id),
            "project_id": str(p.id),
            "title": p.title,
            "description": p.description,
            "skill": p.skill,
            "mentor_name": p.mentor.user.name,
            "budget": p.budget,
            "project_status": p.status,
            "my_status": c.status,
            "role": c.role,
            "pay_share": c.pay_share,
            "net_earnings": c.net_earnings,
            "paid": c.paid,
            "contributions": ContributionSerializer(
                c.contributions.all(), many=True
            ).data,
        })
    return Response(out)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def respond_invite_view(request, collaborator_id):
    """Student accepts or declines an invitation."""
    try:
        collab = Collaborator.objects.get(id=collaborator_id, student=request.user)
    except Collaborator.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    decision = request.data.get("status")
    if decision not in ("accepted", "declined"):
        return Response({"error": "Invalid status"}, status=400)
    collab.status = decision
    collab.save()
    return Response(CollaboratorSerializer(collab).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def contribute_view(request, project_id):
    """Accepted collaborator submits a contribution."""
    try:
        collab = Collaborator.objects.get(
            project_id=project_id, student=request.user, status="accepted"
        )
    except Collaborator.DoesNotExist:
        return Response({"error": "You are not an accepted collaborator"}, status=403)

    contrib = Contribution.objects.create(
        project=collab.project,
        collaborator=collab,
        title=request.data.get("title", ""),
        text_content=request.data.get("text_content", ""),
        github_url=request.data.get("github_url", ""),
        live_url=request.data.get("live_url", ""),
    )
    return Response(ContributionSerializer(contrib).data, status=201)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def project_detail_view(request, project_id):
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(ProjectSerializer(project).data)
