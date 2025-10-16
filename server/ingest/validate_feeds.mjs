import fs from "node:fs";
import Parser from "rss-parser";
const parser = new Parser({ timeout: 15000 });

async function check(url){
  try{
    const feed = await parser.parseURL(url);
    const ok = (feed?.items||[]).length > 0;
    return { url, ok, title: feed?.title||"", count: (feed?.items||[]).length };
  } catch(e){
    return { url, ok:false, err: (e?.message||String(e)).slice(0,140) };
  }
}

async function run(inFile, outFile){
  const list = fs.readFileSync(inFile, "utf8").split(/\r?\n/).map(s=>s.split('#')[0].trim()).filter(Boolean);
  const results = [];
  for (const u of list){
    const r = await check(u);
    results.push(r);
    console.log((r.ok?"✅":"❌"), r.url, r.title?`— ${r.title}`:"", r.count?`(${r.count})`:"", r.err?`ERR: ${r.err}`:"");
  }
  const valids = results.filter(r=>r.ok).map(r=>r.url);
  fs.writeFileSync(outFile, valids.join("\n")+"\n");
  console.log(`\n→ Wrote ${valids.length} working feeds to ${outFile}`);
}

const mode = process.argv[2]; // "pods" | "video"
if (mode === "pods") run("server/ingest/feeds_podcasts.txt", "server/ingest/feeds_podcasts.valid.txt");
else if (mode === "video") run("server/ingest/feeds_video.txt", "server/ingest/feeds_video.valid.txt");
else { console.log("Usage: node server/ingest/validate_feeds.mjs pods|video"); process.exit(2); }
