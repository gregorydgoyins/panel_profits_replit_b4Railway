"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pineconeAssetExpansion_1 = require("../services/pineconeAssetExpansion");
function testSymbolGeneration() {
    console.log('🧪 Testing Deterministic Symbol Generation (SHA-256)\n');
    const service = new pineconeAssetExpansion_1.PineconeAssetExpansionService();
    const testCases = [
        { name: 'Spider-Man', variant: null, pineconeId: 'char-001' },
        { name: 'Captain America', variant: 'House of M', pineconeId: 'char-002' },
        { name: 'Stan Lee', variant: null, pineconeId: 'creator-001' },
        { name: 'Rob Leigh', variant: null, pineconeId: 'creator-002' },
        { name: 'Wolverine', variant: 'Old Man Logan', pineconeId: 'char-003' },
    ];
    console.log('📊 Testing idempotency (same inputs = same outputs):\n');
    let allMatch = true;
    for (const testCase of testCases) {
        const symbol1 = service.generateAssetSymbol(testCase.name, testCase.variant, testCase.pineconeId);
        const symbol2 = service.generateAssetSymbol(testCase.name, testCase.variant, testCase.pineconeId);
        const symbol3 = service.generateAssetSymbol(testCase.name, testCase.variant, testCase.pineconeId);
        const displayName = testCase.variant
            ? `${testCase.name} (${testCase.variant})`
            : testCase.name;
        if (symbol1 === symbol2 && symbol2 === symbol3) {
            console.log(`✅ ${displayName.padEnd(40)} ${symbol1} (deterministic)`);
        }
        else {
            console.log(`❌ ${displayName.padEnd(40)} ${symbol1} vs ${symbol2} vs ${symbol3} (FAIL)`);
            allMatch = false;
        }
    }
    console.log('\n📊 Testing collision resistance:\n');
    const symbols = new Set();
    const collisions = [];
    // Generate 10,000 symbols with similar names to test collision resistance
    for (let i = 0; i < 10000; i++) {
        const symbol = service.generateAssetSymbol(`Test Character ${i}`, null, `test-${i}`);
        if (symbols.has(symbol)) {
            collisions.push(symbol);
        }
        symbols.add(symbol);
    }
    console.log(`Generated: 10,000 symbols`);
    console.log(`Unique: ${symbols.size} symbols`);
    console.log(`Collisions: ${collisions.length}`);
    console.log(`Collision rate: ${(collisions.length / 10000 * 100).toFixed(4)}%`);
    if (collisions.length > 0) {
        console.log(`❌ Collision detected: ${collisions[0]}`);
    }
    console.log('\n' + '='.repeat(70));
    if (allMatch && collisions.length === 0) {
        console.log('✅ SUCCESS: Symbols are deterministic with strong collision resistance');
        console.log('   • SHA-256 hash ensures 0 collisions in 10K test');
        console.log('   • Same inputs always produce same symbols');
        console.log('   • Safe for millions of assets');
    }
    else {
        console.log('❌ FAILURE: Issues detected');
        if (!allMatch)
            console.log('   • Symbol generation not deterministic');
        if (collisions.length > 0)
            console.log(`   • ${collisions.length} collisions in 10K test`);
    }
    console.log('='.repeat(70) + '\n');
    process.exit(allMatch && collisions.length === 0 ? 0 : 1);
}
testSymbolGeneration();
