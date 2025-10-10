import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ComicMarketSplashPage } from '@/components/storyDriven/ComicMarketSplashPage';
import { ComicPanelMarketEvents } from '@/components/storyDriven/ComicPanelMarketEvents';
import { ComicNewsFeed } from '@/components/storyDriven/ComicNewsFeed';
import { cn } from '@/lib/utils';
import {
  BookOpen, Zap, TrendingUp, Sparkles, Flame, Shield,
  Eye, Crown, Activity, Globe, Star, Layers
} from 'lucide-react';

interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  type: 'character' | 'comic' | 'creator' | 'publisher';
  currentPrice: number;
  change24h: number;
  marketCap: number;
  storyRating: number; // How dramatic the story is (1-10)
}

export default function StoryDrivenMarketViz() {
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [viewMode, setViewMode] = useState<'splash' | 'panels' | 'feed' | 'combined'>('combined');
  const [storyTheme, setStoryTheme] = useState<'epic' | 'mystery' | 'action' | 'drama'>('epic');

  // Fetch top story-worthy assets
  const { data: topAssets, isLoading: isAssetsLoading } = useQuery<MarketAsset[]>({
    queryKey: ['/api/market/story-assets'],
    refetchInterval: 60000
  });

  // Fetch market narrative summary
  const { data: marketNarrative, isLoading: isNarrativeLoading } = useQuery({
    queryKey: ['/api/market/narrative'],
    refetchInterval: 120000
  });

  const getThemeStyle = (theme: string) => {
    switch (theme) {
      case 'epic':
        return 'bg-gradient-to-br from-purple-950 via-indigo-900 to-blue-950';
      case 'mystery':
        return 'bg-gradient-to-br from-gray-950 via-purple-950 to-black';
      case 'action':
        return 'bg-gradient-to-br from-red-950 via-orange-900 to-yellow-950';
      case 'drama':
        return 'bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-950';
      default:
        return 'bg-gradient-to-br from-purple-950 via-indigo-900 to-blue-950';
    }
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'epic': return <Crown className="w-5 h-5" />;
      case 'mystery': return <Eye className="w-5 h-5" />;
      case 'action': return <Zap className="w-5 h-5" />;
      case 'drama': return <Star className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getStoryRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
        )}
      />
    ));
  };

  return (
    <div className={cn("min-h-screen p-6", getThemeStyle(storyTheme))}>
      {/* Comic Book Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <Card className="bg-black/60 border-4 border-yellow-400 shadow-[0_0_40px_rgba(234,179,8,0.3)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BookOpen className="w-8 h-8 text-yellow-400" />
                <div>
                  <CardTitle className="text-3xl text-yellow-400 uppercase tracking-wider">
                    Market Stories Visualization
                  </CardTitle>
                  <p className="text-yellow-200/80 mt-1">
                    Where Finance Meets Sequential Art
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Theme Selector */}
                <Select value={storyTheme} onValueChange={(value: any) => setStoryTheme(value)}>
                  <SelectTrigger className="w-40 border-yellow-400 text-yellow-400" data-testid="select-theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="epic" data-testid="option-epic">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        Epic
                      </div>
                    </SelectItem>
                    <SelectItem value="mystery" data-testid="option-mystery">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Mystery
                      </div>
                    </SelectItem>
                    <SelectItem value="action" data-testid="option-action">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Action
                      </div>
                    </SelectItem>
                    <SelectItem value="drama" data-testid="option-drama">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Drama
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Selector */}
                <div className="flex gap-1 bg-black/40 p-1 rounded-lg">
                  {(['combined', 'splash', 'panels', 'feed'] as const).map((mode) => (
                    <Button
                      key={mode}
                      variant={viewMode === mode ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode(mode)}
                      className={cn(
                        "text-xs",
                        viewMode === mode && "bg-yellow-600"
                      )}
                      data-testid={`view-${mode}`}
                    >
                      {mode}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Market Narrative Summary */}
          {marketNarrative && (
            <CardContent>
              <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-4 rounded-lg border border-purple-400/30">
                <div className="flex items-center gap-3 mb-2">
                  {getThemeIcon(storyTheme)}
                  <h3 className="text-lg  text-purple-300">Today's Market Saga</h3>
                </div>
                <p className="text-white/90 italic">
                  "{marketNarrative.summary}"
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <Badge className="bg-purple-600">
                    Act {marketNarrative.currentAct}
                  </Badge>
                  <Badge className={cn(
                    marketNarrative.mood === 'heroic' && "bg-green-600",
                    marketNarrative.mood === 'tragic' && "bg-red-600",
                    marketNarrative.mood === 'mysterious' && "bg-purple-600"
                  )}>
                    {marketNarrative.mood}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Activity className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-yellow-400">
                      {marketNarrative.intensity}/10 Intensity
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Asset Selector for Splash Page */}
      {(viewMode === 'splash' || viewMode === 'combined') && (
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-black/40 border-2 border-yellow-400/50">
            <CardHeader>
              <CardTitle className="text-xl text-yellow-400">
                Select Your Hero's Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {topAssets?.map((asset) => (
                  <motion.button
                    key={asset.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedAsset(asset.id)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all",
                      selectedAsset === asset.id
                        ? "border-yellow-400 bg-yellow-400/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    )}
                    data-testid={`asset-${asset.symbol.toLowerCase()}`}
                  >
                    <div className="text-left">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {asset.type}
                        </Badge>
                        <span className={cn(
                          "text-sm ",
                          asset.change24h >= 0 ? "text-green-400" : "text-red-400"
                        )}>
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(1)}%
                        </span>
                      </div>
                      <p className=" text-white mb-1">{asset.symbol}</p>
                      <p className="text-xs text-white/60 mb-2">{asset.name}</p>
                      <div className="flex items-center gap-1">
                        {getStoryRatingStars(asset.storyRating)}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Content Area */}
      <div className="space-y-6">
        {viewMode === 'combined' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Splash Page */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {selectedAsset ? (
                <ComicMarketSplashPage assetId={selectedAsset} />
              ) : (
                <Card className="h-[600px] flex items-center justify-center bg-black/40 border-2 border-yellow-400/30">
                  <div className="text-center">
                    <Layers className="w-16 h-16 text-yellow-400/50 mx-auto mb-4" />
                    <p className="text-xl text-yellow-400/70">
                      Select an asset to view its epic price journey
                    </p>
                  </div>
                </Card>
              )}
            </motion.div>

            {/* Right Column - Events & News */}
            <div className="space-y-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ComicPanelMarketEvents />
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <ComicNewsFeed />
              </motion.div>
            </div>
          </div>
        ) : viewMode === 'splash' ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {selectedAsset ? (
              <ComicMarketSplashPage assetId={selectedAsset} />
            ) : (
              <Card className="h-[600px] flex items-center justify-center bg-black/40 border-2 border-yellow-400/30">
                <div className="text-center">
                  <Layers className="w-16 h-16 text-yellow-400/50 mx-auto mb-4" />
                  <p className="text-xl text-yellow-400/70">
                    Select an asset to view its epic price journey
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        ) : viewMode === 'panels' ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <ComicPanelMarketEvents />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <ComicNewsFeed />
          </motion.div>
        )}
      </div>

      {/* Comic Book Footer */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <Card className="bg-black/60 border-2 border-yellow-400/30">
          <CardContent className="py-4">
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-white/70">328 Assets Trading</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-white/70">Market Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-white/70">High Drama Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-white/70">Seven Houses United</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}