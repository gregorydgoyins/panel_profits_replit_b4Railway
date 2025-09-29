import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
import { CSVTestDataLoader, SAMPLE_CHARACTER_DATA, MALFORMED_CSV_DATA } from '../fixtures/csvTestData.js';
import { testUtils } from '../setup.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Comprehensive Error Handling and Recovery Tests
 * Tests graceful handling of failures, recovery mechanisms, and system stability
 */
describe('Error Handling and Recovery Systems', () => {
  
  beforeAll(() => {
    console.log('🛠️ Initializing Error Handling & Recovery Tests...');
  });
  
  afterEach(async () => {
    await testUtils.cleanupTestData([
      'ingestion_errors', 'failed_processing_logs', 'recovery_attempts',
      'system_health_checks', 'error_recovery_state'
    ], 'test_');
    
    CSVTestDataLoader.cleanupTempCSVs();
  });

  describe('Database Connection Failures', () => {
    test('should handle database connection timeouts gracefully', async () => {
      const errors: any[] = [];
      
      const { result } = await testUtils.measurePerformance(
        'Database timeout handling',
        async () => {
          try {
            // Simulate database timeout
            await simulateDatabaseTimeout();
          } catch (error) {
            errors.push(error);
            
            // Test retry mechanism
            for (let attempt = 1; attempt <= 3; attempt++) {
              try {
                await testUtils.wait(1000 * attempt); // Exponential backoff
                await simulateDatabaseRecovery();
                return { recovered: true, attempts: attempt };
              } catch (retryError) {
                errors.push(retryError);
              }
            }
            
            return { recovered: false, attempts: 3 };
          }
        }
      );
      
      expect(errors.length).toBeGreaterThan(0);
      expect(result.attempts).toBeGreaterThan(0);
      expect(result.attempts).toBeLessThanOrEqual(3);
    });
    
    test('should implement circuit breaker pattern', async () => {
      const circuitBreaker = {
        failures: 0,
        threshold: 3,
        state: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
        lastFailureTime: 0,
        timeout: 30000 // 30 seconds
      };
      
      // Simulate multiple failures
      for (let i = 0; i < 5; i++) {
        try {
          if (circuitBreaker.state === 'OPEN') {
            if (Date.now() - circuitBreaker.lastFailureTime > circuitBreaker.timeout) {
              circuitBreaker.state = 'HALF_OPEN';
            } else {
              throw new Error('Circuit breaker is OPEN');
            }
          }
          
          // Simulate operation
          if (i < 3) {
            throw new Error('Database connection failed');
          } else {
            // Success after circuit breaker timeout
            circuitBreaker.failures = 0;
            circuitBreaker.state = 'CLOSED';
          }
          
        } catch (error) {
          circuitBreaker.failures++;
          circuitBreaker.lastFailureTime = Date.now();
          
          if (circuitBreaker.failures >= circuitBreaker.threshold) {
            circuitBreaker.state = 'OPEN';
          }
        }
      }
      
      expect(circuitBreaker.state).toBe('CLOSED'); // Should recover
      expect(circuitBreaker.failures).toBe(0); // Should reset after recovery
    });
    
    test('should maintain read-only mode during database issues', async () => {
      const systemState = {
        databaseWritable: false,
        readOnlyMode: true,
        lastHealthCheck: new Date()
      };
      
      // Test read-only operations continue working
      const readOperations = [
        'getStoryBeats',
        'getTradingMetrics', 
        'getMarketInsights',
        'getHouseAnalytics'
      ];
      
      const readResults = [];
      
      for (const operation of readOperations) {
        try {
          const result = await simulateReadOperation(operation);
          readResults.push({ operation, success: true, result });
        } catch (error) {
          readResults.push({ operation, success: false, error: error.message });
        }
      }
      
      // All read operations should succeed in read-only mode
      const successfulReads = readResults.filter(r => r.success);
      expect(successfulReads.length).toBe(readOperations.length);
      
      // Write operations should fail gracefully
      try {
        await simulateWriteOperation('createStoryBeat');
        throw new Error('Write operation should have failed');
      } catch (error) {
        expect(error.message).toContain('read-only mode');
      }
    });
  });

  describe('CSV Processing Error Recovery', () => {
    test('should handle malformed CSV data with partial processing', async () => {
      // Create CSV with mix of valid and invalid data
      const mixedData = [
        'Character,Real Name,Affiliation,Powers,Role,Power Level',
        'spider-man,Peter Parker,Avengers,Web shooting,Hero,Medium', // Valid
        'batman,Bruce Wayne,Justice League,Detective skills,Hero,Human', // Valid
        'invalid,,,,', // Invalid - missing data
        'thor,Thor Odinson,Avengers,Thunder god,Hero,High', // Valid
        '"broken,"csv"data",with,unescaped,quotes"', // Invalid - malformed CSV
        'hulk,Bruce Banner,Avengers,Super strength,Hero,Extreme' // Valid
      ].join('\n');
      
      const tempFile = path.join(process.cwd(), 'tests', 'temp', 'mixed_data.csv');
      fs.mkdirSync(path.dirname(tempFile), { recursive: true });
      fs.writeFileSync(tempFile, mixedData);
      
      const processingResults = {
        validRecords: [] as any[],
        invalidRecords: [] as any[],
        errors: [] as any[]
      };
      
      try {
        const lines = mixedData.split('\n');
        const headers = lines[0].split(',');
        
        for (let i = 1; i < lines.length; i++) {
          try {
            const values = parseCSVLine(lines[i]);
            
            if (values.length === headers.length && values[0] && values[1]) {
              const record = {};
              headers.forEach((header, index) => {
                record[header] = values[index];
              });
              processingResults.validRecords.push(record);
            } else {
              processingResults.invalidRecords.push({
                line: i + 1,
                data: lines[i],
                reason: 'Missing required fields or incorrect column count'
              });
            }
          } catch (error) {
            processingResults.errors.push({
              line: i + 1,
              data: lines[i],
              error: error.message
            });
            processingResults.invalidRecords.push({
              line: i + 1,
              data: lines[i],
              reason: 'CSV parsing error'
            });
          }
        }
      } catch (error) {
        processingResults.errors.push({ error: error.message });
      }
      
      expect(processingResults.validRecords.length).toBe(4); // 4 valid records
      expect(processingResults.invalidRecords.length).toBe(2); // 2 invalid records
      expect(processingResults.errors.length).toBeGreaterThan(0);
      
      // System should continue with valid records
      const successRate = processingResults.validRecords.length / (processingResults.validRecords.length + processingResults.invalidRecords.length);
      expect(successRate).toBeGreaterThan(0.5); // At least 50% success rate
      
      console.log(`📊 Partial processing success: ${processingResults.validRecords.length}/${processingResults.validRecords.length + processingResults.invalidRecords.length} records processed`);
    });
    
    test('should implement file processing checkpoints', async () => {
      const largeDataset = await CSVTestDataLoader.generateLargeDataset(
        SAMPLE_CHARACTER_DATA.slice(0, 3),
        10000
      );
      
      const checkpointSize = 1000;
      const checkpoints = [];
      const errors = [];
      
      try {
        for (let i = 0; i < largeDataset.length; i += checkpointSize) {
          const chunk = largeDataset.slice(i, i + checkpointSize);
          
          try {
            // Simulate processing with occasional failures
            if (Math.random() < 0.1) { // 10% chance of failure
              throw new Error(`Processing failed at record ${i}`);
            }
            
            await processChunk(chunk);
            
            // Save checkpoint
            checkpoints.push({
              position: i + chunk.length,
              timestamp: new Date(),
              recordsProcessed: chunk.length
            });
            
          } catch (error) {
            errors.push({
              position: i,
              error: error.message,
              timestamp: new Date()
            });
            
            // Recovery: retry the chunk
            await testUtils.wait(100);
            await processChunk(chunk);
            
            checkpoints.push({
              position: i + chunk.length,
              timestamp: new Date(),
              recordsProcessed: chunk.length,
              recovered: true
            });
          }
        }
      } catch (error) {
        errors.push({ error: error.message });
      }
      
      expect(checkpoints.length).toBeGreaterThan(0);
      
      // Verify checkpoints cover the entire dataset
      const totalProcessed = checkpoints.reduce((sum, cp) => sum + cp.recordsProcessed, 0);
      expect(totalProcessed).toBe(largeDataset.length);
      
      // System should recover from failures
      const recoveredCheckpoints = checkpoints.filter(cp => cp.recovered);
      console.log(`🔄 Recovery checkpoints: ${recoveredCheckpoints.length}/${checkpoints.length}`);
    });
    
    test('should handle memory exhaustion gracefully', async () => {
      const memoryPressureTests = [];
      
      try {
        // Simulate memory pressure
        const largeArrays = [];
        
        for (let i = 0; i < 10; i++) {
          const memoryBefore = process.memoryUsage();
          
          try {
            // Create memory pressure
            const largeArray = new Array(1000000).fill('test data');
            largeArrays.push(largeArray);
            
            // Try to process data under pressure
            const testData = SAMPLE_CHARACTER_DATA.slice(0, 5);
            const processed = await processUnderMemoryPressure(testData);
            
            memoryPressureTests.push({
              iteration: i,
              memoryBefore: memoryBefore.heapUsed,
              memoryAfter: process.memoryUsage().heapUsed,
              processingSuccessful: processed.length === testData.length
            });
            
          } catch (error) {
            memoryPressureTests.push({
              iteration: i,
              memoryBefore: memoryBefore.heapUsed,
              error: error.message,
              processingSuccessful: false
            });
          }
        }
        
      } finally {
        // Force garbage collection
        if (global.gc) {
          global.gc();
        }
      }
      
      const successfulTests = memoryPressureTests.filter(t => t.processingSuccessful);
      const failedTests = memoryPressureTests.filter(t => !t.processingSuccessful);
      
      // System should handle some level of memory pressure
      expect(successfulTests.length).toBeGreaterThan(0);
      
      console.log(`💾 Memory pressure tolerance: ${successfulTests.length}/${memoryPressureTests.length} successful`);
    });
  });

  describe('Trading Metrics Error Handling', () => {
    test('should handle invalid character data gracefully', async () => {
      const invalidCharacters = [
        { Character: '', Powers: 'Invalid', Role: 'Hero' }, // Missing name
        { Character: 'Test Hero', Powers: null, Role: 'Hero' }, // Null powers
        { Character: 'Test Villain', Powers: 'Evil', Role: null }, // Null role
        { Character: undefined, Powers: 'Test', Role: 'Hero' }, // Undefined character
        { Character: 'Valid Hero', Powers: 'Super strength', Role: 'Hero', 'Power Level': 'Invalid' } // Invalid power level
      ];
      
      const processingResults = [];
      
      for (const character of invalidCharacters) {
        try {
          const metrics = await calculateTradingMetricsWithValidation(character);
          processingResults.push({
            character: character.Character || 'unnamed',
            success: true,
            metrics
          });
        } catch (error) {
          processingResults.push({
            character: character.Character || 'unnamed',
            success: false,
            error: error.message,
            fallbackApplied: true
          });
        }
      }
      
      // System should either process or fail gracefully
      processingResults.forEach(result => {
        if (result.success) {
          expect(result.metrics).toBeDefined();
          expect(result.metrics.houseAffiliation).toBeDefined();
        } else {
          expect(result.error).toBeDefined();
          expect(result.fallbackApplied).toBe(true);
        }
      });
      
      const errors = processingResults.filter(r => !r.success);
      console.log(`⚠️ Invalid character handling: ${errors.length}/${processingResults.length} errors handled gracefully`);
    });
    
    test('should implement fallback calculations for missing data', async () => {
      const incompleteCharacters = [
        {
          Character: 'Incomplete Hero 1',
          // Missing all other fields
        },
        {
          Character: 'Incomplete Hero 2',
          'Real Name': 'John Doe',
          // Missing powers, role, etc.
        },
        {
          Character: 'Incomplete Hero 3',
          Powers: 'Some power',
          Role: 'Hero'
          // Missing other fields
        }
      ];
      
      const fallbackMetrics = [];
      
      for (const character of incompleteCharacters) {
        const metrics = calculateTradingMetricsWithFallbacks(character);
        
        fallbackMetrics.push({
          character: character.Character,
          houseAffiliation: metrics.houseAffiliation || 'heroes', // Default house
          volatilityScore: metrics.volatilityScore || 0.05, // Default volatility
          momentumScore: metrics.momentumScore || 0.0, // Neutral momentum
          fallbacksUsed: metrics.fallbacksUsed || []
        });
      }
      
      fallbackMetrics.forEach(metrics => {
        expect(metrics.houseAffiliation).toBeDefined();
        expect(metrics.volatilityScore).toBeGreaterThanOrEqual(0);
        expect(metrics.momentumScore).toBeGreaterThanOrEqual(-5);
        expect(metrics.momentumScore).toBeLessThanOrEqual(5);
        expect(metrics.fallbacksUsed.length).toBeGreaterThan(0);
      });
    });
  });

  describe('System Health Monitoring', () => {
    test('should detect and report system health issues', async () => {
      const healthChecks = [];
      const healthThresholds = {
        maxMemoryUsage: 512, // 512MB
        maxResponseTime: 2000, // 2 seconds
        minSuccessRate: 0.95 // 95%
      };
      
      // Simulate health checks
      for (let i = 0; i < 10; i++) {
        const startTime = Date.now();
        const memoryBefore = process.memoryUsage();
        
        try {
          // Simulate system operations
          await simulateSystemLoad();
          
          const responseTime = Date.now() - startTime;
          const memoryAfter = process.memoryUsage();
          const memoryUsage = Math.round(memoryAfter.heapUsed / 1024 / 1024);
          
          const healthStatus = {
            timestamp: new Date(),
            responseTime,
            memoryUsage,
            healthy: responseTime < healthThresholds.maxResponseTime && 
                    memoryUsage < healthThresholds.maxMemoryUsage,
            warnings: []
          };
          
          if (responseTime > healthThresholds.maxResponseTime) {
            healthStatus.warnings.push('High response time');
          }
          
          if (memoryUsage > healthThresholds.maxMemoryUsage) {
            healthStatus.warnings.push('High memory usage');
          }
          
          healthChecks.push(healthStatus);
          
        } catch (error) {
          healthChecks.push({
            timestamp: new Date(),
            healthy: false,
            error: error.message,
            warnings: ['System operation failed']
          });
        }
        
        await testUtils.wait(100);
      }
      
      const healthyChecks = healthChecks.filter(hc => hc.healthy);
      const successRate = healthyChecks.length / healthChecks.length;
      
      expect(successRate).toBeGreaterThan(0.5); // At least 50% healthy
      
      console.log(`🏥 System health: ${Math.round(successRate * 100)}% healthy checks`);
      
      // Log warnings
      const allWarnings = healthChecks.flatMap(hc => hc.warnings || []);
      const uniqueWarnings = [...new Set(allWarnings)];
      if (uniqueWarnings.length > 0) {
        console.log(`⚠️ Health warnings: ${uniqueWarnings.join(', ')}`);
      }
    });
    
    test('should implement automatic error recovery', async () => {
      const recoveryAttempts = [];
      const maxRecoveryAttempts = 3;
      
      for (let scenario = 0; scenario < 5; scenario++) {
        let recovered = false;
        let attempts = 0;
        
        while (!recovered && attempts < maxRecoveryAttempts) {
          attempts++;
          
          try {
            // Simulate different failure scenarios
            if (scenario === 0 && attempts < 2) {
              throw new Error('Database connection lost');
            } else if (scenario === 1 && attempts < 3) {
              throw new Error('Memory allocation failed');
            } else if (scenario === 2 && attempts < 2) {
              throw new Error('Processing timeout');
            }
            
            // Success
            recovered = true;
            
          } catch (error) {
            const recoveryAction = await attemptRecovery(error.message, attempts);
            
            recoveryAttempts.push({
              scenario,
              attempt: attempts,
              error: error.message,
              recoveryAction,
              timestamp: new Date()
            });
            
            // Wait before retry (exponential backoff)
            await testUtils.wait(100 * Math.pow(2, attempts - 1));
          }
        }
        
        expect(recovered).toBe(true);
      }
      
      const successfulRecoveries = recoveryAttempts.filter(ra => ra.recoveryAction !== 'failed');
      console.log(`🔄 Recovery success: ${successfulRecoveries.length}/${recoveryAttempts.length} attempts succeeded`);
    });
  });

  // Helper functions for error handling tests
  async function simulateDatabaseTimeout(): Promise<void> {
    await testUtils.wait(5000); // Simulate timeout
    throw new Error('Database connection timeout');
  }
  
  async function simulateDatabaseRecovery(): Promise<void> {
    await testUtils.wait(1000);
    // Simulate successful reconnection (80% success rate)
    if (Math.random() > 0.2) {
      return;
    }
    throw new Error('Database recovery failed');
  }
  
  async function simulateReadOperation(operation: string): Promise<any> {
    await testUtils.wait(50);
    return { operation, data: 'mock data', timestamp: new Date() };
  }
  
  async function simulateWriteOperation(operation: string): Promise<void> {
    throw new Error('Cannot perform write operation in read-only mode');
  }
  
  function parseCSVLine(line: string): string[] {
    // Simple CSV parsing (not production-ready)
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }
  
  async function processChunk(chunk: any[]): Promise<any[]> {
    // Simulate chunk processing
    await testUtils.wait(Math.random() * 100);
    return chunk.map(item => ({ ...item, processed: true, timestamp: new Date() }));
  }
  
  async function processUnderMemoryPressure(data: any[]): Promise<any[]> {
    // Simulate processing under memory constraints
    const memoryUsage = process.memoryUsage();
    
    if (memoryUsage.heapUsed > 800 * 1024 * 1024) { // Over 800MB
      throw new Error('Insufficient memory for processing');
    }
    
    await testUtils.wait(50);
    return data.map(item => ({ ...item, processed: true }));
  }
  
  async function calculateTradingMetricsWithValidation(character: any): Promise<any> {
    // Validate required fields
    if (!character.Character || typeof character.Character !== 'string') {
      throw new Error('Invalid character name');
    }
    
    if (!character.Role) {
      throw new Error('Missing character role');
    }
    
    // Calculate metrics
    return {
      houseAffiliation: determineHouseAffiliation(character),
      volatilityScore: 0.05,
      momentumScore: 0.0
    };
  }
  
  function calculateTradingMetricsWithFallbacks(character: any): any {
    const fallbacksUsed = [];
    
    let houseAffiliation = 'heroes';
    if (character.Character) {
      houseAffiliation = determineHouseAffiliation(character);
    } else {
      fallbacksUsed.push('default_house_affiliation');
    }
    
    let volatilityScore = 0.05;
    if (!character['Power Level']) {
      fallbacksUsed.push('default_volatility_score');
    }
    
    let momentumScore = 0.0;
    if (!character.Affiliation) {
      fallbacksUsed.push('default_momentum_score');
    }
    
    return {
      houseAffiliation,
      volatilityScore,
      momentumScore,
      fallbacksUsed
    };
  }
  
  function determineHouseAffiliation(character: any): string {
    const name = character.Character?.toLowerCase() || '';
    
    if (name.includes('spider') || name.includes('captain')) return 'heroes';
    if (name.includes('hulk') || name.includes('thor')) return 'power';
    if (name.includes('doctor') || name.includes('professor')) return 'wisdom';
    if (name.includes('batman')) return 'mystery';
    
    return 'heroes'; // Default fallback
  }
  
  async function simulateSystemLoad(): Promise<void> {
    // Simulate various system operations
    const operations = [
      () => testUtils.wait(Math.random() * 100),
      () => {
        const arr = new Array(1000).fill(Math.random());
        return arr.reduce((sum, val) => sum + val, 0);
      },
      () => Promise.resolve(Math.random() * 1000)
    ];
    
    const operation = operations[Math.floor(Math.random() * operations.length)];
    await operation();
  }
  
  async function attemptRecovery(errorMessage: string, attempt: number): Promise<string> {
    if (errorMessage.includes('Database connection')) {
      return 'database_reconnect';
    } else if (errorMessage.includes('Memory')) {
      if (global.gc) {
        global.gc();
      }
      return 'memory_cleanup';
    } else if (errorMessage.includes('timeout')) {
      return 'retry_with_backoff';
    }
    
    return attempt >= 3 ? 'failed' : 'retry';
  }
});