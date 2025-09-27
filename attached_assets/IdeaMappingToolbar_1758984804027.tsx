import React from 'react';
import { 
  Search, Filter, Eye, EyeOff, Plus, Zap, Layout, Download,
  Network, List, Grid
} from 'lucide-react';

interface IdeaMappingToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterRelationType: string;
  setFilterRelationType: (type: string) => void;
  selectedNodesCount: number;
  showAnalysis: boolean;
  setShowAnalysis: (show: boolean) => void;
  onAddIdea: () => void;
  onQuickConnect: () => void;
  onAutoLayout: () => void;
  onExport: () => void;
  categories: string[];
  relationshipTypes: string[];
}

export function IdeaMappingToolbar({
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
  filterRelationType,
  setFilterRelationType,
  selectedNodesCount,
  showAnalysis,
  setShowAnalysis,
  onAddIdea,
  onQuickConnect,
  onAutoLayout,
  onExport,
  categories,
  relationshipTypes
}: IdeaMappingToolbarProps) {
  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 shadow-xl border border-slate-700/50 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={filterRelationType}
              onChange={(e) => setFilterRelationType(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Relations</option>
              {relationshipTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              showAnalysis
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:text-white'
            }`}
          >
            {showAnalysis ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>Analysis</span>
          </button>
          
          <button
            onClick={onAddIdea}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Idea</span>
          </button>
          
          <button
            onClick={onQuickConnect}
            disabled={selectedNodesCount < 2}
            className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
          >
            <Zap className="h-4 w-4" />
            <span>Connect ({selectedNodesCount})</span>
          </button>
          
          <button
            onClick={onAutoLayout}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
          >
            <Layout className="h-4 w-4" />
            <span>Layout</span>
          </button>
          
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default IdeaMappingToolbar;