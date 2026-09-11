import type { PointEvent, Student } from "./types";
import { startOfDay } from "./utils";

export type PointsScope = "today" | "week" | "month" | "all" | "custom";

export type TimeRange = {
  scope: PointsScope;
  /** Inclusive start (ms). null = unbounded */
  from: number | null;
  /** Exclusive end (ms). null = unbounded (now+) */
  to: number | null;
  label: string;
};

const DAY = 86400000;

export function rangeForScope(
  scope: PointsScope,
  customFrom?: string,
  customTo?: string,
  now = Date.now(),
): TimeRange {
  const today0 = startOfDay(now);

  if (scope === "today") {
    return { scope, from: today0, to: today0 + DAY, label: "Today" };
  }
  if (scope === "week") {
    // Last 7 days including today
    return {
      scope,
      from: today0 - 6 * DAY,
      to: today0 + DAY,
      label: "Last 7 days",
    };
  }
  if (scope === "month") {
    return {
      scope,
      from: today0 - 29 * DAY,
      to: today0 + DAY,
      label: "Last 30 days",
    };
  }
  if (scope === "custom") {
    const from = customFrom
      ? startOfDay(new Date(customFrom + "T00:00:00").getTime())
      : null;
    let to: number | null = null;
    if (customTo) {
      to = startOfDay(new Date(customTo + "T00:00:00").getTime()) + DAY;
    }
    const label =
      customFrom || customTo
        ? `${customFrom || "…"} → ${customTo || "…"}`
        : "Custom range";
    return { scope, from, to, label };
  }
  return { scope: "all", from: null, to: null, label: "All time" };
}

export function isShopSpend(e: PointEvent): boolean {
  return e.source === "shop" || e.behaviorId === "shop_buy";
}

export function eventInRange(e: PointEvent, range: TimeRange): boolean {
  if (range.from != null && e.createdAt < range.from) return false;
  if (range.to != null && e.createdAt >= range.to) return false;
  return true;
}

export function filterEvents(
  events: PointEvent[],
  opts: {
    classId?: string;
    studentId?: string;
    range?: TimeRange;
    kind?: "positive" | "needs_work" | "all";
    source?: PointEvent["source"] | "all";
    query?: string;
  },
): PointEvent[] {
  const q = opts.query?.trim().toLowerCase() ?? "";
  return events.filter((e) => {
    if (opts.classId && e.classId !== opts.classId) return false;
    if (opts.studentId && e.studentId !== opts.studentId) return false;
    if (opts.range && !eventInRange(e, opts.range)) return false;
    if (opts.kind && opts.kind !== "all" && e.kind !== opts.kind) return false;
    if (opts.source && opts.source !== "all" && (e.source ?? "behavior") !== opts.source)
      return false;
    if (q) {
      const hay = `${e.behaviorLabel} ${e.note ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function sumPoints(events: PointEvent[]): number {
  return events.reduce((s, e) => (isShopSpend(e) ? s : s + e.points), 0);
}

export function sumShopSpent(events: PointEvent[]): number {
  return events.reduce((s, e) => {
    if (!isShopSpend(e) || e.points >= 0) return s;
    return s + -e.points;
  }, 0);
}

export function studentPointsInEvents(
  events: PointEvent[],
  studentId: string,
  range?: TimeRange,
): number {
  return sumPoints(
    events.filter(
      (e) => e.studentId === studentId && (!range || eventInRange(e, range)),
    ),
  );
}

export function leaderboardRows(
  students: Student[],
  events: PointEvent[],
  range?: TimeRange,
) {
  return students
    .map((student) => {
      const scoped = events.filter(
        (e) => e.studentId === student.id && (!range || eventInRange(e, range)),
      );
      const points = sumPoints(scoped);
      const positive = scoped.filter((e) => e.kind === "positive").length;
      const needs = scoped.filter((e) => e.kind === "needs_work").length;
      return { student, points, positive, needs, awards: scoped.length };
    })
    .sort((a, b) => b.points - a.points || a.student.name.localeCompare(b.student.name));
}

export function skillBreakdown(events: PointEvent[]) {
  const map = new Map<
    string,
    { id: string; label: string; kind: string; count: number; points: number }
  >();
  for (const e of events) {
    const cur = map.get(e.behaviorId) ?? {
      id: e.behaviorId,
      label: e.behaviorLabel,
      kind: e.kind,
      count: 0,
      points: 0,
    };
    cur.count += 1;
    cur.points += e.points;
    map.set(e.behaviorId, cur);
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

/** Daily buckets for chart (inclusive of from..to-1). */
export function dailyChart(events: PointEvent[], range: TimeRange, maxDays = 31) {
  const now = Date.now();
  const end = range.to ?? startOfDay(now) + DAY;
  const start =
    range.from ??
    Math.max(startOfDay(now) - (maxDays - 1) * DAY, end - maxDays * DAY);

  const days: { label: string; positive: number; needs: number; net: number; day: number }[] =
    [];
  for (let t = start; t < end && days.length < maxDays; t += DAY) {
    const dayEvents = events.filter((e) => e.createdAt >= t && e.createdAt < t + DAY);
    const d = new Date(t);
    days.push({
      label: d.toLocaleDateString(undefined, {
        month: days.length === 0 || d.getDate() === 1 ? "short" : undefined,
        day: "numeric",
        weekday: range.scope === "week" || range.scope === "today" ? "short" : undefined,
      }),
      positive: dayEvents.filter((e) => e.kind === "positive").length,
      needs: dayEvents.filter((e) => e.kind === "needs_work").length,
      net: sumPoints(dayEvents),
      day: t,
    });
  }
  return days;
}

export function formatWhen(ts: number): string {
  const d = new Date(ts);
  const today0 = startOfDay(Date.now());
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (ts >= today0 && ts < today0 + DAY) return `Today ${time}`;
  if (ts >= today0 - DAY && ts < today0) return `Yesterday ${time}`;
  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " " + time
  );
}

export function toCsv(
  rows: Record<string, string | number>[],
  columns: { key: string; header: string }[],
): string {
  const esc = (v: string | number) => {
    const s = String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [
    columns.map((c) => esc(c.header)).join(","),
    ...rows.map((r) => columns.map((c) => esc(r[c.key] ?? "")).join(",")),
  ];
  return lines.join("\n");
}

export function downloadText(filename: string, text: string, mime = "text/csv") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const BOARD_SCOPE_KEY = "classnest-board-scope";

export type BoardPointsMode = "today" | "all" | "season";

export function loadBoardPointsMode(classId: string): BoardPointsMode {
  try {
    const raw = sessionStorage.getItem(`${BOARD_SCOPE_KEY}:${classId}`);
    if (raw === "today" || raw === "all" || raw === "season") return raw;
  } catch {
    /* ignore */
  }
  return "all";
}

export function saveBoardPointsMode(classId: string, mode: BoardPointsMode) {
  try {
    sessionStorage.setItem(`${BOARD_SCOPE_KEY}:${classId}`, mode);
  } catch {
    /* ignore */
  }
}
