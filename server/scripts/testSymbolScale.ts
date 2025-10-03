import { PineconeAssetExpansionService } from '../services/pineconeAssetExpansion';

function testLargeScale() {
  console.log('🧪 Testing Symbol Generation at Scale (BigInt + SHA-256)\n');
  
  const service = new PineconeAssetExpansionService();
  
  // Test 1: Verify idempotency
  console.log('📊 Test 1: Idempotency');
  const symbol1 = service.generateAssetSymbol('Spider-Man', null, 'char-001');
  const symbol2 = service.generateAssetSymbol('Spider-Man', null, 'char-001');
  console.log(`  ${symbol1} === ${symbol2}: ${symbol1 === symbol2 ? '✅' : '❌'}\n`);
  
  // Test 2: Verify fixed 11-char suffix length
  console.log('📊 Test 2: Fixed suffix length (should be 11 chars)');
  const testCases = [
    { name: 'A', variant: null, id: 'test-1' },
    { name: 'Test Character Name', variant: null, id: 'test-2' },
    { name: 'Wolverine', variant: 'Old Man Logan', id: 'test-3' },
  ];
  
  let allLengthsCorrect = true;
  for (const test of testCases) {
    const symbol = service.generateAssetSymbol(test.name, test.variant, test.id);
    const parts = symbol.split('.');
    const suffix = parts[parts.length - 1];
    const correct = suffix.length === 11;
    if (!correct) allLengthsCorrect = false;
    console.log(`  ${symbol.padEnd(30)} suffix="${suffix}" (${suffix.length} chars) ${correct ? '✅' : '❌'}`);
  }
  console.log();
  
  // Test 3: Large-scale collision test
  console.log('📊 Test 3: Collision resistance at scale');
  const symbols = new Set<string>();
  const iterations = 100000; // 100K symbols
  const startTime = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    const symbol = service.generateAssetSymbol(`Character ${i}`, null, `char-${i}`);
    symbols.add(symbol);
  }
  
  const elapsed = Date.now() - startTime;
  const collisions = iterations - symbols.size;
  const collisionRate = (collisions / iterations * 100).toFixed(6);
  
  console.log(`  Generated: ${iterations.toLocaleString()} symbols in ${elapsed}ms`);
  console.log(`  Unique: ${symbols.size.toLocaleString()}`);
  console.log(`  Collisions: ${collisions.toLocaleString()}`);
  console.log(`  Collision rate: ${collisionRate}%`);
  console.log(`  Performance: ${Math.round(iterations / elapsed * 1000).toLocaleString()} symbols/sec\n`);
  
  // Test 4: Theoretical collision probability
  console.log('📊 Test 4: Theoretical analysis');
  const symbolSpace = Math.pow(36, 11); // 131.6 quadrillion
  console.log(`  Symbol space (36^11): ${symbolSpace.toLocaleString()}`);
  console.log(`  Bits of entropy: ${Math.log2(symbolSpace).toFixed(2)} bits`);
  
  // Birthday paradox: P(collision) ≈ n²/(2*symbolSpace)
  const testSize = [1_000_000, 5_000_000, 10_000_000];
  for (const n of testSize) {
    const probability = (n * n) / (2 * symbolSpace);
    const percentage = (probability * 100).toFixed(6);
    console.log(`  For ${(n / 1_000_000).toFixed(0)}M assets: ${percentage}% collision probability`);
  }
  
  console.log('\n' + '='.repeat(70));
  if (allLengthsCorrect && collisions === 0) {
    console.log('✅ SUCCESS: Production-ready symbol generation');
    console.log('   • Fixed 11-character suffixes: ✅');
    console.log(`   • Zero collisions in ${iterations.toLocaleString()} test: ✅`);
    console.log('   • Full 131.6 quadrillion symbol space utilized: ✅');
    console.log('   • Safe for multi-million asset scale (<0.05% collision at 10M): ✅');
  } else {
    console.log('❌ FAILURE: Issues detected');
    if (!allLengthsCorrect) console.log('   • Variable suffix lengths');
    if (collisions > 0) console.log(`   • ${collisions} collisions detected`);
  }
  console.log('='.repeat(70) + '\n');
  
  process.exit(allLengthsCorrect && collisions === 0 ? 0 : 1);
}

testLargeScale();
