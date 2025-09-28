import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Search, Filter, Star, TrendingUp, Zap, Shield,
  BookOpen, Users, Crown, Target, Eye, Heart,
  DollarSign, BarChart3, Sparkles, Scroll
} from 'lucide-react';
import { useHouseTheme } from '@/hooks/useHouseTheme';
import { useToast } from '@/hooks/use-toast';

interface SearchFilters {
  query: string;
  universe: string;
  powerRange: [number, number];
  valueRange: [number, number];
  sortBy: string;
  category: 'characters' | 'comics' | 'all';
}

interface CharacterResult {
  id: string;
  name: string;
  universe: string;
  strength: number;
  speed: number;
  intelligence: number;
  powerLevel: number;
  battleWinRate: number;
  totalBattles: number;
  battlesWon: number;
  marketValue: number;
  popularityScore: number;
  movieAppearances: number;
  assetId?: string;
}

interface ComicResult {
  id: string;
  categoryTitle: string;
  issueName: string;
  comicSeries: string;
  currentMarketValue: number;
  keyIssueRating: number;
  rarityScore: number;
  releaseDate?: string;
  writers: string[];
  pencilers: string[];
  coverArtists: string[];
}

export function AssetDiscoveryEngine() {
  const { houseTheme, getCurrentHouseColorClass } = useHouseTheme();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    universe: 'all',
    powerRange: [0, 10],
    valueRange: [0, 1000],
    sortBy: 'power_level',
    category: 'all'
  });

  const [searchDebounce, setSearchDebounce] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<CharacterResult | ComicResult | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(filters.query);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.query]);

  // Search characters
  const { data: characters, isLoading: charactersLoading } = useQuery({
    queryKey: ['/api/enhanced-characters', filters, searchDebounce],
    queryFn: () => {
      const params = new URLSearchParams({
        limit: '50',
        sort: filters.sortBy,
        ...(filters.universe !== 'all' && { universe: filters.universe }),
        ...(searchDebounce && { search: searchDebounce }),
        minPowerLevel: filters.powerRange[0].toString(),
        maxPowerLevel: filters.powerRange[1].toString()
      });

      return fetch(`/api/enhanced-characters?${params}`).then(res => res.json());
    },
    enabled: filters.category === 'characters' || filters.category === 'all',
    refetchInterval: 30000,
  });

  // Search comics
  const { data: comics, isLoading: comicsLoading } = useQuery({
    queryKey: ['/api/enhanced-comics', filters, searchDebounce],
    queryFn: () => {
      const params = new URLSearchParams({
        limit: '30',
        sort: 'current_market_value',
        ...(searchDebounce && { search: searchDebounce }),
        minValue: filters.valueRange[0].toString(),
        maxValue: filters.valueRange[1].toString()
      });

      return fetch(`/api/enhanced-comics?${params}`).then(res => res.json());
    },
    enabled: filters.category === 'comics' || filters.category === 'all',
    refetchInterval: 30000,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getPowerLevelColor = (powerLevel: number) => {
    if (powerLevel >= 8) return 'text-red-400 bg-red-900/20 border-red-500/30';
    if (powerLevel >= 6) return 'text-orange-400 bg-orange-900/20 border-orange-500/30';
    if (powerLevel >= 4) return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
    return 'text-green-400 bg-green-900/20 border-green-500/30';
  };

  const getRarityColor = (rarity: number) => {
    if (rarity >= 8) return 'text-purple-400 bg-purple-900/20 border-purple-500/30';
    if (rarity >= 6) return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
    if (rarity >= 4) return 'text-cyan-400 bg-cyan-900/20 border-cyan-500/30';
    return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
  };

  const addToWatchlist = (id: string) => {
    if (!watchlist.includes(id)) {
      setWatchlist(prev => [...prev, id]);
      toast({
        title: 'Added to Watchlist',
        description: 'Asset has been added to your watchlist',
      });
    }
  };

  const isInWatchlist = (id: string) => watchlist.includes(id);

  return (
    <div className="space-y-6" data-testid="asset-discovery-engine">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Search className="h-6 w-6 text-blue-400" />
            Asset Oracle
          </h2>
          <p className="text-slate-400 mt-1">
            Search through {characters?.count || 31181} warriors • {comics?.count || 53398} sacred scrolls
          </p>
        </div>
        <Badge variant="outline" className="text-blue-400">
          {houseTheme.primarySpecialization.replace('_', ' ').toUpperCase()} Focus
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Discovery Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search for characters, comics, creators..."
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="pl-10 bg-slate-700/50 border-slate-600"
              data-testid="search-input"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Category</label>
              <Select value={filters.category} onValueChange={(v: any) => setFilters(prev => ({ ...prev, category: v }))}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assets</SelectItem>
                  <SelectItem value="characters">Characters</SelectItem>
                  <SelectItem value="comics">Comics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Universe</label>
              <Select value={filters.universe} onValueChange={(v) => setFilters(prev => ({ ...prev, universe: v }))}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universes</SelectItem>
                  <SelectItem value="Marvel">Marvel</SelectItem>
                  <SelectItem value="DC Comics">DC Comics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Sort By</label>
              <Select value={filters.sortBy} onValueChange={(v) => setFilters(prev => ({ ...prev, sortBy: v }))}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="power_level">Power Level</SelectItem>
                  <SelectItem value="market_value">Market Value</SelectItem>
                  <SelectItem value="battle_win_rate">Win Rate</SelectItem>
                  <SelectItem value="popularity_score">Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setFilters({
                  query: '',
                  universe: 'all',
                  powerRange: [0, 10],
                  valueRange: [0, 1000],
                  sortBy: 'power_level',
                  category: 'all'
                })}
              >
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Range Sliders */}
          {filters.category !== 'comics' && (
            <div>
              <label className="text-sm font-medium text-slate-300 mb-3 block">
                Power Level Range: {filters.powerRange[0]} - {filters.powerRange[1]}
              </label>
              <Slider
                value={filters.powerRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, powerRange: value as [number, number] }))}
                max={10}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>
          )}

          {filters.category !== 'characters' && (
            <div>
              <label className="text-sm font-medium text-slate-300 mb-3 block">
                Value Range: ${filters.valueRange[0]} - ${filters.valueRange[1]}
              </label>
              <Slider
                value={filters.valueRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, valueRange: value as [number, number] }))}
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Tabs value={filters.category === 'all' ? 'characters' : filters.category} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="characters" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Warriors ({characters?.count || 0})
          </TabsTrigger>
          <TabsTrigger value="comics" className="flex items-center gap-2">
            <Scroll className="h-4 w-4" />
            Sacred Scrolls ({comics?.count || 0})
          </TabsTrigger>
        </TabsList>

        {/* Characters Results */}
        <TabsContent value="characters" className="space-y-4">
          {charactersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-slate-700 h-48 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {characters?.data?.map((character: CharacterResult) => (
                <Card 
                  key={character.id} 
                  className="bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 transition-colors hover-elevate cursor-pointer"
                  onClick={() => setSelectedAsset(character)}
                  data-testid={`character-result-${character.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{character.name}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {character.universe}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWatchlist(character.id);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Heart className={`h-4 w-4 ${isInWatchlist(character.id) ? 'fill-red-400 text-red-400' : ''}`} />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {/* Power Level */}
                      <div className={`p-2 rounded border ${getPowerLevelColor(character.powerLevel)}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Power Level</span>
                          <span className="font-bold">{character.powerLevel.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Battle Stats */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-sm font-bold text-red-400">{character.strength}</div>
                          <div className="text-xs text-slate-400">STR</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-blue-400">{character.speed}</div>
                          <div className="text-xs text-slate-400">SPD</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-purple-400">{character.intelligence}</div>
                          <div className="text-xs text-slate-400">INT</div>
                        </div>
                      </div>

                      {/* Battle Record */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Battles:</span>
                        <span className="text-white">{character.battlesWon}/{character.totalBattles}</span>
                      </div>

                      {/* Market Value */}
                      {character.marketValue && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Value:</span>
                          <span className="font-bold text-green-400">
                            {formatCurrency(character.marketValue)}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button className="w-full mt-4" size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Comics Results */}
        <TabsContent value="comics" className="space-y-4">
          {comicsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-slate-700 h-48 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comics?.data?.map((comic: ComicResult) => (
                <Card 
                  key={comic.id}
                  className="bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 transition-colors hover-elevate cursor-pointer"
                  onClick={() => setSelectedAsset(comic)}
                  data-testid={`comic-result-${comic.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-2">
                        <h3 className="font-semibold text-white text-sm leading-tight">
                          {comic.issueName}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          {comic.comicSeries}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWatchlist(comic.id);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Heart className={`h-4 w-4 ${isInWatchlist(comic.id) ? 'fill-red-400 text-red-400' : ''}`} />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {/* Rarity & Key Issue */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`p-2 rounded border ${getRarityColor(comic.rarityScore)}`}>
                          <div className="text-xs font-medium text-center">Rarity</div>
                          <div className="text-sm font-bold text-center">{comic.rarityScore.toFixed(1)}</div>
                        </div>
                        <div className="p-2 rounded border border-yellow-500/30 bg-yellow-900/20">
                          <div className="text-xs font-medium text-center text-yellow-400">Key Issue</div>
                          <div className="text-sm font-bold text-center text-yellow-400">{comic.keyIssueRating.toFixed(1)}</div>
                        </div>
                      </div>

                      {/* Creators */}
                      {comic.writers?.length > 0 && (
                        <div>
                          <div className="text-xs text-slate-400 mb-1">Writer:</div>
                          <div className="text-xs text-white truncate">{comic.writers[0]}</div>
                        </div>
                      )}

                      {/* Market Value */}
                      <div className="text-center p-3 bg-green-900/20 border border-green-500/30 rounded">
                        <div className="text-xs text-green-400 mb-1">Market Value</div>
                        <div className="text-lg font-bold text-green-400">
                          {formatCurrency(comic.currentMarketValue)}
                        </div>
                      </div>
                    </div>

                    <Button className="w-full mt-4" size="sm" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Issue
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}