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
    <div className={`relative w-8 h-8 rounded-full border ${getFaceColor()} flex items-center justify-center overflow-visible`}>
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

export function CompactClocksWidget() {
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
    const allMarkets = [
      {
        name: 'NYSE',
        city: 'New York',
        timezone: 'America/New_York',
        status: getMarketStatus('America/New_York', 9.5, 16, true, 4, 20),
        localTime: getLocalTime('America/New_York'),
        openTime: '9:30 AM',
        closeTime: '4:00 PM',
      },
      {
        name: 'LSE',
        city: 'London',
        timezone: 'Europe/London',
        status: getMarketStatus('Europe/London', 8, 16.5),
        localTime: getLocalTime('Europe/London'),
        openTime: '8:00 AM',
        closeTime: '4:30 PM',
      },
      {
        name: 'TSE',
        city: 'Tokyo',
        timezone: 'Asia/Tokyo',
        status: getMarketStatus('Asia/Tokyo', 9, 15),
        localTime: getLocalTime('Asia/Tokyo'),
        openTime: '9:00 AM',
        closeTime: '3:00 PM',
      },
      {
        name: 'HKEX',
        city: 'Hong Kong',
        timezone: 'Asia/Hong_Kong',
        status: getMarketStatus('Asia/Hong_Kong', 9.5, 16),
        localTime: getLocalTime('Asia/Hong_Kong'),
        openTime: '9:30 AM',
        closeTime: '4:00 PM',
      },
      {
        name: 'SSE',
        city: 'Shanghai',
        timezone: 'Asia/Shanghai',
        status: getMarketStatus('Asia/Shanghai', 9.5, 15),
        localTime: getLocalTime('Asia/Shanghai'),
        openTime: '9:30 AM',
        closeTime: '3:00 PM',
      },
    ];

    // Filter: NYSE always first, then up to 2 more open markets
    const nyse = allMarkets.find(m => m.name === 'NYSE')!;
    const otherOpenMarkets = allMarkets
      .filter(m => m.name !== 'NYSE' && m.status === 'open')
      .slice(0, 2);
    
    setMarkets([nyse, ...otherOpenMarkets]);
  };

  useEffect(() => {
    updateMarkets();
    const interval = setInterval(updateMarkets, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: MarketStatus['status']) => {
    switch (status) {
      case 'open':
        return <Badge variant="default" className="bg-green-500 text-xs px-1.5 py-0" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Open</Badge>;
      case 'after-hours':
        return <Badge variant="secondary" className="bg-yellow-500 text-black text-xs px-1.5 py-0" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Ext</Badge>;
      case 'closed':
        return <Badge variant="destructive" className="text-xs px-1.5 py-0" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Closed</Badge>;
    }
  };

  return (
    <div className="bg-[#252B3C] p-2 rounded-lg border border-border">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-500 flex-shrink-0" />
          <span className="text-sm text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Global Markets</span>
        </div>
        
        <div className="flex items-center gap-3 flex-1 justify-end">
          {markets.map((market) => (
            <div
              key={market.name}
              className="flex items-center gap-2 p-1.5 rounded-md bg-[#2D3748] border border-border/50"
              data-testid={`compact-market-${market.name.toLowerCase()}`}
            >
              <AnalogClock time={market.localTime} status={market.status} />
              
              <div className="flex flex-col gap-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-foreground " style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>{market.name}</span>
                  {getStatusBadge(market.status)}
                </div>
                <span className="text-xs text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                  {market.localTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
