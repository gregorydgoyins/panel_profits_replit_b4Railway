import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MarketStatus {
  name: string;
  city: string;
  timezone: string;
  status: 'open' | 'closed' | 'after-hours';
  localTime: Date;
  openTime: string;
  closeTime: string;
}

// Analog Clock Component
function AnalogClock({ time, status }: { time: Date; status: MarketStatus['status'] }) {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  // Calculate angles for clock hands
  const secondAngle = (seconds * 6) - 90; // 6 degrees per second
  const minuteAngle = (minutes * 6 + seconds * 0.1) - 90; // 6 degrees per minute
  const hourAngle = (hours * 30 + minutes * 0.5) - 90; // 30 degrees per hour
  
  const getStatusColor = () => {
    switch (status) {
      case 'open': return 'stroke-green-500';
      case 'after-hours': return 'stroke-yellow-500';
      case 'closed': return 'stroke-red-500';
    }
  };
  
  const getFaceColor = () => {
    switch (status) {
      case 'open': return 'bg-green-500/10 border-green-500/30';
      case 'after-hours': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'closed': return 'bg-red-500/10 border-red-500/30';
    }
  };

  return (
    <div className={`relative w-24 h-24 rounded-full border-2 ${getFaceColor()} flex items-center justify-center`}>
      <svg className="absolute w-full h-full" viewBox="0 0 100 100">
        {/* Clock face dots for hours */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = 50 + 38 * Math.cos(angle);
          const y = 50 + 38 * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i % 3 === 0 ? 2 : 1}
              className="fill-muted-foreground"
            />
          );
        })}
        
        {/* Hour hand */}
        <line
          x1="50"
          y1="50"
          x2={50 + 25 * Math.cos(hourAngle * Math.PI / 180)}
          y2={50 + 25 * Math.sin(hourAngle * Math.PI / 180)}
          className={`${getStatusColor()} stroke-[3]`}
          strokeLinecap="round"
        />
        
        {/* Minute hand */}
        <line
          x1="50"
          y1="50"
          x2={50 + 35 * Math.cos(minuteAngle * Math.PI / 180)}
          y2={50 + 35 * Math.sin(minuteAngle * Math.PI / 180)}
          className={`${getStatusColor()} stroke-[2]`}
          strokeLinecap="round"
        />
        
        {/* Center dot */}
        <circle cx="50" cy="50" r="3" className={getStatusColor().replace('stroke', 'fill')} />
      </svg>
    </div>
  );
}

