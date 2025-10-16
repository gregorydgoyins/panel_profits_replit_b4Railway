import Parser from "rss-parser";
import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const PC_INDEX = process.env.PINECONE_INDEX_V2 || "pp-prod-1536";

if (!SB_URL || !SB_KEY) { console.error("❌ Missing Supabase env"); process.exit(1); }
if (!process.env.PINECONE_API_KEY) { console.error("❌ Missing PINECONE_API_KEY"); process.exit(1); }
if (!process.env.OPENAI_API_KEY) { console.error("❌ Missing OPENAI_API_KEY"); process.exit(1); }

const headers = { apikey: SB_KEY, Authorization:`Bearer ${SB_KEY}`, "Content-Type":"application/json" };
const parser = new Parser({ timeout:15000 });
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const sha1 = (s)=>crypto.createHash("sha1").update(s).digest("hex");
const norm = (s="")=>s.replace(/\s+/g," ").trim();

async function embed(text){
  const r = await ai.embeddings.create({ model:"text-embedding-3-small", input: text.slice(0,6000) });
  return r.data[0].embedding;
}

async function upsertSafe(row){
  // Only send columns we KNOW exist in your table: id, kind, title, url
  const minimal = { id: row.id, kind: row.kind, title: row.title, url: row.url || null };

  // Try insert; if conflict, patch title/url only
  const ins = await fetch(`${SB_URL}/rest/v1/ingest_items`, {
    method:"POST", headers, body: JSON.stringify(minimal)
  });

  if (ins.status === 409) {
    await fetch(`${SB_URL}/rest/v1/ingest_items?id=eq.${encodeURIComponent(row.id)}`, {
      method:"PATCH", headers, body: JSON.stringify({ title: minimal.title, url: minimal.url })
    });
  } else if (!ins.ok) {
    const t = await ins.text();
    console.log("supabase err", ins.status, t.slice(0,180));
  }
}

async function ingestFeed(url, per=50){
  const f = await parser.parseURL(url);
  const site = f?.link || url;
  let n=0;
  for (const it of (f.items||[]).slice(0,per)){
    const title = norm(it.title||"");
    const link  = it.link || it.guid || "";
    const body  = norm([it.contentSnippet, it.content, it["content:encoded"]].filter(Boolean).join("\n"));
    if (!title && !body) continue;

    const id = "rss:"+sha1(link||title);
    // Upsert minimal row to Supabase
    await upsertSafe({ id, kind:"rss", title, url: link });

    // Embed to Pinecone 1536
    const vec = await embed(`${title}\n\n${body || site}`);
    await pc.index(PC_INDEX).upsert([
      { id, values: vec, metadata: { kind:"rss", title, url: link, site } }
    ]);

    n++; if (n % 10 === 0) console.log(`rss ✔ ${n} (${f?.title||url})`);
  }
  console.log(`rss ✅ ${n} ${f?.title||url}`);
}

async function main(){
  const LIMIT = Number(process.argv.find(a=>a.startsWith("--limit="))?.split("=")[1] || "300");
  const feeds = (await readFile("server/config/rss_live.txt","utf8")).split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  if (!feeds.length) { console.log("no feeds in server/config/rss_live.txt"); process.exit(0); }

  const perFeed = Math.max(3, Math.min(10, Math.floor(LIMIT / Math.max(1, feeds.length))));
  let budget = LIMIT;
  for (const u of feeds){
    const take = Math.min(perFeed, budget);
    if (take <= 0) break;
    try { await ingestFeed(u, take); } catch(e){ console.log("rss ✖", u, e.message); }
    budget -= take;
  }
  console.log("✅ ingest done");
}
main();
