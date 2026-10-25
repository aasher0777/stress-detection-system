@echo off
title Amatarashu - Frontend Dashboard (React)
echo ======================================================================
echo Starting Amatarashu React Monitoring Dashboard...
echo ======================================================================

:: Automatically free port 3000 if another process is occupying it
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo [*] Port 3000 occupied by PID %%a. Freeing port 3000...
    taskkill /F /PID %%a >nul 2>&1
)

cd /d "%~dp0frontend"
npm start
pause
