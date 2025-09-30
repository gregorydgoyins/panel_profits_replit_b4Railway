import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { OrderBookUpdate } from '@/services/websocketService';

interface OrderBookProps {
  orderBook: OrderBookUpdate | null;
  symbol?: string;
  className?: string;
}

export function OrderBook({ orderBook, symbol, className }: OrderBookProps) {
  const [flashRows, setFlashRows] = useState<{ [key: string]: 'up' | 'down' }>({});
  const prevOrderBookRef = useRef<OrderBookUpdate | null>(null);
  
  useEffect(() => {
    if (!orderBook || !prevOrderBookRef.current) {
      prevOrderBookRef.current = orderBook;
      return;
    }
    
    const prevBook = prevOrderBookRef.current;
    const newFlashes: { [key: string]: 'up' | 'down' } = {};
    
    // Check for bid changes
    orderBook.bids.forEach((bid, index) => {
      const prevBid = prevBook.bids[index];
      if (prevBid) {
        if (bid.quantity > prevBid.quantity) {
          newFlashes[`bid-${index}`] = 'up';
        } else if (bid.quantity < prevBid.quantity) {
          newFlashes[`bid-${index}`] = 'down';
        }
      }
    });
    
    // Check for ask changes
    orderBook.asks.forEach((ask, index) => {
      const prevAsk = prevBook.asks[index];
      if (prevAsk) {
        if (ask.quantity > prevAsk.quantity) {
          newFlashes[`ask-${index}`] = 'up';
        } else if (ask.quantity < prevAsk.quantity) {
          newFlashes[`ask-${index}`] = 'down';
        }
      }
    });
    
    setFlashRows(newFlashes);
    prevOrderBookRef.current = orderBook;
    
    // Clear flashes after animation
    const timer = setTimeout(() => {
      setFlashRows({});
    }, 300);
    
    return () => clearTimeout(timer);
  }, [orderBook]);
  
  if (!orderBook) {
    return (
      <Card className={cn("bg-black border-green-500/20", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono text-green-500">
            ORDER BOOK {symbol ? `- ${symbol}` : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-green-500/50 font-mono text-xs">
            NO DATA AVAILABLE
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const maxBidQuantity = Math.max(...orderBook.bids.map(b => b.quantity));
  const maxAskQuantity = Math.max(...orderBook.asks.map(a => a.quantity));
  
  return (
    <Card className={cn("bg-black border-green-500/20 overflow-hidden", className)}>
      <CardHeader className="pb-2 border-b border-green-500/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono text-green-500">
            ORDER BOOK - {orderBook.symbol}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono border-green-500/30 text-green-500">
              SPREAD: {orderBook.spreadPercent.toFixed(2)}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 divide-x divide-green-500/20">
          {/* Bids (Buy Orders) */}
          <div>
            <div className="grid grid-cols-3 gap-1 px-2 py-1 border-b border-green-500/20 bg-green-500/5">
              <div className="text-[10px] font-mono text-green-500/70">PRICE</div>
              <div className="text-[10px] font-mono text-green-500/70 text-right">QTY</div>
              <div className="text-[10px] font-mono text-green-500/70 text-right">TOTAL</div>
            </div>
            <ScrollArea className="h-[300px]">
              {orderBook.bids.map((bid, index) => {
                const barWidth = (bid.quantity / maxBidQuantity) * 100;
                const flash = flashRows[`bid-${index}`];
                
                return (
                  <div 
                    key={`bid-${index}`}
                    className={cn(
                      "grid grid-cols-3 gap-1 px-2 py-0.5 relative transition-all duration-300",
                      flash === 'up' && "bg-green-500/20",
                      flash === 'down' && "bg-red-500/20"
                    )}
                  >
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent pointer-events-none"
                      style={{ width: `${barWidth}%` }}
                    />
                    <div className="text-[11px] font-mono text-green-400 relative z-10">
                      ${bid.price.toFixed(2)}
                    </div>
                    <div className="text-[11px] font-mono text-green-500/80 text-right relative z-10">
                      {bid.quantity.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-mono text-green-500/60 text-right relative z-10">
                      ${(bid.total / 1000).toFixed(1)}K
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </div>
          
          {/* Asks (Sell Orders) */}
          <div>
            <div className="grid grid-cols-3 gap-1 px-2 py-1 border-b border-green-500/20 bg-red-500/5">
              <div className="text-[10px] font-mono text-red-500/70">PRICE</div>
              <div className="text-[10px] font-mono text-red-500/70 text-right">QTY</div>
              <div className="text-[10px] font-mono text-red-500/70 text-right">TOTAL</div>
            </div>
            <ScrollArea className="h-[300px]">
              {orderBook.asks.map((ask, index) => {
                const barWidth = (ask.quantity / maxAskQuantity) * 100;
                const flash = flashRows[`ask-${index}`];
                
                return (
                  <div 
                    key={`ask-${index}`}
                    className={cn(
                      "grid grid-cols-3 gap-1 px-2 py-0.5 relative transition-all duration-300",
                      flash === 'up' && "bg-green-500/20",
                      flash === 'down' && "bg-red-500/20"
                    )}
                  >
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent pointer-events-none"
                      style={{ width: `${barWidth}%` }}
                    />
                    <div className="text-[11px] font-mono text-red-400 relative z-10">
                      ${ask.price.toFixed(2)}
                    </div>
                    <div className="text-[11px] font-mono text-red-500/80 text-right relative z-10">
                      {ask.quantity.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-mono text-red-500/60 text-right relative z-10">
                      ${(ask.total / 1000).toFixed(1)}K
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </div>
        </div>
        
        {/* Market Stats Bar */}
        <div className="grid grid-cols-3 gap-2 p-2 border-t border-green-500/20 bg-black/50">
          <div className="text-center">
            <div className="text-[9px] font-mono text-green-500/50">BID VOL</div>
            <div className="text-[11px] font-mono text-green-400">
              {(orderBook.bids.reduce((sum, b) => sum + b.quantity, 0) / 1000).toFixed(1)}K
            </div>
          </div>
          <div className="text-center">
            <div className="text-[9px] font-mono text-green-500/50">SPREAD</div>
            <div className="text-[11px] font-mono text-yellow-400">
              ${orderBook.spread.toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[9px] font-mono text-green-500/50">ASK VOL</div>
            <div className="text-[11px] font-mono text-red-400">
              {(orderBook.asks.reduce((sum, a) => sum + a.quantity, 0) / 1000).toFixed(1)}K
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}