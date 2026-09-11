import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { StudentAvatar } from "@/components/student-avatar";
import type { AvatarPack } from "@/lib/avatars";
import { getOverlayRoot } from "@/lib/overlay-root";
import { playSound, unlockAudio } from "@/lib/sounds";
import type { Student } from "@/lib/types";
import { cn } from "@/lib/utils";

const SLOT = 112;
const DURATION = 1500;

function prefersReduceMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function buildStrip(pool: Student[], winner: Student) {
  const base = pool.length > 0 ? pool : [winner];
  const strip: Student[] = [];
  const landIndex = Math.max(12, base.length + 4);
  while (strip.length < landIndex + 4) {
    strip.push(base[strip.length % base.length]!);
  }
  strip[landIndex] = winner;
  return { strip, landIndex };
}

export function RandomReel({
  pool,
  winner,
  pack,
  onDone,
}: {
  pool: Student[];
  winner: Student;
  pack: AvatarPack;
  onDone: () => void;
}) {
  const { strip, landIndex } = useMemo(
    () => buildStrip(pool, winner),
    [pool, winner],
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const lastSlot = useRef(-1);
  const [landed, setLanded] = useState(false);
  const doneOnce = useRef(false);

  useEffect(() => {
    unlockAudio();
    const reduce = prefersReduceMotion() || pool.length <= 1;
    const track = trackRef.current;
    if (!track) return;

    const windowW = track.parentElement?.clientWidth ?? 480;
    const center = windowW / 2 - SLOT / 2;
    const endX = -(landIndex * SLOT) + center;

    const finish = () => {
      track.style.transform = `translate3d(${endX}px,0,0)`;
      playSound("land");
      setLanded(true);
    };

    if (reduce) {
      finish();
      return;
    }

    track.style.transform = `translate3d(${center}px,0,0)`;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - (1 - t) ** 4;
      const x = center + eased * (endX - center);
      track.style.transform = `translate3d(${x}px,0,0)`;
      const slot = Math.round((center - x) / SLOT);
      if (slot !== lastSlot.current && slot >= 0) {
        lastSlot.current = slot;
        playSound("tick");
      }
      if (t < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [landIndex, pool.length]);

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
      <div className="relative w-[min(92vw,36rem)] overflow-hidden rounded-3xl border-2 border-white/20 bg-black/40 py-4">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-28 -translate-x-1/2 rounded-2xl border-2 border-accent shadow-[0_0_24px_var(--color-accent)]"
        />
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ width: strip.length * SLOT }}
        >
          {strip.map((s, i) => (
            <div
              key={`${s.id}-${i}`}
              className="flex shrink-0 flex-col items-center justify-center gap-1"
              style={{ width: SLOT }}
            >
              <StudentAvatar
                avatarId={s.avatarId}
                name={s.name}
                pack={pack}
                size="xl"
                showLevelBadge={false}
              />
            </div>
          ))}
        </div>
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
