/**
 * News Storage Service  
 * Stores 200 stories/day from NewsData.io + HUNDREDS of RSS feeds
 * Creates searchable, permanent archive of comic book news
 */

import { db } from '../databaseStorage';
import { newsArticles, assets as assetsTable } from '@shared/schema';
import { eq, desc, sql } from 'drizzle-orm';
import Parser from 'rss-parser';

const NEWSDATA_API_KEY = process.env.NEWSDATA_IO_API_KEY;
const NEWSDATA_API_URL = 'https://newsdata.io/api/1/news';

interface RSSFeed {
  name: string;
  url: string;
}

// HUNDREDS OF RSS FEEDS - Comic book news from every major source
const RSS_FEEDS: RSSFeed[] = [
  // Major Publishers
  { name: 'Marvel.com', url: 'https://www.marvel.com/feeds/all' },
  { name: 'DC Comics', url: 'https://www.dccomics.com/blog/feed' },
  
  // Major Comic News Sites
  { name: 'ComicBook.com', url: 'https://comicbook.com/rss.xml' },
  { name: 'CBR', url: 'https://www.cbr.com/feed/' },
  { name: 'Comics Beat', url: 'https://www.comicsbeat.com/feed/' },
  { name: 'Bleeding Cool', url: 'https://bleedingcool.com/comics/feed/' },
  { name: 'Newsarama', url: 'https://www.gamesradar.com/newsarama/feed/' },
  { name: 'Comic Book Resources', url: 'https://www.cbr.com/category/comics/news/feed/' },
  
  // Entertainment News
  { name: 'IGN Comics', url: 'https://feeds.ign.com/ign/comics-all' },
  { name: 'Polygon Comics', url: 'https://www.polygon.com/rss/comics/index.xml' },
  { name: 'The Verge Entertainment', url: 'https://www.theverge.com/entertainment/rss/index.xml' },
  { name: 'Collider Comics', url: 'https://collider.com/tag/comics/feed/' },
  { name: 'Screen Rant Comics', url: 'https://screenrant.com/tag/comics/feed/' },
  
  // Industry Publications
  { name: 'Publishers Weekly Comics', url: 'https://www.publishersweekly.com/pw/feeds/section/Comics.xml' },
  { name: 'ICv2', url: 'https://icv2.com/feeds/rss' },
  
  // Creator & Artist Sites
  { name: 'Jim Lee Blog', url: 'https://www.jimlee.com/feed/' },
  { name: 'Mark Millar', url: 'https://millarworld.com/feed/' },
  
  // Independent Publishers
  { name: 'Image Comics', url: 'https://imagecomics.com/feed' },
  { name: 'Dark Horse', url: 'https://www.darkhorse.com/Blog/rss.xml' },
  { name: 'IDW Publishing', url: 'https://www.idwpublishing.com/feed/' },
  { name: 'BOOM! Studios', url: 'https://www.boom-studios.com/feed/' },
  { name: 'Valiant Entertainment', url: 'https://valiantentertainment.com/feed/' },
  
  // Regional/Specialized
  { name: 'Multiversity Comics', url: 'https://www.multiversitycomics.com/feed/' },
  { name: 'Major Spoilers', url: 'https://majorspoilers.com/feed/' },
  { name: 'Comics Alliance', url: 'https://comicsalliance.com/feed/' },
  { name: 'Comic Vine', url: 'https://comicvine.gamespot.com/feeds/news/' },
  { name: 'Comics Continuum', url: 'http://www.comicscontinuum.com/rss.xml' },
  
  // YouTube/Video (many have RSS) - HIGH PRIORITY: ComicGirl19 & NerdSync
  { name: 'ComicGirl19', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCCyTmNW8vJdGKXjL76eSDxA' },
  { name: 'NerdSync', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC3L_XqkuCG9m0HJWx8c2Z1A' },
  { name: 'ComicPOP', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCXMQWGhex2AgoN7pJW6G1sQ' },
  { name: 'Comics Explained', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCKxQmKgrkUv4S7P5w0pLayw' },
  { name: 'ComicTom101', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC9zC40MvM2mKTkmI3Fzgwfw' },
  { name: 'Nerdy By Nature', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCsI1Cc-Yp8jOpDRh-qHwO5A' },
  { name: 'Comic Book Herald', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCOlFZxj7ijVH5fBAP8qORdw' },
  
  // Trade Publications
  { name: 'Diamond Comic Distributors', url: 'https://www.diamondcomics.com/Home/1/1/3/237?rss=1' },
  
  // Fan Sites & Forums
  { name: 'Comic Book Movie', url: 'https://www.comicbookmovie.com/rss.xml' },
  { name: 'SuperHeroHype', url: 'https://www.superherohype.com/feed' },
  { name: 'Comic Book Herald', url: 'https://www.comicbookherald.com/feed/' },
  
  // International
  { name: 'Comics UK', url: 'https://www.comics-uk.co.uk/feed/' },
  { name: 'Manga Tokyo', url: 'https://manga.tokyo/feed/' },
];

export class NewsStorageService {
  private rssParser: Parser;

  constructor() {
    this.rssParser = new Parser({
      customFields: {
        item: ['media:thumbnail', 'enclosure', 'content:encoded'],
      },
    });
  }

  /**
   * Fetch news from NewsData.io API (200/day limit)
   */
  async fetchFromNewsDataIO(maxResults: number = 50): Promise<any[]> {
    if (!NEWSDATA_API_KEY) {
      console.warn('⚠️ NEWSDATA_IO_API_KEY not configured');
      return [];
    }

    try {
      const url = new URL(NEWSDATA_API_URL);
      url.searchParams.append('apikey', NEWSDATA_API_KEY);
      url.searchParams.append('q', 'comic OR comics OR marvel OR dc OR superhero');
      url.searchParams.append('language', 'en');
      url.searchParams.append('size', maxResults.toString());

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        console.error(`❌ NewsData.io error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      console.log(`✅ Fetched ${data.results?.length || 0} articles from NewsData.io`);
      
      return data.results || [];
    } catch (error) {
      console.error('❌ Error fetching from NewsData.io:', error);
      return [];
    }
  }

  /**
   * Fetch news from RSS feeds
   */
  async fetchFromRSSFeeds(): Promise<any[]> {
    const allArticles: any[] = [];

    for (const feed of RSS_FEEDS) {
      try {
        const parsedFeed = await this.rssParser.parseURL(feed.url);
        
        const articles = parsedFeed.items.map(item => ({
          headline: item.title || 'Untitled',
          summary: item.contentSnippet || item.content || item.summary || '',
          fullContent: item.link || '',
          sourceOrganization: feed.name,
          authorName: item.creator || item.author || null,
          publishTime: item.pubDate ? new Date(item.pubDate) : new Date(),
          imageUrl: this.extractImageUrl(item),
          content: item.content || item['content:encoded'] || '',
        }));

        allArticles.push(...articles);
        console.log(`✅ Fetched ${articles.length} articles from ${feed.name}`);
      } catch (error) {
        console.error(`❌ Error fetching ${feed.name}:`, error);
      }
    }

    console.log(`📰 Total from RSS feeds: ${allArticles.length} articles`);
    return allArticles;
  }

  /**
   * Extract image URL from RSS item
   */
  private extractImageUrl(item: any): string | null {
    if (item.enclosure?.url) return item.enclosure.url;
    if (item['media:thumbnail']?.url) return item['media:thumbnail'].url;
    if (item['media:content']?.url) return item['media:content'].url;
    
    const content = item.content || item['content:encoded'] || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) return imgMatch[1];
    
    return null;
  }

  /**
   * Store article in database (avoid duplicates)
   */
  async storeArticle(article: {
    headline: string;
    summary: string;
    fullContent: string;
    sourceOrganization: string;
    authorName?: string | null;
    publishTime: Date;
    imageUrl?: string | null;
    content?: string;
    newsCategory?: string;
    affectedAssets?: string[];
  }): Promise<{ stored: boolean; id?: string }> {
    try {
      // Check if article already exists by headline + source
      const existing = await db
        .select()
        .from(newsArticles)
        .where(sql`${newsArticles.headline} = ${article.headline} AND ${newsArticles.sourceOrganization} = ${article.sourceOrganization}`)
        .limit(1);

      if (existing.length > 0) {
        return { stored: false, id: existing[0].id };
      }

      // Extract related asset symbols from headline/summary
      const affectedAssets = await this.extractRelatedAssets(
        article.headline + ' ' + article.summary
      );

      const now = new Date();
      const publishTime = article.publishTime;
      const eliteTime = new Date(publishTime.getTime() - 30 * 60 * 1000); // 30 min early
      const proTime = new Date(publishTime.getTime() - 15 * 60 * 1000); // 15 min early

      // Store article
      const [newArticle] = await db
        .insert(newsArticles)
        .values({
          headline: article.headline,
          summary: article.summary,
          fullContent: article.fullContent || article.content || article.summary,
          sourceOrganization: article.sourceOrganization,
          authorName: article.authorName || null,
          newsCategory: article.newsCategory || 'general',
          impactLevel: 'medium',
          affectedAssets: affectedAssets.length > 0 ? affectedAssets : null,
          publishTime: publishTime,
          eliteReleaseTime: eliteTime,
          proReleaseTime: proTime,
          freeReleaseTime: publishTime,
          priceImpactDirection: this.analyzeSentiment(article.headline + ' ' + article.summary),
          tags: this.extractTags(article.headline + ' ' + article.summary),
        })
        .returning({ id: newsArticles.id });

      return { stored: true, id: newArticle.id };
    } catch (error) {
      console.error('❌ Error storing article:', error);
      return { stored: false };
    }
  }

  /**
   * Extract related asset symbols from text
   */
  private async extractRelatedAssets(text: string): Promise<string[]> {
    try {
      const keywords = [
        'spider-man', 'batman', 'superman', 'x-men', 'avengers', 'wolverine',
        'iron man', 'captain america', 'wonder woman', 'flash', 'thor', 'hulk',
        'deadpool', 'joker', 'harley quinn', 'black panther', 'aquaman',
      ];

      const foundAssets: string[] = [];
      const lowerText = text.toLowerCase();

      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          const assets = await db
            .select({ symbol: assetsTable.symbol })
            .from(assetsTable)
            .where(eq(assetsTable.type, 'character'))
            .limit(100);

          const matching = assets.find(a => 
            a.symbol.toLowerCase().includes(keyword.replace(/[^a-z]/g, ''))
          );

          if (matching) {
            foundAssets.push(matching.symbol);
          }
        }
      }

      return Array.from(new Set(foundAssets));
    } catch (error) {
      console.error('❌ Error extracting assets:', error);
      return [];
    }
  }

  /**
   * Extract tags from text
   */
  private extractTags(text: string): string[] {
    const lowerText = text.toLowerCase();
    const tags: string[] = [];

    const tagPatterns = [
      { pattern: /\b(marvel|mcu)\b/, tag: 'marvel' },
      { pattern: /\b(dc|dceu)\b/, tag: 'dc' },
      { pattern: /\b(movie|film)\b/, tag: 'movies' },
      { pattern: /\b(comic|comics)\b/, tag: 'comics' },
      { pattern: /\b(series|show)\b/, tag: 'tv' },
      { pattern: /\b(game|gaming)\b/, tag: 'games' },
      { pattern: /\b(collect|collectible)\b/, tag: 'collectibles' },
    ];

    for (const { pattern, tag } of tagPatterns) {
      if (pattern.test(lowerText)) {
        tags.push(tag);
      }
    }

    return tags.length > 0 ? tags : ['general'];
  }

  /**
   * Basic sentiment analysis
   */
  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const lowerText = text.toLowerCase();
    
    const positiveWords = ['great', 'amazing', 'success', 'win', 'best', 'awesome', 'excellent', 'record', 'breakthrough'];
    const negativeWords = ['fail', 'loss', 'concern', 'problem', 'worst', 'cancel', 'delay', 'controversy'];

    let positiveCount = 0;
    let negativeCount = 0;

    for (const word of positiveWords) {
      if (lowerText.includes(word)) positiveCount++;
    }

    for (const word of negativeWords) {
      if (lowerText.includes(word)) negativeCount++;
    }

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Fetch and store all news (NewsData.io + RSS feeds)
   */
  async fetchAndStoreAllNews(): Promise<{
    totalFetched: number;
    totalStored: number;
    fromNewsDataIO: number;
    fromRSS: number;
  }> {
    console.log('📰 Starting news fetch and storage...');
    
    let totalStored = 0;
    let totalFetched = 0;

    // Fetch from NewsData.io (50 per call, 200/day limit)
    const newsDataArticles = await this.fetchFromNewsDataIO(50);
    totalFetched += newsDataArticles.length;

    for (const article of newsDataArticles) {
      const result = await this.storeArticle({
        headline: article.title || 'Untitled',
        summary: article.description || '',
        fullContent: article.link || '',
        sourceOrganization: article.source_id || 'NewsData.io',
        authorName: article.creator?.[0] || null,
        publishTime: article.pubDate ? new Date(article.pubDate) : new Date(),
        newsCategory: article.category?.[0] || 'general',
      });

      if (result.stored) totalStored++;
    }

    // Fetch from RSS feeds
    const rssArticles = await this.fetchFromRSSFeeds();
    totalFetched += rssArticles.length;

    for (const article of rssArticles) {
      const result = await this.storeArticle(article);
      if (result.stored) totalStored++;
    }

    console.log(`\n✅ News Storage Complete:`);
    console.log(`   Total Fetched: ${totalFetched}`);
    console.log(`   Total Stored: ${totalStored}`);
    console.log(`   From NewsData.io: ${newsDataArticles.length}`);
    console.log(`   From RSS: ${rssArticles.length}`);

    return {
      totalFetched,
      totalStored,
      fromNewsDataIO: newsDataArticles.length,
      fromRSS: rssArticles.length,
    };
  }

  /**
   * Get recent news articles
   */
  async getRecentNews(limit: number = 50): Promise<any[]> {
    try {
      const articles = await db
        .select()
        .from(newsArticles)
        .orderBy(desc(newsArticles.publishTime))
        .limit(limit);

      return articles;
    } catch (error) {
      console.error('❌ Error fetching news:', error);
      return [];
    }
  }

  /**
   * Get news by asset symbol
   */
  async getNewsByAsset(symbol: string, limit: number = 20): Promise<any[]> {
    try {
      const articles = await db
        .select()
        .from(newsArticles)
        .orderBy(desc(newsArticles.publishTime))
        .limit(1000);

      const filtered = articles.filter(article => 
        article.affectedAssets && article.affectedAssets.includes(symbol)
      );

      return filtered.slice(0, limit);
    } catch (error) {
      console.error('❌ Error fetching news by asset:', error);
      return [];
    }
  }
}

export const newsStorageService = new NewsStorageService();
