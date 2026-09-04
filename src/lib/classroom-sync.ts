/** Pull/push classroom data to the workspace vault so preview wipes can't erase it. */
import { looksLikeDemoSnapshot } from "./seed";
import {
  useClassStore,
  type ClassNestBackup,
  isBackup,
  backupFingerprint,
} from "./store";
import { flushPendingLocalBackup, markLocalBackupClean, scheduleLocalBackup } from "./local-backups";
import { IS_PORTABLE } from "./app-version";

let pushing = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let lastPushed = "";

export async function pullClassroomVault(): Promise<boolean> {
  if (IS_PORTABLE) return false;
  try {
    const res = await fetch("/api/classroom-save", { cache: "no-store" });
    if (!res.ok) return false;
    const data = (await res.json()) as ClassNestBackup | { empty?: boolean };
    if (!data || "empty" in data || !isBackup(data)) return false;
    if (!data.classes?.length) return false;

    const cur = useClassStore.getState();
    if (cur.classes.length === 0 || looksLikeDemoSnapshot(cur)) {
      const result = useClassStore.getState().importBackup(data);
      return result.ok;
    }
    const result = useClassStore.getState().mergeBackup(data);
    return result.ok;
  } catch {
    return false;
  }
}

export async function pushClassroomVault(): Promise<void> {
  if (IS_PORTABLE) return;
  const snap = useClassStore.getState().exportBackup();
  if (!snap.classes.length) return;
  const payload = JSON.stringify(snap);
  const finger = backupFingerprint(snap);
  if (finger === lastPushed) return;
  if (pushing) return;
  pushing = true;
  try {
    const res = await fetch("/api/classroom-save", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: payload,
    });
    if (res.ok) lastPushed = finger;
  } catch {
    /* preview may be offline */
  } finally {
    pushing = false;
  }
}

export function scheduleClassroomVaultPush(delayMs = 800): void {
  if (IS_PORTABLE) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    void pushClassroomVault();
  }, delayMs);
}

export function startClassroomVaultSync(): () => void {
  const initial = useClassStore.getState().exportBackup();
  lastPushed = backupFingerprint(initial);
  markLocalBackupClean(initial);
  const unsub = useClassStore.subscribe((s, prev) => {
    if (
      s.classes === prev.classes &&
      s.students === prev.students &&
      s.events === prev.events &&
      s.behaviors === prev.behaviors
    ) {
      return;
    }
    if (s.classes.length === 0) return;
    scheduleClassroomVaultPush();
    scheduleLocalBackup(s.exportBackup());
  });
  const onHide = () => {
    if (pushTimer) {
      clearTimeout(pushTimer);
      pushTimer = null;
    }
    const snap = useClassStore.getState().exportBackup();
    if (snap.classes.length) {
      void pushClassroomVault();
      flushPendingLocalBackup(snap);
    }
  };
  window.addEventListener("pagehide", onHide);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") onHide();
  });
  return () => {
    unsub();
    window.removeEventListener("pagehide", onHide);
  };
}
