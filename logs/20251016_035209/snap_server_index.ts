---- server/index.ts
import express from "express";
import cors from "cors";
import compression from "compression";

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json());

const PORT = Number(process.env.PORT || 3001);
const VITE_DEV_URL = process.env.VITE_DEV_URL || "http://127.0.0.1:5173";

app.get("/__health", (_req, res) => {
  res.json({ ok: true, port: PORT, vite: VITE_DEV_URL, time: new Date().toISOString() });
});

// Minimal root so we can verify quickly
app.get("/", (_req, res) => res.send(`🧠 Panel Profits server OK on ${PORT}`));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server listening on ${PORT}`);
  console.log(`ℹ️  (Diag mode) Not proxying right now. Vite should be on ${VITE_DEV_URL}`);
});
