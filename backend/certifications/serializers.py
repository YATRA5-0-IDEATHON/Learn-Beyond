from rest_framework import serializers
from .models import Certification


class CertificationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.name", read_only=True)
    mentor_name = serializers.CharField(source="certified_by.user.name", read_only=True)
    mentor_employer = serializers.CharField(source="certified_by.employer", read_only=True)
    chain_title = serializers.CharField(source="chain.title", read_only=True, default="")

    class Meta:
        model = Certification
        fields = [
            "id", "student_name", "skill", "level", "mentor_name",
            "mentor_employer", "mentor_notes", "cert_unique_id", "chain_title",
            "issued_at", "is_active",
        ]
