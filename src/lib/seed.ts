import type { Behavior, Classroom, Student } from "./types";
import { uid } from "./utils";

/** Double-tap board award — stable id, always +1. */
export const QUICK_PLUS_BEHAVIOR: Behavior = {
  id: "b_quick_plus",
  label: "Point",
  kind: "positive",
  points: 1,
  icon: "plus",
};

/**
 * Teacher testing / big awards — stable id, always +10.
 * Protected core skill (cannot be deleted; re-injected on migrate).
 */
export const BOOST_10_BEHAVIOR: Behavior = {
  id: "b_boost_10",
  label: "Boost +10",
  kind: "positive",
  points: 10,
  icon: "zap",
};

/** Penalty-free redirect — 0 pts, low warning tone. */
export const WARNING_BEHAVIOR: Behavior = {
  id: "b_warning_0",
  label: "Warning",
  kind: "needs_work",
  points: 0,
  icon: "alert-circle",
};

/** Core skills that always exist and cannot be deleted. */
export const CORE_BEHAVIOR_IDS = new Set([
  QUICK_PLUS_BEHAVIOR.id,
  BOOST_10_BEHAVIOR.id,
  WARNING_BEHAVIOR.id,
]);

export function isCoreBehavior(id: string): boolean {
  return CORE_BEHAVIOR_IDS.has(id);
}

export const DEFAULT_BEHAVIORS: Behavior[] = [
  QUICK_PLUS_BEHAVIOR,
  BOOST_10_BEHAVIOR,
  { id: "b_positive_1", label: "Helping others", kind: "positive", points: 1, icon: "heart-handshake" },
  { id: "b_positive_2", label: "On task", kind: "positive", points: 1, icon: "target" },
  { id: "b_positive_3", label: "Teamwork", kind: "positive", points: 1, icon: "users" },
  { id: "b_positive_4", label: "Participation", kind: "positive", points: 1, icon: "hand" },
  { id: "b_positive_5", label: "Perseverance", kind: "positive", points: 2, icon: "flame" },
  { id: "b_positive_6", label: "Kindness", kind: "positive", points: 1, icon: "sparkles" },
  WARNING_BEHAVIOR,
  { id: "b_needs_1", label: "Off task", kind: "needs_work", points: -1, icon: "eye-off" },
  { id: "b_needs_2", label: "Talking out", kind: "needs_work", points: -1, icon: "message-circle-off" },
  { id: "b_needs_3", label: "Not following directions", kind: "needs_work", points: -1, icon: "list-x" },
  { id: "b_needs_4", label: "Disrespect", kind: "needs_work", points: -2, icon: "thumbs-down" },
];

const DEMO_NAMES = [
  "Maya Chen",
  "Leo Park",
  "Sofia Reyes",
  "Noah Blake",
  "Ava Okonkwo",
  "Ethan Kim",
  "Zoe Martinez",
  "Liam Torres",
  "Iris Patel",
  "Owen Brooks",
  "Nina Hassan",
  "Kai Nakamura",
];

export const DEMO_CLASS_NAME = "Room 3B";

export function looksLikeDemoSnapshot(data: {
  classes?: { name?: string }[];
  students?: { name?: string }[];
}): boolean {
  if (!data.classes || data.classes.length !== 1) return false;
  if (data.classes[0]?.name !== DEMO_CLASS_NAME) return false;
  const names = new Set((data.students ?? []).map((s) => s.name));
  return DEMO_NAMES.filter((n) => names.has(n)).length >= 8;
}

export function createDemoClass(): {
  classroom: Classroom;
  students: Student[];
} {
  const now = Date.now();
  const classroom: Classroom = {
    id: uid("class"),
    name: DEMO_CLASS_NAME,
    grade: "3rd Grade",
    avatarPack: "kids",
    createdAt: now,
    updatedAt: now,
  };
  const students: Student[] = DEMO_NAMES.map((name, i) => ({
    id: uid("stu"),
    classId: classroom.id,
    name,
    avatarId: (i % 40) + 1,
    createdAt: now,
  }));
  return { classroom, students };
}

/** Normalize skill points: 0 stays 0 (warnings); else signed by kind, cap 10. */
export function normalizeSkillPoints(
  kind: "positive" | "needs_work",
  points: number,
): number {
  const n = Math.round(Number(points));
  if (!Number.isFinite(n)) return kind === "needs_work" ? -1 : 1;
  if (n === 0) return 0;
  const abs = Math.min(10, Math.max(1, Math.abs(n)));
  return kind === "needs_work" ? -abs : abs;
}
