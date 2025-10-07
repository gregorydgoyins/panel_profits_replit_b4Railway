#!/usr/bin/env tsx
/**
 * Expand Marvel and Superhero API Data
 * Directly fetches from both working APIs without circuit breakers
 */

import { marvelExpansionService } from '../services/marvelExpansionService';
import { SuperheroApiExpansionService } from '../services/superheroApiExpansion';

async function main() {
  console.log('🚀 Starting API Expansion...\n');

  // 1. Superhero API Expansion (731 characters available)
  console.log('🦸 Expanding Superhero API data...');
  const superheroResults = await SuperheroApiExpansionService.expandAll();
  console.log(`✅ Superhero API Complete:`);
  console.log(`   - Processed: ${superheroResults.processed}`);
  console.log(`   - Created: ${superheroResults.created}`);
  console.log(`   - Skipped: ${superheroResults.skipped}`);
  console.log(`   - Errors: ${superheroResults.errors}\n`);

  // 2. Marvel API Expansion (characters)
  console.log('🦸‍♂️ Expanding Marvel characters (2000)...');
  try {
    const marvelChars = await marvelExpansionService.expandCharacters(0, 2000);
    console.log(`✅ Marvel Characters Complete:`);
    console.log(`   - Total Processed: ${marvelChars.totalProcessed}`);
    console.log(`   - Assets Created: ${marvelChars.assetsCreated}`);
    console.log(`   - Already Existed: ${marvelChars.alreadyExisted}`);
    console.log(`   - Errors: ${marvelChars.errors?.length || 0}\n`);
  } catch (error: any) {
    console.error(`❌ Marvel Characters Error: ${error.message}\n`);
  }

  // 3. Marvel API Expansion (comics)
  console.log('📚 Expanding Marvel comics (1000)...');
  try {
    const marvelComics = await marvelExpansionService.expandComics(0, 1000);
    console.log(`✅ Marvel Comics Complete:`);
    console.log(`   - Total Processed: ${marvelComics.totalProcessed}`);
    console.log(`   - Assets Created: ${marvelComics.assetsCreated}`);
    console.log(`   - Already Existed: ${marvelComics.alreadyExisted}`);
    console.log(`   - Errors: ${marvelComics.errors?.length || 0}\n`);
  } catch (error: any) {
    console.error(`❌ Marvel Comics Error: ${error.message}\n`);
  }

  // 4. Marvel API Expansion (creators)
  console.log('✍️ Expanding Marvel creators (500)...');
  try {
    const marvelCreators = await marvelExpansionService.expandCreators(0, 500);
    console.log(`✅ Marvel Creators Complete:`);
    console.log(`   - Total Processed: ${marvelCreators.totalProcessed}`);
    console.log(`   - Assets Created: ${marvelCreators.assetsCreated}`);
    console.log(`   - Already Existed: ${marvelCreators.alreadyExisted}`);
    console.log(`   - Errors: ${marvelCreators.errors?.length || 0}\n`);
  } catch (error: any) {
    console.error(`❌ Marvel Creators Error: ${error.message}\n`);
  }

  console.log('\n🎉 API Expansion Complete!');
  process.exit(0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
