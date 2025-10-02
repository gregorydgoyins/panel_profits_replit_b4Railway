import { weightedMarketCapService } from './services/weightedMarketCapService';

/**
 * Test script to validate weighted market cap pricing formula
 * 
 * Tests with known data points from user:
 * - X-Men #1: 5,035 universal copies, CGC 9.8 @ $456,000 (last sale $896k for 9.6)
 * - Amazing Fantasy #15: 2,680 universal copies, no 9.8s, 7x 9.6 @ $3.2M last sale
 * - Amazing Spider-Man #1: 3,693 universal copies, 5x 9.6 @ $525,000
 */
async function testWeightedPricing() {
  console.log('\n🧪 Testing Weighted Market Cap Pricing Formula\n');
  console.log('='  .repeat(70));
  
  const testComics = [
    'X-Men #1',
    'Amazing Fantasy #15',
    'Amazing Spider-Man #1'
  ];

  for (const comic of testComics) {
    console.log(`\n📖 Testing: ${comic}`);
    console.log('-'.repeat(70));
    
    const result = await weightedMarketCapService.calculateWeightedPricing(comic, 100);
    
    if (result) {
      console.log(`\n✅ Results:`);
      console.log(`   Share Price: $${result.sharePrice.toFixed(2)}`);
      console.log(`   Total Float: ${result.totalFloat.toLocaleString()} shares`);
      console.log(`   Total Market Value: $${result.totalMarketValue.toLocaleString()}`);
      console.log(`   Avg Comic Value: $${result.averageComicValue.toLocaleString()}`);
      console.log(`   Scarcity Modifier: ${result.scarcityModifier.toFixed(4)}`);
      console.log(`   Shares per Copy: ${result.sharesPerCopy}`);
      
      console.log(`\n   Census Distribution:`);
      result.censusDistribution.slice(0, 5).forEach(grade => {
        const price = grade.lastSalePrice ? `$${grade.lastSalePrice.toLocaleString()}` : 'N/A';
        console.log(`     ${grade.grade}: ${grade.count.toLocaleString()} copies @ ${price}`);
      });
      
      // Validation checks
      console.log(`\n   📊 Validation:`);
      const expectedSharePrice = result.totalMarketValue / result.totalFloat;
      console.log(`     Formula check: $${result.totalMarketValue.toLocaleString()} ÷ ${result.totalFloat.toLocaleString()} = $${expectedSharePrice.toFixed(2)}`);
      console.log(`     With scarcity: $${expectedSharePrice.toFixed(2)} × ${result.scarcityModifier.toFixed(4)} = $${result.sharePrice.toFixed(2)}`);
      
      // Check if price is in realistic range ($50-$6000/share)
      if (result.sharePrice >= 50 && result.sharePrice <= 6000) {
        console.log(`     ✅ Share price in target range ($50-$6,000)`);
      } else {
        console.log(`     ⚠️  Share price outside target range: $${result.sharePrice.toFixed(2)}`);
      }
    } else {
      console.log(`\n❌ Failed to calculate pricing for ${comic}`);
    }
    
    console.log('\n' + '='.repeat(70));
    
    // Wait between API calls
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ Test complete!\n');
}

// Run tests
testWeightedPricing().catch(console.error);
