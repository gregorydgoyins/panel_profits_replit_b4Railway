import express from "express";
import cors from "cors";
import compression from "compression";
import { createProxyMiddleware } from "http-proxy-middleware";

const VITE_PORT = Number(process.env.VITE_PORT || 5173);
const VITE_DEV_URL = process.env.VITE_DEV_URL || `http://127.0.0.1:${VITE_PORT}`;
const PORT = Number(process.env.PORT || 5000);

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json());

app.get("/__health", (_req, res) => {
  res.json({ ok:true, mode:"preview", port:PORT, vite:VITE_DEV_URL, time:new Date().toISOString() });
});

app.use("/", createProxyMiddleware({ target: VITE_DEV_URL, changeOrigin: true, ws: true, secure: false }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Preview proxy listening on ${PORT} → ${VITE_DEV_URL}`);
});
