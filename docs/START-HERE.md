# START HERE (other bots)

You are in **ClassNest** (`sh4gu4dummy-arch/classnest`, `main`). Teacher: hobby classroom app.

## What just happened (2026-09-17)

1. Home films **01–20** on disk and in git. **01–05** messy; **06–10** mixed; **11–15** Bot1 pass; **16–20 just shipped** (v0.072). **Do not redo** until `go redo …`.
2. Lore bible: [ultra-lore-bible.md](ultra-lore-bible.md).
3. **Current job for other bot: AUDIT 16–20** — [home-film-qa/AUDIT-16-20.md](home-film-qa/AUDIT-16-20.md). Stills in that folder. Board: [team-qa.md](team-qa.md).
4. **Do not generate 21–25** until teacher `go`.

## Read in this order

| # | File | Why |
|---|---|---|
| 1 | This file | Orientation |
| 2 | `AGENTS.project.md` | Standing rules (`lmk` = talk only, git, Home sound exception) |
| 3 | [home-film-qa/AUDIT-16-20.md](home-film-qa/AUDIT-16-20.md) | **Current job = audit 16–20** |
| 4 | [ultra-lore-bible.md](ultra-lore-bible.md) | Virtue + 3-beat seed per id |
| 5 | [ultra-home-films.md](ultra-home-films.md) | Recipe, ffmpeg, QA gate |
| 6 | [home-film-qa/NOTES.md](home-film-qa/NOTES.md) | What failed last time (stills in that folder) |
| 7 | [team-qa.md](team-qa.md) | **Shared QA board** — Bot1 + shoot bot notes, fail rules, disagreements |

## Hard stops

- Teacher **`go`** before any Imagine video.
- Never delete/overwrite Home mp4s without a yes.
- `lmk` = do not edit.
- Home films (`public/avatars/ultra/homes/*.mp4`) **are in git**. Intro + adventure mp4s are **not**. Posters jpg OK; no Grok sandbox files on GitHub.
- After a pass: `ULTRA_HOME_READY`, version bump, `npm run pack:code`, `sh scripts/push-github.sh`.

## Paste this to the next bot

```
ClassNest (github.com/sh4gu4dummy-arch/classnest, main). Read docs/START-HERE.md first, then AGENTS.project.md.

NOW: Home 16–20 SHIPPED. Shoot-bot self-QA (team-qa rules): all five picture PASS — docs/home-film-qa/AUDIT-16-20.md.
YOUR JOB: (1) AUDIT 16–20 — try to FAIL 17 scrap. (2) REPLY to the Debate in docs/team-qa.md.
If you two still disagree after a round, lmk the teacher — they break the tie. Don’t skip the debate.

Do not generate 21–25 until teacher go. Do not redo 01–15 unless they name ids (horrors: 02, 03, 05).
No baby/second animals. Stay in frame t=14. Home mp4s ARE in git. Intro/adventure are NOT. lmk = talk only.
```

