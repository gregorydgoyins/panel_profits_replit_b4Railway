import { useState, useEffect, useCallback } from 'react';
import { newsService } from '../services/newsService';

export interface NewsItem {
  id: string;
  title: string;
  description?: string;
  content: string;
  publishedAt: Date;
  url: string;
  source: string;
  impact: 'positive' | 'negative' | 'neutral';
  imageUrl?: string;
  keywords: string[];
  videoUrl?: string;
  secondaryVideoUrl?: string;
  relatedSecurity?: {
    type: 'comic' | 'creator' | 'publisher' | 'option';
    symbol: string;
    name: string;
  };
}

interface UseNewsDataReturn {
  data: NewsItem[] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: Date | null;
  dataSource: 'api' | 'cache' | 'demo' | null;
  latestStory: NewsItem | null;
  totalCount: number;
}

interface UseNewsDataOptions {
  limit?: number;
  category?: string;
  impact?: string;
  source?: string;
  featured?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useNewsData(options: UseNewsDataOptions = {}): UseNewsDataReturn {
  const [data, setData] = useState<NewsItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [dataSource, setDataSource] = useState<'api' | 'cache' | 'demo' | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const {
    limit = 10,
    category,
    impact,
    source,
    featured = false,
    autoRefresh = true,
    refreshInterval = 300000 // 5 minutes
  } = options;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (featured) {
        result = await newsService.getFeaturedNews();
      } else if (category && category !== 'all') {
        result = await newsService.getNewsByCategory(category, limit);
      } else {
        // First get all stories to count them
        const allStoriesResult = await newsService.getNewsArticles({
          limit: 0, // Get all stories
          category: category !== 'all' ? category : undefined,
          impact: impact !== 'all' ? impact : undefined,
          source: source !== 'all' ? source : undefined
        });
        
        setTotalCount(allStoriesResult.data?.length || 0);
        
        // Then get the limited set for display
        result = await newsService.getNewsArticles({
          limit,
          category: category !== 'all' ? category : undefined,
          impact: impact !== 'all' ? impact : undefined,
          source: source !== 'all' ? source : undefined
        });
      }

      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch news');
      }

      setData(result.data || []);
      setDataSource('api');
      setLastUpdated(new Date());
    } catch (err) {
      console.error('News fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch news data');
      
      // Fallback to cached data or demo data if available
      if (data) {
        setDataSource('cache');
      } else {
        setDataSource('demo');
      }
    } finally {
      setIsLoading(false);
    }
  }, [limit, category, impact, source, featured, data]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    lastUpdated,
    dataSource,
    latestStory: data?.[0] || null,
    totalCount
  };
}

// Hook for getting a single news article
export function useNewsArticle(id: string) {
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await newsService.getNewsArticleById(id);

        if (error) {
          throw new Error(error.message || 'Failed to fetch article');
        }

        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch article');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  return { article, isLoading, error };
}

// Hook for searching news
export function useNewsSearch(query: string, options: {
  limit?: number;
  category?: string;
  impact?: string;
} = {}) {
  const [results, setResults] = useState<NewsItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await newsService.searchNewsArticles(searchQuery, options);

      if (error) {
        throw new Error(error.message || 'Search failed');
      }

      setResults(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(query);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [query, search]);

  return { results, isLoading, error, search };
}