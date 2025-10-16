const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SB_URL || !SB_KEY) { console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY"); process.exit(1); }
const H = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` };

function arg(name, def){ const a=process.argv.find(x=>x.startsWith(`--${name}=`)); return a ? a.split("=")[1] : def; }
const START = arg("start", new Date(Date.now()-48*3600*1000).toISOString());
const END   = arg("end",   new Date().toISOString());

async function listTablesFromOpenAPI(){
  const r = await fetch(`${SB_URL}/rest/v1/`, {
    headers: { ...H, Accept: "application/openapi+json" }
  });
  if (!r.ok) throw new Error(`OpenAPI fetch failed: ${r.status}`);
  const spec = await r.json();
  const paths = Object.keys(spec.paths||{});
  // paths look like "/table", "/table?select=", "/rpc/func"
  const tables = new Set();
  for (const p of paths){
    const seg = p.split("?")[0].replace(/^\/+/,"");
    if (!seg || seg.startsWith("rpc/") || seg.includes("/")) continue;
    tables.add(seg);
  }
  return [...tables];
}

async function probeTable(t){
  // Try updated_at
  let r = await fetch(`${SB_URL}/rest/v1/${t}?select=id,updated_at,created_at,title,kind&updated_at=gte.${START}&updated_at=lte.${END}&limit=2&order=updated_at.desc`, { headers: H });
  if (r.ok){ const rows = await r.json(); if (rows.length) return { hit:true, field:"updated_at", rows }; }

  // Try created_at
  r = await fetch(`${SB_URL}/rest/v1/${t}?select=id,updated_at,created_at,title,kind&created_at=gte.${START}&created_at=lte.${END}&limit=2&order=created_at.desc`, { headers: H });
  if (r.ok){ const rows = await r.json(); if (rows.length) return { hit:true, field:"created_at", rows }; }

  // Existence check
  r = await fetch(`${SB_URL}/rest/v1/${t}?select=id&limit=1`, { headers: H });
  if (r.ok){ const any = await r.json(); return { hit:false, exists: any.length>0 }; }

  return { hit:false, error:`status ${r.status}` };
}

(async ()=>{
  console.log(`⏱ window: ${START} → ${END}`);
  let tables = [];
  try {
    tables = await listTablesFromOpenAPI();
  } catch (e) {
    console.error("OpenAPI discovery failed:", e.message);
    process.exit(1);
  }
  console.log(`📚 discovered ${tables.length} tables`);

  let hits = 0;
  for (const t of tables){
    try {
      const res = await probeTable(t);
      if (res.hit){
        hits++;
        console.log(`\n✅ ${t} (${res.field}) — sample:`);
        for (const row of res.rows){
          console.log("   •", JSON.stringify(row).slice(0,300));
        }
      } else if (res.exists) {
        // table has data, just none in window
        // keep quiet or uncomment next line to see all
        // console.log(`– ${t}: no rows in window`);
      }
    } catch (e) {
      console.log(`✖ ${t}: ${e.message}`);
    }
  }
  if (!hits) {
    console.log("\n🔎 No rows in this window across discovered tables.");
    console.log("   If you know a specific table to include, tell me and I’ll target it directly.");
  }
})();
