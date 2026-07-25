# Learn-Beyond 📚

> A **YATRA 5.0 Ideathon** project by Team Procastinators, focused on **Quality Education** (UN Sustainable Development Goal 4).

**LearnBeyond** connects students with verified industry mentors through real **task chains** — not lectures. Students build a portfolio of proven work and earn a **Skill Passport** that employers can trust.

---

## 🌟 Overview

Millions of learners lack access to quality educational resources, personalized learning paths, and real-world experience that employers value. LearnBeyond addresses this by letting students **learn by doing real work**: they enroll in mentor-designed task chains, submit their work, get it reviewed by real mentors, and accumulate verified skills in a shareable Skill Passport.

## 💡 Key Features

- 📖 **Task Chains** — structured, real-world project tracks designed by mentors
- 🤝 **Verified Mentors** — industry professionals review student submissions
- 🎓 **Skill Passport** — a verifiable record of proven skills and levels
- 📊 **Progress Tracking** — enroll, submit tasks, and track advancement
- 🏅 **Certifications** — recognition for completed chains

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite, Tailwind CSS, React Router, Axios
- **Backend:** Django 5 + Django REST Framework, SimpleJWT (auth), django-cors-headers
- **Database:** SQLite (development)

## 📁 Project Structure

```
learn-Beyond/
├── backend/            # Django REST API (port 8000)
│   ├── accounts/       # Users & authentication
│   ├── mentors/        # Mentor profiles
│   ├── chains/         # Task chains
│   ├── submissions/    # Student task submissions
│   ├── passport/       # Skill Passport
│   ├── certifications/ # Certifications
│   ├── sessions_app/   # Sessions
│   └── config/         # Django settings & URLs
├── frontend/           # React + Vite app (port 5173)
├── docs/               # Project documentation
└── start-dev.bat       # One-command launcher (Windows)
```

## 🏁 Running Locally

The app has two parts: a Django REST backend (port 8000) and a React + Vite frontend (port 5173). Run each in its own terminal.

> **Windows note:** use `npm.cmd` instead of `npm` if PowerShell blocks the `npm.ps1` script.

### 1. Backend — Django API (http://localhost:8000)

```bash
cd backend

# First time only: create the virtualenv and install dependencies
python -m venv venv
venv\Scripts\python.exe -m pip install -r requirements.txt

# Apply migrations and load demo data (mentor, student, 3 task chains)
venv\Scripts\python.exe manage.py migrate
venv\Scripts\python.exe manage.py seed

# Start the API
venv\Scripts\python.exe manage.py runserver
```

### 2. Frontend — React app (http://localhost:5173)

```bash
cd frontend

# First time only
npm.cmd install

# Start the dev server (proxies /api to the backend on :8000)
npm.cmd run dev
```

Then open http://localhost:5173.

### One-command launch (Windows)

From the project root, run `start-dev.bat` to open both servers in separate windows.

### Demo logins (password: `demo1234`)

- **Student:** `sita@learnbeyond.np` — browse chains, enroll, submit tasks, view Skill Passport
- **Mentor:** `ramesh@learnbeyond.np` — review student submissions from the dashboard

## 📚 Documentation

Detailed design docs live in the [`docs/`](docs/) folder:

- Project overview, problem statement & vision
- User roles & features
- System architecture & database design
- API specification

## 👥 Team Procastinators

Built for the **YATRA 5.0 Ideathon** — Quality Education.

## 📄 License

This project is licensed under the MIT License.

---

_Made with ❤️ by Team Procastinators for YATRA 5.0 Ideathon — Quality Education_
