import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { EXPORT_STORAGE_KEY } from "@/lib/export-keys";

export const Route = createFileRoute("/export-kit")({
  component: ExportKitPage,
  head: () => ({
    meta: [{ title: "Save ClassNest kit" }],
  }),
});

function ExportKitPage() {
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error" | "empty">("idle");
  const [message, setMessage] = useState("");
  const [filename, setFilename] = useState("");
  const [manualUrl, setManualUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (manualUrl) URL.revokeObjectURL(manualUrl);
    };
  }, [manualUrl]);

  async function runExport() {
    setStatus("working");
    setMessage("");
    try {
      const raw = sessionStorage.getItem(EXPORT_STORAGE_KEY);
      if (!raw) {
        setStatus("empty");
        setMessage("No backup found. Go home, tap “Save portable kit”, then come back.");
        return;
      }

      // Server builds ZIP with Content-Disposition — real HTTP download
      const res = await fetch("/api/export-portable", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: raw,
      });
      if (!res.ok) throw new Error(`Export failed (${res.status})`);

      const blob = await res.blob();
      const day = new Date().toISOString().slice(0, 10);
      const name = `classnest-portable-${day}.zip`;
      setFilename(name);

      // Prefer system Save dialog (Brave supports this outside restricted iframes)
      const w = window as Window & {
        showSaveFilePicker?: (o: {
          suggestedName?: string;
          types?: { description: string; accept: Record<string, string[]> }[];
        }) => Promise<FileSystemFileHandle>;
      };
      if (typeof w.showSaveFilePicker === "function") {
        try {
          const handle = await w.showSaveFilePicker({
            suggestedName: name,
            types: [{ description: "ZIP", accept: { "application/zip": [".zip"] } }],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          setStatus("done");
          setMessage(`Saved as ${name}. Open that folder in Finder/Explorer to confirm.`);
          return;
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") {
            setStatus("idle");
            setMessage("Cancelled — press the green button to try again.");
            return;
          }
        }
      }

      // Fallback: real <a download> on this full page
      if (manualUrl) URL.revokeObjectURL(manualUrl);
      const url = URL.createObjectURL(blob);
      setManualUrl(url);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setStatus("done");
      setMessage(
        `Browser download started for ${name}. If the file is missing, use the blue button below or check brave://downloads.`,
      );
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Export failed");
    }
  }

  return (
    <main className="grid min-h-[100dvh] place-items-center bg-bg px-4 py-10 text-fg">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-5 rounded-2xl border-2 border-accent/30 bg-surface p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-fg">
            <Package className="size-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-fg">Step 2 of 2</p>
            <h1 className="text-lg font-bold">Download your kit</h1>
          </div>
        </div>

        <p className="text-sm text-muted-fg">
          This is a normal page (not the chat box), so Brave can save the ZIP to your computer.
        </p>

        <button
          type="button"
          disabled={status === "working"}
          onClick={() => void runExport()}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-positive text-base font-bold text-positive-fg shadow-md transition hover:opacity-95 disabled:opacity-60"
        >
          <Download className="size-5" />
          {status === "working" ? "Building ZIP…" : "Download ZIP now"}
        </button>

        {manualUrl && filename && (
          <a
            href={manualUrl}
            download={filename}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-sm font-bold text-accent-fg"
          >
            Still nothing? Tap to save {filename}
          </a>
        )}

        {message && (
          <p
            className={
              status === "error" || status === "empty"
                ? "rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm"
                : "rounded-xl border border-positive/30 bg-positive/10 px-3 py-2 text-sm"
            }
          >
            {message}
          </p>
        )}

        <div className="rounded-xl bg-surface-2 px-3 py-2 text-xs text-muted-fg">
          <p className="font-semibold text-fg">Look for</p>
          <p className="mt-1 font-mono text-fg">classnest-portable-….zip</p>
          <p className="mt-1">Brave menu → Downloads, or type brave://downloads in the address bar.</p>
        </div>

        <Button asChild variant="ghost" className="w-full gap-2">
          <Link to="/">
            <ArrowLeft className="size-4" />
            Back to classes
          </Link>
        </Button>
      </div>
    </main>
  );
}
