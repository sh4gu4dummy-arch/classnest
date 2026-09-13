import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { StudentAvatar } from "@/components/student-avatar";
import type { AvatarPack } from "@/lib/avatars";
import { getOverlayRoot } from "@/lib/overlay-root";
import { playSound, unlockAudio } from "@/lib/sounds";
import type { Student } from "@/lib/types";
import { cn } from "@/lib/utils";

const SLOT = 112;

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
  const pointsMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of faces) m.set(s.id, pointsOf(s.id));
    m.set(winner.id, pointsOf(winner.id));
    return m;
  }, [faces, winner.id, pointsOf]);

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
    const t = window.setTimeout(() => {
      if (doneOnce.current) return;
      doneOnce.current = true;
      onDone();
    }, 900);
    return () => window.clearTimeout(t);
  }, [landed, onDone]);

  if (typeof document === "undefined") return null;

  const first = winner.name.split(" ")[0] ?? winner.name;
  const center = (windowRef.current?.clientWidth ?? 480) / 2;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Random pick"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(5, 3, 13, 0.86)",
        transform: "none",
        filter: "none",
      }}
    >
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-white/60">
        Rolling
      </p>
      <div
        ref={windowRef}
        className="relative h-36 w-[min(92vw,36rem)] overflow-hidden rounded-3xl border-2 border-white/20 bg-black/40"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-28 -translate-x-1/2 rounded-2xl border-2 border-accent shadow-[0_0_24px_var(--color-accent)]"
        />
        {faces.map((s, i) => {
          const delta = wrapDelta(i, offset, n);
          const x = center - SLOT / 2 + delta * SLOT;
          return (
            <div
              key={s.id}
              className="absolute top-1/2 flex -translate-y-1/2 flex-col items-center"
              style={{
                width: SLOT,
                transform: `translate3d(${x}px,-50%,0)`,
              }}
            >
              <StudentAvatar
                avatarId={s.avatarId}
                name={s.name}
                pack={pack}
                points={pointsMap.get(s.id) ?? 0}
                size="xl"
                showLevelBadge={false}
              />
            </div>
          );
        })}
      </div>
      <p
        className={cn(
          "mt-5 text-center text-4xl font-black tracking-tight text-white sm:text-5xl",
          landed ? "animate-in fade-in zoom-in-95" : "opacity-40",
        )}
      >
        {landed ? first : "…"}
      </p>
    </div>,
    getOverlayRoot(),
  );
}
