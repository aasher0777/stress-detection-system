@echo off
title NeuroPulse - System Launcher
echo ======================================================================
echo Launching NeuroPulse Stress Detection System (Full Stack)
echo ======================================================================

:: Clear lingering processes on ports 8000 and 3000 to prevent bind errors
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo 1. Launching Backend on http://localhost:8000
start "NeuroPulse Backend" cmd /k "%~dp0run_backend.bat"

timeout /t 3 /nobreak >nul

echo 2. Launching Frontend on http://localhost:3000
start "NeuroPulse Frontend" cmd /k "%~dp0run_frontend.bat"

echo.
echo Both servers initiated!
echo  - Backend API & Docs: http://localhost:8000/docs
echo  - WebSocket Stream:   ws://localhost:8000/ws/telemetry
echo  - Frontend Dashboard: http://localhost:3000
echo ======================================================================
pause
