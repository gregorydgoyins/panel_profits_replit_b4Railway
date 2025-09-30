import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, TrendingDown, Activity, DollarSign, Clock, BarChart3, 
  Wallet, Target, AlertTriangle, RefreshCw, Eye, Terminal,
  Skull, ArrowUp, ArrowDown, Ghost, Briefcase, Droplets, Shield, BookOpen,
  Palette, Globe, Cigarette, MapPin, FileText, Users, Zap,
  Phone, Coffee, Newspaper, Radio, Building
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useOptimizedWebSocket } from '@/hooks/useOptimizedWebSocket';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { apiRequest } from '@/lib/queryClient';

// Seven Houses configuration with noir themes
const SEVEN_HOUSES = [
  { 
    id: 'sequential-securities', 
    name: 'Sequential Securities', 
    icon: Building, 
    color: '#FFEB3B', // Neon yellow
    theme: 'corporate-towers',
    boss: 'The Publisher',
    territory: 'Publishing District',
    soundEffect: 'BANG!',
    atmosphere: 'Neon-lit skyscrapers, rain-slicked streets'
  },
  { 
    id: 'ink-blood', 
    name: 'Ink & Blood Syndicate', 
    icon: Droplets, 
    color: '#9C27B0', // Purple
    theme: 'smoke-shadows',
    boss: 'The Shadow',
    territory: 'Villain\'s Alley',
    soundEffect: 'SLASH!',
    atmosphere: 'Purple smoke, dark alleys, danger'
  },
  { 
    id: 'heroic-trust', 
    name: 'The Heroic Trust', 
    icon: Shield, 
    color: '#2196F3', // Blue
    theme: 'police-lights',
    boss: 'The Commissioner',
    territory: 'Hero Heights',
    soundEffect: 'POW!',
    atmosphere: 'Blue police lights, justice prevails'
  },
  { 
    id: 'narrative-capital', 
    name: 'Narrative Capital', 
    icon: BookOpen, 
    color: '#4CAF50', // Green
    theme: 'typewriter-keys',
    boss: 'The Writer',
    territory: 'Writer\'s Block',
    soundEffect: 'CLICK!',
    atmosphere: 'Green glow of old typewriters'
  },
  { 
    id: 'visual-holdings', 
    name: 'Visual Holdings', 
    icon: Palette, 
    color: '#FF9800', // Orange
    theme: 'artist-brushes',
    boss: 'The Artist',
    territory: 'Canvas Corner',
    soundEffect: 'SPLASH!',
    atmosphere: 'Orange paint splatters, creative chaos'
  },
  { 
    id: 'vigilante-exchange', 
    name: 'The Vigilante Exchange', 
    icon: Eye, 
    color: '#607D8B', // Gray
    theme: 'alley-shadows',
    boss: 'The Watcher',
    territory: 'Back Alley Exchange',
    soundEffect: 'THWACK!',
    atmosphere: 'Gray shadows, watching from darkness'
  },
  { 
    id: 'crossover-consortium', 
    name: 'Crossover Consortium', 
    icon: Globe, 
    color: '#E91E63', // Pink
    theme: 'dimensional-rifts',
    boss: 'The Broker',
    territory: 'Reality Nexus',
    soundEffect: 'BOOM!',
    atmosphere: 'Pink rifts, dimensions colliding'
  },
];

interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: string;
  currentPrice?: number;
  dayChange?: number;
  dayChangePercent?: number;
  volume?: number;
  house?: string;
}

// Comic sound effect component
const ComicSoundEffect = ({ effect, color = '#FF0000' }: { effect: string; color?: string }) => (
  <motion.div
    initial={{ scale: 0, rotate: -15 }}
    animate={{ scale: 1.5, rotate: 0 }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="absolute z-50 pointer-events-none"
    style={{
      color,
      textShadow: '3px 3px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
      fontFamily: 'Impact, sans-serif',
      fontSize: '3rem',
      fontWeight: 'bold',
      transform: 'rotate(-5deg)'
    }}
  >
    {effect}
  </motion.div>
);

// Newspaper headline ticker
const NewsHeadline = ({ headline }: { headline: string }) => (
  <motion.div
    initial={{ x: '100vw' }}
    animate={{ x: '-100vw' }}
    transition={{ duration: 20, ease: "linear" }}
    className="absolute top-2 whitespace-nowrap"
    style={{
      fontFamily: 'Georgia, serif',
      fontSize: '1.2rem',
      textTransform: 'uppercase',
      background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0.8) 80%, transparent)',
      padding: '0.5rem 2rem',
    }}
  >
    📰 BREAKING: {headline}
  </motion.div>
);

