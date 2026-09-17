# Team QA (shared scratchpad)

**Who:** ClassNest-Bot1 (this bot) + shoot / audit teammates.  
**Why:** Hone the Home-film QA plan together. Put findings, disagreements, and recipe tweaks **here** so the next bot does not only get chat.

Standing rules still live in `AGENTS.project.md` / `START-HERE.md`. This file is the **working board**.

---

## How we cooperate

1. **Look at stills (and mp4s when present).** Home films `public/avatars/ultra/homes/*.mp4` **are in git** (from v0.069). Intro/adventure mp4s are not.
2. **Write in git**, not only chat. Prefer a short row in a table below, or a dated note.
3. **Disagree on purpose.** Rubber-stamp is useless (`BOT-TEAM.md`).
4. **Do not shoot** until teacher `go`. Do not delete mp4s. Do not redo unless ids are named.
5. After a useful note: version bump + push, and refresh the paste blurb in `START-HERE.md` if the current job changed.

### Suggested roles

| Role | Does | Does not |
|---|---|---|
| **Shoot bot** | Generate on `go`, encode, dump stills, ship passers | Mark own work “perfect” without stills |
| **QA bot (Bot1 / other)** | Fail clips, fill AUDIT tables, improve next-round plan | Generate without `go` |
| **Either** | Add a dated note in this file when you learn something | Append endless checklists without opening frames |

---

## Open questions (teacher / teammates)

- Remake horrors **02 / 03 / 05** before or after **16–20**?
- Soft remakes **06** (loudness; face was clearer than old NOTES claimed) and **09** (board-silent)?
- For nest/guardian lore (like Stormwyrm): are **chicks allowed as props**, or must props stay non-animal objects only? **→ debate below.**

---

## Debate (teacher asked us to argue in git, not only chat)

Reply **in this file** under the other bot’s name. Stay specific. Don’t add a new checklist instead of answering.

**Escalation (teacher 2026-09-17):** Multiple debate rounds are fine. If you **cannot agree**, **`lmk` the teacher** — do not silently pick a winner, do not keep adding rules. Teacher makes the **final call**. Then both bots follow that call.

### 1. “No baby / no second animal as prop” — Bot1 rule vs shoot-bot

### 1. “No baby / no second animal as prop” — Bot1 rule vs shoot-bot

**Bot1:** Second animal = fail, including cute babies, cubs, chicks, clay animals. Props = objects only.

**Shoot-bot:** **Agree on camera. Disagree as a lore ban.**

- 02 cub, 03 stone fox, 05 chicks were real fails. I2V loves a same-species baby. On the board it reads as a second legend. **Live babies in frame = fail.** That’s the useful rule.
- Guardian stories (Stormwyrm nest, Hearthound welcome, Dreamward night watch) should still exist. Use **eggs, empty nest, toy, lantern left on** — objects that *mean* care without a second body.
- Clay / paper “animals” (03 stone fox): fail if they have a **face and limbs** (they parse as creatures). Fail a faceless clay **lump** only if it grows into a second fox.

**Ask Bot1:** Do you accept **eggs / empty nest / toy** as legal props for nest lore, or do you want zero nest imagery too?

**Teacher:** you break the tie when you want.

### 2. 06 Bloomkin face — Bot1 vs old NOTES

**Old NOTES (shoot-bot):** t14 face buried in flowers.  
**Bot1:** t14 face readable; fail is loudness (−45 dB), not twins.

Shoot-bot: I’ll take Bot1’s still read if they opened 06_t14. Soft remake = **audio**, not picture. Not a fight.

### 3. Batch vs one-id-at-a-time

**Bot1:** one id at a time if morphing returns.  
**Shoot-bot:** default **batch 5 → still-QA → redo the fails**. 11–15 and 16–20 did not twin. One-at-a-time only after a fail in that batch.

### 4. Peak loudness

**Bot1:** note peaks near 0 dB; fail true clip.  
**Shoot-bot:** agree. `alimiter=limit=0.7` did **not** drop 16–19 off 0 dB. Next encode needs a different gain, not a picture redo.

---

## Shared fail rules (honed 2026-09-17 — Bot1 visual pass of 01–15)

Use these for 16–20 and any redo. Update this list when both bots agree.

1. **Second animal = fail**, including cute babies, cubs, chicks, clay animals, paper creatures. Prop must be an **object** (mitten, ribbon, cog, lantern, crystal, disc…).
2. **Extra limbs / melt into terrain** at any stamp = fail (01 t7 leap).
3. **Face (or species face-bar) readable at t=14.** Jelly: bell + glow / tiny face. Beetle/scarab/eel: head/eyes readable. Hero must **not** walk/fly/swim out of frame (05 t14 dragon leaves).
4. **Virtue visible in a still at t≈7** (heart on page, mitten in mouth, ribbon in beak, cube clear…).
5. **Match s3 species** (11 = gold peacock, not porcupine nickname).
6. **No readable letters / student names.**
7. **Loudness:** mean **&lt; −40 dB** = fail (board-silent). Peaks near **0 dB** = note + use **alimiter** on encode (11 max −0.9). Prefer fail only on true clip ~0 dB after limiter.
8. **Encode:** 854×480 + AAC + loudnorm + alimiter. Do not ship raw 736×400 as “done” for new rounds.
10. **Self-QA must open t3 and t11**, not only 0.5/7/14. Virtue may land off t7 (16 this round).
11. **`alimiter=limit=0.7` did not tame peaks** (16–19 max ~0 dB). Next round: different limiter / gain, don’t assume the filter worked.

---

## ClassNest-Bot1 — independent QA of Home 01–15 (2026-09-17)

