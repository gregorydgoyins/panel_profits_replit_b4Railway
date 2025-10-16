"use strict";
/**
 * Ticker Migration Configuration
 *
 * Controls the transition from old ticker system to new Symbol Registry
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASSET_TYPES_TO_MIGRATE = exports.TICKER_MIGRATION_CONFIG = void 0;
exports.isTickerGenerationFrozen = isTickerGenerationFrozen;
exports.isNewSymbolRegistryEnabled = isNewSymbolRegistryEnabled;
exports.getMigrationStatus = getMigrationStatus;
exports.TICKER_MIGRATION_CONFIG = {
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
exports.ASSET_TYPES_TO_MIGRATE = [
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
];
/**
 * Check if ticker generation is frozen
 */
function isTickerGenerationFrozen() {
    return exports.TICKER_MIGRATION_CONFIG.FREEZE_OLD_TICKER_GENERATION;
}
/**
 * Check if new symbol registry is enabled
 */
function isNewSymbolRegistryEnabled() {
    return exports.TICKER_MIGRATION_CONFIG.ENABLE_NEW_SYMBOL_REGISTRY;
}
/**
 * Get migration status message
 */
function getMigrationStatus() {
    if (exports.TICKER_MIGRATION_CONFIG.FREEZE_OLD_TICKER_GENERATION) {
        return '🚫 Old ticker generation is FROZEN - Migration in progress';
    }
    if (exports.TICKER_MIGRATION_CONFIG.DUAL_WRITE_MODE) {
        return '⚠️ Running in DUAL-WRITE mode - Both old and new systems active';
    }
    if (exports.TICKER_MIGRATION_CONFIG.ENABLE_NEW_SYMBOL_REGISTRY) {
        return '✅ New Symbol Registry is ACTIVE';
    }
    return '📊 Using legacy ticker system';
}
