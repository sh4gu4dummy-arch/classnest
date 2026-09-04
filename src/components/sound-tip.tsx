import { useEffect, useState } from "react";
import { Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hasSeenSoundTip, markSoundTipSeen } from "@/lib/prefs";
import { setSoundPack } from "@/lib/sounds";

/** One-time tip: sounds start muted for quiet rooms. Compact on smartboard. */
export function SoundTip() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!hasSeenSoundTip()) {
      // Delay so it doesn't fight first paint / first award
      const t = window.setTimeout(() => setShow(true), 900);
      return () => window.clearTimeout(t);
    }
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed bottom-3 left-3 right-3 z-[80] mx-auto max-w-sm rounded-2xl border-2 border-border bg-surface p-3 shadow-lg sm:left-auto sm:right-4"
      role="status"
    >
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Volume2 className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">Sounds muted</p>
          <p className="mt-0.5 text-xs text-muted-fg">
            Tap the speaker when you want award chimes.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => {
                setSoundPack("light");
                markSoundTipSeen();
                setShow(false);
              }}
            >
              Light sounds
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                markSoundTipSeen();
                setShow(false);
              }}
            >
              Keep muted
            </Button>
          </div>
        </div>
        <button
          type="button"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted-fg hover:bg-surface-2"
          aria-label="Dismiss"
          onClick={() => {
            markSoundTipSeen();
            setShow(false);
          }}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
