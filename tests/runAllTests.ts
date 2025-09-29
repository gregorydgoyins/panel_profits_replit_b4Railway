import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Comprehensive Test Suite Runner for Phase 2 CSV Ingestion Pipeline
 * Runs all test suites and generates comprehensive reports
 */
async function main() {
  console.log('🚀 Starting Phase 2 CSV Ingestion Pipeline Test Suite...\n');
  
  const startTime = Date.now();
  const testResults = {
    suites: [] as any[],
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    skippedTests: 0,
    totalDuration: 0,
    memoryUsage: {
      peak: 0,
      average: 0
    }
  };
  
  // List of test suites to run
  const testSuites = [
    {
      name: 'CSV Ingestion Unit Tests',
      path: 'tests/unit/csvIngestionOrchestrator.test.ts',
      category: 'unit',
      timeout: 120000 // 2 minutes
    },
    {
      name: 'Narrative Pipeline Integration Tests',
      path: 'tests/integration/narrativePipeline.test.ts', 
      category: 'integration',
      timeout: 300000 // 5 minutes
    },
    {
      name: 'Trading Metrics Integration Tests',
      path: 'tests/integration/tradingMetrics.test.ts',
      category: 'integration', 
      timeout: 180000 // 3 minutes
    },
    {
      name: 'API Endpoints Tests',
      path: 'tests/integration/apiEndpoints.test.ts',
      category: 'integration',
      timeout: 240000 // 4 minutes
    },
    {
      name: 'Error Handling & Recovery Tests',
      path: 'tests/integration/errorHandling.test.ts',
      category: 'integration',
      timeout: 300000 // 5 minutes
    },
    {
      name: 'Data Quality & Validation Tests',
      path: 'tests/integration/dataQualityValidation.test.ts',
      category: 'integration',
      timeout: 180000 // 3 minutes
    },
    {
      name: 'Production Scale Load Tests',
      path: 'tests/load/productionScaleLoad.test.ts',
      category: 'load',
      timeout: 600000 // 10 minutes
    }
  ];
  
  console.log(`📋 Test Suite Overview:`);
  console.log(`- Total test suites: ${testSuites.length}`);
  console.log(`- Unit tests: ${testSuites.filter(s => s.category === 'unit').length}`);
  console.log(`- Integration tests: ${testSuites.filter(s => s.category === 'integration').length}`);
  console.log(`- Load tests: ${testSuites.filter(s => s.category === 'load').length}`);
  console.log('');
  
  // Run each test suite
  for (const suite of testSuites) {
    console.log(`🔄 Running: ${suite.name}...`);
    
    const suiteStartTime = Date.now();
    const memoryBefore = process.memoryUsage();
    
    try {
      // Run Jest test for this specific file
      const command = `npx jest ${suite.path} --verbose --no-cache --testTimeout=${suite.timeout}`;
      const output = execSync(command, { 
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large outputs
      });
      
      const duration = Date.now() - suiteStartTime;
      const memoryAfter = process.memoryUsage();
      const memoryDelta = Math.round((memoryAfter.heapUsed - memoryBefore.heapUsed) / 1024 / 1024);
      
      // Parse Jest output for test statistics
      const testStats = parseJestOutput(output);
      
      const suiteResult = {
        name: suite.name,
        category: suite.category,
        status: 'passed',
        duration,
        memoryDelta,
        tests: testStats.tests,
        passed: testStats.passed,
        failed: testStats.failed,
        skipped: testStats.skipped,
        output: output.split('\n').slice(-20).join('\n') // Last 20 lines
      };
      
      testResults.suites.push(suiteResult);
      testResults.totalTests += testStats.tests;
      testResults.passedTests += testStats.passed;
      testResults.failedTests += testStats.failed;
      testResults.skippedTests += testStats.skipped;
      
      console.log(`✅ ${suite.name}: ${testStats.passed}/${testStats.tests} passed (${duration}ms, ${memoryDelta}MB)`);
      
    } catch (error) {
      const duration = Date.now() - suiteStartTime;
      const errorMessage = error.toString();
      
      const suiteResult = {
        name: suite.name,
        category: suite.category,
        status: 'failed',
        duration,
        error: errorMessage,
        tests: 0,
        passed: 0,
        failed: 1,
        skipped: 0
      };
      
      testResults.suites.push(suiteResult);
      testResults.totalTests += 1;
      testResults.failedTests += 1;
      
      console.log(`❌ ${suite.name}: FAILED (${duration}ms)`);
      console.log(`   Error: ${errorMessage.split('\n')[0]}`);
    }
    
    // Small delay between suites to allow cleanup
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('');
  }
  
  const totalDuration = Date.now() - startTime;
  testResults.totalDuration = totalDuration;
  
  // Generate comprehensive test report
  generateTestReport(testResults);
  
  // Print summary
  console.log('📊 Test Suite Summary:');
  console.log('='.repeat(50));
  console.log(`Total Duration: ${Math.round(totalDuration / 1000)}s`);
  console.log(`Total Tests: ${testResults.totalTests}`);
  console.log(`Passed: ${testResults.passedTests} ✅`);
  console.log(`Failed: ${testResults.failedTests} ❌`);
  console.log(`Skipped: ${testResults.skippedTests} ⏭️`);
  console.log(`Success Rate: ${Math.round((testResults.passedTests / testResults.totalTests) * 100)}%`);
  console.log('');
  
  // Category breakdown
  const categories = ['unit', 'integration', 'load'];
  categories.forEach(category => {
    const categorySuites = testResults.suites.filter(s => s.category === category);
    const categoryPassed = categorySuites.reduce((sum, s) => sum + s.passed, 0);
    const categoryTotal = categorySuites.reduce((sum, s) => sum + s.tests, 0);
    
    if (categoryTotal > 0) {
      console.log(`${category.charAt(0).toUpperCase() + category.slice(1)} Tests: ${categoryPassed}/${categoryTotal} (${Math.round((categoryPassed / categoryTotal) * 100)}%)`);
    }
  });
  
  console.log('');
  
  // Performance insights
  const avgDuration = testResults.suites.reduce((sum, s) => sum + s.duration, 0) / testResults.suites.length;
  const slowestSuite = testResults.suites.reduce((prev, current) => 
    prev.duration > current.duration ? prev : current
  );
  
  console.log('⚡ Performance Insights:');
  console.log(`Average suite duration: ${Math.round(avgDuration)}ms`);
  console.log(`Slowest suite: ${slowestSuite.name} (${Math.round(slowestSuite.duration / 1000)}s)`);
  
  // Memory insights
  const memoryDeltas = testResults.suites.map(s => s.memoryDelta).filter(d => d !== undefined);
  if (memoryDeltas.length > 0) {
    const avgMemory = memoryDeltas.reduce((sum, d) => sum + d, 0) / memoryDeltas.length;
    const maxMemory = Math.max(...memoryDeltas);
    
    console.log(`Average memory usage: ${Math.round(avgMemory)}MB per suite`);
    console.log(`Peak memory usage: ${maxMemory}MB`);
  }
  
  console.log('');
  
  // Failed tests details
  const failedSuites = testResults.suites.filter(s => s.status === 'failed' || s.failed > 0);
  if (failedSuites.length > 0) {
    console.log('⚠️ Failed Test Details:');
    failedSuites.forEach(suite => {
      console.log(`- ${suite.name}: ${suite.failed} failed tests`);
      if (suite.error) {
        console.log(`  Error: ${suite.error.split('\n')[0]}`);
      }
    });
    console.log('');
  }
  
  // Final verdict
  const successRate = testResults.passedTests / testResults.totalTests;
  if (successRate >= 0.95) {
    console.log('🎉 EXCELLENT: Test suite passed with 95%+ success rate!');
    console.log('Phase 2 CSV ingestion pipeline is production-ready.');
  } else if (successRate >= 0.85) {
    console.log('✅ GOOD: Test suite passed with 85%+ success rate.');
    console.log('Phase 2 pipeline is mostly ready, address failing tests for production.');
  } else if (successRate >= 0.70) {
    console.log('⚠️ NEEDS WORK: Test suite has concerning failure rate.');
    console.log('Significant issues need to be addressed before production deployment.');
  } else {
    console.log('❌ CRITICAL: Test suite has high failure rate.');
    console.log('Pipeline is not ready for production. Immediate fixes required.');
  }
  
  // Exit with appropriate code
  process.exit(successRate >= 0.95 ? 0 : successRate >= 0.85 ? 1 : 2);
}

