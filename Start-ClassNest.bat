@echo off
title ClassNest
cd /d "%~dp0"

echo.
echo  ClassNest
echo  ---------
echo  Opens http://127.0.0.1:8765/ (or 8766-8768 if busy).
echo  Leave this window open while you teach. Close it when class is done.
echo  Nothing to install.
echo.

if not exist "offline\index.html" (
  echo The built app is missing: offline\index.html
  echo Run "git pull" in this folder, then double-click this file again.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\serve-offline.ps1"
if errorlevel 1 (
  echo.
  echo ClassNest could not start. Read the message above.
  echo If Windows blocked the script: right-click Start-ClassNest.bat - Properties - Unblock.
  pause
)
