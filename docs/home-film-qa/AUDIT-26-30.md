# AUDIT 26–30

Teacher `go` (agree with Bot1 plan). Executor shot. **Do not catalog READY** until twins are gone.

Stills: `{id}_s3.jpg` = 16:9 home still + t0.5/3/7/11/14.  
mp4s on disk (git): `public/avatars/ultra/homes/26.mp4`–`30.mp4`. **In catalog (v0.097)** so the teacher can watch. Remake later — not a quality pass.

## Audio (854×480, volume=0.5 last)

| Id | mean | max |
|---|---|---|
| 26 | −29.5 | −7.3 |
| 27 | −16.6 | −6.0 |
| 28 | −24.8 | −6.4 |
| 29 | −27.6 | −15.3 |
| 30 | −27.9 | −8.7 |

Peaks pass. 27 mean a bit hot.

## Shooter self-QA (full stamps) — twins **and** motion

t0.5 was one hero. **Mid/end frames grew a second body.** Second I2V pass did not fix it.

Fold-in after teacher 21–25: these are **also tableaus** (sit/stand/perch). Even a clean one-hero recut would fail the new **action bar**.

| Id | One-hero | Movement | Verdict |
|---|---|---|---|
| 26 Puddlefin | **fail** t7/t14 two otters | mostly in-place | **fail** |
| 27 Ashenhoof | **fail** t3 two ibex | mostly standing | **fail** |
| 28 Paperwing | **fail** t3/t11 second bird | perched | **fail** |
| 29 Voltkoi | **fail** t7/t14 second dragon | slow circle at best | **fail** |
| 30 Glimmercap | **fail** t3/t7/t14 two frogs | on the log | **fail** |

**Horrors:** twins. **Also:** not entertaining enough for the new bar. **No READY.** Redo on `go` must fix **both**.

**Tech note:** `artifacts/` FUSE would not save Imagine this session. Stills via `scripts/imagine-image.py`; clips via `POST /v1/videos/generations` + poll `GET /v1/videos/{id}` (session JWT). Copy into `public/` same turn.

## QA verdict (ClassNest-Bot1 — opened pixels, 2026-09-18; twin table revised)

QAsupervisor LOCK (revised). **No twin HARD on 26–30.** Twin HARD only with **two distinct heads/bodies** (not reflection, looped long body, or mushroom). **0/5 READY** for tableau / set-drift / identity. No remake unless Ash names ids.

| Id | Twin HARD? | QA | Evidence |
|---|---|---|---|
| 26 Puddlefin | **no** (overclaim) | **HARD FAIL** tableau | One otter. Dark mass under chin = **water reflection** + trailing body — not a second head/body. Sit/hold pebble stillness. |
| 27 Ashenhoof | **no** (overclaim) | **HARD FAIL** tableau | One ibex on re-open (one head, four legs). Ledge stand / low travel. |
| 28 Paperwing | **no** | **HARD FAIL** set + species + tableau | One bird. Sterile white void ≠ Atrium; cockatiel/raptor ≠ catalog phoenix; perch/peck only. |
| 29 Voltkoi | **no** (overclaim) | **HARD FAIL** tableau | One head + one tail; long body dipping in/out — easy to miscount, not two dragons. Pond stillness / low travel. |
| 30 Glimmercap | **no** | **HARD FAIL** identity + tableau | One frog + mushroom object (mushroom ≠ twin). Lost mushroom-hat identity; log sit. |

**Root cause (revised):** stillness recipe + I2V set/identity abandon + batch-after-disease process — **not** “five proven twin horrors.” Anti-twin **prevention** still ships (I2V can twin on later rounds).
