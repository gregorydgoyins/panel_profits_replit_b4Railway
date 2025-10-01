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

interface NewsDataArticle {
  article_id: string;
  title: string;
  link: string;
  pubDate: string;
  source_id: string;
}

class RSSFeedService {
  private parser: Parser;
  private cachedNews: RSSFeedItem[] = [];
  private lastFetchTime: Date | null = null;
  private readonly CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
  private readonly NEWSDATA_API_KEY = process.env.NEWSDATA_IO_API_KEY;
  
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
  async getLatestNews(limit: number = 300): Promise<RSSFeedItem[]> {
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
    
    // Fetch from RSS sources
    const rssFetchPromises = this.RSS_SOURCES.map(async (source) => {
      try {
        const feed = await this.parser.parseURL(source.url);
        
        const items: RSSFeedItem[] = (feed.items || []).slice(0, 50).map((item, index) => ({
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

    const rssResults = await Promise.allSettled(rssFetchPromises);
    
    // Collect RSS results
    rssResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allNews.push(...result.value);
      }
    });
    
    // Fetch from NewsData.io if API key is available
    if (this.NEWSDATA_API_KEY) {
      try {
        const newsDataItems = await this.fetchFromNewsData();
        allNews.push(...newsDataItems);
        console.log(`✅ Fetched ${newsDataItems.length} items from NewsData.io`);
      } catch (error) {
        console.error('⚠️ Failed to fetch from NewsData.io:', error instanceof Error ? error.message : 'Unknown error');
      }
    }

    // Sort by published date (newest first)
    allNews.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    // Update cache
    this.cachedNews = allNews;
    this.lastFetchTime = new Date();
    
    console.log(`✅ Fetched ${allNews.length} total news items from ${this.RSS_SOURCES.length} RSS sources${this.NEWSDATA_API_KEY ? ' + NewsData.io' : ''}`);
  }
  
  /**
   * Fetch news from NewsData.io API
   */
  private async fetchFromNewsData(): Promise<RSSFeedItem[]> {
    if (!this.NEWSDATA_API_KEY) {
      return [];
    }
    
    const keywords = ['comic', 'comics', 'marvel', 'dc', 'superhero', 'comic book'];
    const category = 'entertainment';
    
    const url = `https://newsdata.io/api/1/news?apikey=${this.NEWSDATA_API_KEY}&category=${category}&q=${keywords.join(' OR ')}&language=en`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NewsData.io API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }
    
    return data.results.slice(0, 100).map((article: NewsDataArticle) => ({
      id: `newsdata-${article.article_id}`,
      headline: this.cleanHeadline(article.title),
      url: article.link,
      publishedAt: new Date(article.pubDate),
      source: article.source_id || 'NewsData.io',
    }));
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
