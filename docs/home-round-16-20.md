# Home round 16–20 (audit this, then `go`)

**Do not generate until `go`.** Do not redo 01–15 unless named.

Ids: **16 Prismite, 17 Junkbyte, 18 Mirthling, 19 Abyssrake, 20 Solarox.**  
Stills: `public/avatars/ultra/16-s3.jpg` … `20-s3.jpg`. **Prompt the painting.**  
Lore: [ultra-lore-bible.md](ultra-lore-bible.md) §§16–20.  
Homes in `ultra-lore.ts`: **Prism Cathedral, The Scrap Yard Chapel, The Party Pocket, The Lantern Trench, The Dawn Ziggurat.**

## What 11–15 taught (use this)

| Finding | Next round |
|---|---|
| Prompting s3 beat the vibe nickname (11 peacock) | Open s3 **before** writing I2V. 18 is a **round party-creature with a hat**, not a goo blob. |
| Locked camera kept faces at t=14 | **Stay in frame** through last second. 20 must not “bow and leave.” |
| One object prop + 3 beats | Keep. 17 scrap pile is a **twin magnet** — junk = objects, not extra beetles. |
| 854×480 + loudnorm: means ~−20, **peaks still hot** (11 max −0.9) | Add **alimiter** after loudnorm. Fail only if mean < −40 or true clip ~0 dB. |
| Heart-on-page was readable virtue | Virtue must show in a **still at t=7**. 18: **no letters** on a banner. |
| Other bot needs stills, not mp4s | After shoot: copy s3 + t0.5/3/7/11/14 into `docs/home-film-qa/` **before** `ULTRA_HOME_READY`. |
| Audit is the teammate job | After ship, write `docs/home-film-qa/AUDIT-16-20.md` like 11–15. |

Shared negative:

```
Exactly ONE creature in every frame. No second copy, no extra legs/wings/heads.
Match the reference still. Anatomy locked. Face (or beetle eyes / blob face / eel head / scarab) readable through the last second.
Hero stays large — do not pull camera back, do not walk/swim/fly out of frame.
No morphing into scenery. No humans, no readable letters, no logos, no song, no speech.
Locked or slow camera. Mid-shot, hero fills at least 40% of the frame.
```

I2V from 16:9 I2I of s3 (hero ≥40%). Duration `15`, `480p`. Then:

```bash
ffmpeg -y -i IN.mp4 \
  -vf "scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2,fps=24" \
  -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p \
  -af "loudnorm=I=-20:LRA=11:TP=-1.5,alimiter=limit=0.7" -c:a aac -b:a 128k \
  -movflags +faststart \
  public/avatars/ultra/homes/NN.mp4
```

---

## 16 Prismite — Prism Cathedral — try another angle

**s3:** Iridescent **crystal rabbit**, rainbow shards, already in a prism hall. One rabbit.  
**Virtue:** Same problem, turn it, new color.  
**Prop:** one white/clear crystal. **Don't:** extra rabbits; hopping out of frame.

**I2I:** This exact crystal rabbit, fills ≥40%, prism cavern. One rabbit. One unlit crystal in front of the nose.

**I2V:** 15s, sound, 480p. This exact rabbit. Locked camera, stays large. (1) Noses **one crystal**. (2) Crystal throws a **rainbow path** to the side (light, not a second animal). (3) Rabbit turns its head along that path; **face still clear**. Sound: glass chime, soft hop (in place).

## 17 Junkbyte — Scrap Yard Chapel — fix don’t toss

**s3:** Green-gold **gear beetle**, one body, scrap is machinery not extra bugs.  
**Virtue:** Rebuild the leftover.  
**Prop:** one bent cog. **Don't:** extra beetles hiding in the pile (highest twin risk this batch).

**I2I:** This exact scrap beetle, fills ≥40%. Pile is nuts/bolts/cogs **as objects**. One bent cog in the foreground. Exactly one beetle.

**I2V:** 15s, sound, 480p. This exact beetle. Locked camera. (1) Finds **one bent cog**. (2) Presses it flat with its legs (no extra arms). (3) Slots the round cog into a humming panel; **beetle face still readable**. Sound: metal clink, short hum. Scrap never becomes a second beetle.

## 18 Mirthling — Party Pocket — celebrate the try

**s3:** Round **cream party-creature**, pink inner ears, **party hat**, confetti — cute animal, not formless goo.  
**Virtue:** Effort gets a party, not just wins.  
**Prop:** one party popper. **Don't:** extra blobs; **no letters** (skip “YOU TRIED”).

**I2I:** This exact round hatted creature, fills ≥40%, streamers, one popper in the foreground. One creature.

**I2V:** 15s, sound, 480p. This exact creature (same hat, same round body). Locked camera. (1) Nudges **one party popper**. (2) Popper bursts **confetti** (paper bits, not extra creatures). (3) Creature bounces in place, face+hat visible. Sound: pop, paper, giggle-bell (not speech).

## 19 Abyssrake — Lantern Trench — light for deep work

**s3:** One **angler eel**, lure already glowing, trench already full of **object** lanterns.  
**Virtue:** Long projects get a homemade light.  
**Prop:** one spare lantern (object, not a second eel). **Don't:** extra eels; lure is part of this body, not a second head. Do not swim away.

**I2I:** This exact angler eel, fills ≥40%, already in the trench, one unlit lantern on a coral hook. One eel.

**I2V:** 15s, sound, 480p. This exact eel. Locked camera, head stays in frame. (1) Angler-lure brightens. (2) Eel hangs **one spare lantern** on the coral hook (lantern = object). (3) Lure and head still readable; does not leave. Sound: deep water, glass-lantern clink.

## 20 Solarox — Dawn Ziggurat — new day, begin

**s3:** Gold-blue **sun scarab** already **pushing a sun orb** up stone steps.  
**Virtue:** Clean slate / morning courage.  
**Prop:** the sun-disc (already in the painting). **Don't:** extra scarabs. **Don’t bow and walk off** (that was Bloomkin’s t=14 fail).

**I2I:** This exact scarab, fills ≥40%, ziggurat steps, both mandibles on the sun-disc. One scarab.

**I2V:** 15s, sound, 480p. This exact scarab. Locked camera. (1) Pushes the **sun-disc** up **one step**. (2) First light hits the court. (3) Scarab **stays** with the disc, body and head readable. Sound: stone scrape, warm bell, dawn birds far off.

---

## After `go`

1. Batch 16→20, then still-audit. Redo a single id if it twins/melts.  
2. Encode with ffmpeg above.  
3. `docs/home-film-qa/{id}_s3.jpg` + `_t0.5/_t3/_t7/_t11/_t14.jpg` **before** `ULTRA_HOME_READY`.  
4. Passers only → READY + posters + version + push.  
5. Write `docs/home-film-qa/AUDIT-16-20.md` for the other bot (same shape as 11–15).  
6. No avatars zip / portable / APK unless asked.

## Teacher audit

18 with **no banner text** — OK? 17 scrap pile — worried about twin beetles; say if you want a cleaner set. **`go`** to shoot.
