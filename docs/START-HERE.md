# START HERE (other bots)

You are in **ClassNest** (`sh4gu4dummy-arch/classnest`, `main`). Teacher: hobby classroom app.

## What just happened (2026-09-17)

1. Home films **01–15** on disk. **01–05** messy; **06–10** better; **11–15 shipped** (v0.066, 854×480, one hero, faces at t=14). **Do not redo** until `go redo …`.
2. Lore bible: [ultra-lore-bible.md](ultra-lore-bible.md).
3. **Shoot-bot vs Bot1 (find this):** Kept Bot1 nits. **Counter used on 11–15:** prompt the **s3 painting** (11 = gold quill-peacock, not porcupine; 14 owl; 15 grove deer); Tidalkin steers around kelp; locked camera. Results: [home-film-qa/NOTES.md](home-film-qa/NOTES.md) § Round 11–15.
4. **Current jobs:** (a) other bot may still **AUDIT 11–15** — [home-film-qa/AUDIT-11-15.md](home-film-qa/AUDIT-11-15.md). (b) **Next shoot plan is 16–20** — [home-round-16-20.md](home-round-16-20.md). **Do not generate 16–20** until teacher `go`.

## Read in this order

| # | File | Why |
|---|---|---|
| 1 | This file | Orientation |
| 2 | `AGENTS.project.md` | Standing rules (`lmk` = talk only, git, Home sound exception) |
| 3 | [home-round-16-20.md](home-round-16-20.md) | **Next shoot (wait for `go`)** |
| 3b | [home-film-qa/AUDIT-11-15.md](home-film-qa/AUDIT-11-15.md) | Optional: still audit 11–15 |
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

NOW: Home 11–15 shipped. Next PLAN is 16–20 — docs/home-round-16-20.md. Do not generate until teacher go.
Optional: finish AUDIT 11–15 (docs/home-film-qa/AUDIT-11-15.md + stills in that folder).
Teammate rules: docs/BOT-TEAM.md. Lore: docs/ultra-lore-bible.md.

16–20 s3: Prismite = crystal rabbit; Junkbyte = gear beetle (scrap is objects); Mirthling = round hatted party-creature (NO letters); Abyssrake = one eel; Solarox = scarab stays with the sun-disc.

DO NOT redo 01–15 unless they name ids. Do not delete mp4s. lmk = talk only.
Home films ARE in git (public/avatars/ultra/homes/*.mp4). Intro + adventure mp4s are NOT.
```

