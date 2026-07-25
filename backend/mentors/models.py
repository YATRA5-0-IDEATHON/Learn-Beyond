import uuid
from django.db import models
from django.conf import settings


class MentorProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="mentor_profile"
    )
    linkedin_url = models.URLField(blank=True)
    job_title = models.CharField(max_length=150, blank=True)
    employer = models.CharField(max_length=150, blank=True)
    years_experience = models.PositiveIntegerField(default=0)
    skills = models.JSONField(default=list)  # ["accounting", "web_dev"]
    teaching_levels = models.JSONField(default=dict)  # {"accounting": ["beginner"]}
    session_rate = models.PositiveIntegerField(default=300)  # NPR
    bio = models.TextField(blank=True)
    document_url = models.URLField(blank=True)
    is_verified = models.BooleanField(default=False)
    verification_checks = models.JSONField(default=dict)
    rating = models.FloatField(default=0.0)
    total_sessions = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Mentor: {self.user.name}"


class MentorAvailability(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mentor = models.ForeignKey(
        MentorProfile, on_delete=models.CASCADE, related_name="availability"
    )
    day_of_week = models.PositiveSmallIntegerField()  # 0-6
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.mentor.user.name} - day {self.day_of_week}"
