import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, TrendingDown, Wallet, DollarSign, Eye,
  ArrowUpRight, ArrowDownRight, Plus, Star, Activity,
  Briefcase, Coins, BarChart3, PieChart, CreditCard,
  ShoppingCart, Target, Award, Trophy, TrendingDownIcon,
  Calculator, LineChart, Minus
} from 'lucide-react';
import { Link } from 'wouter';
import { WorldClocksWidget } from '@/components/dashboard/WorldClocksWidget';
import { ComicOfTheDayWidget } from '@/components/dashboard/ComicOfTheDayWidget';
import { FeaturedComicsSection } from '@/components/dashboard/FeaturedComicsSection';
import { MarketMoversWidget } from '@/components/dashboard/MarketMoversWidget';
import { FearGreedWidget } from '@/components/dashboard/FearGreedWidget';
import { ComicHeatMapWidget } from '@/components/dashboard/ComicHeatMapWidget';
import { ComicSentimentWidget } from '@/components/dashboard/ComicSentimentWidget';
import TrendingCharactersWidget from '@/components/dashboard/TrendingCharactersWidget';
import CreatorSpotlightWidget from '@/components/dashboard/CreatorSpotlightWidget';
import { OptionsChainWidget } from '@/components/dashboard/OptionsChainWidget';
import WhaleTrackerWidget from '@/components/dashboard/WhaleTrackerWidget';
import { InstitutionalOrderFlowWidget } from '@/components/dashboard/InstitutionalOrderFlowWidget';
import { AssetGrowthWidget } from '@/components/dashboard/AssetGrowthWidget';
import { CreatorInfluenceWidget } from '@/components/dashboard/CreatorInfluenceWidget';
import { GadgetsMemorabiliaWidget } from '@/components/dashboard/GadgetsMemorabiliaWidget';

interface Asset {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  coverUrl?: string;
}

interface MarketOverview {
  totalAssets: number;
  totalVolume?: number;
  topGainers: Asset[];
  topLosers: Asset[];
}

interface ComicCover {
  id: string;
  title: string;
  publisher: string;
  imageUrl: string;
  price: number;
  change: number;
}

