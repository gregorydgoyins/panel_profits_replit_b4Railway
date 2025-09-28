import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Swords, Shield, Zap, TrendingUp, TrendingDown, 
  Target, Activity, AlertTriangle, Clock, Users,
  Flame, Crown, Star, BarChart3
} from 'lucide-react';
import { useHouseTheme } from '@/hooks/useHouseTheme';

interface BattleOutcome {
  id: string;
  character1Name: string;
  character2Name?: string;
  winner: string;
  battleType: string;
  outcome: number;
  marketImpactPercent: number;
  fanEngagement: number;
  mediaAttention: number;
  environment: string;
  decisiveness: string;
  eventDate: string;
  duration?: number;
}

interface PowerShift {
  characterId: string;
  characterName: string;
  universe: string;
  oldPowerLevel: number;
  newPowerLevel: number;
  changePercent: number;
  reason: string;
  timestamp: string;
  marketImpact: number;
}

interface CombatAnalytics {
  topPerformers: Array<{
    name: string;
    universe: string;
    winRate: number;
    totalBattles: number;
    recentForm: number[];
    marketInfluence: number;
  }>;
  emergingThreats: Array<{
    name: string;
    universe: string;
    recentWins: number;
    powerTrend: 'rising' | 'falling' | 'stable';
    threatLevel: number;
  }>;
  battleHotspots: Array<{
    environment: string;
    battleCount: number;
    averageImpact: number;
    volatility: number;
  }>;
}

