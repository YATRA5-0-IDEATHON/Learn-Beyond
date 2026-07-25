# LearnBeyond — Design System & UI Specification

> Platform tagline: **"Learn by Doing Real Work. Get Hired for Real Skills."**
> Positioning tag used in footer: **"Built for Nepal's future."**
> Note: some legacy screens show the product name as "MentorDo" — treat this as the same product; standardize on **LearnBeyond** going forward.

---

## 1. Brand Identity

### 1.1 Logo
- Icon: an open book rendered in outline form, with an orange upward-pointing arrow rising out of the center pages (symbolizing growth/progress through learning).
- Wordmark: **"Learn"** in dark indigo/navy, **"Beyond"** in orange — set in a bold sans-serif.
- Lockup: icon + wordmark side by side, used top-left of every page's navbar (small ~32px version) and full-size on the standalone logo asset.

### 1.2 Brand Voice
- Aspirational, career-focused, locally-rooted (Nepal-specific references: NPR currency, Kathmandu, Nepali companies like Nabil Bank, F1Soft, Daraz Nepal, Fusemachines, Pathao).
- Copy mixes formal/professional tone (mentor-facing) with warm, encouraging tone (student-facing celebration screens).

---

## 2. Color Palette

| Role | Approx. Hex | Usage |
|---|---|---|
| **Primary Indigo/Navy** | `#2A1F7D` – `#332B96` | Primary buttons, active nav states, sidebar highlight, hero banners, headings on dark surfaces |
| **Primary Navy (darker, text)** | `#1B1440` | Large headline text, footer background accents |
| **Accent Orange/Gold** | `#F5A623` – `#F7A93C` | Primary CTAs ("Join as Mentor," "Register as Student," "Submit Revision"), highlight badges, star ratings, arrow icon in logo |
| **Success Green** | `#0E9F6E` – `#22C55E` | "Verified," "MET" rubric status, online status dots, positive progress bars, certification badges |
| **Warning Amber** | `#F59E0B` (light bg `#FEF3E2`) | "Revision Required" banners, "REVISION" rubric tags, pending states |
| **Error/Reject Red** | `#EF4444` | Reject icon/button in verification actions |
| **Background (page)** | `#F4F4FB` / `#F6F6FC` | App shell background, very light lavender-gray |
| **Surface (card)** | `#FFFFFF` | Cards, panels, modals |
| **Surface (muted/inset)** | `#EFEFF8` / `#F0F0FA` | Nested panels (e.g., quote blocks, chat bubbles from mentor), skill tag pills |
| **Text primary** | `#1A1A2E` | Headings, key labels |
| **Text secondary/gray** | `#6B7280` | Descriptions, meta text, timestamps |
| **Border/divider** | `#E5E5F0` | Card borders, table dividers |

**Status pill colors:**
- Expert = deep indigo text on light lavender pill
- Intermediate = amber/orange text on light peach pill
- Beginner = neutral gray pill
- Verified/Elite Performance/Met = green pill
- Steady Progress = neutral lavender pill

---

## 3. Typography

Two-typeface system: a **serif display face** for headlines/brand moments, and a **sans-serif** for UI/body text.

| Style | Font family (equiv.) | Weight | Usage |
|---|---|---|---|
| Display / Hero H1 | Serif (e.g., Playfair Display / Georgia) | Bold, often with italic accent word | Landing hero ("Learn by *Doing* Real Work"), page titles ("Ratio Analysis & Financial Forecasting," "Certificate of Completion," "Congratulations, Aayush!") |
| Section headings | Serif | Semi-bold | Card titles ("Pending Verifications Queue," "Mentorship Task Chains," "Three Paths, One Goal") |
| Logo wordmark | Sans-serif | Bold | "LearnBeyond" nav logo |
| Body / UI text | Sans-serif (e.g., Inter / system-ui) | Regular / Medium | Paragraphs, form fields, nav links, table content, buttons |
| Micro/labels | Sans-serif, uppercase, letter-spaced | Medium, small size (~11–12px) | Stat card labels ("ACTIVE STUDENTS," "TASK CHAINS," "SUBMITTED"), section eyebrows |
| Numeric emphasis | Serif or bold sans | Bold, large | Big stat numbers ("24," "156," "4.9," "2,400+") |

