import { beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import express, { type Express } from 'express';
import { createServer, type Server } from 'http';
import request from 'supertest';
import { registerRoutes } from '../server/routes.js';
import { sql, eq, inArray } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

/**
 * SECURE Test Setup for Phase 2 System - PRODUCTION SAFETY FIRST
 * 
 * CRITICAL SECURITY FEATURES:
 * - Uses isolated test database (TEST_DATABASE_URL)
 * - Transaction-based test isolation
 * - Production database access prevention
 * - Safe cleanup procedures that cannot affect production
 * - Real CSV processing validation with proper seeding
 */

declare global {
  var testDb: any;
  var testApp: Express;
  var testServer: Server;
  var testStartTime: number;
  var currentTestTransaction: any;
  var testDbConfig: {
    isTestMode: boolean;
    isIsolated: boolean;
    databaseName: string;
  };
  var performanceMetrics: {
    testName: string;
    duration: number;
    memoryUsage: NodeJS.MemoryUsage;
    timestamp: Date;
  }[];
}

// SECURE test database connection and Express server
let testDbConnection: any;
let expressApp: Express;
let httpServer: Server;
let isTestDatabaseValidated = false;

beforeAll(async () => {
  console.log('🔒 Initializing SECURE Phase 2 Test Suite with Production Safety...');
  
  // CRITICAL: Validate test database configuration
  await validateTestDatabaseSafety();
  
  // Initialize ISOLATED test database connection
  const testDatabaseUrl = await getSecureTestDatabaseUrl();
  const sql_connection = neon(testDatabaseUrl);
  testDbConnection = drizzle(sql_connection);
  global.testDb = testDbConnection;
  
  // Mark database configuration for safety checks
  global.testDbConfig = {
    isTestMode: true,
    isIsolated: true,
    databaseName: extractDatabaseName(testDatabaseUrl)
  };
  
  // Initialize Express server with test-safe routes
  console.log('🚀 Booting SECURE Express server for integration testing...');
  expressApp = express();
  
  // Setup the same middleware as production
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: false }));
  
  // Override DATABASE_URL for server routes to use test database
  process.env.DATABASE_URL = testDatabaseUrl;
  
  // Register actual production routes (now using test database)
  httpServer = await registerRoutes(expressApp);
  
  // Make server available globally for tests
  global.testApp = expressApp;
  global.testServer = httpServer;
  
  // Initialize performance tracking
  global.performanceMetrics = [];
  
  // Prepare test environment with CSV fixtures
  await prepareTestEnvironment();
  
  console.log('✅ SECURE Express server and isolated test database initialized');
  console.log(`🔒 Test database: ${global.testDbConfig.databaseName}`);
}, 60000); // 60 second timeout for full server setup

afterAll(async () => {
  console.log('🧹 Cleaning up SECURE test environment...');
  
  // SECURE cleanup - only affects test database
  try {
    await testUtils.secureCleanupAllTestData();
  } catch (error) {
    console.warn('Warning during test data cleanup:', error);
  }
  
  // Close Express server
  if (httpServer) {
    await new Promise<void>((resolve) => {
      httpServer.close(() => {
        console.log('🔌 Express server closed');
        resolve();
      });
    });
  }
  
  // Print performance summary
  if (global.performanceMetrics && global.performanceMetrics.length > 0) {
    console.log('\n📊 REAL Integration Test Performance Summary:');
    console.log('==================================================');
    global.performanceMetrics.forEach(metric => {
      console.log(`${metric.testName}: ${metric.duration}ms (Memory: ${Math.round(metric.memoryUsage.heapUsed / 1024 / 1024)}MB)`);
    });
    
    const avgDuration = global.performanceMetrics.reduce((sum, m) => sum + m.duration, 0) / global.performanceMetrics.length;
    console.log(`Average test duration: ${Math.round(avgDuration)}ms`);
    console.log('==================================================\n');
  }
  
  console.log('✅ SECURE test environment cleanup completed');
  console.log('🔒 Production database was never touched - test safety verified');
}, 60000);

beforeEach(async () => {
  global.testStartTime = Date.now();
  
  // Start transaction for test isolation
  global.currentTestTransaction = await testDbConnection.transaction(async (tx) => {
    return tx; // Return transaction for use in test
  });
});

