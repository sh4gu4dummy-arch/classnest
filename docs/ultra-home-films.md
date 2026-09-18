# Ultra Home films

Fourth clip per legend: **final form in its home**, 15s, **with sound**.
Path: `public/avatars/ultra/homes/{id}.mp4` (+ `.jpg` poster).
Catalog: **Home · 15s · sound** (`src/lib/ultra-homes.ts` → `evolution-catalog.tsx`).
mp4s **are in git** (`public/avatars/ultra/homes/*.mp4`). Intros/adventures stay gitignored.

**Do not generate the next batch until the teacher says `go` on this recipe.**

**Lore for every Ultra (shoot bible, 01–75):** [docs/ultra-lore-bible.md](ultra-lore-bible.md) — origin, virtue, 3-beat Home seed, prop, don'ts.

## Status (read this first)

| Ids | Code | Quality | Action |
|---|---|---|---|
| **01–05** | In `ULTRA_HOME_READY` | **Provisional.** Extra copies / limbs. Home slot works; not the quality bar. | Redo only if teacher asks. Do not delete current mp4s without a yes. |
| **06–10** | In `ULTRA_HOME_READY` | One hero each (better than 01–05). 06 face-lost at t14; 09 nearly silent (−53 dB). See NOTES. | Keep in catalog. Soft remake 06/09 only if teacher asks. |
| **11–15** | In `ULTRA_HOME_READY` (v0.066) | Shot. 854×480 + loudnorm. One hero each; face/bell at t=14. | In catalog. QA stills in `docs/home-film-qa/`. |
| **16–20** | In `ULTRA_HOME_READY` (v0.072) | Shot. 854×480 + loudnorm + alimiter. One hero each on stills. Peaks still hot. | In catalog. Other bot: [AUDIT-16-20.md](home-film-qa/AUDIT-16-20.md). |
| **21–25** | In `ULTRA_HOME_READY` (v0.090) | Scenery/sound OK. **Teacher: not enough movement — do not remake now.** | Catalog. Action bar for later rounds. |
| **26–30** | In `ULTRA_HOME_READY` (v0.097) | Tableau / set / identity. In catalog to watch. | [AUDIT-26-30.md](home-film-qa/AUDIT-26-30.md) |
| **31** | In catalog (v0.100) | Motion better (teacher). Wing↔arm. Proceed. | |
| **32** | In catalog (v0.105) | Pretty good (teacher). Twin t7. Souvenir-pickup lesson. | 33–35 virtue-action prompts; wait `go`. |

On disk and in git: posters + **mp4s** `homes/01`–`20`.

**Frame stills + remake verdicts (other bots start here):** [docs/home-film-qa/NOTES.md](home-film-qa/NOTES.md)  
Stills: `docs/home-film-qa/{id}_t{0.5|7|14}.jpg`

### Shot 06–10 audit

| Id | Pass? | Notes |
|---|---|---|
| 06 Bloomkin | ship | One panther. Bottle stays. End t=14 face buried in a huge bloom. |
| 07 Chronomech | ship | One bot. Oils a gear. t=14 leftover brass bits, not a second spider. |
| 08 Frosthowl | ship | Cleanest. One wolf, mitten, cabin. |
| 09 Luminara | ship | One fairy. Extra glow is orbs, not a swarm. |
| 10 Ironclaw | ship | One raptor, cones, no kid silhouette. |

---

## Shot 01–05 — what happened (root cause)

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

---

## Teacher 21–25 — ACTION BAR (do not remake 21–25 now)

Catalog 21–25 **stay**. Exact Ash quote (do not paraphrase away):

> I just audited 21-25. not even close to enough movement or action. we won't remake for now, but I want MUCH more movement. maybe those were more chill cuz they are soft pets etc, but they are so boring. I want the character to be moving a lot, maybe to an entire new scene or at least having a lot of action. significantly more entertaining. but the quality of the imagery scenery is good. the sound was good for the boring videos hopefully it will have more exciting sound in the more exciting videos. include my feedback for 21-25 in the next start here. hope to see improvements for subsequent rounds. also do a self audit of your last 26-30 round and fold in any results, prepare everything for QA, including prompts for next round of 5 (do prompts of next round after you read my feedback and do yourself audit to learn any new lessons). mark my requirements down and update any protocol SOP documents you refer to when self auditing.

**Locks:** no remake 21–25; keep scenery quality; **action bar hard** for later rounds; exciting diegetic sound with the motion.

