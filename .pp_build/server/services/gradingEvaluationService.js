"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradingEvaluationService = exports.RARITY_THRESHOLDS = exports.GRADING_SCALE = void 0;
// CGC-style grading scale mapping
exports.GRADING_SCALE = {
    MINT: 10.0,
    NEAR_MINT_PLUS: 9.8,
    NEAR_MINT: 9.4,
    VERY_FINE_PLUS: 8.5,
    VERY_FINE: 8.0,
    FINE_PLUS: 6.5,
    FINE: 6.0,
    VERY_GOOD_PLUS: 4.5,
    VERY_GOOD: 4.0,
    GOOD_PLUS: 2.5,
    GOOD: 2.0,
    FAIR: 1.0,
    POOR: 0.5,
};
// Rarity tier thresholds based on market scarcity and demand
exports.RARITY_THRESHOLDS = {
    MYTHIC: 95.0, // Legendary one-of-a-kind items
    LEGENDARY: 85.0, // Ultra-rare key issues and variants
    ULTRA_RARE: 70.0, // Limited print runs and special editions
    RARE: 55.0, // Key issues and popular variants
    UNCOMMON: 35.0, // Notable issues and covers
    COMMON: 0.0, // Standard issues
};
class GradingEvaluationService {
    constructor(storage) {
        this.storage = storage;
    }
    /**
     * Perform comprehensive CGC-style grading assessment
     */
    async performGradingAssessment(assetId, gradingCriteria, certificationAuthority = 'internal', additionalNotes) {
        const { condition, centering, corners, edges, surface } = gradingCriteria;
        // Validate grading inputs (0.5 - 10.0 scale)
        const scores = [condition, centering, corners, edges, surface];
        if (scores.some(score => score < 0.5 || score > 10.0)) {
            throw new Error('Grading scores must be between 0.5 and 10.0');
        }
        // Calculate overall grade using CGC-style weighted formula
        // Condition is heavily weighted, others contribute to final score
        const overallGrade = this.calculateOverallGrade({
            condition,
            centering,
            corners,
            edges,
            surface
        });
        // Generate detailed grading notes
        const gradingNotes = this.generateGradingNotes({
            condition,
            centering,
            corners,
            edges,
            surface,
            additionalNotes
        });
        // Calculate assessment confidence based on score consistency
        const confidence = this.calculateAssessmentConfidence(scores);
        return {
            overallGrade: Math.round(overallGrade * 10) / 10, // Round to 1 decimal
            conditionScore: condition,
            centeringScore: centering,
            cornersScore: corners,
            edgesScore: edges,
            surfaceScore: surface,
            gradingNotes,
            confidence
        };
    }
    /**
     * Calculate rarity tier and scoring for an asset
     */
    async calculateRarityAnalysis(assetId, marketFactors) {
        // Fetch asset data and market history
        const asset = await this.storage.getAssetById(assetId);
        if (!asset) {
            throw new Error(`Asset not found: ${assetId}`);
        }
        // Get market data and price history
        const marketData = await this.storage.getLatestMarketData(assetId);
        const marketHistory = await this.storage.getMarketDataHistory(assetId, '1w', 52); // 52 weeks
        // Calculate scarcity factors
        const scarcityFactors = this.calculateScarcityFactors(asset, marketData, marketHistory);
        // Calculate market demand score
        const marketDemandScore = this.calculateMarketDemandScore(asset, marketData, marketHistory, marketFactors);
        // Calculate overall rarity score
        const rarityScore = this.calculateRarityScore(scarcityFactors, marketDemandScore);
        // Determine rarity tier
        const rarityTier = this.determineRarityTier(rarityScore);
        // Find market comparables
        const marketComparables = await this.findMarketComparables(assetId);
        return {
            rarityTier,
            rarityScore,
            marketDemandScore,
            scarcityFactors,
            marketComparables
        };
    }
    /**
     * Create or update graded asset profile
     */
    async createGradedAssetProfile(userId, assetId, gradingAssessment, rarityAnalysis, additionalData) {
        // Create graded asset profile data
        const gradedProfileData = {
            userId,
            assetId,
            overallGrade: gradingAssessment.overallGrade,
            conditionScore: gradingAssessment.conditionScore,
            centeringScore: gradingAssessment.centeringScore,
            cornersScore: gradingAssessment.cornersScore,
            edgesScore: gradingAssessment.edgesScore,
            surfaceScore: gradingAssessment.surfaceScore,
            certificationAuthority: 'internal',
            gradingDate: new Date(),
            gradingNotes: gradingAssessment.gradingNotes,
            rarityTier: rarityAnalysis.rarityTier,
            rarityScore: rarityAnalysis.rarityScore,
            marketDemandScore: rarityAnalysis.marketDemandScore,
            acquisitionDate: additionalData.acquisitionDate,
            acquisitionPrice: additionalData.acquisitionPrice?.toString(),
            storageType: additionalData.storageType || 'bag_and_board',
            storageCondition: additionalData.storageCondition || 'excellent',
            variantType: additionalData.variantType,
            isKeyIssue: additionalData.isKeyIssue || false,
            isFirstAppearance: additionalData.isFirstAppearance || false,
            isSigned: additionalData.isSigned || false,
            collectorNotes: additionalData.collectorNotes,
            houseAffiliation: additionalData.houseAffiliation,
            houseProgressionValue: this.calculateHouseProgressionValue(gradingAssessment.overallGrade, rarityAnalysis.rarityScore).toString()
        };
        // Create the graded asset profile
        const gradedProfile = await this.storage.createGradedAssetProfile(gradedProfileData);
        // Create certification record
        const certificationData = {
            gradedAssetId: gradedProfile.id,
            certificationType: 'initial_grade',
            newGrade: gradingAssessment.overallGrade,
            certifyingAuthority: 'internal',
            completionDate: new Date(),
            certificationNotes: gradingAssessment.gradingNotes,
            qualityAssessment: {
                condition: gradingAssessment.conditionScore,
                centering: gradingAssessment.centeringScore,
                corners: gradingAssessment.cornersScore,
                edges: gradingAssessment.edgesScore,
                surface: gradingAssessment.surfaceScore,
                confidence: gradingAssessment.confidence
            }
        };
        await this.storage.createGradingCertification(certificationData);
        return gradedProfile;
    }
    /**
     * Re-grade an existing graded asset
     */
    async performReGrading(gradedAssetId, newGradingCriteria, certificationAuthority = 'internal', notes) {
        // Get existing graded asset profile
        const existingProfile = await this.storage.getGradedAssetProfile(gradedAssetId);
        if (!existingProfile) {
            throw new Error(`Graded asset profile not found: ${gradedAssetId}`);
        }
        // Perform new grading assessment
        const newAssessment = await this.performGradingAssessment(existingProfile.assetId, newGradingCriteria, certificationAuthority, notes);
        // Update graded asset profile
        const updatedProfile = await this.storage.updateGradedAssetProfile(gradedAssetId, {
            overallGrade: newAssessment.overallGrade,
            conditionScore: newAssessment.conditionScore,
            centeringScore: newAssessment.centeringScore,
            cornersScore: newAssessment.cornersScore,
            edgesScore: newAssessment.edgesScore,
            surfaceScore: newAssessment.surfaceScore,
            gradingNotes: newAssessment.gradingNotes,
            gradingDate: new Date(),
            certificationAuthority
        });
        // Create re-grading certification record
        const reGradingData = {
            gradedAssetId,
            certificationType: 're_grade',
            previousGrade: existingProfile.overallGrade,
            newGrade: newAssessment.overallGrade,
            certifyingAuthority,
            completionDate: new Date(),
            certificationNotes: newAssessment.gradingNotes,
            qualityAssessment: {
                condition: newAssessment.conditionScore,
                centering: newAssessment.centeringScore,
                corners: newAssessment.cornersScore,
                edges: newAssessment.edgesScore,
                surface: newAssessment.surfaceScore,
                confidence: newAssessment.confidence
            }
        };
        await this.storage.createGradingCertification(reGradingData);
        return updatedProfile;
    }
    // Private helper methods
    calculateOverallGrade(scores) {
        // CGC-style weighted calculation
        // Condition is most important (50%), others contribute equally (12.5% each)
        return (scores.condition * 0.5 +
            scores.centering * 0.125 +
            scores.corners * 0.125 +
            scores.edges * 0.125 +
            scores.surface * 0.125);
    }
    generateGradingNotes(gradingData) {
        const notes = [];
        // Condition assessment
        if (gradingData.condition >= 9.5) {
            notes.push('Exceptional condition with minimal wear');
        }
        else if (gradingData.condition >= 8.0) {
            notes.push('Very fine condition with minor imperfections');
        }
        else if (gradingData.condition >= 6.0) {
            notes.push('Fine condition with moderate wear');
        }
        else if (gradingData.condition >= 4.0) {
            notes.push('Good condition with visible wear');
        }
        else {
            notes.push('Fair to poor condition with significant wear');
        }
        // Centering issues
        if (gradingData.centering < 8.0) {
            notes.push('Off-center printing noted');
        }
        // Corner wear
        if (gradingData.corners < 7.0) {
            notes.push('Corner wear present');
        }
        // Edge wear
        if (gradingData.edges < 7.0) {
            notes.push('Edge wear and possible stress marks');
        }
        // Surface defects
        if (gradingData.surface < 7.0) {
            notes.push('Surface defects including possible spine stress');
        }
        // Additional collector notes
        if (gradingData.additionalNotes) {
            notes.push(gradingData.additionalNotes);
        }
        return notes.join('. ') + '.';
    }
    calculateAssessmentConfidence(scores) {
        // Calculate variance to determine confidence
        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
        const standardDeviation = Math.sqrt(variance);
        // Lower standard deviation = higher confidence
        // Scale to 0-1 range
        return Math.max(0, Math.min(1, 1 - (standardDeviation / 5)));
    }
    calculateScarcityFactors(asset, marketData, marketHistory) {
        // Age bonus (older comics get rarity boost)
        const assetAge = asset.createdAt ? new Date().getFullYear() - new Date(asset.createdAt).getFullYear() : 0;
        const ageBonus = Math.min(50, assetAge * 2); // Cap at 50 points
        // Key issue status multiplier
        const keyIssueMultiplier = asset.metadata?.isKeyIssue ? 25 : 0;
        // Variant rarity based on print run estimates
        const variantRarity = this.calculateVariantRarity(asset);
        // Market presence (how frequently it appears for sale)
        const marketPresence = this.calculateMarketPresence(marketHistory);
        return {
            ageBonus,
            keyIssueMultiplier,
            variantRarity,
            marketPresence
        };
    }
    calculateVariantRarity(asset) {
        const metadata = asset.metadata;
        const variantType = metadata?.variantType;
        // Rarity scoring for different variant types
        const variantScores = {
            'sketch': 40,
            'incentive': 35,
            'convention': 30,
            'artist': 25,
            'retailer': 20,
            'first_print': 10,
            'standard': 0
        };
        return variantScores[variantType] || 0;
    }
    calculateMarketPresence(marketHistory) {
        // Lower trading frequency indicates higher scarcity
        const tradingFrequency = marketHistory.filter(data => data.volume > 0).length;
        const totalPeriods = marketHistory.length;
        const presenceRatio = tradingFrequency / totalPeriods;
        // Invert the ratio (lower presence = higher rarity score)
        return Math.max(0, 30 - (presenceRatio * 30));
    }
    calculateMarketDemandScore(asset, marketData, marketHistory, factors) {
        let demandScore = 0;
        // Price appreciation trend
        if (marketHistory.length > 10) {
            const recentPrice = marketHistory[marketHistory.length - 1]?.close || 0;
            const oldPrice = marketHistory[0]?.close || 1;
            const appreciation = ((parseFloat(recentPrice.toString()) - parseFloat(oldPrice.toString())) / parseFloat(oldPrice.toString())) * 100;
            demandScore += Math.min(30, Math.max(0, appreciation / 5)); // Cap at 30 points
        }
        // Current market activity (volume)
        const currentVolume = marketData?.volume || 0;
        const averageVolume = marketHistory.reduce((sum, data) => sum + data.volume, 0) / marketHistory.length;
        if (currentVolume > averageVolume * 1.5) {
            demandScore += 15; // High current activity
        }
        // Apply custom factors if provided
        if (factors) {
            demandScore += (factors.popularityScore || 0) * 0.3;
            demandScore += (factors.creatorSignificance || 0) * 0.2;
            demandScore += (factors.houseAffiliation || 0) * 0.1;
        }
        return Math.min(100, demandScore);
    }
    calculateRarityScore(scarcityFactors, marketDemandScore) {
        const scarcityScore = (scarcityFactors.ageBonus +
            scarcityFactors.keyIssueMultiplier +
            scarcityFactors.variantRarity +
            scarcityFactors.marketPresence);
        // Combine scarcity and demand (70% scarcity, 30% demand)
        return scarcityScore * 0.7 + marketDemandScore * 0.3;
    }
    determineRarityTier(rarityScore) {
        if (rarityScore >= exports.RARITY_THRESHOLDS.MYTHIC)
            return 'mythic';
        if (rarityScore >= exports.RARITY_THRESHOLDS.LEGENDARY)
            return 'legendary';
        if (rarityScore >= exports.RARITY_THRESHOLDS.ULTRA_RARE)
            return 'ultra_rare';
        if (rarityScore >= exports.RARITY_THRESHOLDS.RARE)
            return 'rare';
        if (rarityScore >= exports.RARITY_THRESHOLDS.UNCOMMON)
            return 'uncommon';
        return 'common';
    }
    async findMarketComparables(assetId) {
        // This would typically query external market data sources
        // For now, return empty array - implement with real market data
        return [];
    }
    calculateHouseProgressionValue(grade, rarityScore) {
        // Higher grade and rarity contribute to house progression
        return (grade * 10) + (rarityScore * 0.5);
    }
}
exports.GradingEvaluationService = GradingEvaluationService;
