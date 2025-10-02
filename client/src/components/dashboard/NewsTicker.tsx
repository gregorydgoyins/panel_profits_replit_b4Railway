import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface NewsItem {
  id: string;
  headline: string;
  url: string;
  publishedAt: string;
  source: string;
}

export function NewsTicker() {
  const [isPaused, setIsPaused] = useState(false);
  
  // Fetch real news from RSS feeds
  const { data: news = [], isLoading } = useQuery<NewsItem[]>({
    queryKey: ['/api/news/rss'],
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
  
  // Duplicate news items for seamless loop
  const tickerItems = news.length > 0 ? [...news, ...news] : [];
  
  if (isLoading || tickerItems.length === 0) {
    return (
      <div className="bg-card/80 border-b border-border overflow-hidden">
        <div className="flex items-center h-12">
          <div className="bg-primary px-4 h-full flex items-center font-semibold text-sm text-primary-foreground shrink-0">
            BREAKING NEWS
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Loading latest comic book news...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-card/80 border-b border-border overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      data-testid="news-ticker"
    >
      <div className="flex items-center h-12">
        <div className="bg-primary px-4 h-full flex items-center font-mono text-xs text-primary-foreground shrink-0">
          BREAKING NEWS
        </div>
        
        <div className="flex-1 overflow-hidden relative">
          <div 
            className={`flex gap-8 ${isPaused ? 'pause-animation' : 'animate-ticker'}`}
            style={{ 
              width: 'max-content',
            }}
          >
            {tickerItems.map((item, index) => (
              <a
                key={`${item.id}-${index}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono whitespace-nowrap hover:underline transition-colors text-foreground hover:text-primary"
                data-testid={`news-item-${item.id}`}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                <span>{item.headline}</span>
                <span className="text-xs text-muted-foreground">({item.source})</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes ticker {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-ticker {
          animation: ticker 240s linear infinite;
        }
        
        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
