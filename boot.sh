#!/usr/bin/env bash
set -euo pipefail

# Create python venv for scraping agents (optional)
[ ! -d .venv ] && python3 -m venv .venv && echo "✅ Python venv created"
source .venv/bin/activate && echo "✅ Python venv activated"

# Install Python packages if requirements.txt exists
[ -f requirements.txt ] && pip install -r requirements.txt

# Reinstall node modules if needed
[ -f package.json ] && [ ! -d node_modules ] && echo "📦 Installing npm packages..." && npm install || true

# Run server or tsx dev script
if [ -f server/index.ts ]; then
  echo "🚀 Launching app with tsx..."
  npx tsx server/index.ts
else
  echo "⚠️ server/index.ts not found. Please add your app entrypoint."
fi
