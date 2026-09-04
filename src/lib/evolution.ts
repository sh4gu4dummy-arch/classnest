/** Evolution unlocks every 10 total points. Ultra uses real 3-stage Imagine art. */

import type { AvatarPack } from "@/lib/avatars";
import { getFormStage, ULTRA_FORM_NAMES } from "@/lib/avatars";

export const POINTS_PER_LEVEL = 10;
export const MAX_EVOLUTION_LEVEL = 10;

export const CELEBRATION_TIER_COUNT = 3;

export type EvolutionTier = {
  level: number;
  name: string;
  color: string;
  ring: string;
  glow: string;
  power: number;
  /** Ultra form 1–3 */
  formStage: 1 | 2 | 3;
  formName: string;
};

export type CelebrationClip = {
  tier: 1 | 2 | 3;
  title: string;
  subtitle: string;
  /** Kids/teens GIF path; null for Ultra (uses art morph instead) */
  gifSrc: string | null;
  mode: "gif" | "ultra-morph" | "milestone";
};

export type MilestoneMark = {
  rank: 1 | 2 | 3;
  name: "Ribbon" | "Star" | "Trophy";
  unlockAt: 10 | 20 | 30;
  color: string;
};

export const MILESTONE_MARKS: MilestoneMark[] = [
  { rank: 1, name: "Ribbon", unlockAt: 10, color: "#f43f5e" },
  { rank: 2, name: "Star", unlockAt: 20, color: "#f59e0b" },
  { rank: 3, name: "Trophy", unlockAt: 30, color: "#eab308" },
];

/** Kids/teens lasting mark — ribbon at 10, star at 20, trophy at 30+. */
export function getMilestoneMark(points: number): MilestoneMark | null {
  if (!Number.isFinite(points) || points < 10) return null;
  if (points >= 30) return MILESTONE_MARKS[2]!;
  if (points >= 20) return MILESTONE_MARKS[1]!;
  return MILESTONE_MARKS[0]!;
}

const TIERS: Omit<EvolutionTier, "level" | "power" | "formStage" | "formName">[] = [
  { name: "Spark", color: "#94a3b8", ring: "#cbd5e1", glow: "rgba(148,163,184,0.35)" },
  { name: "Ember", color: "#f59e0b", ring: "#fbbf24", glow: "rgba(245,158,11,0.45)" },
  { name: "Flame", color: "#f97316", ring: "#fb923c", glow: "rgba(249,115,22,0.5)" },
  { name: "Bolt", color: "#eab308", ring: "#facc15", glow: "rgba(234,179,8,0.55)" },
  { name: "Nova", color: "#22d3ee", ring: "#67e8f9", glow: "rgba(34,211,238,0.55)" },
  { name: "Storm", color: "#3b82f6", ring: "#60a5fa", glow: "rgba(59,130,246,0.55)" },
  { name: "Pulse", color: "#a855f7", ring: "#c084fc", glow: "rgba(168,85,247,0.6)" },
  { name: "Apex", color: "#ec4899", ring: "#f472b6", glow: "rgba(236,72,153,0.6)" },
  { name: "Mythic", color: "#ef4444", ring: "#f87171", glow: "rgba(239,68,68,0.65)" },
  { name: "Legend", color: "#fbbf24", ring: "#fde68a", glow: "rgba(251,191,36,0.7)" },
  { name: "Ascendant", color: "#2dd4bf", ring: "#5eead4", glow: "rgba(45,212,191,0.75)" },
];

const KIDS_CLIPS: Record<1 | 2 | 3, Omit<CelebrationClip, "tier" | "gifSrc" | "mode">> = {
  1: { title: "Playground High-Five", subtitle: "Friends celebrate on the playground" },
  2: { title: "Carnival Adventure", subtitle: "Field trip to the magic carnival!" },
  3: { title: "Sky Castle Squad", subtitle: "Epic team-up above the clouds" },
};

const TEENS_CLIPS: Record<1 | 2 | 3, Omit<CelebrationClip, "tier" | "gifSrc" | "mode">> = {
  1: { title: "Rooftop Power-Up", subtitle: "Neon fist-bump at sunset" },
  2: { title: "Neon City Run", subtitle: "Squad high-five in the night city" },
  3: { title: "Aurora Arena", subtitle: "Full crew leaps under the lights" },
};

const ULTRA_CLIPS: Record<1 | 2 | 3, Omit<CelebrationClip, "tier" | "gifSrc" | "mode">> = {
  1: { title: "Hatchling Spark", subtitle: "Base form — power still waking up" },
  2: { title: "Adolescent Surge", subtitle: "Subtle growth — early armor & energy" },
  3: { title: "Legend Unlocked", subtitle: "Full evolution — the wow form" },
};

export function getEvolutionLevel(points: number): number {
  if (!Number.isFinite(points) || points < POINTS_PER_LEVEL) return 0;
  return Math.min(MAX_EVOLUTION_LEVEL, Math.floor(points / POINTS_PER_LEVEL));
}

export function getEvolutionTier(points: number): EvolutionTier {
  const level = getEvolutionLevel(points);
  const base = TIERS[level] ?? TIERS[0]!;
  const formStage = getFormStage(points);
  return {
    level,
    name: base.name,
    color: base.color,
    ring: base.ring,
    glow: base.glow,
    power: level / MAX_EVOLUTION_LEVEL,
    formStage,
    formName: ULTRA_FORM_NAMES[formStage],
  };
}

export function didEvolve(prevPoints: number, nextPoints: number): boolean {
  return getEvolutionLevel(nextPoints) > getEvolutionLevel(prevPoints);
}

/** True when Ultra form stage advances (1→2 or 2→3). */
export function didFormEvolve(prevPoints: number, nextPoints: number): boolean {
  return getFormStage(nextPoints) > getFormStage(prevPoints);
}

export function pointsToNextLevel(points: number): number {
  const level = getEvolutionLevel(points);
  if (level >= MAX_EVOLUTION_LEVEL) return 0;
  const nextAt = (level + 1) * POINTS_PER_LEVEL;
  return Math.max(0, nextAt - Math.max(0, points));
}

export function getCelebrationTier(level: number): 1 | 2 | 3 {
  if (level <= 1) return 1;
  if (level === 2) return 2;
  return 3;
}

export function getCelebrationClip(
  points: number,
  pack: AvatarPack = "kids",
): CelebrationClip | null {
  const level = getEvolutionLevel(points);
  if (level < 1) return null;
  const tier = getCelebrationTier(level);

  if (pack === "ultra") {
    // Prefer form-stage celebration titles when form advanced
    const form = getFormStage(points);
    const meta = ULTRA_CLIPS[form] ?? ULTRA_CLIPS[tier];
    return {
      tier: form,
      title: meta.title,
      subtitle: meta.subtitle,
      gifSrc: null,
      mode: "ultra-morph",
    };
  }

  const meta = pack === "teens" ? TEENS_CLIPS[tier] : KIDS_CLIPS[tier];
  const mark = getMilestoneMark(points);
  const hit = Math.floor(points / POINTS_PER_LEVEL) * POINTS_PER_LEVEL;
  return {
    tier,
    title: mark ? `${mark.name} milestone` : meta.title,
    subtitle: hit > 0 ? `Hit ${hit} points` : meta.subtitle,
    gifSrc: null,
    mode: "milestone",
  };
}