function parseJestOutput(output: string): { tests: number; passed: number; failed: number; skipped: number } {
  const lines = output.split('\n');
  
  // Look for Jest summary line
  let tests = 0, passed = 0, failed = 0, skipped = 0;
  
  for (const line of lines) {
    // Match lines like: "Tests:       5 passed, 5 total"
    const testMatch = line.match(/Tests:\\s+(\\d+)\\s+passed.*?(\\d+)\\s+total/);
    if (testMatch) {
      passed = parseInt(testMatch[1]);
      tests = parseInt(testMatch[2]);
      failed = tests - passed;
      break;
    }
    
    // Alternative format: "Tests:       2 failed, 3 passed, 5 total"
    const testMatch2 = line.match(/Tests:\\s+(?:(\\d+)\\s+failed,\\s*)?(\\d+)\\s+passed.*?(\\d+)\\s+total/);
    if (testMatch2) {
      failed = testMatch2[1] ? parseInt(testMatch2[1]) : 0;
      passed = parseInt(testMatch2[2]);
      tests = parseInt(testMatch2[3]);
      break;
    }
    
    // Match individual test results
    if (line.includes('✓') || line.includes('PASS')) {
      passed++;
      tests++;
    } else if (line.includes('✗') || line.includes('FAIL')) {
      failed++;
      tests++;
    } else if (line.includes('○') || line.includes('SKIP')) {
      skipped++;
      tests++;
    }
  }
  
  return { tests, passed, failed, skipped };
}

