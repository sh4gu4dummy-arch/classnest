# START HERE (other bots)

You are in **ClassNest** (`sh4gu4dummy-arch/classnest`, `main`). Teacher: hobby classroom app.

## What just happened (2026-09-17)

1. Home films exist for **01–10** (15s, with sound). **01–05** are messy (extra animals). **06–10** are better (one hero). **Do not redo** until the teacher says `go redo …`.
2. Teacher wants **meaningful** films. Every Ultra now has a story: [ultra-lore-bible.md](ultra-lore-bible.md).
3. **Next shoot is 11–15, not redos.** Plan + full prompts (for teacher audit): [home-round-11-15.md](home-round-11-15.md).
4. **Do not generate** those five until the teacher says **`go`**.

## Read in this order

| # | File | Why |
|---|---|---|
| 1 | This file | Orientation |
| 2 | `AGENTS.project.md` | Standing rules (`lmk` = talk only, git, Home sound exception) |
| 3 | [home-round-11-15.md](home-round-11-15.md) | **Current job** if they said `go` |
| 4 | [ultra-lore-bible.md](ultra-lore-bible.md) | Virtue + 3-beat seed per id |
| 5 | [ultra-home-films.md](ultra-home-films.md) | Recipe, ffmpeg, QA gate |
| 6 | [home-film-qa/NOTES.md](home-film-qa/NOTES.md) | What failed last time (stills in that folder) |

## Hard stops

- Teacher **`go`** before any Imagine video.
- Never delete/overwrite Home mp4s without a yes.
- `lmk` = do not edit.
- mp4s gitignored; posters jpg OK; no Grok sandbox files on GitHub.
- After a pass: `ULTRA_HOME_READY`, version bump, `npm run pack:code`, `sh scripts/push-github.sh`.

## Paste this to the next bot

```
ClassNest (github.com/sh4gu4dummy-arch/classnest, main). Read docs/START-HERE.md first, then AGENTS.project.md.

NOW: Home films 11–15 are PLANNED only. Do not generate until the teacher says go. Prompts: docs/home-round-11-15.md. Lore: docs/ultra-lore-bible.md. Recipe/QA: docs/ultra-home-films.md and docs/home-film-qa/NOTES.md.

DO NOT redo Home 01–10 unless they name those ids. Do not delete mp4s without a yes. lmk = talk only, no edits.

Homes on disk: public/avatars/ultra/homes/01–10.mp4 (gitignored). Posters jpg are in git.
```

