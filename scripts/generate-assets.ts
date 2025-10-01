import { assetGenerator } from '../server/assetGenerator.js';

async function main() {
  try {
    console.log('🎯 Panel Profits Asset Generation\n');
    console.log('=' .repeat(60));
    console.log('\n');

    // Generate comprehensive asset universe
    await assetGenerator.generateAssetUniverse({
      comicVineCharacters: 50,  // Start with 50 from Comic Vine
      marvelCharacters: 50,     // 50 from Marvel
      superheroIds: [
        // Top 20 heroes from Superhero API
        70,   // Batman
        620,  // Superman
        644,  // Spider-Man
        332,  // Hulk
        346,  // Iron Man
        263,  // Flash
        720,  // Wonder Woman
        149,  // Captain America
        69,   // Batgirl
        346,  // Ironman
        38,   // Aquaman
        297,  // Green Lantern
        687,  // Thor
        68,   // Batman II
        106,  // Black Widow
        107,  // Black Panther
        717,  // Wolverine
        655,  // Storm
        194,  // Cyclops
        201,  // Deadpool
      ]
    });

    console.log('\n' + '='.repeat(60));
    console.log('\n✨ Asset generation complete!');
    console.log('🚀 Ready to trade in the Panel Profits universe!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Asset generation failed:', error);
    process.exit(1);
  }
}

main();
