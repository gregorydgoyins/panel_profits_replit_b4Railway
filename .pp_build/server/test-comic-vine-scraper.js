#!/usr/bin/env tsx
"use strict";
/**
 * Standalone test script for Comic Vine scraper
 * Tests multi-publisher functionality without HTTP routing issues
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ComicVineScraper_js_1 = require("./services/entityScrapers/ComicVineScraper.js");
async function testPublisher(publisher) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing Comic Vine scraper for: ${publisher}`);
    console.log(`${'='.repeat(60)}`);
    const apiKey = process.env.COMIC_VINE_API_KEY;
    if (!apiKey) {
        console.error('❌ COMIC_VINE_API_KEY not configured');
        process.exit(1);
    }
    try {
        const scraper = new ComicVineScraper_js_1.ComicVineScraper(apiKey);
        const entities = await scraper.scrapeEntities({
            entityType: 'character',
            publisher: publisher,
            limit: 5
        });
        console.log(`\n✅ Retrieved ${entities.length} ${publisher} entities:\n`);
        entities.forEach((entity, index) => {
            console.log(`${index + 1}. ${entity.entityName}`);
            console.log(`   ID: ${entity.entityId}`);
            console.log(`   Publisher: ${entity.publisher || 'N/A'}`);
            console.log(`   First Appearance: ${entity.firstAppearance?.comicTitle || 'N/A'}`);
            console.log(`   Relationships: ${entity.relationships?.length || 0}`);
            console.log(`   Attributes: ${entity.attributes?.length || 0}`);
            console.log('');
        });
        return entities.length;
    }
    catch (error) {
        console.error(`❌ Error testing ${publisher}:`, error);
        return 0;
    }
}
async function main() {
    console.log('\n🚀 Comic Vine Multi-Publisher Scraper Test');
    console.log('=========================================\n');
    const publishers = [
        'Dark Horse',
        'Image',
        'IDW',
        'Valiant',
        'Boom',
        'Dynamite'
    ];
    const results = {};
    for (const publisher of publishers) {
        results[publisher] = await testPublisher(publisher);
    }
    console.log(`\n${'='.repeat(60)}`);
    console.log('SUMMARY');
    console.log(`${'='.repeat(60)}\n`);
    for (const [publisher, count] of Object.entries(results)) {
        const status = count > 0 ? '✅' : '❌';
        console.log(`${status} ${publisher}: ${count} entities`);
    }
    const totalEntities = Object.values(results).reduce((sum, count) => sum + count, 0);
    console.log(`\n📊 Total entities retrieved: ${totalEntities}`);
    const successfulPublishers = Object.values(results).filter(count => count > 0).length;
    console.log(`🎯 Successful publishers: ${successfulPublishers}/${publishers.length}`);
    if (successfulPublishers === publishers.length) {
        console.log('\n🎉 All publishers working correctly!');
        process.exit(0);
    }
    else {
        console.log('\n⚠️  Some publishers failed to return entities');
        process.exit(1);
    }
}
main();
