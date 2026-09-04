/** Lightweight UI prefs (localStorage) — not in class backup. */

const KEYS = {
  sounds: "classnest-sounds",
  soundTip: "classnest-sound-tip-seen",
  lastBackup: "classnest-last-backup-at",
  teacherPin: "classnest-teacher-pin",
  boardLocked: "classnest-board-locked",
  presentation: "classnest-presentation",
  boardSort: "classnest-board-sort",
  boardDensity: "classnest-board-density",
  favoriteSkills: "classnest-favorite-skills-v1",
  lastSkill: "classnest-last-skill-id",
  projector: "classnest-projector",
  smartboard: "classnest-smartboard",
} as const;

export type BoardSort =
  | "name"
  | "points_desc"
  | "points_asc"
  | "today_desc"
  | "seat";

/** Board avatar/card scale — compact projector rows → big showcase faces */
export type BoardDensity = "compact" | "normal" | "showcase";

function get(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function set(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Sounds default ON (full); speaker toggle mutes when needed. */
export function loadSoundsDefaultOff(): boolean {
  const v = get(KEYS.sounds);
  if (v === null) return true; // default on
  return v === "1" || v === "true";
}

export function hasSeenSoundTip(): boolean {
  return get(KEYS.soundTip) === "1";
}

export function markSoundTipSeen() {
  set(KEYS.soundTip, "1");
}

export function markBackupDone(ts = Date.now()) {
  set(KEYS.lastBackup, String(ts));
}

export function lastBackupAt(): number | null {
  const v = get(KEYS.lastBackup);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function backupIsStale(days = 7): boolean {
  const t = lastBackupAt();
  // No file download yet — live autosave still has the classes.
  // Only nag after they have made a file copy and it is older than `days`.
  if (t == null) return false;
  return Date.now() - t > days * 86400000;
}

export function getTeacherPin(): string | null {
  return get(KEYS.teacherPin);
}

export function setTeacherPin(pin: string) {
  const clean = pin.replace(/\D/g, "").slice(0, 6);
  if (clean.length < 4) return false;
  set(KEYS.teacherPin, clean);
  return true;
}

export function clearTeacherPin() {
  remove(KEYS.teacherPin);
  remove(KEYS.boardLocked);
}

export function isBoardLocked(): boolean {
  return get(KEYS.boardLocked) === "1" && !!getTeacherPin();
}

export function setBoardLocked(locked: boolean) {
  if (locked) set(KEYS.boardLocked, "1");
  else remove(KEYS.boardLocked);
}

export function checkPin(pin: string): boolean {
  const stored = getTeacherPin();
  if (!stored) return false;
  return pin.replace(/\D/g, "") === stored;
}

export function isPresentationMode(): boolean {
  return get(KEYS.presentation) === "1";
}

export function setPresentationMode(on: boolean) {
  if (on) set(KEYS.presentation, "1");
  else remove(KEYS.presentation);
}

export function loadBoardSort(): BoardSort {
  const v = get(KEYS.boardSort);
  if (
    v === "name" ||
    v === "points_desc" ||
    v === "points_asc" ||
    v === "today_desc" ||
    v === "seat"
  ) {
    return v;
  }
  // Prefer seat map when teacher has arranged the room
  return "seat";
}

export function saveBoardSort(sort: BoardSort) {
  set(KEYS.boardSort, sort);
}

export function loadBoardDensity(): BoardDensity {
  const v = get(KEYS.boardDensity);
  if (v === "compact" || v === "normal" || v === "showcase") return v;
  return "normal";
}

export function saveBoardDensity(d: BoardDensity) {
  set(KEYS.boardDensity, d);
}

const MAX_FAVORITES = 4;

export function loadFavoriteSkillIds(): string[] {
  try {
    const raw = get(KEYS.favoriteSkills);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string").slice(0, MAX_FAVORITES);
  } catch {
    return [];
  }
}

export function saveFavoriteSkillIds(ids: string[]) {
  const clean = [...new Set(ids.filter(Boolean))].slice(0, MAX_FAVORITES);
  set(KEYS.favoriteSkills, JSON.stringify(clean));
  return clean;
}

export function toggleFavoriteSkillId(id: string): string[] {
  const cur = loadFavoriteSkillIds();
  if (cur.includes(id)) {
    return saveFavoriteSkillIds(cur.filter((x) => x !== id));
  }
  if (cur.length >= MAX_FAVORITES) return cur;
  return saveFavoriteSkillIds([...cur, id]);
}

/** Last skill awarded — sticky highlight for the next student */
export function loadLastSkillId(): string | null {
  return get(KEYS.lastSkill);
}

export function saveLastSkillId(id: string | null) {
  if (!id) remove(KEYS.lastSkill);
  else set(KEYS.lastSkill, id);
}

export function isProjectorMode(): boolean {
  return get(KEYS.projector) === "1";
}

export function setProjectorMode(on: boolean) {
  if (on) set(KEYS.projector, "1");
  else remove(KEYS.projector);
}

/**
 * Seewo / interactive whiteboard mode.
 * Default ON (classroom product). Explicit "0" turns off.
 */
export function isSmartboardMode(): boolean {
  const v = get(KEYS.smartboard);
  if (v === "0") return false;
  return true;
}

export function setSmartboardMode(on: boolean) {
  set(KEYS.smartboard, on ? "1" : "0");
}

export function applySmartboardClass(on: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("smartboard", on);
}

/** @deprecated kept for call sites that probed hardware — always prefer isSmartboardMode */
export function suggestSmartboard(): boolean {
  return true;
}

export { MAX_FAVORITES };
