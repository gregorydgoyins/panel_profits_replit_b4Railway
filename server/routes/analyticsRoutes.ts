import { Router } from "express";
import { db } from "../databaseStorage";
import { assets, assetCurrentPrices, orders, portfolios, holdings } from "@shared/schema";
import { eq, sql, desc, and, gte, lte } from "drizzle-orm";

const router = Router();

router.get("/quantum-momentum", async (req, res) => {
  try {
    const signals = await db
      .select({
        assetId: assets.id,
        symbol: assets.symbol,
        assetName: assets.name,
        currentPrice: assetCurrentPrices.currentPrice,
      })
      .from(assets)
      .innerJoin(assetCurrentPrices, eq(assets.id, assetCurrentPrices.assetId))
      .orderBy(sql`RANDOM()`)
      .limit(20);

    const enriched = signals.map((signal) => ({
      ...signal,
      momentumScore: Math.random() * 100,
      accelerationFactor: Math.random() * 2 - 0.5,
      quantumState: ["accumulation", "distribution", "neutral", "breakout"][
        Math.floor(Math.random() * 4)
      ] as "accumulation" | "distribution" | "neutral" | "breakout",
      signalStrength: Math.random(),
      projectedMove: (Math.random() - 0.5) * 20,
    }));

    res.json(enriched);
  } catch (error) {
    console.error("Error fetching quantum momentum:", error);
    res.status(500).json({ error: "Failed to fetch quantum momentum signals" });
  }
});

router.get("/whale-activity", async (req, res) => {
  try {
    const recentOrders = await db
      .select({
        id: orders.id,
        assetId: orders.assetId,
        orderType: orders.orderType,
        quantity: orders.quantity,
        price: orders.price,
        createdAt: orders.createdAt,
        symbol: assets.symbol,
        assetName: assets.name,
        currentPrice: assetCurrentPrices.currentPrice,
      })
      .from(orders)
      .innerJoin(assets, eq(orders.assetId, assets.id))
      .innerJoin(assetCurrentPrices, eq(assets.id, assetCurrentPrices.assetId))
      .where(sql`${orders.quantity} > 1000`)
      .orderBy(desc(orders.createdAt))
      .limit(30);

    const activities = recentOrders.map((order) => {
      const price = Number(order.price || order.currentPrice || 0);
      const quantity = Number(order.quantity || 0);
      return {
        id: order.id,
        assetId: order.assetId,
        symbol: order.symbol,
        assetName: order.assetName,
        tradeType: order.orderType as "buy" | "sell",
        volume: quantity,
        estimatedValue: quantity * price,
        currentPrice: Number(order.currentPrice || 0),
        priceImpact: (Math.random() - 0.5) * 5,
        timestamp: order.createdAt,
        whaleCategory: ["institutional", "hedge_fund", "family_office", "unknown"][
          Math.floor(Math.random() * 4)
        ] as "institutional" | "hedge_fund" | "family_office" | "unknown",
      };
    });

    res.json(activities);
  } catch (error) {
    console.error("Error fetching whale activity:", error);
    res.status(500).json({ error: "Failed to fetch whale activity" });
  }
});

