import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, BookOpen, TrendingUp, Star, Users, Building, 
  Sparkles, Filter, Heart, ArrowRight, DollarSign 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Comic {
  id: string;
  title: string;
  issue: string;
  publisher: string;
  yearPublished: number;
  keyCharacters: string[];
  significance: string;
  currentPrice: number;
  gradeDistribution: {
    [grade: string]: number;
  };
  marketTrend: 'UP' | 'DOWN' | 'STABLE';
  similarityScore?: number;
}

interface VectorSearchResult {
  success: boolean;
  results: Comic[];
  count: number;
  searchQuery: string;
}

export default function ComicsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Comic[]>([]);
  const { toast } = useToast();

  // Mock data for key comics
  const keyComics: Comic[] = [
    {
      id: 'xmen1',
      title: 'X-Men',
      issue: '#1',
      publisher: 'Marvel Comics',
      yearPublished: 1963,
      keyCharacters: ['Professor X', 'Cyclops', 'Marvel Girl', 'Beast', 'Angel', 'Iceman'],
      significance: 'First appearance of the X-Men team',
      currentPrice: 12000,
      gradeDistribution: { '9.8': 45000, '9.6': 28000, '9.4': 18000, '9.2': 12000 },
      marketTrend: 'UP'
    },
    {
      id: 'ih181',
      title: 'Incredible Hulk',
      issue: '#181',
      publisher: 'Marvel Comics',
      yearPublished: 1974,
      keyCharacters: ['Hulk', 'Wolverine', 'Wendigo'],
      significance: 'First appearance of Wolverine',
      currentPrice: 8500,
      gradeDistribution: { '9.8': 35000, '9.6': 22000, '9.4': 14000, '9.2': 8500 },
      marketTrend: 'UP'
    },
    {
      id: 'tos39',
      title: 'Tales of Suspense',
      issue: '#39',
      publisher: 'Marvel Comics',
      yearPublished: 1963,
      keyCharacters: ['Iron Man', 'Tony Stark'],
      significance: 'First appearance of Iron Man',
      currentPrice: 15000,
      gradeDistribution: { '9.8': 55000, '9.6': 35000, '9.4': 22000, '9.2': 15000 },
      marketTrend: 'STABLE'
    }
  ];

  // Vector search mutation
  const vectorSearchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest('POST', '/api/vectors/search/assets', {
        query,
        assetType: 'media',
        limit: 6
      });
      return response.json() as Promise<VectorSearchResult>;
    },
    onSuccess: (data) => {
      if (data.success) {
        setSearchResults(data.results);
        toast({
          title: "Search Complete!",
          description: `Found ${data.count} comics matching "${data.query}"`,
        });
      } else {
        toast({
          title: "Search Failed",
          description: "Unable to search comics. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error('Vector search failed:', error);
      toast({
        title: "Search Error",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Quick recommendations query
  const { data: recommendations } = useQuery<{comics: Comic[]}>({
    queryKey: ['/api/vectors/recommendations/comics-quick'],
    queryFn: async () => {
      // Mock data for now - in real implementation would call vector API
      return {
        comics: keyComics.slice(0, 2).map(comic => ({
          ...comic,
          similarityScore: Math.random() * 0.3 + 0.7 // 70-100% similarity
        }))
      };
    }
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      vectorSearchMutation.mutate(searchQuery.trim());
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UP': return '📈';
      case 'DOWN': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'UP': return 'text-green-600';
      case 'DOWN': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6" data-testid="page-comics">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Key Comics</h1>
          <p className="text-muted-foreground mt-1">
            Discover and trade key comic book issues with AI-powered search and recommendations
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Vector Search Enabled
        </Badge>
      </div>

      {/* Vector Search */}
      <Card data-testid="card-vector-search">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-500" />
            AI-Powered Comic Search
          </CardTitle>
          <CardDescription>
            Search for comics by description, characters, creators, storylines, or themes using semantic AI search
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search for 'first appearance superhero team' or 'cosmic storylines'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
              data-testid="input-comic-search"
            />
            <Button 
              onClick={handleSearch}
              disabled={vectorSearchMutation.isPending || !searchQuery.trim()}
              data-testid="button-search-comics"
            >
              {vectorSearchMutation.isPending ? (
                <Filter className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Search Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="search-results-grid">
                {searchResults.map((comic) => (
                  <Card key={comic.id} className="hover-elevate" data-testid={`search-result-${comic.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-sm font-semibold">{comic.title} {comic.issue}</CardTitle>
                          <p className="text-xs text-muted-foreground">{comic.publisher} ({comic.yearPublished})</p>
                        </div>
                        {comic.similarityScore && (
                          <Badge variant="secondary" className="text-xs">
                            {(comic.similarityScore * 100).toFixed(0)}% Match
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">{comic.significance}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{formatPrice(comic.currentPrice)}</span>
                          <div className={`flex items-center gap-1 ${getTrendColor(comic.marketTrend)}`}>
                            <span className="text-sm">{getTrendIcon(comic.marketTrend)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Recommendations */}
      {recommendations?.comics && recommendations.comics.length > 0 && (
        <Card data-testid="card-comic-recommendations">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Recommended For You
            </CardTitle>
            <CardDescription>
              AI-curated comic recommendations based on market trends and your interests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="recommendations-grid">
              {recommendations.comics.map((comic) => (
                <Card key={comic.id} className="hover-elevate bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20" data-testid={`recommendation-${comic.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-sm font-semibold">{comic.title} {comic.issue}</CardTitle>
                        <p className="text-xs text-muted-foreground">{comic.publisher} ({comic.yearPublished})</p>
                      </div>
                      {comic.similarityScore && (
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          {(comic.similarityScore * 100).toFixed(0)}% Match
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">{comic.significance}</p>
                      <div className="flex flex-wrap gap-1">
                        {comic.keyCharacters.slice(0, 3).map((character) => (
                          <Badge key={character} variant="outline" className="text-xs">
                            {character}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">{formatPrice(comic.currentPrice)}</span>
                        <Button size="sm" variant="outline">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                View All Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Comics Grid */}
      <Card data-testid="card-key-comics">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Key Issue Trading
          </CardTitle>
          <CardDescription>
            Discover and trade key comic book issues including first appearances, origin stories, and significant storylines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="key-comics-grid">
            {keyComics.map((comic) => (
              <Card key={comic.id} className="hover-elevate" data-testid={`key-comic-${comic.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold">{comic.title} {comic.issue}</CardTitle>
                      <p className="text-sm text-muted-foreground">{comic.publisher} ({comic.yearPublished})</p>
                    </div>
                    <div className={`flex items-center gap-1 ${getTrendColor(comic.marketTrend)}`}>
                      <span>{getTrendIcon(comic.marketTrend)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{comic.significance}</p>
                    
                    {/* Key Characters */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2">KEY CHARACTERS</h4>
                      <div className="flex flex-wrap gap-1">
                        {comic.keyCharacters.slice(0, 4).map((character) => (
                          <Badge key={character} variant="outline" className="text-xs">
                            {character}
                          </Badge>
                        ))}
                        {comic.keyCharacters.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{comic.keyCharacters.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Starting at</p>
                          <p className="text-xl font-bold">{formatPrice(comic.currentPrice)}</p>
                        </div>
                        <Button size="sm" data-testid={`button-trade-${comic.id}`}>
                          <DollarSign className="w-3 h-3 mr-1" />
                          Trade
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Intelligence Link */}
      <Alert data-testid="alert-market-intelligence">
        <TrendingUp className="w-4 h-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            Get deeper market insights and price predictions with our AI Studio's vector-powered analysis
          </span>
          <Button variant="outline" size="sm">
            <ArrowRight className="w-3 h-3 mr-1" />
            Open AI Studio
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}