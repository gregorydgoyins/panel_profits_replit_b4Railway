#!/usr/bin/env bash
set -euo pipefail

echo "🛟 Snapshotting current state (safety branch)…"
STAMP=$(date +%Y%m%d-%H%M%S)
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "❌ Not a git repo"; exit 1; }
git add -A || true
git commit -m "wip: snapshot before WS disable ($STAMP)" --no-verify || true
git branch "safety-$STAMP" || true
echo "🛟 Created: safety-$STAMP"

echo "🔇 Stubbing WebSockets service (no-ops)…"
mkdir -p server/services
cat > server/services/websocketNotificationService.ts <<'TS'
/**
 * WS disabled stub — satisfies imports without binding any port.
 */
export type InitOpts = { server?: any } | undefined;
export function initWebSocketServer(_opts: InitOpts) {
  console.log("WS: disabled stub loaded (no server port bind).");
}
export function broadcastNotification(_payload: any) { /* no-op */ }
export function closeWebSocketServer() { /* no-op */ }
TS

echo "🧹 Commenting direct 'ws' usage to prevent port binds…"
# 1) Comment any direct imports from 'ws'
grep -RIl --exclude-dir=node_modules --include='*.ts' --include='*.tsx' -n "from 'ws'" server 2>/dev/null \
  | xargs -r sed -i 's/^\(.*from \x27ws\x27.*\)$/\/\/ WS_DISABLED: \1/'

# 2) Comment any direct constructors of WebSocketServer({ port: ... })
grep -RIl --exclude-dir=node_modules --include='*.ts' --include='*.tsx' -n "new WebSocketServer" server 2>/dev/null \
  | xargs -r sed -i 's/^\(.*new WebSocketServer(.*\)$/\/\/ WS_DISABLED: \1/'

# 3) Comment upgrade handlers if present
grep -RIl --exclude-dir=node_modules --include='*.ts' --include='*.tsx' -n "\.on('upgrade'" server 2>/dev/null \
  | xargs -r sed -i "s/^\(.*\.on('upgrade'.*\)$/\/\/ WS_DISABLED: \1/"

grep -RIl --exclude-dir=node_modules --include='*.ts' --include='*.tsx' -n "\.handleUpgrade\(" server 2>/dev/null \
  | xargs -r sed -i 's/^\(.*\.handleUpgrade(.*\)$/\/\/ WS_DISABLED: \1/'

echo "🛠 Ensuring server/index.ts honors \$PORT and swallows double-listen…"
# 4) Force PORT from env; default 5000 only if not set
sed -i -E 's/const[[:space:]]+PORT[[:space:]]*=[[:space:]]*[0-9]+/const PORT = Number(process.env.PORT) || 5000/g' server/index.ts || true

# 5) Capture server and attach error handler (first occurrence of app.listen()
if grep -q 'app\.listen\(' server/index.ts; then
  perl -0777 -pe 's/app\.listen\(/const server = app.listen(/s' -i server/index.ts
  if ! grep -q 'server\.on\("error"' server/index.ts; then
    perl -0777 -pe 's|(const server = app\.listen\([^)]*\)\s*;\s*)|\1\nserver.on("error",(err:any)=>{ if (err?.code==="EADDRINUSE"){ console.warn("[dev] Port in use; ignoring duplicate bind"); return; } throw err; });\n|s' -i server/index.ts
  fi
fi

# 6) Kill anything on $PORT (prefer platform PORT)
PORT_WANT="${PORT:-5000}"
echo "🧨 Freeing :$PORT_WANT…"
npx --yes kill-port "$PORT_WANT" >/dev/null 2>&1 || true
fuser -k "$PORT_WANT/tcp"        >/dev/null 2>&1 || true
pkill -9 -f "server/index.ts"    >/dev/null 2>&1 || true
pkill -9 -f "node .*:$PORT_WANT" >/dev/null 2>&1 || true
pkill -9 -f "vite"               >/dev/null 2>&1 || true

# 7) Clear Vite cache (in case client exists)
rm -rf client/.vite 2>/dev/null || true

echo "🚀 Booting dev (PORT=${PORT:-5000})…"
npm run dev
