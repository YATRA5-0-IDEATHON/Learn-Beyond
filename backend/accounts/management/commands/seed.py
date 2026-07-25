import random
from django.utils import timezone
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import StudentProfile
from mentors.models import MentorProfile
from chains.models import TaskChain, Task, Enrollment
from submissions.models import Submission
from sessions_app.models import Session
from certifications.models import Certification

User = get_user_model()

REVIEW_TEXTS = [
    "Incredibly patient and knowledgeable. My skills improved fast!",
    "Explains complex topics simply. The video sessions were gold.",
    "Very responsive on feedback. Helped me land my first internship.",
    "Real-world tasks, not just theory. Highly recommend.",
    "Best mentor on the platform. Genuinely cares about students.",
    "The task chain was well structured and the reviews were detailed.",
    "Went above and beyond to make sure I understood everything.",
]


def rand_reviews(n=3):
    names = ["Anil K.", "Prati B.", "Suman R.", "Nisha T.", "Bikash G.", "Manju S.", "Roshan L."]
    out = []
    for _ in range(n):
        out.append({
            "author": random.choice(names),
            "rating": random.choice([4, 5, 5, 5]),
            "text": random.choice(REVIEW_TEXTS),
        })
    return out


# Deterministic avatars via DiceBear (no API key, renders as SVG).
def avatar(seed):
    return f"https://api.dicebear.com/7.x/avataaars/svg?seed={seed}"


# ---------------------------------------------------------------------------
# Mentors across many fields.
# ---------------------------------------------------------------------------
MENTORS = [
    {
        "email": "ramesh@learnbeyond.np", "name": "Ramesh Sharma",
        "job_title": "Senior Full-Stack Engineer", "employer": "Leapfrog Technology",
        "years": 9, "rate": 500, "rating": 4.9, "sessions": 68,
        "skills": ["full_stack", "web_dev"],
        "levels": {"full_stack": ["beginner", "intermediate"], "web_dev": ["beginner"]},
        "bio": "Full-stack engineer with 9 years shipping React & Django apps. I love mentoring new developers.",
    },
    {
        "email": "sabina@learnbeyond.np", "name": "Sabina Thapa",
        "job_title": "Frontend Lead", "employer": "Fusemachines",
        "years": 7, "rate": 450, "rating": 4.8, "sessions": 54,
        "skills": ["full_stack", "web_dev"],
        "levels": {"full_stack": ["beginner", "intermediate"]},
        "bio": "Frontend lead specializing in React and modern UI. I help students build real portfolios.",
    },
    {
        "email": "bibek@learnbeyond.np", "name": "Bibek Adhikari",
        "job_title": "Software Architect", "employer": "CloudFactory",
        "years": 11, "rate": 600, "rating": 4.7, "sessions": 40,
        "skills": ["full_stack", "web_dev"],
        "levels": {"full_stack": ["intermediate"]},
        "bio": "Architect who mentors on scalable web apps, APIs and deployment.",
    },
    {
        "email": "sarita@learnbeyond.np", "name": "Er. Sarita Poudel",
        "job_title": "Structural Engineer", "employer": "MacDonald Nepal",
        "years": 12, "rate": 550, "rating": 4.9, "sessions": 33,
        "skills": ["civil"], "levels": {"civil": ["beginner", "intermediate"]},
        "bio": "Licensed structural engineer. I teach practical design, surveying and estimation.",
    },
    {
        "email": "hari@learnbeyond.np", "name": "Er. Hari Gautam",
        "job_title": "Site Engineer", "employer": "Sharma & Co Builders",
        "years": 8, "rate": 400, "rating": 4.6, "sessions": 21,
        "skills": ["civil"], "levels": {"civil": ["beginner"]},
        "bio": "Site engineer sharing real construction workflows and safety practices.",
    },
    {
        "email": "gita@learnbeyond.np", "name": "Dr. Gita Rai",
        "job_title": "Agronomist", "employer": "Nepal Agricultural Research Council",
        "years": 14, "rate": 350, "rating": 4.8, "sessions": 29,
        "skills": ["agriculture"], "levels": {"agriculture": ["beginner", "intermediate"]},
        "bio": "Agronomist helping students master crop science and modern farming.",
    },
    {
        "email": "prakash@learnbeyond.np", "name": "Er. Prakash Yadav",
        "job_title": "Power Systems Engineer", "employer": "Nepal Electricity Authority",
        "years": 10, "rate": 500, "rating": 4.7, "sessions": 26,
        "skills": ["electrical"], "levels": {"electrical": ["beginner", "intermediate"]},
        "bio": "Power systems engineer teaching circuits, power distribution and safety.",
    },
    {
        "email": "anita.ca@learnbeyond.np", "name": "Anita Gurung",
        "job_title": "Chartered Accountant", "employer": "Deloitte Nepal",
        "years": 8, "rate": 450, "rating": 4.9, "sessions": 47,
        "skills": ["finance", "accounting", "business"],
        "levels": {"finance": ["beginner", "intermediate"], "accounting": ["beginner"]},
        "bio": "CA at Deloitte mentoring future finance and accounting professionals.",
    },
    {
        "email": "deepak@learnbeyond.np", "name": "Deepak Shrestha",
        "job_title": "Investment Analyst", "employer": "NIC Asia Capital",
        "years": 6, "rate": 400, "rating": 4.6, "sessions": 18,
        "skills": ["finance", "business"], "levels": {"finance": ["beginner"]},
        "bio": "Investment analyst teaching financial modelling and market analysis.",
    },
]

