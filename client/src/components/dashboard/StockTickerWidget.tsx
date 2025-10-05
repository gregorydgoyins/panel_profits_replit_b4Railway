import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface TickerAsset {
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
}

export function StockTickerWidget() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollPositionRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const { data: assets = [], isLoading } = useQuery<TickerAsset[]>({
    queryKey: ['/api/market/ticker'],
    refetchInterval: 30000, // Changed to 30s to match other widgets
  });

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || assets.length === 0) return;

    const scrollSpeed = 0.167;
    
    const animate = () => {
      if (scrollContainer && !isPaused) {
        scrollPositionRef.current += scrollSpeed;
        
        const maxScroll = scrollContainer.scrollWidth / 2;
        if (scrollPositionRef.current >= maxScroll) {
          scrollPositionRef.current = 0;
        }
        
        scrollContainer.scrollLeft = scrollPositionRef.current;
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Only start animation if not already running
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPaused]);

  if (isLoading || assets.length === 0) {
    return (
      <div className="w-full bg-card border-b border-border h-9 flex items-center justify-center">
        <div 
          className="text-muted-foreground text-sm"
          style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
        >
          Loading market data...
        </div>
      </div>
    );
  }

  const duplicatedAssets = [...assets, ...assets];

  return (
    <div 
      className="w-full bg-card border-b border-border overflow-hidden relative h-9"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      data-testid="widget-stock-ticker"
    >
      <div
        ref={scrollRef}
        className="flex items-center h-9 overflow-x-hidden whitespace-nowrap"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedAssets.map((asset, index) => (
          <div
            key={`${asset.symbol}-${index}`}
            className="inline-flex items-center gap-2 px-6 border-r border-border/50 hover-elevate cursor-pointer"
            data-testid={`ticker-item-${asset.symbol}-${index}`}
          >
            <span 
              className="font-semibold text-sm text-foreground"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              {asset.symbol}
            </span>
            <span 
              className="text-lg font-bold text-foreground"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              ${asset.currentPrice >= 1000 
                ? (asset.currentPrice / 1000).toFixed(1) + 'K' 
                : asset.currentPrice.toFixed(2)}
            </span>
            <div className={`flex items-center gap-1 ${asset.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {asset.changePercent >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span 
                className="text-sm font-medium"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              >
                {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
