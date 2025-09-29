import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean, jsonb, vector, index } from "drizzle-orm/pg-core";
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

// Asset types: characters, comics, creators, publishers
export const assets = pgTable("assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'character', 'comic', 'creator', 'publisher'
  description: text("description"),
  imageUrl: text("image_url"),
  metadata: jsonb("metadata"), // Additional asset-specific data
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

// Phase 1 Trading Extensions

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

// NPC/AI Trading System
export const npcTraders = pgTable("npc_traders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  traderName: text("trader_name").notNull(),
  traderType: text("trader_type").notNull(), // 'whale', 'momentum', 'contrarian', 'arbitrage', 'market_maker'
  firmId: varchar("firm_id").references(() => tradingFirms.id),
  // Behavioral Characteristics
  tradingPersonality: jsonb("trading_personality"), // Risk tolerance, preferred strategies, etc.
  preferredAssets: text("preferred_assets").array(), // Asset types or specific assets
  avoidedAssets: text("avoided_assets").array(),
  tradingStyle: text("trading_style").notNull(), // 'aggressive', 'conservative', 'systematic'
  // Capital & Capacity
  availableCapital: decimal("available_capital", { precision: 15, scale: 2 }).notNull(),
  maxPositionSize: decimal("max_position_size", { precision: 15, scale: 2 }),
  maxDailyVolume: decimal("max_daily_volume", { precision: 15, scale: 2 }),
  leveragePreference: decimal("leverage_preference", { precision: 8, scale: 2 }).default("1.00"),
  // AI Behavior Parameters
  aggressiveness: decimal("aggressiveness", { precision: 8, scale: 2 }).default("50.00"), // 0-100 scale
  intelligence: decimal("intelligence", { precision: 8, scale: 2 }).default("50.00"), // 0-100 scale
  emotionality: decimal("emotionality", { precision: 8, scale: 2 }).default("50.00"), // 0-100 scale
  adaptability: decimal("adaptability", { precision: 8, scale: 2 }).default("50.00"), // 0-100 scale
  // Trading Frequency
  tradesPerDay: integer("trades_per_day").default(10),
  minTimeBetweenTrades: integer("min_time_between_trades_minutes").default(15),
  // Performance Tracking
  totalTrades: integer("total_trades").default(0),
  winRate: decimal("win_rate", { precision: 8, scale: 2 }),
  avgTradeReturn: decimal("avg_trade_return", { precision: 8, scale: 4 }),
  totalPnL: decimal("total_pnl", { precision: 15, scale: 2 }).default("0.00"),
  sharpeRatio: decimal("sharpe_ratio", { precision: 8, scale: 4 }),
  maxDrawdown: decimal("max_drawdown", { precision: 8, scale: 2 }),
  // Status and Control
  isActive: boolean("is_active").default(true),
  lastTradeTime: timestamp("last_trade_time"),
  nextTradeTime: timestamp("next_trade_time"),
  pausedUntil: timestamp("paused_until"), // Temporary pause
  influenceOnMarket: decimal("influence_on_market", { precision: 8, scale: 4 }).default("0.0001"),
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

export const insertNpcTraderSchema = createInsertSchema(npcTraders).omit({
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

export type NpcTrader = typeof npcTraders.$inferSelect;
export type InsertNpcTrader = z.infer<typeof insertNpcTraderSchema>;

export type InformationTier = typeof informationTiers.$inferSelect;
export type InsertInformationTier = z.infer<typeof insertInformationTierSchema>;

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
