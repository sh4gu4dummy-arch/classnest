#!/usr/bin/env node
/**
 * Download packs.
 *
 *   node scripts/build-portable.mjs --code-only
 *     Rebuilds classnest-v{APP}-code.zip only. Run on every version bump.
 *
 *   node scripts/build-portable.mjs --portable
 *     Full ClassNest SPA + art/videos. When the teacher asks.
 *
 *   node scripts/build-portable.mjs
 *     Full rebuild of portable + code + APK. ONLY when the teacher asks.
 */
import {
  existsSync,
  mkdirSync,
  cpSync,
  writeFileSync,
  readFileSync,
  rmSync,
  readdirSync,
  statSync,
  chmodSync,
} from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const downloadsDir = join(publicDir, "downloads");
const staging = join(root, "tmp_images", "portable-build");
const appVerPath = join(root, "src/lib/app-version.ts");

function ensureDir(p) {
  mkdirSync(p, { recursive: true });
}

function denverStamp(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value ?? "";
  const y = get("year");
  const mo = get("month");
  const da = get("day");
  const h = get("hour");
  const mi = get("minute");
  const tz = get("timeZoneName") || "MDT";
  const stamp = `${y}${mo}${da}-${h}${mi}`;
  const label = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(d);
  return {
    iso: d.toISOString(),
    stamp,
    label,
    tz,
  };
}

function zipName(version, kind, stamp) {
  return stamp
    ? `classnest-v${version}-${stamp}-${kind}.zip`
    : `classnest-v${version}-${kind}.zip`;
}

function writePackMeta({
  version,
  packVersion,
  built,
  codeStamp,
  apkVersion,
  apkStamp,
  avatarsVersion,
  avatarsStamp,
  avatarsLabel,
}) {
  if (!existsSync(appVerPath)) return;
  let t = readFileSync(appVerPath, "utf8");
  t = t.replace(
    /export const APP_VERSION = "[^"]+";/,
    `export const APP_VERSION = "${version}";`,
  );
  t = t.replace(
    /export const PACK_VERSION = "[^"]+";/,
    `export const PACK_VERSION = "${packVersion}";`,
  );
  t = t.replace(
    /export const PACK_BUILT_AT = "[^"]*";/,
    `export const PACK_BUILT_AT = "${built.iso}";`,
  );
  t = t.replace(
    /export const PACK_BUILT_LABEL = "[^"]*";/,
    `export const PACK_BUILT_LABEL = "${built.label}";`,
  );
  t = t.replace(
    /export const PACK_STAMP = "[^"]*";/,
    `export const PACK_STAMP = "${built.stamp}";`,
  );
  if (codeStamp != null) {
    t = t.replace(
      /export const CODE_STAMP = "[^"]*";/,
      `export const CODE_STAMP = "${codeStamp}";`,
    );
  }
  if (apkVersion != null) {
    t = t.replace(
      /export const APK_VERSION = "[^"]+";/,
      `export const APK_VERSION = "${apkVersion}";`,
    );
  }
  if (apkStamp != null) {
    t = t.replace(
      /export const APK_STAMP = "[^"]*";/,
      `export const APK_STAMP = "${apkStamp}";`,
    );
  }
  if (avatarsVersion != null) {
    t = t.replace(
      /export const AVATARS_VERSION = "[^"]+";/,
      `export const AVATARS_VERSION = "${avatarsVersion}";`,
    );
  }
  if (avatarsStamp != null) {
    t = t.replace(
      /export const AVATARS_STAMP = "[^"]*";/,
      `export const AVATARS_STAMP = "${avatarsStamp}";`,
    );
  }
  if (avatarsLabel != null) {
    t = t.replace(
      /export const AVATARS_BUILT_LABEL = "[^"]*";/,
      `export const AVATARS_BUILT_LABEL = "${avatarsLabel}";`,
    );
  }
  writeFileSync(appVerPath, t);
}

function readVersion() {
  return readFileSync(join(root, "VERSION"), "utf8").trim();
}

function readPackVersion() {
  if (!existsSync(appVerPath)) return readVersion();
  const t = readFileSync(appVerPath, "utf8");
  const m = t.match(/export const PACK_VERSION = "([^"]+)";/);
  return m ? m[1] : readVersion();
}

