import React from 'react';
import { Lightbulb, TrendingUp, Users, Clock } from 'lucide-react';

export function IdeasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Lightbulb className="h-8 w-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">Trading Ideas</h1>
        </div>
      </div>

      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">Market Ideas & Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="h-6 w-6 text-green-400" />
              <h3 className="font-semibold text-white">Bullish Trends</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Identify emerging bullish patterns and momentum opportunities in the market.
            </p>
          </div>
          
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <div className="flex items-center space-x-3 mb-3">
              <Users className="h-6 w-6 text-blue-400" />
              <h3 className="font-semibold text-white">Community Ideas</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Discover trading ideas and strategies shared by the community.
            </p>
          </div>
          
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <div className="flex items-center space-x-3 mb-3">
              <Clock className="h-6 w-6 text-purple-400" />
              <h3 className="font-semibold text-white">Market Timing</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Analyze optimal entry and exit points for your trading strategies.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Featured Ideas</h3>
          <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Lightbulb className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-400">Trading ideas and analysis coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}