# START HERE (other bots)

You are in **ClassNest** (`sh4gu4dummy-arch/classnest`, `main`). Teacher: hobby classroom app.

**v0.142.** This file ships in **every** push.

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

**v0.142 (run from clone):** root `Start-ClassNest.bat` + `scripts/serve-offline.ps1` (PowerShell-only server: `offline/` first, then `public/`; SPA fallback) and committed `offline/` build (`npm run build:offline`, ~1.3 MB). Removed root `ClassNest.url`; dev launchers moved to `scripts/dev/`. See [offline-launcher.md](offline-launcher.md).

**v0.141 (portable viewer):** Ash saw "Unable to connect" on 127.0.0.1:3847 — that is the dev server (needs Node); the portable app runs on 8765. Docs + `ClassNest.url` now send teachers to `Start-ClassNest.bat` → 127.0.0.1:8765. Offline APP rebuilt for v0.141 (was stale at v0.048); zip is app-only (no avatars). `build-portable.mjs` gained `--skip-avatars` and a fixed midnight stamp ("24xx" → "00xx").

**v0.140 (QA sweep fixes):** missing-art request loop fixed (one-shot fallback; cinematic falls back to classic stills when scrub frames are absent); Nest/Reports lists refresh after Undo/Clear; Board Lock hides teacher tools (Select/batch, Undo, favorites, More, Spar, Add, Settings — settings URL shows a locked notice); absent kids blocked on the Nest page; Undo targets the exact award / whole batch and never removes compress rollups; Compress keeps lifetime/spent/season (separate shop/spar rollups); deleting the last class sticks; phone header/More menu fit 390px; tournament byes use standard seeding; RandCycle counts only kids still in the pool.

## Hard stops

- Failures in catalog. Commit-per-id (this wrap: 54+55 together as asked).
- **Update this file every push.**
