const SB = { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_KEY };
if (!SB.url || !SB.key) { console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY"); process.exit(1); }

function arg(name, def){ const a = process.argv.find(x=>x.startsWith(`--${name}=`)); return a ? a.split("=")[1] : def; }
const START = arg("start", new Date(Date.now()-48*3600*1000).toISOString());
const END   = arg("end",   new Date().toISOString());

// Expand this list to anything you remember having:
const CANDIDATES = [
  // our new pipeline
  "ingest_items",
  // common names folks use
  "news", "news_items", "news_articles", "articles", "articles_raw",
  "rss", "rss_items", "feed_entries", "feeds", "content", "content_items",
  "videos", "youtube_items", "yt_items", "yt_videos",
  // project-y names you might’ve used
  "market_events", "events", "documents", "stories", "story_items", "source_items"
];

const headers = { apikey: SB.key, Authorization: `Bearer ${SB.key}` };

async function tryTable(t) {
  const q1 = `?select=id,title,kind,updated_at&updated_at=gte.${START}&updated_at=lte.${END}&limit=2&order=updated_at.desc`;
  const q2 = `?select=id,title,kind,created_at&created_at=gte.${START}&created_at=lte.${END}&limit=2&order=created_at.desc`;

  const r1 = await fetch(`${SB.url}/rest/v1/${t}${q1}`, { headers });
  if (r1.ok) { const rows = await r1.json(); if (rows.length) return { table:t, field:"updated_at", rows }; }
  if (r1.status === 404) return { table:t, error:"no such table" };

  const r2 = await fetch(`${SB.url}/rest/v1/${t}${q2}`, { headers });
  if (r2.ok) { const rows = await r2.json(); if (rows.length) return { table:t, field:"created_at", rows }; }

  const r3 = await fetch(`${SB.url}/rest/v1/${t}?select=id&limit=1`, { headers });
  if (r3.ok) { const any = await r3.json(); return { table:t, noneInWindow:true, hasAny:Boolean(any.length) }; }
  return { table:t, error:`status ${r3.status}` };
}

(async ()=>{
  console.log(`⏱ window: ${START} → ${END}`);
  let hits = 0;
  for (const t of CANDIDATES) {
    try {
      const res = await tryTable(t);
      if (res.rows?.length) {
        hits++;
        console.log(`\n✅ ${t} (${res.field}) — sample:`);
        for (const r of res.rows) console.log("   •", JSON.stringify(r).slice(0,200));
      } else if (res.noneInWindow && res.hasAny) {
        console.log(`–  ${t}: table exists but no rows in window`);
      }
    } catch (e) {
      console.log(`✖ ${t}: ${e.message}`);
    }
  }
  if (!hits) console.log("\n🔎 No rows in this window across candidates. If you recall a table name, tell me and I’ll add it.");
})();
