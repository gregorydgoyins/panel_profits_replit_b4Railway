import { useState, useEffect } from 'react';
import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Gem, Eye, Sparkles, Balance, Clock, Shield, BookOpen, Crown,
  Flame, Users, Zap, TrendingUp, TrendingDown, Minus, Star,
  Swords, Heart, Scale, Moon, Sun, Compass, Orb
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useHouseTheme } from '@/hooks/useHouseTheme';

interface AlignmentData {
  lawfulChaoticAlignment: number;
  goodEvilAlignment: number;
  karma: number;
  alignmentRevealed: boolean;
  houseId?: string;
  alignmentLastUpdated: string;
}

interface AlignmentHistory {
  id: string;
  previousLawfulChaotic: number;
  previousGoodEvil: number;
  newLawfulChaotic: number;
  newGoodEvil: number;
  alignmentShiftMagnitude: number;
  triggeringActionType: string;
  karmaAtTimeOfShift: number;
  alignmentPhase: string;
  cosmicEvent?: string;
  prophecyUnlocked?: string;
  significanceLevel: string;
  recordedAt: string;
}

interface KarmicProfile {
  id: string;
  currentAlignmentThreshold?: string;
  alignmentStability: number;
  alignmentTrend: string;
  dominantBehaviorPattern?: string;
  tradingPersonality?: string;
  cosmicResonance: number;
  divineFavor: number;
  shadowInfluence: number;
  houseAlignmentCompatibility: number;
  optimalHouseId?: string;
  alignmentConflictLevel: string;
  predictedAlignmentDirection?: string;
  nextThresholdDistance: number;
}

