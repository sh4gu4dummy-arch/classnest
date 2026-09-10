#!/usr/bin/env python3
"""Build ClassNest shop art from photos + textured cutouts (not CSS blobs)."""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps

SRC = Path("/workspace/tmp_images/shop-src")
OUT = Path("/workspace/public/shop")


def load(name: str) -> Image.Image:
    return Image.open(SRC / name).convert("RGB")


def fit(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.fit(im, size, Image.Resampling.LANCZOS)


def save_jpg(im: Image.Image, path: Path, q: int = 88) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.convert("RGB").save(path, "JPEG", quality=q, optimize=True)


def save_png(im: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "PNG", optimize=True)


def studio(im: Image.Image, pad: float = 0.18) -> Image.Image:
    """Darken edges so catalog cards look like item shots."""
    im = im.convert("RGB")
    w, h = im.size
    vg = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(vg)
    d.ellipse(
        (-int(w * pad), -int(h * pad), w + int(w * pad), h + int(h * pad)),
        fill=255,
    )
    vg = vg.filter(ImageFilter.GaussianBlur(int(min(w, h) * 0.18)))
    dark = Image.new("RGB", (w, h), (18, 16, 28))
    return Image.composite(im, dark, vg)


def star_mask(size: int, points: int = 5) -> Image.Image:
    m = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(m)
    cx = cy = size / 2
    r_out = size * 0.42
    r_in = size * 0.17
    pts = []
    for i in range(points * 2):
        ang = -math.pi / 2 + i * math.pi / points
        r = r_out if i % 2 == 0 else r_in
        pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    d.polygon(pts, fill=255)
    return m.filter(ImageFilter.GaussianBlur(1.2))


def shield_mask(size: int) -> Image.Image:
    m = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(m)
    w = h = size
    path = [
        (w * 0.22, h * 0.12),
        (w * 0.78, h * 0.12),
        (w * 0.82, h * 0.38),
        (w * 0.50, h * 0.90),
        (w * 0.18, h * 0.38),
    ]
    d.polygon(path, fill=255)
    return m.filter(ImageFilter.GaussianBlur(1.4))


def trophy_mask(size: int) -> Image.Image:
    m = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(m)
    # cup
    d.pieslice([size * 0.22, size * 0.14, size * 0.78, size * 0.72], 0, 180, fill=255)
    d.rectangle([size * 0.22, size * 0.18, size * 0.78, size * 0.42], fill=255)
    # stem + base
    d.rectangle([size * 0.44, size * 0.58, size * 0.56, size * 0.78], fill=255)
    d.rounded_rectangle(
        [size * 0.28, size * 0.76, size * 0.72, size * 0.90],
        radius=size * 0.04,
        fill=255,
    )
    # handles
    d.arc([size * 0.06, size * 0.22, size * 0.30, size * 0.58], 90, 270, fill=255, width=int(size * 0.07))
    d.arc([size * 0.70, size * 0.22, size * 0.94, size * 0.58], -90, 90, fill=255, width=int(size * 0.07))
    return m.filter(ImageFilter.GaussianBlur(1.6))


def cutout(tex: Image.Image, mask: Image.Image, bg=(16, 14, 24)) -> Image.Image:
    size = mask.size[0]
    tex = fit(tex, (size, size))
    tex = ImageEnhance.Contrast(tex).enhance(1.18)
    tex = ImageEnhance.Color(tex).enhance(1.12)
    base = Image.new("RGB", (size, size), bg)
    base.paste(tex, mask=mask)
    # drop shadow
    sh = mask.filter(ImageFilter.GaussianBlur(18))
    shadow = Image.new("RGB", (size, size), bg)
    gold = Image.new("RGB", (size, size), (0, 0, 0))
    shadow = Image.composite(gold, shadow, ImageEnhance.Brightness(sh).enhance(0.55))
    out = Image.composite(base, shadow, Image.new("L", (size, size), 180))
    out.paste(tex, mask=mask)
    # rim highlight
    edge = ImageOps.solarize(mask, threshold=20)
    edge = ImageChops_subtract(mask, mask.filter(ImageFilter.MinFilter(5)))
    hi = Image.new("RGB", (size, size), (255, 240, 200))
    out = Image.composite(hi, out, ImageEnhance.Brightness(edge).enhance(0.55))
    return studio(out, pad=0.08)


def ImageChops_subtract(a: Image.Image, b: Image.Image) -> Image.Image:
    from PIL import ImageChops

    return ImageChops.subtract(a, b)


def frame_png(tex: Image.Image, size: int = 1024, hue: float | None = None) -> Image.Image:
    tex = fit(tex, (size, size))
    if hue is not None:
        hsv = tex.convert("HSV")
        h, s, v = hsv.split()
        h = h.point(lambda p: int((p + hue) % 256))
        tex = Image.merge("HSV", (h, s, v)).convert("RGB")
    tex = ImageEnhance.Contrast(tex).enhance(1.25)
    tex = ImageEnhance.Color(tex).enhance(1.15)

    outer = Image.new("L", (size, size), 0)
    inner = Image.new("L", (size, size), 0)
    d_o = ImageDraw.Draw(outer)
    d_i = ImageDraw.Draw(inner)
    pad = int(size * 0.06)
    hole = int(size * 0.18)
    rad = int(size * 0.16)
    d_o.rounded_rectangle([pad, pad, size - pad, size - pad], radius=rad, fill=255)
    d_i.rounded_rectangle(
        [hole, hole, size - hole, size - hole], radius=int(rad * 0.72), fill=255
    )
    ring = ImageChops_subtract(outer, inner).filter(ImageFilter.GaussianBlur(0.8))

    rgba = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    rgba.paste(tex.convert("RGBA"), mask=ring)
    # inner gold lip
    lip = Image.new("L", (size, size), 0)
    ImageDraw.Draw(lip).rounded_rectangle(
        [hole - 6, hole - 6, size - hole + 6, size - hole + 6],
        radius=int(rad * 0.72),
        outline=255,
        width=5,
    )
    glow = Image.new("RGBA", (size, size), (255, 230, 160, 160))
    rgba = Image.alpha_composite(rgba, Image.merge("RGBA", (*glow.split()[:3], lip)))
    return rgba


def banners() -> None:
    mapping = {
        "aurora.jpg": "aurora.jpg",
        "void.jpg": "void.jpg",
        "solar.jpg": "solar.jpg",
        "ember2.jpg": "ember.jpg",
        "meadow3.jpg": "meadow.jpg",
        "paper4.jpg": "paper.jpg",
    }
    dest = OUT / "banners"
    for src, name in mapping.items():
        im = studio(fit(load(src), (1400, 520)), pad=0.02)
        save_jpg(im, dest / name)


def home() -> None:
    dest = OUT / "home"
    items = {
        "plant.jpg": "plant.jpg",
        "lamp.jpg": "lamp.jpg",
        "sofa.jpg": "sofa.jpg",
        "rug3.jpg": "rug.jpg",
        "poster.jpg": "poster.jpg",
        "shelf.jpg": "shelf.jpg",
        "window.jpg": "window.jpg",
    }
    for src, name in items.items():
        save_jpg(studio(fit(load(src), (900, 900))), dest / name)

    gold = load("gold2.jpg")
    save_jpg(cutout(gold, trophy_mask(900)), dest / "trophy.jpg")


def icons() -> None:
    dest = OUT / "icons"
    gold = load("gold2.jpg")
    save_jpg(cutout(gold, star_mask(900)), dest / "star.jpg")

    ice = load("ice2.jpg")
    # cyan metal shield
    hsv = ice.convert("HSV")
    h, s, v = hsv.split()
    h = h.point(lambda p: 140)
    s = s.point(lambda p: min(255, int(p * 1.4)))
    ice = Image.merge("HSV", (h, s, v)).convert("RGB")
    mixed = Image.blend(fit(gold, (900, 900)), fit(ice, (900, 900)), 0.55)
    save_jpg(cutout(mixed, shield_mask(900), bg=(8, 18, 28)), dest / "shield.jpg")


def frames() -> None:
    dest = OUT / "frames"
    save_png(frame_png(load("gold2.jpg")), dest / "gold.png")
    save_png(frame_png(load("wood-tex.jpg")), dest / "oak.png")
    save_png(frame_png(load("ice2.jpg")), dest / "ice.png")
    save_png(frame_png(load("void.jpg"), hue=40), dest / "void.png")
    save_png(frame_png(load("aurora.jpg"), hue=90), dest / "neon.png")


def main() -> None:
    banners()
    home()
    icons()
    frames()
    print("shop art written to", OUT)


if __name__ == "__main__":
    main()
