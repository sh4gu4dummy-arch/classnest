#!/bin/sh
# Push HEAD to GitHub main using `gh` (connected account). Never paste a PAT.
set -e
cd "$(dirname "$0")/.."
if ! command -v gh >/dev/null 2>&1; then
  echo "gh is not available; cannot push" >&2
  exit 1
fi
if ! gh auth token >/dev/null 2>&1; then
  echo "GitHub is not logged in (gh auth token failed)" >&2
  exit 1
fi
ASK=$(mktemp)
trap 'rm -f "$ASK"' EXIT
cat > "$ASK" << 'EOF'
#!/bin/sh
if echo "$1" | grep -qi username; then
  echo x-access-token
else
  gh auth token
fi
EOF
chmod 700 "$ASK"
GIT_ASKPASS="$ASK" SSH_ASKPASS="$ASK" GIT_TERMINAL_PROMPT=1 \
  git -c credential.helper= push origin HEAD:main "$@"
echo "pushed HEAD -> origin/main"
