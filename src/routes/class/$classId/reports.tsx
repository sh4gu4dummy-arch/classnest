import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, Printer, Search, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { StudentAvatar } from "@/components/student-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AvatarPack } from "@/lib/avatars";
import { resolvePack } from "@/lib/avatars";
import { getEvolutionTier, getMilestoneMark } from "@/lib/evolution";
import {
  dailyChart,
  downloadText,
  filterEvents,
  formatWhen,
  leaderboardRows,
  rangeForScope,
  skillBreakdown,
  sumPoints,
  toCsv,
  type PointsScope,
} from "@/lib/points";
import { useClassStore } from "@/lib/store";
import { useHydratedStore } from "@/lib/use-hydrated-store";
import { cn, toDateInputValue } from "@/lib/utils";

export const Route = createFileRoute("/class/$classId/reports")({
  component: ReportsPage,
});

const SCOPES: { id: PointsScope; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "7 days" },
  { id: "month", label: "30 days" },
  { id: "all", label: "All time" },
  { id: "custom", label: "Custom" },
];

function ReportsPage() {
  const { classId } = Route.useParams();
  const navigate = useNavigate();
  const ready = useHydratedStore();
  const classroom = useClassStore((s) => s.classes.find((c) => c.id === classId));
  const classStudents = useClassStore((s) => s.classStudents);
  const classEvents = useClassStore((s) => s.classEvents);
  const studentPoints = useClassStore((s) => s.studentPoints);
  const undoEvent = useClassStore((s) => s.undoEvent);

  const pack: AvatarPack = resolvePack(classroom?.avatarPack);
  const students = useMemo(() => classStudents(classId), [classStudents, classId, ready]);
  const allEvents = useMemo(() => classEvents(classId), [classEvents, classId, ready]);

  const [scope, setScope] = useState<PointsScope>("week");
  const [customFrom, setCustomFrom] = useState(() =>
    toDateInputValue(Date.now() - 6 * 86400000),
  );
  const [customTo, setCustomTo] = useState(() => toDateInputValue(Date.now()));
  const [studentFilter, setStudentFilter] = useState<string>("all");
  const [kindFilter, setKindFilter] = useState<"all" | "positive" | "needs_work">("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "behavior" | "spar" | "shop">("all");
  const [query, setQuery] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  useEffect(() => {
    if (ready && !classroom) {
      void navigate({ to: "/" });
    }
  }, [ready, classroom, navigate]);

  const range = useMemo(
    () => rangeForScope(scope, customFrom, customTo),
    [scope, customFrom, customTo],
  );

  const rangedEvents = useMemo(
    () =>
      filterEvents(allEvents, {
        classId,
        range,
        studentId: studentFilter === "all" ? undefined : studentFilter,
        kind: kindFilter,
        source: sourceFilter,
        query,
      }),
    [allEvents, classId, range, studentFilter, kindFilter, sourceFilter, query],
  );

  const leaderboard = useMemo(() => {
    let rows = leaderboardRows(students, allEvents, range);
    if (nameSearch.trim()) {
      const q = nameSearch.trim().toLowerCase();
      rows = rows.filter((r) => r.student.name.toLowerCase().includes(q));
    }
    return rows;
  }, [students, allEvents, range, nameSearch]);

  const skills = useMemo(() => skillBreakdown(rangedEvents), [rangedEvents]);
  const chart = useMemo(() => dailyChart(rangedEvents, range), [rangedEvents, range]);

  const netPoints = sumPoints(rangedEvents);
  const positiveCount = rangedEvents.filter((e) => e.kind === "positive").length;
  const needsCount = rangedEvents.filter((e) => e.kind === "needs_work").length;

  const activity = useMemo(
    () =>
      [...rangedEvents]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 80),
    [rangedEvents],
  );

  const studentName = (id: string) =>
    students.find((s) => s.id === id)?.name ?? "Unknown";

  function exportLeaderboard() {
    const csv = toCsv(
      leaderboard.map((r, i) => ({
        rank: i + 1,
        name: r.student.name,
        points: r.points,
        positive: r.positive,
        needs: r.needs,
        awards: r.awards,
        lifetime: studentPoints(r.student.id),
      })),
      [
        { key: "rank", header: "Rank" },
        { key: "name", header: "Student" },
        { key: "points", header: `Points (${range.label})` },
        { key: "positive", header: "Positive awards" },
        { key: "needs", header: "Needs-work awards" },
        { key: "awards", header: "Total awards" },
        { key: "lifetime", header: "All-time points" },
      ],
    );
    downloadText(
      `classnest-${classroom?.name ?? "class"}-${range.scope}-leaderboard.csv`,
      csv,
    );
    toast.success("Leaderboard CSV downloaded");
  }

  function exportActivity() {
    const csv = toCsv(
      activity.map((e) => ({
        when: new Date(e.createdAt).toISOString(),
        student: studentName(e.studentId),
        skill: e.behaviorLabel,
        kind: e.kind,
        points: e.points,
        source: e.source ?? "behavior",
        note: e.note ?? "",
      })),
      [
        { key: "when", header: "When" },
        { key: "student", header: "Student" },
        { key: "skill", header: "Skill / tag" },
        { key: "kind", header: "Kind" },
        { key: "points", header: "Points" },
        { key: "source", header: "Source" },
        { key: "note", header: "Note" },
      ],
    );
    downloadText(
      `classnest-${classroom?.name ?? "class"}-${range.scope}-activity.csv`,
      csv,
    );
    toast.success("Activity CSV downloaded");
  }

  if (!ready || !classroom) {
    return (
      <AppShell title="Reports">
        <div className="h-48 animate-pulse rounded-2xl bg-surface-2" />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Reports"
      subtitle={classroom.name}
      backTo={`/class/${classId}`}
      backLabel="Board"
      className="!max-w-6xl"
      actions={
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="gap-1.5 no-print"
          onClick={() => window.print()}
        >
          <Printer className="size-3.5" />
          Print
        </Button>
      }
    >
      {/* Print-only header */}
      <div className="mb-4 hidden print:block">
        <h1 className="text-xl font-bold">{classroom.name} — Reports</h1>
        <p className="text-sm">
          {range.label} · printed {new Date().toLocaleString()}
        </p>
      </div>

      <div className="mb-5 space-y-3 rounded-2xl border-2 border-border bg-surface p-3 shadow-sm sm:p-4 no-print">
        <div className="flex flex-wrap gap-1.5">
          {SCOPES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setScope(s.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-bold transition",
                scope === s.id
                  ? "bg-accent text-accent-fg shadow-sm"
                  : "bg-surface-2 text-muted-fg hover:text-fg",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {scope === "custom" && (
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="from">From</Label>
              <Input
                id="from"
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <Label htmlFor="stu">Student</Label>
            <select
              id="stu"
              className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm"
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
            >
              <option value="all">All students</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="kind">Kind</Label>
            <select
              id="kind"
              className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm"
              value={kindFilter}
              onChange={(e) =>
                setKindFilter(e.target.value as "all" | "positive" | "needs_work")
              }
            >
              <option value="all">All kinds</option>
              <option value="positive">Positive only</option>
              <option value="needs_work">Needs work only</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="src">Source</Label>
            <select
              id="src"
              className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm"
              value={sourceFilter}
              onChange={(e) =>
                setSourceFilter(e.target.value as "all" | "behavior" | "spar" | "shop")
              }
            >
              <option value="all">All sources</option>
              <option value="behavior">Skills / awards</option>
              <option value="spar">Spar</option>
              <option value="shop">Shop</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="q">Search skills / notes</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-fg" />
              <Input
                id="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Kindness, spar…"
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-fg">
          Showing <span className="font-semibold text-fg">{range.label}</span>
          {studentFilter !== "all" && (
            <>
              {" "}
              · <span className="font-semibold text-fg">{studentName(studentFilter)}</span>
            </>
          )}
          {" · "}
          {rangedEvents.length} events
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 print-report">
        <Stat
          label={`Net points · ${range.label}`}
          value={netPoints > 0 ? `+${netPoints}` : String(netPoints)}
          accent="positive"
        />
        <Stat label="Positive awards" value={String(positiveCount)} accent="positive" />
        <Stat label="Needs-work" value={String(needsCount)} />
        <Stat label="Students" value={String(students.length)} accent="accent" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 no-print">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity chart</CardTitle>
            <CardDescription>Positive vs needs-work by day · {range.label}</CardDescription>
          </CardHeader>
          <CardContent className="h-56">
            {rangedEvents.length === 0 ? (
              <Empty />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={28} />
                  <Tooltip />
                  <Bar dataKey="positive" name="Positive" fill="var(--color-positive)" radius={4} />
                  <Bar dataKey="needs" name="Needs work" fill="var(--color-danger)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skills in range</CardTitle>
            <CardDescription>Most used tags · filtered</CardDescription>
          </CardHeader>
          <CardContent>
            {skills.length === 0 ? (
              <Empty />
            ) : (
              <ul className="max-h-56 space-y-2 overflow-y-auto">
                {skills.slice(0, 12).map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border/70 px-3 py-2"
                  >
                    <span className="truncate text-sm font-semibold">{b.label}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-fg tabular-nums">×{b.count}</span>
                      <Badge
                        variant={b.kind === "positive" ? "positive" : "danger"}
                        className="tabular-nums"
                      >
                        {b.points > 0 ? `+${b.points}` : b.points}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 print-report">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Leaderboard · {range.label}</CardTitle>
            <CardDescription>
              Ranked by points in this range · lifetime used for evolution art
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2 no-print">
            <div className="relative min-w-[10rem] flex-1 sm:flex-none">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-fg" />
              <Input
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                placeholder="Find student…"
                className="h-9 pl-9"
              />
            </div>
            <Button type="button" size="sm" variant="secondary" className="gap-1.5" onClick={exportLeaderboard}>
              <Download className="size-3.5" />
              CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <Empty />
          ) : (
            <ul className="divide-y divide-border/80">
              {leaderboard.map((row, i) => {
                const life = studentPoints(row.student.id);
                const tier = getEvolutionTier(life);
                const mark = pack !== "ultra" ? getMilestoneMark(life) : null;
                return (
                  <li
                    key={row.student.id}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                        i === 0 && "bg-accent text-accent-fg",
                        i > 0 && i <= 2 && "bg-surface-2 text-fg",
                        i > 2 && "text-muted-fg",
                      )}
                    >
                      {i + 1}
                    </span>
                    <StudentAvatar
                      avatarId={row.student.avatarId}
                      name={row.student.name}
                      pack={pack}
                      points={life}
                      size="sm"
                      stars={row.student.stars}
                      frameId={row.student.frameId}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {row.student.name}
                      </span>
                      <span className="text-[10px] text-muted-fg tabular-nums">
                        {row.positive}+ / {row.needs}− · life {life > 0 ? `+${life}` : life}
                        {mark ? (
                          <span className="ml-1 font-bold" style={{ color: mark.color }}>
                            · {mark.name}
                          </span>
                        ) : (
                          tier.level > 0 && (
                          <span className="ml-1 font-bold" style={{ color: tier.color }}>
                            · {tier.name} Lv{tier.level}
                          </span>
                          )
                        )}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "text-sm font-bold tabular-nums",
                        row.points >= 0 ? "text-positive" : "text-danger",
                      )}
                    >
                      {row.points > 0 ? `+${row.points}` : row.points}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4 no-print">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Activity log</CardTitle>
            <CardDescription>
              Detailed timeline · undo mistakes · export filtered rows
            </CardDescription>
          </div>
          <Button type="button" size="sm" variant="secondary" className="gap-1.5" onClick={exportActivity}>
            <Download className="size-3.5" />
            Export log
          </Button>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <Empty />
          ) : (
            <ul className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
              {activity.map((e) => (
                <li
                  key={e.id}
                  className="flex items-start gap-2 rounded-xl border border-border/70 bg-surface-2/40 px-3 py-2"
                >
                  <Badge
                    variant={e.kind === "positive" ? "positive" : "danger"}
                    className="mt-0.5 shrink-0 tabular-nums"
                  >
                    {e.points > 0 ? `+${e.points}` : e.points}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                      <span className="text-fg">{studentName(e.studentId).split(" ")[0]}</span>
                      <span className="font-medium text-muted-fg"> · {e.behaviorLabel}</span>
                    </p>
                    <p className="text-[11px] text-muted-fg">
                      {formatWhen(e.createdAt)}
                      {e.source && e.source !== "behavior" ? ` · ${e.source}` : ""}
                      {e.note ? ` · “${e.note}”` : ""}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="shrink-0 text-muted-fg"
                    title="Undo this award"
                    aria-label="Undo"
                    onClick={() => {
                      undoEvent(e.id);
                      toast.message("Award undone");
                    }}
                  >
                    <Undo2 className="size-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "positive" | "accent";
}) {
  return (
    <div className="rounded-2xl border-2 border-border bg-surface px-3 py-3 shadow-sm">
      <p className="text-xs font-medium text-muted-fg">{label}</p>
      <p
        className={cn(
          "mt-0.5 text-xl font-bold tabular-nums",
          accent === "positive" && "text-positive",
          accent === "accent" && "text-accent",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Empty() {
  return (
    <p className="py-10 text-center text-sm text-muted-fg">
      No events in this range. Try All time or award some points.
    </p>
  );
}
