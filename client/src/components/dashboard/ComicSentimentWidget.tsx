import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SentimentData {
  symbol: string;
  name: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  indicators: string[];
  confidence: number;
}

export function ComicSentimentWidget() {
  const { data: sentimentData = [], isLoading } = useQuery<SentimentData[]>({
    queryKey: ['/api/comic-assets/sentiment'],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
      case 'bullish':
        return 'text-green-500';
      case 'bearish':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSentimentBadgeVariant = (sentiment: string): "default" | "secondary" | "destructive" => {
    switch (sentiment) {
      case 'bullish':
        return 'default';
      case 'bearish':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4" />;
      case 'bearish':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getConfidenceBar = (confidence: number) => {
    return (
      <div className="w-full bg-muted rounded-full h-1.5 mt-1">
        <div 
          className="bg-primary h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${confidence}%` }}
        />
      </div>
    );
  };

  // Calculate overall market sentiment
  const overallSentiment = sentimentData.reduce((acc, item) => {
    if (item.sentiment === 'bullish') return acc + 1;
    if (item.sentiment === 'bearish') return acc - 1;
    return acc;
  }, 0);

  const marketSentimentLabel = 
    overallSentiment > 2 ? 'Strongly Bullish' :
    overallSentiment > 0 ? 'Bullish' :
    overallSentiment < -2 ? 'Strongly Bearish' :
    overallSentiment < 0 ? 'Bearish' :
    'Neutral';

  if (isLoading) {
    return (
      <Card data-testid="widget-comic-sentiment">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Market Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="widget-comic-sentiment">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Market Sentiment Analysis
        </CardTitle>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-muted-foreground">AI-powered sentiment tracking</span>
          <Badge variant={getSentimentBadgeVariant(overallSentiment > 0 ? 'bullish' : overallSentiment < 0 ? 'bearish' : 'neutral')}>
            {marketSentimentLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sentimentData.map((item) => (
            <div 
              key={item.symbol}
              className="p-3 rounded-lg border border-border hover-elevate transition-all"
              data-testid={`sentiment-item-${item.symbol}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="">{item.symbol}</span>
                    <Badge variant={getSentimentBadgeVariant(item.sentiment)} className="flex items-center gap-1">
                      {getSentimentIcon(item.sentiment)}
                      {item.sentiment.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{item.name}</div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl  ${getSentimentColor(item.sentiment)}`}>
                    {item.score > 0 ? '+' : ''}{item.score}
                  </div>
                  <div className="text-xs text-muted-foreground">Sentiment Score</div>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Confidence</span>
                  <span>{item.confidence}%</span>
                </div>
                {getConfidenceBar(item.confidence)}
              </div>

              {/* Indicators */}
              {item.indicators && item.indicators.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.indicators.map((indicator, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {indicator}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {sentimentData.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No sentiment data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
