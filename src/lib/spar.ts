/** Spar odds: power = points. Chance = own / (own + foe). Bet steals points. */

export type SparResult = {
  winnerId: string;
  loserId: string;
  bet: number;
  attackerWon: boolean;
  attackerChance: number;
  defenderChance: number;
  roll: number;
  blocked?: boolean;
};

/** Minimum positive power for odds so 0-point kids still have a shot (tiny). */
export function sparPower(points: number): number {
  if (!Number.isFinite(points) || points <= 0) return 1;
  return Math.floor(points);
}

/**
 * Weighted win chance for attacker.
 * Example: 3 pts vs 2 pts → 3/5 = 60% for the 3-pt fighter.
 */
export function sparChances(attackerPoints: number, defenderPoints: number) {
  const a = sparPower(attackerPoints);
  const d = sparPower(defenderPoints);
  const total = a + d;
  return {
    attackerChance: a / total,
    defenderChance: d / total,
    attackerPower: a,
    defenderPower: d,
  };
}

export function maxBet(attackerPoints: number, defenderPoints: number): number {
  const a = Math.max(0, Math.floor(attackerPoints));
  const d = Math.max(0, Math.floor(defenderPoints));
  return Math.min(a, d);
}

export function resolveSpar(opts: {
  attackerId: string;
  defenderId: string;
  attackerPoints: number;
  defenderPoints: number;
  bet: number;
  defenderShieldCharges: number;
  rng?: () => number;
}): SparResult {
  const rng = opts.rng ?? Math.random;
  const bet = Math.max(1, Math.floor(opts.bet));

  if (opts.defenderShieldCharges > 0) {
    return {
      winnerId: opts.defenderId,
      loserId: opts.attackerId,
      bet: 0,
      attackerWon: false,
      attackerChance: 0,
      defenderChance: 1,
      roll: 0,
      blocked: true,
    };
  }

  const { attackerChance, defenderChance } = sparChances(
    opts.attackerPoints,
    opts.defenderPoints,
  );
  const roll = rng();
  const attackerWon = roll < attackerChance;

  return {
    winnerId: attackerWon ? opts.attackerId : opts.defenderId,
    loserId: attackerWon ? opts.defenderId : opts.attackerId,
    bet,
    attackerWon,
    attackerChance,
    defenderChance,
    roll,
    blocked: false,
  };
}
