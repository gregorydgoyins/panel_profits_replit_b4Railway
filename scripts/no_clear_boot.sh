#!/usr/bin/env bash
set -euo pipefail

echo "🧰 No-clear boot starting… (no screen wipes)"
# 0) env + guard noisy margin job
source scripts/load_env.sh 2>/dev/null || true
export SKIP_MARGIN=1

# 1) don’t clear logs; just ensure they exist
touch logs/app_launch.log logs/rss.log logs/podcasts.log logs/video_rss.log logs/summary.log

# 2) make sure the strips exist (static preview uses them)
if [ ! -f server/public/pp/pp_boot.js ] || [ ! -f server/public/pp/tickerLegend.js ]; then
  mkdir -p server/public/pp
  cat > server/public/pp/tickerLegend.js <<'JS'
export function abbreviateForStrip(t){const[h]=String(t).split(";");return h.replace(".V1","").replace(".V","v");}
JS
  cat > server/public/pp/pp_boot.js <<'JS'
import {abbreviateForStrip} from "./tickerLegend.js";
const SUPABASE_URL="https://ghjlzrmuugquumqwlqgl.supabase.co";
const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdoamx6cm11dWdxdXVtcXdscWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NzI5MDksImV4cCI6MjA2NDI0ODkwOX0.4obVbXotkoG4HFf_meYbSOn5PAqgFsb2KXrEQoMNPEs";
const el=(t,a={},...c)=>{const e=document.createElement(t);for(const[k,v] of Object.entries(a)){if(k==="class")e.className=v;else if(k==="style"&&v&&typeof v==="object")Object.assign(e.style,v);else e.setAttribute(k,v)}for(const n of c.flat())e.append(n);return e};
const style=el("style",{},`.pp-bar{position:sticky;top:0;left:0;right:0;z-index:2147483646;display:flex;flex-direction:column;gap:6px;padding:6px 8px;backdrop-filter:saturate(1.1) blur(4px)}.pp-row{display:flex;gap:10px;align-items:center;overflow-x:auto;white-space:nowrap;padding:6px 8px;border-radius:10px}.pp-chip,.pp-news{display:inline-flex;gap:8px;align-items:center;border-radius:999px;padding:4px 10px;font:12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial;text-decoration:none}.pp-chip{background:rgba(0,0,0,.55);color:#fff}.pp-news{background:rgba(255,255,255,.9);color:#111}.pp-chip:hover{background:rgba(255,255,255,.14)}.pp-news:hover{background:#fff}.pp-tag{font-weight:700;letter-spacing:.3px;opacity:.8}.pp-head{font:11px/1.1 system-ui;opacity:.8;margin-right:6px;padding:2px 6px;border-radius:6px;background:rgba(0,0,0,.1)}.pp-up::before{content:"▲ "}.pp-down::before{content:"▼ "}.pp-flat::before{content:"■ "}`);
document.head.append(style);
function mount(){const fc=document.body.firstElementChild;const w=el("div",{id:"pp-strips",class:"pp-bar"});if(fc)document.body.insertBefore(w,fc);else document.body.append(w);return w;}
function link(sym){const s=encodeURIComponent(sym);return document.querySelector("a[href^='/detail/']")?`/detail/${s}`:`#/detail/${s}`;}
function cls(d){if(typeof d!=="number")return"pp-flat";if(d>1e-4)return"pp-up";if(d<-1e-4)return"pp-down";return"pp-flat";}
function pct(d){if(typeof d!=="number"||!isFinite(d))return"";const p=(d*100).toFixed(1)+"%";return d>0?`+${p}`:p;}
async function sb(table, select, limit){const u=new URL(`/rest/v1/${table}`,SUPABASE_URL);u.searchParams.set("select",select);u.searchParams.set("order","published_at.desc");u.searchParams.set("limit",String(limit));const r=await fetch(u,{headers:{apikey:SUPABASE_ANON_KEY,Authorization:`Bearer ${SUPABASE_ANON_KEY}`}});if(!r.ok)throw 0;return r.json();}
async function loadNews(){try{const[r,v,a]=await Promise.all([sb("rss_items","title,url,source,published_at",20),sb("video_items","title,url,source,published_at",10),sb("audio_items","title,url,source,published_at",10)]);const items=[...r,...v,...a].filter(x=>x?.title&&x?.url).sort((A,B)=>new Date(B.published_at||0)-new Date(A.published_at||0)).slice(0,30);localStorage.setItem("pp:lastNews",JSON.stringify({t:Date.now(),items}));return items;}catch{const c=JSON.parse(localStorage.getItem("pp:lastNews")||"{}");return Array.isArray(c.items)?c.items:[{title:"Sample: ASM #300 high",url:"#",source:"SAMPLE"}];}}
async function loadTickers(){try{const r=await fetch("/api/market/ticker");const j=await r.json();if(Array.isArray(j?.items)&&j.items.length)return j.items;}catch{}try{const injected=JSON.parse(localStorage.getItem("pp:tickers")||"[]");if(injected.length)return injected.map(s=>({symbol:s,delta:0}));}catch{}return[{symbol:"I:ASM.v2.800.96.M",delta:.01},{symbol:"FH:BATMN",delta:-.02},{symbol:"R:KIRBY.J",delta:0}];}
function rowNews(items){const r=el("div",{class:"pp-row",style:{background:"rgba(255,255,255,.25)"}});r.append(el("span",{class:"pp-head"},"BREAKING NEWS"));items.forEach(it=>r.append(el("a",{class:"pp-news",href:it.url,target:"_blank",rel:"noopener"},el("span",{class:"pp-tag"},(it.source||"").toUpperCase().slice(0,12)),el("span",{},it.title||""))));return r;}
function rowStocks(items){const r=el("div",{class:"pp-row",style:{background:"rgba(0,0,0,.25)"}});r.append(el("span",{class:"pp-head"},"STK UPDATES"));items.forEach(t=>{const s=abbreviateForStrip(t.symbol||t);r.append(el("a",{class:"pp-chip",href:link(s)},el("span",{class:"pp-tag"},s),el("span",{class:cls(t.delta)},pct(t.delta))))});return r;}
async function boot(){const root=mount();const[news,stocks]=await Promise.all([loadNews(),loadTickers()]);root.replaceChildren(rowNews(news),rowStocks(stocks));setInterval(async()=>{const fresh=await loadNews();const bar=document.getElementById("pp-strips");if(bar&&bar.firstChild)bar.replaceChild(rowNews(fresh),bar.children[0]);},300000);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot); else boot();
JS
  echo "✅ strips ready for static preview"
