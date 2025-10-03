import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Package, Image, DollarSign } from "lucide-react";

interface GrowthMetrics {
  assetsLastHour: number;
  assetsLastDay: number;
  coversLastHour: number;
  coversLastDay: number;
  pricesLastHour: number;
  pricesLastDay: number;
  timestamp: string;
}

export function AssetGrowthWidget() {
  const { data, isLoading } = useQuery<GrowthMetrics>({
    queryKey: ['/api/growth/metrics'],
    refetchInterval: 30000, // Update every 30 seconds
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getGrowthColor = (value: number): string => {
    if (value > 0) return 'text-green-500';
    return 'text-muted-foreground';
  };

  return (
    <Card className="bg-black/40 border-indigo-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono uppercase tracking-wider text-indigo-300 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Asset Growth Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="h-[200px] flex items-center justify-center">
            <div className="text-muted-foreground font-mono text-sm">Loading metrics...</div>
          </div>
        ) : (
          <>
            {/* Last Hour Stats */}
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground font-mono uppercase">Last Hour</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-black/60 border border-indigo-500/20 rounded p-3" data-testid="growth-assets-hour">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-3 w-3 text-indigo-400" />
                    <div className="text-xs text-muted-foreground font-mono">ASSETS</div>
                  </div>
                  <div className={`text-2xl font-mono font-bold ${getGrowthColor(data?.assetsLastHour || 0)}`}>
                    +{formatNumber(data?.assetsLastHour || 0)}
                  </div>
                </div>

                <div className="bg-black/60 border border-indigo-500/20 rounded p-3" data-testid="growth-covers-hour">
                  <div className="flex items-center gap-2 mb-1">
                    <Image className="h-3 w-3 text-purple-400" />
                    <div className="text-xs text-muted-foreground font-mono">COVERS</div>
                  </div>
                  <div className={`text-2xl font-mono font-bold ${getGrowthColor(data?.coversLastHour || 0)}`}>
                    +{formatNumber(data?.coversLastHour || 0)}
                  </div>
                </div>

                <div className="bg-black/60 border border-indigo-500/20 rounded p-3" data-testid="growth-prices-hour">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-3 w-3 text-green-400" />
                    <div className="text-xs text-muted-foreground font-mono">PRICES</div>
                  </div>
                  <div className={`text-2xl font-mono font-bold ${getGrowthColor(data?.pricesLastHour || 0)}`}>
                    +{formatNumber(data?.pricesLastHour || 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Last 24 Hours Stats */}
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground font-mono uppercase">Last 24 Hours</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-black/60 border border-green-500/20 rounded p-3" data-testid="growth-assets-day">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-3 w-3 text-indigo-400" />
                    <div className="text-xs text-muted-foreground font-mono">ASSETS</div>
                  </div>
                  <div className={`text-2xl font-mono font-bold ${getGrowthColor(data?.assetsLastDay || 0)}`}>
                    +{formatNumber(data?.assetsLastDay || 0)}
                  </div>
                </div>

                <div className="bg-black/60 border border-green-500/20 rounded p-3" data-testid="growth-covers-day">
                  <div className="flex items-center gap-2 mb-1">
                    <Image className="h-3 w-3 text-purple-400" />
                    <div className="text-xs text-muted-foreground font-mono">COVERS</div>
                  </div>
                  <div className={`text-2xl font-mono font-bold ${getGrowthColor(data?.coversLastDay || 0)}`}>
                    +{formatNumber(data?.coversLastDay || 0)}
                  </div>
                </div>

                <div className="bg-black/60 border border-green-500/20 rounded p-3" data-testid="growth-prices-day">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-3 w-3 text-green-400" />
                    <div className="text-xs text-muted-foreground font-mono">PRICES</div>
                  </div>
                  <div className={`text-2xl font-mono font-bold ${getGrowthColor(data?.pricesLastDay || 0)}`}>
                    +{formatNumber(data?.pricesLastDay || 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Footer */}
            <div className="pt-3 border-t border-indigo-500/20">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                <div>EXPANSION PIPELINE</div>
                <div className={data && (data.assetsLastHour > 0 || data.assetsLastDay > 0) ? 'text-green-500' : 'text-yellow-500'}>
                  {data && (data.assetsLastHour > 0 || data.assetsLastDay > 0) ? '● ACTIVE' : '● IDLE'}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
