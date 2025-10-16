import fs from "node:fs/promises";

const SITES = [
  "https://www.cbr.com", "https://bleedingcool.com", "https://www.comicsbeat.com",
  "https://icv2.com", "https://www.hollywoodreporter.com/t/comics",
  "https://www.theguardian.com/books/comics", "https://screenrant.com/tag/comics",
  "https://www.polygon.com/comics", "https://variety.com/v/comics",
  "https://www.darkhorse.com/Blog", "https://www.idwpublishing.com", "https://www.boom-studios.com",
  "https://blog.midtowncomics.com", "https://www.tfaw.com/blog", "https://www.mycomicshop.com/blog",
  "https://www.cgccomics.com/news"
];
const MASTER = "server/ingest/feeds_news.master.txt";

async function findRSS(site){
  const r = await fetch(site, { headers: { "User-Agent":"Mozilla/5.0", "Accept":"text/html" }});
  if (!r.ok) return [];
  const html = await r.text();
  const out = new Set();
  // <link rel="alternate" type="application/rss+xml" href="...">
  for (const m of html.matchAll(/<link[^>]+type=["']application\/(rss|atom)\+xml["'][^>]*>/gi)){
    const tag = m[0];
    const href = (tag.match(/href=["']([^"']+)["']/i)||[])[1];
    if (href) out.add(href.startsWith('http') ? href : new URL(href, site).href);
  }
  // common fallbacks
  ["/feed", "/rss", "/feed/"].forEach(p=> out.add(new URL(p, site).href));
  return Array.from(out);
}
function uniq(a){ const s=new Set(); return a.filter(x=>!s.has(x)&&s.add(x)); }
async function main(){
  let candidates = [];
  for (const s of SITES){
    try { candidates.push(...await findRSS(s)); } catch {}
  }
  candidates = uniq(candidates);
  const curr = (await fs.readFile(MASTER,'utf8').catch(()=>'')) + '\n' + candidates.join('\n') + '\n';
  const lines = uniq(curr.split(/\r?\n/).map(s=>s.split('#')[0].trim()).filter(Boolean));
  await fs.writeFile(MASTER, lines.join('\n')+'\n');
  console.log(`news discovered: +${candidates.length} (master now ~${lines.length})`);
}
main();
