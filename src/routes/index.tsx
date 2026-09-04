import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Archive, BookOpen, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { BackupPanel, saveDataBackupNow } from "@/components/backup-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { AvatarPack } from "@/lib/avatars";
import { ALL_PACKS, PACK_SHORT, getAvatarCount, resolvePack } from "@/lib/avatars";
import { backupIsStale, lastBackupAt } from "@/lib/prefs";
import { useClassStore } from "@/lib/store";
import { useHydratedStore } from "@/lib/use-hydrated-store";
import { cn, formatRelative } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: HomePage });

function isArchived(c: { archivedAt?: number | null }) {
  return c.archivedAt != null && c.archivedAt > 0;
}

function HomePage() {
  const navigate = useNavigate();
  const ready = useHydratedStore();
  const classes = useClassStore((s) => s.classes);
  const students = useClassStore((s) => s.students);
  const addClass = useClassStore((s) => s.addClass);
  const archiveClass = useClassStore((s) => s.archiveClass);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [pack, setPack] = useState<AvatarPack>("kids");
  const [stale, setStale] = useState(() => ready && backupIsStale(7));

  const active = [...classes]
    .filter((c) => !isArchived(c))
    .sort((a, b) => b.updatedAt - a.updatedAt);
  const archivedCount = classes.filter(isArchived).length;
  const lastBackup = lastBackupAt();
  const showStale = ready && (stale || backupIsStale(7));

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const id = addClass(name, grade, pack);
    setName("");
    setGrade("");
    setPack("kids");
    setOpen(false);
    void navigate({ to: "/class/$classId", params: { classId: id } });
  }

  return (
    <AppShell>
      {showStale && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2.5">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
            File copy is over a week old
            <span className="ml-1.5 font-normal opacity-80">
              last download {formatRelative(lastBackup!)}
            </span>
          </p>
          <Button
            size="sm"
            className="shrink-0"
            onClick={() => {
              if (saveDataBackupNow()) {
                setStale(false);
                toast.success("Backup saved");
              } else {
                toast.error("Could not save backup");
              }
            }}
          >
            Save now
          </Button>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Classes</h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary" size="sm" className="gap-1.5">
            <Link to="/archived" title="Archived classes" aria-label="Archived classes">
              <Archive className="size-4" />
              Archived
              {archivedCount > 0 ? (
                <span className="tabular-nums text-muted-fg">({archivedCount})</span>
              ) : null}
            </Link>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="size-4" />
                New class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>New class</DialogTitle>
                  <DialogDescription className="sr-only">
                    Name, grade, and avatar pack
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="class-name">Name</Label>
                    <Input
                      id="class-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Room 3B"
                      autoFocus
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="class-grade">Grade</Label>
                    <Input
                      id="class-grade"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pack</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {ALL_PACKS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPack(p)}
                          className={cn(
                            "rounded-xl border-2 px-2 py-2.5 text-center transition-all",
                            pack === p
                              ? p === "ultra"
                                ? "border-amber-400 bg-amber-400/15 shadow-md"
                                : "border-accent bg-accent/10"
                              : "border-border bg-surface-2/70 hover:border-border-strong",
                          )}
                        >
                          <p className="text-sm font-bold">{PACK_SHORT[p]}</p>
                          <p className="text-[10px] font-semibold tabular-nums text-muted-fg">
                            {getAvatarCount(p)}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!name.trim()}>
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!ready ? (
        <p className="text-sm text-muted-fg">Loading…</p>
      ) : active.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="size-5 text-accent" />
              No classes yet
            </CardTitle>
            <CardDescription>Create one to get started.</CardDescription>
            {archivedCount > 0 && (
              <Button asChild variant="secondary" size="sm" className="mt-2 w-fit gap-1.5">
                <Link to="/archived">
                  <Archive className="size-4" />
                  Archived ({archivedCount})
                </Link>
              </Button>
            )}
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((c) => {
            const count = students.filter((s) => s.classId === c.id).length;
            const packLabel = PACK_SHORT[resolvePack(c.avatarPack)];
            return (
              <Card
                key={c.id}
                className="group overflow-hidden transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <div className="flex items-stretch">
                  <Link
                    to="/class/$classId"
                    params={{ classId: c.id }}
                    className="min-w-0 flex-1 rounded-l-[inherit] p-4 pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Open ${c.name}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <CardTitle className="truncate text-lg transition-colors group-hover:text-accent">
                          {c.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {[c.grade, packLabel].filter(Boolean).join(" · ") || packLabel}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="shrink-0 gap-1">
                        <Users className="size-3" />
                        {count}
                      </Badge>
                    </div>
                  </Link>
                  <div className="flex shrink-0 items-end p-3 pl-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-9 text-muted-fg hover:bg-accent/10 hover:text-accent"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        archiveClass(c.id);
                        toast.success(`Archived “${c.name}”`);
                      }}
                      aria-label={`Archive ${c.name}`}
                      title={`Archive ${c.name}`}
                    >
                      <Archive className="size-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-8">
        <BackupPanel />
      </div>
    </AppShell>
  );
}
