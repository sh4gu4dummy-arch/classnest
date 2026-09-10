import { memo } from "react";
import { Award, Star, Trophy } from "lucide-react";
import { getAvatar, getAvatarSrc, type AvatarPack } from "@/lib/avatars";
import { BANNER_STYLES, FRAME_STYLES } from "@/lib/shop";
import { getEvolutionTier, getMilestoneMark } from "@/lib/evolution";
import {
  TODAY_RING_FILL_AT,
  TODAY_RING_THICK_AT,
  todayRingComplete,
  todayRingProgress,
  todayRingThickness,
  todayRingVisible,
} from "@/lib/today-ring";
import { cn } from "@/lib/utils";

interface StudentAvatarProps {
  avatarId: number;
  name: string;
  pack?: AvatarPack;
  points?: number;
  /** Today’s net points — drives RGB progress trail */
  todayPoints?: number;
  size?: "sm" | "md" | "lg" | "board" | "xl" | "hero";
  className?: string;
  highlight?: "positive" | "needs_work" | null;
  showLevelBadge?: boolean;
  evolvePulse?: boolean;
  stars?: number;
  frameId?: string | null;
  bannerId?: string | null;
  shieldCharges?: number;
}

const SIZES = {
  sm: "size-10",
  md: "size-14",
  lg: "size-20",
  board: "size-32 sm:size-36",
  xl: "size-28",
  hero: "size-40 sm:size-48",
} as const;

const RING_PAD: Record<keyof typeof SIZES, number> = {
  sm: 4,
  md: 5,
  lg: 6,
  board: 8,
  xl: 7,
  hero: 9,
};

/** Board/list sizes use 360px thumbs; nest/hero keep full-res art. */
function useBoardThumb(size: keyof typeof SIZES) {
  return size === "board" || size === "sm" || size === "md" || size === "lg";
}

