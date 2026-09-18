/**
 * App version — keep in sync with /VERSION at project root.
 *
 * Every change:
 *   1. bump APP_VERSION (+ /VERSION + package.json)
 *   2. rebuild code-only zip  (`npm run pack:code`)
 *   3. git commit
 *
 * Rebuild portable (`npm run pack:portable`) or APK (`npm run pack`) only
 * when the teacher asks. Avatar media (`npm run pack:avatars`) only when
 * art/videos change. Those keep PACK_VERSION / AVATARS_VERSION until then.
 * PACK_BUILT_* is written by scripts/build-portable.mjs.
 */
export const APP_VERSION = "0.120";
export const APP_VERSION_LABEL = `v${APP_VERSION}`;

/** True when this is the unzipped Offline APP (no server, no zip downloads). */
export const IS_PORTABLE = import.meta.env.VITE_PORTABLE === "true";

/** Last time the Offline APP (no avatar media) was rebuilt. */
export const PACK_VERSION = "0.048";
export const PACK_VERSION_LABEL = `v${PACK_VERSION}`;

/** Last sideload APK. Independent of the portable zip. */
export const APK_VERSION = "0.025";
export const APK_VERSION_LABEL = `v${APK_VERSION}`;
export const APK_STAMP = "20260819-2117";

/** Avatar pics + videos pack. Re-download only when art changes. */
export const AVATARS_VERSION = "0.035";
export const AVATARS_VERSION_LABEL = `v${AVATARS_VERSION}`;
export const AVATARS_STAMP = "20260830-0614";
export const AVATARS_BUILT_LABEL = "Aug 30, 2026, 6:14 AM MDT";

/** Filled by the pack script — ISO + classroom-local label + compact stamp. */
export const PACK_BUILT_AT = "2026-09-11T14:46:22.306Z";
export const PACK_BUILT_LABEL = "Sep 11, 2026, 8:46 AM MDT";
export const PACK_STAMP = "20260911-0846";
export const CODE_STAMP = "20260917-2325";

function zipName(version: string, kind: string, stamp: string): string {
  return stamp
    ? `classnest-v${version}-${stamp}-${kind}.zip`
    : `classnest-v${version}-${kind}.zip`;
}

function apkName(version: string, stamp: string): string {
  return stamp
    ? `classnest-v${version}-${stamp}.apk`
    : `classnest-v${version}.apk`;
}

/** Versioned download paths under /public/downloads/ */
export const DOWNLOAD_FILES = {
  portable: zipName(PACK_VERSION, "portable", PACK_STAMP),
  avatars: zipName(AVATARS_VERSION, "avatars", AVATARS_STAMP || PACK_STAMP),
  code: zipName(APP_VERSION, "code", CODE_STAMP || PACK_STAMP),
  apk: apkName(APK_VERSION, APK_STAMP),
} as const;

export const DOWNLOAD_HREFS = {
  portable: `/downloads/${DOWNLOAD_FILES.portable}`,
  avatars: `/downloads/${DOWNLOAD_FILES.avatars}`,
  code: `/downloads/${DOWNLOAD_FILES.code}`,
  apk: `/downloads/${DOWNLOAD_FILES.apk}`,
} as const;

export function dataBackupFilename(date = new Date()): string {
  const day = date.toISOString().slice(0, 10);
  return `classnest-v${APP_VERSION}-data-${day}.json`;
}
