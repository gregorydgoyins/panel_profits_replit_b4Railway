import { db } from "../databaseStorage";
import { comicCovers, type ComicCover } from "@shared/schema";
import { eq, and, or, desc, asc, sql, inArray } from "drizzle-orm";

export interface CoverQuery {
  publisher?: string;
  series?: string;
  issueNumber?: string;
  significanceTier?: number;
  minTier?: number;
  maxTier?: number;
  tags?: string[];
  character?: string;
  sourceType?: string;
  verificationStatus?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'significance' | 'date' | 'series' | 'issue';
}

export class CoverOrchestratorService {
  
  async getCharacterFirstAppearance(characterName: string): Promise<ComicCover | null> {
    const covers = await db
      .select()
      .from(comicCovers)
      .where(
        or(
          sql`${comicCovers.firstAppearanceOf} @> ARRAY[${characterName}]::text[]`,
          sql`${comicCovers.significanceTags} @> ARRAY['first_appearance']::text[] AND ${comicCovers.featuredCharacters} @> ARRAY[${characterName}]::text[]`
        )
      )
      .orderBy(asc(comicCovers.significanceTier))
      .limit(1);

    return covers[0] || null;
  }

  async getCharacterCovers(characterName: string, limit: number = 10): Promise<ComicCover[]> {
    return db
      .select()
      .from(comicCovers)
      .where(
        or(
          sql`${comicCovers.featuredCharacters} @> ARRAY[${characterName}]::text[]`,
          sql`${comicCovers.firstAppearanceOf} @> ARRAY[${characterName}]::text[]`,
          sql`${comicCovers.keyCharacterAppearances} @> ARRAY[${characterName}]::text[]`
        )
      )
      .orderBy(asc(comicCovers.significanceTier), desc(comicCovers.collectedAt))
      .limit(limit);
  }

  async getKeyIssues(publisher?: string, significanceTier: number = 1, limit: number = 50): Promise<ComicCover[]> {
    const conditions = [
      sql`${comicCovers.significanceTier} <= ${significanceTier}`
    ];

    if (publisher) {
      conditions.push(eq(comicCovers.publisher, publisher));
    }

    return db
      .select()
      .from(comicCovers)
      .where(and(...conditions))
      .orderBy(asc(comicCovers.significanceTier), desc(comicCovers.collectedAt))
      .limit(limit);
  }

  async getSeriesCovers(series: string, volumeYear?: number, limit: number = 100): Promise<ComicCover[]> {
    const conditions = [eq(comicCovers.series, series)];

    if (volumeYear !== undefined) {
      conditions.push(eq(comicCovers.volumeYear, volumeYear));
    }

    return db
      .select()
      .from(comicCovers)
      .where(and(...conditions))
      .orderBy(asc(comicCovers.issueNumber))
      .limit(limit);
  }

  async getCoversByTag(tags: string[], limit: number = 50): Promise<ComicCover[]> {
    return db
      .select()
      .from(comicCovers)
      .where(
        sql`${comicCovers.significanceTags} && ARRAY[${sql.join(tags.map(t => sql`${t}`), sql`, `)}]::text[]`
      )
      .orderBy(asc(comicCovers.significanceTier))
      .limit(limit);
  }

