import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

interface CreatorProfileProps {
  data?: any;
  isLoading?: boolean;
  error?: string;
  className?: string;
  timeRange?: string;
}

export default function CreatorProfile({ 
  data, 
  isLoading, 
  error, 
  className = '', 
  timeRange = '1d' 
}: CreatorProfileProps) {
  if (isLoading) {
    return (
      <div className={`bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 ${className}`}>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-gray-400">Loading creator data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 ${className}`}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-400 mb-2">⚠️ Creator Error</div>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Creator Profile</h3>
            <p className="text-gray-400 mb-4">Creator performance analytics would be displayed here</p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-sm text-gray-400">Performance</p>
                <p className="text-lg font-bold text-green-400">+12.5%</p>
              </div>
              
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-sm text-gray-400">Followers</p>
                <p className="text-lg font-bold text-blue-400">2.1K</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}