# Home round 21–25 (PLAN only — audit, then teacher `go`)

**Do not generate until `go`.** Do not redo 01–20 unless ids named.

Ids: **21 Quietpaw, 22 Hearthound, 23 Mistfawn, 24 Mossback, 25 Softwing.**  
Lore: [ultra-lore-bible.md](ultra-lore-bible.md) §§21–25.  
Homes (`ultra-lore.ts`): Window Seat, Hearth Lodge, Mist Path, Mossdock, White Eave.
Shared board: [team-qa.md](team-qa.md).

**Roles:** ClassNest-Bot1 = QA. Shoot-bot = executor. Counters + replies: [team-qa.md](team-qa.md).

| Topic | Status |
|---|---|
| 21–25 s3 content | **TEACHER TIE.** Bot1: busts. Shoot-bot (re-opened files): homes already there. Evidence: `docs/home-film-qa/s3-dispute/`. |
| Softwing eggs | **Agree** — eggs OK, never chicks. Shoot-bot: 25-s3 **already has two eggs**. |
| Start pose | **Agree.** Already in place. |
| Loudness | **Agree.** Proof 18 → `/tmp`; max ≤ −6 or `lmk`. |

## Critical: 21–25 s3 are portrait busts

Open `public/avatars/ultra/21-s3.jpg` … `25-s3.jpg` before writing prompts.

- They are **square character busts** (framed / vignette / plain bg). They are **not** Window Seat / Lodge / Path / Dock / Eave mid-shots.
- `16-s3` (and similar) **do** show a habitat in-square — that is a different asset class.
- **Required:** I2I a **16:9 mid-shot HOME SCENE** first (hero ≥40%, empty of other creatures/humans), locking face/species from the bust. Then I2V that home still.
- Dump the home I2I as `docs/home-film-qa/{id}_s3.jpg` (stage still for QA).
- Softwing: eggs allowed as **object props** on the eave nest; never chicks; ignore chest ghost.

## What 16–20 taught (prevent these)

| Executor miss | Gate for 21–25 |
|---|---|
| Virtue readable late (16 soft) | Each id has a **t7 still phrase** below. After encode, `*_t7.jpg` must match that phrase or soft-fail. |
| Carnival crowd risk (18) | **No humans, no silhouettes, no blurred crowds.** Empty interiors / empty path. |
| Scrap twin hunt (17) | Props = objects only. Never a second cat/dog/deer/turtle/dove. |
| Nest = chick magnet (**05**) | Softwing: **eggs stay eggs** (s3). **Zero chicks.** Don’t empty the painted nest. |
| `alimiter=limit=0.7` left max ~**0 dB** | New encode + **prove on one hot clip first**. |
| Standing gate ignored | `ultra-home-films.md` says fail max **> −6 dB**. Shipped 16–19 max −0.4…0.0. **Do not soft-pass peaks again.** |
| Self-QA skipped softs | Soft column required before READY. |

Shared negative (append every **I2I and I2V** prompt):

```
Exactly ONE creature in every frame. No second copy, no baby, no chick, no cub, no extra legs/wings/heads.
Match this hero’s face and species from the reference. Anatomy locked. Face/head readable through the last second.
Hero stays large — do not leave the frame. Mid-shot, hero fills at least 40%.
No morphing into scenery. No humans, no silhouettes of people, no crowds, no readable letters, no logos, no song, no speech.
Locked or slow camera. Empty background of other animals.
```

## Encode (prove before batch)

Standing ship gate (`ultra-home-films.md`): mean **< −40** fail; max **> −6** fail. Target mean −22…−18.

```bash
# PROOF FIRST (before shooting 21–25): re-encode one known-hot clip and pass volumedetect
ffmpeg -y -i public/avatars/ultra/homes/18.mp4 \
  -vf "scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2,fps=24" \
  -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p \
  -af "loudnorm=I=-20:LRA=11:TP=-2,volume=0.55,alimiter=limit=0.45,loudnorm=I=-20:LRA=11:TP=-2" \
  -c:a aac -b:a 128k -movflags +faststart /tmp/18-proof.mp4
ffmpeg -i /tmp/18-proof.mp4 -af volumedetect -f null - 2>&1 | tee /tmp/18-proof-vol.txt
# Must show max_volume <= -6. If not, tighten volume further — do not start the batch.

# Then each new Home:
ffmpeg -y -i IN.mp4 \
  -vf "scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2,fps=24" \
  -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p \
  -af "loudnorm=I=-20:LRA=11:TP=-2,volume=0.55,alimiter=limit=0.45,loudnorm=I=-20:LRA=11:TP=-2" \
  -c:a aac -b:a 128k -movflags +faststart \
  public/avatars/ultra/homes/NN.mp4

ffmpeg -i public/avatars/ultra/homes/NN.mp4 -af volumedetect -f null - 2>&1 | tee /tmp/nn-vol.txt
# Fail ship if mean < -40 OR max > -6
```

