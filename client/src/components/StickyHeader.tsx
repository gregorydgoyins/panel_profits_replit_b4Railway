import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MarketStatus {
  status: 'open' | 'closed' | 'pre-market' | 'after-hours';
  nextChange: string;
}

interface AssetPrice {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

export function StickyHeader() {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch market status
  const { data: marketStatus } = useQuery<MarketStatus>({
    queryKey: ['/api/market/status'],
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch top movers for ticker
  const { data: tickerAssets } = useQuery<AssetPrice[]>({
    queryKey: ['/api/market/ticker'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const displayName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.username || 'Trader';

  const marketStatusText = marketStatus?.status === 'open' 
    ? 'Market Open' 
    : marketStatus?.status === 'closed'
    ? 'Market Closed'
    : marketStatus?.status === 'pre-market'
    ? 'Pre-Market'
    : 'After Hours';

  const marketStatusColor = marketStatus?.status === 'open'
    ? 'text-green-500'
    : 'text-orange-500';

  return (
    <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      {/* Row 1: Welcome + Market Status */}
      <div className="h-10 px-6 flex items-center justify-between border-b border-gray-900">
        <div className="flex items-center gap-3">
          <span 
            className="text-white font-semibold"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            data-testid="text-welcome-message"
          >
            Welcome back, {displayName}
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <span 
            className={`text-sm font-medium ${marketStatusColor}`}
            data-testid="text-market-status"
          >
            ⬤ {marketStatusText}
          </span>
          <span 
            className="text-sm text-gray-400 font-mono"
            data-testid="text-current-time"
          >
            {time.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit',
              hour12: false 
            })}
          </span>
        </div>
      </div>

      {/* Row 2: News Ticker */}
      <div className="h-8 bg-gradient-to-r from-gray-950 to-gray-900 border-b border-gray-900 overflow-hidden">
        <div className="h-full flex items-center">
          <div className="animate-marquee whitespace-nowrap">
            <span 
              className="text-sm text-gray-300 inline-flex items-center gap-8"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              data-testid="text-news-ticker"
            >
              <span>📰 Marvel announces Phase 6 slate - collector interest surging</span>
              <span>•</span>
              <span>🔥 Golden Age Superman #1 reaches new all-time high</span>
              <span>•</span>
              <span>📈 DC Restructuring complete - institutional investors bullish</span>
              <span>•</span>
              <span>💎 Rare Amazing Fantasy #15 variant discovered - market impact expected</span>
              <span>•</span>
              <span>🎨 Alex Ross original art auction breaks records</span>
              <span>•</span>
              <span>📊 Comic-Con attendance up 300% - signaling strong market demand</span>
              <span>•</span>
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Stock Ticker */}
      <div className="h-8 bg-black border-b border-gray-800 overflow-hidden">
        <div className="h-full flex items-center">
          {tickerAssets && tickerAssets.length > 0 ? (
            <div className="animate-marquee-slow whitespace-nowrap">
              <span 
                className="text-sm inline-flex items-center gap-6"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}
                data-testid="text-stock-ticker"
              >
                {tickerAssets.map((asset, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2">
                    <span className="text-gray-400">{asset.symbol}</span>
                    <span className="text-white">${asset.currentPrice.toFixed(2)}</span>
                    <span className={asset.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {asset.change >= 0 ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />}
                      {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </span>
                  </span>
                ))}
              </span>
            </div>
          ) : (
            <div className="animate-marquee-slow whitespace-nowrap">
              <span 
                className="text-sm text-gray-500"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              >
                Loading market data...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
