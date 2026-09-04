import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { existsSync, readFileSync, statSync } from "node:fs";
import { open } from "node:fs/promises";
import { join, resolve } from "node:path";

/**
 * Finish PGLite bootstrap during dev-server setup (before traffic). Vite awaits
 * async `configureServer` hooks. Production: `src/lib/db` kicks `ensureDbReady`
 * on import.
 */
function pgliteBootstrapPlugin(): Plugin {
  return {
    name: "app-builder:pglite-bootstrap",
    apply: "serve",
    async configureServer(server) {
      try {
        const mod = (await server.ssrLoadModule("/src/lib/db.ts")) as {
          ensureDbReady?: () => Promise<void>;
        };
        if (typeof mod.ensureDbReady === "function") {
          await mod.ensureDbReady();
        }
      } catch (err) {
        console.error("[app-builder] DB bootstrap failed:", err);
        throw err;
      }
    },
  };
}

/**
 * Live-preview OAuth popup — handled HERE so the agent never has to create a
 * `/auth/popup` route (and cannot break it by scaffolding a React page that
 * paints the full app shell in the popup).
 *
 * `signIn` (client.ts) opens `/auth/popup?providerId=…` in a top-level window.
 * This middleware runs before TanStack Start, calls `handleAuthPopupRequest`,
 * and returns the 302 / completion HTML. Deployed apps do not use the popup
 * (full-page OAuth redirect), so `apply: "serve"` is enough.
 */
function authPopupPlugin(): Plugin {
  return {
    name: "app-builder:auth-popup",
    apply: "serve",
    configureServer(server) {
      // Register immediately (not in a returned post-hook) so we run BEFORE
      // TanStack Start / the SPA HTML fallback. A model-authored
      // `src/routes/auth/popup.tsx` React page must never win this path.
      server.middlewares.use(async (req, res, next) => {
        try {
          const rawUrl = req.url ?? "";
          const pathOnly = rawUrl.split("?", 1)[0] ?? "";
          if (pathOnly !== "/auth/popup") {
            next();
            return;
          }
          if ((req.method ?? "GET").toUpperCase() !== "GET") {
            res.statusCode = 405;
            res.setHeader("content-type", "text/plain; charset=utf-8");
            res.end("Method Not Allowed");
            return;
          }

          const host = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost:8080");
          const proto = String(
            req.headers["x-forwarded-proto"] ??
              ((req.socket as { encrypted?: boolean } | undefined)?.encrypted ? "https" : "http"),
          );
          const requestHeaders = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (value === undefined) continue;
            if (Array.isArray(value)) {
              for (const v of value) requestHeaders.append(key, v);
            } else {
              requestHeaders.set(key, value);
            }
          }
          // Ensure Host is the public preview host so Better Auth's dynamic
          // baseURL / redirect_uri match the popup origin.
          if (!requestHeaders.has("host")) requestHeaders.set("host", host);

          const request = new Request(`${proto}://${host}${rawUrl}`, {
            method: "GET",
            headers: requestHeaders,
          });

          const mod = (await server.ssrLoadModule("/src/lib/auth/popup.server.ts")) as {
            handleAuthPopupRequest: (req: Request) => Promise<Response>;
          };
          const response = await mod.handleAuthPopupRequest(request);

          res.statusCode = response.status;
          // Preserve multiple Set-Cookie headers (OAuth state + session).
          const setCookies =
            typeof response.headers.getSetCookie === "function"
              ? response.headers.getSetCookie()
              : [];
          response.headers.forEach((value, key) => {
            if (key.toLowerCase() === "set-cookie") return;
            res.setHeader(key, value);
          });
          for (const cookie of setCookies) {
            res.appendHeader("set-cookie", cookie);
          }
          const body = Buffer.from(await response.arrayBuffer());
          res.end(body);
        } catch (err) {
          console.error("[app-builder] /auth/popup handler failed:", err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("content-type", "text/plain; charset=utf-8");
            res.end("auth popup failed");
          }
        }
      });
    },
  };
}

