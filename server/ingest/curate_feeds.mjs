import fs from "node:fs/promises";
import os from "node:os";
import Parser from "rss-parser";

const TARGET = parseInt(process.env.CURATE_TARGET || "100", 10);
const MAX_PER_FEED = 50;
const CONCURRENCY = Math.min(20, Math.max(8, os.cpus().length));
const HEAVY = process.env.CURATE_HEAVY === "1";

const SETS = {
  pods:  { in:"server/ingest/feeds_podcasts.master.txt", out:"server/ingest/feeds_podcasts.valid.txt", state:"server/ingest/podcasts.state.json", black:"server/ingest/podcasts.blacklist.txt" },
  video: { in:"server/ingest/feeds_video.master.txt",    out:"server/ingest/feeds_video.valid.txt",    state:"server/ingest/video.state.json",   black:"server/ingest/video.blacklist.txt" },
  news:  { in:"server/ingest/feeds_news.master.txt",     out:"server/ingest/feeds_news.valid.txt",     state:"server/ingest/news.state.json",    black:"server/ingest/news.blacklist.txt"  },
};

const parser = new Parser({
  timeout: 20000,
  headers: {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124",
    "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
  }
});

async function readLines(p){ try { return (await fs.readFile(p,"utf8")).split(/\r?\n/).map(s=>s.split('#')[0].trim()).filter(Boolean); } catch { return []; } }
async function readJSON(p){ try { return JSON.parse(await fs.readFile(p,"utf8")); } catch { return {}; } }
async function writeJSON(p, obj){ await fs.writeFile(p, JSON.stringify(obj,null,2)); }
function uniq(a){ const s=new Set(); return a.filter(x=>!s.has(x)&&s.add(x)); }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [a[i],a[j]]=[a[j],a[i]] } return a }

async function validate(url){
  try{
    const feed = await parser.parseURL(url);
    const ok = Array.isArray(feed?.items) && feed.items.length>0;
    return { url, ok, title: feed?.title||"", count: Math.min((feed.items||[]).length, MAX_PER_FEED) };
  } catch(e){ return { url, ok:false, title:"", count:0, err: e?.message || String(e) }; }
}
async function* chunks(list, n){ for(let i=0;i<list.length;i+=n) yield list.slice(i,i+n); }

async function curate(kind){
  const cfg = SETS[kind];
  const master = uniq(await readLines(cfg.in));
  const blacklist = new Set(await readLines(cfg.black));
  const state = await readJSON(cfg.state);
  const prevValid = uniq(await readLines(cfg.out)).filter(u=>!blacklist.has(u));

  const candidates = shuffle(master.filter(u=>!blacklist.has(u)));
  const chosen = [...prevValid];
  const tried = new Set();
  let heavyCycles = HEAVY ? 6 : 1;

  console.log(`🔎 ${kind}: target=${TARGET} master=${master.length} prev_ok=${prevValid.length} heavy=${HEAVY?"yes":"no"}`);

  while (chosen.length < TARGET && heavyCycles-- > 0) {
    const pool = candidates.filter(u=>!tried.has(u));
    if (!pool.length) break;
    for await (const batch of chunks(pool, CONCURRENCY)) {
      const res = await Promise.all(batch.map(validate));
      for (const r of res) {
        tried.add(r.url);
        const st = state[r.url] || { fail_streak:0 };
        if (r.ok) {
          st.fail_streak = 0;
          st.title = r.title || st.title || "";
          st.count = r.count || 0;
          st.last_ok = Date.now();
          if (!chosen.includes(r.url)) chosen.push(r.url);
          console.log(`✅ ${r.url} — ${r.title} (${r.count})`);
        } else {
          st.fail_streak = Math.min((st.fail_streak||0)+1, 999);
          st.last_err = r.err || st.last_err || "err";
          if (st.fail_streak >= 3) blacklist.add(r.url); // faster kill
          console.log(`❌ ${r.url}  ERR: ${r.err||"bad"}`);
        }
        state[r.url] = st;
      }
      if (chosen.length >= TARGET) break;
    }
  }

  const trimmed = uniq(chosen).slice(0, TARGET);
  trimmed.sort((u1,u2)=> ((state[u2]?.count||0)-(state[u1]?.count||0)) || String(u1).localeCompare(String(u2)));

  await fs.writeFile(cfg.out, trimmed.join("\n")+"\n");
  await writeJSON(cfg.state, state);
  await fs.writeFile(cfg.black, Array.from(blacklist).join("\n")+"\n");

  console.log(`→ ${kind}: kept ${trimmed.length}/${master.length} (prev_ok ${prevValid.length}) → ${cfg.out}`);
}

const mode = process.argv[2];
if (!mode || mode==="all"){ await curate("pods"); await curate("video"); await curate("news"); }
else if (["pods","video","news"].includes(mode)){ await curate(mode); }
else { console.log("Usage: CURATE_HEAVY=1 CURATE_TARGET=100 node curate_feeds.mjs [pods|video|news|all]"); process.exit(2); }
