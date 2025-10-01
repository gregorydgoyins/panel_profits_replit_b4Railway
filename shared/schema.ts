import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean, jsonb, vector, bigint, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table with subscription tiers and Replit Auth integration
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Replit Auth fields  
  username: varchar("username").notNull().unique(), // Required for authentication
  password: text("password"), // Optional - OIDC auth doesn't use passwords
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Panel Profits trading platform fields
  subscriptionTier: text("subscription_tier").notNull().default("free"), // 'free', 'pro', 'elite'
  subscriptionStatus: text("subscription_status").default("active"), // 'active', 'cancelled', 'past_due'
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  stripeCustomerId: text("stripe_customer_id"),
  monthlyTradingCredits: integer("monthly_trading_credits").default(0),
  usedTradingCredits: integer("used_trading_credits").default(0),
  competitionWins: integer("competition_wins").default(0),
  competitionRanking: integer("competition_ranking"),
  // Phase 1 Trading Balance & Limits
  virtualTradingBalance: decimal("virtual_trading_balance", { precision: 15, scale: 2 }).default("100000.00"), // Starting virtual cash for trading
  dailyTradingLimit: decimal("daily_trading_limit", { precision: 15, scale: 2 }).default("10000.00"), // Daily trading limit
  dailyTradingUsed: decimal("daily_trading_used", { precision: 15, scale: 2 }).default("0.00"), // Daily trading used
  maxPositionSize: decimal("max_position_size", { precision: 10, scale: 2 }).default("5000.00"), // Max single position size
  riskTolerance: text("risk_tolerance").default("moderate"), // 'conservative', 'moderate', 'aggressive'
  tradingPermissions: jsonb("trading_permissions").default('{"canTrade": true, "canUseMargin": false, "canShort": false}'), // Trading permissions
  lastTradingActivity: timestamp("last_trading_activity"),
  tradingStreakDays: integer("trading_streak_days").default(0),
  totalTradingProfit: decimal("total_trading_profit", { precision: 15, scale: 2 }).default("0.00"),
  // Mythological Houses System
  houseId: text("house_id"), // 'heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit'
  houseJoinedAt: timestamp("house_joined_at"),
  karma: integer("karma").default(0), // Karma score affecting trading bonuses
  // Karmic Alignment System - Dual axis alignment tracking
  lawfulChaoticAlignment: decimal("lawful_chaotic_alignment", { precision: 8, scale: 2 }).default("0.00"), // -100 (Chaotic) to +100 (Lawful)
  goodEvilAlignment: decimal("good_evil_alignment", { precision: 8, scale: 2 }).default("0.00"), // -100 (Evil) to +100 (Good)
  alignmentRevealed: boolean("alignment_revealed").default(false), // Whether user has accessed Scrying Chamber
  alignmentLastUpdated: timestamp("alignment_last_updated").defaultNow(),
  preferences: jsonb("preferences"), // UI settings, notifications, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hidden Alignment Tracking for Entry Test & Ongoing Behavior
