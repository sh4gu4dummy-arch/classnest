import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";
import { StudentAvatar } from "@/components/student-avatar";
import { Button } from "@/components/ui/button";
import type { AvatarPack } from "@/lib/avatars";
import type { Student } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  open: boolean;
  onClose: () => void;
  students: Student[];
  pack: AvatarPack;
  pointsOf: (id: string) => number;
  todayOf: (id: string) => number;
}

export function Spotlight({
  open,
  onClose,
  students,
  pack,
  pointsOf,
  todayOf,
}: SpotlightProps) {
  const sorted = useMemo(
    () => [...students].sort((a, b) => a.name.localeCompare(b.name)),
    [students],
  );
  const [index, setIndex] = useState(0);
  const [shuffleKey, setShuffleKey] = useState(0);

  if (!open || sorted.length === 0) return null;

  const safeIndex = ((index % sorted.length) + sorted.length) % sorted.length;
  const student = sorted[safeIndex]!;
  const points = pointsOf(student.id);
  const today = todayOf(student.id);

  function next() {
    setIndex((i) => i + 1);
  }
  function prev() {
    setIndex((i) => i - 1);
  }
  function random() {
    if (sorted.length < 2) return;
    let n = safeIndex;
    while (n === safeIndex) n = Math.floor(Math.random() * sorted.length);
    setIndex(n);
    setShuffleKey((k) => k + 1);
  }

  return (
    <div
      className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-ink/90 p-4 backdrop-blur-md"
      role="dialog"
      aria-label="Student spotlight"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Close spotlight"
      >
        <X className="size-5" />
      </button>

      <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-white/60">
        Spotlight
      </p>

      <div
        key={`${student.id}-${shuffleKey}`}
        className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300"
      >
        <StudentAvatar
          avatarId={student.avatarId}
          name={student.name}
          pack={pack}
          points={points}
          todayPoints={today}
          size="hero"
          stars={student.stars}
          frameId={student.frameId}
          shieldCharges={student.shieldCharges}
          className="!size-48 sm:!size-56"
        />
        <h2 className="text-center text-3xl font-black tracking-tight text-white sm:text-4xl">
          {student.name}
        </h2>
        <p className="text-sm font-semibold tabular-nums text-white/70">
          {points > 0 ? `+${points}` : points} all-time
          {today !== 0 && (
            <span className="text-white/50">
              {" · "}
              today {today > 0 ? `+${today}` : today}
            </span>
          )}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          size="lg"
          variant="secondary"
          className="gap-1.5 bg-white/10 text-white hover:bg-white/20"
          onClick={prev}
        >
          <ChevronLeft className="size-5" />
          Prev
        </Button>
        <Button
          type="button"
          size="lg"
          className="gap-1.5"
          onClick={random}
        >
          <Sparkles className="size-5" />
          Random
        </Button>
        <Button
          type="button"
          size="lg"
          variant="secondary"
          className="gap-1.5 bg-white/10 text-white hover:bg-white/20"
          onClick={next}
        >
          Next
          <ChevronRight className="size-5" />
        </Button>
      </div>

      <p className="mt-4 text-xs text-white/40">
        {safeIndex + 1} / {sorted.length}
      </p>

      {/* Mini strip */}
      <div className="mt-6 flex max-w-full gap-1.5 overflow-x-auto px-2 pb-1">
        {sorted.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              "size-10 shrink-0 overflow-hidden rounded-lg ring-2 transition",
              i === safeIndex ? "ring-white" : "ring-transparent opacity-60 hover:opacity-100",
            )}
            aria-label={s.name}
          >
            <StudentAvatar
              avatarId={s.avatarId}
              name={s.name}
              pack={pack}
              points={pointsOf(s.id)}
              todayPoints={todayOf(s.id)}
              size="sm"
              showLevelBadge={false}
              className="!size-10"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
