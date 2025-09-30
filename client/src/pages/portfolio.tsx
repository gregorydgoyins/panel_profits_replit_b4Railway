import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle,
  Briefcase, Droplets, Shield, BookOpen, Palette, Eye, Globe,
  Skull, Crown, Swords, Target, RefreshCw, ArrowUp, ArrowDown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useHouseTheme } from '@/contexts/HouseThemeContext';
import { apiRequest } from '@/lib/queryClient';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Seven Houses configuration
const SEVEN_HOUSES = [
  { id: 'sequential-securities', name: 'Sequential Securities', icon: Briefcase, color: '#DC2626' },
  { id: 'ink-blood', name: 'Ink & Blood', icon: Droplets, color: '#7C3AED' },
  { id: 'heroic-trust', name: 'Heroic Trust', icon: Shield, color: '#2563EB' },
  { id: 'narrative-capital', name: 'Narrative Capital', icon: BookOpen, color: '#059669' },
  { id: 'visual-holdings', name: 'Visual Holdings', icon: Palette, color: '#EA580C' },
  { id: 'vigilante-exchange', name: 'Vigilante Exchange', icon: Eye, color: '#64748B' },
  { id: 'crossover-consortium', name: 'Crossover Consortium', icon: Globe, color: '#BE185D' },
];

// Comic panel component with noir styling
function NoirComicPanel({ 
  id,
  gridArea,
  title,
  caption,
  soundEffect,
  children,
  delay = 0,
  kenBurnsType = 'zoomIn',
  isLosing = false,
  onClick,
  className = ''
}: { 
  id: string;
  gridArea: string;
  title?: string;
  caption?: string;
  soundEffect?: string;
  children: React.ReactNode;
  delay?: number;
  kenBurnsType?: 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight';
  isLosing?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    if (soundEffect) {
      const timer = setTimeout(() => setShowEffect(true), delay + 500);
      return () => clearTimeout(timer);
    }
  }, [soundEffect, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.02, zIndex: 50 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden",
        "border-8 border-black shadow-2xl",
        "bg-gradient-to-br from-gray-900 to-black",
        onClick && "cursor-pointer",
        className
      )}
      style={{ gridArea }}
      data-testid={`portfolio-panel-${id}`}
    >
      {/* Film grain effect */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
        }}
      />

      {/* Venetian blind shadows - only on larger panels */}
      {gridArea.includes('hero') && (
        <div className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 10px,
              rgba(0,0,0,0.3) 10px,
              rgba(0,0,0,0.3) 12px
            )`
          }}
        />
      )}

      {/* Rain effect for losing positions */}
      {isLosing && (
        <div className="absolute inset-0 pointer-events-none z-20 opacity-30">
          <div className="rain-effect" />
        </div>
      )}

      {/* Ken Burns effect on hover for charts */}
      {kenBurnsType !== 'zoomIn' && isHovered && (
        <div className={`absolute inset-0 ken-burns-${kenBurnsType}`} />
      )}

      {/* Caption box */}
      {caption && (
        <div className="absolute top-3 left-3 z-30 bg-black border-2 border-white px-2 py-1"
          style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.8)' }}
        >
          <div className="text-white text-xs font-mono uppercase tracking-wider">
            {caption}
          </div>
        </div>
      )}

      {/* Sound effect */}
      <AnimatePresence>
        {showEffect && soundEffect && (
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1.2, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="absolute top-4 right-4 z-40 pointer-events-none"
            style={{
              color: isLosing ? '#DC2626' : '#10B981',
              textShadow: '3px 3px 0 #000, -3px -3px 0 #000',
              fontFamily: 'Impact, sans-serif',
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}
          >
            {soundEffect}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      {title && (
        <div className="absolute top-0 left-0 right-0 bg-black/80 border-b-2 border-white p-2 z-20">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">{title}</h3>
        </div>
      )}

      {/* Content */}
      <div className="relative h-full p-4 z-10">
        {children}
      </div>

      {/* Hover glow effect */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 30px rgba(255,255,255,0.1)',
            background: 'radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.05) 100%)'
          }}
        />
      )}
    </motion.div>
  );
}

// Portfolio metrics component
function PortfolioMetric({ 
  label, 
  value, 
  change, 
  icon: Icon,
  narrative,
  isNegative = false 
}: {
  label: string;
  value: string | number;
  change?: string;
  icon?: any;
  narrative?: string;
  isNegative?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className={cn("h-5 w-5", isNegative ? "text-red-500" : "text-green-500")} />}
        <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className={cn(
        "font-mono text-3xl font-black",
        isNegative ? "text-red-500" : "text-white"
      )}
        style={{
          textShadow: isNegative ? '0 0 10px rgba(239,68,68,0.5)' : '0 0 10px rgba(255,255,255,0.2)'
        }}
      >
        {value}
        {isNegative && '!!!'}
      </div>
      {change && (
        <div className={cn(
          "text-sm font-mono",
          isNegative ? "text-red-400" : "text-green-400"
        )}>
          {change}
        </div>
      )}
      {narrative && (
        <div className="text-xs text-gray-400 italic mt-2">
          "{narrative}"
        </div>
      )}
    </div>
  );
}

// Holding strip component - vertical comic strip style
function HoldingStrip({ 
  holding,
  onClick
}: {
  holding: {
    id: string;
    name: string;
    value: number;
    change: number;
    quantity: number;
  };
  onClick?: () => void;
}) {
  const isLosing = holding.change < 0;
  
  return (
    <motion.div
      whileHover={{ x: 5 }}
      onClick={onClick}
      className="border-4 border-black bg-gradient-to-r from-gray-900 to-black p-3 cursor-pointer relative overflow-hidden"
      data-testid={`holding-strip-${holding.id}`}
    >
      {/* Diagonal stripes for losses */}
      {isLosing && (
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(239,68,68,0.3) 10px,
              rgba(239,68,68,0.3) 20px
            )`
          }}
        />
      )}
      
      <div className="relative z-10">
        <div className="text-white font-bold text-sm mb-1">{holding.name}</div>
        <div className="text-xs text-gray-400">QTY: {holding.quantity}</div>
        <div className={cn(
          "font-mono text-lg font-bold mt-1",
          isLosing ? "text-red-500" : "text-green-500"
        )}>
          ${holding.value.toLocaleString()}
        </div>
        <div className={cn(
          "text-xs",
          isLosing ? "text-red-400" : "text-green-400"
        )}>
          {isLosing ? '▼' : '▲'} {Math.abs(holding.change)}%
        </div>
      </div>
    </motion.div>
  );
}

