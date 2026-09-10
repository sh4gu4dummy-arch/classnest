import { sparChances } from "./spar";
import type { Student } from "./types";

export type BracketSlot = string | null; // student id or bye

export type TournamentMatch = {
  id: string;
  round: number;
  index: number;
  a: BracketSlot;
  b: BracketSlot;
  winner: BracketSlot;
  /** set while / after fight */
  aChance?: number;
  bChance?: number;
};

export type TournamentState = {
  classId: string;
  /** Free entry — no buy-in deducted */
  buyIn: 0;
  /** Teacher-set prize for champion (points) */
  prizePoints: number;
  prizeLabel: string;
  entrants: string[];
  matches: TournamentMatch[];
  currentMatchId: string | null;
  championId: string | null;
  prizeAwarded: boolean;
};

/** Next power of 2 ≥ n (min 2). */
export function bracketSize(n: number): number {
  if (n < 2) return 2;
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

export function shuffleIds(ids: string[], rng = Math.random): string[] {
  const arr = [...ids];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

/**
 * Build single-elim rounds. Round 0 = first round with byes as null.
 * Winners fill next round as matches complete.
 */
export function buildBracket(entrantIds: string[], rng = Math.random): TournamentMatch[] {
  const shuffled = shuffleIds(entrantIds, rng);
  const size = bracketSize(shuffled.length);
  const slots: BracketSlot[] = [...shuffled];
  while (slots.length < size) slots.push(null);

  const matches: TournamentMatch[] = [];
  let roundSize = size / 2;
  let round = 0;
  let prevRound: TournamentMatch[] = [];

  // First round pairs consecutive slots
  for (let i = 0; i < roundSize; i++) {
    const a = slots[i * 2] ?? null;
    const b = slots[i * 2 + 1] ?? null;
    let winner: BracketSlot = null;
    // Auto-advance byes
    if (a && !b) winner = a;
    if (b && !a) winner = b;
    if (!a && !b) winner = null;
    const m: TournamentMatch = {
      id: `r${round}m${i}`,
      round,
      index: i,
      a,
      b,
      winner,
    };
    matches.push(m);
    prevRound.push(m);
  }

  while (roundSize > 1) {
    round += 1;
    roundSize = roundSize / 2;
    const thisRound: TournamentMatch[] = [];
    for (let i = 0; i < roundSize; i++) {
      const left = prevRound[i * 2];
      const right = prevRound[i * 2 + 1];
      const m: TournamentMatch = {
        id: `r${round}m${i}`,
        round,
        index: i,
        a: left?.winner ?? null,
        b: right?.winner ?? null,
        winner: null,
      };
      // If both parents already decided and one missing, auto
      if (left?.winner && right && right.winner === null && right.a === null && right.b === null) {
        // empty
      }
      matches.push(m);
      thisRound.push(m);
    }
    prevRound = thisRound;
  }

  // Propagate bye winners through empty parents once
  return advanceByes(matches);
}

function advanceByes(matches: TournamentMatch[]): TournamentMatch[] {
  const maxRound = Math.max(...matches.map((m) => m.round), 0);
  let next = matches.map((m) => ({ ...m }));
  for (let r = 0; r < maxRound; r++) {
    const roundMatches = next.filter((m) => m.round === r);
    for (const m of roundMatches) {
      if (m.winner) fillChild(next, m);
    }
  }
  return next;
}

function fillChild(matches: TournamentMatch[], parent: TournamentMatch) {
  const child = matches.find(
    (m) =>
      m.round === parent.round + 1 &&
      Math.floor(parent.index / 2) === m.index,
  );
  if (!child || !parent.winner) return;
  if (parent.index % 2 === 0) {
    child.a = parent.winner;
  } else {
    child.b = parent.winner;
  }
  // Auto if opponent is permanent bye (both slots known and one null with no pending)
  if (child.a && !child.b) {
    // only auto if sibling match already finished with no winner possible — keep manual for real byes in first round only
  }
  if (child.a && child.b === null && parent.round === 0) {
    // check if sibling was empty first-round
    const sibling = matches.find(
      (m) => m.round === parent.round && m.index === parent.index + (parent.index % 2 === 0 ? 1 : -1),
    );
    if (sibling && !sibling.a && !sibling.b) {
      child.winner = child.a;
    }
  }
}

export function findNextPlayableMatch(matches: TournamentMatch[]): TournamentMatch | null {
  const sorted = [...matches].sort((a, b) => a.round - b.round || a.index - b.index);
  for (const m of sorted) {
    if (m.winner) continue;
    if (m.a && m.b) return m;
    // Bye: one side filled, other never will be (null and no upstream)
    if (m.a && !m.b) {
      // If any unfinished match in previous round feeds into b, wait
      const feedsB = matches.some(
        (x) =>
          x.round === m.round - 1 &&
          Math.floor(x.index / 2) === m.index &&
          x.index % 2 === 1 &&
          !x.winner,
      );
      if (!feedsB && m.round === 0) {
        return { ...m }; // will auto-resolve
      }
    }
    if (m.b && !m.a) {
      const feedsA = matches.some(
        (x) =>
          x.round === m.round - 1 &&
          Math.floor(x.index / 2) === m.index &&
          x.index % 2 === 0 &&
          !x.winner,
      );
      if (!feedsA && m.round === 0) {
        return { ...m };
      }
    }
  }
  return null;
}

/** Resolve a match; returns updated matches + winner id. */
export function resolveTournamentMatch(
  matches: TournamentMatch[],
  matchId: string,
  pointsOf: (id: string) => number,
  rng = Math.random,
): { matches: TournamentMatch[]; winnerId: string } | { error: string } {
  const next = matches.map((m) => ({ ...m }));
  const m = next.find((x) => x.id === matchId);
  if (!m) return { error: "Match not found" };
  if (m.winner) return { error: "Already played" };

  // Bye auto
  if (m.a && !m.b) {
    m.winner = m.a;
    propagateWinner(next, m);
    return { matches: next, winnerId: m.a };
  }
  if (m.b && !m.a) {
    m.winner = m.b;
    propagateWinner(next, m);
    return { matches: next, winnerId: m.b };
  }
  if (!m.a || !m.b) return { error: "Match not ready" };

  const aPts = pointsOf(m.a);
  const bPts = pointsOf(m.b);
  const { attackerChance, defenderChance } = sparChances(aPts, bPts);
  m.aChance = attackerChance;
  m.bChance = defenderChance;
  const aWins = rng() < attackerChance;
  m.winner = aWins ? m.a : m.b;
  propagateWinner(next, m);
  return { matches: next, winnerId: m.winner };
}

function propagateWinner(matches: TournamentMatch[], finished: TournamentMatch) {
  const child = matches.find(
    (m) =>
      m.round === finished.round + 1 &&
      Math.floor(finished.index / 2) === m.index,
  );
  if (!child || !finished.winner) return;
  if (finished.index % 2 === 0) child.a = finished.winner;
  else child.b = finished.winner;
}

export function getChampion(matches: TournamentMatch[]): string | null {
  if (!matches.length) return null;
  const maxRound = Math.max(...matches.map((m) => m.round));
  const final = matches.find((m) => m.round === maxRound);
  return final?.winner ?? null;
}

export function roundLabel(round: number, maxRound: number): string {
  if (round === maxRound) return "Final";
  if (round === maxRound - 1) return "Semis";
  if (round === 0) return "Round 1";
  return `Round ${round + 1}`;
}

export function entrantName(students: Student[], id: string | null): string {
  if (!id) return "BYE";
  return students.find((s) => s.id === id)?.name.split(" ")[0] ?? "?";
}
