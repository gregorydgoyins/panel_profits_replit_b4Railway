// Enhanced storage methods integration for Enhanced Mythological Trading Interface
// This file adds the required storage methods to support the enhanced API endpoints

import { 
  enhancedStorageMethods,
  type EnhancedCharacterFilters,
  type EnhancedComicFilters,
  type MoviePerformanceFilters,
  type BattleOutcomeFilters,
  type PowerShiftFilters
} from './storage-enhanced-methods.js';

// Add these methods to the existing storage class implementation

export function addEnhancedStorageMethods(storage: any, db: any) {
  // Enhanced Characters
  storage.getEnhancedCharacters = async (filters?: EnhancedCharacterFilters) => {
    return enhancedStorageMethods.getEnhancedCharacters(db, filters);
  };

  storage.searchEnhancedCharacters = async (params: { query: string; universe?: string; limit?: number }) => {
    return enhancedStorageMethods.searchEnhancedCharacters(db, params);
  };

  storage.getCharacterById = async (id: string) => {
    try {
      const result = await db.select().from(enhancedCharacters).where(eq(enhancedCharacters.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Get character by ID error:', error);
      return null;
    }
  };

  // Enhanced Comic Issues
  storage.getEnhancedComicIssues = async (filters?: EnhancedComicFilters) => {
    return enhancedStorageMethods.getEnhancedComicIssues(db, filters);
  };

  storage.searchEnhancedComics = async (params: { query: string; limit?: number }) => {
    return enhancedStorageMethods.searchEnhancedComics(db, params);
  };

  storage.getComicIssueById = async (id: string) => {
    try {
      const result = await db.select().from(enhancedComicIssues).where(eq(enhancedComicIssues.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Get comic issue by ID error:', error);
      return null;
    }
  };

  // Movie Performance
  storage.getMoviePerformanceData = async (filters?: MoviePerformanceFilters) => {
    return enhancedStorageMethods.getMoviePerformanceData(db, filters);
  };

  // Battle Intelligence
  storage.getRecentBattleOutcomes = async (filters?: BattleOutcomeFilters) => {
    return enhancedStorageMethods.getRecentBattleOutcomes(db, filters);
  };

  storage.getPowerLevelShifts = async (filters?: PowerShiftFilters) => {
    return enhancedStorageMethods.getPowerLevelShifts(db, filters);
  };

  storage.getCombatAnalytics = async () => {
    return enhancedStorageMethods.getCombatAnalytics(db);
  };

  storage.getMarketOverview = async () => {
    return enhancedStorageMethods.getMarketOverview(db);
  };

  console.log('✅ Enhanced storage methods integrated successfully');
}

// Method to initialize enhanced methods in existing storage
export function initializeEnhancedStorage() {
  try {
    // This would be called from the main storage initialization
    console.log('🚀 Initializing Enhanced Mythological Trading Storage Methods...');
    
    // Note: This integration should be added to the main storage.ts file
    // where the storage instance is created with database connection
    
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize enhanced storage:', error);
    return false;
  }
}