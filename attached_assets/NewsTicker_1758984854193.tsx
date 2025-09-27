import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, TrendingDown, Pause, Play, ExternalLink, Info, Newspaper, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useNewsData } from '../../hooks/useNewsData';

interface NewsTickerProps {
  maxItems?: number;
  className?: string;
  scrollDuration?: string;
}

export function NewsTicker({ maxItems = 8, className = '', scrollDuration = '120s' }: NewsTickerProps) {
  const { data: news, isLoading, error, refetch, totalCount } = useNewsData({ 
    limit: 0, // Get all stories for ticker
    excludeLastWeek: true, // Exclude news from the last week
    autoRefresh: true, // Keep auto-refresh enabled
    refreshInterval: 300000 // 5 minutes
  });
  const [isPaused, setIsPaused] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Handle loading state
  if (isLoading && !news) {
    return (
      <div className={`bg-slate-800/70 backdrop-blur-md border-b border-slate-700/50 ${className}`}>
        <div className="w-full px-4">
          <div className="h-12 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500"></div>
              <span className="text-gray-400 text-sm">Loading news...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state or no news

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="h-3 w-3 icon-positive" />;
      case 'negative':
        return <TrendingDown className="h-3 w-3 icon-negative" />;
      default:
        return <Info className="h-3 w-3 icon-neutral" />;
    }
  };

  const getImpactBg = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'bg-green-900/20 border-green-700/30 hover:bg-green-600 hover:border-green-500';
      case 'negative':
        return 'bg-red-900/20 border-red-700/30 hover:bg-red-600 hover:border-red-500';
      default:
        return 'bg-yellow-900/20 border-yellow-700/30 hover:bg-yellow-600 hover:border-yellow-500';
    }
  };

  return (
    <div className={`bg-slate-800/70 backdrop-blur-md border-b border-slate-700/50 ${className}`}>
        <div className="w-full">
          <div className="h-10 flex items-center justify-between">
            {/* Label */}
            <div className="flex items-center space-x-3 flex-shrink-0 px-2 py-1 rounded-md bg-blue-900/50 border border-blue-700/50">
              <Newspaper className="h-4 w-4 text-orange-400" />
              <span className="text-xs text-white font-medium whitespace-nowrap">
                NEWS ({maxItems})
              </span>
            </div>

            {/* News Content */}
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div 
                className={`flex flex-nowrap space-x-0.5 py-1 ticker-scroll ${isPaused ? 'ticker-scroll-paused' : ''}`} 
                style={{ 
                  minWidth: 'max-content',
                  '--scroll-duration': scrollDuration || '60s'
                } as React.CSSProperties}
              >
                {/* First set of news items */}
                {(news || []).slice(0, Math.min(maxItems, (news || []).length)).map((story) => (
                  <Link
                    key={story.id}
                    to={story.url.startsWith('http') ? story.url : `/news/${story.id}`}
                    target={story.url.startsWith('http') ? "_blank" : undefined}
                    rel={story.url.startsWith('http') ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all duration-200 whitespace-nowrap group hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent ${getImpactBg(story.impact)}`}
                  >
                    {getImpactIcon(story.impact)}
                    
                    <span className="text-white font-medium text-xs min-w-0">
                      {story.title.length > 60 ? story.title.substring(0, 60) + '...' : story.title}
                    </span>
                    
                    <span className="text-gray-400 text-xs border-l border-gray-600 pl-2 flex-shrink-0">
                      {story.source} • {format(new Date(story.publishedAt), 'MMM d, yyyy • h:mm a')}
                    </span>
                    
                    {story.url.startsWith('http') && (
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                    )}
                  </Link>
                ))}
                
                {/* Duplicate set for seamless loop */}
                {(news || []).slice(0, Math.min(maxItems, (news || []).length)).map((story) => (
                  <Link
                    key={`${story.id}-duplicate`}
                    to={story.url.startsWith('http') ? story.url : `/news/${story.id}`}
                    target={story.url.startsWith('http') ? "_blank" : undefined}
                    rel={story.url.startsWith('http') ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all duration-200 whitespace-nowrap group hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent ${getImpactBg(story.impact)}`}
                  >
                    {getImpactIcon(story.impact)}
                    
                    <span className="text-white font-medium text-xs min-w-0">
                      {story.title.length > 60 ? story.title.substring(0, 60) + '...' : story.title}
                    </span>
                    
                    <span className="text-gray-400 text-xs border-l border-gray-600 pl-2 flex-shrink-0">
                      {story.source} • {format(new Date(story.publishedAt), 'MMM d, yyyy • h:mm a')}
                    </span>
                    
                    {story.url.startsWith('http') && (
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                    )}
                  </Link>
                ))}
              </div>
              
              {/* Show message if no data */}
              {(!news || news.length === 0) && (
                <div className="flex items-center justify-center py-2">
                  <span className="text-gray-400 text-sm">
                    {error ? 'Failed to load news' : 'No news available'}
                  </span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2 flex-shrink-0 border-l border-slate-700/50 pl-4">
              <button
                onClick={refetch}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded touch-target"
                title="Refresh news"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded touch-target"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}