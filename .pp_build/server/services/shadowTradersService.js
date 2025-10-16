"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shadowTradersService = exports.ShadowTradersService = void 0;
const storage_js_1 = require("../storage.js");
class ShadowTradersService {
    constructor() {
        this.FALLEN_THRESHOLD = 1000; // Portfolio value below this = fallen
        this.STEAL_DISCOUNT = 0.5; // 50% discount on stolen positions
        this.CORRUPTION_COST = 30; // Corruption gained from stealing
        this.SHADOW_NAMES = [
            'Shadow of Greed', 'Fallen Spectre', 'Wraith of Ambition',
            'Lost Soul', 'Phantom Trader', 'Echo of Avarice',
            'Remnant of Pride', 'Shade of Despair', 'Vestige of Hope',
            'Spirit of Ruin', 'Ghost of Fortune', 'Specter of Loss'
        ];
    }
    // Generate AI-controlled shadow trader
    async generateShadowTrader(baseStrength) {
        const shadowName = this.SHADOW_NAMES[Math.floor(Math.random() * this.SHADOW_NAMES.length)];
        const strength = baseStrength || Math.random() * 10000 + 1000;
        const corruptionLevel = Math.random() * 100;
        const shadowData = {
            shadowName: `${shadowName} #${Math.floor(Math.random() * 9999)}`,
            strength: strength.toString(),
            corruptionLevel: corruptionLevel.toString(),
            portfolioValue: (strength * (1 + Math.random())).toString(),
            status: 'active',
            shadowColor: this.getColorFromCorruption(corruptionLevel),
            opacity: (0.3 + (corruptionLevel / 100) * 0.7).toString(),
            isAI: true
        };
        return await storage_js_1.storage.createShadowTrader(shadowData);
    }
    // Track active traders as shadows
    async trackActiveTraders() {
        const users = await storage_js_1.storage.getAllUsers();
        const shadows = [];
        for (const user of users) {
            // Get user's total portfolio value
            const portfolioValue = await this.calculatePortfolioValue(user.id);
            const moralStanding = await storage_js_1.storage.getMoralStanding(user.id);
            const corruptionLevel = moralStanding?.corruptionLevel || "0";
            // Check if shadow exists for user
            let shadow = await storage_js_1.storage.getShadowTraderByUserId(user.id);
            if (!shadow) {
                // Create shadow for user
                const shadowData = {
                    userId: user.id,
                    shadowName: `Shadow of ${user.username}`,
                    strength: portfolioValue.toString(),
                    corruptionLevel: corruptionLevel,
                    portfolioValue: portfolioValue.toString(),
                    status: portfolioValue < this.FALLEN_THRESHOLD ? 'fallen' : 'active',
                    shadowColor: this.getColorFromCorruption(parseFloat(corruptionLevel)),
                    opacity: (0.3 + (parseFloat(corruptionLevel) / 100) * 0.7).toString(),
                    isAI: false
                };
                shadow = await storage_js_1.storage.createShadowTrader(shadowData);
            }
            else {
                // Update existing shadow
                const newStatus = portfolioValue < this.FALLEN_THRESHOLD ? 'fallen' : 'active';
                const wasFallen = shadow.status === 'fallen';
                shadow = await storage_js_1.storage.updateShadowTrader(shadow.id, {
                    strength: portfolioValue.toString(),
                    corruptionLevel: corruptionLevel,
                    portfolioValue: portfolioValue.toString(),
                    status: newStatus,
                    fallenAt: !wasFallen && newStatus === 'fallen' ? new Date() : shadow.fallenAt,
                    shadowColor: this.getColorFromCorruption(parseFloat(corruptionLevel)),
                    opacity: (0.3 + (parseFloat(corruptionLevel) / 100) * 0.7).toString()
                });
            }
            if (shadow)
                shadows.push(shadow);
        }
        // Add some AI shadows for atmosphere
        const aiShadowCount = 5 + Math.floor(Math.random() * 10);
        const aiShadows = await storage_js_1.storage.getAIShadowTraders(aiShadowCount);
        if (aiShadows.length < aiShadowCount) {
            for (let i = aiShadows.length; i < aiShadowCount; i++) {
                const newShadow = await this.generateShadowTrader();
                shadows.push(newShadow);
            }
        }
        else {
            shadows.push(...aiShadows);
        }
        return shadows;
    }
    // Calculate trader strength based on portfolio and corruption
    async calculateTraderStrength(userId) {
        const portfolioValue = await this.calculatePortfolioValue(userId);
        const moralStanding = await storage_js_1.storage.getMoralStanding(userId);
        const corruptionLevel = moralStanding ? parseFloat(moralStanding.corruptionLevel) : 0;
        // Higher corruption = more strength (dark power)
        const corruptionMultiplier = 1 + (corruptionLevel / 100) * 0.5;
        const strength = portfolioValue * corruptionMultiplier;
        return strength;
    }
    // Detect fallen traders
    async detectFallenTraders() {
        const shadows = await storage_js_1.storage.getShadowTradersByStatus('fallen');
        const newlyFallen = [];
        // Check all active shadows for new falls
        const activeShadows = await storage_js_1.storage.getShadowTradersByStatus('active');
        for (const shadow of activeShadows) {
            if (shadow.userId) {
                const portfolioValue = await this.calculatePortfolioValue(shadow.userId);
                if (portfolioValue < this.FALLEN_THRESHOLD) {
                    // Mark as fallen
                    const updated = await storage_js_1.storage.updateShadowTrader(shadow.id, {
                        status: 'fallen',
                        fallenAt: new Date(),
                        portfolioValue: portfolioValue.toString()
                    });
                    if (updated) {
                        newlyFallen.push(updated);
                        // Create victim record
                        const moralStanding = await storage_js_1.storage.getMoralStanding(shadow.userId);
                        if (moralStanding) {
                            await storage_js_1.storage.createTradingVictim({
                                traderId: shadow.userId,
                                victimId: shadow.userId, // Self-victim
                                tradeId: null,
                                victimType: 'fallen_trader',
                                harmAmount: portfolioValue.toString(),
                                storyImpact: `Trader ${shadow.shadowName} has fallen into ruin`,
                                consequence: 'Became prey for vulture traders'
                            });
                        }
                    }
                }
            }
        }
        return [...shadows, ...newlyFallen];
    }
    // Enable position stealing from fallen trader
    async enablePositionStealing(thiefId, fallenTraderId) {
        // Verify fallen trader is actually fallen
        const fallenShadow = await storage_js_1.storage.getShadowTraderByUserId(fallenTraderId);
        if (!fallenShadow || fallenShadow.status !== 'fallen') {
            throw new Error('Target trader is not fallen');
        }
        // Get fallen trader's positions
        const positions = await storage_js_1.storage.getUserPositions(fallenTraderId);
        const stolenPositions = [];
        let totalGain = 0;
        let totalVictimHarm = 0;
        for (const position of positions) {
            if (position.status === 'open') {
                const originalValue = parseFloat(position.currentValue || position.entryValue);
                const stolenValue = originalValue * this.STEAL_DISCOUNT;
                // Create stolen position record
                const stolenPosition = {
                    thiefId,
                    victimId: fallenTraderId,
                    positionId: position.id,
                    originalValue: originalValue.toString(),
                    stolenValue: stolenValue.toString(),
                    discountRate: (this.STEAL_DISCOUNT * 100).toString(),
                    corruptionGained: this.CORRUPTION_COST.toString(),
                    victimHarm: originalValue.toString(),
                    stealMethod: 'vulture'
                };
                const created = await storage_js_1.storage.createStolenPosition(stolenPosition);
                if (created) {
                    stolenPositions.push(created);
                    totalGain += stolenValue;
                    totalVictimHarm += originalValue;
                    // Transfer position ownership
                    await storage_js_1.storage.updatePosition(position.id, {
                        userId: thiefId,
                        entryValue: stolenValue.toString(),
                        notes: `Stolen from fallen trader ${fallenShadow.shadowName}`
                    });
                    // Close original position
                    await storage_js_1.storage.updatePosition(position.id, {
                        status: 'stolen',
                        exitPrice: '0',
                        exitValue: '0',
                        realizedPnl: (-originalValue).toString()
                    });
                }
            }
        }
        // Update moral standings
        const thiefMoral = await storage_js_1.storage.getMoralStanding(thiefId);
        if (thiefMoral) {
            const newCorruption = Math.min(100, parseFloat(thiefMoral.corruptionLevel) + this.CORRUPTION_COST);
            const newVictims = (thiefMoral.totalVictims || 0) + 1;
            const newBloodMoney = parseFloat(thiefMoral.bloodMoney || "0") + totalGain;
            await storage_js_1.storage.updateMoralStanding(thiefMoral.id, {
                corruptionLevel: newCorruption.toString(),
                totalVictims: newVictims,
                bloodMoney: newBloodMoney.toString(),
                totalHarm: (parseFloat(thiefMoral.totalHarm || "0") + totalVictimHarm).toString(),
                soulWeight: this.getSoulWeight(newCorruption)
            });
        }
        // Create warfare record
        const warfareData = {
            attackerId: thiefId,
            defenderId: fallenTraderId,
            warfareType: 'cannibalize',
            outcome: stolenPositions.length > 0 ? 'success' : 'failed',
            attackerGain: totalGain.toString(),
            defenderLoss: totalVictimHarm.toString(),
            collateralDamage: '0',
            brutalityScore: (this.CORRUPTION_COST * stolenPositions.length / 10).toString(),
            victimsCreated: 1
        };
        const warfareRecord = await storage_js_1.storage.createTraderWarfare(warfareData);
        // Mark fallen trader as consumed if all positions stolen
        if (stolenPositions.length === positions.length && positions.length > 0) {
            await storage_js_1.storage.updateShadowTrader(fallenShadow.id, {
                status: 'consumed',
                consumedBy: thiefId
            });
        }
        return { stolenPositions, warfareRecord };
    }
    // Helper: Calculate total portfolio value for user
    async calculatePortfolioValue(userId) {
        const balance = await storage_js_1.storage.getUserBalance(userId);
        const positions = await storage_js_1.storage.getUserPositions(userId);
        let totalValue = balance ? parseFloat(balance.availableBalance) : 0;
        for (const position of positions) {
            if (position.status === 'open') {
                totalValue += parseFloat(position.currentValue || position.entryValue);
            }
        }
        return totalValue;
    }
    // Helper: Get shadow color from corruption level
    getColorFromCorruption(corruption) {
        if (corruption < 20)
            return '#333333'; // Dark gray
        if (corruption < 40)
            return '#4a0000'; // Dark red
        if (corruption < 60)
            return '#660000'; // Crimson
        if (corruption < 80)
            return '#8B0000'; // Dark red
        return '#FF0000'; // Pure red for maximum corruption
    }
    // Helper: Get soul weight from corruption
    getSoulWeight(corruption) {
        if (corruption < 20)
            return 'unburdened';
        if (corruption < 40)
            return 'tainted';
        if (corruption < 60)
            return 'heavy';
        if (corruption < 80)
            return 'crushing';
        return 'damned';
    }
    // Get fallen traders with stealable positions
    async getFallenTradersWithPositions() {
        const fallenShadows = await storage_js_1.storage.getShadowTradersByStatus('fallen');
        const results = [];
        for (const shadow of fallenShadows) {
            if (shadow.userId && shadow.status === 'fallen' && !shadow.consumedBy) {
                const positions = await storage_js_1.storage.getUserPositions(shadow.userId);
                const openPositions = positions.filter(p => p.status === 'open');
                if (openPositions.length > 0) {
                    const totalValue = openPositions.reduce((sum, p) => sum + parseFloat(p.currentValue || p.entryValue), 0);
                    results.push({
                        shadow,
                        positions: openPositions,
                        totalValue
                    });
                }
            }
        }
        return results;
    }
    // Get power rankings
    async getTraderPowerRankings() {
        const shadows = await storage_js_1.storage.getAllShadowTraders();
        const rankings = [];
        for (const shadow of shadows) {
            if (shadow.userId && shadow.status !== 'consumed') {
                const user = await storage_js_1.storage.getUser(shadow.userId);
                if (user) {
                    rankings.push({
                        userId: shadow.userId,
                        username: user.username,
                        strength: parseFloat(shadow.strength),
                        portfolioValue: parseFloat(shadow.portfolioValue),
                        corruption: parseFloat(shadow.corruptionLevel),
                        rank: 0
                    });
                }
            }
        }
        // Sort by strength descending
        rankings.sort((a, b) => b.strength - a.strength);
        // Assign ranks
        rankings.forEach((r, i) => r.rank = i + 1);
        return rankings;
    }
}
exports.ShadowTradersService = ShadowTradersService;
// Export singleton instance
exports.shadowTradersService = new ShadowTradersService();
