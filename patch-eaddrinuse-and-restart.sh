#!/usr/bin/env bash
set -euo pipefail

echo "🛠 Patching server/index.ts to (1) honor PORT and (2) swallow duplicate listen…"

# 1) Ensure PORT comes from env (fallback 5000)
sed -i -E 's/const[[:space:]]+PORT[[:space:]]*=[[:space:]]*5000/const PORT = Number(process.env.PORT) || 5000/g' server/index.ts || true

# 2) Ensure we capture the returned http.Server as `server`
#    If there is "app.listen(", rewrite first occurrence to "const server = app.listen("
if grep -q 'app\.listen\(' server/index.ts; then
  # only rewrite the first occurrence
  perl -0777 -pe 's/app\.listen\(/const server = app.listen(/s' -i server/index.ts
fi

# 3) Inject a safe error handler for EADDRINUSE (only once)
if ! grep -q 'server\.on\(.*EADDRINUSE' server/index.ts; then
  # Append right after the first "const server = app.listen("
  perl -0777 -pe 's|(const server = app\.listen\([^)]*\)\s*;\s*)|\1\n// tolerate double-start during dev hot-reload\nserver.on("error",(err: any)=>{\n  if (err && err.code === "EADDRINUSE") {\n    console.warn("[dev] Port already in use; skipping second bind. (Non-fatal)");\n    return; // swallow the duplicate bind during dev\n  }\n  throw err;\n});\n|s' -i server/index.ts
fi

# 4) Kill anything on $PORT (prefer Replit’s $PORT; else 5000)
PORT_WANT="${PORT:-5000}"
echo "🧹 Freeing :$PORT_WANT…"
npx --yes kill-port "$PORT_WANT" >/dev/null 2>&1 || true
fuser -k "$PORT_WANT/tcp"        >/dev/null 2>&1 || true
pkill -9 -f "server/index.ts"    >/dev/null 2>&1 || true
pkill -9 -f "node .*:$PORT_WANT" >/dev/null 2>&1 || true
pkill -9 -f "vite"               >/dev/null 2>&1 || true

# 5) Clear Vite cache (if present)
rm -rf client/.vite 2>/dev/null || true

# 6) Start dev (let platform inject PORT; if not set, we use 5000)
echo "🚀 Starting dev (PORT=${PORT:-5000})"
npm run dev
