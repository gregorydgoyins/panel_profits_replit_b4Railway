import { idx } from "../backend/clients.mjs";

function parseIds() {
  const a=Object.fromEntries(process.argv.slice(2).map(s=>s.split("=").map(x=>x.replace(/^--/,""))));
  return (a.ids? a.ids.split(",").map(s=>s.trim()).filter(Boolean): []);
}

const ids = parseIds();
if (!ids.length) { console.log("Usage: node workers/check_vectors.mjs --ids=yt:ID1,yt:ID2"); process.exit(0); }

const got = await idx.fetch(ids);
for (const id of ids) {
  const v = got.vectors?.[id];
  console.log(id, v? `OK (dim=${v.values?.length||"?"})` : "MISSING");
}
