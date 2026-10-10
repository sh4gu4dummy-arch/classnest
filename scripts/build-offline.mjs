#!/usr/bin/env node
/**
 * Rebuild the committed run-from-clone app in offline/ (index.html + assets).
 *
 *   npm run build:offline
 *
 * Root Start-ClassNest.bat serves offline/ first and falls back to public/
 * (avatars, shop, celebrations), so no media is duplicated here.
 * Run on EVERY version bump — scripts/push-github.sh refuses to push when
 * offline/VERSION does not match /VERSION.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "offline");
const client = join(root, "dist-portable", "client");
const version = readFileSync(join(root, "VERSION"), "utf8").trim();

const r = spawnSync("npx", ["vite", "build", "--config", "vite.portable.config.ts"], {
  cwd: root,
  env: { ...process.env, VITE_AUTH_ENABLED: "false", VITE_PORTABLE: "true" },
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (r.status !== 0) {
  console.error("offline build failed");
  process.exit(1);
}
const shell = join(client, "_shell.html");
if (!existsSync(shell) || !existsSync(join(client, "assets"))) {
  console.error("Missing dist-portable/client/_shell.html or assets/");
  process.exit(1);
}

mkdirSync(out, { recursive: true });
rmSync(join(out, "assets"), { recursive: true, force: true });
cpSync(shell, join(out, "index.html"));
cpSync(join(client, "assets"), join(out, "assets"), {
  recursive: true,
  filter: (src) => !src.endsWith(".map"),
});
writeFileSync(join(out, "VERSION"), version + "\n");

let bytes = 0;
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else bytes += s.size;
  }
};
walk(out);
console.log(`offline/ rebuilt for v${version} (${(bytes / 1024 / 1024).toFixed(2)} MB)`);
