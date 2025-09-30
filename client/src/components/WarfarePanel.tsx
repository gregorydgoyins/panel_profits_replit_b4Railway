import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Skull, TrendingDown, DollarSign, Eye, AlertTriangle, 
  Zap, Trophy, Swords, Ghost, Heart, Flame
} from 'lucide-react';

interface FallenTrader {
  shadow: {
    id: string;
    shadowName: string;
    userId: string;
    portfolioValue: string;
    corruptionLevel: string;
    status: string;
    fallenAt: string;
  };
  positions: Array<{
    id: string;
    symbol: string;
    quantity: string;
    entryValue: string;
    currentValue: string;
  }>;
  totalValue: number;
}

interface PowerRanking {
  userId: string;
  username: string;
  strength: number;
  portfolioValue: number;
  corruption: number;
  rank: number;
  tier: 'apex_predator' | 'hunter' | 'scavenger' | 'survivor' | 'prey';
}

interface CannibalismStats {
  tradersConsumed: number;
  positionsStolen: number;
  totalBloodMoney: number;
  totalCorruptionGained: number;
  successfulRaids: number;
  failedRaids: number;
  brutalityScore: number;
}

export function WarfarePanel() {
  const { toast } = useToast();
  const [selectedFallen, setSelectedFallen] = useState<FallenTrader | null>(null);
  const [isStealingPositions, setIsStealingPositions] = useState(false);

  // Fetch fallen traders
  const { data: fallenTraders = [], isLoading: loadingFallen } = useQuery<FallenTrader[]>({
    queryKey: ['/api/warfare/fallen'],
    refetchInterval: 30000,
  });

  // Fetch power rankings
  const { data: powerRankings = [], isLoading: loadingRankings } = useQuery<PowerRanking[]>({
    queryKey: ['/api/warfare/strength'],
    refetchInterval: 60000,
  });

  // Fetch cannibalism stats
  const { data: cannibalismStats, isLoading: loadingStats } = useQuery<CannibalismStats>({
    queryKey: ['/api/warfare/cannibalism-stats'],
    refetchInterval: 30000,
  });

  // Steal positions mutation
  const stealPositions = useMutation({
    mutationFn: async (fallenTraderId: string) => {
      return apiRequest('/api/warfare/steal', {
        method: 'POST',
        body: JSON.stringify({ fallenTraderId }),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Positions Consumed",
        description: `${data.message}. Corruption increased by ${data.corruptionGained}%`,
        className: "bg-red-950 border-red-900 text-red-100",
      });
      
      // Refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/warfare/fallen'] });
      queryClient.invalidateQueries({ queryKey: ['/api/warfare/cannibalism-stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      setSelectedFallen(null);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to steal positions",
        description: error.message || "The fallen trader's positions could not be consumed",
        variant: "destructive",
      });
    }
  });

  const handleStealPositions = async () => {
    if (!selectedFallen) return;
    
    setIsStealingPositions(true);
    await stealPositions.mutateAsync(selectedFallen.shadow.userId);
    setIsStealingPositions(false);
  };

  const getTierIcon = (tier: string) => {
    switch(tier) {
      case 'apex_predator': return <Skull className="w-4 h-4 text-red-500" />;
      case 'hunter': return <Swords className="w-4 h-4 text-orange-500" />;
      case 'scavenger': return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'survivor': return <Heart className="w-4 h-4 text-green-500" />;
      case 'prey': return <Ghost className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  return (
    <Card className="border-red-900/50 bg-black/90 backdrop-blur-sm">
      <CardHeader className="border-b border-red-900/30">
        <CardTitle className="flex items-center gap-2 text-red-400">
          <Skull className="w-5 h-5" />
          Social Warfare
        </CardTitle>
        
        {/* Cannibalism meter */}
        {cannibalismStats && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Flame className="w-3 h-3 text-orange-500" />
              <span>Cannibalism Level</span>
            </div>
            <div className="relative h-2 bg-gray-900 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-red-400"
                style={{ 
                  width: `${Math.min(100, cannibalismStats.tradersConsumed * 10)}%` 
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{cannibalismStats.tradersConsumed} consumed</span>
              <span>${(cannibalismStats.totalBloodMoney / 1000).toFixed(1)}k blood money</span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="fallen" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-red-950/30">
            <TabsTrigger value="fallen" className="data-[state=active]:bg-red-900/30">
              Fallen Traders
            </TabsTrigger>
            <TabsTrigger value="rankings" className="data-[state=active]:bg-red-900/30">
              Power Rankings
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-red-900/30">
              War History
            </TabsTrigger>
          </TabsList>

          {/* Fallen Traders Tab */}
          <TabsContent value="fallen" className="p-4">
            {loadingFallen ? (
              <div className="text-center py-8 text-gray-500">
                Searching for the fallen...
              </div>
            ) : fallenTraders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No traders have fallen... yet
              </div>
            ) : (
              <div className="space-y-3">
                {fallenTraders.map((fallen) => (
                  <div
                    key={fallen.shadow.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all",
                      "hover:bg-red-950/30",
                      selectedFallen?.shadow.id === fallen.shadow.id
                        ? "border-red-500 bg-red-950/50"
                        : "border-red-900/30"
                    )}
                    onClick={() => setSelectedFallen(fallen)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ghost className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-medium text-red-300">
                          {fallen.shadow.shadowName}
                        </span>
                      </div>
                      <Badge variant="outline" className="border-red-900 text-red-400">
                        {fallen.positions.length} positions
                      </Badge>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          ${(parseFloat(fallen.shadow.portfolioValue) / 1000).toFixed(1)}k lost
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-green-500" />
                          ${(fallen.totalValue / 1000).toFixed(1)}k stealable
                        </span>
                      </div>
                      
                      {selectedFallen?.shadow.id === fallen.shadow.id && (
                        <div className="mt-3 space-y-2">
                          <div className="text-xs font-semibold text-red-400">
                            Available Positions (50% discount):
                          </div>
                          {fallen.positions.map(pos => (
                            <div key={pos.id} className="flex justify-between text-xs">
                              <span className="text-gray-300">{pos.symbol}</span>
                              <span className="text-green-400">
                                ${(parseFloat(pos.currentValue) * 0.5 / 1000).toFixed(1)}k
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {selectedFallen && (
                  <div className="mt-4 p-4 border border-red-500 rounded-lg bg-red-950/50">
                    <div className="flex items-center gap-2 text-sm text-red-300 mb-3">
                      <AlertTriangle className="w-4 h-4" />
                      <span>
                        Consuming this trader will increase your corruption by 30%
                      </span>
                    </div>
                    
                    <Button
                      onClick={handleStealPositions}
                      disabled={isStealingPositions}
                      className="w-full bg-red-900 hover:bg-red-800 text-white"
                    >
                      {isStealingPositions ? (
                        "Consuming the fallen..."
                      ) : (
                        <>
                          <Skull className="w-4 h-4 mr-2" />
                          Consume the Fallen
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Power Rankings Tab */}
          <TabsContent value="rankings" className="p-4">
            {loadingRankings ? (
              <div className="text-center py-8 text-gray-500">
                Calculating power levels...
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {powerRankings.map((trader) => (
                    <div
                      key={trader.userId}
                      className={cn(
                        "p-3 rounded-lg border",
                        trader.rank <= 3 
                          ? "border-yellow-600/50 bg-yellow-950/20"
                          : "border-gray-800"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-gray-400">
                              #{trader.rank}
                            </span>
                            {getTierIcon(trader.tier)}
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {trader.username}
                            </div>
                            <div className="text-xs text-gray-500">
                              {trader.tier.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-semibold text-yellow-400">
                            {(trader.strength / 1000).toFixed(1)}k PWR
                          </div>
                          <div className="text-xs text-gray-500">
                            {trader.corruption.toFixed(0)}% corrupt
                          </div>
                        </div>
                      </div>
                      
                      {trader.rank === 1 && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-yellow-500">
                          <Trophy className="w-3 h-3" />
                          <span>Apex Predator - Most Dangerous Trader</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          {/* War History Tab */}
          <TabsContent value="history" className="p-4">
            {cannibalismStats && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-red-950/30 rounded-lg">
                    <div className="text-xs text-gray-500">Successful Raids</div>
                    <div className="text-xl font-bold text-green-400">
                      {cannibalismStats.successfulRaids}
                    </div>
                  </div>
                  <div className="p-3 bg-red-950/30 rounded-lg">
                    <div className="text-xs text-gray-500">Failed Attempts</div>
                    <div className="text-xl font-bold text-red-400">
                      {cannibalismStats.failedRaids}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-red-950/50 to-black rounded-lg">
                  <div className="text-sm font-semibold text-red-300 mb-2">
                    Brutality Score
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <div className="text-2xl font-bold text-yellow-400">
                      {cannibalismStats.brutalityScore.toFixed(0)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Based on violence and harm inflicted
                  </div>
                </div>
                
                <div className="text-xs text-center text-gray-600 italic">
                  "In this market, we feast on the fallen"
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}