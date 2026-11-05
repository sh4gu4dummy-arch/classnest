#!/usr/bin/env python3
"""Static GitHub Pages build of the ClassNest review page -> pages-dist/.
Reads everything through the review server's own API (the running one on 127.0.0.1:8931, or a temporary
one on a spare port if that is down), so the static copy shows exactly what the local page shows.
Media is re-encoded web-sized and cached by content stamp in pages-cache/ (rebuilds are fast).
All paths in the output are relative (works under https://<user>.github.io/<repo>/)."""
import threading, json, os, re, shutil, subprocess, sys, time, urllib.request, urllib.parse, hashlib, io, socket
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

DIR = os.path.dirname(os.path.abspath(__file__))
DIST = os.environ.get("DIST", os.path.join(DIR, "pages-dist"))
CACHE = os.path.join(DIR, "pages-cache")
# Sizes per kind: "full" = lightbox for review sets (the art being decided), "ref" = lightbox for the 75 Ultra
# sets (live art, reference), "card" = grid cards / tiles / covers / video posters.
SIZES = {"full": (1400, 82), "ref": (960, 78), "card": (480, 75)}
VIDEO_CRF = os.environ.get("VIDEO_CRF", "36")
# Ultra Home scrub stills are left out by default (they are frames of the Home film, which is included).
SKIP_GROUPS = set(filter(None, os.environ.get("SKIP_GROUPS", "scrub").split(",")))

def port_open(p):
    with socket.socket() as s:
        s.settimeout(0.5)
        return s.connect_ex(("127.0.0.1", p)) == 0

base, tmp = "http://127.0.0.1:8931", None
if not port_open(8931):
    port = 8939
    tmp = subprocess.Popen(["node", os.path.join(DIR, "server.mjs")], env={**os.environ, "PORT": str(port), "HOST": "127.0.0.1"},
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    base = f"http://127.0.0.1:{port}"
    for _ in range(50):
        if port_open(port): break
        time.sleep(0.2)
    print("review server not running; using a temporary one on", port)

def get(path):
    with urllib.request.urlopen(base + path, timeout=120) as r:
        return r.read()

try:
    sets = json.loads(get("/api/sets"))
    meta = json.loads(get("/api/meta"))
    verdicts = json.loads(get("/api/verdicts"))
    os.makedirs(CACHE, exist_ok=True)
    jobs = {}   # (site path, kind) -> [(obj, field), ...]; output files are named by content hash (dedups copies)
    enc = lambda p: "/".join(urllib.parse.quote(x) for x in p.split("/"))
    safe = lambda p: re.sub(r"[^\w./-]+", "_", p)
    def site(s, rel): return f"/sets/{urllib.parse.quote(s['id'])}/{enc(rel)}"
    def plan(sitepath, kind, *refs):
        jobs.setdefault((sitepath, kind), []).extend(refs)

    out_sets = []
    for s in sets:
        s = dict(s); sid = s["id"]
        items = []
        for it in s.get("items", []):
            if it.get("group") in SKIP_GROUPS: continue
            it = dict(it)
            sp = it["url"].split("?")[0] if it.get("url") else site(s, it["file"])
            if it.get("kind") == "video":
                plan(sp, "video", (it, "url"))
                if it.get("poster"): plan(site(s, it["poster"]), "card", (it, "posterUrl"), (it, "cardUrl"), (it, "thumbUrl"))
            else:
                plan(sp, "ref" if s.get("kind") == "ultra" else "full", (it, "url"))
                plan(sp, "card", (it, "cardUrl"), (it, "thumbUrl"))
            items.append(it)
        s["items"] = items
        if SKIP_GROUPS: s["groups"] = [g for g in s.get("groups", []) if g["id"] not in SKIP_GROUPS]
        if s.get("cover"):
            plan(site(s, s["cover"]), "card", (s, "coverUrl"))
        out_sets.append(s)

    def cached(sitepath, kind):
        raw = get(enc(urllib.parse.unquote(sitepath)) if not sitepath.startswith("/sets/") else sitepath)
        h = hashlib.sha1(raw).hexdigest()[:16]
        ext = ".mp4" if kind == "video" else ".jpg"
        tag = f"crf{VIDEO_CRF}" if kind == "video" else "%dq%d" % SIZES[kind]
        name = f"{h}-{kind}-{tag}{ext}"
        cp = os.path.join(CACHE, name)
        if os.path.exists(cp): return cp, name
        if kind == "video":
            src = f"{cp}.{threading.get_ident()}.src"; out = src + ".mp4"; open(src, "wb").write(raw)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vf", "scale='min(iw,1280)':-2", "-c:v", "libx264", "-preset", "slow",
                            "-crf", VIDEO_CRF, "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-c:a", "aac", "-b:a", "64k", out], check=True)
            os.remove(src); os.replace(out, cp); return cp, name
        im = Image.open(io.BytesIO(raw))
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA"); bg = Image.new("RGB", im.size, (255, 255, 255)); bg.paste(im, mask=im.split()[-1]); im = bg
        else: im = im.convert("RGB")
        edge, q = SIZES[kind]
        im.thumbnail((edge, edge), Image.LANCZOS)
        t = f"{cp}.{threading.get_ident()}.tmp"
        im.save(t, "JPEG", quality=q, optimize=True, progressive=True)
        os.replace(t, cp); return cp, name

    if os.path.isdir(DIST): shutil.rmtree(DIST)
    os.makedirs(os.path.join(DIST, "data"))
    for d in ("m", "t"): os.makedirs(os.path.join(DIST, d))
    def run(item):
        (sp, kind), refs = item
        cp, name = cached(sp, kind)
        rel = ("t/" if kind == "card" else "m/") + name
        dst = os.path.join(DIST, rel)
        if not os.path.exists(dst): shutil.copyfile(cp, dst)
        for obj, field in refs: obj[field] = rel
        return cp
    used = set()
    def run_used(item): used.add(os.path.basename(run(item)))
    with ThreadPoolExecutor(6) as ex: list(ex.map(run_used, jobs.items()))
    for f in os.listdir(CACHE):          # drop cache entries this build did not use (old sizes / replaced art)
        if f not in used: os.remove(os.path.join(CACHE, f))

    html = open(os.path.join(DIR, "public", "index.html"), encoding="utf-8").read()
    assert "const STATIC_BUILD = false;" in html
    html = html.replace("const STATIC_BUILD = false;", "const STATIC_BUILD = true;").replace("<title>ClassNest preview</title>", "<title>ClassNest art review</title>")
    open(os.path.join(DIST, "index.html"), "w", encoding="utf-8").write(html)
    dump = lambda name, obj: open(os.path.join(DIST, "data", name), "w", encoding="utf-8").write(json.dumps(obj, separators=(",", ":"), sort_keys=True))
    dump("sets.json", out_sets)
    dump("meta.json", {"version": meta.get("version", "?"), "static": True, "builtAt": int(time.time() * 1000)})
    dump("verdicts.json", verdicts)
    open(os.path.join(DIST, ".nojekyll"), "w").close()
    total = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(DIST) for f in fs)
    count = sum(len(fs) for _, _, fs in os.walk(DIST))
    print(f"pages-dist: {count} files, {total/1e6:.1f} MB, {len(out_sets)} sets, {sum(len(s['items']) for s in out_sets)} items, v{meta.get('version')}")
finally:
    if tmp: tmp.terminate()
