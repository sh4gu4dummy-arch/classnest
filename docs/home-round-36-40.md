# Home round 36–40 (PLAN — QA audited; wait teacher `go`)

**Expedite (Ash):** all **five in one pass**. No trial-stop between ids. Twin re-roll **once** per id then catalog (failures stay).

**Do not generate until `go`.** Do not remake 33–35 unless named. 32 stays.

Ids: **36 Thornveil, 37 Hexmorrow, 38 Ironmaw, 39 Gildframe, 40 Vexilith.**  
Wave = **humanoid / fantasy** — **do not** four-leg-animalize. Lock catalog **face**.  
Homes: Moonpath Canopy, Stormkettle Cottage, Bellforge Keep, Clock Nave, Facet Embassy.  
Lore: [ultra-lore-bible.md](ultra-lore-bible.md) §§36–40.  
Bot1 + QAsupervisor LOCK (2026-09-18).

### Ash limb feedback (exact — from 31)

> action/movement better, weirdness with wings becoming arms etc, good enough to proceed but note down my feedback becareful with tails or wings or fins or anything especially if ur mixing and getting messy with bipedal or somewhat humanized animals etc AI gets messy/blurry. the owls wings are sometimes arms sometimes wings etc. note my feedback then make prompt for next one 32.

**Humanoid ≠ animalize:** elves/witches/orcs/knights/crystal diplomats stay people-shaped. Wings/tails/ears stay that anatomy — never extra human arms. Twin HARD only with **two distinct bodies**.

---

## Keyframe method (33–35 twin lesson + Ash multi-still)

15s I2V from **one** still grows twins. Use **locked frames**:

1. **Still A** — start in the home, one hero ≥50%, empty of extras. Dump `docs/home-film-qa/{id}_A.jpg`. **PASS A** before B.
2. **Still B** — I2I **from A** (same face). **Virtue in action** (not souvenir-pickup). Dump `{id}_B.jpg`. **PASS B** before C.
3. **Still C** — I2I **from B**. Aftermath / new beat of place, same one hero. Dump `{id}_C.jpg`. **PASS C** before any I2V.
4. **Dirty mid still = stop the chain** — redo that still; do not hope I2V fixes it.
5. **Catalog rewrite rule:** if catalog s3 is wrong pose/set/letters/gore-trophy → I2I rewrites home stills; never I2V dirty catalog.

### Lock-frame video chain (smoother transitions)

- **Clip1** I2V first-frame = still **A** (not a re-prompt from catalog alone).
- **Clip2** I2V first-frame = still **B** (not re-prompt from A).
- **Clip3** I2V first-frame = still **C**.
- Prefer **Extend** A→B→C if Imagine UI supports extend-from-last-frame.
- Else **hard concat** three ~5s clips with 8–10 frame crossfade → 15s 854×480:

```bash
# example after three short clips exist
ffmpeg -y -i clipA.mp4 -i clipB.mp4 -i clipC.mp4 \
  -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.4:offset=4.6[ab];[ab][2:v]xfade=transition=fade:duration=0.4:offset=9.2[v];[0:a][1:a][2:a]concat=n=3:v=0:a=1[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p \
  -af "loudnorm=I=-20:LRA=11:TP=-2,volume=0.5" -c:a aac -b:a 128k -movflags +faststart \
  public/avatars/ultra/homes/NN.mp4
```

Do **not** 15s-from-A-only — twin factory.

Shared still/video negative:

```
Exactly ONE being in every frame. No second copy, no extra arms/heads. Match this face from the reference.
Wings/tails/ears stay that anatomy — never extra human arms. No crowds, no readable letters, no song, no speech.
Hero ≥50%. Props are objects. Virtue is being DONE, not looked at. Blank or imaginary-rune marks only — no Latin/kanji.
```

---

## 36 Thornveil — Moonpath Canopy — aim true, then **share** the path

**Catalog s3:** antlered wood-elf ranger, glowing bow, moon-forest (bust/hero). Humanoid OK. I2I real 16:9 canopy path.  
**Virtue:** bow **points the way for others** — not a hunt. No violence.

| Still | Lock |
|---|---|
| A | One elf at a dark fork, bow, unlit branch-road. Empty woods. Hero ≥50%. |
| B | **Loosing one light-arrow** into the path — arrow in flight, path starting to glow (not aimed at a creature). |
| C | Walking the **lit** path, bow lowered (sharing, not posing). Face readable. |

### I2I A
```
Cinematic 16:9 Moonpath Canopy at night. This exact antlered wood-elf face from the reference. ONE elf at a dark fork in the woods, bow ready, unlit branch-road ahead. Hero ≥50%. Empty woods — no second elf, no people. Photoreal. No readable letters.
```
### I2I B (from A)
```
Same elf face and body as reference still A. Mid-shot: loosing ONE light-arrow into the path — arrow in flight, path beginning to glow. Not hunting a creature. Exactly one elf. Hero ≥50%. No letters (glow lines OK).
```
### I2I C (from B)
```
Same elf. Walking the now-lit path, bow lowered, sharing the way. Face readable. Exactly one elf. Hero ≥50%. Empty woods. No letters.
```
### I2V
Clip1←A, Clip2←B, Clip3←C (~5s each) or Extend. Sound: bowstring, leaf-wind, soft path chime.

**Don’t:** extra elves; hunt/violence; Latin/kanji on path.

---

## 37 Hexmorrow — Stormkettle Cottage — spills are how you learn

**Catalog s3 trap:** outdoor cauldron + **many** floating bottles + storm castle — **not** Stormkettle kitchen. **Rewrite.** One witch. Not scary.

