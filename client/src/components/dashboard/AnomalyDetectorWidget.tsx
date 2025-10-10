import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2, AlertTriangle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Anomaly {
  id: string;
  assetId: number;
  symbol: string;
  assetName: string;
  currentPrice: number;
  anomalyType: "volume_spike" | "price_discontinuity" | "pattern_break" | "volatility_surge";
  severity: "low" | "medium" | "high" | "critical";
  deviationScore: number;
  expectedValue: number;
  actualValue: number;
  probability: number;
  detectedAt: string;
  description: string;
}

export default function AnomalyDetectorWidget() {
  const { data: anomalies, isLoading, error } = useQuery<Anomaly[]>({
    queryKey: ["/api/analytics/anomalies"],
    refetchInterval: 10000,
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const getTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <Card className="p-4 bg-black/40 border-indigo-900/30" data-testid="widget-anomaly-detector">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm  text-gray-100">Time-Series Anomaly Detector</h3>
            <p className="text-xs text-gray-500">ML-powered unusual pattern detection</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-red-400" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8 text-red-400 text-sm">
          Failed to load anomaly detection data
        </div>
      ) : (
        <div className="space-y-2">
          {anomalies?.slice(0, 8).map((anomaly) => (
            <div
              key={anomaly.id}
              className="p-3 rounded bg-black/20 border border-gray-800/50 hover-elevate"
              data-testid={`anomaly-${anomaly.id}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-red-400">{anomaly.symbol}</span>
                  <Badge variant="secondary" className={`text-xs h-5 ${getSeverityColor(anomaly.severity)}`}>
                    {anomaly.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(anomaly.detectedAt), { addSuffix: true })}
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-2 truncate">{anomaly.assetName}</p>

              <div className="p-2 rounded bg-black/30 border border-red-900/30 mb-2">
                <div className="text-xs text-gray-400 mb-1">{getTypeLabel(anomaly.anomalyType)}</div>
                <p className="text-xs text-gray-300">{anomaly.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Deviation</span>
                  <div className="font-mono text-red-400">{anomaly.deviationScore.toFixed(2)}σ</div>
                </div>
                <div>
                  <span className="text-gray-500">Expected</span>
                  <div className="font-mono text-gray-400">{anomaly.expectedValue.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Actual</span>
                  <div className="font-mono text-gray-100">{anomaly.actualValue.toFixed(2)}</div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">Probability</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                      style={{ width: `${Math.min(100, anomaly.probability * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-red-400">
                    {(anomaly.probability * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-800/50 flex items-center justify-between text-xs">
        <span className="text-gray-500">Real-time ML detection</span>
        <span className="text-red-400 font-mono">{anomalies?.length || 0} anomalies</span>
      </div>
    </Card>
  );
}
