#!/bin/bash

# Kill any existing pinecone-mass-expansion processes
pkill -f "pinecone-mass-expansion.ts" 2>/dev/null

echo "🌲 PINECONE MASS EXPANSION SUPERVISOR - AUTO-RESTART MODE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verify DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable not set"
  exit 1
fi

echo "✅ DATABASE_URL verified"
echo ""

while true; do
  echo "$(date '+%H:%M:%S') 🚀 Starting Pinecone mass expansion..."
  
  # Start pinecone-mass-expansion with explicit env vars
  DATABASE_URL="$DATABASE_URL" \
  PINECONE_API_KEY="$PINECONE_API_KEY" \
  PINECONE_INDEX_NAME="$PINECONE_INDEX_NAME" \
  OPENAI_API_KEY="$OPENAI_API_KEY" \
  npx tsx scripts/pinecone-mass-expansion.ts > /tmp/pinecone-expansion.log 2>&1 &
  
  WORKER_PID=$!
  
  echo "$(date '+%H:%M:%S') 📋 PID: $WORKER_PID"
  echo "$(date '+%H:%M:%S') 📄 Logs: /tmp/pinecone-expansion.log"
  
  # Monitor the process
  while kill -0 $WORKER_PID 2>/dev/null; do
    sleep 10
  done
  
  echo "$(date '+%H:%M:%S') ❌ Process died - restarting in 5s..."
  sleep 5
done
