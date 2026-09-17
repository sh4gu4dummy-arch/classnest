# AUDIT 16–20 — other bot, this is your job

Teacher `go` was given; shoot-bot shipped. **You audit.** Do not generate. Do not redo 01–15.

Stills in this folder: `{id}_s3.jpg` and `{id}_t{0.5,3,7,11,14}.jpg`.  
mp4s **in git:** `public/avatars/ultra/homes/16.mp4`–`20.mp4`.

Fail: second animal (including babies), extra limbs/melt, face/head gone at t=14, hero left frame, letters, species ≠ s3.

## Shooter self-score (first pass)

| Id | Shooter | Notes |
|---|---|---|
| 16 Prismite | ship | One crystal rabbit; rainbow light; face at t14 |
| 17 Junkbyte | ship | One beetle; cog; watch scrap for twin silhouettes |
| 18 Mirthling | ship | One hatted creature; confetti paper; no letters; face+hat at t14 |
| 19 Abyssrake | ship | One eel; lantern object; head in frame; did not swim away |
| 20 Solarox | ship | One scarab stayed with sun-disc through t14 |

Loudness: means ~−18 to −20 (pass). **max still ~0 dB** on 16–19 after alimiter — note, don’t auto-fail (team-qa: fail true clip after limiter). 20 max −2.7.

## Shoot-bot self-QA (2026-09-17) — used team-qa fail rules 1–8

Opened **all** stamps (s3 + 0.5/3/7/11/14) after ship. Tried to fail.

| Id | Self-QA | Evidence |
|---|---|---|
| 16 | **pass** | One rabbit every stamp. Matches s3. Face at t14. Crystals = objects. Rainbow path at **t11** (virtue). **t7 is weak** (sitting, no clear “new angle” yet) — not a second animal, not a fail. |
| 17 | **pass** (busy scrap) | One beetle. Head at t14. Cog at t3/t7/t11. Extra legs = beetle anatomy, not a second bug. Scrap is dense — **other bot: hunt t3/t7 for a beetle silhouette**. |
| 18 | **pass** | One hatted creature. Confetti = paper. **No letters.** Face+hat at t14. Popper/confetti at t3/t7. |
| 19 | **pass** | One eel. Lure = same body. Lanterns = glass. Head in frame t14 (did not swim off). Lantern in jaws/hook at t7/t11. |
| 20 | **pass** | One scarab **with disc** at 0.5, 3, 7, 11, 14. Did not leave. |

**Would I redo before 21–25?** No horrors. Soft: **16** if we want the virtue beat on t7 not t11; **alimiter failed** (max ~0 dB) — fix encode recipe next round, don’t reshoot picture.

## Your verdict (other bot)

| Id | Your verdict | Evidence |
|---|---|---|
| 16 | | |
| 17 | | |
| 18 | | |
| 19 | | |
| 20 | | |

**Redo any before 21–25?**  
Save in this file or `AUDIT-16-20-REPLY.md`, commit, push. Add a dated note in `docs/team-qa.md`.
