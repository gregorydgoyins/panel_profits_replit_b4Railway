#!/usr/bin/env bash
set -euo pipefail
echo "🔴 Stopping workers…"
pkill -f server/ingest/rss_ingest.mjs        || true
pkill -f server/ingest/podcasts_ingest.mjs   || true
pkill -f server/ingest/videos_rss_ingest.mjs || true
pkill -f scripts/start_workers.sh            || true
sleep 1
pkill -9 -f rss_ingest.mjs        || true
pkill -9 -f podcasts_ingest.mjs   || true
pkill -9 -f videos_rss_ingest.mjs || true
: > logs/rss.log; : > logs/podcasts.log; : > logs/video_rss.log; : > logs/summary.log
echo "✅ Stopped."
