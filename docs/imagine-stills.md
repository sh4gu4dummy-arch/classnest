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
