#!/usr/bin/env bash
set -euo pipefail
mkdir -p logs

# source so exports stick
source scripts/load_env.sh

echo "✅ Env ready. Starting workers…"
while true; do
  echo "⏱ $(date) — cycle begin" | tee -a logs/summary.log
  (node server/ingest/rss_ingest.mjs     2>&1 | tee -a logs/rss.log) || true
  (node server/ingest/youtube_ingest.mjs 2>&1 | tee -a logs/youtube.log) || true
  echo "✅ cycle end" | tee -a logs/summary.log
  tail -n 10 logs/rss.log || true
  [ -f logs/youtube.log ] && tail -n 5 logs/youtube.log || true
  sleep 600
done
