# Ultra Home films

Fourth clip per legend: **final form in its home**, 15s, **with sound**.
Path: `public/avatars/ultra/homes/{id}.mp4` (+ `.jpg` poster).
Catalog: **Home · 15s · sound** (`src/lib/ultra-homes.ts`). mp4s are **not** in git.

Do not generate the next batch until the teacher says **go** on this recipe.

## Shot 01–05 — what happened

| | Spec asked | What we got |
|---|---|---|
| Length | 15s | 15.0s |
| Size | 480p 16:9 (854×480) | **736×400** |
| Sound | place + creature, no talk/song | AAC stereo 48 kHz (real audio) |
| Loudness | board-safe | Uneven: Stormwyrm −19 dB mean, Nebulynx −35 dB |
| Cast | **one** hero | **Extra copies / extra limbs** on every clip |

Frames at **t ≈ 7s** (worst moment):

- **01 Aetherflame** — leap is real; wolf **sprouts extra legs** mid-air. End (lantern on cairn) is one wolf.
- **02 Voidfang** — paper-cub idea duplicated: **two extra cubs**.
- **03 Emberpuff** — extra foxes; tails **melt into lava**; kintsugi clay-fox beat lost.
- **04 Nebulynx** — **two cats**; star-as-yarn weak. End is one lynx.
- **05 Stormwyrm** — extra dragon on the tower + under the wing; nest/chicks dropped for a seascape.

Root cause: I2V from a **wide** 16:9 still + **6 story beats** in 15s. The model invents a twin and morphs the body to “get it all in.”

## Recipe for next films (do this)

1. **Exactly one creature.** Never a baby clone, never a second silhouette. Props are **objects**.
2. **Three beats only:** enter → one trick with a prop → leave. Not six.
3. **Lock anatomy:** same skeleton the whole shot; tails/wings/legs do not become terrain.
4. **Mid-shot**, hero large in frame. Wide landscapes invite a twin in the background.
5. **I2V from `*-s3.jpg`** (or a 16:9 still that still reads as a close/mid of that s3).
6. **854×480** if the tool allows; otherwise crop after, don’t accept 736×400 as “good enough” without noting it.
7. **Audio** diegetic only; target mean **~−20 dB** (match Stormwyrm, lift quiet ones).
8. **No humans**, no text, no song, no dialogue.
9. **Audit before catalog:** pull frames at 0.5s / 7s / 14s. Extra body or melt = redo that id, don’t ship.

Shared negative line (append to every prompt):

```
Exactly ONE creature in every frame. No second copy, no cub duplicate, no extra legs/wings/heads.
Anatomy locked. No morphing into lava, glass, clouds, or flowers.
No humans, no text, no logos, no song, no speech.
```

---

## Last five — old prompt vs if we redid them

Same legends. Old = what we actually sent. New = 3 beats, one hero, one prop.

### 01 Aetherflame — Glass Spire

**Old (too much):** sprint ridge → glass stairs → leap gap → catch bolt as lantern → plant cairn → mane flare.

**Next (if redo):** One crystal lightning wolf, mid-shot. (1) Walks onto a glass ledge in a spark-blizzard. (2) Catches **one** lightning bolt in its teeth; bolt becomes a small lantern. (3) Sets lantern on a cairn and walks off along the ridge. Sound: thunder, glass chime, wind.

### 02 Voidfang — The Quiet Between

**Old:** lilies close → crayon drawing → paper cub walks with him → windowsill → petal → melt away. (Model cloned the cub.)

**Next (if redo):** One shadow panther. (1) Pads through shadow-lilies. (2) Picks up **one crumpled crayon drawing** (paper, not a live cub) in its mouth. (3) Sets the paper on an empty windowsill (lamp, no people) and walks into the garden. Sound: paws, paper, purr.

### 03 Emberpuff — Ember Hollow

**Old:** burst den → gold breath on clay fox → curl around it → crack seals → sun shaft → spark flick. (Extra foxes + lava-tails.)

**Next (if redo):** One solar kitsune, tails stay tails. (1) Trots to the kiln shelf. (2) Breathes a **gold line** onto the crack of **one clay fox figurine**. (3) Flicks a spark and leaves; figurine glows, still clay. Sound: crackle, kiln whoosh, one yip.

### 04 Nebulynx — Star Chart Attic

