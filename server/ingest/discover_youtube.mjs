import fs from "node:fs/promises";

const HANDLES_FILE = "server/ingest/feeds_video.handles.txt";
const MASTER_FILE  = "server/ingest/feeds_video.master.txt";

// keywords that must appear in channel title (case-insensitive)
const NAME_INCLUDE = [
  "comic", "comics", "superhero", "marvel", "dc", "x-men", "spider", "batman",
  "invincible", "spawn", "valiant", "manga", "hq", "quadrinhos", "héroe", "héroes",
  "héroi", "herói"
];
// names that suggest it’s NOT about comics
const NAME_EXCLUDE = [
  "cycling","football","soccer","news","music","kids songs","minecraft",
  "fortnite","asmr","cooking","fitness","cars"
];

const SEARCH_TERMS = [
  "superhero comics", "marvel comics", "dc comics", "comic book news",
  "new comic releases", "comic speculation", "silver age comics", "bronze age comics",
  "mcu breakdown", "dceu breakdown", "x-men comics", "batman comics",
  "spider-man comics", "wolverine comics", "avengers comics",
  // intl
  "quadrinhos marvel", "quadrinhos dc", "hqs marvel", "hqs dc",
  "comics espanol marvel", "comics espanol dc", "comics español",
  "comics portugues", "comics português"
];

function uniq(a){ const s=new Set(); return a.filter(x=>!s.has(x)&&s.add(x)); }
const sleep = (ms)=> new Promise(r=>setTimeout(r,ms));

async function readHandles(){
  const txt = await fs.readFile(HANDLES_FILE, 'utf8').catch(()=> '');
  return uniq(txt.split(/\r?\n/).map(s=>s.trim()).filter(Boolean));
}

function titleLooksSuperhero(name){
  const t = (name||"").toLowerCase();
  if (!NAME_INCLUDE.some(k=>t.includes(k))) return false;
  if (NAME_EXCLUDE.some(k=>t.includes(k))) return false;
  return true;
}

async function fetchText(url){
  const r = await fetch(url, { headers:{ "User-Agent":"Mozilla/5.0", "Accept-Language":"en" }});
  if (!r.ok) throw new Error(`status ${r.status}`);
  return await r.text();
}

async function handleToChannelId(handle){
  try{
    const html = await fetchText(`https://www.youtube.com/${handle}`);
    const id = (html.match(/"channelId":"(UC[0-9A-Za-z_-]{22})"/)||[])[1];
    const name = (html.match(/"title":"([^"]+)"/)||[])[1] || "";
    if (!id) return null;
    if (!titleLooksSuperhero(name)) return null;
    return id;
  }catch{ return null; }
}

async function searchToChannelIds(q){
  try{
    const html = await fetchText(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`);
    const ids = new Set();
    for (const m of html.matchAll(/{"channelId":"(UC[0-9A-Za-z_-]{22})","title":"([^"]+?)"}/g)) {
      const id = m[1], name = m[2];
      if (titleLooksSuperhero(name)) ids.add(id);
    }
    return Array.from(ids);
  }catch{ return []; }
}

async function main(){
  const handles = await readHandles();
  const ids = new Set();

  // resolve handles
  for (const h of handles){
    const id = await handleToChannelId(h);
    if (id) ids.add(id);
    await sleep(150); // be polite
  }

  // keyword discovery
  for (const kw of SEARCH_TERMS){
    const list = await searchToChannelIds(kw);
    for (const id of list) ids.add(id);
    await sleep(150);
  }

  // materialize to master
  const rss = Array.from(ids).map(id=>`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`);
  const curr = (await fs.readFile(MASTER_FILE,'utf8').catch(()=>'')) + '\n' + rss.join('\n') + '\n';
  const lines = uniq(curr.split(/\r?\n/).map(s=>s.split('#')[0].trim()).filter(Boolean));
  await fs.writeFile(MASTER_FILE, lines.join('\n')+'\n');
  console.log(`youtube discovered: +${rss.length} (master now ~${lines.length})`);
}
main();
