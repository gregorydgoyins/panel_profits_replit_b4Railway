import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  MessageSquare, AlertCircle, Info, Star, Zap, TrendingUp,
  TrendingDown, Users, BookOpen, Sparkles, Volume2, VolumeX,
  ThumbsUp, ThumbsDown, Share2, Eye, Clock
} from 'lucide-react';

interface ComicNewsItem {
  id: string;
  timestamp: Date;
  headline: string;
  content: string;
  type: 'speech' | 'thought' | 'narration' | 'shout' | 'whisper';
  speaker: {
    name: string;
    role: 'hero' | 'villain' | 'narrator' | 'oracle' | 'crowd';
    avatar?: string;
  };
  sentiment: 'bullish' | 'bearish' | 'neutral' | 'mysterious';
  impact: 'high' | 'medium' | 'low';
  relatedAssets: string[];
  reactions: {
    likes: number;
    dislikes: number;
    shares: number;
    views: number;
  };
  visualEffect?: 'shake' | 'glow' | 'pulse' | 'flash';
}

interface ComicNewsFeed {
  currentIssue: string;
  newsItems: ComicNewsItem[];
  breakingNews?: ComicNewsItem;
}

export function ComicNewsFeed() {
  const [selectedNews, setSelectedNews] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState<'all' | 'bullish' | 'bearish' | 'neutral'>('all');

  // Fetch news formatted as comic dialogue
  const { data: newsFeed, isLoading, refetch } = useQuery<ComicNewsFeed>({
    queryKey: ['/api/market/comic-news'],
    refetchInterval: 45000 // Refresh every 45 seconds
  });

  // Trigger effects for breaking news
  useEffect(() => {
    if (newsFeed?.breakingNews && soundEnabled) {
      // Play sound effect for breaking news
      const audio = new Audio('/sounds/comic-alert.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  }, [newsFeed?.breakingNews, soundEnabled]);

  const getBubbleStyle = (type: string, sentiment: string) => {
    const baseStyle = "relative p-4 rounded-2xl";
    
    // Bubble shape based on type
    const shapeStyle = {
      'speech': 'clip-path-speech',
      'thought': 'clip-path-thought',
      'narration': 'clip-path-narration',
      'shout': 'clip-path-shout transform rotate-1',
      'whisper': 'clip-path-whisper opacity-90'
    }[type] || '';

    // Color based on sentiment
    const colorStyle = {
      'bullish': 'bg-gradient-to-br from-green-600 to-green-800 border-green-400 text-white',
      'bearish': 'bg-gradient-to-br from-red-600 to-red-800 border-red-400 text-white',
      'neutral': 'bg-gradient-to-br from-gray-600 to-gray-800 border-gray-400 text-white',
      'mysterious': 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400 text-white'
    }[sentiment] || '';

    return cn(baseStyle, shapeStyle, colorStyle, "border-3 shadow-lg");
  };

  const getSpeakerIcon = (role: string) => {
    switch (role) {
      case 'hero': return <Star className="w-5 h-5 text-yellow-400" />;
      case 'villain': return <Zap className="w-5 h-5 text-red-400" />;
      case 'narrator': return <BookOpen className="w-5 h-5 text-blue-400" />;
      case 'oracle': return <Eye className="w-5 h-5 text-purple-400" />;
      case 'crowd': return <Users className="w-5 h-5 text-gray-400" />;
      default: return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getImpactIndicator = (impact: string) => {
    switch (impact) {
      case 'high': return '!!!';
      case 'medium': return '!!';
      case 'low': return '!';
      default: return '';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  const filteredNews = newsFeed?.newsItems.filter(item => 
    filter === 'all' || item.sentiment === filter
  ) || [];

  if (isLoading) {
    return (
      <Card className="h-[700px] bg-gradient-to-br from-indigo-950 to-purple-950">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-white/10 rounded-lg" />
            <div className="h-16 bg-white/10 rounded-lg" />
            <div className="h-24 bg-white/10 rounded-lg" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-testid="comic-news-feed">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-yellow-400 uppercase">
            Market Chronicles
          </h2>
          <Badge className="bg-purple-600 text-white">
            {newsFeed?.currentIssue}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Sentiment Filter */}
          <div className="flex gap-1">
            {(['all', 'bullish', 'bearish', 'neutral'] as const).map((sentiment) => (
              <Button
                key={sentiment}
                variant={filter === sentiment ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(sentiment)}
                className={cn(
                  "text-xs",
                  filter === sentiment && sentiment === 'bullish' && "bg-green-600",
                  filter === sentiment && sentiment === 'bearish' && "bg-red-600",
                  filter === sentiment && sentiment === 'neutral' && "bg-gray-600"
                )}
                data-testid={`filter-${sentiment}`}
              >
                {sentiment}
              </Button>
            ))}
          </div>
          
          {/* Sound Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            data-testid="button-toggle-sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Breaking News Alert */}
      <AnimatePresence>
        {newsFeed?.breakingNews && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative"
            data-testid="breaking-news"
          >
            <Card className="bg-gradient-to-r from-red-900 to-orange-900 border-4 border-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.5)]">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <AlertCircle className="w-8 h-8 text-yellow-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-yellow-400 uppercase">
                      Breaking News {getImpactIndicator(newsFeed.breakingNews.impact)}
                    </h3>
                    <p className="text-sm text-yellow-200">
                      {formatTimestamp(newsFeed.breakingNews.timestamp)}
                    </p>
                  </div>
                </div>
                
                <div className={getBubbleStyle(newsFeed.breakingNews.type, newsFeed.breakingNews.sentiment)}>
                  <p className="text-lg font-bold mb-2">{newsFeed.breakingNews.headline}</p>
                  <p className="text-base">{newsFeed.breakingNews.content}</p>
                  
                  <div className="flex items-center gap-2 mt-4">
                    {getSpeakerIcon(newsFeed.breakingNews.speaker.role)}
                    <span className="text-sm font-medium">
                      — {newsFeed.breakingNews.speaker.name}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* News Feed Scroll */}
      <Card className="bg-gradient-to-br from-indigo-950 to-purple-950 border-2 border-yellow-400/30">
        <ScrollArea className="h-[500px]">
          <div className="p-6 space-y-4">
            {filteredNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative",
                  selectedNews === item.id && "scale-105"
                )}
                data-testid={`news-item-${index}`}
              >
                {/* Speech/Thought Bubble */}
                <div 
                  className={cn(
                    getBubbleStyle(item.type, item.sentiment),
                    "cursor-pointer transition-transform hover:scale-102",
                    item.visualEffect === 'shake' && "animate-shake",
                    item.visualEffect === 'glow' && "animate-glow",
                    item.visualEffect === 'pulse' && "animate-pulse",
                    item.visualEffect === 'flash' && "animate-flash"
                  )}
                  onClick={() => setSelectedNews(item.id === selectedNews ? null : item.id)}
                >
                  {/* Impact Badge */}
                  {item.impact === 'high' && (
                    <Badge className="absolute -top-2 -right-2 bg-red-600 text-white animate-bounce">
                      HOT!
                    </Badge>
                  )}

                  {/* Content */}
                  <div>
                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                      {item.headline}
                      {item.sentiment === 'bullish' && <TrendingUp className="w-4 h-4" />}
                      {item.sentiment === 'bearish' && <TrendingDown className="w-4 h-4" />}
                      {item.sentiment === 'mysterious' && <Sparkles className="w-4 h-4" />}
                    </h4>
                    
                    <p className={cn(
                      "text-sm",
                      item.type === 'whisper' && "italic opacity-80",
                      item.type === 'shout' && "uppercase font-bold"
                    )}>
                      {item.content}
                    </p>

                    {/* Related Assets */}
                    {item.relatedAssets.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.relatedAssets.map((asset) => (
                          <Badge key={asset} variant="secondary" className="text-xs">
                            {asset}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Speaker */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        {getSpeakerIcon(item.speaker.role)}
                        <span className="text-xs font-medium">
                          {item.speaker.name}
                        </span>
                      </div>
                      
                      <span className="text-xs opacity-70">
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Reactions (shown when selected) */}
                  <AnimatePresence>
                    {selectedNews === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex items-center gap-4 mt-4 pt-4 border-t border-white/20"
                      >
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-xs">{item.reactions.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsDown className="w-4 h-4" />
                          <span className="text-xs">{item.reactions.dislikes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="w-4 h-4" />
                          <span className="text-xs">{item.reactions.shares}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span className="text-xs">{item.reactions.views}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bubble Tail */}
                <div className={cn(
                  "absolute w-0 h-0",
                  item.type === 'speech' && "border-l-[20px] border-l-transparent border-t-[20px] border-r-[20px] border-r-transparent -bottom-4 left-8",
                  item.type === 'thought' && "w-4 h-4 bg-white rounded-full -bottom-4 left-8",
                  item.sentiment === 'bullish' && "border-t-green-700",
                  item.sentiment === 'bearish' && "border-t-red-700",
                  item.sentiment === 'neutral' && "border-t-gray-700",
                  item.sentiment === 'mysterious' && "border-t-purple-700"
                )} />
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}