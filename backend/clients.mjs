import { Pinecone } from "@pinecone-database/pinecone";
import { createClient as createSupabase } from "@supabase/supabase-js";
import OpenAI from "openai";

export const PINECONE_INDEX_V2 = process.env.PINECONE_INDEX_V2 || "pp-prod-1536";
export const EMBEDDING_MODEL   = process.env.EMBEDDING_MODEL   || "text-embedding-3-small";

if(!process.env.PINECONE_API_KEY) throw new Error("Missing PINECONE_API_KEY");
if(!process.env.OPENAI_API_KEY)   throw new Error("Missing OPENAI_API_KEY");
if(!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.warn("⚠️  SUPABASE_URL / SUPABASE_SERVICE_KEY not set — Supabase writes will be skipped.");
}

export const pc   = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
export const idx  = pc.index(PINECONE_INDEX_V2);
export const sb   = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY)
  ? createSupabase(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

export const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embed1536(text) {
  const res = await ai.embeddings.create({ model: EMBEDDING_MODEL, input: text });
  return res.data[0].embedding;
}

export async function upsertVectors(pairs) {
  // pairs: [{ id, values, metadata }]
  if (!pairs.length) return;
  await idx.upsert(pairs);
}

export async function upsertSupabaseItem(row) {
  if(!sb) return;
  // table: ingest_items (create it in Supabase if not present)
  const { error } = await sb.from("ingest_items").upsert(row);
  if (error) console.warn("Supabase upsert failed:", error.message);
}
