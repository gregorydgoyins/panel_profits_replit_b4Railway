#!/usr/bin/env bash
set -euo pipefail
echo "🔴 Stopping workers + servers…"
scripts/stop_workers.sh 2>/dev/null || true
pkill -f "rss_ingest|podcasts_ingest|videos_rss_ingest|start_workers" 2>/dev/null || true
pkill -f "node .*server" 2>/dev/null || true
pkill -f "vite|next|remix|nuxt|astro|webpack|http-server|serve" 2>/dev/null || true
pkill -f "python3 -m http.server" 2>/dev/null || true
echo "✅ Stopped. Logs are preserved in ./logs/"
