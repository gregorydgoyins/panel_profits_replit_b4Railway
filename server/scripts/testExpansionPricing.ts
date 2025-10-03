/**
 * Test Expansion Service Pricing Logic
 * Tests mathematical pricing without Pinecone queries
 */

import { pineconeAssetExpansion } from '../services/pineconeAssetExpansion';

async function testExpansionPricing() {
  console.log('🧪 TESTING EXPANSION SERVICE PRICING');
  console.log('================================================================================\n');

  try {
    // Create mock asset records to test pricing
    const mockAssets = [
      // Characters
      {
        type: 'character',
        name: 'Spider-Man',
        baseName: 'Spider-Man',
        variant: null,
        symbol: 'SM.TEST001',
        metadata: {
          publisher: 'Marvel',
          description: '450 appearances in Marvel Comics'
        }
      },
      {
        type: 'character',
        name: 'Miles Morales',
        baseName: 'Miles Morales',
        variant: null,
        symbol: 'MM.TEST002',
        metadata: {
          publisher: 'Marvel',
          description: '150 appearances in Marvel Comics'
        }
      },
      {
        type: 'character',
        name: 'Superman',
        baseName: 'Superman',
        variant: null,
        symbol: 'SUP.TEST003',
        metadata: {
          publisher: 'DC',
          description: '500 appearances in DC Comics'
        }
      },
      {
        type: 'character',
        name: 'All-Star Superman',
        baseName: 'Superman',
        variant: 'All-Star',
        symbol: 'SUP.AS.TEST004',
        metadata: {
          publisher: 'DC',
          description: '12 appearances in DC Comics'
        }
      },
      // Creators
      {
        type: 'creator',
        name: 'Stan Lee',
        symbol: 'SL.TEST005',
        metadata: {
          description: '3000 appearances as writer and editor'
        }
      },
      {
        type: 'creator',
        name: 'Alex Ross',
        symbol: 'AR.TEST006',
        metadata: {
          description: '113 appearances as artist'
        }
      },
      // Comics
      {
        type: 'comic',
        name: 'Amazing Fantasy #15',
        symbol: 'AF15.TEST007',
        metadata: {
          publisher: 'Marvel',
          description: 'First appearance of Spider-Man, 1962'
        }
      }
    ];

    console.log('💰 Testing pricing for mock assets...\n');

    // Price each asset
    const pricedAssets = [];
    for (const asset of mockAssets) {
      console.log(`Pricing: ${asset.name} (${asset.type})`);
      const priced = await (pineconeAssetExpansion as any).enrichAssetWithPricing(asset);
      pricedAssets.push(priced);
      console.log(`  → Tier ${priced.tier || 'N/A'}, $${priced.pricing?.currentPrice}`);
    }

    console.log('\n================================================================================');
    console.log('📊 PRICING RESULTS');
    console.log('================================================================================\n');

    // Analyze pricing
    const prices = pricedAssets.map(a => a.pricing?.currentPrice || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;

    console.log('💵 PRICE RANGE:');
    console.log(`  Min: $${minPrice}`);
    console.log(`  Max: $${maxPrice}`);
    console.log(`  Avg: $${avgPrice.toFixed(2)}`);
    console.log(`  Within $50-$6,000: ${prices.every(p => p >= 50 && p <= 6000) ? '✅ YES' : '❌ NO'}`);

    // Test hierarchies
    const spiderMan = pricedAssets.find(a => a.name === 'Spider-Man');
    const milesSpider = pricedAssets.find(a => a.name === 'Miles Morales');
    const superman = pricedAssets.find(a => a.name === 'Superman');
    const allStarSuperman = pricedAssets.find(a => a.name === 'All-Star Superman');
    const stanLee = pricedAssets.find(a => a.name === 'Stan Lee');
    const alexRoss = pricedAssets.find(a => a.name === 'Alex Ross');

    console.log('\n✅ HIERARCHY VALIDATION:');
    console.log('================================================================================');

    if (spiderMan && milesSpider) {
      const correct = (spiderMan.pricing?.currentPrice || 0) > (milesSpider.pricing?.currentPrice || 0);
      console.log(`\nSpider-Man > Miles Morales:`);
      console.log(`  $${spiderMan.pricing?.currentPrice} > $${milesSpider.pricing?.currentPrice} = ${correct ? '✅' : '❌'}`);
    }

    if (superman && allStarSuperman) {
      const correct = (superman.pricing?.currentPrice || 0) > (allStarSuperman.pricing?.currentPrice || 0);
      console.log(`\nSuperman > All-Star Superman:`);
      console.log(`  $${superman.pricing?.currentPrice} > $${allStarSuperman.pricing?.currentPrice} = ${correct ? '✅' : '❌'}`);
    }

    if (stanLee && alexRoss) {
      const correct = (stanLee.pricing?.currentPrice || 0) > (alexRoss.pricing?.currentPrice || 0);
      console.log(`\nStan Lee > Alex Ross:`);
      console.log(`  $${stanLee.pricing?.currentPrice} > $${alexRoss.pricing?.currentPrice} = ${correct ? '✅' : '❌'}`);
    }

    // Show detailed breakdown for one asset
    if (spiderMan) {
      console.log('\n📋 DETAILED BREAKDOWN (Spider-Man):');
      console.log('================================================================================');
      console.log(`  Tier: ${spiderMan.tier}`);
      console.log(`  Share Price: $${spiderMan.pricing?.currentPrice}`);
      console.log(`  Total Market Value: $${spiderMan.pricing?.totalMarketValue?.toLocaleString()}`);
      console.log(`  Total Float: ${spiderMan.pricing?.totalFloat?.toLocaleString()} shares`);
      console.log(`  Source: ${spiderMan.pricing?.source}`);
      if (spiderMan.pricing?.breakdown) {
        console.log(`  Base Market Value: $${spiderMan.pricing.breakdown.baseMarketValue?.toLocaleString()}`);
        console.log(`  Tier Multiplier: ${spiderMan.pricing.breakdown.tierMultiplier}`);
        console.log(`  Appearance Modifier: ${spiderMan.pricing.breakdown.appearanceModifier?.toFixed(3)}`);
        console.log(`  Franchise Weight: ${spiderMan.pricing.breakdown.franchiseWeight?.toFixed(3)}`);
      }
    }

    console.log('\n================================================================================');
    console.log('✅ EXPANSION PRICING TEST COMPLETE');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error(error);
    process.exit(1);
  }
}

testExpansionPricing();