function loadManifest() {
  const p = join(downloadsDir, "manifest.json");
  if (!existsSync(p)) return { files: {} };
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return { files: {} };
  }
}

function saveManifest(manifest) {
  writeFileSync(
    join(downloadsDir, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
}

function copyTree(src, dest) {
  if (!existsSync(src)) return 0;
  ensureDir(dest);
  cpSync(src, dest, { recursive: true });
  return 1;
}

function walkFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkFiles(p, out);
    else out.push(p);
  }
  return out;
}

async function getJSZip() {
  const require = createRequire(import.meta.url);
  try {
    return require("jszip");
  } catch {
    return (await import("jszip")).default;
  }
}

async function zipFolder(folderPath, zipPath, rootName) {
  const JSZip = await getJSZip();
  const zip = new JSZip();
  const files = walkFiles(folderPath);
  for (const abs of files) {
    const rel = relative(folderPath, abs).replace(/\\/g, "/");
    zip.file(rootName ? `${rootName}/${rel}` : rel, readFileSync(abs));
  }
  const buf = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
  writeFileSync(zipPath, buf);
  return buf.length;
}

function copyImageFiles(srcDir, destDir) {
  if (!existsSync(srcDir)) return 0;
  ensureDir(destDir);
  let n = 0;
  for (const name of readdirSync(srcDir)) {
    if (!/\.(jpe?g|png|webp)$/i.test(name)) continue;
    const p = join(srcDir, name);
    if (!statSync(p).isFile()) continue;
    cpSync(p, join(destDir, name));
    n++;
  }
  return n;
}

function runPortableSpaBuild() {
  console.log("  building full ClassNest SPA (offline)…");
  const r = spawnSync(
    "npx",
    ["vite", "build", "--config", "vite.portable.config.ts"],
    {
      cwd: root,
      env: {
        ...process.env,
        VITE_AUTH_ENABLED: "false",
        VITE_PORTABLE: "true",
      },
      stdio: "inherit",
    },
  );
  if (r.status !== 0) {
    throw new Error("portable SPA build failed");
  }
}

function buildOfflineFolder(version) {
  runPortableSpaBuild();
  const offlineRoot = join(staging, "classnest-portable");
  rmSync(offlineRoot, { recursive: true, force: true });
  ensureDir(offlineRoot);

  const clientDir = join(root, "dist-portable", "client");
  const shell = join(clientDir, "_shell.html");
  if (!existsSync(shell)) throw new Error("Missing dist-portable/client/_shell.html");
  cpSync(shell, join(offlineRoot, "index.html"));
  const assets = join(clientDir, "assets");
  if (!existsSync(assets)) throw new Error("Missing dist-portable/client/assets");
  cpSync(assets, join(offlineRoot, "assets"), { recursive: true });

  for (const f of [
    "Start-ClassNest.bat",
    "start-classnest.ps1",
    "Start-ClassNest.command",
    "serve.py",
    "router.php",
  ]) {
    const s = join(publicDir, "offline-app", f);
    if (existsSync(s)) {
      const dest = join(offlineRoot, f);
      cpSync(s, dest);
      if (f.endsWith(".command") || f.endsWith(".ps1") || f.endsWith(".py")) {
        try { chmodSync(dest, 0o755); } catch { /* windows */ }
      }
    }
  }

  // Shop + celebrations stay with the app (small). Avatar pics/videos are
  // a separate download so app updates stay small.
  for (const dir of ["shop", "celebrations"]) {
    const src = join(publicDir, dir);
    if (existsSync(src)) {
      console.log("  copying", dir, "…");
      cpSync(src, join(offlineRoot, dir), { recursive: true });
    }
  }

  const avatarsDir = join(offlineRoot, "avatars");
  ensureDir(avatarsDir);
  writeFileSync(
    join(avatarsDir, "copy avatar media files here.txt"),
    [
      "Copy avatar media files here.",
      "",
      "Unzip the Avatar media zip into the SAME folder as index.html",
      "(the folder that contains this avatars folder).",
      "",
      "After that you should see:",
      "  avatars/kids/",
      "  avatars/teens/",
      "  avatars/ultra/     (pictures + intro/adventure videos)",
      "",
      "You only re-copy this pack when we add or replace characters.",
      "App updates do not need a new avatar download.",
      "",
    ].join("\n"),
  );

  writeFileSync(
    join(offlineRoot, "README.txt"),
    [
      `ClassNest Offline APP  v${version}`,
      "================================",
      "",
      "This zip is the APP ONLY (board, shop, spar, catalog, reports).",
      "Character pictures and videos are a SEPARATE download.",
      "",
      "FIRST TIME",
      "1. EXTRACT this zip all the way.",
      "2. EXTRACT the Avatar media zip into this SAME folder",
      "   (next to index.html and Start-ClassNest.bat).",
      "   You should then have avatars/kids, avatars/teens, avatars/ultra.",
      "3. Windows: double-click Start-ClassNest.bat  (no Python, nothing to install)",
      "   Mac: double-click Start-ClassNest.command",
      "   Leave that window open. Do not only open index.html.",
      "",
      "LATER APP UPDATES",
      "Download the new Offline APP zip only. Keep your existing avatars",
      "folder (copy it into the new unzipped app). Skip Avatar media unless",
      "we added new characters.",
      "",
      "Import a classroom JSON backup from the home screen if you already",
      "have classes on another computer.",
      "",
    ].join("\n"),
  );
  writeFileSync(join(offlineRoot, "VERSION"), version + "\n");
  writeFileSync(
    join(offlineRoot, "BUILT.txt"),
    `ClassNest v${version}\nBuilt ${new Date().toISOString()}\n`,
  );

  return offlineRoot;
}

