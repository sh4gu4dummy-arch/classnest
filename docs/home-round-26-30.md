# Home round 26–30 (PLAN only — audit, then teacher `go`)

**Parallel (teacher):** QA may edit **this file only** while executor owns 21–25 media / START / VERSION. Do not touch `homes/`, AUDIT-21-25, START-HERE, or VERSION in the same breath.

Ids: **26 Puddlefin, 27 Ashenhoof, 28 Paperwing, 29 Voltkoi, 30 Glimmercap.**  
Lore: [ultra-lore-bible.md](ultra-lore-bible.md) §§26–30.  
Homes: Willowmill Race, Red Mesa Watch, The Atrium Stacks, Cloud Shrine Pond, Cap City.  
Shared board: [team-qa.md](team-qa.md). Bust-vs-home: same method as 21–25.

| Topic | Status (Bot1 QA 2026-09-18) |
|---|---|
| 26–30 s3 | Mix of **bust+sliver** and **near-home squares**. Still: if hero fills the square or set is thin, **I2I builds** a readable 16:9 home. Never I2V the catalog file blind. |
| Morph traps | **28** bible “unfolds from a sheet” = morph — already the bird; paper is a **prop**. **29** bible “rises” = exit — stay in pond, one body. |
| Species lock | **28 s3 is a golden phoenix / paper-bird, not a cream origami crane.** Match **that** face/plumage. |
| Start pose | Already in place. No dive-away / climb-off / fly-out / rise-out. |
| Loudness | Use the **recipe that actually passed 21–25**, not the old double-loudnorm copy. |

## ClassNest-Bot1 — prompt audit (2026-09-18)

Opened `26–30-s3` + bible + AUDIT-21-25 shooter notes. **Do not generate until `go`.**

### Must fix before shoot

1. **Encode recipe was stale.** Shooter proved on 21–25: `loudnorm=I=-20:LRA=11:TP=-2,volume=0.5` **last** (no second loudnorm — that bounced peaks). Proof 18 hit max −9.2. Copy **that** chain below. Soft-quiet means on 22/24/25 are OK if > −40; still fail max > −6.
2. **28 species.** Catalog s3 = luminous **phoenix / library bird** (gold-cream, wide wings, atrium). Plan must not say “cream origami crane” alone — lock to the s3 bird. Paper sheet = object prop; never hatch from blank paper.
3. **30 hat-house / back mushrooms.** Cap has a tiny door+window and glowing mushrooms on the back. Ban animating a **tiny inhabitant**, extra frogs, or mushroom-creatures. Spark = **light only**.
4. **26 satchel contents.** Bust shows glowing crystal gems in the satchel; virtue is **smooth kindness pebbles**. I2I/I2V must show a **dull smooth stone pebble**, not a gem swarm (gems read as sparkle clutter / second props).
5. **29 t7 readability.** “Torii reflection lights” is easy to miss at 480p. Force a **bright pond glow under the torii** (or lit water path), not a faint shimmer. One body only — whiskers ≠ second head. **No rise out of frame** (bible “rises” + 05 lesson).
6. **28 letters.** Floating books/pages love readable text. Shared negative already bans letters — prompt says **closed books / blank or blurred pages**.
7. **27 horn steam.** Ethereal wisps on horn tips stay light/steam — do not become a second animal or face.

### Soft / keep

- Bust-vs-home + I2I dump path — keep.
- Already-in-place (overrides bible dives/climbs/unfolds/rises) — keep.
- 28 morph trap and 29 one-body — keep, strengthened below.
- No humans/crowds — keep (millers, hikers, library patrons, shrine visitors, Cap City crowds).

### Lessons from 21–25 full-stamp self-QA (do not rewrite the batch)

No horrors. Keep the plan. Three reinforcements only:

- **Empty furniture** must not read as a seated human (22 t11 chair hunt). 28 atrium: chairs empty, no coats that look like patrons.
- **Mist / fog / reflections** empty of animal silhouettes (23 t3 hunt). 26 water, 27 heat-haze, 29 pond: one body.
- **Already-in-place still drifted** toward flight on 25 t11. 28/29: stay perched / in-pond through t14.

