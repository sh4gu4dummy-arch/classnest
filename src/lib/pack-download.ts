import { saveBlobToDevice, type SaveResult } from "@/lib/save-file";

export type PackKind = "portable" | "avatars" | "code" | "apk";

export type PackMeta = {
  kind: PackKind;
  file: string;
  bytes: number;
  chunkSize: number;
};

export type PackProgress = {
  received: number;
  total: number;
};

const CHUNK = 2 * 1024 * 1024;

export function formatPackSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(bytes >= 100 * 1024 * 1024 ? 0 : 1)} MB`;
}

export async function fetchPackMeta(kind: PackKind): Promise<PackMeta> {
  const res = await fetch(`/api/pack-download?kind=${encodeURIComponent(kind)}`);
  if (!res.ok) throw new Error(`Could not read pack (${res.status})`);
  return res.json() as Promise<PackMeta>;
}

type PickerWindow = Window & {
  showSaveFilePicker?: (opts: {
    suggestedName?: string;
    types?: { description: string; accept: Record<string, string[]> }[];
  }) => Promise<FileSystemFileHandle>;
};

/**
 * Open a disk file NOW, while the click is still a user gesture.
 * Instant AbortError = picker blocked (iframe) — not a user cancel.
 */
export async function openZipWritable(
  filename: string,
): Promise<{ writable: FileSystemWritableFileStream | null; cancelled: boolean }> {
  const w = window as PickerWindow;
  if (typeof w.showSaveFilePicker !== "function") {
    return { writable: null, cancelled: false };
  }
  const started = Date.now();
  try {
    const handle = await w.showSaveFilePicker({
      suggestedName: filename,
      types: [
        {
          description: "ClassNest zip",
          accept: { "application/zip": [".zip"] },
        },
      ],
    });
    return { writable: await handle.createWritable(), cancelled: false };
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    if (name === "AbortError" && Date.now() - started > 400) {
      return { writable: null, cancelled: true };
    }
    return { writable: null, cancelled: false };
  }
}

async function fetchChunk(
  kind: PackKind,
  offset: number,
  limit: number,
  signal?: AbortSignal,
): Promise<ArrayBuffer> {
  let last: unknown;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const url =
        `/api/pack-download?kind=${encodeURIComponent(kind)}` +
        `&offset=${offset}&limit=${limit}`;
      const res = await fetch(url, { signal, cache: "no-store" });
      if (!res.ok) throw new Error(`chunk ${offset} HTTP ${res.status}`);
      return await res.arrayBuffer();
    } catch (err) {
      if (signal?.aborted) throw err;
      last = err;
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  throw last instanceof Error ? last : new Error("chunk failed");
}

export type PackDownloadResult =
  | { ok: true; method: "picker"; file: string }
  | { ok: true; method: "blob"; file: string; blob: Blob }
  | { ok: false; reason: "cancelled" };

/**
 * Pull the pack in small slices (preview proxy 502s on the full 400 MB zip).
 * Pass `writable` from openZipWritable() so bytes go straight to disk.
 */
export async function downloadPack(
  kind: PackKind,
  opts: {
    writable?: FileSystemWritableFileStream | null;
    onProgress?: (p: PackProgress) => void;
    signal?: AbortSignal;
  } = {},
): Promise<PackDownloadResult> {
  const meta = await fetchPackMeta(kind);
  const { signal, writable } = opts;
  const parts: ArrayBuffer[] = [];
  let received = 0;
  opts.onProgress?.({ received: 0, total: meta.bytes });

  for (let offset = 0; offset < meta.bytes; offset += CHUNK) {
    if (signal?.aborted) {
      if (writable) {
        try {
          await writable.abort();
        } catch {
          /* ignore */
        }
      }
      return { ok: false, reason: "cancelled" };
    }
    const limit = Math.min(CHUNK, meta.bytes - offset);
    const buf = await fetchChunk(kind, offset, limit, signal);
    if (writable) await writable.write(buf);
    else parts.push(buf);
    received += buf.byteLength;
    opts.onProgress?.({ received, total: meta.bytes });
  }

  if (writable) {
    await writable.close();
    return { ok: true, method: "picker", file: meta.file };
  }

  return {
    ok: true,
    method: "blob",
    file: meta.file,
    blob: new Blob(parts, { type: "application/zip" }),
  };
}

export async function savePackBlob(blob: Blob, filename: string): Promise<SaveResult> {
  return saveBlobToDevice(blob, filename);
}