// Case file component for assets
const CaseFile = memo(({ 
  asset, 
  isSelected, 
  onSelect, 
  realTimePrice,
  house 
}: { 
  asset: Asset; 
  isSelected: boolean; 
  onSelect: (asset: Asset) => void;
  realTimePrice?: { price: number; flash: 'up' | 'down' | null } | null;
  house?: typeof SEVEN_HOUSES[0];
}) => {
  const handleClick = useCallback(() => onSelect(asset), [asset, onSelect]);
  const displayPrice = realTimePrice?.price || asset.currentPrice || 0;
  const isProfit = asset.dayChangePercent && asset.dayChangePercent > 0;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 10 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn(
        "relative p-3 cursor-pointer transition-all",
        "bg-gradient-to-br from-yellow-900/20 to-yellow-800/10",
        "border-2 border-yellow-700/50",
        isSelected && "border-red-500 shadow-lg shadow-red-500/30",
        "group overflow-hidden"
      )}
      style={{
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
        background: isSelected 
          ? `linear-gradient(135deg, ${house?.color}20, transparent)`
          : 'linear-gradient(135deg, #1a1a1a, #0a0a0a)',
      }}
      data-testid={`asset-case-${asset.id}`}
    >
      {/* Paper clip */}
      <div className="absolute top-1 right-2 text-gray-600 text-2xl">📎</div>
      
      {/* Stamp effect */}
      <div className="absolute top-2 left-2 opacity-30 transform rotate-12">
        <div className="text-xs font-bold text-red-600 border-2 border-red-600 px-1">
          {asset.type?.toUpperCase() || 'CLASSIFIED'}
        </div>
      </div>
      
      {/* Case file content */}
      <div className="relative z-10">
        <div className="font-mono text-yellow-200 text-sm mb-1">
          CASE #{asset.symbol}
        </div>
        <div className="text-xs text-gray-400 mb-2 truncate">
          {asset.name}
        </div>
        
        {/* Price with blood splatter or cash effect */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <div className={cn(
              "font-mono text-lg",
              realTimePrice?.flash === 'up' ? 'text-green-400' : 
              realTimePrice?.flash === 'down' ? 'text-red-400' : 
              'text-white'
            )}>
              ${displayPrice.toFixed(2)}
            </div>
            {isProfit !== undefined && (
              <div className="absolute -right-8 top-0">
                {isProfit ? (
                  <span className="text-green-400 text-2xl">💵</span>
                ) : (
                  <span className="text-red-600 text-xl">🩸</span>
                )}
              </div>
            )}
          </div>
          
          <div className={cn(
            "text-xs font-bold",
            isProfit ? "text-green-400" : "text-red-400"
          )}>
            {asset.dayChangePercent ? 
              `${asset.dayChangePercent > 0 ? '+' : ''}${asset.dayChangePercent.toFixed(1)}%` : 
              'PENDING'
            }
          </div>
        </div>
        
        {/* Volume as crowd silhouettes */}
        {asset.volume && (
          <div className="mt-2 flex items-center gap-1 opacity-50">
            {[...Array(Math.min(5, Math.floor(asset.volume / 10000)))].map((_, i) => (
              <Users key={i} className="h-3 w-3" />
            ))}
            <span className="text-xs ml-1">{(asset.volume / 1000).toFixed(0)}K</span>
          </div>
        )}
      </div>
      
      {/* Coffee stain effect */}
      <div className="absolute bottom-0 right-0 w-12 h-12 rounded-full bg-brown-800/20 blur-lg" />
    </motion.div>
  );
});
CaseFile.displayName = 'CaseFile';

