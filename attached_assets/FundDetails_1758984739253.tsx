import React, { useState } from 'react';
import { 
  Briefcase, TrendingUp, TrendingDown, Calendar, 
  BarChart2, Activity, ArrowLeft, Info, 
  DollarSign, PieChart, Shield, Users
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { allFunds } from '../../data/fundData';
import { OrderEntry } from '../OrderEntry';

export function FundDetails() {
  const { symbol } = useParams<{ symbol: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'performance' | 'trading'>('overview');
  const [orderSymbol, setOrderSymbol] = useState(symbol);
  
  // Find the fund by symbol
  const fund = allFunds.find(f => f.symbol === symbol);

  if (!fund) {
    return (
      <div className="space-y-6">
        <Breadcrumbs />
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Fund not found</h3>
          <p className="text-gray-400 mb-4">The fund you're looking for doesn't exist.</p>
          <Link to="/funds" className="text-indigo-400 hover:text-indigo-300">
            ← Back to Funds
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'holdings', label: 'Holdings', icon: PieChart },
    { id: 'performance', label: 'Performance', icon: BarChart2 },
    { id: 'trading', label: 'Trading', icon: Activity }
  ];

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-900/50 text-green-200 border-green-700/50';
      case 'Medium':
        return 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50';
      case 'High':
        return 'bg-red-900/50 text-red-200 border-red-700/50';
      default:
        return 'bg-gray-900/50 text-gray-200 border-gray-700/50';
    }
  };

  const getReturnColor = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[
        { name: 'Funds', path: '/funds' },
        { name: fund.name }
      ]} />

      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-3xl font-bold text-white">{fund.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskLevelColor(fund.riskLevel)}`}>
                {fund.riskLevel} Risk
              </span>
            </div>
            <p className="text-gray-400 mb-2">{fund.symbol} • {fund.type.charAt(0).toUpperCase() + fund.type.slice(1)} Fund</p>
            <p className="text-gray-300 mb-4">{fund.description}</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-indigo-400" />
                <span className="text-sm text-gray-300">Manager: {fund.manager}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-indigo-400" />
                <span className="text-sm text-gray-300">Inception: {new Date(fund.inceptionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-300">AUM: CC {(fund.aum / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">NAV</p>
            <p className="text-2xl font-bold text-white">CC {fund.nav.toLocaleString()}</p>
            <div className="flex items-center justify-end space-x-1 mt-1">
              {fund.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span className={`font-semibold ${
                fund.change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {fund.change > 0 ? '+' : ''}{fund.percentageChange}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl shadow-xl">
        <div className="flex space-x-1 p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors flex-1 justify-center touch-target ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">YTD Return</p>
                <p className={`text-xl font-bold ${getReturnColor(fund.ytdReturn)}`}>
                  {fund.ytdReturn >= 0 ? '+' : ''}{fund.ytdReturn}%
                </p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">1Y Return</p>
                <p className={`text-xl font-bold ${getReturnColor(fund.oneYearReturn)}`}>
                  {fund.oneYearReturn >= 0 ? '+' : ''}{fund.oneYearReturn}%
                </p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Management Fee</p>
                <p className="text-xl font-bold text-white">{fund.managementFee}%</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Expense Ratio</p>
                <p className="text-xl font-bold text-white">{fund.expenseRatio}%</p>
              </div>
            </div>

            {/* Fund Details */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Fund Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                  <h4 className="font-medium text-white mb-3">Performance History</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">YTD Return</span>
                      <span className={getReturnColor(fund.ytdReturn)}>
                        {fund.ytdReturn >= 0 ? '+' : ''}{fund.ytdReturn}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">1 Year Return</span>
                      <span className={getReturnColor(fund.oneYearReturn)}>
                        {fund.oneYearReturn >= 0 ? '+' : ''}{fund.oneYearReturn}%
                      </span>
                    </div>
                    {fund.threeYearReturn !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">3 Year Return</span>
                        <span className={getReturnColor(fund.threeYearReturn)}>
                          {fund.threeYearReturn >= 0 ? '+' : ''}{fund.threeYearReturn}%
                        </span>
                      </div>
                    )}
                    {fund.fiveYearReturn !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">5 Year Return</span>
                        <span className={getReturnColor(fund.fiveYearReturn)}>
                          {fund.fiveYearReturn >= 0 ? '+' : ''}{fund.fiveYearReturn}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                  <h4 className="font-medium text-white mb-3">Fund Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fund Type</span>
                      <span className="text-white capitalize">{fund.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Risk Level</span>
                      <span className={getRiskLevelColor(fund.riskLevel).split(' ')[1]}>{fund.riskLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Manager</span>
                      <span className="text-white">{fund.manager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Inception Date</span>
                      <span className="text-white">{new Date(fund.inceptionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fund Strategy */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <h3 className="font-semibold text-white mb-3">Fund Strategy</h3>
              <p className="text-gray-300 mb-3">
                {fund.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Investment Approach</p>
                  <p className="text-white">{fund.type === 'themed' ? 'Thematic' : fund.type === 'custom' ? 'Specialized' : 'Index-based'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Management Style</p>
                  <p className="text-white">{fund.type === 'index' ? 'Passive' : 'Active'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Rebalancing</p>
                  <p className="text-white">{fund.type === 'themed' ? 'Quarterly' : fund.type === 'custom' ? 'Monthly' : 'As needed'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'holdings' && (
          <div className="space-y-6">
            {/* Holdings Chart Placeholder */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 h-80 flex items-center justify-center">
              <p className="text-gray-400">Fund holdings allocation chart would appear here</p>
            </div>
            
            {/* Top Holdings */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Top Holdings</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700/50">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Symbol</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Weight</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {fund.topHoldings.map((holding, index) => (
                      <tr key={index} className="hover:bg-slate-700/30">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{holding.symbol}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{holding.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-white">{holding.weight}%</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-white">
                          CC {((fund.aum * holding.weight) / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Asset Allocation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <h3 className="font-semibold text-white mb-3">Asset Allocation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Comics</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <span className="text-white">65%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Creators</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      <span className="text-white">20%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Publishers</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <span className="text-white">10%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Cash</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                      <span className="text-white">5%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <h3 className="font-semibold text-white mb-3">Era Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Golden Age</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${fund.symbol === 'GAPF' ? '80' : '15'}%` }}></div>
                      </div>
                      <span className="text-white">{fund.symbol === 'GAPF' ? '80' : '15'}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Silver Age</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-gray-400 h-2 rounded-full" style={{ width: `${fund.symbol === 'SAMF' ? '75' : fund.symbol === 'GAPF' ? '15' : '25'}%` }}></div>
                      </div>
                      <span className="text-white">{fund.symbol === 'SAMF' ? '75' : fund.symbol === 'GAPF' ? '15' : '25'}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Bronze Age</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-amber-700 h-2 rounded-full" style={{ width: `${fund.symbol === 'BAGF' ? '75' : fund.symbol === 'GAPF' || fund.symbol === 'SAMF' ? '5' : '20'}%` }}></div>
                      </div>
                      <span className="text-white">{fund.symbol === 'BAGF' ? '75' : fund.symbol === 'GAPF' || fund.symbol === 'SAMF' ? '5' : '20'}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Modern Age</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${fund.symbol === 'MAGF' || fund.symbol === 'ICRF' ? '80' : fund.symbol === 'GAPF' || fund.symbol === 'SAMF' ? '0' : '40'}%` }}></div>
                      </div>
                      <span className="text-white">{fund.symbol === 'MAGF' || fund.symbol === 'ICRF' ? '80' : fund.symbol === 'GAPF' || fund.symbol === 'SAMF' ? '0' : '40'}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Performance Chart Placeholder */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 h-80 flex items-center justify-center">
              <p className="text-gray-400">Fund performance chart would appear here</p>
            </div>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">YTD Return</p>
                <p className={`text-xl font-bold ${getReturnColor(fund.ytdReturn)}`}>
                  {fund.ytdReturn >= 0 ? '+' : ''}{fund.ytdReturn}%
                </p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">1Y Return</p>
                <p className={`text-xl font-bold ${getReturnColor(fund.oneYearReturn)}`}>
                  {fund.oneYearReturn >= 0 ? '+' : ''}{fund.oneYearReturn}%
                </p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">3Y Return</p>
                <p className={`text-xl font-bold ${fund.threeYearReturn ? getReturnColor(fund.threeYearReturn) : 'text-gray-400'}`}>
                  {fund.threeYearReturn ? (fund.threeYearReturn >= 0 ? '+' : '') + fund.threeYearReturn + '%' : 'N/A'}
                </p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">5Y Return</p>
                <p className={`text-xl font-bold ${fund.fiveYearReturn ? getReturnColor(fund.fiveYearReturn) : 'text-gray-400'}`}>
                  {fund.fiveYearReturn ? (fund.fiveYearReturn >= 0 ? '+' : '') + fund.fiveYearReturn + '%' : 'N/A'}
                </p>
              </div>
            </div>
            
            {/* Performance Comparison */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <h3 className="font-semibold text-white mb-3">Performance Comparison</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">This Fund (1Y)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-600 rounded-full h-2">
                      <div className={`${fund.oneYearReturn >= 0 ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`} style={{ width: `${Math.min(Math.abs(fund.oneYearReturn), 50)}%` }}></div>
                    </div>
                    <span className={getReturnColor(fund.oneYearReturn)}>
                      {fund.oneYearReturn >= 0 ? '+' : ''}{fund.oneYearReturn}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Category Average (1Y)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-600 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(Math.abs(fund.oneYearReturn - 2), 50)}%` }}></div>
                    </div>
                    <span className="text-white">{(fund.oneYearReturn - 2).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Market Index (1Y)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-600 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.min(Math.abs(fund.oneYearReturn - 5), 50)}%` }}></div>
                    </div>
                    <span className="text-white">{(fund.oneYearReturn - 5).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Risk Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <h3 className="font-semibold text-white mb-3">Risk Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sharpe Ratio</span>
                    <span className="text-white">1.25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volatility</span>
                    <span className="text-white">{fund.riskLevel === 'Low' ? '8.5%' : fund.riskLevel === 'Medium' ? '12.8%' : '18.5%'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Beta</span>
                    <span className="text-white">{fund.riskLevel === 'Low' ? '0.85' : fund.riskLevel === 'Medium' ? '1.05' : '1.25'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Maximum Drawdown</span>
                    <span className="text-red-400">-{fund.riskLevel === 'Low' ? '12.5' : fund.riskLevel === 'Medium' ? '18.2' : '25.5'}%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <h3 className="font-semibold text-white mb-3">Performance Analysis</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Alpha</span>
                    <span className="text-green-400">+2.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tracking Error</span>
                    <span className="text-white">3.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Information Ratio</span>
                    <span className="text-white">0.95</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Upside Capture</span>
                    <span className="text-white">110%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trading' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Quick Trade</h3>
                <OrderEntry
                  symbol={orderSymbol}
                  onSymbolChange={setOrderSymbol}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Fund Data</h3>
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">NAV</span>
                    <span className="text-white">CC {fund.nav.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily Change</span>
                    <span className={fund.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {fund.change >= 0 ? '+' : ''}{fund.percentageChange}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">AUM</span>
                    <span className="text-white">CC {(fund.aum / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expense Ratio</span>
                    <span className="text-white">{fund.expenseRatio}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Management Fee</span>
                    <span className="text-white">{fund.managementFee}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk Level</span>
                    <span className={`font-medium ${
                      fund.riskLevel === 'Low' ? 'text-green-400' :
                      fund.riskLevel === 'Medium' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>{fund.riskLevel}</span>
                  </div>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                  <h4 className="font-medium text-white mb-3">Trading Insights</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-indigo-400" />
                      <span className="text-sm text-gray-300">
                        {fund.ytdReturn > fund.oneYearReturn 
                          ? 'Recent performance exceeding long-term trend' 
                          : 'Recent performance lagging behind long-term trend'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-indigo-400" />
                      <span className="text-sm text-gray-300">
                        {fund.riskLevel === 'Low' 
                          ? 'Conservative allocation suitable for capital preservation' 
                          : fund.riskLevel === 'Medium'
                          ? 'Balanced approach with moderate growth potential'
                          : 'Aggressive strategy focused on maximum growth'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">
                        Fund operating for {new Date().getFullYear() - new Date(fund.inceptionDate).getFullYear()} years
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="flex justify-start">
        <Link
          to="/funds"
          className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors touch-target"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Funds</span>
        </Link>
      </div>
    </div>
  );
}

export default FundDetails;