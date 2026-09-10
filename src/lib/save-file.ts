/**
 * Best-effort file save for embedded previews + normal browsers.
 * Prefers the system “Save as” picker (works when iframe download is blocked).
 */

export type SaveResult =
  | { ok: true; method: "picker" | "anchor" | "open" }
  | { ok: false; reason: "cancelled" | "blocked" };

function extensionOf(filename: string) {
  const i = filename.lastIndexOf(".");
  return i >= 0 ? filename.slice(i).toLowerCase() : "";
}

function mimeFor(filename: string) {
  const ext = extensionOf(filename);
  if (ext === ".json") return "application/json";
  if (ext === ".zip") return "application/zip";
  return "application/octet-stream";
}

export async function saveBlobToDevice(blob: Blob, filename: string): Promise<SaveResult> {
  // 1) Native Save As — most reliable when “download” is blocked in an iframe
  const w = window as Window & {
    showSaveFilePicker?: (opts: {
      suggestedName?: string;
      types?: { description: string; accept: Record<string, string[]> }[];
    }) => Promise<FileSystemFileHandle>;
  };

  if (typeof w.showSaveFilePicker === "function") {
    const started = Date.now();
    try {
      const ext = extensionOf(filename) || ".bin";
      const handle = await w.showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: "ClassNest export",
            accept: { [mimeFor(filename)]: [ext] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return { ok: true, method: "picker" };
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      // User closed a visible dialog (took time). Instant AbortError = blocked iframe.
      if (name === "AbortError" && Date.now() - started > 400) {
        return { ok: false, reason: "cancelled" };
      }
    }
  }

  // 2) Classic <a download>
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    return { ok: true, method: "anchor" };
  } catch {
    /* continue */
  }

  // 3) Open blob in a new tab — user can use browser Save / Share
  try {
    const url = URL.createObjectURL(blob);
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 120_000);
    if (opened) return { ok: true, method: "open" };
  } catch {
    /* continue */
  }

  return { ok: false, reason: "blocked" };
}
