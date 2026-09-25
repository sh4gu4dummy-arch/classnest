# ClassNest

Classroom points, Ultra evolutions, shop, and spar. Teachers run it in the
browser or as an Offline APP on a USB stick.

**Bots / next session:** start at [docs/START-HERE.md](docs/START-HERE.md).

## Run (this repo)

**Easiest on your machine:** double-click **`Open-ClassNest.bat`** (Windows) or **`Open-ClassNest.command`** (Mac).
That starts ClassNest on **http://127.0.0.1:3847/** (port **3847**, so it does not fight another app on 8080) and opens the browser.

Or manually:

```bash
npm install
npm run dev:local
```

Open [http://127.0.0.1:3847](http://127.0.0.1:3847/).

(`npm run dev` still uses port **8080** for the shared live-preview setup.)

## Offline APP (Windows)

1. Download **Offline APP** (~4 MB) from the in-app Backup & downloads page.
2. First time only: also download **Avatar media** and unzip it next to `index.html`.
3. Double-click `Start-ClassNest.bat`. Nothing else to install (no Python).

Later app updates: download the small Offline APP zip only. Keep your `avatars` folder.

## Notes

- Character art lives in `public/avatars/`.
- Built zip packs are not in this GitHub repo (they are bigger than GitHub allows). Get them from the running app’s download page.
