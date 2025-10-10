import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2, Microscope, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MicrostructureMetrics {
  assetId: number;
  symbol: string;
  assetName: string;
  currentPrice: number;
  bidAskSpread: number;
  spreadBps: number;
  orderImbalance: number;
  toxicFlow: number;
  informedTrading: number;
  marketDepth: number;
  priceEfficiency: number;
  liquidityScore: number;
  microstructureAlpha: number;
}

export default function MarketMicrostructureWidget() {
  const { data: metrics, isLoading, error } = useQuery<MicrostructureMetrics[]>({
    queryKey: ["/api/analytics/microstructure"],
    refetchInterval: 5000,
  });

  const getImbalanceColor = (imbalance: number) => {
    if (imbalance > 0.3) return "text-green-400";
    if (imbalance < -0.3) return "text-red-400";
    return "text-gray-400";
  };

  const getAlphaColor = (alpha: number) => {
    if (alpha > 0.5) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (alpha > 0) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  return (
    <Card className="p-4 bg-black/40 border-indigo-900/30" data-testid="widget-microstructure">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-teal-500/20 flex items-center justify-center">
            <Microscope className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <h3 className="text-sm  text-gray-100">Market Microstructure Analyzer</h3>
            <p className="text-xs text-gray-500">Deep order flow & mechanics analysis</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8 text-red-400 text-sm">
          Failed to load microstructure data
        </div>
      ) : (
        <div className="space-y-3">
          {metrics?.slice(0, 6).map((metric) => (
            <div
              key={metric.assetId}
              className="p-3 rounded bg-black/20 border border-gray-800/50 hover-elevate"
              data-testid={`microstructure-${metric.assetId}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-teal-400">{metric.symbol}</span>
                  <Badge variant="secondary" className={`text-xs h-5 ${getAlphaColor(metric.microstructureAlpha)}`}>
                    α {metric.microstructureAlpha >= 0 ? '+' : ''}{metric.microstructureAlpha.toFixed(3)}
                  </Badge>
                </div>
                <div className="text-xs font-mono text-gray-100">${metric.currentPrice.toFixed(2)}</div>
              </div>

              <p className="text-xs text-gray-400 mb-3 truncate">{metric.assetName}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Spread</span>
                    <span className="font-mono text-gray-100">{metric.spreadBps.toFixed(1)} bps</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Imbalance</span>
                    <span className={`font-mono ${getImbalanceColor(metric.orderImbalance)}`}>
                      {(metric.orderImbalance * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Toxic Flow</span>
                    <div className="flex items-center gap-1">
                      {metric.toxicFlow > 0.6 && <AlertCircle className="w-3 h-3 text-red-400" />}
                      <span className={`font-mono ${metric.toxicFlow > 0.6 ? 'text-red-400' : 'text-gray-400'}`}>
                        {(metric.toxicFlow * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Informed</span>
                    <span className="font-mono text-purple-400">{(metric.informedTrading * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Depth</span>
                    <span className="font-mono text-gray-100">${(metric.marketDepth / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Efficiency</span>
                    <span className="font-mono text-teal-400">{(metric.priceEfficiency * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-800/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Liquidity Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
                        style={{ width: `${metric.liquidityScore * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-teal-400">{(metric.liquidityScore * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-800/50 flex items-center justify-between text-xs">
        <span className="text-gray-500">Sub-tick precision analysis</span>
        <span className="text-teal-400 font-mono">{metrics?.length || 0} assets</span>
      </div>
    </Card>
  );
}
