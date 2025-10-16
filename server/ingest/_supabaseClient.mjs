import { createClient } from "@supabase/supabase-js";
const URL  = process.env.SUPABASE_URL  || process.env.VITE_SUPABASE_URL;
const SRK  = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(URL, SRK);
export function logErr(tag, err){
  try { console.error(`❌ ${tag}:`, JSON.stringify(err, null, 2)); }
  catch { console.error(`❌ ${tag}:`, err); }
}
