"use strict";
/**
 * NPC Personality Engine
 *
 * Defines 10 distinct trader archetypes with behavioral characteristics
 * for AI-powered trading NPCs in the Panel Profits simulation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArchetypeBehavior = getArchetypeBehavior;
exports.generatePersonalityConfig = generatePersonalityConfig;
exports.getAllArchetypes = getAllArchetypes;
exports.generateNPCPopulation = generateNPCPopulation;
exports.getTradingFrequencyValue = getTradingFrequencyValue;
exports.shouldNPCTrade = shouldNPCTrade;
exports.getNPCTradeDirection = getNPCTradeDirection;
exports.calculateNPCPositionSize = calculateNPCPositionSize;
/**
 * 10 Trader Archetypes with Behavioral Characteristics
 */
const PERSONALITY_ARCHETYPES = {
    whale: {
        archetype: 'whale',
        riskToleranceRange: [60, 80],
        skillLevelRange: [7, 10],
        positionSizingRange: [10, 30],
        holdingPeriodRange: [30, 180],
        tradingFrequency: 'low',
        preferredAssetTypes: ['characters', 'publishers', 'creators', 'etfs'],
        stopLossRange: [15, 25],
        takeProfitRange: [30, 100],
        panicThresholdRange: [10, 30],
        greedThresholdRange: [60, 85],
        fomoSusceptibilityRange: [20, 40],
        newsReaction: 'consider',
        lossCutSpeed: 'slow',
    },
    day_trader: {
        archetype: 'day_trader',
        riskToleranceRange: [40, 70],
        skillLevelRange: [5, 8],
        positionSizingRange: [5, 15],
        holdingPeriodRange: [0.02, 1], // minutes to same day (0.02 ≈ 30 min)
        tradingFrequency: 'very_high',
        preferredAssetTypes: ['characters', 'issues', 'options'],
        stopLossRange: [2, 5],
        takeProfitRange: [3, 8],
        panicThresholdRange: [40, 60],
        greedThresholdRange: [50, 70],
        fomoSusceptibilityRange: [60, 80],
        newsReaction: 'consider',
        lossCutSpeed: 'instant',
    },
    value_investor: {
        archetype: 'value_investor',
        riskToleranceRange: [20, 50],
        skillLevelRange: [6, 9],
        positionSizingRange: [8, 20],
        holdingPeriodRange: [90, 365],
        tradingFrequency: 'very_low',
        preferredAssetTypes: ['characters', 'creators', 'publishers', 'bonds'],
        stopLossRange: [20, 35],
        takeProfitRange: [50, 150],
        panicThresholdRange: [5, 20],
        greedThresholdRange: [40, 60],
        fomoSusceptibilityRange: [10, 30],
        newsReaction: 'consider',
        lossCutSpeed: 'slow',
    },
    momentum_chaser: {
        archetype: 'momentum_chaser',
        riskToleranceRange: [70, 95],
        skillLevelRange: [3, 6],
        positionSizingRange: [10, 25],
        holdingPeriodRange: [3, 21],
        tradingFrequency: 'high',
        preferredAssetTypes: ['characters', 'issues', 'options'],
        stopLossRange: [8, 15],
        takeProfitRange: [20, 50],
        panicThresholdRange: [70, 90],
        greedThresholdRange: [75, 95],
        fomoSusceptibilityRange: [80, 100],
        newsReaction: 'emotional',
        lossCutSpeed: 'instant',
    },
    contrarian: {
        archetype: 'contrarian',
        riskToleranceRange: [50, 75],
        skillLevelRange: [6, 9],
        positionSizingRange: [8, 18],
        holdingPeriodRange: [14, 90],
        tradingFrequency: 'medium',
        preferredAssetTypes: ['characters', 'issues', 'creators', 'publishers'],
        stopLossRange: [12, 20],
        takeProfitRange: [25, 60],
        panicThresholdRange: [15, 35],
        greedThresholdRange: [30, 50],
        fomoSusceptibilityRange: [10, 25],
        newsReaction: 'ignore',
        lossCutSpeed: 'slow',
    },
    swing_trader: {
        archetype: 'swing_trader',
        riskToleranceRange: [45, 65],
        skillLevelRange: [5, 8],
        positionSizingRange: [10, 20],
        holdingPeriodRange: [3, 30],
        tradingFrequency: 'medium',
        preferredAssetTypes: ['characters', 'issues', 'creators'],
        stopLossRange: [5, 12],
        takeProfitRange: [10, 30],
        panicThresholdRange: [40, 60],
        greedThresholdRange: [50, 70],
        fomoSusceptibilityRange: [40, 60],
        newsReaction: 'consider',
        lossCutSpeed: 'instant',
    },
    dividend_hunter: {
        archetype: 'dividend_hunter',
        riskToleranceRange: [10, 40],
        skillLevelRange: [4, 7],
        positionSizingRange: [15, 30],
        holdingPeriodRange: [180, 365],
        tradingFrequency: 'very_low',
        preferredAssetTypes: ['bonds', 'creators', 'publishers', 'etfs'],
        stopLossRange: [25, 40],
        takeProfitRange: [15, 35],
        panicThresholdRange: [5, 15],
        greedThresholdRange: [20, 40],
        fomoSusceptibilityRange: [5, 20],
        newsReaction: 'ignore',
        lossCutSpeed: 'never',
    },
    options_gambler: {
        archetype: 'options_gambler',
        riskToleranceRange: [80, 100],
        skillLevelRange: [4, 7],
        positionSizingRange: [5, 15],
        holdingPeriodRange: [1, 30],
        tradingFrequency: 'high',
        preferredAssetTypes: ['options', 'characters', 'issues'],
        stopLossRange: [30, 60],
        takeProfitRange: [100, 300],
        panicThresholdRange: [60, 85],
        greedThresholdRange: [85, 100],
        fomoSusceptibilityRange: [70, 95],
        newsReaction: 'emotional',
        lossCutSpeed: 'instant',
    },
    index_hugger: {
        archetype: 'index_hugger',
        riskToleranceRange: [15, 35],
        skillLevelRange: [3, 6],
        positionSizingRange: [20, 40],
        holdingPeriodRange: [90, 365],
        tradingFrequency: 'very_low',
        preferredAssetTypes: ['etfs', 'publishers'],
        stopLossRange: [20, 30],
        takeProfitRange: [15, 30],
        panicThresholdRange: [10, 25],
        greedThresholdRange: [25, 45],
        fomoSusceptibilityRange: [15, 35],
        newsReaction: 'ignore',
        lossCutSpeed: 'slow',
    },
    panic_seller: {
        archetype: 'panic_seller',
        riskToleranceRange: [25, 55],
        skillLevelRange: [2, 5],
        positionSizingRange: [8, 18],
        holdingPeriodRange: [1, 60],
        tradingFrequency: 'medium',
        preferredAssetTypes: ['characters', 'issues', 'creators'],
        stopLossRange: [3, 10],
        takeProfitRange: [5, 15],
        panicThresholdRange: [75, 95],
        greedThresholdRange: [60, 80],
        fomoSusceptibilityRange: [70, 90],
        newsReaction: 'emotional',
        lossCutSpeed: 'instant',
    },
};
/**
 * Random number generator within a range (inclusive)
 */
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}
/**
 * Random integer within a range (inclusive)
 */
function randomIntInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * Get the base personality configuration for an archetype
 *
 * @param archetype - The trader archetype name
 * @returns PersonalityConfig for the archetype
 */
function getArchetypeBehavior(archetype) {
    const normalizedArchetype = archetype.toLowerCase();
    if (!PERSONALITY_ARCHETYPES[normalizedArchetype]) {
        throw new Error(`Unknown archetype: ${archetype}. Valid archetypes: ${Object.keys(PERSONALITY_ARCHETYPES).join(', ')}`);
    }
    return { ...PERSONALITY_ARCHETYPES[normalizedArchetype] };
}
/**
 * Generate a randomized personality configuration within archetype's ranges
 *
 * @param archetype - The trader archetype name
 * @param skillLevel - Optional override for skill level (within archetype's range)
 * @returns GeneratedPersonality with randomized values
 */
function generatePersonalityConfig(archetype, skillLevel) {
    const config = getArchetypeBehavior(archetype);
    // Determine skill level
    let finalSkillLevel;
    if (skillLevel !== undefined) {
        // Clamp provided skill level to archetype's range
        const [minSkill, maxSkill] = config.skillLevelRange;
        finalSkillLevel = Math.max(minSkill, Math.min(maxSkill, skillLevel));
    }
    else {
        // Generate random skill level within range
        finalSkillLevel = randomInRange(config.skillLevelRange[0], config.skillLevelRange[1]);
    }
    // Generate all other randomized values within their ranges
    const generated = {
        ...config,
        skillLevel: finalSkillLevel,
        riskTolerance: randomInRange(config.riskToleranceRange[0], config.riskToleranceRange[1]),
        positionSizing: randomInRange(config.positionSizingRange[0], config.positionSizingRange[1]),
        holdingPeriod: randomInRange(config.holdingPeriodRange[0], config.holdingPeriodRange[1]),
        stopLoss: randomInRange(config.stopLossRange[0], config.stopLossRange[1]),
        takeProfit: randomInRange(config.takeProfitRange[0], config.takeProfitRange[1]),
        panicThreshold: randomInRange(config.panicThresholdRange[0], config.panicThresholdRange[1]),
        greedThreshold: randomInRange(config.greedThresholdRange[0], config.greedThresholdRange[1]),
        fomoSusceptibility: randomInRange(config.fomoSusceptibilityRange[0], config.fomoSusceptibilityRange[1]),
    };
    return generated;
}
/**
 * Get all available archetypes
 */
function getAllArchetypes() {
    return Object.keys(PERSONALITY_ARCHETYPES);
}
/**
 * Generate multiple NPC personalities of different archetypes
 *
 * @param count - Number of NPCs to generate
 * @param archetypes - Optional array of specific archetypes to use (randomly selected if not provided)
 * @returns Array of generated personalities
 */
