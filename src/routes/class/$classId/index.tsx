import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowUpDown,
  Dices,
  Maximize2,
  Minimize2,
  Monitor,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Shuffle,
  Swords,
  Undo2,
  UserPlus,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { AppShell } from "@/components/app-shell";
import { AvatarPicker } from "@/components/avatar-picker";
import { AwardPanel } from "@/components/award-panel";
import { BatchAwardPanel } from "@/components/batch-award-panel";
import { BoardLockButton, useBoardLockState } from "@/components/board-lock";
import { DayRecap } from "@/components/day-recap";
import { ClassTimer } from "@/components/class-timer";
import { EvolutionBurst, type EvolutionBurstData } from "@/components/evolution-burst";
import { EvolutionCatalog } from "@/components/evolution-catalog";
import { FavoriteSkillsBar } from "@/components/favorite-skills-bar";
import { PickBanner, pickRandomStudent } from "@/components/random-picker";
import { RandomReel } from "@/components/random-reel";
import { StudentCard } from "@/components/student-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PACK_SHORT,
  getAvatarCount,
  resolvePack,
  type AvatarPack,
} from "@/lib/avatars";
import {
  getAttendanceStatus,
  isAbsentToday,
  isLateToday,
  nextAttendanceStatus,
  presentStudents,
} from "@/lib/attendance";
import { didEvolve, didFormEvolve } from "@/lib/evolution";
import { resolveBoardBackdropSrc } from "@/lib/shop";
import {
  loadBoardPointsMode,
  saveBoardPointsMode,
  type BoardPointsMode,
} from "@/lib/points";
import {
  isPresentationMode,
  isProjectorMode,
  isSmartboardMode,
  loadBoardDensity,
  loadBoardSort,
  saveBoardDensity,
  saveBoardSort,
  setPresentationMode,
  setProjectorMode,
  setSmartboardMode,
  applySmartboardClass,
  type BoardDensity,
  type BoardSort,
} from "@/lib/prefs";
import {
  loadCinematicEvolution,
  saveCinematicEvolution,
} from "@/lib/ultra-scrub";
import { QUICK_PLUS_BEHAVIOR } from "@/lib/seed";
import { playAwardSound, playSound, unlockAudio } from "@/lib/sounds";
import { MAX_CLASS_SIZE, multiPointsMaps, useClassStore } from "@/lib/store";
import { useHydratedStore } from "@/lib/use-hydrated-store";
import type { Behavior, Student } from "@/lib/types";
import { cn } from "@/lib/utils";

const SparArena = lazy(() =>
  import("@/components/spar-arena").then((m) => ({ default: m.SparArena })),
);
const SparTournament = lazy(() =>
  import("@/components/spar-tournament").then((m) => ({ default: m.SparTournament })),
);
const Spotlight = lazy(() =>
  import("@/components/spotlight").then((m) => ({ default: m.Spotlight })),
);
const WeekSnapshot = lazy(() =>
  import("@/components/week-snapshot").then((m) => ({ default: m.WeekSnapshot })),
);

export const Route = createFileRoute("/class/$classId/")({
  component: ClassBoardPage,
});

const SORT_OPTIONS: { id: BoardSort; label: string }[] = [
  { id: "seat", label: "Seats" },
  { id: "name", label: "Name" },
  { id: "points_desc", label: "Pts ↓" },
  { id: "points_asc", label: "Pts ↑" },
  { id: "today_desc", label: "Today" },
];

