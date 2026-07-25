# 07 — API Specification

REST API served by Django + DRF. Base URL: `/api/`. JSON request/response. JWT in `Authorization: Bearer <token>` unless marked public.

---

## Conventions
- Auth header: `Authorization: Bearer <access_token>`
- Content type: `application/json` (multipart for file uploads)
- Standard status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
- Errors: `{ "error": "message", "details": {...} }`

---

## 1. Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register/` | public | Create account (name, email, password, role) |
| POST | `/api/auth/verify-email/` | public | Confirm email token |
| POST | `/api/auth/login/` | public | Return access + refresh JWT |
| POST | `/api/auth/refresh/` | public | Refresh access token |
| POST | `/api/auth/logout/` | user | Invalidate refresh token |
| GET | `/api/auth/me/` | user | Current user info |
| GET | `/api/auth/oauth/google/` | public | Google OAuth redirect |
| GET | `/api/auth/oauth/linkedin/` | public | LinkedIn OAuth redirect |

**Register request:**
```json
{ "name": "Sita Rai", "email": "sita@example.com", "password": "•••", "role": "student" }
```
**Login response:**
```json
{ "access": "jwt...", "refresh": "jwt...", "user": { "id": "...", "role": "student" } }
```

---

## 2. Student Onboarding (AI)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/onboarding/chat/` | student | Send message, get AI reply |
| POST | `/api/onboarding/complete/` | student | Save selected career path + recommendations |
| GET | `/api/student/recommendations/` | student | Recommended chains + mentors |

**Chat request/response:**
```json
// req
{ "message": "I study BBS and like accounting" }
// res
{ "reply": "Great! A few more questions...", "recommendations": null }
// final res
{ "reply": "Here are 3 paths for you", "recommendations": [
  { "path": "Junior Accountant", "why": "Your BBS + numbers interest fit this." },
  { "path": "Business Analyst", "why": "..." },
  { "path": "Financial Advisor", "why": "..." }
] }
```

---

## 3. Mentors & Verification

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/mentor/apply/` | mentor | Submit application + document (multipart) |
| GET | `/api/mentor/verify-status/` | mentor | Verification result (4 checks) |
| POST | `/api/mentor/availability/` | mentor | Set available time slots |
| GET | `/api/mentors/` | user | List verified mentors (filters below) |
| GET | `/api/mentors/{id}/` | public | Single mentor profile |

**GET /api/mentors/ query params:** `skill`, `level`, `min_rating`, `max_rate`, `sort` (rating/sessions/price)

**Verify-status response:**
```json
{ "is_verified": true, "checks": {
  "linkedin": true, "document": true, "text_scan": true, "name_match": true },
  "verified_at": "2026-07-25T10:00:00Z" }
```

---

## 4. Task Chains & Tasks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/chains/` | user | List published chains (filter skill, level) |
| GET | `/api/chains/{id}/` | user | Chain detail with tasks + lock states |
| POST | `/api/chains/` | mentor | Create a chain |
| POST | `/api/chains/{id}/tasks/` | mentor | Add a task |
| POST | `/api/enrollments/` | student | Enroll in a chain (403 if above level) |
| GET | `/api/enrollments/` | student | My enrolled chains + progress |

**Chain detail response (excerpt):**
```json
{ "id": "...", "title": "Junior Accountant", "level": "beginner",
  "mentor": { "name": "Ramesh Sharma", "verified": true },
  "tasks": [
    { "id": "t1", "title": "Record transactions", "order": 1, "status": "completed" },
    { "id": "t2", "title": "Spot ledger errors", "order": 2, "status": "current" },
    { "id": "t3", "title": "Calculate VAT", "order": 3, "status": "locked" }
  ], "progress": 0.4 }
```

---

## 5. Submissions & Review

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/submissions/` | student | Submit work (text/file/github/live/code) |
| GET | `/api/submissions/{id}/` | user | Submission detail |
| PATCH | `/api/submissions/{id}/hints/` | student | Record hint usage |
| GET | `/api/mentor/submissions/pending/` | mentor | Review queue |
| PATCH | `/api/submissions/{id}/review/` | mentor | Approve / revise / reject + feedback |
| POST | `/api/submissions/{id}/ai-feedback/` | mentor | Generate AI feedback draft |

**Submit request (IT example):**
```json
{ "task_id": "t2", "submission_type": "github_url",
  "github_url": "https://github.com/sita/portfolio" }