function generateNPCPopulation(count, archetypes) {
    const availableArchetypes = archetypes || getAllArchetypes();
    const population = [];
    for (let i = 0; i < count; i++) {
        const randomArchetype = availableArchetypes[Math.floor(Math.random() * availableArchetypes.length)];
        population.push(generatePersonalityConfig(randomArchetype));
    }
    return population;
}
/**
 * Get trading frequency as a numeric value (trades per day)
 */
function getTradingFrequencyValue(frequency) {
    const frequencyMap = {
        very_high: 10, // 10+ trades per day
        high: 5, // 5 trades per day
        medium: 2, // 2 trades per day
        low: 0.5, // 1 trade every 2 days
        very_low: 0.1, // 1 trade every 10 days
    };
    return frequencyMap[frequency];
}
/**
 * Determine if NPC should trade based on personality and market conditions
 *
 * @param personality - The NPC's personality configuration
 * @param marketSentiment - Current market sentiment (-100 to 100)
 * @param priceChange - Recent price change percentage
 * @param newsImpact - News impact score (0-100)
 * @returns boolean indicating if NPC should trade
 */
function shouldNPCTrade(personality, marketSentiment, priceChange, newsImpact = 0) {
    // Base trading probability from frequency
    const baseProb = getTradingFrequencyValue(personality.tradingFrequency) / 10;
    // FOMO factor - high FOMO means more likely to trade on big moves
    const fomoFactor = Math.abs(priceChange) > 5
        ? (personality.fomoSusceptibility / 100) * 0.3
        : 0;
    // Panic factor - high panic means more likely to sell on negative news
    const panicFactor = (newsImpact < 0 && personality.newsReaction === 'emotional')
        ? (personality.panicThreshold / 100) * 0.2
        : 0;
    // Greed factor - high greed means more likely to buy on positive news
    const greedFactor = (newsImpact > 0 && personality.newsReaction === 'emotional')
        ? (personality.greedThreshold / 100) * 0.2
        : 0;
    // Contrarian adjustment - contrarians trade against the crowd
    const contrarianFactor = personality.archetype === 'contrarian'
        ? Math.abs(marketSentiment) / 200 * 0.3
        : 0;
    const totalProb = baseProb + fomoFactor + panicFactor + greedFactor + contrarianFactor;
    return Math.random() < Math.min(totalProb, 0.95);
}
/**
 * Determine trade direction based on personality and market conditions
 *
 * @param personality - The NPC's personality configuration
 * @param marketSentiment - Current market sentiment (-100 to 100)
 * @param priceChange - Recent price change percentage
 * @param newsImpact - News impact score (0-100)
 * @returns 'buy' | 'sell'
 */
function getNPCTradeDirection(personality, marketSentiment, priceChange, newsImpact = 0) {
    let buyProbability = 0.5; // Start neutral
    // Archetype-specific logic
    switch (personality.archetype) {
        case 'momentum_chaser':
            // Buy on positive momentum, sell on negative
            buyProbability += (priceChange > 0 ? 0.3 : -0.3);
            break;
        case 'contrarian':
            // Buy on dips, sell on rallies
            buyProbability += (priceChange < 0 ? 0.3 : -0.3);
            break;
        case 'panic_seller':
            // Heavily influenced by negative news
            if (newsImpact < 0 || priceChange < -3) {
                buyProbability -= 0.4;
            }
            break;
        case 'value_investor':
            // Buy when undervalued (negative sentiment but good fundamentals)
            if (marketSentiment < -20) {
                buyProbability += 0.2;
            }
            break;
        case 'dividend_hunter':
            // Prefer buying and holding
            buyProbability += 0.2;
            break;
    }
    // Market sentiment influence (based on news reaction)
    if (personality.newsReaction === 'emotional') {
        buyProbability += marketSentiment / 200;
    }
    else if (personality.newsReaction === 'consider') {
        buyProbability += marketSentiment / 400;
    }
    return Math.random() < buyProbability ? 'buy' : 'sell';
}
/**
 * Calculate position size based on personality and market conditions
 *
 * @param personality - The NPC's personality configuration
 * @param availableCapital - Available trading capital
 * @param volatility - Current asset volatility (0-100)
 * @returns Position size in dollars
 */
function calculateNPCPositionSize(personality, availableCapital, volatility = 50) {
    // Base position size as percentage of capital
    const basePercent = personality.positionSizing / 100;
    // Adjust for risk tolerance and volatility
    const riskAdjustment = personality.riskTolerance / 100;
    const volatilityAdjustment = 1 - (volatility / 200); // Higher volatility = smaller position
    // Skill level affects position sizing confidence
    const skillAdjustment = 0.7 + (personality.skillLevel / 20); // 0.7 to 1.2 multiplier
    const adjustedPercent = basePercent * riskAdjustment * volatilityAdjustment * skillAdjustment;
    return availableCapital * adjustedPercent;
}
exports.default = {
    getArchetypeBehavior,
    generatePersonalityConfig,
    getAllArchetypes,
    generateNPCPopulation,
    getTradingFrequencyValue,
    shouldNPCTrade,
    getNPCTradeDirection,
    calculateNPCPositionSize,
};
