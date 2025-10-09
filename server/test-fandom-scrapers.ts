#!/usr/bin/env tsx
/**
 * Test script for Fandom MediaWiki scrapers
 * Tests Dark Horse, Image Comics, Spawn, Walking Dead, and other publisher wikis
 */

import { FandomWikiScraper, FANDOM_WIKIS } from './services/entityScrapers/FandomWikiScraper.js';

async function testWiki(wikiKey: string) {
  const config = FANDOM_WIKIS[wikiKey];
  console.log(`\n${'='.repeat(70)}`);
  console.log(`Testing ${config.publisher} Wiki (${wikiKey})`);
  console.log(`Base URL: ${config.baseUrl}`);
  console.log(`${'='.repeat(70)}`);

  try {
    const scraper = new FandomWikiScraper(wikiKey);
    
    const entities = await scraper.scrapeEntities({
      entityType: 'character',
      limit: 5
    });

    console.log(`\n✅ Retrieved ${entities.length} ${config.publisher} characters:\n`);

    entities.forEach((entity, index) => {
      console.log(`${index + 1}. ${entity.entityName}`);
      console.log(`   ID: ${entity.entityId}`);
      console.log(`   Publisher: ${entity.publisher}`);
      console.log(`   Source: ${entity.sourceUrl}`);
      
      if (entity.firstAppearance) {
        console.log(`   First Appearance: ${entity.firstAppearance.comicTitle}`);
      }
      
      if (entity.attributes && entity.attributes.length > 0) {
        const powers = entity.attributes.filter(a => a.category === 'power').slice(0, 3);
        if (powers.length > 0) {
          console.log(`   Powers: ${powers.map(p => p.name).join(', ')}`);
        }
        
        const realName = entity.attributes.find(a => a.name === 'Real Name');
        if (realName) {
          console.log(`   Real Name: ${realName.description}`);
        }
      }
      
      if (entity.relationships && entity.relationships.length > 0) {
        const teams = entity.relationships.filter(r => r.relationshipType === 'teammate').slice(0, 2);
        if (teams.length > 0) {
          console.log(`   Teams: ${teams.map(t => t.targetEntityName).join(', ')}`);
        }
      }
      
      if (entity.sourceData?.description) {
        console.log(`   Description: ${entity.sourceData.description.substring(0, 100)}...`);
      }
      
      console.log('');
    });

    return entities.length;
  } catch (error) {
    console.error(`❌ Error testing ${config.publisher}:`, error);
    return 0;
  }
}

async function main() {
  console.log('\n🚀 Fandom MediaWiki Scraper Test Suite');
  console.log('=====================================\n');

  const wikis = [
    'dark_horse',   // Dark Horse Comics (Hellboy, Sin City, 300)
    'image',        // Image Comics (general)
    'spawn',        // Spawn-specific
    'walking_dead', // The Walking Dead
    'idw',          // IDW Publishing (TMNT, Transformers)
  ];

  const results: Record<string, number> = {};

  for (const wiki of wikis) {
    results[wiki] = await testWiki(wiki);
    
    // Rate limiting between wikis
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log('SUMMARY');
  console.log(`${'='.repeat(70)}\n`);

  for (const [wiki, count] of Object.entries(results)) {
    const config = FANDOM_WIKIS[wiki];
    const status = count > 0 ? '✅' : '❌';
    console.log(`${status} ${config.publisher} (${wiki}): ${count} entities`);
  }

  const totalEntities = Object.values(results).reduce((sum, count) => sum + count, 0);
  console.log(`\n📊 Total entities retrieved: ${totalEntities}`);

  const successfulWikis = Object.values(results).filter(count => count > 0).length;
  console.log(`🎯 Successful wikis: ${successfulWikis}/${wikis.length}`);

  if (successfulWikis === wikis.length) {
    console.log('\n🎉 All Fandom wikis working correctly!');
    process.exit(0);
  } else if (successfulWikis > 0) {
    console.log('\n⚠️  Some wikis returned no data (may need category adjustment)');
    process.exit(0);
  } else {
    console.log('\n❌ All wikis failed - check API connectivity');
    process.exit(1);
  }
}

main();
