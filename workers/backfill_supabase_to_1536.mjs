import { idx, sb, embed1536, upsertVectors } from "../backend/clients.mjs";

const BATCH = Number(process.env.BATCH || 50);
const KIND  = process.env.KIND  || "youtube"; // filter by kind if you use it

if (!sb) {
  console.log("⚠️  No Supabase creds; backfill requires ingest_items there. Exiting.");
  process.exit(0);
}

async function nextBatch(offset) {
  const { data, error } = await sb
    .from("ingest_items")
    .select("id,title,url,text_content,kind")
    .eq("kind", KIND)
    .order("updated_at", { ascending: true })
    .range(offset, offset + BATCH - 1);
  if (error) throw new Error(error.message);
  return data || [];
}

let offset = 0, total = 0;
for(;;) {
  const rows = await nextBatch(offset);
  if (!rows.length) break;

  const upserts = [];
  for (const r of rows) {
    try {
      const text = (r.text_content || r.title || "").trim();
      if (!text) continue;
      const vec = await embed1536(text);
      upserts.push({ id: r.id, values: vec, metadata: { title: r.title, url: r.url, kind: r.kind || KIND }});
    } catch(e) {
      console.warn("skip", r.id, e.message);
    }
  }
  if (upserts.length) {
    await upsertVectors(upserts);
    total += upserts.length;
    console.log(`✔ upserted ${upserts.length} (total ${total})`);
  } else {
    console.log("… no upserts in this batch");
  }
  offset += BATCH;
}
console.log("✅ backfill complete. total:", total);