// Crime scene investigation board for chart
const CrimeSceneChart = ({ 
  chartData, 
  selectedAsset,
  house
}: { 
  chartData: any; 
  selectedAsset: Asset | null;
  house?: typeof SEVEN_HOUSES[0];
}) => {
  const chartOptions = useMemo(() => ({
    chart: {
      backgroundColor: 'transparent',
      style: { fontFamily: 'Courier New, monospace' },
      animation: true,
    },
    title: {
      text: `EVIDENCE: ${selectedAsset?.symbol || 'NO CASE SELECTED'}`,
      style: { color: '#FFD700', fontSize: '18px', fontWeight: 'bold' }
    },
    plotOptions: {
      series: {
        animation: true,
      },
      line: {
        color: house?.color || '#FF0000',
        lineWidth: 2,
        marker: {
          enabled: true,
          radius: 3,
          fillColor: '#FF0000',
          lineColor: '#000',
          lineWidth: 1,
        }
      }
    },
    xAxis: {
      type: 'datetime',
      labels: { style: { color: '#888' } },
      gridLineColor: '#333',
      gridLineDashStyle: 'Dash',
    },
    yAxis: {
      labels: { style: { color: '#888' } },
      gridLineColor: '#333',
      gridLineDashStyle: 'Dash',
      title: { text: 'PRICE ($)', style: { color: '#888' } }
    },
    series: [{
      type: 'line',
      name: 'Investigation Timeline',
      data: chartData.prices || [],
      zones: [{
        value: chartData.averagePrice || 100,
        color: '#00FF00'
      }, {
        color: '#FF0000'
      }]
    }],
    credits: { enabled: false },
    legend: { enabled: false }
  }), [chartData, selectedAsset, house]);
  
  return (
    <div className="relative h-full bg-gradient-to-br from-gray-900 to-black p-4 border-8 border-gray-800">
      {/* Cork board texture */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(139,69,19,0.1) 10px, rgba(139,69,19,0.1) 20px)'
        }}
      />
      
      {/* Red string connections */}
      <svg className="absolute inset-0 pointer-events-none opacity-30">
        <line x1="10%" y1="20%" x2="40%" y2="60%" stroke="red" strokeWidth="2" />
        <line x1="60%" y1="30%" x2="90%" y2="70%" stroke="red" strokeWidth="2" />
        <line x1="30%" y1="80%" x2="70%" y2="40%" stroke="red" strokeWidth="2" />
      </svg>
      
      {/* Push pins */}
      <div className="absolute top-4 left-4 text-2xl">📌</div>
      <div className="absolute top-4 right-4 text-2xl">📌</div>
      <div className="absolute bottom-4 left-4 text-2xl">📌</div>
      <div className="absolute bottom-4 right-4 text-2xl">📌</div>
      
      {/* Chart */}
      <div className="relative z-10 h-full">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>
      
      {/* Evidence tags */}
      {selectedAsset && (
        <>
          <div className="absolute top-12 left-12 bg-yellow-200 text-black p-2 transform rotate-3 text-xs font-bold">
            EVIDENCE #{Math.floor(Math.random() * 9999)}
          </div>
          <div className="absolute bottom-12 right-12 bg-white text-black p-2 transform -rotate-2 text-xs">
            CLASSIFIED
          </div>
        </>
      )}
    </div>
  );
};

