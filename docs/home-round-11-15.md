# Home round 11–15 (audit this, then `go`)

Teacher: **continue before redoing 01–10.** Improve the next five using lore + last QA.

**Do not generate until `go`.**

Ids: **11 Quillburst, 12 Tidalkin, 13 Hexabyte, 14 Bonehollow, 15 Sapwood.**  
Stills: `public/avatars/ultra/11-s3.jpg` … `15-s3.jpg` (in git). **Prompt the painting, not the old one-line vibe.**  
Stories: [ultra-lore-bible.md](ultra-lore-bible.md) §§11–15.  
Catalog home titles (use these on ship): `src/lib/ultra-lore.ts` — **The Quiet Desk**, **The Drift Lantern**, **Grid 9**, **Moonruin Roost**, **Heartwood Hall**.

## ClassNest-Bot1 QA (recheck 2026-09-17)

**Verdict:** Plan matches lore + last NOTES misses. Ready to shoot on teacher **`go`**. Nits below are locked into the prompts so other bots do not re-litigate them.

| Check | Result |
|---|---|
| Lore / bible / `ultra-lore.ts` names + homes | Pass |
| s3 stills 11–15 present | Pass |
| Fixes vs 06–10 (face@14, loudnorm, 854×480, one hero, QA stills in git) | Pass |
| Do not redo 01–10 first | Pass |
| Generate gate = `go` | Pass — **waiting** |

**Other bots — hard notes:**

1. **11 mark:** Write a **heart, check, or simple swirl** on the page — **not letters**, not a student name. Virtue still reads as “kind writing” without OCR risk.
2. **12 “face” bar:** Jellyfish has no muzzle. Pass/fail = **bell + glow core readable** at 0.5 / 7 / **14**. Do not false-fail a good clip for lacking mammal eyes.
3. **Ship titles** from `ultra-lore.ts` (with “The …” where present), not the short headings in this file.
4. **One id at a time** if morphing returns. Fail mean **< −40 dB**, max **> −6 dB**, extra body, melt, unreadable face/bell at t=14.
5. **Do not** delete/overwrite 01–10 mp4s. **Do not** redo 01–10 unless the teacher names those ids.

Optional later (not this batch): horrors redo order **02 → 03 → 05** (see NOTES). Soft: 06 face, 09 loudness.

---

## Shoot-bot recheck (2026-09-17, after Bot1)

Looked at **s3 stills** (Bot1 did not). Adjustments locked below. **Do not generate until `go`.**

| Id | Agree with Bot1? | Extra fix |
|---|---|---|
| All | Yes: no letters, jelly bell-bar, lore titles, loudness, no 01–10 redo | I2I must say **hero ≥40%** (06–10 died on wide plates) |
| 11 | Yes on heart/swirl, no letters | **s3 is a gold quill-peacock/phoenix, not a porcupine.** Vibe line in `avatars.ts` is wrong vs the painting. Prompt the bird or I2V will morph. |
| 12 | Yes on bell+glow | s3 **has a tiny face inside the bell** — keep that. Tidalkin **steers around** the kelp (virtue); kelp must not magically part by itself. |
| 13 | Yes on one cube | Keep the **keyboard on the back** from s3. End is still mid-shot; do not require a camera-look if it morphs. |
| 14 | Yes on kind-not-creepy | s3 is a **skeletal owl**. Start already perched (don’t fly in and crop). Colorful ribbon. |
| 15 | Yes on one stag | s3 is a **mossy grove deer**, outdoor, not a hallway. **Locked camera** — do not walk out of frame at t=14 (Bloomkin face-loss). |
| Process | Soft disagree | Default = shoot **11–15 then QA**. Switch to one-id-at-a-time **only if** a clip twins/melts. |

---

## What we are fixing vs 06–10

| Last miss | This round |
|---|---|
| Motion without a readable moral | Beats must show the **virtue** (kind writing, drift, debug, remember, show up) |
| Face gone at t=14 (Bloomkin) | Subject readable on **0.5, 7, and 14** (muzzle **or** jelly bell+glow — see QA note). **Hero stays in frame** — no walk-away wide shot. |
| AAC track but −45 / −53 dB | After Imagine: **loudnorm ~ −20 dB**, keep AAC |
| 736×400 | ffmpeg **854×480** pad (keep audio, no `-an`) |
| Extra copies | One hero, prop = **object**, mid-shot ≥40% of frame |
| Prompt vs painting | I2I/I2V describe **this s3**, not the vibe nickname |
| QA only in `/tmp` | Dump `docs/home-film-qa/11_t0.5.jpg` etc. **before** `ULTRA_HOME_READY` |

Shared negative (append to every prompt):

```
Exactly ONE creature in every frame. No second copy, no extra legs/wings/heads.
Anatomy locked. Match the reference still. Face (or jellyfish bell + tiny face + glow core) visible the whole shot.
Hero stays large in frame through the last second — do not pull the camera back, do not walk out of frame.
No morphing into scenery. No humans, no readable letters or names, no logos, no song, no speech.
Locked or slow camera. Mid-shot, hero fills at least 40% of the frame.
```

I2V: `imagine_image_to_video` from a **16:9 mid-shot I2I of the s3 still** (hero large — not a wide landscape). Duration `15`, resolution `480p`. Then encode:

