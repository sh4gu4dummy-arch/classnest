# ClassNest local preview + art review (local only)

One page to browse all of ClassNest's local-only art and CONFIRM / REMAKE / comment on it.
It works like the Number Pictures review. It also serves the ClassNest app itself at `/app/`.
It only reads the repo clone (`/workspace/classnest-audit`) and never writes to it.

## Run
    cd /workspace/classnest-review
    setsid nohup node server.mjs > server.log 2>&1 < /dev/null &

- Node only, no installs. Listens on 127.0.0.1:8931 (`PORT`, `HOST`, `REPO` env vars override).
- The cloudflared quick tunnel points at 8931. Don't restart it unless it is dead ("Tunnel not found").
- Restart the server with `pkill -f "node server.mjs"`, then run the line above again.

## Page structure
| URL | What |
| --- | --- |
| `/` (`#/`) | **Sets** home: "Open app" card, Review sets (cover, counts, SHIPPED badge), all 75 Ultras as tiles (search by name or number) |
| `/#/set/<id>` | One set. "← All sets", filters (All / To review / Confirm / Remake / Commented), grouped cards with Approve, Reject, one-tap remake reasons, comment, history |
| `/#/summary` (or `/summary`) | Approved / Rejected / Commented lists plus the paste text |
| Lightbox | Tap any picture or video: in-page modal, ✕ / tap outside / Esc to close, ‹ › buttons, ←/→ keys or swipe to step through the visible items, CONFIRM / REMAKE… at the bottom. It never changes the URL or history |
| `/app/` | The real ClassNest app (`app-build/`, built with base `/app/`). Media comes from the repo's `public/`. Saved classes are per browser |
| `/trial/` | The old static Riftstallion gallery |
| `/api/sets`, `/api/verdicts` | JSON (GET; POST `{key, entry}` to `/api/verdicts`, newest wins, `entry: null` = tombstone; POST `{keys}` to `/api/verdicts/clear`; GET `/api/meta` = app version) |

Rebuild `/app/` after a `git pull` or a version bump with `./build-app.sh`. It builds in /tmp from the clone and never writes to the repo.

## Kinds of sets
1. **Hand-made**: `sets/<id>/set.json` with groups and items (e.g. `riftstallion-35`).
2. **Auto folder**: `set.json` with `"auto": true` and `"root"`. Every image or video under root is listed, grouped by subfolder, and new files appear on reload (e.g. `emberpuff-drafts`).
3. **Ultras (generated)**: one set per Ultra, read live from the repo.
   - Names come from `src/lib/avatars.ts`.
   - Each set has s1/s2/s3 stills, the Home film, and every 5th Home scrub frame (scrub is local-only and gitignored).
   - Set id `ultra-NN`.

```json
{
  "id": "mossback-24",
  "title": "Mossback #24",
  "blurb": "Shown above the cards",
  "root": "/workspace/mossback-trial",
  "created": "2026-10-22",
  "aspect": "1",
  "groups": [{"id": "new", "title": "New picks"}],
  "items": [
    {"id": "pick-s2", "group": "new", "title": "Adolescent pick", "file": "picks/24-s2.jpg", "note": "optional"},
    {"id": "clip", "group": "new", "title": "Test clip", "file": "test.mp4", "kind": "video", "poster": "frames/t0.jpg"},
    {"id": "live-s3", "group": "new", "title": "In the app now", "url": "/avatars/ultra/24-s3.jpg", "shipped": "v0.150"}
  ]
}
```
- `file` / `poster` / `thumb` are relative to `root`, or to the set folder if there is no `root`.
- `url` is a site path, e.g. a live repo file under `/avatars/`.
- `shipped` shows a SHIPPED badge. Item ids are unique per set (letters, digits, `.`, `_`, `-`).

