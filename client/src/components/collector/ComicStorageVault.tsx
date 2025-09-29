import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComicStorageView } from '@/components/ui/comic-storage-view';
import { AssetGradingCard } from '@/components/ui/asset-grading-card';
import { 
  Archive, Grid, List, Filter, SortAsc, SortDesc, Search, 
  Shield, Star, Gem, Crown, Eye, Package, Briefcase 
} from 'lucide-react';
import { useHouseTheme } from '@/contexts/HouseThemeContext';

interface GradedAsset {
  id: string;
  assetId: string;
  name: string;
  symbol: string;
  type: 'character' | 'comic' | 'creator' | 'publisher';
  overallGrade: number;
  rarityTier: 'common' | 'uncommon' | 'rare' | 'ultra_rare' | 'legendary' | 'mythic';
  currentMarketValue: number;
  acquisitionPrice: number;
  acquisitionDate: string;
  storageType: string;
  storageCondition: string;
  isKeyIssue: boolean;
  isSigned: boolean;
  houseAffiliation?: string;
  imageUrl?: string;
  certificationNumber?: string;
  certificationAuthority: string;
}

interface StorageBox {
  id: string;
  name: string;
  boxType: 'long_box' | 'short_box' | 'magazine_box' | 'display_case' | 'graded_slab_storage';
  capacity: number;
  currentCount: number;
  totalValue: number;
  averageGrade: number;
  location: string;
  condition: string;
}

interface ComicStorageVaultProps {
  assets: GradedAsset[];
  storageBoxes: StorageBox[];
  onAssetSelect: (asset: GradedAsset) => void;
  onBoxSelect: (box: StorageBox) => void;
  onCreateBox: () => void;
  onGradeAsset: (assetId: string) => void;
  isLoading?: boolean;
}