function StudentAvatarInner({
  avatarId,
  name,
  pack = "kids",
  points = 0,
  todayPoints = 0,
  size = "md",
  className,
  highlight = null,
  showLevelBadge = true,
  evolvePulse = false,
  stars = 0,
  frameId = null,
  bannerId = null,
  shieldCharges = 0,
}: StudentAvatarProps) {
  const avatar = getAvatar(avatarId, pack);
  const boardThumb = useBoardThumb(size);
  const src = getAvatarSrc(avatarId, pack, points, boardThumb ? "board" : "full");
  const fullSrc = boardThumb
    ? getAvatarSrc(avatarId, pack, points, "full")
    : src;
  const tier = getEvolutionTier(points);
  const milestone = pack !== "ultra" ? getMilestoneMark(points) : null;
  const powered = tier.level > 0;
  const maxEvolved = tier.formStage >= 3;
  const frame = frameId ? FRAME_STYLES[frameId] : null;
  const banner = bannerId ? BANNER_STYLES[bannerId] : null;
  /** Continuous GPU FX only on detail views — board can show 24 avatars. */
  const richFx = size === "hero" || size === "xl";

  const showTodayRing = todayRingVisible(todayPoints);
  const progress = todayRingProgress(todayPoints);
  const ringComplete = todayRingComplete(todayPoints);
  const thickness = todayRingThickness(todayPoints);
  const pad = RING_PAD[size];
  const ringPct = Math.min(9, Math.max(3.5, thickness * 1.35));
  const fillDeg = progress * 360;

  return (
    <div className={cn("relative shrink-0", SIZES[size], className)}>
      {showTodayRing && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-[1]"
          style={{ inset: -pad }}
          title={
            ringComplete
              ? `Today +${Math.round(todayPoints)} · full trail · thickens to ${TODAY_RING_THICK_AT}`
              : `Today +${Math.round(todayPoints)} · trail fills at ${TODAY_RING_FILL_AT}`
          }
        >
          <div
            className={cn(
              "absolute inset-0 rounded-[22%]",
              ringComplete && (richFx || size === "board") && "animate-rgb-orbit",
            )}
            style={{
              background: `conic-gradient(from -90deg,
                #ff0040 0deg,
                #ff9f1a 60deg,
                #ffee00 120deg,
                #00e676 180deg,
                #00b0ff 240deg,
                #d500f9 300deg,
                #ff0040 360deg)`,
              WebkitMaskImage: `conic-gradient(from -90deg, #000 0deg ${fillDeg}deg, transparent ${fillDeg}deg 360deg),
                radial-gradient(farthest-side, transparent calc(100% - ${ringPct}%), #000 calc(100% - ${ringPct}% + 0.5px))`,
              maskImage: `conic-gradient(from -90deg, #000 0deg ${fillDeg}deg, transparent ${fillDeg}deg 360deg),
                radial-gradient(farthest-side, transparent calc(100% - ${ringPct}%), #000 calc(100% - ${ringPct}% + 0.5px))`,
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect",
              // box-shadow is cheaper than filter: drop-shadow on many cards
              boxShadow: ringComplete
                ? "0 0 6px rgba(255,0,128,0.35)"
                : "0 0 3px rgba(255,0,128,0.2)",
              willChange: ringComplete && richFx ? "transform" : undefined,
            }}
          />
        </div>
      )}

      {powered && (
        <>
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-[-3px] rounded-[1.1rem] opacity-90",
              evolvePulse && "animate-evolve-ring",
            )}
            style={{
              // Soft glow via box-shadow only (no blur filters)
              boxShadow: richFx
                ? `0 0 ${6 + tier.level * 2}px ${2 + tier.level}px ${tier.glow}`
                : `0 0 0 2px ${tier.ring}88, 0 0 10px ${tier.glow}`,
              border: `2px solid ${frame?.color ?? tier.ring}`,
            }}
          />
          {/* Spinning energy only on nest/hero — kills Seewo GPUs at 24× board */}
          {tier.level >= 3 && richFx && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-[-6px] rounded-[1.25rem] animate-power-spin opacity-70"
              style={{
                background: `conic-gradient(from 0deg, transparent, ${tier.color}, transparent 40%)`,
                mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                maskComposite: "exclude",
                WebkitMaskComposite: "xor",
                padding: 2,
              }}
            />
          )}
        </>
      )}

      {frame && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-[-4px] z-[4] rounded-[1.15rem]"
            style={{
              boxShadow: richFx
                ? `0 0 0 3px ${frame.color}, 0 0 16px ${frame.glow}`
                : `0 0 0 3px ${frame.color}`,
            }}
          />
          {frame.src ? (
            <img
              src={frame.src}
              alt=""
              aria-hidden
              className="pointer-events-none absolute z-[5] size-[128%] max-w-none"
              style={{ left: "-14%", top: "-14%" }}
              draggable={false}
            />
          ) : null}
        </>
      )}

      {banner && (
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-0.5 left-1/2 z-[4] h-1.5 w-[70%] -translate-x-1/2 rounded-full"
          style={{
            background: banner.src
              ? undefined
              : `linear-gradient(90deg, ${banner.from}, ${banner.to})`,
            backgroundImage: banner.src ? `url(${banner.src})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: richFx ? `0 0 8px ${banner.to}88` : undefined,
          }}
          title={`${banner.label} banner`}
        />
      )}

      <div
        className={cn(
          "relative z-[2] size-full overflow-hidden rounded-2xl bg-surface-2 ring-2 ring-transparent",
          // transform-only transitions (cheap)
          "transition-[transform,box-shadow] duration-200 ease-out",
          powered && "scale-[1.02]",
          highlight === "positive" &&
            "ring-positive shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-positive)_30%,transparent)]",
          highlight === "needs_work" &&
            "ring-danger shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-danger)_30%,transparent)]",
          evolvePulse && "animate-evolve-pop",
        )}
        style={{
          boxShadow: highlight
            ? undefined
            : powered
              ? `0 0 0 2px ${tier.ring}99, 0 0 ${richFx ? 8 + tier.level * 3 : 6}px ${tier.glow}`
              : `0 0 0 2px ${avatar.accent}33`,
        }}
      >
        <img
          key={src}
          src={src}
          alt={name}
          width={size === "hero" ? 192 : size === "board" ? 160 : 128}
          height={size === "hero" ? 192 : size === "board" ? 160 : 128}
          loading={size === "hero" || size === "xl" ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={size === "hero" ? "high" : "auto"}
          data-full-src={boardThumb ? fullSrc : undefined}
          onError={(e) => {
            // Fallback to full art if a thumb is missing
            const el = e.currentTarget;
            if (boardThumb && fullSrc && el.src !== fullSrc) {
              el.src = fullSrc;
            }
          }}
          className={cn(
            "avatar-art size-full object-cover",
            "transition-transform duration-300 ease-out",
            maxEvolved && !evolvePulse && richFx && "animate-legend-breathe",
            maxEvolved && !evolvePulse && !richFx && "scale-[1.04]",
            !maxEvolved && powered && "scale-105",
            !maxEvolved && tier.level >= 4 && "scale-110",
            evolvePulse && "animate-evolve-flash",
          )}
          draggable={false}
        />
        {/* Brighten flash overlay instead of CSS filter:brightness (GPU-friendly) */}
        {evolvePulse && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 animate-evolve-sheen bg-white/40"
          />
        )}
      </div>

      {milestone && (
        <span
          className={cn(
            "absolute -bottom-1 -right-1 z-[3] flex items-center justify-center rounded-full text-white shadow-md ring-2 ring-surface",
            size === "sm" ? "size-5" : size === "board" || size === "hero" ? "size-7" : "size-6",
          )}
          style={{ background: milestone.color }}
          title={`${milestone.name} · ${milestone.unlockAt}+ points`}
        >
          {milestone.rank === 1 ? (
            <Award className={size === "sm" ? "size-3" : "size-3.5"} />
          ) : milestone.rank === 2 ? (
            <Star className={size === "sm" ? "size-3" : "size-3.5"} />
          ) : (
            <Trophy className={size === "sm" ? "size-3" : "size-3.5"} />
          )}
        </span>
      )}

      {showLevelBadge && pack === "ultra" && tier.level > 0 && (
        <span
          className="absolute -bottom-1 -right-1 z-[3] flex size-6 items-center justify-center rounded-full text-[10px] font-black text-white shadow-md ring-2 ring-surface"
          style={{ background: tier.color }}
          title={`${tier.name} · Level ${tier.level} · ${tier.formName}`}
        >
          {tier.level}
        </span>
      )}

      {stars > 0 && (
        <span
          className="absolute -left-1 -top-1 z-[3] flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-black text-amber-950 shadow ring-2 ring-surface"
          title={`${stars} glory star${stars === 1 ? "" : "s"}`}
        >
          {stars}
        </span>
      )}

      {(shieldCharges ?? 0) > 0 && (
        <span
          className="absolute -right-1 -top-1 z-[3] flex size-5 items-center justify-center rounded-full bg-sky-500 text-[9px] font-black text-white shadow ring-2 ring-surface"
          title={`${shieldCharges} shield charge${shieldCharges === 1 ? "" : "s"}`}
        >
          S
        </span>
      )}
    </div>
  );
}

export const StudentAvatar = memo(StudentAvatarInner);
