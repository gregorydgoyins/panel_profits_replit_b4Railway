import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Brain, Zap, TrendingUp, Target, BarChart3, Lightbulb, MessageSquare, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';

interface AIInsight {
  id: string;
  type: 'market-analysis' | 'character-spotlight' | 'trading-strategy' | 'trend-prediction';
  title: string;
  confidence: number;
  summary: string;
  timestamp: Date;
}

export function AIStudio() {
  const [query, setQuery] = useState('');
  const queryClient = useQueryClient();

  // Fetch AI insights using React Query
  const { data: insights = [], isLoading } = useQuery({
    queryKey: ['/api/market-insights'],
    select: (data) => data || [],
  });

  // Generate new AI insight mutation
  const generateInsightMutation = useMutation({
    mutationFn: async (userQuery: string) => {
      return apiRequest('POST', '/api/market-insights', { 
        type: 'trading-strategy',
        query: userQuery 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/market-insights'] });
      setQuery(''); // Clear input after successful generation
    },
  });

  const generateInsight = async () => {
    if (!query.trim()) return;
    generateInsightMutation.mutate(query);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'market-analysis': return <BarChart3 className="h-4 w-4" />;
      case 'character-spotlight': return <Target className="h-4 w-4" />;
      case 'trading-strategy': return <TrendingUp className="h-4 w-4" />;
      case 'trend-prediction': return <Zap className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'market-analysis': return 'text-blue-400 bg-blue-900/20';
      case 'character-spotlight': return 'text-green-400 bg-green-900/20';
      case 'trading-strategy': return 'text-purple-400 bg-purple-900/20';
      case 'trend-prediction': return 'text-orange-400 bg-orange-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="p-6" data-testid="ai-studio">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-serif">AI Market Intelligence Studio</CardTitle>
          <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/20">
            Neural Engine v3.2
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights" data-testid="tab-insights">Live Insights</TabsTrigger>
            <TabsTrigger value="query" data-testid="tab-query">Ask AI</TabsTrigger>
            <TabsTrigger value="strategies" data-testid="tab-strategies">Strategies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4">
              {insights.map((insight) => (
                <Card key={insight.id} className="hover-elevate" data-testid={`insight-${insight.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg ${getTypeColor(insight.type)}`}>
                          {getTypeIcon(insight.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{insight.title}</h4>
                          <p className="text-xs text-muted-foreground capitalize">
                            {insight.type.replace('-', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={insight.confidence > 80 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {insight.confidence}% confidence
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(new Date(insight.timestamp))}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.summary}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="query" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Ask the AI anything about the comic market</h3>
                <Textarea
                  placeholder="e.g. What are the best performing Marvel characters this quarter? Should I invest in Golden Age comics?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-24"
                  data-testid="textarea-ai-query"
                />
              </div>
              <Button 
                onClick={generateInsight}
                disabled={!query.trim() || generateInsightMutation.isPending}
                className="w-full"
                data-testid="button-generate-insight"
              >
                {generateInsightMutation.isPending ? (
                  <>
                    <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate Insight
                  </>
                )}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuery('What Marvel characters are undervalued right now?')}
                data-testid="button-preset-1"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Marvel Analysis
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuery('Should I diversify into DC Comics?')}
                data-testid="button-preset-2"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Portfolio Strategy
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuery('What are the key comic trends for 2024?')}
                data-testid="button-preset-3"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Market Trends
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuery('When should I sell my X-Men positions?')}
                data-testid="button-preset-4"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Exit Strategy
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="strategies" className="space-y-4">
            <div className="grid gap-4">
              <Card className="hover-elevate">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Diversification Strategy</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Balance your portfolio across different publishers, eras, and character types for optimal risk management.
                  </p>
                  <Badge variant="outline">Recommended</Badge>
                </CardContent>
              </Card>
              
              <Card className="hover-elevate">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Momentum Trading</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Follow trending characters and key issues that show strong upward movement with high volume.
                  </p>
                  <Badge variant="secondary">Moderate Risk</Badge>
                </CardContent>
              </Card>
              
              <Card className="hover-elevate">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Value Investing</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Identify undervalued characters and comics with strong fundamentals and long-term potential.
                  </p>
                  <Badge variant="outline">Low Risk</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}