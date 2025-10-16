import { pc, idx, sb, PINECONE_INDEX_V2 } from "../backend/clients.mjs";

const ids = process.argv.slice(2);
console.log("INDEX:", PINECONE_INDEX_V2);

console.log("— list indexes —");
const list = await pc.listIndexes();
console.log(list.indexes?.map(x=>x.name));

console.log("— describe stats —");
const stats = await idx.describeIndexStats();
const ns = Object.keys(stats.namespaces||{});
console.log({ totalVectorCount: stats.totalVectorCount, namespaces: ns });

async function tryFetch(namespace) {
  try {
    const i = namespace ? idx.namespace(namespace) : idx;
    const got = await i.fetch(ids);
    for (const id of ids) {
      const v = got.vectors?.[id];
      console.log(`[ns=${namespace??""}] ${id}:`, v ? `OK dim=${v.values?.length}` : "MISSING");
    }
  } catch(e){ console.log(`[ns=${namespace??""}] fetch error:`, e.message); }
}

await tryFetch("");
await tryFetch("default");

if (sb) {
  console.log("— supabase rows —");
  const { data, error } = await sb
    .from("ingest_items")
    .select("id,title,kind")
    .in("id", ids);
  if (error) console.log("sb error:", error.message); else console.log(data||[]);
} else {
  console.log("no supabase client (creds missing)");
}
