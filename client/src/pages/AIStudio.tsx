import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUpIcon, TrendingDownIcon, BrainIcon, TrophyIcon, AlertTriangleIcon, InfoIcon, DollarSignIcon, CalendarIcon, UsersIcon } from "lucide-react";
import { useState } from "react";

interface PricePrediction {
  assetId: string;
  currentPrice: number;
  predictedPrice1Week: number;
  predictedPrice1Month: number;
  predictedPrice3Month: number;
  confidence: number;
  reasoning: string;
  marketFactors: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface MarketInsight {
  type: 'TREND' | 'OPPORTUNITY' | 'RISK' | 'MILESTONE';
  title: string;
  description: string;
  affectedAssets: string[];
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number;
  timeframe: string;
}

interface BeatTheAIChallenge {
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

export default function AIStudio() {
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);

  // Fetch AI predictions
  const { data: predictions = [], isLoading: predictionsLoading } = useQuery<PricePrediction[]>({
    queryKey: ['/api/ai/predictions'],
    queryFn: async () => {
      const response = await fetch('/api/ai/predictions');
      if (!response.ok) throw new Error(`Failed to fetch predictions: ${response.statusText}`);
      return response.json();
    },
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  // Fetch market insights
  const { data: insights = [], isLoading: insightsLoading } = useQuery<MarketInsight[]>({
    queryKey: ['/api/ai/insights'],
    queryFn: async () => {
      const response = await fetch('/api/ai/insights');
      if (!response.ok) throw new Error(`Failed to fetch insights: ${response.statusText}`);
      return response.json();
    },
    refetchInterval: 600000 // Refresh every 10 minutes
  });

  // Fetch Beat the AI challenges
  const { data: challenges = [], isLoading: challengesLoading } = useQuery<BeatTheAIChallenge[]>({
    queryKey: ['/api/ai/challenges'],
    queryFn: async () => {
      const response = await fetch('/api/ai/challenges');
      if (!response.ok) throw new Error(`Failed to fetch challenges: ${response.statusText}`);
      return response.json();
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatChange = (current: number, predicted: number) => {
    const change = ((predicted - current) / current) * 100;
    return {
      value: change,
      formatted: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
      color: change >= 0 ? 'text-green-600' : 'text-red-600'
    };
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'TREND': return TrendingUpIcon;
      case 'OPPORTUNITY': return DollarSignIcon;
      case 'RISK': return AlertTriangleIcon;
      case 'MILESTONE': return CalendarIcon;
      default: return InfoIcon;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (predictionsLoading || insightsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <BrainIcon className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-pulse" />
          <h1 className="text-3xl font-bold text-blue-600">AI Studio</h1>
          <p className="text-muted-foreground mt-2">AI is analyzing the market...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <BrainIcon className="w-10 h-10 text-blue-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Studio</h1>
          <Badge variant="secondary" className="text-xs animate-pulse">PRO FEATURE</Badge>
        </div>
        <p className="text-muted-foreground text-lg">AI-powered market intelligence for comic book investing</p>
        
        {/* AI Status Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">AI Market Intelligence</span>
              <Badge variant="outline" className="text-xs">
                DEMO MODE
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Latest Analysis</div>
              <div className="text-xs text-muted-foreground">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="predictions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions" data-testid="tab-predictions">
            <TrendingUpIcon className="w-4 h-4 mr-2" />
            Price Predictions
          </TabsTrigger>
          <TabsTrigger value="insights" data-testid="tab-insights">
            <InfoIcon className="w-4 h-4 mr-2" />
            Market Insights
          </TabsTrigger>
          <TabsTrigger value="challenges" data-testid="tab-challenges">
            <TrophyIcon className="w-4 h-4 mr-2" />
            Beat the AI
          </TabsTrigger>
        </TabsList>

        {/* Price Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainIcon className="w-5 h-5" />
                AI Price Predictions
              </CardTitle>
              <CardDescription>
                Machine learning predictions based on market trends, rarity factors, and historical data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {predictions?.map((prediction: PricePrediction) => {
                  const monthChange = formatChange(prediction.currentPrice, prediction.predictedPrice1Month);
                  
                  return (
                    <Card 
                      key={prediction.assetId}
                      className="cursor-pointer hover-elevate"
                      onClick={() => setSelectedPrediction(selectedPrediction === prediction.assetId ? null : prediction.assetId)}
                      data-testid={`prediction-${prediction.assetId}`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{prediction.assetId}</h3>
                              <Badge className={`text-xs ${getRiskColor(prediction.riskLevel)}`}>
                                {prediction.riskLevel} RISK
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Current: {formatPrice(prediction.currentPrice)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold">
                              {formatPrice(prediction.predictedPrice1Month)}
                            </div>
                            <div className={`text-sm font-semibold ${monthChange.color}`}>
                              {monthChange.formatted}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Confidence: {Math.round(prediction.confidence * 100)}%
                            </div>
                          </div>
                        </div>
                        
                        {selectedPrediction === prediction.assetId && (
                          <div className="mt-4 pt-4 border-t space-y-3">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">1 Week</div>
                                <div className="font-semibold">{formatPrice(prediction.predictedPrice1Week)}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">1 Month</div>
                                <div className="font-semibold">{formatPrice(prediction.predictedPrice1Month)}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">3 Months</div>
                                <div className="font-semibold">{formatPrice(prediction.predictedPrice3Month)}</div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm font-medium mb-2">Market Factors</div>
                              <div className="flex flex-wrap gap-1">
                                {prediction.marketFactors.map((factor, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {factor}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm font-medium mb-1">AI Analysis</div>
                              <p className="text-sm text-muted-foreground">{prediction.reasoning}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {insights?.map((insight: MarketInsight, index: number) => {
              const IconComponent = getInsightIcon(insight.type);
              
              return (
                <Card key={index} data-testid={`insight-${index}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="w-5 h-5" />
                      {insight.title}
                      <Badge 
                        variant={insight.impact === 'POSITIVE' ? 'default' : insight.impact === 'NEGATIVE' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {insight.type}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{insight.timeframe}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{insight.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Confidence</span>
                        <span className="text-xs font-medium">{Math.round(insight.confidence * 100)}%</span>
                      </div>
                      <Progress value={insight.confidence * 100} className="h-2" />
                    </div>
                    
                    {insight.affectedAssets.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-muted-foreground mb-1">Affected Assets</div>
                        <div className="flex flex-wrap gap-1">
                          {insight.affectedAssets.map((asset, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {asset}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Beat the AI Tab */}
        <TabsContent value="challenges" className="space-y-4">
          {challenges?.map((challenge: BeatTheAIChallenge) => (
            <Card key={challenge.id} data-testid={`challenge-${challenge.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrophyIcon className="w-5 h-5 text-yellow-500" />
                      {challenge.title}
                      <Badge 
                        variant={challenge.status === 'ACTIVE' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {challenge.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600">
                      {formatPrice(challenge.prizePool)}
                    </div>
                    <div className="text-xs text-muted-foreground">Prize Pool</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{challenge.aiPrediction}%</div>
                    <div className="text-xs text-muted-foreground">AI Prediction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold flex items-center justify-center gap-1">
                      <UsersIcon className="w-4 h-4" />
                      {challenge.participantCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Participants</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d
                    </div>
                    <div className="text-xs text-muted-foreground">Days Left</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-2">Challenge Assets</div>
                  <div className="flex flex-wrap gap-1">
                    {challenge.targetAssets.map((asset, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {asset}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline"
                    data-testid="button-view-challenge"
                    onClick={() => console.log('View challenge details:', challenge.id)}
                  >
                    View Details
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                    data-testid="button-join-challenge"
                    onClick={() => console.log('Join challenge:', challenge.id)}
                  >
                    Join ($50 Entry)
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}