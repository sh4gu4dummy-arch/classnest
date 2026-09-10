import { useMemo } from "react";
import { Printer } from "lucide-react";
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
import {
  PACK_SHORT,
  ULTRA_FORM_NAMES,
  resolvePack,
  type AvatarPack,
} from "@/lib/avatars";
import { getEvolutionTier, getMilestoneMark } from "@/lib/evolution";
import { rangeForScope, sumPoints } from "@/lib/points";
import { useClassStore } from "@/lib/store";
import type { Student } from "@/lib/types";

interface PrintSlipProps {
  student: Student;
  className?: string;
  /** compact trigger for nest / board */
  size?: "sm" | "icon";
}

export function PrintSlip({ student, className, size = "sm" }: PrintSlipProps) {
  const classroom = useClassStore((s) =>
    s.classes.find((c) => c.id === student.classId),
  );
  const studentEvents = useClassStore((s) => s.studentEvents);
  const studentPoints = useClassStore((s) => s.studentPoints);

  const pack: AvatarPack = resolvePack(classroom?.avatarPack);
  const points = studentPoints(student.id);
  const tier = getEvolutionTier(points);
  const events = studentEvents(student.id);

  const week = useMemo(() => {
    const range = rangeForScope("week");
    const inWeek = events.filter(
      (e) =>
        e.createdAt >= (range.from ?? 0) && e.createdAt < (range.to ?? Infinity),
    );
    const net = sumPoints(inWeek);
    const skillMap = new Map<string, number>();
    for (const e of inWeek) {
      if ((e.source ?? "behavior") !== "behavior") continue;
      skillMap.set(
        e.behaviorLabel,
        (skillMap.get(e.behaviorLabel) ?? 0) + e.points,
      );
    }
    const topSkills = [...skillMap.entries()]
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .slice(0, 5);
    return { net, count: inWeek.length, topSkills };
  }, [events]);

  const formLabel =
    pack === "ultra"
      ? `${ULTRA_FORM_NAMES[tier.formStage]}${tier.level > 0 ? ` · Lv${tier.level}` : ""}`
      : getMilestoneMark(points)?.name ?? "Starter";

  function handlePrint() {
    window.print();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          size={size === "icon" ? "icon-sm" : "sm"}
          variant="secondary"
          className={className}
          title="Print parent / home slip"
          aria-label="Print parent slip"
        >
          <Printer className="size-3.5" />
          {size !== "icon" && <span className="ml-1.5">Print slip</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md print:max-w-none print:border-0 print:shadow-none">
        <DialogHeader className="print:hidden">
          <DialogTitle>Parent / home slip</DialogTitle>
          <DialogDescription>
            Print or save as PDF for folders and home communication.
          </DialogDescription>
        </DialogHeader>

        <div id="classnest-print-slip" className="space-y-4 rounded-2xl border-2 border-border bg-surface p-4 print:border-black">
          <div className="flex items-center gap-3">
            <StudentAvatar
              avatarId={student.avatarId}
              name={student.name}
              pack={pack}
              points={points}
              size="md"
            />
            <div>
              <p className="text-lg font-bold">{student.name}</p>
              <p className="text-sm text-muted-fg">
                {classroom?.name ?? "Class"}
                {classroom?.grade ? ` · ${classroom.grade}` : ""}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
                {PACK_SHORT[pack]} pack · {formLabel}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-xl border border-border bg-surface-2 px-3 py-2">
              <p className="text-xs text-muted-fg">All-time points</p>
              <p className="text-xl font-bold tabular-nums">
                {points > 0 ? `+${points}` : points}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface-2 px-3 py-2">
              <p className="text-xs text-muted-fg">This week (net)</p>
              <p className="text-xl font-bold tabular-nums">
                {week.net > 0 ? `+${week.net}` : week.net}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-fg">
              Top skills this week
            </p>
            {week.topSkills.length === 0 ? (
              <p className="text-sm text-muted-fg">No awards logged this week yet.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {week.topSkills.map(([label, pts]) => (
                  <li
                    key={label}
                    className="flex justify-between rounded-lg border border-border px-2 py-1"
                  >
                    <span>{label}</span>
                    <span className="font-bold tabular-nums">
                      {pts > 0 ? `+${pts}` : pts}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="text-[11px] text-muted-fg">
            Printed {new Date().toLocaleDateString()} · ClassNest
          </p>
        </div>

        <Button type="button" className="gap-1.5 print:hidden" onClick={handlePrint}>
          <Printer className="size-4" />
          Print / Save PDF
        </Button>
      </DialogContent>
    </Dialog>
  );
}