  async searchCovers(query: CoverQuery): Promise<ComicCover[]> {
    const conditions = [];
    const limit = query.limit || 50;
    const offset = query.offset || 0;

    if (query.publisher) {
      conditions.push(eq(comicCovers.publisher, query.publisher));
    }

    if (query.series) {
      conditions.push(eq(comicCovers.series, query.series));
    }

    if (query.issueNumber) {
      conditions.push(eq(comicCovers.issueNumber, query.issueNumber));
    }

    if (query.significanceTier !== undefined) {
      conditions.push(eq(comicCovers.significanceTier, query.significanceTier));
    }

    if (query.minTier !== undefined) {
      conditions.push(sql`${comicCovers.significanceTier} >= ${query.minTier}`);
    }

    if (query.maxTier !== undefined) {
      conditions.push(sql`${comicCovers.significanceTier} <= ${query.maxTier}`);
    }

    if (query.tags && query.tags.length > 0) {
      conditions.push(
        sql`${comicCovers.significanceTags} && ARRAY[${sql.join(query.tags.map(t => sql`${t}`), sql`, `)}]::text[]`
      );
    }

    if (query.character) {
      conditions.push(
        or(
          sql`${comicCovers.featuredCharacters} @> ARRAY[${query.character}]::text[]`,
          sql`${comicCovers.firstAppearanceOf} @> ARRAY[${query.character}]::text[]`
        )
      );
    }

    if (query.sourceType) {
      conditions.push(eq(comicCovers.sourceType, query.sourceType));
    }

    if (query.verificationStatus) {
      conditions.push(eq(comicCovers.verificationStatus, query.verificationStatus));
    }

    // Default orderClause - by significance tier, then most recent
    let orderClause = [asc(comicCovers.significanceTier), desc(comicCovers.collectedAt)];
    
    switch (query.orderBy) {
      case 'significance':
        orderClause = [asc(comicCovers.significanceTier), desc(comicCovers.collectedAt)];
        break;
      case 'date':
        orderClause = [desc(comicCovers.collectedAt)];
        break;
      case 'series':
        orderClause = [asc(comicCovers.series), asc(comicCovers.issueNumber)];
        break;
      case 'issue':
        orderClause = [asc(comicCovers.issueNumber)];
        break;
    }

    if (conditions.length > 0) {
      return db
        .select()
        .from(comicCovers)
        .where(and(...conditions))
        .orderBy(...orderClause)
        .limit(limit)
        .offset(offset);
    } else {
      return db
        .select()
        .from(comicCovers)
        .orderBy(...orderClause)
        .limit(limit)
        .offset(offset);
    }
  }

  async getCoverStats(): Promise<{
    total: number;
    byPublisher: Record<string, number>;
    byTier: Record<number, number>;
    bySource: Record<string, number>;
  }> {
    const allCovers = await db.select().from(comicCovers);

    const stats = {
      total: allCovers.length,
      byPublisher: {} as Record<string, number>,
      byTier: {} as Record<number, number>,
      bySource: {} as Record<string, number>,
    };

    allCovers.forEach((cover: ComicCover) => {
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

  async getCoverById(id: string): Promise<ComicCover | null> {
    const covers = await db
      .select()
      .from(comicCovers)
      .where(eq(comicCovers.id, id))
      .limit(1);

    return covers[0] || null;
  }

  async getCoverByIssue(
    publisher: string, 
    series: string, 
    issueNumber: string, 
    volumeYear?: number,
    variant: string = 'regular'
  ): Promise<ComicCover | null> {
    const conditions = [
      eq(comicCovers.publisher, publisher),
      eq(comicCovers.series, series),
      eq(comicCovers.issueNumber, issueNumber),
      eq(comicCovers.variant, variant),
    ];

    if (volumeYear !== undefined) {
      conditions.push(eq(comicCovers.volumeYear, volumeYear));
    }

    const covers = await db
      .select()
      .from(comicCovers)
      .where(and(...conditions))
      .limit(1);

    return covers[0] || null;
  }

  async getHighestGradedCover(
    publisher: string,
    series: string,
    issueNumber: string,
    volumeYear?: number
  ): Promise<ComicCover | null> {
    const conditions = [
      eq(comicCovers.publisher, publisher),
      eq(comicCovers.series, series),
      eq(comicCovers.issueNumber, issueNumber),
      eq(comicCovers.isSlabbed, true),
    ];

    if (volumeYear !== undefined) {
      conditions.push(eq(comicCovers.volumeYear, volumeYear));
    }

    const covers = await db
      .select()
      .from(comicCovers)
      .where(and(...conditions))
      .orderBy(desc(comicCovers.grade))
      .limit(1);

    return covers[0] || null;
  }

  async getRecentlyCollected(limit: number = 20): Promise<ComicCover[]> {
    return db
      .select()
      .from(comicCovers)
      .orderBy(desc(comicCovers.collectedAt))
      .limit(limit);
  }
}

export const coverOrchestrator = new CoverOrchestratorService();