async function buildAvatarsZip(version, built) {
  const name = zipName(version, "avatars", built.stamp);
  const src = join(publicDir, "avatars");
  if (!existsSync(src)) throw new Error("Missing public/avatars");
  const stagingAv = join(staging, "classnest-avatars");
  rmSync(stagingAv, { recursive: true, force: true });
  ensureDir(join(stagingAv, "avatars"));
  console.log("  packing avatar pics + videos…");
  cpSync(src, join(stagingAv, "avatars"), { recursive: true });
  writeFileSync(
    join(stagingAv, "avatars", "README.txt"),
    [
      `ClassNest Avatar media  v${version}`,
      "================================",
      "",
      "Unzip this INTO the Offline APP folder (same place as index.html",
      "and Start-ClassNest.bat). You should then have:",
      "",
      "  avatars/kids/",
      "  avatars/teens/",
      "  avatars/ultra/     (pictures + intro/adventure videos)",
      "",
      "Re-download this pack only when we add or replace characters.",
      "App updates use a small zip and keep this folder as-is.",
      "",
    ].join("\n"),
  );
  const outPath = join(downloadsDir, name);
  const bytes = await zipFolder(stagingAv, outPath, "");
  return fileEntry(
    name,
    bytes,
    "Avatar media — unzip next to index.html into avatars/",
    built,
  );
}

function avatarsZipOnDisk(entry) {
  if (!entry?.file) return false;
  return existsSync(join(downloadsDir, entry.file));
}

/** Essential source only — no avatars, zips, offline mirrors, artifacts. */
function buildCodeOnlyFolder(version) {
  const dest = join(staging, "classnest-code");
  rmSync(dest, { recursive: true, force: true });
  ensureDir(dest);

  const files = [
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "vite.config.ts",
    "vite.portable.config.ts",
    "eslint.config.mjs",
    ".prettierrc",
    ".gitignore",
    "startup.sh",
    "VERSION",
    "AGENTS.md",
  ];
  for (const f of files) {
    const s = join(root, f);
    if (existsSync(s)) cpSync(s, join(dest, f));
  }
  copyTree(join(root, "src"), join(dest, "src"));
  copyTree(join(root, "scripts"), join(dest, "scripts"));
  copyTree(join(root, "migrations"), join(dest, "migrations"));

  ensureDir(join(dest, "public"));
  writeFileSync(
    join(dest, "public", "README-ASSETS.txt"),
    [
      "This is the CODE-ONLY package.",
      "Avatar images and celebration GIFs are NOT included.",
      "Use classnest-v" + version + "-codebase.zip for full assets,",
      "or run the online/dev app which serves public/avatars/.",
      "",
    ].join("\n"),
  );

  writeFileSync(
    join(dest, "README.md"),
    [
      `# ClassNest v${version} — code only`,
      "",
      "Essential source to view/build. **No** avatar art or generated packs.",
      "",
      "```bash",
      "npm install",
      "npm run dev",
      "```",
      "",
      "Full assets: `classnest-v" + version + "-codebase.zip`",
      "Offline teacher app: ask for a portable rebuild.",
      "",
    ].join("\n"),
  );
  writeFileSync(join(dest, "VERSION"), version + "\n");
  writeFileSync(
    join(dest, "BUILT.txt"),
    `ClassNest v${version} — code only\n`,
  );
  return dest;
}

