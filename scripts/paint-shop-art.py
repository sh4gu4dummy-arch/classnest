#!/usr/bin/env python3
"""Paint ClassNest shop art — banners, frames (alpha), nest props, icons."""
from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

ROOT = Path("/workspace/public/shop")


def clamp(v: int) -> int:
    return max(0, min(255, int(v)))


def mix(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return (
        clamp(a[0] + (b[0] - a[0]) * t),
        clamp(a[1] + (b[1] - a[1]) * t),
        clamp(a[2] + (b[2] - a[2]) * t),
    )


def noise(img: Image.Image, amount: int = 18) -> Image.Image:
    rnd = random.Random(img.size[0] * 97 + img.size[1])
    px = img.load()
    w, h = img.size
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            d = rnd.randint(-amount, amount)
            r, g, b = px[x, y][:3]
            c = (clamp(r + d), clamp(g + d), clamp(b + d))
            px[x, y] = c if img.mode == "RGB" else (*c, px[x, y][3] if len(px[x, y]) > 3 else 255)
            if x + 1 < w:
                px[x + 1, y] = px[x, y]
            if y + 1 < h:
                px[x, y + 1] = px[x, y]
            if x + 1 < w and y + 1 < h:
                px[x + 1, y + 1] = px[x, y]
    return img


def vertical_grad(size: tuple[int, int], top: tuple[int, int, int], bot: tuple[int, int, int]) -> Image.Image:
    w, h = size
    im = Image.new("RGB", size)
    px = im.load()
    for y in range(h):
        c = mix(top, bot, y / (h - 1))
        for x in range(w):
            px[x, y] = c
    return im


def blob(draw: ImageDraw.ImageDraw, xy: tuple[float, float], r: float, color: tuple[int, int, int], a: int = 140):
    x, y = xy
    layer = Image.new("RGBA", draw._image.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse([x - r, y - r, x + r, y + r], fill=(*color, a))
    layer = layer.filter(ImageFilter.GaussianBlur(radius=r * 0.35))
    draw._image.alpha_composite(layer)


def save_jpg(im: Image.Image, path: Path, q: int = 86) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.convert("RGB").save(path, "JPEG", quality=q, optimize=True)


def save_png(im: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "PNG", optimize=True)


def paint_aurora() -> Image.Image:
    im = vertical_grad((960, 360), (8, 12, 28), (6, 28, 36)).convert("RGBA")
    d = ImageDraw.Draw(im)
    rnd = random.Random(11)
    for i in range(7):
        col = mix((20, 200, 180), (140, 80, 255), i / 6)
        pts = []
        y0 = 40 + i * 28
        for x in range(0, 961, 16):
            y = y0 + math.sin(x / 90 + i) * 22 + math.sin(x / 40 + i * 0.7) * 12
            pts.append((x, y))
        for w in (18, 10, 4):
            d.line(pts, fill=(*col, 70 if w == 18 else 160), width=w)
    # pines
    for x in range(0, 960, 28):
        h = 70 + rnd.randint(0, 50)
        d.polygon([(x, 360), (x + 18, 360), (x + 9, 360 - h)], fill=(8, 22, 18, 230))
    # lake sheen
    d.rectangle([0, 300, 960, 360], fill=(10, 30, 40, 180))
    return im.filter(ImageFilter.GaussianBlur(0.4))


def paint_void() -> Image.Image:
    im = vertical_grad((960, 360), (12, 6, 28), (4, 4, 12)).convert("RGBA")
    d = ImageDraw.Draw(im)
    rnd = random.Random(22)
    blob(d, (280, 160), 160, (90, 40, 180), 110)
    blob(d, (620, 120), 200, (40, 20, 90), 130)
    blob(d, (480, 220), 90, (200, 140, 80), 50)
    for _ in range(90):
        x, y = rnd.randint(0, 959), rnd.randint(0, 359)
        r = rnd.choice([1, 1, 2, 3])
        d.ellipse([x, y, x + r, y + r], fill=(255, 240, 220, rnd.randint(120, 255)))
    return im


def paint_solar() -> Image.Image:
    im = vertical_grad((960, 360), (255, 180, 70), (190, 70, 30)).convert("RGBA")
    d = ImageDraw.Draw(im)
    d.ellipse([620, -40, 860, 200], fill=(255, 230, 140, 255))
    d.ellipse([640, -20, 840, 180], fill=(255, 248, 200, 255))
    for i, y in enumerate((240, 280, 320, 360)):
        d.polygon(
            [(0, 360), (960, 360), (960, y - 10), (0, y + 20 + i * 4)],
            fill=mix((180, 90, 30), (120, 50, 20), i / 3) + (255,),
        )
    return im


def paint_ember() -> Image.Image:
    im = vertical_grad((960, 360), (40, 8, 10), (12, 4, 6)).convert("RGBA")
    d = ImageDraw.Draw(im)
    blob(d, (480, 300), 220, (220, 50, 30), 140)
    blob(d, (300, 280), 120, (255, 120, 40), 90)
    rnd = random.Random(33)
    for _ in range(70):
        x, y = rnd.randint(80, 880), rnd.randint(40, 300)
        r = rnd.randint(1, 3)
        d.ellipse([x, y, x + r, y + r], fill=(255, 180, 80, rnd.randint(140, 240)))
    d.polygon([(120, 360), (280, 360), (210, 210)], fill=(20, 8, 8, 255))
    d.polygon([(620, 360), (860, 360), (740, 180)], fill=(18, 6, 6, 255))
    return im


def paint_meadow() -> Image.Image:
    im = vertical_grad((960, 360), (160, 210, 255), (210, 230, 170)).convert("RGBA")
    d = ImageDraw.Draw(im)
    d.ellipse([680, 20, 820, 160], fill=(255, 236, 150, 255))
    d.polygon([(0, 220), (960, 250), (960, 360), (0, 360)], fill=(90, 150, 70, 255))
    d.polygon([(0, 270), (960, 240), (960, 360), (0, 360)], fill=(70, 130, 60, 255))
    rnd = random.Random(44)
    for _ in range(80):
        x, y = rnd.randint(20, 940), rnd.randint(230, 340)
        col = rnd.choice([(230, 80, 110), (250, 200, 60), (255, 255, 255), (180, 80, 200)])
        d.ellipse([x, y, x + 6, y + 6], fill=(*col, 230))
    return im


def paint_paper() -> Image.Image:
    im = vertical_grad((960, 360), (236, 226, 208), (214, 200, 176)).convert("RGBA")
    d = ImageDraw.Draw(im)
    rnd = random.Random(55)
    blob(d, (200, 80), 90, (40, 40, 50), 18)
    blob(d, (720, 240), 110, (60, 50, 40), 16)
    for _ in range(12):
        x = rnd.randint(40, 900)
        d.line([(x, 40), (x + rnd.randint(-30, 40), 320)], fill=(70, 60, 50, 28), width=1)
    # pressed leaf
    d.ellipse([140, 160, 260, 220], fill=(90, 110, 70, 40))
    return noise(im.convert("RGB"), 10).convert("RGBA")


def paint_frame(kind: str) -> Image.Image:
    s = 512
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    inset = 46
    if kind == "gold":
        outer, inner, accent = (212, 160, 50, 255), (120, 80, 20, 255), (255, 220, 120, 255)
    elif kind == "neon":
        outer, inner, accent = (20, 220, 230, 255), (8, 80, 90, 255), (180, 255, 255, 255)
    elif kind == "void":
        outer, inner, accent = (160, 90, 230, 255), (50, 20, 80, 255), (230, 180, 255, 255)
    elif kind == "oak":
        outer, inner, accent = (140, 90, 45, 255), (80, 50, 22, 255), (200, 150, 90, 255)
    else:  # ice
        outer, inner, accent = (180, 220, 240, 255), (90, 140, 170, 255), (255, 255, 255, 255)
    d.rounded_rectangle([8, 8, s - 8, s - 8], 56, outline=outer, width=22)
    d.rounded_rectangle([22, 22, s - 22, s - 22], 48, outline=inner, width=8)
    d.rounded_rectangle([34, 34, s - 34, s - 34], 42, outline=accent, width=3)
    # corners
    for cx, cy in ((40, 40), (s - 40, 40), (40, s - 40), (s - 40, s - 40)):
        d.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], outline=accent, width=3)
        d.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], fill=outer)
    # hole is already transparent
    _ = inset
    return im


