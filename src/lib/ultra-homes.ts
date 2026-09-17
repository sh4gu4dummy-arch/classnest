/** Final-form habitat films. /avatars/ultra/homes/{id}.mp4 — 15s, with sound. */

export const ULTRA_HOME_SRC = (id: number) =>
  `/avatars/ultra/homes/${String(id).padStart(2, "0")}.mp4`;

export const ULTRA_HOME_POSTER = (id: number) =>
  `/avatars/ultra/homes/${String(id).padStart(2, "0")}.jpg`;

/** Shot and approved so far. */
export const ULTRA_HOME_READY = new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

export function ultraHomeSrc(id: number): string | null {
  return ULTRA_HOME_READY.has(id) ? ULTRA_HOME_SRC(id) : null;
}
