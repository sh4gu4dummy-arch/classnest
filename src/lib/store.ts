import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import {
  avatarFromSeed,
  getAvatarCount,
  isAvatarPack,
  type AvatarPack,
} from "./avatars";
import { getShopItem, type ShopItem } from "./shop";
import { maxBet, resolveSpar, type SparResult } from "./spar";
import type {
  Behavior,
  BehaviorKind,
  Classroom,
  PointEvent,
  Student,
} from "./types";
import {
  QUICK_PLUS_BEHAVIOR,
  BOOST_10_BEHAVIOR,
  WARNING_BEHAVIOR,
  isCoreBehavior,
  normalizeSkillPoints,
} from "./seed";
import {
  getEffectiveSkillDefaults,
  hasCustomSkillDefaults,
  loadSkillDefaults,
  saveSkillDefaults,
  clearSkillDefaults,
  ensureCoreSkills,
} from "./skill-defaults";
import { getLocalBackup, listLocalBackups } from "./local-backups";
import { defaultSkillIcon, normalizeSkillIcon } from "./skill-icons";
import { uid } from "./utils";

/** Board target: 4 rows × 6 columns. */
export const MAX_CLASS_SIZE = 24;

export type ClassNestBackup = {
  /** v1 original; v2 may include skillDefaults */
  version: 1 | 2;
  exportedAt: number;
  classes: Classroom[];
  students: Student[];
  behaviors: Behavior[];
  events: PointEvent[];
  /** Teacher-saved skill defaults (optional; v2+) */
  skillDefaults?: Behavior[] | null;
};

/** Stable fingerprint — ignores exportedAt so idle re-exports are not "new". */
export function backupFingerprint(data: {
  classes: unknown;
  students: unknown;
  behaviors: unknown;
  events: unknown;
  skillDefaults?: unknown;
}): string {
  return JSON.stringify({
    classes: data.classes,
    students: data.students,
    behaviors: data.behaviors,
    events: data.events,
    skillDefaults: data.skillDefaults ?? null,
  });
}

export type CompactResult = {
  before: number;
  after: number;
  rollups: number;
  removed: number;
  keepDays: number;
};

/** O(E) once per events identity — avoids O(S×E) scans on the board. */
let _ptsEvents: PointEvent[] | null = null;
let _ptsMap: Map<string, number> | null = null;

export function pointsMapFromEvents(events: PointEvent[]): Map<string, number> {
  if (_ptsEvents === events && _ptsMap) return _ptsMap;
  const m = new Map<string, number>();
  for (let i = 0; i < events.length; i++) {
    const e = events[i]!;
    m.set(e.studentId, (m.get(e.studentId) ?? 0) + e.points);
  }
  _ptsEvents = events;
  _ptsMap = m;
  return m;
}

/**
 * One pass over class events → lifetime + today + optional season maps.
 * Avoids 2–3 filter copies + 2–3 full scans on every award.
 */
export function multiPointsMaps(
  events: PointEvent[],
  opts: { todayStart: number; seasonStart?: number | null },
): {
  life: Map<string, number>;
  today: Map<string, number>;
  season: Map<string, number>;
  classLifeTotal: number;
  todayAwardCount: number;
  todayPositivePts: number;
} {
  const life = new Map<string, number>();
  const today = new Map<string, number>();
  const season = new Map<string, number>();
  const t0 = opts.todayStart;
  const s0 = opts.seasonStart ?? null;
  let classLifeTotal = 0;
  let todayAwardCount = 0;
  let todayPositivePts = 0;

  for (let i = 0; i < events.length; i++) {
    const e = events[i]!;
    const pts = e.points;
    classLifeTotal += pts;
    life.set(e.studentId, (life.get(e.studentId) ?? 0) + pts);

    if (e.createdAt >= t0) {
      todayAwardCount += 1;
      today.set(e.studentId, (today.get(e.studentId) ?? 0) + pts);
      if (e.kind === "positive" && pts > 0) todayPositivePts += pts;
    }
    if (s0 != null && e.createdAt >= s0) {
      season.set(e.studentId, (season.get(e.studentId) ?? 0) + pts);
    }
  }

  return {
    life,
    today,
    season,
    classLifeTotal,
    todayAwardCount,
    todayPositivePts,
  };
}

function invalidatePointsCache() {
  _ptsEvents = null;
  _ptsMap = null;
}

