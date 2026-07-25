from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from mentors.models import MentorProfile
from chains.models import TaskChain, Enrollment
from sessions_app.models import Session
from .models import Certification
from .serializers import CertificationSerializer


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