interface KarmaScryingChamberProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KarmaScryingChamber({ isOpen, onClose }: KarmaScryingChamberProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { getCurrentHouseColorClass, getHouseIcon } = useHouseTheme();
  
  const [mysticalEnergy, setMysticalEnergy] = useState(0);
  const [revealingAlignment, setRevealingAlignment] = useState(false);
  const [alignmentRevealed, setAlignmentRevealed] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('month');

  // Mystical energy animation
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setMysticalEnergy(prev => (prev + 2) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Get user's alignment data
  const { data: alignmentData, isLoading: alignmentLoading } = useQuery<AlignmentData>({
    queryKey: ['/api/karma/alignment', user?.id],
    enabled: !!user && isOpen,
    refetchInterval: 30000,
  });

  // Get alignment history
  const { data: alignmentHistory, isLoading: historyLoading } = useQuery<AlignmentHistory[]>({
    queryKey: ['/api/karma/alignment-history', user?.id, selectedTimeframe],
    enabled: !!user && isOpen,
    staleTime: 2 * 60 * 1000,
  });

  // Get karmic profile
  const { data: karmicProfile, isLoading: profileLoading } = useQuery<KarmicProfile>({
    queryKey: ['/api/karma/profile', user?.id],
    enabled: !!user && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // Reveal alignment mutation
  const revealAlignmentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/karma/reveal-alignment');
      return response.json();
    },
    onSuccess: () => {
      setAlignmentRevealed(true);
      toast({
        title: "Alignment Revealed!",
        description: "The cosmic forces have unveiled your true nature. The mysteries of your karmic path are now visible.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/karma/alignment'] });
    },
    onError: (error: any) => {
      toast({
        title: "Scrying Failed",
        description: error.message || "The cosmic energies are disturbed. Try again later.",
        variant: "destructive",
      });
    },
  });

  const handleRevealAlignment = async () => {
    if (!alignmentData?.alignmentRevealed && !revealingAlignment) {
      setRevealingAlignment(true);
      
      // Mystical reveal animation
      setTimeout(() => {
        revealAlignmentMutation.mutate();
        setRevealingAlignment(false);
      }, 3000);
    }
  };

  if (!isOpen) return null;

  const isRevealed = alignmentData?.alignmentRevealed || alignmentRevealed;
  const lawfulChaotic = alignmentData?.lawfulChaoticAlignment || 0;
  const goodEvil = alignmentData?.goodEvilAlignment || 0;
  const karma = alignmentData?.karma || 0;

  // Calculate alignment quadrant and description
  const getAlignmentQuadrant = () => {
    if (lawfulChaotic > 25 && goodEvil > 25) return { name: 'Lawful Good', icon: Shield, color: 'text-blue-400', description: 'Guardian of Sacred Order' };
    if (lawfulChaotic > 25 && goodEvil < -25) return { name: 'Lawful Evil', icon: Crown, color: 'text-purple-400', description: 'Tyrant of Rigid Control' };
    if (lawfulChaotic < -25 && goodEvil > 25) return { name: 'Chaotic Good', icon: Heart, color: 'text-green-400', description: 'Rebel of Benevolent Freedom' };
    if (lawfulChaotic < -25 && goodEvil < -25) return { name: 'Chaotic Evil', icon: Flame, color: 'text-red-400', description: 'Agent of Destructive Chaos' };
    if (lawfulChaotic > 25) return { name: 'Lawful Neutral', icon: Scale, color: 'text-gray-400', description: 'Keeper of Cosmic Order' };
    if (lawfulChaotic < -25) return { name: 'Chaotic Neutral', icon: Zap, color: 'text-yellow-400', description: 'Walker of Unpredictable Paths' };
    if (goodEvil > 25) return { name: 'Neutral Good', icon: Star, color: 'text-cyan-400', description: 'Beacon of Balanced Compassion' };
    if (goodEvil < -25) return { name: 'Neutral Evil', icon: Moon, color: 'text-indigo-400', description: 'Shadow of Selfish Ambition' };
    return { name: 'True Neutral', icon: Balance, color: 'text-amber-400', description: 'Embodiment of Perfect Balance' };
  };

  const alignment = getAlignmentQuadrant();
  const AlignmentIcon = alignment.icon;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-amber-500/30 overflow-hidden relative">
        
        {/* Mystical Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl"
            style={{
              transform: `translate(-50%, -50%) rotate(${mysticalEnergy}deg)`,
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.1)_0%,transparent_50%)]" />
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-amber-500/20 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Gem className="h-8 w-8 text-amber-400" />
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-amber-100" data-testid="title-scrying-chamber">
                  Sacred Karma Scrying Chamber
                </h2>
                <p className="text-amber-300/70 text-sm">
                  Peer into the cosmic tapestry of your trading destiny
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
              data-testid="button-close-chamber"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 p-6 h-full overflow-hidden">
          
          {/* Alignment Not Revealed State */}
          {!isRevealed && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 blur-xl" />
                <Eye 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-amber-400"
                  style={{
                    filter: revealingAlignment ? 'drop-shadow(0 0 20px rgba(251,191,36,0.8))' : 'none',
                  }}
                />
              </div>
              
              <h3 className="text-3xl font-bold text-amber-100 mb-4">
                The Veil of Mystery Shrouds Your Alignment
              </h3>
              
              <p className="text-amber-300/80 max-w-2xl mb-8 leading-relaxed">
                Your karmic essence remains hidden in the cosmic shadows. Only by gazing into the Sacred 
                Scrying Crystal can you unveil the true nature of your trading alignment. This ancient 
                ritual will reveal how the forces of Law and Chaos, Good and Evil, flow through your 
                market actions.
              </p>

              <div className="mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  <span className="text-amber-200">Current Karma: {karma}</span>
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </div>
                
                {alignmentData?.houseId && (
                  <Badge 
                    variant="outline" 
                    className={`${getCurrentHouseColorClass(alignmentData.houseId)} border-current/30 bg-current/5`}
                  >
                    {getHouseIcon(alignmentData.houseId)} 
                    House Affiliation Detected
                  </Badge>
                )}
              </div>

              <Button
                onClick={handleRevealAlignment}
                disabled={revealingAlignment || revealAlignmentMutation.isPending}
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white border-0 text-lg px-8 py-6 relative overflow-hidden group"
                data-testid="button-reveal-alignment"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Gem className="mr-2 h-6 w-6" />
                {revealingAlignment ? 'Scrying the Cosmic Threads...' : 'Begin Sacred Scrying Ritual'}
              </Button>

              {revealingAlignment && (
                <div className="mt-6 text-amber-300/60 italic animate-pulse">
                  The ancient powers stir... revealing the hidden truths of your karmic destiny...
                </div>
              )}
            </div>
          )}

          {/* Alignment Revealed State */}
          {isRevealed && (
            <Tabs defaultValue="alignment" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-amber-500/20">
                <TabsTrigger value="alignment" data-testid="tab-alignment">Alignment</TabsTrigger>
                <TabsTrigger value="history" data-testid="tab-history">History</TabsTrigger>
                <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
                <TabsTrigger value="prophecy" data-testid="tab-prophecy">Prophecy</TabsTrigger>
              </TabsList>

              {/* Alignment Overview */}
              <TabsContent value="alignment" className="flex-1 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  
                  {/* Alignment Compass */}
                  <Card className="bg-slate-800/50 border-amber-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-amber-100">
                        <Compass className="h-5 w-5 text-amber-400" />
                        Cosmic Alignment Compass
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative w-full aspect-square max-w-sm mx-auto">
                        {/* Alignment Grid */}
                        <svg viewBox="-110 -110 220 220" className="w-full h-full">
                          {/* Grid Lines */}
                          <defs>
                            <radialGradient id="alignmentGlow" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="rgba(251,191,36,0.3)" />
                              <stop offset="100%" stopColor="rgba(251,191,36,0.1)" />
                            </radialGradient>
                          </defs>
                          
                          {/* Background Circle */}
                          <circle cx="0" cy="0" r="100" fill="url(#alignmentGlow)" stroke="rgba(251,191,36,0.3)" strokeWidth="1" />
                          
                          {/* Axis Lines */}
                          <line x1="-100" y1="0" x2="100" y2="0" stroke="rgba(251,191,36,0.4)" strokeWidth="2" />
                          <line x1="0" y1="-100" x2="0" y2="100" stroke="rgba(251,191,36,0.4)" strokeWidth="2" />
                          
                          {/* Quadrant Labels */}
                          <text x="-80" y="-80" fill="rgba(251,191,36,0.7)" fontSize="10" textAnchor="middle">CG</text>
                          <text x="80" y="-80" fill="rgba(251,191,36,0.7)" fontSize="10" textAnchor="middle">LG</text>
                          <text x="-80" y="90" fill="rgba(251,191,36,0.7)" fontSize="10" textAnchor="middle">CE</text>
                          <text x="80" y="90" fill="rgba(251,191,36,0.7)" fontSize="10" textAnchor="middle">LE</text>
                          
                          {/* Axis Labels */}
                          <text x="105" y="5" fill="rgba(251,191,36,0.8)" fontSize="12" textAnchor="start">Lawful</text>
                          <text x="-105" y="5" fill="rgba(251,191,36,0.8)" fontSize="12" textAnchor="end">Chaotic</text>
                          <text x="0" y="-105" fill="rgba(251,191,36,0.8)" fontSize="12" textAnchor="middle">Good</text>
                          <text x="0" y="115" fill="rgba(251,191,36,0.8)" fontSize="12" textAnchor="middle">Evil</text>
                          
                          {/* User Position */}
                          <circle 
                            cx={lawfulChaotic} 
                            cy={-goodEvil} 
                            r="8" 
                            fill="rgba(251,191,36,0.9)" 
                            stroke="white" 
                            strokeWidth="2"
                            className="animate-pulse"
                          />
                          
                          {/* Position Trail */}
                          {alignmentHistory?.slice(0, 5).map((history, index) => (
                            <circle
                              key={history.id}
                              cx={history.newLawfulChaotic}
                              cy={-history.newGoodEvil}
                              r={6 - index}
                              fill={`rgba(251,191,36,${0.3 - index * 0.05})`}
                              className="transition-all duration-500"
                            />
                          ))}
                        </svg>
                      </div>
                      
                      {/* Alignment Details */}
                      <div className="mt-6 text-center space-y-4">
                        <div className="flex items-center justify-center gap-3">
                          <AlignmentIcon className={`h-8 w-8 ${alignment.color}`} />
                          <div>
                            <div className="text-xl font-bold text-amber-100" data-testid="text-alignment-name">
                              {alignment.name}
                            </div>
                            <div className="text-sm text-amber-300/70">
                              {alignment.description}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-amber-300/70">Law ↔ Chaos</div>
                            <div className="font-medium text-amber-100">{lawfulChaotic.toFixed(1)}</div>
                          </div>
                          <div>
                            <div className="text-amber-300/70">Good ↔ Evil</div>
                            <div className="font-medium text-amber-100">{goodEvil.toFixed(1)}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Karmic Status */}
                  <div className="space-y-6">
                    
                    {/* Karma Overview */}
                    <Card className="bg-slate-800/50 border-amber-500/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-100">
                          <Orb className="h-5 w-5 text-amber-400" />
                          Karmic Essence
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-amber-100" data-testid="text-karma-value">
                            {karma}
                          </div>
                          <div className="text-sm text-amber-300/70">Total Karma</div>
                        </div>
                        
                        {karmicProfile && (
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="text-center">
                              <div className="text-lg font-medium text-blue-300">
                                {karmicProfile.cosmicResonance.toFixed(0)}
                              </div>
                              <div className="text-xs text-blue-300/70">Resonance</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-medium text-green-300">
                                {karmicProfile.divineFavor.toFixed(0)}
                              </div>
                              <div className="text-xs text-green-300/70">Divine Favor</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-medium text-red-300">
                                {karmicProfile.shadowInfluence.toFixed(0)}
                              </div>
                              <div className="text-xs text-red-300/70">Shadow</div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* House Compatibility */}
                    {alignmentData?.houseId && karmicProfile && (
                      <Card className="bg-slate-800/50 border-amber-500/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-amber-100">
                            {getHouseIcon(alignmentData.houseId)}
                            House Alignment
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-amber-300/70">Compatibility</span>
                            <span className="font-medium text-amber-100">
                              {karmicProfile.houseAlignmentCompatibility.toFixed(0)}%
                            </span>
                          </div>
                          
                          <Progress 
                            value={karmicProfile.houseAlignmentCompatibility} 
                            className="h-2 bg-slate-700"
                          />
                          
                          <div className="text-sm">
                            <span className="text-amber-300/70">Conflict Level: </span>
                            <Badge 
                              variant={karmicProfile.alignmentConflictLevel === 'none' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {karmicProfile.alignmentConflictLevel}
                            </Badge>
                          </div>
                          
                          {karmicProfile.optimalHouseId && karmicProfile.optimalHouseId !== alignmentData.houseId && (
                            <div className="text-xs text-amber-300/60 italic">
                              Optimal house: {karmicProfile.optimalHouseId}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Alignment Stability */}
                    {karmicProfile && (
                      <Card className="bg-slate-800/50 border-amber-500/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-amber-100">
                            <Balance className="h-5 w-5 text-amber-400" />
                            Cosmic Stability
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-amber-300/70">Stability</span>
                            <span className="font-medium text-amber-100">
                              {karmicProfile.alignmentStability.toFixed(0)}%
                            </span>
                          </div>
                          
                          <Progress 
                            value={karmicProfile.alignmentStability} 
                            className="h-2 bg-slate-700"
                          />
                          
                          <div className="text-sm space-y-1">
                            <div>
                              <span className="text-amber-300/70">Trend: </span>
                              <Badge variant="outline" className="text-xs border-amber-500/30">
                                {karmicProfile.alignmentTrend}
                              </Badge>
                            </div>
                            
                            {karmicProfile.predictedAlignmentDirection && (
                              <div>
                                <span className="text-amber-300/70">Direction: </span>
                                <span className="text-amber-100 text-xs">
                                  {karmicProfile.predictedAlignmentDirection.replace(/_/g, ' ')}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Alignment History */}
              <TabsContent value="history" className="flex-1 mt-6">
                <Card className="bg-slate-800/50 border-amber-500/20 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-amber-100">
                        <Clock className="h-5 w-5 text-amber-400" />
                        Cosmic Chronicle
                      </CardTitle>
                      <div className="flex gap-2">
                        {(['week', 'month', 'all'] as const).map((period) => (
                          <Button
                            key={period}
                            variant={selectedTimeframe === period ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTimeframe(period)}
                            className="text-xs"
                            data-testid={`button-timeframe-${period}`}
                          >
                            {period}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      {historyLoading ? (
                        <div className="text-center text-amber-300/60 py-8">
                          Consulting the cosmic records...
                        </div>
                      ) : alignmentHistory?.length ? (
                        <div className="space-y-4">
                          {alignmentHistory.map((event, index) => (
                            <div 
                              key={event.id} 
                              className="flex gap-4 p-4 rounded-lg bg-slate-700/30 border border-amber-500/10"
                              data-testid={`history-event-${index}`}
                            >
                              <div className="flex-shrink-0">
                                <div className={`w-3 h-3 rounded-full mt-2 ${
                                  event.significanceLevel === 'legendary' ? 'bg-amber-400' :
                                  event.significanceLevel === 'critical' ? 'bg-purple-400' :
                                  event.significanceLevel === 'major' ? 'bg-blue-400' :
                                  event.significanceLevel === 'moderate' ? 'bg-green-400' :
                                  'bg-gray-400'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs border-current/30 ${
                                      event.significanceLevel === 'legendary' ? 'text-amber-400 bg-amber-400/10' :
                                      event.significanceLevel === 'critical' ? 'text-purple-400 bg-purple-400/10' :
                                      event.significanceLevel === 'major' ? 'text-blue-400 bg-blue-400/10' :
                                      event.significanceLevel === 'moderate' ? 'text-green-400 bg-green-400/10' :
                                      'text-gray-400 bg-gray-400/10'
                                    }`}
                                  >
                                    {event.significanceLevel}
                                  </Badge>
                                  <span className="text-xs text-amber-300/60">
                                    {new Date(event.recordedAt).toLocaleDateString()}
                                  </span>
                                </div>
                                
                                <div className="text-sm text-amber-100 mb-1">
                                  Alignment Phase: <span className="capitalize">{event.alignmentPhase}</span>
                                </div>
                                
                                <div className="text-xs text-amber-300/70 mb-2">
                                  Triggered by: {event.triggeringActionType.replace(/_/g, ' ')}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-amber-300/60">L/C Shift: </span>
                                    <span className={`font-medium ${
                                      event.newLawfulChaotic > event.previousLawfulChaotic ? 'text-blue-300' : 'text-yellow-300'
                                    }`}>
                                      {event.previousLawfulChaotic.toFixed(1)} → {event.newLawfulChaotic.toFixed(1)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-amber-300/60">G/E Shift: </span>
                                    <span className={`font-medium ${
                                      event.newGoodEvil > event.previousGoodEvil ? 'text-green-300' : 'text-red-300'
                                    }`}>
                                      {event.previousGoodEvil.toFixed(1)} → {event.newGoodEvil.toFixed(1)}
                                    </span>
                                  </div>
                                </div>
                                
                                {event.cosmicEvent && (
                                  <div className="text-xs text-amber-300/80 italic mt-2">
                                    Cosmic Event: {event.cosmicEvent.replace(/_/g, ' ')}
                                  </div>
                                )}
                                
                                {event.prophecyUnlocked && (
                                  <div className="text-xs text-amber-200 italic mt-2 p-2 bg-amber-500/10 rounded border-l-2 border-amber-400">
                                    "{event.prophecyUnlocked}"
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-amber-300/60 py-8">
                          No cosmic events recorded yet. Begin trading to shape your karmic destiny.
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Karmic Profile */}
              <TabsContent value="profile" className="flex-1 mt-6">
                {profileLoading ? (
                  <div className="text-center text-amber-300/60 py-8">
                    Analyzing your karmic essence...
                  </div>
                ) : karmicProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Trading Personality */}
                    <Card className="bg-slate-800/50 border-amber-500/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-100 text-lg">
                          <Users className="h-5 w-5 text-amber-400" />
                          Trading Spirit
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {karmicProfile.tradingPersonality && (
                          <div>
                            <div className="text-sm text-amber-300/70">Personality</div>
                            <div className="font-medium text-amber-100 capitalize">
                              {karmicProfile.tradingPersonality.replace(/_/g, ' ')}
                            </div>
                          </div>
                        )}
                        
                        {karmicProfile.dominantBehaviorPattern && (
                          <div>
                            <div className="text-sm text-amber-300/70">Dominant Pattern</div>
                            <div className="font-medium text-amber-100 capitalize">
                              {karmicProfile.dominantBehaviorPattern.replace(/_/g, ' ')}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Karma Statistics */}
                    <Card className="bg-slate-800/50 border-amber-500/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-100 text-lg">
                          <TrendingUp className="h-5 w-5 text-amber-400" />
                          Karma Flow
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-amber-300/70">Earned</div>
                            <div className="font-medium text-green-300">
                              +{karmicProfile.totalKarmaEarned}
                            </div>
                          </div>
                          <div>
                            <div className="text-amber-300/70">Lost</div>
                            <div className="font-medium text-red-300">
                              -{karmicProfile.totalKarmaLost}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <div className="text-amber-300/70">Acceleration Rate</div>
                          <div className="font-medium text-amber-100">
                            {karmicProfile.karmaAccelerationRate.toFixed(2)}x
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Mystical Forces */}
                    <Card className="bg-slate-800/50 border-amber-500/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-100 text-lg">
                          <Sparkles className="h-5 w-5 text-amber-400" />
                          Cosmic Forces
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-300/70">Cosmic Resonance</span>
                            <span className="font-medium text-blue-300">
                              {karmicProfile.cosmicResonance.toFixed(0)}
                            </span>
                          </div>
                          <Progress value={karmicProfile.cosmicResonance} className="h-1 bg-slate-700" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-300/70">Divine Favor</span>
                            <span className="font-medium text-green-300">
                              {karmicProfile.divineFavor.toFixed(0)}
                            </span>
                          </div>
                          <Progress value={karmicProfile.divineFavor} className="h-1 bg-slate-700" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-red-300/70">Shadow Influence</span>
                            <span className="font-medium text-red-300">
                              {karmicProfile.shadowInfluence.toFixed(0)}
                            </span>
                          </div>
                          <Progress value={karmicProfile.shadowInfluence} className="h-1 bg-slate-700" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center text-amber-300/60 py-8">
                    Your karmic profile is still forming. Continue trading to develop your cosmic essence.
                  </div>
                )}
              </TabsContent>

              {/* Prophecy */}
              <TabsContent value="prophecy" className="flex-1 mt-6">
                <Card className="bg-slate-800/50 border-amber-500/20 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-100">
                      <BookOpen className="h-5 w-5 text-amber-400" />
                      Prophecies of Destiny
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {karmicProfile ? (
                      <>
                        <div className="p-6 bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-lg border border-amber-500/20">
                          <h4 className="text-lg font-medium text-amber-100 mb-3">
                            The Cosmic Threads Speak...
                          </h4>
                          <p className="text-amber-200 leading-relaxed italic">
                            {karmicProfile.predictedAlignmentDirection ? (
                              `The ancient seers whisper of your path turning ${karmicProfile.predictedAlignmentDirection.replace(/_/g, ' ')}. 
                              Your cosmic resonance of ${karmicProfile.cosmicResonance.toFixed(0)} draws the attention of celestial forces. 
                              ${karmicProfile.divineFavor > karmicProfile.shadowInfluence ? 
                                'Divine light favors your journey, though shadows still whisper temptations.' :
                                'Shadow energies cloud your path, yet divine sparks still flicker within.'}`
                            ) : (
                              'The cosmic threads remain in flux, your destiny yet unwritten. Continue your trading journey to unveil the mysteries that await.'
                            )}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-700/30 rounded-lg border border-blue-500/20">
                            <h5 className="font-medium text-blue-300 mb-2">Alignment Prophecy</h5>
                            <p className="text-sm text-blue-200/80">
                              Your alignment stability of {karmicProfile.alignmentStability.toFixed(0)}% 
                              {karmicProfile.alignmentStability > 80 ? 
                                ' reveals a soul anchored in cosmic certainty.' :
                                karmicProfile.alignmentStability > 50 ?
                                ' shows a spirit in gentle flux, seeking its true nature.' :
                                ' indicates a soul in great transformation, dancing between cosmic forces.'}
                            </p>
                          </div>

                          <div className="p-4 bg-slate-700/30 rounded-lg border border-green-500/20">
                            <h5 className="font-medium text-green-300 mb-2">Trading Destiny</h5>
                            <p className="text-sm text-green-200/80">
                              {karmicProfile.tradingPersonality ? (
                                `As a ${karmicProfile.tradingPersonality.replace(/_/g, ' ')}, the markets shall bend to your unique approach to cosmic commerce.`
                              ) : (
                                'Your trading destiny remains unformed, awaiting the defining trades that will shape your cosmic legacy.'
                              )}
                            </p>
                          </div>
                        </div>

                        {karmicProfile.nextThresholdDistance && karmicProfile.nextThresholdDistance < 50 && (
                          <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                            <h5 className="font-medium text-amber-300 mb-2 flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              Approaching Threshold
                            </h5>
                            <p className="text-sm text-amber-200/80">
                              The cosmic forces sense you are only {karmicProfile.nextThresholdDistance.toFixed(0)} alignment 
                              points away from crossing a significant threshold. Prepare for your destiny to shift dramatically.
                            </p>
                          </div>
                        )}

                        <div className="text-center text-amber-300/60 text-sm italic">
                          "The threads of karma are ever-weaving. Each trade, each choice, each moment shapes the grand tapestry of your cosmic destiny."
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-amber-300/60 py-8">
                        The cosmic oracles await your first steps into the realm of karmic trading...
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}