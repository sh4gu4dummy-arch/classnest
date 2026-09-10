#!/bin/bash
cd "$(dirname "$0")"
echo "ClassNest"
echo "Leave this window open while you teach."
echo
chmod +x "$0" serve.py 2>/dev/null || true

open_browser() {
  (sleep 0.4; open "http://127.0.0.1:${1}/" >/dev/null 2>&1) &
}

if command -v python3 >/dev/null 2>&1; then
  python3 ./serve.py
  exit $?
fi
if command -v python >/dev/null 2>&1; then
  python ./serve.py
  exit $?
fi
if command -v php >/dev/null 2>&1; then
  echo "Using PHP (no Python needed)."
  open_browser 8765
  exec php -S 127.0.0.1:8765 router.php
fi

echo "This Mac needs Python 3 or PHP to run ClassNest offline."
echo "Windows does not — use Start-ClassNest.bat there."
echo "Install Python from python.org, then double-click this file again."
read -r _
