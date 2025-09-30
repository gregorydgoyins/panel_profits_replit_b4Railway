import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useCorruption } from '@/hooks/useCorruption';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { 
  Skull, Eye, Ghost, Heart, Zap, TrendingDown, TrendingUp,
  AlertTriangle, Activity, DollarSign, Flame, Power,
  Target, Shield, Swords
} from 'lucide-react';
import { cn } from '@/lib/utils';
import './shadow-market.css';

interface ShadowPrice {
  assetId: string;
  realPrice: number;
  shadowPrice: number;
  divergence: number;
  corruptionRequired: number;
  arbitrageOpportunity: number;
}

interface DarkPool {
  assetId: string;
  shadowLiquidity: number;
  hiddenOrders: number;
  averageSpread: number;
  bloodInWater: boolean;
}

interface ShadowOrderType {
  type: 'predatory' | 'vampire' | 'ghost';
  name: string;
  description: string;
  corruptionCost: number;
  profitMultiplier: number;
}

export default function ShadowMarket() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { corruption, soulWeight, corruptionClass } = useCorruption();
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedOrderType, setSelectedOrderType] = useState<'predatory' | 'vampire' | 'ghost'>('ghost');
  const [quantity, setQuantity] = useState(1);
  const [glitchIntensity, setGlitchIntensity] = useState(1);
  const glitchRef = useRef<NodeJS.Timeout | null>(null);
  const [bloodParticles, setBloodParticles] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [digitalWhispers, setDigitalWhispers] = useState<string[]>([]);

  // Check corruption level - redirect if too pure
  useEffect(() => {
    if (corruption < 30) {
      toast({
        title: "Soul Too Pure",
        description: "Your corruption is insufficient. The shadows reject you.",
        variant: "destructive"
      });
      setLocation('/trading');
    }
  }, [corruption, setLocation, toast]);

  // Glitch effect based on corruption
  useEffect(() => {
    const intensity = Math.min(3, 1 + (corruption - 30) / 35);
    setGlitchIntensity(intensity);
    
    // Random glitch intervals
    const startGlitch = () => {
      glitchRef.current = setInterval(() => {
        document.documentElement.style.setProperty('--glitch-intensity', `${Math.random() * intensity}`);
        setTimeout(() => {
          document.documentElement.style.setProperty('--glitch-intensity', '0');
        }, 100 + Math.random() * 200);
      }, 2000 + Math.random() * 3000);
    };
    
    startGlitch();
    
    return () => {
      if (glitchRef.current) clearInterval(glitchRef.current);
    };
  }, [corruption]);

  // Digital whispers effect
  useEffect(() => {
    const whispers = [
      "profit from their pain...",
      "the market bleeds for you...",
      "souls are currency here...",
      "darkness brings opportunity...",
      "feed on their losses...",
      "embrace the void...",
      "morality is weakness...",
      "power through suffering..."
    ];

    const whisperInterval = setInterval(() => {
      const randomWhisper = whispers[Math.floor(Math.random() * whispers.length)];
      setDigitalWhispers(prev => [...prev.slice(-4), randomWhisper]);
    }, 5000 + Math.random() * 10000);

    return () => clearInterval(whisperInterval);
  }, []);

  // Blood particle effect for "blood in the water"
  useEffect(() => {
    const particleInterval = setInterval(() => {
      if (Math.random() > 0.7 && corruption > 50) {
        const newParticle = {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          id: Date.now()
        };
        setBloodParticles(prev => [...prev.slice(-20), newParticle]);
        
        // Remove particle after animation
        setTimeout(() => {
          setBloodParticles(prev => prev.filter(p => p.id !== newParticle.id));
        }, 3000);
      }
    }, 1000);

    return () => clearInterval(particleInterval);
  }, [corruption]);

  // Fetch shadow prices
  const { data: shadowPrices, isLoading: pricesLoading } = useQuery({
    queryKey: ['/api/shadow/prices', selectedAsset],
    queryFn: async () => {
      const params = selectedAsset ? `?assetIds=${selectedAsset}` : '?assetIds=all';
      return apiRequest(`/api/shadow/prices${params}`, { method: 'GET' });
    },
    enabled: corruption >= 30,
    refetchInterval: 10000 // Update every 10 seconds
  });

  // Fetch available order types
  const { data: orderTypes, isLoading: orderTypesLoading } = useQuery({
    queryKey: ['/api/shadow/order-types'],
    enabled: corruption >= 30
  });

  // Fetch dark pools
  const { data: darkPools, isLoading: poolsLoading } = useQuery({
    queryKey: ['/api/shadow/pools', selectedAsset],
    queryFn: async () => {
      if (!selectedAsset) return null;
      return apiRequest(`/api/shadow/pools/${selectedAsset}`, { method: 'GET' });
    },
    enabled: corruption >= 30 && !!selectedAsset
  });

  // Fetch arbitrage opportunities
  const { data: arbitrage, isLoading: arbitrageLoading } = useQuery({
    queryKey: ['/api/shadow/arbitrage'],
    enabled: corruption >= 30
  });

  // Execute shadow trade mutation
  const executeTradeMutation = useMutation({
    mutationFn: async (tradeData: any) => {
      return apiRequest('/api/shadow/trade', { 
        method: 'POST',
        body: JSON.stringify(tradeData)
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Shadow Trade Executed",
        description: data.message,
        className: "bg-black text-red-500 border-red-900"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/shadow'] });
    },
    onError: (error: any) => {
      toast({
        title: "Trade Failed",
        description: error.message || "The shadows rejected your offering",
        variant: "destructive"
      });
    }
  });

  const handleShadowTrade = (side: 'buy' | 'sell') => {
    if (!selectedAsset) return;
    
    executeTradeMutation.mutate({
      assetId: selectedAsset,
      quantity,
      side,
      orderType: selectedOrderType
    });
  };

  return (
    <div className={cn(
      "min-h-screen p-6 relative overflow-hidden",
      "shadow-market-container",
      `corruption-${Math.floor(corruption / 20) * 20}`
    )} data-testid="shadow-market-page">
      {/* Background corruption effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glitch overlay */}
        <div className="glitch-overlay" />
        
        {/* Blood particles */}
        {bloodParticles.map(particle => (
          <div
            key={particle.id}
            className="blood-particle"
            style={{
              left: particle.x,
              top: particle.y,
              animation: 'bloodDrip 3s ease-in forwards'
            }}
          />
        ))}
        
        {/* Digital whispers */}
        <div className="digital-whispers">
          {digitalWhispers.map((whisper, idx) => (
            <div
              key={`${whisper}-${idx}`}
              className="whisper-text"
              style={{
                opacity: 0.3 - idx * 0.05,
                animationDelay: `${idx * 0.5}s`
              }}
            >
              {whisper}
            </div>
          ))}
        </div>
      </div>

      {/* Header with corruption indicator */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skull className="w-10 h-10 text-red-600 animate-pulse" />
            <div>
              <h1 className="text-4xl font-bold text-red-500 glitch-text">
                SHADOW MARKET
              </h1>
              <p className="text-gray-400">Where morality dies for profit</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold text-orange-500">
                {corruption}% CORRUPT
              </span>
            </div>
            <Badge variant="destructive" className="glitch-badge">
              {corruptionClass}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shadow Prices Panel */}
        <div className="lg:col-span-2">
          <Card className="bg-black/80 border-red-900 shadow-corrupt">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Eye className="w-5 h-5" />
                Shadow Prices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="prices">
                <TabsList className="bg-gray-900 border-red-900">
                  <TabsTrigger value="prices">Price Divergence</TabsTrigger>
                  <TabsTrigger value="arbitrage">Arbitrage</TabsTrigger>
                  <TabsTrigger value="pools">Dark Pools</TabsTrigger>
                </TabsList>
                
                <TabsContent value="prices" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    {pricesLoading ? (
                      <div className="text-center text-gray-500">Loading shadow data...</div>
                    ) : (
                      <div className="space-y-4">
                        {shadowPrices?.prices?.map((price: ShadowPrice) => (
                          <div 
                            key={price.assetId}
                            className="p-4 bg-gray-900/50 rounded border border-red-900/30 hover:border-red-600 transition-all cursor-pointer"
                            onClick={() => setSelectedAsset(price.assetId)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-sm text-gray-400">Asset {price.assetId.slice(0, 8)}</div>
                                <div className="flex gap-4 mt-2">
                                  <div>
                                    <span className="text-xs text-gray-500">Real:</span>
                                    <span className="ml-2 text-white">${price.realPrice.toFixed(2)}</span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-500">Shadow:</span>
                                    <span className="ml-2 text-red-400 glitch-number">
                                      ${price.shadowPrice.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-green-400">
                                  {price.divergence.toFixed(1)}%
                                </div>
                                <div className="text-xs text-gray-500">profit potential</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="arbitrage" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    {arbitrageLoading ? (
                      <div className="text-center text-gray-500">Scanning for opportunities...</div>
                    ) : (
                      <div className="space-y-4">
                        {arbitrage?.opportunities?.map((opp: any) => (
                          <div 
                            key={opp.assetId}
                            className="p-4 bg-gradient-to-r from-green-900/20 to-red-900/20 rounded border border-green-600/30"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-bold text-green-400">{opp.symbol}</div>
                                <div className="text-sm text-gray-400 mt-1">
                                  Buy Shadow @ ${opp.shadowPrice.toFixed(2)} → Sell Real @ ${opp.realPrice.toFixed(2)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-400">
                                  +{opp.potentialProfit.toFixed(1)}%
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  className="mt-2"
                                  onClick={() => setSelectedAsset(opp.assetId)}
                                >
                                  Exploit
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="pools" className="mt-4">
                  {poolsLoading ? (
                    <div className="text-center text-gray-500">Accessing dark pools...</div>
                  ) : darkPools ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-900/20 rounded border border-purple-600/30">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-purple-400">Shadow Liquidity</span>
                          <span className="text-xl font-bold">${darkPools.metrics?.shadowLiquidity?.toFixed(0) || 0}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-purple-400">Hidden Orders</span>
                          <span className="text-xl font-bold">{darkPools.metrics?.hiddenOrders || 0}</span>
                        </div>
                        {darkPools.metrics?.bloodInTheWater && (
                          <div className="mt-4 p-3 bg-red-900/30 rounded border border-red-600">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                              <span className="text-red-400 font-bold">BLOOD IN THE WATER</span>
                            </div>
                            <p className="text-sm text-red-300 mt-1">Recent losses detected. Feeding frenzy active.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">Select an asset to view dark pools</div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Trading Panel */}
        <div>
          <Card className="bg-black/80 border-red-900 shadow-corrupt mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Swords className="w-5 h-5" />
                Execute Shadow Trade
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Order Type Selection */}
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block">Order Type</label>
                <div className="space-y-2">
                  {orderTypes?.orderTypes?.map((type: ShadowOrderType) => (
                    <button
                      key={type.type}
                      className={cn(
                        "w-full p-3 rounded border transition-all text-left",
                        selectedOrderType === type.type
                          ? "border-red-600 bg-red-900/20"
                          : "border-gray-700 hover:border-red-800"
                      )}
                      onClick={() => setSelectedOrderType(type.type)}
                      disabled={!orderTypes.orderTypes.find((o: any) => o.type === type.type)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-red-400">{type.name}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-orange-400">-{type.corruptionCost} soul</div>
                          <div className="text-sm text-green-400">×{type.profitMultiplier}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Slider */}
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block">
                  Quantity: {quantity}
                </label>
                <Slider
                  value={[quantity]}
                  onValueChange={(v) => setQuantity(v[0])}
                  min={1}
                  max={100}
                  step={1}
                  className="shadow-slider"
                />
              </div>

              {/* Trade Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="destructive"
                  className="bg-green-900 hover:bg-green-800 border-green-600"
                  onClick={() => handleShadowTrade('buy')}
                  disabled={!selectedAsset || executeTradeMutation.isPending}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Blood Buy
                </Button>
                <Button
                  variant="destructive"
                  className="bg-red-900 hover:bg-red-800 border-red-600"
                  onClick={() => handleShadowTrade('sell')}
                  disabled={!selectedAsset || executeTradeMutation.isPending}
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Soul Sell
                </Button>
              </div>

              {/* Warning */}
              <div className="mt-4 p-3 bg-orange-900/20 rounded border border-orange-600/30">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-orange-400">
                    Each shadow trade permanently corrupts your soul
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Soul Status */}
          <Card className="bg-black/80 border-purple-900 shadow-corrupt">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Ghost className="w-5 h-5" />
                Soul Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Corruption</span>
                  <span className="text-red-500 font-bold">{corruption}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Soul Weight</span>
                  <span className="text-blue-400">{soulWeight}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Classification</span>
                  <Badge variant="outline" className="border-purple-600 text-purple-400">
                    {corruptionClass}
                  </Badge>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden mt-4">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-purple-600 transition-all"
                    style={{ width: `${corruption}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}