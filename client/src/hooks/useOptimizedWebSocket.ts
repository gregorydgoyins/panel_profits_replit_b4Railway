import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { 
  webSocketService, 
  type MarketDataUpdate, 
  type PortfolioUpdate, 
  type MarketEventUpdate,
  type PriceUpdate,
  type OrderBookUpdate,
  type MarketPulse
} from '@/services/websocketService';

interface WebSocketData {
  marketData: Map<string, MarketDataUpdate>;
  priceUpdates: Map<string, PriceUpdate>;
  orderBooks: Map<string, OrderBookUpdate>;
  marketPulse: MarketPulse | null;
  portfolioUpdates: PortfolioUpdate[];
  marketEvents: MarketEventUpdate[];
  connectionStatus: string;
  lastUpdateTime: Date | null;
}

interface UseWebSocketProps {
  subscribeTo?: {
    assets?: string[];
    portfolios?: string[];
    victims?: boolean;
  };
  throttleMs?: number; // Throttle updates (default: 500ms for charts, 100ms for prices)
  maxBufferSize?: number; // Maximum updates to buffer
  enableBatching?: boolean; // Batch multiple updates
}

// Throttle function with batching support
function throttleWithBatch<T>(
  fn: (batch: T[]) => void, 
  delay: number,
  maxBatchSize: number = 10
) {
  let timeoutId: NodeJS.Timeout | null = null;
  let batch: T[] = [];
  let lastExecutionTime = 0;

  return (item: T) => {
    batch.push(item);
    
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutionTime;
    
    const execute = () => {
      if (batch.length > 0) {
        fn(batch.slice(0, maxBatchSize));
        batch = batch.slice(maxBatchSize);
        lastExecutionTime = Date.now();
        
        // Schedule next batch if there are more items
        if (batch.length > 0) {
          timeoutId = setTimeout(execute, delay);
        } else {
          timeoutId = null;
        }
      }
    };

    // Execute immediately if enough time has passed or batch is full
    if (timeSinceLastExecution >= delay || batch.length >= maxBatchSize) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      execute();
    } else if (!timeoutId) {
      // Schedule execution
      timeoutId = setTimeout(execute, delay - timeSinceLastExecution);
    }
  };
}

