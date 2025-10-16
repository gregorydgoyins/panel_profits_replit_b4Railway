"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FandomWikiScraper_1 = require("./services/entityScrapers/FandomWikiScraper");
async function testFandomStoryArcs() {
    console.log('🔍 Testing Fandom Wiki Story Arc Scraper\n');
    console.log('======================================');
    // Test with Spawn wiki (likely to have story arcs)
    const spawnScraper = new FandomWikiScraper_1.FandomWikiScraper('spawn', 0.75);
    console.log('\n📖 Test 1: Scraping Spawn wiki story arcs');
    console.log('======================================\n');
    const spawnArcs = await spawnScraper.scrapeStoryArcs?.({ limit: 10 });
    if (spawnArcs && spawnArcs.length > 0) {
        console.log(`✅ Found ${spawnArcs.length} story arcs from Spawn wiki\n`);
        spawnArcs.slice(0, 5).forEach((arc, index) => {
            console.log(`${index + 1}. ${arc.arcName}`);
            console.log(`   Type: ${arc.arcType}`);
            console.log(`   Publisher: ${arc.publisher}`);
            console.log(`   Year: ${arc.startYear || 'Unknown'}`);
            console.log(`   Description: ${arc.arcDescription?.substring(0, 100) || 'N/A'}...`);
            console.log(`   Source: ${arc.sourceUrl}`);
            console.log('');
        });
    }
    else {
        console.log('❌ No story arcs found in Spawn wiki');
    }
    // Test with Image Comics wiki
    console.log('======================================');
    console.log('📖 Test 2: Scraping Image Comics wiki story arcs');
    console.log('======================================\n');
    const imageScraper = new FandomWikiScraper_1.FandomWikiScraper('image', 0.75);
    const imageArcs = await imageScraper.scrapeStoryArcs?.({ limit: 10 });
    if (imageArcs && imageArcs.length > 0) {
        console.log(`✅ Found ${imageArcs.length} story arcs from Image Comics wiki\n`);
        imageArcs.slice(0, 3).forEach((arc, index) => {
            console.log(`${index + 1}. ${arc.arcName}`);
            console.log(`   Type: ${arc.arcType}`);
            console.log(`   Year: ${arc.startYear || 'Unknown'}`);
            console.log('');
        });
    }
    else {
        console.log('❌ No story arcs found in Image Comics wiki');
    }
    console.log('📊 Fandom Story Arc Test Complete!');
}
testFandomStoryArcs().catch(console.error);
