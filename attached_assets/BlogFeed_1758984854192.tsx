import React, { useState } from 'react';
import { useNewsData } from '../../hooks/useNewsData';
import { Calendar, TrendingUp, TrendingDown, AlertCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface BlogFeedProps {
  maxItems?: number;
  showImages?: boolean;
  filter?: {
    impact?: 'positive' | 'negative' | 'neutral';
    type?: 'comic' | 'creator' | 'publisher' | 'option';
  };
}

export function BlogFeed({ maxItems = 3, showImages = true, filter }: BlogFeedProps) {
  const { data: news, isLoading, error, dataSource } = useNewsData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (isLoading && !news) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-gray-400">Loading articles...</span>
        </div>
      </div>
    );
  }

  if (error && !news) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="bg-red-900/30 rounded-lg p-4 text-center">
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-300">Failed to load articles</p>
        </div>
      </div>
    );
  }

  // Filter news based on props and selected category
  const filteredNews = news
    ?.filter(item => {
      if (filter?.impact && item.impact !== filter.impact) return false;
      if (filter?.type && item.relatedSecurity?.type !== filter.type) return false;
      if (selectedCategory !== 'all' && item.relatedSecurity?.type !== selectedCategory) return false;
      return true;
    })
    .slice(0, maxItems);

  if (!filteredNews || filteredNews.length === 0) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="text-center py-6">
          <p className="text-gray-400">No articles available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Latest Articles</h2>
        {dataSource && (
          <span className="text-xs text-gray-400 px-2 py-1 bg-slate-700/50 rounded">
            {dataSource === 'api' ? 'Live Data' : dataSource === 'cache' ? 'Cached Data' : 'Demo Data'}
          </span>
        )}
      </div>
      
      <div className="space-y-8">
        {filteredNews.map((article, index) => (
          <React.Fragment key={article.id}>
            {index > 0 && (
              <div className="flex justify-center py-4">
                <div className="flex space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <article className="pt-8 border-t border-slate-700/50">
            <div className="flex flex-col md:flex-row gap-6">
              {showImages && article.imageUrl && (
                <div className="md:w-1/3">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className={showImages && article.imageUrl ? 'md:w-2/3' : 'w-full'}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    article.impact === 'positive' ? 'bg-green-900/50 text-green-200 border border-green-700/50' :
                    article.impact === 'negative' ? 'bg-red-900/50 text-red-200 border border-red-700/50' :
                    'bg-yellow-900/50 text-yellow-200 border border-yellow-700/50'
                  }`}>
                    <div className="flex items-center space-x-1">
                      {article.impact === 'positive' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : article.impact === 'negative' ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      <span className="capitalize">{article.impact}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    <time dateTime={article.publishedAt.toISOString()}>
                      {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                    </time>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {article.description || article.content.substring(0, 150) + '...'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {article.keywords.slice(0, 3).map((keyword, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-slate-700/50 rounded-full text-xs text-gray-300"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  
                  {article.url.startsWith('http') ? (
                    <a 
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 text-sm"
                    >
                      <span>Read Full Article</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <Link 
                      to={`/news/${article.id}`}
                      className="text-indigo-400 hover:text-indigo-300 text-sm"
                    >
                      Read More →
                    </Link>
                  )}
                </div>
              </div>
            </div>
            </article>
          </React.Fragment>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Link 
          to="/news"
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <span>View All Articles</span>
        </Link>
      </div>
    </div>
  );
}

export default BlogFeed;