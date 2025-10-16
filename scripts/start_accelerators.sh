#!/usr/bin/env bash
set -euo pipefail
source scripts/load_env.sh 2>/dev/null || true
mkdir -p logs
node server/ingest/accelerate_ingest.mjs >> logs/summary.log 2>&1 & echo $! > logs/ingest.pid
node server/ingest/accelerate_tickers.mjs >> logs/summary.log 2>&1 & echo $! > logs/tickers.pid
echo "✅ accelerators started (PIDs: $(cat logs/ingest.pid) $(cat logs/tickers.pid))"
