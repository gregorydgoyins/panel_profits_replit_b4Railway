import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, Star, Target, Crown, Flame, Zap, Shield, Swords, Eye,
  TrendingUp, Award, Users, Sparkles, Scroll, BookOpen,
  Gem, Globe, Heart, Wand2, Sword, Feather
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useHouseTheme } from '@/hooks/useHouseTheme';
import { HouseBadge } from '@/components/ui/house-badge';

type HouseType = 'heroes' | 'wisdom' | 'power' | 'mystery' | 'elements' | 'time' | 'spirit';

interface LegendaryAchievement {
  id: string;
  sacredTitle: string; // Title -> Sacred Title
  prophecy: string; // Description -> Prophecy
  realm: 'trading' | 'battle' | 'discovery' | 'social' | 'mystical'; // Category + new mystical
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'divine'; // Enhanced rarity system
  ascension: number; // Progress -> Ascension
  maxAscension: number; // Max Progress
  isCompleted: boolean;
  divineBoons: string[]; // Rewards -> Divine Boons
  sacredIcon: string;
  houseAlignment?: HouseType;
  karmaReward?: number;
}

interface MysticalBattleEvent {
  id: string;
  outcome: 'triumph' | 'defeat' | 'stalemate'; // victory/defeat/draw -> mystical terms
  championName: string; // Character Name
  adversary: string; // Opponent
  realmImpact: number; // Market Impact
  powerShift: number; // Portfolio Effect
  timestamp: string;
  isRead: boolean;
  battleType: 'champion' | 'house' | 'cosmic'; // New battle types
}

interface DivineStreak {
  currentAscension: number; // Current Streak -> Current Ascension
  legendaryRecord: number; // Best Streak -> Legendary Record
  powerMultiplier: number; // Streak Multiplier
  nextMilestone: number;
  sacredFlame: boolean; // Bonus Active -> Sacred Flame
  divineBlessings: number; // House streak bonuses
}

interface HouseLegion {
  rank: number;
  totalWarriors: number; // Total Members -> Total Warriors
  houseGlory: number; // House Performance -> House Glory
  weeklyAscension: number; // Weekly Change
  sacredArts: string[]; // Specializations -> Sacred Arts
  legendaryDeeds: number; // Achievements -> Legendary Deeds
  houseSpirit: number; // House morale/energy
}

interface LegendaryAchievementShrineProps {
  selectedHouse?: HouseType;
}

