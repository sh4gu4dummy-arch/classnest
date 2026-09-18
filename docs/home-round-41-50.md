# Home round 41–50 (PLAN — QA audited; wait teacher `go`)

**Expedite (Ash):** all **ten in one pass**. No trial-stop between ids.

**HARD shoot gate:** after **each** id is filmed + encoded + stamped + in catalog/`ULTRA_HOME_READY`, **git commit that id** before starting the next. Do not ten-pack without per-id commits (work-loss risk).

**Do not generate until `go`.** Do not remake 36–40 unless named. 32 stays.

Ids: **41 Sparkgrit → 50 Aegisunit.** Lore: [ultra-lore-bible.md](ultra-lore-bible.md) §§41–50.  
Bot1 + QAsupervisor LOCK (2026-09-18).

### Ash limb feedback (exact — from 31)

> action/movement better, weirdness with wings becoming arms etc, good enough to proceed but note down my feedback becareful with tails or wings or fins or anything especially if ur mixing and getting messy with bipedal or somewhat humanized animals etc AI gets messy/blurry. the owls wings are sometimes arms sometimes wings etc. note my feedback then make prompt for next one 32.

**Humanoid ≠ animalize** where applicable. Twin HARD = **two distinct bodies** only. No real-language letters (blank/rune/seal only).

---

## Method v2 (better than 36–40)

36–40: B/C I2I stills twinned; 6s from clean A still twinned at t7; xfade broke with `-af` outside `filter_complex`.

**Do this:**

1. **Still A only.** Mid-shot **hero ≥65%**. Dump `{id}_A.jpg`. Open. Two bodies → redo A. Never I2V dirty A. **No B/C I2I.**
2. **Clip1** = I2V duration **6** from A.
3. Extract **last frame** → dump/open `{id}_ext1.jpg`. Twin or hero lost ≥65% → **re-roll clip1** (do not extend a dirty frame). Clean → **Clip2** I2V 6s from that frame (virtue).
4. Same for **Clip3** from clip2 last frame (`{id}_ext2.jpg`).
5. Concat; **loudnorm inside filter_complex**:

```bash
ffmpeg -y -i c1.mp4 -i c2.mp4 -i c3.mp4 \
  -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.4:offset=4.6[ab];[ab][2:v]xfade=transition=fade:duration=0.4:offset=9.2[v];[0:a][1:a]acrossfade=d=0.4[a1];[a1][2:a]acrossfade=d=0.4,loudnorm=I=-20:LRA=11:TP=-2,volume=0.5[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart public/avatars/ultra/homes/NN.mp4
```

6. Stamps 0.5/3/7/11/14. One re-roll of a bad clip then catalog. **Commit that id.** Next id.

**Soft preference:** prove method on **41** first then continue the ten — do not block the pass unless Ash says.

Shared negative:

```
Exactly ONE being in the entire frame. No second copy. Match this face. Hero fills at least 65%.
Anatomy locked (tails/wings/fins/ears stay that — never extra arms). No crowds, no readable letters, no song, no speech.
Virtue is being DONE, not looking at a souvenir.
```

---

## 41 Sparkgrit — Sky-Dock 7

**Virtue:** Tightens the bolt so the ugly flyer **lives**, then docks it — not “look at a bolt.”

**Catalog trap:** s3 bust + glowing hand-device + floating city — **not** dock flyer. **Rewrite.**

### Still A (gate before any I2V)
Dump `docs/home-film-qa/41_A.jpg` → open. Two bodies or hero <65% → redo A.

```
Cinematic 16:9 Sky-Dock 7. This exact goblin face from the reference. ONE goblin, hero ≥65%, holding an UGLY mini-flyer with a LOOSE bolt visible. Empty dock — no second goblin, no floating-city crowd behind. Photoreal. No letters.
```

### Clips (method v2)
| Clip | Source | Beat |
|---|---|---|
| 1 | I2V 6s from A | Ugly flyer in paws, bolt loose; empty dock. |
| 2 | last frame of 1 → open `41_ext1.jpg` → if twin/lost ≥65% **re-roll clip1**; else I2V 6s | **Tightening the bolt**; flyer starts to hover. |
| 3 | last frame of 2 → open `41_ext2.jpg` → same gate → I2V 6s | Flyer docks; he grins; **no trophy pose**. One goblin. |

**Don’t:** extra goblins; letters; tiny hero; city swarm behind  
**Sound:** ratchet, hover buzz, dock clunk

## 42 Gravemason — Carved Mountain

**Virtue:** Sits as a seat (rest) while one abstract rune carves — being the bench is the act.

### Still A (gate before any I2V)
Dump `docs/home-film-qa/42_A.jpg` → open. Two bodies or hero <65% → redo A.

```
Cinematic 16:9 carved mountain hall. This exact stone golem face from the reference. ONE golem starting to sit as a bench, hero ≥65%. Empty hall — no second golem. Photoreal. Abstract marks only — no readable names.
```

