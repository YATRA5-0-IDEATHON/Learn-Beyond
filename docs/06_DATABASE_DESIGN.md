rn# 06 — Database Design

PostgreSQL relational schema. Types are indicative (Django/DRF field types).

---

## Entity Relationship Overview

```
User ──1:1── StudentProfile
User ──1:1── MentorProfile ──*── TaskChain ──*── Task
User ──1:1── EmployerProfile
Organization ──1:*── MentorProfile

Student ──*── Enrollment ──1── TaskChain
Task ──1:*── Submission ──*:1── Student
TaskChain ──1:*── Session ──*:1── Student/Mentor
Session ──1:1── Certification
Student ──1:*── Certification (aggregated into SkillPassport)
Session ──1:1── Rating
```

---

## Tables

### users
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | varchar | |
| email | varchar (unique) | |
| password | varchar | bcrypt hashed (null if OAuth-only) |
| role | enum | student / mentor / employer / organization |
| auth_provider | enum | email / google / linkedin |
| is_email_verified | bool | |
| created_at | timestamp | |

### student_profiles
| Field | Type | Notes |
|---|---|---|
| user_id | UUID (FK→users) | |
| avatar_url | varchar | |
| bio | text | |
| location | varchar | city/district |
| current_study_field | varchar | e.g. "BBS", "BSc CSIT" |
| career_goal | varchar | selected AI path |
| skill_interests | text[] | |
| linkedin_url | varchar | |
| github_url | varchar | IT students |
| portfolio_url | varchar | |
| headline | varchar | auto-generated |
| enrolled_mentor_id | UUID (FK→mentor_profiles) | current mentor |
| onboarding_complete | bool | |
| profile_visibility | enum | public / private |

### mentor_profiles
| Field | Type | Notes |
|---|---|---|
| user_id | UUID (FK→users) | |
| linkedin_url | varchar | |
| job_title | varchar | |
| employer | varchar | |
| years_experience | int | |
| skills | text[] | |
| teaching_levels | jsonb | e.g. {"accounting":["beginner","intermediate"]} |
| session_rate | int | NPR |
| bio | text | |
| document_url | varchar | uploaded credential |
| is_verified | bool | |
| verification_checks | jsonb | {linkedin,document,text_scan,name_match} |
| verified_at | timestamp | |
| rating | float | avg |
| total_sessions | int | |
| organization_id | UUID (FK→organizations) | nullable |

### employer_profiles
| Field | Type | Notes |
|---|---|---|
| user_id | UUID (FK→users) | |
| company_name | varchar | |
| company_size | varchar | |
| industry | varchar | |
| subscription_plan | enum | free / pro |

### organizations
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | varchar | |
| is_verified | bool | |
| subscription_plan | enum | basic / premium |
| created_at | timestamp | |

---

### task_chains
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| mentor_id | UUID (FK→mentor_profiles) | |
| skill | varchar | accounting/web_dev/design/business/healthcare |
| level | enum | beginner / intermediate / expert |
| title | varchar | |
| description | text | |
| sponsored_by_org_id | UUID (FK→organizations) | nullable |
| is_published | bool | |
| created_at | timestamp | |

### tasks
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| chain_id | UUID (FK→task_chains) | |
| title | varchar | |
| description | text | |
| order_number | int | sequence |
| difficulty | enum | easy / medium / hard |
| hints | text[] | revealed one at a time |
| expected_output_type | enum | text / file / github_url / live_url / code / both |

### enrollments (student_chain_enrollments)
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| student_id | UUID (FK) | |
| chain_id | UUID (FK→task_chains) | |
| current_task_order | int | |
| status | enum | in_progress / completed / certified |
| enrolled_at | timestamp | |
| completed_at | timestamp | |

---