def prop_bg() -> Image.Image:
    return vertical_grad((384, 384), (36, 40, 48), (22, 24, 30)).convert("RGBA")


def paint_plant() -> Image.Image:
    im = prop_bg()
    d = ImageDraw.Draw(im)
    d.polygon([(160, 330), (224, 330), (210, 250), (174, 250)], fill=(90, 70, 80, 255))
    d.ellipse([150, 236, 234, 268], fill=(70, 55, 65, 255))
    for dx, col in ((-20, (80, 210, 160)), (0, (120, 240, 200)), (22, (60, 190, 220))):
        d.polygon([(192 + dx, 250), (192 + dx + 18, 120), (192 + dx - 8, 130)], fill=(*col, 255))
        d.ellipse([176 + dx, 96, 214 + dx, 140], fill=(*mix(col, (255, 255, 255), 0.3), 230))
    return im


def paint_rug() -> Image.Image:
    im = prop_bg()
    d = ImageDraw.Draw(im)
    d.ellipse([48, 140, 336, 280], fill=(70, 80, 160, 255))
    d.ellipse([68, 154, 316, 266], fill=(50, 55, 110, 255))
    # star
    cx, cy, r = 192, 210, 36
    pts = []
    for i in range(10):
        ang = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.42
        pts.append((cx + math.cos(ang) * rr, cy + math.sin(ang) * rr))
    d.polygon(pts, fill=(240, 210, 90, 255))
    return im


