import { AniListScraper } from './services/entityScrapers/AniListScraper';

async function testAniListScraper() {
  console.log('🚀 Testing AniList GraphQL Scraper\n');
  
  const scraper = new AniListScraper();
  
  // Test 1: Scrape characters
  console.log('======================================');
  console.log('Test 1: Scraping 10 characters');
  console.log('======================================\n');
  
  const characters = await scraper.scrapeEntities({ 
    entityType: 'character', 
    limit: 10 
  });
  
  console.log(`Retrieved ${characters.length} characters from AniList`);
  console.log(`✅ Retrieved ${characters.length} characters from AniList\n`);
  
  characters.forEach((entity, index) => {
    console.log(`${index + 1}. ${entity.entityName}`);
    console.log(`   ID: ${entity.entityId}`);
    console.log(`   Type: ${entity.entityType}`);
    console.log(`   Publisher: ${entity.publisher || 'N/A'}`);
    console.log(`   Source: ${entity.sourceUrl}`);
    
    if (entity.firstAppearance) {
      console.log(`   First Appearance: ${entity.firstAppearance.comicTitle} (${entity.firstAppearance.year || 'N/A'})`);
    }
    
    if (entity.attributes && entity.attributes.length > 0) {
      const bio = entity.attributes.find(a => a.name === 'Character Bio');
      if (bio && bio.description) {
        const shortBio = bio.description.length > 100 
          ? bio.description.substring(0, 100) + '...' 
          : bio.description;
        console.log(`   Bio: ${shortBio}`);
      }
      
      const gender = entity.attributes.find(a => a.name === 'Gender');
      if (gender) {
        console.log(`   Gender: ${gender.description}`);
      }
    }
    
    console.log('');
  });
  
  // Test 2: Scrape staff/creators
  console.log('======================================');
  console.log('Test 2: Scraping 10 creators/staff');
  console.log('======================================\n');
  
  const creators = await scraper.scrapeEntities({ 
    entityType: 'creator', 
    limit: 10 
  });
  
  console.log(`Retrieved ${creators.length} creators from AniList`);
  console.log(`✅ Retrieved ${creators.length} creators from AniList\n`);
  
  creators.forEach((entity, index) => {
    console.log(`${index + 1}. ${entity.entityName}`);
    console.log(`   ID: ${entity.entityId}`);
    console.log(`   Type: ${entity.entityType}`);
    console.log(`   Source: ${entity.sourceUrl}`);
    
    if (entity.firstAppearance) {
      console.log(`   First Work: ${entity.firstAppearance.comicTitle}`);
    }
    
    if (entity.attributes && entity.attributes.length > 0) {
      const bio = entity.attributes.find(a => a.name === 'Creator Bio');
      if (bio && bio.description) {
        const shortBio = bio.description.length > 80 
          ? bio.description.substring(0, 80) + '...' 
          : bio.description;
        console.log(`   Bio: ${shortBio}`);
      }
    }
    
    console.log('');
  });
  
  // Test 3: Scrape single entity by ID (Character)
  if (characters.length > 0) {
    console.log('======================================');
    console.log('Test 3A: Scraping single character by ID');
    console.log('======================================\n');
    
    // Extract ID from entityId (format: anilist_char_123)
    const charId = characters[0].sourceEntityId;
    console.log(`Fetching character with source ID: ${charId}`);
    
    const singleChar = await scraper.scrapeEntity(charId);
    
    if (singleChar) {
      console.log(`✅ Successfully fetched: ${singleChar.entityName}`);
      console.log(`   Type: ${singleChar.entityType}`);
      console.log(`   Attributes: ${singleChar.attributes?.length || 0}`);
      console.log(`   First Appearance: ${singleChar.firstAppearance?.comicTitle || 'N/A'}`);
    } else {
      console.log('❌ Failed to fetch character');
    }
    
    console.log('');
  }

  // Test 3B: Scrape single creator by ID (Staff)
  if (creators.length > 0) {
    console.log('======================================');
    console.log('Test 3B: Scraping single creator by ID');
    console.log('======================================\n');
    
    const creatorId = creators[0].sourceEntityId;
    console.log(`Fetching creator with source ID: ${creatorId}`);
    
    const singleCreator = await scraper.scrapeEntity(creatorId);
    
    if (singleCreator) {
      console.log(`✅ Successfully fetched: ${singleCreator.entityName}`);
      console.log(`   Type: ${singleCreator.entityType}`);
      console.log(`   Attributes: ${singleCreator.attributes?.length || 0}`);
      console.log(`   First Work: ${singleCreator.firstAppearance?.comicTitle || 'N/A'}`);
    } else {
      console.log('❌ Failed to fetch creator');
    }
    
    console.log('');
  }
  
  // Test 4: Check if entity data exists
  console.log('======================================');
  console.log('Test 4: Checking entity data existence');
  console.log('======================================\n');
  
  const hasNaruto = await scraper.hasEntityData('Naruto Uzumaki', 'character');
  const hasGoku = await scraper.hasEntityData('Son Goku', 'character');
  const hasRandomEntity = await scraper.hasEntityData('ZZZ Random Entity XYZ', 'character');
  
  console.log(`Naruto Uzumaki (character): ${hasNaruto ? '✅ Found' : '❌ Not found'}`);
  console.log(`Son Goku (character): ${hasGoku ? '✅ Found' : '❌ Not found'}`);
  console.log(`Random entity: ${hasRandomEntity ? '✅ Found' : '❌ Not found'}`);
  
  console.log('\n📊 AniList Scraper Test Complete!');
}

testAniListScraper().catch(console.error);
