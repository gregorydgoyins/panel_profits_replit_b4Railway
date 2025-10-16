"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unifiedPricingEngine_1 = require("../services/unifiedPricingEngine");
const tierClassificationService_1 = require("../services/tierClassificationService");
console.log('🧪 TESTING UNIFIED PRICING ENGINE\n');
console.log('='.repeat(80));
// Test Character Pricing
console.log('\n📊 CHARACTER PRICING TESTS\n');
const characterTests = [
    {
        name: 'Action Comics #1 Superman',
        metadata: { name: 'Superman', appearances: 5000, publisher: 'DC' }
    },
    {
        name: 'All-Star Superman #1',
        metadata: { name: 'Superman (All-Star)', appearances: 12, isVariant: true, variantOf: 'Superman' }
    },
    {
        name: 'Amazing Spider-Man Peter Parker',
        metadata: { name: 'Spider-Man', appearances: 4500, publisher: 'Marvel' }
    },
    {
        name: 'Miles Morales Spider-Man',
        metadata: { name: 'Miles Morales', appearances: 80, isVariant: false, publisher: 'Marvel' }
    },
    {
        name: 'Robin (Dick Grayson)',
        metadata: { name: 'Robin', appearances: 300, publisher: 'DC' }
    },
    {
        name: 'Random Thug #47',
        metadata: { name: 'Random Thug', appearances: 2, publisher: 'Marvel' }
    }
];
for (const test of characterTests) {
    const classification = tierClassificationService_1.tierClassificationService.classifyCharacter(test.metadata);
    const pricing = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
        assetType: 'character',
        name: test.name,
        era: 'golden', // Assuming golden age for testing
        franchiseTier: classification.tier,
        keyAppearances: test.metadata.appearances,
        isVariant: classification.isVariant
    });
    console.log(`\n${test.name}`);
    console.log(`  Tier: ${classification.tier} (${unifiedPricingEngine_1.unifiedPricingEngine.getFranchiseTierInfo(classification.tier)})`);
    console.log(`  Appearances: ${test.metadata.appearances}`);
    console.log(`  Is Variant: ${classification.isVariant}`);
    console.log(`  Share Price: $${pricing.sharePrice.toLocaleString()}`);
    console.log(`  Total Market Value: $${pricing.totalMarketValue.toLocaleString()}`);
    console.log(`  Breakdown:`);
    console.log(`    Base: $${pricing.breakdown.baseMarketValue.toLocaleString()}`);
    console.log(`    Tier Multiplier: ${pricing.breakdown.tierMultiplier}`);
    console.log(`    Appearance Modifier: ${pricing.breakdown.appearanceModifier.toFixed(3)}`);
    console.log(`    Franchise Weight: ${pricing.breakdown.franchiseWeight}`);
}
// Test Creator Pricing
console.log('\n\n📊 CREATOR PRICING TESTS\n');
const creatorTests = [
    {
        name: 'Stan Lee',
        metadata: { name: 'Stan Lee', appearances: 5000, roles: ['writer', 'editorial'] }
    },
    {
        name: 'Alex Ross',
        metadata: { name: 'Alex Ross', appearances: 150, roles: ['artist', 'cover'] }
    },
    {
        name: 'Adam Hughes',
        metadata: { name: 'Adam Hughes', appearances: 120, roles: ['cover', 'artist'] }
    },
    {
        name: 'Sam Delluca',
        metadata: { name: 'Sam Delluca', appearances: 8, roles: ['artist'] }
    }
];
for (const test of creatorTests) {
    const classification = tierClassificationService_1.tierClassificationService.classifyCreator(test.metadata);
    const pricing = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
        assetType: 'creator',
        name: test.name,
        era: 'golden',
        creatorTier: classification.tier,
        roleWeightedAppearances: classification.roleWeightedAppearances
    });
    console.log(`\n${test.name}`);
    console.log(`  Tier: ${classification.tier} (${unifiedPricingEngine_1.unifiedPricingEngine.getCreatorTierInfo(classification.tier)})`);
    console.log(`  Role-Weighted Appearances: ${classification.roleWeightedAppearances.toFixed(0)}`);
    console.log(`  Share Price: $${pricing.sharePrice.toLocaleString()}`);
    console.log(`  Total Market Value: $${pricing.totalMarketValue.toLocaleString()}`);
}
// Test Era Differences
console.log('\n\n📊 ERA COMPARISON TESTS\n');
const erasToTest = ['golden', 'silver', 'bronze', 'modern'];
console.log('\nSpider-Man (Tier 1, 450 appearances) across eras:');
for (const era of erasToTest) {
    const pricing = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
        assetType: 'character',
        name: 'Spider-Man',
        era,
        franchiseTier: 1,
        keyAppearances: 450
    });
    console.log(`  ${era.padEnd(10)}: $${pricing.sharePrice.toLocaleString()}`);
}
// Test Hierarchy Validation
console.log('\n\n✅ HIERARCHY VALIDATION\n');
// Test with REAL classification (not hard-coded tiers)
const supermanClass = tierClassificationService_1.tierClassificationService.classifyCharacter({
    name: 'Superman',
    appearances: 500
});
const supermanOriginal = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
    assetType: 'character',
    name: 'Superman',
    era: 'golden',
    franchiseTier: supermanClass.tier,
    keyAppearances: 500,
    isVariant: supermanClass.isVariant
});
const allStarClass = tierClassificationService_1.tierClassificationService.classifyCharacter({
    name: 'Superman (All-Star)',
    appearances: 12,
    isVariant: true
});
const supermanAllStar = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
    assetType: 'character',
    name: 'Superman (All-Star)',
    era: 'modern',
    franchiseTier: allStarClass.tier,
    keyAppearances: 12,
    isVariant: allStarClass.isVariant
});
const peterClass = tierClassificationService_1.tierClassificationService.classifyCharacter({
    name: 'Spider-Man',
    appearances: 450
});
const peterParker = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
    assetType: 'character',
    name: 'Spider-Man (Peter Parker)',
    era: 'silver',
    franchiseTier: peterClass.tier,
    keyAppearances: 450,
    isVariant: peterClass.isVariant
});
const milesClass = tierClassificationService_1.tierClassificationService.classifyCharacter({
    name: 'Miles Morales',
    appearances: 80
});
const milesMorales = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
    assetType: 'character',
    name: 'Miles Morales',
    era: 'modern',
    franchiseTier: milesClass.tier,
    keyAppearances: 80,
    isVariant: milesClass.isVariant
});
const stanClass = tierClassificationService_1.tierClassificationService.classifyCreator({
    name: 'Stan Lee',
    appearances: 5000,
    roles: ['writer', 'editorial']
});
const stanLee = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
    assetType: 'creator',
    name: 'Stan Lee',
    era: 'golden',
    creatorTier: stanClass.tier,
    roleWeightedAppearances: stanClass.roleWeightedAppearances
});
const alexClass = tierClassificationService_1.tierClassificationService.classifyCreator({
    name: 'Alex Ross',
    appearances: 150,
    roles: ['artist', 'cover']
});
const alexRoss = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
    assetType: 'creator',
    name: 'Alex Ross',
    era: 'modern',
    creatorTier: alexClass.tier,
    roleWeightedAppearances: alexClass.roleWeightedAppearances
});
console.log(`\nClassification Results:`);
console.log(`  Superman: Tier ${supermanClass.tier}, Variant: ${supermanClass.isVariant}`);
console.log(`  All-Star Superman: Tier ${allStarClass.tier}, Variant: ${allStarClass.isVariant}`);
console.log(`  Spider-Man: Tier ${peterClass.tier}, Variant: ${peterClass.isVariant}`);
console.log(`  Miles Morales: Tier ${milesClass.tier}, Variant: ${milesClass.isVariant}`);
console.log(`  Stan Lee: Tier ${stanClass.tier}`);
console.log(`  Alex Ross: Tier ${alexClass.tier}`);
console.log('Action Comics #1 Superman > All-Star Superman:');
console.log(`  $${supermanOriginal.sharePrice} > $${supermanAllStar.sharePrice} = ${supermanOriginal.sharePrice > supermanAllStar.sharePrice ? '✅' : '❌'}`);
console.log('\nASM Peter Parker > Miles Morales:');
console.log(`  $${peterParker.sharePrice} > $${milesMorales.sharePrice} = ${peterParker.sharePrice > milesMorales.sharePrice ? '✅' : '❌'}`);
console.log('\nStan Lee > Alex Ross:');
console.log(`  $${stanLee.sharePrice} > $${alexRoss.sharePrice} = ${stanLee.sharePrice > alexRoss.sharePrice ? '✅' : '❌'}`);
console.log('\n✅ All within $50-$6,000 range:');
const allPrices = [
    supermanOriginal.sharePrice,
    supermanAllStar.sharePrice,
    peterParker.sharePrice,
    milesMorales.sharePrice,
    stanLee.sharePrice,
    alexRoss.sharePrice
];
const allInRange = allPrices.every(p => p >= 50 && p <= 6000);
console.log(`  Min: $${Math.min(...allPrices)}, Max: $${Math.max(...allPrices)}`);
console.log(`  All in range: ${allInRange ? '✅' : '❌'}`);
console.log('\n' + '='.repeat(80));
console.log('✅ PRICING ENGINE TEST COMPLETE');
