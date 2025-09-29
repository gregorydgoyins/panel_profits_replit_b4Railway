import { useState, useEffect } from 'react';
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Gem, Crown, TrendingUp, Shield, Crystal, Target, Sparkles, 
  Clock, Scroll, Eye, Star, Flame, Globe, Wand2, Heart
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

type HouseType = 'heroes' | 'wisdom' | 'power' | 'mystery' | 'elements' | 'time' | 'spirit';

interface SacredVaultData {
  mysticBalance: number; // Virtual Balance -> Mystic Balance
  availablePower: number; // Available Cash -> Available Power
  investedEnergy: number; // Invested Amount -> Invested Energy
  dailyRitualLimit: number; // Daily Trading Limit -> Daily Ritual Limit
  dailyRitualUsed: number; // Daily Trading Used -> Daily Ritual Used
  maxChanneling: number; // Max Position Size -> Max Channeling
  totalRituals: number; // Total Trades -> Total Rituals
  triumphantRituals: number; // Winning Trades -> Triumphant Rituals
  failedRituals: number; // Losing Trades -> Failed Rituals
  averageTriumph: number; // Average Win -> Average Triumph
  averageSetback: number; // Average Loss -> Average Setback
  karmaFactor: number; // Profit Factor -> Karma Factor
  sacredStreak: number; // Trading Streak -> Sacred Streak
  cosmicAlignment: 'serene' | 'balanced' | 'volatile'; // Risk Tolerance -> Cosmic Alignment
  houseAlignment?: HouseType;
  divineBlessings: number; // House bonuses
  karmaLevel: number; // User experience level
}

interface SacredTradingVaultProps {
  selectedHouse?: HouseType;
}

