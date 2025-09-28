import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { storage } from '../storage';
import type { InsertComicSeries, InsertComicIssue, InsertComicCreator } from '@shared/schema';

interface ComicSeriesCSVRow {
  Series: string;
  Year: string;
  Issues: string;
  Covers: string;
  Published: string;
  'Series Link': string;
  'Covers1 Link': string;
  'Covers2 Link': string;
}

interface ComicIssueCSVRow {
  comic_name: string;
  active_years: string;
  issue_title: string;
  publish_date: string;
  issue_description: string;
  penciler: string;
  writer: string;
  cover_artist: string;
  Imprint: string;
  Format: string;
  Rating: string;
  Price: string;
}

export class ComicDataImportService {
  // Parse and extract publisher from series name (e.g., "Marvel Comics [m]" -> publisher: "Marvel")
  private static extractPublisher(seriesName: string): string {
    if (seriesName.includes('[m]') || seriesName.toLowerCase().includes('marvel')) {
      return 'Marvel';
    }
    if (seriesName.includes('[dc]') || seriesName.toLowerCase().includes('dc comics')) {
      return 'DC';
    }
    // Default to Marvel for the provided dataset
    return 'Marvel';
  }

  // Parse year from string (e.g., "1939" -> 1939)
  private static parseYear(yearStr: string): number | null {
    const match = yearStr.match(/(\d{4})/);
    return match ? parseInt(match[1]) : null;
  }

  // Extract issue count number (e.g., "73 issues (73 indexed)" -> 73)
  private static parseIssueCount(issuesStr: string): number | null {
    const match = issuesStr.match(/(\d+)\s+issues/);
    return match ? parseInt(match[1]) : null;
  }

  // Generate cover URL from covers link
  private static generateCoverUrl(coversLink: string): string | null {
    if (!coversLink || coversLink.trim() === '') return null;
    return coversLink;
  }

  // Parse comic series from CSV
  static async importComicSeriesFromCSV(csvFilePath: string): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;

    try {
      const csvContent = readFileSync(csvFilePath, 'utf-8');
      const records: ComicSeriesCSVRow[] = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      console.log(`Processing ${records.length} comic series records...`);

      // Process in batches to avoid memory issues
      const batchSize = 100;
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        const seriesToInsert: InsertComicSeries[] = [];

        for (const record of batch) {
          try {
            const publisher = this.extractPublisher(record.Series);
            const year = this.parseYear(record.Year);
            const issueCount = this.parseIssueCount(record.Issues);
            const coversUrl = this.generateCoverUrl(record['Covers1 Link']);

            const series: InsertComicSeries = {
              seriesName: record.Series.replace(/\s*\[m\]\s*$/, '').trim(),
              publisher,
              year,
              issueCount: record.Issues,
              coverStatus: record.Covers,
              publishedPeriod: record.Published,
              seriesUrl: record['Series Link'],
              coversUrl: record['Covers1 Link'],
              scansUrl: record['Covers2 Link'] || undefined,
              featuredCoverUrl: coversUrl,
              description: `${record.Series} (${record.Published})`,
            };

            seriesToInsert.push(series);
          } catch (error) {
            errors.push(`Error processing series "${record.Series}": ${error.message}`);
          }
        }

        // Bulk insert the batch
        if (seriesToInsert.length > 0) {
          try {
            await storage.createBulkComicSeries(seriesToInsert);
            imported += seriesToInsert.length;
            console.log(`Imported batch ${Math.floor(i/batchSize) + 1}: ${seriesToInsert.length} series`);
          } catch (error) {
            errors.push(`Batch import error at records ${i}-${i + batchSize}: ${error.message}`);
          }
        }
      }

