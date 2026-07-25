import uuid
from django.db import models
from django.conf import settings
from mentors.models import MentorProfile
from chains.models import TaskChain
from sessions_app.models import Session

LEVEL_CHOICES = [
    ("beginner", "Beginner"),
    ("intermediate", "Intermediate"),
    ("expert", "Expert"),
    ("graduate", "Graduate"),
]


def gen_cert_code():
    return f"LB-{uuid.uuid4().hex[:10].upper()}"


class Certification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="certifications"
    )
    skill = models.CharField(max_length=50)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default="beginner")
    chain = models.ForeignKey(TaskChain, on_delete=models.SET_NULL, null=True)
    session = models.OneToOneField(Session, on_delete=models.SET_NULL, null=True)
    certified_by = models.ForeignKey(MentorProfile, on_delete=models.SET_NULL, null=True)
    mentor_notes = models.TextField(blank=True)
    cert_unique_id = models.CharField(max_length=30, unique=True, default=gen_cert_code)
    issued_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.student.name} - {self.skill} ({self.level})"
