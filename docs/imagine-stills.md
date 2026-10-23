# Imagine stills (ClassNest, 2026-09-17)

Palabra’s save-fix (FUSE locker, skip the Imagine *tool*, JWT from `~/.grok/auth.json`, fetch `imgen.x.ai` the same turn, never remount `artifacts/`) is still right.

**What broke here:** Palabra 2026-09-04 listed `grok-imagine-image-2.0` as the live still model. On this login **2026-09-17** `/v1/models` only has:

- `grok-imagine-image` ← stills (200)
- `grok-imagine-video`
- `grok-imagine-video-1.5`

`grok-imagine-image-2.0` → HTTP **404** “model does not exist or your team does not have access.” That is a **renamed/removed model**, not FUSE, not DNS, not a missing JWT.

**Fix:** `scripts/imagine-image.py` default is `grok-imagine-image`. If you pass a 404 model it retries the live name once.

Probe (do not print the JWT):

```
GET https://api.x.ai/v1/models
Authorization: Bearer <key>
```

Smoke:

```
python3 scripts/imagine-image.py --prompt "a red apple" --out /tmp/apple.jpg --aspect 1:1
```

Do not loop `imagine_text_to_image` hoping a path appears. Method C = this script. Video = existing HTTP poll to `grok-imagine-video`.


## Evolution rule (Ash, 2026-10-22)

- Evolutions **may look quite different** from stage to stage (new pose, scene, body shape, maturity, effects) **as long as resemblance and theme stay consistent**. Examples: same species/silhouette family, signature colours and motif.
- A near-copy of the previous stage is a weak evolution. Don't play it safe.
- First applied to **35 Riftstallion (v0.144):** foal → comet yearling with constellation markings → rearing galaxy stallion with a spiral-galaxy flank and glowing hooves. The dark-indigo star-coat identity is kept.
- **34 Kindlekin (v0.145):** s2 → Tea Apprentice (upright, kettle, scarf, soft beige s1 style). Round 1 (dark moody study, scowling face) was rejected as wrong style — match the Hatchling's soft, plush, cute, warm lighting. s3 (v0.146) → Legend B: reclining hearth-sage on pillows with a winged-teapot familiar, lanterns and golden steam (round 3; rounds 1–2 rejected as too little change). Kindlekin fully remade.
- **38 Ironmaw (v0.147):** s2 → Adolescent C (kneeling to fit a glowing hinge on a door — repair theme), s3 → Legend C (crowned smith-king on a throne of anvils and hinges, offering a glowing hinge). Same green orc smith, painterly warm forge style.
- **24 Mossback (v0.147):** s2 → Adolescent D (swimming underwater, lotus on the moss shell — breaks the Hatchling's front-facing pose), s3 → Legend C (great sea turtle carrying a blossoming tree, koi). Same mossy-green turtle identity.
- When a still changes, its Home film (`homes/<id>.mp4`) and scrub frames go stale. Note it in START-HERE and reshoot only on Ash's `go`.
