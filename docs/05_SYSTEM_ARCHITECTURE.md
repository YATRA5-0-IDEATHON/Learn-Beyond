# 05 — System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                        │
│                Next.js 14 + Tailwind CSS (SPA/SSR)             │
│   Student UI  │  Mentor UI  │  Employer UI  │  Org UI          │
└───────────────────────────┬───────────────────────────────────┘
                            │ HTTPS / REST (JSON) + JWT
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API (Django + DRF)                  │
│  Auth  │  Onboarding  │  Mentors  │  Chains  │  Submissions    │
│  Sessions  │  Certifications  │  Passport  │  Ratings          │
└───┬───────────┬───────────┬───────────┬───────────┬───────────┘
    │           │           │           │           │
    ▼           ▼           ▼           ▼           ▼
┌────────┐ ┌─────────┐ ┌──────────┐ ┌────────┐ ┌──────────────┐
│Postgres│ │ Supabase│ │ Gemini   │ │ Jitsi  │ │ eSewa/Khalti │
│  DB    │ │ Storage │ │ AI API   │ │ Meet   │ │ Payments     │
└────────┘ └─────────┘ └──────────┘ └────────┘ └──────────────┘
             (files)   (onboarding,  (video     (mock in
                        feedback)    sessions)   prototype)
```

---

## Layers

### 1. Frontend (Next.js 14 + Tailwind CSS)
- App Router with server + client components.
- Pages: landing, onboarding, mentor browse/profile, chain detail, task page, dashboards, Skill Passport, verification, booking.
- State: React state + context; prototype uses seed data + localStorage.
- Auth: NextAuth for Google/LinkedIn OAuth; JWT stored for API calls.
- Deploy: Vercel.

### 2. Backend (Django + Django REST Framework)
- REST API serving JSON to the frontend.
- Apps (Django modules): `accounts`, `onboarding`, `mentors`, `chains`, `submissions`, `sessions`, `certifications`, `passport`, `ratings`, `collaboration`, `employers`, `organizations`.
- Auth: `djangorestframework-simplejwt` + `social-auth-app-django` (Google/LinkedIn).
- Verification: `PyPDF2`, `pytesseract`, `Pillow`, `rapidfuzz`, `requests`.
- Deploy: Railway.

### 3. Database (PostgreSQL)
- Relational store for all core entities (see 06_DATABASE_DESIGN.md).

### 4. External Services
- **Supabase Storage** — uploaded documents, files, avatars.
- **Gemini API** — AI onboarding conversation + career recommendations + optional feedback drafts.
- **Jitsi Meet** — free, low-bandwidth video sessions (`meet.jit.si/MentorDo-{sessionId}`).
- **eSewa / Khalti** — Nepal payment gateways (mocked in prototype).

---

## Prototype vs Production

| Concern | Prototype (demo) | Production |
|---|---|---|
| State/data | Seed data + localStorage | PostgreSQL via Django API |
| Auth | Simulated role selection | Full JWT + OAuth |
| Mentor verification | Simulated check animation | Real HTTP + OCR + fuzzy match |
| Payments | Mock success flow | eSewa/Khalti API |
| Video | Jitsi link (works live) | Jitsi link |
| AI onboarding | Scripted/Gemini | Gemini API |

The prototype runs fully in the browser for a bulletproof live demo; the architecture above is the production target described in the slides.

---

## Core Data Flow — Student Journey

```
1. Register/Login (JWT issued)
        ▼
2. AI Onboarding chat → career path chosen → mentor recommended
        ▼
3. Enroll with mentor → Task Chain assigned (Beginner)
        ▼
4. Attempt Task 1 → submit → mentor reviews (approve) → Task 2 unlocks
        ▼   (repeat through all tasks)
5. All tasks approved → book certification session (pay) → Jitsi link
        ▼
6. Live session: mentor verifies understanding + guides → PASS
        ▼
7. Certification issued → Skill Passport auto-updates → Intermediate unlocks
        ▼
8. Employer views Skill Passport → verifies cert → contacts student
```

---

## Security & Access Control
- JWT on every authenticated request; refresh token rotation.
- Role-based permissions enforced at the API layer (DRF permission classes).
- Level gating enforced server-side (403 if enrolling above certified level).
- Certifications are system-generated and immutable by users.
- File uploads validated for type/size; documents scanned server-side.
- Public endpoints (Skill Passport, cert verification) are read-only and expose no private data.

> **Security note:** All network-exposed endpoints require authentication except the intentionally public read-only Skill Passport and certification-verification pages. Payment and OAuth secrets live in environment variables, never in the repo.

---

## Scalability Design
- **Async task review** — mentors review on their own time; no synchronous bottleneck.
- **Automated verification** — no human review step for mentor onboarding.
- **Stateless API + JWT** — horizontal scaling of backend instances.
- **CDN-served frontend** (Vercel) — fast global delivery.
- **Organization bulk onboarding** — scales mentor supply quickly.
- **Low-bandwidth video** (Jitsi) — reaches rural users.

---

## Technology Justification

| Choice | Why |
|---|---|
| Next.js | SSR + fast UI, great DX, Vercel deploy, strong demo polish |
| Django + DRF | Batteries-included, fast to build secure REST APIs, great for auth + admin of data |
| PostgreSQL | Reliable relational DB, strong for relational education data |
| Jitsi | Free, no API key, works on low bandwidth — critical for rural Nepal |
| eSewa/Khalti | The payment methods Nepali users actually have |
| Gemini | Strong, affordable LLM for onboarding + feedback |
