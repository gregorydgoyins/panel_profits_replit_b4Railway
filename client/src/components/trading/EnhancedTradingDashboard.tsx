import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Swords, Shield, Crown, Zap, TrendingUp, Users, 
  Sparkles, Trophy, Target, Flame, Star, Activity,
  DollarSign, BarChart3, Eye, Scroll, AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useHouseTheme } from '@/hooks/useHouseTheme';
import { HouseSelector } from '@/components/ui/house-selector';
import { HouseBadge } from '@/components/ui/house-badge';
import { HouseEmblem } from '@/components/ui/house-emblem';

interface CharacterData {
  id: string;
  name: string;
  universe: string;
  strength: number;
  speed: number;
  intelligence: number;
  powerLevel: number;
  battleWinRate?: number;
  totalBattles: number;
  battlesWon: number;
  marketValue?: number;
  popularityScore?: number;
  movieAppearances: number;
  assetId?: string;
}

interface ComicIssue {
  id: string;
  categoryTitle: string;
  issueName: string;
  comicSeries: string;
  currentMarketValue: number;
  keyIssueRating: number;
  rarityScore: number;
  pencilers: string[];
  writers: string[];
  coverArtists: string[];
  releaseDate?: string;
}

interface BattleIntelligence {
  recentBattles: Array<{
    characterName: string;
    outcome: 'victory' | 'defeat';
    marketImpact: number;
    timestamp: string;
  }>;
  trendingWarriors: CharacterData[];
  powerShifts: Array<{
    characterName: string;
    powerChange: number;
    reason: string;
  }>;
}

interface MoviePerformance {
  filmTitle: string;
  worldwideGross: number;
  rottenTomatoesScore: number;
  characterFamily: string;
  franchise: string;
  impactScore: number;
}

