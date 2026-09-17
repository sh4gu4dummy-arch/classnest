# START HERE (other bots)

You are in **ClassNest** (`sh4gu4dummy-arch/classnest`, `main`). Teacher: hobby classroom app.

## What just happened (2026-09-17)

1. Home films **01–20** on disk / in git under `public/avatars/ultra/homes/`. **01–05** messy; **11–15** and **16–20** shipped.
2. **QA vs executor:** QA finds mistakes + hardens the next plan. Shoot-bot executes only after teacher `go`.
3. Bot1 audited **16–20**. Independent QA (**ABC-Adventure-Bot1**) audited the **21–25 plan**, found portrait/I2I/nest/loudness gaps, and rewrote [home-round-21-25.md](home-round-21-25.md). Board: [team-qa.md](team-qa.md).
4. **Do not generate** 21–25 until teacher `go`.
5. Bot1 posted **executor improvements** in [team-qa.md](team-qa.md) (section “Bot1 → shoot-bot: improve next round”). Shoot-bot: read that before `go`.

## Read in this order

| # | File | Why |
|---|---|---|
| 1 | This file | Orientation |
| 2 | `AGENTS.project.md` | Standing rules (`lmk` = talk only, git, Home sound exception) |
| 3 | [home-round-21-25.md](home-round-21-25.md) | **Next shoot (wait for `go`) — QA-rewritten** |
| 3b | [home-film-qa/AUDIT-16-20.md](home-film-qa/AUDIT-16-20.md) | Last batch QA |
| 4 | [team-qa.md](team-qa.md) | Shared QA board + debate + ABC plan audit |
| 5 | [ultra-lore-bible.md](ultra-lore-bible.md) | Virtue + 3-beat seed per id |
| 6 | [ultra-home-films.md](ultra-home-films.md) | Recipe, ffmpeg, QA gate (max > −6 fail) |
| 7 | [home-film-qa/NOTES.md](home-film-qa/NOTES.md) | Older stills / horrors |

## Hard stops

- Teacher **`go`** before any Imagine video.
- Never delete/overwrite Home mp4s without a yes.
- `lmk` = do not edit.
- Home films (`public/avatars/ultra/homes/*.mp4`) **are in git**. Intro + adventure mp4s are **not**.
- After a pass: `ULTRA_HOME_READY`, version bump, `npm run pack:code`, `sh scripts/push-github.sh`.

## Paste this to the next bot

```
ClassNest (github.com/sh4gu4dummy-arch/classnest, main). Read docs/START-HERE.md first, then AGENTS.project.md.

NOW: Homes 16–20 shipped. Plan 21–25 was QA-rewritten (ABC-Adventure-Bot1) — docs/home-round-21-25.md.
Key: 21–25 s3 files are PORTRAITS — I2I a 16:9 home stage first. Proof-encode peaks (max ≤ −6) before batch.
Nest/doorway/crowd traps called out. Do not generate until teacher go.
Shared board: docs/team-qa.md.

21–25: Quietpaw / Hearthound / Mistfawn / Mossback / Softwing.
DO NOT redo 01–20 unless they name ids (horrors: 02, 03, 05). lmk = talk only.
Home films ARE in git. Intro/adventure are NOT.
```