/** Reference equality for filtered lists (same item refs in same order). */
export function listRefEqual<T>(a: T[], b: T[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/** Debounce localStorage writes so rapid +1s don't jank the main thread.
 *  Also refuses to overwrite a non-empty classroom save with an empty one
 *  (guards HMR / race reloads that briefly re-init with classes: []). */
function createDebouncedStorage(delayMs = 500): StateStorage {
  const pending = new Map<string, string>();
  let timer: ReturnType<typeof setTimeout> | null = null;
  let idleId: number | null = null;

  const flush = () => {
    timer = null;
    if (idleId != null && typeof cancelIdleCallback === "function") {
      cancelIdleCallback(idleId);
      idleId = null;
    }
    pending.forEach((value, name) => {
      try {
        localStorage.setItem(name, value);
      } catch {
        /* quota */
      }
    });
    pending.clear();
  };
  persistFlushNow = flush;

  const schedule = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      // Prefer idle time so award animations stay smooth
      if (typeof requestIdleCallback === "function") {
        idleId = requestIdleCallback(() => flush(), { timeout: delayMs });
      } else {
        flush();
      }
    }, delayMs);
  };

  if (typeof window !== "undefined") {
    const onHide = () => flush();
    window.addEventListener("pagehide", onHide);
    window.addEventListener("beforeunload", onHide);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flush();
    });
  }

  function wouldWipeNonEmpty(name: string, value: string): boolean {
    try {
      const next = JSON.parse(value) as {
        state?: { classes?: unknown[]; students?: unknown[] };
      };
      const nextClasses = next?.state?.classes;
      const nextStudents = next?.state?.students;
      const raw = localStorage.getItem(name);
      if (!raw) return false;
      const prev = JSON.parse(raw) as {
        state?: { classes?: unknown[]; students?: unknown[] };
      };
      const prevClasses = prev?.state?.classes;
      const prevStudents = prev?.state?.students;
      const hadClasses = Array.isArray(prevClasses) && prevClasses.length > 0;
      const hadStudents = Array.isArray(prevStudents) && prevStudents.length > 0;
      const nextEmptyClasses = Array.isArray(nextClasses) && nextClasses.length === 0;
      const nextEmptyStudents =
        Array.isArray(nextStudents) && nextStudents.length === 0;
      if (hadClasses && nextEmptyClasses) return true;
      if (hadStudents && nextEmptyStudents && nextEmptyClasses) return true;
      return false;
    } catch {
      return false;
    }
  }

  return {
    getItem: (name) => {
      if (pending.has(name)) return pending.get(name)!;
      try {
        return localStorage.getItem(name);
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      if (wouldWipeNonEmpty(name, value)) {
        // Keep the good save; drop the empty write
        pending.delete(name);
        return;
      }
      if (pending.get(name) === value) return;
      try {
        if (!pending.has(name) && localStorage.getItem(name) === value) return;
      } catch {
        /* quota / private mode */
      }
      pending.set(name, value);
      schedule();
    },
    removeItem: (name) => {
      pending.delete(name);
      try {
        localStorage.removeItem(name);
      } catch {
        /* ignore */
      }
    },
  };
}

interface ClassStore {
  classes: Classroom[];
  students: Student[];
  behaviors: Behavior[];
  events: PointEvent[];
  seeded: boolean;

  seedIfEmpty: () => void;
  migrateStudents: () => void;
  addClass: (name: string, grade?: string, avatarPack?: AvatarPack) => string;
  updateClass: (
    id: string,
    patch: Partial<
      Pick<Classroom, "name" | "grade" | "avatarPack" | "dailyGoal" | "seasonStartAt" | "boardBackdrop">
    >,
  ) => void;
  archiveClass: (id: string) => void;
  unarchiveClass: (id: string) => void;
  deleteClass: (id: string) => void;

  addStudent: (classId: string, name: string, avatarId?: number) => string | null;
  updateStudent: (
    id: string,
    patch: Partial<
      Pick<
        Student,
        | "name"
        | "avatarId"
        | "avatarSeed"
        | "seatIndex"
        | "group"
        | "absentOn"
        | "lateOn"
        | "shieldCharges"
        | "stars"
        | "bannerId"
        | "frameId"
        | "homeItems"
        | "ownedBanners"
        | "ownedFrames"
      >
    >,
  ) => void;
  deleteStudent: (id: string) => void;
  /** Set board seat order for a class (ids left→right, top→bottom). */
  setSeatOrder: (classId: string, orderedIds: string[]) => void;
  /** Mark / unmark absent for today (YYYY-MM-DD). null = present. */
  setAbsentToday: (studentId: string, absent: boolean) => void;
  /** present | late | absent for today */
  setAttendanceToday: (
    studentId: string,
    status: "present" | "late" | "absent",
  ) => void;

  addBehavior: (
    label: string,
    kind: BehaviorKind,
    points: number,
    opts?: { icon?: string; classId?: string },
  ) => void;
  updateBehavior: (
    id: string,
    patch: Partial<Omit<Behavior, "id">>,
    classId?: string,
  ) => void;
  deleteBehavior: (id: string, classId?: string) => void;
  resetBehaviors: (classId?: string) => void;
  classBehaviors: (classId: string) => Behavior[];
  copyBehaviorsFromClass: (targetId: string, sourceId: string) => boolean;
  useSharedBehaviors: (classId: string) => void;
  saveBehaviorsAsDefault: (classId?: string) => void;
  clearBehaviorDefaults: () => void;
  hasCustomBehaviorDefaults: () => boolean;

  awardPoints: (opts: {
    studentId: string;
    classId: string;
    behaviorId: string;
    note?: string;
  }) => PointEvent | null;
  awardPointsBatch: (opts: {
    studentIds: string[];
    classId: string;
    behaviorId: string;
    note?: string;
  }) => PointEvent[];
  grantPoints: (opts: {
    studentId: string;
    classId: string;
    points: number;
    label: string;
    note?: string;
  }) => PointEvent | null;
  undoEvent: (eventId: string) => void;
  undoLastClassEvent: (classId: string) => PointEvent | null;
  clearStudentEvents: (studentId: string) => void;

  /** Collapse events older than keepDays into one total per student/class. */
  compactOldEvents: (keepDays?: number) => CompactResult;
  /** Count what compress would do without changing data */
  previewCompactOldEvents: (keepDays?: number) => CompactResult;

