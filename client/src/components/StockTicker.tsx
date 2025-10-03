import { useEffect, useRef, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useLocation } from 'wouter';
import { usePollingInterval } from '@/hooks/usePollingInterval';

interface TickerAsset {
  assetId: string;
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  volume: number;
  assetType?: string;
}

interface MarketSnapshot {
  timestamp: string;
  count: number;
  data: {
    assetId: string;
    symbol: string;
    currentPrice: number;
    change: number;
    changePercent: number;
    volume: number;
    timestamp: string;
  }[];
}

export function StockTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [, setLocation] = useLocation();
  
  // Get polling interval based on subscription tier
  const pollingInterval = usePollingInterval();
  
  // Poll market data snapshot endpoint with tier-based delays
  const { data: snapshot, isLoading, error } = useQuery<MarketSnapshot>({
    queryKey: ['/api/market-data/snapshot', `tier-${pollingInterval}`], // Separate cache per tier
    refetchInterval: pollingInterval,
    refetchIntervalInBackground: true,
    staleTime: 0, // Always fetch fresh data on interval
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Log errors for debugging
  if (error) {
    console.error('Failed to fetch market snapshot:', error);
  }

  // Convert snapshot data to TickerAsset format
  const topAssets = useMemo((): TickerAsset[] => {
    if (!snapshot?.data) return [];
    
    return snapshot.data
      .map(item => ({
        assetId: item.assetId,
        symbol: item.symbol,
        name: item.symbol, // Use symbol as name fallback
        currentPrice: item.currentPrice,
        changePercent: item.changePercent,
        volume: item.volume || 0,
      }))
      .sort((a, b) => b.volume - a.volume) // Sort by volume descending
      .slice(0, 20); // Take top 20
  }, [snapshot]);

  // Auto-scroll animation
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused || topAssets.length === 0) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.25; // pixels per frame - extra slow for readability
    let animationFrameId: number;
    
    const animate = () => {
      if (scrollContainer && !isPaused) {
        scrollPosition += scrollSpeed;
        
        // Reset when we've scrolled past half the content (for seamless loop)
        const maxScroll = scrollContainer.scrollWidth / 2;
        if (scrollPosition >= maxScroll) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, topAssets.length]);

  const handleAssetClick = (asset: TickerAsset) => {
    // Navigate to trading page with the asset pre-selected
    setLocation(`/trading?asset=${asset.assetId}`);
  };

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(2)}K`;
    }
    return `$${price.toFixed(2)}`;
  };

  // Show loading state while fetching initial data
  if (isLoading && !snapshot) {
    return (
      <div 
        className="w-full bg-card/80 border-b border-border/50 h-10 flex items-center justify-center backdrop-blur-sm"
        data-testid="stock-ticker-loading"
      >
        <div className="text-muted-foreground text-xs font-mono uppercase tracking-wider">
          Loading market feed...
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (topAssets.length === 0) {
    return (
      <div 
        className="w-full bg-card/80 border-b border-border/50 h-10 flex items-center justify-center backdrop-blur-sm"
        data-testid="stock-ticker-empty"
      >
        <div className="text-muted-foreground text-xs font-mono uppercase tracking-wider">
          Awaiting market data...
        </div>
      </div>
    );
  }

  // Duplicate assets for seamless infinite scroll
  const duplicatedAssets = [...topAssets, ...topAssets];

  return (
    <div 
      className="w-full bg-card/80 border-b border-border/50 overflow-hidden relative backdrop-blur-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      data-testid="stock-ticker"
    >
      {/* Desktop/Tablet: Horizontal scroll */}
      <div className="hidden sm:block">
        <div
          ref={scrollRef}
          className="flex items-center h-10 overflow-x-hidden whitespace-nowrap"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedAssets.map((asset, index) => (
            <button
              key={`${asset.assetId}-${index}`}
              onClick={() => handleAssetClick(asset)}
              className="inline-flex items-center gap-2 px-4 border-r border-border/30 hover-elevate active-elevate-2 cursor-pointer transition-all h-full"
              data-testid={`ticker-item-${asset.symbol}-${index}`}
            >
              {/* Symbol */}
              <span className="font-semibold text-xs text-foreground uppercase tracking-wide font-mono">
                {asset.symbol}
              </span>
              
              {/* Price */}
              <span className="text-sm font-bold text-foreground font-mono">
                {formatPrice(asset.currentPrice)}
              </span>
              
              {/* Change with icon */}
              <div 
                className={`flex items-center gap-1 ${
                  asset.changePercent >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}
              >
                {asset.changePercent >= 0 ? (
                  <TrendingUp className="w-3 h-3" data-testid={`icon-up-${asset.symbol}`} />
                ) : (
                  <TrendingDown className="w-3 h-3" data-testid={`icon-down-${asset.symbol}`} />
                )}
                <span className="text-xs font-medium font-mono">
                  {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: Vertical compact list (first 10 assets, scrollable) */}
      <div className="sm:hidden">
        <div className="h-40 overflow-y-auto">
          {topAssets.slice(0, 10).map((asset) => (
            <button
              key={asset.assetId}
              onClick={() => handleAssetClick(asset)}
              className="w-full flex items-center justify-between px-3 py-2 border-b border-border/30 hover-elevate active-elevate-2 cursor-pointer transition-all"
              data-testid={`ticker-mobile-${asset.symbol}`}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-foreground uppercase tracking-wide font-mono">
                  {asset.symbol}
                </span>
                <span className="text-xs font-bold text-foreground font-mono">
                  {formatPrice(asset.currentPrice)}
                </span>
              </div>
              
              <div 
                className={`flex items-center gap-1 ${
                  asset.changePercent >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}
              >
                {asset.changePercent >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="text-xs font-medium font-mono">
                  {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Polling status indicator (only shown when paused) */}
      {isPaused && snapshot && (
        <div className="absolute top-0 right-0 px-2 py-1 bg-card/95 border-l border-b border-border/50 backdrop-blur-sm">
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
            Paused • Last update: {new Date(snapshot.timestamp).toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
}
