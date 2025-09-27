import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Loader } from './components/common/Loader';
import { NewsTicker } from './components/news/NewsTicker';
import { NewsNotification } from './components/news/NewsNotification';
import { StockTicker } from './components/tickers/StockTicker';
import { GlobalMarketClocks } from './components/common/GlobalMarketClocks';
import { useSimulationStore } from './store/simulationStore';
import { 
  TrendingUp, TrendingDown, Activity, Crown, BarChart2, Globe,
  Home, DollarSign, Newspaper, Briefcase, Brain, LineChart, Layers, Compass, Zap, Star,
  ShoppingCart, PieChart, Calculator, Target, Shield, AlertTriangle, BookOpen, Users, FileText
} from 'lucide-react';

// Main components
import { Dashboard } from './components/Dashboard';

// Lazy loaded pages
const IdeasPage = lazy(() => import('./pages/IdeasPage').then(module => ({ default: module.IdeasPage })));
const IdeaMappingPage = lazy(() => import('./pages/IdeaMappingPage').then(module => ({ default: module.IdeaMappingPage })));
const KeyComicsPage = lazy(() => import('./pages/KeyComicsPage').then(module => ({ default: module.KeyComicsPage })));

// Trading pages
const TradingPage = lazy(() => import('./pages/trading/TradingPage').then(module => ({ default: module.TradingPage })));
const BuyPage = lazy(() => import('./pages/trading/BuyPage').then(module => ({ default: module.BuyPage })));
const SellPage = lazy(() => import('./pages/trading/SellPage').then(module => ({ default: module.SellPage })));
const ETFsPage = lazy(() => import('./pages/trading/ETFsPage').then(module => ({ default: module.ETFsPage })));

// Character pages
const CharacterStockPage = lazy(() => import('./pages/character/CharacterStockPage').then(module => ({ default: module.CharacterStockPage })));
const HeroStockPage = lazy(() => import('./pages/character/HeroStockPage').then(module => ({ default: module.HeroStockPage })));
const VillainStockPage = lazy(() => import('./pages/character/VillainStockPage').then(module => ({ default: module.VillainStockPage })));
const SidekickStockPage = lazy(() => import('./pages/character/SidekickStockPage').then(module => ({ default: module.SidekickStockPage })));
const HenchmanStockPage = lazy(() => import('./pages/character/HenchmanStockPage').then(module => ({ default: module.HenchmanStockPage })));
const CharacterDetailsPage = lazy(() => import('./pages/character/CharacterDetailsPage').then(module => ({ default: module.CharacterDetailsPage })));

// Creator pages
const CreatorMatrix = lazy(() => import('./components/creator/CreatorMatrix').then(module => ({ default: module.CreatorMatrix })));
const CreatorProfile = lazy(() => import('./components/creator/CreatorProfile').then(module => ({ default: module.CreatorProfile })));

// Location pages
const LocationStockPage = lazy(() => import('./pages/location/LocationStockPage').then(module => ({ default: module.LocationStockPage })));
const HangoutStockPage = lazy(() => import('./pages/location/HangoutStockPage').then(module => ({ default: module.HangoutStockPage })));
const HideoutStockPage = lazy(() => import('./pages/location/HideoutStockPage').then(module => ({ default: module.HideoutStockPage })));
const LocationDetailsPage = lazy(() => import('./pages/location/LocationDetailsPage').then(module => ({ default: module.LocationDetailsPage })));

// Gadget pages
const GadgetStockPage = lazy(() => import('./pages/gadget/GadgetStockPage').then(module => ({ default: module.GadgetStockPage })));
const GadgetDetailsPage = lazy(() => import('./pages/gadget/GadgetDetailsPage').then(module => ({ default: module.GadgetDetailsPage })));

