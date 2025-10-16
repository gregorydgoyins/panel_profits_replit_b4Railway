import fs from "node:fs";
import Parser from "rss-parser";
import { supabase, logErr } from "./_supabaseClient.mjs";
const parser = new Parser({ timeout: 20000 });
function sources(){ const f="server/ingest/feeds_news.valid.txt"; return fs.existsSync(f)?fs.readFileSync(f,"utf8").trim().split(/\r?\n/).filter(Boolean):[] }
async function upsert(x, src){ const guid=x.guid||x.link; if(!guid)return; const pub=x.isoDate||x.pubDate||x.published||null;
  const { error } = await supabase.from("rss_items").upsert({ guid, title:x.title??null, url:x.link??null, source:src??x.source??null, author:x.creator??x.author??null, summary:x.contentSnippet??x.content??null, published_at: pub?new Date(pub).toISOString():null }, { onConflict:"guid" });
  if (error) logErr("rss upsert", { guid, msg:error.message });
}
const CUTOFF=Date.now()-45*24*3600*1000; const fresh=d=>{ try{return new Date(d).getTime()>=CUTOFF}catch{return true} }
const list=sources(); console.log(`📰 news: ${list.length} feeds`);
for (const u of list){ try{ const f=await parser.parseURL(u); for (const it of (f.items||[]).filter(i=>!i.isoDate||fresh(i.isoDate)).slice(0,50)) await upsert(it, f?.title||u); }catch(e){ logErr(`rss fetch ${u}`, e)} }
console.log("✓ news done");
