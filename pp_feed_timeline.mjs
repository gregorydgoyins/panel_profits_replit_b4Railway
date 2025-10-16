const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;
if(!url||!key){ console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_KEY"); process.exit(1); }
const headers = { apikey:key, Authorization:`Bearer ${key}` };

function getArg(name){ const a=process.argv.find(x=>x.startsWith(`--${name}=`)); return a ? a.split("=")[1] : null; }
const source = getArg("source");
if(!source){ console.error("Usage: node pp_feed_timeline.mjs --source=<feed URL or channelId>"); process.exit(1); }

async function main(){
  // fetch a big window, then filter client-side by source (jsonb filter in REST is awkward)
  const r = await fetch(`${url}/rest/v1/ingest_items?select=id,title,kind,updated_at,source_meta&limit=20000`, { headers });
  if(!r.ok){ console.error("supabase error", r.status, await r.text()); process.exit(1); }
  const rows = await r.json();

  const filt = rows.filter(it => {
    const src = it.source_meta && (it.source_meta.source || it.source_meta.channelId) || "";
    return src === source;
  });

  // group by day
  const byDay = new Map();
  for (const it of filt){
    const day = (it.updated_at || "").slice(0,10);
    const arr = byDay.get(day) || [];
    arr.push(it);
    byDay.set(day, arr);
  }
  const days = [...byDay.entries()].sort((a,b)=> a[0] < b[0] ? -1 : 1);

  for (const [day, items] of days){
    console.log(`\n# ${day}  (${items.length})`);
    for (const it of items.sort((a,b)=> (a.updated_at||"") < (b.updated_at||"") ? -1 : 1)){
      const title = (it.title||"").replace(/\s+/g," ").slice(0,120);
      console.log(`- [${it.kind}] ${title}  (${it.updated_at})  id=${it.id}`);
    }
  }
  console.log(`\nTotal for source="${source}": ${filt.length}`);
}
main();