export function BattleDrivenIntelligence() {
  const { houseTheme, getCurrentHouseColorClass } = useHouseTheme();
  const [selectedBattle, setSelectedBattle] = useState<BattleOutcome | null>(null);
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  // Fetch recent battle outcomes
  const { data: battlesResponse, isLoading: battlesLoading, error: battlesError } = useQuery({
    queryKey: ['/api/battle-intelligence', timeframe],
    queryFn: async () => {
      const res = await fetch(`/api/battle-intelligence?timeframe=${timeframe}&limit=20`);
      if (!res.ok) throw new Error('Failed to fetch battle outcomes');
      return res.json();
    },
    refetchInterval: 15000,
    retry: 3,
  });

  const recentBattles = battlesResponse?.success ? battlesResponse.data : [];

  // Fetch power level shifts
  const { data: shiftsResponse, isLoading: shiftsLoading, error: shiftsError } = useQuery({
    queryKey: ['/api/power-shifts', timeframe],
    queryFn: async () => {
      const res = await fetch(`/api/power-shifts?timeframe=${timeframe}&limit=15`);
      if (!res.ok) throw new Error('Failed to fetch power shifts');
      return res.json();
    },
    refetchInterval: 30000,
    retry: 3,
  });

  const powerShifts = shiftsResponse?.success ? shiftsResponse.data : [];

  // Fetch combat analytics
  const { data: analyticsResponse, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: ['/api/combat-analytics'],
    queryFn: async () => {
      const res = await fetch('/api/combat-analytics/summary');
      if (!res.ok) throw new Error('Failed to fetch combat analytics');
      return res.json();
    },
    refetchInterval: 60000,
    retry: 3,
  });

  const analytics = analyticsResponse?.success ? analyticsResponse.data : null;

  const getImpactColor = (impact: number) => {
    if (impact >= 5) return 'text-red-400 border-red-500/30 bg-red-900/20';
    if (impact >= 3) return 'text-orange-400 border-orange-500/30 bg-orange-900/20';
    if (impact >= 1) return 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20';
    return 'text-green-400 border-green-500/30 bg-green-900/20';
  };

  const getBattleTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'one_vs_one': return <Swords className="h-4 w-4" />;
      case 'team': return <Users className="h-4 w-4" />;
      case 'tournament': return <Crown className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const battleTime = new Date(timestamp);
    const diff = Math.floor((now.getTime() - battleTime.getTime()) / (1000 * 60));
    
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <div className="space-y-6" data-testid="battle-driven-intelligence">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Flame className="h-6 w-6 text-red-400" />
            Battle Intelligence Center
          </h2>
          <p className="text-slate-400 mt-1">
            Combat outcomes driving market forces • {recentBattles?.length || 0} active conflicts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={timeframe} onValueChange={(v: any) => setTimeframe(v)}>
            <TabsList className="bg-slate-800">
              <TabsTrigger value="1h">1H</TabsTrigger>
              <TabsTrigger value="24h">24H</TabsTrigger>
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Battle Outcomes */}
        <Card className="lg:col-span-2 bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-400" />
              Live Battle Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            {battlesLoading ? (
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-slate-700 h-20 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentBattles?.map((battle: BattleOutcome) => (
                  <div 
                    key={battle.id}
                    className="p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer hover-elevate"
                    onClick={() => setSelectedBattle(battle)}
                    data-testid={`battle-outcome-${battle.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          {getBattleTypeIcon(battle.battleType)}
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getImpactColor(battle.marketImpactPercent)}`}
                          >
                            {battle.marketImpactPercent.toFixed(1)}% Impact
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white">
                              {battle.character1Name}
                            </span>
                            <Swords className="h-3 w-3 text-slate-400" />
                            <span className="font-semibold text-white">
                              {battle.character2Name || 'Multiple Opponents'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-green-400 font-medium">
                              Winner: {battle.winner}
                            </span>
                            <span className="text-slate-400">
                              {battle.environment}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {battle.decisiveness}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(battle.eventDate)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-orange-400">
                            {battle.fanEngagement} fans
                          </span>
                          <span className="text-xs text-blue-400">
                            {battle.mediaAttention.toFixed(1)}x media
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Power Shifts Panel */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Power Fluctuations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shiftsLoading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-slate-700 h-16 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {powerShifts?.map((shift: PowerShift, index: number) => (
                  <div 
                    key={shift.characterId}
                    className="p-3 rounded-lg bg-slate-700/30"
                    data-testid={`power-shift-${shift.characterId}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white text-sm">
                        {shift.characterName}
                      </h4>
                      <div className="flex items-center gap-1">
                        {shift.changePercent > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        )}
                        <span 
                          className={`text-sm font-bold ${
                            shift.changePercent > 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {shift.changePercent > 0 ? '+' : ''}{shift.changePercent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Power Level</span>
                        <span className="text-white">
                          {shift.oldPowerLevel.toFixed(1)} → {shift.newPowerLevel.toFixed(1)}
                        </span>
                      </div>
                      <Progress 
                        value={shift.newPowerLevel * 10} 
                        className="h-2"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        {shift.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Combat Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Performers */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Crown className="h-4 w-4 text-yellow-400" />
              Elite Champions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="animate-pulse space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-slate-700 h-10 rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {analytics?.topPerformers?.slice(0, 5).map((performer: any, index: number) => (
                  <div key={performer.name} className="flex items-center gap-3">
                    <span className="text-slate-400 font-bold w-4">
                      #{index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">
                        {performer.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {(performer.winRate * 100).toFixed(1)}% win rate
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {performer.totalBattles}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emerging Threats */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              Rising Threats
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="animate-pulse space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-slate-700 h-10 rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {analytics?.emergingThreats?.slice(0, 5).map((threat: any, index: number) => (
                  <div key={threat.name} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">
                        {threat.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {threat.recentWins} recent victories
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-orange-400">
                        Threat: {threat.threatLevel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Battle Hotspots */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-red-400" />
              Battle Hotspots
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="animate-pulse space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-slate-700 h-10 rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {analytics?.battleHotspots?.slice(0, 5).map((hotspot: any, index: number) => (
                  <div key={hotspot.environment} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-sm">
                        {hotspot.environment}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {hotspot.battleCount}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">
                        Avg Impact: {hotspot.averageImpact.toFixed(1)}%
                      </span>
                      <span className="text-orange-400">
                        Volatility: {hotspot.volatility.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}