import Parser from 'rss-parser';

interface RSSFeedItem {
  id: string;
  headline: string;
  url: string;
  publishedAt: Date;
  source: string;
}

interface RSSSource {
  name: string;
  url: string;
  category: 'marvel' | 'dc' | 'general';
}

class RSSFeedService {
  private parser: Parser;
  private cachedNews: RSSFeedItem[] = [];
  private lastFetchTime: Date | null = null;
  private readonly CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
  
  // Comic book news RSS sources
  private readonly RSS_SOURCES: RSSSource[] = [
    // ComicBook.com - General, Marvel, and DC
    { name: 'ComicBook.com', url: 'https://comicbook.com/feed', category: 'general' },
    { name: 'ComicBook.com Marvel', url: 'https://comicbook.com/category/marvel/feed', category: 'marvel' },
    { name: 'ComicBook.com DC', url: 'https://comicbook.com/category/dc/feed', category: 'dc' },
    
    // Bleeding Cool - Major comic news site
    { name: 'Bleeding Cool', url: 'https://bleedingcool.com/feed', category: 'general' },
    
    // Marvel Official
    { name: 'Marvel.com', url: 'https://marvel.com/articles/feed', category: 'marvel' },
    
    // DC Comics News
    { name: 'DC Comics News', url: 'https://dccomicsnews.com/category/news/feed', category: 'dc' },
  ];

  constructor() {
    this.parser = new Parser({
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PanelProfits/1.0)',
      },
    });
    
    // Start background refresh
    this.startBackgroundRefresh();
  }

  /**
   * Get latest comic book news from all RSS feeds
   */
  async getLatestNews(limit: number = 20): Promise<RSSFeedItem[]> {
    // Return cached news if still fresh
    if (this.shouldUseCachedNews()) {
      return this.cachedNews.slice(0, limit);
    }

    try {
      await this.refreshNews();
      return this.cachedNews.slice(0, limit);
    } catch (error) {
      console.error('❌ Error fetching RSS feeds:', error);
      // Return cached news even if expired, better than nothing
      return this.cachedNews.slice(0, limit);
    }
  }

  /**
   * Refresh news from all RSS sources
   */
  private async refreshNews(): Promise<void> {
    console.log('📰 Fetching latest comic book news from RSS feeds...');
    
    const allNews: RSSFeedItem[] = [];
    
    // Fetch from all sources in parallel
    const fetchPromises = this.RSS_SOURCES.map(async (source) => {
      try {
        const feed = await this.parser.parseURL(source.url);
        
        const items: RSSFeedItem[] = (feed.items || []).slice(0, 10).map((item, index) => ({
          id: `${source.name}-${item.guid || item.link || index}`,
          headline: this.cleanHeadline(item.title || 'Untitled'),
          url: item.link || source.url,
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          source: source.name,
        }));
        
        return items;
      } catch (error) {
        console.error(`⚠️ Failed to fetch from ${source.name}:`, error instanceof Error ? error.message : 'Unknown error');
        return [];
      }
    });

    const results = await Promise.allSettled(fetchPromises);
    
    // Collect all successful results
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allNews.push(...result.value);
      }
    });

    // Sort by published date (newest first)
    allNews.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    // Update cache
    this.cachedNews = allNews;
    this.lastFetchTime = new Date();
    
    console.log(`✅ Fetched ${allNews.length} news items from ${this.RSS_SOURCES.length} sources`);
  }

  /**
   * Clean up headlines for display
   */
  private cleanHeadline(headline: string): string {
    // Remove HTML tags
    let cleaned = headline.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    cleaned = cleaned
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
    
    // Trim and limit length
    cleaned = cleaned.trim();
    if (cleaned.length > 150) {
      cleaned = cleaned.substring(0, 147) + '...';
    }
    
    return cleaned;
  }

  /**
   * Check if cached news is still fresh
   */
  private shouldUseCachedNews(): boolean {
    if (!this.lastFetchTime || this.cachedNews.length === 0) {
      return false;
    }
    
    const timeSinceLastFetch = Date.now() - this.lastFetchTime.getTime();
    return timeSinceLastFetch < this.CACHE_DURATION_MS;
  }

  /**
   * Start background refresh of news feeds
   */
  private startBackgroundRefresh(): void {
    // Fetch immediately on startup
    this.refreshNews().catch(console.error);
    
    // Then refresh every 5 minutes
    setInterval(() => {
      this.refreshNews().catch(console.error);
    }, this.CACHE_DURATION_MS);
  }
}

// Export singleton instance
export const rssFeedService = new RSSFeedService();
