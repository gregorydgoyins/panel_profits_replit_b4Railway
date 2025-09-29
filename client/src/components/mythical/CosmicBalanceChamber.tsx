import { useState, useEffect } from 'react';
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Scale, TrendingUp, TrendingDown, Clock, Star, Zap, Shield, 
  Crown, Heart, Flame, Users, Compass, Eye, Sparkles, 
  BarChart3, Calendar, Gauge, Target, Waves, Moon, Sun,
  ChevronRight, ChevronDown, Info, AlertTriangle, CheckCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useHouseTheme } from '@/hooks/useHouseTheme';

interface DetailedKarmaAction {
  id: string;
  actionType: string;
  actionCategory: string;
  karmaChange: number;
  lawfulChaoticImpact: number;
  goodEvilImpact: number;
  tradingBehaviorPattern: string;
  communityInteraction: string;
  riskTakingBehavior: string;
  consequenceSeverity: string;
  mysticalDescription: string;
  houseAlignmentBonus: number;
  timeOfDay: string;
  createdAt: string;
}

interface TradingConsequence {
  id: string;
  consequenceType: string;
  consequenceCategory: string;
  modifierValue: number;
  modifierType: string;
  impactDescription: string;
  mysticalFlavor: string;
  isTemporary: boolean;
  durationMinutes?: number;
  expiresAt?: string;
  stacksWithOthers: boolean;
  resultingOutcome: string;
  createdAt: string;
}

interface AlignmentThreshold {
  id: string;
  thresholdName: string;
  cosmicTitle: string;
  mysticalDescription: string;
  minLawfulChaotic: number;
  maxLawfulChaotic: number;
  minGoodEvil: number;
  maxGoodEvil: number;
  minKarma: number;
  maxKarma: number;
  tradingBonuses: Record<string, number>;
  isActive: boolean;
}

interface CosmicBalanceChamberProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CosmicBalanceChamber({ isOpen, onClose }: CosmicBalanceChamberProps) {
  const { user } = useAuth();
  const { getHouseTheme } = useHouseTheme();
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month' | 'all'>('week');
  const [cosmicEnergy, setCosmicEnergy] = useState(0);

