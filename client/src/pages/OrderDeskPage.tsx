import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, DollarSign, TrendingUp, ShoppingCart, Info } from 'lucide-react';
import { Link } from 'wouter';
import { useState } from 'react';

interface OrderDeskAsset {
  id: number;
  title: string;
  series: string;
  issueNumber: number;
  coverUrl: string;
  currentPrice: number;
  estimatedValue: number;
  printPrice: number;
  symbol: string;
}

export default function OrderDeskPage() {
  const params = useParams();
  const assetId = params.assetId;

  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [orderAction, setOrderAction] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState<string>('1');
  const [limitPrice, setLimitPrice] = useState<string>('');

  const { data, isLoading, error } = useQuery<{ success: boolean; data: OrderDeskAsset }>({
    queryKey: ['/api/comic-covers/order-desk', assetId],
    enabled: !!assetId,
  });

  const asset = data?.data;

  const calculateTotal = () => {
    if (!asset) return 0;
    const qty = parseInt(quantity) || 0;
    const price = orderType === 'limit' ? (parseFloat(limitPrice) || 0) : asset.currentPrice;
    return qty * price;
  };

  const handlePlaceOrder = () => {
    // TODO: Implement order placement logic
    console.log('Placing order:', {
      assetId,
      orderType,
      orderAction,
      quantity: parseInt(quantity),
      price: orderType === 'limit' ? parseFloat(limitPrice) : asset?.currentPrice,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen !bg-[#1A1F2E] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-muted rounded animate-pulse w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="h-8 bg-muted rounded animate-pulse w-64" />
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardContent className="pt-6">
                  <div className="h-96 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen !bg-[#1A1F2E] p-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" data-testid="link-back-home">
            <Button variant="ghost" className="mb-6" data-testid="button-back-to-dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Asset not found. Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const priceChange = asset.currentPrice - asset.printPrice;
  const priceChangePercent = (priceChange / asset.printPrice) * 100;

  return (
    <div className="min-h-screen !bg-[#1A1F2E] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <Link href="/" data-testid="link-back-home">
          <Button variant="ghost" className="mb-6" data-testid="button-back-to-dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Asset Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Asset Header */}
            <Card className="!bg-[#1A1F2E]">
              <CardHeader>
                <div className="flex items-start gap-6">
                  {/* Cover Image */}
                  {asset.coverUrl && (
                    <img
                      src={asset.coverUrl}
                      alt={asset.title}
                      className="w-32 aspect-[2/3] object-cover rounded-lg border-2 border-border"
                      data-testid="img-order-desk-cover"
                    />
                  )}
                  
                  {/* Asset Details */}
                  <div className="flex-1">
                    <Badge className="mb-2">{asset.symbol}</Badge>
                    <CardTitle className="text-3xl  mb-2">{asset.title}</CardTitle>
                    <p className="text-lg text-muted-foreground mb-4">
                      {asset.series} #{asset.issueNumber}
                    </p>

                    {/* Price Info */}
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="text-3xl  text-foreground">
                          ${asset.currentPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className={priceChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm ">
                            {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
                          </span>
                        </div>
                        <p className="text-sm">
                          {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Trading Forms Info */}
            <Card className="!bg-[#1A1F2E]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Trading Forms Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className=" text-foreground mb-1">Standard Shares</h3>
                    <p className="text-sm text-muted-foreground">
                      Direct ownership of comic asset shares. Trade instantly at market price.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className=" text-foreground mb-1">Fractional Shares</h3>
                    <p className="text-sm text-muted-foreground">
                      Own portions of high-value issues. Perfect for building diverse portfolios.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className=" text-foreground mb-1">Options Contracts</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced trading with calls and puts. Leverage your position with limited risk.
                    </p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className=" text-foreground mb-1">Comic Bonds</h3>
                    <p className="text-sm text-muted-foreground">
                      Fixed-income instruments backed by comic assets. Stable returns with predictable yields.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Stats */}
            <Card className="!bg-[#1A1F2E]">
              <CardHeader>
                <CardTitle>Market Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Print Price</p>
                    <p className="text-xl  text-foreground">${asset.printPrice.toFixed(2)}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Estimated Value</p>
                    <p className="text-xl  text-green-500">
                      ${asset.estimatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Daily Volume</p>
                    <p className="text-xl  text-foreground">1,247</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Form */}
          <div className="lg:col-span-1">
            <Card className="!bg-[#1A1F2E] sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Place Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Buy/Sell Toggle */}
                <div>
                  <Label className="mb-3 block">Action</Label>
                  <RadioGroup value={orderAction} onValueChange={(value) => setOrderAction(value as 'buy' | 'sell')}>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buy" id="buy" data-testid="radio-buy" />
                        <Label htmlFor="buy" className="cursor-pointer">Buy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sell" id="sell" data-testid="radio-sell" />
                        <Label htmlFor="sell" className="cursor-pointer">Sell</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Order Type */}
                <div>
                  <Label className="mb-3 block">Order Type</Label>
                  <RadioGroup value={orderType} onValueChange={(value) => setOrderType(value as 'market' | 'limit')}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="market" id="market" data-testid="radio-market" />
                        <Label htmlFor="market" className="cursor-pointer">
                          Market Order <span className="text-xs text-muted-foreground">(Instant)</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="limit" id="limit" data-testid="radio-limit" />
                        <Label htmlFor="limit" className="cursor-pointer">
                          Limit Order <span className="text-xs text-muted-foreground">(Set Price)</span>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Quantity */}
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-2"
                    data-testid="input-quantity"
                  />
                </div>

                {/* Limit Price (conditional) */}
                {orderType === 'limit' && (
                  <div>
                    <Label htmlFor="limitPrice">Limit Price ($)</Label>
                    <Input
                      id="limitPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(e.target.value)}
                      placeholder={asset.currentPrice.toFixed(2)}
                      className="mt-2"
                      data-testid="input-limit-price"
                    />
                  </div>
                )}

                {/* Order Summary */}
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shares</span>
                    <span className="text-foreground ">{quantity || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per Share</span>
                    <span className="text-foreground ">
                      ${orderType === 'limit' ? (limitPrice || '0.00') : asset.currentPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg  border-t border-border pt-3">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  size="lg"
                  onClick={handlePlaceOrder}
                  data-testid="button-place-order"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Place {orderAction === 'buy' ? 'Buy' : 'Sell'} Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
