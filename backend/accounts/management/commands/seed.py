from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import StudentProfile
from mentors.models import MentorProfile
from chains.models import TaskChain, Task

User = get_user_model()

CHAINS = [
    {
        "skill": "accounting",
        "title": "Junior Accountant Path",
        "description": "Real accounting tasks: from recording transactions to financial summaries.",
        "tasks": [
            ("Record transactions", "Record a month of business transactions in a ledger.", ["Group by account type", "Debits = credits"]),
            ("Spot ledger errors", "Find and fix 5 errors in a provided ledger.", ["Check the trial balance", "Watch transposed digits"]),
            ("Calculate VAT", "Compute VAT for 10 sample invoices at 13%.", ["VAT = base * 0.13"]),
            ("Build P/L statement", "Prepare a profit & loss statement from given data.", ["Revenue - expenses = profit"]),
            ("Write financial summary", "Write a one-page summary of the financials.", ["Lead with the headline number"]),
        ],
    },
    {
        "skill": "web_dev",
        "title": "Junior Web Developer Path",
        "description": "Build and ship a real web application, step by step.",
        "tasks": [
            ("Build a landing page", "Create a responsive landing page with HTML/CSS.", ["Mobile-first", "Use semantic tags"]),
            ("Add interactivity", "Add a working contact form with JS validation.", ["Validate on submit"]),
            ("Consume an API", "Fetch and display data from a public REST API.", ["Handle loading & errors"]),
            ("Deploy the app", "Deploy your app to a live URL.", ["Try Vercel or Netlify"]),
        ],
    },
    {
        "skill": "business",
        "title": "Business Analyst Path",
        "description": "Analyze a real business scenario and present recommendations.",
        "tasks": [
            ("Market research", "Research a market and summarize 3 key trends.", ["Cite sources"]),
            ("SWOT analysis", "Produce a SWOT analysis for a sample company.", ["Be specific, not generic"]),
            ("Financial model", "Build a simple 12-month revenue projection.", ["State your assumptions"]),
            ("Pitch deck", "Create a 5-slide recommendation deck.", ["One idea per slide"]),
        ],
    },
]


class Command(BaseCommand):
    help = "Seed the database with demo data for LearnBeyond."

    def handle(self, *args, **options):
        mentor_user, created = User.objects.get_or_create(
            email="ramesh@learnbeyond.np",
            defaults={"name": "Ramesh Sharma", "role": "mentor"},
        )
        if created:
            mentor_user.set_password("demo1234")
            mentor_user.save()

        mentor, _ = MentorProfile.objects.get_or_create(
            user=mentor_user,
            defaults={
                "job_title": "Chartered Accountant",
                "employer": "Deloitte Nepal",
                "years_experience": 8,
                "skills": ["accounting", "web_dev", "business"],
                "teaching_levels": {
                    "accounting": ["beginner", "intermediate", "expert"],
                    "web_dev": ["beginner"],
                    "business": ["beginner"],
                },
                "session_rate": 300,
                "bio": "CA with 8 years at Deloitte Nepal. I mentor future accountants and analysts.",
                "is_verified": True,
                "verification_checks": {
                    "linkedin": True, "document": True,
                    "text_scan": True, "name_match": True,
                },
                "rating": 4.9,
                "total_sessions": 42,
            },
        )

        for chain_data in CHAINS:
            chain, made = TaskChain.objects.get_or_create(
                mentor=mentor,
                skill=chain_data["skill"],
                level="beginner",
                defaults={
                    "title": chain_data["title"],
                    "description": chain_data["description"],
                },
            )
            if made:
                for i, (title, desc, hints) in enumerate(chain_data["tasks"], start=1):
                    Task.objects.create(
                        chain=chain, title=title, description=desc,
                        order_number=i, hints=hints,
                        expected_output_type="text",
                    )

        student_user, created = User.objects.get_or_create(
            email="sita@learnbeyond.np",
            defaults={"name": "Sita Rai", "role": "student"},
        )
        if created:
            student_user.set_password("demo1234")
            student_user.save()
            StudentProfile.objects.get_or_create(
                user=student_user,
                defaults={
                    "current_study_field": "BBS",
                    "career_goal": "Junior Accountant",
                    "location": "Dhangadhi",
                    "headline": "BBS student building real accounting skills",
                },
            )

        self.stdout.write(self.style.SUCCESS(
            "Seeded: mentor ramesh@learnbeyond.np, student sita@learnbeyond.np "
            "(password: demo1234), 3 task chains."
        ))
