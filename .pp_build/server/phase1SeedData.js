"use strict";
/**
 * Phase 1 Core Trading Foundation Seed Data
 *
 * This file contains seed data for all Phase 1 systems:
 * - Seven House Trading Firms
 * - Global Market Hours
 * - Information Tiers
 * - Sample Asset Financial Mappings
 * - Initial News Articles
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleNpcTraders = exports.sampleNewsArticles = exports.sampleAssetMappings = exports.informationTiers = exports.globalMarketHours = exports.sevenHouseTradingFirms = void 0;
// Seven House Trading Firms Seed Data
exports.sevenHouseTradingFirms = [
    {
        houseId: "hellenic",
        firmName: "Hellanic Agency",
        firmCode: "HELLENIC",
        ceoName: "Nikolai Popodopolus",
        ceoMythologyRef: "Zeus",
        advisors: [
            { name: "Nyx Nightwhisper", mythologyRef: "Nyx", role: "Chief Strategic Advisor" },
            { name: "Chronos Timekeeper", mythologyRef: "Chronos", role: "Timing & Market Cycles" },
            { name: "Atlas Stronghold", mythologyRef: "Atlas", role: "Portfolio Support" }
        ],
        primarySpecialties: ["central_command", "market_oversight", "strategic_planning", "multi_asset"],
        weaknesses: ["micro_management", "short_term_trades"],
        specialtyBonuses: {
            central_command: 25.0,
            market_oversight: 20.0,
            strategic_planning: 30.0,
            multi_asset: 15.0
        },
        weaknessPenalties: {
            micro_management: -10.0,
            short_term_trades: -5.0
        },
        tradingStyle: "systematic",
        riskTolerance: "medium",
        marketCapacityUSD: "50000000000.00",
        minimumTradeSize: "10000.00",
        totalAssetsUnderManagement: "25000000000.00",
        ytdReturn: "12.50",
        sharpeRatio: "1.85",
        maxDrawdown: "-8.20",
        winRate: "68.50",
        avgTradeSize: "2500000.00",
        isActive: true,
        marketHours: {
            "America/New_York": { open: "09:30", close: "16:00" },
            "Europe/London": { open: "08:00", close: "16:30" },
            "Asia/Hong_Kong": { open: "09:30", close: "16:00" }
        },
        communicationChannels: ["oracle_announcements", "firm_memos", "market_bulletins"],
        reputation: "95.00"
    },
    {
        houseId: "roman",
        firmName: "GM Financial",
        firmCode: "GM_FIN",
        ceoName: "Marcus Bacchus",
        ceoMythologyRef: "Bacchus",
        advisors: [
            { name: "Dionysus Wildcard", mythologyRef: "Dionysus", role: "Options Strategy" },
            { name: "Mercury Swift", mythologyRef: "Mercury", role: "After-Hours Trading" }
        ],
        primarySpecialties: ["options", "after_hours", "volatility_trading", "derivatives"],
        weaknesses: ["bonds", "fixed_income"],
        specialtyBonuses: {
            options: 35.0,
            after_hours: 25.0,
            volatility_trading: 30.0,
            derivatives: 20.0
        },
        weaknessPenalties: {
            bonds: -15.0,
            fixed_income: -10.0
        },
        tradingStyle: "aggressive",
        riskTolerance: "high",
        marketCapacityUSD: "15000000000.00",
        minimumTradeSize: "5000.00",
        totalAssetsUnderManagement: "8500000000.00",
        ytdReturn: "18.75",
        sharpeRatio: "1.42",
        maxDrawdown: "-15.30",
        winRate: "62.80",
        avgTradeSize: "850000.00",
        isActive: true,
        marketHours: {
            "America/New_York": { open: "04:00", close: "20:00" },
            "Europe/London": { open: "01:00", close: "23:00" }
        },
        communicationChannels: ["options_alerts", "volatility_reports", "after_hours_updates"],
        reputation: "82.50"
    },
    {
        houseId: "buddhist",
        firmName: "Ashoka Ventures",
        firmCode: "ASHOKA",
        ceoName: "Siddhartha Enlightened",
        ceoMythologyRef: "Buddha",
        advisors: [
            { name: "Manjushri Wisdom", mythologyRef: "Manjushri", role: "Research Director" },
            { name: "Avalokiteshvara Compassion", mythologyRef: "Avalokiteshvara", role: "ESG Integration" }
        ],
        primarySpecialties: ["blue_chip", "institutional", "value_investing", "long_term"],
        weaknesses: ["crypto", "nfts", "speculative"],
        specialtyBonuses: {
            blue_chip: 30.0,
            institutional: 25.0,
            value_investing: 35.0,
            long_term: 20.0
        },
        weaknessPenalties: {
            crypto: -20.0,
            nfts: -25.0,
            speculative: -15.0
        },
        tradingStyle: "conservative",
        riskTolerance: "low",
        marketCapacityUSD: "40000000000.00",
        minimumTradeSize: "25000.00",
        totalAssetsUnderManagement: "35000000000.00",
        ytdReturn: "9.80",
        sharpeRatio: "2.15",
        maxDrawdown: "-4.50",
        winRate: "74.20",
        avgTradeSize: "5000000.00",
        isActive: true,
        marketHours: {
            "Asia/Kolkata": { open: "09:15", close: "15:30" },
            "America/New_York": { open: "09:30", close: "16:00" }
        },
        communicationChannels: ["institutional_reports", "value_analysis", "mindful_markets"],
        reputation: "91.75"
    },
    {
        houseId: "egyptian",
        firmName: "Khet Financial",
        firmCode: "KHET",
        ceoName: "Pharaoh Thutmose",
        ceoMythologyRef: "Thoth",
        advisors: [
            { name: "Isis Protector", mythologyRef: "Isis", role: "Risk Management" },
            { name: "Anubis Guardian", mythologyRef: "Anubis", role: "Compliance" }
        ],
        primarySpecialties: ["bonds", "infrastructure", "fixed_income", "commodities"],
        weaknesses: ["tech_options", "growth_stocks"],
        specialtyBonuses: {
            bonds: 40.0,
            infrastructure: 30.0,
            fixed_income: 35.0,
            commodities: 25.0
        },
        weaknessPenalties: {
            tech_options: -18.0,
            growth_stocks: -12.0
        },
        tradingStyle: "conservative",
        riskTolerance: "low",
        marketCapacityUSD: "30000000000.00",
        minimumTradeSize: "50000.00",
        totalAssetsUnderManagement: "28000000000.00",
        ytdReturn: "7.25",
        sharpeRatio: "1.95",
        maxDrawdown: "-3.80",
        winRate: "78.50",
        avgTradeSize: "3500000.00",
        isActive: true,
        marketHours: {
            "Africa/Cairo": { open: "10:00", close: "14:00" },
            "America/New_York": { open: "09:30", close: "16:00" }
        },
        communicationChannels: ["bond_market_insights", "infrastructure_updates", "pyramid_reports"],
        reputation: "88.90"
    },
    {
        houseId: "chinese",
        firmName: "Equilibrium Partners",
        firmCode: "EQUILIBRIUM",
        ceoName: "Master Wu Wei",
        ceoMythologyRef: "Laozi",
        advisors: [
            { name: "Confucius Order", mythologyRef: "Confucius", role: "Systematic Strategy" },
            { name: "Sun Tzu Tactics", mythologyRef: "Sun Tzu", role: "Market Warfare" }
        ],
        primarySpecialties: ["etfs", "systematic", "quant", "algorithmic"],
        weaknesses: ["single_stocks", "discretionary"],
        specialtyBonuses: {
            etfs: 30.0,
            systematic: 35.0,
            quant: 40.0,
            algorithmic: 32.0
        },
        weaknessPenalties: {
            single_stocks: -15.0,
            discretionary: -20.0
        },
        tradingStyle: "systematic",
        riskTolerance: "medium",
        marketCapacityUSD: "25000000000.00",
        minimumTradeSize: "15000.00",
        totalAssetsUnderManagement: "22000000000.00",
        ytdReturn: "11.40",
        sharpeRatio: "1.78",
        maxDrawdown: "-6.70",
        winRate: "69.30",
        avgTradeSize: "1800000.00",
        isActive: true,
        marketHours: {
            "Asia/Shanghai": { open: "09:30", close: "15:00" },
            "Asia/Hong_Kong": { open: "09:30", close: "16:00" }
        },
        communicationChannels: ["algorithmic_signals", "systematic_updates", "balance_reports"],
        reputation: "85.60"
    },
    {
        houseId: "nordic",
        firmName: "Bergmann & Associates",
        firmCode: "BERGMANN",
        ceoName: "Ragnar Ironforge",
        ceoMythologyRef: "Odin",
        advisors: [
            { name: "Thor Thunderstrike", mythologyRef: "Thor", role: "Aggressive Trading" },
            { name: "Frigg Foresight", mythologyRef: "Frigg", role: "Predictive Analytics" }
        ],
        primarySpecialties: ["derivatives", "options", "futures", "complex_instruments"],
        weaknesses: ["esg", "sustainable"],
        specialtyBonuses: {
            derivatives: 38.0,
            options: 32.0,
            futures: 35.0,
            complex_instruments: 28.0
        },
        weaknessPenalties: {
            esg: -12.0,
            sustainable: -15.0
        },
        tradingStyle: "aggressive",
        riskTolerance: "extreme",
        marketCapacityUSD: "12000000000.00",
        minimumTradeSize: "8000.00",
        totalAssetsUnderManagement: "9500000000.00",
        ytdReturn: "22.30",
        sharpeRatio: "1.35",
        maxDrawdown: "-18.90",
        winRate: "58.70",
        avgTradeSize: "950000.00",
        isActive: true,
        marketHours: {
            "Europe/Stockholm": { open: "09:00", close: "17:30" },
            "Europe/London": { open: "08:00", close: "16:30" }
        },
        communicationChannels: ["derivatives_war_room", "options_forge", "viking_raids"],
        reputation: "79.20"
    },
    {
        houseId: "celtic",
        firmName: "Tír Holdings",
        firmCode: "TIR",
        ceoName: "Brigid Silverstream",
        ceoMythologyRef: "Brigid",
        advisors: [
            { name: "Cernunnos Wild", mythologyRef: "Cernunnos", role: "Alternative Assets" },
            { name: "Morrigan Prophecy", mythologyRef: "Morrigan", role: "Market Divination" }
        ],
        primarySpecialties: ["nfts", "crypto", "alternative", "digital_assets"],
        weaknesses: ["traditional_bonds", "fixed_income"],
        specialtyBonuses: {
            nfts: 45.0,
            crypto: 40.0,
            alternative: 35.0,
            digital_assets: 38.0
        },
        weaknessPenalties: {
            traditional_bonds: -20.0,
            fixed_income: -18.0
        },
        tradingStyle: "opportunistic",
        riskTolerance: "extreme",
        marketCapacityUSD: "8000000000.00",
        minimumTradeSize: "3000.00",
        totalAssetsUnderManagement: "6200000000.00",
        ytdReturn: "35.80",
        sharpeRatio: "1.15",
        maxDrawdown: "-28.40",
        winRate: "52.30",
        avgTradeSize: "420000.00",
        isActive: true,
        marketHours: {
            "Europe/Dublin": { open: "08:00", close: "16:30" },
            "America/New_York": { open: "09:30", close: "16:00" }
        },
        communicationChannels: ["crypto_circle", "nft_grove", "digital_druids"],
        reputation: "73.80"
    },
    {
        houseId: "indigenous",
        firmName: "Windfall Securities",
        firmCode: "WINDFALL",
        ceoName: "Chief Running Bear",
        ceoMythologyRef: "Great Spirit",
        advisors: [
            { name: "Eagle Eye Soaring", mythologyRef: "Eagle Spirit", role: "ESG Research" },
            { name: "Wise Wolf Howling", mythologyRef: "Wolf Spirit", role: "Sustainable Strategy" }
        ],
        primarySpecialties: ["esg", "sustainable", "clean_energy", "environmental"],
        weaknesses: ["fossil_fuels", "mining"],
        specialtyBonuses: {
            esg: 42.0,
            sustainable: 38.0,
            clean_energy: 35.0,
            environmental: 40.0
        },
        weaknessPenalties: {
            fossil_fuels: -25.0,
            mining: -20.0
        },
        tradingStyle: "conservative",
        riskTolerance: "medium",
        marketCapacityUSD: "18000000000.00",
        minimumTradeSize: "12000.00",
        totalAssetsUnderManagement: "14500000000.00",
        ytdReturn: "14.60",
        sharpeRatio: "1.68",
        maxDrawdown: "-9.20",
        winRate: "71.40",
        avgTradeSize: "1250000.00",
        isActive: true,
        marketHours: {
            "America/Denver": { open: "08:30", close: "15:00" },
            "America/New_York": { open: "09:30", close: "16:00" }
        },
        communicationChannels: ["earth_wisdom", "wind_reports", "spirit_market_calls"],
        reputation: "87.30"
    }
];
// Global Market Hours Seed Data
exports.globalMarketHours = [
    {
        marketCode: "NYC",
        marketName: "New York Stock Exchange",
        timezone: "America/New_York",
        regularOpenTime: "09:30",
        regularCloseTime: "16:00",
        preMarketOpenTime: "04:00",
        afterHoursCloseTime: "20:00",
        isActive: true,
        currentStatus: "open",
        holidaySchedule: ["2024-01-01", "2024-01-15", "2024-02-19", "2024-03-29", "2024-05-27", "2024-06-19", "2024-07-04", "2024-09-02", "2024-11-28", "2024-12-25"],
        earlyCloseSchedule: ["2024-11-29", "2024-12-24"],
        enablesCrossTrading: true,
        crossTradingFee: "0.0010",
        dailyVolumeTarget: "25000000000.00",
        currentDayVolume: "18750000000.00",
        avgDailyVolume: "22000000000.00",
        influenceWeight: "1.0000",
        leadMarket: true
    },
    {
        marketCode: "LON",
        marketName: "London Stock Exchange",
        timezone: "Europe/London",
        regularOpenTime: "08:00",
        regularCloseTime: "16:30",
        preMarketOpenTime: "07:00",
        afterHoursCloseTime: "17:30",
        isActive: true,
        currentStatus: "open",
        holidaySchedule: ["2024-01-01", "2024-03-29", "2024-04-01", "2024-05-06", "2024-05-27", "2024-08-26", "2024-12-25", "2024-12-26"],
        earlyCloseSchedule: ["2024-12-24", "2024-12-31"],
        enablesCrossTrading: true,
        crossTradingFee: "0.0008",
        dailyVolumeTarget: "12000000000.00",
        currentDayVolume: "8900000000.00",
        avgDailyVolume: "10500000000.00",
        influenceWeight: "0.7500",
        leadMarket: false
    },
    {
        marketCode: "SYD",
        marketName: "Australian Securities Exchange",
        timezone: "Australia/Sydney",
        regularOpenTime: "10:00",
        regularCloseTime: "16:00",
        preMarketOpenTime: "09:30",
        afterHoursCloseTime: "16:30",
        isActive: true,
        currentStatus: "closed",
        holidaySchedule: ["2024-01-01", "2024-01-26", "2024-03-29", "2024-04-01", "2024-04-25", "2024-06-10", "2024-10-07", "2024-12-25", "2024-12-26"],
        earlyCloseSchedule: ["2024-12-24", "2024-12-31"],
        enablesCrossTrading: true,
        crossTradingFee: "0.0012",
        dailyVolumeTarget: "4500000000.00",
        currentDayVolume: "3200000000.00",
        avgDailyVolume: "4100000000.00",
        influenceWeight: "0.3500",
        leadMarket: false
    },
    {
        marketCode: "HKG",
        marketName: "Hong Kong Stock Exchange",
        timezone: "Asia/Hong_Kong",
        regularOpenTime: "09:30",
        regularCloseTime: "16:00",
        preMarketOpenTime: "09:00",
        afterHoursCloseTime: "16:30",
        isActive: true,
        currentStatus: "closed",
        holidaySchedule: ["2024-01-01", "2024-02-10", "2024-02-12", "2024-02-13", "2024-03-29", "2024-04-04", "2024-05-01", "2024-05-15", "2024-06-10", "2024-07-01", "2024-09-18", "2024-10-01", "2024-10-23", "2024-12-25", "2024-12-26"],
        earlyCloseSchedule: ["2024-02-09", "2024-12-24", "2024-12-31"],
        enablesCrossTrading: true,
        crossTradingFee: "0.0015",
        dailyVolumeTarget: "8000000000.00",
        currentDayVolume: "6200000000.00",
        avgDailyVolume: "7400000000.00",
        influenceWeight: "0.5000",
        leadMarket: false
    },
    {
        marketCode: "BOM",
        marketName: "Bombay Stock Exchange",
        timezone: "Asia/Kolkata",
        regularOpenTime: "09:15",
        regularCloseTime: "15:30",
        preMarketOpenTime: "09:00",
        afterHoursCloseTime: "16:00",
        isActive: true,
        currentStatus: "closed",
        holidaySchedule: ["2024-01-26", "2024-03-08", "2024-03-25", "2024-03-29", "2024-04-11", "2024-04-17", "2024-05-01", "2024-08-15", "2024-08-19", "2024-10-02", "2024-10-31", "2024-11-01", "2024-11-15", "2024-12-25"],
        earlyCloseSchedule: ["2024-03-07", "2024-10-30"],
        enablesCrossTrading: true,
        crossTradingFee: "0.0018",
        dailyVolumeTarget: "6000000000.00",
        currentDayVolume: "4500000000.00",
        avgDailyVolume: "5200000000.00",
        influenceWeight: "0.4000",
        leadMarket: false
    }
];
// Information Tiers Seed Data
exports.informationTiers = [
    {
        tierName: "Elite",
        tierLevel: 1,
        newsDelayMinutes: 0,
        marketDataDelayMs: 0,
        analysisQuality: "family_office",
        insightDepth: "comprehensive",
        advancedCharting: true,
        realTimeAlerts: true,
        whaleTrackingAccess: true,
        firmIntelligence: true,
        earlyMarketEvents: true,
        exclusiveResearch: true,
        monthlyPrice: "299.99",
        annualPrice: "2999.99",
        creditsCost: 0,
        maxPriceAlerts: 100,
        maxWatchlistAssets: 500,
        maxPortfolios: 10,
        isActive: true,
        displayOrder: 1
    },
    {
        tierName: "Pro",
        tierLevel: 2,
        newsDelayMinutes: 15,
        marketDataDelayMs: 15000,
        analysisQuality: "senior_analyst",
        insightDepth: "standard",
        advancedCharting: true,
        realTimeAlerts: true,
        whaleTrackingAccess: false,
        firmIntelligence: false,
        earlyMarketEvents: false,
        exclusiveResearch: false,
        monthlyPrice: "99.99",
        annualPrice: "999.99",
        creditsCost: 0,
        maxPriceAlerts: 25,
        maxWatchlistAssets: 100,
        maxPortfolios: 3,
        isActive: true,
        displayOrder: 2
    },
    {
        tierName: "Free",
        tierLevel: 3,
        newsDelayMinutes: 30,
        marketDataDelayMs: 30000,
        analysisQuality: "junior_broker",
        insightDepth: "basic",
        advancedCharting: false,
        realTimeAlerts: false,
        whaleTrackingAccess: false,
        firmIntelligence: false,
        earlyMarketEvents: false,
        exclusiveResearch: false,
        monthlyPrice: "0.00",
        annualPrice: "0.00",
        creditsCost: 0,
        maxPriceAlerts: 5,
        maxWatchlistAssets: 20,
        maxPortfolios: 1,
        isActive: true,
        displayOrder: 3
    }
];
// Sample Asset Financial Mappings
exports.sampleAssetMappings = [
    {
        assetId: "batman-asset-id", // This would be populated with actual asset IDs
        instrumentType: "common_stock",
        instrumentSubtype: "character_stock",
        shareClass: "A",
        votingRights: true,
        dividendEligible: false,
        securityType: "equity",
        exchangeListing: "PPX",
        lotSize: 1,
        tickSize: "0.0100",
        marginRequirement: "50.00",
        shortSellAllowed: true
    },
    {
        assetId: "dc-comics-asset-id",
        instrumentType: "bond",
        instrumentSubtype: "corporate_bond",
        creditRating: "AA+",
        maturityDate: new Date("2034-12-31"),
        couponRate: "4.2500",
        faceValue: "1000.00",
        securityType: "debt",
        exchangeListing: "PPX",
        lotSize: 1,
        tickSize: "0.0100",
        marginRequirement: "20.00",
        shortSellAllowed: false
    },
    {
        assetId: "amazing-fantasy-15-asset-id",
        instrumentType: "preferred_stock",
        instrumentSubtype: "key_comic_preferred",
        shareClass: "P",
        votingRights: false,
        dividendEligible: true,
        dividendYield: "3.5000",
        securityType: "equity",
        exchangeListing: "PPX",
        lotSize: 1,
        tickSize: "0.0100",
        marginRequirement: "40.00",
        shortSellAllowed: true
    },
    {
        assetId: "justice-league-fund-asset-id",
        instrumentType: "etf",
        instrumentSubtype: "themed_fund",
        fundComponents: ["batman-asset-id", "superman-asset-id", "wonder-woman-asset-id", "dc-comics-asset-id"],
        expenseRatio: "0.7500",
        trackingIndex: "DC_HEROES_INDEX",
        rebalanceFrequency: "monthly",
        securityType: "fund",
        exchangeListing: "PPX",
        lotSize: 1,
        tickSize: "0.0100",
        marginRequirement: "25.00",
        shortSellAllowed: true
    }
];
// Sample News Articles
exports.sampleNewsArticles = [
    {
        headline: "Batman's Gotham City Operations Expand to International Markets",
        summary: "Wayne Enterprises announces strategic expansion into global markets, potentially affecting BATMAN stock performance.",
        fullContent: "In a major development for the comic book trading market, Wayne Enterprises has announced plans to expand Batman's operational territory beyond Gotham City. This international expansion is expected to significantly impact the trading value of BATMAN common stock. Market analysts from Ashoka Ventures suggest this could lead to increased volatility in the short term but substantial growth potential in the long run. The expansion includes new storylines across European and Asian markets, potentially increasing Batman's global brand recognition and merchandising revenue.",
        sourceOrganization: "Panel Profits Oracle",
        authorName: "Market Oracle AI",
        newsCategory: "market_moving",
        impactLevel: "high",
        affectedAssets: ["batman-asset-id", "dc-comics-asset-id", "justice-league-fund-asset-id"],
        publishTime: new Date(),
        eliteReleaseTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        proReleaseTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        freeReleaseTime: new Date(), // Now
        priceImpactDirection: "positive",
        priceImpactMagnitude: "5.50",
        volatilityImpact: "12.00",
        isVerified: true,
        verifiedBy: "panel_profits_oracle",
        confidenceScore: "95.00",
        isActive: true,
        tags: ["batman", "expansion", "international", "growth"]
    },
    {
        headline: "Marvel Comics Announces Major Character Crossover Event",
        summary: "Spider-Man and Avengers collaboration storyline expected to boost Marvel-related asset performance.",
        fullContent: "Marvel Comics has officially announced an unprecedented crossover event featuring Spider-Man and the entire Avengers roster. This mega-event is projected to span 12 months and will significantly impact multiple Marvel-related trading assets. GM Financial's options specialists predict increased call option activity for SPIDER-MAN and related Marvel assets. The crossover is expected to generate substantial merchandise revenue and potentially lead to new movie deals, creating positive sentiment across the Marvel asset class.",
        sourceOrganization: "Panel Profits Oracle",
        authorName: "Market Oracle AI",
        newsCategory: "market_moving",
        impactLevel: "high",
        affectedAssets: ["spider-man-asset-id", "marvel-comics-asset-id", "avengers-fund-asset-id"],
        publishTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
        eliteReleaseTime: new Date(Date.now() - 25 * 60 * 1000), // Elite sees it early
        proReleaseTime: new Date(Date.now() - 10 * 60 * 1000), // Pro sees it early
        freeReleaseTime: new Date(Date.now() + 5 * 60 * 1000), // Free sees it on time
        priceImpactDirection: "positive",
        priceImpactMagnitude: "7.25",
        volatilityImpact: "15.50",
        isVerified: true,
        verifiedBy: "panel_profits_oracle",
        confidenceScore: "92.50",
        isActive: true,
        tags: ["marvel", "crossover", "spider-man", "avengers", "collaboration"]
    }
];
// Sample NPC Whale Traders
exports.sampleNpcTraders = [
    {
        traderName: "The Collector",
        traderType: "whale",
        firmId: "hellenic-firm-id", // Would be populated with actual firm ID
        tradingPersonality: {
            focus: "rare_assets",
            strategy: "buy_and_hold",
            sentiment_influence: "low",
            market_timing: "opportunistic"
        },
        preferredAssets: ["preferred_stock", "key_comic_assets", "limited_editions"],
        avoidedAssets: ["common_stock", "high_frequency"],
        tradingStyle: "conservative",
        availableCapital: "500000000.00",
        maxPositionSize: "50000000.00",
        maxDailyVolume: "25000000.00",
        leveragePreference: "1.00",
        aggressiveness: "25.00",
        intelligence: "95.00",
        emotionality: "15.00",
        adaptability: "40.00",
        tradesPerDay: 3,
        minTimeBetweenTrades: 240, // 4 hours
        isActive: true,
        influenceOnMarket: "0.0500"
    },
    {
        traderName: "Speed Demon",
        traderType: "momentum",
        firmId: "gm-financial-firm-id",
        tradingPersonality: {
            focus: "high_velocity",
            strategy: "momentum_following",
            sentiment_influence: "high",
            market_timing: "reactive"
        },
        preferredAssets: ["options", "volatile_stocks", "derivatives"],
        avoidedAssets: ["bonds", "stable_assets"],
        tradingStyle: "aggressive",
        availableCapital: "100000000.00",
        maxPositionSize: "20000000.00",
        maxDailyVolume: "75000000.00",
        leveragePreference: "3.00",
        aggressiveness: "85.00",
        intelligence: "70.00",
        emotionality: "60.00",
        adaptability: "90.00",
        tradesPerDay: 50,
        minTimeBetweenTrades: 15, // 15 minutes
        isActive: true,
        influenceOnMarket: "0.0200"
    },
    {
        traderName: "The Contrarian",
        traderType: "contrarian",
        firmId: "ashoka-firm-id",
        tradingPersonality: {
            focus: "value_opportunities",
            strategy: "contrarian",
            sentiment_influence: "negative_correlation",
            market_timing: "patient"
        },
        preferredAssets: ["undervalued_stocks", "distressed_assets", "value_plays"],
        avoidedAssets: ["momentum_stocks", "overpriced_assets"],
        tradingStyle: "conservative",
        availableCapital: "250000000.00",
        maxPositionSize: "30000000.00",
        maxDailyVolume: "15000000.00",
        leveragePreference: "1.50",
        aggressiveness: "35.00",
        intelligence: "88.00",
        emotionality: "20.00",
        adaptability: "60.00",
        tradesPerDay: 8,
        minTimeBetweenTrades: 120, // 2 hours
        isActive: true,
        influenceOnMarket: "0.0300"
    }
];
