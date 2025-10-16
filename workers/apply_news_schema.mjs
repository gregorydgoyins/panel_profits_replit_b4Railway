import { readFile } from "node:fs/promises";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

if (!url || !key) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const sql = await readFile("server/schema/news_pipeline.sql", "utf8");

const resp = await fetch(`${url}/rest/v1/rpc/execute_sql`, {
  method: "POST",
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ sql }),
});

if (!resp.ok) {
  console.error("❌ SQL apply failed:", resp.status, await resp.text());
  process.exit(1);
}

console.log("✅ schema ready");
