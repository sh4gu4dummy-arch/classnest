import { useState } from "react";
import {
  getAvatar,
  getAvatarSrc,
  getAvatarSrcAtStage,
  type AvatarPack,
  ULTRA_FORM_NAMES,
} from "@/lib/avatars";
import {
  getEvolutionLevel,
  getEvolutionTier,
  POINTS_PER_LEVEL,
} from "@/lib/evolution";
import { ArtZoom } from "@/components/evolution-burst";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

type TrailStage = {
  key: string;
  label: string;
  sub: string;
  unlockAt: number;
  unlocked: boolean;
  current: boolean;
  src: string;
  accent: string;
};

function buildTrail(
  avatarId: number,
  pack: AvatarPack,
  points: number,
): TrailStage[] {
  const av = getAvatar(avatarId, pack);
  const form = getEvolutionTier(points).formStage;
  const level = getEvolutionLevel(points);

  if (pack === "ultra") {
    return ([1, 2, 3] as const).map((s) => {
      const unlockAt = s === 1 ? 0 : s === 2 ? 10 : 20;
      return {
        key: `ultra-${s}`,
        label: ULTRA_FORM_NAMES[s],
        sub: s === 1 ? "Base form" : s === 2 ? "10 pts" : "20 pts · wow",
        unlockAt,
        unlocked: points >= unlockAt,
        current: form === s,
        src: getAvatarSrcAtStage(avatarId, pack, s),
        accent: av.accent,
      };
    });
  }

  // Kids / teens: show current + next milestones (level trail)
  const milestones = [0, 10, 20, 30, 40].filter(
    (m) => m <= Math.max(40, (level + 2) * POINTS_PER_LEVEL),
  );
  return milestones.map((unlockAt) => {
    const tier = getEvolutionTier(unlockAt === 0 ? 0 : unlockAt);
    const unlocked = points >= unlockAt;
    const isCurrent =
      unlockAt === 0
        ? level === 0
        : getEvolutionLevel(points) === getEvolutionLevel(unlockAt) &&
          points >= unlockAt &&
          (unlockAt === milestones[milestones.length - 1] ||
            points < unlockAt + POINTS_PER_LEVEL);
    // better current: highest unlocked milestone
    return {
      key: `lv-${unlockAt}`,
      label: unlockAt === 0 ? "Start" : tier.name,
      sub: unlockAt === 0 ? "0 pts" : `${unlockAt}+ pts`,
      unlockAt,
      unlocked,
      current: false,
      src: getAvatarSrc(avatarId, pack, Math.max(unlockAt, 0)),
      accent: unlocked ? tier.color : av.accent,
    };
  }).map((stage, _i, arr) => {
    const highest = [...arr].reverse().find((s) => s.unlocked);
    return { ...stage, current: highest?.key === stage.key };
  });
}

interface EvolutionTrailProps {
  avatarId: number;
  pack: AvatarPack;
  points: number;
  className?: string;
}

export function EvolutionTrail({
  avatarId,
  pack,
  points,
  className,
}: EvolutionTrailProps) {
  const stages = buildTrail(avatarId, pack, points);
  const nextLocked = stages.find((s) => !s.unlocked);
  const [zoom, setZoom] = useState<{ src: string; title: string } | null>(null);

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-border bg-surface-2/50 p-3 sm:p-4",
        className,
      )}
    >
      <div className="mb-3 flex items-end justify-between gap-2">
        <p className="text-sm font-bold text-fg">Evolution</p>
        {nextLocked && (
          <p className="text-[11px] font-semibold tabular-nums text-muted-fg">
            {Math.max(0, nextLocked.unlockAt - points)} to {nextLocked.label}
          </p>
        )}
      </div>

      <div
        className={cn(
          "grid gap-2",
          stages.length <= 3 ? "grid-cols-3" : "grid-cols-3 sm:grid-cols-5",
        )}
      >
        {stages.map((s, i) => (
          <div key={s.key} className="relative flex flex-col items-center">
            {i < stages.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[calc(50%+1.25rem)] top-8 hidden h-0.5 w-[calc(100%-1.5rem)] sm:block",
                  stages[i + 1]?.unlocked ? "bg-accent/50" : "bg-border",
                )}
              />
            )}
            <button
              type="button"
              disabled={!s.unlocked}
              title={s.unlocked ? `Enlarge ${s.label}` : undefined}
              onClick={() => {
                if (!s.unlocked) return;
                setZoom({ src: s.src, title: s.label });
              }}
              className={cn(
                "relative size-16 overflow-hidden rounded-xl border-2 shadow-sm sm:size-20",
                s.current && "ring-2 ring-accent ring-offset-2 ring-offset-surface",
                s.unlocked
                  ? "border-border-strong"
                  : "cursor-default border-dashed border-border",
              )}
              style={
                s.unlocked
                  ? { boxShadow: `0 0 0 1px ${s.accent}44` }
                  : undefined
              }
            >
              <img
                src={s.src}
                alt={s.label}
                className={cn(
                  "size-full object-cover transition",
                  s.unlocked
                    ? "opacity-100"
                    : "scale-105 opacity-40 blur-[2px] grayscale",
                )}
                draggable={false}
              />
              {!s.unlocked && (
                <span className="absolute inset-0 flex items-center justify-center bg-ink/35">
                  <Lock className="size-5 text-white drop-shadow" />
                </span>
              )}
              {s.current && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-1.5 py-px text-[9px] font-black uppercase text-accent-fg">
                  Now
                </span>
              )}
            </button>
            <p
              className={cn(
                "mt-1.5 text-center text-[11px] font-bold leading-tight",
                s.unlocked ? "text-fg" : "text-muted-fg",
              )}
            >
              {s.label}
            </p>
            <p className="text-center text-[10px] text-muted-fg">{s.sub}</p>
          </div>
        ))}
      </div>
      {zoom ? (
        <ArtZoom src={zoom.src} title={zoom.title} onClose={() => setZoom(null)} />
      ) : null}
    </div>
  );
}
