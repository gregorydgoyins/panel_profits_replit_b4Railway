import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

if (!process.env.PINECONE_API_KEY) throw new Error("Missing PINECONE_API_KEY");
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const ai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

async function embedProbe(text){
  if(!ai) return null;
  try{
    const r = await ai.embeddings.create({ model:"text-embedding-3-small", input:text });
    return r.data[0].embedding;
  }catch(e){ return null; }
}

async function countWithFilter(index, filter){
  try{
    const stats = await index.describeIndexStats({ filter });
    return stats?.totalVectorCount ?? 0;
  }catch{ return 0; }
}

async function sampleTopK(index, hint){
  const vec = await embedProbe(hint);
  if(!vec) return [];
  try{
    const q = await index.query({ topK: 5, vector: vec, includeMetadata:true });
    return (q.matches||[]).map(m=>({ id:m.id, score:m.score, md:m.metadata }));
  }catch{ return []; }
}

const { indexes } = await pc.listIndexes();

for (const meta of indexes ?? []) {
  const name = meta.name;
  // describe to get dimension (serverless)
  let dim = "?";
  try{
    const desc = await pc.describeIndex(name);
    dim = desc.dimension ?? desc.spec?.serverless?.spec?.dimension ?? "?";
  }catch{}

  const idx = pc.index(name);
  let total = "?";
  let namespaces = [];
  try{
    const s = await idx.describeIndexStats();
    total = s.totalVectorCount ?? "?";
    namespaces = Object.keys(s.namespaces||{});
  }catch(e){
    console.log(`${name.padEnd(18)}  error: ${e.message}`);
    continue;
  }

  const cYT  = await countWithFilter(idx, { kind: "youtube" });
  const cRSS = await countWithFilter(idx, { kind: "rss" });

  console.log(`\n=== ${name} ===`);
  console.log(`dimension: ${dim}   total: ${total}   namespaces: ${namespaces.join(",")||"(none)"}`);
  if (cYT || cRSS) console.log(`by kind → youtube: ${cYT}   rss: ${cRSS}`);

  const samples = await sampleTopK(idx, "youtube video transcript news article comic book");
  if (samples.length){
    console.log("samples:");
    for (const s of samples){
      const md = s.md||{};
      const t  = (md.title||"").toString().replace(/\s+/g," ").slice(0,80);
      console.log(`  - ${s.id}  (${(md.kind||"").toString()})  ${t}`);
    }
  } else {
    console.log("(no samples — either empty index or no OpenAI key to query)");
  }
}
