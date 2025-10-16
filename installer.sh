#!/usr/bin/env bash
set -euo pipefail
[ -x scripts/stop_workers.sh ] && scripts/stop_workers.sh || true
pkill -f tail 2>/dev/null || true
stty sane 2>/dev/null || true
printf '\e[2J\e[3J\e[H'
mkdir -p logs
: > logs/rss.log; : > logs/podcasts.log; : > logs/video_rss.log; : > logs/summary.log
scripts/start_workers.sh
sleep 1
printf '\e[2J\e[3J\e[H'
echo "📡 Live logs (Ctrl+C exits the view only):"
tail -n 80 -f logs/summary.log logs/rss.log logs/podcasts.log logs/video_rss.log
