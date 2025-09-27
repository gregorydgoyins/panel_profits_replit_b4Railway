import { create } from 'zustand';
import type { SubscriptionState, SubscriptionTier, SubscriptionFeatures } from '../types';

// Define features for each subscription tier
const TIER_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  basic: {
    maxClusters: 7,
    realTimeClustering: false,
    sentimentAnalysis: false,
    crossProjectClustering: false,
    advancedVisualization: false,
    customClusterMerging: false,
    priorityProcessing: false,
    exportCapabilities: false,
    apiAccess: false
  },
  standard: {
    maxClusters: 25,
    realTimeClustering: false,
    sentimentAnalysis: true,
    crossProjectClustering: false,
    advancedVisualization: false,
    customClusterMerging: true,
    priorityProcessing: false,
    exportCapabilities: true,
    apiAccess: false
  },
  premium: {
    maxClusters: 100,
    realTimeClustering: true,
    sentimentAnalysis: true,
    crossProjectClustering: true,
    advancedVisualization: true,
    customClusterMerging: true,
    priorityProcessing: true,
    exportCapabilities: true,
    apiAccess: true
  }
};

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  currentTier: 'basic', // Default to basic tier
  features: TIER_FEATURES.basic,
  
  setTier: (tier: SubscriptionTier) => set({
    currentTier: tier,
    features: TIER_FEATURES[tier]
  })
}));