**Subsequent rounds must:**

- **MUCH more movement.** Hero travels — run / leap / swim / fly / gallop — not sit-paw-sit. New beat of place OK.
- **Significantly more entertaining.** t0.5 / t7 / t14 must **not** be the same pose (slideshow = fail).
- Keep scenery quality. Sound should **match the action** (whoosh, hooves, splash, metal) — still diegetic, still max ≤ −6.
- Locked sit-still is **not** the default. Slow follow OK. Twins / lost face still fail.

Self-QA: if three stamps could be three still photos of one pose → **fail movement** (do not READY).

## Teacher 32 — virtue-action (2026-09-17)

Ash: 32 **pretty good**, setting good. Do **not** only “run, find object, look at object.” The mid beat must **enact the lore/virtue**, not inspect set dressing.

**Later ids:** t7 = the character’s virtue *done* (repair, pause-and-pour, look-then-step). Travel is fine; souvenir-pickup is not. 32 stays (pretty good). If remade later: listen/catch = intercept what was almost missed, not pin a still map.

Self-QA: if t7 is “hero next to a prop” with no lore-readable act → **fail virtue** (re-roll).

---

Ash: action/movement **better**. Good enough to proceed. Wings became **arms**; messy on biped/humanized animals.

**Later ids:** tails, wings, fins, ears stay that anatomy. No human arms/hands. Catalog quadruped → four legs the whole clip. Self-QA: wing→arm / tail→extra limb / fin→hand = **fail limb** (re-roll). Soft on 31 only.

---

Twin **HARD** only when stamps show **two distinct heads/bodies**. Do **not** call twin HARD for: water **reflection**, one long body looping in/out of water, horn/leg anatomy softs without a second creature, or a mushroom/prop. Homes 26–30 corrected: twin column was overclaimed; fails were tableau / set-drift / identity.

## Anti-twin prevention (method — still ship)

Negatives alone do not stop I2V merge on later rounds. Use this stack:

1. **I2I still-gate.** Dump home I2I → open it. Extra limb/face/second silhouette → redo I2I. Never I2V a dirty still.
2. **Hero ≥50% mid-shot.** “One body, one shadow, one pair of eyes.”
3. **≤3 travel beats** in 15s (six story beats invite twins).
4. **Mandatory re-roll.** Any stamp with two distinct bodies → discard clip, do not encode to `homes/`, do not continue the batch.
5. **Long-body special:** single continuous spine; do not miscount one serpent as two — but a real second head still fails.
6. **Trial before batch.** 31 proceeded (teacher). Next generate is **32 only** on `go`.

## Trial-first (process)

- Do not five-at-once while twin risk is live.
- Bot1 **fills AUDIT QA column** before READY / catalog celebration. Empty QA after a failed batch = process fail.

---

1. **Exactly one creature.** Never a baby clone, never a second silhouette. Props are **objects**.
2. **Three beats with TRAVEL:** start in the home → **move** (new spot or big physical action) with one prop → land readable. Not sit-paw-sit. Not six story beats.
3. **Lock anatomy:** same skeleton; tails/wings/fins/ears do not become arms, terrain, or extra limbs. Quadruped s3 → four legs.
4. **Mid-shot**, hero large. Camera **may follow**. Wide empty landscapes still invite twins — keep hero ≥40%.
5. **I2I a 16:9 home** from the catalog s3 if s3 is a bust/sliver, then I2V that still. Duration **`15`**, **`480p`**.
6. **854×480** after encode.
7. **Audio** diegetic and **energetic with the action**; target mean **~−20 dB**; fail max **> −6**. Keep AAC. `loudnorm=I=-20:LRA=11:TP=-2,volume=0.5` last until a hotter chain is proven.
8. **No humans**, no text, no song, no dialogue.
9. **Audit before catalog:** 0.5 / 3 / 7 / 11 / 14. Extra body, melt, **or three identical poses** = redo, don’t READY.
10. Copy into `homes/` the same turn. Home mp4s **are in git**.

Shared negative line (append to every prompt):

```
Exactly ONE creature in every frame. No second copy, no cub duplicate, no extra legs/wings/heads.
Anatomy locked. Wings stay wings, tails stay tails, fins stay fins, ears stay ears — never arms/hands.
If the catalog still is a quadruped, stay on four legs. No morphing into lava, glass, clouds, or flowers.
No humans, no text, no logos, no song, no speech.
```

