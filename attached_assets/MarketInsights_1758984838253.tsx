import React, { useState } from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, BarChart2, Star, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMarketInsights } from '../../hooks/useMarketInsights';

interface MarketInsight {
  id: string;
  title: string;
  description: string;
  category: 'opportunity' | 'trend' | 'warning' | 'recommendation';
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  timeframe: string;
  relatedAssets: Array<{
    symbol: string;
    type: 'character' | 'creator' | 'comic' | 'publisher';
    expectedMove?: string;
  }>;
}

interface MarketInsightsProps {
  className?: string;
}

export default function MarketInsights({ className = '' }: MarketInsightsProps) {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const { data: insights, loading: isLoading } = useMarketInsights({
    symbols: ['ASM300', 'SPDR', 'TMFS', 'BATM', 'AF15'],
    enabled: true
  });

  const generateComicMarketInsights = (): MarketInsight[] => {
    return [
      {
        id: 'spider-verse-expansion',
        title: 'Spider-Verse Media Expansion',
        description: 'Multiple Spider-Man projects announced across film and TV, driving strong demand for related assets.',
        category: 'opportunity',
        impact: 'high',
        confidence: 88,
        timeframe: '2-4 weeks',
        relatedAssets: [
          { symbol: 'SPDR', type: 'character', expectedMove: '+12-18%' },
          { symbol: 'AF15', type: 'comic', expectedMove: '+8-15%' },
          { symbol: 'ASM300', type: 'comic', expectedMove: '+10-20%' }
        ]
      },
      {
        id: 'creator-bond-strength',
        title: 'Creator Bond Market Strengthening',
        description: 'Increased institutional interest in creator bonds as stable income generators with limited comic market correlation.',
        category: 'trend',
        impact: 'medium',
        confidence: 82,
        timeframe: '1-2 months',
        relatedAssets: [
          { symbol: 'TMFB', type: 'creator', expectedMove: '+3-5%' },
          { symbol: 'JLEB', type: 'creator', expectedMove: '+2-4%' }
        ]
      },
      {
        id: 'golden-age-overvaluation',
        title: 'Golden Age Valuation Alert',
        description: 'AI analysis suggests some Golden Age comics trading above intrinsic value based on historical correlation patterns.',
        category: 'warning',
        impact: 'medium',
        confidence: 76,
        timeframe: '3-6 months',
        relatedAssets: [
          { symbol: 'ACM1', type: 'comic', expectedMove: 'Risk of -5-10%' },
          { symbol: 'DTM27', type: 'comic', expectedMove: 'Risk of -3-8%' }
        ]
      },
      {
        id: 'diversification-opportunity',
        title: 'Portfolio Diversification Signal',
        description: 'Current market conditions favor increased allocation to villain character stocks for optimal risk-adjusted returns.',
        category: 'recommendation',
        impact: 'medium',
        confidence: 85,
        timeframe: '1-3 months',
        relatedAssets: [
          { symbol: 'JOKR', type: 'character', expectedMove: '+5-12%' },
          { symbol: 'LEXL', type: 'character', expectedMove: '+4-8%' }
        ]
      }
    ];
  };

  const marketInsights = generateComicMarketInsights();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'opportunity': return <Star className="h-5 w-5 icon-positive" />;
      case 'trend': return <TrendingUp className="h-5 w-5 icon-positive" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 icon-neutral" />;
      case 'recommendation': return <Target className="h-5 w-5 icon-neutral" />;
      default: return <BarChart2 className="h-5 w-5 icon-neutral" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'opportunity': return 'status-positive';
      case 'trend': return 'status-positive';
      case 'warning': return 'status-neutral';
      case 'recommendation': return 'status-neutral';
      default: return 'status-neutral';
    }
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-red-900/50 text-red-200 border-red-700/50',
      medium: 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50',
      low: 'bg-green-900/50 text-green-200 border-green-700/50'
    };
    return colors[impact as keyof typeof colors] || colors.medium;
  };

  if (isLoading) {
    return (
      <div className={`bg-slate-800/90 rounded-xl p-6 border border-slate-700/30 ${className}`}>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500" />
          <span className="ml-3 text-gray-400">Analyzing market patterns...</span>
        </div>
      </div>
    );
  }

  const convertToMarketInsights = (): MarketInsight[] => {
    if (!insights || !Array.isArray(insights)) return marketInsights;
    
    return insights.map((insight, index) => ({
      id: `insight-${index}`,
      title: `${insight.symbol} Market Outlook`,
      description: insight.summary,
      category: insight.score > 0.8 ? 'opportunity' : insight.score < 0.6 ? 'warning' : 'trend',
      impact: insight.score > 0.85 ? 'high' : insight.score > 0.7 ? 'medium' : 'low',
      confidence: Math.round(insight.score * 100),
      timeframe: '1-2 weeks',
      relatedAssets: [{
        symbol: insight.symbol,
        type: insight.symbol.includes('ASM') || insight.symbol.includes('AF') ? 'comic' : 
              insight.symbol.includes('FS') ? 'creator' : 'character',
        expectedMove: insight.score > 0.8 ? '+5-12%' : insight.score < 0.6 ? 'Risk of -3-8%' : '+2-5%'
      }]
    }));
  };

  const displayInsights = insights ? convertToMarketInsights() : marketInsights;
  
  return (
    <div className={`bg-slate-800/90 rounded-xl p-6 border border-slate-700/30 hover:shadow-[0_0_15px_rgba(251,146,60,0.3)] transition-all hover:-translate-y-1 ${className}`}>
      <div className="flex items-center space-x-2 mb-5">
        <Brain className="h-6 w-6 text-orange-300" />
        <h3 className="font-semibold text-white text-lg">AI Market Intelligence</h3>
        <div className="ml-auto">
          <span className="px-2 py-1 bg-orange-900/50 text-orange-200 rounded-full text-xs border border-orange-700/50">
            Real-time Analysis
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {displayInsights.map((insight) => (
          <div 
            key={insight.id}
            onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${getCategoryColor(insight.category)} hover:shadow-lg ${
              selectedInsight === insight.id ? 'ring-2 ring-orange-500/50' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(insight.category)}
                <h4 className="font-medium text-white">{insight.title}</h4>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactBadge(insight.impact)}`}>
                  {insight.impact.toUpperCase()}
                </span>
                <span className="text-xs text-gray-400">{insight.confidence}%</span>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {insight.relatedAssets.slice(0, 3).map((asset, index) => (
                  <Link
                    key={index}
                    to={`/${asset.type}/${asset.symbol}`}
                    className="px-2 py-1 bg-slate-600/50 text-gray-300 rounded text-xs hover:bg-slate-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {asset.symbol}
                  </Link>
                ))}
                {insight.relatedAssets.length > 3 && (
                  <span className="px-2 py-1 bg-slate-600/50 text-gray-400 rounded text-xs">
                    +{insight.relatedAssets.length - 3} more
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{insight.timeframe}</span>
            </div>
            
            {selectedInsight === insight.id && (
              <div className="mt-3 pt-3 border-t border-slate-600/30">
                <h5 className="font-medium text-white mb-2">Expected Asset Movements:</h5>
                <div className="space-y-1">
                  {insight.relatedAssets.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <Link
                        to={`/${asset.type}/${asset.symbol}`}
                        className="text-indigo-400 hover:text-indigo-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {asset.symbol} ({asset.type})
                      </Link>
                      {asset.expectedMove && (
                        <span className={`${
                          asset.expectedMove.includes('+') ? 'text-green-400' : 
                          asset.expectedMove.includes('Risk') ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {asset.expectedMove}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-5 pt-4 border-t border-slate-600/30">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            <span className="text-orange-300 font-medium">
              {displayInsights.filter(i => i.category === 'opportunity').length}
            </span>
            <span> opportunities, </span>
            <span className="text-yellow-300 font-medium">
              {displayInsights.filter(i => i.category === 'warning').length}
            </span>
            <span> warnings detected</span>
          </div>
          <Link 
            to="/ideas"
            className="text-orange-300 hover:text-orange-200 text-sm font-medium"
          >
            Full AI Analysis →
          </Link>
        </div>
      </div>
    </div>
  );
}