function ClassBoardPage() {
  const { classId } = Route.useParams();
  const navigate = useNavigate();
  const ready = useHydratedStore();
  const classroom = useClassStore((s) => s.classes.find((c) => c.id === classId));
  const students = useClassStore(
    useShallow((s) => s.students.filter((st) => st.classId === classId)),
  );
  const events = useClassStore((s) => s.events);
  const {
    awardPoints,
    addStudent,
    updateClass,
    updateStudent,
    undoLastClassEvent,
    setSeatOrder,
    setAttendanceToday,
  } = useClassStore(
    useShallow((s) => ({
      awardPoints: s.awardPoints,
      addStudent: s.addStudent,
      updateClass: s.updateClass,
      updateStudent: s.updateStudent,
      undoLastClassEvent: s.undoLastClassEvent,
      setSeatOrder: s.setSeatOrder,
      setAttendanceToday: s.setAttendanceToday,
    })),
  );
  const { locked, setLocked } = useBoardLockState();

  useEffect(() => {
    if (ready && !classroom) {
      void navigate({ to: "/" });
    }
  }, [ready, classroom, navigate]);


  const pack: AvatarPack = resolvePack(classroom?.avatarPack);
  const arenaSrc = resolveBoardBackdropSrc(classroom?.boardBackdrop, pack);

  const classEvents = useMemo(
    () => events.filter((e) => e.classId === classId),
    [events, classId],
  );

  const seasonStart = classroom?.seasonStartAt ?? null;

  /** Single O(E) pass — lifetime + today + season (no triple scan). */
  const pointsBundle = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return multiPointsMaps(classEvents, {
      todayStart: start.getTime(),
      seasonStart,
    });
  }, [classEvents, seasonStart]);

  const {
    life: lifeMap,
    today: todayMap,
    season: seasonMap,
    classLifeTotal,
    todayAwardCount,
    todayPositivePts,
  } = pointsBundle;

  const lifetimeOf = useCallback(
    (id: string) => lifeMap.get(id) ?? 0,
    [lifeMap],
  );
  const todayOf = useCallback((id: string) => todayMap.get(id) ?? 0, [todayMap]);
  const seasonOf = useCallback(
    (id: string) =>
      seasonStart == null ? lifetimeOf(id) : (seasonMap.get(id) ?? 0),
    [seasonMap, seasonStart, lifetimeOf],
  );

  const [pointsMode, setPointsMode] = useState<BoardPointsMode>(() => {
    const m = loadBoardPointsMode(classId);
    return m === "season" ? "all" : m;
  });
  const [sort, setSort] = useState<BoardSort>(() => loadBoardSort());
  const [density, setDensity] = useState<BoardDensity>(() => loadBoardDensity());
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const [groupsOpen, setGroupsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [presentation, setPresentation] = useState(() => isPresentationMode());
  const [cinematicEvolution, setCinematicEvolution] = useState(() =>
    loadCinematicEvolution(),
  );
  const [projector, setProjector] = useState(() => isProjectorMode());
  const [smartboard, setSmartboard] = useState(() => isSmartboardMode());
  const [awardOpen, setAwardOpen] = useState(false);
  const [selected, setSelected] = useState<Student | null>(null);
  const [flash, setFlash] = useState<Record<string, "positive" | "needs_work" | null>>(
    {},
  );
  const [evolvePulse, setEvolvePulse] = useState<Record<string, boolean>>({});
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [batchOpen, setBatchOpen] = useState(false);
  const [rearrangeMode, setRearrangeMode] = useState(false);
  const [orderDraft, setOrderDraft] = useState<Student[] | null>(null);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [avatarId, setAvatarId] = useState(1);
  const [sparOpen, setSparOpen] = useState(false);
  const [tournamentOpen, setTournamentOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [weekOpen, setWeekOpen] = useState(false);
  const [recapOpen, setRecapOpen] = useState(false);
  const [burst, setBurst] = useState<EvolutionBurstData | null>(null);
  const [goalOpen, setGoalOpen] = useState(false);
  const [goalDraft, setGoalDraft] = useState("");
  const [focusId, setFocusId] = useState<string | null>(null);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [cycleActive, setCycleActive] = useState(false);
  const [cycleCurrentId, setCycleCurrentId] = useState<string | null>(null);
  const [cyclePickedIds, setCyclePickedIds] = useState<Set<string>>(() => new Set());
  const [reel, setReel] = useState<{
    pool: Student[];
    winner: Student;
    after: "once" | "cycle";
    pickedBefore: Set<string>;
  } | null>(null);
  const [oneShotPick, setOneShotPick] = useState<Student | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("presentation-mode", presentation);
    return () => {
      document.documentElement.classList.remove("presentation-mode");
    };
  }, [presentation]);

  useEffect(() => {
    document.documentElement.classList.toggle("projector", projector);
    return () => {
      document.documentElement.classList.remove("projector");
    };
  }, [projector]);

  useEffect(() => {
    applySmartboardClass(smartboard);
  }, [smartboard]);

  // Drop season mode if season was never started / cleared
  useEffect(() => {
    if (pointsMode === "season" && seasonStart == null) {
      setMode("all");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasonStart, pointsMode]);

  useEffect(() => {
    if (ready && !classroom) {
      void navigate({ to: "/" });
    }
  }, [ready, classroom, navigate]);

  // Close More menu on outside click / Escape
  useEffect(() => {
    if (!moreOpen) return;
    function onDoc(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMoreOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  const sortedStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = students.slice();
    if (q) list = list.filter((s) => s.name.toLowerCase().includes(q));
    const byName = (a: Student, b: Student) => a.name.localeCompare(b.name);
    switch (sort) {
      case "name":
        return list.sort(byName);
      case "points_desc":
        return list.sort((a, b) => lifetimeOf(b.id) - lifetimeOf(a.id) || byName(a, b));
      case "points_asc":
        return list.sort((a, b) => lifetimeOf(a.id) - lifetimeOf(b.id) || byName(a, b));
      case "today_desc":
        return list.sort((a, b) => todayOf(b.id) - todayOf(a.id) || byName(a, b));
      case "seat":
      default:
        return list.sort(
          (a, b) =>
            (a.seatIndex ?? 999) - (b.seatIndex ?? 999) || byName(a, b),
        );
    }
  }, [students, query, sort, lifetimeOf, todayOf]);

  const boardStudents = rearrangeMode && orderDraft ? orderDraft : sortedStudents;
  const activeRoster = useMemo(() => presentStudents(students), [students]);
  const cyclePool = useMemo(
    () => boardStudents.filter((s) => !isAbsentToday(s)),
    [boardStudents],
  );
  const focusStudent = focusId
    ? students.find((s) => s.id === focusId) ?? null
    : null;

  const groupLabels = useMemo(() => {
    const set = new Set<string>();
    for (const s of students) {
      const g = s.group?.trim();
      if (g) set.add(g);
    }
    return Array.from(set).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true }),
    );
  }, [students]);

  function selectGroup(label: string) {
    const ids = students
      .filter((s) => (s.group?.trim() ?? "") === label && !isAbsentToday(s))
      .map((s) => s.id);
    if (ids.length === 0) {
      toast.message(`No one in table ${label}`);
      return;
    }
    setSelectMode(true);
    setSelectedIds(new Set(ids));
    toast.message(`Table ${label}: ${ids.length} selected`);
  }

  const dailyGoal = classroom?.dailyGoal ?? null;
  const goalPct =
    dailyGoal && dailyGoal > 0
      ? Math.min(100, Math.round((todayPositivePts / dailyGoal) * 100))
      : 0;

  function setMode(mode: BoardPointsMode) {
    setPointsMode(mode);
    saveBoardPointsMode(classId, mode);
  }
  function cyclePointsMode() {
    const order: BoardPointsMode[] =
      seasonStart != null ? ["today", "season", "all"] : ["today", "all"];
    const i = Math.max(0, order.indexOf(pointsMode));
    setMode(order[(i + 1) % order.length]!);
  }
  function cycleSort() {
    const i = SORT_OPTIONS.findIndex((o) => o.id === sort);
    const next = SORT_OPTIONS[(i + 1) % SORT_OPTIONS.length]!;
    setSort(next.id);
    saveBoardSort(next.id);
  }
  
  function toggleCinematicEvolution() {
    const next = !cinematicEvolution;
    setCinematicEvolution(next);
    saveCinematicEvolution(next);
    toast.success(
      next
        ? "Cinematic evolution on — one Home still per point"
        : "Classic evolution — snaps at 10 & 20",
    );
  }

  function toggleProjector() {
    const next = !projector;
    setProjector(next);
    setProjectorMode(next);
  }
  function cycleDensity() {
    const order: BoardDensity[] = ["compact", "normal", "showcase"];
    const next = order[(order.indexOf(density) + 1) % order.length]!;
    setDensity(next);
    saveBoardDensity(next);
  }
  function togglePresentation() {
    const next = !presentation;
    setPresentation(next);
    setPresentationMode(next);
  }
  function toggleSmartboard() {
    const next = !smartboard;
    setSmartboard(next);
    setSmartboardMode(next);
    applySmartboardClass(next);
    // Prefer readable avatars on big boards
    if (next && density === "compact") {
      setDensity("normal");
      saveBoardDensity("normal");
    }
    toast.success(next ? "Smartboard mode on" : "Smartboard mode off", {
      description: next
        ? "Bigger taps · longer double-tap · wider board"
        : "Back to regular layout",
    });
  }

  const flashStudent = useCallback((id: string, kind: "positive" | "needs_work") => {
    setFlash((f) => ({ ...f, [id]: kind }));
    window.setTimeout(() => {
      setFlash((f) => ({ ...f, [id]: null }));
    }, 480);
  }, []);

  const pulseEvolve = useCallback((id: string) => {
    setEvolvePulse((p) => ({ ...p, [id]: true }));
    window.setTimeout(() => {
      setEvolvePulse((p) => ({ ...p, [id]: false }));
    }, 900);
  }, []);

  const openAward = useCallback((student: Student) => {
    if (locked) return;
    setSelected(student);
    setFocusId(student.id);
    setAwardOpen(true);
  }, [locked]);

  const afterAward = useCallback((
    student: Student,
    kind: "positive" | "needs_work",
    evolved: boolean,
    nextPoints: number,
    prevPoints: number,
    summary: { label: string; points: number; studentName: string },
  ) => {
    flashStudent(student.id, kind);
    setFocusId(student.id);
    if (evolved || didFormEvolve(prevPoints, nextPoints)) {
      pulseEvolve(student.id);
      setBurst({
        studentName: student.name,
        avatarId: student.avatarId,
        pack,
        points: nextPoints,
        prevPoints,
      });
    }
    const sign = summary.points > 0 ? `+${summary.points}` : String(summary.points);
    toast.success(`${summary.studentName}: ${sign} ${summary.label}`, {
      duration: 2800,
      action: {
        label: "Undo",
        onClick: () => {
          const undone = undoLastClassEvent(classId);
          if (undone) toast.message("Undone");
        },
      },
    });
  }, [pack, classId, undoLastClassEvent, flashStudent, pulseEvolve]);

  const handleQuickPlus = useCallback((student: Student) => {
    if (locked || isAbsentToday(student)) {
      if (isAbsentToday(student)) toast.error("Marked absent");
      return;
    }
    unlockAudio();
    const prev = lifetimeOf(student.id);
    const event = awardPoints({
      studentId: student.id,
      classId,
      behaviorId: QUICK_PLUS_BEHAVIOR.id,
    });
    if (!event) return;
    const nextPoints = prev + event.points;
    const evolved = didEvolve(prev, nextPoints);
    playAwardSound(event.points);
    if (evolved) window.setTimeout(() => playSound("evolve"), 180);
    afterAward(student, "positive", evolved, nextPoints, prev, {
      label: event.behaviorLabel,
      points: event.points,
      studentName: student.name,
    });
  }, [locked, lifetimeOf, awardPoints, classId, afterAward]);

  function handleFavoriteAward(behavior: Behavior) {
    unlockAudio();
    const targets: Student[] =
      selectMode && selectedIds.size > 0
        ? students.filter((s) => selectedIds.has(s.id) && !isAbsentToday(s))
        : focusStudent && !isAbsentToday(focusStudent)
          ? [focusStudent]
          : [];
    if (targets.length === 0) {
      toast.message("Tap a student first");
      return;
    }
    for (const st of targets) {
      const prev = lifetimeOf(st.id);
      const event = awardPoints({
        studentId: st.id,
        classId,
        behaviorId: behavior.id,
      });
      if (!event) continue;
      const nextPoints = prev + event.points;
      const evolved = didEvolve(prev, nextPoints);
      playAwardSound(event.points);
      if (evolved) window.setTimeout(() => playSound("evolve"), 180);
      afterAward(st, behavior.kind, evolved, nextPoints, prev, {
        label: event.behaviorLabel,
        points: event.points,
        studentName: st.name,
      });
    }
  }

  function toggleAttendance(student: Student) {
    const cur = getAttendanceStatus(student);
    const next = nextAttendanceStatus(cur);
    setAttendanceToday(student.id, next);
    toast.message(
      `${student.name.split(" ")[0]} ${next === "absent" ? "out" : next === "late" ? "late" : "in"}`,
      { duration: 1400 },
    );
  }

  function handleUndo() {
    const undone = undoLastClassEvent(classId);
    if (undone) toast.message(`Undid ${undone.behaviorLabel}`);
    else toast.message("Nothing to undo");
  }

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
    setFocusId(id);
  }, []);

  const selectedIdsRef = useRef(selectedIds);
  selectedIdsRef.current = selectedIds;
  const paintModeRef = useRef<"add" | "remove" | null>(null);
  const lastPaintIdRef = useRef<string | null>(null);

  function studentIdAtPoint(x: number, y: number): string | null {
    const el = document.elementFromPoint(x, y);
    return el?.closest("[data-student-id]")?.getAttribute("data-student-id") ?? null;
  }

  function applyPaint(id: string) {
    const mode = paintModeRef.current;
    if (!mode || lastPaintIdRef.current === id) return;
    lastPaintIdRef.current = id;
    setSelectedIds((prev) => {
      if (mode === "add" && prev.has(id)) return prev;
      if (mode === "remove" && !prev.has(id)) return prev;
      const n = new Set(prev);
      if (mode === "add") n.add(id);
      else n.delete(id);
      return n;
    });
  }

  function onSelectPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (!selectMode || rearrangeMode) return;
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const id = studentIdAtPoint(e.clientX, e.clientY);
    if (!id) return;
    e.preventDefault();
    paintModeRef.current = selectedIdsRef.current.has(id) ? "remove" : "add";
    lastPaintIdRef.current = null;
    applyPaint(id);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  function onSelectPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!paintModeRef.current) return;
    const id = studentIdAtPoint(e.clientX, e.clientY);
    if (id) applyPaint(id);
  }

  function onSelectPointerEnd(e: ReactPointerEvent<HTMLDivElement>) {
    if (!paintModeRef.current) return;
    paintModeRef.current = null;
    lastPaintIdRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelectedIds(new Set());
  }

  function spotlightStudent(s: Student) {
    setFocusId(s.id);
    requestAnimationFrame(() => {
      document
        .querySelector(`[data-student-id="${s.id}"]`)
        ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }

  function stopCycle() {
    setCycleActive(false);
    setCycleCurrentId(null);
    setCyclePickedIds(new Set());
    setFocusId(null);
  }

  function callInCycle(s: Student, picked: Set<string>) {
    const next = new Set(picked);
    next.add(s.id);
    setCyclePickedIds(next);
    setCycleCurrentId(s.id);
    setCycleActive(true);
    spotlightStudent(s);
    return next;
  }

  function startOneShotRandom() {
    if (selectMode) exitSelectMode();
    if (reel) return;
    const s = pickRandomStudent(cyclePool);
    if (!s) {
      toast.message("No one to pick (everyone is out)");
      return;
    }
    setReel({
      pool: cyclePool,
      winner: s,
      after: "once",
      pickedBefore: new Set(),
    });
  }

  function startCycle() {
    if (selectMode) exitSelectMode();
    if (reel) return;
    const s = pickRandomStudent(cyclePool);
    if (!s) {
      toast.message("No one to pick (everyone is out)");
      return;
    }
    setReel({
      pool: cyclePool,
      winner: s,
      after: "cycle",
      pickedBefore: new Set(),
    });
  }

  function cycleNext() {
    if (reel) return;
    const remaining = cyclePool.filter((s) => !cyclePickedIds.has(s.id));
    const s = pickRandomStudent(remaining);
    if (!s) {
      toast.success("All called");
      stopCycle();
      return;
    }
    setReel({
      pool: remaining,
      winner: s,
      after: "cycle",
      pickedBefore: new Set(cyclePickedIds),
    });
  }

  function cycleRestart() {
    if (reel) return;
    const s = pickRandomStudent(cyclePool);
    if (!s) {
      toast.message("No one to pick (everyone is out)");
      stopCycle();
      return;
    }
    setReel({
      pool: cyclePool,
      winner: s,
      after: "cycle",
      pickedBefore: new Set(),
    });
  }

  function finishReel() {
    const job = reel;
    setReel(null);
    if (!job) return;
    flashStudent(job.winner.id, "positive");
    if (job.after === "once") {
      spotlightStudent(job.winner);
      setOneShotPick(job.winner);
      window.setTimeout(() => setOneShotPick(null), 8000);
      return;
    }
    callInCycle(job.winner, job.pickedBefore);
  }

  useEffect(() => {
    if (!cycleActive) return;
    if (cyclePool.length === 0) return;
    if (cyclePickedIds.size < cyclePool.length) return;
    const t = window.setTimeout(() => stopCycle(), 1800);
    return () => window.clearTimeout(t);
  }, [cycleActive, cyclePickedIds, cyclePool.length]);

  function beginRearrange() {
    setRearrangeMode(true);
    setOrderDraft(
      students
        .slice()
        .sort(
          (a, b) =>
            (a.seatIndex ?? 999) - (b.seatIndex ?? 999) ||
            a.name.localeCompare(b.name),
        ),
    );
    setDragFrom(null);
  }

  function finishRearrange(save: boolean) {
    if (save && orderDraft) {
      setSeatOrder(
        classId,
        orderDraft.map((s) => s.id),
      );
      toast.success("Seats saved");
    }
    setRearrangeMode(false);
    setOrderDraft(null);
    setDragFrom(null);
  }

  function onDragStart(index: number) {
    setDragFrom(index);
  }

  function onDragOver(index: number) {
    if (dragFrom == null || !orderDraft || dragFrom === index) return;
    setOrderDraft((prev) => {
      if (!prev) return prev;
      const next = prev.slice();
      const [item] = next.splice(dragFrom, 1);
      if (!item) return prev;
      next.splice(index, 0, item);
      return next;
    });
    setDragFrom(index);
  }

  function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!studentName.trim()) return;
    const id = addStudent(classId, studentName.trim(), avatarId);
    if (!id) {
      toast.error(`Max ${MAX_CLASS_SIZE} students`);
      return;
    }
    setStudentName("");
    setAddOpen(false);
    toast.success("Student added");
  }

  function saveDailyGoal() {
    const n = Math.round(Number(goalDraft));
    if (!Number.isFinite(n) || n < 1) {
      toast.error("Enter a goal");
      return;
    }
    updateClass(classId, { dailyGoal: Math.min(500, n) });
    toast.success(`Goal ${Math.min(500, n)}`);
    setGoalOpen(false);
  }

  const attendanceCounts = useMemo(() => {
    let late = 0;
    let out = 0;
    for (const s of students) {
      const st = getAttendanceStatus(s);
      if (st === "late") late += 1;
      else if (st === "absent") out += 1;
    }
    return { late, out };
  }, [students]);

  if (!ready || !classroom) {
    return (
      <AppShell title="Loading…" className="max-w-7xl">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-surface-2" />
          ))}
        </div>
      </AppShell>
    );
  }

  const atCapacity = students.length >= MAX_CLASS_SIZE;
  const sortLabel = SORT_OPTIONS.find((o) => o.id === sort)?.label ?? "Sort";

  type MenuItem = {
    label: string;
    run: () => void;
    disabled?: boolean;
    danger?: boolean;
  };

  const menuSections: { title?: string; items: MenuItem[] }[] = [
    {
      title: "Classroom",
      items: [
        { label: "Teacher catalog", run: () => setCatalogOpen(true) },
        { label: "Day recap", run: () => setRecapOpen(true) },
        {
          label: "Spotlight",
          run: () => setSpotlightOpen(true),
          disabled: students.length === 0,
        },
        { label: "Week view", run: () => setWeekOpen(true) },
        {
          label: "Tournament",
          run: () => setTournamentOpen(true),
          disabled: students.length < 2,
        },
      ],
    },
    {
      title: "Display",
      items: [
        {
          label: smartboard ? "✓ Smartboard (default)" : "Smartboard mode",
          run: () => toggleSmartboard(),
        },
        {
          label: presentation ? "✓ Presentation" : "Presentation",
          run: () => togglePresentation(),
        },
        {
          label: projector ? "✓ Projector contrast" : "Projector contrast",
          run: () => toggleProjector(),
        },
        {
          label: cinematicEvolution
            ? "✓ Cinematic evolution"
            : "Cinematic evolution",
          run: () => toggleCinematicEvolution(),
          disabled: pack !== "ultra",
        },
        {
          label: "Rearrange seats",
          run: () => beginRearrange(),
          disabled: students.length < 2 || rearrangeMode,
        },
        {
          label: "Tables",
          run: () => setGroupsOpen(true),
          disabled: students.length === 0,
        },
      ],
    },
    {
      title: "Data",
      items: [
        {
          label: seasonStart != null ? "Reset season" : "Start season",
          run: () => {
            updateClass(classId, { seasonStartAt: Date.now() });
            toast.success(
              seasonStart != null
                ? "New season started — lifetime kept"
                : "Season tracking on",
            );
            setMode("season");
          },
        },
        {
          label: "Reports",
          run: () => {
            void navigate({ to: "/class/$classId/reports", params: { classId } });
          },
        },
      ],
    },
  ];

  return (
    <AppShell
      title={classroom.name}
      subtitle={[classroom.grade, PACK_SHORT[pack]].filter(Boolean).join(" · ")}
      backTo="/"
      backLabel="Classes"
      className="max-w-7xl"
      backdropSrc={arenaSrc}
      actions={
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Undo"
            title="Undo last award"
            onClick={handleUndo}
            data-chrome="teacher"
          >
            <Undo2 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Spar"
            title="Spar"
            disabled={students.length < 2}
            onClick={() => setSparOpen(true)}
          >
            <Swords className="size-4" />
          </Button>
          <ClassTimer />
          <BoardLockButton locked={locked} onLockedChange={setLocked} />
          <Button
            type="button"
            asChild
            variant="ghost"
            size="icon-sm"
            aria-label="Settings"
            title="Settings"
            data-chrome="teacher"
            data-hide-presentation
          >
            <Link to="/class/$classId/settings" params={{ classId }}>
              <Settings2 className="size-4" />
            </Link>
          </Button>
        </>
      }
    >
      {/* Compact stats + primary tools */}
      <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
        <div className="flex items-center gap-1 rounded-xl border border-border bg-surface px-2 py-1 text-xs sm:text-sm">
          <span className="font-bold tabular-nums">{students.length}</span>
          <span className="text-muted-fg">/{MAX_CLASS_SIZE}</span>
          <span className="mx-1 h-3 w-px bg-border" />
          <span className="font-bold tabular-nums text-positive">
            {classLifeTotal > 0 ? `+${classLifeTotal}` : classLifeTotal}
          </span>
          <span className="mx-1 h-3 w-px bg-border" />
          <span className="text-muted-fg">Today</span>
          <span className="font-bold tabular-nums">{todayAwardCount}</span>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant={pointsMode === "all" ? "secondary" : "default"}
            onClick={cyclePointsMode}
            title="Cycle points shown on cards"
            className="min-w-[4.5rem]"
          >
            {pointsMode === "today"
              ? "Today"
              : pointsMode === "season"
                ? "Season"
                : "All"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={cycleSort}
            title={`Sort: ${sortLabel}`}
            className="gap-1"
          >
            <ArrowUpDown className="size-3.5" />
            <span className="hidden sm:inline">{sortLabel}</span>
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            onClick={cycleDensity}
            title={`Size: ${density}`}
            aria-label={`Board size ${density}`}
          >
            {density === "compact" ? (
              <Minimize2 className="size-3.5" />
            ) : density === "showcase" ? (
              <Maximize2 className="size-3.5" />
            ) : (
              <Monitor className="size-3.5" />
            )}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={selectMode ? "default" : "secondary"}
            onClick={() => {
              if (selectMode) exitSelectMode();
              else {
                setSelectMode(true);
                setSelectedIds(new Set());
              }
            }}
            disabled={students.length === 0}
            data-chrome="teacher"
          >
            {selectMode ? "Done" : "Select"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="gap-1"
            disabled={cyclePool.length === 0 || cycleActive || !!reel}
            onClick={startOneShotRandom}
            title="Pick one random student"
            data-chrome="teacher"
          >
            <Dices className="size-3.5" />
            1xRand
          </Button>
          <Button
            type="button"
            size="sm"
            variant={cycleActive ? "default" : "secondary"}
            className="gap-1"
            disabled={cyclePool.length === 0 || !!reel}
            onClick={() => {
              if (cycleActive) return;
              startCycle();
            }}
            title="Fair random cycle"
            data-chrome="teacher"
          >
            <Shuffle className="size-3.5" />
            RandCycle
          </Button>
          {selectMode && (
            <>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() =>
                  setSelectedIds(new Set(boardStudents.map((s) => s.id)))
                }
                data-chrome="teacher"
              >
                All
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={selectedIds.size === 0}
                onClick={() => setSelectedIds(new Set())}
                data-chrome="teacher"
              >
                None
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={selectedIds.size === 0}
                onClick={() => setBatchOpen(true)}
                data-chrome="teacher"
              >
                Award ({selectedIds.size})
              </Button>
            </>
          )}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="gap-1"
            disabled={students.length === 0 || locked}
            onClick={() => setAttendanceOpen(true)}
            title="Mark present, late, or out"
            data-chrome="teacher"
            data-hide-presentation
          >
            <UserX className="size-3.5" />
            <span className="hidden sm:inline">Attendance</span>
            {(attendanceCounts.late > 0 || attendanceCounts.out > 0) && (
              <span className="tabular-nums text-muted-fg">
                {attendanceCounts.out > 0 ? `${attendanceCounts.out} out` : ""}
                {attendanceCounts.out > 0 && attendanceCounts.late > 0 ? " · " : ""}
                {attendanceCounts.late > 0 ? `${attendanceCounts.late} late` : ""}
              </span>
            )}
          </Button>
          {rearrangeMode ? (
            <>
              <Button type="button" size="sm" onClick={() => finishRearrange(true)} data-chrome="teacher">
                Done
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => finishRearrange(false)} data-chrome="teacher">
                Cancel
              </Button>
            </>
          ) : null}

          <div className="relative" data-chrome="teacher" ref={moreRef}>
            <Button
              type="button"
              size="sm"
              variant={moreOpen ? "default" : "secondary"}
              className="gap-1"
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              onClick={() => setMoreOpen((v) => !v)}
            >
              <MoreHorizontal className="size-4" />
              <span className="hidden sm:inline">More</span>
            </Button>
            {moreOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-30 mt-1 w-52 overflow-hidden rounded-xl border-2 border-border bg-surface py-1 shadow-lg animate-in fade-in-0 zoom-in-95"
              >
                {menuSections.map((section, si) => (
                  <div key={section.title ?? si}>
                    {section.title ? (
                      <p className="px-3 pb-0.5 pt-2 text-[10px] font-bold uppercase tracking-wide text-muted-fg">
                        {section.title}
                      </p>
                    ) : null}
                    {section.items.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        role="menuitem"
                        disabled={item.disabled}
                        className={cn(
                          "block w-full px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-surface-2 disabled:opacity-40",
                          item.danger && "text-danger",
                        )}
                        onClick={() => {
                          item.run();
                          setMoreOpen(false);
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                    {si < menuSections.length - 1 ? (
                      <div className="my-1 border-t border-border" />
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Dialog
            open={addOpen}
            onOpenChange={(v) => {
              setAddOpen(v);
              if (v) {
                setAvatarId(Math.floor(Math.random() * getAvatarCount(pack)) + 1);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="gap-1.5"
                disabled={atCapacity}
                title={atCapacity ? `Max ${MAX_CLASS_SIZE}` : "Add student"}
                data-chrome="teacher"
              >
                <UserPlus className="size-4" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <form onSubmit={handleAddStudent}>
                <DialogHeader>
                  <DialogTitle>Add student</DialogTitle>
                  <DialogDescription className="sr-only">Name and avatar</DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="stu-name">Name</Label>
                    <Input
                      id="stu-name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Name"
                      autoFocus
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Avatar</Label>
                    <AvatarPicker value={avatarId} onChange={setAvatarId} pack={pack} />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!studentName.trim()}>
                    Add
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {cycleActive && cycleCurrentId && (
        <PickBanner
          student={
            (cyclePool.find((s) => s.id === cycleCurrentId) ??
              students.find((s) => s.id === cycleCurrentId))!
          }
          pack={pack}
          points={lifetimeOf(cycleCurrentId)}
          called={cyclePickedIds.size}
          total={cyclePool.length}
          last={cyclePool.length > 0 && cyclePickedIds.size >= cyclePool.length}
          onNext={cycleNext}
          onRestart={cycleRestart}
          onDone={stopCycle}
        />
      )}
      {!cycleActive && oneShotPick && (
        <PickBanner
          student={oneShotPick}
          pack={pack}
          points={lifetimeOf(oneShotPick.id)}
          onDone={() => setOneShotPick(null)}
        />
      )}

      <div className="mb-2.5 flex gap-2" data-chrome="teacher">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-fg" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="h-9 pl-9"
            aria-label="Search students"
          />
        </div>
      </div>

      {groupLabels.length > 0 && !presentation && (
        <div
          className="mb-2.5 flex flex-wrap items-center gap-1.5"
          data-chrome="teacher"
        >
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-fg">
            Tables
          </span>
          {groupLabels.map((g) => {
            const count = students.filter(
              (s) => (s.group?.trim() ?? "") === g && !isAbsentToday(s),
            ).length;
            return (
              <Button
                key={g}
                type="button"
                size="sm"
                variant="secondary"
                className="h-8 gap-1"
                onClick={() => selectGroup(g)}
                title={`Select table ${g}`}
              >
                T{g}
                <span className="tabular-nums text-muted-fg">({count})</span>
              </Button>
            );
          })}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8"
            onClick={() => setGroupsOpen(true)}
          >
            Edit
          </Button>
        </div>
      )}

      <div className="mb-2.5" data-chrome="teacher">
        <button
          type="button"
          onClick={() => {
            setGoalDraft(dailyGoal != null ? String(dailyGoal) : "");
            setGoalOpen(true);
          }}
          className="w-full rounded-xl border border-border bg-surface px-3 py-1.5 text-left transition hover:border-accent/40 active:scale-[0.995]"
        >
          <div className="mb-1 flex items-center justify-between gap-2 text-xs">
            <span className="font-bold uppercase tracking-wide text-muted-fg">Goal</span>
            <span className="font-bold tabular-nums">
              {dailyGoal && dailyGoal > 0 ? (
                <>
                  +{todayPositivePts}
                  <span className="text-muted-fg">/{dailyGoal}</span>
                </>
              ) : (
                <span className="font-semibold text-muted-fg">Set</span>
              )}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-300 ease-out",
                goalPct >= 100 ? "bg-positive" : "bg-accent",
              )}
              style={{ width: dailyGoal && dailyGoal > 0 ? `${goalPct}%` : "0%" }}
            />
          </div>
        </button>
      </div>

      <div className="mb-2.5" data-chrome="teacher">
        <FavoriteSkillsBar
          classId={classId}
          targetLabel={
            selectMode && selectedIds.size > 0
              ? `${selectedIds.size} selected`
              : focusStudent?.name.split(" ")[0]
          }
          disabled={rearrangeMode}
          onAward={handleFavoriteAward}
        />
      </div>

      {rearrangeMode && (
        <p className="mb-2 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-semibold">
          Drag to rearrange seats
        </p>
      )}

      {students.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-surface/70 py-14 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <Plus className="size-6" />
          </span>
          <p className="font-semibold">No students yet</p>
          <Button size="sm" onClick={() => setAddOpen(true)} className="gap-1.5" data-chrome="teacher">
            <UserPlus className="size-4" />
            Add student
          </Button>
        </div>
      ) : boardStudents.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-fg">No matches</p>
      ) : (
        <>
        {selectMode && (
          <p className="mb-2 text-center text-xs font-semibold text-muted-fg">
            Tap or drag across students · first card sets add or remove
          </p>
        )}
        <div
          className={cn(
            "board-grid grid gap-2 sm:gap-2.5",
            density === "compact" && "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8",
            density === "normal" && "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
            density === "showcase" && "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
            selectMode && "cn-selecting select-none touch-none cursor-crosshair",
          )}
          data-density={density}
          onPointerDown={onSelectPointerDown}
          onPointerMove={onSelectPointerMove}
          onPointerUp={onSelectPointerEnd}
          onPointerCancel={onSelectPointerEnd}
        >
          {boardStudents.map((student, index) => {
            const life = lifetimeOf(student.id);
            const today = todayOf(student.id);
            const season = seasonOf(student.id);
            const shown =
              pointsMode === "today"
                ? today
                : pointsMode === "season"
                  ? season
                  : life;
            return (
              <StudentCard
                key={student.id}
                student={student}
                points={life}
                displayPoints={shown}
                pointsLabel={
                  pointsMode === "today"
                    ? "today"
                    : pointsMode === "season"
                      ? "season"
                      : undefined
                }
                todayPoints={today}
                pack={pack}
                onAward={openAward}
                onQuickPlus={selectMode || rearrangeMode ? undefined : handleQuickPlus}
                flash={flash[student.id] ?? null}
                evolvePulse={!!evolvePulse[student.id]}
                selectMode={selectMode}
                selected={selectedIds.has(student.id)}
                onToggleSelect={toggleSelect}
                absent={isAbsentToday(student)}
                late={isLateToday(student)}
                rearrangeMode={rearrangeMode}
                dragIndex={index}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={() => setDragFrom(null)}
                focused={focusId === student.id}
                cycleCalled={cyclePickedIds.has(student.id)}
              />
            );
          })}
        </div>
        </>
      )}

      <AwardPanel
        open={awardOpen}
        onOpenChange={setAwardOpen}
        student={selected}
        pack={pack}
        onAwarded={(kind, evolved, nextPoints, prevPoints, summary) => {
          if (!selected) return;
          if (evolved || didFormEvolve(prevPoints, nextPoints)) {
            setAwardOpen(false);
          }
          afterAward(selected, kind, evolved, nextPoints, prevPoints, summary);
        }}
      />

      <BatchAwardPanel
        open={batchOpen}
        onOpenChange={setBatchOpen}
        classId={classId}
        studentIds={Array.from(selectedIds)}
        onDone={() => {
          selectedIds.forEach((id) => flashStudent(id, "positive"));
          exitSelectMode();
        }}
      />

      <DayRecap
        open={recapOpen}
        onOpenChange={setRecapOpen}
        students={students}
        events={classEvents}
        className={classroom.name}
      />

      <Suspense fallback={null}>
        {sparOpen ? (
          <SparArena
            open={sparOpen}
            onOpenChange={setSparOpen}
            classId={classId}
            students={activeRoster}
            pack={pack}
          />
        ) : null}
        {tournamentOpen ? (
          <SparTournament
            open={tournamentOpen}
            onOpenChange={setTournamentOpen}
            classId={classId}
            students={activeRoster}
            pack={pack}
          />
        ) : null}
        {spotlightOpen ? (
          <Spotlight
            open={spotlightOpen}
            onClose={() => setSpotlightOpen(false)}
            students={activeRoster}
            pack={pack}
            pointsOf={lifetimeOf}
            todayOf={todayOf}
          />
        ) : null}
        {weekOpen ? (
          <WeekSnapshot
            open={weekOpen}
            onOpenChange={setWeekOpen}
            className={classroom.name}
            students={students}
            events={classEvents}
            lifetimeOf={lifetimeOf}
          />
        ) : null}
      </Suspense>

      <EvolutionBurst data={burst} onDone={() => setBurst(null)} />

      {reel && (
        <RandomReel
          pool={reel.pool}
          winner={reel.winner}
          pack={pack}
          pointsOf={lifetimeOf}
          onDone={finishReel}
        />
      )}

      <EvolutionCatalog
        open={catalogOpen}
        onOpenChange={setCatalogOpen}
        defaultPack={pack}
      />

      <Dialog open={attendanceOpen} onOpenChange={setAttendanceOpen}>
        <DialogContent className="max-h-[90dvh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserX className="size-5" />
              Attendance
            </DialogTitle>
            <DialogDescription>
              Tap a name: present → late → out. Done returns to the board.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 flex flex-wrap gap-2">
            {students
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((student) => {
                const status = getAttendanceStatus(student);
                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => toggleAttendance(student)}
                    title="Cycle present → late → absent"
                    className={cn(
                      "min-h-11 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-[0.97]",
                      status === "absent" &&
                        "border-danger/40 bg-danger/10 text-danger line-through",
                      status === "late" &&
                        "border-amber-400/50 bg-amber-400/15 text-amber-800 dark:text-amber-200",
                      status === "present" &&
                        "border-border bg-surface-2 text-fg hover:border-accent/40",
                    )}
                  >
                    {student.name.split(" ")[0]}
                    {status === "late" ? " · late" : status === "absent" ? " · out" : ""}
                  </button>
                );
              })}
          </div>
          {(attendanceCounts.late > 0 || attendanceCounts.out > 0) && (
            <p className="mt-3 text-xs font-semibold text-muted-fg">
              {attendanceCounts.out > 0 ? `${attendanceCounts.out} out` : ""}
              {attendanceCounts.out > 0 && attendanceCounts.late > 0 ? " · " : ""}
              {attendanceCounts.late > 0 ? `${attendanceCounts.late} late` : ""}
            </p>
          )}
          <DialogFooter className="mt-5">
            <Button type="button" onClick={() => setAttendanceOpen(false)}>
              Back to board
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={goalOpen} onOpenChange={setGoalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Daily goal</DialogTitle>
            <DialogDescription className="sr-only">
              Positive points target for the class today
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="daily-goal">Points</Label>
            <Input
              id="daily-goal"
              type="number"
              min={1}
              max={500}
              inputMode="numeric"
              value={goalDraft}
              onChange={(e) => setGoalDraft(e.target.value)}
              placeholder="40"
              autoFocus
            />
          </div>
          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                updateClass(classId, { dailyGoal: null });
                toast.success("Goal cleared");
                setGoalOpen(false);
              }}
            >
              Clear
            </Button>
            <Button type="button" onClick={saveDailyGoal}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={groupsOpen} onOpenChange={setGroupsOpen}>
        <DialogContent className="max-h-[90dvh] max-w-md overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tables</DialogTitle>
            <DialogDescription>
              Assign tables. Tap a table chip on the board to select everyone for batch award.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 space-y-2">
            {students
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((st) => (
                <div
                  key={st.id}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-border px-2.5 py-2"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                    {st.name}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {["1", "2", "3", "4", "5", "6"].map((g) => {
                      const on = (st.group?.trim() ?? "") === g;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() =>
                            updateStudent(st.id, { group: on ? null : g })
                          }
                          className={cn(
                            "flex size-9 items-center justify-center rounded-lg text-sm font-bold transition active:scale-95",
                            on
                              ? "bg-accent text-accent-fg"
                              : "bg-surface-2 text-muted-fg hover:text-fg",
                          )}
                        >
                          {g}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => updateStudent(st.id, { group: null })}
                      className="rounded-lg px-2 text-xs font-semibold text-muted-fg hover:text-fg"
                    >
                      None
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" onClick={() => setGroupsOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
