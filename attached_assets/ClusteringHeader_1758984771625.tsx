import React from 'react';
import { 
  Brain, Download, Shuffle, BarChart2, Network, Eye, EyeOff,
  Lightbulb, Star, Crown 
} from 'lucide-react';
import { SubscriptionTier, SubscriptionFeatures } from '../../types';

interface ClusteringHeaderProps {
  currentTier: SubscriptionTier;
  features: SubscriptionFeatures;
  viewMode: 'grid' | 'network';
  setViewMode: (mode: 'grid' | 'network') => void;
  showSentiment: boolean;
  setShowSentiment: (show: boolean) => void;
  onExport: () => void;
  onRecluster: () => void;
}

export function ClusteringHeader({
  currentTier,
  features,
  viewMode,
  setViewMode,
  showSentiment,
  setShowSentiment,
  onExport,
  onRecluster
}: ClusteringHeaderProps) {
  const getTierIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'basic': return <Lightbulb className="h-5 w-5 text-blue-400" />;
      case 'standard': return <Star className="h-5 w-5 text-yellow-400" />;
      case 'premium': return <Crown className="h-5 w-5 text-orange-300" />;
    }
  };

  const getTierColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'basic': return 'bg-blue-600';
      case 'standard': return 'bg-yellow-600';
      case 'premium': return 'bg-orange-600';
    }
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">AI-Powered Market Intelligence</h2>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getTierColor(currentTier)} text-white`}>
            {getTierIcon(currentTier)}
            <span className="text-sm font-medium capitalize">{currentTier} Tier</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {features.advancedVisualization && (
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-slate-700/50 text-gray-300'
                }`}
                title="Grid View"
              >
                <BarChart2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('network')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'network' ? 'bg-indigo-600 text-white' : 'bg-slate-700/50 text-gray-300'
                }`}
                title="Network View"
              >
                <Network className="h-5 w-5" />
              </button>
            </div>
          )}
          
          {features.sentimentAnalysis && (
            <button
              onClick={() => setShowSentiment(!showSentiment)}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 rounded-lg text-gray-300 hover:text-white transition-colors"
              title="Toggle Sentiment Display"
            >
              {showSentiment ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span className="text-sm">Sentiment</span>
            </button>
          )}
          
          {features.exportCapabilities && (
            <button
              onClick={onExport}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              title="Export Clustering Results"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          )}
          
          <button
            onClick={onRecluster}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            title="Re-run AI Clustering"
          >
            <Shuffle className="h-4 w-4" />
            <span>Re-cluster</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClusteringHeader;