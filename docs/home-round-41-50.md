# Home round 41–50 (PLAN — QA audit, then `go` / `start`)

**Expedite (teacher):** all **ten in one pass**. No trial-stop between ids.

**When shooting (not now):** **git commit each id** as soon as that Home mp4 is encoded + stamped + in `ULTRA_HOME_READY`. Do not wait for 50 to commit 41.

**Do not generate until `go`/`start`.** Do not remake 36–40 unless named.

Ids: **41 Sparkgrit → 50 Aegisunit.** Lore: [ultra-lore-bible.md](ultra-lore-bible.md) §§41–50.

## Method v2 (better than 36–40)

36–40: I2I **B/C stills grew twins**; 6s I2V from a clean A **still twinned at t7**; xfade broke because `-af` + `filter_complex`.

**Do this instead:**

1. **Still A only.** Tight mid-shot, **hero ≥65%** (no empty hall for a twin). Dump `{id}_A.jpg`. Open it. Two bodies → redo A. Never I2V a dirty A.
2. **Do not I2I B/C stills.** That chain duplicated last time.
3. **Clip1** = I2V **duration 6** from A (start beat).
4. **Extend:** extract **last frame** of clip1 → open it. Twin → **re-roll clip1**, do not extend. Clean → **Clip2** I2V 6s from that frame (virtue beat).
5. Same for **Clip3** from clip2 last frame (aftermath).
6. Concat with xfade; put **loudnorm inside `filter_complex`** (not `-af`):

```bash
ffmpeg -y -i c1.mp4 -i c2.mp4 -i c3.mp4 \
  -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.4:offset=4.6[ab];[ab][2:v]xfade=transition=fade:duration=0.4:offset=9.2[v];
[0:a][1:a]acrossfade=d=0.4[a1];[a1][2:a]acrossfade=d=0.4,loudnorm=I=-20:LRA=11:TP=-2,volume=0.5[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart public/avatars/ultra/homes/NN.mp4
```

7. Stamps 0.5/3/7/11/14. Twin HARD = two distinct bodies. One re-roll of that clip then catalog. **Commit that id.** Next id.

Shared negative:

```
Exactly ONE being in the entire frame. No second copy. Match this face. Hero fills at least 65%.
Anatomy locked (tails/wings/fins/ears stay that — never extra arms). No crowds, no readable letters, no song, no speech.
Virtue is being DONE, not looking at a souvenir.
```

---

## 41 Sparkgrit — Sky-Dock 7 — working ugly beats pretty parked

**Virtue:** he **tightens the bolt** so the ugly flyer **lives**, then docks it. Not “look at a bolt.”

| Clip | Beat |
|---|---|
| 1 from A | One goblin at a messy sky-dock, **ugly mini-flyer** in paws, bolt loose. Hero ≥65%. Empty dock. |
| 2 extend | **Tightening the bolt**; flyer starts to hover. |
| 3 extend | Flyer docks; he grins; **no trophy pose**. One goblin.

**A still:** 16:9 dock, this goblin face, one ugly flyer, no extra goblins, no letters.  
**Sound:** ratchet, hover buzz, dock clunk.

## 42 Gravemason — Carved Mountain — heavy work is allowed; rest is allowed

**Virtue:** he **sits as a seat** (rest) while one abstract rune carves. Being the bench is the act.

| Clip | Beat |
|---|---|
| 1 | One stone golem, mountain hall, starting to sit. ≥65%. |
| 2 | Seated; **one abstract rune** carves (not a real name). |
| 3 | Stays as a seat. Empty. No second golem.

**Don’t:** extra golems; readable names. **Sound:** stone grind, chisel, hush.

## 43 Cinderwish — Thousand-Lamp Bazaar — shy wish, one more try

**s3 trap:** crowded bazaar. **Rewrite:** empty aisle. **Virtue:** **lights one unlit lamp** and **leaves it** (grants the unspoken). No people.

