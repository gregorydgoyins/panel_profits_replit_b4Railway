// Quick test script for Symbol Registry API
const testCases = [
  {
    name: 'Comic (Amazing Spider-Man #300)',
    type: 'comic',
    params: { title: 'Amazing Spider-Man', volume: 1, issue: 300, era: 'silver' }
  },
  {
    name: 'Option (Spider-Man Call)',
    type: 'option',
    params: { underlying: 'Spider-Man', expiry: '2025-01-17', type: 'call', strike: 50 }
  },
  {
    name: 'Bond (Oscorp 5.5% 2025)',
    type: 'bond',
    params: { issuer: 'Oscorp Industries', couponRate: 5.5, maturityYear: 2025 }
  },
  {
    name: 'Location (Gotham City)',
    type: 'location',
    params: { name: 'Gotham City', country: 'United States', city: 'New York' }
  },
  {
    name: 'NFT (Bored Ape #5000)',
    type: 'nft',
    params: { collection: 'Bored Ape Yacht Club', tier: 1, tokenId: 5000 }
  },
  {
    name: 'Fund (Avengers Fund)',
    type: 'fund',
    params: { name: 'Avengers Global Fund', fundType: 'mutual' }
  }
];

async function testSymbols() {
  console.log('🧪 Testing Symbol Registry API\n');
  console.log('='.repeat(70));
  
  for (const testCase of testCases) {
    const response = await fetch('http://localhost:5000/api/symbols/test-registry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: testCase.type, params: testCase.params })
    });
    
    const result = await response.json();
    
    console.log(`\n📌 ${testCase.name}`);
    console.log(`   Input: ${testCase.type} - ${JSON.stringify(testCase.params)}`);
    console.log(`   Symbol: ${result.generatedSymbol || result.error}`);
    console.log(`   Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  }
  
  console.log('\n' + '='.repeat(70));
  
  // Test migration status
  const statusResponse = await fetch('http://localhost:5000/api/symbols/migration-status');
  const status = await statusResponse.json();
  console.log('\n📊 Migration Status:');
  console.log(`   ${status.status}`);
  console.log(`   Frozen Old Generation: ${status.frozenOldGeneration}`);
  console.log(`   New Registry Enabled: ${status.newRegistryEnabled}`);
}

testSymbols().catch(console.error);
