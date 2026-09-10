import { useEffect, useState } from "react";
import { pullClassroomVault, startClassroomVaultSync } from "@/lib/classroom-sync";
import { useClassStore } from "@/lib/store";

/** One vault pull + sync per tab. Re-pulling on every nest→board navigation
 *  was merging deleted students back from the last save. */
let sessionReady = false;
let booting = false;
let kicked = false;
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
    markSessionReady();
  }
}

function kickoff(seedIfEmpty: () => void) {
  if (kicked) return;
  kicked = true;
  // Do not clear this on unmount — Strict Mode + tab-hide was wiping it,
  // which left the home screen stuck on “Loading…”.
  window.setTimeout(markSessionReady, 400);
  try {
    void useClassStore.persist.rehydrate();
  } catch {
    /* ignore */
  }
  const start = () => void boot(seedIfEmpty);
  if (useClassStore.persist.hasHydrated()) {
    start();
  } else {
    useClassStore.persist.onFinishHydration(start);
  }
}

export function useHydratedStore() {
  const seedIfEmpty = useClassStore((s) => s.seedIfEmpty);
  const hasClasses = useClassStore((s) => s.classes.length > 0);
  const [ready, setReady] = useState(sessionReady);

  useEffect(() => {
    if (sessionReady) {
      setReady(true);
      return;
    }
    waiters.add(setReady);
    kickoff(seedIfEmpty);
    return () => {
      waiters.delete(setReady);
    };
  }, [seedIfEmpty]);

  useEffect(() => {
    const onShow = () => {
      if (sessionReady || useClassStore.persist.hasHydrated()) {
        markSessionReady();
        setReady(true);
      }
    };
    const onVis = () => {
      if (document.visibilityState === "visible") onShow();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pageshow", onShow);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pageshow", onShow);
    };
  }, []);

  return ready || hasClasses;
}