def paint_lamp() -> Image.Image:
    im = prop_bg()
    d = ImageDraw.Draw(im)
    blob(d, (192, 170), 90, (230, 140, 255), 90)
    d.ellipse([132, 110, 252, 230], fill=(250, 200, 255, 240))
    d.ellipse([148, 126, 236, 214], fill=(255, 240, 255, 255))
    d.rectangle([186, 228, 198, 300], fill=(180, 120, 200, 255))
    d.ellipse([168, 292, 216, 318], fill=(90, 70, 100, 255))
    return im


def paint_sofa() -> Image.Image:
    im = prop_bg()
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([70, 180, 314, 280], 28, fill=(220, 228, 236, 255))
    d.rounded_rectangle([86, 168, 176, 230], 22, fill=(235, 240, 246, 255))
    d.rounded_rectangle([208, 168, 298, 230], 22, fill=(235, 240, 246, 255))
    d.rounded_rectangle([78, 248, 120, 300], 12, fill=(200, 210, 220, 255))
    d.rounded_rectangle([264, 248, 306, 300], 12, fill=(200, 210, 220, 255))
    return im


def paint_poster() -> Image.Image:
    im = prop_bg()
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([108, 70, 276, 310], 8, fill=(60, 42, 28, 255))
    d.rounded_rectangle([122, 84, 262, 296], 4, fill=(40, 80, 120, 255))
    d.polygon([(122, 200), (262, 170), (262, 296), (122, 296)], fill=(70, 140, 90, 255))
    d.ellipse([190, 110, 230, 150], fill=(255, 210, 90, 255))
    return im


def paint_trophy() -> Image.Image:
    im = prop_bg()
    d = ImageDraw.Draw(im)
    d.polygon([(150, 210), (234, 210), (214, 280), (170, 280)], fill=(220, 170, 50, 255))
    d.ellipse([138, 96, 246, 220], fill=(240, 190, 60, 255))
    d.ellipse([154, 114, 230, 200], fill=(255, 230, 120, 255))
    d.arc([108, 120, 168, 200], 90, 270, fill=(230, 180, 50, 255), width=10)
    d.arc([216, 120, 276, 200], -90, 90, fill=(230, 180, 50, 255), width=10)
    d.rectangle([164, 278, 220, 298], fill=(180, 130, 40, 255))
    d.rectangle([148, 296, 236, 318], fill=(200, 150, 50, 255))
    return im


