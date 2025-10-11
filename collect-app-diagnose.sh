#!/usr/bin/env bash
set -euo pipefail

echo "=== ENV ======================================================"
echo "PORT env: ${PORT:-<unset>}"
echo

echo "=== WHO OWNS :5000 (if ss not present, ignore errors) ========"
(ss -lptn 'sport = :5000' || true) 2>/dev/null
echo

echo "=== HARD-CODED PORTS (listen(5000), :5000, WS port) ========="
git ls-files | grep -E '\.(ts|js|tsx)$' | xargs -r grep -nE '\.listen\(\s*5000|:5000\b|WebSocketServer\(\s*\{[^}]*port\s*:|new\s+WebSocketServer\(\s*\{[^}]*port' || true
echo

echo "=== server/index.ts (PORT + listen + WS) ====================="
[ -f server/index.ts ] && nl -ba server/index.ts | sed -n '1,220p' || echo "server/index.ts not found"
echo

echo "=== WS services (notification/websocket) ====================="
git ls-files 'server/**/*.ts' | xargs -r grep -nE 'WebSocketServer|ws\.listen|new WebSocketServer|upgrade|wss' || true
echo

echo "=== App imports that break Vite (named vs default) ==========="
[ -f client/src/App.tsx ] && nl -ba client/src/App.tsx | sed -n '1,200p' || echo "client/src/App.tsx not found"
echo

echo "=== Components exports (TopNavbar/StickyHeader/Clocks) ======="
for f in client/src/components/TopNavbar.tsx client/src/components/TopNavBar.tsx client/src/components/StickyHeader.tsx client/src/components/GlobalMarketClocks.tsx; do
  if [ -f "$f" ]; then
    echo "--- $f"
    awk 'NR<=200 && /export|default|function|const|class/ {print NR ":" $0}' "$f"
    echo
  fi
done
echo "=============================================================="
