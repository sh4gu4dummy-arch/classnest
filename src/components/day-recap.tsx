import { useRef, useState } from "react";
import { Download, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { rangeForScope, studentPointsInEvents, sumPoints } from "@/lib/points";
import type { PointEvent, Student } from "@/lib/types";

interface DayRecapProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  students: Student[];
  events: PointEvent[];
  className: string;
}

export function DayRecap({
  open,
  onOpenChange,
  students,
  events,
  className,
}: DayRecapProps) {
  const range = rangeForScope("today");
  const today = events.filter(
    (e) => e.createdAt >= (range.from ?? 0) && e.createdAt < (range.to ?? Infinity),
  );
  const net = sumPoints(today);
  const positive = today.filter((e) => e.kind === "positive").length;
  const needs = today.filter((e) => e.kind === "needs_work").length;
  const warnings = today.filter((e) => e.points === 0).length;
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const top = students
    .map((s) => ({
      student: s,
      pts: studentPointsInEvents(today, s.id),
    }))
    .filter((r) => r.pts !== 0)
    .sort((a, b) => b.pts - a.pts)
    .slice(0, 5);

  async function exportImage() {
    setExporting(true);
    try {
      const canvas = document.createElement("canvas");
      const w = 720;
      const h = 520;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Warm paper background
      ctx.fillStyle = "#fff4e8";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, 28, 28, w - 56, h - 56, 24);
      ctx.fill();

      ctx.fillStyle = "#1e1b2e";
      ctx.font = "bold 28px system-ui, sans-serif";
      ctx.fillText("End-of-day recap", 56, 80);
      ctx.font = "16px system-ui, sans-serif";
      ctx.fillStyle = "#6b6480";
      ctx.fillText(`${className} · ${new Date().toLocaleDateString()}`, 56, 108);

      const stats = [
        ["Net", net > 0 ? `+${net}` : String(net)],
        ["Positive", String(positive)],
        ["Needs work", String(needs)],
        ["Warnings", String(warnings)],
      ];
      stats.forEach(([label, value], i) => {
        const x = 56 + i * 155;
        ctx.fillStyle = "#ffe8d6";
        roundRect(ctx, x, 130, 140, 72, 14);
        ctx.fill();
        ctx.fillStyle = "#6b6480";
        ctx.font = "12px system-ui, sans-serif";
        ctx.fillText(label!, x + 14, 154);
        ctx.fillStyle = "#1e1b2e";
        ctx.font = "bold 22px system-ui, sans-serif";
        ctx.fillText(value!, x + 14, 184);
      });

      ctx.fillStyle = "#6b6480";
      ctx.font = "bold 12px system-ui, sans-serif";
      ctx.fillText("TOP TODAY", 56, 240);

      if (top.length === 0) {
        ctx.fillStyle = "#6b6480";
        ctx.font = "16px system-ui, sans-serif";
        ctx.fillText("No point changes yet today.", 56, 275);
      } else {
        top.forEach((r, i) => {
          const y = 260 + i * 40;
          ctx.fillStyle = "#fff4e8";
          roundRect(ctx, 56, y, w - 112, 34, 10);
          ctx.fill();
          ctx.fillStyle = "#1e1b2e";
          ctx.font = "16px system-ui, sans-serif";
          ctx.fillText(`${i + 1}. ${r.student.name}`, 72, y + 23);
          ctx.fillStyle = r.pts >= 0 ? "#16a34a" : "#e11d48";
          ctx.font = "bold 16px system-ui, sans-serif";
          const pts = r.pts > 0 ? `+${r.pts}` : String(r.pts);
          ctx.fillText(pts, w - 120, y + 23);
        });
      }

      ctx.fillStyle = "#0d9488";
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.fillText("ClassNest", 56, h - 48);

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `classnest-recap-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setExporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="size-5 text-amber-500" />
            End-of-day recap
          </DialogTitle>
          <DialogDescription>{className} · today</DialogDescription>
        </DialogHeader>

        <div ref={cardRef} className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Net points" value={net > 0 ? `+${net}` : String(net)} />
          <Stat label="Positive" value={String(positive)} />
          <Stat label="Needs work" value={String(needs)} />
          <Stat label="Warnings" value={String(warnings)} />
        </div>

        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-fg">
            Top today
          </p>
          {top.length === 0 ? (
            <p className="mt-2 text-sm text-muted-fg">No point changes yet today.</p>
          ) : (
            <ol className="mt-2 space-y-2">
              {top.map((r, i) => (
                <li
                  key={r.student.id}
                  className="flex items-center justify-between rounded-xl border border-border px-3 py-2"
                >
                  <span className="text-sm font-semibold">
                    <span className="mr-2 tabular-nums text-muted-fg">{i + 1}.</span>
                    {r.student.name}
                  </span>
                  <span
                    className={
                      r.pts >= 0
                        ? "text-sm font-bold tabular-nums text-positive"
                        : "text-sm font-bold tabular-nums text-danger"
                    }
                  >
                    {r.pts > 0 ? `+${r.pts}` : r.pts}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <DialogFooter className="mt-4 gap-2 sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            className="gap-1.5"
            disabled={exporting}
            onClick={() => void exportImage()}
          >
            <Download className="size-3.5" />
            Save image
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2/60 px-2 py-2 text-center">
      <p className="text-[10px] text-muted-fg">{label}</p>
      <p className="text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
