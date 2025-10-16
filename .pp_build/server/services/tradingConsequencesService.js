"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tradingConsequencesService = exports.TradingConsequencesService = void 0;
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const drizzle_orm_1 = require("drizzle-orm");
const schema_js_1 = require("@shared/schema.js");
const karmicAlignmentService_js_1 = require("./karmicAlignmentService.js");
// Initialize database connection
const sql_connection = (0, serverless_1.neon)(process.env.DATABASE_URL);
const db = (0, neon_http_1.drizzle)(sql_connection);
/**
 * Trading Consequences Service - Applies alignment-based modifiers to trading
 * Integrates karmic forces with actual trading mechanics in the Panel Profits realm
 */
class TradingConsequencesService {
    constructor() {
        // Alignment-based trading modifiers
        this.ALIGNMENT_MODIFIERS = {
            // Lawful traders - stability and order bonuses
            lawful: {
                priceStabilityBonus: 0.15, // Reduced price volatility
                orderExecutionBonus: 0.1, // Better execution rates
                riskReductionBonus: 0.2, // Lower downside risk
                consistencyBonus: 0.12, // More consistent returns
                mysticalFlavor: "Divine order guides your trades with celestial precision",
                colorTheme: "blue"
            },
            // Chaotic traders - high risk/reward multipliers
            chaotic: {
                volatilityMultiplier: 1.3, // Higher price swings
                riskRewardMultiplier: 1.25, // Bigger gains and losses
                opportunityBonus: 0.15, // More trading opportunities
                unpredictabilityFactor: 1.2, // Random bonus/penalty events
                mysticalFlavor: "Chaotic forces amplify both fortune and misfortune",
                colorTheme: "yellow"
            },
            // Good alignment - community and cooperation benefits
            good: {
                communityTradingBonus: 0.18, // Benefits from others' success
                socialInsightBonus: 0.14, // Better market sentiment reading
                karmaReturnMultiplier: 1.15, // Karma grows faster
                protectionFromLosses: 0.1, // Divine protection from major losses
                mysticalFlavor: "Benevolent spirits aid your righteous endeavors",
                colorTheme: "green"
            },
            // Evil alignment - solitary power and aggressive gains
            evil: {
                soloTradingBonus: 0.2, // Better when trading alone
                aggressiveTradingBonus: 0.16, // Benefits from aggressive strategies
                powerAccumulationRate: 1.2, // Faster wealth accumulation
                manipulationResistance: 0.15, // Harder to manipulate
                mysticalFlavor: "Dark powers fuel your pursuit of dominance",
                colorTheme: "red"
            }
        };
        // House-specific trading consequences
        this.HOUSE_TRADING_EFFECTS = {
            heroes: {
                characterAssetBonus: 0.25, // Extra gains on character assets
                protectiveStopsBonus: 0.2, // Better stop-loss execution
                moralTradeFilter: true, // Restrictions on "evil" assets
                legendaryAssetAttraction: 0.15, // More likely to find rare assets
                mysticalDescription: "Heroic valor enhances trades in noble character assets"
            },
            wisdom: {
                analyticalBonus: 0.18, // Better technical analysis
                longTermInvestmentBonus: 0.22, // Better long-term returns
                educationalAssetBonus: 0.2, // Bonus on educational/knowledge assets
                marketResearchAccuracy: 0.25, // More accurate predictions
                mysticalDescription: "Ancient wisdom reveals hidden market truths"
            },
            power: {
                highVolumeBonus: 0.2, // Benefits from large trades
                dominanceMultiplier: 1.15, // Extra gains when winning
                competitiveEdge: 0.18, // Advantage in contested trades
                empireAssetBonus: 0.16, // Bonus on power/empire themed assets
                mysticalDescription: "Imperial authority commands market respect"
            },
            mystery: {
                rareAssetDiscovery: 0.3, // Better chance at finding rare assets
                hiddenOpportunityBonus: 0.25, // Access to secret trading opportunities
                volatilityProfitBonus: 0.2, // Profit from market chaos
                mysteriousAssetBonus: 0.22, // Bonus on mystery/supernatural assets
                mysticalDescription: "Enigmatic forces reveal hidden market mysteries"
            },
            elements: {
                balancedPortfolioBonus: 0.16, // Benefits from diversification
                elementalAssetBonus: 0.2, // Bonus on elemental/nature assets
                harmonyMultiplier: 1.12, // Gentle consistent growth
                seasonalTradingBonus: 0.18, // Bonus based on time patterns
                mysticalDescription: "Elemental balance brings harmonic trading success"
            },
            time: {
                timingMasterBonus: 0.28, // Perfect market timing
                patienceRewardMultiplier: 1.2, // Better returns for long holds
                historicalDataBonus: 0.22, // Better use of historical patterns
                futureOpportunityVision: 0.15, // Early access to emerging trends
                mysticalDescription: "Temporal mastery grants perfect market timing"
            },
            spirit: {
                communityTradingBonus: 0.24, // Benefits from social trading
                mentorshipRewards: 0.18, // Gains from helping others
                collaborativeOpportunities: 0.2, // Access to group trading opportunities
                spiritualAssetBonus: 0.19, // Bonus on spiritual/community assets
                mysticalDescription: "Spiritual bonds amplify collective trading power"
            }
        };
    }
    /**
     * Apply trading consequences based on user's current alignment and order details
     */
    async applyTradingConsequences(userId, order, asset, basePrice) {
        const user = await db.select().from(schema_js_1.users).where((0, drizzle_orm_1.eq)(schema_js_1.users.id, userId)).limit(1);
        if (!user[0]) {
            throw new Error('User not found');
        }
        const currentUser = user[0];
        const lawfulChaotic = parseFloat(currentUser.lawfulChaoticAlignment || '0');
        const goodEvil = parseFloat(currentUser.goodEvilAlignment || '0');
        const karma = currentUser.karma || 0;
        let modifiedPrice = basePrice;
        const consequences = [];
        const mysticalEvents = [];
        let totalKarmaImpact = 0;
        // Determine primary alignment tendencies
        const isLawful = lawfulChaotic > 25;
        const isChaotic = lawfulChaotic < -25;
        const isGood = goodEvil > 25;
        const isEvil = goodEvil < -25;
        // Apply alignment-based modifiers
        if (isLawful) {
            const effect = await this.applyLawfulConsequences(userId, order, asset, basePrice);
            modifiedPrice = effect.modifiedPrice;
            consequences.push(...effect.consequences);
            mysticalEvents.push(...effect.mysticalEvents);
            totalKarmaImpact += effect.karmaImpact;
        }
        if (isChaotic) {
            const effect = await this.applyChaoticConsequences(userId, order, asset, modifiedPrice);
            modifiedPrice = effect.modifiedPrice;
            consequences.push(...effect.consequences);
            mysticalEvents.push(...effect.mysticalEvents);
            totalKarmaImpact += effect.karmaImpact;
        }
        if (isGood) {
            const effect = await this.applyGoodConsequences(userId, order, asset, modifiedPrice);
            modifiedPrice = effect.modifiedPrice;
            consequences.push(...effect.consequences);
            mysticalEvents.push(...effect.mysticalEvents);
            totalKarmaImpact += effect.karmaImpact;
        }
        if (isEvil) {
            const effect = await this.applyEvilConsequences(userId, order, asset, modifiedPrice);
            modifiedPrice = effect.modifiedPrice;
            consequences.push(...effect.consequences);
            mysticalEvents.push(...effect.mysticalEvents);
            totalKarmaImpact += effect.karmaImpact;
        }
        // Apply house-specific effects
        if (currentUser.houseId) {
            const houseEffect = await this.applyHouseConsequences(userId, order, asset, modifiedPrice, currentUser.houseId);
            modifiedPrice = houseEffect.modifiedPrice;
            consequences.push(...houseEffect.consequences);
            mysticalEvents.push(...houseEffect.mysticalEvents);
            totalKarmaImpact += houseEffect.karmaImpact;
        }
        // Apply karma-based modifiers
        const karmaEffect = await this.applyKarmaConsequences(userId, order, asset, modifiedPrice, karma);
        modifiedPrice = karmaEffect.modifiedPrice;
        consequences.push(...karmaEffect.consequences);
        mysticalEvents.push(...karmaEffect.mysticalEvents);
        totalKarmaImpact += karmaEffect.karmaImpact;
        // Save consequences to database
        const savedConsequences = [];
        for (const consequence of consequences) {
            const [savedConsequence] = await db.insert(schema_js_1.tradingConsequences)
                .values(consequence)
                .returning();
            savedConsequences.push(savedConsequence);
        }
        // Record karma impact if significant
        if (Math.abs(totalKarmaImpact) >= 1) {
            await this.recordTradingKarmaAction(userId, order, asset, totalKarmaImpact, mysticalEvents);
        }
        return {
            modifiedPrice,
            consequences: savedConsequences,
            karmaImpact: totalKarmaImpact,
            mysticalEvents
        };
    }
    /**
     * Apply lawful alignment consequences - stability and order bonuses
     */
    async applyLawfulConsequences(userId, order, asset, basePrice) {
        const modifiers = this.ALIGNMENT_MODIFIERS.lawful;
        let modifiedPrice = basePrice;
        const consequences = [];
        const mysticalEvents = [];
        let karmaImpact = 0;
        // Price stability bonus - reduce volatility
        const stabilityReduction = 1 - modifiers.priceStabilityBonus;
        const marketVolatility = this.calculateMarketVolatility(asset);
        const stabilizedPrice = basePrice + (marketVolatility * stabilityReduction);
        if (Math.abs(stabilizedPrice - basePrice) > 0.01) {
            modifiedPrice = stabilizedPrice;
            karmaImpact += 2;
            consequences.push({
                userId,
                userLawfulChaotic: order.userId, // This should be a string value
                userGoodEvil: '0',
                userKarma: 0,
                userHouseId: null,
                consequenceType: 'price_stability',
                consequenceCategory: 'lawful_alignment',
                modifierValue: modifiers.priceStabilityBonus.toString(),
                modifierType: 'reduction',
                impactDescription: `Lawful alignment stabilizes price by ${(modifiers.priceStabilityBonus * 100).toFixed(1)}%`,
                mysticalFlavor: modifiers.mysticalFlavor,
                isTemporary: false,
                stacksWithOthers: true,
                consequenceApplied: true,
                resultingOutcome: 'success'
            });
            mysticalEvents.push("The cosmic order blesses your trade with divine stability");
        }
        // Order execution bonus - better fill rates
        if (order.orderType === 'limit') {
            const executionBonus = modifiers.orderExecutionBonus;
            karmaImpact += 1;
            consequences.push({
                userId,
                userLawfulChaotic: '25', // Lawful threshold
                userGoodEvil: '0',
                userKarma: 0,
                userHouseId: null,
                consequenceType: 'execution_enhancement',
                consequenceCategory: 'lawful_alignment',
                modifierValue: executionBonus.toString(),
                modifierType: 'improvement',
                impactDescription: `Lawful discipline improves order execution by ${(executionBonus * 100).toFixed(1)}%`,
                mysticalFlavor: "Divine order ensures precise trade execution",
                isTemporary: true,
                durationMinutes: 60,
                stacksWithOthers: true,
                consequenceApplied: true,
                resultingOutcome: 'success'
            });
            mysticalEvents.push("Celestial precision guides your order to perfect execution");
        }
        return { modifiedPrice, consequences, mysticalEvents, karmaImpact };
    }
    /**
     * Apply chaotic alignment consequences - volatility and unpredictability
     */
    async applyChaoticConsequences(userId, order, asset, basePrice) {
        const modifiers = this.ALIGNMENT_MODIFIERS.chaotic;
        let modifiedPrice = basePrice;
        const consequences = [];
        const mysticalEvents = [];
        let karmaImpact = 0;
        // Volatility multiplier - amplify price swings
        const volatilityMultiplier = modifiers.volatilityMultiplier;
        const marketMovement = (Math.random() - 0.5) * 0.1; // Random -5% to +5%
        const amplifiedMovement = marketMovement * volatilityMultiplier;
        modifiedPrice = basePrice * (1 + amplifiedMovement);
        const priceChange = ((modifiedPrice - basePrice) / basePrice) * 100;
        karmaImpact += Math.abs(priceChange) > 2 ? (priceChange > 0 ? 3 : -2) : 0;
        consequences.push({
            userId,
            userLawfulChaotic: '-25', // Chaotic threshold
            userGoodEvil: '0',
            userKarma: 0,
            userHouseId: null,
            consequenceType: 'volatility_amplification',
            consequenceCategory: 'chaotic_alignment',
            modifierValue: volatilityMultiplier.toString(),
            modifierType: 'multiplier',
            impactDescription: `Chaotic forces amplify price movement by ${(priceChange > 0 ? '+' : '')}${priceChange.toFixed(2)}%`,
            mysticalFlavor: modifiers.mysticalFlavor,
            isTemporary: false,
            stacksWithOthers: true,
            consequenceApplied: true,
            resultingOutcome: priceChange > 0 ? 'success' : 'challenge'
        });
        mysticalEvents.push(priceChange > 0
            ? "Chaotic winds carry your trade to unexpected fortune!"
            : "The storm of chaos brings challenging market turbulence");
        // Random opportunity bonus
        if (Math.random() < 0.15) { // 15% chance
            const opportunityBonus = modifiers.opportunityBonus;
            karmaImpact += 2;
            consequences.push({
                userId,
                userLawfulChaotic: '-25',
                userGoodEvil: '0',
                userKarma: 0,
                userHouseId: null,
                consequenceType: 'chaotic_opportunity',
                consequenceCategory: 'chaotic_alignment',
                modifierValue: opportunityBonus.toString(),
                modifierType: 'bonus',
                impactDescription: `Chaos reveals hidden trading opportunity (+${(opportunityBonus * 100).toFixed(1)}%)`,
                mysticalFlavor: "The unpredictable forces unveil a secret market opening",
                isTemporary: true,
                durationMinutes: 30,
                stacksWithOthers: false,
                consequenceApplied: true,
                resultingOutcome: 'success'
            });
            mysticalEvents.push("⚡ Chaotic energies tear open a rift to hidden opportunity!");
        }
        return { modifiedPrice, consequences, mysticalEvents, karmaImpact };
    }
    /**
     * Apply good alignment consequences - community benefits and protection
     */
    async applyGoodConsequences(userId, order, asset, basePrice) {
        const modifiers = this.ALIGNMENT_MODIFIERS.good;
        let modifiedPrice = basePrice;
        const consequences = [];
        const mysticalEvents = [];
        let karmaImpact = 2; // Good alignment always generates positive karma
        // Community trading bonus - benefits from social sentiment
        const communityBonus = modifiers.communityTradingBonus;
        const communityFactor = await this.calculateCommunityTradingSentiment(asset);
        if (communityFactor > 0.5) { // Positive community sentiment
            const bonusMultiplier = 1 + (communityBonus * communityFactor);
            modifiedPrice = basePrice * bonusMultiplier;
            consequences.push({
                userId,
                userLawfulChaotic: '0',
                userGoodEvil: '25', // Good threshold
                userKarma: 0,
                userHouseId: null,
                consequenceType: 'community_blessing',
                consequenceCategory: 'good_alignment',
                modifierValue: bonusMultiplier.toString(),
                modifierType: 'multiplier',
                impactDescription: `Community goodwill enhances your trade by ${((bonusMultiplier - 1) * 100).toFixed(1)}%`,
                mysticalFlavor: modifiers.mysticalFlavor,
                isTemporary: false,
                stacksWithOthers: true,
                consequenceApplied: true,
                resultingOutcome: 'success'
            });
            mysticalEvents.push("The collective positive energy of the community lifts your trade skyward");
        }
        // Protection from major losses
        const protectionThreshold = modifiers.protectionFromLosses;
        // Get current price from market data for comparison since asset doesn't have currentPrice directly
        const assetCurrentPrice = await this.getCurrentAssetPrice(asset.id);
        if (order.orderType === 'market' && assetCurrentPrice && basePrice < (assetCurrentPrice * 0.95)) { // Potential 5%+ loss
            const protectedPrice = basePrice * (1 + protectionThreshold);
            modifiedPrice = Math.min(modifiedPrice, protectedPrice);
            consequences.push({
                userId,
                userLawfulChaotic: '0',
                userGoodEvil: '25',
                userKarma: 0,
                userHouseId: null,
                consequenceType: 'divine_protection',
                consequenceCategory: 'good_alignment',
                modifierValue: protectionThreshold.toString(),
                modifierType: 'protection',
                impactDescription: `Divine protection shields you from ${(protectionThreshold * 100).toFixed(1)}% of potential losses`,
                mysticalFlavor: "Benevolent guardians shield you from market misfortune",
                isTemporary: false,
                stacksWithOthers: true,
                consequenceApplied: true,
                resultingOutcome: 'protection'
            });
            mysticalEvents.push("✨ Divine light forms a protective barrier around your trade");
        }
        return { modifiedPrice, consequences, mysticalEvents, karmaImpact };
    }
    /**
     * Apply evil alignment consequences - solitary power and aggressive gains
     */
    async applyEvilConsequences(userId, order, asset, basePrice) {
        const modifiers = this.ALIGNMENT_MODIFIERS.evil;
        let modifiedPrice = basePrice;
        const consequences = [];
        const mysticalEvents = [];
        let karmaImpact = -1; // Evil alignment tends to reduce karma
        // Solo trading bonus - better when going against the crowd
        const soloBonus = modifiers.soloTradingBonus;
        const marketSentiment = await this.calculateMarketSentiment(asset);
        const contrarian = this.isContrarianTrade(order, marketSentiment);
        if (contrarian) {
            const bonusMultiplier = 1 + soloBonus;
            modifiedPrice = basePrice * bonusMultiplier;
            karmaImpact -= 2; // Extra karma loss for going against the crowd
            consequences.push({
                userId,
                userLawfulChaotic: '0',
                userGoodEvil: '-25', // Evil threshold
                userKarma: 0,
                userHouseId: null,
                consequenceType: 'contrarian_power',
                consequenceCategory: 'evil_alignment',
                modifierValue: bonusMultiplier.toString(),
                modifierType: 'multiplier',
                impactDescription: `Dark ambition rewards your contrarian stance with ${((bonusMultiplier - 1) * 100).toFixed(1)}% bonus`,
                mysticalFlavor: modifiers.mysticalFlavor,
                isTemporary: false,
                stacksWithOthers: true,
                consequenceApplied: true,
                resultingOutcome: 'success'
            });
            mysticalEvents.push("🔥 Dark powers reward your ruthless independence");
        }
        // Aggressive trading bonus
        if (order.orderType === 'market' && parseFloat(order.quantity.toString()) > 100) {
            const aggressiveBonus = modifiers.aggressiveTradingBonus;
            const bonusMultiplier = 1 + aggressiveBonus;
            modifiedPrice = modifiedPrice * bonusMultiplier;
            karmaImpact -= 1;
            consequences.push({
                userId,
                userLawfulChaotic: '0',
                userGoodEvil: '-25',
                userKarma: 0,
                userHouseId: null,
                consequenceType: 'aggressive_dominance',
                consequenceCategory: 'evil_alignment',
                modifierValue: aggressiveBonus.toString(),
                modifierType: 'bonus',
                impactDescription: `Aggressive trading tactics yield ${(aggressiveBonus * 100).toFixed(1)}% dominance bonus`,
                mysticalFlavor: "Your ruthless aggression bends the market to your will",
                isTemporary: false,
                stacksWithOthers: true,
                consequenceApplied: true,
                resultingOutcome: 'success'
            });
            mysticalEvents.push("⚔️ Your trading aggression strikes fear into the market");
        }
        return { modifiedPrice, consequences, mysticalEvents, karmaImpact };
    }
    /**
     * Apply house-specific trading consequences
     */
    async applyHouseConsequences(userId, order, asset, basePrice, houseId) {
        let modifiedPrice = basePrice;
        const consequences = [];
        const mysticalEvents = [];
        let karmaImpact = 1; // House loyalty always gives some karma
        const houseEffects = this.HOUSE_TRADING_EFFECTS[houseId];
        if (!houseEffects) {
            return { modifiedPrice, consequences, mysticalEvents, karmaImpact };
        }
        // Check for asset-specific bonuses
        const assetCategory = this.categorizeAsset(asset);
        const houseBonus = this.getHouseAssetBonus(houseId, assetCategory);
        if (houseBonus > 0) {
            const bonusMultiplier = 1 + houseBonus;
            modifiedPrice = basePrice * bonusMultiplier;
            karmaImpact += 2;
            consequences.push({
                userId,
                userLawfulChaotic: '0',
                userGoodEvil: '0',
                userKarma: 0,
                userHouseId: houseId,
                consequenceType: 'house_specialization',
                consequenceCategory: 'house_alignment',
                modifierValue: houseBonus.toString(),
                modifierType: 'specialization_bonus',
                impactDescription: `House ${houseId} specialization grants ${(houseBonus * 100).toFixed(1)}% bonus on ${assetCategory} assets`,
                mysticalFlavor: houseEffects.mysticalDescription,
                isTemporary: false,
                stacksWithOthers: true,
                consequenceApplied: true,
                resultingOutcome: 'success'
            });
            mysticalEvents.push(`🏛️ Your house's ancient wisdom guides this ${assetCategory} trade to prosperity`);
        }
        return { modifiedPrice, consequences, mysticalEvents, karmaImpact };
    }
    /**
     * Apply karma-based consequences
     */
    async applyKarmaConsequences(userId, order, asset, basePrice, karma) {
        let modifiedPrice = basePrice;
        const consequences = [];
        const mysticalEvents = [];
        let karmaImpact = 0;
        // High positive karma benefits
        if (karma > 100) {
            const karmaBonus = Math.min(0.1, karma / 1000); // Max 10% bonus, scaling with karma
            const bonusMultiplier = 1 + karmaBonus;
            modifiedPrice = basePrice * bonusMultiplier;
            consequences.push({
                userId,
                userLawfulChaotic: '0',
                userGoodEvil: '0',
                userKarma: karma,
                userHouseId: null,
                consequenceType: 'karmic_blessing',
                consequenceCategory: 'karma_level',
                modifierValue: karmaBonus.toString(),
                modifierType: 'karma_bonus',
                impactDescription: `High karma (${karma}) blesses your trade with ${(karmaBonus * 100).toFixed(1)}% divine favor`,
                mysticalFlavor: "The accumulated goodness of your actions manifests as market fortune",
                isTemporary: false,
                stacksWithOthers: true,
                consequenceApplied: true,
                resultingOutcome: 'blessing'
            });
            mysticalEvents.push("✨ Your positive karma manifests as divine market favor");
        }
        // High negative karma penalties
        if (karma < -50) {
            const karmaPenalty = Math.max(-0.08, karma / 1000); // Max 8% penalty
            const penaltyMultiplier = 1 + karmaPenalty;
            modifiedPrice = basePrice * penaltyMultiplier;
            consequences.push({
                userId,
                userLawfulChaotic: '0',
                userGoodEvil: '0',
                userKarma: karma,
                userHouseId: null,
                consequenceType: 'karmic_burden',
                consequenceCategory: 'karma_level',
                modifierValue: karmaPenalty.toString(),
                modifierType: 'karma_penalty',
                impactDescription: `Negative karma (${karma}) burdens your trade with ${Math.abs(karmaPenalty * 100).toFixed(1)}% cosmic resistance`,
                mysticalFlavor: "The weight of past misdeeds creates turbulence in your trading path",
                isTemporary: false,
                stacksWithOthers: true,
                consequenceApplied: true,
                resultingOutcome: 'burden'
            });
            mysticalEvents.push("🌙 Dark karma manifests as market resistance against your trade");
        }
        return { modifiedPrice, consequences, mysticalEvents, karmaImpact };
    }
    /**
     * Record trading-related karma action
     */
    async recordTradingKarmaAction(userId, order, asset, karmaImpact, mysticalEvents) {
        const actionType = this.determineKarmaActionType(order, karmaImpact);
        const description = `Trading ${asset.name} - ${mysticalEvents.join(' | ')}`;
        await karmicAlignmentService_js_1.karmicAlignmentService.recordKarmaAction(userId, actionType, {
            assetId: asset.id,
            orderId: order.id,
            tradingVolume: parseFloat(order.quantity.toString()) * parseFloat(order.price?.toString() || '0'),
            customDescription: description
        });
    }
    // Helper methods
    calculateMarketVolatility(asset) {
        // Simplified volatility calculation
        return (Math.random() * 0.1) - 0.05; // -5% to +5%
    }
    async calculateCommunityTradingSentiment(asset) {
        // Simplified community sentiment calculation
        return Math.random(); // 0 to 1
    }
    async calculateMarketSentiment(asset) {
        // Simplified market sentiment
        const random = Math.random();
        if (random > 0.6)
            return 'bullish';
        if (random < 0.4)
            return 'bearish';
        return 'neutral';
    }
    isContrarianTrade(order, sentiment) {
        if (sentiment === 'neutral')
            return false;
        const isBuyOrder = order.side === 'buy';
        return (sentiment === 'bearish' && isBuyOrder) || (sentiment === 'bullish' && !isBuyOrder);
    }
    categorizeAsset(asset) {
        const title = asset.name.toLowerCase();
        const description = asset.description?.toLowerCase() || '';
        if (title.includes('hero') || title.includes('captain') || title.includes('wonder'))
            return 'character';
        if (title.includes('magic') || title.includes('spell') || title.includes('mystic'))
            return 'mystery';
        if (title.includes('empire') || title.includes('king') || title.includes('throne'))
            return 'power';
        if (title.includes('fire') || title.includes('water') || title.includes('earth') || title.includes('air'))
            return 'elemental';
        if (title.includes('ancient') || title.includes('time') || title.includes('eternal'))
            return 'temporal';
        if (title.includes('team') || title.includes('league') || title.includes('community'))
            return 'social';
        if (title.includes('knowledge') || title.includes('book') || title.includes('wisdom'))
            return 'educational';
        return 'general';
    }
    getHouseAssetBonus(houseId, assetCategory) {
        const bonusMap = {
            heroes: { character: 0.25, general: 0.05 },
            wisdom: { educational: 0.2, temporal: 0.15, general: 0.03 },
            power: { power: 0.16, general: 0.04 },
            mystery: { mystery: 0.22, general: 0.05 },
            elements: { elemental: 0.2, general: 0.08 },
            time: { temporal: 0.28, educational: 0.12, general: 0.06 },
            spirit: { social: 0.24, character: 0.1, general: 0.07 }
        };
        return bonusMap[houseId]?.[assetCategory] || 0;
    }
    determineKarmaActionType(order, karmaImpact) {
        if (order.orderType === 'market' && parseFloat(order.quantity.toString()) > 100) {
            return karmaImpact < 0 ? 'aggressive_trade' : 'calculated_investment';
        }
        if (order.orderType === 'limit') {
            return 'patient_trade';
        }
        return karmaImpact < 0 ? 'risky_speculation' : 'calculated_investment';
    }
    /**
     * Get current trading modifiers for user (for UI display)
     */
    async getCurrentTradingModifiers(userId) {
        const user = await db.select().from(schema_js_1.users).where((0, drizzle_orm_1.eq)(schema_js_1.users.id, userId)).limit(1);
        if (!user[0]) {
            throw new Error('User not found');
        }
        const activeConsequences = await karmicAlignmentService_js_1.karmicAlignmentService.getActiveTradingConsequences(userId);
        // Calculate current theoretical effects
        const currentUser = user[0];
        const lawfulChaotic = parseFloat(currentUser.lawfulChaoticAlignment || '0');
        const goodEvil = parseFloat(currentUser.goodEvilAlignment || '0');
        const karma = currentUser.karma || 0;
        const alignmentEffects = {
            lawful: lawfulChaotic > 25 ? this.ALIGNMENT_MODIFIERS.lawful : null,
            chaotic: lawfulChaotic < -25 ? this.ALIGNMENT_MODIFIERS.chaotic : null,
            good: goodEvil > 25 ? this.ALIGNMENT_MODIFIERS.good : null,
            evil: goodEvil < -25 ? this.ALIGNMENT_MODIFIERS.evil : null
        };
        const houseEffects = currentUser.houseId ?
            this.HOUSE_TRADING_EFFECTS[currentUser.houseId] : null;
        const karmaEffects = {
            blessing: karma > 100 ? Math.min(0.1, karma / 1000) : 0,
            burden: karma < -50 ? Math.max(-0.08, karma / 1000) : 0
        };
        return {
            activeModifiers: activeConsequences,
            alignmentEffects,
            houseEffects,
            karmaEffects
        };
    }
}
exports.TradingConsequencesService = TradingConsequencesService;
// Export singleton instance
exports.tradingConsequencesService = new TradingConsequencesService();
