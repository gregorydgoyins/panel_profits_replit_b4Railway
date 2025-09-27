import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, X, ExternalLink, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useNewsData } from '../../hooks/useNewsData';
import { format } from 'date-fns';

interface NewsNotificationProps {
  autoHide?: boolean;
  hideDelay?: number;
}

export function NewsNotification({ autoHide = true, hideDelay = 8000 }: NewsNotificationProps) {
  const { latestStory } = useNewsData({ autoRefresh: false });
  const [visible, setVisible] = useState(false);
  const [currentStory, setCurrentStory] = useState(latestStory);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Show notification when a new story arrives
  useEffect(() => {
    if (latestStory && latestStory !== currentStory) {
      setCurrentStory(latestStory);
      setVisible(true);
      
      // Auto-hide after delay if enabled
      if (autoHide) {
        const timer = setTimeout(() => {
          setVisible(false);
        }, hideDelay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [latestStory, currentStory, autoHide, hideDelay]);

  // Auto-hide timer for visible notifications
  useEffect(() => {
    if (visible && autoHide) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, hideDelay);
      
      return () => clearTimeout(timer);
    }
  }, [visible, autoHide, hideDelay]);

  // If no story, not visible, or on home page, don't render
  if (!currentStory || !visible || isHomePage) {
    return null;
  }

  // Determine if this is an external link
  const isExternalLink = currentStory.url.startsWith('http');

  // Get impact styles
  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full animate-fade-in">
      <div className="bg-slate-800/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 overflow-hidden">
        <div className="flex items-center justify-between bg-slate-700/50 px-4 py-2">
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-white">Breaking News</span>
          </div>
          <button 
            onClick={() => setVisible(false)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getImpactIcon(currentStory.impact)}
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">{currentStory.title}</h3>
              <p className="text-gray-300 text-xs mt-1 line-clamp-2">{currentStory.description}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span>{currentStory.source}</span>
                  <span>•</span>
                  <span>{format(new Date(currentStory.publishedAt), 'h:mm a')}</span>
                </div>
                
                {isExternalLink ? (
                  <a 
                    href={currentStory.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center space-x-1"
                  >
                    <span>Read</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <Link 
                    to={`/news/${currentStory.id}`}
                    className="text-indigo-400 hover:text-indigo-300 text-xs"
                    onClick={() => setVisible(false)}
                  >
                    Read More →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsNotification;