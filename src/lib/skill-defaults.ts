import { normalizeSkillIcon } from "./skill-icons";
import type { Behavior } from "./types";
import {
  BOOST_10_BEHAVIOR,
  DEFAULT_BEHAVIORS,
  QUICK_PLUS_BEHAVIOR,
  WARNING_BEHAVIOR,
} from "./seed";

const STORAGE_KEY = "classnest-skill-defaults-v1";

function isBehavior(x: unknown): x is Behavior {
  if (!x || typeof x !== "object") return false;
  const b = x as Behavior;
  return (
    typeof b.id === "string" &&
    typeof b.label === "string" &&
    (b.kind === "positive" || b.kind === "needs_work") &&
    typeof b.points === "number" &&
    typeof b.icon === "string"
  );
}

/** Deep clone of factory skills (immutable seed list). */
export function factorySkillDefaults(): Behavior[] {
  return DEFAULT_BEHAVIORS.map((b) => ({ ...b }));
}

/**
 * Ensure protected core skills always exist:
 * quick +1, Boost +10, warning 0.
 */
export function ensureCoreSkills(list: Behavior[]): Behavior[] {
  const byId = new Map(
    list.map((b) => [
      b.id,
      { ...b, icon: normalizeSkillIcon(b.icon, b.kind) },
    ]),
  );
  // Force core definitions (so points/label can't drift after migrate)
  byId.set(QUICK_PLUS_BEHAVIOR.id, { ...QUICK_PLUS_BEHAVIOR });
  byId.set(BOOST_10_BEHAVIOR.id, { ...BOOST_10_BEHAVIOR });
  byId.set(WARNING_BEHAVIOR.id, { ...WARNING_BEHAVIOR });

  const ordered: Behavior[] = [];
  const coreOrder = [
    QUICK_PLUS_BEHAVIOR.id,
    BOOST_10_BEHAVIOR.id,
    WARNING_BEHAVIOR.id,
  ];
  for (const id of coreOrder) {
    const b = byId.get(id);
    if (b) {
      ordered.push(b);
      byId.delete(id);
    }
  }
  // Keep remaining skills in original relative order
  for (const b of list) {
    if (byId.has(b.id)) {
      ordered.push(byId.get(b.id)!);
      byId.delete(b.id);
    }
  }
  return ordered;
}

export function loadSkillDefaults(): Behavior[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    if (!parsed.every(isBehavior)) return null;
    return ensureCoreSkills(parsed.map((b) => ({ ...b })));
  } catch {
    return null;
  }
}

export function saveSkillDefaults(behaviors: Behavior[]): boolean {
  try {
    const clean = ensureCoreSkills(
      behaviors
        .filter(isBehavior)
        .map((b) => ({
          id: b.id,
          label: b.label,
          kind: b.kind,
          points: b.points,
          icon: b.icon,
        })),
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    return true;
  } catch {
    return false;
  }
}

export function clearSkillDefaults() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function hasCustomSkillDefaults(): boolean {
  return loadSkillDefaults() != null;
}

/**
 * What “Reset to defaults” and first-run seed use.
 * Prefer teacher-saved defaults; never silently invent.
 */
export function getEffectiveSkillDefaults(): Behavior[] {
  return ensureCoreSkills(loadSkillDefaults() ?? factorySkillDefaults());
}
