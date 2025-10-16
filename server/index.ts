import express from "express";
import cors from "cors";
import compression from "compression";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json());

const VITE_URL = "http://127.0.0.1:5173";
const PORT = Number(process.env.PORT || 5000);

app.get("/__health",(_,r)=>r.json({ok:true,port:PORT,vite:VITE_URL,time:new Date().toISOString()}));
app.use("/",createProxyMiddleware({target:VITE_URL,changeOrigin:true,ws:true,secure:false}));

app.listen(PORT,"0.0.0.0",()=>console.log(`✅ Server on ${PORT}, proxy→5173`));
