import React, { useState } from 'react';
import { Play, TrendingUp, TrendingDown, Star, Calendar, BookOpen, BarChart2, Info, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MarketSentimentGauge } from '../ui/MarketSentimentGauge';

interface FeaturedComicData {
  title: string;
  issue: string;
  symbol: string;
  publisher: string;
  year: number;
  significance: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  coverImage: string;
  videoUrl: string;
  sentiment: number;
  sentimentConfidence: number;
  keyCharacters: string[];
  marketInsights: {
    priceTarget: number;
    analystRating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell';
    volumeTrend: 'increasing' | 'decreasing' | 'stable';
    riskLevel: 'low' | 'medium' | 'high';
  };
  recentNews: Array<{
    headline: string;
    impact: 'positive' | 'negative' | 'neutral';
    date: string;
  }>;
}

export function FeaturedComicInsight() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'news'>('overview');

  // Featured comic data - rotates daily or based on market conditions
  const featuredComic: FeaturedComicData = {
    title: 'Amazing Fantasy',
    issue: '#15',
    symbol: 'AF15',
    publisher: 'Marvel Comics',
    year: 1962,
    significance: 'First appearance of Spider-Man',
    currentPrice: 1800000,
    change: 95000,
    percentChange: 5.57,
    coverImage: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - would be actual comic analysis video
    sentiment: 0.75, // Highly positive sentiment
    sentimentConfidence: 0.88,
    keyCharacters: ['Spider-Man', 'Peter Parker', 'Uncle Ben', 'Aunt May'],
    marketInsights: {
      priceTarget: 2100000,
      analystRating: 'Strong Buy',
      volumeTrend: 'increasing',
      riskLevel: 'medium'
    },
    recentNews: [
      { headline: 'Spider-Man 4 Movie Confirmed', impact: 'positive', date: '2024-01-15' },
      { headline: 'High-Grade Copy Sells for Record Price', impact: 'positive', date: '2024-01-12' },
      { headline: 'CGC Population Report Shows Scarcity', impact: 'positive', date: '2024-01-10' }
    ]
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Strong Buy': return 'bg-green-900/50 text-green-200 border-green-700/50';
      case 'Buy': return 'bg-emerald-900/50 text-emerald-200 border-emerald-700/50';
      case 'Hold': return 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50';
      case 'Sell': return 'bg-red-900/50 text-red-200 border-red-700/50';
      default: return 'bg-gray-900/50 text-gray-200 border-gray-700/50';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <TrendingUp className="h-3 w-3 text-green-400" />;
      case 'negative': return <TrendingDown className="h-3 w-3 text-red-400" />;
      default: return <Info className="h-3 w-3 text-yellow-400" />;
    }
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Star className="h-6 w-6 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Featured Asset Intelligence</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-white/80" />
            <span className="text-white/80 text-sm">Daily Featured Asset</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Cover Image */}
          <div className="space-y-4">
            <div className="relative group">
              <img 
                src={featuredComic.coverImage}
                alt={`${featuredComic.title} ${featuredComic.issue} cover`}
                className="w-full h-80 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-white mb-1">
                  {featuredComic.title} {featuredComic.issue}
                </h3>
                <p className="text-gray-200">{featuredComic.publisher} • {featuredComic.year}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRatingColor(featuredComic.marketInsights.analystRating)}`}>
                    {featuredComic.marketInsights.analystRating}
                  </span>
                  <span className="text-yellow-400 font-bold">
                    {featuredComic.percentChange > 0 ? '+' : ''}{featuredComic.percentChange}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600/50">
                <p className="text-xs text-gray-400">Current Price</p>
                <p className="text-lg font-bold text-white">CC {featuredComic.currentPrice.toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600/50">
                <p className="text-xs text-gray-400">24h Change</p>
                <p className={`text-lg font-bold ${featuredComic.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {featuredComic.change > 0 ? '+' : ''}CC {featuredComic.change.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Video & Market Analysis */}
          <div className="space-y-4">
            <div className="relative bg-slate-900 rounded-lg overflow-hidden">
              {!isVideoPlaying ? (
                <div 
                  className="relative cursor-pointer group"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <img 
                    src="https://images.pexels.com/photos/5721194/pexels-photo-5721194.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Market analysis video thumbnail"
                    className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-indigo-600/90 p-4 rounded-full group-hover:bg-indigo-500/90 transition-colors">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white font-bold">Market Analysis: AF15</h4>
                    <p className="text-gray-200 text-sm">Expert breakdown of recent price action</p>
                  </div>
                </div>
              ) : (
                <iframe
                  src={featuredComic.videoUrl}
                  className="w-full h-48"
                  frameBorder="0"
                  allowFullScreen
                  title="Featured comic market analysis"
                />
              )}
            </div>

            {/* Market Sentiment Gauge */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <MarketSentimentGauge
                sentiment={featuredComic.sentiment}
                confidence={featuredComic.sentimentConfidence}
                label="Market Sentiment"
                size="medium"
                showValue={true}
                previousSentiment={0.65}
                className="mb-4"
              />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk Level:</span>
                  <span className={`font-medium ${
                    featuredComic.marketInsights.riskLevel === 'low' ? 'text-green-400' :
                    featuredComic.marketInsights.riskLevel === 'medium' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {featuredComic.marketInsights.riskLevel.charAt(0).toUpperCase() + featuredComic.marketInsights.riskLevel.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Volume Trend:</span>
                  <span className={`font-medium ${
                    featuredComic.marketInsights.volumeTrend === 'increasing' ? 'text-green-400' :
                    featuredComic.marketInsights.volumeTrend === 'decreasing' ? 'text-red-400' :
                    'text-gray-400'
                  }`}>
                    {featuredComic.marketInsights.volumeTrend.charAt(0).toUpperCase() + featuredComic.marketInsights.volumeTrend.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Insights */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex space-x-1">
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'analysis', label: 'Analysis', icon: BarChart2 },
                { id: 'news', label: 'News', icon: Info }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-indigo-600/20'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[180px]">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                    <h4 className="font-medium text-white mb-2">Investment Thesis</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {featuredComic.significance}. This cornerstone issue represents the birth of one of Marvel's most 
                      valuable characters and continues to appreciate due to its cultural significance and scarcity.
                    </p>
                  </div>
                  
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                    <h4 className="font-medium text-white mb-3">Key Characters</h4>
                    <div className="flex flex-wrap gap-2">
                      {featuredComic.keyCharacters.map((character, index) => (
                        <Link
                          key={index}
                          to={`/characters`}
                          className="px-2 py-1 bg-indigo-900/50 text-indigo-200 rounded text-xs hover:bg-indigo-900/70 transition-colors"
                        >
                          {character}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analysis' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600/50">
                      <p className="text-xs text-gray-400">Price Target</p>
                      <p className="text-lg font-bold text-green-400">
                        CC {featuredComic.marketInsights.priceTarget.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-300">
                        +{(((featuredComic.marketInsights.priceTarget - featuredComic.currentPrice) / featuredComic.currentPrice) * 100).toFixed(1)}% upside
                      </p>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600/50">
                      <p className="text-xs text-gray-400">Analyst Rating</p>
                      <p className={`text-lg font-bold ${
                        featuredComic.marketInsights.analystRating === 'Strong Buy' ? 'text-green-400' :
                        featuredComic.marketInsights.analystRating === 'Buy' ? 'text-emerald-400' :
                        featuredComic.marketInsights.analystRating === 'Hold' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {featuredComic.marketInsights.analystRating}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-700/30">
                    <h4 className="font-medium text-white mb-3">AI Market Intelligence</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span>Strong correlation with Spider-Man media announcements detected</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span>Volume pattern suggests institutional accumulation</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                        <span>Technical indicators show breakout potential above CC 1.9M</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'news' && (
                <div className="space-y-3">
                  {featuredComic.recentNews.map((news, index) => (
                    <div key={index} className="bg-slate-700/50 p-3 rounded-lg border border-slate-600/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{news.headline}</p>
                          <p className="text-gray-400 text-xs mt-1">{new Date(news.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getImpactIcon(news.impact)}
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-600/50">
              <Link
                to={`/key-comics`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 rounded-lg transition-colors font-medium"
              >
                View Details
              </Link>
              <Link
                to={`/trading/${featuredComic.symbol}`}
                className="bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg transition-colors font-medium"
              >
                Trade Now
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom insights bar */}
        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-xs text-gray-400">Market Impact Score</p>
                <p className="text-lg font-bold text-indigo-400">{(featuredComic.sentiment * 100).toFixed(0)}/100</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Confidence Level</p>
                <p className="text-lg font-bold text-white">{(featuredComic.sentimentConfidence * 100).toFixed(0)}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Next Review</p>
                <p className="text-lg font-bold text-yellow-400">Tomorrow</p>
              </div>
            </div>
            <Link
              to="/ideas"
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
            >
              View All AI Insights →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedComicInsight;