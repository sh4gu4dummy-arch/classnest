import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Copy,
  Shrink,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
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
import { EXPORT_STORAGE_KEY } from "@/lib/export-keys";
import {
  APP_VERSION_LABEL,
  APK_VERSION_LABEL,
  IS_PORTABLE,
  PACK_BUILT_LABEL,
  PACK_VERSION_LABEL,
  AVATARS_VERSION_LABEL,
  AVATARS_BUILT_LABEL,
  dataBackupFilename,
  DOWNLOAD_FILES,
  DOWNLOAD_HREFS,
} from "@/lib/app-version";
import {
  getLocalBackup,
  listLocalBackups,
  pushLocalBackup,
  type LocalBackupMeta,
} from "@/lib/local-backups";
import { markBackupDone } from "@/lib/prefs";
import { useClassStore, type ClassNestBackup } from "@/lib/store";
import { formatRelative } from "@/lib/utils";
import {
  fetchPackMeta,
  formatPackSize,
} from "@/lib/pack-download";

const PRE_RESTORE_KEY = "classnest-pre-restore-v1";

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function BackupPanel() {
  const exportBackup = useClassStore((s) => s.exportBackup);
  const importBackup = useClassStore((s) => s.importBackup);
  const mergeBackup = useClassStore((s) => s.mergeBackup);
  const compactOldEvents = useClassStore((s) => s.compactOldEvents);
  const previewCompactOldEvents = useClassStore((s) => s.previewCompactOldEvents);
  const eventCount = useClassStore((s) => s.events.length);
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<{
    name: string;
    data: ClassNestBackup;
  } | null>(null);
  const [compactOpen, setCompactOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const [locals, setLocals] = useState<LocalBackupMeta[]>(() => listLocalBackups());
  const [portableBytes, setPortableBytes] = useState<number | null>(null);
  const [avatarsBytes, setAvatarsBytes] = useState<number | null>(null);

  const compactPreview = previewCompactOldEvents(14);

  useEffect(() => {
    if (IS_PORTABLE) return;
    fetchPackMeta("portable")
      .then((m) => setPortableBytes(m.bytes))
      .catch(() => {});
    fetchPackMeta("avatars")
      .then((m) => setAvatarsBytes(m.bytes))
      .catch(() => {});
  }, []);

  function refreshLocals() {
    setLocals(listLocalBackups());
  }

  function snapshotForUndo() {
    try {
      localStorage.setItem(PRE_RESTORE_KEY, JSON.stringify(exportBackup()));
    } catch {
      /* ignore quota */
    }
  }

  function undoRestore() {
    try {
      const raw = localStorage.getItem(PRE_RESTORE_KEY);
      if (!raw) {
        toast.error("No snapshot to undo");
        return;
      }
      const result = importBackup(JSON.parse(raw));
      if (result.ok) toast.success("Restore undone");
      else toast.error(result.error);
    } catch {
      toast.error("Could not undo restore");
    }
  }

  function handleDownloadJson() {
    const data = exportBackup();
    downloadJson(data, dataBackupFilename());
    pushLocalBackup(data);
    refreshLocals();
    markBackupDone();
    toast.success("Data backup saved");
  }

  async function handleCopyJson() {
    try {
      const data = exportBackup();
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      pushLocalBackup(data, "Copied snapshot");
      refreshLocals();
      markBackupDone();
      toast.success("Backup copied");
    } catch {
      toast.error("Copy failed");
    }
  }

  function handleRestoreFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as ClassNestBackup;
        setPendingFile({ name: file.name, data });
      } catch {
        toast.error("Invalid backup file");
      }
    };
    reader.readAsText(file);
  }

  function confirmReplace() {
    if (!pendingFile) return;
    snapshotForUndo();
    const result = importBackup(pendingFile.data);
    setPendingFile(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Data replaced", {
      action: { label: "Undo", onClick: undoRestore },
      duration: 12000,
    });
  }

  function confirmMerge() {
    if (!pendingFile) return;
    snapshotForUndo();
    const result = mergeBackup(pendingFile.data);
    setPendingFile(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(
      `Merged +${result.addedClasses} classes, +${result.addedStudents} students, +${result.addedEvents} events`,
      {
        action: { label: "Undo", onClick: undoRestore },
        duration: 12000,
      },
    );
  }

  function restoreLocal(id: string) {
    const data = getLocalBackup(id);
    if (!data) {
      toast.error("Snapshot missing");
      return;
    }
    setPendingFile({ name: "In-browser snapshot", data });
  }

  function buildDataKit() {
    try {
      sessionStorage.setItem(EXPORT_STORAGE_KEY, JSON.stringify(exportBackup()));
      window.open("/export-kit", "_blank", "noopener,noreferrer");
      markBackupDone();
    } catch {
      toast.error("Could not stage portable kit");
    }
  }

  function runCompress() {
    const before = exportBackup();
    const result = compactOldEvents(14);
    setCompactOpen(false);
    if (result.removed === 0) {
      toast.message("Nothing to compress");
      return;
    }
    try {
      localStorage.setItem(PRE_RESTORE_KEY, JSON.stringify(before));
    } catch {
      /* ignore */
    }
    toast.success(
      `${result.removed} → ${result.after} entries (${result.rollups} rollups)`,
      {
        action: {
          label: "Undo",
          onClick: () => {
            const undo = importBackup(before);
            if (undo.ok) toast.message("Compression undone");
            else toast.error(undo.error);
          },
        },
        duration: 12000,
      },
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          Backup & downloads{" "}
          <span className="ml-1 text-xs font-semibold text-muted-fg">
            {APP_VERSION_LABEL}
          </span>
        </CardTitle>
        <p className="text-xs font-medium text-muted-fg">
          {IS_PORTABLE
            ? "This is the app. Pictures live in the avatars folder — copy the Avatar media pack there if pictures are missing."
            : "Classes auto-save when you change something. File download is an extra copy for USB / restore."}
          {PACK_BUILT_LABEL ? (
            <>
              {" "}
              Packs last built {PACK_BUILT_LABEL} · {APP_VERSION_LABEL}
            </>
          ) : null}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-2">
          {!IS_PORTABLE && (
          <>
          <Link
            to="/download-offline"
            data-testid="download-portable"
            className="rounded-xl border-2 border-accent/40 bg-accent/10 px-3 py-2.5 text-left transition hover:border-accent hover:bg-accent/15"
          >
            <p className="text-sm font-bold">Offline APP</p>
            <p className="mt-0.5 break-all text-[11px] font-medium text-muted-fg">
              {DOWNLOAD_FILES.portable}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-fg">
              Small app zip · unzip then add avatar media ·{" "}
              {portableBytes != null ? formatPackSize(portableBytes) : "…"} ·{" "}
              {PACK_VERSION_LABEL}
              {PACK_BUILT_LABEL ? ` · ${PACK_BUILT_LABEL}` : ""}
            </p>
          </Link>
          <Link
            to="/download-offline"
            data-testid="download-avatars"
            className="rounded-xl border-2 border-accent/40 bg-accent/10 px-3 py-2.5 text-left transition hover:border-accent hover:bg-accent/15"
          >
            <p className="text-sm font-bold">Avatar media</p>
            <p className="mt-0.5 break-all text-[11px] font-medium text-muted-fg">
              {DOWNLOAD_FILES.avatars}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-fg">
              Pics + Ultra videos · unzip next to index.html ·{" "}
              {avatarsBytes != null ? formatPackSize(avatarsBytes) : "~400 MB"} ·{" "}
              {AVATARS_VERSION_LABEL}
              {AVATARS_BUILT_LABEL ? ` · ${AVATARS_BUILT_LABEL}` : ""}
            </p>
          </Link>
          </>
          )}
          <button
            type="button"
            onClick={handleDownloadJson}
            className="rounded-xl border-2 border-border bg-surface-2/60 px-3 py-2.5 text-left transition hover:border-accent/40"
          >
            <p className="text-sm font-bold">Classroom data</p>
            <p className="mt-0.5 text-[11px] font-medium text-muted-fg">
              {dataBackupFilename()} · points & skills only
            </p>
          </button>
          {!IS_PORTABLE && (
          <>
          <a
            href={DOWNLOAD_HREFS.code}
            download={DOWNLOAD_FILES.code}
            className="rounded-xl border-2 border-border bg-surface-2/60 px-3 py-2.5 text-left transition hover:border-accent/40"
          >
            <p className="text-sm font-bold">Code only</p>
            <p className="mt-0.5 break-all text-[11px] font-medium text-muted-fg">
              {DOWNLOAD_FILES.code}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-fg">
              Source archive · small · no avatars · {APP_VERSION_LABEL}
            </p>
          </a>
          <a
            href={DOWNLOAD_HREFS.apk}
            download={DOWNLOAD_FILES.apk}
            className="rounded-xl border-2 border-accent/40 bg-accent/10 px-3 py-2.5 text-left transition hover:border-accent hover:bg-accent/15 sm:col-span-2"
          >
            <p className="text-sm font-bold">Android APK</p>
            <p className="mt-0.5 break-all text-[11px] font-medium text-muted-fg">
              {DOWNLOAD_FILES.apk}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-fg">
              Sideload on a tablet · {APK_VERSION_LABEL}
            </p>
          </a>
          </>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="ghost" className="gap-1.5" onClick={handleCopyJson}>
            <Copy className="size-3.5" />
            Copy data
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="size-3.5" />
            Restore data
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleRestoreFile(f);
              e.target.value = "";
            }}
          />
          {!IS_PORTABLE && (
          <Button size="sm" variant="ghost" onClick={() => setDataOpen(true)}>
            Data + images pack
          </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5"
            onClick={() => setCompactOpen(true)}
            disabled={eventCount === 0}
            title={`${eventCount} history entries`}
          >
            <Shrink className="size-3.5" />
            Compress
          </Button>
        </div>

        {locals.length > 0 && (
          <div className="rounded-xl border border-border bg-surface-2/50 p-2.5">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-fg">
              Recent on this device (last 3)
            </p>
            <ul className="space-y-1">
              {locals.slice(0, 3).map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm"
                >
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-semibold">{m.label}</span>
                    <span className="ml-1.5 text-[11px] text-muted-fg">
                      {formatRelative(m.savedAt)} · {m.studentCount} students
                    </span>
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-8"
                    onClick={() => restoreLocal(m.id)}
                  >
                    Restore
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Dialog open={!!pendingFile} onOpenChange={(o) => !o && setPendingFile(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Restore backup</DialogTitle>
              <DialogDescription>
                <strong className="text-fg">{pendingFile?.name ?? "backup"}</strong>
                {" — "}
                Merge keeps what you have. Replace overwrites everything.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row">
              <Button type="button" variant="ghost" onClick={() => setPendingFile(null)}>
                Cancel
              </Button>
              <Button type="button" variant="secondary" onClick={confirmMerge}>
                Merge
              </Button>
              <Button type="button" variant="destructive" onClick={confirmReplace}>
                Replace all
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={compactOpen} onOpenChange={setCompactOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Compress old awards?</DialogTitle>
              <DialogDescription>
                Awards older than 14 days become one total per student.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-3 rounded-xl border border-border bg-surface-2/60 px-3 py-2 text-sm">
              {compactPreview.removed === 0 ? (
                <p className="text-muted-fg">Nothing older than 14 days.</p>
              ) : (
                <p>
                  <span className="font-bold tabular-nums">{compactPreview.before}</span>
                  {" → "}
                  <span className="font-bold tabular-nums text-accent">
                    {compactPreview.after}
                  </span>
                  {" entries"}
                </p>
              )}
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={() => setCompactOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={runCompress}
                disabled={compactPreview.removed === 0}
              >
                Compress
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={dataOpen} onOpenChange={setDataOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Full pack</DialogTitle>
              <DialogDescription>
                Opens the portable export page with your current data staged.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={() => setDataOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setDataOpen(false);
                  buildDataKit();
                }}
              >
                Open export
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export function saveDataBackupNow(): boolean {
  try {
    const data = useClassStore.getState().exportBackup();
    downloadJson(
      data,
      `classnest-backup-${new Date().toISOString().slice(0, 10)}.json`,
    );
    pushLocalBackup(data);
    markBackupDone();
    return true;
  } catch {
    return false;
  }
}
