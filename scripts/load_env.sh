#!/usr/bin/env bash
set -euo pipefail
export VITE_SUPABASE_URL='https://ghjlzrmuugquumqwlqgl.supabase.co'
export VITE_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdoamx6cm11dWdxdXVtcXdscWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NzI5MDksImV4cCI6MjA2NDI0ODkwOX0.4obVbXotkoG4HFf_meYbSOn5PAqgFsb2KXrEQoMNPEs'
export SUPABASE_SERVICE_ROLE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdoamx6cm11dWdxdXVtcXdscWdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY3MjkwOSwiZXhwIjoyMDY0MjQ4OTA5fQ.MNR1LTmZ113qVoYRsuuaHpXCA9fCdh4bCfZIM745O_M'
export SB_SECRET='sb_secret_WgYatkvIpQOj-Ts8xy_yRA_AiDl-5tS'
export SUPABASE_URL="$VITE_SUPABASE_URL"
export SUPABASE_ANON_KEY="$VITE_SUPABASE_ANON_KEY"
mask(){ v="$1"; [ -z "$v" ] && echo "(missing)" || echo "${v:0:6}...${v: -4}"; }
echo "Env:"
echo "  URL  = $(mask "$VITE_SUPABASE_URL")"
echo "  ANON = $(mask "$VITE_SUPABASE_ANON_KEY")"
echo "  SRK  = $(mask "$SUPABASE_SERVICE_ROLE_KEY")"
