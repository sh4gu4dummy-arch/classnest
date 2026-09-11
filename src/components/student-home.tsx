import { useMemo, useState } from "react";
import { Maximize2, ShoppingBag, Swords, X } from "lucide-react";
import { EvolutionTrail } from "@/components/evolution-trail";
import { StudentAvatar } from "@/components/student-avatar";
import { Button } from "@/components/ui/button";
import {
  getAvatar,
  getAvatarSrc,
  getAvatarSrcAtStage,
  type AvatarPack,
  ULTRA_FORM_NAMES,
} from "@/lib/avatars";
import { BANNER_STYLES, HOME_ITEM_META } from "@/lib/shop";
import { getEvolutionTier, getMilestoneMark, pointsToNextLevel } from "@/lib/evolution";
import { getUltraLore, ultraIntroSrc } from "@/lib/ultra-lore";
import {
  getUltraAdventure,
  ultraAdventureSrc,
  ULTRA_ADVENTURE_POSTER,
} from "@/lib/ultra-adventures";
import type { PointEvent, Student } from "@/lib/types";
import { cn, formatRelative } from "@/lib/utils";

export type SparRematch = {
  opponentId: string;
  bet: number;
};

interface StudentHomeProps {
  student: Student;
  points: number;
  pack: AvatarPack;
  seasonPoints?: number | null;
  spent?: number;
  events?: PointEvent[];
  classmates?: Student[];
  onShop: () => void;
  onSpar: (rematch?: SparRematch) => void;
  onHiRes: () => void;
}

