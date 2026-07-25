from rest_framework import serializers
from .models import Session


class SessionSerializer(serializers.ModelSerializer):
    mentor_name = serializers.CharField(source="mentor.user.name", read_only=True)
    student_name = serializers.CharField(source="student.name", read_only=True)
    chain_title = serializers.CharField(source="chain.title", read_only=True)

    class Meta:
        model = Session
        fields = [
            "id", "mentor", "mentor_name", "student", "student_name",
            "chain", "chain_title", "scheduled_at", "duration_minutes",
            "video_link", "fee_amount", "platform_commission", "mentor_earnings",
            "payment_status", "payment_method", "session_status",
            "originality_verified", "mentor_notes", "outcome",
            "created_at", "completed_at",
        ]
        read_only_fields = [
            "video_link", "platform_commission", "mentor_earnings",
            "payment_status", "session_status", "originality_verified",
            "mentor_notes", "outcome", "student",
        ]
