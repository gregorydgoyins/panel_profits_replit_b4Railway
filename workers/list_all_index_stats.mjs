import { Pinecone } from "@pinecone-database/pinecone";
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const { indexes } = await pc.listIndexes();
for (const { name } of indexes ?? []) {
  const i = pc.index(name);
  try {
    const s = await i.describeIndexStats();
    const ns = Object.keys(s?.namespaces||{});
    console.log(`${name.padEnd(18)} total=${s.totalVectorCount ?? "?"} namespaces=${ns.join(",")||"(none)"}`);
  } catch (e) { console.log(`${name}: ${e.message}`); }
}