export function StudentHome({
  student,
  points,
  pack,
  seasonPoints = null,
  spent = 0,
  events = [],
  classmates = [],
  onShop,
  onSpar,
  onHiRes,
}: StudentHomeProps) {
  const avatar = getAvatar(student.avatarId, pack);
  const tier = getEvolutionTier(points);
  const mark = pack !== "ultra" ? getMilestoneMark(points) : null;
  const nextIn = pointsToNextLevel(points);
  const banner = student.bannerId ? BANNER_STYLES[student.bannerId] : null;
  const homeItems = student.homeItems ?? [];

  const nameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of classmates) m.set(s.id, s.name);
    m.set(student.id, student.name);
    return m;
  }, [classmates, student]);

  const sparHistory = useMemo(() => {
    return events
      .filter(
        (e) =>
          e.source === "spar" ||
          e.behaviorId === "spar_win" ||
          e.behaviorId === "spar_loss" ||
          e.behaviorId === "spar_shield",
      )
      .slice(0, 20);
  }, [events]);

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-border bg-surface shadow-lg">
      <div
        className="relative h-28 overflow-hidden sm:h-36"
        style={
          banner
            ? undefined
            : {
                background: `linear-gradient(135deg, ${avatar.accent}55, color-mix(in oklab, ${avatar.accent} 20%, #1e1b2e))`,
              }
        }
      >
        {banner?.src ? (
          <img
            src={banner.src}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 40%, white 0%, transparent 40%), radial-gradient(circle at 80% 20%, white 0%, transparent 35%)",
            }}
          />
        )}
        {banner && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
            {banner.label}
          </span>
        )}
      </div>

      <div className="relative -mt-12 px-4 pb-5 sm:px-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end sm:gap-5">
          <button
            type="button"
            onClick={onHiRes}
            className="relative rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="View high-res character"
          >
            <StudentAvatar
              avatarId={student.avatarId}
              name={student.name}
              pack={pack}
              points={points}
              size="hero"
              stars={student.stars}
              frameId={student.frameId}
              bannerId={student.bannerId}
              shieldCharges={student.shieldCharges}
            />
            <span className="absolute bottom-1 right-1 flex size-7 items-center justify-center rounded-full bg-ink/70 text-white shadow">
              <Maximize2 className="size-3.5" />
            </span>
          </button>

          <div className="flex-1 text-center sm:pb-2 sm:text-left">
            <h2 className="text-2xl font-black tracking-tight">{student.name}</h2>
            <p className="text-sm font-semibold" style={{ color: avatar.accent }}>
              {avatar.name}
            </p>
            {pack === "ultra" && (
              <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-muted-fg">
                {ULTRA_FORM_NAMES[tier.formStage]}
                {tier.level > 0 ? ` · Lv ${tier.level}` : ""}
              </p>
            )}
            {mark && (
              <p className="text-sm font-bold" style={{ color: mark.color }}>
                {mark.name} milestone
              </p>
            )}
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Stat
                label="Lifetime"
                value={points > 0 ? `+${points}` : String(points)}
                good={points >= 0}
              />
              {spent > 0 && <Stat label="Spent" value={String(spent)} />}
              {spent > 0 && (
                <Stat
                  label="Wallet"
                  value={String(Math.max(0, points - spent))}
                />
              )}
              {seasonPoints != null && (
                <Stat
                  label="Season"
                  value={seasonPoints > 0 ? `+${seasonPoints}` : String(seasonPoints)}
                  good={seasonPoints >= 0}
                />
              )}
              <Stat label="Shields" value={String(student.shieldCharges ?? 0)} />
              <Stat label="Stars" value={String(student.stars ?? 0)} />
              {nextIn > 0 && <Stat label="Next evolve" value={`${nextIn} pts`} />}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <EvolutionTrail avatarId={student.avatarId} pack={pack} points={points} />
        </div>

        {pack === "ultra" && (
          <NestVideos avatarId={student.avatarId} name={avatar.name} />
        )}

        {homeItems.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-fg">
              Nest
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {homeItems.map((id) => {
                const m = HOME_ITEM_META[id];
                if (!m) return null;
                return (
                  <div
                    key={id}
                    className="overflow-hidden rounded-xl border-2 border-border bg-surface-2"
                  >
                    <img
                      src={m.src}
                      alt={m.label}
                      className="aspect-square w-full object-cover"
                    />
                    <p className="truncate px-2 py-1.5 text-center text-[11px] font-semibold">
                      {m.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {homeItems.length === 0 && (
          <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-3 py-3">
            <p className="text-center text-xs text-muted-fg">Empty nest</p>
            <Button size="sm" className="gap-1.5" onClick={onShop}>
              <ShoppingBag className="size-3.5" />
              Open shop
            </Button>
          </div>
        )}

        <div className="mt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-fg">
            Spar history
          </p>
          {sparHistory.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-3 py-3">
              <p className="text-center text-xs text-muted-fg">No spars yet</p>
              <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => onSpar()}>
                <Swords className="size-3.5" />
                Challenge someone
              </Button>
            </div>
          ) : (
            <ul className="max-h-56 space-y-1.5 overflow-y-auto">
              {sparHistory.map((e) => {
                const oppId = e.relatedStudentId;
                const opp = oppId ? nameById.get(oppId) ?? "Opponent" : null;
                const win = e.behaviorId === "spar_win" || e.points > 0;
                const shield = e.behaviorId === "spar_shield";
                const bet = Math.abs(e.points) || 1;
                return (
                  <li
                    key={e.id}
                    className="flex items-center gap-2 rounded-xl border border-border/80 bg-surface-2/50 px-3 py-2"
                  >
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase",
                        shield
                          ? "bg-sky-500/15 text-sky-600 dark:text-sky-300"
                          : win
                            ? "bg-positive/15 text-positive"
                            : "bg-danger/15 text-danger",
                      )}
                    >
                      {shield ? "Block" : win ? "Win" : "Loss"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {e.behaviorLabel}
                        {opp ? ` · vs ${opp.split(" ")[0]}` : ""}
                      </p>
                      <p className="text-[11px] text-muted-fg">
                        {formatRelative(e.createdAt)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 text-sm font-bold tabular-nums",
                        e.points > 0
                          ? "text-positive"
                          : e.points < 0
                            ? "text-danger"
                            : "text-muted-fg",
                      )}
                    >
                      {e.points > 0 ? `+${e.points}` : e.points}
                    </span>
                    {oppId && !shield && (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="h-8 shrink-0 px-2 text-xs"
                        onClick={() => onSpar({ opponentId: oppId, bet })}
                      >
                        Rematch
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" className="gap-1.5" onClick={onShop}>
            <ShoppingBag className="size-4" />
            Shop
          </Button>
          <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => onSpar()}>
            <Swords className="size-4" />
            Spar
          </Button>
          <Button size="sm" variant="ghost" className="gap-1.5" onClick={onHiRes}>
            <Maximize2 className="size-4" />
            Hi-res
          </Button>
        </div>
      </div>
    </div>
  );
}

function padId(id: number) {
  return String(id).padStart(2, "0");
}

function NestVideos({ avatarId, name }: { avatarId: number; name: string }) {
  const lore = getUltraLore(avatarId);
  const introSrc = ultraIntroSrc(avatarId);
  const adventure = getUltraAdventure(avatarId);
  const adventureSrc = ultraAdventureSrc(avatarId);
  const [watch, setWatch] = useState<{
    src: string;
    poster?: string;
    title: string;
    sub?: string;
  } | null>(null);

  if (!introSrc && !adventureSrc && !lore) return null;

  return (
    <div className="mt-5 space-y-3">
      {lore && (
        <div className="rounded-xl border border-border bg-surface-2/40 px-3 py-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-fg">
            Home
          </p>
          <p className="text-sm font-bold">{lore.home}</p>
          <p className="text-xs text-muted-fg">{lore.setting}</p>
        </div>
      )}
      {introSrc && (
        <NestClip
          heading="Meet · 10s"
          src={introSrc}
          poster={`/avatars/ultra/intros/${padId(avatarId)}.jpg`}
          onExpand={() =>
            setWatch({
              src: introSrc,
              poster: `/avatars/ultra/intros/${padId(avatarId)}.jpg`,
              title: `${name} · Meet`,
              sub: lore?.home,
            })
          }
        />
      )}
      {adventureSrc && adventure && (
        <NestClip
          heading="Adventure · 30s"
          title={adventure.title}
          blurb={adventure.logline}
          src={adventureSrc}
          poster={ULTRA_ADVENTURE_POSTER(avatarId)}
          onExpand={() =>
            setWatch({
              src: adventureSrc,
              poster: ULTRA_ADVENTURE_POSTER(avatarId),
              title: `${name} · ${adventure.title}`,
              sub: "30s adventure",
            })
          }
        />
      )}
      {watch && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/92 p-3"
          role="dialog"
          aria-label={watch.title}
          onClick={() => setWatch(null)}
        >
          <button
            type="button"
            onClick={() => setWatch(null)}
            className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
          <div
            className="w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              key={watch.src}
              controls
              autoPlay
              playsInline
              poster={watch.poster}
              className="aspect-video w-full rounded-2xl bg-black"
            >
              <source src={watch.src} type="video/mp4" />
            </video>
            <p className="mt-2 text-center text-sm font-bold text-white">
              {watch.title}
            </p>
            {watch.sub && (
              <p className="text-center text-xs text-white/70">{watch.sub}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NestClip({
  src,
  poster,
  heading,
  title,
  blurb,
  onExpand,
}: {
  src: string;
  poster?: string;
  heading: string;
  title?: string;
  blurb?: string;
  onExpand: () => void;
}) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted-fg">
        {heading}
      </p>
      {title ? <p className="text-sm font-bold">{title}</p> : null}
      {blurb ? (
        <p className="mb-1 text-xs leading-snug text-muted-fg">{blurb}</p>
      ) : null}
      <div className="relative">
        <video
          key={src}
          controls
          playsInline
          preload="metadata"
          poster={poster}
          className="aspect-video w-full rounded-xl border-2 border-border bg-bg"
        >
          <source src={src} type="video/mp4" />
        </video>
        <button
          type="button"
          className="absolute right-2 top-2 z-10 flex size-10 items-center justify-center rounded-full border-2 border-white/40 bg-fg/75 text-bg shadow-lg hover:bg-fg"
          aria-label="Watch full screen"
          title="Watch full screen"
          onClick={onExpand}
        >
          <Maximize2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  good,
}: {
  label: string;
  value: string;
  good?: boolean;
}) {
  return (
    <div className="rounded-xl border-2 border-border bg-surface-2/80 px-3 py-1.5 text-center">
      <p className="text-[10px] font-medium text-muted-fg">{label}</p>
      <p
        className={cn(
          "text-sm font-bold tabular-nums",
          good === true && "text-positive",
          good === false && "text-danger",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function HiResViewer({
  open,
  onClose,
  student,
  points,
  pack,
}: {
  open: boolean;
  onClose: () => void;
  student: Student;
  points: number;
  pack: AvatarPack;
}) {
  const [stage, setStage] = useState<1 | 2 | 3 | "current">("current");
  if (!open) return null;

  const avatar = getAvatar(student.avatarId, pack);
  const currentSrc = getAvatarSrc(student.avatarId, pack, points);
  const src =
    pack === "ultra" && stage !== "current"
      ? getAvatarSrcAtStage(student.avatarId, pack, stage)
      : currentSrc;
  const tier = getEvolutionTier(points);
  const form = tier.formStage;

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink/90 p-3 backdrop-blur-md animate-in fade-in"
      role="dialog"
      aria-label={`${student.name} high resolution`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Close"
      >
        <X className="size-5" />
      </button>

      <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div
          className="overflow-hidden rounded-3xl border-2 shadow-2xl"
          style={{
            borderColor: `${avatar.accent}88`,
            boxShadow: `0 0 50px ${tier.glow}`,
          }}
        >
          <img
            key={src}
            src={src}
            alt={avatar.name}
            className={cn(
              "aspect-square w-full object-cover",
              pack === "ultra" &&
                stage !== "current" &&
                stage > form &&
                "opacity-50 grayscale",
            )}
            draggable={false}
          />
        </div>
        <div className="mt-4 text-center text-white">
          <h3 className="text-2xl font-black">{student.name}</h3>
          <p className="text-sm font-semibold opacity-90" style={{ color: avatar.accent }}>
            {avatar.name}
          </p>
          {pack === "ultra" && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {([1, 2, 3] as const).map((s) => {
                const locked = s > form;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStage(s)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold transition",
                      stage === s
                        ? "bg-white text-ink"
                        : "bg-white/15 text-white hover:bg-white/25",
                      locked && "opacity-70",
                    )}
                  >
                    {locked ? `Locked ${ULTRA_FORM_NAMES[s]}` : ULTRA_FORM_NAMES[s]}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setStage("current")}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold transition",
                  stage === "current"
                    ? "bg-white text-ink"
                    : "bg-white/15 text-white hover:bg-white/25",
                )}
              >
                Live
              </button>
            </div>
          )}
          <div className="mt-4">
            <EvolutionTrail avatarId={student.avatarId} pack={pack} points={points} />
          </div>
        </div>
      </div>
    </div>
  );
}
