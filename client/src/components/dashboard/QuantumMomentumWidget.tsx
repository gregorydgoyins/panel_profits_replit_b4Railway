import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2, TrendingUp, Zap, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MomentumSignal {
  assetId: number;
  symbol: string;
  assetName: string;
  currentPrice: number;
  momentumScore: number;
  accelerationFactor: number;
  quantumState: "accumulation" | "distribution" | "neutral" | "breakout";
  signalStrength: number;
  projectedMove: number;
}

export default function QuantumMomentumWidget() {
  const { data: signals, isLoading, error } = useQuery<MomentumSignal[]>({
    queryKey: ["/api/analytics/quantum-momentum"],
    refetchInterval: 15000,
  });

  const getStateColor = (state: string) => {
    switch (state) {
      case "breakout": return "text-green-400";
      case "accumulation": return "text-blue-400";
      case "distribution": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case "breakout": return <Zap className="w-3 h-3" />;
      case "accumulation": return <TrendingUp className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  return (
    <Card className="p-4 bg-black/40 border-indigo-900/30" data-testid="widget-quantum-momentum">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-100">Quantum Momentum Detector</h3>
            <p className="text-xs text-gray-500">Pre-trend phase shift analysis</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8 text-red-400 text-sm">
          Failed to load quantum momentum signals
        </div>
      ) : (
        <div className="space-y-2">
          {signals?.slice(0, 8).map((signal) => (
            <div
              key={signal.assetId}
              className="flex items-center justify-between p-2 rounded bg-black/20 border border-gray-800/50 hover-elevate"
              data-testid={`momentum-signal-${signal.assetId}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-indigo-400">{signal.symbol}</span>
                  <Badge variant="secondary" className="text-xs h-5">
                    {signal.quantumState.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400 truncate">{signal.assetName}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-mono text-gray-100">
                    ${signal.currentPrice.toFixed(2)}
                  </div>
                  <div className={`text-xs font-mono ${signal.projectedMove >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {signal.projectedMove >= 0 ? '+' : ''}{signal.projectedMove.toFixed(2)}%
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className={`${getStateColor(signal.quantumState)}`}>
                    {getStateIcon(signal.quantumState)}
                  </div>
                  <div className="w-12 h-1 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{ width: `${Math.min(100, signal.signalStrength * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-800/50 flex items-center justify-between text-xs">
        <span className="text-gray-500">Real-time momentum analysis</span>
        <span className="text-indigo-400 font-mono">{signals?.length || 0} signals</span>
      </div>
    </Card>
  );
}
