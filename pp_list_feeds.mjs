const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;
if(!url||!key){ console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_KEY"); process.exit(1); }

const headers = { apikey:key, Authorization:`Bearer ${key}` };

async function main(){
  // pull a big page; tune if you’ve got massive volume
  const r = await fetch(`${url}/rest/v1/ingest_items?select=id,title,kind,updated_at,source_meta&limit=20000`, { headers });
  if(!r.ok){ console.error("supabase error", r.status, await r.text()); process.exit(1); }
  const rows = await r.json();

  // summarize by source_meta.source (for RSS) and channelId (for YT)
  const map = new Map();
  for (const it of rows){
    const src = (it.source_meta && (it.source_meta.source || it.source_meta.channelId)) || "(unknown)";
    const rec = map.get(src) || { src, count:0, latest:null, kinds:new Set() };
    rec.count++;
    rec.kinds.add(it.kind||"");
    const ts = new Date(it.updated_at||0).getTime();
    if (!rec.latest || ts > rec.latest) rec.latest = ts;
    map.set(src, rec);
  }

  const list = [...map.values()]
    .map(x => ({ src: x.src, count: x.count, latest: x.latest ? new Date(x.latest).toISOString() : null, kinds: [...x.kinds].filter(Boolean).join(",") }))
    .sort((a,b)=> (b.latest||0) > (a.latest||0) ? 1 : -1);

  // pretty print
  console.log("source,count,latest,kinds");
  for (const r of list){
    console.log(`${r.src},${r.count},${r.latest||""},${r.kinds}`);
  }
}
main();
