#!/usr/bin/env bash
set -euo pipefail

echo "🔍 STACK INSPECTION REPORT"
echo "==========================="

echo
echo "🧠 Node Environment:"
node --version || echo "⚠️ Node not found"
npm --version || echo "⚠️ npm not found"
npx --version || echo "⚠️ npx not found"

echo
echo "📦 TypeScript & tsx:"
tsc --version || echo "⚠️ TypeScript not found"
tsx --version || echo "⚠️ tsx not found"

echo
echo "🐍 Python Environment:"
if command -v python3 &> /dev/null; then
  python3 --version
  pip3 list || echo "⚠️ pip3 not found"
elif command -v python &> /dev/null; then
  python --version
  pip list || echo "⚠️ pip not found"
else
  echo "❌ No Python interpreter found"
fi

echo
echo "🧰 Supabase CLI:"
supabase --version || echo "⚠️ Supabase CLI not found"

echo
echo "🛠️  Replit Metadata:"
echo "REPL_ID:     ${REPL_ID:-not set}"
echo "REPL_OWNER:  ${REPL_OWNER:-not set}"
echo "REPL_SLUG:   ${REPL_SLUG:-not set}"
