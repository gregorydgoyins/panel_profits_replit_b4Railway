import { spawn } from "node:child_process";
import { appendFile } from "node:fs/promises";

function log(s){ const line = `[${new Date().toISOString()}] ${s}\n`; process.stdout.write(line); return appendFile("logs/daily_news.log", line); }

function run(cmd, args){
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { stdio: ["ignore","pipe","pipe"] });
    p.stdout.on("data", d => log(d.toString().trim()));
    p.stderr.on("data", d => log(d.toString().trim()));
    p.on("close", code => { log(`${cmd} ${args.join(" ")} → exit ${code}`); resolve(code); });
  });
}

function msUntilNextSameTime(){
  const now = new Date();
  const next = new Date(now.getTime());
  next.setDate(now.getDate()+1);
  next.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), 0);
  return next.getTime() - now.getTime();
}

async function onePass(){
  await log("▶ newsdata (200)"); await run("node", ["workers/newsdata_ingest.mjs","--limit=200"]);
  await log("▶ rss merge");      await run("node", ["workers/rss_merge_curated.mjs"]);
  await log("▶ rss ingest (500)");await run("node", ["workers/rss_ingest_local.mjs","--limit=500"]);
  await log("✅ daily pass complete");
}

async function loop(){
  await onePass();
  const wait = msUntilNextSameTime();
  await log(`⏲ sleeping ${Math.round(wait/1000)}s until same time tomorrow`);
  setTimeout(loop, wait).unref();
}
loop();
