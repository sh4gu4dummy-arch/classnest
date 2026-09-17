# Home-film QA stills + verdicts

Frames: `{id}_t{0.5|7|14}.jpg` next to this file.
Pulled 2026-09-17 from `public/avatars/ultra/homes/{id}.mp4`.
**Do not remake until the teacher says `go`. Do not delete current mp4s without a yes.**

Parent recipe: [docs/ultra-home-films.md](../ultra-home-films.md)

## Horrible? (teacher asked)

| Id | Horrible? | Why | Remake? |
|---|---|---|---|
| **02 Voidfang** | **Yes** | t7: extra cubs (two extra animals) | **Yes — first** |
| **03 Emberpuff** | **Yes** | t7: extra foxes + tails melt into lava; t14 extra fox | **Yes** |
| **05 Stormwyrm** | **Yes** | t7: two dragons; t14 seascape, nest story gone | **Yes** |
| **01 Aetherflame** | Bad, not the worst | t7: extra legs mid-leap; start/end are one wolf | Yes if we redo 01–05 as a set |
| **04 Nebulynx** | Bad | t7: two cats; end is one lynx. Also very quiet (−35 dB) | Yes with the 01–05 set |
| **06 Bloomkin** | Not twin-animal; **face lost** | t14: face buried in a flower mound. Mean **−45 dB** (board-silent) | Soft remake (face + loudness) |
| **07 Chronomech** | Borderline | One bot at 0.5/7; t14 leftover brass blob. Max **−3.6 dB** (spike) | Soft remake if we have a slot |
| **08 Frosthowl** | **No** | One wolf, mitten, cabin. Best clip. | **Keep** |
| **09 Luminara** | Not twin; **silent** | One fairy, orbs OK. Mean **−52.5 dB** — no useful sound | Soft remake **or** loudnorm if the picture is enough |
| **10 Ironclaw** | No | One raptor. t7 smear; t14 dark, nod beat missing | Keep unless we want a tighter drill |

**If the teacher only remakes the horrors:** **02, 03, 05.**  
**Keep without touching:** **08, 10.**  
01 and 04 ride along if we redo the first batch.

## Tech (all 01–10)

- Duration 15.04s, **736×400** (not 854×480), 24fps, AAC stereo (track exists).
- Loudness mean dB: 01 −23 · 02 −30 · 03 −27 · 04 −35 · 05 −19 · **06 −45** · 07 −33 · 08 −28 · **09 −53** · 10 −26.

## What last QA missed (fix the checklist)

1. **“One body” is not a pass** if the face is gone (06 t14) or extra legs (01 t7).
2. **Must look at t=14**, not only t=7.
3. **Measure loudness.** AAC track ≠ audible. Fail mean **< −40 dB**. Fail max **> −6 dB**.
4. **Face readable** on all three stamps (board visibility).
5. **Save frames in git** (`docs/home-film-qa/`), not only `/tmp`.
6. Encode with **scale 854×480 + loudnorm + keep AAC** (see parent doc). Last batch skipped the ffmpeg pad.

## Next round (11–15 or redos)

**ClassNest-Bot1 (2026-09-17):** Plan QA locked into [home-round-11-15.md](../home-round-11-15.md). Shoot only on teacher `go`. Do not redo 01–10 unless ids are named.

Extra pass rules for that round:
- **11:** page mark = heart / check / swirl only (no letters).
- **12 Tidalkin:** “face” = **bell + glow core** readable at 0.5/7/14 (not mammal muzzle).
- Ship catalog titles from `src/lib/ultra-lore.ts`.
- Fail mean &lt; −40 dB or max &gt; −6 dB; dump QA stills here before `ULTRA_HOME_READY`.

Same 3-beat / one-hero / mid-shot prompts. Plus:

- After Imagine: run the Home ffmpeg (854×480, AAC, loudnorm toward −20 dB).
- Dump `docs/home-film-qa/{id}_t0.5.jpg` etc. **before** adding to `ULTRA_HOME_READY`.
- Fail if t=14 face is unreadable even with one body.
- Fail extra silhouette even if “maybe scenery.”
- One id at a time if the last two batches still morph.

Suggested redo order if teacher says `go redo horrors`: **02 → 03 → 05**. Then 01, 04. Then 06 (face) and 09 (sound).
