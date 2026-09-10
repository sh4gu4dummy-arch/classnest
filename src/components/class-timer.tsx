import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Mode = "countdown" | "stopwatch";

const PRESETS = [60, 120, 300, 600, 1200] as const;

function formatTime(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function ClassTimer() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("countdown");
  const [running, setRunning] = useState(false);
  const [countdownSec, setCountdownSec] = useState(300);
  const [remain, setRemain] = useState(300);
  const [elapsed, setElapsed] = useState(0);
  const [doneFlash, setDoneFlash] = useState(false);
  const lastTick = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      lastTick.current = null;
      return;
    }
    lastTick.current = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const prev = lastTick.current ?? now;
      const dt = (now - prev) / 1000;
      lastTick.current = now;
      if (mode === "countdown") {
        setRemain((r) => {
          const next = r - dt;
          if (next <= 0) {
            setRunning(false);
            setDoneFlash(true);
            return 0;
          }
          return next;
        });
      } else {
        setElapsed((e) => e + dt);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, mode]);

  useEffect(() => {
    if (!doneFlash) return;
    const id = window.setTimeout(() => setDoneFlash(false), 4000);
    return () => window.clearTimeout(id);
  }, [doneFlash]);

  function applyPreset(sec: number) {
    setMode("countdown");
    setCountdownSec(sec);
    setRemain(sec);
    setRunning(false);
    setDoneFlash(false);
  }

  function reset() {
    setRunning(false);
    setDoneFlash(false);
    if (mode === "countdown") setRemain(countdownSec);
    else setElapsed(0);
  }

  function switchMode(m: Mode) {
    setMode(m);
    setRunning(false);
    setDoneFlash(false);
    if (m === "countdown") setRemain(countdownSec);
    else setElapsed(0);
  }

  const display =
    mode === "countdown" ? formatTime(remain) : formatTime(elapsed);
  const urgent = mode === "countdown" && remain <= 10 && remain > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Class timer"
            title="Class timer — countdown or stopwatch"
            className={cn(
              (running || doneFlash) && "text-accent",
              doneFlash && "animate-pulse",
            )}
          >
            <Timer className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Class timer</DialogTitle>
            <DialogDescription>
              Countdown for quiet work / spar rounds, or stopwatch for free timed activities.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={mode === "countdown" ? "default" : "secondary"}
              className="flex-1"
              onClick={() => switchMode("countdown")}
            >
              Countdown
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "stopwatch" ? "default" : "secondary"}
              className="flex-1"
              onClick={() => switchMode("stopwatch")}
            >
              Stopwatch
            </Button>
          </div>

          <div
            className={cn(
              "rounded-2xl border-2 border-border bg-surface-2 py-6 text-center",
              doneFlash && "border-accent bg-accent/15",
              urgent && "border-danger/50 bg-danger/10",
            )}
          >
            <p
              className={cn(
                "font-mono text-5xl font-bold tabular-nums tracking-tight",
                urgent && "text-danger",
                doneFlash && "text-accent",
              )}
            >
              {display}
            </p>
            {doneFlash && (
              <p className="mt-2 text-sm font-bold text-accent">Time's up!</p>
            )}
          </div>

          {mode === "countdown" && (
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((sec) => (
                <Button
                  key={sec}
                  type="button"
                  size="sm"
                  variant={countdownSec === sec ? "default" : "secondary"}
                  onClick={() => applyPreset(sec)}
                >
                  {sec < 60 ? `${sec}s` : `${sec / 60}m`}
                </Button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              className="flex-1 gap-1.5"
              onClick={() => setRunning((r) => !r)}
              disabled={mode === "countdown" && remain <= 0}
            >
              {running ? (
                <>
                  <Pause className="size-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="size-4" /> Start
                </>
              )}
            </Button>
            <Button type="button" variant="secondary" className="gap-1.5" onClick={reset}>
              <RotateCcw className="size-4" /> Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {(running || doneFlash) && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "fixed bottom-4 right-4 z-40 rounded-full border-2 border-border bg-surface px-4 py-2 font-mono text-lg font-bold shadow-lg tabular-nums",
            doneFlash && "border-accent bg-accent text-accent-fg animate-pulse",
            urgent && "border-danger text-danger",
          )}
          title="Open timer"
        >
          {display}
        </button>
      )}
    </>
  );
}
