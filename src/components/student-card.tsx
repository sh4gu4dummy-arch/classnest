import { memo, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { StudentAvatar } from "@/components/student-avatar";
import type { AvatarPack } from "@/lib/avatars";
import type { Student } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Longer window on Seewo / finger touch; snappier on mouse. */
function doubleTapMs() {
  if (typeof window === "undefined") return 160;
  const smartboard =
    document.documentElement.classList.contains("smartboard");
  const coarse =
    window.matchMedia?.("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0;
  if (smartboard) return 380;
  return coarse ? 300 : 160;
}

interface StudentCardProps {
  student: Student;
  points: number;
  displayPoints?: number;
  pointsLabel?: string;
  todayPoints?: number;
  pack?: AvatarPack;
  onAward: (student: Student) => void;
  onQuickPlus?: (student: Student) => void;
  flash?: "positive" | "needs_work" | null;
  evolvePulse?: boolean;
  selectMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  hideNest?: boolean;
  absent?: boolean;
  late?: boolean;
  onToggleAbsent?: (student: Student) => void;
  rearrangeMode?: boolean;
  dragIndex?: number;
  onDragStart?: (index: number) => void;
  onDragOver?: (index: number) => void;
  onDragEnd?: () => void;
  focused?: boolean;
}

function StudentCardInner({
  student,
  points,
  displayPoints,
  pointsLabel,
  todayPoints = 0,
  pack = "kids",
  onAward,
  onQuickPlus,
  flash,
  evolvePulse,
  selectMode,
  selected,
  onToggleSelect: _onToggleSelect,
  absent,
  late,
  rearrangeMode,
  dragIndex = 0,
  onDragStart,
  onDragOver,
  onDragEnd,
  focused,
}: StudentCardProps) {
  const shown = displayPoints ?? points;
  const positive = shown >= 0;
  const clickTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (clickTimer.current != null) window.clearTimeout(clickTimer.current);
    };
  }, []);

  function handleCardActivate() {
    if (rearrangeMode) return;
    // Select-mode paint lives on the board grid (click + drag).
    if (selectMode) return;
    if (!onQuickPlus) {
      onAward(student);
      return;
    }
    if (clickTimer.current != null) {
      window.clearTimeout(clickTimer.current);
      clickTimer.current = null;
      onQuickPlus(student);
      return;
    }
    clickTimer.current = window.setTimeout(() => {
      clickTimer.current = null;
      onAward(student);
    }, doubleTapMs());
  }

  return (
    <div
      data-student-id={student.id}
      className={cn(
        "group relative flex flex-col items-center rounded-2xl border-2 border-border bg-surface p-2 shadow-md sm:p-2.5",
        !selectMode &&
          "transition-[transform,box-shadow,border-color,background-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-accent/55 hover:shadow-lg active:scale-[0.98]",
        flash === "positive" && "border-positive/50 bg-positive/10",
        flash === "needs_work" && "border-danger/50 bg-danger/10",
        selectMode && selected && "border-accent bg-accent/10",
        selectMode && "select-none shadow-sm",
        focused && !selectMode && "shadow-[0_0_0_2px_var(--color-accent)]",
        absent && "opacity-55 grayscale-[0.35]",
        late && !absent && "border-amber-400/50 bg-amber-400/5",
        rearrangeMode && "cursor-grab active:cursor-grabbing",
      )}
      style={
        selectMode
          ? undefined
          : {
              contentVisibility: "auto",
              containIntrinsicSize: "0 180px",
            }
      }
      draggable={!!rearrangeMode}
      onDragStart={(e) => {
        if (!rearrangeMode) return;
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.(dragIndex);
      }}
      onDragOver={(e) => {
        if (!rearrangeMode) return;
        e.preventDefault();
        onDragOver?.(dragIndex);
      }}
      onDragEnd={() => onDragEnd?.()}
    >
      {absent && (
        <span className="absolute left-1.5 top-1.5 z-10 rounded-full bg-muted-fg/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-surface">
          Out
        </span>
      )}
      {late && !absent && (
        <span className="absolute left-1.5 top-1.5 z-10 rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
          Late
        </span>
      )}
      {selectMode && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute right-1 top-1 z-10 flex size-8 items-center justify-center rounded-full border-2 text-xs shadow-sm",
            selected
              ? "border-accent bg-accent text-accent-fg"
              : "border-muted-fg/50 bg-surface text-transparent",
          )}
        >
          <Check className="size-4" />
        </span>
      )}
      <button
        type="button"
        onClick={handleCardActivate}
        className="flex w-full flex-col items-center gap-1.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={
          rearrangeMode
            ? `Drag to rearrange ${student.name}`
            : selectMode
              ? `${selected ? "Deselect" : "Select"} ${student.name}`
              : `Award points to ${student.name}. Double-tap for quick +1.`
        }
        title={
          rearrangeMode
            ? "Drag to change seat"
            : selectMode
              ? "Tap to select for batch award"
              : "Tap: pick skill · Double-tap: +1 Point"
        }
      >
        <StudentAvatar
          avatarId={student.avatarId}
          name={student.name}
          pack={pack}
          points={points}
          todayPoints={todayPoints}
          size="board"
          highlight={flash}
          evolvePulse={evolvePulse}
          stars={student.stars}
          frameId={student.frameId}
          bannerId={student.bannerId}
          shieldCharges={student.shieldCharges}
          showLevelBadge={false}
          className={cn(
            !selectMode &&
              "transition-transform duration-150 ease-out group-hover:scale-[1.03] group-active:scale-[0.98]",
          )}
        />
        <span className="board-name w-full truncate text-center text-sm font-semibold text-fg sm:text-[15px]">
          {student.name.split(" ")[0]}
        </span>
        {student.group ? (
          <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted-fg">
            T{student.group}
          </span>
        ) : null}
        <span
          className={cn(
            "inline-flex min-w-10 items-center justify-center rounded-full px-2.5 py-0.5 text-sm font-bold tabular-nums shadow-sm",
            positive
              ? "bg-positive text-positive-fg"
              : "bg-danger text-danger-fg",
          )}
        >
          {shown > 0 ? `+${shown}` : shown}
        </span>
        {pointsLabel ? (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-fg">
            {pointsLabel}
          </span>
        ) : null}
      </button>
    </div>
  );
}

export const StudentCard = memo(StudentCardInner, (a, b) => {
  // Ignore callback identity — parent re-creates handlers every render.
  return (
    a.student.id === b.student.id &&
    a.student.name === b.student.name &&
    a.student.avatarId === b.student.avatarId &&
    a.student.group === b.student.group &&
    a.student.stars === b.student.stars &&
    a.student.frameId === b.student.frameId &&
    a.student.bannerId === b.student.bannerId &&
    a.student.shieldCharges === b.student.shieldCharges &&
    a.points === b.points &&
    a.displayPoints === b.displayPoints &&
    a.pointsLabel === b.pointsLabel &&
    a.todayPoints === b.todayPoints &&
    a.pack === b.pack &&
    a.flash === b.flash &&
    a.evolvePulse === b.evolvePulse &&
    a.selectMode === b.selectMode &&
    a.selected === b.selected &&
    a.absent === b.absent &&
    a.late === b.late &&
    a.rearrangeMode === b.rearrangeMode &&
    a.dragIndex === b.dragIndex &&
    a.focused === b.focused
  );
});
