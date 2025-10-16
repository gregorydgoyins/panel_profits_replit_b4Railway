"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MarvelScraper_1 = require("./services/entityScrapers/MarvelScraper");
async function testMarvelCreatorContributions() {
    console.log('🔍 Testing Marvel API Creator Contributions Scraper\n');
    console.log('======================================');
    const marvelScraper = new MarvelScraper_1.MarvelScraper();
    console.log('\n📖 Test 1: Scraping recent comic creator contributions');
    console.log('======================================\n');
    const recentContributions = await marvelScraper.scrapeCreatorContributions?.({ limit: 5 });
    if (recentContributions && recentContributions.length > 0) {
        console.log(`✅ Found ${recentContributions.length} creator contributions from recent Marvel comics\n`);
        recentContributions.slice(0, 3).forEach((contribution, index) => {
            console.log(`${index + 1}. ${contribution.creatorName} - ${contribution.creatorRole}`);
            console.log(`   Work: ${contribution.comicTitle}`);
            console.log(`   Year: ${contribution.publicationYear || 'Unknown'}`);
            console.log(`   Primary Creator: ${contribution.isPrimaryCreator ? 'Yes' : 'No'}`);
            console.log(`   Collaborators: ${contribution.collaborators?.length || 0}`);
            console.log('');
        });
    }
    else {
        console.log('❌ No creator contributions found in recent comics');
    }
    // Test 2: Search for specific creator
    console.log('======================================');
    console.log('📖 Test 2: Scraping Stan Lee contributions');
    console.log('======================================\n');
    const stanLeeContributions = await marvelScraper.scrapeCreatorContributions?.({
        creatorName: 'Stan Lee',
        limit: 10
    });
    if (stanLeeContributions && stanLeeContributions.length > 0) {
        console.log(`✅ Found ${stanLeeContributions.length} Stan Lee contributions\n`);
        // Group by role
        const roleGroups = stanLeeContributions.reduce((acc, c) => {
            if (!acc[c.creatorRole])
                acc[c.creatorRole] = 0;
            acc[c.creatorRole]++;
            return acc;
        }, {});
        console.log('Contributions by role:');
        Object.entries(roleGroups).forEach(([role, count]) => {
            console.log(`  ${role}: ${count}`);
        });
        console.log('');
        stanLeeContributions.slice(0, 3).forEach((contribution, index) => {
            console.log(`${index + 1}. ${contribution.comicTitle} (${contribution.publicationYear})`);
            console.log(`   Role: ${contribution.creatorRole}`);
            console.log(`   Collaborators: ${contribution.collaborators?.slice(0, 3).join(', ') || 'None'}...`);
            console.log('');
        });
    }
    else {
        console.log('❌ No Stan Lee contributions found');
    }
    console.log('📊 Marvel Creator Contributions Test Complete!');
}
testMarvelCreatorContributions().catch(console.error);
