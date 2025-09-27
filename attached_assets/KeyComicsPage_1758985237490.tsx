import React, { useState } from 'react';
import { BookOpen, Search, Filter, TrendingUp, TrendingDown, Star, Calendar, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

interface KeyComic {
  id: string;
  title: string;
  symbol: string;
  issue: string;
  publisher: string;
  year: number;
  significance: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  grade: string;
  firstAppearance?: string;
  keyCharacters: string[];
  category: 'golden' | 'silver' | 'bronze' | 'modern';
  rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary';
  volume: number;
}

const keyComicsData: KeyComic[] = [
  {
    id: '1',
    title: 'Action Comics',
    symbol: 'ACM1',
    issue: '#1',
    publisher: 'DC Comics',
    year: 1938,
    significance: 'First appearance of Superman',
    currentPrice: 32000,
    change: 1250,
    percentChange: 4.06,
    grade: 'CGC 9.0',
    firstAppearance: 'Superman',
    keyCharacters: ['Superman', 'Clark Kent'],
    category: 'golden',
    rarity: 'legendary',
    volume: 15
  },
  {
    id: '2',
    title: 'Detective Comics',
    symbol: 'DTM27',
    issue: '#27',
    publisher: 'DC Comics',
    year: 1939,
    significance: 'First appearance of Batman',
    currentPrice: 28000,
    change: 850,
    percentChange: 3.13,
    grade: 'CGC 8.5',
    firstAppearance: 'Batman',
    keyCharacters: ['Batman', 'Bruce Wayne'],
    category: 'golden',
    rarity: 'legendary',
    volume: 12
  },
  {
    id: '3',
    title: 'Amazing Fantasy',
    symbol: 'AF15',
    issue: '#15',
    publisher: 'Marvel Comics',
    year: 1962,
    significance: 'First appearance of Spider-Man',
    currentPrice: 18000,
    change: 950,
    percentChange: 5.57,
    grade: 'CGC 9.2',
    firstAppearance: 'Spider-Man',
    keyCharacters: ['Spider-Man', 'Peter Parker'],
    category: 'silver',
    rarity: 'legendary',
    volume: 25
  },
  {
    id: '4',
    title: 'Marvel Comics',
    symbol: 'MRV1',
    issue: '#1',
    publisher: 'Marvel Comics',
    year: 1939,
    significance: 'First Marvel comic, first appearance of Human Torch',
    currentPrice: 8500,
    change: 350,
    percentChange: 4.29,
    grade: 'CGC 8.0',
    firstAppearance: 'Human Torch (Android)',
    keyCharacters: ['Human Torch', 'Sub-Mariner'],
    category: 'golden',
    rarity: 'very-rare',
    volume: 8
  },
  {
    id: '5',
    title: 'Amazing Spider-Man',
    symbol: 'ASM1',
    issue: '#1',
    publisher: 'Marvel Comics',
    year: 1963,
    significance: 'First solo Spider-Man comic',
    currentPrice: 4500,
    change: 180,
    percentChange: 4.17,
    grade: 'CGC 9.0',
    keyCharacters: ['Spider-Man', 'J. Jonah Jameson'],
    category: 'silver',
    rarity: 'very-rare',
    volume: 35
  },
  {
    id: '6',
    title: 'Amazing Spider-Man',
    symbol: 'ASM300',
    issue: '#300',
    publisher: 'Marvel Comics',
    year: 1988,
    significance: 'First full appearance of Venom',
    currentPrice: 25,
    change: 1.25,
    percentChange: 5.26,
    grade: 'CGC 9.8',
    firstAppearance: 'Venom',
    keyCharacters: ['Venom', 'Spider-Man'],
    category: 'modern',
    rarity: 'rare',
    volume: 1250
  },
  {
    id: '7',
    title: 'Fantastic Four',
    symbol: 'FF1',
    issue: '#1',
    publisher: 'Marvel Comics',
    year: 1961,
    significance: 'First appearance of Fantastic Four',
    currentPrice: 1800,
    change: 75,
    percentChange: 4.35,
    grade: 'CGC 8.5',
    firstAppearance: 'Fantastic Four',
    keyCharacters: ['Mr. Fantastic', 'Invisible Woman', 'Human Torch', 'The Thing'],
    category: 'silver',
    rarity: 'rare',
    volume: 45
  },
  {
    id: '8',
    title: 'X-Men',
    symbol: 'XM1',
    issue: '#1',
    publisher: 'Marvel Comics',
    year: 1963,
    significance: 'First appearance of X-Men',
    currentPrice: 1250,
    change: 52,
    percentChange: 4.34,
    grade: 'CGC 9.0',
    firstAppearance: 'X-Men',
    keyCharacters: ['Professor X', 'Cyclops', 'Jean Grey', 'Beast', 'Angel', 'Iceman'],
    category: 'silver',
    rarity: 'rare',
    volume: 55
  },
  {
    id: '9',
    title: 'Batman',
    symbol: 'BTM1',
    issue: '#1',
    publisher: 'DC Comics',
    year: 1940,
    significance: 'First appearance of The Joker and Catwoman',
    currentPrice: 3200,
    change: 120,
    percentChange: 3.90,
    grade: 'CGC 8.0',
    firstAppearance: 'The Joker, Catwoman',
    keyCharacters: ['The Joker', 'Catwoman', 'Batman'],
    category: 'golden',
    rarity: 'very-rare',
    volume: 18
  },
  {
    id: '10',
    title: 'Wonder Woman',
    symbol: 'WW1',
    issue: '#1',
    publisher: 'DC Comics',
    year: 1942,
    significance: 'First solo Wonder Woman comic',
    currentPrice: 850,
    change: 32,
    percentChange: 3.92,
    grade: 'CGC 9.0',
    keyCharacters: ['Wonder Woman', 'Steve Trevor'],
    category: 'golden',
    rarity: 'rare',
    volume: 28
  },
  {
    id: '11',
    title: 'All Star Comics',
    symbol: 'ASC8',
    issue: '#8',
    publisher: 'DC Comics',
    year: 1941,
    significance: 'First appearance of Wonder Woman',
    currentPrice: 1500,
    change: 65,
    percentChange: 4.53,
    grade: 'CGC 8.5',
    firstAppearance: 'Wonder Woman',
    keyCharacters: ['Wonder Woman', 'Justice Society'],
    category: 'golden',
    rarity: 'very-rare',
    volume: 22
  },
  {
    id: '12',
    title: 'Hulk',
    symbol: 'HLK181',
    issue: '#181',
    publisher: 'Marvel Comics',
    year: 1974,
    significance: 'First full appearance of Wolverine',
    currentPrice: 85,
    change: 4.20,
    percentChange: 5.20,
    grade: 'CGC 9.6',
    firstAppearance: 'Wolverine',
    keyCharacters: ['Wolverine', 'Hulk', 'Wendigo'],
    category: 'bronze',
    rarity: 'rare',
    volume: 850
  }
];

export function KeyComicsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [sortBy, setSortBy] = useState('price');

  const categories = ['all', 'golden', 'silver', 'bronze', 'modern'];
  const rarities = ['all', 'common', 'uncommon', 'rare', 'very-rare', 'legendary'];

  // Filter and sort comics
  const filteredComics = keyComicsData
    .filter(comic => {
      const matchesSearch = comic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           comic.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           comic.significance.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           comic.keyCharacters.some(char => char.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || comic.category === selectedCategory;
      const matchesRarity = selectedRarity === 'all' || comic.rarity === selectedRarity;
      return matchesSearch && matchesCategory && matchesRarity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.currentPrice - a.currentPrice;
        case 'change':
          return b.percentChange - a.percentChange;
        case 'year':
          return a.year - b.year;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50';
      case 'very-rare':
        return 'bg-purple-900/50 text-purple-200 border-purple-700/50';
      case 'rare':
        return 'bg-blue-900/50 text-blue-200 border-blue-700/50';
      case 'uncommon':
        return 'bg-green-900/50 text-green-200 border-green-700/50';
      default:
        return 'bg-gray-900/50 text-gray-200 border-gray-700/50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'golden':
        return 'text-yellow-400';
      case 'silver':
        return 'text-gray-300';
      case 'bronze':
        return 'text-amber-600';
      case 'modern':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[{ name: 'Key Comics' }]} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Key Comics Pricing</h1>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Calendar className="h-5 w-5" />
          <span className="text-sm">Real-time Panel Profits pricing</span>
        </div>
      </div>

      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="flex items-start space-x-4 mb-6">
          <Info className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-gray-300">
            Discover the most valuable and significant comic books in history with real-time Panel Profits pricing. 
            These key issues represent cornerstone moments in comic book history and drive the broader market.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search comics..."
              className="pl-10 pr-4 py-2 w-full bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2 w-full"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Ages' : `${category.charAt(0).toUpperCase() + category.slice(1)} Age`}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2"
          >
            {rarities.map(rarity => (
              <option key={rarity} value={rarity}>
                {rarity === 'all' ? 'All Rarities' : rarity.charAt(0).toUpperCase() + rarity.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2"
          >
            <option value="price">Price (High to Low)</option>
            <option value="change">% Change (High to Low)</option>
            <option value="year">Year (Oldest First)</option>
            <option value="alphabetical">Alphabetical</option>
          </select>

          <div className="text-sm text-gray-400 flex items-center">
            {filteredComics.length} comics found
          </div>
        </div>

        {/* Comics Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700/50">
            <thead>
              <tr className="bg-slate-700/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Comic</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Significance</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Current Price</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">24h Change</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Grade</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Rarity</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Volume</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredComics.map((comic) => (
                <tr key={comic.id} className="hover:bg-slate-700/30">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white">{comic.title} {comic.issue}</span>
                          <span className={`text-xs ${getCategoryColor(comic.category)}`}>
                            {comic.category.charAt(0).toUpperCase() + comic.category.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{comic.symbol} • {comic.publisher} • {comic.year}</p>
                        {comic.firstAppearance && (
                          <p className="text-xs text-indigo-400">First: {comic.firstAppearance}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-300">{comic.significance}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {comic.keyCharacters.slice(0, 2).map((char, index) => (
                          <span key={index} className="px-2 py-1 bg-slate-600/50 text-gray-300 rounded text-xs">
                            {char}
                          </span>
                        ))}
                        {comic.keyCharacters.length > 2 && (
                          <span className="px-2 py-1 bg-slate-600/50 text-gray-400 rounded text-xs">
                            +{comic.keyCharacters.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-lg font-bold text-white">
                      CC {comic.currentPrice.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {comic.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )}
                      <div className="text-right">
                        <div className={`font-semibold ${comic.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {comic.change > 0 ? '+' : ''}{comic.percentChange}%
                        </div>
                        <div className="text-xs text-gray-400">
                          {comic.change > 0 ? '+' : ''}CC {comic.change.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="px-2 py-1 bg-indigo-900/50 text-indigo-200 rounded-full text-xs border border-indigo-700/50">
                      {comic.grade}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(comic.rarity)}`}>
                      {comic.rarity.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-gray-300">
                    {comic.volume.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <Link
                        to={`/trading/${comic.symbol}`}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-xs"
                      >
                        Trade
                      </Link>
                      <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-xs">
                        Watch
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredComics.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No comics found</h3>
            <p className="text-gray-400">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>

      {/* Quick Access to AI Tools */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Powered by AI Intelligence</h2>
            <p className="text-white/90 mb-4">
              Pricing powered by advanced AI market analysis and real-time sentiment tracking.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/ideas"
                className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
              >
                AI Analysis
              </Link>
              <Link
                to="/ideas/mapping"
                className="bg-slate-800/50 text-white hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors"
              >
                Market Mapping
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <BookOpen className="h-24 w-24 text-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default KeyComicsPage;