# Run-from-clone launcher (v0.142)

Ash keeps only the git clone on the Windows PC and runs ClassNest straight
from it. No zip, no Node/npm, no Python, no admin.

## How Ash opens it

1. `git pull` in the ClassNest folder.
2. Double-click `Start-ClassNest.bat` (repo root). Leave the window open.
3. Browser opens http://127.0.0.1:8765/ (8766–8768 if busy; the window prints it).

Saved classes are stored by the browser **per address**. 127.0.0.1:8765 is the
same address the Offline APP zip used, so the same classes appear. If a fallback
port is used (8766+), that address starts empty — close the other ClassNest
window and start again, or export/import a JSON backup.

## How it works

- `offline/` — committed prebuilt SPA (`index.html`, `assets/`, `VERSION`),
  built with `vite.portable.config.ts` + `VITE_PORTABLE=true` (IS_PORTABLE),
  no source maps. ~1.3 MB.
- `Start-ClassNest.bat` — checks `offline\index.html` exists, then runs
  `powershell -NoProfile -ExecutionPolicy Bypass -File scripts\serve-offline.ps1`;
  pauses with a message on failure.
- `scripts/serve-offline.ps1` — tiny HTTP server compiled with `Add-Type`
  (C#, .NET Framework — works in Windows PowerShell 5.1 and pwsh 7). Binds
  127.0.0.1 only. Lookup order per request: `offline/` then `public/`
  (so `/avatars/...`, `/shop/...`, `/celebrations/...` come from `public/`,
  including untracked local media like `public/avatars/ultra/scrub/`).
  Paths with no extension that match no file (deep links like
  `/class/<id>/student/<id>`) get `offline/index.html`. Range requests (video
  seeking), HEAD, `..` traversal → 403. Set `CLASSNEST_NO_BROWSER=1` to skip
  opening the browser (testing).

## Refreshing the build (every version bump)

```
npm run build:offline     # rebuilds offline/ from current src
git add offline
```

`scripts/push-github.sh` refuses to push if `offline/VERSION` != `VERSION` or
if `offline/` has uncommitted changes. Old hashed files are removed on each
build (assets/ is wiped first), so the folder does not grow.

## What was removed / moved in v0.142 (and why)

- `ClassNest.url` (root) — removed. Pointed at a fixed port and only worked if
  a server was already running; `Start-ClassNest.bat` opens the browser itself.
- `Open-ClassNest.bat`, `Open-ClassNest.command` (root) — moved to
  `scripts/dev/Open-ClassNest-dev.bat` / `.command` (developer-only Vite server
  on 3847, needs Node + npm). Kept so developers still have them; out of the
  root so teachers do not double-click the wrong one.
- Kept: `public/offline-app/` launchers (`Start-ClassNest.bat`,
  `start-classnest.ps1`, `Start-ClassNest.command`, `serve.py`, `router.php`,
  `README.txt`) — `scripts/build-portable.mjs` copies them into the Offline APP
  zip. The zip path is unchanged.

## Open items

- `public/offline-app/avatars/` — 326 tracked old avatar copies (~146 MB) from
  v0.045, unused by the app (nothing references `/offline-app/avatars`) but
  inside Vite's `public/`, so they are copied into every web build. Not removed
  (not a launcher; deletion needs Ash's OK). Candidate for `git rm -r --cached`.
- `public/offline-app/index.html` — old "This is not the Offline APP" stub page.
- The in-app "code" download link points at a code zip that doesn't exist
  (`pack:code` not run since v0.133).
- Only tested with pwsh 7.4 on Linux, not Windows PowerShell 5.1 on real
  Windows (the C# is C# 5–compatible, same pattern as the zip's working
  start-classnest.ps1).
- No favicon in the portable build (harmless `favicon.ico` 404).
- Mac: out of scope (Windows only).
