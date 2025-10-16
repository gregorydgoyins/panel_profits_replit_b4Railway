import Parser from "rss-parser";
import { writeFile } from "node:fs/promises";

const parser = new Parser({ timeout: 20000 });

// XML fixer for bad “&” and stray tags
function fixXML(s=""){
  return s
    .replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;)/gi,"&amp;")
    .replace(/<\/br>/gi,"")
    .replace(/<\?xml[^>]*>/gi,"$&");
}

async function fetchText(u){
  const r = await fetch(u, { redirect:"follow" });
  return await r.text();
}
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

const GUESS_PATHS = ["/feed","/rss","/rss.xml","/feed.xml","/atom.xml","/feeds/posts/default?alt=rss"];

async function discover(site){
  try{
    const html = await fetchText(site);
    const rels = [...html.matchAll(/<link[^>]+type=["']application\/(rss|atom)\+xml["'][^>]*>/gi)]
      .map(m => (m[0].match(/href=["']([^"']+)/i)||[])[1])
      .filter(Boolean);
    const base = new URL(site);
    const auto = rels.map(h => h.startsWith("http") ? h : new URL(h, base.origin).toString());
    const guessed = GUESS_PATHS.map(p => new URL(p, base.origin).toString());
    return Array.from(new Set([...auto, ...guessed]));
  } catch { return []; }
}

async function probe(url){
  try{
    const raw = await fetchText(url);
    const text = fixXML(raw);
    const feed = await parser.parseString(text);
    const ok = Boolean(feed?.items?.length);
    const paywalled = /subscribe|membership|paywall/i.test(text);
    const title = (feed?.title||"").toString().trim() || url;
    return { ok, paywalled, title, url };
  }catch(e){ return { ok:false, paywalled:false, title:url, url, error:e.message }; }
}

const SEED = [
  // solid starters
  "https://feeds.feedburner.com/ComicBookResources",
  "https://bleedingcool.com/feed/",
  "https://www.cbr.com/feed/",
  "https://www.superherohype.com/feed",
  // discover from these sites
  "https://www.comicbookmovie.com",
  "https://www.gamesradar.com/comics/",
  "https://www.animenewsnetwork.com",
  "https://www.crunchyroll.com/news",
  "https://imagecomics.com",
  "https://boom-studios.com",
  "https://www.idwpublishing.com",
  "https://titan-comics.com",
  "https://www.2000ad.com",
  "https://news.gocollect.com",
  "https://www.previewsworld.com",
  "https://viz.com",
  "https://kodansha.us",
  "https://sevenseasentertainment.com",
  "https://www.darkhorse.com",
  "https://www.marvel.com",
  "https://www.dc.com"
];

async function main(){
  const pool = new Set(SEED);
  for (const site of SEED.filter(u=>!u.endsWith(".xml") && !u.endsWith("/feed") && !u.includes("feedburner"))){
    for (const u of await discover(site)) pool.add(u);
    await sleep(200);
  }

  const results = [];
  for (const u of pool){
    const r = await probe(u);
    results.push(r);
    console.log((r.ok ? "ok " : "bad"), (r.title||u).slice(0,80), "-", u, r.ok?"":(r.error||""));
    await sleep(120);
  }

  const healthy = results.filter(x=>x.ok && !x.paywalled);
  // drop obvious comments feeds
  const cleaned = healthy.filter(x => !/comments?/i.test(x.title) && !/comments?/i.test(x.url));
  // prefer comic/hero/anime domains
  const score = (u)=> /comic|manga|anime|hero|marvel|dc|image|boom|idw|titan|gocollect|previews|crunchyroll|viz|kodansha|sevenseas/i.test(u.url) ? 1 : 2;
  cleaned.sort((a,b)=>score(a)-score(b));
  // de-dup by host+path (strip trailing slash)
  const seen = new Set(); const uniq = [];
  for (const x of cleaned) {
    try {
      const u = new URL(x.url);
      const key = `${u.host}${u.pathname.replace(/\/+$/,'')}`;
      if (!seen.has(key)) { seen.add(key); uniq.push(x); }
    } catch { /* ignore */ }
  }

  const chosen = uniq.slice(0,100).map(x=>x.url);
  await writeFile("server/config/rss_live.txt", chosen.join("\n")+"\n","utf8");
  console.log(`\n✅ wrote ${chosen.length} feeds to server/config/rss_live.txt`);
}
main();