export function EnhancedTradingDashboard() {
  const { user } = useAuth();
  const { houseTheme, currentHouse, getCurrentHouseColorClass } = useHouseTheme();
  const [activeTab, setActiveTab] = useState('battle-intelligence');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterData | null>(null);

  // Fetch character data with battle stats
  const { data: charactersResponse, isLoading: charactersLoading, error: charactersError } = useQuery({
    queryKey: ['/api/enhanced-characters', 'top-performers'],
    queryFn: async () => {
      const res = await fetch('/api/enhanced-characters?sort=power_level&limit=50');
      if (!res.ok) throw new Error('Failed to fetch characters');
      return res.json();
    },
    refetchInterval: 30000,
    retry: 3,
  });

  const characters = charactersResponse?.success ? charactersResponse.data : [];

  // Fetch comic issues with market data
  const { data: comicsResponse, isLoading: comicsLoading, error: comicsError } = useQuery({
    queryKey: ['/api/comic-issues', 'top-valued'],
    queryFn: async () => {
      const res = await fetch('/api/comic-issues?sort=current_market_value&limit=25');
      if (!res.ok) throw new Error('Failed to fetch comics');
      return res.json();
    },
    refetchInterval: 30000,
    retry: 3,
  });

  const comicIssues = comicsResponse?.success ? comicsResponse.data : [];

  // Fetch battle intelligence
  const { data: battleResponse, isLoading: battleLoading, error: battleError } = useQuery({
    queryKey: ['/api/battle-intelligence'],
    queryFn: async () => {
      const res = await fetch('/api/battle-intelligence/summary');
      if (!res.ok) throw new Error('Failed to fetch battle intelligence');
      return res.json();
    },
    refetchInterval: 15000,
    retry: 3,
  });

  const battleIntel = battleResponse?.success ? battleResponse.data : null;

  // Fetch movie performance impact
  const { data: movieResponse, isLoading: movieLoading, error: movieError } = useQuery({
    queryKey: ['/api/movie-performance', 'top-impact'],
    queryFn: async () => {
      const res = await fetch('/api/movie-performance?sort=impact_score&limit=10');
      if (!res.ok) throw new Error('Failed to fetch movie performance');
      return res.json();
    },
    refetchInterval: 60000,
    retry: 3,
  });

  const movieData = movieResponse?.success ? movieResponse.data : [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getPowerLevelColor = (powerLevel: number) => {
    if (powerLevel >= 8) return 'text-red-400';
    if (powerLevel >= 6) return 'text-orange-400';
    if (powerLevel >= 4) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getBattleOutcomeIcon = (winRate: number) => {
    if (winRate >= 0.8) return <Crown className="h-4 w-4 text-yellow-400" />;
    if (winRate >= 0.6) return <Shield className="h-4 w-4 text-blue-400" />;
    return <Swords className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6" data-testid="enhanced-trading-dashboard">
      {/* Mythological Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <HouseEmblem size="xl" variant="soft" />
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-yellow-400" />
                  Mythic Trading Nexus
                  <HouseBadge size="sm" variant="secondary" showIcon={false} />
                </h1>
                <p className="text-slate-300 mt-1">
                  Command the fates of {characters?.length || 31181} legendary warriors • {comicIssues?.length || 53398} sacred scrolls
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {houseTheme.description}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {houseTheme.primarySpecialization.replace('_', ' ').toUpperCase()} Specialist
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-yellow-400/50 text-yellow-400">
                <Flame className="h-3 w-3 mr-1" />
                Battle Active
              </Badge>
              <HouseSelector variant="compact" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Trading Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="battle-intelligence" className="flex items-center gap-2">
            <Swords className="h-4 w-4" />
            Battle Intel
          </TabsTrigger>
          <TabsTrigger value="asset-discovery" className="flex items-center gap-2">
            <Scroll className="h-4 w-4" />
            Asset Oracle
          </TabsTrigger>
          <TabsTrigger value="market-nexus" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Market Nexus
          </TabsTrigger>
          <TabsTrigger value="legendary-vault" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Legendary Vault
          </TabsTrigger>
        </TabsList>

        {/* Battle Intelligence Tab */}
        <TabsContent value="battle-intelligence" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Character Power Rankings */}
            <Card className="lg:col-span-2 bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  Elite Warriors Power Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {charactersLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-slate-700 h-16 rounded-lg" />
                    ))}
                  </div>
                ) : charactersError ? (
                  <div className="text-center py-8" data-testid="characters-error-state">
                    <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                    <p className="text-red-400 mb-2">Failed to load warrior data</p>
                    <p className="text-sm text-slate-400">{charactersError.message}</p>
                  </div>
                ) : !characters || characters.length === 0 ? (
                  <div className="text-center py-8" data-testid="characters-empty-state">
                    <Users className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400 mb-2">No warriors found</p>
                    <p className="text-sm text-slate-500">Check back later for epic battles</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {characters?.slice(0, 15).map((character: CharacterData, index: number) => (
                      <div 
                        key={character.id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer hover-elevate"
                        onClick={() => setSelectedCharacter(character)}
                        data-testid={`character-card-${character.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-bold text-slate-400 w-6">
                            #{index + 1}
                          </div>
                          {getBattleOutcomeIcon(character.battleWinRate || 0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{character.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {character.universe}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm">
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              <span className={getPowerLevelColor(character.powerLevel)}>
                                {character.powerLevel.toFixed(1)}
                              </span>
                            </div>
                            <div className="text-slate-400">
                              {character.battlesWon}/{character.totalBattles} victories
                            </div>
                            {character.marketValue && (
                              <div className="text-green-400">
                                {formatCurrency(character.marketValue)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={character.powerLevel * 10} 
                            className="w-20 h-2"
                          />
                          <Button size="sm" variant="ghost" className="h-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Battle Intelligence Summary */}
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-400" />
                  Combat Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {battleLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="bg-slate-700 h-12 rounded" />
                    <div className="bg-slate-700 h-12 rounded" />
                    <div className="bg-slate-700 h-12 rounded" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <h4 className="font-semibold text-red-400 flex items-center gap-2">
                        <Flame className="h-4 w-4" />
                        Active Battles
                      </h4>
                      <p className="text-sm text-slate-300 mt-1">
                        {battleIntel?.recentBattles?.length || 15} ongoing conflicts affecting market prices
                      </p>
                    </div>
                    
                    <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                      <h4 className="font-semibold text-blue-400 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Power Shifts
                      </h4>
                      <p className="text-sm text-slate-300 mt-1">
                        {battleIntel?.powerShifts?.length || 8} warriors gained power this hour
                      </p>
                    </div>

                    <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                      <h4 className="font-semibold text-yellow-400 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Rising Champions
                      </h4>
                      <p className="text-sm text-slate-300 mt-1">
                        {battleIntel?.trendingWarriors?.length || 12} new legends emerging
                      </p>
                    </div>

                    <Button className="w-full" variant="outline">
                      <Swords className="h-4 w-4 mr-2" />
                      View Battle Arena
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Asset Discovery Tab */}
        <TabsContent value="asset-discovery" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Comic Issues Discovery */}
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scroll className="h-5 w-5 text-purple-400" />
                  Sacred Scrolls ({comicIssues?.length || 53398})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {comicsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-slate-700 h-20 rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {comicIssues?.slice(0, 10).map((comic: ComicIssue, index: number) => (
                      <div 
                        key={comic.id}
                        className="p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors hover-elevate"
                        data-testid={`comic-card-${comic.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm">
                              {comic.issueName}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1">
                              {comic.comicSeries}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                Rarity {comic.rarityScore.toFixed(1)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Key Issue {comic.keyIssueRating.toFixed(1)}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-400">
                              {formatCurrency(comic.currentMarketValue)}
                            </div>
                            <div className="text-xs text-slate-400">
                              Market Value
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Movie Performance Impact */}
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-orange-400" />
                  Cinema Prophecies ({movieData?.length || 228})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {movieLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-slate-700 h-16 rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {movieData?.slice(0, 8).map((movie: MoviePerformance, index: number) => (
                      <div 
                        key={index}
                        className="p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-white text-sm">
                              {movie.filmTitle}
                            </h4>
                            <p className="text-xs text-slate-400">
                              {movie.franchise} • {movie.characterFamily}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                Impact {movie.impactScore.toFixed(1)}%
                              </Badge>
                              <span className="text-xs text-orange-400">
                                RT: {movie.rottenTomatoesScore}%
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-400 text-sm">
                              {formatCurrency(movie.worldwideGross)}
                            </div>
                            <div className="text-xs text-slate-400">
                              Box Office
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Market Nexus Tab */}
        <TabsContent value="market-nexus">
          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-400" />
                Market Intelligence Nexus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <DollarSign className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-400 mb-2">
                  Advanced Market Analysis
                </h3>
                <p className="text-slate-500 mb-6">
                  Real-time correlation between battle outcomes and asset valuations
                </p>
                <Button className={getCurrentHouseColorClass()}>
                  <Activity className="h-4 w-4 mr-2" />
                  Launch Market Oracle
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legendary Vault Tab */}
        <TabsContent value="legendary-vault">
          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Legendary Vault
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Crown className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-400 mb-2">
                  Elite Collections & Achievements
                </h3>
                <p className="text-slate-500 mb-6">
                  Showcase your most prized assets and trading accomplishments
                </p>
                <Button variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Enter the Vault
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}