import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface NewsItem {
  id: string;
  headline: string;
  url: string;
  impact: 'positive' | 'negative' | 'neutral';
}

const mockNews: NewsItem[] = [
  { 
    id: '1', 
    headline: 'Marvel Studios announces Phase 6 slate - MCU characters surge 15%', 
    url: 'https://www.marvel.com', 
    impact: 'positive' 
  },
  { 
    id: '2', 
    headline: 'DC Comics rebrands to DC - Batman family titles down 3%', 
    url: 'https://www.dccomics.com', 
    impact: 'negative' 
  },
  { 
    id: '3', 
    headline: 'Image Comics 30th Anniversary - Spawn variant covers hit record prices', 
    url: 'https://imagecomics.com', 
    impact: 'positive' 
  },
  { 
    id: '4', 
    headline: 'Dark Horse loses Star Wars license - market volatility expected', 
    url: 'https://www.darkhorse.com', 
    impact: 'negative' 
  },
  { 
    id: '5', 
    headline: 'Invincible Season 3 greenlit - Image Comics superhero assets rally', 
    url: 'https://imagecomics.com', 
    impact: 'positive' 
  },
  { 
    id: '6', 
    headline: 'X-Men \'97 renewed for Season 2 - Mutant character ETF up 8%', 
    url: 'https://www.marvel.com', 
    impact: 'positive' 
  },
  { 
    id: '7', 
    headline: 'CGC announces stricter grading standards - vintage comics see volatility', 
    url: 'https://www.cgccomics.com', 
    impact: 'neutral' 
  },
  { 
    id: '8', 
    headline: 'Record-breaking Comic-Con attendance boosts publisher stocks', 
    url: 'https://www.comic-con.org', 
    impact: 'positive' 
  }
];

export function NewsTicker() {
  const [isPaused, setIsPaused] = useState(false);
  
  // Duplicate news items for seamless loop
  const tickerItems = [...mockNews, ...mockNews];
  
  const getImpactColor = (impact: NewsItem['impact']) => {
    switch (impact) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div 
      className="bg-card/80 border-b border-border overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      data-testid="news-ticker"
    >
      <div className="flex items-center h-12">
        <div className="bg-primary px-4 h-full flex items-center font-semibold text-sm text-primary-foreground shrink-0">
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
                className={`
                  flex items-center gap-2 text-sm whitespace-nowrap
                  hover:underline transition-colors
                  ${getImpactColor(item.impact)}
                `}
                data-testid={`news-item-${item.id}`}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
                <span>{item.headline}</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-ticker {
          animation: ticker 60s linear infinite;
        }
        
        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
