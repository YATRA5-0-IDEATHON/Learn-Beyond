from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from mentors.models import MentorProfile
from chains.models import TaskChain, Enrollment
from sessions_app.models import Session
from submissions.models import Submission
from .models import Certification
from .serializers import CertificationSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mentor_ready_view(request):
    """Students in this mentor's chains who finished every task but aren't certified yet."""
    if not hasattr(request.user, "mentor_profile"):
        return Response({"error": "Mentor only"}, status=403)
    mentor = request.user.mentor_profile
    ready = []
    enrollments = Enrollment.objects.filter(
        chain__mentor=mentor
    ).exclude(status="certified").select_related("chain", "student")
    for e in enrollments:
        total = e.chain.tasks.count()
        approved = Submission.objects.filter(
            task__chain=e.chain, student=e.student, status="approved"
        ).values("task").distinct().count()
        if total and approved >= total:
            ready.append({
                "enrollment_id": str(e.id),
                "student_id": str(e.student.id),
                "student_name": e.student.name,
                "chain_id": str(e.chain.id),
                "chain_title": e.chain.title,
                "skill": e.chain.skill,
                "level": e.chain.level,
                "video_link": f"https://meet.jit.si/LearnBeyond-{e.id}",
            })
    return Response(ready)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_and_certify_view(request):
    """Mentor runs the final video session, verifies originality, and issues the certificate."""
    if not hasattr(request.user, "mentor_profile"):
        return Response({"error": "Mentor only"}, status=403)
    mentor = request.user.mentor_profile
    chain_id = request.data.get("chain_id")
    student_id = request.data.get("student_id")
    try:
        chain = TaskChain.objects.get(id=chain_id, mentor=mentor)
        enrollment = Enrollment.objects.get(chain=chain, student_id=student_id)
    except (TaskChain.DoesNotExist, Enrollment.DoesNotExist):
        return Response({"error": "Not found"}, status=404)

    existing = Certification.objects.filter(student_id=student_id, chain=chain).first()
    if existing:
        return Response(CertificationSerializer(existing).data, status=200)

    session = Session.objects.create(
        mentor=mentor, student=enrollment.student, chain=chain,
        scheduled_at=timezone.now(), duration_minutes=30,
        fee_amount=mentor.session_rate, payment_status="paid",
        session_status="completed", originality_verified=True, outcome="passed",
        mentor_notes=request.data.get("mentor_notes", "Verified original work across all stages."),
        completed_at=timezone.now(),
    )
    cert = Certification.objects.create(
        student=enrollment.student, skill=chain.skill, level=chain.level,
        chain=chain, session=session, certified_by=mentor,
        mentor_notes=f"Certified {chain.title}. Verified by {mentor.user.name}, {mentor.employer}.",
    )
    enrollment.status = "certified"
    enrollment.completed_at = timezone.now()
    enrollment.save()
    return Response(CertificationSerializer(cert).data, status=201)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def issue_certification_view(request):
    if not hasattr(request.user, "mentor_profile"):
        return Response({"error": "Mentor only"}, status=403)
    session_id = request.data.get("session_id")
    try:
        session = Session.objects.get(id=session_id)
    except Session.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)
    if session.outcome != "passed":
        return Response({"error": "Session must be passed first"}, status=400)
    if hasattr(session, "certification"):
        return Response({"error": "Already certified"}, status=400)

    cert = Certification.objects.create(
        student=session.student,
        skill=session.chain.skill,
        level=session.chain.level,
        chain=session.chain,
        session=session,
        certified_by=session.mentor,
        mentor_notes=request.data.get("mentor_notes", session.mentor_notes),
    )
    enrollment = Enrollment.objects.filter(
        student=session.student, chain=session.chain
    ).first()
    if enrollment:
        enrollment.status = "certified"
        enrollment.save()
    return Response(CertificationSerializer(cert).data, status=201)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_certifications_view(request, student_id):
    certs = Certification.objects.filter(student_id=student_id, is_active=True)
    return Response(CertificationSerializer(certs, many=True).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def verify_certification_view(request, cert_unique_id):
    try:
        cert = Certification.objects.get(cert_unique_id=cert_unique_id)
    except Certification.DoesNotExist:
        return Response({"valid": False, "error": "Certificate not found"}, status=404)
    return Response({
        "valid": cert.is_active,
        "student": cert.student.name,
        "skill": cert.skill,
        "level": cert.level,
        "certified_by": cert.certified_by.user.name if cert.certified_by else "N/A",
        "issued_at": cert.issued_at.date(),
        "status": "Valid" if cert.is_active else "Revoked",
    })