```
**Review request:**
```json
{ "status": "approved", "mentor_feedback": "Good work, watch the VAT on invoice #3.",
  "feedback_tags": ["good_job"] }
```

---

## 6. Sessions & Payment

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/mentors/{id}/availability/` | student | Open slots |
| POST | `/api/sessions/book/` | student | Book a slot |
| POST | `/api/payments/initiate/` | student | Start payment (mock/real) |
| POST | `/api/payments/verify/` | student | Confirm payment success |
| GET | `/api/sessions/{id}/` | user | Session detail + video link |
| PATCH | `/api/sessions/{id}/outcome/` | mentor | Record pass/needs_work + notes |
| PATCH | `/api/sessions/{id}/cancel/` | user | Cancel/reschedule |

**Book response:**
```json
{ "session_id": "s1", "scheduled_at": "2026-07-28T15:00:00Z",
  "fee_amount": 300, "video_link": "https://meet.jit.si/MentorDo-s1",
  "payment_status": "pending" }
```
**Outcome request:**
```json
{ "outcome": "passed", "originality_verified": true,
  "mentor_notes": "Explained ledger logic well, reproduced VAT calc live." }
```

---

## 7. Certifications & Progress

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/certifications/issue/` | mentor | Issue cert after passed session |
| GET | `/api/certifications/{student_id}/` | user | Student's certifications |
| GET | `/api/verify/{cert_unique_id}/` | public | Public certification verification |
| GET | `/api/student/progress/{skill}/` | student | Level progress for a skill |

**Public verify response:**
```json
{ "valid": true, "student": "Sita Rai", "skill": "Accounting",
  "level": "intermediate", "certified_by": "Ramesh Sharma, CA — Deloitte Nepal",
  "issued_at": "2026-07-25", "status": "Valid" }
```

---

## 8. Skill Passport & Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/passport/{username}/` | public | Public Skill Passport |
| GET | `/api/student/profile/` | student | Own full profile |
| PATCH | `/api/student/profile/` | student | Update editable fields |
| GET | `/api/student/activity/` | student | Activity feed |

---

## 9. Ratings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/ratings/` | student | Rate mentor after a completed session |
| GET | `/api/mentors/{id}/ratings/` | public | Mentor's reviews |

**Rating request:**
```json
{ "session_id": "s1", "overall": 5, "knowledge": 5, "communication": 4,
  "helpfulness": 5, "review_text": "Clear explanations, caught my errors." }
```

---

## 10. Collaboration

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/chains/{id}/collab/` | student | Study group + resources + forum |
| POST | `/api/collab/resource/` | user | Share a resource |
| POST | `/api/collab/forum/` | user | Post a forum question |
| PATCH | `/api/collab/{id}/upvote/` | user | Upvote a resource |

---

## 11. Employers

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/employer/register/` | employer | Register company |
| GET | `/api/employer/students/` | employer | Browse students (filters: skill, level, location) |
| GET | `/api/employer/students/{id}/` | employer | View a student's passport |
| POST | `/api/employer/contact/` | employer | Contact a student |

---

## 12. Organizations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/org/register/` | organization | Register partner org |
| POST | `/api/org/mentors/bulk/` | organization | Bulk-onboard mentors |
| POST | `/api/org/chains/sponsor/` | organization | Sponsor a Task Chain |
| GET | `/api/org/graduates/` | organization | View certified graduates |

---

## Permissions Summary

| Endpoint group | Student | Mentor | Employer | Org | Public |
|---|---|---|---|---|---|
| auth | ✅ | ✅ | ✅ | ✅ | register/login |
| onboarding | ✅ | — | — | — | — |
| mentors (write) | — | ✅ | — | — | — |
| mentors (read) | ✅ | ✅ | ✅ | ✅ | profile |
| chains (write) | — | ✅ | — | via org | — |
| submissions (create) | ✅ | — | — | — | — |
| submissions (review) | — | ✅ | — | — | — |
| sessions | ✅ | ✅ | — | — | — |
| certifications (issue) | — | ✅ | — | — | — |
| verify cert | ✅ | ✅ | ✅ | ✅ | ✅ |
| passport (read) | ✅ | ✅ | ✅ | ✅ | ✅ |
| employers | — | — | ✅ | — | — |
| organizations | — | — | — | ✅ | — |

> All write endpoints require authentication and role checks. Public endpoints are read-only and expose no private data.
