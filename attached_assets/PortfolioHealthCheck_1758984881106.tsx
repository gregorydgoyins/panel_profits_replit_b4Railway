import React from 'react';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Info, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DiversificationScore } from './DiversificationScore';
import { usePortfolioData } from '../../hooks/useAssetMarketData';

interface PortfolioHealthCheckProps {
  className?: string;
}

export function PortfolioHealthCheck({ className = '' }: PortfolioHealthCheckProps) {
  const { portfolio, isLoading } = usePortfolioData();
  
  if (isLoading || !portfolio) {
    return (
      <div className={`bg-slate-800/90 rounded-xl p-6 border border-slate-700/30 ${className}`}>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500" />
          <span className="ml-3 text-gray-400">Analyzing portfolio...</span>
        </div>
      </div>
    );
  }

  const healthMetrics = {
    diversificationScore: portfolio.summary.diversificationScore,
    riskLevel: portfolio.summary.diversificationScore > 70 ? 'Low' : portfolio.summary.diversificationScore > 40 ? 'Moderate' : 'High',
    allocationBalance: portfolio.summary.diversificationScore,
    rebalanceNeeded: portfolio.summary.diversificationScore < 60,
    lastRebalance: '12 days ago',
    recommendations: portfolio.summary.diversificationScore < 60 ? 3 : portfolio.summary.diversificationScore < 80 ? 1 : 0
  };

  const getHealthStatus = () => {
    if (healthMetrics.diversificationScore >= 80) return { status: 'Excellent', color: 'text-positive', icon: CheckCircle };
    if (healthMetrics.diversificationScore >= 60) return { status: 'Good', color: 'text-positive', icon: CheckCircle };
    if (healthMetrics.diversificationScore >= 40) return { status: 'Needs Attention', color: 'text-neutral', icon: AlertTriangle };
    return { status: 'Critical', color: 'text-negative', icon: AlertTriangle };
  };

  const healthStatus = getHealthStatus();

  const recommendations = [
    { text: 'Add Golden Age exposure', priority: 'high', asset: 'GAPF' },
    { text: 'Reduce Marvel concentration', priority: 'medium', asset: 'MRVL' },
    { text: 'Consider bond allocation', priority: 'low', asset: 'MRVLB' }
  ].slice(0, healthMetrics.recommendations);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className={`bg-slate-800/90 rounded-xl p-6 border border-slate-700/30 hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all hover:-translate-y-1 ${className}`}>
      <div className="flex items-center space-x-2 mb-5">
        <Shield className="h-6 w-6 text-orange-300" />
        <h3 className="font-semibold text-white text-lg">Portfolio Health</h3>
        <div className="ml-auto">
          <healthStatus.icon className={`h-5 w-5 ${healthStatus.color}`} />
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Overall Health Score */}
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Overall Health</span>
            <span className={`font-bold ${healthStatus.color}`}>{healthStatus.status}</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                healthMetrics.diversificationScore >= 80 ? 'bg-green-500' : 
                healthMetrics.diversificationScore >= 60 ? 'bg-blue-500' : 
                healthMetrics.diversificationScore >= 40 ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}
              style={{ width: `${healthMetrics.diversificationScore}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Diversification: {healthMetrics.diversificationScore}/100</span>
            <span>Risk: {healthMetrics.riskLevel}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600/30">
            <p className="text-xs text-gray-400">Allocation Balance</p>
            <p className="text-sm font-bold text-white">{healthMetrics.allocationBalance}%</p>
          </div>
          <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600/30">
            <p className="text-xs text-gray-400">Last Rebalance</p>
            <p className="text-sm font-bold text-white">{healthMetrics.lastRebalance}</p>
          </div>
        </div>

        {/* Top Recommendations */}
        <div>
          <h4 className="text-sm font-medium text-white mb-2">Action Items ({recommendations.length})</h4>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-700/20 rounded border border-slate-600/20">
                <div className="flex items-center space-x-2">
                  <Target className={`h-3 w-3 ${getPriorityColor(rec.priority)}`} />
                  <span className="text-sm text-gray-300">{rec.text}</span>
                </div>
                <Link 
                  to={`/trading/${rec.asset}`}
                  className="text-purple-400 hover:text-purple-300 text-xs"
                >
                  Trade
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-t border-slate-600/30">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {healthMetrics.rebalanceNeeded ? (
              <span className="text-yellow-400">Rebalance recommended</span>
            ) : (
              <span className="text-green-400">Portfolio balanced</span>
            )}
          </div>
          <Link 
            to="/portfolio"
            className="flex items-center space-x-1 text-orange-300 hover:text-orange-200 text-sm font-medium"
          >
            Full Analysis →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PortfolioHealthCheck;