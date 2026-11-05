#!/bin/bash
# Restart preview after a box restart: hosts pins, node server, plain QUIC quick tunnel. Prints the new URL.
cd /workspace/classnest-review
grep -q region1.v2.argotunnel.com /etc/hosts || printf '198.41.192.7   region1.v2.argotunnel.com\n198.41.200.33  region2.v2.argotunnel.com\n' | sudo tee -a /etc/hosts >/dev/null
pgrep -f "node server.mjs" >/dev/null || nohup node server.mjs > server.log 2>&1 &
pkill -f "cloudflared tunnel --url http://127.0.0.1:8931"; sleep 2
nohup /home/box/bin/cloudflared tunnel --url http://127.0.0.1:8931 --no-autoupdate --metrics 127.0.0.1:20250 > tunnel-quic.log 2>&1 &
for i in $(seq 1 20); do sleep 2; U=$(grep -ao 'https://[a-z0-9-]*\.trycloudflare\.com' tunnel-quic.log | head -1); [ -n "$U" ] && break; done
echo "$U" | tee tunnel-url.txt