---

21–25 are **shipped** (v0.090). This file is next; still wait teacher `go` for 26–30.

---

## Critical: do not I2V the catalog s3

- Compare to `16-s3`. If a stranger cannot name the **PLACE**, or the hero fills the square → treat as bust/sliver → **I2I first**.
- **I2I** 16:9 mid-shot of the **named home**, hero ≥40%, empty of others/humans. Lock face/species from the catalog still. Then I2V that stage.
- Dump home I2I as `docs/home-film-qa/{id}_s3.jpg` (stage still for QA).

Shared negative (every I2I and I2V):

```
Exactly ONE creature in every frame. No second copy, no baby, no chick, no cub, no fry, no extra legs/wings/heads/faces.
Match this hero’s face and species from the reference. Anatomy locked. Face/head readable through the last second.
Hero stays large — do not leave the frame. Mid-shot, hero fills at least 40%.
No morphing into scenery or from a blank object into an animal. No humans, no silhouettes, no crowds, no readable letters, no logos, no song, no speech.
Locked or slow camera. Empty of other animals. Props are objects only.
```

## Encode (prove before batch — 21–25 proven recipe)

Standing gate: mean **< −40** fail; max **> −6** fail. Target mean −22…−18 (quiet soft OK if still > −40).

```bash
# PROOF FIRST (if not already this session)
ffmpeg -y -i public/avatars/ultra/homes/18.mp4 \
  -vf "scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2,fps=24" \
  -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p \
  -af "loudnorm=I=-20:LRA=11:TP=-2,volume=0.5" \
  -c:a aac -b:a 128k -movflags +faststart /tmp/18-proof.mp4
ffmpeg -i /tmp/18-proof.mp4 -af volumedetect -f null - 2>&1 | tee /tmp/18-proof-vol.txt
# Must show max_volume <= -6. If not, lower volume further — do not start the batch.

# Each new Home (same af):
ffmpeg -y -i IN.mp4 \
  -vf "scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2,fps=24" \
  -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p \
  -af "loudnorm=I=-20:LRA=11:TP=-2,volume=0.5" \
  -c:a aac -b:a 128k -movflags +faststart \
  public/avatars/ultra/homes/NN.mp4

ffmpeg -i public/avatars/ultra/homes/NN.mp4 -af volumedetect -f null - 2>&1 | tee /tmp/nn-vol.txt
# Fail ship if mean < -40 OR max > -6
```

I2V: `15s`, `480p`, from the **home I2I** (not the catalog bust).

---

## 26 Puddlefin — Willowmill Race — kindness pebbles

**Catalog s3:** crowned moonlit otter, satchel, mill wheel behind — **not** I2V source (build a clear 16:9 race).  
**Prop / t7 must show:** **one smooth dull stone pebble** entering the satchel or landing on a small pebble pile (pebble readable at 854×480 — not a glowing gem).  
**Don’t:** extra otters; no millers/humans; don’t dive out of frame; don’t fill the satchel with crystal gems.

**I2I:** Exact otter face from catalog (crown OK if on the bust), 16:9 mid-shot in an **empty mill-race** (water, wooden wheel, willow). Otter **already** in the water. One **smooth grey pebble** visible (in paw or on a tiny pile). Satchel present but not jammed with gems. Hero ≥40%. One otter.

**I2V:** Locked camera. Already in the race. (1) Holds **one smooth pebble**. (2) **t7:** pebble into satchel / onto pile; mill wheel glows a notch. (3) Face clear at t14; stays in frame. Sound: water, soft wheel, quiet night.

## 27 Ashenhoof — Red Mesa Watch — keep going unseen

**Catalog s3:** mesa ibex on a red ledge (near-home square — still widen to 16:9; lock face/horns).  
**Prop / t7 must show:** **one trail-flag stone** planted (stone readable; a small cloth scrap on the stone OK if it stays an object).  
**Don’t:** extra ibex; don’t climb out of frame; horn steam/wisps stay light — not a second face/creature; no human hikers.

