# START HERE (other bots)

You are in **ClassNest** (`sh4gu4dummy-arch/classnest`, `main`). Teacher: hobby classroom app.

**v0.140.** This file ships in **every** push.

**Meta-QA / supervisor protocol:** [QA-SUPERVISOR.md](QA-SUPERVISOR.md) (QAsup sleeping 2026-09-19 — **Ash-direct** until a supervisor returns).

## `start`

**01–55 in catalog.** Teacher said stop after 54–55. Remaining: **56–75**. Still model is `grok-imagine-image` ([imagine-stills.md](imagine-stills.md)). T2I still twins; crop A then 6s I2V.

Next on `start`: **56 Noxquill**.

**UI:** Teacher catalog on the **main page**; remembers last pack; recently viewed strip.

**Local viewer:** double-click `Open-ClassNest.bat` / `Open-ClassNest.command` → **http://127.0.0.1:3847/** (not 8080).

**UI:** Teacher catalog is **landscape-wide** (~92vw / 1100px) with denser thumb grid + tiny IDs outside thumbs.

**UI:** **Cinematic evolution** toggle (Display menu + Ultra class settings) — one Home scrub still per point when on; classic snaps default. Plan: [cinematic-evolution-mode.md](cinematic-evolution-mode.md). Scrub frames local-only under `public/avatars/ultra/scrub/` (gitignored).

**v0.140 (QA sweep fixes):** missing-art request loop fixed (one-shot fallback; cinematic falls back to classic stills when scrub frames are absent); Nest/Reports lists refresh after Undo/Clear; Board Lock hides teacher tools (Select/batch, Undo, favorites, More, Spar, Add, Settings — settings URL shows a locked notice); absent kids blocked on the Nest page; Undo targets the exact award / whole batch and never removes compress rollups; Compress keeps lifetime/spent/season (separate shop/spar rollups); deleting the last class sticks; phone header/More menu fit 390px; tournament byes use standard seeding; RandCycle counts only kids still in the pool.

## Hard stops

- Failures in catalog. Commit-per-id (this wrap: 54+55 together as asked).
- **Update this file every push.**
