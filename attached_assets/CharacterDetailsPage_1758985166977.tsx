import React, { useState } from 'react';
import { 
  Users, TrendingUp, TrendingDown, Star, Calendar, 
  BookOpen, BarChart2, Activity, ArrowLeft, ExternalLink, 
  Zap, Shield, Crosshair
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { allCharacters } from '../../data/characterData';
import { OrderEntry } from '../../components/OrderEntry';
import { QuickTradeModal } from '../../components/trading/QuickTradeModal';
import { CharacterTradeButton } from '../../components/character/CharacterTradeButton';

export function CharacterDetailsPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'powers' | 'performance' | 'trading'>('overview');
  const [orderSymbol, setOrderSymbol] = useState(symbol);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  
  // Find the character by symbol
  const character = allCharacters.find(c => c.symbol === symbol);

  if (!character) {
    return (
      <div className="space-y-6">
        <Breadcrumbs />
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Character not found</h3>
          <p className="text-gray-400 mb-4">The character you're looking for doesn't exist.</p>
          <Link to="/characters" className="text-indigo-400 hover:text-indigo-300">
            ← Back to Characters
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'powers', label: 'Powers & Abilities', icon: Zap },
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

  const getCharacterTypeIcon = (type: string) => {
    switch (type) {
      case 'hero': return '🦸‍♂️';
      case 'villain': return '🦹‍♂️';
      case 'sidekick': return '🤝';
      case 'henchman': return '🧟‍♂️';
      default: return '👤';
    }
  };

  const openTradeModal = () => setIsTradeModalOpen(true);
  const closeTradeModal = () => setIsTradeModalOpen(false);

  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[
        { name: 'Characters', path: '/characters' },
        { name: character.name }
      ]} />

      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <span className="text-2xl">{getCharacterTypeIcon(character.characterType)}</span>
              <h1 className="text-3xl font-bold text-white">{character.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRatingColor(character.rating)}`}>
                {character.rating}
              </span>
            </div>
            <p className="text-gray-400 mb-2">{character.symbol} • {character.publisher} • {character.characterType.charAt(0).toUpperCase() + character.characterType.slice(1)}</p>
            <div className="mb-4">
              <p className="text-gray-300 mb-3">{character.description}</p>
              {character.characterType === 'hero' && (
                <div className="inline-flex items-center space-x-2 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-700/30">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-blue-200 text-sm">Hero</span>
                </div>
              )}
              {character.characterType === 'villain' && (
                <div className="inline-flex items-center space-x-2 bg-red-900/30 px-3 py-1 rounded-full border border-red-700/30">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  <span className="text-red-200 text-sm">Villain</span>
                </div>
              )}
              {character.characterType === 'sidekick' && (
                <div className="inline-flex items-center space-x-2 bg-green-900/30 px-3 py-1 rounded-full border border-green-700/30">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-green-200 text-sm">Sidekick</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-sm text-gray-300">Popularity: {character.popularity}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-indigo-400" />
                <span className="text-sm text-gray-300">First Appearance: {character.firstAppearance}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-300">Media Appearances: {character.mediaAppearances}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Current Price</p>
            <p className="text-2xl font-bold text-white">CC {character.price.toLocaleString()}</p>
            <div className="flex items-center justify-end space-x-1 mt-1">
              {character.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span className={`font-semibold ${
                character.change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {character.change > 0 ? '+' : ''}{character.percentageChange}%
              </span>
            </div>
            <div className="mt-3">
              <CharacterTradeButton 
                symbol={character.symbol} 
                name={character.name} 
                price={character.price} 
              />
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
                <p className="text-xl font-bold text-white">CC {(character.marketCap / 1000000).toFixed(1)}M</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Volume</p>
                <p className="text-xl font-bold text-white">{character.volume.toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Popularity</p>
                <p className="text-xl font-bold text-white">{character.popularity}%</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Media Appearances</p>
                <p className="text-xl font-bold text-white">{character.mediaAppearances}</p>
              </div>
            </div>

            {/* Character Relationships */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {character.nemesis && (
                <div className="bg-red-900/30 p-4 rounded-lg border border-red-700/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Crosshair className="h-5 w-5 text-red-400" />
                    <h4 className="font-medium text-white">Arch-Nemesis</h4>
                  </div>
                  <p className="text-red-200 font-medium">{character.nemesis}</p>
                  <p className="text-xs text-red-300 mt-1">Primary antagonist and greatest enemy</p>
                </div>
              )}
              
              {character.allies && character.allies.length > 0 && (
                <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/30">
                  <div className="flex items-center space-x-2 mb-3">
                    <Users className="h-5 w-5 text-green-400" />
                    <h4 className="font-medium text-white">Key Allies ({character.allies.length})</h4>
                  </div>
                  <div className="space-y-1">
                    {character.allies.slice(0, 3).map((ally, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                        <span className="text-green-200 text-sm">{ally}</span>
                      </div>
                    ))}
                    {character.allies.length > 3 && (
                      <p className="text-xs text-green-300 mt-2">+{character.allies.length - 3} more allies</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Character Origin */}
            <div className="bg-slate-700/50 p-5 rounded-xl border border-slate-600/50">
              <h3 className="font-semibold text-white mb-3">Character Background</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">First Appearance</span>
                  <span className="text-white">{character.firstAppearance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Publisher</span>
                  <span className="text-white">{character.publisher}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Character Type</span>
                  <span className="text-white capitalize">{character.characterType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Media Adaptations</span>
                  <span className="text-white">{character.mediaAppearances} appearances</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Popularity Rating</span>
                  <span className="text-white">{character.popularity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Universe</span>
                  <span className="text-white">{character.publisher}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'powers' && (
          <div className="space-y-6">
            {/* Powers & Abilities Grid */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Powers & Abilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {character.powers.map((power, index) => (
                  <div key={index} className="bg-gradient-to-br from-slate-700/70 to-slate-800/70 p-4 rounded-xl border border-slate-600/50 hover:border-indigo-500/50 transition-all group">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="text-white font-medium">{power}</p>
                        <div className="w-full bg-slate-600/50 rounded-full h-1.5 mt-2">
                          <div 
                            className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500 group-hover:bg-yellow-300"
                            style={{ width: `${75 + Math.random() * 25}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Power Rating */}
            <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-5 rounded-xl border border-indigo-700/30">
              <h3 className="font-semibold text-white mb-4">Power Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Overall Rating</p>
                  <p className="text-2xl font-bold text-white">{character.popularity > 95 ? 'S-Tier' : character.popularity > 90 ? 'A-Tier' : character.popularity > 80 ? 'B-Tier' : 'C-Tier'}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Power Count</p>
                  <p className="text-2xl font-bold text-yellow-400">{character.powers.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Threat Level</p>
                  <p className="text-2xl font-bold text-indigo-400">
                    {character.characterType === 'villain' ? 'High' : 
                     character.characterType === 'hero' ? 'Protective' : 
                     'Support'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Power Analysis */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <h3 className="font-semibold text-white mb-3">Power Analysis</h3>
              <p className="text-gray-300 mb-4">
                {character.name}'s abilities make them a {character.characterType === 'hero' || character.characterType === 'sidekick' ? 'formidable force for good' : 'dangerous adversary'} in the {character.publisher} universe. Their powers are particularly effective against {character.nemesis || 'various opponents'}.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Power Level</p>
                  <p className="text-white">{character.popularity > 90 ? 'Omega Level' : character.popularity > 80 ? 'Alpha Level' : 'Beta Level'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Combat Effectiveness</p>
                  <p className="text-white">{character.popularity > 95 ? 'Exceptional' : character.popularity > 85 ? 'High' : 'Moderate'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Versatility</p>
                  <p className="text-white">{character.powers.length > 3 ? 'High' : 'Specialized'}</p>
                </div>
              </div>
            </div>
            
            {/* Notable Feats */}
            <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-700/30">
              <h3 className="font-semibold text-white mb-3">Notable Feats</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>First appeared in {character.firstAppearance}, quickly becoming a fan favorite</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Featured in {character.mediaAppearances} media adaptations across film, television, and video games</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Maintains a {character.popularity}% popularity rating among comic readers and general audiences</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Performance Chart Placeholder */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 h-80 flex items-center justify-center">
              <p className="text-gray-400">Character price performance chart would appear here</p>
            </div>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Market Cap</p>
                <p className="text-xl font-bold text-white">CC {(character.marketCap / 1000000).toFixed(1)}M</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">24h Volume</p>
                <p className="text-xl font-bold text-white">{character.volume.toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Popularity Score</p>
                <p className="text-xl font-bold text-white">{character.popularity}%</p>
              </div>
            </div>
            
            {/* Market Analysis */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <h3 className="font-semibold text-white mb-3">Market Analysis</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">Strong correlation with {character.publisher} performance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">{character.change > 0 ? 'Positive' : 'Negative'} momentum indicators on all timeframes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Moderate volatility compared to sector average</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">Media appearance potential increasing by {character.popularity > 90 ? '8.5' : '5.2'}% this quarter</span>
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
                    <span className="text-white">CC {character.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Change</span>
                    <span className={character.change > 0 ? 'text-green-400' : 'text-red-400'}>
                      {character.change > 0 ? '+' : ''}{character.percentageChange}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Cap</span>
                    <span className="text-white">CC {(character.marketCap / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume</span>
                    <span className="text-white">{character.volume.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Popularity</span>
                    <span className="text-white">{character.popularity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Media Appearances</span>
                    <span className="text-white">{character.mediaAppearances}</span>
                  </div>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                  <h4 className="font-medium text-white mb-3">Analyst Recommendations</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Strong Buy</span>
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: character.rating === 'Strong Buy' ? '65%' : character.rating === 'Buy' ? '25%' : '10%' }}></div>
                      </div>
                      <span className="text-sm text-white">{character.rating === 'Strong Buy' ? '65%' : character.rating === 'Buy' ? '25%' : '10%'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Buy</span>
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: character.rating === 'Buy' ? '65%' : character.rating === 'Strong Buy' ? '25%' : '15%' }}></div>
                      </div>
                      <span className="text-sm text-white">{character.rating === 'Buy' ? '65%' : character.rating === 'Strong Buy' ? '25%' : '15%'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Hold</span>
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: character.rating === 'Hold' ? '65%' : '10%' }}></div>
                      </div>
                      <span className="text-sm text-white">{character.rating === 'Hold' ? '65%' : '10%'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Sell</span>
                      <div className="w-32 bg-slate-600 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: character.rating === 'Sell' ? '65%' : '0%' }}></div>
                      </div>
                      <span className="text-sm text-white">{character.rating === 'Sell' ? '65%' : '0%'}</span>
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
                    <li>• {character.popularity > 90 ? 'Extremely high' : 'Strong'} popularity among fans</li>
                    <li>• {character.mediaAppearances > 30 ? 'Extensive' : 'Solid'} media presence across multiple platforms</li>
                    <li>• {character.powers.length > 3 ? 'Diverse power set' : 'Iconic signature abilities'}</li>
                    <li>• {character.publisher === 'Marvel' ? 'Strong Marvel Cinematic Universe potential' : 'Strong DC Extended Universe potential'}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-indigo-400 mb-2">Opportunities</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Upcoming media adaptations in development</li>
                    <li>• Growing interest in {character.characterType === 'hero' ? 'superhero' : character.characterType === 'villain' ? 'villain-focused' : 'supporting character'} content</li>
                    <li>• Potential for crossover events with other popular characters</li>
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
          to="/characters"
          className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors touch-target"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Characters</span>
        </Link>
      </div>
      
      {/* Quick Trade Modal */}
      <QuickTradeModal
        isOpen={isTradeModalOpen}
        onClose={closeTradeModal}
        symbol={character.symbol}
        currentPrice={character.price}
        assetName={character.name}
        assetType="character"
      />
    </div>
  );
}

export default CharacterDetailsPage;