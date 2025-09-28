import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Zap, TrendingUp, Star, Sparkles, BarChart3, Shield, Trophy, Users, Calendar, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ComicCoverImage from '@/components/ComicCoverImage';

// Import actual comic cover images
import spiderManCover1 from '@assets/stock_images/spider-man_comic_boo_275afde9.jpg';
import spiderManCover2 from '@assets/stock_images/spider-man_comic_boo_63ce2e99.jpg';
import spiderManCover3 from '@assets/stock_images/spider-man_comic_boo_155e6aae.jpg';
import batmanCover1 from '@assets/stock_images/batman_comic_book_co_054b939e.jpg';
import batmanCover2 from '@assets/stock_images/batman_comic_book_co_36c5d572.jpg';
import xMenCover1 from '@assets/stock_images/x-men_comic_book_cov_4df97e0a.jpg';
import xMenCover2 from '@assets/stock_images/x-men_comic_book_cov_57999c65.jpg';
import avengersCover1 from '@assets/stock_images/avengers_comic_book__f9af90f1.jpg';
import avengersCover2 from '@assets/stock_images/avengers_comic_book__cc39d6cd.jpg';

interface FeaturedComic {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  coverUrl?: string;
  seriesId?: string;
  displayOrder: number;
  type: string;
}

interface ComicMetric {
  label: string;
  value: string;
  change: number;
  icon: 'issues' | 'value' | 'creators' | 'series';
}

// Featured comics with actual cover images
const featuredComicsCarousel: FeaturedComic[] = [
  {
    id: 'spider-man-1',
    title: 'Spider-Man',
    subtitle: 'Amazing Spider-Man',
    description: 'The ultimate wall-crawler returns in this classic adventure. With great power comes great responsibility as Peter Parker faces his greatest challenges yet.',
    coverUrl: spiderManCover1,
    seriesId: 'spider-man-series',
    displayOrder: 1,
    type: 'hero_banner'
  },
  {
    id: 'batman-1',
    title: 'Batman',
    subtitle: 'The Dark Knight',
    description: 'Gotham City\'s protector emerges from the shadows to face a new threat. Justice never sleeps in this thrilling Batman adventure.',
    coverUrl: batmanCover1,
    seriesId: 'batman-series',
    displayOrder: 2,
    type: 'hero_banner'
  },
  {
    id: 'x-men-1',
    title: 'X-Men',
    subtitle: 'Uncanny X-Men',
    description: 'Professor Xavier\'s students unite to protect a world that fears and hates them. The next stage of human evolution begins here.',
    coverUrl: xMenCover1,
    seriesId: 'x-men-series',
    displayOrder: 3,
    type: 'hero_banner'
  },
  {
    id: 'avengers-1',
    title: 'Avengers',
    subtitle: 'Earth\'s Mightiest Heroes',
    description: 'When Earth faces threats too great for any single hero, the Avengers assemble! Join the ultimate superhero team in action.',
    coverUrl: avengersCover1,
    seriesId: 'avengers-series',
    displayOrder: 4,
    type: 'hero_banner'
  },
  {
    id: 'spider-man-2',
    title: 'Spider-Man',
    subtitle: 'Web of Spider-Man',
    description: 'New adventures await the friendly neighborhood Spider-Man as he swings through Manhattan facing both old foes and new challenges.',
    coverUrl: spiderManCover2,
    seriesId: 'spider-man-series-2',
    displayOrder: 5,
    type: 'hero_banner'
  }
];

