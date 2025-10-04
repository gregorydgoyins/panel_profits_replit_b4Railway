import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { TrendingUp, TrendingDown, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { apiRequest, queryClient } from '@/lib/queryClient';

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

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/auth/logout'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      window.location.href = '/';
    }
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
      {/* Row 1: Welcome Banner - Aligned with TopNavbar */}
      <div className="h-9 px-4 flex items-center border-b border-gray-800">
        {/* Left Section - Matches TopNavbar left (1/6 width) */}
        <div className="flex items-center gap-2 flex-shrink-0" style={{ width: '16.66%' }}>
          <span 
            className="text-sm text-white font-normal whitespace-nowrap"
            style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            data-testid="text-welcome-message"
          >
            Welcome back, {displayName}
          </span>
        </div>
        
        {/* Center Spacer */}
        <div className="flex-1" />
        
        {/* Right Section - Matches TopNavbar right (1/6 width) */}
        <div className="flex items-center gap-3 justify-end flex-shrink-0" style={{ width: '16.66%' }}>
          <span 
            className={`text-sm font-medium whitespace-nowrap ${marketStatusColor}`}
            data-testid="text-market-status"
          >
            ⬤ {marketStatusText}
          </span>
          <span 
            className="text-sm text-gray-400 font-mono whitespace-nowrap"
            data-testid="text-current-time"
          >
            {time.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit',
              hour12: false 
            })}
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            data-testid="button-logout"
            className="h-8 whitespace-nowrap"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Row 2: News Ticker */}
      <div className="h-9 bg-gradient-to-r from-gray-950 to-gray-900 border-b border-gray-800 overflow-hidden relative">
        <div className="h-full flex items-center">
          {/* Label Box */}
          <div className="absolute left-0 top-0 h-full px-4 bg-gray-950 border-r border-gray-800 flex items-center z-10">
            <span 
              className="text-xs text-gray-400 uppercase tracking-wider whitespace-nowrap"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              data-testid="label-breaking-news"
            >
              BREAKING NEWS
            </span>
          </div>
          
          {/* Scrolling Content */}
          <div className="h-full flex items-center pl-40">
            <div className="animate-marquee-slow whitespace-nowrap">
              <span 
                className="text-sm text-gray-300 inline-flex items-center gap-8"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                data-testid="text-news-ticker"
              >
                <Link href="/news/marvel-phase-6">
                  <a className="hover:text-white transition-colors" data-testid="link-news-marvel-phase-6">
                    BREAKING: Marvel announces Phase 6 slate - collector interest surging
                  </a>
                </Link>
                <span>•</span>
                <Link href="/news/superman-ath">
                  <a className="hover:text-white transition-colors" data-testid="link-news-superman-ath">
                    ALERT: Golden Age Superman #1 reaches new all-time high
                  </a>
                </Link>
                <span>•</span>
                <Link href="/news/dc-restructuring">
                  <a className="hover:text-white transition-colors" data-testid="link-news-dc-restructuring">
                    UPDATE: DC Restructuring complete - institutional investors bullish
                  </a>
                </Link>
                <span>•</span>
                <Link href="/news/amazing-fantasy-variant">
                  <a className="hover:text-white transition-colors" data-testid="link-news-amazing-fantasy-variant">
                    EXCLUSIVE: Rare Amazing Fantasy #15 variant discovered - market impact expected
                  </a>
                </Link>
                <span>•</span>
                <Link href="/news/alex-ross-auction">
                  <a className="hover:text-white transition-colors" data-testid="link-news-alex-ross-auction">
                    RECORD: Alex Ross original art auction breaks records
                  </a>
                </Link>
                <span>•</span>
                <Link href="/news/comic-con-attendance">
                  <a className="hover:text-white transition-colors" data-testid="link-news-comic-con-attendance">
                    DATA: Comic-Con attendance up 300% - signaling strong market demand
                  </a>
                </Link>
                <span>•</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Stock Ticker */}
      <div className="h-9 bg-black border-b border-gray-800 overflow-hidden relative">
        <div className="h-full flex items-center">
          {/* Label Box */}
          <div className="absolute left-0 top-0 h-full px-4 bg-black border-r border-gray-800 flex items-center z-10">
            <span 
              className="text-xs text-gray-400 uppercase tracking-wider whitespace-nowrap"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              data-testid="label-stk-updates"
            >
              STK UPDATES
            </span>
          </div>
          
          {/* Scrolling Content */}
          <div className="h-full flex items-center pl-40">
            {tickerAssets && tickerAssets.length > 0 ? (
              <div className="animate-marquee whitespace-nowrap">
                <span 
                  className="text-sm inline-flex items-center gap-6"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                  data-testid="text-stock-ticker"
                >
                  {tickerAssets.map((asset, idx) => (
                    <Link key={idx} href={`/asset/${asset.symbol}`}>
                      <a 
                        className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
                        data-testid={`link-ticker-${asset.symbol.toLowerCase()}`}
                      >
                        <span className="text-gray-400">{asset.symbol}</span>
                        <span className="text-white">${asset.currentPrice.toFixed(2)}</span>
                        <span className={asset.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {asset.change >= 0 ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />}
                          {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                        </span>
                      </a>
                    </Link>
                  ))}
                </span>
              </div>
            ) : (
              <div className="animate-marquee whitespace-nowrap">
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
    </div>
  );
}
