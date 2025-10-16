import { supa, el } from "./pp_env.js";
import { abbreviateForStrip } from "./tickerLegend.js";

function findMount(){
  const ids=["#stk-updates","#stocks","#market","#news"]; for(const i of ids){const n=document.querySelector(i); if(n&&n.parentElement){const slot=el("div",{id:"pp-stk-slot"}); n.parentElement.insertBefore(slot,n.nextSibling); return slot;}}
  const slot=el("div",{id:"pp-stk-slot"}); document.body.append(slot); return slot;
}
function dir(p){ if(p==null) return "•"; if(p>0.15) return "▲"; if(p<-0.15) return "▼"; return "•"; }
function href(sym){ return `/detail/${encodeURIComponent(sym)}`; }

async function loadSymbols(){
  try{ const a=await supa('legend_assets?select=symbol&limit=120'); const list=(a||[]).map(x=>x.symbol).filter(Boolean); if(list.length) return list; }catch{}
  return Array.isArray(window.PP_TICKERS)?window.PP_TICKERS.slice(0,120):["FH:BATMN","I:ASM.v2.800.96.M","R:KIRBY.J","P:MARV","F:CE50","E:PPIX"];
}
async function loadQuotes(symbols){
  try{
    const qs=symbols.slice(0,120).map(s=>`symbol=eq.${encodeURIComponent(abbreviateForStrip(s))}`).join("&or=");
    const rows=await supa(`asset_quotes_latest?select=symbol,price,change_pct&${qs}`);
    const map=new Map(rows.map(r=>[String(r.symbol).toUpperCase(),r]));
    return s=>map.get(String(s).toUpperCase())||null;
  }catch{ return ()=>null; }
}
function render(root,data){
  const css=el("style",{},[`
    #pp-stk-slot{margin:6px 0}.pp-stk{display:flex;gap:10px;overflow-x:auto;padding:6px 8px;background:rgba(0,0,0,.40);border-radius:10px;backdrop-filter:saturate(1.2) blur(4px);align-items:center}
    .pp-chip{padding:4px 10px;border-radius:999px;font:12px/1.2 system-ui,-apple-system,Segoe UI,Roboto;color:#fff;background:rgba(0,0,0,.55);display:inline-flex;gap:8px;align-items:center;white-space:nowrap}
    .pp-chip a{color:inherit;text-decoration:none}.pp-chip:hover{background:rgba(255,255,255,.12)}.pp-ico{font-weight:700}`]);
  const row=el("div",{class:"pp-stk"}); row.append(el("span",{style:{fontWeight:'600',opacity:.85}},["Stk Updates"]));
  for(const it of data){
    row.append(el("span",{class:"pp-chip",title:it.full},[
      el("span",{class:"pp-ico"},[dir(it.change_pct)]),
      el("a",{href:href(it.short)},[it.short]),
      it.price!=null?el("span",{},[`$${Number(it.price).toFixed(2)}`]):el("span",{style:{opacity:.6}},["—"])
    ]));
  }
  root.append(css,row);
}
async function boot(){
  const root=findMount();
  const symbols=await loadSymbols(); if(!symbols.length){console.log("pp: no symbols");return;}
  const getQuote=await loadQuotes(symbols);
  const data=symbols.map(full=>{ const short=abbreviateForStrip(full); const q=getQuote(short); return { full, short, price:q?.price??null, change_pct:q?.change_pct??null };});
  render(root,data);
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot); else boot();
