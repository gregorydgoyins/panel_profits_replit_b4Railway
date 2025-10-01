import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gem, Trophy, Star, Lock, Unlock, Gift, Zap, Crown,
  Eye, EyeOff, Sparkles, Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

interface EasterEggDefinition {
  id: string;
  name: string;
  description: string;
  secret_description: string | null;
  trigger_type: string;
  trigger_conditions: any;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  reward_type: string;
  reward_value: number;
  is_secret: boolean;
  requires_subscription: boolean;
  hints: string[];
}

interface EasterEggProgress {
  egg_id: string;
  progress_data: any;
  current_streak?: number;
  last_trigger_date?: string;
}

interface EasterEggUnlock {
  id: string;
  egg_id: string;
  unlocked_at: string;
  reward_claimed: boolean;
  reward_claimed_at?: string;
}

export default function EasterEggsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [showSecrets, setShowSecrets] = useState(false);

  // Fetch all Easter eggs
  const { data: eggs = [], isLoading: eggsLoading } = useQuery<EasterEggDefinition[]>({
    queryKey: ['/api/easter-eggs'],
  });

  // Fetch user's progress
  const { data: progress = [], isLoading: progressLoading } = useQuery<EasterEggProgress[]>({
    queryKey: ['/api/easter-eggs/progress'],
    enabled: !!user,
  });

  // Fetch unlocked eggs
  const { data: unlocks = [], isLoading: unlocksLoading } = useQuery<EasterEggUnlock[]>({
    queryKey: ['/api/easter-eggs/unlocked'],
    enabled: !!user,
  });

  // Claim reward mutation
  const claimRewardMutation = useMutation({
    mutationFn: async (unlockId: string) => {
      const response = await fetch(`/api/easter-eggs/claim/${unlockId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to claim reward');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Reward Claimed!",
        description: `You've received: ${formatReward(data.reward_type, data.reward_value)}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/easter-eggs/unlocked'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Claim Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'uncommon': return 'text-green-400 border-green-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500/20 to-gray-600/20';
      case 'uncommon': return 'from-green-500/20 to-green-600/20';
      case 'rare': return 'from-blue-500/20 to-blue-600/20';
      case 'epic': return 'from-purple-500/20 to-purple-600/20';
      case 'legendary': return 'from-yellow-500/20 to-amber-600/20';
      default: return 'from-gray-500/20 to-gray-600/20';
    }
  };

  const formatReward = (type: string, value: number) => {
    switch (type) {
      case 'capital_bonus':
        return `$${value.toLocaleString()} Capital Bonus`;
      case 'fee_waiver':
        return `${value}% Fee Waiver`;
      case 'xp_boost':
        return `${value}x XP Multiplier`;
      case 'secret_badge':
        return 'Secret Badge';
      case 'exclusive_asset':
        return 'Exclusive Asset Access';
      case 'special_title':
        return 'Special Title';
      default:
        return 'Mystery Reward';
    }
  };

  const getEggProgress = (eggId: string) => {
    return progress.find(p => p.egg_id === eggId);
  };

  const getEggUnlock = (eggId: string) => {
    return unlocks.find(u => u.egg_id === eggId);
  };

  const calculateProgressPercentage = (egg: EasterEggDefinition, prog: EasterEggProgress | undefined) => {
    if (!prog) return 0;

    switch (egg.trigger_type) {
      case 'consecutive_profitable_days':
        const requiredDays = egg.trigger_conditions.consecutive_days || 1;
        return Math.min(100, ((prog.current_streak || 0) / requiredDays) * 100);
      
      case 'portfolio_milestone':
        const currentValue = prog.progress_data?.current_value || 0;
        const targetValue = egg.trigger_conditions.target_value || 1;
        return Math.min(100, (currentValue / targetValue) * 100);
      
      case 'achievement_chain':
        const completed = prog.progress_data?.completed_steps || 0;
        const total = egg.trigger_conditions.required_achievements?.length || 1;
        return Math.min(100, (completed / total) * 100);
      
      case 'trading_pattern':
        const count = prog.progress_data?.pattern_count || 0;
        const required = egg.trigger_conditions.required_count || 1;
        return Math.min(100, (count / required) * 100);
      
      case 'total_volume':
        const volume = prog.progress_data?.total_volume || 0;
        const targetVolume = egg.trigger_conditions.target_volume || 1;
        return Math.min(100, (volume / targetVolume) * 100);
      
      default:
        return 0;
    }
  };

  const filterEggs = (eggs: EasterEggDefinition[]) => {
    switch (activeTab) {
      case 'unlocked':
        return eggs.filter(egg => unlocks.some(u => u.egg_id === egg.id));
      case 'locked':
        return eggs.filter(egg => !unlocks.some(u => u.egg_id === egg.id));
      case 'common':
      case 'uncommon':
      case 'rare':
      case 'epic':
      case 'legendary':
        return eggs.filter(egg => egg.rarity === activeTab);
      default:
        return eggs;
    }
  };

  const isLoading = eggsLoading || progressLoading || unlocksLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Gem className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Easter egg collection...</p>
        </div>
      </div>
    );
  }

  const filteredEggs = filterEggs(eggs);
  const unlockedCount = unlocks.length;
  const totalCount = eggs.length;

  return (
    <div className="min-h-screen p-6 space-y-6" data-testid="easter-eggs-page">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-lg">
            <Gem className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Easter Egg Collection</h1>
            <p className="text-muted-foreground">
              Discover hidden achievements and unlock exclusive rewards
            </p>
          </div>
        </div>

        <Button 
          onClick={() => setShowSecrets(!showSecrets)}
          variant="outline"
          className="flex items-center gap-2"
          data-testid="button-toggle-secrets"
        >
          {showSecrets ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {showSecrets ? 'Hide' : 'Show'} Secret Hints
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Collection Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{unlockedCount}/{totalCount}</span>
              <Trophy className="h-5 w-5 text-yellow-400" />
            </div>
            <Progress value={(unlockedCount / totalCount) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unclaimed Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {unlocks.filter(u => !u.reward_claimed).length}
              </span>
              <Gift className="h-5 w-5 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rarest Unlocked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {unlocks.some(u => eggs.find(e => e.id === u.egg_id)?.rarity === 'legendary') ? (
                <>
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <span className="text-lg font-bold text-yellow-400">Legendary</span>
                </>
              ) : unlocks.some(u => eggs.find(e => e.id === u.egg_id)?.rarity === 'epic') ? (
                <>
                  <Star className="h-5 w-5 text-purple-400" />
                  <span className="text-lg font-bold text-purple-400">Epic</span>
                </>
              ) : (
                <span className="text-muted-foreground">None yet</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for filtering */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all" data-testid="tab-all">
            All ({eggs.length})
          </TabsTrigger>
          <TabsTrigger value="unlocked" data-testid="tab-unlocked">
            Unlocked ({unlockedCount})
          </TabsTrigger>
          <TabsTrigger value="locked" data-testid="tab-locked">
            Locked ({totalCount - unlockedCount})
          </TabsTrigger>
          <TabsTrigger value="common" data-testid="tab-common">
            <span className="text-gray-400">Common</span>
          </TabsTrigger>
          <TabsTrigger value="uncommon" data-testid="tab-uncommon">
            <span className="text-green-400">Uncommon</span>
          </TabsTrigger>
          <TabsTrigger value="rare" data-testid="tab-rare">
            <span className="text-blue-400">Rare</span>
          </TabsTrigger>
          <TabsTrigger value="epic" data-testid="tab-epic">
            <span className="text-purple-400">Epic</span>
          </TabsTrigger>
          <TabsTrigger value="legendary" data-testid="tab-legendary">
            <span className="text-yellow-400">Legendary</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredEggs.length === 0 ? (
            <Card className="p-12 text-center">
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Easter Eggs Found</h3>
              <p className="text-muted-foreground">
                {activeTab === 'unlocked' 
                  ? "You haven't unlocked any Easter eggs yet. Keep trading to discover hidden achievements!"
                  : `No ${activeTab} Easter eggs available.`
                }
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEggs.map((egg) => {
                const unlock = getEggUnlock(egg.id);
                const prog = getEggProgress(egg.id);
                const isUnlocked = !!unlock;
                const progressPercent = calculateProgressPercentage(egg, prog);
                const isSecret = egg.is_secret && !isUnlocked;

                return (
                  <Card 
                    key={egg.id} 
                    className={`relative overflow-hidden ${isUnlocked ? 'border-2' : ''} ${isUnlocked ? getRarityColor(egg.rarity).split(' ')[1] : ''}`}
                    data-testid={`easter-egg-card-${egg.id}`}
                  >
                    {/* Rarity gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getRarityGradient(egg.rarity)} opacity-50`} />
                    
                    <CardHeader className="relative">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className={getRarityColor(egg.rarity)}>
                          {egg.rarity.toUpperCase()}
                        </Badge>
                        {isUnlocked ? (
                          <Unlock className="h-5 w-5 text-green-400" />
                        ) : (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      
                      <CardTitle className="flex items-center gap-2">
                        {isSecret ? (
                          <>
                            <EyeOff className="h-5 w-5" />
                            <span>???</span>
                          </>
                        ) : (
                          <>
                            <Gem className="h-5 w-5" />
                            <span>{egg.name}</span>
                          </>
                        )}
                      </CardTitle>
                      
                      <CardDescription>
                        {isSecret ? 'Secret Easter Egg - Unlock to reveal' : egg.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="relative space-y-4">
                      {/* Progress bar for locked eggs */}
                      {!isUnlocked && !isSecret && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{Math.round(progressPercent)}%</span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>
                      )}

                      {/* Reward display */}
                      <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
                        <Gift className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          {formatReward(egg.reward_type, egg.reward_value)}
                        </span>
                      </div>

                      {/* Subscriber requirement */}
                      {egg.requires_subscription && (
                        <Badge variant="outline" className="w-full justify-center">
                          <Crown className="h-3 w-3 mr-1" />
                          Subscriber Only
                        </Badge>
                      )}

                      {/* Hints for locked eggs */}
                      {!isUnlocked && showSecrets && egg.hints && egg.hints.length > 0 && (
                        <div className="space-y-2 pt-2 border-t">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Sparkles className="h-4 w-4" />
                            <span>Hints:</span>
                          </div>
                          {egg.hints.map((hint, idx) => (
                            <p key={idx} className="text-xs text-muted-foreground italic">
                              • {hint}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Claim button for unlocked eggs */}
                      {isUnlocked && !unlock.reward_claimed && (
                        <Button 
                          className="w-full"
                          onClick={() => claimRewardMutation.mutate(unlock.id)}
                          disabled={claimRewardMutation.isPending}
                          data-testid={`button-claim-${egg.id}`}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Claim Reward
                        </Button>
                      )}

                      {/* Claimed status */}
                      {isUnlocked && unlock.reward_claimed && (
                        <div className="text-center p-2 bg-green-500/10 rounded-lg">
                          <p className="text-sm text-green-400 font-medium">
                            ✓ Reward Claimed
                          </p>
                          {unlock.reward_claimed_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(unlock.reward_claimed_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
