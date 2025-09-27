import React from 'react';
import { TrendingUp, Star } from 'lucide-react';

interface TopBuyRecommendationCardProps {
  symbol: string;
  name: string;
  assetType: string;
  currentPrice: number;
  targetPrice: number;
  description: string;
  marketActivity: string;
  onTradeClick: () => void;
  className?: string;
}

export function TopBuyRecommendationCard({
  symbol,
  name,
  assetType,
  currentPrice,
  targetPrice,
  description,
  marketActivity,
  onTradeClick,
  className = ''
}: TopBuyRecommendationCardProps) {
  return (
    <div className={`bg-slate-800/90 backdrop-blur-md rounded-xl p-5 shadow-xl hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] hover:border-green-400 hover:border-2 border border-green-500 transition-all hover:-translate-y-1 flex flex-col h-[400px] ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <TrendingUp className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold text-white">Top Buy Recommendation</h3>
      </div>
      
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-slate-800 rounded-full p-2">
          <Star className="h-6 w-6 text-yellow-400" />
        </div>
        <div>
          <h4 className="font-medium text-white">{name}</h4>
          <p className="text-sm text-gray-400">{symbol} • {assetType}</p>
        </div>
      </div>
      
      <div className="flex-grow">
        <p className="text-sm text-gray-300 mb-4">
          {description}
        </p>
      
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Current Price:</span>
            <span className="text-white">CC {currentPrice.toFixed(2)} per share</span>
          </div>
      
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Target Price:</span>
            <span className="text-white">CC {targetPrice.toFixed(2)} per share</span>
          </div>
      
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Market Activity:</span>
            <span className="text-white">{marketActivity}</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={onTradeClick}
        className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg transition-all hover:shadow-[0_0_25px_rgba(34,197,94,1.0)] hover:border-green-400 hover:border-2 border border-transparent focus-visible:shadow-[0_0_25px_rgba(34,197,94,1.0)] focus-visible:border-green-400 focus-visible:border-2"
      >
        Trade Now
      </button>
    </div>
  );
}

export default TopBuyRecommendationCard;