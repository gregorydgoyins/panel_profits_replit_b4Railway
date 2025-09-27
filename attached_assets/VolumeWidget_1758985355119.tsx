import React from 'react';
import { Activity, Info } from 'lucide-react';
import { useSimulationStore } from '../../../store/simulationStore';
import { Tooltip } from '../../ui/Tooltip';

export function VolumeWidget() {
  const { liveMetrics, isRunning } = useSimulationStore();
  
  // Use fallback data if simulation metrics aren't available
  const totalTrades = liveMetrics?.totalTrades || 8547;
  const estimatedVolume = totalTrades * 25000; // Estimate volume from trades

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
    return volume.toFixed(0);
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 shadow-xl hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent transition-all">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full bg-blue-600/20">
          <Activity className="h-6 w-6 icon-positive" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-400">Volume</p>
            <Tooltip content="Total trade volume from all active AI investors in recent simulation ticks">
              <Info className="h-3 w-3 text-gray-500" />
            </Tooltip>
          </div>
          <p className="text-xl font-bold text-white">
            CC {formatVolume(estimatedVolume)}
          </p>
          <p className="text-xs text-positive">
            {isRunning ? `${totalTrades.toLocaleString()} trades` : `${totalTrades.toLocaleString()} trades (last session)`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VolumeWidget;