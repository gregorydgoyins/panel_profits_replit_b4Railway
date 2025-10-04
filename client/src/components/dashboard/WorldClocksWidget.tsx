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

function AnalogClock({ time, status }: { time: Date; status: MarketStatus['status'] }) {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  const secondAngle = (seconds * 6) - 90;
  const minuteAngle = (minutes * 6 + seconds * 0.1) - 90;
  const hourAngle = (hours * 30 + minutes * 0.5) - 90;
  
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
    <div className={`relative w-16 h-16 rounded-full border-2 ${getFaceColor()} flex items-center justify-center`}>
      <svg className="absolute w-full h-full" viewBox="0 0 100 100">
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
        
        <line
          x1="50"
          y1="50"
          x2={50 + 25 * Math.cos(hourAngle * Math.PI / 180)}
          y2={50 + 25 * Math.sin(hourAngle * Math.PI / 180)}
          className={`${getStatusColor()} stroke-[3]`}
          strokeLinecap="round"
        />
        
        <line
          x1="50"
          y1="50"
          x2={50 + 35 * Math.cos(minuteAngle * Math.PI / 180)}
          y2={50 + 35 * Math.sin(minuteAngle * Math.PI / 180)}
          className={`${getStatusColor()} stroke-[2]`}
          strokeLinecap="round"
        />
        
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

    const dayOfWeek = marketTime.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 'closed';
    }

    if (hasExtendedHours && extendedStart !== undefined && extendedEnd !== undefined) {
      const extendedStartMinutes = extendedStart * 60;
      const extendedEndMinutes = extendedEnd * 60;
      
      if (currentMinutes >= extendedStartMinutes && currentMinutes < openMinutes) {
        return 'after-hours';
      }
      
      if (currentMinutes >= closeMinutes && currentMinutes < extendedEndMinutes) {
        return 'after-hours';
      }
    }

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
    const nyseStatus = getMarketStatus('America/New_York', 9.5, 16, true, 4, 20);
    const lseStatus = getMarketStatus('Europe/London', 8, 16.5);
    const xetraStatus = getMarketStatus('Europe/Berlin', 9, 17.5, true, 8, 22);
    const tseStatus = getMarketStatus('Asia/Tokyo', 9, 15);
    const hkexStatus = getMarketStatus('Asia/Hong_Kong', 9.5, 16);
    const tsxStatus = getMarketStatus('America/Toronto', 9.5, 16);
    const dfmStatus = getMarketStatus('Asia/Dubai', 10, 14);
    const nseStatus = getMarketStatus('Asia/Kolkata', 9.25, 15.5);

    setMarkets([
      {
        name: 'NYSE',
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
      {
        name: 'TSX',
        city: 'Toronto',
        timezone: 'America/Toronto',
        status: tsxStatus,
        localTime: getLocalTime('America/Toronto'),
        openTime: '9:30 AM',
        closeTime: '4:00 PM',
      },
      {
        name: 'DFM',
        city: 'Dubai',
        timezone: 'Asia/Dubai',
        status: dfmStatus,
        localTime: getLocalTime('Asia/Dubai'),
        openTime: '10:00 AM',
        closeTime: '2:00 PM',
      },
      {
        name: 'NSE',
        city: 'New Delhi',
        timezone: 'Asia/Kolkata',
        status: nseStatus,
        localTime: getLocalTime('Asia/Kolkata'),
        openTime: '9:15 AM',
        closeTime: '3:30 PM',
      },
    ]);
  };

  useEffect(() => {
    updateMarkets();
    const interval = setInterval(updateMarkets, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: MarketStatus['status']) => {
    switch (status) {
      case 'open':
        return <Badge variant="default" className="bg-green-500 text-xs">Open</Badge>;
      case 'after-hours':
        return <Badge variant="secondary" className="bg-yellow-500 text-black text-xs">Extended</Badge>;
      case 'closed':
        return <Badge variant="destructive" className="text-xs">Closed</Badge>;
    }
  };

  const topRowMarkets = markets.slice(0, 4);
  const bottomRowMarkets = markets.slice(4);

  return (
    <Card data-testid="widget-world-clocks">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="w-4 h-4" />
          Global Market Hours
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Real-time analog clocks - 8 major exchanges
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-amber-950/15 p-3 rounded-lg">
          <div className="grid grid-cols-4 gap-2">
            {topRowMarkets.map((market) => (
              <div
                key={market.name}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border border-border bg-slate-600/35 hover-elevate transition-all"
                onMouseEnter={(e) => {
                  const glowColor = market.status === 'open' 
                    ? 'rgba(34, 197, 94, 0.7)' 
                    : market.status === 'after-hours'
                    ? 'rgba(234, 179, 8, 0.7)'
                    : 'rgba(239, 68, 68, 0.7)';
                  e.currentTarget.style.boxShadow = `inset 0 0 20px ${glowColor}, inset 0 0 40px ${glowColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '';
                }}
                data-testid={`market-${market.name.toLowerCase().replace(/\//g, '-')}`}
              >
              <AnalogClock time={market.localTime} status={market.status} />
              
              <div className="text-center space-y-0.5 w-full">
                <div className="font-semibold text-xs text-foreground">{market.name}</div>
                <div className="text-xs text-muted-foreground">{market.city}</div>
                <div className="text-xs font-mono text-muted-foreground">
                  {market.localTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  {market.openTime} - {market.closeTime}
                </div>
                {getStatusBadge(market.status)}
              </div>
            </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-950/15 p-3 rounded-lg">
          <div className="grid grid-cols-4 gap-2">
            {bottomRowMarkets.map((market) => (
              <div
                key={market.name}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border border-border bg-slate-600/35 hover-elevate transition-all"
                onMouseEnter={(e) => {
                  const glowColor = market.status === 'open' 
                    ? 'rgba(34, 197, 94, 0.7)' 
                    : market.status === 'after-hours'
                    ? 'rgba(234, 179, 8, 0.7)'
                    : 'rgba(239, 68, 68, 0.7)';
                  e.currentTarget.style.boxShadow = `inset 0 0 20px ${glowColor}, inset 0 0 40px ${glowColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '';
                }}
                data-testid={`market-${market.name.toLowerCase().replace(/\//g, '-')}`}
              >
              <AnalogClock time={market.localTime} status={market.status} />
              
              <div className="text-center space-y-0.5 w-full">
                <div className="font-semibold text-xs text-foreground">{market.name}</div>
                <div className="text-xs text-muted-foreground">{market.city}</div>
                <div className="text-xs font-mono text-muted-foreground">
                  {market.localTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  {market.openTime} - {market.closeTime}
                </div>
                {getStatusBadge(market.status)}
              </div>
            </div>
          ))}
          </div>
        </div>

        <div className="pt-2 border-t border-border flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Open</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Extended</span>
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