/** Full project tree — includes public/avatars, no node_modules. */
function buildCodebaseFolder(version) {
  const dest = join(staging, "classnest-codebase");
  rmSync(dest, { recursive: true, force: true });
  ensureDir(dest);

  const include = [
    "src",
    "scripts",
    "migrations",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "vite.config.ts",
    "vite.portable.config.ts",
    "eslint.config.mjs",
    ".prettierrc",
    ".gitignore",
    "startup.sh",
    "VERSION",
    "AGENTS.md",
  ];
  for (const item of include) {
    const s = join(root, item);
    if (!existsSync(s)) continue;
    cpSync(s, join(dest, item), { recursive: true });
  }

  const pubDest = join(dest, "public");
  ensureDir(pubDest);
  for (const name of readdirSync(publicDir)) {
    if (name === "downloads") continue;
    if (name.endsWith(".zip")) continue;
    cpSync(join(publicDir, name), join(pubDest, name), { recursive: true });
  }

  writeFileSync(
    join(dest, "README.md"),
    [
      `# ClassNest v${version} — full codebase`,
      "",
      "Complete project including avatar art (no node_modules).",
      "",
      "```bash",
      "npm install",
      "npm run dev",
      "```",
      "",
    ].join("\n"),
  );
  writeFileSync(join(dest, "VERSION"), version + "\n");
  writeFileSync(join(dest, "BUILT.txt"), `ClassNest v${version} — full codebase\n`);
  return dest;
}

async function buildCodeZip(version, stamp) {
  const name = zipName(version, "code", stamp);
  const codeRoot = buildCodeOnlyFolder(version);
  writeFileSync(
    join(codeRoot, "BUILT.txt"),
    `ClassNest v${version} — code only\nStamp ${stamp}\n`,
  );
  const codePath = join(downloadsDir, name);
  const bytes = await zipFolder(codeRoot, codePath, `classnest-v${version}-code`);
  return { file: name, href: `/downloads/${name}`, bytes };
}

function fileEntry(file, bytes, description, built) {
  return {
    file,
    href: `/downloads/${file}`,
    bytes,
    description,
    builtAt: built.iso,
    builtLabel: built.label,
    stamp: built.stamp,
    downloadAs: file,
  };
}

async function buildCodeOnly() {
  const version = readVersion();
  const packVersion = readPackVersion();
  const built = denverStamp();
  console.log(`Building code-only ClassNest v${version} (packs stay v${packVersion})…`);
  ensureDir(staging);
  ensureDir(downloadsDir);
  if (existsSync(appVerPath)) {
    let t = readFileSync(appVerPath, "utf8");
    t = t.replace(
      /export const APP_VERSION = "[^"]+";/,
      `export const APP_VERSION = "${version}";`,
    );
    t = t.replace(
      /export const CODE_STAMP = "[^"]*";/,
      `export const CODE_STAMP = "${built.stamp}";`,
    );
    writeFileSync(appVerPath, t);
  }
  const code = await buildCodeZip(version, built.stamp);
  console.log("  ", code.file, `(${(code.bytes / 1024 / 1024).toFixed(2)} MB)`);

  const prev = loadManifest();
  const manifest = {
    name: "classnest",
    version,
    label: `v${version}`,
    packVersion,
    builtAt: built.iso,
    builtLabel: built.label,
    stamp: built.stamp,
    files: {
      ...(prev.files || {}),
      code: fileEntry(code.file, code.bytes, "Source only — no heavy assets", built),
    },
  };
  saveManifest(manifest);
  console.log("Done. code-only", `v${version}`, built.label);
}

