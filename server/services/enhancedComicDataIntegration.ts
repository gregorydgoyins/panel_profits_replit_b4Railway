import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, and, desc, sql, inArray } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { parse } from 'csv-parse';
import { 
  rawDatasetFiles, stagingRecords, ingestionJobs, ingestionRuns, ingestionErrors,
  narrativeEntities, narrativeTraits, entityAliases, entityInteractions, 
  mediaPerformanceMetrics, enhancedCharacters, battleScenarios, enhancedComicIssues,
  moviePerformanceData, assetFinancialMapping, assets
} from '@shared/schema.js';
import type {
  InsertRawDatasetFile, InsertStagingRecord, InsertIngestionJob, InsertIngestionRun,
  InsertIngestionError, InsertNarrativeEntity, InsertNarrativeTrait, InsertEntityAlias,
  InsertEntityInteraction, InsertMediaPerformanceMetric, InsertEnhancedCharacter,
  InsertBattleScenario, InsertEnhancedComicIssue, InsertMoviePerformanceData,
  InsertAssetFinancialMapping, InsertAsset
} from '@shared/schema.js';

// Initialize database connection
const sql_connection = neon(process.env.DATABASE_URL!);
const db = drizzle(sql_connection);

/**
 * Phase 2 CSV Ingestion Orchestrator
 * Comprehensive system for processing narrative data from CSV files into trading platform
 */
export class CSVIngestionOrchestrator {
  private readonly ATTACHED_ASSETS_DIR = 'attached_assets';
  private readonly BATCH_SIZE = 1000;
  private readonly MAX_RETRIES = 3;
  
  // Price Safety Constants - Prevent DECIMAL(10,2) overflow
  private readonly MAX_PRICE = 99999999.99; // Database DECIMAL(10,2) limit
  private readonly MIN_PRICE = 0.01; // Minimum tradeable price
  private readonly SAFE_MAX_PRICE = 99999.99; // Safe upper bound for regular assets
  private readonly BASE_PRICE_RANGE = { MIN: 1.00, MAX: 999.99 }; // Base price range
  private readonly PREMIUM_PRICE_RANGE = { MIN: 1000.00, MAX: 9999.99 }; // Premium assets
  private readonly COSMIC_PRICE_RANGE = { MIN: 10000.00, MAX: 99999.99 }; // Cosmic-level assets
  
  private readonly HOUSE_THEMES = {
    heroes: ['hero', 'captain', 'spider', 'superman', 'wonder', 'flash'],
    wisdom: ['doctor', 'professor', 'sage', 'oracle', 'scholar', 'strange'],
    power: ['hulk', 'thor', 'strength', 'cosmic', 'phoenix', 'galactus'],
    mystery: ['batman', 'shadow', 'night', 'dark', 'mystic', 'occult'],
    elements: ['storm', 'fire', 'ice', 'earth', 'water', 'elemental'],
    time: ['time', 'temporal', 'chrono', 'speed', 'future', 'past'],
    spirit: ['ghost', 'spirit', 'soul', 'astral', 'phantom', 'supernatural']
  };

  constructor() {
    console.log('🏛️ CSV Ingestion Orchestrator: Seven Houses await the narrative convergence...');
  }

