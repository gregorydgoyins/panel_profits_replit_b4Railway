import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface TickerAsset {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  era?: string;
  float?: number;
  volume24h?: number;
}

export function StockTicker() {
  const [isPaused, setIsPaused] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const previousDataRef = useRef<TickerAsset[]>([]);
  
  const { data: tickerAssets = [], dataUpdatedAt } = useQuery<TickerAsset[]>({
    queryKey: ['/api/market/ticker'],
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (tickerAssets.length > 0 && previousDataRef.current.length > 0) {
      const hasChanged = tickerAssets.some((asset, idx) => 
        previousDataRef.current[idx]?.currentPrice !== asset.currentPrice
      );
      
      if (hasChanged) {
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 600);
      }
    }
    previousDataRef.current = tickerAssets;
  }, [dataUpdatedAt]);
  
  const duplicatedItems = [...tickerAssets, ...tickerAssets, ...tickerAssets];

  return (
    <div 
      className={`bg-card/60 border-b border-border/50 overflow-hidden h-9 transition-all duration-300 ${isFlashing ? 'bg-primary/10' : ''}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      data-testid="stock-ticker"
    >
      <div className="flex items-center h-9">
        <div 
          className="bg-card px-4 h-full flex items-center text-xs text-muted-foreground shrink-0 border-r border-border"
          style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
        >
          LIVE QUOTES
        </div>
        
        <div className="flex-1 overflow-hidden relative">
          <div 
            className={`flex gap-6 ${isPaused ? 'pause-stock-animation' : 'animate-stock-ticker'}`}
            style={{ 
              width: 'max-content',
            }}
          >
            {duplicatedItems.map((item, index) => {
              const isPositive = item.change >= 0;
              
              const eraTag = item.era === 'Golden Age' ? 'GOLDEN' : 
                           item.era === 'Silver Age' ? 'SILVER' :
                           item.era === 'Bronze Age' ? 'BRONZE' : null;
              
              const floatDisplay = item.float ? `${(item.float / 1000).toFixed(0)}K` : null;
              
              return (
                <div
                  key={`${item.symbol}-${index}`}
                  className="flex items-center gap-2 text-xs whitespace-nowrap transition-all duration-500"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                  data-testid={`ticker-item-${item.symbol}`}
                >
                  <span className="text-foreground transition-colors duration-500">{item.symbol}</span>
                  {eraTag && (
                    <span className="px-1 py-0.5 text-[10px] bg-primary/20 text-primary rounded transition-all duration-500">
                      {eraTag}
                    </span>
                  )}
                  <span className="text-muted-foreground transition-all duration-500">${item.currentPrice.toFixed(2)}</span>
                  <span className={`flex items-center gap-0.5 transition-colors duration-500 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </span>
                  {floatDisplay && (
                    <span className="text-[10px] text-muted-foreground/60 transition-all duration-500">
                      {floatDisplay} float
                    </span>
                  )}
                  <span className="text-border">|</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes stock-ticker {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-stock-ticker {
          animation: stock-ticker 81s linear infinite;
          will-change: transform;
        }
        
        .pause-stock-animation {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
