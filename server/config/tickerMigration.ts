/**
 * Ticker Migration Configuration
 * 
 * Controls the transition from old ticker system to new Symbol Registry
 */

export const TICKER_MIGRATION_CONFIG = {
  // Flag to enable/disable old ticker generation
  FREEZE_OLD_TICKER_GENERATION: true,
  
  // Flag to enable new Symbol Registry
  ENABLE_NEW_SYMBOL_REGISTRY: true,
  
  // Flag to run in dual-write mode (both old and new)
  DUAL_WRITE_MODE: false,
  
  // Migration batch size
  MIGRATION_BATCH_SIZE: 1000,
  
  // Whether to automatically migrate on startup
  AUTO_MIGRATE_ON_STARTUP: false,
};

/**
 * Asset types to migrate
 */
export const ASSET_TYPES_TO_MIGRATE = [
  'comic',
  'character',
  'hero',
  'villain',
  'sidekick',
  'creator',
  'publisher',
  'gadget',
  'location',
  'fund',
  'etf',
  'bond',
  'option',
  'derivative',
  'crypto',
  'nft',
  'pet',
] as const;

/**
 * Check if ticker generation is frozen
 */
export function isTickerGenerationFrozen(): boolean {
  return TICKER_MIGRATION_CONFIG.FREEZE_OLD_TICKER_GENERATION;
}

/**
 * Check if new symbol registry is enabled
 */
export function isNewSymbolRegistryEnabled(): boolean {
  return TICKER_MIGRATION_CONFIG.ENABLE_NEW_SYMBOL_REGISTRY;
}

/**
 * Get migration status message
 */
export function getMigrationStatus(): string {
  if (TICKER_MIGRATION_CONFIG.FREEZE_OLD_TICKER_GENERATION) {
    return '🚫 Old ticker generation is FROZEN - Migration in progress';
  }
  
  if (TICKER_MIGRATION_CONFIG.DUAL_WRITE_MODE) {
    return '⚠️ Running in DUAL-WRITE mode - Both old and new systems active';
  }
  
  if (TICKER_MIGRATION_CONFIG.ENABLE_NEW_SYMBOL_REGISTRY) {
    return '✅ New Symbol Registry is ACTIVE';
  }
  
  return '📊 Using legacy ticker system';
}
