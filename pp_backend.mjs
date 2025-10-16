import { Pinecone } from "@pinecone-database/pinecone";
import { createClient as createSupabase } from "@supabase/supabase-js";
import OpenAI from "openai";

const PINECONE_INDEX_V2 = process.env.PINECONE_INDEX_V2 || "pp-prod-1536";
const EMBEDDING_MODEL   = process.env.EMBEDDING_MODEL   || "text-embedding-3-small";

if(!process.env.PINECONE_API_KEY)  throw new Error("Missing PINECONE_API_KEY");
if(!process.env.OPENAI_API_KEY)    throw new Error("Missing OPENAI_API_KEY");
const haveSB = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);

// clients
export const pc   = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
export const idx  = pc.index(PINECONE_INDEX_V2);
export const sb   = haveSB ? createSupabase(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY) : null;
export const ai   = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// embed 1536
export async function embed1536(text) {
  const res = await ai.embeddings.create({ model: EMBEDDING_MODEL, input: text });
  return res.data[0].embedding;
}

// single writer: Pinecone(1536) + Supabase row
export async function write1536({ id, kind, title="", url="", text="", meta={} }) {
  if(!id) return;
  const body = (text || title || "").trim();
  if(!body) return;

  const vec = await embed1536(body);
  await idx.upsert([{ id, values: vec, metadata: { title, url, kind, ...meta } }]);

  if (sb) {
    await sb.from("ingest_items").upsert({
      id, kind, title, url, text_content: body,
      source_meta: meta, updated_at: new Date().toISOString()
    });
  }
}
