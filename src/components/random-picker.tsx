import { RotateCcw, Shuffle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Student } from "@/lib/types";

export function pickRandomStudent(pool: Student[]): Student | null {
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function CycleStrip({
  name,
  called,
  total,
  last,
  onNext,
  onRestart,
  onDone,
}: {
  name: string;
  called: number;
  total: number;
  last: boolean;
  onNext: () => void;
  onRestart: () => void;
  onDone: () => void;
}) {
  return (
    <div
      className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border-2 border-accent/40 bg-surface px-3 py-2 shadow-md"
      data-chrome="teacher"
      role="status"
      aria-live="polite"
    >
      <p className="min-w-0 flex-1 text-base font-black tracking-tight sm:text-lg">
        {name}
        <span className="ml-2 text-sm font-bold tabular-nums text-muted-fg">
          {called}/{total}
        </span>
      </p>
      {!last && (
        <Button type="button" size="sm" className="gap-1.5" onClick={onNext}>
          <Shuffle className="size-3.5" />
          Next
        </Button>
      )}
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="gap-1.5"
        onClick={onRestart}
      >
        <RotateCcw className="size-3.5" />
        Restart
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="gap-1.5"
        onClick={onDone}
      >
        <X className="size-3.5" />
        Done
      </Button>
    </div>
  );
}
