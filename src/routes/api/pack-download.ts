import { createFileRoute } from "@tanstack/react-router";
import { existsSync, readFileSync, statSync } from "node:fs";
import { open } from "node:fs/promises";
import { join, resolve } from "node:path";

const MAX_CHUNK = 4 * 1024 * 1024;
const KINDS = new Set(["portable", "avatars", "code", "apk"]);

type ManifestFile = { file?: string };
type Manifest = { files?: Record<string, ManifestFile> };

function packPath(kind: string) {
  const downloads = resolve(join(process.cwd(), "public", "downloads"));
  const raw = readFileSync(join(downloads, "manifest.json"), "utf8");
  const manifest = JSON.parse(raw) as Manifest;
  const file = manifest.files?.[kind]?.file;
  if (!file || file.includes("..") || file.includes("/") || file.includes("\\")) {
    return null;
  }
  const full = resolve(join(downloads, file));
  if (!full.startsWith(downloads) || !existsSync(full)) return null;
  return { file, full, bytes: statSync(full).size };
}

export const Route = createFileRoute("/api/pack-download")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const kind = url.searchParams.get("kind") ?? "";
        if (!KINDS.has(kind)) {
          return new Response("Unknown pack", { status: 400 });
        }
        const pack = packPath(kind);
        if (!pack) return new Response("Pack missing", { status: 404 });

        const offsetRaw = url.searchParams.get("offset");
        if (offsetRaw == null) {
          return Response.json({
            kind,
            file: pack.file,
            bytes: pack.bytes,
            chunkSize: 4 * 1024 * 1024,
          });
        }

        const offset = Number(offsetRaw);
        const limit = Math.min(
          MAX_CHUNK,
          Math.max(1, Number(url.searchParams.get("limit") ?? MAX_CHUNK)),
        );
        if (!Number.isFinite(offset) || offset < 0 || offset > pack.bytes) {
          return new Response("Bad offset", { status: 400 });
        }
        const length = Math.min(limit, pack.bytes - offset);
        const fh = await open(pack.full, "r");
        try {
          const buf = Buffer.alloc(length);
          const { bytesRead } = await fh.read(buf, 0, length, offset);
          return new Response(buf.subarray(0, bytesRead), {
            headers: {
              "content-type": "application/octet-stream",
              "content-length": String(bytesRead),
              "cache-control": "no-store",
              "x-pack-filename": pack.file,
              "x-pack-total": String(pack.bytes),
              "x-pack-offset": String(offset),
            },
          });
        } finally {
          await fh.close();
        }
      },
    },
  },
});