def paint_shelf() -> Image.Image:
    im = prop_bg()
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([64, 150, 320, 178], 6, fill=(150, 96, 48, 255))
    d.rectangle([80, 178, 96, 300], fill=(120, 76, 38, 255))
    d.rectangle([288, 178, 304, 300], fill=(120, 76, 38, 255))
    d.ellipse([110, 108, 150, 150], fill=(80, 140, 180, 230))
    d.rectangle([180, 100, 208, 150], fill=(90, 60, 140, 255))
    d.polygon([(240, 150), (270, 150), (255, 104)], fill=(200, 80, 70, 255))
    return im


def paint_window() -> Image.Image:
    im = prop_bg()
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([108, 70, 276, 300], 80, outline=(90, 80, 70, 255), width=14)
    d.rounded_rectangle([122, 84, 262, 286], 70, fill=(30, 50, 90, 255))
    d.ellipse([168, 110, 216, 158], fill=(240, 230, 180, 255))
    d.line([(192, 84), (192, 286)], fill=(90, 80, 70, 255), width=6)
    d.line([(122, 186), (262, 186)], fill=(90, 80, 70, 255), width=6)
    return im


def paint_shield() -> Image.Image:
    im = prop_bg()
    d = ImageDraw.Draw(im)
    d.polygon([(192, 70), (290, 110), (270, 240), (192, 310), (114, 240), (94, 110)], fill=(40, 150, 210, 255))
    d.polygon([(192, 92), (266, 124), (250, 228), (192, 286), (134, 228), (118, 124)], fill=(90, 200, 240, 255))
    d.polygon([(192, 120), (230, 200), (192, 250), (154, 200)], fill=(255, 255, 255, 200))
    return im


def paint_star() -> Image.Image:
    im = prop_bg()
    d = ImageDraw.Draw(im)
    cx, cy, r = 192, 192, 110
    pts = []
    for i in range(10):
        ang = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.4
        pts.append((cx + math.cos(ang) * rr, cy + math.sin(ang) * rr))
    d.polygon(pts, fill=(250, 190, 40, 255))
    d.polygon(
        [
            (cx + math.cos(-math.pi / 2) * (r * 0.55), cy + math.sin(-math.pi / 2) * (r * 0.55)),
            (cx + 20, cy + 10),
            (cx - 20, cy + 10),
        ],
        fill=(255, 230, 120, 255),
    )
    return im


def main() -> None:
    banners = {
        "aurora": paint_aurora,
        "void": paint_void,
        "solar": paint_solar,
        "ember": paint_ember,
        "meadow": paint_meadow,
        "paper": paint_paper,
    }
    for name, fn in banners.items():
        im = fn()
        im = ImageEnhance.Contrast(im.convert("RGB")).enhance(1.08)
        save_jpg(im, ROOT / "banners" / f"{name}.jpg")

    for kind in ("gold", "neon", "void", "oak", "ice"):
        save_png(paint_frame(kind), ROOT / "frames" / f"{kind}.png")

    homes = {
        "plant": paint_plant,
        "rug": paint_rug,
        "lamp": paint_lamp,
        "sofa": paint_sofa,
        "poster": paint_poster,
        "trophy": paint_trophy,
        "shelf": paint_shelf,
        "window": paint_window,
    }
    for name, fn in homes.items():
        save_jpg(fn().convert("RGB"), ROOT / "home" / f"{name}.jpg", 88)

    save_jpg(paint_shield().convert("RGB"), ROOT / "icons" / "shield.jpg", 88)
    save_jpg(paint_star().convert("RGB"), ROOT / "icons" / "star.jpg", 88)
    print("shop art written")


if __name__ == "__main__":
    main()