  spar: (opts: {
    classId: string;
    attackerId: string;
    defenderId: string;
    bet: number;
  }) =>
    | { ok: true; result: SparResult }
    | { ok: false; error: string };

  buyItem: (opts: {
    classId: string;
    studentId: string;
    itemId: string;
  }) => { ok: true; item: ShopItem } | { ok: false; error: string };

  equipBanner: (studentId: string, bannerId: string | null) => void;
  equipFrame: (studentId: string, frameId: string | null) => void;
  placeHomeItem: (studentId: string, itemId: string) => void;
  removeHomeItem: (studentId: string, itemId: string) => void;

  exportBackup: () => ClassNestBackup;
  importBackup: (data: unknown) => { ok: true } | { ok: false; error: string };
  /** Union restore — keeps existing classes/students/events not in the file */
  mergeBackup: (data: unknown) =>
    | { ok: true; addedClasses: number; addedStudents: number; addedEvents: number }
    | { ok: false; error: string };

  studentPoints: (studentId: string) => number;
  classStudents: (classId: string) => Student[];
  classEvents: (classId: string) => PointEvent[];
  studentEvents: (studentId: string) => PointEvent[];
  classAvatarPack: (classId: string) => AvatarPack;
}

function isBehaviorLike(x: unknown): x is Behavior {
  if (!x || typeof x !== "object") return false;
  const b = x as Behavior;
  return (
    typeof b.id === "string" &&
    typeof b.label === "string" &&
    (b.kind === "positive" || b.kind === "needs_work") &&
    typeof b.points === "number"
  );
}

export function isBackup(data: unknown): data is ClassNestBackup {
  if (!data || typeof data !== "object") return false;
  const d = data as ClassNestBackup;
  if (d.version !== 1 && d.version !== 2) return false;
  if (
    !Array.isArray(d.classes) ||
    !Array.isArray(d.students) ||
    !Array.isArray(d.behaviors) ||
    !Array.isArray(d.events)
  ) {
    return false;
  }
  for (const c of d.classes) {
    if (!c || typeof c !== "object") return false;
    if (typeof (c as Classroom).id !== "string") return false;
    if (typeof (c as Classroom).name !== "string") return false;
  }
  for (const st of d.students) {
    if (!st || typeof st !== "object") return false;
    if (typeof (st as Student).id !== "string") return false;
    if (typeof (st as Student).classId !== "string") return false;
    if (typeof (st as Student).name !== "string") return false;
  }
  for (const e of d.events) {
    if (!e || typeof e !== "object") return false;
    if (typeof (e as PointEvent).id !== "string") return false;
    if (typeof (e as PointEvent).studentId !== "string") return false;
    if (typeof (e as PointEvent).classId !== "string") return false;
    if (typeof (e as PointEvent).points !== "number") return false;
  }
  if (d.skillDefaults != null) {
    if (!Array.isArray(d.skillDefaults)) return false;
    if (!d.skillDefaults.every(isBehaviorLike)) return false;
  }
  return true;
}

function normalizeClassroom(c: Classroom): Classroom {
  const pack = isAvatarPack(c.avatarPack) ? c.avatarPack : "kids";
  const own =
    Array.isArray(c.behaviors) && c.behaviors.length > 0
      ? ensureCoreSkills(c.behaviors.filter(isBehaviorLike))
      : undefined;
  return {
    ...c,
    avatarPack: pack,
    archivedAt: c.archivedAt ?? null,
    seasonStartAt: c.seasonStartAt ?? null,
    boardBackdrop: c.boardBackdrop ?? null,
    behaviors: own,
  };
}

function normalizeStudent(
  st: Student & { avatarSeed?: number },
  pack: AvatarPack = "kids",
): Student {
  let avatarId = st.avatarId;
  if (!avatarId || avatarId < 1 || avatarId > getAvatarCount(pack)) {
    avatarId =
      st.avatarSeed != null ? avatarFromSeed(st.avatarSeed, pack) : 1;
  }
  return {
    ...st,
    avatarId,
    seatIndex: st.seatIndex ?? st.createdAt ?? 0,
    group: st.group?.trim() || null,
    absentOn: st.absentOn ?? null,
    lateOn: st.lateOn ?? null,
    shieldCharges: st.shieldCharges ?? 0,
    stars: st.stars ?? 0,
    bannerId: st.bannerId ?? null,
    frameId: st.frameId ?? null,
    homeItems: st.homeItems ?? [],
    ownedBanners: st.ownedBanners ?? [],
    ownedFrames: st.ownedFrames ?? [],
  };
}

function touchClass(classes: Classroom[], classId: string): Classroom[] {
  const now = Date.now();
  return classes.map((c) =>
    c.id === classId ? { ...c, updatedAt: now } : c,
  );
}

function cloneBehaviorList(list: Behavior[]): Behavior[] {
  return ensureCoreSkills(
    list.map((b) => ({
      ...b,
      icon: normalizeSkillIcon(b.icon, b.kind),
    })),
  );
}

function effectiveList(
  s: { classes: Classroom[]; behaviors: Behavior[] },
  classId?: string,
): Behavior[] {
  if (classId) {
    const c = s.classes.find((x) => x.id === classId);
    if (c?.behaviors && c.behaviors.length > 0) return c.behaviors;
  }
  return s.behaviors.length > 0 ? s.behaviors : getEffectiveSkillDefaults();
}

