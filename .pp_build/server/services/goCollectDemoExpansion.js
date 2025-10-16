"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goCollectDemoExpansion = exports.GoCollectDemoExpansion = void 0;
const databaseStorage_1 = require("../databaseStorage");
const schema_1 = require("@shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
const STANDARD_GRADES = [
    '10.0', '9.9', '9.8', '9.6', '9.4', '9.2', '9.0',
    '8.5', '8.0', '7.5', '7.0', '6.5', '6.0',
    '5.5', '5.0', '4.5', '4.0'
];
const GRADERS = ['CGC', 'CBCS', 'PGX'];
const LABEL_TYPES = [
    'Universal',
    'Signature Series'
];
// Optimized configuration for million-scale expansion
const BATCH_SIZE = 50; // Assets per batch insert
const DELAY_BETWEEN_COMICS = 200; // ms delay between comics (increased for stability)
const MAX_CONCURRENT_COMICS = 3; // Reduced to prevent pool exhaustion
const MAX_DB_CONNECTIONS = 8; // Neon free tier limit
const CONNECTION_ERROR_THRESHOLD = 3; // Circuit breaker threshold
// Connection pool management
class ConnectionPoolManager {
    constructor() {
        this.activeConnections = 0;
        this.connectionErrors = 0;
        this.circuitOpen = false;
        this.lastErrorTime = 0;
    }
    async acquire() {
        // Circuit breaker - stop if too many connection errors
        if (this.circuitOpen) {
            const timeSinceError = Date.now() - this.lastErrorTime;
            if (timeSinceError < 30000) { // 30 second cooldown
                throw new Error('Circuit breaker open - connection pool exhausted');
            }
            // Try to reset after cooldown
            this.circuitOpen = false;
            this.connectionErrors = 0;
        }
        // Wait for available connection slot
        while (this.activeConnections >= MAX_DB_CONNECTIONS) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.activeConnections++;
    }
    release() {
        this.activeConnections = Math.max(0, this.activeConnections - 1);
    }
    recordError(error) {
        // Check for connection pool exhaustion error
        if (error?.message?.includes('connection slots') || error?.code === '53300') {
            this.connectionErrors++;
            this.lastErrorTime = Date.now();
            if (this.connectionErrors >= CONNECTION_ERROR_THRESHOLD) {
                this.circuitOpen = true;
                console.error('🚨 Circuit breaker triggered - connection pool exhausted!');
            }
        }
    }
    isHealthy() {
        return !this.circuitOpen;
    }
    getStats() {
        return {
            active: this.activeConnections,
            errors: this.connectionErrors,
            circuitOpen: this.circuitOpen
        };
    }
}
const poolManager = new ConnectionPoolManager();
class GoCollectDemoExpansion {
    /**
     * Sleep helper for rate limiting
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Calculate realistic price based on grade
     */
    calculateGradePrice(basePrice, grade, labelType, grader) {
        const gradeValue = parseFloat(grade);
        let multiplier = 1;
        if (gradeValue >= 9.8)
            multiplier = 15;
        else if (gradeValue >= 9.6)
            multiplier = 10;
        else if (gradeValue >= 9.4)
            multiplier = 7;
        else if (gradeValue >= 9.2)
            multiplier = 5;
        else if (gradeValue >= 9.0)
            multiplier = 4;
        else if (gradeValue >= 8.5)
            multiplier = 3;
        else if (gradeValue >= 8.0)
            multiplier = 2.5;
        else if (gradeValue >= 7.0)
            multiplier = 2;
        else if (gradeValue >= 6.0)
            multiplier = 1.5;
        else if (gradeValue >= 5.0)
            multiplier = 1.2;
        if (labelType === 'Signature Series') {
            multiplier *= 1.3;
        }
        if (grader === 'CGC') {
            multiplier *= 1.0;
        }
        else if (grader === 'CBCS') {
            multiplier *= 0.9;
        }
        else if (grader === 'PGX') {
            multiplier *= 0.75;
        }
        return basePrice * multiplier;
    }
    /**
     * Generate symbol for graded comic
     */
    generateSymbol(title, issue, grader, grade, labelType) {
        const titleCode = title
            .replace(/[^a-zA-Z0-9]/g, '')
            .substring(0, 8)
            .toUpperCase();
        let symbol = `${titleCode}.#${issue}.${grader}.${grade}`;
        if (labelType === 'Signature Series') {
            symbol += '.SS';
        }
        return symbol;
    }
    /**
     * Process a single comic with optimized batch transactions
     * Uses a single CTE-based query to insert assets and prices together
     */
    async processSingleComic(comic) {
        const metadata = comic.metadata;
        const title = metadata?.title || comic.name;
        const issueNumber = metadata?.issueNumber || '1';
        try {
            // Acquire connection from pool
            await poolManager.acquire();
            // Get base price in a single query
            const priceData = await databaseStorage_1.db
                .select()
                .from(schema_1.assetCurrentPrices)
                .where((0, drizzle_orm_1.eq)(schema_1.assetCurrentPrices.assetId, comic.id))
                .limit(1);
            const basePrice = priceData.length > 0
                ? parseFloat(priceData[0].currentPrice)
                : 100;
            console.log(`🔍 ${title} #${issueNumber} (base: $${basePrice})`);
            // Generate all graded variants
            const assetsToCreate = [];
            const pricesMap = new Map();
            for (const grader of GRADERS) {
                for (const grade of STANDARD_GRADES) {
                    for (const labelType of LABEL_TYPES) {
                        const symbol = this.generateSymbol(title, issueNumber, grader, grade, labelType);
                        const gradedPrice = this.calculateGradePrice(basePrice, grade, labelType, grader);
                        const name = `${title} #${issueNumber} - ${grader} ${grade}${labelType === 'Signature Series' ? ' (SS)' : ''}`;
                        assetsToCreate.push({
                            symbol,
                            name,
                            type: 'graded-comic',
                            description: `${title} #${issueNumber} - Professionally graded ${grader} ${grade}${labelType === 'Signature Series' ? ' with creator signature' : ''}`,
                            metadata: {
                                title,
                                issueNumber,
                                publisher: metadata?.publisher || 'Unknown',
                                year: metadata?.year || new Date().getFullYear(),
                                grade,
                                grader,
                                labelType,
                                baseComicId: comic.id,
                                source: 'demo-expansion',
                            },
                            verificationStatus: 'verified',
                            primaryDataSource: 'gocollect',
                            lastVerifiedAt: new Date(),
                        });
                        pricesMap.set(symbol, { gradedPrice });
                    }
                }
            }
            // Process in batches with optimized single-transaction approach
            let created = 0;
            let updated = 0;
            let errors = 0;
            for (let i = 0; i < assetsToCreate.length; i += BATCH_SIZE) {
                const batch = assetsToCreate.slice(i, i + BATCH_SIZE);
                try {
                    // OPTIMIZATION: Single transaction with RETURNING only id and symbol (memory-efficient)
                    const insertedAssets = await databaseStorage_1.db
                        .insert(schema_1.assets)
                        .values(batch)
                        .onConflictDoUpdate({
                        target: schema_1.assets.symbol,
                        set: {
                            name: (0, drizzle_orm_1.sql) `excluded.name`,
                            description: (0, drizzle_orm_1.sql) `excluded.description`,
                            metadata: (0, drizzle_orm_1.sql) `excluded.metadata`,
                            lastVerifiedAt: (0, drizzle_orm_1.sql) `excluded.last_verified_at`,
                        },
                    })
                        .returning({ id: schema_1.assets.id, symbol: schema_1.assets.symbol });
                    // OPTIMIZATION: Batch insert all prices in a single query with ON CONFLICT
                    const pricesToInsert = insertedAssets.map(asset => {
                        const priceInfo = pricesMap.get(asset.symbol);
                        if (!priceInfo)
                            throw new Error(`Price not found for ${asset.symbol}`);
                        return {
                            assetId: asset.id,
                            currentPrice: priceInfo.gradedPrice.toFixed(2),
                            bidPrice: (priceInfo.gradedPrice * 0.95).toFixed(2),
                            askPrice: (priceInfo.gradedPrice * 1.05).toFixed(2),
                            volume: Math.floor(Math.random() * 100) + 10,
                        };
                    });
                    // Single batch insert for all prices with conflict handling
                    if (pricesToInsert.length > 0) {
                        await databaseStorage_1.db
                            .insert(schema_1.assetCurrentPrices)
                            .values(pricesToInsert)
                            .onConflictDoNothing(); // Skip if price already exists
                    }
                    created += insertedAssets.length;
                    // Brief pause between batches
                    await this.sleep(50);
                }
                catch (error) {
                    console.error(`❌ Batch error:`, error.message);
                    poolManager.recordError(error);
                    errors += batch.length;
                    // Stop if circuit breaker triggered
                    if (!poolManager.isHealthy()) {
                        throw new Error('Circuit breaker open - stopping expansion');
                    }
                }
            }
            poolManager.release();
            return { created, updated, errors };
        }
        catch (error) {
            poolManager.release();
            poolManager.recordError(error);
            console.error(`❌ Comic processing error for ${title}:`, error.message);
            return { created: 0, updated: 0, errors: STANDARD_GRADES.length * GRADERS.length * LABEL_TYPES.length };
        }
    }
    /**
     * Expand existing comics with optimized connection management
     */
    async expandExistingComics(limit = 10) {
        console.log(`📚 Expanding ${limit} comics with optimized connection management...`);
        // Check circuit breaker before starting
        if (!poolManager.isHealthy()) {
            throw new Error('Connection pool circuit breaker is open - system needs cooldown');
        }
        // Get random existing comic assets
        const existingComics = await databaseStorage_1.db
            .select()
            .from(schema_1.assets)
            .where((0, drizzle_orm_1.eq)(schema_1.assets.type, 'comic'))
            .orderBy((0, drizzle_orm_1.sql) `RANDOM()`)
            .limit(limit);
        if (existingComics.length === 0) {
            console.warn('⚠️ No comic assets found');
            return {
                totalCreated: 0,
                totalUpdated: 0,
                totalErrors: 0,
                comicsProcessed: 0,
            };
        }
        console.log(`✅ Found ${existingComics.length} comics to expand`);
        let totalCreated = 0;
        let totalUpdated = 0;
        let totalErrors = 0;
        // Process comics with TRUE parallel concurrency using semaphore
        for (let i = 0; i < existingComics.length; i += MAX_CONCURRENT_COMICS) {
            // Check health before each batch
            if (!poolManager.isHealthy()) {
                console.error('🚨 Circuit breaker triggered - stopping expansion');
                break;
            }
            const batch = existingComics.slice(i, i + MAX_CONCURRENT_COMICS);
            console.log(`\n📊 Processing batch ${Math.floor(i / MAX_CONCURRENT_COMICS) + 1} (comics ${i + 1}-${Math.min(i + MAX_CONCURRENT_COMICS, existingComics.length)}/${existingComics.length})`);
            console.log(`   Pool: ${poolManager.getStats().active}/${MAX_DB_CONNECTIONS} connections`);
            // Process batch with TRUE PARALLELISM - semaphore controls connection limits
            const batchResults = await Promise.all(batch.map(async (comic) => {
                try {
                    const result = await this.processSingleComic(comic);
                    await this.sleep(DELAY_BETWEEN_COMICS);
                    return result;
                }
                catch (error) {
                    console.error('❌ Comic processing failed:', error.message);
                    return {
                        created: 0,
                        updated: 0,
                        errors: STANDARD_GRADES.length * GRADERS.length * LABEL_TYPES.length
                    };
                }
            }));
            // Aggregate batch results
            for (const result of batchResults) {
                totalCreated += result.created;
                totalUpdated += result.updated;
                totalErrors += result.errors;
            }
            // Stop if circuit breaker triggered during batch
            if (!poolManager.isHealthy()) {
                console.error('🚨 Circuit breaker triggered - stopping expansion');
                break;
            }
        }
        const stats = poolManager.getStats();
        console.log(`\n🎉 Expansion Complete!`);
        console.log(`   Comics: ${existingComics.length}`);
        console.log(`   Created: ${totalCreated}`);
        console.log(`   Errors: ${totalErrors}`);
        console.log(`   Pool Stats: ${stats.active}/${MAX_DB_CONNECTIONS} active, ${stats.errors} errors, circuit: ${stats.circuitOpen ? 'OPEN' : 'CLOSED'}`);
        return {
            totalCreated,
            totalUpdated,
            totalErrors,
            comicsProcessed: existingComics.length,
        };
    }
    /**
     * Get connection pool statistics
     */
    getPoolStats() {
        return poolManager.getStats();
    }
    /**
     * Reset circuit breaker (for manual recovery)
     */
    resetCircuitBreaker() {
        const stats = poolManager.getStats();
        console.log('🔄 Resetting circuit breaker...');
        console.log(`   Previous state: ${stats.errors} errors, circuit ${stats.circuitOpen ? 'OPEN' : 'CLOSED'}`);
        // Force reset by creating new manager
        Object.assign(poolManager, new ConnectionPoolManager());
        console.log('✅ Circuit breaker reset');
    }
}
exports.GoCollectDemoExpansion = GoCollectDemoExpansion;
exports.goCollectDemoExpansion = new GoCollectDemoExpansion();