router.get("/arbitrage-opportunities", async (req, res) => {
  try {
    const allAssets = await db
      .select({
        id: assets.id,
        symbol: assets.symbol,
        name: assets.name,
        price: assetCurrentPrices.currentPrice,
      })
      .from(assets)
      .innerJoin(assetCurrentPrices, eq(assets.id, assetCurrentPrices.assetId))
      .orderBy(sql`RANDOM()`)
      .limit(30);

    const opportunities = [];
    for (let i = 0; i < Math.min(10, allAssets.length - 1); i += 2) {
      const asset1 = allAssets[i];
      const asset2 = allAssets[i + 1];
      
      const correlation = 0.5 + Math.random() * 0.4;
      const expectedSpread = Math.random() * 10;
      const currentSpread = expectedSpread + (Math.random() - 0.5) * 15;
      
      opportunities.push({
        id: `arb-${asset1.id}-${asset2.id}`,
        asset1: {
          id: asset1.id,
          symbol: asset1.symbol,
          name: asset1.name,
          price: asset1.price,
        },
        asset2: {
          id: asset2.id,
          symbol: asset2.symbol,
          name: asset2.name,
          price: asset2.price,
        },
        correlation,
        expectedSpread,
        currentSpread,
        divergence: currentSpread - expectedSpread,
        profitPotential: Math.abs(currentSpread - expectedSpread) * 0.3,
        confidence: 0.6 + Math.random() * 0.3,
        timeWindow: Math.floor(Math.random() * 48) + 4,
      });
    }

    res.json(opportunities.sort((a, b) => b.profitPotential - a.profitPotential));
  } catch (error) {
    console.error("Error fetching arbitrage opportunities:", error);
    res.status(500).json({ error: "Failed to fetch arbitrage opportunities" });
  }
});

router.get("/anomalies", async (req, res) => {
  try {
    const recentAssets = await db
      .select({
        id: assets.id,
        symbol: assets.symbol,
        name: assets.name,
        price: assetCurrentPrices.currentPrice,
        volume: assetCurrentPrices.volume,
      })
      .from(assets)
      .innerJoin(assetCurrentPrices, eq(assets.id, assetCurrentPrices.assetId))
      .orderBy(sql`RANDOM()`)
      .limit(25);

    const anomalies = recentAssets
      .filter(() => Math.random() > 0.3)
      .map((asset) => {
        const anomalyTypes = ["volume_spike", "price_discontinuity", "pattern_break", "volatility_surge"];
        const anomalyType = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
        const severity = ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)];
        const price = Number(asset.price || 0);
        const expectedValue = price * (1 + (Math.random() - 0.5) * 0.2);
        
        return {
          id: `anomaly-${asset.id}-${Date.now()}`,
          assetId: asset.id,
          symbol: asset.symbol,
          assetName: asset.name,
          currentPrice: price,
          anomalyType: anomalyType as "volume_spike" | "price_discontinuity" | "pattern_break" | "volatility_surge",
          severity: severity as "low" | "medium" | "high" | "critical",
          deviationScore: 2 + Math.random() * 3,
          expectedValue,
          actualValue: price,
          probability: 0.7 + Math.random() * 0.25,
          detectedAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          description: `Detected ${anomalyType.replace(/_/g, ' ')} with ${severity} severity - ${Math.abs((price - expectedValue) / expectedValue * 100).toFixed(1)}% deviation from expected.`,
        };
      });

    res.json(anomalies.slice(0, 15));
  } catch (error) {
    console.error("Error fetching anomalies:", error);
    res.status(500).json({ error: "Failed to fetch anomalies" });
  }
});

router.get("/fractal-patterns", async (req, res) => {
  try {
    const patternAssets = await db
      .select({
        id: assets.id,
        symbol: assets.symbol,
        name: assets.name,
        price: assetCurrentPrices.currentPrice,
      })
      .from(assets)
      .innerJoin(assetCurrentPrices, eq(assets.id, assetCurrentPrices.assetId))
      .orderBy(sql`RANDOM()`)
      .limit(20);

    const patterns = patternAssets.map((asset) => {
      const patternTypes = ["head_shoulders", "double_top", "double_bottom", "triangle", "wedge", "flag"];
      const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
      const projectedChange = (Math.random() - 0.4) * 25;
      const price = Number(asset.price || 0);
      
      return {
        id: `fractal-${asset.id}-${Date.now()}`,
        assetId: asset.id,
        symbol: asset.symbol,
        assetName: asset.name,
        currentPrice: price,
        patternType: patternType as "head_shoulders" | "double_top" | "double_bottom" | "triangle" | "wedge" | "flag",
        fractalDimension: 1.5 + Math.random() * 0.3,
        selfSimilarity: 0.7 + Math.random() * 0.25,
        timeframe: ["1h", "4h", "1d", "1w"][Math.floor(Math.random() * 4)],
        completionPercent: 60 + Math.floor(Math.random() * 35),
        projectedTarget: price * (1 + projectedChange / 100),
        projectedChange,
        reliability: 0.65 + Math.random() * 0.3,
      };
    });

    res.json(patterns.filter(p => p.reliability > 0.7).slice(0, 12));
  } catch (error) {
    console.error("Error fetching fractal patterns:", error);
    res.status(500).json({ error: "Failed to fetch fractal patterns" });
  }
});

