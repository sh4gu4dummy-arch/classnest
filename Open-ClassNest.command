#!/bin/bash
cd "$(dirname "$0")"
echo
echo " ClassNest local"
echo " ---------------"
echo " URL: http://127.0.0.1:3847/"
echo " (Port 3847 — leaves 8080 free for your other game.)"
echo " Leave this window open while you use the app."
echo

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install from https://nodejs.org then try again."
  read -r _
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "First run: installing dependencies..."
  npm install || { echo "npm install failed."; read -r _; exit 1; }
fi

(sleep 2; open "http://127.0.0.1:3847/" 2>/dev/null || xdg-open "http://127.0.0.1:3847/" 2>/dev/null || true) &
npm run dev:local
