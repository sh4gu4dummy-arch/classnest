# ClassNest

Classroom points, Ultra evolutions, shop, and spar. Teachers run it in the
browser or as an Offline APP on a USB stick.

**Bots / next session:** start at [docs/START-HERE.md](docs/START-HERE.md).

## Teachers: open ClassNest (Windows, nothing to install)

1. **Clone or pull** this repo (`git pull` in your ClassNest folder).
2. Double-click **`Start-ClassNest.bat`** in the repo folder. Leave that window open.
3. ClassNest opens at **http://127.0.0.1:8765/** (if 8765 is busy it uses 8766–8768;
   the window prints the address). No zip, no Node, no npm, no Python.

The app is prebuilt in `offline/`. Pictures and videos come straight from
`public/avatars/` (so local-only clips/scrub frames you drop there also work).

Saved classes live in the browser **per address**: 127.0.0.1:8765 shows the same
classes as the earlier portable zip app on 8765. A different port (e.g. 8766)
starts empty; use Backup & downloads to export/import a JSON backup if needed.

### Offline APP zip (still supported)

For a USB stick / a PC without the repo: download the **Offline APP** zip (~13 MB),
unzip it, copy your `avatars` folder next to `index.html`, double-click its own
`Start-ClassNest.bat` (also 127.0.0.1:8765). The zip does not include avatars.

## Developers only (needs Node.js + `npm install`)

`scripts/dev/Open-ClassNest-dev.bat` / `.command`, `npm run dev:local`, and
**http://127.0.0.1:3847/** are the **developer** server. They need Node.js and an
`npm install`; teachers should not use them. Nothing listens on 3847 unless that
dev server is running.

```bash
npm install
npm run dev:local      # http://127.0.0.1:3847/
```

(`npm run dev` still uses port **8080** for the shared live-preview setup.)

Every version bump: `npm run build:offline` and commit `offline/`
(`scripts/push-github.sh` refuses to push if `offline/VERSION` != `VERSION`).
See [docs/offline-launcher.md](docs/offline-launcher.md).

Rebuild the Offline APP zip: `node scripts/build-portable.mjs --portable --skip-avatars`
(writes `public/downloads/classnest-v{VERSION}-{stamp}-portable.zip`, gitignored).

## Notes

- Character art lives in `public/avatars/`.
- Built zip packs are not in this GitHub repo (they are bigger than GitHub allows). Get them from the running app’s download page.
