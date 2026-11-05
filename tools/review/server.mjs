#!/usr/bin/env node
// ClassNest local preview + art review server. No dependencies.
//   node server.mjs            (PORT=8931 HOST=127.0.0.1 by default)
// Review sets:
//   - sets/<id>/set.json  (hand-made: groups + items; images in that folder or "root")
//   - sets/<id>/set.json with "auto": true  (every image/video under "root", grouped by subfolder)
//   - one generated set per Ultra, read live from the repo clone (stills, Home film, scrub stills)
// Verdicts backup: verdicts.json (browser localStorage is the primary store).
// /app/  = the ClassNest app itself (app-build/, base "/app/"; media from the repo's public/).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const SETS = path.join(DIR, "sets");
const VERDICTS = path.join(DIR, "verdicts.json");
const APP = path.join(DIR, "app-build");
const REPO = process.env.REPO || "/workspace/classnest-audit";
const PUBLIC = path.join(REPO, "public");
const ULTRA = path.join(PUBLIC, "avatars", "ultra");
const PORT = Number(process.env.PORT || 8931);
const HOST = process.env.HOST || "127.0.0.1";
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".gif": "image/gif", ".mp4": "video/mp4", ".webm": "video/webm", ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8", ".woff2": "font/woff2", ".woff": "font/woff", ".mp3": "audio/mpeg", ".wav": "audio/wav",
  ".ico": "image/x-icon", ".webmanifest": "application/manifest+json" };
const MEDIA = /\.(jpe?g|png|webp|gif|mp4|webm)$/i;

function readJSON(p, fb) { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return fb; } }
const exists = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };
const pad = (n) => String(n).padStart(2, "0");

// ---- Art stamps: content hash per media file, cached by path+size+mtime ----
const stampCache = new Map();
function stampOf(full) {
  let st; try { st = fs.statSync(full); } catch { return undefined; }
  if (!st.isFile()) return undefined;
  const ck = `${st.size}:${st.mtimeMs}`, hit = stampCache.get(full);
  if (hit && hit.ck === ck) return hit.h;
  const h = crypto.createHash("sha1").update(fs.readFileSync(full)).digest("hex").slice(0, 12);
  stampCache.set(full, { ck, h }); return h;
}
// The file an item's stamp is taken from: url (site path under the repo's public/) or file under the set root.
function itemPath(set, it) {
  if (it.url) return it.url.startsWith("/") && !it.url.startsWith("/app/") ? safeJoin(PUBLIC, it.url.slice(1).split("?")[0]) : null;
  return it.file ? safeJoin(setRoot(set), it.file) : null;
}
function addStamps(sets) {
  for (const s of sets) for (const it of s.items || []) { const f = itemPath(s, it); const h = f && stampOf(f); if (h) it.stamp = h; }
  return sets;
}

// ---- Generated sets: one per Ultra, live from the repo ----
function ultraSets() {
  let src = "";
  try { src = fs.readFileSync(path.join(REPO, "src/lib/avatars.ts"), "utf8"); } catch { return []; }
  const re = /ultra\(\s*(\d+),\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]*)"\s*\)/g;
  const out = [];
  for (const m of src.matchAll(re)) {
    const id = pad(m[1]), name = m[2], vibe = m[5];
    const items = [1, 2, 3].filter((s) => exists(path.join(ULTRA, `${id}-s${s}.jpg`))).map((s) => ({
      id: `s${s}`, group: "stages", title: ["Hatchling (s1)", "Adolescent (s2)", "Legend (s3)"][s - 1],
      file: `${id}-s${s}.jpg`, thumb: exists(path.join(ULTRA, "board", `${id}-s${s}.jpg`)) ? `board/${id}-s${s}.jpg` : undefined,
    }));
    if (exists(path.join(ULTRA, "homes", `${id}.mp4`)))
      items.push({ id: "home-film", group: "home", title: "Home film", file: `homes/${id}.mp4`, kind: "video",
        poster: exists(path.join(ULTRA, "homes", `${id}.jpg`)) ? `homes/${id}.jpg` : undefined });
    const sd = path.join(ULTRA, "scrub", id, "home");
    let frames = [];
    try { frames = fs.readdirSync(sd).filter((f) => /\.jpg$/i.test(f)).sort(); } catch {}
    if (frames.length) {
      const pick = frames.filter((_, i) => i % 5 === 0 || i === frames.length - 1);
      for (const f of pick) items.push({ id: `scrub-${f.replace(/\.jpg$/i, "")}`, group: "scrub",
        title: `Scrub frame ${f.replace(/\.jpg$/i, "")} / ${frames.length}`, file: `scrub/${id}/home/${f}` });
    }
    out.push({
      id: `ultra-${id}`, kind: "ultra", num: Number(m[1]), name, title: `Ultra #${id} ${name}`, blurb: vibe,
      category: m[4], accent: m[3], root: ULTRA,
      cover: items.find((i) => i.id === "s3")?.thumb || items.find((i) => i.id === "s3")?.file,
      groups: [{ id: "stages", title: "Stages (in the app now)" }, { id: "home", title: "Home film" },
        { id: "scrub", title: `Home scrub stills (local only, every 5th of ${frames.length})` }],
      items,
    });
  }
  return out;
}

