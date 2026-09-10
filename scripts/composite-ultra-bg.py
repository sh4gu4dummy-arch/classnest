#!/usr/bin/env python3
"""Cut studio Ultra portraits onto scenic backgrounds (s2 hint / s3 rich)."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path("/workspace")
ULTRA = ROOT / "public/avatars/ultra"
BG_DIR = ROOT / "tmp_images/ultra-bgs"
OUT_BOARD = ULTRA / "board"
ARCHIVE = ROOT / "public/avatars/archive/ultra"

JOBS = [
    ("21-s2", "subtle"),
    ("21-s3", "rich"),
    ("22-s2", "subtle"),
    ("22-s3", "rich"),
    ("23-s2", "subtle"),
    ("23-s3", "rich"),
    ("24-s2", "subtle"),
    ("24-s3", "rich"),
    ("25-s2", "subtle"),
    ("25-s3", "rich"),
]


def local_std(gray: np.ndarray, k: int = 7) -> np.ndarray:
    pad = k // 2
    g = np.pad(gray, pad, mode="edge")
    h, w = gray.shape
    out = np.empty_like(gray)
    # box filter via integral image
    integ = np.pad(g, ((1, 0), (1, 0)), mode="constant")
    integ = integ.cumsum(0).cumsum(1)
    integ2 = np.pad(g * g, ((1, 0), (1, 0)), mode="constant")
    integ2 = integ2.cumsum(0).cumsum(1)
    area = k * k

    def rect(ii, y0, x0, y1, x1):
        return ii[y1, x1] - ii[y0, x1] - ii[y1, x0] + ii[y0, x0]

    # vectorized-ish using stride
    y0 = np.arange(h)
    x0 = np.arange(w)
    # fallback loop is fine at 768
    for y in range(h):
        ys, ye = y, y + k
        row = []
        s = rect(integ, ys, 0, ye, w + k)  # unused, keep simple loop
    # simple loop — 768^2 * tiny is ok
    for y in range(h):
        for x in range(w):
            patch = g[y : y + k, x : x + k]
            out[y, x] = patch.std()
    return out


def local_std_fast(gray: np.ndarray, k: int = 9) -> np.ndarray:
    """Approximate local std with downsample + upsample."""
    im = Image.fromarray(np.clip(gray, 0, 255).astype(np.uint8), "L")
    small = im.resize((im.width // 4, im.height // 4), Image.Resampling.BILINEAR)
    arr = np.array(small).astype(np.float32)
    # 5x5 std on small
    pad = 2
    g = np.pad(arr, pad, mode="edge")
    h, w = arr.shape
    acc = np.zeros_like(arr)
    acc2 = np.zeros_like(arr)
    n = 0
    for dy in range(-2, 3):
        for dx in range(-2, 3):
            sl = g[pad + dy : pad + dy + h, pad + dx : pad + dx + w]
            acc += sl
            acc2 += sl * sl
            n += 1
    mean = acc / n
    var = np.maximum(acc2 / n - mean * mean, 0)
    std = np.sqrt(var)
    std_im = Image.fromarray(np.clip(std * 4, 0, 255).astype(np.uint8), "L")
    return np.array(
        std_im.resize(im.size, Image.Resampling.BILINEAR), dtype=np.float32
    )


def extract_subject(path: Path) -> Image.Image:
    im = Image.open(path).convert("RGBA")
    arr = np.array(im).astype(np.float32)
    h, w, _ = arr.shape
    rgb = arr[:, :, :3]
    border = np.concatenate(
        [
            rgb[:10].reshape(-1, 3),
            rgb[-10:].reshape(-1, 3),
            rgb[:, :10].reshape(-1, 3),
            rgb[:, -10:].reshape(-1, 3),
        ]
    )
    bg = np.median(border, axis=0)
    dist = np.linalg.norm(rgb - bg, axis=2)
    gray = rgb.mean(axis=2)
    std = local_std_fast(gray)

    bdist = np.linalg.norm(border - bg, axis=1)
    t0 = float(np.percentile(bdist, 88) + 10)
    t1 = t0 + 36
    a_color = np.clip((dist - t0) / (t1 - t0), 0, 1)
    a_tex = np.clip((std - 6) / 18, 0, 1)

    yy, xx = np.mgrid[0:h, 0:w]
    cy, cx = h * 0.52, w * 0.5
    r = np.sqrt(((yy - cy) / (h * 0.48)) ** 2 + ((xx - cx) / (w * 0.42)) ** 2)
    a_rad = np.clip(1.15 - r, 0, 1)

    # Combine: inside body trust texture+radius; outside require color
    alpha = np.maximum(a_color, a_tex * 0.85)
    alpha = np.where(r < 0.55, np.maximum(alpha, a_rad * 0.75), alpha)
    alpha = np.where(r > 1.05, alpha * 0.15, alpha)
    # keep bright animal interiors (dove/cat chest)
    alpha = np.where((r < 0.38) & (a_tex > 0.12), np.maximum(alpha, 0.88), alpha)

    alpha_im = Image.fromarray(np.clip(alpha * 255, 0, 255).astype(np.uint8), "L")
    alpha_im = alpha_im.filter(ImageFilter.GaussianBlur(radius=1.6))
    out = im.copy()
    out.putalpha(alpha_im)
    return out


def composite(subject: Image.Image, bg: Image.Image, strength: str) -> Image.Image:
    bg = bg.convert("RGB").resize(subject.size, Image.Resampling.LANCZOS)
    canvas = bg.convert("RGBA")
    # slight subject shadow
    sh = Image.new("RGBA", subject.size, (0, 0, 0, 0))
    sa = subject.split()[-1].filter(ImageFilter.GaussianBlur(10))
    sh.putalpha(sa.point(lambda p: int(p * 0.28)))
    canvas.alpha_composite(sh)
    canvas.alpha_composite(subject)
    # grade
    rgb = np.array(canvas.convert("RGB")).astype(np.float32)
    if strength == "rich":
        rgb = rgb * 1.03 + 4
    else:
        rgb = rgb * 1.01 + 2
    rgb = np.clip(rgb, 0, 255).astype(np.uint8)
    return Image.fromarray(rgb, "RGB")


def main() -> None:
    ARCHIVE.mkdir(parents=True, exist_ok=True)
    OUT_BOARD.mkdir(parents=True, exist_ok=True)
    for stem, strength in JOBS:
        src = ULTRA / f"{stem}.jpg"
        bg_path = BG_DIR / f"{stem}.png"
        if not src.exists() or not bg_path.exists():
            print("skip missing", stem, src.exists(), bg_path.exists())
            continue
        arch = ARCHIVE / f"{stem}-v1-studio.jpg"
        if not arch.exists():
            Image.open(src).save(arch, quality=88)
        sub = extract_subject(src)
        bg = Image.open(bg_path)
        out = composite(sub, bg, strength)
        out_full = out.resize((768, 768), Image.Resampling.LANCZOS)
        out_full.save(src, quality=90, optimize=True)
        out_full.resize((360, 360), Image.Resampling.LANCZOS).save(
            OUT_BOARD / f"{stem}.jpg", quality=88, optimize=True
        )
        print("wrote", stem)


if __name__ == "__main__":
    main()
