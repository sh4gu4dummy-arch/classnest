import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Maximize2, X } from "lucide-react";
import { ConfettiBurst } from "@/components/confetti-burst";
import { StudentAvatar } from "@/components/student-avatar";
import {
  getAvatar,
  getAvatarSrcAtStage,
  getFormStage,
  type AvatarPack,
  ULTRA_FORM_NAMES,
} from "@/lib/avatars";
import {
  getCelebrationClip,
  getEvolutionTier,
  getMilestoneMark,
  POINTS_PER_LEVEL,
} from "@/lib/evolution";
import { getOverlayRoot } from "@/lib/overlay-root";
import { cn } from "@/lib/utils";

export type EvolutionBurstData = {
  studentName: string;
  avatarId: number;
  pack: AvatarPack;
  points: number;
  prevPoints?: number;
};

interface EvolutionBurstProps {
  data: EvolutionBurstData | null;
  onDone: () => void;
}

const COVER: CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: "auto",
  height: "auto",
  margin: 0,
  transform: "none",
  filter: "none",
  // Never bg-ink / bg-bg — ink is the LIGHT foreground in dark mode.
  background: "#05030d",
};

export function ArtZoom({
  src,
  title,
  onClose,
}: {
  src: string;
  title?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      style={{ ...COVER, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", padding: "0.75rem" }}
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Enlarged art"}
      onClick={onClose}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="absolute right-3 top-3 z-10 flex size-12 items-center justify-center rounded-full border-2 border-white/30 bg-black/60 text-white shadow-lg hover:bg-black/80"
        aria-label="Close enlarged image"
        onClick={onClose}
      >
        <X className="size-5" />
      </button>
      <figure
        className="flex max-h-full max-w-3xl flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={title ?? ""}
          className="max-h-[min(82dvh,52rem)] w-auto max-w-full rounded-2xl border-2 border-white/20 bg-black object-contain shadow-2xl"
        />
        {title ? (
          <figcaption className="rounded-full border border-white/20 bg-black/70 px-4 py-1.5 text-sm font-bold text-white">
            {title}
          </figcaption>
        ) : null}
      </figure>
    </div>,
    getOverlayRoot(),
  );
}

/** Full-screen celebration when a student crosses a 10-point evolution threshold. */
export function EvolutionBurst({ data, onDone }: EvolutionBurstProps) {
  const [morph, setMorph] = useState(false);
  const [zoom, setZoom] = useState<{ src: string; title: string } | null>(null);

  useEffect(() => {
    if (!data) {
      setZoom(null);
      return;
    }
    setMorph(false);
    setZoom(null);
    const t1 = window.setTimeout(() => setMorph(true), 450);
    return () => window.clearTimeout(t1);
  }, [data]);

  useEffect(() => {
    if (!data || zoom) return;
    const t2 = window.setTimeout(onDone, data.pack === "ultra" ? 6500 : 2800);
    return () => window.clearTimeout(t2);
  }, [data, onDone, zoom]);

  if (!data || typeof document === "undefined") return null;

  const avatar = getAvatar(data.avatarId, data.pack);
  const tier = getEvolutionTier(data.points);
  const clip = getCelebrationClip(data.points, data.pack);
  const first = data.studentName.split(" ")[0] ?? data.studentName;

  const formStage = getFormStage(data.points);
  const milestone = data.pack !== "ultra";
  const mark = milestone ? getMilestoneMark(data.points) : null;
  const hit =
    Math.floor(data.points / POINTS_PER_LEVEL) * POINTS_PER_LEVEL;
  const prevForm =
    data.prevPoints != null
      ? getFormStage(data.prevPoints)
      : ((formStage > 1 ? formStage - 1 : 1) as 1 | 2 | 3);
  const fromSrc =
    data.pack === "ultra"
      ? getAvatarSrcAtStage(data.avatarId, data.pack, prevForm, "full")
      : avatar.src;
  const toSrc =
    data.pack === "ultra"
      ? getAvatarSrcAtStage(data.avatarId, data.pack, formStage, "full")
      : avatar.src;
  const fromTitle =
    data.pack === "ultra"
      ? `${avatar.name} · ${ULTRA_FORM_NAMES[prevForm]}`
      : `${avatar.name} · before`;
  const toTitle =
    data.pack === "ultra"
      ? `${avatar.name} · ${ULTRA_FORM_NAMES[formStage]}`
      : mark
        ? `${avatar.name} · ${mark.name}`
        : `${avatar.name} · ${tier.name}`;
  const heading = milestone ? "Milestone!" : "Evolution!";
  const headline = milestone
    ? `${first} hit ${hit || data.points}`
    : `${first} · ${ULTRA_FORM_NAMES[formStage]}`;
  const accent = mark?.color ?? tier.color;

  const overlay = (
    <div
      style={{
        ...COVER,
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.75rem",
      }}
      role="dialog"
      aria-modal="true"
      aria-label={headline}
      onClick={() => {
        if (!zoom) onDone();
      }}
    >
      <ConfettiBurst active />

      {milestone ? (
        <div
          className="relative flex w-full max-w-md flex-col items-center gap-3 overflow-hidden rounded-3xl border-2 border-white/20 bg-[#16102c] p-4 text-white shadow-2xl animate-evolve-panel sm:gap-4 sm:p-5"
          style={{ boxShadow: `0 0 60px ${tier.glow}, 0 25px 50px rgba(0,0,0,0.35)` }}
          onClick={(e) => e.stopPropagation()}
        >
          <BurstRays color={accent} />
          <p className="relative z-10 text-xs font-bold uppercase tracking-[0.2em] text-white/60">
            {heading}
          </p>
          <h2
            className="relative z-10 text-center text-2xl font-black tracking-tight sm:text-3xl"
            style={{ color: accent }}
          >
            {headline}
          </h2>
          {mark ? (
            <p className="relative z-10 text-center text-sm text-white/70">
              {mark.name} on their portrait — it stays on the board
            </p>
          ) : clip ? (
            <p className="relative z-10 text-center text-sm text-white/70">{clip.subtitle}</p>
          ) : null}
          <div className="relative z-10 mt-1">
            <StudentAvatar
              avatarId={data.avatarId}
              name={data.studentName}
              pack={data.pack}
              points={data.points}
              size="hero"
              evolvePulse={morph}
              showLevelBadge={false}
            />
          </div>
          {clip?.mode === "gif" && clip.gifSrc && (
            <button
              type="button"
              className="relative z-10 mt-1 w-full"
              title="Tap to enlarge"
              onClick={() =>
                setZoom({ src: clip.gifSrc!, title: `${first} · celebration` })
              }
            >
              <img
                src={clip.gifSrc}
                alt=""
                className="max-h-36 w-full rounded-xl object-cover"
              />
            </button>
          )}
          <p className="relative z-10 text-[11px] font-medium text-white/60">
            Mark stays on their avatar
          </p>
          <AwesomeButton onClick={onDone} />
        </div>
      ) : (
        <div
          className="relative flex h-full w-full max-w-xl flex-col items-center justify-center gap-3 sm:gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <BurstRays color={accent} />
          <p className="relative z-10 text-xs font-bold uppercase tracking-[0.25em] text-white/70">
            Evolution
          </p>
          <h2
            className="relative z-10 text-center text-3xl font-black tracking-tight text-white sm:text-4xl"
            style={{ textShadow: `0 0 28px ${tier.glow}` }}
          >
            {headline}
          </h2>
          <p className="relative z-10 text-sm font-semibold text-white/80">
            {ULTRA_FORM_NAMES[prevForm]}
            <span className="mx-2 text-white/50">→</span>
            {ULTRA_FORM_NAMES[formStage]}
          </p>

          <button
            type="button"
            title="Tap to enlarge"
            aria-label={`Enlarge ${morph ? toTitle : fromTitle}`}
            className="relative z-10 aspect-square w-[min(86vw,min(62dvh,28rem))] overflow-hidden rounded-[2rem] border-2 border-white/25 bg-black shadow-2xl"
            style={{ boxShadow: `0 0 48px ${tier.glow}` }}
            onClick={() =>
              setZoom({
                src: morph ? toSrc : fromSrc,
                title: morph ? toTitle : fromTitle,
              })
            }
          >
            <img
              src={fromSrc}
              alt={fromTitle}
              className={cn(
                "absolute inset-0 h-full w-full object-contain transition-all duration-700 ease-out",
                morph ? "scale-110 opacity-0 blur-[2px]" : "scale-100 opacity-100",
              )}
              onError={(e) => {
                const el = e.currentTarget;
                if (el.dataset.fb) return;
                el.dataset.fb = "1";
                el.src = getAvatarSrcAtStage(data.avatarId, data.pack, prevForm, "board");
              }}
            />
            <img
              src={toSrc}
              alt={toTitle}
              className={cn(
                "absolute inset-0 h-full w-full object-contain transition-all duration-700 ease-out",
                morph ? "scale-100 opacity-100" : "scale-90 opacity-0",
              )}
              onError={(e) => {
                const el = e.currentTarget;
                if (el.dataset.fb) return;
                el.dataset.fb = "1";
                el.src = getAvatarSrcAtStage(data.avatarId, data.pack, formStage, "board");
              }}
            />
            <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/70 text-black">
              <Maximize2 className="size-4" />
            </span>
          </button>

          <p className="relative z-10 text-xs font-medium text-white/65">
            Tap the picture to enlarge
          </p>
          <AwesomeButton onClick={onDone} />
        </div>
      )}

      {zoom ? (
        <ArtZoom src={zoom.src} title={zoom.title} onClose={() => setZoom(null)} />
      ) : null}
    </div>
  );

  return createPortal(overlay, getOverlayRoot());
}

function BurstRays({ color }: { color: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 h-64 w-1 origin-bottom animate-ray-burst opacity-50"
          style={
            {
              background: `linear-gradient(to top, transparent, ${color})`,
              transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
              animationDelay: `${i * 0.03}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function AwesomeButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="relative z-10 mt-1 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-accent-fg shadow-lg"
      onClick={onClick}
    >
      Awesome!
    </button>
  );
}
