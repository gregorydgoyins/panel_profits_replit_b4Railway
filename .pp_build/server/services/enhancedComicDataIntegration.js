"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvIngestionOrchestrator = exports.CSVIngestionOrchestrator = void 0;
exports.startCSVIngestion = startCSVIngestion;
exports.getIngestionStatus = getIngestionStatus;
exports.retryIngestion = retryIngestion;
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const drizzle_orm_1 = require("drizzle-orm");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const csv_parse_1 = require("csv-parse");
const schema_js_1 = require("@shared/schema.js");
// Initialize database connection
const sql_connection = (0, serverless_1.neon)(process.env.DATABASE_URL);
const db = (0, neon_http_1.drizzle)(sql_connection);
/**
 * Phase 2 CSV Ingestion Orchestrator
 * Comprehensive system for processing narrative data from CSV files into trading platform
 */
class CSVIngestionOrchestrator {
    constructor() {
        this.ATTACHED_ASSETS_DIR = 'attached_assets';
        this.BATCH_SIZE = 1000;
        this.MAX_RETRIES = 3;
        // Price Safety Constants - Prevent DECIMAL(10,2) overflow
        this.MAX_PRICE = 99999999.99; // Database DECIMAL(10,2) limit
        this.MIN_PRICE = 0.01; // Minimum tradeable price
        this.SAFE_MAX_PRICE = 99999.99; // Safe upper bound for regular assets
        this.BASE_PRICE_RANGE = { MIN: 1.00, MAX: 999.99 }; // Base price range
        this.PREMIUM_PRICE_RANGE = { MIN: 1000.00, MAX: 9999.99 }; // Premium assets
        this.COSMIC_PRICE_RANGE = { MIN: 10000.00, MAX: 99999.99 }; // Cosmic-level assets
        this.HOUSE_THEMES = {
            heroes: ['hero', 'captain', 'spider', 'superman', 'wonder', 'flash'],
            wisdom: ['doctor', 'professor', 'sage', 'oracle', 'scholar', 'strange'],
            power: ['hulk', 'thor', 'strength', 'cosmic', 'phoenix', 'galactus'],
            mystery: ['batman', 'shadow', 'night', 'dark', 'mystic', 'occult'],
            elements: ['storm', 'fire', 'ice', 'earth', 'water', 'elemental'],
            time: ['time', 'temporal', 'chrono', 'speed', 'future', 'past'],
            spirit: ['ghost', 'spirit', 'soul', 'astral', 'phantom', 'supernatural']
        };
        console.log('🏛️ CSV Ingestion Orchestrator: Seven Houses await the narrative convergence...');
    }
    /**
     * Start comprehensive CSV ingestion process
     */
    async startIngestion(userId) {
        try {
            console.log('🔮 Initiating Phase 2 Data Convergence...');
            const jobId = await this.createIngestionJob('full_csv_import', userId);
            const runId = await this.createIngestionRun(jobId);
            await this.updateJobStatus(jobId, 'running', 0);
            // Step 1: Scan and register CSV files
            await this.updateJobStage(jobId, 'file_scanning', 10);
            const csvFiles = await this.scanAndRegisterCSVFiles(jobId);
            console.log(`📁 Discovered ${csvFiles.length} narrative archive files`);
            // Step 2: Process each CSV file
            await this.updateJobStage(jobId, 'processing', 20);
            for (let i = 0; i < csvFiles.length; i++) {
                const file = csvFiles[i];
                const progress = 20 + ((i + 1) / csvFiles.length) * 60;
                try {
                    await this.processCSVFile(file, jobId, runId);
                    await this.updateJobProgress(jobId, progress);
                }
                catch (error) {
                    console.error(`❌ Error processing ${file.filename}:`, error);
                    await this.logIngestionError(jobId, runId, 'processing', error, { filename: file.filename });
                }
            }
            // Step 3: Entity resolution and normalization
            await this.updateJobStage(jobId, 'normalization', 80);
            await this.performEntityResolution(jobId, runId);
            // Step 4: Calculate derived trading metrics
            await this.updateJobStage(jobId, 'enrichment', 90);
            await this.calculateTradingMetrics(jobId, runId);
            // Step 5: Complete ingestion
            await this.updateJobStatus(jobId, 'completed', 100);
            await this.completeIngestionRun(runId, 'completed');
            console.log('✨ Phase 2 Data Convergence Complete: The Seven Houses welcome their new narrative assets!');
            return jobId;
        }
        catch (error) {
            console.error('🚨 Critical ingestion failure:', error);
            throw error;
        }
    }
    /**
     * Scan attached_assets directory for CSV files and register them
     */
    async scanAndRegisterCSVFiles(jobId) {
        const csvFiles = [];
        try {
            const files = fs.readdirSync(this.ATTACHED_ASSETS_DIR);
            const csvFileNames = files.filter(file => file.endsWith('.csv') && (file.includes('marvel') ||
                file.includes('dc') ||
                file.includes('comic') ||
                file.includes('character') ||
                file.includes('battle') ||
                file.includes('movie')));
            for (const filename of csvFileNames) {
                const filePath = path.join(this.ATTACHED_ASSETS_DIR, filename);
                const stats = fs.statSync(filePath);
                const content = fs.readFileSync(filePath);
                const checksum = crypto.createHash('sha256').update(content).digest('hex');
                const datasetType = this.determineDatasetType(filename);
                const universe = this.determineUniverse(filename);
                // Register file in database
                const [registeredFile] = await db.insert(schema_js_1.rawDatasetFiles).values({
                    filename,
                    originalFilename: filename,
                    fileSize: stats.size,
                    checksum,
                    mimeType: 'text/csv',
                    datasetType,
                    source: 'attached_assets',
                    universe,
                    processingStatus: 'uploaded',
                    storageLocation: filePath,
                    ingestionJobId: jobId,
                    csvHeaders: await this.extractCSVHeaders(filePath),
                    sampleData: await this.extractSampleData(filePath)
                }).returning();
                csvFiles.push(registeredFile);
                console.log(`📋 Registered: ${filename} (${datasetType}, ${universe})`);
            }
            return csvFiles;
        }
        catch (error) {
            console.error('Error scanning CSV files:', error);
            throw error;
        }
    }
    /**
     * Process individual CSV file with streaming parser
     */
    async processCSVFile(file, jobId, runId) {
        console.log(`🔄 Processing: ${file.filename}`);
        await db.update(schema_js_1.rawDatasetFiles)
            .set({ processingStatus: 'processing', processingStartedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.rawDatasetFiles.id, file.id));
        return new Promise((resolve, reject) => {
            const filePath = file.storageLocation;
            let rowCount = 0;
            let processedCount = 0;
            let errorCount = 0;
            const batchRecords = [];
            const parser = (0, csv_parse_1.parse)({
                columns: true,
                skip_empty_lines: true,
                trim: true
            });
            parser.on('readable', async () => {
                let record;
                while (record = parser.read()) {
                    rowCount++;
                    try {
                        const stagingRecord = await this.createStagingRecord(record, file, rowCount);
                        batchRecords.push(stagingRecord);
                        // Process in batches
                        if (batchRecords.length >= this.BATCH_SIZE) {
                            await this.processBatch(batchRecords, jobId, runId);
                            processedCount += batchRecords.length;
                            batchRecords.length = 0;
                        }
                    }
                    catch (error) {
                        errorCount++;
                        await this.logIngestionError(jobId, runId, 'parsing', error, {
                            filename: file.filename,
                            rowNumber: rowCount,
                            recordData: record
                        });
                    }
                }
            });
            parser.on('end', async () => {
                try {
                    // Process remaining records in batch
                    if (batchRecords.length > 0) {
                        await this.processBatch(batchRecords, jobId, runId);
                        processedCount += batchRecords.length;
                    }
                    // Update file processing status
                    await db.update(schema_js_1.rawDatasetFiles)
                        .set({
                        processingStatus: 'completed',
                        processingCompletedAt: new Date(),
                        totalRows: rowCount,
                        processedRows: processedCount,
                        failedRows: errorCount
                    })
                        .where((0, drizzle_orm_1.eq)(schema_js_1.rawDatasetFiles.id, file.id));
                    console.log(`✅ Completed: ${file.filename} (${processedCount}/${rowCount} records)`);
                    resolve();
                }
                catch (error) {
                    reject(error);
                }
            });
            parser.on('error', (error) => {
                console.error(`❌ Parser error for ${file.filename}:`, error);
                reject(error);
            });
            fs.createReadStream(filePath).pipe(parser);
        });
    }
    /**
     * Create staging record from CSV row with validation
     */
    async createStagingRecord(record, file, rowNumber) {
        const recordHash = crypto.createHash('md5').update(JSON.stringify(record)).digest('hex');
        const recordType = this.classifyRecordType(record, file.datasetType);
        // Validate record based on dataset type
        const validation = await this.validateRecord(record, file.datasetType);
        return {
            datasetFileId: file.id,
            rowNumber,
            rawData: record,
            dataHash: recordHash,
            recordType,
            detectedEntityType: recordType,
            confidenceScore: validation.confidence,
            mappedFields: this.mapFields(record, file.datasetType),
            extractedEntities: this.extractEntities(record, file.datasetType),
            dataQualityScore: validation.qualityScore,
            missingFields: validation.missingFields,
            dataInconsistencies: validation.inconsistencies,
            errorMessages: validation.errors
        };
    }
    /**
     * Process batch of staging records
     */
    async processBatch(records, jobId, runId) {
        try {
            await db.insert(schema_js_1.stagingRecords).values(records);
            // Update run metrics
            await db.update(schema_js_1.ingestionRuns)
                .set({
                recordsProcessed: (0, drizzle_orm_1.sql) `${schema_js_1.ingestionRuns.recordsProcessed} + ${records.length}`,
                recordsSuccessful: (0, drizzle_orm_1.sql) `${schema_js_1.ingestionRuns.recordsSuccessful} + ${records.length}`
            })
                .where((0, drizzle_orm_1.eq)(schema_js_1.ingestionRuns.id, runId));
        }
        catch (error) {
            console.error('Batch processing error:', error);
            await this.logIngestionError(jobId, runId, 'database', error, { batchSize: records.length });
            throw error;
        }
    }
    /**
     * Perform entity resolution and normalization
     */
    async performEntityResolution(jobId, runId) {
        console.log('🧬 Performing entity resolution and normalization...');
        try {
            // Get all unprocessed staging records for this job
            const fileIds = await db.select({ id: schema_js_1.rawDatasetFiles.id })
                .from(schema_js_1.rawDatasetFiles)
                .where((0, drizzle_orm_1.eq)(schema_js_1.rawDatasetFiles.ingestionJobId, jobId));
            const fileIdList = fileIds.map(f => f.id);
            if (fileIdList.length === 0)
                return;
            const stagingData = await db.select()
                .from(schema_js_1.stagingRecords)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(schema_js_1.stagingRecords.datasetFileId, fileIdList), (0, drizzle_orm_1.eq)(schema_js_1.stagingRecords.processingStatus, 'pending')));
            console.log(`🔍 Resolving ${stagingData.length} staged records...`);
            // Process character entities
            const characterRecords = stagingData.filter(r => r.recordType === 'character');
            await this.processCharacterEntities(characterRecords, jobId, runId);
            // Process comic entities  
            const comicRecords = stagingData.filter(r => r.recordType === 'comic_issue');
            await this.processComicEntities(comicRecords, jobId, runId);
            // Process battle entities
            const battleRecords = stagingData.filter(r => r.recordType === 'battle');
            await this.processBattleEntities(battleRecords, jobId, runId);
            // Process movie entities
            const movieRecords = stagingData.filter(r => r.recordType === 'movie');
            await this.processMovieEntities(movieRecords, jobId, runId);
        }
        catch (error) {
            console.error('Entity resolution error:', error);
            await this.logIngestionError(jobId, runId, 'normalization', error);
            throw error;
        }
    }
    /**
     * Process character entities with fuzzy matching and house affinity
     */
    async processCharacterEntities(records, jobId, runId) {
        for (const record of records) {
            try {
                const rawData = record.rawData;
                const characterName = this.normalizeCharacterName(rawData.Character || rawData.character || rawData.name);
                // Check for existing entity
                let existingEntity = await this.findExistingCharacter(characterName, rawData);
                if (!existingEntity) {
                    // Create new narrative entity
                    const entityData = {
                        canonicalName: characterName,
                        entityType: 'character',
                        subtype: this.classifyCharacterSubtype(rawData),
                        universe: this.determineCharacterUniverse(rawData),
                        realName: rawData['Real Name'] || rawData.real_name || null,
                        secretIdentity: this.hasSecretIdentity(rawData),
                        description: this.generateCharacterDescription(rawData),
                        popularityScore: this.calculatePopularityScore(rawData),
                        culturalImpact: this.calculateCulturalImpact(rawData)
                    };
                    const [createdEntity] = await db.insert(schema_js_1.narrativeEntities).values(entityData).returning();
                    existingEntity = createdEntity;
                    // Create aliases
                    await this.createCharacterAliases(existingEntity.id, rawData);
                    // Create traits
                    await this.createCharacterTraits(existingEntity.id, rawData);
                    // Update enhanced characters table
                    await this.createEnhancedCharacter(existingEntity, rawData);
                    console.log(`👤 Created character entity: ${characterName}`);
                }
                // Mark staging record as processed
                await db.update(schema_js_1.stagingRecords)
                    .set({
                    processingStatus: 'normalized',
                    normalizedAt: new Date(),
                    extractedEntities: { narrativeEntityId: existingEntity.id }
                })
                    .where((0, drizzle_orm_1.eq)(schema_js_1.stagingRecords.id, record.id));
            }
            catch (error) {
                console.error(`Error processing character ${record.rawData?.Character}:`, error);
                await this.logIngestionError(jobId, runId, 'entity_creation', error, {
                    recordId: record.id,
                    characterName: record.rawData?.Character
                });
            }
        }
    }
    /**
     * Calculate house affinity scores based on character traits
     */
    calculateHouseAffinity(characterData) {
        const affinity = {
            heroes: 0, wisdom: 0, power: 0, mystery: 0, elements: 0, time: 0, spirit: 0
        };
        const fullText = JSON.stringify(characterData).toLowerCase();
        for (const [house, themes] of Object.entries(this.HOUSE_THEMES)) {
            let score = 0;
            for (const theme of themes) {
                if (fullText.includes(theme)) {
                    score += 0.2;
                }
            }
            // Role-based scoring
            const role = (characterData.Role || '').toLowerCase();
            if (house === 'heroes' && role === 'hero')
                score += 0.5;
            if (house === 'mystery' && role === 'antihero')
                score += 0.3;
            if (house === 'power' && role === 'villain')
                score += 0.4;
            // Power-based scoring
            const powers = (characterData.Powers || '').toLowerCase();
            if (house === 'wisdom' && powers.includes('intellect'))
                score += 0.3;
            if (house === 'power' && powers.includes('strength'))
                score += 0.4;
            if (house === 'elements' && (powers.includes('fire') || powers.includes('water')))
                score += 0.3;
            if (house === 'time' && powers.includes('speed'))
                score += 0.3;
            if (house === 'spirit' && powers.includes('magic'))
                score += 0.3;
            affinity[house] = Math.min(score, 1.0);
        }
        return affinity;
    }
    /**
     * Calculate trading metrics for characters
     */
    async calculateTradingMetrics(jobId, runId) {
        console.log('📊 Calculating derived trading metrics...');
        try {
            // Get all narrative entities created in this job
            const fileIds = await db.select({ id: schema_js_1.rawDatasetFiles.id })
                .from(schema_js_1.rawDatasetFiles)
                .where((0, drizzle_orm_1.eq)(schema_js_1.rawDatasetFiles.ingestionJobId, jobId));
            const stagingIds = await db.select({ narrativeEntityId: schema_js_1.stagingRecords.extractedEntities })
                .from(schema_js_1.stagingRecords)
                .where((0, drizzle_orm_1.inArray)(schema_js_1.stagingRecords.datasetFileId, fileIds.map(f => f.id)));
            for (const staging of stagingIds) {
                const entityId = staging.narrativeEntityId;
                if (!entityId?.narrativeEntityId)
                    continue;
                const entity = await db.select().from(schema_js_1.narrativeEntities)
                    .where((0, drizzle_orm_1.eq)(schema_js_1.narrativeEntities.id, entityId.narrativeEntityId))
                    .limit(1);
                if (entity.length === 0)
                    continue;
                // Calculate Mythic Volatility
                const mythicVolatility = this.calculateMythicVolatility(entity[0]);
                // Calculate Narrative Momentum  
                const narrativeMomentum = this.calculateNarrativeMomentum(entity[0]);
                // Create financial instrument mapping
                await this.createFinancialMapping(entity[0], mythicVolatility, narrativeMomentum);
                // Create or update asset
                await this.createTradingAsset(entity[0], mythicVolatility, narrativeMomentum);
            }
        }
        catch (error) {
            console.error('Trading metrics calculation error:', error);
            await this.logIngestionError(jobId, runId, 'enrichment', error);
        }
    }
    /**
     * Price Safety Validation Functions
     */
    validatePrice(price, context) {
        if (!isFinite(price) || price < this.MIN_PRICE) {
            console.warn(`🔧 Price validation: ${context} - Invalid price ${price}, setting to minimum ${this.MIN_PRICE}`);
            return this.MIN_PRICE;
        }
        if (price > this.MAX_PRICE) {
            console.warn(`🔧 Price validation: ${context} - Price ${price} exceeds database limit, capping at ${this.SAFE_MAX_PRICE}`);
            return this.SAFE_MAX_PRICE;
        }
        return Math.round(price * 100) / 100; // Round to 2 decimal places
    }
    mapPowerLevelToPrice(powerLevel, universe, culturalImpact) {
        // Normalize power level to 0-1 range
        const normalizedPower = Math.max(0, Math.min(powerLevel / 100, 1));
        // Use logarithmic scaling for extreme power levels
        let scaledPower = normalizedPower;
        if (normalizedPower > 0.8) {
            // Logarithmic scaling for cosmic-level characters
            scaledPower = 0.8 + (Math.log10(1 + (normalizedPower - 0.8) * 9) / Math.log10(10)) * 0.2;
        }
        // Determine base price range based on character tier
        let baseMin, baseMax;
        if (scaledPower < 0.3) {
            // Street-level heroes
            baseMin = this.BASE_PRICE_RANGE.MIN;
            baseMax = this.BASE_PRICE_RANGE.MAX;
        }
        else if (scaledPower < 0.7) {
            // Major heroes
            baseMin = this.PREMIUM_PRICE_RANGE.MIN;
            baseMax = this.PREMIUM_PRICE_RANGE.MAX;
        }
        else {
            // Cosmic-level entities
            baseMin = this.COSMIC_PRICE_RANGE.MIN;
            baseMax = this.COSMIC_PRICE_RANGE.MAX;
        }
        // Calculate base price
        const basePrice = baseMin + (scaledPower * (baseMax - baseMin));
        // Apply universe and cultural impact multipliers (capped)
        let multiplier = 1.0;
        if (universe === 'marvel' || universe === 'dc') {
            multiplier *= 1.5;
        }
        // Cultural impact multiplier (0-1 range, max 2x multiplier)
        const culturalMultiplier = 1 + Math.min(culturalImpact, 1.0);
        multiplier *= culturalMultiplier;
        // Ensure final multiplier doesn't exceed safe bounds
        multiplier = Math.min(multiplier, 3.0); // Max 3x multiplier
        const finalPrice = basePrice * multiplier;
        return this.validatePrice(finalPrice, `Power Level Mapping (${powerLevel}, ${universe})`);
    }
    capVolatilityPercentage(volatility) {
        // Ensure volatility is within 0-100% range
        return Math.max(0.01, Math.min(volatility, 1.0));
    }
    capMomentumPercentage(momentum) {
        // Ensure momentum is within 0-100% range
        return Math.max(0.01, Math.min(momentum, 1.0));
    }
    /**
     * Calculate Mythic Volatility based on power levels and interactions - SAFE VERSION
     */
    calculateMythicVolatility(entity) {
        let volatility = 0.1; // Base volatility (10%)
        try {
            // Power-based volatility (safely scaled)
            if (entity.entityType === 'character') {
                const powerTraits = Math.min(parseFloat(entity.metadata?.powerLevel || '0'), 100);
                volatility += (powerTraits / 100) * 0.3; // Max 30% from power
            }
            // Cultural impact factor (safely bounded)
            const culturalImpact = Math.min(parseFloat(entity.culturalImpact || '0'), 1.0);
            volatility += culturalImpact * 0.2; // Max 20% from cultural impact
            // Universe factor (bounded boost)
            if (entity.universe === 'marvel' || entity.universe === 'dc') {
                volatility += 0.15; // 15% boost for major universes
            }
            // Apply final safety cap
            return this.capVolatilityPercentage(volatility);
        }
        catch (error) {
            console.error(`Error calculating mythic volatility for ${entity.canonicalName}:`, error);
            return 0.25; // Safe default volatility (25%)
        }
    }
    /**
     * Calculate Narrative Momentum from story significance - SAFE VERSION
     */
    calculateNarrativeMomentum(entity) {
        let momentum = 0.5; // Neutral momentum (50%)
        try {
            // Popularity scoring (safely bounded)
            const popularity = Math.max(0, Math.min(parseFloat(entity.popularityScore || '50'), 100));
            momentum += (popularity - 50) * 0.005; // Convert 0-100 to momentum modifier (max ±25%)
            // Cultural impact (safely bounded)
            const culturalImpact = Math.min(parseFloat(entity.culturalImpact || '0'), 1.0);
            momentum += culturalImpact * 0.3; // Max 30% boost from cultural impact
            // Recent appearances boost (bounded)
            if (entity.lastAppearanceDate) {
                try {
                    const lastYear = new Date(entity.lastAppearanceDate).getFullYear();
                    const currentYear = new Date().getFullYear();
                    const yearsDiff = currentYear - lastYear;
                    if (yearsDiff < 2) {
                        momentum += 0.15; // 15% boost for recent appearances
                    }
                    else if (yearsDiff < 5) {
                        momentum += 0.05; // 5% boost for somewhat recent
                    }
                }
                catch (dateError) {
                    console.warn(`Invalid date format for ${entity.canonicalName}: ${entity.lastAppearanceDate}`);
                }
            }
            // Apply final safety cap
            return this.capMomentumPercentage(momentum);
        }
        catch (error) {
            console.error(`Error calculating narrative momentum for ${entity.canonicalName}:`, error);
            return 0.5; // Safe neutral momentum (50%)
        }
    }
    // Utility Methods
    determineDatasetType(filename) {
        if (filename.includes('character'))
            return 'characters';
        if (filename.includes('comic'))
            return 'comics';
        if (filename.includes('battle'))
            return 'battles';
        if (filename.includes('movie') || filename.includes('performance'))
            return 'movies';
        if (filename.includes('marvel') || filename.includes('dc'))
            return 'characters';
        return 'unknown';
    }
    determineUniverse(filename) {
        if (filename.toLowerCase().includes('marvel'))
            return 'marvel';
        if (filename.toLowerCase().includes('dc'))
            return 'dc';
        if (filename.toLowerCase().includes('image'))
            return 'image';
        return 'independent';
    }
    async extractCSVHeaders(filePath) {
        return new Promise((resolve, reject) => {
            const headers = [];
            const parser = (0, csv_parse_1.parse)({ columns: false, to_line: 1 });
            parser.on('readable', () => {
                const record = parser.read();
                if (record)
                    headers.push(...record);
            });
            parser.on('end', () => resolve(headers));
            parser.on('error', reject);
            fs.createReadStream(filePath).pipe(parser);
        });
    }
    async extractSampleData(filePath) {
        return new Promise((resolve, reject) => {
            const samples = [];
            const parser = (0, csv_parse_1.parse)({ columns: true, to_line: 6 });
            parser.on('readable', () => {
                let record;
                while (record = parser.read()) {
                    samples.push(record);
                }
            });
            parser.on('end', () => resolve(samples));
            parser.on('error', reject);
            fs.createReadStream(filePath).pipe(parser);
        });
    }
    classifyRecordType(record, datasetType) {
        if (datasetType === 'characters')
            return 'character';
        if (datasetType === 'comics')
            return 'comic_issue';
        if (datasetType === 'battles')
            return 'battle';
        if (datasetType === 'movies')
            return 'movie';
        // Auto-detect based on columns
        const keys = Object.keys(record).map(k => k.toLowerCase());
        if (keys.some(k => k.includes('character') || k.includes('hero')))
            return 'character';
        if (keys.some(k => k.includes('comic') || k.includes('issue')))
            return 'comic_issue';
        if (keys.some(k => k.includes('battle') || k.includes('fight')))
            return 'battle';
        if (keys.some(k => k.includes('movie') || k.includes('box')))
            return 'movie';
        return 'unknown';
    }
    async validateRecord(record, datasetType) {
        const validation = {
            confidence: 1.0,
            qualityScore: 1.0,
            missingFields: [],
            inconsistencies: {},
            errors: []
        };
        const keys = Object.keys(record);
        const values = Object.values(record);
        // Check for required fields based on dataset type
        const requiredFields = this.getRequiredFields(datasetType);
        for (const field of requiredFields) {
            if (!keys.some(k => k.toLowerCase().includes(field.toLowerCase()))) {
                validation.missingFields.push(field);
                validation.qualityScore -= 0.1;
            }
        }
        // Check for empty values
        const emptyCount = values.filter(v => !v || v.toString().trim() === '').length;
        validation.qualityScore -= (emptyCount / values.length) * 0.3;
        // Data type validation
        if (datasetType === 'movies') {
            const budget = record.budget || record.production_budget;
            if (budget && isNaN(parseFloat(budget))) {
                validation.errors.push('Invalid budget format');
                validation.confidence -= 0.2;
            }
        }
        return validation;
    }
    getRequiredFields(datasetType) {
        switch (datasetType) {
            case 'characters': return ['character', 'name'];
            case 'comics': return ['title', 'issue'];
            case 'battles': return ['character', 'outcome'];
            case 'movies': return ['title', 'year'];
            default: return [];
        }
    }
    mapFields(record, datasetType) {
        const mapped = {};
        switch (datasetType) {
            case 'characters':
                mapped.name = record.Character || record.character || record.name;
                mapped.realName = record['Real Name'] || record.real_name;
                mapped.powers = record.Powers || record.powers;
                mapped.affiliation = record.Affiliation || record.affiliation;
                mapped.role = record.Role || record.role;
                break;
            case 'movies':
                mapped.title = record.title || record.movie_title;
                mapped.year = record.year || record.release_year;
                mapped.budget = record.budget || record.production_budget;
                mapped.gross = record.gross || record.worldwide_gross;
                break;
        }
        return mapped;
    }
    extractEntities(record, datasetType) {
        const entities = {};
        if (datasetType === 'characters') {
            entities.character = record.Character || record.character;
            entities.affiliation = record.Affiliation || record.affiliation;
        }
        return entities;
    }
    normalizeCharacterName(name) {
        if (!name)
            return '';
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special chars except hyphens
            .replace(/\s+/g, ' ') // Normalize spaces
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    async findExistingCharacter(name, rawData) {
        // Direct name match
        let existing = await db.select().from(schema_js_1.narrativeEntities)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.narrativeEntities.canonicalName, name), (0, drizzle_orm_1.eq)(schema_js_1.narrativeEntities.entityType, 'character')))
            .limit(1);
        if (existing.length > 0)
            return existing[0];
        // Check aliases
        const aliases = await db.select({ canonicalEntityId: schema_js_1.entityAliases.canonicalEntityId })
            .from(schema_js_1.entityAliases)
            .where((0, drizzle_orm_1.eq)(schema_js_1.entityAliases.aliasName, name))
            .limit(1);
        if (aliases.length > 0) {
            existing = await db.select().from(schema_js_1.narrativeEntities)
                .where((0, drizzle_orm_1.eq)(schema_js_1.narrativeEntities.id, aliases[0].canonicalEntityId))
                .limit(1);
            if (existing.length > 0)
                return existing[0];
        }
        return null;
    }
    classifyCharacterSubtype(rawData) {
        const role = (rawData.Role || '').toLowerCase();
        if (role === 'hero')
            return 'hero';
        if (role === 'villain')
            return 'villain';
        if (role === 'antihero')
            return 'antihero';
        return 'supporting';
    }
    determineCharacterUniverse(rawData) {
        const affiliation = (rawData.Affiliation || '').toLowerCase();
        const character = (rawData.Character || '').toLowerCase();
        if (affiliation.includes('avengers') || character.includes('spider'))
            return 'marvel';
        if (affiliation.includes('justice') || character.includes('batman'))
            return 'dc';
        return 'independent';
    }
    hasSecretIdentity(rawData) {
        const realName = rawData['Real Name'] || rawData.real_name || '';
        const character = rawData.Character || rawData.character || '';
        return realName !== '' && realName.toLowerCase() !== character.toLowerCase();
    }
    generateCharacterDescription(rawData) {
        const name = rawData.Character || rawData.character || 'Unknown';
        const powers = rawData.Powers || 'various abilities';
        const role = rawData.Role || 'character';
        return `${name} is a ${role} with ${powers}, representing the mystical forces that shape the trading multiverse.`;
    }
    calculatePopularityScore(rawData) {
        let score = 50; // Base score
        // Well-known characters get higher scores
        const character = (rawData.Character || '').toLowerCase();
        const famousCharacters = ['spider-man', 'batman', 'superman', 'iron man', 'captain america'];
        if (famousCharacters.some(famous => character.includes(famous.replace('-', '')))) {
            score += 30;
        }
        // Avengers/Justice League members get bonus
        const affiliation = (rawData.Affiliation || '').toLowerCase();
        if (affiliation.includes('avengers') || affiliation.includes('justice')) {
            score += 20;
        }
        return Math.min(score, 100);
    }
    calculateCulturalImpact(rawData) {
        const popularity = this.calculatePopularityScore(rawData);
        return popularity / 100; // Convert to 0-1 scale
    }
    async createCharacterAliases(entityId, rawData) {
        const aliases = [];
        const realName = rawData['Real Name'] || rawData.real_name;
        if (realName && realName.trim()) {
            aliases.push({
                canonicalEntityId: entityId,
                aliasName: realName,
                aliasType: 'real_name',
                usageContext: 'primary',
                popularityScore: 0.8,
                officialStatus: true
            });
        }
        // Add common name variations
        const character = rawData.Character || rawData.character || '';
        if (character.includes('-')) {
            aliases.push({
                canonicalEntityId: entityId,
                aliasName: character.replace('-', ' '),
                aliasType: 'alternate_spelling',
                usageContext: 'secondary',
                popularityScore: 0.6,
                officialStatus: false
            });
        }
        if (aliases.length > 0) {
            await db.insert(schema_js_1.entityAliases).values(aliases);
        }
    }
    async createCharacterTraits(entityId, rawData) {
        const traits = [];
        const powers = rawData.Powers || rawData.powers || '';
        if (powers) {
            const powerList = powers.split(',').map((p) => p.trim());
            for (const power of powerList) {
                if (power) {
                    traits.push({
                        entityId,
                        traitCategory: 'power',
                        traitType: this.normalizePowerType(power),
                        traitName: power,
                        potencyLevel: this.calculatePowerLevel(power),
                        masteryLevel: Math.floor(Math.random() * 5) + 5, // 5-10
                        reliabilityLevel: 8,
                        versatilityScore: this.calculateVersatilityScore(power),
                        description: `${power} - A mystical ability that enhances trading prowess`,
                        combatEffectiveness: this.calculateCombatEffectiveness(power),
                        utilityValue: this.calculateUtilityValue(power),
                        rarityScore: this.calculateRarityScore(power),
                        acquisitionMethod: 'birth',
                        marketRelevance: this.calculateMarketRelevance(power),
                        fanAppeal: 0.7
                    });
                }
            }
        }
        if (traits.length > 0) {
            await db.insert(schema_js_1.narrativeTraits).values(traits);
        }
    }
    normalizePowerType(power) {
        const normalized = power.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
        if (normalized.includes('strength'))
            return 'superhuman_strength';
        if (normalized.includes('speed'))
            return 'superhuman_speed';
        if (normalized.includes('intelligence') || normalized.includes('intellect'))
            return 'genius_intellect';
        if (normalized.includes('flight') || normalized.includes('flying'))
            return 'flight';
        if (normalized.includes('telepathy') || normalized.includes('mind'))
            return 'telepathy';
        return normalized;
    }
    calculatePowerLevel(power) {
        const powerRankings = {
            'god': 10, 'cosmic': 10, 'reality': 9, 'time': 9,
            'telepathy': 8, 'telekinesis': 8, 'magic': 8,
            'strength': 7, 'speed': 7, 'flight': 6,
            'intellect': 6, 'armor': 5, 'martial': 4
        };
        const lowerPower = power.toLowerCase();
        for (const [key, level] of Object.entries(powerRankings)) {
            if (lowerPower.includes(key))
                return level;
        }
        return 5; // Default
    }
    calculateVersatilityScore(power) {
        if (power.toLowerCase().includes('magic'))
            return 0.9;
        if (power.toLowerCase().includes('intellect'))
            return 0.8;
        if (power.toLowerCase().includes('strength'))
            return 0.6;
        return 0.5;
    }
    calculateCombatEffectiveness(power) {
        const lowerPower = power.toLowerCase();
        if (lowerPower.includes('strength') || lowerPower.includes('combat'))
            return 0.9;
        if (lowerPower.includes('speed') || lowerPower.includes('martial'))
            return 0.8;
        if (lowerPower.includes('intellect'))
            return 0.4;
        return 0.6;
    }
    calculateUtilityValue(power) {
        const lowerPower = power.toLowerCase();
        if (lowerPower.includes('intellect'))
            return 0.9;
        if (lowerPower.includes('telepathy'))
            return 0.8;
        if (lowerPower.includes('flight'))
            return 0.7;
        return 0.5;
    }
    calculateRarityScore(power) {
        const lowerPower = power.toLowerCase();
        if (lowerPower.includes('cosmic') || lowerPower.includes('reality'))
            return 0.95;
        if (lowerPower.includes('telepathy') || lowerPower.includes('magic'))
            return 0.8;
        if (lowerPower.includes('strength'))
            return 0.3;
        return 0.5;
    }
    calculateMarketRelevance(power) {
        const lowerPower = power.toLowerCase();
        if (lowerPower.includes('intellect'))
            return 0.9; // High trading value
        if (lowerPower.includes('telepathy'))
            return 0.8; // Market insight
        if (lowerPower.includes('strength'))
            return 0.6; // General appeal
        return 0.5;
    }
    async createEnhancedCharacter(entity, rawData) {
        const houseAffinity = this.calculateHouseAffinity(rawData);
        const enhancedData = {
            characterId: entity.id,
            characterName: entity.canonicalName,
            realName: entity.realName,
            universe: entity.universe,
            affiliation: rawData.Affiliation || rawData.affiliation,
            role: rawData.Role || rawData.role,
            powerLevel: rawData['Power Level'] || 'Low',
            abilities: rawData.Powers ? rawData.Powers.split(',').map((p) => p.trim()) : [],
            houseAffinity,
            marketTier: this.calculateMarketTier(rawData),
            tradingVolume: 0,
            volatilityRating: this.calculateMythicVolatility(entity),
            narrativeMomentum: this.calculateNarrativeMomentum(entity),
            culturalRelevance: entity.culturalImpact || 0.5,
            collectibilityScore: this.calculateCollectibilityScore(rawData),
            isActivelyTraded: true
        };
        await db.insert(schema_js_1.enhancedCharacters).values(enhancedData);
    }
    calculateMarketTier(rawData) {
        const popularity = this.calculatePopularityScore(rawData);
        if (popularity >= 80)
            return 'S';
        if (popularity >= 60)
            return 'A';
        if (popularity >= 40)
            return 'B';
        if (popularity >= 20)
            return 'C';
        return 'D';
    }
    calculateCollectibilityScore(rawData) {
        let score = 0.5; // Base collectibility
        const character = (rawData.Character || '').toLowerCase();
        const role = (rawData.Role || '').toLowerCase();
        // Heroes are more collectible
        if (role === 'hero')
            score += 0.2;
        // Famous characters are highly collectible
        if (['spider-man', 'batman', 'superman', 'wolverine'].some(famous => character.includes(famous.replace('-', '')))) {
            score += 0.3;
        }
        return Math.min(score, 1.0);
    }
    async processComicEntities(records, jobId, runId) {
        // Implementation for comic book processing
        console.log(`📚 Processing ${records.length} comic records...`);
        // Similar pattern to character processing but for comic entities
    }
    async processBattleEntities(records, jobId, runId) {
        // Implementation for battle scenario processing
        console.log(`⚔️ Processing ${records.length} battle records...`);
        // Process battle outcomes and create entity interactions
    }
    async processMovieEntities(records, jobId, runId) {
        // Implementation for movie performance processing
        console.log(`🎬 Processing ${records.length} movie records...`);
        // Process box office and performance data
    }
    async createFinancialMapping(entity, volatility, momentum) {
        try {
            // Safely bound all financial parameters
            const safeVolatility = this.capVolatilityPercentage(volatility);
            const safeMomentum = this.capMomentumPercentage(momentum);
            // Calculate margin requirement safely (50-100% based on volatility)
            const marginRequirement = Math.min(50 + (safeVolatility * 50), 100);
            // Determine lot size based on asset tier (prevent fractional issues)
            const powerLevel = Math.max(0, Math.min(parseFloat(entity.metadata?.powerLevel || '50'), 100));
            const lotSize = powerLevel > 80 ? 10 : 1; // Higher lot sizes for cosmic entities
            const mappingData = {
                assetId: `${entity.id}`, // This would link to actual asset ID
                instrumentType: 'common_stock',
                shareClass: powerLevel > 90 ? 'AAA' : (powerLevel > 70 ? 'AA' : 'A'), // Cosmic entities get premium class
                votingRights: true,
                dividendEligible: false,
                marginRequirement: Math.round(marginRequirement), // Ensure integer
                shortSellAllowed: powerLevel < 95, // Restrict shorting for near-omnipotent entities
                lotSize: lotSize,
                tickSize: powerLevel > 90 ? '0.10' : (powerLevel > 70 ? '0.05' : '0.01'), // Larger tick sizes for high-value assets
                securityType: 'equity',
                exchangeListing: 'PPX'
            };
            // Validate margin requirement is within acceptable bounds
            if (mappingData.marginRequirement < 25 || mappingData.marginRequirement > 100) {
                console.warn(`⚠️ Margin requirement ${mappingData.marginRequirement} outside normal range for ${entity.canonicalName}, adjusting to safe bounds`);
                mappingData.marginRequirement = Math.max(25, Math.min(mappingData.marginRequirement, 100));
            }
            // Only insert if asset doesn't already have mapping
            const existing = await db.select().from(schema_js_1.assetFinancialMapping)
                .where((0, drizzle_orm_1.eq)(schema_js_1.assetFinancialMapping.assetId, mappingData.assetId))
                .limit(1);
            if (existing.length === 0) {
                await db.insert(schema_js_1.assetFinancialMapping).values(mappingData);
                console.log(`💼 Financial mapping created for ${entity.canonicalName}: Margin ${mappingData.marginRequirement}%, Lot ${mappingData.lotSize}, Tick $${mappingData.tickSize}`);
            }
        }
        catch (error) {
            console.error(`🚨 Error creating financial mapping for ${entity.canonicalName}:`, error);
            // Create safe fallback mapping
            await this.createFallbackFinancialMapping(entity, error);
        }
    }
    async createFallbackFinancialMapping(entity, originalError) {
        try {
            const fallbackMapping = {
                assetId: `${entity.id}`,
                instrumentType: 'common_stock',
                shareClass: 'A',
                votingRights: true,
                dividendEligible: false,
                marginRequirement: 50, // Safe default
                shortSellAllowed: true,
                lotSize: 1,
                tickSize: '0.01',
                securityType: 'equity',
                exchangeListing: 'PPX'
            };
            await db.insert(schema_js_1.assetFinancialMapping).values(fallbackMapping);
            console.log(`🛡️ Fallback financial mapping created for ${entity.canonicalName}`);
        }
        catch (fallbackError) {
            console.error(`💥 Failed to create fallback financial mapping for ${entity.canonicalName}:`, fallbackError);
        }
    }
    async createTradingAsset(entity, volatility, momentum) {
        try {
            // Extract power level safely
            const powerLevel = Math.max(0, Math.min(parseFloat(entity.metadata?.powerLevel || '50'), 100));
            const culturalImpact = Math.min(parseFloat(entity.culturalImpact || '0.5'), 1.0);
            // Calculate safe price using power level mapping with logarithmic scaling
            const safePrice = this.mapPowerLevelToPrice(powerLevel, entity.universe, culturalImpact);
            // Ensure volatility and momentum are within safe bounds
            const safeVolatility = this.capVolatilityPercentage(volatility);
            const safeMomentum = this.capMomentumPercentage(momentum);
            // Generate asset symbol safely
            const assetSymbol = this.generateAssetSymbol(entity.canonicalName);
            // Validate all financial data before insertion
            const validatedPrice = this.validatePrice(safePrice, `Asset Creation - ${entity.canonicalName}`);
            if (validatedPrice !== safePrice) {
                console.log(`📊 Price adjusted for ${entity.canonicalName}: ${safePrice.toFixed(2)} → ${validatedPrice.toFixed(2)}`);
            }
            const assetData = {
                symbol: assetSymbol,
                name: entity.canonicalName,
                type: 'character',
                description: entity.description || `Trade ${entity.canonicalName} - ${entity.universe} universe character`,
                currentPrice: validatedPrice.toFixed(2),
                basePrice: validatedPrice.toFixed(2),
                volatility: safeVolatility,
                metadata: {
                    entityId: entity.id,
                    universe: entity.universe,
                    entityType: entity.entityType,
                    powerLevel: powerLevel,
                    culturalImpact: culturalImpact,
                    volatility: safeVolatility,
                    momentum: safeMomentum,
                    houseAffinity: entity.houseAffinity || {},
                    priceCalculationMethod: 'power_level_mapping_v2',
                    pricingTier: this.determinePricingTier(powerLevel),
                    scalingApplied: powerLevel > 80 ? 'logarithmic' : 'linear'
                }
            };
            // Check if asset already exists
            const existing = await db.select().from(schema_js_1.assets)
                .where((0, drizzle_orm_1.eq)(schema_js_1.assets.symbol, assetData.symbol))
                .limit(1);
            if (existing.length === 0) {
                // Final validation before database insertion
                await this.validateAssetDataForInsertion(assetData);
                await db.insert(schema_js_1.assets).values(assetData);
                console.log(`💰 Created trading asset: ${assetData.symbol} (${entity.canonicalName}) @ $${validatedPrice.toFixed(2)}`);
                // Log pricing details for monitoring
                console.log(`   🔍 Pricing details: Power=${powerLevel}, Cultural=${culturalImpact.toFixed(2)}, Vol=${(safeVolatility * 100).toFixed(1)}%, Mom=${(safeMomentum * 100).toFixed(1)}%`);
            }
            else {
                console.log(`🔄 Asset already exists: ${assetData.symbol} (${entity.canonicalName})`);
            }
        }
        catch (error) {
            console.error(`🚨 Critical error creating trading asset for ${entity.canonicalName}:`, error);
            // Create fallback asset with minimal safe values
            await this.createFallbackAsset(entity, error);
        }
    }
    determinePricingTier(powerLevel) {
        if (powerLevel < 30)
            return 'street';
        if (powerLevel < 70)
            return 'hero';
        if (powerLevel < 90)
            return 'cosmic';
        return 'omnipotent';
    }
    async validateAssetDataForInsertion(assetData) {
        // Validate currentPrice fits in DECIMAL(10,2)
        const price = parseFloat(assetData.currentPrice || '0');
        if (price > this.MAX_PRICE || price < this.MIN_PRICE) {
            throw new Error(`Price ${price} outside valid range [${this.MIN_PRICE}, ${this.MAX_PRICE}]`);
        }
        // Validate volatility is percentage
        if (assetData.volatility < 0 || assetData.volatility > 1) {
            throw new Error(`Volatility ${assetData.volatility} outside valid range [0, 1]`);
        }
        // Validate symbol length and format
        if (!assetData.symbol || assetData.symbol.length < 2 || assetData.symbol.length > 10) {
            throw new Error(`Invalid asset symbol: ${assetData.symbol}`);
        }
    }
    async createFallbackAsset(entity, originalError) {
        try {
            console.log(`🛍️ Creating fallback asset for ${entity.canonicalName}...`);
            const fallbackData = {
                symbol: this.generateAssetSymbol(entity.canonicalName),
                name: entity.canonicalName,
                type: 'character',
                description: `Safe fallback asset for ${entity.canonicalName}`,
                currentPrice: "10.00", // Safe base price
                basePrice: "10.00",
                volatility: 0.25, // 25% volatility
                metadata: {
                    entityId: entity.id,
                    universe: entity.universe || 'unknown',
                    entityType: entity.entityType || 'character',
                    powerLevel: 25, // Safe default
                    culturalImpact: 0.25,
                    volatility: 0.25,
                    momentum: 0.5,
                    houseAffinity: {},
                    priceCalculationMethod: 'fallback_safe_default',
                    pricingTier: 'street',
                    originalError: originalError.message,
                    fallbackReason: 'Price calculation overflow protection'
                }
            };
            await db.insert(schema_js_1.assets).values(fallbackData);
            console.log(`✅ Fallback asset created: ${fallbackData.symbol} @ $10.00`);
        }
        catch (fallbackError) {
            console.error(`🚨 Failed to create fallback asset for ${entity.canonicalName}:`, fallbackError);
            // Record this as a problematic entity that needs manual review
        }
    }
    generateAssetSymbol(name) {
        return name
            .toUpperCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '')
            .substring(0, 6) + Math.random().toString(36).substring(2, 4).toUpperCase();
    }
    // Job Management Methods
    async createIngestionJob(jobType, userId) {
        const [job] = await db.insert(schema_js_1.ingestionJobs).values({
            jobName: `Phase 2 CSV Import - ${new Date().toISOString()}`,
            jobType,
            datasetType: 'mixed',
            sourceType: 'csv_file',
            processingMode: 'thorough',
            batchSize: this.BATCH_SIZE,
            maxRetries: this.MAX_RETRIES,
            timeoutMinutes: 120,
            priorityLevel: 8,
            createdBy: userId,
            description: 'Comprehensive ingestion of narrative data from attached CSV files'
        }).returning();
        return job.id;
    }
    async createIngestionRun(jobId) {
        const [run] = await db.insert(schema_js_1.ingestionRuns).values({
            jobId,
            runNumber: 1,
            runType: 'standard',
            triggeredBy: 'system'
        }).returning();
        return run.id;
    }
    async updateJobStatus(jobId, status, progress) {
        await db.update(schema_js_1.ingestionJobs)
            .set({ status, progress: progress.toString(), updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.ingestionJobs.id, jobId));
    }
    async updateJobStage(jobId, stage, progress) {
        await db.update(schema_js_1.ingestionJobs)
            .set({
            currentStage: stage,
            progress: progress.toString(),
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_js_1.ingestionJobs.id, jobId));
    }
    async updateJobProgress(jobId, progress) {
        await db.update(schema_js_1.ingestionJobs)
            .set({ progress: progress.toString(), updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.ingestionJobs.id, jobId));
    }
    async completeIngestionRun(runId, status) {
        await db.update(schema_js_1.ingestionRuns)
            .set({ status, completedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.ingestionRuns.id, runId));
    }
    async logIngestionError(jobId, runId, stage, error, context) {
        await db.insert(schema_js_1.ingestionErrors).values({
            jobId,
            runId,
            errorType: 'processing',
            errorCategory: 'major',
            errorSeverity: 5,
            errorMessage: error.message,
            detailedDescription: error.stack || '',
            technicalDetails: { stack: error.stack, name: error.name },
            errorContext: context || {},
            processingStage: stage,
            isResolvable: true,
            resolutionStrategy: 'retry',
            retryable: true
        });
        // Update job error count
        await db.update(schema_js_1.ingestionJobs)
            .set({ errorCount: (0, drizzle_orm_1.sql) `${schema_js_1.ingestionJobs.errorCount} + 1` })
            .where((0, drizzle_orm_1.eq)(schema_js_1.ingestionJobs.id, jobId));
    }
    /**
     * Get ingestion job status
     */
    async getJobStatus(jobId) {
        const [job] = await db.select().from(schema_js_1.ingestionJobs)
            .where((0, drizzle_orm_1.eq)(schema_js_1.ingestionJobs.id, jobId))
            .limit(1);
        if (!job)
            return null;
        const runs = await db.select().from(schema_js_1.ingestionRuns)
            .where((0, drizzle_orm_1.eq)(schema_js_1.ingestionRuns.jobId, jobId))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.ingestionRuns.createdAt));
        const errors = await db.select().from(schema_js_1.ingestionErrors)
            .where((0, drizzle_orm_1.eq)(schema_js_1.ingestionErrors.jobId, jobId))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.ingestionErrors.createdAt))
            .limit(10);
        return {
            job,
            runs,
            recentErrors: errors
        };
    }
    /**
     * Retry failed ingestion job
     */
    async retryJob(jobId) {
        const existingJob = await this.getJobStatus(jobId);
        if (!existingJob)
            throw new Error('Job not found');
        // Create new run for retry
        const runId = await this.createIngestionRun(jobId);
        // Reset job status
        await this.updateJobStatus(jobId, 'running', 0);
        // Continue processing from staging records
        await this.performEntityResolution(jobId, runId);
        await this.calculateTradingMetrics(jobId, runId);
        await this.updateJobStatus(jobId, 'completed', 100);
        await this.completeIngestionRun(runId, 'completed');
        return runId;
    }
}
exports.CSVIngestionOrchestrator = CSVIngestionOrchestrator;
// Export singleton instance
exports.csvIngestionOrchestrator = new CSVIngestionOrchestrator();
// Export main functions for external use
async function startCSVIngestion(userId) {
    return exports.csvIngestionOrchestrator.startIngestion(userId);
}
async function getIngestionStatus(jobId) {
    return exports.csvIngestionOrchestrator.getJobStatus(jobId);
}
async function retryIngestion(jobId) {
    return exports.csvIngestionOrchestrator.retryJob(jobId);
}
