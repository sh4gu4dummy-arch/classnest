import { useEffect, useMemo, useState } from "react";
import { Crown, Swords, Trophy } from "lucide-react";
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
import { useClassStore } from "@/lib/store";
import { playSound, unlockAudio } from "@/lib/sounds";
import {
  buildBracket,
  entrantName,
  findNextPlayableMatch,
  getChampion,
  resolveTournamentMatch,
  roundLabel,
  type TournamentMatch,
} from "@/lib/tournament";
import type { Student } from "@/lib/types";
import { cn } from "@/lib/utils";

type Phase = "setup" | "bracket" | "fight" | "champion";

interface SparTournamentProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  classId: string;
  students: Student[];
  pack: AvatarPack;
}

export function SparTournament({
  open,
  onOpenChange,
  classId,
  students,
  pack,
}: SparTournamentProps) {
  const studentPoints = useClassStore((s) => s.studentPoints);
  const grantPoints = useClassStore((s) => s.grantPoints);

  const [phase, setPhase] = useState<Phase>("setup");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [prize, setPrize] = useState(5);
  const [prizeLabel, setPrizeLabel] = useState("Tournament champion");
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [active, setActive] = useState<TournamentMatch | null>(null);
  const [clash, setClash] = useState(false);
  const [fightWinner, setFightWinner] = useState<string | null>(null);
  const [championId, setChampionId] = useState<string | null>(null);

  useEffect(() => {
    if (open && phase === "setup") {
      setSelected(new Set(students.map((s) => s.id)));
    }
  }, [open, students, phase]);

  const sorted = useMemo(
    () =>
      [...students].sort(
        (a, b) => studentPoints(b.id) - studentPoints(a.id),
      ),
    [students, studentPoints],
  );

  const maxRound = matches.length
    ? Math.max(...matches.map((m) => m.round))
    : 0;

  function reset() {
    setPhase("setup");
    setMatches([]);
    setActive(null);
    setClash(false);
    setFightWinner(null);
    setChampionId(null);
  }

  function handleOpen(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function startBracket() {
    if (selected.size < 2) {
      toast.error("Pick at least 2 students");
      return;
    }
    const p = Math.max(1, Math.min(100, Math.round(prize) || 5));
    setPrize(p);
    const bracket = buildBracket([...selected]);
    setMatches(bracket);
    setPhase("bracket");
    toast.success(`Bracket ready · free entry · prize +${p}`);
  }

  function playNext() {
    let current = matches;
    for (let i = 0; i < 20; i++) {
      const next = findNextPlayableMatch(current);
      if (!next) break;
      if (next.a && next.b) {
        setActive(next);
        setFightWinner(null);
        setClash(false);
        setPhase("fight");
        unlockAudio();
        window.setTimeout(() => {
          setClash(true);
          playSound("spar");
        }, 200);
        window.setTimeout(() => {
          const res = resolveTournamentMatch(
            current,
            next.id,
            (id) => studentPoints(id),
          );
          if ("error" in res) {
            toast.error(res.error);
            setPhase("bracket");
            return;
          }
          setMatches(res.matches);
          setFightWinner(res.winnerId);
          const champ = getChampion(res.matches);
          window.setTimeout(() => {
            if (champ && !findNextPlayableMatch(res.matches)) {
              setChampionId(champ);
              setPhase("champion");
              playSound("tournament");
            } else {
              setPhase("bracket");
              setActive(null);
            }
          }, 1600);
        }, 1400);
        return;
      }
      const res = resolveTournamentMatch(current, next.id, (id) =>
        studentPoints(id),
      );
      if ("error" in res) break;
      current = res.matches;
      setMatches(current);
    }
    const champ = getChampion(current);
    if (champ && !findNextPlayableMatch(current)) {
      setChampionId(champ);
      setPhase("champion");
    }
  }

  function awardChampion() {
    if (!championId) return;
    unlockAudio();
    const pts = Math.max(1, Math.min(100, Math.round(prize) || 5));
    const ev = grantPoints({
      studentId: championId,
      classId,
      points: pts,
      label: prizeLabel.trim() || "Tournament champion",
      note: "Spar tournament · free entry",
    });
    if (!ev) {
      toast.error("Could not award prize");
      return;
    }
    playSound("positive");
    toast.success(
      `${entrantName(students, championId)} wins +${pts}!`,
      { description: prizeLabel },
    );
    handleOpen(false);
  }

  const nextMatch = findNextPlayableMatch(matches);

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-h-[90dvh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="size-5 text-amber-500" />
            Spar Tournament
          </DialogTitle>
          <DialogDescription>
            Free buy-in · odds from all-time points · teacher sets champion prize
          </DialogDescription>
        </DialogHeader>

        {phase === "setup" && (
          <div className="mt-2 space-y-4">
            <div className="rounded-xl border-2 border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm">
              <p className="font-bold text-fg">Entry: free</p>
              <p className="text-xs text-muted-fg">
                No points deducted to join. Matches don’t steal points — only the
                champion gets your prize.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="prize">Winner prize (points)</Label>
                <Input
                  id="prize"
                  type="number"
                  min={1}
                  max={100}
                  value={prize}
                  onChange={(e) => setPrize(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prize-label">Prize label</Label>
                <Input
                  id="prize-label"
                  value={prizeLabel}
                  onChange={(e) => setPrizeLabel(e.target.value)}
                  placeholder="Tournament champion"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <Label>Entrants ({selected.size})</Label>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelected(new Set(students.map((s) => s.id)))}
                  >
                    All
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelected(new Set())}
                  >
                    None
                  </Button>
                </div>
              </div>
              <div className="grid max-h-48 grid-cols-2 gap-1.5 overflow-y-auto sm:grid-cols-3">
                {sorted.map((s) => {
                  const on = selected.has(s.id);
                  const pts = studentPoints(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggle(s.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border-2 px-2 py-1.5 text-left text-sm transition",
                        on
                          ? "border-amber-400 bg-amber-400/15"
                          : "border-border hover:border-border-strong",
                      )}
                    >
                      <StudentAvatar
                        avatarId={s.avatarId}
                        name={s.name}
                        pack={pack}
                        points={pts}
                        size="sm"
                        showLevelBadge={false}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">
                          {s.name.split(" ")[0]}
                        </span>
                        <span className="text-[10px] tabular-nums text-muted-fg">
                          {pts} pts
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                disabled={selected.size < 2}
                onClick={startBracket}
                className="gap-1.5"
              >
                <Swords className="size-4" />
                Build bracket
              </Button>
            </DialogFooter>
          </div>
        )}

        {phase === "bracket" && (
          <div className="mt-2 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-fg">
              <span className="rounded-full bg-positive/15 px-2 py-0.5 text-positive">
                Free entry
              </span>
              <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-amber-700 dark:text-amber-300">
                Prize +{prize}
              </span>
              <span>{matches.filter((m) => m.winner).length} matches done</span>
            </div>

            <div className="max-h-64 space-y-3 overflow-y-auto">
              {Array.from({ length: maxRound + 1 }, (_, r) => (
                <div key={r}>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted-fg">
                    {roundLabel(r, maxRound)}
                  </p>
                  <ul className="space-y-1">
                    {matches
                      .filter((m) => m.round === r)
                      .map((m) => (
                        <li
                          key={m.id}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-2 py-1.5 text-sm",
                            m.winner
                              ? "border-positive/30 bg-positive/5"
                              : nextMatch?.id === m.id
                                ? "border-amber-400 bg-amber-400/10"
                                : "border-border",
                          )}
                        >
                          <span
                            className={cn(
                              "min-w-0 flex-1 truncate font-semibold",
                              m.winner === m.a && "text-positive",
                            )}
                          >
                            {entrantName(students, m.a)}
                          </span>
                          <span className="text-[10px] font-black text-muted-fg">VS</span>
                          <span
                            className={cn(
                              "min-w-0 flex-1 truncate text-right font-semibold",
                              m.winner === m.b && "text-positive",
                            )}
                          >
                            {entrantName(students, m.b)}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={reset}>
                Restart
              </Button>
              <Button
                type="button"
                disabled={!nextMatch}
                onClick={playNext}
                className="gap-1.5"
              >
                <Swords className="size-4" />
                {nextMatch ? "Play next match" : "Done"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {phase === "fight" && active && active.a && active.b && (
          <div className="mt-2 space-y-4">
            <div className="relative flex items-center justify-between gap-2 py-4">
              <Fighter
                student={students.find((s) => s.id === active.a)!}
                pack={pack}
                points={studentPoints(active.a)}
                side="left"
                clash={clash}
                won={fightWinner === active.a}
                lost={!!fightWinner && fightWinner !== active.a}
              />
              <span
                className={cn(
                  "flex size-12 items-center justify-center rounded-full bg-ink text-lg font-black text-white",
                  clash && "animate-spar-impact",
                )}
              >
                VS
              </span>
              <Fighter
                student={students.find((s) => s.id === active.b)!}
                pack={pack}
                points={studentPoints(active.b)}
                side="right"
                clash={clash}
                won={fightWinner === active.b}
                lost={!!fightWinner && fightWinner !== active.b}
              />
            </div>
            <p className="animate-pulse text-center text-sm font-semibold text-muted-fg">
              {fightWinner
                ? `${entrantName(students, fightWinner)} advances!`
                : "Tournament clash… (no points stolen)"}
            </p>
          </div>
        )}

        {phase === "champion" && championId && (
          <div className="mt-3 space-y-4 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-400/20 text-amber-500">
              <Crown className="size-8" />
            </div>
            <div className="flex justify-center">
              <StudentAvatar
                avatarId={students.find((s) => s.id === championId)!.avatarId}
                name={entrantName(students, championId)}
                pack={pack}
                points={studentPoints(championId)}
                size="xl"
              />
            </div>
            <div>
              <p className="text-xl font-black">
                {entrantName(students, championId)} is champion!
              </p>
              <p className="mt-1 text-sm text-muted-fg">
                Free entry · award{" "}
                <span className="font-bold text-positive">+{prize}</span> ·{" "}
                {prizeLabel}
              </p>
            </div>
            <DialogFooter className="sm:justify-center">
              <Button type="button" variant="ghost" onClick={() => handleOpen(false)}>
                Skip prize
              </Button>
              <Button type="button" className="gap-1.5" onClick={awardChampion}>
                <Trophy className="size-4" />
                Award +{prize}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Fighter({
  student,
  pack,
  points,
  side,
  clash,
  won,
  lost,
}: {
  student: Student;
  pack: AvatarPack;
  points: number;
  side: "left" | "right";
  clash: boolean;
  won: boolean;
  lost: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center gap-2 transition-all duration-500",
        won && "scale-110",
        lost && "scale-90 opacity-60",
      )}
    >
      <img
        src={getAvatarSrc(student.avatarId, pack, points, "board")}

        alt=""
        className={cn(
          "size-24 rounded-2xl object-cover shadow-lg ring-2 sm:size-28",
          side === "left" ? "ring-accent" : "ring-danger",
          clash &&
            !won &&
            !lost &&
            (side === "left"
              ? "animate-spar-lunge-right"
              : "animate-spar-lunge-left"),
        )}
      />
      <p className="text-sm font-bold">{student.name.split(" ")[0]}</p>
      <p className="text-[10px] tabular-nums text-muted-fg">{points} power</p>
    </div>
  );
}
