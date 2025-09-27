import React, { useState, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';

interface MarketTime {
  city: string;
  timezone: string;
  marketOpen: string;
  marketClose: string;
  flag: string;
  primaryColorHex: string;
  isMarketHours: boolean;
}

export function GlobalMarketClocks() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const markets: MarketTime[] = [
    {
      city: 'New York',
      timezone: 'America/New_York',
      marketOpen: '09:30',
      marketClose: '16:00',
      flag: '🇺🇸',
      primaryColorHex: '#F97316',
      isMarketHours: false
    },
    {
      city: 'London',
      timezone: 'Europe/London',
      marketOpen: '08:00',
      marketClose: '16:30',
      flag: '🇬🇧',
      primaryColorHex: '#EA580C',
      isMarketHours: false
    },
    {
      city: 'Tokyo',
      timezone: 'Asia/Tokyo',
      marketOpen: '09:00',
      marketClose: '15:00',
      flag: '🇯🇵',
      primaryColorHex: '#DC2626',
      isMarketHours: false
    },
    {
      city: 'Dubai',
      timezone: 'Asia/Dubai',
      marketOpen: '10:00',
      marketClose: '14:00',
      flag: '🇦🇪',
      primaryColorHex: '#FACC15',
      isMarketHours: false
    },
    {
      city: 'Sydney',
      timezone: 'Australia/Sydney',
      marketOpen: '10:00',
      marketClose: '16:00',
      flag: '🇦🇺',
      primaryColorHex: '#FB923C',
      isMarketHours: false
    }
  ];

  const getTimeInTimezone = (timezone: string): string => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(currentTime);
  };

  const isMarketOpen = (timezone: string, open: string, close: string): boolean => {
    const marketTime = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(currentTime);

    const [currentHour, currentMinute] = marketTime.split(':').map(Number);
    const [openHour, openMinute] = open.split(':').map(Number);
    const [closeHour, closeMinute] = close.split(':').map(Number);

    const currentTotalMinutes = currentHour * 60 + currentMinute;
    const openTotalMinutes = openHour * 60 + openMinute;
    const closeTotalMinutes = closeHour * 60 + closeMinute;

    return currentTotalMinutes >= openTotalMinutes && currentTotalMinutes <= closeTotalMinutes;
  };

  const getAnalogClockSVG = (time: string, colorHex: string, isOpen: boolean) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    
    // Convert to 12-hour format for analog display
    const hour12 = hours % 12;
    
    // Calculate angles
    const secondAngle = (seconds * 6) - 90; // 6 degrees per second
    const minuteAngle = (minutes * 6 + seconds * 0.1) - 90; // 6 degrees per minute
    const hourAngle = (hour12 * 30 + minutes * 0.5) - 90; // 30 degrees per hour
    
    const size = 48;
    const center = size / 2;
    const clockRadius = 20;
    
    return (
      <svg width={size} height={size} className="transform transition-transform group-hover:scale-110">
        {/* Clock face */}
        <circle
          cx={center}
          cy={center}
          r={clockRadius}
          fill="transparent"
          stroke="white"
          strokeWidth="2"
          className="transition-colors"
        />
        
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) - 90;
          const x1 = center + (clockRadius - 4) * Math.cos(angle * Math.PI / 180);
          const y1 = center + (clockRadius - 4) * Math.sin(angle * Math.PI / 180);
          const x2 = center + clockRadius * Math.cos(angle * Math.PI / 180);
          const y2 = center + clockRadius * Math.sin(angle * Math.PI / 180);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="white"
              strokeWidth={i % 3 === 0 ? '2' : '1'}
              className="transition-colors"
            />
          );
        })}
        
        {/* Hour hand */}
        <line
          x1={center}
          y1={center}
          x2={center + 12 * Math.cos(hourAngle * Math.PI / 180)}
          y2={center + 12 * Math.sin(hourAngle * Math.PI / 180)}
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-colors"
        />
        
        {/* Minute hand */}
        <line
          x1={center}
          y1={center}
          x2={center + 16 * Math.cos(minuteAngle * Math.PI / 180)}
          y2={center + 16 * Math.sin(minuteAngle * Math.PI / 180)}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          className="transition-colors"
        />
        
        {/* Second hand */}
        <line
          x1={center}
          y1={center}
          x2={center + 18 * Math.cos(secondAngle * Math.PI / 180)}
          y2={center + 18 * Math.sin(secondAngle * Math.PI / 180)}
          stroke="#EF4444"
          strokeWidth="1"
          strokeLinecap="round"
        />
        
        {/* Center dot */}
        <circle
          cx={center}
          cy={center}
          r="2"
          fill="white"
          className="transition-colors"
        />
        
        {/* Market status indicator */}
        <circle
          cx={center + 15}
          cy={center - 15}
          r="3"
          fill={isOpen ? '#22C55E' : '#6B7280'}
          className="transition-colors"
        >
          <animate 
            attributeName="opacity" 
            values={isOpen ? "1;0.3;1" : "1"} 
            dur={isOpen ? "2s" : "0s"} 
            repeatCount="indefinite" 
          />
        </circle>
      </svg>
    );
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {markets.map((market) => {
        const time = getTimeInTimezone(market.timezone);
        const isOpen = isMarketOpen(market.timezone, market.marketOpen, market.marketClose);
        
        return (
          <div 
            key={market.city} 
            className="group text-center hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-[0_0_10px_rgba(249,115,22,0.5)]"
          >
            <div className="relative mb-2">
              {getAnalogClockSVG(time, market.primaryColorHex, isOpen)}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-center space-x-1">
                <span className="text-lg">{market.flag}</span>
                <span className="font-hind font-light text-black text-sm">
                  {market.city}
                </span>
              </div>
              <div className="text-black font-hind font-light text-xs">
                <span className="text-white">{time}</span>
              </div>
              <div className={`text-xs px-1 py-0.5 rounded-full border ${
                isOpen 
                  ? 'bg-green-900/30 border-green-700/50 text-green-200' 
                 : 'bg-red-900/30 border-red-700/50 text-black'
              }`}>
                {isOpen ? 'Active' : 'Off-Hours'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default GlobalMarketClocks;