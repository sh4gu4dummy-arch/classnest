import { useEffect, useMemo, useState } from "react";
import { Swords, Shield } from "lucide-react";
import { toast } from "sonner";
import { StudentAvatar } from "@/components/student-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAvatarSrc, type AvatarPack } from "@/lib/avatars";
import { maxBet, sparChances } from "@/lib/spar";
import { playSound, unlockAudio } from "@/lib/sounds";
import { useClassStore } from "@/lib/store";
import type { Student } from "@/lib/types";
import { cn } from "@/lib/utils";

type Phase = "pick" | "fight" | "result";

type FightState = {
  attacker: Student;
  defender: Student;
  bet: number;
  attackerWon: boolean;
  blocked: boolean;
  attackerChance: number;
  defenderChance: number;
  attackerBefore: number;
  defenderBefore: number;
};

interface SparArenaProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  classId: string;
  students: Student[];
  pack: AvatarPack;
  defaultAttackerId?: string;
  defaultDefenderId?: string;
  defaultBet?: number;
}

function SparPointsTick({
  name,
  before,
  delta,
  won,
  blocked,
  delayMs = 0,
}: {
  name: string;
  before: number;
  delta: number;
  won: boolean;
  blocked: boolean;
  delayMs?: number;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
    const t1 = window.setTimeout(() => setStep(1), delayMs + 550);
    const t2 = window.setTimeout(() => setStep(2), delayMs + 1200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [before, delta, delayMs, name]);

  const after = before + delta;
  const gain = delta > 0;
  const loss = delta < 0;

  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center gap-1 rounded-xl border-2 px-2 py-2.5",
        blocked
          ? "border-sky-400/40 bg-sky-400/10"
          : won
            ? "border-positive/40 bg-positive/10"
            : "border-danger/35 bg-danger/10",
      )}
    >
      <p className="truncate text-xs font-bold text-muted-fg">{name}</p>
      <p
        className={cn(
          "text-xl font-black tabular-nums text-fg",
          step === 0 && "animate-spar-pts-hold",
          step >= 2 && "opacity-50 line-through decoration-muted-fg/50",
        )}
      >
        {before}
        <span className="ml-0.5 text-[10px] font-semibold text-muted-fg">pts</span>
      </p>
      {step >= 1 && (
        <p
          className={cn(
            "animate-spar-pts-delta text-lg font-black tabular-nums",
            blocked && "text-sky-500",
            !blocked && gain && "text-positive",
            !blocked && loss && "text-danger",
            !blocked && delta === 0 && "text-muted-fg",
          )}
        >
          {blocked ? "0" : gain ? `+${delta}` : delta}
        </p>
      )}
      {step >= 2 && (
        <p className="text-sm font-bold tabular-nums text-fg">
          → {after}
        </p>
      )}
    </div>
  );
}

function StudentPick({
  students,
  selectedId,
  onSelect,
  pack,
  studentPoints,
  excludeId,
  accent,
}: {
  students: Student[];
  selectedId: string;
  onSelect: (id: string) => void;
  pack: AvatarPack;
  studentPoints: (id: string) => number;
  excludeId?: string;
  accent: "accent" | "danger";
}) {
  return (
    <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto">
      {students
        .filter((s) => s.id !== excludeId)
        .map((s) => {
          const on = selectedId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-xl border-2 px-2 py-1.5 text-left transition",
                on
                  ? accent === "accent"
                    ? "border-accent bg-accent/10"
                    : "border-danger bg-danger/10"
                  : "border-border hover:border-accent/40",
              )}
            >
              <StudentAvatar
                avatarId={s.avatarId}
                name={s.name}
                pack={pack}
                points={studentPoints(s.id)}
                size="sm"
                showLevelBadge={false}
              />
              <span className="max-w-[5.5rem] truncate text-xs font-semibold">
                {s.name.split(" ")[0]}
              </span>
            </button>
          );
        })}
    </div>
  );
}

export function SparArena({
  open,
  onOpenChange,
  classId,
  students,
  pack,
  defaultAttackerId,
  defaultDefenderId,
  defaultBet,
}: SparArenaProps) {
  const studentPoints = useClassStore((s) => s.studentPoints);
  const spar = useClassStore((s) => s.spar);

  const [attackerId, setAttackerId] = useState(defaultAttackerId ?? "");
  const [defenderId, setDefenderId] = useState(defaultDefenderId ?? "");
  const [bet, setBet] = useState(defaultBet ?? 1);
  const [bestOf3, setBestOf3] = useState(false);
  const [seriesA, setSeriesA] = useState(0);
  const [seriesB, setSeriesB] = useState(0);
  const [phase, setPhase] = useState<Phase>("pick");
  const [fight, setFight] = useState<FightState | null>(null);
  const [clash, setClash] = useState(false);

  const attacker = students.find((s) => s.id === attackerId);
  const defender = students.find((s) => s.id === defenderId);
  const aPtsLive = attacker ? studentPoints(attacker.id) : 0;
  const dPtsLive = defender ? studentPoints(defender.id) : 0;
  const aPts =
    fight && (phase === "fight" || phase === "result")
      ? fight.attackerBefore
      : aPtsLive;
  const dPts =
    fight && (phase === "fight" || phase === "result")
      ? fight.defenderBefore
      : dPtsLive;
  const cap = attacker && defender ? maxBet(aPtsLive, dPtsLive) : 0;
  const chances =
    attacker && defender && attacker.id !== defender.id
      ? sparChances(aPtsLive, dPtsLive)
      : null;

  const seriesDone = bestOf3 && (seriesA >= 2 || seriesB >= 2);
  const seriesLead =
    seriesA > seriesB
      ? attacker?.name.split(" ")[0]
      : seriesB > seriesA
        ? defender?.name.split(" ")[0]
        : null;

  const canFight =
    !!attacker &&
    !!defender &&
    attacker.id !== defender.id &&
    cap >= 1 &&
    bet >= 1 &&
    bet <= cap &&
    !seriesDone;

  function resetSeries() {
    setSeriesA(0);
    setSeriesB(0);
  }

  function reset() {
    setPhase("pick");
    setFight(null);
    setClash(false);
    if (!bestOf3) setBet(defaultBet ?? 1);
  }

  function handleOpen(v: boolean) {
    if (!v) {
      reset();
      resetSeries();
      setBestOf3(false);
    }
    if (v) {
      if (defaultAttackerId) setAttackerId(defaultAttackerId);
      if (defaultDefenderId) setDefenderId(defaultDefenderId);
      if (defaultBet != null && defaultBet >= 1) setBet(defaultBet);
    }
    onOpenChange(v);
  }

  function startFight() {
    if (!canFight || !attacker || !defender) return;
    unlockAudio();
    const attackerBefore = studentPoints(attacker.id);
    const defenderBefore = studentPoints(defender.id);
    const res = spar({
      classId,
      attackerId: attacker.id,
      defenderId: defender.id,
      bet,
    });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    const r = res.result;
    setFight({
      attacker,
      defender,
      bet: r.bet,
      attackerWon: r.attackerWon,
      blocked: !!r.blocked,
      attackerChance: r.attackerChance,
      defenderChance: r.defenderChance,
      attackerBefore,
      defenderBefore,
    });
    setPhase("fight");
    setClash(false);
    window.setTimeout(() => {
      setClash(true);
      playSound("spar");
    }, 200);
    window.setTimeout(() => {
      setPhase("result");
      if (bestOf3 && !r.blocked) {
        if (r.attackerWon) {
          setSeriesA((n) => n + 1);
        } else {
          setSeriesB((n) => n + 1);
        }
      }
    }, 2200);
  }

  const sorted = useMemo(
    () =>
      [...students].sort(
        (a, b) => studentPoints(b.id) - studentPoints(a.id),
      ),
    [students, studentPoints],
  );

  const attackerDelta =
    fight && !fight.blocked
      ? fight.attackerWon
        ? fight.bet
        : -fight.bet
      : 0;
  const defenderDelta =
    fight && !fight.blocked
      ? fight.attackerWon
        ? -fight.bet
        : fight.bet
      : 0;

  const nextSeriesScore = bestOf3
    ? `${seriesA}–${seriesB}`
    : null;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-h-[90dvh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Swords className="size-5 text-accent" />
            Spar Arena
            {bestOf3 && (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
                Best of 3 · {seriesA}–{seriesB}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            Bet points. Higher score = higher win chance. Winner steals the bet.
          </DialogDescription>
        </DialogHeader>

        {phase === "pick" && (
          <div className="mt-3 space-y-4">
            <div className="space-y-1.5" data-spar-role="challenger">
              <Label>Challenger</Label>
              <StudentPick
                students={sorted}
                selectedId={attackerId}
                onSelect={(id) => {
                  setAttackerId(id);
                  if (id === defenderId) setDefenderId("");
                  resetSeries();
                }}
                pack={pack}
                studentPoints={studentPoints}
                accent="accent"
              />
            </div>

            <div className="space-y-1.5" data-spar-role="opponent">
              <Label>Opponent</Label>
              <StudentPick
                students={sorted}
                selectedId={defenderId}
                onSelect={(id) => {
                  setDefenderId(id);
                  resetSeries();
                }}
                pack={pack}
                studentPoints={studentPoints}
                excludeId={attackerId}
                accent="danger"
              />
            </div>

            {chances && (
              <div className="rounded-xl border-2 border-border bg-surface-2/80 p-3">
                <div className="mb-2 flex justify-between text-xs font-bold">
                  <span className="text-accent">
                    {Math.round(chances.attackerChance * 100)}% win
                  </span>
                  <span className="text-muted-fg">
                    power {chances.attackerPower} vs {chances.defenderPower}
                  </span>
                  <span className="text-danger">
                    {Math.round(chances.defenderChance * 100)}% win
                  </span>
                </div>
                <div className="flex h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className="bg-accent transition-all"
                    style={{ width: `${chances.attackerChance * 100}%` }}
                  />
                  <div
                    className="bg-danger transition-all"
                    style={{ width: `${chances.defenderChance * 100}%` }}
                  />
                </div>
                <div className="mt-3 space-y-1.5">
                  <Label htmlFor="spar-bet">Bet (max {cap})</Label>
                  <Input
                    id="spar-bet"
                    type="number"
                    min={1}
                    max={cap}
                    value={bet}
                    onChange={(e) => setBet(Number(e.target.value))}
                  />
                </div>
                <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    className="size-4 accent-[var(--color-accent)]"
                    checked={bestOf3}
                    onChange={(e) => {
                      setBestOf3(e.target.checked);
                      resetSeries();
                    }}
                  />
                  Best of 3
                  <span className="text-xs font-normal text-muted-fg">
                    first to 2 wins · same bet each bout
                  </span>
                </label>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!canFight}
                onClick={startFight}
                className="gap-1.5"
              >
                <Swords className="size-4" />
                {bestOf3 && (seriesA > 0 || seriesB > 0) ? "Next bout!" : "Fight!"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {(phase === "fight" || phase === "result") && fight && (
          <div className="mt-2 space-y-4">
            {bestOf3 && (
              <p className="text-center text-sm font-bold tabular-nums text-muted-fg">
                Series {nextSeriesScore}
                {seriesDone && seriesLead ? ` · ${seriesLead} takes the series` : ""}
              </p>
            )}
            <div className="relative flex items-center justify-between gap-2 py-6">
              <div
                className={cn(
                  "flex flex-1 flex-col items-center gap-2 transition-transform duration-500",
                  phase === "fight" && clash && "-translate-x-2 scale-110",
                  phase === "result" &&
                    fight.attackerWon &&
                    !fight.blocked &&
                    "scale-110",
                  phase === "result" &&
                    !fight.attackerWon &&
                    !fight.blocked &&
                    "scale-90 opacity-70",
                )}
              >
                <img
                  src={getAvatarSrc(fight.attacker.avatarId, pack, aPts, "board")}

                  alt=""
                  className={cn(
                    "size-24 rounded-2xl object-cover shadow-lg ring-2 ring-accent sm:size-28",
                    phase === "fight" && clash && "animate-spar-lunge-right",
                  )}
                />
                <p className="text-sm font-bold">
                  {fight.attacker.name.split(" ")[0]}
                </p>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                {phase === "fight" && clash && (
                  <span className="absolute -top-6 animate-spar-impact text-3xl font-black text-amber-400">
                    CLASH
                  </span>
                )}
                <span
                  className={cn(
                    "flex size-12 items-center justify-center rounded-full bg-ink text-lg font-black text-white shadow-lg",
                    clash && "animate-spar-impact",
                  )}
                >
                  VS
                </span>
              </div>

              <div
                className={cn(
                  "flex flex-1 flex-col items-center gap-2 transition-transform duration-500",
                  phase === "fight" && clash && "translate-x-2 scale-110",
                  phase === "result" &&
                    !fight.attackerWon &&
                    !fight.blocked &&
                    "scale-110",
                  phase === "result" &&
                    fight.attackerWon &&
                    !fight.blocked &&
                    "scale-90 opacity-70",
                )}
              >
                <img
                  src={getAvatarSrc(fight.defender.avatarId, pack, dPts, "board")}

                  alt=""
                  className={cn(
                    "size-24 rounded-2xl object-cover shadow-lg ring-2 ring-danger sm:size-28",
                    phase === "fight" && clash && "animate-spar-lunge-left",
                  )}
                />
                <p className="text-sm font-bold">
                  {fight.defender.name.split(" ")[0]}
                </p>
              </div>
            </div>

            {phase === "result" && (
              <div className="space-y-3">
                <div className="rounded-2xl border-2 border-border bg-surface-2 p-4 text-center">
                  {fight.blocked ? (
                    <>
                      <p className="text-lg font-black text-sky-500">
                        Shield blocked!
                      </p>
                      <p className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-fg">
                        <Shield className="size-3.5" />
                        {fight.defender.name.split(" ")[0]} used a force shield.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-black text-positive">
                        {(fight.attackerWon
                          ? fight.attacker
                          : fight.defender
                        ).name.split(" ")[0]}{" "}
                        wins!
                      </p>
                      <p className="mt-1 text-sm text-muted-fg">
                        Stole{" "}
                        <span className="font-bold text-fg">{fight.bet}</span>{" "}
                        points
                      </p>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <SparPointsTick
                    name={fight.attacker.name.split(" ")[0] ?? "Challenger"}
                    before={fight.attackerBefore}
                    delta={attackerDelta}
                    won={fight.attackerWon && !fight.blocked}
                    blocked={fight.blocked}
                    delayMs={0}
                  />
                  <SparPointsTick
                    name={fight.defender.name.split(" ")[0] ?? "Opponent"}
                    before={fight.defenderBefore}
                    delta={defenderDelta}
                    won={!fight.attackerWon && !fight.blocked}
                    blocked={fight.blocked}
                    delayMs={120}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              {phase === "result" ? (
                <>
                  {bestOf3 && !seriesDone ? (
                    <Button
                      type="button"
                      onClick={() => {
                        setPhase("pick");
                        setFight(null);
                        setClash(false);
                      }}
                      className="gap-1.5"
                    >
                      <Swords className="size-4" />
                      Next bout ({seriesA}–{seriesB})
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        reset();
                        if (seriesDone) resetSeries();
                      }}
                    >
                      {seriesDone ? "New series" : "Spar again"}
                    </Button>
                  )}
                  <Button type="button" onClick={() => handleOpen(false)}>
                    Done
                  </Button>
                </>
              ) : (
                <p className="w-full animate-pulse text-center text-sm font-semibold text-muted-fg">
                  Clash…
                </p>
              )}
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
