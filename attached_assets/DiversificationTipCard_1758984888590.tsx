import React from 'react';
import { BarChart2 } from 'lucide-react';

interface DiversificationTipCardProps {
  recommendation: {
    title: string;
    subtitle: string;
    description: string;
    currentAllocation: number;
    recommendedAllocation: string;
  };
  onExploreClick: () => void;
  className?: string;
}

export function DiversificationTipCard({
  recommendation,
  onExploreClick,
  className = ''
}: DiversificationTipCardProps) {
  return (
    <div className={`bg-slate-800/90 backdrop-blur-md rounded-xl p-5 shadow-xl hover:shadow-[0_0_25px_rgba(234,179,8,0.8)] hover:border-yellow-400 hover:border-2 border border-yellow-500 transition-all hover:-translate-y-1 flex flex-col h-[400px] ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <BarChart2 className="h-5 w-5 text-yellow-400" />
        <h3 className="font-semibold text-white">Diversification Tip</h3>
      </div>
      
      <div className="flex items-center space-x-3 mb-3">
        <div className="bg-slate-700 rounded-full p-2">
          <BarChart2 className="h-6 w-6 text-yellow-400" />
        </div>
        <div>
          <h4 className="font-medium text-white">{recommendation.title}</h4>
          <p className="text-sm text-gray-200">{recommendation.subtitle}</p>
        </div>
      </div>
      
      <div className="flex-grow">
        <p className="text-sm text-gray-200 mb-4">
          {recommendation.description}
        </p>
      
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300">Current Allocation:</span>
            <span className="text-white">{recommendation.currentAllocation}%</span>
          </div>
      
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300">Recommended:</span>
            <span className="text-yellow-300">{recommendation.recommendedAllocation}</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={onExploreClick}
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg transition-all font-medium hover:shadow-[0_0_25px_rgba(234,179,8,1.0)] hover:border-yellow-400 hover:border-2 border border-transparent focus-visible:shadow-[0_0_25px_rgba(234,179,8,1.0)] focus-visible:border-yellow-400 focus-visible:border-2"
      >
        Explore Golden Age Funds
      </button>
    </div>
  );
}

export default DiversificationTipCard;