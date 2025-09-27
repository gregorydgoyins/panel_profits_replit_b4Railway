import { create } from 'zustand';
import { SimulatedInvestor, SimulationConfig, SimulationResults, MarketState } from '../types';

interface SimulationState {
  // Core state
  isInitialized: boolean;
  isRunning: boolean;
  isPaused: boolean;
  currentStep: number;
  maxSteps: number;
  
  // Configuration
  config: SimulationConfig;
  
  // Simulation data
  investors: SimulatedInvestor[];
  marketState: MarketState | null;
  results: SimulationResults | null;
  
  // Web Worker
  worker: Worker | null;
  
  // Real-time metrics
  liveMetrics: {
    totalTrades: number;
    totalMarketCap: number;
    avgReturn: number;
    marketVolatility: number;
    activeTradersCount: number;
    totalInvestors: number;
    hotAssetsCount: number;
    topPerformer: string | null;
    worstPerformer: string | null;
    mostActiveAsset: string | null;
    totalAssetsCount: number;
    dayTradersCount: number;
    marketSentiment: number;
    aiConfidence: number;
  } | null;
  
  // Actions
  initializeSimulation: (config?: Partial<SimulationConfig>) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
  
  // Getters
  getProgress: () => number;
  getTimeRemaining: () => number;
  
  // Settings
  updateConfig: (updates: Partial<SimulationConfig>) => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  // Initial state
  isInitialized: false,
  isRunning: false,
  isPaused: false,
  currentStep: 0,
  maxSteps: 1000,
  worker: null,
  
  config: {
    numInvestors: 10000, // Default to large scale simulation
    simulationDuration: 1000,
    tickInterval: 200, // Optimized for 10k investors
    startingCapital: 100000,
    enableNewsImpacts: true,
    enableLearning: false,
    marketOpenHours: { start: 9, end: 16 },
    weekendsActive: false
  },
  
  investors: [],
  marketState: null,
  results: null,
  liveMetrics: null,

  initializeSimulation: (configUpdates = {}) => {
    const newConfig = { ...get().config, ...configUpdates };
    
    // Create Web Worker for heavy computations
    const worker = new Worker('/src/services/simulationWorker.ts', { type: 'module' });
    
    // Set up worker message handling
    worker.onmessage = (e) => {
      const { type, data } = e.data;
      
      switch (type) {
        case 'INITIALIZED':
          set({
            isInitialized: true,
            investors: data.investors,
            marketState: data.marketState
          });
          break;
          
        case 'STEP_COMPLETE':
          set(state => ({
            currentStep: data.currentStep,
            liveMetrics: data.liveMetrics || state.liveMetrics,
            marketState: data.marketState || state.marketState
          }));
          
          // Check if simulation is complete
          if (data.currentStep >= newConfig.simulationDuration) {
            set({ isRunning: false });
          }
          break;
          
        case 'ERROR':
          console.error('Simulation worker error:', data.error);
          set({ isRunning: false });
          break;
      }
    };
    
    // Initialize worker
    worker.postMessage({
      type: 'INIT',
      data: {
        config: newConfig,
        initialPrices: {
          'SPDR': 4800, 'BATM': 4462, 'SUPR': 4300, 'WNDR': 3986, 'JOKR': 3800,
          'TMFS': 2500, 'JLES': 3200, 'ASM300': 2500, 'AF15': 1800000, 'ACM1': 3200000,
          'MRVLB': 1036, 'SHUF': 26
        }
      }
    });
    
    set({
      isRunning: false,
      isPaused: false,
      currentStep: 0,
      maxSteps: newConfig.simulationDuration,
      config: newConfig,
      worker,
      investors: [],
      marketState: null,
      results: null,
      liveMetrics: null
    });

    console.log('SimulationStore: Initializing simulation with', newConfig.numInvestors, 'investors via Web Worker');
  },

  startSimulation: () => {
    const state = get();
    
    if (!state.isInitialized) {
      console.warn('SimulationStore: Cannot start - simulation not initialized');
      return;
    }
    
    if (!state.worker) {
      console.error('SimulationStore: Worker not available');
      return;
    }
    
    // Set up interval for worker steps - reduced frequency for performance
    const updateInterval = setInterval(() => {
      const currentState = get();
      if (!currentState.isRunning) {
        clearInterval(updateInterval);
        return;
      }

      // Request worker to run a step
      if (currentState.worker) {
        currentState.worker.postMessage({ type: 'RUN_STEP' });
      }
    }, state.config.tickInterval * 20); // Reduced UI update frequency for performance

    set({ isRunning: true, isPaused: false });
    console.log('SimulationStore: Simulation started');
  },

  pauseSimulation: () => {
    const state = get();
    if (state.worker) {
      state.worker.postMessage({ type: 'STOP' });
    }
    set({ isRunning: false, isPaused: true });
    console.log('SimulationStore: Simulation paused');
  },

  stopSimulation: () => {
    const state = get();
    if (state.worker) {
      state.worker.postMessage({ type: 'STOP' });
    }
    
    set({ 
      isRunning: false, 
      isPaused: false
    });
    console.log('SimulationStore: Simulation stopped');
  },

  resetSimulation: () => {
    const state = get();
    if (state.worker) {
      state.worker.terminate();
    }
    
    set({
      isInitialized: false,
      isRunning: false,
      isPaused: false,
      currentStep: 0,
      worker: null,
      investors: [],
      marketState: null,
      results: null,
      liveMetrics: null
    });
    console.log('SimulationStore: Simulation reset');
  },


  getProgress: () => {
    const state = get();
    return state.maxSteps > 0 ? (state.currentStep / state.maxSteps) * 100 : 0;
  },

  getTimeRemaining: () => {
    const state = get();
    const stepsRemaining = state.maxSteps - state.currentStep;
    return stepsRemaining * state.config.tickInterval;
  },

  updateConfig: (updates) => {
    const state = get();
    const newConfig = { ...state.config, ...updates };
    
    // If numInvestors changed and simulation is running, we need to reset
    const investorCountChanged = updates.numInvestors && updates.numInvestors !== state.config.numInvestors;
    
    if (investorCountChanged && (state.isInitialized || state.isRunning)) {
      // Stop current simulation and reset
      if (state.worker) {
        state.worker.terminate();
      }
      
      set({
        config: newConfig,
        isInitialized: false,
        isRunning: false,
        isPaused: false,
        currentStep: 0,
        maxSteps: newConfig.simulationDuration,
        worker: null,
        investors: [],
        marketState: null,
        results: null,
        liveMetrics: null
      });
      
      console.log('SimulationStore: Auto-resetting simulation due to investor count change:', updates.numInvestors);
      
      // Auto-reinitialize with new config
      setTimeout(() => {
        get().initializeSimulation();
      }, 100);
    } else {
      set({ config: newConfig });
    }
  }
}));

export default useSimulationStore;