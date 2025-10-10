import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrophyIcon, BrainIcon, DollarSignIcon, UsersIcon, CalendarIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UserPrediction {
  challengeId: string;
  assetSymbol: string;
  predictedChange: number;
  confidence: number;
  reasoning: string;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  accuracy: number;
  totalPredictions: number;
  winnings: number;
}

export default function BeatTheAI() {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [userPredictions, setUserPredictions] = useState<Record<string, number>>({});

  interface Challenge {
    id: string;
    title: string;
    description: string;
    targetAssets: string[];
    startDate: string;
    endDate: string;
    prizePool: number;
    participantCount: number;
    aiPrediction: number;
    status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
  }

  // Fetch active challenges using apiRequest
  const { data: challenges = [], isLoading: challengesLoading, error, isError } = useQuery<Challenge[]>({
    queryKey: ['/api/ai/challenges'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/ai/challenges');
      return response.json();
    }
  });

  // Fetch market statistics
  const { data: stats } = useQuery({
    queryKey: ['/api/ai/stats'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/ai/stats');
      return response.json();
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch market intelligence leaderboard
  const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery({
    queryKey: ['/api/ai/leaderboard'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/ai/leaderboard');
      return response.json();
    },
    refetchInterval: 60000 // Refresh every minute
  });

  // Debug logging
  console.log('🔍 Beat the AI Debug:', {
    challengesLoading,
    challengesLength: challenges.length,
    challenges: challenges,
    isError,
    error: error?.message,
    queryKey: ['/api/ai/challenges']
  });

  // Submit prediction mutation
  const submitPredictionMutation = useMutation({
    mutationFn: async ({ challengeId, assetSymbol, predictedChange }: {
      challengeId: string;
      assetSymbol: string;
      predictedChange: number;
    }) => {
      const response = await apiRequest('POST', `/api/ai/challenges/${challengeId}/predictions`, {
        assetSymbol,
        predictedChange,
        userId: `user_${Date.now()}`, // Mock user ID
        username: `Trader${Math.floor(Math.random() * 1000)}`
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/stats'] });
      toast({
        title: "Prediction Submitted! 🎯",
        description: "Your prediction has been entered into the competition.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const { toast } = useToast();

  const handlePredictionSubmit = (challengeId: string, assetSymbol: string) => {
    const predictedChange = userPredictions[`${challengeId}-${assetSymbol}`];
    if (!predictedChange) return;

    submitPredictionMutation.mutate({
      challengeId,
      assetSymbol,
      predictedChange
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (challengesLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <TrophyIcon className="w-12 h-12 mx-auto mb-4 text-yellow-500 animate-pulse" />
          <h1 className="text-3xl  text-yellow-600">Beat the AI</h1>
          <p className="text-muted-foreground mt-2">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <TrophyIcon className="w-10 h-10 text-yellow-500" />
          <h1 className="text-4xl  bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Beat the AI</h1>
          <Badge variant="secondary" className="text-xs animate-pulse">$50K+ PRIZES</Badge>
        </div>
        <p className="text-muted-foreground text-lg">Compete against our AI in comic market prediction challenges</p>
        
        {/* Competition Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl  text-yellow-600">847</div>
              <div className="text-xs text-muted-foreground">Active Players</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl  text-green-600">{formatCurrency(73250)}</div>
              <div className="text-xs text-muted-foreground">Total Prizes Won</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl  text-blue-600">68.5%</div>
              <div className="text-xs text-muted-foreground">AI Win Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl  text-purple-600">3</div>
              <div className="text-xs text-muted-foreground">Active Challenges</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="challenges" data-testid="tab-challenges">
            <TrophyIcon className="w-4 h-4 mr-2" />
            Active Challenges
          </TabsTrigger>
          <TabsTrigger value="leaderboard" data-testid="tab-leaderboard">
            <UsersIcon className="w-4 h-4 mr-2" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        {/* Active Challenges Tab */}
        <TabsContent value="challenges" className="space-y-4">
          {challenges.length > 0 ? (
            challenges.map((challenge: Challenge) => (
            <Card key={challenge.id} className="border-2 border-yellow-200 dark:border-yellow-800" data-testid={`challenge-${challenge.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrophyIcon className="w-5 h-5 text-yellow-500" />
                      {challenge.title}
                      <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500">
                        {challenge.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">{challenge.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl  text-yellow-600">
                      {formatCurrency(challenge.prizePool)}
                    </div>
                    <div className="text-xs text-muted-foreground">Prize Pool</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI vs Human Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <BrainIcon className="w-5 h-5 text-blue-500" />
                      <span className="">AI Prediction</span>
                    </div>
                    <div className="text-2xl  text-blue-600">{challenge.aiPrediction}%</div>
                    <div className="text-xs text-muted-foreground">Expected Return</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <UsersIcon className="w-5 h-5 text-green-500" />
                      <span className="">Human Average</span>
                    </div>
                    <div className="text-2xl  text-green-600">+8.3%</div>
                    <div className="text-xs text-muted-foreground">Crowd Prediction</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CalendarIcon className="w-5 h-5 text-purple-500" />
                      <span className="">Time Remaining</span>
                    </div>
                    <div className="text-2xl  text-purple-600">
                      {Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d
                    </div>
                    <div className="text-xs text-muted-foreground">Days Left</div>
                  </div>
                </div>
                
                {/* Challenge Assets */}
                <div>
                  <h4 className=" mb-3">Make Your Predictions</h4>
                  <div className="grid gap-3">
                    {challenge.targetAssets.map((asset: string, idx: number) => (
                      <div key={asset} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="">{asset}</div>
                            <div className="text-sm text-muted-foreground">
                              Predict 30-day price change (%)
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Entry: $50
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                          <div>
                            <Label htmlFor={`prediction-${challenge.id}-${asset}`}>Your Prediction (%)</Label>
                            <Input
                              id={`prediction-${challenge.id}-${asset}`}
                              type="number"
                              placeholder="+15.5"
                              step="0.1"
                              value={userPredictions[`${challenge.id}-${asset}`] || ''}
                              onChange={(e) => setUserPredictions({
                                ...userPredictions,
                                [`${challenge.id}-${asset}`]: parseFloat(e.target.value) || 0
                              })}
                              data-testid={`input-prediction-${asset}`}
                            />
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">AI Prediction</div>
                            <div className="text-lg  text-blue-600">
                              {challenge.aiPrediction > 0 ? '+' : ''}{challenge.aiPrediction}%
                            </div>
                          </div>
                          <Button
                            onClick={() => handlePredictionSubmit(challenge.id, asset)}
                            disabled={!userPredictions[`${challenge.id}-${asset}`] || submitPredictionMutation.isPending}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                            data-testid={`button-submit-prediction-${asset}`}
                          >
                            {submitPredictionMutation.isPending ? 'Submitting...' : 'Submit Entry'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-muted-foreground">
                  {challengesLoading ? 'Loading challenges...' : 'No active challenges available'}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Debug: {challenges.length} challenges loaded
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrophyIcon className="w-5 h-5 text-yellow-500" />
                Global Leaderboard
              </CardTitle>
              <CardDescription>Top performers in AI prediction challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div 
                    key={entry.rank} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' : ''
                    }`}
                    data-testid={`leaderboard-rank-${entry.rank}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center  text-sm ${
                        entry.rank === 1 ? 'bg-yellow-500 text-white' :
                        entry.rank === 2 ? 'bg-gray-400 text-white' :
                        entry.rank === 3 ? 'bg-orange-500 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {entry.rank}
                      </div>
                      <div>
                        <div className="">{entry.username}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.totalPredictions} predictions • {entry.accuracy}% accuracy
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className=" text-green-600">{formatCurrency(entry.winnings)}</div>
                      <div className="text-sm text-muted-foreground">Score: {entry.score}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Your Current Ranking</div>
                <div className=" text-lg">#23 of 847 players</div>
                <div className="text-sm text-green-600">+5 positions this week</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}