  // Cosmic energy animation
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCosmicEnergy(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Get user's detailed karma actions
  const { data: karmaActions, isLoading: actionsLoading } = useQuery<DetailedKarmaAction[]>({
    queryKey: ['/api/karma/detailed-actions', user?.id, selectedTimeframe],
    enabled: !!user && isOpen,
    staleTime: 30000,
  });

  // Get active trading consequences
  const { data: consequences, isLoading: consequencesLoading } = useQuery<TradingConsequence[]>({
    queryKey: ['/api/karma/consequences', user?.id],
    enabled: !!user && isOpen,
    refetchInterval: 15000,
  });

  // Get alignment thresholds
  const { data: thresholds, isLoading: thresholdsLoading } = useQuery<AlignmentThreshold[]>({
    queryKey: ['/api/karma/thresholds', user?.id],
    enabled: !!user && isOpen,
    staleTime: 2 * 60 * 1000,
  });

  // Get current alignment data
  const { data: alignment } = useQuery({
    queryKey: ['/api/karma/alignment', user?.id],
    enabled: !!user && isOpen,
    refetchInterval: 30000,
  });

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  if (!isOpen) return null;

  // Calculate karma flow statistics
  const karmaStats = karmaActions ? {
    totalActions: karmaActions.length,
    positiveActions: karmaActions.filter(a => a.karmaChange > 0).length,
    negativeActions: karmaActions.filter(a => a.karmaChange < 0).length,
    totalKarmaGained: karmaActions.filter(a => a.karmaChange > 0).reduce((sum, a) => sum + a.karmaChange, 0),
    totalKarmaLost: Math.abs(karmaActions.filter(a => a.karmaChange < 0).reduce((sum, a) => sum + a.karmaChange, 0)),
    averageKarmaPerAction: karmaActions.length > 0 ? karmaActions.reduce((sum, a) => sum + a.karmaChange, 0) / karmaActions.length : 0
  } : null;

  // Group consequences by category
  const consequencesByCategory = consequences?.reduce((groups, consequence) => {
    const category = consequence.consequenceCategory;
    if (!groups[category]) groups[category] = [];
    groups[category].push(consequence);
    return groups;
  }, {} as Record<string, TradingConsequence[]>) || {};

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-purple-500/30 overflow-hidden relative">
        
        {/* Cosmic Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"
            style={{
              transform: `translate(-50%, -50%) rotate(${cosmicEnergy}deg)`,
            }}
          />
          <div 
            className="absolute top-3/4 right-1/4 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl"
            style={{
              transform: `translate(50%, 50%) rotate(${-cosmicEnergy}deg)`,
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,69,19,0.1)_0%,transparent_50%)]" />
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-purple-500/20 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Scale className="h-8 w-8 text-purple-400" />
                <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-md animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100" data-testid="title-cosmic-balance-chamber">
                  Cosmic Balance Chamber
                </h2>
                <p className="text-purple-300/70 text-sm">
                  Explore the intricate mysteries of your karmic essence and cosmic alignment
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {(['day', 'week', 'month', 'all'] as const).map((period) => (
                  <Button
                    key={period}
                    variant={selectedTimeframe === period ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedTimeframe(period)}
                    className="text-xs text-purple-200 hover:text-purple-100"
                    data-testid={`button-timeframe-${period}`}
                  >
                    {period}
                  </Button>
                ))}
              </div>
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                data-testid="button-close-chamber"
              >
                ✕
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 p-6 h-full overflow-hidden">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-purple-500/20">
              <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="actions" data-testid="tab-actions">Karma Flow</TabsTrigger>
              <TabsTrigger value="consequences" data-testid="tab-consequences">Active Effects</TabsTrigger>
              <TabsTrigger value="thresholds" data-testid="tab-thresholds">Thresholds</TabsTrigger>
              <TabsTrigger value="insights" data-testid="tab-insights">Cosmic Insights</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="flex-1 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                
                {/* Alignment Overview */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Current Alignment Status */}
                  <Card className="bg-slate-800/50 border-purple-500/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-purple-100">
                          <Compass className="h-5 w-5 text-purple-400" />
                          Current Cosmic Alignment
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSection('alignment')}
                          className="text-purple-300 hover:text-purple-200"
                        >
                          {expandedSections.has('alignment') ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      </div>
                    </CardHeader>
                    {expandedSections.has('alignment') && (
                      <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-purple-300/70">Lawful ↔ Chaotic</span>
                                <span className="font-medium text-purple-100">
                                  {alignment?.lawfulChaoticAlignment?.toFixed(1) || '0.0'}
                                </span>
                              </div>
                              <Progress 
                                value={((parseFloat(alignment?.lawfulChaoticAlignment || '0') + 100) / 2)} 
                                className="h-2 bg-slate-700" 
                              />
                              <div className="flex justify-between text-xs text-purple-300/60 mt-1">
                                <span>Chaotic</span>
                                <span>Neutral</span>
                                <span>Lawful</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-purple-300/70">Good ↔ Evil</span>
                                <span className="font-medium text-purple-100">
                                  {alignment?.goodEvilAlignment?.toFixed(1) || '0.0'}
                                </span>
                              </div>
                              <Progress 
                                value={((parseFloat(alignment?.goodEvilAlignment || '0') + 100) / 2)} 
                                className="h-2 bg-slate-700" 
                              />
                              <div className="flex justify-between text-xs text-purple-300/60 mt-1">
                                <span>Evil</span>
                                <span>Neutral</span>
                                <span>Good</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-100" data-testid="text-karma-value">
                                {alignment?.karma || 0}
                              </div>
                              <div className="text-sm text-purple-300/70">Total Karma</div>
                            </div>
                            
                            {alignment?.houseId && (
                              <div className="text-center">
                                <Badge 
                                  variant="outline" 
                                  className={`text-${getHouseTheme(alignment.houseId).primaryColor} border-current/30 bg-current/5`}
                                >
                                  <Crown className="w-4 h-4" />
                                  House {alignment.houseId}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Karma Flow Statistics */}
                  {karmaStats && (
                    <Card className="bg-slate-800/50 border-purple-500/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-purple-100">
                            <BarChart3 className="h-5 w-5 text-purple-400" />
                            Karma Flow Analysis ({selectedTimeframe})
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSection('karma-flow')}
                            className="text-purple-300 hover:text-purple-200"
                          >
                            {expandedSections.has('karma-flow') ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </Button>
                        </div>
                      </CardHeader>
                      {expandedSections.has('karma-flow') && (
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                              <div className="text-lg font-medium text-purple-100">{karmaStats.totalActions}</div>
                              <div className="text-xs text-purple-300/70">Total Actions</div>
                            </div>
                            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                              <div className="text-lg font-medium text-green-300">+{karmaStats.totalKarmaGained}</div>
                              <div className="text-xs text-green-300/70">Karma Gained</div>
                            </div>
                            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                              <div className="text-lg font-medium text-red-300">-{karmaStats.totalKarmaLost}</div>
                              <div className="text-xs text-red-300/70">Karma Lost</div>
                            </div>
                            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                              <div className="text-lg font-medium text-purple-100">
                                {karmaStats.averageKarmaPerAction.toFixed(1)}
                              </div>
                              <div className="text-xs text-purple-300/70">Avg per Action</div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )}
                </div>

                {/* Sidebar - Active Effects */}
                <div className="space-y-6">
                  
                  {/* Active Consequences */}
                  <Card className="bg-slate-800/50 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-100">
                        <Zap className="h-5 w-5 text-purple-400" />
                        Active Cosmic Effects
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-48">
                        {consequencesLoading ? (
                          <div className="text-center text-purple-300/60 py-4">
                            Consulting cosmic forces...
                          </div>
                        ) : consequences?.length ? (
                          <div className="space-y-3">
                            {consequences.slice(0, 5).map((consequence, index) => (
                              <div 
                                key={consequence.id} 
                                className="p-3 bg-slate-700/30 rounded-lg border border-purple-500/10"
                                data-testid={`consequence-${index}`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className={`w-2 h-2 rounded-full ${
                                    consequence.resultingOutcome === 'success' ? 'bg-green-400' :
                                    consequence.resultingOutcome === 'blessing' ? 'bg-blue-400' :
                                    consequence.resultingOutcome === 'protection' ? 'bg-yellow-400' :
                                    'bg-red-400'
                                  }`} />
                                  <div className="text-sm font-medium text-purple-100 capitalize">
                                    {consequence.consequenceType.replace(/_/g, ' ')}
                                  </div>
                                </div>
                                <div className="text-xs text-purple-300/80 mb-1">
                                  {consequence.impactDescription}
                                </div>
                                <div className="text-xs text-purple-300/60 italic">
                                  {consequence.mysticalFlavor}
                                </div>
                                {consequence.isTemporary && consequence.expiresAt && (
                                  <div className="text-xs text-yellow-300/70 mt-1">
                                    Expires: {new Date(consequence.expiresAt).toLocaleTimeString()}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-purple-300/60 py-4">
                            No active cosmic effects
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Alignment Stability Meter */}
                  <Card className="bg-slate-800/50 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-100">
                        <Gauge className="h-5 w-5 text-purple-400" />
                        Cosmic Stability
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="relative w-24 h-24 mx-auto mb-3">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="rgb(100 116 139)"
                                strokeWidth="8"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="rgb(147 51 234)"
                                strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 45 * 0.75} ${2 * Math.PI * 45}`}
                                strokeLinecap="round"
                                className="transition-all duration-1000"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-purple-100">75%</div>
                                <div className="text-xs text-purple-300/70">Stable</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-purple-300/80 text-center">
                          Your cosmic alignment shows strong stability with gentle fluctuations in the mystical currents.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Karma Actions Tab */}
            <TabsContent value="actions" className="flex-1 mt-6">
              <Card className="bg-slate-800/50 border-purple-500/20 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-100">
                    <Calendar className="h-5 w-5 text-purple-400" />
                    Karma Action Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    {actionsLoading ? (
                      <div className="text-center text-purple-300/60 py-8">
                        Analyzing karmic threads...
                      </div>
                    ) : karmaActions?.length ? (
                      <div className="space-y-4">
                        {karmaActions.map((action, index) => (
                          <div 
                            key={action.id} 
                            className="flex gap-4 p-4 rounded-lg bg-slate-700/30 border border-purple-500/10 hover:bg-slate-700/50 transition-colors"
                            data-testid={`karma-action-${index}`}
                          >
                            <div className="flex-shrink-0 pt-1">
                              <div className={`w-3 h-3 rounded-full ${
                                action.karmaChange > 0 ? 'bg-green-400' : 
                                action.karmaChange < 0 ? 'bg-red-400' : 'bg-gray-400'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs border-current/30 ${
                                    action.consequenceSeverity === 'legendary' ? 'text-amber-400 bg-amber-400/10' :
                                    action.consequenceSeverity === 'critical' ? 'text-purple-400 bg-purple-400/10' :
                                    action.consequenceSeverity === 'major' ? 'text-blue-400 bg-blue-400/10' :
                                    action.consequenceSeverity === 'moderate' ? 'text-green-400 bg-green-400/10' :
                                    'text-gray-400 bg-gray-400/10'
                                  }`}
                                >
                                  {action.consequenceSeverity}
                                </Badge>
                                <span className="text-xs text-purple-300/60">
                                  {new Date(action.createdAt).toLocaleDateString()} at {action.timeOfDay}
                                </span>
                              </div>
                              
                              <div className="text-sm text-purple-100 mb-1 capitalize">
                                {action.actionType.replace(/_/g, ' ')}
                              </div>
                              
                              <div className="text-xs text-purple-300/80 mb-2">
                                {action.mysticalDescription}
                              </div>
                              
                              <div className="grid grid-cols-3 gap-3 text-xs">
                                <div>
                                  <span className="text-purple-300/60">Karma: </span>
                                  <span className={`font-medium ${
                                    action.karmaChange > 0 ? 'text-green-300' : 
                                    action.karmaChange < 0 ? 'text-red-300' : 'text-gray-300'
                                  }`}>
                                    {action.karmaChange > 0 ? '+' : ''}{action.karmaChange}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-purple-300/60">L/C: </span>
                                  <span className="font-medium text-purple-100">
                                    {action.lawfulChaoticImpact > 0 ? '+' : ''}{action.lawfulChaoticImpact.toFixed(1)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-purple-300/60">G/E: </span>
                                  <span className="font-medium text-purple-100">
                                    {action.goodEvilImpact > 0 ? '+' : ''}{action.goodEvilImpact.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex gap-2 mt-2 text-xs">
                                <Badge variant="secondary" className="text-xs">{action.tradingBehaviorPattern}</Badge>
                                <Badge variant="secondary" className="text-xs">{action.communityInteraction}</Badge>
                                <Badge variant="secondary" className="text-xs">{action.riskTakingBehavior}</Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-purple-300/60 py-8">
                        No karma actions recorded in this timeframe
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Active Consequences Tab */}
            <TabsContent value="consequences" className="flex-1 mt-6">
              <Card className="bg-slate-800/50 border-purple-500/20 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-100">
                    <Star className="h-5 w-5 text-purple-400" />
                    Active Trading Consequences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {consequencesLoading ? (
                    <div className="text-center text-purple-300/60 py-8">
                      Analyzing cosmic effects...
                    </div>
                  ) : Object.keys(consequencesByCategory).length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(consequencesByCategory).map(([category, categoryConsequences]) => (
                        <div key={category}>
                          <h4 className="text-lg font-medium text-purple-100 mb-3 capitalize">
                            {category.replace(/_/g, ' ')} Effects
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categoryConsequences.map((consequence, index) => (
                              <div 
                                key={consequence.id}
                                className="p-4 bg-slate-700/30 rounded-lg border border-purple-500/10"
                                data-testid={`active-consequence-${category}-${index}`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                      consequence.resultingOutcome === 'success' ? 'bg-green-400' :
                                      consequence.resultingOutcome === 'blessing' ? 'bg-blue-400' :
                                      consequence.resultingOutcome === 'protection' ? 'bg-yellow-400' :
                                      'bg-red-400'
                                    }`} />
                                    <div className="text-sm font-medium text-purple-100 capitalize">
                                      {consequence.consequenceType.replace(/_/g, ' ')}
                                    </div>
                                  </div>
                                  <Badge 
                                    variant={consequence.isTemporary ? 'destructive' : 'default'}
                                    className="text-xs"
                                  >
                                    {consequence.isTemporary ? 'Temporary' : 'Permanent'}
                                  </Badge>
                                </div>
                                
                                <div className="text-sm text-purple-100 mb-2">
                                  {consequence.impactDescription}
                                </div>
                                
                                <div className="text-xs text-purple-300/80 italic mb-3">
                                  {consequence.mysticalFlavor}
                                </div>
                                
                                <div className="flex justify-between items-center text-xs">
                                  <div>
                                    <span className="text-purple-300/60">Modifier: </span>
                                    <span className="font-medium text-purple-100">
                                      {consequence.modifierType === 'multiplier' ? `${(consequence.modifierValue * 100).toFixed(1)}%` : 
                                       consequence.modifierType === 'bonus' ? `+${(consequence.modifierValue * 100).toFixed(1)}%` :
                                       consequence.modifierValue.toFixed(2)}
                                    </span>
                                  </div>
                                  {consequence.isTemporary && consequence.expiresAt && (
                                    <div className="text-yellow-300/70">
                                      Expires: {new Date(consequence.expiresAt).toLocaleTimeString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-purple-300/60 py-8">
                      No active trading consequences. Your cosmic alignment has not yet manifested trading effects.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alignment Thresholds Tab */}
            <TabsContent value="thresholds" className="flex-1 mt-6">
              <Card className="bg-slate-800/50 border-purple-500/20 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-100">
                    <Target className="h-5 w-5 text-purple-400" />
                    Cosmic Alignment Thresholds
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    {thresholdsLoading ? (
                      <div className="text-center text-purple-300/60 py-8">
                        Consulting the cosmic archives...
                      </div>
                    ) : thresholds?.length ? (
                      <div className="space-y-4">
                        {thresholds.map((threshold, index) => (
                          <div 
                            key={threshold.id}
                            className="p-4 bg-slate-700/30 rounded-lg border border-purple-500/10"
                            data-testid={`threshold-${index}`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="text-lg font-medium text-purple-100">
                                  {threshold.cosmicTitle}
                                </div>
                                <div className="text-sm text-purple-300/80">
                                  {threshold.thresholdName}
                                </div>
                              </div>
                              <Badge 
                                variant={threshold.isActive ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {threshold.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-purple-200 mb-3 italic">
                              {threshold.mysticalDescription}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                              <div>
                                <div className="text-purple-300/60">Requirements:</div>
                                <div className="space-y-1 mt-1">
                                  <div>L/C: {threshold.minLawfulChaotic} to {threshold.maxLawfulChaotic}</div>
                                  <div>G/E: {threshold.minGoodEvil} to {threshold.maxGoodEvil}</div>
                                  <div>Karma: {threshold.minKarma}+</div>
                                </div>
                              </div>
                              <div>
                                <div className="text-purple-300/60">Trading Bonuses:</div>
                                <div className="space-y-1 mt-1">
                                  {Object.entries(threshold.tradingBonuses).map(([bonus, value]) => (
                                    <div key={bonus}>
                                      {bonus}: +{(Number(value) * 100).toFixed(1)}%
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-purple-300/60 py-8">
                        No alignment thresholds configured
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cosmic Insights Tab */}
            <TabsContent value="insights" className="flex-1 mt-6">
              <Card className="bg-slate-800/50 border-purple-500/20 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-100">
                    <Eye className="h-5 w-5 text-purple-400" />
                    Cosmic Insights & Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Behavioral Analysis */}
                    <div className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                      <h4 className="text-lg font-medium text-purple-100 mb-3 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Behavioral Patterns
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <div className="text-purple-300/70 mb-1">Dominant Trading Style:</div>
                          <div className="text-purple-100">Balanced Explorer</div>
                        </div>
                        <div>
                          <div className="text-purple-300/70 mb-1">Risk Profile:</div>
                          <div className="text-purple-100">Moderate Risk Taker</div>
                        </div>
                        <div>
                          <div className="text-purple-300/70 mb-1">Social Tendency:</div>
                          <div className="text-purple-100">Community Oriented</div>
                        </div>
                      </div>
                    </div>

                    {/* Cosmic Predictions */}
                    <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
                      <h4 className="text-lg font-medium text-amber-100 mb-3 flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Alignment Predictions
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <div className="text-amber-300/70 mb-1">Trending Toward:</div>
                          <div className="text-amber-100">Lawful Good</div>
                        </div>
                        <div>
                          <div className="text-amber-300/70 mb-1">Next Threshold:</div>
                          <div className="text-amber-100">Guardian of Order (78% complete)</div>
                        </div>
                        <div>
                          <div className="text-amber-300/70 mb-1">Estimated Time:</div>
                          <div className="text-amber-100">3-5 trading sessions</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mystical Guidance */}
                  <div className="p-6 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-lg border border-purple-500/20">
                    <h4 className="text-xl font-medium text-purple-100 mb-4 flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-purple-400" />
                      The Cosmic Voices Speak
                    </h4>
                    <div className="text-purple-200 leading-relaxed italic text-lg">
                      "Your karmic path shows the stability of mountain stone, yet carries the flowing 
                      wisdom of ancient streams. The trading winds favor those who balance bold action 
                      with thoughtful restraint. Continue your journey of balanced exploration, for the 
                      cosmic forces recognize your growing harmony with both community and solitude."
                    </div>
                    <div className="mt-4 text-purple-300/60 text-sm">
                      — Oracle of the Cosmic Balance Chamber
                    </div>
                  </div>

                  {/* Recommended Actions */}
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-purple-500/10">
                    <h4 className="text-lg font-medium text-purple-100 mb-3">
                      Cosmic Recommendations
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-purple-200">Continue diversified trading to strengthen elemental balance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                        <span className="text-purple-200">Engage in community trading for alignment bonuses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <span className="text-purple-200">Avoid aggressive speculation to maintain karmic stability</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}