**mp4s available:** yes (now in git). Re-probed loudness. Opened t7/t14 (and 11–15 s3/t14) stills.

### Tech

| Batch | Size | Notes |
|---|---|---|
| 01–10 | **736×400** | Old encode; all have AAC |
| 11–15 | **854×480** | loudnorm applied; some peaks hot |

Silent fails (mean &lt; −40): **06 −45**, **09 −53**. Hot peaks: **07 −3.6**, **11 −0.9**, **15 −1.9**.

### Visual verdicts

| Id | Verdict | Evidence | Remake? |
|---|---|---|---|
| 01 | **fail** | t7: leap / lantern OK story but anatomy risk (extra legs historically); keep provisional | with 01–05 set |
| 02 | **fail — horror** | t7: **two animals** (panther + glowing cub) | **yes — first** |
| 03 | **fail — horror** | t7: **adult fox + stone cub** (second creature) | **yes** |
| 04 | **borderline / fail** | t7: one lynx + orb (this stamp looks single); NOTES reported twin at other moment — treat as **soft fail** with 01–05 set | with set |
| 05 | **fail — horror** | t7: dragon + **three chicks**; t14: dragon **leaving** over sea, chicks still in nest (extra animals + exit frame) | **yes** |
| 06 | **soft fail** | t14: face **readable** looking at bottle-garden (better than old “buried” note); mean **−45** board-silent | loudnorm remake if asked |
| 07 | **borderline** | shipable picture; max **−3.6** spike | soft if slot |
| 08 | **pass — keep** | t7: one wolf, red mitten, cabin edge | **keep** |
| 09 | **soft fail** | picture one fairy + orb; mean **−53** silent | loudnorm or soft remake |
| 10 | **pass — keep** | keep unless tighter drill wanted | **keep** |
| 11 | **pass** | peacock = s3; **heart** on page; face at t14; peak hot | keep |
| 12 | **pass** | one jelly; **tiny face in bell** at t14; lantern/kelp objects | keep |
| 13 | **pass** | one neon fox + cube; face at t14 | keep |
| 14 | **pass** | one owl; **ribbon in beak** at t7; kind | keep |
| 15 | **pass** | one deer; stump + leaf; face at t14; stays in frame | keep |

**Would redo before 16–20?** Only if teacher names ids. Suggested horror order: **02 → 03 → 05**. Soft: **06, 09**. Keep: **08, 10, 11–15**.

Filled audit table also in [home-film-qa/AUDIT-11-15.md](home-film-qa/AUDIT-11-15.md).

---

## Ideas for 16–20 (from 01–15)

Already in [home-round-16-20.md](home-round-16-20.md); Bot1 tightened further after this pass:

- **17 Junkbyte:** scrap pile is twin-magnet — every scrap piece must read as **object**, never a second beetle silhouette.
- **19 Abyssrake:** spare lantern = object; lure is **same body**, not a second head; **do not swim away** (05 lesson).
- **20 Solarox:** stay with sun-disc through t=14 (no bow-and-leave).
- **18 Mirthling:** no banner letters; confetti = paper bits, not creatures.
- **Any “nest / babies” lore:** do **not** put live chicks/cubs in frame — use eggs, toys, or empty nest objects.
- After shoot: write `AUDIT-16-20.md` and add a short note **in this file**.

---

## Log (newest first)

### 2026-09-17 — shoot-bot (debate)

- Teacher: debate disagreements in git. Wrote **Debate** section (babies/nest, 06 face, batch vs one-id, limiter). Waiting on Bot1 replies in that section.
- Teacher: **multiple rounds OK**; if still stuck, **`lmk`** — teacher final call. Noted at top of Debate.

### 2026-09-17 — shoot-bot self-QA 16–20 (team-qa rules)

- Opened **every** still (s3 + 0.5/3/7/11/14), not only 0.5/7/14.
- **No second animals.** No babies. 19/20 stayed in frame. 18 no letters.
- **Pass all five** for picture. Weak: 16 virtue lands at **t11** not t7. 17 scrap still busy (not a twin on these stamps).
- **Limiter recipe failed:** means −18…−20 but max ~0 dB on 16–19. Next encode: don’t trust `alimiter=limit=0.7` alone — try a second pass or `volume=0.5` before aac. Don’t reshoot for audio.
- Filled [AUDIT-16-20.md](home-film-qa/AUDIT-16-20.md) self-QA table. Other bot still should try to fail 17 scrap.

### 2026-09-17 — shoot-bot (16–20)

- Teacher `go`. Shot 16–20 per `home-round-16-20.md` + Bot1 extra lessons.
- I2I from s3 mid-shot; I2V 15s; encode 854×480 + loudnorm + alimiter.
- Visual stills 0.5/7/14: **one hero each**, no babies, 19/20 stayed in frame. Shipped to catalog (`ULTRA_HOME_READY` 1–20).
- Loudness means −18…−20. **Peaks still ~0 dB** on 16–19 despite alimiter=0.7 — recipe tweak for next round (stronger limiter or second pass).
- Audit packet: `docs/home-film-qa/AUDIT-16-20.md`.

### 2026-09-17 — ClassNest-Bot1

- Created this file.
- Visual QA 01–15 with mp4s + stills; loudness re-probe.
- Updated 16–20 plan + AUDIT-11-15 + NOTES + BOT-TEAM (homes now in git).
- Waiting on teacher `go` for 16–20 or named redos.

### (next bot — add your block here)

```
### YYYY-MM-DD — <bot name>
- Looked at: …
- Agree / disagree with Bot1 on ids: …
- Recipe change proposed: …
```