// Bond pages
const BondListPage = lazy(() => import('./pages/bond/BondListPage').then(module => ({ default: module.BondListPage })));
const CreatorBondPage = lazy(() => import('./pages/bond/CreatorBondPage').then(module => ({ default: module.CreatorBondPage })));
const PublisherBondPage = lazy(() => import('./pages/bond/PublisherBondPage').then(module => ({ default: module.PublisherBondPage })));
const SpecialtyBondPage = lazy(() => import('./pages/bond/SpecialtyBondPage').then(module => ({ default: module.SpecialtyBondPage })));
const BondDetailsPage = lazy(() => import('./pages/bond/BondDetailsPage').then(module => ({ default: module.BondDetailsPage })));

// Fund pages
const FundListPage = lazy(() => import('./pages/fund/FundListPage').then(module => ({ default: module.FundListPage })));
const ThemedFundPage = lazy(() => import('./pages/fund/ThemedFundPage').then(module => ({ default: module.ThemedFundPage })));
const CustomFundPage = lazy(() => import('./pages/fund/CustomFundPage').then(module => ({ default: module.CustomFundPage })));
const FundDetailsPage = lazy(() => import('./pages/fund/FundDetailsPage').then(module => ({ default: module.FundDetailsPage })));

// Portfolio pages
const WatchlistPage = lazy(() => import('./pages/portfolio/WatchlistPage').then(module => ({ default: module.WatchlistPage })));
const TradingJournalPage = lazy(() => import('./pages/portfolio/TradingJournalPage').then(module => ({ default: module.TradingJournalPage })));
const ToolsPage = lazy(() => import('./pages/portfolio/ToolsPage').then(module => ({ default: module.ToolsPage })));
const FormulasPage = lazy(() => import('./pages/portfolio/FormulasPage').then(module => ({ default: module.FormulasPage })));

// Options trading pages
const CallsPage = lazy(() => import('./pages/trading/options/CallsPage').then(module => ({ default: module.CallsPage })));
const PutsPage = lazy(() => import('./pages/trading/options/PutsPage').then(module => ({ default: module.PutsPage })));
const LEAPsPage = lazy(() => import('./pages/trading/options/LEAPsPage').then(module => ({ default: module.LEAPsPage })));

// Specialty trading pages
const StraddlesPage = lazy(() => import('./pages/trading/specialty/StraddlesPage').then(module => ({ default: module.StraddlesPage })));
const ButterflysPage = lazy(() => import('./pages/trading/specialty/ButterflysPage').then(module => ({ default: module.ButterflysPage })));
const BullBearStraddlesPage = lazy(() => import('./pages/trading/specialty/BullBearStraddlesPage').then(module => ({ default: module.BullBearStraddlesPage })));
const DerivativesFuturesPage = lazy(() => import('./pages/trading/DerivativesFuturesPage').then(module => ({ default: module.DerivativesFuturesPage })));

// Market pages
const MarketCalendarPage = lazy(() => import('./pages/markets/MarketCalendarPage').then(module => ({ default: module.MarketCalendarPage })));

// Learning pages
const LearningCenter = lazy(() => import('./components/learn/LearningCenter').then(module => ({ default: module.LearningCenter })));
const ComicFundamentalsCoursePage = lazy(() => import('./pages/learn/ComicFundamentalsCoursePage').then(module => ({ default: module.ComicFundamentalsCoursePage })));
const AdvancedOptionsCoursePage = lazy(() => import('./pages/learn/AdvancedOptionsCoursePage').then(module => ({ default: module.AdvancedOptionsCoursePage })));
const PortfolioManagementCoursePage = lazy(() => import('./pages/learn/PortfolioManagementCoursePage').then(module => ({ default: module.PortfolioManagementCoursePage })));

// Technical Analysis pages
const TechnicalAnalysisStudioPage = lazy(() => import('./pages/TechnicalAnalysisStudioPage').then(module => ({ default: module.TechnicalAnalysisStudioPage })));