export const alignmentScores = pgTable("alignment_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Core alignment axes (normalized -100 to +100)
  ruthlessnessScore: decimal("ruthlessness_score", { precision: 6, scale: 2 }).default("0.00"), // -100 (Empathetic) to +100 (Ruthless)
  individualismScore: decimal("individualism_score", { precision: 6, scale: 2 }).default("0.00"), // -100 (Collective) to +100 (Individual)
  lawfulnessScore: decimal("lawfulness_score", { precision: 6, scale: 2 }).default("0.00"), // -100 (Chaotic) to +100 (Lawful)  
  greedScore: decimal("greed_score", { precision: 6, scale: 2 }).default("0.00"), // -100 (Restraint) to +100 (Greed)
  
  // Confidence multipliers (how consistent are their behaviors)
  ruthlessnessConfidence: decimal("ruthlessness_confidence", { precision: 4, scale: 2 }).default("1.00"),
  individualismConfidence: decimal("individualism_confidence", { precision: 4, scale: 2 }).default("1.00"),
  lawfulnessConfidence: decimal("lawfulness_confidence", { precision: 4, scale: 2 }).default("1.00"),
  greedConfidence: decimal("greed_confidence", { precision: 4, scale: 2 }).default("1.00"),
  
  // House assignment result
  assignedHouseId: varchar("assigned_house_id"),
  assignmentScore: decimal("assignment_score", { precision: 8, scale: 2 }), // Strength of match to house
  secondaryHouseId: varchar("secondary_house_id"), // Runner-up for close calls
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Decision Tracking (for Entry Test and ongoing monitoring)
export const userDecisions = pgTable("user_decisions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Decision context
  decisionType: text("decision_type").notNull(), // 'entry_test', 'trading', 'social', 'market_event'
  scenarioId: text("scenario_id"), // Which scenario/situation
  choiceId: text("choice_id"), // Which option they selected
  
  // Hidden alignment impact (not shown to user)
  ruthlessnessImpact: decimal("ruthlessness_impact", { precision: 5, scale: 2 }).default("0.00"),
  individualismImpact: decimal("individualism_impact", { precision: 5, scale: 2 }).default("0.00"),
  lawfulnessImpact: decimal("lawfulness_impact", { precision: 5, scale: 2 }).default("0.00"),
  greedImpact: decimal("greed_impact", { precision: 5, scale: 2 }).default("0.00"),
  
  // What the user sees (disguised as performance metrics)
  displayedScore: integer("displayed_score"), // Fake "skill" score shown to user
  displayedFeedback: text("displayed_feedback"), // Misleading feedback about trading acumen
  
  // Metadata
  responseTime: integer("response_time"), // Milliseconds to decide (reveals impulsivity)
  contextData: jsonb("context_data"), // Additional data about the decision
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Knowledge Test Results - Disguised as "Market Mastery Challenge"
export const knowledgeTestResults = pgTable("knowledge_test_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Visible performance metrics (what user sees)
  profitScore: decimal("profit_score", { precision: 6, scale: 2 }).notNull(), // "Trading optimization" score
  performanceRating: text("performance_rating").notNull(), // 'exceptional', 'strong', 'developing', 'needs_improvement'
  displayedFeedback: text("displayed_feedback").notNull(), // Misleading feedback about trading prowess
  
  // Hidden knowledge assessment (actual purpose)
  knowledgeScore: decimal("knowledge_score", { precision: 6, scale: 2 }).notNull(), // 0-100 actual financial literacy
  tier: text("tier").notNull(), // 'novice', 'associate', 'trader', 'specialist', 'master'
  weakAreas: text("weak_areas").array(), // Knowledge gaps identified
  strengths: text("strengths").array(), // Areas of competence
  
  // Trading floor access control
  tradingFloorAccess: boolean("trading_floor_access").default(false), // Can they trade?
  accessLevel: text("access_level").default("restricted"), // 'restricted', 'basic', 'standard', 'advanced', 'unlimited'
  restrictionReason: text("restriction_reason"), // Why access is limited
  
  // Test metadata
  completedAt: timestamp("completed_at").defaultNow(),
  timeSpent: integer("time_spent"), // Seconds to complete
  questionsAnswered: integer("questions_answered").notNull(),
  retakeAllowedAt: timestamp("retake_allowed_at"), // When they can retry
  attemptNumber: integer("attempt_number").default(1),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Knowledge Test Responses - Individual question tracking
export const knowledgeTestResponses = pgTable("knowledge_test_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resultId: varchar("result_id").notNull().references(() => knowledgeTestResults.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Question and response
  scenarioId: text("scenario_id").notNull(), // Which scenario from knowledgeTestScenarios
  choiceId: text("choice_id").notNull(), // Which option they selected
  
  // Scoring
  knowledgeScore: decimal("knowledge_score", { precision: 6, scale: 2 }).notNull(), // 0-100 for this question
  profitScore: decimal("profit_score", { precision: 6, scale: 2 }).notNull(), // Fake visible score
  
  // Analysis
  responseTime: integer("response_time"), // Milliseconds to answer
  isCorrect: boolean("is_correct").notNull(), // Based on knowledge score threshold
  knowledgeAreas: text("knowledge_areas").array(), // What this tested
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Asset types: characters, comics, creators, publishers
export const assets = pgTable("assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'character', 'comic', 'creator', 'publisher'
  description: text("description"),
  imageUrl: text("image_url"),
  metadata: jsonb("metadata"), // Additional asset-specific data
  
  // Seven Houses control
  houseId: varchar("house_id").references(() => sevenHouses.id), // Which house controls this asset
  houseInfluencePercent: decimal("house_influence_percent", { precision: 5, scale: 2 }).default("0.00"), // 0-100%
  narrativeWeight: decimal("narrative_weight", { precision: 5, scale: 2 }).default("50.00"), // How story events affect price
  controlledSince: timestamp("controlled_since"), // When house took control
  previousHouseId: varchar("previous_house_id"), // Previous controller for history
  
  // Vector embeddings for semantic search and recommendations
  metadataEmbedding: vector("metadata_embedding", { dimensions: 1536 }), // OpenAI ada-002 embedding dimensions
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Market data for OHLC candlestick data and technical indicators
export const marketData = pgTable("market_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  timeframe: text("timeframe").notNull(), // '1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M'
  periodStart: timestamp("period_start").notNull(), // Start of the time period
  open: decimal("open", { precision: 10, scale: 2 }).notNull(),
  high: decimal("high", { precision: 10, scale: 2 }).notNull(),
  low: decimal("low", { precision: 10, scale: 2 }).notNull(),
  close: decimal("close", { precision: 10, scale: 2 }).notNull(),
  volume: integer("volume").notNull(),
  change: decimal("change", { precision: 10, scale: 2 }),
  percentChange: decimal("percent_change", { precision: 8, scale: 2 }),
  marketCap: decimal("market_cap", { precision: 15, scale: 2 }),
  technicalIndicators: jsonb("technical_indicators"), // RSI, MACD, SMA, EMA, etc.
  // Vector embeddings for price pattern recognition and similarity matching
  pricePatternEmbedding: vector("price_pattern_embedding", { dimensions: 1536 }), // Price movement pattern vectors
  createdAt: timestamp("created_at").defaultNow(),
});

// Portfolio holdings for users
export const portfolios = pgTable("portfolios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }),
  dayChange: decimal("day_change", { precision: 10, scale: 2 }),
  dayChangePercent: decimal("day_change_percent", { precision: 8, scale: 2 }),
  totalReturn: decimal("total_return", { precision: 10, scale: 2 }),
  totalReturnPercent: decimal("total_return_percent", { precision: 8, scale: 2 }),
  diversificationScore: decimal("diversification_score", { precision: 3, scale: 1 }),
  // Phase 1 Portfolio Cash Management
  cashBalance: decimal("cash_balance", { precision: 15, scale: 2 }).default("100000.00"), // Available cash for trading
  initialCashAllocation: decimal("initial_cash_allocation", { precision: 15, scale: 2 }).default("100000.00"), // Initial starting amount
  portfolioType: text("portfolio_type").default("default"), // 'default', 'custom', 'competition'
  isDefault: boolean("is_default").default(false), // True for user's default trading portfolio
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Individual holdings within portfolios
export const holdings = pgTable("holdings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  quantity: decimal("quantity", { precision: 10, scale: 4 }).notNull(),
  averageCost: decimal("average_cost", { precision: 10, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  unrealizedGainLoss: decimal("unrealized_gain_loss", { precision: 10, scale: 2 }),
  unrealizedGainLossPercent: decimal("unrealized_gain_loss_percent", { precision: 8, scale: 2 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI-powered market insights and sentiment analysis
export const marketInsights = pgTable("market_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").references(() => assets.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  sentimentScore: decimal("sentiment_score", { precision: 3, scale: 2 }), // -1 to 1
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // 0 to 1
  tags: text("tags").array(),
  source: text("source"), // AI model, news, social media, etc.
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  category: text("category"), // 'bullish', 'bearish', 'neutral', 'alert'
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  // Vector embeddings for semantic search through market insights and analysis
  contentEmbedding: vector("content_embedding", { dimensions: 1536 }), // Content semantic vectors for search
  createdAt: timestamp("created_at").defaultNow(),
});

// Market indices (PPIx 50, PPIx 100, etc.)
export const marketIndices = pgTable("market_indices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  indexType: text("index_type").notNull(), // 'ppix50', 'ppix100', 'custom'
  methodology: text("methodology"), // Explanation of how index is calculated
  constituents: jsonb("constituents"), // Array of asset IDs with weights
  rebalanceFrequency: text("rebalance_frequency").default("monthly"), // 'daily', 'weekly', 'monthly', 'quarterly'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Historical market index data for time-series analysis
export const marketIndexData = pgTable("market_index_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  indexId: varchar("index_id").notNull().references(() => marketIndices.id),
  timeframe: text("timeframe").notNull(), // '1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M'
  periodStart: timestamp("period_start").notNull(),
  open: decimal("open", { precision: 10, scale: 2 }).notNull(),
  high: decimal("high", { precision: 10, scale: 2 }).notNull(),
  low: decimal("low", { precision: 10, scale: 2 }).notNull(),
  close: decimal("close", { precision: 10, scale: 2 }).notNull(),
  volume: integer("volume"),
  change: decimal("change", { precision: 10, scale: 2 }),
  percentChange: decimal("percent_change", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Watchlists for users to track assets
export const watchlists = pgTable("watchlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assets within watchlists
export const watchlistAssets = pgTable("watchlist_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  watchlistId: varchar("watchlist_id").notNull().references(() => watchlists.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  addedAt: timestamp("added_at").defaultNow(),
});

// Trading orders and transactions
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  type: text("type").notNull(), // 'buy', 'sell'
  side: text("side").notNull(), // 'buy', 'sell' - alias for type for compatibility
  orderType: text("order_type").notNull(), // 'market', 'limit', 'stop'
  quantity: decimal("quantity", { precision: 10, scale: 4 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  totalValue: decimal("total_value", { precision: 10, scale: 2 }),
  status: text("status").notNull(), // 'pending', 'filled', 'cancelled', 'partially_filled'
  // Phase 1 Enhanced Order Execution Tracking
  filledQuantity: decimal("filled_quantity", { precision: 10, scale: 4 }).default("0"),
  averageFillPrice: decimal("average_fill_price", { precision: 10, scale: 2 }),
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0.00"), // Trading fees/commissions
  stopLossPrice: decimal("stop_loss_price", { precision: 10, scale: 2 }), // Stop loss level
  takeProfitPrice: decimal("take_profit_price", { precision: 10, scale: 2 }), // Take profit level
  orderExpiry: timestamp("order_expiry"), // Order expiration time
  executionDetails: jsonb("execution_details"), // Detailed execution information
  rejectionReason: text("rejection_reason"), // Reason if order was rejected
  filledAt: timestamp("filled_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI vs Human competition leagues
export const competitionLeagues = pgTable("competition_leagues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  season: text("season").notNull(), // 'Q1-2025', 'Q2-2025', etc.
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).default("0"),
  prizePool: decimal("prize_pool", { precision: 10, scale: 2 }).default("0"),
  maxParticipants: integer("max_participants").default(100),
  currentParticipants: integer("current_participants").default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("upcoming"), // 'upcoming', 'active', 'completed'
  rules: jsonb("rules"), // Competition rules and constraints
  aiOpponents: jsonb("ai_opponents"), // AI trading strategies and personalities
  createdAt: timestamp("created_at").defaultNow(),
});

// Competition participants and their performance
export const competitionParticipants = pgTable("competition_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leagueId: varchar("league_id").notNull().references(() => competitionLeagues.id),
  userId: varchar("user_id").references(() => users.id), // null for AI participants
  participantType: text("participant_type").notNull(), // 'human', 'ai'
  participantName: text("participant_name").notNull(),
  aiStrategy: text("ai_strategy"), // For AI participants
  portfolioValue: decimal("portfolio_value", { precision: 15, scale: 2 }).default("100000"),
  totalReturn: decimal("total_return", { precision: 10, scale: 2 }).default("0"),
  totalReturnPercent: decimal("total_return_percent", { precision: 8, scale: 2 }).default("0"),
  currentRank: integer("current_rank"),
  trades: integer("trades").default(0),
  winRate: decimal("win_rate", { precision: 8, scale: 2 }),
  riskScore: decimal("risk_score", { precision: 3, scale: 1 }),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Educational courses and content
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'pressing', 'grading', 'investing', 'collection'
  difficulty: text("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
  requiredTier: text("required_tier").notNull().default("free"), // 'free', 'pro', 'elite'
  duration: integer("duration"), // Duration in minutes
  modules: jsonb("modules"), // Course modules and content
  prerequisites: text("prerequisites").array(),
  learningOutcomes: text("learning_outcomes").array(),
  thumbnailUrl: text("thumbnail_url"),
  videoUrl: text("video_url"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User course progress and certifications
export const userCourseProgress = pgTable("user_course_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  progress: decimal("progress", { precision: 8, scale: 2 }).default("0"), // 0-100%
  currentModule: integer("current_module").default(1),
  completedModules: integer("completed_modules").array(),
  timeSpent: integer("time_spent").default(0), // Minutes
  quizScores: jsonb("quiz_scores"),
  certificateEarned: boolean("certificate_earned").default(false),
  certificateUrl: text("certificate_url"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Market events that affect asset prices
export const marketEvents = pgTable("market_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"), // 'movie', 'tv', 'comic_release', 'convention', etc.
  impact: text("impact"), // 'positive', 'negative', 'neutral'
  significance: decimal("significance", { precision: 2, scale: 1 }), // Impact significance 1-10
  affectedAssets: text("affected_assets").array(), // Asset IDs
  eventDate: timestamp("event_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schemas for all tables
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for Replit Auth upsert operations
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHoldingSchema = createInsertSchema(holdings).omit({
  id: true,
  updatedAt: true,
});

export const insertMarketInsightSchema = createInsertSchema(marketInsights).omit({
  id: true,
  createdAt: true,
});

export const insertMarketIndexSchema = createInsertSchema(marketIndices).omit({
  id: true,
  createdAt: true,
});

export const insertMarketIndexDataSchema = createInsertSchema(marketIndexData).omit({
  id: true,
  createdAt: true,
});

export const insertWatchlistSchema = createInsertSchema(watchlists).omit({
  id: true,
  createdAt: true,
});

export const insertWatchlistAssetSchema = createInsertSchema(watchlistAssets).omit({
  id: true,
  addedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
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

export const insertMarketEventSchema = createInsertSchema(marketEvents).omit({
  id: true,
  createdAt: true,
});

// Knowledge Test insert schemas
export const insertKnowledgeTestResultSchema = createInsertSchema(knowledgeTestResults).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertKnowledgeTestResponseSchema = createInsertSchema(knowledgeTestResponses).omit({
  id: true,
  createdAt: true,
});

// Beat the AI Challenge Schema
export const beatTheAIChallenge = pgTable('beat_the_ai_challenges', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  description: text('description').notNull(),
  targetAssets: text('target_assets').array().notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  prizePool: decimal('prize_pool', { precision: 10, scale: 2 }).notNull(),
  participantCount: integer('participant_count').default(0),
  aiPrediction: decimal('ai_prediction', { precision: 8, scale: 2 }).notNull(),
  status: text('status', { enum: ['ACTIVE', 'UPCOMING', 'COMPLETED'] }).notNull().default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type BeatTheAIChallenge = typeof beatTheAIChallenge.$inferSelect;
export const insertBeatTheAIChallenge = createInsertSchema(beatTheAIChallenge).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export type InsertBeatTheAIChallenge = z.infer<typeof insertBeatTheAIChallenge>;

// Beat the AI Prediction Submission Schema
export const beatTheAIPrediction = pgTable('beat_the_ai_predictions', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  challengeId: varchar('challenge_id').references(() => beatTheAIChallenge.id).notNull(),
  userId: varchar('user_id').notNull(),
  username: text('username').notNull(),
  assetSymbol: text('asset_symbol').notNull(),
  predictedChange: decimal('predicted_change', { precision: 8, scale: 2 }).notNull(),
  submissionTime: timestamp('submission_time').defaultNow().notNull(),
  actualChange: decimal('actual_change', { precision: 8, scale: 2 }),
  score: decimal('score', { precision: 8, scale: 2 }),
  isWinner: boolean('is_winner').default(false)
});

export type BeatTheAIPrediction = typeof beatTheAIPrediction.$inferSelect;
export const insertBeatTheAIPrediction = createInsertSchema(beatTheAIPrediction).omit({
  id: true,
  submissionTime: true,
  actualChange: true,
  score: true,
  isWinner: true
});
export type InsertBeatTheAIPrediction = z.infer<typeof insertBeatTheAIPrediction>;

// Beat the AI Leaderboard Schema  
export const beatTheAILeaderboard = pgTable('beat_the_ai_leaderboard', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').notNull(),
  username: text('username').notNull(),
  totalScore: decimal('total_score', { precision: 10, scale: 2 }).default('0'),
  accuracy: decimal('accuracy', { precision: 8, scale: 2 }).default('0'),
  totalPredictions: integer('total_predictions').default(0),
  winnings: decimal('winnings', { precision: 10, scale: 2 }).default('0'),
  rank: integer('rank').default(0),
  lastActive: timestamp('last_active').defaultNow().notNull()
});

export type BeatTheAILeaderboard = typeof beatTheAILeaderboard.$inferSelect;
export const insertBeatTheAILeaderboard = createInsertSchema(beatTheAILeaderboard).omit({
  id: true,
  lastActive: true
});
export type InsertBeatTheAILeaderboard = z.infer<typeof insertBeatTheAILeaderboard>;

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;

export type MarketData = typeof marketData.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;

export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;

export type Holding = typeof holdings.$inferSelect;
export type InsertHolding = z.infer<typeof insertHoldingSchema>;

export type MarketInsight = typeof marketInsights.$inferSelect;
export type InsertMarketInsight = z.infer<typeof insertMarketInsightSchema>;

export type MarketIndex = typeof marketIndices.$inferSelect;
export type InsertMarketIndex = z.infer<typeof insertMarketIndexSchema>;

export type MarketIndexData = typeof marketIndexData.$inferSelect;
export type InsertMarketIndexData = z.infer<typeof insertMarketIndexDataSchema>;

export type Watchlist = typeof watchlists.$inferSelect;
export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;

export type WatchlistAsset = typeof watchlistAssets.$inferSelect;
export type InsertWatchlistAsset = z.infer<typeof insertWatchlistAssetSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type MarketEvent = typeof marketEvents.$inferSelect;
export type InsertMarketEvent = z.infer<typeof insertMarketEventSchema>;

// Comic Series - Information about comic book series (from comic_list CSV)
export const comicSeries = pgTable("comic_series", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seriesName: text("series_name").notNull(),
  publisher: text("publisher").notNull(), // Marvel, DC, etc.
  year: integer("year"),
  issueCount: text("issue_count"), // "73 issues (73 indexed)"
  coverStatus: text("cover_status"), // "Gallery", "Have 8 (Need 2)"
  publishedPeriod: text("published_period"), // "March 1941 - July 1949"
  seriesUrl: text("series_url"), // Link to comics.org series page
  coversUrl: text("covers_url"), // Link to covers gallery
  scansUrl: text("scans_url"), // Link to scans if available
  featuredCoverUrl: text("featured_cover_url"), // Featured cover image for display
  description: text("description"),
  // Vector embeddings for series search and recommendations
  seriesEmbedding: vector("series_embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comic Issues - Individual comic book issues (from Marvel_Comics 2 CSV)
export const comicIssues = pgTable("comic_issues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seriesId: varchar("series_id").references(() => comicSeries.id),
  comicName: text("comic_name").notNull(),
  activeYears: text("active_years"), // "(2016)" or "(2012 - 2014)"
  issueTitle: text("issue_title").notNull(),
  publishDate: text("publish_date"), // "April 01, 2016"
  issueDescription: text("issue_description"),
  penciler: text("penciler"),
  writer: text("writer"),
  coverArtist: text("cover_artist"),
  imprint: text("imprint"), // "Marvel Universe"
  format: text("format"), // "Comic", "Infinite Comic"
  rating: text("rating"), // "Rated T+"
  price: text("price"), // "$3.99", "Free"
  coverImageUrl: text("cover_image_url"), // Generated or extracted cover URL
  issueNumber: integer("issue_number"),
  volume: integer("volume"),
  // Market data
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  gradeCondition: text("grade_condition"), // CGC grade if known
  marketTrend: text("market_trend"), // 'up', 'down', 'stable'
  // Vector embeddings for content search and recommendations
  contentEmbedding: vector("content_embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comic Creators - Artists, writers, and other creators
export const comicCreators = pgTable("comic_creators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'writer', 'penciler', 'inker', 'colorist', 'cover_artist', 'editor'
  biography: text("biography"),
  imageUrl: text("image_url"),
  birthDate: text("birth_date"),
  deathDate: text("death_date"), // If applicable
  nationality: text("nationality"),
  // Career statistics
  totalIssues: integer("total_issues").default(0),
  activeYears: text("active_years"), // "1960-2020"
  notableWorks: text("notable_works").array(),
  awards: text("awards").array(),
  // Market influence
  marketInfluence: decimal("market_influence", { precision: 8, scale: 2 }), // 0-100 score
  trendingScore: decimal("trending_score", { precision: 8, scale: 2 }), // Current trending
  // Vector embeddings for creator search and style matching
  creatorEmbedding: vector("creator_embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Featured Comics - Curated selections for homepage display
export const featuredComics = pgTable("featured_comics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  issueId: varchar("issue_id").references(() => comicIssues.id),
  seriesId: varchar("series_id").references(() => comicSeries.id),
  featureType: text("feature_type").notNull(), // 'hero_banner', 'trending', 'new_release', 'classic'
  displayOrder: integer("display_order").default(0),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  featuredImageUrl: text("featured_image_url"),
  callToAction: text("call_to_action"), // "Read Now", "Add to Watchlist"
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comic Grading Predictions Schema - AI-powered comic condition analysis
export const comicGradingPredictions = pgTable("comic_grading_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id), // Optional - for logged-in users
  imageUrl: text("image_url").notNull(), // URL of uploaded comic image
  imageName: text("image_name"), // Original filename
  // CGC Grade prediction (0.5-10.0 scale matching CGC standards)
  predictedGrade: decimal("predicted_grade", { precision: 3, scale: 1 }).notNull(),
  gradeCategory: text("grade_category").notNull(), // 'Poor', 'Fair', 'Good', 'Very Good', 'Fine', 'Very Fine', 'Near Mint', 'Mint'
  // Condition factors analysis
  conditionFactors: jsonb("condition_factors").notNull(), // { corners, spine, pages, colors, creases, tears, etc. }
  // AI analysis details
  confidenceScore: decimal("confidence_score", { precision: 8, scale: 2 }).notNull(), // 0-100 percentage
  analysisDetails: text("analysis_details").notNull(), // Detailed AI explanation
  gradingNotes: text("grading_notes"), // Specific observations affecting grade
  // Processing metadata
  processingTimeMs: integer("processing_time_ms"), // Time taken for AI analysis
  aiModel: text("ai_model").default("gpt-5"), // OpenAI model used
  // Status and timestamps
  status: text("status").notNull().default("completed"), // 'processing', 'completed', 'failed'
  // Vector embeddings for visual similarity search and pattern matching
  imageEmbedding: vector("image_embedding", { dimensions: 1536 }), // Image visual features for similarity matching
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for new comic tables
export const insertComicSeriesSchema = createInsertSchema(comicSeries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertComicIssueSchema = createInsertSchema(comicIssues).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertComicCreatorSchema = createInsertSchema(comicCreators).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeaturedComicSchema = createInsertSchema(featuredComics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertComicGradingPredictionSchema = createInsertSchema(comicGradingPredictions).omit({
  id: true,
  createdAt: true,
});

// Export types for new comic tables
export type ComicSeries = typeof comicSeries.$inferSelect;
export type InsertComicSeries = z.infer<typeof insertComicSeriesSchema>;

export type ComicIssue = typeof comicIssues.$inferSelect;
export type InsertComicIssue = z.infer<typeof insertComicIssueSchema>;

export type ComicCreator = typeof comicCreators.$inferSelect;
export type InsertComicCreator = z.infer<typeof insertComicCreatorSchema>;

export type FeaturedComic = typeof featuredComics.$inferSelect;
export type InsertFeaturedComic = z.infer<typeof insertFeaturedComicSchema>;

export type ComicGradingPrediction = typeof comicGradingPredictions.$inferSelect;
export type InsertComicGradingPrediction = z.infer<typeof insertComicGradingPredictionSchema>;

// Narrative Events System - Comic book plot events that affect market prices
export const narrativeEvents = pgTable("narrative_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventType: text("event_type").notNull(), // 'house_war', 'hero_falls', 'crossover_event', 'writer_scandal', 'movie_announcement', 'reboot', 'supply_shock'
  
  // Affected entities
  affectedHouses: text("affected_houses").array(), // Array of house IDs
  affectedAssets: text("affected_assets").array(), // Array of asset IDs
  
  // Impact and duration
  impactPercentage: decimal("impact_percentage", { precision: 8, scale: 2 }).notNull(), // -100 to +100
  duration: integer("duration").notNull(), // Duration in seconds
  severity: text("severity").notNull().default("low"), // 'low', 'medium', 'high', 'catastrophic'
  
  // Visual and narrative elements
  soundEffect: text("sound_effect"), // Comic book sound effect
  visualStyle: text("visual_style"), // 'explosion', 'dramatic', 'subtle', 'catastrophic'
  narrative: text("narrative"), // Extended story narrative
  
  // Timing and status
  isActive: boolean("is_active").default(false),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  
  // Market conditions that triggered event
  triggerCondition: text("trigger_condition"), // 'bull_market', 'bear_market', 'sideways', 'random'
  marketContext: jsonb("market_context"), // Market stats when event triggered
  
  // Chain reactions and compound effects
  parentEventId: varchar("parent_event_id"), // If this event was triggered by another
  chainReactionProbability: decimal("chain_reaction_probability", { precision: 5, scale: 2 }).default("0.00"), // 0-100%
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schema for narrative events
export const insertNarrativeEventSchema = createInsertSchema(narrativeEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type NarrativeEvent = typeof narrativeEvents.$inferSelect;
export type InsertNarrativeEvent = z.infer<typeof insertNarrativeEventSchema>;

// Phase 1 Trading Extensions

// Phase 1 Market Events - Terminal Clock market chaos events
export const phase1MarketEvents = pgTable("phase1_market_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: text("event_type").notNull(), // 'flash_crash', 'liquidity_crisis', 'margin_call_cascade', 'volatility_spike'
  severity: text("severity").notNull(), // 'low', 'medium', 'high', 'critical'
  title: text("title").notNull(),
  description: text("description"),
  impact: jsonb("impact"), // { priceMultiplier: 0.95, volatilityBoost: 1.5, affectedAssets: ['all'] }
  visualEffect: text("visual_effect"), // 'screen_flash', 'red_wash', 'glitch', 'static'
  triggerVolatilityLevel: decimal("trigger_volatility_level", { precision: 8, scale: 2 }), // Volatility level that triggered this
  duration: integer("duration").default(60), // Event duration in seconds
  timestamp: timestamp("timestamp").defaultNow(),
  endTimestamp: timestamp("end_timestamp"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Volatility History - Track market volatility levels over time
export const volatilityHistory = pgTable("volatility_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  level: decimal("level", { precision: 8, scale: 2 }).notNull(), // Current volatility multiplier (1.0 - 3.0+)
  marketPhase: text("market_phase").notNull(), // 'early_hours', 'mid_day', 'power_hour', 'terminal_hour'
  timeUntilTerminal: integer("time_until_terminal"), // Seconds until market close
  activeEvents: jsonb("active_events"), // Array of active event IDs
  affectedAssets: integer("affected_assets").default(0), // Number of assets affected
  tradingVolume: decimal("trading_volume", { precision: 15, scale: 2 }), // Total volume during this period
  priceSwings: jsonb("price_swings"), // { maxSwing: 0.15, avgSwing: 0.08 }
  timestamp: timestamp("timestamp").defaultNow(),
});

// Trading Sessions - Track user trading activity and performance
export const tradingSessions = pgTable("trading_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  sessionStart: timestamp("session_start").defaultNow().notNull(),
  sessionEnd: timestamp("session_end"),
  // Session Performance Metrics
  startingBalance: decimal("starting_balance", { precision: 15, scale: 2 }).notNull(),
  endingBalance: decimal("ending_balance", { precision: 15, scale: 2 }),
  totalTrades: integer("total_trades").default(0),
  profitableTrades: integer("profitable_trades").default(0),
  sessionProfit: decimal("session_profit", { precision: 15, scale: 2 }).default("0.00"),
  sessionProfitPercent: decimal("session_profit_percent", { precision: 8, scale: 2 }).default("0.00"),
  largestWin: decimal("largest_win", { precision: 15, scale: 2 }).default("0.00"),
  largestLoss: decimal("largest_loss", { precision: 15, scale: 2 }).default("0.00"),
  // Session Activity
  assetsTraded: text("assets_traded").array(), // Array of asset IDs traded in this session
  tradingStrategy: text("trading_strategy"), // 'day_trading', 'swing_trading', 'position_trading'
  notes: text("notes"), // User notes about the session
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Asset Current Prices - Real-time pricing for trading
export const assetCurrentPrices = pgTable("asset_current_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
  bidPrice: decimal("bid_price", { precision: 10, scale: 2 }),
  askPrice: decimal("ask_price", { precision: 10, scale: 2 }),
  dayChange: decimal("day_change", { precision: 10, scale: 2 }),
  dayChangePercent: decimal("day_change_percent", { precision: 8, scale: 2 }),
  weekHigh: decimal("week_high", { precision: 10, scale: 2 }), // 52-week high price
  volume: integer("volume").default(0),
  lastTradePrice: decimal("last_trade_price", { precision: 10, scale: 2 }),
  lastTradeQuantity: decimal("last_trade_quantity", { precision: 10, scale: 4 }),
  lastTradeTime: timestamp("last_trade_time"),
  // Market status
  marketStatus: text("market_status").default("open"), // 'open', 'closed', 'suspended'
  priceSource: text("price_source").default("simulation"), // 'simulation', 'external_api', 'manual'
  // Volatility and risk metrics
  volatility: decimal("volatility", { precision: 8, scale: 2 }), // Price volatility percentage
  beta: decimal("beta", { precision: 3, scale: 2 }), // Beta relative to market
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Trading Limits - User-specific trading limits and restrictions
export const tradingLimits = pgTable("trading_limits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  assetId: varchar("asset_id").references(() => assets.id), // Asset-specific limits (null for general limits)
  limitType: text("limit_type").notNull(), // 'daily_volume', 'position_size', 'loss_limit', 'exposure_limit'
  limitValue: decimal("limit_value", { precision: 15, scale: 2 }).notNull(),
  currentUsage: decimal("current_usage", { precision: 15, scale: 2 }).default("0.00"),
  resetPeriod: text("reset_period").default("daily"), // 'daily', 'weekly', 'monthly', 'never'
  lastReset: timestamp("last_reset").defaultNow(),
  isActive: boolean("is_active").default(true),
  // Breach tracking
  breachCount: integer("breach_count").default(0),
  lastBreach: timestamp("last_breach"),
  breachAction: text("breach_action").default("block"), // 'block', 'warn', 'log'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for new Phase 1 trading tables
export const insertTradingSessionSchema = createInsertSchema(tradingSessions).omit({
  id: true,
  createdAt: true,
});

export const insertAssetCurrentPriceSchema = createInsertSchema(assetCurrentPrices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTradingLimitSchema = createInsertSchema(tradingLimits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export types for new Phase 1 trading tables
export type TradingSession = typeof tradingSessions.$inferSelect;
export type InsertTradingSession = z.infer<typeof insertTradingSessionSchema>;

export type AssetCurrentPrice = typeof assetCurrentPrices.$inferSelect;
export type InsertAssetCurrentPrice = z.infer<typeof insertAssetCurrentPriceSchema>;

export type TradingLimit = typeof tradingLimits.$inferSelect;
export type InsertTradingLimit = z.infer<typeof insertTradingLimitSchema>;

// PHASE 1 CORE TRADING FOUNDATIONS - Real Order Execution and Portfolio Management

// Trades table - Executed trades history with P&L tracking
export const trades = pgTable("trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  orderId: varchar("order_id").references(() => orders.id), // Link to the order that created this trade
  side: text("side").notNull(), // 'buy' or 'sell'
  quantity: decimal("quantity", { precision: 10, scale: 4 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }).notNull(),
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0.00"),
  // P&L Tracking
  pnl: decimal("pnl", { precision: 15, scale: 2 }), // Realized P&L for sell trades
  pnlPercent: decimal("pnl_percent", { precision: 8, scale: 2 }), // Percentage P&L
  costBasis: decimal("cost_basis", { precision: 15, scale: 2 }), // For sell trades - the original cost
  // Trade metadata
  executedAt: timestamp("executed_at").defaultNow().notNull(),
  tradeType: text("trade_type").default("manual"), // 'manual', 'stop_loss', 'take_profit', 'liquidation'
  notes: text("notes"),
  // Moral consequence tracking
  moralImpact: decimal("moral_impact", { precision: 10, scale: 2 }), // Moral impact score of the trade
  createdAt: timestamp("created_at").defaultNow(),
});

// Positions table - Current open positions with unrealized P&L
export const positions = pgTable("positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  quantity: decimal("quantity", { precision: 10, scale: 4 }).notNull(),
  averageCost: decimal("average_cost", { precision: 10, scale: 2 }).notNull(),
  totalCostBasis: decimal("total_cost_basis", { precision: 15, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 15, scale: 2 }),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }),
  unrealizedPnl: decimal("unrealized_pnl", { precision: 15, scale: 2 }),
  unrealizedPnlPercent: decimal("unrealized_pnl_percent", { precision: 8, scale: 2 }),
  // Position metadata
  firstBuyDate: timestamp("first_buy_date").notNull(),
  lastTradeDate: timestamp("last_trade_date").notNull(),
  totalBuys: integer("total_buys").default(1),
  totalSells: integer("total_sells").default(0),
  holdingPeriodDays: integer("holding_period_days"),
  // Risk management
  stopLossPrice: decimal("stop_loss_price", { precision: 10, scale: 2 }),
  takeProfitPrice: decimal("take_profit_price", { precision: 10, scale: 2 }),
  maxPositionValue: decimal("max_position_value", { precision: 15, scale: 2 }), // Historical max value
  maxUnrealizedProfit: decimal("max_unrealized_profit", { precision: 15, scale: 2 }), // Track max profit reached
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Balances table - User account balances and buying power
export const balances = pgTable("balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  // Core balances
  cash: decimal("cash", { precision: 15, scale: 2 }).notNull().default("100000.00"),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }).notNull().default("100000.00"),
  buyingPower: decimal("buying_power", { precision: 15, scale: 2 }).notNull().default("100000.00"),
  // Position values
  positionsValue: decimal("positions_value", { precision: 15, scale: 2 }).default("0.00"),
  totalCostBasis: decimal("total_cost_basis", { precision: 15, scale: 2 }).default("0.00"),
  // P&L tracking
  realizedPnl: decimal("realized_pnl", { precision: 15, scale: 2 }).default("0.00"),
  unrealizedPnl: decimal("unrealized_pnl", { precision: 15, scale: 2 }).default("0.00"),
  totalPnl: decimal("total_pnl", { precision: 15, scale: 2 }).default("0.00"),
  // Daily tracking
  dayStartBalance: decimal("day_start_balance", { precision: 15, scale: 2 }),
  dayPnl: decimal("day_pnl", { precision: 15, scale: 2 }).default("0.00"),
  dayPnlPercent: decimal("day_pnl_percent", { precision: 8, scale: 2 }).default("0.00"),
  // Performance metrics
  allTimeHigh: decimal("all_time_high", { precision: 15, scale: 2 }).default("100000.00"),
  allTimeLow: decimal("all_time_low", { precision: 15, scale: 2 }).default("100000.00"),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }), // Percentage of winning trades
  sharpeRatio: decimal("sharpe_ratio", { precision: 5, scale: 2 }), // Risk-adjusted returns
  // Margin and risk
  marginUsed: decimal("margin_used", { precision: 15, scale: 2 }).default("0.00"),
  maintenanceMargin: decimal("maintenance_margin", { precision: 15, scale: 2 }).default("0.00"),
  marginCallLevel: decimal("margin_call_level", { precision: 15, scale: 2 }),
  // Timestamps
  lastTradeAt: timestamp("last_trade_at"),
  lastCalculatedAt: timestamp("last_calculated_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// MORAL CONSEQUENCE SYSTEM TABLES - Dark mechanics where every profit creates victims

// Moral standings table - Tracks each user's corruption level and blood money
export const moralStandings = pgTable("moral_standings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  corruptionLevel: decimal("corruption_level", { precision: 5, scale: 2 }).default("0.00"), // 0-100 scale
  totalVictims: integer("total_victims").default(0),
  bloodMoney: decimal("blood_money", { precision: 15, scale: 2 }).default("0.00"), // Total money taken from others
  totalHarm: decimal("total_harm", { precision: 15, scale: 2 }).default("0.00"), // Total financial harm caused
  lastConfession: timestamp("last_confession"), // Last time they "confessed" to reduce corruption
  confessionCount: integer("confession_count").default(0),
  soulWeight: text("soul_weight").default("unburdened"), // 'unburdened', 'tainted', 'heavy', 'crushing', 'damned'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Trading victims table - Every profitable trade creates a victim with a story
export const tradingVictims = pgTable("trading_victims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tradeId: varchar("trade_id").notNull().references(() => trades.id),
  userId: varchar("user_id").notNull().references(() => users.id), // The trader who caused this victim
  victimName: text("victim_name").notNull(), // Generated realistic name
  victimStory: text("victim_story").notNull(), // The human cost of this trade
  lossAmount: decimal("loss_amount", { precision: 15, scale: 2 }).notNull(),
  impactLevel: text("impact_level").notNull(), // 'minor', 'moderate', 'severe', 'catastrophic'
  // Victim details for more emotional impact
  age: integer("age"),
  occupation: text("occupation"),
  familySize: integer("family_size"),
  consequence: text("consequence"), // What happened as a result
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for moral consequence tables
export const insertMoralStandingSchema = createInsertSchema(moralStandings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTradingVictimSchema = createInsertSchema(tradingVictims).omit({
  id: true,
  createdAt: true,
});

// Insert schemas for new trading tables
export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
  executedAt: true,
  createdAt: true,
});

export const insertPositionSchema = createInsertSchema(positions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBalanceSchema = createInsertSchema(balances).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastCalculatedAt: true,
});

// Export types for new trading tables
export type Trade = typeof trades.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;

export type Position = typeof positions.$inferSelect;
export type InsertPosition = z.infer<typeof insertPositionSchema>;

export type Balance = typeof balances.$inferSelect;
export type InsertBalance = z.infer<typeof insertBalanceSchema>;

// Export types for moral consequence tables
export type MoralStanding = typeof moralStandings.$inferSelect;
export type InsertMoralStanding = z.infer<typeof insertMoralStandingSchema>;

export type TradingVictim = typeof tradingVictims.$inferSelect;
export type InsertTradingVictim = z.infer<typeof insertTradingVictimSchema>;

// NOTIFICATION SYSTEM TABLES - Phase 1 Real-time Notifications

// Notifications table for storing notification history
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'order' | 'price_alert' | 'market_update' | 'portfolio'
  title: text("title").notNull(),
  message: text("message").notNull(),
  priority: text("priority").notNull().default("medium"), // 'low' | 'medium' | 'high' | 'critical'
  read: boolean("read").default(false),
  actionUrl: text("action_url"), // Optional URL for clickable actions
  metadata: jsonb("metadata"), // Additional notification data (order details, etc.)
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // Optional expiration date
});

// Price alerts table with user-defined thresholds
export const priceAlerts = pgTable("price_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  alertType: text("alert_type").notNull(), // 'price_above' | 'price_below' | 'percent_change' | 'volume_spike'
  thresholdValue: decimal("threshold_value", { precision: 10, scale: 2 }).notNull(),
  percentageThreshold: decimal("percentage_threshold", { precision: 8, scale: 2 }), // For percentage-based alerts
  isActive: boolean("is_active").default(true),
  lastTriggeredPrice: decimal("last_triggered_price", { precision: 10, scale: 2 }),
  triggerCount: integer("trigger_count").default(0),
  cooldownMinutes: integer("cooldown_minutes").default(60), // Prevent spam alerts
  name: text("name"), // User-defined alert name
  notes: text("notes"), // User notes about the alert
  createdAt: timestamp("created_at").defaultNow(),
  triggeredAt: timestamp("triggered_at"),
  lastCheckedAt: timestamp("last_checked_at").defaultNow(),
});

// Notification preferences table for user settings
export const notificationPreferences = pgTable("notification_preferences", {
  userId: varchar("user_id").primaryKey().references(() => users.id),
  // Notification type preferences
  orderNotifications: boolean("order_notifications").default(true),
  priceAlerts: boolean("price_alerts").default(true),
  marketUpdates: boolean("market_updates").default(true),
  portfolioAlerts: boolean("portfolio_alerts").default(true),
  // Delivery method preferences
  emailNotifications: boolean("email_notifications").default(false),
  pushNotifications: boolean("push_notifications").default(true),
  toastNotifications: boolean("toast_notifications").default(true),
  // Priority filtering
  lowPriorityEnabled: boolean("low_priority_enabled").default(true),
  mediumPriorityEnabled: boolean("medium_priority_enabled").default(true),
  highPriorityEnabled: boolean("high_priority_enabled").default(true),
  criticalPriorityEnabled: boolean("critical_priority_enabled").default(true),
  // Quiet hours settings
  quietHoursEnabled: boolean("quiet_hours_enabled").default(false),
  quietHoursStart: text("quiet_hours_start"), // "22:00" format
  quietHoursEnd: text("quiet_hours_end"), // "08:00" format
  quietHoursTimezone: text("quiet_hours_timezone").default("UTC"),
  // Advanced preferences
  groupSimilarNotifications: boolean("group_similar_notifications").default(true),
  maxDailyNotifications: integer("max_daily_notifications").default(50),
  soundEnabled: boolean("sound_enabled").default(true),
  vibrationEnabled: boolean("vibration_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notification templates for different event types
export const notificationTemplates = pgTable("notification_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'order_filled', 'price_alert_triggered', etc.
  priority: text("priority").notNull().default("medium"),
  titleTemplate: text("title_template").notNull(), // "Order Filled: {assetName}"
  messageTemplate: text("message_template").notNull(), // "Your order for {quantity} shares of {assetName} has been filled at {price}"
  actionUrlTemplate: text("action_url_template"), // "/trading?order={orderId}"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for notification tables
export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertPriceAlertSchema = createInsertSchema(priceAlerts).omit({
  id: true,
  createdAt: true,
  triggeredAt: true,
  lastCheckedAt: true,
});

export const insertNotificationPreferencesSchema = createInsertSchema(notificationPreferences).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationTemplateSchema = createInsertSchema(notificationTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// PHASE 2: MYTHOLOGICAL TRADING RPG SYSTEM

// Seven Mythological Houses - Core trading houses system
export const mythologicalHouses = pgTable("mythological_houses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // "House of Eternity", "House of Conquest", etc.
  mythology: text("mythology").notNull(), // "Egyptian", "Roman", "Greek", "Norse", "Asian", "African", "Indian"
  firmName: text("firm_name").notNull(), // Hidden firm name overlay
  description: text("description").notNull(),
  philosophy: text("philosophy").notNull(), // Trading philosophy
  // House specializations
  primarySpecialization: text("primary_specialization").notNull(), // Asset type they excel in
  weaknessSpecialization: text("weakness_specialization").notNull(), // Asset type they struggle with
  // House modifiers and bonuses
  tradingBonusPercent: decimal("trading_bonus_percent", { precision: 8, scale: 2 }).default("0.00"),
  karmaMultiplier: decimal("karma_multiplier", { precision: 3, scale: 2 }).default("1.00"),
  // Visual and thematic elements
  primaryColor: text("primary_color"), // UI color theme
  iconName: text("icon_name"), // Lucide icon
  backgroundImageUrl: text("background_image_url"),
  // House lore and storytelling
  originStory: text("origin_story"),
  notableMembers: text("notable_members").array(),
  traditions: text("traditions").array(),
  // House statistics
  totalMembers: integer("total_members").default(0),
  averagePerformance: decimal("average_performance", { precision: 8, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User House Membership - Players belong to houses
export const userHouseMembership = pgTable("user_house_membership", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  houseId: varchar("house_id").notNull().references(() => mythologicalHouses.id),
  joinedAt: timestamp("joined_at").defaultNow(),
  membershipLevel: text("membership_level").default("initiate"), // "initiate", "member", "senior", "elder"
  // House-specific progression
  houseLoyalty: decimal("house_loyalty", { precision: 8, scale: 2 }).default("0.00"), // 0-100
  houseContributions: integer("house_contributions").default(0),
  houseRank: integer("house_rank"),
  // House bonuses and penalties
  currentBonusPercent: decimal("current_bonus_percent", { precision: 8, scale: 2 }).default("0.00"),
  totalBonusEarned: decimal("total_bonus_earned", { precision: 15, scale: 2 }).default("0.00"),
  // Status tracking
  isActive: boolean("is_active").default(true),
  leftAt: timestamp("left_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Karmic Alignment System - Hidden behavior tracking
export const userKarmicAlignment = pgTable("user_karmic_alignment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Current karmic state
  currentAlignment: text("current_alignment"), // "good", "neutral", "evil" (null until Reckoning)
  karmaScore: decimal("karma_score", { precision: 8, scale: 2 }).default("0.00"), // Running karma total
  alignmentStrength: decimal("alignment_strength", { precision: 8, scale: 2 }).default("0.00"), // How locked in
  // Behavioral tracking (hidden from user until Reckoning)
  honestyScore: decimal("honesty_score", { precision: 8, scale: 2 }).default("50.00"), // 0-100
  cooperationScore: decimal("cooperation_score", { precision: 8, scale: 2 }).default("50.00"), // 0-100
  exploitationScore: decimal("exploitation_score", { precision: 8, scale: 2 }).default("0.00"), // 0-100
  generosityScore: decimal("generosity_score", { precision: 8, scale: 2 }).default("50.00"), // 0-100
  // Action counters
  honestActions: integer("honest_actions").default(0),
  deceptiveActions: integer("deceptive_actions").default(0),
  helpfulActions: integer("helpful_actions").default(0),
  harmfulActions: integer("harmful_actions").default(0),
  // Trading modifiers (applied secretly)
  successModifier: decimal("success_modifier", { precision: 3, scale: 2 }).default("1.00"), // 0.5-1.5 multiplier
  luckyBreakChance: decimal("lucky_break_chance", { precision: 3, scale: 2 }).default("0.05"), // 0-0.2 chance
  badLuckChance: decimal("bad_luck_chance", { precision: 3, scale: 2 }).default("0.05"), // 0-0.2 chance
  // Reckoning system
  hasExperiencedReckoning: boolean("has_experienced_reckoning").default(false),
  reckoningDate: timestamp("reckoning_date"),
  chosenAlignment: text("chosen_alignment"), // Post-reckoning chosen alignment
  alignmentLocked: boolean("alignment_locked").default(false),
  // Progression tracking
  learningModuleBonuses: jsonb("learning_module_bonuses"), // House-specific bonuses from education
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Karmic Actions Log - Track all moral choices
export const karmicActionsLog = pgTable("karmic_actions_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  actionType: text("action_type").notNull(), // "trade", "tip", "information_sharing", "market_manipulation"
  actionCategory: text("action_category").notNull(), // "honest", "deceptive", "helpful", "harmful", "neutral"
  karmaImpact: decimal("karma_impact", { precision: 8, scale: 2 }).notNull(), // Can be negative
  description: text("description").notNull(),
  // Context data
  relatedAssetId: varchar("related_asset_id").references(() => assets.id),
  relatedOrderId: varchar("related_order_id").references(() => orders.id),
  targetUserId: varchar("target_user_id").references(() => users.id), // If action affects another user
  metadata: jsonb("metadata"), // Additional context
  // Alignment influence
  alignmentDirection: text("alignment_direction"), // "good", "evil", "neutral"
  strengthImpact: decimal("strength_impact", { precision: 3, scale: 2 }).default("0.00"),
  // Visibility
  isVisibleToUser: boolean("is_visible_to_user").default(false), // Hidden until Reckoning
  revealedAt: timestamp("revealed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// PANEL PROFITS: Seven Houses of Paneltown Trading System
// Crime families controlling different comic asset sectors

// ==========================================
// Psychological Profiling Entry Test System
// ==========================================

// Test questions for psychological profiling
export const testQuestions = pgTable("test_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  questionNumber: integer("question_number").notNull().unique(), // Order of presentation
  category: text("category").notNull(), // 'risk_tolerance', 'moral_flexibility', 'leadership', 'loyalty_ambition', 'ends_means'
  scenario: text("scenario").notNull(), // The moral/ethical scenario description
  contextualSetup: text("contextual_setup"), // Additional context to make scenario more immersive
  
  // Options for the question (stored as JSONB for flexibility)
  options: jsonb("options").notNull(), // Array of {id, text, psychologicalWeights}
  
  // Psychological dimensions this question evaluates
  dimensions: jsonb("dimensions").notNull(), // {analytical: 0.8, aggressive: 0.2, strategic: 0.5, ...}
  
  // House alignment weights (how much each answer aligns with each house)
  houseWeights: jsonb("house_weights").notNull(), // {solon: {...}, velos_thorne: {...}, ...}
  
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User responses to test questions
export const testResponses = pgTable("test_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").notNull(), // Groups responses from a single test session
  questionId: varchar("question_id").notNull().references(() => testQuestions.id),
  selectedOptionId: text("selected_option_id").notNull(), // Which option they chose
  responseTime: integer("response_time"), // Milliseconds to answer (can indicate thoughtfulness)
  
  // Calculated psychological scores from this response
  dimensionScores: jsonb("dimension_scores"), // {analytical: 0.7, aggressive: 0.3, ...}
  houseAffinities: jsonb("house_affinities"), // {solon: 0.6, velos_thorne: 0.2, ...}
  
  respondedAt: timestamp("responded_at").defaultNow(),
});

// Test results and house assignment
export const testResults = pgTable("test_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(), // One result per user
  sessionId: varchar("session_id").notNull().unique(), // Links to test session
  
  // Overall psychological profile
  psychologicalProfile: jsonb("psychological_profile").notNull(), // Comprehensive profile data
  
  // Primary house assignment
  assignedHouseId: text("assigned_house_id").notNull(), // Primary house match
  primaryAffinity: decimal("primary_affinity", { precision: 5, scale: 2 }).notNull(), // Match percentage
  
  // Secondary and tertiary affinities
  secondaryHouseId: text("secondary_house_id"),
  secondaryAffinity: decimal("secondary_affinity", { precision: 5, scale: 2 }),
  tertiaryHouseId: text("tertiary_house_id"),
  tertiaryAffinity: decimal("tertiary_affinity", { precision: 5, scale: 2 }),
  
  // All house scores for transparency
  allHouseScores: jsonb("all_house_scores").notNull(), // {solon: 0.75, velos_thorne: 0.45, ...}
  
  // Detailed dimension scores
  dimensionBreakdown: jsonb("dimension_breakdown").notNull(), // All psychological dimensions scored
  
  // Test metadata
  totalQuestions: integer("total_questions").notNull(),
  completionTime: integer("completion_time"), // Total milliseconds
  consistencyScore: decimal("consistency_score", { precision: 5, scale: 2 }), // How consistent responses were
  
  // Narrative explanation of assignment
  assignmentRationale: text("assignment_rationale"), // AI-generated or template explanation
  
  completedAt: timestamp("completed_at").defaultNow(),
});

// Test sessions to track incomplete tests
export const testSessions = pgTable("test_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").notNull().unique(),
  currentQuestionNumber: integer("current_question_number").default(1),
  status: text("status").notNull().default("in_progress"), // 'in_progress', 'completed', 'abandoned'
  startedAt: timestamp("started_at").defaultNow(),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// The Seven Houses - Main houses table
export const sevenHouses = pgTable("seven_houses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(), // Sequential Securities, Ink & Blood Syndicate, etc.
  description: text("description").notNull(),
  specialization: text("specialization").notNull(), // Type of assets they control
  color: text("color").notNull(), // Strategic accent color (hex) for noir aesthetic
  symbol: text("symbol"), // Icon/emblem identifier (lucide icon name)
  
  // House power and reputation
  reputationScore: decimal("reputation_score", { precision: 10, scale: 2 }).default("100.00"),
  powerLevel: decimal("power_level", { precision: 10, scale: 2 }).default("100.00"),
  marketCap: decimal("market_cap", { precision: 15, scale: 2 }).default("0.00"),
  dailyVolume: decimal("daily_volume", { precision: 15, scale: 2 }).default("0.00"),
  controlledAssetsCount: integer("controlled_assets_count").default(0),
  
  // House narrative elements
  houseSlogan: text("house_slogan"),
  headquartersLocation: text("headquarters_location"), // Location in Paneltown
  rivalHouses: text("rival_houses").array(), // Array of house IDs they compete with
  allianceHouses: text("alliance_houses").array(), // Temporary alliances
  
  // House leadership and members
  bossName: text("boss_name"), // The head of the house
  memberCount: integer("member_count").default(0),
  lieutenants: text("lieutenants").array(), // Key members
  
  // Trading modifiers and bonuses
  tradingBonusPercent: decimal("trading_bonus_percent", { precision: 8, scale: 2 }).default("0.00"),
  specialPowerDescription: text("special_power_description"), // Unique house ability
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// House Power Rankings - Track dominance in the market
export const housePowerRankings = pgTable("house_power_rankings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  houseId: varchar("house_id").notNull().references(() => sevenHouses.id),
  week: timestamp("week").notNull(), // Weekly tracking
  rankPosition: integer("rank_position").notNull(), // 1-7
  powerScore: decimal("power_score", { precision: 10, scale: 2 }).notNull(),
  weeklyVolume: decimal("weekly_volume", { precision: 15, scale: 2 }).notNull(),
  weeklyProfit: decimal("weekly_profit", { precision: 15, scale: 2 }).notNull(),
  marketSharePercent: decimal("market_share_percent", { precision: 5, scale: 2 }).notNull(),
  territoryGains: integer("territory_gains").default(0), // Assets gained control of
  territoryLosses: integer("territory_losses").default(0), // Assets lost control of
  createdAt: timestamp("created_at").defaultNow(),
});

// House Market Events - Crime family power struggles
export const houseMarketEvents = pgTable("house_market_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: text("event_type").notNull(), // 'turf_war', 'hostile_takeover', 'alliance', 'betrayal'
  triggerHouseId: varchar("trigger_house_id").references(() => sevenHouses.id),
  targetHouseId: varchar("target_house_id").references(() => sevenHouses.id),
  affectedAssetIds: text("affected_asset_ids").array(),
  
  // Event impact
  powerShift: decimal("power_shift", { precision: 8, scale: 2 }), // Power transferred
  marketImpact: jsonb("market_impact"), // Price changes, volume spikes
  
  // Narrative elements
  eventTitle: text("event_title").notNull(), // Headline
  eventNarrative: text("event_narrative"), // Comic-style story text
  impactDescription: text("impact_description"),
  soundEffect: text("sound_effect"), // "BOOM!", "CRASH!", "KA-CHING!"
  comicPanelStyle: text("comic_panel_style"), // 'action', 'dramatic', 'noir'
  
  eventTimestamp: timestamp("event_timestamp").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced Character Data - Integrating battle scenarios and character datasets
export const enhancedCharacters = pgTable("enhanced_characters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Basic character info (from character datasets)
  name: text("name").notNull(),
  universe: text("universe").notNull(), // "Marvel", "DC Comics", etc.
  pageId: text("page_id"), // Original wikia page ID
  url: text("url"), // Full wikia URL
  // Character attributes
  identity: text("identity"), // "Public", "Secret"
  gender: text("gender"),
  maritalStatus: text("marital_status"),
  teams: text("teams").array(),
  weight: decimal("weight", { precision: 5, scale: 1 }), // kg
  creators: text("creators").array(),
  // Battle statistics (from battle scenarios CSV)
  strength: integer("strength"), // 1-10 scale
  speed: integer("speed"), // 1-10 scale
  intelligence: integer("intelligence"), // 1-10 scale
  specialAbilities: text("special_abilities").array(),
  weaknesses: text("weaknesses").array(),
  // Calculated power metrics
  powerLevel: decimal("power_level", { precision: 8, scale: 2 }), // Calculated from stats
  battleWinRate: decimal("battle_win_rate", { precision: 8, scale: 2 }), // From battle outcomes
  totalBattles: integer("total_battles").default(0),
  battlesWon: integer("battles_won").default(0),
  // Market influence
  marketValue: decimal("market_value", { precision: 10, scale: 2 }),
  popularityScore: decimal("popularity_score", { precision: 8, scale: 2 }),
  movieAppearances: integer("movie_appearances").default(0),
  // Asset linking
  assetId: varchar("asset_id").references(() => assets.id), // Link to tradeable asset
  // Vector embeddings for character similarity and recommendations
  characterEmbedding: vector("character_embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Battle Scenarios - Combat simulations affecting character values
export const battleScenarios = pgTable("battle_scenarios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  character1Id: varchar("character1_id").notNull().references(() => enhancedCharacters.id),
  character2Id: varchar("character2_id").references(() => enhancedCharacters.id), // Null for team battles
  battleType: text("battle_type").default("one_vs_one"), // "one_vs_one", "team", "tournament"
  outcome: integer("outcome").notNull(), // 0 = loss, 1 = win for character1
  // Battle conditions
  environment: text("environment"), // "city", "space", "underwater", etc.
  weatherConditions: text("weather_conditions"),
  additionalFactors: jsonb("additional_factors"),
  // Market impact
  marketImpactPercent: decimal("market_impact_percent", { precision: 8, scale: 2 }), // How much this affects character values
  fanEngagement: integer("fan_engagement").default(0), // Simulated fan interest
  mediaAttention: decimal("media_attention", { precision: 3, scale: 2 }).default("1.00"),
  // Battle metadata
  duration: integer("duration"), // Battle length in minutes
  decisiveness: text("decisiveness"), // "close", "clear", "overwhelming"
  isCanonical: boolean("is_canonical").default(false), // Official vs fan scenarios
  // Event tracking
  eventDate: timestamp("event_date").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced Comic Issues - Complete DC Comics dataset integration
export const enhancedComicIssues = pgTable("enhanced_comic_issues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Basic issue info (from DC Comics CSV)
  categoryTitle: text("category_title").notNull(),
  issueName: text("issue_name").notNull(),
  issueLink: text("issue_link"),
  comicSeries: text("comic_series").notNull(),
  comicType: text("comic_type"), // "Category", etc.
  // Creator information
  pencilers: text("pencilers").array(),
  coverArtists: text("cover_artists").array(),
  inkers: text("inkers").array(),
  writers: text("writers").array(),
  editors: text("editors").array(),
  executiveEditor: text("executive_editor"),
  letterers: text("letterers").array(),
  colourists: text("colourists").array(),
  // Publication details
  releaseDate: text("release_date"),
  rating: text("rating"),
  // Market data
  currentMarketValue: decimal("current_market_value", { precision: 10, scale: 2 }),
  historicalHigh: decimal("historical_high", { precision: 10, scale: 2 }),
  historicalLow: decimal("historical_low", { precision: 10, scale: 2 }),
  priceVolatility: decimal("price_volatility", { precision: 8, scale: 2 }),
  // Collectibility factors
  firstAppearances: text("first_appearances").array(), // Characters first appearing
  significantEvents: text("significant_events").array(),
  keyIssueRating: decimal("key_issue_rating", { precision: 3, scale: 1 }), // 1-10 importance scale
  rarityScore: decimal("rarity_score", { precision: 8, scale: 2 }),
  conditionSensitivity: decimal("condition_sensitivity", { precision: 3, scale: 2 }), // How much condition affects value
  // Asset linking
  assetId: varchar("asset_id").references(() => assets.id), // Link to tradeable asset
  // Vector embeddings for content search and recommendations
  contentEmbedding: vector("content_embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Movie Performance Data - Box office and critical data
export const moviePerformanceData = pgTable("movie_performance_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Movie details
  filmTitle: text("film_title").notNull(),
  releaseDate: text("release_date"),
  franchise: text("franchise").notNull(), // "DC", "Marvel"
  characterFamily: text("character_family").notNull(), // "Superman", "Batman", etc.
  distributor: text("distributor"),
  mpaaRating: text("mpaa_rating"),
  // Financial performance
  domesticGross: decimal("domestic_gross", { precision: 15, scale: 2 }),
  internationalGross: decimal("international_gross", { precision: 15, scale: 2 }),
  worldwideGross: decimal("worldwide_gross", { precision: 15, scale: 2 }),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  grossToBudgetRatio: decimal("gross_to_budget_ratio", { precision: 8, scale: 2 }),
  // Performance metrics
  domesticPercentage: decimal("domestic_percentage", { precision: 8, scale: 2 }),
  rottenTomatoesScore: integer("rotten_tomatoes_score"),
  isMcuFilm: boolean("is_mcu_film").default(false),
  mcuPhase: text("mcu_phase"),
  // Inflation-adjusted data
  inflationAdjustedGross: decimal("inflation_adjusted_gross", { precision: 15, scale: 2 }),
  inflationAdjustedBudget: decimal("inflation_adjusted_budget", { precision: 15, scale: 2 }),
  // Market impact
  marketImpactScore: decimal("market_impact_score", { precision: 8, scale: 2 }), // How much it affects related assets
  successCategory: text("success_category"), // "Success", "Flop", "Break Even"
  // Character relationships
  featuredCharacters: text("featured_characters").array(), // Characters featured in movie
  relatedAssets: text("related_assets").array(), // Asset IDs affected by this movie
  // Timeline and duration
  runtimeMinutes: integer("runtime_minutes"),
  releaseYear: integer("release_year"),
  // Performance analysis
  openingWeekendGross: decimal("opening_weekend_gross", { precision: 15, scale: 2 }),
  totalWeeksInTheaters: integer("total_weeks_in_theaters"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Learn Module System - Educational progression
export const learnModules = pgTable("learn_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "trading_basics", "comic_history", "market_analysis", "house_specialization"
  progressionLevel: text("progression_level").notNull(), // "junior_broker", "senior_broker", "agency_owner", "fund_manager", "family_office"
  houseSpecialization: varchar("house_specialization").references(() => mythologicalHouses.id), // House-specific modules
  // Module content
  moduleContent: jsonb("module_content").notNull(), // Structured lesson content
  estimatedDuration: integer("estimated_duration"), // Minutes
  difficultyLevel: integer("difficulty_level"), // 1-5
  prerequisites: text("prerequisites").array(), // Module IDs required before this one
  // Educational resources
  movieStills: text("movie_stills").array(), // Movie still URLs for visual learning
  interactiveElements: jsonb("interactive_elements"), // Quizzes, simulations, etc.
  learningObjectives: text("learning_objectives").array(),
  // Progression rewards
  completionKarmaBonus: decimal("completion_karma_bonus", { precision: 8, scale: 2 }).default("0.00"),
  tradingSkillBonus: decimal("trading_skill_bonus", { precision: 3, scale: 2 }).default("0.00"),
  houseReputationBonus: decimal("house_reputation_bonus", { precision: 8, scale: 2 }).default("0.00"),
  unlocksTradingPrivileges: text("unlocks_trading_privileges").array(),
  // Module status
  isPublished: boolean("is_published").default(false),
  requiredForProgression: boolean("required_for_progression").default(false),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Learn Progress - Track educational advancement
export const userLearnProgress = pgTable("user_learn_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  moduleId: varchar("module_id").notNull().references(() => learnModules.id),
  // Progress tracking
  status: text("status").default("not_started"), // "not_started", "in_progress", "completed", "failed"
  progressPercent: decimal("progress_percent", { precision: 8, scale: 2 }).default("0.00"),
  currentSection: integer("current_section").default(1),
  completedSections: integer("completed_sections").array(),
  timeSpent: integer("time_spent").default(0), // Minutes
  // Assessment results
  quizScores: jsonb("quiz_scores"),
  finalScore: decimal("final_score", { precision: 8, scale: 2 }),
  passingGrade: decimal("passing_grade", { precision: 8, scale: 2 }).default("70.00"),
  attempts: integer("attempts").default(0),
  maxAttempts: integer("max_attempts").default(3),
  // Completion rewards
  karmaEarned: decimal("karma_earned", { precision: 8, scale: 2 }).default("0.00"),
  skillBonusApplied: boolean("skill_bonus_applied").default(false),
  certificateUrl: text("certificate_url"),
  // Timestamps
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for Phase 2 mythological RPG tables
export const insertMythologicalHouseSchema = createInsertSchema(mythologicalHouses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserHouseMembershipSchema = createInsertSchema(userHouseMembership).omit({
  id: true,
  createdAt: true,
});

export const insertUserKarmicAlignmentSchema = createInsertSchema(userKarmicAlignment).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertKarmicActionsLogSchema = createInsertSchema(karmicActionsLog).omit({
  id: true,
  createdAt: true,
});

export const insertEnhancedCharacterSchema = createInsertSchema(enhancedCharacters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBattleScenarioSchema = createInsertSchema(battleScenarios).omit({
  id: true,
  createdAt: true,
});

export const insertEnhancedComicIssueSchema = createInsertSchema(enhancedComicIssues).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMoviePerformanceDataSchema = createInsertSchema(moviePerformanceData).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLearnModuleSchema = createInsertSchema(learnModules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserLearnProgressSchema = createInsertSchema(userLearnProgress).omit({
  id: true,
  createdAt: true,
});

// Export types for Phase 2 mythological RPG tables
export type MythologicalHouse = typeof mythologicalHouses.$inferSelect;
export type InsertMythologicalHouse = z.infer<typeof insertMythologicalHouseSchema>;

export type UserHouseMembership = typeof userHouseMembership.$inferSelect;
export type InsertUserHouseMembership = z.infer<typeof insertUserHouseMembershipSchema>;

export type UserKarmicAlignment = typeof userKarmicAlignment.$inferSelect;
export type InsertUserKarmicAlignment = z.infer<typeof insertUserKarmicAlignmentSchema>;

export type KarmicActionsLog = typeof karmicActionsLog.$inferSelect;
export type InsertKarmicActionsLog = z.infer<typeof insertKarmicActionsLogSchema>;

export type EnhancedCharacter = typeof enhancedCharacters.$inferSelect;
export type InsertEnhancedCharacter = z.infer<typeof insertEnhancedCharacterSchema>;

export type BattleScenario = typeof battleScenarios.$inferSelect;
export type InsertBattleScenario = z.infer<typeof insertBattleScenarioSchema>;

export type EnhancedComicIssue = typeof enhancedComicIssues.$inferSelect;
export type InsertEnhancedComicIssue = z.infer<typeof insertEnhancedComicIssueSchema>;

export type MoviePerformanceData = typeof moviePerformanceData.$inferSelect;
export type InsertMoviePerformanceData = z.infer<typeof insertMoviePerformanceDataSchema>;

export type LearnModule = typeof learnModules.$inferSelect;
export type InsertLearnModule = z.infer<typeof insertLearnModuleSchema>;

export type UserLearnProgress = typeof userLearnProgress.$inferSelect;
export type InsertUserLearnProgress = z.infer<typeof insertUserLearnProgressSchema>;

// LEADERBOARD SYSTEM TABLES

// Trader statistics for tracking user performance metrics
export const traderStats = pgTable("trader_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Portfolio metrics
  totalPortfolioValue: decimal("total_portfolio_value", { precision: 15, scale: 2 }).default("0.00"),
  totalPnL: decimal("total_pnl", { precision: 15, scale: 2 }).default("0.00"), // Realized + unrealized P&L
  totalRealizedPnL: decimal("total_realized_pnl", { precision: 15, scale: 2 }).default("0.00"),
  totalUnrealizedPnL: decimal("total_unrealized_pnl", { precision: 15, scale: 2 }).default("0.00"),
  roiPercentage: decimal("roi_percentage", { precision: 8, scale: 2 }).default("0.00"), // Return on investment %
  // Trading activity metrics
  totalTrades: integer("total_trades").default(0),
  profitableTrades: integer("profitable_trades").default(0),
  winRate: decimal("win_rate", { precision: 8, scale: 2 }).default("0.00"), // % of profitable trades
  averageTradeSize: decimal("average_trade_size", { precision: 15, scale: 2 }).default("0.00"),
  totalTradingVolume: decimal("total_trading_volume", { precision: 15, scale: 2 }).default("0.00"), // Total $ traded
  biggestWin: decimal("biggest_win", { precision: 15, scale: 2 }).default("0.00"),
  biggestLoss: decimal("biggest_loss", { precision: 15, scale: 2 }).default("0.00"),
  // Streak tracking
  currentWinningStreak: integer("current_winning_streak").default(0),
  currentLosingStreak: integer("current_losing_streak").default(0),
  longestWinningStreak: integer("longest_winning_streak").default(0),
  longestLosingStreak: integer("longest_losing_streak").default(0),
  // Risk metrics
  sharpeRatio: decimal("sharpe_ratio", { precision: 5, scale: 3 }), // Risk-adjusted returns
  maxDrawdown: decimal("max_drawdown", { precision: 8, scale: 2 }), // Max portfolio decline %
  volatility: decimal("volatility", { precision: 8, scale: 2 }), // Portfolio volatility
  // Ranking and achievements
  rankPoints: decimal("rank_points", { precision: 10, scale: 2 }).default("0.00"), // Points for ranking calculation
  currentRank: integer("current_rank"),
  bestRank: integer("best_rank"),
  achievementPoints: integer("achievement_points").default(0),
  // Time tracking
  tradingDaysActive: integer("trading_days_active").default(0),
  lastTradeDate: timestamp("last_trade_date"),
  firstTradeDate: timestamp("first_trade_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_trader_stats_user_id").on(table.userId),
  index("idx_trader_stats_rank_points").on(table.rankPoints),
  index("idx_trader_stats_current_rank").on(table.currentRank),
  index("idx_trader_stats_total_pnl").on(table.totalPnL),
  index("idx_trader_stats_win_rate").on(table.winRate),
  index("idx_trader_stats_total_volume").on(table.totalTradingVolume),
]);

// Leaderboard categories for different ranking types
export const leaderboardCategories = pgTable("leaderboard_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // "All-Time Leaders", "Daily Leaders", etc.
  description: text("description"),
  categoryType: text("category_type").notNull(), // "total_return", "win_rate", "volume", "consistency", "roi"
  timeframe: text("timeframe").notNull(), // "all_time", "daily", "weekly", "monthly"
  sortOrder: text("sort_order").default("desc"), // "asc" or "desc"
  pointsFormula: text("points_formula"), // Formula for calculating points/ranking
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0), // Order for UI display
  minTradesRequired: integer("min_trades_required").default(1), // Minimum trades to appear on leaderboard
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_leaderboard_categories_type_timeframe").on(table.categoryType, table.timeframe),
  index("idx_leaderboard_categories_active").on(table.isActive),
  index("idx_leaderboard_categories_display_order").on(table.displayOrder),
]);

// User achievements for trading badges and milestones
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: text("achievement_id").notNull(), // "first_trade", "profit_milestone_1000", etc.
  title: text("title").notNull(), // "First Trade", "$1,000 Profit Milestone"
  description: text("description").notNull(),
  category: text("category").notNull(), // "trading", "profit", "volume", "streak", "special"
  iconName: text("icon_name"), // Lucide icon name for badge
  badgeColor: text("badge_color").default("blue"), // Color theme for badge
  tier: text("tier").default("bronze"), // "bronze", "silver", "gold", "platinum", "diamond"
  points: integer("points").default(0), // Achievement points awarded
  rarity: text("rarity").default("common"), // "common", "rare", "epic", "legendary"
  // Achievement criteria (stored as JSON for flexibility)
  criteria: jsonb("criteria"), // Requirements that triggered this achievement
  progress: jsonb("progress"), // Current progress towards achievement
  // Metadata
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  notificationSent: boolean("notification_sent").default(false),
  isVisible: boolean("is_visible").default(true), // Can be hidden for surprise achievements
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_user_achievements_user_id").on(table.userId),
  index("idx_user_achievements_achievement_id").on(table.achievementId),
  index("idx_user_achievements_category").on(table.category),
  index("idx_user_achievements_tier").on(table.tier),
  index("idx_user_achievements_unlocked_at").on(table.unlockedAt),
  // Unique constraint to prevent duplicate achievements
  index("idx_user_achievements_unique").on(table.userId, table.achievementId),
]);

// Karma actions for tracking karma-related events
export const karmaActions = pgTable("karma_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'house_joined', 'trade_completed', 'achievement_unlocked', etc.
  houseId: text("house_id"), // For house-specific actions
  karmaChange: integer("karma_change").notNull(), // Can be positive or negative
  description: text("description").notNull(),
  metadata: jsonb("metadata"), // Additional context data
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_karma_actions_user_id").on(table.userId),
  index("idx_karma_actions_type").on(table.type),
  index("idx_karma_actions_house_id").on(table.houseId),
  index("idx_karma_actions_created_at").on(table.createdAt),
]);

// Insert schemas for leaderboard tables
export const insertTraderStatsSchema = createInsertSchema(traderStats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeaderboardCategorySchema = createInsertSchema(leaderboardCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
  createdAt: true,
});

export const insertKarmaActionSchema = createInsertSchema(karmaActions).omit({
  id: true,
  createdAt: true,
});

// Export types for leaderboard system
export type TraderStats = typeof traderStats.$inferSelect;
export type InsertTraderStats = z.infer<typeof insertTraderStatsSchema>;

export type LeaderboardCategory = typeof leaderboardCategories.$inferSelect;
export type InsertLeaderboardCategory = z.infer<typeof insertLeaderboardCategorySchema>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

// Export types for notification system
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type PriceAlert = typeof priceAlerts.$inferSelect;
export type InsertPriceAlert = z.infer<typeof insertPriceAlertSchema>;

export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreferences = z.infer<typeof insertNotificationPreferencesSchema>;

export type NotificationTemplate = typeof notificationTemplates.$inferSelect;
export type InsertNotificationTemplate = z.infer<typeof insertNotificationTemplateSchema>;

export type KarmaAction = typeof karmaActions.$inferSelect;
export type InsertKarmaAction = z.infer<typeof insertKarmaActionSchema>;

// ============================================================================
// KARMIC ALIGNMENT & RECKONING SYSTEM - COMPREHENSIVE KARMA TRACKING
// ============================================================================

// Detailed alignment history - Track cosmic balance changes over time
export const alignmentHistory = pgTable("alignment_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Previous alignment state
  previousLawfulChaotic: decimal("previous_lawful_chaotic", { precision: 8, scale: 2 }).notNull(),
  previousGoodEvil: decimal("previous_good_evil", { precision: 8, scale: 2 }).notNull(),
  // New alignment state
  newLawfulChaotic: decimal("new_lawful_chaotic", { precision: 8, scale: 2 }).notNull(),
  newGoodEvil: decimal("new_good_evil", { precision: 8, scale: 2 }).notNull(),
  // Alignment shift details
  alignmentShiftMagnitude: decimal("alignment_shift_magnitude", { precision: 8, scale: 2 }).notNull(), // Total distance moved
  triggeringActionType: text("triggering_action_type").notNull(), // Type of action that caused shift
  triggeringActionId: varchar("triggering_action_id"), // Reference to specific karma action
  karmaAtTimeOfShift: integer("karma_at_time_of_shift").notNull(),
  houseId: text("house_id"), // User's house at time of shift
  // Mystical classifications
  alignmentPhase: text("alignment_phase").notNull(), // 'awakening', 'journey', 'transformation', 'mastery'
  cosmicEvent: text("cosmic_event"), // 'solar_eclipse', 'lunar_blessing', 'divine_intervention', etc.
  prophecyUnlocked: text("prophecy_unlocked"), // Mystical prophecy text revealed
  // Metadata
  significanceLevel: text("significance_level").default("minor"), // 'minor', 'major', 'critical', 'legendary'
  recordedAt: timestamp("recorded_at").defaultNow(),
}, (table) => [
  index("idx_alignment_history_user_id").on(table.userId),
  index("idx_alignment_history_recorded_at").on(table.recordedAt),
  index("idx_alignment_history_significance").on(table.significanceLevel),
  index("idx_alignment_history_action_type").on(table.triggeringActionType),
]);

// Expanded karma actions with detailed behavioral analysis
export const detailedKarmaActions = pgTable("detailed_karma_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Core action details
  actionType: text("action_type").notNull(), // 'aggressive_trade', 'community_help', 'resource_sharing', 'market_manipulation', etc.
  actionCategory: text("action_category").notNull(), // 'trading', 'social', 'competitive', 'educational', 'mystical'
  actionSubtype: text("action_subtype"), // More specific classification
  // Karma and alignment impact
  karmaChange: integer("karma_change").notNull(),
  lawfulChaoticImpact: decimal("lawful_chaotic_impact", { precision: 8, scale: 2 }).default("0.00"), // Impact on L/C axis
  goodEvilImpact: decimal("good_evil_impact", { precision: 8, scale: 2 }).default("0.00"), // Impact on G/E axis
  // Behavioral pattern analysis
  tradingBehaviorPattern: text("trading_behavior_pattern"), // 'patient', 'aggressive', 'collaborative', 'solitary'
  communityInteraction: text("community_interaction"), // 'helpful', 'neutral', 'competitive', 'harmful'
  riskTakingBehavior: text("risk_taking_behavior"), // 'conservative', 'calculated', 'reckless', 'chaotic'
  // Context and metadata
  assetId: varchar("asset_id").references(() => assets.id), // Asset involved in action
  orderId: varchar("order_id").references(() => orders.id), // Order that triggered action
  houseId: text("house_id"), // User's house at time of action
  houseAlignmentBonus: decimal("house_alignment_bonus", { precision: 8, scale: 2 }).default("1.00"), // House modifier applied
  // Impact and consequences
  tradingConsequenceTriggered: boolean("trading_consequence_triggered").default(false),
  consequenceSeverity: text("consequence_severity"), // 'blessing', 'minor', 'moderate', 'severe', 'divine'
  mysticalDescription: text("mystical_description").notNull(), // RPG-flavored description of action
  // Temporal and pattern data
  timeOfDay: text("time_of_day"), // 'dawn', 'morning', 'midday', 'afternoon', 'evening', 'night', 'midnight'
  tradingVolume: decimal("trading_volume", { precision: 15, scale: 2 }), // Volume involved in action
  portfolioValue: decimal("portfolio_value", { precision: 15, scale: 2 }), // User's portfolio value at time
  actionDuration: integer("action_duration_minutes"), // How long action took
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_detailed_karma_user_id").on(table.userId),
  index("idx_detailed_karma_action_type").on(table.actionType),
  index("idx_detailed_karma_category").on(table.actionCategory),
  index("idx_detailed_karma_house_id").on(table.houseId),
  index("idx_detailed_karma_created_at").on(table.createdAt),
  index("idx_detailed_karma_behavior_pattern").on(table.tradingBehaviorPattern),
]);

// Trading consequences - How alignment affects trading outcomes
export const tradingConsequences = pgTable("trading_consequences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  orderId: varchar("order_id").references(() => orders.id), // Order affected by consequence
  // Alignment state at time of consequence
  userLawfulChaotic: decimal("user_lawful_chaotic", { precision: 8, scale: 2 }).notNull(),
  userGoodEvil: decimal("user_good_evil", { precision: 8, scale: 2 }).notNull(),
  userKarma: integer("user_karma").notNull(),
  userHouseId: text("user_house_id"),
  // Consequence details
  consequenceType: text("consequence_type").notNull(), // 'bonus_stability', 'increased_volatility', 'community_boost', 'solitary_power'
  consequenceCategory: text("consequence_category").notNull(), // 'trading_modifier', 'fee_adjustment', 'opportunity_access', 'restriction'
  modifierValue: decimal("modifier_value", { precision: 5, scale: 4 }).notNull(), // Numerical modifier applied
  modifierType: text("modifier_type").notNull(), // 'multiplier', 'additive', 'percentage', 'boolean'
  // Trading impact
  originalValue: decimal("original_value", { precision: 15, scale: 2 }), // Original trade value
  modifiedValue: decimal("modified_value", { precision: 15, scale: 2 }), // Value after consequence
  impactDescription: text("impact_description").notNull(), // Human-readable impact
  mysticalFlavor: text("mystical_flavor").notNull(), // RPG description of consequence
  // Consequence duration and persistence
  isTemporary: boolean("is_temporary").default(true),
  durationMinutes: integer("duration_minutes"), // How long consequence lasts
  expiresAt: timestamp("expires_at"),
  stacksWithOthers: boolean("stacks_with_others").default(false), // Can combine with other consequences
  // Success and outcome tracking
  consequenceApplied: boolean("consequence_applied").default(true),
  resultingOutcome: text("resulting_outcome"), // 'success', 'failure', 'neutral', 'unexpected'
  userSatisfaction: text("user_satisfaction"), // 'pleased', 'neutral', 'frustrated', 'surprised'
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_trading_consequences_user_id").on(table.userId),
  index("idx_trading_consequences_order_id").on(table.orderId),
  index("idx_trading_consequences_type").on(table.consequenceType),
  index("idx_trading_consequences_category").on(table.consequenceCategory),
  index("idx_trading_consequences_created_at").on(table.createdAt),
  index("idx_trading_consequences_expires_at").on(table.expiresAt),
]);

// Alignment thresholds - Define when cosmic shifts occur
export const alignmentThresholds = pgTable("alignment_thresholds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  thresholdName: text("threshold_name").notNull(), // 'lawful_guardian', 'chaotic_rebel', 'neutral_balance'
  alignmentType: text("alignment_type").notNull(), // 'lawful_chaotic', 'good_evil', 'combined'
  // Threshold boundaries
  minLawfulChaotic: decimal("min_lawful_chaotic", { precision: 8, scale: 2 }),
  maxLawfulChaotic: decimal("max_lawful_chaotic", { precision: 8, scale: 2 }),
  minGoodEvil: decimal("min_good_evil", { precision: 8, scale: 2 }),
  maxGoodEvil: decimal("max_good_evil", { precision: 8, scale: 2 }),
  minKarma: integer("min_karma"),
  maxKarma: integer("max_karma"),
  // House compatibility
  compatibleHouses: text("compatible_houses").array(), // Houses that benefit from this alignment
  conflictingHouses: text("conflicting_houses").array(), // Houses that conflict with this alignment
  // Threshold effects
  tradingBonuses: jsonb("trading_bonuses"), // Bonuses granted for this alignment
  tradingRestrictions: jsonb("trading_restrictions"), // Restrictions imposed
  specialAbilities: jsonb("special_abilities"), // Special trading features unlocked
  // Mystical properties
  cosmicTitle: text("cosmic_title").notNull(), // "Guardian of Sacred Commerce", "Harbinger of Market Chaos"
  mysticalDescription: text("mystical_description").notNull(),
  alignmentAura: text("alignment_aura"), // Visual effect for UI ('golden', 'shadow', 'prismatic')
  prophecyText: text("prophecy_text"), // Mystical prediction about alignment
  // Metadata
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_alignment_thresholds_name").on(table.thresholdName),
  index("idx_alignment_thresholds_type").on(table.alignmentType),
  index("idx_alignment_thresholds_active").on(table.isActive),
  index("idx_alignment_thresholds_display_order").on(table.displayOrder),
]);

// Karmic profiles - Comprehensive alignment analysis for each user
export const karmicProfiles = pgTable("karmic_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Current alignment classification
  currentAlignmentThreshold: varchar("current_alignment_threshold").references(() => alignmentThresholds.id),
  alignmentStability: decimal("alignment_stability", { precision: 8, scale: 2 }).default("100.00"), // How stable alignment is
  alignmentTrend: text("alignment_trend").default("stable"), // 'ascending', 'descending', 'stable', 'chaotic'
  // Behavioral patterns over time
  dominantBehaviorPattern: text("dominant_behavior_pattern"), // Most common behavior type
  secondaryBehaviorPattern: text("secondary_behavior_pattern"),
  behaviorConsistency: decimal("behavior_consistency", { precision: 8, scale: 2 }).default("50.00"), // How consistent behavior is
  // Trading personality analysis
  tradingPersonality: text("trading_personality"), // 'patient_strategist', 'aggressive_opportunist', 'community_leader'
  riskProfile: text("risk_profile"), // 'conservative', 'moderate', 'aggressive', 'chaotic'
  socialTrading: text("social_trading"), // 'collaborative', 'independent', 'competitive', 'teaching'
  // Karma accumulation patterns
  karmaAccelerationRate: decimal("karma_acceleration_rate", { precision: 8, scale: 2 }).default("1.00"), // How fast karma changes
  totalKarmaEarned: integer("total_karma_earned").default(0),
  totalKarmaLost: integer("total_karma_lost").default(0),
  largestKarmaGain: integer("largest_karma_gain").default(0),
  largestKarmaLoss: integer("largest_karma_loss").default(0),
  // House compatibility analysis
  houseAlignmentCompatibility: decimal("house_alignment_compatibility", { precision: 8, scale: 2 }).default("50.00"), // How well aligned with house
  optimalHouseId: text("optimal_house_id"), // Most compatible house based on alignment
  alignmentConflictLevel: text("alignment_conflict_level").default("none"), // 'none', 'minor', 'moderate', 'severe'
  // Predictive analysis
  predictedAlignmentDirection: text("predicted_alignment_direction"), // Where alignment is heading
  nextThresholdDistance: decimal("next_threshold_distance", { precision: 8, scale: 2 }), // How close to next threshold
  estimatedTimeToNextThreshold: integer("estimated_time_to_next_threshold"), // Days until next threshold
  // Mystical attributes
  cosmicResonance: decimal("cosmic_resonance", { precision: 8, scale: 2 }).default("0.00"), // Spiritual power level
  divineFavor: decimal("divine_favor", { precision: 8, scale: 2 }).default("0.00"), // Positive cosmic influence
  shadowInfluence: decimal("shadow_influence", { precision: 8, scale: 2 }).default("0.00"), // Negative cosmic influence
  // Statistics and tracking
  alignmentShiftsCount: integer("alignment_shifts_count").default(0),
  lastMajorShift: timestamp("last_major_shift"),
  profileLastCalculated: timestamp("profile_last_calculated").defaultNow(),
  nextRecalculationDue: timestamp("next_recalculation_due"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_karmic_profiles_user_id").on(table.userId),
  index("idx_karmic_profiles_threshold").on(table.currentAlignmentThreshold),
  index("idx_karmic_profiles_personality").on(table.tradingPersonality),
  index("idx_karmic_profiles_house_compatibility").on(table.houseAlignmentCompatibility),
  index("idx_karmic_profiles_last_calculated").on(table.profileLastCalculated),
  // Unique constraint - one profile per user
  index("idx_karmic_profiles_unique_user").on(table.userId),
]);

// Insert schemas for karma system tables
export const insertAlignmentHistorySchema = createInsertSchema(alignmentHistory).omit({
  id: true,
  recordedAt: true,
});

export const insertDetailedKarmaActionSchema = createInsertSchema(detailedKarmaActions).omit({
  id: true,
  createdAt: true,
});

export const insertTradingConsequenceSchema = createInsertSchema(tradingConsequences).omit({
  id: true,
  createdAt: true,
});

export const insertAlignmentThresholdSchema = createInsertSchema(alignmentThresholds).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertKarmicProfileSchema = createInsertSchema(karmicProfiles).omit({
  id: true,
  profileLastCalculated: true,
  createdAt: true,
  updatedAt: true,
});

// Export types for karma system
export type AlignmentHistory = typeof alignmentHistory.$inferSelect;
export type InsertAlignmentHistory = z.infer<typeof insertAlignmentHistorySchema>;

export type DetailedKarmaAction = typeof detailedKarmaActions.$inferSelect;
export type InsertDetailedKarmaAction = z.infer<typeof insertDetailedKarmaActionSchema>;

export type TradingConsequence = typeof tradingConsequences.$inferSelect;
export type InsertTradingConsequence = z.infer<typeof insertTradingConsequenceSchema>;

export type AlignmentThreshold = typeof alignmentThresholds.$inferSelect;
export type InsertAlignmentThreshold = z.infer<typeof insertAlignmentThresholdSchema>;

export type KarmicProfile = typeof karmicProfiles.$inferSelect;
export type InsertKarmicProfile = z.infer<typeof insertKarmicProfileSchema>;

// ========================================================================================
// COMPREHENSIVE LEARN MODULE SYSTEM - MYTHOLOGICAL TRADING RPG EDUCATION
// ========================================================================================

// Learning Paths - House-specific curriculum tracks
export const learningPaths = pgTable("learning_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  houseId: text("house_id").notNull(), // 'heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit', 'universal'
  specialization: text("specialization").notNull(), // House specialization area
  difficultyLevel: text("difficulty_level").notNull(), // 'initiate', 'adept', 'master', 'grandmaster'
  prerequisites: jsonb("prerequisites"), // Required skills, karma, house membership
  estimatedHours: integer("estimated_hours").default(0),
  experienceReward: integer("experience_reward").default(0),
  karmaReward: integer("karma_reward").default(0),
  // Mystical properties
  sacredTitle: text("sacred_title").notNull(), // "Path of the Divine Oracle", "Way of the Shadow Trader"
  mysticalDescription: text("mystical_description").notNull(),
  pathIcon: text("path_icon").default("BookOpen"),
  pathColor: text("path_color").default("blue-600"),
  // Learning path metadata
  lessonSequence: text("lesson_sequence").array(), // Ordered array of lesson IDs
  unlockConditions: jsonb("unlock_conditions"), // Karma, trading performance, etc.
  completionRewards: jsonb("completion_rewards"), // Skills, privileges, bonuses unlocked
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  // Vector embeddings for path recommendations
  pathEmbedding: vector("path_embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_learning_paths_house_id").on(table.houseId),
  index("idx_learning_paths_difficulty").on(table.difficultyLevel),
  index("idx_learning_paths_active").on(table.isActive),
  index("idx_learning_paths_display_order").on(table.displayOrder),
]);

// Sacred Lessons - Individual learning units with immersive RPG elements
export const sacredLessons = pgTable("sacred_lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  houseId: text("house_id"), // Primary house, null for universal lessons
  pathId: varchar("path_id").references(() => learningPaths.id),
  // Lesson structure and content
  lessonType: text("lesson_type").notNull(), // 'crystal_orb', 'sacred_tome', 'simulation', 'trial', 'ritual'
  difficultyLevel: text("difficulty_level").notNull(), // 'initiate', 'adept', 'master', 'grandmaster'
  estimatedMinutes: integer("estimated_minutes").default(15),
  experienceReward: integer("experience_reward").default(100),
  karmaReward: integer("karma_reward").default(5),
  // Content delivery
  contentFormat: text("content_format").notNull(), // 'text', 'video', 'interactive', 'simulation', 'assessment'
  contentData: jsonb("content_data").notNull(), // Lesson content, questions, simulations
  mediaUrls: jsonb("media_urls"), // Images, videos, animations
  interactiveElements: jsonb("interactive_elements"), // Quizzes, drag-drop, simulations
  // Prerequisites and sequencing
  prerequisites: jsonb("prerequisites"), // Required lessons, skills, karma
  unlockConditions: jsonb("unlock_conditions"), // Detailed unlock requirements
  nextLessons: text("next_lessons").array(), // Suggested next lessons
  // Assessment and mastery
  masteryThreshold: decimal("mastery_threshold", { precision: 8, scale: 2 }).default("80.00"), // % required to pass
  allowRetakes: boolean("allow_retakes").default(true),
  maxAttempts: integer("max_attempts").default(3),
  // Mystical properties
  sacredTitle: text("sacred_title").notNull(), // "The Orb of Market Wisdom", "Scroll of Ancient Trades"
  mysticalNarrative: text("mystical_narrative").notNull(), // RPG-style introduction
  guidingSpirit: text("guiding_spirit"), // Name of mythical guide/teacher
  ritualDescription: text("ritual_description"), // How lesson is "performed"
  lessonIcon: text("lesson_icon").default("BookOpen"),
  atmosphericEffects: jsonb("atmospheric_effects"), // UI effects, sounds, animations
  // Learning analytics
  avgCompletionTime: integer("avg_completion_time_minutes"),
  avgScoreAchieved: decimal("avg_score_achieved", { precision: 8, scale: 2 }),
  completionRate: decimal("completion_rate", { precision: 8, scale: 2 }),
  userRating: decimal("user_rating", { precision: 3, scale: 2 }),
  isActive: boolean("is_active").default(true),
  publishedAt: timestamp("published_at"),
  // Vector embeddings for content search and recommendations
  contentEmbedding: vector("content_embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_sacred_lessons_house_id").on(table.houseId),
  index("idx_sacred_lessons_path_id").on(table.pathId),
  index("idx_sacred_lessons_type").on(table.lessonType),
  index("idx_sacred_lessons_difficulty").on(table.difficultyLevel),
  index("idx_sacred_lessons_active").on(table.isActive),
  index("idx_sacred_lessons_published").on(table.publishedAt),
]);

// Mystical Skills - Tradeable abilities that unlock enhanced features
export const mysticalSkills = pgTable("mystical_skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  houseId: text("house_id"), // Primary house specialization
  skillCategory: text("skill_category").notNull(), // 'trading', 'analysis', 'social', 'mystical'
  skillType: text("skill_type").notNull(), // 'passive', 'active', 'toggle', 'ritual'
  tier: text("tier").notNull(), // 'initiate', 'adept', 'master', 'grandmaster', 'legendary'
  // Skill effects and bonuses
  tradingPrivileges: jsonb("trading_privileges"), // What trading features this unlocks
  tradingBonuses: jsonb("trading_bonuses"), // Numerical bonuses applied
  interfaceFeatures: jsonb("interface_features"), // UI features unlocked
  specialAbilities: jsonb("special_abilities"), // Unique powers granted
  // Unlock requirements
  prerequisiteSkills: text("prerequisite_skills").array(), // Required skills
  prerequisiteLessons: text("prerequisite_lessons").array(), // Required lessons completed
  karmaRequirement: integer("karma_requirement").default(0),
  tradingPerformanceRequirement: jsonb("trading_performance_requirement"), // Win rate, profit, etc.
  houseStandingRequirement: text("house_standing_requirement"), // House rank required
  // Experience and progression
  experienceCost: integer("experience_cost").default(500), // Experience points to unlock
  masteryLevels: integer("mastery_levels").default(1), // How many levels skill can be upgraded
  maxMasteryBonus: decimal("max_mastery_bonus", { precision: 8, scale: 2 }).default("1.50"), // Max bonus at full mastery
  // Mystical properties
  sacredName: text("sacred_name").notNull(), // "Sight of the Divine Oracle", "Shadow Step Trading"
  mysticalDescription: text("mystical_description").notNull(),
  awakenRitual: text("awaken_ritual"), // Description of skill awakening ceremony
  skillIcon: text("skill_icon").default("Zap"),
  skillAura: text("skill_aura"), // Visual effect ('golden', 'shadow', 'prismatic', 'elemental')
  rarityLevel: text("rarity_level").default("common"), // 'common', 'rare', 'epic', 'legendary'
  // Skill tree positioning
  parentSkills: text("parent_skills").array(), // Skills this branches from
  childSkills: text("child_skills").array(), // Skills this unlocks
  skillTreePosition: jsonb("skill_tree_position"), // X,Y coordinates for visualization
  // Usage and impact tracking
  timesUnlocked: integer("times_unlocked").default(0),
  avgTimeToUnlock: integer("avg_time_to_unlock_days"),
  userSatisfactionRating: decimal("user_satisfaction_rating", { precision: 3, scale: 2 }),
  impactOnTrading: decimal("impact_on_trading", { precision: 8, scale: 2 }), // Measured improvement
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_mystical_skills_house_id").on(table.houseId),
  index("idx_mystical_skills_category").on(table.skillCategory),
  index("idx_mystical_skills_tier").on(table.tier),
  index("idx_mystical_skills_rarity").on(table.rarityLevel),
  index("idx_mystical_skills_active").on(table.isActive),
]);

// User Lesson Progress - Individual lesson completion tracking
export const userLessonProgress = pgTable("user_lesson_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  lessonId: varchar("lesson_id").notNull().references(() => sacredLessons.id),
  pathId: varchar("path_id").references(() => learningPaths.id),
  // Progress tracking
  status: text("status").notNull().default("not_started"), // 'not_started', 'in_progress', 'completed', 'mastered'
  progressPercent: decimal("progress_percent", { precision: 8, scale: 2 }).default("0.00"),
  currentSection: integer("current_section").default(1),
  sectionsCompleted: integer("sections_completed").array(),
  timeSpentMinutes: integer("time_spent_minutes").default(0),
  // Assessment results
  attempts: integer("attempts").default(0),
  bestScore: decimal("best_score", { precision: 8, scale: 2 }),
  latestScore: decimal("latest_score", { precision: 8, scale: 2 }),
  masteryAchieved: boolean("mastery_achieved").default(false),
  // Learning data
  interactionData: jsonb("interaction_data"), // Detailed interaction logs
  difficultyRating: integer("difficulty_rating"), // User's rating 1-5
  enjoymentRating: integer("enjoyment_rating"), // User's rating 1-5
  notes: text("notes"), // User's personal notes
  // Mystical ceremony tracking
  ceremonyViewed: boolean("ceremony_viewed").default(false), // Completion ceremony watched
  experienceAwarded: integer("experience_awarded").default(0),
  karmaAwarded: integer("karma_awarded").default(0),
  skillsUnlocked: text("skills_unlocked").array(), // Skills unlocked by this lesson
  // Timing and analytics
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  nextReviewDue: timestamp("next_review_due"), // Spaced repetition
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_user_lesson_progress_user_id").on(table.userId),
  index("idx_user_lesson_progress_lesson_id").on(table.lessonId),
  index("idx_user_lesson_progress_path_id").on(table.pathId),
  index("idx_user_lesson_progress_status").on(table.status),
  index("idx_user_lesson_progress_completed").on(table.completedAt),
  index("idx_user_lesson_progress_last_accessed").on(table.lastAccessedAt),
  // Unique constraint - one progress record per user per lesson
  index("idx_user_lesson_unique").on(table.userId, table.lessonId),
]);

// User Skill Unlocks - Skills and abilities unlocked by users
export const userSkillUnlocks = pgTable("user_skill_unlocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  skillId: varchar("skill_id").notNull().references(() => mysticalSkills.id),
  // Unlock details
  unlockMethod: text("unlock_method").notNull(), // 'lesson_completion', 'trial_victory', 'karma_threshold', 'house_advancement'
  masteryLevel: integer("mastery_level").default(1), // Current upgrade level
  maxMasteryLevel: integer("max_mastery_level").default(1),
  effectivenessBonus: decimal("effectiveness_bonus", { precision: 8, scale: 2 }).default("1.00"), // Current bonus multiplier
  // Usage tracking
  timesUsed: integer("times_used").default(0),
  lastUsedAt: timestamp("last_used_at"),
  totalBenefitGained: decimal("total_benefit_gained", { precision: 15, scale: 2 }).default("0.00"),
  // Skill mastery progression
  experienceInvested: integer("experience_invested").default(0),
  masteryProgressPercent: decimal("mastery_progress_percent", { precision: 8, scale: 2 }).default("0.00"),
  nextUpgradeCost: integer("next_upgrade_cost").default(500),
  // Mystical awakening ceremony
  awakeningCeremonyCompleted: boolean("awakening_ceremony_completed").default(false),
  awakeningDate: timestamp("awakening_date"),
  ceremonialWitnesses: text("ceremonial_witnesses").array(), // Other users who witnessed ceremony
  mysticalBond: decimal("mystical_bond", { precision: 8, scale: 2 }).default("1.00"), // Spiritual connection to skill
  // Skill performance tracking
  skillRating: decimal("skill_rating", { precision: 3, scale: 2 }), // User's rating of skill usefulness
  recommendsToOthers: boolean("recommends_to_others").default(true),
  personalNotes: text("personal_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_user_skill_unlocks_user_id").on(table.userId),
  index("idx_user_skill_unlocks_skill_id").on(table.skillId),
  index("idx_user_skill_unlocks_mastery").on(table.masteryLevel),
  index("idx_user_skill_unlocks_awakening").on(table.awakeningDate),
  // Unique constraint - one unlock record per user per skill
  index("idx_user_skill_unique").on(table.userId, table.skillId),
]);

// Trials of Mastery - Assessment and certification system
export const trialsOfMastery = pgTable("trials_of_mastery", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  houseId: text("house_id"), // House-specific trial or universal
  trialType: text("trial_type").notNull(), // 'knowledge', 'practical', 'simulation', 'peer_review', 'divine_challenge'
  difficultyLevel: text("difficulty_level").notNull(), // 'initiate', 'adept', 'master', 'grandmaster'
  // Trial structure
  phases: jsonb("phases").notNull(), // Multi-phase trial structure
  timeLimit: integer("time_limit_minutes").default(60),
  maxAttempts: integer("max_attempts").default(3),
  passingScore: decimal("passing_score", { precision: 8, scale: 2 }).default("75.00"),
  perfectScore: decimal("perfect_score", { precision: 8, scale: 2 }).default("100.00"),
  // Prerequisites and rewards
  prerequisites: jsonb("prerequisites"), // Required skills, lessons, karma
  experienceReward: integer("experience_reward").default(1000),
  karmaReward: integer("karma_reward").default(50),
  skillsUnlocked: text("skills_unlocked").array(), // Skills granted on completion
  tradingPrivilegesGranted: jsonb("trading_privileges_granted"), // New trading abilities
  certificationsAwarded: text("certifications_awarded").array(), // Formal certifications
  // Mystical properties
  sacredTitle: text("sacred_title").notNull(), // "Trial of the Divine Oracle", "Ordeal of Shadow Trading"
  mythicalLore: text("mythical_lore").notNull(), // Background story and significance
  trialMaster: text("trial_master"), // Name of legendary figure who judges trial
  sacredLocation: text("sacred_location"), // Mystical setting description
  completionRitual: text("completion_ritual"), // Ceremony for successful completion
  trialIcon: text("trial_icon").default("Award"),
  atmosphericTheme: text("atmospheric_theme").default("mystical"), // UI theme
  // Analytics and balancing
  attemptCount: integer("attempt_count").default(0),
  successRate: decimal("success_rate", { precision: 8, scale: 2 }).default("0.00"),
  avgScore: decimal("avg_score", { precision: 8, scale: 2 }).default("0.00"),
  avgCompletionTime: integer("avg_completion_time_minutes"),
  difficulty_rating: decimal("difficulty_rating", { precision: 3, scale: 2 }), // User feedback
  isActive: boolean("is_active").default(true),
  seasonalAvailability: jsonb("seasonal_availability"), // Special availability windows
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_trials_mastery_house_id").on(table.houseId),
  index("idx_trials_mastery_type").on(table.trialType),
  index("idx_trials_mastery_difficulty").on(table.difficultyLevel),
  index("idx_trials_mastery_active").on(table.isActive),
]);

// User Trial Attempts - Tracking trial participation and results
export const userTrialAttempts = pgTable("user_trial_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  trialId: varchar("trial_id").notNull().references(() => trialsOfMastery.id),
  attemptNumber: integer("attempt_number").notNull().default(1),
  // Attempt results
  status: text("status").notNull().default("in_progress"), // 'in_progress', 'completed', 'abandoned', 'failed'
  overallScore: decimal("overall_score", { precision: 8, scale: 2 }),
  phaseScores: jsonb("phase_scores"), // Scores for each trial phase
  timeSpentMinutes: integer("time_spent_minutes").default(0),
  passed: boolean("passed").default(false),
  perfectScore: boolean("perfect_score").default(false),
  // Trial performance data
  responses: jsonb("responses"), // User responses to questions/challenges
  tradeSimulationResults: jsonb("trade_simulation_results"), // Performance in simulated trading
  peerReviewScores: jsonb("peer_review_scores"), // Peer evaluation results
  masterComments: text("master_comments"), // Feedback from trial master
  // Rewards and unlocks
  experienceAwarded: integer("experience_awarded").default(0),
  karmaAwarded: integer("karma_awarded").default(0),
  skillsUnlocked: text("skills_unlocked").array(),
  certificationsEarned: text("certifications_earned").array(),
  tradingPrivilegesGranted: jsonb("trading_privileges_granted"),
  // Trial ceremony and recognition
  completionCeremonyViewed: boolean("completion_ceremony_viewed").default(false),
  publicRecognition: boolean("public_recognition").default(false), // Announcement to house/community
  witnessedBy: text("witnessed_by").array(), // Other users who witnessed completion
  legendaryAchievement: boolean("legendary_achievement").default(false), // Exceptional performance
  // Analytics and feedback
  difficultyRating: integer("difficulty_rating"), // User's rating 1-5
  enjoymentRating: integer("enjoyment_rating"), // User's rating 1-5
  wouldRecommend: boolean("would_recommend").default(true),
  feedback: text("feedback"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_user_trial_attempts_user_id").on(table.userId),
  index("idx_user_trial_attempts_trial_id").on(table.trialId),
  index("idx_user_trial_attempts_status").on(table.status),
  index("idx_user_trial_attempts_passed").on(table.passed),
  index("idx_user_trial_attempts_completed").on(table.completedAt),
]);

// Divine Certifications - Formal achievement recognition
export const divineCertifications = pgTable("divine_certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  houseId: text("house_id"), // House-specific or universal certification
  certificationLevel: text("certification_level").notNull(), // 'apprentice', 'journeyman', 'master', 'grandmaster', 'legendary'
  category: text("category").notNull(), // 'trading', 'analysis', 'leadership', 'teaching', 'innovation'
  // Certification requirements
  requirements: jsonb("requirements").notNull(), // Detailed achievement requirements
  prerequisiteCertifications: text("prerequisite_certifications").array(),
  minimumKarma: integer("minimum_karma").default(0),
  minimumHouseStanding: text("minimum_house_standing"),
  // Visual and recognition elements
  badgeDesign: jsonb("badge_design"), // NFT-style badge appearance
  certificateTemplate: text("certificate_template"), // PDF template URL
  publicTitle: text("public_title").notNull(), // "Master of Mystical Analytics", "Divine Oracle of Prophecy"
  titleAbbreviation: text("title_abbreviation"), // "MMA", "DOP"
  prestigePoints: integer("prestige_points").default(100),
  // Certification benefits
  tradingBonuses: jsonb("trading_bonuses"), // Bonuses granted to certificate holders
  exclusiveAccess: jsonb("exclusive_access"), // Special features/areas unlocked
  teachingPrivileges: boolean("teaching_privileges").default(false), // Can mentor others
  leadershipPrivileges: boolean("leadership_privileges").default(false), // Can lead house activities
  // Recognition and display
  displayBorder: text("display_border").default("golden"), // 'bronze', 'silver', 'golden', 'prismatic'
  glowEffect: text("glow_effect"), // Special visual effects
  rarityLevel: text("rarity_level").default("rare"), // 'common', 'rare', 'epic', 'legendary', 'mythic'
  limitedEdition: boolean("limited_edition").default(false),
  maxIssuances: integer("max_issuances"), // Maximum certificates that can be issued
  currentIssuances: integer("current_issuances").default(0),
  // Metadata and lifecycle
  validityPeriod: integer("validity_period_months"), // How long certification lasts
  renewalRequired: boolean("renewal_required").default(false),
  retireDate: timestamp("retire_date"), // When this certification is no longer available
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_divine_certifications_house_id").on(table.houseId),
  index("idx_divine_certifications_level").on(table.certificationLevel),
  index("idx_divine_certifications_category").on(table.category),
  index("idx_divine_certifications_rarity").on(table.rarityLevel),
  index("idx_divine_certifications_active").on(table.isActive),
]);

// User Certifications - Certifications earned by users
export const userCertifications = pgTable("user_certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  certificationId: varchar("certification_id").notNull().references(() => divineCertifications.id),
  // Achievement details
  achievementMethod: text("achievement_method").notNull(), // 'trial_completion', 'peer_recognition', 'divine_appointment'
  verificationData: jsonb("verification_data"), // Proof of achievement
  witnessedBy: text("witnessed_by").array(), // Other users who witnessed achievement
  awardingMaster: text("awarding_master"), // Who granted the certification
  // Certificate details
  certificateNumber: text("certificate_number").notNull().unique(), // Unique certificate identifier
  certificateUrl: text("certificate_url"), // PDF/NFT certificate URL
  badgeImageUrl: text("badge_image_url"), // Badge image for display
  publicTitle: text("public_title").notNull(), // User's granted title
  // Recognition and ceremony
  ceremonyCompleted: boolean("ceremony_completed").default(false),
  ceremonyDate: timestamp("ceremony_date"),
  publicAnnouncement: boolean("public_announcement").default(true),
  featuredInHouse: boolean("featured_in_house").default(false),
  communityReactions: jsonb("community_reactions"), // Likes, congratulations, etc.
  // Certification status
  status: text("status").notNull().default("active"), // 'active', 'expired', 'revoked', 'suspended'
  validUntil: timestamp("valid_until"),
  renewalReminderSent: boolean("renewal_reminder_sent").default(false),
  // Usage and impact
  displayInProfile: boolean("display_in_profile").default(true),
  sharableUrl: text("sharable_url"), // Public sharing URL
  timestampProof: text("timestamp_proof"), // Blockchain/verification timestamp
  achievementScore: decimal("achievement_score", { precision: 8, scale: 2 }), // Quality of achievement
  awardedAt: timestamp("awarded_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_user_certifications_user_id").on(table.userId),
  index("idx_user_certifications_cert_id").on(table.certificationId),
  index("idx_user_certifications_status").on(table.status),
  index("idx_user_certifications_awarded").on(table.awardedAt),
  index("idx_user_certifications_public").on(table.displayInProfile),
  // Unique constraint - one certification per user per type
  index("idx_user_cert_unique").on(table.userId, table.certificationId),
]);

// Learning Analytics - Comprehensive progress and performance tracking
export const learningAnalytics = pgTable("learning_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Overall learning progress
  totalExperienceEarned: integer("total_experience_earned").default(0),
  totalLessonsCompleted: integer("total_lessons_completed").default(0),
  totalSkillsUnlocked: integer("total_skills_unlocked").default(0),
  totalTrialsPassed: integer("total_trials_passed").default(0),
  totalCertificationsEarned: integer("total_certifications_earned").default(0),
  // Learning velocity and patterns
  lessonsPerWeek: decimal("lessons_per_week", { precision: 8, scale: 2 }).default("0.00"),
  avgScoreAchieved: decimal("avg_score_achieved", { precision: 8, scale: 2 }).default("0.00"),
  learningStreak: integer("learning_streak_days").default(0),
  longestLearningStreak: integer("longest_learning_streak_days").default(0),
  preferredLearningTime: text("preferred_learning_time"), // 'morning', 'afternoon', 'evening', 'night'
  avgSessionDuration: integer("avg_session_duration_minutes").default(0),
  // House-specific progress
  primaryHouseMastery: decimal("primary_house_mastery", { precision: 8, scale: 2 }).default("0.00"),
  secondaryHousesExplored: text("secondary_houses_explored").array(),
  crossHouseProgress: jsonb("cross_house_progress"), // Progress in other houses
  houseRank: integer("house_rank").default(0), // Rank within house for learning
  // Learning style and preferences
  preferredLessonTypes: text("preferred_lesson_types").array(), // 'crystal_orb', 'sacred_tome', etc.
  learningStyleProfile: jsonb("learning_style_profile"), // Visual, auditory, kinesthetic, etc.
  difficultyPreference: text("difficulty_preference").default("adaptive"), // 'easy', 'moderate', 'challenging', 'adaptive'
  pacePreference: text("pace_preference").default("self_paced"), // 'slow', 'self_paced', 'accelerated'
  // Social learning aspects
  mentorshipGiven: integer("mentorship_given_hours").default(0),
  mentorshipReceived: integer("mentorship_received_hours").default(0),
  peerReviewsGiven: integer("peer_reviews_given").default(0),
  peerReviewsReceived: integer("peer_reviews_received").default(0),
  communityContributions: integer("community_contributions").default(0),
  teachingRating: decimal("teaching_rating", { precision: 3, scale: 2 }), // From students taught
  // Adaptive learning data
  knowledgeGaps: jsonb("knowledge_gaps"), // Areas needing improvement
  strengthAreas: jsonb("strength_areas"), // Areas of excellence
  recommendedPaths: jsonb("recommended_paths"), // AI-suggested learning paths
  personalizedDifficulty: decimal("personalized_difficulty", { precision: 3, scale: 2 }).default("3.00"), // 1-5 scale
  // Engagement and motivation
  motivationLevel: decimal("motivation_level", { precision: 3, scale: 2 }).default("3.00"), // 1-5 scale
  engagementTrend: text("engagement_trend").default("stable"), // 'increasing', 'stable', 'decreasing'
  lastActiveDate: timestamp("last_active_date"),
  totalTimeSpent: integer("total_time_spent_minutes").default(0),
  achievementCelebrations: integer("achievement_celebrations").default(0),
  // Predictive analytics
  predictedCompletionDate: timestamp("predicted_completion_date"),
  riskOfDropout: decimal("risk_of_dropout", { precision: 3, scale: 2 }).default("0.00"), // 0-1 probability
  recommendedInterventions: jsonb("recommended_interventions"), // Suggestions to improve
  // Timestamps
  calculatedAt: timestamp("calculated_at").defaultNow(),
  nextCalculationDue: timestamp("next_calculation_due"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_learning_analytics_user_id").on(table.userId),
  index("idx_learning_analytics_house_mastery").on(table.primaryHouseMastery),
  index("idx_learning_analytics_last_active").on(table.lastActiveDate),
  index("idx_learning_analytics_calculated").on(table.calculatedAt),
  // Unique constraint - one analytics record per user
  index("idx_learning_analytics_unique_user").on(table.userId),
]);

// Insert schemas for learning system tables
export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSacredLessonSchema = createInsertSchema(sacredLessons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMysticalSkillSchema = createInsertSchema(mysticalSkills).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserLessonProgressSchema = createInsertSchema(userLessonProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSkillUnlockSchema = createInsertSchema(userSkillUnlocks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrialOfMasterySchema = createInsertSchema(trialsOfMastery).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserTrialAttemptSchema = createInsertSchema(userTrialAttempts).omit({
  id: true,
  createdAt: true,
});

export const insertDivineCertificationSchema = createInsertSchema(divineCertifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserCertificationSchema = createInsertSchema(userCertifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLearningAnalyticsSchema = createInsertSchema(learningAnalytics).omit({
  id: true,
  calculatedAt: true,
  createdAt: true,
  updatedAt: true,
});

// Export types for learning system
export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;

export type SacredLesson = typeof sacredLessons.$inferSelect;
export type InsertSacredLesson = z.infer<typeof insertSacredLessonSchema>;

export type MysticalSkill = typeof mysticalSkills.$inferSelect;
export type InsertMysticalSkill = z.infer<typeof insertMysticalSkillSchema>;

export type UserLessonProgress = typeof userLessonProgress.$inferSelect;
export type InsertUserLessonProgress = z.infer<typeof insertUserLessonProgressSchema>;

export type UserSkillUnlock = typeof userSkillUnlocks.$inferSelect;
export type InsertUserSkillUnlock = z.infer<typeof insertUserSkillUnlockSchema>;

export type TrialOfMastery = typeof trialsOfMastery.$inferSelect;
export type InsertTrialOfMastery = z.infer<typeof insertTrialOfMasterySchema>;

export type UserTrialAttempt = typeof userTrialAttempts.$inferSelect;
export type InsertUserTrialAttempt = z.infer<typeof insertUserTrialAttemptSchema>;

export type DivineCertification = typeof divineCertifications.$inferSelect;
export type InsertDivineCertification = z.infer<typeof insertDivineCertificationSchema>;

export type UserCertification = typeof userCertifications.$inferSelect;
export type InsertUserCertification = z.infer<typeof insertUserCertificationSchema>;

export type LearningAnalytics = typeof learningAnalytics.$inferSelect;
export type InsertLearningAnalytics = z.infer<typeof insertLearningAnalyticsSchema>;

// ===========================
// CAREER PATHWAY CERTIFICATION SYSTEM
// ===========================

// Career Pathway Levels - Define the certification tiers for each pathway
export const careerPathwayLevels = pgTable("career_pathway_levels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pathway: text("pathway").notNull(), // 'associate', 'family_office', 'hedge_fund', 'agency'
  level: text("level").notNull(), // 'associate', 'tier1', 'tier2', 'tier3', 'tier4'
  name: text("name").notNull(), // 'Associate', 'Family Office Steward', 'Hedge Fund Analyst', etc.
  description: text("description").notNull(),
  displayOrder: integer("display_order").notNull(), // Sequence in pathway
  // Unlocks and rewards
  tradingFeatureUnlocks: jsonb("trading_feature_unlocks"), // Features unlocked at this level
  baseSalaryMax: decimal("base_salary_max", { precision: 15, scale: 2 }).notNull(), // Maximum salary for this level
  certificationBonus: decimal("certification_bonus_percent", { precision: 5, scale: 2 }).default("100.00"), // 100% for 3/5, 150% for 5/5
  masterBonus: decimal("master_bonus_percent", { precision: 5, scale: 2 }).default("150.00"),
  prerequisiteLevel: varchar("prerequisite_level"), // Previous level required
  // Metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_career_pathway_pathway").on(table.pathway),
  index("idx_career_pathway_level").on(table.level),
  index("idx_career_pathway_order").on(table.displayOrder),
]);

// Certification Courses - 5 courses per certification level
export const certificationCourses = pgTable("certification_courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pathwayLevelId: varchar("pathway_level_id").notNull().references(() => careerPathwayLevels.id),
  courseNumber: integer("course_number").notNull(), // 1-5
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // 'easy', 'intermediate', 'advanced', 'master'
  estimatedDuration: integer("estimated_duration_hours").default(2),
  // Course content
  modules: jsonb("modules").notNull(), // Course curriculum and materials
  learningObjectives: text("learning_objectives").array(),
  prerequisites: text("prerequisites").array(),
  // Exam configuration
  examQuestions: jsonb("exam_questions").notNull(), // Exam scenarios and questions
  passingScore: integer("passing_score").default(70), // Percentage to pass
  maxAttempts: integer("max_attempts").default(3), // Free attempts before penalty
  retryPenaltyAmount: decimal("retry_penalty_amount", { precision: 10, scale: 2 }), // 4th attempt fee
  // Trading feature unlocks
  featureUnlocks: jsonb("feature_unlocks"), // Specific features this course unlocks
  tradingPermissions: jsonb("trading_permissions"), // Permissions granted
  // Metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_cert_courses_pathway_level").on(table.pathwayLevelId),
  index("idx_cert_courses_number").on(table.courseNumber),
  index("idx_cert_courses_difficulty").on(table.difficulty),
]);

// User Course Enrollments - Track user progress in certification courses
export const userCourseEnrollments = pgTable("user_course_enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").notNull().references(() => certificationCourses.id),
  pathwayLevelId: varchar("pathway_level_id").notNull().references(() => careerPathwayLevels.id),
  // Progress tracking
  status: text("status").notNull().default("enrolled"), // 'enrolled', 'in_progress', 'completed', 'failed'
  progressPercent: decimal("progress_percent", { precision: 5, scale: 2 }).default("0.00"),
  currentModule: integer("current_module").default(1),
  completedModules: integer("completed_modules").array().default(sql`ARRAY[]::integer[]`),
  timeSpent: integer("time_spent_minutes").default(0),
  // Exam attempts
  examAttempts: integer("exam_attempts").default(0),
  bestScore: decimal("best_score", { precision: 5, scale: 2 }),
  lastAttemptScore: decimal("last_attempt_score", { precision: 5, scale: 2 }),
  passed: boolean("passed").default(false),
  passedAt: timestamp("passed_at"),
  // Penalty tracking
  penaltyCharges: decimal("penalty_charges", { precision: 10, scale: 2 }).default("0.00"),
  penaltyAttempts: integer("penalty_attempts").default(0), // Attempts beyond free limit
  // Metadata
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_user_enrollments_user").on(table.userId),
  index("idx_user_enrollments_course").on(table.courseId),
  index("idx_user_enrollments_pathway").on(table.pathwayLevelId),
  index("idx_user_enrollments_status").on(table.status),
]);

// User Pathway Progress - Overall certification pathway progress
export const userPathwayProgress = pgTable("user_pathway_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  pathway: text("pathway").notNull(), // 'associate', 'family_office', 'hedge_fund', 'agency'
  currentLevelId: varchar("current_level_id").references(() => careerPathwayLevels.id),
  // Certification status
  coursesPassed: integer("courses_passed").default(0), // Total courses passed at current level
  isCertified: boolean("is_certified").default(false), // 3/5 courses passed
  isMasterCertified: boolean("is_master_certified").default(false), // 5/5 courses passed
  // Hidden salary bonuses (revealed after certification)
  certificationBonusRevealed: boolean("certification_bonus_revealed").default(false),
  certificationBonusAmount: decimal("certification_bonus_amount", { precision: 15, scale: 2 }),
  masterBonusRevealed: boolean("master_bonus_revealed").default(false),
  masterBonusAmount: decimal("master_bonus_amount", { precision: 15, scale: 2 }),
  // Current salary
  currentSalaryMax: decimal("current_salary_max", { precision: 15, scale: 2 }),
  // Progression tracking
  totalCoursesCompleted: integer("total_courses_completed").default(0),
  totalExamAttempts: integer("total_exam_attempts").default(0),
  totalPenaltiesCharged: decimal("total_penalties_charged", { precision: 10, scale: 2 }).default("0.00"),
  pathwayStartedAt: timestamp("pathway_started_at").defaultNow(),
  lastLevelCompletedAt: timestamp("last_level_completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_user_pathway_user").on(table.userId),
  index("idx_user_pathway_pathway").on(table.pathway),
  index("idx_user_pathway_level").on(table.currentLevelId),
  index("idx_user_pathway_certified").on(table.isCertified),
  index("idx_user_pathway_master").on(table.isMasterCertified),
]);

// Exam Attempts - Individual exam attempt records
export const examAttempts = pgTable("exam_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").notNull().references(() => certificationCourses.id),
  enrollmentId: varchar("enrollment_id").notNull().references(() => userCourseEnrollments.id),
  // Attempt details
  attemptNumber: integer("attempt_number").notNull(),
  isPenaltyAttempt: boolean("is_penalty_attempt").default(false),
  penaltyCharged: decimal("penalty_charged", { precision: 10, scale: 2 }),
  // Exam results
  score: decimal("score", { precision: 5, scale: 2 }).notNull(),
  passed: boolean("passed").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  // Exam data
  responses: jsonb("responses").notNull(), // User's answers
  timeSpent: integer("time_spent_seconds"),
  // Feedback
  feedback: text("feedback"), // Auto-generated feedback
  areasForImprovement: text("areas_for_improvement").array(),
  // Metadata
  attemptedAt: timestamp("attempted_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_exam_attempts_user").on(table.userId),
  index("idx_exam_attempts_course").on(table.courseId),
  index("idx_exam_attempts_enrollment").on(table.enrollmentId),
  index("idx_exam_attempts_passed").on(table.passed),
  index("idx_exam_attempts_penalty").on(table.isPenaltyAttempt),
]);

// Insert schemas for career pathway tables
export const insertCareerPathwayLevelSchema = createInsertSchema(careerPathwayLevels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCertificationCourseSchema = createInsertSchema(certificationCourses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserCourseEnrollmentSchema = createInsertSchema(userCourseEnrollments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserPathwayProgressSchema = createInsertSchema(userPathwayProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExamAttemptSchema = createInsertSchema(examAttempts).omit({
  id: true,
  createdAt: true,
});

// Export types for career pathway system
export type CareerPathwayLevel = typeof careerPathwayLevels.$inferSelect;
export type InsertCareerPathwayLevel = z.infer<typeof insertCareerPathwayLevelSchema>;

export type CertificationCourse = typeof certificationCourses.$inferSelect;
export type InsertCertificationCourse = z.infer<typeof insertCertificationCourseSchema>;

export type UserCourseEnrollment = typeof userCourseEnrollments.$inferSelect;
export type InsertUserCourseEnrollment = z.infer<typeof insertUserCourseEnrollmentSchema>;

export type UserPathwayProgress = typeof userPathwayProgress.$inferSelect;
export type InsertUserPathwayProgress = z.infer<typeof insertUserPathwayProgressSchema>;

export type ExamAttempt = typeof examAttempts.$inferSelect;
export type InsertExamAttempt = z.infer<typeof insertExamAttemptSchema>;

// ===========================
// SUBSCRIBER COURSE INCENTIVES SYSTEM
// ===========================

// Subscriber Course Incentives - Track rewards for subscribers completing courses
export const subscriberCourseIncentives = pgTable("subscriber_course_incentives", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").references(() => certificationCourses.id),
  pathwayLevelId: varchar("pathway_level_id").references(() => careerPathwayLevels.id),
  
  // Incentive type and value
  incentiveType: text("incentive_type").notNull(), // 'capital_bonus', 'fee_discount', 'xp_multiplier', 'early_access'
  incentiveValue: decimal("incentive_value", { precision: 15, scale: 2 }).notNull(), // Dollar amount or percentage
  
  // Activation and expiry
  status: text("status").notNull().default("pending"), // 'pending', 'active', 'expired', 'claimed'
  activatedAt: timestamp("activated_at"),
  expiresAt: timestamp("expires_at"),
  
  // Tracking
  claimedAt: timestamp("claimed_at"),
  isActive: boolean("is_active").default(true),
  description: text("description"), // Human-readable description
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_subscriber_incentives_user").on(table.userId),
  index("idx_subscriber_incentives_type").on(table.incentiveType),
  index("idx_subscriber_incentives_status").on(table.status),
  index("idx_subscriber_incentives_course").on(table.courseId),
]);

// Subscriber Active Benefits - Current active benefits for subscribers
export const subscriberActiveBenefits = pgTable("subscriber_active_benefits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Capital bonuses
  totalCapitalBonusEarned: decimal("total_capital_bonus_earned", { precision: 15, scale: 2 }).default("0.00"),
  pendingCapitalBonus: decimal("pending_capital_bonus", { precision: 15, scale: 2 }).default("0.00"),
  
  // Trading fee discounts (percentage)
  tradingFeeDiscount: decimal("trading_fee_discount", { precision: 5, scale: 2 }).default("0.00"), // 0-100%
  feeDiscountExpiresAt: timestamp("fee_discount_expires_at"),
  
  // XP multipliers
  xpMultiplier: decimal("xp_multiplier", { precision: 5, scale: 2 }).default("1.00"), // 1x to 3x
  xpMultiplierExpiresAt: timestamp("xp_multiplier_expires_at"),
  
  // Early access flags
  hasEarlyAccess: boolean("has_early_access").default(false),
  earlyAccessFeatures: text("early_access_features").array(), // Array of feature flags
  earlyAccessExpiresAt: timestamp("early_access_expires_at"),
  
  // Badge and tier display
  certificationBadgeTier: text("certification_badge_tier"), // 'certified', 'master', 'legend'
  displayBadge: boolean("display_badge").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_subscriber_benefits_user").on(table.userId),
  index("idx_subscriber_benefits_badge").on(table.certificationBadgeTier),
]);

// Subscriber Incentive History - Audit trail of all incentives awarded
export const subscriberIncentiveHistory = pgTable("subscriber_incentive_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  incentiveId: varchar("incentive_id").references(() => subscriberCourseIncentives.id),
  
  // Event details
  eventType: text("event_type").notNull(), // 'awarded', 'claimed', 'expired', 'revoked'
  incentiveType: text("incentive_type").notNull(),
  incentiveValue: decimal("incentive_value", { precision: 15, scale: 2 }).notNull(),
  
  // Context
  sourceType: text("source_type").notNull(), // 'course_completion', 'certification_earned', 'milestone', 'special_event'
  sourceId: varchar("source_id"), // Reference to course, certification, etc.
  description: text("description"),
  metadata: jsonb("metadata"), // Additional context
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_incentive_history_user").on(table.userId),
  index("idx_incentive_history_event").on(table.eventType),
  index("idx_incentive_history_source").on(table.sourceType),
]);

// Insert schemas for subscriber incentive tables
export const insertSubscriberCourseIncentiveSchema = createInsertSchema(subscriberCourseIncentives).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriberActiveBenefitsSchema = createInsertSchema(subscriberActiveBenefits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriberIncentiveHistorySchema = createInsertSchema(subscriberIncentiveHistory).omit({
  id: true,
  createdAt: true,
});

// Export types for subscriber incentive system
export type SubscriberCourseIncentive = typeof subscriberCourseIncentives.$inferSelect;
export type InsertSubscriberCourseIncentive = z.infer<typeof insertSubscriberCourseIncentiveSchema>;

export type SubscriberActiveBenefits = typeof subscriberActiveBenefits.$inferSelect;
export type InsertSubscriberActiveBenefits = z.infer<typeof insertSubscriberActiveBenefitsSchema>;

export type SubscriberIncentiveHistory = typeof subscriberIncentiveHistory.$inferSelect;
export type InsertSubscriberIncentiveHistory = z.infer<typeof insertSubscriberIncentiveHistorySchema>;

// ===========================
// EASTER EGG SYSTEM - Hidden rewards for subscribers
// ===========================

// Easter Egg Definitions - Define all possible Easter eggs with triggers and rewards
export const easterEggDefinitions = pgTable("easter_egg_definitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  internalCode: text("internal_code").notNull().unique(), // e.g., 'SEVEN_DAY_STREAK'
  description: text("description").notNull(),
  discoveryHint: text("discovery_hint"), // Subtle hint shown to users
  
  // Trigger configuration
  triggerType: text("trigger_type").notNull(), // 'consecutive_profitable_days', 'portfolio_milestone', 'achievement_chain', 'hidden_action', 'trading_pattern', 'total_volume'
  triggerConditions: jsonb("trigger_conditions").notNull(), // e.g., { days: 7, profitThreshold: 0 } or { portfolioValue: 100000 }
  requiresPreviousEggs: text("requires_previous_eggs").array(), // Array of egg IDs that must be unlocked first
  
  // Reward configuration
  rewardType: text("reward_type").notNull(), // 'capital_bonus', 'secret_badge', 'exclusive_asset', 'fee_waiver', 'xp_boost', 'special_title'
  rewardValue: text("reward_value").notNull(), // Amount or identifier
  rewardDescription: text("reward_description").notNull(),
  
  // Gating and visibility
  subscribersOnly: boolean("subscribers_only").default(true),
  requiredSubscriptionTier: text("required_subscription_tier"), // 'basic', 'premium', 'elite' or null for any subscriber
  isSecret: boolean("is_secret").default(true), // If true, not shown in collection until discovered
  difficultyRating: integer("difficulty_rating").default(1), // 1-5 difficulty
  
  // Metadata
  rarity: text("rarity").default("common"), // 'common', 'uncommon', 'rare', 'epic', 'legendary'
  category: text("category"), // 'trading_mastery', 'portfolio_achievement', 'hidden_secrets', 'time_based', 'social'
  iconUrl: text("icon_url"),
  badgeColor: text("badge_color"),
  flavorText: text("flavor_text"), // Lore/story text
  
  // Activity tracking
  timesUnlocked: integer("times_unlocked").default(0),
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_easter_egg_trigger_type").on(table.triggerType),
  index("idx_easter_egg_subscribers_only").on(table.subscribersOnly),
  index("idx_easter_egg_active").on(table.isActive),
]);

// Easter Egg User Progress - Track user progress towards unlocking eggs
export const easterEggUserProgress = pgTable("easter_egg_user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  eggId: varchar("egg_id").notNull().references(() => easterEggDefinitions.id),
  
  // Progress tracking
  progressValue: decimal("progress_value", { precision: 15, scale: 2 }).default("0"), // Current progress (e.g., 3/7 days)
  progressPercentage: decimal("progress_percentage", { precision: 5, scale: 2 }).default("0"), // 0-100%
  progressData: jsonb("progress_data"), // Additional tracking data (dates, actions, etc.)
  
  // State
  isUnlocked: boolean("is_unlocked").default(false),
  unlockedAt: timestamp("unlocked_at"),
  lastProgressUpdate: timestamp("last_progress_update").defaultNow(),
  
  // Streaks and chains
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  streakBrokenAt: timestamp("streak_broken_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_egg_progress_user").on(table.userId),
  index("idx_egg_progress_egg").on(table.eggId),
  index("idx_egg_progress_unlocked").on(table.isUnlocked),
  index("idx_egg_progress_user_egg").on(table.userId, table.eggId),
]);

// Easter Egg Unlocks - Records of unlocked eggs and claimed rewards
export const easterEggUnlocks = pgTable("easter_egg_unlocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  eggId: varchar("egg_id").notNull().references(() => easterEggDefinitions.id),
  progressId: varchar("progress_id").references(() => easterEggUserProgress.id),
  
  // Unlock details
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  unlockMethod: text("unlock_method"), // How it was discovered
  unlockContext: jsonb("unlock_context"), // Context data at time of unlock
  
  // Reward claim
  rewardClaimed: boolean("reward_claimed").default(false),
  rewardClaimedAt: timestamp("reward_claimed_at"),
  rewardType: text("reward_type").notNull(),
  rewardValue: text("reward_value").notNull(),
  rewardApplied: boolean("reward_applied").default(false), // Whether reward has been applied to account
  
  // Social/display
  isPublic: boolean("is_public").default(false), // Whether user wants to show this achievement
  displayOnProfile: boolean("display_on_profile").default(true),
  
  // Notification
  notificationSent: boolean("notification_sent").default(false),
  notificationSeenAt: timestamp("notification_seen_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_egg_unlocks_user").on(table.userId),
  index("idx_egg_unlocks_egg").on(table.eggId),
  index("idx_egg_unlocks_claimed").on(table.rewardClaimed),
  index("idx_egg_unlocks_public").on(table.isPublic),
]);

// Insert schemas for Easter egg tables
export const insertEasterEggDefinitionSchema = createInsertSchema(easterEggDefinitions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  timesUnlocked: true,
});

export const insertEasterEggUserProgressSchema = createInsertSchema(easterEggUserProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEasterEggUnlockSchema = createInsertSchema(easterEggUnlocks).omit({
  id: true,
  createdAt: true,
});

// Export types for Easter egg system
export type EasterEggDefinition = typeof easterEggDefinitions.$inferSelect;
export type InsertEasterEggDefinition = z.infer<typeof insertEasterEggDefinitionSchema>;

export type EasterEggUserProgress = typeof easterEggUserProgress.$inferSelect;
export type InsertEasterEggUserProgress = z.infer<typeof insertEasterEggUserProgressSchema>;

export type EasterEggUnlock = typeof easterEggUnlocks.$inferSelect;
export type InsertEasterEggUnlock = z.infer<typeof insertEasterEggUnlockSchema>;

// ===========================
// ADVANCED MARKET INTELLIGENCE SYSTEM TABLES
// ===========================

// AI Market Predictions - Store AI-generated market forecasts and price predictions
export const aiMarketPredictions = pgTable("ai_market_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  predictionType: text("prediction_type").notNull(), // 'price', 'trend', 'sentiment', 'battle_outcome'
  timeframe: text("timeframe").notNull(), // '1d', '1w', '1m', '3m', '6m', '1y'
  currentPrice: decimal("current_price", { precision: 15, scale: 2 }),
  predictedPrice: decimal("predicted_price", { precision: 15, scale: 2 }),
  predictedChange: decimal("predicted_change", { precision: 8, scale: 4 }), // Percentage change
  confidence: decimal("confidence", { precision: 5, scale: 4 }), // 0-1 confidence score
  reasoning: text("reasoning"), // AI-generated reasoning
  marketFactors: jsonb("market_factors"), // Array of factors influencing prediction
  riskLevel: text("risk_level"), // 'LOW', 'MEDIUM', 'HIGH'
  aiModel: text("ai_model").default("gpt-4o-mini"), // Model used for prediction
  houseBonus: jsonb("house_bonus"), // House-specific bonuses and influences
  karmaInfluence: decimal("karma_influence", { precision: 5, scale: 4 }), // Karma alignment impact
  actualOutcome: decimal("actual_outcome", { precision: 8, scale: 4 }), // Actual result for accuracy tracking
  accuracy: decimal("accuracy", { precision: 5, scale: 4 }), // Prediction accuracy score
  isActive: boolean("is_active").default(true), // Whether prediction is still valid
  expiresAt: timestamp("expires_at"), // When prediction expires
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Character Battle Scenarios - Store battle matchups and outcome predictions
export const characterBattleScenarios = pgTable("character_battle_scenarios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  character1Id: varchar("character1_id").notNull().references(() => assets.id),
  character2Id: varchar("character2_id").notNull().references(() => assets.id),
  battleType: text("battle_type").notNull(), // 'power_clash', 'strategy_battle', 'moral_conflict', 'crossover_event'
  battleContext: text("battle_context"), // Description of battle circumstances
  powerLevelData: jsonb("power_level_data"), // Power stats and abilities
  winProbability: decimal("win_probability", { precision: 5, scale: 4 }), // Character 1 win probability
  battleFactors: jsonb("battle_factors"), // Factors influencing outcome
  historicalData: jsonb("historical_data"), // Past battle results and comic references
  houseAdvantages: jsonb("house_advantages"), // House-specific battle bonuses
  predictedOutcome: text("predicted_outcome"), // Detailed battle outcome prediction
  marketImpact: decimal("market_impact", { precision: 8, scale: 4 }), // Expected price impact
  confidence: decimal("confidence", { precision: 5, scale: 4 }), // AI confidence in prediction
  actualResult: text("actual_result"), // Actual battle outcome (if resolved)
  accuracy: decimal("accuracy", { precision: 5, scale: 4 }), // Prediction accuracy
  isActive: boolean("is_active").default(true),
  resolvedAt: timestamp("resolved_at"), // When battle was resolved
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Market Intelligence Cache - Store processed AI insights and analysis
export const marketIntelligenceCache = pgTable("market_intelligence_cache", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cacheKey: text("cache_key").notNull().unique(), // Unique identifier for cached data
  dataType: text("data_type").notNull(), // 'trend_analysis', 'correlation_matrix', 'sentiment_report', 'anomaly_detection'
  scope: text("scope").notNull(), // 'global', 'house_specific', 'user_specific', 'asset_specific'
  targetId: varchar("target_id"), // Asset ID, House ID, or User ID depending on scope
  analysisData: jsonb("analysis_data"), // Cached analysis results
  insights: jsonb("insights"), // Key insights and recommendations
  confidence: decimal("confidence", { precision: 5, scale: 4 }), // Overall confidence in analysis
  processingTime: integer("processing_time"), // Time taken to generate (milliseconds)
  dataFreshness: timestamp("data_freshness"), // When source data was last updated
  accessCount: integer("access_count").default(0), // Number of times accessed
  lastAccessed: timestamp("last_accessed"), // Last access time for cache management
  expiresAt: timestamp("expires_at").notNull(), // Cache expiration time
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User AI Interaction History - Track user interactions with AI Oracle
export const userAiInteractions = pgTable("user_ai_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  interactionType: text("interaction_type").notNull(), // 'prediction_request', 'market_insight', 'battle_forecast', 'portfolio_analysis'
  inputData: jsonb("input_data"), // User input or request parameters
  aiResponse: jsonb("ai_response"), // AI-generated response
  mysticalPresentation: text("mystical_presentation"), // Mystical/oracle-themed presentation
  userHouse: text("user_house"), // User's house at time of interaction
  karmaAlignment: jsonb("karma_alignment"), // User's karma alignment at time of interaction
  confidence: decimal("confidence", { precision: 5, scale: 4 }), // AI confidence in response
  userRating: integer("user_rating"), // User rating of AI response (1-5)
  followedAdvice: boolean("followed_advice"), // Whether user acted on AI advice
  outcomeTracking: jsonb("outcome_tracking"), // Track results of AI recommendations
  sessionId: varchar("session_id"), // Group related interactions
  processingTime: integer("processing_time"), // Response generation time
  tokens: integer("tokens"), // AI tokens used
  cost: decimal("cost", { precision: 8, scale: 6 }), // API cost (if applicable)
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Oracle Persona Configurations - Manage Oracle personality and responses
export const aiOraclePersonas = pgTable("ai_oracle_personas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  personaName: text("persona_name").notNull(), // 'Ancient Sage', 'Battle Prophet', 'Market Mystic'
  description: text("description"), // Persona description and specialization
  houseAffinity: text("house_affinity"), // Primary house affinity
  personalityTraits: jsonb("personality_traits"), // Personality characteristics
  responseStyle: jsonb("response_style"), // Communication style and tone
  expertise: jsonb("expertise"), // Areas of specialization
  mysticalLanguage: jsonb("mystical_language"), // Language patterns and phrases
  divineSymbols: jsonb("divine_symbols"), // Associated symbols and imagery
  powerLevel: integer("power_level").default(1), // Oracle power level
  isActive: boolean("is_active").default(true),
  usageCount: integer("usage_count").default(0), // Times this persona was used
  avgUserRating: decimal("avg_user_rating", { precision: 3, scale: 2 }), // Average user rating
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Market Anomaly Detection - Store detected unusual market patterns
export const marketAnomalies = pgTable("market_anomalies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").references(() => assets.id),
  anomalyType: text("anomaly_type").notNull(), // 'price_spike', 'volume_surge', 'sentiment_shift', 'pattern_break'
  severity: text("severity").notNull(), // 'low', 'medium', 'high', 'critical'
  description: text("description"), // Human-readable description
  detectionData: jsonb("detection_data"), // Technical data about the anomaly
  historicalComparison: jsonb("historical_comparison"), // Comparison with historical patterns
  potentialCauses: jsonb("potential_causes"), // Possible reasons for anomaly
  marketImpact: decimal("market_impact", { precision: 8, scale: 4 }), // Estimated market impact
  aiConfidence: decimal("ai_confidence", { precision: 5, scale: 4 }), // AI confidence in detection
  userNotifications: integer("user_notifications").default(0), // Number of users notified
  followUpActions: jsonb("follow_up_actions"), // Recommended actions
  resolved: boolean("resolved").default(false), // Whether anomaly has been resolved
  resolvedAt: timestamp("resolved_at"), // When anomaly was resolved
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===========================
// AI MARKET INTELLIGENCE SCHEMAS AND TYPES
// ===========================

// Create insert schemas for AI Market Intelligence tables
export const insertAiMarketPredictionSchema = createInsertSchema(aiMarketPredictions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCharacterBattleScenarioSchema = createInsertSchema(characterBattleScenarios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketIntelligenceCacheSchema = createInsertSchema(marketIntelligenceCache).omit({
  id: true,
  accessCount: true,
  lastAccessed: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserAiInteractionSchema = createInsertSchema(userAiInteractions).omit({
  id: true,
  createdAt: true,
});

export const insertAiOraclePersonaSchema = createInsertSchema(aiOraclePersonas).omit({
  id: true,
  usageCount: true,
  avgUserRating: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketAnomalySchema = createInsertSchema(marketAnomalies).omit({
  id: true,
  userNotifications: true,
  resolved: true,
  resolvedAt: true,
  createdAt: true,
  updatedAt: true,
});

// Export types for AI Market Intelligence system
export type AiMarketPrediction = typeof aiMarketPredictions.$inferSelect;
export type InsertAiMarketPrediction = z.infer<typeof insertAiMarketPredictionSchema>;

export type CharacterBattleScenario = typeof characterBattleScenarios.$inferSelect;
export type InsertCharacterBattleScenario = z.infer<typeof insertCharacterBattleScenarioSchema>;

export type MarketIntelligenceCache = typeof marketIntelligenceCache.$inferSelect;
export type InsertMarketIntelligenceCache = z.infer<typeof insertMarketIntelligenceCacheSchema>;

export type UserAiInteraction = typeof userAiInteractions.$inferSelect;
export type InsertUserAiInteraction = z.infer<typeof insertUserAiInteractionSchema>;

export type AiOraclePersona = typeof aiOraclePersonas.$inferSelect;
export type InsertAiOraclePersona = z.infer<typeof insertAiOraclePersonaSchema>;

export type MarketAnomaly = typeof marketAnomalies.$inferSelect;
export type InsertMarketAnomaly = z.infer<typeof insertMarketAnomalySchema>;

// =============================================
// PHASE 8: EXTERNAL TOOL INTEGRATION TABLES
// =============================================

// External tool integrations (Webflow, Figma, Relume, Zapier)
export const externalIntegrations = pgTable("external_integrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  integrationName: text("integration_name").notNull(), // 'webflow', 'figma', 'relume', 'zapier'
  integrationDisplayName: text("integration_display_name").notNull(), // "Webflow", "Figma", etc.
  status: text("status").notNull().default("disconnected"), // 'connected', 'disconnected', 'error', 'pending'
  authType: text("auth_type").notNull(), // 'oauth', 'api_key', 'webhook'
  // Encrypted credential storage (never store plaintext API keys)
  encryptedCredentials: text("encrypted_credentials"), // Encrypted JSON of auth tokens/keys
  authScopes: jsonb("auth_scopes"), // OAuth scopes or permission levels
  connectionMetadata: jsonb("connection_metadata"), // Additional connection info (account IDs, team info, etc.)
  configuration: jsonb("configuration"), // Integration-specific settings
  // Integration health and monitoring
  lastHealthCheck: timestamp("last_health_check"),
  healthStatus: text("health_status").default("unknown"), // 'healthy', 'unhealthy', 'degraded', 'unknown'
  errorMessage: text("error_message"), // Last error encountered
  retryCount: integer("retry_count").default(0),
  // Usage tracking
  totalSyncs: integer("total_syncs").default(0),
  lastSyncAt: timestamp("last_sync_at"),
  nextScheduledSync: timestamp("next_scheduled_sync"),
  // House-specific bonuses and preferences
  houseId: text("house_id").references(() => users.houseId), // Inherit from user or override
  houseBonusMultiplier: decimal("house_bonus_multiplier", { precision: 3, scale: 2 }).default("1.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_external_integrations_user").on(table.userId),
  index("idx_external_integrations_name").on(table.integrationName),
  index("idx_external_integrations_status").on(table.status),
  index("idx_external_integrations_health").on(table.healthStatus),
]);

// Webhook management for bidirectional communication
export const integrationWebhooks = pgTable("integration_webhooks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  integrationId: varchar("integration_id").notNull().references(() => externalIntegrations.id),
  webhookType: text("webhook_type").notNull(), // 'incoming', 'outgoing'
  eventType: text("event_type").notNull(), // 'user.created', 'trade.executed', 'portfolio.updated', etc.
  webhookUrl: text("webhook_url"), // For outgoing webhooks
  secretKey: text("secret_key"), // For webhook verification
  isActive: boolean("is_active").default(true),
  // Webhook configuration
  httpMethod: text("http_method").default("POST"), // POST, PUT, PATCH
  headers: jsonb("headers"), // Custom headers to send
  payload: jsonb("payload"), // Payload template or structure
  retryPolicy: jsonb("retry_policy"), // Retry configuration
  // Monitoring and analytics
  totalTriggers: integer("total_triggers").default(0),
  successfulTriggers: integer("successful_triggers").default(0),
  failedTriggers: integer("failed_triggers").default(0),
  lastTriggeredAt: timestamp("last_triggered_at"),
  lastSuccessAt: timestamp("last_success_at"),
  lastFailureAt: timestamp("last_failure_at"),
  lastErrorMessage: text("last_error_message"),
  averageResponseTime: decimal("average_response_time", { precision: 8, scale: 3 }), // milliseconds
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_integration_webhooks_integration").on(table.integrationId),
  index("idx_integration_webhooks_type").on(table.webhookType),
  index("idx_integration_webhooks_event").on(table.eventType),
  index("idx_integration_webhooks_active").on(table.isActive),
]);

// Integration synchronization logs
export const integrationSyncLogs = pgTable("integration_sync_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  integrationId: varchar("integration_id").notNull().references(() => externalIntegrations.id),
  syncType: text("sync_type").notNull(), // 'full', 'incremental', 'manual', 'webhook'
  direction: text("direction").notNull(), // 'import', 'export', 'bidirectional'
  status: text("status").notNull(), // 'started', 'in_progress', 'completed', 'failed', 'cancelled'
  dataType: text("data_type"), // 'portfolios', 'designs', 'workflows', 'analytics'
  // Sync metrics
  recordsProcessed: integer("records_processed").default(0),
  recordsSuccessful: integer("records_successful").default(0),
  recordsFailed: integer("records_failed").default(0),
  durationMs: integer("duration_ms"), // Sync duration in milliseconds
  // Sync details
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  errorMessage: text("error_message"),
  errorDetails: jsonb("error_details"), // Detailed error information
  syncMetadata: jsonb("sync_metadata"), // Additional sync context
  // Data transformation tracking
  transformationRules: jsonb("transformation_rules"), // Rules applied during sync
  validationErrors: jsonb("validation_errors"), // Data validation issues
  conflictResolution: jsonb("conflict_resolution"), // How conflicts were resolved
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_integration_sync_logs_integration").on(table.integrationId),
  index("idx_integration_sync_logs_status").on(table.status),
  index("idx_integration_sync_logs_type").on(table.syncType),
  index("idx_integration_sync_logs_started").on(table.startedAt),
]);

// Workflow automation configurations (Sacred Rituals and Divine Protocols)
export const workflowAutomations = pgTable("workflow_automations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(), // User-friendly workflow name
  description: text("description"),
  category: text("category").notNull(), // 'trading', 'portfolio', 'marketing', 'analytics', 'house_ritual'
  // Workflow configuration
  triggerType: text("trigger_type").notNull(), // 'schedule', 'event', 'webhook', 'manual'
  triggerConfig: jsonb("trigger_config").notNull(), // Trigger-specific configuration
  actionSteps: jsonb("action_steps").notNull(), // Array of automation steps
  conditions: jsonb("conditions"), // Conditional logic for execution
  // Mystical RPG elements
  ritualType: text("ritual_type"), // 'sacred_ritual', 'divine_protocol', 'karmic_alignment'
  houseBonus: decimal("house_bonus", { precision: 3, scale: 2 }).default("1.00"),
  karmaRequirement: integer("karma_requirement").default(0),
  mysticalPower: integer("mystical_power").default(1), // 1-10 scale
  // Status and execution
  isActive: boolean("is_active").default(true),
  status: text("status").default("active"), // 'active', 'paused', 'disabled', 'error'
  // Execution tracking
  totalRuns: integer("total_runs").default(0),
  successfulRuns: integer("successful_runs").default(0),
  failedRuns: integer("failed_runs").default(0),
  lastRunAt: timestamp("last_run_at"),
  lastSuccessAt: timestamp("last_success_at"),
  lastFailureAt: timestamp("last_failure_at"),
  nextRunAt: timestamp("next_run_at"),
  lastErrorMessage: text("last_error_message"),
  averageExecutionTime: decimal("average_execution_time", { precision: 8, scale: 3 }), // milliseconds
  // Advanced features
  priority: integer("priority").default(5), // 1-10 execution priority
  timeout: integer("timeout").default(300000), // Timeout in milliseconds
  retryPolicy: jsonb("retry_policy"), // Retry configuration
  notificationSettings: jsonb("notification_settings"), // How to notify on success/failure
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_workflow_automations_user").on(table.userId),
  index("idx_workflow_automations_category").on(table.category),
  index("idx_workflow_automations_trigger").on(table.triggerType),
  index("idx_workflow_automations_active").on(table.isActive),
  index("idx_workflow_automations_next_run").on(table.nextRunAt),
]);

// Workflow execution history
export const workflowExecutions = pgTable("workflow_executions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workflowId: varchar("workflow_id").notNull().references(() => workflowAutomations.id),
  executionId: varchar("execution_id").notNull(), // Unique ID for this execution
  status: text("status").notNull(), // 'started', 'running', 'completed', 'failed', 'timeout', 'cancelled'
  triggerSource: text("trigger_source"), // What triggered this execution
  triggerData: jsonb("trigger_data"), // Data from the trigger
  // Execution details
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  durationMs: integer("duration_ms"),
  // Step tracking
  totalSteps: integer("total_steps"),
  completedSteps: integer("completed_steps"),
  failedSteps: integer("failed_steps"),
  currentStep: integer("current_step"),
  stepExecutions: jsonb("step_executions"), // Detailed step execution log
  // Results and outputs
  outputData: jsonb("output_data"), // Results produced by the workflow
  errorMessage: text("error_message"),
  errorDetails: jsonb("error_details"),
  // Mystical elements
  karmaEarned: integer("karma_earned").default(0),
  mysticalEffects: jsonb("mystical_effects"), // Special effects or bonuses
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_workflow_executions_workflow").on(table.workflowId),
  index("idx_workflow_executions_status").on(table.status),
  index("idx_workflow_executions_started").on(table.startedAt),
  index("idx_workflow_executions_execution_id").on(table.executionId),
]);

// Integration usage analytics and performance monitoring
export const integrationAnalytics = pgTable("integration_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  integrationId: varchar("integration_id").notNull().references(() => externalIntegrations.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  analyticsDate: timestamp("analytics_date").notNull(), // Date for daily/hourly aggregations
  timeframe: text("timeframe").notNull(), // 'hourly', 'daily', 'weekly', 'monthly'
  // Usage metrics
  apiCalls: integer("api_calls").default(0),
  successfulCalls: integer("successful_calls").default(0),
  failedCalls: integer("failed_calls").default(0),
  dataTransferred: integer("data_transferred").default(0), // bytes
  // Performance metrics
  averageResponseTime: decimal("average_response_time", { precision: 8, scale: 3 }), // milliseconds
  minResponseTime: decimal("min_response_time", { precision: 8, scale: 3 }),
  maxResponseTime: decimal("max_response_time", { precision: 8, scale: 3 }),
  // Error tracking
  errorCategories: jsonb("error_categories"), // Categorized error counts
  rateLimitHits: integer("rate_limit_hits").default(0),
  timeoutCount: integer("timeout_count").default(0),
  // Business metrics
  automationsTriggered: integer("automations_triggered").default(0),
  workflowsCompleted: integer("workflows_completed").default(0),
  dataPointsSynced: integer("data_points_synced").default(0),
  // Cost tracking
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 4 }), // External API costs
  creditsUsed: integer("credits_used").default(0), // Internal credits consumed
  // House performance
  houseId: text("house_id"),
  houseBonusApplied: decimal("house_bonus_applied", { precision: 3, scale: 2 }),
  karmaGenerated: integer("karma_generated").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_integration_analytics_integration").on(table.integrationId),
  index("idx_integration_analytics_user").on(table.userId),
  index("idx_integration_analytics_date").on(table.analyticsDate),
  index("idx_integration_analytics_timeframe").on(table.timeframe),
]);

// External tool user mappings (for cross-platform identity management)
export const externalUserMappings = pgTable("external_user_mappings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  integrationId: varchar("integration_id").notNull().references(() => externalIntegrations.id),
  externalUserId: text("external_user_id").notNull(), // User ID in external system
  externalUserName: text("external_user_name"), // Username in external system
  externalUserEmail: text("external_user_email"), // Email in external system
  permissions: jsonb("permissions"), // What Panel Profits data can be shared
  dataMapping: jsonb("data_mapping"), // How Panel Profits data maps to external system
  syncPreferences: jsonb("sync_preferences"), // User preferences for data synchronization
  lastSyncAt: timestamp("last_sync_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_external_user_mappings_user").on(table.userId),
  index("idx_external_user_mappings_integration").on(table.integrationId),
  index("idx_external_user_mappings_external_id").on(table.externalUserId),
]);

// =============================================
// PHASE 8 ZOD VALIDATION SCHEMAS
// =============================================

export const insertExternalIntegrationSchema = createInsertSchema(externalIntegrations).omit({
  id: true,
  totalSyncs: true,
  lastSyncAt: true,
  lastHealthCheck: true,
  retryCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIntegrationWebhookSchema = createInsertSchema(integrationWebhooks).omit({
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

export const insertIntegrationSyncLogSchema = createInsertSchema(integrationSyncLogs).omit({
  id: true,
  createdAt: true,
});

export const insertWorkflowAutomationSchema = createInsertSchema(workflowAutomations).omit({
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

export const insertWorkflowExecutionSchema = createInsertSchema(workflowExecutions).omit({
  id: true,
  createdAt: true,
});

export const insertIntegrationAnalyticsSchema = createInsertSchema(integrationAnalytics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExternalUserMappingSchema = createInsertSchema(externalUserMappings).omit({
  id: true,
  lastSyncAt: true,
  createdAt: true,
  updatedAt: true,
});

// =============================================
// PHASE 8 TYPESCRIPT TYPES
// =============================================

export type ExternalIntegration = typeof externalIntegrations.$inferSelect;
export type InsertExternalIntegration = z.infer<typeof insertExternalIntegrationSchema>;

export type IntegrationWebhook = typeof integrationWebhooks.$inferSelect;
export type InsertIntegrationWebhook = z.infer<typeof insertIntegrationWebhookSchema>;

export type IntegrationSyncLog = typeof integrationSyncLogs.$inferSelect;
export type InsertIntegrationSyncLog = z.infer<typeof insertIntegrationSyncLogSchema>;

export type WorkflowAutomation = typeof workflowAutomations.$inferSelect;
export type InsertWorkflowAutomation = z.infer<typeof insertWorkflowAutomationSchema>;

export type WorkflowExecution = typeof workflowExecutions.$inferSelect;
export type InsertWorkflowExecution = z.infer<typeof insertWorkflowExecutionSchema>;

export type IntegrationAnalytics = typeof integrationAnalytics.$inferSelect;
export type InsertIntegrationAnalytics = z.infer<typeof insertIntegrationAnalyticsSchema>;

export type ExternalUserMapping = typeof externalUserMappings.$inferSelect;
export type InsertExternalUserMapping = z.infer<typeof insertExternalUserMappingSchema>;

// =============================================
// PHASE 1: CORE TRADING FOUNDATION SYSTEM
// =============================================

// IMF Vaulting System - Fixed Share Supply & Scarcity Mechanism
export const imfVaultSettings = pgTable("imf_vault_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  // Share Supply Control
  totalSharesIssued: decimal("total_shares_issued", { precision: 15, scale: 4 }).notNull(),
  sharesInVault: decimal("shares_in_vault", { precision: 15, scale: 4 }).default("0.0000"),
  sharesInCirculation: decimal("shares_in_circulation", { precision: 15, scale: 4 }).notNull(),
  maxSharesAllowed: decimal("max_shares_allowed", { precision: 15, scale: 4 }).notNull(),
  shareCreationCutoffDate: timestamp("share_creation_cutoff_date").notNull(),
  // Vaulting Conditions
  vaultingThreshold: decimal("vaulting_threshold", { precision: 8, scale: 2 }).default("90.00"), // % market cap required to trigger vaulting
  minHoldingPeriod: integer("min_holding_period_days").default(30), // Minimum days to hold before vaulting
  vaultingFee: decimal("vaulting_fee", { precision: 8, scale: 4 }).default("0.0025"), // 0.25% fee for vaulting
  // Scarcity Mechanics
  scarcityMultiplier: decimal("scarcity_multiplier", { precision: 8, scale: 4 }).default("1.0000"),
  lastScarcityUpdate: timestamp("last_scarcity_update").defaultNow(),
  demandPressure: decimal("demand_pressure", { precision: 8, scale: 2 }).default("0.00"), // Buying pressure indicator
  supplyConstraint: decimal("supply_constraint", { precision: 8, scale: 2 }).default("0.00"), // Supply limitation factor
  // Vault Status
  isVaultingActive: boolean("is_vaulting_active").default(true),
  vaultStatus: text("vault_status").default("active"), // 'active', 'locked', 'emergency_release'
  nextVaultingEvaluation: timestamp("next_vaulting_evaluation"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Seven House Trading Firms System
export const tradingFirms = pgTable("trading_firms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  houseId: text("house_id").notNull(), // Maps to mythological houses
  firmName: text("firm_name").notNull(),
  firmCode: text("firm_code").notNull().unique(), // 'HELLENIC', 'GM_FIN', 'ASHOKA', etc.
  // Leadership
  ceoName: text("ceo_name").notNull(),
  ceoMythologyRef: text("ceo_mythology_ref"), // Zeus, Bacchus, etc.
  advisors: jsonb("advisors"), // Array of advisor names and mythological references
  // Trading Specializations
  primarySpecialties: text("primary_specialties").array(), // ['options', 'bonds', 'blue_chip', etc.]
  weaknesses: text("weaknesses").array(), // ['crypto', 'tech_options', etc.]
  specialtyBonuses: jsonb("specialty_bonuses"), // Percentage bonuses for specialties
  weaknessPenalties: jsonb("weakness_penalties"), // Percentage penalties for weaknesses
  // Firm Characteristics
  tradingStyle: text("trading_style").notNull(), // 'aggressive', 'conservative', 'systematic', 'opportunistic'
  riskTolerance: text("risk_tolerance").notNull(), // 'low', 'medium', 'high', 'extreme'
  marketCapacityUSD: decimal("market_capacity_usd", { precision: 15, scale: 2 }).notNull(),
  minimumTradeSize: decimal("minimum_trade_size", { precision: 10, scale: 2 }).default("1000.00"),
  // Performance Metrics
  totalAssetsUnderManagement: decimal("total_aum", { precision: 15, scale: 2 }).default("0.00"),
  ytdReturn: decimal("ytd_return", { precision: 8, scale: 2 }).default("0.00"),
  sharpeRatio: decimal("sharpe_ratio", { precision: 8, scale: 4 }),
  maxDrawdown: decimal("max_drawdown", { precision: 8, scale: 2 }),
  winRate: decimal("win_rate", { precision: 8, scale: 2 }),
  avgTradeSize: decimal("avg_trade_size", { precision: 10, scale: 2 }),
  // Operational Status
  isActive: boolean("is_active").default(true),
  marketHours: jsonb("market_hours"), // Operating hours by timezone
  communicationChannels: jsonb("communication_channels"), // How they announce trades/strategies
  reputation: decimal("reputation", { precision: 8, scale: 2 }).default("50.00"), // 0-100 reputation score
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comic-to-Financial Asset Mapping
export const assetFinancialMapping = pgTable("asset_financial_mapping", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  // Financial Instrument Classification
  instrumentType: text("instrument_type").notNull(), // 'common_stock', 'preferred_stock', 'bond', 'etf', 'option', 'warrant'
  instrumentSubtype: text("instrument_subtype"), // 'corporate_bond', 'government_bond', 'equity_option', etc.
  underlyingAssetId: varchar("underlying_asset_id").references(() => assets.id), // For derivatives
  // Stock-like Properties (for characters, creators)
  shareClass: text("share_class").default("A"), // 'A', 'B', 'C' for different voting rights
  votingRights: boolean("voting_rights").default(true),
  dividendEligible: boolean("dividend_eligible").default(false),
  dividendYield: decimal("dividend_yield", { precision: 8, scale: 4 }),
  // Bond-like Properties (for publishers, institutional assets)
  creditRating: text("credit_rating"), // 'AAA', 'AA+', 'A', 'BBB', etc.
  maturityDate: timestamp("maturity_date"),
  couponRate: decimal("coupon_rate", { precision: 8, scale: 4 }),
  faceValue: decimal("face_value", { precision: 10, scale: 2 }),
  // ETF/Fund Properties (for themed collections)
  fundComponents: text("fund_components").array(), // Asset IDs that comprise the fund
  expenseRatio: decimal("expense_ratio", { precision: 8, scale: 4 }),
  trackingIndex: text("tracking_index"), // What index or theme this tracks
  rebalanceFrequency: text("rebalance_frequency"), // 'daily', 'weekly', 'monthly', 'quarterly'
  // Market Mechanics
  lotSize: integer("lot_size").default(1), // Minimum trading unit
  tickSize: decimal("tick_size", { precision: 8, scale: 4 }).default("0.0100"), // Minimum price movement
  marginRequirement: decimal("margin_requirement", { precision: 8, scale: 2 }).default("50.00"), // % margin required
  shortSellAllowed: boolean("short_sell_allowed").default(true),
  // Corporate Actions
  lastSplitDate: timestamp("last_split_date"),
  splitRatio: text("split_ratio"), // '2:1', '3:2', etc.
  lastDividendDate: timestamp("last_dividend_date"),
  exDividendDate: timestamp("ex_dividend_date"),
  // Regulatory Classification
  securityType: text("security_type").notNull(), // 'equity', 'debt', 'derivative', 'fund'
  exchangeListing: text("exchange_listing").default("PPX"), // Panel Profits Exchange
  cusip: text("cusip"), // Committee on Uniform Securities Identification Procedures
  isin: text("isin"), // International Securities Identification Number
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Global Market Hours System
export const globalMarketHours = pgTable("global_market_hours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  marketCode: text("market_code").notNull().unique(), // 'NYC', 'LON', 'SYD', 'HKG', 'BOM'
  marketName: text("market_name").notNull(),
  timezone: text("timezone").notNull(), // 'America/New_York', 'Europe/London', etc.
  // Trading Hours (in market local time)
  regularOpenTime: text("regular_open_time").notNull(), // '09:30'
  regularCloseTime: text("regular_close_time").notNull(), // '16:00'
  preMarketOpenTime: text("pre_market_open_time"), // '04:00'
  afterHoursCloseTime: text("after_hours_close_time"), // '20:00'
  // Market Status
  isActive: boolean("is_active").default(true),
  currentStatus: text("current_status").default("closed"), // 'open', 'closed', 'pre_market', 'after_hours'
  lastStatusUpdate: timestamp("last_status_update").defaultNow(),
  // Holiday Schedule
  holidaySchedule: jsonb("holiday_schedule"), // Array of holiday dates
  earlyCloseSchedule: jsonb("early_close_schedule"), // Special early close dates
  // Cross-Market Trading
  enablesCrossTrading: boolean("enables_cross_trading").default(true),
  crossTradingFee: decimal("cross_trading_fee", { precision: 8, scale: 4 }).default("0.0010"),
  // Volume and Activity
  dailyVolumeTarget: decimal("daily_volume_target", { precision: 15, scale: 2 }),
  currentDayVolume: decimal("current_day_volume", { precision: 15, scale: 2 }).default("0.00"),
  avgDailyVolume: decimal("avg_daily_volume", { precision: 15, scale: 2 }),
  // Market Influence
  influenceWeight: decimal("influence_weight", { precision: 8, scale: 4 }).default("1.0000"), // How much this market affects global prices
  leadMarket: boolean("lead_market").default(false), // True for NYC (primary market)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Options Chain System
export const optionsChain = pgTable("options_chain", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  underlyingAssetId: varchar("underlying_asset_id").notNull().references(() => assets.id),
  optionSymbol: text("option_symbol").notNull().unique(), // 'BAT240315C120'
  // Contract Specifications
  contractType: text("contract_type").notNull(), // 'call', 'put'
  strikePrice: decimal("strike_price", { precision: 10, scale: 2 }).notNull(),
  expirationDate: timestamp("expiration_date").notNull(),
  exerciseStyle: text("exercise_style").default("american"), // 'american', 'european'
  contractSize: integer("contract_size").default(100), // Shares per contract
  // Pricing
  bidPrice: decimal("bid_price", { precision: 10, scale: 4 }),
  askPrice: decimal("ask_price", { precision: 10, scale: 4 }),
  lastPrice: decimal("last_price", { precision: 10, scale: 4 }),
  markPrice: decimal("mark_price", { precision: 10, scale: 4 }), // Mid-market fair value
  // Greeks
  delta: decimal("delta", { precision: 8, scale: 6 }), // Price sensitivity to underlying
  gamma: decimal("gamma", { precision: 8, scale: 6 }), // Delta sensitivity to underlying
  theta: decimal("theta", { precision: 8, scale: 6 }), // Time decay
  vega: decimal("vega", { precision: 8, scale: 6 }), // Volatility sensitivity
  rho: decimal("rho", { precision: 8, scale: 6 }), // Interest rate sensitivity
  // Volatility
  impliedVolatility: decimal("implied_volatility", { precision: 8, scale: 4 }), // IV %
  historicalVolatility: decimal("historical_volatility", { precision: 8, scale: 4 }), // HV %
  // Volume and Open Interest
  volume: integer("volume").default(0),
  openInterest: integer("open_interest").default(0),
  lastTradeTime: timestamp("last_trade_time"),
  // Risk Metrics
  intrinsicValue: decimal("intrinsic_value", { precision: 10, scale: 4 }),
  timeValue: decimal("time_value", { precision: 10, scale: 4 }),
  breakEvenPrice: decimal("break_even_price", { precision: 10, scale: 2 }),
  maxRisk: decimal("max_risk", { precision: 10, scale: 2 }),
  maxReward: decimal("max_reward", { precision: 10, scale: 2 }),
  // Status
  isActive: boolean("is_active").default(true),
  lastGreeksUpdate: timestamp("last_greeks_update"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Advanced Trading Mechanics
export const marginAccounts = pgTable("margin_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  // Account Balances
  marginEquity: decimal("margin_equity", { precision: 15, scale: 2 }).default("0.00"),
  marginCash: decimal("margin_cash", { precision: 15, scale: 2 }).default("0.00"),
  marginDebt: decimal("margin_debt", { precision: 15, scale: 2 }).default("0.00"),
  // Buying Power & Limits
  buyingPower: decimal("buying_power", { precision: 15, scale: 2 }).default("0.00"),
  dayTradingBuyingPower: decimal("day_trading_buying_power", { precision: 15, scale: 2 }).default("0.00"),
  maintenanceMargin: decimal("maintenance_margin", { precision: 15, scale: 2 }).default("0.00"),
  initialMarginReq: decimal("initial_margin_req", { precision: 8, scale: 2 }).default("50.00"), // %
  maintenanceMarginReq: decimal("maintenance_margin_req", { precision: 8, scale: 2 }).default("25.00"), // %
  // Leverage Settings
  maxLeverage: decimal("max_leverage", { precision: 8, scale: 2 }).default("2.00"), // 2:1 leverage
  currentLeverage: decimal("current_leverage", { precision: 8, scale: 2 }).default("1.00"),
  leverageUtilization: decimal("leverage_utilization", { precision: 8, scale: 2 }).default("0.00"), // %
  // Risk Management
  marginCallThreshold: decimal("margin_call_threshold", { precision: 8, scale: 2 }).default("30.00"), // %
  liquidationThreshold: decimal("liquidation_threshold", { precision: 8, scale: 2 }).default("20.00"), // %
  lastMarginCall: timestamp("last_margin_call"),
  marginCallsCount: integer("margin_calls_count").default(0),
  dayTradesUsed: integer("day_trades_used").default(0), // For PDT rule
  dayTradesMax: integer("day_trades_max").default(3),
  // Status
  accountStatus: text("account_status").default("good_standing"), // 'good_standing', 'margin_call', 'restricted'
  marginTradingEnabled: boolean("margin_trading_enabled").default(false),
  shortSellingEnabled: boolean("short_selling_enabled").default(false),
  optionsTradingLevel: integer("options_trading_level").default(0), // 0-4 options approval levels
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Short Positions
export const shortPositions = pgTable("short_positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  // Position Details
  sharesShorted: decimal("shares_shorted", { precision: 10, scale: 4 }).notNull(),
  shortPrice: decimal("short_price", { precision: 10, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }),
  // P&L
  unrealizedPnL: decimal("unrealized_pnl", { precision: 15, scale: 2 }),
  realizedPnL: decimal("realized_pnl", { precision: 15, scale: 2 }).default("0.00"),
  // Borrowing Costs
  borrowRate: decimal("borrow_rate", { precision: 8, scale: 4 }), // Daily borrow rate %
  borrowFeeAccrued: decimal("borrow_fee_accrued", { precision: 10, scale: 2 }).default("0.00"),
  lastBorrowFeeCalc: timestamp("last_borrow_fee_calc").defaultNow(),
  // Risk Management
  stopLossPrice: decimal("stop_loss_price", { precision: 10, scale: 2 }),
  marginRequirement: decimal("margin_requirement", { precision: 15, scale: 2 }),
  // Status
  positionStatus: text("position_status").default("open"), // 'open', 'covering', 'closed'
  canBorrow: boolean("can_borrow").default(true), // Can borrow shares for this asset
  borrowSource: text("borrow_source"), // Where shares are borrowed from
  openedAt: timestamp("opened_at").defaultNow(),
  closedAt: timestamp("closed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Information Tier System
export const informationTiers = pgTable("information_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tierName: text("tier_name").notNull().unique(), // 'Elite', 'Pro', 'Free'
  tierLevel: integer("tier_level").notNull(), // 1=Elite, 2=Pro, 3=Free
  // Access Timing
  newsDelayMinutes: integer("news_delay_minutes").default(0), // Elite=0, Pro=15, Free=30
  marketDataDelayMs: integer("market_data_delay_ms").default(0), // Real-time delays
  // Information Quality
  analysisQuality: text("analysis_quality").notNull(), // 'family_office', 'senior_analyst', 'junior_broker'
  insightDepth: text("insight_depth").notNull(), // 'comprehensive', 'standard', 'basic'
  // Features Unlocked
  advancedCharting: boolean("advanced_charting").default(false),
  realTimeAlerts: boolean("real_time_alerts").default(false),
  whaleTrackingAccess: boolean("whale_tracking_access").default(false),
  firmIntelligence: boolean("firm_intelligence").default(false), // Trading firm activity insights
  earlyMarketEvents: boolean("early_market_events").default(false),
  exclusiveResearch: boolean("exclusive_research").default(false),
  // Subscription Details
  monthlyPrice: decimal("monthly_price", { precision: 8, scale: 2 }),
  annualPrice: decimal("annual_price", { precision: 8, scale: 2 }),
  creditsCost: integer("credits_cost").default(0), // Alternative pricing in trading credits
  // Limits
  maxPriceAlerts: integer("max_price_alerts").default(5),
  maxWatchlistAssets: integer("max_watchlist_assets").default(20),
  maxPortfolios: integer("max_portfolios").default(1),
  // Status
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// News Feed with Tiered Access
export const newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Content
  headline: text("headline").notNull(),
  summary: text("summary").notNull(),
  fullContent: text("full_content"),
  sourceOrganization: text("source_organization").notNull(),
  authorName: text("author_name"),
  // Classification
  newsCategory: text("news_category").notNull(), // 'market_moving', 'earnings', 'merger', 'scandal', 'promotion'
  impactLevel: text("impact_level").notNull(), // 'high', 'medium', 'low'
  affectedAssets: text("affected_assets").array(), // Asset IDs that this news affects
  // Timing and Access
  createdAt: timestamp("created_at").defaultNow(),
  publishTime: timestamp("publish_time").notNull(), // When each tier sees it
  eliteReleaseTime: timestamp("elite_release_time").notNull(), // 30 min early
  proReleaseTime: timestamp("pro_release_time").notNull(), // 15 min early
  freeReleaseTime: timestamp("free_release_time").notNull(), // On time
  // Market Impact
  priceImpactDirection: text("price_impact_direction"), // 'positive', 'negative', 'neutral'
  priceImpactMagnitude: decimal("price_impact_magnitude", { precision: 8, scale: 2 }), // Expected % change
  volatilityImpact: decimal("volatility_impact", { precision: 8, scale: 2 }), // Expected volatility increase %
  // Verification
  isVerified: boolean("is_verified").default(true), // News ticker is always correct
  verifiedBy: text("verified_by").default("panel_profits_oracle"),
  confidenceScore: decimal("confidence_score", { precision: 8, scale: 2 }).default("100.00"),
  // Status
  isActive: boolean("is_active").default(true),
  tags: text("tags").array(), // Searchable tags
  relatedArticles: text("related_articles").array(), // Related article IDs
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Phase 1 Insert Schemas
export const insertImfVaultSettingsSchema = createInsertSchema(imfVaultSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTradingFirmSchema = createInsertSchema(tradingFirms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssetFinancialMappingSchema = createInsertSchema(assetFinancialMapping).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGlobalMarketHoursSchema = createInsertSchema(globalMarketHours).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOptionsChainSchema = createInsertSchema(optionsChain).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarginAccountSchema = createInsertSchema(marginAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertShortPositionSchema = createInsertSchema(shortPositions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInformationTierSchema = createInsertSchema(informationTiers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Phase 1 TypeScript Types
export type ImfVaultSettings = typeof imfVaultSettings.$inferSelect;
export type InsertImfVaultSettings = z.infer<typeof insertImfVaultSettingsSchema>;

export type TradingFirm = typeof tradingFirms.$inferSelect;
export type InsertTradingFirm = z.infer<typeof insertTradingFirmSchema>;

export type AssetFinancialMapping = typeof assetFinancialMapping.$inferSelect;
export type InsertAssetFinancialMapping = z.infer<typeof insertAssetFinancialMappingSchema>;

export type GlobalMarketHours = typeof globalMarketHours.$inferSelect;
export type InsertGlobalMarketHours = z.infer<typeof insertGlobalMarketHoursSchema>;

export type OptionsChain = typeof optionsChain.$inferSelect;
export type InsertOptionsChain = z.infer<typeof insertOptionsChainSchema>;

export type MarginAccount = typeof marginAccounts.$inferSelect;
export type InsertMarginAccount = z.infer<typeof insertMarginAccountSchema>;

export type ShortPosition = typeof shortPositions.$inferSelect;
export type InsertShortPosition = z.infer<typeof insertShortPositionSchema>;

export type InformationTier = typeof informationTiers.$inferSelect;
export type InsertInformationTier = z.infer<typeof insertInformationTierSchema>;

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;

// ============================================================================
// PHASE 2: HIGH-VOLUME NARRATIVE DATASET INGESTION SYSTEM
// ============================================================================

// ============================================================================
// STAGING TABLES - CSV File Processing and Temporary Storage
// ============================================================================

// Raw Dataset Files - Track uploaded CSV files with checksums and metadata
export const rawDatasetFiles = pgTable("raw_dataset_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // File identification
  filename: text("filename").notNull(),
  originalFilename: text("original_filename").notNull(),
  fileSize: integer("file_size").notNull(), // Size in bytes
  mimeType: text("mime_type").notNull(),
  // File integrity
  checksum: text("checksum").notNull(), // MD5 or SHA256 hash
  checksumAlgorithm: text("checksum_algorithm").default("sha256"),
  // Dataset metadata
  datasetType: text("dataset_type").notNull(), // 'characters', 'comics', 'battles', 'movies', 'reviews'
  source: text("source").notNull(), // 'marvel_wikia', 'dc_wikia', 'imdb', 'manual_upload'
  sourceUrl: text("source_url"), // Original download URL if applicable
  universe: text("universe"), // 'marvel', 'dc', 'independent', 'crossover'
  // Processing status
  processingStatus: text("processing_status").default("uploaded"), // 'uploaded', 'validating', 'processing', 'completed', 'failed'
  processingProgress: decimal("processing_progress", { precision: 5, scale: 2 }).default("0.00"), // 0-100%
  totalRows: integer("total_rows"),
  processedRows: integer("processed_rows").default(0),
  failedRows: integer("failed_rows").default(0),
  // File storage
  storageLocation: text("storage_location").notNull(), // File path or URL
  compressionType: text("compression_type"), // 'gzip', 'zip', null
  // Ingestion metadata
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  ingestionJobId: varchar("ingestion_job_id"), // References ingestion_jobs table
  csvHeaders: text("csv_headers").array(), // Column names from CSV header
  sampleData: jsonb("sample_data"), // First few rows for preview
  validationRules: jsonb("validation_rules"), // Applied validation rules
  // Error tracking
  errorSummary: jsonb("error_summary"), // Summary of validation/processing errors
  lastErrorMessage: text("last_error_message"),
  retryCount: integer("retry_count").default(0),
  maxRetries: integer("max_retries").default(3),
  // Timestamps
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  processingStartedAt: timestamp("processing_started_at"),
  processingCompletedAt: timestamp("processing_completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_raw_dataset_files_status").on(table.processingStatus),
  index("idx_raw_dataset_files_type").on(table.datasetType),
  index("idx_raw_dataset_files_source").on(table.source),
  index("idx_raw_dataset_files_uploaded_by").on(table.uploadedBy),
  index("idx_raw_dataset_files_checksum").on(table.checksum),
]);

// Staging Records - Temporary storage for parsed CSV rows before normalization
export const stagingRecords = pgTable("staging_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Source tracking
  datasetFileId: varchar("dataset_file_id").notNull().references(() => rawDatasetFiles.id),
  rowNumber: integer("row_number").notNull(), // Row number in original CSV
  // Raw data
  rawData: jsonb("raw_data").notNull(), // Complete row data as JSON
  dataHash: text("data_hash").notNull(), // Hash of raw data for deduplication
  // Processing status
  processingStatus: text("processing_status").default("pending"), // 'pending', 'processing', 'normalized', 'failed', 'skipped'
  normalizationAttempts: integer("normalization_attempts").default(0),
  // Identification and classification
  recordType: text("record_type"), // 'character', 'comic_issue', 'battle', 'movie', 'review'
  detectedEntityType: text("detected_entity_type"), // AI-detected entity type
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }), // 0-1 confidence in classification
  // Normalization mapping
  mappedFields: jsonb("mapped_fields"), // Field mapping from raw data to normalized schema
  extractedEntities: jsonb("extracted_entities"), // Extracted entity references
  relationshipHints: jsonb("relationship_hints"), // Potential relationships with other entities
  // Quality metrics
  dataQualityScore: decimal("data_quality_score", { precision: 3, scale: 2 }), // 0-1 quality assessment
  missingFields: text("missing_fields").array(), // Required fields that are missing
  dataInconsistencies: jsonb("data_inconsistencies"), // Detected data issues
  // Deduplication
  isDuplicate: boolean("is_duplicate").default(false),
  duplicateOf: varchar("duplicate_of").references(() => stagingRecords.id), // Reference to original record
  similarityScore: decimal("similarity_score", { precision: 3, scale: 2 }), // Similarity to potential duplicates
  // Error handling
  errorMessages: text("error_messages").array(),
  lastErrorDetails: jsonb("last_error_details"),
  // Vector embeddings for similarity detection and entity matching
  contentEmbedding: vector("content_embedding", { dimensions: 1536 }),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  normalizedAt: timestamp("normalized_at"),
}, (table) => [
  index("idx_staging_records_file_id").on(table.datasetFileId),
  index("idx_staging_records_status").on(table.processingStatus),
  index("idx_staging_records_type").on(table.recordType),
  index("idx_staging_records_hash").on(table.dataHash),
  index("idx_staging_records_duplicate").on(table.isDuplicate),
  // Unique constraint to prevent duplicate rows from same file
  index("idx_staging_records_unique").on(table.datasetFileId, table.rowNumber),
]);

// ============================================================================
// CANONICAL ENTITY EXTENSIONS - Normalized Entities and Traits
// ============================================================================

// Narrative Entities - Normalized character/comic/media entities with unique IDs
export const narrativeEntities = pgTable("narrative_entities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Core identification
  canonicalName: text("canonical_name").notNull(),
  entityType: text("entity_type").notNull(), // 'character', 'comic_series', 'comic_issue', 'movie', 'tv_show', 'creator', 'publisher', 'team', 'location', 'artifact'
  subtype: text("subtype"), // 'hero', 'villain', 'antihero', 'supporting', 'ongoing_series', 'limited_series', etc.
  universe: text("universe").notNull(), // 'marvel', 'dc', 'image', 'dark_horse', 'independent', 'crossover'
  // Identity and classification
  realName: text("real_name"), // For characters
  secretIdentity: boolean("secret_identity").default(false),
  publicIdentity: boolean("public_identity").default(false),
  isDeceased: boolean("is_deceased").default(false),
  // Physical characteristics (for characters)
  gender: text("gender"),
  species: text("species").default("human"),
  height: decimal("height", { precision: 5, scale: 2 }), // Height in cm
  weight: decimal("weight", { precision: 5, scale: 1 }), // Weight in kg
  eyeColor: text("eye_color"),
  hairColor: text("hair_color"),
  // Publication/creation details
  firstAppearance: text("first_appearance"), // Comic issue or media where entity first appeared
  firstAppearanceDate: text("first_appearance_date"), // Publication date
  creators: text("creators").array(), // Original creators
  currentCreators: text("current_creators").array(), // Current writers/artists
  // Relationship data
  teams: text("teams").array(), // Team affiliations
  allies: text("allies").array(), // Allied entity IDs
  enemies: text("enemies").array(), // Enemy entity IDs
  familyMembers: text("family_members").array(), // Family relationship entity IDs
  // Geographic and temporal context
  originLocation: text("origin_location"), // Place of origin
  currentLocation: text("current_location"), // Current location
  timelineEra: text("timeline_era"), // 'golden_age', 'silver_age', 'bronze_age', 'modern_age', 'future'
  // Publication status
  publicationStatus: text("publication_status").default("active"), // 'active', 'inactive', 'limited', 'concluded', 'cancelled'
  lastAppearance: text("last_appearance"),
  lastAppearanceDate: text("last_appearance_date"),
  // Market and trading data
  assetId: varchar("asset_id").references(() => assets.id), // Link to tradeable asset
  marketValue: decimal("market_value", { precision: 10, scale: 2 }),
  popularityScore: decimal("popularity_score", { precision: 8, scale: 2 }),
  culturalImpact: decimal("cultural_impact", { precision: 8, scale: 2 }), // 0-100 cultural significance score
  // Content and description
  biography: text("biography"), // Comprehensive character/entity background
  description: text("description"), // Brief description
  keyStorylines: text("key_storylines").array(), // Important story arcs
  notableQuotes: text("notable_quotes").array(),
  // Visual representation
  primaryImageUrl: text("primary_image_url"),
  alternateImageUrls: text("alternate_image_urls").array(),
  iconographicElements: text("iconographic_elements").array(), // Visual symbols, costume elements
  // Data quality and verification
  canonicalityScore: decimal("canonicality_score", { precision: 3, scale: 2 }).default("1.00"), // 0-1 how canonical this entity is
  dataCompleteness: decimal("data_completeness", { precision: 3, scale: 2 }), // 0-1 how complete the data is
  verificationStatus: text("verification_status").default("unverified"), // 'verified', 'unverified', 'disputed'
  verifiedBy: varchar("verified_by").references(() => users.id),
  // External references
  externalIds: jsonb("external_ids"), // IDs from other databases (wikia, imdb, etc.)
  sourceUrls: text("source_urls").array(), // Original source URLs
  wikipediaUrl: text("wikipedia_url"),
  officialWebsite: text("official_website"),
  // Vector embeddings for similarity and recommendations
  entityEmbedding: vector("entity_embedding", { dimensions: 1536 }),
  biographyEmbedding: vector("biography_embedding", { dimensions: 1536 }),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastVerifiedAt: timestamp("last_verified_at"),
}, (table) => [
  index("idx_narrative_entities_type").on(table.entityType),
  index("idx_narrative_entities_universe").on(table.universe),
  index("idx_narrative_entities_subtype").on(table.subtype),
  index("idx_narrative_entities_canonical_name").on(table.canonicalName),
  index("idx_narrative_entities_asset_id").on(table.assetId),
  index("idx_narrative_entities_popularity").on(table.popularityScore),
  index("idx_narrative_entities_verification").on(table.verificationStatus),
  // Unique constraint on canonical name + universe for entity types
  index("idx_narrative_entities_unique").on(table.canonicalName, table.universe, table.entityType),
]);

// Narrative Traits - Character powers, abilities, and attributes with quantified values
export const narrativeTraits = pgTable("narrative_traits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Entity association
  entityId: varchar("entity_id").notNull().references(() => narrativeEntities.id),
  // Trait classification
  traitCategory: text("trait_category").notNull(), // 'power', 'skill', 'equipment', 'weakness', 'personality', 'physical_attribute'
  traitType: text("trait_type").notNull(), // 'superhuman_strength', 'telepathy', 'martial_arts', 'armor', 'kryptonite_vulnerability'
  traitName: text("trait_name").notNull(), // Human-readable trait name
  // Quantification
  potencyLevel: integer("potency_level"), // 1-10 scale for power level
  masteryLevel: integer("mastery_level"), // 1-10 scale for skill mastery
  reliabilityLevel: integer("reliability_level"), // 1-10 scale for how consistently the trait manifests
  versatilityScore: decimal("versatility_score", { precision: 3, scale: 2 }), // 0-1 how versatile the trait is
  // Detailed specifications
  description: text("description").notNull(),
  limitations: text("limitations").array(), // Known limitations or restrictions
  triggers: text("triggers").array(), // What activates this trait
  duration: text("duration"), // How long the trait lasts when active
  range: text("range"), // Physical or mental range of the trait
  energyCost: text("energy_cost"), // Physical or mental cost to use
  // Contextual factors
  environmentalFactors: text("environmental_factors").array(), // Environmental conditions that affect the trait
  combatEffectiveness: decimal("combat_effectiveness", { precision: 3, scale: 2 }), // 0-1 effectiveness in combat
  utilityValue: decimal("utility_value", { precision: 3, scale: 2 }), // 0-1 usefulness outside combat
  rarityScore: decimal("rarity_score", { precision: 3, scale: 2 }), // 0-1 how rare this trait is in universe
  // Evolution and progression
  acquisitionMethod: text("acquisition_method"), // 'birth', 'mutation', 'training', 'accident', 'technology', 'magic'
  developmentStage: text("development_stage").default("stable"), // 'emerging', 'developing', 'stable', 'declining', 'lost'
  evolutionPotential: decimal("evolution_potential", { precision: 3, scale: 2 }), // 0-1 potential for growth
  // Canon and continuity
  canonicity: text("canonicity").default("main"), // 'main', 'alternate', 'what_if', 'elseworld', 'non_canon'
  continuityEra: text("continuity_era"), // When this trait was active in continuity
  retconStatus: text("retcon_status").default("current"), // 'current', 'retconned', 'disputed', 'restored'
  // Source and verification
  sourceIssues: text("source_issues").array(), // Comic issues where this trait was established/shown
  sourceMedia: text("source_media").array(), // Movies, TV shows, games where trait appeared
  verificationLevel: text("verification_level").default("unverified"), // 'verified', 'likely', 'unverified', 'disputed'
  // Market impact
  marketRelevance: decimal("market_relevance", { precision: 3, scale: 2 }), // 0-1 how much this trait affects market value
  fanAppeal: decimal("fan_appeal", { precision: 3, scale: 2 }), // 0-1 how much fans care about this trait
  // Metadata
  tags: text("tags").array(), // Searchable tags
  aliases: text("aliases").array(), // Alternative names for this trait
  relatedTraits: text("related_traits").array(), // IDs of related trait records
  // Vector embeddings for trait similarity and clustering
  traitEmbedding: vector("trait_embedding", { dimensions: 1536 }),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastVerifiedAt: timestamp("last_verified_at"),
}, (table) => [
  index("idx_narrative_traits_entity_id").on(table.entityId),
  index("idx_narrative_traits_category").on(table.traitCategory),
  index("idx_narrative_traits_type").on(table.traitType),
  index("idx_narrative_traits_potency").on(table.potencyLevel),
  index("idx_narrative_traits_mastery").on(table.masteryLevel),
  index("idx_narrative_traits_canonicity").on(table.canonicity),
  index("idx_narrative_traits_market_relevance").on(table.marketRelevance),
]);

// Entity Aliases - Handle name variations and cross-universe mappings
export const entityAliases = pgTable("entity_aliases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Entity association
  canonicalEntityId: varchar("canonical_entity_id").notNull().references(() => narrativeEntities.id),
  // Alias information
  aliasName: text("alias_name").notNull(),
  aliasType: text("alias_type").notNull(), // 'real_name', 'codename', 'nickname', 'title', 'secret_identity', 'civilian_identity', 'alternate_universe', 'translation', 'misspelling'
  // Usage context
  usageContext: text("usage_context"), // 'primary', 'secondary', 'historical', 'alternate_universe', 'fan_name', 'media_adaptation'
  universe: text("universe"), // Specific universe where this alias applies
  timeline: text("timeline"), // Timeline/era when this alias was used
  media: text("media"), // 'comics', 'movies', 'tv', 'games', 'novels'
  // Popularity and recognition
  popularityScore: decimal("popularity_score", { precision: 3, scale: 2 }), // 0-1 how well-known this alias is
  officialStatus: boolean("official_status").default(false), // Whether this is an official name
  currentlyInUse: boolean("currently_in_use").default(true), // Whether this alias is currently used
  // Linguistic and cultural data
  language: text("language").default("en"), // Language of the alias
  culturalContext: text("cultural_context"), // Cultural significance of the name
  pronunciation: text("pronunciation"), // Phonetic pronunciation guide
  etymology: text("etymology"), // Origin and meaning of the name
  // Cross-reference data
  sourceEntity: varchar("source_entity"), // Original entity this alias came from (for cross-universe variants)
  alternateUniverseId: text("alternate_universe_id"), // Earth-616, Earth-2, etc.
  characterVariation: text("character_variation"), // 'main', 'ultimate', 'noir', 'zombie', 'female', 'evil'
  // Source tracking
  sourceIssues: text("source_issues").array(), // Where this alias first appeared or was used
  sourceMedia: text("source_media").array(), // Non-comic media where alias was used
  introducedBy: text("introduced_by").array(), // Creators who introduced this alias
  firstUsageDate: text("first_usage_date"),
  lastUsageDate: text("last_usage_date"),
  // Search and matching
  searchPriority: integer("search_priority").default(0), // Priority for search results (higher = shown first)
  exactMatchWeight: decimal("exact_match_weight", { precision: 3, scale: 2 }).default("1.00"), // Weight for exact matches
  fuzzyMatchWeight: decimal("fuzzy_match_weight", { precision: 3, scale: 2 }).default("0.80"), // Weight for fuzzy matches
  // Data quality
  verificationLevel: text("verification_level").default("unverified"), // 'verified', 'likely', 'unverified', 'disputed'
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }).default("1.00"), // Confidence in this alias mapping
  qualityFlags: text("quality_flags").array(), // 'official', 'fan_created', 'disputed', 'outdated'
  // Metadata
  notes: text("notes"), // Additional information about this alias
  tags: text("tags").array(), // Searchable tags
  // Vector embeddings for name similarity and matching
  aliasEmbedding: vector("alias_embedding", { dimensions: 1536 }),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastVerifiedAt: timestamp("last_verified_at"),
}, (table) => [
  index("idx_entity_aliases_canonical_id").on(table.canonicalEntityId),
  index("idx_entity_aliases_name").on(table.aliasName),
  index("idx_entity_aliases_type").on(table.aliasType),
  index("idx_entity_aliases_usage_context").on(table.usageContext),
  index("idx_entity_aliases_universe").on(table.universe),
  index("idx_entity_aliases_popularity").on(table.popularityScore),
  index("idx_entity_aliases_official").on(table.officialStatus),
  index("idx_entity_aliases_current").on(table.currentlyInUse),
  index("idx_entity_aliases_search_priority").on(table.searchPriority),
  // Unique constraint to prevent duplicate aliases for same entity
  index("idx_entity_aliases_unique").on(table.canonicalEntityId, table.aliasName, table.universe),
]);

// ============================================================================
// RELATIONSHIP TABLES - Entity Interactions and Media Performance
// ============================================================================

// Entity Interactions - Battle outcomes, team affiliations, rivalries
export const entityInteractions = pgTable("entity_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Entity participants
  primaryEntityId: varchar("primary_entity_id").notNull().references(() => narrativeEntities.id),
  secondaryEntityId: varchar("secondary_entity_id").references(() => narrativeEntities.id), // Null for environmental or solo interactions
  // Interaction classification
  interactionType: text("interaction_type").notNull(), // 'battle', 'team_up', 'romance', 'mentorship', 'rivalry', 'family', 'alliance', 'betrayal'
  interactionSubtype: text("interaction_subtype"), // 'one_on_one', 'team_battle', 'tournament', 'war', 'temporary_team', 'long_term_team'
  relationshipType: text("relationship_type"), // 'allies', 'enemies', 'neutral', 'romantic', 'family', 'mentor_student', 'rivals'
  // Outcome and results
  outcome: text("outcome"), // 'primary_wins', 'secondary_wins', 'draw', 'mutual_victory', 'mutual_defeat', 'interrupted', 'ongoing'
  outcomeConfidence: decimal("outcome_confidence", { precision: 3, scale: 2 }), // 0-1 confidence in outcome determination
  primaryEntityResult: text("primary_entity_result"), // 'victory', 'defeat', 'draw', 'survival', 'sacrifice', 'growth'
  secondaryEntityResult: text("secondary_entity_result"),
  // Context and circumstances
  environment: text("environment"), // 'urban', 'space', 'underwater', 'mystical_realm', 'laboratory', 'school'
  timeOfDay: text("time_of_day"), // 'day', 'night', 'dawn', 'dusk'
  weatherConditions: text("weather_conditions"), // 'clear', 'storm', 'rain', 'snow', 'extreme'
  publicVisibility: text("public_visibility"), // 'public', 'secret', 'limited_witnesses', 'recorded'
  // Power dynamics and analysis
  powerDifferential: decimal("power_differential", { precision: 8, scale: 2 }), // -10 to +10 power advantage for primary entity
  strategicAdvantage: text("strategic_advantage"), // Which entity had strategic advantages
  preparationTime: text("preparation_time"), // 'none', 'minutes', 'hours', 'days', 'weeks'
  homeFieldAdvantage: text("home_field_advantage"), // 'primary', 'secondary', 'neutral'
  // Duration and intensity
  duration: integer("duration_minutes"), // Duration in minutes
  intensityLevel: integer("intensity_level"), // 1-10 scale of interaction intensity
  collateralDamage: text("collateral_damage"), // 'none', 'minimal', 'moderate', 'extensive', 'catastrophic'
  casualtyCount: integer("casualty_count"), // Number of casualties if applicable
  // Moral and ethical dimensions
  moralContext: text("moral_context"), // 'heroic', 'villainous', 'neutral', 'gray_area', 'misunderstanding'
  ethicalImplications: text("ethical_implications").array(), // Ethical issues raised by this interaction
  justification: text("justification"), // Reason for the interaction
  // Media and canonicity
  sourceIssue: text("source_issue"), // Comic issue where this happened
  sourceMedia: text("source_media"), // Movies, TV shows, games where depicted
  writerCredits: text("writer_credits").array(), // Writers who created this interaction
  artistCredits: text("artist_credits").array(), // Artists who depicted this interaction
  canonicity: text("canonicity").default("main"), // 'main', 'alternate', 'what_if', 'elseworld', 'adaptation'
  continuityEra: text("continuity_era"), // Timeline era when this occurred
  eventDate: text("event_date"), // In-universe date when this occurred
  publicationDate: text("publication_date"), // Real-world publication date
  // Consequences and aftermath
  shortTermConsequences: text("short_term_consequences").array(), // Immediate results
  longTermConsequences: text("long_term_consequences").array(), // Lasting effects
  characterDevelopment: jsonb("character_development"), // How characters changed
  relationshipChange: text("relationship_change"), // How relationship evolved
  // Market and cultural impact
  fanReaction: text("fan_reaction"), // 'positive', 'negative', 'mixed', 'controversial', 'ignored'
  culturalSignificance: decimal("cultural_significance", { precision: 3, scale: 2 }), // 0-1 cultural importance
  marketImpact: decimal("market_impact", { precision: 8, scale: 2 }), // Expected impact on asset prices
  iconicStatus: boolean("iconic_status").default(false), // Whether this is considered iconic
  // Data quality and verification
  verificationLevel: text("verification_level").default("unverified"), // 'verified', 'likely', 'unverified', 'disputed'
  dataCompleteness: decimal("data_completeness", { precision: 3, scale: 2 }), // 0-1 how complete the data is
  sourceReliability: decimal("source_reliability", { precision: 3, scale: 2 }), // 0-1 reliability of sources
  // Additional participants
  additionalParticipants: text("additional_participants").array(), // Other entity IDs involved
  teamAffiliations: text("team_affiliations").array(), // Teams involved in interaction
  // Metadata
  tags: text("tags").array(), // Searchable tags
  keywords: text("keywords").array(), // Keywords for search
  summary: text("summary"), // Brief description of the interaction
  detailedDescription: text("detailed_description"), // Full description
  // Vector embeddings for interaction similarity and clustering
  interactionEmbedding: vector("interaction_embedding", { dimensions: 1536 }),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastVerifiedAt: timestamp("last_verified_at"),
}, (table) => [
  index("idx_entity_interactions_primary").on(table.primaryEntityId),
  index("idx_entity_interactions_secondary").on(table.secondaryEntityId),
  index("idx_entity_interactions_type").on(table.interactionType),
  index("idx_entity_interactions_outcome").on(table.outcome),
  index("idx_entity_interactions_canonicity").on(table.canonicity),
  index("idx_entity_interactions_significance").on(table.culturalSignificance),
  index("idx_entity_interactions_market_impact").on(table.marketImpact),
  index("idx_entity_interactions_iconic").on(table.iconicStatus),
  index("idx_entity_interactions_publication_date").on(table.publicationDate),
]);

// Media Performance Metrics - Box office, ratings, cultural impact data
export const mediaPerformanceMetrics = pgTable("media_performance_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Media identification
  mediaTitle: text("media_title").notNull(),
  mediaType: text("media_type").notNull(), // 'movie', 'tv_series', 'tv_episode', 'animated_movie', 'animated_series', 'video_game', 'novel', 'graphic_novel'
  releaseFormat: text("release_format"), // 'theatrical', 'streaming', 'tv', 'direct_video', 'digital', 'limited_release'
  // Franchise and universe
  franchise: text("franchise").notNull(), // 'MCU', 'DCEU', 'X-Men', 'Spider-Man', 'Batman'
  universe: text("universe").notNull(), // 'marvel', 'dc', 'image', 'independent'
  continuity: text("continuity"), // 'Earth-616', 'Earth-2', 'Ultimate', 'Cinematic'
  // Featured entities
  featuredEntities: text("featured_entities").array(), // Narrative entity IDs
  mainCharacters: text("main_characters").array(), // Primary characters
  supportingCharacters: text("supporting_characters").array(), // Supporting characters
  villains: text("villains").array(), // Antagonists
  teams: text("teams").array(), // Teams featured
  // Release information
  releaseDate: text("release_date"),
  releaseYear: integer("release_year"),
  releaseQuarter: integer("release_quarter"), // 1-4
  releaseMonth: integer("release_month"), // 1-12
  releaseTerritories: text("release_territories").array(), // Countries/regions
  // Financial performance
  productionBudget: decimal("production_budget", { precision: 15, scale: 2 }),
  marketingBudget: decimal("marketing_budget", { precision: 15, scale: 2 }),
  totalBudget: decimal("total_budget", { precision: 15, scale: 2 }),
  // Box office data
  openingWeekendGross: decimal("opening_weekend_gross", { precision: 15, scale: 2 }),
  domesticGross: decimal("domestic_gross", { precision: 15, scale: 2 }),
  internationalGross: decimal("international_gross", { precision: 15, scale: 2 }),
  worldwideGross: decimal("worldwide_gross", { precision: 15, scale: 2 }),
  // Adjusted financial metrics
  inflationAdjustedBudget: decimal("inflation_adjusted_budget", { precision: 15, scale: 2 }),
  inflationAdjustedGross: decimal("inflation_adjusted_gross", { precision: 15, scale: 2 }),
  profitMargin: decimal("profit_margin", { precision: 8, scale: 2 }), // (Revenue - Cost) / Revenue * 100
  returnOnInvestment: decimal("return_on_investment", { precision: 8, scale: 2 }), // (Revenue - Cost) / Cost * 100
  // Performance ratios
  grossToBudgetRatio: decimal("gross_to_budget_ratio", { precision: 8, scale: 2 }),
  domesticPercentage: decimal("domestic_percentage", { precision: 8, scale: 2 }),
  internationalPercentage: decimal("international_percentage", { precision: 8, scale: 2 }),
  // Critical reception
  metacriticScore: integer("metacritic_score"), // 0-100
  rottenTomatoesScore: integer("rotten_tomatoes_score"), // 0-100 critics score
  rottenTomatoesAudienceScore: integer("rotten_tomatoes_audience_score"), // 0-100 audience score
  imdbRating: decimal("imdb_rating", { precision: 3, scale: 1 }), // 0-10 rating
  imdbVotes: integer("imdb_votes"), // Number of votes
  // Awards and recognition
  majorAwardsWon: text("major_awards_won").array(), // Oscar, Emmy, etc.
  majorAwardsNominated: text("major_awards_nominated").array(),
  genreAwards: text("genre_awards").array(), // Saturn Awards, etc.
  festivalAwards: text("festival_awards").array(), // Film festival awards
  // Audience metrics
  openingTheaterCount: integer("opening_theater_count"),
  maxTheaterCount: integer("max_theater_count"),
  weeksInTheaters: integer("weeks_in_theaters"),
  attendanceEstimate: integer("attendance_estimate"), // Estimated total viewers
  // Digital and streaming performance
  streamingViewership: decimal("streaming_viewership", { precision: 15, scale: 0 }), // Total streams/views
  digitalSales: decimal("digital_sales", { precision: 15, scale: 2 }), // Digital purchase revenue
  physicalMediaSales: decimal("physical_media_sales", { precision: 15, scale: 2 }), // DVD/Blu-ray sales
  merchandisingRevenue: decimal("merchandising_revenue", { precision: 15, scale: 2 }),
  // Cultural impact metrics
  socialMediaMentions: integer("social_media_mentions"), // Total social media mentions
  socialMediaSentiment: decimal("social_media_sentiment", { precision: 3, scale: 2 }), // -1 to 1
  culturalReach: decimal("cultural_reach", { precision: 8, scale: 2 }), // 0-100 cultural penetration score
  memeCulture: boolean("meme_culture").default(false), // Whether it spawned significant memes
  fanCommunitySize: integer("fan_community_size"), // Estimated fan community size
  // Demographic appeal
  primaryDemographic: text("primary_demographic"), // 'children', 'teens', 'young_adults', 'adults', 'all_ages'
  genderAppeal: text("gender_appeal"), // 'male_skewing', 'female_skewing', 'gender_neutral'
  ageRating: text("age_rating"), // 'G', 'PG', 'PG-13', 'R', 'TV-Y', 'TV-14', etc.
  // Market impact on related assets
  assetPriceImpact: jsonb("asset_price_impact"), // How this media affected related asset prices
  marketEventTrigger: boolean("market_event_trigger").default(false), // Whether this triggered a market event
  tradingVolumeIncrease: decimal("trading_volume_increase", { precision: 8, scale: 2 }), // % increase in related asset trading
  // Production details
  director: text("director").array(),
  producers: text("producers").array(),
  writers: text("writers").array(),
  studio: text("studio"),
  distributor: text("distributor"),
  productionCompanies: text("production_companies").array(),
  // Technical specifications
  runtime: integer("runtime_minutes"),
  format: text("format"), // 'live_action', 'animation', 'mixed'
  technologyUsed: text("technology_used").array(), // 'IMAX', '3D', 'CGI', 'motion_capture'
  filmingLocations: text("filming_locations").array(),
  // Sequel and franchise data
  isSequel: boolean("is_sequel").default(false),
  isReboot: boolean("is_reboot").default(false),
  isSpinoff: boolean("is_spinoff").default(false),
  franchisePosition: integer("franchise_position"), // Position in franchise chronology
  predecessorId: varchar("predecessor_id").references(() => mediaPerformanceMetrics.id),
  successorId: varchar("successor_id").references(() => mediaPerformanceMetrics.id),
  // Data quality and sources
  dataCompleteness: decimal("data_completeness", { precision: 3, scale: 2 }), // 0-1 completeness score
  sourceReliability: decimal("source_reliability", { precision: 3, scale: 2 }), // 0-1 source reliability
  dataSources: text("data_sources").array(), // Where data came from
  lastDataUpdate: timestamp("last_data_update"),
  // External references
  imdbId: text("imdb_id"),
  tmdbId: text("tmdb_id"), // The Movie Database ID
  rottenTomatoesId: text("rotten_tomatoes_id"),
  metacriticId: text("metacritic_id"),
  externalUrls: text("external_urls").array(),
  // Vector embeddings for content similarity and recommendations
  contentEmbedding: vector("content_embedding", { dimensions: 1536 }),
  performanceEmbedding: vector("performance_embedding", { dimensions: 1536 }), // Performance pattern vector
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastVerifiedAt: timestamp("last_verified_at"),
}, (table) => [
  index("idx_media_performance_media_type").on(table.mediaType),
  index("idx_media_performance_franchise").on(table.franchise),
  index("idx_media_performance_universe").on(table.universe),
  index("idx_media_performance_release_year").on(table.releaseYear),
  index("idx_media_performance_worldwide_gross").on(table.worldwideGross),
  index("idx_media_performance_roi").on(table.returnOnInvestment),
  index("idx_media_performance_critical_score").on(table.metacriticScore),
  index("idx_media_performance_cultural_reach").on(table.culturalReach),
  index("idx_media_performance_franchise_position").on(table.franchisePosition),
]);

// ============================================================================
// INGESTION CONTROL TABLES - Job Management and Error Tracking
// ============================================================================

// Ingestion Jobs - Track batch processing jobs with status and progress
export const ingestionJobs = pgTable("ingestion_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Job identification
  jobName: text("job_name").notNull(),
  jobType: text("job_type").notNull(), // 'csv_import', 'api_sync', 'manual_entry', 'bulk_update', 'data_migration'
  batchId: text("batch_id"), // Identifier for grouping related jobs
  // Job configuration
  datasetType: text("dataset_type").notNull(), // 'characters', 'comics', 'battles', 'movies', 'reviews'
  sourceType: text("source_type").notNull(), // 'csv_file', 'api', 'manual', 'database'
  processingMode: text("processing_mode").default("standard"), // 'standard', 'fast', 'thorough', 'validation_only'
  // Input specifications
  inputFiles: text("input_files").array(), // File IDs or paths
  inputParameters: jsonb("input_parameters"), // Job-specific parameters
  validationRules: jsonb("validation_rules"), // Data validation configuration
  normalizationRules: jsonb("normalization_rules"), // Data normalization configuration
  deduplicationStrategy: text("deduplication_strategy").default("strict"), // 'strict', 'fuzzy', 'merge', 'skip'
  // Processing settings
  batchSize: integer("batch_size").default(1000), // Records processed per batch
  maxRetries: integer("max_retries").default(3),
  timeoutMinutes: integer("timeout_minutes").default(60),
  priorityLevel: integer("priority_level").default(5), // 1-10 processing priority
  // Resource allocation
  maxConcurrency: integer("max_concurrency").default(1), // Max parallel workers
  memoryLimit: integer("memory_limit_mb").default(1024), // Memory limit in MB
  cpuLimit: decimal("cpu_limit", { precision: 3, scale: 2 }).default("1.00"), // CPU cores allocated
  // Status tracking
  status: text("status").default("queued"), // 'queued', 'running', 'paused', 'completed', 'failed', 'cancelled'
  progress: decimal("progress", { precision: 5, scale: 2 }).default("0.00"), // 0-100%
  currentStage: text("current_stage"), // 'validation', 'processing', 'normalization', 'storage'
  stageProgress: decimal("stage_progress", { precision: 5, scale: 2 }).default("0.00"), // Progress within current stage
  // Metrics
  totalRecords: integer("total_records").default(0),
  processedRecords: integer("processed_records").default(0),
  successfulRecords: integer("successful_records").default(0),
  failedRecords: integer("failed_records").default(0),
  skippedRecords: integer("skipped_records").default(0),
  duplicateRecords: integer("duplicate_records").default(0),
  // Performance metrics
  recordsPerSecond: decimal("records_per_second", { precision: 8, scale: 2 }),
  averageProcessingTime: decimal("average_processing_time", { precision: 8, scale: 4 }), // Seconds per record
  peakMemoryUsage: integer("peak_memory_usage_mb"),
  totalCpuTime: decimal("total_cpu_time", { precision: 10, scale: 3 }), // CPU seconds used
  // Error tracking
  errorCount: integer("error_count").default(0),
  warningCount: integer("warning_count").default(0),
  lastErrorMessage: text("last_error_message"),
  errorCategories: jsonb("error_categories"), // Categorized error counts
  errorSampleSize: integer("error_sample_size").default(10), // How many error examples to keep
  // Quality metrics
  dataQualityScore: decimal("data_quality_score", { precision: 3, scale: 2 }), // 0-1 overall quality
  deduplicationEfficiency: decimal("deduplication_efficiency", { precision: 3, scale: 2 }), // 0-1 dedup success
  normalizationAccuracy: decimal("normalization_accuracy", { precision: 3, scale: 2 }), // 0-1 normalization success
  validationPassRate: decimal("validation_pass_rate", { precision: 3, scale: 2 }), // 0-1 validation success
  // User and system info
  createdBy: varchar("created_by").references(() => users.id),
  assignedWorker: text("assigned_worker"), // Worker node or process handling the job
  environmentInfo: jsonb("environment_info"), // System info where job runs
  // Dependencies
  dependsOnJobs: text("depends_on_jobs").array(), // Job IDs this job depends on
  prerequisiteConditions: jsonb("prerequisite_conditions"), // Conditions that must be met
  // Output specifications
  outputFormat: text("output_format").default("database"), // 'database', 'csv', 'json', 'api'
  outputLocation: text("output_location"), // Where results are stored
  retentionPolicy: text("retention_policy").default("standard"), // 'temporary', 'standard', 'long_term', 'permanent'
  // Notifications
  notificationSettings: jsonb("notification_settings"), // When and how to notify
  notificationsSent: text("notifications_sent").array(), // Track sent notifications
  // Metadata
  description: text("description"),
  tags: text("tags").array(),
  metadata: jsonb("metadata"), // Additional job-specific data
  configurationSnapshot: jsonb("configuration_snapshot"), // System config at time of job creation
  // Timestamps
  queuedAt: timestamp("queued_at").defaultNow(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  lastHeartbeat: timestamp("last_heartbeat"), // Last activity from processing worker
  estimatedCompletionTime: timestamp("estimated_completion_time"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_ingestion_jobs_status").on(table.status),
  index("idx_ingestion_jobs_type").on(table.jobType),
  index("idx_ingestion_jobs_dataset_type").on(table.datasetType),
  index("idx_ingestion_jobs_batch_id").on(table.batchId),
  index("idx_ingestion_jobs_priority").on(table.priorityLevel),
  index("idx_ingestion_jobs_created_by").on(table.createdBy),
  index("idx_ingestion_jobs_queued_at").on(table.queuedAt),
  index("idx_ingestion_jobs_started_at").on(table.startedAt),
  index("idx_ingestion_jobs_progress").on(table.progress),
  index("idx_ingestion_jobs_last_heartbeat").on(table.lastHeartbeat),
]);

// Ingestion Runs - Individual execution records with timestamps and results
export const ingestionRuns = pgTable("ingestion_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Job association
  jobId: varchar("job_id").notNull().references(() => ingestionJobs.id),
  runNumber: integer("run_number").notNull(), // Sequential run number for this job
  // Run identification
  runType: text("run_type").default("standard"), // 'standard', 'retry', 'partial', 'recovery', 'test'
  triggeredBy: text("triggered_by").default("system"), // 'system', 'user', 'scheduler', 'api', 'webhook'
  triggerUserId: varchar("trigger_user_id").references(() => users.id),
  parentRunId: varchar("parent_run_id").references(() => ingestionRuns.id), // For retry runs
  // Execution environment
  workerId: text("worker_id"), // Unique identifier of processing worker
  workerHost: text("worker_host"), // Hostname of processing machine
  workerVersion: text("worker_version"), // Version of processing software
  processId: integer("process_id"), // OS process ID
  threadId: text("thread_id"), // Thread identifier if multithreaded
  // Resource usage
  allocatedMemoryMb: integer("allocated_memory_mb"),
  peakMemoryUsageMb: integer("peak_memory_usage_mb"),
  averageMemoryUsageMb: integer("average_memory_usage_mb"),
  allocatedCpuCores: decimal("allocated_cpu_cores", { precision: 3, scale: 2 }),
  totalCpuTime: decimal("total_cpu_time", { precision: 10, scale: 3 }), // CPU seconds
  wallClockTime: decimal("wall_clock_time", { precision: 10, scale: 3 }), // Elapsed seconds
  diskSpaceUsedMb: integer("disk_space_used_mb"),
  networkBytesTransferred: bigint("network_bytes_transferred", { mode: "bigint" }),
  // Processing scope
  recordsInScope: integer("records_in_scope"), // Total records this run should process
  startingOffset: integer("starting_offset").default(0), // Starting position in dataset
  endingOffset: integer("ending_offset"), // Ending position in dataset
  batchSize: integer("batch_size"), // Records per batch
  batchesProcessed: integer("batches_processed").default(0),
  // Processing results
  recordsProcessed: integer("records_processed").default(0),
  recordsSuccessful: integer("records_successful").default(0),
  recordsFailed: integer("records_failed").default(0),
  recordsSkipped: integer("records_skipped").default(0),
  recordsDuplicate: integer("records_duplicate").default(0),
  entitiesCreated: integer("entities_created").default(0),
  entitiesUpdated: integer("entities_updated").default(0),
  entitiesMerged: integer("entities_merged").default(0),
  aliasesCreated: integer("aliases_created").default(0),
  traitsCreated: integer("traits_created").default(0),
  interactionsCreated: integer("interactions_created").default(0),
  // Performance metrics
  recordsPerSecond: decimal("records_per_second", { precision: 8, scale: 2 }),
  averageRecordProcessingTime: decimal("average_record_processing_time", { precision: 8, scale: 4 }), // Seconds
  minRecordProcessingTime: decimal("min_record_processing_time", { precision: 8, scale: 4 }),
  maxRecordProcessingTime: decimal("max_record_processing_time", { precision: 8, scale: 4 }),
  throughputMbPerSecond: decimal("throughput_mb_per_second", { precision: 8, scale: 2 }),
  // Error and warning summary
  errorCount: integer("error_count").default(0),
  warningCount: integer("warning_count").default(0),
  criticalErrorCount: integer("critical_error_count").default(0),
  errorRate: decimal("error_rate", { precision: 8, scale: 4 }), // Errors per record
  primaryErrorType: text("primary_error_type"), // Most common error type
  primaryErrorMessage: text("primary_error_message"), // Most common error message
  // Status and completion
  status: text("status").default("running"), // 'running', 'completed', 'failed', 'interrupted', 'killed'
  exitCode: integer("exit_code"), // Process exit code
  exitReason: text("exit_reason"), // Human readable exit reason
  wasInterrupted: boolean("was_interrupted").default(false),
  wasRetried: boolean("was_retried").default(false),
  retryCount: integer("retry_count").default(0),
  // Quality assessment
  dataQualityScore: decimal("data_quality_score", { precision: 3, scale: 2 }), // 0-1 overall quality
  successRate: decimal("success_rate", { precision: 8, scale: 4 }), // Successful records / total records
  deduplicationAccuracy: decimal("deduplication_accuracy", { precision: 3, scale: 2 }),
  normalizationAccuracy: decimal("normalization_accuracy", { precision: 3, scale: 2 }),
  // Configuration snapshot
  configurationUsed: jsonb("configuration_used"), // Configuration at time of run
  parametersUsed: jsonb("parameters_used"), // Parameters passed to this run
  environmentVariables: jsonb("environment_variables"), // Relevant env vars
  // Checkpointing and recovery
  lastCheckpoint: jsonb("last_checkpoint"), // State for recovery
  checkpointInterval: integer("checkpoint_interval_records").default(1000),
  checkpointsCreated: integer("checkpoints_created").default(0),
  recoveredFromCheckpoint: boolean("recovered_from_checkpoint").default(false),
  recoveryCheckpointId: text("recovery_checkpoint_id"),
  // Output and artifacts
  outputSummary: jsonb("output_summary"), // Summary of what was produced
  logFileLocation: text("log_file_location"), // Where detailed logs are stored
  artifactLocations: text("artifact_locations").array(), // Generated files, reports, etc.
  // Notifications and reporting
  notificationsSent: text("notifications_sent").array(),
  reportsGenerated: text("reports_generated").array(),
  // Timestamps
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  lastHeartbeat: timestamp("last_heartbeat"),
  lastCheckpointAt: timestamp("last_checkpoint_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_ingestion_runs_job_id").on(table.jobId),
  index("idx_ingestion_runs_run_number").on(table.runNumber),
  index("idx_ingestion_runs_status").on(table.status),
  index("idx_ingestion_runs_started_at").on(table.startedAt),
  index("idx_ingestion_runs_worker_id").on(table.workerId),
  index("idx_ingestion_runs_success_rate").on(table.successRate),
  index("idx_ingestion_runs_records_per_second").on(table.recordsPerSecond),
  index("idx_ingestion_runs_error_count").on(table.errorCount),
  index("idx_ingestion_runs_parent_run").on(table.parentRunId),
  // Unique constraint to prevent duplicate run numbers for same job
  index("idx_ingestion_runs_unique").on(table.jobId, table.runNumber),
]);

// Ingestion Errors - Error tracking for failed records with retry logic
export const ingestionErrors = pgTable("ingestion_errors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Association with jobs and runs
  jobId: varchar("job_id").notNull().references(() => ingestionJobs.id),
  runId: varchar("run_id").references(() => ingestionRuns.id),
  stagingRecordId: varchar("staging_record_id").references(() => stagingRecords.id),
  // Error identification
  errorCode: text("error_code"), // Standardized error code
  errorType: text("error_type").notNull(), // 'validation', 'processing', 'database', 'network', 'format', 'business_logic'
  errorCategory: text("error_category").notNull(), // 'critical', 'major', 'minor', 'warning', 'info'
  errorSeverity: integer("error_severity").notNull(), // 1-10 severity scale
  // Error details
  errorMessage: text("error_message").notNull(),
  detailedDescription: text("detailed_description"),
  technicalDetails: jsonb("technical_details"), // Stack traces, debug info
  errorContext: jsonb("error_context"), // Context where error occurred
  // Record information
  recordData: jsonb("record_data"), // The problematic record data
  recordIdentifier: text("record_identifier"), // Unique identifier for the record
  recordLineNumber: integer("record_line_number"), // Line in source file
  recordHash: text("record_hash"), // Hash of record for deduplication
  fieldName: text("field_name"), // Specific field that caused error
  fieldValue: text("field_value"), // Value that caused error
  expectedFormat: text("expected_format"), // What format was expected
  actualFormat: text("actual_format"), // What format was received
  // Processing stage information
  processingStage: text("processing_stage"), // 'parsing', 'validation', 'normalization', 'entity_creation', 'relationship_mapping'
  processingStep: text("processing_step"), // Specific step within stage
  validationRule: text("validation_rule"), // Which validation rule failed
  transformationRule: text("transformation_rule"), // Which transformation failed
  // Error resolution
  isResolvable: boolean("is_resolvable").default(true), // Whether this error can be fixed
  resolutionStrategy: text("resolution_strategy"), // 'retry', 'skip', 'manual_fix', 'rule_update', 'data_correction'
  suggestedFix: text("suggested_fix"), // Suggested resolution
  automatedFixAttempted: boolean("automated_fix_attempted").default(false),
  automatedFixSucceeded: boolean("automated_fix_succeeded").default(false),
  manualReviewRequired: boolean("manual_review_required").default(false),
  // Retry logic
  retryable: boolean("retryable").default(true),
  retryCount: integer("retry_count").default(0),
  maxRetries: integer("max_retries").default(3),
  nextRetryAt: timestamp("next_retry_at"),
  retryBackoffMultiplier: decimal("retry_backoff_multiplier", { precision: 3, scale: 2 }).default("2.00"),
  lastRetryAt: timestamp("last_retry_at"),
  retryHistory: jsonb("retry_history"), // History of retry attempts
  // Resolution tracking
  status: text("status").default("unresolved"), // 'unresolved', 'investigating', 'fixing', 'resolved', 'ignored', 'escalated'
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by").references(() => users.id),
  resolutionMethod: text("resolution_method"), // How the error was resolved
  resolutionNotes: text("resolution_notes"),
  resolutionChanges: jsonb("resolution_changes"), // What changes were made to resolve
  // Impact assessment
  impactLevel: text("impact_level"), // 'none', 'low', 'medium', 'high', 'critical'
  affectedEntities: text("affected_entities").array(), // Entity IDs that might be affected
  downstreamImpact: text("downstream_impact"), // Description of downstream effects
  businessImpact: text("business_impact"), // Business consequences
  // Pattern recognition
  errorPattern: text("error_pattern"), // Pattern this error fits
  isKnownIssue: boolean("is_known_issue").default(false),
  knowledgeBaseArticle: text("knowledge_base_article"), // Link to KB article
  relatedErrors: text("related_errors").array(), // IDs of related error records
  // Notification and escalation
  notificationsSent: text("notifications_sent").array(),
  escalationLevel: integer("escalation_level").default(0), // 0=none, 1=team_lead, 2=manager, 3=director
  escalatedAt: timestamp("escalated_at"),
  escalatedTo: varchar("escalated_to").references(() => users.id),
  alertsTriggered: text("alerts_triggered").array(),
  // Analytics and reporting
  errorFrequency: decimal("error_frequency", { precision: 8, scale: 4 }), // How often this error occurs
  firstOccurrence: timestamp("first_occurrence"),
  lastOccurrence: timestamp("last_occurrence"),
  occurrenceCount: integer("occurrence_count").default(1),
  trendDirection: text("trend_direction"), // 'increasing', 'decreasing', 'stable'
  // Metadata
  tags: text("tags").array(),
  customProperties: jsonb("custom_properties"), // Extensible properties
  attachments: text("attachments").array(), // File attachments with error details
  // System information
  systemInfo: jsonb("system_info"), // System state when error occurred
  environmentInfo: jsonb("environment_info"), // Environment details
  configurationInfo: jsonb("configuration_info"), // Configuration at time of error
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  acknowledgedAt: timestamp("acknowledged_at"),
}, (table) => [
  index("idx_ingestion_errors_job_id").on(table.jobId),
  index("idx_ingestion_errors_run_id").on(table.runId),
  index("idx_ingestion_errors_staging_record").on(table.stagingRecordId),
  index("idx_ingestion_errors_type").on(table.errorType),
  index("idx_ingestion_errors_category").on(table.errorCategory),
  index("idx_ingestion_errors_severity").on(table.errorSeverity),
  index("idx_ingestion_errors_status").on(table.status),
  index("idx_ingestion_errors_retryable").on(table.retryable),
  index("idx_ingestion_errors_next_retry").on(table.nextRetryAt),
  index("idx_ingestion_errors_resolved_at").on(table.resolvedAt),
  index("idx_ingestion_errors_escalation_level").on(table.escalationLevel),
  index("idx_ingestion_errors_impact_level").on(table.impactLevel),
  index("idx_ingestion_errors_occurrence_count").on(table.occurrenceCount),
  index("idx_ingestion_errors_record_hash").on(table.recordHash),
]);

// ============================================================================
// VISUAL STORYTELLING TABLES - Narrative Timelines and Story Beats
// ============================================================================

// Narrative Timelines - Story arcs and events tied to trading houses
export const narrativeTimelines = pgTable("narrative_timelines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Timeline identification
  timelineName: text("timeline_name").notNull(),
  timelineType: text("timeline_type").notNull(), // 'character_arc', 'team_story', 'event_series', 'crossover', 'universe_history'
  scope: text("scope").notNull(), // 'character', 'team', 'universe', 'multiverse', 'crossover'
  universe: text("universe").notNull(), // 'marvel', 'dc', 'image', 'crossover'
  continuity: text("continuity"), // 'main', 'ultimate', 'earth_2', 'elseworld'
  // Timeline structure
  startDate: text("start_date"), // In-universe start date
  endDate: text("end_date"), // In-universe end date (null for ongoing)
  timelineStatus: text("timeline_status").default("active"), // 'active', 'completed', 'retconned', 'alternate'
  timelineEra: text("timeline_era"), // 'golden_age', 'silver_age', 'bronze_age', 'modern_age'
  chronologicalOrder: integer("chronological_order"), // Order relative to other timelines
  // Core participants
  primaryEntities: text("primary_entities").array(), // Main narrative entity IDs
  secondaryEntities: text("secondary_entities").array(), // Supporting entity IDs
  featuredTeams: text("featured_teams").array(), // Teams involved
  majorVillains: text("major_villains").array(), // Primary antagonists
  keyCreators: text("key_creators").array(), // Writers and artists who shaped this timeline
  // Trading house associations
  associatedHouses: text("associated_houses").array(), // 'heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit'
  primaryHouse: text("primary_house"), // Main house this timeline appeals to
  houseRelevanceScore: decimal("house_relevance_score", { precision: 3, scale: 2 }), // 0-1 relevance to houses
  tradingEducationValue: decimal("trading_education_value", { precision: 3, scale: 2 }), // 0-1 educational value for traders
  // Market impact potential
  marketInfluence: decimal("market_influence", { precision: 3, scale: 2 }), // 0-1 potential to affect asset prices
  volatilityPotential: decimal("volatility_potential", { precision: 3, scale: 2 }), // 0-1 potential to create price volatility
  speculativeValue: decimal("speculative_value", { precision: 3, scale: 2 }), // 0-1 value for speculation
  longTermImpact: decimal("long_term_impact", { precision: 3, scale: 2 }), // 0-1 lasting effect on character values
  // Narrative structure
  totalStoryBeats: integer("total_story_beats").default(0),
  completedStoryBeats: integer("completed_story_beats").default(0),
  criticalStoryBeats: integer("critical_story_beats").default(0), // How many beats are market-critical
  plotComplexity: decimal("plot_complexity", { precision: 3, scale: 2 }), // 0-1 complexity score
  characterDevelopmentDepth: decimal("character_development_depth", { precision: 3, scale: 2 }), // 0-1 development depth
  // Themes and motifs
  primaryThemes: text("primary_themes").array(), // 'redemption', 'power_corruption', 'sacrifice', 'identity'
  moralAlignment: text("moral_alignment"), // 'heroic', 'dark', 'gray', 'villainous', 'neutral'
  emotionalTone: text("emotional_tone"), // 'hopeful', 'tragic', 'action', 'mystery', 'horror', 'comedy'
  narrativeGenre: text("narrative_genre").array(), // 'superhero', 'sci_fi', 'fantasy', 'mystery', 'horror'
  // Cultural and social context
  culturalSignificance: decimal("cultural_significance", { precision: 3, scale: 2 }), // 0-1 cultural importance
  socialCommentary: text("social_commentary").array(), // Social issues addressed
  historicalContext: text("historical_context"), // Real-world events that influenced this timeline
  // Publication information
  firstPublicationDate: text("first_publication_date"),
  lastPublicationDate: text("last_publication_date"),
  publicationStatus: text("publication_status").default("ongoing"), // 'ongoing', 'completed', 'cancelled', 'hiatus'
  publishedIssueCount: integer("published_issue_count").default(0),
  plannedIssueCount: integer("planned_issue_count"),
  // Media adaptations
  adaptedToMedia: text("adapted_to_media").array(), // 'movies', 'tv', 'games', 'novels'
  adaptationQuality: decimal("adaptation_quality", { precision: 3, scale: 2 }), // 0-1 quality of adaptations
  adaptationFidelity: decimal("adaptation_fidelity", { precision: 3, scale: 2 }), // 0-1 faithfulness to source
  crossMediaImpact: decimal("cross_media_impact", { precision: 3, scale: 2 }), // 0-1 impact on other media
  // Fan engagement and community
  fanEngagementLevel: decimal("fan_engagement_level", { precision: 3, scale: 2 }), // 0-1 fan community engagement
  controversyLevel: decimal("controversy_level", { precision: 3, scale: 2 }), // 0-1 how controversial the timeline is
  criticalReception: decimal("critical_reception", { precision: 3, scale: 2 }), // 0-1 critical acclaim
  commercialSuccess: decimal("commercial_success", { precision: 3, scale: 2 }), // 0-1 commercial performance
  // Educational and analytical value
  characterStudyValue: decimal("character_study_value", { precision: 3, scale: 2 }), // 0-1 value for character analysis
  plotAnalysisValue: decimal("plot_analysis_value", { precision: 3, scale: 2 }), // 0-1 value for plot analysis
  thematicDepth: decimal("thematic_depth", { precision: 3, scale: 2 }), // 0-1 thematic complexity
  marketLessonValue: decimal("market_lesson_value", { precision: 3, scale: 2 }), // 0-1 value for trading education
  // Metadata and relationships
  parentTimelines: text("parent_timelines").array(), // Timeline IDs this derives from
  childTimelines: text("child_timelines").array(), // Timeline IDs that derive from this
  crossoverTimelines: text("crossover_timelines").array(), // Timelines this crosses over with
  relatedAssets: text("related_assets").array(), // Asset IDs affected by this timeline
  // Content description
  synopsis: text("synopsis"), // Brief summary
  detailedDescription: text("detailed_description"), // Comprehensive description
  keyPlotPoints: text("key_plot_points").array(), // Major plot developments
  characterArcs: jsonb("character_arcs"), // Character development summaries
  thematicAnalysis: text("thematic_analysis"), // Analysis of themes and meanings
  // Visual and multimedia
  keyImageUrls: text("key_image_urls").array(), // Important visual moments
  iconicPanels: text("iconic_panels").array(), // URLs to iconic comic panels
  coverGallery: text("cover_gallery").array(), // Cover images from this timeline
  videoContent: text("video_content").array(), // Related video content
  // Data quality and curation
  curationStatus: text("curation_status").default("draft"), // 'draft', 'review', 'approved', 'featured'
  curatedBy: varchar("curated_by").references(() => users.id),
  qualityScore: decimal("quality_score", { precision: 3, scale: 2 }), // 0-1 overall quality assessment
  completenessScore: decimal("completeness_score", { precision: 3, scale: 2 }), // 0-1 data completeness
  accuracyScore: decimal("accuracy_score", { precision: 3, scale: 2 }), // 0-1 factual accuracy
  // Vector embeddings for timeline similarity and recommendations
  timelineEmbedding: vector("timeline_embedding", { dimensions: 1536 }),
  themeEmbedding: vector("theme_embedding", { dimensions: 1536 }), // Thematic content vector
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  curatedAt: timestamp("curated_at"),
  lastReviewedAt: timestamp("last_reviewed_at"),
}, (table) => [
  index("idx_narrative_timelines_type").on(table.timelineType),
  index("idx_narrative_timelines_universe").on(table.universe),
  index("idx_narrative_timelines_status").on(table.timelineStatus),
  index("idx_narrative_timelines_primary_house").on(table.primaryHouse),
  index("idx_narrative_timelines_market_influence").on(table.marketInfluence),
  index("idx_narrative_timelines_cultural_significance").on(table.culturalSignificance),
  index("idx_narrative_timelines_curation_status").on(table.curationStatus),
  index("idx_narrative_timelines_quality_score").on(table.qualityScore),
  index("idx_narrative_timelines_chronological_order").on(table.chronologicalOrder),
]);

// Story Beats - Key narrative moments that affect market sentiment
export const storyBeats = pgTable("story_beats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Timeline association
  timelineId: varchar("timeline_id").notNull().references(() => narrativeTimelines.id),
  // Beat identification
  beatTitle: text("beat_title").notNull(),
  beatType: text("beat_type").notNull(), // 'introduction', 'inciting_incident', 'rising_action', 'climax', 'falling_action', 'resolution', 'plot_twist', 'character_death', 'power_revelation'
  beatCategory: text("beat_category").notNull(), // 'character_moment', 'action_sequence', 'emotional_moment', 'revelation', 'confrontation', 'transformation', 'sacrifice'
  narrativeFunction: text("narrative_function"), // 'exposition', 'conflict', 'development', 'payoff', 'setup', 'callback'
  // Position and timing
  chronologicalOrder: integer("chronological_order").notNull(), // Order within timeline
  relativePosition: decimal("relative_position", { precision: 5, scale: 4 }), // 0-1 position in timeline (0=start, 1=end)
  storyAct: integer("story_act"), // 1, 2, 3, etc. (traditional story structure)
  // Publication details
  sourceIssue: text("source_issue"), // Comic issue where this beat occurs
  sourceMedia: text("source_media"), // Movie, TV episode, etc.
  pageNumber: integer("page_number"), // Page within issue
  panelNumber: integer("panel_number"), // Panel within page
  publicationDate: text("publication_date"),
  writerCredits: text("writer_credits").array(),
  artistCredits: text("artist_credits").array(),
  // Participants and entities
  primaryEntities: text("primary_entities").array(), // Main entities involved in this beat
  secondaryEntities: text("secondary_entities").array(), // Supporting entities
  entityRoles: jsonb("entity_roles"), // Specific roles each entity plays in this beat
  relationships: jsonb("relationships"), // Relationships formed, broken, or changed
  // Market impact assessment
  marketRelevance: decimal("market_relevance", { precision: 3, scale: 2 }), // 0-1 relevance to trading
  priceImpactPotential: decimal("price_impact_potential", { precision: 3, scale: 2 }), // 0-1 potential to affect prices
  volatilityTrigger: boolean("volatility_trigger").default(false), // Whether this creates market volatility
  speculationOpportunity: decimal("speculation_opportunity", { precision: 3, scale: 2 }), // 0-1 speculation potential
  longTermValueImpact: decimal("long_term_value_impact", { precision: 3, scale: 2 }), // 0-1 lasting effect on values
  affectedAssets: text("affected_assets").array(), // Asset IDs likely to be impacted
  expectedPriceDirection: text("expected_price_direction"), // 'positive', 'negative', 'volatile', 'neutral'
  impactMagnitude: decimal("impact_magnitude", { precision: 3, scale: 2 }), // 0-1 expected magnitude of impact
  // Trading house relevance
  houseResonance: jsonb("house_resonance"), // How much each house cares about this beat
  primaryHouse: text("primary_house"), // House most interested in this beat
  educationalValue: decimal("educational_value", { precision: 3, scale: 2 }), // 0-1 teaching value for traders
  strategicInsight: text("strategic_insight"), // Trading insight this beat provides
  // Emotional and thematic content
  emotionalTone: text("emotional_tone"), // 'triumph', 'tragedy', 'suspense', 'horror', 'comedy', 'wonder'
  emotionalIntensity: decimal("emotional_intensity", { precision: 3, scale: 2 }), // 0-1 emotional impact
  thematicSignificance: text("thematic_significance").array(), // Themes this beat reinforces
  symbolism: text("symbolism").array(), // Symbolic elements present
  archetypes: text("archetypes").array(), // Character archetypes involved
  // Character development impact
  characterGrowth: jsonb("character_growth"), // How characters change in this beat
  powerChanges: jsonb("power_changes"), // Power gains, losses, or revelations
  relationshipChanges: jsonb("relationship_changes"), // Relationship developments
  statusChanges: jsonb("status_changes"), // Status quo changes
  // Plot significance
  plotSignificance: decimal("plot_significance", { precision: 3, scale: 2 }), // 0-1 importance to overall plot
  isClimax: boolean("is_climax").default(false), // Whether this is a climactic moment
  isTurningPoint: boolean("is_turning_point").default(false), // Whether this changes everything
  setsUpFuture: boolean("sets_up_future").default(false), // Whether this sets up future beats
  paysOffSetup: boolean("pays_off_setup").default(false), // Whether this pays off previous setup
  callbacks: text("callbacks").array(), // Previous beat IDs this references
  setupForBeats: text("setup_for_beats").array(), // Future beat IDs this sets up
  // Cultural and fan impact
  iconicStatus: boolean("iconic_status").default(false), // Whether this is considered iconic
  memesGenerated: boolean("memes_generated").default(false), // Whether this spawned memes
  fanReaction: text("fan_reaction"), // 'loved', 'hated', 'controversial', 'mixed', 'ignored'
  criticalReception: text("critical_reception"), // Critical response to this beat
  culturalReference: boolean("cultural_reference").default(false), // Whether this became a cultural reference
  // Content description
  summary: text("summary").notNull(), // Brief description of what happens
  detailedDescription: text("detailed_description"), // Comprehensive description
  dialogue: text("dialogue").array(), // Key dialogue from this beat
  visualDescription: text("visual_description"), // Description of visual elements
  actionSequence: text("action_sequence"), // Description of action if applicable
  // Stakes and consequences
  stakesLevel: text("stakes_level"), // 'personal', 'local', 'global', 'universal', 'multiversal'
  consequences: text("consequences").array(), // Immediate consequences of this beat
  permanentChanges: text("permanent_changes").array(), // Permanent changes made
  reversibleChanges: text("reversible_changes").array(), // Changes that could be undone
  // Visual and multimedia references
  imageUrls: text("image_urls").array(), // Images of this story beat
  panelImages: text("panel_images").array(), // Specific comic panels
  videoClips: text("video_clips").array(), // Video adaptations of this beat
  audioReferences: text("audio_references").array(), // Audio drama or podcast references
  // Quality and curation
  beatQuality: decimal("beat_quality", { precision: 3, scale: 2 }), // 0-1 quality assessment
  narrativeImportance: decimal("narrative_importance", { precision: 3, scale: 2 }), // 0-1 importance to story
  executionQuality: decimal("execution_quality", { precision: 3, scale: 2 }), // 0-1 how well it was executed
  originalityScore: decimal("originality_score", { precision: 3, scale: 2 }), // 0-1 how original this beat is
  // Metadata
  tags: text("tags").array(), // Searchable tags
  keywords: text("keywords").array(), // Keywords for discovery
  spoilerLevel: text("spoiler_level").default("minor"), // 'none', 'minor', 'major', 'critical'
  contentWarnings: text("content_warnings").array(), // Content warnings if applicable
  // Vector embeddings for beat similarity and clustering
  beatEmbedding: vector("beat_embedding", { dimensions: 1536 }),
  dialogueEmbedding: vector("dialogue_embedding", { dimensions: 1536 }), // Vector for dialogue content
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  curatedAt: timestamp("curated_at"),
}, (table) => [
  index("idx_story_beats_timeline_id").on(table.timelineId),
  index("idx_story_beats_chronological_order").on(table.chronologicalOrder),
  index("idx_story_beats_type").on(table.beatType),
  index("idx_story_beats_category").on(table.beatCategory),
  index("idx_story_beats_market_relevance").on(table.marketRelevance),
  index("idx_story_beats_price_impact").on(table.priceImpactPotential),
  index("idx_story_beats_volatility_trigger").on(table.volatilityTrigger),
  index("idx_story_beats_primary_house").on(table.primaryHouse),
  index("idx_story_beats_plot_significance").on(table.plotSignificance),
  index("idx_story_beats_iconic_status").on(table.iconicStatus),
  index("idx_story_beats_relative_position").on(table.relativePosition),
  // Unique constraint to prevent duplicate beats at same position in timeline
  index("idx_story_beats_unique_position").on(table.timelineId, table.chronologicalOrder),
]);

// ============================================================================
// PHASE 2: INSERT SCHEMAS AND TYPESCRIPT TYPES
// ============================================================================

// Insert schemas for Phase 2 Staging Tables
export const insertRawDatasetFileSchema = createInsertSchema(rawDatasetFiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  uploadedAt: true,
  processingStartedAt: true,
  processingCompletedAt: true,
});

export const insertStagingRecordSchema = createInsertSchema(stagingRecords).omit({
  id: true,
  createdAt: true,
  processedAt: true,
  normalizedAt: true,
});

// Insert schemas for Phase 2 Canonical Entity Extensions
export const insertNarrativeEntitySchema = createInsertSchema(narrativeEntities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastVerifiedAt: true,
});

export const insertNarrativeTraitSchema = createInsertSchema(narrativeTraits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastVerifiedAt: true,
});

export const insertEntityAliasSchema = createInsertSchema(entityAliases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastVerifiedAt: true,
});

// Insert schemas for Phase 2 Relationship Tables
export const insertEntityInteractionSchema = createInsertSchema(entityInteractions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastVerifiedAt: true,
});

export const insertMediaPerformanceMetricSchema = createInsertSchema(mediaPerformanceMetrics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastVerifiedAt: true,
  lastDataUpdate: true,
});

// Insert schemas for Phase 2 Ingestion Control Tables
export const insertIngestionJobSchema = createInsertSchema(ingestionJobs).omit({
  id: true,
  queuedAt: true,
  startedAt: true,
  completedAt: true,
  lastHeartbeat: true,
  estimatedCompletionTime: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIngestionRunSchema = createInsertSchema(ingestionRuns).omit({
  id: true,
  startedAt: true,
  completedAt: true,
  lastHeartbeat: true,
  lastCheckpointAt: true,
  createdAt: true,
});

export const insertIngestionErrorSchema = createInsertSchema(ingestionErrors).omit({
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
export const insertNarrativeTimelineSchema = createInsertSchema(narrativeTimelines).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  curatedAt: true,
  lastReviewedAt: true,
});

export const insertStoryBeatSchema = createInsertSchema(storyBeats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  curatedAt: true,
});

// Export TypeScript types for Phase 2 Staging Tables
export type RawDatasetFile = typeof rawDatasetFiles.$inferSelect;
export type InsertRawDatasetFile = z.infer<typeof insertRawDatasetFileSchema>;

export type StagingRecord = typeof stagingRecords.$inferSelect;
export type InsertStagingRecord = z.infer<typeof insertStagingRecordSchema>;

// Export TypeScript types for Phase 2 Canonical Entity Extensions
export type NarrativeEntity = typeof narrativeEntities.$inferSelect;
export type InsertNarrativeEntity = z.infer<typeof insertNarrativeEntitySchema>;

export type NarrativeTrait = typeof narrativeTraits.$inferSelect;
export type InsertNarrativeTrait = z.infer<typeof insertNarrativeTraitSchema>;

export type EntityAlias = typeof entityAliases.$inferSelect;
export type InsertEntityAlias = z.infer<typeof insertEntityAliasSchema>;

// Export TypeScript types for Phase 2 Relationship Tables
export type EntityInteraction = typeof entityInteractions.$inferSelect;
export type InsertEntityInteraction = z.infer<typeof insertEntityInteractionSchema>;

export type MediaPerformanceMetric = typeof mediaPerformanceMetrics.$inferSelect;
export type InsertMediaPerformanceMetric = z.infer<typeof insertMediaPerformanceMetricSchema>;

// Export TypeScript types for Phase 2 Ingestion Control Tables
export type IngestionJob = typeof ingestionJobs.$inferSelect;
export type InsertIngestionJob = z.infer<typeof insertIngestionJobSchema>;

export type IngestionRun = typeof ingestionRuns.$inferSelect;
export type InsertIngestionRun = z.infer<typeof insertIngestionRunSchema>;

export type IngestionError = typeof ingestionErrors.$inferSelect;
export type InsertIngestionError = z.infer<typeof insertIngestionErrorSchema>;

// ========================================================================================
// PHASE 2: NARRATIVE TRADING METRICS INTEGRATION TABLES
// ========================================================================================

// Narrative Trading Metrics - Core metrics connecting story data to financial behavior
export const narrativeTradingMetrics = pgTable("narrative_trading_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  
  // Mythic Volatility Metrics
  mythicVolatilityScore: decimal("mythic_volatility_score", { precision: 8, scale: 4 }).notNull(), // 0.0001 to 10.0000
  baseVolatility: decimal("base_volatility", { precision: 8, scale: 4 }).default("0.0250"), // Base daily volatility
  storyArcVolatilityMultiplier: decimal("story_arc_volatility_multiplier", { precision: 8, scale: 4 }).default("1.0000"),
  powerLevelVolatilityFactor: decimal("power_level_volatility_factor", { precision: 8, scale: 4 }).default("1.0000"),
  cosmicEventVolatilityBoost: decimal("cosmic_event_volatility_boost", { precision: 8, scale: 4 }).default("0.0000"),
  
  // Narrative Momentum Tracking
  narrativeMomentumScore: decimal("narrative_momentum_score", { precision: 8, scale: 4 }).notNull(), // -5.0000 to 5.0000
  culturalImpactIndex: decimal("cultural_impact_index", { precision: 8, scale: 4 }).default("1.0000"),
  storyProgressionRate: decimal("story_progression_rate", { precision: 8, scale: 4 }).default("0.0000"),
  themeRelevanceScore: decimal("theme_relevance_score", { precision: 8, scale: 4 }).default("1.0000"),
  mediaBoostFactor: decimal("media_boost_factor", { precision: 8, scale: 4 }).default("1.0000"),
  momentumDecayRate: decimal("momentum_decay_rate", { precision: 8, scale: 4 }).default("0.0500"),
  
  // House-Based Financial Modifiers
  houseAffiliation: text("house_affiliation"), // 'heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit'
  houseVolatilityProfile: text("house_volatility_profile"), // 'stable', 'moderate', 'high', 'extreme', 'chaotic'
  houseTradingMultiplier: decimal("house_trading_multiplier", { precision: 8, scale: 4 }).default("1.0000"),
  houseSpecialtyBonus: decimal("house_specialty_bonus", { precision: 8, scale: 4 }).default("0.0000"),
  
  // Narrative Correlation Factors
  narrativeCorrelationStrength: decimal("narrative_correlation_strength", { precision: 8, scale: 4 }).default("1.0000"),
  storyBeatSensitivity: decimal("story_beat_sensitivity", { precision: 8, scale: 4 }).default("1.0000"),
  characterDeathImpact: decimal("character_death_impact", { precision: 8, scale: 4 }).default("0.0000"),
  powerUpgradeImpact: decimal("power_upgrade_impact", { precision: 8, scale: 4 }).default("0.0000"),
  resurrectionImpact: decimal("resurrection_impact", { precision: 8, scale: 4 }).default("0.0000"),
  
  // Enhanced Margin and Risk Calculations
  narrativeMarginRequirement: decimal("narrative_margin_requirement", { precision: 8, scale: 2 }).default("50.00"),
  storyRiskAdjustment: decimal("story_risk_adjustment", { precision: 8, scale: 4 }).default("0.0000"),
  volatilityRiskPremium: decimal("volatility_risk_premium", { precision: 8, scale: 4 }).default("0.0000"),
  
  // Temporal Factors
  lastNarrativeEvent: timestamp("last_narrative_event"),
  nextPredictedEvent: timestamp("next_predicted_event"),
  storyArcPhase: text("story_arc_phase"), // 'origin', 'rising_action', 'climax', 'falling_action', 'resolution'
  seasonalNarrativePattern: text("seasonal_narrative_pattern"), // JSON array of seasonal multipliers
  
  // Performance Tracking
  metricsReliabilityScore: decimal("metrics_reliability_score", { precision: 8, scale: 4 }).default("0.5000"),
  predictionAccuracy: decimal("prediction_accuracy", { precision: 8, scale: 4 }).default("0.0000"),
  lastRecalculation: timestamp("last_recalculation").defaultNow(),
  calculationVersion: integer("calculation_version").default(1),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// House Financial Profiles - Seven Houses trading characteristics and specializations
export const houseFinancialProfiles = pgTable("house_financial_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  houseId: text("house_id").notNull().unique(), // 'heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit'
  houseName: text("house_name").notNull(),
  
  // Trading Characteristics
  volatilityProfile: text("volatility_profile").notNull(), // 'stable', 'moderate', 'high', 'extreme', 'chaotic'
  baseVolatilityMultiplier: decimal("base_volatility_multiplier", { precision: 8, scale: 4 }).notNull(),
  trendStrengthModifier: decimal("trend_strength_modifier", { precision: 8, scale: 4 }).default("1.0000"),
  meanReversionFactor: decimal("mean_reversion_factor", { precision: 8, scale: 4 }).default("0.1000"),
  
  // House-Specific Market Patterns
  marketPatternType: text("market_pattern_type").notNull(), // 'heroic_growth', 'wisdom_stability', 'power_volatility', etc.
  seasonalityPattern: jsonb("seasonality_pattern"), // Quarterly/seasonal trading patterns
  eventResponseProfile: jsonb("event_response_profile"), // How house responds to different story events
  
  // Specialized Trading Behaviors
  preferredInstruments: text("preferred_instruments").array(), // ['equity', 'options', 'bonds', etc.]
  riskToleranceLevel: text("risk_tolerance_level").notNull(), // 'conservative', 'moderate', 'aggressive', 'extreme'
  leveragePreference: decimal("leverage_preference", { precision: 8, scale: 4 }).default("1.0000"),
  
  // Narrative-Driven Factors
  storyBeatMultipliers: jsonb("story_beat_multipliers"), // Response to different story beat types
  characterPowerLevelWeights: jsonb("character_power_level_weights"), // How power levels affect trading
  cosmicEventSensitivity: decimal("cosmic_event_sensitivity", { precision: 8, scale: 4 }).default("1.0000"),
  
  // House Trading Bonuses and Penalties
  specialtyAssetTypes: text("specialty_asset_types").array(), // Asset types this house excels with
  weaknessAssetTypes: text("weakness_asset_types").array(), // Asset types this house struggles with
  tradingBonusPercentage: decimal("trading_bonus_percentage", { precision: 8, scale: 4 }).default("0.0000"),
  penaltyPercentage: decimal("penalty_percentage", { precision: 8, scale: 4 }).default("0.0000"),
  
  // Advanced House Mechanics
  alignmentRequirements: jsonb("alignment_requirements"), // Karmic alignment requirements
  synergisticHouses: text("synergistic_houses").array(), // Houses that work well together
  conflictingHouses: text("conflicting_houses").array(), // Houses that create market tension
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Story Event Triggers - Connect narrative events to market movements
export const storyEventTriggers = pgTable("story_event_triggers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Event Identification
  triggerName: text("trigger_name").notNull(),
  triggerType: text("trigger_type").notNull(), // 'story_beat', 'character_event', 'cosmic_event', 'media_release'
  eventSeverity: text("event_severity").notNull(), // 'minor', 'moderate', 'major', 'cosmic', 'universe_altering'
  
  // Source References
  storyBeatId: varchar("story_beat_id").references(() => storyBeats.id),
  characterId: varchar("character_id").references(() => enhancedCharacters.id),
  timelineId: varchar("timeline_id").references(() => narrativeTimelines.id),
  
  // Market Impact Configuration
  priceImpactRange: jsonb("price_impact_range"), // Min/max price impact percentages
  volatilityImpactMultiplier: decimal("volatility_impact_multiplier", { precision: 8, scale: 4 }).default("1.0000"),
  volumeImpactMultiplier: decimal("volume_impact_multiplier", { precision: 8, scale: 4 }).default("1.0000"),
  sentimentShift: decimal("sentiment_shift", { precision: 8, scale: 4 }).default("0.0000"), // -1.0000 to 1.0000
  
  // Affected Assets
  affectedAssetTypes: text("affected_asset_types").array(), // Types of assets affected
  directlyAffectedAssets: text("directly_affected_assets").array(), // Specific asset IDs
  indirectlyAffectedAssets: text("indirectly_affected_assets").array(), // Assets affected through connections
  
  // House-Specific Responses
  houseResponseMultipliers: jsonb("house_response_multipliers"), // How each house responds to this trigger
  crossHouseEffects: jsonb("cross_house_effects"), // Secondary effects across houses
  
  // Temporal Configuration
  immediateImpactDuration: integer("immediate_impact_duration").default(1440), // Minutes for immediate impact
  mediumTermEffectDuration: integer("medium_term_effect_duration").default(10080), // Minutes for medium-term
  longTermMemoryDecay: decimal("long_term_memory_decay", { precision: 8, scale: 4 }).default("0.0100"),
  
  // Trigger Conditions
  triggerConditions: jsonb("trigger_conditions"), // Complex conditions for activation
  cooldownPeriod: integer("cooldown_period").default(0), // Minutes before trigger can fire again
  maxActivationsPerDay: integer("max_activations_per_day").default(10),
  
  // Execution Tracking
  isActive: boolean("is_active").default(true),
  lastTriggered: timestamp("last_triggered"),
  totalActivations: integer("total_activations").default(0),
  successfulActivations: integer("successful_activations").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Narrative Market Events - Generated events from story triggers that affect trading
export const narrativeMarketEvents = pgTable("narrative_market_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Event Source
  triggerEventId: varchar("trigger_event_id").references(() => storyEventTriggers.id),
  eventTitle: text("event_title").notNull(),
  eventDescription: text("event_description").notNull(),
  narrativeContext: text("narrative_context"), // Rich context about the story event
  
  // Market Impact Data
  affectedAssets: text("affected_assets").array(), // Asset IDs affected by this event
  priceImpacts: jsonb("price_impacts"), // Actual price impacts by asset ID
  volumeChanges: jsonb("volume_changes"), // Volume changes by asset ID
  volatilityAdjustments: jsonb("volatility_adjustments"), // Volatility changes by asset ID
  
  // House Effects
  houseImpacts: jsonb("house_impacts"), // Impact on each of the seven houses
  crossHouseInteractions: jsonb("cross_house_interactions"), // Secondary cross-house effects
  
  // Event Lifecycle
  eventStartTime: timestamp("event_start_time").notNull(),
  eventEndTime: timestamp("event_end_time"),
  peakImpactTime: timestamp("peak_impact_time"),
  currentPhase: text("current_phase").default("immediate"), // 'immediate', 'medium_term', 'decay'
  
  // Market Response Tracking
  marketResponse: jsonb("market_response"), // How market actually responded
  predictionAccuracy: decimal("prediction_accuracy", { precision: 8, scale: 4 }),
  unexpectedEffects: jsonb("unexpected_effects"), // Unanticipated market responses
  
  // Narrative Trading Analytics
  narrativeRelevanceScore: decimal("narrative_relevance_score", { precision: 8, scale: 4 }).default("1.0000"),
  culturalImpactMeasure: decimal("cultural_impact_measure", { precision: 8, scale: 4 }).default("0.0000"),
  fanEngagementCorrelation: decimal("fan_engagement_correlation", { precision: 8, scale: 4 }).default("0.0000"),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced AssetFinancialMapping Integration - Extend existing table with narrative fields
// Note: We'll add these fields to the existing assetFinancialMapping table using ALTER TABLE via migrations

// ========================================================================================
// SCHEMA EXPORTS AND TYPE DEFINITIONS
// ========================================================================================

// Insert schemas for narrative trading metrics
export const insertNarrativeTradingMetricsSchema = createInsertSchema(narrativeTradingMetrics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHouseFinancialProfilesSchema = createInsertSchema(houseFinancialProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStoryEventTriggersSchema = createInsertSchema(storyEventTriggers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNarrativeMarketEventsSchema = createInsertSchema(narrativeMarketEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export TypeScript types for Phase 2 Visual Storytelling Tables
export type NarrativeTimeline = typeof narrativeTimelines.$inferSelect;
export type InsertNarrativeTimeline = z.infer<typeof insertNarrativeTimelineSchema>;

export type StoryBeat = typeof storyBeats.$inferSelect;
export type InsertStoryBeat = z.infer<typeof insertStoryBeatSchema>;

// Export TypeScript types for Phase 2 Narrative Trading Metrics
export type NarrativeTradingMetrics = typeof narrativeTradingMetrics.$inferSelect;
export type InsertNarrativeTradingMetrics = z.infer<typeof insertNarrativeTradingMetricsSchema>;

export type HouseFinancialProfile = typeof houseFinancialProfiles.$inferSelect;
export type InsertHouseFinancialProfile = z.infer<typeof insertHouseFinancialProfilesSchema>;

export type StoryEventTrigger = typeof storyEventTriggers.$inferSelect;
export type InsertStoryEventTrigger = z.infer<typeof insertStoryEventTriggersSchema>;

export type NarrativeMarketEvent = typeof narrativeMarketEvents.$inferSelect;
export type InsertNarrativeMarketEvent = z.infer<typeof insertNarrativeMarketEventsSchema>;

// ============================================================================
// PHASE 3: ART-DRIVEN PROGRESSION SYSTEM - COMIC COLLECTION MECHANICS
// ============================================================================

// Comic Issues with Variant Cover System - Track different cover types and rarities
export const comicIssueVariants = pgTable("comic_issue_variants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Basic issue information
  assetId: varchar("asset_id").notNull().references(() => assets.id), // Link to tradeable asset
  issueNumber: text("issue_number").notNull(), // "1", "Annual 1", "Special"
  seriesTitle: text("series_title").notNull(),
  publisher: text("publisher").notNull(), // "Marvel", "DC", "Image", etc.
  // Cover variant details
  coverType: text("cover_type").notNull(), // "standard", "variant", "rare_variant", "ultra_rare", "legendary"
  variantRatio: text("variant_ratio"), // "1:10", "1:25", "1:100", "1:1000" or null for standard
  variantDescription: text("variant_description"), // "Alex Ross Variant", "Foil Cover", etc.
  artistName: text("artist_name"), // Cover artist
  // Rarity and progression mechanics
  rarityScore: decimal("rarity_score", { precision: 8, scale: 2 }).notNull(), // 1-100 rarity score
  progressionTier: integer("progression_tier").notNull().default(1), // 1-5 progression tier
  tradingToolsUnlocked: text("trading_tools_unlocked").array(), // Tools this variant unlocks
  // Issue significance
  issueType: text("issue_type").default("regular"), // "first_appearance", "death", "resurrection", "key_storyline", "crossover"
  keyCharacters: text("key_characters").array(), // Characters featured
  significantEvents: text("significant_events").array(), // Major events in this issue
  storyArcs: text("story_arcs").array(), // Story arcs this issue belongs to
  // House relevance
  houseRelevance: jsonb("house_relevance"), // Relevance score for each house (0-1)
  primaryHouse: text("primary_house"), // Most relevant house
  // Market mechanics
  baseMarketValue: decimal("base_market_value", { precision: 10, scale: 2 }).notNull(),
  progressionMultiplier: decimal("progression_multiplier", { precision: 3, scale: 2 }).default("1.00"), // Bonus multiplier for progression
  collectorDemand: decimal("collector_demand", { precision: 3, scale: 2 }).default("1.00"), // 0-1 collector interest
  // Metadata
  releaseDate: text("release_date"),
  comicGradingEligible: boolean("comic_grading_eligible").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_comic_issue_variants_asset_id").on(table.assetId),
  index("idx_comic_issue_variants_cover_type").on(table.coverType),
  index("idx_comic_issue_variants_progression_tier").on(table.progressionTier),
  index("idx_comic_issue_variants_rarity_score").on(table.rarityScore),
  index("idx_comic_issue_variants_issue_type").on(table.issueType),
  index("idx_comic_issue_variants_primary_house").on(table.primaryHouse),
  index("idx_comic_issue_variants_series_title").on(table.seriesTitle),
]);

// User Comic Collection - Track what users own
export const userComicCollection = pgTable("user_comic_collection", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  variantId: varchar("variant_id").notNull().references(() => comicIssueVariants.id),
  // Ownership details
  quantity: integer("quantity").default(1), // How many copies owned
  acquisitionMethod: text("acquisition_method").default("purchase"), // "purchase", "reward", "achievement", "gift"
  acquisitionPrice: decimal("acquisition_price", { precision: 10, scale: 2 }),
  currentGrade: text("current_grade"), // CGC grade if applicable
  gradeValue: decimal("grade_value", { precision: 3, scale: 1 }), // Numeric grade value
  // Collection status
  isFirstOwned: boolean("is_first_owned").default(false), // First time owning this variant
  contributesToProgression: boolean("contributes_to_progression").default(true),
  displayInCollection: boolean("display_in_collection").default(true),
  // Trading information
  availableForTrade: boolean("available_for_trade").default(false),
  minimumTradeValue: decimal("minimum_trade_value", { precision: 10, scale: 2 }),
  // Metadata
  notes: text("notes"), // Personal collection notes
  tags: text("tags").array(), // User-defined tags
  acquiredAt: timestamp("acquired_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_user_comic_collection_user_id").on(table.userId),
  index("idx_user_comic_collection_variant_id").on(table.variantId),
  index("idx_user_comic_collection_acquisition_method").on(table.acquisitionMethod),
  index("idx_user_comic_collection_is_first_owned").on(table.isFirstOwned),
  index("idx_user_comic_collection_acquired_at").on(table.acquiredAt),
  // Unique constraint to prevent duplicate ownership records
  index("idx_user_comic_collection_unique").on(table.userId, table.variantId),
]);

// User Progression Status - Track overall progression through the system
export const userProgressionStatus = pgTable("user_progression_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Overall progression
  overallProgressionTier: integer("overall_progression_tier").default(1), // 1-5 overall tier
  progressionTitle: text("progression_title").default("Rookie Collector"), // Current title
  totalCollectionValue: decimal("total_collection_value", { precision: 15, scale: 2 }).default("0.00"),
  totalIssuesOwned: integer("total_issues_owned").default(0),
  totalVariantsOwned: integer("total_variants_owned").default(0),
  // Progression metrics
  standardCoversOwned: integer("standard_covers_owned").default(0),
  variantCoversOwned: integer("variant_covers_owned").default(0), // 1:10 variants
  rareVariantsOwned: integer("rare_variants_owned").default(0), // 1:25 variants
  ultraRareVariantsOwned: integer("ultra_rare_variants_owned").default(0), // 1:100 variants
  legendaryVariantsOwned: integer("legendary_variants_owned").default(0), // 1:1000 variants
  // Issue type collections
  firstAppearancesOwned: integer("first_appearances_owned").default(0),
  deathIssuesOwned: integer("death_issues_owned").default(0),
  resurrectionIssuesOwned: integer("resurrection_issues_owned").default(0),
  keyStorylineIssuesOwned: integer("key_storyline_issues_owned").default(0),
  crossoverIssuesOwned: integer("crossover_issues_owned").default(0),
  // Creator collections
  creatorMilestonesCompleted: integer("creator_milestones_completed").default(0),
  iconicSplashPagesOwned: integer("iconic_splash_pages_owned").default(0),
  // Trading capabilities unlocked
  tradingToolsUnlocked: text("trading_tools_unlocked").array(), // List of unlocked tools
  maxTradingTier: integer("max_trading_tier").default(1), // Highest tier unlocked
  specialTradingAbilities: text("special_trading_abilities").array(), // Special abilities unlocked
  // House-specific progression
  houseProgressionLevels: jsonb("house_progression_levels"), // Progress in each house
  houseBonusesUnlocked: jsonb("house_bonuses_unlocked"), // Bonuses unlocked per house
  interHouseBonuses: text("inter_house_bonuses").array(), // Cross-house bonuses
  // Achievement milestones
  achievementMilestonesCompleted: integer("achievement_milestones_completed").default(0),
  legendaryAchievementsUnlocked: integer("legendary_achievements_unlocked").default(0),
  // Collection completion stats
  seriesCompletionCount: integer("series_completion_count").default(0), // Number of complete series
  publisherCompletionPercentage: jsonb("publisher_completion_percentage"), // % complete for each publisher
  // Metadata
  lastProgressionUpdate: timestamp("last_progression_update").defaultNow(),
  nextMilestoneTarget: text("next_milestone_target"), // Description of next major milestone
  progressionNotes: text("progression_notes"), // Internal notes about progression
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_user_progression_status_user_id").on(table.userId),
  index("idx_user_progression_status_tier").on(table.overallProgressionTier),
  index("idx_user_progression_status_total_value").on(table.totalCollectionValue),
  index("idx_user_progression_status_max_trading_tier").on(table.maxTradingTier),
  index("idx_user_progression_status_last_update").on(table.lastProgressionUpdate),
]);

// House Progression Paths - Define progression within each house
export const houseProgressionPaths = pgTable("house_progression_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  houseId: text("house_id").notNull(), // "heroes", "wisdom", "power", "mystery", "elements", "time", "spirit"
  progressionLevel: integer("progression_level").notNull(), // 1-4 levels per house
  levelTitle: text("level_title").notNull(), // "Origin Story", "Sidekick", etc.
  levelDescription: text("level_description").notNull(),
  // Requirements for this level
  requiredIssuesCount: integer("required_issues_count").default(0),
  requiredVariantRarity: text("required_variant_rarity"), // Minimum variant rarity needed
  requiredCollectionValue: decimal("required_collection_value", { precision: 15, scale: 2 }).default("0.00"),
  requiredStorylineCompletion: text("required_storyline_completion").array(), // Specific storylines
  requiredCharacterCollection: text("required_character_collection").array(), // Character collections
  // Unlocks and bonuses
  tradingBonuses: jsonb("trading_bonuses"), // Trading bonuses at this level
  specialAbilities: text("special_abilities").array(), // Special abilities unlocked
  marketAccessLevel: text("market_access_level"), // "basic", "advanced", "expert", "legendary"
  houseSpecificTools: text("house_specific_tools").array(), // House-specific trading tools
  // Visual and thematic elements
  badgeIcon: text("badge_icon"), // Icon for this progression level
  badgeColor: text("badge_color"), // Color theme
  levelQuote: text("level_quote"), // Inspirational quote for this level
  backgroundImage: text("background_image"), // Background image URL
  // Progression narrative
  progressionStory: text("progression_story"), // Story text for reaching this level
  nextLevelPreview: text("next_level_preview"), // Hint about next level
  // Metadata
  displayOrder: integer("display_order").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_house_progression_paths_house_id").on(table.houseId),
  index("idx_house_progression_paths_level").on(table.progressionLevel),
  index("idx_house_progression_paths_display_order").on(table.displayOrder),
  // Unique constraint for house + level combination
  index("idx_house_progression_paths_unique").on(table.houseId, table.progressionLevel),
]);

// User House Progression - Track user progress within each house
export const userHouseProgression = pgTable("user_house_progression", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  houseId: text("house_id").notNull(),
  // Current progression status
  currentLevel: integer("current_level").default(1),
  experiencePoints: integer("experience_points").default(0), // XP towards next level
  nextLevelRequiredXP: integer("next_level_required_xp").default(100),
  progressionPercentage: decimal("progression_percentage", { precision: 5, scale: 2 }).default("0.00"), // % to next level
  // Collection requirements progress
  currentIssuesCount: integer("current_issues_count").default(0),
  currentCollectionValue: decimal("current_collection_value", { precision: 15, scale: 2 }).default("0.00"),
  storylinesCompleted: text("storylines_completed").array(),
  characterCollectionsCompleted: text("character_collections_completed").array(),
  // Unlocked benefits
  currentTradingBonuses: jsonb("current_trading_bonuses"),
  unlockedAbilities: text("unlocked_abilities").array(),
  currentMarketAccessLevel: text("current_market_access_level").default("basic"),
  availableHouseTools: text("available_house_tools").array(),
  // Achievement tracking
  levelsUnlocked: integer("levels_unlocked").default(1),
  totalXPEarned: integer("total_xp_earned").default(0),
  firstLevelAchievedAt: timestamp("first_level_achieved_at"),
  lastLevelAchievedAt: timestamp("last_level_achieved_at"),
  // House-specific metrics
  houseSpecificAchievements: text("house_specific_achievements").array(),
  houseContributionScore: decimal("house_contribution_score", { precision: 8, scale: 2 }).default("0.00"),
  houseRankingPosition: integer("house_ranking_position"),
  // Metadata
  lastProgressionActivity: timestamp("last_progression_activity").defaultNow(),
  progressionNotes: text("progression_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_user_house_progression_user_id").on(table.userId),
  index("idx_user_house_progression_house_id").on(table.houseId),
  index("idx_user_house_progression_current_level").on(table.currentLevel),
  index("idx_user_house_progression_xp").on(table.experiencePoints),
  index("idx_user_house_progression_contribution").on(table.houseContributionScore),
  // Unique constraint to prevent duplicate progression records
  index("idx_user_house_progression_unique").on(table.userId, table.houseId),
]);

// Trading Tool Unlocks - Track which trading features are available to users
export const tradingToolUnlocks = pgTable("trading_tool_unlocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  toolName: text("tool_name").notNull(), // "basic_trading", "technical_analysis", "options_trading", etc.
  toolCategory: text("tool_category").notNull(), // "basic", "advanced", "expert", "legendary"
  // Unlock requirements
  requiredProgressionTier: integer("required_progression_tier").notNull(),
  requiredVariantRarity: text("required_variant_rarity"), // Minimum variant rarity
  requiredAchievements: text("required_achievements").array(), // Achievement prerequisites
  requiredHouseLevel: jsonb("required_house_level"), // House level requirements
  // Unlock status
  isUnlocked: boolean("is_unlocked").default(false),
  unlockedAt: timestamp("unlocked_at"),
  unlockedBy: text("unlocked_by"), // What triggered the unlock
  // Tool configuration
  toolDescription: text("tool_description").notNull(),
  toolBenefits: text("tool_benefits").array(), // Benefits this tool provides
  tradingBonuses: jsonb("trading_bonuses"), // Specific trading bonuses
  marketAccessLevel: text("market_access_level"), // Required market access
  // Usage tracking
  timesUsed: integer("times_used").default(0),
  lastUsedAt: timestamp("last_used_at"),
  effectivenessRating: decimal("effectiveness_rating", { precision: 3, scale: 2 }), // User effectiveness with tool
  // Metadata
  iconName: text("icon_name"), // UI icon
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_trading_tool_unlocks_user_id").on(table.userId),
  index("idx_trading_tool_unlocks_tool_name").on(table.toolName),
  index("idx_trading_tool_unlocks_category").on(table.toolCategory),
  index("idx_trading_tool_unlocks_progression_tier").on(table.requiredProgressionTier),
  index("idx_trading_tool_unlocks_is_unlocked").on(table.isUnlocked),
  index("idx_trading_tool_unlocks_unlocked_at").on(table.unlockedAt),
  // Unique constraint for user + tool combination
  index("idx_trading_tool_unlocks_unique").on(table.userId, table.toolName),
]);

// Comic Collection Achievements - Define specific collection-based achievements
export const comicCollectionAchievements = pgTable("comic_collection_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  achievementId: text("achievement_id").notNull().unique(), // "first_variant_cover", "death_issue_collector", etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "variant_collection", "issue_type", "storyline", "creator", "crossover"
  // Achievement requirements
  requirementType: text("requirement_type").notNull(), // "count", "specific_issues", "value", "rarity", "storyline"
  requiredCount: integer("required_count"), // Number required for count-based achievements
  requiredValue: decimal("required_value", { precision: 15, scale: 2 }), // Value required
  requiredRarity: text("required_rarity"), // Minimum rarity level
  specificRequirements: jsonb("specific_requirements"), // Detailed requirements
  // Rewards and unlocks
  achievementPoints: integer("achievement_points").default(0),
  tradingToolsUnlocked: text("trading_tools_unlocked").array(),
  houseProgressionBonus: jsonb("house_progression_bonus"), // XP bonus per house
  specialAbilities: text("special_abilities").array(),
  tradingBonuses: jsonb("trading_bonuses"),
  // Visual elements
  badgeIcon: text("badge_icon"),
  badgeColor: text("badge_color"),
  tier: text("tier").default("bronze"), // "bronze", "silver", "gold", "platinum", "legendary"
  rarity: text("rarity").default("common"), // "common", "rare", "epic", "legendary"
  // Narrative elements
  achievementStory: text("achievement_story"), // Story text for unlocking
  comicPanelStyle: text("comic_panel_style"), // Visual style for notification
  speechBubbleText: text("speech_bubble_text"), // Character dialogue for achievement
  // Prerequisites and dependencies
  prerequisiteAchievements: text("prerequisite_achievements").array(),
  blockedBy: text("blocked_by").array(), // Achievements that block this one
  // Metadata
  isHidden: boolean("is_hidden").default(false), // Hidden until unlocked
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_comic_collection_achievements_achievement_id").on(table.achievementId),
  index("idx_comic_collection_achievements_category").on(table.category),
  index("idx_comic_collection_achievements_tier").on(table.tier),
  index("idx_comic_collection_achievements_rarity").on(table.rarity),
  index("idx_comic_collection_achievements_requirement_type").on(table.requirementType),
  index("idx_comic_collection_achievements_is_hidden").on(table.isHidden),
  index("idx_comic_collection_achievements_display_order").on(table.displayOrder),
]);

// Collection Challenges - Weekly/monthly collecting goals
export const collectionChallenges = pgTable("collection_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  challengeTitle: text("challenge_title").notNull(),
  challengeDescription: text("challenge_description").notNull(),
  challengeType: text("challenge_type").notNull(), // "weekly", "monthly", "seasonal", "special_event"
  // Challenge timing
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  challengeDuration: text("challenge_duration"), // "7_days", "30_days", etc.
  // Challenge requirements
  challengeGoal: jsonb("challenge_goal").notNull(), // Specific goal requirements
  targetMetric: text("target_metric").notNull(), // "issues_collected", "value_achieved", "variants_found"
  targetValue: decimal("target_value", { precision: 15, scale: 2 }).notNull(),
  eligibilityRequirements: jsonb("eligibility_requirements"), // Who can participate
  // House integration
  houseSpecific: boolean("house_specific").default(false),
  targetHouse: text("target_house"), // If house-specific
  crossHouseBonus: boolean("cross_house_bonus").default(false), // If cross-house participation gets bonus
  // Rewards
  completionRewards: jsonb("completion_rewards").notNull(),
  leaderboardRewards: jsonb("leaderboard_rewards"), // Top performer rewards
  participationRewards: jsonb("participation_rewards"), // Just for participating
  exclusiveUnlocks: text("exclusive_unlocks").array(), // Exclusive content unlocked
  // Challenge mechanics
  difficultyLevel: integer("difficulty_level").default(3), // 1-5 difficulty
  maxParticipants: integer("max_participants"), // Participation limit
  currentParticipants: integer("current_participants").default(0),
  // Progress tracking
  leaderboardEnabled: boolean("leaderboard_enabled").default(true),
  realTimeTracking: boolean("real_time_tracking").default(true),
  progressVisibility: text("progress_visibility").default("public"), // "public", "house_only", "private"
  // Visual and narrative elements
  challengeBanner: text("challenge_banner"), // Banner image URL
  challengeIcon: text("challenge_icon"),
  themeColor: text("theme_color"),
  narrativeContext: text("narrative_context"), // Story context for challenge
  // Metadata
  createdBy: varchar("created_by").references(() => users.id),
  isActive: boolean("is_active").default(true),
  isRecurring: boolean("is_recurring").default(false), // If this challenge repeats
  recurringPattern: text("recurring_pattern"), // How often it repeats
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_collection_challenges_challenge_type").on(table.challengeType),
  index("idx_collection_challenges_start_date").on(table.startDate),
  index("idx_collection_challenges_end_date").on(table.endDate),
  index("idx_collection_challenges_is_active").on(table.isActive),
  index("idx_collection_challenges_target_house").on(table.targetHouse),
  index("idx_collection_challenges_difficulty").on(table.difficultyLevel),
]);

// User Challenge Participation - Track user participation in challenges
export const userChallengeParticipation = pgTable("user_challenge_participation", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  challengeId: varchar("challenge_id").notNull().references(() => collectionChallenges.id),
  // Participation status
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  participationStatus: text("participation_status").default("active"), // "active", "completed", "abandoned", "disqualified"
  // Progress tracking
  currentProgress: decimal("current_progress", { precision: 15, scale: 2 }).default("0.00"),
  progressPercentage: decimal("progress_percentage", { precision: 5, scale: 2 }).default("0.00"),
  milestonesMet: text("milestones_met").array(),
  lastProgressUpdate: timestamp("last_progress_update").defaultNow(),
  // Performance metrics
  leaderboardPosition: integer("leaderboard_position"),
  bestPosition: integer("best_position"),
  finalPosition: integer("final_position"),
  // Rewards earned
  rewardsEarned: jsonb("rewards_earned"),
  rewardsClaimed: boolean("rewards_claimed").default(false),
  rewardsClaimedAt: timestamp("rewards_claimed_at"),
  // Challenge-specific tracking
  challengeSpecificData: jsonb("challenge_specific_data"), // Additional tracking data
  effortRating: decimal("effort_rating", { precision: 3, scale: 2 }), // 1-5 effort put in
  satisfactionRating: decimal("satisfaction_rating", { precision: 3, scale: 2 }), // 1-5 satisfaction
  // Metadata
  completedAt: timestamp("completed_at"),
  notes: text("notes"), // User notes about participation
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_user_challenge_participation_user_id").on(table.userId),
  index("idx_user_challenge_participation_challenge_id").on(table.challengeId),
  index("idx_user_challenge_participation_status").on(table.participationStatus),
  index("idx_user_challenge_participation_leaderboard").on(table.leaderboardPosition),
  index("idx_user_challenge_participation_enrolled_at").on(table.enrolledAt),
  // Unique constraint to prevent duplicate participation
  index("idx_user_challenge_participation_unique").on(table.userId, table.challengeId),
]);

// ============================================================================
// INSERT SCHEMAS AND TYPESCRIPT TYPES FOR PHASE 3 PROGRESSION SYSTEM
// ============================================================================

// Insert schemas for Phase 3 progression tables
export const insertComicIssueVariantSchema = createInsertSchema(comicIssueVariants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserComicCollectionSchema = createInsertSchema(userComicCollection).omit({
  id: true,
  acquiredAt: true,
  createdAt: true,
});

export const insertUserProgressionStatusSchema = createInsertSchema(userProgressionStatus).omit({
  id: true,
  lastProgressionUpdate: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHouseProgressionPathSchema = createInsertSchema(houseProgressionPaths).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserHouseProgressionSchema = createInsertSchema(userHouseProgression).omit({
  id: true,
  lastProgressionActivity: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTradingToolUnlockSchema = createInsertSchema(tradingToolUnlocks).omit({
  id: true,
  unlockedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertComicCollectionAchievementSchema = createInsertSchema(comicCollectionAchievements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCollectionChallengeSchema = createInsertSchema(collectionChallenges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserChallengeParticipationSchema = createInsertSchema(userChallengeParticipation).omit({
  id: true,
  enrolledAt: true,
  lastProgressUpdate: true,
  createdAt: true,
  updatedAt: true,
});

// Export TypeScript types for Phase 3 progression system
export type ComicIssueVariant = typeof comicIssueVariants.$inferSelect;
export type InsertComicIssueVariant = z.infer<typeof insertComicIssueVariantSchema>;

export type UserComicCollection = typeof userComicCollection.$inferSelect;
export type InsertUserComicCollection = z.infer<typeof insertUserComicCollectionSchema>;

export type UserProgressionStatus = typeof userProgressionStatus.$inferSelect;
export type InsertUserProgressionStatus = z.infer<typeof insertUserProgressionStatusSchema>;

export type HouseProgressionPath = typeof houseProgressionPaths.$inferSelect;
export type InsertHouseProgressionPath = z.infer<typeof insertHouseProgressionPathSchema>;

export type UserHouseProgression = typeof userHouseProgression.$inferSelect;
export type InsertUserHouseProgression = z.infer<typeof insertUserHouseProgressionSchema>;

export type TradingToolUnlock = typeof tradingToolUnlocks.$inferSelect;
export type InsertTradingToolUnlock = z.infer<typeof insertTradingToolUnlockSchema>;

export type ComicCollectionAchievement = typeof comicCollectionAchievements.$inferSelect;
export type InsertComicCollectionAchievement = z.infer<typeof insertComicCollectionAchievementSchema>;

export type CollectionChallenge = typeof collectionChallenges.$inferSelect;
export type InsertCollectionChallenge = z.infer<typeof insertCollectionChallengeSchema>;

export type UserChallengeParticipation = typeof userChallengeParticipation.$inferSelect;
export type InsertUserChallengeParticipation = z.infer<typeof insertUserChallengeParticipationSchema>;

// =============================================================================
// COLLECTOR-GRADE ASSET DISPLAY SYSTEM
// Phase: Collector Experience Enhancement
// =============================================================================

// Graded Asset Profiles - CGC-style grading system with collector authenticity
export const gradedAssetProfiles = pgTable("graded_asset_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // CGC-Style Grading Scores (0.5 - 10.0 scale)
  overallGrade: decimal("overall_grade", { precision: 3, scale: 1 }).notNull(), // Final composite grade
  conditionScore: decimal("condition_score", { precision: 3, scale: 1 }).notNull(), // Overall condition
  centeringScore: decimal("centering_score", { precision: 3, scale: 1 }).notNull(), // Cover centering
  cornersScore: decimal("corners_score", { precision: 3, scale: 1 }).notNull(), // Corner condition
  edgesScore: decimal("edges_score", { precision: 3, scale: 1 }).notNull(), // Edge integrity
  surfaceScore: decimal("surface_score", { precision: 3, scale: 1 }).notNull(), // Surface quality
  
  // Provenance & Certification Metadata
  certificationAuthority: text("certification_authority").notNull(), // 'cgc', 'cbcs', 'pgx', 'internal'
  certificationNumber: text("certification_number").unique(), // Serial number from grading company
  gradingDate: timestamp("grading_date").notNull(),
  gradingNotes: text("grading_notes"), // Detailed condition notes
  
  // Variant Classifications & Special Designations
  variantType: text("variant_type"), // 'first_print', 'variant_cover', 'special_edition', 'limited_run', 'error', 'misprint'
  printRun: integer("print_run"), // Known print run numbers
  isKeyIssue: boolean("is_key_issue").default(false),
  isFirstAppearance: boolean("is_first_appearance").default(false),
  isSigned: boolean("is_signed").default(false),
  signatureAuthenticated: boolean("signature_authenticated").default(false),
  
  // Rarity Tier System (Mythological Themed)
  rarityTier: text("rarity_tier").notNull(), // 'common', 'uncommon', 'rare', 'ultra_rare', 'legendary', 'mythic'
  rarityScore: decimal("rarity_score", { precision: 5, scale: 2 }).notNull(), // Calculated rarity index
  marketDemandScore: decimal("market_demand_score", { precision: 5, scale: 2 }), // Market desirability
  
  // Storage & Collection Metadata
  storageType: text("storage_type").default("bag_and_board"), // 'bag_and_board', 'mylar', 'graded_slab', 'top_loader'
  storageCondition: text("storage_condition").default("excellent"), // 'poor', 'fair', 'good', 'excellent', 'mint'
  acquisitionDate: timestamp("acquisition_date").notNull(),
  acquisitionPrice: decimal("acquisition_price", { precision: 10, scale: 2 }),
  currentMarketValue: decimal("current_market_value", { precision: 10, scale: 2 }),
  
  // Collection Organization
  collectionSeries: text("collection_series"), // Series grouping
  issueNumber: text("issue_number"), // Specific issue number
  volumeNumber: integer("volume_number"), // Volume/series number
  
  // Collector Notes & Personal Data  
  personalRating: integer("personal_rating"), // 1-5 star personal rating
  collectorNotes: text("collector_notes"), // Personal collection notes
  displayPriority: integer("display_priority").default(0), // Display order preference
  
  // House Integration & Progression
  houseAffiliation: text("house_affiliation"), // Associated mythological house
  houseProgressionValue: decimal("house_progression_value", { precision: 8, scale: 2 }).default("0.00"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Variant Cover Registry - Comprehensive variant tracking
export const variantCoverRegistry = pgTable("variant_cover_registry", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  baseAssetId: varchar("base_asset_id").notNull().references(() => assets.id), // Base comic issue
  
  // Variant Identification
  variantIdentifier: text("variant_identifier").notNull(), // Unique variant code
  variantName: text("variant_name").notNull(), // Display name
  coverArtist: text("cover_artist"), // Cover artist name
  variantType: text("variant_type").notNull(), // 'retailer', 'convention', 'artist', 'incentive', 'sketch'
  
  // Market Data
  printRun: integer("print_run"), // Known or estimated print run
  incentiveRatio: text("incentive_ratio"), // For incentive variants (e.g., "1:25", "1:100")
  exclusiveRetailer: text("exclusive_retailer"), // Exclusive retailer if applicable
  releaseDate: timestamp("release_date"),
  
  // Visual Assets
  coverImageUrl: text("cover_image_url"),
  thumbnailUrl: text("thumbnail_url"),
  backCoverUrl: text("back_cover_url"), // For trading card flip effect
  
  // Rarity & Valuation
  baseRarityMultiplier: decimal("base_rarity_multiplier", { precision: 5, scale: 2 }).default("1.00"),
  currentPremium: decimal("current_premium", { precision: 8, scale: 2 }), // Premium over base issue
  
  // Metadata
  description: text("description"),
  specialFeatures: text("special_features").array(), // Special printing techniques, etc.
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Collection Storage Boxes - Physical storage simulation
export const collectionStorageBoxes = pgTable("collection_storage_boxes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Box Identification
  boxName: text("box_name").notNull(),
  boxType: text("box_type").notNull(), // 'long_box', 'short_box', 'magazine_box', 'display_case', 'graded_slab_storage'
  capacity: integer("capacity").notNull(), // Maximum number of issues
  currentCount: integer("current_count").default(0),
  
  // Organization
  organizationMethod: text("organization_method").default("alphabetical"), // 'alphabetical', 'chronological', 'value', 'rarity', 'series', 'publisher'
  seriesFilter: text("series_filter"), // Optional series grouping
  publisherFilter: text("publisher_filter"), // Optional publisher grouping
  
  // Physical Attributes
  location: text("location"), // Physical location description
  condition: text("condition").default("excellent"), // Box condition
  
  // Collection Stats
  totalValue: decimal("total_value", { precision: 15, scale: 2 }).default("0.00"),
  averageGrade: decimal("average_grade", { precision: 3, scale: 1 }),
  keyIssuesCount: integer("key_issues_count").default(0),
  
  // Rarity Distribution
  commonCount: integer("common_count").default(0),
  uncommonCount: integer("uncommon_count").default(0),
  rareCount: integer("rare_count").default(0),
  ultraRareCount: integer("ultra_rare_count").default(0),
  legendaryCount: integer("legendary_count").default(0),
  mythicCount: integer("mythic_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Grading Certification History - Track certification events
export const gradingCertifications = pgTable("grading_certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gradedAssetId: varchar("graded_asset_id").notNull().references(() => gradedAssetProfiles.id),
  
  // Certification Event
  certificationType: text("certification_type").notNull(), // 'initial_grade', 're_grade', 'signature_verification', 'restoration_check'
  previousGrade: decimal("previous_grade", { precision: 3, scale: 1 }), // Previous grade if re-certification
  newGrade: decimal("new_grade", { precision: 3, scale: 1 }).notNull(),
  
  // Certification Details
  certifyingAuthority: text("certifying_authority").notNull(),
  certificateNumber: text("certificate_number"),
  certificationFee: decimal("certification_fee", { precision: 8, scale: 2 }),
  
  // Process Tracking
  submissionDate: timestamp("submission_date"),
  completionDate: timestamp("completion_date").notNull(),
  turnaroundDays: integer("turnaround_days"),
  
  // Results
  certificationNotes: text("certification_notes"),
  qualityAssessment: jsonb("quality_assessment"), // Detailed breakdown of grading criteria
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Market Comparables - Track similar sales for valuation
export const marketComparables = pgTable("market_comparables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gradedAssetId: varchar("graded_asset_id").notNull().references(() => gradedAssetProfiles.id),
  
  // Sale Information
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }).notNull(),
  saleDate: timestamp("sale_date").notNull(),
  marketplace: text("marketplace"), // 'ebay', 'heritage', 'comic_connect', 'mycomicshop'
  
  // Comparable Details
  comparableGrade: decimal("comparable_grade", { precision: 3, scale: 1 }).notNull(),
  gradingAuthority: text("grading_authority").notNull(),
  saleConditions: text("sale_conditions"), // Auction, buy-it-now, etc.
  
  // Relevance Scoring
  relevanceScore: decimal("relevance_score", { precision: 3, scale: 2 }), // How similar to target asset
  ageRelevance: decimal("age_relevance", { precision: 3, scale: 2 }), // How recent the sale
  
  // Metadata
  saleReference: text("sale_reference"), // External reference/link
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schemas for Collector-Grade Asset Display system
export const insertGradedAssetProfileSchema = createInsertSchema(gradedAssetProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVariantCoverRegistrySchema = createInsertSchema(variantCoverRegistry).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCollectionStorageBoxSchema = createInsertSchema(collectionStorageBoxes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGradingCertificationSchema = createInsertSchema(gradingCertifications).omit({
  id: true,
  createdAt: true,
});

export const insertMarketComparableSchema = createInsertSchema(marketComparables).omit({
  id: true,
  createdAt: true,
});

// Export TypeScript types for Collector-Grade Asset Display system
export type GradedAssetProfile = typeof gradedAssetProfiles.$inferSelect;
export type InsertGradedAssetProfile = z.infer<typeof insertGradedAssetProfileSchema>;

export type VariantCoverRegistry = typeof variantCoverRegistry.$inferSelect;
export type InsertVariantCoverRegistry = z.infer<typeof insertVariantCoverRegistrySchema>;

export type CollectionStorageBox = typeof collectionStorageBoxes.$inferSelect;
export type InsertCollectionStorageBox = z.infer<typeof insertCollectionStorageBoxSchema>;

export type GradingCertification = typeof gradingCertifications.$inferSelect;
export type InsertGradingCertification = z.infer<typeof insertGradingCertificationSchema>;

export type MarketComparable = typeof marketComparables.$inferSelect;
export type InsertMarketComparable = z.infer<typeof insertMarketComparableSchema>;

// =============================================
// SHADOW ECONOMY SYSTEM
// =============================================

// Shadow Trades - Track all shadow market transactions
export const shadowTrades = pgTable("shadow_trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  
  // Price Information
  shadowPrice: decimal("shadow_price", { precision: 10, scale: 2 }).notNull(),
  realPrice: decimal("real_price", { precision: 10, scale: 2 }).notNull(),
  priceDivergence: decimal("price_divergence", { precision: 8, scale: 2 }).notNull(), // Percentage
  
  // Trade Details
  quantity: integer("quantity").notNull(),
  side: text("side").notNull(), // 'buy' or 'sell'
  orderType: text("order_type").notNull(), // 'predatory', 'vampire', 'ghost'
  profitLoss: decimal("profit_loss", { precision: 15, scale: 2 }).notNull(),
  
  // Corruption Impact
  corruptionGained: integer("corruption_gained").notNull(),
  victimId: varchar("victim_id").references(() => users.id), // If applicable
  victimLoss: decimal("victim_loss", { precision: 15, scale: 2 }),
  
  // Status
  status: text("status").notNull().default("pending"), // 'pending', 'executed', 'cancelled'
  executedAt: timestamp("executed_at").notNull(),
  
  // Metadata
  metadata: jsonb("metadata"), // Additional trade-specific data
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_shadow_trades_user").on(table.userId),
  index("idx_shadow_trades_asset").on(table.assetId),
  index("idx_shadow_trades_executed").on(table.executedAt),
]);

// Dark Pools - Hidden liquidity pools for shadow market
export const darkPools = pgTable("dark_pools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  
  // Liquidity Information
  shadowLiquidity: decimal("shadow_liquidity", { precision: 15, scale: 2 }).notNull(),
  hiddenOrders: integer("hidden_orders").default(0),
  averageSpread: decimal("average_spread", { precision: 8, scale: 4 }),
  
  // Access Control
  accessLevel: integer("access_level").notNull().default(30), // Minimum corruption to access
  participantCount: integer("participant_count").default(0),
  
  // Pool Characteristics
  poolType: text("pool_type").default("standard"), // 'standard', 'predatory', 'vampire'
  volatility: decimal("volatility", { precision: 8, scale: 2 }),
  bloodInWater: boolean("blood_in_water").default(false), // Recent losses detected
  lastBloodTime: timestamp("last_blood_time"),
  
  // Statistics
  totalVolume24h: decimal("total_volume_24h", { precision: 15, scale: 2 }).default("0.00"),
  totalTrades24h: integer("total_trades_24h").default(0),
  largestTrade: decimal("largest_trade", { precision: 15, scale: 2 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_dark_pools_asset").on(table.assetId),
  index("idx_dark_pools_access").on(table.accessLevel),
]);

// Shadow Order Book - Hidden orders only visible to corrupt traders
export const shadowOrderBook = pgTable("shadow_order_book", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  
  // Order Details
  orderType: text("order_type").notNull(), // 'ghost', 'trap', 'vampire'
  side: text("side").notNull(), // 'buy' or 'sell'
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  filled: integer("filled").default(0),
  
  // Visibility
  visibilityLevel: integer("visibility_level").notNull(), // Corruption required to see
  isHidden: boolean("is_hidden").default(true),
  revealAt: timestamp("reveal_at"), // When order becomes visible
  
  // Targeting
  targetUserId: varchar("target_user_id").references(() => users.id), // For predatory orders
  targetPrice: decimal("target_price", { precision: 10, scale: 2 }), // Stop loss hunting
  
  // Status
  status: text("status").notNull().default("pending"), // 'pending', 'partial', 'filled', 'cancelled'
  expiresAt: timestamp("expires_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_shadow_order_book_user").on(table.userId),
  index("idx_shadow_order_book_asset").on(table.assetId),
  index("idx_shadow_order_book_status").on(table.status),
]);

// Create insert schemas for Shadow Economy
export const insertShadowTradeSchema = createInsertSchema(shadowTrades).omit({
  id: true,
  createdAt: true,
});

export const insertDarkPoolSchema = createInsertSchema(darkPools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertShadowOrderBookSchema = createInsertSchema(shadowOrderBook).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export TypeScript types for Shadow Economy
export type ShadowTrade = typeof shadowTrades.$inferSelect;
export type InsertShadowTrade = z.infer<typeof insertShadowTradeSchema>;

export type DarkPool = typeof darkPools.$inferSelect;
export type InsertDarkPool = z.infer<typeof insertDarkPoolSchema>;

export type ShadowOrderBook = typeof shadowOrderBook.$inferSelect;
export type InsertShadowOrderBook = z.infer<typeof insertShadowOrderBookSchema>;

// NOIR JOURNAL SYSTEM - Dark philosophical trading journal with AI analysis

// Journal Entries - AI-generated noir commentary on trades and market actions
export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Entry classification
  entryType: text("entry_type").notNull(), // 'trade', 'daily', 'victim', 'milestone', 'confession', 'analysis'
  
  // Content
  content: text("content").notNull(), // The noir journal entry text
  title: text("title"), // Optional title for the entry
  
  // Context
  corruptionAtTime: decimal("corruption_at_time", { precision: 5, scale: 2 }), // Corruption level when written
  relatedTradeId: varchar("related_trade_id").references(() => trades.id), // If related to specific trade
  relatedVictimId: varchar("related_victim_id").references(() => tradingVictims.id), // If related to victim
  
  // Metadata
  mood: text("mood"), // 'contemplative', 'dark', 'nihilistic', 'remorseful', 'cold'
  intensity: integer("intensity").default(1), // 1-10 scale of darkness
  wordCount: integer("word_count"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_journal_entries_user").on(table.userId),
  index("idx_journal_entries_type").on(table.entryType),
  index("idx_journal_entries_created").on(table.createdAt),
]);

// Psychological Profiles - AI analysis of trader psychology over time
export const psychologicalProfiles = pgTable("psychological_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Analysis
  pattern: text("pattern").notNull(), // Identified psychological pattern
  analysis: text("analysis").notNull(), // Detailed psychological analysis
  
  // Traits
  dominantTraits: jsonb("dominant_traits"), // ['ruthless', 'calculating', 'empathetic', etc.]
  moralAlignment: text("moral_alignment"), // 'descending', 'conflicted', 'embracing_darkness'
  tradingStyle: text("trading_style"), // 'predatory', 'opportunistic', 'defensive'
  
  // Metrics
  empathyScore: decimal("empathy_score", { precision: 5, scale: 2 }), // 0-100, decreases with corruption
  ruthlessnessIndex: decimal("ruthlessness_index", { precision: 5, scale: 2 }), // 0-100, increases with profits
  denialLevel: decimal("denial_level", { precision: 5, scale: 2 }), // 0-100, psychological defense mechanisms
  
  // Evolution tracking
  previousProfile: text("previous_profile"), // How they've changed
  turningPoints: jsonb("turning_points"), // Key trades that changed them
  
  // Timestamps
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_psychological_profiles_user").on(table.userId),
]);

// Create insert schemas for Journal System
export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
});

export const insertPsychologicalProfileSchema = createInsertSchema(psychologicalProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export TypeScript types for Journal System
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;

export type PsychologicalProfile = typeof psychologicalProfiles.$inferSelect;
export type InsertPsychologicalProfile = z.infer<typeof insertPsychologicalProfileSchema>;

// SOCIAL WARFARE SYSTEM - Predatory trading where the weak are consumed by the strong

// Shadow Traders - AI-controlled and real traders appearing as shadows
export const shadowTraders = pgTable("shadow_traders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id), // NULL for AI shadows
  shadowName: text("shadow_name").notNull(), // "Shadow of Greed", "Fallen Spectre", etc.
  
  // Shadow characteristics
  strength: decimal("strength", { precision: 10, scale: 2 }).default("100.00"), // Trading power
  corruptionLevel: decimal("corruption_level", { precision: 5, scale: 2 }).default("0.00"),
  portfolioValue: decimal("portfolio_value", { precision: 15, scale: 2 }).default("0.00"),
  
  // Status tracking
  status: text("status").notNull().default("active"), // 'active', 'fallen', 'consumed', 'rising'
  fallenAt: timestamp("fallen_at"), // When they fell below threshold
  consumedBy: varchar("consumed_by").references(() => users.id), // Who consumed them
  
  // Visual characteristics
  shadowColor: text("shadow_color").default("#000000"), // Hex color based on state
  opacity: decimal("opacity", { precision: 3, scale: 2 }).default("0.80"), // Visual opacity
  isAI: boolean("is_ai").default(false), // AI-controlled shadow
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_shadow_traders_status").on(table.status),
  index("idx_shadow_traders_user").on(table.userId),
]);

// Stolen Positions - Records of vulture trades feeding on the fallen
export const stolenPositions = pgTable("stolen_positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  thiefId: varchar("thief_id").notNull().references(() => users.id),
  victimId: varchar("victim_id").notNull().references(() => users.id),
  positionId: varchar("position_id").notNull().references(() => positions.id),
  
  // Theft details
  originalValue: decimal("original_value", { precision: 15, scale: 2 }).notNull(),
  stolenValue: decimal("stolen_value", { precision: 15, scale: 2 }).notNull(), // 50% discount
  discountRate: decimal("discount_rate", { precision: 5, scale: 2 }).default("50.00"),
  
  // Moral consequences
  corruptionGained: decimal("corruption_gained", { precision: 5, scale: 2 }).default("30.00"),
  victimHarm: decimal("victim_harm", { precision: 15, scale: 2 }).notNull(),
  
  // Metadata
  stealMethod: text("steal_method").default("vulture"), // 'vulture', 'predator', 'scavenger'
  stolenAt: timestamp("stolen_at").defaultNow(),
}, (table) => [
  index("idx_stolen_positions_thief").on(table.thiefId),
  index("idx_stolen_positions_victim").on(table.victimId),
  index("idx_stolen_positions_stolen_at").on(table.stolenAt),
]);

// Trader Warfare - Records of trader-vs-trader conflicts
export const traderWarfare = pgTable("trader_warfare", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  attackerId: varchar("attacker_id").notNull().references(() => users.id),
  defenderId: varchar("defender_id").notNull().references(() => users.id),
  
  // Warfare details
  warfareType: text("warfare_type").notNull(), // 'steal', 'raid', 'cannibalize', 'hunt'
  outcome: text("outcome").notNull(), // 'success', 'failed', 'partial', 'mutual_destruction'
  
  // Damage and rewards
  attackerGain: decimal("attacker_gain", { precision: 15, scale: 2 }).default("0.00"),
  defenderLoss: decimal("defender_loss", { precision: 15, scale: 2 }).default("0.00"),
  collateralDamage: decimal("collateral_damage", { precision: 15, scale: 2 }).default("0.00"),
  
  // Brutality metrics
  brutalityScore: decimal("brutality_score", { precision: 5, scale: 2 }).default("0.00"),
  victimsCreated: integer("victims_created").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_trader_warfare_attacker").on(table.attackerId),
  index("idx_trader_warfare_defender").on(table.defenderId),
  index("idx_trader_warfare_created").on(table.createdAt),
]);

// Create insert schemas for Warfare System
export const insertShadowTraderSchema = createInsertSchema(shadowTraders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStolenPositionSchema = createInsertSchema(stolenPositions).omit({
  id: true,
  stolenAt: true,
});

export const insertTraderWarfareSchema = createInsertSchema(traderWarfare).omit({
  id: true,
  createdAt: true,
});

// Export TypeScript types for Warfare System
export type ShadowTrader = typeof shadowTraders.$inferSelect;
export type InsertShadowTrader = z.infer<typeof insertShadowTraderSchema>;

export type StolenPosition = typeof stolenPositions.$inferSelect;
export type InsertStolenPosition = z.infer<typeof insertStolenPositionSchema>;

export type TraderWarfare = typeof traderWarfare.$inferSelect;
export type InsertTraderWarfare = z.infer<typeof insertTraderWarfareSchema>;

// ==================== NPC Autonomous Traders System ====================
// 1000 autonomous traders with diverse personalities and behaviors

// NPC Traders - Core identity and attributes
export const npcTraders = pgTable("npc_traders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  personalityArchetype: text("personality_archetype").notNull(), // 'whale', 'day_trader', 'value_investor', 'momentum_chaser', 'contrarian', 'swing_trader', 'dividend_hunter', 'options_gambler', 'index_hugger', 'panic_seller'
  riskTolerance: decimal("risk_tolerance", { precision: 5, scale: 2 }).notNull(), // 0-100
  skillLevel: integer("skill_level").notNull(), // 1-10
  startingCapital: decimal("starting_capital", { precision: 15, scale: 2 }).notNull(),
  currentCapital: decimal("current_capital", { precision: 15, scale: 2 }).notNull(),
  totalTrades: integer("total_trades").default(0),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).default("0.00"), // Percentage of profitable trades
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// NPC Trader Strategies - Trading strategy preferences
export const npcTraderStrategies = pgTable("npc_trader_strategies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  traderId: varchar("trader_id").notNull().references(() => npcTraders.id),
  preferredAssets: text("preferred_assets").array(), // Asset IDs they favor
  holdingPeriodDays: integer("holding_period_days").notNull(), // Typical hold time
  positionSizingStrategy: text("position_sizing_strategy").notNull(), // 'fixed', 'percentage', 'kelly_criterion'
  maxPositionSize: decimal("max_position_size", { precision: 5, scale: 2 }).notNull(), // Max % of capital per position
  stopLossPercent: decimal("stop_loss_percent", { precision: 5, scale: 2 }), // Automatic loss cut-off
  takeProfitPercent: decimal("take_profit_percent", { precision: 5, scale: 2 }), // Automatic gain target
});

// NPC Trader Psychology - Behavioral triggers and emotions
export const npcTraderPsychology = pgTable("npc_trader_psychology", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  traderId: varchar("trader_id").notNull().references(() => npcTraders.id),
  panicThreshold: decimal("panic_threshold", { precision: 5, scale: 2 }).notNull(), // Price drop % that triggers sell
  greedThreshold: decimal("greed_threshold", { precision: 5, scale: 2 }).notNull(), // Gain % that triggers buy
  fomoSusceptibility: integer("fomo_susceptibility").notNull(), // 1-10, tendency to chase trends
  confidenceBias: integer("confidence_bias").notNull(), // 1-10, overconfidence level
  lossCutSpeed: text("loss_cut_speed").notNull(), // 'instant', 'slow', 'never'
  newsReaction: text("news_reaction").notNull(), // 'ignore', 'consider', 'emotional'
});

// NPC Trader Positions - Current holdings
export const npcTraderPositions = pgTable("npc_trader_positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  traderId: varchar("trader_id").notNull().references(() => npcTraders.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  quantity: integer("quantity").notNull(), // Shares held
  entryPrice: decimal("entry_price", { precision: 10, scale: 2 }).notNull(), // Avg purchase price
  entryDate: timestamp("entry_date").notNull(), // When position opened
  unrealizedPnl: decimal("unrealized_pnl", { precision: 10, scale: 2 }).default("0.00"), // Current profit/loss
  targetExitPrice: decimal("target_exit_price", { precision: 10, scale: 2 }), // Planned sell price (nullable)
});

// NPC Trader Activity Log - Trading history
export const npcTraderActivityLog = pgTable("npc_trader_activity_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  traderId: varchar("trader_id").notNull().references(() => npcTraders.id),
  action: text("action").notNull(), // 'buy', 'sell', 'hold', 'analyze'
  assetId: varchar("asset_id").references(() => assets.id), // Nullable for non-trade actions
  quantity: integer("quantity"), // Nullable for non-trade actions
  price: decimal("price", { precision: 10, scale: 2 }), // Nullable for non-trade actions
  reasoning: text("reasoning"), // Why they made this decision
  timestamp: timestamp("timestamp").defaultNow(),
});

// Create insert schemas for NPC Traders
export const insertNpcTraderSchema = createInsertSchema(npcTraders).omit({
  id: true,
  createdAt: true,
});

export const insertNpcTraderStrategySchema = createInsertSchema(npcTraderStrategies).omit({
  id: true,
});

export const insertNpcTraderPsychologySchema = createInsertSchema(npcTraderPsychology).omit({
  id: true,
});

export const insertNpcTraderPositionSchema = createInsertSchema(npcTraderPositions).omit({
  id: true,
});

export const insertNpcTraderActivityLogSchema = createInsertSchema(npcTraderActivityLog).omit({
  id: true,
  timestamp: true,
});

// Export TypeScript types for NPC Traders
export type NpcTrader = typeof npcTraders.$inferSelect;
export type InsertNpcTrader = z.infer<typeof insertNpcTraderSchema>;

export type NpcTraderStrategy = typeof npcTraderStrategies.$inferSelect;
export type InsertNpcTraderStrategy = z.infer<typeof insertNpcTraderStrategySchema>;

export type NpcTraderPsychology = typeof npcTraderPsychology.$inferSelect;
export type InsertNpcTraderPsychology = z.infer<typeof insertNpcTraderPsychologySchema>;

export type NpcTraderPosition = typeof npcTraderPositions.$inferSelect;
export type InsertNpcTraderPosition = z.infer<typeof insertNpcTraderPositionSchema>;

export type NpcTraderActivityLog = typeof npcTraderActivityLog.$inferSelect;
export type InsertNpcTraderActivityLog = z.infer<typeof insertNpcTraderActivityLogSchema>;

// Alignment tracking schemas for hidden psychological profiling
export const insertAlignmentScoreSchema = createInsertSchema(alignmentScores).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAlignmentScore = z.infer<typeof insertAlignmentScoreSchema>;
export type AlignmentScore = typeof alignmentScores.$inferSelect;

export const insertUserDecisionSchema = createInsertSchema(userDecisions).omit({ id: true, createdAt: true });
export type InsertUserDecision = z.infer<typeof insertUserDecisionSchema>;
export type UserDecision = typeof userDecisions.$inferSelect;

// Psychological Profiling Entry Test - Type exports
export const insertTestQuestionSchema = createInsertSchema(testQuestions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestResponseSchema = createInsertSchema(testResponses).omit({
  id: true,
  respondedAt: true,
});

export const insertTestResultsSchema = createInsertSchema(testResults).omit({
  id: true,
  completedAt: true,
});

export const insertTestSessionsSchema = createInsertSchema(testSessions).omit({
  id: true,
  startedAt: true,
  lastActivityAt: true,
});

export type TestQuestion = typeof testQuestions.$inferSelect;
export type InsertTestQuestion = z.infer<typeof insertTestQuestionSchema>;

export type TestResponse = typeof testResponses.$inferSelect;
export type InsertTestResponse = z.infer<typeof insertTestResponseSchema>;

export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = z.infer<typeof insertTestResultsSchema>;

export type TestSession = typeof testSessions.$inferSelect;
export type InsertTestSession = z.infer<typeof insertTestSessionsSchema>;

// Seven Houses of Paneltown - Type exports
export const insertSevenHousesSchema = createInsertSchema(sevenHouses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHousePowerRankingsSchema = createInsertSchema(housePowerRankings).omit({
  id: true,
  createdAt: true,
});

export const insertHouseMarketEventsSchema = createInsertSchema(houseMarketEvents).omit({
  id: true,
  createdAt: true,
  eventTimestamp: true,
});

export type SevenHouse = typeof sevenHouses.$inferSelect;
export type InsertSevenHouse = z.infer<typeof insertSevenHousesSchema>;

export type HousePowerRanking = typeof housePowerRankings.$inferSelect;
export type InsertHousePowerRanking = z.infer<typeof insertHousePowerRankingsSchema>;

export type HouseMarketEvent = typeof houseMarketEvents.$inferSelect;
export type InsertHouseMarketEvent = z.infer<typeof insertHouseMarketEventsSchema>;
