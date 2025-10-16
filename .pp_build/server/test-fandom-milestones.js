"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FandomWikiScraper_1 = require("./services/entityScrapers/FandomWikiScraper");
async function testFandomMilestones() {
    console.log('🔍 Testing Fandom Wiki Narrative Milestone Scraper\n');
    console.log('======================================');
    // Test with Spawn wiki (likely to have milestone data)
    const spawnScraper = new FandomWikiScraper_1.FandomWikiScraper('spawn', 0.75);
    console.log('\n📖 Test 1: Scraping Spawn character milestones');
    console.log('======================================\n');
    const spawnMilestones = await spawnScraper.scrapeNarrativeMilestones?.({ limit: 10 });
    if (spawnMilestones && spawnMilestones.length > 0) {
        console.log(`✅ Found ${spawnMilestones.length} narrative milestones from Spawn wiki\n`);
        spawnMilestones.slice(0, 5).forEach((milestone, index) => {
            console.log(`${index + 1}. ${milestone.milestoneName}`);
            console.log(`   Type: ${milestone.milestoneType}`);
            console.log(`   Entity: ${milestone.entityName}`);
            console.log(`   Occurred in: ${milestone.occurredInComicTitle}`);
            console.log(`   Year: ${milestone.occurredYear || 'Unknown'}`);
            console.log(`   Description: ${milestone.milestoneDescription?.substring(0, 80) || 'N/A'}...`);
            console.log('');
        });
    }
    else {
        console.log('❌ No narrative milestones found in Spawn wiki');
    }
    // Test with Image Comics wiki
    console.log('======================================');
    console.log('📖 Test 2: Scraping Image Comics character milestones');
    console.log('======================================\n');
    const imageScraper = new FandomWikiScraper_1.FandomWikiScraper('image', 0.75);
    const imageMilestones = await imageScraper.scrapeNarrativeMilestones?.({ limit: 10 });
    if (imageMilestones && imageMilestones.length > 0) {
        console.log(`✅ Found ${imageMilestones.length} narrative milestones from Image Comics wiki\n`);
        // Group by milestone type
        const grouped = imageMilestones.reduce((acc, m) => {
            if (!acc[m.milestoneType])
                acc[m.milestoneType] = 0;
            acc[m.milestoneType]++;
            return acc;
        }, {});
        console.log('Milestone breakdown:');
        Object.entries(grouped).forEach(([type, count]) => {
            console.log(`  ${type}: ${count}`);
        });
        console.log('');
        imageMilestones.slice(0, 3).forEach((milestone, index) => {
            console.log(`${index + 1}. ${milestone.milestoneName}`);
            console.log(`   Type: ${milestone.milestoneType}`);
            console.log(`   Occurred in: ${milestone.occurredInComicTitle}`);
            console.log('');
        });
    }
    else {
        console.log('❌ No narrative milestones found in Image Comics wiki');
    }
    console.log('📊 Fandom Narrative Milestone Test Complete!');
}
testFandomMilestones().catch(console.error);