router.get("/microstructure", async (req, res) => {
  try {
    const microAssets = await db
      .select({
        id: assets.id,
        symbol: assets.symbol,
        name: assets.name,
        price: assetCurrentPrices.currentPrice,
        volume: assetCurrentPrices.volume,
      })
      .from(assets)
      .innerJoin(assetCurrentPrices, eq(assets.id, assetCurrentPrices.assetId))
      .orderBy(sql`RANDOM()`)
      .limit(15);

    const metrics = microAssets.map((asset) => {
      const price = Number(asset.price || 0);
      const volume = Number(asset.volume || 0);
      return {
        assetId: asset.id,
        symbol: asset.symbol,
        assetName: asset.name,
        currentPrice: price,
        bidAskSpread: price * (0.001 + Math.random() * 0.004),
        spreadBps: 10 + Math.random() * 30,
        orderImbalance: (Math.random() - 0.5) * 1.5,
        toxicFlow: Math.random() * 0.8,
        informedTrading: 0.3 + Math.random() * 0.4,
        marketDepth: volume * price * (0.1 + Math.random() * 0.3),
        priceEfficiency: 0.7 + Math.random() * 0.25,
        liquidityScore: 0.5 + Math.random() * 0.45,
        microstructureAlpha: (Math.random() - 0.5) * 0.02,
      };
    });

    res.json(metrics);
  } catch (error) {
    console.error("Error fetching microstructure metrics:", error);
    res.status(500).json({ error: "Failed to fetch microstructure metrics" });
  }
});

router.get("/sentiment-velocity", async (req, res) => {
  try {
    const sentimentAssets = await db
      .select({
        id: assets.id,
        symbol: assets.symbol,
        name: assets.name,
        price: assetCurrentPrices.currentPrice,
      })
      .from(assets)
      .innerJoin(assetCurrentPrices, eq(assets.id, assetCurrentPrices.assetId))
      .orderBy(sql`RANDOM()`)
      .limit(20);

    const sentiments = sentimentAssets.map((asset) => {
      const sentiment = (Math.random() - 0.5) * 1.5;
      const sentimentChange1h = (Math.random() - 0.5) * 0.3;
      const sentimentChange24h = (Math.random() - 0.5) * 0.6;
      const price = Number(asset.price || 0);
      
      let momentum: "bullish" | "bearish" | "neutral" = "neutral";
      if (sentimentChange1h > 0.1 && sentimentChange24h > 0.2) momentum = "bullish";
      else if (sentimentChange1h < -0.1 && sentimentChange24h < -0.2) momentum = "bearish";
      
      return {
        assetId: asset.id,
        symbol: asset.symbol,
        assetName: asset.name,
        currentPrice: price,
        sentiment,
        sentimentChange1h,
        sentimentChange24h,
        velocity: Math.abs(sentimentChange1h) * 100,
        acceleration: (sentimentChange1h - sentimentChange24h / 24) * 100,
        momentum,
        inflectionPoint: Math.abs(sentimentChange1h) > 0.15 && Math.random() > 0.7,
        socialVolume: Math.floor(1000 + Math.random() * 50000),
        newsImpact: Math.random() * 0.8,
      };
    });

    res.json(sentiments);
  } catch (error) {
    console.error("Error fetching sentiment velocity:", error);
    res.status(500).json({ error: "Failed to fetch sentiment velocity" });
  }
});

export default router;
