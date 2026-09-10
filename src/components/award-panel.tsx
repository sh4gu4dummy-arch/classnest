import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { StudentAvatar } from "@/components/student-avatar";
import { SkillIcon } from "@/components/skill-icon";
import { ArtZoom } from "@/components/evolution-burst";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getAvatar, getAvatarSrc, ULTRA_FORM_NAMES, type AvatarPack } from "@/lib/avatars";
import { didEvolve, getEvolutionTier, getMilestoneMark, pointsToNextLevel } from "@/lib/evolution";
import { loadLastSkillId, saveLastSkillId } from "@/lib/prefs";
import { playAwardSound, playSound, unlockAudio } from "@/lib/sounds";
import { useClassStore } from "@/lib/store";
import type { Behavior, Student } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FavoriteSkillToggle } from "@/components/favorite-skills-bar";

function formatDelta(n: number) {
  return n > 0 ? `+${n}` : String(n);
}

interface AwardPanelProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  student: Student | null;
  pack?: AvatarPack;
  onAwarded?: (
    kind: "positive" | "needs_work",
    evolved: boolean,
    nextPoints: number,
    prevPoints: number,
    summary: { label: string; points: number; studentName: string },
  ) => void;
}

export function AwardPanel({
  open,
  onOpenChange,
  student,
  pack = "kids",
  onAwarded,
}: AwardPanelProps) {
  const behaviors = useClassStore((s) =>
    student ? s.classBehaviors(student.classId) : s.behaviors,
  );

  const awardPoints = useClassStore((s) => s.awardPoints);
  const studentPoints = useClassStore((s) => s.studentPoints);
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [stickyId, setStickyId] = useState<string | null>(() => loadLastSkillId());
  const [zoom, setZoom] = useState(false);
  const closeTimer = useState(() => ({ id: 0 as number | null }))[0];

  const positive = behaviors.filter((b) => b.kind === "positive");
  const needsWork = behaviors.filter((b) => b.kind === "needs_work");
  const points = student ? studentPoints(student.id) : 0;
  const tier = getEvolutionTier(points);
  const mark = pack !== "ultra" ? getMilestoneMark(points) : null;
  const nextIn = pointsToNextLevel(points);
  const stickyBehavior = stickyId ? behaviors.find((b) => b.id === stickyId) : null;

  // When opening for a student, restore sticky highlight
  useEffect(() => {
    if (open && student) {
      const last = loadLastSkillId();
      setStickyId(last);
      setSelected(last);
      setZoom(false);
    } else {
      setZoom(false);
    }
  }, [open, student?.id]);

  useEffect(() => {
    return () => {
      if (closeTimer.id != null) window.clearTimeout(closeTimer.id);
    };
  }, [closeTimer]);

  function handleAward(behavior: Behavior) {
    if (!student) return;
    unlockAudio();
    const prev = studentPoints(student.id);
    const event = awardPoints({
      studentId: student.id,
      classId: student.classId,
      behaviorId: behavior.id,
      note: note || undefined,
    });
    if (!event) return;
    const nextPoints = prev + event.points;
    const evolved = didEvolve(prev, nextPoints);
    setSelected(behavior.id);
    saveLastSkillId(behavior.id);
    setStickyId(behavior.id);
    onAwarded?.(behavior.kind, evolved, nextPoints, prev, {
      label: event.behaviorLabel,
      points: event.points,
      studentName: student.name,
    });

    playAwardSound(event.points);
    if (evolved) {
      window.setTimeout(() => playSound("evolve"), 180);
    }

    if (closeTimer.id != null) window.clearTimeout(closeTimer.id);
    closeTimer.id = window.setTimeout(() => {
      setNote("");
      // Keep sticky selected for next open — don't clear stickyId
      onOpenChange(false);
      closeTimer.id = null;
    }, 160);
  }

  const avatar = student ? getAvatar(student.avatarId, pack) : null;
  const zoomSrc = student
    ? getAvatarSrc(student.avatarId, pack, points, "full")
    : "";
  const zoomTitle = student
    ? pack === "ultra"
      ? `${student.name} · ${avatar?.name ?? ""} · ${ULTRA_FORM_NAMES[tier.formStage]}`
      : `${student.name} · ${avatar?.name ?? ""}`
    : "";

  return (
    <>
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && zoom) {
          setZoom(false);
          return;
        }
        if (!next) setZoom(false);
        onOpenChange(next);
      }}
    >
      <DialogContent
        className="max-h-[90dvh] max-w-md overflow-y-auto"
        onPointerDownOutside={(e) => {
          if (zoom) {
            e.preventDefault();
            return;
          }
          onOpenChange(false);
        }}
        onInteractOutside={(e) => {
          if (zoom) {
            e.preventDefault();
            return;
          }
          onOpenChange(false);
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {student && (
              <button
                type="button"
                className="shrink-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                title="Tap to enlarge"
                aria-label={`Enlarge ${student.name}`}
                onClick={() => setZoom(true)}
              >
                <StudentAvatar
                  avatarId={student.avatarId}
                  name={student.name}
                  pack={pack}
                  points={points}
                  size="md"
                  stars={student.stars}
                  frameId={student.frameId}
                  bannerId={student.bannerId}
                  showLevelBadge={false}
                />
              </button>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate">{student?.name ?? "Student"}</span>
              <span className="text-sm font-normal text-muted-fg tabular-nums">
                {points > 0 ? `+${points}` : points} pts
                {pack === "ultra" && tier.level > 0 ? ` · ${tier.name}` : ""}
                {mark ? ` · ${mark.name}` : ""}
                {nextIn > 0 ? ` · ${nextIn} to next` : ""}
              </span>
            </span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Choose a skill for this student
          </DialogDescription>
        </DialogHeader>

        {student && (
          <Link
            to="/class/$classId/student/$studentId"
            params={{ classId: student.classId, studentId: student.id }}
            onClick={() => onOpenChange(false)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-border bg-surface-2 px-3 py-2 text-sm font-semibold text-accent transition hover:border-accent/40 hover:bg-accent/10"
          >
            <Home className="size-4" />
            Open nest
          </Link>
        )}

        {stickyBehavior && (
          <button
            type="button"
            onClick={() => handleAward(stickyBehavior)}
            className="flex w-full items-center justify-between gap-2 rounded-xl border-2 border-accent bg-accent/10 px-3 py-2.5 text-left transition hover:bg-accent/15"
          >
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-wide text-accent">
                Last used
              </span>
              <span className="text-sm font-bold">{stickyBehavior.label}</span>
            </span>
            <span className="text-sm font-bold tabular-nums">
              {formatDelta(stickyBehavior.points)}
            </span>
          </button>
        )}

        <div className="mt-1 space-y-3">
          <Group
            title="Positive"
            color="text-positive"
            items={positive}
            selected={selected}
            stickyId={stickyId}
            onPick={handleAward}
          />
          <Group
            title="Needs work"
            color="text-danger"
            items={needsWork}
            selected={selected}
            stickyId={stickyId}
            onPick={handleAward}
          />
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note"
            className="mt-1"
          />
        </div>
      </DialogContent>
    </Dialog>
    {zoom && student && typeof document !== "undefined"
      ? createPortal(
          <ArtZoom src={zoomSrc} title={zoomTitle} onClose={() => setZoom(false)} />,
          document.body,
        )
      : null}
    </>
  );
}

function Group({
  title,
  color,
  items,
  selected,
  stickyId,
  onPick,
}: {
  title: string;
  color: string;
  items: Behavior[];
  selected: string | null;
  stickyId: string | null;
  onPick: (b: Behavior) => void;
}) {
  return (
    <div>
      <p className={cn("mb-1.5 text-[11px] font-bold uppercase tracking-wide", color)}>
        {title}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((b) => {
          const isSticky = stickyId === b.id;
          return (
            <div
              key={b.id}
              className={cn(
                "relative flex items-stretch rounded-xl border-2 transition",
                selected === b.id || isSticky
                  ? "border-accent bg-accent/10"
                  : "border-border hover:border-accent/40",
              )}
            >
              <button
                type="button"
                onClick={() => onPick(b)}
                className="flex min-w-0 flex-1 items-center gap-2 px-2.5 py-2 text-left"
              >
                <SkillIcon icon={b.icon} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{b.label}</span>
                  <span className="text-xs font-bold tabular-nums">
                    {formatDelta(b.points)}
                  </span>
                </span>
              </button>
              <div className="flex items-start pr-1 pt-1">
                <FavoriteSkillToggle behaviorId={b.id} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
