"use strict";
/**
 * Tier Classification Service
 * Automatically classifies characters and creators into franchise/prestige tiers
 * based on metadata, appearance counts, and popularity indicators
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.tierClassificationService = void 0;
class TierClassificationService {
    constructor() {
        /**
         * Flagship franchise heroes (Tier 1)
         * These are the absolute top-tier characters that define their publishers
         */
        this.tier1Characters = new Set([
            // DC Flagship
            'superman', 'batman', 'wonder woman', 'flash', 'green lantern',
            'aquaman', 'cyborg', 'shazam', 'martian manhunter',
            // Marvel Flagship
            'spider-man', 'iron man', 'captain america', 'thor', 'hulk',
            'black panther', 'doctor strange', 'captain marvel', 'daredevil',
            'wolverine', 'deadpool', 'punisher', 'black widow',
            // Major Villains
            'joker', 'lex luthor', 'darkseid', 'brainiac', 'doomsday',
            'thanos', 'magneto', 'doctor doom', 'loki', 'venom', 'green goblin',
            'red skull', 'ultron', 'galactus'
        ]);
        /**
         * Second generation / variant heroes (Tier 2)
         */
        this.tier2Characters = new Set([
            'miles morales', 'sam wilson', 'jane foster', 'riri williams',
            'kamala khan', 'kate bishop', 'america chavez', 'x-23',
            'silk', 'spider-gwen', 'superior spider-man',
            'damian wayne', 'tim drake', 'stephanie brown', 'cassandra cain',
            'kyle rayner', 'john stewart', 'jessica cruz', 'simon baz',
            'wally west', 'bart allen', 'impulse'
        ]);
        /**
         * Sidekicks and supporting heroes (Tier 3)
         */
        this.tier3Characters = new Set([
            'robin', 'nightwing', 'red hood', 'batgirl', 'oracle',
            'bucky', 'falcon', 'war machine', 'hawkeye', 'black widow',
            'kid flash', 'speedy', 'arsenal', 'aqualad', 'superboy',
            'supergirl', 'power girl', 'starfire', 'beast boy', 'raven'
        ]);
        /**
         * Legendary creators (Tier 1)
         */
        this.tier1Creators = new Set([
            'stan lee', 'jack kirby', 'bob kane', 'bill finger', 'steve ditko',
            'jerry siegel', 'joe shuster', 'will eisner', 'frank miller',
            'alan moore', 'neil gaiman', 'todd mcfarlane', 'jim lee'
        ]);
        /**
         * Superstar creators (Tier 2)
         */
        this.tier2Creators = new Set([
            'chris claremont', 'grant morrison', 'brian michael bendis',
            'mark millar', 'garth ennis', 'warren ellis', 'brian azzarello',
            'gabriele dell\'otto', 'alex ross', 'j.h. williams iii',
            'fiona staples', 'esad ribic', 'jamie mckelvie'
        ]);
        /**
         * Top artists (Tier 3)
         */
        this.tier3Creators = new Set([
            'adam hughes', 'frank cho', 'greg capullo', 'jim cheung',
            'john cassaday', 'john romita jr', 'david finch', 'andy kubert',
            'ivan reis', 'joe madureira', 'salvador larroca', 'steve mcniven',
            'tony daniel', 'travis charest', 'jerome opena'
        ]);
    }
    /**
     * Classify character into franchise tier
     */
    classifyCharacter(metadata) {
        const nameLower = this.normalizeCredit(metadata.name);
        // Check for variant indicators
        const isVariant = this.isVariantCharacter(metadata.name) || metadata.isVariant || false;
        // Extract base character for variants
        const { baseName } = this.extractVariantInfo(metadata.name);
        const baseNameLower = this.normalizeCredit(baseName);
        // Check explicit tier sets (including base character for variants)
        if (this.tier1Characters.has(nameLower) || this.tier1Characters.has(baseNameLower)) {
            // Variants of Tier 1 characters become Tier 2
            const tier = isVariant ? 2 : 1;
            return { tier, isVariant, confidence: 1.0 };
        }
        if (this.tier2Characters.has(nameLower) || this.tier2Characters.has(baseNameLower)) {
            return { tier: 2, isVariant, confidence: 1.0 };
        }
        // Check Tier 3 with base name support for parenthetical identities
        if (this.tier3Characters.has(nameLower) || this.tier3Characters.has(baseNameLower)) {
            return { tier: 3, isVariant, confidence: 0.9 };
        }
        // Fallback to appearance-based classification
        const appearances = metadata.appearances || 0;
        // Variants with high appearances stay at tier 2 minimum
        if (isVariant && appearances > 100)
            return { tier: 2, isVariant, confidence: 0.7 };
        if (appearances > 500)
            return { tier: 1, isVariant: false, confidence: 0.7 };
        if (appearances > 200)
            return { tier: 2, isVariant, confidence: 0.7 };
        if (appearances > 50)
            return { tier: 3, isVariant, confidence: 0.6 };
        // Default to Tier 4 (henchmen/minor characters)
        return { tier: 4, isVariant, confidence: 0.5 };
    }
    /**
     * Classify creator into prestige tier
     */
    classifyCreator(metadata) {
        const nameLower = this.normalizeCredit(metadata.name);
        // Calculate role-weighted appearances
        const roleWeightedAppearances = this.calculateRoleWeightedAppearances(metadata);
        // Check explicit tier sets
        if (this.tier1Creators.has(nameLower)) {
            return { tier: 1, roleWeightedAppearances, confidence: 1.0 };
        }
        if (this.tier2Creators.has(nameLower)) {
            return { tier: 2, roleWeightedAppearances, confidence: 1.0 };
        }
        if (this.tier3Creators.has(nameLower)) {
            return { tier: 3, roleWeightedAppearances, confidence: 0.9 };
        }
        // Fallback to appearance-based classification
        if (roleWeightedAppearances > 300)
            return { tier: 1, roleWeightedAppearances, confidence: 0.7 };
        if (roleWeightedAppearances > 100)
            return { tier: 2, roleWeightedAppearances, confidence: 0.7 };
        if (roleWeightedAppearances > 30)
            return { tier: 3, roleWeightedAppearances, confidence: 0.6 };
        // Default to Tier 4 (unknowns)
        return { tier: 4, roleWeightedAppearances, confidence: 0.5 };
    }
    /**
     * Calculate role-weighted appearances for creators
     * Writer: 1.0, Primary Artist: 0.9, Cover: 0.6, Editorial: 0.2
     */
    calculateRoleWeightedAppearances(metadata) {
        const appearances = metadata.appearances || 0;
        const roles = metadata.roles || [];
        if (roles.length === 0) {
            // No role info, assume mixed (0.7 weight)
            return appearances * 0.7;
        }
        // Calculate average role weight
        const roleWeights = {
            writer: 1.0,
            artist: 0.9,
            penciller: 0.9,
            inker: 0.7,
            cover: 0.6,
            colorist: 0.5,
            letterer: 0.4,
            editorial: 0.2,
            editor: 0.2
        };
        const weights = roles.map(role => {
            if (!role)
                return 0.5;
            const roleLower = role.toLowerCase();
            for (const [key, weight] of Object.entries(roleWeights)) {
                if (roleLower.includes(key))
                    return weight;
            }
            return 0.5; // Unknown role
        });
        const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;
        return appearances * avgWeight;
    }
    /**
     * Check if character name indicates a variant
     */
    isVariantCharacter(name) {
        if (!name || typeof name !== 'string')
            return false;
        const variantIndicators = [
            'ultimate', 'house of m', '2099', 'noir', 'zombies',
            'earth-', 'prime', 'earth 2', 'new 52', 'rebirth',
            'all-star', 'elseworlds', 'what if', 'earth one',
            'red son', 'kingdom come', 'dark knight', 'year one'
        ];
        const nameLower = name.toLowerCase();
        return variantIndicators.some(indicator => nameLower.includes(indicator));
    }
    /**
     * Extract variant information from character name
     */
    extractVariantInfo(name) {
        // Pattern: "Character Name (Variant)"
        const match = name.match(/^(.+?)\s*\(([^)]+)\)$/);
        if (match) {
            return {
                baseName: match[1].trim(),
                variant: match[2].trim()
            };
        }
        return {
            baseName: name,
            variant: null
        };
    }
    /**
     * Normalize creator/character name for matching
     */
    normalizeCredit(name) {
        if (!name)
            return '';
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, ' ');
    }
    /**
     * Batch classify characters
     */
    batchClassifyCharacters(characters) {
        const results = new Map();
        for (const char of characters) {
            results.set(char.name, this.classifyCharacter(char));
        }
        return results;
    }
    /**
     * Batch classify creators
     */
    batchClassifyCreators(creators) {
        const results = new Map();
        for (const creator of creators) {
            results.set(creator.name, this.classifyCreator(creator));
        }
        return results;
    }
}
exports.tierClassificationService = new TierClassificationService();
