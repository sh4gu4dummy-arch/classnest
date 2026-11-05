# Review tooling (recovered from Bot1's box, 2026-11-05)

Copied from `/workspace/classnest-review/` and the `/workspace/*-trial/` folders on the shared box so the
art-review workflow survives without Bot1. **Held on local branch `handover-recovered`; not pushed until Ash OKs.**

- Scripts still use absolute box paths (`/workspace/classnest-review`, `/workspace/<name>-trial`,
  `/workspace/classnest-audit`). Adjust `root` in each `sets/*/set.json` / `trials/*/config.json` if you move them.
- Draft images are NOT here (too big). They are public in the review site repo
  `ashsgrokbot/classnest-review` (GitHub Pages) and local under `/workspace/<name>-trial/`.
- `publish-pages.sh` pushes to the review-site clone with the dummy account's own gh login. No credentials
  are in these files; ask Ash / QAsupervisor where that login lives. Never use the ClassNest PAT for it.
- `verdicts.json` + `history.jsonl` = the review decision baseline/history. Human-readable log: `docs/art-decisions.md`.
- The live copy of `public/index.html` / `test/pages-test.cjs` may be newer in `ashsgrokbot/classnest-review`
  (check its latest commit) if a review-page fix lands after this copy.
