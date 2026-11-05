# ClassNest art decisions log (Ultra evolution remakes)

Human-readable record of every Ash CONFIRM / REMAKE / REJECT / COMMENT on Ultra evolution art since the
remake programme started (2026-10-22), so nothing lives only in chat or on Bot1's box.
Sources: Ash's chat messages to ClassNest-Bot1, the review site's `set.json` / `verdicts.json`
(copies held on local branch `handover-recovered`, pending Ash OK), and the ship commits.
Started by ClassNest-Bot1 on 2026-11-05 (through v0.149). Catch-up by QAsupervisor 2026-11-05 evening (America/New_York) through **v0.151** (`cccadbe`).

Stage names: **s1 Hatchling**, **s2 Adolescent**, **s3 Legend**. Files: `public/avatars/ultra/NN-sK.jpg`,
board thumbs `public/avatars/ultra/board/NN-sK.jpg` (360), plus the unused `public/offline-app/avatars/` mirror.
Draft letters (A, B, C…) refer to the review-site cards; draft images are public in `ashsgrokbot/classnest-review`
and local in `/workspace/<name>-trial/`.

## Rules Ash set during the programme (still in force)

- 2026-10-22: many evolutions "are lame" and barely change between stages; improve them. Nothing goes into the
  app until Ash confirms.
- Keep the **Hatchling's art style**: soft, cute, warm, uncluttered, friendly faces. Ash rejected dark, moody,
  angry-looking Kindlekin options.
- **Legends need a big, dramatic change**, not a subtle one (Kindlekin Legend F rejected as "not enough change").
- Stages may look quite different (e.g. a realistic adult Legend) as long as resemblance and theme stay
  consistent (Ash liked Riftstallion option G). See `docs/imagine-stills.md#evolution-rule-ash-2026-10-22`.
- **No real-language text** on art; imaginary rune marks only.
- Ash's exact rule, 2026-10-22: **"in the future, to reduce spam/waste, only generate one replacement option."**
  → one replacement draft per stage that needs a remake, no runners-up.
- Quartzarch: Adolescents came out "too girly"; the next Quartzarch Adolescent must be tougher / less girly.
- Phone check at 390×844 for every candidate; Ash reviews on a desktop browser too; full-size images in a
  closeable viewer (screenshots are too blurry).
- Home films / scrub stills of a remade Ultra go stale; **reshoot only on Ash's `go`**.

## Copy-text format (what Ash pastes back)

```
ClassNest v0.NNN
CONFIRM
<Ultra> #NN: Adolescent C (pick-s2-C), Legend C (legend-C)
REMAKE
<Ultra> #NN: <card> — <reason>
REJECT
<Ultra> #NN: <card>, <card>
COMMENT
<Ultra> #NN: <card> — <free text>
```
"Keep current" (keep-sN) is a CONFIRM of the art already in the app. A COMMENT is not a vote.

## Decisions per Ultra (chronological)

### Riftstallion #35 — shipped v0.144 (`ac6122c`, 2026-10-22)
- Ash asked to start with Riftstallion "in a dark indigo look".
- Rounds: Adolescent A/B/C; Legend round 1 A/B/C (+ test clip from r1 A); Legend round 2 A–G.
- **CONFIRM:** s2 = **Adolescent A "Comet Yearling"** (trot); s3 = **Legend r2 G** (Galaxy Stallion), upscaled 1024→1408.
- s1 Hatchling unchanged. Home film `homes/35.mp4` + scrub for 35 stale.

### Kindlekin #34 — s2 shipped v0.145 (`f2dae89`), s3 shipped v0.146 (`aa8f8fa`), 2026-10-22
- Old s2 and s3 got REMAKE "not enough change" on the review page.
- Round 1 (Adolescent A–D, Legend A–F, test clip from F): picks were Adolescent B and Legend F "Hearth-Sage";
  Ash rejected Legend F as **"not enough change"** and the dark/moody/scowling options (style rule above).
- Round 2: **CONFIRM s2 = R2 Adolescent B "Tea Apprentice"** (upright red panda lifting a copper kettle, red
  scarf) → v0.145. R2 Legends (A–G; picks Lantern Hearth-Sage D / Tail-Halo Sage E) were still not enough change → remade in round 3.
- Round 3 Legends A–F: **CONFIRM s3 = R3 Legend B** (reclining on cream pillows, red gold-trimmed mantle, tiny
  winged copper teapot, lanterns). Ash allowed removing a stray plant only if nothing else changed → done, v0.146.
- s1 unchanged. Home film `homes/34.mp4` + scrub stale.

### Quartzarch #48 — s3 shipped v0.148 (`dde4522`); s2 shipped v0.151 (`cccadbe`, 2026-11-05)
- 2026-10-22 COMMENT (Ash's words): **"Quartzarch #48: Adolescent A (pick-s2-A) — changed too girly,
  Adolescent B (adol-B) — changed too girly"**. Set marks A, B, C (levitating, pink shards) and D (pink armor,
  rainbow beam) as rejected "too girly".
- 2026-10-23 **CONFIRM:** "Quartzarch #48: Legend E (legend-E)" → s3 = crystal sage, arms raised, rose-quartz
  robe, rainbow beams from a star rose window (1024→1408). Legends A–D: Ash picked E.
- Ash chose "Yes, make one new less-girly Quartzarch Adolescent" → drafts E/F/G. Feedback on the way: E "i like
  brighter color purple, stronger feel"; F "keep some crystal white rainbows from previous".
- 2026-11-05 COMMENT "Quartzarch #48: Adolescent E (adol-E) — asdfadf" = Ash's typing test of the comment box,
  **not a vote** (ignore).
