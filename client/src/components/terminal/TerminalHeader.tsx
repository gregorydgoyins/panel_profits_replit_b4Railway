import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, TrendingDown, RefreshCw, Settings, Bell, Clock,
  Search, Filter, BarChart3
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TerminalHeaderProps {
  selectedAsset: string;
  onAssetSelect: (assetId: string) => void;
  isMarketOpen: boolean;
  onRefresh: () => void;
}

export function TerminalHeader({ 
  selectedAsset, 
  onAssetSelect, 
  isMarketOpen, 
  onRefresh 
}: TerminalHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch current asset details
  const { data: currentAsset } = useQuery({
    queryKey: ['/api/assets', selectedAsset],
    queryFn: () => fetch(`/api/assets/${selectedAsset}`).then(res => res.json()),
    enabled: !!selectedAsset,
  });

  // Fetch current price
  const { data: assetPrice } = useQuery({
    queryKey: ['/api/market/prices', selectedAsset],
    queryFn: () => fetch(`/api/market/prices?assetIds=${selectedAsset}`).then(res => res.json()),
    enabled: !!selectedAsset,
    refetchInterval: 5000,
  });

  // Fetch assets for selection
  const { data: assets } = useQuery({
    queryKey: ['/api/assets', 'search', searchQuery],
    queryFn: () => {
      const url = searchQuery 
        ? `/api/assets?search=${encodeURIComponent(searchQuery)}&limit=20`
        : '/api/assets?limit=20';
      return fetch(url).then(res => res.json());
    },
  });

  const currentPrice = assetPrice?.data?.[0];
  const priceChange = currentPrice ? parseFloat(currentPrice.dayChange || '0') : 0;
  const priceChangePercent = currentPrice ? parseFloat(currentPrice.dayChangePercent || '0') : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="border-b bg-card/50 backdrop-blur-sm" data-testid="terminal-header">
      <div className="flex items-center justify-between p-4">
        {/* Left: Asset Selection and Price */}
        <div className="flex items-center gap-4">
          {/* Asset Selector */}
          <div className="flex items-center gap-2">
            <Select value={selectedAsset} onValueChange={onAssetSelect}>
              <SelectTrigger className="w-48" data-testid="select-asset">
                <SelectValue placeholder="Select Asset" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-2"
                    data-testid="input-search-assets"
                  />
                </div>
                {assets && Array.isArray(assets) && assets.map((asset: any) => (
                  <SelectItem key={asset.id} value={asset.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{asset.symbol}</span>
                      <span className="text-muted-foreground text-sm">{asset.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Asset Info */}
          {currentAsset && (
            <div className="flex items-center gap-4" data-testid="current-asset-info">
              <div>
                <h1 className="text-lg font-bold">{currentAsset.symbol}</h1>
                <p className="text-sm text-muted-foreground">{currentAsset.name}</p>
              </div>
              
              {currentPrice && (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">
                    {formatCurrency(parseFloat(currentPrice.currentPrice))}
                  </span>
                  <div className={`flex items-center gap-1 ${
                    priceChange >= 0 ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {priceChange >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="font-medium">
                      {formatCurrency(Math.abs(priceChange))} ({Math.abs(priceChangePercent).toFixed(2)}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Market Status and Controls */}
        <div className="flex items-center gap-2">
          {/* Market Status */}
          <Badge variant={isMarketOpen ? 'default' : 'secondary'} data-testid="market-status">
            <Clock className="h-3 w-3 mr-1" />
            {isMarketOpen ? 'Market Open' : 'Market Closed'}
          </Badge>

          {/* Market Time */}
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleTimeString('en-US', {
              timeStyle: 'medium',
              timeZone: 'America/New_York'
            })} EST
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              data-testid="button-refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              data-testid="button-alerts"
            >
              <Bell className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              data-testid="button-settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}