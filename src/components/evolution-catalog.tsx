import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  getAvatar,
  getAvatarSrcAtStage,
  getAvatars,
  type AvatarPack,
  ULTRA_FORM_NAMES,
  PACK_LABELS,
} from "@/lib/avatars";
import { getMilestoneMark } from "@/lib/evolution";
import { EvolutionBurst } from "@/components/evolution-burst";
import { StudentAvatar } from "@/components/student-avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getUltraLore, ultraIntroSrc } from "@/lib/ultra-lore";
import { getUltraAdventure, ultraAdventureSrc, ULTRA_ADVENTURE_POSTER } from "@/lib/ultra-adventures";
import { ultraHomeSrc, ULTRA_HOME_POSTER } from "@/lib/ultra-homes";
import { Maximize2, Pause, Play, X } from "lucide-react";
import {
  getUltraScrubBundle,
  ultraScrubFrameSrc,
  type UltraScrubClip,
} from "@/lib/ultra-scrub";
import {
  loadCatalogPack,
  loadCatalogRecent,
  pushCatalogRecent,
  saveCatalogPack,
  type CatalogRecentItem,
} from "@/lib/prefs";


type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPack?: AvatarPack;
};

type CatalogTab = AvatarPack;

const TABS: { id: CatalogTab; label: string }[] = [
  { id: "ultra", label: "Ultra" },
  { id: "kids", label: "Kids" },
  { id: "teens", label: "Teens" },
];

type Lightbox = {
  src: string;
  title: string;
  sub?: string;
  kind?: "image" | "video";
  poster?: string;
};

type PreviewBurst = {
  studentName: string;
  avatarId: number;
  pack: AvatarPack;
  points: number;
  prevPoints: number;
};

function CatalogLightbox({
  lightbox,
  onClose,
}: {
  lightbox: Lightbox;
  onClose: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-[80] flex items-center justify-center bg-bg/95 p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={lightbox.title}
      data-catalog-lightbox
      // Keep inside DialogContent so Radix modal pointer-events allow clicks
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="absolute right-2 top-2 z-10 flex size-12 items-center justify-center rounded-full border-2 border-border bg-surface text-fg shadow-lg hover:bg-surface-2 sm:right-3 sm:top-3"
        aria-label="Close enlarged image"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="size-5" />
      </button>
      <div
        className="flex max-h-full w-full max-w-md flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full overflow-hidden rounded-2xl border-2 border-border bg-surface shadow-2xl">
          <img
            src={lightbox.src}
            alt={lightbox.title}
            className="max-h-[min(58dvh,28rem)] w-full bg-surface-2 object-contain"
          />
        </div>
        <div className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-center shadow-md">
          <p className="text-base font-bold text-fg sm:text-lg">{lightbox.title}</p>
          {lightbox.sub && (
            <p className="text-sm font-medium text-muted-fg">{lightbox.sub}</p>
          )}
          <Button
            type="button"
            variant="secondary"
            className="mt-3 min-h-11 min-w-[9rem]"
            onClick={onClose}
          >
            Close image
          </Button>
        </div>
      </div>
    </div>
  );
}

/** True full-viewport player. Portaled to body so dialog CSS transforms
 *  cannot break it. Native requestFullscreen is tried as a bonus (works
 *  on a real board / new tab; the preview iframe usually blocks it). */
