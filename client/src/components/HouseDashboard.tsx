import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, Users, Trophy,
  Briefcase, Droplets, Shield, BookOpen, Palette, Eye, Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Seven Houses data - noir crime families of Paneltown
const SEVEN_HOUSES = [
  {
    id: 'sequential-securities',
    name: 'Sequential Securities',
    boss: 'The Publisher',
    specialization: 'Publishers & Series',
    color: '#DC2626', // Blood red
    icon: Briefcase,
    slogan: 'Control the press, control the market',
    headquarters: 'Print District',
    soundEffect: 'BANG!',
  },
  {
    id: 'ink-blood-syndicate',
    name: 'Ink & Blood Syndicate',
    boss: 'The Shadow',
    specialization: 'Anti-Heroes & Villains',
    color: '#7C3AED', // Deep purple
    icon: Droplets,
    slogan: 'Fear is the best investment',
    headquarters: 'Villain\'s Row',
    soundEffect: 'SLASH!',
  },
  {
    id: 'heroic-trust',
    name: 'The Heroic Trust',
    boss: 'The Champion',
    specialization: 'Classic Heroes & Teams',
    color: '#2563EB', // Heroic blue
    icon: Shield,
    slogan: 'Justice pays dividends',
    headquarters: 'Hero Heights',
    soundEffect: 'POW!',
  },
  {
    id: 'narrative-capital',
    name: 'Narrative Capital',
    boss: 'The Scribe',
    specialization: 'Writers & Storylines',
    color: '#059669', // Ink green
    icon: BookOpen,
    slogan: 'Every story has a price',
    headquarters: 'Writer\'s Block',
    soundEffect: 'SCRIBBLE!',
  },
  {
    id: 'visual-holdings',
    name: 'Visual Holdings',
    boss: 'The Artist',
    specialization: 'Artists & Artwork',
    color: '#EA580C', // Artist orange
    icon: Palette,
    slogan: 'Beauty is power',
    headquarters: 'Canvas Corner',
    soundEffect: 'SPLASH!',
  },
  {
    id: 'vigilante-exchange',
    name: 'The Vigilante Exchange',
    boss: 'The Watcher',
    specialization: 'Street-Level Heroes',
    color: '#64748B', // Street gray
    icon: Eye,
    slogan: 'From the shadows, profit',
    headquarters: 'Back Alley Market',
    soundEffect: 'THWACK!',
  },
  {
    id: 'crossover-consortium',
    name: 'Crossover Consortium',
    boss: 'The Broker',
    specialization: 'Multiverse & Events',
    color: '#BE185D', // Reality pink
    icon: Globe,
    slogan: 'When worlds collide, we collect',
    headquarters: 'Nexus Tower',
    soundEffect: 'BOOM!',
  },
];

