#!/usr/bin/env bash
set -euo pipefail
pkill -F logs/ingest.pid 2>/dev/null || true
pkill -F logs/tickers.pid 2>/dev/null || true
pkill -f "accelerate_ingest.mjs|accelerate_tickers.mjs" 2>/dev/null || true
echo "🛑 accelerators stopped."
