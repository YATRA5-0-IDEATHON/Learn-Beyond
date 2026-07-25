import uuid
from django.db import models
from django.conf import settings
from mentors.models import MentorProfile

# Numeric weight per letter grade, used to compute overall proficiency.
GRADE_POINTS = {
    "A+": 97, "A": 93, "A-": 90,
    "B+": 88, "B": 83, "B-": 80,
    "C+": 78, "C": 73, "C-": 70,
    "D": 65, "F": 50,
}


class SkillReport(models.Model):
    """A mentor-graded skill area shown on a student's public portfolio."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="skill_reports"
    )
    mentor = models.ForeignKey(
        MentorProfile, on_delete=models.SET_NULL, null=True, related_name="authored_reports"
    )
    skill_area = models.CharField(max_length=120)
    grade = models.CharField(max_length=3, default="B")
    practical_hours = models.PositiveIntegerField(default=0)
    tasks_completed = models.PositiveIntegerField(default=0)
    tasks_total = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        unique_together = ("student", "skill_area")

    @property
    def grade_points(self):
        return GRADE_POINTS.get(self.grade.upper(), 75)

    def __str__(self):
        return f"{self.student.name} · {self.skill_area} ({self.grade})"


class StudyComment(models.Model):
    """A mentor's study-tracking note on a student, shown as a timeline."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="study_comments"
    )
    mentor = models.ForeignKey(
        MentorProfile, on_delete=models.SET_NULL, null=True, related_name="authored_comments"
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Comment on {self.student.name} @ {self.created_at:%Y-%m-%d}"
