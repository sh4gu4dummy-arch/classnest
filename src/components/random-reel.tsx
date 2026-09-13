import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { AvatarPack } from "@/lib/avatars";
import { getAvatarSrc } from "@/lib/avatars";
import { getOverlayRoot } from "@/lib/overlay-root";
import { playSound, unlockAudio } from "@/lib/sounds";
import type { Student } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Slot + window must be taller than the face. Do not shrink these. */
export const REEL_SLOT = 128;
export const REEL_FACE = 96;
export const REEL_WINDOW_H = 208;
export const REEL_HOLD_MS = 2200;

function prefersReduceMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function wrapDelta(i: number, current: number, n: number) {
  let delta = i - (((current % n) + n) % n);
  while (delta > n / 2) delta -= n;
  while (delta <= -n / 2) delta += n;
  return delta;
}

function ReelFace({
  student,
  pack,
  points,
}: {
  student: Student;
  pack: AvatarPack;
  points: number;
}) {
  const src = getAvatarSrc(student.avatarId, pack, points, "board");
  return (
    <img
      src={src}
      alt={student.name}
      width={REEL_FACE}
      height={REEL_FACE}
      draggable={false}
      className="rounded-2xl bg-black/30 object-contain"
      style={{ width: REEL_FACE, height: REEL_FACE }}
    />
  );
}

export function RandomReel({
  pool,
  winner,
  pack,
  pointsOf,
  onDone,
}: {
  pool: Student[];
  winner: Student;
  pack: AvatarPack;
  pointsOf: (id: string) => number;
  onDone: () => void;
}) {
  const faces = pool.length > 0 ? pool : [winner];
  const n = faces.length;
  const winnerIndex = Math.max(
    0,
    faces.findIndex((s) => s.id === winner.id),
  );
  const spins = n <= 6 ? 3 : 2;
  const landAt = spins * n + winnerIndex;
  const duration = Math.min(2200, Math.max(1200, 85 * landAt));

  const windowRef = useRef<HTMLDivElement>(null);
  const lastSlot = useRef(-1);
  const [offset, setOffset] = useState(0);
  const [landed, setLanded] = useState(false);
  const doneOnce = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const pointsMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of faces) m.set(s.id, pointsOf(s.id));
    m.set(winner.id, pointsOf(winner.id));
    return m;
  }, [faces, winner.id, pointsOf]);

  function finishNow() {
    if (doneOnce.current) return;
    doneOnce.current = true;
    onDoneRef.current();
  }

  useEffect(() => {
    unlockAudio();
    const reduce = prefersReduceMotion() || n <= 1;

    const finish = () => {
      setOffset(landAt);
      playSound("land");
      setLanded(true);
    };

    if (reduce) {
      finish();
      return;
    }

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 4;
      const cur = eased * landAt;
      setOffset(cur);
      const slot = Math.floor(cur);
      if (slot !== lastSlot.current && slot >= 0) {
        lastSlot.current = slot;
        playSound("tick");
      }
      if (t < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, landAt, n]);

  useEffect(() => {
    if (!landed) return;
    const t = window.setTimeout(finishNow, REEL_HOLD_MS);
    return () => window.clearTimeout(t);
  }, [landed]);

  if (typeof document === "undefined") return null;

  const first = winner.name.split(" ")[0] ?? winner.name;
  const center = (windowRef.current?.clientWidth ?? 480) / 2;
  const winnerPts = pointsMap.get(winner.id) ?? 0;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={landed ? first : "Random pick"}
      onClick={() => {
        if (landed) finishNow();
      }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: "rgba(5, 3, 13, 0.9)",
        transform: "none",
        filter: "none",
        padding: "1.5rem",
      }}
    >
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">
        {landed ? "Picked" : "Rolling"}
      </p>
      <div
        ref={windowRef}
        className="relative w-[min(92vw,36rem)] overflow-hidden rounded-3xl border-2 border-white/20 bg-black/40"
        style={{ height: REEL_WINDOW_H }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-3 left-1/2 z-10 w-32 -translate-x-1/2 rounded-2xl border-2 border-accent shadow-[0_0_24px_var(--color-accent)]"
        />
        {faces.map((s, i) => {
          const delta = wrapDelta(i, offset, n);
          const x = center - REEL_SLOT / 2 + delta * REEL_SLOT;
          const y = (REEL_WINDOW_H - REEL_FACE) / 2;
          return (
            <div
              key={s.id}
              className="absolute left-0 top-0 flex items-center justify-center"
              style={{
                width: REEL_SLOT,
                height: REEL_FACE,
                transform: `translate3d(${x}px,${y}px,0)`,
              }}
            >
              <ReelFace
                student={s}
                pack={pack}
                points={pointsMap.get(s.id) ?? 0}
              />
            </div>
          );
        })}
      </div>
      {landed ? (
        <div className="flex flex-col items-center gap-3">
          <ReelFace student={winner} pack={pack} points={winnerPts} />
          <p className="text-center text-4xl font-black tracking-tight text-white sm:text-5xl">
            {first}
          </p>
          <p className="text-sm font-semibold text-white/70">Tap to continue</p>
        </div>
      ) : (
        <p className="text-4xl font-black text-white/35 sm:text-5xl">…</p>
      )}
    </div>,
    getOverlayRoot(),
  );
}
