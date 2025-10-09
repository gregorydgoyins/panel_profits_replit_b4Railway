import { WikidataScraper } from './services/entityScrapers/WikidataScraper';

async function testWikidataScraper() {
  console.log('🚀 Testing Wikidata SPARQL Scraper\n');

  const scraper = new WikidataScraper();

  try {
    console.log('======================================');
    console.log('Test 1: Scraping 10 comic characters');
    console.log('======================================\n');

    const characters = await scraper.scrapeEntities({
      entityType: 'character',
      limit: 10
    });

    console.log(`✅ Retrieved ${characters.length} characters from Wikidata\n`);

    // Display character details
    characters.forEach((char, index) => {
      console.log(`${index + 1}. ${char.entityName}`);
      console.log(`   ID: ${char.entityId}`);
      console.log(`   Publisher: ${char.publisher}`);
      console.log(`   Source: ${char.sourceUrl}`);
      
      if (char.firstAppearance) {
        console.log(`   First Appearance: ${char.firstAppearance.comicTitle}`);
      }
      
      if (char.attributes && char.attributes.length > 0) {
        const powers = char.attributes.slice(0, 3).map(a => a.name).join(', ');
        console.log(`   Powers: ${powers}`);
      }
      
      if (char.relationships && char.relationships.length > 0) {
        const rels = char.relationships.slice(0, 2).map(r => `${r.relationshipType}: ${r.targetEntityName}`).join(', ');
        console.log(`   Relationships: ${rels}`);
      }
      
      if (char.sourceData?.description) {
        console.log(`   Description: ${char.sourceData.description.substring(0, 80)}...`);
      }
      
      console.log('');
    });

    console.log('======================================');
    console.log('Test 2: Scraping 5 comic creators');
    console.log('======================================\n');

    const creators = await scraper.scrapeEntities({
      entityType: 'creator',
      limit: 5
    });

    console.log(`✅ Retrieved ${creators.length} creators from Wikidata\n`);

    creators.forEach((creator, index) => {
      console.log(`${index + 1}. ${creator.entityName}`);
      console.log(`   ID: ${creator.entityId}`);
      console.log(`   Source: ${creator.sourceUrl}`);
      
      if (creator.sourceData?.description) {
        console.log(`   Description: ${creator.sourceData.description}`);
      }
      
      console.log('');
    });

    console.log('======================================');
    console.log('Test 3: hasEntityData check');
    console.log('======================================\n');

    const hasSpiderMan = await scraper.hasEntityData('Spider-Man', 'character');
    console.log(`Spider-Man exists in Wikidata: ${hasSpiderMan ? '✅ Yes' : '❌ No'}`);

    const hasBatman = await scraper.hasEntityData('Batman', 'character');
    console.log(`Batman exists in Wikidata: ${hasBatman ? '✅ Yes' : '❌ No'}`);

    console.log('\n✅ Wikidata scraper test complete!');

  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

testWikidataScraper();
