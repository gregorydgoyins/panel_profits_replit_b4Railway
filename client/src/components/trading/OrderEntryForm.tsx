import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, Calculator, Clock, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';

// Order form validation schema with conditional validation for limit orders
const orderFormSchema = z.object({
  assetId: z.string().min(1, 'Please select an asset'),
  type: z.enum(['buy', 'sell']),
  orderType: z.enum(['market', 'limit']),
  quantity: z.string().min(1, 'Quantity is required').refine(
    (val) => parseFloat(val) > 0,
    'Quantity must be greater than 0'
  ),
  limitPrice: z.string().optional(),
}).refine((data) => {
  if (data.orderType === 'limit' && (!data.limitPrice || data.limitPrice.trim() === '')) {
    return false;
  }
  if (data.orderType === 'limit' && data.limitPrice && parseFloat(data.limitPrice) <= 0) {
    return false;
  }
  return true;
}, {
  message: 'Limit price is required for limit orders and must be greater than 0',
  path: ['limitPrice']
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: string;
  imageUrl?: string;
  metadata?: any;
}

interface AssetPrice {
  assetId: string;
  currentPrice: string;
  bidPrice?: string;
  askPrice?: string;
  dayChange?: string;
  dayChangePercent?: string;
  volume?: number;
  marketStatus: string;
  lastTradeTime?: string;
}

interface OrderEntryFormProps {
  initialAsset?: Asset;
  initialType?: 'buy' | 'sell';
  onOrderPlaced?: (orderId: string) => void;
}

export function OrderEntryForm({ initialAsset, initialType = 'buy', onOrderPlaced }: OrderEntryFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(initialAsset || null);
  const [showPreview, setShowPreview] = useState(false);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      type: initialType,
      orderType: 'market',
      quantity: '',
      limitPrice: '',
      assetId: initialAsset?.id || '',
    },
  });

  const watchedValues = form.watch();

  // Fetch available assets for trading
  const { data: assets, isLoading: assetsLoading } = useQuery({
    queryKey: ['/api/assets', 'character,comic,creator,publisher'],
    queryFn: () => fetch('/api/assets?type=character,comic,creator,publisher').then(res => res.json()),
  });

  // Fetch user's portfolios and holdings
  const { data: userPortfolios } = useQuery({
    queryKey: `/api/portfolios/user/${user?.id}`,
    enabled: !!user?.id,
  });

  // Fetch user data for balance and limits
  const { data: userData } = useQuery({
    queryKey: '/api/auth/user',
    enabled: !!user,
  });

  // Get current price for selected asset
  const { data: assetPrice, isLoading: priceLoading } = useQuery({
    queryKey: ['/api/market/prices', selectedAsset?.id],
    queryFn: () => fetch(`/api/market/prices?assetIds=${selectedAsset?.id}`).then(res => res.json()),
    enabled: !!selectedAsset?.id,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Get asset holdings for sell orders
  const { data: holdings } = useQuery({
    queryKey: `/api/portfolios/${userPortfolios?.[0]?.id}/holdings`,
    enabled: !!userPortfolios?.[0]?.id && watchedValues.type === 'sell',
  });

  // Calculate order details
  const orderCalculations = useMemo(() => {
    const quantity = parseFloat(watchedValues.quantity || '0');
    const isMarket = watchedValues.orderType === 'market';
    
    let price = 0;
    if (isMarket && assetPrice?.data && Array.isArray(assetPrice.data) && assetPrice.data[0]) {
      price = parseFloat(assetPrice.data[0].currentPrice || '0');
    } else if (!isMarket && watchedValues.limitPrice) {
      price = parseFloat(watchedValues.limitPrice);
    }

    const totalValue = quantity * price;
    const estimatedFees = totalValue * 0.001; // 0.1% commission
    const totalCost = totalValue + estimatedFees;

    return {
      price,
      totalValue,
      estimatedFees,
      totalCost,
      canAfford: watchedValues.type === 'buy' 
        ? parseFloat(userData?.virtualTradingBalance || '0') >= totalCost
        : true,
    };
  }, [watchedValues, assetPrice, userData]);

  // Get available quantity for sell orders
  const availableQuantity = useMemo(() => {
    if (watchedValues.type !== 'sell' || !selectedAsset || !holdings || !Array.isArray(holdings)) return 0;
    
    const holding = holdings.find((h: any) => h.assetId === selectedAsset.id);
    return holding ? parseFloat(holding.quantity || '0') : 0;
  }, [watchedValues.type, selectedAsset, holdings]);

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: OrderFormData) => {
      const portfolio = userPortfolios?.[0];
      if (!portfolio) throw new Error('No portfolio found');

      const submitData = {
        portfolioId: portfolio.id,
        assetId: orderData.assetId,
        type: orderData.type,
        orderType: orderData.orderType,
        quantity: orderData.quantity,
        price: orderData.orderType === 'limit' ? orderData.limitPrice : undefined,
      };

      const response = await fetch('/api/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (response) => {
      toast({
        title: 'Order Placed Successfully',
        description: `${watchedValues.type.toUpperCase()} order for ${selectedAsset?.symbol} has been placed`,
      });
      
      // Invalidate relevant queries with correct string keys
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: `/api/orders/user/${user.id}` });
        queryClient.invalidateQueries({ queryKey: `/api/portfolios/user/${user.id}` });
        if (userPortfolios?.[0]?.id) {
          queryClient.invalidateQueries({ queryKey: `/api/portfolios/${userPortfolios[0].id}/holdings` });
        }
      }
      queryClient.invalidateQueries({ queryKey: '/api/auth/user' }); // For balance updates
      
      form.reset();
      setShowPreview(false);
      
      if (onOrderPlaced && response?.data?.orderId) {
        onOrderPlaced(response.data.orderId);
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Order Failed',
        description: error.message || 'Failed to place order',
        variant: 'destructive',
      });
    },
  });

  // Handle asset selection
  const handleAssetSelect = (assetId: string) => {
    const asset = assets?.find((a: Asset) => a.id === assetId);
    if (asset) {
      setSelectedAsset(asset);
      form.setValue('assetId', assetId);
    }
  };

  // Handle form submission
  const onSubmit = (data: OrderFormData) => {
    setShowPreview(true);
  };

  // Confirm and place order
  const confirmOrder = () => {
    const formData = form.getValues();
    placeOrderMutation.mutate(formData);
  };

  const currentPrice = assetPrice?.data && Array.isArray(assetPrice.data) ? assetPrice.data[0] : null;
  const isMarketOpen = currentPrice?.marketStatus === 'open';

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Order Entry
          <Badge variant={watchedValues.type === 'buy' ? 'default' : 'secondary'}>
            {watchedValues.type?.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showPreview ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Order Type Tabs */}
            <Tabs 
              value={watchedValues.type} 
              onValueChange={(value) => form.setValue('type', value as 'buy' | 'sell')}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy" data-testid="tab-buy">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Buy
                </TabsTrigger>
                <TabsTrigger value="sell" data-testid="tab-sell">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Sell
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Asset Selection */}
            <div className="space-y-2">
              <Label htmlFor="asset-select">Asset</Label>
              <Select 
                value={watchedValues.assetId} 
                onValueChange={handleAssetSelect}
                disabled={assetsLoading}
              >
                <SelectTrigger data-testid="select-asset">
                  <SelectValue placeholder="Select an asset to trade" />
                </SelectTrigger>
                <SelectContent>
                  {assets && Array.isArray(assets) ? assets.map((asset: Asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{asset.symbol}</span>
                        <span className="text-muted-foreground">{asset.name}</span>
                      </div>
                    </SelectItem>
                  )) : null}
                </SelectContent>
              </Select>
              {form.formState.errors.assetId && (
                <p className="text-sm text-destructive">{form.formState.errors.assetId.message}</p>
              )}
            </div>

            {/* Current Price Display */}
            {selectedAsset && currentPrice && (
              <Card className="p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="text-xl font-bold">${parseFloat(currentPrice.currentPrice).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {currentPrice.dayChange && (
                        <Badge variant={parseFloat(currentPrice.dayChange) >= 0 ? 'default' : 'destructive'}>
                          {parseFloat(currentPrice.dayChange) >= 0 ? '+' : ''}
                          ${parseFloat(currentPrice.dayChange).toFixed(2)}
                          ({parseFloat(currentPrice.dayChangePercent || '0').toFixed(2)}%)
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      <Badge variant={isMarketOpen ? 'default' : 'secondary'}>
                        {isMarketOpen ? 'Market Open' : 'Market Closed'}
                      </Badge>
                    </div>
                  </div>
                </div>
                {currentPrice.bidPrice && currentPrice.askPrice && (
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>Bid: ${parseFloat(currentPrice.bidPrice).toFixed(2)}</span>
                    <span>Ask: ${parseFloat(currentPrice.askPrice).toFixed(2)}</span>
                  </div>
                )}
              </Card>
            )}

            {/* Order Type Selection */}
            <div className="space-y-2">
              <Label>Order Type</Label>
              <Tabs 
                value={watchedValues.orderType} 
                onValueChange={(value) => form.setValue('orderType', value as 'market' | 'limit')}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="market" data-testid="tab-market">Market Order</TabsTrigger>
                  <TabsTrigger value="limit" data-testid="tab-limit">Limit Order</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Limit Price (if limit order) */}
            {watchedValues.orderType === 'limit' && (
              <div className="space-y-2">
                <Label htmlFor="limit-price">Limit Price ($) *</Label>
                <Input
                  id="limit-price"
                  type="number"
                  step="0.01"
                  placeholder="Enter limit price"
                  required={watchedValues.orderType === 'limit'}
                  {...form.register('limitPrice')}
                  data-testid="input-limit-price"
                />
                {form.formState.errors.limitPrice && (
                  <p className="text-sm text-destructive">{form.formState.errors.limitPrice.message}</p>
                )}
              </div>
            )}

            {/* Quantity Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="quantity">Quantity</Label>
                {watchedValues.type === 'sell' && selectedAsset && (
                  <span className="text-sm text-muted-foreground">
                    Available: {availableQuantity}
                  </span>
                )}
              </div>
              <Input
                id="quantity"
                type="number"
                step="0.0001"
                placeholder="0"
                {...form.register('quantity')}
                data-testid="input-quantity"
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-destructive">{form.formState.errors.quantity.message}</p>
              )}
              {watchedValues.type === 'sell' && parseFloat(watchedValues.quantity || '0') > availableQuantity && (
                <p className="text-sm text-destructive">
                  Insufficient shares. Available: {availableQuantity}
                </p>
              )}
            </div>

            {/* Order Summary */}
            {orderCalculations.price > 0 && parseFloat(watchedValues.quantity || '0') > 0 && (
              <Card className="p-4 bg-accent/50">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-4 w-4" />
                  <span className="font-medium">Order Summary</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Price per share:</span>
                    <span>${orderCalculations.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{parseFloat(watchedValues.quantity || '0')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${orderCalculations.totalValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated fees:</span>
                    <span>${orderCalculations.estimatedFees.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total {watchedValues.type === 'buy' ? 'Cost' : 'Proceeds'}:</span>
                    <span>${orderCalculations.totalCost.toFixed(2)}</span>
                  </div>
                </div>
                
                {watchedValues.type === 'buy' && !orderCalculations.canAfford && (
                  <div className="flex items-center gap-2 mt-3 p-2 bg-destructive/10 rounded">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">
                      Insufficient balance. Available: ${parseFloat(userData?.virtualTradingBalance || '0').toFixed(2)}
                    </span>
                  </div>
                )}
              </Card>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={
                !selectedAsset || 
                !isMarketOpen ||
                !orderCalculations.canAfford ||
                (watchedValues.type === 'sell' && parseFloat(watchedValues.quantity || '0') > availableQuantity) ||
                parseFloat(watchedValues.quantity || '0') <= 0 ||
                (watchedValues.orderType === 'limit' && (!watchedValues.limitPrice || parseFloat(watchedValues.limitPrice) <= 0))
              }
              data-testid="button-preview-order"
            >
              Preview Order
            </Button>
          </form>
        ) : (
          // Order Preview
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Order Preview</h3>
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(false)}
                data-testid="button-edit-order"
              >
                Edit Order
              </Button>
            </div>
            
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Asset:</span>
                  <span>{selectedAsset?.symbol} - {selectedAsset?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Order Type:</span>
                  <span className="capitalize">{watchedValues.type} {watchedValues.orderType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Quantity:</span>
                  <span>{parseFloat(watchedValues.quantity || '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Price:</span>
                  <span>${orderCalculations.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Estimated Fees:</span>
                  <span>${orderCalculations.estimatedFees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total {watchedValues.type === 'buy' ? 'Cost' : 'Proceeds'}:</span>
                  <span>${orderCalculations.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(false)}
                className="flex-1"
                data-testid="button-cancel-order"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmOrder}
                disabled={placeOrderMutation.isPending}
                className="flex-1"
                data-testid="button-place-order"
              >
                {placeOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}