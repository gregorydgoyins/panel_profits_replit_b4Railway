import { embed1536, upsertVectors, upsertSupabaseItem } from "../backend/clients.mjs";

/**
 * Usage:
 *   node workers/ingest_youtube_ids.mjs --ids=VIDEO_ID,VIDEO_ID2
 * or node workers/ingest_youtube_ids.mjs --file=ids.txt   # one id per line
 * Text used for embedding = title/description you already have;
 * if you don't store them yet, embed title only (or extend to fetch YouTube).
 */

function parseArgs() {
  const a = Object.fromEntries(process.argv.slice(2).map(s=>s.split("=").map(x=>x.replace(/^--/,""))));
  return { ids: a.ids ? a.ids.split(",").map(s=>s.trim()).filter(Boolean) : [],
           file: a.file };
}

async function readIdsFromFile(p) {
  const fs = await import("node:fs/promises");
  const s = await fs.readFile(p,"utf8");
  return s.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
}

const { ids: idsArg, file } = parseArgs();
const ids = file ? await readIdsFromFile(file) : idsArg;
if (!ids.length) {
  console.log("No IDs provided. Use --ids or --file.");
  process.exit(0);
}

// You likely have metadata elsewhere; for now we embed a stub "title" to prove the pipe.
// Replace the placeholder fetch with your real metadata pull (Supabase or YouTube).
for (const id of ids) {
  const vid = `yt:${id}`;
  const title = `YouTube Video ${id}`; // TODO replace with real title
  const text  = title;                 // TODO include description/transcript if you have them

  const vec = await embed1536(text);
  await upsertVectors([{ id: vid, values: vec, metadata: { title, kind:"youtube" } }]);

  await upsertSupabaseItem({
    id: vid, kind: "youtube", title, url: `https://www.youtube.com/watch?v=${id}`,
    text_content: text, source_meta: { source: "shim" }, updated_at: new Date().toISOString()
  });

  console.log("✔ upserted", vid);
}
console.log("✅ done");
