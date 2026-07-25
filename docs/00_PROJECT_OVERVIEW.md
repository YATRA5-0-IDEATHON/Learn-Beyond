ut# MentorDo — Project Overview

> **Tagline:** Learn by Doing Real Work. Get Verified by Real Professionals. Get Hired for Real Skills.

## Ideathon Context

- **Theme:** Quality Education (UN SDG 4)
- **Team:** Procastinators
- **Repository:** YATRA5-0-IDEATHON/procastinators

## One-Line Pitch

MentorDo is a **work-based learning platform** that connects students in Nepal with verified professional mentors through **real professional tasks**, replacing passive theory with hands-on skill building and producing a **verifiable Skill Passport** that employers can trust.

## The Core Idea

Nepal's education system produces graduates who are theoretically educated but practically unemployable. Students study for years but never apply knowledge to real work. MentorDo fixes this by making the **job itself the syllabus**:

1. A student picks a real career path (guided by an AI onboarding chat).
2. They enroll with a **verified professional mentor**.
3. They complete a **Task Chain** — a sequence of real professional tasks.
4. Each submission is reviewed by the mentor.
5. At the end of each level, a **live video session** verifies originality and understanding, and the mentor certifies them.
6. Their **Skill Passport** auto-updates with verified, employer-checkable certifications.
7. Students progress: **Beginner → Intermediate → Expert → Graduate**.

## Why It Wins (Judging Criteria Map)

| Criterion | Marks | How MentorDo Scores |
|---|---|---|
| Innovation & Creativity | 20 | Task Chain (real work = curriculum), AI career onboarding, human video-based originality verification, verifiable Skill Passport, level-gated certification with mentor teaching tiers |
| Problem Solving | 15 | Solves 5 problems at once: no practical skills, no real internships, untrusted degrees, no mentor access, no career direction |
| Feasibility | 15 | Proven web stack (Next.js + Django), seeded demo data, buildable in hackathon time |
| Scalability | 15 | Automated mentor verification, async task review, self-sustaining paid-session economy, organization partnerships |
| Business Approach | 15 | 5 revenue streams: session commission, org subscriptions, employer hiring access, premium listings, institutional licensing |
| Prototype | 10 | Full clickable loop from onboarding to certified Skill Passport |
| Presentation Slides | 5 | Clean 3-act story: broken triangle → MentorDo connects it → everyone wins |
| Q&A Performance | 5 | Every feature tied to a real Nepal problem + clear differentiation from ADPList |

## Core Innovations

1. **Task Chain** — Learning is a sequence of real professional tasks, not lectures. The job is the syllabus.
2. **Skill Passport** — A public, verifiable record of real work certified by real professionals (output credential, not input credential).
3. **Human Originality Verification** — Live mentor video sessions verify understanding (can't be gamed like plagiarism software) and double as mentorship.
4. **Level System with Mentor Tiers** — Beginner → Intermediate → Expert → Graduate; mentors declare which levels they can train.
5. **AI Career Onboarding** — Conversational AI maps a student's current study + interests to real, job-relevant career paths.

## Tech Stack (Summary)

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 + Tailwind CSS |
| Backend (production) | Django + Django REST Framework |
| Database | PostgreSQL |
| Auth | JWT + Google/LinkedIn OAuth |
| Video sessions | Jitsi Meet (free, low-bandwidth) |
| Payments | eSewa / Khalti (mock in prototype) |
| AI | Gemini API (onboarding + feedback drafts) |
| Deploy | Vercel (frontend), Railway (backend) |

## Document Index

- `00_PROJECT_OVERVIEW.md` — this file
- `01_PROBLEM_STATEMENT.md` — the problems in Nepal's education
- `02_PROJECT_VISION.md` — vision, mission, goals
- `03_USER_ROLES.md` — student, mentor, employer, organization
- `04_FEATURES.md` — all 16 components in detail
- `05_SYSTEM_ARCHITECTURE.md` — how the system fits together
- `06_DATABASE_DESIGN.md` — all data models
- `07_API_SPECIFICATION.md` — all API endpoints
