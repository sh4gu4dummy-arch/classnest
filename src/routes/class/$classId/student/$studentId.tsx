import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Trash2, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AvatarPicker } from "@/components/avatar-picker";
import { AwardPanel } from "@/components/award-panel";
import { EvolutionBurst, type EvolutionBurstData } from "@/components/evolution-burst";
import { PrintSlip } from "@/components/print-slip";
import { ShopPanel } from "@/components/shop-panel";
import { SparArena } from "@/components/spar-arena";
import { HiResViewer, StudentHome, type SparRematch } from "@/components/student-home";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { getAvatarCount, resolvePack, type AvatarPack } from "@/lib/avatars";
import { useClassStore } from "@/lib/store";
import { useHydratedStore } from "@/lib/use-hydrated-store";
import { formatRelative } from "@/lib/utils";

export const Route = createFileRoute("/class/$classId/student/$studentId")({
  component: StudentProfilePage,
});

function StudentProfilePage() {
  const { classId, studentId } = Route.useParams();
  const navigate = useNavigate();
  const ready = useHydratedStore();
  const student = useClassStore((s) => s.students.find((st) => st.id === studentId));
  const classroom = useClassStore((s) => s.classes.find((c) => c.id === classId));
  const allStudents = useClassStore((s) => s.students);
  const studentEvents = useClassStore((s) => s.studentEvents);
  const studentPoints = useClassStore((s) => s.studentPoints);
  const updateStudent = useClassStore((s) => s.updateStudent);
  const deleteStudent = useClassStore((s) => s.deleteStudent);
  const undoEvent = useClassStore((s) => s.undoEvent);
  const clearStudentEvents = useClassStore((s) => s.clearStudentEvents);

  const pack: AvatarPack = resolvePack(classroom?.avatarPack);
  const classmates = useMemo(
    () => allStudents.filter((s) => s.classId === classId),
    [allStudents, classId],
  );

  const [awardOpen, setAwardOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [sparOpen, setSparOpen] = useState(false);
  const [sparRematch, setSparRematch] = useState<SparRematch | null>(null);
  const [hiResOpen, setHiResOpen] = useState(false);
  const [name, setName] = useState("");
  const [pickId, setPickId] = useState(1);
  const [burst, setBurst] = useState<EvolutionBurstData | null>(null);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setPickId(student.avatarId);
    }
  }, [student]);

  const events = useMemo(
    () => studentEvents(studentId),
    [studentEvents, studentId, ready],
  );
  const points = student ? studentPoints(student.id) : 0;
  const seasonPoints = useMemo(() => {
    const start = classroom?.seasonStartAt;
    if (start == null) return null;
    return events
      .filter((e) => e.createdAt >= start)
      .reduce((a, e) => a + e.points, 0);
  }, [events, classroom?.seasonStartAt]);

  useEffect(() => {
    if (ready && (!student || !classroom)) {
      void navigate({ to: "/class/$classId", params: { classId } });
    }
  }, [ready, student, classroom, navigate, classId]);

  if (!ready || !student || !classroom) {
    return (
      <AppShell title="Loading…">
        <div className="h-48 animate-pulse rounded-2xl bg-surface-2" />
      </AppShell>
    );
  }

  return (
    <AppShell
      title={student.name}
      subtitle="Nest"
      backTo={`/class/${classId}`}
      backLabel="Board"
      actions={
        <div className="flex items-center gap-1.5">
          <PrintSlip student={student} size="sm" />
          <Button size="sm" onClick={() => setAwardOpen(true)}>
            Award
          </Button>
        </div>
      }
    >
      <StudentHome
        student={student}
        points={points}
        seasonPoints={seasonPoints}
        pack={pack}
        events={events}
        classmates={classmates}
        onShop={() => setShopOpen(true)}
        onSpar={(rematch) => {
          setSparRematch(rematch ?? null);
          setSparOpen(true);
        }}
        onHiRes={() => setHiResOpen(true)}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setPickId(student.avatarId);
            setAvatarOpen(true);
          }}
        >
          Change avatar
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
          Edit name
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-danger hover:text-danger"
          onClick={() => {
            if (window.confirm(`Remove ${student.name} from the class?`)) {
              deleteStudent(student.id);
              toast.success("Student removed");
              void navigate({ to: "/class/$classId", params: { classId } });
            }
          }}
        >
          <Trash2 className="size-4" />
          Remove
        </Button>
      </div>

      <Separator className="my-6" />

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Point history</CardTitle>
          {events.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-fg"
              onClick={() => {
                if (window.confirm("Clear all points for this student?")) {
                  clearStudentEvents(student.id);
                  toast.success("History cleared");
                }
              }}
            >
              Clear all
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-fg">No history yet</p>
          ) : (
            <ul className="space-y-2">
              {events.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center gap-2 rounded-xl border border-border/80 bg-surface-2/50 px-3 py-2"
                >
                  <Badge
                    variant={e.kind === "positive" ? "positive" : "danger"}
                    className="tabular-nums shrink-0"
                  >
                    {e.points > 0 ? `+${e.points}` : e.points}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{e.behaviorLabel}</p>
                    <p className="text-xs text-muted-fg">
                      {formatRelative(e.createdAt)}
                      {e.source && e.source !== "behavior" ? ` · ${e.source}` : ""}
                      {e.note ? ` · ${e.note}` : ""}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Undo"
                    onClick={() => {
                      undoEvent(e.id);
                      toast.success("Undone");
                    }}
                  >
                    <Undo2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <AwardPanel
        open={awardOpen}
        onOpenChange={setAwardOpen}
        student={student}
        pack={pack}
        onAwarded={(_kind, evolved, nextPoints, prevPoints) => {
          if (evolved) {
            setBurst({
              studentName: student.name,
              avatarId: student.avatarId,
              pack,
              points: nextPoints,
              prevPoints,
            });
          }
        }}
      />

      <ShopPanel
        open={shopOpen}
        onOpenChange={setShopOpen}
        classId={classId}
        studentId={student.id}
        studentName={student.name}
      />

      <SparArena
        open={sparOpen}
        onOpenChange={(v) => {
          setSparOpen(v);
          if (!v) setSparRematch(null);
        }}
        classId={classId}
        students={classmates}
        pack={pack}
        defaultAttackerId={student.id}
        defaultDefenderId={sparRematch?.opponentId}
        defaultBet={sparRematch?.bet}
      />

      <HiResViewer
        open={hiResOpen}
        onClose={() => setHiResOpen(false)}
        student={student}
        points={points}
        pack={pack}
      />

      <EvolutionBurst data={burst} onDone={() => setBurst(null)} />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              updateStudent(student.id, { name: name.trim() });
              toast.success("Name updated");
              setEditOpen(false);
            }}
          >
            <DialogHeader>
              <DialogTitle>Edit name</DialogTitle>
              <DialogDescription>Update how this student appears on the board.</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-1.5">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={avatarOpen} onOpenChange={setAvatarOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Choose avatar</DialogTitle>
            <DialogDescription>
              {pack === "ultra"
                ? `${getAvatarCount("ultra")} Ultra legends × 3 real evolutions. Elves, witches, mechs, aliens, cute, sci-fi — pick your fighter.`
                : pack === "teens"
                  ? "40 teen characters — fighters, animals, sci-fi, and more."
                  : "40 kid-friendly creatures and pals."}
            </DialogDescription>
          </DialogHeader>
          <AvatarPicker value={pickId} onChange={setPickId} pack={pack} />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setAvatarOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                updateStudent(student.id, { avatarId: pickId });
                toast.success("Avatar updated");
                setAvatarOpen(false);
              }}
            >
              Save avatar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
