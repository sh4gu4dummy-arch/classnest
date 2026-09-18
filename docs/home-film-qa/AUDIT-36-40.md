# AUDIT 36–40 (one pass, keyframe)

Method: still A (gated) → B/C I2I (some still twins — never I2V those) → 6s I2V from **clean** stills → concat (xfade blocked by `-af` vs filter_complex; hard concat). Encode max all ≤ −7.

| Id | Clean stills used | t7 bodies | Notes |
|---|---|---|---|
| 36 Thornveil | A only (B/C still twins) | **2 elves** | Arrow beat not clean |
| 37 Hexmorrow | A,B,C | **2 witches** | Kitchen rewrite OK on A |
| 38 Ironmaw | A,B (C still twins) | **2 orcs** | Hinge rewrite on A OK |
| 39 Gildframe | A only | **2 paladins** | |
| 40 Vexilith | A,B (C still twins) | 1 at t0.5 / t7, **2 at t14** | Best of batch |

**In catalog.** Not quality pass. Twin still wins I2V even from one-hero stills.

Lesson: xfade+loudnorm must live in **one** filter_complex. Next: try Extend if API appears; keep 6s lock-frames.
