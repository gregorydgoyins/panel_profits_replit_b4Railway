import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, TrendingUp, Zap, DollarSign, ArrowRight, 
  Sparkles, Users, BookOpen, Target, AlertCircle
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  id: string;
  score: number;
  metadata: {
    name?: string;
    title?: string;
    symbol?: string;
    type?: string;
    asset_type?: string;
    pricing?: {
      current_price?: number;
      price?: number;
    };
    publisher?: string;
    description?: string;
  };
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
}

export default function AssetDiscovery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Debounce search input - 500ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform search when debounced query changes
  const { data: searchResults, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ['/api/pinecone/search', debouncedQuery],
    enabled: debouncedQuery.length > 0,
    queryFn: async () => {
      setIsSearching(true);
      try {
        const response = await apiRequest('POST', '/api/pinecone/search', {
          query: debouncedQuery,
          topK: 20
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Search error:', error);
        throw error;
      } finally {
        setIsSearching(false);
      }
    },
  });

  // Sort results by similarity score (highest first)
  const sortedResults = useMemo(() => {
    if (!searchResults?.results) return [];
    return [...searchResults.results].sort((a, b) => b.score - a.score);
  }, [searchResults]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getSimilarityPercent = (score: number) => {
    return Math.round(score * 100);
  };

  const getAssetTypeColor = (type?: string) => {
    const normalizedType = type?.toLowerCase() || '';
    if (normalizedType.includes('character')) return 'bg-purple-600/20 text-purple-400 border-purple-600/30';
    if (normalizedType.includes('creator')) return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
    if (normalizedType.includes('comic')) return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
    return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
  };

  const getAssetTypeIcon = (type?: string) => {
    const normalizedType = type?.toLowerCase() || '';
    if (normalizedType.includes('character')) return <Users className="w-3 h-3" />;
    if (normalizedType.includes('creator')) return <Sparkles className="w-3 h-3" />;
    if (normalizedType.includes('comic')) return <BookOpen className="w-3 h-3" />;
    return <Target className="w-3 h-3" />;
  };

  const getAssetPrice = (metadata: SearchResult['metadata']) => {
    return metadata.pricing?.current_price || metadata.pricing?.price || 0;
  };

  const getAssetName = (metadata: SearchResult['metadata']) => {
    return metadata.name || metadata.title || 'Unknown Asset';
  };

  const handleTradeClick = (result: SearchResult) => {
    const assetId = result.id;
    const assetType = result.metadata.type || result.metadata.asset_type || '';
    
    // Navigate to trading page with asset pre-selected
    setLocation(`/trading?assetId=${assetId}`);
    
    toast({
      title: "Opening Trading Terminal",
      description: `Preparing to trade ${getAssetName(result.metadata)}`,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const showLoading = isLoading || isSearching;
  const showResults = !showLoading && sortedResults.length > 0;
  const showEmpty = !showLoading && debouncedQuery.length > 0 && sortedResults.length === 0;
  const showWelcome = !showLoading && debouncedQuery.length === 0;

  return (
    <div className="min-h-screen bg-background" data-testid="page-asset-discovery">
      {/* Header - Bloomberg Terminal Style */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="space-y-4">
            {/* Title Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight font-serif" data-testid="heading-page-title">
                  Asset Discovery
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Cross-publisher intelligence • Semantic search powered by AI
                </p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1 border">
                <Sparkles className="w-3 h-3" />
                Vector Search
              </Badge>
            </div>

            {/* Search Bar - Brutalist Design */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Find Marvel's Batman, discover hidden gems..."
                value={searchQuery}
                onChange={handleInputChange}
                className="pl-12 h-14 text-lg bg-background border-2 focus:border-primary"
                data-testid="input-search-query"
              />
              {showLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-primary rounded-full animate-spin border-t-transparent" />
                </div>
              )}
            </div>

            {/* Search Stats */}
            {searchResults && sortedResults.length > 0 && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span data-testid="text-results-count">
                  {sortedResults.length} results found
                </span>
                <span>•</span>
                <span>Query: "{searchResults.query}"</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Welcome State */}
        {showWelcome && (
          <div className="text-center py-16 space-y-6" data-testid="section-welcome">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Search className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Discover Tradeable Assets</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Use natural language to find characters, creators, and comics across publishers. 
                Try searching for "Marvel's Batman" or "characters similar to Wonder Woman"
              </p>
            </div>

            {/* Example Searches */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
              <Card className="hover-elevate cursor-pointer" onClick={() => setSearchQuery("Marvel's Batman")}>
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                  <p className="text-sm font-medium">Marvel's Batman</p>
                  <p className="text-xs text-muted-foreground mt-1">Cross-publisher comparison</p>
                </CardContent>
              </Card>

              <Card className="hover-elevate cursor-pointer" onClick={() => setSearchQuery("characters similar to Wonder Woman")}>
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                  <p className="text-sm font-medium">Similar to Wonder Woman</p>
                  <p className="text-xs text-muted-foreground mt-1">Semantic similarity</p>
                </CardContent>
              </Card>

              <Card className="hover-elevate cursor-pointer" onClick={() => setSearchQuery("valuable golden age comics")}>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
                  <p className="text-sm font-medium">Valuable Golden Age</p>
                  <p className="text-xs text-muted-foreground mt-1">Investment opportunities</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Loading State */}
        {showLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" data-testid="section-loading">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-8 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {showResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" data-testid="section-results">
            {sortedResults.map((result, index) => {
              const assetName = getAssetName(result.metadata);
              const assetPrice = getAssetPrice(result.metadata);
              const assetType = result.metadata.type || result.metadata.asset_type || 'Asset';
              const symbol = result.metadata.symbol || result.id;
              const similarityPercent = getSimilarityPercent(result.score);

              return (
                <Card 
                  key={result.id}
                  className="hover-elevate active-elevate-2 transition-all"
                  data-testid={`card-asset-${index}`}
                >
                  <CardHeader className="space-y-2 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-bold truncate" data-testid={`text-asset-name-${index}`}>
                          {assetName}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground truncate mt-1" data-testid={`text-asset-symbol-${index}`}>
                          {symbol}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`shrink-0 flex items-center gap-1 border ${getAssetTypeColor(assetType)}`}
                        data-testid={`badge-asset-type-${index}`}
                      >
                        {getAssetTypeIcon(assetType)}
                        <span className="text-xs">{assetType}</span>
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Price Display */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Current Price</p>
                        <p className="text-xl font-bold text-foreground" data-testid={`text-asset-price-${index}`}>
                          {formatCurrency(assetPrice)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Match</p>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-yellow-500" />
                          <p className="text-lg font-bold text-yellow-500" data-testid={`text-similarity-score-${index}`}>
                            {similarityPercent}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Publisher */}
                    {result.metadata.publisher && (
                      <p className="text-xs text-muted-foreground truncate">
                        {result.metadata.publisher}
                      </p>
                    )}

                    {/* Trade Button */}
                    <Button 
                      onClick={() => handleTradeClick(result)}
                      className="w-full flex items-center justify-center gap-2"
                      data-testid={`button-trade-${index}`}
                    >
                      <DollarSign className="w-4 h-4" />
                      Trade Now
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {showEmpty && (
          <div className="text-center py-16 space-y-4" data-testid="section-empty">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">No Results Found</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find any assets matching "{debouncedQuery}". 
                Try refining your search or use different keywords.
              </p>
            </div>

            {/* Suggestions */}
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">Try searching for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Spider-Man', 'Batman', 'X-Men', 'Stan Lee', 'Detective Comics'].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(suggestion)}
                    className="hover-elevate"
                    data-testid={`button-suggestion-${suggestion.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 space-y-4" data-testid="section-error">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Search Error</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Failed to perform search. Please try again later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