const PACK_KINDS = new Set(["portable", "avatars", "code", "apk"]);
const PACK_MAX_CHUNK = 4 * 1024 * 1024;

function attachPackDownload(middlewares: {
  use: (fn: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: () => void) => void) => void;
}) {
  middlewares.use((req, res, next) => {
    const rawUrl = req.url ?? "";
    const pathOnly = rawUrl.split("?", 1)[0] ?? "";
    if (pathOnly !== "/api/pack-download") {
      next();
      return;
    }
    if ((req.method ?? "GET").toUpperCase() !== "GET") {
      res.statusCode = 405;
      res.end("Method Not Allowed");
      return;
    }
    void (async () => {
      try {
        const url = new URL(rawUrl, "http://127.0.0.1");
        const kind = url.searchParams.get("kind") ?? "";
        if (!PACK_KINDS.has(kind)) {
          res.statusCode = 400;
          res.end("Unknown pack");
          return;
        }
        const downloads = resolve(join(process.cwd(), "public", "downloads"));
        const manifest = JSON.parse(
          readFileSync(join(downloads, "manifest.json"), "utf8"),
        ) as { files?: Record<string, { file?: string }> };
        const file = manifest.files?.[kind]?.file;
        if (!file || file.includes("..") || file.includes("/") || file.includes("\\")) {
          res.statusCode = 404;
          res.end("Pack missing");
          return;
        }
        const full = resolve(join(downloads, file));
        if (!full.startsWith(downloads) || !existsSync(full)) {
          res.statusCode = 404;
          res.end("Pack missing");
          return;
        }
        const bytes = statSync(full).size;
        const offsetRaw = url.searchParams.get("offset");
        if (offsetRaw == null) {
          const body = Buffer.from(
            JSON.stringify({
              kind,
              file,
              bytes,
              chunkSize: 4 * 1024 * 1024,
            }),
          );
          res.statusCode = 200;
          res.setHeader("content-type", "application/json; charset=utf-8");
          res.setHeader("cache-control", "no-store");
          res.setHeader("content-length", String(body.byteLength));
          res.end(body);
          return;
        }
        const offset = Number(offsetRaw);
        const limit = Math.min(
          PACK_MAX_CHUNK,
          Math.max(1, Number(url.searchParams.get("limit") ?? PACK_MAX_CHUNK)),
        );
        if (!Number.isFinite(offset) || offset < 0 || offset > bytes) {
          res.statusCode = 400;
          res.end("Bad offset");
          return;
        }
        const length = Math.min(limit, bytes - offset);
        const fh = await open(full, "r");
        try {
          const buf = Buffer.alloc(length);
          const { bytesRead } = await fh.read(buf, 0, length, offset);
          const slice = buf.subarray(0, bytesRead);
          res.statusCode = 200;
          res.setHeader("content-type", "application/octet-stream");
          res.setHeader("cache-control", "no-store");
          res.setHeader("content-length", String(slice.byteLength));
          res.setHeader("x-pack-filename", file);
          res.setHeader("x-pack-total", String(bytes));
          res.setHeader("x-pack-offset", String(offset));
          res.end(slice);
        } finally {
          await fh.close();
        }
      } catch (err) {
        console.error("[classnest] pack-download failed:", err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end("pack download failed");
        }
      }
    })();
  });
}

// `0.0.0.0:8080` is the live-preview contract — don't change host/port.
// Keep `nitro` gated to `build` (the Vercel deploy target): enabled in dev it
// opens a second dev-server port, which breaks the single-port preview.
// The dev server starts once `src/router.tsx` and `src/routes/` exist — see
// AGENTS.md § "First scaffold".
export default defineConfig(({ command }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    pgliteBootstrapPlugin(),
    // Before tanstackStart so /auth/popup never falls through to the SPA.
    authPopupPlugin(),
    {
      name: "classnest-pack-download",
      apply: "serve" as const,
      configureServer(server) {
        attachPackDownload(server.middlewares);
      },
    },
    tailwindcss(),
    tanstackStart(),
    ...(command === "build" ? [nitro({ preset: "vercel" })] : []),
    viteReact(),
  ],
}));
