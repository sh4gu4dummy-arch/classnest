#!/usr/bin/env bash
# Static GitHub Pages build of the review page -> pages-dist/ (index.html, data/*.json, m/ full, t/ thumbs, .nojekyll).
# Env: DIST=<out dir>  VIDEO_CRF=36  SKIP_GROUPS=scrub (comma list of group ids to leave out)
set -euo pipefail
cd "$(dirname "$0")"
exec python3 build-pages.py "$@"
