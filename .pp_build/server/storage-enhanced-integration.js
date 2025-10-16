"use strict";
// Enhanced storage methods integration for Enhanced Mythological Trading Interface
// This file adds the required storage methods to support the enhanced API endpoints
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEnhancedStorageMethods = addEnhancedStorageMethods;
exports.initializeEnhancedStorage = initializeEnhancedStorage;
const storage_enhanced_methods_js_1 = require("./storage-enhanced-methods.js");
// Add these methods to the existing storage class implementation
function addEnhancedStorageMethods(storage, db) {
    // Enhanced Characters
    storage.getEnhancedCharacters = async (filters) => {
        return storage_enhanced_methods_js_1.enhancedStorageMethods.getEnhancedCharacters(db, filters);
    };
    storage.searchEnhancedCharacters = async (params) => {
        return storage_enhanced_methods_js_1.enhancedStorageMethods.searchEnhancedCharacters(db, params);
    };
    storage.getCharacterById = async (id) => {
        try {
            const result = await db.select().from(enhancedCharacters).where(eq(enhancedCharacters.id, id)).limit(1);
            return result[0] || null;
        }
        catch (error) {
            console.error('Get character by ID error:', error);
            return null;
        }
    };
    // Enhanced Comic Issues
    storage.getEnhancedComicIssues = async (filters) => {
        return storage_enhanced_methods_js_1.enhancedStorageMethods.getEnhancedComicIssues(db, filters);
    };
    storage.searchEnhancedComics = async (params) => {
        return storage_enhanced_methods_js_1.enhancedStorageMethods.searchEnhancedComics(db, params);
    };
    storage.getComicIssueById = async (id) => {
        try {
            const result = await db.select().from(enhancedComicIssues).where(eq(enhancedComicIssues.id, id)).limit(1);
            return result[0] || null;
        }
        catch (error) {
            console.error('Get comic issue by ID error:', error);
            return null;
        }
    };
    // Movie Performance
    storage.getMoviePerformanceData = async (filters) => {
        return storage_enhanced_methods_js_1.enhancedStorageMethods.getMoviePerformanceData(db, filters);
    };
    // Battle Intelligence
    storage.getRecentBattleOutcomes = async (filters) => {
        return storage_enhanced_methods_js_1.enhancedStorageMethods.getRecentBattleOutcomes(db, filters);
    };
    storage.getPowerLevelShifts = async (filters) => {
        return storage_enhanced_methods_js_1.enhancedStorageMethods.getPowerLevelShifts(db, filters);
    };
    storage.getCombatAnalytics = async () => {
        return storage_enhanced_methods_js_1.enhancedStorageMethods.getCombatAnalytics(db);
    };
    storage.getMarketOverview = async () => {
        return storage_enhanced_methods_js_1.enhancedStorageMethods.getMarketOverview(db);
    };
    console.log('✅ Enhanced storage methods integrated successfully');
}
// Method to initialize enhanced methods in existing storage
function initializeEnhancedStorage() {
    try {
        // This would be called from the main storage initialization
        console.log('🚀 Initializing Enhanced Mythological Trading Storage Methods...');
        // Note: This integration should be added to the main storage.ts file
        // where the storage instance is created with database connection
        return true;
    }
    catch (error) {
        console.error('❌ Failed to initialize enhanced storage:', error);
        return false;
    }
}
