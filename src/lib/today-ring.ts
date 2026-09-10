/**
 * Today-points RGB trail around avatars.
 *
 * Phase 1 (0 → FILL_AT): static thin arc grows clockwise from the top.
 *   Early points = only a short top edge; most of the perimeter fills late.
 * Phase 2 (full ring): arc starts the slow RGB orbit (spin).
 * Phase 3 (FILL_AT → THICK_AT): thickness eases up (still not chunky).
 */

export const TODAY_RING_FILL_AT = 20;
export const TODAY_RING_THICK_AT = 40;

/** Minimum arc when the trail first appears (~12% of perimeter, top edge). */
const MIN_ARC = 0.12;

/**
 * 0–1 how much of the ring is drawn.
 * Ease-in (quadratic) so early points stay a short top sliver;
 * the arc only really races around near 20.
 */
export function todayRingProgress(todayPoints: number): number {
  const p = Math.max(0, todayPoints);
  if (p <= 0) return 0;
  const t = Math.min(1, p / TODAY_RING_FILL_AT);
  // quadratic ease-in: half points ≈ 34% arc, not 50%
  const eased = t * t;
  return MIN_ARC + (1 - MIN_ARC) * eased;
}

/** True only once the perimeter is fully traced — spin kicks in here. */
export function todayRingComplete(todayPoints: number): boolean {
  return Math.max(0, todayPoints) >= TODAY_RING_FILL_AT;
}

/**
 * Stroke width in px (CSS).
 * Before full: thin base. After 20: ease up to max ~5px at 40.
 */
export function todayRingThickness(todayPoints: number): number {
  const p = Math.max(0, todayPoints);
  const base = 2.25;
  if (p < TODAY_RING_FILL_AT) return base;
  const t = Math.min(1, (p - TODAY_RING_FILL_AT) / (TODAY_RING_THICK_AT - TODAY_RING_FILL_AT));
  // ease-out so it approaches max slowly
  const eased = 1 - (1 - t) * (1 - t);
  return base + eased * 2.75; // ~2.25 → 5 at 40+
}

export function todayRingVisible(todayPoints: number): boolean {
  return Math.max(0, todayPoints) > 0;
}
