// User and Authentication Types
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: Date;
  subscription?: SubscriptionTier;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Subscription Types
export type SubscriptionTier = 'free' | 'premium' | 'pro';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  features: string[];
}

// Trading Types
export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Portfolio {
  id: string;
  userId: string;
  assets: PortfolioAsset[];
  totalValue: number;
  totalReturn: number;
  dayChange: number;
}

export interface PortfolioAsset {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
}

// Market Data Types
export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  timestamp: Date;
}

export interface ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Asset Types
export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'etf' | 'bond' | 'option' | 'future';
  category: string;
  description?: string;
  marketCap?: number;
  sector?: string;
  industry?: string;
}

// Simulation Types
export interface InvestorArchetype {
  id: string;
  name: string;
  description: string;
  riskTolerance: 'low' | 'medium' | 'high';
  strategy: string;
  traits: string[];
}

export interface SimulationConfig {
  numInvestors: number;
  timeSteps: number;
  marketConditions: 'bull' | 'bear' | 'sideways';
  volatility: number;
  enableEvents: boolean;
}

export interface SimulationResults {
  totalTrades: number;
  avgReturn: number;
  bestPerformer: string;
  worstPerformer: string;
  marketVolatility: number;
}

// News and Content Types
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: Date;
  category: string;
  tags: string[];
  imageUrl?: string;
}

// Chart Configuration Types
export interface ChartConfig {
  timeframe: '1d' | '1w' | '1m' | '3m' | '1y' | '5y';
  indicators: string[];
  chartType: 'candlestick' | 'line' | 'bar';
  showVolume: boolean;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}