import fs from 'node:fs/promises'; import path from 'node:path';
type T = { symbol:string; delta:number };
async function fromSB(){ const U=process.env.SUPABASE_URL||process.env.VITE_SUPABASE_URL; const K=process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.VITE_SUPABASE_ANON_KEY; if(!U||!K) return null;
  const tables=['asset_prices','assetPrices','prices','market_prices','ticker_prices'];
  for(const t of tables){ const u=new URL(`/rest/v1/${t}`,U); u.searchParams.set('select','symbol,price,prev_price,change,change_pct,updated_at'); u.searchParams.set('order','updated_at.desc'); u.searchParams.set('limit','200');
    const r=await fetch(u,{headers:{apikey:K,Authorization:`Bearer ${K}`}}); if(!r.ok) continue; const rows=await r.json(); if(!Array.isArray(rows)||!rows.length) continue;
    const items = rows.map((r:any)=>{const p=+r?.price, pp=+r?.prev_price, cp=+r?.change_pct, ch=+r?.change; let d=Number.isFinite(cp)?cp:(Number.isFinite(p)&&Number.isFinite(pp)&&pp!==0)?(p-pp)/pp:(Number.isFinite(ch)&&Number.isFinite(pp)&&pp!==0)?ch/pp:0; const s=String(r?.symbol||''); return s?{symbol:s,delta:d}:null;}).filter(Boolean).slice(0,80) as T[];
    const updated=rows[0]?.updated_at?new Date(rows[0].updated_at).toISOString():new Date().toISOString(); return {items:items, updated_at:updated, source:'supabase', table:t}; }
  return null; }
async function fromFile(){ try{ const p=path.join(process.cwd(),'server','public','pp','tickers.json'); const raw=await fs.readFile(p,'utf8'); const j=JSON.parse(raw); const list=Array.isArray(j)?j:(Array.isArray(j.tickers)?j.tickers:[]); return {items:list.map((s:any)=>({symbol:String(s),delta:0})), updated_at:new Date().toISOString(), source:'file'}; }catch{ return {items:[], updated_at:new Date().toISOString(), source:'empty'}; } }
export async function getTickerData(){ const sb=await fromSB(); if(sb) return sb; return fromFile(); }
export default { getTickerData };