### Sound exception (bots: read this)

`AGENTS.project.md` says **catalog intros/adventures are silent on purpose**.  
**Home films are the exception:** they ship **with diegetic sound**. UI label is `Home · 15s · sound`.

Do **not** apply the Imagine playbook’s silent encode (`ffmpeg … -an`) to Home films. That strip is for silent catalog clips only.

Home encode (keep audio):

```bash
ffmpeg -y -i /workspace/artifacts/imagine_videos/<uuid>.mp4 \
  -vf "scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2,fps=24" \
  -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  public/avatars/ultra/homes/0N.mp4
```

Poster from a clean mid-frame (or Imagine still), same basename `.jpg`.

---

## QA for other bots (must pass before shipping)

Treat this as the gate. If any line fails, **redo that id** — do not add it to `ULTRA_HOME_READY`.

### A. Before you generate

- [ ] Teacher said **`go`** for this batch (06–10 or named redos).
- [ ] You are editing ClassNest only (`sh4gu4dummy-arch/classnest`), not another app.
- [ ] Still exists: `public/avatars/ultra/{id}-s3.jpg`.
- [ ] Prompt has **travel + action** (not a locked tableau), one prop, mid-shot, shared negative.
- [ ] Lore home name matches `src/lib/ultra-lore.ts` (`home` field) — catalog title uses that string.
- [ ] You will **keep audio** (no `-an`).

### B. Frame audit (required)

Pull stills at **0.5s / 7s / 14s** into **`docs/home-film-qa/`** (git). Fail if any frame shows:

- [ ] A second creature / silhouette / cub clone
- [ ] Extra legs, wings, heads, or fused limbs
- [ ] Body melting into terrain (lava, glass, cloud, flowers)
- [ ] **Face unreadable** (flower mound, smear, off-frame) — “one body” is not enough
- [ ] Humans, readable text, logos
- [ ] Hero tiny in a wide establishing shot (invites twins)
- [ ] **Movement miss:** t0.5, t7, t14 are the same pose / slideshow (teacher 21–25)

Pass only if **one** clear hero, **face readable on all stamps**, anatomy stable, prop readable, **and the hero clearly moved**.

Loudness (ffmpeg `volumedetect`): fail mean **< −40 dB** (silent); fail max **> −6 dB** (clip). Target mean **−22 to −18 dB**.

### C. Tech check

- [ ] Duration ≈ **15.0s** (not 6 / 10)
- [ ] Frame size **854×480** after encode (or documented exception)
- [ ] Has **AAC audio** track (not muted silent)
- [ ] Loudness mean roughly **−22 to −18 dB** (lift quiet clips; don’t clip board speakers)
- [ ] Files on disk: `public/avatars/ultra/homes/{id}.mp4` + `{id}.jpg` (zero-pad, e.g. `06`)
- [ ] Home **mp4s are tracked in git** when they ship (or when QA must see a fail)
- [ ] Id added to `ULTRA_HOME_READY` in `src/lib/ultra-homes.ts` **only after** A–C pass
- [ ] Version bump + commit + `sh scripts/push-github.sh` the same turn (code/poster only)
- [ ] Do **not** rebuild avatars zip / portable / APK unless asked
- [ ] Do **not** delete or overwrite prior Home mp4s without teacher yes (archive first if replacing)

### D. Visibility (board)

Home clip plays in the Ultra catalog and in theater mode (`CatalogVideoClip` / lightbox). **Done** means: face/body readable at board distance, subject not clipped, outcome visible on the surface — same visibility invariant as `AGENTS.project.md`.

### E. Common bot mistakes (do not)

- Copying the silent-catalog ffmpeg recipe onto Home films
- Shipping because “chat preview looked fine” without 0.5 / 7 / 14 stills
- Adding an id to `ULTRA_HOME_READY` before the mp4 is copied into `homes/`
- Six-beat story prompts (“and then… and then…”)
- Wide landscape I2V from a tiny hero
- Generating 06–10 before **`go`**
- Committing `.mp4` or Grok sandbox paths
- Reusing 01–05 as prompt style references (they are the failure case)

---

## Last five — old prompt vs if we redid them

Same legends. Old = what we actually sent. New = 3 beats, one hero, one prop.

### 01 Aetherflame — The Glass Spire

**Old (too much):** sprint ridge → glass stairs → leap gap → catch bolt as lantern → plant cairn → mane flare.

