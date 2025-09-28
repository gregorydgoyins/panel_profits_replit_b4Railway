import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Star, Users, Calendar, BarChart3, Zap, Eye, Shield, TrendingUp, Camera, Target, Sparkles, Heart, Award, Palette, Trophy, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ComicMetric {
  label: string;
  value: string;
  trend: number;
  color: 'red' | 'blue' | 'yellow' | 'green';
}

interface FeaturedCreator {
  id: string;
  name: string;
  role: string;
  description: string;
  comicsCreated: number;
  fanRating: string;
  category: 'Writer' | 'Artist' | 'Cover Artist' | 'Editor';
  yearsActive: string;
}

interface ComicSeries {
  id: string;
  title: string;
  year: string;
  description: string;
  issueCount: number;
  coverUrl?: string;
  publisher: string;
}

export function FeatureShowcase() {
  // Fetch real comic metrics
  const { data: rawMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/comics/metrics'],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
  
  // Transform raw metrics to display format
  const comicDatabaseMetrics: ComicMetric[] = rawMetrics ? [
    { label: 'Total Issues', value: rawMetrics.totalIssues?.toLocaleString() || '0', trend: 2.3, color: 'blue' },
    { label: 'Comic Series', value: rawMetrics.totalSeries?.toLocaleString() || '0', trend: 1.8, color: 'red' },
    { label: 'Legendary Creators', value: rawMetrics.totalCreators?.toLocaleString() || '0', trend: 0.5, color: 'yellow' },
    { label: 'Cover Gallery', value: rawMetrics.totalCovers?.toLocaleString() || '0', trend: 4.2, color: 'green' }
  ] : [];

  // Fetch real featured creators
  const { data: featuredCreators = [], isLoading: creatorsLoading } = useQuery({
    queryKey: ['/api/comics/creators', { limit: 6 }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fallback featured creators for demo purposes
  const fallbackCreators: FeaturedCreator[] = [
    {
      id: 'stan-lee',
      name: 'Stan Lee',
      role: 'Writer',
      description: 'Creator of Spider-Man, X-Men, Iron Man, and countless Marvel legends',
      comicsCreated: 1247,
      fanRating: '9.8/10',
      category: 'Writer',
      yearsActive: '1940-2018'
    },
    {
      id: 'jack-kirby',
      name: 'Jack Kirby',
      role: 'Artist',
      description: 'The King of Comics - Co-creator of Captain America, Thor, X-Men',
      comicsCreated: 2156,
      fanRating: '9.9/10',
      category: 'Artist',
      yearsActive: '1936-1994'
    },
    {
      id: 'steve-ditko',
      name: 'Steve Ditko',
      role: 'Cover Artist',
      description: 'Co-creator of Spider-Man and Doctor Strange',
      comicsCreated: 892,
      fanRating: '9.7/10',
      category: 'Cover Artist',
      yearsActive: '1953-2018'
    }
  ];

  // Fetch real trending comic series
  const { data: trendingComics = [], isLoading: trendingLoading } = useQuery({
    queryKey: ['/api/comics/trending', { limit: 6 }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Use real creators data or fallback
  const displayCreators = featuredCreators.length > 0 ? featuredCreators : fallbackCreators;

  // AI grading metrics for comic assessment
  const aiGradingMetrics = {
    accuracy: 94.2,
    confidence: 87.8,
    totalGraded: 15420,
    expertAgreement: 91.5
  };

  // Active competitions and contests
  const activeCompetitions = [
    { id: 1, name: 'Marvel Trivia Challenge', participants: 1247, prize: 'Rare Comics Bundle' },
    { id: 2, name: 'Comic Art Contest', participants: 892, prize: 'Original Art Print' },
    { id: 3, name: 'Creator Spotlight', participants: 456, prize: 'Creator Meet & Greet' }
  ];

  // No need for simulated metric updates since we use real data from the API

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Writer': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Artist': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Cover Artist': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Editor': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-16 py-16" data-testid="feature-showcase">
      
      {/* Comic Database Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <BookOpen className="h-8 w-8 text-blue-400" />
            </div>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-lg px-4 py-2">
              Comprehensive Collection
            </Badge>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight" data-testid="comic-database-title">
            <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 bg-clip-text text-transparent">
              Marvel Comics Database
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the complete Marvel Comics universe with over 40,000 comic issues spanning from 1939 to today. 
            Discover legendary creators, iconic storylines, and comprehensive comic metadata.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Comic Database Metrics */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-red-500/10 to-blue-500/10 border-red-500/20" data-testid="comic-metrics-card">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-red-400" />
                  <span>Database Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="grid grid-cols-2 gap-4">
                  {comicDatabaseMetrics.map((metric) => (
                    <div 
                      key={metric.label}
                      className="p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-yellow-400/20"
                      data-testid={`comic-metric-${metric.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                        {metric.label}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold font-mono text-white">
                          {metric.value}
                        </span>
                        <div className={`text-xs ${metric.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {metric.trend > 0 ? '+' : ''}{metric.trend.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Database Features</h3>
              <div className="space-y-3">
                {[
                  { icon: BookOpen, title: 'Complete Issues', desc: 'Every Marvel comic from 1939 to present day' },
                  { icon: Users, title: 'Creator Profiles', desc: 'Detailed information on writers, artists, and editors' },
                  { icon: Star, title: 'Cover Gallery', desc: 'High-quality cover images and variant editions' }
                ].map((feature) => (
                  <div key={feature.title} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg hover-elevate">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <feature.icon className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Comic Showcase */}
          <Card className="p-6 bg-black/40 backdrop-blur-md border-yellow-500/20" data-testid="featured-comic-showcase">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 animate-pulse" />
                <span>Featured Comic Spotlight</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-6">
                {/* Featured comic display */}
                <div className="p-4 bg-gradient-to-r from-red-500/10 to-blue-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-red-400">Marvel Classic</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      Key Issue
                    </Badge>
                  </div>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Title:</span>
                      <span className="text-white font-mono">Amazing Fantasy #15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Published:</span>
                      <span className="text-white font-mono">August 1962</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Significance:</span>
                      <span className="text-white font-mono">First Spider-Man</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700" data-testid="button-explore-comics">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explore Comics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Users className="h-8 w-8 text-purple-400" />
            </div>
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-lg px-4 py-2">
              Legendary Creators
            </Badge>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight" data-testid="creators-title">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Marvel Legends
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the visionary creators who shaped the Marvel Universe. From Stan Lee's imaginative storytelling 
            to Jack Kirby's dynamic art, discover the legends behind your favorite characters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCreators.map((creator) => (
            <Card 
              key={creator.id} 
              className="p-6 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20 hover-elevate"
              data-testid={`creator-${creator.id}`}
            >
              <CardHeader className="px-0 pt-0">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{creator.name}</CardTitle>
                  <Badge className={getCategoryColor(creator.category)}>
                    {creator.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {creator.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Comics Created:</span>
                      <span className="font-mono text-white">{creator.comicsCreated.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fan Rating:</span>
                      <span className="font-mono text-yellow-400 font-semibold">{creator.fanRating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Years Active:</span>
                      <span className="font-mono text-purple-400">{creator.yearsActive}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700" 
                    data-testid={`button-view-${creator.id}`}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    View Works
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center pt-6">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            data-testid="button-view-all-creators"
          >
            View All Creators
          </Button>
        </div>
      </section>

      {/* Comic Series Highlights */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-3 bg-green-500/20 rounded-full">
              <BookOpen className="h-8 w-8 text-green-400" />
            </div>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-lg px-4 py-2">
              Historic Series
            </Badge>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight" data-testid="comic-series-title">
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Iconic Comics
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the most influential comic series that shaped popular culture. From first appearances 
            to groundbreaking storylines, discover the comics that defined generations of readers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {trendingComics.map((series) => (
            <Card 
              key={series.id}
              className="p-6 bg-gradient-to-br from-green-500/5 to-blue-500/5 border-green-500/20 hover-elevate"
              data-testid={`comic-series-${series.id}`}
            >
              <CardContent className="p-0">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <BookOpen className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{series.title}</h3>
                      <div className="text-2xl font-bold font-mono text-green-400">
                        {series.year}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {series.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Publisher:</span>
                    <span className="text-green-400 font-mono">{series.publisher}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}