      console.log(`Comic series import completed: ${imported} imported, ${errors.length} errors`);
      return { imported, errors };

    } catch (error) {
      const errorMsg = `Failed to read or parse CSV file: ${error.message}`;
      console.error(errorMsg);
      return { imported: 0, errors: [errorMsg] };
    }
  }

  // Parse comic issues from CSV
  static async importComicIssuesFromCSV(csvFilePath: string): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;

    try {
      const csvContent = readFileSync(csvFilePath, 'utf-8');
      const records: ComicIssueCSVRow[] = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      console.log(`Processing ${records.length} comic issue records...`);

      // Get existing series to match issues
      const existingSeries = await storage.getComicSeriesList();
      const seriesMap = new Map<string, string>();
      
      existingSeries.forEach(series => {
        seriesMap.set(series.seriesName.toLowerCase(), series.id);
      });

      // Process in batches
      const batchSize = 100;
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        const issuesToInsert: InsertComicIssue[] = [];

        for (const record of batch) {
          try {
            // Try to match to existing series
            const seriesKey = record.comic_name.toLowerCase();
            const seriesId = seriesMap.get(seriesKey);

            // Parse issue number from title
            const issueMatch = record.issue_title.match(/#(\d+)/);
            const issueNumber = issueMatch ? parseInt(issueMatch[1]) : null;

            // Generate cover URL (placeholder logic - would need real cover URL mapping)
            const coverImageUrl = `https://www.comics.org/issue/covers/${record.comic_name.toLowerCase().replace(/\s+/g, '-')}/${issueNumber || 1}/`;

            const issue: InsertComicIssue = {
              seriesId: seriesId || undefined,
              comicName: record.comic_name,
              activeYears: record.active_years,
              issueTitle: record.issue_title,
              publishDate: record.publish_date,
              issueDescription: record.issue_description,
              penciler: record.penciler || undefined,
              writer: record.writer || undefined,
              coverArtist: record.cover_artist || undefined,
              imprint: record.Imprint || undefined,
              format: record.Format || undefined,
              rating: record.Rating || undefined,
              price: record.Price || undefined,
              coverImageUrl,
              issueNumber,
              currentValue: this.parsePrice(record.Price),
              marketTrend: 'stable',
            };

            issuesToInsert.push(issue);

            // Create creators if they don't exist
            await this.createCreatorsFromIssue(record);

          } catch (error) {
            errors.push(`Error processing issue "${record.issue_title}": ${error.message}`);
          }
        }

        // Bulk insert the batch
        if (issuesToInsert.length > 0) {
          try {
            await storage.createBulkComicIssues(issuesToInsert);
            imported += issuesToInsert.length;
            console.log(`Imported batch ${Math.floor(i/batchSize) + 1}: ${issuesToInsert.length} issues`);
          } catch (error) {
            errors.push(`Batch import error at records ${i}-${i + batchSize}: ${error.message}`);
          }
        }
      }

      console.log(`Comic issues import completed: ${imported} imported, ${errors.length} errors`);
      return { imported, errors };

    } catch (error) {
      const errorMsg = `Failed to read or parse CSV file: ${error.message}`;
      console.error(errorMsg);
      return { imported: 0, errors: [errorMsg] };
    }
  }

  // Helper to create creators from issue data
  private static async createCreatorsFromIssue(record: ComicIssueCSVRow): Promise<void> {
    const creators = [
      { name: record.writer, role: 'writer' },
      { name: record.penciler, role: 'penciler' },
      { name: record.cover_artist, role: 'cover_artist' }
    ].filter(creator => creator.name && creator.name.trim() !== '' && creator.name !== 'None');

    for (const creator of creators) {
      try {
        // Check if creator already exists
        const existing = await storage.getComicCreatorByName(creator.name);
        if (!existing) {
          const newCreator: InsertComicCreator = {
            name: creator.name,
            role: creator.role,
            biography: `Comic ${creator.role} known for various Marvel and DC works.`,
            totalIssues: 1,
            marketInfluence: 50.0,
            trendingScore: 25.0,
          };
          await storage.createComicCreator(newCreator);
        }
      } catch (error) {
        console.warn(`Failed to create creator ${creator.name}: ${error.message}`);
      }
    }
  }

  // Parse price string to decimal
  private static parsePrice(priceStr: string): number | null {
    if (!priceStr || priceStr.toLowerCase() === 'free') return 0;
    const match = priceStr.match(/\$?(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : null;
  }

  // Import both CSV files
  static async importAllComicData(): Promise<{
    seriesResults: { imported: number; errors: string[] };
    issuesResults: { imported: number; errors: string[] };
  }> {
    console.log('Starting full comic data import...');

    // First import series
    const seriesResults = await this.importComicSeriesFromCSV('attached_assets/comic_list_1758981354593.csv');
    
    // Then import issues
    const issuesResults = await this.importComicIssuesFromCSV('attached_assets/Marvel_Comics 2_1758981404739.csv');

    console.log('Full comic data import completed!');
    console.log(`Series: ${seriesResults.imported} imported, ${seriesResults.errors.length} errors`);
    console.log(`Issues: ${issuesResults.imported} imported, ${issuesResults.errors.length} errors`);

    return { seriesResults, issuesResults };
  }

  // Get import statistics
  static async getImportStatistics(): Promise<{
    totalSeries: number;
    totalIssues: number;
    totalCreators: number;
    recentlyImported: number;
  }> {
    const metrics = await storage.getComicMetrics();
    
    return {
      totalSeries: metrics.totalSeries,
      totalIssues: metrics.totalIssues,
      totalCreators: metrics.totalCreators,
      recentlyImported: 0 // Could track this with timestamps
    };
  }
}