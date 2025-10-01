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
      targetCharacters: 3000,  // Characters from all sources
      targetTeams: 500,        // Teams and alliances
      targetLocations: 500,    // Locations and realms
      targetObjects: 500,      // Gadgets and weapons
      targetCreators: 300      // Artists and writers
    });

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
    await derivativeGenerator.generateDerivatives([], 50);

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
