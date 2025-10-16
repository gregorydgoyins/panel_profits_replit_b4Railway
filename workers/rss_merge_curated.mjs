import { readFile, writeFile } from "node:fs/promises";

function dedup(urls){
  const seen = new Set(), out=[];
  for (const u of urls){
    try {
      const x = new URL(u.trim());
      const key = `${x.host}${x.pathname.replace(/\/+$/,'')}`;
      if (!seen.has(key)) { seen.add(key); out.push(x.toString()); }
    } catch {}
  }
  return out;
}

async function main(){
  const curated = (await readFile("server/config/rss_curated.txt","utf8")).split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  let discovered=[];
  try {
    discovered = (await readFile("server/config/rss_live.txt","utf8")).split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  } catch {}
  // preference order: curated first, then discovered
  const merged = dedup([...curated, ...discovered]).slice(0,100);
  await writeFile("server/config/rss_live.txt", merged.join("\n")+"\n","utf8");
  console.log(`✅ rss_live.txt ready (${merged.length} feeds)`);
}
main();
