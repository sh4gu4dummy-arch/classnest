import { useMemo } from "react";
import { Copy, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  leaderboardRows,
  rangeForScope,
  skillBreakdown,
  sumPoints,
} from "@/lib/points";
import type { PointEvent, Student } from "@/lib/types";
import { getEvolutionLevel } from "@/lib/evolution";

interface WeekSnapshotProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  className: string;
  students: Student[];
  events: PointEvent[];
  lifetimeOf: (id: string) => number;
}

export function WeekSnapshot({
  open,
  onOpenChange,
  className,
  students,
  events,
  lifetimeOf,
}: WeekSnapshotProps) {
  const range = useMemo(() => rangeForScope("week"), []);
  const weekEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          e.createdAt >= (range.from ?? 0) &&
          e.createdAt < (range.to ?? Infinity),
      ),
    [events, range],
  );

  const net = sumPoints(weekEvents);
  const positive = weekEvents.filter((e) => e.kind === "positive").length;
  const needs = weekEvents.filter((e) => e.kind === "needs_work").length;
  const board = leaderboardRows(students, weekEvents, range);
  const top = board.filter((r) => r.points > 0).slice(0, 5);
  const skills = skillBreakdown(weekEvents.filter((e) => e.points > 0)).slice(0, 5);
  const evolutions = students.filter((s) => {
    // crude: if lifetime crossed a 10-pt boundary this week — check events pushed them
    const weekPts = board.find((r) => r.student.id === s.id)?.points ?? 0;
    if (weekPts <= 0) return false;
    const life = lifetimeOf(s.id);
    const prev = life - weekPts;
    return getEvolutionLevel(life) > getEvolutionLevel(prev);
  });

  const text = buildShareText({
    className,
    rangeLabel: range.label,
    net,
    positive,
    needs,
    top: top.map((r) => ({ name: r.student.name, points: r.points })),
    skills: skills.map((s) => ({ label: s.label, count: s.count })),
    evolved: evolutions.map((s) => s.name),
  });

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Weekly snapshot copied");
    } catch {
      toast.error("Copy failed");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="size-5 text-accent" />
            Weekly parent snapshot
          </DialogTitle>
          <DialogDescription>
            {className} · {range.label} · friendly summary to copy or print
          </DialogDescription>
        </DialogHeader>

        <div id="week-snapshot-print" className="mt-2 space-y-4 print-report">
          <div className="rounded-2xl border-2 border-border bg-surface-2/50 p-3">
            <p className="text-sm font-bold">{className}</p>
            <p className="text-xs text-muted-fg">{range.label}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Mini label="Net" value={net > 0 ? `+${net}` : String(net)} />
              <Mini label="Positive" value={String(positive)} />
              <Mini label="Redirects" value={String(needs)} />
            </div>
          </div>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-fg">
              Standouts this week
            </h3>
            {top.length === 0 ? (
              <p className="mt-1 text-sm text-muted-fg">No points logged yet this week.</p>
            ) : (
              <ol className="mt-2 space-y-1.5">
                {top.map((r, i) => (
                  <li
                    key={r.student.id}
                    className="flex justify-between rounded-lg border border-border/70 px-2.5 py-1.5 text-sm"
                  >
                    <span>
                      <span className="mr-1.5 tabular-nums text-muted-fg">{i + 1}.</span>
                      {r.student.name}
                    </span>
                    <span className="font-bold tabular-nums text-positive">
                      +{r.points}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {skills.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wide text-muted-fg">
                Top skills celebrated
              </h3>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-full bg-positive/15 px-2.5 py-0.5 text-xs font-semibold text-positive"
                  >
                    {s.label} ×{s.count}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {evolutions.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wide text-muted-fg">
                Milestones this week
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {evolutions.map((s) => s.name.split(" ")[0]).join(", ")}
              </p>
            </section>
          )}

          <p className="text-[11px] leading-relaxed text-muted-fg">
            ClassNest celebrates effort with points and milestones. This is a classroom
            motivation tool — not a grade.
          </p>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:gap-2">
          <Button type="button" variant="secondary" className="gap-1.5" onClick={copy}>
            <Copy className="size-3.5" />
            Copy text
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="gap-1.5"
            onClick={() => window.print()}
          >
            <Printer className="size-3.5" />
            Print
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface px-2 py-2">
      <p className="text-[10px] text-muted-fg">{label}</p>
      <p className="text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}

function buildShareText(opts: {
  className: string;
  rangeLabel: string;
  net: number;
  positive: number;
  needs: number;
  top: { name: string; points: number }[];
  skills: { label: string; count: number }[];
  evolved: string[];
}): string {
  const lines = [
    `${opts.className} — week in review (${opts.rangeLabel})`,
    "",
    `Net points: ${opts.net > 0 ? "+" : ""}${opts.net}`,
    `Positive awards: ${opts.positive}`,
    `Redirects: ${opts.needs}`,
  ];
  if (opts.top.length) {
    lines.push("", "Standouts:");
    opts.top.forEach((t, i) => {
      lines.push(`  ${i + 1}. ${t.name} (+${t.points})`);
    });
  }
  if (opts.skills.length) {
    lines.push(
      "",
      "Top skills: " + opts.skills.map((s) => `${s.label} (×${s.count})`).join(", "),
    );
  }
  if (opts.evolved.length) {
    lines.push("", "Milestones: " + opts.evolved.join(", "));
  }
  lines.push(
    "",
    "Shared from ClassNest — classroom motivation, not a grade report.",
  );
  return lines.join("\n");
}