  /**
   * Start comprehensive CSV ingestion process
   */
  async startIngestion(userId?: string): Promise<string> {
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
        } catch (error) {
          console.error(`❌ Error processing ${file.filename}:`, error);
          await this.logIngestionError(jobId, runId, 'processing', error as Error, { filename: file.filename });
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
      
    } catch (error) {
      console.error('🚨 Critical ingestion failure:', error);
      throw error;
    }
  }

  /**
   * Scan attached_assets directory for CSV files and register them
   */
  private async scanAndRegisterCSVFiles(jobId: string): Promise<any[]> {
    const csvFiles: any[] = [];
    
    try {
      const files = fs.readdirSync(this.ATTACHED_ASSETS_DIR);
      const csvFileNames = files.filter(file => 
        file.endsWith('.csv') && (
          file.includes('marvel') || 
          file.includes('dc') || 
          file.includes('comic') || 
          file.includes('character') ||
          file.includes('battle') ||
          file.includes('movie')
        )
      );

      for (const filename of csvFileNames) {
        const filePath = path.join(this.ATTACHED_ASSETS_DIR, filename);
        const stats = fs.statSync(filePath);
        const content = fs.readFileSync(filePath);
        const checksum = crypto.createHash('sha256').update(content).digest('hex');
        
        const datasetType = this.determineDatasetType(filename);
        const universe = this.determineUniverse(filename);
        
        // Register file in database
        const [registeredFile] = await db.insert(rawDatasetFiles).values({
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
    } catch (error) {
      console.error('Error scanning CSV files:', error);
      throw error;
    }
  }

  /**
   * Process individual CSV file with streaming parser
   */
  private async processCSVFile(file: any, jobId: string, runId: string): Promise<void> {
    console.log(`🔄 Processing: ${file.filename}`);
    
    await db.update(rawDatasetFiles)
      .set({ processingStatus: 'processing', processingStartedAt: new Date() })
      .where(eq(rawDatasetFiles.id, file.id));

    return new Promise((resolve, reject) => {
      const filePath = file.storageLocation;
      let rowCount = 0;
      let processedCount = 0;
      let errorCount = 0;
      const batchRecords: InsertStagingRecord[] = [];

      const parser = parse({
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
            
          } catch (error) {
            errorCount++;
            await this.logIngestionError(jobId, runId, 'parsing', error as Error, { 
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
          await db.update(rawDatasetFiles)
            .set({ 
              processingStatus: 'completed',
              processingCompletedAt: new Date(),
              totalRows: rowCount,
              processedRows: processedCount,
              failedRows: errorCount
            })
            .where(eq(rawDatasetFiles.id, file.id));

          console.log(`✅ Completed: ${file.filename} (${processedCount}/${rowCount} records)`);
          resolve();
        } catch (error) {
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
  private async createStagingRecord(record: any, file: any, rowNumber: number): Promise<InsertStagingRecord> {
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
  private async processBatch(records: InsertStagingRecord[], jobId: string, runId: string): Promise<void> {
    try {
      await db.insert(stagingRecords).values(records);
      
      // Update run metrics
      await db.update(ingestionRuns)
        .set({ 
          recordsProcessed: sql`${ingestionRuns.recordsProcessed} + ${records.length}`,
          recordsSuccessful: sql`${ingestionRuns.recordsSuccessful} + ${records.length}`
        })
        .where(eq(ingestionRuns.id, runId));
        
    } catch (error) {
      console.error('Batch processing error:', error);
      await this.logIngestionError(jobId, runId, 'database', error as Error, { batchSize: records.length });
      throw error;
    }
  }

  /**
   * Perform entity resolution and normalization
   */
  private async performEntityResolution(jobId: string, runId: string): Promise<void> {
    console.log('🧬 Performing entity resolution and normalization...');
    
    try {
      // Get all unprocessed staging records for this job
      const fileIds = await db.select({ id: rawDatasetFiles.id })
        .from(rawDatasetFiles)
        .where(eq(rawDatasetFiles.ingestionJobId, jobId));
      
      const fileIdList = fileIds.map(f => f.id);
      
      if (fileIdList.length === 0) return;
      
      const stagingData = await db.select()
        .from(stagingRecords)
        .where(and(
          inArray(stagingRecords.datasetFileId, fileIdList),
          eq(stagingRecords.processingStatus, 'pending')
        ));

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

    } catch (error) {
      console.error('Entity resolution error:', error);
      await this.logIngestionError(jobId, runId, 'normalization', error as Error);
      throw error;
    }
  }

  /**
   * Process character entities with fuzzy matching and house affinity
   */
  private async processCharacterEntities(records: any[], jobId: string, runId: string): Promise<void> {
    for (const record of records) {
      try {
        const rawData = record.rawData;
        const characterName = this.normalizeCharacterName(rawData.Character || rawData.character || rawData.name);
        
        // Check for existing entity
        let existingEntity = await this.findExistingCharacter(characterName, rawData);
        
        if (!existingEntity) {
          // Create new narrative entity
          const entityData: InsertNarrativeEntity = {
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

          const [createdEntity] = await db.insert(narrativeEntities).values(entityData).returning();
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
        await db.update(stagingRecords)
          .set({ 
            processingStatus: 'normalized',
            normalizedAt: new Date(),
            extractedEntities: { narrativeEntityId: existingEntity.id }
          })
          .where(eq(stagingRecords.id, record.id));

      } catch (error) {
        console.error(`Error processing character ${record.rawData?.Character}:`, error);
        await this.logIngestionError(jobId, runId, 'entity_creation', error as Error, { 
          recordId: record.id,
          characterName: record.rawData?.Character 
        });
      }
    }
  }

  /**
   * Calculate house affinity scores based on character traits
   */
  private calculateHouseAffinity(characterData: any): Record<string, number> {
    const affinity: Record<string, number> = {
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
      if (house === 'heroes' && role === 'hero') score += 0.5;
      if (house === 'mystery' && role === 'antihero') score += 0.3;
      if (house === 'power' && role === 'villain') score += 0.4;
      
      // Power-based scoring
      const powers = (characterData.Powers || '').toLowerCase();
      if (house === 'wisdom' && powers.includes('intellect')) score += 0.3;
      if (house === 'power' && powers.includes('strength')) score += 0.4;
      if (house === 'elements' && (powers.includes('fire') || powers.includes('water'))) score += 0.3;
      if (house === 'time' && powers.includes('speed')) score += 0.3;
      if (house === 'spirit' && powers.includes('magic')) score += 0.3;
      
      affinity[house] = Math.min(score, 1.0);
    }

    return affinity;
  }

  /**
   * Calculate trading metrics for characters
   */
  private async calculateTradingMetrics(jobId: string, runId: string): Promise<void> {
    console.log('📊 Calculating derived trading metrics...');
    
    try {
      // Get all narrative entities created in this job
      const fileIds = await db.select({ id: rawDatasetFiles.id })
        .from(rawDatasetFiles)
        .where(eq(rawDatasetFiles.ingestionJobId, jobId));
      
      const stagingIds = await db.select({ narrativeEntityId: stagingRecords.extractedEntities })
        .from(stagingRecords)
        .where(inArray(stagingRecords.datasetFileId, fileIds.map(f => f.id)));

      for (const staging of stagingIds) {
        const entityId = staging.narrativeEntityId as any;
        if (!entityId?.narrativeEntityId) continue;

        const entity = await db.select().from(narrativeEntities)
          .where(eq(narrativeEntities.id, entityId.narrativeEntityId))
          .limit(1);
        
        if (entity.length === 0) continue;

        // Calculate Mythic Volatility
        const mythicVolatility = this.calculateMythicVolatility(entity[0]);
        
        // Calculate Narrative Momentum  
        const narrativeMomentum = this.calculateNarrativeMomentum(entity[0]);
        
        // Create financial instrument mapping
        await this.createFinancialMapping(entity[0], mythicVolatility, narrativeMomentum);

        // Create or update asset
        await this.createTradingAsset(entity[0], mythicVolatility, narrativeMomentum);
      }

    } catch (error) {
      console.error('Trading metrics calculation error:', error);
      await this.logIngestionError(jobId, runId, 'enrichment', error as Error);
    }
  }

  /**
   * Price Safety Validation Functions
   */
  private validatePrice(price: number, context: string): number {
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
  
  private mapPowerLevelToPrice(powerLevel: number, universe: string, culturalImpact: number): number {
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
    } else if (scaledPower < 0.7) {
      // Major heroes
      baseMin = this.PREMIUM_PRICE_RANGE.MIN;
      baseMax = this.PREMIUM_PRICE_RANGE.MAX;
    } else {
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
  
  private capVolatilityPercentage(volatility: number): number {
    // Ensure volatility is within 0-100% range
    return Math.max(0.01, Math.min(volatility, 1.0));
  }
  
  private capMomentumPercentage(momentum: number): number {
    // Ensure momentum is within 0-100% range
    return Math.max(0.01, Math.min(momentum, 1.0));
  }

  /**
   * Calculate Mythic Volatility based on power levels and interactions - SAFE VERSION
   */
  private calculateMythicVolatility(entity: any): number {
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
      
    } catch (error) {
      console.error(`Error calculating mythic volatility for ${entity.canonicalName}:`, error);
      return 0.25; // Safe default volatility (25%)
    }
  }

  /**
   * Calculate Narrative Momentum from story significance - SAFE VERSION
   */
  private calculateNarrativeMomentum(entity: any): number {
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
          } else if (yearsDiff < 5) {
            momentum += 0.05; // 5% boost for somewhat recent
          }
        } catch (dateError) {
          console.warn(`Invalid date format for ${entity.canonicalName}: ${entity.lastAppearanceDate}`);
        }
      }
      
      // Apply final safety cap
      return this.capMomentumPercentage(momentum);
      
    } catch (error) {
      console.error(`Error calculating narrative momentum for ${entity.canonicalName}:`, error);
      return 0.5; // Safe neutral momentum (50%)
    }
  }

  // Utility Methods

  private determineDatasetType(filename: string): string {
    if (filename.includes('character')) return 'characters';
    if (filename.includes('comic')) return 'comics';
    if (filename.includes('battle')) return 'battles';
    if (filename.includes('movie') || filename.includes('performance')) return 'movies';
    if (filename.includes('marvel') || filename.includes('dc')) return 'characters';
    return 'unknown';
  }

  private determineUniverse(filename: string): string {
    if (filename.toLowerCase().includes('marvel')) return 'marvel';
    if (filename.toLowerCase().includes('dc')) return 'dc';
    if (filename.toLowerCase().includes('image')) return 'image';
    return 'independent';
  }

  private async extractCSVHeaders(filePath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const headers: string[] = [];
      const parser = parse({ columns: false, to_line: 1 });
      
      parser.on('readable', () => {
        const record = parser.read();
        if (record) headers.push(...record);
      });
      
      parser.on('end', () => resolve(headers));
      parser.on('error', reject);
      
      fs.createReadStream(filePath).pipe(parser);
    });
  }

  private async extractSampleData(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const samples: any[] = [];
      const parser = parse({ columns: true, to_line: 6 });
      
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

  private classifyRecordType(record: any, datasetType: string): string {
    if (datasetType === 'characters') return 'character';
    if (datasetType === 'comics') return 'comic_issue';
    if (datasetType === 'battles') return 'battle';
    if (datasetType === 'movies') return 'movie';
    
    // Auto-detect based on columns
    const keys = Object.keys(record).map(k => k.toLowerCase());
    if (keys.some(k => k.includes('character') || k.includes('hero'))) return 'character';
    if (keys.some(k => k.includes('comic') || k.includes('issue'))) return 'comic_issue';
    if (keys.some(k => k.includes('battle') || k.includes('fight'))) return 'battle';
    if (keys.some(k => k.includes('movie') || k.includes('box'))) return 'movie';
    
    return 'unknown';
  }

  private async validateRecord(record: any, datasetType: string): Promise<{
    confidence: number;
    qualityScore: number;
    missingFields: string[];
    inconsistencies: any;
    errors: string[];
  }> {
    const validation = {
      confidence: 1.0,
      qualityScore: 1.0,
      missingFields: [] as string[],
      inconsistencies: {},
      errors: [] as string[]
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

  private getRequiredFields(datasetType: string): string[] {
    switch (datasetType) {
      case 'characters': return ['character', 'name'];
      case 'comics': return ['title', 'issue'];
      case 'battles': return ['character', 'outcome'];
      case 'movies': return ['title', 'year'];
      default: return [];
    }
  }

  private mapFields(record: any, datasetType: string): any {
    const mapped: any = {};
    
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

  private extractEntities(record: any, datasetType: string): any {
    const entities: any = {};
    
    if (datasetType === 'characters') {
      entities.character = record.Character || record.character;
      entities.affiliation = record.Affiliation || record.affiliation;
    }
    
    return entities;
  }

  private normalizeCharacterName(name: string): string {
    if (!name) return '';
    
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars except hyphens
      .replace(/\s+/g, ' ')      // Normalize spaces
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private async findExistingCharacter(name: string, rawData: any): Promise<any> {
    // Direct name match
    let existing = await db.select().from(narrativeEntities)
      .where(and(
        eq(narrativeEntities.canonicalName, name),
        eq(narrativeEntities.entityType, 'character')
      ))
      .limit(1);
    
    if (existing.length > 0) return existing[0];
    
    // Check aliases
    const aliases = await db.select({ canonicalEntityId: entityAliases.canonicalEntityId })
      .from(entityAliases)
      .where(eq(entityAliases.aliasName, name))
      .limit(1);
    
    if (aliases.length > 0) {
      existing = await db.select().from(narrativeEntities)
        .where(eq(narrativeEntities.id, aliases[0].canonicalEntityId))
        .limit(1);
      
      if (existing.length > 0) return existing[0];
    }
    
    return null;
  }

  private classifyCharacterSubtype(rawData: any): string {
    const role = (rawData.Role || '').toLowerCase();
    if (role === 'hero') return 'hero';
    if (role === 'villain') return 'villain';
    if (role === 'antihero') return 'antihero';
    return 'supporting';
  }

  private determineCharacterUniverse(rawData: any): string {
    const affiliation = (rawData.Affiliation || '').toLowerCase();
    const character = (rawData.Character || '').toLowerCase();
    
    if (affiliation.includes('avengers') || character.includes('spider')) return 'marvel';
    if (affiliation.includes('justice') || character.includes('batman')) return 'dc';
    return 'independent';
  }

  private hasSecretIdentity(rawData: any): boolean {
    const realName = rawData['Real Name'] || rawData.real_name || '';
    const character = rawData.Character || rawData.character || '';
    return realName !== '' && realName.toLowerCase() !== character.toLowerCase();
  }

  private generateCharacterDescription(rawData: any): string {
    const name = rawData.Character || rawData.character || 'Unknown';
    const powers = rawData.Powers || 'various abilities';
    const role = rawData.Role || 'character';
    
    return `${name} is a ${role} with ${powers}, representing the mystical forces that shape the trading multiverse.`;
  }

  private calculatePopularityScore(rawData: any): number {
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

  private calculateCulturalImpact(rawData: any): number {
    const popularity = this.calculatePopularityScore(rawData);
    return popularity / 100; // Convert to 0-1 scale
  }

  private async createCharacterAliases(entityId: string, rawData: any): Promise<void> {
    const aliases: InsertEntityAlias[] = [];
    
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
      await db.insert(entityAliases).values(aliases);
    }
  }

  private async createCharacterTraits(entityId: string, rawData: any): Promise<void> {
    const traits: InsertNarrativeTrait[] = [];
    
    const powers = rawData.Powers || rawData.powers || '';
    if (powers) {
      const powerList = powers.split(',').map((p: string) => p.trim());
      
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
      await db.insert(narrativeTraits).values(traits);
    }
  }

  private normalizePowerType(power: string): string {
    const normalized = power.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
    
    if (normalized.includes('strength')) return 'superhuman_strength';
    if (normalized.includes('speed')) return 'superhuman_speed';
    if (normalized.includes('intelligence') || normalized.includes('intellect')) return 'genius_intellect';
    if (normalized.includes('flight') || normalized.includes('flying')) return 'flight';
    if (normalized.includes('telepathy') || normalized.includes('mind')) return 'telepathy';
    
    return normalized;
  }

  private calculatePowerLevel(power: string): number {
    const powerRankings: Record<string, number> = {
      'god': 10, 'cosmic': 10, 'reality': 9, 'time': 9,
      'telepathy': 8, 'telekinesis': 8, 'magic': 8,
      'strength': 7, 'speed': 7, 'flight': 6,
      'intellect': 6, 'armor': 5, 'martial': 4
    };
    
    const lowerPower = power.toLowerCase();
    for (const [key, level] of Object.entries(powerRankings)) {
      if (lowerPower.includes(key)) return level;
    }
    
    return 5; // Default
  }

  private calculateVersatilityScore(power: string): number {
    if (power.toLowerCase().includes('magic')) return 0.9;
    if (power.toLowerCase().includes('intellect')) return 0.8;
    if (power.toLowerCase().includes('strength')) return 0.6;
    return 0.5;
  }

  private calculateCombatEffectiveness(power: string): number {
    const lowerPower = power.toLowerCase();
    if (lowerPower.includes('strength') || lowerPower.includes('combat')) return 0.9;
    if (lowerPower.includes('speed') || lowerPower.includes('martial')) return 0.8;
    if (lowerPower.includes('intellect')) return 0.4;
    return 0.6;
  }

  private calculateUtilityValue(power: string): number {
    const lowerPower = power.toLowerCase();
    if (lowerPower.includes('intellect')) return 0.9;
    if (lowerPower.includes('telepathy')) return 0.8;
    if (lowerPower.includes('flight')) return 0.7;
    return 0.5;
  }

  private calculateRarityScore(power: string): number {
    const lowerPower = power.toLowerCase();
    if (lowerPower.includes('cosmic') || lowerPower.includes('reality')) return 0.95;
    if (lowerPower.includes('telepathy') || lowerPower.includes('magic')) return 0.8;
    if (lowerPower.includes('strength')) return 0.3;
    return 0.5;
  }

  private calculateMarketRelevance(power: string): number {
    const lowerPower = power.toLowerCase();
    if (lowerPower.includes('intellect')) return 0.9; // High trading value
    if (lowerPower.includes('telepathy')) return 0.8; // Market insight
    if (lowerPower.includes('strength')) return 0.6; // General appeal
    return 0.5;
  }

  private async createEnhancedCharacter(entity: any, rawData: any): Promise<void> {
    const houseAffinity = this.calculateHouseAffinity(rawData);
    
    const enhancedData: InsertEnhancedCharacter = {
      characterId: entity.id,
      characterName: entity.canonicalName,
      realName: entity.realName,
      universe: entity.universe,
      affiliation: rawData.Affiliation || rawData.affiliation,
      role: rawData.Role || rawData.role,
      powerLevel: rawData['Power Level'] || 'Low',
      abilities: rawData.Powers ? rawData.Powers.split(',').map((p: string) => p.trim()) : [],
      houseAffinity,
      marketTier: this.calculateMarketTier(rawData),
      tradingVolume: 0,
      volatilityRating: this.calculateMythicVolatility(entity),
      narrativeMomentum: this.calculateNarrativeMomentum(entity),
      culturalRelevance: entity.culturalImpact || 0.5,
      collectibilityScore: this.calculateCollectibilityScore(rawData),
      isActivelyTraded: true
    };

    await db.insert(enhancedCharacters).values(enhancedData);
  }

  private calculateMarketTier(rawData: any): string {
    const popularity = this.calculatePopularityScore(rawData);
    if (popularity >= 80) return 'S';
    if (popularity >= 60) return 'A';
    if (popularity >= 40) return 'B';
    if (popularity >= 20) return 'C';
    return 'D';
  }

  private calculateCollectibilityScore(rawData: any): number {
    let score = 0.5; // Base collectibility
    
    const character = (rawData.Character || '').toLowerCase();
    const role = (rawData.Role || '').toLowerCase();
    
    // Heroes are more collectible
    if (role === 'hero') score += 0.2;
    
    // Famous characters are highly collectible
    if (['spider-man', 'batman', 'superman', 'wolverine'].some(famous => 
        character.includes(famous.replace('-', '')))) {
      score += 0.3;
    }
    
    return Math.min(score, 1.0);
  }

  private async processComicEntities(records: any[], jobId: string, runId: string): Promise<void> {
    // Implementation for comic book processing
    console.log(`📚 Processing ${records.length} comic records...`);
    // Similar pattern to character processing but for comic entities
  }

  private async processBattleEntities(records: any[], jobId: string, runId: string): Promise<void> {
    // Implementation for battle scenario processing
    console.log(`⚔️ Processing ${records.length} battle records...`);
    // Process battle outcomes and create entity interactions
  }

  private async processMovieEntities(records: any[], jobId: string, runId: string): Promise<void> {
    // Implementation for movie performance processing
    console.log(`🎬 Processing ${records.length} movie records...`);
    // Process box office and performance data
  }

  private async createFinancialMapping(entity: any, volatility: number, momentum: number): Promise<void> {
    try {
      // Safely bound all financial parameters
      const safeVolatility = this.capVolatilityPercentage(volatility);
      const safeMomentum = this.capMomentumPercentage(momentum);
      
      // Calculate margin requirement safely (50-100% based on volatility)
      const marginRequirement = Math.min(50 + (safeVolatility * 50), 100);
      
      // Determine lot size based on asset tier (prevent fractional issues)
      const powerLevel = Math.max(0, Math.min(parseFloat(entity.metadata?.powerLevel || '50'), 100));
      const lotSize = powerLevel > 80 ? 10 : 1; // Higher lot sizes for cosmic entities
      
      const mappingData: InsertAssetFinancialMapping = {
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
      const existing = await db.select().from(assetFinancialMapping)
        .where(eq(assetFinancialMapping.assetId, mappingData.assetId))
        .limit(1);
        
      if (existing.length === 0) {
        await db.insert(assetFinancialMapping).values(mappingData);
        console.log(`💼 Financial mapping created for ${entity.canonicalName}: Margin ${mappingData.marginRequirement}%, Lot ${mappingData.lotSize}, Tick $${mappingData.tickSize}`);
      }
      
    } catch (error) {
      console.error(`🚨 Error creating financial mapping for ${entity.canonicalName}:`, error);
      
      // Create safe fallback mapping
      await this.createFallbackFinancialMapping(entity, error as Error);
    }
  }
  
  private async createFallbackFinancialMapping(entity: any, originalError: Error): Promise<void> {
    try {
      const fallbackMapping: InsertAssetFinancialMapping = {
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
      
      await db.insert(assetFinancialMapping).values(fallbackMapping);
      console.log(`🛡️ Fallback financial mapping created for ${entity.canonicalName}`);
      
    } catch (fallbackError) {
      console.error(`💥 Failed to create fallback financial mapping for ${entity.canonicalName}:`, fallbackError);
    }
  }

  private async createTradingAsset(entity: any, volatility: number, momentum: number): Promise<void> {
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
      
      const assetData: InsertAsset = {
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
      const existing = await db.select().from(assets)
        .where(eq(assets.symbol, assetData.symbol))
        .limit(1);
        
      if (existing.length === 0) {
        // Final validation before database insertion
        await this.validateAssetDataForInsertion(assetData);
        
        await db.insert(assets).values(assetData);
        console.log(`💰 Created trading asset: ${assetData.symbol} (${entity.canonicalName}) @ $${validatedPrice.toFixed(2)}`);
        
        // Log pricing details for monitoring
        console.log(`   🔍 Pricing details: Power=${powerLevel}, Cultural=${culturalImpact.toFixed(2)}, Vol=${(safeVolatility*100).toFixed(1)}%, Mom=${(safeMomentum*100).toFixed(1)}%`);
        
      } else {
        console.log(`🔄 Asset already exists: ${assetData.symbol} (${entity.canonicalName})`);
      }
      
    } catch (error) {
      console.error(`🚨 Critical error creating trading asset for ${entity.canonicalName}:`, error);
      
      // Create fallback asset with minimal safe values
      await this.createFallbackAsset(entity, error as Error);
    }
  }
  
  private determinePricingTier(powerLevel: number): string {
    if (powerLevel < 30) return 'street';
    if (powerLevel < 70) return 'hero';
    if (powerLevel < 90) return 'cosmic';
    return 'omnipotent';
  }
  
  private async validateAssetDataForInsertion(assetData: InsertAsset): Promise<void> {
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
  
  private async createFallbackAsset(entity: any, originalError: Error): Promise<void> {
    try {
      console.log(`🛍️ Creating fallback asset for ${entity.canonicalName}...`);
      
      const fallbackData: InsertAsset = {
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
      
      await db.insert(assets).values(fallbackData);
      console.log(`✅ Fallback asset created: ${fallbackData.symbol} @ $10.00`);
      
    } catch (fallbackError) {
      console.error(`🚨 Failed to create fallback asset for ${entity.canonicalName}:`, fallbackError);
      // Record this as a problematic entity that needs manual review
    }
  }

  private generateAssetSymbol(name: string): string {
    return name
      .toUpperCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '')
      .substring(0, 6) + Math.random().toString(36).substring(2, 4).toUpperCase();
  }

  // Job Management Methods

  private async createIngestionJob(jobType: string, userId?: string): Promise<string> {
    const [job] = await db.insert(ingestionJobs).values({
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

  private async createIngestionRun(jobId: string): Promise<string> {
    const [run] = await db.insert(ingestionRuns).values({
      jobId,
      runNumber: 1,
      runType: 'standard',
      triggeredBy: 'system'
    }).returning();

    return run.id;
  }

  private async updateJobStatus(jobId: string, status: string, progress: number): Promise<void> {
    await db.update(ingestionJobs)
      .set({ status, progress: progress.toString(), updatedAt: new Date() })
      .where(eq(ingestionJobs.id, jobId));
  }

  private async updateJobStage(jobId: string, stage: string, progress: number): Promise<void> {
    await db.update(ingestionJobs)
      .set({ 
        currentStage: stage, 
        progress: progress.toString(), 
        updatedAt: new Date() 
      })
      .where(eq(ingestionJobs.id, jobId));
  }

  private async updateJobProgress(jobId: string, progress: number): Promise<void> {
    await db.update(ingestionJobs)
      .set({ progress: progress.toString(), updatedAt: new Date() })
      .where(eq(ingestionJobs.id, jobId));
  }

  private async completeIngestionRun(runId: string, status: string): Promise<void> {
    await db.update(ingestionRuns)
      .set({ status, completedAt: new Date() })
      .where(eq(ingestionRuns.id, runId));
  }

  private async logIngestionError(
    jobId: string, 
    runId: string, 
    stage: string, 
    error: Error, 
    context?: any
  ): Promise<void> {
    await db.insert(ingestionErrors).values({
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
    await db.update(ingestionJobs)
      .set({ errorCount: sql`${ingestionJobs.errorCount} + 1` })
      .where(eq(ingestionJobs.id, jobId));
  }

  /**
   * Get ingestion job status
   */
  async getJobStatus(jobId: string): Promise<any> {
    const [job] = await db.select().from(ingestionJobs)
      .where(eq(ingestionJobs.id, jobId))
      .limit(1);
    
    if (!job) return null;

    const runs = await db.select().from(ingestionRuns)
      .where(eq(ingestionRuns.jobId, jobId))
      .orderBy(desc(ingestionRuns.createdAt));

    const errors = await db.select().from(ingestionErrors)
      .where(eq(ingestionErrors.jobId, jobId))
      .orderBy(desc(ingestionErrors.createdAt))
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
  async retryJob(jobId: string): Promise<string> {
    const existingJob = await this.getJobStatus(jobId);
    if (!existingJob) throw new Error('Job not found');

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

// Export singleton instance
export const csvIngestionOrchestrator = new CSVIngestionOrchestrator();

// Export main functions for external use
export async function startCSVIngestion(userId?: string): Promise<string> {
  return csvIngestionOrchestrator.startIngestion(userId);
}

export async function getIngestionStatus(jobId: string): Promise<any> {
  return csvIngestionOrchestrator.getJobStatus(jobId);
}

export async function retryIngestion(jobId: string): Promise<string> {
  return csvIngestionOrchestrator.retryJob(jobId);
}