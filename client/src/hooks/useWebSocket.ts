import { useEffect, useState, useCallback } from 'react';
import { webSocketService, type MarketDataUpdate, type PortfolioUpdate, type MarketEventUpdate } from '@/services/websocketService';

interface WebSocketData {
  marketData: Map<string, MarketDataUpdate>;
  portfolioUpdates: PortfolioUpdate[];
  marketEvents: MarketEventUpdate[];
  connectionStatus: string;
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
    portfolioUpdates: [],
    marketEvents: [],
    connectionStatus: 'disconnected'
  });

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

  // Handle connection status changes
  const handleConnectionChange = useCallback((connectionData: any) => {
    updateConnectionStatus();
    
    // Resubscribe to assets/portfolios after reconnection
    if (connectionData.status === 'connected' && subscribeTo) {
      if (subscribeTo.assets) {
        subscribeTo.assets.forEach(assetId => {
          webSocketService.subscribeToAsset(assetId);
        });
      }
      if (subscribeTo.portfolios) {
        subscribeTo.portfolios.forEach(portfolioId => {
          webSocketService.subscribeToPortfolio(portfolioId);
        });
      }
    }
  }, [subscribeTo]);

  useEffect(() => {
    // Set up event listeners
    webSocketService.on('marketData', handleMarketData);
    webSocketService.on('portfolioUpdate', handlePortfolioUpdate);
    webSocketService.on('marketEvent', handleMarketEvent);
    webSocketService.on('connection', handleConnectionChange);

    // Update initial connection status
    updateConnectionStatus();

    // Subscribe to specified assets and portfolios
    if (subscribeTo?.assets) {
      subscribeTo.assets.forEach(assetId => {
        webSocketService.subscribeToAsset(assetId);
      });
    }
    if (subscribeTo?.portfolios) {
      subscribeTo.portfolios.forEach(portfolioId => {
        webSocketService.subscribeToPortfolio(portfolioId);
      });
    }

    // Cleanup on unmount
    return () => {
      webSocketService.off('marketData', handleMarketData);
      webSocketService.off('portfolioUpdate', handlePortfolioUpdate);
      webSocketService.off('marketEvent', handleMarketEvent);
      webSocketService.off('connection', handleConnectionChange);

      // Unsubscribe from assets and portfolios
      if (subscribeTo?.assets) {
        subscribeTo.assets.forEach(assetId => {
          webSocketService.unsubscribeFromAsset(assetId);
        });
      }
    };
  }, [handleMarketData, handlePortfolioUpdate, handleMarketEvent, handleConnectionChange, subscribeTo]);

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

  return {
    // Data
    marketData: data.marketData,
    portfolioUpdates: data.portfolioUpdates,
    marketEvents: data.marketEvents,
    connectionStatus: data.connectionStatus,
    
    // Helper functions
    getLatestPrice,
    getLatestChange,
    
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