// ---- Auto sets: every image/video under root, grouped by subfolder ----
function autoItems(root) {
  const items = [], groups = [];
  const walk = (rel, depth) => {
    let names = [];
    try { names = fs.readdirSync(path.join(root, rel), { withFileTypes: true }); } catch { return; }
    const files = names.filter((d) => d.isFile() && MEDIA.test(d.name)).map((d) => d.name).sort();
    if (files.length) {
      const gid = rel ? rel.replace(/[^\w.-]+/g, "_") : "_root";
      groups.push({ id: gid, title: rel || "Drafts" });
      for (const f of files) {
        const file = rel ? `${rel}/${f}` : f;
        items.push({ id: file.replace(/[^\w.-]+/g, "__"), group: gid, title: f, file, kind: /\.(mp4|webm)$/i.test(f) ? "video" : undefined });
      }
    }
    if (depth < 3) for (const d of names.filter((d) => d.isDirectory() && !d.name.startsWith(".")).map((d) => d.name).sort())
      walk(rel ? `${rel}/${d}` : d, depth + 1);
  };
  walk("", 0);
  return { items, groups };
}

function fileSets() {
  if (!fs.existsSync(SETS)) return [];
  return fs.readdirSync(SETS).flatMap((d) => {
    const m = readJSON(path.join(SETS, d, "set.json"), null);
    if (!m) return [];
    m.id = m.id || d; m._dir = d; m.kind = m.kind || "review";
    if (m.auto) { const a = autoItems(setRoot(m)); m.items = [...(m.items || []), ...a.items]; m.groups = [...(m.groups || []), ...a.groups]; }
    if (!m.cover && m.items?.length) { const c = m.items.find((i) => i.id === m.coverItem) || m.items.find((i) => i.kind !== "video"); m.cover = c?.thumb || c?.file; }
    return [m];
  }).sort((a, b) => String(b.created || "").localeCompare(String(a.created || "")));
}
function loadSets() { return addStamps([...fileSets(), ...ultraSets()]); }
function setRoot(m) { return m.root ? path.resolve(m.root) : path.join(SETS, m._dir); }

