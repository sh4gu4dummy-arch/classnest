import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, ChevronDown, Copy, Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { SkillIcon } from "@/components/skill-icon";
import { SkillIconPicker } from "@/components/skill-icon-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ALL_PACKS,
  PACK_LABELS,
  PACK_SHORT,
  getAvatarCount,
  type AvatarPack,
} from "@/lib/avatars";
import { defaultSkillIcon } from "@/lib/skill-icons";
import { hasCustomSkillDefaults } from "@/lib/skill-defaults";
import { isCoreBehavior } from "@/lib/seed";
import { useClassStore } from "@/lib/store";
import type { Behavior, BehaviorKind } from "@/lib/types";
import { useHydratedStore } from "@/lib/use-hydrated-store";
import { cn } from "@/lib/utils";
import {
  BANNER_STYLES,
  BOARD_BACKDROP_IDS,
  PACK_BOARD_BACKDROP,
} from "@/lib/shop";
import {
  loadCinematicEvolution,
  saveCinematicEvolution,
} from "@/lib/ultra-scrub";

export const Route = createFileRoute("/class/$classId/settings")({
  component: ClassSettingsPage,
});

function ClassSettingsPage() {
  const { classId } = Route.useParams();
  const navigate = useNavigate();
  const ready = useHydratedStore();
  const classroom = useClassStore((s) => s.classes.find((c) => c.id === classId));
  const otherClasses = useClassStore(
    useShallow((s) => s.classes.filter((c) => c.id !== classId && !c.archivedAt)),
  );
  const updateClass = useClassStore((s) => s.updateClass);
  const deleteClass = useClassStore((s) => s.deleteClass);
  const archiveClass = useClassStore((s) => s.archiveClass);
  const behaviors = useClassStore(
    useShallow((s) => s.classBehaviors(classId)),
  );
  const ownSkills = Boolean(classroom?.behaviors?.length);
  const addBehavior = useClassStore((s) => s.addBehavior);
  const updateBehavior = useClassStore((s) => s.updateBehavior);
  const deleteBehavior = useClassStore((s) => s.deleteBehavior);
  const resetBehaviors = useClassStore((s) => s.resetBehaviors);
  const saveBehaviorsAsDefault = useClassStore((s) => s.saveBehaviorsAsDefault);
  const clearBehaviorDefaults = useClassStore((s) => s.clearBehaviorDefaults);
  const copyBehaviorsFromClass = useClassStore((s) => s.copyBehaviorsFromClass);
  const useSharedBehaviors = useClassStore((s) => s.useSharedBehaviors);

  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [pack, setPack] = useState<AvatarPack>("kids");
  const [behLabel, setBehLabel] = useState("");
  const [behPoints, setBehPoints] = useState(1);
  const [behKind, setBehKind] = useState<BehaviorKind>("positive");
  const [behIcon, setBehIcon] = useState(defaultSkillIcon("positive"));
  const [copyFromId, setCopyFromId] = useState("");
  const [hasDefaults, setHasDefaults] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [cinematicEvolution, setCinematicEvolution] = useState(() =>
    loadCinematicEvolution(),
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editPoints, setEditPoints] = useState(1);
  const [editKind, setEditKind] = useState<BehaviorKind>("positive");
  const [editIcon, setEditIcon] = useState(defaultSkillIcon("positive"));

  useEffect(() => {
    if (classroom) {
      setName(classroom.name);
      setGrade(classroom.grade ?? "");
      setPack(
        classroom.avatarPack === "teens"
          ? "teens"
          : classroom.avatarPack === "ultra"
            ? "ultra"
            : "kids",
      );
    }
  }, [classroom]);

  useEffect(() => {
    setHasDefaults(hasCustomSkillDefaults());
  }, [behaviors]);

  useEffect(() => {
    if (ready && !classroom) {
      void navigate({ to: "/" });
    }
  }, [ready, classroom, navigate]);

  function startEdit(b: Behavior) {
    setEditingId(b.id);
    setEditLabel(b.label);
    setEditPoints(b.points);
    setEditKind(b.kind);
    setEditIcon(b.icon || defaultSkillIcon(b.kind));
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function saveEdit() {
    if (!editingId) return;
    const label = editLabel.trim();
    if (!label) {
      toast.error("Label required");
      return;
    }
    const raw = Number(editPoints);
    const pts = Number.isFinite(raw)
      ? Math.min(10, Math.max(0, Math.round(raw)))
      : 1;
    updateBehavior(
      editingId,
      {
        label,
        kind: editKind,
        points: pts,
        icon: editIcon,
      },
      classId,
    );
    setEditingId(null);
    toast.success("Skill updated");
  }

  if (!ready || !classroom) {
    return (
      <AppShell title="Settings">
        <div className="h-40 animate-pulse rounded-2xl bg-surface-2" />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Settings"
      subtitle={classroom.name}
      backTo={`/class/${classId}`}
      backLabel="Board"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Class details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Avatar pack</Label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {ALL_PACKS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPack(p)}
                    className={cn(
                      "rounded-xl border-2 px-3 py-2.5 text-left transition-all",
                      pack === p
                        ? p === "ultra"
                          ? "border-amber-400 bg-amber-400/15"
                          : "border-accent bg-accent/10"
                        : "border-border hover:border-border-strong",
                    )}
                  >
                    <p className="text-sm font-bold">{PACK_SHORT[p]}</p>
                    <p className="text-[11px] text-muted-fg">
                      {getAvatarCount(p)} characters
                    </p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-fg">{PACK_LABELS[pack]}</p>
            </div>
            {pack === "ultra" ? (
              <div className="space-y-2 rounded-xl border border-border bg-surface-2/40 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Label htmlFor="cinematic-evo">Cinematic evolution</Label>
                    <p className="mt-0.5 text-xs text-muted-fg">
                      When on, Ultra faces advance one Home-film still per point
                      instead of snapping at 10 and 20. Classic morph burst still
                      plays at those thresholds. Needs local scrub frames (not in
                      git).
                    </p>
                  </div>
                  <button
                    id="cinematic-evo"
                    type="button"
                    role="switch"
                    aria-checked={cinematicEvolution}
                    onClick={() => {
                      const next = !cinematicEvolution;
                      setCinematicEvolution(next);
                      saveCinematicEvolution(next);
                      toast.success(
                        next
                          ? "Cinematic evolution on"
                          : "Classic evolution on",
                      );
                    }}
                    className={cn(
                      "relative h-8 w-14 shrink-0 rounded-full border-2 transition",
                      cinematicEvolution
                        ? "border-accent bg-accent"
                        : "border-border bg-surface",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 size-6 rounded-full bg-white shadow transition",
                        cinematicEvolution ? "left-7" : "left-0.5",
                      )}
                    />
                  </button>
                </div>
              </div>
            ) : null}
            <div className="space-y-2">
              <Label>Board arena</Label>
              <p className="text-xs text-muted-fg">
                One still behind the seats. Auto follows the pack (kids meadow,
                teens solar, Ultra void).
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(["auto", "none", ...BOARD_BACKDROP_IDS] as const).map((id) => {
                  const current = classroom.boardBackdrop ?? "auto";
                  const selected = current === id || (!classroom.boardBackdrop && id === "auto");
                  const src =
                    id === "none"
                      ? null
                      : id === "auto"
                        ? BANNER_STYLES[PACK_BOARD_BACKDROP[pack]]?.src
                        : BANNER_STYLES[id]?.src;
                  const label =
                    id === "auto"
                      ? "Auto"
                      : id === "none"
                        ? "None"
                        : BANNER_STYLES[id]?.label ?? id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        updateClass(classId, { boardBackdrop: id });
                        toast.success(
                          id === "none"
                            ? "Board background off"
                            : `Arena: ${label}`,
                        );
                      }}
                      className={cn(
                        "overflow-hidden rounded-xl border-2 text-left transition-all",
                        selected
                          ? "border-accent ring-2 ring-accent/30"
                          : "border-border hover:border-border-strong",
                      )}
                    >
                      <span className="block aspect-[16/9] bg-surface-2">
                        {src ? (
                          <img
                            src={src}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center text-[11px] font-semibold text-muted-fg">
                            Plain
                          </span>
                        )}
                      </span>
                      <span className="block px-2 py-1 text-[11px] font-bold">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() => {
                  if (!name.trim()) {
                    toast.error("Name required");
                    return;
                  }
                  updateClass(classId, {
                    name: name.trim(),
                    grade: grade.trim() || undefined,
                    avatarPack: pack,
                  });
                  toast.success("Class saved");
                }}
              >
                Save class
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  updateClass(classId, { seasonStartAt: Date.now() });
                  toast.success(
                    classroom.seasonStartAt
                      ? "New season started (lifetime kept)"
                      : "Season tracking on",
                  );
                }}
              >
                {classroom.seasonStartAt ? "Reset season" : "Start season"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skills</CardTitle>
            <CardDescription>
              {ownSkills
                ? "This class has its own list."
                : "Using the shared device list. Edit or copy to make it this class only."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {otherClasses.length > 0 ? (
              <div className="flex flex-wrap items-end gap-2">
                <div className="min-w-[10rem] flex-1 space-y-1">
                  <Label htmlFor="copy-skills">Copy from class</Label>
                  <select
                    id="copy-skills"
                    className="h-10 w-full rounded-xl border-2 border-border bg-surface px-2 text-sm"
                    value={copyFromId}
                    onChange={(e) => setCopyFromId(e.target.value)}
                  >
                    <option value="">Choose a class…</option>
                    {otherClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="gap-1.5"
                  disabled={!copyFromId}
                  onClick={() => {
                    if (!copyFromId) return;
                    const src = otherClasses.find((c) => c.id === copyFromId);
                    if (
                      ownSkills &&
                      !window.confirm(
                        `Replace this class’s skills with “${src?.name ?? "that class"}”?`,
                      )
                    ) {
                      return;
                    }
                    if (copyBehaviorsFromClass(classId, copyFromId)) {
                      toast.success(`Copied skills from ${src?.name ?? "class"}`);
                      setCopyFromId("");
                    }
                  }}
                >
                  <Copy className="size-3.5" />
                  Copy skills
                </Button>
                {ownSkills && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      useSharedBehaviors(classId);
                      toast.message("Back to shared device skills");
                    }}
                  >
                    Use shared list
                  </Button>
                )}
              </div>
            ) : ownSkills ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  useSharedBehaviors(classId);
                  toast.message("Back to shared device skills");
                }}
              >
                Use shared list
              </Button>
            ) : null}
            <ul className="space-y-2">
              {behaviors.map((b) => {
                const editing = editingId === b.id;
                return (
                  <li
                    key={b.id}
                    className="flex flex-col gap-2 rounded-xl border border-border px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {editing ? (
                      <div className="flex w-full flex-col gap-2">
                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                          <Input
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            className="sm:flex-1"
                            autoFocus
                          />
                          <select
                            className="h-10 rounded-xl border-2 border-border bg-surface px-2 text-sm"
                            value={editKind}
                            onChange={(e) => {
                              const k = e.target.value as BehaviorKind;
                              setEditKind(k);
                              setEditIcon(defaultSkillIcon(k));
                            }}
                          >
                            <option value="positive">Positive</option>
                            <option value="needs_work">Needs work</option>
                          </select>
                          <Input
                            type="number"
                            min={0}
                            max={10}
                            className="w-20"
                            value={editPoints}
                            onChange={(e) =>
                              setEditPoints(
                                e.target.value === "" ? 0 : Number(e.target.value),
                              )
                            }
                          />
                          <span className="flex gap-1">
                            <Button type="button" size="sm" onClick={saveEdit}>
                              <Check className="size-3.5" />
                            </Button>
                            <Button type="button" size="sm" variant="ghost" onClick={cancelEdit}>
                              <X className="size-3.5" />
                            </Button>
                          </span>
                        </div>
                        <SkillIconPicker
                          value={editIcon}
                          kind={editKind}
                          onChange={setEditIcon}
                        />
                      </div>
                    ) : (
                      <>
                        <span className="flex min-w-0 items-center gap-2">
                          <SkillIcon icon={b.icon} className="size-5" />
                          <span className="min-w-0">
                            <span className="font-semibold">{b.label}</span>
                            <span
                              className={cn(
                                "ml-2 text-sm font-bold tabular-nums",
                                b.points > 0
                                  ? "text-positive"
                                  : b.points < 0
                                    ? "text-danger"
                                    : "text-muted-fg",
                              )}
                            >
                              {b.points > 0 ? `+${b.points}` : b.points}
                            </span>
                          </span>
                        </span>
                        <span className="flex shrink-0 gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            onClick={() => startEdit(b)}
                          >
                            <Pencil className="size-3.5" />
                            Edit
                          </Button>
                          {!isCoreBehavior(b.id) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-danger"
                              onClick={() => {
                                if (editingId === b.id) setEditingId(null);
                                deleteBehavior(b.id, classId);
                                toast.message("Skill removed");
                              }}
                            >
                              Remove
                            </Button>
                          )}
                          {isCoreBehavior(b.id) && (
                            <span className="self-center px-2 text-[10px] font-bold uppercase tracking-wide text-muted-fg">
                              Core
                            </span>
                          )}
                        </span>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!behLabel.trim()) return;
                const pts = Math.min(
                  10,
                  Math.max(0, Math.round(Number(behPoints) || 0)),
                );
                addBehavior(behLabel, behKind, pts, {
                  icon: behIcon,
                  classId,
                });
                setBehLabel("");
                setBehIcon(defaultSkillIcon(behKind));
                toast.success(pts === 0 ? "Warning skill added" : "Skill added");
              }}
            >
              <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
                <Input
                  placeholder="New skill"
                  value={behLabel}
                  onChange={(e) => setBehLabel(e.target.value)}
                />
                <select
                  className="h-10 rounded-xl border-2 border-border bg-surface px-2 text-sm"
                  value={behKind}
                  onChange={(e) => {
                    const k = e.target.value as BehaviorKind;
                    setBehKind(k);
                    setBehIcon(defaultSkillIcon(k));
                  }}
                >
                  <option value="positive">Positive</option>
                  <option value="needs_work">Needs work</option>
                </select>
                <Input
                  type="number"
                  min={0}
                  max={10}
                  className="w-20"
                  value={behPoints}
                  onChange={(e) =>
                    setBehPoints(e.target.value === "" ? 0 : Number(e.target.value))
                  }
                />
                <Button type="submit">Add</Button>
              </div>
              <SkillIconPicker
                value={behIcon}
                kind={behKind}
                onChange={setBehIcon}
              />
            </form>
          </CardContent>
        </Card>

        {/* Advanced — defaults, archive, delete */}
        <div className="rounded-2xl border-2 border-border">
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-left"
            onClick={() => setAdvancedOpen((v) => !v)}
          >
            <span className="font-bold">Advanced</span>
            <ChevronDown
              className={cn(
                "size-4 text-muted-fg transition",
                advancedOpen && "rotate-180",
              )}
            />
          </button>
          {advancedOpen && (
            <div className="space-y-4 border-t border-border px-4 py-4">
              <div>
                <p className="mb-2 text-sm font-semibold">Skill defaults</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                      saveBehaviorsAsDefault(classId);
                      setHasDefaults(true);
                      toast.success("Saved as default skills");
                    }}
                  >
                    <Save className="size-3.5" />
                    Save as default
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingId(null);
                      resetBehaviors(classId);
                      toast.message("Skills reset to defaults");
                    }}
                  >
                    Reset skills
                  </Button>
                  {hasDefaults && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm("Clear saved skill defaults?")) {
                          clearBehaviorDefaults();
                          setHasDefaults(false);
                          toast.message("Defaults cleared");
                        }
                      }}
                    >
                      Clear saved defaults
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">Archive</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    archiveClass(classId);
                    toast.success(`Archived “${classroom.name}”`);
                    void navigate({ to: "/" });
                  }}
                >
                  Archive class
                </Button>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-danger">Danger</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete “${classroom.name}” and all students forever?`,
                      )
                    ) {
                      deleteClass(classId);
                      toast.success("Class deleted");
                      void navigate({ to: "/" });
                    }
                  }}
                >
                  Delete forever
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
