import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, TrendingDown, Wallet, DollarSign, Eye,
  ArrowUpRight, ArrowDownRight, Plus, Star, Activity
} from 'lucide-react';
import { Link } from 'wouter';
import { WorldClocksWidget } from '@/components/dashboard/WorldClocksWidget';
import { ComicOfTheDayWidget } from '@/components/dashboard/ComicOfTheDayWidget';
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
  const [selectedBox, setSelectedBox] = useState<string | null>(null);

  // Fetch market data
  const { data: marketData } = useQuery<MarketOverview>({
    queryKey: ['/api/market/overview'],
    refetchInterval: 30000
  });

  const { data: featuredCoversRaw } = useQuery<any>({
    queryKey: ['/api/comic-covers/featured'],
    refetchInterval: 60000
  });

  const featuredCovers = featuredCoversRaw?.data || featuredCoversRaw;

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
      {/* Hero Section: Portfolio Stats Grid (3x3) */}
      <Card className="border-0" style={{ backgroundColor: 'hsl(270, 40%, 30%)' }}>
        <CardContent className="p-6">
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'hsl(270, 35%, 22%)' }}>
            <div className="grid grid-cols-3 gap-6">
              {/* Portfolio Value */}
              <Card 
                className="bg-gradient-to-br from-gray-900 to-black border border-border hover-elevate cursor-pointer transition-all"
                onClick={() => setSelectedBox(selectedBox === 'portfolio-value' ? null : 'portfolio-value')}
                style={selectedBox === 'portfolio-value' ? { boxShadow: '0 0 8px rgba(234, 179, 8, 0.8), 0 0 15px rgba(234, 179, 8, 0.8)' } : {}}
              >
              <CardHeader className="pb-2">
                <CardTitle 
                  className="text-sm font-medium text-gray-400"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  Portfolio Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span 
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                    data-testid="text-portfolio-value"
                  >
                    ${portfolioValue.toLocaleString()}
                  </span>
                  <span className={`text-sm font-medium flex items-center gap-1 ${portfolioChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {portfolioChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {portfolioChangePercent >= 0 ? '+' : ''}{portfolioChangePercent.toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Cash Balance */}
            <Card 
              className="bg-gradient-to-br from-gray-900 to-black border border-border hover-elevate cursor-pointer transition-all"
              onClick={() => setSelectedBox(selectedBox === 'cash-balance' ? null : 'cash-balance')}
              style={selectedBox === 'cash-balance' ? { boxShadow: '0 0 8px rgba(234, 179, 8, 0.8), 0 0 15px rgba(234, 179, 8, 0.8)' } : {}}
            >
              <CardHeader className="pb-2">
                <CardTitle 
                  className="text-sm font-medium text-gray-400"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  Available Cash
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <Wallet className="w-5 h-5 text-gray-400" />
                  <span 
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                    data-testid="text-cash-balance"
                  >
                    ${cashBalance.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Total Assets */}
            <Card 
              className="bg-gradient-to-br from-gray-900 to-black border border-border hover-elevate cursor-pointer transition-all"
              onClick={() => setSelectedBox(selectedBox === 'total-assets' ? null : 'total-assets')}
              style={selectedBox === 'total-assets' ? { boxShadow: '0 0 8px rgba(234, 179, 8, 0.8), 0 0 15px rgba(234, 179, 8, 0.8)' } : {}}
            >
              <CardHeader className="pb-2">
                <CardTitle 
                  className="text-sm font-medium text-gray-400"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  Market Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <Eye className="w-5 h-5 text-gray-400" />
                  <span 
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                    data-testid="text-total-assets"
                  >
                    {(marketData?.totalAssets || 0).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Day P&L */}
            <Card 
              className="bg-gradient-to-br from-gray-900 to-black border border-border hover-elevate cursor-pointer transition-all"
              onClick={() => setSelectedBox(selectedBox === 'day-pl' ? null : 'day-pl')}
              style={selectedBox === 'day-pl' ? { boxShadow: '0 0 8px rgba(234, 179, 8, 0.8), 0 0 15px rgba(234, 179, 8, 0.8)' } : {}}
            >
              <CardHeader className="pb-2">
                <CardTitle 
                  className="text-sm font-medium text-gray-400"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  Day P&L
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span 
                    className={`text-3xl font-bold ${dayPL >= 0 ? 'text-green-500' : 'text-red-500'}`}
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                    data-testid="text-day-pl"
                  >
                    {dayPL >= 0 ? '+' : ''}${dayPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className={`text-sm flex items-center gap-1 ${dayPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {dayPL >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Total Return */}
            <Card 
              className="bg-gradient-to-br from-gray-900 to-black border border-border hover-elevate cursor-pointer transition-all"
              onClick={() => setSelectedBox(selectedBox === 'total-return' ? null : 'total-return')}
              style={selectedBox === 'total-return' ? { boxShadow: '0 0 8px rgba(234, 179, 8, 0.8), 0 0 15px rgba(234, 179, 8, 0.8)' } : {}}
            >
              <CardHeader className="pb-2">
                <CardTitle 
                  className="text-sm font-medium text-gray-400"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  Total Return
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span 
                    className={`text-3xl font-bold ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                    data-testid="text-total-return"
                  >
                    {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Buying Power */}
            <Card 
              className="bg-gradient-to-br from-gray-900 to-black border border-border hover-elevate cursor-pointer transition-all"
              onClick={() => setSelectedBox(selectedBox === 'buying-power' ? null : 'buying-power')}
              style={selectedBox === 'buying-power' ? { boxShadow: '0 0 8px rgba(234, 179, 8, 0.8), 0 0 15px rgba(234, 179, 8, 0.8)' } : {}}
            >
              <CardHeader className="pb-2">
                <CardTitle 
                  className="text-sm font-medium text-gray-400"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  Buying Power
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span 
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                    data-testid="text-buying-power"
                  >
                    ${buyingPower.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Open Orders */}
            <Card 
              className="bg-gradient-to-br from-gray-900 to-black border border-border hover-elevate cursor-pointer transition-all"
              onClick={() => setSelectedBox(selectedBox === 'open-orders' ? null : 'open-orders')}
              style={selectedBox === 'open-orders' ? { boxShadow: '0 0 8px rgba(234, 179, 8, 0.8), 0 0 15px rgba(234, 179, 8, 0.8)' } : {}}
            >
              <CardHeader className="pb-2">
                <CardTitle 
                  className="text-sm font-medium text-gray-400"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  Open Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <Activity className="w-5 h-5 text-gray-400" />
                  <span 
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                    data-testid="text-open-orders"
                  >
                    {openOrders}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Active Positions */}
            <Card 
              className="bg-gradient-to-br from-gray-900 to-black border border-border hover-elevate cursor-pointer transition-all"
              onClick={() => setSelectedBox(selectedBox === 'active-positions' ? null : 'active-positions')}
              style={selectedBox === 'active-positions' ? { boxShadow: '0 0 8px rgba(234, 179, 8, 0.8), 0 0 15px rgba(234, 179, 8, 0.8)' } : {}}
            >
              <CardHeader className="pb-2">
                <CardTitle 
                  className="text-sm font-medium text-gray-400"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  Active Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <Star className="w-5 h-5 text-gray-400" />
                  <span 
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                    data-testid="text-active-positions"
                  >
                    {portfolioHoldingsCount}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Win Rate */}
            <Card 
              className="bg-gradient-to-br from-gray-900 to-black border border-border hover-elevate cursor-pointer transition-all"
              onClick={() => setSelectedBox(selectedBox === 'win-rate' ? null : 'win-rate')}
              style={selectedBox === 'win-rate' ? { boxShadow: '0 0 8px rgba(234, 179, 8, 0.8), 0 0 15px rgba(234, 179, 8, 0.8)' } : {}}
            >
              <CardHeader className="pb-2">
                <CardTitle 
                  className="text-sm font-medium text-gray-400"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  Win Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span 
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                    data-testid="text-win-rate"
                  >
                    {winRate.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Best Performer */}
            <Card 
              className="bg-gradient-to-br from-gray-900 to-black border border-border hover-elevate cursor-pointer transition-all"
              onClick={() => setSelectedBox(selectedBox === 'best-performer' ? null : 'best-performer')}
              style={selectedBox === 'best-performer' ? { boxShadow: '0 0 8px rgba(234, 179, 8, 0.8), 0 0 15px rgba(234, 179, 8, 0.8)' } : {}}
            >
              <CardHeader className="pb-2">
                <CardTitle 
                  className="text-sm font-medium text-gray-400"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  Best Performer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-1">
                  {bestPerformer ? (
                    <>
                      <span 
                        className="text-sm font-bold text-white truncate"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        data-testid="text-best-performer"
                      >
                        {bestPerformer.symbol}
                      </span>
                      <span className="text-2xl font-bold text-green-500">
                        +{bestPerformer.changePercent?.toFixed(2)}%
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gray-500">--</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Worst Performer */}
            <Card 
              className="bg-gradient-to-br from-gray-900 to-black border border-border hover-elevate cursor-pointer transition-all"
              onClick={() => setSelectedBox(selectedBox === 'worst-performer' ? null : 'worst-performer')}
              style={selectedBox === 'worst-performer' ? { boxShadow: '0 0 8px rgba(234, 179, 8, 0.8), 0 0 15px rgba(234, 179, 8, 0.8)' } : {}}
            >
              <CardHeader className="pb-2">
                <CardTitle 
                  className="text-sm font-medium text-gray-400"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  Worst Performer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-1">
                  {worstPerformer ? (
                    <>
                      <span 
                        className="text-sm font-bold text-white truncate"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        data-testid="text-worst-performer"
                      >
                        {worstPerformer.symbol}
                      </span>
                      <span className="text-2xl font-bold text-red-500">
                        {worstPerformer.changePercent?.toFixed(2)}%
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gray-500">--</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Market Cap */}
            <Card 
              className="bg-gradient-to-br from-gray-900 to-black border border-border hover-elevate cursor-pointer transition-all"
              onClick={() => setSelectedBox(selectedBox === 'total-account' ? null : 'total-account')}
              style={selectedBox === 'total-account' ? { boxShadow: '0 0 8px rgba(234, 179, 8, 0.8), 0 0 15px rgba(234, 179, 8, 0.8)' } : {}}
            >
              <CardHeader className="pb-2">
                <CardTitle 
                  className="text-sm font-medium text-gray-400"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  Total Account Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <Wallet className="w-5 h-5 text-gray-400" />
                  <span 
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                    data-testid="text-total-account-value"
                  >
                    ${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </CardContent>
      </Card>

      {/* World Clocks - Global Market Hours */}
      <WorldClocksWidget />

      {/* Comic of the Day */}
      <ComicOfTheDayWidget />

      {/* Featured Comic Covers */}
      {featuredCovers && featuredCovers.length > 0 && (
        <Card className="bg-gradient-to-br from-gray-900 to-black border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>Featured Comics</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/trading">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {featuredCovers.slice(0, 6).map((cover: ComicCover) => (
                <div key={cover.id} className="group cursor-pointer" data-testid={`cover-${cover.id}`}>
                  <div className="relative aspect-[2/3] bg-gray-800 rounded-md overflow-hidden mb-2">
                    {cover.imageUrl ? (
                      <img 
                        src={cover.imageUrl} 
                        alt={cover.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-gray-600 text-center px-2">{cover.title}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p 
                      className="text-xs font-medium text-white truncate"
                      style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                    >
                      {cover.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-sm font-bold text-white"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      >
                        ${cover.price}
                      </span>
                      <span className={`text-xs ${cover.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {cover.change >= 0 ? '+' : ''}{cover.change}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
