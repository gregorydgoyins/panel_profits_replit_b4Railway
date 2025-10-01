import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MarketStatus {
  name: string;
  city: string;
  timezone: string;
  status: 'open' | 'closed' | 'after-hours' | 'pre-market';
  localTime: string;
  openTime: string;
  closeTime: string;
}

export function WorldClocksWidget() {
  const [markets, setMarkets] = useState<MarketStatus[]>([]);

  const getMarketStatus = (
    timezone: string,
    openHour: number,
    closeHour: number,
    preMarketStart?: number,
    afterHoursEnd?: number
  ): 'open' | 'closed' | 'after-hours' | 'pre-market' => {
    const now = new Date();
    const marketTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const hour = marketTime.getHours();
    const minute = marketTime.getMinutes();
    const currentMinutes = hour * 60 + minute;
    const openMinutes = openHour * 60;
    const closeMinutes = closeHour * 60;

    // Check pre-market hours (if applicable)
    if (preMarketStart && currentMinutes >= preMarketStart * 60 && currentMinutes < openMinutes) {
      return 'pre-market';
    }

    // Check after-hours trading (if applicable)
    if (afterHoursEnd && currentMinutes >= closeMinutes && currentMinutes < afterHoursEnd * 60) {
      return 'after-hours';
    }

    // Regular trading hours
    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      // Check if it's a weekend
      const dayOfWeek = marketTime.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return 'closed';
      }
      return 'open';
    }

    return 'closed';
  };

  const formatTime = (timezone: string): string => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const updateMarkets = () => {
    const nyseStatus = getMarketStatus('America/New_York', 9.5, 16, 4, 20); // 9:30 AM - 4:00 PM ET, pre-market 4 AM, after-hours 8 PM
    const lseStatus = getMarketStatus('Europe/London', 8, 16.5); // 8:00 AM - 4:30 PM GMT
    const tseStatus = getMarketStatus('Asia/Tokyo', 9, 15); // 9:00 AM - 3:00 PM JST
    const hkexStatus = getMarketStatus('Asia/Hong_Kong', 9.5, 16); // 9:30 AM - 4:00 PM HKT

    setMarkets([
      {
        name: 'NYSE/NASDAQ',
        city: 'New York',
        timezone: 'America/New_York',
        status: nyseStatus,
        localTime: formatTime('America/New_York'),
        openTime: '9:30 AM',
        closeTime: '4:00 PM',
      },
      {
        name: 'LSE',
        city: 'London',
        timezone: 'Europe/London',
        status: lseStatus,
        localTime: formatTime('Europe/London'),
        openTime: '8:00 AM',
        closeTime: '4:30 PM',
      },
      {
        name: 'TSE',
        city: 'Tokyo',
        timezone: 'Asia/Tokyo',
        status: tseStatus,
        localTime: formatTime('Asia/Tokyo'),
        openTime: '9:00 AM',
        closeTime: '3:00 PM',
      },
      {
        name: 'HKEx',
        city: 'Hong Kong',
        timezone: 'Asia/Hong_Kong',
        status: hkexStatus,
        localTime: formatTime('Asia/Hong_Kong'),
        openTime: '9:30 AM',
        closeTime: '4:00 PM',
      },
    ]);
  };

  useEffect(() => {
    updateMarkets();
    const interval = setInterval(updateMarkets, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: MarketStatus['status']) => {
    switch (status) {
      case 'open':
        return <Badge variant="default" className="bg-green-500">Open</Badge>;
      case 'after-hours':
        return <Badge variant="secondary">After Hours</Badge>;
      case 'pre-market':
        return <Badge variant="secondary">Pre-Market</Badge>;
      case 'closed':
        return <Badge variant="destructive">Closed</Badge>;
    }
  };

  const getStatusColor = (status: MarketStatus['status']) => {
    switch (status) {
      case 'open':
        return 'text-green-500';
      case 'after-hours':
      case 'pre-market':
        return 'text-yellow-500';
      case 'closed':
        return 'text-red-500';
    }
  };

  return (
    <Card data-testid="widget-world-clocks">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Global Market Hours
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time market status across major exchanges
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {markets.map((market) => (
            <div
              key={market.name}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover-elevate transition-all"
              data-testid={`market-${market.name.toLowerCase().replace(/\//g, '-')}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className={`w-4 h-4 ${getStatusColor(market.status)}`} />
                  <span className="font-semibold">{market.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {market.city} • {market.openTime} - {market.closeTime}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {getStatusBadge(market.status)}
                <span className="text-sm font-mono text-muted-foreground">
                  {market.localTime}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Open</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Extended Hours</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>Closed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
