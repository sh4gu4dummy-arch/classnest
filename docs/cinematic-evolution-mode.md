# Cinematic evolution mode (plan — do not execute yet)

**Status:** v1 shipped (2026-09-19, app **v0.135**). Toggle + linear Home scrub for Ultras 01–55 (frames local/gitignored). Intro/adventure still pending mp4s.

**Orientation:** see [START-HERE.md](START-HERE.md).

## Idea

Today Ultra form art **snaps** at hard thresholds:

- points &lt; 10 → stage 1 (hatchling)
- 10–19 → stage 2 (adolescent)
- 20+ → stage 3 (legend)

A full-screen morph burst fires when those lines are crossed (`didFormEvolve` / `didEvolve`).

**Cinematic mode** (toggleable) keeps the same point total, but the on-screen creature advances **one still per point** through an ordered strip of frames pulled from the evolution / Home video. Growth feels continuous every award instead of only at 10 and 20.

Classic threshold snaps stay the **default**. Cinematic is opt-in.

## Slice 0 — Strip source (one Ultra only)

Pick one Ultra that already has a solid Home film (candidate: id `01`). Extract a short ordered strip of stills from that mp4 (or from a dedicated evolution clip later).

- Start small: ~20–30 frames covering hatchling → legend
- Paths like `public/avatars/ultra/scrub/01/000.jpg` … `029.jpg`
- Prefer clean, in-frame shots; no twins / blank identity
- Loudness N/A for stills

**Blocked on teacher:** trial Ultra id + strip source (Home mp4 vs new clip).

## Slice 1 — Mapping helper (pure logic, no UI)

Tiny function: given `points` and strip length → frame index (clamp at end).

Curve options (pick one for the trial):

1. **Linear:** point N → frame N (simplest)
2. **Stretched:** frame 0 ≈ s1, mid strip near 10, end near 20+

Ship helper with a short sanity note or tiny test. Leave `getFormStage` untouched for classic path.

## Slice 2 — Pref toggle

One boolean, **default off** — e.g. “Cinematic evolution” in class settings or teacher prefs (`localStorage` fine for v1).

- Off → everything behaves exactly as today
- On → **only the trial Ultra** uses the scrub path; every other Ultra still snaps by stage

## Slice 3 — Wire display for that one Ultra

Where nest / board avatar src is chosen:

- if toggle on **and** avatar id is the trial Ultra → `scrubFrame(points)`
- else → existing `getAvatarSrc(… formStage)`

Keep shop frames, spar, and catalog stage art on the classic path for v1 so scope stays tiny.

## Slice 4 — Award feedback (light)

On each +1 while cinematic is on for that Ultra: optional soft flash / “frame advanced” cue — **not** a full `EvolutionBurst`.

Keep the existing morph burst at 10 / 20 (or gate it behind “classic only”) so we do not double-celebrate. Document that choice in the toggle help text.

## Slice 5 — Teacher catalog preview

For the trial Ultra only: a small “scrub preview” (slider or fake points) so teachers can judge the strip before a live class.

## Slice 6 — Widen later (after teacher likes it)

1. Generate strips for more Ultras, then all Ultras
2. Optionally replace Home film as strip source with a purpose-shot “evolution scrub” video
3. Only then consider Kids/Teens or changing burst behavior globally

## Risks

| Risk | Mitigation |
|------|------------|
| Asset weight (dozens of JPEGs × many Ultras) | Board thumbs; do not ship full-res strips for all 50 on day one |
| Points above strip length | **Clamp**, never wrap (wrapping looks like devolution) |
| Batch awards (+5 at once) | Advance N frames in one paint, or brief tween — pick one and document |
| Missing strip folder | Fall back to classic stage art so the board never blanks |

## Suggested first PR

Toggle + mapping + **one** Ultra scrub on nest/board only.

Second PR: catalog preview + burst policy.

## Open questions for teacher

1. Which Ultra id for the trial?
2. Strip from existing Home mp4, or shoot a new evolution clip?
3. Linear vs stretched frame curve?
4. Keep morph burst at 10/20 in cinematic mode, or classic-only?

## Related code (today)

- `src/lib/evolution.ts` — `POINTS_PER_LEVEL`, `didEvolve`, `didFormEvolve`
- `src/lib/avatars.ts` — `getFormStage`, `getAvatarSrc`
- `src/components/evolution-burst.tsx` — morph celebration
- `src/lib/ultra-homes.ts` — Home mp4 / poster paths
