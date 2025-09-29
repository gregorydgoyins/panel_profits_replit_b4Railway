import { useState, useEffect } from 'react';
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, Shield, Crown, Sparkles, Target, Eye,
  Flame, Users, Star, BookOpen, Globe, Gem, Scroll, Swords
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type HouseType = 'heroes' | 'wisdom' | 'power' | 'mystery' | 'elements' | 'time' | 'spirit';

interface MythicalPortfolioData {
  id: string;
  totalPower: number; // Total Value -> Total Power
  dailyAscension: number; // Day Change -> Daily Ascension
  dailyAscensionPercent: number;
  eternalReturn: number; // Total Return -> Eternal Return
  eternalReturnPercent: number;
  cosmicBalance: number; // Diversification -> Cosmic Balance
  sacredTreasury: number; // Cash Balance -> Sacred Treasury
  artifactCount: number; // Total Holdings -> Sacred Artifacts
  chaosRisk: number; // Risk Score -> Chaos Risk
  karmaLevel: number; // New: User's karma/experience level
  houseAlignment?: HouseType; // House affiliation
  divineBlessings: number; // House bonuses and buffs
}

interface SacredAllocation {
  realmType: string; // Asset Type -> Realm Type
  power: number; // Value -> Power
  percentage: number;
  houseColor: string;
  mysticalIcon: any;
}

interface MythicalPortfolioSanctuaryProps {
  selectedHouse?: HouseType;
}

