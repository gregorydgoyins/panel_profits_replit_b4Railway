import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2, Link2, ArrowRightLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ArbitrageOpportunity {
  id: string;
  asset1: {
    id: number;
    symbol: string;
    name: string;
    price: number;
  };
  asset2: {
    id: number;
    symbol: string;
    name: string;
    price: number;
  };
  correlation: number;
  expectedSpread: number;
  currentSpread: number;
  divergence: number;
  profitPotential: number;
  confidence: number;
  timeWindow: number;
}

export default function ArbitrageScannerWidget() {
  const { data: opportunities, isLoading, error } = useQuery<ArbitrageOpportunity[]>({
    queryKey: ["/api/analytics/arbitrage-opportunities"],
    refetchInterval: 20000,
  });

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-400";
    if (confidence >= 0.6) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <Card className="p-4 bg-black/40 border-indigo-900/30" data-testid="widget-arbitrage-scanner">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center">
            <Link2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-100">Cross-Asset Arbitrage Scanner</h3>
            <p className="text-xs text-gray-500">Correlated asset pricing inefficiencies</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8 text-red-400 text-sm">
          Failed to load arbitrage opportunities
        </div>
      ) : (
        <div className="space-y-3">
          {opportunities?.slice(0, 6).map((opp) => (
            <div
              key={opp.id}
              className="p-3 rounded bg-black/20 border border-gray-800/50 hover-elevate"
              data-testid={`arbitrage-opp-${opp.id}`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs h-5 bg-emerald-500/20 text-emerald-400">
                  {opp.profitPotential.toFixed(2)}% PROFIT
                </Badge>
                <div className={`text-xs font-mono ${getConfidenceColor(opp.confidence)}`}>
                  {(opp.confidence * 100).toFixed(0)}% confidence
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="text-xs font-mono text-purple-400">{opp.asset1.symbol}</div>
                    <div className="text-xs text-gray-500 truncate">{opp.asset1.name}</div>
                    <div className="text-xs font-mono text-gray-100">${opp.asset1.price.toFixed(2)}</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <ArrowRightLeft className="w-4 h-4 text-gray-600" />
                    <div className="text-xs text-gray-500 mt-1">
                      {(opp.correlation * 100).toFixed(0)}% corr
                    </div>
                  </div>
                  
                  <div className="flex-1 text-right">
                    <div className="text-xs font-mono text-purple-400">{opp.asset2.symbol}</div>
                    <div className="text-xs text-gray-500 truncate">{opp.asset2.name}</div>
                    <div className="text-xs font-mono text-gray-100">${opp.asset2.price.toFixed(2)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800/50 text-xs">
                  <div>
                    <span className="text-gray-500">Spread</span>
                    <div className="font-mono text-emerald-400">{opp.currentSpread.toFixed(2)}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Expected</span>
                    <div className="font-mono text-gray-400">{opp.expectedSpread.toFixed(2)}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Window</span>
                    <div className="font-mono text-gray-400">{opp.timeWindow}h</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-800/50 flex items-center justify-between text-xs">
        <span className="text-gray-500">Statistical arbitrage detection</span>
        <span className="text-emerald-400 font-mono">{opportunities?.length || 0} opportunities</span>
      </div>
    </Card>
  );
}