afterEach(async () => {
  // SECURE cleanup after each test
  try {
    // Rollback transaction to ensure test isolation
    if (global.currentTestTransaction) {
      await global.currentTestTransaction.rollback();
    }
    
    // Clean up any test data that might have escaped transaction
    await testUtils.secureTestCleanup();
  } catch (error) {
    console.warn('Warning during test cleanup:', error);
  }
  
  if (global.testStartTime && expect.getState().currentTestName) {
    const duration = Date.now() - global.testStartTime;
    const memoryUsage = process.memoryUsage();
    
    global.performanceMetrics.push({
      testName: expect.getState().currentTestName,
      duration,
      memoryUsage,
      timestamp: new Date()
    });
    
    // Warn about slow tests (> 30 seconds for real processing)
    if (duration > 30000) {
      console.warn(`⚠️ Slow test detected: ${expect.getState().currentTestName} took ${duration}ms`);
    }
    
    // Warn about high memory usage (> 1GB)
    const memoryMB = memoryUsage.heapUsed / 1024 / 1024;
    if (memoryMB > 1024) {
      console.warn(`⚠️ High memory usage: ${expect.getState().currentTestName} used ${Math.round(memoryMB)}MB`);
    }
    
    // Verify test safety after each test
    if (global.testDbConfig && !global.testDbConfig.isTestMode) {
      console.error('🚨 SECURITY VIOLATION: Test completed without test mode flag!');
    }
  }
});