export function LegendaryAchievementShrine({ selectedHouse }: LegendaryAchievementShrineProps) {
  const { user } = useAuth();
  const { houseTheme, currentHouse, getCurrentHouseColorClass } = useHouseTheme();
  const [selectedEvent, setSelectedEvent] = useState<MysticalBattleEvent | null>(null);
  const [mysticalEnergy, setMysticalEnergy] = useState(0);
  const [isChanneling, setIsChanneling] = useState(false);

  // Mystical energy animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMysticalEnergy(prev => (prev + 1) % 360);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Channeling animation
  useEffect(() => {
    const channelInterval = setInterval(() => {
      setIsChanneling(true);
      setTimeout(() => setIsChanneling(false), 2000);
    }, 8000);
    return () => clearInterval(channelInterval);
  }, []);

  // Fetch legendary achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['/api/user/achievements', user?.id],
    queryFn: () => fetch(`/api/user/achievements`).then(res => res.json()),
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Fetch mystical battle events
  const { data: battleEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['/api/user/battle-notifications', user?.id],
    queryFn: () => fetch('/api/user/battle-notifications').then(res => res.json()),
    enabled: !!user,
    refetchInterval: 15000,
  });

  // Fetch divine streak
  const { data: divineStreak, isLoading: streakLoading } = useQuery({
    queryKey: ['/api/user/trading-streak', user?.id],
    queryFn: () => fetch('/api/user/trading-streak').then(res => res.json()),
    enabled: !!user,
    refetchInterval: 60000,
  });

  // Fetch house legion standing
  const { data: houseLegion, isLoading: legionLoading } = useQuery({
    queryKey: ['/api/houses/ranking', currentHouse],
    queryFn: () => fetch(`/api/houses/ranking/${currentHouse}`).then(res => res.json()),
    enabled: !!currentHouse,
    refetchInterval: 120000,
  });

  const getRarityClasses = (rarity: string) => {
    switch (rarity) {
      case 'divine': return 'text-amber-300 bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border-amber-400/50 divine-shimmer';
      case 'legendary': return 'text-purple-300 bg-gradient-to-r from-purple-900/30 to-violet-900/30 border-purple-400/50 legendary-text';
      case 'epic': return 'text-blue-300 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-400/50 epic-text';
      case 'rare': return 'text-green-300 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-400/50 rare-text';
      default: return 'text-slate-300 bg-slate-900/30 border-slate-500/30';
    }
  };

  const getSacredIcon = (realm: string) => {
    switch (realm) {
      case 'trading': return <Gem className="h-4 w-4" />;
      case 'battle': return <Swords className="h-4 w-4" />;
      case 'discovery': return <Eye className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      case 'mystical': return <Gem className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getHouseIcon = (house: HouseType) => {
    switch (house) {
      case 'heroes': return Shield;
      case 'wisdom': return BookOpen;
      case 'power': return Crown;
      case 'mystery': return Gem;
      case 'elements': return Flame;
      case 'time': return Globe;
      case 'spirit': return Heart;
      default: return Star;
    }
  };

  const formatMysticalTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diff < 60) return `${diff} moments ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours past`;
    return `${Math.floor(diff / 1440)} days hence`;
  };

  const house = selectedHouse || currentHouse || 'heroes';
  const HouseIcon = getHouseIcon(house);

  return (
    <div className={`space-y-6 sacred-particles relative ${house ? `house-aura-${house}` : ''}`} 
         data-testid="legendary-achievement-shrine">
      
      {/* Mystical Energy Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent transition-divine"
          style={{ 
            transform: `translateX(${Math.sin(mysticalEnergy * 0.04) * 100}px)`,
            opacity: isChanneling ? 0.8 : 0.3
          }}
        />
      </div>

      {/* Sacred Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`p-3 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-400/50 transition-mystical
              ${isChanneling ? 'sacred-glow-divine scale-110' : 'mystical-pulse'}`}>
              <Trophy className="h-8 w-8 text-amber-400" />
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 divine-shimmer" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold legendary-text flex items-center gap-3">
              <span>Sacred Achievement Shrine</span>
            </h2>
            <p className="text-slate-400 mt-1 flex items-center space-x-2">
              <span>Channel your legendary prowess</span>
              <span>•</span>
              <span className="text-amber-400">{achievements?.completed || 0} of {achievements?.total || 0} attained</span>
              <HouseIcon className="w-4 h-4 text-amber-400" />
            </p>
          </div>
        </div>
        <HouseBadge size="lg" variant="soft" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Legendary Achievements Sanctum */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 
                         backdrop-blur-xl border-2 border-slate-700/50 transition-arcane hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Award className="h-6 w-6 text-amber-400 mystical-pulse" />
              <span className="legendary-text">Legendary Ascension Progress</span>
              <Badge className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30">
                Sacred Registry
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievementsLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-slate-700/50 h-24 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {achievements?.data?.map((achievement: LegendaryAchievement) => {
                  const rarityClasses = getRarityClasses(achievement.difficulty || 'common');
                  const SacredIcon = getSacredIcon(achievement.category || 'mystical');
                  
                  return (
                    <div 
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 transition-arcane hover-elevate ${
                        achievement.isCompleted
                          ? 'bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-emerald-500/50 sacred-glow-moderate'
                          : 'bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-slate-700/50'
                      }`}
                      data-testid={`achievement-${achievement.id}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg transition-mystical ${rarityClasses}`}>
                          {SacredIcon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-display font-bold text-white">{achievement.title}</h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs font-medium ${rarityClasses}`}
                            >
                              {(achievement.difficulty || 'common').toUpperCase()}
                            </Badge>
                            {achievement.isCompleted && (
                              <Badge className="text-xs bg-gradient-to-r from-emerald-600 to-green-600 border-emerald-400/50 mystical-pulse">
                                <Crown className="h-3 w-3 mr-1" />
                                Mastered
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mb-3 italic">
                            "{achievement.description}"
                          </p>
                          
                          {!achievement.isCompleted && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Sacred Ascension</span>
                                <span className="text-white font-medium">
                                  {achievement.progress} / {achievement.maxProgress}
                                </span>
                              </div>
                              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                                <div 
                                  className="h-2 rounded-full karma-fill bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
                                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {achievement.rewards && achievement.rewards.length > 0 && (
                            <div className="mt-3 flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-amber-400 flex items-center space-x-1">
                                <Sparkles className="w-3 h-3" />
                                <span>Divine Boons:</span>
                              </span>
                              {achievement.rewards.map((reward, index) => (
                                <Badge key={index} className="text-xs bg-gradient-to-r from-purple-600/30 to-blue-600/30 border-purple-500/50">
                                  {reward}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sacred Sidebar */}
        <div className="space-y-6">
          {/* Divine Streak Flame */}
          <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-xl border-2 border-orange-500/50 transition-arcane hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Flame className="h-6 w-6 text-orange-400 mystical-pulse" />
                <span className="epic-text">Sacred Flame</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {streakLoading ? (
                <div className="animate-pulse bg-slate-700/50 h-28 rounded" />
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-display font-bold text-orange-400 font-trading">
                      {divineStreak?.currentStreak || 0}
                    </div>
                    <div className="text-sm text-slate-400">Divine Ascensions</div>
                    {divineStreak?.bonusActive && (
                      <Badge className="mt-2 bg-gradient-to-r from-orange-600 to-red-600 border-orange-400/50 mystical-pulse">
                        <Zap className="h-3 w-3 mr-1" />
                        Sacred Flame Burns!
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-2 bg-slate-800/50 rounded border border-slate-700/50">
                      <div className="text-slate-400">Legendary Record</div>
                      <div className="font-display font-bold text-orange-300">
                        {divineStreak?.bestStreak || 0}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-slate-800/50 rounded border border-slate-700/50">
                      <div className="text-slate-400">Power Multiplier</div>
                      <div className="font-display font-bold text-emerald-400">
                        {divineStreak?.streakMultiplier?.toFixed(2) || '1.00'}x
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">Next Sacred Milestone</span>
                      <span className="text-amber-400">{divineStreak?.nextMilestone || 10}</span>
                    </div>
                    <div className="w-full bg-orange-900/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 transition-all duration-700 mystical-pulse"
                        style={{ width: `${((divineStreak?.currentStreak || 0) / (divineStreak?.nextMilestone || 10)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* House Legion Standing */}
          <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl border-2 border-purple-500/50 transition-arcane hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Crown className="h-6 w-6 text-purple-400 mystical-pulse" />
                <span className="legendary-text">House Legion</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {legionLoading ? (
                <div className="animate-pulse bg-slate-700/50 h-36 rounded" />
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-display font-bold text-purple-400 font-trading">
                      #{houseLegion?.rank || 1}
                    </div>
                    <div className="text-sm text-slate-400">
                      among 7 Sacred Houses
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Warriors</span>
                      <span className="text-white font-medium">{houseLegion?.totalMembers || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">House Glory</span>
                      <span className="text-purple-400 font-bold">
                        {houseLegion?.housePerformance?.toFixed(1) || '0.0'}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Weekly Ascension</span>
                      <span className={`flex items-center gap-1 font-medium ${
                        (houseLegion?.weeklyChange || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        <TrendingUp className="h-3 w-3" />
                        {houseLegion?.weeklyChange?.toFixed(1) || '0.0'}%
                      </span>
                    </div>
                  </div>

                  <Button 
                    className={`w-full bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/50 hover:border-purple-400/70 text-purple-300`}
                    size="sm"
                  >
                    <Scroll className="h-4 w-4 mr-2" />
                    View Legion Chronicle
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mystical Battle Chronicles */}
          <Card className="bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-xl border-2 border-red-500/50 transition-arcane hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Swords className="h-6 w-6 text-red-400 mystical-pulse" />
                <span className="rare-text">Battle Chronicles</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="animate-pulse space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-slate-700/50 h-14 rounded" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-52 overflow-y-auto">
                  {battleEvents?.data?.slice(0, 5).map((event: MysticalBattleEvent) => (
                    <div 
                      key={event.id}
                      className={`p-3 rounded border cursor-pointer transition-arcane hover-elevate ${
                        event.isRead 
                          ? 'bg-slate-800/30 border-slate-700/30' 
                          : 'bg-blue-900/30 border-blue-500/50 sacred-glow-subtle'
                      }`}
                      onClick={() => setSelectedEvent(event)}
                      data-testid={`battle-chronicle-${event.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded ${
                          event.type === 'victory' 
                            ? 'bg-emerald-900/30 text-emerald-400' 
                            : event.type === 'defeat'
                            ? 'bg-red-900/30 text-red-400'
                            : 'bg-amber-900/30 text-amber-400'
                        }`}>
                          {event.type === 'victory' ? (
                            <Crown className="h-3 w-3" />
                          ) : event.type === 'defeat' ? (
                            <Sword className="h-3 w-3" />
                          ) : (
                            <Shield className="h-3 w-3" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-white">
                            {event.characterName} vs {event.opponent}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            Power shift: {event.portfolioEffect > 0 ? '+' : ''}{event.portfolioEffect.toFixed(2)}%
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatMysticalTime(event.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!battleEvents?.data || battleEvents.data.length === 0) && (
                    <div className="text-center py-6 text-slate-400">
                      <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No recent battle chronicles</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default LegendaryAchievementShrine;