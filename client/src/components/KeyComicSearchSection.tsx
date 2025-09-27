import { useState } from 'react';
import { BookOpen, Search, TrendingUp, TrendingDown, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

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
  const [watchlistItems, setWatchlistItems] = useState<Set<string>>(new Set());

  // Quick access comics for display
  const quickAccessComics: Comic[] = [
    { symbol: 'ACM1', title: 'Action Comics #1', price: 3200000, change: 4.06, publisher: 'DC' },
    { symbol: 'DTM27', title: 'Detective Comics #27', price: 2800000, change: 3.13, publisher: 'DC' },
    { symbol: 'AF15', title: 'Amazing Fantasy #15', price: 1800000, change: 5.57, publisher: 'Marvel' },
    { symbol: 'ASM300', title: 'Amazing Spider-Man #300', price: 2500, change: 5.26, publisher: 'Marvel' },
    { symbol: 'XMN1', title: 'X-Men #1 (1963)', price: 875000, change: -1.24, publisher: 'Marvel' },
    { symbol: 'FF1', title: 'Fantastic Four #1', price: 650000, change: 2.89, publisher: 'Marvel' }
  ];

  // Filter comics based on search and filters
  const filteredComics = quickAccessComics.filter(comic => {
    const matchesSearch = searchQuery === '' || 
      comic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comic.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPublisher = selectedPublisher === 'all' || 
      comic.publisher.toLowerCase() === selectedPublisher.toLowerCase();
    
    return matchesSearch && matchesPublisher;
  });

  const handleAddToWatchlist = (symbol: string) => {
    console.log(`Adding ${symbol} to watchlist`);
    setWatchlistItems(prev => new Set([...Array.from(prev), symbol]));
  };

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
                        variant={watchlistItems.has(comic.symbol) ? "default" : "ghost"}
                        onClick={() => handleAddToWatchlist(comic.symbol)}
                        data-testid={`button-watchlist-${comic.symbol}`}
                      >
                        {watchlistItems.has(comic.symbol) ? (
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