import { useEffect, useState, useCallback, useRef } from 'react';
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
  };
}

export function useWebSocket({ subscribeTo }: UseWebSocketProps = {}) {
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

  // Update connection status
  const updateConnectionStatus = useCallback(() => {
    setData(prev => ({
      ...prev,
      connectionStatus: webSocketService.getConnectionStatus()
    }));
  }, []);

  // Handle market data updates
  const handleMarketData = useCallback((marketUpdate: MarketDataUpdate) => {
    setData(prev => {
      const newMarketData = new Map(prev.marketData);
      newMarketData.set(marketUpdate.assetId, marketUpdate);
      return {
        ...prev,
        marketData: newMarketData
      };
    });
  }, []);

  // Handle portfolio updates
  const handlePortfolioUpdate = useCallback((portfolioUpdate: PortfolioUpdate) => {
    setData(prev => ({
      ...prev,
      portfolioUpdates: [portfolioUpdate, ...prev.portfolioUpdates.slice(0, 9)] // Keep last 10 updates
    }));
  }, []);

  // Handle market events
  const handleMarketEvent = useCallback((marketEvent: MarketEventUpdate) => {
    setData(prev => ({
      ...prev,
      marketEvents: [marketEvent, ...prev.marketEvents.slice(0, 19)] // Keep last 20 events
    }));
  }, []);

  // Handle price updates with flash animation tracking
  const handlePriceUpdate = useCallback((priceUpdate: PriceUpdate) => {
    setData(prev => {
      const newPriceUpdates = new Map(prev.priceUpdates);
      const prevPrice = prev.priceUpdates.get(priceUpdate.assetId)?.price;
      
      // Add flash indicator for price change
      const updateWithFlash = {
        ...priceUpdate,
        flash: prevPrice ? (priceUpdate.price > prevPrice ? 'up' : priceUpdate.price < prevPrice ? 'down' : null) : null
      };
      
      newPriceUpdates.set(priceUpdate.assetId, updateWithFlash as PriceUpdate);
      
      // Clear flash after 500ms
      const existingTimer = priceFlashTimers.current.get(priceUpdate.assetId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }
      
      const timer = setTimeout(() => {
        setData(current => {
          const updatedPrices = new Map(current.priceUpdates);
          const update = updatedPrices.get(priceUpdate.assetId);
          if (update) {
            updatedPrices.set(priceUpdate.assetId, { ...update, flash: null } as any);
          }
          return { ...current, priceUpdates: updatedPrices };
        });
        priceFlashTimers.current.delete(priceUpdate.assetId);
      }, 500);
      
      priceFlashTimers.current.set(priceUpdate.assetId, timer);
      
      return {
        ...prev,
        priceUpdates: newPriceUpdates,
        lastUpdateTime: new Date()
      };
    });
  }, []);
  
  // Handle order book updates
  const handleOrderBookUpdate = useCallback((orderBookUpdate: OrderBookUpdate) => {
    setData(prev => {
      const newOrderBooks = new Map(prev.orderBooks);
      newOrderBooks.set(orderBookUpdate.assetId, orderBookUpdate);
      return {
        ...prev,
        orderBooks: newOrderBooks
      };
    });
  }, []);
  
  // Handle market pulse updates
  const handleMarketPulse = useCallback((pulse: MarketPulse) => {
    setData(prev => ({
      ...prev,
      marketPulse: pulse
    }));
  }, []);
  
  // Handle connection status changes
  const handleConnectionChange = useCallback((connectionData: any) => {
    updateConnectionStatus();
    
    // Resubscribe to assets/portfolios after reconnection
    if (connectionData.status === 'connected' && subscribeTo) {
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
    };
  }, [handleMarketData, handlePriceUpdate, handleOrderBookUpdate, handleMarketPulse, handlePortfolioUpdate, handleMarketEvent, handleConnectionChange, subscribeTo, updateConnectionStatus]);

  // Helper functions
  const getLatestPrice = useCallback((assetId: string): number | null => {
    const marketData = data.marketData.get(assetId);
    return marketData ? marketData.currentPrice : null;
  }, [data.marketData]);

  const getLatestChange = useCallback((assetId: string): { change: number; changePercent: number } | null => {
    const marketData = data.marketData.get(assetId);
    return marketData ? { change: marketData.change, changePercent: marketData.changePercent } : null;
  }, [data.marketData]);

  const subscribeToAsset = useCallback((assetId: string) => {
    webSocketService.subscribeToAsset(assetId);
  }, []);

  const unsubscribeFromAsset = useCallback((assetId: string) => {
    webSocketService.unsubscribeFromAsset(assetId);
  }, []);

  const subscribeToPortfolio = useCallback((portfolioId: string) => {
    webSocketService.subscribeToPortfolio(portfolioId);
  }, []);

  // Get real-time price with flash indicator
  const getRealTimePrice = useCallback((assetId: string): { price: number; flash: 'up' | 'down' | null } | null => {
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
  }, [data.priceUpdates, data.marketData]);
  
  // Get order book for an asset
  const getOrderBook = useCallback((assetId: string): OrderBookUpdate | null => {
    return data.orderBooks.get(assetId) || null;
  }, [data.orderBooks]);
  
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
    getLatestPrice,
    getLatestChange,
    getRealTimePrice,
    getOrderBook,
    
    // Subscription management
    subscribeToAsset,
    unsubscribeFromAsset,
    subscribeToPortfolio,
    
    // Connection helpers
    isConnected: data.connectionStatus === 'connected',
    isConnecting: data.connectionStatus === 'connecting',
    isDisconnected: data.connectionStatus === 'disconnected'
  };
}