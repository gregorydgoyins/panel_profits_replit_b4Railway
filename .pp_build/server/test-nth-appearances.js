"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MarvelScraper_1 = require("./services/entityScrapers/MarvelScraper");
async function testNthAppearances() {
    console.log('🔍 Testing Marvel API Nth Appearances Scraper\n');
    console.log('======================================\n');
    const scraper = new MarvelScraper_1.MarvelScraper();
    // Test 1: Get Spider-Man's first 10 appearances
    console.log('📖 Test 1: Spider-Man first 10 appearances');
    console.log('======================================\n');
    const spiderManAppearances = await scraper.scrapeNthAppearances({
        entityName: 'Spider-Man',
        limit: 10
    });
    console.log(`✅ Found ${spiderManAppearances.length} Spider-Man appearances\n`);
    spiderManAppearances.forEach((appearance, index) => {
        if (index < 5) { // Show first 5
            console.log(`${appearance.appearanceOrdinal} appearance: ${appearance.comicTitle}`);
            console.log(`   Year: ${appearance.publicationYear || 'Unknown'}`);
            console.log(`   Key appearance: ${appearance.isKeyAppearance ? 'Yes' : 'No'}`);
            console.log('');
        }
    });
    // Test 2: Get Iron Man's 5th appearance specifically
    console.log('======================================');
    console.log('📖 Test 2: Iron Man 5th appearance');
    console.log('======================================\n');
    const ironMan5th = await scraper.scrapeNthAppearances({
        entityName: 'Iron Man',
        appearanceNumber: 5
    });
    if (ironMan5th.length > 0) {
        console.log(`✅ Found Iron Man's ${ironMan5th[0].appearanceOrdinal} appearance:\n`);
        console.log(`Comic: ${ironMan5th[0].comicTitle}`);
        console.log(`Year: ${ironMan5th[0].publicationYear || 'Unknown'}`);
        console.log(`Month: ${ironMan5th[0].publicationMonth || 'Unknown'}`);
        console.log(`Issue: ${ironMan5th[0].issueNumber || 'N/A'}`);
    }
    // Test 3: Get first 150 appearances to test pagination
    console.log('\n======================================');
    console.log('📖 Test 3: Spider-Man first 150 appearances (pagination test)');
    console.log('======================================\n');
    const spiderMan150 = await scraper.scrapeNthAppearances({
        entityName: 'Spider-Man',
        limit: 150
    });
    console.log(`✅ Found ${spiderMan150.length} Spider-Man appearances`);
    if (spiderMan150.length > 100) {
        console.log(`\n✅ Pagination working! Found ${spiderMan150.length} appearances (more than 1 page)`);
        console.log(`\n100th appearance: ${spiderMan150[99].comicTitle} (${spiderMan150[99].publicationYear})`);
        console.log(`150th appearance: ${spiderMan150[149]?.comicTitle || 'Not found'} (${spiderMan150[149]?.publicationYear || 'N/A'})`);
    }
    else if (spiderMan150.length === 100) {
        console.log(`⚠️  Only found 100 appearances - may be pagination issue or data limit`);
    }
    else {
        console.log(`❌ Found fewer than 100 appearances`);
    }
    console.log('\n📊 Marvel Nth Appearances Test Complete!');
}
testNthAppearances().catch(console.error);
