# START HERE (other bots)

You are in **ClassNest** (`sh4gu4dummy-arch/classnest`, `main`). Teacher: hobby classroom app.

**v0.146.** This file ships in **every** push.

**Meta-QA / supervisor protocol:** [QA-SUPERVISOR.md](QA-SUPERVISOR.md) (QAsup sleeping 2026-09-19 — **Ash-direct** until a supervisor returns).

## `start`

**01–55 in catalog.** Teacher said stop after 54–55. Remaining: **56–75**. Still model is `grok-imagine-image` ([imagine-stills.md](imagine-stills.md)). T2I still twins; crop A then 6s I2V.

Next on `start`: **56 Noxquill**.

**UI:** Teacher catalog on the **main page**; remembers last pack; recently viewed strip.

**Teacher viewer (run from the clone, nothing to install):** `git pull`, double-click root `Start-ClassNest.bat` → **http://127.0.0.1:8765/** (falls back to 8766–8768). Serves prebuilt `offline/` + media from `public/`. Same address as the old zip app, so same saved classes. Details/open items: [offline-launcher.md](offline-launcher.md). The Offline APP zip still works the same way.

**Every version bump:** `npm run build:offline` and commit `offline/` — `scripts/push-github.sh` refuses to push if `offline/VERSION` != `VERSION`.

**Developer-only:** `scripts/dev/Open-ClassNest-dev.bat` / `.command` / `npm run dev:local` → http://127.0.0.1:3847/ — needs Node.js + `npm install`. Never send teachers to 3847.

**UI:** Teacher catalog is **landscape-wide** (~92vw / 1100px) with denser thumb grid + tiny IDs outside thumbs.

**UI:** **Cinematic evolution** toggle (Display menu + Ultra class settings) — one Home scrub still per point when on; classic snaps default. Plan: [cinematic-evolution-mode.md](cinematic-evolution-mode.md). Scrub frames local-only under `public/avatars/ultra/scrub/` (gitignored).

**v0.146 (Kindlekin #34 Legend reshoot, Ash-confirmed — Kindlekin fully remade):** `public/avatars/ultra/34-s3.jpg` is now **Legend B** (review round 3: grown red panda reclining on cream pillows in a red gold-trimmed mantle, holding a tiny winged copper teapot, golden steam and floating lanterns, soft beige s1 style; a stray plant on the pillow was cleaned out; 1024→1408 JPG), plus `ultra/board/34-s3.jpg` (360) and the unused `public/offline-app/avatars/` mirror. Kindlekin is now s1 Hatchling (unchanged) → s2 Tea Apprentice (v0.145) → s3 Legend B. Drafts stay local in `/workspace/kindlekin-trial/`. **Home film `homes/34.mp4` and the local scrub frames for 34 are stale (old art)** — reshoot only on Ash's `go`.

**v0.145 (Kindlekin #34 Adolescent reshoot, Ash-approved):** `public/avatars/ultra/34-s2.jpg` is now the **Tea Apprentice** (review round 2 option B: upright young red panda lifting a copper kettle, red scarf, soft beige backdrop in the s1 style; 1024→1408 JPG), plus `ultra/board/34-s2.jpg` (360) and the unused `public/offline-app/avatars/` mirror. s1 unchanged. **s3 (Legend) is still the OLD art and is pending a Legend remake** — Ash rejected rounds 1–2 as not enough change; drafts stay local in `/workspace/kindlekin-trial/`. **Home film `homes/34.mp4` and the local scrub frames for 34 still show the old art** — reshoot only on Ash's `go` (ideally after the new Legend ships). Style note from Ash: Kindlekin evolutions must keep s1's soft, plush, cute, warm look (no dark/moody scenes, no scowls).

**v0.144 (Riftstallion #35 evolution reshoot, Ash-approved):** `public/avatars/ultra/35-s2.jpg` (Adolescent) and `35-s3.jpg` (Legend, draft G upscaled 1024→1408) replaced, plus `ultra/board/35-s2/s3.jpg` (360) and the unused `public/offline-app/avatars/` mirror; s1 unchanged. Drafts/options stay local in `/workspace/riftstallion-trial/`. **Home film `homes/35.mp4` and the local scrub frames for 35 still show the OLD Legend** and now differ from the stills — reshoot only on Ash's `go`. **Ash's evolution rule:** stages may look quite different from each other as long as the resemblance and theme stay consistent — see [imagine-stills.md](imagine-stills.md#evolution-rule-ash-2026-10-22).

**v0.143 (full names):** student names were cut to the first word in the UI (`name.split(" ")[0]` in ~26 display spots + `truncate`); full name was always stored. Now full names everywhere (cards, Nest, toasts, picker/reel, spar/tournament, shop, reports, attendance, favorites, week snapshot). Long names wrap (`.cn-name`) and board cards step the font down (`nameLength()` in `src/lib/names.ts`). No data change; existing kids show their full names automatically.

**v0.142 (run from clone):** root `Start-ClassNest.bat` + `scripts/serve-offline.ps1` (PowerShell-only server: `offline/` first, then `public/`; SPA fallback) and committed `offline/` build (`npm run build:offline`, ~1.3 MB). Removed root `ClassNest.url`; dev launchers moved to `scripts/dev/`. See [offline-launcher.md](offline-launcher.md).

**v0.141 (portable viewer):** Ash saw "Unable to connect" on 127.0.0.1:3847 — that is the dev server (needs Node); the portable app runs on 8765. Docs + `ClassNest.url` now send teachers to `Start-ClassNest.bat` → 127.0.0.1:8765. Offline APP rebuilt for v0.141 (was stale at v0.048); zip is app-only (no avatars). `build-portable.mjs` gained `--skip-avatars` and a fixed midnight stamp ("24xx" → "00xx").

**v0.140 (QA sweep fixes):** missing-art request loop fixed (one-shot fallback; cinematic falls back to classic stills when scrub frames are absent); Nest/Reports lists refresh after Undo/Clear; Board Lock hides teacher tools (Select/batch, Undo, favorites, More, Spar, Add, Settings — settings URL shows a locked notice); absent kids blocked on the Nest page; Undo targets the exact award / whole batch and never removes compress rollups; Compress keeps lifetime/spent/season (separate shop/spar rollups); deleting the last class sticks; phone header/More menu fit 390px; tournament byes use standard seeding; RandCycle counts only kids still in the pool.

## Hard stops

- Failures in catalog. Commit-per-id (this wrap: 54+55 together as asked).
- **Update this file every push.**
