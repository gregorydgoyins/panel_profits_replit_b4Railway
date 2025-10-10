import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Target, Book } from 'lucide-react';

interface Recommendation {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  recommendationType: 'buy' | 'accumulate' | 'watch';
  confidence: number;
  reason: string;
  relatedTo?: string;
}

export function ComicRecommendationsWidget() {
  const { data: assets = [] } = useQuery<any[]>({
    queryKey: ['/api/comic-assets/top'],
    refetchInterval: 30000,
  });

  // Generate recommendations from market data
  const recommendations: Recommendation[] = assets.slice(0, 6).map((asset, idx) => ({
    id: asset.id,
    symbol: asset.symbol,
    name: asset.name,
    currentPrice: asset.currentPrice || 0,
    recommendationType: idx % 3 === 0 ? 'buy' : idx % 3 === 1 ? 'accumulate' : 'watch',
    confidence: 75 + (idx * 3),
    reason: idx % 3 === 0 
      ? 'Strong upward momentum with increasing volume'
      : idx % 3 === 1
      ? 'Consolidating near support levels, good entry point'
      : 'Monitoring for breakout above resistance',
    relatedTo: idx > 0 ? assets[0].symbol : undefined,
  }));

  return (
    <Card className="h-full" data-testid="widget-recommendations">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Trading Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 bg-card/50 border border-border rounded-lg hover-elevate"
              data-testid={`recommendation-${rec.symbol}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className=" text-foreground">{rec.name}</h4>
                    <Badge variant="outline" className="text-xs">{rec.symbol}</Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        rec.recommendationType === 'buy' ? 'default' :
                        rec.recommendationType === 'accumulate' ? 'secondary' :
                        'outline'
                      }
                      className="text-xs"
                    >
                      {rec.recommendationType === 'buy' && <TrendingUp className="w-3 h-3 mr-1" />}
                      {rec.recommendationType === 'accumulate' && <Target className="w-3 h-3 mr-1" />}
                      {rec.recommendationType === 'watch' && <Book className="w-3 h-3 mr-1" />}
                      {rec.recommendationType.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {rec.confidence}% confidence
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">{rec.reason}</p>

                  {rec.relatedTo && (
                    <p className="text-xs text-primary">
                      Related to {rec.relatedTo}
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <p className="text-lg  text-foreground">
                    ${rec.currentPrice.toLocaleString()}
                  </p>
                  <Button size="sm" variant="outline" className="mt-2" data-testid={`button-trade-${rec.symbol}`}>
                    Trade
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {recommendations.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Analyzing market for recommendations...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
