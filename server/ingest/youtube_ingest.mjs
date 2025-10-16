import { supabase, logErr, SB_SECRET } from "./_supabaseClient.mjs";

const YT_API_KEY = process.env.YT_API_KEY || SB_SECRET || "";
if (!YT_API_KEY){
  console.log("⏭️  No YT_API_KEY — skipping youtube ingest.");
  process.exit(0);
}

const CHANNELS = [
  "UCi8e0iOVk1fEOogdfu4YgfA" // sample
];

async function fetchChannelUploads(channelId){
  const url = `https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;
  const r = await fetch(url);
  const j = await r.json();
  return (j.items||[]).map(i=>({
    vid: i?.id?.videoId,
    title: i?.snippet?.title,
    url: i?.id?.videoId ? `https://www.youtube.com/watch?v=${i.id.videoId}` : null,
    channel: i?.snippet?.channelTitle,
    published_at: i?.snippet?.publishedAt
  })).filter(v=>v.vid);
}

async function upsertVideo(v){
  const { error } = await supabase
    .from("video_items")
    .upsert({
      vid: v.vid,
      title: v.title ?? null,
      url: v.url ?? null,
      channel: v.channel ?? null,
      published_at: v.published_at ? new Date(v.published_at).toISOString() : null,
      description: null
    }, { onConflict: "vid" });
  if (error) logErr("video upsert", error);
}

async function run(){
  for (const ch of CHANNELS){
    try{
      const vids = await fetchChannelUploads(ch);
      for (const v of vids) await upsertVideo(v);
    }catch(e){
      logErr(`yt fetch ${ch}`, e);
    }
  }
  console.log("✓ youtube cycle complete");
}

run().catch(e=>{ logErr("yt fatal", e); process.exit(1); });
