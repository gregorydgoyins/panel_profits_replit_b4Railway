import fs from "node:fs/promises";
import Parser from "rss-parser";

const parser = new Parser({ timeout: 15000, headers: { "User-Agent": "Mozilla/5.0" }});
const TERMS = [
  "comics", "comic books", "marvel", "dc", "manga", "anime",
  "collectibles", "graphic novels", "indie comics", "superhero"
];
const MASTER = "server/ingest/feeds_podcasts.master.txt";

async function discoverTerm(term){
  const url = `https://itunes.apple.com/search?media=podcast&term=${encodeURIComponent(term)}&limit=200`;
  const r = await fetch(url); if (!r.ok) return [];
  const j = await r.json();
  const urls = (j.results||[]).map(x=>x.feedUrl).filter(Boolean);
  return urls;
}
function uniq(a){ const s=new Set(); return a.filter(x=>!s.has(x)&&s.add(x)); }

async function main(){
  let found = [];
  for (const t of TERMS){
    try { found.push(...await discoverTerm(t)); } catch {}
  }
  found = uniq(found);
  // quick validation (keep ones that parse at least 1 item)
  const good = [];
  for (const u of found.slice(0,500)){
    try{ const f=await parser.parseURL(u); if ((f.items||[]).length) good.push(u) }catch{}
  }
  const curr = (await fs.readFile(MASTER,'utf8').catch(()=>'')) + '\n' + good.join('\n') + '\n';
  const lines = uniq(curr.split(/\r?\n/).map(s=>s.split('#')[0].trim()).filter(Boolean));
  await fs.writeFile(MASTER, lines.join('\n')+'\n');
  console.log(`podcasts discovered: +${good.length} (master now ~${lines.length})`);
}
main();
