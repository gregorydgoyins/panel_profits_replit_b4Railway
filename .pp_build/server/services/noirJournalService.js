"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noirJournalService = exports.NoirJournalService = void 0;
const openai_1 = __importDefault(require("openai"));
const storage_1 = require("../storage");
class NoirJournalService {
    constructor() {
        // Initialize OpenAI with the newest model - gpt-5 (released August 7, 2025)
        // Note: gpt-5 is the newest model as of August 2025, replacing gpt-4
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    static getInstance() {
        if (!NoirJournalService.instance) {
            NoirJournalService.instance = new NoirJournalService();
        }
        return NoirJournalService.instance;
    }
    /**
     * Generate a noir-style journal entry for a trade
     * Uses gpt-5 model (newest as of August 7, 2025)
     * No temperature parameter for gpt-5 as per requirements
     */
    async generateNoirEntry(context) {
        try {
            const { trade, victim, corruptionLevel, userId } = context;
            // Craft the noir prompt based on corruption level
            const prompt = this.buildNoirPrompt(context);
            // Call OpenAI with gpt-5 model (newest as of August 7, 2025)
            // Note: Not using temperature parameter with gpt-5
            const response = await this.openai.chat.completions.create({
                model: 'gpt-5', // Using newest model (released August 7, 2025)
                messages: [
                    {
                        role: 'system',
                        content: `You are a noir fiction writer channeling Raymond Chandler and James Ellroy. 
                     Write dark, observational journal entries about trading. 
                     Never moralize or preach. Just observe the darkness.
                     The trader's corruption level is ${corruptionLevel}%.
                     Style: Film noir meets financial horror.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" },
                // Note: Not using temperature with gpt-5 as per requirements
            });
            const result = JSON.parse(response.choices[0].message.content || '{}');
            // Store the journal entry
            const entry = {
                userId,
                entryType: this.determineEntryType(context),
                content: result.content,
                title: result.title,
                corruptionAtTime: corruptionLevel.toString(),
                relatedTradeId: trade?.id,
                relatedVictimId: victim?.id,
                mood: result.mood,
                intensity: result.intensity,
                wordCount: result.content.split(' ').length,
            };
            return await storage_1.storage.createJournalEntry(entry);
        }
        catch (error) {
            console.error('Failed to generate noir entry:', error);
            throw error;
        }
    }
    /**
     * Analyze trader psychology over time
     * Uses gpt-5 for deep psychological analysis
     */
    async analyzeTraderPsychology(userId, tradingHistory, victims, moralStanding) {
        try {
            // Prepare analysis context
            const totalProfit = tradingHistory.reduce((sum, t) => sum + parseFloat(t.pnl || '0'), 0);
            const victimCount = victims.length;
            const corruptionLevel = parseFloat(moralStanding.corruptionLevel);
            const prompt = `Analyze the psychology of a trader with the following profile:
        - Total trades: ${tradingHistory.length}
        - Profitable trades: ${tradingHistory.filter(t => parseFloat(t.pnl || '0') > 0).length}
        - Total profit: $${totalProfit.toFixed(2)}
        - Victims created: ${victimCount}
        - Corruption level: ${corruptionLevel}%
        - Blood money accumulated: $${moralStanding.bloodMoney}
        
        Write like a noir detective's psychological case file.
        Focus on patterns of behavior, moral descent, denial mechanisms.
        Dark and observational. No judgment, just cold analysis.
        
        Return as JSON with: pattern, analysis, dominantTraits[], moralAlignment, 
        tradingStyle, empathyScore(0-100), ruthlessnessIndex(0-100), denialLevel(0-100), turningPoints[]`;
            // Using gpt-5 model (newest as of August 7, 2025)
            const response = await this.openai.chat.completions.create({
                model: 'gpt-5', // Newest model (released August 7, 2025)
                messages: [
                    {
                        role: 'system',
                        content: 'You are a psychological profiler writing noir-style case notes. Analyze trading behavior patterns with cold, clinical precision.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" },
                // No temperature parameter for gpt-5
            });
            const analysis = JSON.parse(response.choices[0].message.content || '{}');
            // Check if profile exists
            const existingProfile = await storage_1.storage.getPsychologicalProfile(userId);
            if (existingProfile) {
                // Update existing profile
                return await storage_1.storage.updatePsychologicalProfile(userId, {
                    pattern: analysis.pattern,
                    analysis: analysis.analysis,
                    dominantTraits: analysis.dominantTraits,
                    moralAlignment: analysis.moralAlignment,
                    tradingStyle: analysis.tradingStyle,
                    empathyScore: analysis.empathyScore.toString(),
                    ruthlessnessIndex: analysis.ruthlessnessIndex.toString(),
                    denialLevel: analysis.denialLevel.toString(),
                    previousProfile: existingProfile.analysis,
                    turningPoints: analysis.turningPoints,
                }) || existingProfile;
            }
            else {
                // Create new profile
                const profileData = {
                    userId,
                    pattern: analysis.pattern,
                    analysis: analysis.analysis,
                    dominantTraits: analysis.dominantTraits,
                    moralAlignment: analysis.moralAlignment,
                    tradingStyle: analysis.tradingStyle,
                    empathyScore: analysis.empathyScore.toString(),
                    ruthlessnessIndex: analysis.ruthlessnessIndex.toString(),
                    denialLevel: analysis.denialLevel.toString(),
                    turningPoints: analysis.turningPoints,
                };
                return await storage_1.storage.createPsychologicalProfile(profileData);
            }
        }
        catch (error) {
            console.error('Failed to analyze trader psychology:', error);
            throw error;
        }
    }
    /**
     * Write a corruption milestone narrative
     */
    async writeCorruptionNarrative(userId, corruptionLevel, milestone) {
        try {
            const prompt = `The trader has reached ${milestone}% corruption (current: ${corruptionLevel}%).
        Write a noir journal entry marking this descent into darkness.
        Style: Raymond Chandler's darkest moments.
        Focus on the weight of accumulated sins, the faces of victims.
        ${corruptionLevel >= 80 ? 'The soul is nearly lost. Write accordingly.' : ''}
        ${corruptionLevel === 100 ? 'Complete damnation achieved. No redemption remains.' : ''}
        
        Keep it under 150 words. Return as JSON with: content, title, mood, intensity(1-10)`;
            // Using gpt-5 (newest model as of August 7, 2025)
            const response = await this.openai.chat.completions.create({
                model: 'gpt-5',
                messages: [
                    {
                        role: 'system',
                        content: 'You are writing the darkest noir fiction about moral decay in trading.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" },
            });
            const result = JSON.parse(response.choices[0].message.content || '{}');
            const entry = {
                userId,
                entryType: 'milestone',
                content: result.content,
                title: result.title || `${milestone}% Corrupted`,
                corruptionAtTime: corruptionLevel.toString(),
                mood: result.mood,
                intensity: result.intensity,
                wordCount: result.content.split(' ').length,
            };
            return await storage_1.storage.createJournalEntry(entry);
        }
        catch (error) {
            console.error('Failed to write corruption narrative:', error);
            throw error;
        }
    }
    /**
     * Generate daily summary in noir style
     */
    async generateDailySummary(userId, dailyTrades, dailyVictims, corruptionLevel) {
        try {
            const profits = dailyTrades.filter(t => parseFloat(t.pnl || '0') > 0);
            const losses = dailyTrades.filter(t => parseFloat(t.pnl || '0') < 0);
            const totalProfit = dailyTrades.reduce((sum, t) => sum + parseFloat(t.pnl || '0'), 0);
            const prompt = `Daily trading summary:
        - Trades executed: ${dailyTrades.length}
        - Profits taken: ${profits.length} trades, creating ${dailyVictims.length} victims
        - Losses suffered: ${losses.length} trades (the market's justice)
        - Net result: $${totalProfit.toFixed(2)}
        - Corruption level: ${corruptionLevel}%
        
        ${dailyVictims.length > 0 ? `Today's victims: ${dailyVictims.map(v => v.victimName).join(', ')}` : 'No new blood today.'}
        
        Write a noir daily journal entry. Like a confession that isn't really a confession.
        Under 100 words. Return as JSON with: content, title, mood, intensity(1-10)`;
            const response = await this.openai.chat.completions.create({
                model: 'gpt-5', // Using newest model
                messages: [
                    {
                        role: 'system',
                        content: 'Write like a trader keeping a dark diary. Noir style. Cold observations of moral decay.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" },
            });
            const result = JSON.parse(response.choices[0].message.content || '{}');
            const entry = {
                userId,
                entryType: 'daily',
                content: result.content,
                title: result.title || 'Daily Reckoning',
                corruptionAtTime: corruptionLevel.toString(),
                mood: result.mood,
                intensity: result.intensity,
                wordCount: result.content.split(' ').length,
            };
            return await storage_1.storage.createJournalEntry(entry);
        }
        catch (error) {
            console.error('Failed to generate daily summary:', error);
            throw error;
        }
    }
    /**
     * Generate shadow market confession
     */
    async generateShadowConfession(userId, shadowActivity, corruptionLevel) {
        try {
            const prompt = `The trader has engaged in shadow market activities.
        Dark pools accessed. Predatory trades executed.
        Corruption: ${corruptionLevel}%
        
        Write a noir confession about operating in the shadows.
        Style: James Ellroy at his darkest.
        Focus on the thrill of hidden trades, the predatory nature.
        Under 100 words. Return as JSON with: content, title, mood, intensity(1-10)`;
            const response = await this.openai.chat.completions.create({
                model: 'gpt-5',
                messages: [
                    {
                        role: 'system',
                        content: 'Write confessions from the shadow market. Dark, predatory, thrilling.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" },
            });
            const result = JSON.parse(response.choices[0].message.content || '{}');
            const entry = {
                userId,
                entryType: 'confession',
                content: result.content,
                title: result.title || 'Shadow Confession',
                corruptionAtTime: corruptionLevel.toString(),
                mood: result.mood,
                intensity: result.intensity,
                wordCount: result.content.split(' ').length,
            };
            return await storage_1.storage.createJournalEntry(entry);
        }
        catch (error) {
            console.error('Failed to generate shadow confession:', error);
            throw error;
        }
    }
    /**
     * Build noir prompt based on context
     */
    buildNoirPrompt(context) {
        const { trade, victim, corruptionLevel } = context;
        if (trade && victim) {
            const profit = parseFloat(trade.pnl || '0');
            return `Write a noir journal entry about a trade where $${profit.toFixed(2)} was made at the expense of ${victim.victimName}.
              ${victim.victimStory}
              Corruption level: ${corruptionLevel}%.
              Style: Raymond Chandler meets financial horror.
              Keep it under 100 words. Never moralize, just observe the darkness.
              Return as JSON with: content, title, mood, intensity(1-10)`;
        }
        return `Write a noir observation about trading in darkness.
            Corruption level: ${corruptionLevel}%.
            Keep it under 100 words.
            Return as JSON with: content, title, mood, intensity(1-10)`;
    }
    /**
     * Determine entry type from context
     */
    determineEntryType(context) {
        if (context.victim)
            return 'victim';
        if (context.trade)
            return 'trade';
        return 'observation';
    }
}
exports.NoirJournalService = NoirJournalService;
// Export singleton instance
exports.noirJournalService = NoirJournalService.getInstance();
