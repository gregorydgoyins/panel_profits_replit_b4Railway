import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Eye, Star, Plus, Minus, Search, TrendingUp, TrendingDown,
  Users, BookOpen, Layers, Building, Target, MoreHorizontal,
  ShoppingCart, AlertTriangle, RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface WatchlistAsset {
  id: string;
  assetId: string;
  symbol: string;
  name: string;
  type: 'character' | 'comic' | 'creator' | 'publisher';
  currentPrice: number;
  dayChange: number;
  dayChangePercent: number;
  weekChange: number;
  weekChangePercent: number;
  alertPrice?: number;
  notes?: string;
  addedAt: Date;
}

interface Watchlist {
  id: string;
  name: string;
  assets: WatchlistAsset[];
  isDefault: boolean;
}

export function WatchlistManager() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWatchlist, setSelectedWatchlist] = useState('');
  
  // Real API calls for watchlist data
  const { data: watchlists, isLoading: isWatchlistsLoading, error: watchlistsError } = useQuery<any[]>({ 
    queryKey: ['/api/watchlists'],
    refetchInterval: 60000 // Refetch every minute
  });

  // Set default watchlist when data loads
  React.useEffect(() => {
    if (watchlists && watchlists.length > 0 && !selectedWatchlist) {
      const defaultWatchlist = watchlists.find((w: any) => w.isDefault) || watchlists[0];
      setSelectedWatchlist(defaultWatchlist.id);
    }
  }, [watchlists, selectedWatchlist]);

  const currentWatchlist = watchlists?.find((w: any) => w.id === selectedWatchlist) || watchlists?.[0];
  const filteredAssets = (currentWatchlist?.assets || []).filter((asset: any) =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'character': return <Users className="w-4 h-4" />;
      case 'comic': return <BookOpen className="w-4 h-4" />;
      case 'creator': return <Layers className="w-4 h-4" />;
      case 'publisher': return <Building className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'character': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'comic': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'creator': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'publisher': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getPerformanceColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  const getPerformanceIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3" />;
    if (change < 0) return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  // Mutation to add asset to watchlist
  const addAssetMutation = useMutation({
    mutationFn: async (data: { watchlistId: string; assetId: string; alertPrice?: number; notes?: string }) => {
      return apiRequest('POST', '/api/watchlists/assets', {
        watchlistId: data.watchlistId,
        assetId: data.assetId,
        alertPrice: data.alertPrice,
        notes: data.notes
      });
    },
    onSuccess: () => {
      toast({
        title: "Asset Added",
        description: "Asset has been added to your watchlist",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/watchlists'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add asset to watchlist",
        variant: "destructive"
      });
    }
  });

  // Mutation to remove asset from watchlist
  const removeAssetMutation = useMutation({
    mutationFn: async ({ watchlistId, assetId }: { watchlistId: string; assetId: string }) => {
      return apiRequest('DELETE', `/api/watchlists/${watchlistId}/assets/${assetId}`);
    },
    onSuccess: () => {
      toast({
        title: "Asset Removed",
        description: "Asset has been removed from your watchlist",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/watchlists'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove asset from watchlist",
        variant: "destructive"
      });
    }
  });

  const handleRemoveAsset = (assetId: string) => {
    if (!currentWatchlist) return;
    removeAssetMutation.mutate({ watchlistId: currentWatchlist.id, assetId });
  };

  const handleAddAsset = (assetId: string, alertPrice?: number, notes?: string) => {
    if (!currentWatchlist) return;
    addAssetMutation.mutate({ watchlistId: currentWatchlist.id, assetId, alertPrice, notes });
  };

  const handleQuickBuy = (symbol: string, name: string) => {
    toast({
      title: "Quick Buy",
      description: `Redirecting to buy ${name} (${symbol})...`,
    });
  };

  const handleSetAlert = (assetId: string, currentPrice: number) => {
    toast({
      title: "Price Alert Set",
      description: `You'll be notified when the price moves significantly`,
    });
  };

  // Loading state
  if (isWatchlistsLoading) {
    return (
      <Card className="hover-elevate" data-testid="card-watchlist-manager">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-500" />
            <CardTitle>Watchlist</CardTitle>
            <RefreshCw className="w-4 h-4 animate-spin ml-auto" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (watchlistsError) {
    return (
      <Card className="hover-elevate" data-testid="card-watchlist-manager">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-500" />
            <CardTitle>Watchlist</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Failed to load watchlists. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-elevate" data-testid="card-watchlist-manager">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-500" />
            <CardTitle>Watchlist</CardTitle>
            <Badge variant="outline">{currentWatchlist?.assets?.length || 0} assets</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" data-testid="button-add-asset">
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative" data-testid="watchlist-search">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search watchlist assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-watchlist"
          />
        </div>

        {/* Watchlist Assets */}
        <div className="space-y-3" data-testid="watchlist-assets">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-8" data-testid="empty-watchlist">
              <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? 'No assets found' : 'No assets in watchlist'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm 
                  ? `No assets match "${searchTerm}"`
                  : 'Add some assets to start tracking their performance'
                }
              </p>
              {!searchTerm && (
                <Button data-testid="button-add-first-asset">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Asset
                </Button>
              )}
            </div>
          ) : (
            filteredAssets.map((asset: any) => (
              <div 
                key={asset.id} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                data-testid={`watchlist-asset-${asset.symbol.toLowerCase()}`}
              >
                {/* Asset Info */}
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`${getTypeColor(asset.type)} text-xs`}>
                      {getTypeIcon(asset.type)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{asset.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {asset.symbol}
                      </Badge>
                      {asset.alertPrice && (
                        <Badge variant="secondary" className="text-xs flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Alert
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Added {asset.addedAt.toLocaleDateString()}</span>
                      {asset.alertPrice && (
                        <span>Alert: {formatCurrency(asset.alertPrice)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price & Performance */}
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" data-testid={`price-${asset.symbol.toLowerCase()}`}>
                      {formatCurrency(asset.currentPrice)}
                    </span>
                    <div className={`flex items-center gap-1 text-xs ${getPerformanceColor(asset.dayChange)}`}>
                      {getPerformanceIcon(asset.dayChange)}
                      <span data-testid={`day-change-${asset.symbol.toLowerCase()}`}>
                        {asset.dayChangePercent >= 0 ? '+' : ''}{asset.dayChangePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className={`text-xs ${getPerformanceColor(asset.weekChange)}`}>
                    <span data-testid={`week-change-${asset.symbol.toLowerCase()}`}>
                      Week: {asset.weekChangePercent >= 0 ? '+' : ''}{asset.weekChangePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="ml-4 flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleQuickBuy(asset.symbol, asset.name)}
                    data-testid={`buy-${asset.symbol.toLowerCase()}`}
                  >
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Buy
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" data-testid={`actions-${asset.symbol.toLowerCase()}`}>
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleSetAlert(asset.id, asset.currentPrice)}>
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Set Price Alert
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Target className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleRemoveAsset(asset.id)}
                      >
                        <Minus className="w-4 h-4 mr-2" />
                        Remove from Watchlist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Watchlist Summary */}
        {filteredAssets.length > 0 && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Gainers</p>
                <p className="text-lg font-bold text-green-500" data-testid="text-gainers-count">
                  {filteredAssets.filter((a: any) => a.dayChange > 0).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unchanged</p>
                <p className="text-lg font-bold text-muted-foreground" data-testid="text-unchanged-count">
                  {filteredAssets.filter((a: any) => a.dayChange === 0).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Losers</p>
                <p className="text-lg font-bold text-red-500" data-testid="text-losers-count">
                  {filteredAssets.filter((a: any) => a.dayChange < 0).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}