async function buildAll() {
  const version = readVersion();
  const built = denverStamp();
  const tag = `v${version}`;
  writePackMeta({
    version,
    packVersion: version,
    built,
    codeStamp: built.stamp,
    apkVersion: version,
    apkStamp: built.stamp,
  });
  console.log(`Building ALL ClassNest ${tag} packs… ${built.label}`);

  ensureDir(staging);
  ensureDir(downloadsDir);

  const names = {
    portable: zipName(version, "portable", built.stamp),
    code: zipName(version, "code", built.stamp),
    codebase: zipName(version, "codebase", built.stamp),
    apk: `classnest-v${version}-${built.stamp}.apk`,
  };

  console.log("1/4 portable app (no avatar media)…");
  const offlineRoot = buildOfflineFolder(version);
  writeFileSync(
    join(offlineRoot, "BUILT.txt"),
    `ClassNest ${tag} Offline APP\nUpdated ${built.label}\n${built.iso}\n`,
  );
  await publishOfflineMirror(offlineRoot);

  const portablePath = join(downloadsDir, names.portable);
  const portableBytes = await zipFolder(offlineRoot, portablePath, "");
  console.log("  ", names.portable, `(${(portableBytes / 1024 / 1024).toFixed(2)} MB)`);

  console.log("2/4 avatar media…");
  const avatarsEntry = await buildAvatarsZip(version, built);
  console.log("  ", avatarsEntry.file, `(${(avatarsEntry.bytes / 1024 / 1024).toFixed(2)} MB)`);
  writePackMeta({
    version,
    packVersion: version,
    built,
    avatarsVersion: version,
    avatarsStamp: built.stamp,
    avatarsLabel: built.label,
  });

  console.log("3/4 code only…");
  const code = await buildCodeZip(version, built.stamp);
  console.log("  ", code.file, `(${(code.bytes / 1024 / 1024).toFixed(2)} MB)`);

  console.log("4/4 APK…");
  let apkEntry = null;
  try {
    const { buildApk } = await import("./build-apk.mjs");
    const apkPath = join(downloadsDir, names.apk);
    const apk = await buildApk({
      version,
      stamp: built.stamp,
      wwwDir: offlineRoot,
      outPath: apkPath,
    });
    console.log("  ", names.apk, `(${(apk.bytes / 1024 / 1024).toFixed(2)} MB)`);
    apkEntry = fileEntry(
      names.apk,
      apk.bytes,
      "Android app — install on a tablet (sideload)",
      built,
    );
  } catch (e) {
    console.error("APK build failed:", e.message || e);
  }

  const manifest = {
    name: "classnest",
    version,
    label: tag,
    packVersion: version,
    builtAt: built.iso,
    builtLabel: built.label,
    stamp: built.stamp,
    files: {
      portable: fileEntry(
        names.portable,
        portableBytes,
        "Offline APP — unzip, then add Avatar media into avatars/",
        built,
      ),
      avatars: avatarsEntry,
      code: fileEntry(code.file, code.bytes, "Source only — no avatars", built),
      ...(apkEntry ? { apk: apkEntry } : {}),
    },
  };
  saveManifest(manifest);

  writeFileSync(
    join(publicDir, "README-PORTABLE.txt"),
    [
      `ClassNest ${tag} — downloads`,
      `Updated ${built.label}`,
      "===========================",
      "",
      `  ${names.portable}  — Offline APP (no avatar media)`,
      `  ${avatarsEntry.file}   — Avatar media (pics + videos)`,
      `  ${names.code}      — source only`,
      `  ${names.apk}       — Android tablet app`,
      "",
      "Everyday: npm run pack:code",
      "Offline APP (small): npm run pack:portable",
      "Avatar media: npm run pack:avatars  (only when art/videos change)",
      "Full packs / APK: only when asked — npm run pack",
      "",
    ].join("\n"),
  );

  for (const stale of [
    "classnest-offline.zip",
    "classnest-source.zip",
    "classnest-portable-kit.zip",
  ]) {
    const p = join(publicDir, stale);
    if (existsSync(p)) {
      try {
        rmSync(p);
        console.log("Removed stale", stale);
      } catch {
        /* ignore */
      }
    }
  }

  console.log("Done.", tag, built.label);
}

