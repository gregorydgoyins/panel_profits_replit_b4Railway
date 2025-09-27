import React from 'react';
import { Users, Info } from 'lucide-react';
import { useSimulationStore } from '../../../store/simulationStore';
import { Tooltip } from '../../ui/Tooltip';

export function ActiveTradersWidget() {
  const { liveMetrics, isRunning } = useSimulationStore();

  // Use fallback data if simulation metrics aren't available
  const activeTradersCount = liveMetrics?.activeTradersCount || 2847;
  const totalInvestors = liveMetrics?.totalInvestors || 10000;
  const dayTradersCount = liveMetrics?.dayTradersCount || 1523;

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 shadow-xl relative group hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent transition-all">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full bg-orange-600/20">
          <Users className="h-6 w-6 icon-neutral" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-400">Day Traders</p>
            <Tooltip content="AI investors who made trades in the last 10 simulation ticks (day traders & churners, not HODLers)">
              <Info className="h-3 w-3 text-gray-500" />
            </Tooltip>
          </div>
          <p className="text-xl font-bold text-white">
            {Math.min(activeTradersCount, totalInvestors)}/{totalInvestors}
          </p>
          <p className="text-xs text-neutral">
            {isRunning ? `${(Math.min(activeTradersCount, totalInvestors) / totalInvestors * 100).toFixed(1)}% active` : `${(Math.min(activeTradersCount, totalInvestors) / totalInvestors * 100).toFixed(1)}% last session`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ActiveTradersWidget;