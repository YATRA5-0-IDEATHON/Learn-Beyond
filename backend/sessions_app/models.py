import uuid
from django.db import models
from django.conf import settings
from mentors.models import MentorProfile
from chains.models import TaskChain, Task


class Session(models.Model):
    PAYMENT_STATUS = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("refunded", "Refunded"),
    ]
    SESSION_STATUS = [
        ("requested", "Requested"),
        ("scheduled", "Scheduled"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]
    OUTCOME = [
        ("passed", "Passed"),
        ("needs_work", "Needs Work"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mentor = models.ForeignKey(MentorProfile, on_delete=models.CASCADE, related_name="sessions")
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sessions"
    )
    chain = models.ForeignKey(TaskChain, on_delete=models.CASCADE, related_name="sessions")
    # Optional: a per-task review call. Null for the final certification session.
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, related_name="sessions", null=True, blank=True
    )
    scheduled_at = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.PositiveIntegerField(default=30)
    video_link = models.URLField(blank=True)
    fee_amount = models.PositiveIntegerField(default=300)
    platform_commission = models.PositiveIntegerField(default=0)
    mentor_earnings = models.PositiveIntegerField(default=0)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="pending")
    payment_method = models.CharField(max_length=20, default="mock")
    session_status = models.CharField(max_length=20, choices=SESSION_STATUS, default="scheduled")
    originality_verified = models.BooleanField(default=False)
    mentor_notes = models.TextField(blank=True)
    outcome = models.CharField(max_length=20, choices=OUTCOME, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        self.platform_commission = int(self.fee_amount * 0.20)
        self.mentor_earnings = self.fee_amount - self.platform_commission
        if not self.video_link:
            self.video_link = f"https://meet.jit.si/LearnBeyond-{self.id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Session {self.id} - {self.student.name}"
