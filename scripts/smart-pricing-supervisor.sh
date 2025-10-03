#!/bin/bash

# Kill any existing smart-real-pricing processes
pkill -f "smart-real-pricing.ts" 2>/dev/null

echo "💰 SMART REAL PRICING SUPERVISOR - AUTO-RESTART MODE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verify DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable not set"
  exit 1
fi

echo "✅ DATABASE_URL verified"
echo ""

while true; do
  echo "$(date '+%H:%M:%S') 💰 Starting smart real pricing..."
  
  # Start smart-real-pricing with explicit env vars
  DATABASE_URL="$DATABASE_URL" \
  PRICECHARTING_API_TOKEN="$PRICECHARTING_API_TOKEN" \
  GOCOLLECT_API_KEY="$GOCOLLECT_API_KEY" \
  npx tsx scripts/smart-real-pricing.ts > /tmp/smart-pricing.log 2>&1 &
  
  WORKER_PID=$!
  
  echo "$(date '+%H:%M:%S') 📋 PID: $WORKER_PID"
  echo "$(date '+%H:%M:%S') 📄 Logs: /tmp/smart-pricing.log"
  
  # Monitor the process
  while kill -0 $WORKER_PID 2>/dev/null; do
    sleep 10
  done
  
  echo "$(date '+%H:%M:%S') ❌ Process died - restarting in 5s..."
  sleep 5
done
