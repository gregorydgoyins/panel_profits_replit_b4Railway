import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2, Gauge, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SentimentVelocity {
  assetId: number;
  symbol: string;
  assetName: string;
  currentPrice: number;
  sentiment: number;
  sentimentChange1h: number;
  sentimentChange24h: number;
  velocity: number;
  acceleration: number;
  momentum: "bullish" | "bearish" | "neutral";
  inflectionPoint: boolean;
  socialVolume: number;
  newsImpact: number;
}

export default function SentimentVelocityWidget() {
  const { data: sentiments, isLoading, error } = useQuery<SentimentVelocity[]>({
    queryKey: ["/api/analytics/sentiment-velocity"],
    refetchInterval: 15000,
  });

  const getMomentumColor = (momentum: string) => {
    switch (momentum) {
      case "bullish": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "bearish": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getVelocityIcon = (velocity: number) => {
    if (velocity > 0) return <TrendingUp className="w-3 h-3" />;
    if (velocity < 0) return <TrendingDown className="w-3 h-3" />;
    return <Gauge className="w-3 h-3" />;
  };

  return (
    <Card className="p-4 bg-black/40 border-indigo-900/30" data-testid="widget-sentiment-velocity">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center">
            <Gauge className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-100">Social Sentiment Velocity</h3>
            <p className="text-xs text-gray-500">Rate of change in market sentiment</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8 text-red-400 text-sm">
          Failed to load sentiment velocity data
        </div>
      ) : (
        <div className="space-y-2">
          {sentiments?.slice(0, 8).map((item) => (
            <div
              key={item.assetId}
              className="p-3 rounded bg-black/20 border border-gray-800/50 hover-elevate"
              data-testid={`sentiment-velocity-${item.assetId}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-orange-400">{item.symbol}</span>
                  <Badge variant="secondary" className={`text-xs h-5 ${getMomentumColor(item.momentum)}`}>
                    {item.momentum.toUpperCase()}
                  </Badge>
                  {item.inflectionPoint && (
                    <Badge variant="secondary" className="text-xs h-5 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      INFLECTION
                    </Badge>
                  )}
                </div>
                <div className="text-xs font-mono text-gray-100">${item.currentPrice.toFixed(2)}</div>
              </div>

              <p className="text-xs text-gray-400 mb-2 truncate">{item.assetName}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Sentiment</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className={`h-full ${item.sentiment >= 0 ? 'bg-gradient-to-r from-gray-600 to-green-500' : 'bg-gradient-to-r from-red-500 to-gray-600'}`}
                        style={{ 
                          width: '100%',
                          transform: `translateX(${item.sentiment * 50}%)`
                        }}
                      />
                    </div>
                    <span className={`font-mono ${item.sentiment >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(item.sentiment * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">1h Δ</span>
                    <div className={`font-mono flex items-center gap-1 ${item.sentimentChange1h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {getVelocityIcon(item.sentimentChange1h)}
                      {item.sentimentChange1h >= 0 ? '+' : ''}{(item.sentimentChange1h * 100).toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">24h Δ</span>
                    <div className={`font-mono ${item.sentimentChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.sentimentChange24h >= 0 ? '+' : ''}{(item.sentimentChange24h * 100).toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Velocity</span>
                    <div className="font-mono text-orange-400">{item.velocity.toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-800/50">
                  <span className="text-gray-500">Social Volume: {item.socialVolume.toLocaleString()}</span>
                  <span className="text-orange-400">News Impact: {(item.newsImpact * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-800/50 flex items-center justify-between text-xs">
        <span className="text-gray-500">Real-time sentiment tracking</span>
        <span className="text-orange-400 font-mono">{sentiments?.length || 0} tracked</span>
      </div>
    </Card>
  );
}
