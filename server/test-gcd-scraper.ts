import { GCDScraper } from './services/entityScrapers/GCDScraper';

async function testGCDScraper() {
  console.log('🚀 Testing GCD Scraper\n');
  
  const scraper = new GCDScraper();
  
  // Test 1: Search for creators
  console.log('======================================');
  console.log('Test 1: Scraping 10 creators');
  console.log('======================================\n');
  
  const creators = await scraper.scrapeEntities({ 
    entityType: 'creator', 
    limit: 10 
  });
  
  console.log(`Retrieved ${creators.length} creators from GCD`);
  console.log(`✅ Retrieved ${creators.length} creators from GCD\n`);
  
  creators.forEach((entity, index) => {
    console.log(`${index + 1}. ${entity.entityName}`);
    console.log(`   ID: ${entity.entityId}`);
    console.log(`   Source: ${entity.sourceUrl}`);
    
    if (entity.firstAppearance) {
      console.log(`   Birth: ${entity.firstAppearance.comicTitle}`);
    }
    
    if (entity.attributes && entity.attributes.length > 0) {
      console.log(`   Attributes: ${entity.attributes.map(a => `${a.name} (${a.description})`).join(', ')}`);
    }
    
    if (entity.relationships && entity.relationships.length > 0) {
      console.log(`   Relationships: ${entity.relationships.map(r => `${r.relationshipType}: ${r.targetEntityName}`).join(', ')}`);
    }
    
    console.log('');
  });
  
  // Test 2: Search for characters/teams
  console.log('======================================');
  console.log('Test 2: Scraping 5 characters/teams');
  console.log('======================================\n');
  
  const characters = await scraper.scrapeEntities({ 
    entityType: 'character', 
    limit: 5 
  });
  
  console.log(`Retrieved ${characters.length} characters from GCD`);
  console.log(`✅ Retrieved ${characters.length} characters from GCD\n`);
  
  characters.forEach((entity, index) => {
    console.log(`${index + 1}. ${entity.entityName}`);
    console.log(`   ID: ${entity.entityId}`);
    console.log(`   Type: ${entity.entityType}`);
    console.log(`   Source: ${entity.sourceUrl}`);
    
    if (entity.attributes && entity.attributes.length > 0) {
      console.log(`   Notes: ${entity.attributes[0].description}`);
    }
    
    console.log('');
  });
  
  // Test 3: Scrape single entity by ID
  if (creators.length > 0) {
    console.log('======================================');
    console.log('Test 3: Scraping single creator by ID');
    console.log('======================================\n');
    
    const creatorId = creators[0].entityId;
    console.log(`Fetching creator: ${creatorId}`);
    
    const singleCreator = await scraper.scrapeEntity(creatorId);
    
    if (singleCreator) {
      console.log(`✅ Successfully fetched: ${singleCreator.entityName}`);
      console.log(`   Attributes: ${singleCreator.attributes?.length || 0}`);
      console.log(`   Relationships: ${singleCreator.relationships?.length || 0}`);
    } else {
      console.log('❌ Failed to fetch creator');
    }
    
    console.log('');
  }
  
  // Test 4: Check if entity data exists
  console.log('======================================');
  console.log('Test 4: Checking entity data existence');
  console.log('======================================\n');
  
  const hasStanLee = await scraper.hasEntityData('Stan Lee', 'creator');
  const hasSpiderMan = await scraper.hasEntityData('Spider-Man', 'character');
  const hasRandomEntity = await scraper.hasEntityData('ZZZ Random Entity XYZ', 'character');
  
  console.log(`Stan Lee (creator): ${hasStanLee ? '✅ Found' : '❌ Not found'}`);
  console.log(`Spider-Man (character): ${hasSpiderMan ? '✅ Found' : '❌ Not found'}`);
  console.log(`Random entity: ${hasRandomEntity ? '✅ Found' : '❌ Not found'}`);
  
  console.log('\n📊 GCD Scraper Test Complete!');
}

testGCDScraper().catch(console.error);
