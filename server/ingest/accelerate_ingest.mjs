import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import Parser from 'rss-parser';
import fetch from 'cross-fetch';

const SB_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const parser = new Parser({
  timeout: 20000,
  headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124' }
});

const SLEEP = ms => new Promise(r => setTimeout(r, ms));
const H = (s) => crypto.createHash('sha256').update(String(s)).digest('hex').slice(0,24);

const ALLOWED = [
  'cbr.com','bleedingcool.com','comicsbeat.com','icv2.com','theguardian.com',
  'hollywoodreporter.com','marvel.com','dc.com','skybound.com','imagecomics.com',
  'polygon.com','ign.com','screenrant.com','avclub.com'
];
const MAX_AGE_DAYS = 60; // keep older for research but cap at ~2 months on first pass

function okUrl(u){
  try{ const {hostname} = new URL(u); return ALLOWED.some(dom => hostname.endsWith(dom)); }
  catch{ return false; }
}
function isFresh(iso){
  const t = new Date(iso||Date.now()).getTime();
  return (Date.now()-t) <= (MAX_AGE_DAYS*86400*1000);
}

async function readList(p){ try{ const t=await fs.readFile(p,'utf8'); return t.split(/\r?\n/).map(x=>x.split('#')[0].trim()).filter(Boolean); }catch{ return []; } }

async function upsert(table, rows){
  if(!rows.length) return 0;
  const url = new URL(`/rest/v1/${table}`, SB_URL);
  const r = await fetch(url, {
    method:'POST',
    headers:{
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type':'application/json',
      Prefer: 'resolution=merge-duplicates'
    },
    body: JSON.stringify(rows)
  });
  if(!r.ok){
    const t = await r.text().catch(()=>'?');
    console.error(`[supabase] ${table} upsert failed: ${r.status} ${t}`);
    return 0;
  }
  return rows.length;
}

async function fetchFeed(url){
  try{
    const f = await parser.parseURL(url);
    return (f.items||[]).map(it => ({
      id: H(it.link||it.guid|| (it.title||''+Math.random())),
      title: it.title || '',
      url: it.link || '',
      source: (f.title||'').trim() || new URL(url).hostname,
      published_at: it.isoDate || it.pubDate || new Date().toISOString()
    }));
  }catch(e){
    return [];
  }
}

async function cycle(){
  const rss = await readList('server/ingest/feeds_news.valid.txt');
  const vid = await readList('server/ingest/feeds_video.valid.txt');
  const aud = await readList('server/ingest/feeds_podcasts.valid.txt');

  // take first 100 candidates each cycle (shuffle to avoid same order)
  function pick100(a){ return a.sort(()=>Math.random()-0.5).slice(0,100); }

  const runGroup = async (label, list, table) =>{
    const chosen = pick100(list);
    const conc = 10; let i=0, pushed=0;
    while(i < chosen.length){
      const batch = chosen.slice(i, i+conc);
      const results = await Promise.all(batch.map(fetchFeed));
      const flat = results.flat()
        .filter(x => x.title && x.url && okUrl(x.url) && isFresh(x.published_at))
        .slice(0, 100); // cap to 100 we intend to push
      // dedupe by url hash per push
      const seen = new Set();
      const rows = flat.filter(x=>{
        const k = H(x.url);
        if(seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      pushed += await upsert(table, rows);
      i += conc;
    }
    console.log(`[accelerate] ${label} pushed ~${pushed}`);
  };

  await runGroup('rss', rss, 'rss_items');
  await runGroup('video', vid, 'video_items');
  await runGroup('audio', aud, 'audio_items');
}

async function main(){
  console.log(`[accelerate] ingest loop start (20s)`);
  while(true){
    try{ await cycle(); }catch(e){ console.error('[accelerate] cycle err', e); }
    await SLEEP(20000);
  }
}
main();