export function WorldClocksWidget() {
  const [markets, setMarkets] = useState<MarketStatus[]>([]);

  const getMarketStatus = (
    timezone: string,
    openHour: number,
    closeHour: number,
    hasExtendedHours: boolean = false,
    extendedStart?: number,
    extendedEnd?: number
  ): 'open' | 'closed' | 'after-hours' => {
    const now = new Date();
    const marketTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const hour = marketTime.getHours();
    const minute = marketTime.getMinutes();
    const currentMinutes = hour * 60 + minute;
    const openMinutes = openHour * 60;
    const closeMinutes = closeHour * 60;

    // Check if it's a weekend
    const dayOfWeek = marketTime.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 'closed';
    }

    // Check extended hours trading (pre-market or after-hours)
    if (hasExtendedHours && extendedStart !== undefined && extendedEnd !== undefined) {
      const extendedStartMinutes = extendedStart * 60;
      const extendedEndMinutes = extendedEnd * 60;
      
      // Pre-market (before regular hours)
      if (currentMinutes >= extendedStartMinutes && currentMinutes < openMinutes) {
        return 'after-hours';
      }
      
      // After-hours (after regular hours)
      if (currentMinutes >= closeMinutes && currentMinutes < extendedEndMinutes) {
        return 'after-hours';
      }
    }

    // Regular trading hours
    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      return 'open';
    }

    return 'closed';
  };

  const getLocalTime = (timezone: string): Date => {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', { timeZone: timezone });
    return new Date(timeString);
  };

  const updateMarkets = () => {
    // NYSE has pre-market (4am) and after-hours (until 8pm)
    const nyseStatus = getMarketStatus('America/New_York', 9.5, 16, true, 4, 20); // Pre: 4 AM - 9:30 AM, Regular: 9:30 AM - 4:00 PM, After: 4 PM - 8 PM
    const lseStatus = getMarketStatus('Europe/London', 8, 16.5); // No extended hours
    // XETRA has extended trading hours (8am-10pm, regular 9am-5:30pm)
    const xetraStatus = getMarketStatus('Europe/Berlin', 9, 17.5, true, 8, 22); // Extended: 8 AM - 10 PM, Regular: 9 AM - 5:30 PM
    const tseStatus = getMarketStatus('Asia/Tokyo', 9, 15); // No extended hours
    const hkexStatus = getMarketStatus('Asia/Hong_Kong', 9.5, 16); // No extended hours

    setMarkets([
      {
        name: 'NYSE/NASDAQ',
        city: 'New York',
        timezone: 'America/New_York',
        status: nyseStatus,
        localTime: getLocalTime('America/New_York'),
        openTime: '9:30 AM',
        closeTime: '4:00 PM',
      },
      {
        name: 'LSE',
        city: 'London',
        timezone: 'Europe/London',
        status: lseStatus,
        localTime: getLocalTime('Europe/London'),
        openTime: '8:00 AM',
        closeTime: '4:30 PM',
      },
      {
        name: 'XETRA',
        city: 'Frankfurt',
        timezone: 'Europe/Berlin',
        status: xetraStatus,
        localTime: getLocalTime('Europe/Berlin'),
        openTime: '9:00 AM',
        closeTime: '5:30 PM',
      },
      {
        name: 'TSE',
        city: 'Tokyo',
        timezone: 'Asia/Tokyo',
        status: tseStatus,
        localTime: getLocalTime('Asia/Tokyo'),
        openTime: '9:00 AM',
        closeTime: '3:00 PM',
      },
      {
        name: 'HKEx',
        city: 'Hong Kong',
        timezone: 'Asia/Hong_Kong',
        status: hkexStatus,
        localTime: getLocalTime('Asia/Hong_Kong'),
        openTime: '9:30 AM',
        closeTime: '4:00 PM',
      },
    ]);
  };

  useEffect(() => {
    updateMarkets();
    const interval = setInterval(updateMarkets, 1000); // Update every second for smooth analog clocks
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: MarketStatus['status']) => {
    switch (status) {
      case 'open':
        return <Badge variant="default" className="bg-green-500">Open</Badge>;
      case 'after-hours':
        return <Badge variant="secondary" className="bg-yellow-500 text-black">After Hours</Badge>;
      case 'closed':
        return <Badge variant="destructive">Closed</Badge>;
    }
  };

  // Split markets into 2 + 3 layout
  const topRowMarkets = markets.slice(0, 2); // NYSE, LSE
  const bottomRowMarkets = markets.slice(2); // XETRA, TSE, HKEx

  return (
    <Card data-testid="widget-world-clocks">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Global Market Hours
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time analog clocks for major exchanges
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Top Row - 2 Clocks */}
        <div className="grid grid-cols-2 gap-4">
          {topRowMarkets.map((market) => (
            <div
              key={market.name}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover-elevate transition-all"
              data-testid={`market-${market.name.toLowerCase().replace(/\//g, '-')}`}
            >
              <AnalogClock time={market.localTime} status={market.status} />
              
              <div className="text-center space-y-1">
                <div className="font-semibold text-foreground">{market.name}</div>
                <div className="text-xs text-muted-foreground">{market.city}</div>
                <div className="text-sm font-mono text-muted-foreground">
                  {market.localTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {market.openTime} - {market.closeTime}
                </div>
                {getStatusBadge(market.status)}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Row - 3 Clocks */}
        <div className="grid grid-cols-3 gap-3">
          {bottomRowMarkets.map((market) => (
            <div
              key={market.name}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover-elevate transition-all"
              data-testid={`market-${market.name.toLowerCase().replace(/\//g, '-')}`}
            >
              <AnalogClock time={market.localTime} status={market.status} />
              
              <div className="text-center space-y-1">
                <div className="font-semibold text-sm text-foreground">{market.name}</div>
                <div className="text-xs text-muted-foreground">{market.city}</div>
                <div className="text-xs font-mono text-muted-foreground">
                  {market.localTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {market.openTime} - {market.closeTime}
                </div>
                {getStatusBadge(market.status)}
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
            <span>Extended Hours (NY: 4am-8pm, Frankfurt: 8am-10pm)</span>
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
