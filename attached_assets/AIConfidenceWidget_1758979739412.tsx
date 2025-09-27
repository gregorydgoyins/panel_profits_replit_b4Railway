import React from 'react';
import { Brain, Info } from 'lucide-react';
import { useSimulationStore } from '../../../store/simulationStore';
import { Tooltip } from '../../ui/Tooltip';

export function AIConfidenceWidget() {
  const { liveMetrics, isRunning } = useSimulationStore();
  
  // Use fallback data if simulation metrics aren't available
  const aiConfidence = liveMetrics?.aiConfidence || 87.5;

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 shadow-xl hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent transition-all">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full bg-purple-600/20">
          <Brain className="h-6 w-6 icon-neutral" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-400">AI Confidence</p>
            <Tooltip content="AI prediction accuracy based on market trend clarity, volatility levels, and data quality from active trading">
              <Info className="h-3 w-3 text-gray-500" />
            </Tooltip>
          </div>
          <p className="text-xl font-bold text-white">{aiConfidence.toFixed(0)}%</p>
          <p className="text-xs text-neutral">
            {isRunning ? (aiConfidence > 85 ? 'High accuracy' : aiConfidence > 75 ? 'Good accuracy' : 'Moderate accuracy') : (aiConfidence > 85 ? 'High accuracy' : aiConfidence > 75 ? 'Good accuracy' : 'Moderate accuracy')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AIConfidenceWidget;