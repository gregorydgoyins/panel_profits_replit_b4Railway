"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rssFeedService = void 0;
const rss_parser_1 = __importDefault(require("rss-parser"));
class RSSFeedService {
    constructor() {
        this.cachedNews = [];
        this.lastFetchTime = null;
        this.CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
        this.NEWSDATA_API_KEY = process.env.NEWSDATA_IO_API_KEY;
        // Comic book news RSS sources
        this.RSS_SOURCES = [
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
        this.parser = new rss_parser_1.default({
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
    async getLatestNews(limit = 300) {
        // Return cached news if still fresh
        if (this.shouldUseCachedNews()) {
            return this.cachedNews.slice(0, limit);
        }
        try {
            await this.refreshNews();
            return this.cachedNews.slice(0, limit);
        }
        catch (error) {
            console.error('❌ Error fetching RSS feeds:', error);
            // Return cached news even if expired, better than nothing
            return this.cachedNews.slice(0, limit);
        }
    }
    /**
     * Refresh news from all RSS sources
     */
    async refreshNews() {
        console.log('📰 Fetching latest comic book news from RSS feeds...');
        const allNews = [];
        // Fetch from RSS sources
        const rssFetchPromises = this.RSS_SOURCES.map(async (source) => {
            try {
                const feed = await this.parser.parseURL(source.url);
                const items = (feed.items || []).slice(0, 50).map((item, index) => ({
                    id: `${source.name}-${item.guid || item.link || index}`,
                    headline: this.cleanHeadline(item.title || 'Untitled'),
                    url: item.link || source.url,
                    publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                    source: source.name,
                }));
                return items;
            }
            catch (error) {
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
            }
            catch (error) {
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
    async fetchFromNewsData() {
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
        return data.results.slice(0, 100).map((article) => ({
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
    cleanHeadline(headline) {
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
    shouldUseCachedNews() {
        if (!this.lastFetchTime || this.cachedNews.length === 0) {
            return false;
        }
        const timeSinceLastFetch = Date.now() - this.lastFetchTime.getTime();
        return timeSinceLastFetch < this.CACHE_DURATION_MS;
    }
    /**
     * Start background refresh of news feeds
     */
    startBackgroundRefresh() {
        // Fetch immediately on startup
        this.refreshNews().catch(console.error);
        // Then refresh every 5 minutes
        setInterval(() => {
            this.refreshNews().catch(console.error);
        }, this.CACHE_DURATION_MS);
    }
}
// Export singleton instance
exports.rssFeedService = new RSSFeedService();
