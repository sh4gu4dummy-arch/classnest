#!/bin/sh
# Manual snapshot: scripts/git-snapshot.sh "message"
set -eu
cd /workspace
msg=${1:-"Snapshot $(date -u +%Y-%m-%dT%H:%MZ)"}
git add -A
if git diff --cached --quiet && git diff --quiet; then
  echo "Nothing to commit."
  exit 0
fi
git commit -m "$msg"
git log --oneline -3
