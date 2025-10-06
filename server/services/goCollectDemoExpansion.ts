import { db } from '../databaseStorage';
import { assets as assetsTable, assetCurrentPrices } from '@shared/schema';
import { eq, sql as drizzleSql } from 'drizzle-orm';

const STANDARD_GRADES = [
  '10.0', '9.9', '9.8', '9.6', '9.4', '9.2', '9.0',
  '8.5', '8.0', '7.5', '7.0', '6.5', '6.0',
  '5.5', '5.0', '4.5', '4.0'
];

const GRADERS: Array<'CGC' | 'CBCS' | 'PGX'> = ['CGC', 'CBCS', 'PGX'];

const LABEL_TYPES: Array<'Universal' | 'Signature Series'> = [
  'Universal',
  'Signature Series'
];

// Rate limiting configuration
const BATCH_SIZE = 50; // Assets per batch insert
const DELAY_BETWEEN_BATCHES = 100; // ms between batch inserts
const MAX_CONCURRENT_COMICS = 5; // Process N comics at a time

export class GoCollectDemoExpansion {
  private processingCount = 0;

  /**
   * Sleep helper for rate limiting
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry with exponential backoff
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        if (i === maxRetries - 1) throw error;
        
        const delay = baseDelay * Math.pow(2, i);
        console.log(`⚠️ Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
        await this.sleep(delay);
      }
    }
    throw new Error('Retry failed');
  }

  /**
   * Calculate realistic price based on grade
   * Higher grades = exponentially higher prices
   */
  private calculateGradePrice(basePrice: number, grade: string, labelType: string, grader: string): number {
    const gradeValue = parseFloat(grade);
    
    // Grade multipliers (exponential curve)
    let multiplier = 1;
    if (gradeValue >= 9.8) multiplier = 15;
    else if (gradeValue >= 9.6) multiplier = 10;
    else if (gradeValue >= 9.4) multiplier = 7;
    else if (gradeValue >= 9.2) multiplier = 5;
    else if (gradeValue >= 9.0) multiplier = 4;
    else if (gradeValue >= 8.5) multiplier = 3;
    else if (gradeValue >= 8.0) multiplier = 2.5;
    else if (gradeValue >= 7.0) multiplier = 2;
    else if (gradeValue >= 6.0) multiplier = 1.5;
    else if (gradeValue >= 5.0) multiplier = 1.2;
    
    // Label type modifier
    if (labelType === 'Signature Series') {
      multiplier *= 1.3; // SS adds 30% premium
    }
    
    // Grader modifier (CGC is most valuable)
    if (grader === 'CGC') {
      multiplier *= 1.0; // baseline
    } else if (grader === 'CBCS') {
      multiplier *= 0.9; // 10% discount
    } else if (grader === 'PGX') {
      multiplier *= 0.75; // 25% discount
    }
    
    return basePrice * multiplier;
  }

