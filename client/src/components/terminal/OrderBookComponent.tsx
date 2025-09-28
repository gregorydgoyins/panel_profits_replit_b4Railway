import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, TrendingDown, MousePointer } from 'lucide-react';

interface OrderBookProps {
  symbol: string;
  refreshTrigger?: number;
}

interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
  side: 'bid' | 'ask';
}

export function OrderBookComponent({ symbol, refreshTrigger = 0 }: OrderBookProps) {
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  // Fetch current asset price for spread calculation
  const { data: assetPrice, isLoading: priceLoading } = useQuery({
    queryKey: ['/api/market/prices', symbol, refreshTrigger],
    queryFn: () => fetch(`/api/market/prices?assetIds=${symbol}`).then(res => res.json()),
    enabled: !!symbol,
    refetchInterval: 2000, // Update every 2 seconds for order book
  });

  // Generate simulated order book data
  // In a real implementation, this would come from an API endpoint
  const generateOrderBookData = (): { bids: OrderBookEntry[], asks: OrderBookEntry[] } => {
    if (!assetPrice?.data?.[0]) return { bids: [], asks: [] };
    
    const currentPrice = parseFloat(assetPrice.data[0].currentPrice);
    const spread = currentPrice * 0.002; // 0.2% spread
    
    const bids: OrderBookEntry[] = [];
    const asks: OrderBookEntry[] = [];
    
    // Generate bid orders (below current price)
    for (let i = 0; i < 10; i++) {
      const price = currentPrice - spread/2 - (i * currentPrice * 0.001);
      const quantity = Math.floor(Math.random() * 1000) + 100;
      bids.push({
        price: price,
        quantity: quantity,
        total: price * quantity,
        side: 'bid'
      });
    }
    
    // Generate ask orders (above current price)
    for (let i = 0; i < 10; i++) {
      const price = currentPrice + spread/2 + (i * currentPrice * 0.001);
      const quantity = Math.floor(Math.random() * 1000) + 100;
      asks.push({
        price: price,
        quantity: quantity,
        total: price * quantity,
        side: 'ask'
      });
    }
    
    return { bids, asks };
  };

  const { bids, asks } = generateOrderBookData();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatQuantity = (quantity: number) => {
    return new Intl.NumberFormat('en-US').format(quantity);
  };

  const currentPrice = assetPrice?.data?.[0] ? parseFloat(assetPrice.data[0].currentPrice) : 0;
  const bestBid = bids[0]?.price || 0;
  const bestAsk = asks[0]?.price || 0;
  const spread = bestAsk - bestBid;
  const spreadPercent = currentPrice > 0 ? (spread / currentPrice) * 100 : 0;

  if (priceLoading) {
    return (
      <div className="h-64 flex items-center justify-center" data-testid="order-book-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading order book...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="order-book-component">
      {/* Spread Information */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Spread:</span>
        <div className="flex items-center gap-2">
          <span className="font-medium">{formatCurrency(spread)}</span>
          <Badge variant="outline" className="text-xs">
            {spreadPercent.toFixed(3)}%
          </Badge>
        </div>
      </div>

      {/* Order Book Header */}
      <div className="grid grid-cols-3 text-xs font-medium text-muted-foreground border-b pb-2">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      <div className="space-y-2">
        {/* Ask Orders (Sellers) */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-500">Ask</span>
          </div>
          
          <ScrollArea className="h-32">
            <div className="space-y-1">
              {asks.slice().reverse().map((ask, index) => (
                <div
                  key={`ask-${index}`}
                  className={`grid grid-cols-3 text-xs hover:bg-red-500/10 p-1 rounded cursor-pointer transition-colors ${
                    selectedPrice === ask.price ? 'bg-red-500/20' : ''
                  }`}
                  onClick={() => setSelectedPrice(ask.price)}
                  data-testid={`order-book-ask-${index}`}
                >
                  <span className="text-red-500 font-medium">{formatCurrency(ask.price)}</span>
                  <span className="text-right">{formatQuantity(ask.quantity)}</span>
                  <span className="text-right text-muted-foreground">
                    {formatCurrency(ask.total)}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Current Price */}
        {currentPrice > 0 && (
          <div className="py-2 border-y bg-muted/30" data-testid="current-price">
            <div className="text-center">
              <div className="text-lg font-bold">{formatCurrency(currentPrice)}</div>
              <div className="text-xs text-muted-foreground">Last Price</div>
            </div>
          </div>
        )}

        {/* Bid Orders (Buyers) */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-500">Bid</span>
          </div>
          
          <ScrollArea className="h-32">
            <div className="space-y-1">
              {bids.map((bid, index) => (
                <div
                  key={`bid-${index}`}
                  className={`grid grid-cols-3 text-xs hover:bg-emerald-500/10 p-1 rounded cursor-pointer transition-colors ${
                    selectedPrice === bid.price ? 'bg-emerald-500/20' : ''
                  }`}
                  onClick={() => setSelectedPrice(bid.price)}
                  data-testid={`order-book-bid-${index}`}
                >
                  <span className="text-emerald-500 font-medium">{formatCurrency(bid.price)}</span>
                  <span className="text-right">{formatQuantity(bid.quantity)}</span>
                  <span className="text-right text-muted-foreground">
                    {formatCurrency(bid.total)}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Selected Price Action */}
      {selectedPrice && (
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Selected:</span>
            <span className="font-medium">{formatCurrency(selectedPrice)}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <Button 
              size="sm" 
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              data-testid="button-buy-at-selected"
            >
              Buy at {formatCurrency(selectedPrice)}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-red-500 border-red-500 hover:bg-red-500/10"
              data-testid="button-sell-at-selected"
            >
              Sell at {formatCurrency(selectedPrice)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}