import { useEffect, useMemo, useState } from "react";
import { Dices, RotateCcw, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { StudentAvatar } from "@/components/student-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { AvatarPack } from "@/lib/avatars";
import { useClassStore } from "@/lib/store";
import type { Student } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RandomPickerProps {
  students: Student[];
  pack?: AvatarPack;
  /** Stable key so pick history resets per class, not globally */
  classId?: string;
}

function storageKey(classId: string) {
  return `classnest-fair-pick-${classId}`;
}

function loadPicked(classId: string): string[] {
  if (!classId) return [];
  try {
    const raw = sessionStorage.getItem(storageKey(classId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

function savePicked(classId: string, ids: string[]) {
  if (!classId) return;
  try {
    sessionStorage.setItem(storageKey(classId), JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function RandomPicker({
  students,
  pack = "kids",
  classId = "",
}: RandomPickerProps) {
  const studentPoints = useClassStore((s) => s.studentPoints);
  const [open, setOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Student | null>(null);
  const [pickedIds, setPickedIds] = useState<string[]>(() => loadPicked(classId));
  /** Pool frozen when a spin starts so React state races don't empty mid-spin */
  const [spinPool, setSpinPool] = useState<Student[]>([]);

  useEffect(() => {
    setPickedIds(loadPicked(classId));
    setPicked(null);
  }, [classId]);

  useEffect(() => {
    const valid = new Set(students.map((s) => s.id));
    setPickedIds((prev) => {
      const next = prev.filter((id) => valid.has(id));
      if (next.length !== prev.length) savePicked(classId, next);
      return next.length === prev.length ? prev : next;
    });
  }, [students, classId]);

  const total = students.length;
  const remaining = useMemo(
    () => students.filter((s) => !pickedIds.includes(s.id)),
    [students, pickedIds],
  );
  const doneCount = Math.min(pickedIds.length, total);

  useEffect(() => {
    if (!spinning || spinPool.length === 0) return;
    let ticks = 0;
    const max = 16 + Math.floor(Math.random() * 10);
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % spinPool.length);
      ticks += 1;
      if (ticks >= max) {
        window.clearInterval(id);
        const final = spinPool[Math.floor(Math.random() * spinPool.length)]!;
        setIndex(Math.max(0, spinPool.findIndex((s) => s.id === final.id)));
        setSpinning(false);
        setPicked(final);

        setPickedIds((prev) => {
          if (prev.includes(final.id)) return prev;
          const next = [...prev, final.id];
          savePicked(classId, next);
          const n = next.length;
          const t = students.length;
          if (t > 0 && n >= t) {
            toast.success(`All ${t} students called!`, {
              description: "List resets for a fresh round.",
            });
            window.setTimeout(() => {
              savePicked(classId, []);
              setPickedIds([]);
            }, 500);
          } else {
            toast.message(`Picked ${n}/${t}`, { description: final.name });
          }
          return next;
        });
      }
    }, 70);
    return () => window.clearInterval(id);
  }, [spinning, spinPool, classId, students.length]);

  const display = spinning
    ? spinPool[index % Math.max(1, spinPool.length)]
    : picked ?? remaining[0] ?? students[0];

  function spin() {
    if (students.length === 0 || spinning) return;
    let pool = students.filter((s) => !pickedIds.includes(s.id));
    if (pool.length === 0) {
      savePicked(classId, []);
      setPickedIds([]);
      pool = students.slice();
      toast.message("New round — everyone is back in");
    }
    setSpinPool(pool);
    setIndex(0);
    setPicked(null);
    setSpinning(true);
  }

  function resetRound() {
    savePicked(classId, []);
    setPickedIds([]);
    setPicked(null);
    toast.message("Pick list reset");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="gap-1.5"
          aria-label="Random student picker"
          title="Fair random pick — skips already called"
        >
          <Dices className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Fair pick</DialogTitle>
          <DialogDescription>
            Skips students already called this round.
          </DialogDescription>
        </DialogHeader>
        {students.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-fg">Add students first.</p>
        ) : (
          <div className="flex flex-col items-center gap-4 py-2">
            <p className="text-sm font-bold tabular-nums text-muted-fg">
              <span className="text-fg">{doneCount}</span>
              {" / "}
              {total} called
            </p>
            <div className="flex max-w-full flex-wrap justify-center gap-1 px-2">
              {students.map((s) => (
                <span
                  key={s.id}
                  className={cn(
                    "size-2.5 rounded-full",
                    pickedIds.includes(s.id) ? "bg-accent" : "bg-border",
                  )}
                  title={s.name}
                />
              ))}
            </div>
            <div
              className={cn(
                "flex flex-col items-center gap-3 rounded-2xl border-2 border-accent/30 bg-gradient-to-b from-accent/10 to-surface-2 px-8 py-6 transition-transform",
                spinning && "scale-[1.02]",
              )}
            >
              {display && (
                <>
                  <StudentAvatar
                    avatarId={display.avatarId}
                    name={display.name}
                    pack={pack}
                    points={studentPoints(display.id)}
                    size="xl"
                    showLevelBadge={false}
                  />
                  <p className="text-lg font-bold text-fg">{display.name}</p>
                </>
              )}
            </div>
            <Button onClick={spin} disabled={spinning} className="w-full gap-2">
              <Shuffle className="size-4" />
              {spinning
                ? "Picking…"
                : remaining.length === 0 && pickedIds.length > 0
                  ? "Start new round"
                  : picked
                    ? "Pick next"
                    : "Pick a student"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={resetRound}
              disabled={pickedIds.length === 0}
            >
              <RotateCcw className="size-3.5" />
              Reset list
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