function writeClassSkillList(
  classes: Classroom[],
  classId: string,
  list: Behavior[],
): Classroom[] {
  const now = Date.now();
  return classes.map((c) =>
    c.id === classId
      ? { ...c, behaviors: cloneBehaviorList(list), updatedAt: now }
      : c,
  );
}

const DAY_MS = 86400000;

let persistFlushNow = () => {};

export function flushClassNestPersist() {
  persistFlushNow();
}

export const useClassStore = create<ClassStore>()(
  persist(
    (set, get) => ({
      classes: [],
      students: [],
      behaviors: getEffectiveSkillDefaults(),
      events: [],
      seeded: false,

      seedIfEmpty: () => {
        const s = get();
        if (s.seeded || s.classes.length > 0) {
          get().migrateStudents();
          return;
        }

        // Recover from last in-browser snapshot. Never invent a demo class —
        // that was wiping real rooms whenever preview storage reset.
        try {
          const metas = listLocalBackups();
          for (const m of metas) {
            const data = getLocalBackup(m.id);
            if (data?.classes?.length) {
              const result = get().importBackup(data);
              if (result.ok) {
                get().migrateStudents();
                return;
              }
            }
          }
        } catch {
          /* ignore */
        }

        get().migrateStudents();
      },

      migrateStudents: () => {
        const s = get();
        const behaviors =
          s.behaviors.length > 0
            ? ensureCoreSkills(s.behaviors)
            : getEffectiveSkillDefaults();
        const classes = s.classes.map(normalizeClassroom);
        const students = s.students.map((st) => {
          const pack = get().classAvatarPack(st.classId);
          return normalizeStudent(st, pack);
        });
        if (
          s.seeded &&
          JSON.stringify(s.classes) === JSON.stringify(classes) &&
          JSON.stringify(s.students) === JSON.stringify(students) &&
          JSON.stringify(s.behaviors) === JSON.stringify(behaviors)
        ) {
          return;
        }
        set({ classes, students, behaviors, seeded: true });
      },

      addClass: (name, grade, avatarPack = "kids") => {
        const id = uid("class");
        const now = Date.now();
        const pack = isAvatarPack(avatarPack) ? avatarPack : "kids";
        set((s) => ({
          classes: [
            {
              id,
              name: name.trim(),
              grade: grade?.trim() || undefined,
              avatarPack: pack,
              createdAt: now,
              updatedAt: now,
              archivedAt: null,
              dailyGoal: null,
            },
            ...s.classes,
          ],
        }));
        return id;
      },

      updateClass: (id, patch) => {
        set((s) => ({
          classes: s.classes.map((c) =>
            c.id === id
              ? {
                  ...c,
                  ...patch,
                  name: patch.name != null ? patch.name.trim() : c.name,
                  grade:
                    patch.grade !== undefined
                      ? patch.grade?.trim() || undefined
                      : c.grade,
                  avatarPack: patch.avatarPack
                    ? isAvatarPack(patch.avatarPack)
                      ? patch.avatarPack
                      : c.avatarPack
                    : c.avatarPack,
                  updatedAt: Date.now(),
                }
              : c,
          ),
        }));
      },

      archiveClass: (id) => {
        set((s) => ({
          classes: s.classes.map((c) =>
            c.id === id
              ? { ...c, archivedAt: Date.now(), updatedAt: Date.now() }
              : c,
          ),
        }));
      },

      unarchiveClass: (id) => {
        set((s) => ({
          classes: s.classes.map((c) =>
            c.id === id
              ? { ...c, archivedAt: null, updatedAt: Date.now() }
              : c,
          ),
        }));
      },

      deleteClass: (id) => {
        set((s) => {
          const studentIds = new Set(
            s.students.filter((st) => st.classId === id).map((st) => st.id),
          );
          return {
            classes: s.classes.filter((c) => c.id !== id),
            students: s.students.filter((st) => st.classId !== id),
            events: s.events.filter(
              (e) => e.classId !== id && !studentIds.has(e.studentId),
            ),
          };
        });
        invalidatePointsCache();
      },

      addStudent: (classId, name, avatarId) => {
        const s = get();
        const count = s.students.filter((st) => st.classId === classId).length;
        if (count >= MAX_CLASS_SIZE) return null;
        const pack = get().classAvatarPack(classId);
        const maxA = getAvatarCount(pack);
        const id = uid("stu");
        const aid =
          avatarId && avatarId >= 1 && avatarId <= maxA
            ? avatarId
            : ((count % maxA) + 1);
        set((state) => ({
          students: [
            ...state.students,
            normalizeStudent(
              {
                id,
                classId,
                name: name.trim(),
                avatarId: aid,
                createdAt: Date.now(),
                seatIndex:
                  Math.max(
                    0,
                    ...state.students
                      .filter((x) => x.classId === classId)
                      .map((x) => x.seatIndex ?? 0),
                  ) + 1,
              },
              pack,
            ),
          ],
          classes: touchClass(state.classes, classId),
        }));
        return id;
      },

      updateStudent: (id, patch) => {
        set((s) => ({
          students: s.students.map((st) =>
            st.id === id
              ? {
                  ...st,
                  ...patch,
                  name: patch.name != null ? patch.name.trim() : st.name,
                }
              : st,
          ),
        }));
      },

      deleteStudent: (id) => {
        const st = get().students.find((s) => s.id === id);
        set((s) => ({
          students: s.students.filter((row) => row.id !== id),
          events: s.events.filter((e) => e.studentId !== id),
          classes: st ? touchClass(s.classes, st.classId) : s.classes,
        }));
        invalidatePointsCache();
        persistFlushNow();
        queueMicrotask(() => {
          void import("./classroom-sync").then((m) =>
            m.scheduleClassroomVaultPush(0),
          );
        });
      },

      setSeatOrder: (classId, orderedIds) => {
        const order = new Map(orderedIds.map((id, i) => [id, i]));
        set((s) => ({
          students: s.students.map((st) => {
            if (st.classId !== classId) return st;
            if (!order.has(st.id)) return st;
            return { ...st, seatIndex: order.get(st.id)! };
          }),
          classes: touchClass(s.classes, classId),
        }));
      },

      setAbsentToday: (studentId, absent) => {
        const day = (() => {
          const d = new Date();
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          const dayN = String(d.getDate()).padStart(2, "0");
          return `${y}-${m}-${dayN}`;
        })();
        set((s) => ({
          students: s.students.map((st) =>
            st.id === studentId
              ? {
                  ...st,
                  absentOn: absent ? day : null,
                  lateOn: absent ? null : st.lateOn,
                }
              : st,
          ),
        }));
      },

      setAttendanceToday: (studentId, status) => {
        const day = (() => {
          const d = new Date();
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          const dayN = String(d.getDate()).padStart(2, "0");
          return `${y}-${m}-${dayN}`;
        })();
        set((s) => ({
          students: s.students.map((st) => {
            if (st.id !== studentId) return st;
            if (status === "absent") {
              return { ...st, absentOn: day, lateOn: null };
            }
            if (status === "late") {
              return { ...st, absentOn: null, lateOn: day };
            }
            return { ...st, absentOn: null, lateOn: null };
          }),
        }));
      },

      addBehavior: (label, kind, points, opts) => {
        const pts = normalizeSkillPoints(kind, points);
        const next: Behavior = {
          id: uid("beh"),
          label: label.trim(),
          kind,
          points: pts,
          icon: normalizeSkillIcon(opts?.icon, kind) || defaultSkillIcon(kind),
        };
        set((s) => {
          if (opts?.classId) {
            const base = effectiveList(s, opts.classId);
            return {
              classes: writeClassSkillList(s.classes, opts.classId, [
                ...base,
                next,
              ]),
            };
          }
          return { behaviors: [...s.behaviors, next] };
        });
      },

      updateBehavior: (id, patch, classId) => {
        const apply = (list: Behavior[]) =>
          list.map((b) => {
            if (b.id !== id) return b;
            const kind = patch.kind ?? b.kind;
            const points =
              patch.points != null
                ? normalizeSkillPoints(kind, patch.points)
                : b.points;
            const icon =
              patch.icon != null
                ? normalizeSkillIcon(patch.icon, kind)
                : normalizeSkillIcon(b.icon, kind);
            return {
              ...b,
              ...patch,
              label: patch.label != null ? patch.label.trim() : b.label,
              kind,
              points,
              icon,
            };
          });
        set((s) => {
          if (classId) {
            return {
              classes: writeClassSkillList(
                s.classes,
                classId,
                apply(effectiveList(s, classId)),
              ),
            };
          }
          return { behaviors: apply(s.behaviors) };
        });
      },

      deleteBehavior: (id, classId) => {
        if (isCoreBehavior(id)) return;
        set((s) => {
          if (classId) {
            return {
              classes: writeClassSkillList(
                s.classes,
                classId,
                effectiveList(s, classId).filter((b) => b.id !== id),
              ),
            };
          }
          return { behaviors: s.behaviors.filter((b) => b.id !== id) };
        });
      },

      resetBehaviors: (classId) => {
        const fresh = getEffectiveSkillDefaults();
        if (classId) {
          set((s) => ({
            classes: writeClassSkillList(s.classes, classId, fresh),
          }));
          return;
        }
        set({ behaviors: fresh });
      },

      classBehaviors: (classId) => effectiveList(get(), classId),

      copyBehaviorsFromClass: (targetId, sourceId) => {
        if (!targetId || targetId === sourceId) return false;
        const src = effectiveList(get(), sourceId);
        if (!src.length) return false;
        set((s) => ({
          classes: writeClassSkillList(s.classes, targetId, src),
        }));
        return true;
      },

      useSharedBehaviors: (classId) => {
        set((s) => ({
          classes: s.classes.map((c) =>
            c.id === classId
              ? { ...c, behaviors: undefined, updatedAt: Date.now() }
              : c,
          ),
        }));
      },

      saveBehaviorsAsDefault: (classId?: string) => {
        const list = classId
          ? get().classBehaviors(classId)
          : get().behaviors;
        saveSkillDefaults(list);
      },

      clearBehaviorDefaults: () => {
        clearSkillDefaults();
      },

      hasCustomBehaviorDefaults: () => hasCustomSkillDefaults(),

      awardPoints: ({ studentId, classId, behaviorId, note }) => {
        const list = classId ? get().classBehaviors(classId) : get().behaviors;
        let behavior = list.find((b) => b.id === behaviorId);
        if (!behavior && behaviorId === QUICK_PLUS_BEHAVIOR.id) {
          behavior = QUICK_PLUS_BEHAVIOR;
        }
        if (!behavior && behaviorId === BOOST_10_BEHAVIOR.id) {
          behavior = BOOST_10_BEHAVIOR;
        }
        if (!behavior && behaviorId === WARNING_BEHAVIOR.id) {
          behavior = WARNING_BEHAVIOR;
        }
        if (!behavior) return null;
        const event: PointEvent = {
          id: uid("evt"),
          studentId,
          classId,
          behaviorId: behavior.id,
          behaviorLabel: behavior.label,
          kind: behavior.kind,
          points: behavior.points,
          note,
          createdAt: Date.now(),
          source: "behavior",
        };
        set((s) => ({
          events: [event, ...s.events],
          classes: touchClass(s.classes, classId),
        }));
        invalidatePointsCache();
        return event;
      },

      awardPointsBatch: ({ studentIds, classId, behaviorId, note }) => {
        const list = classId ? get().classBehaviors(classId) : get().behaviors;
        let behavior = list.find((b) => b.id === behaviorId);
        if (!behavior && behaviorId === QUICK_PLUS_BEHAVIOR.id) {
          behavior = QUICK_PLUS_BEHAVIOR;
        }
        if (!behavior && behaviorId === BOOST_10_BEHAVIOR.id) {
          behavior = BOOST_10_BEHAVIOR;
        }
        if (!behavior && behaviorId === WARNING_BEHAVIOR.id) {
          behavior = WARNING_BEHAVIOR;
        }
        if (!behavior) return [];
        const now = Date.now();
        const created: PointEvent[] = studentIds.map((studentId, i) => ({
          id: uid("evt"),
          studentId,
          classId,
          behaviorId: behavior!.id,
          behaviorLabel: behavior!.label,
          kind: behavior!.kind,
          points: behavior!.points,
          note,
          createdAt: now + i,
          source: "behavior" as const,
        }));
        if (!created.length) return [];
        set((s) => ({
          events: [...created, ...s.events],
          classes: touchClass(s.classes, classId),
        }));
        invalidatePointsCache();
        return created;
      },

      grantPoints: ({ studentId, classId, points, label, note }) => {
        const pts = Math.round(points);
        if (!Number.isFinite(pts) || pts === 0) return null;
        const event: PointEvent = {
          id: uid("evt"),
          studentId,
          classId,
          behaviorId: "grant_custom",
          behaviorLabel: label.trim() || "Bonus",
          kind: pts > 0 ? "positive" : "needs_work",
          points: pts,
          note,
          createdAt: Date.now(),
          source: "behavior",
        };
        set((s) => ({
          events: [event, ...s.events],
          classes: touchClass(s.classes, classId),
        }));
        invalidatePointsCache();
        return event;
      },

      undoEvent: (eventId) => {
        set((s) => ({
          events: s.events.filter((e) => e.id !== eventId),
        }));
        invalidatePointsCache();
      },

      undoLastClassEvent: (classId) => {
        const last = get()
          .events.filter(
            (e) =>
              e.classId === classId && (e.source ?? "behavior") === "behavior",
          )
          .sort((a, b) => b.createdAt - a.createdAt)[0];
        if (!last) return null;
        set((s) => ({
          events: s.events.filter((e) => e.id !== last.id),
        }));
        invalidatePointsCache();
        return last;
      },

      clearStudentEvents: (studentId) => {
        set((s) => ({
          events: s.events.filter((e) => e.studentId !== studentId),
        }));
        invalidatePointsCache();
      },

      compactOldEvents: (keepDays = 14) => {
        const days = Math.max(1, Math.min(365, Math.round(keepDays)));
        const cutoff = Date.now() - days * DAY_MS;
        const all = get().events;
        const before = all.length;
        const recent: PointEvent[] = [];
        const old: PointEvent[] = [];
        for (const e of all) {
          if (e.createdAt >= cutoff) recent.push(e);
          else old.push(e);
        }
        if (old.length === 0) {
          return {
            before,
            after: before,
            rollups: 0,
            removed: 0,
            keepDays: days,
          };
        }

        type Acc = {
          classId: string;
          studentId: string;
          points: number;
          count: number;
          oldest: number;
        };
        const groups = new Map<string, Acc>();
        for (const e of old) {
          const key = `${e.classId}::${e.studentId}`;
          const g = groups.get(key);
          if (g) {
            g.points += e.points;
            g.count += 1;
            if (e.createdAt < g.oldest) g.oldest = e.createdAt;
          } else {
            groups.set(key, {
              classId: e.classId,
              studentId: e.studentId,
              points: e.points,
              count: 1,
              oldest: e.createdAt,
            });
          }
        }

        const rollups: PointEvent[] = [];
        for (const g of groups.values()) {
          const pts = Math.round(g.points);
          rollups.push({
            id: uid("evt"),
            studentId: g.studentId,
            classId: g.classId,
            behaviorId: "history_rollup",
            behaviorLabel: `History rollup (${g.count} entries)`,
            kind: pts >= 0 ? "positive" : "needs_work",
            points: pts,
            note: `Compacted awards older than ${days} days. Individual skill tags removed; total points kept.`,
            createdAt: g.oldest,
            source: "behavior",
          });
        }

        const next = [...recent, ...rollups].sort(
          (a, b) => b.createdAt - a.createdAt,
        );
        set({ events: next });
        invalidatePointsCache();
        return {
          before,
          after: next.length,
          rollups: rollups.length,
          removed: old.length,
          keepDays: days,
        };
      },

      previewCompactOldEvents: (keepDays = 14) => {
        const days = Math.max(1, Math.min(365, Math.round(keepDays)));
        const cutoff = Date.now() - days * DAY_MS;
        const all = get().events;
        const before = all.length;
        let oldCount = 0;
        const groupKeys = new Set<string>();
        for (const e of all) {
          if (e.createdAt < cutoff) {
            oldCount += 1;
            groupKeys.add(`${e.classId}::${e.studentId}`);
          }
        }
        if (oldCount === 0) {
          return {
            before,
            after: before,
            rollups: 0,
            removed: 0,
            keepDays: days,
          };
        }
        const rollups = groupKeys.size;
        const after = before - oldCount + rollups;
        return {
          before,
          after,
          rollups,
          removed: oldCount,
          keepDays: days,
        };
      },

      spar: ({ classId, attackerId, defenderId, bet }) => {
        const s = get();
        const attacker = s.students.find((st) => st.id === attackerId);
        const defender = s.students.find((st) => st.id === defenderId);
        if (!attacker || !defender) return { ok: false, error: "Student not found" };
        if (attackerId === defenderId)
          return { ok: false, error: "Pick two different students" };

        const aPts = get().studentPoints(attackerId);
        const dPts = get().studentPoints(defenderId);
        const cap = maxBet(aPts, dPts);
        if (bet < 1 || bet > cap) {
          return { ok: false, error: `Bet must be 1–${cap}` };
        }

        const result = resolveSpar({
          attackerId,
          defenderId,
          attackerPoints: aPts,
          defenderPoints: dPts,
          bet,
          defenderShieldCharges: defender.shieldCharges ?? 0,
        });

        const now = Date.now();
        const events: PointEvent[] = [];

        if (result.blocked) {
          events.push({
            id: uid("evt"),
            studentId: defenderId,
            classId,
            behaviorId: "spar_shield",
            behaviorLabel: "Shield blocked spar",
            kind: "positive",
            points: 0,
            createdAt: now,
            source: "spar",
            relatedStudentId: attackerId,
          });
          set((state) => ({
            events: [...events, ...state.events],
            students: state.students.map((st) =>
              st.id === defenderId
                ? {
                    ...st,
                    shieldCharges: Math.max(0, (st.shieldCharges ?? 0) - 1),
                  }
                : st,
            ),
            classes: touchClass(state.classes, classId),
          }));
          invalidatePointsCache();
          return { ok: true, result };
        }

        events.push(
          {
            id: uid("evt"),
            studentId: result.winnerId,
            classId,
            behaviorId: "spar_win",
            behaviorLabel: "Spar win",
            kind: "positive",
            points: result.bet,
            createdAt: now,
            source: "spar",
            relatedStudentId: result.loserId,
          },
          {
            id: uid("evt"),
            studentId: result.loserId,
            classId,
            behaviorId: "spar_loss",
            behaviorLabel: "Spar loss",
            kind: "needs_work",
            points: -result.bet,
            createdAt: now + 1,
            source: "spar",
            relatedStudentId: result.winnerId,
          },
        );

        set((state) => ({
          events: [...events, ...state.events],
          classes: touchClass(state.classes, classId),
        }));
        invalidatePointsCache();
        return { ok: true, result };
      },

      buyItem: ({ classId, studentId, itemId }) => {
        const item = getShopItem(itemId);
        if (!item) return { ok: false, error: "Unknown item" };
        const st0 = get().students.find((x) => x.id === studentId);
        if (!st0) return { ok: false, error: "Student missing" };
        if (item.type === "banner" && (st0.ownedBanners ?? []).includes(item.id)) {
          return { ok: false, error: "Already owned" };
        }
        if (item.type === "frame" && (st0.ownedFrames ?? []).includes(item.id)) {
          return { ok: false, error: "Already owned" };
        }
        if (item.type === "home" && (st0.homeItems ?? []).includes(item.id)) {
          return { ok: false, error: "Already owned" };
        }
        if (item.type === "star" && (st0.stars ?? 0) >= (item.max ?? 5)) {
          return { ok: false, error: "Max stars" };
        }
        const pts = get().studentPoints(studentId);
        if (pts < item.cost) return { ok: false, error: "Not enough points" };

        const event: PointEvent = {
          id: uid("evt"),
          studentId,
          classId,
          behaviorId: "shop_buy",
          behaviorLabel: `Shop: ${item.name}`,
          kind: "needs_work",
          points: -item.cost,
          createdAt: Date.now(),
          source: "shop",
          shopItemId: item.id,
        };

        set((s) => ({
          events: [event, ...s.events],
          students: s.students.map((st) => {
            if (st.id !== studentId) return st;
            const next = { ...st };
            if (item.type === "shield") {
              next.shieldCharges = (next.shieldCharges ?? 0) + (item.charges ?? 1);
            } else if (item.type === "star") {
              next.stars = Math.min(item.max ?? 99, (next.stars ?? 0) + 1);
            } else if (item.type === "banner") {
              next.ownedBanners = [...(next.ownedBanners ?? []), item.id];
              next.bannerId = item.id;
            } else if (item.type === "frame") {
              next.ownedFrames = [...(next.ownedFrames ?? []), item.id];
              next.frameId = item.id;
            } else if (item.type === "home") {
              next.homeItems = [...(next.homeItems ?? []), item.id];
            }
            return next;
          }),
          classes: touchClass(s.classes, classId),
        }));
        invalidatePointsCache();
        return { ok: true, item };
      },

      equipBanner: (studentId, bannerId) => {
        set((s) => ({
          students: s.students.map((st) =>
            st.id === studentId ? { ...st, bannerId } : st,
          ),
        }));
      },

      equipFrame: (studentId, frameId) => {
        set((s) => ({
          students: s.students.map((st) =>
            st.id === studentId ? { ...st, frameId } : st,
          ),
        }));
      },

      placeHomeItem: (studentId, itemId) => {
        set((s) => ({
          students: s.students.map((st) => {
            if (st.id !== studentId) return st;
            const items = st.homeItems ?? [];
            if (items.includes(itemId)) return st;
            return { ...st, homeItems: [...items, itemId] };
          }),
        }));
      },

      removeHomeItem: (studentId, itemId) => {
        set((s) => ({
          students: s.students.map((st) => {
            if (st.id !== studentId) return st;
            return {
              ...st,
              homeItems: (st.homeItems ?? []).filter((id) => id !== itemId),
            };
          }),
        }));
      },

      exportBackup: () => {
        const s = get();
        return {
          version: 2 as const,
          exportedAt: Date.now(),
          classes: s.classes,
          students: s.students,
          behaviors: s.behaviors,
          events: s.events,
          skillDefaults: loadSkillDefaults(),
        };
      },

      importBackup: (data) => {
        if (!isBackup(data)) {
          return { ok: false, error: "Invalid ClassNest backup" };
        }
        const behaviors = data.behaviors.filter(isBehaviorLike);
        set({
          classes: data.classes.map(normalizeClassroom),
          students: data.students.map((st) => {
            const cls = data.classes.find((c) => c.id === st.classId);
            const pack = isAvatarPack(cls?.avatarPack)
              ? cls!.avatarPack!
              : "kids";
            return normalizeStudent(st, pack);
          }),
          behaviors: behaviors.length
            ? behaviors
            : getEffectiveSkillDefaults(),
          events: data.events,
          seeded: true,
        });
        if (data.skillDefaults && data.skillDefaults.length > 0) {
          saveSkillDefaults(data.skillDefaults);
        }
        invalidatePointsCache();
        return { ok: true };
      },

      mergeBackup: (data) => {
        if (!isBackup(data)) {
          return { ok: false, error: "Invalid ClassNest backup" };
        }
        const cur = get();
        const classById = new Map(cur.classes.map((c) => [c.id, c]));
        let addedClasses = 0;
        let classTouched = false;
        for (const raw of data.classes) {
          const c = normalizeClassroom(raw);
          const existing = classById.get(c.id);
          if (!existing) {
            classById.set(c.id, c);
            addedClasses += 1;
            classTouched = true;
          } else if ((c.updatedAt ?? 0) > (existing.updatedAt ?? 0)) {
            classById.set(c.id, { ...existing, ...c });
            classTouched = true;
          }
        }

        const studentById = new Map(cur.students.map((s) => [s.id, s]));
        let addedStudents = 0;
        for (const raw of data.students) {
          const cls = classById.get(raw.classId);
          const pack = isAvatarPack(cls?.avatarPack) ? cls!.avatarPack! : "kids";
          const st = normalizeStudent(raw, pack);
          if (!studentById.has(st.id)) {
            studentById.set(st.id, st);
            addedStudents += 1;
          }
        }

        const eventById = new Map(cur.events.map((e) => [e.id, e]));
        let addedEvents = 0;
        for (const e of data.events) {
          if (!e?.id || eventById.has(e.id)) continue;
          eventById.set(e.id, e);
          addedEvents += 1;
        }

        const behById = new Map(cur.behaviors.map((b) => [b.id, b]));
        let addedBehaviors = 0;
        for (const b of data.behaviors.filter(isBehaviorLike)) {
          if (!behById.has(b.id)) {
            behById.set(b.id, b);
            addedBehaviors += 1;
          }
        }

        if (
          !classTouched &&
          addedStudents === 0 &&
          addedEvents === 0 &&
          addedBehaviors === 0
        ) {
          return { ok: true, addedClasses: 0, addedStudents: 0, addedEvents: 0 };
        }

        set({
          classes: Array.from(classById.values()),
          students: Array.from(studentById.values()),
          events: Array.from(eventById.values()).sort(
            (a, b) => b.createdAt - a.createdAt,
          ),
          behaviors: Array.from(behById.values()),
          seeded: true,
        });
        invalidatePointsCache();
        return { ok: true, addedClasses, addedStudents, addedEvents };
      },

      studentPoints: (studentId) => {
        return pointsMapFromEvents(get().events).get(studentId) ?? 0;
      },

      classStudents: (classId) => {
        return get()
          .students.filter((s) => s.classId === classId)
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name));
      },

      classEvents: (classId) => {
        return get().events.filter((e) => e.classId === classId);
      },

      studentEvents: (studentId) => {
        return get().events.filter((e) => e.studentId === studentId);
      },

      classAvatarPack: (classId) => {
        const c = get().classes.find((x) => x.id === classId);
        return isAvatarPack(c?.avatarPack) ? c!.avatarPack! : "kids";
      },
    }),
    {
      name: "classnest-v2",
      storage: createJSONStorage(() => createDebouncedStorage(550)),
      partialize: (s) => ({
        classes: s.classes,
        students: s.students,
        behaviors: s.behaviors,
        events: s.events,
        seeded: s.seeded,
      }),
    },
  ),
);
