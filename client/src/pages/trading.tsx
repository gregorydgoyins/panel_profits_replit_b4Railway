import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity,
  Search, ShoppingCart, Target, BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: string;
  currentPrice: number;
  dayChange: number;
  dayChangePercent: number;
  imageUrl?: string;
  franchiseTags?: string[];
}

interface ComicCover {
  id: number;
  title: string;
  series: string;
  issueNumber: string;
  coverUrl: string;
  estimatedValue: number;
}

export default function TradingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('1');
  const [limitPrice, setLimitPrice] = useState('');

  // Fetch trending assets
  const { data: trendingAssets, isLoading: loadingTrending } = useQuery<Asset[]>({
    queryKey: ['/api/market/overview'],
    select: (data: any) => data.topGainers?.slice(0, 12) || [],
    refetchInterval: 30000
  });

  // Fetch comic covers
  const { data: comicCovers, isLoading: loadingCovers } = useQuery<ComicCover[]>({
    queryKey: ['/api/comic-covers/random'],
    select: (data: any) => data.data || [],
    refetchInterval: 60000
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest('POST', '/api/orders/execute', orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order Placed",
        description: `${side.toUpperCase()} order for ${quantity} shares submitted successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
      setQuantity('1');
      setLimitPrice('');
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePlaceOrder = () => {
    if (!selectedAsset || !user) {
      toast({
        title: "Cannot Place Order",
        description: "Please select an asset and ensure you're logged in.",
        variant: "destructive",
      });
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user.id,
      assetId: selectedAsset.id,
      symbol: selectedAsset.symbol,
      side,
      orderType,
      quantity: qty,
      price: orderType === 'limit' ? parseFloat(limitPrice) : selectedAsset.currentPrice,
    };

    placeOrderMutation.mutate(orderData);
  };

  const filteredAssets = trendingAssets?.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background" data-testid="page-trading">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl " style={{ fontFamily: 'Space Grotesk' }}>
              Comic Trading Floor
            </h1>
            <p className="text-muted-foreground mt-2" style={{ fontFamily: 'Hind', fontWeight: 300 }}>
              Trade comic book assets with real market dynamics
            </p>
          </div>
          <Badge variant="default" className="text-lg px-4 py-2">
            <Activity className="h-4 w-4 mr-2" />
            Market Open
          </Badge>
        </div>

        {/* Featured Comic Covers */}
        <Card data-testid="card-featured-covers">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Space Grotesk' }}>
              <BookOpen className="inline h-5 w-5 mr-2" />
              Featured Comics
            </CardTitle>
            <CardDescription style={{ fontFamily: 'Hind', fontWeight: 300 }}>
              Explore tradeable comic book assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCovers ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-md" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {comicCovers?.slice(0, 6).map((comic) => (
                  <div
                    key={comic.id}
                    className="group cursor-pointer hover-elevate active-elevate-2 rounded-md overflow-hidden"
                    data-testid={`comic-cover-${comic.id}`}
                  >
                    <div className="aspect-[2/3] relative">
                      <img
                        src={comic.coverUrl}
                        alt={comic.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-xs text-white  truncate" style={{ fontFamily: 'Hind', fontWeight: 300 }}>
                          {comic.title}
                        </p>
                        <p className="text-xs text-white/70" style={{ fontFamily: 'Hind', fontWeight: 300 }}>
                          ${comic.estimatedValue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trading Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search & Filter */}
            <Card data-testid="card-asset-search">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Space Grotesk' }}>
                  <Search className="inline h-5 w-5 mr-2" />
                  Search Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="text"
                  placeholder="Search by name or symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                  data-testid="input-asset-search"
                  style={{ fontFamily: 'Hind', fontWeight: 300 }}
                />
              </CardContent>
            </Card>

            {/* Asset List */}
            <Card data-testid="card-asset-list">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Space Grotesk' }}>
                  <TrendingUp className="inline h-5 w-5 mr-2" />
                  Trending Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingTrending ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {filteredAssets?.map((asset) => (
                      <div
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        className={`p-4 rounded-md cursor-pointer hover-elevate active-elevate-2 border ${
                          selectedAsset?.id === asset.id ? 'border-primary bg-accent' : 'border-border'
                        }`}
                        data-testid={`asset-item-${asset.symbol}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {asset.imageUrl && (
                              <img
                                src={asset.imageUrl}
                                alt={asset.name}
                                className="w-12 h-12 object-cover rounded-md"
                              />
                            )}
                            <div>
                              <p className="" style={{ fontFamily: 'Space Grotesk' }}>
                                {asset.symbol}
                              </p>
                              <p className="text-sm text-muted-foreground truncate max-w-[200px]" style={{ fontFamily: 'Hind', fontWeight: 300 }}>
                                {asset.name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="" style={{ fontFamily: 'Space Grotesk' }}>
                              ${asset.currentPrice.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-1">
                              {asset.dayChangePercent >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                              <span
                                className={asset.dayChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}
                                style={{ fontFamily: 'Space Grotesk', fontSize: '0.875rem' }}
                              >
                                {asset.dayChangePercent >= 0 ? '+' : ''}
                                {asset.dayChangePercent.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Entry Panel */}
          <div>
            <Card data-testid="card-order-entry">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Space Grotesk' }}>
                  <ShoppingCart className="inline h-5 w-5 mr-2" />
                  Place Order
                </CardTitle>
                <CardDescription style={{ fontFamily: 'Hind', fontWeight: 300 }}>
                  {selectedAsset ? `Trading ${selectedAsset.symbol}` : 'Select an asset to trade'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedAsset && (
                  <>
                    {/* Selected Asset Info */}
                    <div className="p-4 bg-accent rounded-md">
                      <div className="flex items-center gap-3 mb-2">
                        {selectedAsset.imageUrl && (
                          <img
                            src={selectedAsset.imageUrl}
                            alt={selectedAsset.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <p className=" text-lg" style={{ fontFamily: 'Space Grotesk' }}>
                            {selectedAsset.symbol}
                          </p>
                          <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Hind', fontWeight: 300 }}>
                            {selectedAsset.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ fontFamily: 'Hind', fontWeight: 300 }}>Current Price:</span>
                        <span className=" text-xl" style={{ fontFamily: 'Space Grotesk' }}>
                          ${selectedAsset.currentPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Order Type */}
                    <Tabs value={side} onValueChange={(v) => setSide(v as 'buy' | 'sell')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="buy" data-testid="tab-buy" style={{ fontFamily: 'Space Grotesk' }}>
                          Buy
                        </TabsTrigger>
                        <TabsTrigger value="sell" data-testid="tab-sell" style={{ fontFamily: 'Space Grotesk' }}>
                          Sell
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    {/* Order Type Selection */}
                    <div className="space-y-2">
                      <Label style={{ fontFamily: 'Hind', fontWeight: 300 }}>Order Type</Label>
                      <Select value={orderType} onValueChange={(v) => setOrderType(v as 'market' | 'limit')}>
                        <SelectTrigger data-testid="select-order-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market Order</SelectItem>
                          <SelectItem value="limit">Limit Order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                      <Label htmlFor="quantity" style={{ fontFamily: 'Hind', fontWeight: 300 }}>
                        Quantity
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        data-testid="input-quantity"
                        style={{ fontFamily: 'Hind', fontWeight: 300 }}
                      />
                    </div>

                    {/* Limit Price (if limit order) */}
                    {orderType === 'limit' && (
                      <div className="space-y-2">
                        <Label htmlFor="limitPrice" style={{ fontFamily: 'Hind', fontWeight: 300 }}>
                          Limit Price
                        </Label>
                        <Input
                          id="limitPrice"
                          type="number"
                          step="0.01"
                          value={limitPrice}
                          onChange={(e) => setLimitPrice(e.target.value)}
                          placeholder={selectedAsset.currentPrice.toFixed(2)}
                          data-testid="input-limit-price"
                          style={{ fontFamily: 'Hind', fontWeight: 300 }}
                        />
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="p-4 bg-muted rounded-md space-y-2">
                      <div className="flex justify-between">
                        <span style={{ fontFamily: 'Hind', fontWeight: 300 }}>Estimated Total:</span>
                        <span className="" style={{ fontFamily: 'Space Grotesk' }}>
                          ${(
                            (orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : selectedAsset.currentPrice) *
                            parseInt(quantity || '0')
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={placeOrderMutation.isPending || !quantity}
                      className="w-full"
                      variant={side === 'buy' ? 'default' : 'destructive'}
                      data-testid="button-place-order"
                      style={{ fontFamily: 'Space Grotesk' }}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      {placeOrderMutation.isPending
                        ? 'Placing Order...'
                        : `${side === 'buy' ? 'Buy' : 'Sell'} ${quantity} Shares`}
                    </Button>
                  </>
                )}

                {!selectedAsset && (
                  <div className="text-center py-8 text-muted-foreground" style={{ fontFamily: 'Hind', fontWeight: 300 }}>
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select an asset from the list to start trading</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
