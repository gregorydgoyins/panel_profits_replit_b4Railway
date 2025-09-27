import React, { useState, useEffect } from 'react';
import { Star, Info } from 'lucide-react';
import { useSimulationStore } from '../../../store/simulationStore';
import { Tooltip } from '../../ui/Tooltip';

export function HotAssetsWidget() {
  const { liveMetrics, isRunning } = useSimulationStore();
  
  // Use fallback data if simulation metrics aren't available
  const hotAssetsCount = liveMetrics?.hotAssetsCount || 87;
  const totalAssetsCount = liveMetrics?.totalAssetsCount || 291;

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 shadow-xl hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent transition-all">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full bg-yellow-600/20">
          <Star className="h-6 w-6 icon-neutral" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-400">Hot Assets</p>
            <Tooltip content="Assets with high trading volume (>50K CC) or significant price movement in recent ticks">
              <Info className="h-3 w-3 text-gray-500" />
            </Tooltip>
          </div>
          <p className="text-xl font-bold text-white">{hotAssetsCount}/{totalAssetsCount}</p>
          <p className="text-xs text-neutral">
            {isRunning ? `${(hotAssetsCount / totalAssetsCount * 100).toFixed(1)}% trending` : `${(hotAssetsCount / totalAssetsCount * 100).toFixed(1)}% last session`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default HotAssetsWidget;