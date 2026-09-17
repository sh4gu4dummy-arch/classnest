# Home round 11–15 (audit this, then `go`)

Teacher: **continue before redoing 01–10.** Improve the next five using lore + last QA.

**Do not generate until `go`.**

Ids: **11 Quillburst, 12 Tidalkin, 13 Hexabyte, 14 Bonehollow, 15 Sapwood.**  
Stills: `public/avatars/ultra/11-s3.jpg` … `15-s3.jpg`.  
Stories: [ultra-lore-bible.md](ultra-lore-bible.md) §§11–15.

## What we are fixing vs 06–10

| Last miss | This round |
|---|---|
| Motion without a readable moral | Beats must show the **virtue** (kind writing, drift, debug, remember, show up) |
| Face gone at t=14 (Bloomkin) | Muzzle/face **clear on 0.5, 7, and 14** |
| AAC track but −45 / −53 dB | After Imagine: **loudnorm ~ −20 dB**, keep AAC |
| 736×400 | ffmpeg **854×480** pad (keep audio, no `-an`) |
| Extra copies | One hero, prop = **object**, mid-shot ≥40% of frame |
| QA only in `/tmp` | Dump `docs/home-film-qa/11_t0.5.jpg` etc. **before** `ULTRA_HOME_READY` |

Shared negative (append to every prompt):

```
Exactly ONE creature in every frame. No second copy, no extra legs/wings/heads.
Anatomy locked. Face visible the whole shot. No morphing into scenery.
No humans, no readable student names, no logos, no song, no speech.
Locked or slow camera. Mid-shot, hero fills at least 40% of the frame.
```

I2V: `imagine_image_to_video` from a **16:9 mid-shot I2I of the s3 still** (hero large — not a wide landscape). Duration `15`, resolution `480p`. Then encode:

```bash
ffmpeg -y -i IN.mp4 \
  -vf "scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2,fps=24" \
  -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -af loudnorm=I=-20:LRA=11:TP=-2 \
  -movflags +faststart \
  public/avatars/ultra/homes/NN.mp4
```

---

## 11 Quillburst — Quiet Desk — kind writing

**Virtue:** A kind sentence / a name spelled right is treasure.  
**Prop:** one page + ink. **Don't:** extra porcupines; no real student names on the page.

**I2I (16:9 mid):** This exact ink-quill porcupine (Quillburst), large in frame, sunlit desk, tea, one blank page. Exactly one creature.

**I2V prompt:** 15s, sound, 480p. This exact porcupine. (1) He dips **one quill** in an inkwell. (2) He writes a single kind stroke on the blank page (abstract mark, not letters of a name). (3) He steps back; the page stays on the desk; face still visible. Sound: quill scratch, ink dip, paper, quiet room.

## 12 Tidalkin — Drift Lantern — hard days are currents

**Virtue:** Not every problem is a fight; drift around it.  
**Prop:** kelp knot. **Don't:** extra jellies.

**I2I:** This exact bioluminescent jellyfish, large, tide-pool that never beaches, homemade lantern-glow. One jellyfish.

**I2V prompt:** 15s, sound, 480p. This exact jellyfish. (1) It pulses light in dark water. (2) A **knot of kelp** parts as a gentle current goes around it (not through a fight). (3) It drifts the open lane; bell and face-glow still readable. Sound: water, soft pulse, distant tide.

## 13 Hexabyte — Grid 9 — debug the one broken line

**Virtue:** Find the actual error; don’t rewrite the whole day.  
**Prop:** glitching cube. **Don't:** extra foxes.

**I2I:** This exact neon mesh fox, large, neon alley inside a friendly computer. One fox. One small glitching cube on the floor.

**I2V prompt:** 15s, sound, 480p. This exact fox. (1) Sniffs the **glitching cube**. (2) One paw-tap — the cube’s static clears to a solid color (the patch). (3) A neon path relights; fox looks at camera, face clear. Sound: digital ticks, one clean beep, alley hum.

## 14 Bonehollow — Moonruin Roost — nobody is forgotten

**Virtue:** Remember the leftover / the quiet one.  
**Prop:** lost ribbon. **Don't:** gore, extra birds, scary.

**I2I:** This exact spectral bone bird, large, silver ruin roost at night, kind not scary. One bird. One ribbon on a stone.

**I2V prompt:** 15s, sound, 480p. This exact bird. (1) Lands on the ruin. (2) Gently picks up **one lost ribbon** in the beak. (3) Tucks it into the roost nest; head/face still readable. Sound: night wind, soft wing, ribbon rustle.

## 15 Sapwood — Heartwood Hall — showing up / coming back

**Virtue:** A miss is not a fallen tree if you return. Attendance is rings.  
**Prop:** stump that gains a ring. **Don't:** extra stags.

**I2I:** This exact bark-forest stag, large, ancient grove that is also a house. One stag. One stump in the foreground.

**I2V prompt:** 15s, sound, 480p. This exact stag. (1) Walks the hall. (2) Presses a hoof to the **stump**; a new growth-ring appears. (3) A single new leaf unfurls; stag’s face still clear as he leaves. Sound: wood creak, hoof, leaf.

---

## After `go` (bot checklist)

1. Shoot 11→15 (or one id if morphing returns).  
2. Encode with the ffmpeg above (audio kept).  
3. Frames 0.5 / 7 / 14 into `docs/home-film-qa/`. Fail extra body, melt, **unreadable face**, mean **< −40 dB**.  
4. Only passers → `ULTRA_HOME_READY` + posters jpg + version + push.  
5. Tell the teacher which ids passed.

## Teacher audit (this file)

Does each prompt make the **virtue** visible without a narrator? Any beat to cut? Say **`go`** to shoot, or mark edits here.
