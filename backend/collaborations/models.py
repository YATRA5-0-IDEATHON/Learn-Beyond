import uuid
from django.db import models
from django.conf import settings
from mentors.models import MentorProfile
from chains.models import TaskChain

PLATFORM_COMMISSION_RATE = 0.20  # same 20% platform cut used for sessions


class Project(models.Model):
    """A real, paid project a mentor posts and invites certified students to."""
    STATUS = [
        ("open", "Open"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mentor = models.ForeignKey(
        MentorProfile, on_delete=models.CASCADE, related_name="projects"
    )
    # Optional link back to the chain whose certification unlocks this project.
    chain = models.ForeignKey(
        TaskChain, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="projects"
    )
    skill = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    budget = models.PositiveIntegerField(default=0)  # total NPR budget
    status = models.CharField(max_length=20, choices=STATUS, default="open")
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} ({self.status})"


class Collaborator(models.Model):
    """A certified student invited to contribute to a project for a pay share."""
    STATUS = [
        ("invited", "Invited"),
        ("accepted", "Accepted"),
        ("declined", "Declined"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="collaborators"
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="collaborations"
    )
    role = models.CharField(max_length=120, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default="invited")
    pay_share = models.PositiveIntegerField(default=0)  # agreed NPR before commission
    # Payout, computed when the project completes.
    platform_commission = models.PositiveIntegerField(default=0)
    net_earnings = models.PositiveIntegerField(default=0)
    paid = models.BooleanField(default=False)
    invited_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("project", "student")

    def settle(self):
        """Split the agreed pay share into platform commission + net earnings."""
        self.platform_commission = int(self.pay_share * PLATFORM_COMMISSION_RATE)
        self.net_earnings = self.pay_share - self.platform_commission
        self.paid = True
        self.save()

    def __str__(self):
        return f"{self.student.name} on {self.project.title}"


class Contribution(models.Model):
    """A piece of work a collaborator submits toward the project."""
    STATUS = [
        ("submitted", "Submitted"),
        ("approved", "Approved"),
        ("revision_requested", "Revision Requested"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="contributions"
    )
    collaborator = models.ForeignKey(
        Collaborator, on_delete=models.CASCADE, related_name="contributions"
    )
    title = models.CharField(max_length=200, blank=True)
    text_content = models.TextField(blank=True)
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default="submitted")
    mentor_feedback = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Contribution by {self.collaborator.student.name}"
