/**
 * Test Pinecone Expansion Pipeline with Mathematical Pricing
 * Verifies the updated expansion service works correctly before full scale run
 */

import { pineconeAssetExpansion } from '../services/pineconeAssetExpansion';

async function testExpansionPipeline() {
  console.log('🧪 TESTING PINECONE EXPANSION PIPELINE');
  console.log('================================================================================\n');

  try {
    // Test with small sample (10 per category)
    console.log('📊 Running expansion with 10 samples per category...\n');
    
    const result = await pineconeAssetExpansion.expandAssetDatabase(10);

    if (!result.success) {
      console.error('❌ Expansion failed:', result.error);
      process.exit(1);
    }

    console.log('\n📈 EXPANSION RESULTS');
    console.log('================================================================================');
    console.log(`Total Assets Generated: ${result.totalAssets}`);
    console.log(`Characters: ${result.assets.characterAssets.length}`);
    console.log(`Creators: ${result.assets.creatorAssets.length}`);
    console.log(`Comics: ${result.assets.comicAssets.length}`);

    // Analyze pricing
    const allAssets = [
      ...result.assets.characterAssets,
      ...result.assets.creatorAssets,
      ...result.assets.comicAssets
    ];

    const prices = allAssets.map(a => a.pricing?.currentPrice || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;

    console.log('\n💵 PRICING ANALYSIS');
    console.log('================================================================================');
    console.log(`Price Range: $${minPrice} - $${maxPrice}`);
    console.log(`Average Price: $${avgPrice.toFixed(2)}`);
    console.log(`Within $50-$6,000: ${prices.every(p => p >= 50 && p <= 6000) ? '✅ YES' : '❌ NO'}`);

    // Show sample assets from each type
    console.log('\n📋 SAMPLE ASSETS');
    console.log('================================================================================');

    if (result.assets.characterAssets.length > 0) {
      const char = result.assets.characterAssets[0];
      console.log('\n👤 CHARACTER SAMPLE:');
      console.log(`  Name: ${char.name}`);
      console.log(`  Symbol: ${char.symbol}`);
      console.log(`  Tier: ${char.tier}`);
      console.log(`  Price: $${char.pricing?.currentPrice}`);
      console.log(`  Market Value: $${char.pricing?.totalMarketValue?.toLocaleString()}`);
      console.log(`  Source: ${char.pricing?.source}`);
    }

    if (result.assets.creatorAssets.length > 0) {
      const creator = result.assets.creatorAssets[0];
      console.log('\n🎨 CREATOR SAMPLE:');
      console.log(`  Name: ${creator.name}`);
      console.log(`  Symbol: ${creator.symbol}`);
      console.log(`  Tier: ${creator.tier}`);
      console.log(`  Price: $${creator.pricing?.currentPrice}`);
      console.log(`  Market Value: $${creator.pricing?.totalMarketValue?.toLocaleString()}`);
      console.log(`  Source: ${creator.pricing?.source}`);
    }

    if (result.assets.comicAssets.length > 0) {
      const comic = result.assets.comicAssets[0];
      console.log('\n📚 COMIC SAMPLE:');
      console.log(`  Name: ${comic.name}`);
      console.log(`  Symbol: ${comic.symbol}`);
      console.log(`  Price: $${comic.pricing?.currentPrice}`);
      console.log(`  Market Value: $${comic.pricing?.totalMarketValue?.toLocaleString()}`);
      console.log(`  Source: ${comic.pricing?.source}`);
    }

    // Check for known characters
    const spiderMan = result.assets.characterAssets.find(a => 
      a.name.toLowerCase().includes('spider-man') || a.name.toLowerCase().includes('spiderman')
    );
    const milesSpider = result.assets.characterAssets.find(a => 
      a.name.toLowerCase().includes('miles morales')
    );
    const stanLee = result.assets.creatorAssets.find(a => 
      a.name.toLowerCase().includes('stan lee')
    );

    if (spiderMan || milesSpider || stanLee) {
      console.log('\n✅ HIERARCHY VALIDATION');
      console.log('================================================================================');
      
      if (spiderMan) {
        console.log(`Spider-Man: Tier ${spiderMan.tier}, $${spiderMan.pricing?.currentPrice}`);
      }
      if (milesSpider) {
        console.log(`Miles Morales: Tier ${milesSpider.tier}, $${milesSpider.pricing?.currentPrice}`);
      }
      if (stanLee) {
        console.log(`Stan Lee: Tier ${stanLee.tier}, $${stanLee.pricing?.currentPrice}`);
      }

      if (spiderMan && milesSpider) {
        const hierarchyOk = (spiderMan.pricing?.currentPrice || 0) > (milesSpider.pricing?.currentPrice || 0);
        console.log(`\nSpider-Man > Miles Morales: ${hierarchyOk ? '✅' : '❌'}`);
      }
    }

    console.log('\n================================================================================');
    console.log('✅ EXPANSION PIPELINE TEST COMPLETE');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testExpansionPipeline();
