#!/usr/bin/env tsx

/**
 * Panel Profits - Full Asset Universe Generator
 * Orchestrates all systems to generate 200,000+ assets with complete metadata
 */

import { batchedAssetFetcher } from '../server/batchedAssetFetcher.js';
import { marketDataGenerator } from '../server/marketDataGenerator.js';
import { sevenHousesAssignment } from '../server/sevenHousesAssignment.js';
import { assetEnrichment } from '../server/assetEnrichmentService.js';
import { derivativeGenerator } from '../server/derivativeGenerator.js';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('🚀 Panel Profits - Full Asset Universe Generation\n');
  console.log('=' .repeat(80));
  console.log('This will generate a comprehensive trading universe with:');
  console.log('  - Base assets across all categories (heroes, villains, gadgets, locations, etc.)');
  console.log('  - Market data with technical indicators');
  console.log('  - Seven Houses assignments');
  console.log('  - Asset enrichment (rarity, significance, cultural impact)');
  console.log('  - Derivative instruments (options, bonds, ETFs)');
  console.log('=' .repeat(80));
  console.log();

  try {
    // Step 1: Initialize Seven Houses
    console.log('📊 STEP 1: Initializing Seven Houses...\n');
    await sevenHousesAssignment.ensureHousesExist();

    // Step 2: Generate base assets using batched fetcher
    console.log('\n📊 STEP 2: Generating base assets...\n');
    await batchedAssetFetcher.generateLargeAssetUniverse({
      targetCharacters: 15000,  // Characters from all sources - scale to 15k
      targetTeams: 2000,        // Teams and alliances - scale to 2k
      targetLocations: 2000,    // Locations and realms - scale to 2k
      targetObjects: 2000,      // Gadgets and weapons - scale to 2k
      targetCreators: 1000      // Artists and writers - scale to 1k
    });
    
    // Total base assets: ~22,000
    // With derivatives (options, bonds, ETFs): 200,000+ total instruments

    // Step 3: Assign assets to Seven Houses
    console.log('\n📊 STEP 3: Assigning assets to Seven Houses...\n');
    await sevenHousesAssignment.assignHousesToAllAssets();
    await sevenHousesAssignment.updateHouseStatistics();

    // Step 4: Enrich all assets
    console.log('\n📊 STEP 4: Enriching assets with metadata...\n');
    await assetEnrichment.enrichAllAssets();

    // Step 5: Generate market data
    console.log('\n📊 STEP 5: Generating market data...\n');
    await marketDataGenerator.generateMarketDataForAllAssets(365);

    // Step 6: Generate derivatives
    console.log('\n📊 STEP 6: Generating derivative instruments...\n');
    
    // Fetch all base assets to generate derivatives from
    const { db } = await import('../server/databaseStorage.js');
    const { assets } = await import('../shared/schema.js');
    const baseAssets = await db.select().from(assets).where(
      sql`type IN ('HER', 'VIL', 'TEM', 'LOC', 'GAD', 'CRT', 'KEY')`
    );
    
    console.log(`Found ${baseAssets.length} base assets for derivative generation`);
    
    // Generate derivatives to reach 200k+ total instruments
    // Target: 22k base assets * ~10 derivatives each = 220k total
    await derivativeGenerator.generateDerivatives(
      baseAssets.map(a => a.symbol),
      Math.min(baseAssets.length, 20000) // Process up to 20k base assets for derivatives
    );
    
    console.log(`\n🎯 Target: 200,000+ total tradable instruments`);
    console.log(`   Base assets: ${baseAssets.length.toLocaleString()}`);
    console.log(`   Expected derivatives: ~${(baseAssets.length * 10).toLocaleString()}`);
    console.log(`   Estimated total: ~${(baseAssets.length + baseAssets.length * 10).toLocaleString()} instruments`);

    // Final summary
    const stats = batchedAssetFetcher.getStats();
    
    console.log('\n' + '='.repeat(80));
    console.log('✨ FULL ASSET UNIVERSE GENERATION COMPLETE!');
    console.log('='.repeat(80));
    console.log('\n📊 Final Statistics:');
    console.log(`   Total API calls: ${stats.apiCalls}`);
    console.log(`   Assets fetched: ${stats.totalFetched}`);
    console.log(`   Duplicates removed: ${stats.duplicates}`);
    console.log(`   Errors encountered: ${stats.errors}`);
    console.log();
    console.log('🎯 Asset Universe Ready for Trading!');
    console.log('   - Base assets with hierarchical tickers');
    console.log('   - 365 days of market history with technical indicators');
    console.log('   - Seven Houses control assignments');
    console.log('   - Rarity and cultural impact ratings');
    console.log('   - Options, bonds, and ETFs available');
    console.log();

    process.exit(0);
  } catch (error) {
    console.error('❌ Universe generation failed:', error);
    process.exit(1);
  }
}

main();
