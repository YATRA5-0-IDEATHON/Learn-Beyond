@echo off
REM Launches the LearnBeyond backend and frontend in separate terminal windows.
REM Run this from anywhere: double-click it, or run start-dev.bat from a terminal.

set "ROOT=%~dp0"
set "VENV_PY=%ROOT%backend\venv\Scripts\python.exe"

if not exist "%VENV_PY%" (
    echo [ERROR] Virtualenv not found at:
    echo     %VENV_PY%
    echo.
    echo Create it first with:
    echo     cd backend
    echo     python -m venv venv
    echo     venv\Scripts\python.exe -m pip install -r requirements.txt
    echo     venv\Scripts\python.exe manage.py migrate
    echo     venv\Scripts\python.exe manage.py seed
    echo.
    pause
    exit /b 1
)

echo Starting LearnBeyond backend (http://localhost:8000)...
REM IMPORTANT: uses the venv Python, NOT the global one, so DRF etc. are found.
start "LearnBeyond Backend" cmd /k "cd /d "%ROOT%backend" && "%VENV_PY%" manage.py runserver"

echo Starting LearnBeyond frontend (http://localhost:5173)...
start "LearnBeyond Frontend" cmd /k "cd /d "%ROOT%frontend" && npm.cmd run dev"

echo.
echo Both servers are launching in separate windows.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo.
echo Demo logins (password: demo1234)
echo   Student: sita@learnbeyond.np
echo   Mentor:  ramesh@learnbeyond.np