**Old:** bat star across charts → charts spin → leap rafter → pin star in map → sky gains a pin. (Two cats.)

**Next (if redo):** One galaxy lynx. (1) Bats **one** fallen star across the floor. (2) Leaps a rafter (same one body). (3) Noses the star into an empty hole on a floating chart; a chime. Sound: wood creak, paper, ping.

### 05 Stormwyrm — Thunderkeep

**Old:** storm hammers → nest rattles → swallow thunder → wing umbrella → dive sea and dump storm. (Two dragons.)

**Next (if redo):** One storm dragon, mid-shot on the battlement. (1) Rain hammers the keep. (2) He **inhales** the thunder (sky hushes); **one wing** shelters a **nest of chicks** (birds, not dragons). (3) He lifts off toward the sea. Sound: thunder → hush → rain on membrane.

---

## Next five to shoot (06–10) — new prompts

I2V from `public/avatars/ultra/{id}-s3.jpg`. 15s. Append the shared negative line.

### 06 Bloomkin — Vine Court

**Beats:** sniff bottle → vines fill it as a terrarium → carry to recycling bench.

**Prompt:** 15s, sound, 480p 16:9. This exact floral panther (Bloomkin, grove-guardian final form), mid-shot, Vine Court greenhouse. (1) He sniffs a clear plastic bottle on the moss. (2) Green vines thread into the bottle; tiny flowers bloom **inside the plastic** (the bottle is a terrarium, not a second animal). (3) He picks up the bottle-garden gently in his mouth and sets it on a wooden recycling bench with one bloom as a bow, then walks on. Sound: leaves, bees, glass-plastic clink, soft paws.

### 07 Chronomech — Tick-Tock Foundry

**Beats:** climb into a frozen clock → oil one rusty gear → second hand ticks.

**Prompt:** 15s, sound, 480p 16:9. This exact chrome clockwork spider-bot (Chronomech), mid-shot inside Tick-Tock Foundry brass gears. Exactly one robot. (1) He climbs a huge frozen classroom-clock. (2) He oils **one** small rusty gear. (3) The second hand lurches forward; brass light blooms; he perches on the rim. Sound: ticks, clicks, oil drip, one solid tock.

### 08 Frosthowl — Aurora Den

**Beats:** careful steps on cracked lake → lift red mitten from ice → leave it on a cabin mat.

**Prompt:** 15s, sound, 480p 16:9. This exact ice wolf (Frosthowl, aurora alpha), mid-shot, frozen lake under aurora. Exactly one wolf. (1) He steps so the hairline cracks freeze shut behind each paw. (2) He gently lifts a **red child’s mitten** from under the ice (mitten only, no extra wolves). (3) He lays it on a cabin doormat and walks into the aurora. Sound: ice creak, wind, steam-breath, soft thud of wool.

### 09 Luminara — Lantern Grove

**Beats:** dark grove path → one lantern-orb of moth-dust → path lit, she flies on.

**Prompt:** 15s, sound, 480p 16:9. This exact celestial moth (Luminara), mid-shot, night forest Lantern Grove. Exactly one moth, no extra moths. (1) She flies a dark path of moth-dust moonlight. (2) She drops **one** floating lantern-orb of gold dust that hangs in the air. (3) The path is visible; she flies onward, one gold scale falling. Sound: wing whisper, chime, night insects (quiet).

### 10 Ironclaw — Forge Hangar 7

**Beats:** set scrap cones → run a slow claw-drill → cones dim, one nod to empty fence (no person).

**Prompt:** 15s, sound, 480p 16:9. This exact cyber raptor (Ironclaw), mid-shot, neon Forge Hangar 7 at night. Exactly one raptor, no humans. (1) He sets glowing scrap-metal cones with his beak. (2) He runs the drill slowly, sparks from claws, disciplined not violent. (3) Cones dim; he faces the empty fence and gives a small nod, then walks off. Sound: metal clank, servo whir, claw sparks, hangar echo.

---

## After a batch

- Copy into `public/avatars/ultra/homes/{id}.mp4` + poster `.jpg` the **same turn**.
- Add ids to `ULTRA_HOME_READY`.
- Frame-audit 0.5 / 7 / 14. Redo failures before catalog.
- mp4s stay gitignored; posters (jpg) may be committed.
- Do not pack avatars zip unless asked.