// Comic panel component with noir styling
function HousePanel({ 
  house,
  data,
  rank,
  isActive,
  onClick,
  delay = 0,
}: {
  house: typeof SEVEN_HOUSES[0];
  data: any;
  rank: number;
  isActive: boolean;
  onClick: () => void;
  delay?: number;
}) {
  const [showEffect, setShowEffect] = useState(false);
  const Icon = house.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      onClick={onClick}
      className={cn(
        "relative cursor-pointer group",
        "border-8 border-black bg-gradient-to-br from-gray-900 to-black",
        "shadow-2xl overflow-hidden",
        isActive && "ring-4 ring-offset-4 ring-offset-black",
      )}
      style={{
        borderRadius: '0',
        clipPath: rank % 2 === 0 
          ? 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)' 
          : 'polygon(0% 0%, 95% 0%, 100% 100%, 5% 100%)',
        '--house-color': house.color,
      } as any}
      data-testid={`house-panel-${house.id}`}
    >
      {/* Crosshatch texture overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 3px, ${house.color}20 3px, ${house.color}20 6px),
            repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.05) 3px, rgba(255,255,255,0.05) 6px)
          `
        }}
      />

      {/* Sound effect on hover */}
      <AnimatePresence>
        {showEffect && (
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1.5, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-2 right-2 z-50 pointer-events-none"
            style={{
              color: house.color,
              textShadow: '2px 2px 0 #000, -2px -2px 0 #000',
              fontFamily: 'Impact, sans-serif',
              fontSize: '2rem',
              fontWeight: '300'
            }}
          >
            {house.soundEffect}
          </motion.div>
        )}
      </AnimatePresence>

      {/* House content */}
      <div className="relative p-4 h-full min-h-[280px] flex flex-col"
        onMouseEnter={() => setShowEffect(true)}
        onMouseLeave={() => setShowEffect(false)}
      >
        {/* House header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Icon 
                className="h-6 w-6" 
                style={{ color: house.color }}
              />
              <Badge 
                variant="outline" 
                className="text-xs border-2"
                style={{ 
                  borderColor: house.color,
                  color: house.color 
                }}
              >
                RANK #{rank}
              </Badge>
            </div>
            <h3 className="text-white font-bold text-lg mt-1 group-hover:text-white/90 transition-colors">
              {house.name}
            </h3>
            <p className="text-xs text-gray-500 italic">
              "{house.slogan}"
            </p>
          </div>
          
          {/* Power indicator */}
          <div className="text-right">
            <div className="text-xs text-gray-500">POWER</div>
            <div className="font-mono text-sm" style={{ color: house.color }}>
              {data?.powerLevel || '100'}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          <div className="bg-black/50 p-2 border border-white/10">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              MARKET CAP
            </div>
            <div className="font-mono text-sm text-white">
              ${data?.marketCap || '0'}M
            </div>
          </div>
          
          <div className="bg-black/50 p-2 border border-white/10">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              24H VOL
            </div>
            <div className="font-mono text-sm text-white">
              ${data?.dailyVolume || '0'}K
            </div>
          </div>
          
          <div className="bg-black/50 p-2 border border-white/10">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Users className="h-3 w-3" />
              MEMBERS
            </div>
            <div className="font-mono text-sm text-white">
              {data?.memberCount || '0'}
            </div>
          </div>
          
          <div className="bg-black/50 p-2 border border-white/10">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              ASSETS
            </div>
            <div className="font-mono text-sm text-white">
              {data?.controlledAssetsCount || '0'}
            </div>
          </div>
        </div>

        {/* House info footer */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex justify-between items-center">
            <div className="text-xs">
              <span className="text-gray-500">BOSS:</span>{' '}
              <span className="text-white font-bold">{house.boss}</span>
            </div>
            <div className="text-xs">
              <span className="text-gray-500">HQ:</span>{' '}
              <span className="text-white">{house.headquarters}</span>
            </div>
          </div>
          <div className="text-xs text-center mt-1" style={{ color: house.color }}>
            {house.specialization}
          </div>
        </div>
      </div>

      {/* Noir shadow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}

// Power struggle event component
function PowerStruggleEvent({ event }: { event: any }) {
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="relative bg-black border-2 border-white p-3 mb-2"
      style={{
        boxShadow: '4px 4px 0 rgba(255,255,255,0.1)',
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)'
      }}
    >
      <div className="absolute top-1 right-1 text-xs text-gray-500">
        {new Date(event.timestamp).toLocaleTimeString()}
      </div>
      <div className="font-bold text-white text-sm mb-1">
        {event.soundEffect && (
          <span className="text-red-500 mr-2">{event.soundEffect}</span>
        )}
        {event.title}
      </div>
      <div className="text-xs text-gray-400">
        {event.description}
      </div>
    </motion.div>
  );
}

export function HouseDashboard() {
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
  const [powerEvents, setPowerEvents] = useState<any[]>([]);
  
  // Fetch house data
  const { data: housesData, isLoading } = useQuery({
    queryKey: ['/api/houses'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch power rankings
  const { data: rankings } = useQuery({
    queryKey: ['/api/houses/rankings'],
    refetchInterval: 30000,
  });

  // Simulate power struggle events
  useEffect(() => {
    const interval = setInterval(() => {
      const events = [
        {
          title: "TURF WAR!",
          description: "Sequential Securities raids Ink & Blood territory",
          soundEffect: "CRASH!",
        },
        {
          title: "HOSTILE TAKEOVER",
          description: "The Heroic Trust acquires 5 new hero assets",
          soundEffect: "KA-CHING!",
        },
        {
          title: "ALLIANCE FORMED",
          description: "Visual Holdings partners with Narrative Capital",
          soundEffect: "SHAKE!",
        },
        {
          title: "BETRAYAL!",
          description: "The Vigilante Exchange double-crosses Crossover Consortium",
          soundEffect: "STAB!",
        },
      ];
      
      const randomEvent = {
        ...events[Math.floor(Math.random() * events.length)],
        timestamp: new Date(),
        id: Math.random().toString(),
      };
      
      setPowerEvents(prev => [randomEvent, ...prev].slice(0, 5));
    }, 15000); // New event every 15 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white p-4">
      {/* Header with noir comic title */}
      <div className="text-center mb-8">
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl font-black mb-2"
          style={{
            textShadow: '4px 4px 0 #000, -2px -2px 0 #fff',
            fontFamily: 'Impact, sans-serif',
            letterSpacing: '2px'
          }}
        >
          THE SEVEN HOUSES
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 italic"
        >
          Crime families of Paneltown's comic market
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Power struggle events ticker */}
        <Card className="bg-black/80 border-2 border-white/20 mb-6 p-4">
          <h3 className="text-sm font-bold text-red-500 mb-3">
            POWER STRUGGLES
          </h3>
          <ScrollArea className="h-32">
            <AnimatePresence>
              {powerEvents.map(event => (
                <PowerStruggleEvent key={event.id} event={event} />
              ))}
            </AnimatePresence>
          </ScrollArea>
        </Card>

        {/* House panels grid - irregular comic layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto"
          style={{
            gridAutoFlow: 'dense',
          }}
        >
          {SEVEN_HOUSES.map((house, index) => {
            const houseData = housesData?.find((h: any) => h.id === house.id);
            const ranking = rankings?.find((r: any) => r.houseId === house.id);
            const rank = ranking?.rankPosition || index + 1;
            
            return (
              <div
                key={house.id}
                className={cn(
                  // Make some panels span 2 columns for variety
                  index === 0 && "xl:col-span-2",
                  index === 3 && "lg:col-span-2 xl:col-span-1",
                  index === 6 && "md:col-span-2 lg:col-span-1",
                )}
              >
                <HousePanel
                  house={house}
                  data={houseData}
                  rank={rank}
                  isActive={selectedHouse === house.id}
                  onClick={() => setSelectedHouse(
                    selectedHouse === house.id ? null : house.id
                  )}
                  delay={index * 0.1}
                />
              </div>
            );
          })}
        </div>

        {/* Selected house details */}
        <AnimatePresence>
          {selectedHouse && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6"
            >
              <Card className="bg-black/90 border-4 border-white p-6">
                <h3 className="text-2xl font-bold mb-4" 
                  style={{
                    color: SEVEN_HOUSES.find(h => h.id === selectedHouse)?.color
                  }}
                >
                  {SEVEN_HOUSES.find(h => h.id === selectedHouse)?.name} INTEL
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-900 p-4 border-2 border-white/20">
                    <h4 className="text-sm text-gray-500 mb-2">TOP ASSETS</h4>
                    <div className="space-y-1">
                      <div className="text-xs">• SPIDER-MAN #1</div>
                      <div className="text-xs">• BATMAN: YEAR ONE</div>
                      <div className="text-xs">• X-MEN #137</div>
                    </div>
                  </div>
                  <div className="bg-gray-900 p-4 border-2 border-white/20">
                    <h4 className="text-sm text-gray-500 mb-2">RECENT MOVES</h4>
                    <div className="space-y-1">
                      <div className="text-xs text-green-400">+15% Territory Gain</div>
                      <div className="text-xs text-red-400">-8% Member Loss</div>
                      <div className="text-xs text-yellow-400">New Alliance Pending</div>
                    </div>
                  </div>
                  <div className="bg-gray-900 p-4 border-2 border-white/20">
                    <h4 className="text-sm text-gray-500 mb-2">THREAT LEVEL</h4>
                    <div className="text-3xl font-bold"
                      style={{
                        color: SEVEN_HOUSES.find(h => h.id === selectedHouse)?.color
                      }}
                    >
                      EXTREME
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}