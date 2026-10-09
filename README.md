# ClassNest

Classroom points, Ultra evolutions, shop, and spar. Teachers run it in the
browser or as an Offline APP on a USB stick.

**Bots / next session:** start at [docs/START-HERE.md](docs/START-HERE.md).

## Teachers: open ClassNest (Windows, nothing to install)

1. Download the **Offline APP** zip (~13 MB) and unzip it all the way.
2. Copy your existing `avatars` folder in next to `index.html`
   (first time only: unzip the **Avatar media** zip there instead).
3. Double-click **`Start-ClassNest.bat`**. Leave that window open.
   ClassNest opens at **http://127.0.0.1:8765/** (if 8765 is busy it uses 8766–8768;
   the window prints the address). No Node, no Python, no npm.

Later app updates: download the new Offline APP zip only and copy your `avatars` folder in.
The app zip does **not** include avatar pictures/videos.

## Developers only (needs Node.js + `npm install`)

`Open-ClassNest.bat` / `Open-ClassNest.command`, `npm run dev:local`, and
**http://127.0.0.1:3847/** are the **developer** server. They need Node.js and an
`npm install`; teachers should not use them. Nothing listens on 3847 unless that
dev server is running.

```bash
npm install
npm run dev:local      # http://127.0.0.1:3847/
```

(`npm run dev` still uses port **8080** for the shared live-preview setup.)

Rebuild the Offline APP zip: `node scripts/build-portable.mjs --portable --skip-avatars`
(writes `public/downloads/classnest-v{VERSION}-{stamp}-portable.zip`, gitignored).

## Notes

- Character art lives in `public/avatars/`.
- Built zip packs are not in this GitHub repo (they are bigger than GitHub allows). Get them from the running app’s download page.
