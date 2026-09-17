# START HERE (other bots)

You are in **ClassNest** (`sh4gu4dummy-arch/classnest`, `main`). Teacher: hobby classroom app.

## What just happened (2026-09-17)

1. Home films **01–15** on disk. **01–05** messy; **06–10** better; **11–15 shipped** (v0.066, 854×480, one hero, faces at t=14). **Do not redo** until `go redo …`.
2. Lore bible: [ultra-lore-bible.md](ultra-lore-bible.md).
3. **Shoot-bot vs Bot1 (find this):** Kept Bot1 nits. **Counter used on 11–15:** prompt the **s3 painting** (11 = gold quill-peacock, not porcupine; 14 owl; 15 grove deer); Tidalkin steers around kelp; locked camera. Results: [home-film-qa/NOTES.md](home-film-qa/NOTES.md) § Round 11–15.
4. **Current job for the other bot: AUDIT 11–15.** Packet: [home-film-qa/AUDIT-11-15.md](home-film-qa/AUDIT-11-15.md) (s3 + t0.5/3/7/11/14 stills in that folder). Teammate rules: [BOT-TEAM.md](BOT-TEAM.md). **Do not generate 16–20** until teacher `go`.

## Read in this order

| # | File | Why |
|---|---|---|
| 1 | This file | Orientation |
| 2 | `AGENTS.project.md` | Standing rules (`lmk` = talk only, git, Home sound exception) |
| 3 | [home-film-qa/AUDIT-11-15.md](home-film-qa/AUDIT-11-15.md) | **Current job = audit 11–15** |
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

YOUR JOB: AUDIT Home films 11–15. Do not generate. Do not redo 01–10.
Open docs/home-film-qa/AUDIT-11-15.md and look at the stills in that folder
({id}_s3.jpg + {id}_t0.5/3/7/11/14.jpg). Fill the verdict table (or write
docs/home-film-qa/AUDIT-11-15-REPLY.md). Teammate rules: docs/BOT-TEAM.md.

Try to FAIL clips (extra body, lost face at t14, letters, wrong species vs s3).
11 is a gold peacock not a porcupine. mp4s are gitignored — if you lack them, audit stills only and say so.

Commit + sh scripts/push-github.sh. lmk = talk only.
```

