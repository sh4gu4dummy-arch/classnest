#!/usr/bin/env python3
"""Build picks, review sheet, phone check and review set for one Ultra remake.
Usage: remake-tool.py config.json"""
import json, sys, os, shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter
cfg = json.load(open(sys.argv[1]))
T = cfg["root"]; N = cfg["num"]; NAME = cfg["name"]; SID = cfg["setId"]
REPO = "/workspace/classnest-audit/public/avatars/ultra"
os.makedirs(f"{T}/picks/board", exist_ok=True)
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"; font = lambda s: ImageFont.truetype(FB, s)
L = lambda f, s: Image.open(f).convert("RGB").resize((s, s), Image.LANCZOS)
# picks
shutil.copy(f"{T}/old/{N}-s1.jpg", f"{T}/picks/{N}-s1.jpg"); shutil.copy(f"{REPO}/board/{N}-s1.jpg", f"{T}/picks/board/{N}-s1.jpg")
picks = {}
for stage in ("s2", "s3"):
    for role in ("pick", "alt"):
        oid = cfg[stage][role]
        out = f"{N}-{stage}.jpg" if role == "pick" else f"{N}-{stage}-alt-{oid}.jpg"
        im = Image.open(f"{T}/options/{stage}-{oid}.jpg").convert("RGB").resize((1408, 1408), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=2))
        im.save(f"{T}/picks/{out}", quality=90, optimize=True)
        im.resize((360, 360), Image.LANCZOS).save(f"{T}/picks/board/{out}", quality=85, optimize=True)
        picks[(stage, role)] = out
