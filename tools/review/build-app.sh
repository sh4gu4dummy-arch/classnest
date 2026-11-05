#!/usr/bin/env bash
# Rebuild the /app/ preview of ClassNest (base "/app/") from the local clone.
# Works on a temp copy in /tmp. It never writes to the repo.
set -euo pipefail
REPO=${REPO:-/workspace/classnest-audit}
OUT=$(cd "$(dirname "$0")" && pwd)/app-build
T=/tmp/cn-app
rm -rf "$T" && mkdir -p "$T"
(cd "$REPO" && tar --exclude=./node_modules --exclude=./.git --exclude=./public --exclude=./offline \
  --exclude=./dist-portable --exclude=./tmp_images --exclude=./android -cf - .) | (cd "$T" && tar xf -)
ln -s "$REPO/node_modules" "$T/node_modules"
sed -e 's#base: "/"#base: "/app/"#' -e 's#outDir: "dist-portable"#outDir: "dist-app"#' \
  "$T/vite.portable.config.ts" > "$T/vite.app.config.ts"
(cd "$T" && VITE_AUTH_ENABLED=false VITE_PORTABLE=true npx vite build --config vite.app.config.ts >/dev/null)
rm -rf "$OUT" && mkdir -p "$OUT"
cp "$T/dist-app/client/_shell.html" "$OUT/index.html"
cp -r "$T/dist-app/client/assets" "$OUT/assets"
find "$OUT" -name '*.map' -delete
# The prerendered shell can name a CSS hash that the client build didn't emit
# (seen with base "/app/"). Point any missing /app/assets/<name>-<hash>.<ext> at the real file.
python3 - "$OUT" <<'PY'
import os, re, sys
out = sys.argv[1]; idx = os.path.join(out, "index.html"); html = open(idx, "rb").read()
have = os.listdir(os.path.join(out, "assets"))
for ref in sorted(set(re.findall(rb"/app/assets/([\w.-]+)", html))):
    name = ref.decode()
    if name in have: continue
    m = re.match(r"(.+)-[\w]+(\.\w+)$", name)
    cand = [f for f in have if m and f.startswith(m.group(1) + "-") and f.endswith(m.group(2))]
    if len(cand) == 1:
        html = html.replace(ref, cand[0].encode()); print(f"fixed {name} -> {cand[0]}")
    else:
        print(f"WARNING: missing {name}", file=sys.stderr)
open(idx, "wb").write(html)
PY
cp "$REPO/VERSION" "$OUT/VERSION"
echo "app-build/ rebuilt for v$(cat "$OUT/VERSION")"
