import type { ComponentType } from "react";
import {
  AlertCircle,
  Award,
  BookOpen,
  Check,
  Clock,
  EyeOff,
  Flame,
  Hand,
  HeartHandshake,
  Hourglass,
  Lightbulb,
  ListX,
  Medal,
  MessageCircleOff,
  Music,
  Palette,
  Pencil,
  Plus,
  Sparkles,
  Star,
  Target,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  Users,
  VolumeX,
  Zap,
} from "lucide-react";

export type SkillIconComp = ComponentType<{ className?: string }>;

export const SKILL_ICON_MAP: Record<string, SkillIconComp> = {
  plus: Plus,
  sparkles: Sparkles,
  star: Star,
  zap: Zap,
  "heart-handshake": HeartHandshake,
  target: Target,
  users: Users,
  hand: Hand,
  flame: Flame,
  "book-open": BookOpen,
  pencil: Pencil,
  trophy: Trophy,
  medal: Medal,
  award: Award,
  clock: Clock,
  check: Check,
  "thumbs-up": ThumbsUp,
  lightbulb: Lightbulb,
  music: Music,
  palette: Palette,
  "alert-circle": AlertCircle,
  "eye-off": EyeOff,
  "message-circle-off": MessageCircleOff,
  "list-x": ListX,
  "thumbs-down": ThumbsDown,
  "volume-x": VolumeX,
  hourglass: Hourglass,
};

export const SKILL_ICON_KEYS = Object.keys(SKILL_ICON_MAP);

export const POSITIVE_ICON_KEYS = [
  "sparkles",
  "star",
  "zap",
  "plus",
  "heart-handshake",
  "target",
  "users",
  "hand",
  "flame",
  "book-open",
  "pencil",
  "trophy",
  "medal",
  "award",
  "thumbs-up",
  "lightbulb",
  "music",
  "palette",
  "check",
  "clock",
] as const;

export const NEEDS_ICON_KEYS = [
  "alert-circle",
  "eye-off",
  "message-circle-off",
  "list-x",
  "thumbs-down",
  "volume-x",
  "hourglass",
  "clock",
] as const;

const LEGACY: Record<string, string> = {
  "✨": "sparkles",
  "⚠": "alert-circle",
  "⚠️": "alert-circle",
  star: "star",
};

export function normalizeSkillIcon(
  icon: string | undefined,
  kind: "positive" | "needs_work" = "positive",
): string {
  const raw = (icon ?? "").trim();
  const mapped = LEGACY[raw] ?? raw;
  if (mapped && SKILL_ICON_MAP[mapped]) return mapped;
  return kind === "needs_work" ? "alert-circle" : "sparkles";
}

export function defaultSkillIcon(kind: "positive" | "needs_work"): string {
  return kind === "needs_work" ? "alert-circle" : "sparkles";
}

export function getSkillIcon(icon: string | undefined): SkillIconComp {
  return SKILL_ICON_MAP[normalizeSkillIcon(icon)] ?? Sparkles;
}
