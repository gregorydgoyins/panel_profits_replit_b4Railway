import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
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
  createdAt: timestamp("created_at").defaultNow(),
});

// Market indices (CCIX, PPIX100, etc.)
export const marketIndices = pgTable("market_indices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  constituents: jsonb("constituents"), // Array of asset IDs with weights
  createdAt: timestamp("created_at").defaultNow(),
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
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
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

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

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
