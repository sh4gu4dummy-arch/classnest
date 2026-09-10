import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  APP_VERSION_LABEL,
  AVATARS_BUILT_LABEL,
  AVATARS_VERSION_LABEL,
  PACK_BUILT_LABEL,
  PACK_VERSION_LABEL,
} from "@/lib/app-version";
import {
  downloadPack,
  fetchPackMeta,
  formatPackSize,
  openZipWritable,
  savePackBlob,
  type PackKind,
  type PackMeta,
} from "@/lib/pack-download";

export const Route = createFileRoute("/download-offline")({
  component: DownloadOfflinePage,
  head: () => ({
    meta: [{ title: "Save ClassNest Offline APP" }],
  }),
});

type Phase = "idle" | "downloading" | "ready" | "done" | "error";

function PackSaver({
  kind,
  title,
  blurb,
  versionLabel,
  builtLabel,
  testId,
}: {
  kind: PackKind;
  title: string;
  blurb: string;
  versionLabel: string;
  builtLabel?: string;
  testId: string;
}) {
  const [meta, setMeta] = useState<PackMeta | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState("");
  const [received, setReceived] = useState(0);
  const [readyBlob, setReadyBlob] = useState<Blob | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchPackMeta(kind)
      .then(setMeta)
      .catch(() => setMessage("Could not find that zip yet."));
    return () => abortRef.current?.abort();
  }, [kind]);

  const total = meta?.bytes ?? 0;
  const filename = meta?.file ?? `${kind}.zip`;
  const pct = total > 0 ? Math.min(100, Math.round((100 * received) / total)) : 0;

  async function saveReady() {
    if (!readyBlob) return;
    setMessage("Saving…");
    const saved = await savePackBlob(readyBlob, filename);
    if (!saved.ok) {
      if (saved.reason === "cancelled") {
        setMessage("Cancelled — tap Save zip to try again.");
        return;
      }
      setPhase("error");
      setMessage("Browser blocked the save. Try Chrome or Edge.");
      return;
    }
    setPhase("done");
    setMessage(`Saved ${filename}.`);
  }

  async function start() {
    if (!meta) return;
    if (phase === "ready") {
      await saveReady();
      return;
    }
    if (phase === "downloading") {
      abortRef.current?.abort();
      return;
    }

    const sink = await openZipWritable(filename);
    if (sink.cancelled) {
      setMessage("Cancelled.");
      return;
    }

    const ac = new AbortController();
    abortRef.current = ac;
    setPhase("downloading");
    setReceived(0);
    setMessage(sink.writable ? "Saving straight to disk…" : "Fetching in small pieces…");

    try {
      const result = await downloadPack(kind, {
        writable: sink.writable,
        signal: ac.signal,
        onProgress: (p) => setReceived(p.received),
      });
      if (!result.ok) {
        setPhase("idle");
        setMessage("Cancelled.");
        return;
      }
      if (result.method === "picker") {
        setPhase("done");
        setMessage(`Saved ${result.file}.`);
        return;
      }
      setReadyBlob(result.blob);
      setPhase("ready");
      setMessage("Zip is ready. Tap Save zip — the browser needs that second click.");
    } catch (err) {
      console.error(err);
      setPhase("error");
      setMessage("Download failed. Keep this page open and retry.");
    } finally {
      abortRef.current = null;
    }
  }

  return (
    <section className="rounded-2xl border-2 border-border bg-surface px-4 py-4">
      <h2 className="text-lg font-black tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-fg">{blurb}</p>
      <p className="mt-1 break-all text-[11px] font-medium text-muted-fg">
        {filename}
        {meta ? ` · ${formatPackSize(meta.bytes)}` : ""}
        {builtLabel ? ` · ${builtLabel}` : ""} · {versionLabel}
      </p>

      {(phase === "downloading" || received > 0) && total > 0 && phase !== "done" && (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs font-semibold tabular-nums">
            <span>
              {formatPackSize(received)} / {formatPackSize(total)}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-accent/20">
            <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {message ? (
        <p className="mt-3 rounded-xl border border-border bg-surface-2/60 px-3 py-2 text-sm">
          {message}
        </p>
      ) : null}

      <Button
        size="lg"
        className="mt-3 h-11 w-full gap-2"
        disabled={!meta || phase === "done"}
        onClick={() => void start()}
        data-testid={testId}
      >
        <Download className="size-5" />
        {phase === "downloading"
          ? "Cancel"
          : phase === "ready"
            ? "Save zip now"
            : phase === "done"
              ? "Saved"
              : `Save ${title}`}
      </Button>
    </section>
  );
}

function DownloadOfflinePage() {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-lg flex-col gap-5 px-4 py-8">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-fg hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          Home
        </Link>
        <ThemeToggle />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-accent">
          ClassNest {APP_VERSION_LABEL}
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight">Offline downloads</h1>
        <p className="mt-2 text-sm text-muted-fg">
          Split so app updates stay small. Avatar pictures and videos are a
          one-time pack you copy into the avatars folder.
        </p>
      </div>

      <PackSaver
        kind="portable"
        title={`Offline APP ${PACK_VERSION_LABEL}`}
        blurb="The program. Unzip, then add Avatar media into the avatars folder. Re-download this when the app updates."
        versionLabel={PACK_VERSION_LABEL}
        builtLabel={PACK_BUILT_LABEL}
        testId="save-offline-app"
      />
      <PackSaver
        kind="avatars"
        title={`Avatar media ${AVATARS_VERSION_LABEL}`}
        blurb="All character pictures and Ultra videos (~400 MB). Unzip into the same folder as index.html. Skip this on later app-only updates."
        versionLabel={AVATARS_VERSION_LABEL}
        builtLabel={AVATARS_BUILT_LABEL}
        testId="save-avatar-media"
      />

      <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-fg">
        <li>Save Offline APP. Unzip it all the way.</li>
        <li>
          Save Avatar media (first time, or when we add characters). Unzip it
          into that same folder so you get avatars/kids, avatars/teens, avatars/ultra.
        </li>
        <li>Double-click Start-ClassNest.bat (Windows) or Start-ClassNest.command (Mac).</li>
        <li>Later app updates: only step 1. Keep your existing avatars folder.</li>
      </ol>
    </main>
  );
}