| Clip | Beat |
|---|---|
| 1 | One lantern-djinn, empty bazaar, one **dark** lamp. ≥65%. |
| 2 | **Lights** that lamp. |
| 3 | Sets it on a sill and **walks on**. No extra djinn.

**Don’t:** patrons; extra djinn; letters on lamps. **Sound:** match/glass, quiet market.

## 44 Duskwyn — Eclipse Terrace — courtesy as armor

**Virtue:** **sets a second teacup** and **waits without staring**. Invitation, not a test. No guest faces.

| Clip | Beat |
|---|---|
| 1 | One moonlit noble, terrace night, **one** cup. ≥65%. Empty. |
| 2 | Places **the second cup**; steam. Does not stare at the empty chair. |
| 3 | Waits, looking aside. One noble.

**Don’t:** extra nobles; guest faces; letters. **Sound:** porcelain, night wind.

## 45 Brinecrown — Glassreef Palace — wait your turn; swim together

**Virtue:** **stills the water** so a **tiny fish-school (env, not monarchs)** can pass. Fins stay fins.

| Clip | Beat |
|---|---|
| 1 | One merfolk monarch, palace gate, water choppy. ≥65%. |
| 2 | Palm stills water; **tiny fish** line up (props). **Still one merfolk.** |
| 3 | Fish pass; they watch. No second merfolk.

**Don’t:** second merfolk; letters. **Sound:** water hush.

## 46 Palevow — Sunlit Ossuary — keep the promise

**Virtue:** **catches a slipping oath-scroll** and **pins it over the heart**. Not horror.

| Clip | Beat |
|---|---|
| 1 | One bone paladin, sunlit ossuary, scroll starting to slip. ≥65%. Warm light. |
| 2 | **Catches and pins** the scroll. |
| 3 | Sunlight hardens it. Face readable. Not scary. One knight.

**Don’t:** horror; extra knights; readable text on the scroll (blank/seal only). **Sound:** cloth, pin, soft choir-air.

## 47 Viridelle — World-Tree Nave — tend the scrape

**Virtue:** **pours one jar** into a **cracked root**; green fills the crack.

| Clip | Beat |
|---|---|
| 1 | One dryad, nave, cracked root, jar in hands. ≥65%. |
| 2 | **Pouring**; green filling the crack. |
| 3 | Crack sealed; small smile. One dryad.

**Don’t:** extra dryads; letters. **Sound:** water, wood.

## 48 Quartzarch — Infinite Prism — another facet

**Virtue:** **rotates a crystal cube** until a **new corridor of light** opens, then walks it.

| Clip | Beat |
|---|---|
| 1 | One crystal mage, prism hall, cube in hands. ≥65%. |
| 2 | **Rotating**; new light-corridor opens. |
| 3 | Walks into it. One mage.

**Don’t:** extra mages; letters in the glass. **Sound:** crystal tick, whoosh of the hall.

## 49 Inkstride — Ink Roof — say the brave sentence

**Virtue:** a **ribbon of ink follows a step**, then **settles as one stroke** on paper. **No readable words.**

| Clip | Beat |
|---|---|
| 1 | One ink dancer on a roof, paper waiting, ink at a foot. ≥65%. |
| 2 | Ink ribbon **follows the step**. |
| 3 | Settles as a single abstract stroke (not letters). One dancer.

**Don’t:** extra dancers; real-language writing. **Sound:** wind, ink drip.

## 50 Aegisunit — Dome Watch — stand between

**Virtue:** **plants feet**, **shield-dome ripples once** over an **empty** hangar, visor dims to rest. Not combat.

| Clip | Beat |
|---|---|
| 1 | One mech, empty hangar, starting to plant feet. ≥65%. |
| 2 | **Dome shimmer** over empty floor. |
| 3 | Visor dims; rest. One mech. No extra units.

**Don’t:** extra mechs; combat; letters. **Sound:** servo, one shield hum, rest.

---

## After `go` / `start`

Shoot **41–50** with method v2. After each id: stamps + catalog + **commit that id**. `AUDIT-41-50.md` can accumulate per commit. No zip/APK unless asked.
