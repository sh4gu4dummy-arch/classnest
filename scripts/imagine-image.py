#!/usr/bin/env python3
"""Generate an Imagine still using this session's Grok JWT (not a pasted API key).

    python3 scripts/imagine-image.py --prompt "..." --out public/shop/icons/star.jpg --aspect 1:1

Default model is grok-imagine-image (2026-09-17). grok-imagine-image-2.0 404s
on this login. On HTTP 404 not-found, retry grok-imagine-image once.
Never print ~/.grok/auth.json. Copy --out into public/ the same turn.
"""
from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

AUTH = Path.home() / ".grok" / "auth.json"
API = "https://api.x.ai/v1/images/generations"
LIVE_MODEL = "grok-imagine-image"


def session_jwt() -> str:
    data = json.loads(AUTH.read_text())
    inner = next(iter(data.values()))
    key = inner.get("key") if isinstance(inner, dict) else None
    if not key:
        raise SystemExit("no JWT in ~/.grok/auth.json")
    return key


def generate(prompt: str, aspect: str, model: str) -> str:
    body = {
        "model": model,
        "prompt": prompt,
        "n": 1,
        "aspect_ratio": aspect,
    }
    req = urllib.request.Request(
        API,
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {session_jwt()}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            payload = json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        err = e.read()[:400].decode(errors="replace")
        if e.code == 404 and model != LIVE_MODEL:
            print(f"{model} 404; retry {LIVE_MODEL}", file=sys.stderr)
            return generate(prompt, aspect, LIVE_MODEL)
        raise SystemExit(f"HTTP {e.code}: {err}")
    url = payload["data"][0]["url"]
    if not url:
        raise SystemExit(f"no url in response: {payload}")
    return url


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "ClassNest/imagine-image"})
    with urllib.request.urlopen(req, timeout=60) as r, dest.open("wb") as f:
        f.write(r.read())


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--prompt", required=True)
    p.add_argument("--out", required=True)
    p.add_argument("--aspect", default="1:1")
    p.add_argument("--model", default=LIVE_MODEL)
    args = p.parse_args()
    dest = Path(args.out)
    url = generate(args.prompt, args.aspect, args.model)
    download(url, dest)
    print(f"saved {dest} ({dest.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