# review sheet
opts = {st: cfg[st]["options"] for st in ("s2", "s3")}
big, sm = 250, 150
rows_opt = [("Adolescent", "s2"), ("Legend", "s3")]
nrow = sum((len(opts[st]) + 4) // 5 for _, st in rows_opt)
H = 50 + 2 * (big + 40) + 30 + nrow * (sm + 36) + 10
W = 1000
im = Image.new("RGB", (W, H), "#f6f4ef"); d = ImageDraw.Draw(im)
d.text((10, 10), f"{NAME} #{N} remake (draft, local only)", fill="#111", font=font(22)); y = 50
for lab, col, items in [("OLD (live)", "#222", [(f"{T}/old/{N}-s{k}.jpg", c) for k, c in ((1, "Hatchling"), (2, "Adolescent"), (3, "Legend"))]),
                        ("NEW PICKS", "#15803d", [(f"{T}/picks/{N}-s1.jpg", "Hatchling (kept)"), (f"{T}/picks/{picks[('s2','pick')]}", f"Adolescent = {cfg['s2']['pick']}"), (f"{T}/picks/{picks[('s3','pick')]}", f"Legend = {cfg['s3']['pick']}")])]:
    d.text((10, y + big // 2 - 8), lab, fill=col, font=font(15))
    for i, (f, c) in enumerate(items):
        x = 160 + i * (big + 20); im.paste(L(f, big), (x, y)); d.text((x, y + big + 4), c, fill="#333", font=font(12))
    y += big + 40
d.text((10, y), "ALL OPTIONS (green = pick/runner-up, red = art-check fail)", fill="#111", font=font(14)); y += 26
for lab, st in rows_opt:
    ol = list(opts[st].items())
    for r in range(0, len(ol), 5):
        d.text((10, y + sm // 2 - 8), lab if r == 0 else "", fill="#333", font=font(12))
        for i, (oid, o) in enumerate(ol[r:r + 5]):
            x = 120 + i * (sm + 25); im.paste(L(f"{T}/options/{st}-{oid}.jpg", sm), (x, y))
            tag = "PICK " if oid == cfg[st]["pick"] else ("ALT " if oid == cfg[st]["alt"] else ("FAIL " if o.get("fail") else ""))
            colr = "#15803d" if tag in ("PICK ", "ALT ") else ("#b91c1c" if o.get("fail") else "#555")
            d.text((x, y + sm + 3), f"{oid} {tag}{o['short']}"[:28], fill=colr, font=font(10))
        y += sm + 36
im.save(f"{T}/review.png")
# phone check
S = 2; PW, PH = 390 * S, 844 * S
ph = Image.new("RGB", (PW, PH), "#1e1b2e"); d = ImageDraw.Draw(ph)
d.rectangle((0, 0, PW, 50 * S), fill=cfg.get("accent", "#6366f1")); d.text((14 * S, 14 * S), f"{NAME} - phone 390x844", fill="white", font=font(15 * S))
card = 114 * S; gap = (PW - 3 * card) // 4; y = 62 * S
for title, files in [("OLD", [f"{REPO}/board/{N}-s{k}.jpg" for k in (1, 2, 3)]),
                     ("NEW PICKS", [f"{T}/picks/board/{N}-s1.jpg", f"{T}/picks/board/{picks[('s2','pick')]}", f"{T}/picks/board/{picks[('s3','pick')]}"]),
                     ("RUNNERS-UP", [f"{T}/picks/board/{N}-s1.jpg", f"{T}/picks/board/{picks[('s2','alt')]}", f"{T}/picks/board/{picks[('s3','alt')]}"])]:
    d.text((14 * S, y), title + " - board thumb ~114px", fill="white", font=font(11 * S)); y += 20 * S
    for i, f in enumerate(files):
        x = gap + i * (card + gap); d.rounded_rectangle((x - 3 * S, y - 3 * S, x + card + 3 * S, y + card + 24 * S), radius=10 * S, fill="#2d2945")
        ph.paste(L(f, 360).resize((card, card), Image.LANCZOS), (x, y)); d.text((x + 4 * S, y + card + 5 * S), ["Hatchling", "Adolescent", "Legend"][i], fill="#fde68a", font=font(11 * S))
    y += card + 38 * S
d.text((14 * S, y), "56px avatars: s1, s2, s3 (picks), s2/s3 alt", fill="white", font=font(11 * S)); y += 20 * S
for i, f in enumerate([f"{T}/picks/board/{N}-s1.jpg", f"{T}/picks/board/{picks[('s2','pick')]}", f"{T}/picks/board/{picks[('s3','pick')]}", f"{T}/picks/board/{picks[('s2','alt')]}", f"{T}/picks/board/{picks[('s3','alt')]}"]):
    t = L(f, 56 * S); m = Image.new("L", t.size, 0); ImageDraw.Draw(m).ellipse((0, 0, 56 * S, 56 * S), fill=255); ph.paste(t, (16 * S + i * 72 * S, y), m)
ph.save(f"{T}/phone-check.png")
# set.json
items = []
for k, c in ((1, "Hatchling"), (2, "Adolescent"), (3, "Legend")):
    items.append(dict(id=f"old-s{k}", group="old", title=f"Old {c} (live)", file=f"old/{N}-s{k}.jpg", done="reference only (live art)"))
for stage, label in (("s2", "Adolescent"), ("s3", "Legend")):
    for role in ("pick", "alt"):
        oid = cfg[stage][role]; out = picks[(stage, role)]
        items.append(dict(id=f"pick-{stage}-{oid}", group="picks", title=f"{label} {oid} ({'bot pick' if role=='pick' else 'runner-up'}, 1408)", file=f"picks/{out}", thumb=f"picks/board/{out}", note=cfg[stage]["opts_note"][role] if "opts_note" in cfg[stage] else ("bot pick" if role == "pick" else "runner-up")))
for stage, grp, label in (("s2", "adol", "Adolescent"), ("s3", "legend", "Legend")):
    for oid, o in opts[stage].items():
        it = dict(id=f"{grp}-{oid}", group=grp, title=f"{label} {oid} ({o['title']})", file=f"options/{stage}-{oid}.jpg")
        notes = []
        if oid == cfg[stage]["pick"]: notes.append("bot pick")
        if oid == cfg[stage]["alt"]: notes.append("runner-up")
        if o.get("fail"): notes.append("art check FAIL: " + o["fail"])
        if o.get("note"): notes.append(o["note"])
        if notes: it["note"] = "; ".join(notes)
        items.append(it)
items += [dict(id="sheet-review", group="sheets", title="Old vs new review sheet", file="review.png", done="reference sheet", noVote=True),
          dict(id="sheet-phone", group="sheets", title="Phone check (390x844)", file="phone-check.png", done="reference sheet", noVote=True)]
s = dict(id=SID, title=f"{NAME} #{N}", blurb=cfg["blurb"], root=T, created="2026-10-22",
         groups=[dict(id="picks", title="Bot picks (1408px)"), dict(id="adol", title="Adolescent options"), dict(id="legend", title="Legend options"),
                 dict(id="old", title="Live today (reference only)", done="reference only"), dict(id="sheets", title="Review sheets", done="reference")],
         items=items, coverItem=f"pick-s3-{cfg['s3']['pick']}")
os.makedirs(f"/workspace/classnest-review/sets/{SID}", exist_ok=True)
json.dump(s, open(f"/workspace/classnest-review/sets/{SID}/set.json", "w"), indent=2, ensure_ascii=False)
print("ok", SID, len(items))
