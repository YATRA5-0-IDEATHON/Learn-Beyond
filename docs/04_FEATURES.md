# 04 — Features (All 16 Components)

Each component includes its Quality Education angle — how it improves education quality through real-life skills.

---

## Component 1 — Authentication & User Roles
Controls access and personalizes the experience. Three primary roles: Student, Mentor, Employer (plus Organization).

- Registration: name, email, password, role. Students add skill interests; mentors go to verification.
- Login options: Google (students/employers), LinkedIn (mentors — auto-fills professional info), email/password fallback.
- JWT access + refresh tokens; role-based access control on every page/endpoint.
- Role-based redirect after login.

**Quality angle:** LinkedIn login for mentors strengthens trust — students learn from real, identity-verified professionals.

---

## Component 2 — Student Onboarding (AI-Guided)
A conversational AI chat replaces a static form.

- AI asks: what are you studying? what do you enjoy? what work do you imagine? any skill you always wanted?
- AI maps current study + interests to real career paths and generates 3 personalized recommendations with reasoning.
- Student picks a path → sees verified mentors for that path → enrolls with one.
- Powered by Gemini API with structured prompt returning JSON recommendations.

**Quality angle:** Fixes the "one-size-fits-all irrelevant syllabus" problem. Learning is personalized and career-relevant from the first click.

---

## Component 3 — Mentor Application & Auto-Verification
Fully automated, no admin/human review — scalable.

Four automated checks:
1. LinkedIn URL reachability (HTTP request).
2. Document validity (valid, non-empty PDF/image).
3. Document text scan (PyPDF2 / pytesseract OCR) — keyword match to claimed skill.
4. Name match (fuzzy match document name to account name).

All pass → instant Verified badge. Any fail → specific reason + resubmit. Mentor sets teaching levels per skill (Beginner/Intermediate/Expert), session rate, and availability.

**Quality angle:** Guarantees every mentor is a real working professional — the foundation of quality learning.

---

## Component 4 — Task Chain
A sequence of 4–6 real professional tasks, by skill and level, created by a verified mentor. The job is the syllabus.

- Each task: title, description, order, difficulty, hints, expected output type.
- Tasks unlock sequentially (task 2 unlocks after task 1 approved).
- Visual vertical stepper: ✅ complete, 🔓 current, 🔒 locked, with progress bar.
- 3 seeded chains for demo: Accounting, Web Dev, Business.

Example (Accounting Beginner): record transactions → spot ledger errors → calculate VAT → build P/L statement → write financial summary.

**Quality angle:** Curriculum is real work sequenced like a real career — directly maps education to the job.

---

## Component 5 — Task Attempt & Submission
Students do real work and submit it.

- Submission types: text (rich editor), file upload, and for IT: GitHub repo URL, live deployed URL, or code snippet.
- GitHub check: repo reachable, has commits after task assigned, README exists.
- Live URL check: URL live and responsive.
- Hint system: 2–3 mentor-written hints revealed one at a time; usage tracked.
- Up to 3 attempts per task; all versions saved.

**Quality angle:** Learning by doing real work + real professional workflow (Git, deployment, documentation) — not isolated exercises.

---

## Component 6 — Originality Verification via Video Sessions
No plagiarism algorithm — a real professional verifies understanding in a live session.

Mentor verifies originality by:
- Asking the student to explain their work and reasoning.
- Asking them to reproduce part of it live (e.g., add a feature, handle a new transaction).
- Asking "why" follow-ups a copier can't answer.
- Checking process evidence (GitHub commit history).

Outcome: PASS → certified, next level unlocks. NEEDS WORK → mentor guides to the correct approach, student redoes specific tasks. Video via Jitsi Meet (free, low bandwidth).

**Quality angle:** Verifies genuine understanding (not just copy-paste) and doubles as expert mentorship — the highest form of quality education.

---

## Component 7 — Mentor Review & Feedback
Async review of each task submission before the final session.

- Mentor sees task, submission, hints used, attempt number.
- Actions: Approve / Request Revision / Reject with written feedback + quick tags.
- Optional AI-drafted feedback the mentor edits and approves (efficiency + human control).

**Quality angle:** Personalized expert feedback on every piece of work — the single biggest driver of learning quality, made accessible to all.

---

## Component 8 — Session Booking & Payment
Paid live certification sessions — main revenue stream.

