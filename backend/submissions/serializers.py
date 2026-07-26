from rest_framework import serializers
from .models import Submission


class SubmissionSerializer(serializers.ModelSerializer):
    task_title = serializers.CharField(source="task.title", read_only=True)
    student_name = serializers.CharField(source="student.name", read_only=True)

    class Meta:
        model = Submission
        fields = [
            "id", "task", "task_title", "student_name", "attempt_number",
            "submission_type", "text_content", "file_url", "file_upload",
            "image_upload", "github_url", "live_url", "code_content",
            "hints_used", "status", "mentor_feedback", "feedback_tags",
            "submitted_at", "reviewed_at",
        ]
        read_only_fields = [
            "status", "mentor_feedback", "feedback_tags", "reviewed_at",
            "attempt_number",
        ]


