#!/bin/bash

echo "🚀 STARTING PERSISTENT WORKERS..."
echo ""

# Compile TypeScript to JavaScript first
echo "📦 Compiling workers..."
npx esbuild scripts/cover-worker.ts --bundle --platform=node --outfile=scripts/cover-worker.js --external:pg-native --external:@neondatabase/serverless
npx esbuild scripts/fast-generation.ts --bundle --platform=node --outfile=scripts/fast-generation.js --external:pg-native --external:@neondatabase/serverless

echo "✅ Compiled!"
echo ""

# Run with plain node (no tsx)
echo "🎨 Starting cover worker..."
NODE_ENV=development nohup node scripts/cover-worker.js > data/cover-worker.log 2>&1 &
COVER_PID=$!
echo "   PID: $COVER_PID"

echo "📊 Starting generation worker..."
NODE_ENV=development nohup node scripts/fast-generation.js > data/gen-worker.log 2>&1 &
GEN_PID=$!
echo "   PID: $GEN_PID"

echo ""
echo "✅ Both workers started!"
echo ""
echo "📊 Monitor:"
echo "   Covers: tail -f data/cover-worker.log"
echo "   Generation: tail -f data/gen-worker.log"
echo ""

sleep 5

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📸 COVER WORKER:"
tail -5 data/cover-worker.log 2>/dev/null

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 GENERATION WORKER:"
tail -5 data/gen-worker.log 2>/dev/null

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ RUNNING PROCESSES:"
ps aux | grep "node scripts" | grep -v grep
