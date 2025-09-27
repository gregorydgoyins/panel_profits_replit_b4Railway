import React, { useEffect } from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { useSimulationStore } from '../../../store/simulationStore';
import { Tooltip } from '../../ui/Tooltip';

export function MarketCapWidget() {
  const { liveMetrics, marketState } = useSimulationStore();
  
  // Get real market cap from simulation or use fallback
  const totalMarketCap = liveMetrics?.totalMarketCap || 125000000000; // 125B fallback
  const activeTradersCount = liveMetrics?.activeTradersCount || 2847;
  const totalInvestors = liveMetrics?.totalInvestors || 10000;
  const totalAssetsCount = liveMetrics?.totalAssetsCount || 291;
  
  // Debug logging
  useEffect(() => {
    if (liveMetrics) {
      console.log('MarketCapWidget - Market Cap:', totalMarketCap, 'Assets:', totalAssetsCount);
    }
  }, [liveMetrics, totalMarketCap, totalAssetsCount]);
  
  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T CC`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B CC`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M CC`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K CC`;
    return `${value.toFixed(2)} CC`;
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 shadow-xl relative group hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent transition-all">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full bg-green-600/20">
          <TrendingUp className="h-6 w-6 icon-positive" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-400">Market Cap</p>
            <Tooltip content="Total market capitalization of all tradeable comic assets">
              <Info className="h-3 w-3 text-gray-500" />
            </Tooltip>
          </div>
          <p className="text-xl font-bold text-white">
            {formatMarketCap(totalMarketCap)}
          </p>
          <p className="text-xs text-positive">
            {Math.min(activeTradersCount, totalInvestors)}/{totalInvestors} active • {totalAssetsCount} assets
          </p>
        </div>
      </div>
    </div>
  );
}