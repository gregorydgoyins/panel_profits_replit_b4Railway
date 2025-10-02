import { storage } from '../storage';
import type { InsertPriceHistory, Asset, AssetCurrentPrice } from '@shared/schema';

interface AssetPrice {
  id: string;
  symbol: string;
  currentPrice: number;
}

// Supported CGC grading tiers (7 official grades)
const CGC_GRADES = [
  'ungraded',
  'cgc-4.0',
  'cgc-6.0',
  'cgc-8.0',
  'cgc-9.2',
  'cgc-9.8',
  'cgc-10.0'
];

// Price multipliers for each CGC grade (relative to ungraded base price)
const GRADE_MULTIPLIERS: Record<string, number> = {
  'ungraded': 1.0,
  'cgc-4.0': 2.0,
  'cgc-6.0': 5.0,
  'cgc-8.0': 12.0,
  'cgc-9.2': 25.0,
  'cgc-9.8': 50.0,
  'cgc-10.0': 100.0
};

export async function seedPriceHistory() {
  console.log('📊 Starting price history seeding...');
  
  try {
    // Get all assets with prices
    const assets = await storage.getAssets({});
    const prices = await storage.getAllAssetCurrentPrices();
    
    const assetPrices: AssetPrice[] = assets.map((asset: Asset) => {
      const price = prices.find((p: AssetCurrentPrice) => p.assetId === asset.id);
      return {
        id: asset.id,
        symbol: asset.symbol,
        currentPrice: price ? parseFloat(price.currentPrice) : 100
      };
    }).filter((ap: AssetPrice) => ap.currentPrice > 0);

    console.log(`📈 Found ${assetPrices.length} assets with prices`);

    const daysToBackfill = 90; // Create 90 days of history
    const now = new Date();
    let totalRecords = 0;

    for (const assetPrice of assetPrices) {
      // Collect all records for this asset before inserting
      const assetRecords: InsertPriceHistory[] = [];
      
      // Generate price history for each grade
      for (const grade of CGC_GRADES) {
        const basePrice = assetPrice.currentPrice * (GRADE_MULTIPLIERS[grade] || 1);
        
        // Create daily snapshots going backwards
        for (let daysAgo = 0; daysAgo < daysToBackfill; daysAgo++) {
          const snapshotDate = new Date(now);
          snapshotDate.setDate(now.getDate() - daysAgo);
          
          // Add some realistic price variation (±5% random walk)
          const variation = 1 + (Math.random() * 0.1 - 0.05) * (daysAgo / 30); // More variation further back
          const historicalPrice = basePrice * variation;
          
          assetRecords.push({
            assetId: assetPrice.id,
            grade: grade,
            price: Number(historicalPrice.toFixed(2)), // Store as number, not string
            source: 'calculated',
            snapshotDate: snapshotDate,
            metadata: {
              basePrice: Number(basePrice.toFixed(2)),
              variation: Number(variation.toFixed(4)),
              daysAgo: daysAgo
            }
          });
        }
      }
      
      // Batch insert all records for this asset
      await storage.createPriceHistoryBatch(assetRecords);
      totalRecords += assetRecords.length;
      
      console.log(`✅ Created ${assetRecords.length} price history records for ${assetPrice.symbol}`);
    }

    console.log(`🎉 Price history seeding completed! Total records created: ${totalRecords}`);
  } catch (error) {
    console.error('❌ Error seeding price history:', error);
    throw error;
  }
}
