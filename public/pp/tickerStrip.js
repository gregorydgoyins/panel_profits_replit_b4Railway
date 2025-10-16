import { makeTicker, abbreviateForStrip } from "./tickerLegend.js";
function qs(s){return document.querySelector(s)}
function el(t,a={},c=[]){const e=document.createElement(t);for(const[k,v]of Object.entries(a||{})){k==="class"?e.className=v:k==="style"&&v&&typeof v==="object"?Object.assign(e.style,v):v!=null&&e.setAttribute(k,v)};(c||[]).forEach(x=>e.append(x));return e}
function findMount(){const cands=["#news-ticker","[data-widget='news-ticker']", ".news-strip","#topNews","#news"];for(const c of cands){const n=qs(c);if(n&&n.parentElement){const slot=el("div",{id:"pp-ticker-slot"});n.parentElement.insertBefore(slot,n.nextSibling);return slot}}const slot=el("div",{id:"pp-ticker-slot"});document.body.append(slot);return slot}
function toHref(sym){return `/detail/${encodeURIComponent(sym)}`}
function renderStrip(root,tickers){const style=el("style",{},[`
  #pp-ticker-slot{margin-top:6px}
  .pp-strip{display:flex;gap:8px;align-items:center;overflow-x:auto;white-space:nowrap;padding:6px 8px;background:rgba(0,0,0,.35);border-radius:8px;backdrop-filter:saturate(1.2) blur(2px)}
  .pp-chip{padding:3px 8px;border-radius:999px;font:12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial;color:#fff;background:rgba(0,0,0,.6);display:inline-flex;gap:6px;align-items:center}
  .pp-chip a{color:inherit;text-decoration:none}
  .pp-chip:hover{background:rgba(255,255,255,.12)}
`]); root.append(style); const row=el("div",{class:"pp-strip","data-pp":"legend-strip"}); for(const t of tickers){const short=abbreviateForStrip(t); const a=el("a",{href:toHref(short)},[short]); const chip=el("span",{class:"pp-chip",title:t},[a]); row.append(chip)} root.append(row)}
function sampleTickers(){const parts=[{classCode:"I",base:"ASM",volume:2,issue:800,grade:96,era:"M"},{classCode:"FH",base:"BATMN"},{classCode:"H",base:"HOURM"},{classCode:"R",base:"KIRBY.J"},{classCode:"P",base:"MARV"},{classCode:"F",base:"CE50"},{classCode:"E",base:"PPIX"},{classCode:"O",base:"ASM",issue:300,era:"M",instr:{kind:"CALL",expiry:"202512",strike:150}}]; return parts.map(makeTicker)}
function shouldShow(){ if (window.SHOW_NEW_TICKERS==="1") return true; try{return localStorage.getItem("pp:showTicker")==="1"}catch(e){return true} }
function boot(){ if(!shouldShow())return; const slot=findMount(); const provided=Array.isArray(window.PP_TICKERS)?window.PP_TICKERS:null; const tickers=provided&&provided.length?provided:sampleTickers(); renderStrip(slot,tickers) }
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot); else boot();
