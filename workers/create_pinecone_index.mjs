import { Pinecone } from "@pinecone-database/pinecone";
const name = process.env.PINECONE_INDEX_V2 || "pp-prod-1536";
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const list = await pc.listIndexes();
if (list.indexes.find(x => x.name === name)) {
  console.log("✅ Index exists:", name);
  process.exit(0);
}
console.log("▶ Creating index:", name);
await pc.createIndex({
  name,
  dimension: 1536,
  metric: "cosine",
  spec: { serverless: { cloud: "aws", region: "us-east-1" } } // adjust if you use another region
});
console.log("✅ Created:", name);