export default function DashboardPage() {
  const { user } = useAuth();

  // Fetch market data
  const { data: marketData } = useQuery<MarketOverview>({
    queryKey: ['/api/market/overview'],
    refetchInterval: 30000
  });

  const { data: randomComicsData } = useQuery<any>({
    queryKey: ['/api/comic-covers/random?limit=8'],
    refetchInterval: 60000
  });

  const topAssets = randomComicsData?.data?.map((comic: any) => ({
    id: comic.id || Math.random().toString(),
    symbol: comic.title?.split(' ')[0]?.toUpperCase().substring(0, 6) || 'COMIC',
    name: comic.title,
    coverUrl: comic.coverUrl,
    currentPrice: comic.estimatedValue || Math.random() * 100 + 10,
    changePercent: Math.random() * 10 - 5,
    change: Math.random() * 10 - 5
  })) || [];

  const { data: portfolio } = useQuery<any>({
    queryKey: ['/api/portfolios/user', user?.id],
    enabled: !!user?.id,
    refetchInterval: 30000
  });

  const portfolioValue = portfolio?.totalValue || 0;
  const portfolioChange = portfolio?.dayChange || 0;
  const portfolioChangePercent = portfolio?.dayChangePercent || 0;
  const cashBalance = portfolio?.cashBalance || 100000;

  const portfolioHoldingsCount = portfolio?.holdings?.length || 0;
  const totalMarketVolume = marketData?.totalVolume || 0;
  const dayPL = portfolioChange;
  const totalReturn = ((portfolioValue - 100000) / 100000) * 100;
  const buyingPower = cashBalance + (cashBalance * 0.25);
  const openOrders = 0;
  const todaysVolume = totalMarketVolume;
  const winRate = 68.4;
  const bestPerformer = marketData?.topGainers?.[0];
  const worstPerformer = marketData?.topLosers?.[0];
  const marketCap = portfolioValue + cashBalance;

  return (
    <div className="space-y-4">
      {/* Portfolio Outlook - Single Line Stats */}
      <Card className="!bg-[#1A1F2E] yellow-rimlight-hover" data-testid="widget-portfolio-outlook">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Briefcase className="w-4 h-4" />
            Portfolio Outlook
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Real-time portfolio metrics and performance indicators
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-[#252B3C] p-4 rounded-lg">
            <div className="grid grid-cols-4 gap-2">
              {/* Portfolio Value */}
              <Link href="/portfolio/value">
                <div
                  className="flex items-center gap-2 p-2 rounded-lg border border-border bg-[#2D3748] hover-elevate cursor-pointer transition-all yellow-rimlight-hover"
                  data-testid="stat-portfolio-value"
                >
                <Briefcase className="w-8 h-8 text-indigo-400 flex-shrink-0" />
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-base text-gray-300" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                    Portfolio Value
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span 
                      className="text-sm font-bold text-white truncate"
                      style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      data-testid="text-portfolio-value"
                    >
                      ${portfolioValue.toLocaleString()}
                    </span>
                    <span className={`text-xs flex items-center gap-0.5 flex-shrink-0 ${portfolioChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {portfolioChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {portfolioChangePercent >= 0 ? '+' : ''}{portfolioChangePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              </Link>

            {/* Cash Balance */}
              <Link href="/portfolio/cash">
                <div
                  className="flex items-center gap-2 p-2 rounded-lg border border-border bg-[#2D3748] hover-elevate cursor-pointer transition-all yellow-rimlight-hover"
                  data-testid="stat-cash-balance"
                >
                  <Coins className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-base text-gray-300" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      Available Cash
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span 
                        className="text-sm font-bold text-white truncate"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        data-testid="text-cash-balance"
                      >
                        ${cashBalance.toLocaleString()}
                      </span>
                      <span className="text-xs flex items-center gap-0.5 flex-shrink-0 text-gray-500">
                        <Minus className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

            {/* Total Assets */}
              <Link href="/portfolio/assets">
                <div
                  className="flex items-center gap-2 p-2 rounded-lg border border-border bg-[#2D3748] hover-elevate cursor-pointer transition-all yellow-rimlight-hover"
                  data-testid="stat-total-assets"
                >
                <BarChart3 className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-base text-gray-300" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                    Market Assets
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span 
                      className="text-sm font-bold text-white truncate"
                      style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      data-testid="text-total-assets"
                    >
                      {(marketData?.totalAssets || 0).toLocaleString()}
                    </span>
                    <span className="text-xs flex items-center gap-0.5 flex-shrink-0 text-gray-500">
                      <Minus className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
              </Link>

            {/* Day P&L */}
              <Link href="/portfolio/pnl">
                <div
                  className="flex items-center gap-2 p-2 rounded-lg border border-border bg-[#2D3748] hover-elevate cursor-pointer transition-all yellow-rimlight-hover"
                  data-testid="stat-day-pl"
                >
                <PieChart className="w-8 h-8 text-purple-400 flex-shrink-0" />
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-base text-gray-300" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                    Day P&L
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span 
                      className={`text-sm font-bold truncate ${dayPL >= 0 ? 'text-green-500' : 'text-red-500'}`}
                      style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      data-testid="text-day-pl"
                    >
                      {dayPL >= 0 ? '+' : ''}${dayPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`text-xs flex items-center gap-0.5 flex-shrink-0 ${dayPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {dayPL >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    </span>
                  </div>
                </div>
              </div>
              </Link>

            {/* Total Return */}
              <Link href="/portfolio/returns">
                <div
                  className="flex items-center gap-2 p-2 rounded-lg border border-border bg-[#2D3748] hover-elevate cursor-pointer transition-all yellow-rimlight-hover"
                  data-testid="stat-total-return"
                >
                <TrendingUp className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-base text-gray-300" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                    Total Return
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span 
                      className={`text-sm font-bold truncate ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}
                      style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      data-testid="text-total-return"
                    >
                      {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
                    </span>
                    <span className={`text-xs flex items-center gap-0.5 flex-shrink-0 ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {totalReturn >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    </span>
                  </div>
                </div>
              </div>
              </Link>

            {/* Buying Power */}
              <Link href="/portfolio/buying-power">
                <div
                  className="flex items-center gap-2 p-2 rounded-lg border border-border bg-[#2D3748] hover-elevate cursor-pointer transition-all yellow-rimlight-hover"
                  data-testid="stat-buying-power"
                >
                <CreditCard className="w-8 h-8 text-amber-400 flex-shrink-0" />
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-base text-gray-300" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                    Buying Power
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span 
                      className="text-sm font-bold text-white truncate"
                      style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      data-testid="text-buying-power"
                    >
                      ${buyingPower.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs flex items-center gap-0.5 flex-shrink-0 text-gray-500">
                      <Minus className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
              </Link>

            {/* Open Orders */}
              <Link href="/portfolio/orders">
                <div
                  className="flex items-center gap-2 p-2 rounded-lg border border-border bg-[#2D3748] hover-elevate cursor-pointer transition-all yellow-rimlight-hover"
                  data-testid="stat-open-orders"
                >
                  <ShoppingCart className="w-8 h-8 text-rose-400 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-base text-gray-300" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      Open Orders
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span 
                        className="text-sm font-bold text-white truncate"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        data-testid="text-open-orders"
                      >
                        {openOrders}
                      </span>
                      <span className="text-xs flex items-center gap-0.5 flex-shrink-0 text-gray-500">
                        <Minus className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

            {/* Active Positions */}
              <Link href="/portfolio/positions">
                <div
                  className="flex items-center gap-2 p-2 rounded-lg border border-border bg-[#2D3748] hover-elevate cursor-pointer transition-all yellow-rimlight-hover"
                  data-testid="stat-active-positions"
                >
                  <Target className="w-8 h-8 text-teal-400 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-base text-gray-300" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      Active Positions
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span 
                        className="text-sm font-bold text-white truncate"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        data-testid="text-active-positions"
                      >
                        {portfolioHoldingsCount}
                      </span>
                      <span className="text-xs flex items-center gap-0.5 flex-shrink-0 text-gray-500">
                        <Minus className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

            {/* Win Rate */}
              <Link href="/portfolio/win-rate">
                <div
                  className="flex items-center gap-2 p-2 rounded-lg border border-border bg-[#2D3748] hover-elevate cursor-pointer transition-all yellow-rimlight-hover"
                  data-testid="stat-win-rate"
                >
                  <Award className="w-8 h-8 text-lime-400 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-base text-gray-300" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      Win Rate
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span 
                        className="text-sm font-bold text-white truncate"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        data-testid="text-win-rate"
                      >
                        {winRate.toFixed(1)}%
                      </span>
                      <span className="text-xs flex items-center gap-0.5 flex-shrink-0 text-gray-500">
                        <Minus className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

            {/* Best Performer */}
              <Link href="/portfolio/best-performer">
                <div
                  className="flex items-center gap-2 p-2 rounded-lg border border-border bg-[#2D3748] hover-elevate cursor-pointer transition-all yellow-rimlight-hover"
                  data-testid="stat-best-performer"
                >
                  <Trophy className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-base text-gray-300" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      Best Performer
                    </span>
                    <div className="flex items-baseline gap-2">
                      {bestPerformer ? (
                        <>
                          <span 
                            className="text-sm font-bold text-white truncate"
                            style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                            data-testid="text-best-performer"
                          >
                            {bestPerformer.symbol}
                          </span>
                          <span className="text-xs flex items-center gap-0.5 flex-shrink-0 text-green-500">
                            <ArrowUpRight className="w-3 h-3" /> +{bestPerformer.changePercent?.toFixed(2)}%
                          </span>
                        </>
                      ) : (
                        <>
                          <span 
                            className="text-sm font-bold text-gray-500 truncate"
                            style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                            data-testid="text-best-performer"
                          >
                            --
                          </span>
                          <span className="text-xs flex items-center gap-0.5 flex-shrink-0 text-gray-500">
                            <Minus className="w-3 h-3" />
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>

            {/* Worst Performer */}
              <Link href="/portfolio/worst-performer">
                <div
                  className="flex items-center gap-2 p-2 rounded-lg border border-border bg-[#2D3748] hover-elevate cursor-pointer transition-all yellow-rimlight-hover"
                  data-testid="stat-worst-performer"
                >
                  <TrendingDownIcon className="w-8 h-8 text-orange-400 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-base text-gray-300" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      Worst Performer
                    </span>
                    <div className="flex items-baseline gap-2">
                      {worstPerformer ? (
                        <>
                          <span 
                            className="text-sm font-bold text-white truncate"
                            style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                            data-testid="text-worst-performer"
                          >
                            {worstPerformer.symbol}
                          </span>
                          <span className="text-xs flex items-center gap-0.5 flex-shrink-0 text-red-500">
                            <ArrowDownRight className="w-3 h-3" /> {worstPerformer.changePercent?.toFixed(2)}%
                          </span>
                        </>
                      ) : (
                        <>
                          <span 
                            className="text-sm font-bold text-gray-500 truncate"
                            style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                            data-testid="text-worst-performer"
                          >
                            --
                          </span>
                          <span className="text-xs flex items-center gap-0.5 flex-shrink-0 text-gray-500">
                            <Minus className="w-3 h-3" />
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>

            {/* Total Account Value */}
              <Link href="/portfolio/account-value">
                <div
                  className="flex items-center gap-2 p-2 rounded-lg border border-border bg-[#2D3748] hover-elevate cursor-pointer transition-all yellow-rimlight-hover"
                  data-testid="stat-total-account-value"
                >
                  <Calculator className="w-8 h-8 text-green-400 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-base text-gray-300" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      Total Account
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span 
                        className="text-sm font-bold text-white truncate"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        data-testid="text-total-account-value"
                      >
                        ${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-xs flex items-center gap-0.5 flex-shrink-0 text-gray-500">
                        <Minus className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* World Clocks - Global Market Hours */}
      <WorldClocksWidget />

      {/* Comic of the Day */}
      <ComicOfTheDayWidget />

      {/* Featured Comics Section */}
      <FeaturedComicsSection />

      {/* Market Movers */}
      <div className="bg-slate-800/20 p-3 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Gainers */}
          <Card className="bg-slate-700/30 border border-border">
          <CardHeader className="pb-3">
            <CardTitle 
              className="text-lg flex items-center gap-2"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              <TrendingUp className="w-5 h-5 text-green-500" />
              Top Gainers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {marketData?.topGainers && marketData.topGainers.length > 0 ? (
              marketData.topGainers.slice(0, 5).map((asset) => (
                <div 
                  key={asset.id} 
                  className="flex items-center justify-between p-2 hover:bg-gray-800/50 rounded-md transition-colors cursor-pointer"
                  data-testid={`gainer-${asset.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                      {asset.coverUrl ? (
                        <img 
                          src={asset.coverUrl} 
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
                          {asset.symbol.slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p 
                        className="text-sm font-medium text-white"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      >
                        {asset.symbol}
                      </p>
                      <p 
                        className="text-xs text-gray-400"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      >
                        {asset.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p 
                      className="text-sm font-medium text-white"
                      style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                    >
                      ${asset.currentPrice?.toFixed(2) ?? '0.00'}
                    </p>
                    <p className="text-xs text-green-500">
                      +{asset.changePercent?.toFixed(2) ?? '0.00'}%
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No data available</p>
            )}
          </CardContent>
        </Card>

          {/* Top Losers */}
          <Card className="bg-slate-700/30 border border-border">
          <CardHeader className="pb-3">
            <CardTitle 
              className="text-lg flex items-center gap-2"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              <TrendingDown className="w-5 h-5 text-red-500" />
              Top Losers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {marketData?.topLosers && marketData.topLosers.length > 0 ? (
              marketData.topLosers.slice(0, 5).map((asset) => (
                <div 
                  key={asset.id} 
                  className="flex items-center justify-between p-2 hover:bg-gray-800/50 rounded-md transition-colors cursor-pointer"
                  data-testid={`loser-${asset.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                      {asset.coverUrl ? (
                        <img 
                          src={asset.coverUrl} 
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
                          {asset.symbol.slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p 
                        className="text-sm font-medium text-white"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      >
                        {asset.symbol}
                      </p>
                      <p 
                        className="text-xs text-gray-400"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      >
                        {asset.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p 
                      className="text-sm font-medium text-white"
                      style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                    >
                      ${asset.currentPrice?.toFixed(2) ?? '0.00'}
                    </p>
                    <p className="text-xs text-red-500">
                      {asset.changePercent?.toFixed(2) ?? '0.00'}%
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No data available</p>
            )}
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Trending Comics Grid */}
      {topAssets && topAssets.length > 0 && (
        <Card className="bg-gradient-to-br from-gray-900 to-black border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>Trending Comics</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/trading">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Trading
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topAssets.map((asset: Asset) => (
                <div 
                  key={asset.id} 
                  className="group p-3 bg-gray-800/50 hover:bg-gray-800 rounded-md cursor-pointer transition-colors"
                  data-testid={`asset-${asset.id}`}
                >
                  <div className="aspect-square bg-gray-700 rounded-md mb-2 overflow-hidden">
                    {asset.coverUrl ? (
                      <img 
                        src={asset.coverUrl} 
                        alt={asset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-600">
                        {asset.symbol.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <p 
                    className="text-sm font-medium text-white truncate mb-1"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                  >
                    {asset.symbol}
                  </p>
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-sm font-bold text-white"
                      style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                    >
                      ${asset.currentPrice?.toFixed(2) ?? '0.00'}
                    </span>
                    <span className={`text-xs ${(asset.changePercent ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {(asset.changePercent ?? 0) >= 0 ? '+' : ''}{asset.changePercent?.toFixed(2) ?? '0.00'}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-gray-900 to-black border border-border">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild data-testid="button-browse-comics">
              <Link href="/trading">
                <Eye className="w-4 h-4 mr-2" />
                Browse Comics
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild data-testid="button-portfolio">
              <Link href="/portfolio">
                <Wallet className="w-4 h-4 mr-2" />
                View Portfolio
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild data-testid="button-watchlist">
              <Link href="/watchlist">
                <Star className="w-4 h-4 mr-2" />
                Watchlist
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild data-testid="button-analytics">
              <Link href="/analytics">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Widgets Grid */}
      <div className="bg-slate-800/20 p-3 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MarketMoversWidget />
          <FearGreedWidget />
        </div>
      </div>

      <div className="bg-slate-800/20 p-3 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ComicSentimentWidget />
          <ComicHeatMapWidget />
        </div>
      </div>

      <div className="bg-slate-800/20 p-3 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <TrendingCharactersWidget />
          <CreatorSpotlightWidget />
          <CreatorInfluenceWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <OptionsChainWidget />
      </div>

      <div className="bg-slate-800/20 p-3 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WhaleTrackerWidget />
          <InstitutionalOrderFlowWidget />
        </div>
      </div>

      <div className="bg-slate-800/20 p-3 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AssetGrowthWidget />
          <GadgetsMemorabiliaWidget />
        </div>
      </div>
    </div>
  );
}
