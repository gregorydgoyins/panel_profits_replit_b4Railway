import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface Recommendation {
  house: string;
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reason: string;
  targetPrice?: number;
  stopLoss?: number;
}

export function AIRecommendationsWidget() {
  const recommendations: Recommendation[] = [
    {
      house: 'House of Prophecy',
      symbol: 'SPIDEY',
      action: 'BUY',
      confidence: 87,
      reason: 'Strong momentum + favorable options flow',
      targetPrice: 135,
      stopLoss: 115
    },
    {
      house: 'House of Calculation',
      symbol: 'BATMAN',
      action: 'HOLD',
      confidence: 72,
      reason: 'Consolidation phase, await breakout confirmation',
      targetPrice: 105
    },
    {
      house: 'House of Chaos',
      symbol: 'IRONM',
      action: 'SELL',
      confidence: 81,
      reason: 'Overbought RSI + negative divergence detected',
      targetPrice: 125,
      stopLoss: 148
    },
    {
      house: 'House of Heritage',
      symbol: 'WWOND',
      action: 'BUY',
      confidence: 79,
      reason: 'Value play + institutional accumulation',
      targetPrice: 98,
      stopLoss: 82
    }
  ];

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-500/20 text-green-500';
      case 'SELL': return 'bg-red-500/20 text-red-500';
      case 'HOLD': return 'bg-yellow-500/20 text-yellow-500';
      default: return 'bg-muted';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'BUY': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'SELL': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'HOLD': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-500';
    if (confidence >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card data-testid="widget-ai-recommendations">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Seven Houses AI</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Multi-strategy recommendations
            </p>
          </div>
          <Badge variant="outline">
            <Brain className="w-3 h-3 mr-1" />
            4 Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border hover-elevate"
              data-testid={`ai-rec-${rec.symbol}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getActionIcon(rec.action)}
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {rec.symbol}
                      </Badge>
                      <Badge className={`text-xs ${getActionColor(rec.action)}`}>
                        {rec.action}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{rec.house}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg  ${getConfidenceColor(rec.confidence)}`}>
                    {rec.confidence}%
                  </p>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                </div>
              </div>

              <p className="text-sm mb-2">{rec.reason}</p>

              <div className="flex items-center gap-4 text-xs pt-2 border-t">
                {rec.targetPrice && (
                  <div>
                    <span className="text-muted-foreground">Target:</span>{' '}
                    <span className=" text-green-500">${rec.targetPrice}</span>
                  </div>
                )}
                {rec.stopLoss && (
                  <div>
                    <span className="text-muted-foreground">Stop:</span>{' '}
                    <span className=" text-red-500">${rec.stopLoss}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-start gap-2">
            <Brain className="w-4 h-4 text-blue-500 mt-0.5" />
            <div className="text-xs">
              <p className=" text-blue-500">AI Consensus</p>
              <p className="text-muted-foreground mt-1">
                2 Buy signals, 1 Sell signal, 1 Hold. Average confidence: {Math.round(recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length)}%.
                Seven Houses algorithmic strategies aligned.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