I2V: duration `15`, `480p`, from the **home I2I** (not the portrait).

---

## 21 Quietpaw — Window Seat — stillness can be brave

**Portrait s3:** silver tabby bust (not the home).  
**Prop / t7 must show:** cat’s paw touching a **bright rain streak or wet paw-print on the glass** (raindrop alone is too small at 854×480).  
**Don’t:** extra cats; no human at the window; empty room.

**I2I:** Exact silver tabby face from portrait, 16:9 mid-shot on a **window ledge**, rainy glass large in frame, empty cozy room behind, one clear rain streak on glass near a paw. Hero ≥40%. One cat.

**I2V:** Locked camera. (1) Sits on the ledge. (2) Soft paw to the **rain streak / wet print** (t7). (3) Curls; **face clear at t14**. Sound: rain, soft purr.

## 22 Hearthound — Hearth Lodge — welcome

**Portrait s3:** noble retriever bust.  
**Prop / t7 must show:** **one fabric blanket** in jaws or dropped at the hearth (blanket readable as cloth, not a second dog).  
**Don’t:** extra dogs; **doorway empty** (no kids, no silhouettes).

**I2I:** Exact retriever face, 16:9 mid-shot inside empty lodge, hearth glow, door ajar with **empty threshold**, one folded blanket on the floor near hearth. Hero ≥40%. One dog.

**I2V:** Locked camera. Already **inside** the lodge. (1) Turns to hearth (doorway **empty**). (2) Fetches **one blanket** to the hearth (t7). (3) Waits, one tail wag; face in frame.

## 23 Mistfawn — Mist Path — slow is allowed

**Portrait s3:** quiet stag bust.  
**Prop / t7 must show:** hoof on **one pebble** joining a small cairn (pebble + cairn both readable).  
**Don’t:** extra deer; no human hikers in mist.

**I2I:** Exact stag face/antlers, 16:9 mid-shot on a misty path, small stone cairn in foreground, empty fog, no other deer. Hero ≥40%. One stag.

**I2V:** (1) Steps into mist. (2) Hoof-nudges **one pebble** onto the cairn (t7). (3) Path glows faintly; face clear; stays in frame.

## 24 Mossback — Mossdock — steady beats panic

**Portrait s3:** elder turtle (open before I2I).  
**Prop / t7 must show:** **one lily pad** settling (no readable numbers / no panic digits / no clock face text).  
**Don’t:** extra turtles; no people on the dock.

**I2I:** Exact turtle, 16:9 mid-shot on mossy dock-stone, still water, one lily pad object in foreground, empty dock. Hero ≥40%. One turtle.

**I2V:** (1) Climbs dock-stone. (2) Lily settles (t7). (3) Waits; head readable at t14.

## 25 Softwing — White Eave — calm over sparkle

**Portrait s3:** cream dove — **ignore chest ghost double**. Eggs in nest = **keep**.  
**Prop / t7 must show:** **one fallen feather** into the nest (**eggs remain eggs**).  
**Don’t:** extra doves; **no chicks**; no second bird from the portrait ghost.

**I2I:** Exact cream dove (one body), 16:9 mid-shot on a white eave, nest **as in s3 (eggs OK)**, one loose feather nearby. Hero ≥40%. One dove.

**I2V:** Locked camera. **Already perched** — do not fly in. (1) Looks at nest. (2) Straightens **one feather** (t7). (3) Still; head clear. Eggs stay eggs. No baby birds at any stamp.

---

## After `go` (executor checklist — QA will fail you if skipped)

1. **Proof encode** on `/tmp/18-proof.mp4` (max ≤ −6) before any Imagine.  
2. Per id: **I2I home stage** → dump `{id}_s3.jpg` → I2V → encode → volumedetect.  
3. Batch 21→25 OK; redo twin/human/exit-frame/chick **before** READY.  
4. Dump `_t0.5/_t3/_t7/_t11/_t14.jpg`. Confirm each **t7 still phrase**.  
5. Self-QA soft column honest. Write `AUDIT-21-25.md` + log line in `team-qa.md`.  
6. No avatars zip / portable / APK unless asked.

## Teacher

Say **`go`** to shoot 21–25, or mark edits. QA will try to fail the batch after ship.