async function publishOfflineMirror(offlineRoot) {
  // Do not copy the 400MB SPA+videos into public/offline-app (live preview
  // already IS the full app). Keep launchers/README in public/offline-app.
  if (existsSync(join(offlineRoot, "README.txt"))) {
    cpSync(join(offlineRoot, "README.txt"), join(publicDir, "offline-app", "README.txt"));
  }
}

async function buildPortableOnly() {
  const version = readVersion();
  const built = denverStamp();
  const tag = `v${version}`;
  const forceAvatars = process.argv.includes("--avatars");
  writePackMeta({ version, packVersion: version, built });
  console.log(`Building Offline APP ${tag}… ${built.label}`);
  ensureDir(staging);
  ensureDir(downloadsDir);

  const name = zipName(version, "portable", built.stamp);
  const offlineRoot = buildOfflineFolder(version);
  writeFileSync(
    join(offlineRoot, "BUILT.txt"),
    `ClassNest ${tag} Offline APP\nUpdated ${built.label}\n${built.iso}\n`,
  );
  await publishOfflineMirror(offlineRoot);

  const portablePath = join(downloadsDir, name);
  const portableBytes = await zipFolder(offlineRoot, portablePath, "");
  console.log("  ", name, `(${(portableBytes / 1024 / 1024).toFixed(2)} MB)`);

  const prev = loadManifest();
  const files = { ...(prev.files || {}) };
  delete files.codebase;
  files.portable = fileEntry(
    name,
    portableBytes,
    "Offline APP — unzip, then add Avatar media into avatars/",
    built,
  );

  if (forceAvatars || !avatarsZipOnDisk(files.avatars)) {
    console.log("  building Avatar media pack…");
    const avatarsEntry = await buildAvatarsZip(version, built);
    files.avatars = avatarsEntry;
    writePackMeta({
      version,
      packVersion: version,
      built,
      avatarsVersion: version,
      avatarsStamp: built.stamp,
      avatarsLabel: built.label,
    });
    console.log("  ", avatarsEntry.file, `(${(avatarsEntry.bytes / 1024 / 1024).toFixed(2)} MB)`);
  } else {
    console.log("  keeping", files.avatars.file);
  }

  saveManifest({
    name: "classnest",
    version,
    label: tag,
    packVersion: version,
    builtAt: built.iso,
    builtLabel: built.label,
    stamp: built.stamp,
    files,
  });

  writeFileSync(
    join(publicDir, "README-PORTABLE.txt"),
    [
      `ClassNest ${tag} — downloads`,
      `Updated ${built.label}`,
      "===========================",
      "",
      `  ${name}  — Offline APP (small — no avatar media)`,
      files.avatars
        ? `  ${files.avatars.file}  — Avatar media (pics + videos)`
        : "",
      "",
      "Unzip APP, then unzip Avatar media into the same folder.",
      "Later app updates: download the small APP zip only; keep avatars/.",
      "",
    ].filter(Boolean).join("\n"),
  );
  console.log("Done. portable", tag, built.label);
}

async function buildAvatarsOnly() {
  const version = readVersion();
  const built = denverStamp();
  console.log(`Building Avatar media v${version}… ${built.label}`);
  ensureDir(staging);
  ensureDir(downloadsDir);
  const avatarsEntry = await buildAvatarsZip(version, built);
  writePackMeta({
    version,
    packVersion: readPackVersion(),
    built,
    avatarsVersion: version,
    avatarsStamp: built.stamp,
    avatarsLabel: built.label,
  });
  const prev = loadManifest();
  saveManifest({
    ...prev,
    version,
    label: `v${version}`,
    builtAt: built.iso,
    builtLabel: built.label,
    stamp: built.stamp,
    files: {
      ...(prev.files || {}),
      avatars: avatarsEntry,
    },
  });
  console.log("  ", avatarsEntry.file, `(${(avatarsEntry.bytes / 1024 / 1024).toFixed(2)} MB)`);
  console.log("Done. avatars", `v${version}`, built.label);
}

const codeOnly = process.argv.includes("--code-only");
const portableOnly = process.argv.includes("--portable");
const avatarsOnly = process.argv.includes("--avatars") && !portableOnly;
const run = avatarsOnly
  ? buildAvatarsOnly
  : portableOnly
    ? buildPortableOnly
    : codeOnly
      ? buildCodeOnly
      : buildAll;
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
