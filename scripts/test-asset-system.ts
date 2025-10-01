#!/usr/bin/env tsx

/**
 * Test Asset System - Validates ticker uniqueness and market data integrity
 */

import { db } from '../server/databaseStorage.js';
import { assets, marketData } from '../shared/schema.js';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('🧪 Testing Asset System\n');
  console.log('=' .repeat(60));

  try {
    // Test 1: Ticker Uniqueness
    console.log('\n📝 Test 1: Ticker Uniqueness');
    const tickerCount = await db.select({ count: sql<number>`count(*)` }).from(assets);
    const uniqueTickerCount = await db.select({ count: sql<number>`count(distinct symbol)` }).from(assets);
    
    const totalAssets = Number(tickerCount[0].count);
    const uniqueTickers = Number(uniqueTickerCount[0].count);
    
    console.log(`   Total assets: ${totalAssets}`);
    console.log(`   Unique tickers: ${uniqueTickers}`);
    
    if (totalAssets === uniqueTickers) {
      console.log('   ✅ All tickers are unique!');
    } else {
      console.log(`   ❌ Found ${totalAssets - uniqueTickers} duplicate tickers!`);
    }

    // Test 2: Category Distribution
    console.log('\n📝 Test 2: Category Distribution');
    const categoryDist = await db.select({ 
      type: assets.type, 
      count: sql<number>`count(*)` 
    })
    .from(assets)
    .groupBy(assets.type);

    categoryDist.forEach(cat => {
      console.log(`   ${cat.type}: ${cat.count} assets`);
    });

    // Test 3: Market Data Integrity
    console.log('\n📝 Test 3: Market Data Integrity');
    const marketDataCount = await db.select({ count: sql<number>`count(*)` }).from(marketData);
    const assetsWithMarketData = await db.select({ 
      count: sql<number>`count(distinct asset_id)` 
    }).from(marketData);

    console.log(`   Total market data bars: ${Number(marketDataCount[0].count)}`);
    console.log(`   Assets with market data: ${Number(assetsWithMarketData[0].count)}`);

    // Test 4: Seven Houses Assignment
    console.log('\n📝 Test 4: Seven Houses Assignment');
    const assignedAssets = await db.select({ 
      count: sql<number>`count(*)` 
    })
    .from(assets)
    .where(sql`house_id IS NOT NULL`);

    const assigned = Number(assignedAssets[0].count);
    const assignmentRate = ((assigned / totalAssets) * 100).toFixed(1);

    console.log(`   Assets assigned to houses: ${assigned}/${totalAssets} (${assignmentRate}%)`);

    if (assigned === totalAssets) {
      console.log('   ✅ All assets are assigned to houses!');
    } else {
      console.log(`   ⚠️ ${totalAssets - assigned} assets unassigned`);
    }

    // Test 5: Ticker Format Validation
    console.log('\n📝 Test 5: Hierarchical Ticker Format');
    const hierarchicalTickers = await db.select({ symbol: assets.symbol })
      .from(assets)
      .where(sql`symbol LIKE '%.%.%.%'`);

    const hierarchicalCount = hierarchicalTickers.length;
    const hierarchicalRate = ((hierarchicalCount / totalAssets) * 100).toFixed(1);

    console.log(`   Hierarchical format tickers: ${hierarchicalCount}/${totalAssets} (${hierarchicalRate}%)`);

    // Test 6: OHLCV Data Validation
    console.log('\n📝 Test 6: OHLCV Data Validation');
    const invalidOHLCV = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM market_data
      WHERE CAST(low AS DECIMAL) > CAST(open AS DECIMAL)
         OR CAST(low AS DECIMAL) > CAST(close AS DECIMAL)
         OR CAST(high AS DECIMAL) < CAST(open AS DECIMAL)
         OR CAST(high AS DECIMAL) < CAST(close AS DECIMAL)
    `);
    
    const invalidCount = Number(invalidOHLCV.rows[0].count);
    console.log(`   Invalid OHLCV bars: ${invalidCount}`);
    
    if (invalidCount === 0) {
      console.log('   ✅ All OHLCV data is valid (low ≤ open/close ≤ high)');
    } else {
      console.log(`   ❌ Found ${invalidCount} invalid OHLCV bars!`);
    }

    // Test 7: Technical Indicator Bounds
    console.log('\n📝 Test 7: Technical Indicator Bounds');
    const invalidRSI = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM market_data
      WHERE technical_indicators IS NOT NULL
        AND (
          CAST(technical_indicators->>'rsi' AS DECIMAL) < 0
          OR CAST(technical_indicators->>'rsi' AS DECIMAL) > 100
        )
    `);
    
    const invalidRSICount = Number(invalidRSI.rows[0].count);
    console.log(`   Invalid RSI values (out of 0-100 range): ${invalidRSICount}`);
    
    if (invalidRSICount === 0) {
      console.log('   ✅ All RSI indicators are within valid bounds');
    } else {
      console.log(`   ❌ Found ${invalidRSICount} invalid RSI values!`);
    }

    // Final Results
    console.log('\n' + '='.repeat(60));
    console.log('✨ Test Summary');
    console.log('='.repeat(60));
    console.log(`\n   Total Assets: ${totalAssets}`);
    console.log(`   Unique Tickers: ${uniqueTickers}`);
    console.log(`   Market Data Bars: ${Number(marketDataCount[0].count).toLocaleString()}`);
    console.log(`   House Assignments: ${assignmentRate}%`);
    console.log(`   Hierarchical Tickers: ${hierarchicalRate}%`);
    
    const allTestsPassed = (
      totalAssets === uniqueTickers &&
      assigned === totalAssets &&
      Number(marketDataCount[0].count) > 0 &&
      invalidCount === 0 &&
      invalidRSICount === 0
    );

    if (allTestsPassed) {
      console.log('\n✅ All tests passed!');
    } else {
      console.log('\n⚠️ Some tests failed - see above for details');
    }

    process.exit(allTestsPassed ? 0 : 1);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

main();
