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
  orderType: text("order_type").notNull(), // 'market', 'limit', 'stop'
  quantity: decimal("quantity", { precision: 10, scale: 4 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  totalValue: decimal("total_value", { precision: 10, scale: 2 }),
  status: text("status").notNull(), // 'pending', 'filled', 'cancelled'
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
