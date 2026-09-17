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
# Refuse to push Grok Build / sandbox paths (even if someone force-adds them).
forbidden=$(git ls-files | grep -E '^(\.grok/|startup\.sh$|AGENTS\.md$|attachments/|server/|scripts/grok-pwa-)' || true)
if [ -n "$forbidden" ]; then
  echo "Refusing push: Grok/sandbox files are tracked:" >&2
  echo "$forbidden" >&2
  echo "Remove them with: git rm -r --cached <paths>" >&2
  exit 1
fi
if git ls-files | grep -q '\.keystore$'; then
  echo "Refusing push: a keystore is tracked. git rm --cached it." >&2
  exit 1
fi

GIT_ASKPASS="$ASK" SSH_ASKPASS="$ASK" GIT_TERMINAL_PROMPT=1 \
  git -c credential.helper= push origin HEAD:main "$@"
echo "pushed HEAD -> origin/main"