```bash
ffmpeg -y -i IN.mp4 \
  -vf "scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2,fps=24" \
  -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p \
  -af loudnorm=I=-20:LRA=11:TP=-2 -c:a aac -b:a 128k \
  -movflags +faststart \
  public/avatars/ultra/homes/NN.mp4
```

---

## 11 Quillburst — The Quiet Desk — kind writing

**Virtue:** A kind mark on a page is treasure.  
**s3:** Gold **quill-peacock / phoenix** (long ink-feather tail, crest), not a porcupine. Desk, scrolls, inkwell.  
**Prop:** one page + ink. **Don't:** extra birds; **no letters / no student names**.

**I2I (16:9 mid):** This exact gold quill-peacock from the reference, fills ≥40% of frame, sunlit desk, tea, one blank page, inkwell. Exactly one bird.

**I2V prompt:** 15s, sound, 480p. This exact gold quill-peacock. Locked camera, bird stays large. (1) He dips **one tail-quill** in the inkwell. (2) He draws a single **kind heart (or swirl)** on the blank page — ink mark only, **not letters, not a name**. (3) He lifts the quill; page stays; **head and face still visible**. Sound: quill scratch, ink dip, paper, quiet room.

## 12 Tidalkin — The Drift Lantern — hard days are currents

**Virtue:** Not every problem is a fight; **steer around** it.  
**s3:** Pink-gold jellyfish with a **tiny face inside the bell**, already glowing.  
**Prop:** kelp knot. **Don't:** extra jellies.  
**Face bar:** **bell + tiny face + glow core** readable at 0.5 / 7 / 14.

**I2I:** This exact jellyfish, fills ≥40%, tide-pool, lantern-glow, tiny face in the bell visible. One jellyfish.

**I2V prompt:** 15s, sound, 480p. This exact jellyfish. Locked camera. (1) It pulses light; the small face in the bell stays readable. (2) A **knot of kelp** is ahead; Tidalkin **drifts around** it (the creature chooses the long way — kelp does not magically vanish). (3) Open water; **bell, tiny face, and glow** still readable. Sound: water, soft pulse, distant tide.

## 13 Hexabyte — Grid 9 — debug the one broken line

**Virtue:** Find the actual error; don’t rewrite the whole day.  
**s3:** Neon mesh fox, **keyboard on its back**, sitting, one creature.  
**Prop:** glitching cube. **Don't:** extra foxes; cube stays **one** object; keyboard stays on its back.

**I2I:** This exact neon mesh fox, fills ≥40%, keyboard on back, neon alley. One fox. One small glitching cube on the floor.

**I2V prompt:** 15s, sound, 480p. This exact fox (keyboard on back). Locked camera, stays large. (1) Sniffs the **glitching cube**. (2) One paw-tap — cube static clears to a solid color; still one cube. (3) Floor neon lines relight (lines only, not extra animals); fox face clear. Sound: digital ticks, one clean beep, alley hum.

## 14 Bonehollow — Moonruin Roost — nobody is forgotten

**Virtue:** Remember the leftover / the quiet one.  
**s3:** Kind **skeletal owl**, warm gold eyes, moonlit ruin — not gore.  
**Prop:** lost **colorful** ribbon. **Don't:** extra owls, scary, skull close-up horror.

**I2I:** This exact skeletal owl, fills ≥40%, already perched on the ruin, warm silver light, one colorful ribbon on the stone. Kind, not creepy. One bird.

**I2V prompt:** 15s, sound, 480p. This exact owl. Locked camera; already perched — do not fly in. (1) Looks down at the ribbon. (2) Gently picks up **one colorful ribbon** in the beak. (3) Tucks it into the roost; **head and gold eyes still readable**. Sound: night wind, soft wing, ribbon rustle.

## 15 Sapwood — Heartwood Hall — showing up / coming back

**Virtue:** A miss is not a fallen tree if you return. Attendance is rings.  
**s3:** **Mossy bark deer** with antlers and mushrooms, standing in a grove (outdoor), one animal.  
**Prop:** stump that gains a ring. **Don't:** extra deer; do not exit frame.

**I2I:** This exact mossy forest deer, fills ≥40%, ancient grove, one stump in the foreground near the hooves. One deer.

**I2V prompt:** 15s, sound, 480p. This exact deer. **Locked camera — deer stays in frame through the last frame.** (1) Stands by the stump (no long walk). (2) Presses a hoof to the **stump**; a new growth-ring appears. (3) A single new leaf unfurls on the stump; **face and antlers still clear**. Sound: wood creak, hoof, leaf.

---

## After `go` (bot checklist)

1. Shoot 11→15 as a batch, then QA. **If any clip twins or melts, redo that id alone** before shipping it.  
2. Encode with the ffmpeg above (audio kept + loudnorm).  
3. Frames 0.5 / 7 / 14 into `docs/home-film-qa/{id}_t….jpg`. Fail extra body, melt, **unreadable face/bell**, mean **< −40 dB**, max **> −6 dB**, hero tiny at t=14.  
4. Only passers → `ULTRA_HOME_READY` + posters jpg + version bump + `npm run pack:code` + `sh scripts/push-github.sh`.  
5. Tell the teacher which ids passed / failed.  
6. Do **not** pack avatars zip / portable / APK unless asked.

## Teacher audit (this file)

Does each prompt make the **virtue** visible without a narrator? 11 is a **peacock**, not a porcupine — OK? Say **`go`** to shoot, or mark edits here.