Italic serif is used selectively for emotional emphasis (e.g., "Doing," "Real Skills," student first name in congratulations headers).

---

## 4. Layout & Structure

### 4.1 Global Navigation (top bar) — used on nearly every page
- Left: logo lockup
- Center: primary nav links — `Browse Mentors | Task Chains | Skill Passport | Dashboard` (active link shown in indigo/bold, others gray)
- Right: search bar (rounded, light-lavender fill, magnifier icon, placeholder "Search..."), notification bell (with red dot when unread), user avatar (circular, small).

### 4.2 Dashboard Shell (mentor-facing pages)
- Left sidebar (fixed, ~320px), light lavender background:
  - Nav items with icons: Dashboard, My Students, Task Verification, Earnings, Profile. Active item = solid navy pill background, white text.
  - Bottom of sidebar: "MENTOR TIER" card, dark navy background, gold text (e.g., "Platinum Mentor").
- Main content area: white/light background, grid of cards.

### 4.3 Content Page Shell (student-facing task/browse pages)
- No sidebar; full-width top nav, then breadcrumb row (e.g., `Task Chains > Advanced Interface Systems`), then two-column layout: main content (left/center, ~65%) + right rail summary/action card (~35%).

### 4.4 Card & Panel Style
- Corner radius: large, ~16–20px on major cards; ~8–12px on buttons/pills/inputs.
- Shadow: soft, low-opacity drop shadow for elevation on white cards over the lavender background.
- Padding: generous internal padding (~24–32px).
- Dividers: thin light-gray horizontal rules to separate list rows within a card (e.g., pending verification queue rows).

### 4.5 Footer (consistent across all pages)
4-column layout on dark-tinted or light-lavender background:
1. Brand block: logo + tagline + social/share icons
2. **Platform**: Browse Mentors, Tasks, Companies
3. **Community**: Mentors, Success Stories
4. **Support**: FAQ, Contact
Bottom bar: `© 2024 LearnBeyond. All rights reserved.` (left) + green pill badge `Built for Nepal's future` (right).

---

## 5. Core Components

### 5.1 Buttons
- **Primary (Navy)**: solid dark indigo, white text, fully rounded corners (pill or large-radius rect). Used for main actions: "Book a Session," "Start Next Task," "View Profile," "Verify Task."
- **Secondary (Outline/Ghost Navy)**: navy border or light lavender fill, navy text. Used for secondary actions: "Share Achievement," "Partner as a Company."
- **Accent (Orange)**: solid gold/orange, dark or white text. Used for highest-priority conversions: "Register as Student," "Join as Mentor," "Create Student Account," "Submit Revision," "Contact for Employment."
- **Icon buttons**: circular, minimal, for send/upload/share actions (chat send arrow, notification bell).
- All buttons: medium-large tap targets, subtle shadow on primary/accent variants.

### 5.2 Badges / Status Pills
- Rounded-full small pills with colored background + colored/dark text.
- Examples: `Verified` (green, with check icon), `Expert / Intermediate / Beginner` (skill level), `Elite Performance / Steady Progress` (student status), `MET / REVISION` (rubric verdict), `Revision Required` (amber banner pill with icon), `Submission Verified` (green pill).

### 5.3 Stat Cards
- Row of 3–4 equal-width white cards at top of dashboards.
- Structure: uppercase gray micro-label → large bold number → small supporting text/icon (e.g., "+3 this week," a small illustrative icon in the corner).
- One card in the row often "featured" with a solid navy background + gold accents to stand out (e.g., Mentor Rating card, Mentor Tier card).

### 5.4 Progress Indicators
- **Linear bar**: thin rounded track (light lavender) with filled navy/green segment; used for course/task progress ("60%", "33% Submitted," Skill Passport level bars).
- **Circular/donut chart**: center label + percentage (e.g., "75% Capacity" mentorship distribution), surrounded by a small legend with colored dots.
- **Radar/spider chart**: used on Skill Passport ("Skill Intensity") plotting multiple skill axes (Reporting, Taxes, Analysis, Audit).
- **Step tracker (vertical)**: numbered circular nodes connected by a vertical line, each with a title + status (Completed/checkmark, Current/filled, Locked/lock icon) — used in Task Chain detail sidebar.

