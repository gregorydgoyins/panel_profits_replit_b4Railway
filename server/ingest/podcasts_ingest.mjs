import fs from "node:fs";
import Parser from "rss-parser";
import { supabase, logErr } from "./_supabaseClient.mjs";
const parser = new Parser({ timeout: 20000 });
function sources(){ const f="server/ingest/feeds_podcasts.valid.txt"; return fs.existsSync(f)?fs.readFileSync(f,"utf8").trim().split(/\r?\n/).filter(Boolean):[] }
async function upsert(it, src){ const guid=it.guid||it.id||it.link; if(!guid)return; const link=it.link||it.enclosure?.url||null; const audio=it.enclosure?.url||null; const pub=it.isoDate||it.pubDate||it.published||null;
  const { error } = await supabase.from("audio_items").upsert({ guid, title: it.title??null, url: link, enclosure_url: audio, source: src??null, published_at: pub?new Date(pub).toISOString():null, description: it.contentSnippet??it.content??null }, { onConflict: "guid" });
  if (error) logErr("audio upsert", { guid, msg:error.message });
}
const list=sources(); console.log(`🎧 podcasts: ${list.length} feeds`);
for (const u of list){ try{ const f=await parser.parseURL(u); for(const it of (f.items||[]).slice(0,50)) await upsert(it, f?.title||u) }catch(e){ logErr(`podcast fetch ${u}`, e) } }
console.log("✓ podcasts done");
