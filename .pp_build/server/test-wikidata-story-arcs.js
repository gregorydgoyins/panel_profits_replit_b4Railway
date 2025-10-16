"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WikidataScraper_1 = require("./services/entityScrapers/WikidataScraper");
async function testWikidataStoryArcs() {
    console.log('🔍 Testing Wikidata Story Arc Scraper\n');
    console.log('======================================');
    const scraper = new WikidataScraper_1.WikidataScraper();
    // Test 1: Scrape Marvel story arcs
    console.log('\n📖 Test 1: Scraping Marvel story arcs');
    console.log('======================================\n');
    const marvelArcs = await scraper.scrapeStoryArcs?.({
        publisher: 'Marvel',
        limit: 10
    });
    if (marvelArcs && marvelArcs.length > 0) {
        console.log(`✅ Found ${marvelArcs.length} Marvel story arcs\n`);
        marvelArcs.slice(0, 3).forEach((arc, index) => {
            console.log(`${index + 1}. ${arc.arcName}`);
            console.log(`   Type: ${arc.arcType}`);
            console.log(`   Publisher: ${arc.publisher}`);
            console.log(`   Year: ${arc.startYear || 'Unknown'}`);
            console.log(`   Universe: ${arc.universe || 'N/A'}`);
            console.log(`   Description: ${arc.arcDescription?.substring(0, 100) || 'N/A'}...`);
            console.log(`   Source: ${arc.sourceUrl}`);
            console.log('');
        });
    }
    else {
        console.log('❌ No Marvel story arcs found');
    }
    // Test 2: Scrape DC story arcs
    console.log('======================================');
    console.log('📖 Test 2: Scraping DC story arcs');
    console.log('======================================\n');
    const dcArcs = await scraper.scrapeStoryArcs?.({
        publisher: 'DC',
        limit: 10
    });
    if (dcArcs && dcArcs.length > 0) {
        console.log(`✅ Found ${dcArcs.length} DC story arcs\n`);
        dcArcs.slice(0, 3).forEach((arc, index) => {
            console.log(`${index + 1}. ${arc.arcName}`);
            console.log(`   Type: ${arc.arcType}`);
            console.log(`   Publisher: ${arc.publisher}`);
            console.log(`   Year: ${arc.startYear || 'Unknown'}`);
            console.log(`   Universe: ${arc.universe || 'N/A'}`);
            console.log(`   Description: ${arc.arcDescription?.substring(0, 100) || 'N/A'}...`);
            console.log('');
        });
    }
    else {
        console.log('❌ No DC story arcs found');
    }
    // Test 3: Scrape all publishers
    console.log('======================================');
    console.log('📖 Test 3: Scraping story arcs (all publishers)');
    console.log('======================================\n');
    const allArcs = await scraper.scrapeStoryArcs?.({
        limit: 15
    });
    if (allArcs && allArcs.length > 0) {
        console.log(`✅ Found ${allArcs.length} story arcs across all publishers\n`);
        const arcTypes = new Set(allArcs.map(a => a.arcType));
        console.log(`Arc types found: ${Array.from(arcTypes).join(', ')}`);
        const publishers = new Set(allArcs.map(a => a.publisher));
        console.log(`Publishers found: ${Array.from(publishers).join(', ')}`);
        console.log('');
    }
    else {
        console.log('❌ No story arcs found');
    }
    console.log('📊 Wikidata Story Arc Test Complete!');
}
testWikidataStoryArcs().catch(console.error);
