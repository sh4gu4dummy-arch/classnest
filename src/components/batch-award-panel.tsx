import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SkillIcon } from "@/components/skill-icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { unlockAudio } from "@/lib/sounds";
import { useClassStore } from "@/lib/store";
import type { Behavior, PointEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BatchAwardPanelProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  classId: string;
  studentIds: string[];
  /** Lifetime points before the award (for evolution detection). */
  pointsOf: (id: string) => number;
  /** Parent shows flash / evolution / one toast with a whole-batch Undo. */
  onAwarded: (
    created: PointEvent[],
    prevById: Map<string, number>,
    kind: "positive" | "needs_work",
  ) => void;
}

export function BatchAwardPanel({
  open,
  onOpenChange,
  classId,
  studentIds,
  pointsOf,
  onAwarded,
}: BatchAwardPanelProps) {
  const behaviors = useClassStore((s) => s.classBehaviors(classId));

  const awardPointsBatch = useClassStore((s) => s.awardPointsBatch);
  const positive = behaviors.filter((b) => b.kind === "positive");
  const needs = behaviors.filter((b) => b.kind === "needs_work");

  function award(b: Behavior) {
    unlockAudio();
    const prevById = new Map(studentIds.map((id) => [id, pointsOf(id)]));
    const events = awardPointsBatch({
      studentIds,
      classId,
      behaviorId: b.id,
    });
    if (!events.length) {
      toast.error("Nothing awarded");
      return;
    }
    onAwarded(events, prevById, b.kind);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Batch award</DialogTitle>
          <DialogDescription>
            Apply one skill to {studentIds.length} selected student
            {studentIds.length === 1 ? "" : "s"}.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-3 space-y-3">
          <Group title="Positive" color="text-positive" items={positive} onPick={award} />
          <Group title="Needs work" color="text-danger" items={needs} onPick={award} />
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Group({
  title,
  color,
  items,
  onPick,
}: {
  title: string;
  color: string;
  items: Behavior[];
  onPick: (b: Behavior) => void;
}) {
  return (
    <div>
      <p className={cn("mb-1.5 text-[11px] font-bold uppercase tracking-wide", color)}>
        {title}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((b) => {
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onPick(b)}
              className="flex items-center gap-2 rounded-xl border-2 border-border px-2.5 py-2 text-left hover:border-accent/40"
            >
              <SkillIcon icon={b.icon} />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{b.label}</span>
                <span className="text-xs font-bold tabular-nums">
                  {b.points > 0 ? `+${b.points}` : b.points === 0 ? "0" : b.points}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
