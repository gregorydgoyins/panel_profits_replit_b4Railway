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
  percentChange: decimal("percent_change", { precision: 5, scale: 2 }),
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
  dayChangePercent: decimal("day_change_percent", { precision: 5, scale: 2 }),
  totalReturn: decimal("total_return", { precision: 10, scale: 2 }),
  totalReturnPercent: decimal("total_return_percent", { precision: 5, scale: 2 }),
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
  unrealizedGainLossPercent: decimal("unrealized_gain_loss_percent", { precision: 5, scale: 2 }),
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
  percentChange: decimal("percent_change", { precision: 5, scale: 2 }),
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
  totalReturnPercent: decimal("total_return_percent", { precision: 5, scale: 2 }).default("0"),
  currentRank: integer("current_rank"),
  trades: integer("trades").default(0),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }),
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
  progress: decimal("progress", { precision: 5, scale: 2 }).default("0"), // 0-100%
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
  aiPrediction: decimal('ai_prediction', { precision: 5, scale: 2 }).notNull(),
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
  predictedChange: decimal('predicted_change', { precision: 5, scale: 2 }).notNull(),
  submissionTime: timestamp('submission_time').defaultNow().notNull(),
  actualChange: decimal('actual_change', { precision: 5, scale: 2 }),
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
  accuracy: decimal('accuracy', { precision: 5, scale: 2 }).default('0'),
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
  marketInfluence: decimal("market_influence", { precision: 5, scale: 2 }), // 0-100 score
  trendingScore: decimal("trending_score", { precision: 5, scale: 2 }), // Current trending
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
  confidenceScore: decimal("confidence_score", { precision: 5, scale: 2 }).notNull(), // 0-100 percentage
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
  sessionProfitPercent: decimal("session_profit_percent", { precision: 5, scale: 2 }).default("0.00"),
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
  dayChangePercent: decimal("day_change_percent", { precision: 5, scale: 2 }),
  weekHigh: decimal("week_high", { precision: 10, scale: 2 }), // 52-week high price
  volume: integer("volume").default(0),
  lastTradePrice: decimal("last_trade_price", { precision: 10, scale: 2 }),
  lastTradeQuantity: decimal("last_trade_quantity", { precision: 10, scale: 4 }),
  lastTradeTime: timestamp("last_trade_time"),
  // Market status
  marketStatus: text("market_status").default("open"), // 'open', 'closed', 'suspended'
  priceSource: text("price_source").default("simulation"), // 'simulation', 'external_api', 'manual'
  // Volatility and risk metrics
  volatility: decimal("volatility", { precision: 5, scale: 2 }), // Price volatility percentage
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
  percentageThreshold: decimal("percentage_threshold", { precision: 5, scale: 2 }), // For percentage-based alerts
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
  tradingBonusPercent: decimal("trading_bonus_percent", { precision: 5, scale: 2 }).default("0.00"),
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
  averagePerformance: decimal("average_performance", { precision: 5, scale: 2 }).default("0.00"),
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
  houseLoyalty: decimal("house_loyalty", { precision: 5, scale: 2 }).default("0.00"), // 0-100
  houseContributions: integer("house_contributions").default(0),
  houseRank: integer("house_rank"),
  // House bonuses and penalties
  currentBonusPercent: decimal("current_bonus_percent", { precision: 5, scale: 2 }).default("0.00"),
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
  alignmentStrength: decimal("alignment_strength", { precision: 5, scale: 2 }).default("0.00"), // How locked in
  // Behavioral tracking (hidden from user until Reckoning)
  honestyScore: decimal("honesty_score", { precision: 5, scale: 2 }).default("50.00"), // 0-100
  cooperationScore: decimal("cooperation_score", { precision: 5, scale: 2 }).default("50.00"), // 0-100
  exploitationScore: decimal("exploitation_score", { precision: 5, scale: 2 }).default("0.00"), // 0-100
  generosityScore: decimal("generosity_score", { precision: 5, scale: 2 }).default("50.00"), // 0-100
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
  karmaImpact: decimal("karma_impact", { precision: 5, scale: 2 }).notNull(), // Can be negative
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
  powerLevel: decimal("power_level", { precision: 5, scale: 2 }), // Calculated from stats
  battleWinRate: decimal("battle_win_rate", { precision: 5, scale: 2 }), // From battle outcomes
  totalBattles: integer("total_battles").default(0),
  battlesWon: integer("battles_won").default(0),
  // Market influence
  marketValue: decimal("market_value", { precision: 10, scale: 2 }),
  popularityScore: decimal("popularity_score", { precision: 5, scale: 2 }),
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
  marketImpactPercent: decimal("market_impact_percent", { precision: 5, scale: 2 }), // How much this affects character values
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
  priceVolatility: decimal("price_volatility", { precision: 5, scale: 2 }),
  // Collectibility factors
  firstAppearances: text("first_appearances").array(), // Characters first appearing
  significantEvents: text("significant_events").array(),
  keyIssueRating: decimal("key_issue_rating", { precision: 3, scale: 1 }), // 1-10 importance scale
  rarityScore: decimal("rarity_score", { precision: 5, scale: 2 }),
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
  grossToBudgetRatio: decimal("gross_to_budget_ratio", { precision: 5, scale: 2 }),
  // Performance metrics
  domesticPercentage: decimal("domestic_percentage", { precision: 5, scale: 2 }),
  rottenTomatoesScore: integer("rotten_tomatoes_score"),
  isMcuFilm: boolean("is_mcu_film").default(false),
  mcuPhase: text("mcu_phase"),
  // Inflation-adjusted data
  inflationAdjustedGross: decimal("inflation_adjusted_gross", { precision: 15, scale: 2 }),
  inflationAdjustedBudget: decimal("inflation_adjusted_budget", { precision: 15, scale: 2 }),
  // Market impact
  marketImpactScore: decimal("market_impact_score", { precision: 5, scale: 2 }), // How much it affects related assets
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
  completionKarmaBonus: decimal("completion_karma_bonus", { precision: 5, scale: 2 }).default("0.00"),
  tradingSkillBonus: decimal("trading_skill_bonus", { precision: 3, scale: 2 }).default("0.00"),
  houseReputationBonus: decimal("house_reputation_bonus", { precision: 5, scale: 2 }).default("0.00"),
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
  progressPercent: decimal("progress_percent", { precision: 5, scale: 2 }).default("0.00"),
  currentSection: integer("current_section").default(1),
  completedSections: integer("completed_sections").array(),
  timeSpent: integer("time_spent").default(0), // Minutes
  // Assessment results
  quizScores: jsonb("quiz_scores"),
  finalScore: decimal("final_score", { precision: 5, scale: 2 }),
  passingGrade: decimal("passing_grade", { precision: 5, scale: 2 }).default("70.00"),
  attempts: integer("attempts").default(0),
  maxAttempts: integer("max_attempts").default(3),
  // Completion rewards
  karmaEarned: decimal("karma_earned", { precision: 5, scale: 2 }).default("0.00"),
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
  roiPercentage: decimal("roi_percentage", { precision: 5, scale: 2 }).default("0.00"), // Return on investment %
  // Trading activity metrics
  totalTrades: integer("total_trades").default(0),
  profitableTrades: integer("profitable_trades").default(0),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).default("0.00"), // % of profitable trades
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
  maxDrawdown: decimal("max_drawdown", { precision: 5, scale: 2 }), // Max portfolio decline %
  volatility: decimal("volatility", { precision: 5, scale: 2 }), // Portfolio volatility
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