### Clips (method v2)
| Clip | Source | Beat |
|---|---|---|
| 1 | I2V 6s from A | Starting to sit. ≥65%. |
| 2 | last frame of 1 → open `42_ext1.jpg` → if twin/lost ≥65% **re-roll clip1**; else I2V 6s | Seated; **one abstract rune** carves (not a real name). |
| 3 | last frame of 2 → open `42_ext2.jpg` → same gate → I2V 6s | Stays as a seat. Empty. One golem. |

**Don’t:** extra golems; readable names  
**Sound:** stone grind, chisel, hush

## 43 Cinderwish — Thousand-Lamp Bazaar

**Virtue:** Lights one unlit lamp and **leaves it** (grants the unspoken).

**Catalog trap:** s3 colossal djinn over crowded desert city + lantern swarm. **Rewrite:** empty aisle, mid-shot ≥65%, one dark lamp, no patrons.

### Still A (gate before any I2V)
Dump `docs/home-film-qa/43_A.jpg` → open. Two bodies or hero <65% → redo A.

```
Cinematic 16:9 empty night bazaar aisle. This exact lantern-djinn face from the reference. ONE djinn, mid-shot hero ≥65%, beside ONE DARK unlit lamp. Empty aisle — no patrons, no tiny-city god-scale, no lantern swarm. Photoreal. No letters on lamps.
```

### Clips (method v2)
| Clip | Source | Beat |
|---|---|---|
| 1 | I2V 6s from A | One dark lamp; empty bazaar. |
| 2 | last frame of 1 → open `43_ext1.jpg` → if twin/lost ≥65% **re-roll clip1**; else I2V 6s | **Lights** that lamp. |
| 3 | last frame of 2 → open `43_ext2.jpg` → same gate → I2V 6s | Sets it on a sill and **walks on**. One djinn. |

**Don’t:** patrons; extra djinn; letters; god-scale city  
**Sound:** match/glass, quiet market

## 44 Duskwyn — Eclipse Terrace

**Virtue:** Sets a second teacup and waits without staring — invitation, not a test.

### Still A (gate before any I2V)
Dump `docs/home-film-qa/44_A.jpg` → open. Two bodies or hero <65% → redo A.

```
Cinematic 16:9 Eclipse Terrace at night. This exact moonlit noble face from the reference. ONE noble, hero ≥65%, one teacup visible. Empty terrace — no guest faces, no second noble. Photoreal. No letters.
```

### Clips (method v2)
| Clip | Source | Beat |
|---|---|---|
| 1 | I2V 6s from A | One cup; empty terrace. |
| 2 | last frame of 1 → open `44_ext1.jpg` → if twin/lost ≥65% **re-roll clip1**; else I2V 6s | Places **the second cup**; steam; does not stare at empty chair. |
| 3 | last frame of 2 → open `44_ext2.jpg` → same gate → I2V 6s | Waits, looking aside. One noble. |

**Don’t:** extra nobles; guest faces; letters  
**Sound:** porcelain, night wind

## 45 Brinecrown — Glassreef Palace

**Virtue:** Stills the water so a tiny fish-school (env props) can pass. Fins stay fins.

**Catalog trap:** s3 waist-up merfolk + trident + glowing city — keep face; place at palace gate mid ≥65%.

### Still A (gate before any I2V)
Dump `docs/home-film-qa/45_A.jpg` → open. Two bodies or hero <65% → redo A.

```
Cinematic 16:9 Glassreef Palace gate underwater. This exact merfolk monarch face from the reference. ONE merfolk, fins stay fins, hero ≥65%, water slightly choppy. Empty gate — no second merfolk. Photoreal. No letters.
```

### Clips (method v2)
| Clip | Source | Beat |
|---|---|---|
| 1 | I2V 6s from A | Water choppy; one merfolk. |
| 2 | last frame of 1 → open `45_ext1.jpg` → if twin/lost ≥65% **re-roll clip1**; else I2V 6s | Palm stills water; **tiny fish** line up as environment props. Still ONE merfolk. |
| 3 | last frame of 2 → open `45_ext2.jpg` → same gate → I2V 6s | Fish pass; they watch. No second merfolk. |

**Don’t:** second merfolk; letters; fish that read as monarchs  
**Sound:** water hush

## 46 Palevow — Sunlit Ossuary

**Virtue:** Catches a slipping oath-scroll and pins it over the heart. Not horror.

**Catalog trap:** s3 serene cathedral paladin — keep face; warm sunlit ossuary not horror.

### Still A (gate before any I2V)
Dump `docs/home-film-qa/46_A.jpg` → open. Two bodies or hero <65% → redo A.

```
Cinematic 16:9 sunlit ossuary, warm light. This exact bone paladin face from the reference. ONE knight, hero ≥65%, blank oath-scroll starting to slip. Not scary. Empty — no second knight. Photoreal. Scroll blank/seal only — no readable text.
```

