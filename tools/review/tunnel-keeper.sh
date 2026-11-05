#!/bin/bash
# Quiet keeper: no pings. Watches cloudflared's own log; if Cloudflare says the quick tunnel was deleted
# ("Tunnel not found", happens after the box is frozen/restored), starts a fresh tunnel. New URL -> tunnel-url.txt
cd /workspace/classnest-review
while true; do
  if ! pgrep -f "cloudflared tunnel --url http://127.0.0.1:8931" >/dev/null || grep -aq "Tunnel not found" tunnel-quic.log; then
    echo "$(date -u +%FT%TZ) restarting" >> tunnel-keeper.log
    ./start-preview.sh >> tunnel-keeper.log 2>&1
  fi
  sleep 30
done
