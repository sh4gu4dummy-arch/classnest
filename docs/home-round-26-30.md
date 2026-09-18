# Home round 26–30 (PLAN only — audit, then teacher `go` after 21–25)

**Parallel (teacher):** QA may edit **this file only** while 21–25 media is in flight. Do not touch `homes/`, AUDIT-21-25, START-HERE, or VERSION — those clash with the executor.

Ids: **26 Puddlefin, 27 Ashenhoof, 28 Paperwing, 29 Voltkoi, 30 Glimmercap.**  
Lore: [ultra-lore-bible.md](ultra-lore-bible.md) §§26–30.  
Homes: Willowmill Race, Red Mesa Watch, The Atrium Stacks, Cloud Shrine Pond, Cap City.  
Shared board: [team-qa.md](team-qa.md). Bust-vs-home: same as 21–25.

| Topic | Status |
|---|---|
| 26–30 s3 | **Portraits + sliver of set** (same class as 21). Too thin to I2V. I2I **builds** a readable 16:9 home. |
| Morph traps | **28** do not unfold from a blank sheet (that’s a morph). Already a crane; paper is a **prop**. **29** one body — no fry + dragon. |
| Start pose | Already in place. No dive-away / climb-off / fly-out. |
| Loudness | Same proof recipe as 21–25 (`/tmp/18-proof.mp4`, max ≤ −6). |

## Critical: do not I2V the bust

Teacher: sliver of mill/mesa/books/torii/mushrooms behind a face **≠** a home stage.

- Compare to `16-s3`. If the hero fills the square, **bust**.
- **I2I** 16:9 mid-shot of the **named home**, hero ≥40%, empty of others/humans. Lock face from the bust. Then I2V that still.
- Dump home I2I as `docs/home-film-qa/{id}_s3.jpg`.

Shared negative (every I2I and I2V):

```
Exactly ONE creature in every frame. No second copy, no baby, no extra legs/wings/heads.
Match this hero’s face and species from the reference. Anatomy locked. Face/head readable through the last second.
Hero stays large — do not leave the frame. Mid-shot, hero fills at least 40%.
No morphing into scenery or from a blank object into an animal. No humans, no crowds, no readable letters, no logos, no song, no speech.
Locked or slow camera. Empty of other animals.
```

Encode: copy 21–25 proof chain (loudnorm + volume=0.55 + alimiter + loudnorm). Fail mean < −40 or max > −6.

I2V: `15s`, `480p`, from the **home I2I**.

---

## 26 Puddlefin — Willowmill Race — kindness pebbles

**Bust s3:** moonlit otter, mill sliver behind — **not** I2V source.  
**Prop / t7:** **one smooth pebble** going into a satchel or onto a pile (pebble readable).  
**Don’t:** extra otters; no millers/humans; don’t dive out of frame.

**I2I:** Exact otter face, 16:9 mid-shot in an **empty mill-race** (water, wheel, willow). Otter already in the water, satchel or pebble-pile visible. Hero ≥40%. One otter.

**I2V:** Locked camera. Already in the race. (1) Holds **one pebble**. (2) **t7:** pebble into satchel / onto pile; mill wheel glows a notch. (3) Face clear at t14; stays.

## 27 Ashenhoof — Red Mesa Watch — keep going unseen

**Bust s3:** mesa ibex, desert sliver — not I2V source.  
**Prop / t7:** **one trail-flag stone** planted (stone readable).  
**Don’t:** extra ibex; don’t climb out of frame.

**I2I:** Exact ibex, 16:9 mid-shot already **on a red mesa ledge**, empty desert, one stone in foreground. Hero ≥40%. One ibex.

**I2V:** Locked camera. Already on the ledge. (1) Turns to the stone. (2) **t7:** plants the trail stone. (3) Stands watch; face/horns readable at t14.

## 28 Paperwing — Atrium Stacks — drafts / second pages

**Bust s3:** origami crane on books — sliver of library, not a full atrium.  
**Prop / t7:** **one paper sheet** getting a crease (paper = object).  
**Don’t:** extra cranes; **do not morph from a blank sheet into a bird** (bible “unfolds” is a morph trap). Already a crane.

**I2I:** Exact cream crane, 16:9 mid-shot in **empty atrium stacks**, floating books as scenery, one loose sheet near a wing. Hero ≥40%. One crane. Already perched.

**I2V:** Locked camera. Already perched. (1) Looks at the sheet. (2) **t7:** creases **one true wing-fold** on the sheet (sheet stays paper). (3) Head readable; does not fly away.

## 29 Voltkoi — Cloud Shrine Pond — one honest circle

**Bust s3:** koi-dragon, shrine sliver — not I2V source.  
**Prop / t7:** **torii reflection** lighting in the pond (gate = object, not a second animal).  
**Don’t:** extra koi or extra dragon; lure/whiskers ≠ second head. Do not rise out of frame (05 lesson).

**I2I:** Exact koi-dragon, 16:9 mid-shot already **in the shrine pond**, empty torii, star-water. Hero ≥40%. **One** body.

**I2V:** Locked camera. Already in the pond. (1) One slow circle. (2) **t7:** torii reflection lights. (3) Same body, head readable at t14; stays in frame.

## 30 Glimmercap — Cap City — tiny ideas start forests

**Bust s3:** frog with mushroom hat, mushroom sliver — not I2V source.  
**Prop / t7:** **one mushroom lantern** lighting (or a spark entering the cap — spark = light, not a creature).  
**Don’t:** extra frogs; mushrooms are objects, not animals.

**I2I:** Exact frog + cap, 16:9 mid-shot already **on a log in Cap City**, empty grove, one unlit mushroom lantern in foreground. Hero ≥40%. One frog.

**I2V:** Locked camera. Already on the log. (1) A tiny spark (light only) toward the cap. (2) **t7:** the mushroom lantern lights. (3) Face readable at t14; stays.

---

## After `go` (this batch only)

1. Proof-encode `/tmp/18-proof.mp4` if not already proven this session.  
2. I2I home → dump `{id}_s3.jpg` → I2V → encode → volumedetect.  
3. Redo twin/human/exit/morph **before** READY.  
4. Stills t0.5/3/7/11/14. Confirm t7 phrase. Honest soft column. `AUDIT-26-30.md` + team-qa log.  
5. No zip/APK unless asked.

## Teacher

21–25 still wait for **`go`**. This file is the **following** five for QA to audit now.