function CatalogVideoTheater({
  src,
  poster,
  title,
  sub,
  onClose,
}: {
  src: string;
  poster?: string;
  title: string;
  sub?: string;
  onClose: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      v?.pause();
    };
  }, [src, onClose]);

  function tryNativeFullscreen() {
    const el = wrapRef.current;
    if (!el) return;
    const req =
      el.requestFullscreen?.bind(el) ??
      (
        el as HTMLDivElement & {
          webkitRequestFullscreen?: () => Promise<void>;
        }
      ).webkitRequestFullscreen?.bind(el);
    void req?.().catch(() => {});
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={wrapRef}
      className="pointer-events-auto fixed inset-0 z-[200] flex flex-col bg-bg text-fg"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      data-catalog-video-theater
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2 sm:px-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold sm:text-base">{title}</p>
          {sub ? (
            <p className="truncate text-xs font-medium text-muted-fg">{sub}</p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="hidden min-h-11 shrink-0 gap-1.5 sm:inline-flex"
          title="Browser full screen (may be blocked in preview)"
          onClick={tryNativeFullscreen}
        >
          <Maximize2 className="size-4" />
          Fill display
        </Button>
        <button
          type="button"
          className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-surface text-fg shadow-md hover:bg-surface-2"
          aria-label="Close video"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center bg-ink p-2 sm:p-4">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          controlsList="nofullscreen"
          className="h-full w-full object-contain bg-black"
        />
      </div>
      <div className="flex shrink-0 justify-center border-t border-border px-3 py-2 sm:hidden">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="min-h-11 gap-1.5"
          onClick={tryNativeFullscreen}
        >
          <Maximize2 className="size-4" />
          Fill display
        </Button>
      </div>
    </div>,
    document.body,
  );
}

function CatalogVideoClip({
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
    <div className="pt-1">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted-fg">
        {heading}
      </p>
      {title ? <p className="text-sm font-bold">{title}</p> : null}
      {blurb ? (
        <p className="text-xs leading-snug text-muted-fg">{blurb}</p>
      ) : null}
      <div className="relative mt-1">
        <video
          key={src}
          controls
          playsInline
          preload="metadata"
          poster={poster}
          controlsList="nofullscreen"
          className="aspect-video w-full rounded-xl border border-border bg-bg"
        >
          <source src={src} type="video/mp4" />
        </video>
        <button
          type="button"
          className="absolute right-2 top-2 z-10 flex size-11 items-center justify-center rounded-full border-2 border-white/40 bg-fg/75 text-bg shadow-lg hover:bg-fg"
          aria-label="Watch full screen"
          title="Watch full screen"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
        >
          <Maximize2 className="size-5" />
        </button>
      </div>
    </div>
  );
}


/** Local trial: scrub strip slideshow (frames gitignored). */
function CatalogScrubSlideshow({
  avatarName,
  ultraId,
  clip,
}: {
  avatarName: string;
  ultraId: number;
  clip: UltraScrubClip;
}) {
  const [frame, setFrame] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFrame(1);
    setPlaying(true);
    setFailed(false);
  }, [ultraId, clip.kind]);

  useEffect(() => {
    if (!playing || failed) return;
    const ms = Math.round(1000 / Math.max(1, clip.fps));
    const t = window.setInterval(() => {
      setFrame((f) => (f >= clip.frameCount ? 1 : f + 1));
    }, ms);
    return () => window.clearInterval(t);
  }, [playing, failed, clip.fps, clip.frameCount]);

  if (failed) {
    return (
      <div className="border-t border-border pt-2">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted-fg">
          Scrub · {clip.label} · missing
        </p>
        <p className="text-xs text-muted-fg">
          Frames not on disk under /avatars/ultra/scrub/
          {String(ultraId).padStart(2, "0")}/{clip.kind}/ — local only, not in git.
        </p>
      </div>
    );
  }

  const src = ultraScrubFrameSrc(ultraId, clip.kind, frame);

  return (
    <div className="border-t border-border pt-2">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-fg">
            Scrub · {clip.label} · slideshow
          </p>
          <p className="text-xs text-muted-fg">
            {clip.source} · {clip.frameCount} frames · local only
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="gap-1 shrink-0"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
        >
          {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          {playing ? "Pause" : "Play"}
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-black">
        <img
          key={src}
          src={src}
          alt={`${avatarName} ${clip.label} frame ${frame}`}
          className="aspect-video w-full object-contain"
          onError={() => setFailed(true)}
        />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="range"
          min={1}
          max={clip.frameCount}
          value={frame}
          onChange={(e) => {
            setPlaying(false);
            setFrame(Number(e.target.value));
          }}
          className="h-2 w-full accent-[var(--accent)]"
          aria-label={`${clip.label} scrub frame`}
        />
        <span className="w-14 shrink-0 text-right text-[11px] font-bold tabular-nums text-muted-fg">
          {frame}/{clip.frameCount}
        </span>
      </div>
    </div>
  );
}

