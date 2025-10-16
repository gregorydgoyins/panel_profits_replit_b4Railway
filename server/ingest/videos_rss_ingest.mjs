import fs from "node:fs";
import Parser from "rss-parser";
import { supabase, logErr } from "./_supabaseClient.mjs";
const parser = new Parser({ timeout: 20000 });
function sources(){ const f="server/ingest/feeds_video.valid.txt"; return fs.existsSync(f)?fs.readFileSync(f,"utf8").trim().split(/\r?\n/).filter(Boolean):[] }
function vid(link){ const m=String(link||"").match(/[?&]v=([^&]+)/); return m?m[1]:null }
async function upsert(it, src){ const link=it.link||null; const id=vid(link)||it.id||it.guid||null; if(!id)return; const pub=it.isoDate||it.pubDate||it.published||null;
  const { error } = await supabase.from("video_items").upsert({ vid:id, title: it.title??null, url: link, channel: src??null, published_at: pub?new Date(pub).toISOString():null, description: it.contentSnippet??it.content??null }, { onConflict: "vid" });
  if (error) logErr("video upsert", { vid:id, msg:error.message });
}
const list=sources(); console.log(`📺 video: ${list.length} feeds`);
for (const u of list){ try{ const f=await parser.parseURL(u); for(const it of (f.items||[]).slice(0,50)) await upsert(it, f?.title||u) }catch(e){ logErr(`video fetch ${u}`, e) } }
console.log("✓ video done");
