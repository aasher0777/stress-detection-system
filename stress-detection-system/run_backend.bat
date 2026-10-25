@echo off
title Amatarashu - Backend Server (FastAPI)
echo ======================================================================
echo Starting Amatarashu Stress Detection Backend (Python / FastAPI)...
echo ======================================================================

:: Automatically free port 8000 if another process is occupying it
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo [*] Port 8000 occupied by PID %%a. Freeing port 8000...
    taskkill /F /PID %%a >nul 2>&1
)

cd /d "%~dp0backend"

:: Detect Python executable (venv or system)
if exist "%~dp0..\.venv\Scripts\python.exe" (
    echo [*] Using workspace virtual environment: %~dp0..\.venv
    "%~dp0..\.venv\Scripts\python.exe" -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
) else (
    echo [*] Using system Python
    python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
)
pause
