"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertClubPortfolioSchema = exports.insertClubMembershipSchema = exports.insertInvestmentClubSchema = exports.insertKnowledgeTestResponseSchema = exports.insertKnowledgeTestResultSchema = exports.insertMarketEventSchema = exports.insertOrderSchema = exports.insertWatchlistAssetSchema = exports.insertWatchlistSchema = exports.insertMarketIndexDataSchema = exports.insertMarketIndexSchema = exports.insertMarketInsightSchema = exports.insertHoldingSchema = exports.insertPortfolioSchema = exports.insertPriceHistorySchema = exports.insertMarketDataSchema = exports.insertAssetSchema = exports.upsertUserSchema = exports.insertUserSchema = exports.articlePages = exports.clubActivityLog = exports.clubVotes = exports.clubProposals = exports.clubPortfolios = exports.clubMemberships = exports.investmentClubs = exports.marketEvents = exports.userCourseProgress = exports.courses = exports.competitionParticipants = exports.competitionLeagues = exports.orders = exports.watchlistAssets = exports.watchlists = exports.marketIndexData = exports.marketIndices = exports.marketInsights = exports.holdings = exports.portfolios = exports.priceHistory = exports.marketData = exports.assetRelationships = exports.assets = exports.knowledgeTestResponses = exports.knowledgeTestResults = exports.userDecisions = exports.alignmentScores = exports.users = exports.sessions = exports.COMIC_ERAS = void 0;
exports.userHouseMembership = exports.mythologicalHouses = exports.insertNotificationTemplateSchema = exports.insertNotificationPreferencesSchema = exports.insertPriceAlertSchema = exports.insertNotificationSchema = exports.notificationTemplates = exports.notificationPreferences = exports.priceAlerts = exports.notifications = exports.insertBalanceSchema = exports.insertPositionSchema = exports.insertTradeSchema = exports.insertTradingVictimSchema = exports.insertMoralStandingSchema = exports.tradingVictims = exports.moralStandings = exports.balances = exports.positions = exports.trades = exports.insertTradingLimitSchema = exports.insertAssetCurrentPriceSchema = exports.insertTradingSessionSchema = exports.tradingLimits = exports.assetCurrentPrices = exports.tradingSessions = exports.volatilityHistory = exports.phase1MarketEvents = exports.insertNarrativeEventSchema = exports.narrativeEvents = exports.insertComicGradingPredictionSchema = exports.insertFeaturedComicSchema = exports.insertComicCreatorSchema = exports.insertComicIssueSchema = exports.insertComicSeriesSchema = exports.comicGradingPredictions = exports.featuredComics = exports.creatorAffiliations = exports.comicCreators = exports.comicIssues = exports.comicSeries = exports.insertBeatTheAILeaderboard = exports.beatTheAILeaderboard = exports.insertBeatTheAIPrediction = exports.beatTheAIPrediction = exports.insertBeatTheAIChallenge = exports.beatTheAIChallenge = exports.insertClubActivityLogSchema = exports.insertClubVoteSchema = exports.insertClubProposalSchema = void 0;
exports.userTrialAttempts = exports.trialsOfMastery = exports.userSkillUnlocks = exports.userLessonProgress = exports.mysticalSkills = exports.sacredLessons = exports.learningPaths = exports.insertKarmicProfileSchema = exports.insertAlignmentThresholdSchema = exports.insertTradingConsequenceSchema = exports.insertDetailedKarmaActionSchema = exports.insertAlignmentHistorySchema = exports.karmicProfiles = exports.alignmentThresholds = exports.tradingConsequences = exports.detailedKarmaActions = exports.alignmentHistory = exports.insertKarmaActionSchema = exports.insertUserAchievementSchema = exports.insertLeaderboardCategorySchema = exports.insertTraderStatsSchema = exports.karmaActions = exports.userAchievements = exports.leaderboardCategories = exports.traderStats = exports.insertUserLearnProgressSchema = exports.insertLearnModuleSchema = exports.insertMoviePerformanceDataSchema = exports.insertEnhancedComicIssueSchema = exports.insertBattleScenarioSchema = exports.insertEnhancedCharacterSchema = exports.insertKarmicActionsLogSchema = exports.insertUserKarmicAlignmentSchema = exports.insertUserHouseMembershipSchema = exports.insertMythologicalHouseSchema = exports.userLearnProgress = exports.learnModules = exports.moviePerformanceData = exports.enhancedComicIssues = exports.battleScenarios = exports.enhancedCharacters = exports.houseMarketEvents = exports.housePowerRankings = exports.sevenHouses = exports.testSessions = exports.testResults = exports.testResponses = exports.testQuestions = exports.karmicActionsLog = exports.userKarmicAlignment = void 0;
exports.integrationSyncLogs = exports.integrationWebhooks = exports.externalIntegrations = exports.insertMarketAnomalySchema = exports.insertAiOraclePersonaSchema = exports.insertUserAiInteractionSchema = exports.insertMarketIntelligenceCacheSchema = exports.insertCharacterBattleScenarioSchema = exports.insertAiMarketPredictionSchema = exports.marketAnomalies = exports.aiOraclePersonas = exports.userAiInteractions = exports.marketIntelligenceCache = exports.characterBattleScenarios = exports.aiMarketPredictions = exports.insertEasterEggUnlockSchema = exports.insertEasterEggUserProgressSchema = exports.insertEasterEggDefinitionSchema = exports.easterEggUnlocks = exports.easterEggUserProgress = exports.easterEggDefinitions = exports.insertSubscriberIncentiveHistorySchema = exports.insertSubscriberActiveBenefitsSchema = exports.insertSubscriberCourseIncentiveSchema = exports.subscriberIncentiveHistory = exports.subscriberActiveBenefits = exports.subscriberCourseIncentives = exports.insertExamAttemptSchema = exports.insertUserPathwayProgressSchema = exports.insertUserCourseEnrollmentSchema = exports.insertCertificationCourseSchema = exports.insertCareerPathwayLevelSchema = exports.examAttempts = exports.userPathwayProgress = exports.userCourseEnrollments = exports.certificationCourses = exports.careerPathwayLevels = exports.insertLearningAnalyticsSchema = exports.insertUserCertificationSchema = exports.insertDivineCertificationSchema = exports.insertUserTrialAttemptSchema = exports.insertTrialOfMasterySchema = exports.insertUserSkillUnlockSchema = exports.insertUserLessonProgressSchema = exports.insertMysticalSkillSchema = exports.insertSacredLessonSchema = exports.insertLearningPathSchema = exports.learningAnalytics = exports.userCertifications = exports.divineCertifications = void 0;
exports.insertEntityAliasSchema = exports.insertComicCoverSchema = exports.insertNarrativeTraitSchema = exports.insertNarrativeEntitySchema = exports.insertStagingRecordSchema = exports.insertRawDatasetFileSchema = exports.storyBeats = exports.narrativeTimelines = exports.ingestionErrors = exports.ingestionRuns = exports.ingestionJobs = exports.mediaPerformanceMetrics = exports.entityInteractions = exports.entityAliases = exports.comicCovers = exports.narrativeTraits = exports.narrativeEntities = exports.stagingRecords = exports.rawDatasetFiles = exports.insertVideoContentSchema = exports.insertNewsArticleSchema = exports.insertInformationTierSchema = exports.insertShortPositionSchema = exports.insertMarginAccountSchema = exports.insertOptionsChainSchema = exports.insertGlobalMarketHoursSchema = exports.insertAssetFinancialMappingSchema = exports.insertTradingFirmSchema = exports.insertImfVaultSettingsSchema = exports.videoContent = exports.newsArticles = exports.informationTiers = exports.shortPositions = exports.marginAccounts = exports.optionsChain = exports.globalMarketHours = exports.assetFinancialMapping = exports.tradingFirms = exports.imfVaultSettings = exports.insertExternalUserMappingSchema = exports.insertIntegrationAnalyticsSchema = exports.insertWorkflowExecutionSchema = exports.insertWorkflowAutomationSchema = exports.insertIntegrationSyncLogSchema = exports.insertIntegrationWebhookSchema = exports.insertExternalIntegrationSchema = exports.externalUserMappings = exports.integrationAnalytics = exports.workflowExecutions = exports.workflowAutomations = void 0;
exports.journalEntries = exports.insertShadowOrderBookSchema = exports.insertDarkPoolSchema = exports.insertShadowTradeSchema = exports.shadowOrderBook = exports.darkPools = exports.shadowTrades = exports.insertMarketComparableSchema = exports.insertGradingCertificationSchema = exports.insertCollectionStorageBoxSchema = exports.insertVariantCoverRegistrySchema = exports.insertGradedAssetProfileSchema = exports.marketComparables = exports.gradingCertifications = exports.collectionStorageBoxes = exports.variantCoverRegistry = exports.gradedAssetProfiles = exports.insertUserChallengeParticipationSchema = exports.insertCollectionChallengeSchema = exports.insertComicCollectionAchievementSchema = exports.insertTradingToolUnlockSchema = exports.insertUserHouseProgressionSchema = exports.insertHouseProgressionPathSchema = exports.insertUserProgressionStatusSchema = exports.insertUserComicCollectionSchema = exports.insertComicIssueVariantSchema = exports.userChallengeParticipation = exports.collectionChallenges = exports.comicCollectionAchievements = exports.tradingToolUnlocks = exports.userHouseProgression = exports.houseProgressionPaths = exports.userProgressionStatus = exports.userComicCollection = exports.comicIssueVariants = exports.insertNarrativeMarketEventsSchema = exports.insertStoryEventTriggersSchema = exports.insertHouseFinancialProfilesSchema = exports.insertNarrativeTradingMetricsSchema = exports.narrativeMarketEvents = exports.storyEventTriggers = exports.houseFinancialProfiles = exports.narrativeTradingMetrics = exports.insertStoryBeatSchema = exports.insertNarrativeTimelineSchema = exports.insertIngestionErrorSchema = exports.insertIngestionRunSchema = exports.insertIngestionJobSchema = exports.insertMediaPerformanceMetricSchema = exports.insertEntityInteractionSchema = void 0;
exports.comicsWorthWatching = exports.marvelGadgets = exports.marvelLocations = exports.insertMangaSeriesSchema = exports.insertMangaCreatorSchema = exports.insertMangaCharacterSchema = exports.insertMangaComicSchema = exports.mangaSeries = exports.mangaCreators = exports.mangaCharacters = exports.mangaComics = exports.otherComics = exports.dcComics = exports.marvelCreatorCredits = exports.marvelCharacterAppearances = exports.marvelRelationships = exports.marvelTeams = exports.marvelSeries = exports.marvelCreators = exports.marvelCharacters = exports.marvelComics = exports.insertArticlePageSchema = exports.insertHouseMarketEventsSchema = exports.insertHousePowerRankingsSchema = exports.insertSevenHousesSchema = exports.insertTestSessionsSchema = exports.insertTestResultsSchema = exports.insertTestResponseSchema = exports.insertTestQuestionSchema = exports.insertUserDecisionSchema = exports.insertAlignmentScoreSchema = exports.insertNpcTraderActivityLogSchema = exports.insertNpcTraderPositionSchema = exports.insertNpcTraderPsychologySchema = exports.insertNpcTraderStrategySchema = exports.insertNpcTraderSchema = exports.npcTraderActivityLog = exports.npcTraderPositions = exports.npcTraderPsychology = exports.npcTraderStrategies = exports.npcTraders = exports.insertTraderWarfareSchema = exports.insertStolenPositionSchema = exports.insertShadowTraderSchema = exports.traderWarfare = exports.stolenPositions = exports.shadowTraders = exports.insertPsychologicalProfileSchema = exports.insertJournalEntrySchema = exports.psychologicalProfiles = void 0;
exports.insertEntityAppearanceOrderSchema = exports.insertEntityNarrativeMilestoneSchema = exports.insertEntityCreatorContributionSchema = exports.insertEntityStoryArcSchema = exports.insertEntityRelationshipSchema = exports.insertEntityDataSourceSchema = exports.insertEntityAppearanceSchema = exports.insertEntityAttributeSchema = exports.insertEntityFirstAppearanceSchema = exports.insertAssetRelationshipSchema = exports.insertComicOfTheDaySchema = exports.insertComicsWorthWatchingSchema = exports.insertMarvelGadgetSchema = exports.insertMarvelLocationSchema = exports.entityAppearanceOrder = exports.entityNarrativeMilestones = exports.entityCreatorContributions = exports.entityStoryArcs = exports.entityRelationships = exports.entityDataSources = exports.entityAppearances = exports.entityAttributes = exports.entityFirstAppearances = exports.comicOfTheDay = void 0;
exports.getComicEra = getComicEra;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
// Comic Book Era Definitions - Industry Standard + Platform Extensions
exports.COMIC_ERAS = [
    { name: 'Golden Age', startYear: 1938, endYear: 1956, description: 'Superman, Batman origins' },
    { name: 'Silver Age', startYear: 1956, endYear: 1970, description: 'Marvel renaissance, Spider-Man debut' },
    { name: 'Bronze Age', startYear: 1970, endYear: 1985, description: 'Darker themes, social issues' },
    { name: 'Copper Age', startYear: 1985, endYear: 1991, description: 'Watchmen, Dark Knight Returns' },
    { name: 'Modern Age', startYear: 1992, endYear: 2004, description: 'Image Comics, creator-owned boom' },
    { name: 'Indie/Digital Age', startYear: 2005, endYear: 2010, description: 'Independent publishers rise' },
    { name: 'Post-Modern Age', startYear: 2011, endYear: new Date().getFullYear(), description: 'DC New 52, digital acceleration' },
];
function getComicEra(year) {
    for (const era of exports.COMIC_ERAS) {
        if (year >= era.startYear && year <= era.endYear) {
            return era.name;
        }
    }
    return 'Unknown Era';
}
// Session storage table for Replit Auth
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
exports.sessions = (0, pg_core_1.pgTable)("sessions", {
    sid: (0, pg_core_1.varchar)("sid").primaryKey(),
    sess: (0, pg_core_1.jsonb)("sess").notNull(),
    expire: (0, pg_core_1.timestamp)("expire").notNull(),
}, (table) => [(0, pg_core_1.index)("IDX_session_expire").on(table.expire)]);
// Users table with subscription tiers and Replit Auth integration
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Replit Auth fields  
    username: (0, pg_core_1.varchar)("username").notNull().unique(), // Required for authentication
    password: (0, pg_core_1.text)("password"), // Optional - OIDC auth doesn't use passwords
    email: (0, pg_core_1.varchar)("email").unique(),
    firstName: (0, pg_core_1.varchar)("first_name"),
    lastName: (0, pg_core_1.varchar)("last_name"),
    profileImageUrl: (0, pg_core_1.varchar)("profile_image_url"),
    // Panel Profits trading platform fields
    subscriptionTier: (0, pg_core_1.text)("subscription_tier").notNull().default("free"), // 'free', 'pro', 'elite'
    subscriptionStatus: (0, pg_core_1.text)("subscription_status").default("active"), // 'active', 'cancelled', 'past_due'
    subscriptionStartDate: (0, pg_core_1.timestamp)("subscription_start_date"),
    subscriptionEndDate: (0, pg_core_1.timestamp)("subscription_end_date"),
    stripeCustomerId: (0, pg_core_1.text)("stripe_customer_id"),
    monthlyTradingCredits: (0, pg_core_1.integer)("monthly_trading_credits").default(0),
    usedTradingCredits: (0, pg_core_1.integer)("used_trading_credits").default(0),
    competitionWins: (0, pg_core_1.integer)("competition_wins").default(0),
    competitionRanking: (0, pg_core_1.integer)("competition_ranking"),
    // Phase 1 Trading Balance & Limits
    virtualTradingBalance: (0, pg_core_1.decimal)("virtual_trading_balance", { precision: 15, scale: 2 }).default("100000.00"), // Starting virtual cash for trading
    dailyTradingLimit: (0, pg_core_1.decimal)("daily_trading_limit", { precision: 15, scale: 2 }).default("10000.00"), // Daily trading limit
    dailyTradingUsed: (0, pg_core_1.decimal)("daily_trading_used", { precision: 15, scale: 2 }).default("0.00"), // Daily trading used
    maxPositionSize: (0, pg_core_1.decimal)("max_position_size", { precision: 10, scale: 2 }).default("5000.00"), // Max single position size
    riskTolerance: (0, pg_core_1.text)("risk_tolerance").default("moderate"), // 'conservative', 'moderate', 'aggressive'
    tradingPermissions: (0, pg_core_1.jsonb)("trading_permissions").default('{"canTrade": true, "canUseMargin": false, "canShort": false}'), // Trading permissions
    lastTradingActivity: (0, pg_core_1.timestamp)("last_trading_activity"),
    tradingStreakDays: (0, pg_core_1.integer)("trading_streak_days").default(0),
    totalTradingProfit: (0, pg_core_1.decimal)("total_trading_profit", { precision: 15, scale: 2 }).default("0.00"),
    // Mythological Houses System
    houseId: (0, pg_core_1.text)("house_id"), // 'heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit'
    houseJoinedAt: (0, pg_core_1.timestamp)("house_joined_at"),
    karma: (0, pg_core_1.integer)("karma").default(0), // Karma score affecting trading bonuses
    // Karmic Alignment System - Dual axis alignment tracking
    lawfulChaoticAlignment: (0, pg_core_1.decimal)("lawful_chaotic_alignment", { precision: 8, scale: 2 }).default("0.00"), // -100 (Chaotic) to +100 (Lawful)
    goodEvilAlignment: (0, pg_core_1.decimal)("good_evil_alignment", { precision: 8, scale: 2 }).default("0.00"), // -100 (Evil) to +100 (Good)
    alignmentRevealed: (0, pg_core_1.boolean)("alignment_revealed").default(false), // Whether user has accessed Scrying Chamber
    alignmentLastUpdated: (0, pg_core_1.timestamp)("alignment_last_updated").defaultNow(),
    preferences: (0, pg_core_1.jsonb)("preferences"), // UI settings, notifications, etc.
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Hidden Alignment Tracking for Entry Test & Ongoing Behavior
exports.alignmentScores = (0, pg_core_1.pgTable)("alignment_scores", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    // Core alignment axes (normalized -100 to +100)
    ruthlessnessScore: (0, pg_core_1.decimal)("ruthlessness_score", { precision: 6, scale: 2 }).default("0.00"), // -100 (Empathetic) to +100 (Ruthless)
    individualismScore: (0, pg_core_1.decimal)("individualism_score", { precision: 6, scale: 2 }).default("0.00"), // -100 (Collective) to +100 (Individual)
    lawfulnessScore: (0, pg_core_1.decimal)("lawfulness_score", { precision: 6, scale: 2 }).default("0.00"), // -100 (Chaotic) to +100 (Lawful)  
    greedScore: (0, pg_core_1.decimal)("greed_score", { precision: 6, scale: 2 }).default("0.00"), // -100 (Restraint) to +100 (Greed)
    // Confidence multipliers (how consistent are their behaviors)
    ruthlessnessConfidence: (0, pg_core_1.decimal)("ruthlessness_confidence", { precision: 4, scale: 2 }).default("1.00"),
    individualismConfidence: (0, pg_core_1.decimal)("individualism_confidence", { precision: 4, scale: 2 }).default("1.00"),
    lawfulnessConfidence: (0, pg_core_1.decimal)("lawfulness_confidence", { precision: 4, scale: 2 }).default("1.00"),
    greedConfidence: (0, pg_core_1.decimal)("greed_confidence", { precision: 4, scale: 2 }).default("1.00"),
    // House assignment result
    assignedHouseId: (0, pg_core_1.varchar)("assigned_house_id"),
    assignmentScore: (0, pg_core_1.decimal)("assignment_score", { precision: 8, scale: 2 }), // Strength of match to house
    secondaryHouseId: (0, pg_core_1.varchar)("secondary_house_id"), // Runner-up for close calls
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// User Decision Tracking (for Entry Test and ongoing monitoring)
exports.userDecisions = (0, pg_core_1.pgTable)("user_decisions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    // Decision context
    decisionType: (0, pg_core_1.text)("decision_type").notNull(), // 'entry_test', 'trading', 'social', 'market_event'
    scenarioId: (0, pg_core_1.text)("scenario_id"), // Which scenario/situation
    choiceId: (0, pg_core_1.text)("choice_id"), // Which option they selected
    // Hidden alignment impact (not shown to user)
    ruthlessnessImpact: (0, pg_core_1.decimal)("ruthlessness_impact", { precision: 5, scale: 2 }).default("0.00"),
    individualismImpact: (0, pg_core_1.decimal)("individualism_impact", { precision: 5, scale: 2 }).default("0.00"),
    lawfulnessImpact: (0, pg_core_1.decimal)("lawfulness_impact", { precision: 5, scale: 2 }).default("0.00"),
    greedImpact: (0, pg_core_1.decimal)("greed_impact", { precision: 5, scale: 2 }).default("0.00"),
    // What the user sees (disguised as performance metrics)
    displayedScore: (0, pg_core_1.integer)("displayed_score"), // Fake "skill" score shown to user
    displayedFeedback: (0, pg_core_1.text)("displayed_feedback"), // Misleading feedback about trading acumen
    // Metadata
    responseTime: (0, pg_core_1.integer)("response_time"), // Milliseconds to decide (reveals impulsivity)
    contextData: (0, pg_core_1.jsonb)("context_data"), // Additional data about the decision
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Knowledge Test Results - Disguised as "Market Mastery Challenge"
exports.knowledgeTestResults = (0, pg_core_1.pgTable)("knowledge_test_results", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    // Visible performance metrics (what user sees)
    profitScore: (0, pg_core_1.decimal)("profit_score", { precision: 6, scale: 2 }).notNull(), // "Trading optimization" score
    performanceRating: (0, pg_core_1.text)("performance_rating").notNull(), // 'exceptional', 'strong', 'developing', 'needs_improvement'
    displayedFeedback: (0, pg_core_1.text)("displayed_feedback").notNull(), // Misleading feedback about trading prowess
    // Hidden knowledge assessment (actual purpose)
    knowledgeScore: (0, pg_core_1.decimal)("knowledge_score", { precision: 6, scale: 2 }).notNull(), // 0-100 actual financial literacy
    tier: (0, pg_core_1.text)("tier").notNull(), // 'novice', 'associate', 'trader', 'specialist', 'master'
    weakAreas: (0, pg_core_1.text)("weak_areas").array(), // Knowledge gaps identified
    strengths: (0, pg_core_1.text)("strengths").array(), // Areas of competence
    // Trading floor access control
    tradingFloorAccess: (0, pg_core_1.boolean)("trading_floor_access").default(false), // Can they trade?
    accessLevel: (0, pg_core_1.text)("access_level").default("restricted"), // 'restricted', 'basic', 'standard', 'advanced', 'unlimited'
    restrictionReason: (0, pg_core_1.text)("restriction_reason"), // Why access is limited
    // Test metadata
    completedAt: (0, pg_core_1.timestamp)("completed_at").defaultNow(),
    timeSpent: (0, pg_core_1.integer)("time_spent"), // Seconds to complete
    questionsAnswered: (0, pg_core_1.integer)("questions_answered").notNull(),
    retakeAllowedAt: (0, pg_core_1.timestamp)("retake_allowed_at"), // When they can retry
    attemptNumber: (0, pg_core_1.integer)("attempt_number").default(1),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Knowledge Test Responses - Individual question tracking
exports.knowledgeTestResponses = (0, pg_core_1.pgTable)("knowledge_test_responses", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    resultId: (0, pg_core_1.varchar)("result_id").notNull().references(() => exports.knowledgeTestResults.id),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    // Question and response
    scenarioId: (0, pg_core_1.text)("scenario_id").notNull(), // Which scenario from knowledgeTestScenarios
    choiceId: (0, pg_core_1.text)("choice_id").notNull(), // Which option they selected
    // Scoring
    knowledgeScore: (0, pg_core_1.decimal)("knowledge_score", { precision: 6, scale: 2 }).notNull(), // 0-100 for this question
    profitScore: (0, pg_core_1.decimal)("profit_score", { precision: 6, scale: 2 }).notNull(), // Fake visible score
    // Analysis
    responseTime: (0, pg_core_1.integer)("response_time"), // Milliseconds to answer
    isCorrect: (0, pg_core_1.boolean)("is_correct").notNull(), // Based on knowledge score threshold
    knowledgeAreas: (0, pg_core_1.text)("knowledge_areas").array(), // What this tested
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Asset types: characters, comics, creators, publishers
exports.assets = (0, pg_core_1.pgTable)("assets", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    symbol: (0, pg_core_1.text)("symbol").notNull().unique(),
    name: (0, pg_core_1.text)("name").notNull(),
    type: (0, pg_core_1.text)("type").notNull(), // 'character', 'comic', 'creator', 'publisher'
    description: (0, pg_core_1.text)("description"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    coverImageUrl: (0, pg_core_1.text)("cover_image_url"),
    metadata: (0, pg_core_1.jsonb)("metadata"), // Additional asset-specific data
    // Comprehensive Bio Fields
    biography: (0, pg_core_1.text)("biography"), // Detailed history and background
    keyWorks: (0, pg_core_1.text)("key_works").array(), // Notable creations or appearances
    relatedAssetIds: (0, pg_core_1.text)("related_asset_ids").array(), // Connected assets (variants, team members, etc.)
    franchiseTags: (0, pg_core_1.text)("franchise_tags").array(), // Franchises (Marvel Cinematic Universe, Batman Family, etc.)
    teamTags: (0, pg_core_1.text)("team_tags").array(), // Teams for characters (Avengers, Justice League, etc.)
    publisherTags: (0, pg_core_1.text)("publisher_tags").array(), // Publishers (Marvel, DC, Image, etc.)
    notableAppearances: (0, pg_core_1.text)("notable_appearances").array(), // Key storylines and events
    // Seven Houses control
    houseId: (0, pg_core_1.varchar)("house_id").references(() => exports.sevenHouses.id), // Which house controls this asset
    houseInfluencePercent: (0, pg_core_1.decimal)("house_influence_percent", { precision: 5, scale: 2 }).default("0.00"), // 0-100%
    narrativeWeight: (0, pg_core_1.decimal)("narrative_weight", { precision: 5, scale: 2 }).default("50.00"), // How story events affect price
    controlledSince: (0, pg_core_1.timestamp)("controlled_since"), // When house took control
    previousHouseId: (0, pg_core_1.varchar)("previous_house_id"), // Previous controller for history
    // Vector embeddings for semantic search and recommendations
    metadataEmbedding: (0, pg_core_1.vector)("metadata_embedding", { dimensions: 1536 }), // OpenAI ada-002 embedding dimensions
    // Verification tracking
    verificationStatus: (0, pg_core_1.text)("verification_status"), // 'verified', 'unverified', 'failed'
    primaryDataSource: (0, pg_core_1.text)("primary_data_source"), // 'comic_vine', 'superhero_api', 'marvel_api', etc.
    lastVerifiedAt: (0, pg_core_1.timestamp)("last_verified_at"),
    verificationMetadata: (0, pg_core_1.jsonb)("verification_metadata"), // Source IDs, confidence scores, etc.
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Asset Relationships - Junction table for structured many-to-many relationships
exports.assetRelationships = (0, pg_core_1.pgTable)("asset_relationships", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    sourceAssetId: (0, pg_core_1.varchar)("source_asset_id").notNull().references(() => exports.assets.id),
    targetAssetId: (0, pg_core_1.varchar)("target_asset_id").notNull().references(() => exports.assets.id),
    // Relationship classification
    relationshipType: (0, pg_core_1.text)("relationship_type").notNull(), // 'teammate', 'enemy', 'creator', 'location', 'gadget', 'franchise', 'appears_in', 'uses', 'ally', 'rival'
    relationshipStrength: (0, pg_core_1.decimal)("relationship_strength", { precision: 3, scale: 2 }).default("0.50"), // 0.00 to 1.00 (importance/weight)
    // Context and metadata
    firstAppearance: (0, pg_core_1.text)("first_appearance"), // Comic/issue where relationship established
    firstAppearanceComicId: (0, pg_core_1.varchar)("first_appearance_comic_id"),
    keyIssues: (0, pg_core_1.text)("key_issues").array(), // Notable issues featuring this relationship
    description: (0, pg_core_1.text)("description"), // Brief description of the relationship
    // Additional context
    metadata: (0, pg_core_1.jsonb)("metadata"), // Flexible data: duration, status (active/former), context, etc.
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_asset_rel_source").on(table.sourceAssetId),
    (0, pg_core_1.index)("idx_asset_rel_target").on(table.targetAssetId),
    (0, pg_core_1.index)("idx_asset_rel_type").on(table.relationshipType),
    (0, pg_core_1.index)("idx_asset_rel_source_type").on(table.sourceAssetId, table.relationshipType),
]);
// Market data for OHLC candlestick data and technical indicators
exports.marketData = (0, pg_core_1.pgTable)("market_data", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    timeframe: (0, pg_core_1.text)("timeframe").notNull(), // '1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M'
    periodStart: (0, pg_core_1.timestamp)("period_start").notNull(), // Start of the time period
    open: (0, pg_core_1.decimal)("open", { precision: 10, scale: 2 }).notNull(),
    high: (0, pg_core_1.decimal)("high", { precision: 10, scale: 2 }).notNull(),
    low: (0, pg_core_1.decimal)("low", { precision: 10, scale: 2 }).notNull(),
    close: (0, pg_core_1.decimal)("close", { precision: 10, scale: 2 }).notNull(),
    volume: (0, pg_core_1.integer)("volume").notNull(),
    change: (0, pg_core_1.decimal)("change", { precision: 10, scale: 2 }),
    percentChange: (0, pg_core_1.decimal)("percent_change", { precision: 8, scale: 2 }),
    marketCap: (0, pg_core_1.decimal)("market_cap", { precision: 15, scale: 2 }),
    technicalIndicators: (0, pg_core_1.jsonb)("technical_indicators"), // RSI, MACD, SMA, EMA, etc.
    // Vector embeddings for price pattern recognition and similarity matching
    pricePatternEmbedding: (0, pg_core_1.vector)("price_pattern_embedding", { dimensions: 1536 }), // Price movement pattern vectors
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Price History - Historical price snapshots with CGC grading support
exports.priceHistory = (0, pg_core_1.pgTable)("price_history", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    grade: (0, pg_core_1.text)("grade").notNull(), // 'ungraded', 'cgc-4.0', 'cgc-4.5', 'cgc-6.0', 'cgc-6.5', 'cgc-8.0', 'cgc-8.5', 'cgc-9.2', 'cgc-9.8', 'cgc-10.0'
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    source: (0, pg_core_1.text)("source").notNull(), // 'pricecharting', 'calculated', 'market'
    snapshotDate: (0, pg_core_1.timestamp)("snapshot_date").notNull(),
    metadata: (0, pg_core_1.jsonb)("metadata"), // Additional data like sales volume, market conditions, etc.
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_price_history_asset_grade_date").on(table.assetId, table.grade, table.snapshotDate),
    (0, pg_core_1.index)("idx_price_history_snapshot_date").on(table.snapshotDate),
]);
// Portfolio holdings for users
exports.portfolios = (0, pg_core_1.pgTable)("portfolios", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    totalValue: (0, pg_core_1.decimal)("total_value", { precision: 15, scale: 2 }),
    dayChange: (0, pg_core_1.decimal)("day_change", { precision: 10, scale: 2 }),
    dayChangePercent: (0, pg_core_1.decimal)("day_change_percent", { precision: 8, scale: 2 }),
    totalReturn: (0, pg_core_1.decimal)("total_return", { precision: 10, scale: 2 }),
    totalReturnPercent: (0, pg_core_1.decimal)("total_return_percent", { precision: 8, scale: 2 }),
    diversificationScore: (0, pg_core_1.decimal)("diversification_score", { precision: 3, scale: 1 }),
    // Phase 1 Portfolio Cash Management
    cashBalance: (0, pg_core_1.decimal)("cash_balance", { precision: 15, scale: 2 }).default("100000.00"), // Available cash for trading
    initialCashAllocation: (0, pg_core_1.decimal)("initial_cash_allocation", { precision: 15, scale: 2 }).default("100000.00"), // Initial starting amount
    portfolioType: (0, pg_core_1.text)("portfolio_type").default("default"), // 'default', 'custom', 'competition'
    isDefault: (0, pg_core_1.boolean)("is_default").default(false), // True for user's default trading portfolio
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Individual holdings within portfolios
exports.holdings = (0, pg_core_1.pgTable)("holdings", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    portfolioId: (0, pg_core_1.varchar)("portfolio_id").notNull().references(() => exports.portfolios.id),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    quantity: (0, pg_core_1.decimal)("quantity", { precision: 10, scale: 4 }).notNull(),
    averageCost: (0, pg_core_1.decimal)("average_cost", { precision: 10, scale: 2 }).notNull(),
    currentValue: (0, pg_core_1.decimal)("current_value", { precision: 10, scale: 2 }),
    unrealizedGainLoss: (0, pg_core_1.decimal)("unrealized_gain_loss", { precision: 10, scale: 2 }),
    unrealizedGainLossPercent: (0, pg_core_1.decimal)("unrealized_gain_loss_percent", { precision: 8, scale: 2 }),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// AI-powered market insights and sentiment analysis
exports.marketInsights = (0, pg_core_1.pgTable)("market_insights", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    assetId: (0, pg_core_1.varchar)("asset_id").references(() => exports.assets.id),
    title: (0, pg_core_1.text)("title").notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    sentimentScore: (0, pg_core_1.decimal)("sentiment_score", { precision: 3, scale: 2 }), // -1 to 1
    confidence: (0, pg_core_1.decimal)("confidence", { precision: 3, scale: 2 }), // 0 to 1
    tags: (0, pg_core_1.text)("tags").array(),
    source: (0, pg_core_1.text)("source"), // AI model, news, social media, etc.
    videoUrl: (0, pg_core_1.text)("video_url"),
    thumbnailUrl: (0, pg_core_1.text)("thumbnail_url"),
    category: (0, pg_core_1.text)("category"), // 'bullish', 'bearish', 'neutral', 'alert'
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    expiresAt: (0, pg_core_1.timestamp)("expires_at"),
    // Vector embeddings for semantic search through market insights and analysis
    contentEmbedding: (0, pg_core_1.vector)("content_embedding", { dimensions: 1536 }), // Content semantic vectors for search
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Market indices (PPIx 50, PPIx 100, etc.)
exports.marketIndices = (0, pg_core_1.pgTable)("market_indices", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    symbol: (0, pg_core_1.text)("symbol").notNull().unique(),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    indexType: (0, pg_core_1.text)("index_type").notNull(), // 'ppix50', 'ppix100', 'custom'
    methodology: (0, pg_core_1.text)("methodology"), // Explanation of how index is calculated
    constituents: (0, pg_core_1.jsonb)("constituents"), // Array of asset IDs with weights
    rebalanceFrequency: (0, pg_core_1.text)("rebalance_frequency").default("monthly"), // 'daily', 'weekly', 'monthly', 'quarterly'
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Historical market index data for time-series analysis
exports.marketIndexData = (0, pg_core_1.pgTable)("market_index_data", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    indexId: (0, pg_core_1.varchar)("index_id").notNull().references(() => exports.marketIndices.id),
    timeframe: (0, pg_core_1.text)("timeframe").notNull(), // '1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M'
    periodStart: (0, pg_core_1.timestamp)("period_start").notNull(),
    open: (0, pg_core_1.decimal)("open", { precision: 10, scale: 2 }).notNull(),
    high: (0, pg_core_1.decimal)("high", { precision: 10, scale: 2 }).notNull(),
    low: (0, pg_core_1.decimal)("low", { precision: 10, scale: 2 }).notNull(),
    close: (0, pg_core_1.decimal)("close", { precision: 10, scale: 2 }).notNull(),
    volume: (0, pg_core_1.integer)("volume"),
    change: (0, pg_core_1.decimal)("change", { precision: 10, scale: 2 }),
    percentChange: (0, pg_core_1.decimal)("percent_change", { precision: 8, scale: 2 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Watchlists for users to track assets
exports.watchlists = (0, pg_core_1.pgTable)("watchlists", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    isDefault: (0, pg_core_1.boolean)("is_default").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Assets within watchlists
exports.watchlistAssets = (0, pg_core_1.pgTable)("watchlist_assets", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    watchlistId: (0, pg_core_1.varchar)("watchlist_id").notNull().references(() => exports.watchlists.id),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    addedAt: (0, pg_core_1.timestamp)("added_at").defaultNow(),
});
// Trading orders and transactions
exports.orders = (0, pg_core_1.pgTable)("orders", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    portfolioId: (0, pg_core_1.varchar)("portfolio_id").notNull().references(() => exports.portfolios.id),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    type: (0, pg_core_1.text)("type").notNull(), // 'buy', 'sell'
    side: (0, pg_core_1.text)("side").notNull(), // 'buy', 'sell' - alias for type for compatibility
    orderType: (0, pg_core_1.text)("order_type").notNull(), // 'market', 'limit', 'stop'
    quantity: (0, pg_core_1.decimal)("quantity", { precision: 10, scale: 4 }).notNull(),
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }),
    totalValue: (0, pg_core_1.decimal)("total_value", { precision: 10, scale: 2 }),
    status: (0, pg_core_1.text)("status").notNull(), // 'pending', 'filled', 'cancelled', 'partially_filled'
    // Phase 1 Enhanced Order Execution Tracking
    filledQuantity: (0, pg_core_1.decimal)("filled_quantity", { precision: 10, scale: 4 }).default("0"),
    averageFillPrice: (0, pg_core_1.decimal)("average_fill_price", { precision: 10, scale: 2 }),
    fees: (0, pg_core_1.decimal)("fees", { precision: 10, scale: 2 }).default("0.00"), // Trading fees/commissions
    stopLossPrice: (0, pg_core_1.decimal)("stop_loss_price", { precision: 10, scale: 2 }), // Stop loss level
    takeProfitPrice: (0, pg_core_1.decimal)("take_profit_price", { precision: 10, scale: 2 }), // Take profit level
    orderExpiry: (0, pg_core_1.timestamp)("order_expiry"), // Order expiration time
    executionDetails: (0, pg_core_1.jsonb)("execution_details"), // Detailed execution information
    rejectionReason: (0, pg_core_1.text)("rejection_reason"), // Reason if order was rejected
    filledAt: (0, pg_core_1.timestamp)("filled_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// AI vs Human competition leagues
exports.competitionLeagues = (0, pg_core_1.pgTable)("competition_leagues", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    season: (0, pg_core_1.text)("season").notNull(), // 'Q1-2025', 'Q2-2025', etc.
    entryFee: (0, pg_core_1.decimal)("entry_fee", { precision: 10, scale: 2 }).default("0"),
    prizePool: (0, pg_core_1.decimal)("prize_pool", { precision: 10, scale: 2 }).default("0"),
    maxParticipants: (0, pg_core_1.integer)("max_participants").default(100),
    currentParticipants: (0, pg_core_1.integer)("current_participants").default(0),
    startDate: (0, pg_core_1.timestamp)("start_date").notNull(),
    endDate: (0, pg_core_1.timestamp)("end_date").notNull(),
    status: (0, pg_core_1.text)("status").notNull().default("upcoming"), // 'upcoming', 'active', 'completed'
    rules: (0, pg_core_1.jsonb)("rules"), // Competition rules and constraints
    aiOpponents: (0, pg_core_1.jsonb)("ai_opponents"), // AI trading strategies and personalities
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Competition participants and their performance
exports.competitionParticipants = (0, pg_core_1.pgTable)("competition_participants", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    leagueId: (0, pg_core_1.varchar)("league_id").notNull().references(() => exports.competitionLeagues.id),
    userId: (0, pg_core_1.varchar)("user_id").references(() => exports.users.id), // null for AI participants
    participantType: (0, pg_core_1.text)("participant_type").notNull(), // 'human', 'ai'
    participantName: (0, pg_core_1.text)("participant_name").notNull(),
    aiStrategy: (0, pg_core_1.text)("ai_strategy"), // For AI participants
    portfolioValue: (0, pg_core_1.decimal)("portfolio_value", { precision: 15, scale: 2 }).default("100000"),
    totalReturn: (0, pg_core_1.decimal)("total_return", { precision: 10, scale: 2 }).default("0"),
    totalReturnPercent: (0, pg_core_1.decimal)("total_return_percent", { precision: 8, scale: 2 }).default("0"),
    currentRank: (0, pg_core_1.integer)("current_rank"),
    trades: (0, pg_core_1.integer)("trades").default(0),
    winRate: (0, pg_core_1.decimal)("win_rate", { precision: 8, scale: 2 }),
    riskScore: (0, pg_core_1.decimal)("risk_score", { precision: 3, scale: 1 }),
    joinedAt: (0, pg_core_1.timestamp)("joined_at").defaultNow(),
});
// Educational courses and content
exports.courses = (0, pg_core_1.pgTable)("courses", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description"),
    category: (0, pg_core_1.text)("category").notNull(), // 'pressing', 'grading', 'investing', 'collection'
    difficulty: (0, pg_core_1.text)("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
    requiredTier: (0, pg_core_1.text)("required_tier").notNull().default("free"), // 'free', 'pro', 'elite'
    duration: (0, pg_core_1.integer)("duration"), // Duration in minutes
    modules: (0, pg_core_1.jsonb)("modules"), // Course modules and content
    prerequisites: (0, pg_core_1.text)("prerequisites").array(),
    learningOutcomes: (0, pg_core_1.text)("learning_outcomes").array(),
    thumbnailUrl: (0, pg_core_1.text)("thumbnail_url"),
    videoUrl: (0, pg_core_1.text)("video_url"),
    isPublished: (0, pg_core_1.boolean)("is_published").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// User course progress and certifications
exports.userCourseProgress = (0, pg_core_1.pgTable)("user_course_progress", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    courseId: (0, pg_core_1.varchar)("course_id").notNull().references(() => exports.courses.id),
    progress: (0, pg_core_1.decimal)("progress", { precision: 8, scale: 2 }).default("0"), // 0-100%
    currentModule: (0, pg_core_1.integer)("current_module").default(1),
    completedModules: (0, pg_core_1.integer)("completed_modules").array(),
    timeSpent: (0, pg_core_1.integer)("time_spent").default(0), // Minutes
    quizScores: (0, pg_core_1.jsonb)("quiz_scores"),
    certificateEarned: (0, pg_core_1.boolean)("certificate_earned").default(false),
    certificateUrl: (0, pg_core_1.text)("certificate_url"),
    startedAt: (0, pg_core_1.timestamp)("started_at").defaultNow(),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
});
// Market events that affect asset prices
exports.marketEvents = (0, pg_core_1.pgTable)("market_events", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description"),
    category: (0, pg_core_1.text)("category"), // 'movie', 'tv', 'comic_release', 'convention', etc.
    impact: (0, pg_core_1.text)("impact"), // 'positive', 'negative', 'neutral'
    significance: (0, pg_core_1.decimal)("significance", { precision: 2, scale: 1 }), // Impact significance 1-10
    affectedAssets: (0, pg_core_1.text)("affected_assets").array(), // Asset IDs
    eventDate: (0, pg_core_1.timestamp)("event_date"),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Investment Clubs - Collaborative trading clubs
exports.investmentClubs = (0, pg_core_1.pgTable)("investment_clubs", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull(),
    ownerId: (0, pg_core_1.varchar)("owner_id").notNull().references(() => exports.users.id),
    description: (0, pg_core_1.text)("description"),
    minMembers: (0, pg_core_1.integer)("min_members").default(3),
    minMonthsPositiveReturns: (0, pg_core_1.integer)("min_months_positive_returns").default(3),
    status: (0, pg_core_1.text)("status").notNull().default("active"), // 'active', 'suspended', 'dissolved'
    totalValue: (0, pg_core_1.decimal)("total_value", { precision: 15, scale: 2 }),
    monthlyReturns: (0, pg_core_1.decimal)("monthly_returns", { precision: 8, scale: 2 }).array(), // Track last 12 months
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    dissolvedAt: (0, pg_core_1.timestamp)("dissolved_at"),
});
// Club memberships - Member roster for investment clubs
exports.clubMemberships = (0, pg_core_1.pgTable)("club_memberships", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    clubId: (0, pg_core_1.varchar)("club_id").notNull().references(() => exports.investmentClubs.id),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    role: (0, pg_core_1.text)("role").notNull().default("member"), // 'owner', 'admin', 'member'
    contributionAmount: (0, pg_core_1.decimal)("contribution_amount", { precision: 15, scale: 2 }),
    sharePercentage: (0, pg_core_1.decimal)("share_percentage", { precision: 5, scale: 2 }),
    joinedAt: (0, pg_core_1.timestamp)("joined_at").defaultNow(),
    leftAt: (0, pg_core_1.timestamp)("left_at"),
    status: (0, pg_core_1.text)("status").notNull().default("active"), // 'active', 'removed', 'left'
});
// Club portfolios - Dedicated portfolio for club trades
exports.clubPortfolios = (0, pg_core_1.pgTable)("club_portfolios", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    clubId: (0, pg_core_1.varchar)("club_id").notNull().references(() => exports.investmentClubs.id),
    portfolioId: (0, pg_core_1.varchar)("portfolio_id").notNull().references(() => exports.portfolios.id),
    totalValue: (0, pg_core_1.decimal)("total_value", { precision: 15, scale: 2 }),
    cashBalance: (0, pg_core_1.decimal)("cash_balance", { precision: 15, scale: 2 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Club proposals - Trade proposals requiring votes
exports.clubProposals = (0, pg_core_1.pgTable)("club_proposals", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    clubId: (0, pg_core_1.varchar)("club_id").notNull().references(() => exports.investmentClubs.id),
    proposerId: (0, pg_core_1.varchar)("proposer_id").notNull().references(() => exports.users.id),
    proposalType: (0, pg_core_1.text)("proposal_type").notNull(), // 'buy', 'sell', 'transfer_funds', 'change_rules'
    assetId: (0, pg_core_1.varchar)("asset_id").references(() => exports.assets.id),
    quantity: (0, pg_core_1.integer)("quantity"),
    targetPrice: (0, pg_core_1.decimal)("target_price", { precision: 10, scale: 2 }),
    rationale: (0, pg_core_1.text)("rationale"),
    status: (0, pg_core_1.text)("status").notNull().default("pending"), // 'pending', 'approved', 'rejected', 'executed', 'expired'
    votesFor: (0, pg_core_1.integer)("votes_for").default(0),
    votesAgainst: (0, pg_core_1.integer)("votes_against").default(0),
    votesNeeded: (0, pg_core_1.integer)("votes_needed").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at"),
    executedAt: (0, pg_core_1.timestamp)("executed_at"),
});
// Club votes - Individual member votes on proposals
exports.clubVotes = (0, pg_core_1.pgTable)("club_votes", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    proposalId: (0, pg_core_1.varchar)("proposal_id").notNull().references(() => exports.clubProposals.id),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    vote: (0, pg_core_1.text)("vote").notNull(), // 'for', 'against', 'abstain'
    votedAt: (0, pg_core_1.timestamp)("voted_at").defaultNow(),
});
// Club activity log - Audit trail for club actions
exports.clubActivityLog = (0, pg_core_1.pgTable)("club_activity_log", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    clubId: (0, pg_core_1.varchar)("club_id").notNull().references(() => exports.investmentClubs.id),
    actionType: (0, pg_core_1.text)("action_type").notNull(), // 'proposal_created', 'vote_cast', 'proposal_executed', 'member_joined', 'member_left', 'funds_deposited', 'funds_withdrawn', 'status_changed'
    userId: (0, pg_core_1.varchar)("user_id").references(() => exports.users.id),
    details: (0, pg_core_1.jsonb)("details"),
    timestamp: (0, pg_core_1.timestamp)("timestamp").defaultNow(),
});
// Article Pages - Full blog-length articles linked from news ticker
exports.articlePages = (0, pg_core_1.pgTable)("article_pages", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    slug: (0, pg_core_1.text)("slug").notNull().unique(), // URL-friendly identifier
    title: (0, pg_core_1.text)("title").notNull(),
    content: (0, pg_core_1.text)("content").notNull(), // Full article content in markdown or HTML
    excerpt: (0, pg_core_1.text)("excerpt"), // Short summary for listings
    author: (0, pg_core_1.text)("author"), // Reporter/author name
    source: (0, pg_core_1.text)("source"), // Source publication/organization
    publishedDate: (0, pg_core_1.timestamp)("published_date").notNull(),
    featuredImage: (0, pg_core_1.text)("featured_image"), // Image URL
    tags: (0, pg_core_1.text)("tags").array(), // Topic tags for categorization
    category: (0, pg_core_1.text)("category").default("market_news"), // 'market_news', 'character_spotlight', 'creator_profile', 'industry_analysis'
    viewCount: (0, pg_core_1.integer)("view_count").default(0),
    featured: (0, pg_core_1.boolean)("featured").default(false), // Show in featured section
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Create insert schemas for all tables
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// Schema for Replit Auth upsert operations
exports.upsertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).pick({
    id: true,
    username: true,
    email: true,
    firstName: true,
    lastName: true,
    profileImageUrl: true,
});
exports.insertAssetSchema = (0, drizzle_zod_1.createInsertSchema)(exports.assets).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertMarketDataSchema = (0, drizzle_zod_1.createInsertSchema)(exports.marketData).omit({
    id: true,
    createdAt: true,
});
exports.insertPriceHistorySchema = (0, drizzle_zod_1.createInsertSchema)(exports.priceHistory).omit({
    id: true,
    createdAt: true,
});
exports.insertPortfolioSchema = (0, drizzle_zod_1.createInsertSchema)(exports.portfolios).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertHoldingSchema = (0, drizzle_zod_1.createInsertSchema)(exports.holdings).omit({
    id: true,
    updatedAt: true,
});
exports.insertMarketInsightSchema = (0, drizzle_zod_1.createInsertSchema)(exports.marketInsights).omit({
    id: true,
    createdAt: true,
});
exports.insertMarketIndexSchema = (0, drizzle_zod_1.createInsertSchema)(exports.marketIndices).omit({
    id: true,
    createdAt: true,
});
exports.insertMarketIndexDataSchema = (0, drizzle_zod_1.createInsertSchema)(exports.marketIndexData).omit({
    id: true,
    createdAt: true,
});
exports.insertWatchlistSchema = (0, drizzle_zod_1.createInsertSchema)(exports.watchlists).omit({
    id: true,
    createdAt: true,
});
exports.insertWatchlistAssetSchema = (0, drizzle_zod_1.createInsertSchema)(exports.watchlistAssets).omit({
    id: true,
    addedAt: true,
});
exports.insertOrderSchema = (0, drizzle_zod_1.createInsertSchema)(exports.orders).omit({
    id: true,
    createdAt: true,
    filledAt: true,
}).refine((data) => {
    // Validate limit orders require a valid price
    if (data.orderType === 'limit' && (!data.price || parseFloat(data.price.toString()) <= 0)) {
        return false;
    }
    return true;
}, {
    message: 'Limit price is required for limit orders and must be greater than 0',
    path: ['price']
});
exports.insertMarketEventSchema = (0, drizzle_zod_1.createInsertSchema)(exports.marketEvents).omit({
    id: true,
    createdAt: true,
});
// Knowledge Test insert schemas
exports.insertKnowledgeTestResultSchema = (0, drizzle_zod_1.createInsertSchema)(exports.knowledgeTestResults).omit({
    id: true,
    createdAt: true,
    completedAt: true,
});
exports.insertKnowledgeTestResponseSchema = (0, drizzle_zod_1.createInsertSchema)(exports.knowledgeTestResponses).omit({
    id: true,
    createdAt: true,
});
// Investment Club insert schemas
exports.insertInvestmentClubSchema = (0, drizzle_zod_1.createInsertSchema)(exports.investmentClubs).omit({
    id: true,
    createdAt: true,
});
exports.insertClubMembershipSchema = (0, drizzle_zod_1.createInsertSchema)(exports.clubMemberships).omit({
    id: true,
    joinedAt: true,
});
exports.insertClubPortfolioSchema = (0, drizzle_zod_1.createInsertSchema)(exports.clubPortfolios).omit({
    id: true,
    createdAt: true,
});
exports.insertClubProposalSchema = (0, drizzle_zod_1.createInsertSchema)(exports.clubProposals).omit({
    id: true,
    createdAt: true,
    executedAt: true,
});
exports.insertClubVoteSchema = (0, drizzle_zod_1.createInsertSchema)(exports.clubVotes).omit({
    id: true,
    votedAt: true,
});
exports.insertClubActivityLogSchema = (0, drizzle_zod_1.createInsertSchema)(exports.clubActivityLog).omit({
    id: true,
    timestamp: true,
});
// Beat the AI Challenge Schema
exports.beatTheAIChallenge = (0, pg_core_1.pgTable)('beat_the_ai_challenges', {
    id: (0, pg_core_1.varchar)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    title: (0, pg_core_1.text)('title').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    targetAssets: (0, pg_core_1.text)('target_assets').array().notNull(),
    startDate: (0, pg_core_1.timestamp)('start_date').notNull(),
    endDate: (0, pg_core_1.timestamp)('end_date').notNull(),
    prizePool: (0, pg_core_1.decimal)('prize_pool', { precision: 10, scale: 2 }).notNull(),
    participantCount: (0, pg_core_1.integer)('participant_count').default(0),
    aiPrediction: (0, pg_core_1.decimal)('ai_prediction', { precision: 8, scale: 2 }).notNull(),
    status: (0, pg_core_1.text)('status', { enum: ['ACTIVE', 'UPCOMING', 'COMPLETED'] }).notNull().default('ACTIVE'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull()
});
exports.insertBeatTheAIChallenge = (0, drizzle_zod_1.createInsertSchema)(exports.beatTheAIChallenge).omit({
    id: true,
    createdAt: true,
    updatedAt: true
});
// Beat the AI Prediction Submission Schema
exports.beatTheAIPrediction = (0, pg_core_1.pgTable)('beat_the_ai_predictions', {
    id: (0, pg_core_1.varchar)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    challengeId: (0, pg_core_1.varchar)('challenge_id').references(() => exports.beatTheAIChallenge.id).notNull(),
    userId: (0, pg_core_1.varchar)('user_id').notNull(),
    username: (0, pg_core_1.text)('username').notNull(),
    assetSymbol: (0, pg_core_1.text)('asset_symbol').notNull(),
    predictedChange: (0, pg_core_1.decimal)('predicted_change', { precision: 8, scale: 2 }).notNull(),
    submissionTime: (0, pg_core_1.timestamp)('submission_time').defaultNow().notNull(),
    actualChange: (0, pg_core_1.decimal)('actual_change', { precision: 8, scale: 2 }),
    score: (0, pg_core_1.decimal)('score', { precision: 8, scale: 2 }),
    isWinner: (0, pg_core_1.boolean)('is_winner').default(false)
});
exports.insertBeatTheAIPrediction = (0, drizzle_zod_1.createInsertSchema)(exports.beatTheAIPrediction).omit({
    id: true,
    submissionTime: true,
    actualChange: true,
    score: true,
    isWinner: true
});
// Beat the AI Leaderboard Schema  
exports.beatTheAILeaderboard = (0, pg_core_1.pgTable)('beat_the_ai_leaderboard', {
    id: (0, pg_core_1.varchar)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)('user_id').notNull(),
    username: (0, pg_core_1.text)('username').notNull(),
    totalScore: (0, pg_core_1.decimal)('total_score', { precision: 10, scale: 2 }).default('0'),
    accuracy: (0, pg_core_1.decimal)('accuracy', { precision: 8, scale: 2 }).default('0'),
    totalPredictions: (0, pg_core_1.integer)('total_predictions').default(0),
    winnings: (0, pg_core_1.decimal)('winnings', { precision: 10, scale: 2 }).default('0'),
    rank: (0, pg_core_1.integer)('rank').default(0),
    lastActive: (0, pg_core_1.timestamp)('last_active').defaultNow().notNull()
});
exports.insertBeatTheAILeaderboard = (0, drizzle_zod_1.createInsertSchema)(exports.beatTheAILeaderboard).omit({
    id: true,
    lastActive: true
});
// Comic Series - Information about comic book series (from comic_list CSV)
exports.comicSeries = (0, pg_core_1.pgTable)("comic_series", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    seriesName: (0, pg_core_1.text)("series_name").notNull(),
    publisher: (0, pg_core_1.text)("publisher").notNull(), // Marvel, DC, etc.
    year: (0, pg_core_1.integer)("year"),
    issueCount: (0, pg_core_1.text)("issue_count"), // "73 issues (73 indexed)"
    coverStatus: (0, pg_core_1.text)("cover_status"), // "Gallery", "Have 8 (Need 2)"
    publishedPeriod: (0, pg_core_1.text)("published_period"), // "March 1941 - July 1949"
    seriesUrl: (0, pg_core_1.text)("series_url"), // Link to comics.org series page
    coversUrl: (0, pg_core_1.text)("covers_url"), // Link to covers gallery
    scansUrl: (0, pg_core_1.text)("scans_url"), // Link to scans if available
    featuredCoverUrl: (0, pg_core_1.text)("featured_cover_url"), // Featured cover image for display
    description: (0, pg_core_1.text)("description"),
    // Vector embeddings for series search and recommendations
    seriesEmbedding: (0, pg_core_1.vector)("series_embedding", { dimensions: 1536 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Comic Issues - Individual comic book issues (from Marvel_Comics 2 CSV)
exports.comicIssues = (0, pg_core_1.pgTable)("comic_issues", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    seriesId: (0, pg_core_1.varchar)("series_id").references(() => exports.comicSeries.id),
    comicName: (0, pg_core_1.text)("comic_name").notNull(),
    activeYears: (0, pg_core_1.text)("active_years"), // "(2016)" or "(2012 - 2014)"
    issueTitle: (0, pg_core_1.text)("issue_title").notNull(),
    publishDate: (0, pg_core_1.text)("publish_date"), // "April 01, 2016"
    issueDescription: (0, pg_core_1.text)("issue_description"),
    penciler: (0, pg_core_1.text)("penciler"),
    writer: (0, pg_core_1.text)("writer"),
    coverArtist: (0, pg_core_1.text)("cover_artist"),
    imprint: (0, pg_core_1.text)("imprint"), // "Marvel Universe"
    format: (0, pg_core_1.text)("format"), // "Comic", "Infinite Comic"
    rating: (0, pg_core_1.text)("rating"), // "Rated T+"
    price: (0, pg_core_1.text)("price"), // "$3.99", "Free"
    coverImageUrl: (0, pg_core_1.text)("cover_image_url"), // Generated or extracted cover URL
    issueNumber: (0, pg_core_1.integer)("issue_number"),
    volume: (0, pg_core_1.integer)("volume"),
    // Market data
    currentValue: (0, pg_core_1.decimal)("current_value", { precision: 10, scale: 2 }),
    gradeCondition: (0, pg_core_1.text)("grade_condition"), // CGC grade if known
    marketTrend: (0, pg_core_1.text)("market_trend"), // 'up', 'down', 'stable'
    // Vector embeddings for content search and recommendations
    contentEmbedding: (0, pg_core_1.vector)("content_embedding", { dimensions: 1536 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Comic Creators - Artists, writers, and other creators
exports.comicCreators = (0, pg_core_1.pgTable)("comic_creators", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull(),
    role: (0, pg_core_1.text)("role").notNull(), // 'writer', 'penciler', 'inker', 'colorist', 'cover_artist', 'editor'
    biography: (0, pg_core_1.text)("biography"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    birthDate: (0, pg_core_1.text)("birth_date"),
    deathDate: (0, pg_core_1.text)("death_date"), // If applicable
    nationality: (0, pg_core_1.text)("nationality"),
    // Career statistics
    totalIssues: (0, pg_core_1.integer)("total_issues").default(0),
    activeYears: (0, pg_core_1.text)("active_years"), // "1960-2020"
    notableWorks: (0, pg_core_1.text)("notable_works").array(),
    awards: (0, pg_core_1.text)("awards").array(),
    // Market influence
    marketInfluence: (0, pg_core_1.decimal)("market_influence", { precision: 8, scale: 2 }), // 0-100 score
    trendingScore: (0, pg_core_1.decimal)("trending_score", { precision: 8, scale: 2 }), // Current trending
    // Vector embeddings for creator search and style matching
    creatorEmbedding: (0, pg_core_1.vector)("creator_embedding", { dimensions: 1536 }),
    // Verification tracking
    verificationStatus: (0, pg_core_1.text)("verification_status"), // 'verified', 'unverified', 'failed'
    primaryDataSource: (0, pg_core_1.text)("primary_data_source"), // 'comic_vine', 'marvel_api', etc.
    lastVerifiedAt: (0, pg_core_1.timestamp)("last_verified_at"),
    verificationMetadata: (0, pg_core_1.jsonb)("verification_metadata"), // Source IDs, confidence scores, etc.
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Creator Affiliations - Track which publishers each creator worked with
// Enables creator-per-publisher assets (LEE_STAN.MRVL, LEE_STAN.TIME, etc.)
exports.creatorAffiliations = (0, pg_core_1.pgTable)("creator_affiliations", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    creatorName: (0, pg_core_1.text)("creator_name").notNull(), // Full name (e.g., "Stan Lee", "Jack Kirby")
    publisherCode: (0, pg_core_1.text)("publisher_code").notNull(), // Abbreviated code (MRVL, DC, TIME, etc.)
    publisherFullName: (0, pg_core_1.text)("publisher_full_name").notNull(), // Full publisher name
    // Work statistics at this publisher
    workCount: (0, pg_core_1.integer)("work_count").default(0), // Number of works at this publisher
    firstWork: (0, pg_core_1.text)("first_work"), // First known work at publisher
    lastWork: (0, pg_core_1.text)("last_work"), // Last known work at publisher
    yearsActive: (0, pg_core_1.text)("years_active"), // "1961-1972"
    notableWorks: (0, pg_core_1.text)("notable_works").array(), // Key works at this publisher
    // Metadata
    sourceData: (0, pg_core_1.jsonb)("source_data"), // Raw data from expansion services
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Featured Comics - Curated selections for homepage display
exports.featuredComics = (0, pg_core_1.pgTable)("featured_comics", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    issueId: (0, pg_core_1.varchar)("issue_id").references(() => exports.comicIssues.id),
    seriesId: (0, pg_core_1.varchar)("series_id").references(() => exports.comicSeries.id),
    featureType: (0, pg_core_1.text)("feature_type").notNull(), // 'hero_banner', 'trending', 'new_release', 'classic'
    displayOrder: (0, pg_core_1.integer)("display_order").default(0),
    title: (0, pg_core_1.text)("title").notNull(),
    subtitle: (0, pg_core_1.text)("subtitle"),
    description: (0, pg_core_1.text)("description"),
    featuredImageUrl: (0, pg_core_1.text)("featured_image_url"),
    callToAction: (0, pg_core_1.text)("call_to_action"), // "Read Now", "Add to Watchlist"
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    startDate: (0, pg_core_1.timestamp)("start_date"),
    endDate: (0, pg_core_1.timestamp)("end_date"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Comic Grading Predictions Schema - AI-powered comic condition analysis
exports.comicGradingPredictions = (0, pg_core_1.pgTable)("comic_grading_predictions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").references(() => exports.users.id), // Optional - for logged-in users
    imageUrl: (0, pg_core_1.text)("image_url").notNull(), // URL of uploaded comic image
    imageName: (0, pg_core_1.text)("image_name"), // Original filename
    // CGC Grade prediction (0.5-10.0 scale matching CGC standards)
    predictedGrade: (0, pg_core_1.decimal)("predicted_grade", { precision: 3, scale: 1 }).notNull(),
    gradeCategory: (0, pg_core_1.text)("grade_category").notNull(), // 'Poor', 'Fair', 'Good', 'Very Good', 'Fine', 'Very Fine', 'Near Mint', 'Mint'
    // Condition factors analysis
    conditionFactors: (0, pg_core_1.jsonb)("condition_factors").notNull(), // { corners, spine, pages, colors, creases, tears, etc. }
    // AI analysis details
    confidenceScore: (0, pg_core_1.decimal)("confidence_score", { precision: 8, scale: 2 }).notNull(), // 0-100 percentage
    analysisDetails: (0, pg_core_1.text)("analysis_details").notNull(), // Detailed AI explanation
    gradingNotes: (0, pg_core_1.text)("grading_notes"), // Specific observations affecting grade
    // Processing metadata
    processingTimeMs: (0, pg_core_1.integer)("processing_time_ms"), // Time taken for AI analysis
    aiModel: (0, pg_core_1.text)("ai_model").default("gpt-5"), // OpenAI model used
    // Status and timestamps
    status: (0, pg_core_1.text)("status").notNull().default("completed"), // 'processing', 'completed', 'failed'
    // Vector embeddings for visual similarity search and pattern matching
    imageEmbedding: (0, pg_core_1.vector)("image_embedding", { dimensions: 1536 }), // Image visual features for similarity matching
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Insert schemas for new comic tables
exports.insertComicSeriesSchema = (0, drizzle_zod_1.createInsertSchema)(exports.comicSeries).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertComicIssueSchema = (0, drizzle_zod_1.createInsertSchema)(exports.comicIssues).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertComicCreatorSchema = (0, drizzle_zod_1.createInsertSchema)(exports.comicCreators).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertFeaturedComicSchema = (0, drizzle_zod_1.createInsertSchema)(exports.featuredComics).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertComicGradingPredictionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.comicGradingPredictions).omit({
    id: true,
    createdAt: true,
});
// Narrative Events System - Comic book plot events that affect market prices
exports.narrativeEvents = (0, pg_core_1.pgTable)("narrative_events", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    eventType: (0, pg_core_1.text)("event_type").notNull(), // 'house_war', 'hero_falls', 'crossover_event', 'writer_scandal', 'movie_announcement', 'reboot', 'supply_shock'
    // Affected entities
    affectedHouses: (0, pg_core_1.text)("affected_houses").array(), // Array of house IDs
    affectedAssets: (0, pg_core_1.text)("affected_assets").array(), // Array of asset IDs
    // Impact and duration
    impactPercentage: (0, pg_core_1.decimal)("impact_percentage", { precision: 8, scale: 2 }).notNull(), // -100 to +100
    duration: (0, pg_core_1.integer)("duration").notNull(), // Duration in seconds
    severity: (0, pg_core_1.text)("severity").notNull().default("low"), // 'low', 'medium', 'high', 'catastrophic'
    // Visual and narrative elements
    soundEffect: (0, pg_core_1.text)("sound_effect"), // Comic book sound effect
    visualStyle: (0, pg_core_1.text)("visual_style"), // 'explosion', 'dramatic', 'subtle', 'catastrophic'
    narrative: (0, pg_core_1.text)("narrative"), // Extended story narrative
    // Timing and status
    isActive: (0, pg_core_1.boolean)("is_active").default(false),
    startTime: (0, pg_core_1.timestamp)("start_time"),
    endTime: (0, pg_core_1.timestamp)("end_time"),
    // Market conditions that triggered event
    triggerCondition: (0, pg_core_1.text)("trigger_condition"), // 'bull_market', 'bear_market', 'sideways', 'random'
    marketContext: (0, pg_core_1.jsonb)("market_context"), // Market stats when event triggered
    // Chain reactions and compound effects
    parentEventId: (0, pg_core_1.varchar)("parent_event_id"), // If this event was triggered by another
    chainReactionProbability: (0, pg_core_1.decimal)("chain_reaction_probability", { precision: 5, scale: 2 }).default("0.00"), // 0-100%
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Insert schema for narrative events
exports.insertNarrativeEventSchema = (0, drizzle_zod_1.createInsertSchema)(exports.narrativeEvents).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// Phase 1 Trading Extensions
// Phase 1 Market Events - Terminal Clock market chaos events
exports.phase1MarketEvents = (0, pg_core_1.pgTable)("phase1_market_events", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    eventType: (0, pg_core_1.text)("event_type").notNull(), // 'flash_crash', 'liquidity_crisis', 'margin_call_cascade', 'volatility_spike'
    severity: (0, pg_core_1.text)("severity").notNull(), // 'low', 'medium', 'high', 'critical'
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description"),
    impact: (0, pg_core_1.jsonb)("impact"), // { priceMultiplier: 0.95, volatilityBoost: 1.5, affectedAssets: ['all'] }
    visualEffect: (0, pg_core_1.text)("visual_effect"), // 'screen_flash', 'red_wash', 'glitch', 'static'
    triggerVolatilityLevel: (0, pg_core_1.decimal)("trigger_volatility_level", { precision: 8, scale: 2 }), // Volatility level that triggered this
    duration: (0, pg_core_1.integer)("duration").default(60), // Event duration in seconds
    timestamp: (0, pg_core_1.timestamp)("timestamp").defaultNow(),
    endTimestamp: (0, pg_core_1.timestamp)("end_timestamp"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Volatility History - Track market volatility levels over time
exports.volatilityHistory = (0, pg_core_1.pgTable)("volatility_history", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    level: (0, pg_core_1.decimal)("level", { precision: 8, scale: 2 }).notNull(), // Current volatility multiplier (1.0 - 3.0+)
    marketPhase: (0, pg_core_1.text)("market_phase").notNull(), // 'early_hours', 'mid_day', 'power_hour', 'terminal_hour'
    timeUntilTerminal: (0, pg_core_1.integer)("time_until_terminal"), // Seconds until market close
    activeEvents: (0, pg_core_1.jsonb)("active_events"), // Array of active event IDs
    affectedAssets: (0, pg_core_1.integer)("affected_assets").default(0), // Number of assets affected
    tradingVolume: (0, pg_core_1.decimal)("trading_volume", { precision: 15, scale: 2 }), // Total volume during this period
    priceSwings: (0, pg_core_1.jsonb)("price_swings"), // { maxSwing: 0.15, avgSwing: 0.08 }
    timestamp: (0, pg_core_1.timestamp)("timestamp").defaultNow(),
});
// Trading Sessions - Track user trading activity and performance
exports.tradingSessions = (0, pg_core_1.pgTable)("trading_sessions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    portfolioId: (0, pg_core_1.varchar)("portfolio_id").notNull().references(() => exports.portfolios.id),
    sessionStart: (0, pg_core_1.timestamp)("session_start").defaultNow().notNull(),
    sessionEnd: (0, pg_core_1.timestamp)("session_end"),
    // Session Performance Metrics
    startingBalance: (0, pg_core_1.decimal)("starting_balance", { precision: 15, scale: 2 }).notNull(),
    endingBalance: (0, pg_core_1.decimal)("ending_balance", { precision: 15, scale: 2 }),
    totalTrades: (0, pg_core_1.integer)("total_trades").default(0),
    profitableTrades: (0, pg_core_1.integer)("profitable_trades").default(0),
    sessionProfit: (0, pg_core_1.decimal)("session_profit", { precision: 15, scale: 2 }).default("0.00"),
    sessionProfitPercent: (0, pg_core_1.decimal)("session_profit_percent", { precision: 8, scale: 2 }).default("0.00"),
    largestWin: (0, pg_core_1.decimal)("largest_win", { precision: 15, scale: 2 }).default("0.00"),
    largestLoss: (0, pg_core_1.decimal)("largest_loss", { precision: 15, scale: 2 }).default("0.00"),
    // Session Activity
    assetsTraded: (0, pg_core_1.text)("assets_traded").array(), // Array of asset IDs traded in this session
    tradingStrategy: (0, pg_core_1.text)("trading_strategy"), // 'day_trading', 'swing_trading', 'position_trading'
    notes: (0, pg_core_1.text)("notes"), // User notes about the session
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Asset Current Prices - Real-time pricing for trading
exports.assetCurrentPrices = (0, pg_core_1.pgTable)("asset_current_prices", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    currentPrice: (0, pg_core_1.decimal)("current_price", { precision: 10, scale: 2 }).notNull(),
    bidPrice: (0, pg_core_1.decimal)("bid_price", { precision: 10, scale: 2 }),
    askPrice: (0, pg_core_1.decimal)("ask_price", { precision: 10, scale: 2 }),
    dayChange: (0, pg_core_1.decimal)("day_change", { precision: 10, scale: 2 }),
    dayChangePercent: (0, pg_core_1.decimal)("day_change_percent", { precision: 8, scale: 2 }),
    weekHigh: (0, pg_core_1.decimal)("week_high", { precision: 10, scale: 2 }), // 52-week high price
    volume: (0, pg_core_1.integer)("volume").default(0),
    lastTradePrice: (0, pg_core_1.decimal)("last_trade_price", { precision: 10, scale: 2 }),
    lastTradeQuantity: (0, pg_core_1.decimal)("last_trade_quantity", { precision: 10, scale: 4 }),
    lastTradeTime: (0, pg_core_1.timestamp)("last_trade_time"),
    // Market status
    marketStatus: (0, pg_core_1.text)("market_status").default("open"), // 'open', 'closed', 'suspended'
    priceSource: (0, pg_core_1.text)("price_source").default("simulation"), // 'simulation', 'external_api', 'manual'
    // Volatility and risk metrics
    volatility: (0, pg_core_1.decimal)("volatility", { precision: 8, scale: 2 }), // Price volatility percentage
    beta: (0, pg_core_1.decimal)("beta", { precision: 3, scale: 2 }), // Beta relative to market
    // Weighted Market Cap fields for share-based pricing
    totalMarketValue: (0, pg_core_1.decimal)("total_market_value", { precision: 20, scale: 2 }), // Sum of (census_count × price) across all grades
    totalFloat: (0, pg_core_1.bigint)("total_float", { mode: "number" }), // Total shares available (census × shares_per_copy)
    sharesPerCopy: (0, pg_core_1.integer)("shares_per_copy").default(100), // How many shares per physical comic (default 100)
    censusDistribution: (0, pg_core_1.jsonb)("census_distribution"), // Grade distribution: [{grade: "CGC 9.8", count: 100, price: 50000}]
    scarcityModifier: (0, pg_core_1.decimal)("scarcity_modifier", { precision: 5, scale: 4 }).default("1.0000"), // FloatScarcityMod: 0.90 - 1.10
    averageComicValue: (0, pg_core_1.decimal)("average_comic_value", { precision: 15, scale: 2 }), // Average value per comic across all grades
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Trading Limits - User-specific trading limits and restrictions
exports.tradingLimits = (0, pg_core_1.pgTable)("trading_limits", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    assetId: (0, pg_core_1.varchar)("asset_id").references(() => exports.assets.id), // Asset-specific limits (null for general limits)
    limitType: (0, pg_core_1.text)("limit_type").notNull(), // 'daily_volume', 'position_size', 'loss_limit', 'exposure_limit'
    limitValue: (0, pg_core_1.decimal)("limit_value", { precision: 15, scale: 2 }).notNull(),
    currentUsage: (0, pg_core_1.decimal)("current_usage", { precision: 15, scale: 2 }).default("0.00"),
    resetPeriod: (0, pg_core_1.text)("reset_period").default("daily"), // 'daily', 'weekly', 'monthly', 'never'
    lastReset: (0, pg_core_1.timestamp)("last_reset").defaultNow(),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    // Breach tracking
    breachCount: (0, pg_core_1.integer)("breach_count").default(0),
    lastBreach: (0, pg_core_1.timestamp)("last_breach"),
    breachAction: (0, pg_core_1.text)("breach_action").default("block"), // 'block', 'warn', 'log'
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Insert schemas for new Phase 1 trading tables
exports.insertTradingSessionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.tradingSessions).omit({
    id: true,
    createdAt: true,
});
exports.insertAssetCurrentPriceSchema = (0, drizzle_zod_1.createInsertSchema)(exports.assetCurrentPrices).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertTradingLimitSchema = (0, drizzle_zod_1.createInsertSchema)(exports.tradingLimits).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// PHASE 1 CORE TRADING FOUNDATIONS - Real Order Execution and Portfolio Management
// Trades table - Executed trades history with P&L tracking
exports.trades = (0, pg_core_1.pgTable)("trades", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    portfolioId: (0, pg_core_1.varchar)("portfolio_id").notNull().references(() => exports.portfolios.id),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    orderId: (0, pg_core_1.varchar)("order_id").references(() => exports.orders.id), // Link to the order that created this trade
    side: (0, pg_core_1.text)("side").notNull(), // 'buy' or 'sell'
    quantity: (0, pg_core_1.decimal)("quantity", { precision: 10, scale: 4 }).notNull(),
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    totalValue: (0, pg_core_1.decimal)("total_value", { precision: 15, scale: 2 }).notNull(),
    fees: (0, pg_core_1.decimal)("fees", { precision: 10, scale: 2 }).default("0.00"),
    // P&L Tracking
    pnl: (0, pg_core_1.decimal)("pnl", { precision: 15, scale: 2 }), // Realized P&L for sell trades
    pnlPercent: (0, pg_core_1.decimal)("pnl_percent", { precision: 8, scale: 2 }), // Percentage P&L
    costBasis: (0, pg_core_1.decimal)("cost_basis", { precision: 15, scale: 2 }), // For sell trades - the original cost
    // Trade metadata
    executedAt: (0, pg_core_1.timestamp)("executed_at").defaultNow().notNull(),
    tradeType: (0, pg_core_1.text)("trade_type").default("manual"), // 'manual', 'stop_loss', 'take_profit', 'liquidation'
    notes: (0, pg_core_1.text)("notes"),
    // Moral consequence tracking
    moralImpact: (0, pg_core_1.decimal)("moral_impact", { precision: 10, scale: 2 }), // Moral impact score of the trade
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Positions table - Current open positions with unrealized P&L
exports.positions = (0, pg_core_1.pgTable)("positions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    portfolioId: (0, pg_core_1.varchar)("portfolio_id").notNull().references(() => exports.portfolios.id),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    quantity: (0, pg_core_1.decimal)("quantity", { precision: 10, scale: 4 }).notNull(),
    averageCost: (0, pg_core_1.decimal)("average_cost", { precision: 10, scale: 2 }).notNull(),
    totalCostBasis: (0, pg_core_1.decimal)("total_cost_basis", { precision: 15, scale: 2 }).notNull(),
    currentValue: (0, pg_core_1.decimal)("current_value", { precision: 15, scale: 2 }),
    currentPrice: (0, pg_core_1.decimal)("current_price", { precision: 10, scale: 2 }),
    unrealizedPnl: (0, pg_core_1.decimal)("unrealized_pnl", { precision: 15, scale: 2 }),
    unrealizedPnlPercent: (0, pg_core_1.decimal)("unrealized_pnl_percent", { precision: 8, scale: 2 }),
    // Position metadata
    firstBuyDate: (0, pg_core_1.timestamp)("first_buy_date").notNull(),
    lastTradeDate: (0, pg_core_1.timestamp)("last_trade_date").notNull(),
    totalBuys: (0, pg_core_1.integer)("total_buys").default(1),
    totalSells: (0, pg_core_1.integer)("total_sells").default(0),
    holdingPeriodDays: (0, pg_core_1.integer)("holding_period_days"),
    // Risk management
    stopLossPrice: (0, pg_core_1.decimal)("stop_loss_price", { precision: 10, scale: 2 }),
    takeProfitPrice: (0, pg_core_1.decimal)("take_profit_price", { precision: 10, scale: 2 }),
    maxPositionValue: (0, pg_core_1.decimal)("max_position_value", { precision: 15, scale: 2 }), // Historical max value
    maxUnrealizedProfit: (0, pg_core_1.decimal)("max_unrealized_profit", { precision: 15, scale: 2 }), // Track max profit reached
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Balances table - User account balances and buying power
exports.balances = (0, pg_core_1.pgTable)("balances", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    portfolioId: (0, pg_core_1.varchar)("portfolio_id").notNull().references(() => exports.portfolios.id),
    // Core balances
    cash: (0, pg_core_1.decimal)("cash", { precision: 15, scale: 2 }).notNull().default("100000.00"),
    totalValue: (0, pg_core_1.decimal)("total_value", { precision: 15, scale: 2 }).notNull().default("100000.00"),
    buyingPower: (0, pg_core_1.decimal)("buying_power", { precision: 15, scale: 2 }).notNull().default("100000.00"),
    // Position values
    positionsValue: (0, pg_core_1.decimal)("positions_value", { precision: 15, scale: 2 }).default("0.00"),
    totalCostBasis: (0, pg_core_1.decimal)("total_cost_basis", { precision: 15, scale: 2 }).default("0.00"),
    // P&L tracking
    realizedPnl: (0, pg_core_1.decimal)("realized_pnl", { precision: 15, scale: 2 }).default("0.00"),
    unrealizedPnl: (0, pg_core_1.decimal)("unrealized_pnl", { precision: 15, scale: 2 }).default("0.00"),
    totalPnl: (0, pg_core_1.decimal)("total_pnl", { precision: 15, scale: 2 }).default("0.00"),
    // Daily tracking
    dayStartBalance: (0, pg_core_1.decimal)("day_start_balance", { precision: 15, scale: 2 }),
    dayPnl: (0, pg_core_1.decimal)("day_pnl", { precision: 15, scale: 2 }).default("0.00"),
    dayPnlPercent: (0, pg_core_1.decimal)("day_pnl_percent", { precision: 8, scale: 2 }).default("0.00"),
    // Performance metrics
    allTimeHigh: (0, pg_core_1.decimal)("all_time_high", { precision: 15, scale: 2 }).default("100000.00"),
    allTimeLow: (0, pg_core_1.decimal)("all_time_low", { precision: 15, scale: 2 }).default("100000.00"),
    winRate: (0, pg_core_1.decimal)("win_rate", { precision: 5, scale: 2 }), // Percentage of winning trades
    sharpeRatio: (0, pg_core_1.decimal)("sharpe_ratio", { precision: 5, scale: 2 }), // Risk-adjusted returns
    // Margin and risk
    marginUsed: (0, pg_core_1.decimal)("margin_used", { precision: 15, scale: 2 }).default("0.00"),
    maintenanceMargin: (0, pg_core_1.decimal)("maintenance_margin", { precision: 15, scale: 2 }).default("0.00"),
    marginCallLevel: (0, pg_core_1.decimal)("margin_call_level", { precision: 15, scale: 2 }),
    // Timestamps
    lastTradeAt: (0, pg_core_1.timestamp)("last_trade_at"),
    lastCalculatedAt: (0, pg_core_1.timestamp)("last_calculated_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// MORAL CONSEQUENCE SYSTEM TABLES - Dark mechanics where every profit creates victims
// Moral standings table - Tracks each user's corruption level and blood money
exports.moralStandings = (0, pg_core_1.pgTable)("moral_standings", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    corruptionLevel: (0, pg_core_1.decimal)("corruption_level", { precision: 5, scale: 2 }).default("0.00"), // 0-100 scale
    totalVictims: (0, pg_core_1.integer)("total_victims").default(0),
    bloodMoney: (0, pg_core_1.decimal)("blood_money", { precision: 15, scale: 2 }).default("0.00"), // Total money taken from others
    totalHarm: (0, pg_core_1.decimal)("total_harm", { precision: 15, scale: 2 }).default("0.00"), // Total financial harm caused
    lastConfession: (0, pg_core_1.timestamp)("last_confession"), // Last time they "confessed" to reduce corruption
    confessionCount: (0, pg_core_1.integer)("confession_count").default(0),
    soulWeight: (0, pg_core_1.text)("soul_weight").default("unburdened"), // 'unburdened', 'tainted', 'heavy', 'crushing', 'damned'
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Trading victims table - Every profitable trade creates a victim with a story
exports.tradingVictims = (0, pg_core_1.pgTable)("trading_victims", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    tradeId: (0, pg_core_1.varchar)("trade_id").notNull().references(() => exports.trades.id),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id), // The trader who caused this victim
    victimName: (0, pg_core_1.text)("victim_name").notNull(), // Generated realistic name
    victimStory: (0, pg_core_1.text)("victim_story").notNull(), // The human cost of this trade
    lossAmount: (0, pg_core_1.decimal)("loss_amount", { precision: 15, scale: 2 }).notNull(),
    impactLevel: (0, pg_core_1.text)("impact_level").notNull(), // 'minor', 'moderate', 'severe', 'catastrophic'
    // Victim details for more emotional impact
    age: (0, pg_core_1.integer)("age"),
    occupation: (0, pg_core_1.text)("occupation"),
    familySize: (0, pg_core_1.integer)("family_size"),
    consequence: (0, pg_core_1.text)("consequence"), // What happened as a result
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Insert schemas for moral consequence tables
exports.insertMoralStandingSchema = (0, drizzle_zod_1.createInsertSchema)(exports.moralStandings).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertTradingVictimSchema = (0, drizzle_zod_1.createInsertSchema)(exports.tradingVictims).omit({
    id: true,
    createdAt: true,
});
// Insert schemas for new trading tables
exports.insertTradeSchema = (0, drizzle_zod_1.createInsertSchema)(exports.trades).omit({
    id: true,
    executedAt: true,
    createdAt: true,
});
exports.insertPositionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.positions).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertBalanceSchema = (0, drizzle_zod_1.createInsertSchema)(exports.balances).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    lastCalculatedAt: true,
});
// NOTIFICATION SYSTEM TABLES - Phase 1 Real-time Notifications
// Notifications table for storing notification history
exports.notifications = (0, pg_core_1.pgTable)("notifications", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    type: (0, pg_core_1.text)("type").notNull(), // 'order' | 'price_alert' | 'market_update' | 'portfolio'
    title: (0, pg_core_1.text)("title").notNull(),
    message: (0, pg_core_1.text)("message").notNull(),
    priority: (0, pg_core_1.text)("priority").notNull().default("medium"), // 'low' | 'medium' | 'high' | 'critical'
    read: (0, pg_core_1.boolean)("read").default(false),
    actionUrl: (0, pg_core_1.text)("action_url"), // Optional URL for clickable actions
    metadata: (0, pg_core_1.jsonb)("metadata"), // Additional notification data (order details, etc.)
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at"), // Optional expiration date
});
// Price alerts table with user-defined thresholds
exports.priceAlerts = (0, pg_core_1.pgTable)("price_alerts", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    alertType: (0, pg_core_1.text)("alert_type").notNull(), // 'price_above' | 'price_below' | 'percent_change' | 'volume_spike'
    thresholdValue: (0, pg_core_1.decimal)("threshold_value", { precision: 10, scale: 2 }).notNull(),
    percentageThreshold: (0, pg_core_1.decimal)("percentage_threshold", { precision: 8, scale: 2 }), // For percentage-based alerts
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    lastTriggeredPrice: (0, pg_core_1.decimal)("last_triggered_price", { precision: 10, scale: 2 }),
    triggerCount: (0, pg_core_1.integer)("trigger_count").default(0),
    cooldownMinutes: (0, pg_core_1.integer)("cooldown_minutes").default(60), // Prevent spam alerts
    name: (0, pg_core_1.text)("name"), // User-defined alert name
    notes: (0, pg_core_1.text)("notes"), // User notes about the alert
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    triggeredAt: (0, pg_core_1.timestamp)("triggered_at"),
    lastCheckedAt: (0, pg_core_1.timestamp)("last_checked_at").defaultNow(),
});
// Notification preferences table for user settings
exports.notificationPreferences = (0, pg_core_1.pgTable)("notification_preferences", {
    userId: (0, pg_core_1.varchar)("user_id").primaryKey().references(() => exports.users.id),
    // Notification type preferences
    orderNotifications: (0, pg_core_1.boolean)("order_notifications").default(true),
    priceAlerts: (0, pg_core_1.boolean)("price_alerts").default(true),
    marketUpdates: (0, pg_core_1.boolean)("market_updates").default(true),
    portfolioAlerts: (0, pg_core_1.boolean)("portfolio_alerts").default(true),
    // Delivery method preferences
    emailNotifications: (0, pg_core_1.boolean)("email_notifications").default(false),
    pushNotifications: (0, pg_core_1.boolean)("push_notifications").default(true),
    toastNotifications: (0, pg_core_1.boolean)("toast_notifications").default(true),
    // Priority filtering
    lowPriorityEnabled: (0, pg_core_1.boolean)("low_priority_enabled").default(true),
    mediumPriorityEnabled: (0, pg_core_1.boolean)("medium_priority_enabled").default(true),
    highPriorityEnabled: (0, pg_core_1.boolean)("high_priority_enabled").default(true),
    criticalPriorityEnabled: (0, pg_core_1.boolean)("critical_priority_enabled").default(true),
    // Quiet hours settings
    quietHoursEnabled: (0, pg_core_1.boolean)("quiet_hours_enabled").default(false),
    quietHoursStart: (0, pg_core_1.text)("quiet_hours_start"), // "22:00" format
    quietHoursEnd: (0, pg_core_1.text)("quiet_hours_end"), // "08:00" format
    quietHoursTimezone: (0, pg_core_1.text)("quiet_hours_timezone").default("UTC"),
    // Advanced preferences
    groupSimilarNotifications: (0, pg_core_1.boolean)("group_similar_notifications").default(true),
    maxDailyNotifications: (0, pg_core_1.integer)("max_daily_notifications").default(50),
    soundEnabled: (0, pg_core_1.boolean)("sound_enabled").default(true),
    vibrationEnabled: (0, pg_core_1.boolean)("vibration_enabled").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Notification templates for different event types
exports.notificationTemplates = (0, pg_core_1.pgTable)("notification_templates", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    type: (0, pg_core_1.text)("type").notNull(), // 'order_filled', 'price_alert_triggered', etc.
    priority: (0, pg_core_1.text)("priority").notNull().default("medium"),
    titleTemplate: (0, pg_core_1.text)("title_template").notNull(), // "Order Filled: {assetName}"
    messageTemplate: (0, pg_core_1.text)("message_template").notNull(), // "Your order for {quantity} shares of {assetName} has been filled at {price}"
    actionUrlTemplate: (0, pg_core_1.text)("action_url_template"), // "/trading?order={orderId}"
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Insert schemas for notification tables
exports.insertNotificationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.notifications).omit({
    id: true,
    createdAt: true,
});
exports.insertPriceAlertSchema = (0, drizzle_zod_1.createInsertSchema)(exports.priceAlerts).omit({
    id: true,
    createdAt: true,
    triggeredAt: true,
    lastCheckedAt: true,
});
exports.insertNotificationPreferencesSchema = (0, drizzle_zod_1.createInsertSchema)(exports.notificationPreferences).omit({
    createdAt: true,
    updatedAt: true,
});
exports.insertNotificationTemplateSchema = (0, drizzle_zod_1.createInsertSchema)(exports.notificationTemplates).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// PHASE 2: MYTHOLOGICAL TRADING RPG SYSTEM
// Seven Mythological Houses - Core trading houses system
exports.mythologicalHouses = (0, pg_core_1.pgTable)("mythological_houses", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull(), // "House of Eternity", "House of Conquest", etc.
    mythology: (0, pg_core_1.text)("mythology").notNull(), // "Egyptian", "Roman", "Greek", "Norse", "Asian", "African", "Indian"
    firmName: (0, pg_core_1.text)("firm_name").notNull(), // Hidden firm name overlay
    description: (0, pg_core_1.text)("description").notNull(),
    philosophy: (0, pg_core_1.text)("philosophy").notNull(), // Trading philosophy
    // House specializations
    primarySpecialization: (0, pg_core_1.text)("primary_specialization").notNull(), // Asset type they excel in
    weaknessSpecialization: (0, pg_core_1.text)("weakness_specialization").notNull(), // Asset type they struggle with
    // House modifiers and bonuses
    tradingBonusPercent: (0, pg_core_1.decimal)("trading_bonus_percent", { precision: 8, scale: 2 }).default("0.00"),
    karmaMultiplier: (0, pg_core_1.decimal)("karma_multiplier", { precision: 3, scale: 2 }).default("1.00"),
    // Visual and thematic elements
    primaryColor: (0, pg_core_1.text)("primary_color"), // UI color theme
    iconName: (0, pg_core_1.text)("icon_name"), // Lucide icon
    backgroundImageUrl: (0, pg_core_1.text)("background_image_url"),
    // House lore and storytelling
    originStory: (0, pg_core_1.text)("origin_story"),
    notableMembers: (0, pg_core_1.text)("notable_members").array(),
    traditions: (0, pg_core_1.text)("traditions").array(),
    // House statistics
    totalMembers: (0, pg_core_1.integer)("total_members").default(0),
    averagePerformance: (0, pg_core_1.decimal)("average_performance", { precision: 8, scale: 2 }).default("0.00"),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// User House Membership - Players belong to houses
exports.userHouseMembership = (0, pg_core_1.pgTable)("user_house_membership", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    houseId: (0, pg_core_1.varchar)("house_id").notNull().references(() => exports.mythologicalHouses.id),
    joinedAt: (0, pg_core_1.timestamp)("joined_at").defaultNow(),
    membershipLevel: (0, pg_core_1.text)("membership_level").default("initiate"), // "initiate", "member", "senior", "elder"
    // House-specific progression
    houseLoyalty: (0, pg_core_1.decimal)("house_loyalty", { precision: 8, scale: 2 }).default("0.00"), // 0-100
    houseContributions: (0, pg_core_1.integer)("house_contributions").default(0),
    houseRank: (0, pg_core_1.integer)("house_rank"),
    // House bonuses and penalties
    currentBonusPercent: (0, pg_core_1.decimal)("current_bonus_percent", { precision: 8, scale: 2 }).default("0.00"),
    totalBonusEarned: (0, pg_core_1.decimal)("total_bonus_earned", { precision: 15, scale: 2 }).default("0.00"),
    // Status tracking
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    leftAt: (0, pg_core_1.timestamp)("left_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Karmic Alignment System - Hidden behavior tracking
exports.userKarmicAlignment = (0, pg_core_1.pgTable)("user_karmic_alignment", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    // Current karmic state
    currentAlignment: (0, pg_core_1.text)("current_alignment"), // "good", "neutral", "evil" (null until Reckoning)
    karmaScore: (0, pg_core_1.decimal)("karma_score", { precision: 8, scale: 2 }).default("0.00"), // Running karma total
    alignmentStrength: (0, pg_core_1.decimal)("alignment_strength", { precision: 8, scale: 2 }).default("0.00"), // How locked in
    // Behavioral tracking (hidden from user until Reckoning)
    honestyScore: (0, pg_core_1.decimal)("honesty_score", { precision: 8, scale: 2 }).default("50.00"), // 0-100
    cooperationScore: (0, pg_core_1.decimal)("cooperation_score", { precision: 8, scale: 2 }).default("50.00"), // 0-100
    exploitationScore: (0, pg_core_1.decimal)("exploitation_score", { precision: 8, scale: 2 }).default("0.00"), // 0-100
    generosityScore: (0, pg_core_1.decimal)("generosity_score", { precision: 8, scale: 2 }).default("50.00"), // 0-100
    // Action counters
    honestActions: (0, pg_core_1.integer)("honest_actions").default(0),
    deceptiveActions: (0, pg_core_1.integer)("deceptive_actions").default(0),
    helpfulActions: (0, pg_core_1.integer)("helpful_actions").default(0),
    harmfulActions: (0, pg_core_1.integer)("harmful_actions").default(0),
    // Trading modifiers (applied secretly)
    successModifier: (0, pg_core_1.decimal)("success_modifier", { precision: 3, scale: 2 }).default("1.00"), // 0.5-1.5 multiplier
    luckyBreakChance: (0, pg_core_1.decimal)("lucky_break_chance", { precision: 3, scale: 2 }).default("0.05"), // 0-0.2 chance
    badLuckChance: (0, pg_core_1.decimal)("bad_luck_chance", { precision: 3, scale: 2 }).default("0.05"), // 0-0.2 chance
    // Reckoning system
    hasExperiencedReckoning: (0, pg_core_1.boolean)("has_experienced_reckoning").default(false),
    reckoningDate: (0, pg_core_1.timestamp)("reckoning_date"),
    chosenAlignment: (0, pg_core_1.text)("chosen_alignment"), // Post-reckoning chosen alignment
    alignmentLocked: (0, pg_core_1.boolean)("alignment_locked").default(false),
    // Progression tracking
    learningModuleBonuses: (0, pg_core_1.jsonb)("learning_module_bonuses"), // House-specific bonuses from education
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Karmic Actions Log - Track all moral choices
exports.karmicActionsLog = (0, pg_core_1.pgTable)("karmic_actions_log", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    actionType: (0, pg_core_1.text)("action_type").notNull(), // "trade", "tip", "information_sharing", "market_manipulation"
    actionCategory: (0, pg_core_1.text)("action_category").notNull(), // "honest", "deceptive", "helpful", "harmful", "neutral"
    karmaImpact: (0, pg_core_1.decimal)("karma_impact", { precision: 8, scale: 2 }).notNull(), // Can be negative
    description: (0, pg_core_1.text)("description").notNull(),
    // Context data
    relatedAssetId: (0, pg_core_1.varchar)("related_asset_id").references(() => exports.assets.id),
    relatedOrderId: (0, pg_core_1.varchar)("related_order_id").references(() => exports.orders.id),
    targetUserId: (0, pg_core_1.varchar)("target_user_id").references(() => exports.users.id), // If action affects another user
    metadata: (0, pg_core_1.jsonb)("metadata"), // Additional context
    // Alignment influence
    alignmentDirection: (0, pg_core_1.text)("alignment_direction"), // "good", "evil", "neutral"
    strengthImpact: (0, pg_core_1.decimal)("strength_impact", { precision: 3, scale: 2 }).default("0.00"),
    // Visibility
    isVisibleToUser: (0, pg_core_1.boolean)("is_visible_to_user").default(false), // Hidden until Reckoning
    revealedAt: (0, pg_core_1.timestamp)("revealed_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// PANEL PROFITS: Seven Houses of Paneltown Trading System
// Crime families controlling different comic asset sectors
// ==========================================
// Psychological Profiling Entry Test System
// ==========================================
// Test questions for psychological profiling
exports.testQuestions = (0, pg_core_1.pgTable)("test_questions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    questionNumber: (0, pg_core_1.integer)("question_number").notNull().unique(), // Order of presentation
    category: (0, pg_core_1.text)("category").notNull(), // 'risk_tolerance', 'moral_flexibility', 'leadership', 'loyalty_ambition', 'ends_means'
    scenario: (0, pg_core_1.text)("scenario").notNull(), // The moral/ethical scenario description
    contextualSetup: (0, pg_core_1.text)("contextual_setup"), // Additional context to make scenario more immersive
    // Options for the question (stored as JSONB for flexibility)
    options: (0, pg_core_1.jsonb)("options").notNull(), // Array of {id, text, psychologicalWeights}
    // Psychological dimensions this question evaluates
    dimensions: (0, pg_core_1.jsonb)("dimensions").notNull(), // {analytical: 0.8, aggressive: 0.2, strategic: 0.5, ...}
    // House alignment weights (how much each answer aligns with each house)
    houseWeights: (0, pg_core_1.jsonb)("house_weights").notNull(), // {solon: {...}, velos_thorne: {...}, ...}
    active: (0, pg_core_1.boolean)("active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// User responses to test questions
exports.testResponses = (0, pg_core_1.pgTable)("test_responses", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    sessionId: (0, pg_core_1.varchar)("session_id").notNull(), // Groups responses from a single test session
    questionId: (0, pg_core_1.varchar)("question_id").notNull().references(() => exports.testQuestions.id),
    selectedOptionId: (0, pg_core_1.text)("selected_option_id").notNull(), // Which option they chose
    responseTime: (0, pg_core_1.integer)("response_time"), // Milliseconds to answer (can indicate thoughtfulness)
    // Calculated psychological scores from this response
    dimensionScores: (0, pg_core_1.jsonb)("dimension_scores"), // {analytical: 0.7, aggressive: 0.3, ...}
    houseAffinities: (0, pg_core_1.jsonb)("house_affinities"), // {solon: 0.6, velos_thorne: 0.2, ...}
    respondedAt: (0, pg_core_1.timestamp)("responded_at").defaultNow(),
});
// Test results and house assignment
exports.testResults = (0, pg_core_1.pgTable)("test_results", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id).unique(), // One result per user
    sessionId: (0, pg_core_1.varchar)("session_id").notNull().unique(), // Links to test session
    // Overall psychological profile
    psychologicalProfile: (0, pg_core_1.jsonb)("psychological_profile").notNull(), // Comprehensive profile data
    // Primary house assignment
    assignedHouseId: (0, pg_core_1.text)("assigned_house_id").notNull(), // Primary house match
    primaryAffinity: (0, pg_core_1.decimal)("primary_affinity", { precision: 5, scale: 2 }).notNull(), // Match percentage
    // Secondary and tertiary affinities
    secondaryHouseId: (0, pg_core_1.text)("secondary_house_id"),
    secondaryAffinity: (0, pg_core_1.decimal)("secondary_affinity", { precision: 5, scale: 2 }),
    tertiaryHouseId: (0, pg_core_1.text)("tertiary_house_id"),
    tertiaryAffinity: (0, pg_core_1.decimal)("tertiary_affinity", { precision: 5, scale: 2 }),
    // All house scores for transparency
    allHouseScores: (0, pg_core_1.jsonb)("all_house_scores").notNull(), // {solon: 0.75, velos_thorne: 0.45, ...}
    // Detailed dimension scores
    dimensionBreakdown: (0, pg_core_1.jsonb)("dimension_breakdown").notNull(), // All psychological dimensions scored
    // Test metadata
    totalQuestions: (0, pg_core_1.integer)("total_questions").notNull(),
    completionTime: (0, pg_core_1.integer)("completion_time"), // Total milliseconds
    consistencyScore: (0, pg_core_1.decimal)("consistency_score", { precision: 5, scale: 2 }), // How consistent responses were
    // Narrative explanation of assignment
    assignmentRationale: (0, pg_core_1.text)("assignment_rationale"), // AI-generated or template explanation
    completedAt: (0, pg_core_1.timestamp)("completed_at").defaultNow(),
});
// Test sessions to track incomplete tests
exports.testSessions = (0, pg_core_1.pgTable)("test_sessions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    sessionId: (0, pg_core_1.varchar)("session_id").notNull().unique(),
    currentQuestionNumber: (0, pg_core_1.integer)("current_question_number").default(1),
    status: (0, pg_core_1.text)("status").notNull().default("in_progress"), // 'in_progress', 'completed', 'abandoned'
    startedAt: (0, pg_core_1.timestamp)("started_at").defaultNow(),
    lastActivityAt: (0, pg_core_1.timestamp)("last_activity_at").defaultNow(),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
});
// The Seven Houses - Main houses table
exports.sevenHouses = (0, pg_core_1.pgTable)("seven_houses", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull().unique(), // Sequential Securities, Ink & Blood Syndicate, etc.
    description: (0, pg_core_1.text)("description").notNull(),
    specialization: (0, pg_core_1.text)("specialization").notNull(), // Type of assets they control
    color: (0, pg_core_1.text)("color").notNull(), // Strategic accent color (hex) for noir aesthetic
    symbol: (0, pg_core_1.text)("symbol"), // Icon/emblem identifier (lucide icon name)
    // House power and reputation
    reputationScore: (0, pg_core_1.decimal)("reputation_score", { precision: 10, scale: 2 }).default("100.00"),
    powerLevel: (0, pg_core_1.decimal)("power_level", { precision: 10, scale: 2 }).default("100.00"),
    marketCap: (0, pg_core_1.decimal)("market_cap", { precision: 15, scale: 2 }).default("0.00"),
    dailyVolume: (0, pg_core_1.decimal)("daily_volume", { precision: 15, scale: 2 }).default("0.00"),
    controlledAssetsCount: (0, pg_core_1.integer)("controlled_assets_count").default(0),
    // House narrative elements
    houseSlogan: (0, pg_core_1.text)("house_slogan"),
    headquartersLocation: (0, pg_core_1.text)("headquarters_location"), // Location in Paneltown
    rivalHouses: (0, pg_core_1.text)("rival_houses").array(), // Array of house IDs they compete with
    allianceHouses: (0, pg_core_1.text)("alliance_houses").array(), // Temporary alliances
    // House leadership and members
    bossName: (0, pg_core_1.text)("boss_name"), // The head of the house
    memberCount: (0, pg_core_1.integer)("member_count").default(0),
    lieutenants: (0, pg_core_1.text)("lieutenants").array(), // Key members
    // Trading modifiers and bonuses
    tradingBonusPercent: (0, pg_core_1.decimal)("trading_bonus_percent", { precision: 8, scale: 2 }).default("0.00"),
    specialPowerDescription: (0, pg_core_1.text)("special_power_description"), // Unique house ability
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// House Power Rankings - Track dominance in the market
exports.housePowerRankings = (0, pg_core_1.pgTable)("house_power_rankings", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    houseId: (0, pg_core_1.varchar)("house_id").notNull().references(() => exports.sevenHouses.id),
    week: (0, pg_core_1.timestamp)("week").notNull(), // Weekly tracking
    rankPosition: (0, pg_core_1.integer)("rank_position").notNull(), // 1-7
    powerScore: (0, pg_core_1.decimal)("power_score", { precision: 10, scale: 2 }).notNull(),
    weeklyVolume: (0, pg_core_1.decimal)("weekly_volume", { precision: 15, scale: 2 }).notNull(),
    weeklyProfit: (0, pg_core_1.decimal)("weekly_profit", { precision: 15, scale: 2 }).notNull(),
    marketSharePercent: (0, pg_core_1.decimal)("market_share_percent", { precision: 5, scale: 2 }).notNull(),
    territoryGains: (0, pg_core_1.integer)("territory_gains").default(0), // Assets gained control of
    territoryLosses: (0, pg_core_1.integer)("territory_losses").default(0), // Assets lost control of
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// House Market Events - Crime family power struggles
exports.houseMarketEvents = (0, pg_core_1.pgTable)("house_market_events", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    eventType: (0, pg_core_1.text)("event_type").notNull(), // 'turf_war', 'hostile_takeover', 'alliance', 'betrayal'
    triggerHouseId: (0, pg_core_1.varchar)("trigger_house_id").references(() => exports.sevenHouses.id),
    targetHouseId: (0, pg_core_1.varchar)("target_house_id").references(() => exports.sevenHouses.id),
    affectedAssetIds: (0, pg_core_1.text)("affected_asset_ids").array(),
    // Event impact
    powerShift: (0, pg_core_1.decimal)("power_shift", { precision: 8, scale: 2 }), // Power transferred
    marketImpact: (0, pg_core_1.jsonb)("market_impact"), // Price changes, volume spikes
    // Narrative elements
    eventTitle: (0, pg_core_1.text)("event_title").notNull(), // Headline
    eventNarrative: (0, pg_core_1.text)("event_narrative"), // Comic-style story text
    impactDescription: (0, pg_core_1.text)("impact_description"),
    soundEffect: (0, pg_core_1.text)("sound_effect"), // "BOOM!", "CRASH!", "KA-CHING!"
    comicPanelStyle: (0, pg_core_1.text)("comic_panel_style"), // 'action', 'dramatic', 'noir'
    eventTimestamp: (0, pg_core_1.timestamp)("event_timestamp").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Enhanced Character Data - Integrating battle scenarios and character datasets
exports.enhancedCharacters = (0, pg_core_1.pgTable)("enhanced_characters", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Basic character info (from character datasets)
    name: (0, pg_core_1.text)("name").notNull(),
    universe: (0, pg_core_1.text)("universe").notNull(), // "Marvel", "DC Comics", etc.
    pageId: (0, pg_core_1.text)("page_id"), // Original wikia page ID
    url: (0, pg_core_1.text)("url"), // Full wikia URL
    // Character attributes
    identity: (0, pg_core_1.text)("identity"), // "Public", "Secret"
    gender: (0, pg_core_1.text)("gender"),
    maritalStatus: (0, pg_core_1.text)("marital_status"),
    teams: (0, pg_core_1.text)("teams").array(),
    weight: (0, pg_core_1.decimal)("weight", { precision: 5, scale: 1 }), // kg
    creators: (0, pg_core_1.text)("creators").array(),
    // Battle statistics (from battle scenarios CSV)
    strength: (0, pg_core_1.integer)("strength"), // 1-10 scale
    speed: (0, pg_core_1.integer)("speed"), // 1-10 scale
    intelligence: (0, pg_core_1.integer)("intelligence"), // 1-10 scale
    specialAbilities: (0, pg_core_1.text)("special_abilities").array(),
    weaknesses: (0, pg_core_1.text)("weaknesses").array(),
    // Calculated power metrics
    powerLevel: (0, pg_core_1.decimal)("power_level", { precision: 8, scale: 2 }), // Calculated from stats
    battleWinRate: (0, pg_core_1.decimal)("battle_win_rate", { precision: 8, scale: 2 }), // From battle outcomes
    totalBattles: (0, pg_core_1.integer)("total_battles").default(0),
    battlesWon: (0, pg_core_1.integer)("battles_won").default(0),
    // Market influence
    marketValue: (0, pg_core_1.decimal)("market_value", { precision: 10, scale: 2 }),
    popularityScore: (0, pg_core_1.decimal)("popularity_score", { precision: 8, scale: 2 }),
    movieAppearances: (0, pg_core_1.integer)("movie_appearances").default(0),
    // Asset linking
    assetId: (0, pg_core_1.varchar)("asset_id").references(() => exports.assets.id), // Link to tradeable asset
    // Vector embeddings for character similarity and recommendations
    characterEmbedding: (0, pg_core_1.vector)("character_embedding", { dimensions: 1536 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Battle Scenarios - Combat simulations affecting character values
exports.battleScenarios = (0, pg_core_1.pgTable)("battle_scenarios", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    character1Id: (0, pg_core_1.varchar)("character1_id").notNull().references(() => exports.enhancedCharacters.id),
    character2Id: (0, pg_core_1.varchar)("character2_id").references(() => exports.enhancedCharacters.id), // Null for team battles
    battleType: (0, pg_core_1.text)("battle_type").default("one_vs_one"), // "one_vs_one", "team", "tournament"
    outcome: (0, pg_core_1.integer)("outcome").notNull(), // 0 = loss, 1 = win for character1
    // Battle conditions
    environment: (0, pg_core_1.text)("environment"), // "city", "space", "underwater", etc.
    weatherConditions: (0, pg_core_1.text)("weather_conditions"),
    additionalFactors: (0, pg_core_1.jsonb)("additional_factors"),
    // Market impact
    marketImpactPercent: (0, pg_core_1.decimal)("market_impact_percent", { precision: 8, scale: 2 }), // How much this affects character values
    fanEngagement: (0, pg_core_1.integer)("fan_engagement").default(0), // Simulated fan interest
    mediaAttention: (0, pg_core_1.decimal)("media_attention", { precision: 3, scale: 2 }).default("1.00"),
    // Battle metadata
    duration: (0, pg_core_1.integer)("duration"), // Battle length in minutes
    decisiveness: (0, pg_core_1.text)("decisiveness"), // "close", "clear", "overwhelming"
    isCanonical: (0, pg_core_1.boolean)("is_canonical").default(false), // Official vs fan scenarios
    // Event tracking
    eventDate: (0, pg_core_1.timestamp)("event_date").defaultNow(),
    resolvedAt: (0, pg_core_1.timestamp)("resolved_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Enhanced Comic Issues - Complete DC Comics dataset integration
exports.enhancedComicIssues = (0, pg_core_1.pgTable)("enhanced_comic_issues", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Basic issue info (from DC Comics CSV)
    categoryTitle: (0, pg_core_1.text)("category_title").notNull(),
    issueName: (0, pg_core_1.text)("issue_name").notNull(),
    issueLink: (0, pg_core_1.text)("issue_link"),
    comicSeries: (0, pg_core_1.text)("comic_series").notNull(),
    comicType: (0, pg_core_1.text)("comic_type"), // "Category", etc.
    // Creator information
    pencilers: (0, pg_core_1.text)("pencilers").array(),
    coverArtists: (0, pg_core_1.text)("cover_artists").array(),
    inkers: (0, pg_core_1.text)("inkers").array(),
    writers: (0, pg_core_1.text)("writers").array(),
    editors: (0, pg_core_1.text)("editors").array(),
    executiveEditor: (0, pg_core_1.text)("executive_editor"),
    letterers: (0, pg_core_1.text)("letterers").array(),
    colourists: (0, pg_core_1.text)("colourists").array(),
    // Publication details
    releaseDate: (0, pg_core_1.text)("release_date"),
    rating: (0, pg_core_1.text)("rating"),
    // Market data
    currentMarketValue: (0, pg_core_1.decimal)("current_market_value", { precision: 10, scale: 2 }),
    historicalHigh: (0, pg_core_1.decimal)("historical_high", { precision: 10, scale: 2 }),
    historicalLow: (0, pg_core_1.decimal)("historical_low", { precision: 10, scale: 2 }),
    priceVolatility: (0, pg_core_1.decimal)("price_volatility", { precision: 8, scale: 2 }),
    // Collectibility factors
    firstAppearances: (0, pg_core_1.text)("first_appearances").array(), // Characters first appearing
    significantEvents: (0, pg_core_1.text)("significant_events").array(),
    keyIssueRating: (0, pg_core_1.decimal)("key_issue_rating", { precision: 3, scale: 1 }), // 1-10 importance scale
    rarityScore: (0, pg_core_1.decimal)("rarity_score", { precision: 8, scale: 2 }),
    conditionSensitivity: (0, pg_core_1.decimal)("condition_sensitivity", { precision: 3, scale: 2 }), // How much condition affects value
    // Asset linking
    assetId: (0, pg_core_1.varchar)("asset_id").references(() => exports.assets.id), // Link to tradeable asset
    // Vector embeddings for content search and recommendations
    contentEmbedding: (0, pg_core_1.vector)("content_embedding", { dimensions: 1536 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Movie Performance Data - Box office and critical data
exports.moviePerformanceData = (0, pg_core_1.pgTable)("movie_performance_data", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Movie details
    filmTitle: (0, pg_core_1.text)("film_title").notNull(),
    releaseDate: (0, pg_core_1.text)("release_date"),
    franchise: (0, pg_core_1.text)("franchise").notNull(), // "DC", "Marvel"
    characterFamily: (0, pg_core_1.text)("character_family").notNull(), // "Superman", "Batman", etc.
    distributor: (0, pg_core_1.text)("distributor"),
    mpaaRating: (0, pg_core_1.text)("mpaa_rating"),
    // Financial performance
    domesticGross: (0, pg_core_1.decimal)("domestic_gross", { precision: 15, scale: 2 }),
    internationalGross: (0, pg_core_1.decimal)("international_gross", { precision: 15, scale: 2 }),
    worldwideGross: (0, pg_core_1.decimal)("worldwide_gross", { precision: 15, scale: 2 }),
    budget: (0, pg_core_1.decimal)("budget", { precision: 15, scale: 2 }),
    grossToBudgetRatio: (0, pg_core_1.decimal)("gross_to_budget_ratio", { precision: 8, scale: 2 }),
    // Performance metrics
    domesticPercentage: (0, pg_core_1.decimal)("domestic_percentage", { precision: 8, scale: 2 }),
    rottenTomatoesScore: (0, pg_core_1.integer)("rotten_tomatoes_score"),
    isMcuFilm: (0, pg_core_1.boolean)("is_mcu_film").default(false),
    mcuPhase: (0, pg_core_1.text)("mcu_phase"),
    // Inflation-adjusted data
    inflationAdjustedGross: (0, pg_core_1.decimal)("inflation_adjusted_gross", { precision: 15, scale: 2 }),
    inflationAdjustedBudget: (0, pg_core_1.decimal)("inflation_adjusted_budget", { precision: 15, scale: 2 }),
    // Market impact
    marketImpactScore: (0, pg_core_1.decimal)("market_impact_score", { precision: 8, scale: 2 }), // How much it affects related assets
    successCategory: (0, pg_core_1.text)("success_category"), // "Success", "Flop", "Break Even"
    // Character relationships
    featuredCharacters: (0, pg_core_1.text)("featured_characters").array(), // Characters featured in movie
    relatedAssets: (0, pg_core_1.text)("related_assets").array(), // Asset IDs affected by this movie
    // Timeline and duration
    runtimeMinutes: (0, pg_core_1.integer)("runtime_minutes"),
    releaseYear: (0, pg_core_1.integer)("release_year"),
    // Performance analysis
    openingWeekendGross: (0, pg_core_1.decimal)("opening_weekend_gross", { precision: 15, scale: 2 }),
    totalWeeksInTheaters: (0, pg_core_1.integer)("total_weeks_in_theaters"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Learn Module System - Educational progression
exports.learnModules = (0, pg_core_1.pgTable)("learn_modules", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    category: (0, pg_core_1.text)("category").notNull(), // "trading_basics", "comic_history", "market_analysis", "house_specialization"
    progressionLevel: (0, pg_core_1.text)("progression_level").notNull(), // "junior_broker", "senior_broker", "agency_owner", "fund_manager", "family_office"
    houseSpecialization: (0, pg_core_1.varchar)("house_specialization").references(() => exports.mythologicalHouses.id), // House-specific modules
    // Module content
    moduleContent: (0, pg_core_1.jsonb)("module_content").notNull(), // Structured lesson content
    estimatedDuration: (0, pg_core_1.integer)("estimated_duration"), // Minutes
    difficultyLevel: (0, pg_core_1.integer)("difficulty_level"), // 1-5
    prerequisites: (0, pg_core_1.text)("prerequisites").array(), // Module IDs required before this one
    // Educational resources
    movieStills: (0, pg_core_1.text)("movie_stills").array(), // Movie still URLs for visual learning
    interactiveElements: (0, pg_core_1.jsonb)("interactive_elements"), // Quizzes, simulations, etc.
    learningObjectives: (0, pg_core_1.text)("learning_objectives").array(),
    // Progression rewards
    completionKarmaBonus: (0, pg_core_1.decimal)("completion_karma_bonus", { precision: 8, scale: 2 }).default("0.00"),
    tradingSkillBonus: (0, pg_core_1.decimal)("trading_skill_bonus", { precision: 3, scale: 2 }).default("0.00"),
    houseReputationBonus: (0, pg_core_1.decimal)("house_reputation_bonus", { precision: 8, scale: 2 }).default("0.00"),
    unlocksTradingPrivileges: (0, pg_core_1.text)("unlocks_trading_privileges").array(),
    // Module status
    isPublished: (0, pg_core_1.boolean)("is_published").default(false),
    requiredForProgression: (0, pg_core_1.boolean)("required_for_progression").default(false),
    displayOrder: (0, pg_core_1.integer)("display_order").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// User Learn Progress - Track educational advancement
exports.userLearnProgress = (0, pg_core_1.pgTable)("user_learn_progress", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    moduleId: (0, pg_core_1.varchar)("module_id").notNull().references(() => exports.learnModules.id),
    // Progress tracking
    status: (0, pg_core_1.text)("status").default("not_started"), // "not_started", "in_progress", "completed", "failed"
    progressPercent: (0, pg_core_1.decimal)("progress_percent", { precision: 8, scale: 2 }).default("0.00"),
    currentSection: (0, pg_core_1.integer)("current_section").default(1),
    completedSections: (0, pg_core_1.integer)("completed_sections").array(),
    timeSpent: (0, pg_core_1.integer)("time_spent").default(0), // Minutes
    // Assessment results
    quizScores: (0, pg_core_1.jsonb)("quiz_scores"),
    finalScore: (0, pg_core_1.decimal)("final_score", { precision: 8, scale: 2 }),
    passingGrade: (0, pg_core_1.decimal)("passing_grade", { precision: 8, scale: 2 }).default("70.00"),
    attempts: (0, pg_core_1.integer)("attempts").default(0),
    maxAttempts: (0, pg_core_1.integer)("max_attempts").default(3),
    // Completion rewards
    karmaEarned: (0, pg_core_1.decimal)("karma_earned", { precision: 8, scale: 2 }).default("0.00"),
    skillBonusApplied: (0, pg_core_1.boolean)("skill_bonus_applied").default(false),
    certificateUrl: (0, pg_core_1.text)("certificate_url"),
    // Timestamps
    startedAt: (0, pg_core_1.timestamp)("started_at"),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    lastAccessedAt: (0, pg_core_1.timestamp)("last_accessed_at").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Insert schemas for Phase 2 mythological RPG tables
exports.insertMythologicalHouseSchema = (0, drizzle_zod_1.createInsertSchema)(exports.mythologicalHouses).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertUserHouseMembershipSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userHouseMembership).omit({
    id: true,
    createdAt: true,
});
exports.insertUserKarmicAlignmentSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userKarmicAlignment).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertKarmicActionsLogSchema = (0, drizzle_zod_1.createInsertSchema)(exports.karmicActionsLog).omit({
    id: true,
    createdAt: true,
});
exports.insertEnhancedCharacterSchema = (0, drizzle_zod_1.createInsertSchema)(exports.enhancedCharacters).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertBattleScenarioSchema = (0, drizzle_zod_1.createInsertSchema)(exports.battleScenarios).omit({
    id: true,
    createdAt: true,
});
exports.insertEnhancedComicIssueSchema = (0, drizzle_zod_1.createInsertSchema)(exports.enhancedComicIssues).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertMoviePerformanceDataSchema = (0, drizzle_zod_1.createInsertSchema)(exports.moviePerformanceData).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertLearnModuleSchema = (0, drizzle_zod_1.createInsertSchema)(exports.learnModules).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertUserLearnProgressSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userLearnProgress).omit({
    id: true,
    createdAt: true,
});
// LEADERBOARD SYSTEM TABLES
// Trader statistics for tracking user performance metrics
exports.traderStats = (0, pg_core_1.pgTable)("trader_stats", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    // Portfolio metrics
    totalPortfolioValue: (0, pg_core_1.decimal)("total_portfolio_value", { precision: 15, scale: 2 }).default("0.00"),
    totalPnL: (0, pg_core_1.decimal)("total_pnl", { precision: 15, scale: 2 }).default("0.00"), // Realized + unrealized P&L
    totalRealizedPnL: (0, pg_core_1.decimal)("total_realized_pnl", { precision: 15, scale: 2 }).default("0.00"),
    totalUnrealizedPnL: (0, pg_core_1.decimal)("total_unrealized_pnl", { precision: 15, scale: 2 }).default("0.00"),
    roiPercentage: (0, pg_core_1.decimal)("roi_percentage", { precision: 8, scale: 2 }).default("0.00"), // Return on investment %
    // Trading activity metrics
    totalTrades: (0, pg_core_1.integer)("total_trades").default(0),
    profitableTrades: (0, pg_core_1.integer)("profitable_trades").default(0),
    winRate: (0, pg_core_1.decimal)("win_rate", { precision: 8, scale: 2 }).default("0.00"), // % of profitable trades
    averageTradeSize: (0, pg_core_1.decimal)("average_trade_size", { precision: 15, scale: 2 }).default("0.00"),
    totalTradingVolume: (0, pg_core_1.decimal)("total_trading_volume", { precision: 15, scale: 2 }).default("0.00"), // Total $ traded
    biggestWin: (0, pg_core_1.decimal)("biggest_win", { precision: 15, scale: 2 }).default("0.00"),
    biggestLoss: (0, pg_core_1.decimal)("biggest_loss", { precision: 15, scale: 2 }).default("0.00"),
    // Streak tracking
    currentWinningStreak: (0, pg_core_1.integer)("current_winning_streak").default(0),
    currentLosingStreak: (0, pg_core_1.integer)("current_losing_streak").default(0),
    longestWinningStreak: (0, pg_core_1.integer)("longest_winning_streak").default(0),
    longestLosingStreak: (0, pg_core_1.integer)("longest_losing_streak").default(0),
    // Risk metrics
    sharpeRatio: (0, pg_core_1.decimal)("sharpe_ratio", { precision: 5, scale: 3 }), // Risk-adjusted returns
    maxDrawdown: (0, pg_core_1.decimal)("max_drawdown", { precision: 8, scale: 2 }), // Max portfolio decline %
    volatility: (0, pg_core_1.decimal)("volatility", { precision: 8, scale: 2 }), // Portfolio volatility
    // Ranking and achievements
    rankPoints: (0, pg_core_1.decimal)("rank_points", { precision: 10, scale: 2 }).default("0.00"), // Points for ranking calculation
    currentRank: (0, pg_core_1.integer)("current_rank"),
    bestRank: (0, pg_core_1.integer)("best_rank"),
    achievementPoints: (0, pg_core_1.integer)("achievement_points").default(0),
    // Time tracking
    tradingDaysActive: (0, pg_core_1.integer)("trading_days_active").default(0),
    lastTradeDate: (0, pg_core_1.timestamp)("last_trade_date"),
    firstTradeDate: (0, pg_core_1.timestamp)("first_trade_date"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_trader_stats_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_trader_stats_rank_points").on(table.rankPoints),
    (0, pg_core_1.index)("idx_trader_stats_current_rank").on(table.currentRank),
    (0, pg_core_1.index)("idx_trader_stats_total_pnl").on(table.totalPnL),
    (0, pg_core_1.index)("idx_trader_stats_win_rate").on(table.winRate),
    (0, pg_core_1.index)("idx_trader_stats_total_volume").on(table.totalTradingVolume),
]);
// Leaderboard categories for different ranking types
exports.leaderboardCategories = (0, pg_core_1.pgTable)("leaderboard_categories", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull(), // "All-Time Leaders", "Daily Leaders", etc.
    description: (0, pg_core_1.text)("description"),
    categoryType: (0, pg_core_1.text)("category_type").notNull(), // "total_return", "win_rate", "volume", "consistency", "roi"
    timeframe: (0, pg_core_1.text)("timeframe").notNull(), // "all_time", "daily", "weekly", "monthly"
    sortOrder: (0, pg_core_1.text)("sort_order").default("desc"), // "asc" or "desc"
    pointsFormula: (0, pg_core_1.text)("points_formula"), // Formula for calculating points/ranking
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    displayOrder: (0, pg_core_1.integer)("display_order").default(0), // Order for UI display
    minTradesRequired: (0, pg_core_1.integer)("min_trades_required").default(1), // Minimum trades to appear on leaderboard
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_leaderboard_categories_type_timeframe").on(table.categoryType, table.timeframe),
    (0, pg_core_1.index)("idx_leaderboard_categories_active").on(table.isActive),
    (0, pg_core_1.index)("idx_leaderboard_categories_display_order").on(table.displayOrder),
]);
// User achievements for trading badges and milestones
exports.userAchievements = (0, pg_core_1.pgTable)("user_achievements", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    achievementId: (0, pg_core_1.text)("achievement_id").notNull(), // "first_trade", "profit_milestone_1000", etc.
    title: (0, pg_core_1.text)("title").notNull(), // "First Trade", "$1,000 Profit Milestone"
    description: (0, pg_core_1.text)("description").notNull(),
    category: (0, pg_core_1.text)("category").notNull(), // "trading", "profit", "volume", "streak", "special"
    iconName: (0, pg_core_1.text)("icon_name"), // Lucide icon name for badge
    badgeColor: (0, pg_core_1.text)("badge_color").default("blue"), // Color theme for badge
    tier: (0, pg_core_1.text)("tier").default("bronze"), // "bronze", "silver", "gold", "platinum", "diamond"
    points: (0, pg_core_1.integer)("points").default(0), // Achievement points awarded
    rarity: (0, pg_core_1.text)("rarity").default("common"), // "common", "rare", "epic", "legendary"
    // Achievement criteria (stored as JSON for flexibility)
    criteria: (0, pg_core_1.jsonb)("criteria"), // Requirements that triggered this achievement
    progress: (0, pg_core_1.jsonb)("progress"), // Current progress towards achievement
    // Metadata
    unlockedAt: (0, pg_core_1.timestamp)("unlocked_at").defaultNow(),
    notificationSent: (0, pg_core_1.boolean)("notification_sent").default(false),
    isVisible: (0, pg_core_1.boolean)("is_visible").default(true), // Can be hidden for surprise achievements
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_user_achievements_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_user_achievements_achievement_id").on(table.achievementId),
    (0, pg_core_1.index)("idx_user_achievements_category").on(table.category),
    (0, pg_core_1.index)("idx_user_achievements_tier").on(table.tier),
    (0, pg_core_1.index)("idx_user_achievements_unlocked_at").on(table.unlockedAt),
    // Unique constraint to prevent duplicate achievements
    (0, pg_core_1.index)("idx_user_achievements_unique").on(table.userId, table.achievementId),
]);
// Karma actions for tracking karma-related events
exports.karmaActions = (0, pg_core_1.pgTable)("karma_actions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    type: (0, pg_core_1.text)("type").notNull(), // 'house_joined', 'trade_completed', 'achievement_unlocked', etc.
    houseId: (0, pg_core_1.text)("house_id"), // For house-specific actions
    karmaChange: (0, pg_core_1.integer)("karma_change").notNull(), // Can be positive or negative
    description: (0, pg_core_1.text)("description").notNull(),
    metadata: (0, pg_core_1.jsonb)("metadata"), // Additional context data
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_karma_actions_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_karma_actions_type").on(table.type),
    (0, pg_core_1.index)("idx_karma_actions_house_id").on(table.houseId),
    (0, pg_core_1.index)("idx_karma_actions_created_at").on(table.createdAt),
]);
// Insert schemas for leaderboard tables
exports.insertTraderStatsSchema = (0, drizzle_zod_1.createInsertSchema)(exports.traderStats).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertLeaderboardCategorySchema = (0, drizzle_zod_1.createInsertSchema)(exports.leaderboardCategories).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertUserAchievementSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userAchievements).omit({
    id: true,
    unlockedAt: true,
    createdAt: true,
});
exports.insertKarmaActionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.karmaActions).omit({
    id: true,
    createdAt: true,
});
// ============================================================================
// KARMIC ALIGNMENT & RECKONING SYSTEM - COMPREHENSIVE KARMA TRACKING
// ============================================================================
// Detailed alignment history - Track cosmic balance changes over time
exports.alignmentHistory = (0, pg_core_1.pgTable)("alignment_history", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    // Previous alignment state
    previousLawfulChaotic: (0, pg_core_1.decimal)("previous_lawful_chaotic", { precision: 8, scale: 2 }).notNull(),
    previousGoodEvil: (0, pg_core_1.decimal)("previous_good_evil", { precision: 8, scale: 2 }).notNull(),
    // New alignment state
    newLawfulChaotic: (0, pg_core_1.decimal)("new_lawful_chaotic", { precision: 8, scale: 2 }).notNull(),
    newGoodEvil: (0, pg_core_1.decimal)("new_good_evil", { precision: 8, scale: 2 }).notNull(),
    // Alignment shift details
    alignmentShiftMagnitude: (0, pg_core_1.decimal)("alignment_shift_magnitude", { precision: 8, scale: 2 }).notNull(), // Total distance moved
    triggeringActionType: (0, pg_core_1.text)("triggering_action_type").notNull(), // Type of action that caused shift
    triggeringActionId: (0, pg_core_1.varchar)("triggering_action_id"), // Reference to specific karma action
    karmaAtTimeOfShift: (0, pg_core_1.integer)("karma_at_time_of_shift").notNull(),
    houseId: (0, pg_core_1.text)("house_id"), // User's house at time of shift
    // Mystical classifications
    alignmentPhase: (0, pg_core_1.text)("alignment_phase").notNull(), // 'awakening', 'journey', 'transformation', 'mastery'
    cosmicEvent: (0, pg_core_1.text)("cosmic_event"), // 'solar_eclipse', 'lunar_blessing', 'divine_intervention', etc.
    prophecyUnlocked: (0, pg_core_1.text)("prophecy_unlocked"), // Mystical prophecy text revealed
    // Metadata
    significanceLevel: (0, pg_core_1.text)("significance_level").default("minor"), // 'minor', 'major', 'critical', 'legendary'
    recordedAt: (0, pg_core_1.timestamp)("recorded_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_alignment_history_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_alignment_history_recorded_at").on(table.recordedAt),
    (0, pg_core_1.index)("idx_alignment_history_significance").on(table.significanceLevel),
    (0, pg_core_1.index)("idx_alignment_history_action_type").on(table.triggeringActionType),
]);
// Expanded karma actions with detailed behavioral analysis
exports.detailedKarmaActions = (0, pg_core_1.pgTable)("detailed_karma_actions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    // Core action details
    actionType: (0, pg_core_1.text)("action_type").notNull(), // 'aggressive_trade', 'community_help', 'resource_sharing', 'market_manipulation', etc.
    actionCategory: (0, pg_core_1.text)("action_category").notNull(), // 'trading', 'social', 'competitive', 'educational', 'mystical'
    actionSubtype: (0, pg_core_1.text)("action_subtype"), // More specific classification
    // Karma and alignment impact
    karmaChange: (0, pg_core_1.integer)("karma_change").notNull(),
    lawfulChaoticImpact: (0, pg_core_1.decimal)("lawful_chaotic_impact", { precision: 8, scale: 2 }).default("0.00"), // Impact on L/C axis
    goodEvilImpact: (0, pg_core_1.decimal)("good_evil_impact", { precision: 8, scale: 2 }).default("0.00"), // Impact on G/E axis
    // Behavioral pattern analysis
    tradingBehaviorPattern: (0, pg_core_1.text)("trading_behavior_pattern"), // 'patient', 'aggressive', 'collaborative', 'solitary'
    communityInteraction: (0, pg_core_1.text)("community_interaction"), // 'helpful', 'neutral', 'competitive', 'harmful'
    riskTakingBehavior: (0, pg_core_1.text)("risk_taking_behavior"), // 'conservative', 'calculated', 'reckless', 'chaotic'
    // Context and metadata
    assetId: (0, pg_core_1.varchar)("asset_id").references(() => exports.assets.id), // Asset involved in action
    orderId: (0, pg_core_1.varchar)("order_id").references(() => exports.orders.id), // Order that triggered action
    houseId: (0, pg_core_1.text)("house_id"), // User's house at time of action
    houseAlignmentBonus: (0, pg_core_1.decimal)("house_alignment_bonus", { precision: 8, scale: 2 }).default("1.00"), // House modifier applied
    // Impact and consequences
    tradingConsequenceTriggered: (0, pg_core_1.boolean)("trading_consequence_triggered").default(false),
    consequenceSeverity: (0, pg_core_1.text)("consequence_severity"), // 'blessing', 'minor', 'moderate', 'severe', 'divine'
    mysticalDescription: (0, pg_core_1.text)("mystical_description").notNull(), // RPG-flavored description of action
    // Temporal and pattern data
    timeOfDay: (0, pg_core_1.text)("time_of_day"), // 'dawn', 'morning', 'midday', 'afternoon', 'evening', 'night', 'midnight'
    tradingVolume: (0, pg_core_1.decimal)("trading_volume", { precision: 15, scale: 2 }), // Volume involved in action
    portfolioValue: (0, pg_core_1.decimal)("portfolio_value", { precision: 15, scale: 2 }), // User's portfolio value at time
    actionDuration: (0, pg_core_1.integer)("action_duration_minutes"), // How long action took
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_detailed_karma_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_detailed_karma_action_type").on(table.actionType),
    (0, pg_core_1.index)("idx_detailed_karma_category").on(table.actionCategory),
    (0, pg_core_1.index)("idx_detailed_karma_house_id").on(table.houseId),
    (0, pg_core_1.index)("idx_detailed_karma_created_at").on(table.createdAt),
    (0, pg_core_1.index)("idx_detailed_karma_behavior_pattern").on(table.tradingBehaviorPattern),
]);
// Trading consequences - How alignment affects trading outcomes
exports.tradingConsequences = (0, pg_core_1.pgTable)("trading_consequences", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    orderId: (0, pg_core_1.varchar)("order_id").references(() => exports.orders.id), // Order affected by consequence
    // Alignment state at time of consequence
    userLawfulChaotic: (0, pg_core_1.decimal)("user_lawful_chaotic", { precision: 8, scale: 2 }).notNull(),
    userGoodEvil: (0, pg_core_1.decimal)("user_good_evil", { precision: 8, scale: 2 }).notNull(),
    userKarma: (0, pg_core_1.integer)("user_karma").notNull(),
    userHouseId: (0, pg_core_1.text)("user_house_id"),
    // Consequence details
    consequenceType: (0, pg_core_1.text)("consequence_type").notNull(), // 'bonus_stability', 'increased_volatility', 'community_boost', 'solitary_power'
    consequenceCategory: (0, pg_core_1.text)("consequence_category").notNull(), // 'trading_modifier', 'fee_adjustment', 'opportunity_access', 'restriction'
    modifierValue: (0, pg_core_1.decimal)("modifier_value", { precision: 5, scale: 4 }).notNull(), // Numerical modifier applied
    modifierType: (0, pg_core_1.text)("modifier_type").notNull(), // 'multiplier', 'additive', 'percentage', 'boolean'
    // Trading impact
    originalValue: (0, pg_core_1.decimal)("original_value", { precision: 15, scale: 2 }), // Original trade value
    modifiedValue: (0, pg_core_1.decimal)("modified_value", { precision: 15, scale: 2 }), // Value after consequence
    impactDescription: (0, pg_core_1.text)("impact_description").notNull(), // Human-readable impact
    mysticalFlavor: (0, pg_core_1.text)("mystical_flavor").notNull(), // RPG description of consequence
    // Consequence duration and persistence
    isTemporary: (0, pg_core_1.boolean)("is_temporary").default(true),
    durationMinutes: (0, pg_core_1.integer)("duration_minutes"), // How long consequence lasts
    expiresAt: (0, pg_core_1.timestamp)("expires_at"),
    stacksWithOthers: (0, pg_core_1.boolean)("stacks_with_others").default(false), // Can combine with other consequences
    // Success and outcome tracking
    consequenceApplied: (0, pg_core_1.boolean)("consequence_applied").default(true),
    resultingOutcome: (0, pg_core_1.text)("resulting_outcome"), // 'success', 'failure', 'neutral', 'unexpected'
    userSatisfaction: (0, pg_core_1.text)("user_satisfaction"), // 'pleased', 'neutral', 'frustrated', 'surprised'
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_trading_consequences_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_trading_consequences_order_id").on(table.orderId),
    (0, pg_core_1.index)("idx_trading_consequences_type").on(table.consequenceType),
    (0, pg_core_1.index)("idx_trading_consequences_category").on(table.consequenceCategory),
    (0, pg_core_1.index)("idx_trading_consequences_created_at").on(table.createdAt),
    (0, pg_core_1.index)("idx_trading_consequences_expires_at").on(table.expiresAt),
]);
// Alignment thresholds - Define when cosmic shifts occur
exports.alignmentThresholds = (0, pg_core_1.pgTable)("alignment_thresholds", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    thresholdName: (0, pg_core_1.text)("threshold_name").notNull(), // 'lawful_guardian', 'chaotic_rebel', 'neutral_balance'
    alignmentType: (0, pg_core_1.text)("alignment_type").notNull(), // 'lawful_chaotic', 'good_evil', 'combined'
    // Threshold boundaries
    minLawfulChaotic: (0, pg_core_1.decimal)("min_lawful_chaotic", { precision: 8, scale: 2 }),
    maxLawfulChaotic: (0, pg_core_1.decimal)("max_lawful_chaotic", { precision: 8, scale: 2 }),
    minGoodEvil: (0, pg_core_1.decimal)("min_good_evil", { precision: 8, scale: 2 }),
    maxGoodEvil: (0, pg_core_1.decimal)("max_good_evil", { precision: 8, scale: 2 }),
    minKarma: (0, pg_core_1.integer)("min_karma"),
    maxKarma: (0, pg_core_1.integer)("max_karma"),
    // House compatibility
    compatibleHouses: (0, pg_core_1.text)("compatible_houses").array(), // Houses that benefit from this alignment
    conflictingHouses: (0, pg_core_1.text)("conflicting_houses").array(), // Houses that conflict with this alignment
    // Threshold effects
    tradingBonuses: (0, pg_core_1.jsonb)("trading_bonuses"), // Bonuses granted for this alignment
    tradingRestrictions: (0, pg_core_1.jsonb)("trading_restrictions"), // Restrictions imposed
    specialAbilities: (0, pg_core_1.jsonb)("special_abilities"), // Special trading features unlocked
    // Mystical properties
    cosmicTitle: (0, pg_core_1.text)("cosmic_title").notNull(), // "Guardian of Sacred Commerce", "Harbinger of Market Chaos"
    mysticalDescription: (0, pg_core_1.text)("mystical_description").notNull(),
    alignmentAura: (0, pg_core_1.text)("alignment_aura"), // Visual effect for UI ('golden', 'shadow', 'prismatic')
    prophecyText: (0, pg_core_1.text)("prophecy_text"), // Mystical prediction about alignment
    // Metadata
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    displayOrder: (0, pg_core_1.integer)("display_order").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_alignment_thresholds_name").on(table.thresholdName),
    (0, pg_core_1.index)("idx_alignment_thresholds_type").on(table.alignmentType),
    (0, pg_core_1.index)("idx_alignment_thresholds_active").on(table.isActive),
    (0, pg_core_1.index)("idx_alignment_thresholds_display_order").on(table.displayOrder),
]);
// Karmic profiles - Comprehensive alignment analysis for each user
exports.karmicProfiles = (0, pg_core_1.pgTable)("karmic_profiles", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    // Current alignment classification
    currentAlignmentThreshold: (0, pg_core_1.varchar)("current_alignment_threshold").references(() => exports.alignmentThresholds.id),
    alignmentStability: (0, pg_core_1.decimal)("alignment_stability", { precision: 8, scale: 2 }).default("100.00"), // How stable alignment is
    alignmentTrend: (0, pg_core_1.text)("alignment_trend").default("stable"), // 'ascending', 'descending', 'stable', 'chaotic'
    // Behavioral patterns over time
    dominantBehaviorPattern: (0, pg_core_1.text)("dominant_behavior_pattern"), // Most common behavior type
    secondaryBehaviorPattern: (0, pg_core_1.text)("secondary_behavior_pattern"),
    behaviorConsistency: (0, pg_core_1.decimal)("behavior_consistency", { precision: 8, scale: 2 }).default("50.00"), // How consistent behavior is
    // Trading personality analysis
    tradingPersonality: (0, pg_core_1.text)("trading_personality"), // 'patient_strategist', 'aggressive_opportunist', 'community_leader'
    riskProfile: (0, pg_core_1.text)("risk_profile"), // 'conservative', 'moderate', 'aggressive', 'chaotic'
    socialTrading: (0, pg_core_1.text)("social_trading"), // 'collaborative', 'independent', 'competitive', 'teaching'
    // Karma accumulation patterns
    karmaAccelerationRate: (0, pg_core_1.decimal)("karma_acceleration_rate", { precision: 8, scale: 2 }).default("1.00"), // How fast karma changes
    totalKarmaEarned: (0, pg_core_1.integer)("total_karma_earned").default(0),
    totalKarmaLost: (0, pg_core_1.integer)("total_karma_lost").default(0),
    largestKarmaGain: (0, pg_core_1.integer)("largest_karma_gain").default(0),
    largestKarmaLoss: (0, pg_core_1.integer)("largest_karma_loss").default(0),
    // House compatibility analysis
    houseAlignmentCompatibility: (0, pg_core_1.decimal)("house_alignment_compatibility", { precision: 8, scale: 2 }).default("50.00"), // How well aligned with house
    optimalHouseId: (0, pg_core_1.text)("optimal_house_id"), // Most compatible house based on alignment
    alignmentConflictLevel: (0, pg_core_1.text)("alignment_conflict_level").default("none"), // 'none', 'minor', 'moderate', 'severe'
    // Predictive analysis
    predictedAlignmentDirection: (0, pg_core_1.text)("predicted_alignment_direction"), // Where alignment is heading
    nextThresholdDistance: (0, pg_core_1.decimal)("next_threshold_distance", { precision: 8, scale: 2 }), // How close to next threshold
    estimatedTimeToNextThreshold: (0, pg_core_1.integer)("estimated_time_to_next_threshold"), // Days until next threshold
    // Mystical attributes
    cosmicResonance: (0, pg_core_1.decimal)("cosmic_resonance", { precision: 8, scale: 2 }).default("0.00"), // Spiritual power level
    divineFavor: (0, pg_core_1.decimal)("divine_favor", { precision: 8, scale: 2 }).default("0.00"), // Positive cosmic influence
    shadowInfluence: (0, pg_core_1.decimal)("shadow_influence", { precision: 8, scale: 2 }).default("0.00"), // Negative cosmic influence
    // Statistics and tracking
    alignmentShiftsCount: (0, pg_core_1.integer)("alignment_shifts_count").default(0),
    lastMajorShift: (0, pg_core_1.timestamp)("last_major_shift"),
    profileLastCalculated: (0, pg_core_1.timestamp)("profile_last_calculated").defaultNow(),
    nextRecalculationDue: (0, pg_core_1.timestamp)("next_recalculation_due"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_karmic_profiles_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_karmic_profiles_threshold").on(table.currentAlignmentThreshold),
    (0, pg_core_1.index)("idx_karmic_profiles_personality").on(table.tradingPersonality),
    (0, pg_core_1.index)("idx_karmic_profiles_house_compatibility").on(table.houseAlignmentCompatibility),
    (0, pg_core_1.index)("idx_karmic_profiles_last_calculated").on(table.profileLastCalculated),
    // Unique constraint - one profile per user
    (0, pg_core_1.index)("idx_karmic_profiles_unique_user").on(table.userId),
]);
// Insert schemas for karma system tables
exports.insertAlignmentHistorySchema = (0, drizzle_zod_1.createInsertSchema)(exports.alignmentHistory).omit({
    id: true,
    recordedAt: true,
});
exports.insertDetailedKarmaActionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.detailedKarmaActions).omit({
    id: true,
    createdAt: true,
});
exports.insertTradingConsequenceSchema = (0, drizzle_zod_1.createInsertSchema)(exports.tradingConsequences).omit({
    id: true,
    createdAt: true,
});
exports.insertAlignmentThresholdSchema = (0, drizzle_zod_1.createInsertSchema)(exports.alignmentThresholds).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertKarmicProfileSchema = (0, drizzle_zod_1.createInsertSchema)(exports.karmicProfiles).omit({
    id: true,
    profileLastCalculated: true,
    createdAt: true,
    updatedAt: true,
});
// ========================================================================================
// COMPREHENSIVE LEARN MODULE SYSTEM - MYTHOLOGICAL TRADING RPG EDUCATION
// ========================================================================================
// Learning Paths - House-specific curriculum tracks
exports.learningPaths = (0, pg_core_1.pgTable)("learning_paths", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    houseId: (0, pg_core_1.text)("house_id").notNull(), // 'heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit', 'universal'
    specialization: (0, pg_core_1.text)("specialization").notNull(), // House specialization area
    difficultyLevel: (0, pg_core_1.text)("difficulty_level").notNull(), // 'initiate', 'adept', 'master', 'grandmaster'
    prerequisites: (0, pg_core_1.jsonb)("prerequisites"), // Required skills, karma, house membership
    estimatedHours: (0, pg_core_1.integer)("estimated_hours").default(0),
    experienceReward: (0, pg_core_1.integer)("experience_reward").default(0),
    karmaReward: (0, pg_core_1.integer)("karma_reward").default(0),
    // Mystical properties
    sacredTitle: (0, pg_core_1.text)("sacred_title").notNull(), // "Path of the Divine Oracle", "Way of the Shadow Trader"
    mysticalDescription: (0, pg_core_1.text)("mystical_description").notNull(),
    pathIcon: (0, pg_core_1.text)("path_icon").default("BookOpen"),
    pathColor: (0, pg_core_1.text)("path_color").default("blue-600"),
    // Learning path metadata
    lessonSequence: (0, pg_core_1.text)("lesson_sequence").array(), // Ordered array of lesson IDs
    unlockConditions: (0, pg_core_1.jsonb)("unlock_conditions"), // Karma, trading performance, etc.
    completionRewards: (0, pg_core_1.jsonb)("completion_rewards"), // Skills, privileges, bonuses unlocked
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    displayOrder: (0, pg_core_1.integer)("display_order").default(0),
    // Vector embeddings for path recommendations
    pathEmbedding: (0, pg_core_1.vector)("path_embedding", { dimensions: 1536 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_learning_paths_house_id").on(table.houseId),
    (0, pg_core_1.index)("idx_learning_paths_difficulty").on(table.difficultyLevel),
    (0, pg_core_1.index)("idx_learning_paths_active").on(table.isActive),
    (0, pg_core_1.index)("idx_learning_paths_display_order").on(table.displayOrder),
]);
// Sacred Lessons - Individual learning units with immersive RPG elements
exports.sacredLessons = (0, pg_core_1.pgTable)("sacred_lessons", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    houseId: (0, pg_core_1.text)("house_id"), // Primary house, null for universal lessons
    pathId: (0, pg_core_1.varchar)("path_id").references(() => exports.learningPaths.id),
    // Lesson structure and content
    lessonType: (0, pg_core_1.text)("lesson_type").notNull(), // 'crystal_orb', 'sacred_tome', 'simulation', 'trial', 'ritual'
    difficultyLevel: (0, pg_core_1.text)("difficulty_level").notNull(), // 'initiate', 'adept', 'master', 'grandmaster'
    estimatedMinutes: (0, pg_core_1.integer)("estimated_minutes").default(15),
    experienceReward: (0, pg_core_1.integer)("experience_reward").default(100),
    karmaReward: (0, pg_core_1.integer)("karma_reward").default(5),
    // Content delivery
    contentFormat: (0, pg_core_1.text)("content_format").notNull(), // 'text', 'video', 'interactive', 'simulation', 'assessment'
    contentData: (0, pg_core_1.jsonb)("content_data").notNull(), // Lesson content, questions, simulations
    mediaUrls: (0, pg_core_1.jsonb)("media_urls"), // Images, videos, animations
    interactiveElements: (0, pg_core_1.jsonb)("interactive_elements"), // Quizzes, drag-drop, simulations
    // Prerequisites and sequencing
    prerequisites: (0, pg_core_1.jsonb)("prerequisites"), // Required lessons, skills, karma
    unlockConditions: (0, pg_core_1.jsonb)("unlock_conditions"), // Detailed unlock requirements
    nextLessons: (0, pg_core_1.text)("next_lessons").array(), // Suggested next lessons
    // Assessment and mastery
    masteryThreshold: (0, pg_core_1.decimal)("mastery_threshold", { precision: 8, scale: 2 }).default("80.00"), // % required to pass
    allowRetakes: (0, pg_core_1.boolean)("allow_retakes").default(true),
    maxAttempts: (0, pg_core_1.integer)("max_attempts").default(3),
    // Mystical properties
    sacredTitle: (0, pg_core_1.text)("sacred_title").notNull(), // "The Orb of Market Wisdom", "Scroll of Ancient Trades"
    mysticalNarrative: (0, pg_core_1.text)("mystical_narrative").notNull(), // RPG-style introduction
    guidingSpirit: (0, pg_core_1.text)("guiding_spirit"), // Name of mythical guide/teacher
    ritualDescription: (0, pg_core_1.text)("ritual_description"), // How lesson is "performed"
    lessonIcon: (0, pg_core_1.text)("lesson_icon").default("BookOpen"),
    atmosphericEffects: (0, pg_core_1.jsonb)("atmospheric_effects"), // UI effects, sounds, animations
    // Learning analytics
    avgCompletionTime: (0, pg_core_1.integer)("avg_completion_time_minutes"),
    avgScoreAchieved: (0, pg_core_1.decimal)("avg_score_achieved", { precision: 8, scale: 2 }),
    completionRate: (0, pg_core_1.decimal)("completion_rate", { precision: 8, scale: 2 }),
    userRating: (0, pg_core_1.decimal)("user_rating", { precision: 3, scale: 2 }),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    publishedAt: (0, pg_core_1.timestamp)("published_at"),
    // Vector embeddings for content search and recommendations
    contentEmbedding: (0, pg_core_1.vector)("content_embedding", { dimensions: 1536 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_sacred_lessons_house_id").on(table.houseId),
    (0, pg_core_1.index)("idx_sacred_lessons_path_id").on(table.pathId),
    (0, pg_core_1.index)("idx_sacred_lessons_type").on(table.lessonType),
    (0, pg_core_1.index)("idx_sacred_lessons_difficulty").on(table.difficultyLevel),
    (0, pg_core_1.index)("idx_sacred_lessons_active").on(table.isActive),
    (0, pg_core_1.index)("idx_sacred_lessons_published").on(table.publishedAt),
]);
// Mystical Skills - Tradeable abilities that unlock enhanced features
exports.mysticalSkills = (0, pg_core_1.pgTable)("mystical_skills", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    houseId: (0, pg_core_1.text)("house_id"), // Primary house specialization
    skillCategory: (0, pg_core_1.text)("skill_category").notNull(), // 'trading', 'analysis', 'social', 'mystical'
    skillType: (0, pg_core_1.text)("skill_type").notNull(), // 'passive', 'active', 'toggle', 'ritual'
    tier: (0, pg_core_1.text)("tier").notNull(), // 'initiate', 'adept', 'master', 'grandmaster', 'legendary'
    // Skill effects and bonuses
    tradingPrivileges: (0, pg_core_1.jsonb)("trading_privileges"), // What trading features this unlocks
    tradingBonuses: (0, pg_core_1.jsonb)("trading_bonuses"), // Numerical bonuses applied
    interfaceFeatures: (0, pg_core_1.jsonb)("interface_features"), // UI features unlocked
    specialAbilities: (0, pg_core_1.jsonb)("special_abilities"), // Unique powers granted
    // Unlock requirements
    prerequisiteSkills: (0, pg_core_1.text)("prerequisite_skills").array(), // Required skills
    prerequisiteLessons: (0, pg_core_1.text)("prerequisite_lessons").array(), // Required lessons completed
    karmaRequirement: (0, pg_core_1.integer)("karma_requirement").default(0),
    tradingPerformanceRequirement: (0, pg_core_1.jsonb)("trading_performance_requirement"), // Win rate, profit, etc.
    houseStandingRequirement: (0, pg_core_1.text)("house_standing_requirement"), // House rank required
    // Experience and progression
    experienceCost: (0, pg_core_1.integer)("experience_cost").default(500), // Experience points to unlock
    masteryLevels: (0, pg_core_1.integer)("mastery_levels").default(1), // How many levels skill can be upgraded
    maxMasteryBonus: (0, pg_core_1.decimal)("max_mastery_bonus", { precision: 8, scale: 2 }).default("1.50"), // Max bonus at full mastery
    // Mystical properties
    sacredName: (0, pg_core_1.text)("sacred_name").notNull(), // "Sight of the Divine Oracle", "Shadow Step Trading"
    mysticalDescription: (0, pg_core_1.text)("mystical_description").notNull(),
    awakenRitual: (0, pg_core_1.text)("awaken_ritual"), // Description of skill awakening ceremony
    skillIcon: (0, pg_core_1.text)("skill_icon").default("Zap"),
    skillAura: (0, pg_core_1.text)("skill_aura"), // Visual effect ('golden', 'shadow', 'prismatic', 'elemental')
    rarityLevel: (0, pg_core_1.text)("rarity_level").default("common"), // 'common', 'rare', 'epic', 'legendary'
    // Skill tree positioning
    parentSkills: (0, pg_core_1.text)("parent_skills").array(), // Skills this branches from
    childSkills: (0, pg_core_1.text)("child_skills").array(), // Skills this unlocks
    skillTreePosition: (0, pg_core_1.jsonb)("skill_tree_position"), // X,Y coordinates for visualization
    // Usage and impact tracking
    timesUnlocked: (0, pg_core_1.integer)("times_unlocked").default(0),
    avgTimeToUnlock: (0, pg_core_1.integer)("avg_time_to_unlock_days"),
    userSatisfactionRating: (0, pg_core_1.decimal)("user_satisfaction_rating", { precision: 3, scale: 2 }),
    impactOnTrading: (0, pg_core_1.decimal)("impact_on_trading", { precision: 8, scale: 2 }), // Measured improvement
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_mystical_skills_house_id").on(table.houseId),
    (0, pg_core_1.index)("idx_mystical_skills_category").on(table.skillCategory),
    (0, pg_core_1.index)("idx_mystical_skills_tier").on(table.tier),
    (0, pg_core_1.index)("idx_mystical_skills_rarity").on(table.rarityLevel),
    (0, pg_core_1.index)("idx_mystical_skills_active").on(table.isActive),
]);
// User Lesson Progress - Individual lesson completion tracking
exports.userLessonProgress = (0, pg_core_1.pgTable)("user_lesson_progress", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    lessonId: (0, pg_core_1.varchar)("lesson_id").notNull().references(() => exports.sacredLessons.id),
    pathId: (0, pg_core_1.varchar)("path_id").references(() => exports.learningPaths.id),
    // Progress tracking
    status: (0, pg_core_1.text)("status").notNull().default("not_started"), // 'not_started', 'in_progress', 'completed', 'mastered'
    progressPercent: (0, pg_core_1.decimal)("progress_percent", { precision: 8, scale: 2 }).default("0.00"),
    currentSection: (0, pg_core_1.integer)("current_section").default(1),
    sectionsCompleted: (0, pg_core_1.integer)("sections_completed").array(),
    timeSpentMinutes: (0, pg_core_1.integer)("time_spent_minutes").default(0),
    // Assessment results
    attempts: (0, pg_core_1.integer)("attempts").default(0),
    bestScore: (0, pg_core_1.decimal)("best_score", { precision: 8, scale: 2 }),
    latestScore: (0, pg_core_1.decimal)("latest_score", { precision: 8, scale: 2 }),
    masteryAchieved: (0, pg_core_1.boolean)("mastery_achieved").default(false),
    // Learning data
    interactionData: (0, pg_core_1.jsonb)("interaction_data"), // Detailed interaction logs
    difficultyRating: (0, pg_core_1.integer)("difficulty_rating"), // User's rating 1-5
    enjoymentRating: (0, pg_core_1.integer)("enjoyment_rating"), // User's rating 1-5
    notes: (0, pg_core_1.text)("notes"), // User's personal notes
    // Mystical ceremony tracking
    ceremonyViewed: (0, pg_core_1.boolean)("ceremony_viewed").default(false), // Completion ceremony watched
    experienceAwarded: (0, pg_core_1.integer)("experience_awarded").default(0),
    karmaAwarded: (0, pg_core_1.integer)("karma_awarded").default(0),
    skillsUnlocked: (0, pg_core_1.text)("skills_unlocked").array(), // Skills unlocked by this lesson
    // Timing and analytics
    startedAt: (0, pg_core_1.timestamp)("started_at"),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    lastAccessedAt: (0, pg_core_1.timestamp)("last_accessed_at").defaultNow(),
    nextReviewDue: (0, pg_core_1.timestamp)("next_review_due"), // Spaced repetition
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_user_lesson_progress_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_user_lesson_progress_lesson_id").on(table.lessonId),
    (0, pg_core_1.index)("idx_user_lesson_progress_path_id").on(table.pathId),
    (0, pg_core_1.index)("idx_user_lesson_progress_status").on(table.status),
    (0, pg_core_1.index)("idx_user_lesson_progress_completed").on(table.completedAt),
    (0, pg_core_1.index)("idx_user_lesson_progress_last_accessed").on(table.lastAccessedAt),
    // Unique constraint - one progress record per user per lesson
    (0, pg_core_1.index)("idx_user_lesson_unique").on(table.userId, table.lessonId),
]);
// User Skill Unlocks - Skills and abilities unlocked by users
exports.userSkillUnlocks = (0, pg_core_1.pgTable)("user_skill_unlocks", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    skillId: (0, pg_core_1.varchar)("skill_id").notNull().references(() => exports.mysticalSkills.id),
    // Unlock details
    unlockMethod: (0, pg_core_1.text)("unlock_method").notNull(), // 'lesson_completion', 'trial_victory', 'karma_threshold', 'house_advancement'
    masteryLevel: (0, pg_core_1.integer)("mastery_level").default(1), // Current upgrade level
    maxMasteryLevel: (0, pg_core_1.integer)("max_mastery_level").default(1),
    effectivenessBonus: (0, pg_core_1.decimal)("effectiveness_bonus", { precision: 8, scale: 2 }).default("1.00"), // Current bonus multiplier
    // Usage tracking
    timesUsed: (0, pg_core_1.integer)("times_used").default(0),
    lastUsedAt: (0, pg_core_1.timestamp)("last_used_at"),
    totalBenefitGained: (0, pg_core_1.decimal)("total_benefit_gained", { precision: 15, scale: 2 }).default("0.00"),
    // Skill mastery progression
    experienceInvested: (0, pg_core_1.integer)("experience_invested").default(0),
    masteryProgressPercent: (0, pg_core_1.decimal)("mastery_progress_percent", { precision: 8, scale: 2 }).default("0.00"),
    nextUpgradeCost: (0, pg_core_1.integer)("next_upgrade_cost").default(500),
    // Mystical awakening ceremony
    awakeningCeremonyCompleted: (0, pg_core_1.boolean)("awakening_ceremony_completed").default(false),
    awakeningDate: (0, pg_core_1.timestamp)("awakening_date"),
    ceremonialWitnesses: (0, pg_core_1.text)("ceremonial_witnesses").array(), // Other users who witnessed ceremony
    mysticalBond: (0, pg_core_1.decimal)("mystical_bond", { precision: 8, scale: 2 }).default("1.00"), // Spiritual connection to skill
    // Skill performance tracking
    skillRating: (0, pg_core_1.decimal)("skill_rating", { precision: 3, scale: 2 }), // User's rating of skill usefulness
    recommendsToOthers: (0, pg_core_1.boolean)("recommends_to_others").default(true),
    personalNotes: (0, pg_core_1.text)("personal_notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_user_skill_unlocks_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_user_skill_unlocks_skill_id").on(table.skillId),
    (0, pg_core_1.index)("idx_user_skill_unlocks_mastery").on(table.masteryLevel),
    (0, pg_core_1.index)("idx_user_skill_unlocks_awakening").on(table.awakeningDate),
    // Unique constraint - one unlock record per user per skill
    (0, pg_core_1.index)("idx_user_skill_unique").on(table.userId, table.skillId),
]);
// Trials of Mastery - Assessment and certification system
exports.trialsOfMastery = (0, pg_core_1.pgTable)("trials_of_mastery", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    houseId: (0, pg_core_1.text)("house_id"), // House-specific trial or universal
    trialType: (0, pg_core_1.text)("trial_type").notNull(), // 'knowledge', 'practical', 'simulation', 'peer_review', 'divine_challenge'
    difficultyLevel: (0, pg_core_1.text)("difficulty_level").notNull(), // 'initiate', 'adept', 'master', 'grandmaster'
    // Trial structure
    phases: (0, pg_core_1.jsonb)("phases").notNull(), // Multi-phase trial structure
    timeLimit: (0, pg_core_1.integer)("time_limit_minutes").default(60),
    maxAttempts: (0, pg_core_1.integer)("max_attempts").default(3),
    passingScore: (0, pg_core_1.decimal)("passing_score", { precision: 8, scale: 2 }).default("75.00"),
    perfectScore: (0, pg_core_1.decimal)("perfect_score", { precision: 8, scale: 2 }).default("100.00"),
    // Prerequisites and rewards
    prerequisites: (0, pg_core_1.jsonb)("prerequisites"), // Required skills, lessons, karma
    experienceReward: (0, pg_core_1.integer)("experience_reward").default(1000),
    karmaReward: (0, pg_core_1.integer)("karma_reward").default(50),
    skillsUnlocked: (0, pg_core_1.text)("skills_unlocked").array(), // Skills granted on completion
    tradingPrivilegesGranted: (0, pg_core_1.jsonb)("trading_privileges_granted"), // New trading abilities
    certificationsAwarded: (0, pg_core_1.text)("certifications_awarded").array(), // Formal certifications
    // Mystical properties
    sacredTitle: (0, pg_core_1.text)("sacred_title").notNull(), // "Trial of the Divine Oracle", "Ordeal of Shadow Trading"
    mythicalLore: (0, pg_core_1.text)("mythical_lore").notNull(), // Background story and significance
    trialMaster: (0, pg_core_1.text)("trial_master"), // Name of legendary figure who judges trial
    sacredLocation: (0, pg_core_1.text)("sacred_location"), // Mystical setting description
    completionRitual: (0, pg_core_1.text)("completion_ritual"), // Ceremony for successful completion
    trialIcon: (0, pg_core_1.text)("trial_icon").default("Award"),
    atmosphericTheme: (0, pg_core_1.text)("atmospheric_theme").default("mystical"), // UI theme
    // Analytics and balancing
    attemptCount: (0, pg_core_1.integer)("attempt_count").default(0),
    successRate: (0, pg_core_1.decimal)("success_rate", { precision: 8, scale: 2 }).default("0.00"),
    avgScore: (0, pg_core_1.decimal)("avg_score", { precision: 8, scale: 2 }).default("0.00"),
    avgCompletionTime: (0, pg_core_1.integer)("avg_completion_time_minutes"),
    difficulty_rating: (0, pg_core_1.decimal)("difficulty_rating", { precision: 3, scale: 2 }), // User feedback
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    seasonalAvailability: (0, pg_core_1.jsonb)("seasonal_availability"), // Special availability windows
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_trials_mastery_house_id").on(table.houseId),
    (0, pg_core_1.index)("idx_trials_mastery_type").on(table.trialType),
    (0, pg_core_1.index)("idx_trials_mastery_difficulty").on(table.difficultyLevel),
    (0, pg_core_1.index)("idx_trials_mastery_active").on(table.isActive),
]);
// User Trial Attempts - Tracking trial participation and results
exports.userTrialAttempts = (0, pg_core_1.pgTable)("user_trial_attempts", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    trialId: (0, pg_core_1.varchar)("trial_id").notNull().references(() => exports.trialsOfMastery.id),
    attemptNumber: (0, pg_core_1.integer)("attempt_number").notNull().default(1),
    // Attempt results
    status: (0, pg_core_1.text)("status").notNull().default("in_progress"), // 'in_progress', 'completed', 'abandoned', 'failed'
    overallScore: (0, pg_core_1.decimal)("overall_score", { precision: 8, scale: 2 }),
    phaseScores: (0, pg_core_1.jsonb)("phase_scores"), // Scores for each trial phase
    timeSpentMinutes: (0, pg_core_1.integer)("time_spent_minutes").default(0),
    passed: (0, pg_core_1.boolean)("passed").default(false),
    perfectScore: (0, pg_core_1.boolean)("perfect_score").default(false),
    // Trial performance data
    responses: (0, pg_core_1.jsonb)("responses"), // User responses to questions/challenges
    tradeSimulationResults: (0, pg_core_1.jsonb)("trade_simulation_results"), // Performance in simulated trading
    peerReviewScores: (0, pg_core_1.jsonb)("peer_review_scores"), // Peer evaluation results
    masterComments: (0, pg_core_1.text)("master_comments"), // Feedback from trial master
    // Rewards and unlocks
    experienceAwarded: (0, pg_core_1.integer)("experience_awarded").default(0),
    karmaAwarded: (0, pg_core_1.integer)("karma_awarded").default(0),
    skillsUnlocked: (0, pg_core_1.text)("skills_unlocked").array(),
    certificationsEarned: (0, pg_core_1.text)("certifications_earned").array(),
    tradingPrivilegesGranted: (0, pg_core_1.jsonb)("trading_privileges_granted"),
    // Trial ceremony and recognition
    completionCeremonyViewed: (0, pg_core_1.boolean)("completion_ceremony_viewed").default(false),
    publicRecognition: (0, pg_core_1.boolean)("public_recognition").default(false), // Announcement to house/community
    witnessedBy: (0, pg_core_1.text)("witnessed_by").array(), // Other users who witnessed completion
    legendaryAchievement: (0, pg_core_1.boolean)("legendary_achievement").default(false), // Exceptional performance
    // Analytics and feedback
    difficultyRating: (0, pg_core_1.integer)("difficulty_rating"), // User's rating 1-5
    enjoymentRating: (0, pg_core_1.integer)("enjoyment_rating"), // User's rating 1-5
    wouldRecommend: (0, pg_core_1.boolean)("would_recommend").default(true),
    feedback: (0, pg_core_1.text)("feedback"),
    startedAt: (0, pg_core_1.timestamp)("started_at").defaultNow(),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_user_trial_attempts_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_user_trial_attempts_trial_id").on(table.trialId),
    (0, pg_core_1.index)("idx_user_trial_attempts_status").on(table.status),
    (0, pg_core_1.index)("idx_user_trial_attempts_passed").on(table.passed),
    (0, pg_core_1.index)("idx_user_trial_attempts_completed").on(table.completedAt),
]);
// Divine Certifications - Formal achievement recognition
exports.divineCertifications = (0, pg_core_1.pgTable)("divine_certifications", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    houseId: (0, pg_core_1.text)("house_id"), // House-specific or universal certification
    certificationLevel: (0, pg_core_1.text)("certification_level").notNull(), // 'apprentice', 'journeyman', 'master', 'grandmaster', 'legendary'
    category: (0, pg_core_1.text)("category").notNull(), // 'trading', 'analysis', 'leadership', 'teaching', 'innovation'
    // Certification requirements
    requirements: (0, pg_core_1.jsonb)("requirements").notNull(), // Detailed achievement requirements
    prerequisiteCertifications: (0, pg_core_1.text)("prerequisite_certifications").array(),
    minimumKarma: (0, pg_core_1.integer)("minimum_karma").default(0),
    minimumHouseStanding: (0, pg_core_1.text)("minimum_house_standing"),
    // Visual and recognition elements
    badgeDesign: (0, pg_core_1.jsonb)("badge_design"), // NFT-style badge appearance
    certificateTemplate: (0, pg_core_1.text)("certificate_template"), // PDF template URL
    publicTitle: (0, pg_core_1.text)("public_title").notNull(), // "Master of Mystical Analytics", "Divine Oracle of Prophecy"
    titleAbbreviation: (0, pg_core_1.text)("title_abbreviation"), // "MMA", "DOP"
    prestigePoints: (0, pg_core_1.integer)("prestige_points").default(100),
    // Certification benefits
    tradingBonuses: (0, pg_core_1.jsonb)("trading_bonuses"), // Bonuses granted to certificate holders
    exclusiveAccess: (0, pg_core_1.jsonb)("exclusive_access"), // Special features/areas unlocked
    teachingPrivileges: (0, pg_core_1.boolean)("teaching_privileges").default(false), // Can mentor others
    leadershipPrivileges: (0, pg_core_1.boolean)("leadership_privileges").default(false), // Can lead house activities
    // Recognition and display
    displayBorder: (0, pg_core_1.text)("display_border").default("golden"), // 'bronze', 'silver', 'golden', 'prismatic'
    glowEffect: (0, pg_core_1.text)("glow_effect"), // Special visual effects
    rarityLevel: (0, pg_core_1.text)("rarity_level").default("rare"), // 'common', 'rare', 'epic', 'legendary', 'mythic'
    limitedEdition: (0, pg_core_1.boolean)("limited_edition").default(false),
    maxIssuances: (0, pg_core_1.integer)("max_issuances"), // Maximum certificates that can be issued
    currentIssuances: (0, pg_core_1.integer)("current_issuances").default(0),
    // Metadata and lifecycle
    validityPeriod: (0, pg_core_1.integer)("validity_period_months"), // How long certification lasts
    renewalRequired: (0, pg_core_1.boolean)("renewal_required").default(false),
    retireDate: (0, pg_core_1.timestamp)("retire_date"), // When this certification is no longer available
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_divine_certifications_house_id").on(table.houseId),
    (0, pg_core_1.index)("idx_divine_certifications_level").on(table.certificationLevel),
    (0, pg_core_1.index)("idx_divine_certifications_category").on(table.category),
    (0, pg_core_1.index)("idx_divine_certifications_rarity").on(table.rarityLevel),
    (0, pg_core_1.index)("idx_divine_certifications_active").on(table.isActive),
]);
// User Certifications - Certifications earned by users
exports.userCertifications = (0, pg_core_1.pgTable)("user_certifications", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    certificationId: (0, pg_core_1.varchar)("certification_id").notNull().references(() => exports.divineCertifications.id),
    // Achievement details
    achievementMethod: (0, pg_core_1.text)("achievement_method").notNull(), // 'trial_completion', 'peer_recognition', 'divine_appointment'
    verificationData: (0, pg_core_1.jsonb)("verification_data"), // Proof of achievement
    witnessedBy: (0, pg_core_1.text)("witnessed_by").array(), // Other users who witnessed achievement
    awardingMaster: (0, pg_core_1.text)("awarding_master"), // Who granted the certification
    // Certificate details
    certificateNumber: (0, pg_core_1.text)("certificate_number").notNull().unique(), // Unique certificate identifier
    certificateUrl: (0, pg_core_1.text)("certificate_url"), // PDF/NFT certificate URL
    badgeImageUrl: (0, pg_core_1.text)("badge_image_url"), // Badge image for display
    publicTitle: (0, pg_core_1.text)("public_title").notNull(), // User's granted title
    // Recognition and ceremony
    ceremonyCompleted: (0, pg_core_1.boolean)("ceremony_completed").default(false),
    ceremonyDate: (0, pg_core_1.timestamp)("ceremony_date"),
    publicAnnouncement: (0, pg_core_1.boolean)("public_announcement").default(true),
    featuredInHouse: (0, pg_core_1.boolean)("featured_in_house").default(false),
    communityReactions: (0, pg_core_1.jsonb)("community_reactions"), // Likes, congratulations, etc.
    // Certification status
    status: (0, pg_core_1.text)("status").notNull().default("active"), // 'active', 'expired', 'revoked', 'suspended'
    validUntil: (0, pg_core_1.timestamp)("valid_until"),
    renewalReminderSent: (0, pg_core_1.boolean)("renewal_reminder_sent").default(false),
    // Usage and impact
    displayInProfile: (0, pg_core_1.boolean)("display_in_profile").default(true),
    sharableUrl: (0, pg_core_1.text)("sharable_url"), // Public sharing URL
    timestampProof: (0, pg_core_1.text)("timestamp_proof"), // Blockchain/verification timestamp
    achievementScore: (0, pg_core_1.decimal)("achievement_score", { precision: 8, scale: 2 }), // Quality of achievement
    awardedAt: (0, pg_core_1.timestamp)("awarded_at").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_user_certifications_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_user_certifications_cert_id").on(table.certificationId),
    (0, pg_core_1.index)("idx_user_certifications_status").on(table.status),
    (0, pg_core_1.index)("idx_user_certifications_awarded").on(table.awardedAt),
    (0, pg_core_1.index)("idx_user_certifications_public").on(table.displayInProfile),
    // Unique constraint - one certification per user per type
    (0, pg_core_1.index)("idx_user_cert_unique").on(table.userId, table.certificationId),
]);
// Learning Analytics - Comprehensive progress and performance tracking
exports.learningAnalytics = (0, pg_core_1.pgTable)("learning_analytics", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    // Overall learning progress
    totalExperienceEarned: (0, pg_core_1.integer)("total_experience_earned").default(0),
    totalLessonsCompleted: (0, pg_core_1.integer)("total_lessons_completed").default(0),
    totalSkillsUnlocked: (0, pg_core_1.integer)("total_skills_unlocked").default(0),
    totalTrialsPassed: (0, pg_core_1.integer)("total_trials_passed").default(0),
    totalCertificationsEarned: (0, pg_core_1.integer)("total_certifications_earned").default(0),
    // Learning velocity and patterns
    lessonsPerWeek: (0, pg_core_1.decimal)("lessons_per_week", { precision: 8, scale: 2 }).default("0.00"),
    avgScoreAchieved: (0, pg_core_1.decimal)("avg_score_achieved", { precision: 8, scale: 2 }).default("0.00"),
    learningStreak: (0, pg_core_1.integer)("learning_streak_days").default(0),
    longestLearningStreak: (0, pg_core_1.integer)("longest_learning_streak_days").default(0),
    preferredLearningTime: (0, pg_core_1.text)("preferred_learning_time"), // 'morning', 'afternoon', 'evening', 'night'
    avgSessionDuration: (0, pg_core_1.integer)("avg_session_duration_minutes").default(0),
    // House-specific progress
    primaryHouseMastery: (0, pg_core_1.decimal)("primary_house_mastery", { precision: 8, scale: 2 }).default("0.00"),
    secondaryHousesExplored: (0, pg_core_1.text)("secondary_houses_explored").array(),
    crossHouseProgress: (0, pg_core_1.jsonb)("cross_house_progress"), // Progress in other houses
    houseRank: (0, pg_core_1.integer)("house_rank").default(0), // Rank within house for learning
    // Learning style and preferences
    preferredLessonTypes: (0, pg_core_1.text)("preferred_lesson_types").array(), // 'crystal_orb', 'sacred_tome', etc.
    learningStyleProfile: (0, pg_core_1.jsonb)("learning_style_profile"), // Visual, auditory, kinesthetic, etc.
    difficultyPreference: (0, pg_core_1.text)("difficulty_preference").default("adaptive"), // 'easy', 'moderate', 'challenging', 'adaptive'
    pacePreference: (0, pg_core_1.text)("pace_preference").default("self_paced"), // 'slow', 'self_paced', 'accelerated'
    // Social learning aspects
    mentorshipGiven: (0, pg_core_1.integer)("mentorship_given_hours").default(0),
    mentorshipReceived: (0, pg_core_1.integer)("mentorship_received_hours").default(0),
    peerReviewsGiven: (0, pg_core_1.integer)("peer_reviews_given").default(0),
    peerReviewsReceived: (0, pg_core_1.integer)("peer_reviews_received").default(0),
    communityContributions: (0, pg_core_1.integer)("community_contributions").default(0),
    teachingRating: (0, pg_core_1.decimal)("teaching_rating", { precision: 3, scale: 2 }), // From students taught
    // Adaptive learning data
    knowledgeGaps: (0, pg_core_1.jsonb)("knowledge_gaps"), // Areas needing improvement
    strengthAreas: (0, pg_core_1.jsonb)("strength_areas"), // Areas of excellence
    recommendedPaths: (0, pg_core_1.jsonb)("recommended_paths"), // AI-suggested learning paths
    personalizedDifficulty: (0, pg_core_1.decimal)("personalized_difficulty", { precision: 3, scale: 2 }).default("3.00"), // 1-5 scale
    // Engagement and motivation
    motivationLevel: (0, pg_core_1.decimal)("motivation_level", { precision: 3, scale: 2 }).default("3.00"), // 1-5 scale
    engagementTrend: (0, pg_core_1.text)("engagement_trend").default("stable"), // 'increasing', 'stable', 'decreasing'
    lastActiveDate: (0, pg_core_1.timestamp)("last_active_date"),
    totalTimeSpent: (0, pg_core_1.integer)("total_time_spent_minutes").default(0),
    achievementCelebrations: (0, pg_core_1.integer)("achievement_celebrations").default(0),
    // Predictive analytics
    predictedCompletionDate: (0, pg_core_1.timestamp)("predicted_completion_date"),
    riskOfDropout: (0, pg_core_1.decimal)("risk_of_dropout", { precision: 3, scale: 2 }).default("0.00"), // 0-1 probability
    recommendedInterventions: (0, pg_core_1.jsonb)("recommended_interventions"), // Suggestions to improve
    // Timestamps
    calculatedAt: (0, pg_core_1.timestamp)("calculated_at").defaultNow(),
    nextCalculationDue: (0, pg_core_1.timestamp)("next_calculation_due"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_learning_analytics_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_learning_analytics_house_mastery").on(table.primaryHouseMastery),
    (0, pg_core_1.index)("idx_learning_analytics_last_active").on(table.lastActiveDate),
    (0, pg_core_1.index)("idx_learning_analytics_calculated").on(table.calculatedAt),
    // Unique constraint - one analytics record per user
    (0, pg_core_1.index)("idx_learning_analytics_unique_user").on(table.userId),
]);
// Insert schemas for learning system tables
exports.insertLearningPathSchema = (0, drizzle_zod_1.createInsertSchema)(exports.learningPaths).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertSacredLessonSchema = (0, drizzle_zod_1.createInsertSchema)(exports.sacredLessons).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertMysticalSkillSchema = (0, drizzle_zod_1.createInsertSchema)(exports.mysticalSkills).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertUserLessonProgressSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userLessonProgress).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertUserSkillUnlockSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userSkillUnlocks).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertTrialOfMasterySchema = (0, drizzle_zod_1.createInsertSchema)(exports.trialsOfMastery).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertUserTrialAttemptSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userTrialAttempts).omit({
    id: true,
    createdAt: true,
});
exports.insertDivineCertificationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.divineCertifications).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertUserCertificationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userCertifications).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertLearningAnalyticsSchema = (0, drizzle_zod_1.createInsertSchema)(exports.learningAnalytics).omit({
    id: true,
    calculatedAt: true,
    createdAt: true,
    updatedAt: true,
});
// ===========================
// CAREER PATHWAY CERTIFICATION SYSTEM
// ===========================
// Career Pathway Levels - Define the certification tiers for each pathway
exports.careerPathwayLevels = (0, pg_core_1.pgTable)("career_pathway_levels", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    pathway: (0, pg_core_1.text)("pathway").notNull(), // 'associate', 'family_office', 'hedge_fund', 'agency'
    level: (0, pg_core_1.text)("level").notNull(), // 'associate', 'tier1', 'tier2', 'tier3', 'tier4'
    name: (0, pg_core_1.text)("name").notNull(), // 'Associate', 'Family Office Steward', 'Hedge Fund Analyst', etc.
    description: (0, pg_core_1.text)("description").notNull(),
    displayOrder: (0, pg_core_1.integer)("display_order").notNull(), // Sequence in pathway
    // Unlocks and rewards
    tradingFeatureUnlocks: (0, pg_core_1.jsonb)("trading_feature_unlocks"), // Features unlocked at this level
    baseSalaryMax: (0, pg_core_1.decimal)("base_salary_max", { precision: 15, scale: 2 }).notNull(), // Maximum salary for this level
    certificationBonus: (0, pg_core_1.decimal)("certification_bonus_percent", { precision: 5, scale: 2 }).default("100.00"), // 100% for 3/5, 150% for 5/5
    masterBonus: (0, pg_core_1.decimal)("master_bonus_percent", { precision: 5, scale: 2 }).default("150.00"),
    prerequisiteLevel: (0, pg_core_1.varchar)("prerequisite_level"), // Previous level required
    // Metadata
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_career_pathway_pathway").on(table.pathway),
    (0, pg_core_1.index)("idx_career_pathway_level").on(table.level),
    (0, pg_core_1.index)("idx_career_pathway_order").on(table.displayOrder),
]);
// Certification Courses - 5 courses per certification level
exports.certificationCourses = (0, pg_core_1.pgTable)("certification_courses", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    pathwayLevelId: (0, pg_core_1.varchar)("pathway_level_id").notNull().references(() => exports.careerPathwayLevels.id),
    courseNumber: (0, pg_core_1.integer)("course_number").notNull(), // 1-5
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    difficulty: (0, pg_core_1.text)("difficulty").notNull(), // 'easy', 'intermediate', 'advanced', 'master'
    estimatedDuration: (0, pg_core_1.integer)("estimated_duration_hours").default(2),
    // Course content
    modules: (0, pg_core_1.jsonb)("modules").notNull(), // Course curriculum and materials
    learningObjectives: (0, pg_core_1.text)("learning_objectives").array(),
    prerequisites: (0, pg_core_1.text)("prerequisites").array(),
    // Exam configuration
    examQuestions: (0, pg_core_1.jsonb)("exam_questions").notNull(), // Exam scenarios and questions
    passingScore: (0, pg_core_1.integer)("passing_score").default(70), // Percentage to pass
    maxAttempts: (0, pg_core_1.integer)("max_attempts").default(3), // Free attempts before penalty
    retryPenaltyAmount: (0, pg_core_1.decimal)("retry_penalty_amount", { precision: 10, scale: 2 }), // 4th attempt fee
    // Trading feature unlocks
    featureUnlocks: (0, pg_core_1.jsonb)("feature_unlocks"), // Specific features this course unlocks
    tradingPermissions: (0, pg_core_1.jsonb)("trading_permissions"), // Permissions granted
    // Metadata
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_cert_courses_pathway_level").on(table.pathwayLevelId),
    (0, pg_core_1.index)("idx_cert_courses_number").on(table.courseNumber),
    (0, pg_core_1.index)("idx_cert_courses_difficulty").on(table.difficulty),
]);
// User Course Enrollments - Track user progress in certification courses
exports.userCourseEnrollments = (0, pg_core_1.pgTable)("user_course_enrollments", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    courseId: (0, pg_core_1.varchar)("course_id").notNull().references(() => exports.certificationCourses.id),
    pathwayLevelId: (0, pg_core_1.varchar)("pathway_level_id").notNull().references(() => exports.careerPathwayLevels.id),
    // Progress tracking
    status: (0, pg_core_1.text)("status").notNull().default("enrolled"), // 'enrolled', 'in_progress', 'completed', 'failed'
    progressPercent: (0, pg_core_1.decimal)("progress_percent", { precision: 5, scale: 2 }).default("0.00"),
    currentModule: (0, pg_core_1.integer)("current_module").default(1),
    completedModules: (0, pg_core_1.integer)("completed_modules").array().default((0, drizzle_orm_1.sql) `ARRAY[]::integer[]`),
    timeSpent: (0, pg_core_1.integer)("time_spent_minutes").default(0),
    // Exam attempts
    examAttempts: (0, pg_core_1.integer)("exam_attempts").default(0),
    bestScore: (0, pg_core_1.decimal)("best_score", { precision: 5, scale: 2 }),
    lastAttemptScore: (0, pg_core_1.decimal)("last_attempt_score", { precision: 5, scale: 2 }),
    passed: (0, pg_core_1.boolean)("passed").default(false),
    passedAt: (0, pg_core_1.timestamp)("passed_at"),
    // Penalty tracking
    penaltyCharges: (0, pg_core_1.decimal)("penalty_charges", { precision: 10, scale: 2 }).default("0.00"),
    penaltyAttempts: (0, pg_core_1.integer)("penalty_attempts").default(0), // Attempts beyond free limit
    // Metadata
    enrolledAt: (0, pg_core_1.timestamp)("enrolled_at").defaultNow(),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_user_enrollments_user").on(table.userId),
    (0, pg_core_1.index)("idx_user_enrollments_course").on(table.courseId),
    (0, pg_core_1.index)("idx_user_enrollments_pathway").on(table.pathwayLevelId),
    (0, pg_core_1.index)("idx_user_enrollments_status").on(table.status),
]);
// User Pathway Progress - Overall certification pathway progress
exports.userPathwayProgress = (0, pg_core_1.pgTable)("user_pathway_progress", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    pathway: (0, pg_core_1.text)("pathway").notNull(), // 'associate', 'family_office', 'hedge_fund', 'agency'
    currentLevelId: (0, pg_core_1.varchar)("current_level_id").references(() => exports.careerPathwayLevels.id),
    // Certification status
    coursesPassed: (0, pg_core_1.integer)("courses_passed").default(0), // Total courses passed at current level
    isCertified: (0, pg_core_1.boolean)("is_certified").default(false), // 3/5 courses passed
    isMasterCertified: (0, pg_core_1.boolean)("is_master_certified").default(false), // 5/5 courses passed
    // Hidden salary bonuses (revealed after certification)
    certificationBonusRevealed: (0, pg_core_1.boolean)("certification_bonus_revealed").default(false),
    certificationBonusAmount: (0, pg_core_1.decimal)("certification_bonus_amount", { precision: 15, scale: 2 }),
    masterBonusRevealed: (0, pg_core_1.boolean)("master_bonus_revealed").default(false),
    masterBonusAmount: (0, pg_core_1.decimal)("master_bonus_amount", { precision: 15, scale: 2 }),
    // Current salary
    currentSalaryMax: (0, pg_core_1.decimal)("current_salary_max", { precision: 15, scale: 2 }),
    // Progression tracking
    totalCoursesCompleted: (0, pg_core_1.integer)("total_courses_completed").default(0),
    totalExamAttempts: (0, pg_core_1.integer)("total_exam_attempts").default(0),
    totalPenaltiesCharged: (0, pg_core_1.decimal)("total_penalties_charged", { precision: 10, scale: 2 }).default("0.00"),
    pathwayStartedAt: (0, pg_core_1.timestamp)("pathway_started_at").defaultNow(),
    lastLevelCompletedAt: (0, pg_core_1.timestamp)("last_level_completed_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_user_pathway_user").on(table.userId),
    (0, pg_core_1.index)("idx_user_pathway_pathway").on(table.pathway),
    (0, pg_core_1.index)("idx_user_pathway_level").on(table.currentLevelId),
    (0, pg_core_1.index)("idx_user_pathway_certified").on(table.isCertified),
    (0, pg_core_1.index)("idx_user_pathway_master").on(table.isMasterCertified),
]);
// Exam Attempts - Individual exam attempt records
exports.examAttempts = (0, pg_core_1.pgTable)("exam_attempts", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    courseId: (0, pg_core_1.varchar)("course_id").notNull().references(() => exports.certificationCourses.id),
    enrollmentId: (0, pg_core_1.varchar)("enrollment_id").notNull().references(() => exports.userCourseEnrollments.id),
    // Attempt details
    attemptNumber: (0, pg_core_1.integer)("attempt_number").notNull(),
    isPenaltyAttempt: (0, pg_core_1.boolean)("is_penalty_attempt").default(false),
    penaltyCharged: (0, pg_core_1.decimal)("penalty_charged", { precision: 10, scale: 2 }),
    // Exam results
    score: (0, pg_core_1.decimal)("score", { precision: 5, scale: 2 }).notNull(),
    passed: (0, pg_core_1.boolean)("passed").notNull(),
    totalQuestions: (0, pg_core_1.integer)("total_questions").notNull(),
    correctAnswers: (0, pg_core_1.integer)("correct_answers").notNull(),
    // Exam data
    responses: (0, pg_core_1.jsonb)("responses").notNull(), // User's answers
    timeSpent: (0, pg_core_1.integer)("time_spent_seconds"),
    // Feedback
    feedback: (0, pg_core_1.text)("feedback"), // Auto-generated feedback
    areasForImprovement: (0, pg_core_1.text)("areas_for_improvement").array(),
    // Metadata
    attemptedAt: (0, pg_core_1.timestamp)("attempted_at").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_exam_attempts_user").on(table.userId),
    (0, pg_core_1.index)("idx_exam_attempts_course").on(table.courseId),
    (0, pg_core_1.index)("idx_exam_attempts_enrollment").on(table.enrollmentId),
    (0, pg_core_1.index)("idx_exam_attempts_passed").on(table.passed),
    (0, pg_core_1.index)("idx_exam_attempts_penalty").on(table.isPenaltyAttempt),
]);
// Insert schemas for career pathway tables
exports.insertCareerPathwayLevelSchema = (0, drizzle_zod_1.createInsertSchema)(exports.careerPathwayLevels).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertCertificationCourseSchema = (0, drizzle_zod_1.createInsertSchema)(exports.certificationCourses).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertUserCourseEnrollmentSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userCourseEnrollments).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertUserPathwayProgressSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userPathwayProgress).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertExamAttemptSchema = (0, drizzle_zod_1.createInsertSchema)(exports.examAttempts).omit({
    id: true,
    createdAt: true,
});
// ===========================
// SUBSCRIBER COURSE INCENTIVES SYSTEM
// ===========================
// Subscriber Course Incentives - Track rewards for subscribers completing courses
exports.subscriberCourseIncentives = (0, pg_core_1.pgTable)("subscriber_course_incentives", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    courseId: (0, pg_core_1.varchar)("course_id").references(() => exports.certificationCourses.id),
    pathwayLevelId: (0, pg_core_1.varchar)("pathway_level_id").references(() => exports.careerPathwayLevels.id),
    // Incentive type and value
    incentiveType: (0, pg_core_1.text)("incentive_type").notNull(), // 'capital_bonus', 'fee_discount', 'xp_multiplier', 'early_access'
    incentiveValue: (0, pg_core_1.decimal)("incentive_value", { precision: 15, scale: 2 }).notNull(), // Dollar amount or percentage
    // Activation and expiry
    status: (0, pg_core_1.text)("status").notNull().default("pending"), // 'pending', 'active', 'expired', 'claimed'
    activatedAt: (0, pg_core_1.timestamp)("activated_at"),
    expiresAt: (0, pg_core_1.timestamp)("expires_at"),
    // Tracking
    claimedAt: (0, pg_core_1.timestamp)("claimed_at"),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    description: (0, pg_core_1.text)("description"), // Human-readable description
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_subscriber_incentives_user").on(table.userId),
    (0, pg_core_1.index)("idx_subscriber_incentives_type").on(table.incentiveType),
    (0, pg_core_1.index)("idx_subscriber_incentives_status").on(table.status),
    (0, pg_core_1.index)("idx_subscriber_incentives_course").on(table.courseId),
]);
// Subscriber Active Benefits - Current active benefits for subscribers
exports.subscriberActiveBenefits = (0, pg_core_1.pgTable)("subscriber_active_benefits", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    // Capital bonuses
    totalCapitalBonusEarned: (0, pg_core_1.decimal)("total_capital_bonus_earned", { precision: 15, scale: 2 }).default("0.00"),
    pendingCapitalBonus: (0, pg_core_1.decimal)("pending_capital_bonus", { precision: 15, scale: 2 }).default("0.00"),
    // Trading fee discounts (percentage)
    tradingFeeDiscount: (0, pg_core_1.decimal)("trading_fee_discount", { precision: 5, scale: 2 }).default("0.00"), // 0-100%
    feeDiscountExpiresAt: (0, pg_core_1.timestamp)("fee_discount_expires_at"),
    // XP multipliers
    xpMultiplier: (0, pg_core_1.decimal)("xp_multiplier", { precision: 5, scale: 2 }).default("1.00"), // 1x to 3x
    xpMultiplierExpiresAt: (0, pg_core_1.timestamp)("xp_multiplier_expires_at"),
    // Early access flags
    hasEarlyAccess: (0, pg_core_1.boolean)("has_early_access").default(false),
    earlyAccessFeatures: (0, pg_core_1.text)("early_access_features").array(), // Array of feature flags
    earlyAccessExpiresAt: (0, pg_core_1.timestamp)("early_access_expires_at"),
    // Badge and tier display
    certificationBadgeTier: (0, pg_core_1.text)("certification_badge_tier"), // 'certified', 'master', 'legend'
    displayBadge: (0, pg_core_1.boolean)("display_badge").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_subscriber_benefits_user").on(table.userId),
    (0, pg_core_1.index)("idx_subscriber_benefits_badge").on(table.certificationBadgeTier),
]);
// Subscriber Incentive History - Audit trail of all incentives awarded
exports.subscriberIncentiveHistory = (0, pg_core_1.pgTable)("subscriber_incentive_history", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    incentiveId: (0, pg_core_1.varchar)("incentive_id").references(() => exports.subscriberCourseIncentives.id),
    // Event details
    eventType: (0, pg_core_1.text)("event_type").notNull(), // 'awarded', 'claimed', 'expired', 'revoked'
    incentiveType: (0, pg_core_1.text)("incentive_type").notNull(),
    incentiveValue: (0, pg_core_1.decimal)("incentive_value", { precision: 15, scale: 2 }).notNull(),
    // Context
    sourceType: (0, pg_core_1.text)("source_type").notNull(), // 'course_completion', 'certification_earned', 'milestone', 'special_event'
    sourceId: (0, pg_core_1.varchar)("source_id"), // Reference to course, certification, etc.
    description: (0, pg_core_1.text)("description"),
    metadata: (0, pg_core_1.jsonb)("metadata"), // Additional context
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_incentive_history_user").on(table.userId),
    (0, pg_core_1.index)("idx_incentive_history_event").on(table.eventType),
    (0, pg_core_1.index)("idx_incentive_history_source").on(table.sourceType),
]);
// Insert schemas for subscriber incentive tables
exports.insertSubscriberCourseIncentiveSchema = (0, drizzle_zod_1.createInsertSchema)(exports.subscriberCourseIncentives).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertSubscriberActiveBenefitsSchema = (0, drizzle_zod_1.createInsertSchema)(exports.subscriberActiveBenefits).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertSubscriberIncentiveHistorySchema = (0, drizzle_zod_1.createInsertSchema)(exports.subscriberIncentiveHistory).omit({
    id: true,
    createdAt: true,
});
// ===========================
// EASTER EGG SYSTEM - Hidden rewards for subscribers
// ===========================
// Easter Egg Definitions - Define all possible Easter eggs with triggers and rewards
exports.easterEggDefinitions = (0, pg_core_1.pgTable)("easter_egg_definitions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull(),
    internalCode: (0, pg_core_1.text)("internal_code").notNull().unique(), // e.g., 'SEVEN_DAY_STREAK'
    description: (0, pg_core_1.text)("description").notNull(),
    discoveryHint: (0, pg_core_1.text)("discovery_hint"), // Subtle hint shown to users
    // Trigger configuration
    triggerType: (0, pg_core_1.text)("trigger_type").notNull(), // 'consecutive_profitable_days', 'portfolio_milestone', 'achievement_chain', 'hidden_action', 'trading_pattern', 'total_volume'
    triggerConditions: (0, pg_core_1.jsonb)("trigger_conditions").notNull(), // e.g., { days: 7, profitThreshold: 0 } or { portfolioValue: 100000 }
    requiresPreviousEggs: (0, pg_core_1.text)("requires_previous_eggs").array(), // Array of egg IDs that must be unlocked first
    // Reward configuration
    rewardType: (0, pg_core_1.text)("reward_type").notNull(), // 'capital_bonus', 'secret_badge', 'exclusive_asset', 'fee_waiver', 'xp_boost', 'special_title'
    rewardValue: (0, pg_core_1.text)("reward_value").notNull(), // Amount or identifier
    rewardDescription: (0, pg_core_1.text)("reward_description").notNull(),
    // Gating and visibility
    subscribersOnly: (0, pg_core_1.boolean)("subscribers_only").default(true),
    requiredSubscriptionTier: (0, pg_core_1.text)("required_subscription_tier"), // 'basic', 'premium', 'elite' or null for any subscriber
    isSecret: (0, pg_core_1.boolean)("is_secret").default(true), // If true, not shown in collection until discovered
    difficultyRating: (0, pg_core_1.integer)("difficulty_rating").default(1), // 1-5 difficulty
    // Metadata
    rarity: (0, pg_core_1.text)("rarity").default("common"), // 'common', 'uncommon', 'rare', 'epic', 'legendary'
    category: (0, pg_core_1.text)("category"), // 'trading_mastery', 'portfolio_achievement', 'hidden_secrets', 'time_based', 'social'
    iconUrl: (0, pg_core_1.text)("icon_url"),
    badgeColor: (0, pg_core_1.text)("badge_color"),
    flavorText: (0, pg_core_1.text)("flavor_text"), // Lore/story text
    // Activity tracking
    timesUnlocked: (0, pg_core_1.integer)("times_unlocked").default(0),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_easter_egg_trigger_type").on(table.triggerType),
    (0, pg_core_1.index)("idx_easter_egg_subscribers_only").on(table.subscribersOnly),
    (0, pg_core_1.index)("idx_easter_egg_active").on(table.isActive),
]);
// Easter Egg User Progress - Track user progress towards unlocking eggs
exports.easterEggUserProgress = (0, pg_core_1.pgTable)("easter_egg_user_progress", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    eggId: (0, pg_core_1.varchar)("egg_id").notNull().references(() => exports.easterEggDefinitions.id),
    // Progress tracking
    progressValue: (0, pg_core_1.decimal)("progress_value", { precision: 15, scale: 2 }).default("0"), // Current progress (e.g., 3/7 days)
    progressPercentage: (0, pg_core_1.decimal)("progress_percentage", { precision: 5, scale: 2 }).default("0"), // 0-100%
    progressData: (0, pg_core_1.jsonb)("progress_data"), // Additional tracking data (dates, actions, etc.)
    // State
    isUnlocked: (0, pg_core_1.boolean)("is_unlocked").default(false),
    unlockedAt: (0, pg_core_1.timestamp)("unlocked_at"),
    lastProgressUpdate: (0, pg_core_1.timestamp)("last_progress_update").defaultNow(),
    // Streaks and chains
    currentStreak: (0, pg_core_1.integer)("current_streak").default(0),
    longestStreak: (0, pg_core_1.integer)("longest_streak").default(0),
    streakBrokenAt: (0, pg_core_1.timestamp)("streak_broken_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_egg_progress_user").on(table.userId),
    (0, pg_core_1.index)("idx_egg_progress_egg").on(table.eggId),
    (0, pg_core_1.index)("idx_egg_progress_unlocked").on(table.isUnlocked),
    (0, pg_core_1.index)("idx_egg_progress_user_egg").on(table.userId, table.eggId),
]);
// Easter Egg Unlocks - Records of unlocked eggs and claimed rewards
exports.easterEggUnlocks = (0, pg_core_1.pgTable)("easter_egg_unlocks", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    eggId: (0, pg_core_1.varchar)("egg_id").notNull().references(() => exports.easterEggDefinitions.id),
    progressId: (0, pg_core_1.varchar)("progress_id").references(() => exports.easterEggUserProgress.id),
    // Unlock details
    unlockedAt: (0, pg_core_1.timestamp)("unlocked_at").defaultNow(),
    unlockMethod: (0, pg_core_1.text)("unlock_method"), // How it was discovered
    unlockContext: (0, pg_core_1.jsonb)("unlock_context"), // Context data at time of unlock
    // Reward claim
    rewardClaimed: (0, pg_core_1.boolean)("reward_claimed").default(false),
    rewardClaimedAt: (0, pg_core_1.timestamp)("reward_claimed_at"),
    rewardType: (0, pg_core_1.text)("reward_type").notNull(),
    rewardValue: (0, pg_core_1.text)("reward_value").notNull(),
    rewardApplied: (0, pg_core_1.boolean)("reward_applied").default(false), // Whether reward has been applied to account
    // Social/display
    isPublic: (0, pg_core_1.boolean)("is_public").default(false), // Whether user wants to show this achievement
    displayOnProfile: (0, pg_core_1.boolean)("display_on_profile").default(true),
    // Notification
    notificationSent: (0, pg_core_1.boolean)("notification_sent").default(false),
    notificationSeenAt: (0, pg_core_1.timestamp)("notification_seen_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_egg_unlocks_user").on(table.userId),
    (0, pg_core_1.index)("idx_egg_unlocks_egg").on(table.eggId),
    (0, pg_core_1.index)("idx_egg_unlocks_claimed").on(table.rewardClaimed),
    (0, pg_core_1.index)("idx_egg_unlocks_public").on(table.isPublic),
]);
// Insert schemas for Easter egg tables
exports.insertEasterEggDefinitionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.easterEggDefinitions).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    timesUnlocked: true,
});
exports.insertEasterEggUserProgressSchema = (0, drizzle_zod_1.createInsertSchema)(exports.easterEggUserProgress).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertEasterEggUnlockSchema = (0, drizzle_zod_1.createInsertSchema)(exports.easterEggUnlocks).omit({
    id: true,
    createdAt: true,
});
// ===========================
// ADVANCED MARKET INTELLIGENCE SYSTEM TABLES
// ===========================
// AI Market Predictions - Store AI-generated market forecasts and price predictions
exports.aiMarketPredictions = (0, pg_core_1.pgTable)("ai_market_predictions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    predictionType: (0, pg_core_1.text)("prediction_type").notNull(), // 'price', 'trend', 'sentiment', 'battle_outcome'
    timeframe: (0, pg_core_1.text)("timeframe").notNull(), // '1d', '1w', '1m', '3m', '6m', '1y'
    currentPrice: (0, pg_core_1.decimal)("current_price", { precision: 15, scale: 2 }),
    predictedPrice: (0, pg_core_1.decimal)("predicted_price", { precision: 15, scale: 2 }),
    predictedChange: (0, pg_core_1.decimal)("predicted_change", { precision: 8, scale: 4 }), // Percentage change
    confidence: (0, pg_core_1.decimal)("confidence", { precision: 5, scale: 4 }), // 0-1 confidence score
    reasoning: (0, pg_core_1.text)("reasoning"), // AI-generated reasoning
    marketFactors: (0, pg_core_1.jsonb)("market_factors"), // Array of factors influencing prediction
    riskLevel: (0, pg_core_1.text)("risk_level"), // 'LOW', 'MEDIUM', 'HIGH'
    aiModel: (0, pg_core_1.text)("ai_model").default("gpt-4o-mini"), // Model used for prediction
    houseBonus: (0, pg_core_1.jsonb)("house_bonus"), // House-specific bonuses and influences
    karmaInfluence: (0, pg_core_1.decimal)("karma_influence", { precision: 5, scale: 4 }), // Karma alignment impact
    actualOutcome: (0, pg_core_1.decimal)("actual_outcome", { precision: 8, scale: 4 }), // Actual result for accuracy tracking
    accuracy: (0, pg_core_1.decimal)("accuracy", { precision: 5, scale: 4 }), // Prediction accuracy score
    isActive: (0, pg_core_1.boolean)("is_active").default(true), // Whether prediction is still valid
    expiresAt: (0, pg_core_1.timestamp)("expires_at"), // When prediction expires
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Character Battle Scenarios - Store battle matchups and outcome predictions
exports.characterBattleScenarios = (0, pg_core_1.pgTable)("character_battle_scenarios", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    character1Id: (0, pg_core_1.varchar)("character1_id").notNull().references(() => exports.assets.id),
    character2Id: (0, pg_core_1.varchar)("character2_id").notNull().references(() => exports.assets.id),
    battleType: (0, pg_core_1.text)("battle_type").notNull(), // 'power_clash', 'strategy_battle', 'moral_conflict', 'crossover_event'
    battleContext: (0, pg_core_1.text)("battle_context"), // Description of battle circumstances
    powerLevelData: (0, pg_core_1.jsonb)("power_level_data"), // Power stats and abilities
    winProbability: (0, pg_core_1.decimal)("win_probability", { precision: 5, scale: 4 }), // Character 1 win probability
    battleFactors: (0, pg_core_1.jsonb)("battle_factors"), // Factors influencing outcome
    historicalData: (0, pg_core_1.jsonb)("historical_data"), // Past battle results and comic references
    houseAdvantages: (0, pg_core_1.jsonb)("house_advantages"), // House-specific battle bonuses
    predictedOutcome: (0, pg_core_1.text)("predicted_outcome"), // Detailed battle outcome prediction
    marketImpact: (0, pg_core_1.decimal)("market_impact", { precision: 8, scale: 4 }), // Expected price impact
    confidence: (0, pg_core_1.decimal)("confidence", { precision: 5, scale: 4 }), // AI confidence in prediction
    actualResult: (0, pg_core_1.text)("actual_result"), // Actual battle outcome (if resolved)
    accuracy: (0, pg_core_1.decimal)("accuracy", { precision: 5, scale: 4 }), // Prediction accuracy
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    resolvedAt: (0, pg_core_1.timestamp)("resolved_at"), // When battle was resolved
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Market Intelligence Cache - Store processed AI insights and analysis
exports.marketIntelligenceCache = (0, pg_core_1.pgTable)("market_intelligence_cache", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    cacheKey: (0, pg_core_1.text)("cache_key").notNull().unique(), // Unique identifier for cached data
    dataType: (0, pg_core_1.text)("data_type").notNull(), // 'trend_analysis', 'correlation_matrix', 'sentiment_report', 'anomaly_detection'
    scope: (0, pg_core_1.text)("scope").notNull(), // 'global', 'house_specific', 'user_specific', 'asset_specific'
    targetId: (0, pg_core_1.varchar)("target_id"), // Asset ID, House ID, or User ID depending on scope
    analysisData: (0, pg_core_1.jsonb)("analysis_data"), // Cached analysis results
    insights: (0, pg_core_1.jsonb)("insights"), // Key insights and recommendations
    confidence: (0, pg_core_1.decimal)("confidence", { precision: 5, scale: 4 }), // Overall confidence in analysis
    processingTime: (0, pg_core_1.integer)("processing_time"), // Time taken to generate (milliseconds)
    dataFreshness: (0, pg_core_1.timestamp)("data_freshness"), // When source data was last updated
    accessCount: (0, pg_core_1.integer)("access_count").default(0), // Number of times accessed
    lastAccessed: (0, pg_core_1.timestamp)("last_accessed"), // Last access time for cache management
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(), // Cache expiration time
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// User AI Interaction History - Track user interactions with AI Oracle
exports.userAiInteractions = (0, pg_core_1.pgTable)("user_ai_interactions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    interactionType: (0, pg_core_1.text)("interaction_type").notNull(), // 'prediction_request', 'market_insight', 'battle_forecast', 'portfolio_analysis'
    inputData: (0, pg_core_1.jsonb)("input_data"), // User input or request parameters
    aiResponse: (0, pg_core_1.jsonb)("ai_response"), // AI-generated response
    mysticalPresentation: (0, pg_core_1.text)("mystical_presentation"), // Mystical/oracle-themed presentation
    userHouse: (0, pg_core_1.text)("user_house"), // User's house at time of interaction
    karmaAlignment: (0, pg_core_1.jsonb)("karma_alignment"), // User's karma alignment at time of interaction
    confidence: (0, pg_core_1.decimal)("confidence", { precision: 5, scale: 4 }), // AI confidence in response
    userRating: (0, pg_core_1.integer)("user_rating"), // User rating of AI response (1-5)
    followedAdvice: (0, pg_core_1.boolean)("followed_advice"), // Whether user acted on AI advice
    outcomeTracking: (0, pg_core_1.jsonb)("outcome_tracking"), // Track results of AI recommendations
    sessionId: (0, pg_core_1.varchar)("session_id"), // Group related interactions
    processingTime: (0, pg_core_1.integer)("processing_time"), // Response generation time
    tokens: (0, pg_core_1.integer)("tokens"), // AI tokens used
    cost: (0, pg_core_1.decimal)("cost", { precision: 8, scale: 6 }), // API cost (if applicable)
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// AI Oracle Persona Configurations - Manage Oracle personality and responses
exports.aiOraclePersonas = (0, pg_core_1.pgTable)("ai_oracle_personas", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    personaName: (0, pg_core_1.text)("persona_name").notNull(), // 'Ancient Sage', 'Battle Prophet', 'Market Mystic'
    description: (0, pg_core_1.text)("description"), // Persona description and specialization
    houseAffinity: (0, pg_core_1.text)("house_affinity"), // Primary house affinity
    personalityTraits: (0, pg_core_1.jsonb)("personality_traits"), // Personality characteristics
    responseStyle: (0, pg_core_1.jsonb)("response_style"), // Communication style and tone
    expertise: (0, pg_core_1.jsonb)("expertise"), // Areas of specialization
    mysticalLanguage: (0, pg_core_1.jsonb)("mystical_language"), // Language patterns and phrases
    divineSymbols: (0, pg_core_1.jsonb)("divine_symbols"), // Associated symbols and imagery
    powerLevel: (0, pg_core_1.integer)("power_level").default(1), // Oracle power level
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    usageCount: (0, pg_core_1.integer)("usage_count").default(0), // Times this persona was used
    avgUserRating: (0, pg_core_1.decimal)("avg_user_rating", { precision: 3, scale: 2 }), // Average user rating
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Market Anomaly Detection - Store detected unusual market patterns
exports.marketAnomalies = (0, pg_core_1.pgTable)("market_anomalies", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    assetId: (0, pg_core_1.varchar)("asset_id").references(() => exports.assets.id),
    anomalyType: (0, pg_core_1.text)("anomaly_type").notNull(), // 'price_spike', 'volume_surge', 'sentiment_shift', 'pattern_break'
    severity: (0, pg_core_1.text)("severity").notNull(), // 'low', 'medium', 'high', 'critical'
    description: (0, pg_core_1.text)("description"), // Human-readable description
    detectionData: (0, pg_core_1.jsonb)("detection_data"), // Technical data about the anomaly
    historicalComparison: (0, pg_core_1.jsonb)("historical_comparison"), // Comparison with historical patterns
    potentialCauses: (0, pg_core_1.jsonb)("potential_causes"), // Possible reasons for anomaly
    marketImpact: (0, pg_core_1.decimal)("market_impact", { precision: 8, scale: 4 }), // Estimated market impact
    aiConfidence: (0, pg_core_1.decimal)("ai_confidence", { precision: 5, scale: 4 }), // AI confidence in detection
    userNotifications: (0, pg_core_1.integer)("user_notifications").default(0), // Number of users notified
    followUpActions: (0, pg_core_1.jsonb)("follow_up_actions"), // Recommended actions
    resolved: (0, pg_core_1.boolean)("resolved").default(false), // Whether anomaly has been resolved
    resolvedAt: (0, pg_core_1.timestamp)("resolved_at"), // When anomaly was resolved
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// ===========================
// AI MARKET INTELLIGENCE SCHEMAS AND TYPES
// ===========================
// Create insert schemas for AI Market Intelligence tables
exports.insertAiMarketPredictionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.aiMarketPredictions).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertCharacterBattleScenarioSchema = (0, drizzle_zod_1.createInsertSchema)(exports.characterBattleScenarios).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertMarketIntelligenceCacheSchema = (0, drizzle_zod_1.createInsertSchema)(exports.marketIntelligenceCache).omit({
    id: true,
    accessCount: true,
    lastAccessed: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertUserAiInteractionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userAiInteractions).omit({
    id: true,
    createdAt: true,
});
exports.insertAiOraclePersonaSchema = (0, drizzle_zod_1.createInsertSchema)(exports.aiOraclePersonas).omit({
    id: true,
    usageCount: true,
    avgUserRating: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertMarketAnomalySchema = (0, drizzle_zod_1.createInsertSchema)(exports.marketAnomalies).omit({
    id: true,
    userNotifications: true,
    resolved: true,
    resolvedAt: true,
    createdAt: true,
    updatedAt: true,
});
// =============================================
// PHASE 8: EXTERNAL TOOL INTEGRATION TABLES
// =============================================
// External tool integrations (Webflow, Figma, Relume, Zapier)
exports.externalIntegrations = (0, pg_core_1.pgTable)("external_integrations", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    integrationName: (0, pg_core_1.text)("integration_name").notNull(), // 'webflow', 'figma', 'relume', 'zapier'
    integrationDisplayName: (0, pg_core_1.text)("integration_display_name").notNull(), // "Webflow", "Figma", etc.
    status: (0, pg_core_1.text)("status").notNull().default("disconnected"), // 'connected', 'disconnected', 'error', 'pending'
    authType: (0, pg_core_1.text)("auth_type").notNull(), // 'oauth', 'api_key', 'webhook'
    // Encrypted credential storage (never store plaintext API keys)
    encryptedCredentials: (0, pg_core_1.text)("encrypted_credentials"), // Encrypted JSON of auth tokens/keys
    authScopes: (0, pg_core_1.jsonb)("auth_scopes"), // OAuth scopes or permission levels
    connectionMetadata: (0, pg_core_1.jsonb)("connection_metadata"), // Additional connection info (account IDs, team info, etc.)
    configuration: (0, pg_core_1.jsonb)("configuration"), // Integration-specific settings
    // Integration health and monitoring
    lastHealthCheck: (0, pg_core_1.timestamp)("last_health_check"),
    healthStatus: (0, pg_core_1.text)("health_status").default("unknown"), // 'healthy', 'unhealthy', 'degraded', 'unknown'
    errorMessage: (0, pg_core_1.text)("error_message"), // Last error encountered
    retryCount: (0, pg_core_1.integer)("retry_count").default(0),
    // Usage tracking
    totalSyncs: (0, pg_core_1.integer)("total_syncs").default(0),
    lastSyncAt: (0, pg_core_1.timestamp)("last_sync_at"),
    nextScheduledSync: (0, pg_core_1.timestamp)("next_scheduled_sync"),
    // House-specific bonuses and preferences
    houseId: (0, pg_core_1.text)("house_id").references(() => exports.users.houseId), // Inherit from user or override
    houseBonusMultiplier: (0, pg_core_1.decimal)("house_bonus_multiplier", { precision: 3, scale: 2 }).default("1.00"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_external_integrations_user").on(table.userId),
    (0, pg_core_1.index)("idx_external_integrations_name").on(table.integrationName),
    (0, pg_core_1.index)("idx_external_integrations_status").on(table.status),
    (0, pg_core_1.index)("idx_external_integrations_health").on(table.healthStatus),
]);
// Webhook management for bidirectional communication
exports.integrationWebhooks = (0, pg_core_1.pgTable)("integration_webhooks", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    integrationId: (0, pg_core_1.varchar)("integration_id").notNull().references(() => exports.externalIntegrations.id),
    webhookType: (0, pg_core_1.text)("webhook_type").notNull(), // 'incoming', 'outgoing'
    eventType: (0, pg_core_1.text)("event_type").notNull(), // 'user.created', 'trade.executed', 'portfolio.updated', etc.
    webhookUrl: (0, pg_core_1.text)("webhook_url"), // For outgoing webhooks
    secretKey: (0, pg_core_1.text)("secret_key"), // For webhook verification
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    // Webhook configuration
    httpMethod: (0, pg_core_1.text)("http_method").default("POST"), // POST, PUT, PATCH
    headers: (0, pg_core_1.jsonb)("headers"), // Custom headers to send
    payload: (0, pg_core_1.jsonb)("payload"), // Payload template or structure
    retryPolicy: (0, pg_core_1.jsonb)("retry_policy"), // Retry configuration
    // Monitoring and analytics
    totalTriggers: (0, pg_core_1.integer)("total_triggers").default(0),
    successfulTriggers: (0, pg_core_1.integer)("successful_triggers").default(0),
    failedTriggers: (0, pg_core_1.integer)("failed_triggers").default(0),
    lastTriggeredAt: (0, pg_core_1.timestamp)("last_triggered_at"),
    lastSuccessAt: (0, pg_core_1.timestamp)("last_success_at"),
    lastFailureAt: (0, pg_core_1.timestamp)("last_failure_at"),
    lastErrorMessage: (0, pg_core_1.text)("last_error_message"),
    averageResponseTime: (0, pg_core_1.decimal)("average_response_time", { precision: 8, scale: 3 }), // milliseconds
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_integration_webhooks_integration").on(table.integrationId),
    (0, pg_core_1.index)("idx_integration_webhooks_type").on(table.webhookType),
    (0, pg_core_1.index)("idx_integration_webhooks_event").on(table.eventType),
    (0, pg_core_1.index)("idx_integration_webhooks_active").on(table.isActive),
]);
// Integration synchronization logs
exports.integrationSyncLogs = (0, pg_core_1.pgTable)("integration_sync_logs", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    integrationId: (0, pg_core_1.varchar)("integration_id").notNull().references(() => exports.externalIntegrations.id),
    syncType: (0, pg_core_1.text)("sync_type").notNull(), // 'full', 'incremental', 'manual', 'webhook'
    direction: (0, pg_core_1.text)("direction").notNull(), // 'import', 'export', 'bidirectional'
    status: (0, pg_core_1.text)("status").notNull(), // 'started', 'in_progress', 'completed', 'failed', 'cancelled'
    dataType: (0, pg_core_1.text)("data_type"), // 'portfolios', 'designs', 'workflows', 'analytics'
    // Sync metrics
    recordsProcessed: (0, pg_core_1.integer)("records_processed").default(0),
    recordsSuccessful: (0, pg_core_1.integer)("records_successful").default(0),
    recordsFailed: (0, pg_core_1.integer)("records_failed").default(0),
    durationMs: (0, pg_core_1.integer)("duration_ms"), // Sync duration in milliseconds
    // Sync details
    startedAt: (0, pg_core_1.timestamp)("started_at"),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    errorMessage: (0, pg_core_1.text)("error_message"),
    errorDetails: (0, pg_core_1.jsonb)("error_details"), // Detailed error information
    syncMetadata: (0, pg_core_1.jsonb)("sync_metadata"), // Additional sync context
    // Data transformation tracking
    transformationRules: (0, pg_core_1.jsonb)("transformation_rules"), // Rules applied during sync
    validationErrors: (0, pg_core_1.jsonb)("validation_errors"), // Data validation issues
    conflictResolution: (0, pg_core_1.jsonb)("conflict_resolution"), // How conflicts were resolved
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_integration_sync_logs_integration").on(table.integrationId),
    (0, pg_core_1.index)("idx_integration_sync_logs_status").on(table.status),
    (0, pg_core_1.index)("idx_integration_sync_logs_type").on(table.syncType),
    (0, pg_core_1.index)("idx_integration_sync_logs_started").on(table.startedAt),
]);
// Workflow automation configurations (Sacred Rituals and Divine Protocols)
exports.workflowAutomations = (0, pg_core_1.pgTable)("workflow_automations", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    name: (0, pg_core_1.text)("name").notNull(), // User-friendly workflow name
    description: (0, pg_core_1.text)("description"),
    category: (0, pg_core_1.text)("category").notNull(), // 'trading', 'portfolio', 'marketing', 'analytics', 'house_ritual'
    // Workflow configuration
    triggerType: (0, pg_core_1.text)("trigger_type").notNull(), // 'schedule', 'event', 'webhook', 'manual'
    triggerConfig: (0, pg_core_1.jsonb)("trigger_config").notNull(), // Trigger-specific configuration
    actionSteps: (0, pg_core_1.jsonb)("action_steps").notNull(), // Array of automation steps
    conditions: (0, pg_core_1.jsonb)("conditions"), // Conditional logic for execution
    // Mystical RPG elements
    ritualType: (0, pg_core_1.text)("ritual_type"), // 'sacred_ritual', 'divine_protocol', 'karmic_alignment'
    houseBonus: (0, pg_core_1.decimal)("house_bonus", { precision: 3, scale: 2 }).default("1.00"),
    karmaRequirement: (0, pg_core_1.integer)("karma_requirement").default(0),
    mysticalPower: (0, pg_core_1.integer)("mystical_power").default(1), // 1-10 scale
    // Status and execution
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    status: (0, pg_core_1.text)("status").default("active"), // 'active', 'paused', 'disabled', 'error'
    // Execution tracking
    totalRuns: (0, pg_core_1.integer)("total_runs").default(0),
    successfulRuns: (0, pg_core_1.integer)("successful_runs").default(0),
    failedRuns: (0, pg_core_1.integer)("failed_runs").default(0),
    lastRunAt: (0, pg_core_1.timestamp)("last_run_at"),
    lastSuccessAt: (0, pg_core_1.timestamp)("last_success_at"),
    lastFailureAt: (0, pg_core_1.timestamp)("last_failure_at"),
    nextRunAt: (0, pg_core_1.timestamp)("next_run_at"),
    lastErrorMessage: (0, pg_core_1.text)("last_error_message"),
    averageExecutionTime: (0, pg_core_1.decimal)("average_execution_time", { precision: 8, scale: 3 }), // milliseconds
    // Advanced features
    priority: (0, pg_core_1.integer)("priority").default(5), // 1-10 execution priority
    timeout: (0, pg_core_1.integer)("timeout").default(300000), // Timeout in milliseconds
    retryPolicy: (0, pg_core_1.jsonb)("retry_policy"), // Retry configuration
    notificationSettings: (0, pg_core_1.jsonb)("notification_settings"), // How to notify on success/failure
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_workflow_automations_user").on(table.userId),
    (0, pg_core_1.index)("idx_workflow_automations_category").on(table.category),
    (0, pg_core_1.index)("idx_workflow_automations_trigger").on(table.triggerType),
    (0, pg_core_1.index)("idx_workflow_automations_active").on(table.isActive),
    (0, pg_core_1.index)("idx_workflow_automations_next_run").on(table.nextRunAt),
]);
// Workflow execution history
exports.workflowExecutions = (0, pg_core_1.pgTable)("workflow_executions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    workflowId: (0, pg_core_1.varchar)("workflow_id").notNull().references(() => exports.workflowAutomations.id),
    executionId: (0, pg_core_1.varchar)("execution_id").notNull(), // Unique ID for this execution
    status: (0, pg_core_1.text)("status").notNull(), // 'started', 'running', 'completed', 'failed', 'timeout', 'cancelled'
    triggerSource: (0, pg_core_1.text)("trigger_source"), // What triggered this execution
    triggerData: (0, pg_core_1.jsonb)("trigger_data"), // Data from the trigger
    // Execution details
    startedAt: (0, pg_core_1.timestamp)("started_at").notNull(),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    durationMs: (0, pg_core_1.integer)("duration_ms"),
    // Step tracking
    totalSteps: (0, pg_core_1.integer)("total_steps"),
    completedSteps: (0, pg_core_1.integer)("completed_steps"),
    failedSteps: (0, pg_core_1.integer)("failed_steps"),
    currentStep: (0, pg_core_1.integer)("current_step"),
    stepExecutions: (0, pg_core_1.jsonb)("step_executions"), // Detailed step execution log
    // Results and outputs
    outputData: (0, pg_core_1.jsonb)("output_data"), // Results produced by the workflow
    errorMessage: (0, pg_core_1.text)("error_message"),
    errorDetails: (0, pg_core_1.jsonb)("error_details"),
    // Mystical elements
    karmaEarned: (0, pg_core_1.integer)("karma_earned").default(0),
    mysticalEffects: (0, pg_core_1.jsonb)("mystical_effects"), // Special effects or bonuses
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_workflow_executions_workflow").on(table.workflowId),
    (0, pg_core_1.index)("idx_workflow_executions_status").on(table.status),
    (0, pg_core_1.index)("idx_workflow_executions_started").on(table.startedAt),
    (0, pg_core_1.index)("idx_workflow_executions_execution_id").on(table.executionId),
]);
// Integration usage analytics and performance monitoring
exports.integrationAnalytics = (0, pg_core_1.pgTable)("integration_analytics", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    integrationId: (0, pg_core_1.varchar)("integration_id").notNull().references(() => exports.externalIntegrations.id),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    analyticsDate: (0, pg_core_1.timestamp)("analytics_date").notNull(), // Date for daily/hourly aggregations
    timeframe: (0, pg_core_1.text)("timeframe").notNull(), // 'hourly', 'daily', 'weekly', 'monthly'
    // Usage metrics
    apiCalls: (0, pg_core_1.integer)("api_calls").default(0),
    successfulCalls: (0, pg_core_1.integer)("successful_calls").default(0),
    failedCalls: (0, pg_core_1.integer)("failed_calls").default(0),
    dataTransferred: (0, pg_core_1.integer)("data_transferred").default(0), // bytes
    // Performance metrics
    averageResponseTime: (0, pg_core_1.decimal)("average_response_time", { precision: 8, scale: 3 }), // milliseconds
    minResponseTime: (0, pg_core_1.decimal)("min_response_time", { precision: 8, scale: 3 }),
    maxResponseTime: (0, pg_core_1.decimal)("max_response_time", { precision: 8, scale: 3 }),
    // Error tracking
    errorCategories: (0, pg_core_1.jsonb)("error_categories"), // Categorized error counts
    rateLimitHits: (0, pg_core_1.integer)("rate_limit_hits").default(0),
    timeoutCount: (0, pg_core_1.integer)("timeout_count").default(0),
    // Business metrics
    automationsTriggered: (0, pg_core_1.integer)("automations_triggered").default(0),
    workflowsCompleted: (0, pg_core_1.integer)("workflows_completed").default(0),
    dataPointsSynced: (0, pg_core_1.integer)("data_points_synced").default(0),
    // Cost tracking
    estimatedCost: (0, pg_core_1.decimal)("estimated_cost", { precision: 10, scale: 4 }), // External API costs
    creditsUsed: (0, pg_core_1.integer)("credits_used").default(0), // Internal credits consumed
    // House performance
    houseId: (0, pg_core_1.text)("house_id"),
    houseBonusApplied: (0, pg_core_1.decimal)("house_bonus_applied", { precision: 3, scale: 2 }),
    karmaGenerated: (0, pg_core_1.integer)("karma_generated").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_integration_analytics_integration").on(table.integrationId),
    (0, pg_core_1.index)("idx_integration_analytics_user").on(table.userId),
    (0, pg_core_1.index)("idx_integration_analytics_date").on(table.analyticsDate),
    (0, pg_core_1.index)("idx_integration_analytics_timeframe").on(table.timeframe),
]);
// External tool user mappings (for cross-platform identity management)
exports.externalUserMappings = (0, pg_core_1.pgTable)("external_user_mappings", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    integrationId: (0, pg_core_1.varchar)("integration_id").notNull().references(() => exports.externalIntegrations.id),
    externalUserId: (0, pg_core_1.text)("external_user_id").notNull(), // User ID in external system
    externalUserName: (0, pg_core_1.text)("external_user_name"), // Username in external system
    externalUserEmail: (0, pg_core_1.text)("external_user_email"), // Email in external system
    permissions: (0, pg_core_1.jsonb)("permissions"), // What Panel Profits data can be shared
    dataMapping: (0, pg_core_1.jsonb)("data_mapping"), // How Panel Profits data maps to external system
    syncPreferences: (0, pg_core_1.jsonb)("sync_preferences"), // User preferences for data synchronization
    lastSyncAt: (0, pg_core_1.timestamp)("last_sync_at"),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_external_user_mappings_user").on(table.userId),
    (0, pg_core_1.index)("idx_external_user_mappings_integration").on(table.integrationId),
    (0, pg_core_1.index)("idx_external_user_mappings_external_id").on(table.externalUserId),
]);
// =============================================
// PHASE 8 ZOD VALIDATION SCHEMAS
// =============================================
exports.insertExternalIntegrationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.externalIntegrations).omit({
    id: true,
    totalSyncs: true,
    lastSyncAt: true,
    lastHealthCheck: true,
    retryCount: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertIntegrationWebhookSchema = (0, drizzle_zod_1.createInsertSchema)(exports.integrationWebhooks).omit({
    id: true,
    totalTriggers: true,
    successfulTriggers: true,
    failedTriggers: true,
    lastTriggeredAt: true,
    lastSuccessAt: true,
    lastFailureAt: true,
    averageResponseTime: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertIntegrationSyncLogSchema = (0, drizzle_zod_1.createInsertSchema)(exports.integrationSyncLogs).omit({
    id: true,
    createdAt: true,
});
exports.insertWorkflowAutomationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.workflowAutomations).omit({
    id: true,
    totalRuns: true,
    successfulRuns: true,
    failedRuns: true,
    lastRunAt: true,
    lastSuccessAt: true,
    lastFailureAt: true,
    averageExecutionTime: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertWorkflowExecutionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.workflowExecutions).omit({
    id: true,
    createdAt: true,
});
exports.insertIntegrationAnalyticsSchema = (0, drizzle_zod_1.createInsertSchema)(exports.integrationAnalytics).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertExternalUserMappingSchema = (0, drizzle_zod_1.createInsertSchema)(exports.externalUserMappings).omit({
    id: true,
    lastSyncAt: true,
    createdAt: true,
    updatedAt: true,
});
// =============================================
// PHASE 1: CORE TRADING FOUNDATION SYSTEM
// =============================================
// IMF Vaulting System - Fixed Share Supply & Scarcity Mechanism
exports.imfVaultSettings = (0, pg_core_1.pgTable)("imf_vault_settings", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    // Share Supply Control
    totalSharesIssued: (0, pg_core_1.decimal)("total_shares_issued", { precision: 15, scale: 4 }).notNull(),
    sharesInVault: (0, pg_core_1.decimal)("shares_in_vault", { precision: 15, scale: 4 }).default("0.0000"),
    sharesInCirculation: (0, pg_core_1.decimal)("shares_in_circulation", { precision: 15, scale: 4 }).notNull(),
    maxSharesAllowed: (0, pg_core_1.decimal)("max_shares_allowed", { precision: 15, scale: 4 }).notNull(),
    shareCreationCutoffDate: (0, pg_core_1.timestamp)("share_creation_cutoff_date").notNull(),
    // Vaulting Conditions
    vaultingThreshold: (0, pg_core_1.decimal)("vaulting_threshold", { precision: 8, scale: 2 }).default("90.00"), // % market cap required to trigger vaulting
    minHoldingPeriod: (0, pg_core_1.integer)("min_holding_period_days").default(30), // Minimum days to hold before vaulting
    vaultingFee: (0, pg_core_1.decimal)("vaulting_fee", { precision: 8, scale: 4 }).default("0.0025"), // 0.25% fee for vaulting
    // Scarcity Mechanics
    scarcityMultiplier: (0, pg_core_1.decimal)("scarcity_multiplier", { precision: 8, scale: 4 }).default("1.0000"),
    lastScarcityUpdate: (0, pg_core_1.timestamp)("last_scarcity_update").defaultNow(),
    demandPressure: (0, pg_core_1.decimal)("demand_pressure", { precision: 8, scale: 2 }).default("0.00"), // Buying pressure indicator
    supplyConstraint: (0, pg_core_1.decimal)("supply_constraint", { precision: 8, scale: 2 }).default("0.00"), // Supply limitation factor
    // Vault Status
    isVaultingActive: (0, pg_core_1.boolean)("is_vaulting_active").default(true),
    vaultStatus: (0, pg_core_1.text)("vault_status").default("active"), // 'active', 'locked', 'emergency_release'
    nextVaultingEvaluation: (0, pg_core_1.timestamp)("next_vaulting_evaluation"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Seven House Trading Firms System
exports.tradingFirms = (0, pg_core_1.pgTable)("trading_firms", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    houseId: (0, pg_core_1.text)("house_id").notNull(), // Maps to mythological houses
    firmName: (0, pg_core_1.text)("firm_name").notNull(),
    firmCode: (0, pg_core_1.text)("firm_code").notNull().unique(), // 'HELLENIC', 'GM_FIN', 'ASHOKA', etc.
    // Leadership
    ceoName: (0, pg_core_1.text)("ceo_name").notNull(),
    ceoMythologyRef: (0, pg_core_1.text)("ceo_mythology_ref"), // Zeus, Bacchus, etc.
    advisors: (0, pg_core_1.jsonb)("advisors"), // Array of advisor names and mythological references
    // Trading Specializations
    primarySpecialties: (0, pg_core_1.text)("primary_specialties").array(), // ['options', 'bonds', 'blue_chip', etc.]
    weaknesses: (0, pg_core_1.text)("weaknesses").array(), // ['crypto', 'tech_options', etc.]
    specialtyBonuses: (0, pg_core_1.jsonb)("specialty_bonuses"), // Percentage bonuses for specialties
    weaknessPenalties: (0, pg_core_1.jsonb)("weakness_penalties"), // Percentage penalties for weaknesses
    // Firm Characteristics
    tradingStyle: (0, pg_core_1.text)("trading_style").notNull(), // 'aggressive', 'conservative', 'systematic', 'opportunistic'
    riskTolerance: (0, pg_core_1.text)("risk_tolerance").notNull(), // 'low', 'medium', 'high', 'extreme'
    marketCapacityUSD: (0, pg_core_1.decimal)("market_capacity_usd", { precision: 15, scale: 2 }).notNull(),
    minimumTradeSize: (0, pg_core_1.decimal)("minimum_trade_size", { precision: 10, scale: 2 }).default("1000.00"),
    // Performance Metrics
    totalAssetsUnderManagement: (0, pg_core_1.decimal)("total_aum", { precision: 15, scale: 2 }).default("0.00"),
    ytdReturn: (0, pg_core_1.decimal)("ytd_return", { precision: 8, scale: 2 }).default("0.00"),
    sharpeRatio: (0, pg_core_1.decimal)("sharpe_ratio", { precision: 8, scale: 4 }),
    maxDrawdown: (0, pg_core_1.decimal)("max_drawdown", { precision: 8, scale: 2 }),
    winRate: (0, pg_core_1.decimal)("win_rate", { precision: 8, scale: 2 }),
    avgTradeSize: (0, pg_core_1.decimal)("avg_trade_size", { precision: 10, scale: 2 }),
    // Operational Status
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    marketHours: (0, pg_core_1.jsonb)("market_hours"), // Operating hours by timezone
    communicationChannels: (0, pg_core_1.jsonb)("communication_channels"), // How they announce trades/strategies
    reputation: (0, pg_core_1.decimal)("reputation", { precision: 8, scale: 2 }).default("50.00"), // 0-100 reputation score
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Comic-to-Financial Asset Mapping
exports.assetFinancialMapping = (0, pg_core_1.pgTable)("asset_financial_mapping", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    // Financial Instrument Classification
    instrumentType: (0, pg_core_1.text)("instrument_type").notNull(), // 'common_stock', 'preferred_stock', 'bond', 'etf', 'option', 'warrant'
    instrumentSubtype: (0, pg_core_1.text)("instrument_subtype"), // 'corporate_bond', 'government_bond', 'equity_option', etc.
    underlyingAssetId: (0, pg_core_1.varchar)("underlying_asset_id").references(() => exports.assets.id), // For derivatives
    // Stock-like Properties (for characters, creators)
    shareClass: (0, pg_core_1.text)("share_class").default("A"), // 'A', 'B', 'C' for different voting rights
    votingRights: (0, pg_core_1.boolean)("voting_rights").default(true),
    dividendEligible: (0, pg_core_1.boolean)("dividend_eligible").default(false),
    dividendYield: (0, pg_core_1.decimal)("dividend_yield", { precision: 8, scale: 4 }),
    // Bond-like Properties (for publishers, institutional assets)
    creditRating: (0, pg_core_1.text)("credit_rating"), // 'AAA', 'AA+', 'A', 'BBB', etc.
    maturityDate: (0, pg_core_1.timestamp)("maturity_date"),
    couponRate: (0, pg_core_1.decimal)("coupon_rate", { precision: 8, scale: 4 }),
    faceValue: (0, pg_core_1.decimal)("face_value", { precision: 10, scale: 2 }),
    // ETF/Fund Properties (for themed collections)
    fundComponents: (0, pg_core_1.text)("fund_components").array(), // Asset IDs that comprise the fund
    expenseRatio: (0, pg_core_1.decimal)("expense_ratio", { precision: 8, scale: 4 }),
    trackingIndex: (0, pg_core_1.text)("tracking_index"), // What index or theme this tracks
    rebalanceFrequency: (0, pg_core_1.text)("rebalance_frequency"), // 'daily', 'weekly', 'monthly', 'quarterly'
    // Market Mechanics
    lotSize: (0, pg_core_1.integer)("lot_size").default(1), // Minimum trading unit
    tickSize: (0, pg_core_1.decimal)("tick_size", { precision: 8, scale: 4 }).default("0.0100"), // Minimum price movement
    marginRequirement: (0, pg_core_1.decimal)("margin_requirement", { precision: 8, scale: 2 }).default("50.00"), // % margin required
    shortSellAllowed: (0, pg_core_1.boolean)("short_sell_allowed").default(true),
    // Corporate Actions
    lastSplitDate: (0, pg_core_1.timestamp)("last_split_date"),
    splitRatio: (0, pg_core_1.text)("split_ratio"), // '2:1', '3:2', etc.
    lastDividendDate: (0, pg_core_1.timestamp)("last_dividend_date"),
    exDividendDate: (0, pg_core_1.timestamp)("ex_dividend_date"),
    // Regulatory Classification
    securityType: (0, pg_core_1.text)("security_type").notNull(), // 'equity', 'debt', 'derivative', 'fund'
    exchangeListing: (0, pg_core_1.text)("exchange_listing").default("PPX"), // Panel Profits Exchange
    cusip: (0, pg_core_1.text)("cusip"), // Committee on Uniform Securities Identification Procedures
    isin: (0, pg_core_1.text)("isin"), // International Securities Identification Number
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Global Market Hours System
exports.globalMarketHours = (0, pg_core_1.pgTable)("global_market_hours", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    marketCode: (0, pg_core_1.text)("market_code").notNull().unique(), // 'NYC', 'LON', 'SYD', 'HKG', 'BOM'
    marketName: (0, pg_core_1.text)("market_name").notNull(),
    timezone: (0, pg_core_1.text)("timezone").notNull(), // 'America/New_York', 'Europe/London', etc.
    // Trading Hours (in market local time)
    regularOpenTime: (0, pg_core_1.text)("regular_open_time").notNull(), // '09:30'
    regularCloseTime: (0, pg_core_1.text)("regular_close_time").notNull(), // '16:00'
    preMarketOpenTime: (0, pg_core_1.text)("pre_market_open_time"), // '04:00'
    afterHoursCloseTime: (0, pg_core_1.text)("after_hours_close_time"), // '20:00'
    // Market Status
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    currentStatus: (0, pg_core_1.text)("current_status").default("closed"), // 'open', 'closed', 'pre_market', 'after_hours'
    lastStatusUpdate: (0, pg_core_1.timestamp)("last_status_update").defaultNow(),
    // Holiday Schedule
    holidaySchedule: (0, pg_core_1.jsonb)("holiday_schedule"), // Array of holiday dates
    earlyCloseSchedule: (0, pg_core_1.jsonb)("early_close_schedule"), // Special early close dates
    // Cross-Market Trading
    enablesCrossTrading: (0, pg_core_1.boolean)("enables_cross_trading").default(true),
    crossTradingFee: (0, pg_core_1.decimal)("cross_trading_fee", { precision: 8, scale: 4 }).default("0.0010"),
    // Volume and Activity
    dailyVolumeTarget: (0, pg_core_1.decimal)("daily_volume_target", { precision: 15, scale: 2 }),
    currentDayVolume: (0, pg_core_1.decimal)("current_day_volume", { precision: 15, scale: 2 }).default("0.00"),
    avgDailyVolume: (0, pg_core_1.decimal)("avg_daily_volume", { precision: 15, scale: 2 }),
    // Market Influence
    influenceWeight: (0, pg_core_1.decimal)("influence_weight", { precision: 8, scale: 4 }).default("1.0000"), // How much this market affects global prices
    leadMarket: (0, pg_core_1.boolean)("lead_market").default(false), // True for NYC (primary market)
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Options Chain System
exports.optionsChain = (0, pg_core_1.pgTable)("options_chain", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    underlyingAssetId: (0, pg_core_1.varchar)("underlying_asset_id").notNull().references(() => exports.assets.id),
    optionSymbol: (0, pg_core_1.text)("option_symbol").notNull().unique(), // 'BAT240315C120'
    // Contract Specifications
    contractType: (0, pg_core_1.text)("contract_type").notNull(), // 'call', 'put'
    strikePrice: (0, pg_core_1.decimal)("strike_price", { precision: 10, scale: 2 }).notNull(),
    expirationDate: (0, pg_core_1.timestamp)("expiration_date").notNull(),
    exerciseStyle: (0, pg_core_1.text)("exercise_style").default("american"), // 'american', 'european'
    contractSize: (0, pg_core_1.integer)("contract_size").default(100), // Shares per contract
    // Pricing
    bidPrice: (0, pg_core_1.decimal)("bid_price", { precision: 10, scale: 4 }),
    askPrice: (0, pg_core_1.decimal)("ask_price", { precision: 10, scale: 4 }),
    lastPrice: (0, pg_core_1.decimal)("last_price", { precision: 10, scale: 4 }),
    markPrice: (0, pg_core_1.decimal)("mark_price", { precision: 10, scale: 4 }), // Mid-market fair value
    // Greeks
    delta: (0, pg_core_1.decimal)("delta", { precision: 8, scale: 6 }), // Price sensitivity to underlying
    gamma: (0, pg_core_1.decimal)("gamma", { precision: 8, scale: 6 }), // Delta sensitivity to underlying
    theta: (0, pg_core_1.decimal)("theta", { precision: 8, scale: 6 }), // Time decay
    vega: (0, pg_core_1.decimal)("vega", { precision: 8, scale: 6 }), // Volatility sensitivity
    rho: (0, pg_core_1.decimal)("rho", { precision: 8, scale: 6 }), // Interest rate sensitivity
    // Volatility
    impliedVolatility: (0, pg_core_1.decimal)("implied_volatility", { precision: 8, scale: 4 }), // IV %
    historicalVolatility: (0, pg_core_1.decimal)("historical_volatility", { precision: 8, scale: 4 }), // HV %
    // Volume and Open Interest
    volume: (0, pg_core_1.integer)("volume").default(0),
    openInterest: (0, pg_core_1.integer)("open_interest").default(0),
    lastTradeTime: (0, pg_core_1.timestamp)("last_trade_time"),
    // Risk Metrics
    intrinsicValue: (0, pg_core_1.decimal)("intrinsic_value", { precision: 10, scale: 4 }),
    timeValue: (0, pg_core_1.decimal)("time_value", { precision: 10, scale: 4 }),
    breakEvenPrice: (0, pg_core_1.decimal)("break_even_price", { precision: 10, scale: 2 }),
    maxRisk: (0, pg_core_1.decimal)("max_risk", { precision: 10, scale: 2 }),
    maxReward: (0, pg_core_1.decimal)("max_reward", { precision: 10, scale: 2 }),
    // Status
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    lastGreeksUpdate: (0, pg_core_1.timestamp)("last_greeks_update"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Advanced Trading Mechanics
exports.marginAccounts = (0, pg_core_1.pgTable)("margin_accounts", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    portfolioId: (0, pg_core_1.varchar)("portfolio_id").notNull().references(() => exports.portfolios.id),
    // Account Balances
    marginEquity: (0, pg_core_1.decimal)("margin_equity", { precision: 15, scale: 2 }).default("0.00"),
    marginCash: (0, pg_core_1.decimal)("margin_cash", { precision: 15, scale: 2 }).default("0.00"),
    marginDebt: (0, pg_core_1.decimal)("margin_debt", { precision: 15, scale: 2 }).default("0.00"),
    // Buying Power & Limits
    buyingPower: (0, pg_core_1.decimal)("buying_power", { precision: 15, scale: 2 }).default("0.00"),
    dayTradingBuyingPower: (0, pg_core_1.decimal)("day_trading_buying_power", { precision: 15, scale: 2 }).default("0.00"),
    maintenanceMargin: (0, pg_core_1.decimal)("maintenance_margin", { precision: 15, scale: 2 }).default("0.00"),
    initialMarginReq: (0, pg_core_1.decimal)("initial_margin_req", { precision: 8, scale: 2 }).default("50.00"), // %
    maintenanceMarginReq: (0, pg_core_1.decimal)("maintenance_margin_req", { precision: 8, scale: 2 }).default("25.00"), // %
    // Leverage Settings
    maxLeverage: (0, pg_core_1.decimal)("max_leverage", { precision: 8, scale: 2 }).default("2.00"), // 2:1 leverage
    currentLeverage: (0, pg_core_1.decimal)("current_leverage", { precision: 8, scale: 2 }).default("1.00"),
    leverageUtilization: (0, pg_core_1.decimal)("leverage_utilization", { precision: 8, scale: 2 }).default("0.00"), // %
    // Risk Management
    marginCallThreshold: (0, pg_core_1.decimal)("margin_call_threshold", { precision: 8, scale: 2 }).default("30.00"), // %
    liquidationThreshold: (0, pg_core_1.decimal)("liquidation_threshold", { precision: 8, scale: 2 }).default("20.00"), // %
    lastMarginCall: (0, pg_core_1.timestamp)("last_margin_call"),
    marginCallsCount: (0, pg_core_1.integer)("margin_calls_count").default(0),
    dayTradesUsed: (0, pg_core_1.integer)("day_trades_used").default(0), // For PDT rule
    dayTradesMax: (0, pg_core_1.integer)("day_trades_max").default(3),
    // Status
    accountStatus: (0, pg_core_1.text)("account_status").default("good_standing"), // 'good_standing', 'margin_call', 'restricted'
    marginTradingEnabled: (0, pg_core_1.boolean)("margin_trading_enabled").default(false),
    shortSellingEnabled: (0, pg_core_1.boolean)("short_selling_enabled").default(false),
    optionsTradingLevel: (0, pg_core_1.integer)("options_trading_level").default(0), // 0-4 options approval levels
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Short Positions
exports.shortPositions = (0, pg_core_1.pgTable)("short_positions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    portfolioId: (0, pg_core_1.varchar)("portfolio_id").notNull().references(() => exports.portfolios.id),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    // Position Details
    sharesShorted: (0, pg_core_1.decimal)("shares_shorted", { precision: 10, scale: 4 }).notNull(),
    shortPrice: (0, pg_core_1.decimal)("short_price", { precision: 10, scale: 2 }).notNull(),
    currentPrice: (0, pg_core_1.decimal)("current_price", { precision: 10, scale: 2 }),
    // P&L
    unrealizedPnL: (0, pg_core_1.decimal)("unrealized_pnl", { precision: 15, scale: 2 }),
    realizedPnL: (0, pg_core_1.decimal)("realized_pnl", { precision: 15, scale: 2 }).default("0.00"),
    // Borrowing Costs
    borrowRate: (0, pg_core_1.decimal)("borrow_rate", { precision: 8, scale: 4 }), // Daily borrow rate %
    borrowFeeAccrued: (0, pg_core_1.decimal)("borrow_fee_accrued", { precision: 10, scale: 2 }).default("0.00"),
    lastBorrowFeeCalc: (0, pg_core_1.timestamp)("last_borrow_fee_calc").defaultNow(),
    // Risk Management
    stopLossPrice: (0, pg_core_1.decimal)("stop_loss_price", { precision: 10, scale: 2 }),
    marginRequirement: (0, pg_core_1.decimal)("margin_requirement", { precision: 15, scale: 2 }),
    // Status
    positionStatus: (0, pg_core_1.text)("position_status").default("open"), // 'open', 'covering', 'closed'
    canBorrow: (0, pg_core_1.boolean)("can_borrow").default(true), // Can borrow shares for this asset
    borrowSource: (0, pg_core_1.text)("borrow_source"), // Where shares are borrowed from
    openedAt: (0, pg_core_1.timestamp)("opened_at").defaultNow(),
    closedAt: (0, pg_core_1.timestamp)("closed_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Information Tier System
exports.informationTiers = (0, pg_core_1.pgTable)("information_tiers", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    tierName: (0, pg_core_1.text)("tier_name").notNull().unique(), // 'Elite', 'Pro', 'Free'
    tierLevel: (0, pg_core_1.integer)("tier_level").notNull(), // 1=Elite, 2=Pro, 3=Free
    // Access Timing
    newsDelayMinutes: (0, pg_core_1.integer)("news_delay_minutes").default(0), // Elite=0, Pro=15, Free=30
    marketDataDelayMs: (0, pg_core_1.integer)("market_data_delay_ms").default(0), // Real-time delays
    // Information Quality
    analysisQuality: (0, pg_core_1.text)("analysis_quality").notNull(), // 'family_office', 'senior_analyst', 'junior_broker'
    insightDepth: (0, pg_core_1.text)("insight_depth").notNull(), // 'comprehensive', 'standard', 'basic'
    // Features Unlocked
    advancedCharting: (0, pg_core_1.boolean)("advanced_charting").default(false),
    realTimeAlerts: (0, pg_core_1.boolean)("real_time_alerts").default(false),
    whaleTrackingAccess: (0, pg_core_1.boolean)("whale_tracking_access").default(false),
    firmIntelligence: (0, pg_core_1.boolean)("firm_intelligence").default(false), // Trading firm activity insights
    earlyMarketEvents: (0, pg_core_1.boolean)("early_market_events").default(false),
    exclusiveResearch: (0, pg_core_1.boolean)("exclusive_research").default(false),
    // Subscription Details
    monthlyPrice: (0, pg_core_1.decimal)("monthly_price", { precision: 8, scale: 2 }),
    annualPrice: (0, pg_core_1.decimal)("annual_price", { precision: 8, scale: 2 }),
    creditsCost: (0, pg_core_1.integer)("credits_cost").default(0), // Alternative pricing in trading credits
    // Limits
    maxPriceAlerts: (0, pg_core_1.integer)("max_price_alerts").default(5),
    maxWatchlistAssets: (0, pg_core_1.integer)("max_watchlist_assets").default(20),
    maxPortfolios: (0, pg_core_1.integer)("max_portfolios").default(1),
    // Status
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    displayOrder: (0, pg_core_1.integer)("display_order").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// News Feed with Tiered Access
exports.newsArticles = (0, pg_core_1.pgTable)("news_articles", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Content
    headline: (0, pg_core_1.text)("headline").notNull(),
    summary: (0, pg_core_1.text)("summary").notNull(),
    fullContent: (0, pg_core_1.text)("full_content"),
    sourceOrganization: (0, pg_core_1.text)("source_organization").notNull(),
    authorName: (0, pg_core_1.text)("author_name"),
    // Classification
    newsCategory: (0, pg_core_1.text)("news_category").notNull(), // 'market_moving', 'earnings', 'merger', 'scandal', 'promotion'
    impactLevel: (0, pg_core_1.text)("impact_level").notNull(), // 'high', 'medium', 'low'
    affectedAssets: (0, pg_core_1.text)("affected_assets").array(), // Asset IDs that this news affects
    // Timing and Access
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    publishTime: (0, pg_core_1.timestamp)("publish_time").notNull(), // When each tier sees it
    eliteReleaseTime: (0, pg_core_1.timestamp)("elite_release_time").notNull(), // 30 min early
    proReleaseTime: (0, pg_core_1.timestamp)("pro_release_time").notNull(), // 15 min early
    freeReleaseTime: (0, pg_core_1.timestamp)("free_release_time").notNull(), // On time
    // Market Impact
    priceImpactDirection: (0, pg_core_1.text)("price_impact_direction"), // 'positive', 'negative', 'neutral'
    priceImpactMagnitude: (0, pg_core_1.decimal)("price_impact_magnitude", { precision: 8, scale: 2 }), // Expected % change
    volatilityImpact: (0, pg_core_1.decimal)("volatility_impact", { precision: 8, scale: 2 }), // Expected volatility increase %
    // Verification
    isVerified: (0, pg_core_1.boolean)("is_verified").default(true), // News ticker is always correct
    verifiedBy: (0, pg_core_1.text)("verified_by").default("panel_profits_oracle"),
    confidenceScore: (0, pg_core_1.decimal)("confidence_score", { precision: 8, scale: 2 }).default("100.00"),
    // Status
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    tags: (0, pg_core_1.text)("tags").array(), // Searchable tags
    relatedArticles: (0, pg_core_1.text)("related_articles").array(), // Related article IDs
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Video Content - YouTube and other video sources
exports.videoContent = (0, pg_core_1.pgTable)("video_content", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Video Identification
    videoId: (0, pg_core_1.text)("video_id").notNull().unique(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description"),
    // Channel Information
    channelName: (0, pg_core_1.text)("channel_name").notNull(),
    channelId: (0, pg_core_1.text)("channel_id").notNull(),
    // Publication
    publishDate: (0, pg_core_1.timestamp)("publish_date").notNull(),
    duration: (0, pg_core_1.integer)("duration"), // Duration in seconds
    // Media URLs
    thumbnailUrl: (0, pg_core_1.text)("thumbnail_url"),
    url: (0, pg_core_1.text)("url").notNull(),
    // Content Analysis
    tags: (0, pg_core_1.text)("tags").array(),
    transcript: (0, pg_core_1.text)("transcript"), // Full video transcript
    // Engagement Metrics
    viewCount: (0, pg_core_1.integer)("view_count").default(0),
    likeCount: (0, pg_core_1.integer)("like_count").default(0),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_video_content_channel").on(table.channelName),
    (0, pg_core_1.index)("idx_video_content_publish_date").on(table.publishDate),
]);
// Phase 1 Insert Schemas
exports.insertImfVaultSettingsSchema = (0, drizzle_zod_1.createInsertSchema)(exports.imfVaultSettings).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertTradingFirmSchema = (0, drizzle_zod_1.createInsertSchema)(exports.tradingFirms).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertAssetFinancialMappingSchema = (0, drizzle_zod_1.createInsertSchema)(exports.assetFinancialMapping).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertGlobalMarketHoursSchema = (0, drizzle_zod_1.createInsertSchema)(exports.globalMarketHours).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertOptionsChainSchema = (0, drizzle_zod_1.createInsertSchema)(exports.optionsChain).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertMarginAccountSchema = (0, drizzle_zod_1.createInsertSchema)(exports.marginAccounts).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertShortPositionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.shortPositions).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertInformationTierSchema = (0, drizzle_zod_1.createInsertSchema)(exports.informationTiers).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertNewsArticleSchema = (0, drizzle_zod_1.createInsertSchema)(exports.newsArticles).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertVideoContentSchema = (0, drizzle_zod_1.createInsertSchema)(exports.videoContent).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// ============================================================================
// PHASE 2: HIGH-VOLUME NARRATIVE DATASET INGESTION SYSTEM
// ============================================================================
// ============================================================================
// STAGING TABLES - CSV File Processing and Temporary Storage
// ============================================================================
// Raw Dataset Files - Track uploaded CSV files with checksums and metadata
exports.rawDatasetFiles = (0, pg_core_1.pgTable)("raw_dataset_files", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // File identification
    filename: (0, pg_core_1.text)("filename").notNull(),
    originalFilename: (0, pg_core_1.text)("original_filename").notNull(),
    fileSize: (0, pg_core_1.integer)("file_size").notNull(), // Size in bytes
    mimeType: (0, pg_core_1.text)("mime_type").notNull(),
    // File integrity
    checksum: (0, pg_core_1.text)("checksum").notNull(), // MD5 or SHA256 hash
    checksumAlgorithm: (0, pg_core_1.text)("checksum_algorithm").default("sha256"),
    // Dataset metadata
    datasetType: (0, pg_core_1.text)("dataset_type").notNull(), // 'characters', 'comics', 'battles', 'movies', 'reviews'
    source: (0, pg_core_1.text)("source").notNull(), // 'marvel_wikia', 'dc_wikia', 'imdb', 'manual_upload'
    sourceUrl: (0, pg_core_1.text)("source_url"), // Original download URL if applicable
    universe: (0, pg_core_1.text)("universe"), // 'marvel', 'dc', 'independent', 'crossover'
    // Processing status
    processingStatus: (0, pg_core_1.text)("processing_status").default("uploaded"), // 'uploaded', 'validating', 'processing', 'completed', 'failed'
    processingProgress: (0, pg_core_1.decimal)("processing_progress", { precision: 5, scale: 2 }).default("0.00"), // 0-100%
    totalRows: (0, pg_core_1.integer)("total_rows"),
    processedRows: (0, pg_core_1.integer)("processed_rows").default(0),
    failedRows: (0, pg_core_1.integer)("failed_rows").default(0),
    // File storage
    storageLocation: (0, pg_core_1.text)("storage_location").notNull(), // File path or URL
    compressionType: (0, pg_core_1.text)("compression_type"), // 'gzip', 'zip', null
    // Ingestion metadata
    uploadedBy: (0, pg_core_1.varchar)("uploaded_by").references(() => exports.users.id),
    ingestionJobId: (0, pg_core_1.varchar)("ingestion_job_id"), // References ingestion_jobs table
    csvHeaders: (0, pg_core_1.text)("csv_headers").array(), // Column names from CSV header
    sampleData: (0, pg_core_1.jsonb)("sample_data"), // First few rows for preview
    validationRules: (0, pg_core_1.jsonb)("validation_rules"), // Applied validation rules
    // Error tracking
    errorSummary: (0, pg_core_1.jsonb)("error_summary"), // Summary of validation/processing errors
    lastErrorMessage: (0, pg_core_1.text)("last_error_message"),
    retryCount: (0, pg_core_1.integer)("retry_count").default(0),
    maxRetries: (0, pg_core_1.integer)("max_retries").default(3),
    // Timestamps
    uploadedAt: (0, pg_core_1.timestamp)("uploaded_at").defaultNow(),
    processingStartedAt: (0, pg_core_1.timestamp)("processing_started_at"),
    processingCompletedAt: (0, pg_core_1.timestamp)("processing_completed_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_raw_dataset_files_status").on(table.processingStatus),
    (0, pg_core_1.index)("idx_raw_dataset_files_type").on(table.datasetType),
    (0, pg_core_1.index)("idx_raw_dataset_files_source").on(table.source),
    (0, pg_core_1.index)("idx_raw_dataset_files_uploaded_by").on(table.uploadedBy),
    (0, pg_core_1.index)("idx_raw_dataset_files_checksum").on(table.checksum),
]);
// Staging Records - Temporary storage for parsed CSV rows before normalization
exports.stagingRecords = (0, pg_core_1.pgTable)("staging_records", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Source tracking
    datasetFileId: (0, pg_core_1.varchar)("dataset_file_id").notNull().references(() => exports.rawDatasetFiles.id),
    rowNumber: (0, pg_core_1.integer)("row_number").notNull(), // Row number in original CSV
    // Raw data
    rawData: (0, pg_core_1.jsonb)("raw_data").notNull(), // Complete row data as JSON
    dataHash: (0, pg_core_1.text)("data_hash").notNull(), // Hash of raw data for deduplication
    // Processing status
    processingStatus: (0, pg_core_1.text)("processing_status").default("pending"), // 'pending', 'processing', 'normalized', 'failed', 'skipped'
    normalizationAttempts: (0, pg_core_1.integer)("normalization_attempts").default(0),
    // Identification and classification
    recordType: (0, pg_core_1.text)("record_type"), // 'character', 'comic_issue', 'battle', 'movie', 'review'
    detectedEntityType: (0, pg_core_1.text)("detected_entity_type"), // AI-detected entity type
    confidenceScore: (0, pg_core_1.decimal)("confidence_score", { precision: 3, scale: 2 }), // 0-1 confidence in classification
    // Normalization mapping
    mappedFields: (0, pg_core_1.jsonb)("mapped_fields"), // Field mapping from raw data to normalized schema
    extractedEntities: (0, pg_core_1.jsonb)("extracted_entities"), // Extracted entity references
    relationshipHints: (0, pg_core_1.jsonb)("relationship_hints"), // Potential relationships with other entities
    // Quality metrics
    dataQualityScore: (0, pg_core_1.decimal)("data_quality_score", { precision: 3, scale: 2 }), // 0-1 quality assessment
    missingFields: (0, pg_core_1.text)("missing_fields").array(), // Required fields that are missing
    dataInconsistencies: (0, pg_core_1.jsonb)("data_inconsistencies"), // Detected data issues
    // Deduplication
    isDuplicate: (0, pg_core_1.boolean)("is_duplicate").default(false),
    duplicateOf: (0, pg_core_1.varchar)("duplicate_of"), // Reference to original record
    similarityScore: (0, pg_core_1.decimal)("similarity_score", { precision: 3, scale: 2 }), // Similarity to potential duplicates
    // Error handling
    errorMessages: (0, pg_core_1.text)("error_messages").array(),
    lastErrorDetails: (0, pg_core_1.jsonb)("last_error_details"),
    // Vector embeddings for similarity detection and entity matching
    contentEmbedding: (0, pg_core_1.vector)("content_embedding", { dimensions: 1536 }),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    processedAt: (0, pg_core_1.timestamp)("processed_at"),
    normalizedAt: (0, pg_core_1.timestamp)("normalized_at"),
}, (table) => [
    (0, pg_core_1.index)("idx_staging_records_file_id").on(table.datasetFileId),
    (0, pg_core_1.index)("idx_staging_records_status").on(table.processingStatus),
    (0, pg_core_1.index)("idx_staging_records_type").on(table.recordType),
    (0, pg_core_1.index)("idx_staging_records_hash").on(table.dataHash),
    (0, pg_core_1.index)("idx_staging_records_duplicate").on(table.isDuplicate),
    // Unique constraint to prevent duplicate rows from same file
    (0, pg_core_1.index)("idx_staging_records_unique").on(table.datasetFileId, table.rowNumber),
]);
// ============================================================================
// CANONICAL ENTITY EXTENSIONS - Normalized Entities and Traits
// ============================================================================
// Narrative Entities - Normalized character/comic/media entities with unique IDs
exports.narrativeEntities = (0, pg_core_1.pgTable)("narrative_entities", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Core identification
    canonicalName: (0, pg_core_1.text)("canonical_name").notNull(),
    entityType: (0, pg_core_1.text)("entity_type").notNull(), // 'character', 'comic_series', 'comic_issue', 'movie', 'tv_show', 'creator', 'publisher', 'team', 'location', 'artifact'
    subtype: (0, pg_core_1.text)("subtype"), // 'hero', 'villain', 'antihero', 'supporting', 'ongoing_series', 'limited_series', etc.
    universe: (0, pg_core_1.text)("universe").notNull(), // 'marvel', 'dc', 'image', 'dark_horse', 'independent', 'crossover'
    // Identity and classification
    realName: (0, pg_core_1.text)("real_name"), // For characters
    secretIdentity: (0, pg_core_1.boolean)("secret_identity").default(false),
    publicIdentity: (0, pg_core_1.boolean)("public_identity").default(false),
    isDeceased: (0, pg_core_1.boolean)("is_deceased").default(false),
    // Physical characteristics (for characters)
    gender: (0, pg_core_1.text)("gender"),
    species: (0, pg_core_1.text)("species").default("human"),
    height: (0, pg_core_1.decimal)("height", { precision: 5, scale: 2 }), // Height in cm
    weight: (0, pg_core_1.decimal)("weight", { precision: 5, scale: 1 }), // Weight in kg
    eyeColor: (0, pg_core_1.text)("eye_color"),
    hairColor: (0, pg_core_1.text)("hair_color"),
    // Publication/creation details
    firstAppearance: (0, pg_core_1.text)("first_appearance"), // Comic issue or media where entity first appeared
    firstAppearanceDate: (0, pg_core_1.text)("first_appearance_date"), // Publication date
    creators: (0, pg_core_1.text)("creators").array(), // Original creators
    currentCreators: (0, pg_core_1.text)("current_creators").array(), // Current writers/artists
    // Relationship data
    teams: (0, pg_core_1.text)("teams").array(), // Team affiliations
    allies: (0, pg_core_1.text)("allies").array(), // Allied entity IDs
    enemies: (0, pg_core_1.text)("enemies").array(), // Enemy entity IDs
    familyMembers: (0, pg_core_1.text)("family_members").array(), // Family relationship entity IDs
    // Geographic and temporal context
    originLocation: (0, pg_core_1.text)("origin_location"), // Place of origin
    currentLocation: (0, pg_core_1.text)("current_location"), // Current location
    timelineEra: (0, pg_core_1.text)("timeline_era"), // 'golden_age', 'silver_age', 'bronze_age', 'modern_age', 'future'
    // Publication status
    publicationStatus: (0, pg_core_1.text)("publication_status").default("active"), // 'active', 'inactive', 'limited', 'concluded', 'cancelled'
    lastAppearance: (0, pg_core_1.text)("last_appearance"),
    lastAppearanceDate: (0, pg_core_1.text)("last_appearance_date"),
    // Market and trading data
    assetId: (0, pg_core_1.varchar)("asset_id").references(() => exports.assets.id), // Link to tradeable asset
    marketValue: (0, pg_core_1.decimal)("market_value", { precision: 10, scale: 2 }),
    popularityScore: (0, pg_core_1.decimal)("popularity_score", { precision: 8, scale: 2 }),
    culturalImpact: (0, pg_core_1.decimal)("cultural_impact", { precision: 8, scale: 2 }), // 0-100 cultural significance score
    // Content and description
    biography: (0, pg_core_1.text)("biography"), // Comprehensive character/entity background
    description: (0, pg_core_1.text)("description"), // Brief description
    keyStorylines: (0, pg_core_1.text)("key_storylines").array(), // Important story arcs
    notableQuotes: (0, pg_core_1.text)("notable_quotes").array(),
    // Visual representation
    primaryImageUrl: (0, pg_core_1.text)("primary_image_url"),
    alternateImageUrls: (0, pg_core_1.text)("alternate_image_urls").array(),
    iconographicElements: (0, pg_core_1.text)("iconographic_elements").array(), // Visual symbols, costume elements
    // Data quality and verification
    canonicalityScore: (0, pg_core_1.decimal)("canonicality_score", { precision: 3, scale: 2 }).default("1.00"), // 0-1 how canonical this entity is
    dataCompleteness: (0, pg_core_1.decimal)("data_completeness", { precision: 3, scale: 2 }), // 0-1 how complete the data is
    verificationStatus: (0, pg_core_1.text)("verification_status").default("unverified"), // 'verified', 'unverified', 'disputed'
    verifiedBy: (0, pg_core_1.varchar)("verified_by").references(() => exports.users.id),
    lastVerifiedAt: (0, pg_core_1.timestamp)("last_verified_at"), // Last multi-source verification date
    // Data source tracking - for 401,666 assets, we need bulletproof provenance
    dataSourceBreakdown: (0, pg_core_1.jsonb)("data_source_breakdown"), // { biography: ['comic_vine', 'marvel_api'], creators: ['comic_vine'], powers: ['superhero_api'] }
    sourceConflicts: (0, pg_core_1.jsonb)("source_conflicts"), // Track when sources disagree: { creators: { comic_vine: 'Bob Kane', marvel_api: 'Bill Finger' } }
    primaryDataSource: (0, pg_core_1.text)("primary_data_source"), // 'comic_vine', 'marvel_api', 'superhero_api', 'wikipedia'
    // External references
    externalIds: (0, pg_core_1.jsonb)("external_ids"), // IDs from other databases (wikia, imdb, etc.)
    sourceUrls: (0, pg_core_1.text)("source_urls").array(), // Original source URLs
    wikipediaUrl: (0, pg_core_1.text)("wikipedia_url"),
    officialWebsite: (0, pg_core_1.text)("official_website"),
    // Vector embeddings for similarity and recommendations
    entityEmbedding: (0, pg_core_1.vector)("entity_embedding", { dimensions: 1536 }),
    biographyEmbedding: (0, pg_core_1.vector)("biography_embedding", { dimensions: 1536 }),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_narrative_entities_type").on(table.entityType),
    (0, pg_core_1.index)("idx_narrative_entities_universe").on(table.universe),
    (0, pg_core_1.index)("idx_narrative_entities_subtype").on(table.subtype),
    (0, pg_core_1.index)("idx_narrative_entities_canonical_name").on(table.canonicalName),
    (0, pg_core_1.index)("idx_narrative_entities_asset_id").on(table.assetId),
    (0, pg_core_1.index)("idx_narrative_entities_popularity").on(table.popularityScore),
    (0, pg_core_1.index)("idx_narrative_entities_verification").on(table.verificationStatus),
    // Unique constraint on canonical name + universe for entity types
    (0, pg_core_1.index)("idx_narrative_entities_unique").on(table.canonicalName, table.universe, table.entityType),
]);
// Narrative Traits - Character powers, abilities, and attributes with quantified values
exports.narrativeTraits = (0, pg_core_1.pgTable)("narrative_traits", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Entity association
    entityId: (0, pg_core_1.varchar)("entity_id").notNull().references(() => exports.narrativeEntities.id),
    // Trait classification
    traitCategory: (0, pg_core_1.text)("trait_category").notNull(), // 'power', 'skill', 'equipment', 'weakness', 'personality', 'physical_attribute'
    traitType: (0, pg_core_1.text)("trait_type").notNull(), // 'superhuman_strength', 'telepathy', 'martial_arts', 'armor', 'kryptonite_vulnerability'
    traitName: (0, pg_core_1.text)("trait_name").notNull(), // Human-readable trait name
    // Quantification
    potencyLevel: (0, pg_core_1.integer)("potency_level"), // 1-10 scale for power level
    masteryLevel: (0, pg_core_1.integer)("mastery_level"), // 1-10 scale for skill mastery
    reliabilityLevel: (0, pg_core_1.integer)("reliability_level"), // 1-10 scale for how consistently the trait manifests
    versatilityScore: (0, pg_core_1.decimal)("versatility_score", { precision: 3, scale: 2 }), // 0-1 how versatile the trait is
    // Detailed specifications
    description: (0, pg_core_1.text)("description").notNull(),
    limitations: (0, pg_core_1.text)("limitations").array(), // Known limitations or restrictions
    triggers: (0, pg_core_1.text)("triggers").array(), // What activates this trait
    duration: (0, pg_core_1.text)("duration"), // How long the trait lasts when active
    range: (0, pg_core_1.text)("range"), // Physical or mental range of the trait
    energyCost: (0, pg_core_1.text)("energy_cost"), // Physical or mental cost to use
    // Contextual factors
    environmentalFactors: (0, pg_core_1.text)("environmental_factors").array(), // Environmental conditions that affect the trait
    combatEffectiveness: (0, pg_core_1.decimal)("combat_effectiveness", { precision: 3, scale: 2 }), // 0-1 effectiveness in combat
    utilityValue: (0, pg_core_1.decimal)("utility_value", { precision: 3, scale: 2 }), // 0-1 usefulness outside combat
    rarityScore: (0, pg_core_1.decimal)("rarity_score", { precision: 3, scale: 2 }), // 0-1 how rare this trait is in universe
    // Evolution and progression
    acquisitionMethod: (0, pg_core_1.text)("acquisition_method"), // 'birth', 'mutation', 'training', 'accident', 'technology', 'magic'
    developmentStage: (0, pg_core_1.text)("development_stage").default("stable"), // 'emerging', 'developing', 'stable', 'declining', 'lost'
    evolutionPotential: (0, pg_core_1.decimal)("evolution_potential", { precision: 3, scale: 2 }), // 0-1 potential for growth
    // Canon and continuity
    canonicity: (0, pg_core_1.text)("canonicity").default("main"), // 'main', 'alternate', 'what_if', 'elseworld', 'non_canon'
    continuityEra: (0, pg_core_1.text)("continuity_era"), // When this trait was active in continuity
    retconStatus: (0, pg_core_1.text)("retcon_status").default("current"), // 'current', 'retconned', 'disputed', 'restored'
    // Source and verification
    sourceIssues: (0, pg_core_1.text)("source_issues").array(), // Comic issues where this trait was established/shown
    sourceMedia: (0, pg_core_1.text)("source_media").array(), // Movies, TV shows, games where trait appeared
    verificationLevel: (0, pg_core_1.text)("verification_level").default("unverified"), // 'verified', 'likely', 'unverified', 'disputed'
    // Market impact
    marketRelevance: (0, pg_core_1.decimal)("market_relevance", { precision: 3, scale: 2 }), // 0-1 how much this trait affects market value
    fanAppeal: (0, pg_core_1.decimal)("fan_appeal", { precision: 3, scale: 2 }), // 0-1 how much fans care about this trait
    // Metadata
    tags: (0, pg_core_1.text)("tags").array(), // Searchable tags
    aliases: (0, pg_core_1.text)("aliases").array(), // Alternative names for this trait
    relatedTraits: (0, pg_core_1.text)("related_traits").array(), // IDs of related trait records
    // Vector embeddings for trait similarity and clustering
    traitEmbedding: (0, pg_core_1.vector)("trait_embedding", { dimensions: 1536 }),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    lastVerifiedAt: (0, pg_core_1.timestamp)("last_verified_at"),
}, (table) => [
    (0, pg_core_1.index)("idx_narrative_traits_entity_id").on(table.entityId),
    (0, pg_core_1.index)("idx_narrative_traits_category").on(table.traitCategory),
    (0, pg_core_1.index)("idx_narrative_traits_type").on(table.traitType),
    (0, pg_core_1.index)("idx_narrative_traits_potency").on(table.potencyLevel),
    (0, pg_core_1.index)("idx_narrative_traits_mastery").on(table.masteryLevel),
    (0, pg_core_1.index)("idx_narrative_traits_canonicity").on(table.canonicity),
    (0, pg_core_1.index)("idx_narrative_traits_market_relevance").on(table.marketRelevance),
]);
// Comic Covers - Library of 645,000+ cover images from multiple sources
exports.comicCovers = (0, pg_core_1.pgTable)("comic_covers", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Issue identification
    publisher: (0, pg_core_1.text)("publisher").notNull(), // 'marvel', 'dc', 'image', etc.
    series: (0, pg_core_1.text)("series").notNull(), // 'Amazing Spider-Man', 'Batman', etc.
    issueNumber: (0, pg_core_1.text)("issue_number").notNull(), // '1', '500', 'Annual 1', etc.
    variant: (0, pg_core_1.text)("variant").default("regular"), // 'regular', 'variant_a', 'sketch', '1_in_25', etc.
    volumeYear: (0, pg_core_1.integer)("volume_year"), // Series volume/year for disambiguation
    // Storage reference
    storagePath: (0, pg_core_1.text)("storage_path").notNull(), // '/public/covers/marvel/amazing-spider-man/001_regular.jpg'
    imageUrl: (0, pg_core_1.text)("image_url").notNull(), // Full URL for serving: '/public-objects/covers/...'
    thumbnailPath: (0, pg_core_1.text)("thumbnail_path"), // Optional thumbnail for faster loading
    // Image metadata
    fileSize: (0, pg_core_1.integer)("file_size"), // Bytes
    width: (0, pg_core_1.integer)("width"), // Pixels
    height: (0, pg_core_1.integer)("height"), // Pixels
    format: (0, pg_core_1.text)("format").default("jpeg"), // 'jpeg', 'png', 'webp'
    // Source tracking
    sourceType: (0, pg_core_1.text)("source_type").notNull(), // 'marvel_api', 'gocollect', 'comic_vine', 'manual_upload', 'community'
    sourceId: (0, pg_core_1.text)("source_id"), // External ID from source system
    sourceUrl: (0, pg_core_1.text)("source_url"), // Original source URL
    sourceQuality: (0, pg_core_1.text)("source_quality").default("standard"), // 'low', 'standard', 'high', 'ultra', 'raw_scan'
    collectedAt: (0, pg_core_1.timestamp)("collected_at").defaultNow(), // When bot collected it
    collectedBy: (0, pg_core_1.text)("collected_by").default("bot"), // 'marvel_bot', 'gocollect_bot', 'user_123', etc.
    // Significance classification (Tier system for prioritization)
    significanceTier: (0, pg_core_1.integer)("significance_tier").default(3), // 1=key issues, 2=important, 3=standard
    significanceTags: (0, pg_core_1.text)("significance_tags").array(), // ['first_appearance', 'death', 'origin', 'key_issue', 'variant_cover']
    keyCharacterAppearances: (0, pg_core_1.text)("key_character_appearances").array(), // Entity IDs of characters with significant appearances
    firstAppearanceOf: (0, pg_core_1.text)("first_appearance_of").array(), // Entity IDs of characters/concepts debuting in this issue
    // Character tracking - links to narrativeEntities
    featuredCharacters: (0, pg_core_1.text)("featured_characters").array(), // Entity IDs of main characters on cover
    // Grading and condition (for high-value scans)
    gradingCompany: (0, pg_core_1.text)("grading_company"), // 'cgc', 'cbcs', 'pgx', null if raw
    grade: (0, pg_core_1.decimal)("grade", { precision: 3, scale: 1 }), // CGC grade: 9.8, 9.6, etc.
    isSlabbed: (0, pg_core_1.boolean)("is_slabbed").default(false), // Whether this is a graded/slabbed comic scan
    // Historical pricing context (from GoCollect/auction data)
    recordSalePrice: (0, pg_core_1.decimal)("record_sale_price", { precision: 12, scale: 2 }), // Highest known sale price for this issue/grade
    recordSaleDate: (0, pg_core_1.timestamp)("record_sale_date"), // When record sale occurred
    averagePrice: (0, pg_core_1.decimal)("average_price", { precision: 10, scale: 2 }), // Average market price
    // Verification and quality control
    verificationStatus: (0, pg_core_1.text)("verification_status").default("unverified"), // 'verified', 'unverified', 'disputed', 'flagged'
    verifiedBy: (0, pg_core_1.varchar)("verified_by").references(() => exports.users.id),
    verifiedAt: (0, pg_core_1.timestamp)("verified_at"),
    qualityIssues: (0, pg_core_1.text)("quality_issues").array(), // ['watermark', 'low_res', 'cropped', 'color_shifted']
    // Metadata
    notes: (0, pg_core_1.text)("notes"), // Admin notes about this cover
    tags: (0, pg_core_1.text)("tags").array(), // Additional searchable tags
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_comic_covers_publisher").on(table.publisher),
    (0, pg_core_1.index)("idx_comic_covers_series").on(table.series),
    (0, pg_core_1.index)("idx_comic_covers_issue").on(table.issueNumber),
    (0, pg_core_1.index)("idx_comic_covers_source_type").on(table.sourceType),
    (0, pg_core_1.index)("idx_comic_covers_significance_tier").on(table.significanceTier),
    (0, pg_core_1.index)("idx_comic_covers_verification").on(table.verificationStatus),
    (0, pg_core_1.index)("idx_comic_covers_collected_at").on(table.collectedAt),
    // Composite index for cover lookups (publisher+series+issue+variant+volume)
    (0, pg_core_1.index)("idx_comic_covers_composite").on(table.publisher, table.series, table.issueNumber, table.variant, table.volumeYear),
]);
// Entity Aliases - Handle name variations and cross-universe mappings
exports.entityAliases = (0, pg_core_1.pgTable)("entity_aliases", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Entity association
    canonicalEntityId: (0, pg_core_1.varchar)("canonical_entity_id").notNull().references(() => exports.narrativeEntities.id),
    // Alias information
    aliasName: (0, pg_core_1.text)("alias_name").notNull(),
    aliasType: (0, pg_core_1.text)("alias_type").notNull(), // 'real_name', 'codename', 'nickname', 'title', 'secret_identity', 'civilian_identity', 'alternate_universe', 'translation', 'misspelling'
    // Usage context
    usageContext: (0, pg_core_1.text)("usage_context"), // 'primary', 'secondary', 'historical', 'alternate_universe', 'fan_name', 'media_adaptation'
    universe: (0, pg_core_1.text)("universe"), // Specific universe where this alias applies
    timeline: (0, pg_core_1.text)("timeline"), // Timeline/era when this alias was used
    media: (0, pg_core_1.text)("media"), // 'comics', 'movies', 'tv', 'games', 'novels'
    // Popularity and recognition
    popularityScore: (0, pg_core_1.decimal)("popularity_score", { precision: 3, scale: 2 }), // 0-1 how well-known this alias is
    officialStatus: (0, pg_core_1.boolean)("official_status").default(false), // Whether this is an official name
    currentlyInUse: (0, pg_core_1.boolean)("currently_in_use").default(true), // Whether this alias is currently used
    // Linguistic and cultural data
    language: (0, pg_core_1.text)("language").default("en"), // Language of the alias
    culturalContext: (0, pg_core_1.text)("cultural_context"), // Cultural significance of the name
    pronunciation: (0, pg_core_1.text)("pronunciation"), // Phonetic pronunciation guide
    etymology: (0, pg_core_1.text)("etymology"), // Origin and meaning of the name
    // Cross-reference data
    sourceEntity: (0, pg_core_1.varchar)("source_entity"), // Original entity this alias came from (for cross-universe variants)
    alternateUniverseId: (0, pg_core_1.text)("alternate_universe_id"), // Earth-616, Earth-2, etc.
    characterVariation: (0, pg_core_1.text)("character_variation"), // 'main', 'ultimate', 'noir', 'zombie', 'female', 'evil'
    // Source tracking
    sourceIssues: (0, pg_core_1.text)("source_issues").array(), // Where this alias first appeared or was used
    sourceMedia: (0, pg_core_1.text)("source_media").array(), // Non-comic media where alias was used
    introducedBy: (0, pg_core_1.text)("introduced_by").array(), // Creators who introduced this alias
    firstUsageDate: (0, pg_core_1.text)("first_usage_date"),
    lastUsageDate: (0, pg_core_1.text)("last_usage_date"),
    // Search and matching
    searchPriority: (0, pg_core_1.integer)("search_priority").default(0), // Priority for search results (higher = shown first)
    exactMatchWeight: (0, pg_core_1.decimal)("exact_match_weight", { precision: 3, scale: 2 }).default("1.00"), // Weight for exact matches
    fuzzyMatchWeight: (0, pg_core_1.decimal)("fuzzy_match_weight", { precision: 3, scale: 2 }).default("0.80"), // Weight for fuzzy matches
    // Data quality
    verificationLevel: (0, pg_core_1.text)("verification_level").default("unverified"), // 'verified', 'likely', 'unverified', 'disputed'
    confidenceScore: (0, pg_core_1.decimal)("confidence_score", { precision: 3, scale: 2 }).default("1.00"), // Confidence in this alias mapping
    qualityFlags: (0, pg_core_1.text)("quality_flags").array(), // 'official', 'fan_created', 'disputed', 'outdated'
    // Metadata
    notes: (0, pg_core_1.text)("notes"), // Additional information about this alias
    tags: (0, pg_core_1.text)("tags").array(), // Searchable tags
    // Vector embeddings for name similarity and matching
    aliasEmbedding: (0, pg_core_1.vector)("alias_embedding", { dimensions: 1536 }),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    lastVerifiedAt: (0, pg_core_1.timestamp)("last_verified_at"),
}, (table) => [
    (0, pg_core_1.index)("idx_entity_aliases_canonical_id").on(table.canonicalEntityId),
    (0, pg_core_1.index)("idx_entity_aliases_name").on(table.aliasName),
    (0, pg_core_1.index)("idx_entity_aliases_type").on(table.aliasType),
    (0, pg_core_1.index)("idx_entity_aliases_usage_context").on(table.usageContext),
    (0, pg_core_1.index)("idx_entity_aliases_universe").on(table.universe),
    (0, pg_core_1.index)("idx_entity_aliases_popularity").on(table.popularityScore),
    (0, pg_core_1.index)("idx_entity_aliases_official").on(table.officialStatus),
    (0, pg_core_1.index)("idx_entity_aliases_current").on(table.currentlyInUse),
    (0, pg_core_1.index)("idx_entity_aliases_search_priority").on(table.searchPriority),
    // Unique constraint to prevent duplicate aliases for same entity
    (0, pg_core_1.index)("idx_entity_aliases_unique").on(table.canonicalEntityId, table.aliasName, table.universe),
]);
// ============================================================================
// RELATIONSHIP TABLES - Entity Interactions and Media Performance
// ============================================================================
// Entity Interactions - Battle outcomes, team affiliations, rivalries
exports.entityInteractions = (0, pg_core_1.pgTable)("entity_interactions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Entity participants
    primaryEntityId: (0, pg_core_1.varchar)("primary_entity_id").notNull().references(() => exports.narrativeEntities.id),
    secondaryEntityId: (0, pg_core_1.varchar)("secondary_entity_id").references(() => exports.narrativeEntities.id), // Null for environmental or solo interactions
    // Interaction classification
    interactionType: (0, pg_core_1.text)("interaction_type").notNull(), // 'battle', 'team_up', 'romance', 'mentorship', 'rivalry', 'family', 'alliance', 'betrayal'
    interactionSubtype: (0, pg_core_1.text)("interaction_subtype"), // 'one_on_one', 'team_battle', 'tournament', 'war', 'temporary_team', 'long_term_team'
    relationshipType: (0, pg_core_1.text)("relationship_type"), // 'allies', 'enemies', 'neutral', 'romantic', 'family', 'mentor_student', 'rivals'
    // Outcome and results
    outcome: (0, pg_core_1.text)("outcome"), // 'primary_wins', 'secondary_wins', 'draw', 'mutual_victory', 'mutual_defeat', 'interrupted', 'ongoing'
    outcomeConfidence: (0, pg_core_1.decimal)("outcome_confidence", { precision: 3, scale: 2 }), // 0-1 confidence in outcome determination
    primaryEntityResult: (0, pg_core_1.text)("primary_entity_result"), // 'victory', 'defeat', 'draw', 'survival', 'sacrifice', 'growth'
    secondaryEntityResult: (0, pg_core_1.text)("secondary_entity_result"),
    // Context and circumstances
    environment: (0, pg_core_1.text)("environment"), // 'urban', 'space', 'underwater', 'mystical_realm', 'laboratory', 'school'
    timeOfDay: (0, pg_core_1.text)("time_of_day"), // 'day', 'night', 'dawn', 'dusk'
    weatherConditions: (0, pg_core_1.text)("weather_conditions"), // 'clear', 'storm', 'rain', 'snow', 'extreme'
    publicVisibility: (0, pg_core_1.text)("public_visibility"), // 'public', 'secret', 'limited_witnesses', 'recorded'
    // Power dynamics and analysis
    powerDifferential: (0, pg_core_1.decimal)("power_differential", { precision: 8, scale: 2 }), // -10 to +10 power advantage for primary entity
    strategicAdvantage: (0, pg_core_1.text)("strategic_advantage"), // Which entity had strategic advantages
    preparationTime: (0, pg_core_1.text)("preparation_time"), // 'none', 'minutes', 'hours', 'days', 'weeks'
    homeFieldAdvantage: (0, pg_core_1.text)("home_field_advantage"), // 'primary', 'secondary', 'neutral'
    // Duration and intensity
    duration: (0, pg_core_1.integer)("duration_minutes"), // Duration in minutes
    intensityLevel: (0, pg_core_1.integer)("intensity_level"), // 1-10 scale of interaction intensity
    collateralDamage: (0, pg_core_1.text)("collateral_damage"), // 'none', 'minimal', 'moderate', 'extensive', 'catastrophic'
    casualtyCount: (0, pg_core_1.integer)("casualty_count"), // Number of casualties if applicable
    // Moral and ethical dimensions
    moralContext: (0, pg_core_1.text)("moral_context"), // 'heroic', 'villainous', 'neutral', 'gray_area', 'misunderstanding'
    ethicalImplications: (0, pg_core_1.text)("ethical_implications").array(), // Ethical issues raised by this interaction
    justification: (0, pg_core_1.text)("justification"), // Reason for the interaction
    // Media and canonicity
    sourceIssue: (0, pg_core_1.text)("source_issue"), // Comic issue where this happened
    sourceMedia: (0, pg_core_1.text)("source_media"), // Movies, TV shows, games where depicted
    writerCredits: (0, pg_core_1.text)("writer_credits").array(), // Writers who created this interaction
    artistCredits: (0, pg_core_1.text)("artist_credits").array(), // Artists who depicted this interaction
    canonicity: (0, pg_core_1.text)("canonicity").default("main"), // 'main', 'alternate', 'what_if', 'elseworld', 'adaptation'
    continuityEra: (0, pg_core_1.text)("continuity_era"), // Timeline era when this occurred
    eventDate: (0, pg_core_1.text)("event_date"), // In-universe date when this occurred
    publicationDate: (0, pg_core_1.text)("publication_date"), // Real-world publication date
    // Consequences and aftermath
    shortTermConsequences: (0, pg_core_1.text)("short_term_consequences").array(), // Immediate results
    longTermConsequences: (0, pg_core_1.text)("long_term_consequences").array(), // Lasting effects
    characterDevelopment: (0, pg_core_1.jsonb)("character_development"), // How characters changed
    relationshipChange: (0, pg_core_1.text)("relationship_change"), // How relationship evolved
    // Market and cultural impact
    fanReaction: (0, pg_core_1.text)("fan_reaction"), // 'positive', 'negative', 'mixed', 'controversial', 'ignored'
    culturalSignificance: (0, pg_core_1.decimal)("cultural_significance", { precision: 3, scale: 2 }), // 0-1 cultural importance
    marketImpact: (0, pg_core_1.decimal)("market_impact", { precision: 8, scale: 2 }), // Expected impact on asset prices
    iconicStatus: (0, pg_core_1.boolean)("iconic_status").default(false), // Whether this is considered iconic
    // Data quality and verification
    verificationLevel: (0, pg_core_1.text)("verification_level").default("unverified"), // 'verified', 'likely', 'unverified', 'disputed'
    dataCompleteness: (0, pg_core_1.decimal)("data_completeness", { precision: 3, scale: 2 }), // 0-1 how complete the data is
    sourceReliability: (0, pg_core_1.decimal)("source_reliability", { precision: 3, scale: 2 }), // 0-1 reliability of sources
    // Additional participants
    additionalParticipants: (0, pg_core_1.text)("additional_participants").array(), // Other entity IDs involved
    teamAffiliations: (0, pg_core_1.text)("team_affiliations").array(), // Teams involved in interaction
    // Metadata
    tags: (0, pg_core_1.text)("tags").array(), // Searchable tags
    keywords: (0, pg_core_1.text)("keywords").array(), // Keywords for search
    summary: (0, pg_core_1.text)("summary"), // Brief description of the interaction
    detailedDescription: (0, pg_core_1.text)("detailed_description"), // Full description
    // Vector embeddings for interaction similarity and clustering
    interactionEmbedding: (0, pg_core_1.vector)("interaction_embedding", { dimensions: 1536 }),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    lastVerifiedAt: (0, pg_core_1.timestamp)("last_verified_at"),
}, (table) => [
    (0, pg_core_1.index)("idx_entity_interactions_primary").on(table.primaryEntityId),
    (0, pg_core_1.index)("idx_entity_interactions_secondary").on(table.secondaryEntityId),
    (0, pg_core_1.index)("idx_entity_interactions_type").on(table.interactionType),
    (0, pg_core_1.index)("idx_entity_interactions_outcome").on(table.outcome),
    (0, pg_core_1.index)("idx_entity_interactions_canonicity").on(table.canonicity),
    (0, pg_core_1.index)("idx_entity_interactions_significance").on(table.culturalSignificance),
    (0, pg_core_1.index)("idx_entity_interactions_market_impact").on(table.marketImpact),
    (0, pg_core_1.index)("idx_entity_interactions_iconic").on(table.iconicStatus),
    (0, pg_core_1.index)("idx_entity_interactions_publication_date").on(table.publicationDate),
]);
// Media Performance Metrics - Box office, ratings, cultural impact data
exports.mediaPerformanceMetrics = (0, pg_core_1.pgTable)("media_performance_metrics", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Media identification
    mediaTitle: (0, pg_core_1.text)("media_title").notNull(),
    mediaType: (0, pg_core_1.text)("media_type").notNull(), // 'movie', 'tv_series', 'tv_episode', 'animated_movie', 'animated_series', 'video_game', 'novel', 'graphic_novel'
    releaseFormat: (0, pg_core_1.text)("release_format"), // 'theatrical', 'streaming', 'tv', 'direct_video', 'digital', 'limited_release'
    // Franchise and universe
    franchise: (0, pg_core_1.text)("franchise").notNull(), // 'MCU', 'DCEU', 'X-Men', 'Spider-Man', 'Batman'
    universe: (0, pg_core_1.text)("universe").notNull(), // 'marvel', 'dc', 'image', 'independent'
    continuity: (0, pg_core_1.text)("continuity"), // 'Earth-616', 'Earth-2', 'Ultimate', 'Cinematic'
    // Featured entities
    featuredEntities: (0, pg_core_1.text)("featured_entities").array(), // Narrative entity IDs
    mainCharacters: (0, pg_core_1.text)("main_characters").array(), // Primary characters
    supportingCharacters: (0, pg_core_1.text)("supporting_characters").array(), // Supporting characters
    villains: (0, pg_core_1.text)("villains").array(), // Antagonists
    teams: (0, pg_core_1.text)("teams").array(), // Teams featured
    // Release information
    releaseDate: (0, pg_core_1.text)("release_date"),
    releaseYear: (0, pg_core_1.integer)("release_year"),
    releaseQuarter: (0, pg_core_1.integer)("release_quarter"), // 1-4
    releaseMonth: (0, pg_core_1.integer)("release_month"), // 1-12
    releaseTerritories: (0, pg_core_1.text)("release_territories").array(), // Countries/regions
    // Financial performance
    productionBudget: (0, pg_core_1.decimal)("production_budget", { precision: 15, scale: 2 }),
    marketingBudget: (0, pg_core_1.decimal)("marketing_budget", { precision: 15, scale: 2 }),
    totalBudget: (0, pg_core_1.decimal)("total_budget", { precision: 15, scale: 2 }),
    // Box office data
    openingWeekendGross: (0, pg_core_1.decimal)("opening_weekend_gross", { precision: 15, scale: 2 }),
    domesticGross: (0, pg_core_1.decimal)("domestic_gross", { precision: 15, scale: 2 }),
    internationalGross: (0, pg_core_1.decimal)("international_gross", { precision: 15, scale: 2 }),
    worldwideGross: (0, pg_core_1.decimal)("worldwide_gross", { precision: 15, scale: 2 }),
    // Adjusted financial metrics
    inflationAdjustedBudget: (0, pg_core_1.decimal)("inflation_adjusted_budget", { precision: 15, scale: 2 }),
    inflationAdjustedGross: (0, pg_core_1.decimal)("inflation_adjusted_gross", { precision: 15, scale: 2 }),
    profitMargin: (0, pg_core_1.decimal)("profit_margin", { precision: 8, scale: 2 }), // (Revenue - Cost) / Revenue * 100
    returnOnInvestment: (0, pg_core_1.decimal)("return_on_investment", { precision: 8, scale: 2 }), // (Revenue - Cost) / Cost * 100
    // Performance ratios
    grossToBudgetRatio: (0, pg_core_1.decimal)("gross_to_budget_ratio", { precision: 8, scale: 2 }),
    domesticPercentage: (0, pg_core_1.decimal)("domestic_percentage", { precision: 8, scale: 2 }),
    internationalPercentage: (0, pg_core_1.decimal)("international_percentage", { precision: 8, scale: 2 }),
    // Critical reception
    metacriticScore: (0, pg_core_1.integer)("metacritic_score"), // 0-100
    rottenTomatoesScore: (0, pg_core_1.integer)("rotten_tomatoes_score"), // 0-100 critics score
    rottenTomatoesAudienceScore: (0, pg_core_1.integer)("rotten_tomatoes_audience_score"), // 0-100 audience score
    imdbRating: (0, pg_core_1.decimal)("imdb_rating", { precision: 3, scale: 1 }), // 0-10 rating
    imdbVotes: (0, pg_core_1.integer)("imdb_votes"), // Number of votes
    // Awards and recognition
    majorAwardsWon: (0, pg_core_1.text)("major_awards_won").array(), // Oscar, Emmy, etc.
    majorAwardsNominated: (0, pg_core_1.text)("major_awards_nominated").array(),
    genreAwards: (0, pg_core_1.text)("genre_awards").array(), // Saturn Awards, etc.
    festivalAwards: (0, pg_core_1.text)("festival_awards").array(), // Film festival awards
    // Audience metrics
    openingTheaterCount: (0, pg_core_1.integer)("opening_theater_count"),
    maxTheaterCount: (0, pg_core_1.integer)("max_theater_count"),
    weeksInTheaters: (0, pg_core_1.integer)("weeks_in_theaters"),
    attendanceEstimate: (0, pg_core_1.integer)("attendance_estimate"), // Estimated total viewers
    // Digital and streaming performance
    streamingViewership: (0, pg_core_1.decimal)("streaming_viewership", { precision: 15, scale: 0 }), // Total streams/views
    digitalSales: (0, pg_core_1.decimal)("digital_sales", { precision: 15, scale: 2 }), // Digital purchase revenue
    physicalMediaSales: (0, pg_core_1.decimal)("physical_media_sales", { precision: 15, scale: 2 }), // DVD/Blu-ray sales
    merchandisingRevenue: (0, pg_core_1.decimal)("merchandising_revenue", { precision: 15, scale: 2 }),
    // Cultural impact metrics
    socialMediaMentions: (0, pg_core_1.integer)("social_media_mentions"), // Total social media mentions
    socialMediaSentiment: (0, pg_core_1.decimal)("social_media_sentiment", { precision: 3, scale: 2 }), // -1 to 1
    culturalReach: (0, pg_core_1.decimal)("cultural_reach", { precision: 8, scale: 2 }), // 0-100 cultural penetration score
    memeCulture: (0, pg_core_1.boolean)("meme_culture").default(false), // Whether it spawned significant memes
    fanCommunitySize: (0, pg_core_1.integer)("fan_community_size"), // Estimated fan community size
    // Demographic appeal
    primaryDemographic: (0, pg_core_1.text)("primary_demographic"), // 'children', 'teens', 'young_adults', 'adults', 'all_ages'
    genderAppeal: (0, pg_core_1.text)("gender_appeal"), // 'male_skewing', 'female_skewing', 'gender_neutral'
    ageRating: (0, pg_core_1.text)("age_rating"), // 'G', 'PG', 'PG-13', 'R', 'TV-Y', 'TV-14', etc.
    // Market impact on related assets
    assetPriceImpact: (0, pg_core_1.jsonb)("asset_price_impact"), // How this media affected related asset prices
    marketEventTrigger: (0, pg_core_1.boolean)("market_event_trigger").default(false), // Whether this triggered a market event
    tradingVolumeIncrease: (0, pg_core_1.decimal)("trading_volume_increase", { precision: 8, scale: 2 }), // % increase in related asset trading
    // Production details
    director: (0, pg_core_1.text)("director").array(),
    producers: (0, pg_core_1.text)("producers").array(),
    writers: (0, pg_core_1.text)("writers").array(),
    studio: (0, pg_core_1.text)("studio"),
    distributor: (0, pg_core_1.text)("distributor"),
    productionCompanies: (0, pg_core_1.text)("production_companies").array(),
    // Technical specifications
    runtime: (0, pg_core_1.integer)("runtime_minutes"),
    format: (0, pg_core_1.text)("format"), // 'live_action', 'animation', 'mixed'
    technologyUsed: (0, pg_core_1.text)("technology_used").array(), // 'IMAX', '3D', 'CGI', 'motion_capture'
    filmingLocations: (0, pg_core_1.text)("filming_locations").array(),
    // Sequel and franchise data
    isSequel: (0, pg_core_1.boolean)("is_sequel").default(false),
    isReboot: (0, pg_core_1.boolean)("is_reboot").default(false),
    isSpinoff: (0, pg_core_1.boolean)("is_spinoff").default(false),
    franchisePosition: (0, pg_core_1.integer)("franchise_position"), // Position in franchise chronology
    predecessorId: (0, pg_core_1.varchar)("predecessor_id"),
    successorId: (0, pg_core_1.varchar)("successor_id"),
    // Data quality and sources
    dataCompleteness: (0, pg_core_1.decimal)("data_completeness", { precision: 3, scale: 2 }), // 0-1 completeness score
    sourceReliability: (0, pg_core_1.decimal)("source_reliability", { precision: 3, scale: 2 }), // 0-1 source reliability
    dataSources: (0, pg_core_1.text)("data_sources").array(), // Where data came from
    lastDataUpdate: (0, pg_core_1.timestamp)("last_data_update"),
    // External references
    imdbId: (0, pg_core_1.text)("imdb_id"),
    tmdbId: (0, pg_core_1.text)("tmdb_id"), // The Movie Database ID
    rottenTomatoesId: (0, pg_core_1.text)("rotten_tomatoes_id"),
    metacriticId: (0, pg_core_1.text)("metacritic_id"),
    externalUrls: (0, pg_core_1.text)("external_urls").array(),
    // Vector embeddings for content similarity and recommendations
    contentEmbedding: (0, pg_core_1.vector)("content_embedding", { dimensions: 1536 }),
    performanceEmbedding: (0, pg_core_1.vector)("performance_embedding", { dimensions: 1536 }), // Performance pattern vector
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    lastVerifiedAt: (0, pg_core_1.timestamp)("last_verified_at"),
}, (table) => [
    (0, pg_core_1.index)("idx_media_performance_media_type").on(table.mediaType),
    (0, pg_core_1.index)("idx_media_performance_franchise").on(table.franchise),
    (0, pg_core_1.index)("idx_media_performance_universe").on(table.universe),
    (0, pg_core_1.index)("idx_media_performance_release_year").on(table.releaseYear),
    (0, pg_core_1.index)("idx_media_performance_worldwide_gross").on(table.worldwideGross),
    (0, pg_core_1.index)("idx_media_performance_roi").on(table.returnOnInvestment),
    (0, pg_core_1.index)("idx_media_performance_critical_score").on(table.metacriticScore),
    (0, pg_core_1.index)("idx_media_performance_cultural_reach").on(table.culturalReach),
    (0, pg_core_1.index)("idx_media_performance_franchise_position").on(table.franchisePosition),
]);
// ============================================================================
// INGESTION CONTROL TABLES - Job Management and Error Tracking
// ============================================================================
// Ingestion Jobs - Track batch processing jobs with status and progress
exports.ingestionJobs = (0, pg_core_1.pgTable)("ingestion_jobs", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Job identification
    jobName: (0, pg_core_1.text)("job_name").notNull(),
    jobType: (0, pg_core_1.text)("job_type").notNull(), // 'csv_import', 'api_sync', 'manual_entry', 'bulk_update', 'data_migration'
    batchId: (0, pg_core_1.text)("batch_id"), // Identifier for grouping related jobs
    // Job configuration
    datasetType: (0, pg_core_1.text)("dataset_type").notNull(), // 'characters', 'comics', 'battles', 'movies', 'reviews'
    sourceType: (0, pg_core_1.text)("source_type").notNull(), // 'csv_file', 'api', 'manual', 'database'
    processingMode: (0, pg_core_1.text)("processing_mode").default("standard"), // 'standard', 'fast', 'thorough', 'validation_only'
    // Input specifications
    inputFiles: (0, pg_core_1.text)("input_files").array(), // File IDs or paths
    inputParameters: (0, pg_core_1.jsonb)("input_parameters"), // Job-specific parameters
    validationRules: (0, pg_core_1.jsonb)("validation_rules"), // Data validation configuration
    normalizationRules: (0, pg_core_1.jsonb)("normalization_rules"), // Data normalization configuration
    deduplicationStrategy: (0, pg_core_1.text)("deduplication_strategy").default("strict"), // 'strict', 'fuzzy', 'merge', 'skip'
    // Processing settings
    batchSize: (0, pg_core_1.integer)("batch_size").default(1000), // Records processed per batch
    maxRetries: (0, pg_core_1.integer)("max_retries").default(3),
    timeoutMinutes: (0, pg_core_1.integer)("timeout_minutes").default(60),
    priorityLevel: (0, pg_core_1.integer)("priority_level").default(5), // 1-10 processing priority
    // Resource allocation
    maxConcurrency: (0, pg_core_1.integer)("max_concurrency").default(1), // Max parallel workers
    memoryLimit: (0, pg_core_1.integer)("memory_limit_mb").default(1024), // Memory limit in MB
    cpuLimit: (0, pg_core_1.decimal)("cpu_limit", { precision: 3, scale: 2 }).default("1.00"), // CPU cores allocated
    // Status tracking
    status: (0, pg_core_1.text)("status").default("queued"), // 'queued', 'running', 'paused', 'completed', 'failed', 'cancelled'
    progress: (0, pg_core_1.decimal)("progress", { precision: 5, scale: 2 }).default("0.00"), // 0-100%
    currentStage: (0, pg_core_1.text)("current_stage"), // 'validation', 'processing', 'normalization', 'storage'
    stageProgress: (0, pg_core_1.decimal)("stage_progress", { precision: 5, scale: 2 }).default("0.00"), // Progress within current stage
    // Metrics
    totalRecords: (0, pg_core_1.integer)("total_records").default(0),
    processedRecords: (0, pg_core_1.integer)("processed_records").default(0),
    successfulRecords: (0, pg_core_1.integer)("successful_records").default(0),
    failedRecords: (0, pg_core_1.integer)("failed_records").default(0),
    skippedRecords: (0, pg_core_1.integer)("skipped_records").default(0),
    duplicateRecords: (0, pg_core_1.integer)("duplicate_records").default(0),
    // Performance metrics
    recordsPerSecond: (0, pg_core_1.decimal)("records_per_second", { precision: 8, scale: 2 }),
    averageProcessingTime: (0, pg_core_1.decimal)("average_processing_time", { precision: 8, scale: 4 }), // Seconds per record
    peakMemoryUsage: (0, pg_core_1.integer)("peak_memory_usage_mb"),
    totalCpuTime: (0, pg_core_1.decimal)("total_cpu_time", { precision: 10, scale: 3 }), // CPU seconds used
    // Error tracking
    errorCount: (0, pg_core_1.integer)("error_count").default(0),
    warningCount: (0, pg_core_1.integer)("warning_count").default(0),
    lastErrorMessage: (0, pg_core_1.text)("last_error_message"),
    errorCategories: (0, pg_core_1.jsonb)("error_categories"), // Categorized error counts
    errorSampleSize: (0, pg_core_1.integer)("error_sample_size").default(10), // How many error examples to keep
    // Quality metrics
    dataQualityScore: (0, pg_core_1.decimal)("data_quality_score", { precision: 3, scale: 2 }), // 0-1 overall quality
    deduplicationEfficiency: (0, pg_core_1.decimal)("deduplication_efficiency", { precision: 3, scale: 2 }), // 0-1 dedup success
    normalizationAccuracy: (0, pg_core_1.decimal)("normalization_accuracy", { precision: 3, scale: 2 }), // 0-1 normalization success
    validationPassRate: (0, pg_core_1.decimal)("validation_pass_rate", { precision: 3, scale: 2 }), // 0-1 validation success
    // User and system info
    createdBy: (0, pg_core_1.varchar)("created_by").references(() => exports.users.id),
    assignedWorker: (0, pg_core_1.text)("assigned_worker"), // Worker node or process handling the job
    environmentInfo: (0, pg_core_1.jsonb)("environment_info"), // System info where job runs
    // Dependencies
    dependsOnJobs: (0, pg_core_1.text)("depends_on_jobs").array(), // Job IDs this job depends on
    prerequisiteConditions: (0, pg_core_1.jsonb)("prerequisite_conditions"), // Conditions that must be met
    // Output specifications
    outputFormat: (0, pg_core_1.text)("output_format").default("database"), // 'database', 'csv', 'json', 'api'
    outputLocation: (0, pg_core_1.text)("output_location"), // Where results are stored
    retentionPolicy: (0, pg_core_1.text)("retention_policy").default("standard"), // 'temporary', 'standard', 'long_term', 'permanent'
    // Notifications
    notificationSettings: (0, pg_core_1.jsonb)("notification_settings"), // When and how to notify
    notificationsSent: (0, pg_core_1.text)("notifications_sent").array(), // Track sent notifications
    // Metadata
    description: (0, pg_core_1.text)("description"),
    tags: (0, pg_core_1.text)("tags").array(),
    metadata: (0, pg_core_1.jsonb)("metadata"), // Additional job-specific data
    configurationSnapshot: (0, pg_core_1.jsonb)("configuration_snapshot"), // System config at time of job creation
    // Timestamps
    queuedAt: (0, pg_core_1.timestamp)("queued_at").defaultNow(),
    startedAt: (0, pg_core_1.timestamp)("started_at"),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    lastHeartbeat: (0, pg_core_1.timestamp)("last_heartbeat"), // Last activity from processing worker
    estimatedCompletionTime: (0, pg_core_1.timestamp)("estimated_completion_time"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_ingestion_jobs_status").on(table.status),
    (0, pg_core_1.index)("idx_ingestion_jobs_type").on(table.jobType),
    (0, pg_core_1.index)("idx_ingestion_jobs_dataset_type").on(table.datasetType),
    (0, pg_core_1.index)("idx_ingestion_jobs_batch_id").on(table.batchId),
    (0, pg_core_1.index)("idx_ingestion_jobs_priority").on(table.priorityLevel),
    (0, pg_core_1.index)("idx_ingestion_jobs_created_by").on(table.createdBy),
    (0, pg_core_1.index)("idx_ingestion_jobs_queued_at").on(table.queuedAt),
    (0, pg_core_1.index)("idx_ingestion_jobs_started_at").on(table.startedAt),
    (0, pg_core_1.index)("idx_ingestion_jobs_progress").on(table.progress),
    (0, pg_core_1.index)("idx_ingestion_jobs_last_heartbeat").on(table.lastHeartbeat),
]);
// Ingestion Runs - Individual execution records with timestamps and results
exports.ingestionRuns = (0, pg_core_1.pgTable)("ingestion_runs", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Job association
    jobId: (0, pg_core_1.varchar)("job_id").notNull().references(() => exports.ingestionJobs.id),
    runNumber: (0, pg_core_1.integer)("run_number").notNull(), // Sequential run number for this job
    // Run identification
    runType: (0, pg_core_1.text)("run_type").default("standard"), // 'standard', 'retry', 'partial', 'recovery', 'test'
    triggeredBy: (0, pg_core_1.text)("triggered_by").default("system"), // 'system', 'user', 'scheduler', 'api', 'webhook'
    triggerUserId: (0, pg_core_1.varchar)("trigger_user_id").references(() => exports.users.id),
    parentRunId: (0, pg_core_1.varchar)("parent_run_id"), // For retry runs
    // Execution environment
    workerId: (0, pg_core_1.text)("worker_id"), // Unique identifier of processing worker
    workerHost: (0, pg_core_1.text)("worker_host"), // Hostname of processing machine
    workerVersion: (0, pg_core_1.text)("worker_version"), // Version of processing software
    processId: (0, pg_core_1.integer)("process_id"), // OS process ID
    threadId: (0, pg_core_1.text)("thread_id"), // Thread identifier if multithreaded
    // Resource usage
    allocatedMemoryMb: (0, pg_core_1.integer)("allocated_memory_mb"),
    peakMemoryUsageMb: (0, pg_core_1.integer)("peak_memory_usage_mb"),
    averageMemoryUsageMb: (0, pg_core_1.integer)("average_memory_usage_mb"),
    allocatedCpuCores: (0, pg_core_1.decimal)("allocated_cpu_cores", { precision: 3, scale: 2 }),
    totalCpuTime: (0, pg_core_1.decimal)("total_cpu_time", { precision: 10, scale: 3 }), // CPU seconds
    wallClockTime: (0, pg_core_1.decimal)("wall_clock_time", { precision: 10, scale: 3 }), // Elapsed seconds
    diskSpaceUsedMb: (0, pg_core_1.integer)("disk_space_used_mb"),
    networkBytesTransferred: (0, pg_core_1.bigint)("network_bytes_transferred", { mode: "bigint" }),
    // Processing scope
    recordsInScope: (0, pg_core_1.integer)("records_in_scope"), // Total records this run should process
    startingOffset: (0, pg_core_1.integer)("starting_offset").default(0), // Starting position in dataset
    endingOffset: (0, pg_core_1.integer)("ending_offset"), // Ending position in dataset
    batchSize: (0, pg_core_1.integer)("batch_size"), // Records per batch
    batchesProcessed: (0, pg_core_1.integer)("batches_processed").default(0),
    // Processing results
    recordsProcessed: (0, pg_core_1.integer)("records_processed").default(0),
    recordsSuccessful: (0, pg_core_1.integer)("records_successful").default(0),
    recordsFailed: (0, pg_core_1.integer)("records_failed").default(0),
    recordsSkipped: (0, pg_core_1.integer)("records_skipped").default(0),
    recordsDuplicate: (0, pg_core_1.integer)("records_duplicate").default(0),
    entitiesCreated: (0, pg_core_1.integer)("entities_created").default(0),
    entitiesUpdated: (0, pg_core_1.integer)("entities_updated").default(0),
    entitiesMerged: (0, pg_core_1.integer)("entities_merged").default(0),
    aliasesCreated: (0, pg_core_1.integer)("aliases_created").default(0),
    traitsCreated: (0, pg_core_1.integer)("traits_created").default(0),
    interactionsCreated: (0, pg_core_1.integer)("interactions_created").default(0),
    // Performance metrics
    recordsPerSecond: (0, pg_core_1.decimal)("records_per_second", { precision: 8, scale: 2 }),
    averageRecordProcessingTime: (0, pg_core_1.decimal)("average_record_processing_time", { precision: 8, scale: 4 }), // Seconds
    minRecordProcessingTime: (0, pg_core_1.decimal)("min_record_processing_time", { precision: 8, scale: 4 }),
    maxRecordProcessingTime: (0, pg_core_1.decimal)("max_record_processing_time", { precision: 8, scale: 4 }),
    throughputMbPerSecond: (0, pg_core_1.decimal)("throughput_mb_per_second", { precision: 8, scale: 2 }),
    // Error and warning summary
    errorCount: (0, pg_core_1.integer)("error_count").default(0),
    warningCount: (0, pg_core_1.integer)("warning_count").default(0),
    criticalErrorCount: (0, pg_core_1.integer)("critical_error_count").default(0),
    errorRate: (0, pg_core_1.decimal)("error_rate", { precision: 8, scale: 4 }), // Errors per record
    primaryErrorType: (0, pg_core_1.text)("primary_error_type"), // Most common error type
    primaryErrorMessage: (0, pg_core_1.text)("primary_error_message"), // Most common error message
    // Status and completion
    status: (0, pg_core_1.text)("status").default("running"), // 'running', 'completed', 'failed', 'interrupted', 'killed'
    exitCode: (0, pg_core_1.integer)("exit_code"), // Process exit code
    exitReason: (0, pg_core_1.text)("exit_reason"), // Human readable exit reason
    wasInterrupted: (0, pg_core_1.boolean)("was_interrupted").default(false),
    wasRetried: (0, pg_core_1.boolean)("was_retried").default(false),
    retryCount: (0, pg_core_1.integer)("retry_count").default(0),
    // Quality assessment
    dataQualityScore: (0, pg_core_1.decimal)("data_quality_score", { precision: 3, scale: 2 }), // 0-1 overall quality
    successRate: (0, pg_core_1.decimal)("success_rate", { precision: 8, scale: 4 }), // Successful records / total records
    deduplicationAccuracy: (0, pg_core_1.decimal)("deduplication_accuracy", { precision: 3, scale: 2 }),
    normalizationAccuracy: (0, pg_core_1.decimal)("normalization_accuracy", { precision: 3, scale: 2 }),
    // Configuration snapshot
    configurationUsed: (0, pg_core_1.jsonb)("configuration_used"), // Configuration at time of run
    parametersUsed: (0, pg_core_1.jsonb)("parameters_used"), // Parameters passed to this run
    environmentVariables: (0, pg_core_1.jsonb)("environment_variables"), // Relevant env vars
    // Checkpointing and recovery
    lastCheckpoint: (0, pg_core_1.jsonb)("last_checkpoint"), // State for recovery
    checkpointInterval: (0, pg_core_1.integer)("checkpoint_interval_records").default(1000),
    checkpointsCreated: (0, pg_core_1.integer)("checkpoints_created").default(0),
    recoveredFromCheckpoint: (0, pg_core_1.boolean)("recovered_from_checkpoint").default(false),
    recoveryCheckpointId: (0, pg_core_1.text)("recovery_checkpoint_id"),
    // Output and artifacts
    outputSummary: (0, pg_core_1.jsonb)("output_summary"), // Summary of what was produced
    logFileLocation: (0, pg_core_1.text)("log_file_location"), // Where detailed logs are stored
    artifactLocations: (0, pg_core_1.text)("artifact_locations").array(), // Generated files, reports, etc.
    // Notifications and reporting
    notificationsSent: (0, pg_core_1.text)("notifications_sent").array(),
    reportsGenerated: (0, pg_core_1.text)("reports_generated").array(),
    // Timestamps
    startedAt: (0, pg_core_1.timestamp)("started_at").defaultNow(),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    lastHeartbeat: (0, pg_core_1.timestamp)("last_heartbeat"),
    lastCheckpointAt: (0, pg_core_1.timestamp)("last_checkpoint_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_ingestion_runs_job_id").on(table.jobId),
    (0, pg_core_1.index)("idx_ingestion_runs_run_number").on(table.runNumber),
    (0, pg_core_1.index)("idx_ingestion_runs_status").on(table.status),
    (0, pg_core_1.index)("idx_ingestion_runs_started_at").on(table.startedAt),
    (0, pg_core_1.index)("idx_ingestion_runs_worker_id").on(table.workerId),
    (0, pg_core_1.index)("idx_ingestion_runs_success_rate").on(table.successRate),
    (0, pg_core_1.index)("idx_ingestion_runs_records_per_second").on(table.recordsPerSecond),
    (0, pg_core_1.index)("idx_ingestion_runs_error_count").on(table.errorCount),
    (0, pg_core_1.index)("idx_ingestion_runs_parent_run").on(table.parentRunId),
    // Unique constraint to prevent duplicate run numbers for same job
    (0, pg_core_1.index)("idx_ingestion_runs_unique").on(table.jobId, table.runNumber),
]);
// Ingestion Errors - Error tracking for failed records with retry logic
exports.ingestionErrors = (0, pg_core_1.pgTable)("ingestion_errors", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Association with jobs and runs
    jobId: (0, pg_core_1.varchar)("job_id").notNull().references(() => exports.ingestionJobs.id),
    runId: (0, pg_core_1.varchar)("run_id").references(() => exports.ingestionRuns.id),
    stagingRecordId: (0, pg_core_1.varchar)("staging_record_id").references(() => exports.stagingRecords.id),
    // Error identification
    errorCode: (0, pg_core_1.text)("error_code"), // Standardized error code
    errorType: (0, pg_core_1.text)("error_type").notNull(), // 'validation', 'processing', 'database', 'network', 'format', 'business_logic'
    errorCategory: (0, pg_core_1.text)("error_category").notNull(), // 'critical', 'major', 'minor', 'warning', 'info'
    errorSeverity: (0, pg_core_1.integer)("error_severity").notNull(), // 1-10 severity scale
    // Error details
    errorMessage: (0, pg_core_1.text)("error_message").notNull(),
    detailedDescription: (0, pg_core_1.text)("detailed_description"),
    technicalDetails: (0, pg_core_1.jsonb)("technical_details"), // Stack traces, debug info
    errorContext: (0, pg_core_1.jsonb)("error_context"), // Context where error occurred
    // Record information
    recordData: (0, pg_core_1.jsonb)("record_data"), // The problematic record data
    recordIdentifier: (0, pg_core_1.text)("record_identifier"), // Unique identifier for the record
    recordLineNumber: (0, pg_core_1.integer)("record_line_number"), // Line in source file
    recordHash: (0, pg_core_1.text)("record_hash"), // Hash of record for deduplication
    fieldName: (0, pg_core_1.text)("field_name"), // Specific field that caused error
    fieldValue: (0, pg_core_1.text)("field_value"), // Value that caused error
    expectedFormat: (0, pg_core_1.text)("expected_format"), // What format was expected
    actualFormat: (0, pg_core_1.text)("actual_format"), // What format was received
    // Processing stage information
    processingStage: (0, pg_core_1.text)("processing_stage"), // 'parsing', 'validation', 'normalization', 'entity_creation', 'relationship_mapping'
    processingStep: (0, pg_core_1.text)("processing_step"), // Specific step within stage
    validationRule: (0, pg_core_1.text)("validation_rule"), // Which validation rule failed
    transformationRule: (0, pg_core_1.text)("transformation_rule"), // Which transformation failed
    // Error resolution
    isResolvable: (0, pg_core_1.boolean)("is_resolvable").default(true), // Whether this error can be fixed
    resolutionStrategy: (0, pg_core_1.text)("resolution_strategy"), // 'retry', 'skip', 'manual_fix', 'rule_update', 'data_correction'
    suggestedFix: (0, pg_core_1.text)("suggested_fix"), // Suggested resolution
    automatedFixAttempted: (0, pg_core_1.boolean)("automated_fix_attempted").default(false),
    automatedFixSucceeded: (0, pg_core_1.boolean)("automated_fix_succeeded").default(false),
    manualReviewRequired: (0, pg_core_1.boolean)("manual_review_required").default(false),
    // Retry logic
    retryable: (0, pg_core_1.boolean)("retryable").default(true),
    retryCount: (0, pg_core_1.integer)("retry_count").default(0),
    maxRetries: (0, pg_core_1.integer)("max_retries").default(3),
    nextRetryAt: (0, pg_core_1.timestamp)("next_retry_at"),
    retryBackoffMultiplier: (0, pg_core_1.decimal)("retry_backoff_multiplier", { precision: 3, scale: 2 }).default("2.00"),
    lastRetryAt: (0, pg_core_1.timestamp)("last_retry_at"),
    retryHistory: (0, pg_core_1.jsonb)("retry_history"), // History of retry attempts
    // Resolution tracking
    status: (0, pg_core_1.text)("status").default("unresolved"), // 'unresolved', 'investigating', 'fixing', 'resolved', 'ignored', 'escalated'
    resolvedAt: (0, pg_core_1.timestamp)("resolved_at"),
    resolvedBy: (0, pg_core_1.varchar)("resolved_by").references(() => exports.users.id),
    resolutionMethod: (0, pg_core_1.text)("resolution_method"), // How the error was resolved
    resolutionNotes: (0, pg_core_1.text)("resolution_notes"),
    resolutionChanges: (0, pg_core_1.jsonb)("resolution_changes"), // What changes were made to resolve
    // Impact assessment
    impactLevel: (0, pg_core_1.text)("impact_level"), // 'none', 'low', 'medium', 'high', 'critical'
    affectedEntities: (0, pg_core_1.text)("affected_entities").array(), // Entity IDs that might be affected
    downstreamImpact: (0, pg_core_1.text)("downstream_impact"), // Description of downstream effects
    businessImpact: (0, pg_core_1.text)("business_impact"), // Business consequences
    // Pattern recognition
    errorPattern: (0, pg_core_1.text)("error_pattern"), // Pattern this error fits
    isKnownIssue: (0, pg_core_1.boolean)("is_known_issue").default(false),
    knowledgeBaseArticle: (0, pg_core_1.text)("knowledge_base_article"), // Link to KB article
    relatedErrors: (0, pg_core_1.text)("related_errors").array(), // IDs of related error records
    // Notification and escalation
    notificationsSent: (0, pg_core_1.text)("notifications_sent").array(),
    escalationLevel: (0, pg_core_1.integer)("escalation_level").default(0), // 0=none, 1=team_lead, 2=manager, 3=director
    escalatedAt: (0, pg_core_1.timestamp)("escalated_at"),
    escalatedTo: (0, pg_core_1.varchar)("escalated_to").references(() => exports.users.id),
    alertsTriggered: (0, pg_core_1.text)("alerts_triggered").array(),
    // Analytics and reporting
    errorFrequency: (0, pg_core_1.decimal)("error_frequency", { precision: 8, scale: 4 }), // How often this error occurs
    firstOccurrence: (0, pg_core_1.timestamp)("first_occurrence"),
    lastOccurrence: (0, pg_core_1.timestamp)("last_occurrence"),
    occurrenceCount: (0, pg_core_1.integer)("occurrence_count").default(1),
    trendDirection: (0, pg_core_1.text)("trend_direction"), // 'increasing', 'decreasing', 'stable'
    // Metadata
    tags: (0, pg_core_1.text)("tags").array(),
    customProperties: (0, pg_core_1.jsonb)("custom_properties"), // Extensible properties
    attachments: (0, pg_core_1.text)("attachments").array(), // File attachments with error details
    // System information
    systemInfo: (0, pg_core_1.jsonb)("system_info"), // System state when error occurred
    environmentInfo: (0, pg_core_1.jsonb)("environment_info"), // Environment details
    configurationInfo: (0, pg_core_1.jsonb)("configuration_info"), // Configuration at time of error
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    acknowledgedAt: (0, pg_core_1.timestamp)("acknowledged_at"),
}, (table) => [
    (0, pg_core_1.index)("idx_ingestion_errors_job_id").on(table.jobId),
    (0, pg_core_1.index)("idx_ingestion_errors_run_id").on(table.runId),
    (0, pg_core_1.index)("idx_ingestion_errors_staging_record").on(table.stagingRecordId),
    (0, pg_core_1.index)("idx_ingestion_errors_type").on(table.errorType),
    (0, pg_core_1.index)("idx_ingestion_errors_category").on(table.errorCategory),
    (0, pg_core_1.index)("idx_ingestion_errors_severity").on(table.errorSeverity),
    (0, pg_core_1.index)("idx_ingestion_errors_status").on(table.status),
    (0, pg_core_1.index)("idx_ingestion_errors_retryable").on(table.retryable),
    (0, pg_core_1.index)("idx_ingestion_errors_next_retry").on(table.nextRetryAt),
    (0, pg_core_1.index)("idx_ingestion_errors_resolved_at").on(table.resolvedAt),
    (0, pg_core_1.index)("idx_ingestion_errors_escalation_level").on(table.escalationLevel),
    (0, pg_core_1.index)("idx_ingestion_errors_impact_level").on(table.impactLevel),
    (0, pg_core_1.index)("idx_ingestion_errors_occurrence_count").on(table.occurrenceCount),
    (0, pg_core_1.index)("idx_ingestion_errors_record_hash").on(table.recordHash),
]);
// ============================================================================
// VISUAL STORYTELLING TABLES - Narrative Timelines and Story Beats
// ============================================================================
// Narrative Timelines - Story arcs and events tied to trading houses
exports.narrativeTimelines = (0, pg_core_1.pgTable)("narrative_timelines", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Timeline identification
    timelineName: (0, pg_core_1.text)("timeline_name").notNull(),
    timelineType: (0, pg_core_1.text)("timeline_type").notNull(), // 'character_arc', 'team_story', 'event_series', 'crossover', 'universe_history'
    scope: (0, pg_core_1.text)("scope").notNull(), // 'character', 'team', 'universe', 'multiverse', 'crossover'
    universe: (0, pg_core_1.text)("universe").notNull(), // 'marvel', 'dc', 'image', 'crossover'
    continuity: (0, pg_core_1.text)("continuity"), // 'main', 'ultimate', 'earth_2', 'elseworld'
    // Timeline structure
    startDate: (0, pg_core_1.text)("start_date"), // In-universe start date
    endDate: (0, pg_core_1.text)("end_date"), // In-universe end date (null for ongoing)
    timelineStatus: (0, pg_core_1.text)("timeline_status").default("active"), // 'active', 'completed', 'retconned', 'alternate'
    timelineEra: (0, pg_core_1.text)("timeline_era"), // 'golden_age', 'silver_age', 'bronze_age', 'modern_age'
    chronologicalOrder: (0, pg_core_1.integer)("chronological_order"), // Order relative to other timelines
    // Core participants
    primaryEntities: (0, pg_core_1.text)("primary_entities").array(), // Main narrative entity IDs
    secondaryEntities: (0, pg_core_1.text)("secondary_entities").array(), // Supporting entity IDs
    featuredTeams: (0, pg_core_1.text)("featured_teams").array(), // Teams involved
    majorVillains: (0, pg_core_1.text)("major_villains").array(), // Primary antagonists
    keyCreators: (0, pg_core_1.text)("key_creators").array(), // Writers and artists who shaped this timeline
    // Trading house associations
    associatedHouses: (0, pg_core_1.text)("associated_houses").array(), // 'heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit'
    primaryHouse: (0, pg_core_1.text)("primary_house"), // Main house this timeline appeals to
    houseRelevanceScore: (0, pg_core_1.decimal)("house_relevance_score", { precision: 3, scale: 2 }), // 0-1 relevance to houses
    tradingEducationValue: (0, pg_core_1.decimal)("trading_education_value", { precision: 3, scale: 2 }), // 0-1 educational value for traders
    // Market impact potential
    marketInfluence: (0, pg_core_1.decimal)("market_influence", { precision: 3, scale: 2 }), // 0-1 potential to affect asset prices
    volatilityPotential: (0, pg_core_1.decimal)("volatility_potential", { precision: 3, scale: 2 }), // 0-1 potential to create price volatility
    speculativeValue: (0, pg_core_1.decimal)("speculative_value", { precision: 3, scale: 2 }), // 0-1 value for speculation
    longTermImpact: (0, pg_core_1.decimal)("long_term_impact", { precision: 3, scale: 2 }), // 0-1 lasting effect on character values
    // Narrative structure
    totalStoryBeats: (0, pg_core_1.integer)("total_story_beats").default(0),
    completedStoryBeats: (0, pg_core_1.integer)("completed_story_beats").default(0),
    criticalStoryBeats: (0, pg_core_1.integer)("critical_story_beats").default(0), // How many beats are market-critical
    plotComplexity: (0, pg_core_1.decimal)("plot_complexity", { precision: 3, scale: 2 }), // 0-1 complexity score
    characterDevelopmentDepth: (0, pg_core_1.decimal)("character_development_depth", { precision: 3, scale: 2 }), // 0-1 development depth
    // Themes and motifs
    primaryThemes: (0, pg_core_1.text)("primary_themes").array(), // 'redemption', 'power_corruption', 'sacrifice', 'identity'
    moralAlignment: (0, pg_core_1.text)("moral_alignment"), // 'heroic', 'dark', 'gray', 'villainous', 'neutral'
    emotionalTone: (0, pg_core_1.text)("emotional_tone"), // 'hopeful', 'tragic', 'action', 'mystery', 'horror', 'comedy'
    narrativeGenre: (0, pg_core_1.text)("narrative_genre").array(), // 'superhero', 'sci_fi', 'fantasy', 'mystery', 'horror'
    // Cultural and social context
    culturalSignificance: (0, pg_core_1.decimal)("cultural_significance", { precision: 3, scale: 2 }), // 0-1 cultural importance
    socialCommentary: (0, pg_core_1.text)("social_commentary").array(), // Social issues addressed
    historicalContext: (0, pg_core_1.text)("historical_context"), // Real-world events that influenced this timeline
    // Publication information
    firstPublicationDate: (0, pg_core_1.text)("first_publication_date"),
    lastPublicationDate: (0, pg_core_1.text)("last_publication_date"),
    publicationStatus: (0, pg_core_1.text)("publication_status").default("ongoing"), // 'ongoing', 'completed', 'cancelled', 'hiatus'
    publishedIssueCount: (0, pg_core_1.integer)("published_issue_count").default(0),
    plannedIssueCount: (0, pg_core_1.integer)("planned_issue_count"),
    // Media adaptations
    adaptedToMedia: (0, pg_core_1.text)("adapted_to_media").array(), // 'movies', 'tv', 'games', 'novels'
    adaptationQuality: (0, pg_core_1.decimal)("adaptation_quality", { precision: 3, scale: 2 }), // 0-1 quality of adaptations
    adaptationFidelity: (0, pg_core_1.decimal)("adaptation_fidelity", { precision: 3, scale: 2 }), // 0-1 faithfulness to source
    crossMediaImpact: (0, pg_core_1.decimal)("cross_media_impact", { precision: 3, scale: 2 }), // 0-1 impact on other media
    // Fan engagement and community
    fanEngagementLevel: (0, pg_core_1.decimal)("fan_engagement_level", { precision: 3, scale: 2 }), // 0-1 fan community engagement
    controversyLevel: (0, pg_core_1.decimal)("controversy_level", { precision: 3, scale: 2 }), // 0-1 how controversial the timeline is
    criticalReception: (0, pg_core_1.decimal)("critical_reception", { precision: 3, scale: 2 }), // 0-1 critical acclaim
    commercialSuccess: (0, pg_core_1.decimal)("commercial_success", { precision: 3, scale: 2 }), // 0-1 commercial performance
    // Educational and analytical value
    characterStudyValue: (0, pg_core_1.decimal)("character_study_value", { precision: 3, scale: 2 }), // 0-1 value for character analysis
    plotAnalysisValue: (0, pg_core_1.decimal)("plot_analysis_value", { precision: 3, scale: 2 }), // 0-1 value for plot analysis
    thematicDepth: (0, pg_core_1.decimal)("thematic_depth", { precision: 3, scale: 2 }), // 0-1 thematic complexity
    marketLessonValue: (0, pg_core_1.decimal)("market_lesson_value", { precision: 3, scale: 2 }), // 0-1 value for trading education
    // Metadata and relationships
    parentTimelines: (0, pg_core_1.text)("parent_timelines").array(), // Timeline IDs this derives from
    childTimelines: (0, pg_core_1.text)("child_timelines").array(), // Timeline IDs that derive from this
    crossoverTimelines: (0, pg_core_1.text)("crossover_timelines").array(), // Timelines this crosses over with
    relatedAssets: (0, pg_core_1.text)("related_assets").array(), // Asset IDs affected by this timeline
    // Content description
    synopsis: (0, pg_core_1.text)("synopsis"), // Brief summary
    detailedDescription: (0, pg_core_1.text)("detailed_description"), // Comprehensive description
    keyPlotPoints: (0, pg_core_1.text)("key_plot_points").array(), // Major plot developments
    characterArcs: (0, pg_core_1.jsonb)("character_arcs"), // Character development summaries
    thematicAnalysis: (0, pg_core_1.text)("thematic_analysis"), // Analysis of themes and meanings
    // Visual and multimedia
    keyImageUrls: (0, pg_core_1.text)("key_image_urls").array(), // Important visual moments
    iconicPanels: (0, pg_core_1.text)("iconic_panels").array(), // URLs to iconic comic panels
    coverGallery: (0, pg_core_1.text)("cover_gallery").array(), // Cover images from this timeline
    videoContent: (0, pg_core_1.text)("video_content").array(), // Related video content
    // Data quality and curation
    curationStatus: (0, pg_core_1.text)("curation_status").default("draft"), // 'draft', 'review', 'approved', 'featured'
    curatedBy: (0, pg_core_1.varchar)("curated_by").references(() => exports.users.id),
    qualityScore: (0, pg_core_1.decimal)("quality_score", { precision: 3, scale: 2 }), // 0-1 overall quality assessment
    completenessScore: (0, pg_core_1.decimal)("completeness_score", { precision: 3, scale: 2 }), // 0-1 data completeness
    accuracyScore: (0, pg_core_1.decimal)("accuracy_score", { precision: 3, scale: 2 }), // 0-1 factual accuracy
    // Vector embeddings for timeline similarity and recommendations
    timelineEmbedding: (0, pg_core_1.vector)("timeline_embedding", { dimensions: 1536 }),
    themeEmbedding: (0, pg_core_1.vector)("theme_embedding", { dimensions: 1536 }), // Thematic content vector
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    curatedAt: (0, pg_core_1.timestamp)("curated_at"),
    lastReviewedAt: (0, pg_core_1.timestamp)("last_reviewed_at"),
}, (table) => [
    (0, pg_core_1.index)("idx_narrative_timelines_type").on(table.timelineType),
    (0, pg_core_1.index)("idx_narrative_timelines_universe").on(table.universe),
    (0, pg_core_1.index)("idx_narrative_timelines_status").on(table.timelineStatus),
    (0, pg_core_1.index)("idx_narrative_timelines_primary_house").on(table.primaryHouse),
    (0, pg_core_1.index)("idx_narrative_timelines_market_influence").on(table.marketInfluence),
    (0, pg_core_1.index)("idx_narrative_timelines_cultural_significance").on(table.culturalSignificance),
    (0, pg_core_1.index)("idx_narrative_timelines_curation_status").on(table.curationStatus),
    (0, pg_core_1.index)("idx_narrative_timelines_quality_score").on(table.qualityScore),
    (0, pg_core_1.index)("idx_narrative_timelines_chronological_order").on(table.chronologicalOrder),
]);
// Story Beats - Key narrative moments that affect market sentiment
exports.storyBeats = (0, pg_core_1.pgTable)("story_beats", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Timeline association
    timelineId: (0, pg_core_1.varchar)("timeline_id").notNull().references(() => exports.narrativeTimelines.id),
    // Beat identification
    beatTitle: (0, pg_core_1.text)("beat_title").notNull(),
    beatType: (0, pg_core_1.text)("beat_type").notNull(), // 'introduction', 'inciting_incident', 'rising_action', 'climax', 'falling_action', 'resolution', 'plot_twist', 'character_death', 'power_revelation'
    beatCategory: (0, pg_core_1.text)("beat_category").notNull(), // 'character_moment', 'action_sequence', 'emotional_moment', 'revelation', 'confrontation', 'transformation', 'sacrifice'
    narrativeFunction: (0, pg_core_1.text)("narrative_function"), // 'exposition', 'conflict', 'development', 'payoff', 'setup', 'callback'
    // Position and timing
    chronologicalOrder: (0, pg_core_1.integer)("chronological_order").notNull(), // Order within timeline
    relativePosition: (0, pg_core_1.decimal)("relative_position", { precision: 5, scale: 4 }), // 0-1 position in timeline (0=start, 1=end)
    storyAct: (0, pg_core_1.integer)("story_act"), // 1, 2, 3, etc. (traditional story structure)
    // Publication details
    sourceIssue: (0, pg_core_1.text)("source_issue"), // Comic issue where this beat occurs
    sourceMedia: (0, pg_core_1.text)("source_media"), // Movie, TV episode, etc.
    pageNumber: (0, pg_core_1.integer)("page_number"), // Page within issue
    panelNumber: (0, pg_core_1.integer)("panel_number"), // Panel within page
    publicationDate: (0, pg_core_1.text)("publication_date"),
    writerCredits: (0, pg_core_1.text)("writer_credits").array(),
    artistCredits: (0, pg_core_1.text)("artist_credits").array(),
    // Participants and entities
    primaryEntities: (0, pg_core_1.text)("primary_entities").array(), // Main entities involved in this beat
    secondaryEntities: (0, pg_core_1.text)("secondary_entities").array(), // Supporting entities
    entityRoles: (0, pg_core_1.jsonb)("entity_roles"), // Specific roles each entity plays in this beat
    relationships: (0, pg_core_1.jsonb)("relationships"), // Relationships formed, broken, or changed
    // Market impact assessment
    marketRelevance: (0, pg_core_1.decimal)("market_relevance", { precision: 3, scale: 2 }), // 0-1 relevance to trading
    priceImpactPotential: (0, pg_core_1.decimal)("price_impact_potential", { precision: 3, scale: 2 }), // 0-1 potential to affect prices
    volatilityTrigger: (0, pg_core_1.boolean)("volatility_trigger").default(false), // Whether this creates market volatility
    speculationOpportunity: (0, pg_core_1.decimal)("speculation_opportunity", { precision: 3, scale: 2 }), // 0-1 speculation potential
    longTermValueImpact: (0, pg_core_1.decimal)("long_term_value_impact", { precision: 3, scale: 2 }), // 0-1 lasting effect on values
    affectedAssets: (0, pg_core_1.text)("affected_assets").array(), // Asset IDs likely to be impacted
    expectedPriceDirection: (0, pg_core_1.text)("expected_price_direction"), // 'positive', 'negative', 'volatile', 'neutral'
    impactMagnitude: (0, pg_core_1.decimal)("impact_magnitude", { precision: 3, scale: 2 }), // 0-1 expected magnitude of impact
    // Trading house relevance
    houseResonance: (0, pg_core_1.jsonb)("house_resonance"), // How much each house cares about this beat
    primaryHouse: (0, pg_core_1.text)("primary_house"), // House most interested in this beat
    educationalValue: (0, pg_core_1.decimal)("educational_value", { precision: 3, scale: 2 }), // 0-1 teaching value for traders
    strategicInsight: (0, pg_core_1.text)("strategic_insight"), // Trading insight this beat provides
    // Emotional and thematic content
    emotionalTone: (0, pg_core_1.text)("emotional_tone"), // 'triumph', 'tragedy', 'suspense', 'horror', 'comedy', 'wonder'
    emotionalIntensity: (0, pg_core_1.decimal)("emotional_intensity", { precision: 3, scale: 2 }), // 0-1 emotional impact
    thematicSignificance: (0, pg_core_1.text)("thematic_significance").array(), // Themes this beat reinforces
    symbolism: (0, pg_core_1.text)("symbolism").array(), // Symbolic elements present
    archetypes: (0, pg_core_1.text)("archetypes").array(), // Character archetypes involved
    // Character development impact
    characterGrowth: (0, pg_core_1.jsonb)("character_growth"), // How characters change in this beat
    powerChanges: (0, pg_core_1.jsonb)("power_changes"), // Power gains, losses, or revelations
    relationshipChanges: (0, pg_core_1.jsonb)("relationship_changes"), // Relationship developments
    statusChanges: (0, pg_core_1.jsonb)("status_changes"), // Status quo changes
    // Plot significance
    plotSignificance: (0, pg_core_1.decimal)("plot_significance", { precision: 3, scale: 2 }), // 0-1 importance to overall plot
    isClimax: (0, pg_core_1.boolean)("is_climax").default(false), // Whether this is a climactic moment
    isTurningPoint: (0, pg_core_1.boolean)("is_turning_point").default(false), // Whether this changes everything
    setsUpFuture: (0, pg_core_1.boolean)("sets_up_future").default(false), // Whether this sets up future beats
    paysOffSetup: (0, pg_core_1.boolean)("pays_off_setup").default(false), // Whether this pays off previous setup
    callbacks: (0, pg_core_1.text)("callbacks").array(), // Previous beat IDs this references
    setupForBeats: (0, pg_core_1.text)("setup_for_beats").array(), // Future beat IDs this sets up
    // Cultural and fan impact
    iconicStatus: (0, pg_core_1.boolean)("iconic_status").default(false), // Whether this is considered iconic
    memesGenerated: (0, pg_core_1.boolean)("memes_generated").default(false), // Whether this spawned memes
    fanReaction: (0, pg_core_1.text)("fan_reaction"), // 'loved', 'hated', 'controversial', 'mixed', 'ignored'
    criticalReception: (0, pg_core_1.text)("critical_reception"), // Critical response to this beat
    culturalReference: (0, pg_core_1.boolean)("cultural_reference").default(false), // Whether this became a cultural reference
    // Content description
    summary: (0, pg_core_1.text)("summary").notNull(), // Brief description of what happens
    detailedDescription: (0, pg_core_1.text)("detailed_description"), // Comprehensive description
    dialogue: (0, pg_core_1.text)("dialogue").array(), // Key dialogue from this beat
    visualDescription: (0, pg_core_1.text)("visual_description"), // Description of visual elements
    actionSequence: (0, pg_core_1.text)("action_sequence"), // Description of action if applicable
    // Stakes and consequences
    stakesLevel: (0, pg_core_1.text)("stakes_level"), // 'personal', 'local', 'global', 'universal', 'multiversal'
    consequences: (0, pg_core_1.text)("consequences").array(), // Immediate consequences of this beat
    permanentChanges: (0, pg_core_1.text)("permanent_changes").array(), // Permanent changes made
    reversibleChanges: (0, pg_core_1.text)("reversible_changes").array(), // Changes that could be undone
    // Visual and multimedia references
    imageUrls: (0, pg_core_1.text)("image_urls").array(), // Images of this story beat
    panelImages: (0, pg_core_1.text)("panel_images").array(), // Specific comic panels
    videoClips: (0, pg_core_1.text)("video_clips").array(), // Video adaptations of this beat
    audioReferences: (0, pg_core_1.text)("audio_references").array(), // Audio drama or podcast references
    // Quality and curation
    beatQuality: (0, pg_core_1.decimal)("beat_quality", { precision: 3, scale: 2 }), // 0-1 quality assessment
    narrativeImportance: (0, pg_core_1.decimal)("narrative_importance", { precision: 3, scale: 2 }), // 0-1 importance to story
    executionQuality: (0, pg_core_1.decimal)("execution_quality", { precision: 3, scale: 2 }), // 0-1 how well it was executed
    originalityScore: (0, pg_core_1.decimal)("originality_score", { precision: 3, scale: 2 }), // 0-1 how original this beat is
    // Metadata
    tags: (0, pg_core_1.text)("tags").array(), // Searchable tags
    keywords: (0, pg_core_1.text)("keywords").array(), // Keywords for discovery
    spoilerLevel: (0, pg_core_1.text)("spoiler_level").default("minor"), // 'none', 'minor', 'major', 'critical'
    contentWarnings: (0, pg_core_1.text)("content_warnings").array(), // Content warnings if applicable
    // Vector embeddings for beat similarity and clustering
    beatEmbedding: (0, pg_core_1.vector)("beat_embedding", { dimensions: 1536 }),
    dialogueEmbedding: (0, pg_core_1.vector)("dialogue_embedding", { dimensions: 1536 }), // Vector for dialogue content
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    curatedAt: (0, pg_core_1.timestamp)("curated_at"),
}, (table) => [
    (0, pg_core_1.index)("idx_story_beats_timeline_id").on(table.timelineId),
    (0, pg_core_1.index)("idx_story_beats_chronological_order").on(table.chronologicalOrder),
    (0, pg_core_1.index)("idx_story_beats_type").on(table.beatType),
    (0, pg_core_1.index)("idx_story_beats_category").on(table.beatCategory),
    (0, pg_core_1.index)("idx_story_beats_market_relevance").on(table.marketRelevance),
    (0, pg_core_1.index)("idx_story_beats_price_impact").on(table.priceImpactPotential),
    (0, pg_core_1.index)("idx_story_beats_volatility_trigger").on(table.volatilityTrigger),
    (0, pg_core_1.index)("idx_story_beats_primary_house").on(table.primaryHouse),
    (0, pg_core_1.index)("idx_story_beats_plot_significance").on(table.plotSignificance),
    (0, pg_core_1.index)("idx_story_beats_iconic_status").on(table.iconicStatus),
    (0, pg_core_1.index)("idx_story_beats_relative_position").on(table.relativePosition),
    // Unique constraint to prevent duplicate beats at same position in timeline
    (0, pg_core_1.index)("idx_story_beats_unique_position").on(table.timelineId, table.chronologicalOrder),
]);
// ============================================================================
// PHASE 2: INSERT SCHEMAS AND TYPESCRIPT TYPES
// ============================================================================
// Insert schemas for Phase 2 Staging Tables
exports.insertRawDatasetFileSchema = (0, drizzle_zod_1.createInsertSchema)(exports.rawDatasetFiles).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    uploadedAt: true,
    processingStartedAt: true,
    processingCompletedAt: true,
});
exports.insertStagingRecordSchema = (0, drizzle_zod_1.createInsertSchema)(exports.stagingRecords).omit({
    id: true,
    createdAt: true,
    processedAt: true,
    normalizedAt: true,
});
// Insert schemas for Phase 2 Canonical Entity Extensions
exports.insertNarrativeEntitySchema = (0, drizzle_zod_1.createInsertSchema)(exports.narrativeEntities).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    lastVerifiedAt: true,
});
exports.insertNarrativeTraitSchema = (0, drizzle_zod_1.createInsertSchema)(exports.narrativeTraits).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    lastVerifiedAt: true,
});
exports.insertComicCoverSchema = (0, drizzle_zod_1.createInsertSchema)(exports.comicCovers).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertEntityAliasSchema = (0, drizzle_zod_1.createInsertSchema)(exports.entityAliases).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    lastVerifiedAt: true,
});
// Insert schemas for Phase 2 Relationship Tables
exports.insertEntityInteractionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.entityInteractions).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    lastVerifiedAt: true,
});
exports.insertMediaPerformanceMetricSchema = (0, drizzle_zod_1.createInsertSchema)(exports.mediaPerformanceMetrics).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    lastVerifiedAt: true,
    lastDataUpdate: true,
});
// Insert schemas for Phase 2 Ingestion Control Tables
exports.insertIngestionJobSchema = (0, drizzle_zod_1.createInsertSchema)(exports.ingestionJobs).omit({
    id: true,
    queuedAt: true,
    startedAt: true,
    completedAt: true,
    lastHeartbeat: true,
    estimatedCompletionTime: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertIngestionRunSchema = (0, drizzle_zod_1.createInsertSchema)(exports.ingestionRuns).omit({
    id: true,
    startedAt: true,
    completedAt: true,
    lastHeartbeat: true,
    lastCheckpointAt: true,
    createdAt: true,
});
exports.insertIngestionErrorSchema = (0, drizzle_zod_1.createInsertSchema)(exports.ingestionErrors).omit({
    id: true,
    nextRetryAt: true,
    lastRetryAt: true,
    resolvedAt: true,
    escalatedAt: true,
    firstOccurrence: true,
    lastOccurrence: true,
    createdAt: true,
    updatedAt: true,
    acknowledgedAt: true,
});
// Insert schemas for Phase 2 Visual Storytelling Tables
exports.insertNarrativeTimelineSchema = (0, drizzle_zod_1.createInsertSchema)(exports.narrativeTimelines).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    curatedAt: true,
    lastReviewedAt: true,
});
exports.insertStoryBeatSchema = (0, drizzle_zod_1.createInsertSchema)(exports.storyBeats).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    curatedAt: true,
});
// ========================================================================================
// PHASE 2: NARRATIVE TRADING METRICS INTEGRATION TABLES
// ========================================================================================
// Narrative Trading Metrics - Core metrics connecting story data to financial behavior
exports.narrativeTradingMetrics = (0, pg_core_1.pgTable)("narrative_trading_metrics", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    // Mythic Volatility Metrics
    mythicVolatilityScore: (0, pg_core_1.decimal)("mythic_volatility_score", { precision: 8, scale: 4 }).notNull(), // 0.0001 to 10.0000
    baseVolatility: (0, pg_core_1.decimal)("base_volatility", { precision: 8, scale: 4 }).default("0.0250"), // Base daily volatility
    storyArcVolatilityMultiplier: (0, pg_core_1.decimal)("story_arc_volatility_multiplier", { precision: 8, scale: 4 }).default("1.0000"),
    powerLevelVolatilityFactor: (0, pg_core_1.decimal)("power_level_volatility_factor", { precision: 8, scale: 4 }).default("1.0000"),
    cosmicEventVolatilityBoost: (0, pg_core_1.decimal)("cosmic_event_volatility_boost", { precision: 8, scale: 4 }).default("0.0000"),
    // Narrative Momentum Tracking
    narrativeMomentumScore: (0, pg_core_1.decimal)("narrative_momentum_score", { precision: 8, scale: 4 }).notNull(), // -5.0000 to 5.0000
    culturalImpactIndex: (0, pg_core_1.decimal)("cultural_impact_index", { precision: 8, scale: 4 }).default("1.0000"),
    storyProgressionRate: (0, pg_core_1.decimal)("story_progression_rate", { precision: 8, scale: 4 }).default("0.0000"),
    themeRelevanceScore: (0, pg_core_1.decimal)("theme_relevance_score", { precision: 8, scale: 4 }).default("1.0000"),
    mediaBoostFactor: (0, pg_core_1.decimal)("media_boost_factor", { precision: 8, scale: 4 }).default("1.0000"),
    momentumDecayRate: (0, pg_core_1.decimal)("momentum_decay_rate", { precision: 8, scale: 4 }).default("0.0500"),
    // House-Based Financial Modifiers
    houseAffiliation: (0, pg_core_1.text)("house_affiliation"), // 'heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit'
    houseVolatilityProfile: (0, pg_core_1.text)("house_volatility_profile"), // 'stable', 'moderate', 'high', 'extreme', 'chaotic'
    houseTradingMultiplier: (0, pg_core_1.decimal)("house_trading_multiplier", { precision: 8, scale: 4 }).default("1.0000"),
    houseSpecialtyBonus: (0, pg_core_1.decimal)("house_specialty_bonus", { precision: 8, scale: 4 }).default("0.0000"),
    // Narrative Correlation Factors
    narrativeCorrelationStrength: (0, pg_core_1.decimal)("narrative_correlation_strength", { precision: 8, scale: 4 }).default("1.0000"),
    storyBeatSensitivity: (0, pg_core_1.decimal)("story_beat_sensitivity", { precision: 8, scale: 4 }).default("1.0000"),
    characterDeathImpact: (0, pg_core_1.decimal)("character_death_impact", { precision: 8, scale: 4 }).default("0.0000"),
    powerUpgradeImpact: (0, pg_core_1.decimal)("power_upgrade_impact", { precision: 8, scale: 4 }).default("0.0000"),
    resurrectionImpact: (0, pg_core_1.decimal)("resurrection_impact", { precision: 8, scale: 4 }).default("0.0000"),
    // Enhanced Margin and Risk Calculations
    narrativeMarginRequirement: (0, pg_core_1.decimal)("narrative_margin_requirement", { precision: 8, scale: 2 }).default("50.00"),
    storyRiskAdjustment: (0, pg_core_1.decimal)("story_risk_adjustment", { precision: 8, scale: 4 }).default("0.0000"),
    volatilityRiskPremium: (0, pg_core_1.decimal)("volatility_risk_premium", { precision: 8, scale: 4 }).default("0.0000"),
    // Temporal Factors
    lastNarrativeEvent: (0, pg_core_1.timestamp)("last_narrative_event"),
    nextPredictedEvent: (0, pg_core_1.timestamp)("next_predicted_event"),
    storyArcPhase: (0, pg_core_1.text)("story_arc_phase"), // 'origin', 'rising_action', 'climax', 'falling_action', 'resolution'
    seasonalNarrativePattern: (0, pg_core_1.text)("seasonal_narrative_pattern"), // JSON array of seasonal multipliers
    // Performance Tracking
    metricsReliabilityScore: (0, pg_core_1.decimal)("metrics_reliability_score", { precision: 8, scale: 4 }).default("0.5000"),
    predictionAccuracy: (0, pg_core_1.decimal)("prediction_accuracy", { precision: 8, scale: 4 }).default("0.0000"),
    lastRecalculation: (0, pg_core_1.timestamp)("last_recalculation").defaultNow(),
    calculationVersion: (0, pg_core_1.integer)("calculation_version").default(1),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// House Financial Profiles - Seven Houses trading characteristics and specializations
exports.houseFinancialProfiles = (0, pg_core_1.pgTable)("house_financial_profiles", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    houseId: (0, pg_core_1.text)("house_id").notNull().unique(), // 'heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit'
    houseName: (0, pg_core_1.text)("house_name").notNull(),
    // Trading Characteristics
    volatilityProfile: (0, pg_core_1.text)("volatility_profile").notNull(), // 'stable', 'moderate', 'high', 'extreme', 'chaotic'
    baseVolatilityMultiplier: (0, pg_core_1.decimal)("base_volatility_multiplier", { precision: 8, scale: 4 }).notNull(),
    trendStrengthModifier: (0, pg_core_1.decimal)("trend_strength_modifier", { precision: 8, scale: 4 }).default("1.0000"),
    meanReversionFactor: (0, pg_core_1.decimal)("mean_reversion_factor", { precision: 8, scale: 4 }).default("0.1000"),
    // House-Specific Market Patterns
    marketPatternType: (0, pg_core_1.text)("market_pattern_type").notNull(), // 'heroic_growth', 'wisdom_stability', 'power_volatility', etc.
    seasonalityPattern: (0, pg_core_1.jsonb)("seasonality_pattern"), // Quarterly/seasonal trading patterns
    eventResponseProfile: (0, pg_core_1.jsonb)("event_response_profile"), // How house responds to different story events
    // Specialized Trading Behaviors
    preferredInstruments: (0, pg_core_1.text)("preferred_instruments").array(), // ['equity', 'options', 'bonds', etc.]
    riskToleranceLevel: (0, pg_core_1.text)("risk_tolerance_level").notNull(), // 'conservative', 'moderate', 'aggressive', 'extreme'
    leveragePreference: (0, pg_core_1.decimal)("leverage_preference", { precision: 8, scale: 4 }).default("1.0000"),
    // Narrative-Driven Factors
    storyBeatMultipliers: (0, pg_core_1.jsonb)("story_beat_multipliers"), // Response to different story beat types
    characterPowerLevelWeights: (0, pg_core_1.jsonb)("character_power_level_weights"), // How power levels affect trading
    cosmicEventSensitivity: (0, pg_core_1.decimal)("cosmic_event_sensitivity", { precision: 8, scale: 4 }).default("1.0000"),
    // House Trading Bonuses and Penalties
    specialtyAssetTypes: (0, pg_core_1.text)("specialty_asset_types").array(), // Asset types this house excels with
    weaknessAssetTypes: (0, pg_core_1.text)("weakness_asset_types").array(), // Asset types this house struggles with
    tradingBonusPercentage: (0, pg_core_1.decimal)("trading_bonus_percentage", { precision: 8, scale: 4 }).default("0.0000"),
    penaltyPercentage: (0, pg_core_1.decimal)("penalty_percentage", { precision: 8, scale: 4 }).default("0.0000"),
    // Advanced House Mechanics
    alignmentRequirements: (0, pg_core_1.jsonb)("alignment_requirements"), // Karmic alignment requirements
    synergisticHouses: (0, pg_core_1.text)("synergistic_houses").array(), // Houses that work well together
    conflictingHouses: (0, pg_core_1.text)("conflicting_houses").array(), // Houses that create market tension
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Story Event Triggers - Connect narrative events to market movements
exports.storyEventTriggers = (0, pg_core_1.pgTable)("story_event_triggers", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Event Identification
    triggerName: (0, pg_core_1.text)("trigger_name").notNull(),
    triggerType: (0, pg_core_1.text)("trigger_type").notNull(), // 'story_beat', 'character_event', 'cosmic_event', 'media_release'
    eventSeverity: (0, pg_core_1.text)("event_severity").notNull(), // 'minor', 'moderate', 'major', 'cosmic', 'universe_altering'
    // Source References
    storyBeatId: (0, pg_core_1.varchar)("story_beat_id").references(() => exports.storyBeats.id),
    characterId: (0, pg_core_1.varchar)("character_id").references(() => exports.enhancedCharacters.id),
    timelineId: (0, pg_core_1.varchar)("timeline_id").references(() => exports.narrativeTimelines.id),
    // Market Impact Configuration
    priceImpactRange: (0, pg_core_1.jsonb)("price_impact_range"), // Min/max price impact percentages
    volatilityImpactMultiplier: (0, pg_core_1.decimal)("volatility_impact_multiplier", { precision: 8, scale: 4 }).default("1.0000"),
    volumeImpactMultiplier: (0, pg_core_1.decimal)("volume_impact_multiplier", { precision: 8, scale: 4 }).default("1.0000"),
    sentimentShift: (0, pg_core_1.decimal)("sentiment_shift", { precision: 8, scale: 4 }).default("0.0000"), // -1.0000 to 1.0000
    // Affected Assets
    affectedAssetTypes: (0, pg_core_1.text)("affected_asset_types").array(), // Types of assets affected
    directlyAffectedAssets: (0, pg_core_1.text)("directly_affected_assets").array(), // Specific asset IDs
    indirectlyAffectedAssets: (0, pg_core_1.text)("indirectly_affected_assets").array(), // Assets affected through connections
    // House-Specific Responses
    houseResponseMultipliers: (0, pg_core_1.jsonb)("house_response_multipliers"), // How each house responds to this trigger
    crossHouseEffects: (0, pg_core_1.jsonb)("cross_house_effects"), // Secondary effects across houses
    // Temporal Configuration
    immediateImpactDuration: (0, pg_core_1.integer)("immediate_impact_duration").default(1440), // Minutes for immediate impact
    mediumTermEffectDuration: (0, pg_core_1.integer)("medium_term_effect_duration").default(10080), // Minutes for medium-term
    longTermMemoryDecay: (0, pg_core_1.decimal)("long_term_memory_decay", { precision: 8, scale: 4 }).default("0.0100"),
    // Trigger Conditions
    triggerConditions: (0, pg_core_1.jsonb)("trigger_conditions"), // Complex conditions for activation
    cooldownPeriod: (0, pg_core_1.integer)("cooldown_period").default(0), // Minutes before trigger can fire again
    maxActivationsPerDay: (0, pg_core_1.integer)("max_activations_per_day").default(10),
    // Execution Tracking
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    lastTriggered: (0, pg_core_1.timestamp)("last_triggered"),
    totalActivations: (0, pg_core_1.integer)("total_activations").default(0),
    successfulActivations: (0, pg_core_1.integer)("successful_activations").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Narrative Market Events - Generated events from story triggers that affect trading
exports.narrativeMarketEvents = (0, pg_core_1.pgTable)("narrative_market_events", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Event Source
    triggerEventId: (0, pg_core_1.varchar)("trigger_event_id").references(() => exports.storyEventTriggers.id),
    eventTitle: (0, pg_core_1.text)("event_title").notNull(),
    eventDescription: (0, pg_core_1.text)("event_description").notNull(),
    narrativeContext: (0, pg_core_1.text)("narrative_context"), // Rich context about the story event
    // Market Impact Data
    affectedAssets: (0, pg_core_1.text)("affected_assets").array(), // Asset IDs affected by this event
    priceImpacts: (0, pg_core_1.jsonb)("price_impacts"), // Actual price impacts by asset ID
    volumeChanges: (0, pg_core_1.jsonb)("volume_changes"), // Volume changes by asset ID
    volatilityAdjustments: (0, pg_core_1.jsonb)("volatility_adjustments"), // Volatility changes by asset ID
    // House Effects
    houseImpacts: (0, pg_core_1.jsonb)("house_impacts"), // Impact on each of the seven houses
    crossHouseInteractions: (0, pg_core_1.jsonb)("cross_house_interactions"), // Secondary cross-house effects
    // Event Lifecycle
    eventStartTime: (0, pg_core_1.timestamp)("event_start_time").notNull(),
    eventEndTime: (0, pg_core_1.timestamp)("event_end_time"),
    peakImpactTime: (0, pg_core_1.timestamp)("peak_impact_time"),
    currentPhase: (0, pg_core_1.text)("current_phase").default("immediate"), // 'immediate', 'medium_term', 'decay'
    // Market Response Tracking
    marketResponse: (0, pg_core_1.jsonb)("market_response"), // How market actually responded
    predictionAccuracy: (0, pg_core_1.decimal)("prediction_accuracy", { precision: 8, scale: 4 }),
    unexpectedEffects: (0, pg_core_1.jsonb)("unexpected_effects"), // Unanticipated market responses
    // Narrative Trading Analytics
    narrativeRelevanceScore: (0, pg_core_1.decimal)("narrative_relevance_score", { precision: 8, scale: 4 }).default("1.0000"),
    culturalImpactMeasure: (0, pg_core_1.decimal)("cultural_impact_measure", { precision: 8, scale: 4 }).default("0.0000"),
    fanEngagementCorrelation: (0, pg_core_1.decimal)("fan_engagement_correlation", { precision: 8, scale: 4 }).default("0.0000"),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Enhanced AssetFinancialMapping Integration - Extend existing table with narrative fields
// Note: We'll add these fields to the existing assetFinancialMapping table using ALTER TABLE via migrations
// ========================================================================================
// SCHEMA EXPORTS AND TYPE DEFINITIONS
// ========================================================================================
// Insert schemas for narrative trading metrics
exports.insertNarrativeTradingMetricsSchema = (0, drizzle_zod_1.createInsertSchema)(exports.narrativeTradingMetrics).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertHouseFinancialProfilesSchema = (0, drizzle_zod_1.createInsertSchema)(exports.houseFinancialProfiles).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertStoryEventTriggersSchema = (0, drizzle_zod_1.createInsertSchema)(exports.storyEventTriggers).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertNarrativeMarketEventsSchema = (0, drizzle_zod_1.createInsertSchema)(exports.narrativeMarketEvents).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// ============================================================================
// PHASE 3: ART-DRIVEN PROGRESSION SYSTEM - COMIC COLLECTION MECHANICS
// ============================================================================
// Comic Issues with Variant Cover System - Track different cover types and rarities
exports.comicIssueVariants = (0, pg_core_1.pgTable)("comic_issue_variants", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Basic issue information
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id), // Link to tradeable asset
    issueNumber: (0, pg_core_1.text)("issue_number").notNull(), // "1", "Annual 1", "Special"
    seriesTitle: (0, pg_core_1.text)("series_title").notNull(),
    publisher: (0, pg_core_1.text)("publisher").notNull(), // "Marvel", "DC", "Image", etc.
    // Cover variant details
    coverType: (0, pg_core_1.text)("cover_type").notNull(), // "standard", "variant", "rare_variant", "ultra_rare", "legendary"
    variantRatio: (0, pg_core_1.text)("variant_ratio"), // "1:10", "1:25", "1:100", "1:1000" or null for standard
    variantDescription: (0, pg_core_1.text)("variant_description"), // "Alex Ross Variant", "Foil Cover", etc.
    artistName: (0, pg_core_1.text)("artist_name"), // Cover artist
    // Rarity and progression mechanics
    rarityScore: (0, pg_core_1.decimal)("rarity_score", { precision: 8, scale: 2 }).notNull(), // 1-100 rarity score
    progressionTier: (0, pg_core_1.integer)("progression_tier").notNull().default(1), // 1-5 progression tier
    tradingToolsUnlocked: (0, pg_core_1.text)("trading_tools_unlocked").array(), // Tools this variant unlocks
    // Issue significance
    issueType: (0, pg_core_1.text)("issue_type").default("regular"), // "first_appearance", "death", "resurrection", "key_storyline", "crossover"
    keyCharacters: (0, pg_core_1.text)("key_characters").array(), // Characters featured
    significantEvents: (0, pg_core_1.text)("significant_events").array(), // Major events in this issue
    storyArcs: (0, pg_core_1.text)("story_arcs").array(), // Story arcs this issue belongs to
    // House relevance
    houseRelevance: (0, pg_core_1.jsonb)("house_relevance"), // Relevance score for each house (0-1)
    primaryHouse: (0, pg_core_1.text)("primary_house"), // Most relevant house
    // Market mechanics
    baseMarketValue: (0, pg_core_1.decimal)("base_market_value", { precision: 10, scale: 2 }).notNull(),
    progressionMultiplier: (0, pg_core_1.decimal)("progression_multiplier", { precision: 3, scale: 2 }).default("1.00"), // Bonus multiplier for progression
    collectorDemand: (0, pg_core_1.decimal)("collector_demand", { precision: 3, scale: 2 }).default("1.00"), // 0-1 collector interest
    // Metadata
    releaseDate: (0, pg_core_1.text)("release_date"),
    comicGradingEligible: (0, pg_core_1.boolean)("comic_grading_eligible").default(true),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_comic_issue_variants_asset_id").on(table.assetId),
    (0, pg_core_1.index)("idx_comic_issue_variants_cover_type").on(table.coverType),
    (0, pg_core_1.index)("idx_comic_issue_variants_progression_tier").on(table.progressionTier),
    (0, pg_core_1.index)("idx_comic_issue_variants_rarity_score").on(table.rarityScore),
    (0, pg_core_1.index)("idx_comic_issue_variants_issue_type").on(table.issueType),
    (0, pg_core_1.index)("idx_comic_issue_variants_primary_house").on(table.primaryHouse),
    (0, pg_core_1.index)("idx_comic_issue_variants_series_title").on(table.seriesTitle),
]);
// User Comic Collection - Track what users own
exports.userComicCollection = (0, pg_core_1.pgTable)("user_comic_collection", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    variantId: (0, pg_core_1.varchar)("variant_id").notNull().references(() => exports.comicIssueVariants.id),
    // Ownership details
    quantity: (0, pg_core_1.integer)("quantity").default(1), // How many copies owned
    acquisitionMethod: (0, pg_core_1.text)("acquisition_method").default("purchase"), // "purchase", "reward", "achievement", "gift"
    acquisitionPrice: (0, pg_core_1.decimal)("acquisition_price", { precision: 10, scale: 2 }),
    currentGrade: (0, pg_core_1.text)("current_grade"), // CGC grade if applicable
    gradeValue: (0, pg_core_1.decimal)("grade_value", { precision: 3, scale: 1 }), // Numeric grade value
    // Collection status
    isFirstOwned: (0, pg_core_1.boolean)("is_first_owned").default(false), // First time owning this variant
    contributesToProgression: (0, pg_core_1.boolean)("contributes_to_progression").default(true),
    displayInCollection: (0, pg_core_1.boolean)("display_in_collection").default(true),
    // Trading information
    availableForTrade: (0, pg_core_1.boolean)("available_for_trade").default(false),
    minimumTradeValue: (0, pg_core_1.decimal)("minimum_trade_value", { precision: 10, scale: 2 }),
    // Metadata
    notes: (0, pg_core_1.text)("notes"), // Personal collection notes
    tags: (0, pg_core_1.text)("tags").array(), // User-defined tags
    acquiredAt: (0, pg_core_1.timestamp)("acquired_at").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_user_comic_collection_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_user_comic_collection_variant_id").on(table.variantId),
    (0, pg_core_1.index)("idx_user_comic_collection_acquisition_method").on(table.acquisitionMethod),
    (0, pg_core_1.index)("idx_user_comic_collection_is_first_owned").on(table.isFirstOwned),
    (0, pg_core_1.index)("idx_user_comic_collection_acquired_at").on(table.acquiredAt),
    // Unique constraint to prevent duplicate ownership records
    (0, pg_core_1.index)("idx_user_comic_collection_unique").on(table.userId, table.variantId),
]);
// User Progression Status - Track overall progression through the system
exports.userProgressionStatus = (0, pg_core_1.pgTable)("user_progression_status", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    // Overall progression
    overallProgressionTier: (0, pg_core_1.integer)("overall_progression_tier").default(1), // 1-5 overall tier
    progressionTitle: (0, pg_core_1.text)("progression_title").default("Rookie Collector"), // Current title
    totalCollectionValue: (0, pg_core_1.decimal)("total_collection_value", { precision: 15, scale: 2 }).default("0.00"),
    totalIssuesOwned: (0, pg_core_1.integer)("total_issues_owned").default(0),
    totalVariantsOwned: (0, pg_core_1.integer)("total_variants_owned").default(0),
    // Progression metrics
    standardCoversOwned: (0, pg_core_1.integer)("standard_covers_owned").default(0),
    variantCoversOwned: (0, pg_core_1.integer)("variant_covers_owned").default(0), // 1:10 variants
    rareVariantsOwned: (0, pg_core_1.integer)("rare_variants_owned").default(0), // 1:25 variants
    ultraRareVariantsOwned: (0, pg_core_1.integer)("ultra_rare_variants_owned").default(0), // 1:100 variants
    legendaryVariantsOwned: (0, pg_core_1.integer)("legendary_variants_owned").default(0), // 1:1000 variants
    // Issue type collections
    firstAppearancesOwned: (0, pg_core_1.integer)("first_appearances_owned").default(0),
    deathIssuesOwned: (0, pg_core_1.integer)("death_issues_owned").default(0),
    resurrectionIssuesOwned: (0, pg_core_1.integer)("resurrection_issues_owned").default(0),
    keyStorylineIssuesOwned: (0, pg_core_1.integer)("key_storyline_issues_owned").default(0),
    crossoverIssuesOwned: (0, pg_core_1.integer)("crossover_issues_owned").default(0),
    // Creator collections
    creatorMilestonesCompleted: (0, pg_core_1.integer)("creator_milestones_completed").default(0),
    iconicSplashPagesOwned: (0, pg_core_1.integer)("iconic_splash_pages_owned").default(0),
    // Trading capabilities unlocked
    tradingToolsUnlocked: (0, pg_core_1.text)("trading_tools_unlocked").array(), // List of unlocked tools
    maxTradingTier: (0, pg_core_1.integer)("max_trading_tier").default(1), // Highest tier unlocked
    specialTradingAbilities: (0, pg_core_1.text)("special_trading_abilities").array(), // Special abilities unlocked
    // House-specific progression
    houseProgressionLevels: (0, pg_core_1.jsonb)("house_progression_levels"), // Progress in each house
    houseBonusesUnlocked: (0, pg_core_1.jsonb)("house_bonuses_unlocked"), // Bonuses unlocked per house
    interHouseBonuses: (0, pg_core_1.text)("inter_house_bonuses").array(), // Cross-house bonuses
    // Achievement milestones
    achievementMilestonesCompleted: (0, pg_core_1.integer)("achievement_milestones_completed").default(0),
    legendaryAchievementsUnlocked: (0, pg_core_1.integer)("legendary_achievements_unlocked").default(0),
    // Collection completion stats
    seriesCompletionCount: (0, pg_core_1.integer)("series_completion_count").default(0), // Number of complete series
    publisherCompletionPercentage: (0, pg_core_1.jsonb)("publisher_completion_percentage"), // % complete for each publisher
    // Metadata
    lastProgressionUpdate: (0, pg_core_1.timestamp)("last_progression_update").defaultNow(),
    nextMilestoneTarget: (0, pg_core_1.text)("next_milestone_target"), // Description of next major milestone
    progressionNotes: (0, pg_core_1.text)("progression_notes"), // Internal notes about progression
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_user_progression_status_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_user_progression_status_tier").on(table.overallProgressionTier),
    (0, pg_core_1.index)("idx_user_progression_status_total_value").on(table.totalCollectionValue),
    (0, pg_core_1.index)("idx_user_progression_status_max_trading_tier").on(table.maxTradingTier),
    (0, pg_core_1.index)("idx_user_progression_status_last_update").on(table.lastProgressionUpdate),
]);
// House Progression Paths - Define progression within each house
exports.houseProgressionPaths = (0, pg_core_1.pgTable)("house_progression_paths", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    houseId: (0, pg_core_1.text)("house_id").notNull(), // "heroes", "wisdom", "power", "mystery", "elements", "time", "spirit"
    progressionLevel: (0, pg_core_1.integer)("progression_level").notNull(), // 1-4 levels per house
    levelTitle: (0, pg_core_1.text)("level_title").notNull(), // "Origin Story", "Sidekick", etc.
    levelDescription: (0, pg_core_1.text)("level_description").notNull(),
    // Requirements for this level
    requiredIssuesCount: (0, pg_core_1.integer)("required_issues_count").default(0),
    requiredVariantRarity: (0, pg_core_1.text)("required_variant_rarity"), // Minimum variant rarity needed
    requiredCollectionValue: (0, pg_core_1.decimal)("required_collection_value", { precision: 15, scale: 2 }).default("0.00"),
    requiredStorylineCompletion: (0, pg_core_1.text)("required_storyline_completion").array(), // Specific storylines
    requiredCharacterCollection: (0, pg_core_1.text)("required_character_collection").array(), // Character collections
    // Unlocks and bonuses
    tradingBonuses: (0, pg_core_1.jsonb)("trading_bonuses"), // Trading bonuses at this level
    specialAbilities: (0, pg_core_1.text)("special_abilities").array(), // Special abilities unlocked
    marketAccessLevel: (0, pg_core_1.text)("market_access_level"), // "basic", "advanced", "expert", "legendary"
    houseSpecificTools: (0, pg_core_1.text)("house_specific_tools").array(), // House-specific trading tools
    // Visual and thematic elements
    badgeIcon: (0, pg_core_1.text)("badge_icon"), // Icon for this progression level
    badgeColor: (0, pg_core_1.text)("badge_color"), // Color theme
    levelQuote: (0, pg_core_1.text)("level_quote"), // Inspirational quote for this level
    backgroundImage: (0, pg_core_1.text)("background_image"), // Background image URL
    // Progression narrative
    progressionStory: (0, pg_core_1.text)("progression_story"), // Story text for reaching this level
    nextLevelPreview: (0, pg_core_1.text)("next_level_preview"), // Hint about next level
    // Metadata
    displayOrder: (0, pg_core_1.integer)("display_order").notNull(),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_house_progression_paths_house_id").on(table.houseId),
    (0, pg_core_1.index)("idx_house_progression_paths_level").on(table.progressionLevel),
    (0, pg_core_1.index)("idx_house_progression_paths_display_order").on(table.displayOrder),
    // Unique constraint for house + level combination
    (0, pg_core_1.index)("idx_house_progression_paths_unique").on(table.houseId, table.progressionLevel),
]);
// User House Progression - Track user progress within each house
exports.userHouseProgression = (0, pg_core_1.pgTable)("user_house_progression", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    houseId: (0, pg_core_1.text)("house_id").notNull(),
    // Current progression status
    currentLevel: (0, pg_core_1.integer)("current_level").default(1),
    experiencePoints: (0, pg_core_1.integer)("experience_points").default(0), // XP towards next level
    nextLevelRequiredXP: (0, pg_core_1.integer)("next_level_required_xp").default(100),
    progressionPercentage: (0, pg_core_1.decimal)("progression_percentage", { precision: 5, scale: 2 }).default("0.00"), // % to next level
    // Collection requirements progress
    currentIssuesCount: (0, pg_core_1.integer)("current_issues_count").default(0),
    currentCollectionValue: (0, pg_core_1.decimal)("current_collection_value", { precision: 15, scale: 2 }).default("0.00"),
    storylinesCompleted: (0, pg_core_1.text)("storylines_completed").array(),
    characterCollectionsCompleted: (0, pg_core_1.text)("character_collections_completed").array(),
    // Unlocked benefits
    currentTradingBonuses: (0, pg_core_1.jsonb)("current_trading_bonuses"),
    unlockedAbilities: (0, pg_core_1.text)("unlocked_abilities").array(),
    currentMarketAccessLevel: (0, pg_core_1.text)("current_market_access_level").default("basic"),
    availableHouseTools: (0, pg_core_1.text)("available_house_tools").array(),
    // Achievement tracking
    levelsUnlocked: (0, pg_core_1.integer)("levels_unlocked").default(1),
    totalXPEarned: (0, pg_core_1.integer)("total_xp_earned").default(0),
    firstLevelAchievedAt: (0, pg_core_1.timestamp)("first_level_achieved_at"),
    lastLevelAchievedAt: (0, pg_core_1.timestamp)("last_level_achieved_at"),
    // House-specific metrics
    houseSpecificAchievements: (0, pg_core_1.text)("house_specific_achievements").array(),
    houseContributionScore: (0, pg_core_1.decimal)("house_contribution_score", { precision: 8, scale: 2 }).default("0.00"),
    houseRankingPosition: (0, pg_core_1.integer)("house_ranking_position"),
    // Metadata
    lastProgressionActivity: (0, pg_core_1.timestamp)("last_progression_activity").defaultNow(),
    progressionNotes: (0, pg_core_1.text)("progression_notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_user_house_progression_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_user_house_progression_house_id").on(table.houseId),
    (0, pg_core_1.index)("idx_user_house_progression_current_level").on(table.currentLevel),
    (0, pg_core_1.index)("idx_user_house_progression_xp").on(table.experiencePoints),
    (0, pg_core_1.index)("idx_user_house_progression_contribution").on(table.houseContributionScore),
    // Unique constraint to prevent duplicate progression records
    (0, pg_core_1.index)("idx_user_house_progression_unique").on(table.userId, table.houseId),
]);
// Trading Tool Unlocks - Track which trading features are available to users
exports.tradingToolUnlocks = (0, pg_core_1.pgTable)("trading_tool_unlocks", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    toolName: (0, pg_core_1.text)("tool_name").notNull(), // "basic_trading", "technical_analysis", "options_trading", etc.
    toolCategory: (0, pg_core_1.text)("tool_category").notNull(), // "basic", "advanced", "expert", "legendary"
    // Unlock requirements
    requiredProgressionTier: (0, pg_core_1.integer)("required_progression_tier").notNull(),
    requiredVariantRarity: (0, pg_core_1.text)("required_variant_rarity"), // Minimum variant rarity
    requiredAchievements: (0, pg_core_1.text)("required_achievements").array(), // Achievement prerequisites
    requiredHouseLevel: (0, pg_core_1.jsonb)("required_house_level"), // House level requirements
    // Unlock status
    isUnlocked: (0, pg_core_1.boolean)("is_unlocked").default(false),
    unlockedAt: (0, pg_core_1.timestamp)("unlocked_at"),
    unlockedBy: (0, pg_core_1.text)("unlocked_by"), // What triggered the unlock
    // Tool configuration
    toolDescription: (0, pg_core_1.text)("tool_description").notNull(),
    toolBenefits: (0, pg_core_1.text)("tool_benefits").array(), // Benefits this tool provides
    tradingBonuses: (0, pg_core_1.jsonb)("trading_bonuses"), // Specific trading bonuses
    marketAccessLevel: (0, pg_core_1.text)("market_access_level"), // Required market access
    // Usage tracking
    timesUsed: (0, pg_core_1.integer)("times_used").default(0),
    lastUsedAt: (0, pg_core_1.timestamp)("last_used_at"),
    effectivenessRating: (0, pg_core_1.decimal)("effectiveness_rating", { precision: 3, scale: 2 }), // User effectiveness with tool
    // Metadata
    iconName: (0, pg_core_1.text)("icon_name"), // UI icon
    displayOrder: (0, pg_core_1.integer)("display_order").default(0),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_trading_tool_unlocks_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_trading_tool_unlocks_tool_name").on(table.toolName),
    (0, pg_core_1.index)("idx_trading_tool_unlocks_category").on(table.toolCategory),
    (0, pg_core_1.index)("idx_trading_tool_unlocks_progression_tier").on(table.requiredProgressionTier),
    (0, pg_core_1.index)("idx_trading_tool_unlocks_is_unlocked").on(table.isUnlocked),
    (0, pg_core_1.index)("idx_trading_tool_unlocks_unlocked_at").on(table.unlockedAt),
    // Unique constraint for user + tool combination
    (0, pg_core_1.index)("idx_trading_tool_unlocks_unique").on(table.userId, table.toolName),
]);
// Comic Collection Achievements - Define specific collection-based achievements
exports.comicCollectionAchievements = (0, pg_core_1.pgTable)("comic_collection_achievements", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    achievementId: (0, pg_core_1.text)("achievement_id").notNull().unique(), // "first_variant_cover", "death_issue_collector", etc.
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    category: (0, pg_core_1.text)("category").notNull(), // "variant_collection", "issue_type", "storyline", "creator", "crossover"
    // Achievement requirements
    requirementType: (0, pg_core_1.text)("requirement_type").notNull(), // "count", "specific_issues", "value", "rarity", "storyline"
    requiredCount: (0, pg_core_1.integer)("required_count"), // Number required for count-based achievements
    requiredValue: (0, pg_core_1.decimal)("required_value", { precision: 15, scale: 2 }), // Value required
    requiredRarity: (0, pg_core_1.text)("required_rarity"), // Minimum rarity level
    specificRequirements: (0, pg_core_1.jsonb)("specific_requirements"), // Detailed requirements
    // Rewards and unlocks
    achievementPoints: (0, pg_core_1.integer)("achievement_points").default(0),
    tradingToolsUnlocked: (0, pg_core_1.text)("trading_tools_unlocked").array(),
    houseProgressionBonus: (0, pg_core_1.jsonb)("house_progression_bonus"), // XP bonus per house
    specialAbilities: (0, pg_core_1.text)("special_abilities").array(),
    tradingBonuses: (0, pg_core_1.jsonb)("trading_bonuses"),
    // Visual elements
    badgeIcon: (0, pg_core_1.text)("badge_icon"),
    badgeColor: (0, pg_core_1.text)("badge_color"),
    tier: (0, pg_core_1.text)("tier").default("bronze"), // "bronze", "silver", "gold", "platinum", "legendary"
    rarity: (0, pg_core_1.text)("rarity").default("common"), // "common", "rare", "epic", "legendary"
    // Narrative elements
    achievementStory: (0, pg_core_1.text)("achievement_story"), // Story text for unlocking
    comicPanelStyle: (0, pg_core_1.text)("comic_panel_style"), // Visual style for notification
    speechBubbleText: (0, pg_core_1.text)("speech_bubble_text"), // Character dialogue for achievement
    // Prerequisites and dependencies
    prerequisiteAchievements: (0, pg_core_1.text)("prerequisite_achievements").array(),
    blockedBy: (0, pg_core_1.text)("blocked_by").array(), // Achievements that block this one
    // Metadata
    isHidden: (0, pg_core_1.boolean)("is_hidden").default(false), // Hidden until unlocked
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    displayOrder: (0, pg_core_1.integer)("display_order").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_comic_collection_achievements_achievement_id").on(table.achievementId),
    (0, pg_core_1.index)("idx_comic_collection_achievements_category").on(table.category),
    (0, pg_core_1.index)("idx_comic_collection_achievements_tier").on(table.tier),
    (0, pg_core_1.index)("idx_comic_collection_achievements_rarity").on(table.rarity),
    (0, pg_core_1.index)("idx_comic_collection_achievements_requirement_type").on(table.requirementType),
    (0, pg_core_1.index)("idx_comic_collection_achievements_is_hidden").on(table.isHidden),
    (0, pg_core_1.index)("idx_comic_collection_achievements_display_order").on(table.displayOrder),
]);
// Collection Challenges - Weekly/monthly collecting goals
exports.collectionChallenges = (0, pg_core_1.pgTable)("collection_challenges", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    challengeTitle: (0, pg_core_1.text)("challenge_title").notNull(),
    challengeDescription: (0, pg_core_1.text)("challenge_description").notNull(),
    challengeType: (0, pg_core_1.text)("challenge_type").notNull(), // "weekly", "monthly", "seasonal", "special_event"
    // Challenge timing
    startDate: (0, pg_core_1.timestamp)("start_date").notNull(),
    endDate: (0, pg_core_1.timestamp)("end_date").notNull(),
    challengeDuration: (0, pg_core_1.text)("challenge_duration"), // "7_days", "30_days", etc.
    // Challenge requirements
    challengeGoal: (0, pg_core_1.jsonb)("challenge_goal").notNull(), // Specific goal requirements
    targetMetric: (0, pg_core_1.text)("target_metric").notNull(), // "issues_collected", "value_achieved", "variants_found"
    targetValue: (0, pg_core_1.decimal)("target_value", { precision: 15, scale: 2 }).notNull(),
    eligibilityRequirements: (0, pg_core_1.jsonb)("eligibility_requirements"), // Who can participate
    // House integration
    houseSpecific: (0, pg_core_1.boolean)("house_specific").default(false),
    targetHouse: (0, pg_core_1.text)("target_house"), // If house-specific
    crossHouseBonus: (0, pg_core_1.boolean)("cross_house_bonus").default(false), // If cross-house participation gets bonus
    // Rewards
    completionRewards: (0, pg_core_1.jsonb)("completion_rewards").notNull(),
    leaderboardRewards: (0, pg_core_1.jsonb)("leaderboard_rewards"), // Top performer rewards
    participationRewards: (0, pg_core_1.jsonb)("participation_rewards"), // Just for participating
    exclusiveUnlocks: (0, pg_core_1.text)("exclusive_unlocks").array(), // Exclusive content unlocked
    // Challenge mechanics
    difficultyLevel: (0, pg_core_1.integer)("difficulty_level").default(3), // 1-5 difficulty
    maxParticipants: (0, pg_core_1.integer)("max_participants"), // Participation limit
    currentParticipants: (0, pg_core_1.integer)("current_participants").default(0),
    // Progress tracking
    leaderboardEnabled: (0, pg_core_1.boolean)("leaderboard_enabled").default(true),
    realTimeTracking: (0, pg_core_1.boolean)("real_time_tracking").default(true),
    progressVisibility: (0, pg_core_1.text)("progress_visibility").default("public"), // "public", "house_only", "private"
    // Visual and narrative elements
    challengeBanner: (0, pg_core_1.text)("challenge_banner"), // Banner image URL
    challengeIcon: (0, pg_core_1.text)("challenge_icon"),
    themeColor: (0, pg_core_1.text)("theme_color"),
    narrativeContext: (0, pg_core_1.text)("narrative_context"), // Story context for challenge
    // Metadata
    createdBy: (0, pg_core_1.varchar)("created_by").references(() => exports.users.id),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    isRecurring: (0, pg_core_1.boolean)("is_recurring").default(false), // If this challenge repeats
    recurringPattern: (0, pg_core_1.text)("recurring_pattern"), // How often it repeats
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_collection_challenges_challenge_type").on(table.challengeType),
    (0, pg_core_1.index)("idx_collection_challenges_start_date").on(table.startDate),
    (0, pg_core_1.index)("idx_collection_challenges_end_date").on(table.endDate),
    (0, pg_core_1.index)("idx_collection_challenges_is_active").on(table.isActive),
    (0, pg_core_1.index)("idx_collection_challenges_target_house").on(table.targetHouse),
    (0, pg_core_1.index)("idx_collection_challenges_difficulty").on(table.difficultyLevel),
]);
// User Challenge Participation - Track user participation in challenges
exports.userChallengeParticipation = (0, pg_core_1.pgTable)("user_challenge_participation", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    challengeId: (0, pg_core_1.varchar)("challenge_id").notNull().references(() => exports.collectionChallenges.id),
    // Participation status
    enrolledAt: (0, pg_core_1.timestamp)("enrolled_at").defaultNow(),
    participationStatus: (0, pg_core_1.text)("participation_status").default("active"), // "active", "completed", "abandoned", "disqualified"
    // Progress tracking
    currentProgress: (0, pg_core_1.decimal)("current_progress", { precision: 15, scale: 2 }).default("0.00"),
    progressPercentage: (0, pg_core_1.decimal)("progress_percentage", { precision: 5, scale: 2 }).default("0.00"),
    milestonesMet: (0, pg_core_1.text)("milestones_met").array(),
    lastProgressUpdate: (0, pg_core_1.timestamp)("last_progress_update").defaultNow(),
    // Performance metrics
    leaderboardPosition: (0, pg_core_1.integer)("leaderboard_position"),
    bestPosition: (0, pg_core_1.integer)("best_position"),
    finalPosition: (0, pg_core_1.integer)("final_position"),
    // Rewards earned
    rewardsEarned: (0, pg_core_1.jsonb)("rewards_earned"),
    rewardsClaimed: (0, pg_core_1.boolean)("rewards_claimed").default(false),
    rewardsClaimedAt: (0, pg_core_1.timestamp)("rewards_claimed_at"),
    // Challenge-specific tracking
    challengeSpecificData: (0, pg_core_1.jsonb)("challenge_specific_data"), // Additional tracking data
    effortRating: (0, pg_core_1.decimal)("effort_rating", { precision: 3, scale: 2 }), // 1-5 effort put in
    satisfactionRating: (0, pg_core_1.decimal)("satisfaction_rating", { precision: 3, scale: 2 }), // 1-5 satisfaction
    // Metadata
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    notes: (0, pg_core_1.text)("notes"), // User notes about participation
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_user_challenge_participation_user_id").on(table.userId),
    (0, pg_core_1.index)("idx_user_challenge_participation_challenge_id").on(table.challengeId),
    (0, pg_core_1.index)("idx_user_challenge_participation_status").on(table.participationStatus),
    (0, pg_core_1.index)("idx_user_challenge_participation_leaderboard").on(table.leaderboardPosition),
    (0, pg_core_1.index)("idx_user_challenge_participation_enrolled_at").on(table.enrolledAt),
    // Unique constraint to prevent duplicate participation
    (0, pg_core_1.index)("idx_user_challenge_participation_unique").on(table.userId, table.challengeId),
]);
// ============================================================================
// INSERT SCHEMAS AND TYPESCRIPT TYPES FOR PHASE 3 PROGRESSION SYSTEM
// ============================================================================
// Insert schemas for Phase 3 progression tables
exports.insertComicIssueVariantSchema = (0, drizzle_zod_1.createInsertSchema)(exports.comicIssueVariants).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertUserComicCollectionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userComicCollection).omit({
    id: true,
    acquiredAt: true,
    createdAt: true,
});
exports.insertUserProgressionStatusSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userProgressionStatus).omit({
    id: true,
    lastProgressionUpdate: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertHouseProgressionPathSchema = (0, drizzle_zod_1.createInsertSchema)(exports.houseProgressionPaths).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertUserHouseProgressionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userHouseProgression).omit({
    id: true,
    lastProgressionActivity: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertTradingToolUnlockSchema = (0, drizzle_zod_1.createInsertSchema)(exports.tradingToolUnlocks).omit({
    id: true,
    unlockedAt: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertComicCollectionAchievementSchema = (0, drizzle_zod_1.createInsertSchema)(exports.comicCollectionAchievements).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertCollectionChallengeSchema = (0, drizzle_zod_1.createInsertSchema)(exports.collectionChallenges).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertUserChallengeParticipationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userChallengeParticipation).omit({
    id: true,
    enrolledAt: true,
    lastProgressUpdate: true,
    createdAt: true,
    updatedAt: true,
});
// =============================================================================
// COLLECTOR-GRADE ASSET DISPLAY SYSTEM
// Phase: Collector Experience Enhancement
// =============================================================================
// Graded Asset Profiles - CGC-style grading system with collector authenticity
exports.gradedAssetProfiles = (0, pg_core_1.pgTable)("graded_asset_profiles", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    // CGC-Style Grading Scores (0.5 - 10.0 scale)
    overallGrade: (0, pg_core_1.decimal)("overall_grade", { precision: 3, scale: 1 }).notNull(), // Final composite grade
    conditionScore: (0, pg_core_1.decimal)("condition_score", { precision: 3, scale: 1 }).notNull(), // Overall condition
    centeringScore: (0, pg_core_1.decimal)("centering_score", { precision: 3, scale: 1 }).notNull(), // Cover centering
    cornersScore: (0, pg_core_1.decimal)("corners_score", { precision: 3, scale: 1 }).notNull(), // Corner condition
    edgesScore: (0, pg_core_1.decimal)("edges_score", { precision: 3, scale: 1 }).notNull(), // Edge integrity
    surfaceScore: (0, pg_core_1.decimal)("surface_score", { precision: 3, scale: 1 }).notNull(), // Surface quality
    // Provenance & Certification Metadata
    certificationAuthority: (0, pg_core_1.text)("certification_authority").notNull(), // 'cgc', 'cbcs', 'pgx', 'internal'
    certificationNumber: (0, pg_core_1.text)("certification_number").unique(), // Serial number from grading company
    gradingDate: (0, pg_core_1.timestamp)("grading_date").notNull(),
    gradingNotes: (0, pg_core_1.text)("grading_notes"), // Detailed condition notes
    // Variant Classifications & Special Designations
    variantType: (0, pg_core_1.text)("variant_type"), // 'first_print', 'variant_cover', 'special_edition', 'limited_run', 'error', 'misprint'
    printRun: (0, pg_core_1.integer)("print_run"), // Known print run numbers
    isKeyIssue: (0, pg_core_1.boolean)("is_key_issue").default(false),
    isFirstAppearance: (0, pg_core_1.boolean)("is_first_appearance").default(false),
    isSigned: (0, pg_core_1.boolean)("is_signed").default(false),
    signatureAuthenticated: (0, pg_core_1.boolean)("signature_authenticated").default(false),
    // Rarity Tier System (Mythological Themed)
    rarityTier: (0, pg_core_1.text)("rarity_tier").notNull(), // 'common', 'uncommon', 'rare', 'ultra_rare', 'legendary', 'mythic'
    rarityScore: (0, pg_core_1.decimal)("rarity_score", { precision: 5, scale: 2 }).notNull(), // Calculated rarity index
    marketDemandScore: (0, pg_core_1.decimal)("market_demand_score", { precision: 5, scale: 2 }), // Market desirability
    // Storage & Collection Metadata
    storageType: (0, pg_core_1.text)("storage_type").default("bag_and_board"), // 'bag_and_board', 'mylar', 'graded_slab', 'top_loader'
    storageCondition: (0, pg_core_1.text)("storage_condition").default("excellent"), // 'poor', 'fair', 'good', 'excellent', 'mint'
    acquisitionDate: (0, pg_core_1.timestamp)("acquisition_date").notNull(),
    acquisitionPrice: (0, pg_core_1.decimal)("acquisition_price", { precision: 10, scale: 2 }),
    currentMarketValue: (0, pg_core_1.decimal)("current_market_value", { precision: 10, scale: 2 }),
    // Collection Organization
    collectionSeries: (0, pg_core_1.text)("collection_series"), // Series grouping
    issueNumber: (0, pg_core_1.text)("issue_number"), // Specific issue number
    volumeNumber: (0, pg_core_1.integer)("volume_number"), // Volume/series number
    // Collector Notes & Personal Data  
    personalRating: (0, pg_core_1.integer)("personal_rating"), // 1-5 star personal rating
    collectorNotes: (0, pg_core_1.text)("collector_notes"), // Personal collection notes
    displayPriority: (0, pg_core_1.integer)("display_priority").default(0), // Display order preference
    // House Integration & Progression
    houseAffiliation: (0, pg_core_1.text)("house_affiliation"), // Associated mythological house
    houseProgressionValue: (0, pg_core_1.decimal)("house_progression_value", { precision: 8, scale: 2 }).default("0.00"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Variant Cover Registry - Comprehensive variant tracking
exports.variantCoverRegistry = (0, pg_core_1.pgTable)("variant_cover_registry", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    baseAssetId: (0, pg_core_1.varchar)("base_asset_id").notNull().references(() => exports.assets.id), // Base comic issue
    // Variant Identification
    variantIdentifier: (0, pg_core_1.text)("variant_identifier").notNull(), // Unique variant code
    variantName: (0, pg_core_1.text)("variant_name").notNull(), // Display name
    coverArtist: (0, pg_core_1.text)("cover_artist"), // Cover artist name
    variantType: (0, pg_core_1.text)("variant_type").notNull(), // 'retailer', 'convention', 'artist', 'incentive', 'sketch'
    // Market Data
    printRun: (0, pg_core_1.integer)("print_run"), // Known or estimated print run
    incentiveRatio: (0, pg_core_1.text)("incentive_ratio"), // For incentive variants (e.g., "1:25", "1:100")
    exclusiveRetailer: (0, pg_core_1.text)("exclusive_retailer"), // Exclusive retailer if applicable
    releaseDate: (0, pg_core_1.timestamp)("release_date"),
    // Visual Assets
    coverImageUrl: (0, pg_core_1.text)("cover_image_url"),
    thumbnailUrl: (0, pg_core_1.text)("thumbnail_url"),
    backCoverUrl: (0, pg_core_1.text)("back_cover_url"), // For trading card flip effect
    // Rarity & Valuation
    baseRarityMultiplier: (0, pg_core_1.decimal)("base_rarity_multiplier", { precision: 5, scale: 2 }).default("1.00"),
    currentPremium: (0, pg_core_1.decimal)("current_premium", { precision: 8, scale: 2 }), // Premium over base issue
    // Metadata
    description: (0, pg_core_1.text)("description"),
    specialFeatures: (0, pg_core_1.text)("special_features").array(), // Special printing techniques, etc.
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Collection Storage Boxes - Physical storage simulation
exports.collectionStorageBoxes = (0, pg_core_1.pgTable)("collection_storage_boxes", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    // Box Identification
    boxName: (0, pg_core_1.text)("box_name").notNull(),
    boxType: (0, pg_core_1.text)("box_type").notNull(), // 'long_box', 'short_box', 'magazine_box', 'display_case', 'graded_slab_storage'
    capacity: (0, pg_core_1.integer)("capacity").notNull(), // Maximum number of issues
    currentCount: (0, pg_core_1.integer)("current_count").default(0),
    // Organization
    organizationMethod: (0, pg_core_1.text)("organization_method").default("alphabetical"), // 'alphabetical', 'chronological', 'value', 'rarity', 'series', 'publisher'
    seriesFilter: (0, pg_core_1.text)("series_filter"), // Optional series grouping
    publisherFilter: (0, pg_core_1.text)("publisher_filter"), // Optional publisher grouping
    // Physical Attributes
    location: (0, pg_core_1.text)("location"), // Physical location description
    condition: (0, pg_core_1.text)("condition").default("excellent"), // Box condition
    // Collection Stats
    totalValue: (0, pg_core_1.decimal)("total_value", { precision: 15, scale: 2 }).default("0.00"),
    averageGrade: (0, pg_core_1.decimal)("average_grade", { precision: 3, scale: 1 }),
    keyIssuesCount: (0, pg_core_1.integer)("key_issues_count").default(0),
    // Rarity Distribution
    commonCount: (0, pg_core_1.integer)("common_count").default(0),
    uncommonCount: (0, pg_core_1.integer)("uncommon_count").default(0),
    rareCount: (0, pg_core_1.integer)("rare_count").default(0),
    ultraRareCount: (0, pg_core_1.integer)("ultra_rare_count").default(0),
    legendaryCount: (0, pg_core_1.integer)("legendary_count").default(0),
    mythicCount: (0, pg_core_1.integer)("mythic_count").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Grading Certification History - Track certification events
exports.gradingCertifications = (0, pg_core_1.pgTable)("grading_certifications", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    gradedAssetId: (0, pg_core_1.varchar)("graded_asset_id").notNull().references(() => exports.gradedAssetProfiles.id),
    // Certification Event
    certificationType: (0, pg_core_1.text)("certification_type").notNull(), // 'initial_grade', 're_grade', 'signature_verification', 'restoration_check'
    previousGrade: (0, pg_core_1.decimal)("previous_grade", { precision: 3, scale: 1 }), // Previous grade if re-certification
    newGrade: (0, pg_core_1.decimal)("new_grade", { precision: 3, scale: 1 }).notNull(),
    // Certification Details
    certifyingAuthority: (0, pg_core_1.text)("certifying_authority").notNull(),
    certificateNumber: (0, pg_core_1.text)("certificate_number"),
    certificationFee: (0, pg_core_1.decimal)("certification_fee", { precision: 8, scale: 2 }),
    // Process Tracking
    submissionDate: (0, pg_core_1.timestamp)("submission_date"),
    completionDate: (0, pg_core_1.timestamp)("completion_date").notNull(),
    turnaroundDays: (0, pg_core_1.integer)("turnaround_days"),
    // Results
    certificationNotes: (0, pg_core_1.text)("certification_notes"),
    qualityAssessment: (0, pg_core_1.jsonb)("quality_assessment"), // Detailed breakdown of grading criteria
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Market Comparables - Track similar sales for valuation
exports.marketComparables = (0, pg_core_1.pgTable)("market_comparables", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    gradedAssetId: (0, pg_core_1.varchar)("graded_asset_id").notNull().references(() => exports.gradedAssetProfiles.id),
    // Sale Information
    salePrice: (0, pg_core_1.decimal)("sale_price", { precision: 10, scale: 2 }).notNull(),
    saleDate: (0, pg_core_1.timestamp)("sale_date").notNull(),
    marketplace: (0, pg_core_1.text)("marketplace"), // 'ebay', 'heritage', 'comic_connect', 'mycomicshop'
    // Comparable Details
    comparableGrade: (0, pg_core_1.decimal)("comparable_grade", { precision: 3, scale: 1 }).notNull(),
    gradingAuthority: (0, pg_core_1.text)("grading_authority").notNull(),
    saleConditions: (0, pg_core_1.text)("sale_conditions"), // Auction, buy-it-now, etc.
    // Relevance Scoring
    relevanceScore: (0, pg_core_1.decimal)("relevance_score", { precision: 3, scale: 2 }), // How similar to target asset
    ageRelevance: (0, pg_core_1.decimal)("age_relevance", { precision: 3, scale: 2 }), // How recent the sale
    // Metadata
    saleReference: (0, pg_core_1.text)("sale_reference"), // External reference/link
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Create insert schemas for Collector-Grade Asset Display system
exports.insertGradedAssetProfileSchema = (0, drizzle_zod_1.createInsertSchema)(exports.gradedAssetProfiles).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertVariantCoverRegistrySchema = (0, drizzle_zod_1.createInsertSchema)(exports.variantCoverRegistry).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertCollectionStorageBoxSchema = (0, drizzle_zod_1.createInsertSchema)(exports.collectionStorageBoxes).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertGradingCertificationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.gradingCertifications).omit({
    id: true,
    createdAt: true,
});
exports.insertMarketComparableSchema = (0, drizzle_zod_1.createInsertSchema)(exports.marketComparables).omit({
    id: true,
    createdAt: true,
});
// =============================================
// SHADOW ECONOMY SYSTEM
// =============================================
// Shadow Trades - Track all shadow market transactions
exports.shadowTrades = (0, pg_core_1.pgTable)("shadow_trades", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    // Price Information
    shadowPrice: (0, pg_core_1.decimal)("shadow_price", { precision: 10, scale: 2 }).notNull(),
    realPrice: (0, pg_core_1.decimal)("real_price", { precision: 10, scale: 2 }).notNull(),
    priceDivergence: (0, pg_core_1.decimal)("price_divergence", { precision: 8, scale: 2 }).notNull(), // Percentage
    // Trade Details
    quantity: (0, pg_core_1.integer)("quantity").notNull(),
    side: (0, pg_core_1.text)("side").notNull(), // 'buy' or 'sell'
    orderType: (0, pg_core_1.text)("order_type").notNull(), // 'predatory', 'vampire', 'ghost'
    profitLoss: (0, pg_core_1.decimal)("profit_loss", { precision: 15, scale: 2 }).notNull(),
    // Corruption Impact
    corruptionGained: (0, pg_core_1.integer)("corruption_gained").notNull(),
    victimId: (0, pg_core_1.varchar)("victim_id").references(() => exports.users.id), // If applicable
    victimLoss: (0, pg_core_1.decimal)("victim_loss", { precision: 15, scale: 2 }),
    // Status
    status: (0, pg_core_1.text)("status").notNull().default("pending"), // 'pending', 'executed', 'cancelled'
    executedAt: (0, pg_core_1.timestamp)("executed_at").notNull(),
    // Metadata
    metadata: (0, pg_core_1.jsonb)("metadata"), // Additional trade-specific data
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_shadow_trades_user").on(table.userId),
    (0, pg_core_1.index)("idx_shadow_trades_asset").on(table.assetId),
    (0, pg_core_1.index)("idx_shadow_trades_executed").on(table.executedAt),
]);
// Dark Pools - Hidden liquidity pools for shadow market
exports.darkPools = (0, pg_core_1.pgTable)("dark_pools", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    // Liquidity Information
    shadowLiquidity: (0, pg_core_1.decimal)("shadow_liquidity", { precision: 15, scale: 2 }).notNull(),
    hiddenOrders: (0, pg_core_1.integer)("hidden_orders").default(0),
    averageSpread: (0, pg_core_1.decimal)("average_spread", { precision: 8, scale: 4 }),
    // Access Control
    accessLevel: (0, pg_core_1.integer)("access_level").notNull().default(30), // Minimum corruption to access
    participantCount: (0, pg_core_1.integer)("participant_count").default(0),
    // Pool Characteristics
    poolType: (0, pg_core_1.text)("pool_type").default("standard"), // 'standard', 'predatory', 'vampire'
    volatility: (0, pg_core_1.decimal)("volatility", { precision: 8, scale: 2 }),
    bloodInWater: (0, pg_core_1.boolean)("blood_in_water").default(false), // Recent losses detected
    lastBloodTime: (0, pg_core_1.timestamp)("last_blood_time"),
    // Statistics
    totalVolume24h: (0, pg_core_1.decimal)("total_volume_24h", { precision: 15, scale: 2 }).default("0.00"),
    totalTrades24h: (0, pg_core_1.integer)("total_trades_24h").default(0),
    largestTrade: (0, pg_core_1.decimal)("largest_trade", { precision: 15, scale: 2 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_dark_pools_asset").on(table.assetId),
    (0, pg_core_1.index)("idx_dark_pools_access").on(table.accessLevel),
]);
// Shadow Order Book - Hidden orders only visible to corrupt traders
exports.shadowOrderBook = (0, pg_core_1.pgTable)("shadow_order_book", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    // Order Details
    orderType: (0, pg_core_1.text)("order_type").notNull(), // 'ghost', 'trap', 'vampire'
    side: (0, pg_core_1.text)("side").notNull(), // 'buy' or 'sell'
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    quantity: (0, pg_core_1.integer)("quantity").notNull(),
    filled: (0, pg_core_1.integer)("filled").default(0),
    // Visibility
    visibilityLevel: (0, pg_core_1.integer)("visibility_level").notNull(), // Corruption required to see
    isHidden: (0, pg_core_1.boolean)("is_hidden").default(true),
    revealAt: (0, pg_core_1.timestamp)("reveal_at"), // When order becomes visible
    // Targeting
    targetUserId: (0, pg_core_1.varchar)("target_user_id").references(() => exports.users.id), // For predatory orders
    targetPrice: (0, pg_core_1.decimal)("target_price", { precision: 10, scale: 2 }), // Stop loss hunting
    // Status
    status: (0, pg_core_1.text)("status").notNull().default("pending"), // 'pending', 'partial', 'filled', 'cancelled'
    expiresAt: (0, pg_core_1.timestamp)("expires_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_shadow_order_book_user").on(table.userId),
    (0, pg_core_1.index)("idx_shadow_order_book_asset").on(table.assetId),
    (0, pg_core_1.index)("idx_shadow_order_book_status").on(table.status),
]);
// Create insert schemas for Shadow Economy
exports.insertShadowTradeSchema = (0, drizzle_zod_1.createInsertSchema)(exports.shadowTrades).omit({
    id: true,
    createdAt: true,
});
exports.insertDarkPoolSchema = (0, drizzle_zod_1.createInsertSchema)(exports.darkPools).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertShadowOrderBookSchema = (0, drizzle_zod_1.createInsertSchema)(exports.shadowOrderBook).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// NOIR JOURNAL SYSTEM - Dark philosophical trading journal with AI analysis
// Journal Entries - AI-generated noir commentary on trades and market actions
exports.journalEntries = (0, pg_core_1.pgTable)("journal_entries", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    // Entry classification
    entryType: (0, pg_core_1.text)("entry_type").notNull(), // 'trade', 'daily', 'victim', 'milestone', 'confession', 'analysis'
    // Content
    content: (0, pg_core_1.text)("content").notNull(), // The noir journal entry text
    title: (0, pg_core_1.text)("title"), // Optional title for the entry
    // Context
    corruptionAtTime: (0, pg_core_1.decimal)("corruption_at_time", { precision: 5, scale: 2 }), // Corruption level when written
    relatedTradeId: (0, pg_core_1.varchar)("related_trade_id").references(() => exports.trades.id), // If related to specific trade
    relatedVictimId: (0, pg_core_1.varchar)("related_victim_id").references(() => exports.tradingVictims.id), // If related to victim
    // Metadata
    mood: (0, pg_core_1.text)("mood"), // 'contemplative', 'dark', 'nihilistic', 'remorseful', 'cold'
    intensity: (0, pg_core_1.integer)("intensity").default(1), // 1-10 scale of darkness
    wordCount: (0, pg_core_1.integer)("word_count"),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_journal_entries_user").on(table.userId),
    (0, pg_core_1.index)("idx_journal_entries_type").on(table.entryType),
    (0, pg_core_1.index)("idx_journal_entries_created").on(table.createdAt),
]);
// Psychological Profiles - AI analysis of trader psychology over time
exports.psychologicalProfiles = (0, pg_core_1.pgTable)("psychological_profiles", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    // Analysis
    pattern: (0, pg_core_1.text)("pattern").notNull(), // Identified psychological pattern
    analysis: (0, pg_core_1.text)("analysis").notNull(), // Detailed psychological analysis
    // Traits
    dominantTraits: (0, pg_core_1.jsonb)("dominant_traits"), // ['ruthless', 'calculating', 'empathetic', etc.]
    moralAlignment: (0, pg_core_1.text)("moral_alignment"), // 'descending', 'conflicted', 'embracing_darkness'
    tradingStyle: (0, pg_core_1.text)("trading_style"), // 'predatory', 'opportunistic', 'defensive'
    // Metrics
    empathyScore: (0, pg_core_1.decimal)("empathy_score", { precision: 5, scale: 2 }), // 0-100, decreases with corruption
    ruthlessnessIndex: (0, pg_core_1.decimal)("ruthlessness_index", { precision: 5, scale: 2 }), // 0-100, increases with profits
    denialLevel: (0, pg_core_1.decimal)("denial_level", { precision: 5, scale: 2 }), // 0-100, psychological defense mechanisms
    // Evolution tracking
    previousProfile: (0, pg_core_1.text)("previous_profile"), // How they've changed
    turningPoints: (0, pg_core_1.jsonb)("turning_points"), // Key trades that changed them
    // Timestamps
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_psychological_profiles_user").on(table.userId),
]);
// Create insert schemas for Journal System
exports.insertJournalEntrySchema = (0, drizzle_zod_1.createInsertSchema)(exports.journalEntries).omit({
    id: true,
    createdAt: true,
});
exports.insertPsychologicalProfileSchema = (0, drizzle_zod_1.createInsertSchema)(exports.psychologicalProfiles).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// SOCIAL WARFARE SYSTEM - Predatory trading where the weak are consumed by the strong
// Shadow Traders - AI-controlled and real traders appearing as shadows
exports.shadowTraders = (0, pg_core_1.pgTable)("shadow_traders", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").references(() => exports.users.id), // NULL for AI shadows
    shadowName: (0, pg_core_1.text)("shadow_name").notNull(), // "Shadow of Greed", "Fallen Spectre", etc.
    // Shadow characteristics
    strength: (0, pg_core_1.decimal)("strength", { precision: 10, scale: 2 }).default("100.00"), // Trading power
    corruptionLevel: (0, pg_core_1.decimal)("corruption_level", { precision: 5, scale: 2 }).default("0.00"),
    portfolioValue: (0, pg_core_1.decimal)("portfolio_value", { precision: 15, scale: 2 }).default("0.00"),
    // Status tracking
    status: (0, pg_core_1.text)("status").notNull().default("active"), // 'active', 'fallen', 'consumed', 'rising'
    fallenAt: (0, pg_core_1.timestamp)("fallen_at"), // When they fell below threshold
    consumedBy: (0, pg_core_1.varchar)("consumed_by").references(() => exports.users.id), // Who consumed them
    // Visual characteristics
    shadowColor: (0, pg_core_1.text)("shadow_color").default("#000000"), // Hex color based on state
    opacity: (0, pg_core_1.decimal)("opacity", { precision: 3, scale: 2 }).default("0.80"), // Visual opacity
    isAI: (0, pg_core_1.boolean)("is_ai").default(false), // AI-controlled shadow
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_shadow_traders_status").on(table.status),
    (0, pg_core_1.index)("idx_shadow_traders_user").on(table.userId),
]);
// Stolen Positions - Records of vulture trades feeding on the fallen
exports.stolenPositions = (0, pg_core_1.pgTable)("stolen_positions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    thiefId: (0, pg_core_1.varchar)("thief_id").notNull().references(() => exports.users.id),
    victimId: (0, pg_core_1.varchar)("victim_id").notNull().references(() => exports.users.id),
    positionId: (0, pg_core_1.varchar)("position_id").notNull().references(() => exports.positions.id),
    // Theft details
    originalValue: (0, pg_core_1.decimal)("original_value", { precision: 15, scale: 2 }).notNull(),
    stolenValue: (0, pg_core_1.decimal)("stolen_value", { precision: 15, scale: 2 }).notNull(), // 50% discount
    discountRate: (0, pg_core_1.decimal)("discount_rate", { precision: 5, scale: 2 }).default("50.00"),
    // Moral consequences
    corruptionGained: (0, pg_core_1.decimal)("corruption_gained", { precision: 5, scale: 2 }).default("30.00"),
    victimHarm: (0, pg_core_1.decimal)("victim_harm", { precision: 15, scale: 2 }).notNull(),
    // Metadata
    stealMethod: (0, pg_core_1.text)("steal_method").default("vulture"), // 'vulture', 'predator', 'scavenger'
    stolenAt: (0, pg_core_1.timestamp)("stolen_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_stolen_positions_thief").on(table.thiefId),
    (0, pg_core_1.index)("idx_stolen_positions_victim").on(table.victimId),
    (0, pg_core_1.index)("idx_stolen_positions_stolen_at").on(table.stolenAt),
]);
// Trader Warfare - Records of trader-vs-trader conflicts
exports.traderWarfare = (0, pg_core_1.pgTable)("trader_warfare", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    attackerId: (0, pg_core_1.varchar)("attacker_id").notNull().references(() => exports.users.id),
    defenderId: (0, pg_core_1.varchar)("defender_id").notNull().references(() => exports.users.id),
    // Warfare details
    warfareType: (0, pg_core_1.text)("warfare_type").notNull(), // 'steal', 'raid', 'cannibalize', 'hunt'
    outcome: (0, pg_core_1.text)("outcome").notNull(), // 'success', 'failed', 'partial', 'mutual_destruction'
    // Damage and rewards
    attackerGain: (0, pg_core_1.decimal)("attacker_gain", { precision: 15, scale: 2 }).default("0.00"),
    defenderLoss: (0, pg_core_1.decimal)("defender_loss", { precision: 15, scale: 2 }).default("0.00"),
    collateralDamage: (0, pg_core_1.decimal)("collateral_damage", { precision: 15, scale: 2 }).default("0.00"),
    // Brutality metrics
    brutalityScore: (0, pg_core_1.decimal)("brutality_score", { precision: 5, scale: 2 }).default("0.00"),
    victimsCreated: (0, pg_core_1.integer)("victims_created").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_trader_warfare_attacker").on(table.attackerId),
    (0, pg_core_1.index)("idx_trader_warfare_defender").on(table.defenderId),
    (0, pg_core_1.index)("idx_trader_warfare_created").on(table.createdAt),
]);
// Create insert schemas for Warfare System
exports.insertShadowTraderSchema = (0, drizzle_zod_1.createInsertSchema)(exports.shadowTraders).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertStolenPositionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.stolenPositions).omit({
    id: true,
    stolenAt: true,
});
exports.insertTraderWarfareSchema = (0, drizzle_zod_1.createInsertSchema)(exports.traderWarfare).omit({
    id: true,
    createdAt: true,
});
// ==================== NPC Autonomous Traders System ====================
// 1000 autonomous traders with diverse personalities and behaviors
// NPC Traders - Core identity and attributes
exports.npcTraders = (0, pg_core_1.pgTable)("npc_traders", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    traderName: (0, pg_core_1.text)("trader_name").notNull(),
    traderType: (0, pg_core_1.text)("trader_type").notNull(),
    firmId: (0, pg_core_1.varchar)("firm_id"),
    tradingPersonality: (0, pg_core_1.jsonb)("trading_personality"),
    preferredAssets: (0, pg_core_1.text)("preferred_assets").array(),
    avoidedAssets: (0, pg_core_1.text)("avoided_assets").array(),
    tradingStyle: (0, pg_core_1.text)("trading_style"),
    availableCapital: (0, pg_core_1.decimal)("available_capital", { precision: 15, scale: 2 }).notNull(),
    maxPositionSize: (0, pg_core_1.decimal)("max_position_size", { precision: 15, scale: 2 }),
    maxDailyVolume: (0, pg_core_1.decimal)("max_daily_volume", { precision: 15, scale: 2 }),
    leveragePreference: (0, pg_core_1.decimal)("leverage_preference", { precision: 5, scale: 2 }),
    aggressiveness: (0, pg_core_1.decimal)("aggressiveness", { precision: 5, scale: 2 }),
    intelligence: (0, pg_core_1.decimal)("intelligence", { precision: 5, scale: 2 }),
    emotionality: (0, pg_core_1.decimal)("emotionality", { precision: 5, scale: 2 }),
    adaptability: (0, pg_core_1.decimal)("adaptability", { precision: 5, scale: 2 }),
    tradesPerDay: (0, pg_core_1.integer)("trades_per_day"),
    minTimeBetweenTradesMinutes: (0, pg_core_1.integer)("min_time_between_trades_minutes"),
    totalTrades: (0, pg_core_1.integer)("total_trades").default(0),
    winRate: (0, pg_core_1.decimal)("win_rate", { precision: 5, scale: 2 }).default("0.00"),
    avgTradeReturn: (0, pg_core_1.decimal)("avg_trade_return", { precision: 10, scale: 4 }),
    totalPnL: (0, pg_core_1.decimal)("total_pnl", { precision: 15, scale: 2 }),
    sharpeRatio: (0, pg_core_1.decimal)("sharpe_ratio", { precision: 10, scale: 4 }),
    maxDrawdown: (0, pg_core_1.decimal)("max_drawdown", { precision: 10, scale: 4 }),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    lastTradeTime: (0, pg_core_1.timestamp)("last_trade_time"),
    nextTradeTime: (0, pg_core_1.timestamp)("next_trade_time"),
    pausedUntil: (0, pg_core_1.timestamp)("paused_until"),
    influenceOnMarket: (0, pg_core_1.decimal)("influence_on_market", { precision: 5, scale: 2 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// NPC Trader Strategies - Trading strategy preferences
exports.npcTraderStrategies = (0, pg_core_1.pgTable)("npc_trader_strategies", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    traderId: (0, pg_core_1.varchar)("trader_id").notNull().references(() => exports.npcTraders.id),
    preferredAssets: (0, pg_core_1.text)("preferred_assets").array(), // Asset IDs they favor
    holdingPeriodDays: (0, pg_core_1.integer)("holding_period_days").notNull(), // Typical hold time
    positionSizingStrategy: (0, pg_core_1.text)("position_sizing_strategy").notNull(), // 'fixed', 'percentage', 'kelly_criterion'
    maxPositionSize: (0, pg_core_1.decimal)("max_position_size", { precision: 5, scale: 2 }).notNull(), // Max % of capital per position
    stopLossPercent: (0, pg_core_1.decimal)("stop_loss_percent", { precision: 5, scale: 2 }), // Automatic loss cut-off
    takeProfitPercent: (0, pg_core_1.decimal)("take_profit_percent", { precision: 5, scale: 2 }), // Automatic gain target
});
// NPC Trader Psychology - Behavioral triggers and emotions
exports.npcTraderPsychology = (0, pg_core_1.pgTable)("npc_trader_psychology", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    traderId: (0, pg_core_1.varchar)("trader_id").notNull().references(() => exports.npcTraders.id),
    panicThreshold: (0, pg_core_1.decimal)("panic_threshold", { precision: 5, scale: 2 }).notNull(), // Price drop % that triggers sell
    greedThreshold: (0, pg_core_1.decimal)("greed_threshold", { precision: 5, scale: 2 }).notNull(), // Gain % that triggers buy
    fomoSusceptibility: (0, pg_core_1.integer)("fomo_susceptibility").notNull(), // 1-10, tendency to chase trends
    confidenceBias: (0, pg_core_1.integer)("confidence_bias").notNull(), // 1-10, overconfidence level
    lossCutSpeed: (0, pg_core_1.text)("loss_cut_speed").notNull(), // 'instant', 'slow', 'never'
    newsReaction: (0, pg_core_1.text)("news_reaction").notNull(), // 'ignore', 'consider', 'emotional'
});
// NPC Trader Positions - Current holdings
exports.npcTraderPositions = (0, pg_core_1.pgTable)("npc_trader_positions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    traderId: (0, pg_core_1.varchar)("trader_id").notNull().references(() => exports.npcTraders.id),
    assetId: (0, pg_core_1.varchar)("asset_id").notNull().references(() => exports.assets.id),
    quantity: (0, pg_core_1.integer)("quantity").notNull(), // Shares held
    entryPrice: (0, pg_core_1.decimal)("entry_price", { precision: 10, scale: 2 }).notNull(), // Avg purchase price
    entryDate: (0, pg_core_1.timestamp)("entry_date").notNull(), // When position opened
    unrealizedPnl: (0, pg_core_1.decimal)("unrealized_pnl", { precision: 10, scale: 2 }).default("0.00"), // Current profit/loss
    targetExitPrice: (0, pg_core_1.decimal)("target_exit_price", { precision: 10, scale: 2 }), // Planned sell price (nullable)
});
// NPC Trader Activity Log - Trading history
exports.npcTraderActivityLog = (0, pg_core_1.pgTable)("npc_trader_activity_log", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    traderId: (0, pg_core_1.varchar)("trader_id").notNull().references(() => exports.npcTraders.id),
    action: (0, pg_core_1.text)("action").notNull(), // 'buy', 'sell', 'hold', 'analyze'
    assetId: (0, pg_core_1.varchar)("asset_id").references(() => exports.assets.id), // Nullable for non-trade actions
    quantity: (0, pg_core_1.integer)("quantity"), // Nullable for non-trade actions
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }), // Nullable for non-trade actions
    reasoning: (0, pg_core_1.text)("reasoning"), // Why they made this decision
    timestamp: (0, pg_core_1.timestamp)("timestamp").defaultNow(),
});
// Create insert schemas for NPC Traders
exports.insertNpcTraderSchema = (0, drizzle_zod_1.createInsertSchema)(exports.npcTraders).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertNpcTraderStrategySchema = (0, drizzle_zod_1.createInsertSchema)(exports.npcTraderStrategies).omit({
    id: true,
});
exports.insertNpcTraderPsychologySchema = (0, drizzle_zod_1.createInsertSchema)(exports.npcTraderPsychology).omit({
    id: true,
});
exports.insertNpcTraderPositionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.npcTraderPositions).omit({
    id: true,
});
exports.insertNpcTraderActivityLogSchema = (0, drizzle_zod_1.createInsertSchema)(exports.npcTraderActivityLog).omit({
    id: true,
    timestamp: true,
});
// Alignment tracking schemas for hidden psychological profiling
exports.insertAlignmentScoreSchema = (0, drizzle_zod_1.createInsertSchema)(exports.alignmentScores).omit({ id: true, createdAt: true, updatedAt: true });
exports.insertUserDecisionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userDecisions).omit({ id: true, createdAt: true });
// Psychological Profiling Entry Test - Type exports
exports.insertTestQuestionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.testQuestions).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertTestResponseSchema = (0, drizzle_zod_1.createInsertSchema)(exports.testResponses).omit({
    id: true,
    respondedAt: true,
});
exports.insertTestResultsSchema = (0, drizzle_zod_1.createInsertSchema)(exports.testResults).omit({
    id: true,
    completedAt: true,
});
exports.insertTestSessionsSchema = (0, drizzle_zod_1.createInsertSchema)(exports.testSessions).omit({
    id: true,
    startedAt: true,
    lastActivityAt: true,
});
// Seven Houses of Paneltown - Type exports
exports.insertSevenHousesSchema = (0, drizzle_zod_1.createInsertSchema)(exports.sevenHouses).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertHousePowerRankingsSchema = (0, drizzle_zod_1.createInsertSchema)(exports.housePowerRankings).omit({
    id: true,
    createdAt: true,
});
exports.insertHouseMarketEventsSchema = (0, drizzle_zod_1.createInsertSchema)(exports.houseMarketEvents).omit({
    id: true,
    createdAt: true,
    eventTimestamp: true,
});
// Article Pages - Type exports
exports.insertArticlePageSchema = (0, drizzle_zod_1.createInsertSchema)(exports.articlePages).omit({
    id: true,
    viewCount: true,
    createdAt: true,
    updatedAt: true,
});
// ============================================================================
// MARVEL UNIVERSE SCHEMA - Comprehensive tradeable asset system
// ============================================================================
// Design philosophy: EVERYTHING is tradeable (characters, gadgets, locations, 
// teams, creators, series, key issues, family members). News-driven price 
// mechanics based on relationship strength and franchise tier classification.
// Marvel Comics - Core comic book issues
exports.marvelComics = (0, pg_core_1.pgTable)("marvel_comics", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Comic identification
    comicName: (0, pg_core_1.text)("comic_name").notNull(),
    seriesId: (0, pg_core_1.varchar)("series_id"), // Links to marvel_series
    issueNumber: (0, pg_core_1.integer)("issue_number"),
    volume: (0, pg_core_1.integer)("volume"),
    issueTitle: (0, pg_core_1.text)("issue_title"),
    publishDate: (0, pg_core_1.text)("publish_date"),
    activeYears: (0, pg_core_1.text)("active_years"),
    // Content & description
    issueDescription: (0, pg_core_1.text)("issue_description"),
    storyArcs: (0, pg_core_1.text)("story_arcs").array(),
    keyEvents: (0, pg_core_1.text)("key_events").array(), // Major plot events for relationship tracking
    // Cover & visual assets
    coverImageUrl: (0, pg_core_1.text)("cover_image_url"),
    variantCovers: (0, pg_core_1.jsonb)("variant_covers"), // Array of variant cover URLs
    // Publishing details
    format: (0, pg_core_1.text)("format"), // 'standard', 'annual', 'special', 'one-shot'
    pageCount: (0, pg_core_1.integer)("page_count"),
    price: (0, pg_core_1.text)("price"),
    // Trading platform integration
    symbol: (0, pg_core_1.text)("symbol").notNull().unique(), // Trading symbol (e.g., UNCXM.V1.#141)
    franchiseTier: (0, pg_core_1.text)("franchise_tier"), // 'blue-chip', 'mid-cap', 'small-cap', 'penny-stock'
    seriesPrestigeMultiplier: (0, pg_core_1.decimal)("series_prestige_multiplier", { precision: 5, scale: 2 }).default("1.00"), // Watchmen vs Action Comics #1
    baseMarketValue: (0, pg_core_1.decimal)("base_market_value", { precision: 12, scale: 2 }),
    currentPrice: (0, pg_core_1.decimal)("current_price", { precision: 12, scale: 2 }),
    priceChangePercent: (0, pg_core_1.decimal)("price_change_percent", { precision: 8, scale: 4 }),
    totalMarketValue: (0, pg_core_1.decimal)("total_market_value", { precision: 15, scale: 2 }),
    totalFloat: (0, pg_core_1.bigint)("total_float", { mode: "number" }), // Number of tradeable shares
    // Key issue classification
    isKeyIssue: (0, pg_core_1.boolean)("is_key_issue").default(false),
    keyIssueType: (0, pg_core_1.text)("key_issue_type"), // 'first-appearance', 'death', 'origin', 'team-debut'
    keyIssueDescription: (0, pg_core_1.text)("key_issue_description"),
    // Search & discovery
    contentEmbedding: (0, pg_core_1.vector)("content_embedding", { dimensions: 1536 }),
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_marvel_comics_series_id").on(table.seriesId),
    (0, pg_core_1.index)("idx_marvel_comics_symbol").on(table.symbol),
    (0, pg_core_1.index)("idx_marvel_comics_franchise_tier").on(table.franchiseTier),
    (0, pg_core_1.index)("idx_marvel_comics_key_issue").on(table.isKeyIssue),
]);
// Marvel Characters - Heroes, villains, supporting cast (ALL tradeable)
exports.marvelCharacters = (0, pg_core_1.pgTable)("marvel_characters", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Character identification
    name: (0, pg_core_1.text)("name").notNull(),
    aliases: (0, pg_core_1.text)("aliases").array(), // Spider-Man, Peter Parker, Friendly Neighborhood Spider-Man
    realName: (0, pg_core_1.text)("real_name"),
    // Character type & role
    characterType: (0, pg_core_1.text)("character_type").notNull(), // 'hero', 'villain', 'anti-hero', 'supporting', 'civilian'
    characterRole: (0, pg_core_1.text)("character_role"), // 'protagonist', 'antagonist', 'sidekick', 'mentor', 'love-interest', 'family-member'
    // Franchise tier classification (critical for pricing)
    franchiseTier: (0, pg_core_1.text)("franchise_tier").notNull(), // 'blue-chip' (Spider-Man), 'mid-cap' (Watchmen), 'small-cap', 'penny-stock'
    franchiseImportance: (0, pg_core_1.text)("franchise_importance"), // 'franchise-hero', 'critically-important', 'recurring', 'minor', 'obscure'
    // Character details
    description: (0, pg_core_1.text)("description"),
    powers: (0, pg_core_1.text)("powers").array(),
    abilities: (0, pg_core_1.text)("abilities").array(),
    weaknesses: (0, pg_core_1.text)("weaknesses").array(),
    // Affiliations & relationships
    teams: (0, pg_core_1.text)("teams").array(), // Avengers, X-Men, Fantastic Four
    familyMembers: (0, pg_core_1.text)("family_members").array(), // Tradeable relationships!
    enemies: (0, pg_core_1.text)("enemies").array(),
    allies: (0, pg_core_1.text)("allies").array(),
    // Visual assets
    imageUrl: (0, pg_core_1.text)("image_url"),
    thumbnailUrl: (0, pg_core_1.text)("thumbnail_url"),
    // First appearance & history
    firstAppearanceComicId: (0, pg_core_1.varchar)("first_appearance_comic_id"),
    firstAppearanceDate: (0, pg_core_1.text)("first_appearance_date"),
    appearanceCount: (0, pg_core_1.integer)("appearance_count").default(0),
    // Trading platform integration
    symbol: (0, pg_core_1.text)("symbol").notNull().unique(),
    baseMarketValue: (0, pg_core_1.decimal)("base_market_value", { precision: 12, scale: 2 }),
    currentPrice: (0, pg_core_1.decimal)("current_price", { precision: 12, scale: 2 }),
    priceChangePercent: (0, pg_core_1.decimal)("price_change_percent", { precision: 8, scale: 4 }),
    totalMarketValue: (0, pg_core_1.decimal)("total_market_value", { precision: 15, scale: 2 }),
    totalFloat: (0, pg_core_1.bigint)("total_float", { mode: "number" }),
    // Relationship recency score (for news-driven pricing)
    relationshipRecencyScore: (0, pg_core_1.decimal)("relationship_recency_score", { precision: 8, scale: 4 }).default("0.00"), // Bane is current, Solomon Grundy is not
    lastMediaMention: (0, pg_core_1.timestamp)("last_media_mention"),
    // Search & discovery
    contentEmbedding: (0, pg_core_1.vector)("content_embedding", { dimensions: 1536 }),
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_marvel_characters_symbol").on(table.symbol),
    (0, pg_core_1.index)("idx_marvel_characters_franchise_tier").on(table.franchiseTier),
    (0, pg_core_1.index)("idx_marvel_characters_character_type").on(table.characterType),
    (0, pg_core_1.index)("idx_marvel_characters_name").on(table.name),
]);
// Marvel Creators - Writers, artists, editors (ALL tradeable)
exports.marvelCreators = (0, pg_core_1.pgTable)("marvel_creators", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Creator identification
    name: (0, pg_core_1.text)("name").notNull(),
    // Creator roles
    primaryRole: (0, pg_core_1.text)("primary_role").notNull(), // 'writer', 'penciler', 'inker', 'colorist', 'letterer', 'editor', 'cover-artist'
    allRoles: (0, pg_core_1.text)("all_roles").array(), // All roles they've performed
    // Career & achievements
    biography: (0, pg_core_1.text)("biography"),
    notableWorks: (0, pg_core_1.text)("notable_works").array(),
    awards: (0, pg_core_1.text)("awards").array(),
    yearsActive: (0, pg_core_1.text)("years_active"),
    // Franchise importance (Stan Lee vs random inker)
    franchiseTier: (0, pg_core_1.text)("franchise_tier"), // 'legendary', 'acclaimed', 'established', 'emerging', 'minor'
    creatorImportance: (0, pg_core_1.text)("creator_importance"), // 'franchise-defining', 'critically-important', 'prolific', 'occasional'
    // Visual assets
    imageUrl: (0, pg_core_1.text)("image_url"),
    // Statistics
    totalWorks: (0, pg_core_1.integer)("total_works").default(0),
    totalCharactersCreated: (0, pg_core_1.integer)("total_characters_created").default(0),
    // Trading platform integration
    symbol: (0, pg_core_1.text)("symbol").notNull().unique(),
    baseMarketValue: (0, pg_core_1.decimal)("base_market_value", { precision: 12, scale: 2 }),
    currentPrice: (0, pg_core_1.decimal)("current_price", { precision: 12, scale: 2 }),
    priceChangePercent: (0, pg_core_1.decimal)("price_change_percent", { precision: 8, scale: 4 }),
    totalMarketValue: (0, pg_core_1.decimal)("total_market_value", { precision: 15, scale: 2 }),
    totalFloat: (0, pg_core_1.bigint)("total_float", { mode: "number" }),
    // Relationship tracking
    relationshipRecencyScore: (0, pg_core_1.decimal)("relationship_recency_score", { precision: 8, scale: 4 }).default("0.00"),
    lastMediaMention: (0, pg_core_1.timestamp)("last_media_mention"),
    // Search & discovery
    contentEmbedding: (0, pg_core_1.vector)("content_embedding", { dimensions: 1536 }),
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_marvel_creators_symbol").on(table.symbol),
    (0, pg_core_1.index)("idx_marvel_creators_name").on(table.name),
    (0, pg_core_1.index)("idx_marvel_creators_primary_role").on(table.primaryRole),
]);
// Marvel Series - Comic book series (tradeable)
exports.marvelSeries = (0, pg_core_1.pgTable)("marvel_series", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Series identification
    name: (0, pg_core_1.text)("name").notNull(),
    volume: (0, pg_core_1.integer)("volume"),
    startYear: (0, pg_core_1.integer)("start_year"),
    endYear: (0, pg_core_1.integer)("end_year"),
    activeYears: (0, pg_core_1.text)("active_years"),
    // Series details
    description: (0, pg_core_1.text)("description"),
    totalIssues: (0, pg_core_1.integer)("total_issues").default(0),
    publishingStatus: (0, pg_core_1.text)("publishing_status"), // 'ongoing', 'completed', 'cancelled', 'on-hiatus'
    // Critical acclaim & prestige
    seriesPrestigeLevel: (0, pg_core_1.text)("series_prestige_level"), // 'iconic', 'acclaimed', 'popular', 'standard', 'obscure'
    criticalAcclaim: (0, pg_core_1.text)("critical_acclaim").array(), // TIME Magazine top 10, Eisner Awards, etc.
    // Visual assets
    coverImageUrl: (0, pg_core_1.text)("cover_image_url"),
    // Trading platform integration
    symbol: (0, pg_core_1.text)("symbol").notNull().unique(),
    franchiseTier: (0, pg_core_1.text)("franchise_tier"),
    baseMarketValue: (0, pg_core_1.decimal)("base_market_value", { precision: 12, scale: 2 }),
    currentPrice: (0, pg_core_1.decimal)("current_price", { precision: 12, scale: 2 }),
    priceChangePercent: (0, pg_core_1.decimal)("price_change_percent", { precision: 8, scale: 4 }),
    totalMarketValue: (0, pg_core_1.decimal)("total_market_value", { precision: 15, scale: 2 }),
    totalFloat: (0, pg_core_1.bigint)("total_float", { mode: "number" }),
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_marvel_series_symbol").on(table.symbol),
    (0, pg_core_1.index)("idx_marvel_series_name").on(table.name),
]);
// Marvel Teams - Superhero teams (tradeable)
exports.marvelTeams = (0, pg_core_1.pgTable)("marvel_teams", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Team identification
    name: (0, pg_core_1.text)("name").notNull(),
    aliases: (0, pg_core_1.text)("aliases").array(),
    // Team details
    description: (0, pg_core_1.text)("description"),
    foundedDate: (0, pg_core_1.text)("founded_date"),
    status: (0, pg_core_1.text)("status"), // 'active', 'disbanded', 'reformed'
    // Franchise tier
    franchiseTier: (0, pg_core_1.text)("franchise_tier"), // Avengers vs Great Lakes Avengers
    // Visual assets
    imageUrl: (0, pg_core_1.text)("image_url"),
    logoUrl: (0, pg_core_1.text)("logo_url"),
    // Trading platform integration
    symbol: (0, pg_core_1.text)("symbol").notNull().unique(),
    baseMarketValue: (0, pg_core_1.decimal)("base_market_value", { precision: 12, scale: 2 }),
    currentPrice: (0, pg_core_1.decimal)("current_price", { precision: 12, scale: 2 }),
    priceChangePercent: (0, pg_core_1.decimal)("price_change_percent", { precision: 8, scale: 4 }),
    totalMarketValue: (0, pg_core_1.decimal)("total_market_value", { precision: 15, scale: 2 }),
    totalFloat: (0, pg_core_1.bigint)("total_float", { mode: "number" }),
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_marvel_teams_symbol").on(table.symbol),
    (0, pg_core_1.index)("idx_marvel_teams_name").on(table.name),
]);
// Relationship tracking for news-driven pricing
exports.marvelRelationships = (0, pg_core_1.pgTable)("marvel_relationships", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Relationship entities
    entityType1: (0, pg_core_1.text)("entity_type_1").notNull(), // 'character', 'creator', 'series', 'team', 'location', 'gadget'
    entityId1: (0, pg_core_1.varchar)("entity_id_1").notNull(),
    entityType2: (0, pg_core_1.text)("entity_type_2").notNull(),
    entityId2: (0, pg_core_1.varchar)("entity_id_2").notNull(),
    // Relationship strength & recency
    relationshipType: (0, pg_core_1.text)("relationship_type"), // 'appears-with', 'created-by', 'member-of', 'located-in', 'wields'
    relationshipStrength: (0, pg_core_1.decimal)("relationship_strength", { precision: 5, scale: 2 }).default("1.00"), // 0-100
    relationshipRecency: (0, pg_core_1.decimal)("relationship_recency", { precision: 5, scale: 2 }).default("0.00"), // Decay over time
    lastRefreshed: (0, pg_core_1.timestamp)("last_refreshed"), // When relationship was last mentioned in new content
    // Appearance tracking
    comicAppearances: (0, pg_core_1.integer)("comic_appearances").default(0),
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_marvel_relationships_entity1").on(table.entityId1),
    (0, pg_core_1.index)("idx_marvel_relationships_entity2").on(table.entityId2),
    (0, pg_core_1.index)("idx_marvel_relationships_type").on(table.relationshipType),
]);
// Character appearances in comics (for relationship tracking)
exports.marvelCharacterAppearances = (0, pg_core_1.pgTable)("marvel_character_appearances", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    comicId: (0, pg_core_1.varchar)("comic_id").notNull().references(() => exports.marvelComics.id),
    characterId: (0, pg_core_1.varchar)("character_id").notNull().references(() => exports.marvelCharacters.id),
    // Appearance details
    appearanceType: (0, pg_core_1.text)("appearance_type"), // 'main', 'supporting', 'cameo', 'mentioned'
    pageCount: (0, pg_core_1.integer)("page_count"), // How many pages character appears on
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_marvel_appearances_comic").on(table.comicId),
    (0, pg_core_1.index)("idx_marvel_appearances_character").on(table.characterId),
]);
// Creator credits in comics (for relationship tracking)
exports.marvelCreatorCredits = (0, pg_core_1.pgTable)("marvel_creator_credits", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    comicId: (0, pg_core_1.varchar)("comic_id").notNull().references(() => exports.marvelComics.id),
    creatorId: (0, pg_core_1.varchar)("creator_id").notNull().references(() => exports.marvelCreators.id),
    // Credit details
    role: (0, pg_core_1.text)("role").notNull(), // 'writer', 'penciler', 'inker', 'colorist', 'letterer', 'editor', 'cover-artist'
    creditOrder: (0, pg_core_1.integer)("credit_order"), // For determining primary vs secondary credits
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_marvel_credits_comic").on(table.comicId),
    (0, pg_core_1.index)("idx_marvel_credits_creator").on(table.creatorId),
    (0, pg_core_1.index)("idx_marvel_credits_role").on(table.role),
]);
// ============================================================================
// PUBLISHER-SPECIFIC COMIC TABLES - Organized by major publishers
// ============================================================================
// DC Comics - Separated from Marvel for clear distinction
exports.dcComics = (0, pg_core_1.pgTable)("dc_comics", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    seriesId: (0, pg_core_1.varchar)("series_id"),
    comicName: (0, pg_core_1.text)("comic_name").notNull(),
    issueNumber: (0, pg_core_1.integer)("issue_number"),
    volume: (0, pg_core_1.integer)("volume"),
    issueTitle: (0, pg_core_1.text)("issue_title"),
    publishDate: (0, pg_core_1.text)("publish_date"),
    issueDescription: (0, pg_core_1.text)("issue_description"),
    // Credits
    writer: (0, pg_core_1.text)("writer"),
    penciler: (0, pg_core_1.text)("penciler"),
    coverArtist: (0, pg_core_1.text)("cover_artist"),
    inker: (0, pg_core_1.text)("inker"),
    colorist: (0, pg_core_1.text)("colorist"),
    letterer: (0, pg_core_1.text)("letterer"),
    editor: (0, pg_core_1.text)("editor"),
    // Publishing details
    imprint: (0, pg_core_1.text)("imprint"), // DC, Vertigo, Wildstorm, etc.
    format: (0, pg_core_1.text)("format"),
    rating: (0, pg_core_1.text)("rating"),
    price: (0, pg_core_1.text)("price"),
    // Visual assets
    coverImageUrl: (0, pg_core_1.text)("cover_image_url"),
    // Market data
    currentValue: (0, pg_core_1.decimal)("current_value", { precision: 10, scale: 2 }),
    gradeCondition: (0, pg_core_1.text)("grade_condition"),
    marketTrend: (0, pg_core_1.text)("market_trend"),
    // Search and metadata
    activeYears: (0, pg_core_1.text)("active_years"),
    contentEmbedding: (0, pg_core_1.vector)("content_embedding", { dimensions: 1536 }),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_dc_comics_series_id").on(table.seriesId),
    (0, pg_core_1.index)("idx_dc_comics_issue_number").on(table.issueNumber),
    (0, pg_core_1.index)("idx_dc_comics_comic_name").on(table.comicName),
]);
// Other/Indie Comics - Image, Dark Horse, IDW, Valiant, BOOM!, etc.
exports.otherComics = (0, pg_core_1.pgTable)("other_comics", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    seriesId: (0, pg_core_1.varchar)("series_id"),
    comicName: (0, pg_core_1.text)("comic_name").notNull(),
    publisher: (0, pg_core_1.text)("publisher").notNull(), // Image, Dark Horse, IDW, etc.
    issueNumber: (0, pg_core_1.integer)("issue_number"),
    volume: (0, pg_core_1.integer)("volume"),
    issueTitle: (0, pg_core_1.text)("issue_title"),
    publishDate: (0, pg_core_1.text)("publish_date"),
    issueDescription: (0, pg_core_1.text)("issue_description"),
    // Credits
    writer: (0, pg_core_1.text)("writer"),
    penciler: (0, pg_core_1.text)("penciler"),
    coverArtist: (0, pg_core_1.text)("cover_artist"),
    inker: (0, pg_core_1.text)("inker"),
    colorist: (0, pg_core_1.text)("colorist"),
    letterer: (0, pg_core_1.text)("letterer"),
    editor: (0, pg_core_1.text)("editor"),
    // Publishing details
    imprint: (0, pg_core_1.text)("imprint"),
    format: (0, pg_core_1.text)("format"),
    rating: (0, pg_core_1.text)("rating"),
    price: (0, pg_core_1.text)("price"),
    // Visual assets
    coverImageUrl: (0, pg_core_1.text)("cover_image_url"),
    // Market data
    currentValue: (0, pg_core_1.decimal)("current_value", { precision: 10, scale: 2 }),
    gradeCondition: (0, pg_core_1.text)("grade_condition"),
    marketTrend: (0, pg_core_1.text)("market_trend"),
    // Search and metadata
    activeYears: (0, pg_core_1.text)("active_years"),
    contentEmbedding: (0, pg_core_1.vector)("content_embedding", { dimensions: 1536 }),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_other_comics_series_id").on(table.seriesId),
    (0, pg_core_1.index)("idx_other_comics_publisher").on(table.publisher),
    (0, pg_core_1.index)("idx_other_comics_issue_number").on(table.issueNumber),
    (0, pg_core_1.index)("idx_other_comics_comic_name").on(table.comicName),
]);
// ============================================================================
// MANGA SEPARATION - Isolated manga/anime assets for future expansion
// ============================================================================
// Manga Comics - Separated from main superhero assets
exports.mangaComics = (0, pg_core_1.pgTable)("manga_comics", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    symbol: (0, pg_core_1.text)("symbol").notNull().unique(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description"),
    coverImageUrl: (0, pg_core_1.text)("cover_image_url"),
    // Manga-specific metadata
    mangaType: (0, pg_core_1.text)("manga_type"), // 'manga', 'manhwa', 'manhua', 'webtoon'
    genres: (0, pg_core_1.text)("genres").array(), // ['Action', 'Romance', 'Fantasy']
    tags: (0, pg_core_1.text)("tags").array(), // More specific classification
    year: (0, pg_core_1.integer)("year"),
    rating: (0, pg_core_1.decimal)("rating", { precision: 3, scale: 1 }), // 0.0 to 5.0
    // Pricing data (from Kaggle dataset)
    totalFloat: (0, pg_core_1.integer)("total_float"),
    baseMarketValue: (0, pg_core_1.decimal)("base_market_value", { precision: 15, scale: 2 }),
    currentPrice: (0, pg_core_1.decimal)("current_price", { precision: 10, scale: 2 }),
    totalMarketValue: (0, pg_core_1.decimal)("total_market_value", { precision: 15, scale: 2 }),
    // Pricing breakdown
    regionalScalar: (0, pg_core_1.decimal)("regional_scalar", { precision: 5, scale: 2 }),
    tierMultiplier: (0, pg_core_1.decimal)("tier_multiplier", { precision: 5, scale: 2 }),
    franchiseWeight: (0, pg_core_1.decimal)("franchise_weight", { precision: 5, scale: 2 }),
    appearanceModifier: (0, pg_core_1.decimal)("appearance_modifier", { precision: 5, scale: 2 }),
    // Source tracking
    dataSource: (0, pg_core_1.text)("data_source").default("kaggle_manga_comprehensive"),
    sourceMetadata: (0, pg_core_1.jsonb)("source_metadata"),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_manga_comics_symbol").on(table.symbol),
    (0, pg_core_1.index)("idx_manga_comics_year").on(table.year),
    (0, pg_core_1.index)("idx_manga_comics_manga_type").on(table.mangaType),
]);
// Manga Characters - For future character-level trading
exports.mangaCharacters = (0, pg_core_1.pgTable)("manga_characters", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    symbol: (0, pg_core_1.text)("symbol").notNull().unique(),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    // Character details
    series: (0, pg_core_1.text)("series"), // Which manga/anime they're from
    role: (0, pg_core_1.text)("role"), // 'protagonist', 'antagonist', 'supporting'
    // Metadata
    metadata: (0, pg_core_1.jsonb)("metadata"),
    dataSource: (0, pg_core_1.text)("data_source"),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_manga_characters_symbol").on(table.symbol),
    (0, pg_core_1.index)("idx_manga_characters_series").on(table.series),
]);
// Manga Creators - Authors, artists, studios
exports.mangaCreators = (0, pg_core_1.pgTable)("manga_creators", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    symbol: (0, pg_core_1.text)("symbol").notNull().unique(),
    name: (0, pg_core_1.text)("name").notNull(),
    role: (0, pg_core_1.text)("role"), // 'author', 'artist', 'studio'
    bio: (0, pg_core_1.text)("bio"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    // Notable works
    notableWorks: (0, pg_core_1.text)("notable_works").array(),
    // Metadata
    metadata: (0, pg_core_1.jsonb)("metadata"),
    dataSource: (0, pg_core_1.text)("data_source"),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_manga_creators_symbol").on(table.symbol),
    (0, pg_core_1.index)("idx_manga_creators_role").on(table.role),
]);
// Manga Series - Grouping for manga series
exports.mangaSeries = (0, pg_core_1.pgTable)("manga_series", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    seriesName: (0, pg_core_1.text)("series_name").notNull().unique(),
    description: (0, pg_core_1.text)("description"),
    coverImageUrl: (0, pg_core_1.text)("cover_image_url"),
    // Series details
    totalVolumes: (0, pg_core_1.integer)("total_volumes"),
    totalChapters: (0, pg_core_1.integer)("total_chapters"),
    status: (0, pg_core_1.text)("status"), // 'ongoing', 'completed', 'hiatus'
    startYear: (0, pg_core_1.integer)("start_year"),
    endYear: (0, pg_core_1.integer)("end_year"),
    // Classification
    genres: (0, pg_core_1.text)("genres").array(),
    tags: (0, pg_core_1.text)("tags").array(),
    // Metadata
    metadata: (0, pg_core_1.jsonb)("metadata"),
    dataSource: (0, pg_core_1.text)("data_source"),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_manga_series_name").on(table.seriesName),
    (0, pg_core_1.index)("idx_manga_series_status").on(table.status),
]);
// Manga Insert Schemas
exports.insertMangaComicSchema = (0, drizzle_zod_1.createInsertSchema)(exports.mangaComics).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertMangaCharacterSchema = (0, drizzle_zod_1.createInsertSchema)(exports.mangaCharacters).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertMangaCreatorSchema = (0, drizzle_zod_1.createInsertSchema)(exports.mangaCreators).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertMangaSeriesSchema = (0, drizzle_zod_1.createInsertSchema)(exports.mangaSeries).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// ============================================================================
// MARVEL LOCATIONS - Tradeable location assets
// ============================================================================
exports.marvelLocations = (0, pg_core_1.pgTable)("marvel_locations", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    symbol: (0, pg_core_1.text)("symbol").notNull().unique(),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    // Location classification
    locationType: (0, pg_core_1.text)("location_type"), // 'realm', 'nation', 'headquarters', 'prison', 'dimension', etc.
    tier: (0, pg_core_1.integer)("tier").notNull(), // 1=iconic, 2=headquarters, 3=regional
    primaryUniverse: (0, pg_core_1.text)("primary_universe"), // 'Earth-616', 'Asgardian', 'Dark Dimension', etc.
    // Comic reference
    firstAppearance: (0, pg_core_1.text)("first_appearance"),
    firstAppearanceComicId: (0, pg_core_1.varchar)("first_appearance_comic_id"),
    // Relationships
    notableResidents: (0, pg_core_1.text)("notable_residents").array(), // Character names/IDs
    relatedCharacterIds: (0, pg_core_1.text)("related_character_ids").array(),
    franchiseTags: (0, pg_core_1.text)("franchise_tags").array(),
    // Pricing data
    totalFloat: (0, pg_core_1.integer)("total_float"),
    baseMarketValue: (0, pg_core_1.decimal)("base_market_value", { precision: 15, scale: 2 }),
    currentPrice: (0, pg_core_1.decimal)("current_price", { precision: 10, scale: 2 }),
    totalMarketValue: (0, pg_core_1.decimal)("total_market_value", { precision: 15, scale: 2 }),
    // Source tracking
    dataSource: (0, pg_core_1.text)("data_source").default("marvel_curated"),
    metadata: (0, pg_core_1.jsonb)("metadata"),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_marvel_locations_symbol").on(table.symbol),
    (0, pg_core_1.index)("idx_marvel_locations_tier").on(table.tier),
    (0, pg_core_1.index)("idx_marvel_locations_type").on(table.locationType),
]);
// ============================================================================
// MARVEL GADGETS - Tradeable gadget/artifact assets
// ============================================================================
exports.marvelGadgets = (0, pg_core_1.pgTable)("marvel_gadgets", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    symbol: (0, pg_core_1.text)("symbol").notNull().unique(),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    // Gadget classification
    gadgetCategory: (0, pg_core_1.text)("gadget_category"), // 'weapon', 'cosmic_artifact', 'powered_armor', 'vehicle', etc.
    tier: (0, pg_core_1.integer)("tier").notNull(), // 1=cosmic artifacts, 2=signature items, 3=support tech
    // Creation info
    creator: (0, pg_core_1.text)("creator"), // Character/entity who created it
    creatorCharacterId: (0, pg_core_1.varchar)("creator_character_id"),
    powerSource: (0, pg_core_1.text)("power_source"), // What powers/enables the gadget
    // Comic reference
    firstAppearance: (0, pg_core_1.text)("first_appearance"),
    firstAppearanceComicId: (0, pg_core_1.varchar)("first_appearance_comic_id"),
    // Relationships
    associatedCharacters: (0, pg_core_1.text)("associated_characters").array(), // Who uses/wields it
    associatedTeams: (0, pg_core_1.text)("associated_teams").array(),
    relatedCharacterIds: (0, pg_core_1.text)("related_character_ids").array(),
    franchiseTags: (0, pg_core_1.text)("franchise_tags").array(),
    // Pricing data
    totalFloat: (0, pg_core_1.integer)("total_float"),
    baseMarketValue: (0, pg_core_1.decimal)("base_market_value", { precision: 15, scale: 2 }),
    currentPrice: (0, pg_core_1.decimal)("current_price", { precision: 10, scale: 2 }),
    totalMarketValue: (0, pg_core_1.decimal)("total_market_value", { precision: 15, scale: 2 }),
    // Source tracking
    dataSource: (0, pg_core_1.text)("data_source").default("marvel_curated"),
    metadata: (0, pg_core_1.jsonb)("metadata"),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_marvel_gadgets_symbol").on(table.symbol),
    (0, pg_core_1.index)("idx_marvel_gadgets_tier").on(table.tier),
    (0, pg_core_1.index)("idx_marvel_gadgets_category").on(table.gadgetCategory),
]);
// Comics Worth Watching - Institutional/whale activity signals (like Bloomberg movers)
exports.comicsWorthWatching = (0, pg_core_1.pgTable)("comics_worth_watching", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    comicCoverId: (0, pg_core_1.varchar)("comic_cover_id").notNull().references(() => exports.comicCovers.id),
    assetId: (0, pg_core_1.varchar)("asset_id"), // Link to tradeable asset if exists
    // Why this comic is worth watching
    primarySignal: (0, pg_core_1.text)("primary_signal").notNull(), // 'whale_accumulation', 'institutional_buying', 'smart_money_flow', 'unusual_volume', 'dark_pool_activity'
    signalStrength: (0, pg_core_1.decimal)("signal_strength", { precision: 5, scale: 2 }).notNull(), // 0-100 strength score
    rank: (0, pg_core_1.integer)("rank"), // Daily ranking (1 = most significant)
    // Institutional/sophisticated trader activity
    whaleActivity: (0, pg_core_1.jsonb)("whale_activity"), // {buyOrders: 12, sellOrders: 3, netVolume: 45000, largestOrder: 15000}
    institutionalFlow: (0, pg_core_1.jsonb)("institutional_flow"), // {funds: ['heroes', 'villains'], netBuying: 25000, concentration: 0.65}
    smartMoneyMetrics: (0, pg_core_1.jsonb)("smart_money_metrics"), // {aiTraders: 145, successRate: 0.78, avgHoldTime: '7d', conviction: 0.82}
    // Market consensus and recommendations
    streetConsensus: (0, pg_core_1.text)("street_consensus"), // 'strong_buy', 'buy', 'hold', 'sell', 'strong_sell'
    consensusConfidence: (0, pg_core_1.decimal)("consensus_confidence", { precision: 3, scale: 2 }), // 0-1 confidence level
    analystTargets: (0, pg_core_1.jsonb)("analyst_targets"), // {low: 100, avg: 150, high: 200, timeframe: '30d'}
    // Financial context
    priceMetrics: (0, pg_core_1.jsonb)("price_metrics"), // {current: 125, dayChange: 0.15, weekChange: 0.34, monthChange: 0.89}
    volumeMetrics: (0, pg_core_1.jsonb)("volume_metrics"), // {current: 12500, avgVolume: 3200, volumeRatio: 3.9, zScore: 4.2}
    technicalIndicators: (0, pg_core_1.jsonb)("technical_indicators"), // {rsi: 72, macd: 'bullish', bollingerBand: 'upper'}
    // Why it matters (detail page content)
    detailedAnalysis: (0, pg_core_1.text)("detailed_analysis"), // Rich explanation of why this is significant
    catalysts: (0, pg_core_1.text)("catalysts").array(), // ['Whale accumulation detected', 'Institutional buying by Heroes fund', 'AI traders showing 78% conviction']
    risks: (0, pg_core_1.text)("risks").array(), // ['Overbought RSI', 'Low liquidity', 'Concentration risk']
    keyLevels: (0, pg_core_1.jsonb)("key_levels"), // {support: [100, 90], resistance: [150, 175], stopLoss: 85}
    // Timing
    selectedDate: (0, pg_core_1.timestamp)("selected_date").defaultNow(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at"), // When signal becomes stale
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_comics_watching_date").on(table.selectedDate),
    (0, pg_core_1.index)("idx_comics_watching_rank").on(table.rank),
    (0, pg_core_1.index)("idx_comics_watching_signal").on(table.primarySignal),
    (0, pg_core_1.index)("idx_comics_watching_strength").on(table.signalStrength),
    (0, pg_core_1.index)("idx_comics_watching_consensus").on(table.streetConsensus),
    (0, pg_core_1.index)("idx_comics_watching_cover").on(table.comicCoverId),
]);
// Comic of the Day - Historical significance selection
exports.comicOfTheDay = (0, pg_core_1.pgTable)("comic_of_the_day", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    comicCoverId: (0, pg_core_1.varchar)("comic_cover_id").notNull().references(() => exports.comicCovers.id),
    // Date this comic is featured
    featureDate: (0, pg_core_1.timestamp)("feature_date").notNull().unique(),
    // Historical significance
    significanceType: (0, pg_core_1.text)("significance_type").notNull(), // 'first_appearance', 'revolutionary_art', 'cultural_milestone', 'creator_breakthrough'
    significanceDescription: (0, pg_core_1.text)("significance_description").notNull(), // "First appearance of Wolverine in Hulk #181"
    // What makes it special
    revolutionaryAspect: (0, pg_core_1.text)("revolutionary_aspect"), // "Gibbons broke panel boundaries", "Silent issue - no dialogue"
    culturalImpact: (0, pg_core_1.text)("cultural_impact"), // "Deadpool parodies Deathstroke (Wade Wilson vs Slade Wilson)"
    // Related entities
    firstAppearanceEntities: (0, pg_core_1.text)("first_appearance_entities").array(), // Entity IDs that debuted
    featuredCreators: (0, pg_core_1.text)("featured_creators").array(), // Creator entity IDs
    featuredCharacters: (0, pg_core_1.text)("featured_characters").array(), // Character entity IDs
    // Historical context
    historicalNotes: (0, pg_core_1.text)("historical_notes"), // Additional context about era, impact, legacy
    era: (0, pg_core_1.text)("era"), // 'golden', 'silver', 'bronze', 'copper', 'modern', 'contemporary'
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_comic_of_day_date").on(table.featureDate),
    (0, pg_core_1.index)("idx_comic_of_day_type").on(table.significanceType),
    (0, pg_core_1.index)("idx_comic_of_day_era").on(table.era),
]);
// ============================================================================
// ENTITY INTELLIGENCE SYSTEM - Multi-Source Comic Entity Database
// ============================================================================
// Entity First Appearances - Maps any entity to its first appearance comic
exports.entityFirstAppearances = (0, pg_core_1.pgTable)("entity_first_appearances", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Entity identification (universal - works across all publishers)
    entityId: (0, pg_core_1.varchar)("entity_id").notNull(), // Asset ID or external entity reference
    entityName: (0, pg_core_1.text)("entity_name").notNull(),
    entityType: (0, pg_core_1.text)("entity_type").notNull(), // 'character', 'creator', 'location', 'gadget', 'team', 'concept'
    // First appearance comic reference
    firstAppearanceComicId: (0, pg_core_1.varchar)("first_appearance_comic_id"), // References assets.id if available
    firstAppearanceTitle: (0, pg_core_1.text)("first_appearance_title").notNull(), // "Detective Comics #27"
    firstAppearanceIssue: (0, pg_core_1.text)("first_appearance_issue"), // "#27"
    firstAppearanceYear: (0, pg_core_1.integer)("first_appearance_year"),
    firstAppearanceMonth: (0, pg_core_1.text)("first_appearance_month"),
    firstAppearanceCoverUrl: (0, pg_core_1.text)("first_appearance_cover_url"), // Direct cover image URL
    // Publisher and franchise context
    publisher: (0, pg_core_1.text)("publisher"), // 'Marvel', 'DC Comics', 'Image', 'Dark Horse', etc.
    franchise: (0, pg_core_1.text)("franchise"), // 'Batman Family', 'Spider-Man', 'X-Men', etc.
    universe: (0, pg_core_1.text)("universe"), // 'Earth-616', 'Earth-1', 'Ultimate Universe', etc.
    // Data source tracking for multi-source aggregation
    primarySource: (0, pg_core_1.text)("primary_source").notNull(), // 'metron', 'marvel_api', 'dc_wiki', 'gcd', 'superhero_api'
    sourceConsensusCount: (0, pg_core_1.integer)("source_consensus_count").default(1), // How many sources agree
    sourceIds: (0, pg_core_1.jsonb)("source_ids"), // {"comic_vine": "4005-1234", "marvel_api": "1009220", "metron": "567"}
    // Verification status
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false), // True if 3+ sources confirm
    verifiedAt: (0, pg_core_1.timestamp)("verified_at"),
    verificationNotes: (0, pg_core_1.text)("verification_notes"),
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_entity_first_app_entity").on(table.entityId),
    (0, pg_core_1.index)("idx_entity_first_app_type").on(table.entityType),
    (0, pg_core_1.index)("idx_entity_first_app_name").on(table.entityName),
    (0, pg_core_1.index)("idx_entity_first_app_year").on(table.firstAppearanceYear),
    (0, pg_core_1.index)("idx_entity_first_app_publisher").on(table.publisher),
    (0, pg_core_1.index)("idx_entity_first_app_source").on(table.primarySource),
]);
// Entity Attributes - Powers, weaknesses, origins, deaths, resurrections
exports.entityAttributes = (0, pg_core_1.pgTable)("entity_attributes", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Entity identification
    entityId: (0, pg_core_1.varchar)("entity_id").notNull(),
    entityName: (0, pg_core_1.text)("entity_name").notNull(),
    entityType: (0, pg_core_1.text)("entity_type").notNull(), // 'character', 'location', 'gadget', 'team'
    // Attribute classification
    attributeCategory: (0, pg_core_1.text)("attribute_category").notNull(), // 'power', 'weakness', 'origin', 'death', 'resurrection', 'ability', 'equipment'
    attributeName: (0, pg_core_1.text)("attribute_name").notNull(), // "Super Strength", "Kryptonite Vulnerability", "Radioactive Spider Bite"
    attributeDescription: (0, pg_core_1.text)("attribute_description"), // Detailed explanation
    // Attribute strength/importance
    attributeLevel: (0, pg_core_1.text)("attribute_level"), // 'primary', 'secondary', 'situational', 'former'
    isActive: (0, pg_core_1.boolean)("is_active").default(true), // Currently possesses this attribute
    // Comic references
    firstMentionedIn: (0, pg_core_1.text)("first_mentioned_in"), // Comic where attribute first appeared/mentioned
    keyAppearances: (0, pg_core_1.text)("key_appearances").array(), // Comics where this attribute was significant
    // Origin story details (for origin attributes)
    originType: (0, pg_core_1.text)("origin_type"), // 'accident', 'birth', 'experiment', 'magic', 'technology', 'mutation'
    originDescription: (0, pg_core_1.text)("origin_description"),
    // Death/resurrection tracking (for death/resurrection attributes)
    deathDate: (0, pg_core_1.text)("death_date"), // In-universe date or issue reference
    resurrectionDate: (0, pg_core_1.text)("resurrection_date"),
    permanenceStatus: (0, pg_core_1.text)("permanence_status"), // 'temporary', 'permanent', 'recurring', 'ambiguous'
    // Data source tracking
    primarySource: (0, pg_core_1.text)("primary_source").notNull(),
    sourceConsensusCount: (0, pg_core_1.integer)("source_consensus_count").default(1),
    sourceIds: (0, pg_core_1.jsonb)("source_ids"),
    // Verification
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false),
    verifiedAt: (0, pg_core_1.timestamp)("verified_at"),
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_entity_attr_entity").on(table.entityId),
    (0, pg_core_1.index)("idx_entity_attr_category").on(table.attributeCategory),
    (0, pg_core_1.index)("idx_entity_attr_name").on(table.attributeName),
    (0, pg_core_1.index)("idx_entity_attr_level").on(table.attributeLevel),
    (0, pg_core_1.index)("idx_entity_attr_active").on(table.isActive),
]);
// Entity Appearances - All comic appearances (universal, cross-publisher)
exports.entityAppearances = (0, pg_core_1.pgTable)("entity_appearances", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Entity identification
    entityId: (0, pg_core_1.varchar)("entity_id").notNull(),
    entityName: (0, pg_core_1.text)("entity_name").notNull(),
    entityType: (0, pg_core_1.text)("entity_type").notNull(),
    // Comic appearance reference
    comicId: (0, pg_core_1.varchar)("comic_id"), // References assets.id if available
    comicTitle: (0, pg_core_1.text)("comic_title").notNull(),
    issueNumber: (0, pg_core_1.text)("issue_number"),
    publicationYear: (0, pg_core_1.integer)("publication_year"),
    publicationMonth: (0, pg_core_1.text)("publication_month"),
    publisher: (0, pg_core_1.text)("publisher"),
    // Appearance details
    appearanceType: (0, pg_core_1.text)("appearance_type"), // 'main', 'supporting', 'cameo', 'mentioned', 'flashback'
    appearanceSignificance: (0, pg_core_1.text)("appearance_significance"), // 'death', 'first_use_of_power', 'team_formation', 'origin_retold'
    pageCount: (0, pg_core_1.integer)("page_count"), // Estimated pages entity appears on
    // Cover appearance
    isOnCover: (0, pg_core_1.boolean)("is_on_cover").default(false),
    coverImageUrl: (0, pg_core_1.text)("cover_image_url"),
    // Data source tracking
    primarySource: (0, pg_core_1.text)("primary_source").notNull(),
    sourceIds: (0, pg_core_1.jsonb)("source_ids"),
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_entity_app_entity").on(table.entityId),
    (0, pg_core_1.index)("idx_entity_app_comic").on(table.comicId),
    (0, pg_core_1.index)("idx_entity_app_type").on(table.appearanceType),
    (0, pg_core_1.index)("idx_entity_app_year").on(table.publicationYear),
    (0, pg_core_1.index)("idx_entity_app_publisher").on(table.publisher),
    (0, pg_core_1.index)("idx_entity_app_cover").on(table.isOnCover),
]);
// Entity Data Sources - Tracks which sources have data for each entity
exports.entityDataSources = (0, pg_core_1.pgTable)("entity_data_sources", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Entity identification
    entityId: (0, pg_core_1.varchar)("entity_id").notNull(),
    entityName: (0, pg_core_1.text)("entity_name").notNull(),
    entityType: (0, pg_core_1.text)("entity_type").notNull(),
    // Data source details
    sourceName: (0, pg_core_1.text)("source_name").notNull(), // 'metron', 'marvel_api', 'dc_wiki', 'gcd', 'superhero_api', 'mycomicshop', 'league_of_geeks'
    sourceEntityId: (0, pg_core_1.text)("source_entity_id").notNull(), // ID in the source system
    sourceUrl: (0, pg_core_1.text)("source_url"), // Direct link to entity in source
    // Data availability flags
    hasFirstAppearance: (0, pg_core_1.boolean)("has_first_appearance").default(false),
    hasAttributes: (0, pg_core_1.boolean)("has_attributes").default(false),
    hasRelationships: (0, pg_core_1.boolean)("has_relationships").default(false),
    hasAppearances: (0, pg_core_1.boolean)("has_appearances").default(false),
    hasImages: (0, pg_core_1.boolean)("has_images").default(false),
    hasBiography: (0, pg_core_1.boolean)("has_biography").default(false),
    // Data quality metrics
    dataCompleteness: (0, pg_core_1.decimal)("data_completeness", { precision: 3, scale: 2 }), // 0.00 to 1.00
    dataFreshness: (0, pg_core_1.timestamp)("data_freshness"), // When data was last updated in source
    sourceReliability: (0, pg_core_1.decimal)("source_reliability", { precision: 3, scale: 2 }).default("0.50"), // 0.00 to 1.00
    // Source-specific data
    sourceData: (0, pg_core_1.jsonb)("source_data"), // Raw data from source for reference
    // Sync tracking
    lastSyncedAt: (0, pg_core_1.timestamp)("last_synced_at"),
    nextSyncScheduled: (0, pg_core_1.timestamp)("next_sync_scheduled"),
    syncStatus: (0, pg_core_1.text)("sync_status"), // 'pending', 'synced', 'failed', 'outdated'
    syncErrorMessage: (0, pg_core_1.text)("sync_error_message"),
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_entity_sources_entity").on(table.entityId),
    (0, pg_core_1.index)("idx_entity_sources_source").on(table.sourceName),
    (0, pg_core_1.index)("idx_entity_sources_sync").on(table.syncStatus),
    (0, pg_core_1.index)("idx_entity_sources_freshness").on(table.dataFreshness),
    (0, pg_core_1.index)("idx_entity_sources_entity_source").on(table.entityId, table.sourceName),
]);
// Entity Relationships - Universal relationship graph (extends assetRelationships for external entities)
exports.entityRelationships = (0, pg_core_1.pgTable)("entity_relationships", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Source entity
    sourceEntityId: (0, pg_core_1.varchar)("source_entity_id").notNull(),
    sourceEntityName: (0, pg_core_1.text)("source_entity_name").notNull(),
    sourceEntityType: (0, pg_core_1.text)("source_entity_type").notNull(),
    // Target entity
    targetEntityId: (0, pg_core_1.varchar)("target_entity_id").notNull(),
    targetEntityName: (0, pg_core_1.text)("target_entity_name").notNull(),
    targetEntityType: (0, pg_core_1.text)("target_entity_type").notNull(),
    // Relationship classification
    relationshipType: (0, pg_core_1.text)("relationship_type").notNull(), // 'ally', 'enemy', 'nemesis', 'sidekick', 'mentor', 'teammate', 'family', 'romantic', 'rival', 'creator', 'wields', 'located_in'
    relationshipSubtype: (0, pg_core_1.text)("relationship_subtype"), // 'arch-enemy', 'partner', 'father', 'love_interest', 'former_ally'
    // Relationship strength
    relationshipStrength: (0, pg_core_1.decimal)("relationship_strength", { precision: 3, scale: 2 }).default("0.50"), // 0.00 to 1.00
    isActive: (0, pg_core_1.boolean)("is_active").default(true), // Current vs historical relationship
    // Comic references
    firstEstablishedIn: (0, pg_core_1.text)("first_established_in"), // Comic where relationship began
    firstEstablishedComicId: (0, pg_core_1.varchar)("first_established_comic_id"),
    keyMoments: (0, pg_core_1.text)("key_moments").array(), // Significant comics featuring this relationship
    relationshipNotes: (0, pg_core_1.text)("relationship_notes"),
    // Publisher context
    publisher: (0, pg_core_1.text)("publisher"),
    universe: (0, pg_core_1.text)("universe"),
    // Data source tracking
    primarySource: (0, pg_core_1.text)("primary_source").notNull(),
    sourceConsensusCount: (0, pg_core_1.integer)("source_consensus_count").default(1),
    sourceIds: (0, pg_core_1.jsonb)("source_ids"),
    // Verification
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false),
    verifiedAt: (0, pg_core_1.timestamp)("verified_at"),
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_entity_rel_source").on(table.sourceEntityId),
    (0, pg_core_1.index)("idx_entity_rel_target").on(table.targetEntityId),
    (0, pg_core_1.index)("idx_entity_rel_type").on(table.relationshipType),
    (0, pg_core_1.index)("idx_entity_rel_active").on(table.isActive),
    (0, pg_core_1.index)("idx_entity_rel_publisher").on(table.publisher),
    (0, pg_core_1.index)("idx_entity_rel_source_type").on(table.sourceEntityId, table.relationshipType),
]);
// Entity Story Arcs - Major storylines, plot events, crossover events
exports.entityStoryArcs = (0, pg_core_1.pgTable)("entity_story_arcs", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Story arc identification
    arcName: (0, pg_core_1.text)("arc_name").notNull(), // "Civil War", "Infinity Gauntlet", "Crisis on Infinite Earths"
    arcType: (0, pg_core_1.text)("arc_type").notNull(), // 'major_event', 'character_arc', 'team_storyline', 'crossover', 'origin_story', 'death_arc', 'resurrection_arc'
    arcDescription: (0, pg_core_1.text)("arc_description"), // Full story summary
    // Publisher and scope
    publisher: (0, pg_core_1.text)("publisher").notNull(), // 'Marvel', 'DC Comics', 'Image', 'Dark Horse', etc.
    universe: (0, pg_core_1.text)("universe"), // 'Earth-616', 'Earth-1', 'Ultimate Universe'
    arcScope: (0, pg_core_1.text)("arc_scope"), // 'universal', 'street_level', 'cosmic', 'multiversal', 'single_series'
    // Timeline
    startYear: (0, pg_core_1.integer)("start_year"),
    endYear: (0, pg_core_1.integer)("end_year"),
    startIssue: (0, pg_core_1.text)("start_issue"), // "Iron Man #225"
    endIssue: (0, pg_core_1.text)("end_issue"), // "Iron Man #232"
    issueCount: (0, pg_core_1.integer)("issue_count"), // Total issues in arc
    // Comic references
    keyIssues: (0, pg_core_1.text)("key_issues").array(), // Major issues in the arc
    tieInIssues: (0, pg_core_1.text)("tie_in_issues").array(), // Crossover tie-ins
    coverImageUrl: (0, pg_core_1.text)("cover_image_url"), // Cover of first or most iconic issue
    // Participating entities
    featuredCharacters: (0, pg_core_1.text)("featured_characters").array(), // Entity IDs of main characters
    featuredCreators: (0, pg_core_1.text)("featured_creators").array(), // Writer/artist entity IDs
    featuredLocations: (0, pg_core_1.text)("featured_locations").array(), // Location entity IDs
    featuredGadgets: (0, pg_core_1.text)("featured_gadgets").array(), // Gadget entity IDs
    // Story impact
    narrativeImpact: (0, pg_core_1.text)("narrative_impact"), // "Introduction of symbiote", "Death of Superman", "Spider-Man reveals identity"
    characterImpacts: (0, pg_core_1.jsonb)("character_impacts"), // {"spider-man": "identity_revealed", "iron-man": "became_director_of_shield"}
    universeImpacts: (0, pg_core_1.text)("universe_impacts"), // Long-term changes to continuity
    // Cultural significance
    culturalImpact: (0, pg_core_1.text)("cultural_impact"), // "Became major film storyline", "Changed superhero team dynamics"
    criticalReception: (0, pg_core_1.text)("critical_reception"), // "Critically acclaimed", "Controversial ending"
    commercialSuccess: (0, pg_core_1.text)("commercial_success"), // "Best-selling storyline of 1991"
    // Data source tracking
    primarySource: (0, pg_core_1.text)("primary_source").notNull(),
    sourceConsensusCount: (0, pg_core_1.integer)("source_consensus_count").default(1),
    sourceIds: (0, pg_core_1.jsonb)("source_ids"),
    // Verification
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false),
    verifiedAt: (0, pg_core_1.timestamp)("verified_at"),
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_entity_arc_name").on(table.arcName),
    (0, pg_core_1.index)("idx_entity_arc_type").on(table.arcType),
    (0, pg_core_1.index)("idx_entity_arc_publisher").on(table.publisher),
    (0, pg_core_1.index)("idx_entity_arc_year").on(table.startYear),
    (0, pg_core_1.index)("idx_entity_arc_scope").on(table.arcScope),
]);
// Entity Creator Contributions - Detailed creator work beyond first appearances
exports.entityCreatorContributions = (0, pg_core_1.pgTable)("entity_creator_contributions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Creator identification
    creatorEntityId: (0, pg_core_1.varchar)("creator_entity_id").notNull(), // Entity ID of creator
    creatorName: (0, pg_core_1.text)("creator_name").notNull(),
    // Work identification
    workType: (0, pg_core_1.text)("work_type").notNull(), // 'character_creation', 'series_run', 'story_arc', 'single_issue', 'cover_art', 'variant_cover'
    workEntityId: (0, pg_core_1.varchar)("work_entity_id"), // Entity ID of character/series they worked on
    workEntityName: (0, pg_core_1.text)("work_entity_name"), // Name of character/series
    workEntityType: (0, pg_core_1.text)("work_entity_type"), // 'character', 'series', 'story_arc', 'comic'
    // Role details
    creatorRole: (0, pg_core_1.text)("creator_role").notNull(), // 'writer', 'penciller', 'inker', 'colorist', 'letterer', 'editor', 'co-creator'
    isPrimaryCreator: (0, pg_core_1.boolean)("is_primary_creator").default(false), // Main creator vs contributor
    isCoCreator: (0, pg_core_1.boolean)("is_co_creator").default(false), // Co-created the character/concept
    // Comic/series references
    comicTitle: (0, pg_core_1.text)("comic_title"), // "Amazing Spider-Man"
    issueRange: (0, pg_core_1.text)("issue_range"), // "#1-38", "#500", "Vol 1 #1-100"
    publicationYear: (0, pg_core_1.integer)("publication_year"),
    publisher: (0, pg_core_1.text)("publisher"),
    // Work significance
    contributionSignificance: (0, pg_core_1.text)("contribution_significance"), // 'iconic_run', 'character_defining', 'award_winning', 'first_appearance'
    notableWorks: (0, pg_core_1.text)("notable_works").array(), // Specific issues or storylines
    awards: (0, pg_core_1.text)("awards").array(), // "Eisner Award 1992", "Harvey Award"
    // Collaboration
    collaborators: (0, pg_core_1.text)("collaborators").array(), // Other creator entity IDs who worked on this
    collaborationNotes: (0, pg_core_1.text)("collaboration_notes"),
    // Data source tracking
    primarySource: (0, pg_core_1.text)("primary_source").notNull(),
    sourceConsensusCount: (0, pg_core_1.integer)("source_consensus_count").default(1),
    sourceIds: (0, pg_core_1.jsonb)("source_ids"),
    // Verification
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false),
    verifiedAt: (0, pg_core_1.timestamp)("verified_at"),
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_creator_contrib_creator").on(table.creatorEntityId),
    (0, pg_core_1.index)("idx_creator_contrib_work").on(table.workEntityId),
    (0, pg_core_1.index)("idx_creator_contrib_role").on(table.creatorRole),
    (0, pg_core_1.index)("idx_creator_contrib_type").on(table.workType),
    (0, pg_core_1.index)("idx_creator_contrib_primary").on(table.isPrimaryCreator),
    (0, pg_core_1.index)("idx_creator_contrib_publisher").on(table.publisher),
]);
// Entity Narrative Milestones - Major character evolution moments
exports.entityNarrativeMilestones = (0, pg_core_1.pgTable)("entity_narrative_milestones", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Entity identification
    entityId: (0, pg_core_1.varchar)("entity_id").notNull(),
    entityName: (0, pg_core_1.text)("entity_name").notNull(),
    entityType: (0, pg_core_1.text)("entity_type").notNull(), // 'character', 'team', 'location'
    // Milestone classification
    milestoneType: (0, pg_core_1.text)("milestone_type").notNull(), // 'costume_change', 'power_upgrade', 'identity_reveal', 'origin_retold', 'team_formation', 'team_departure', 'title_change', 'alignment_shift', 'mentor_relationship', 'major_defeat', 'major_victory'
    milestoneSubtype: (0, pg_core_1.text)("milestone_subtype"), // 'symbiote_suit', 'cosmic_powers', 'public_reveal', 'secret_revealed_to_ally'
    // Milestone details
    milestoneName: (0, pg_core_1.text)("milestone_name").notNull(), // "Spider-Man Gets Black Suit", "Captain America Loses Super Soldier Serum"
    milestoneDescription: (0, pg_core_1.text)("milestone_description"), // Full context and impact
    // Comic reference
    occurredInComicId: (0, pg_core_1.varchar)("occurred_in_comic_id"),
    occurredInComicTitle: (0, pg_core_1.text)("occurred_in_comic_title").notNull(), // "Secret Wars #8"
    occurredInIssue: (0, pg_core_1.text)("occurred_in_issue"), // "#8"
    occurredYear: (0, pg_core_1.integer)("occurred_year"),
    occurredMonth: (0, pg_core_1.text)("occurred_month"),
    coverImageUrl: (0, pg_core_1.text)("cover_image_url"),
    // Impact tracking
    isPermanent: (0, pg_core_1.boolean)("is_permanent").default(true), // Lasting change or temporary
    wasReversed: (0, pg_core_1.boolean)("was_reversed").default(false), // Later undone
    reversedInComicTitle: (0, pg_core_1.text)("reversed_in_comic_title"),
    reversedYear: (0, pg_core_1.integer)("reversed_year"),
    // Character impact
    characterImpact: (0, pg_core_1.text)("character_impact"), // "Became more aggressive and violent", "Lost connection to cosmic awareness"
    powerChanges: (0, pg_core_1.text)("power_changes"), // "Gained web-shooting without web-shooters", "Lost flight ability"
    relationshipChanges: (0, pg_core_1.text)("relationship_changes"), // "Turned friends into enemies", "Revealed identity to Mary Jane"
    // Related entities
    relatedEntities: (0, pg_core_1.text)("related_entities").array(), // Other entity IDs involved
    relatedStoryArcId: (0, pg_core_1.varchar)("related_story_arc_id"), // Link to story arc if part of larger event
    // Publisher context
    publisher: (0, pg_core_1.text)("publisher"),
    universe: (0, pg_core_1.text)("universe"),
    // Data source tracking
    primarySource: (0, pg_core_1.text)("primary_source").notNull(),
    sourceConsensusCount: (0, pg_core_1.integer)("source_consensus_count").default(1),
    sourceIds: (0, pg_core_1.jsonb)("source_ids"),
    // Verification
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false),
    verifiedAt: (0, pg_core_1.timestamp)("verified_at"),
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_milestone_entity").on(table.entityId),
    (0, pg_core_1.index)("idx_milestone_type").on(table.milestoneType),
    (0, pg_core_1.index)("idx_milestone_year").on(table.occurredYear),
    (0, pg_core_1.index)("idx_milestone_permanent").on(table.isPermanent),
    (0, pg_core_1.index)("idx_milestone_reversed").on(table.wasReversed),
    (0, pg_core_1.index)("idx_milestone_publisher").on(table.publisher),
]);
// Entity Appearance Order - Tracks 2nd, 3rd, nth appearances explicitly
exports.entityAppearanceOrder = (0, pg_core_1.pgTable)("entity_appearance_order", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    // Entity identification
    entityId: (0, pg_core_1.varchar)("entity_id").notNull(),
    entityName: (0, pg_core_1.text)("entity_name").notNull(),
    entityType: (0, pg_core_1.text)("entity_type").notNull(),
    // Appearance order
    appearanceNumber: (0, pg_core_1.integer)("appearance_number").notNull(), // 1 (first), 2 (second), 3 (third), etc.
    appearanceOrdinal: (0, pg_core_1.text)("appearance_ordinal"), // "1st", "2nd", "3rd", "4th"
    // Comic reference
    comicId: (0, pg_core_1.varchar)("comic_id"),
    comicTitle: (0, pg_core_1.text)("comic_title").notNull(),
    issueNumber: (0, pg_core_1.text)("issue_number"),
    publicationYear: (0, pg_core_1.integer)("publication_year"),
    publicationMonth: (0, pg_core_1.text)("publication_month"),
    publisher: (0, pg_core_1.text)("publisher"),
    coverImageUrl: (0, pg_core_1.text)("cover_image_url"),
    // Appearance context
    appearanceType: (0, pg_core_1.text)("appearance_type"), // 'main', 'supporting', 'cameo', 'mentioned', 'flashback'
    appearanceSignificance: (0, pg_core_1.text)("appearance_significance"), // What happened in this appearance
    isKeyAppearance: (0, pg_core_1.boolean)("is_key_appearance").default(false), // Particularly important appearance
    // Narrative context
    relatedStoryArcId: (0, pg_core_1.varchar)("related_story_arc_id"), // If part of story arc
    relatedMilestoneId: (0, pg_core_1.varchar)("related_milestone_id"), // If milestone occurred here
    // Data source tracking
    primarySource: (0, pg_core_1.text)("primary_source").notNull(),
    sourceConsensusCount: (0, pg_core_1.integer)("source_consensus_count").default(1),
    sourceIds: (0, pg_core_1.jsonb)("source_ids"),
    // Verification
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false),
    verifiedAt: (0, pg_core_1.timestamp)("verified_at"),
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("idx_appearance_order_entity").on(table.entityId),
    (0, pg_core_1.index)("idx_appearance_order_number").on(table.appearanceNumber),
    (0, pg_core_1.index)("idx_appearance_order_year").on(table.publicationYear),
    (0, pg_core_1.index)("idx_appearance_order_key").on(table.isKeyAppearance),
    (0, pg_core_1.index)("idx_appearance_order_entity_num").on(table.entityId, table.appearanceNumber),
]);
// Insert Schemas
exports.insertMarvelLocationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.marvelLocations).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertMarvelGadgetSchema = (0, drizzle_zod_1.createInsertSchema)(exports.marvelGadgets).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// Comics Worth Watching Insert Schema & Types
exports.insertComicsWorthWatchingSchema = (0, drizzle_zod_1.createInsertSchema)(exports.comicsWorthWatching).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// Comic of the Day Insert Schema & Types
exports.insertComicOfTheDaySchema = (0, drizzle_zod_1.createInsertSchema)(exports.comicOfTheDay).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// Asset Relationships Insert Schema & Types
exports.insertAssetRelationshipSchema = (0, drizzle_zod_1.createInsertSchema)(exports.assetRelationships).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// Entity Intelligence System Insert Schemas & Types
exports.insertEntityFirstAppearanceSchema = (0, drizzle_zod_1.createInsertSchema)(exports.entityFirstAppearances).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertEntityAttributeSchema = (0, drizzle_zod_1.createInsertSchema)(exports.entityAttributes).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertEntityAppearanceSchema = (0, drizzle_zod_1.createInsertSchema)(exports.entityAppearances).omit({
    id: true,
    createdAt: true,
});
exports.insertEntityDataSourceSchema = (0, drizzle_zod_1.createInsertSchema)(exports.entityDataSources).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertEntityRelationshipSchema = (0, drizzle_zod_1.createInsertSchema)(exports.entityRelationships).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// New Comprehensive Entity Intelligence Schemas & Types
exports.insertEntityStoryArcSchema = (0, drizzle_zod_1.createInsertSchema)(exports.entityStoryArcs).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertEntityCreatorContributionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.entityCreatorContributions).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertEntityNarrativeMilestoneSchema = (0, drizzle_zod_1.createInsertSchema)(exports.entityNarrativeMilestones).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertEntityAppearanceOrderSchema = (0, drizzle_zod_1.createInsertSchema)(exports.entityAppearanceOrder).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
