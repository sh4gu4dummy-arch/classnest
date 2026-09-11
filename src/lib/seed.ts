import type { Behavior, Classroom, Student } from "./types";
import { uid } from "./utils";

/** Double-tap board award — stable id, always +1. */
export const QUICK_PLUS_BEHAVIOR: Behavior = {
  id: "b_quick_plus",
  label: "+1",
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
  label: "+10",
  kind: "positive",
  points: 10,
  icon: "zap",
};

/** Default penalty — name is the value. */
export const MINUS_1_BEHAVIOR: Behavior = {
  id: "b_minus_1",
  label: "-1",
  kind: "needs_work",
  points: -1,
  icon: "minus",
};

/** Old 0-pt warning — kept so past awards still resolve. Not a default. */
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
  MINUS_1_BEHAVIOR.id,
]);

export function isCoreBehavior(id: string): boolean {
  return CORE_BEHAVIOR_IDS.has(id);
}

export const DEFAULT_BEHAVIORS: Behavior[] = [
  QUICK_PLUS_BEHAVIOR,
  BOOST_10_BEHAVIOR,
  MINUS_1_BEHAVIOR,
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
