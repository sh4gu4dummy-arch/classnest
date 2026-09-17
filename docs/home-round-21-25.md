# Home round 21–25 (PLAN only — audit, then teacher `go`)

**Do not generate until `go`.** Do not redo 01–20 unless ids named.

Ids: **21 Quietpaw, 22 Hearthound, 23 Mistfawn, 24 Mossback, 25 Softwing.**  
Stills: `public/avatars/ultra/21-s3.jpg` … `25-s3.jpg` — **open the painting before I2V.**  
Lore: [ultra-lore-bible.md](ultra-lore-bible.md) §§21–25.  
Homes (`ultra-lore.ts`): Window Seat, Hearth Lodge, Mist Path, Mossdock, White Eave.

QA bot (ClassNest-Bot1) wrote this from **16–20 audit fails/softs**. Shoot-bot executes after `go`. Shared board: [team-qa.md](team-qa.md).

## What 16–20 taught (prevent these)

| Executor miss | Gate for 21–25 |
|---|---|
| Virtue landed at **t11** not t7 (16) | Prompt so the **prop trick is visible at t≈7**. After encode, still `*_t7.jpg` must show the virtue object in action — or Bot1 fails soft. |
| Carnival **crowd silhouettes** (18) | **No humans at all** — empty lodge/path/dock/eave. No blurred crowds. |
| Scrap twin hunt (17) | Props stay objects. **22 blanket, 23 pebble, 24 lily, 25 feather** — never a second cat/dog/deer/turtle/dove. |
| `alimiter=limit=0.7` left max ~**0 dB** | New encode (below). **Probe max after encode**; if max ≥ −1 dB, re-encode before READY. |
| Self-QA skipped soft misses | After shoot: fill AUDIT soft column honestly before calling “all PASS”. |

Shared negative (append every prompt):

```
Exactly ONE creature in every frame. No second copy, no baby, no extra legs/wings/heads.
Match the reference still. Anatomy locked. Face readable through the last second.
Hero stays large — do not leave the frame.
No morphing into scenery. No humans, no crowds, no readable letters, no logos, no song, no speech.
Locked or slow camera. Mid-shot, hero fills at least 40% of the frame.
```

I2V from 16:9 I2I of s3 (hero ≥40%). Duration `15`, `480p`. Then **prove** loudness:

```bash
ffmpeg -y -i IN.mp4 \
  -vf "scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2,fps=24" \
  -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p \
  -af "loudnorm=I=-20:LRA=11:TP=-2,volume=0.7,alimiter=limit=0.5" -c:a aac -b:a 128k \
  -movflags +faststart \
  public/avatars/ultra/homes/NN.mp4

# REQUIRED before READY:
ffmpeg -i public/avatars/ultra/homes/NN.mp4 -af volumedetect -f null - 2>&1 | tee /tmp/nn-vol.txt
# Fail ship if mean < -40 OR max > -1
```

---

## 21 Quietpaw — Window Seat — stillness can be brave

**s3:** Silver tabby. **Prop:** rain on glass (object: raindrop/glass). **Don't:** extra cats; no human at the window.

**I2V:** Locked camera, cat large. (1) Sits on the ledge. (2) Soft paw toward **one raindrop on the glass**. (3) Curls; **face clear at t14**. Sound: rain, soft purr. Empty room — no people.

## 22 Hearthound — Hearth Lodge — welcome

**s3:** Noble retriever. **Prop:** spare **blanket** (fabric object). **Don't:** extra dogs; no kids in doorway.

**I2V:** (1) Noses lodge door. (2) Fetches **one blanket** to the hearth. (3) Waits, one tail wag; face in frame. Empty lodge.

## 23 Mistfawn — Mist Path — slow is allowed

**s3:** Quiet stag. **Prop:** **cairn pebble**. **Don't:** extra deer.

**I2V:** (1) Steps into mist. (2) Hoof-nudges **one pebble** onto a cairn (t7 must show pebble/cairn). (3) Path glows faintly; face clear; stays in frame.

## 24 Mossback — Mossdock — steady beats panic

**s3:** Elder turtle. **Prop:** **lily pad** (no readable clock numbers / no panic digits). **Don't:** extra turtles.

**I2V:** (1) Climbs dock-stone. (2) Lily settles (object). (3) Waits; head readable at t14.

## 25 Softwing — White Eave — calm over sparkle

**s3:** Cream dove. **Prop:** **one fallen feather** into nest. **Don't:** extra doves; nest has **no chicks**.

**I2V:** (1) Lands on eave. (2) Straightens **one feather** into empty nest. (3) Still; face/head clear. No baby birds.

---

## After `go` (executor checklist — QA will fail you if skipped)

1. Shoot 21→25 (batch OK); redo any twin/human/exit-frame **before** READY.  
2. Encode + **volumedetect**; fix peaks before shipping.  
3. Dump `docs/home-film-qa/{id}_s3.jpg` + `_t0.5/_t3/_t7/_t11/_t14.jpg`.  
4. Self-QA must note soft misses (virtue timing, crowds, peaks).  
5. Write `AUDIT-21-25.md` for Bot1. Add a log line in `team-qa.md`.  
6. No avatars zip / portable / APK unless asked.

## Teacher audit

Say **`go`** to shoot 21–25, or mark edits. Bot1 will try to fail the batch after ship.
