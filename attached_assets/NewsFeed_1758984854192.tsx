import React, { useState } from 'react';
import { useNewsData } from '../../hooks/useNewsData';
import { Newspaper, TrendingUp, TrendingDown, Filter, Calendar, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface NewsFeedProps {
  maxItems?: number;
  showFilters?: boolean;
  showRefresh?: boolean;
  compact?: boolean;
}

export function NewsFeed({ maxItems = 10, showFilters = true, showRefresh = true, compact = false }: NewsFeedProps) {
  const { data: news, isLoading, error, refetch, lastUpdated, dataSource } = useNewsData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImpact, setSelectedImpact] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  if (isLoading && !news) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-gray-400">Loading news...</span>
        </div>
      </div>
    );
  }

  if (error && !news) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="bg-red-900/30 rounded-lg p-4 text-center">
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-300">Failed to load news</p>
          {showRefresh && (
            <button 
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // If no news data available
  if (!news || news.length === 0) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="text-center py-6">
          <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No news available at this time</p>
          {showRefresh && (
            <button 
              onClick={() => refetch()}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Get unique sources for filter
  const sources = ['all', ...Array.from(new Set(news.map(item => item.source)))];

  // Filter news based on selected filters
  const filteredNews = news?.filter(item => {
    if (selectedCategory !== 'all' && item.relatedSecurity?.type !== selectedCategory) return false;
    if (selectedImpact !== 'all' && item.impact !== selectedImpact) return false;
    if (selectedSource !== 'all' && item.source !== selectedSource) return false;
    return true;
  }) || [];

  // Get sentiment-based rimlight classes
  const getSentimentRimlight = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'hover:shadow-[0_0_15px_rgba(34,197,94,0.8)] hover:border-green-400 hover:border-2';
      case 'negative':
        return 'hover:shadow-[0_0_15px_rgba(239,68,68,0.8)] hover:border-red-400 hover:border-2';
      default:
        return 'hover:shadow-[0_0_15px_rgba(234,179,8,0.8)] hover:border-yellow-400 hover:border-2';
    }
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Newspaper className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Latest News</h2>
        </div>

        {showRefresh && (
          <div className="flex items-center space-x-2">
            {lastUpdated && (
              <span className="text-sm text-gray-400 mr-2">
                Updated: {format(lastUpdated, 'h:mm a')}
              </span>
            )}
            <button 
              onClick={() => refetch()}
              className="inline-flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded-lg transition-colors text-xs"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Refresh</span>
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-1"
            >
              <option value="all">All Categories</option>
              <option value="comic">Comics</option>
              <option value="creator">Creators</option>
              <option value="publisher">Publishers</option>
              <option value="option">Options</option>
            </select>
          </div>

          <select 
            value={selectedImpact}
            onChange={(e) => setSelectedImpact(e.target.value)}
            className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-1"
          >
            <option value="all">All Impact</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>

          <select 
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-1"
          >
            <option value="all">All Sources</option>
            {sources.filter(s => s !== 'all').map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>

          {dataSource && (
            <div className="ml-auto">
              <span className="text-xs text-gray-400 px-2 py-1 bg-slate-700/50 rounded">
                {dataSource === 'api' ? 'Live Data' : dataSource === 'cache' ? 'Cached Data' : 'Demo Data'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Unified News Stories List */}
      <div>
        {filteredNews.map((item, index) => {
          const isExternalLink = item.url.startsWith('http');

          return (
              <article key={item.id} className={`mb-0.5 ${index === filteredNews.length - 1 ? 'mb-0' : ''}`}>
                <div className={`bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700 transition-all border border-transparent ${getSentimentRimlight(item.impact)}`}>
                  <div className="flex flex-col md:flex-row gap-6">
                    {item.imageUrl && (
                      <div className="md:w-1/3">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    <div className={item.imageUrl ? 'md:w-2/3' : 'w-full'}>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-white text-xl">{item.title}</h3>
                        
                        <p className="text-sm text-gray-300 line-clamp-3">
                          {item.description || item.content.substring(0, 150) + '...'}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <div className="flex items-center space-x-1 text-gray-400">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(new Date(item.publishedAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-400">Source:</span>
                            <span className="text-indigo-400">
                              {item.source}
                            </span>
                          </div>
                          
                          {item.relatedSecurity && (
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-400">Related:</span>
                              <Link 
                                to={`/${item.relatedSecurity.type}/${item.relatedSecurity.symbol}`}
                                className="text-indigo-400 hover:text-indigo-300"
                              >
                                {item.relatedSecurity.name}
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.impact === 'positive' ? 'badge-positive' :
                            item.impact === 'negative' ? 'badge-negative' :
                            'badge-neutral'
                          }`}>
                            <div className="flex items-center space-x-1">
                              {item.impact === 'positive' ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : item.impact === 'negative' ? (
                                <TrendingDown className="h-3 w-3" />
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              <span className="capitalize">{item.impact}</span>
                            </div>
                          </div>

                          {item.relatedSecurity && (
                            <div className="px-2 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-gray-200 border border-slate-600/50">
                              {item.relatedSecurity.type}
                            </div>
                          )}
                        </div>

                        {isExternalLink ? (
                          <a 
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 text-sm"
                          >
                            <span>Read</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <Link 
                            to={`/news/${item.id}`}
                            className="text-indigo-400 hover:text-indigo-300 text-sm"
                          >
                            Read More →
                          </Link>
                        )}
                      </div>

                      <div className="mt-3 flex justify-between items-center">
                        <div className="flex flex-wrap gap-1">
                          {item.keywords.slice(0, 3).map((keyword, keywordIndex) => (
                            <span 
                              key={keywordIndex}
                              className="px-2 py-0.5 bg-slate-700/50 rounded-full text-xs text-gray-300"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
          );
        })}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-6 bg-slate-700/30 rounded-lg">
          <p className="text-gray-400">No news matching your filters</p>
          <button 
            onClick={() => {
              setSelectedCategory('all');
              setSelectedImpact('all');
              setSelectedSource('all');
            }}
            className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm"
          >
            Reset Filters
          </button>
        </div>
      )}

      {filteredNews.length > 0 && filteredNews.length < news.length && (
        <div className="mt-6 text-center">
          <Link 
            to="/news"
            className="text-indigo-400 hover:text-indigo-300 text-sm"
          >
            View All News →
          </Link>
        </div>
      )}
    </div>
  );
}