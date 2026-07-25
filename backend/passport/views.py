from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from accounts.models import StudentProfile
from certifications.models import Certification
from certifications.serializers import CertificationSerializer

User = get_user_model()


@api_view(["GET"])
@permission_classes([AllowAny])
def passport_view(request, user_id):
    try:
        user = User.objects.get(id=user_id, role="student")
    except User.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)

    profile = StudentProfile.objects.filter(user=user).first()
    certs = Certification.objects.filter(student=user, is_active=True)

    return Response({
        "name": user.name,
        "headline": profile.headline if profile else "",
        "bio": profile.bio if profile else "",
        "location": profile.location if profile else "",
        "study_field": profile.current_study_field if profile else "",
        "career_goal": profile.career_goal if profile else "",
        "avatar_url": profile.avatar_url if profile else "",
        "linkedin_url": profile.linkedin_url if profile else "",
        "github_url": profile.github_url if profile else "",
        "certifications": CertificationSerializer(certs, many=True).data,
    })
