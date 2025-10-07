import { useState, useEffect } from 'react';

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
      case 'open': return 'stroke-green-400';
      case 'after-hours': return 'stroke-yellow-400';
      case 'closed': return 'stroke-red-400';
    }
  };
  
  const getFaceColor = () => {
    switch (status) {
      case 'open': return 'bg-green-500/20 border-green-400/40';
      case 'after-hours': return 'bg-yellow-500/20 border-yellow-400/40';
      case 'closed': return 'bg-red-500/20 border-red-400/40';
    }
  };

  return (
    <div className={`relative w-12 h-12 rounded-full border ${getFaceColor()} flex items-center justify-center`}>
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
              r={i % 3 === 0 ? 1.5 : 0.8}
              className="fill-white/40"
            />
          );
        })}
        
        <line
          x1="50"
          y1="50"
          x2={50 + 25 * Math.cos(hourAngle * Math.PI / 180)}
          y2={50 + 25 * Math.sin(hourAngle * Math.PI / 180)}
          className={`${getStatusColor()} stroke-[2]`}
          strokeLinecap="round"
        />
        
        <line
          x1="50"
          y1="50"
          x2={50 + 35 * Math.cos(minuteAngle * Math.PI / 180)}
          y2={50 + 35 * Math.sin(minuteAngle * Math.PI / 180)}
          className={`${getStatusColor()} stroke-[1.5]`}
          strokeLinecap="round"
        />
        
        <circle cx="50" cy="50" r="3" className={getStatusColor().replace('stroke', 'fill')} />
      </svg>
    </div>
  );
}

export function GlobalMarketClocks() {
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
        name: 'ASX',
        city: 'Sydney',
        timezone: 'Australia/Sydney',
        status: getMarketStatus('Australia/Sydney', 10, 16),
        localTime: getLocalTime('Australia/Sydney'),
        openTime: '10:00 AM',
        closeTime: '4:00 PM',
      },
    ];

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
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-400/30">OPEN</span>;
      case 'after-hours':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-400/30">PRE/POST</span>;
      case 'closed':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400 border border-red-400/30">CLOSED</span>;
    }
  };

  return (
    <div className="bg-[#252B3C] border-t border-white/10 px-6 py-3">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="text-white/70" style={{ fontSize: '14pt', fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
          Global Markets
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {markets.map((market) => (
            <div 
              key={market.name} 
              className="flex items-center gap-3"
              data-testid={`market-clock-${market.name.toLowerCase()}`}
            >
              <AnalogClock time={market.localTime} status={market.status} />
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium font-mono text-sm">{market.name}</span>
                  {getStatusBadge(market.status)}
                </div>
                <div className="text-white/60 font-mono text-xs">
                  {market.localTime.toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
                <div className="text-white/40 text-xs">
                  {market.city}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