// News pages
const BlogFeed = lazy(() => import('./components/news/BlogFeed').then(module => ({ default: module.BlogFeed })));
const NewsFeed = lazy(() => import('./components/news/NewsFeed').then(module => ({ default: module.NewsFeed })));
const NewsDetailPage = lazy(() => import('./pages/news/NewsDetailPage').then(module => ({ default: module.NewsDetailPage })));
const NewsManagement = lazy(() => import('./components/news/NewsManagement').then(module => ({ default: module.NewsManagement })));

// Research pages
const ResearchReport = lazy(() => import('./components/research/ResearchReport').then(module => ({ default: module.ResearchReport })));

// Auth pages
const Login = lazy(() => import('./components/auth/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./components/auth/Register').then(module => ({ default: module.Register })));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword').then(module => ({ default: module.ForgotPassword })));
const ResetPassword = lazy(() => import('./components/auth/ResetPassword').then(module => ({ default: module.ResetPassword })));
const UserProfile = lazy(() => import('./components/auth/UserProfile').then(module => ({ default: module.UserProfile })));

// Navigation testing
const NavigationTest = lazy(() => import('./components/navigation/NavigationTest').then(module => ({ default: module.NavigationTest })));

// Video testing
const VideoTestPage = lazy(() => import('./components/VideoTestPage').then(module => ({ default: module.VideoTestPage })));

// Simulation page
const SimulationPage = lazy(() => import('./pages/SimulationPage').then(module => ({ default: module.SimulationPage })));

// Loading fallback
const PageLoader = () => <Loader />;

