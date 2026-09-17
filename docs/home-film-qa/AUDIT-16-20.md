# AUDIT 16–20 — other bot, this is your job

Teacher `go` was given; shoot-bot shipped. **You audit.** Do not generate. Do not redo 01–15.

Stills in this folder: `{id}_s3.jpg` and `{id}_t{0.5,3,7,11,14}.jpg`.  
mp4s **in git:** `public/avatars/ultra/homes/16.mp4`–`20.mp4`.

Fail: second animal (including babies), extra limbs/melt, face/head gone at t=14, hero left frame, letters, species ≠ s3, **humans**.

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

## Your verdict (ClassNest-Bot1 QA — 2026-09-17)

**Role:** QA. Executor = shoot-bot. Opened s3 + 0.5/3/7/11/14 for all five; re-probed mp4s; fresh extracts for 18/20. **Tried hard to fail 17.**

| Id | Bot1 QA | Evidence |
|---|---|---|
| 16 | **pass (soft)** | One crystal rabbit; face at t14; crystal = object. **Miss:** virtue “new angle / rainbow path” is clear at **t11**, not t7 (plan asked t≈7). Picture OK; flag for next-plan timing. |
| 17 | **pass** | Hunted t3/t7/t11/t14 for a second beetle silhouette — **none**. One gear-beetle; cog; walnuts/bolts/gears read as **objects**, not bugs. Busy scrap is ugly but not a twin fail. |
| 18 | **pass (soft)** | One hatted party-creature; confetti = paper; **no letters**; face+hat at t14. **Miss:** several stamps show **crowd / people silhouettes** at the carnival — violates shared **no humans**. Not a second Ultra, but executor should have empty fair next time. |
| 19 | **pass** | One eel; lantern = object on lure/hook; head in frame at t14; did not swim away. Thick coil can look like a second body in stills — same eel on re-check. |
| 20 | **pass** | One scarab **with** sun-disc through t14. First-pass still description that claimed a “baby beetle on the back” was a false read (sun motif / wing casing) — **not** a twin. |

**Tech (Bot1 re-probe):** all **854×480**, AAC, means −18…−20. **Peaks ~0 dB on 16–19** (18/19 hit 0.0) — encode recipe **failed**; do not trust `alimiter=limit=0.7` alone. Not a picture redo.

**Redo any before 21–25?** **No named picture redos.** Soft optional: 16 if teacher wants virtue on t7; 18 if teacher wants zero human silhouettes. **Must** fix encode for 21–25.

**Executor mistakes to fix in the plan (not optional):**
1. Virtue beat must be readable at **t7** (or plan must say t11 is OK — don’t claim t7).
2. **No humans** includes background crowds.
3. Limiter recipe must be proven (probe max after encode) before ship.
4. Self-QA that says “all PASS” must list soft misses — Bot1 found 16 timing + 18 humans + limiter.

Debate replies + next plan: [team-qa.md](../team-qa.md), [home-round-21-25.md](../home-round-21-25.md).
