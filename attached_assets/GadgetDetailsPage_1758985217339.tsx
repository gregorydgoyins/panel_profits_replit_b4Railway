import React, { useState } from 'react';
import { Briefcase, TrendingUp, TrendingDown, Star, Calendar, BookOpen, BarChart2, Activity, ArrowLeft, ExternalLink, Zap, PenTool as Tool, User } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { gadgets } from '../../data/gadgetData';
import { OrderEntry } from '../../components/OrderEntry';

export function GadgetDetailsPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'capabilities' | 'performance' | 'trading'>('overview');
  const [orderSymbol, setOrderSymbol] = useState(symbol);
  
  // Find the gadget by symbol
  const gadget = gadgets.find(g => g.symbol === symbol);

  if (!gadget) {
    return (
      <div className="space-y-6">
        <Breadcrumbs />
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Gadget not found</h3>
          <p className="text-gray-400 mb-4">The gadget you're looking for doesn't exist.</p>
          <Link to="/gadgets" className="text-indigo-400 hover:text-indigo-300">
            ← Back to Gadgets
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'capabilities', label: 'Capabilities', icon: Zap },
    { id: 'performance', label: 'Performance', icon: BarChart2 },
    { id: 'trading', label: 'Trading', icon: Activity }
  ];

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Strong Buy':
        return 'bg-green-900/50 text-green-200 border-green-700/50';
      case 'Buy':
        return 'bg-emerald-900/50 text-emerald-200 border-emerald-700/50';
      case 'Hold':
        return 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50';
      case 'Sell':
        return 'bg-red-900/50 text-red-200 border-red-700/50';
      default:
        return 'bg-gray-900/50 text-gray-200 border-gray-700/50';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[
        { name: 'Gadgets', path: '/gadgets' },
        { name: gadget.name }
      ]} />

      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <span className="text-2xl">🔧</span>
              <h1 className="text-3xl font-bold text-white">{gadget.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRatingColor(gadget.rating)}`}>
                {gadget.rating}
              </span>
            </div>
            <p className="text-gray-400 mb-2">{gadget.symbol} • {gadget.publisher} • Owned by {gadget.owner}</p>
            <p className="text-gray-300 mb-4">{gadget.description}</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-sm text-gray-300">Significance: {gadget.significance}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-indigo-400" />
                <span className="text-sm text-gray-300">First Appearance: {gadget.firstAppearance}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tool className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-300">Media Appearances: {gadget.mediaAppearances}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Current Price</p>
            <p className="text-2xl font-bold text-white">CC {gadget.price.toLocaleString()}</p>
            <div className="flex items-center justify-end space-x-1 mt-1">
              {gadget.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span className={`font-semibold ${
                gadget.change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {gadget.change > 0 ? '+' : ''}{gadget.percentageChange}%
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
                <p className="text-sm text-gray-400">Market Cap</p>
                <p className="text-xl font-bold text-white">CC {(gadget.marketCap / 1000000).toFixed(1)}M</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Volume</p>
                <p className="text-xl font-bold text-white">{gadget.volume.toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Significance</p>
                <p className="text-xl font-bold text-white">{gadget.significance}%</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Media Appearances</p>
                <p className="text-xl font-bold text-white">{gadget.mediaAppearances}</p>
              </div>
            </div>

            {/* Gadget Image */}
            {gadget.image && (
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <img 
                  src={gadget.image} 
                  alt={gadget.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Creator and Owner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-700/30">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-5 w-5 text-indigo-400" />
                  <h4 className="font-medium text-white">Creator</h4>
                </div>
                <p className="text-indigo-200">{gadget.creator}</p>
              </div>
              
              <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/30">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-5 w-5 text-green-400" />
                  <h4 className="font-medium text-white">Owner</h4>
                </div>
                <p className="text-green-200">{gadget.owner}</p>
              </div>
            </div>

            {/* Gadget Origin */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <h3 className="font-semibold text-white mb-3">Gadget Background</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">First Appearance</span>
                  <span className="text-white">{gadget.firstAppearance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Publisher</span>
                  <span className="text-white">{gadget.publisher}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Creator</span>
                  <span className="text-white">{gadget.creator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Media Adaptations</span>
                  <span className="text-white">{gadget.mediaAppearances} appearances</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'capabilities' && (
          <div className="space-y-6">
            {/* Capabilities List */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Capabilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gadget.capabilities.map((capability, index) => (
                  <div key={index} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      <p className="text-white">{capability}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Capability Analysis */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <h3 className="font-semibold text-white mb-3">Capability Analysis</h3>
              <p className="text-gray-300 mb-4">
                {gadget.name} is a {gadget.significance > 90 ? 'legendary' : gadget.significance > 80 ? 'iconic' : 'significant'} gadget in the {gadget.publisher} universe. Created by {gadget.creator} and wielded by {gadget.owner}, it provides exceptional tactical advantages in combat and other situations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Effectiveness</p>
                  <p className="text-white">{gadget.significance > 95 ? 'Exceptional' : gadget.significance > 85 ? 'High' : 'Moderate'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Versatility</p>
                  <p className="text-white">{gadget.capabilities.length > 3 ? 'High' : 'Specialized'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Iconic Status</p>
                  <p className="text-white">{gadget.significance > 90 ? 'Legendary' : gadget.significance > 80 ? 'Iconic' : 'Notable'}</p>
                </div>
              </div>
            </div>
            
            {/* Notable Uses */}
            <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-700/30">
              <h3 className="font-semibold text-white mb-3">Notable Uses</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>First introduced in {gadget.firstAppearance}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Featured prominently in {gadget.mediaAppearances} media adaptations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Consistently used by {gadget.owner} in combat and other situations</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Performance Chart Placeholder */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 h-80 flex items-center justify-center">
              <p className="text-gray-400">Gadget price performance chart would appear here</p>
            </div>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Market Cap</p>
                <p className="text-xl font-bold text-white">CC {(gadget.marketCap / 1000000).toFixed(1)}M</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">24h Volume</p>
                <p className="text-xl font-bold text-white">{gadget.volume.toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Significance Score</p>
                <p className="text-xl font-bold text-white">{gadget.significance}%</p>
              </div>
            </div>
            
            {/* Market Analysis */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <h3 className="font-semibold text-white mb-3">Market Analysis</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">Strong correlation with {gadget.owner} performance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">{gadget.change > 0 ? 'Positive' : 'Negative'} momentum indicators on all timeframes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Moderate volatility compared to character stocks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">Media appearance potential increasing by {gadget.significance > 90 ? '6.5' : '3.8'}% this quarter</span>
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
                <h3 className="text-lg font-semibold text-white">Market Data</h3>
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Price</span>
                    <span className="text-white">CC {gadget.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Change</span>
                    <span className={gadget.change > 0 ? 'text-green-400' : 'text-red-400'}>
                      {gadget.change > 0 ? '+' : ''}{gadget.percentageChange}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Cap</span>
                    <span className="text-white">CC {(gadget.marketCap / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume</span>
                    <span className="text-white">{gadget.volume.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Significance</span>
                    <span className="text-white">{gadget.significance}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Media Appearances</span>
                    <span className="text-white">{gadget.mediaAppearances}</span>
                  </div>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                  <h4 className="font-medium text-white mb-3">Analyst Recommendations</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Strong Buy</span>
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: gadget.rating === 'Strong Buy' ? '65%' : gadget.rating === 'Buy' ? '25%' : '10%' }}></div>
                      </div>
                      <span className="text-sm text-white">{gadget.rating === 'Strong Buy' ? '65%' : gadget.rating === 'Buy' ? '25%' : '10%'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Buy</span>
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: gadget.rating === 'Buy' ? '65%' : gadget.rating === 'Strong Buy' ? '25%' : '15%' }}></div>
                      </div>
                      <span className="text-sm text-white">{gadget.rating === 'Buy' ? '65%' : gadget.rating === 'Strong Buy' ? '25%' : '15%'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Hold</span>
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: gadget.rating === 'Hold' ? '65%' : '10%' }}></div>
                      </div>
                      <span className="text-sm text-white">{gadget.rating === 'Hold' ? '65%' : '10%'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Sell</span>
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: gadget.rating === 'Sell' ? '65%' : '0%' }}></div>
                      </div>
                      <span className="text-sm text-white">{gadget.rating === 'Sell' ? '65%' : '0%'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <h3 className="font-semibold text-white mb-3">Trading Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-indigo-400 mb-2">Strengths</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• {gadget.significance > 90 ? 'Extremely high' : 'Strong'} significance in comic lore</li>
                    <li>• {gadget.mediaAppearances > 30 ? 'Extensive' : 'Solid'} media presence across multiple platforms</li>
                    <li>• {gadget.capabilities.length > 3 ? 'Diverse capabilities' : 'Iconic signature function'}</li>
                    <li>• Strong association with {gadget.owner}, a major character</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-indigo-400 mb-2">Opportunities</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Upcoming media adaptations in development</li>
                    <li>• Growing interest in superhero technology in media</li>
                    <li>• Potential for featured role in {gadget.owner} storylines</li>
                    <li>• Increasing merchandise and licensing opportunities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="flex justify-start">
        <Link
          to="/gadgets"
          className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors touch-target"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Gadgets</span>
        </Link>
      </div>
    </div>
  );
}

export default GadgetDetailsPage;