export function useOptimizedWebSocket({ 
  subscribeTo,
  throttleMs = 100, // Default 100ms throttle for price updates
  maxBufferSize = 20,
  enableBatching = true
}: UseWebSocketProps = {}) {
  const [data, setData] = useState<WebSocketData>({
    marketData: new Map(),
    priceUpdates: new Map(),
    orderBooks: new Map(),
    marketPulse: null,
    portfolioUpdates: [],
    marketEvents: [],
    connectionStatus: 'disconnected',
    lastUpdateTime: null
  });
  
  const priceFlashTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const updateQueue = useRef<any[]>([]);
  const rafId = useRef<number>();
  const lastRenderTime = useRef<number>(0);

  // Detect if mobile device for performance adjustments
  const isMobile = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(max-width: 768px)').matches ||
             /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    return false;
  }, []);

  // Adjust throttle for mobile devices
  const effectiveThrottleMs = isMobile ? throttleMs * 2 : throttleMs;

  // Batch state updates using requestAnimationFrame
  const batchUpdate = useCallback((updateFn: (prev: WebSocketData) => WebSocketData) => {
    updateQueue.current.push(updateFn);
    
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(() => {
        const now = performance.now();
        
        // Limit updates to 60fps (16.67ms between frames)
        if (now - lastRenderTime.current >= 16.67) {
          setData(prev => {
            let newState = prev;
            for (const fn of updateQueue.current) {
              newState = fn(newState);
            }
            return newState;
          });
          
          updateQueue.current = [];
          lastRenderTime.current = now;
        }
        
        rafId.current = undefined;
      });
    }
  }, []);

  // Update connection status
  const updateConnectionStatus = useCallback(() => {
    batchUpdate(prev => ({
      ...prev,
      connectionStatus: webSocketService.getConnectionStatus()
    }));
  }, [batchUpdate]);

  // Throttled price update handler with batching
  const processPriceBatch = useCallback((updates: PriceUpdate[]) => {
    batchUpdate(prev => {
      const newPriceUpdates = new Map(prev.priceUpdates);
      
      updates.forEach(priceUpdate => {
        const prevPrice = prev.priceUpdates.get(priceUpdate.assetId)?.price;
        
        // Add flash indicator for price change
        const updateWithFlash = {
          ...priceUpdate,
          flash: prevPrice ? (priceUpdate.price > prevPrice ? 'up' : priceUpdate.price < prevPrice ? 'down' : null) : null
        };
        
        newPriceUpdates.set(priceUpdate.assetId, updateWithFlash as PriceUpdate);
        
        // Clear flash after animation (reduced time for performance)
        const existingTimer = priceFlashTimers.current.get(priceUpdate.assetId);
        if (existingTimer) {
          clearTimeout(existingTimer);
        }
        
        const timer = setTimeout(() => {
          batchUpdate(current => {
            const updatedPrices = new Map(current.priceUpdates);
            const update = updatedPrices.get(priceUpdate.assetId);
            if (update) {
              updatedPrices.set(priceUpdate.assetId, { ...update, flash: null } as any);
            }
            return { ...current, priceUpdates: updatedPrices };
          });
          priceFlashTimers.current.delete(priceUpdate.assetId);
        }, 300); // Reduced from 500ms for snappier animations
        
        priceFlashTimers.current.set(priceUpdate.assetId, timer);
      });
      
      return {
        ...prev,
        priceUpdates: newPriceUpdates,
        lastUpdateTime: new Date()
      };
    });
  }, [batchUpdate]);

  // Create throttled handlers
  const throttledPriceUpdate = useMemo(
    () => enableBatching 
      ? throttleWithBatch(processPriceBatch, effectiveThrottleMs, maxBufferSize)
      : (update: PriceUpdate) => processPriceBatch([update]),
    [processPriceBatch, effectiveThrottleMs, maxBufferSize, enableBatching]
  );

  // Handle market data updates with throttling
  const handleMarketData = useCallback((marketUpdate: MarketDataUpdate) => {
    batchUpdate(prev => {
      const newMarketData = new Map(prev.marketData);
      newMarketData.set(marketUpdate.assetId, marketUpdate);
      return {
        ...prev,
        marketData: newMarketData
      };
    });
  }, [batchUpdate]);

  // Handle portfolio updates (limit size for memory)
  const handlePortfolioUpdate = useCallback((portfolioUpdate: PortfolioUpdate) => {
    batchUpdate(prev => ({
      ...prev,
      portfolioUpdates: [portfolioUpdate, ...prev.portfolioUpdates.slice(0, 4)] // Reduced from 10 to 5 for memory
    }));
  }, [batchUpdate]);

  // Handle market events (limit size for memory)
  const handleMarketEvent = useCallback((marketEvent: MarketEventUpdate) => {
    batchUpdate(prev => ({
      ...prev,
      marketEvents: [marketEvent, ...prev.marketEvents.slice(0, 9)] // Reduced from 20 to 10 for memory
    }));
  }, [batchUpdate]);

  // Handle price updates - use throttled version
  const handlePriceUpdate = useCallback((priceUpdate: PriceUpdate) => {
    throttledPriceUpdate(priceUpdate);
  }, [throttledPriceUpdate]);
  
  // Throttled order book updates (less frequent than prices)
  const handleOrderBookUpdate = useMemo(() => {
    const processOrderBook = (updates: OrderBookUpdate[]) => {
      batchUpdate(prev => {
        const newOrderBooks = new Map(prev.orderBooks);
        updates.forEach(update => {
          newOrderBooks.set(update.assetId, update);
        });
        return {
          ...prev,
          orderBooks: newOrderBooks
        };
      });
    };
    
    return enableBatching 
      ? throttleWithBatch(processOrderBook, effectiveThrottleMs * 5, 5) // Order books update less frequently
      : (update: OrderBookUpdate) => processOrderBook([update]);
  }, [batchUpdate, effectiveThrottleMs, enableBatching]);
  
  // Handle market pulse updates
  const handleMarketPulse = useCallback((pulse: MarketPulse) => {
    batchUpdate(prev => ({
      ...prev,
      marketPulse: pulse
    }));
  }, [batchUpdate]);
  
  // Handle connection status changes with exponential backoff
  const reconnectAttempts = useRef(0);
  const handleConnectionChange = useCallback((connectionData: any) => {
    updateConnectionStatus();
    
    // Resubscribe to assets/portfolios after reconnection
    if (connectionData.status === 'connected') {
      reconnectAttempts.current = 0; // Reset on successful connection
      
      if (subscribeTo) {
        if (subscribeTo.assets && subscribeTo.assets.length > 0) {
          // Use bulk subscription for efficiency
          webSocketService.subscribeToAssets(subscribeTo.assets);
        }
        if (subscribeTo.portfolios) {
          subscribeTo.portfolios.forEach(portfolioId => {
            webSocketService.subscribeToPortfolio(portfolioId);
          });
        }
      }
    } else if (connectionData.status === 'disconnected') {
      // Implement exponential backoff for reconnection
      const backoffDelay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
      reconnectAttempts.current++;
      
      setTimeout(() => {
        // Trigger reconnection logic if still disconnected
        if (webSocketService.getConnectionStatus() === 'disconnected') {
          webSocketService.connect?.();
        }
      }, backoffDelay);
    }
  }, [subscribeTo, updateConnectionStatus]);

  useEffect(() => {
    // Set up event listeners
    webSocketService.on('marketData', handleMarketData);
    webSocketService.on('priceUpdate', handlePriceUpdate);
    webSocketService.on('orderBookUpdate', handleOrderBookUpdate);
    webSocketService.on('marketPulse', handleMarketPulse);
    webSocketService.on('portfolioUpdate', handlePortfolioUpdate);
    webSocketService.on('marketEvent', handleMarketEvent);
    webSocketService.on('connection', handleConnectionChange);

    // Update initial connection status
    updateConnectionStatus();

    // Subscribe to specified assets and portfolios
    if (subscribeTo?.assets && subscribeTo.assets.length > 0) {
      // Use bulk subscription for better performance
      webSocketService.subscribeToAssets(subscribeTo.assets);
    }
    if (subscribeTo?.portfolios) {
      subscribeTo.portfolios.forEach(portfolioId => {
        webSocketService.subscribeToPortfolio(portfolioId);
      });
    }

    // Cleanup on unmount
    return () => {
      webSocketService.off('marketData', handleMarketData);
      webSocketService.off('priceUpdate', handlePriceUpdate);
      webSocketService.off('orderBookUpdate', handleOrderBookUpdate);
      webSocketService.off('marketPulse', handleMarketPulse);
      webSocketService.off('portfolioUpdate', handlePortfolioUpdate);
      webSocketService.off('marketEvent', handleMarketEvent);
      webSocketService.off('connection', handleConnectionChange);

      // Unsubscribe from assets and portfolios
      if (subscribeTo?.assets) {
        subscribeTo.assets.forEach(assetId => {
          webSocketService.unsubscribeFromAsset(assetId);
        });
      }
      
      // Clear all flash timers
      priceFlashTimers.current.forEach(timer => clearTimeout(timer));
      priceFlashTimers.current.clear();
      
      // Cancel any pending animation frame
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleMarketData, handlePriceUpdate, handleOrderBookUpdate, handleMarketPulse, handlePortfolioUpdate, handleMarketEvent, handleConnectionChange, subscribeTo, updateConnectionStatus]);

  // Memoized helper functions to prevent recreating on every render
  const helpers = useMemo(() => ({
    getLatestPrice: (assetId: string): number | null => {
      const marketData = data.marketData.get(assetId);
      return marketData ? marketData.currentPrice : null;
    },
    getLatestChange: (assetId: string): { change: number; changePercent: number } | null => {
      const marketData = data.marketData.get(assetId);
      return marketData ? { change: marketData.change, changePercent: marketData.changePercent } : null;
    },
    getRealTimePrice: (assetId: string): { price: number; flash: 'up' | 'down' | null } | null => {
      const priceUpdate = data.priceUpdates.get(assetId);
      if (priceUpdate) {
        return {
          price: priceUpdate.price,
          flash: (priceUpdate as any).flash || null
        };
      }
      // Fallback to regular market data
      const marketData = data.marketData.get(assetId);
      return marketData ? { price: marketData.currentPrice, flash: null } : null;
    },
    getOrderBook: (assetId: string): OrderBookUpdate | null => {
      return data.orderBooks.get(assetId) || null;
    }
  }), [data.marketData, data.priceUpdates, data.orderBooks]);

  const subscriptionHelpers = useMemo(() => ({
    subscribeToAsset: (assetId: string) => webSocketService.subscribeToAsset(assetId),
    unsubscribeFromAsset: (assetId: string) => webSocketService.unsubscribeFromAsset(assetId),
    subscribeToPortfolio: (portfolioId: string) => webSocketService.subscribeToPortfolio(portfolioId),
  }), []);
  
  return {
    // Data
    marketData: data.marketData,
    priceUpdates: data.priceUpdates,
    orderBooks: data.orderBooks,
    marketPulse: data.marketPulse,
    portfolioUpdates: data.portfolioUpdates,
    marketEvents: data.marketEvents,
    connectionStatus: data.connectionStatus,
    lastUpdateTime: data.lastUpdateTime,
    
    // Helper functions
    ...helpers,
    
    // Subscription management
    ...subscriptionHelpers,
    
    // Connection helpers
    isConnected: data.connectionStatus === 'connected',
    isConnecting: data.connectionStatus === 'connecting',
    isDisconnected: data.connectionStatus === 'disconnected',
    
    // Performance helpers
    isMobile
  };
}