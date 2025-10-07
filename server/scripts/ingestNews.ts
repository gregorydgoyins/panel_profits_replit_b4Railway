#!/usr/bin/env tsx

/**
 * News Warehouse Ingestion Script  
 * Populates news_articles table with comic book stories
 */

import { NewsStorageService } from '../services/newsStorageService';

async function main() {
  console.log('📰 News Warehouse Ingestion Started');
  console.log('='.repeat(60));

  const newsService = new NewsStorageService();

  try {
    // Use the built-in comprehensive news fetching method
    console.log('\n📡 Fetching news from all sources...\n');
    
    const result = await newsService.fetchAndStoreAllNews();

    console.log('\n' + '='.repeat(60));
    console.log('✨ Ingestion Complete!');
    console.log(`   📊 Total Fetched: ${result.totalFetched} articles`);
    console.log(`   💾 Total Stored: ${result.totalStored} articles`);
    console.log(`   📰 NewsData.io: ${result.fromNewsDataIO} fetched`);
    console.log(`   📡 RSS Feeds: ${result.fromRSS} fetched`);
    console.log('='.repeat(60));
  } catch (err) {
    console.error('\n❌ Error during ingestion:', err);
    throw err;
  }
}

main().then(() => process.exit(0)).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
