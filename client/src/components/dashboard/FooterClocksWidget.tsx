import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
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
    <div className={`relative w-7 h-7 rounded-full border ${getFaceColor()} flex items-center justify-center overflow-visible`}>
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

export function FooterClocksWidget() {
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
        name: 'TSX',
        city: 'Toronto',
        timezone: 'America/Toronto',
        status: getMarketStatus('America/Toronto', 9.5, 16),
        localTime: getLocalTime('America/Toronto'),
        openTime: '9:30 AM',
        closeTime: '4:00 PM',
      },
      {
        name: 'HKEx',
        city: 'Hong Kong',
        timezone: 'Asia/Hong_Kong',
        status: getMarketStatus('Asia/Hong_Kong', 9.5, 16),
        localTime: getLocalTime('Asia/Hong_Kong'),
        openTime: '9:30 AM',
        closeTime: '4:00 PM',
      },
      {
        name: 'DFM',
        city: 'Dubai',
        timezone: 'Asia/Dubai',
        status: getMarketStatus('Asia/Dubai', 10, 14),
        localTime: getLocalTime('Asia/Dubai'),
        openTime: '10:00 AM',
        closeTime: '2:00 PM',
      },
      {
        name: 'NSE',
        city: 'New Delhi',
        timezone: 'Asia/Kolkata',
        status: getMarketStatus('Asia/Kolkata', 9.25, 15.5),
        localTime: getLocalTime('Asia/Kolkata'),
        openTime: '9:15 AM',
        closeTime: '3:30 PM',
      }
    ];

    // Show all markets (not just open ones)
    setMarkets(allMarkets);
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
    <div className="bg-[#1A1F2E]/80 border-t border-border/50 p-3" data-testid="footer-clocks">
      <div className="flex items-center justify-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
          <span className="text-xs text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Additional Markets</span>
        </div>
        
        {markets.map((market) => (
          <div
            key={market.name}
            className="flex items-center gap-2 p-1.5 rounded-md bg-[#252B3C] border border-border/30"
            data-testid={`footer-market-${market.name.toLowerCase()}`}
          >
            <AnalogClock time={market.localTime} status={market.status} />
            
            <div className="flex flex-col gap-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-foreground " style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>{market.name}</span>
                {getStatusBadge(market.status)}
              </div>
              <span className="text-xs text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                {market.city} • {market.localTime.toLocaleTimeString('en-US', { 
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
  );
}
