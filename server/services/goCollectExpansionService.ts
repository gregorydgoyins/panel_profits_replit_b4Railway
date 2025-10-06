import { db } from '../databaseStorage';
import { assets as assetsTable, assetCurrentPrices } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { goCollectService } from './goCollectService';

interface GradedAssetConfig {
  comicId: string;
  title: string;
  issueNumber: string;
  publisher: string;
  year: number;
  coverDate?: string;
}

interface GradedAsset {
  symbol: string;
  name: string;
  grade: string;
  grader: 'CGC' | 'CBCS' | 'PGX';
  labelType: 'Universal' | 'Restored' | 'Signature Series' | 'Qualified';
  price: number;
  volume: number;
  marketIndex: number;
}

const STANDARD_GRADES = [
  '10.0', '9.9', '9.8', '9.6', '9.4', '9.2', '9.0',
  '8.5', '8.0', '7.5', '7.0', '6.5', '6.0',
  '5.5', '5.0', '4.5', '4.0', '3.5', '3.0',
  '2.5', '2.0', '1.5', '1.0', '0.5'
];

const GRADERS: Array<'CGC' | 'CBCS' | 'PGX'> = ['CGC', 'CBCS', 'PGX'];

const LABEL_TYPES: Array<'Universal' | 'Restored' | 'Signature Series' | 'Qualified'> = [
  'Universal',
  'Restored', 
  'Signature Series',
  'Qualified'
];

export class GoCollectExpansionService {
  /**
   * Generate symbol for graded comic asset
   * Format: TITLE.#ISSUE.GRADER.GRADE[.LABEL]
   * Examples:
   *   - ASM.#1.CGC.9.8
   *   - ASM.#1.CGC.9.8.SS (Signature Series)
   *   - XMEN.#1.CBCS.9.6.R (Restored)
   */
  private generateGradedSymbol(
    title: string,
    issue: string,
    grader: string,
    grade: string,
    labelType?: string
  ): string {
    const titleCode = title
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 8)
      .toUpperCase();
    
    let symbol = `${titleCode}.#${issue}.${grader}.${grade}`;
    
    // Add label suffix for non-Universal
    if (labelType && labelType !== 'Universal') {
      const labelSuffix = {
        'Restored': 'R',
        'Signature Series': 'SS',
        'Qualified': 'Q'
      }[labelType];
      if (labelSuffix) {
        symbol += `.${labelSuffix}`;
      }
    }
    