# ---------------------------------------------------------------------------
# Task chains keyed by skill. Full-stack is the flagship demo chain.
# ---------------------------------------------------------------------------
YT = "https://www.youtube.com/watch?v="
CHAINS = {
    "full_stack": {
        "title": "Full-Stack Web Developer Path",
        "level": "beginner",
        "description": "Go from zero to a deployed, collaborative full-stack web app — the complete job-ready journey.",
        "tasks": [
            ("Build a responsive landing page with HTML",
             "Create a semantic, accessible landing page for a fictional startup using pure HTML.",
             ["Use semantic tags (header, main, footer)", "Structure content before styling"], "kUMe1FH4CHE"),
            ("Style it beautifully with CSS",
             "Style your landing page with modern CSS — flexbox/grid, colors, and mobile responsiveness.",
             ["Mobile-first", "Use flexbox or grid for layout"], "OXGznpKZ_sA"),
            ("Build an interactive UI with React",
             "Rebuild your page as a React app with components, props and state.",
             ["Break UI into components", "Lift state up when needed"], "bMknfKXIFA8"),
            ("Version your code with Git & GitHub",
             "Put your project on GitHub with meaningful commits and a good README.",
             ["Commit small and often", "Write a clear README"], "RGOj5yH7evk"),
            ("Deploy your app to a live URL",
             "Deploy your React app to Vercel or Netlify and share the live link.",
             ["Try Vercel or Netlify", "Test the production build"], "TFbLED8Rwlc"),
            ("Collaborate on a team project",
             "Fork a team repo, open a pull request, review a teammate's PR, and merge cleanly.",
             ["Use feature branches", "Write helpful PR descriptions"], "8JJ101D3knE"),
        ],
    },
    "civil": {
        "title": "Junior Civil Engineer Path",
        "level": "beginner",
        "description": "Practical civil engineering: from surveying to structural estimation.",
        "tasks": [
            ("Site survey basics", "Produce a leveling report from given field data.", ["Double-check benchmarks"], ""),
            ("Read structural drawings", "Interpret and annotate a sample structural drawing.", ["Identify load paths"], ""),
            ("Estimate materials", "Prepare a bill of quantities for a small RCC slab.", ["Account for wastage"], ""),
            ("Safety & report", "Write a site safety checklist and summary report.", ["Reference IS codes"], ""),
        ],
    },
    "agriculture": {
        "title": "Modern Agriculture Path",
        "level": "beginner",
        "description": "Crop science and modern farming techniques with real field tasks.",
        "tasks": [
            ("Soil analysis", "Analyze a soil report and recommend crops.", ["Check pH and NPK"], ""),
            ("Crop planning", "Design a seasonal crop rotation plan.", ["Rotate legumes"], ""),
            ("Pest management", "Propose an integrated pest management plan.", ["Prefer biological controls"], ""),
            ("Yield report", "Summarize expected yield and cost analysis.", ["State assumptions"], ""),
        ],
    },
    "electrical": {
        "title": "Electrical Engineering Path",
        "level": "beginner",
        "description": "Circuits, power systems and practical electrical design.",
        "tasks": [
            ("Circuit analysis", "Solve a DC circuit and document the steps.", ["Apply KVL/KCL"], ""),
            ("Load calculation", "Compute the electrical load for a small house.", ["Sum connected loads"], ""),
            ("Wiring diagram", "Draw a safe wiring diagram for a room.", ["Follow color codes"], ""),
            ("Safety audit", "Write an electrical safety audit checklist.", ["Check earthing"], ""),
        ],
    },
    "finance": {
        "title": "Finance Analyst Path",
        "level": "beginner",
        "description": "Financial modelling, analysis and investment fundamentals.",
        "tasks": [
            ("Read financial statements", "Analyze a company's balance sheet and P/L.", ["Watch the cash flow"], ""),
            ("Build a financial model", "Create a 12-month revenue projection.", ["State assumptions"], ""),
            ("Ratio analysis", "Compute and interpret 5 key financial ratios.", ["Compare to industry"], ""),
            ("Investment memo", "Write a one-page investment recommendation.", ["Lead with the thesis"], ""),
        ],
    },
}


