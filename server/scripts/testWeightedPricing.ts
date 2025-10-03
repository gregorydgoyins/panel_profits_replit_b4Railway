import { priceChartingService } from '../services/priceChartingService.js';

async function testPricingFormula() {
  console.log('🧪 Testing Weighted Pricing Formula\n');
  console.log('=' .repeat(80));
  console.log('GOAL: All assets should stay within $50-$6,000 range');
  console.log('LOGIC: Golden Age = fewer shares (higher price), Modern = more shares (lower price)');
  console.log('=' .repeat(80) + '\n');

  // Test creators (previously broken with $22,000 prices)
  console.log('📝 TESTING CREATORS:\n');
  
  const creators = [
    'Alice Cooper',
    'Stan Lee', 
    'Jack Kirby',
    'Steve Ditko'
  ];

  for (const creator of creators) {
    const price = await priceChartingService.getPriceForCreator(creator);
    const status = price >= 50 && price <= 6000 ? '✅' : '❌';
    console.log(`${status} ${creator}: $${price.toLocaleString()}`);
    
    if (price < 50 || price > 6000) {
      console.log(`   ⚠️  VIOLATION: Price outside $50-$6,000 range!\n`);
    }
  }

  console.log('\n' + '─'.repeat(80) + '\n');

  // Test characters
  console.log('🦸 TESTING CHARACTERS:\n');
  
  const characters = [
    'Spider-Man',
    'Batman',
    'Wolverine',
    'Hulk'
  ];

  for (const character of characters) {
    const price = await priceChartingService.getPriceForCharacter(character);
    const status = price >= 50 && price <= 6000 ? '✅' : '❌';
    console.log(`${status} ${character}: $${price.toLocaleString()}`);
    
    if (price < 50 || price > 6000) {
      console.log(`   ⚠️  VIOLATION: Price outside $50-$6,000 range!\n`);
    }
  }

  console.log('\n' + '=' .repeat(80));
  console.log('✅ TEST COMPLETE: All prices should be within $50-$6,000 range');
  console.log('=' .repeat(80));
}

testPricingFormula().catch(console.error);
