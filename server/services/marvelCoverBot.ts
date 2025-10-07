import { MarvelApiService } from './marvelApiService';
import { ObjectStorageService } from '../objectStorage';
import { db } from '../databaseStorage';
import { comicCovers } from '@shared/schema';
import { eq, and, sql } from 'drizzle-orm';

interface CoverBotOptions {
  limit?: number;
  titleStartsWith?: string;
  noVariants?: boolean;
  skipExisting?: boolean;
}

interface CoverBotResult {
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  skippedCount: number;
  errors: Array<{ comicId: number; error: string }>;
}

export class MarvelCoverBot {
  private marvelApi: MarvelApiService;
  private objectStorage: ObjectStorageService;

  constructor() {
    this.marvelApi = new MarvelApiService();
    this.objectStorage = new ObjectStorageService();
  }

  async fetchAndStoreCovers(options: CoverBotOptions = {}): Promise<CoverBotResult> {
    const {
      limit = 20,
      titleStartsWith,
      noVariants = false,
      skipExisting = true
    } = options;

    console.log('[Marvel Bot] Starting cover collection...', { limit, titleStartsWith, noVariants });

    const result: CoverBotResult = {
      totalProcessed: 0,
      successCount: 0,
      failureCount: 0,
      skippedCount: 0,
      errors: [],
    };

    try {
      const response = await this.marvelApi.fetchComics({
        limit,
        titleStartsWith,
        noVariants,
        format: 'comic',
        orderBy: 'issueNumber',
      });

      console.log(`[Marvel Bot] Found ${response.data.count} comics to process`);

      for (const comic of response.data.results) {
        result.totalProcessed++;

        try {
          if (!comic.thumbnail || comic.thumbnail.path.includes('image_not_available')) {
            console.log(`[Marvel Bot] Skipping ${comic.title} - no image available`);
            result.skippedCount++;
            continue;
          }

          const { series, volumeYear } = this.marvelApi.extractSeriesName(comic.series.name);
          const publisher = this.marvelApi.extractPublisher(comic);
          const issueNumber = this.marvelApi.extractIssueNumber(comic);
          const variant = this.marvelApi.extractVariant(comic);

          if (skipExisting) {
            const existing = await db
              .select()
              .from(comicCovers)
              .where(
                and(
                  eq(comicCovers.publisher, publisher),
                  eq(comicCovers.series, series),
                  eq(comicCovers.issueNumber, issueNumber),
                  eq(comicCovers.variant, variant),
                  volumeYear 
                    ? eq(comicCovers.volumeYear, volumeYear)
                    : sql`${comicCovers.volumeYear} IS NULL`
                )
              )
              .limit(1);

            if (existing.length > 0) {
              console.log(`[Marvel Bot] Skipping ${comic.title} - already exists`);
              result.skippedCount++;
              continue;
            }
          }

          const imageUrl = this.marvelApi.getBestAvailableImage(comic);
          console.log(`[Marvel Bot] Downloading high-quality cover for ${comic.title}...`);

          const publicUrl = await this.objectStorage.uploadComicCoverFromURL(
            imageUrl,
            publisher,
            series,
            issueNumber,
            variant
          );

          const { tier, tags } = this.marvelApi.isKeyIssue(comic);
          const featuredCharacters = this.marvelApi.extractFeaturedCharacters(comic);

          const storagePath = `/public/covers/${publisher.toLowerCase().replace(/[^a-z0-9-]/g, '-')}/${series.toLowerCase().replace(/[^a-z0-9-]/g, '-')}/${issueNumber.toLowerCase().replace(/[^a-z0-9-]/g, '-')}_${variant.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.jpg`;

          await db.insert(comicCovers).values({
            publisher,
            series,
            issueNumber,
            variant,
            volumeYear,
            storagePath,
            imageUrl: publicUrl,
            sourceType: 'marvel_api',
            sourceId: comic.id.toString(),
            sourceUrl: imageUrl,
            sourceQuality: 'high',
            collectedBy: 'marvel_bot',
            significanceTier: tier,
            significanceTags: tags.length > 0 ? tags : null,
            featuredCharacters: featuredCharacters.length > 0 ? featuredCharacters : null,
            format: 'jpeg',
            verificationStatus: 'unverified',
          });

          console.log(`[Marvel Bot] ✓ Saved ${comic.title} (Tier ${tier})`);
          result.successCount++;

        } catch (error) {
          console.error(`[Marvel Bot] Failed to process comic ${comic.id}:`, error);
          result.failureCount++;
          result.errors.push({
            comicId: comic.id,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      console.log('[Marvel Bot] Collection complete:', result);
      return result;

    } catch (error) {
      console.error('[Marvel Bot] Fatal error:', error);
      throw error;
    }
  }

  async fetchKeyIssues(seriesTitle: string, limit: number = 50): Promise<CoverBotResult> {
    console.log(`[Marvel Bot] Fetching key issues for series: ${seriesTitle}`);
    
    const result: CoverBotResult = {
      totalProcessed: 0,
      successCount: 0,
      failureCount: 0,
      skippedCount: 0,
      errors: [],
    };

    try {
      const response = await this.marvelApi.fetchComics({
        titleStartsWith: seriesTitle,
        limit,
        noVariants: true,
        format: 'comic',
        orderBy: 'issueNumber',
      });

      for (const comic of response.data.results) {
        result.totalProcessed++;

        const issueNum = this.marvelApi.extractIssueNumber(comic);
        const { tier, tags } = this.marvelApi.isKeyIssue(comic);

        // Only store if it's a key issue (Tier 1 or 2)
        if (tier > 2) {
          console.log(`[Marvel Bot] Skipping ${comic.title} - not a key issue (Tier ${tier})`);
          result.skippedCount++;
          continue;
        }

        try {
          if (!comic.thumbnail || comic.thumbnail.path.includes('image_not_available')) {
            result.skippedCount++;
            continue;
          }

          const { series, volumeYear } = this.marvelApi.extractSeriesName(comic.series.name);
          const publisher = this.marvelApi.extractPublisher(comic);
          const variant = this.marvelApi.extractVariant(comic);

          const imageUrl = this.marvelApi.getBestAvailableImage(comic);
          const publicUrl = await this.objectStorage.uploadComicCoverFromURL(
            imageUrl,
            publisher,
            series,
            issueNum,
            variant
          );

          const featuredCharacters = this.marvelApi.extractFeaturedCharacters(comic);
          const storagePath = `/public/covers/${publisher.toLowerCase().replace(/[^a-z0-9-]/g, '-')}/${series.toLowerCase().replace(/[^a-z0-9-]/g, '-')}/${issueNum.toLowerCase().replace(/[^a-z0-9-]/g, '-')}_${variant.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.jpg`;

          await db.insert(comicCovers).values({
            publisher,
            series,
            issueNumber: issueNum,
            variant,
            volumeYear,
            storagePath,
            imageUrl: publicUrl,
            sourceType: 'marvel_api',
            sourceId: comic.id.toString(),
            sourceUrl: imageUrl,
            sourceQuality: 'high',
            collectedBy: 'marvel_bot',
            significanceTier: tier,
            significanceTags: tags.length > 0 ? tags : null,
            featuredCharacters: featuredCharacters.length > 0 ? featuredCharacters : null,
            format: 'jpeg',
            verificationStatus: 'unverified',
          });

          console.log(`[Marvel Bot] ✓ Saved key issue ${comic.title} (Tier ${tier})`);
          result.successCount++;

        } catch (error) {
          result.failureCount++;
          result.errors.push({
            comicId: comic.id,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      return result;
    } catch (error) {
      console.error('[Marvel Bot] Fatal error fetching key issues:', error);
      throw error;
    }
  }

  async fetchSeriesFirstIssues(seriesTitles: string[]): Promise<CoverBotResult> {
    console.log(`[Marvel Bot] Fetching #1 issues for ${seriesTitles.length} series`);
    
    const aggregateResult: CoverBotResult = {
      totalProcessed: 0,
      successCount: 0,
      failureCount: 0,
      skippedCount: 0,
      errors: [],
    };

    for (const title of seriesTitles) {
      try {
        const response = await this.marvelApi.fetchComics({
          titleStartsWith: title,
          limit: 20,
          noVariants: true,
          format: 'comic',
          orderBy: 'issueNumber',
        });

        // Filter for issue #1 only
        const firstIssue = response.data.results.find(comic => {
          const issueNum = this.marvelApi.extractIssueNumber(comic);
          return issueNum === '1';
        });

        if (!firstIssue) {
          console.log(`[Marvel Bot] No #1 issue found for ${title}`);
          aggregateResult.skippedCount++;
          continue;
        }

        aggregateResult.totalProcessed++;

        if (!firstIssue.thumbnail || firstIssue.thumbnail.path.includes('image_not_available')) {
          aggregateResult.skippedCount++;
          continue;
        }

        const { series, volumeYear } = this.marvelApi.extractSeriesName(firstIssue.series.name);
        const publisher = this.marvelApi.extractPublisher(firstIssue);
        const issueNum = this.marvelApi.extractIssueNumber(firstIssue);
        const variant = this.marvelApi.extractVariant(firstIssue);

        const imageUrl = this.marvelApi.getBestAvailableImage(firstIssue);
        const publicUrl = await this.objectStorage.uploadComicCoverFromURL(
          imageUrl,
          publisher,
          series,
          issueNum,
          variant
        );

        const { tier, tags } = this.marvelApi.isKeyIssue(firstIssue);
        const featuredCharacters = this.marvelApi.extractFeaturedCharacters(firstIssue);
        const storagePath = `/public/covers/${publisher.toLowerCase().replace(/[^a-z0-9-]/g, '-')}/${series.toLowerCase().replace(/[^a-z0-9-]/g, '-')}/${issueNum.toLowerCase().replace(/[^a-z0-9-]/g, '-')}_${variant.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.jpg`;

        await db.insert(comicCovers).values({
          publisher,
          series,
          issueNumber: issueNum,
          variant,
          volumeYear,
          storagePath,
          imageUrl: publicUrl,
          sourceType: 'marvel_api',
          sourceId: firstIssue.id.toString(),
          sourceUrl: imageUrl,
          sourceQuality: 'high',
          collectedBy: 'marvel_bot',
          significanceTier: tier,
          significanceTags: tags.length > 0 ? [...tags, 'first_issue'] : ['first_issue'],
          featuredCharacters: featuredCharacters.length > 0 ? featuredCharacters : null,
          format: 'jpeg',
          verificationStatus: 'unverified',
        });

        console.log(`[Marvel Bot] ✓ Saved #1 issue: ${firstIssue.title}`);
        aggregateResult.successCount++;

        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`[Marvel Bot] Failed to fetch #1 for ${title}:`, error);
        aggregateResult.failureCount++;
        aggregateResult.errors.push({
          comicId: 0,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return aggregateResult;
  }

  async getCoverStats(): Promise<{
    total: number;
    byPublisher: Record<string, number>;
    byTier: Record<number, number>;
    bySource: Record<string, number>;
  }> {
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(comicCovers);

    const byPublisher = await db
      .select({
        publisher: comicCovers.publisher,
        count: sql<number>`count(*)`,
      })
      .from(comicCovers)
      .groupBy(comicCovers.publisher);

    const byTier = await db
      .select({
        tier: comicCovers.significanceTier,
        count: sql<number>`count(*)`,
      })
      .from(comicCovers)
      .groupBy(comicCovers.significanceTier);

    const bySource = await db
      .select({
        source: comicCovers.sourceType,
        count: sql<number>`count(*)`,
      })
      .from(comicCovers)
      .groupBy(comicCovers.sourceType);

    return {
      total: Number(totalResult.count),
      byPublisher: Object.fromEntries(
        byPublisher.map(r => [r.publisher, Number(r.count)])
      ),
      byTier: Object.fromEntries(
        byTier.map(r => [r.tier || 3, Number(r.count)])
      ),
      bySource: Object.fromEntries(
        bySource.map(r => [r.source, Number(r.count)])
      ),
    };
  }
}
