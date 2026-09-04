/** Server-side classroom vault — survives preview storage wipes and code updates. */
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { dirname } from "node:path";

export const VAULT_PATH = "/workspace/data/classnest-save.json";

export type VaultPayload = {
  version: 1 | 2;
  exportedAt: number;
  classes: unknown[];
  students: unknown[];
  behaviors: unknown[];
  events: unknown[];
  skillDefaults?: unknown[] | null;
};

function isPayload(x: unknown): x is VaultPayload {
  if (!x || typeof x !== "object") return false;
  const d = x as VaultPayload;
  return (
    Array.isArray(d.classes) &&
    Array.isArray(d.students) &&
    Array.isArray(d.behaviors) &&
    Array.isArray(d.events)
  );
}

export async function readVault(): Promise<VaultPayload | null> {
  try {
    const raw = await readFile(VAULT_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!isPayload(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function writeVault(
  incoming: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isPayload(incoming)) {
    return { ok: false, error: "Invalid payload" };
  }

  const existing = await readVault();
  const nextCount = incoming.classes.length;
  const prevCount = existing?.classes.length ?? 0;
  const nextStudents = incoming.students.length;
  const prevStudents = existing?.students.length ?? 0;

  // Never let an empty / demo-empty write erase a real classroom.
  if (prevCount > 0 && nextCount === 0) {
    return { ok: false, error: "Refused empty overwrite" };
  }
  if (prevStudents > 0 && nextStudents === 0 && nextCount <= prevCount) {
    return { ok: false, error: "Refused student wipe" };
  }

  try {
    await mkdir(dirname(VAULT_PATH), { recursive: true });
    const tmp = `${VAULT_PATH}.tmp`;
    await writeFile(tmp, JSON.stringify(incoming), "utf8");
    await rename(tmp, VAULT_PATH);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Write failed" };
  }
}