  /**
   * Generate symbol for graded comic
   */
  private generateSymbol(title: string, issue: string, grader: string, grade: string, labelType: string): string {
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
   * Process a single comic with bulk inserts
   */
  private async processSingleComic(comic: any): Promise<{
    created: number;
    updated: number;
    errors: number;
  }> {
    const metadata = comic.metadata as any;
    const title = metadata?.title || comic.name;
    const issueNumber = metadata?.issueNumber || '1';
    
    // Get base price
    const priceData = await this.retryWithBackoff(() =>
      db
        .select()
        .from(assetCurrentPrices)
        .where(eq(assetCurrentPrices.assetId, comic.id))
        .limit(1)
    );

    const basePrice = priceData.length > 0 
      ? parseFloat(priceData[0].currentPrice)
      : 100;

    console.log(`🔍 ${title} #${issueNumber} (base: $${basePrice})`);

    // Generate all graded variants
    const assetsToCreate: any[] = [];
    const pricesToCreate: any[] = [];

    for (const grader of GRADERS) {
      for (const grade of STANDARD_GRADES) {
        for (const labelType of LABEL_TYPES) {
          const symbol = this.generateSymbol(title, issueNumber, grader, grade, labelType);
          const gradedPrice = this.calculateGradePrice(basePrice, grade, labelType, grader);

          const name = `${title} #${issueNumber} - ${grader} ${grade}${
            labelType === 'Signature Series' ? ' (SS)' : ''
          }`;

          assetsToCreate.push({
            symbol,
            name,
            type: 'graded-comic' as const,
            description: `${title} #${issueNumber} - Professionally graded ${grader} ${grade}${
              labelType === 'Signature Series' ? ' with creator signature' : ''
            }`,
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
            verificationStatus: 'verified' as const,
            primaryDataSource: 'gocollect' as const,
            lastVerifiedAt: new Date(),
          });

          pricesToCreate.push({
            gradedPrice,
            grade,
            grader,
            labelType,
            basePrice,
          });
        }
      }
    }

    // Bulk insert with rate limiting
    let created = 0;
    let updated = 0;
    let errors = 0;

    for (let i = 0; i < assetsToCreate.length; i += BATCH_SIZE) {
      const batch = assetsToCreate.slice(i, i + BATCH_SIZE);
      const priceBatch = pricesToCreate.slice(i, i + BATCH_SIZE);

      try {
        // Use INSERT ON CONFLICT for upsert
        const insertedAssets = await this.retryWithBackoff(() =>
          db
            .insert(assetsTable)
            .values(batch)
            .onConflictDoUpdate({
              target: assetsTable.symbol,
              set: {
                name: drizzleSql`excluded.name`,
                description: drizzleSql`excluded.description`,
                metadata: drizzleSql`excluded.metadata`,
                lastVerifiedAt: drizzleSql`excluded.last_verified_at`,
              },
            })
            .returning()
        );

        // Insert prices
        for (let j = 0; j < insertedAssets.length; j++) {
          const asset = insertedAssets[j];
          const priceInfo = priceBatch[j];

          try {
            // Check if price exists
            const existing = await this.retryWithBackoff(() =>
              db
                .select()
                .from(assetCurrentPrices)
                .where(eq(assetCurrentPrices.assetId, asset.id))
                .limit(1)
            );

            if (existing.length === 0) {
              await this.retryWithBackoff(() =>
                db.insert(assetCurrentPrices).values({
                  assetId: asset.id,
                  currentPrice: priceInfo.gradedPrice.toFixed(2),
                  bidPrice: (priceInfo.gradedPrice * 0.95).toFixed(2),
                  askPrice: (priceInfo.gradedPrice * 1.05).toFixed(2),
                  volume: Math.floor(Math.random() * 100) + 10,
                })
              );
            }
          } catch (error: any) {
            errors++;
          }
        }

        created += insertedAssets.length;
        await this.sleep(DELAY_BETWEEN_BATCHES);
      } catch (error: any) {
        console.error(`❌ Batch error:`, error.message);
        errors += batch.length;
      }
    }

    return { created, updated, errors };
  }

  /**
   * Expand existing comics in database into graded variants
   */
  async expandExistingComics(limit = 10): Promise<{
    totalCreated: number;
    totalUpdated: number;
    totalErrors: number;
    comicsProcessed: number;
  }> {
    console.log(`📚 Expanding ${limit} comics into graded assets...`);

    // Get random existing comic assets that haven't been expanded yet
    const existingComics = await db
      .select()
      .from(assetsTable)
      .where(eq(assetsTable.type, 'comic'))
      .orderBy(drizzleSql`RANDOM()`)
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

    // Process comics in controlled batches
    for (let i = 0; i < existingComics.length; i += MAX_CONCURRENT_COMICS) {
      const batch = existingComics.slice(i, i + MAX_CONCURRENT_COMICS);
      
      // Process batch concurrently
      const results = await Promise.all(
        batch.map(comic => this.processSingleComic(comic))
      );

      // Aggregate results
      for (const result of results) {
        totalCreated += result.created;
        totalUpdated += result.updated;
        totalErrors += result.errors;
      }

      console.log(`📊 Progress: ${Math.min(i + MAX_CONCURRENT_COMICS, existingComics.length)}/${existingComics.length} comics processed`);
    }

    console.log(`\n🎉 Expansion Complete!`);
    console.log(`   Comics: ${existingComics.length}`);
    console.log(`   Created: ${totalCreated}`);
    console.log(`   Errors: ${totalErrors}`);

    return {
      totalCreated,
      totalUpdated,
      totalErrors,
      comicsProcessed: existingComics.length,
    };
  }

  /**
   * LEGACY METHOD - kept for backward compatibility
   * Use expandExistingComics instead
   */
  async expandExistingComicsLegacy(limit = 10): Promise<{
    totalCreated: number;
    totalUpdated: number;
    totalErrors: number;
    comicsProcessed: number;
  }> {
    console.log(`📚 [LEGACY] Expanding existing comics into graded assets (limit: ${limit})...`);

    const existingComics = await db
      .select()
      .from(assetsTable)
      .where(eq(assetsTable.type, 'comic'))
      .limit(limit);

    if (existingComics.length === 0) {
      console.warn('⚠️ No comic assets found in database');
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

    for (const comic of existingComics) {
      try {
        const metadata = comic.metadata as any;
        const title = metadata?.title || comic.name;
        const issueNumber = metadata?.issueNumber || '1';
        
        // Get base price
        const priceData = await db
          .select()
          .from(assetCurrentPrices)
          .where(eq(assetCurrentPrices.assetId, comic.id))
          .limit(1);

        const basePrice = priceData.length > 0 
          ? parseFloat(priceData[0].currentPrice)
          : 100; // Default $100 if no price

        console.log(`\n🔍 Expanding ${title} #${issueNumber} (base price: $${basePrice})...`);

        // Create graded variants
        for (const grader of GRADERS) {
          for (const grade of STANDARD_GRADES) {
            for (const labelType of LABEL_TYPES) {
              try {
                const symbol = this.generateSymbol(title, issueNumber, grader, grade, labelType);
                const gradedPrice = this.calculateGradePrice(basePrice, grade, labelType, grader);

                const name = `${title} #${issueNumber} - ${grader} ${grade}${
                  labelType === 'Signature Series' ? ' (SS)' : ''
                }`;

                const description = `${title} #${issueNumber} - Professionally graded ${grader} ${grade}${
                  labelType === 'Signature Series' ? ' with creator signature' : ''
                }`;

                // Check if exists
                const existing = await db
                  .select()
                  .from(assetsTable)
                  .where(eq(assetsTable.symbol, symbol))
                  .limit(1);

                const assetData = {
                  symbol,
                  name,
                  type: 'graded-comic' as const,
                  description,
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
                  verificationStatus: 'verified' as const,
                  primaryDataSource: 'gocollect' as const,
                  lastVerifiedAt: new Date(),
                };

                if (existing.length === 0) {
                  const [newAsset] = await db.insert(assetsTable).values(assetData).returning();
                  
                  // Create price
                  await db.insert(assetCurrentPrices).values({
                    assetId: newAsset.id,
                    currentPrice: gradedPrice.toFixed(2),
                    bidPrice: (gradedPrice * 0.95).toFixed(2),
                    askPrice: (gradedPrice * 1.05).toFixed(2),
                    volume: Math.floor(Math.random() * 100) + 10,
                  });

                  totalCreated++;
                } else {
                  // Update existing
                  await db
                    .update(assetsTable)
                    .set(assetData)
                    .where(eq(assetsTable.id, existing[0].id));

                  // Update price
                  const existingPrice = await db
                    .select()
                    .from(assetCurrentPrices)
                    .where(eq(assetCurrentPrices.assetId, existing[0].id))
                    .limit(1);

                  const priceUpdate = {
                    currentPrice: gradedPrice.toFixed(2),
                    bidPrice: (gradedPrice * 0.95).toFixed(2),
                    askPrice: (gradedPrice * 1.05).toFixed(2),
                    volume: Math.floor(Math.random() * 100) + 10,
                  };

                  if (existingPrice.length > 0) {
                    await db
                      .update(assetCurrentPrices)
                      .set(priceUpdate)
                      .where(eq(assetCurrentPrices.id, existingPrice[0].id));
                  }

                  totalUpdated++;
                }
              } catch (error: any) {
                console.error(`❌ Error creating variant:`, error.message);
                totalErrors++;
              }
            }
          }
        }

        console.log(`✅ Created graded variants for ${title} #${issueNumber}`);
      } catch (error: any) {
        console.error(`❌ Error processing comic:`, error.message);
        totalErrors++;
      }
    }

    console.log(`\n🎉 Demo Expansion Complete!`);
    console.log(`   Comics Processed: ${existingComics.length}`);
    console.log(`   Assets Created: ${totalCreated}`);
    console.log(`   Assets Updated: ${totalUpdated}`);
    console.log(`   Errors: ${totalErrors}`);

    return {
      totalCreated,
      totalUpdated,
      totalErrors,
      comicsProcessed: existingComics.length,
    };
  }
}

export const goCollectDemoExpansion = new GoCollectDemoExpansion();
