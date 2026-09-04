import { useEffect, useState } from "react";
import { pullClassroomVault, startClassroomVaultSync } from "@/lib/classroom-sync";
import { useClassStore } from "@/lib/store";

/** Wait for localStorage rehydration, restore from workspace vault, then sync.
 *  Never stays on Loading — vault/hydrate failures still show the board. */
export function useHydratedStore() {
  const seedIfEmpty = useClassStore((s) => s.seedIfEmpty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stopSync: (() => void) | undefined;
    let cancelled = false;
    let finished = false;

    const markReady = () => {
      if (cancelled || finished) return;
      finished = true;
      setReady(true);
    };

    const finish = async () => {
      try {
        seedIfEmpty();
      } catch {
        /* show UI anyway */
      }
      markReady();
      try {
        await pullClassroomVault();
        if (!cancelled) seedIfEmpty();
      } catch {
        /* vault is best-effort */
      }
      if (cancelled) return;
      try {
        stopSync = startClassroomVaultSync();
      } catch {
        /* ignore */
      }
    };

    const bail = window.setTimeout(markReady, 1200);

    try {
      void useClassStore.persist.rehydrate();
    } catch {
      /* ignore */
    }

    if (useClassStore.persist.hasHydrated()) {
      void finish();
    } else {
      const unsub = useClassStore.persist.onFinishHydration(() => {
        void finish();
      });
      return () => {
        cancelled = true;
        window.clearTimeout(bail);
        unsub();
        stopSync?.();
      };
    }

    return () => {
      cancelled = true;
      window.clearTimeout(bail);
      stopSync?.();
    };
  }, [seedIfEmpty]);

  return ready;
}
