"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comicAssetService = exports.ComicAssetService = void 0;
const databaseStorage_1 = require("../databaseStorage");
const schema_1 = require("@shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
class ComicAssetService {
    formatTickerSymbol(baseSymbol, assetType, metadata) {
        // Stock: 4-character symbol (e.g., SPDR)
        if (assetType === 'character' || assetType === 'comic' || assetType === 'creator' || assetType === 'publisher') {
            return baseSymbol.substring(0, 4).toUpperCase().padEnd(4, 'X');
        }
        // Option: TICK.MM.YEAR C/P (e.g., SPDR.03.2025 C)
        if (assetType === 'option' && metadata) {
            const ticker = baseSymbol.substring(0, 4).toUpperCase().padEnd(4, 'X');
            const month = (metadata.expirationMonth || 1).toString().padStart(2, '0');
            const year = metadata.expirationYear || 2025;
            const type = metadata.optionType || 'C';
            return `${ticker}.${month}.${year} ${type}`;
        }
        // Bond: TICK.MONTH.YEAR.YIELD (e.g., MRVL.MAR.2025.4.5)
        if (assetType === 'bond' && metadata) {
            const ticker = baseSymbol.substring(0, 4).toUpperCase().padEnd(4, 'X');
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const month = metadata.bondMonth || monthNames[0];
            const year = metadata.bondYear || 2025;
            const yieldRate = metadata.yieldRate || 4.5;
            return `${ticker}.${month}.${year}.${yieldRate}`;
        }
        return baseSymbol.substring(0, 4).toUpperCase().padEnd(4, 'X');
    }
    async getTopComicAssets(limit = 20) {
        // Get top traded assets (all types: stocks, options, bonds, comics)
        const assetData = await databaseStorage_1.db
            .select({
            id: schema_1.assets.id,
            symbol: schema_1.assets.symbol,
            name: schema_1.assets.name,
            imageUrl: schema_1.assets.imageUrl,
            type: schema_1.assets.type,
            description: schema_1.assets.description,
            metadata: schema_1.assets.metadata,
            currentPrice: schema_1.assetCurrentPrices.currentPrice,
            dayChange: schema_1.assetCurrentPrices.dayChange,
            dayChangePercent: schema_1.assetCurrentPrices.dayChangePercent,
            volume: schema_1.assetCurrentPrices.volume,
            marketStatus: schema_1.assetCurrentPrices.marketStatus,
        })
            .from(schema_1.assets)
            .leftJoin(schema_1.assetCurrentPrices, (0, drizzle_orm_1.eq)(schema_1.assets.id, schema_1.assetCurrentPrices.assetId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.assetCurrentPrices.volume))
            .limit(limit);
        // Enrich with asset data
        const enrichedAssets = await Promise.all(assetData.map(async (asset) => {
            // Try to get comic issue details for cover and historical info
            const comicDetails = await databaseStorage_1.db
                .select()
                .from(schema_1.comicIssues)
                .where((0, drizzle_orm_1.eq)(schema_1.comicIssues.id, asset.id))
                .limit(1);
            const comic = comicDetails[0];
            const metadata = asset.metadata || {};
            // Format symbol based on asset type
            const formattedSymbol = this.formatTickerSymbol(asset.symbol, asset.type, metadata);
            // Determine asset type category
            const assetType = (['option', 'bond'].includes(asset.type)
                ? asset.type
                : 'stock');
            return {
                id: asset.id,
                symbol: formattedSymbol,
                name: asset.name,
                assetType,
                coverImageUrl: comic?.coverImageUrl || asset.imageUrl,
                currentPrice: parseFloat(asset.currentPrice || '0'),
                dayChange: parseFloat(asset.dayChange || '0'),
                dayChangePercent: parseFloat(asset.dayChangePercent || '0'),
                volume: asset.volume || 0,
                marketTrend: this.determineMarketTrend(parseFloat(asset.dayChangePercent || '0')),
                historicalSignificance: this.extractHistoricalSignificance(metadata, comic),
                whySpecial: this.extractWhySpecial(metadata, comic),
                gradeCondition: comic?.gradeCondition || undefined,
                firstAppearance: metadata.firstAppearance,
                keyCreators: this.extractCreators(comic),
                publisher: metadata.publisher || comic?.imprint,
                // Option-specific
                optionType: metadata.optionType,
                expirationMonth: metadata.expirationMonth,
                expirationYear: metadata.expirationYear,
                // Bond-specific
                bondMonth: metadata.bondMonth,
                bondYear: metadata.bondYear,
                yieldRate: metadata.yieldRate
            };
        }));
        return enrichedAssets;
    }
    async getComicPriceHistory(assetId, days = 30) {
        const asset = await databaseStorage_1.db
            .select()
            .from(schema_1.assets)
            .where((0, drizzle_orm_1.eq)(schema_1.assets.id, assetId))
            .limit(1);
        if (!asset.length)
            return null;
        // Get historical price data from market_data table
        const historicalData = await databaseStorage_1.db
            .select({
            periodStart: schema_1.marketData.periodStart,
            close: schema_1.marketData.close,
        })
            .from(schema_1.marketData)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.marketData.assetId, assetId), (0, drizzle_orm_1.eq)(schema_1.marketData.timeframe, '1d')))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.marketData.periodStart))
            .limit(days);
        return {
            assetId: asset[0].id,
            symbol: asset[0].symbol,
            name: asset[0].name,
            priceHistory: historicalData.map(d => ({
                timestamp: d.periodStart,
                price: parseFloat(d.close),
                // Could add event annotations here based on metadata
            }))
        };
    }
    async getComicHeatMap() {
        // Aggregate price changes by publisher and character
        const heatMapData = await databaseStorage_1.db
            .select({
            symbol: schema_1.assets.symbol,
            name: schema_1.assets.name,
            metadata: schema_1.assets.metadata,
            dayChangePercent: schema_1.assetCurrentPrices.dayChangePercent,
            volume: schema_1.assetCurrentPrices.volume,
        })
            .from(schema_1.assets)
            .leftJoin(schema_1.assetCurrentPrices, (0, drizzle_orm_1.eq)(schema_1.assets.id, schema_1.assetCurrentPrices.assetId))
            .where((0, drizzle_orm_1.eq)(schema_1.assets.type, 'character'))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.assetCurrentPrices.volume));
        return heatMapData.map(item => {
            const metadata = item.metadata || {};
            const priceChange = parseFloat(item.dayChangePercent || '0');
            return {
                publisher: metadata.publisher || 'Unknown',
                character: item.name,
                era: metadata.era || metadata.decade,
                priceChange,
                volume: item.volume || 0,
                color: this.getHeatMapColor(priceChange)
            };
        });
    }
    determineMarketTrend(changePercent) {
        if (changePercent > 1)
            return 'up';
        if (changePercent < -1)
            return 'down';
        return 'stable';
    }
    extractHistoricalSignificance(metadata, comic) {
        if (!metadata && !comic)
            return 'A collectible comic book asset';
        const parts = [];
        if (metadata.firstAppearance) {
            parts.push(`First appearance of ${metadata.firstAppearance}`);
        }
        if (metadata.historicalEvent) {
            parts.push(metadata.historicalEvent);
        }
        if (comic?.issueDescription) {
            parts.push(comic.issueDescription);
        }
        return parts.join('. ') || 'A valuable comic book asset';
    }
    extractWhySpecial(metadata, comic) {
        const reasons = [];
        if (metadata.keyIssue) {
            reasons.push('Key Issue');
        }
        if (metadata.movieTieIn) {
            reasons.push(`Movie: ${metadata.movieTieIn}`);
        }
        if (comic?.coverArtist && comic.coverArtist !== 'Unknown') {
            reasons.push(`Cover by ${comic.coverArtist}`);
        }
        if (metadata.variant) {
            reasons.push('Rare Variant');
        }
        if (metadata.limitedPrint) {
            reasons.push('Limited Print Run');
        }
        return reasons.join(' • ') || 'Collectible comic asset';
    }
    extractCreators(comic) {
        if (!comic)
            return [];
        const creators = [];
        if (comic.writer && comic.writer !== 'Unknown')
            creators.push(comic.writer);
        if (comic.penciler && comic.penciler !== 'Unknown')
            creators.push(comic.penciler);
        if (comic.coverArtist && comic.coverArtist !== 'Unknown')
            creators.push(comic.coverArtist);
        return Array.from(new Set(creators)); // Remove duplicates
    }
    getHeatMapColor(changePercent) {
        if (changePercent > 5)
            return '#22c55e'; // Strong green
        if (changePercent > 2)
            return '#86efac'; // Light green
        if (changePercent > 0)
            return '#dcfce7'; // Very light green
        if (changePercent === 0)
            return '#9ca3af'; // Gray
        if (changePercent > -2)
            return '#fecaca'; // Light red
        if (changePercent > -5)
            return '#f87171'; // Medium red
        return '#ef4444'; // Strong red
    }
}
exports.ComicAssetService = ComicAssetService;
exports.comicAssetService = new ComicAssetService();
