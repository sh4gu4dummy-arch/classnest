# AUDIT 26–30

Teacher `go` (agree with Bot1 plan). Executor shot. **Do not catalog READY** until twins are gone.

Stills: `{id}_s3.jpg` = 16:9 home still + t0.5/3/7/11/14.  
mp4s on disk (git): `public/avatars/ultra/homes/26.mp4`–`30.mp4`. **Not** in `ULTRA_HOME_READY`.

## Audio (854×480, volume=0.5 last)

| Id | mean | max |
|---|---|---|
| 26 | −29.5 | −7.3 |
| 27 | −16.6 | −6.0 |
| 28 | −24.8 | −6.4 |
| 29 | −27.6 | −15.3 |
| 30 | −27.9 | −8.7 |

Peaks pass. 27 mean a bit hot.

## Shooter self-QA (full stamps) — twins

t0.5 was one hero. **Mid/end frames grew a second body.** Second I2V pass did not fix it.

| Id | Verdict | Evidence |
|---|---|---|
| 26 Puddlefin | **fail** | t7/t14 **two otters** |
| 27 Ashenhoof | **fail** | t3 **two ibex** (t7/t14 looked one) |
| 28 Paperwing | **fail** | t3/t11 **second bird** |
| 29 Voltkoi | **fail** | t7/t14 **second dragon** |
| 30 Glimmercap | **fail** | t3/t7/t14 **two frogs** |

**Horrors:** all five — extra animal. **No READY.** Redo when teacher names ids / says go again.

**Tech note:** `artifacts/` FUSE would not save Imagine this session. Stills via `scripts/imagine-image.py`; clips via `POST /v1/videos/generations` + poll `GET /v1/videos/{id}` (session JWT). Copy into `public/` same turn.

## QA verdict

| Id | QA | Evidence |
|---|---|---|
| 26 | | |
| 27 | | |
| 28 | | |
| 29 | | |
| 30 | | |
