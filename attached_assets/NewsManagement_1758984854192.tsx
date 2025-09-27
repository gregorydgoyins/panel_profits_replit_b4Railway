import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Save, X, AlertTriangle, Check } from 'lucide-react';
import { newsService, CreateNewsArticleData, UpdateNewsArticleData } from '../../services/newsService';
import { NewsItem } from '../../hooks/useNewsData';

interface NewsManagementProps {
  userRole?: 'admin' | 'editor' | 'user';
}

export function NewsManagement({ userRole = 'user' }: NewsManagementProps) {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateNewsArticleData>({
    title: '',
    description: '',
    content: '',
    url: '',
    source: '',
    impact: 'neutral',
    imageUrl: '',
    keywords: [],
    author: '',
    category: 'general',
    relatedSecurities: []
  });

  // Load articles
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await newsService.getNewsArticles({ limit: 50 });
      if (error) throw error;
      setArticles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateArticle = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await newsService.createNewsArticle(formData);
      if (error) throw error;
      
      setIsCreateModalOpen(false);
      resetForm();
      loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateArticle = async (id: string, updates: UpdateNewsArticleData) => {
    try {
      const { error } = await newsService.updateNewsArticle(id, updates);
      if (error) throw error;
      loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update article');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
      const { error } = await newsService.deleteNewsArticle(id);
      if (error) throw error;
      loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      url: '',
      source: '',
      impact: 'neutral',
      imageUrl: '',
      keywords: [],
      author: '',
      category: 'general',
      relatedSecurities: []
    });
  };

  // Only show management interface for admin/editor roles
  if (userRole !== 'admin' && userRole !== 'editor') {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Access Restricted</h3>
          <p className="text-gray-400">You don't have permission to manage news articles.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-gray-400">Loading articles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">News Management</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Article</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 p-4 rounded-lg border border-red-700/30 mb-6 flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {articles.map(article => (
            <div key={article.id} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{article.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {article.source} • {article.publishedAt.toLocaleDateString()}
                  </p>
                  <p className="text-gray-300 mt-2 line-clamp-2">{article.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    article.impact === 'positive' ? 'bg-green-900/50 text-green-200' :
                    article.impact === 'negative' ? 'bg-red-900/50 text-red-200' :
                    'bg-yellow-900/50 text-yellow-200'
                  }`}>
                    {article.impact}
                  </span>
                  <button
                    onClick={() => setEditingArticle(article)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteArticle(article.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingArticle) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <h3 className="text-lg font-bold text-white">
                {editingArticle ? 'Edit Article' : 'Create Article'}
              </h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingArticle(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                    placeholder="Article title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Source</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                    placeholder="News source..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white h-20"
                  placeholder="Brief description..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white h-32"
                  placeholder="Full article content..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Impact</label>
                  <select
                    value={formData.impact}
                    onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value as any }))}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="general">General</option>
                    <option value="movies">Movies & TV</option>
                    <option value="industry">Industry</option>
                    <option value="financial">Financial</option>
                    <option value="creators">Creators</option>
                    <option value="grading">Grading</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                    placeholder="Author name..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                    placeholder="Article URL..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                    placeholder="Image URL..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={formData.keywords.join(', ')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                  }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                  placeholder="keyword1, keyword2, keyword3..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-slate-700/50">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingArticle(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateArticle}
                disabled={!formData.title || !formData.content || isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{editingArticle ? 'Update' : 'Create'} Article</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsManagement;