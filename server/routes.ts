// ✅ server/routes.ts (cleaned ticker route at the bottom)

import express from 'express';
import path from 'path';
import fs from 'fs/promises';
// removed broken tickerService import

const app = express();

// ⏳ Market Status Endpoint (example above)
app.get('/api/market/status', async (req, res) => {
  try {
    const now = new Date();
    const hour = now.getUTCHours();
    const status = (hour >= 14 && hour < 20) ? 'open' : 'closed';

    res.json({
      status,
      nextChange: status === 'open' ? '3:30 PM EST' : '9:30 AM EST'
    });
  } catch (error) {
    console.error("Error fetching market status:", error);
    res.status(500).json({ message: "Failed to fetch market status" });
  }
});

// ✅ Cleaned Era-Based Market Ticker Endpoint
app.get('/api/market/ticker', async (req, res) => {
  try {
    const { items, updated_at, source, table } = await getTickerData();
    res.json({ items, updated_at, source, table });
  } catch (e) {
    console.error("Error fetching ticker data:", e);
    res.status(500).json({
      items: [],
      updated_at: new Date().toISOString(),
      source: 'catch'
    });
  }
});

export default app;
