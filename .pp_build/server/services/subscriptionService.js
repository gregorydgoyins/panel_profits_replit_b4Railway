"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionService = exports.SubscriptionService = exports.tierFeatures = void 0;
exports.tierFeatures = {
    free: {
        maxWatchlists: 2,
        maxPortfolios: 1,
        realTimeData: false,
        technicalIndicators: false,
        aiMarketBriefs: false,
        competitionAccess: false,
        gradedMarketplace: false,
        advancedCharting: false,
        prioritySupport: false,
        coursesIncluded: 3,
        monthlyTradingCredits: 0,
        ppixIndexAccess: false,
        apiAccess: false,
        customAlerts: 5
    },
    pro: {
        maxWatchlists: 10,
        maxPortfolios: 5,
        realTimeData: true,
        technicalIndicators: true,
        aiMarketBriefs: true,
        competitionAccess: false,
        gradedMarketplace: false,
        advancedCharting: true,
        prioritySupport: false,
        coursesIncluded: 10,
        monthlyTradingCredits: 1000,
        ppixIndexAccess: true,
        apiAccess: false,
        customAlerts: 25
    },
    elite: {
        maxWatchlists: -1, // Unlimited
        maxPortfolios: -1, // Unlimited
        realTimeData: true,
        technicalIndicators: true,
        aiMarketBriefs: true,
        competitionAccess: true,
        gradedMarketplace: true,
        advancedCharting: true,
        prioritySupport: true,
        coursesIncluded: -1, // Unlimited
        monthlyTradingCredits: 5000,
        ppixIndexAccess: true,
        apiAccess: true,
        customAlerts: -1 // Unlimited
    }
};
class SubscriptionService {
    // Check if user has access to a specific feature
    static hasFeatureAccess(user, feature) {
        const tier = user.subscriptionTier;
        const features = exports.tierFeatures[tier];
        return !!features[feature];
    }
    // Check if user can create more of a limited resource
    static canCreateMore(user, resourceType, currentCount) {
        const tier = user.subscriptionTier;
        const features = exports.tierFeatures[tier];
        const limit = resourceType === 'watchlists' ? features.maxWatchlists : features.maxPortfolios;
        // -1 means unlimited
        if (limit === -1)
            return true;
        return currentCount < limit;
    }
    // Get remaining trading credits for user
    static getRemainingCredits(user) {
        return Math.max(0, (user.monthlyTradingCredits || 0) - (user.usedTradingCredits || 0));
    }
    // Check if user can make a trade (has enough credits)
    static canMakeTrade(user, creditsCost = 1) {
        // Elite users have unlimited trades
        if (user.subscriptionTier === 'elite')
            return true;
        // Free users can't trade
        if (user.subscriptionTier === 'free')
            return false;
        return this.getRemainingCredits(user) >= creditsCost;
    }
    // Get tier upgrade recommendations
    static getUpgradeRecommendations(user, requestedFeature) {
        const currentTier = user.subscriptionTier;
        // If user already has access, no upgrade needed
        if (this.hasFeatureAccess(user, requestedFeature)) {
            return {
                recommendedTier: currentTier,
                benefits: [],
                monthlyPrice: 0
            };
        }
        // Find the minimum tier that provides the feature
        const tierOrder = ['free', 'pro', 'elite'];
        const currentTierIndex = tierOrder.indexOf(currentTier);
        for (let i = currentTierIndex + 1; i < tierOrder.length; i++) {
            const tier = tierOrder[i];
            if (exports.tierFeatures[tier][requestedFeature]) {
                return {
                    recommendedTier: tier,
                    benefits: this.getTierBenefits(tier, currentTier),
                    monthlyPrice: tier === 'pro' ? 29 : 99
                };
            }
        }
        // Default to Elite if no specific tier found
        return {
            recommendedTier: 'elite',
            benefits: this.getTierBenefits('elite', currentTier),
            monthlyPrice: 99
        };
    }
    // Get benefits when upgrading from one tier to another
    static getTierBenefits(targetTier, currentTier) {
        const targetFeatures = exports.tierFeatures[targetTier];
        const currentFeatures = exports.tierFeatures[currentTier];
        const benefits = [];
        if (targetFeatures.realTimeData && !currentFeatures.realTimeData) {
            benefits.push('Real-time market data');
        }
        if (targetFeatures.technicalIndicators && !currentFeatures.technicalIndicators) {
            benefits.push('Technical analysis tools (MACD, Bollinger Bands, RSI)');
        }
        if (targetFeatures.aiMarketBriefs && !currentFeatures.aiMarketBriefs) {
            benefits.push('AI-powered market briefs and insights');
        }
        if (targetFeatures.competitionAccess && !currentFeatures.competitionAccess) {
            benefits.push('Access to "Beat the AI" competition leagues');
        }
        if (targetFeatures.gradedMarketplace && !currentFeatures.gradedMarketplace) {
            benefits.push('Graded comic marketplace and arbitrage tools');
        }
        if (targetFeatures.ppixIndexAccess && !currentFeatures.ppixIndexAccess) {
            benefits.push('PPIx 50 and PPIx 100 market indices tracking');
        }
        if (targetFeatures.monthlyTradingCredits > currentFeatures.monthlyTradingCredits) {
            benefits.push(`${targetFeatures.monthlyTradingCredits} monthly trading credits`);
        }
        if (targetFeatures.coursesIncluded === -1 && currentFeatures.coursesIncluded !== -1) {
            benefits.push('Unlimited access to all educational courses');
        }
        else if (targetFeatures.coursesIncluded > currentFeatures.coursesIncluded) {
            benefits.push(`Access to ${targetFeatures.coursesIncluded} educational courses`);
        }
        return benefits;
    }
    // Generate feature gate message for UI
    static getFeatureGateMessage(feature, recommendedTier) {
        const featureNames = {
            maxWatchlists: 'multiple watchlists',
            maxPortfolios: 'multiple portfolios',
            realTimeData: 'real-time market data',
            technicalIndicators: 'technical analysis tools',
            aiMarketBriefs: 'AI market insights',
            competitionAccess: 'competition leagues',
            gradedMarketplace: 'graded comic marketplace',
            advancedCharting: 'advanced charting tools',
            prioritySupport: 'priority customer support',
            coursesIncluded: 'premium educational courses',
            monthlyTradingCredits: 'trading credits',
            ppixIndexAccess: 'PPIx market indices',
            apiAccess: 'API access',
            customAlerts: 'custom price alerts'
        };
        const featureName = featureNames[feature] || feature;
        const tierName = recommendedTier.charAt(0).toUpperCase() + recommendedTier.slice(1);
        return `${featureName} is available with ${tierName} subscription. Upgrade now to unlock this feature!`;
    }
}
exports.SubscriptionService = SubscriptionService;
exports.subscriptionService = new SubscriptionService();
