import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PRIMARY = process.env.PINECONE_INDEX_V2 || "pp-prod-1536";
const FALLBACK = process.env.PINECONE_FALLBACK_INDEX || "core";

const q = process.argv.slice(2).join(" ") || "spider-man trailer marvel news";
const { data:[{ embedding }] } = await ai.embeddings.create({ model:"text-embedding-3-small", input:q });

async function search(name){
  const idx = pc.index(name);
  const r = await idx.query({ topK: 5, vector: embedding, includeMetadata: true });
  return (r.matches||[]).map(m => ({ id:m.id, score:m.score, title:m.metadata?.title, kind:m.metadata?.kind||"" }));
}

const primary = await search(PRIMARY);
if (primary.length) {
  console.log(`\n🔎 ${PRIMARY} (preferred)`);
  for (const m of primary) console.log(`  - ${m.id}  ${m.kind}  ${String(m.title||"").slice(0,80)}  (${m.score?.toFixed?.(3)})`);
} else {
  console.log(`\n(no hits in ${PRIMARY})`);
}

const fallback = await search(FALLBACK);
if (fallback.length) {
  console.log(`\n🧯 ${FALLBACK} (fallback)`);
  for (const m of fallback) console.log(`  - ${m.id}  ${m.kind}  ${String(m.title||"").slice(0,80)}  (${m.score?.toFixed?.(3)})`);
} else {
  console.log(`\n(no hits in ${FALLBACK})`);
}
