#!/usr/bin/env bash
set -euo pipefail
echo "🔎 Validating podcast feeds…"
node server/ingest/validate_feeds.mjs pods
echo "🔎 Validating video feeds…"
node server/ingest/validate_feeds.mjs video
echo "✅ Validation complete."
