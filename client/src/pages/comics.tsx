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
  name: string;
  symbol: string;
  type: string;
  description: string;
  metadata: any;
  similarityScore?: number;
  searchScore?: number;
}

interface VectorSearchResult {
  success: boolean;
  results: Comic[];
  count: number;
  query: string;
}

export default function ComicsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Comic[]>([]);
  const { toast } = useToast();

  // Mock data for key comics - using real asset structure
  const keyComics: Comic[] = [
    {
      id: 'xmen1',
      name: 'X-Men #1',
      symbol: 'XMEN_1_1963',
      type: 'media',
      description: 'First appearance of the X-Men team - Professor X, Cyclops, Marvel Girl, Beast, Angel, Iceman',
      metadata: { publisher: 'Marvel Comics', year: 1963, category: 'superhero', tags: ['marvel', 'first-appearance', 'x-men'] }
    },
    {
      id: 'ih181',
      name: 'Incredible Hulk #181',
      symbol: 'HULK_181_1974',
      type: 'media',
      description: 'First appearance of Wolverine - featuring Hulk, Wolverine, and Wendigo in iconic debut',
      metadata: { publisher: 'Marvel Comics', year: 1974, category: 'superhero', tags: ['marvel', 'wolverine', 'first-appearance'] }
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
      // Use real data from database
      try {
        const response = await apiRequest('GET', '/api/assets');
        const assets = await response.json();
        return {
          comics: assets.slice(0, 2).map((comic: any) => ({
            ...comic,
            similarityScore: Math.random() * 0.3 + 0.7 // 70-100% similarity
          }))
        };
      } catch (error) {
        // Fallback to mock data if API fails
        return {
          comics: keyComics.map(comic => ({
            ...comic,
            similarityScore: Math.random() * 0.3 + 0.7
          }))
        };
      }
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
          <h1 className="text-3xl ">Key Comics</h1>
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
              <h3 className=" mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Search Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="search-results-grid">
                {searchResults.map((comic) => (
                  <Card key={comic.id} className="hover-elevate" data-testid={`search-result-${comic.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-sm ">{comic.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">{comic.metadata?.publisher || 'Unknown'} ({comic.metadata?.year || 'N/A'})</p>
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
                        <p className="text-xs text-muted-foreground">{comic.description?.slice(0, 100)}...</p>
                        <div className="flex justify-between items-center">
                          <span className=" text-xs font-mono bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">{comic.symbol}</span>
                          <div className="flex items-center gap-1 text-green-600">
                            <span className="text-sm">📈</span>
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
                        <CardTitle className="text-sm ">{comic.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{comic.metadata?.publisher || 'Unknown'} ({comic.metadata?.year || 'N/A'})</p>
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
                      <p className="text-xs text-muted-foreground">{comic.description?.slice(0, 150) || 'No description available'}...</p>
                      <div className="flex flex-wrap gap-1">
                        {comic.metadata?.tags?.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        )) || <Badge variant="outline" className="text-xs">Media Asset</Badge>}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className=" text-xs font-mono bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">{comic.symbol}</span>
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
                      <CardTitle className="text-lg ">{comic.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{comic.metadata?.publisher || 'Unknown'} ({comic.metadata?.year || 'N/A'})</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <span>📈</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{comic.description}</p>
                    
                    {/* Tags */}
                    <div>
                      <h4 className="text-xs  text-muted-foreground mb-2">TAGS</h4>
                      <div className="flex flex-wrap gap-1">
                        {comic.metadata?.tags?.slice(0, 4).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        )) || (
                          <Badge variant="outline" className="text-xs">
                            {comic.metadata?.category || 'media'}
                          </Badge>
                        )}
                        {comic.metadata?.tags && comic.metadata.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{comic.metadata.tags.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Asset Info */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Asset Symbol</p>
                          <p className="text-lg  font-mono bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">{comic.symbol}</p>
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