### 5.5 Avatars & People
- Circular profile photos, small green dot for online/active status overlaid at bottom-right.
- Paired name + role/title text beside avatar (e.g., "Dr. Anish Joshi — Verified Mentor").
- Stacked/overlapping avatar groups with "+N" overflow count to show group participation ("+12 others finished this task today").

### 5.6 Rating & Reviews
- Star icon row (gold/orange filled stars) + numeric rating + review count in parentheses.
- Review cards: avatar, name, role/company, star rating, italicized quote text.

### 5.7 Forms & Inputs
- Search input: rounded-full, light lavender fill, left magnifier icon, placeholder text.
- Text areas: white background, light border, rounded corners, placeholder guidance text (e.g., "Write your submission notes here...").
- Rich text toolbar (Bold/Italic/Link/List icons) above submission text areas.
- File upload dropzone: dashed border rounded rectangle, centered cloud-upload icon, "Drag & drop files or **browse**" text, file type/size constraints noted below.
- Checkboxes: simple square, used in verification rubrics.
- Date/slot selection: pill-style toggle buttons for date and time slots (selected = filled navy, unselected = outlined/light).
- Sliders: for filter ranges (e.g., Minimum Rating filter).

### 5.8 Filters (Browse/Listing pages)
- Left filter sidebar: section headers (Skills, Level, Minimum Rating, Price), checkboxes for multi-select, pill-toggle buttons for single-select level filters, dual min/max number inputs for price range, range slider.

### 5.9 Chat / Conversation UI
- Two-column message bubbles: incoming (light lavender, left-aligned, with small avatar) vs. outgoing/mentor reply (solid navy, white text, right-aligned).
- Timestamp in small gray text below each bubble.
- Persistent input bar at the bottom with placeholder + circular send button (AI chat "Aira" and mentor/student conversation threads share this pattern).

### 5.10 Timeline / Activity Feed
- Vertical line connector with colored dot markers per event (date/time label + description card), used in "Recent Impact" mentor dashboard widget.

### 5.11 Tables
- Clean row-based tables with uppercase gray column headers, avatar+name in first column, inline progress bars and status pills in data cells (Student Performance Overview).

### 5.12 Certificates & Passport Cards
- Ornate certificate card: light decorative border/seal, centered serif "Certificate of Completion" heading, recipient name emphasized with underline, signatures row (mentor + academic board), verification ID + verify URL in top corner, watermark logo faded in background.
- Skill Passport profile page: public-facing resume-style layout — hero header (name, level badge, verification checkmark, location/join date/tasks-verified meta), certification cards grid, skill radar chart, "Ready for Hire" CTA panel, recent feedback quote block.

### 5.13 Task Chain / Module Cards
- Small card per module level: colored top accent bar or level icon, title, mini progress bar, completion state (Completed / In Progress % / Locked with padlock icon).

---

## 6. Iconography
Simple, thin-stroke line icons (outline style, ~1.5px stroke) throughout: book, checkmark-shield, chat bubble, upload cloud, bell, search, star, briefcase, chart/trending-up, palette, lock, share, users, RSS/feed. Icons are paired consistently with labels rather than used alone (except in sidebar nav and stat cards).

---

## 7. Page Inventory & Key Layouts