export function SacredTradingVault({ selectedHouse = 'heroes' }: SacredTradingVaultProps) {
  const { user } = useAuth();
  const [mysticalEnergy, setMysticalEnergy] = useState(0);
  const [isChanneling, setIsChanneling] = useState(false);
  
  // Mystical energy animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMysticalEnergy(prev => (prev + 1) % 360);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Channeling animation
  useEffect(() => {
    const channelInterval = setInterval(() => {
      setIsChanneling(true);
      setTimeout(() => setIsChanneling(false), 2500);
    }, 10000);
    return () => clearInterval(channelInterval);
  }, []);
  
  // Fetch sacred user data
  const { data: userData, isLoading, refetch } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: !!user,
    refetchInterval: 60000,
  });

  // Transform trading data into sacred vault data
  const sacredData = React.useMemo((): SacredVaultData => {
    if (!userData) {
      return {
        mysticBalance: 100000.00,
        availablePower: 100000.00,
        investedEnergy: 0.00,
        dailyRitualLimit: 10000.00,
        dailyRitualUsed: 0.00,
        maxChanneling: 5000.00,
        totalRituals: 0,
        triumphantRituals: 0,
        failedRituals: 0,
        averageTriumph: 0,
        averageSetback: 0,
        karmaFactor: 1.0,
        sacredStreak: 0,
        cosmicAlignment: 'balanced',
        houseAlignment: selectedHouse,
        divineBlessings: 0,
        karmaLevel: 1
      };
    }

    const mysticBalance = parseFloat(userData.virtualTradingBalance || '100000');
    const dailyRitualLimit = parseFloat(userData.dailyTradingLimit || '10000');
    const dailyRitualUsed = parseFloat(userData.dailyTradingUsed || '0');
    const maxChanneling = parseFloat(userData.maxPositionSize || '5000');
    const availablePower = mysticBalance - dailyRitualUsed;
    const investedEnergy = dailyRitualUsed;

    // Calculate karma level based on performance and activity
    const totalRituals = userData.totalTrades || 0;
    const triumphantRituals = userData.winningTrades || 0;
    const karmaFactor = userData.profitFactor || 1.0;
    const karmaLevel = Math.max(1, Math.floor((totalRituals / 10) + (karmaFactor * 5) + (mysticBalance / 20000)));
    
    // Calculate divine blessings based on karma and house
    const divineBlessings = karmaLevel * 0.05 + (karmaFactor > 1 ? 0.1 : 0);

    // Map risk tolerance to cosmic alignment
    const riskMap: { [key: string]: 'serene' | 'balanced' | 'volatile' } = {
      'conservative': 'serene',
      'moderate': 'balanced',
      'aggressive': 'volatile'
    };

    return {
      mysticBalance,
      availablePower,
      investedEnergy,
      dailyRitualLimit,
      dailyRitualUsed,
      maxChanneling,
      totalRituals,
      triumphantRituals: userData.winningTrades || 0,
      failedRituals: userData.losingTrades || 0,
      averageTriumph: userData.averageWin || 0,
      averageSetback: userData.averageLoss || 0,
      karmaFactor,
      sacredStreak: userData.tradingStreakDays || 0,
      cosmicAlignment: riskMap[userData.riskTolerance] || 'balanced',
      houseAlignment: selectedHouse,
      divineBlessings,
      karmaLevel
    };
  }, [userData, selectedHouse]);

  // Mock sacred data for demonstration
  const mockSacredData: SacredVaultData = {
    mysticBalance: 125000.00,
    availablePower: 102650.50,
    investedEnergy: 22349.50,
    dailyRitualLimit: 15000.00,
    dailyRitualUsed: 3750.00,
    maxChanneling: 7500.00,
    totalRituals: 87,
    triumphantRituals: 62,
    failedRituals: 25,
    averageTriumph: 425.75,
    averageSetback: -185.25,
    karmaFactor: 2.3,
    sacredStreak: 8,
    cosmicAlignment: 'balanced',
    houseAlignment: selectedHouse,
    divineBlessings: 0.15,
    karmaLevel: 12
  };

  // Use real data if available, otherwise demo data
  const displayData = userData ? sacredData : mockSacredData;

  const formatMysticCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTriumphRate = () => {
    if (displayData.totalRituals === 0) return 0;
    return (displayData.triumphantRituals / displayData.totalRituals) * 100;
  };

  const getRitualLimitUsage = () => {
    return (displayData.dailyRitualUsed / displayData.dailyRitualLimit) * 100;
  };

  const getCosmicAlignmentColor = (alignment: string) => {
    switch (alignment) {
      case 'serene': return 'text-emerald-400';
      case 'balanced': return 'text-blue-400';
      case 'volatile': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getCosmicAlignmentIcon = (alignment: string) => {
    switch (alignment) {
      case 'serene': return <Shield className="w-4 h-4" />;
      case 'balanced': return <Target className="w-4 h-4" />;
      case 'volatile': return <Flame className="w-4 h-4" />;
      default: return <Crystal className="w-4 h-4" />;
    }
  };

  const getHouseIcon = (house: HouseType) => {
    switch (house) {
      case 'heroes': return Shield;
      case 'wisdom': return Eye;
      case 'power': return Crown;
      case 'mystery': return Crystal;
      case 'elements': return Flame;
      case 'time': return Globe;
      case 'spirit': return Heart;
      default: return Star;
    }
  };

  const getKarmaTitle = (level: number) => {
    if (level >= 30) return { title: 'Mystic Grandmaster', color: 'legendary-text' };
    if (level >= 20) return { title: 'Sacred Adept', color: 'epic-text' };
    if (level >= 10) return { title: 'Divine Initiate', color: 'rare-text' };
    return { title: 'Apprentice Seeker', color: 'text-white' };
  };

  const karmaTitle = getKarmaTitle(displayData.karmaLevel);
  const HouseIcon = getHouseIcon(displayData.houseAlignment || 'heroes');

  return (
    <div className="sacred-particles relative">
      <Card className={`
        transition-arcane hover-elevate border-2
        ${displayData.houseAlignment ? `house-aura-${displayData.houseAlignment}` : ''}
        ${isChanneling ? 'sacred-glow-divine scale-102' : ''}
      `} data-testid="sacred-trading-vault">
        
        <CardHeader className="relative">
          {/* Sacred Energy Waves */}
          <div className="absolute top-0 left-0 w-full h-1 overflow-hidden">
            <div 
              className="h-full w-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent transition-divine"
              style={{ 
                transform: `translateX(${Math.sin(mysticalEnergy * 0.03) * 150}px)`,
                opacity: isChanneling ? 0.8 : 0.4
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Gem className={`h-8 w-8 text-cyan-400 transition-mystical ${isChanneling ? 'sacred-glow-intense scale-125' : 'mystical-pulse'}`} />
                <HouseIcon className="absolute -bottom-1 -right-1 w-4 h-4 text-amber-400 mystical-pulse" />
              </div>
              <div>
                <CardTitle className="text-2xl font-display font-bold legendary-text flex items-center space-x-2">
                  <span>Sacred Trading Vault</span>
                  <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 
                                   border-cyan-500/30 mystical-pulse">
                    Channeling Active
                  </Badge>
                </CardTitle>
                <div className="flex items-center space-x-3 mt-1">
                  <Badge className={`${karmaTitle.color} border-cyan-500/30`}>
                    <Crown className="w-3 h-3 mr-1" />
                    {karmaTitle.title}
                  </Badge>
                  <span className="text-sm text-slate-400">Karma Level {displayData.karmaLevel}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => refetch()}
                disabled={isLoading}
                className="hover:bg-cyan-500/10"
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Sacred Balance Overview */}
          <div className="space-y-4" data-testid="vault-overview">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-2">Mystic Trading Balance</p>
              {isLoading ? (
                <div className="animate-pulse bg-slate-700 rounded h-10 w-40 mx-auto"></div>
              ) : (
                <p className="text-4xl font-display font-bold font-trading legendary-text" data-testid="text-mystic-balance">
                  {formatMysticCurrency(displayData.mysticBalance)}
                </p>
              )}
              <p className="text-sm text-slate-400 mt-2">
                Sacred Foundation: {formatMysticCurrency(100000)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border-2 border-emerald-500/30 rounded-lg bg-gradient-to-br from-emerald-900/20 to-green-900/20">
                <Crown className="w-6 h-6 text-emerald-400 mx-auto mb-2 mystical-pulse" />
                <p className="text-sm text-slate-400">Available Power</p>
                <p className="text-lg font-bold font-trading text-emerald-400" data-testid="text-available-power">
                  {formatMysticCurrency(displayData.availablePower)}
                </p>
              </div>
              
              <div className="text-center p-4 border-2 border-blue-500/30 rounded-lg bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
                <Scroll className="w-6 h-6 text-blue-400 mx-auto mb-2 mystical-pulse" />
                <p className="text-sm text-slate-400">Channeled Energy</p>
                <p className="text-lg font-bold font-trading text-blue-400" data-testid="text-invested-energy">
                  {formatMysticCurrency(displayData.investedEnergy)}
                </p>
              </div>
            </div>
          </div>

          {/* Karma Level and Divine Blessings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="vault-karma-metrics">
            <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border border-amber-500/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-amber-400">Karma Ascension</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-amber-300">Level {displayData.karmaLevel}</span>
                  <Sparkles className="w-4 h-4 text-amber-400 mystical-pulse" />
                </div>
              </div>
              <div className="w-full bg-amber-900/50 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-3 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full karma-fill transition-all duration-700"
                  style={{ width: `${((displayData.karmaLevel % 10) / 10) * 100}%` }}
                />
              </div>
              <div className="text-xs text-amber-300">
                Next Ascension: {Math.ceil(displayData.karmaLevel / 10) * 10}
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-400">Divine Blessings</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-purple-300">+{(displayData.divineBlessings * 100).toFixed(1)}%</span>
                  <Star className="w-4 h-4 text-purple-400 mystical-pulse" />
                </div>
              </div>
              <div className="w-full bg-purple-900/50 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-3 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-700 mystical-pulse"
                  style={{ width: `${Math.min(displayData.divineBlessings * 100, 100)}%` }}
                />
              </div>
              <div className="text-xs text-purple-300">
                Enhanced by House {displayData.houseAlignment}
              </div>
            </div>
          </div>

          {/* Daily Ritual Limits */}
          <div className="space-y-4" data-testid="daily-ritual-limits">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium">Daily Ritual Capacity</span>
              </div>
              <span className="text-sm text-slate-400">
                {formatMysticCurrency(displayData.dailyRitualUsed)} / {formatMysticCurrency(displayData.dailyRitualLimit)}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-700 mystical-pulse"
                style={{ width: `${getRitualLimitUsage()}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Channeled: {getRitualLimitUsage().toFixed(1)}%</span>
              <span>Remaining: {formatMysticCurrency(displayData.dailyRitualLimit - displayData.dailyRitualUsed)}</span>
            </div>
          </div>

          {/* Cosmic Alignment */}
          <div className="space-y-4" data-testid="cosmic-alignment">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cosmic Alignment</span>
              <div className="flex items-center gap-2">
                {getCosmicAlignmentIcon(displayData.cosmicAlignment)}
                <span className={`text-sm capitalize font-medium ${getCosmicAlignmentColor(displayData.cosmicAlignment)}`}>
                  {displayData.cosmicAlignment}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-slate-700/50 rounded-lg space-y-2 bg-slate-800/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Max Channeling</span>
                  <span className="font-medium text-cyan-400" data-testid="text-max-channeling">
                    {formatMysticCurrency(displayData.maxChanneling)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Sacred Streak</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="font-medium text-emerald-400" data-testid="text-sacred-streak">
                      {displayData.sacredStreak} rituals
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 border border-slate-700/50 rounded-lg space-y-2 bg-slate-800/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Karma Factor</span>
                  <span className={`font-bold ${displayData.karmaFactor >= 1 ? 'text-emerald-400' : 'text-red-400'}`} 
                        data-testid="text-karma-factor">
                    {displayData.karmaFactor.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Triumph Rate</span>
                  <span className="font-bold text-emerald-400" data-testid="text-triumph-rate">
                    {getTriumphRate().toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sacred Ritual Statistics */}
          <div className="space-y-4" data-testid="ritual-statistics">
            <h4 className="text-sm font-medium text-white flex items-center space-x-2">
              <Wand2 className="w-4 h-4 text-purple-400" />
              <span>Sacred Ritual Mastery</span>
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 border border-slate-700/50 rounded-lg bg-slate-800/30">
                <p className="text-sm text-slate-400">Total Rituals</p>
                <p className="text-xl font-bold font-trading" data-testid="text-total-rituals">
                  {displayData.totalRituals}
                </p>
              </div>
              
              <div className="text-center p-3 border border-slate-700/50 rounded-lg bg-slate-800/30">
                <p className="text-sm text-slate-400">Triumph Rate</p>
                <p className="text-xl font-bold text-emerald-400 font-trading" data-testid="text-triumph-rate-display">
                  {getTriumphRate().toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 border border-slate-700/50 rounded-lg bg-emerald-900/20">
                <p className="text-xs text-slate-400">Avg Triumph</p>
                <p className="text-sm font-medium text-emerald-400 font-trading" data-testid="text-avg-triumph">
                  {formatMysticCurrency(displayData.averageTriumph)}
                </p>
              </div>
              
              <div className="text-center p-2 border border-slate-700/50 rounded-lg bg-red-900/20">
                <p className="text-xs text-slate-400">Avg Setback</p>
                <p className="text-sm font-medium text-red-400 font-trading" data-testid="text-avg-setback">
                  {formatMysticCurrency(displayData.averageSetback)}
                </p>
              </div>
            </div>
          </div>

          {/* Sacred Insights */}
          <div className="border-t border-slate-700/50 pt-4">
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg border border-slate-700/50" 
                 data-testid="vault-insights">
              <Eye className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0 mystical-pulse" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-white">Sacred Vault Insights</p>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Your karma ascends through {displayData.sacredStreak} sacred rituals</li>
                  <li>• {getRitualLimitUsage().toFixed(0)}% of daily ritual capacity channeled</li>
                  <li>• Karma factor of {displayData.karmaFactor.toFixed(2)} reveals {displayData.karmaFactor > 1 ? 'divine favor' : 'growth potential'}</li>
                  <li>• House {displayData.houseAlignment} blesses your trading vault with {(displayData.divineBlessings * 100).toFixed(1)}% enhancement</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SacredTradingVault;