export function ComicStorageVault({
  assets,
  storageBoxes,
  onAssetSelect,
  onBoxSelect,
  onCreateBox,
  onGradeAsset,
  isLoading = false
}: ComicStorageVaultProps) {
  const { currentHouse, getHouseTheme } = useHouseTheme();
  const [activeTab, setActiveTab] = useState<'vault' | 'boxes'>('vault');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'grade' | 'value' | 'rarity' | 'date'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [filterHouse, setFilterHouse] = useState<string>('all');

  // Filter and sort assets
  const filteredAndSortedAssets = useMemo(() => {
    let filtered = assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRarity = filterRarity === 'all' || asset.rarityTier === filterRarity;
      const matchesHouse = filterHouse === 'all' || asset.houseAffiliation === filterHouse;
      
      return matchesSearch && matchesRarity && matchesHouse;
    });

    // Sort assets
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'grade':
          aValue = a.overallGrade;
          bValue = b.overallGrade;
          break;
        case 'value':
          aValue = a.currentMarketValue;
          bValue = b.currentMarketValue;
          break;
        case 'rarity':
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, ultra_rare: 4, legendary: 5, mythic: 6 };
          aValue = rarityOrder[a.rarityTier];
          bValue = rarityOrder[b.rarityTier];
          break;
        case 'date':
          aValue = new Date(a.acquisitionDate).getTime();
          bValue = new Date(b.acquisitionDate).getTime();
          break;
        default:
          return 0;
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [assets, searchTerm, sortBy, sortOrder, filterRarity, filterHouse]);

  // Calculate collection stats
  const collectionStats = useMemo(() => {
    const totalValue = assets.reduce((sum, asset) => sum + asset.currentMarketValue, 0);
    const averageGrade = assets.length > 0 ? 
      assets.reduce((sum, asset) => sum + asset.overallGrade, 0) / assets.length : 0;
    
    const rarityCount = assets.reduce((counts: any, asset) => {
      counts[asset.rarityTier] = (counts[asset.rarityTier] || 0) + 1;
      return counts;
    }, {});

    return {
      totalItems: assets.length,
      totalValue,
      averageGrade,
      rarityCount,
      keyIssues: assets.filter(a => a.isKeyIssue).length,
      signedItems: assets.filter(a => a.isSigned).length
    };
  }, [assets]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'text-amber-400 bg-amber-950 border-amber-400';
      case 'legendary': return 'text-orange-400 bg-orange-950 border-orange-400';
      case 'ultra_rare': return 'text-purple-400 bg-purple-950 border-purple-400';
      case 'rare': return 'text-blue-400 bg-blue-950 border-blue-400';
      case 'uncommon': return 'text-green-400 bg-green-950 border-green-400';
      default: return 'text-gray-400 bg-gray-800 border-gray-500';
    }
  };

  const getStorageIcon = (boxType: string) => {
    switch (boxType) {
      case 'long_box': return Archive;
      case 'short_box': return Package;
      case 'display_case': return Eye;
      case 'graded_slab_storage': return Shield;
      default: return Briefcase;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="comic-storage-vault">
      {/* Collection Stats Header */}
      <Card className={`bg-gradient-to-br from-${currentHouse}-primary/10 to-${currentHouse}-secondary/5 border-${currentHouse}-primary/20`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Collector's Vault
            <Badge variant="outline" className="ml-auto">
              {collectionStats.totalItems} Items
            </Badge>
          </CardTitle>
          <CardDescription>
            Professional-grade collection management with CGC-style authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                ${collectionStats.totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {collectionStats.averageGrade.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Grade</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {collectionStats.keyIssues}
              </div>
              <div className="text-sm text-muted-foreground">Key Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">
                {collectionStats.signedItems}
              </div>
              <div className="text-sm text-muted-foreground">Signed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vault" data-testid="tab-vault">Storage Vault</TabsTrigger>
          <TabsTrigger value="boxes" data-testid="tab-boxes">Storage Boxes</TabsTrigger>
        </TabsList>

        <TabsContent value="vault" className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-1 gap-2 items-center max-w-md">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-vault"
              />
            </div>

            <div className="flex gap-2 items-center">
              {/* Filter Controls */}
              <Select value={filterRarity} onValueChange={setFilterRarity}>
                <SelectTrigger className="w-32" data-testid="select-filter-rarity">
                  <SelectValue placeholder="Rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rarity</SelectItem>
                  <SelectItem value="mythic">Mythic</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                  <SelectItem value="ultra_rare">Ultra Rare</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="uncommon">Uncommon</SelectItem>
                  <SelectItem value="common">Common</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterHouse} onValueChange={setFilterHouse}>
                <SelectTrigger className="w-32" data-testid="select-filter-house">
                  <SelectValue placeholder="House" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Houses</SelectItem>
                  <SelectItem value="heroes">Heroes</SelectItem>
                  <SelectItem value="wisdom">Wisdom</SelectItem>
                  <SelectItem value="power">Power</SelectItem>
                  <SelectItem value="mystery">Mystery</SelectItem>
                  <SelectItem value="elements">Elements</SelectItem>
                  <SelectItem value="time">Time</SelectItem>
                  <SelectItem value="spirit">Spirit</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Controls */}
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-24" data-testid="select-sort-by">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="value">Value</SelectItem>
                  <SelectItem value="grade">Grade</SelectItem>
                  <SelectItem value="rarity">Rarity</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                data-testid="button-sort-order"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>

              {/* View Mode Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                data-testid="button-view-mode"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Asset Grid */}
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}`}>
            {filteredAndSortedAssets.map((asset) => (
              <motion.div
                key={asset.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => onAssetSelect(asset)}
                data-testid={`asset-card-${asset.symbol}`}
              >
                <AssetGradingCard
                  asset={{
                    name: asset.name,
                    symbol: asset.symbol,
                    imageUrl: asset.imageUrl,
                    type: asset.type
                  }}
                  grade={asset.overallGrade}
                  rarity={asset.rarityTier}
                  value={asset.currentMarketValue}
                  certificationNumber={asset.certificationNumber}
                  certificationAuthority={asset.certificationAuthority}
                  isKeyIssue={asset.isKeyIssue}
                  isSigned={asset.isSigned}
                  storageType={asset.storageType}
                  houseAffiliation={asset.houseAffiliation}
                  compact={viewMode === 'list'}
                />
              </motion.div>
            ))}
          </div>

          {filteredAndSortedAssets.length === 0 && (
            <Card className="p-8 text-center">
              <CardContent>
                <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-muted-foreground mb-2">No Assets Found</CardTitle>
                <CardDescription>
                  {searchTerm || filterRarity !== 'all' || filterHouse !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Start building your collection by grading your first asset'}
                </CardDescription>
                <Button 
                  onClick={onCreateBox} 
                  className="mt-4"
                  data-testid="button-grade-first-asset"
                >
                  Grade First Asset
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="boxes" className="space-y-4">
          {/* Storage Boxes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {storageBoxes.map((box) => {
              const StorageIcon = getStorageIcon(box.boxType);
              const fillPercentage = (box.currentCount / box.capacity) * 100;
              
              return (
                <motion.div
                  key={box.id}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => onBoxSelect(box)}
                  data-testid={`storage-box-${box.id}`}
                >
                  <Card className="hover-elevate transition-mystical">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <StorageIcon className="h-4 w-4" />
                        {box.name}
                        <Badge variant="outline" className="ml-auto text-xs">
                          {box.currentCount}/{box.capacity}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-xs">{box.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Fill Progress */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Capacity</span>
                          <span>{fillPercentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${fillPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Box Stats */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="font-semibold text-green-400">
                            ${box.totalValue.toLocaleString()}
                          </div>
                          <div className="text-muted-foreground">Total Value</div>
                        </div>
                        <div>
                          <div className="font-semibold text-blue-400">
                            {box.averageGrade.toFixed(1)}
                          </div>
                          <div className="text-muted-foreground">Avg Grade</div>
                        </div>
                      </div>

                      {/* Condition Badge */}
                      <Badge variant="secondary" className="text-xs w-full justify-center">
                        {box.condition.charAt(0).toUpperCase() + box.condition.slice(1)} Condition
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {/* Create New Box Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={onCreateBox}
              data-testid="button-create-box"
            >
              <Card className="hover-elevate border-dashed border-2 border-muted-foreground/20 h-full flex items-center justify-center min-h-[200px]">
                <CardContent className="text-center">
                  <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <CardTitle className="text-sm text-muted-foreground">Create Storage Box</CardTitle>
                  <CardDescription className="text-xs">Organize your collection</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {storageBoxes.length === 0 && (
            <Card className="p-8 text-center">
              <CardContent>
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-muted-foreground mb-2">No Storage Boxes</CardTitle>
                <CardDescription>
                  Create your first storage box to organize your collection
                </CardDescription>
                <Button 
                  onClick={onCreateBox} 
                  className="mt-4"
                  data-testid="button-create-first-box"
                >
                  Create First Box
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}