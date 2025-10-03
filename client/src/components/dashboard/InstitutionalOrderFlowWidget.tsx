import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface OrderFlowData {
  assetId: string;
  symbol: string;
  name: string;
  type: string;
  buyVolume: number;
  sellVolume: number;
  buyOrders: number;
  sellOrders: number;
  netFlow: number;
  pressure: number;
  totalVolume: number;
  avgBuyPrice: number;
  avgSellPrice: number;
  lastActivity: string;
}

interface OrderFlowResponse {
  timeWindow: number;
  totalAssets: number;
  totalActivity: number;
  data: OrderFlowData[];
}

export function InstitutionalOrderFlowWidget() {
  const { data, isLoading } = useQuery<OrderFlowResponse>({
    queryKey: ['/api/institutional/order-flow'],
    refetchInterval: 5000, // Update every 5 seconds
  });

  const getPressureColor = (pressure: number): string => {
    if (pressure > 50) return 'bg-green-500/20 border-green-500/40';
    if (pressure > 25) return 'bg-green-500/10 border-green-500/30';
    if (pressure > 0) return 'bg-green-500/5 border-green-500/20';
    if (pressure > -25) return 'bg-red-500/5 border-red-500/20';
    if (pressure > -50) return 'bg-red-500/10 border-red-500/30';
    return 'bg-red-500/20 border-red-500/40';
  };

  const getPressureTextColor = (pressure: number): string => {
    if (pressure > 0) return 'text-green-500';
    if (pressure < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  const formatVolume = (vol: number): string => {
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
    return vol.toString();
  };

  return (
    <Card className="bg-black/40 border-indigo-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Live Institutional Order Flow
          </CardTitle>
          <div className="text-xs text-muted-foreground font-mono">
            {data?.totalActivity || 0} trades • {data?.timeWindow || 0}s window
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-muted-foreground font-mono text-sm">Loading order flow...</div>
          </div>
        ) : !data?.data.length ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-muted-foreground font-mono text-sm">No institutional activity detected</div>
          </div>
        ) : (
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {/* Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-3 py-2 bg-black/60 border border-indigo-500/20 rounded font-mono text-xs text-muted-foreground sticky top-0">
              <div>ASSET</div>
              <div className="text-right">PRESSURE</div>
              <div className="text-right">NET FLOW</div>
              <div className="text-right">BUY/SELL</div>
              <div className="text-right">VOLUME</div>
            </div>

            {/* Order Flow Matrix */}
            {data.data.map((flow) => (
              <div
                key={flow.assetId}
                data-testid={`orderflow-${flow.symbol}`}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-3 py-2 border rounded transition-colors hover-elevate active-elevate-2 ${getPressureColor(flow.pressure)}`}
              >
                {/* Asset Info */}
                <div className="flex flex-col justify-center min-w-0">
                  <div className="font-mono text-sm font-semibold text-foreground truncate" data-testid={`text-symbol-${flow.symbol}`}>
                    {flow.symbol}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground truncate" data-testid={`text-name-${flow.assetId}`}>
                    {flow.name}
                  </div>
                </div>

                {/* Pressure Gauge */}
                <div className="flex items-center justify-end">
                  <div className={`font-mono text-sm font-bold ${getPressureTextColor(flow.pressure)}`} data-testid={`text-pressure-${flow.assetId}`}>
                    {flow.pressure > 0 ? '+' : ''}{flow.pressure.toFixed(0)}%
                  </div>
                  {flow.pressure > 0 ? (
                    <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 ml-1 text-red-500" />
                  )}
                </div>

                {/* Net Flow */}
                <div className={`font-mono text-sm text-right ${flow.netFlow >= 0 ? 'text-green-500' : 'text-red-500'}`} data-testid={`text-netflow-${flow.assetId}`}>
                  {flow.netFlow >= 0 ? '+' : ''}{formatVolume(flow.netFlow)}
                </div>

                {/* Buy/Sell Orders */}
                <div className="font-mono text-xs text-right text-muted-foreground space-y-0.5" data-testid={`text-orders-${flow.assetId}`}>
                  <div className="text-green-500">{flow.buyOrders} BUY</div>
                  <div className="text-red-500">{flow.sellOrders} SELL</div>
                </div>

                {/* Total Volume */}
                <div className="font-mono text-sm text-right text-foreground" data-testid={`text-volume-${flow.assetId}`}>
                  {formatVolume(flow.totalVolume)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Footer */}
        {data && data.data.length > 0 && (
          <div className="pt-2 mt-2 border-t border-indigo-500/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-muted-foreground font-mono">ASSETS TRACKED</div>
                <div className="text-lg font-mono font-bold text-foreground" data-testid="text-assets-tracked">
                  {data.totalAssets}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-mono">BUY PRESSURE</div>
                <div className="text-lg font-mono font-bold text-green-500" data-testid="text-buy-pressure">
                  {data.data.filter(f => f.pressure > 0).length}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-mono">SELL PRESSURE</div>
                <div className="text-lg font-mono font-bold text-red-500" data-testid="text-sell-pressure">
                  {data.data.filter(f => f.pressure < 0).length}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
