#!/usr/bin/env tsx
"use strict";
/**
 * Marvel Data & News Warehouse Population Script
 *
 * Fetches:
 * - Marvel characters, comics, creators from Marvel API
 * - News stories from NewsData.io + RSS feeds
 *
 * Usage:
 *   tsx server/scripts/fetchMarvelDataAndNews.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
const marvelExpansionService_1 = require("../services/marvelExpansionService");
const newsStorageService_1 = require("../services/newsStorageService");
async function main() {
    console.log('🚀 Starting Marvel Data & News Warehouse Population');
    console.log('='.repeat(70));
    try {
        // Initialize news service
        const newsService = new newsStorageService_1.NewsStorageService();
        // Step 1: Fetch Marvel Data
        console.log('\n📚 STEP 1: Fetching Marvel API Data...\n');
        console.log('1️⃣  Expanding Marvel Characters...');
        const charactersResult = await marvelExpansionService_1.marvelExpansionService.expandCharacters(0, 100);
        console.log(`   ✅ Created ${charactersResult.created} new character assets`);
        console.log(`   ℹ️  Skipped ${charactersResult.skipped} existing`);
        console.log(`   📊 Total available: ${charactersResult.totalAvailable}`);
        console.log('\n2️⃣  Expanding Marvel Comics...');
        const comicsResult = await marvelExpansionService_1.marvelExpansionService.expandComics(0, 100);
        console.log(`   ✅ Created ${comicsResult.created} new comic assets`);
        console.log(`   ℹ️  Skipped ${comicsResult.skipped} existing`);
        console.log(`   📊 Total available: ${comicsResult.totalAvailable}`);
        console.log('\n3️⃣  Expanding Marvel Creators...');
        const creatorsResult = await marvelExpansionService_1.marvelExpansionService.expandCreators(0, 50);
        console.log(`   ✅ Created ${creatorsResult.created} new creator assets`);
        console.log(`   ℹ️  Skipped ${creatorsResult.skipped} existing`);
        console.log(`   📊 Total available: ${creatorsResult.totalAvailable}`);
        // Step 2: Fetch News Stories
        console.log('\n\n📰 STEP 2: Populating News Warehouse...\n');
        console.log('1️⃣  Fetching from NewsData.io API...');
        const newsDataArticles = await newsService.fetchFromNewsDataIO(50);
        console.log(`   ✅ Fetched ${newsDataArticles.length} articles from NewsData.io`);
        console.log('\n2️⃣  Fetching from RSS feeds...');
        const rssArticles = await newsService.fetchFromRSSFeeds();
        console.log(`   ✅ Fetched ${rssArticles.length} articles from RSS feeds`);
        console.log('\n3️⃣  Storing articles in news warehouse...');
        const totalArticles = [...newsDataArticles, ...rssArticles];
        const stored = await newsService.storeArticles(totalArticles);
        console.log(`   ✅ Stored ${stored} new articles in warehouse`);
        // Summary
        console.log('\n' + '='.repeat(70));
        console.log('✨ DATA POPULATION COMPLETE!\n');
        console.log('📊 Marvel Assets Summary:');
        console.log(`   - Characters: ${charactersResult.created} new`);
        console.log(`   - Comics: ${comicsResult.created} new`);
        console.log(`   - Creators: ${creatorsResult.created} new`);
        console.log(`   - Total Assets: ${charactersResult.created + comicsResult.created + creatorsResult.created} new\n`);
        console.log('📰 News Warehouse Summary:');
        console.log(`   - NewsData.io: ${newsDataArticles.length} fetched`);
        console.log(`   - RSS Feeds: ${rssArticles.length} fetched`);
        console.log(`   - Total Stored: ${stored} new articles\n`);
        console.log('='.repeat(70));
    }
    catch (error) {
        console.error('\n❌ Fatal error during data population:', error);
        process.exit(1);
    }
    process.exit(0);
}
main();
