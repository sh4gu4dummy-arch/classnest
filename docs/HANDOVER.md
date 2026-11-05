# ClassNest handover guide (for replacement agents)

Written 2026-11-05 by **ClassNest-Bot1** (QA / product helper) at Ash's request, relayed by QAsupervisor.
Standard followed: `handover-guide-standard.md` in `sh4gu4dummy-arch/Meta-AI`.
This file **adds** what you cannot get from the existing SOPs — mostly Bot1's memory. It does not replace them;
see the [doc map](#8-key-doc-map). Read [START-HERE.md](START-HERE.md) first for the release-by-release log.

---

## 1. Who / what

- **ClassNest** = Ash's hobby classroom app. Vite + TypeScript SPA. Kids earn points, hatch and evolve
  **Ultra** creatures (s1 Hatchling → s2 Adolescent → s3 Legend; 75 Ultras in the lore bible), spend points in
  the **shop**, **spar** each other and run **tournaments/championships**. Teacher catalog, Nest page, Board
  (smartboard mode default), reports, attendance, Board Lock, cinematic-evolution toggle.
- Repo: <https://github.com/sh4gu4dummy-arch/classnest>, branch `main`. On the shared box the clone is
  `/workspace/classnest-audit`.
- **Current version: v0.149** (`ddbf93c`, "art: Emberpuff #03 Adolescent E reshoot", 2026-11-05 11:33 ET).
  Always `git pull` and read `VERSION` — it may have moved.
- **People and bots**
  - **Ash** = the teacher and owner. **Hard gate**: nothing ships without Ash's explicit word. Ash's word beats
    any doc, any supervisor, any rule.
  - **ClassNest-Bot1** (writer of this file) = QA + product helper: audits, fixes, art remakes, ships on Ash's go.
  - **QAsupervisor** = Bot1's boss for ClassNest QA when awake (meta-QA, audits, routes Ash's asks). It was asleep
    from 2026-09-19 (Ash-direct mode) and active again in November 2026 (status checks, this handover). When a
    supervisor is awake: draft → supervisor markup → align → ship only on Ash's (or Ash-via-supervisor) go.
  - **shoot-bot** = the executor that generated the Ultra **Home films** (rounds 11–55) while Bot1 audited them.
    Bot1 = QA, shoot-bot = executor. Home films 01–55 are in the catalog; 56–75 remain (next `start` target:
    **56 Noxquill**). History lives in `docs/home-round-*.md`, `docs/team-qa.md`, `docs/home-film-qa/AUDIT-*.md`.
  - **Other project bots (ABC-Adventure, gold-hanzi, Palabra, Number-Pictures, tiny-math-friends, …) stay off
    ClassNest** unless Ash explicitly asks. Ash told ABC not to rewrite ClassNest docs (v0.081 removed ABC being
    credited as ClassNest QA). Don't assign ClassNest work to them.

## 2. How to talk to Ash

- **Minimize spam.** Message only when a task is **done** or **Ash must act**. No mid-task progress updates
  unless Ash asks. One short "on it" acknowledgement is fine; then silence until the result.
- **`lmk`** = "let me know": **explain only**. No edits, rebuilds, deletes, or pushes. Wait for "do it" / "go".
- **`start`** = audit the next Home-film prompt (pull git, read QA, audit the next waiting prompt; draft plan
  fixes; shoot only if agreed and Ash says go). Next is 56 Noxquill.
