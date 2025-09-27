import React from 'react';
import { Shield, Info } from 'lucide-react';

interface DiversificationScoreProps {
  score: number;
  className?: string;
  showDetails?: boolean;
}

export function DiversificationScore({ score, className = '', showDetails = true }: DiversificationScoreProps) {
  // Determine score level and colors
  const getScoreLevel = () => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-400', glowColor: 'shadow-[0_0_15px_rgba(34,197,94,0.7)]' };
    if (score >= 60) return { level: 'Good', color: 'text-blue-400', glowColor: 'shadow-[0_0_15px_rgba(96,165,250,0.7)]' };
    if (score >= 40) return { level: 'Moderate', color: 'text-yellow-400', glowColor: 'shadow-[0_0_15px_rgba(234,179,8,0.7)]' };
    if (score >= 20) return { level: 'Poor', color: 'text-orange-400', glowColor: 'shadow-[0_0_15px_rgba(249,115,22,0.7)]' };
    return { level: 'Critical', color: 'text-red-400', glowColor: 'shadow-[0_0_15px_rgba(239,68,68,0.7)]' };
  };

  const { level, color, glowColor } = getScoreLevel();

  return (
    <div className={`bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 transition-all hover:${glowColor} ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <Shield className={`h-5 w-5 ${color}`} />
        <h3 className="font-medium text-white">Diversification Score</h3>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-300">Score:</span>
        <span className={`text-xl font-bold ${color}`}>{score}/100</span>
      </div>
      
      <div className="w-full bg-slate-600 rounded-full h-2 mb-3">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            score >= 60 ? 'bg-green-500' : 
            score >= 40 ? 'bg-yellow-500' : 
            'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      
      {showDetails && (
        <div className="flex items-start space-x-2 mt-2">
          <Info className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-300">
            Your portfolio has <span className={color}>{level.toLowerCase()}</span> diversification across asset types.
            {score < 60 && ' Consider adding more variety to reduce risk.'}
          </p>
        </div>
      )}
    </div>
  );
}

export default DiversificationScore;