function send(res, code, body, type = "application/json; charset=utf-8", extra = {}) {
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-cache", ...extra }); res.end(body);
}
function serveFile(req, res, full, onMissing) {
  fs.stat(full, (err, st) => {
    if (err || !st.isFile()) return onMissing ? onMissing() : send(res, 404, "Not found", "text/plain");
    const type = MIME[path.extname(full).toLowerCase()] || "application/octet-stream";
    const range = req.headers.range;
    if (range && /^bytes=\d*-\d*$/.test(range)) {
      const [s, e] = range.slice(6).split("-");
      let start = s ? Number(s) : st.size - Number(e); let end = s && e ? Number(e) : st.size - 1;
      start = Math.max(0, start); end = Math.min(end, st.size - 1);
      if (start > end) return send(res, 416, "", "text/plain", { "Content-Range": `bytes */${st.size}` });
      res.writeHead(206, { "Content-Type": type, "Content-Length": end - start + 1, "Content-Range": `bytes ${start}-${end}/${st.size}`, "Accept-Ranges": "bytes", "Cache-Control": "no-cache" });
      if (req.method === "HEAD") return res.end();
      return fs.createReadStream(full, { start, end }).pipe(res);
    }
    res.writeHead(200, { "Content-Type": type, "Content-Length": st.size, "Accept-Ranges": "bytes", "Cache-Control": "no-cache" });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(full).pipe(res);
  });
}
function safeJoin(root, rel) {
  const full = path.resolve(root, "." + path.sep + rel);
  return full === root || full.startsWith(root + path.sep) ? full : null;
}
function readBody(req) {
  return new Promise((ok, bad) => { let b = ""; req.on("data", (c) => { b += c; if (b.length > 2e6) { bad(new Error("too big")); req.destroy(); } }); req.on("end", () => ok(b)); req.on("error", bad); });
}
function saveVerdicts(all) {
  const tmp = VERDICTS + ".tmp"; fs.writeFileSync(tmp, JSON.stringify(all, null, 2) + "\n"); fs.renameSync(tmp, VERDICTS);
}
const strip = ({ _dir, root, ...m }) => m;
const KEY_RE = /^[\w.-]+\/[\w.-]+$/;
const HISTORY = path.join(DIR, "history.jsonl");
function appVersion() { try { return fs.readFileSync(path.join(REPO, "VERSION"), "utf8").trim(); } catch { return "?"; } }
// Always re-read verdicts.json right before a write (other workers edit it by hand), then write atomically.
function readVerdicts() { const v = readJSON(VERDICTS, { version: 1, items: {} }); v.items ||= {}; return v; }
function logHistory(rec) { try { fs.appendFileSync(HISTORY, JSON.stringify(rec) + "\n"); } catch {} }
function stampMap() { const m = new Map(); for (const s of loadSets()) for (const it of s.items || []) if (it.stamp) m.set(`${s.id}/${it.id}`, it.stamp); return m; }
function tombstone(have, at, sent, stamp) {
  const t = { cleared: true, updatedAt: at, stamp: stamp || have.stamp };
  if (sent && (have.vote || (have.comment || "").trim())) t.sent = { vote: have.vote ?? null, reasons: have.reasons || [], comment: have.comment || "", at };
  if (have.shipped) t.shipped = have.shipped;
  t.history = [{ at, reason: sent && t.sent ? `SENT ${t.sent.vote === "yes" ? "CONFIRM" : t.sent.vote === "no" ? "REMAKE" : t.sent.vote === "reject" ? "REJECT" : "COMMENT"}` : "cleared" }, ...(have.history || [])].slice(0, 20);
  return t;
}
// Entries whose stamp no longer matches the art become plain tombstones (the item goes back to "To review").
function dropStale() {
  const all = readVerdicts(), stamps = stampMap(); let changed = false;
  for (const [k, e] of Object.entries(all.items)) {
    const cur = stamps.get(k);
    if (cur && e.stamp && e.stamp !== cur) {
      const at = Date.now();
      logHistory({ at, key: k, action: "art changed", oldStamp: e.stamp, stamp: cur, vote: e.vote ?? e.sent?.vote ?? null, reasons: e.reasons || e.sent?.reasons || [] });
      all.items[k] = { cleared: true, stale: true, stamp: cur, updatedAt: at, history: [{ at, reason: "art changed — old verdict dropped" }, ...(e.history || [])].slice(0, 20) };
      changed = true;
    }
  }
  if (changed) { all.updatedAt = new Date().toISOString(); saveVerdicts(all); }
  return all;
}
// One-time migration: give legacy entries (no stamp) the stamp of the art they were voted on.
// Ultra stills live in git, so use the file as of the first vote; everything else gets today's stamp.
function migrateStamps() {
  const all = readVerdicts(), sets = loadSets(); let changed = false;
  for (const [k, e] of Object.entries(all.items)) {
    if (e.stamp) continue;
    const [sid, iid] = k.split("/"); const s = sets.find((x) => x.id === sid), it = s?.items.find((x) => x.id === iid);
    if (!it?.stamp) continue;
    let st = it.stamp;
    if (s.kind === "ultra" && it.file) {
      const first = Math.min(...(e.history || []).map((h) => h.at).filter(Boolean), e.updatedAt || Infinity);
      const rel = `public/avatars/ultra/${it.file}`;
      try {
        const rev = execFileSync("git", ["-C", REPO, "rev-list", "-1", `--before=${Math.floor(first / 1000)}`, "HEAD", "--", rel], { encoding: "utf8" }).trim();
        if (rev) st = crypto.createHash("sha1").update(execFileSync("git", ["-C", REPO, "show", `${rev}:${rel}`], { maxBuffer: 64 << 20 })).digest("hex").slice(0, 12);
      } catch {}
    }
    all.items[k] = { ...e, stamp: st }; changed = true;
  }
  if (changed) { all.updatedAt = new Date().toISOString(); saveVerdicts(all); }
}

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://x");
    const p = decodeURIComponent(url.pathname);
    if (p === "/" || p === "/index.html" || p === "/summary" || p === "/review" || p.startsWith("/review/"))
      return serveFile(req, res, path.join(DIR, "public", "index.html"));
    if (p.startsWith("/static/")) { const f = safeJoin(path.join(DIR, "public"), p.slice(8)); return f ? serveFile(req, res, f) : send(res, 403, "Forbidden", "text/plain"); }
    if (p === "/favicon.ico") return send(res, 204, "", "image/x-icon");
    if (p === "/api/sets") return send(res, 200, JSON.stringify(loadSets().map(strip)));
    if (p === "/api/meta") return send(res, 200, JSON.stringify({ version: appVersion() }));
    if (p === "/api/verdicts" && req.method === "GET") return send(res, 200, JSON.stringify(dropStale()));
    if (p === "/api/verdicts" && req.method === "POST") {
      // body: { key: "set/item", entry: {...} }  Newest updatedAt wins; an entry for old art (stamp mismatch) is refused.
      const { key, entry } = JSON.parse(await readBody(req) || "{}");
      if (typeof key !== "string" || !KEY_RE.test(key)) return send(res, 400, JSON.stringify({ error: "bad key" }));
      const stamps = stampMap(), cur = stamps.get(key);
      const all = readVerdicts(), have = all.items[key];
      let next = entry == null ? { cleared: true, updatedAt: Date.now() } : { ...entry };
      next.updatedAt = Number(next.updatedAt) || Date.now();
      if (cur && !next.stamp) next.stamp = cur;
      if (cur && next.stamp !== cur) return send(res, 200, JSON.stringify({ ok: false, reason: "stale art", key, entry: have ?? null }));
      if (have && (have.updatedAt || 0) > next.updatedAt) return send(res, 200, JSON.stringify({ ok: false, reason: "older", key, entry: have }));
      all.items[key] = { ...next, savedAt: new Date().toISOString() };
      all.updatedAt = new Date().toISOString();
      saveVerdicts(all);
      return send(res, 200, JSON.stringify({ ok: true, key, entry: all.items[key] }));
    }
    if (p === "/api/verdicts/clear" && req.method === "POST") {
      // body: { keys: [...], at?: ms, sent?: true }  Writes tombstones so the two-way sync can't bring the entries back.
      // sent:true (default) = this verdict was copied to chat; the item stays out of "To review" until its art changes.
      const { keys, at, sent = true } = JSON.parse(await readBody(req) || "{}");
      if (!Array.isArray(keys) || !keys.every((k) => typeof k === "string" && KEY_RE.test(k))) return send(res, 400, JSON.stringify({ error: "bad keys" }));
      const stamps = stampMap(), all = readVerdicts(), now = Number(at) || Date.now(), out = {};
      for (const k of keys) {
        const have = all.items[k] || {};
        if ((have.updatedAt || 0) > now) { out[k] = have; continue; }
        all.items[k] = out[k] = tombstone(have, now, sent, stamps.get(k));
        logHistory({ at: now, key: k, action: sent ? "sent" : "cleared", vote: have.vote ?? null, reasons: have.reasons || [], comment: have.comment || "" });
      }
      all.updatedAt = new Date().toISOString();
      saveVerdicts(all);
      return send(res, 200, JSON.stringify({ ok: true, items: out }));
    }
    const m = p.match(/^\/sets\/([\w.-]+)\/(.+)$/);
    if (m) {
      const set = loadSets().find((s) => s.id === m[1]);
      if (!set) return send(res, 404, "No such set", "text/plain");
      const f = safeJoin(setRoot(set), m[2]);
      return f ? serveFile(req, res, f) : send(res, 403, "Forbidden", "text/plain");
    }
    // Old static Riftstallion gallery stays reachable.
    if (p === "/trial" || p.startsWith("/trial/")) {
      const f = safeJoin("/workspace/riftstallion-trial", p.slice(7) || "index.html");
      return f ? serveFile(req, res, f) : send(res, 403, "Forbidden", "text/plain");
    }
    // The ClassNest app (built with base /app/). Files from app-build/, then the repo's public/, then SPA shell.
    if (p === "/app") return send(res, 302, "", "text/plain", { Location: "/app/" });
    if (p.startsWith("/app/")) {
      const rel = p.slice(5);
      const shell = () => serveFile(req, res, path.join(APP, "index.html"));
      const a = safeJoin(APP, rel), b = safeJoin(PUBLIC, rel);
      if (!a || !b) return send(res, 403, "Forbidden", "text/plain");
      if (!rel) return shell();
      return serveFile(req, res, a, () => serveFile(req, res, b, () => (path.extname(rel) ? send(res, 404, "Not found", "text/plain") : shell())));
    }
    // App media requested at the site root (/avatars, /shop, /celebrations, ...) come from the repo's public/.
    const f = safeJoin(PUBLIC, p.slice(1));
    if (f && p.length > 1) return serveFile(req, res, f);
    send(res, 404, "Not found", "text/plain");
  } catch (e) { send(res, 500, JSON.stringify({ error: String(e.message || e) })); }
}).listen(PORT, HOST, () => { console.log(`ClassNest preview on http://${HOST}:${PORT}/`); try { migrateStamps(); dropStale(); } catch (e) { console.error("migrate", e); } });
