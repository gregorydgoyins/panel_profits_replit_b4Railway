#!/usr/bin/env bash
set -euo pipefail
# Light top-up: if we slip under 100, run discovery again before curate
need() {
  local f="$1"; [ ! -f "$f" ] && echo 1 && return
  local n; n=$(wc -l < "$f" || echo 0); [ "$n" -lt 100 ] && echo 1 || echo 0
}
if [ "$(need server/ingest/feeds_podcasts.valid.txt)" = "1" ]; then node server/ingest/discover_podcasts.mjs || true; fi
if [ "$(need server/ingest/feeds_video.valid.txt)"    = "1" ]; then node server/ingest/discover_youtube.mjs  || true; fi
if [ "$(need server/ingest/feeds_news.valid.txt)"     = "1" ]; then node server/ingest/discover_news.mjs     || true; fi
CURATE_TARGET="${CURATE_TARGET:-100}" node server/ingest/curate_feeds.mjs all || true
for f in server/ingest/feeds_*\.valid\.txt; do [ -f "$f" ] && printf "%3d  %s\n" "$(wc -l < "$f")" "$f"; done