- Mentor sets availability; student books a slot after completing a chain.
- Payment: eSewa / Khalti / card (mock in prototype).
- Auto-generated Jitsi video link per session.
- Fee split example: NPR 300 → platform 20% (60) + mentor (240).

**Quality angle:** Fair compensation keeps quality professionals engaged, making the ecosystem sustainable.

---

## Component 9 — Mentor Certification (Level Gate)
After all tasks + passed session, mentor issues a certification.

- Certification contains: skill, level, mentor name + verified badge + employer, date, unique verification ID, shareable link.
- Public verification page: anyone can verify a cert in 10 seconds (no login).
- Advances student's level; unlocks next chain.
- All 3 levels done → Graduate certification (highest credential).

**Quality angle:** Certification earned through demonstrated ability, not attendance — makes the Skill Passport trustworthy.

---

## Component 10 — Skill Passport + Auto-Updated Profile
A living, public, verifiable profile.

- Header: name, avatar, auto-generated headline, study field, career goal.
- Certifications grid (auto-added on each cert), in-progress chains, activity feed.
- Auto-updates on every action (task complete, approval, certification, enrollment).
- Editable personal fields (photo, bio, location, LinkedIn, GitHub, portfolio) — but certifications are system-generated and cannot be faked.
- Shareable link: `/passport/username`.

**Quality angle:** Output credential (proven ability) replaces input credential (time studied).

---

## Component 11 — Level System
Beginner → Intermediate → Expert → Graduate.

- Each level = Task Chain + passed certification session.
- Levels locked until previous is certified (enforced at DB + API level).
- Difficulty and independence increase each level.
- Color-coded badges: 🟢 Beginner 🔵 Intermediate 🟣 Expert 🎓 Graduate.
- Level-up notifications and animations (gamification).

**Quality angle:** Progressive mastery — mirrors apprenticeships and residencies, the most proven skill-development models.

---

## Component 12 — Mentor Recommendation Engine
Matches students to the right verified mentor.

- Hard filters: skill match, teaches student's current level, verified, available.
- Ranking signals: rating, experience, session success rate, price, language.
- Optional AI-generated one-line "why this mentor fits you."
- Students can switch mentors as they level up.

**Quality angle:** Democratizes access — every student gets matched to an ideal mentor regardless of connections or geography.

---

## Component 13 — Rating System
Maintains quality without manual oversight.

- After each paid session, student rates mentor (1–5 + optional sub-scores: knowledge, communication, helpfulness) + written review.
- Only verified session completions can rate (no fake reviews).
- Feeds recommendation ranking; top mentors get badges; low performers flagged.

**Quality angle:** Public accountability continuously raises teaching quality across the platform.

---

## Component 14 — Collaboration Tools
Peer learning per Task Chain.

- Study groups (chat + discussion board) per chain.
- Shared resource library (notes, templates, links) with upvotes, per skill/level.
- Q&A forum per skill (searchable knowledge base).
- Mentors post resources/announcements to their students.
- Individual accountability preserved via the live session.

**Quality angle:** Peer learning boosts retention and builds a supportive community — especially valuable for isolated rural students.

---

## Component 15 — Employer View
Evidence-based hiring.

- Employers browse students by verified skill, level, certification, location, availability.
- View Skill Passports; verify certifications instantly.
- Contact students (message / express interest).
- Future: AI Talent Match (post needs → ranked certified candidates).

**Quality angle:** Closes the education-employment loop — the ultimate measure of education quality is whether it leads to a job.

---

## Component 16 — Organization Partnership
B2B pipeline.

- Companies/NGOs register as partners; bulk-onboard employees as verified mentors (org vouches).
- Sponsor Task Chains tied to hiring (e.g., "Junior Credit Analyst" → top performers get guaranteed interviews).
- Priority access to graduates; analytics dashboard; subscription.

**Quality angle:** Brings real company work and real job pathways into the platform — training on actual industry tasks with direct employment outcomes.

---

## Feature Priority for Prototype

**Phase 1 (core loop — must have):** Auth, AI onboarding, mentor browse/enroll, Task Chain, task submission, mentor review, session booking (mock pay), certification, Skill Passport, level system.

**Phase 2 (wow factor):** Hint system, mentor rating, AI feedback drafts, collaboration resources.

**Phase 3 (if time):** Employer browse + contact, organization partnership.
