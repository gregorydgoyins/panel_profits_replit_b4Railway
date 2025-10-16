import { supabase } from "./_supabaseClient.mjs";

async function run(){
  const a = await supabase.from("rss_items").select("count", { count: "exact", head: true });
  const b = await supabase.from("video_items").select("count", { count: "exact", head: true });
  console.log("rss_items count:", a?.count ?? "(?)", a.error ? "ERR" : "OK");
  console.log("video_items count:", b?.count ?? "(?)", b.error ? "ERR" : "OK");
  if (a.error) console.error("rss_items error:", a.error.message);
  if (b.error) console.error("video_items error:", b.error.message);
}
run().catch(e=>{ console.error("health fatal:", e); process.exit(1); });