export function MythicalPortfolioSanctuary({ selectedHouse = 'heroes' }: MythicalPortfolioSanctuaryProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mysticalEnergy, setMysticalEnergy] = useState(0);
  const [isAscending, setIsAscending] = useState(false);
  
  // Mystical energy animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMysticalEnergy(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Fetch user portfolios
  const { data: userPortfolios, isLoading: portfoliosLoading, refetch } = useQuery({
    queryKey: ['/api/portfolios', 'user', user?.id],
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Get the default/first portfolio
  const defaultPortfolio = userPortfolios?.[0];

  // Fetch portfolio holdings
  const { data: holdings, isLoading: holdingsLoading } = useQuery({
    queryKey: ['/api/portfolios', defaultPortfolio?.id, 'holdings'],
    enabled: !!defaultPortfolio?.id,
    refetchInterval: 30000,
  });

  // Transform portfolio metrics into mystical data
  const mysticalData = React.useMemo((): MythicalPortfolioData => {
    if (!defaultPortfolio || !holdings) {
      return {
        id: 'sanctum-loading',
        totalPower: 0,
        dailyAscension: 0,
        dailyAscensionPercent: 0,
        eternalReturn: 0,
        eternalReturnPercent: 0,
        cosmicBalance: 0,
        sacredTreasury: user?.virtualTradingBalance ? parseFloat(user.virtualTradingBalance) : 100000,
        artifactCount: 0,
        chaosRisk: 0,
        karmaLevel: 1,
        houseAlignment: selectedHouse,
        divineBlessings: 0
      };
    }

    const totalPower = holdings.reduce((sum: number, holding: any) => sum + parseFloat(holding.currentValue || '0'), 0);
    const totalCost = holdings.reduce((sum: number, holding: any) => sum + parseFloat(holding.totalCost || '0'), 0);
    const eternalReturn = totalPower - totalCost;
    const eternalReturnPercent = totalCost > 0 ? (eternalReturn / totalCost) * 100 : 0;
    
    const dailyAscension = holdings.reduce((sum: number, holding: any) => {
      const dayChangeValue = parseFloat(holding.dayChange || '0') * parseFloat(holding.quantity || '0');
      return sum + dayChangeValue;
    }, 0);
    const dailyAscensionPercent = totalPower > 0 ? (dailyAscension / (totalPower - dailyAscension)) * 100 : 0;

    // Calculate mystical metrics
    const realmTypes = new Set(holdings.map((h: any) => h.assetType || 'unknown'));
    const cosmicBalance = Math.min(realmTypes.size * 2, 10);
    const chaosRisk = Math.min(Math.abs(eternalReturnPercent) / 10 + 2, 10);
    
    // Calculate karma level based on portfolio performance and activity
    const karmaLevel = Math.max(1, Math.floor((totalPower / 10000) + (holdings.length / 2) + (Math.max(0, eternalReturnPercent) / 5)));
    
    // Calculate divine blessings (house bonuses)
    const divineBlessings = karmaLevel * 0.1 + (cosmicBalance / 10);

    return {
      id: defaultPortfolio.id,
      totalPower,
      dailyAscension,
      dailyAscensionPercent,
      eternalReturn,
      eternalReturnPercent,
      cosmicBalance,
      sacredTreasury: user?.virtualTradingBalance ? parseFloat(user.virtualTradingBalance) : 100000,
      artifactCount: holdings.length,
      chaosRisk,
      karmaLevel,
      houseAlignment: selectedHouse,
      divineBlessings
    };
  }, [defaultPortfolio, holdings, user, selectedHouse]);

  // Calculate sacred realm allocations
  const sacredAllocations = React.useMemo((): SacredAllocation[] => {
    if (!holdings || holdings.length === 0) return [];

    const totalPower = mysticalData.totalPower;
    if (totalPower === 0) return [];

    const realmMap: { [key: string]: { power: number; houseColor: string; icon: any } } = {
      'character': { power: 0, houseColor: 'from-blue-500 to-cyan-400', icon: Shield },
      'comic': { power: 0, houseColor: 'from-green-500 to-emerald-400', icon: BookOpen },
      'creator': { power: 0, houseColor: 'from-purple-500 to-violet-400', icon: Crown },
      'publisher': { power: 0, houseColor: 'from-orange-500 to-amber-400', icon: Scroll }
    };

    holdings.forEach((holding: any) => {
      const realmType = holding.assetType || 'unknown';
      const power = parseFloat(holding.currentValue || '0');
      if (realmMap[realmType]) {
        realmMap[realmType].power += power;
      }
    });

    return Object.entries(realmMap)
      .filter(([_, data]) => data.power > 0)
      .map(([type, data]) => ({
        realmType: `${type.charAt(0).toUpperCase() + type.slice(1)} Realm`,
        power: data.power,
        percentage: (data.power / totalPower) * 100,
        houseColor: data.houseColor,
        mysticalIcon: data.icon
      }));
  }, [holdings, mysticalData.totalPower]);

  const isLoading = portfoliosLoading || holdingsLoading;

  const formatPower = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAscensionColor = (change: number) => {
    if (change > 0) return 'text-emerald-400';
    if (change < 0) return 'text-red-400';
    return 'text-amber-400';
  };

  const getAscensionIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Gem className="w-4 h-4" />;
  };

  const getChaosLabel = (score: number) => {
    if (score >= 7) return { label: 'Chaotic Storms', color: 'text-red-400' };
    if (score >= 4) return { label: 'Moderate Flux', color: 'text-amber-400' };
    return { label: 'Serene Harmony', color: 'text-emerald-400' };
  };

  const getCosmicLabel = (score: number) => {
    if (score >= 8) return { label: 'Cosmic Mastery', color: 'text-purple-400' };
    if (score >= 6) return { label: 'Divine Balance', color: 'text-blue-400' };
    if (score >= 4) return { label: 'Sacred Order', color: 'text-amber-400' };
    return { label: 'Earthly Bonds', color: 'text-slate-400' };
  };

  const getKarmaRank = (level: number) => {
    if (level >= 50) return { title: 'Ascended Master', color: 'legendary-text', icon: Crown };
    if (level >= 25) return { title: 'Divine Sage', color: 'epic-text', icon: Star };
    if (level >= 10) return { title: 'Sacred Warrior', color: 'rare-text', icon: Swords };
    return { title: 'Novice Seeker', color: 'text-white', icon: Shield };
  };

  const getHouseIcon = (house: HouseType) => {
    switch (house) {
      case 'heroes': return Shield;
      case 'wisdom': return Eye;
      case 'power': return Crown;
      case 'mystery': return Gem;
      case 'elements': return Flame;
      case 'time': return Globe;
      case 'spirit': return Users;
      default: return Star;
    }
  };

  const handleSanctuaryOptimization = () => {
    setIsAscending(true);
    toast({
      title: "Sacred Optimization Initiated",
      description: "The mystical algorithms are harmonizing your portfolio's cosmic energies...",
    });
    setTimeout(() => setIsAscending(false), 3000);
  };

  const karmaRank = getKarmaRank(mysticalData.karmaLevel);
  const HouseIcon = getHouseIcon(mysticalData.houseAlignment || 'heroes');

  return (
    <div className="sacred-particles relative">
      <Card className={`
        transition-arcane hover-elevate border-2
        ${mysticalData.houseAlignment ? `house-aura-${mysticalData.houseAlignment}` : ''}
        ${isAscending ? 'sacred-glow-divine scale-102' : ''}
      `} data-testid="mythical-portfolio-sanctuary">
        
        <CardHeader className="relative">
          {/* Sacred Energy Waves */}
          <div className="absolute top-0 left-0 w-full h-1 overflow-hidden">
            <div 
              className="h-full w-full bg-gradient-to-r from-transparent via-purple-400/60 to-transparent transition-divine"
              style={{ 
                transform: `translateX(${Math.sin(mysticalEnergy * 0.05) * 200}px)`,
                opacity: isAscending ? 0.8 : 0.3
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Gem className={`h-8 w-8 text-purple-400 transition-mystical ${isAscending ? 'sacred-glow-intense scale-125' : 'mystical-pulse'}`} />
                <HouseIcon className="absolute -bottom-1 -right-1 w-4 h-4 text-amber-400 mystical-pulse" />
              </div>
              <div>
                <CardTitle className="text-2xl font-display font-bold legendary-text flex items-center space-x-2">
                  <span>Sacred Portfolio Sanctuary</span>
                  <Badge className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-400 
                                   border-cyan-500/30 mystical-pulse">
                    Divine Sight
                  </Badge>
                </CardTitle>
                <div className="flex items-center space-x-3 mt-1">
                  <Badge className={`${karmaRank.color} border-amber-500/30`}>
                    {React.createElement(karmaRank.icon, { className: 'w-3 h-3 mr-1' })}
                    {karmaRank.title}
                  </Badge>
                  <span className="text-sm text-slate-400">Karma Level {mysticalData.karmaLevel}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSanctuaryOptimization}
                disabled={isAscending}
                className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/50 hover:border-purple-400/70"
                data-testid="button-optimize-sanctuary"
              >
                <Target className="w-4 h-4 mr-2" />
                Harmonize Energies
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => refetch()}
                disabled={isLoading}
                className="hover:bg-purple-500/10"
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="mystical-pulse rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div>
              {/* Sacred Power Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="sanctuary-power-metrics">
                <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span className="text-sm text-slate-400">Total Power</span>
                  </div>
                  <p className="text-2xl font-bold font-trading legendary-text" data-testid="text-total-power">
                    {formatPower(mysticalData.totalPower)}
                  </p>
                  <div className={`flex items-center gap-2 text-sm ${getAscensionColor(mysticalData.dailyAscension)}`}>
                    {getAscensionIcon(mysticalData.dailyAscension)}
                    <span data-testid="text-daily-ascension">
                      {mysticalData.dailyAscension >= 0 ? '+' : ''}{formatPower(mysticalData.dailyAscension)} 
                      ({mysticalData.dailyAscensionPercent >= 0 ? '+' : ''}{mysticalData.dailyAscensionPercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Scroll className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm text-slate-400">Eternal Return</span>
                  </div>
                  <p className="text-xl font-bold font-trading" data-testid="text-eternal-return">
                    {formatPower(mysticalData.eternalReturn)}
                  </p>
                  <div className={`flex items-center gap-1 text-sm ${getAscensionColor(mysticalData.eternalReturn)}`}>
                    <span data-testid="text-eternal-return-percent">
                      {mysticalData.eternalReturnPercent >= 0 ? '+' : ''}{mysticalData.eternalReturnPercent.toFixed(2)}%
                    </span>
                    <span className="text-slate-400">Sacred Gains</span>
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Gem className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm text-slate-400">Sacred Artifacts</span>
                  </div>
                  <p className="text-xl font-bold font-trading" data-testid="text-artifact-count">
                    {mysticalData.artifactCount} Relics
                  </p>
                  <div className="text-sm text-slate-400">
                    <span data-testid="text-sacred-treasury">
                      {formatPower(mysticalData.sacredTreasury)} Treasury
                    </span>
                  </div>
                </div>
              </div>

              {/* Karma and Divine Blessings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="sanctuary-divine-metrics">
                <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border border-amber-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-400">Karma Ascension</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-amber-300">Level {mysticalData.karmaLevel}</span>
                      <Sparkles className="w-4 h-4 text-amber-400 mystical-pulse" />
                    </div>
                  </div>
                  <div className="w-full bg-amber-900/50 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-3 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full karma-fill transition-all duration-700"
                      style={{ width: `${((mysticalData.karmaLevel % 10) / 10) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-amber-300">
                    Next Ascension: {Math.ceil(mysticalData.karmaLevel / 10) * 10}
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-400">Divine Blessings</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-purple-300">+{(mysticalData.divineBlessings * 100).toFixed(1)}%</span>
                      <Star className="w-4 h-4 text-purple-400 mystical-pulse" />
                    </div>
                  </div>
                  <div className="w-full bg-purple-900/50 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-3 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-700 mystical-pulse"
                      style={{ width: `${Math.min(mysticalData.divineBlessings * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-purple-300">
                    House {mysticalData.houseAlignment} Benediction
                  </div>
                </div>
              </div>

              {/* Cosmic Balance and Chaos Risk */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="sanctuary-cosmic-metrics">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cosmic Balance</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${getCosmicLabel(mysticalData.cosmicBalance).color}`}>
                        {getCosmicLabel(mysticalData.cosmicBalance).label}
                      </span>
                      <span className="text-sm font-medium" data-testid="text-cosmic-balance">
                        {mysticalData.cosmicBalance.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-3 rounded-full transition-all duration-700 bg-gradient-to-r from-blue-500 to-purple-400 mystical-pulse"
                      style={{ width: `${mysticalData.cosmicBalance * 10}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Chaos Risk</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${getChaosLabel(mysticalData.chaosRisk).color}`}>
                        {getChaosLabel(mysticalData.chaosRisk).label}
                      </span>
                      <span className="text-sm font-medium" data-testid="text-chaos-risk">
                        {mysticalData.chaosRisk.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-3 rounded-full transition-all duration-700 bg-gradient-to-r from-red-500 to-orange-400"
                      style={{ width: `${mysticalData.chaosRisk * 10}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Sacred Realm Allocation */}
              <div className="space-y-4" data-testid="sanctuary-realm-allocation">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Sacred Realm Distribution</span>
                  </h4>
                  <Button variant="ghost" size="sm" className="hover:bg-cyan-500/10">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {sacredAllocations.map((allocation, index) => {
                    const IconComponent = allocation.mysticalIcon;
                    return (
                      <div key={allocation.realmType} className="space-y-2 group" 
                           data-testid={`allocation-${allocation.realmType.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${allocation.houseColor} bg-opacity-20 transition-mystical group-hover:scale-110`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-white">{allocation.realmType}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-white">{formatPower(allocation.power)}</span>
                            <span className="text-slate-400">{allocation.percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${allocation.houseColor} transition-all duration-700 mystical-pulse`}
                            style={{ width: `${allocation.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sacred Insights */}
              <div className="border-t border-slate-700/50 pt-4">
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg border border-slate-700/50" 
                     data-testid="sanctuary-insights">
                  <Eye className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0 mystical-pulse" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white">Sacred Oracle Insights</p>
                    <ul className="text-sm text-slate-400 space-y-1">
                      <li>• Your portfolio radiates Level {mysticalData.karmaLevel} mystical energy</li>
                      <li>• Divine blessings enhance your power by {(mysticalData.divineBlessings * 100).toFixed(1)}%</li>
                      <li>• {getChaosLabel(mysticalData.chaosRisk).label.toLowerCase()} guides your sacred journey</li>
                      <li>• House {mysticalData.houseAlignment} provides cosmic protection</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MythicalPortfolioSanctuary;