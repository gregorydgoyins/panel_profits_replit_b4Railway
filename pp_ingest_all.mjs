import Parser from "rss-parser";
import crypto from "node:crypto";
import { write1536 } from "./pp_backend.mjs";

const parser = new Parser({ timeout: 20000 });

function sha(s){ return crypto.createHash("sha1").update(s).digest("hex"); }
function uniqId(prefix, str){ return `${prefix}:${sha(str)}`; }
function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

function getArg(name, def=null){
  const a=process.argv.find(x=>x.startsWith(`--${name}=`));
  if(!a) return def;
  return a.split("=")[1];
}

async function readLines(path){
  const fs = await import("node:fs/promises");
  const t = await fs.readFile(path,"utf8");
  return t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
}

async function sources(kind){
  // Priority: file path arg, else default files, else env CSV
  const file = getArg(`${kind}-file`);
  if (file) return readLines(file);

  const defaults = {
    rss: ["server/config/rss_sources.txt","server/config/info_feeds.txt","server/config/rss_sources.csv"],
    yt:  ["server/config/youtube_channels.txt","server/config/youtube_channels.csv"]
  }[kind];

  for (const p of defaults||[]) {
    try { return await readLines(p); } catch {}
  }
  const env = process.env[ kind === "rss" ? "RSS_SOURCES" : "YOUTUBE_CHANNELS" ];
  if (env) return env.split(",").map(s=>s.trim()).filter(Boolean);
  return [];
}

async function processRSS(url, limit){
  try{
    const feed = await parser.parseURL(url);
    const items = (feed.items||[]).slice(0, limit);
    for (const it of items) {
      const title = it.title||"";
      const link  = it.link||url;
      const text  = [it.contentSnippet||"", it.content||"", it.summary||"", title].join("\n").trim();
      const id    = uniqId("rss", link||title||JSON.stringify(it).slice(0,200));
      await write1536({ id, kind:"rss", title, url:link, text, meta:{source:url, date: it.isoDate||it.pubDate||null} });
      console.log("rss ✔", title.slice(0,80));
    }
  }catch(e){ console.warn("rss ✖", url, e.message); }
}

async function processYTChannel(channelId, limit){
  // YouTube channel RSS: https://www.youtube.com/feeds/videos.xml?channel_id=<id>
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  try{
    const feed = await parser.parseURL(url);
    const items = (feed.items||[]).slice(0, limit);
    for(const it of items){
      // entries often have yt:videoId in links; fallback to link hash
      const link = it.link || "";
      const videoId = (it.id||"").split(":").pop() || (link.includes("v=")? new URL(link).searchParams.get("v"): null) || sha(link).slice(0,11);
      const id   = `yt:${videoId}`;
      const title= it.title||"";
      const text = [it.contentSnippet||"", it.content||"", title].join("\n").trim();
      await write1536({ id, kind:"youtube", title, url: link || `https://www.youtube.com/watch?v=${videoId}`, text, meta:{channelId} });
      console.log("yt  ✔", channelId, title.slice(0,80));
    }
  }catch(e){ console.warn("yt  ✖", channelId, e.message); }
}

async function main(){
  const doRSS = getArg("rss", "1") !== "0";
  const doYT  = getArg("youtube", "1") !== "0";
  const limit = Number(getArg("limit","50"));
  const delay = Number(getArg("delay","300")); // ms between sources to be nice

  if (doRSS){
    const rss = await sources("rss");
    console.log("RSS sources:", rss.length);
    for (const u of rss) { await processRSS(u, limit); await sleep(delay); }
  }
  if (doYT){
    const chans = await sources("yt");
    console.log("YT channels:", chans.length);
    for (const c of chans) { await processYTChannel(c, limit); await sleep(delay); }
  }
  console.log("✅ ingest complete");
}

main().catch(e=>{ console.error(e); process.exit(1); });
