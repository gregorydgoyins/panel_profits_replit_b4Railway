import { useEffect, useRef, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useLocation } from 'wouter';
import { usePollingInterval } from '@/hooks/usePollingInterval';

interface TickerAsset {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
}

export function StockTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [, setLocation] = useLocation();
  
  const pollingInterval = usePollingInterval();
  
  const { data: topAssets = [], isLoading } = useQuery<TickerAsset[]>({
    queryKey: ['/api/market/ticker'],
    refetchInterval: pollingInterval,
    refetchIntervalInBackground: true,
    staleTime: 0,
  });

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused || topAssets.length === 0) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.25;
    let animationFrameId: number;
    
    const animate = () => {
      if (scrollContainer && !isPaused) {
        scrollPosition += scrollSpeed;
        
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

  const handleAssetClick = (symbol: string) => {
    setLocation(`/asset/${symbol}`);
  };

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(2)}K`;
    }
    return `$${price.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div 
        className="w-full bg-card/80 border-b border-border/50 h-9 flex items-center justify-center backdrop-blur-sm"
        data-testid="stock-ticker-loading"
      >
        <div 
          className="text-muted-foreground text-xs uppercase tracking-wider"
          style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
        >
          Loading market feed...
        </div>
      </div>
    );
  }

  if (topAssets.length === 0) {
    return (
      <div 
        className="w-full bg-card/80 border-b border-border/50 h-9 flex items-center justify-center backdrop-blur-sm"
        data-testid="stock-ticker-empty"
      >
        <div 
          className="text-muted-foreground text-xs uppercase tracking-wider"
          style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
        >
          Awaiting market data...
        </div>
      </div>
    );
  }

  const duplicatedAssets = [...topAssets, ...topAssets];

  return (
    <div 
      className="w-full bg-card/80 border-b border-border/50 overflow-hidden relative backdrop-blur-sm h-9"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      data-testid="stock-ticker"
    >
      <div className="hidden sm:block">
        <div
          ref={scrollRef}
          className="flex items-center h-9 overflow-x-hidden whitespace-nowrap"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedAssets.map((asset, index) => (
            <button
              key={`${asset.symbol}-${index}`}
              onClick={() => handleAssetClick(asset.symbol)}
              className="inline-flex items-center gap-2 px-4 border-r border-border/30 hover-elevate active-elevate-2 cursor-pointer transition-all h-full"
              data-testid={`ticker-item-${asset.symbol}-${index}`}
            >
              <span 
                className="font-semibold text-xs text-foreground uppercase tracking-wide"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              >
                {asset.symbol}
              </span>
              
              <span 
                className="text-sm font-bold text-foreground"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              >
                {formatPrice(asset.currentPrice)}
              </span>
              
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
                <span 
                  className="text-xs font-medium"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="sm:hidden">
        <div className="h-36 overflow-y-auto">
          {topAssets.slice(0, 10).map((asset) => (
            <button
              key={asset.symbol}
              onClick={() => handleAssetClick(asset.symbol)}
              className="w-full flex items-center justify-between px-3 py-2 border-b border-border/30 hover-elevate active-elevate-2 cursor-pointer transition-all"
              data-testid={`ticker-mobile-${asset.symbol}`}
            >
              <div className="flex items-center gap-2">
                <span 
                  className="font-semibold text-xs text-foreground uppercase tracking-wide"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  {asset.symbol}
                </span>
                <span 
                  className="text-xs font-bold text-foreground"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
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
                <span 
                  className="text-xs font-medium"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