export function HeroBanner() {
  const [, setLocation] = useLocation();
  
  const [currentComicIndex, setCurrentComicIndex] = useState(0);
  
  // Use local featured comics with actual cover images
  const featuredComics = featuredComicsCarousel;
  const featuredLoading = false;
  
  // Fetch real comic cover statistics
  const { data: statsResponse, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/comic-covers/stats'],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
  
  const rawMetrics = statsResponse?.data || {};

  // Transform raw metrics to display format
  const comicMetrics: ComicMetric[] = rawMetrics ? [
    { label: 'Comic Issues', value: rawMetrics.totalIssues?.toLocaleString() || '0', change: 2.3, icon: 'issues' },
    { label: 'Total Covers', value: rawMetrics.totalCovers?.toLocaleString() || '0', change: 5.7, icon: 'value' },
    { label: 'Active Creators', value: rawMetrics.totalCreators?.toLocaleString() || '0', change: 1.2, icon: 'creators' },
    { label: 'Comic Series', value: rawMetrics.totalSeries?.toLocaleString() || '0', change: 0.8, icon: 'series' }
  ] : [];

  // AI confidence score for comic grading and analysis
  const aiConfidence = 87.5;

  // Comic rotation (no more simulated metrics since we use real data)
  useEffect(() => {
    if (featuredComics.length === 0) return;
    
    const comicRotationInterval = setInterval(() => {
      setCurrentComicIndex(prev => (prev + 1) % featuredComics.length);
    }, 8000); // Rotate comics every 8 seconds

    return () => {
      clearInterval(comicRotationInterval);
    };
  }, [featuredComics.length]);

  const currentComic = featuredComics[currentComicIndex];
  
  // Show loading state while data is being fetched
  if (featuredLoading || metricsLoading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/40 to-red-950/30 min-h-[600px] flex items-center justify-center" data-testid="hero-banner">
        <div className="text-white text-xl">Loading comic data...</div>
      </div>
    );
  }
  
  // Fallback if no featured comics available
  if (!featuredComics || featuredComics.length === 0) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/40 to-red-950/30 min-h-[600px] flex items-center justify-center" data-testid="hero-banner">
        <div className="text-white text-xl">No featured comics available</div>
      </div>
    );
  }

  const getMetricIcon = (iconType: string) => {
    switch (iconType) {
      case 'issues': return BookOpen;
      case 'value': return BarChart3;
      case 'creators': return Users;
      case 'series': return Calendar;
      default: return BookOpen;
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/40 to-red-950/30" data-testid="hero-banner">
      {/* Comic book background with dynamic effects */}
      <div className="absolute inset-0">
        {/* Comic book style halftone pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:20px_20px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[length:30px_30px]" />
        
        {/* Dynamic comic burst effects */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Floating comic elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['POW!', 'BOOM!', 'WHAM!', '★', '♦', '●'].map((text, i) => (
          <div
            key={i}
            className={`absolute text-lg font-bold ${i < 3 ? 'text-primary/15' : 'text-yellow-400/10'} animate-pulse`}
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.3}s`,
              transform: `rotate(${(i - 3) * 15}deg)`
            }}
          >
            {text}
          </div>
        ))}
      </div>

      <div className="relative z-10 px-6 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Featured Comic Info */}
            <div className="space-y-8">
              {/* Comic Series Indicator */}
              <div className="flex items-center space-x-3" data-testid="comic-series-indicator">
                <div className="flex items-center space-x-2 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 font-medium text-sm">Marvel Comics</span>
                </div>
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                  Classic Collection
                </Badge>
              </div>

              {/* Comic Title and Info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight" data-testid="hero-headline">
                    <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 bg-clip-text text-transparent">
                      {currentComic.title}
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-3xl lg:text-4xl">
                      {currentComic.subtitle || 'Featured Comic'}
                    </span>
                  </h1>
                  <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl">
                    {currentComic.description}
                  </p>
                </div>

                {/* Comic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-400">Type:</span>
                      <span className="text-white font-medium">{currentComic.type || 'Featured'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-400">Series:</span>
                      <span className="text-white font-medium">{currentComic.title}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-gray-400">Status:</span>
                      <span className="text-white font-medium">Active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-400">Priority:</span>
                      <span className="text-yellow-400 font-bold">#{currentComic.displayOrder || 1}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-bold px-8 py-3 text-lg"
                  data-testid="button-explore-comics"
                  onClick={() => setLocation('/comics')}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Comics
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 font-bold px-8 py-3 text-lg backdrop-blur-sm"
                  data-testid="button-view-collection"
                  onClick={() => setLocation('/portfolio')}
                >
                  <Star className="mr-2 h-5 w-5" />
                  View Collection
                </Button>
              </div>
            </div>

            {/* Right side - Featured Comic Cover & Metrics */}
            <div className="space-y-6">
              {/* Featured Comic Cover */}
              <Card className="p-6 bg-gradient-to-br from-red-500/10 to-blue-500/10 backdrop-blur-md border-red-500/20" data-testid="featured-comic-display">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 animate-pulse" />
                    <span className="text-sm font-medium text-yellow-400">Featured Comic</span>
                  </div>
                  
                  {/* Real Comic Cover */}
                  <div className="relative mx-auto">
                    <div className="transform hover:scale-105 transition-transform duration-300">
                      <ComicCoverImage
                        src={currentComic.coverUrl}
                        alt={currentComic.title}
                        size="xl"
                        className="shadow-2xl border-2 border-yellow-400/30"
                        showHoverEffect={true}
                        onClick={() => {
                          if (currentComic.coverUrl?.includes('comics.org')) {
                            window.open(currentComic.coverUrl, '_blank');
                          }
                        }}
                        priority={true}
                      />
                      {/* Comic book style shine effect */}
                      <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full blur-md" />
                    </div>
                  </div>

                  {/* Comic Navigation Dots */}
                  <div className="flex justify-center space-x-2">
                    {featuredComics.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentComicIndex 
                            ? 'bg-yellow-400 w-6' 
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                        onClick={() => setCurrentComicIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </Card>

              {/* Comic Database Metrics */}
              <div className="grid grid-cols-2 gap-3">
                {comicMetrics.map((metric) => {
                  const IconComponent = getMetricIcon(metric.icon);
                  return (
                    <Card 
                      key={metric.label} 
                      className="p-4 bg-black/30 backdrop-blur-sm border-yellow-400/20 hover-elevate"
                      data-testid={`comic-metric-${metric.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4 text-yellow-400" />
                          <div className="text-xs text-gray-400 uppercase tracking-wide">
                            {metric.label}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold font-mono text-white">
                            {metric.value}
                          </span>
                          <div className={`flex items-center space-x-1 text-sm ${
                            metric.change > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            <TrendingUp className="h-3 w-3" />
                            <span className="font-mono">
                              {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Comic Collection Panel */}
              <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-red-500/10 backdrop-blur-md border-yellow-500/30" data-testid="comic-collection-panel">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold text-yellow-400">Marvel Collection</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    Comprehensive database of <span className="text-yellow-400 font-bold">40,506 comic issues</span> 
                    spanning from Golden Age classics to modern releases.
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>Stan Lee • Jack Kirby • Steve Ditko • Legendary Creators</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}