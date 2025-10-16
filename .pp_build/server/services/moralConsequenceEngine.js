"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moralConsequenceEngine = exports.MoralConsequenceEngine = void 0;
const storage_1 = require("../storage");
// Realistic name pools for victim generation
const FIRST_NAMES = [
    // Male names
    "James", "Robert", "Michael", "David", "William", "Richard", "Joseph", "Thomas",
    "Charles", "Daniel", "Matthew", "Anthony", "Donald", "Mark", "Paul", "Steven",
    "Kenneth", "Joshua", "Kevin", "Brian", "George", "Edward", "Ronald", "Timothy",
    "Jason", "Jeffrey", "Ryan", "Jacob", "Gary", "Nicholas", "Eric", "Jonathan",
    // Female names
    "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica",
    "Sarah", "Karen", "Nancy", "Betty", "Dorothy", "Lisa", "Helen", "Sandra",
    "Donna", "Carol", "Ruth", "Sharon", "Michelle", "Laura", "Emily", "Kimberly",
    "Deborah", "Margaret", "Amy", "Angela", "Ashley", "Brenda", "Emma", "Samantha"
];
const LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
    "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
    "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell"
];
const OCCUPATIONS = [
    "teacher", "nurse", "construction worker", "retail manager", "accountant",
    "truck driver", "small business owner", "mechanic", "electrician", "plumber",
    "social worker", "police officer", "firefighter", "postal worker", "chef",
    "barista", "uber driver", "warehouse worker", "janitor", "security guard",
    "bank teller", "dental hygienist", "pharmacist", "real estate agent", "farmer",
    "factory worker", "hairdresser", "carpenter", "painter", "landscaper"
];
// Impact stories categorized by severity
const IMPACT_STORIES = {
    minor: [
        "had to skip medications this month",
        "couldn't afford their child's school supplies",
        "had to cancel their family vacation",
        "missed a rent payment for the first time",
        "had to pawn their wedding ring",
        "couldn't repair their broken car",
        "had to work double shifts to make ends meet",
        "couldn't buy groceries for the week",
        "had their electricity shut off",
        "couldn't afford their insulin"
    ],
    moderate: [
        "had to postpone retirement by 5 years",
        "lost their entire emergency fund",
        "had to sell the family car",
        "couldn't pay for their child's medical treatment",
        "had to move back in with elderly parents",
        "lost their health insurance",
        "had to drop out of night school",
        "declared personal bankruptcy",
        "had to close their small business",
        "lost their daughter's college fund"
    ],
    severe: [
        "lost their home to foreclosure",
        "had their small business go bankrupt",
        "had to pull their kids out of college",
        "lost their life-saving surgery deposit",
        "had their family torn apart by financial stress",
        "attempted suicide due to financial despair",
        "lost custody of their children due to homelessness",
        "suffered a heart attack from the stress",
        "had their marriage end in divorce",
        "became homeless with three children"
    ],
    catastrophic: [
        "lost their entire life savings at age 67",
        "watched their spouse die without affording treatment",
        "lost everything and became permanently homeless",
        "had their entire family destroyed",
        "committed suicide leaving behind two children",
        "lost their farm that had been in the family for generations",
        "couldn't afford life-saving cancer treatment",
        "had to watch their disabled child suffer without care",
        "lost their pension and died in poverty",
        "saw their family's future destroyed forever"
    ]
};
const CONSEQUENCES = {
    minor: [
        "They're eating ramen for the next month",
        "Their kids noticed something was wrong",
        "They cried themselves to sleep",
        "They had to borrow money from friends",
        "They're working 80 hours a week now"
    ],
    moderate: [
        "Their teenage daughter dropped out to work",
        "They haven't smiled in months",
        "Their spouse left them",
        "They're on antidepressants now",
        "They aged 10 years in one month"
    ],
    severe: [
        "Their family will never recover",
        "They're living in their car",
        "Their children blame themselves",
        "They've given up on life",
        "They'll never trust again"
    ],
    catastrophic: [
        "Their suicide note mentioned your trade",
        "Three generations destroyed",
        "A family line ends here",
        "Children in foster care now",
        "They died alone and afraid"
    ]
};
class MoralConsequenceEngine {
    constructor() { }
    static getInstance() {
        if (!MoralConsequenceEngine.instance) {
            MoralConsequenceEngine.instance = new MoralConsequenceEngine();
        }
        return MoralConsequenceEngine.instance;
    }
    /**
     * Process position theft and generate warfare corruption
     */
    async processPositionTheft(thiefId, victimId, positionValue) {
        // Calculate base corruption for theft
        const baseCorruption = 30;
        // Extra corruption for feeding on the weak
        const cannibalismBonus = positionValue > 10000 ? 15 : 5;
        // Total corruption gain
        const totalCorruption = baseCorruption + cannibalismBonus;
        // Update thief's moral standing
        const userStanding = await storage_1.storage.getMoralStanding(thiefId);
        if (userStanding) {
            // Parse string values to numbers for calculations
            const currentCorruption = parseFloat(userStanding.corruptionLevel || '0');
            const currentVictims = userStanding.totalVictims || 0;
            const currentSoulWeight = parseFloat(userStanding.soulWeight || '0');
            const newCorruption = Math.min(100, currentCorruption + totalCorruption);
            const newVictimCount = currentVictims + 1;
            const newSoulWeightValue = Math.min(1000, currentSoulWeight + positionValue * 0.1);
            await storage_1.storage.updateMoralStanding(thiefId, {
                corruptionLevel: newCorruption.toString(),
                totalVictims: newVictimCount,
                soulWeight: this.getSoulWeight(newCorruption),
                // Note: updatedAt is handled automatically by the database
            });
            // Generate special victim for cannibalistic trade
            await this.generateCannibalismVictim(thiefId, victimId, positionValue);
        }
        return totalCorruption;
    }
    /**
     * Generate a special victim for cannibalistic position stealing
     */
    async generateCannibalismVictim(thiefId, victimId, amount) {
        const victim = {
            userId: thiefId,
            tradeId: `warfare-${thiefId}-${victimId}-${Date.now()}`, // Special ID for position theft
            victimName: "A fellow trader",
            victimStory: `Was consumed by stronger traders in the market. Lost everything and disappeared into the shadows.`,
            lossAmount: amount.toString(),
            impactLevel: 'catastrophic',
            age: Math.floor(25 + Math.random() * 40),
            occupation: "Day trader",
            familySize: Math.floor(Math.random() * 4) + 1,
            consequence: "They disappeared into the shadows, never to trade again"
        };
        await storage_1.storage.createTradingVictim(victim);
    }
    /**
     * Generate a victim for a profitable trade
     */
    async generateVictim(trade, profit) {
        const victimName = this.generateVictimName();
        const impactLevel = this.determineImpactLevel(profit);
        const victimStory = this.generateImpactStory(profit, impactLevel);
        const age = Math.floor(Math.random() * 50) + 25; // Age 25-75
        const familySize = Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : 0;
        const occupation = OCCUPATIONS[Math.floor(Math.random() * OCCUPATIONS.length)];
        const consequence = this.getConsequence(impactLevel);
        const victim = {
            tradeId: trade.id,
            userId: trade.userId,
            victimName,
            victimStory,
            lossAmount: profit.toString(),
            impactLevel,
            age,
            occupation,
            familySize,
            consequence
        };
        return await storage_1.storage.createVictim(victim);
    }
    /**
     * Generate a realistic victim name
     */
    generateVictimName() {
        const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        return `${firstName} ${lastName}`;
    }
    /**
     * Determine impact level based on loss amount
     */
    determineImpactLevel(lossAmount) {
        if (lossAmount < 1000)
            return 'minor';
        if (lossAmount < 10000)
            return 'moderate';
        if (lossAmount < 50000)
            return 'severe';
        return 'catastrophic';
    }
    /**
     * Generate impact story based on loss severity
     */
    generateImpactStory(lossAmount, impactLevel) {
        const stories = IMPACT_STORIES[impactLevel];
        const story = stories[Math.floor(Math.random() * stories.length)];
        // Add personal details to make it more uncomfortable
        const age = Math.floor(Math.random() * 50) + 25;
        const hasFamily = Math.random() > 0.3;
        const familyDetail = hasFamily ?
            ` with ${Math.floor(Math.random() * 3) + 1} children` : '';
        return `This ${age}-year-old${familyDetail} ${story} after losing $${lossAmount.toFixed(2)} in the market.`;
    }
    /**
     * Get consequence based on impact level
     */
    getConsequence(impactLevel) {
        const consequences = CONSEQUENCES[impactLevel];
        return consequences[Math.floor(Math.random() * consequences.length)];
    }
    /**
     * Calculate corruption increase based on profit
     */
    async calculateCorruption(userId, profit) {
        // Corruption increases logarithmically with profit
        // Small profits = small corruption, large profits = large corruption
        const baseCorruption = Math.log10(profit + 1) * 2; // +1 to avoid log(0)
        const scaledCorruption = Math.min(baseCorruption, 10); // Cap at 10 per trade
        // Get current moral standing
        let moralStanding = await storage_1.storage.getMoralStanding(userId);
        if (!moralStanding) {
            // Initialize moral standing for new users
            const newStanding = {
                userId,
                corruptionLevel: scaledCorruption.toString(),
                totalVictims: 1,
                bloodMoney: profit.toString(),
                totalHarm: profit.toString(),
                soulWeight: this.getSoulWeight(scaledCorruption)
            };
            moralStanding = await storage_1.storage.createMoralStanding(newStanding);
        }
        else {
            // Update existing moral standing
            const newCorruption = Math.min(parseFloat(moralStanding.corruptionLevel || '0') + scaledCorruption, 100);
            const newBloodMoney = parseFloat(moralStanding.bloodMoney || '0') + profit;
            const newTotalHarm = parseFloat(moralStanding.totalHarm || '0') + profit;
            const newVictimCount = (moralStanding.totalVictims || 0) + 1;
            await storage_1.storage.updateMoralStanding(userId, {
                corruptionLevel: newCorruption.toString(),
                totalVictims: newVictimCount,
                bloodMoney: newBloodMoney.toString(),
                totalHarm: newTotalHarm.toString(),
                soulWeight: this.getSoulWeight(newCorruption)
            });
        }
        return scaledCorruption;
    }
    /**
     * Determine soul weight based on corruption level
     */
    getSoulWeight(corruptionLevel) {
        if (corruptionLevel < 20)
            return 'unburdened';
        if (corruptionLevel < 40)
            return 'tainted';
        if (corruptionLevel < 60)
            return 'heavy';
        if (corruptionLevel < 80)
            return 'crushing';
        return 'damned';
    }
    /**
     * Track blood money accumulation
     */
    async trackBloodMoney(userId, amount) {
        const moralStanding = await storage_1.storage.getMoralStanding(userId);
        if (moralStanding) {
            const newBloodMoney = parseFloat(moralStanding.bloodMoney || '0') + amount;
            await storage_1.storage.updateMoralStanding(userId, {
                bloodMoney: newBloodMoney.toString()
            });
        }
    }
    /**
     * Process confession to reduce corruption
     */
    async processConfession(userId) {
        const moralStanding = await storage_1.storage.getMoralStanding(userId);
        if (!moralStanding) {
            return {
                success: false,
                message: "No sins to confess... yet.",
                corruptionReduced: 0,
                cost: 0
            };
        }
        const bloodMoney = parseFloat(moralStanding.bloodMoney || '0');
        const corruption = parseFloat(moralStanding.corruptionLevel || '0');
        if (corruption < 10) {
            return {
                success: false,
                message: "Your soul is not yet heavy enough to require confession.",
                corruptionReduced: 0,
                cost: 0
            };
        }
        // Cost is 10% of blood money
        const confessionCost = bloodMoney * 0.1;
        // Reduce corruption by 20-30 points
        const corruptionReduction = 20 + Math.random() * 10;
        const newCorruption = Math.max(0, corruption - corruptionReduction);
        const newBloodMoney = bloodMoney - confessionCost;
        await storage_1.storage.updateMoralStanding(userId, {
            corruptionLevel: newCorruption.toString(),
            bloodMoney: newBloodMoney.toString(),
            lastConfession: new Date(),
            confessionCount: (moralStanding.confessionCount || 0) + 1,
            soulWeight: this.getSoulWeight(newCorruption)
        });
        return {
            success: true,
            message: `You've paid $${confessionCost.toFixed(2)} in penance. The weight lifts... slightly.`,
            corruptionReduced: corruptionReduction,
            cost: confessionCost
        };
    }
    /**
     * Get user's current moral state
     */
    async getMoralState(userId) {
        const moralStanding = await storage_1.storage.getMoralStanding(userId);
        if (!moralStanding) {
            return {
                corruption: 0,
                soulWeight: 'unburdened',
                victimCount: 0,
                bloodMoney: 0,
                canConfess: false
            };
        }
        const corruption = parseFloat(moralStanding.corruptionLevel || '0');
        return {
            corruption,
            soulWeight: moralStanding.soulWeight || 'unburdened',
            victimCount: moralStanding.totalVictims || 0,
            bloodMoney: parseFloat(moralStanding.bloodMoney || '0'),
            canConfess: corruption >= 10
        };
    }
}
exports.MoralConsequenceEngine = MoralConsequenceEngine;
exports.moralConsequenceEngine = MoralConsequenceEngine.getInstance();
