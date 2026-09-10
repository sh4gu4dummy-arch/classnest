import { useEffect, useState } from "react";
import { pullClassroomVault, startClassroomVaultSync } from "@/lib/classroom-sync";
import { useClassStore } from "@/lib/store";

/** One vault pull + sync per tab. Re-pulling on every nest→board navigation
 *  was merging deleted students back from the last save. */
let sessionReady = false;
let booting = false;
let stopSync: (() => void) | undefined;
const waiters = new Set<(v: boolean) => void>();

function markSessionReady() {
  if (sessionReady) return;
  sessionReady = true;
  for (const w of waiters) w(true);
  waiters.clear();
}

async function boot(seedIfEmpty: () => void) {
  if (booting || sessionReady) return;
  booting = true;
  try {
    try {
      seedIfEmpty();
    } catch {
      /* show UI anyway */
    }
    markSessionReady();
    try {
      await pullClassroomVault();
      seedIfEmpty();
    } catch {
      /* vault is best-effort */
    }
    try {
      stopSync = startClassroomVaultSync();
    } catch {
      /* ignore */
    }
  } finally {
    booting = false;
  }
}

export function useHydratedStore() {
  const seedIfEmpty = useClassStore((s) => s.seedIfEmpty);
  const [ready, setReady] = useState(sessionReady);

  useEffect(() => {
    if (sessionReady) {
      setReady(true);
      return;
    }
    waiters.add(setReady);
    const bail = window.setTimeout(markSessionReady, 1200);
    try {
      void useClassStore.persist.rehydrate();
    } catch {
      /* ignore */
    }
    const start = () => void boot(seedIfEmpty);
    if (useClassStore.persist.hasHydrated()) {
      start();
    } else {
      const unsub = useClassStore.persist.onFinishHydration(start);
      return () => {
        waiters.delete(setReady);
        unsub();
        window.clearTimeout(bail);
      };
    }
    return () => {
      waiters.delete(setReady);
      window.clearTimeout(bail);
    };
  }, [seedIfEmpty]);

  return ready;
}
