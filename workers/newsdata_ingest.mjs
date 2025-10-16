import crypto from "node:crypto";

const ND_KEY = process.env.NEWS_DATA_API_KEY
            || process.env.NEWSDATA_IO_API_KEY
            || process.env.NEWSDATA_API_KEY
            || process.env.NEWS_DATA_KEY
            || process.env.NEWS_API_KEY;

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!ND_KEY)  { console.error("❌ Missing NEWS_DATA_API_KEY (or NEWSDATA_IO_API_KEY/NEWSDATA_API_KEY/NEWS_DATA_KEY/NEWS_API_KEY)"); process.exit(1); }
if (!SB_URL)  { console.error("❌ Missing SUPABASE_URL"); process.exit(1); }
if (!SB_KEY)  { console.error("❌ Missing SUPABASE_SERVICE_KEY/ANON_KEY"); process.exit(1); }

const LIMIT = Number((process.argv.find(a=>a.startsWith("--limit="))||"").split("=")[1] || 50);
const THEMES = [
  '(marvel OR "dc comics" OR superhero)',
  '(manga OR anime OR "shonen jump")',
  '(image comics OR "boom studios" OR idw OR "dark horse" OR "titan comics")'
];
const LANG  = 'en';

const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
const sha1  = (s)=>crypto.createHash("sha1").update(String(s)).digest("hex");

async function upsertRows(rows){
  if (!rows.length) return;
  const url = `${SB_URL}/rest/v1/ingest_items?onConflict=id`;
  const r = await fetch(url, {
    method:"POST",
    headers:{
      "apikey": SB_KEY,
      "Authorization": `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates"
    },
    body: JSON.stringify(rows.map(x => ({
      id:x.id,
      title:x.title,
      kind:"news",
      source_url:x.link || null,
      published_at:x.pubDate || x.pub_date || x.date || null
    })))
  });
  if (!r.ok) {
    const t = await r.text().catch(()=>"?");
    console.error("supabase err", r.status, t);
  }
}

async function fetchPage({page=null, theme=''}){
  let url = `https://newsdata.io/api/1/latest?apikey=${ND_KEY}&language=${LANG}&q=${encodeURIComponent(theme)}`;
  if (page) url += `&page=${encodeURIComponent(page)}`;
  const r = await fetch(url);
  const txt = await r.text();
  let data; try { data = JSON.parse(txt); } catch { data = { status:"error", raw:txt }; }
  return { status:r.status, data, raw:txt };
}

function normalize(items=[]) {
  return items.map(it => {
    const id = `news:${it.article_id || sha1(it.link || it.title || JSON.stringify(it))}`;
    const title = it.title || it.description || (it.link || "Untitled");
    return { id, title, link: it.link, pubDate: it.pubDate || it.pub_date || it.date };
  });
}

async function main(){
  let total = 0, themeIdx = 0, nextPage = null;
  let backoff = 1500, maxBackoff = 120000;

  while (total < LIMIT) {
    const theme = THEMES[themeIdx % THEMES.length];
    const { status, data, raw } = await fetchPage({ page: nextPage, theme });

    if (status === 429) { // throttle
      console.error("newsdata 429 (rate limit) — backing off…", backoff, "ms");
      await sleep(backoff); backoff = Math.min(maxBackoff, Math.floor(backoff * 1.8));
      continue;
    }
    if (status === 422) { // bad page/size/nextPage — rotate theme & reset
      console.error("newsdata 422 — resetting pagination and rotating theme");
      nextPage = null; themeIdx++; await sleep(1200); continue;
    }
    if (data.status !== "success") {
      console.error("newsdata error", status, raw?.slice?.(0,300) || raw);
      await sleep(1500); continue;
    }

    // success
    backoff = 1500;
    const items = Array.isArray(data.results?.results)
      ? data.results.results
      : (Array.isArray(data.results) ? data.results : []);
    const rows = normalize(items);
    await upsertRows(rows);
    total += rows.length;

    nextPage = data.nextPage || data.results?.nextPage || null;
    if (!nextPage || items.length === 0) { themeIdx++; nextPage = null; }
    if (total >= LIMIT) break;
    await sleep(1200);
  }

  console.log(`✅ newsdata done total=${total}`);
}

main().catch(e=>{ console.error(e); process.exit(1); });
