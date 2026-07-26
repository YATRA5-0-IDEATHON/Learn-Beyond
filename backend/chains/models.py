import uuid
from django.db import models
from django.conf import settings
from mentors.models import MentorProfile

LEVEL_CHOICES = [
    ("beginner", "Beginner"),
    ("intermediate", "Intermediate"),
    ("expert", "Expert"),
]


class TaskChain(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mentor = models.ForeignKey(
        MentorProfile, on_delete=models.CASCADE, related_name="chains"
    )
    skill = models.CharField(max_length=50)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default="beginner")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.level})"


class Task(models.Model):
    OUTPUT_CHOICES = [
        ("text", "Text"),
        ("file", "File"),
        ("image", "Image / Photo"),
        ("github_url", "GitHub URL"),
        ("live_url", "Live URL"),
        ("code", "Code"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chain = models.ForeignKey(TaskChain, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order_number = models.PositiveIntegerField(default=1)
    difficulty = models.CharField(max_length=20, default="medium")
    hints = models.JSONField(default=list)
    learning_topics = models.JSONField(default=list)  # concepts the student must cover
    video_url = models.URLField(blank=True)  # mentor's lesson video for this stage


    expected_output_type = models.CharField(
        max_length=20, choices=OUTPUT_CHOICES, default="text"
    )

    class Meta:
        ordering = ["order_number"]

    def __str__(self):
        return f"{self.order_number}. {self.title}"


class Enrollment(models.Model):
    STATUS_CHOICES = [
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("certified", "Certified"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="enrollments"
    )
    chain = models.ForeignKey(TaskChain, on_delete=models.CASCADE, related_name="enrollments")
    current_task_order = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="in_progress")
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("student", "chain")

    def __str__(self):
        return f"{self.student.name} -> {self.chain.title}"