## Review v2 (works like Number Pictures)
- **Done = one source:** `shipped` or `done` on an item, its group, or its set (`set.json`), or `shipped` on a verdict. Done items only show under the **Shipped / done** and **All** filters. Shipped sets collapse on Home under **Shipped (n)**. `partial` on a set is just a badge.
- **Default filter is To review:** not done and undecided. Other filters: Confirm, Remake, Commented, Sent, Shipped / done, All.
- **Art stamps:** the server sends `it.stamp` (12-char sha1 of the file, cached by size+mtime) for every item. Each verdict stores the stamp it was made on. When the art changes, the old verdict becomes a tombstone `{cleared:true, stale:true}` (on GET and on load) and the item goes back to To review. `history.jsonl` logs those drops and every send.
- **Clear after copy:** a successful copy calls `POST /api/verdicts/clear {keys, at, sent:true}`. That writes tombstones `{cleared:true, sent:{vote,reasons,comment,at}, stamp, updatedAt}`. Sent items stay out of To review (Sent filter) until their art changes. `POST /api/verdicts` is newest-`updatedAt`-wins and refuses entries for old art, so an old tab can't bring anything back. Clearing a verdict also writes a tombstone instead of deleting.
- **Cards and lightbox:** the newest reason is pinned under the title. CONFIRM / REMAKE… where REMAKE opens a full-width reason menu, and one tap applies, closes and moves on. There's a separate Clear button, a comment box that saves on every keystroke, and an Undo toast. The lightbox shows the verdict and the last history line, and jumps to the next undecided item after a vote.
- Re-read `verdicts.json` right before every write (the server does). Other workers may hand-edit it.