| Still | Lock |
|---|---|
| A | Cottage kitchen: one witch, kettle **about to boil over**, **one** empty bottle ready. |
| B | **Spill in progress** — gold steam/liquid caught **into the one bottle**. |
| C | She **shelves** the bottle; a star mark (**no text**). No victory cackle. |

### I2I A
```
Cinematic 16:9 Stormkettle Cottage kitchen at night, rain on window. This exact witch face from the reference. ONE witch, kettle about to boil over, ONE empty bottle ready on the counter. Hero ≥50%. Empty kitchen — no second witch, no people, no outdoor castle. Not scary. Photoreal. No letters on labels.
```
### I2I B (from A)
```
Same witch. Spill in progress: gold steam/liquid from kettle caught into the ONE bottle. Exactly one witch, one bottle. Hero ≥50%. No letters. Not scary.
```
### I2I C (from B)
```
Same witch shelving the filled bottle; a simple star mark with no text. No victory pose. Exactly one witch. Hero ≥50%. Empty kitchen. No letters.
```
### I2V
Clip1←A, Clip2←B, Clip3←C. Sound: kettle hiss, glass, far thunder.

**Don’t:** bottle swarm; outdoor castle; scary; label letters; extra witches.

---

## 38 Ironmaw — Bellforge Keep — repair > trophy

**Catalog s3 trap:** warhammer + skull armor + lava cavern = trophy warrior. **Rewrite hard:** door + broken hinge at Bellforge. Gentle hammer. No gore.

| Still | Lock |
|---|---|
| A | One orc at a door, **broken hinge** in tongs/hammer, forge glow. |
| B | **Fitting/heating the hinge onto the door** — repair obvious. |
| C | Hinge **clicks**; door works; hammer **down** (not raised as trophy). |

### I2I A
```
Cinematic 16:9 Bellforge Keep interior. This exact orc face from the reference. ONE orc at a wooden door holding a BROKEN HINGE (tongs/hammer), forge glow. Not a lava battlefield. No skull-trophy pose. Hero ≥50%. Empty forge — no second orc. Hammer faces blank — no readable runes. Photoreal. No gore.
```
### I2I B (from A)
```
Same orc. Fitting/heating the hinge onto the door — repair obvious. Exactly one orc. Hero ≥50%. No readable runes. No gore. No sword-as-beat.
```
### I2I C (from B)
```
Same orc. Hinge seated; door works; hammer resting DOWN (not raised as trophy). Face readable. Exactly one orc. Hero ≥50%.
```
### I2V
Clip1←A, Clip2←B, Clip3←C. Sound: bellows, gentle hammer, metal click.

**Don’t:** extra orcs; gore; sword trophy; readable hammer runes; lava arena.

---

## 39 Gildframe — Clock Nave — showing up is the oath

**Catalog s3:** gold clockwork paladin in gear-nave — set close. Lock diving-bell helm face. One knight. Gear is the prop.

| Still | Lock |
|---|---|
| A | One paladin **arriving/kneeling** with **one gear** (late OK). Empty nave. |
| B | **Gear slotting** into the cathedral clock — show-up enacted. |
| C | Clock ticks; he **stands present**. No crowd of saints. |

### I2I A
```
Cinematic 16:9 Clock Nave. This exact gold paladin / diving-bell helm from the reference. ONE knight arriving or kneeling with ONE gear. Empty nave — no second knight, no saint crowd. Hero ≥50%. Clock face has ticks/marks only — no readable letters. Photoreal.
```
### I2I B (from A)
```
Same paladin. Gear slotting into the cathedral clock. Exactly one knight. Hero ≥50%. No letters on the clock. Empty nave.
```
### I2I C (from B)
```
Same paladin standing present as the clock ticks. Face/helm readable. Exactly one knight. Hero ≥50%. No letters. No crowd.
```
### I2V
Clip1←A, Clip2←B, Clip3←C. Sound: footsteps, gear seat, one bell-note.

**Don’t:** extra knights; clock-face letters; saint crowds.

---

## 40 Vexilith — Facet Embassy — feelings are messages

**Catalog s3 trap:** crystal diplomat **on throne**, gems already colorful. **Rewrite:** standing, **dull** shard in hands, empty embassy. Not throne tableau.

| Still | Lock |
|---|---|
| A | One diplomat, **dull** shard in hands, embassy hall empty. |
| B | Shard **faceting into color** while held (naming the feeling — not loot). |
| C | Sets the colored shard on a **pedestal**. Face readable. |

### I2I A
```
Cinematic 16:9 Facet Embassy hall. This exact crystal diplomat face from the reference. STANDING (not on a throne), holding a DULL uncolored shard in hands. Hero ≥50%. Empty hall — no second being, no throne-sleep tableau. Photoreal. No letters.
```
### I2I B (from A)
```
Same diplomat. Dull shard faceting into color while held — feeling named, not inspecting loot. Exactly one being. Hero ≥50%. No letters.
```
### I2I C (from B)
```
Same diplomat setting the colored shard on a pedestal. Face readable. Exactly one being. Hero ≥50%. Empty embassy. No letters.
```
### I2V
Clip1←A, Clip2←B, Clip3←C. Sound: crystal chime, quiet hall.

**Don’t:** throne tableau; already-colored starting shard; extra beings; letters.

---

## After `go`

1. Shoot **36–40 in one pass** with the keyframe stack (still-gate A→B→C, then lock-frame clips).
2. Dump `{id}_A/B/C.jpg` + t-stamps into `docs/home-film-qa/`.
3. Twin = two distinct bodies → one re-roll then catalog.
4. `AUDIT-36-40.md` + team-qa log. No zip/APK unless asked.