    return symbol;
  }

  /**
   * Expand a single comic into all possible graded assets
   */
  async expandComicToGradedAssets(
    comic: GradedAssetConfig
  ): Promise<{ created: number; updated: number; errors: number }> {
    let created = 0;
    let updated = 0;
    let errors = 0;

    console.log(`🔍 Expanding ${comic.title} #${comic.issueNumber} into graded assets...`);

    // Get census data to know which grades actually exist
    const census = await goCollectService.getCensusDataByName(
      `${comic.title} ${comic.issueNumber}`
    );

    for (const grader of GRADERS) {
      for (const grade of STANDARD_GRADES) {
        for (const labelType of LABEL_TYPES) {
          try {
            const symbol = this.generateGradedSymbol(
              comic.title,
              comic.issueNumber,
              grader,
              grade,
              labelType
            );

            // Get market data for this specific grade/grader combo
            const marketData = await goCollectService.getMarketDataByIssue(
              comic.title,
              comic.issueNumber,
              grader
            );

            if (!marketData || marketData.salesCount === 0) {
              // Skip if no market data exists
              continue;
            }

            const name = `${comic.title} #${comic.issueNumber} - ${grader} ${grade}${
              labelType !== 'Universal' ? ` (${labelType})` : ''
            }`;

            const description = `${comic.publisher} - ${comic.title} #${comic.issueNumber} (${comic.year}) - Professionally graded ${grader} ${grade}${
              labelType !== 'Universal' ? ` - ${labelType} Label` : ''
            }`;

            // Check if asset exists
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
                title: comic.title,
                issueNumber: comic.issueNumber,
                publisher: comic.publisher,
                year: comic.year,
                coverDate: comic.coverDate,
                grade,
                grader,
                labelType,
                goCollectId: comic.comicId,
                source: 'gocollect',
                marketIndex: marketData.marketIndex,
                priceTrend: marketData.priceTrend,
              },
              verificationStatus: 'verified' as const,
              primaryDataSource: 'gocollect' as const,
              lastVerifiedAt: new Date(),
            };

            if (existing.length === 0) {
              const [newAsset] = await db.insert(assetsTable).values(assetData).returning();
              
              // Create price entry
              await db.insert(assetCurrentPrices).values({
                assetId: newAsset.id,
                currentPrice: marketData.avgPrice.toFixed(2),
                bidPrice: marketData.lowPrice.toFixed(2),
                askPrice: marketData.highPrice.toFixed(2),
                volume: marketData.salesCount,
                metadata: {
                  medianPrice: marketData.medianPrice,
                  grader,
                  grade,
                  labelType,
                  marketIndex: marketData.marketIndex,
                  trend: marketData.priceTrend,
                },
              });

              created++;
            } else {
              // Update existing asset
              await db
                .update(assetsTable)
                .set({
                  ...assetData,
                  id: existing[0].id,
                })
                .where(eq(assetsTable.id, existing[0].id));

              // Update price
              const existingPrice = await db
                .select()
                .from(assetCurrentPrices)
                .where(eq(assetCurrentPrices.assetId, existing[0].id))
                .limit(1);

              const priceData = {
                assetId: existing[0].id,
                currentPrice: marketData.avgPrice.toFixed(2),
                bidPrice: marketData.lowPrice.toFixed(2),
                askPrice: marketData.highPrice.toFixed(2),
                volume: marketData.salesCount,
                metadata: {
                  medianPrice: marketData.medianPrice,
                  grader,
                  grade,
                  labelType,
                  marketIndex: marketData.marketIndex,
                  trend: marketData.priceTrend,
                },
              };

              if (existingPrice.length === 0) {
                await db.insert(assetCurrentPrices).values(priceData);
              } else {
                await db
                  .update(assetCurrentPrices)
                  .set(priceData)
                  .where(eq(assetCurrentPrices.id, existingPrice[0].id));
              }

              updated++;
            }
          } catch (error: any) {
            console.error(`❌ Error creating graded asset:`, error.message);
            errors++;
          }
        }
      }
    }

    console.log(`✅ Expanded ${comic.title} #${comic.issueNumber}:`);
    console.log(`   Created: ${created} | Updated: ${updated} | Errors: ${errors}`);

    return { created, updated, errors };
  }

  /**
   * Bulk expansion: Import top N trending comics from GoCollect
   */
  async expandTrendingComics(limit = 100): Promise<{
    totalCreated: number;
    totalUpdated: number;
    totalErrors: number;
    comicsProcessed: number;
  }> {
    console.log(`🔥 Fetching top ${limit} trending graded comics from GoCollect...`);

    const trending = await goCollectService.getTrendingGradedComics(limit);

    if (trending.length === 0) {
      console.warn('⚠️ No trending comics found');
      return {
        totalCreated: 0,
        totalUpdated: 0,
        totalErrors: 0,
        comicsProcessed: 0,
      };
    }

    let totalCreated = 0;
    let totalUpdated = 0;
    let totalErrors = 0;
    let comicsProcessed = 0;

    for (const comic of trending) {
      try {
        const result = await this.expandComicToGradedAssets({
          comicId: `${comic.comicName}-${comic.issueNumber}`,
          title: comic.comicName,
          issueNumber: comic.issueNumber,
          publisher: comic.publisher,
          year: new Date().getFullYear(), // Default to current year
        });

        totalCreated += result.created;
        totalUpdated += result.updated;
        totalErrors += result.errors;
        comicsProcessed++;

        // Rate limiting: 1 comic per second to avoid API throttling
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error: any) {
        console.error(`❌ Error processing ${comic.comicName} #${comic.issueNumber}:`, error.message);
        totalErrors++;
      }
    }

    console.log(`\n🎉 GoCollect Expansion Complete!`);
    console.log(`   Comics Processed: ${comicsProcessed}`);
    console.log(`   Assets Created: ${totalCreated}`);
    console.log(`   Assets Updated: ${totalUpdated}`);
    console.log(`   Errors: ${totalErrors}`);

    return {
      totalCreated,
      totalUpdated,
      totalErrors,
      comicsProcessed,
    };
  }

  /**
   * Expand specific comic series (e.g., all Amazing Spider-Man issues)
   */
  async expandComicSeries(
    seriesName: string,
    startIssue = 1,
    endIssue = 100
  ): Promise<{
    totalCreated: number;
    totalUpdated: number;
    totalErrors: number;
  }> {
    console.log(`📚 Expanding ${seriesName} issues ${startIssue}-${endIssue}...`);

    let totalCreated = 0;
    let totalUpdated = 0;
    let totalErrors = 0;

    for (let issue = startIssue; issue <= endIssue; issue++) {
      try {
        const result = await this.expandComicToGradedAssets({
          comicId: `${seriesName}-${issue}`,
          title: seriesName,
          issueNumber: issue.toString(),
          publisher: 'Marvel', // TODO: Make this dynamic
          year: 1963, // TODO: Make this dynamic based on issue
        });

        totalCreated += result.created;
        totalUpdated += result.updated;
        totalErrors += result.errors;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error: any) {
        console.error(`❌ Error processing ${seriesName} #${issue}:`, error.message);
        totalErrors++;
      }
    }

    console.log(`\n✅ Series Expansion Complete for ${seriesName}!`);
    console.log(`   Total Assets Created: ${totalCreated}`);
    console.log(`   Total Assets Updated: ${totalUpdated}`);
    console.log(`   Total Errors: ${totalErrors}`);

    return { totalCreated, totalUpdated, totalErrors };
  }

  /**
   * Get statistics on graded assets
   */
  async getGradedAssetStats(): Promise<{
    totalGradedAssets: number;
    byCgrader: Record<string, number>;
    byLabelType: Record<string, number>;
    byGrade: Record<string, number>;
    averagePrice: number;
    totalMarketValue: number;
  }> {
    const gradedAssets = await db
      .select()
      .from(assetsTable)
      .where(eq(assetsTable.type, 'graded-comic'));

    const byGrader: Record<string, number> = {};
    const byLabelType: Record<string, number> = {};
    const byGrade: Record<string, number> = {};
    let totalValue = 0;

    for (const asset of gradedAssets) {
      const metadata = asset.metadata as any;
      
      if (metadata.grader) {
        byGrader[metadata.grader] = (byGrader[metadata.grader] || 0) + 1;
      }
      
      if (metadata.labelType) {
        byLabelType[metadata.labelType] = (byLabelType[metadata.labelType] || 0) + 1;
      }
      
      if (metadata.grade) {
        byGrade[metadata.grade] = (byGrade[metadata.grade] || 0) + 1;
      }

      // Get price
      const price = await db
        .select()
        .from(assetCurrentPrices)
        .where(eq(assetCurrentPrices.assetId, asset.id))
        .limit(1);

      if (price.length > 0) {
        totalValue += parseFloat(price[0].currentPrice);
      }
    }

    return {
      totalGradedAssets: gradedAssets.length,
      byCgrader: byGrader,
      byLabelType,
      byGrade,
      averagePrice: gradedAssets.length > 0 ? totalValue / gradedAssets.length : 0,
      totalMarketValue: totalValue,
    };
  }
}

export const goCollectExpansionService = new GoCollectExpansionService();