export function EvolutionCatalog({
  open,
  onOpenChange,
  defaultPack = "ultra",
}: Props) {
  const [tab, setTab] = useState<CatalogTab>(() => loadCatalogPack(defaultPack));
  const [recent, setRecent] = useState<CatalogRecentItem[]>(() => loadCatalogRecent(5));
  const [selectedId, setSelectedId] = useState(1);
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);
  const [burst, setBurst] = useState<PreviewBurst | null>(null);
  const [morphKey, setMorphKey] = useState(0);
  const [morphFrom, setMorphFrom] = useState<1 | 2 | 3>(1);
  const [morphTo, setMorphTo] = useState<1 | 2 | 3>(2);
  const [morphing, setMorphing] = useState(false);

  const pack: AvatarPack = tab;
  const list = useMemo(() => getAvatars(pack), [pack]);
  const safeId = Math.min(Math.max(1, selectedId), list.length) || 1;
  const avatar = getAvatar(safeId, pack);
  const lore = pack === "ultra" ? getUltraLore(safeId) : null;
  const introSrc = pack === "ultra" ? ultraIntroSrc(safeId) : null;
  const adventure = pack === "ultra" ? getUltraAdventure(safeId) : null;
  const adventureSrc =
    pack === "ultra" ? ultraAdventureSrc(safeId) : null;
  const homeSrc =
    pack === "ultra" ? ultraHomeSrc(safeId) : null;
  const scrubBundle =
    pack === "ultra" ? getUltraScrubBundle(safeId) : null;
  useEffect(() => {
    if (open) {
      const pack = loadCatalogPack(defaultPack);
      setTab(pack);
      setSelectedId(1);
      setRecent(loadCatalogRecent(5));
      setLightbox(null);
      setBurst(null);
      setMorphing(false);
    } else {
      setLightbox(null);
      setBurst(null);
    }
  }, [open, defaultPack]);

  useEffect(() => {
    if (!morphing) return;
    const t = window.setTimeout(() => setMorphing(false), 1600);
    return () => window.clearTimeout(t);
  }, [morphing, morphKey]);

  // Escape closes image first, then catalog
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (lightbox) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setLightbox(null);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, lightbox]);

  function closeLightbox() {
    setLightbox(null);
  }

  function playInlineMorph(from: 1 | 2 | 3, to: 1 | 2 | 3) {
    setMorphFrom(from);
    setMorphTo(to);
    setMorphKey((k) => k + 1);
    setMorphing(true);
  }

  function playFullCelebration(toStage: 2 | 3) {
    const points = toStage === 2 ? 10 : 20;
    const prevPoints = toStage === 2 ? 9 : 19;
    setBurst({
      studentName: avatar.name,
      avatarId: safeId,
      pack,
      points,
      prevPoints,
    });
  }

  function openStageLightbox(stage: 1 | 2 | 3) {
    setLightbox({
      src: getAvatarSrcAtStage(safeId, pack, stage, "full"),
      title:
        pack === "ultra"
          ? `${avatar.name} · ${ULTRA_FORM_NAMES[stage]}`
          : avatar.name,
      sub:
        pack === "ultra"
          ? stage === 1
            ? "0–9 pts · hatchling"
            : stage === 2
              ? "10–19 pts · adolescent"
              : "20+ pts · legend"
          : undefined,
    });
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next && lightbox) {
            setLightbox(null);
            return;
          }
          onOpenChange(next);
        }}
      >
        <DialogContent
          className={cn(
            "flex w-[min(1100px,92vw)] !max-w-[min(1100px,92vw)] flex-col gap-0 overflow-hidden p-0",
            "!top-[calc(var(--grok-banner-h,0px)+0.5rem)] !translate-y-0",
            "h-[calc(100dvh-var(--grok-banner-h,0px)-1rem)] max-h-[calc(100dvh-var(--grok-banner-h,0px)-1rem)]",
            lightbox?.kind === "video" &&
              "!left-0 !right-0 !top-[var(--grok-banner-h,0px)] !h-[calc(100dvh-var(--grok-banner-h,0px))] !w-full !max-h-none !max-w-none !translate-x-0 !rounded-none",
          )}
        >
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <DialogHeader className="shrink-0 border-b border-border px-4 py-3 sm:px-5">
            <DialogTitle>Teacher catalog</DialogTitle>
            <DialogDescription>
              Browse art, play videos full screen, enlarge images.
            </DialogDescription>
          </DialogHeader>

          <div className="flex shrink-0 flex-wrap gap-1.5 border-b border-border px-4 py-2.5 sm:px-5">
            {TABS.map((t) => (
              <Button
                key={t.id}
                type="button"
                size="sm"
                variant={tab === t.id ? "default" : "secondary"}
                onClick={() => {
                  setTab(t.id);
                  saveCatalogPack(t.id);
                  setSelectedId(1);
                  setMorphing(false);
                }}
              >
                {t.label}
              </Button>
            ))}
            <span className="ml-auto self-center text-xs font-medium text-muted-fg">
              {PACK_LABELS[pack]}
            </span>
          </div>

            {recent.length > 0 ? (
              <div className="shrink-0 border-b border-border px-4 py-2 sm:px-5">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-fg">
                  Recently viewed
                </p>
                <div className="flex gap-2 overflow-x-auto pb-0.5">
                  {recent.map((item) => {
                    const av = getAvatar(item.id, item.pack);
                    if (!av) return null;
                    const src = getAvatarSrcAtStage(item.id, item.pack, 1, "board");
                    const on = item.pack === pack && item.id === safeId;
                    return (
                      <button
                        key={`${item.pack}-${item.id}`}
                        type="button"
                        onClick={() => {
                          setTab(item.pack);
                          saveCatalogPack(item.pack);
                          setSelectedId(item.id);
                          setRecent(pushCatalogRecent(item.pack, item.id));
                          setMorphing(false);
                        }}
                        className={cn(
                          "flex w-16 shrink-0 flex-col items-center gap-1 rounded-xl border-2 p-1.5 transition active:scale-[0.97]",
                          on
                            ? "border-accent bg-accent/10"
                            : "border-border bg-surface-2/50 hover:border-accent/40",
                        )}
                        title={`${av.name} · ${PACK_LABELS[item.pack]}`}
                      >
                        <img
                          src={src}
                          alt=""
                          width={56}
                          height={56}
                          loading="lazy"
                          decoding="async"
                          className="aspect-square w-full rounded-lg object-cover"
                        />
                        <span className="w-full truncate text-center text-[10px] font-bold leading-tight">
                          {av.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="grid min-h-0 flex-1 overflow-hidden md:grid-cols-[minmax(16rem,0.95fr)_minmax(0,1.45fr)]">
              <div
                data-scroll
                className="min-h-0 max-h-[32dvh] overflow-y-auto overscroll-contain border-b border-border p-3 md:max-h-none md:border-b-0 md:border-r"
              >
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-7">
                  {list.map((av) => {
                    const src = getAvatarSrcAtStage(av.id, pack, 1, "board");
                    const on = av.id === safeId;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          setSelectedId(av.id);
                          setRecent(pushCatalogRecent(pack, av.id));
                          setMorphing(false);
                        }}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-xl border-2 p-1.5 pt-3 transition active:scale-[0.97]",
                          on
                            ? "border-accent bg-accent/10"
                            : "border-border bg-surface-2/50 hover:border-accent/40",
                        )}
                        title={`${String(av.id).padStart(2, "0")} · ${av.name}`}
                      >
                        <div className="relative w-full">
                          <span
                            className="pointer-events-none absolute -left-0.5 -top-2.5 z-10 text-[9px] font-bold tabular-nums leading-none text-muted-fg"
                            aria-hidden
                          >
                            {String(av.id).padStart(2, "0")}
                          </span>
                          <img
                            src={src}
                            alt=""
                            width={72}
                            height={72}
                            loading="lazy"
                            decoding="async"
                            className="aspect-square w-full rounded-lg object-cover"
                          />
                        </div>
                        <span className="w-full truncate text-center text-[10px] font-bold leading-tight">
                          {av.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                data-scroll
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5"
              >
                <div className="mb-3">
                  <h3 className="flex items-baseline gap-2 text-lg font-bold tracking-tight">
                    <span className="text-[11px] font-bold tabular-nums text-muted-fg">
                      {String(safeId).padStart(2, "0")}
                    </span>
                    {avatar.name}
                  </h3>
                  {avatar.vibe && (
                    <p className="text-sm font-medium text-muted-fg">{avatar.vibe}</p>
                  )}
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-muted-fg">
                    {avatar.category}
                    {pack === "ultra" ? " · 3 real forms" : " · single art + rings"}
                  </p>
                </div>

                {lore && (
                  <div className="mb-4 space-y-2 rounded-2xl border border-border bg-surface-2/30 p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-muted-fg">
                      Home
                    </p>
                    <p className="text-sm font-bold">{lore.home}</p>
                    <p className="text-xs font-medium text-muted-fg">{lore.setting}</p>
                    <p className="text-sm leading-snug">{lore.story}</p>
                    <p className="text-sm italic text-muted-fg">“{lore.greeting}”</p>
                    {introSrc ? (
                      <CatalogVideoClip
                        src={introSrc}
                        poster={`/avatars/ultra/intros/${String(safeId).padStart(2, "0")}.jpg`}
                        heading="Meet · 10s"
                        onExpand={() =>
                          setLightbox({
                            kind: "video",
                            src: introSrc,
                            poster: `/avatars/ultra/intros/${String(safeId).padStart(2, "0")}.jpg`,
                            title: `${avatar.name} · Meet`,
                            sub: lore.home,
                          })
                        }
                      />
                    ) : null}
                    {adventure && (
                      <div className="border-t border-border pt-2">
                        {adventureSrc ? (
                          <CatalogVideoClip
                            src={adventureSrc}
                            poster={ULTRA_ADVENTURE_POSTER(safeId)}
                            heading="Adventure · 30s"
                            title={adventure.title}
                            blurb={adventure.logline}
                            onExpand={() =>
                              setLightbox({
                                kind: "video",
                                src: adventureSrc,
                                poster: ULTRA_ADVENTURE_POSTER(safeId),
                                title: `${avatar.name} · ${adventure.title}`,
                                sub: "30s adventure",
                              })
                            }
                          />
                        ) : (
                          <>
                            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted-fg">
                              Adventure · story
                            </p>
                            <p className="text-sm font-bold">{adventure.title}</p>
                            <p className="text-xs leading-snug text-muted-fg">
                              {adventure.logline}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                    {homeSrc && lore ? (
                      <div className="border-t border-border pt-2">
                        <CatalogVideoClip
                          src={homeSrc}
                          poster={ULTRA_HOME_POSTER(safeId)}
                          heading="Home · 15s · sound"
                          title={lore.home}
                          blurb="Final form in its place"
                          onExpand={() =>
                            setLightbox({
                              kind: "video",
                              src: homeSrc,
                              poster: ULTRA_HOME_POSTER(safeId),
                              title: `${avatar.name} · ${lore.home}`,
                              sub: "15s home · sound on",
                            })
                          }
                        />
                      </div>
                    ) : null}
                    {scrubBundle
                      ? scrubBundle.clips.map((clip) => (
                          <CatalogScrubSlideshow
                            key={clip.kind}
                            avatarName={avatar.name}
                            ultraId={safeId}
                            clip={clip}
                          />
                        ))
                      : null}
                  </div>
                )}

                {pack === "ultra" ? (
                  <>
                    <div className="grid gap-2.5 sm:grid-cols-3">
                      {([1, 2, 3] as const).map((stage) => (
                        <button
                          key={stage}
                          type="button"
                          onClick={() => openStageLightbox(stage)}
                          className="group overflow-hidden rounded-2xl border-2 border-border bg-surface-2/40 text-left transition hover:border-accent/50 active:scale-[0.98]"
                          title="Tap to enlarge"
                        >
                          <div className="relative">
                            <img
                              src={getAvatarSrcAtStage(safeId, pack, stage, "full")}
                              alt={`${avatar.name} ${ULTRA_FORM_NAMES[stage]}`}
                              width={280}
                              height={280}
                              className="aspect-square w-full object-cover"
                            />
                            <span className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-fg/60 text-bg opacity-80 shadow-sm group-hover:opacity-100">
                              <Maximize2 className="size-3.5" />
                            </span>
                          </div>
                          <div className="px-2.5 py-2">
                            <p className="text-sm font-bold">
                              {ULTRA_FORM_NAMES[stage]}
                            </p>
                            <p className="text-[11px] font-semibold text-muted-fg">
                              {stage === 1
                                ? "0–9 pts"
                                : stage === 2
                                  ? "10–19 pts"
                                  : "20+ pts · legend"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 rounded-2xl border border-border bg-surface-2/30 p-3">
                      <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-wide text-muted-fg">
                        Evolution preview
                      </p>
                      <div key={morphKey} className="relative mx-auto aspect-square w-[min(100%,16rem)] overflow-hidden rounded-2xl border-2 border-border bg-surface-2">
                        <img
                          src={getAvatarSrcAtStage(safeId, pack, morphFrom, "full")}
                          alt=""
                          className={cn(
                            "absolute inset-0 h-full w-full object-cover transition-all duration-700",
                            morphing ? "scale-110 opacity-0" : "scale-100 opacity-100",
                          )}
                        />
                        <img
                          src={getAvatarSrcAtStage(safeId, pack, morphTo, "full")}
                          alt=""
                          className={cn(
                            "absolute inset-0 h-full w-full object-cover transition-all duration-700",
                            morphing
                              ? "scale-100 opacity-100 animate-evolve-pop"
                              : "scale-90 opacity-0",
                          )}
                        />
                        {morphing && (
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 animate-evolve-sheen bg-white/40"
                          />
                        )}
                      </div>
                      <p className="mt-2 text-center text-xs font-semibold text-muted-fg">
                        {ULTRA_FORM_NAMES[morphFrom]} → {ULTRA_FORM_NAMES[morphTo]}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="gap-1"
                          onClick={() => playInlineMorph(1, 2)}
                        >
                          <Play className="size-3.5" />
                          1 → 2
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="gap-1"
                          onClick={() => playInlineMorph(2, 3)}
                        >
                          <Play className="size-3.5" />
                          2 → 3
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="gap-1"
                          onClick={() => playFullCelebration(2)}
                        >
                          Full evo @10
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="gap-1"
                          onClick={() => playFullCelebration(3)}
                        >
                          Full evo @20
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() =>
                        setLightbox({
                          src: getAvatarSrcAtStage(safeId, pack, 1, "full"),
                          title: avatar.name,
                        })
                      }
                      className="group relative w-full overflow-hidden rounded-2xl border-2 border-border"
                      title="Tap to enlarge"
                    >
                      <img
                        src={getAvatarSrcAtStage(safeId, pack, 1, "full")}
                        alt={avatar.name}
                        width={400}
                        height={400}
                        className="mx-auto aspect-square max-h-72 w-full object-cover"
                      />
                      <span className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-fg/60 text-bg shadow-sm">
                        <Maximize2 className="size-4" />
                      </span>
                    </button>
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        type="button"
                        size="sm"
                        className="gap-1"
                        onClick={() =>
                          setBurst({
                            studentName: avatar.name,
                            avatarId: safeId,
                            pack,
                            points: 10,
                            prevPoints: 9,
                          })
                        }
                      >
                        <Play className="size-3.5" />
                        Milestone preview
                      </Button>
                    </div>
                    <div className="flex flex-wrap items-end justify-center gap-4 rounded-xl border border-border bg-surface-2/30 p-3">
                      {[0, 10, 20, 30].map((pts) => {
                        const mark = getMilestoneMark(pts);
                        return (
                          <div
                            key={pts}
                            className="flex flex-col items-center gap-1"
                          >
                            <StudentAvatar
                              avatarId={safeId}
                              name={avatar.name}
                              pack={pack}
                              points={pts}
                              size="lg"
                              showLevelBadge={false}
                            />
                            <span className="text-[10px] font-bold text-muted-fg">
                              {pts === 0 ? "Start" : mark?.name ?? `${pts} pts`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <p className="mt-4 text-center text-[11px] font-medium text-muted-fg">
                  Preview only — does not change student points.
                </p>
              </div>
            </div>


          <div className="flex shrink-0 justify-end border-t border-border px-4 py-3">
            <Button type="button" onClick={() => onOpenChange(false)}>
              Close catalog
            </Button>
          </div>

          {lightbox?.kind === "video" ? (
            <CatalogVideoTheater
              src={lightbox.src}
              poster={lightbox.poster}
              title={lightbox.title}
              sub={lightbox.sub}
              onClose={closeLightbox}
            />
          ) : lightbox ? (
            <CatalogLightbox lightbox={lightbox} onClose={closeLightbox} />
          ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <EvolutionBurst data={burst} onDone={() => setBurst(null)} />
    </>
  );
}