export default function NoirPortfolioDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedHolding, setSelectedHolding] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { currentHouse } = useHouseTheme();

  // Fetch portfolio data
  const { data: portfolioData, refetch, isLoading } = useQuery({
    queryKey: ['/api/portfolio', user?.id],
    queryFn: async () => {
      // Mock data for now - replace with actual API
      return {
        totalValue: 125430.50,
        dayChange: -2340.20,
        dayChangePercent: -1.83,
        allTimePL: 15230.00,
        allTimePLPercent: 13.82,
        holdingCount: 23,
        riskLevel: 3, // 1-5 scale
        dominantHouse: 'ink-blood',
        holdings: [
          { id: '1', name: 'BATMAN #1', value: 45000, change: 5.2, quantity: 1 },
          { id: '2', name: 'SPIDER-MAN #1', value: 38000, change: -2.1, quantity: 1 },
          { id: '3', name: 'X-MEN #1', value: 22000, change: 1.8, quantity: 2 },
          { id: '4', name: 'WATCHMEN #1', value: 15430, change: -3.5, quantity: 3 },
          { id: '5', name: 'SANDMAN #1', value: 5000, change: 12.3, quantity: 5 }
        ],
        recentTrades: [
          { id: '1', action: 'BUY', asset: 'DOOM #1', price: 450, time: '2 min ago' },
          { id: '2', action: 'SELL', asset: 'VENOM #3', price: 220, time: '15 min ago' },
          { id: '3', action: 'BUY', asset: 'JOKER #5', price: 180, time: '1 hour ago' }
        ],
        performanceData: [] // Chart data
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Calculate narrative based on performance
  const performanceNarrative = useMemo(() => {
    if (!portfolioData) return '';
    
    if (portfolioData.dayChangePercent < -5) {
      return "The market devours your wealth like a hungry beast...";
    } else if (portfolioData.dayChangePercent < -2) {
      return "Your portfolio bleeds red in the unforgiving streets of Paneltown...";
    } else if (portfolioData.dayChangePercent < 0) {
      return "A shadow falls across your holdings...";
    } else if (portfolioData.dayChangePercent < 2) {
      return "The fog lifts slightly, revealing modest gains...";
    } else if (portfolioData.dayChangePercent < 5) {
      return "Fortune smiles upon you in the dark alleys...";
    } else {
      return "You've struck gold in the criminal underworld of comics!";
    }
  }, [portfolioData]);

  // Get dominant house data
  const dominantHouseData = useMemo(() => {
    if (!portfolioData) return null;
    return SEVEN_HOUSES.find(h => h.id === portfolioData.dominantHouse);
  }, [portfolioData]);

  // Risk level narrative
  const getRiskNarrative = (level: number) => {
    const narratives = [
      "DEFCON 5 - All quiet on the western front",
      "DEFCON 4 - Tensions rising in the shadows",
      "DEFCON 3 - Danger lurks around every corner",
      "DEFCON 2 - The streets run red with risk",
      "DEFCON 1 - MAXIMUM DANGER! Retreat immediately!"
    ];
    return narratives[level - 1] || narratives[2];
  };

  // Chart options with noir theme
  const chartOptions: Highcharts.Options = {
    chart: {
      backgroundColor: 'transparent',
      style: { fontFamily: 'monospace' },
      animation: { duration: 1500 }
    },
    title: { text: '' },
    xAxis: {
      gridLineColor: '#333',
      labels: { style: { color: '#666' } }
    },
    yAxis: {
      gridLineColor: '#333',
      labels: { style: { color: '#666' } },
      title: { text: '' }
    },
    series: [{
      type: 'areaspline',
      name: 'Portfolio Value',
      data: Array.from({ length: 30 }, (_, i) => [
        Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
        120000 + Math.random() * 10000 - 5000
      ]),
      color: portfolioData?.dayChange && portfolioData.dayChange < 0 ? '#DC2626' : '#10B981',
      fillOpacity: 0.3
    }],
    credits: { enabled: false },
    legend: { enabled: false }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // CSS for effects
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rain {
        0% { background-position: 0 0; }
        100% { background-position: 0 100px; }
      }
      
      .rain-effect {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: linear-gradient(transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
        background-size: 2px 100px;
        animation: rain 0.5s linear infinite;
      }
      
      @keyframes ken-burns-zoomIn {
        0% { transform: scale(1); }
        100% { transform: scale(1.1); }
      }
      
      @keyframes ken-burns-panLeft {
        0% { transform: translateX(0); }
        100% { transform: translateX(-5%); }
      }
      
      .ken-burns-zoomIn {
        animation: ken-burns-zoomIn 10s ease-in-out infinite alternate;
      }
      
      .ken-burns-panLeft {
        animation: ken-burns-panLeft 10s ease-in-out infinite alternate;
      }

      @keyframes ticker {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white font-mono text-xl animate-pulse">
          LOADING PORTFOLIO DATA...
        </div>
      </div>
    );
  }

  const isLosing = portfolioData?.dayChange && portfolioData.dayChange < 0;
  const soundEffect = isLosing ? 'CRASH!' : portfolioData?.dayChange && portfolioData.dayChange > 1000 ? 'BOOM!' : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      {/* Header with refresh */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-wider"
            style={{ textShadow: '3px 3px 0 #000' }}>
            Portfolio Command Center
          </h1>
          <p className="text-gray-400 text-sm italic mt-1">
            {performanceNarrative}
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="border-2 border-white text-white hover:bg-white hover:text-black"
          data-testid="button-refresh-portfolio"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
          {refreshing ? 'UPDATING...' : 'REFRESH'}
        </Button>
      </div>

      {/* Comic panel grid layout - Kirby-inspired irregular panels */}
      <div 
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(8, minmax(80px, 1fr))',
          gridTemplateAreas: `
            "hero hero hero hero hero hero stats stats stats house house house"
            "hero hero hero hero hero hero stats stats stats house house house"
            "hero hero hero hero hero hero profit profit profit house house house"
            "chart chart chart chart chart chart chart chart holdings holdings holdings holdings"
            "chart chart chart chart chart chart chart chart holdings holdings holdings holdings"
            "chart chart chart chart chart chart chart chart holdings holdings holdings holdings"
            "trades trades trades trades trades trades trades trades risk risk risk risk"
            "trades trades trades trades trades trades trades trades risk risk risk risk"
          `,
          minHeight: '80vh'
        }}
      >
        {/* Hero Panel - Total Portfolio Value */}
        <NoirComicPanel
          id="total-value"
          gridArea="hero"
          caption="TOTAL PORTFOLIO VALUE"
          soundEffect={soundEffect}
          delay={0}
          isLosing={isLosing}
          className="min-h-[200px]"
        >
          <div className="flex flex-col justify-center h-full">
            <PortfolioMetric
              label="Current Value"
              value={`$${portfolioData?.totalValue.toLocaleString()}`}
              change={`${isLosing ? '▼' : '▲'} $${Math.abs(portfolioData?.dayChange || 0).toLocaleString()} (${portfolioData?.dayChangePercent}%)`}
              icon={DollarSign}
              narrative={performanceNarrative}
              isNegative={isLosing}
            />
          </div>
        </NoirComicPanel>

        {/* Stats Panel */}
        <NoirComicPanel
          id="stats"
          gridArea="stats"
          title="PORTFOLIO STATS"
          delay={1}
        >
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500">HOLDINGS</div>
              <div className="text-2xl font-mono font-bold text-white">
                {portfolioData?.holdingCount}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">ALL-TIME P/L</div>
              <div className={cn(
                "text-xl font-mono font-bold",
                portfolioData?.allTimePL && portfolioData.allTimePL > 0 ? "text-green-500" : "text-red-500"
              )}>
                ${portfolioData?.allTimePL.toLocaleString()}
                <span className="text-xs ml-1">({portfolioData?.allTimePLPercent}%)</span>
              </div>
            </div>
          </div>
        </NoirComicPanel>

        {/* Profit/Loss Panel */}
        <NoirComicPanel
          id="profit-loss"
          gridArea="profit"
          title="TODAY'S VERDICT"
          delay={2}
          isLosing={isLosing}
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className={cn(
                "text-3xl font-black mb-2",
                isLosing ? "text-red-500" : "text-green-500"
              )}
                style={{
                  textShadow: isLosing ? '0 0 20px rgba(239,68,68,0.8)' : '0 0 20px rgba(34,197,94,0.8)'
                }}
              >
                {isLosing ? '▼' : '▲'} {Math.abs(portfolioData?.dayChangePercent || 0)}%
              </div>
              <div className="text-xs text-gray-400 uppercase">
                {isLosing ? 'Losing Battle' : 'Winning Streak'}
              </div>
            </div>
          </div>
        </NoirComicPanel>

        {/* House Allegiance Panel */}
        <NoirComicPanel
          id="house"
          gridArea="house"
          title="HOUSE DOMINANCE"
          delay={3}
        >
          {dominantHouseData && (
            <div className="flex flex-col items-center justify-center h-full">
              <dominantHouseData.icon 
                className="h-16 w-16 mb-3"
                style={{ color: dominantHouseData.color }}
              />
              <div className="text-center">
                <div className="text-white font-bold text-lg">
                  {dominantHouseData.name}
                </div>
                <Badge 
                  className="mt-2"
                  style={{ 
                    backgroundColor: dominantHouseData.color,
                    color: 'white'
                  }}
                >
                  PRIMARY ALLEGIANCE
                </Badge>
              </div>
            </div>
          )}
        </NoirComicPanel>

        {/* Performance Chart Panel */}
        <NoirComicPanel
          id="chart"
          gridArea="chart"
          title="MARKET PERFORMANCE"
          delay={4}
          kenBurnsType="panLeft"
        >
          <div className="h-full">
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
              containerProps={{ style: { height: '100%', width: '100%' } }}
            />
          </div>
        </NoirComicPanel>

        {/* Holdings Strips */}
        <NoirComicPanel
          id="holdings"
          gridArea="holdings"
          title="TOP HOLDINGS"
          delay={5}
        >
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {portfolioData?.holdings.map((holding, index) => (
                <HoldingStrip
                  key={holding.id}
                  holding={holding}
                  onClick={() => setSelectedHolding(holding.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </NoirComicPanel>

        {/* Recent Trades Ticker */}
        <NoirComicPanel
          id="trades"
          gridArea="trades"
          title="RECENT ACTIVITY"
          delay={6}
        >
          <div className="relative h-full overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              <div 
                className="flex gap-8 animate-marquee whitespace-nowrap"
                style={{
                  animation: 'ticker 20s linear infinite'
                }}
              >
                {portfolioData?.recentTrades.concat(portfolioData?.recentTrades).map((trade, i) => (
                  <div key={`${trade.id}-${i}`} className="inline-flex items-center gap-2">
                    <Badge variant={trade.action === 'BUY' ? 'default' : 'destructive'}>
                      {trade.action}
                    </Badge>
                    <span className="text-white font-mono">{trade.asset}</span>
                    <span className="text-gray-400">${trade.price}</span>
                    <span className="text-xs text-gray-500">• {trade.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </NoirComicPanel>

        {/* Risk Level Panel */}
        <NoirComicPanel
          id="risk"
          gridArea="risk"
          title="THREAT ASSESSMENT"
          delay={7}
        >
          <div className="flex flex-col justify-center h-full">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={cn(
                      "w-8 h-8 mx-1 border-2",
                      level <= (portfolioData?.riskLevel || 3) 
                        ? "bg-red-500 border-red-500" 
                        : "bg-transparent border-gray-600"
                    )}
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                    }}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-400 uppercase">
                {getRiskNarrative(portfolioData?.riskLevel || 3)}
              </div>
              {portfolioData?.riskLevel && portfolioData.riskLevel >= 4 && (
                <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mt-2 animate-pulse" />
              )}
            </div>
          </div>
        </NoirComicPanel>
      </div>

      {/* Selected holding modal */}
      <AnimatePresence>
        {selectedHolding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedHolding(null)}
            data-testid="holding-detail-modal"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-black border-4 border-white p-6 max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-4">ASSET INTELLIGENCE</h2>
              <p className="text-gray-400">
                Detailed view for holding #{selectedHolding}
              </p>
              <Button 
                className="mt-4"
                onClick={() => setSelectedHolding(null)}
              >
                CLOSE DOSSIER
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}