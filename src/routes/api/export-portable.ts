import { createFileRoute } from "@tanstack/react-router";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { putExport, takeExport } from "@/lib/export-store.server";

async function addFolder(
  zip: JSZip,
  folderName: string,
  dir: string,
  exts: string[],
) {
  const folder = zip.folder(folderName);
  if (!folder) return;
  try {
    const files = await readdir(dir);
    for (const name of files) {
      const ok =
        exts.some((e) => name.endsWith(e)) || name === "manifest.json";
      if (!ok) continue;
      try {
        const buf = await readFile(path.join(dir, name));
        folder.file(name, buf);
      } catch {
        /* skip */
      }
    }
  } catch {
    /* optional pack */
  }
}

async function buildPortableZip(backup: unknown): Promise<Uint8Array> {
  const zip = new JSZip();
  zip.file("classnest-backup.json", JSON.stringify(backup, null, 2));
  zip.file(
    "README.txt",
    [
      "ClassNest portable kit",
      "======================",
      "",
      "classnest-backup.json — classes, students, skills, points, shop & spar",
      "avatars/kids/ — 40 kid mascot images",
      "avatars/teens/ — 40 teen power-character images (kept)",
      "avatars/ultra/ — 20 Imagine legends × 3 evolution stages each",
      "celebrations/ — evolution GIF tiers (kids + teens)",
      "",
      "Evolution: every 10 points a student levels up.",
      "Ultra: real art morphs Hatchling → Adolescent → Legend (at 10 & 20 pts).",
      "Spar: bet points; higher score = higher win chance; winner steals.",
      "Shop: shields, stars, banners, frames, nest decor.",
      "",
      "Restore: ClassNest → Backup → Restore",
      "",
    ].join("\n"),
  );

  const avatarRoot = path.join(process.cwd(), "public", "avatars");
  await addFolder(zip, "avatars/kids", path.join(avatarRoot, "kids"), [".jpg"]);
  await addFolder(zip, "avatars/teens", path.join(avatarRoot, "teens"), [".jpg"]);
  await addFolder(zip, "avatars/ultra", path.join(avatarRoot, "ultra"), [".jpg"]);
  await addFolder(
    zip,
    "celebrations",
    path.join(process.cwd(), "public", "celebrations"),
    [".gif"],
  );

  const legacy = zip.folder("avatars");
  if (legacy) {
    try {
      const kidsDir = path.join(avatarRoot, "kids");
      const files = await readdir(kidsDir);
      for (const name of files) {
        if (!name.endsWith(".jpg")) continue;
        const n = parseInt(name, 10);
        if (n >= 1 && n <= 20) {
          const buf = await readFile(path.join(kidsDir, name));
          legacy.file(name, buf);
        }
      }
    } catch {
      /* ignore */
    }
  }

  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
}

export const Route = createFileRoute("/api/export-portable")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const backup = await request.json();
          const zip = await buildPortableZip(backup);
          const day = new Date().toISOString().slice(0, 10);
          const filename = `classnest-portable-${day}.zip`;
          const wantLink = request.headers.get("x-want-link") === "1";

          if (wantLink) {
            const id = putExport(zip, filename);
            return new Response(
              JSON.stringify({
                downloadUrl: `/api/export-portable?id=${encodeURIComponent(id)}`,
                filename,
                size: zip.byteLength,
              }),
              { headers: { "content-type": "application/json" } },
            );
          }

          return new Response(Buffer.from(zip), {
            headers: {
              "content-type": "application/zip",
              "content-disposition": `attachment; filename="${filename}"`,
            },
          });
        } catch (e) {
          console.error(e);
          return new Response(JSON.stringify({ error: "Export failed" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        if (!id) {
          return new Response("Missing id", { status: 400 });
        }
        const entry = takeExport(id);
        if (!entry) {
          return new Response("Not found", { status: 404 });
        }
        return new Response(Buffer.from(entry.data), {
          headers: {
            "content-type": "application/zip",
            "content-disposition": `attachment; filename="${entry.filename}"`,
          },
        });
      },
    },
  },
});