**Next (if redo):** One crystal lightning wolf, mid-shot. (1) Walks onto a glass ledge in a spark-blizzard. (2) Catches **one** lightning bolt in its teeth; bolt becomes a small lantern. (3) Sets lantern on a cairn and walks off along the ridge. Sound: thunder, glass chime, wind.

### 02 Voidfang — The Quiet Between

**Old:** lilies close → crayon drawing → paper cub walks with him → windowsill → petal → melt away. (Model cloned the cub.)

**Next (if redo):** One shadow panther. (1) Pads through shadow-lilies. (2) Picks up **one crumpled crayon drawing** (paper, not a live cub) in its mouth. (3) Sets the paper on an empty windowsill (lamp, no people) and walks into the garden. Sound: paws, paper, purr.

### 03 Emberpuff — Ember Hollow

**Old:** burst den → gold breath on clay fox → curl around it → crack seals → sun shaft → spark flick. (Extra foxes + lava-tails.)

**Next (if redo):** One solar kitsune, tails stay tails. (1) Trots to the kiln shelf. (2) Breathes a **gold line** onto the crack of **one clay fox figurine**. (3) Flicks a spark and leaves; figurine glows, still clay. Sound: crackle, kiln whoosh, one yip.

### 04 Nebulynx — The Star Chart Attic

**Old:** bat star across charts → charts spin → leap rafter → pin star in map → sky gains a pin. (Two cats.)

**Next (if redo):** One galaxy lynx. (1) Bats **one** fallen star across the floor. (2) Leaps a rafter (same one body). (3) Noses the star into an empty hole on a floating chart; a chime. Sound: wood creak, paper, ping.

### 05 Stormwyrm — Thunderkeep

**Old:** storm hammers → nest rattles → swallow thunder → wing umbrella → dive sea and dump storm. (Two dragons.)

**Next (if redo):** One storm dragon, mid-shot on the battlement. (1) Rain hammers the keep. (2) He **inhales** the thunder (sky hushes); **one wing** shelters a **nest of chicks** (birds, not dragons). (3) He lifts off toward the sea. Sound: thunder → hush → rain on membrane.

---

## Next five to shoot (06–10) — new prompts

I2V from `public/avatars/ultra/{id}-s3.jpg`. 15s. Append the shared negative line.
Still files for 06–10 **are in git** and ready.

### 06 Bloomkin — The Vine Court

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

1. Copy into `public/avatars/ultra/homes/{id}.mp4` + poster `.jpg` the **same turn** (locker path from Imagine → `cp`).
2. Run QA sections **B** and **C**. Failures: redo; do not touch `ULTRA_HOME_READY`.
3. Add only **passing** ids to `ULTRA_HOME_READY`.
4. Bump `VERSION` / `package.json` / `APP_VERSION`, rebuild code-only zip, commit, `sh scripts/push-github.sh`.
5. Home **mp4s are tracked**; intros/adventures stay gitignored.
6. Do not pack avatars zip unless asked.
7. Tell the teacher which ids passed, which failed, and the new version.

---

## Final check before `go` (ClassNest-Bot1 QA — 2026-09-17)

Ready to shoot **06–10** when the teacher says **`go`**. Not before.

| Check | Result |
|---|---|
| Recipe docs the 01–05 failure mode and the fix | Pass |
| Prompts 06–10 are 3-beat / one-hero / mid-shot | Pass |
| s3 stills for 06–10 present in repo | Pass |
| Lore home titles match prompts (Vine Court, Tick-Tock Foundry, Aurora Den, Lantern Grove, Forge Hangar 7) | Pass |
| Catalog wired (`ultra-homes.ts` + Home · 15s · sound) | Pass |
| Sound exception vs silent-catalog rule written for bots | Pass |
| Home ffmpeg keeps AAC (no `-an`) | Pass |
| Ship gate = frame audit before `ULTRA_HOME_READY` | Pass |
| 01–05 marked provisional, not golden | Pass |
| Generate gate = teacher **`go`** | Pass — **waiting** |

**Blockers / open calls for the teacher (optional, not required for `go` on 06–10):**

- Whether to **redo 01–05** after 06–10, or leave provisional clips in catalog
- Whether loudness normalization should be forced in ffmpeg (e.g. `loudnorm`) on every Home encode

**Verdict:** 06–10 shot and shipped in catalog (v0.059). 01–05 still provisional. Next: teacher `go` on 11–15 or `go redo 01-05`.