- **CONFIRM Adolescent G** → shipped as `48-s2` in **v0.151**: tall sturdy rock-armor crystal teen in clear white
  rainbow crystal, amethyst spines + chest core as accents (1024→1408). Hatchling unchanged.
- Legend: Ash cancelled a confirm on Legend E (still in app from v0.148). Legend G got **"looks too young"**.
  **Legend H** is on the review set (builds off shipped Adolescent G) — waiting Ash CONFIRM / Keep current /
  REMAKE. Do **not** nag (Ash standing 2026-11-05: no ClassNest art-vote nags).
- Home film `homes/48.mp4` + scrub stale (s2 and likely s3 when Legend moves).

### Ironmaw #38 — shipped v0.147 (`a91dac2`, 2026-10-23)
- Ash: **"ClassNest v0.146 / CONFIRM / Ironmaw #38: Adolescent C (pick-s2-C), Legend C (legend-C)"**
- s2 = young orc smith kneeling to fit a glowing hinge on a castle door, tongue out (1408).
  s3 = crowned orc smith-king on a throne of anvils and hinges offering a glowing hinge (1024→1408).
- Not chosen: Adolescent A, B, D; Legend A, B, D, E, F. s1 unchanged. Home film `homes/38.mp4` + scrub stale.

### Mossback #24 — shipped v0.147 (`a91dac2`, 2026-10-23)
- Ash: **"ClassNest v0.146 / CONFIRM / Mossback #24: Adolescent D (adol-D), Legend C (legend-C)"**
- s2 = young turtle swimming underwater in sunbeams, moss shell with lily pad and pink lotus.
  s3 = great sea turtle with a blossoming tree on its shell, koi swarm. Both 1024→**768** to match Mossback's s1.
- Not chosen: Adolescent A, B, C; Legend A, B, D, E. Home film `homes/24.mp4` + scrub stale.

### Palevow #46 — shipped v0.148 (`dde4522`, 2026-10-23)
- Ash: **"ClassNest v0.147 / CONFIRM / Palevow #46: Adolescent C (pick-s2-C), Legend D (legend-D)"**
- s2 = young armored knight leaping with sword and cross shield at a training yard (1408).
  s3 = winged haloed paladin in red-and-gold cape on a cathedral carpet, golden sword (1024→1408).
- Not chosen: Adolescent A, B, D; Legend A, B, C, E. Home film `homes/46.mp4` + scrub stale.

### Emberpuff #03 — s2 shipped v0.149 (`ddbf93c`, 2026-11-05)
- Drafts = I2I midpoints from the Hatchling toward the old Adolescent (`01-approx-10pct` … `05-approx-50pct` …),
  local in `/workspace/emberpuff-s1-s2-drafts/`.
- Ash: **"ClassNest v0.148 / CONFIRM / Emberpuff #03: Adolescent E (05-approx-50pct.png)"**
- s2 = young fennec fox with fiery mane, cracked-lava forelegs, flame tail on dark volcanic ground. 1280×720
  draft cropped to square (sky/gravel extended), sized 768 to match the Hatchling. s1, s3 unchanged.
- Home film `homes/03.mp4` + scrub for 03 stale.

### Quietpaw #21 — shipped v0.150 (`af9076e`, 2026-11-05)
- **CONFIRM** Adolescent B + Legend B reshoot. Details in review set `quietpaw-21` / START-HERE. Home film
  `homes/21.mp4` + scrub stale.

### Softwing #25 — shipped v0.151 (`cccadbe`, 2026-11-05)
- **CONFIRM** Adolescent B (taller cream dove on cottage eave) + Legend B (sun-guardian dove on white tower).
  Sized 1024→768 to match Hatchling. Home film `homes/25.mp4` + scrub stale.

### Boring-Ultra remake batch (on review site, drafts local) — 2026-11-05
Ash's "clearly lame / stages barely change" pass. One draft per weak stage; Hatchling kept. Sets already on the
local + Pages review viewer (no art-vote nags from QAsup):
`rimeveil-53`, `viridelle-47`, `ashenhoof-27`, `quillburst-11`, `glimmercap-30`, `inkstride-49`,
`hearthound-22`, `mistfawn-23`. Trial folders under `/workspace/<name>-trial/`.

### QAsup next-lame audit (2026-11-05 evening, visual + ahash) — not drafted yet
Clearly weak adjacent stages still **without** a dedicated remake set (auto `ultra-NN` tiles already exist):
1. **#55 Hollowplate** — s2 and s3 are the same hall pose; mostly armor recolor/iridescence. Highest priority.
2. **#41 Sparkgrit** — same face, same glowing gadget across s1/s2/s3; background grows, creature barely does.
3. **#45 Brinecrown** — s2≈s3 underwater trident pose; crown/armor glow only.
4. **#42 Gravemason** — s2≈s3 mountain pose; glow/water added, pose locked.
**Not lame (skip):** #13 Hexabyte — clear kit→fox→wolf progression and pose change.
Next ClassNest remake pass: draft **one** option per weak stage for Hollowplate first, force onto the review
viewer the same way as the boring batch. Do not ping Ash for votes.

## Open after v0.151

| Item | Waiting on |
|---|---|
| Quartzarch #48 Legend H vs Keep current (Legend E) | Ash vote (no nags) |
| Boring-Ultra batch drafts above | Ash votes when ready (no nags) |
| Home film + scrub reshoots for 03, 21, 24, 25, 34, 35, 38, 46, 48 (old art) | Ash `go` |

When a decision lands: ship it (VERSION bump, `npm run build:offline`, `sh scripts/push-github.sh`), mark the
item shipped in the review site's `verdicts.json`, republish the review site, and **add a line here**.
