import express from "express";
import path from "node:path";
import fetch from "cross-fetch";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);
const SB_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const app = express();
app.get("/healthz", (_,res)=>res.json({ok:true, at:new Date().toISOString()}));
app.get("/api/market/ticker", async (_req,res)=>{
  try{
    const u = new URL("/rest/v1/ticker_stream", SB_URL);
    u.searchParams.set("select","symbol,delta,updated_at");
    u.searchParams.set("order","updated_at.desc");
    u.searchParams.set("limit","100");
    const r = await fetch(u,{headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`}});
    if(!r.ok) throw 0;
    const rows = await r.json();
    const items = Array.isArray(rows)? rows.map(x=>({symbol:String(x.symbol||""), delta:Number(x.delta)||0})) : [];
    return res.json({items});
  }catch{
    return res.json({items:[
      {symbol:"I:ASM.v2.800.96.M",delta:+.012},
      {symbol:"FH:BATMN",delta:-.018},
      {symbol:"R:KIRBY.J",delta:0},
    ]});
  }
});
const pub = path.resolve(__dirname, "../server/public");
app.use(express.static(pub, { extensions:["html"] }));
app.use((_,res)=>res.sendFile(path.join(pub,"index.html")));

app.listen(PORT, "0.0.0.0", ()=>{
  console.log(`[server-lite] listening on http://localhost:${PORT}`);
});
setInterval(()=>console.log(`[server-lite] alive ${new Date().toISOString()}`), 5000);
