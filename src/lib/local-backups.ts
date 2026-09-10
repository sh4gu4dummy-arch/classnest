/** Ring buffer of last N full backups in localStorage (no file download). */
import type { ClassNestBackup } from "./store";
import { backupFingerprint } from "./store";

const KEY = "classnest-local-backups-v1";
const MAX = 8;

export type LocalBackupMeta = {
  id: string;
  savedAt: number;
  label: string;
  classCount: number;
  studentCount: number;
  eventCount: number;
};

type Stored = {
  meta: LocalBackupMeta;
  data: ClassNestBackup;
};

function readAll(): Stored[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is Stored =>
        !!x &&
        typeof x === "object" &&
        !!(x as Stored).meta &&
        !!(x as Stored).data,
    );
  } catch {
    return [];
  }
}

function writeAll(items: Stored[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
  } catch {
    /* quota */
  }
}

export function listLocalBackups(): LocalBackupMeta[] {
  return readAll().map((x) => x.meta);
}

let backupTimer: ReturnType<typeof setTimeout> | null = null;
let lastBackupJson = "";

export function markLocalBackupClean(data: ClassNestBackup): void {
  lastBackupJson = backupFingerprint(data);
}

/** Snapshot after real edits. Idle / reload does nothing. */
export function scheduleLocalBackup(data: ClassNestBackup, delayMs = 12000): void {
  const payload = backupFingerprint(data);
  if (payload === lastBackupJson) return;
  if (backupTimer) clearTimeout(backupTimer);
  backupTimer = setTimeout(() => {
    backupTimer = null;
    flushLocalBackup(data, "Auto-save");
  }, delayMs);
}

export function flushPendingLocalBackup(data: ClassNestBackup): void {
  if (backupTimer) {
    clearTimeout(backupTimer);
    backupTimer = null;
  }
  flushLocalBackup(data, "Auto-save");
}

function flushLocalBackup(data: ClassNestBackup, label: string): void {
  if (!data.classes?.length) return;
  const payload = backupFingerprint(data);
  if (payload === lastBackupJson) return;
  lastBackupJson = payload;
  pushLocalBackup(data, label);
}

export function pushLocalBackup(data: ClassNestBackup, label?: string): LocalBackupMeta {
  const meta: LocalBackupMeta = {
    id: `lb_${Date.now().toString(36)}`,
    savedAt: Date.now(),
    label:
      label ??
      new Date().toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    classCount: data.classes?.length ?? 0,
    studentCount: data.students?.length ?? 0,
    eventCount: data.events?.length ?? 0,
  };
  const next = [{ meta, data }, ...readAll()].slice(0, MAX);
  writeAll(next);
  return meta;
}

export function getLocalBackup(id: string): ClassNestBackup | null {
  return readAll().find((x) => x.meta.id === id)?.data ?? null;
}

export function removeLocalBackup(id: string) {
  writeAll(readAll().filter((x) => x.meta.id !== id));
}
