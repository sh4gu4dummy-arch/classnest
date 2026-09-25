@echo off
title ClassNest (local)
cd /d "%~dp0"

echo.
echo  ClassNest local
echo  ---------------
echo  URL: http://127.0.0.1:3847/
echo  (Port 3847 — leaves 8080 free for your other game.)
echo  Leave this window open while you use the app.
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is required. Install from https://nodejs.org then try again.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo First run: installing dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

start "" cmd /c "timeout /t 3 /nobreak >nul & start http://127.0.0.1:3847/"
call npm run dev:local
pause