function App() {
  const location = useLocation();
  const { liveMetrics, marketState, isRunning } = useSimulationStore();
  const [tickerSpeedMultiplier, setTickerSpeedMultiplier] = React.useState(1);
  
  // Calculate overall market sentiment from simulation data
  const marketSentiment = liveMetrics?.avgReturn || 0.025; // Default positive sentiment
  const marketIndex = 14250 + (marketSentiment * 1000); // Fluctuates based on sentiment
  const sentimentPercentage = Math.abs(marketSentiment * 100);
  const isMarketPositive = marketSentiment > 0;
  
  // Calculate dynamic scroll duration based on speed multiplier
  const baseDuration = 389; // Base duration in seconds (20% slower)
  const scrollDuration = `${Math.round(baseDuration / tickerSpeedMultiplier)}s`;
  
  // Navigation items for quick toolbar
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'order-desk', label: 'Order Desk', icon: DollarSign, path: '/trading' },
    { id: 'news', label: 'News', icon: Newspaper, path: '/news' },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, path: '/portfolio' },
    { id: 'ai-lab', label: 'AI Lab', icon: Brain, path: '/ideas' },
    { id: 'charting-studio', label: 'Charting Studio', icon: LineChart, path: '/technical-analysis' },
    { id: 'assets', label: 'Assets', icon: Layers, path: '/characters' }
  ];
  
  return (
    <ErrorBoundary>
      <>
      {/* News Ticker Platform */}
      <div className="bg-slate-700 p-2 mx-4 mt-2 mb-2 rounded-xl">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-2 shadow-xl border border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] hover:border-blue-400 hover:border-2 transition-all">
        <NewsTicker maxItems={50} scrollDuration="450s" />
        </div>
      </div>
      
      {/* Stock Ticker Platform */}
      <div className="bg-slate-700 p-2 mx-4 mt-2 mb-4 rounded-xl">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-2 shadow-xl border border-green-500 hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] hover:border-green-400 hover:border-2 transition-all">
        <StockTicker 
          maxAssets={350} 
          speed={0.0225} 
          showControls={true} 
          scrollDuration={scrollDuration}
          speedMultiplier={tickerSpeedMultiplier}
          onSpeedChange={setTickerSpeedMultiplier}
        />
        </div>
      </div>
      
      {/* Quick Navigation Toolbar */}
      <div className="bg-slate-700 p-2 mx-4 mt-2 mb-4 rounded-xl">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 shadow-xl border border-yellow-500 hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 transition-all">
          <div className="flex items-center space-x-2 flex-shrink-0 pl-0 pr-2 py-1 rounded-md bg-blue-900/50 border border-blue-700/50 mb-4">
            <Compass className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-white font-medium">QUICK NAVIGATION</span>
          </div>
          
          <div className="grid grid-cols-7 gap-3">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = item.icon;
              
              // Define unique colors for each navigation item
              const getItemColors = (itemId: string, isActive: boolean) => {
                const colors = {
                  dashboard: isActive ? 'bg-indigo-600 text-white' : 'bg-indigo-900/30 text-indigo-300 hover:bg-indigo-600 hover:text-white',
                  'order-desk': isActive ? 'bg-green-600 text-white' : 'bg-green-900/30 text-green-300 hover:bg-green-600 hover:text-white',
                  news: isActive ? 'bg-orange-600 text-white' : 'bg-orange-900/30 text-orange-300 hover:bg-orange-600 hover:text-white',
                  portfolio: isActive ? 'bg-purple-600 text-white' : 'bg-purple-900/30 text-purple-300 hover:bg-purple-600 hover:text-white',
                  'ai-lab': isActive ? 'bg-cyan-600 text-white' : 'bg-cyan-900/30 text-cyan-300 hover:bg-cyan-600 hover:text-white',
                  'charting-studio': isActive ? 'bg-pink-600 text-white' : 'bg-pink-900/30 text-pink-300 hover:bg-pink-600 hover:text-white',
                  assets: isActive ? 'bg-yellow-600 text-white' : 'bg-yellow-900/30 text-yellow-300 hover:bg-yellow-600 hover:text-white',
                };
                return colors[itemId as keyof typeof colors] || (isActive ? 'bg-slate-600 text-white' : 'bg-slate-700/50 text-gray-300 hover:text-white');
              };
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] ${getItemColors(item.id, isActive)}`}
                >
                  <IconComponent className="h-5 w-5 mb-1" />
                  <span className="text-xs text-center leading-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Live Market Intelligence Hub */}
      <div className="bg-slate-700 p-2 mx-4 mt-2 mb-4 rounded-xl">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 shadow-xl border border-purple-500 hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 transition-all">
          <div className="flex items-center space-x-2 flex-shrink-0 pl-0 pr-2 py-1 rounded-md bg-purple-900/50 border border-purple-700/50 mb-4">
            <Brain className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-white font-medium">LIVE MARKET INTELLIGENCE HUB</span>
            <div className="ml-auto flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-xs text-purple-300">LIVE</span>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-3">
            {/* Top Gainer Alert */}
            <Link
              to="/characters"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-emerald-900/30 text-emerald-300 hover:bg-emerald-600 hover:text-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <TrendingUp className="h-5 w-5 mb-1 relative z-10" />
              <span className="text-xs text-center leading-tight relative z-10">Top Gainer</span>
              <span className="text-xs font-bold text-center leading-tight relative z-10">SPDR +8.5%</span>
            </Link>
            
            {/* Biggest Loser Alert */}
            <Link
              to="/characters"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-red-900/30 text-red-300 hover:bg-red-600 hover:text-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <TrendingDown className="h-5 w-5 mb-1 relative z-10" />
              <span className="text-xs text-center leading-tight relative z-10">Biggest Drop</span>
              <span className="text-xs font-bold text-center leading-tight relative z-10">LEXL -3.2%</span>
            </Link>
            
            {/* Volume Spike Alert */}
            <Link
              to="/markets"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-orange-900/30 text-orange-300 hover:bg-orange-600 hover:text-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Activity className="h-5 w-5 mb-1 relative z-10" />
              <span className="text-xs text-center leading-tight relative z-10">Volume Spike</span>
              <span className="text-xs font-bold text-center leading-tight relative z-10">ASM300 🔥</span>
            </Link>
            
            {/* AI Confidence Meter */}
            <Link
              to="/ideas"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-cyan-900/30 text-cyan-300 hover:bg-cyan-600 hover:text-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Brain className="h-5 w-5 mb-1 relative z-10" />
              <span className="text-xs text-center leading-tight relative z-10">AI Confidence</span>
              <span className="text-xs font-bold text-center leading-tight relative z-10">{(liveMetrics?.aiConfidence || 87.5).toFixed(0)}% 🤖</span>
            </Link>
            
            {/* Market Fear & Greed Index */}
            <Link
              to="/simulation"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-amber-900/30 text-amber-300 hover:bg-amber-600 hover:text-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Zap className="h-5 w-5 mb-1 relative z-10" />
              <span className="text-xs text-center leading-tight relative z-10">Fear & Greed</span>
              <span className="text-xs font-bold text-center leading-tight relative z-10">
                {isMarketPositive ? 'GREED' : 'FEAR'} {sentimentPercentage.toFixed(0)}
              </span>
            </Link>
            
            {/* Breaking News Alert */}
            <Link
              to="/news"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-pink-900/30 text-pink-300 hover:bg-pink-600 hover:text-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Newspaper className="h-5 w-5 mb-1 relative z-10" />
              <span className="text-xs text-center leading-tight relative z-10">Breaking News</span>
              <span className="text-xs font-bold text-center leading-tight relative z-10">Marvel Q3 📈</span>
            </Link>
            
            {/* Hot Asset of the Hour */}
            <Link
              to="/key-comics"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-violet-900/30 text-violet-300 hover:bg-violet-600 hover:text-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Star className="h-5 w-5 mb-1 relative z-10" />
              <span className="text-xs text-center leading-tight relative z-10">Hot Asset</span>
              <span className="text-xs font-bold text-center leading-tight relative z-10">AF15 🔥⚡</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Trading Desk Hub */}
      <div className="bg-slate-700 p-2 mx-4 mt-2 mb-4 rounded-xl">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 shadow-xl border border-orange-500 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 transition-all">
          <div className="flex items-center space-x-2 flex-shrink-0 pl-0 pr-2 py-1 rounded-md bg-slate-700/50 border border-slate-600/50 mb-4">
            <DollarSign className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-white font-medium">TRADING PLATFORM</span>
          </div>
          
          <div className="grid grid-cols-7 gap-3">
            {/* Buy Assets */}
            <Link
              to="/trading/buy"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-green-900/30 text-green-300 hover:bg-green-600 hover:text-white"
            >
              <ShoppingCart className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">Buy Assets</span>
            </Link>
            
            {/* Sell Assets */}
            <Link
              to="/trading/sell"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-red-900/30 text-red-300 hover:bg-red-600 hover:text-white"
            >
              <DollarSign className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">Sell Assets</span>
            </Link>
            
            {/* ETFs */}
            <Link
              to="/trading/etfs"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-blue-900/30 text-blue-300 hover:bg-blue-600 hover:text-white"
            >
              <PieChart className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">ETFs</span>
            </Link>
            
            {/* Options */}
            <Link
              to="/trading/options/calls"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-purple-900/30 text-purple-300 hover:bg-purple-600 hover:text-white"
            >
              <Calculator className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">Options</span>
            </Link>
            
            {/* Bonds */}
            <Link
              to="/bonds"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-yellow-900/30 text-yellow-300 hover:bg-yellow-600 hover:text-white"
            >
              <Target className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">Bonds</span>
            </Link>
            
            {/* Funds */}
            <Link
              to="/funds"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-indigo-900/30 text-indigo-300 hover:bg-indigo-600 hover:text-white"
            >
              <Shield className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">Funds</span>
            </Link>
            
            {/* Risk Management */}
            <Link
              to="/portfolio/tools"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-orange-900/30 text-orange-300 hover:bg-orange-600 hover:text-white"
            >
              <AlertTriangle className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">Risk Tools</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Learning & Research Hub */}
      <div className="bg-slate-700 p-2 mx-4 mt-2 mb-4 rounded-xl">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 shadow-xl border border-emerald-500 hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 transition-all">
          <div className="flex items-center space-x-2 flex-shrink-0 pl-0 pr-2 py-1 rounded-md bg-emerald-900/50 border border-emerald-700/50 mb-4">
            <BookOpen className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-white font-medium">LEARNING & RESEARCH CENTER</span>
          </div>
          
          <div className="grid grid-cols-7 gap-3">
            {/* Learning Center */}
            <Link
              to="/learn"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-emerald-900/30 text-emerald-300 hover:bg-emerald-600 hover:text-white"
            >
              <BookOpen className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">Learn</span>
            </Link>
            
            {/* Research Reports */}
            <Link
              to="/research"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-red-900/30 text-red-300 hover:bg-red-600 hover:text-white"
            >
              <BarChart2 className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">Research</span>
            </Link>
            
            {/* Market Calendar */}
            <Link
              to="/markets/calendar"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-cyan-900/30 text-cyan-300 hover:bg-cyan-600 hover:text-white"
            >
              <Globe className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">Calendar</span>
            </Link>
            
            {/* Creator Matrix */}
            <Link
              to="/creators"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-pink-900/30 text-pink-300 hover:bg-pink-600 hover:text-white"
            >
              <Users className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">Creators</span>
            </Link>
            
            {/* Locations */}
            <Link
              to="/locations"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-violet-900/30 text-violet-300 hover:bg-violet-600 hover:text-white"
            >
              <Globe className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">Locations</span>
            </Link>
            
            {/* Gadgets */}
            <Link
              to="/gadgets"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-amber-900/30 text-amber-300 hover:bg-amber-600 hover:text-white"
            >
              <Zap className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">Gadgets</span>
            </Link>
            
            {/* Premium Features */}
            <Link
              to="/simulation"
              className="flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] bg-gradient-to-r from-yellow-900/30 to-orange-900/30 text-yellow-300 hover:from-yellow-600 hover:to-orange-600 hover:text-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Crown className="h-5 w-5 mb-1 relative z-10" />
              <span className="text-xs text-center leading-tight relative z-10">Premium</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Market Statistics Dashboard */}
      <div className="bg-slate-700 p-2 mx-4 mt-2 mb-4 rounded-xl">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 shadow-xl border border-pink-500 hover:shadow-[0_0_25px_rgba(236,72,153,0.8)] hover:border-pink-400 hover:border-2 transition-all">
          <div className="flex items-center space-x-2 flex-shrink-0 pl-0 pr-2 py-1 rounded-md bg-yellow-900/50 border border-yellow-700/50 mb-4">
            <BarChart2 className="h-4 w-4 text-pink-400" />
            <span className="text-xs text-white font-medium">MARKET STATISTICS DASHBOARD</span>
            <div className="ml-auto flex items-center space-x-1">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
              <span className="text-xs text-pink-300">LIVE</span>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-3">
            {/* Market Cap */}
            <div className="flex flex-col items-center justify-center p-3 rounded-lg font-medium border border-transparent min-h-[80px] bg-green-900/30 text-green-300 hover:bg-green-600 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 transition-all cursor-default">
              <TrendingUp className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">Market Cap</span>
              <span className="text-xs font-bold text-center leading-tight">
                {(liveMetrics?.totalMarketCap || 125000000000) >= 1e12 
                  ? `${((liveMetrics?.totalMarketCap || 125000000000) / 1e12).toFixed(1)}T CC`
                  : `${((liveMetrics?.totalMarketCap || 125000000000) / 1e9).toFixed(1)}B CC`}
              </span>
            </div>
            
            {/* Volume */}
            <div className="flex flex-col items-center justify-center p-3 rounded-lg font-medium border border-transparent min-h-[80px] bg-blue-900/30 text-blue-300 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 transition-all cursor-default">
              <Activity className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">Volume</span>
              <span className="text-xs font-bold text-center leading-tight">
                {((liveMetrics?.totalTrades || 8547) * 25000) >= 1e9 
                  ? `${(((liveMetrics?.totalTrades || 8547) * 25000) / 1e9).toFixed(1)}B CC`
                  : `${(((liveMetrics?.totalTrades || 8547) * 25000) / 1e6).toFixed(1)}M CC`}
              </span>
            </div>
            
            {/* Day Traders */}
            <div className="flex flex-col items-center justify-center p-3 rounded-lg font-medium border border-transparent min-h-[80px] bg-orange-900/30 text-orange-300 hover:bg-orange-600 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 transition-all cursor-default">
              <Users className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">Day Traders</span>
              <span className="text-xs font-bold text-center leading-tight">
                {Math.min(liveMetrics?.activeTradersCount || 2847, liveMetrics?.totalInvestors || 10000)}/{liveMetrics?.totalInvestors || 10000}
              </span>
            </div>
            
            {/* AI Confidence */}
            <div className="flex flex-col items-center justify-center p-3 rounded-lg font-medium border border-transparent min-h-[80px] bg-purple-900/30 text-purple-300 hover:bg-purple-600 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 transition-all cursor-default">
              <Brain className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">AI Confidence</span>
              <span className="text-xs font-bold text-center leading-tight">
                {(liveMetrics?.aiConfidence || 87.5).toFixed(0)}% 🤖
              </span>
            </div>
            
            {/* Hot Assets */}
            <div className="flex flex-col items-center justify-center p-3 rounded-lg font-medium border border-transparent min-h-[80px] bg-red-900/30 text-red-300 hover:bg-red-600 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 transition-all cursor-default">
              <Star className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight">Hot Assets</span>
              <span className="text-xs font-bold text-center leading-tight">
                {liveMetrics?.hotAssetsCount || 87}/{liveMetrics?.totalAssetsCount || 291}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Main Dashboard */}
            <Route path="/" element={<Dashboard />} />
            
            {/* Ideas Routes */}
            <Route path="/ideas" element={<IdeasPage />} />
            <Route path="/ideas/mapping" element={<IdeaMappingPage />} />
            <Route path="/key-comics" element={<KeyComicsPage />} />
            <Route path="/technical-analysis" element={<TechnicalAnalysisStudioPage />} />
            
            {/* Simulation Route */}
            <Route path="/simulation" element={<SimulationPage />} />
            
            {/* Trading Routes */}
            <Route path="/trading" element={<TradingPage />} />
            <Route path="/trading/buy" element={<BuyPage />} />
            <Route path="/trading/sell" element={<SellPage />} />
            <Route path="/trading/etfs" element={<ETFsPage />} />
            
            {/* Options Trading */}
            <Route path="/trading/options/calls" element={<CallsPage />} />
            <Route path="/trading/options/puts" element={<PutsPage />} />
            <Route path="/trading/options/leaps" element={<LEAPsPage />} />
            
            {/* Specialty Trading */}
            <Route path="/trading/specialty/straddles" element={<StraddlesPage />} />
            <Route path="/trading/specialty/butterflys" element={<ButterflysPage />} />
            <Route path="/trading/specialty/bull-bear-straddles" element={<BullBearStraddlesPage />} />
            <Route path="/trading/derivatives-futures" element={<DerivativesFuturesPage />} />
            
            {/* Character Routes */}
            <Route path="/characters" element={<CharacterStockPage />} />
            <Route path="/characters/heroes" element={<HeroStockPage />} />
            <Route path="/characters/villains" element={<VillainStockPage />} />
            <Route path="/characters/sidekicks" element={<SidekickStockPage />} />
            <Route path="/characters/henchmen" element={<HenchmanStockPage />} />
            <Route path="/character/:symbol" element={<CharacterDetailsPage />} />
            <Route path="/hero/:symbol" element={<CharacterDetailsPage />} />
            <Route path="/villain/:symbol" element={<CharacterDetailsPage />} />
            <Route path="/sidekick/:symbol" element={<CharacterDetailsPage />} />
            <Route path="/henchman/:symbol" element={<CharacterDetailsPage />} />
            
            {/* Creator Routes */}
            <Route path="/creators" element={<CreatorMatrix />} />
            <Route path="/creator/:symbol" element={<CreatorProfile />} />
            <Route path="/creator-stock/:symbol" element={<CreatorProfile />} />
            
            {/* Location Routes */}
            <Route path="/locations" element={<LocationStockPage />} />
            <Route path="/locations/hangouts" element={<HangoutStockPage />} />
            <Route path="/locations/hideouts" element={<HideoutStockPage />} />
            <Route path="/location/:symbol" element={<LocationDetailsPage />} />
            <Route path="/hangout/:symbol" element={<LocationDetailsPage />} />
            <Route path="/hideout/:symbol" element={<LocationDetailsPage />} />
            
            {/* Gadget Routes */}
            <Route path="/gadgets" element={<GadgetStockPage />} />
            <Route path="/gadget/:symbol" element={<GadgetDetailsPage />} />
            
            {/* Bond Routes */}
            <Route path="/bonds" element={<BondListPage />} />
            <Route path="/bonds/creator" element={<CreatorBondPage />} />
            <Route path="/bonds/publisher" element={<PublisherBondPage />} />
            <Route path="/bonds/specialty" element={<SpecialtyBondPage />} />
            <Route path="/bond/:symbol" element={<BondDetailsPage />} />
            
            {/* Fund Routes */}
            <Route path="/funds" element={<FundListPage />} />
            <Route path="/funds/themed" element={<ThemedFundPage />} />
            <Route path="/funds/custom" element={<CustomFundPage />} />
            <Route path="/fund/:symbol" element={<FundDetailsPage />} />
            
            {/* Portfolio Routes */}
            <Route path="/portfolio" element={<WatchlistPage />} />
            <Route path="/portfolio/watchlist" element={<WatchlistPage />} />
            <Route path="/portfolio/journal" element={<TradingJournalPage />} />
            <Route path="/portfolio/tools" element={<ToolsPage />} />
            <Route path="/portfolio/formulas" element={<FormulasPage />} />
            
            {/* Market Routes */}
            <Route path="/markets" element={<MarketCalendarPage />} />
            <Route path="/markets" element={<MarketCalendarPage />} />
            <Route path="/markets/calendar" element={<MarketCalendarPage />} />
            
            {/* Learning Routes */}
            <Route path="/learn" element={<LearningCenter />} />
            <Route path="/learn/comic-fundamentals" element={<ComicFundamentalsCoursePage />} />
            <Route path="/learn/advanced-options" element={<AdvancedOptionsCoursePage />} />
            <Route path="/learn/portfolio-management" element={<PortfolioManagementCoursePage />} />
            
            {/* News Routes */}
            <Route path="/news" element={<NewsFeed />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/news/manage" element={<NewsManagement userRole="admin" />} />
            <Route path="/blog" element={<BlogFeed />} />
            
            {/* Research Routes */}
            <Route path="/research" element={<ResearchReport />} />
            
            {/* Technical Analysis Routes */}
            <Route path="/technical-analysis" element={<TechnicalAnalysisStudioPage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<UserProfile />} />
            
            {/* Testing Routes */}
            <Route path="/navigation-test" element={<NavigationTest />} />
            <Route path="/video-test" element={<VideoTestPage />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </Layout>
      </>
    </ErrorBoundary>
  );
}

export default App;