import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { 
  TrendingUp, TrendingDown, Activity, Zap, Shield, Swords,
  Target, RefreshCw, ArrowUp, ArrowDown, Volume2, VolumeX,
  Flame, AlertTriangle, Eye, Users, Timer, Skull, Crown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useOptimizedWebSocket } from '@/hooks/useOptimizedWebSocket';
import { ComicChart } from '@/components/ComicChart';
import { apiRequest } from '@/lib/queryClient';

// Market event types
type MarketEventType = 'bull_run' | 'market_crash' | 'volatility' | 'sideways' | 'breakout' | 'breakdown';

// Sound effect mappings
const SOUND_EFFECTS = {
  bull_run: ['ZOOM!', 'WHOOSH!', 'UP UP UP!', 'TO THE MOON!'],
  market_crash: ['CRASH!', 'THUD!', 'SPLAT!', 'KABOOM!'],
  volatility: ['POW!', 'BAM!', 'WHAM!', 'CLASH!'],
  sideways: ['...', 'TICK TOCK', 'WAITING...', 'SILENCE'],
  breakout: ['BREAKTHROUGH!', 'SHATTER!', 'EXPLOSION!', 'FREEDOM!'],
  breakdown: ['CRACK!', 'CRUMBLE!', 'COLLAPSE!', 'FALL!'],
  high_volume: ['ROAR!', 'STAMPEDE!', 'THUNDER!', 'RUMBLE!']
};

// Caption narratives
const NARRATIVES = {
  bull_run: [
    "The bulls charge forward with unstoppable force...",
    "Heroes rise, lifting the market to new heights...",
    "Green energy surges through Paneltown...",
    "The momentum builds, nothing can stop them now..."
  ],
  market_crash: [
    "Darkness falls as the bears take control...",
    "Villains descend upon the market...",
    "Red destruction rains down on traders...",
    "The foundations crumble beneath their feet..."
  ],
  volatility: [
    "Bulls and bears clash in epic combat...",
    "The battle rages, neither side yielding...",
    "Chaos reigns in the streets of Paneltown...",
    "Every move met with fierce resistance..."
  ],
  sideways: [
    "The market holds its breath...",
    "A tense standoff, waiting for the next move...",
    "Time slows, anticipation builds...",
    "Both sides gather their strength..."
  ],
  breakout: [
    "Breaking free from constraints!",
    "A new chapter begins!",
    "The resistance shatters!",
    "Unleashed potential!"
  ],
  breakdown: [
    "Support levels crumble...",
    "The floor gives way...",
    "Defenses breached...",
    "Falling through darkness..."
  ]
};

// Seven Houses configuration
const SEVEN_HOUSES = [
  { id: 'sequential-securities', name: 'Sequential Securities', icon: '📊', color: '#DC2626' },
  { id: 'ink-blood', name: 'Ink & Blood', icon: '🩸', color: '#7C3AED' },
  { id: 'heroic-trust', name: 'Heroic Trust', icon: '🛡️', color: '#2563EB' },
  { id: 'narrative-capital', name: 'Narrative Capital', icon: '📖', color: '#059669' },
  { id: 'visual-holdings', name: 'Visual Holdings', icon: '🎨', color: '#EA580C' },
  { id: 'vigilante-exchange', name: 'Vigilante Exchange', icon: '👁️', color: '#64748B' },
  { id: 'crossover-consortium', name: 'Crossover Consortium', icon: '🌐', color: '#BE185D' },
];

interface MarketEvent {
  id: string;
  type: MarketEventType;
  asset: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  house?: string;
  timestamp: Date;
  narrative?: string;
  soundEffect?: string;
}