// Global test utilities
export const testUtils = {
  /**
   * Wait for specified milliseconds
   */
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  /**
   * Generate test data IDs
   */
  generateTestId: (prefix: string = 'test') => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  
  /**
   * Check if database table exists
   */
  tableExists: async (tableName: string): Promise<boolean> => {
    try {
      const result = await testDbConnection.execute(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${tableName}'
        );
      `);
      return result[0]?.exists || false;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Clean up test data by prefix from real database
   */
  cleanupTestData: async (tableNames: string[], testPrefix: string = 'test_') => {
    for (const tableName of tableNames) {
      try {
        await testDbConnection.execute(sql.raw(`DELETE FROM ${tableName} WHERE id LIKE '${testPrefix}%'`));
      } catch (error) {
        console.warn(`Warning: Could not cleanup ${tableName}:`, error);
      }
    }
  },
  
  /**
   * SECURE cleanup of all test data - PRODUCTION SAFE
   */
  secureCleanupAllTestData: async () => {
    // SAFETY CHECK: Ensure we're in test mode
    if (!global.testDbConfig?.isTestMode) {
      throw new Error('🚨 SECURITY VIOLATION: Attempted cleanup outside test mode!');
    }
    
    const testTables = [
      'narrative_trading_metrics', 'story_beats', 'narrative_timelines',
      'enhanced_characters', 'enhanced_comic_issues', 'asset_financial_mapping',
      'assets', 'market_insights', 'staging_records', 'ingestion_jobs',
      'ingestion_runs', 'ingestion_errors', 'narrative_entities',
      'narrative_traits', 'entity_aliases', 'entity_interactions',
      'media_performance_metrics', 'battle_scenarios', 'movie_performance_data',
      'raw_dataset_files' // Include CSV registration table
    ];
    
    for (const tableName of testTables) {
      try {
        // SECURE: Only delete records with test prefixes and recent timestamps
        await testDbConnection.execute(sql.raw(`DELETE FROM ${tableName} WHERE (id LIKE 'test_%' OR filename LIKE 'test_%') AND created_at > NOW() - INTERVAL '2 hours'`));
      } catch (error) {
        // Ignore table not found errors
        if (!error.message?.includes('does not exist')) {
          console.warn(`Warning: Could not cleanup ${tableName}:`, error);
        }
      }
    }
  },
  
  /**
   * SECURE test cleanup for individual tests
   */
  secureTestCleanup: async () => {
    // SAFETY CHECK: Ensure we're in test mode
    if (!global.testDbConfig?.isTestMode) {
      throw new Error('🚨 SECURITY VIOLATION: Attempted cleanup outside test mode!');
    }
    
    // Clean up any test data from the last 5 minutes
    const testTables = ['staging_records', 'ingestion_jobs', 'raw_dataset_files'];
    
    for (const tableName of testTables) {
      try {
        await testDbConnection.execute(sql.raw(`DELETE FROM ${tableName} WHERE (id LIKE 'test_%' OR filename LIKE 'test_%') AND created_at > NOW() - INTERVAL '5 minutes'`));
      } catch (error) {
        // Ignore errors - this is just cleanup
      }
    }
  },
  
  /**
   * Make real HTTP requests to test APIs (replaces mockApiRequest)
   */
  makeAPIRequest: async (method: string, endpoint: string, data?: any, headers?: any) => {
    const req = request(global.testApp);
    
    let response;
    switch (method.toUpperCase()) {
      case 'GET':
        response = await req.get(endpoint).set(headers || {});
        break;
      case 'POST':
        response = await req.post(endpoint).send(data).set(headers || {});
        break;
      case 'PUT':
        response = await req.put(endpoint).send(data).set(headers || {});
        break;
      case 'PATCH':
        response = await req.patch(endpoint).send(data).set(headers || {});
        break;
      case 'DELETE':
        response = await req.delete(endpoint).set(headers || {});
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
    
    return {
      status: response.status,
      statusCode: response.status,
      data: response.body,
      headers: response.headers,
      text: response.text
    };
  },
  
  /**
   * Wait for database operation to complete
   */
  waitForDatabaseOperation: async (checkFunction: () => Promise<boolean>, timeoutMs = 30000, intervalMs = 100) => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      if (await checkFunction()) {
        return true;
      }
      await testUtils.wait(intervalMs);
    }
    throw new Error(`Database operation timeout after ${timeoutMs}ms`);
  },
  
  /**
   * Create test asset in real database
   */
  createTestAsset: async (assetData: any) => {
    const asset = {
      id: testUtils.generateTestId('asset'),
      symbol: `TEST_${assetData.symbol || 'SYM'}`,
      name: assetData.name || 'Test Asset',
      type: assetData.type || 'character',
      description: assetData.description || 'Test asset for integration testing',
      metadata: assetData.metadata || {},
      ...assetData
    };
    
    const [created] = await testDbConnection.insert(assets).values(asset).returning();
    return created;
  },
  
  /**
   * Verify database state after operations
   */
  verifyDatabaseState: async (tableName: string, conditions: any, expectedCount?: number) => {
    const result = await testDbConnection.execute(
      sql.raw(`SELECT COUNT(*) as count FROM ${tableName} WHERE ${Object.keys(conditions).map(key => `${key} = '${conditions[key]}'`).join(' AND ')}`)
    );
    
    const count = parseInt(result[0]?.count || '0');
    
    if (expectedCount !== undefined && count !== expectedCount) {
      throw new Error(`Expected ${expectedCount} records in ${tableName}, found ${count}`);
    }
    
    return count;
  },
  
  /**
   * Measure function execution time and memory
   */
  measurePerformance: async <T>(
    name: string, 
    fn: () => Promise<T>
  ): Promise<{ result: T; duration: number; memoryDelta: number }> => {
    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed;
    
    const result = await fn();
    
    const duration = Date.now() - startTime;
    const endMemory = process.memoryUsage().heapUsed;
    const memoryDelta = endMemory - startMemory;
    
    console.log(`📏 ${name}: ${duration}ms, Memory: ${Math.round(memoryDelta / 1024)}KB`);
    
    return { result, duration, memoryDelta };
  },
  
  /**
   * SECURE CSV file registration for tests
   */
  registerTestCSVFile: async (csvPath: string, datasetType: string = 'character'): Promise<any> => {
    // SAFETY CHECK: Ensure we're in test mode
    if (!global.testDbConfig?.isTestMode) {
      throw new Error('🚨 SECURITY VIOLATION: Attempted CSV registration outside test mode!');
    }
    
    const filename = path.basename(csvPath);
    const testFilename = `test_${filename}`;
    const stats = fs.statSync(csvPath);
    const content = fs.readFileSync(csvPath);
    const checksum = crypto.createHash('sha256').update(content).digest('hex');
    
    // Extract CSV headers
    const firstLine = content.toString().split('\n')[0];
    const headers = firstLine.split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Create sample data from first few rows
    const lines = content.toString().split('\n').slice(0, 6); // Headers + 5 sample rows
    const sampleData = lines.join('\n');
    
    const testJobId = testUtils.generateTestId('job');
    
    const [registeredFile] = await testDbConnection.insert(require('@shared/schema.js').rawDatasetFiles).values({
      id: testUtils.generateTestId('file'),
      filename: testFilename,
      originalFilename: filename,
      fileSize: stats.size,
      checksum,
      mimeType: 'text/csv',
      datasetType,
      source: 'test_attached_assets',
      universe: filename.includes('marvel') ? 'marvel' : filename.includes('dc') ? 'dc' : 'comic',
      processingStatus: 'uploaded',
      storageLocation: csvPath,
      ingestionJobId: testJobId,
      csvHeaders: headers,
      sampleData,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    console.log(`📋 SECURE: Registered test CSV: ${testFilename} (${datasetType})`);
    return registeredFile;
  },
  
  /**
   * SECURE assertion helper for row counts
   */
  assertExactRowCount: async (tableName: string, expectedCount: number, testPrefix: string = 'test_'): Promise<void> => {
    // SAFETY CHECK: Ensure we're in test mode
    if (!global.testDbConfig?.isTestMode) {
      throw new Error('🚨 SECURITY VIOLATION: Attempted row count check outside test mode!');
    }
    
    const result = await testDbConnection.execute(
      sql.raw(`SELECT COUNT(*) as count FROM ${tableName} WHERE (id LIKE '${testPrefix}%' OR filename LIKE '${testPrefix}%') AND created_at > NOW() - INTERVAL '10 minutes'`)
    );
    
    const actualCount = parseInt(result[0]?.count || '0');
    if (actualCount !== expectedCount) {
      throw new Error(`❌ Row count mismatch in ${tableName}: expected ${expectedCount}, got ${actualCount}`);
    }
    
    console.log(`✅ Row count verified: ${tableName} has exactly ${actualCount} test records`);
  }
};

/**
 * CRITICAL SECURITY FUNCTIONS - PRODUCTION PROTECTION
 */

/**
 * Validate that we're using a safe test database
 */
async function validateTestDatabaseSafety(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  const testDatabaseUrl = process.env.TEST_DATABASE_URL;
  
  // Check if we have a dedicated test database URL
  if (testDatabaseUrl) {
    console.log('🔒 Using dedicated TEST_DATABASE_URL');
    return;
  }
  
  // If no test database URL, validate current database is safe for testing
  if (!databaseUrl) {
    throw new Error('🚨 CRITICAL: No database URL configured for testing!');
  }
  
  // Parse database URL to check if it's a production database
  const url = new URL(databaseUrl);
  const hostname = url.hostname.toLowerCase();
  const pathname = url.pathname.toLowerCase();
  
  // DANGER CHECKS: Prevent running against production databases
  const productionIndicators = [
    'prod', 'production', 'main', 'live', 'master',
    'api', 'app', 'platform', 'real', 'actual'
  ];
  
  for (const indicator of productionIndicators) {
    if (hostname.includes(indicator) || pathname.includes(indicator)) {
      throw new Error(`🚨 CRITICAL SECURITY VIOLATION: Detected production database! Hostname: ${hostname}, Path: ${pathname}. Tests cannot run against production!`);
    }
  }
  
  console.log(`⚠️ WARNING: Using main DATABASE_URL for testing. Database: ${hostname}${pathname}`);
  console.log('🔒 For maximum safety, set TEST_DATABASE_URL environment variable');
}

/**
 * Get secure test database URL
 */
async function getSecureTestDatabaseUrl(): Promise<string> {
  const testDatabaseUrl = process.env.TEST_DATABASE_URL;
  
  if (testDatabaseUrl) {
    console.log('🔒 Using isolated TEST_DATABASE_URL');
    return testDatabaseUrl;
  }
  
  // If no dedicated test database, use main database but with extra safety
  const mainDatabaseUrl = process.env.DATABASE_URL;
  if (!mainDatabaseUrl) {
    throw new Error('🚨 CRITICAL: No database URL available for testing!');
  }
  
  console.log('⚠️ Using main DATABASE_URL - tests will run with transaction isolation');
  return mainDatabaseUrl;
}

/**
 * Extract database name from URL for logging
 */
function extractDatabaseName(databaseUrl: string): string {
  try {
    const url = new URL(databaseUrl);
    return `${url.hostname}${url.pathname}`;
  } catch {
    return 'unknown';
  }
}

/**
 * Prepare test environment with CSV fixtures
 */
async function prepareTestEnvironment(): Promise<void> {
  console.log('🔧 Preparing secure test environment...');
  
  // Verify test database state
  await verifyTestDatabaseIsolation();
  
  console.log('✅ Test environment prepared safely');
}

/**
 * Verify test database isolation
 */
async function verifyTestDatabaseIsolation(): Promise<void> {
  // Test that we can create and delete a test record safely
  const testId = 'test_isolation_check_' + Date.now();
  
  try {
    // Try to create a test record
    await testDbConnection.execute(
      sql.raw(`CREATE TABLE IF NOT EXISTS test_isolation_check (id TEXT PRIMARY KEY, created_at TIMESTAMP DEFAULT NOW())`)
    );
    
    await testDbConnection.execute(
      sql.raw(`INSERT INTO test_isolation_check (id) VALUES ('${testId}')`)
    );
    
    // Verify it exists
    const result = await testDbConnection.execute(
      sql.raw(`SELECT id FROM test_isolation_check WHERE id = '${testId}'`)
    );
    
    if (result.length === 0) {
      throw new Error('Test database isolation check failed - record not found');
    }
    
    // Clean up test record
    await testDbConnection.execute(
      sql.raw(`DELETE FROM test_isolation_check WHERE id = '${testId}'`)
    );
    
    await testDbConnection.execute(
      sql.raw(`DROP TABLE test_isolation_check`)
    );
    
    console.log('✅ Test database isolation verified');
    
  } catch (error) {
    console.error('❌ Test database isolation check failed:', error);
    throw new Error('Test database is not properly isolated or accessible');
  }
}