#!/usr/bin/env tsx

/**
 * Continuous Marvel Data & News Ingestion
 * Optimized for speed and reliability
 */

import { marvelExpansionService } from '../services/marvelExpansionService';
import { NewsStorageService } from '../services/newsStorageService';

async function main() {
  console.log('🚀 Continuous Data Ingestion Started');
  console.log('='.repeat(60));

  const newsService = new NewsStorageService();
  
  // Fetch Marvel data from different offsets to get new content
  console.log('\n📚 Marvel API Data Expansion...\n');
  
  // Characters: Try offset 100-200 to get different data
  console.log('1️⃣ Marvel Characters (offset 100, limit 50)...');
  try {
    const chars = await marvelExpansionService.expandCharacters(100, 50);
    console.log(`   ✅ ${chars.created} created, ${chars.skipped} skipped`);
  } catch (err) {
    console.log(`   ❌ Error: ${err}`);
  }

  // Comics: Try offset 200-250
  console.log('\n2️⃣ Marvel Comics (offset 200, limit 50)...');
  try {
    const comics = await marvelExpansionService.expandComics(200, 50);
    console.log(`   ✅ ${comics.created} created, ${comics.skipped} skipped`);
  } catch (err) {
    console.log(`   ❌ Error: ${err}`);
  }

  // Creators: Try offset 100-130
  console.log('\n3️⃣ Marvel Creators (offset 100, limit 30)...');
  try {
    const creators = await marvelExpansionService.expandCreators(100, 30);
    console.log(`   ✅ ${creators.created} created, ${creators.skipped} skipped`);
  } catch (err) {
    console.log(`   ❌ Error: ${err}`);
  }

  // News: Only use working feeds (CBR, IGN, Polygon, Screen Rant)
  console.log('\n\n📰 News Warehouse Population...\n');
  
  const workingFeeds = [
    { name: 'CBR', url: 'https://www.cbr.com/feed/' },
    { name: 'IGN Comics', url: 'https://feeds.ign.com/ign/comics-all' },
    { name: 'Polygon Comics', url: 'https://www.polygon.com/rss/comics/index.xml' },
    { name: 'Screen Rant Comics', url: 'https://screenrant.com/tag/comics/feed/' },
    { name: 'Bleeding Cool', url: 'https://bleedingcool.com/comics/feed/' },
  ];

  let totalStored = 0;
  
  for (const feed of workingFeeds) {
    try {
      console.log(`📡 Fetching ${feed.name}...`);
      const parser = newsService['rssParser'];
      const parsedFeed = await parser.parseURL(feed.url);
      
      const articles = parsedFeed.items.slice(0, 10).map((item: any) => ({
        headline: item.title || 'Untitled',
        summary: item.contentSnippet || item.content || '',
        fullContent: item.link || '',
        sourceOrganization: feed.name,
        authorName: item.creator || item.author || null,
        publishTime: item.pubDate ? new Date(item.pubDate) : new Date(),
        imageUrl: null,
        content: item.content || '',
      }));

      const stored = await newsService.storeArticles(articles);
      totalStored += stored;
      console.log(`   ✅ Stored ${stored} articles`);
    } catch (err) {
      console.log(`   ❌ ${feed.name} failed`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✨ Ingestion Complete! Stored ${totalStored} news articles`);
  console.log('='.repeat(60));
}

main().then(() => process.exit(0)).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
