from rest_framework import serializers
from .models import Project, Collaborator, Contribution


class ContributionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="collaborator.student.name", read_only=True)

    class Meta:
        model = Contribution
        fields = [
            "id", "project", "collaborator", "student_name", "title",
            "text_content", "github_url", "live_url", "status",
            "mentor_feedback", "submitted_at", "reviewed_at",
        ]
        read_only_fields = ["status", "mentor_feedback", "reviewed_at"]


class CollaboratorSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.name", read_only=True)
    student_id = serializers.CharField(source="student.id", read_only=True)
    contributions = ContributionSerializer(many=True, read_only=True)

    class Meta:
        model = Collaborator
        fields = [
            "id", "project", "student_id", "student_name", "role", "status",
            "pay_share", "platform_commission", "net_earnings", "paid",
            "invited_at", "contributions",
        ]


class ProjectSerializer(serializers.ModelSerializer):
    mentor_name = serializers.CharField(source="mentor.user.name", read_only=True)
    collaborators = CollaboratorSerializer(many=True, read_only=True)
    collaborator_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id", "mentor", "mentor_name", "chain", "skill", "title",
            "description", "budget", "status", "created_at", "completed_at",
            "collaborators", "collaborator_count",
        ]
        read_only_fields = ["mentor", "status", "completed_at"]

    def get_collaborator_count(self, obj):
        return obj.collaborators.count()
