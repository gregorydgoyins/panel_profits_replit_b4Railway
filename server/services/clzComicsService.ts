interface CLZComic {
  id: string;
  title: string;
  series?: string;
  issue?: string;
  publisher?: string;
  releaseDate?: string;
  coverUrl?: string;
  value?: number;
  grade?: string;
  variant?: string;
  creators?: Array<{
    name: string;
    role: string;
  }>;
}

interface CLZCollection {
  totalCount: number;
  comics: CLZComic[];
}

class CLZComicsService {
  private baseUrl = 'https://cloud.clz.com/api/comics/v1';
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheExpiry = 3600000; // 1 hour

  async getUserCollection(username: string, limit: number = 100): Promise<CLZCollection> {
    const cacheKey = `collection:${username}:${limit}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log(`📦 Using cached CLZ collection for: ${username}`);
      return cached.data;
    }

    try {
      console.log(`📚 Fetching CLZ Comics collection for user: ${username}`);
      
      // CLZ API endpoint for public collections
      const url = `${this.baseUrl}/users/${username}/collection?limit=${limit}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`❌ CLZ API error: ${response.status} ${response.statusText}`);
        return { totalCount: 0, comics: [] };
      }

      const data = await response.json();
      
      const collection: CLZCollection = {
        totalCount: data.totalCount || 0,
        comics: (data.comics || []).map((comic: any) => this.parseComic(comic))
      };

      this.cache.set(cacheKey, { data: collection, timestamp: Date.now() });

      console.log(`✅ Retrieved ${collection.comics.length} comics from CLZ for ${username}`);
      return collection;
    } catch (error) {
      console.error('❌ Error fetching CLZ collection:', error);
      return { totalCount: 0, comics: [] };
    }
  }

  async searchComics(query: string, username?: string): Promise<CLZComic[]> {
    try {
      console.log(`🔍 Searching CLZ Comics for: ${query}`);
      
      const url = username 
        ? `${this.baseUrl}/users/${username}/collection/search?q=${encodeURIComponent(query)}`
        : `${this.baseUrl}/search?q=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`❌ CLZ search error: ${response.status}`);
        return [];
      }

      const data = await response.json();
      const comics = (data.comics || []).map((comic: any) => this.parseComic(comic));

      console.log(`✅ Found ${comics.length} comics in CLZ for: ${query}`);
      return comics;
    } catch (error) {
      console.error('❌ Error searching CLZ:', error);
      return [];
    }
  }

  async getComicCover(comicId: string): Promise<string | null> {
    try {
      const url = `${this.baseUrl}/comics/${comicId}/cover`;
      const response = await fetch(url);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.coverUrl || null;
    } catch (error) {
      console.error('❌ Error fetching CLZ cover:', error);
      return null;
    }
  }

  private parseComic(raw: any): CLZComic {
    return {
      id: raw.id || raw.comicId || '',
      title: raw.title || raw.name || 'Unknown Title',
      series: raw.series || raw.seriesTitle,
      issue: raw.issue || raw.issueNumber,
      publisher: raw.publisher || raw.publisherName,
      releaseDate: raw.releaseDate || raw.publishDate,
      coverUrl: raw.coverUrl || raw.coverImage || raw.imageUrl,
      value: raw.value || raw.price || raw.marketValue,
      grade: raw.grade || raw.condition,
      variant: raw.variant,
      creators: raw.creators || []
    };
  }

  async getCoversForSeries(seriesName: string, limit: number = 20): Promise<string[]> {
    try {
      const comics = await this.searchComics(seriesName);
      return comics
        .map(c => c.coverUrl)
        .filter((url): url is string => !!url)
        .slice(0, limit);
    } catch (error) {
      console.error('❌ Error fetching covers:', error);
      return [];
    }
  }

  async getPricingData(seriesName: string): Promise<{ min: number; max: number; avg: number }> {
    try {
      const comics = await this.searchComics(seriesName);
      const prices = comics
        .map(c => c.value)
        .filter((v): v is number => typeof v === 'number' && v > 0);

      if (prices.length === 0) {
        return { min: 0, max: 0, avg: 0 };
      }

      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: prices.reduce((sum, p) => sum + p, 0) / prices.length
      };
    } catch (error) {
      console.error('❌ Error calculating pricing:', error);
      return { min: 0, max: 0, avg: 0 };
    }
  }
}

export const clzComicsService = new CLZComicsService();
