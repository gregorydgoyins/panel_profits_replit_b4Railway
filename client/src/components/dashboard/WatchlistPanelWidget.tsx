import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Eye, Star, Plus, Minus, Search, TrendingUp, TrendingDown,
  Users, BookOpen, Layers, Building, Target, ShoppingCart, Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useLocation } from 'wouter';

interface WatchlistAsset {
  id: string;
  assetId: string;
  symbol: string;
  name: string;
  type: 'character' | 'comic' | 'creator' | 'publisher';
  currentPrice: number;
  dayChange: number;
  dayChangePercent: number;
  volume: number;
}

export function WatchlistPanelWidget() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: watchlists, isLoading } = useQuery<any[]>({ 
    queryKey: ['/api/watchlists'],
    refetchInterval: 60000
  });

  const currentWatchlist = watchlists?.[0];
  
  // Get real-time prices via WebSocket
  const assetIds = currentWatchlist?.assets?.map((a: any) => a.assetId) || [];
  const { getRealTimePrice, isConnected } = useWebSocket({
    subscribeTo: { assets: assetIds }
  });

  // Transform watchlist assets with real-time data
  const watchlistAssets: WatchlistAsset[] = useMemo(() => {
    if (!currentWatchlist?.assets) return [];
    
    return currentWatchlist.assets.map((asset: any) => {
      const realtimeData = getRealTimePrice(asset.assetId);
      const currentPrice = realtimeData?.price || parseFloat(asset.currentPrice || '0');
      
      return {
        id: asset.id,
        assetId: asset.assetId,
        symbol: asset.assetSymbol || 'N/A',
        name: asset.assetName || 'Unknown Asset',
        type: asset.assetType as any,
        currentPrice,
        dayChange: parseFloat(asset.dayChange || '0'),
        dayChangePercent: parseFloat(asset.dayChangePercent || '0'),
        volume: parseFloat(asset.volume || '0'),
      };
    });
  }, [currentWatchlist, getRealTimePrice]);

  const filteredAssets = useMemo(() => {
    return watchlistAssets.filter(asset =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [watchlistAssets, searchTerm]);

  const removeAssetMutation = useMutation({
    mutationFn: async ({ watchlistId, assetId }: { watchlistId: string; assetId: string }) => {
      return apiRequest('DELETE', `/api/watchlists/${watchlistId}/assets/${assetId}`);
    },
    onSuccess: () => {
      toast({
        title: "Asset Removed",
        description: "Asset removed from watchlist",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/watchlists'] });
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toFixed(0);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'character': return <Users className="w-3 h-3" />;
      case 'comic': return <BookOpen className="w-3 h-3" />;
      case 'creator': return <Layers className="w-3 h-3" />;
      case 'publisher': return <Building className="w-3 h-3" />;
      default: return <Target className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'character': return 'bg-blue-500/10 text-blue-500';
      case 'comic': return 'bg-green-500/10 text-green-500';
      case 'creator': return 'bg-purple-500/10 text-purple-500';
      case 'publisher': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getPriceColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  const handleTrade = (assetId: string) => {
    setLocation(`/trading?asset=${assetId}`);
  };

  const handleRemove = (assetId: string) => {
    if (!currentWatchlist) return;
    removeAssetMutation.mutate({ watchlistId: currentWatchlist.id, assetId });
  };

  if (isLoading) {
    return (
      <Card className="hover-elevate" data-testid="card-watchlist-panel">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-500" />
            <CardTitle>Watchlist</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-elevate" data-testid="card-watchlist-panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-500" />
            <CardTitle>Watchlist Panel</CardTitle>
            <Badge variant="outline">{watchlistAssets.length}</Badge>
            {isConnected && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm" data-testid="button-add-to-watchlist">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-assets"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredAssets.length === 0 ? (
          <div className="text-center py-6" data-testid="empty-watchlist">
            <Eye className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">
              {searchTerm ? 'No Results' : 'No Assets'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm ? 'Try different keywords' : 'Add assets to track them'}
            </p>
          </div>
        ) : (
          <div className="space-y-2" data-testid="watchlist-assets">
            {filteredAssets.map((asset) => (
              <div 
                key={asset.id} 
                className="flex items-center justify-between p-2 border rounded hover:bg-muted/50 transition-colors"
                data-testid={`watchlist-item-${asset.symbol.toLowerCase()}`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={`${getTypeColor(asset.type)} text-xs`}>
                      {getTypeIcon(asset.type)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm truncate">{asset.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{asset.symbol}</span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {formatVolume(asset.volume)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-2">
                  <div className="font-medium text-sm">
                    {formatCurrency(asset.currentPrice)}
                  </div>
                  <div className={`flex items-center justify-end gap-1 text-xs ${getPriceColor(asset.dayChange)}`}>
                    {asset.dayChange > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : asset.dayChange < 0 ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : null}
                    <span>
                      {asset.dayChangePercent >= 0 ? '+' : ''}{asset.dayChangePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTrade(asset.assetId)}
                    data-testid={`button-trade-${asset.symbol.toLowerCase()}`}
                  >
                    <ShoppingCart className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemove(asset.assetId)}
                    data-testid={`button-remove-${asset.symbol.toLowerCase()}`}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {watchlistAssets.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t text-center">
            <div>
              <p className="text-xs text-muted-foreground">Gainers</p>
              <p className="text-sm font-bold text-green-500">
                {watchlistAssets.filter(a => a.dayChange > 0).length}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Flat</p>
              <p className="text-sm font-bold text-muted-foreground">
                {watchlistAssets.filter(a => a.dayChange === 0).length}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Losers</p>
              <p className="text-sm font-bold text-red-500">
                {watchlistAssets.filter(a => a.dayChange < 0).length}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
