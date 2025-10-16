#!/usr/bin/env bash
set -euo pipefail
mkdir -p logs
source scripts/load_env.sh 2>/dev/null || true
# light curate before each loop
scripts/curate_now.sh || true
echo "🚀 Starting workers (curated only)…"
nohup bash -c '
  while true; do
    echo "⏱ $(date) — cycle begin" | tee -a logs/summary.log
    (node server/ingest/rss_ingest.mjs        2>&1 | tee -a logs/rss.log)        || true
    (node server/ingest/podcasts_ingest.mjs   2>&1 | tee -a logs/podcasts.log)   || true
    (node server/ingest/videos_rss_ingest.mjs 2>&1 | tee -a logs/video_rss.log)  || true
    echo "✅ cycle end" | tee -a logs/summary.log
    sleep 600
  done
' >/dev/null 2>&1 &
echo $! > logs/workers.pid
echo "✅ PID $(cat logs/workers.pid)"
