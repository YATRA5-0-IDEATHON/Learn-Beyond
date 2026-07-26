"""Seed a completed, PAID collaboration project for the demo.

Takes an already-certified student (default: the demo student created by
`demo_student`) and their certifying mentor, then:
  - creates a paid Project in that skill,
  - invites the student (allowed because they're certified),
  - auto-accepts, adds an approved contribution,
  - completes the project so the payout (80/20 split) is settled.

Usage:
    python manage.py demo_project
    python manage.py demo_project --email pooja@learnbeyond.np --pay 10000
"""
from django.utils import timezone
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from certifications.models import Certification
from collaborations.models import Project, Collaborator, Contribution

User = get_user_model()


class Command(BaseCommand):
    help = "Create a completed, paid collaboration project for a certified student."

    def add_arguments(self, parser):
        parser.add_argument("--email", default="pooja@learnbeyond.np")
        parser.add_argument("--pay", type=int, default=8000)

    def handle(self, *args, **opts):
        email = opts["email"]
        pay = opts["pay"]

        try:
            student = User.objects.get(email=email, role="student")
        except User.DoesNotExist:
            self.stderr.write(f"No student {email}. Run `manage.py demo_student` first.")
            return

        cert = (Certification.objects.filter(student=student, is_active=True)
                .select_related("certified_by", "chain").first())
        if not cert or not cert.certified_by:
            self.stderr.write("Student has no active certification. Run `demo_student` first.")
            return
        mentor = cert.certified_by

        project, _ = Project.objects.get_or_create(
            mentor=mentor, title=f"Build a live {cert.skill} feature (paid)",
            defaults={
                "chain": cert.chain,
                "skill": cert.skill,
                "description": (
                    "A real client needs a production feature shipped. I'm hiring a "
                    "student I personally certified to build it, with my review at each step."
                ),
                "budget": pay + 4000,
                "status": "in_progress",
            },
        )

        collab, _ = Collaborator.objects.get_or_create(
            project=project, student=student,
            defaults={"role": "Lead Developer", "pay_share": pay, "status": "accepted"},
        )
        collab.status = "accepted"
        collab.pay_share = pay
        collab.save()

        if not collab.contributions.exists():
            Contribution.objects.create(
                project=project, collaborator=collab,
                title="Shipped the core feature",
                text_content=(
                    "Implemented the full feature end-to-end, wrote tests, and deployed. "
                    "Reviewed live with the mentor."
                ),
                github_url="https://github.com/learnbeyond-demo/paid-feature",
                status="approved", mentor_feedback="Excellent, shipped to production.",
                reviewed_at=timezone.now(),
            )

        # Complete + settle payout.
        collab.settle()  # sets platform_commission + net_earnings, paid=True
        project.status = "completed"
        project.completed_at = timezone.now()
        project.save()

        self.stdout.write(self.style.SUCCESS(
            "\n💼 Paid project completed!\n"
            f"   Student:   {student.name} ({email})\n"
            f"   Mentor:    {mentor.user.name}\n"
            f"   Project:   {project.title}\n"
            f"   Pay share: NPR {collab.pay_share:,}\n"
            f"   Platform:  NPR {collab.platform_commission:,} (20%)\n"
            f"   Net earned: NPR {collab.net_earnings:,}\n"
            "   → Visible on the student's dashboard and public portfolio.\n"
        ))