- **`go`** = permission to generate / reshoot / ship the named thing.
- **`QT`** = the cloudflared **quick tunnel** link to the local preview (see §7). "QT dead" = the tunnel died.
- **Art votes arrive as copy text** from the review page (format in [art-decisions.md](art-decisions.md)):
  `CONFIRM` (ship it), `REMAKE` (+ reason), `REJECT` (don't want that draft; several per stage allowed),
  `COMMENT` (free text, **not a vote**), and **Keep current** (a CONFIRM of the art already in the app).
  The header line `ClassNest v0.NNN` is the version Ash was looking at.
- **Nothing ships until Ash confirms.** For art: draft → review page → Ash CONFIRM → ship.
- After every ship, tell Ash the **new version number** and what changed, in plain words.
- **Never paste verification codes, passwords, or tokens in chat** — not even when Ash asks for a code.
  (2026-10-22: Bot1 refused to paste the GitHub launch code; Ash found it in the AgentMail console.)
- Approval cards: if you're blocked on an approval / Auto-review card (e.g. a push), tell Ash (or QAsupervisor)
  **immediately** what is waiting. Don't sit silent on a card.
- Ash reviews art on a **desktop browser**; kids' devices are phones/boards, so check both.

## 3. Standing Ash rules for ClassNest

Push / git
- Bots may **commit and push to Ash's hobby repos without asking each time.**
- **Never do destructive repo actions without asking Ash first**: force-push, deleting repos or branches,
  `reset --hard` / `clean` that throws away others' work, history rewrites (filter-repo etc.).
- Push only via `sh scripts/push-github.sh` (it refuses Grok/sandbox paths, refuses a commit without
  `docs/START-HERE.md`, and refuses if `offline/VERSION` ≠ `VERSION`).
- **Never commit Grok/sandbox/platform files**: `.grok/`, `startup.sh`, root `AGENTS.md`, `attachments/`,
  `server/`, `scripts/grok-pwa-*`, agent-data, secrets folders, agent-tools output. Only real ClassNest material.
- The GitHub PAT Bot1 uses is **ClassNest-only** (scoped to this repo). Never use it on other repos, never print it.

Versions / builds
- Version labels **v0.NNN**. Bump `VERSION` on **meaningful** pushes (docs-only commits may skip the bump).
- **Every bump: `npm run build:offline` and commit `offline/`.**
- Update `docs/START-HERE.md` on every push (the push script enforces it being in the commit).
- Rebuild portable / full zips / APK **only when asked**.

Runtime / portability
- **Never use port 8080** (note: `npm run dev` / `npm run preview` in package.json default to 8080 — don't use them;
  dev is `npm run dev:local` → 127.0.0.1:3847, developer-only).
- The app must be **portable, Windows-only, no installs**. Ash runs it straight from the git clone:
  `git pull`, double-click root **`Start-ClassNest.bat`** → <http://127.0.0.1:8765/> (falls back 8766–8768),
  served by `scripts/serve-offline.ps1` (PowerShell only, serves `offline/` then `public/`). No zip, no npm.
  No Mac launcher needed. Never send Ash to 3847.
- Don't wipe classroom saves on update. Keep the +10 default skill; don't delete teacher-edited skills.
  Sounds on by default; smartboard mode default.
- **Don't delete local-only files without asking** (drafts, clips, scrub stills, backups).
- Never delete/overwrite Ultra videos or stills without a yes (see `AGENTS.project.md`).

Art (Ultra evolutions) — full log in [art-decisions.md](art-decisions.md)
- Keep the **Hatchling's soft, cute style** (warm, uncluttered, friendly faces; no dark/moody/scowling).
- **Legends need a dramatic change.** Stages may differ a lot if resemblance + theme hold.
- **Quartzarch #48's Adolescent must be less girly** (Ash: drafts "changed too girly").
- Ash, 2026-10-22: **"in the future, to reduce spam/waste, only generate one replacement option."** One draft per
  stage that needs a remake. No runners-up.
- **No real-language text on art** (signs, plaques, props) — imaginary rune marks only.
- **Mobile-first**: check at **390×844** first; Ash also reviews on desktop.
- Show **full-size images in a closeable viewer** (lightbox), not blurry screenshots or back-navigation.
- Remade Ultra → its Home film + scrub stills go stale; **reshoot only on Ash's `go`**.

Product
- Show kids' **full names** (first + last) everywhere (v0.143).
- **Quality and creativity beat rigid rules.** If a rule hurts the product or creative result, flag
  QAsupervisor/Ash instead of blind-enforcing.
- The tiny-math-friends **APK/keystore "don't nag" rule doesn't apply here**; ClassNest's Android keystore
  (`scripts/android/classnest.keystore`) is tracked on purpose (private hobby app). Touch APK only when asked.

## 4. Memory dump (Bot1's durable memory, ClassNest-relevant)

Profile facts (how Ash works with Bot1)
- Ash is teacher for ClassNest; Bot1 is QA; shoot-bot is executor (2026-09-17).
- Bot1 only works on ClassNest. Ash approved a GitHub PAT for `sh4gu4dummy-arch/classnest` only (2026-09-17).
- 2026-09-19: QAsupervisor asleep → **Ash-direct**: results, asks and drafts go straight to Ash, minimal
  mid-task spam. If a supervisor returns, resume draft→markup→ship-on-go; Ash's word still wins.
- "lmk" = talk only (all projects). "start" = audit next Home prompt. "QT" = quick tunnel.
- 2026-10-09: Ash doesn't need a Mac launcher. 2026-10-10: Ash wants to run from the git clone, no zip/npm.
- 2026-10-19: full names everywhere.
- 2026-10-22: Ash said many evolutions "are lame"; remake programme: Riftstallion (dark indigo) → Kindlekin →
  Quartzarch, Ironmaw, Mossback, Palevow (Hatchling style, dramatic Legends, own review set each) → Emberpuff.
- 2026-10-22: one replacement option per stage (exact quote above). Quartzarch "too girly".
- 2026-10-22: review pages must make it unmistakable which art is current ("Now in app") vs draft and which stage
  each draft replaces ("Replaces Adolescent"); browse-all galleries separate from voting sets; approve / reject /
  comment buttons modelled on Number-Pictures-Bot1's review page; click-to-copy summary **on the home page**,
  listing only pending items; full-size images in a closeable viewer; the review page should be the standing
  preview for **all** ClassNest art (every Ultra + local drafts).
- 2026-10-22: Ash wanted the QT to last days without keep-alive pings. Root cause found: the box is paused /
  frozen when no bot works, Cloudflare deletes the quick tunnel during the pause (Error 1033). Fix: Ash approved
  a static **GitHub Pages** review site on a **separate dummy account** (draft art being public is OK).
  Ash is wary of GitHub Pages quotas — keep the site lightweight.
- 2026-10-23: "Keep current" button on current art in every open draft row; a **Reject** button on every draft,
  several rejects per stage allowed, rejections reach Bot1 via the copy text. Only one CONFIRM per stage.

Journal facts (project history worth knowing)
- Homes 11–55 shot by shoot-bot and audited by Bot1 (pixel evidence, try to fail clips, twin = two distinct
  heads/bodies only, slideshow = fail, no letters, virtue-action not souvenir-pickup). Home films are **tracked**
  in git (`public/avatars/ultra/homes/*.mp4`); intro/adventure clips are **gitignored**.
- Square s3 busts need a 16:9 home I2I before I2V. Homes 21–25: Quietpaw / Hearthound / Mistfawn / Mossback /
  Softwing. Homes 16–20: Prismite, Junkbyte, Mirthling (NO letters), Abyssrake, Solarox.
- Emberpuff = Ultra 03 (kit → inferno).
- Cinematic evolution (v0.135): toggle uses Home-film scrub frames (3 fps, local/gitignored). Consensus 2026-09-20:
  Home stills are the wrong source for hatch→legend growth; real path stays classic snaps; toggle is experimental.
- v0.133 catalog remembers last pack + recently viewed; v0.136 landscape-wide catalog.
- 2026-10-07/08: v0.139 absent kids excluded from awards; sweep → v0.140 fixed 10 bugs incl. the **tournament
  odd-player stall** (byes via standard seeding, round 1 only, max one per kid; fuzz-tested 1–24 kids).
- 2026-10-09/10: Ash's Firefox got "Unable to connect" on 3847 (the dev server). → v0.141 docs point to the
  portable app on 8765; v0.142 run-from-clone (`Start-ClassNest.bat` + `serve-offline.ps1` + committed `offline/`).
- 2026-10-10: Ash said the app's sound is "terrible and robotic" — still open.
- `public/offline-app/avatars/` (~144–146 MB, 326 files) has been tracked since v0.045 (before that folder was
  gitignored) and is unused. Deleting needs Ash's OK (it would stay in history anyway).
- Portable avatars zip (~416 MB) is not on the box; old portable zip `/workspace/classnest-v0.141-…-portable.zip`.

Shared user facts that affect ClassNest
- Quality + creativity over rigid rules (all projects); flag conflicts instead of blind-enforcing.
- No real-language text in films/stills (all projects).
- Mobile-first ~390×844 (gold-hanzi standing, applied here too).
- Minimize chat spam; message when done or when Ash must act (all project bots).
- Number-Pictures art SOP: use Imagine image generation for remakes; no PIL placeholder "remakes"; if Imagine is
  unavailable, tell Ash.

Open episodes
- Quartzarch Adolescent E vote; review-page REMAKE comment bug (§5); Home film reshoots (§6).

## 5. Current status (checked 2026-11-05 ~11:40 ET)

- **Idle on the app** after shipping v0.149 (Emberpuff #03 Adolescent E). `main` == `origin/main`, working tree
  clean before this docs commit. No unpushed commits on `main`.
- **Last ships:** v0.149 `ddbf93c` (Emberpuff s2), v0.148 `dde4522` (Palevow s2+s3, Quartzarch s3),
  v0.147 `a91dac2` (Ironmaw + Mossback), v0.146 `aa8f8fa` / v0.145 `f2dae89` (Kindlekin), v0.144 `ac6122c`
  (Riftstallion).
- **Review page REMAKE comment bug (in progress at the time of writing).** Symptom (Ash, desktop browser):
  the comment box types fine *before* clicking ✕ REMAKE…, but after clicking REMAKE the text is invisible / the
  box seems dead — yet the text *was* captured (Ash's "asdfadf" comment arrived). Cause found: opening the REMAKE
  menu re-rendered the card and **swapped the comment box for a different one**, so focus/visible text was lost.
  Fix (local, in `/workspace/classnest-review/public/index.html` + `test/pages-test.cjs`): keep the same box in
  place when REMAKE opens (label changes to "Remake reason"), focus it, and drop the smooth scroll that killed
  focus. As of this writing the fix is **built locally but not yet published** — the live site was still at
  `7019e34` (data-only v0.149 update; index.html unchanged). Bot1 promised Ash to verify in a real desktop
  browser with screenshots before asking Ash to retest. Check `git log` of `ashsgrokbot/classnest-review`.
- **Local-only by design / proposed for repo** → §5a and §11.

### 5a. Local-only by design (not in git)

| What | Box path | Size | Why not in git | How to recover |
|---|---|---|---|---|
| Home scrub stills (cinematic toggle) | `public/avatars/ultra/scrub/NN/home/001…045.jpg` (in the clone, gitignored) | ~139 MB, 55 Ultras | Derived data; large | Regenerate from tracked Home films at 3 fps: `mkdir -p public/avatars/ultra/scrub/NN/home && ffmpeg -i public/avatars/ultra/homes/NN.mp4 -vf fps=3 -q:v 3 public/avatars/ultra/scrub/NN/home/%03d.jpg` (15 s → 45 frames, 736×400). 03/24/34/35/38/46/48 are stale anyway. |
| Intro / adventure clips | `public/avatars/ultra/intros/` (75, ~38 MB), `…/adventures/` (~21 MB) | ~59 MB | Ash rule: only Home films are tracked | From the original shoot; ask Ash (has a backup) or copy from the box. Can't be regenerated identically. |
| Remake drafts per Ultra | `/workspace/{riftstallion,kindlekin,quartzarch,ironmaw,mossback,palevow}-trial/` (old/, options/, picks/, sheets) | 7–27 MB each, ~81 MB | Large draft images | Public in the review site repo `ashsgrokbot/classnest-review` (GitHub Pages). Config/scripts proposed for repo (§11). |
| Emberpuff I2I drafts | `/workspace/emberpuff-s1-s2-drafts/` | ~4 MB | Drafts | Public in `ashsgrokbot/classnest-review` (emberpuff-drafts set). |
| Emberpuff ship scratch | `/workspace/emberpuff-ship/` (incl. `backup-v0148-originals`) | ~0.5 MB | Scratch; originals are in git history (v0.148) | `git show dde4522:public/avatars/ultra/03-s2.jpg` |
| Review site build + cache | `/workspace/classnest-review/pages-dist/`, `pages-cache/`, `app-build/` | ~96+96+1.5 MB | Build output | `./build-pages.sh` / `./build-app.sh` |
| Review site publish clone | `/workspace/classnest-pages/` | ~196 MB | It *is* the other repo | `git clone https://github.com/ashsgrokbot/classnest-review` |
| Review tooling source + verdict history | `/workspace/classnest-review/` (scripts, sets, verdicts) | <0.5 MB | Held pending Ash OK | Copy on local branch `handover-recovered` (§11); live copy on box |
| Review screenshots | `/workspace/classnest-shots/`, `/workspace/classnest-review/shot-*.png` | ~29 MB + ~6 MB | QA evidence only | Re-shoot with `test/pages-test.cjs` (`SHOT=`) |
| Old s3 catalog copies (33–50) | `/workspace/classnest-qa/` | ~11 MB | Duplicates of git history | `git log` / `git show <old commit>:public/avatars/ultra/NN-s3.jpg` |
| Code-only zips | `public/downloads/classnest-v0.0xx-*-code.zip` (gitignored) | various | Zip packs stay out of git (100 MB cap) | `npm run pack:code` |
| Old portable zip | `/workspace/classnest-v0.141-20261009-0052-portable.zip` | 13 MB | Release artefact | `npm run pack:portable` |

## 6. Waiting on Ash

| # | Item | What Ash needs to do |
|---|---|---|
| 1 | **Quartzarch #48 Adolescent E** (tough crystal-rock golem) | CONFIRM adol-E, or tap **Keep current**, on the review page |
| 2 | **Home film + scrub reshoots** for **03, 24, 34, 35, 38, 46, 48** (they show old art) | Say `go` (per id or batch) |
| 3 | Delete the unused **`public/offline-app/avatars/`** copies (~146 MB, tracked since v0.045) | Yes/no (stays in history unless a rewrite is separately approved) |
| 4 | App sound is "terrible and robotic" (2026-10-10) | Go-ahead / direction for a sound pass |
| 5 | **No favicon** | OK to add one |
| 6 | **Dead code-zip link** (code-only zip download not rebuilt) | OK to fix/remove |
| 7 | Nest page **Remove / Clear all not lock-gated** via direct URL (Board Lock gap left from v0.140) | OK to fix |
| 8 | **`serve-offline.ps1` not yet tested on real Windows** | Ash to try `Start-ClassNest.bat` and report |
| 9 | Review-page **REMAKE comment bug** (§5) | Nothing until Bot1 (or successor) confirms the fix live; then a quick retest |
| 10 | Held recovered material (§11) | OK to push branch `handover-recovered` (via QAsupervisor) |
| 11 | Home films 56–75 | `start` / `go` (next 56 Noxquill) |

## 7. Desk / preview

- **Ash's app**: `Start-ClassNest.bat` → 127.0.0.1:8765 (8766–8768 fallback). Dev only: `npm run dev:local` →
  127.0.0.1:3847 (needs Node + `npm install`). **Never 8080.**
- **Review site (always up): <https://ashsgrokbot.github.io/classnest-review/>**
  - Static GitHub Pages site, public repo `ashsgrokbot/classnest-review`, branch `main`, served from `/`.
  - Hosted on the **dummy GitHub account `ashsgrokbot`** (created by Ash on their own device after GitHub
    blocked signup from the box IP). Account email: a Bot1 AgentMail inbox ("ClassNest Review"). Its login and its separate gh config live in **Bot1's private secrets folder on the
    box** — ask Ash / QAsupervisor; values are never written down here. Never use the ClassNest PAT for it.
  - Source/tooling: `/workspace/classnest-review/` — `build-pages.sh`/`build-pages.py` (build `pages-dist/`),
    `publish-pages.sh /workspace/classnest-pages "msg"` (mirror + normal push, refuses the ClassNest clone),
    `server.mjs` (local server on 127.0.0.1:8931), `public/index.html` (the page), `sets/*/set.json` (one review
    set per Ultra), `verdicts.json` (read-only baseline of shipped/decided items), `remake-tool.py` (picks, review
    sheet, phone check per Ultra), `test/pages-test.cjs` (headless 390×844 Playwright test: layout, votes, copy
    text).
  - **Static mode:** votes are saved in Ash's browser **localStorage**, keyed by each item's art stamp; results
    reach the bot only via the **Copy** text Ash pastes. After applying a decision, update `verdicts.json`,
    republish.
  - **Caching:** Pages serves `cache-control: max-age=600`; when Ash sees an old page, send a cache-busting link
    (`?v=N`).
  - **Quota caution:** per site ~1 GB, ~100 GB/month bandwidth, ~10 builds/hour. Public repo so free and nothing
    account-wide. Ash is wary — keep it light, batch publishes.
- **Local preview / QT (fragile):** `/workspace/classnest-review/start-preview.sh` restarts the node server and a
  cloudflared quick tunnel; the URL lands in `tunnel-url.txt` (last one:
  `https://wish-tapes-indoor-investigator.trycloudflare.com`). **The box pauses when no bot is working →
  Cloudflare drops the tunnel → Error 1033**; any link pointing at the box (even a redirect) dies the same way.
  `tunnel-keeper.sh` restarts it when the box wakes. Use the Pages site for anything Ash must open later.

## 8. Key doc map

- [START-HERE.md](START-HERE.md) — current version, per-release notes, `start` target, hard stops. Updated every push.
- [`AGENTS.project.md`](../AGENTS.project.md) — standing teacher rules (videos, versions, push, visibility invariant).
- [QA-SUPERVISOR.md](QA-SUPERVISOR.md) — supervisor protocol, Ash-direct mode, shared lessons.
- [BOT-TEAM.md](BOT-TEAM.md) — how to be a useful teammate bot (audit with pixels, disagree in git).
- [team-qa.md](team-qa.md) — shared QA board, roles (shoot bot vs QA bot).
- [art-decisions.md](art-decisions.md) — every evolution CONFIRM/REMAKE/REJECT with Ash's words (**new**).
- [ultra-lore-bible.md](ultra-lore-bible.md) — all 75 Ultras: designs, virtues, stages.
- [ultra-home-films.md](ultra-home-films.md) — Home film recipe, ACTION BAR, anti-twin prevention.
- [imagine-stills.md](imagine-stills.md) — still generation, evolution rule (Ash 2026-10-22).
- [imagine-videos-into-the-app.md](imagine-videos-into-the-app.md) — getting clips into the app.
- [cinematic-evolution-mode.md](cinematic-evolution-mode.md) — scrub toggle plan/status.
- [offline-launcher.md](offline-launcher.md) — run-from-clone launcher, open items.
- `home-round-11-15.md` … `home-round-41-50.md` — Home film round plans; [home-film-qa/](home-film-qa/) — AUDIT
  tables + timestamp stills.

## 9. Secrets & hygiene (locations only, never values)

| Secret | Where | Notes |
|---|---|---|
| ClassNest GitHub PAT (repo-scoped) | Bot1's private secrets folder on the box | Used by `push-github.sh` via gh. ClassNest only. A replacement bot should get its own access from Ash. |
| Review account (`ashsgrokbot`) login + gh config | Bot1's private secrets folder on the box | Ask Ash / QAsupervisor. Never in chat. |
| Review account's AgentMail inbox | AgentMail connector / console | Receives GitHub mail for the dummy account (codes stay out of chat). |
| Android keystore | `scripts/android/classnest.keystore` (tracked on purpose) | Don't touch unless Ash asks. |

- gh scar: an env **`GH_TOKEN`/`GITHUB_TOKEN` overrides the gh login**. To act as `ashsgrokbot`, run gh with
  `GH_TOKEN`/`GITHUB_TOKEN` unset and that account's own `GH_CONFIG_DIR`.
- Never commit `.env*`, tokens, cookies, vault/card data, or bot/platform folders. Grep before pushing:
  `ghp_`, `github_pat_`, `token=`, `password`, `secret`.

## 10. Scars / lessons

- **QT kept dying** (three times on 2026-10-22): box freeze → tunnel deleted → Error 1033. Don't promise a
  permanent box link; use the Pages site.
- **GitHub signup is blocked from the box IP** ("Access is temporarily restricted"); Ash had to create the dummy
  account on their own device.
- **GH_TOKEN env overrides gh login** (see §9).
- **Comment box bugs on the review page:** (1) a redraw dropped the card mid-edit (fixed `6242784`); (2) after a
  refresh Ash still couldn't type → cache; a `?v=N` cache-busting link fixed it; (3) REMAKE swapped the box out
  (§5). Lesson: never replace a focused input on re-render; test in a real desktop browser **and** at 390×844.
- **imagine-image.py auth is missing on the box**, so art drafts were made with the built-in image generation
  tool instead. Follow the Imagine SOP when it works; never PIL placeholders.
- **Sizing per creature:** most Ultras ship s2/s3 at **1408** JPG; some (e.g. **Mossback 24, Emberpuff 03**) ship at
  **768** to match their s1. Match the Hatchling's resolution; always also write the 360 board thumb and the
  `public/offline-app/avatars/` mirror.
- **Tests need updating after each ship** (review-page tests expect specific pending/done items; app tests may
  assert art). Re-run and fix expectations as part of the ship.
- **Lint noise:** `npm run lint` (eslint .) also scans built bundles (`offline/`, `dist-portable/`); judge only
  `src/` findings.
- **Tournament byes (v0.138→v0.140):** odd player counts stalled the championship. Fix: byes only in round 1,
  standard seeding, max one per kid, fuzz-tested 1–24 kids, always ends with a champion.
- **`public/offline-app/avatars/` tracked since v0.045** — a gitignore added later doesn't untrack files.
- **`npm run dev` uses port 8080** — forbidden; use `dev:local`.
- Push script refuses commits without START-HERE — always include a START-HERE touch.
- A COMMENT is not a vote; test strings like "asdfadf" are not feedback.

## 11. Completeness pass (2026-11-05)

Goal (Ash via QAsupervisor): nothing important lives only on Bot1's box.
Ash's follow-up: **push only the docs**; hold everything recovered on a **local branch** until Ash OKs it.

Checked
- `/workspace/classnest-audit` git status/log; `origin/main` in sync.
- `/workspace` for ClassNest folders: `classnest-review`, `classnest-pages`, `classnest-shots`, `classnest-qa`,
  `classnest-handoff`, `emberpuff-s1-s2-drafts`, `emberpuff-ship`, `home-qa-fresh`, the six `*-trial` folders,
  the old portable zip, stray `ultra-home-films.md` / `student-home.tsx` / `live-home*.png` copies (older copies of
  repo files/screenshots).
- Bot1's sandbox: `.grok/` (none in the clone or home), `agent-data/workflows` (three generic Imagine/cutout
  skills — **no ClassNest-specific content**; left out), Bot1's persistent store (empty of ClassNest notes),
  Bot1's attachments/assets (chat uploads/screenshots = platform files; left out), `scripts/imagine-image.py`
  (already in the repo).
- Durable memory (profile, journal, shared facts) → §4 and [art-decisions.md](art-decisions.md).

Pushed now (docs only): `docs/HANDOVER.md`, `docs/art-decisions.md`, link in `docs/START-HERE.md`.

**Proposed for repo, pending Ash OK** — local branch **`handover-recovered`** (worktree
`/workspace/classnest-handover-recovered`, **not pushed**):

| Proposed repo path | From (box) | Size | Why |
|---|---|---|---|
| `tools/review/{server.mjs,build-pages.py,build-pages.sh,publish-pages.sh,start-preview.sh,build-app.sh,tunnel-keeper.sh,remake-tool.py,README.md}` | `/workspace/classnest-review/` | ~70 KB | Review-site tooling; without it the CONFIRM/REMAKE workflow can't be rebuilt |
| `tools/review/public/index.html`, `tools/review/test/pages-test.cjs` | same | ~105 KB | The review page + its 390×844 test (latest live copy may be in `ashsgrokbot/classnest-review`) |
| `tools/review/sets/*/set.json` (7 sets) | `/workspace/classnest-review/sets/` | ~90 KB | Per-Ultra draft lists with descriptions and decisions |
| `tools/review/verdicts.json`, `history.jsonl` | `/workspace/classnest-review/` | ~8 KB | Review decision history |
| `tools/review/trials/{ironmaw,mossback,palevow,quartzarch}/config.json`, `trials/kindlekin/*` (sheet scripts, set/verdict backups), `trials/riftstallion/index.html` | `/workspace/*-trial/` | ~35 KB | Remake configs/notes (no images) |
| `tools/review/RECOVERED.md` | new | 1 KB | Explains paths and what's not included |
| `docs/archive/handoff-2026-09/*.txt` | `/workspace/classnest-handoff/` | ~2 KB | Old Sept handoff blurbs (superseded by START-HERE; kept for history) |
| `docs/home-film-qa/fresh-2026-09/` | `/workspace/home-qa-fresh/` | ~172 KB | Fresh re-check stills for Homes 18/20 + encode stats |
| `.gitignore` += `agent-tools/`, `secrets/`, `.cursor/`, `agent-data/` | new | — | Belt-and-braces against bot/platform files (`.grok/` was already ignored) |

All held files were grepped for tokens/passwords/keys: clean. Deliberately left out: draft images, pages-dist /
pages-cache, scrub stills, intro/adventure clips, Emberpuff draft folder, screenshots, the publish clone,
secrets, agent-data, attachments, generic platform skills.

## 12. Git history cleanup (soft dry-run — suggestions only)

Nothing was rewritten, force-pushed or filtered. Ideas for Ash to decide on, one by one:

1. **`public/offline-app/avatars/`** (326 files, ~144 MB, tracked since v0.045, unused). Step 1 (safe): `git rm -r`
   in a normal commit. Step 2 (only with explicit OK, needs force-push): purge from history to shrink the
   ~373 MB pack.
2. **Superseded Ultra stills** from the remake programme (old s2/s3 for 24, 34, 35, 38, 46, 48, 03 at ~0.5–1.5 MB
   each) live on in history. Small; probably not worth a rewrite.
3. **Home films 01–10** are the biggest blobs (6–16 MB each) but they're current, tracked on purpose. Could be
   re-encoded to a smaller bitrate later (new commit, no rewrite) if repo size matters.
4. No noisy "wip/fixup/oops" commits found (114 commits on `main`).

> Update: the §11 recovered review tooling was merged into `main` under `tools/review/` (refreshed from the live `/workspace/classnest-review` copies where newer).
