import React, { useState } from 'react';
import { 
  Building2, TrendingUp, TrendingDown, Star, Calendar, 
  BookOpen, BarChart2, Activity, ArrowLeft, ExternalLink, 
  Zap, MapPin, Users
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { allLocations } from '../../data/locationData';
import { OrderEntry } from '../../components/OrderEntry';

export function LocationDetailsPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'performance' | 'trading'>('overview');
  const [orderSymbol, setOrderSymbol] = useState(symbol);
  
  // Find the location by symbol
  const location = allLocations.find(l => l.symbol === symbol);

  if (!location) {
    return (
      <div className="space-y-6">
        <Breadcrumbs />
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Location not found</h3>
          <p className="text-gray-400 mb-4">The location you're looking for doesn't exist.</p>
          <Link to="/locations" className="text-indigo-400 hover:text-indigo-300">
            ← Back to Locations
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'features', label: 'Features', icon: Zap },
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

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'hangout': return '🏢';
      case 'hideout': return '🏰';
      default: return '🗺️';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[
        { name: 'Locations', path: '/locations' },
        { name: location.name }
      ]} />

      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <span className="text-2xl">{getLocationTypeIcon(location.locationType)}</span>
              <h1 className="text-3xl font-bold text-white">{location.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRatingColor(location.rating)}`}>
                {location.rating}
              </span>
            </div>
            <p className="text-gray-400 mb-2">{location.symbol} • {location.publisher} • {location.locationType.charAt(0).toUpperCase() + location.locationType.slice(1)}</p>
            <p className="text-gray-300 mb-4">{location.description}</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-sm text-gray-300">Significance: {location.significance}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-indigo-400" />
                <span className="text-sm text-gray-300">First Appearance: {location.firstAppearance}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-300">Media Appearances: {location.mediaAppearances}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Current Price</p>
            <p className="text-2xl font-bold text-white">CC {location.price.toLocaleString()}</p>
            <div className="flex items-center justify-end space-x-1 mt-1">
              {location.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span className={`font-semibold ${
                location.change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {location.change > 0 ? '+' : ''}{location.percentageChange}%
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
                <p className="text-xl font-bold text-white">CC {(location.marketCap / 1000000).toFixed(1)}M</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Volume</p>
                <p className="text-xl font-bold text-white">{location.volume.toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Significance</p>
                <p className="text-xl font-bold text-white">{location.significance}%</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Media Appearances</p>
                <p className="text-xl font-bold text-white">{location.mediaAppearances}</p>
              </div>
            </div>

            {/* Location Image */}
            {location.image && (
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <img 
                  src={location.image} 
                  alt={location.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Associated Characters */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Associated Characters</h3>
              <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-700/30">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="h-5 w-5 text-indigo-400" />
                  <h4 className="font-medium text-white">Characters</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {location.associatedCharacters.map((character, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-900/50 rounded text-sm text-indigo-200">
                      {character}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Location Origin */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <h3 className="font-semibold text-white mb-3">Location Background</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">First Appearance</span>
                  <span className="text-white">{location.firstAppearance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Publisher</span>
                  <span className="text-white">{location.publisher}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location Type</span>
                  <span className="text-white capitalize">{location.locationType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Media Adaptations</span>
                  <span className="text-white">{location.mediaAppearances} appearances</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            {/* Location Features */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                    <h4 className="font-medium text-white">Location Type</h4>
                  </div>
                  <p className="text-gray-300">
                    {location.locationType === 'hangout' 
                      ? 'Hero base of operations, typically featuring advanced technology and security systems.' 
                      : 'Villain hideout, often hidden from public view with elaborate defenses and escape mechanisms.'}
                  </p>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-5 w-5 text-indigo-400" />
                    <h4 className="font-medium text-white">Occupants</h4>
                  </div>
                  <p className="text-gray-300">
                    Home to {location.associatedCharacters.length} known characters, including {location.associatedCharacters.slice(0, 2).join(', ')}{location.associatedCharacters.length > 2 ? ', and others' : ''}.
                  </p>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <h4 className="font-medium text-white">Significance</h4>
                  </div>
                  <p className="text-gray-300">
                    With a significance rating of {location.significance}%, this location is {location.significance > 90 ? 'extremely important' : location.significance > 80 ? 'very important' : 'important'} to the {location.publisher} universe.
                  </p>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-5 w-5 text-indigo-400" />
                    <h4 className="font-medium text-white">History</h4>
                  </div>
                  <p className="text-gray-300">
                    First appeared in {location.firstAppearance} and has been featured in {location.mediaAppearances} media adaptations to date.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Location Description */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <h3 className="font-semibold text-white mb-3">Detailed Description</h3>
              <p className="text-gray-300 mb-4">
                {location.description}
              </p>
              <p className="text-gray-300">
                This {location.locationType} has been central to many key storylines in {location.publisher} comics and has appeared in various media adaptations, including films, television series, and video games.
              </p>
            </div>
            
            {/* Notable Events */}
            <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-700/30">
              <h3 className="font-semibold text-white mb-3">Notable Events</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>First introduced in {location.firstAppearance}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Featured prominently in {location.mediaAppearances} media adaptations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Home to {location.associatedCharacters.length} major characters in the {location.publisher} universe</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Performance Chart Placeholder */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 h-80 flex items-center justify-center">
              <p className="text-gray-400">Location price performance chart would appear here</p>
            </div>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Market Cap</p>
                <p className="text-xl font-bold text-white">CC {(location.marketCap / 1000000).toFixed(1)}M</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">24h Volume</p>
                <p className="text-xl font-bold text-white">{location.volume.toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Significance Score</p>
                <p className="text-xl font-bold text-white">{location.significance}%</p>
              </div>
            </div>
            
            {/* Market Analysis */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <h3 className="font-semibold text-white mb-3">Market Analysis</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">Strong correlation with {location.associatedCharacters[0]} performance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">{location.change > 0 ? 'Positive' : 'Negative'} momentum indicators on all timeframes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Lower volatility compared to character stocks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">Media appearance potential increasing by {location.significance > 90 ? '7.5' : '4.2'}% this quarter</span>
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
                    <span className="text-white">CC {location.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Change</span>
                    <span className={location.change > 0 ? 'text-green-400' : 'text-red-400'}>
                      {location.change > 0 ? '+' : ''}{location.percentageChange}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Cap</span>
                    <span className="text-white">CC {(location.marketCap / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume</span>
                    <span className="text-white">{location.volume.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Significance</span>
                    <span className="text-white">{location.significance}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Media Appearances</span>
                    <span className="text-white">{location.mediaAppearances}</span>
                  </div>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                  <h4 className="font-medium text-white mb-3">Analyst Recommendations</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Strong Buy</span>
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: location.rating === 'Strong Buy' ? '65%' : location.rating === 'Buy' ? '25%' : '10%' }}></div>
                      </div>
                      <span className="text-sm text-white">{location.rating === 'Strong Buy' ? '65%' : location.rating === 'Buy' ? '25%' : '10%'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Buy</span>
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: location.rating === 'Buy' ? '65%' : location.rating === 'Strong Buy' ? '25%' : '15%' }}></div>
                      </div>
                      <span className="text-sm text-white">{location.rating === 'Buy' ? '65%' : location.rating === 'Strong Buy' ? '25%' : '15%'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Hold</span>
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: location.rating === 'Hold' ? '65%' : '10%' }}></div>
                      </div>
                      <span className="text-sm text-white">{location.rating === 'Hold' ? '65%' : '10%'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Sell</span>
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: location.rating === 'Sell' ? '65%' : '0%' }}></div>
                      </div>
                      <span className="text-sm text-white">{location.rating === 'Sell' ? '65%' : '0%'}</span>
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
                    <li>• {location.significance > 90 ? 'Extremely high' : 'Strong'} significance in comic lore</li>
                    <li>• {location.mediaAppearances > 30 ? 'Extensive' : 'Solid'} media presence across multiple platforms</li>
                    <li>• Strong association with {location.associatedCharacters.length} major characters</li>
                    <li>• {location.publisher === 'Marvel' ? 'Strong Marvel Cinematic Universe potential' : 'Strong DC Extended Universe potential'}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-indigo-400 mb-2">Opportunities</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Upcoming media adaptations in development</li>
                    <li>• Growing interest in {location.locationType === 'hangout' ? 'hero headquarters' : 'villain hideouts'} in media</li>
                    <li>• Potential for featured role in crossover events</li>
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
          to="/locations"
          className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors touch-target"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Locations</span>
        </Link>
      </div>
    </div>
  );
}

export default LocationDetailsPage;