"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarvelCoverBot = void 0;
const marvelApiService_1 = require("./marvelApiService");
const objectStorage_1 = require("../objectStorage");
const databaseStorage_1 = require("../databaseStorage");
const schema_1 = require("@shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
class MarvelCoverBot {
    constructor() {
        this.marvelApi = new marvelApiService_1.MarvelApiService();
        this.objectStorage = new objectStorage_1.ObjectStorageService();
    }
    async fetchAndStoreCovers(options = {}) {
        const { limit = 20, titleStartsWith, noVariants = false, skipExisting = true } = options;
        console.log('[Marvel Bot] Starting cover collection...', { limit, titleStartsWith, noVariants });
        const result = {
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
                        const existing = await databaseStorage_1.db
                            .select()
                            .from(schema_1.comicCovers)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.comicCovers.publisher, publisher), (0, drizzle_orm_1.eq)(schema_1.comicCovers.series, series), (0, drizzle_orm_1.eq)(schema_1.comicCovers.issueNumber, issueNumber), (0, drizzle_orm_1.eq)(schema_1.comicCovers.variant, variant), volumeYear
                            ? (0, drizzle_orm_1.eq)(schema_1.comicCovers.volumeYear, volumeYear)
                            : (0, drizzle_orm_1.sql) `${schema_1.comicCovers.volumeYear} IS NULL`))
                            .limit(1);
                        if (existing.length > 0) {
                            console.log(`[Marvel Bot] Skipping ${comic.title} - already exists`);
                            result.skippedCount++;
                            continue;
                        }
                    }
                    const imageUrl = this.marvelApi.getBestAvailableImage(comic);
                    console.log(`[Marvel Bot] Downloading high-quality cover for ${comic.title}...`);
                    const publicUrl = await this.objectStorage.uploadComicCoverFromURL(imageUrl, publisher, series, issueNumber, variant);
                    const { tier, tags } = this.marvelApi.isKeyIssue(comic);
                    const featuredCharacters = this.marvelApi.extractFeaturedCharacters(comic);
                    const storagePath = `/public/covers/${publisher.toLowerCase().replace(/[^a-z0-9-]/g, '-')}/${series.toLowerCase().replace(/[^a-z0-9-]/g, '-')}/${issueNumber.toLowerCase().replace(/[^a-z0-9-]/g, '-')}_${variant.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.jpg`;
                    await databaseStorage_1.db.insert(schema_1.comicCovers).values({
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
                }
                catch (error) {
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
        }
        catch (error) {
            console.error('[Marvel Bot] Fatal error:', error);
            throw error;
        }
    }
    async fetchKeyIssues(seriesTitle, limit = 50) {
        console.log(`[Marvel Bot] Fetching key issues for series: ${seriesTitle}`);
        const result = {
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
                    const publicUrl = await this.objectStorage.uploadComicCoverFromURL(imageUrl, publisher, series, issueNum, variant);
                    const featuredCharacters = this.marvelApi.extractFeaturedCharacters(comic);
                    const storagePath = `/public/covers/${publisher.toLowerCase().replace(/[^a-z0-9-]/g, '-')}/${series.toLowerCase().replace(/[^a-z0-9-]/g, '-')}/${issueNum.toLowerCase().replace(/[^a-z0-9-]/g, '-')}_${variant.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.jpg`;
                    await databaseStorage_1.db.insert(schema_1.comicCovers).values({
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
                }
                catch (error) {
                    result.failureCount++;
                    result.errors.push({
                        comicId: comic.id,
                        error: error instanceof Error ? error.message : String(error),
                    });
                }
            }
            return result;
        }
        catch (error) {
            console.error('[Marvel Bot] Fatal error fetching key issues:', error);
            throw error;
        }
    }
    async fetchSeriesFirstIssues(seriesTitles) {
        console.log(`[Marvel Bot] Fetching #1 issues for ${seriesTitles.length} series`);
        const aggregateResult = {
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
                const publicUrl = await this.objectStorage.uploadComicCoverFromURL(imageUrl, publisher, series, issueNum, variant);
                const { tier, tags } = this.marvelApi.isKeyIssue(firstIssue);
                const featuredCharacters = this.marvelApi.extractFeaturedCharacters(firstIssue);
                const storagePath = `/public/covers/${publisher.toLowerCase().replace(/[^a-z0-9-]/g, '-')}/${series.toLowerCase().replace(/[^a-z0-9-]/g, '-')}/${issueNum.toLowerCase().replace(/[^a-z0-9-]/g, '-')}_${variant.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.jpg`;
                await databaseStorage_1.db.insert(schema_1.comicCovers).values({
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
            }
            catch (error) {
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
    async getCoverStats() {
        const [totalResult] = await databaseStorage_1.db
            .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.comicCovers);
        const byPublisher = await databaseStorage_1.db
            .select({
            publisher: schema_1.comicCovers.publisher,
            count: (0, drizzle_orm_1.sql) `count(*)`,
        })
            .from(schema_1.comicCovers)
            .groupBy(schema_1.comicCovers.publisher);
        const byTier = await databaseStorage_1.db
            .select({
            tier: schema_1.comicCovers.significanceTier,
            count: (0, drizzle_orm_1.sql) `count(*)`,
        })
            .from(schema_1.comicCovers)
            .groupBy(schema_1.comicCovers.significanceTier);
        const bySource = await databaseStorage_1.db
            .select({
            source: schema_1.comicCovers.sourceType,
            count: (0, drizzle_orm_1.sql) `count(*)`,
        })
            .from(schema_1.comicCovers)
            .groupBy(schema_1.comicCovers.sourceType);
        return {
            total: Number(totalResult.count),
            byPublisher: Object.fromEntries(byPublisher.map(r => [r.publisher, Number(r.count)])),
            byTier: Object.fromEntries(byTier.map(r => [r.tier || 3, Number(r.count)])),
            bySource: Object.fromEntries(bySource.map(r => [r.source, Number(r.count)])),
        };
    }
}
exports.MarvelCoverBot = MarvelCoverBot;
