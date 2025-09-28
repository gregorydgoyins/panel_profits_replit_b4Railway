import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, TrendingDown, Calculator, DollarSign, 
  AlertTriangle, Target, Clock, Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';

const orderFormSchema = z.object({
  orderType: z.enum(['market', 'limit', 'stop', 'stop_limit']),
  side: z.enum(['buy', 'sell']),
  quantity: z.string().min(1, 'Quantity is required').refine(
    (val) => parseFloat(val) > 0,
    'Quantity must be greater than 0'
  ),
  price: z.string().optional(),
  stopPrice: z.string().optional(),
  timeInForce: z.enum(['DAY', 'GTC', 'IOC', 'FOK']),
}).refine((data) => {
  if ((data.orderType === 'limit' || data.orderType === 'stop_limit') && (!data.price || data.price.trim() === '')) {
    return false;
  }
  if ((data.orderType === 'stop' || data.orderType === 'stop_limit') && (!data.stopPrice || data.stopPrice.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: 'Price fields are required for limit and stop orders',
  path: ['price']
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface ProfessionalOrderEntryProps {
  selectedAsset: string;
  onOrderPlaced?: (orderId: string) => void;
}

export function ProfessionalOrderEntry({ selectedAsset, onOrderPlaced }: ProfessionalOrderEntryProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [previewOrder, setPreviewOrder] = useState(false);
  const [quickOrderPercent, setQuickOrderPercent] = useState(25); // 25% of available balance

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      orderType: 'market',
      side: 'buy',
      quantity: '',
      price: '',
      stopPrice: '',
      timeInForce: 'DAY',
    },
  });

  const watchedValues = form.watch();

  // Fetch user data for balance and limits
  const { data: userData } = useQuery({
    queryKey: '/api/auth/user',
    enabled: !!user,
  });

  // Fetch current asset price
  const { data: assetPrice } = useQuery({
    queryKey: ['/api/market/prices', selectedAsset],
    queryFn: () => fetch(`/api/market/prices?assetIds=${selectedAsset}`).then(res => res.json()),
    enabled: !!selectedAsset,
    refetchInterval: 2000,
  });

  // Fetch user portfolios
  const { data: userPortfolios } = useQuery({
    queryKey: `/api/portfolios/user/${user?.id}`,
    enabled: !!user?.id,
  });

  // Calculate order details and risk metrics
  const orderCalculations = useMemo(() => {
    const quantity = parseFloat(watchedValues.quantity || '0');
    const isMarket = watchedValues.orderType === 'market';
    
    let executionPrice = 0;
    if (isMarket && assetPrice?.data?.[0]) {
      executionPrice = parseFloat(assetPrice.data[0].currentPrice || '0');
    } else if (watchedValues.price) {
      executionPrice = parseFloat(watchedValues.price);
    }

    const totalValue = quantity * executionPrice;
    const commission = totalValue * 0.001; // 0.1% commission
    const totalCost = totalValue + commission;
    
    const availableBalance = parseFloat(userData?.virtualTradingBalance || '0');
    const dailyLimit = parseFloat(userData?.dailyTradingLimit || '0');
    const dailyUsed = parseFloat(userData?.dailyTradingUsed || '0');
    const maxPositionSize = parseFloat(userData?.maxPositionSize || '0');

    const canAfford = watchedValues.side === 'buy' ? availableBalance >= totalCost : true;
    const withinDailyLimit = (dailyUsed + totalValue) <= dailyLimit;
    const withinPositionLimit = totalValue <= maxPositionSize;

    // Risk calculations
    const portfolioValue = userPortfolios?.[0]?.totalValue ? parseFloat(userPortfolios[0].totalValue) : availableBalance;
    const positionRisk = portfolioValue > 0 ? (totalValue / portfolioValue) * 100 : 0;
    
    // Estimated slippage for market orders
    const estimatedSlippage = isMarket ? totalValue * 0.001 : 0; // 0.1% slippage estimate

    return {
      executionPrice,
      totalValue,
      commission,
      totalCost,
      canAfford,
      withinDailyLimit,
      withinPositionLimit,
      positionRisk,
      estimatedSlippage,
      availableBalance,
      dailyRemaining: dailyLimit - dailyUsed,
    };
  }, [watchedValues, assetPrice, userData, userPortfolios]);

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: OrderFormData) => {
      const portfolio = userPortfolios?.[0];
      if (!portfolio) throw new Error('No portfolio found');

      const submitData = {
        portfolioId: portfolio.id,
        assetId: selectedAsset,
        type: orderData.side,
        orderType: orderData.orderType,
        quantity: orderData.quantity,
        price: orderData.price || undefined,
        stopPrice: orderData.stopPrice || undefined,
        timeInForce: orderData.timeInForce,
      };

      return apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify(submitData),
      });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      queryClient.invalidateQueries({ queryKey: [`/api/portfolios`] });
      
      form.reset();
      setPreviewOrder(false);
      
      if (onOrderPlaced && response.id) {
        onOrderPlaced(response.id);
      }
      
      toast({
        title: 'Order Placed Successfully',
        description: `${watchedValues.side.toUpperCase()} order for ${watchedValues.quantity} shares submitted`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Order Failed',
        description: error.message || 'Failed to place order',
        variant: 'destructive',
      });
    },
  });

  // Quick order calculations
  const getQuickOrderQuantity = (percent: number) => {
    if (watchedValues.side === 'sell') return 0; // For sell orders, would need holdings data
    
    const availableAmount = orderCalculations.availableBalance * (percent / 100);
    const currentPrice = orderCalculations.executionPrice;
    
    if (currentPrice > 0) {
      return Math.floor(availableAmount / currentPrice);
    }
    return 0;
  };

  const handleQuickOrder = (percent: number) => {
    const quantity = getQuickOrderQuantity(percent);
    if (quantity > 0) {
      form.setValue('quantity', quantity.toString());
    }
  };

  const currentPrice = assetPrice?.data?.[0] ? parseFloat(assetPrice.data[0].currentPrice) : 0;
  const priceChange = assetPrice?.data?.[0] ? parseFloat(assetPrice.data[0].dayChangePercent || '0') : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const onSubmit = (data: OrderFormData) => {
    setPreviewOrder(true);
  };

  const confirmOrder = () => {
    placeOrderMutation.mutate(form.getValues());
  };

  if (previewOrder) {
    return (
      <div className="space-y-4" data-testid="order-preview">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Confirm Order</h3>
          <div className={`text-2xl font-bold ${
            watchedValues.side === 'buy' ? 'text-emerald-500' : 'text-red-500'
          }`}>
            {watchedValues.side.toUpperCase()} {watchedValues.quantity} Shares
          </div>
          <div className="text-sm text-muted-foreground">
            {watchedValues.orderType.toUpperCase()} Order
          </div>
        </div>

        <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
          <div className="flex justify-between">
            <span>Execution Price:</span>
            <span className="font-medium">{formatCurrency(orderCalculations.executionPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Value:</span>
            <span className="font-medium">{formatCurrency(orderCalculations.totalValue)}</span>
          </div>
          <div className="flex justify-between">
            <span>Commission:</span>
            <span className="font-medium">{formatCurrency(orderCalculations.commission)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-semibold">Total Cost:</span>
            <span className="font-semibold">{formatCurrency(orderCalculations.totalCost)}</span>
          </div>
        </div>

        {/* Risk Warnings */}
        <div className="space-y-2">
          {orderCalculations.positionRisk > 10 && (
            <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">High position risk: {orderCalculations.positionRisk.toFixed(1)}% of portfolio</span>
            </div>
          )}
          
          {!orderCalculations.withinDailyLimit && (
            <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm">Exceeds daily trading limit</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewOrder(false)}
            className="flex-1"
            data-testid="button-cancel-order"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmOrder}
            disabled={placeOrderMutation.isPending || !orderCalculations.canAfford}
            className={`flex-1 ${
              watchedValues.side === 'buy' 
                ? 'bg-emerald-500 hover:bg-emerald-600' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
            data-testid="button-confirm-order"
          >
            {placeOrderMutation.isPending ? 'Placing...' : 'Confirm Order'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="professional-order-entry">
      <Tabs value={watchedValues.side} onValueChange={(value) => form.setValue('side', value as 'buy' | 'sell')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy" className="text-emerald-500 data-[state=active]:bg-emerald-500/20" data-testid="tab-buy">
            <TrendingUp className="h-4 w-4 mr-1" />
            BUY
          </TabsTrigger>
          <TabsTrigger value="sell" className="text-red-500 data-[state=active]:bg-red-500/20" data-testid="tab-sell">
            <TrendingDown className="h-4 w-4 mr-1" />
            SELL
          </TabsTrigger>
        </TabsList>

        <TabsContent value={watchedValues.side} className="space-y-4">
          {/* Current Price Display */}
          {currentPrice > 0 && (
            <div className="p-2 bg-muted/30 rounded text-center">
              <div className="text-lg font-bold">{formatCurrency(currentPrice)}</div>
              <div className={`text-sm ${priceChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}% today
              </div>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Order Type */}
            <div>
              <Label>Order Type</Label>
              <Select value={watchedValues.orderType} onValueChange={(value) => form.setValue('orderType', value as any)}>
                <SelectTrigger data-testid="select-order-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                  <SelectItem value="stop">Stop Order</SelectItem>
                  <SelectItem value="stop_limit">Stop-Limit Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                step="1"
                min="1"
                {...form.register('quantity')}
                placeholder="Number of shares"
                data-testid="input-quantity"
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-red-500">{form.formState.errors.quantity.message}</p>
              )}
            </div>

            {/* Quick Order Buttons */}
            {watchedValues.side === 'buy' && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Quick Order (% of balance)</Label>
                <div className="grid grid-cols-4 gap-1">
                  {[10, 25, 50, 100].map((percent) => (
                    <Button
                      key={percent}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickOrder(percent)}
                      data-testid={`button-quick-order-${percent}`}
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Fields */}
            {(watchedValues.orderType === 'limit' || watchedValues.orderType === 'stop_limit') && (
              <div>
                <Label>Limit Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...form.register('price')}
                  placeholder="Price per share"
                  data-testid="input-limit-price"
                />
              </div>
            )}

            {(watchedValues.orderType === 'stop' || watchedValues.orderType === 'stop_limit') && (
              <div>
                <Label>Stop Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...form.register('stopPrice')}
                  placeholder="Stop trigger price"
                  data-testid="input-stop-price"
                />
              </div>
            )}

            {/* Time in Force */}
            <div>
              <Label>Time in Force</Label>
              <Select value={watchedValues.timeInForce} onValueChange={(value) => form.setValue('timeInForce', value as any)}>
                <SelectTrigger data-testid="select-time-in-force">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAY">Day Order</SelectItem>
                  <SelectItem value="GTC">Good Till Cancelled</SelectItem>
                  <SelectItem value="IOC">Immediate or Cancel</SelectItem>
                  <SelectItem value="FOK">Fill or Kill</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order Summary */}
            {orderCalculations.totalValue > 0 && (
              <div className="space-y-2 p-3 bg-muted/20 rounded-lg text-sm">
                <div className="flex justify-between">
                  <span>Estimated Value:</span>
                  <span>{formatCurrency(orderCalculations.totalValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Commission:</span>
                  <span>{formatCurrency(orderCalculations.commission)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total Cost:</span>
                  <span>{formatCurrency(orderCalculations.totalCost)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Position Risk:</span>
                  <span>{orderCalculations.positionRisk.toFixed(1)}%</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className={`w-full ${
                watchedValues.side === 'buy' 
                  ? 'bg-emerald-500 hover:bg-emerald-600' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              disabled={!orderCalculations.canAfford || !orderCalculations.withinDailyLimit || !orderCalculations.withinPositionLimit}
              data-testid="button-place-order"
            >
              <Zap className="h-4 w-4 mr-2" />
              Preview {watchedValues.side.toUpperCase()} Order
            </Button>
          </form>

          {/* Balance Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Available: {formatCurrency(orderCalculations.availableBalance)}</div>
            <div>Daily Limit Remaining: {formatCurrency(orderCalculations.dailyRemaining)}</div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}