// Alley order book
const AlleyOrderBook = ({ orderBook, house }: { orderBook: any; house?: typeof SEVEN_HOUSES[0] }) => {
  return (
    <div className="h-full bg-gradient-to-b from-gray-900 to-black p-4 relative overflow-hidden">
      {/* Brick wall texture */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, #333 0px, #333 2px, transparent 2px, transparent 10px),
            repeating-linear-gradient(90deg, #333 0px, #333 2px, transparent 2px, transparent 20px)
          `
        }}
      />
      
      {/* Alley atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
      
      <h3 className="text-sm font-bold text-yellow-400 mb-4 relative z-10">
        BACK ALLEY DEALS
      </h3>
      
      <div className="space-y-2 relative z-10">
        {/* Buy orders - shadowy figures offering */}
        <div>
          <div className="text-xs text-green-400 mb-2 font-bold">BUYERS IN THE SHADOWS</div>
          <div className="space-y-1">
            {orderBook?.bids?.slice(0, 5).map((bid: any, i: number) => (
              <div key={`bid-${i}`} className="flex items-center justify-between p-2 bg-green-900/20 border-l-2 border-green-400">
                <div className="flex items-center gap-2">
                  <div className="text-gray-600">🕴️</div>
                  <span className="text-xs text-gray-400">Figure #{i + 1}</span>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-mono text-sm">${bid.price}</div>
                  <div className="text-xs text-gray-500">{bid.quantity} units</div>
                </div>
              </div>
            )) || (
              <div className="text-xs text-gray-500 italic p-2">No buyers lurking...</div>
            )}
          </div>
        </div>
        
        {/* Sell orders - shadowy figures selling */}
        <div>
          <div className="text-xs text-red-400 mb-2 font-bold">SELLERS IN THE MIST</div>
          <div className="space-y-1">
            {orderBook?.asks?.slice(0, 5).map((ask: any, i: number) => (
              <div key={`ask-${i}`} className="flex items-center justify-between p-2 bg-red-900/20 border-l-2 border-red-400">
                <div className="flex items-center gap-2">
                  <div className="text-gray-600">🕵️</div>
                  <span className="text-xs text-gray-400">Shadow #{i + 1}</span>
                </div>
                <div className="text-right">
                  <div className="text-red-400 font-mono text-sm">${ask.price}</div>
                  <div className="text-xs text-gray-500">{ask.quantity} units</div>
                </div>
              </div>
            )) || (
              <div className="text-xs text-gray-500 italic p-2">No sellers around...</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Street lamp glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300/10 rounded-full blur-3xl" />
    </div>
  );
};

// Briefcase exchange order panel
const BriefcaseExchange = ({ 
  selectedAsset,
  orderType,
  setOrderType,
  orderQuantity,
  setOrderQuantity,
  orderPrice,
  setOrderPrice,
  onSubmit,
  house
}: any) => {
  const [showEffect, setShowEffect] = useState<string | null>(null);
  
  const handleSubmit = () => {
    setShowEffect(orderType === 'buy' ? 'DEAL!' : 'BETRAY!');
    setTimeout(() => setShowEffect(null), 1000);
    onSubmit();
  };
  
  return (
    <div className="relative p-6 bg-gradient-to-br from-gray-900 to-black border-t-4 border-yellow-600/50">
      {/* Briefcase background */}
      <div className="absolute inset-0 opacity-10 flex items-center justify-center">
        <Briefcase className="h-32 w-32" />
      </div>
      
      {/* Sound effect */}
      <AnimatePresence>
        {showEffect && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <ComicSoundEffect effect={showEffect} color={orderType === 'buy' ? '#00FF00' : '#FF0000'} />
          </div>
        )}
      </AnimatePresence>
      
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-yellow-400 mb-4">
          THE EXCHANGE
        </h3>
        
        {/* Job type selector */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Button
            onClick={() => setOrderType('buy')}
            className={cn(
              "relative overflow-hidden transition-all",
              orderType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-800 hover:bg-gray-700'
            )}
            data-testid="button-buy-deal"
          >
            <span className="relative z-10 font-bold text-lg">
              💚 DEAL
            </span>
            {orderType === 'buy' && (
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-green-400"
                style={{ 
                  boxShadow: '0 0 30px rgba(0,255,0,0.8)',
                  filter: 'blur(10px)'
                }}
              />
            )}
          </Button>
          
          <Button
            onClick={() => setOrderType('sell')}
            className={cn(
              "relative overflow-hidden transition-all",
              orderType === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-700'
            )}
            data-testid="button-sell-betray"
          >
            <span className="relative z-10 font-bold text-lg">
              🔴 BETRAY
            </span>
            {orderType === 'sell' && (
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-red-400"
                style={{
                  boxShadow: '0 0 30px rgba(255,0,0,0.8)',
                  filter: 'blur(10px)'
                }}
              />
            )}
          </Button>
        </div>
        
        {/* Order details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              CONTRACT SIZE
            </label>
            <Input
              type="number"
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(e.target.value)}
              placeholder="0"
              className="bg-black/50 border-yellow-600/50 text-white"
              data-testid="input-quantity"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              PRICE PER UNIT
            </label>
            <Input
              type="number"
              value={orderPrice}
              onChange={(e) => setOrderPrice(e.target.value)}
              placeholder="0.00"
              className="bg-black/50 border-yellow-600/50 text-white"
              data-testid="input-price"
            />
          </div>
        </div>
        
        {/* Execute button */}
        <Button
          onClick={handleSubmit}
          disabled={!selectedAsset || !orderQuantity || !orderPrice}
          className={cn(
            "w-full h-12 font-bold text-lg transition-all",
            "bg-gradient-to-r from-yellow-600 to-orange-600",
            "hover:from-yellow-500 hover:to-orange-500",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          data-testid="button-execute-trade"
        >
          <Briefcase className="mr-2 h-5 w-5" />
          EXECUTE THE {orderType === 'buy' ? 'DEAL' : 'BETRAYAL'}
        </Button>
      </div>
    </div>
  );
};

// Main trading page component
export default function NoirTradingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<typeof SEVEN_HOUSES[0]>(SEVEN_HOUSES[0]);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [orderQuantity, setOrderQuantity] = useState('');
  const [orderPrice, setOrderPrice] = useState('');
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [showRain, setShowRain] = useState(true);
  const [showSmoke, setShowSmoke] = useState(true);
  
  // WebSocket connection
  const { 
    getRealTimePrice,
    getOrderBook,
    isConnected
  } = useOptimizedWebSocket({ 
    subscribeTo: { 
      assets: selectedAsset ? [selectedAsset.id] : []
    }
  });
  
  // Fetch assets
  const { data: assetsData, isLoading: assetsLoading } = useQuery({
    queryKey: ['/api/assets'],
    staleTime: 60000,
  });
  
  const assets: Asset[] = useMemo(() => 
    Array.isArray(assetsData) ? assetsData : [],
    [assetsData]
  );
  
  // Random headlines generator
  useEffect(() => {
    const headlineTemplates = [
      "HERO PORTFOLIO UP 200% - CITIZENS REJOICE",
      "VILLAIN STOCKS CRASH - JUSTICE PREVAILS",
      "MYSTERIOUS TRADER MAKES MILLION DOLLAR MOVE",
      "CROSSOVER EVENT SENDS MARKETS SOARING",
      "INK & BLOOD SYNDICATE UNDER INVESTIGATION",
      "SEQUENTIAL SECURITIES ANNOUNCES MERGER",
      "THE MASTERMIND STRIKES AGAIN - MARKETS TREMBLE",
      "VIGILANTE EXCHANGE SEES RECORD VOLUME",
    ];
    
    const interval = setInterval(() => {
      const randomHeadline = headlineTemplates[Math.floor(Math.random() * headlineTemplates.length)];
      setHeadlines(prev => [...prev, randomHeadline].slice(-3));
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleAssetSelect = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
    setOrderPrice(asset.currentPrice?.toString() || '');
  }, []);
  
  const handleOrderSubmit = useCallback(async () => {
    if (!selectedAsset || !orderQuantity || !orderPrice) {
      toast({
        title: "DEAL REJECTED",
        description: "The briefcase is empty. Fill in all details.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          assetId: selectedAsset.id,
          type: orderType,
          quantity: parseFloat(orderQuantity),
          price: parseFloat(orderPrice),
          userId: user?.id,
        }),
      });
      
      toast({
        title: orderType === 'buy' ? "💚 DEAL MADE!" : "🔴 BETRAYAL COMPLETE!",
        description: `${orderQuantity} units of ${selectedAsset.symbol} @ $${orderPrice}`,
      });
      
      setOrderQuantity('');
      setOrderPrice('');
      queryClient.invalidateQueries({ queryKey: ['/api/orders/user', user?.id] });
    } catch (error) {
      toast({
        title: "EXCHANGE FAILED",
        description: "The deal went south. Try again.",
        variant: "destructive",
      });
    }
  }, [selectedAsset, orderQuantity, orderPrice, orderType, user?.id, toast]);
  
  // Mock chart data for demo
  const chartData = useMemo(() => ({
    prices: selectedAsset ? 
      [...Array(20)].map((_, i) => ({
        x: Date.now() - (20 - i) * 3600000,
        y: (selectedAsset.currentPrice || 100) * (0.9 + Math.random() * 0.2)
      })) : [],
    averagePrice: selectedAsset?.currentPrice || 100
  }), [selectedAsset]);
  
  return (
    <div className="h-screen overflow-hidden bg-black text-white relative">
      {/* Atmosphere Effects Layer */}
      <div className="absolute inset-0 pointer-events-none z-40">
        {/* Film grain */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="turbulence" baseFrequency="0.9"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")',
            mixBlendMode: 'overlay'
          }}
        />
        
        {/* Rain effect */}
        {showRain && (
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'linear-gradient(transparent 50%, rgba(255,255,255,0.1) 50%)',
              backgroundSize: '1px 4px',
              animation: 'rain 0.3s linear infinite',
            }}
          />
        )}
        
        {/* Venetian blinds */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(0,0,0,0.3) 8px, rgba(0,0,0,0.3) 10px)',
          }}
        />
        
        {/* Smoke effect */}
        {showSmoke && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-600/20 to-transparent"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        )}
      </div>
      
      {/* Headline Ticker */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-black/80 border-b border-yellow-600/50 overflow-hidden z-50">
        <AnimatePresence>
          {headlines.map((headline, i) => (
            <NewsHeadline key={`${headline}-${i}`} headline={headline} />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Header */}
      <div className="relative z-30 bg-gradient-to-b from-black to-transparent p-4 pt-16 border-b border-yellow-600/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black tracking-wider"
              style={{
                textShadow: '3px 3px 0 #FFD700, -2px -2px 0 #000',
                fontFamily: 'Impact, sans-serif'
              }}
            >
              PANELTOWN EXCHANGE
            </h1>
            <Badge 
              variant="outline"
              className={cn(
                "border-2",
                isConnected ? "border-green-400 text-green-400" : "border-red-400 text-red-400"
              )}
            >
              {isConnected ? '📡 WIRE TAP ACTIVE' : '📵 OFFLINE'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowRain(!showRain)}
              className="text-gray-400 hover:text-white"
              data-testid="toggle-rain"
            >
              ☔
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowSmoke(!showSmoke)}
              className="text-gray-400 hover:text-white"
              data-testid="toggle-smoke"
            >
              <Cigarette className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* House selector */}
        <div className="flex gap-2 flex-wrap">
          {SEVEN_HOUSES.map(house => (
            <Button
              key={house.id}
              variant={selectedHouse.id === house.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedHouse(house)}
              className="transition-all"
              style={{
                borderColor: house.color,
                color: selectedHouse.id === house.id ? '#000' : house.color,
                backgroundColor: selectedHouse.id === house.id ? house.color : 'transparent',
              }}
              data-testid={`house-${house.id}`}
            >
              <house.icon className="h-4 w-4 mr-1" />
              {house.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Main Layout - Comic Panels */}
      <div className="flex h-[calc(100vh-180px)] relative z-20">
        {/* Left Panel - Case Files */}
        <div className="w-96 border-r-4 border-yellow-600/30 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
          <div className="p-4 bg-black/50 border-b border-yellow-600/30">
            <h2 className="text-lg font-bold text-yellow-400 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              CASE FILES
            </h2>
            <p className="text-xs text-gray-400 mt-1">{selectedHouse.territory}</p>
          </div>
          
          <ScrollArea className="h-[calc(100%-80px)]">
            <div className="p-4 space-y-3">
              {assetsLoading ? (
                [...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full bg-gray-800" />
                ))
              ) : (
                assets.map(asset => (
                  <CaseFile
                    key={asset.id}
                    asset={asset}
                    isSelected={selectedAsset?.id === asset.id}
                    onSelect={handleAssetSelect}
                    realTimePrice={getRealTimePrice(asset.id)}
                    house={selectedHouse}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Center Panel - Crime Scene Chart */}
        <div className="flex-1 flex flex-col">
          {selectedAsset ? (
            <>
              <div className="flex-1 p-4">
                <CrimeSceneChart 
                  chartData={chartData} 
                  selectedAsset={selectedAsset}
                  house={selectedHouse}
                />
              </div>
              
              {/* Bottom Panel - Briefcase Exchange */}
              <BriefcaseExchange
                selectedAsset={selectedAsset}
                orderType={orderType}
                setOrderType={setOrderType}
                orderQuantity={orderQuantity}
                setOrderQuantity={setOrderQuantity}
                orderPrice={orderPrice}
                setOrderPrice={setOrderPrice}
                onSubmit={handleOrderSubmit}
                house={selectedHouse}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">SELECT A CASE TO INVESTIGATE</p>
                <p className="text-gray-600 text-sm mt-2">Choose from the files on the left</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Panel - Alley Order Book */}
        <div className="w-80 border-l-4 border-yellow-600/30">
          <AlleyOrderBook 
            orderBook={selectedAsset ? getOrderBook(selectedAsset.id) : null}
            house={selectedHouse}
          />
        </div>
      </div>
      
      {/* CSS for rain animation */}
      <style jsx>{`
        @keyframes rain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}