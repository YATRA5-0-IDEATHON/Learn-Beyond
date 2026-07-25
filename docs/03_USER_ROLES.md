# 03 — User Roles

MentorDo has four user roles. Each sees a different view of the platform and has different permissions.

---

## Role 1 — Student

**Who they are:** School/college students, fresh graduates, or anyone wanting to build real, job-ready skills.

**What they can do:**
- Sign up (Google login or email/password)
- Complete AI onboarding chat (study field + interests → career path recommendations)
- Browse and get recommended verified mentors
- Enroll with a mentor for a skill
- Browse Task Chains for their enrolled skill and current level
- Attempt and submit tasks (text, file, GitHub URL, live URL, code)
- Use hints while working on tasks
- Receive mentor feedback and revise submissions
- Book and pay for certification sessions
- Join live video sessions
- Earn certifications and progress through levels
- View and share their public Skill Passport
- Edit their personal profile (photo, bio, links)
- Join study groups and use collaboration tools
- Rate mentors after sessions

**What they cannot do:**
- Access mentor review or certification tools
- Access employer browsing tools
- Enroll in a Task Chain above their current certified level
- Edit or fake their certifications (system-generated only)

---

## Role 2 — Mentor (Verified Professional)

**Who they are:** Working professionals — accountants, developers, designers, marketers, healthcare workers — who want to mentor students, earn income, and find talent.

**What they can do:**
- Sign up (LinkedIn login preferred — auto-fills professional info)
- Apply for verification (LinkedIn URL + professional document)
- Get auto-verified (4 automated checks)
- Set which skills they teach and which levels they can train (Beginner / Intermediate / Expert)
- Set their session rate (NPR)
- Set their availability calendar
- Create Task Chains (sequences of real tasks)
- Add tasks with descriptions, hints, and expected outputs
- Review student submissions (approve / request revision / reject)
- Give written feedback (with optional AI-drafted suggestions)
- Conduct live certification sessions (verify originality + guide students)
- Issue certifications after passing sessions
- Earn session income (minus platform commission)
- Build a public rating and reputation
- Post resources and announcements to their students

**What they cannot do:**
- Train levels above their qualified tier
- Teach skills they aren't verified for
- Edit student ratings or reviews of themselves
- Access employer browsing tools

**Teaching Level Tiers:**

| Experience | Can train |
|---|---|
| 1–3 years | Beginner |
| 3–6 years | Beginner + Intermediate |
| 6+ years | Beginner + Intermediate + Expert |

Auto-suggested from verified experience; mentor confirms. Organization-backed mentors have levels assigned by their organization.

---

## Role 3 — Employer

**Who they are:** Companies, startups, and organizations looking to hire skilled, verified candidates.

**What they can do:**
- Register as an employer
- Browse verified students by skill, level, certification, location, availability
- View student Skill Passports
- Verify any certification via public verification page
- Contact students (message / express interest)
- Post job or internship opportunities (future)
- Use AI Talent Match to find candidates fitting their needs (future)

**What they cannot do:**
- Access student learning tools or mentor tools
- See private student data unless the student opts in
- Edit or influence certifications

---

## Role 4 — Organization (Partner)

**Who they are:** Companies, NGOs, or institutions that partner with MentorDo to onboard their employees as mentors and/or sponsor Task Chains tied to hiring.

**What they can do:**
- Register as a partner organization (with verification)
- Bulk-onboard employees as verified mentors (bypasses individual verification — org vouches for them)
- Assign teaching levels to their mentors
- Sponsor Task Chains tied to hiring pipelines (e.g., "Junior Credit Analyst" track)
- Get priority access to certified graduates for hiring
- View analytics on their sponsored chains and mentors
- Manage a subscription plan

**What they cannot do:**
- Access unrelated students' private data
- Influence certifications outside their own sponsored chains

---

## Role Comparison Matrix

| Capability | Student | Mentor | Employer | Organization |
|---|---|---|---|---|
| AI onboarding | ✅ | — | — | — |
| Attempt tasks | ✅ | — | — | — |
| Create Task Chains | — | ✅ | — | via mentors |
| Review submissions | — | ✅ | — | — |
| Issue certifications | — | ✅ | — | — |
| Earn session income | — | ✅ | — | — |
| Browse students | — | — | ✅ | ✅ |
| Verify certifications | ✅ | ✅ | ✅ | ✅ |
| Skill Passport (own) | ✅ | — | — | — |
| Bulk-onboard mentors | — | — | — | ✅ |
| Sponsor Task Chains | — | — | — | ✅ |

---

## Multi-Role Note

A single person may want to be both a student and a mentor (e.g., a senior developer learning design while mentoring juniors in code). For the prototype, we keep **one role per account** for simplicity. In production, an account could hold multiple roles with a role-switcher in the UI.

---

## Authentication by Role

| Role | Recommended login |
|---|---|
| Student | Google login (fast) or email/password |
| Mentor | LinkedIn login (auto-fills + strengthens verification) or Google fallback |
| Employer | Google login or email/password |
| Organization | Email/password + manual partner verification |
