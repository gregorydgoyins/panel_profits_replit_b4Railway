#!/usr/bin/env tsx

/**
 * Small test of hierarchical ticker generation
 */

import { assetGenerator } from '../server/assetGenerator.js';

async function main() {
  console.log('🎯 Testing Hierarchical Ticker System (Small Batch)\n');
  console.log('Format: SERIES.YEAR.CATEGORY.INDEX\n');

  try {
    // Generate small batch from Marvel only
    await assetGenerator.generateAssetUniverse({
      comicVineCharacters: 0,
      marvelCharacters: 20,
      superheroIds: []
    });

    console.log('\n✅ Test complete!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

main();
