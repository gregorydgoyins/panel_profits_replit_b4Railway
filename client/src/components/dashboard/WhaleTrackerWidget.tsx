import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2, Fish, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface WhaleActivity {
  id: number;
  assetId: number;
  symbol: string;
  assetName: string;
  tradeType: "buy" | "sell";
  volume: number;
  estimatedValue: number;
  currentPrice: number;
  priceImpact: number;
  timestamp: string;
  whaleCategory: "institutional" | "hedge_fund" | "family_office" | "unknown";
}

export default function WhaleTrackerWidget() {
  const { data: activities, isLoading, error } = useQuery<WhaleActivity[]>({
    queryKey: ["/api/analytics/whale-activity"],
    refetchInterval: 10000,
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "institutional": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "hedge_fund": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "family_office": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <Card className="p-4 bg-black/40 border-indigo-900/30" data-testid="widget-whale-tracker">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center">
            <Fish className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm  text-gray-100">Whale Movement Tracker</h3>
            <p className="text-xs text-gray-500">Large institutional position changes</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8 text-red-400 text-sm">
          Failed to load whale activity
        </div>
      ) : (
        <div className="space-y-2">
          {activities?.slice(0, 10).map((activity) => (
            <div
              key={activity.id}
              className="p-3 rounded bg-black/20 border border-gray-800/50 hover-elevate"
              data-testid={`whale-activity-${activity.id}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400">{activity.symbol}</span>
                  <Badge variant="secondary" className={`text-xs h-5 ${getCategoryColor(activity.whaleCategory)}`}>
                    {activity.whaleCategory.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className={`flex items-center gap-1 ${activity.tradeType === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                  {activity.tradeType === 'buy' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="text-xs  uppercase">{activity.tradeType}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-2 truncate">{activity.assetName}</p>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Volume</span>
                  <div className="font-mono text-gray-100">{activity.volume.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-500">Value</span>
                  <div className="font-mono text-gray-100">${(activity.estimatedValue / 1000000).toFixed(2)}M</div>
                </div>
                <div>
                  <span className="text-gray-500">Impact</span>
                  <div className={`font-mono ${activity.priceImpact >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {activity.priceImpact >= 0 ? '+' : ''}{activity.priceImpact.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-500">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-800/50 flex items-center justify-between text-xs">
        <span className="text-gray-500">Tracking $10M+ trades</span>
        <span className="text-cyan-400 font-mono">{activities?.length || 0} detected</span>
      </div>
    </Card>
  );
}
