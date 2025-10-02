#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

function calculatePrice(connections: number): number {
  // More connections = more important character = higher price
  const basePrice = 50;
  const connectionBonus = Math.min(connections * 10, 950);
  return Math.min(Math.max(basePrice + connectionBonus, 50), 5000);
}

async function importMarvelNetwork() {
  console.log('🕸️ IMPORTING MARVEL UNIVERSE SOCIAL NETWORK...\n');
  
  const networkPath = '/home/runner/.cache/kagglehub/datasets/csanhueza/the-marvel-universe-social-network/versions/1';
  
  // Load nodes (heroes)
  const nodesCsv = fs.readFileSync(path.join(networkPath, 'nodes.csv'), 'utf-8');
  const nodes = parse(nodesCsv, { columns: true, skip_empty_lines: true });
  
  // Load edges (connections)
  const edgesCsv = fs.readFileSync(path.join(networkPath, 'edges.csv'), 'utf-8');
  const edges = parse(edgesCsv, { columns: true, skip_empty_lines: true });
  
  console.log(`📊 Found ${nodes.length} heroes with ${edges.length} connections\n`);
  
  // Count connections per hero
  const connectionCounts: Record<string, number> = {};
  for (const edge of edges) {
    const hero1 = edge.hero1 || edge.source;
    const hero2 = edge.hero2 || edge.target;
    connectionCounts[hero1] = (connectionCounts[hero1] || 0) + 1;
    connectionCounts[hero2] = (connectionCounts[hero2] || 0) + 1;
  }
  
  let imported = 0;
  const batchSize = 1000;
  
  for (let i = 0; i < nodes.length; i += batchSize) {
    const batch = nodes.slice(i, i + batchSize);
    const assetBatch: any[] = [];
    const priceBatch: any[] = [];
    
    for (const node of batch) {
      const name = node.hero || node.name || node.label || `Hero-${imported}`;
      const connections = connectionCounts[name] || 0;
      const symbol = `NET${Date.now()}${imported}`;
      const price = calculatePrice(connections);
      const float = 100000 + Math.floor(Math.random() * 900000);
      
      assetBatch.push({
        symbol,
        name,
        type: 'character',
        description: `${name} - ${connections} connections in Marvel Universe`
      });
      
      priceBatch.push({
        currentPrice: price,
        totalMarketValue: price * float,
        totalFloat: float,
        sharesPerCopy: 100,
        scarcityModifier: 0.9 + Math.random() * 0.2,
        averageComicValue: price * 100,
        priceSource: 'Kaggle-MarvelNetwork',
        marketStatus: 'open',
        volume: Math.floor(Math.random() * 10000)
      });
      
      imported++;
    }
    
    const insertedAssets = await db.insert(assets).values(assetBatch).returning();
    const pricesWithIds = priceBatch.map((p, idx) => ({
      ...p,
      assetId: insertedAssets[idx].id
    }));
    await db.insert(assetCurrentPrices).values(pricesWithIds);
    
    console.log(`✅ ${imported} / ${nodes.length} network heroes imported`);
  }
  
  console.log(`\n🏁 IMPORTED ${imported} MARVEL NETWORK HEROES!`);
}

importMarvelNetwork().catch(console.error).finally(() => process.exit());
