"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weightedMarketCapService = void 0;
const priceChartingService_1 = require("./priceChartingService");
const goCollectService_1 = require("./goCollectService");
class WeightedMarketCapService {
    constructor() {
        /**
         * Standard CGC grade to PriceCharting field mapping
         */
        this.gradeMapping = [
            { grade: 'CGC 10.0', pcGrade: 'CGC 10.0' },
            { grade: 'CGC 9.9', pcGrade: 'CGC 9.8' }, // 9.9 rare, use 9.8 as proxy
            { grade: 'CGC 9.8', pcGrade: 'CGC 9.8' },
            { grade: 'CGC 9.6', pcGrade: 'CGC 9.6' },
            { grade: 'CGC 9.4', pcGrade: 'CGC 9.2' }, // 9.4 uses 9.2 as proxy
            { grade: 'CGC 9.2', pcGrade: 'CGC 9.2' },
            { grade: 'CGC 9.0', pcGrade: 'CGC 8.0' }, // 9.0 uses 8.0 as proxy
            { grade: 'CGC 8.5', pcGrade: 'CGC 8.0' },
            { grade: 'CGC 8.0', pcGrade: 'CGC 8.0' },
            { grade: 'CGC 7.5', pcGrade: 'CGC 6.0' }, // 7.5 uses 6.0 as proxy
            { grade: 'CGC 7.0', pcGrade: 'CGC 6.0' },
            { grade: 'CGC 6.5', pcGrade: 'CGC 6.0' },
            { grade: 'CGC 6.0', pcGrade: 'CGC 6.0' },
            { grade: 'CGC 5.5', pcGrade: 'CGC 4.0' }, // 5.5 uses 4.0 as proxy
            { grade: 'CGC 5.0', pcGrade: 'CGC 4.0' },
            { grade: 'CGC 4.5', pcGrade: 'CGC 4.0' },
            { grade: 'CGC 4.0', pcGrade: 'CGC 4.0' },
            { grade: 'CGC 3.5', pcGrade: 'CGC 4.0' }, // Lower grades use 4.0 with discount
            { grade: 'CGC 3.0', pcGrade: 'CGC 4.0' },
            { grade: 'CGC 2.5', pcGrade: 'CGC 4.0' },
            { grade: 'CGC 2.0', pcGrade: 'CGC 4.0' },
            { grade: 'CGC 1.5', pcGrade: 'CGC 4.0' },
            { grade: 'CGC 1.0', pcGrade: 'CGC 4.0' },
            { grade: 'Ungraded', pcGrade: 'Ungraded' }
        ];
    }
    /**
     * Calculate weighted market cap using real PriceCharting prices and GoCollect census data
     */
    async calculateWeightedPricing(comicName, sharesPerCopy = 100) {
        console.log(`\n💎 Calculating weighted market cap for: ${comicName}`);
        // Step 1: Get real prices by grade from PriceCharting
        const priceData = await priceChartingService_1.priceChartingService.getComicPricesByGrade(comicName);
        if (!priceData) {
            console.error(`❌ No price data available for: ${comicName}`);
            return null;
        }
        // Step 2: Get census distribution from GoCollect
        let censusData = await goCollectService_1.goCollectService.getCensusDataByName(comicName);
        // If GoCollect data unavailable, estimate based on era
        if (!censusData || censusData.gradeDistribution.length === 0) {
            console.warn(`⚠️ No GoCollect census data, estimating distribution`);
            const era = this.determineEra(priceData.releaseDate);
            const estimatedTotalCopies = this.estimateTotalCopies(priceData.highestPrice || 0, era);
            const distribution = goCollectService_1.goCollectService.estimateCensusDistribution(era, estimatedTotalCopies);
            censusData = {
                comicId: priceData.productId,
                comicName: priceData.productName,
                totalCopies: estimatedTotalCopies,
                universalCopies: estimatedTotalCopies,
                gradeDistribution: distribution,
                lastUpdated: new Date().toISOString()
            };
        }
        // Step 3: Map PriceCharting prices to census grades
        const pricesByGrade = new Map();
        for (const censusGrade of censusData.gradeDistribution) {
            const mapping = this.gradeMapping.find(m => m.grade === censusGrade.grade);
            if (!mapping)
                continue;
            // Find price from PriceCharting
            const pcGrade = priceData.grades.find(g => g.grade === mapping.pcGrade);
            if (pcGrade && pcGrade.price) {
                let price = pcGrade.price;
                // Apply discount for lower grades using proxy prices
                if (censusGrade.grade.includes('3.') || censusGrade.grade.includes('2.') || censusGrade.grade.includes('1.')) {
                    const gradeNum = parseFloat(censusGrade.grade.replace('CGC ', ''));
                    price = price * (gradeNum / 4.0); // Proportional discount
                }
                pricesByGrade.set(censusGrade.grade, price);
            }
            else if (censusGrade.lastSalePrice) {
                // Use GoCollect's last sale price if available
                pricesByGrade.set(censusGrade.grade, censusGrade.lastSalePrice);
            }
        }
        if (pricesByGrade.size === 0) {
            console.error(`❌ No valid prices found for any grades`);
            return null;
        }
        // Step 4: Calculate weighted market cap
        const marketCap = goCollectService_1.goCollectService.calculateWeightedMarketCap(censusData.gradeDistribution, pricesByGrade, sharesPerCopy);
        // Step 5: Calculate scarcity modifier
        const scarcityModifier = this.calculateScarcityModifier(censusData.totalCopies, priceData.highestPrice || 0);
        // Step 6: Apply scarcity modifier to total market value (not just share price)
        // This maintains the formula: sharePrice = totalMarketValue / totalFloat
        const adjustedTotalMarketValue = marketCap.totalMarketValue * scarcityModifier;
        const adjustedSharePrice = adjustedTotalMarketValue / marketCap.totalFloat;
        const adjustedAverageComicValue = marketCap.averageComicValue * scarcityModifier;
        const result = {
            sharePrice: adjustedSharePrice,
            totalMarketValue: adjustedTotalMarketValue,
            totalFloat: marketCap.totalFloat,
            averageComicValue: adjustedAverageComicValue,
            scarcityModifier,
            censusDistribution: censusData.gradeDistribution.map(grade => ({
                ...grade,
                lastSalePrice: pricesByGrade.get(grade.grade)
            })),
            sharesPerCopy
        };
        console.log(`\n✅ Weighted Pricing Complete:`);
        console.log(`   Share Price: $${result.sharePrice.toFixed(2)} (with scarcity modifier: ${scarcityModifier.toFixed(4)})`);
        console.log(`   Total Float: ${result.totalFloat.toLocaleString()} shares`);
        console.log(`   Total Market Value: $${result.totalMarketValue.toLocaleString()} (adjusted)`);
        console.log(`   Avg Comic Value: $${result.averageComicValue.toLocaleString()} (adjusted)`);
        console.log(`   Formula check: $${result.totalMarketValue.toLocaleString()} ÷ ${result.totalFloat.toLocaleString()} = $${adjustedSharePrice.toFixed(2)}\n`);
        return result;
    }
    /**
     * Calculate scarcity modifier using FloatScarcityMod formula:
     * clip(1 + 0.20·(C_mid − C)/C_mid, 0.90–1.10)
     */
    calculateScarcityModifier(totalCopies, highestPrice) {
        // Determine median census count for this price tier
        const priceTier = this.getPriceTier(highestPrice);
        const medianCensus = this.getMedianCensusForTier(priceTier);
        // Apply formula: 1 + α·(C_mid − C)/C_mid where α = 0.20
        const alpha = 0.20;
        const modifier = 1 + alpha * ((medianCensus - totalCopies) / medianCensus);
        // Clip to 0.90 - 1.10 range
        return Math.max(0.90, Math.min(1.10, modifier));
    }
    /**
     * Determine price tier for scarcity calculation
     */
    getPriceTier(highestPrice) {
        if (highestPrice > 100000)
            return 'golden'; // $100k+ = Golden Age
        if (highestPrice > 10000)
            return 'silver'; // $10k-$100k = Silver Age
        if (highestPrice > 1000)
            return 'bronze'; // $1k-$10k = Bronze Age
        return 'modern'; // Under $1k = Modern
    }
    /**
     * Get median census count for price tier (for scarcity modifier)
     */
    getMedianCensusForTier(tier) {
        const medianCounts = {
            golden: 3000, // Amazing Fantasy #15: ~2,680 copies
            silver: 5000, // X-Men #1: ~5,035 copies
            bronze: 8000, // More common bronze age keys
            modern: 15000 // Modern keys with larger print runs
        };
        return medianCounts[tier];
    }
    /**
     * Determine era from release date
     */
    determineEra(releaseDate) {
        if (!releaseDate)
            return 'modern';
        const year = new Date(releaseDate).getFullYear();
        if (year < 1956)
            return 'golden';
        if (year < 1970)
            return 'silver';
        if (year < 1985)
            return 'bronze';
        return 'modern';
    }
    /**
     * Estimate total copies based on price and era (when census data unavailable)
     */
    estimateTotalCopies(highestPrice, era) {
        // Inverse relationship: higher price = fewer copies
        const baseCopies = {
            golden: 3000,
            silver: 5000,
            bronze: 10000,
            modern: 20000
        };
        const base = baseCopies[era];
        // Adjust based on price (expensive books are rarer)
        if (highestPrice > 100000)
            return Math.floor(base * 0.5); // Super rare
        if (highestPrice > 50000)
            return Math.floor(base * 0.7);
        if (highestPrice > 10000)
            return Math.floor(base * 0.9);
        if (highestPrice > 1000)
            return base;
        return Math.floor(base * 1.5); // More common books
    }
    /**
     * Batch calculate pricing for multiple comics
     */
    async batchCalculateWeightedPricing(comicNames, sharesPerCopy = 100) {
        const results = new Map();
        console.log(`\n📊 Batch calculating weighted pricing for ${comicNames.length} comics...`);
        for (const comicName of comicNames) {
            const result = await this.calculateWeightedPricing(comicName, sharesPerCopy);
            if (result) {
                results.set(comicName, result);
            }
            // Rate limiting: wait 500ms between API calls
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        console.log(`✅ Batch calculation complete: ${results.size}/${comicNames.length} successful\n`);
        return results;
    }
}
exports.weightedMarketCapService = new WeightedMarketCapService();
