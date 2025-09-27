import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Star } from 'lucide-react';
import { IdeaCluster, SubscriptionFeatures } from '../../types';

interface IdeaClusterCardProps {
  cluster: IdeaCluster;
  isSelected: boolean;
  features: SubscriptionFeatures;
  showSentiment: boolean;
  currentTier: 'basic' | 'standard' | 'premium';
  onClick: (clusterId: string) => void;
}

export function IdeaClusterCard({
  cluster,
  isSelected,
  features,
  showSentiment,
  currentTier,
  onClick
}: IdeaClusterCardProps) {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'border-green-700/50 bg-green-900/20';
      case 'negative': return 'border-red-700/50 bg-red-900/20';
      default: return 'border-yellow-700/50 bg-yellow-900/20';
    }
  };

  return (
    <div
      onClick={() => onClick(cluster.id)}
      className={`bg-slate-800/90 backdrop-blur-md rounded-xl p-5 shadow-xl hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all hover:-translate-y-1 cursor-pointer
        ${isSelected ? 'ring-2 ring-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]' : ''}
        ${features.sentimentAnalysis && cluster.sentiment ? getSentimentColor(cluster.sentiment) : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{cluster.name}</h3>
          <p className="text-sm text-gray-400">{cluster.ideas.length} ideas</p>
        </div>
        <div className="flex items-center space-x-2">
          {features.sentimentAnalysis && cluster.sentiment && showSentiment && (
            <div className="flex items-center space-x-1">
              {getSentimentIcon(cluster.sentiment)}
            </div>
          )}
          <span className="text-xs text-indigo-400">
            {(cluster.confidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4">{cluster.description}</p>

      {/* Key terms */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Key Terms:</p>
        <div className="flex flex-wrap gap-1">
          {cluster.keyTerms.slice(0, currentTier === 'premium' ? 8 : 3).map((term, index) => (
            <span key={index} className="px-2 py-1 bg-indigo-900/50 text-indigo-200 rounded text-xs">
              {term}
            </span>
          ))}
          {cluster.keyTerms.length > (currentTier === 'premium' ? 8 : 3) && (
            <span className="px-2 py-1 bg-slate-700/50 text-gray-400 rounded text-xs">
              +{cluster.keyTerms.length - (currentTier === 'premium' ? 8 : 3)} more
            </span>
          )}
        </div>
      </div>

      {/* Ideas preview */}
      <div className="space-y-2">
        {cluster.ideas.slice(0, 3).map((idea) => (
          <div key={idea.id} className="bg-slate-700/50 p-2 rounded border border-slate-600/50">
            <p className="text-white text-sm font-medium">{idea.title}</p>
            <p className="text-gray-400 text-xs line-clamp-1">{idea.content}</p>
          </div>
        ))}
        {cluster.ideas.length > 3 && (
          <p className="text-xs text-gray-400 text-center">
            +{cluster.ideas.length - 3} more ideas
          </p>
        )}
      </div>

      {/* Cluster actions */}
      {features.customClusterMerging && (
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded text-xs transition-colors">
            Merge
          </button>
          <button className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-1 px-3 rounded text-xs transition-colors">
            Split
          </button>
        </div>
      )}
    </div>
  );
}

export default IdeaClusterCard;