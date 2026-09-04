@echo off
title ClassNest
cd /d "%~dp0"

echo.
echo  ClassNest
echo  ---------
echo  Leave this window open while you teach.
echo  Close it when class is done.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem -LiteralPath '%~dp0' -Recurse -File -ErrorAction SilentlyContinue | Unblock-File -ErrorAction SilentlyContinue"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-classnest.ps1"
if errorlevel 1 (
  echo.
  echo Could not start. Right-click this file -^> Properties -^> Unblock if Windows hid a security check.
  echo You do not need Python.
  pause
)
