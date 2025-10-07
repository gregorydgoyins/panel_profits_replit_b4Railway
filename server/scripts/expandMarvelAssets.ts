import { marvelExpansionService } from '../services/marvelExpansionService';

async function main() {
  console.log('🚀 Starting Marvel asset expansion...\n');

  try {
    // Expand characters (1000 at a time)
    console.log('📚 Expanding Marvel characters...');
    const characterResult = await marvelExpansionService.expandCharacters(0, 1000);
    console.log(`✅ Characters: ${characterResult.inserted} inserted, ${characterResult.skipped} skipped\n`);

    // Expand comics (1000 at a time)
    console.log('📖 Expanding Marvel comics...');
    const comicResult = await marvelExpansionService.expandComics(0, 1000);
    console.log(`✅ Comics: ${comicResult.inserted} inserted, ${comicResult.skipped} skipped\n`);

    // Expand creators (500 at a time - fewer creators available)
    console.log('✍️  Expanding Marvel creators...');
    const creatorResult = await marvelExpansionService.expandCreators(0, 500);
    console.log(`✅ Creators: ${creatorResult.inserted} inserted, ${creatorResult.skipped} skipped\n`);

    console.log('🎉 Marvel expansion complete!');
    console.log(`   Total inserted: ${characterResult.inserted + comicResult.inserted + creatorResult.inserted}`);
    console.log(`   Total skipped: ${characterResult.skipped + comicResult.skipped + creatorResult.skipped}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Expansion failed:', error);
    process.exit(1);
  }
}

main();