### submissions
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| task_id | UUID (FK→tasks) | |
| student_id | UUID (FK) | |
| attempt_number | int | 1–3 |
| submission_type | enum | text/file/github_url/live_url/code |
| text_content | text | nullable |
| file_url | varchar | nullable |
| github_url | varchar | nullable |
| live_url | varchar | nullable |
| code_content | text | nullable |
| github_check_passed | bool | |
| live_url_check_passed | bool | |
| hints_used | int | 0–3 |
| status | enum | pending / approved / revision_requested / rejected |
| mentor_feedback | text | |
| feedback_tags | text[] | |
| ai_suggested_feedback | text | nullable |
| submitted_at | timestamp | |
| reviewed_at | timestamp | |
| reviewed_by | UUID (FK→mentor_profiles) | |

---

### sessions
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| mentor_id | UUID (FK) | |
| student_id | UUID (FK) | |
| chain_id | UUID (FK→task_chains) | |
| scheduled_at | timestamp | |
| duration_minutes | int | |
| video_link | varchar | Jitsi URL |
| fee_amount | int | NPR |
| platform_commission | int | |
| mentor_earnings | int | |
| payment_status | enum | pending / paid / refunded |
| payment_method | enum | esewa / khalti / card / mock |
| session_status | enum | scheduled / completed / cancelled / needs_followup |
| originality_verified | bool | |
| mentor_notes | text | guidance given |
| outcome | enum | passed / needs_work |
| tasks_to_redo | UUID[] | if needs_work |
| created_at | timestamp | |
| completed_at | timestamp | |

### mentor_availability
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| mentor_id | UUID (FK) | |
| day_of_week | int | 0–6 |
| start_time | time | |
| end_time | time | |
| is_booked | bool | |

---

### certifications
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| student_id | UUID (FK) | |
| skill | varchar | |
| level | enum | beginner/intermediate/expert/graduate |
| chain_id | UUID (FK) | |
| session_id | UUID (FK→sessions) | |
| certified_by | UUID (FK→mentor_profiles) | |
| mentor_notes | text | endorsement |
| cert_unique_id | varchar (unique) | public verification code |
| issued_at | timestamp | |
| is_active | bool | revocable if fraud |

### student_skill_progress
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| student_id | UUID (FK) | |
| skill | varchar | |
| current_level | enum | none/beginner/intermediate/expert/graduate |
| beginner_cert_id | UUID (FK→certifications) | |
| intermediate_cert_id | UUID (FK→certifications) | |
| expert_cert_id | UUID (FK→certifications) | |
| graduate_issued_at | timestamp | |
| mentor_id | UUID (FK) | |

---

### ratings
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| session_id | UUID (FK→sessions, unique) | one per session |
| mentor_id | UUID (FK) | |
| student_id | UUID (FK) | |
| overall | int | 1–5 |
| knowledge | int | 1–5, optional |
| communication | int | 1–5, optional |
| helpfulness | int | 1–5, optional |
| review_text | text | |
| created_at | timestamp | |

---

### collaboration
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| chain_id | UUID (FK→task_chains) | |
| type | enum | study_group / resource / forum_post |
| created_by | UUID (FK→users) | |
| content | text | |
| upvotes | int | resources |
| created_at | timestamp | |

### employer_contacts
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| employer_id | UUID (FK) | |
| student_id | UUID (FK) | |
| message | text | |
| status | enum | sent / read / responded |
| created_at | timestamp | |

---

## Key Relationships & Rules
- A student has one active mentor per skill (can change between levels).
- A Task Chain belongs to one mentor, one skill, one level.
- A submission belongs to one task and one student; up to 3 attempts.
- A session produces at most one certification and one rating.
- Certifications are immutable by users; only system issues them; can be revoked (`is_active=false`).
- Level gating: enrollment in a chain requires `student_skill_progress.current_level` >= chain prerequisite.

## Indexes (performance)
- `users.email` (unique), `certifications.cert_unique_id` (unique), `mentor_profiles.skills` (GIN), `mentor_profiles.teaching_levels` (GIN), `submissions.status`, `sessions.scheduled_at`, `enrollments.student_id`.
