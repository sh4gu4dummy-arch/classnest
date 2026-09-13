import { RotateCcw, Shuffle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAvatarSrc, type AvatarPack } from "@/lib/avatars";
import type { Student } from "@/lib/types";

export function pickRandomStudent(pool: Student[]): Student | null {
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function PickBanner({
  student,
  pack,
  points,
  called,
  total,
  last,
  onNext,
  onRestart,
  onDone,
}: {
  student: Student;
  pack: AvatarPack;
  points: number;
  called?: number;
  total?: number;
  last?: boolean;
  onNext?: () => void;
  onRestart?: () => void;
  onDone: () => void;
}) {
  const first = student.name.split(" ")[0] ?? student.name;
  const src = getAvatarSrc(student.avatarId, pack, points, "board");
  const cycling = onNext != null || onRestart != null;

  return (
    <div
      className="mb-3 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-accent px-3 py-2.5 text-white shadow-lg"
      style={{
        background:
          "linear-gradient(105deg, color-mix(in oklab, var(--color-accent) 55%, #1a1340) 0%, #2a1d58 42%, color-mix(in oklab, #fb923c 45%, #1a1340) 100%)",
        boxShadow:
          "0 0 0 1px color-mix(in oklab, var(--color-accent) 40%, transparent), 0 12px 32px rgba(0,0,0,0.28)",
      }}
      data-chrome="teacher"
      role="status"
      aria-live="polite"
    >
      <img
        src={src}
        alt=""
        width={56}
        height={56}
        className="size-14 shrink-0 rounded-xl bg-black/25 object-contain ring-2 ring-white/40"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
          {last ? "All called" : cycling ? "Up now" : "Picked"}
        </p>
        <p className="truncate text-2xl font-black leading-tight tracking-tight sm:text-3xl">
          {first}
        </p>
        {cycling && total != null && called != null ? (
          <p className="text-xs font-bold tabular-nums text-white/75">
            {called}/{total}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {cycling && !last && onNext ? (
          <Button type="button" size="sm" className="gap-1.5" onClick={onNext}>
            <Shuffle className="size-3.5" />
            Next
          </Button>
        ) : null}
        {onRestart ? (
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
        ) : null}
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="gap-1.5 bg-white/15 text-white hover:bg-white/25"
          onClick={onDone}
        >
          <X className="size-3.5" />
          {cycling ? "Done" : "OK"}
        </Button>
      </div>
    </div>
  );
}
