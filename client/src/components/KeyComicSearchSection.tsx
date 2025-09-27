import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Search, TrendingUp, TrendingDown, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';

interface Comic {
  symbol: string;
  title: string;
  price: number;
  change: number;
  publisher: string;
}

export function KeyComicSearchSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAge, setSelectedAge] = useState('all');
  const [selectedPublisher, setSelectedPublisher] = useState('all');
  const queryClient = useQueryClient();

  // Fetch assets (comics) using React Query with filters
  const { data: assets = [], isLoading, error } = useQuery({
    queryKey: ['/api/assets', { type: 'comic', search: searchQuery, publisher: selectedPublisher }],
    queryFn: async ({ queryKey }) => {
      const [, filters] = queryKey as [string, { type?: string; search?: string; publisher?: string }];
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);
      if (filters.publisher && filters.publisher !== 'all') params.append('publisher', filters.publisher);
      
      const response = await fetch(`/api/assets?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch assets');
      return response.json();
    },
    select: (data) => data || [], // Ensure we always have an array
  });

  // Fetch current user's watchlist
  const { data: watchlistAssets = [] } = useQuery({
    queryKey: ['/api/watchlists', 'user-default'], // Assuming default user watchlist
    select: (data) => data?.assets || [], // Extract assets from watchlist
  });

  // Add to watchlist mutation
  const addToWatchlistMutation = useMutation({
    mutationFn: async (assetId: string) => {
      return apiRequest('POST', '/api/watchlists/user-default/assets', { assetId });
    },
    onSuccess: () => {
      // Invalidate watchlist query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['/api/watchlists', 'user-default'] });
    },
  });

  const handleAddToWatchlist = (symbol: string) => {
    // Find the asset by symbol to get its ID
    const asset = assets.find(a => a.symbol === symbol);
    if (asset?.id) {
      addToWatchlistMutation.mutate(asset.id);
    } else {
      console.warn(`Asset with symbol ${symbol} not found or missing ID`);
    }
  };

  // Assets are now filtered server-side via queryFn, but apply any remaining client-side filters
  const filteredComics = assets;

  return (
    <Card className="p-6" data-testid="key-comic-search">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-serif">Key Comic Pricing Search</CardTitle>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Panel Profits Pricing
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="px-0 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title, symbol, or character..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-comic-search"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Select value={selectedAge} onValueChange={setSelectedAge}>
                <SelectTrigger data-testid="select-age">
                  <SelectValue placeholder="All Ages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="golden">Golden Age</SelectItem>
                  <SelectItem value="silver">Silver Age</SelectItem>
                  <SelectItem value="bronze">Bronze Age</SelectItem>
                  <SelectItem value="modern">Modern Age</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedPublisher} onValueChange={setSelectedPublisher}>
                <SelectTrigger data-testid="select-publisher">
                  <SelectValue placeholder="All Publishers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Publishers</SelectItem>
                  <SelectItem value="marvel">Marvel</SelectItem>
                  <SelectItem value="dc">DC Comics</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full" data-testid="button-advanced-search">
              Advanced Search
            </Button>
          </div>
          
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">
                {searchQuery ? 'Search Results' : 'Quick Price Lookup'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredComics.slice(0, 6).map((comic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-card rounded-lg hover-elevate"
                    data-testid={`comic-item-${comic.symbol}`}
                  >
                    <button 
                      className="flex-1 p-0 h-auto justify-start text-left hover:text-primary underline-offset-4 hover:underline"
                      data-testid={`link-comic-${comic.symbol}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="text-left">
                          <p className="font-medium">{comic.title}</p>
                          <p className="text-xs text-muted-foreground font-mono">{comic.symbol}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono">CC {comic.price.toLocaleString()}</p>
                          <div className="flex items-center justify-end space-x-1">
                            {comic.change > 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-400" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-400" />
                            )}
                            <p className={`text-sm font-mono ${comic.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {comic.change > 0 ? '+' : ''}{comic.change.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                    <div className="ml-3">
                      <Button
                        size="icon"
                        variant={watchlistAssets.some(asset => asset.symbol === comic.symbol) ? "default" : "ghost"}
                        onClick={() => handleAddToWatchlist(comic.symbol)}
                        data-testid={`button-watchlist-${comic.symbol}`}
                        disabled={addToWatchlistMutation.isPending}
                      >
                        {watchlistAssets.some(asset => asset.symbol === comic.symbol) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredComics.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-4">No results found</p>
                )}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                data-testid="button-view-all-comics"
              >
                View All Key Comics
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}