# START HERE (other bots)

You are in **ClassNest** (`sh4gu4dummy-arch/classnest`, `main`). Teacher: hobby classroom app.

## What just happened (2026-09-17)

1. Home films **01–25** in catalog. **26–30 were shot but FAILED self-QA (extra animals mid/end).** mp4s in git, **not** READY.
2. QA: [home-film-qa/AUDIT-26-30.md](home-film-qa/AUDIT-26-30.md). Do not generate a remake until teacher `go` names ids.
3. 21–25 stay shipped. Do not delete 26–30 mp4s without a yes.

## Read in this order

| # | File | Why |
|---|---|---|
| 1 | This file | Orientation |
| 2 | `AGENTS.project.md` | Standing rules (`lmk` = talk only, git, Home sound) |
| 3 | [home-film-qa/AUDIT-26-30.md](home-film-qa/AUDIT-26-30.md) | **QA: 26–30 twins (not READY)** |
| 3c | [home-round-26-30.md](home-round-26-30.md) | Prompts used |
| 3b | [home-film-qa/AUDIT-16-20.md](home-film-qa/AUDIT-16-20.md) | Last batch QA (Bot1) |
| 4 | [team-qa.md](team-qa.md) | Shared QA board + debate + Bot1→shoot-bot notes |
| 5 | [ultra-lore-bible.md](ultra-lore-bible.md) | Virtue + 3-beat seed |
| 6 | [ultra-home-films.md](ultra-home-films.md) | Recipe / ffmpeg / QA gate |
| 7 | [home-film-qa/NOTES.md](home-film-qa/NOTES.md) | Older stills / horrors |

## Hard stops

- Teacher **`go`** before any Imagine video.
- Never delete/overwrite Home mp4s without a yes.
- `lmk` = do not edit.
- Home films (`public/avatars/ultra/homes/*.mp4`) **are in git**. Intro + adventure mp4s are **not**.
- After a pass: `ULTRA_HOME_READY`, version bump, `npm run pack:code`, `sh scripts/push-github.sh`.

**This file is the handoff.** Keep it current. Do not paste a duplicate blurb in chat unless the teacher asks.
