from rest_framework import serializers
from .models import SkillReport, StudyComment


class SkillReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillReport
        fields = [
            "id", "skill_area", "grade", "practical_hours",
            "tasks_completed", "tasks_total", "updated_at",
        ]


class StudyCommentSerializer(serializers.ModelSerializer):
    mentor_name = serializers.CharField(source="mentor.user.name", read_only=True, default="Mentor")

    class Meta:
        model = StudyComment
        fields = ["id", "text", "mentor_name", "created_at"]