fi

# 3) start workers (quiet)
scripts/start_workers.sh >> logs/summary.log 2>&1 || true

# 4) always start a static preview on port 8000 (fallback UI)
STATIC_PORT="${STATIC_PORT:-8000}"
PREV_DIR="server/public"
[ -d "$PREV_DIR" ] || PREV_DIR="public"
[ -d "$PREV_DIR" ] || PREV_DIR="."
# prefer npx serve → python http.server
if command -v npx >/dev/null 2>&1; then
  ( npx --yes serve -l ${STATIC_PORT} -s "$PREV_DIR" >> logs/app_launch.log 2>&1 & echo $! > logs/static.pid )
else
  ( python3 -m http.server ${STATIC_PORT} -d "$PREV_DIR" >> logs/app_launch.log 2>&1 & echo $! > logs/static.pid )
fi
echo "🌐 Static preview: http://localhost:${STATIC_PORT}"

# 5) try to start the app server on PORT (3000 by default)
: > logs/app_launch.log
PM="npm"; command -v pnpm >/dev/null 2>&1 && PM="pnpm"; command -v yarn >/dev/null 2>&1 && PM="yarn"
START=""
if [ -f package.json ]; then
  jq -e '.scripts.dev' package.json >/dev/null 2>&1 && START="$PM run dev"
  jq -e '.scripts.start' package.json >/dev/null 2>&1 && [ -z "$START" ] && START="$PM start"
fi
[ -z "$START" ] && [ -f server/index.ts ] && START="node --loader ts-node/esm server/index.ts"
[ -z "$START" ] && [ -f server/main.ts ]  && START="node --loader ts-node/esm server/main.ts"
[ -z "$START" ] && [ -f server/index.js ] && START="node server/index.js"
[ -z "$START" ] && [ -f server/app.js ]   && START="node server/app.js"

if [ -n "$START" ]; then
  echo "🚀 App start: $START (PORT=${PORT})"
  ( $START >> logs/app_launch.log 2>&1 & echo $! > logs/app.pid )
else
  echo "⚠️ Could not detect app server entry. Static preview is running."
fi

# 6) steady status loop (no screen clear)
APP_URL="http://localhost:${PORT}"
printf "\n⏳ Waiting for app at %s\n" "$APP_URL"
for i in $(seq 1 30); do
  if curl -fsS "$APP_URL/api/market/ticker" >/dev/null 2>&1; then
    echo "✅ App is responding on ${APP_URL}"
    break
  else
    printf "   [%02d/30] not up yet… " "$i"
    date +"%H:%M:%S"
    sleep 1
  fi
done

echo
echo "🔎 Recent logs (tail -n 20):"
echo "— app_launch.log —"; tail -n 20 logs/app_launch.log || true
echo "— summary.log —";    tail -n 20 logs/summary.log || true

echo
echo "🖼 Open one of these:"
echo "   • Static UI (always up):  http://localhost:${STATIC_PORT}"
echo "   • App (when ready):       ${APP_URL}"
echo "   Tip: keep this window open; it won’t clear itself."
