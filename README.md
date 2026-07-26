# Learn-Beyond

Learn-Beyond is a project built for the YATRA 5.0 Ideathon by Team Procastinators. It focuses on Quality Education (UN Sustainable Development Goal 4).

The idea is simple: instead of learning from lectures, students learn by doing real work. They enroll in task chains designed by industry mentors, submit their work, and get it reviewed by those mentors. As they complete tasks, they build a verifiable Skill Passport that employers can actually trust.

## What it does

Most learners never get the hands-on, mentor-reviewed experience that employers look for. Learn-Beyond tries to close that gap. A student picks a skill, works through a chain of practical tasks, and a real mentor reviews each submission. Once a chain is finished, the mentor runs a short video session to verify the work is genuine and issues a certificate.

The part we're most excited about is what happens after certification. A mentor can then hire the students they certified for real, paid projects. The student does the work, the mentor reviews it, and the payment is split automatically (the platform keeps 20 percent, the same cut used for paid sessions). Those earnings show up on the student's public portfolio as proof of real, paid experience.

## Main features

- Task chains: structured, real-world project tracks created by mentors
- Verified mentors: industry professionals who review submissions
- Skill Passport: a shareable, verifiable record of proven skills
- Certifications: issued after a final video review of the completed chain
- Paid projects: mentors hire certified students for real work, with an automatic 80/20 payout split
- Public portfolio: shows verified tasks, mentor grades, certifications, and real project earnings

## Tech stack

- Frontend: React 18 with Vite, Tailwind CSS, React Router, Axios
- Backend: Django 5 with Django REST Framework, SimpleJWT for auth, and django-cors-headers
- Database: SQLite for development

## Project structure

```
learn-Beyond/
├── backend/              Django REST API (port 8000)
│   ├── accounts/         Users and authentication
│   ├── mentors/          Mentor profiles
│   ├── chains/           Task chains
│   ├── submissions/      Student task submissions
│   ├── certifications/   Certifications
│   ├── collaborations/   Paid projects between mentors and certified students
│   ├── passport/         Skill Passport and public portfolio
│   ├── sessions_app/     Video sessions
│   └── config/           Django settings and URLs
├── frontend/             React + Vite app (port 5173)
├── docs/                 Project documentation
└── start-dev.bat         One-command launcher for Windows
```

## Running it locally

The app has two parts: a Django backend on port 8000 and a React frontend on port 5173. Run each in its own terminal.

On Windows, if PowerShell blocks the `npm.ps1` script, use `npm.cmd` instead of `npm`.

### Backend (http://localhost:8000)

```bash
cd backend

# First time only: create the virtualenv and install dependencies
python -m venv venv
venv\Scripts\python.exe -m pip install -r requirements.txt

# Apply migrations and load demo data
venv\Scripts\python.exe manage.py migrate
venv\Scripts\python.exe manage.py seed

# Optional: create a completed paid project so you can see the earnings flow
venv\Scripts\python.exe manage.py demo_project

# Start the API
venv\Scripts\python.exe manage.py runserver
```

### Frontend (http://localhost:5173)

```bash
cd frontend

# First time only
npm.cmd install

# Start the dev server (it proxies /api to the backend on port 8000)
npm.cmd run dev
```

Then open http://localhost:5173.

On Windows you can also run `start-dev.bat` from the project root to launch both servers at once.

## Demo logins

All demo accounts use the password `demo1234`.

- Student: `sita@learnbeyond.np` — browse chains, enroll, submit tasks, view the Skill Passport
- Mentor: `ramesh@learnbeyond.np` — review submissions from the dashboard
- Certified student: `pooja@learnbeyond.np` — after running `demo_project`, this account has a completed paid project and real earnings on the portfolio
- Mentor for paid projects: `rajan@learnbeyond.np` — see the project posted and the student's approved work

To try the paid projects feature, log in and open the Paid Projects link from the dashboard, or go to http://localhost:5173/projects. The page shows the mentor view or the student view depending on who is logged in. Note that a mentor can only invite students who hold an active certification in that project's skill.

## Documentation

More detailed design docs are in the [`docs/`](docs/) folder, covering the project overview, problem statement, user roles, features, system architecture, database design, and API specification.

## Team

Built by Team Procastinators for the YATRA 5.0 Ideathon.

## License

MIT License.
