"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coverOrchestrator = exports.CoverOrchestratorService = void 0;
const databaseStorage_1 = require("../databaseStorage");
const schema_1 = require("@shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
class CoverOrchestratorService {
    async getCharacterFirstAppearance(characterName) {
        const covers = await databaseStorage_1.db
            .select()
            .from(schema_1.comicCovers)
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.sql) `${schema_1.comicCovers.firstAppearanceOf} @> ARRAY[${characterName}]::text[]`, (0, drizzle_orm_1.sql) `${schema_1.comicCovers.significanceTags} @> ARRAY['first_appearance']::text[] AND ${schema_1.comicCovers.featuredCharacters} @> ARRAY[${characterName}]::text[]`))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.comicCovers.significanceTier))
            .limit(1);
        return covers[0] || null;
    }
    async getCharacterCovers(characterName, limit = 10) {
        return databaseStorage_1.db
            .select()
            .from(schema_1.comicCovers)
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.sql) `${schema_1.comicCovers.featuredCharacters} @> ARRAY[${characterName}]::text[]`, (0, drizzle_orm_1.sql) `${schema_1.comicCovers.firstAppearanceOf} @> ARRAY[${characterName}]::text[]`, (0, drizzle_orm_1.sql) `${schema_1.comicCovers.keyCharacterAppearances} @> ARRAY[${characterName}]::text[]`))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.comicCovers.significanceTier), (0, drizzle_orm_1.desc)(schema_1.comicCovers.collectedAt))
            .limit(limit);
    }
    async getKeyIssues(publisher, significanceTier = 1, limit = 50) {
        const conditions = [
            (0, drizzle_orm_1.sql) `${schema_1.comicCovers.significanceTier} <= ${significanceTier}`
        ];
        if (publisher) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.comicCovers.publisher, publisher));
        }
        return databaseStorage_1.db
            .select()
            .from(schema_1.comicCovers)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.comicCovers.significanceTier), (0, drizzle_orm_1.desc)(schema_1.comicCovers.collectedAt))
            .limit(limit);
    }
    async getSeriesCovers(series, volumeYear, limit = 100) {
        const conditions = [(0, drizzle_orm_1.eq)(schema_1.comicCovers.series, series)];
        if (volumeYear !== undefined) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.comicCovers.volumeYear, volumeYear));
        }
        return databaseStorage_1.db
            .select()
            .from(schema_1.comicCovers)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.comicCovers.issueNumber))
            .limit(limit);
    }
    async getCoversByTag(tags, limit = 50) {
        return databaseStorage_1.db
            .select()
            .from(schema_1.comicCovers)
            .where((0, drizzle_orm_1.sql) `${schema_1.comicCovers.significanceTags} && ARRAY[${drizzle_orm_1.sql.join(tags.map(t => (0, drizzle_orm_1.sql) `${t}`), (0, drizzle_orm_1.sql) `, `)}]::text[]`)
            .orderBy((0, drizzle_orm_1.asc)(schema_1.comicCovers.significanceTier))
            .limit(limit);
    }
    async searchCovers(query) {
        const conditions = [];
        const limit = query.limit || 50;
        const offset = query.offset || 0;
        if (query.publisher) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.comicCovers.publisher, query.publisher));
        }
        if (query.series) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.comicCovers.series, query.series));
        }
        if (query.issueNumber) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.comicCovers.issueNumber, query.issueNumber));
        }
        if (query.significanceTier !== undefined) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.comicCovers.significanceTier, query.significanceTier));
        }
        if (query.minTier !== undefined) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_1.comicCovers.significanceTier} >= ${query.minTier}`);
        }
        if (query.maxTier !== undefined) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_1.comicCovers.significanceTier} <= ${query.maxTier}`);
        }
        if (query.tags && query.tags.length > 0) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_1.comicCovers.significanceTags} && ARRAY[${drizzle_orm_1.sql.join(query.tags.map(t => (0, drizzle_orm_1.sql) `${t}`), (0, drizzle_orm_1.sql) `, `)}]::text[]`);
        }
        if (query.character) {
            conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.sql) `${schema_1.comicCovers.featuredCharacters} @> ARRAY[${query.character}]::text[]`, (0, drizzle_orm_1.sql) `${schema_1.comicCovers.firstAppearanceOf} @> ARRAY[${query.character}]::text[]`));
        }
        if (query.sourceType) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.comicCovers.sourceType, query.sourceType));
        }
        if (query.verificationStatus) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.comicCovers.verificationStatus, query.verificationStatus));
        }
        // Default orderClause - by significance tier, then most recent
        let orderClause = [(0, drizzle_orm_1.asc)(schema_1.comicCovers.significanceTier), (0, drizzle_orm_1.desc)(schema_1.comicCovers.collectedAt)];
        switch (query.orderBy) {
            case 'significance':
                orderClause = [(0, drizzle_orm_1.asc)(schema_1.comicCovers.significanceTier), (0, drizzle_orm_1.desc)(schema_1.comicCovers.collectedAt)];
                break;
            case 'date':
                orderClause = [(0, drizzle_orm_1.desc)(schema_1.comicCovers.collectedAt)];
                break;
            case 'series':
                orderClause = [(0, drizzle_orm_1.asc)(schema_1.comicCovers.series), (0, drizzle_orm_1.asc)(schema_1.comicCovers.issueNumber)];
                break;
            case 'issue':
                orderClause = [(0, drizzle_orm_1.asc)(schema_1.comicCovers.issueNumber)];
                break;
        }
        if (conditions.length > 0) {
            return databaseStorage_1.db
                .select()
                .from(schema_1.comicCovers)
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy(...orderClause)
                .limit(limit)
                .offset(offset);
        }
        else {
            return databaseStorage_1.db
                .select()
                .from(schema_1.comicCovers)
                .orderBy(...orderClause)
                .limit(limit)
                .offset(offset);
        }
    }
    async getCoverStats() {
        const allCovers = await databaseStorage_1.db.select().from(schema_1.comicCovers);
        const stats = {
            total: allCovers.length,
            byPublisher: {},
            byTier: {},
            bySource: {},
        };
        allCovers.forEach((cover) => {
            if (cover.publisher) {
                stats.byPublisher[cover.publisher] = (stats.byPublisher[cover.publisher] || 0) + 1;
            }
            if (cover.significanceTier !== null && cover.significanceTier !== undefined) {
                stats.byTier[cover.significanceTier] = (stats.byTier[cover.significanceTier] || 0) + 1;
            }
            if (cover.sourceType) {
                stats.bySource[cover.sourceType] = (stats.bySource[cover.sourceType] || 0) + 1;
            }
        });
        return stats;
    }
    async getCoverById(id) {
        const covers = await databaseStorage_1.db
            .select()
            .from(schema_1.comicCovers)
            .where((0, drizzle_orm_1.eq)(schema_1.comicCovers.id, id))
            .limit(1);
        return covers[0] || null;
    }
    async getCoverByIssue(publisher, series, issueNumber, volumeYear, variant = 'regular') {
        const conditions = [
            (0, drizzle_orm_1.eq)(schema_1.comicCovers.publisher, publisher),
            (0, drizzle_orm_1.eq)(schema_1.comicCovers.series, series),
            (0, drizzle_orm_1.eq)(schema_1.comicCovers.issueNumber, issueNumber),
            (0, drizzle_orm_1.eq)(schema_1.comicCovers.variant, variant),
        ];
        if (volumeYear !== undefined) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.comicCovers.volumeYear, volumeYear));
        }
        const covers = await databaseStorage_1.db
            .select()
            .from(schema_1.comicCovers)
            .where((0, drizzle_orm_1.and)(...conditions))
            .limit(1);
        return covers[0] || null;
    }
    async getHighestGradedCover(publisher, series, issueNumber, volumeYear) {
        const conditions = [
            (0, drizzle_orm_1.eq)(schema_1.comicCovers.publisher, publisher),
            (0, drizzle_orm_1.eq)(schema_1.comicCovers.series, series),
            (0, drizzle_orm_1.eq)(schema_1.comicCovers.issueNumber, issueNumber),
            (0, drizzle_orm_1.eq)(schema_1.comicCovers.isSlabbed, true),
        ];
        if (volumeYear !== undefined) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.comicCovers.volumeYear, volumeYear));
        }
        const covers = await databaseStorage_1.db
            .select()
            .from(schema_1.comicCovers)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.comicCovers.grade))
            .limit(1);
        return covers[0] || null;
    }
    async getRecentlyCollected(limit = 20) {
        return databaseStorage_1.db
            .select()
            .from(schema_1.comicCovers)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.comicCovers.collectedAt))
            .limit(limit);
    }
}
exports.CoverOrchestratorService = CoverOrchestratorService;
exports.coverOrchestrator = new CoverOrchestratorService();
