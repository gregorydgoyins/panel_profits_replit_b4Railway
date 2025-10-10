import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2, Share2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FractalPattern {
  id: string;
  assetId: number;
  symbol: string;
  assetName: string;
  currentPrice: number;
  patternType: "head_shoulders" | "double_top" | "double_bottom" | "triangle" | "wedge" | "flag";
  fractalDimension: number;
  selfSimilarity: number;
  timeframe: string;
  completionPercent: number;
  projectedTarget: number;
  projectedChange: number;
  reliability: number;
}

export default function FractalPatternWidget() {
  const { data: patterns, isLoading, error } = useQuery<FractalPattern[]>({
    queryKey: ["/api/analytics/fractal-patterns"],
    refetchInterval: 30000,
  });

  const getPatternLabel = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 0.85) return "text-green-400";
    if (reliability >= 0.70) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <Card className="p-4 bg-black/40 border-indigo-900/30" data-testid="widget-fractal-pattern">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-violet-500/20 flex items-center justify-center">
            <Share2 className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm  text-gray-100">Fractal Pattern Recognition</h3>
            <p className="text-xs text-gray-500">Self-similar price structure detection</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8 text-red-400 text-sm">
          Failed to load fractal patterns
        </div>
      ) : (
        <div className="space-y-2">
          {patterns?.slice(0, 7).map((pattern) => (
            <div
              key={pattern.id}
              className="p-3 rounded bg-black/20 border border-gray-800/50 hover-elevate"
              data-testid={`fractal-pattern-${pattern.id}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-violet-400">{pattern.symbol}</span>
                  <Badge variant="secondary" className="text-xs h-5 bg-violet-500/20 text-violet-400">
                    {getPatternLabel(pattern.patternType)}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  <span className={`text-xs font-mono ${getReliabilityColor(pattern.reliability)}`}>
                    {(pattern.reliability * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-2 truncate">{pattern.assetName}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Pattern Completion</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                        style={{ width: `${pattern.completionPercent}%` }}
                      />
                    </div>
                    <span className="font-mono text-violet-400">{pattern.completionPercent}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Current</span>
                    <div className="font-mono text-gray-100">${pattern.currentPrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Target</span>
                    <div className="font-mono text-gray-100">${pattern.projectedTarget.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Move</span>
                    <div className={`font-mono ${pattern.projectedChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pattern.projectedChange >= 0 ? '+' : ''}{pattern.projectedChange.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Frame</span>
                    <div className="font-mono text-gray-400">{pattern.timeframe}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-800/50">
                  <span className="text-gray-500">Fractal Dimension: {pattern.fractalDimension.toFixed(3)}</span>
                  <span className="text-violet-400">Similarity: {(pattern.selfSimilarity * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-800/50 flex items-center justify-between text-xs">
        <span className="text-gray-500">Geometric pattern analysis</span>
        <span className="text-violet-400 font-mono">{patterns?.length || 0} patterns</span>
      </div>
    </Card>
  );
}
