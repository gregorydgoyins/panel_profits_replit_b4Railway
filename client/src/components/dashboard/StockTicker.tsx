import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface MarketDataItem {
  asset_id: string;
  symbol: string;
  close: number;
  change: number;
  percent_change: number;
}

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export function StockTicker() {
  const [isPaused, setIsPaused] = useState(false);
  
  // Fetch latest market data with prices
  const { data: marketData = [] } = useQuery<MarketDataItem[]>({
    queryKey: ['/api/market-data/latest'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  // Convert market data to ticker format
  const tickerItems: TickerItem[] = marketData.map(item => ({
    symbol: item.symbol,
    price: parseFloat(item.close?.toString() || '0'),
    change: parseFloat(item.change?.toString() || '0'),
    changePercent: parseFloat(item.percent_change?.toString() || '0'),
  }));
  
  // Duplicate for seamless loop
  const duplicatedItems = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div 
      className="bg-card/60 border-b border-border/50 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      data-testid="stock-ticker"
    >
      <div className="flex items-center h-10">
        <div className="bg-card px-4 h-full flex items-center font-mono text-xs text-muted-foreground shrink-0 border-r border-border">
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
              
              return (
                <div
                  key={`${item.symbol}-${index}`}
                  className="flex items-center gap-2 text-xs font-mono whitespace-nowrap"
                  data-testid={`ticker-item-${item.symbol}`}
                >
                  <span className="font-bold text-foreground">{item.symbol}</span>
                  <span className="text-muted-foreground">${item.price.toFixed(2)}</span>
                  <span className={`flex items-center gap-0.5 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </span>
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
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-stock-ticker {
          animation: stock-ticker 60s linear infinite;
        }
        
        .pause-stock-animation {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