// Comic Panel Component
function ComicActionPanel({ 
  event,
  index,
  isNew = false
}: { 
  event: MarketEvent;
  index: number;
  isNew?: boolean;
}) {
  const [showSoundEffect, setShowSoundEffect] = useState(isNew);
  const [showCaption, setShowCaption] = useState(false);
  
  useEffect(() => {
    if (isNew) {
      setShowSoundEffect(true);
      setTimeout(() => setShowCaption(true), 300);
      setTimeout(() => setShowSoundEffect(false), 2000);
    }
  }, [isNew]);

  const getBackgroundStyle = () => {
    switch(event.type) {
      case 'bull_run':
        return 'bg-gradient-to-t from-green-950 to-green-900';
      case 'market_crash':
        return 'bg-gradient-to-b from-red-950 to-black';
      case 'volatility':
        return 'bg-gradient-to-br from-orange-950 via-red-950 to-yellow-950';
      case 'sideways':
        return 'bg-gradient-to-r from-gray-900 to-gray-950';
      case 'breakout':
        return 'bg-gradient-radial from-green-900 to-green-950';
      case 'breakdown':
        return 'bg-gradient-radial from-red-900 to-red-950';
      default:
        return 'bg-gray-900';
    }
  };

  const getActionLines = () => {
    switch(event.type) {
      case 'bull_run':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 bg-green-400"
                style={{
                  top: `${20 + i * 15}%`,
                  width: '200%',
                  left: '-100%'
                }}
                initial={{ x: 0 }}
                animate={{ x: '100%' }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        );
      case 'market_crash':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 bg-red-500"
                style={{
                  left: `${10 + i * 12}%`,
                  height: '150%',
                  top: '-50%'
                }}
                initial={{ y: 0 }}
                animate={{ y: '100%' }}
                transition={{ 
                  duration: 0.8,
                  delay: i * 0.05,
                  repeat: Infinity,
                  ease: "easeIn"
                }}
              />
            ))}
          </div>
        );
      case 'volatility':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute h-2 ${i % 2 === 0 ? 'bg-green-400' : 'bg-red-400'}`}
                style={{
                  top: `${10 + i * 15}%`,
                  width: '150%',
                  transform: `rotate(${i % 2 === 0 ? '15deg' : '-15deg'})`
                }}
                initial={{ x: i % 2 === 0 ? '-100%' : '100%' }}
                animate={{ x: i % 2 === 0 ? '100%' : '-100%' }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const house = event.house ? SEVEN_HOUSES.find(h => h.id === event.house) : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "relative border-8 border-black shadow-2xl overflow-hidden",
        isNew && "ring-4 ring-yellow-500 ring-opacity-75",
        event.type === 'volatility' ? 'transform rotate-1' : '',
        event.type === 'market_crash' ? 'transform -rotate-1' : ''
      )}
      style={{ 
        minHeight: '300px',
        transform: event.type === 'volatility' ? 'perspective(1000px) rotateY(5deg)' : undefined
      }}
      data-testid={`market-event-panel-${event.id}`}
    >
      {/* Background with gradient */}
      <div className={cn("absolute inset-0", getBackgroundStyle())} />
      
      {/* Action lines */}
      {getActionLines()}
      
      {/* Film grain effect */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
        }}
      />
      
      {/* Caption box */}
      <AnimatePresence>
        {showCaption && event.narrative && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-3 left-3 z-30 bg-black border-2 border-white px-3 py-2 max-w-[70%]"
            style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.8)' }}
          >
            <div className="text-white text-xs font-mono uppercase leading-tight tracking-wider">
              {event.narrative}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sound effect */}
      <AnimatePresence>
        {showSoundEffect && event.soundEffect && (
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1.2, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="absolute top-4 right-4 z-40 pointer-events-none"
            style={{
              color: event.type === 'bull_run' || event.type === 'breakout' ? '#10B981' : 
                     event.type === 'market_crash' || event.type === 'breakdown' ? '#DC2626' : 
                     '#F59E0B',
              textShadow: '3px 3px 0 #000, -3px -3px 0 #000',
              fontFamily: 'Impact, sans-serif',
              fontSize: '3rem',
              fontWeight: 'bold',
              transform: `rotate(${event.type === 'volatility' ? '10deg' : '-5deg'})`
            }}
          >
            {event.soundEffect}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content */}
      <div className="relative z-20 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-white tracking-wider">
              {event.symbol}
            </h3>
            <p className="text-sm text-gray-300">{event.asset}</p>
          </div>
          {house && (
            <div 
              className="px-3 py-1 rounded-full text-white text-sm font-bold"
              style={{ backgroundColor: house.color }}
            >
              {house.icon} {house.name}
            </div>
          )}
        </div>
        
        {/* Price and change */}
        <div className="flex items-center gap-4">
          <div className="text-4xl font-mono font-black text-white">
            ${event.price.toFixed(2)}
          </div>
          <div className={cn(
            "flex items-center gap-1 text-2xl font-bold",
            event.change > 0 ? "text-green-400" : "text-red-400"
          )}>
            {event.change > 0 ? <ArrowUp className="h-6 w-6" /> : <ArrowDown className="h-6 w-6" />}
            {Math.abs(event.changePercent).toFixed(2)}%
          </div>
        </div>
        
        {/* Volume indicator */}
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-400" />
          <div className="flex-1 bg-black/50 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, event.volume / 10000)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <span className="text-sm text-gray-300">{(event.volume / 1000).toFixed(1)}K</span>
        </div>
        
        {/* Timestamp */}
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Timer className="h-3 w-3" />
          {new Date(event.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
}

export default function MarketActionPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [marketEvents, setMarketEvents] = useState<MarketEvent[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // WebSocket connection for real-time data
  const { isConnected, lastMessage } = useOptimizedWebSocket({
    url: '/ws/market-action',
    onMessage: (data) => {
      if (data.type === 'market_event') {
        handleNewMarketEvent(data.event);
      }
    },
    reconnectAttempts: 5
  });
  
  // Determine market event type based on price movement
  const determineEventType = (changePercent: number, volume: number): MarketEventType => {
    const absChange = Math.abs(changePercent);
    
    if (absChange > 5) {
      return changePercent > 0 ? 'bull_run' : 'market_crash';
    } else if (absChange > 3) {
      return changePercent > 0 ? 'breakout' : 'breakdown';
    } else if (absChange > 1.5) {
      return 'volatility';
    } else {
      return 'sideways';
    }
  };
  
  // Handle new market event
  const handleNewMarketEvent = useCallback((eventData: any) => {
    const eventType = determineEventType(eventData.changePercent, eventData.volume);
    const soundEffects = SOUND_EFFECTS[eventType];
    const narratives = NARRATIVES[eventType];
    
    const newEvent: MarketEvent = {
      id: `event-${Date.now()}-${Math.random()}`,
      type: eventType,
      asset: eventData.asset || 'Unknown Asset',
      symbol: eventData.symbol || 'XXX',
      price: eventData.price || 0,
      change: eventData.change || 0,
      changePercent: eventData.changePercent || 0,
      volume: eventData.volume || 0,
      house: eventData.house,
      timestamp: new Date(),
      narrative: narratives[Math.floor(Math.random() * narratives.length)],
      soundEffect: soundEffects[Math.floor(Math.random() * soundEffects.length)]
    };
    
    setMarketEvents(prev => [newEvent, ...prev].slice(0, 20)); // Keep last 20 events
    
    // Auto-scroll to new event
    if (autoScroll && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [autoScroll]);
  
  // Simulate market events for demo
  useEffect(() => {
    const assets = [
      { symbol: 'SPDR', asset: 'Spider-Man Comics' },
      { symbol: 'BATM', asset: 'Batman Series' },
      { symbol: 'XMEN', asset: 'X-Men Collection' },
      { symbol: 'AVEN', asset: 'Avengers Issues' },
      { symbol: 'SUPR', asset: 'Superman Archive' },
      { symbol: 'WOND', asset: 'Wonder Woman' },
      { symbol: 'IRON', asset: 'Iron Man Tech' },
      { symbol: 'THOR', asset: 'Thor Mythology' }
    ];
    
    const interval = setInterval(() => {
      const asset = assets[Math.floor(Math.random() * assets.length)];
      const changePercent = (Math.random() - 0.5) * 10; // -5% to +5%
      const volume = Math.floor(Math.random() * 50000) + 5000;
      
      handleNewMarketEvent({
        ...asset,
        price: 100 + (Math.random() * 50),
        change: changePercent,
        changePercent,
        volume,
        house: Math.random() > 0.7 ? SEVEN_HOUSES[Math.floor(Math.random() * SEVEN_HOUSES.length)].id : undefined
      });
    }, 5000); // New event every 5 seconds
    
    return () => clearInterval(interval);
  }, [handleNewMarketEvent]);
  
  // Load initial data
  const { data: topMovers } = useQuery({
    queryKey: ['/api/market/top-movers'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-5xl font-black text-white tracking-wider" 
                style={{ textShadow: '3px 3px 0 #000' }}>
              MARKET ACTION
            </h1>
            <p className="text-gray-400 mt-2">Live Comic Book Battle Sequences</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant={soundEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="gap-2"
              data-testid="button-toggle-sound"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Sound
            </Button>
            
            <Button
              variant={autoScroll ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoScroll(!autoScroll)}
              className="gap-2"
              data-testid="button-toggle-autoscroll"
            >
              <RefreshCw className={cn("h-4 w-4", autoScroll && "animate-spin")} />
              Auto-Scroll
            </Button>
            
            <Badge variant="outline" className="gap-1">
              <Activity className={cn("h-3 w-3", isConnected ? "text-green-500" : "text-red-500")} />
              {isConnected ? "Live" : "Offline"}
            </Badge>
          </div>
        </motion.div>
      </div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Action Panels */}
        <div className="lg:col-span-2 space-y-8">
          <ScrollArea className="h-[calc(100vh-200px)]" ref={scrollRef}>
            <div className="space-y-6 pr-4">
              {marketEvents.length === 0 ? (
                <Card className="p-12 text-center bg-gray-900/50 border-gray-800">
                  <Skull className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-400">Waiting for Market Action...</h3>
                  <p className="text-sm text-gray-500 mt-2">The battle will begin soon</p>
                </Card>
              ) : (
                marketEvents.map((event, index) => (
                  <ComicActionPanel
                    key={event.id}
                    event={event}
                    index={index}
                    isNew={index === 0}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Side Panel - Chart and Stats */}
        <div className="space-y-6">
          {/* Comic Chart */}
          <Card className="p-4 bg-gray-900/80 border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">Battle Chart</h3>
            <ComicChart
              data={marketEvents}
              height={300}
            />
          </Card>
          
          {/* House Involvement */}
          <Card className="p-4 bg-gray-900/80 border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">House Activity</h3>
            <div className="space-y-2">
              {SEVEN_HOUSES.map(house => {
                const houseEvents = marketEvents.filter(e => e.house === house.id);
                const activity = houseEvents.length;
                
                return (
                  <div key={house.id} className="flex items-center gap-3">
                    <div className="w-8 text-center">{house.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-300">{house.name}</div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full"
                          style={{ backgroundColor: house.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, activity * 20)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
          
          {/* Market Mood */}
          <Card className="p-4 bg-gray-900/80 border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">Market Mood</h3>
            <div className="space-y-3">
              {(() => {
                const bullish = marketEvents.filter(e => 
                  e.type === 'bull_run' || e.type === 'breakout'
                ).length;
                const bearish = marketEvents.filter(e => 
                  e.type === 'market_crash' || e.type === 'breakdown'
                ).length;
                const sentiment = bullish > bearish ? 'bullish' : 
                                 bearish > bullish ? 'bearish' : 'neutral';
                
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Bulls: {bullish}
                      </span>
                      <span className="text-red-400 flex items-center gap-2">
                        <TrendingDown className="h-5 w-5" />
                        Bears: {bearish}
                      </span>
                    </div>
                    <div className="text-center py-4">
                      <div className={cn(
                        "text-3xl font-black uppercase tracking-wider",
                        sentiment === 'bullish' ? 'text-green-400' : 
                        sentiment === 'bearish' ? 'text-red-400' : 
                        'text-gray-400'
                      )}
                      style={{ textShadow: '2px 2px 0 #000' }}
                      >
                        {sentiment}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {sentiment === 'bullish' ? 'Heroes are winning!' :
                         sentiment === 'bearish' ? 'Villains dominate!' :
                         'The battle rages on...'}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}