**I2I:** Exact ibex face/horns, 16:9 mid-shot already **on a red mesa ledge**, empty desert canyon, one plantable stone in foreground. Hero ≥40%. One ibex.

**I2V:** Locked camera. Already on the ledge. (1) Turns to the stone. (2) **t7:** plants the trail stone. (3) Stands watch; face/horns readable at t14; stays. Sound: dry wind, quiet stone.

## 28 Paperwing — Atrium Stacks — drafts / second pages

**Catalog s3:** luminous **phoenix / paper-bird** in a library atrium (gold-cream plumage, wide wings) — lock **this** species/face. Sliver/full set still needs a clean 16:9 mid-shot I2I.  
**Prop / t7 must show:** **one paper sheet** getting a single crease (sheet stays paper — object).  
**Don’t:** extra birds; **do not morph from a blank sheet into a bird** (bible “unfolds” is a morph trap). Already the bird. No readable letters on pages. Don’t fly out of frame.

**I2I:** Exact phoenix/paper-bird face and plumage from catalog, 16:9 mid-shot in **empty atrium stacks**, floating **closed** books as scenery, **blank or blurred** loose sheet near a wing. Hero ≥40%. One bird. Already perched (not hatching).

**I2V:** Locked camera. Already perched. (1) Looks at the sheet. (2) **t7:** creases **one true wing-fold** on the sheet (sheet stays paper; bird does not emerge from it). (3) Head readable; does not fly away. Sound: soft paper, quiet stacks.

## 29 Voltkoi — Cloud Shrine Pond — one honest circle

**Catalog s3:** sky-river dragon above a torii — **not** a pond mid-shot; do not I2V the sky spiral. Build pond stage; lock the **same** head/whiskers/body language as one creature.  
**Prop / t7 must show:** **bright glow on the pond under the torii** (reflection/path clearly lit — not a faint shimmer). Gate = object.  
**Don’t:** extra koi, fry, or second dragon; whiskers ≠ second head; **do not rise out of frame** (bible “rises” + 05 exit lesson).

**I2I:** Exact Voltkoi head from catalog on **one** long body, 16:9 mid-shot already **in the shrine pond**, empty torii on a small rock, star-water. Hero ≥40%. **One** body only.

**I2V:** Locked camera. Already in the pond. (1) One slow circle in frame. (2) **t7:** pond under the torii lights brightly. (3) Same single body, head readable at t14; **stays in frame** (no sky exit). Sound: soft water, quiet shrine.

## 30 Glimmercap — Cap City — tiny ideas start forests

**Catalog s3:** frog with mossy mushroom hat (tiny door/window on the cap) + glowing mushrooms — treat hat details as **props**, not tenants.  
**Prop / t7 must show:** **one mushroom lantern** lighting on the log (or a spark of **light** entering the cap — light only, not a creature).  
**Don’t:** extra frogs; **no tiny person** in the hat door/window; mushrooms are objects, not animals; don’t leave the log.

**I2I:** Exact frog + cap from catalog, 16:9 mid-shot already **on a log in Cap City**, empty glowing grove, one **unlit** mushroom lantern in foreground. Hat door stays dark/empty. Hero ≥40%. One frog.

**I2V:** Locked camera. Already on the log. (1) A tiny spark (**light only**) toward the cap. (2) **t7:** the mushroom lantern lights. (3) Face readable at t14; stays. Sound: soft night insects, quiet glow. No speech.

---

## After `go` (this batch only)

1. Proof-encode `/tmp/18-proof.mp4` with the **volume=0.5 last** recipe if not already proven this session.  
2. I2I home → dump `{id}_s3.jpg` → I2V → encode → volumedetect.  
3. Redo twin/human/exit/morph/letter **before** READY.  
4. Stills t0.5/3/7/11/14. Confirm t7 phrase. Honest soft column. `AUDIT-26-30.md` + team-qa log.  
5. No zip/APK unless asked.

## Teacher

Homes **21–25 shipped**. This file is the **next** five. **Do not generate 26–30** until teacher `go`.
