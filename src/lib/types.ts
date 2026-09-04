export type BehaviorKind = "positive" | "needs_work";

export type AvatarPack = "kids" | "teens" | "ultra";

/** How a point event was created */
export type PointSource = "behavior" | "spar" | "shop";

export interface Behavior {
  id: string;
  label: string;
  kind: BehaviorKind;
  points: number;
  icon: string;
}

export interface PointEvent {
  id: string;
  studentId: string;
  classId: string;
  behaviorId: string;
  behaviorLabel: string;
  kind: BehaviorKind;
  points: number;
  note?: string;
  createdAt: number;
  source?: PointSource;
  /** Opponent id for spar events */
  relatedStudentId?: string;
  /** Shop item id for purchases */
  shopItemId?: string;
}

export interface Student {
  id: string;
  classId: string;
  name: string;
  /** Avatar id within the class avatar pack */
  avatarId: number;
  /** legacy field kept for migrations */
  avatarSeed?: number;
  createdAt: number;
  /** Board seat order (lower = earlier). Used by “Seat map” sort. */
  seatIndex?: number;
  /** Table / group label e.g. "1", "A", "Red" — for batch awards */
  group?: string | null;
  /** YYYY-MM-DD when marked late; ignored if not today */
  lateOn?: string | null;
  /** YYYY-MM-DD when marked absent; ignored if not today */
  absentOn?: string | null;
  /** Cosmetics & spar defenses */
  shieldCharges?: number;
  stars?: number;
  bannerId?: string | null;
  frameId?: string | null;
  /** Owned home decoration item ids (placed in nest) */
  homeItems?: string[];
  /** Owned but unequipped banners/frames */
  ownedBanners?: string[];
  ownedFrames?: string[];
}

export interface Classroom {
  id: string;
  name: string;
  grade?: string;
  /** kids | teens | ultra — default kids */
  avatarPack?: AvatarPack;
  createdAt: number;
  updatedAt: number;
  /** When set, class is archived (hidden from home). */
  archivedAt?: number | null;
  /** Daily class points goal (all-time sum of positive today toward this). */
  dailyGoal?: number | null;
  /**
   * When set, “season” points only count events created at/after this timestamp.
   * Lifetime still uses all events. Reset season = set to Date.now().
   */
  seasonStartAt?: number | null;
  /**
   * When set, this class uses its own skill list.
   * Missing / empty = shared device skills.
   */
  behaviors?: Behavior[] | null;
}