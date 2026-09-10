import { Link, createFileRoute } from "@tanstack/react-router";
import { Archive, ArchiveRestore, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PACK_SHORT, resolvePack } from "@/lib/avatars";
import { useClassStore } from "@/lib/store";
import { useHydratedStore } from "@/lib/use-hydrated-store";
import { formatRelative } from "@/lib/utils";

export const Route = createFileRoute("/archived")({
  component: ArchivedClassesPage,
});

function isArchived(c: { archivedAt?: number | null }) {
  return c.archivedAt != null && c.archivedAt > 0;
}

function ArchivedClassesPage() {
  const ready = useHydratedStore();
  const classes = useClassStore((s) => s.classes);
  const students = useClassStore((s) => s.students);
  const unarchiveClass = useClassStore((s) => s.unarchiveClass);
  const deleteClass = useClassStore((s) => s.deleteClass);

  const archived = [...classes]
    .filter(isArchived)
    .sort((a, b) => (b.archivedAt ?? 0) - (a.archivedAt ?? 0));

  return (
    <AppShell title="Archived classes" backTo="/" backLabel="Classes">
      <p className="mb-6 max-w-xl text-sm text-muted-fg">
        Archived classes stay out of your main list. Restore to use them again, or
        delete forever (students & points included).
      </p>

      {!ready ? (
        <p className="text-sm text-muted-fg">Loading…</p>
      ) : archived.length === 0 ? (
        <Card className="border-dashed p-8 text-center">
          <Archive className="mx-auto size-8 text-muted-fg" />
          <p className="mt-3 font-semibold">No archived classes</p>
          <p className="mt-1 text-sm text-muted-fg">
            Archive a class from the home screen to stash it here.
          </p>
          <Button asChild className="mt-4" size="sm">
            <Link to="/">Back to classes</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {archived.map((c) => {
            const count = students.filter((s) => s.classId === c.id).length;
            const packLabel = PACK_SHORT[resolvePack(c.avatarPack)];
            return (
              <Card key={c.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="truncate text-lg">{c.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {c.grade || "No grade"} · {packLabel}
                    </CardDescription>
                    <p className="mt-2 text-xs text-muted-fg">
                      Archived{" "}
                      {c.archivedAt
                        ? formatRelative(c.archivedAt)
                        : "—"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 gap-1">
                    <Users className="size-3" />
                    {count}
                  </Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="gap-1.5"
                    onClick={() => {
                      unarchiveClass(c.id);
                      toast.success(`Restored “${c.name}”`);
                    }}
                  >
                    <ArchiveRestore className="size-3.5" />
                    Restore
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="gap-1.5"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Permanently delete “${c.name}” and all students / points? This cannot be undone.`,
                        )
                      ) {
                        deleteClass(c.id);
                        toast.success(`Deleted “${c.name}”`);
                      }
                    }}
                  >
                    <Trash2 className="size-3.5" />
                    Delete forever
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