### Clips (method v2)
| Clip | Source | Beat |
|---|---|---|
| 1 | I2V 6s from A | Scroll starting to slip; warm light. |
| 2 | last frame of 1 → open `46_ext1.jpg` → if twin/lost ≥65% **re-roll clip1**; else I2V 6s | **Catches and pins** the blank scroll over the heart. |
| 3 | last frame of 2 → open `46_ext2.jpg` → same gate → I2V 6s | Sunlight hardens it. Face readable. Not scary. One knight. |

**Don’t:** horror; extra knights; readable scroll text  
**Sound:** cloth, pin, soft choir-air

## 47 Viridelle — World-Tree Nave

**Virtue:** Pours one jar into a cracked root; green fills the crack.

### Still A (gate before any I2V)
Dump `docs/home-film-qa/47_A.jpg` → open. Two bodies or hero <65% → redo A.

```
Cinematic 16:9 World-Tree Nave. This exact dryad face from the reference. ONE dryad, hero ≥65%, cracked root + jar in hands. Empty nave — no second dryad. Photoreal. No letters.
```

### Clips (method v2)
| Clip | Source | Beat |
|---|---|---|
| 1 | I2V 6s from A | Cracked root, jar in hands. |
| 2 | last frame of 1 → open `47_ext1.jpg` → if twin/lost ≥65% **re-roll clip1**; else I2V 6s | **Pouring**; green filling the crack (pour readable). |
| 3 | last frame of 2 → open `47_ext2.jpg` → same gate → I2V 6s | Crack sealed; small smile. One dryad. |

**Don’t:** extra dryads; letters  
**Sound:** water, wood

## 48 Quartzarch — Infinite Prism

**Virtue:** Rotates a crystal cube until a new corridor of light opens, then walks it.

### Still A (gate before any I2V)
Dump `docs/home-film-qa/48_A.jpg` → open. Two bodies or hero <65% → redo A.

```
Cinematic 16:9 Infinite Prism hall. This exact crystal mage face from the reference. ONE mage, hero ≥65%, crystal cube in hands. Empty hall — no second mage. Photoreal. No letters in the glass.
```

### Clips (method v2)
| Clip | Source | Beat |
|---|---|---|
| 1 | I2V 6s from A | Cube in hands. |
| 2 | last frame of 1 → open `48_ext1.jpg` → if twin/lost ≥65% **re-roll clip1**; else I2V 6s | **Rotating**; new light-corridor opens. |
| 3 | last frame of 2 → open `48_ext2.jpg` → same gate → I2V 6s | Walks into it. One mage. |

**Don’t:** extra mages; letters in glass  
**Sound:** crystal tick, whoosh

## 49 Inkstride — Ink Roof

**Virtue:** Ink ribbon follows a step, settles as one abstract stroke. No readable words.

### Still A (gate before any I2V)
Dump `docs/home-film-qa/49_A.jpg` → open. Two bodies or hero <65% → redo A.

```
Cinematic 16:9 Ink Roof at dusk. This exact ink dancer face from the reference. ONE dancer, hero ≥65%, blank paper waiting, ink at a foot. Empty roof — no second dancer. Photoreal. No letters.
```

### Clips (method v2)
| Clip | Source | Beat |
|---|---|---|
| 1 | I2V 6s from A | Paper waiting; ink at foot. |
| 2 | last frame of 1 → open `49_ext1.jpg` → if twin/lost ≥65% **re-roll clip1**; else I2V 6s | Ink ribbon **follows the step**. |
| 3 | last frame of 2 → open `49_ext2.jpg` → same gate → I2V 6s | Settles as a single abstract stroke (not letters). One dancer. |

**Don’t:** extra dancers; real-language writing  
**Sound:** wind, ink drip

## 50 Aegisunit — Dome Watch

**Virtue:** Plants feet; shield-dome ripples once over empty hangar; visor dims to rest. Not combat.

**Catalog trap:** s3 mega-mech over city with dome already on. **Rewrite:** empty hangar mid ≥65%; no city-crowd scale.

### Still A (gate before any I2V)
Dump `docs/home-film-qa/50_A.jpg` → open. Two bodies or hero <65% → redo A.

```
Cinematic 16:9 empty Dome Watch hangar. This exact mech face/visor from the reference. ONE mech, mid-shot hero ≥65%, starting to plant feet. Empty hangar — no city swarm, no second unit. Photoreal. No letters.
```

### Clips (method v2)
| Clip | Source | Beat |
|---|---|---|
| 1 | I2V 6s from A | Planting feet; empty hangar. |
| 2 | last frame of 1 → open `50_ext1.jpg` → if twin/lost ≥65% **re-roll clip1**; else I2V 6s | **Dome shimmer once** over empty floor. |
| 3 | last frame of 2 → open `50_ext2.jpg` → same gate → I2V 6s | Visor dims; rest. One mech. No combat. |

**Don’t:** extra mechs; combat; city scale; letters  
**Sound:** servo, one shield hum, rest

---

## After `go`

1. Shoot **41–50** with method v2.
2. After each id: stamps + catalog + **commit that id** → then next.
3. Soft: prove on 41 first if Builder wants, then continue.
4. `AUDIT-41-50.md` may accumulate per commit. No zip/APK unless asked.
