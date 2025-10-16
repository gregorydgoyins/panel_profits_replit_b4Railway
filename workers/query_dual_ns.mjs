import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PRIMARY_INDEX   = process.env.PINECONE_INDEX_V2 || "pp-prod-1536";
const PRIMARY_NS      = process.env.PP_PRIMARY_NS || "";          // root
const FALLBACK_INDEX1 = process.env.PP_FALLBACK_INDEX1 || "core-1536";
const FALLBACK_NS1    = process.env.PP_FALLBACK_NS1 || "video";   // <— important
const FALLBACK_INDEX2 = process.env.PP_FALLBACK_INDEX2 || "core";
const FALLBACK_NS2    = process.env.PP_FALLBACK_NS2 || "";        // root

const q = process.argv.slice(2).join(" ") || "spider-man trailer marvel";
const { data:[{ embedding }] } = await ai.embeddings.create({ model:"text-embedding-3-small", input:q });

async function search(name, ns){
  const i = pc.index(name);
  const h = ns ? i.namespace(ns) : i;
  const r = await h.query({ topK: 6, vector: embedding, includeMetadata:true });
  return (r.matches||[]).map(m=>({ id:m.id, score:m.score, title:m.metadata?.title, kind:m.metadata?.kind||"", index:name, ns }));
}

for (const [idx, ns, label] of [
  [PRIMARY_INDEX,   PRIMARY_NS,   "PRIMARY"],
  [FALLBACK_INDEX1, FALLBACK_NS1, "FALLBACK-1"],
  [FALLBACK_INDEX2, FALLBACK_NS2, "FALLBACK-2"],
]){
  const hits = await search(idx, ns);
  if (hits.length){
    console.log(`\n🔎 ${label} ${idx}${ns?` [ns=${ns}]`:""}`);
    for (const m of hits) console.log(`  - ${m.id}  ${m.kind}  ${String(m.title||"").slice(0,80)}  (${m.score?.toFixed?.(3)})`);
    break; // stop at first bucket with hits
  } else {
    console.log(`\n(no hits in ${label} ${idx}${ns?` [ns=${ns}]`:""})`);
  }
}