class Command(BaseCommand):
    help = "Seed the database with rich demo data for LearnBeyond."

    def handle(self, *args, **options):
        random.seed(42)

        mentor_objs = {}
        for m in MENTORS:
            user, created = User.objects.get_or_create(
                email=m["email"], defaults={"name": m["name"], "role": "mentor"},
            )
            if created:
                user.set_password("demo1234")
                user.save()
            profile, _ = MentorProfile.objects.get_or_create(
                user=user,
                defaults={
                    "linkedin_url": f"https://linkedin.com/in/{m['email'].split('@')[0]}",
                    "avatar_url": avatar(m["name"]),
                    "job_title": m["job_title"], "employer": m["employer"],
                    "years_experience": m["years"], "skills": m["skills"],
                    "teaching_levels": m["levels"], "session_rate": m["rate"],
                    "bio": m["bio"], "is_verified": True,
                    "verification_checks": {"linkedin": True, "document": True,
                                            "text_scan": True, "name_match": True},
                    "rating": m["rating"], "total_sessions": m["sessions"],
                    "reviews": rand_reviews(random.randint(2, 3)),
                },
            )
            mentor_objs[m["email"]] = profile

        # Build one chain per skill, owned by a mentor who teaches it.
        chain_objs = {}
        for skill, data in CHAINS.items():
            owner = next(
                (p for p in mentor_objs.values() if skill in (p.skills or [])), None
            )
            if not owner:
                continue
            chain, made = TaskChain.objects.get_or_create(
                mentor=owner, skill=skill, level=data["level"],
                defaults={"title": data["title"], "description": data["description"]},
            )
            if made:
                for i, (title, desc, hints, vid) in enumerate(data["tasks"], start=1):
                    Task.objects.create(
                        chain=chain, title=title, description=desc,
                        order_number=i, hints=hints,
                        video_url=(YT + vid) if vid else "",
                        expected_output_type="text",
                    )
            chain_objs[skill] = chain

        # ------- Demo student 1: brand-new (for live walkthrough) -------
        sita, created = User.objects.get_or_create(
            email="sita@learnbeyond.np",
            defaults={"name": "Sita Rai", "role": "student"},
        )
        if created:
            sita.set_password("demo1234")
            sita.save()
        StudentProfile.objects.get_or_create(
            user=sita,
            defaults={
                "current_study_field": "Computer Engineering",
                "career_goal": "Full-Stack Developer",
                "location": "Kathmandu",
                "avatar_url": avatar("Sita Rai"),
                "headline": "Computer Engineering student building real web skills",
            },
        )

        # ------- Demo student 2: fully COMPLETED & certified -------
        self._make_completed_student(chain_objs.get("full_stack"),
                                     mentor_objs["ramesh@learnbeyond.np"])

        self.stdout.write(self.style.SUCCESS(
            f"Seeded {len(mentor_objs)} mentors, {len(chain_objs)} chains, and 2 students "
            "(password: demo1234). New student: sita@learnbeyond.np | "
            "Certified student: aayush@learnbeyond.np | Mentor: ramesh@learnbeyond.np"
        ))

    def _make_completed_student(self, chain, mentor):
        if not chain:
            return
        user, created = User.objects.get_or_create(
            email="aayush@learnbeyond.np",
            defaults={"name": "Aayush Karki", "role": "student"},
        )
        if created:
            user.set_password("demo1234")
            user.save()
        profile, _ = StudentProfile.objects.get_or_create(
            user=user,
            defaults={
                "current_study_field": "Computer Engineering",
                "career_goal": "Full-Stack Developer",
                "location": "Pokhara",
                "avatar_url": avatar("Aayush Karki"),
                "headline": "Full-Stack Developer · Verified on LearnBeyond",
                "bio": "Completed the Full-Stack Web Developer Path with a live deployed project.",
                "github_url": "https://github.com/aayush-demo",
                "linkedin_url": "https://linkedin.com/in/aayush-demo",
                "onboarding_complete": True,
            },
        )

        tasks = list(chain.tasks.all())
        total = len(tasks)
        enrollment, _ = Enrollment.objects.get_or_create(
            student=user, chain=chain,
            defaults={"current_task_order": total + 1, "status": "certified"},
        )
        # Approved submissions for every task.
        for t in tasks:
            if not Submission.objects.filter(task=t, student=user).exists():
                Submission.objects.create(
                    task=t, student=user, attempt_number=1,
                    submission_type="text",
                    text_content=f"Completed: {t.title}. Live demo and repo attached.",
                    status="approved",
                    mentor_feedback="Excellent work — clean and production-ready.",
                    reviewed_at=timezone.now(),
                )

        # A passed video session + certificate.
        session = Session.objects.filter(student=user, chain=chain).first()
        if not session:
            session = Session.objects.create(
                mentor=mentor, student=user, chain=chain,
                scheduled_at=timezone.now(), duration_minutes=30,
                fee_amount=mentor.session_rate, payment_status="paid",
                session_status="completed", originality_verified=True,
                outcome="passed",
                mentor_notes="Verified original work across all stages. Strong full-stack fundamentals.",
                completed_at=timezone.now(),
            )
        if not Certification.objects.filter(student=user, chain=chain).exists():
            Certification.objects.create(
                student=user, skill=chain.skill, level=chain.level,
                chain=chain, session=session, certified_by=mentor,
                mentor_notes="Certified Full-Stack Web Developer. Verified by Ramesh Sharma, Leapfrog Technology.",
            )
