/**
 * Cinematic evolution scrub strips (local trial — gitignored).
 * Layout: public/avatars/ultra/scrub/{id}/{clip}/001.jpg …
 * Clips: intro (Meet), adventure, home. Intro/adventure skipped until mp4s land.
 */

export type UltraScrubClipKind = "intro" | "adventure" | "home";

export type UltraScrubClip = {
  kind: UltraScrubClipKind;
  label: string;
  /** Frames on disk (001.jpg … N.jpg) */
  frameCount: number;
  source: string;
  fps: number;
};

export type UltraScrubBundle = {
  id: number;
  clips: UltraScrubClip[];
};

/** Local Home scrub @ 3 fps for Ultras with frames on disk. */
export const ULTRA_SCRUB_BUNDLES: Record<number, UltraScrubBundle> = {
  1: {
    id: 1,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/01.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  2: {
    id: 2,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/02.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  3: {
    id: 3,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/03.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  4: {
    id: 4,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/04.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  5: {
    id: 5,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/05.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  6: {
    id: 6,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/06.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  7: {
    id: 7,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/07.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  8: {
    id: 8,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/08.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  9: {
    id: 9,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/09.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  10: {
    id: 10,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/10.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  11: {
    id: 11,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/11.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  12: {
    id: 12,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/12.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  13: {
    id: 13,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/13.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  14: {
    id: 14,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/14.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  15: {
    id: 15,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/15.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  16: {
    id: 16,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/16.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  17: {
    id: 17,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/17.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  18: {
    id: 18,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/18.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  19: {
    id: 19,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/19.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  20: {
    id: 20,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/20.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  21: {
    id: 21,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/21.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  22: {
    id: 22,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/22.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  23: {
    id: 23,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/23.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  24: {
    id: 24,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/24.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  25: {
    id: 25,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/25.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  26: {
    id: 26,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/26.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  27: {
    id: 27,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/27.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  28: {
    id: 28,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/28.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  29: {
    id: 29,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/29.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  30: {
    id: 30,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/30.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  31: {
    id: 31,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/31.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  32: {
    id: 32,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/32.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  33: {
    id: 33,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/33.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  34: {
    id: 34,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/34.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  35: {
    id: 35,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 45,
        source: "homes/35.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  36: {
    id: 36,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 47,
        source: "homes/36.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  37: {
    id: 37,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 47,
        source: "homes/37.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  38: {
    id: 38,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 47,
        source: "homes/38.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  39: {
    id: 39,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 47,
        source: "homes/39.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  40: {
    id: 40,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 47,
        source: "homes/40.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  41: {
    id: 41,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 43,
        source: "homes/41.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  42: {
    id: 42,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 43,
        source: "homes/42.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  43: {
    id: 43,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 43,
        source: "homes/43.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  44: {
    id: 44,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 43,
        source: "homes/44.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  45: {
    id: 45,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 43,
        source: "homes/45.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  46: {
    id: 46,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 43,
        source: "homes/46.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  47: {
    id: 47,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 43,
        source: "homes/47.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  48: {
    id: 48,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 43,
        source: "homes/48.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  49: {
    id: 49,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 43,
        source: "homes/49.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  50: {
    id: 50,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 43,
        source: "homes/50.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  51: {
    id: 51,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 43,
        source: "homes/51.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  52: {
    id: 52,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 43,
        source: "homes/52.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  53: {
    id: 53,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 43,
        source: "homes/53.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  54: {
    id: 54,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 43,
        source: "homes/54.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
  55: {
    id: 55,
    clips: [
      {
        kind: "home",
        label: "Home",
        frameCount: 43,
        source: "homes/55.mp4 · @ 3 fps",
        fps: 3,
      },
    ],
  },
};

export function getUltraScrubBundle(id: number): UltraScrubBundle | null {
  const b = ULTRA_SCRUB_BUNDLES[id];
  if (!b || b.clips.length === 0) return null;
  return b;
}

export function ultraScrubFrameSrc(
  id: number,
  kind: UltraScrubClipKind,
  frame1Based: number,
): string {
  const n = String(Math.max(1, frame1Based)).padStart(3, "0");
  return `/avatars/ultra/scrub/${String(id).padStart(2, "0")}/${kind}/${n}.jpg`;
}

/** localStorage — teacher device pref (not in class backup). Default off. */
const CINEMATIC_KEY = "classnest-cinematic-evolution";

export function loadCinematicEvolution(): boolean {
  try {
    return localStorage.getItem(CINEMATIC_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveCinematicEvolution(on: boolean) {
  try {
    if (on) localStorage.setItem(CINEMATIC_KEY, "1");
    else localStorage.removeItem(CINEMATIC_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Linear map: point 0 → frame 1, then one frame per point, clamp at end.
 * Never wraps (wrapping looks like devolution).
 */
export function scrubFrameIndex(points: number, frameCount: number): number {
  if (!Number.isFinite(frameCount) || frameCount < 1) return 1;
  const p = Number.isFinite(points) ? Math.max(0, Math.floor(points)) : 0;
  return Math.min(frameCount, p + 1);
}

/**
 * When cinematic mode is on and a Home scrub exists, return that frame URL.
 * Otherwise null → caller keeps classic stage art.
 * Scrub stills are landscape; use same URL for board and full (no board/ thumbs).
 */
export function ultraCinematicSrc(
  id: number | undefined | null,
  points = 0,
): string | null {
  if (typeof window === "undefined") return null;
  if (!loadCinematicEvolution()) return null;
  if (!id || id < 1) return null;
  const bundle = getUltraScrubBundle(id);
  const home = bundle?.clips.find((c) => c.kind === "home");
  if (!home || home.frameCount < 1) return null;
  const frame = scrubFrameIndex(points, home.frameCount);
  return ultraScrubFrameSrc(id, "home", frame);
}

