# Home round 36–40 (PLAN — QA audit, then teacher `go` / `start`)

**Expedite (teacher):** all **five in one pass**. No trial-stop between ids. Twin re-roll **once** per id then catalog (failures stay in catalog).

**Do not generate until `go`/`start`.** Do not remake 32–35 unless named.

Ids: **36 Thornveil, 37 Hexmorrow, 38 Ironmaw, 39 Gildframe, 40 Vexilith.**  
Wave 5 = **humanoid / fantasy** (not quadruped-animalize). Lock catalog **face**.  
Homes: Moonpath Canopy, Stormkettle Cottage, Bellforge Keep, Clock Nave, Facet Embassy.  
Lore: [ultra-lore-bible.md](ultra-lore-bible.md) §§36–40.

## Why a new shoot method (33–35 lesson)

15s I2V from **one** still still **grows twins**. Time sink = re-rolls.

**Keyframe stack (use this):**

1. **Still A** — start in the home, one hero ≥50%, empty of extras. Dump `{id}_A.jpg`. Open it. Dirty → redo A.
2. **Still B** — I2I **from A** (same face). **Virtue in action** (not souvenir-pickup). Dump `{id}_B.jpg`. Gate.
3. **Still C** — I2I **from B**. Aftermath / new beat of place, same one hero. Dump `{id}_C.jpg`. Gate.
4. **Video** — prefer **three ~5s I2V clips** (A→motion, B→motion, C→motion) then `ffmpeg` concat + 8–10 frame crossfade → 15s 854×480. Fallback: `imagine_reference_to_video` with A,B,C as refs (not as a single 15s hope). Do **not** 15s-from-A-only — that is the twin factory.
5. Encode `loudnorm=I=-20:LRA=11:TP=-2,volume=0.5` last. Stamps 0.5/3/7/11/14. Catalog even if soft-fail.

Shared still/video negative:

```
Exactly ONE being in every frame. No second copy, no extra arms/heads. Match this face from the reference.
Wings/tails/ears stay that anatomy — never extra human arms. No crowds, no readable letters, no song, no speech.
Hero ≥50%. Props are objects. Virtue is being DONE, not looked at.
```

Humanoids: **do not** four-leg-animalize elves/orcs/knights. Match s3 species.

---

## 36 Thornveil — Moonpath Canopy — aim true, then **share** the path

**s3:** wood-elf ranger, bow, moon-forest (bust/sliver). I2I a real 16:9 canopy path.  
**Virtue:** the bow **points the way for others**, not a hunt. No violence.

| Still | Lock |
|---|---|
| A | One elf at a dark fork, bow, unlit branch-road. Empty woods. |
| B | **Loosing one light-arrow** into the path — arrow in flight, path starting to glow. |
| C | Walking the **lit** path, bow lowered (sharing, not posing). Face readable. |

**Don’t:** extra elves; people; readable runes as Latin/kanji (glow lines OK).  
**Sound:** bowstring, leaf-wind, soft chime of the path.

## 37 Hexmorrow — Stormkettle Cottage — spills are how you learn

**s3:** witch, cottage, bottles. Widen to 16:9 kitchen if bust. One witch. Not scary.

| Still | Lock |
|---|---|
| A | One witch, kettle **about to boil over**, one empty bottle ready. |
| B | **Spill in progress** — gold steam/liquid caught **into the bottle** (the spill is the lesson). |
| C | She **shelves** the bottle; a star mark (no text). No victory cackle. |

**Don’t:** extra witches; scary; letters on labels.  
**Sound:** kettle hiss, glass, thunder far.

## 38 Ironmaw — Bellforge Keep — repair > trophy

**s3:** orc, hammer, anvil. I2I **door + broken hinge** (not a sword trophy). One orc.

| Still | Lock |
|---|---|
| A | One orc at a door, **broken hinge** in tongs/hammer, forge glow. |
| B | **Fitting/heating the hinge onto the door** — repair obvious. |
| C | Hinge **clicks**; door works; hammer **down** (not raised as a trophy). |

**Don’t:** extra orcs; gore; swords as the beat.  
**Sound:** bellows, gentle hammer, metal click.

## 39 Gildframe — Clock Nave — showing up is the oath

**s3:** gold paladin, clock interior. One knight. Gear is the prop.

| Still | Lock |
|---|---|
| A | One paladin **arriving/kneeling** with **one gear** (late is OK). Empty nave. |
| B | **Gear slotting** into the cathedral clock — the show-up enacted. |
| C | Clock ticks; he **stands present**. No crowd of saints. |

**Don’t:** extra knights; letters on the clock face (marks/ticks OK).  
**Sound:** footsteps, gear seat, one bell-note.

## 40 Vexilith — Facet Embassy — feelings are messages

**s3:** crystal diplomat, already with a shard (often already colorful). I2I **dull** shard if s3 is already faceted.

| Still | Lock |
|---|---|
| A | One diplomat, **dull** shard in hands, embassy hall empty. |
| B | Shard **faceting into color** while held (naming the feeling — not inspecting loot). |
| C | Sets the colored shard on a **pedestal**. Face readable. |

**Don’t:** extra aliens; letters.  
**Sound:** crystal chime, quiet hall.

---

## After `go` / `start`

Shoot **36–40 in one pass** with the keyframe stack. Dump `{id}_A/B/C.jpg` + t-stamps into `docs/home-film-qa/`. Catalog all five. `AUDIT-36-40.md`. No zip/APK unless asked.
