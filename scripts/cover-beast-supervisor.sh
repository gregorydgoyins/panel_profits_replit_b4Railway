#!/bin/bash

# Kill any existing cover-beast processes
pkill -f "cover-beast.ts" 2>/dev/null

echo "🦁 COVER BEAST SUPERVISOR - AUTO-RESTART MODE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

while true; do
  echo "$(date '+%H:%M:%S') ✅ Starting cover-beast..."
  
  # Start cover-beast in background
  npx tsx scripts/cover-beast.ts > data/beast.log 2>&1 &
  BEAST_PID=$!
  
  echo "$(date '+%H:%M:%S') 📋 PID: $BEAST_PID"
  
  # Monitor the process
  while kill -0 $BEAST_PID 2>/dev/null; do
    sleep 5
  done
  
  echo "$(date '+%H:%M:%S') ❌ Process died - restarting in 3s..."
  sleep 3
done
