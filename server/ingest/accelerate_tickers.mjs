import fetch from 'cross-fetch';

const SB_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const SLEEP = ms => new Promise(r => setTimeout(r, ms));

async function readPrices(){
  const tables = ['asset_prices','assetPrices','prices','market_prices','ticker_prices'];
  for(const t of tables){
    const u = new URL(`/rest/v1/${t}`, SB_URL);
    u.searchParams.set('select','symbol,price,prev_price,change,change_pct,updated_at');
    u.searchParams.set('order','updated_at.desc');
    u.searchParams.set('limit','200');
    const r = await fetch(u,{headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`}});
    if(r.ok){
      const rows = await r.json();
      if(Array.isArray(rows) && rows.length) return rows;
    }
  }
  return [];
}

function asDelta(r){
  const p=+r?.price, pp=+r?.prev_price, cp=+r?.change_pct, ch=+r?.change;
  if(Number.isFinite(cp)) return cp;
  if(Number.isFinite(p)&&Number.isFinite(pp)&&pp!==0) return (p-pp)/pp;
  if(Number.isFinite(ch)&&Number.isFinite(pp)&&pp!==0) return ch/pp;
  return 0;
}

async function upsert(items){
  if(!items.length) return;
  const u = new URL('/rest/v1/ticker_stream', SB_URL);
  const r = await fetch(u, {
    method:'POST',
    headers:{
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type':'application/json',
      Prefer:'resolution=merge-duplicates'
    },
    body: JSON.stringify(items.map(x=>({
      symbol: x.symbol,
      delta: x.delta,
      updated_at: x.updated_at
    })))
  });
  if(!r.ok){ console.error('[tickers] upsert fail', r.status); }
}

async function cycle(){
  const rows = await readPrices();
  const m = new Map();
  for(const r of rows){
    const s = String(r.symbol||'').trim();
    if(!s) continue;
    if(!m.has(s)) m.set(s, {symbol:s, delta:asDelta(r), updated_at: r.updated_at || new Date().toISOString()});
  }
  const arr = Array.from(m.values()).slice(0,100);
  await upsert(arr);
  console.log(`[tickers] pushed ${arr.length}`);
}

async function main(){
  console.log('[tickers] loop start (30s)');
  while(true){
    try{ await cycle(); }catch(e){ console.error('[tickers] cycle err', e); }
    await SLEEP(30000);
  }
}
main();
