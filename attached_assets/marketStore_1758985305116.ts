import { create } from 'zustand';

interface MarketState {
  userBalance: number;
  marketIndex: number;
  volatility: number;
  setUserBalance: (balance: number) => void;
  setMarketIndex: (index: number) => void;
  setVolatility: (volatility: number) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  userBalance: 2000000, // Starting with 2M Comic Coins
  marketIndex: 14250,
  volatility: 0.25,
  
  setUserBalance: (balance: number) => set({ userBalance: balance }),
  setMarketIndex: (index: number) => set({ marketIndex: index }),
  setVolatility: (volatility: number) => set({ volatility })
}));

export default useMarketStore;