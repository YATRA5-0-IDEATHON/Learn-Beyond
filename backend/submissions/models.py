import uuid
from django.db import models
from django.conf import settings
from chains.models import Task


class Submission(models.Model):
    TYPE_CHOICES = [
        ("text", "Text"),
        ("file", "File"),
        ("image", "Image / Photo"),
        ("github_url", "GitHub URL"),
        ("live_url", "Live URL"),
        ("code", "Code"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("revision_requested", "Revision Requested"),
        ("rejected", "Rejected"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="submissions")
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="submissions"
    )
    attempt_number = models.PositiveIntegerField(default=1)
    submission_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="text")
    text_content = models.TextField(blank=True)
    file_url = models.URLField(blank=True)
    file_upload = models.FileField(upload_to="submissions/files/", blank=True, null=True)
    image_upload = models.ImageField(upload_to="submissions/images/", blank=True, null=True)
    github_url = models.URLField(blank=True)

    live_url = models.URLField(blank=True)
    code_content = models.TextField(blank=True)
    hints_used = models.PositiveSmallIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    mentor_feedback = models.TextField(blank=True)
    feedback_tags = models.JSONField(default=list)
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.student.name} - {self.task.title} ({self.status})"