function generateTestReport(results: any): void {
  const reportDir = path.join(process.cwd(), 'test-reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  // Generate detailed JSON report
  const jsonReport = {
    ...results,
    timestamp: new Date().toISOString(),
    environment: {
      node: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      cpu: require('os').cpus().length
    }
  };
  
  fs.writeFileSync(
    path.join(reportDir, 'test-results.json'),
    JSON.stringify(jsonReport, null, 2)
  );
  
  // Generate HTML report
  const htmlReport = generateHTMLReport(jsonReport);
  fs.writeFileSync(
    path.join(reportDir, 'test-report.html'),
    htmlReport
  );
  
  console.log(`📄 Test reports generated in: ${reportDir}`);
}

function generateHTMLReport(results: any): string {
  const successRate = Math.round((results.passedTests / results.totalTests) * 100);
  const statusColor = successRate >= 95 ? '#4CAF50' : successRate >= 85 ? '#FF9800' : '#F44336';
  
  return `
<!DOCTYPE html>
<html>
<head>
    <title>Phase 2 CSV Ingestion Pipeline - Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: ${statusColor}; color: white; padding: 20px; border-radius: 5px; }
        .summary { display: flex; gap: 20px; margin: 20px 0; }
        .metric { background: #f5f5f5; padding: 15px; border-radius: 5px; flex: 1; text-align: center; }
        .suite { margin: 10px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .passed { border-left: 5px solid #4CAF50; }
        .failed { border-left: 5px solid #F44336; }
        .category { font-weight: bold; color: #666; text-transform: uppercase; font-size: 0.8em; }
        .duration { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Phase 2 CSV Ingestion Pipeline Test Report</h1>
        <p>Success Rate: ${successRate}% | Generated: ${new Date(results.timestamp).toLocaleString()}</p>
    </div>
    
    <div class="summary">
        <div class="metric">
            <h3>${results.totalTests}</h3>
            <p>Total Tests</p>
        </div>
        <div class="metric">
            <h3 style="color: #4CAF50">${results.passedTests}</h3>
            <p>Passed</p>
        </div>
        <div class="metric">
            <h3 style="color: #F44336">${results.failedTests}</h3>
            <p>Failed</p>
        </div>
        <div class="metric">
            <h3>${Math.round(results.totalDuration / 1000)}s</h3>
            <p>Total Duration</p>
        </div>
    </div>
    
    <h2>Test Suites</h2>
    ${results.suites.map(suite => `
        <div class="suite ${suite.failed > 0 || suite.status === 'failed' ? 'failed' : 'passed'}">
            <div class="category">${suite.category}</div>
            <h3>${suite.name}</h3>
            <p>${suite.passed}/${suite.tests} tests passed</p>
            <div class="duration">Duration: ${suite.duration}ms | Memory: ${suite.memoryDelta || 0}MB</div>
            ${suite.error ? `<p style="color: #F44336; font-family: monospace;">${suite.error}</p>` : ''}
        </div>
    `).join('')}
    
    <h2>Environment</h2>
    <pre>${JSON.stringify(results.environment, null, 2)}</pre>
</body>
</html>
  `;
}

// Run the test suite if this file is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

export { main as runAllTests };