import { db } from '../databaseStorage';
import { assets, assetCurrentPrices } from '@shared/schema';
import { PineconeAssetExpansionService } from '../services/pineconeAssetExpansion';
import { openaiService } from '../services/openaiService';
import { pineconeService } from '../services/pineconeService';
import { sql, inArray } from 'drizzle-orm';

async function fullExpansion() {
  console.log('🚀 FULL PINECONE EXPANSION: All 63,934 Records\n');
  console.log('=' .repeat(80));
  
  // Initialize services
  console.log('🔧 Initializing services...');
  await pineconeService.init();
  await openaiService.init();
  console.log('✅ Services ready\n');
  
  // Check starting count
  const before = await db.execute(sql`SELECT COUNT(*) as count FROM assets`);
  const startCount = Number(before.rows[0].count);
  console.log(`📊 Starting assets: ${startCount.toLocaleString()}\n`);
  
  const expansionService = new PineconeAssetExpansionService();
  
  // Run full expansion - process ALL 63,934 records in batches
  // This will sample ~21,000 per category (Characters, Creators, Comics)
  console.log('🔄 Processing all Pinecone records (batches of 1000)...\n');
  
  let totalGenerated = 0;
  let totalInserted = 0;
  const batchSize = 1000;
  const totalSamples = 21000; // ~21K per category = ~63K total
  
  for (let i = 0; i < totalSamples; i += batchSize) {
    const currentBatch = Math.min(batchSize, totalSamples - i);
    console.log(`📦 Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(totalSamples/batchSize)} (${currentBatch} samples)...`);
    
    try {
      const result = await expansionService.expandAssetDatabase(currentBatch, {
        batchSize: 100
      });
      
      if (!result || result.totalAssets === 0) {
        console.warn(`⚠️  No assets generated in this batch`);
        continue;
      }
      
      totalGenerated += result.totalAssets;
      
      // Insert assets into database
      const allAssets = [
        ...result.characterAssets,
        ...result.creatorAssets,
        ...result.comicAssets
      ];
      
      // Check for duplicates before inserting
      const symbols = allAssets.map(a => a.symbol);
      const existing = await db.select({ symbol: assets.symbol })
        .from(assets)
        .where(inArray(assets.symbol, symbols));
      
      const existingSymbols = new Set(existing.map(e => e.symbol));
      const newAssets = allAssets.filter(a => !existingSymbols.has(a.symbol));
      
      if (newAssets.length > 0) {
        // Insert assets
        const assetInserts = newAssets.map(a => ({
          symbol: a.symbol,
          name: a.name,
          category: a.category,
          description: a.metadata?.publisher || null,
          metadata: JSON.stringify(a.metadata)
        }));
        
        await db.insert(assets).values(assetInserts);
        
        // Insert prices
        const priceInserts = newAssets
          .filter(a => a.pricing)
          .map(a => ({
            assetId: a.symbol,
            currentPrice: a.pricing.currentPrice,
            highPrice: a.pricing.currentPrice,
            lowPrice: a.pricing.currentPrice,
            volume: 0,
            timestamp: new Date().toISOString()
          }));
        
        if (priceInserts.length > 0) {
          await db.insert(assetCurrentPrices).values(priceInserts);
        }
        
        totalInserted += newAssets.length;
        console.log(`   ✅ Inserted ${newAssets.length} new assets (${existingSymbols.size} duplicates skipped)`);
      } else {
        console.log(`   ⚠️  All ${allAssets.length} assets were duplicates`);
      }
      
      console.log(`   📈 Progress: ${totalInserted.toLocaleString()} total new assets added\n`);
      
    } catch (error) {
      console.error(`   ❌ Batch error:`, error);
      continue;
    }
  }
  
  // Final summary
  const after = await db.execute(sql`SELECT COUNT(*) as count FROM assets`);
  const endCount = Number(after.rows[0].count);
  
  console.log('\n' + '=' .repeat(80));
  console.log('✅ EXPANSION COMPLETE');
  console.log(`📊 Assets before: ${startCount.toLocaleString()}`);
  console.log(`📊 Assets after: ${endCount.toLocaleString()}`);
  console.log(`📊 New assets added: ${(endCount - startCount).toLocaleString()}`);
  console.log(`📊 Total generated: ${totalGenerated.toLocaleString()}`);
  console.log('=' .repeat(80));
}

fullExpansion().catch(console.error).finally(() => process.exit(0));
