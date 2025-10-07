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
    <div className={`relative w-10 h-10 rounded-full border ${getFaceColor()} flex items-center justify-center overflow-visible`}>
      <svg className="absolute w-full h-full" viewBox="0 0 100 100" style={{ transform: 'scale(2)' }}>
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = 50 + 38 * Math.cos(angle);
          const y = 50 + 38 * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i % 3 === 0 ? 1 : 0.5}
              className="fill-muted-foreground"
            />
          );
        })}
        
        <line
          x1="50"
          y1="50"
          x2={50 + 25 * Math.cos(hourAngle * Math.PI / 180)}
          y2={50 + 25 * Math.sin(hourAngle * Math.PI / 180)}
          className={`${getStatusColor()} stroke-[1.5]`}
          strokeLinecap="round"
        />
        
        <line
          x1="50"
          y1="50"
          x2={50 + 35 * Math.cos(minuteAngle * Math.PI / 180)}
          y2={50 + 35 * Math.sin(minuteAngle * Math.PI / 180)}
          className={`${getStatusColor()} stroke-[1]`}
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
    
    // Use 24-hour format (0-23 hours)
    const currentTime24 = hour + minute / 60;
    
    const dayOfWeek = marketTime.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 'closed';
    }

    if (hasExtendedHours && extendedStart !== undefined && extendedEnd !== undefined) {
      if (currentTime24 >= extendedStart && currentTime24 < openHour) {
        return 'after-hours';
      }
      
      if (currentTime24 >= closeHour && currentTime24 < extendedEnd) {
        return 'after-hours';
      }
    }

    if (currentTime24 >= openHour && currentTime24 < closeHour) {
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
    const tseStatus = getMarketStatus('Asia/Tokyo', 9, 15);

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
        name: 'TSE',
        city: 'Tokyo',
        timezone: 'Asia/Tokyo',
        status: tseStatus,
        localTime: getLocalTime('Asia/Tokyo'),
        openTime: '9:00 AM',
        closeTime: '3:00 PM',
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
        return <Badge variant="default" className="bg-green-500 text-sm" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Open</Badge>;
      case 'after-hours':
        return <Badge variant="secondary" className="bg-yellow-500 text-black text-sm" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Extended</Badge>;
      case 'closed':
        return <Badge variant="destructive" className="text-sm" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Closed</Badge>;
    }
  };


  return (
    <Card className="!bg-[#1A1F2E] purple-rimlight-hover" data-testid="widget-world-clocks">
      <CardHeader className="pb-3 space-y-0">
        <div className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt', marginBottom: '-4px' }}>
          <Globe className="w-4 h-4 text-purple-500" />
          <span>Global Market Hours</span>
        </div>
        <p className="text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}>
          Real-time analog clocks - 3 major exchanges
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-[#252B3C] p-3 rounded-lg">
          <div className="grid grid-cols-3 gap-3">
            {markets.map((market) => (
              <div
                key={market.name}
                className="flex flex-col items-center gap-1 p-3 rounded-lg border border-border bg-[#2D3748] hover-elevate transition-all purple-rimlight-hover min-h-[160px] justify-between"
                data-testid={`market-${market.name.toLowerCase().replace(/\//g, '-')}`}
              >
              <AnalogClock time={market.localTime} status={market.status} />
              
              <div className="text-center space-y-0 w-full">
                <div className="text-sm text-foreground truncate leading-tight" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>{market.name}</div>
                <div className="text-sm text-muted-foreground truncate leading-tight" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>{market.city}</div>
                <div className="text-sm text-muted-foreground truncate whitespace-nowrap leading-tight" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                  {market.localTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
                <div className="text-sm text-muted-foreground leading-tight truncate whitespace-nowrap" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                  {market.openTime} - {market.closeTime}
                </div>
                <div className="whitespace-nowrap mt-1">
                  {getStatusBadge(market.status)}
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-border flex flex-wrap gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Open</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Extended</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Closed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
