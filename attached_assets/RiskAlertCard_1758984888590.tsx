import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

interface RiskAlertCardProps {
  alert: {
    title: string;
    subtitle: string;
    description: string;
    currentExposure: number;
    recommendedMax: number;
    severity: 'low' | 'medium' | 'high';
  };
  onReviewClick: () => void;
  className?: string;
}

export function RiskAlertCard({
  alert,
  onReviewClick,
  className = ''
}: RiskAlertCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-yellow-600';
      default: return 'text-orange-600';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-orange-400';
      case 'low': return 'text-yellow-400';
      default: return 'text-orange-400';
    }
  };

  return (
    <div className={`bg-slate-800/90 backdrop-blur-md rounded-xl p-5 shadow-xl hover:shadow-[0_0_25px_rgba(239,68,68,0.8)] hover:border-red-400 hover:border-2 border border-red-500 transition-all hover:-translate-y-1 flex flex-col h-[400px] ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <AlertTriangle className={`h-5 w-5 ${getSeverityColor(alert.severity)}`} />
        <h3 className="font-semibold text-white">Risk Alert</h3>
      </div>
      
      <div className="flex items-center space-x-3 mb-3">
        <div className="bg-slate-700 rounded-full p-2">
          <Shield className="h-6 w-6 text-orange-400" />
        </div>
        <div>
          <h4 className="font-medium text-white">{alert.title}</h4>
          <p className="text-sm text-gray-400">{alert.subtitle}</p>
        </div>
      </div>
      
      <div className="flex-grow">
        <p className="text-sm text-gray-300 mb-4">
          {alert.description}
        </p>
      
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Current Exposure:</span>
            <span className={getSeverityTextColor(alert.severity)}>{alert.currentExposure}%</span>
          </div>
      
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Recommended Max:</span>
            <span className="text-white">{alert.recommendedMax}%</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={onReviewClick}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-all font-medium hover:shadow-[0_0_25px_rgba(239,68,68,1.0)] hover:border-red-400 hover:border-2 border border-transparent focus-visible:shadow-[0_0_25px_rgba(239,68,68,1.0)] focus-visible:border-red-400 focus-visible:border-2"
      >
        Review Risk Profile
      </button>
    </div>
  );
}

export default RiskAlertCard;