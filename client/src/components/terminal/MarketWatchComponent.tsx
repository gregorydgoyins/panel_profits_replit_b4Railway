import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, TrendingDown, Star, Plus, Volume2, 
  Eye, BarChart3, Activity
} from 'lucide-react';

interface MarketWatchProps {
  onAssetSelect: (assetId: string) => void;
  refreshTrigger?: number;
}

interface AssetPrice {
  assetId: string;
  symbol: string;
  name: string;
  currentPrice: string;
  dayChange: string;
  dayChangePercent: string;
  volume: number;
  type: string;
}

export function MarketWatchComponent({ onAssetSelect, refreshTrigger = 0 }: MarketWatchProps) {
  const [watchlistAssets, setWatchlistAssets] = useState<string[]>(['SPIDER', 'BATMAN', 'XMEN', 'AVENG', 'WOLVR']);

  // Fetch market data for all assets
  const { data: allAssets, isLoading: assetsLoading } = useQuery({
    queryKey: ['/api/assets', 'limit-50'],
    queryFn: () => fetch('/api/assets?limit=50').then(res => res.json()),
  });

  // Fetch current prices for assets
  const { data: pricesData, isLoading: pricesLoading } = useQuery({
    queryKey: ['/api/market/prices', 'all', refreshTrigger],
    queryFn: () => {
      const assetIds = allAssets?.slice(0, 20)?.map((a: any) => a.id).join(',');
      return fetch(`/api/market/prices?assetIds=${assetIds}`).then(res => res.json());
    },
    enabled: !!allAssets,
    refetchInterval: 10000, // Update every 10 seconds
  });

  // Process and combine asset and price data
  const processMarketData = (): AssetPrice[] => {
    if (!allAssets || !pricesData?.data) return [];
    
    return allAssets.map((asset: any) => {
      const priceData = pricesData.data.find((p: any) => p.assetId === asset.id);
      return {
        assetId: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        type: asset.type,
        currentPrice: priceData?.currentPrice || '0',
        dayChange: priceData?.dayChange || '0',
        dayChangePercent: priceData?.dayChangePercent || '0',
        volume: priceData?.volume || 0,
      };
    });
  };

  const marketData = processMarketData();

  // Filter data for different views
  const getTopGainers = () => {
    return marketData
      .filter(asset => parseFloat(asset.dayChangePercent) > 0)
      .sort((a, b) => parseFloat(b.dayChangePercent) - parseFloat(a.dayChangePercent))
      .slice(0, 10);
  };

  const getTopLosers = () => {
    return marketData
      .filter(asset => parseFloat(asset.dayChangePercent) < 0)
      .sort((a, b) => parseFloat(a.dayChangePercent) - parseFloat(b.dayChangePercent))
      .slice(0, 10);
  };

  const getVolumeLeaders = () => {
    return marketData
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10);
  };

  const getWatchlistData = () => {
    return marketData.filter(asset => watchlistAssets.includes(asset.symbol));
  };

  const getSectorData = () => {
    const sectorPerformance = marketData.reduce((acc: any, asset) => {
      const sector = asset.type;
      if (!acc[sector]) {
        acc[sector] = {
          name: sector,
          assets: [],
          avgChange: 0,
          totalVolume: 0
        };
      }
      acc[sector].assets.push(asset);
      acc[sector].totalVolume += asset.volume;
      return acc;
    }, {});

    return Object.values(sectorPerformance).map((sector: any) => {
      const avgChange = sector.assets.reduce((sum: number, asset: any) => 
        sum + parseFloat(asset.dayChangePercent), 0) / sector.assets.length;
      return { ...sector, avgChange };
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount));
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return (volume / 1000000).toFixed(1) + 'M';
    if (volume >= 1000) return (volume / 1000).toFixed(1) + 'K';
    return volume.toString();
  };

  const toggleWatchlist = (symbol: string) => {
    setWatchlistAssets(prev => 
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const renderAssetRow = (asset: AssetPrice, showWatchlistToggle = false) => {
    const changePercent = parseFloat(asset.dayChangePercent);
    const isPositive = changePercent >= 0;
    
    return (
      <div
        key={asset.assetId}
        className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors"
        onClick={() => onAssetSelect(asset.assetId)}
        data-testid={`market-watch-asset-${asset.symbol}`}
      >
        <div className="flex items-center gap-2 flex-1">
          {showWatchlistToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleWatchlist(asset.symbol);
              }}
              className="p-1"
              data-testid={`button-watchlist-${asset.symbol}`}
            >
              {watchlistAssets.includes(asset.symbol) ? (
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ) : (
                <Star className="h-3 w-3" />
              )}
            </Button>
          )}
          
          <div className="min-w-0">
            <div className="font-medium text-sm">{asset.symbol}</div>
            <div className="text-xs text-muted-foreground truncate">
              {asset.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="font-medium text-sm">
              {formatCurrency(asset.currentPrice)}
            </div>
            <div className={`text-xs ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground min-w-12 text-right">
            {formatVolume(asset.volume)}
          </div>

          <div className="flex items-center">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
      </div>
    );
  };

  if (assetsLoading || pricesLoading) {
    return (
      <div className="h-64 flex items-center justify-center" data-testid="market-watch-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full" data-testid="market-watch-component">
      <Tabs defaultValue="watchlist" className="h-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="watchlist" data-testid="tab-watchlist">
            <Eye className="h-4 w-4 mr-1" />
            Watchlist
          </TabsTrigger>
          <TabsTrigger value="movers" data-testid="tab-movers">
            <Activity className="h-4 w-4 mr-1" />
            Movers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist" className="h-full">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">My Watchlist</span>
              <Badge variant="outline">{watchlistAssets.length} assets</Badge>
            </div>
            
            <ScrollArea className="h-80">
              <div className="space-y-1">
                {getWatchlistData().map(asset => renderAssetRow(asset, true))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="movers" className="h-full">
          <Tabs defaultValue="gainers" className="h-full">
            <TabsList className="grid w-full grid-cols-3 mb-2">
              <TabsTrigger value="gainers" data-testid="tab-gainers">Gainers</TabsTrigger>
              <TabsTrigger value="losers" data-testid="tab-losers">Losers</TabsTrigger>
              <TabsTrigger value="volume" data-testid="tab-volume">Volume</TabsTrigger>
            </TabsList>

            <TabsContent value="gainers">
              <ScrollArea className="h-72">
                <div className="space-y-1">
                  {getTopGainers().map(asset => renderAssetRow(asset))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="losers">
              <ScrollArea className="h-72">
                <div className="space-y-1">
                  {getTopLosers().map(asset => renderAssetRow(asset))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="volume">
              <ScrollArea className="h-72">
                <div className="space-y-1">
                  {getVolumeLeaders().map(asset => renderAssetRow(asset))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Sector Performance Summary */}
      <div className="mt-4 pt-4 border-t">
        <div className="text-sm font-medium mb-2">Sector Performance</div>
        <div className="space-y-1">
          {getSectorData().map((sector: any, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="capitalize">{sector.name}</span>
              <span className={`${
                sector.avgChange >= 0 ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {sector.avgChange >= 0 ? '+' : ''}{sector.avgChange.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}