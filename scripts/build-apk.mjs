#!/usr/bin/env node
/**
 * Sideloadable ClassNest APK — WebView wrapping the portable offline app.
 *
 * Requires cached Android build-tools in .cache/android-lite (downloaded once).
 */
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
  cpSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const cache = join(root, ".cache", "android-lite");
const bt = join(cache, "build-tools", "android-14");
const androidJar = join(cache, "platform", "android-34", "android.jar");
const androidDir = join(root, "scripts", "android");

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    ...opts,
  });
  if (r.status !== 0) {
    const err = (r.stderr || r.stdout || "").slice(-2000);
    throw new Error(`${cmd} ${args.join(" ")} failed (${r.status})\n${err}`);
  }
  return r;
}

function versionCodeOf(version) {
  const m = String(version).match(/(\d+)\.(\d+)/);
  if (!m) return 1;
  return Number(m[1]) * 1000 + Number(m[2]);
}

export async function buildApk({ version, stamp, wwwDir, outPath }) {
  if (!existsSync(join(bt, "aapt2")) || !existsSync(androidJar)) {
    throw new Error("Android build-tools missing in .cache/android-lite");
  }
  if (!existsSync(wwwDir)) throw new Error("Missing portable www: " + wwwDir);

  const work = join(root, "tmp_images", "apk-build");
  rmSync(work, { recursive: true, force: true });
  mkdirSync(join(work, "res", "mipmap-xxxhdpi"), { recursive: true });
  mkdirSync(join(work, "java", "app", "classnest", "classroom"), { recursive: true });
  mkdirSync(join(work, "assets", "www"), { recursive: true });
  mkdirSync(dirname(outPath), { recursive: true });

  cpSync(join(androidDir, "ic_launcher.png"), join(work, "res", "mipmap-xxxhdpi", "ic_launcher.png"));
  cpSync(wwwDir, join(work, "assets", "www"), { recursive: true });

  const code = versionCodeOf(version);
  const manifest = readFileSync(join(androidDir, "AndroidManifest.xml"), "utf8")
    .replace(/android:versionCode="[^"]+"/, `android:versionCode="${code}"`)
    .replace(/android:versionName="[^"]+"/, `android:versionName="${version}"`);
  writeFileSync(join(work, "AndroidManifest.xml"), manifest);

  const compiled = join(work, "compiled.zip");
  run(join(bt, "aapt2"), [
    "compile",
    "--dir",
    join(work, "res"),
    "-o",
    compiled,
  ]);

  const linked = join(work, "linked.apk");
  const gen = join(work, "gen");
  mkdirSync(gen, { recursive: true });
  run(join(bt, "aapt2"), [
    "link",
    "-o",
    linked,
    "--manifest",
    join(work, "AndroidManifest.xml"),
    "-I",
    androidJar,
    "--java",
    gen,
    "--min-sdk-version",
    "24",
    "--target-sdk-version",
    "34",
    "--version-code",
    String(code),
    "--version-name",
    version,
    "--auto-add-overlay",
    compiled,
  ]);

  const javaSrc = join(work, "java", "app", "classnest", "classroom", "MainActivity.java");
  cpSync(join(androidDir, "MainActivity.java"), javaSrc);
  const classes = join(work, "classes");
  mkdirSync(classes, { recursive: true });
  run("javac", [
    "-encoding",
    "UTF-8",
    "-source",
    "1.8",
    "-target",
    "1.8",
    "-bootclasspath",
    androidJar,
    "-d",
    classes,
    javaSrc,
  ]);

  const dexDir = join(work, "dex");
  mkdirSync(dexDir, { recursive: true });
  run(join(bt, "d8"), [
    "--lib",
    androidJar,
    "--min-api",
    "24",
    "--output",
    dexDir,
    join(classes, "app", "classnest", "classroom", "MainActivity.class"),
  ]);

  // linked.apk is a zip — add classes.dex + assets
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(readFileSync(linked));
  zip.file("classes.dex", readFileSync(join(dexDir, "classes.dex")));

  const walk = (dir, prefix) => {
    for (const name of readdirSync(dir)) {
      const abs = join(dir, name);
      const rel = `${prefix}/${name}`.replace(/\\/g, "/");
      if (statSync(abs).isDirectory()) walk(abs, rel);
      else zip.file(rel, readFileSync(abs));
    }
  };
  walk(join(work, "assets"), "assets");

  const unsigned = join(work, "unsigned.apk");
  const buf = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
  writeFileSync(unsigned, buf);

  const aligned = join(work, "aligned.apk");
  run(join(bt, "zipalign"), ["-f", "4", unsigned, aligned]);

  const keystore = join(androidDir, "classnest.keystore");
  run(join(bt, "apksigner"), [
    "sign",
    "--ks",
    keystore,
    "--ks-key-alias",
    "classnest",
    "--ks-pass",
    "pass:classnest",
    "--key-pass",
    "pass:classnest",
    "--out",
    outPath,
    aligned,
  ]);
  run(join(bt, "apksigner"), ["verify", "--verbose", outPath]);

  const bytes = statSync(outPath).size;
  return {
    file: outPath.split("/").pop(),
    href: `/downloads/${outPath.split("/").pop()}`,
    bytes,
    stamp,
    version,
  };
}

if (process.argv[1] && process.argv[1].endsWith("build-apk.mjs") && process.argv[2] === "--self-test") {
  console.log("apk helper loaded");
}