1. **Landing / Home** — Hero (headline + dual CTA buttons + device mockup collage), stat strip (dark navy band with 3 big numbers), "Three Paths, One Goal" 3-column cards (Students/Mentors/Employers), live task-chain module strip, mentor showcase cards, closing CTA banner (dark navy, dual buttons), footer.
2. **Mentor Dashboard** — Sidebar nav, top stat cards (Active Students, Pending Review, Tasks Verified, Mentor Rating), Pending Verifications Queue list, Student Performance Overview table, right rail Recent Impact timeline + Mentorship Distribution donut chart.
3. **Mentor Public Profile** — Cover banner + avatar, stats row (sessions/rating/task chains), skill tag pills by level, task chain cards, review cards, right-side sticky booking panel (price, date/slot pickers, CTA, "why mentor with X" checklist).
4. **Student Task Chain Detail** — Left rail: chain title, assigned mentor card, overall progress %, vertical step tracker. Main panel: current task brief + deliverables list, expandable hint box, rich-text submission field, file dropzone, submit button, social proof row.
5. **Task Approved / Congratulations Screen** — Celebration header with student name in italic serif, certificate/skill-badge preview card (right), Skill Passport XP/level update panel, Mentor Verdict quote block, "Up next" teaser card, dark CTA banner (Share to LinkedIn / Copy Passport Link).
6. **Mentor Task Verification — Revision Detail (student-facing view of feedback)** — Status banner (Revision Required), title/description, mentor feedback quote card, Assessment Rubric checklist (Met/Revision states), conversation thread, right rail: deadline countdown, last submitted file, resubmit upload panel, revision tip callout.
7. **Mentor Task Verification — Review Detail (mentor-facing)** — Submission header (task, student, SLA countdown), student's written approach + attached file, interaction history thread, right rail: Verification Rubric checkboxes, Mentor Verdict action (Approve/Revision/Reject icons), comment textarea, Verify Task / Save for Later buttons.
8. **Skill Passport (public student profile)** — Shareable profile header with copy-link bar, certifications grid, skill radar chart, active task chains with progress, "Ready for Hire" CTA card, recent feedback quote.
9. **Certificate of Completion** — Centered ornate certificate card, Final Performance stats panel, Skill Mastery Breakdown bars, Mentor's Note quote, Share/Download actions, "Continue Your Growth" recommended course cards.
10. **AI Career Guidance ("Aira") Chat Onboarding** — Split layout: left intro panel (assistant avatar, name, description, Discovery Phase progress bar), right live chat panel with guided question + input bar.
11. **Browse Mentors (Listing/Search)** — Left filter sidebar (Skills, Level, Minimum Rating, Price), top search bar + sort dropdown, responsive grid of mentor cards (photo, name, role, company, rating, skill tags, level badge, starting price, View Profile button), pagination footer.

---

## 8. Imagery Style
- Real photographic portraits (professional headshots, natural lighting) for mentors and students — warm, candid, workplace-context photos (laptops, offices, desks).
- Device mockup composites (phone + laptop) for hero sections showing the product in use.
- Illustrative/AI-avatar imagery for the "Aira" assistant (a soft-styled robotic/humanoid avatar) — distinct from real human photography to signal AI vs. human mentors.

---

## 9. Interaction & Tone Notes
- Micro-copy is encouraging and specific (mentor feedback quotes are substantive, not generic).
- Locked content uses padlock iconography + muted gray to clearly communicate progression gating.
- Time-sensitive elements (SLA countdown, revision deadline) are visually flagged with warm/red accent color and countdown framing to create gentle urgency.
- Social proof is used liberally: reviewer counts, "+N others finished this task today," "Top 2% Mentor," "Top 15% Skill Rank."
- Currency and locale: Nepali Rupees (NPR), Nepali cities/companies used throughout for local relevance.

---

## 10. Suggested Design Tokens (for implementation)

```
--color-primary: #2A1F7D;
--color-primary-dark: #1B1440;
--color-accent: #F5A623;
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #EF4444;
--color-bg: #F5F5FB;
--color-surface: #FFFFFF;
--color-surface-muted: #EFEFF8;
--color-text-primary: #1A1A2E;
--color-text-secondary: #6B7280;
--color-border: #E5E5F0;

--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 20px;
--radius-pill: 999px;

--font-display: "Playfair Display", Georgia, serif;
--font-body: "Inter", system-ui, sans-serif;

--shadow-card: 0 4px 20px rgba(30, 20, 90, 0.06);
```

---

*This document should serve as the single source of truth for recreating LearnBeyond's visual language across new screens and features. Update it as new patterns are introduced.*