## Where verdicts live
1. Browser localStorage key `classnest-review-v1` (primary, like NP's `number-pictures-v5`).
   - Each entry is `{vote:'yes'|'no'|null, reasons[], comment, history[], updatedAt}`.
2. Server backup: `verdicts.json` here, written on every change. Keys are `"<set-id>/<item-id>"`.
   - On load, the browser and the server merge (the newer `updatedAt` wins), so a fresh phone gets everything back.

## Rules (Ash)
- **CONFIRM** (Approve) = ship to main.
- **REMAKE** (Reject) = stays local until confirmed.
- A remake-reason chip sets REMAKE in one tap, with no confirm step.

## Copy format (what Ash pastes into chat; only pending, not shipped/done items)
    ClassNest v0.148
    CONFIRM
    <Set title>: id, id — comment
    REMAKE
    <Set title>: id — reason; reason; comment
    COMMENT
    <Set title>: id — comment
- Copy (bar button, Summary button, or tap the text) tries navigator.clipboard, then an off-screen readonly textarea (focus/select/setSelectionRange/execCommand). It never opens the share sheet.
- If both fail, Summary shows the text plus an "I copied it — clear these" button. With nothing pending, it shows "Nothing to send" and Copy is disabled.

## Static copy for GitHub Pages (no tunnel)
The box pauses when no bot is working, so any tunnel to it dies (Error 1033). `build-pages.sh` makes a static copy of this page that can live on GitHub Pages under a **separate dummy account/repo** (not the ClassNest repo). Ash OK'd draft art being public.

    ./build-pages.sh                       # -> pages-dist/  (~101 MB, ~930 files)
    ./publish-pages.sh <pages-repo-clone>  # rebuild, mirror into the clone, commit, normal push (never --force)
    URL=http://127.0.0.1:8941/review-test/ node test/pages-test.cjs   # phone-size headless check

- **How it builds:** `build-pages.py` reads `/api/sets`, `/api/meta` and `/api/verdicts` from the running server on 8931, or from a temporary one on 8939 if that is down. It fetches every image through the server, so the copy matches the local page exactly, including stamps. It doesn't include `/app/`.
- **Output:** `index.html` (with `STATIC_BUILD = true`), `data/sets.json`, `data/meta.json` (`static:true`, version, builtAt), `data/verdicts.json`, `m/` (lightbox media), `t/` (480px thumbs for cards, tiles, covers and posters), and `.nojekyll`. Files are named by content hash, so duplicates are stored once. Every path is relative, so it works under `https://<user>.github.io/<repo>/`.
- **Sizes:**
  - Review sets: 1400px at q82.
  - Ultra stills: 960px at q78.
  - Cards: 480px at q75.
  - Home films: x264 CRF 36 (`VIDEO_CRF`).
  - Ultra scrub stills are left out by default. `SKIP_GROUPS=` (empty) puts them back, adding about 50 MB.
  - `pages-cache/` holds the encoded files keyed by content, which makes rebuilds take about 10s. Unused entries are pruned on every build.
- **Static mode in the page:** it turns on when `STATIC_BUILD` is set, or automatically when `/api/sets` can't be reached.
  - Votes, reasons and comments are saved only in that browser's localStorage (`classnest-review-v1`, each entry with its art stamp).
  - `data/verdicts.json` is merged in as a read-only baseline, so items already shipped, sent or cleared stay hidden.
  - Copy works the same: it copies the text, then the copied verdicts become local tombstones.
  - Server mode is unchanged.
- **After Ash pastes a review:** apply it as usual. Write it to `verdicts.json` here (shipped/sent) or change the art, then run `./publish-pages.sh` again so the online copy hides those items for everyone.
- **TODO (remote/auth):** create the dummy account and Pages repo, clone it, then set `PAGES_REMOTE` (default `origin`) and `PAGES_BRANCH` (default `main`). Turn on Settings → Pages → Deploy from branch, `/ (root)`. Auth uses a token for that account only, through a credential helper or `GIT_ASKPASS`. **Never** use the ClassNest PAT, and never put the token in the URL. The script refuses to publish into the ClassNest clone.

## Review v3 layout: stages, NOW IN APP vs DRAFT (Oct 22)
- **Item fields:**
  - `stage` (1 Hatchling, 2 Adolescent, 3 Legend)
  - `role`: `current` (the art in the app now, never votable), `draft` (votable) or `reference` (sheets, no vote; shown under Extras)
  - `letter` (A, B, C…), `pick` (`bot`, `alt` or `runner-up`), `desc` (one-line description) and `note`
- **Stage layout:** any set with `stage` items is shown in sections "Stage N · Name". Each section starts with the current art, badged "NOW IN APP", or "NOW · style reference, not changing" when that stage has no drafts. After it come the drafts, badged "DRAFT · would replace <Stage>", with a letter circle and a ★ Bot pick / Alt pick / Runner-up tag. The current art always shows; only drafts follow the filter.
- **Headline:** generated, e.g. "Quartzarch #48: pick a new Adolescent and Legend. Hatchling stays." `headline` in set.json overrides it. The old blurb moved to `details`, shown under a collapsed Details.
- **Auto folder sets:** `itemRules` is a list of `{match: regex on file, ...fields}` where the first match wins and `$1` takes the regex group. `autoLetters: true` gives drafts letters in file order (see emberpuff-drafts).
- **Ultra sets** are reference only. s1-s3 are `current`, there are no vote buttons or filters, and they never count toward To review.
- **Labels:** drafts are labelled "<Stage> <Letter>", and the copy text reads `Quartzarch #48: Adolescent A (pick-s2-A)`.
- **Home sections:** Waiting for your vote, Done (shipped sets) and Browse all Ultras (current art, nothing to vote).
- **Duplicates removed:** in the four remake sets, the 1024px `adol-X` / `legend-X` duplicates of the 1408px `pick-sN-X` files were dropped. The original set.json files are in `backup-sets-*/`.
- **Tests:** `node test/pages-test.cjs` runs the full static test. Add `READONLY=1 URL=http://127.0.0.1:8931/` for local server mode without voting.

## Keep current (v0.148)

- Any open stage row with current art AND drafts gets a virtual vote item `keep-sN` (generic, built in `normalize()`; nothing to add in set.json). The NOW IN APP card shows **✓ CONFIRM: Keep current**.
- It is mutually exclusive with CONFIRM on that stage's drafts (picking one switches the other off; Undo restores both). When kept, the stage's drafts leave To review.
- Copies as e.g. `Quartzarch #48: Keep current Adolescent (keep-s2)`.
- Not shown on Hatchling "style reference" cards (no drafts), shipped/decided stages, or Ultra sets. Lightbox stays non-voting on current art.

## REJECT (v0.148)

- Every open draft card (all sets, generic) has **✓ CONFIRM · ✕ REMAKE… · ⊘ REJECT** in one row (each button ≥ 44 px tall; the row fits a 390 px phone). The lightbox has REJECT too. NOW / Hatchling / Keep current cards never get REJECT.
- REJECT = "I don't want this one". Ash can reject **any number** of drafts in a stage. CONFIRM (a draft or Keep current) stays **one per stage**: confirming another draft or Keep switches the earlier CONFIRM off.
- One verdict per draft: REJECT on a confirmed draft clears that CONFIRM, and CONFIRM on a rejected draft clears its REJECT. Tapping REJECT again un-rejects. Every step has Undo in the toast.
- Rejected cards are dimmed and dashed red with a red **REJECTED** tag, and leave **To review** (find them under the **Reject** filter).
- Drafts already rejected in set.json (`"rejected": "reason"` or `"done": "rejected: …"`, e.g. Quartzarch A–D "too girly") show the same REJECTED look.
- Copy text gets a REJECT section after CONFIRM / REMAKE and before COMMENT, on Home's tap-to-copy box, the Summary tab and per set, e.g.

  ```
  ClassNest v0.148
  REJECT
  Quartzarch #48: Adolescent E (adol-E)
  ```
- Stored as `vote: "reject"` in verdicts.json (server.mjs history says "SENT REJECT").
