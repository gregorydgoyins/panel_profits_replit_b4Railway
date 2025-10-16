"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetGrowthMetrics = getAssetGrowthMetrics;
exports.logGrowthSnapshot = logGrowthSnapshot;
const databaseStorage_1 = require("../databaseStorage");
const drizzle_orm_1 = require("drizzle-orm");
async function getAssetGrowthMetrics() {
    const result = await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `
    SELECT 
      (SELECT COUNT(*) FROM assets WHERE created_at >= NOW() - INTERVAL '1 hour') as assets_last_hour,
      (SELECT COUNT(*) FROM assets WHERE created_at >= NOW() - INTERVAL '1 day') as assets_last_day,
      (SELECT COUNT(*) FROM assets WHERE cover_image_url IS NOT NULL AND updated_at >= NOW() - INTERVAL '1 hour') as covers_last_hour,
      (SELECT COUNT(*) FROM assets WHERE cover_image_url IS NOT NULL AND updated_at >= NOW() - INTERVAL '1 day') as covers_last_day,
      (SELECT COUNT(*) FROM asset_current_prices WHERE updated_at >= NOW() - INTERVAL '1 hour') as prices_last_hour,
      (SELECT COUNT(*) FROM asset_current_prices WHERE updated_at >= NOW() - INTERVAL '1 day') as prices_last_day,
      NOW() as timestamp
  `);
    const metrics = result.rows[0];
    return {
        assetsLastHour: Number(metrics.assets_last_hour) || 0,
        assetsLastDay: Number(metrics.assets_last_day) || 0,
        coversLastHour: Number(metrics.covers_last_hour) || 0,
        coversLastDay: Number(metrics.covers_last_day) || 0,
        pricesLastHour: Number(metrics.prices_last_hour) || 0,
        pricesLastDay: Number(metrics.prices_last_day) || 0,
        timestamp: new Date()
    };
}
async function logGrowthSnapshot() {
    const metrics = await getAssetGrowthMetrics();
    console.log('\n📊 ASSET GROWTH METRICS:');
    console.log(`   🆕 Assets (1h): ${metrics.assetsLastHour} | (24h): ${metrics.assetsLastDay}`);
    console.log(`   🖼️  Covers (1h): ${metrics.coversLastHour} | (24h): ${metrics.coversLastDay}`);
    console.log(`   💰 Prices (1h): ${metrics.pricesLastHour} | (24h): ${metrics.pricesLastDay}`);
}
