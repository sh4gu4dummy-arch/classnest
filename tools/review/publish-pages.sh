#!/usr/bin/env bash
# Publish the static review page to the separate GitHub Pages repo (NOT the ClassNest repo).
#   ./publish-pages.sh /path/to/pages-repo-clone ["commit message"]
# Rebuilds pages-dist/, mirrors it into the clone (everything except .git), commits, and does a normal
# push. Never force-pushes. Nothing is pushed if nothing changed.
set -euo pipefail
cd "$(dirname "$0")"

TARGET="${1:?usage: publish-pages.sh <pages-repo-clone> [message]}"
MSG="${2:-}"
# TODO(remote/auth): set these once the dummy GitHub account + Pages repo exist.
#   PAGES_REMOTE  push URL or remote name (default: the clone's "origin"), e.g. https://github.com/<user>/<repo>.git
#   PAGES_BRANCH  branch GitHub Pages serves from (default: main; Settings > Pages > Deploy from branch, / (root))
#   Auth: a token for THAT account only (never the ClassNest PAT), e.g. via a credential helper
#   or GIT_ASKPASS. Do not put the token in the remote URL or in this file.
PAGES_REMOTE="${PAGES_REMOTE:-origin}"
PAGES_BRANCH="${PAGES_BRANCH:-main}"

[ -d "$TARGET/.git" ] || { echo "not a git clone: $TARGET" >&2; exit 1; }
TARGET="$(cd "$TARGET" && pwd)"
case "$(git -C "$TARGET" remote get-url "$PAGES_REMOTE" 2>/dev/null || echo "$PAGES_REMOTE")" in
  *classnest-audit*|*sh4gu4dummy-arch/classnest*) echo "refusing: target looks like the ClassNest repo" >&2; exit 1;;
esac
[ "$TARGET" != "/workspace/classnest-audit" ] || { echo "refusing: that is the ClassNest clone" >&2; exit 1; }

./build-pages.sh
VERSION="$(python3 -c 'import json;print(json.load(open("pages-dist/data/meta.json"))["version"])')"

# Mirror pages-dist into the clone. Only files git tracks in that clone are affected (recoverable from history).
# (No rsync on the box: clear the clone's tree except .git / README.md / CNAME, then copy the build in.)
find "$TARGET" -mindepth 1 -maxdepth 1 ! -name .git ! -name README.md ! -name CNAME -exec rm -rf {} +
cp -a pages-dist/. "$TARGET/"

cd "$TARGET"
git add -A
# Only the build time changed -> nothing real to publish.
if [ "$(git diff --cached --name-only)" = "data/meta.json" ]; then git reset -q && git checkout -q -- data/meta.json; fi
if git diff --cached --quiet; then echo "No changes to publish."; exit 0; fi
git commit -q -m "${MSG:-Review page for ClassNest v$VERSION ($(date -u +%Y-%m-%dT%H:%MZ))}"
git push "$PAGES_REMOTE" "HEAD:$PAGES_BRANCH"     # normal push only, never --force
echo "Published v$VERSION. Pages rebuilds in ~1 min."
