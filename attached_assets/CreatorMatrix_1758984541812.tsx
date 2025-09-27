import React, { useState } from 'react';
import { Users, TrendingUp, TrendingDown, Star, Award, Calendar, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { CreatorCard } from './CreatorCard';

interface Creator {
  id: string;
  name: string;
  symbol: string;
  role: string;
  age: number;
  price: number;
  change: number;
  percentageChange: number;
  marketCap: number;
  volume: number;
  rating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell';
  nextProject?: string;
  recentWorks: string[];
  yearsActive: number;
  awards: number;
  popularity: number;
  avatar?: string;
}

export function CreatorMatrix() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [sortBy, setSortBy] = useState('marketCap');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const mockCreators: Creator[] = [
    {
      id: '1',
      name: 'Todd McFarlane',
      symbol: 'TMFS',
      role: 'Artist/Writer',
      age: 62,
      price: 25.00,
      change: 1.25,
      percentageChange: 5.2,
      marketCap: 125000000,
      volume: 1250,
      rating: 'Strong Buy',
      nextProject: 'Spawn #350',
      recentWorks: ['Spawn #349', 'Spider-Man #1', 'Venom #1'],
      yearsActive: 35,
      awards: 12,
      popularity: 95,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Donny Cates',
      symbol: 'DCTS',
      role: 'Writer',
      age: 38,
      price: 18.00,
      change: 0.85,
      percentageChange: 4.9,
      marketCap: 90000000,
      volume: 980,
      rating: 'Buy',
      nextProject: 'Marvel Exclusive',
      recentWorks: ['Venom #35', 'Thor #25', 'Hulk #8'],
      yearsActive: 12,
      awards: 8,
      popularity: 88,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Stanley "Artgerm" Lau',
      symbol: 'ARTS',
      role: 'Cover Artist',
      age: 45,
      price: 15.00,
      change: -0.25,
      percentageChange: -1.6,
      marketCap: 75000000,
      volume: 750,
      rating: 'Hold',
      nextProject: 'DC Variants',
      recentWorks: ['Wonder Woman #800', 'Supergirl #50', 'Batgirl #25'],
      yearsActive: 18,
      awards: 15,
      popularity: 92,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '4',
      name: 'Jim Lee',
      symbol: 'JLES',
      role: 'Artist/Executive',
      age: 59,
      price: 32.00,
      change: 1.60,
      percentageChange: 5.3,
      marketCap: 160000000,
      volume: 1800,
      rating: 'Strong Buy',
      nextProject: 'Justice League Redesign',
      recentWorks: ['Batman #100', 'Superman #1000', 'Justice League #75'],
      yearsActive: 32,
      awards: 20,
      popularity: 98,
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '5',
      name: 'Brian Michael Bendis',
      symbol: 'BMBS',
      role: 'Writer',
      age: 56,
      price: 21.00,
      change: -0.42,
      percentageChange: -2.0,
      marketCap: 105000000,
      volume: 1100,
      rating: 'Hold',
      nextProject: 'DC Black Label',
      recentWorks: ['Action Comics #1050', 'Legion of Super-Heroes #12', 'Checkmate #6'],
      yearsActive: 25,
      awards: 18,
      popularity: 85,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '6',
      name: 'Fiona Staples',
      symbol: 'FSTS',
      role: 'Artist',
      age: 39,
      price: 16.50,
      change: 0.75,
      percentageChange: 4.8,
      marketCap: 82500000,
      volume: 650,
      rating: 'Buy',
      nextProject: 'Saga Volume 11',
      recentWorks: ['Saga #60', 'Saga #59', 'Saga #58'],
      yearsActive: 15,
      awards: 10,
      popularity: 90,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '7',
      name: 'Scott Snyder',
      symbol: 'SSNY',
      role: 'Writer',
      age: 47,
      price: 22.50,
      change: 1.13,
      percentageChange: 5.3,
      marketCap: 112500000,
      volume: 1050,
      rating: 'Strong Buy',
      nextProject: 'Dark Spaces: Wildfire',
      recentWorks: ['Batman: Last Knight on Earth', 'Nocterra', 'Undiscovered Country'],
      yearsActive: 16,
      awards: 14,
      popularity: 93,
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '8',
      name: 'Greg Capullo',
      symbol: 'GCAP',
      role: 'Artist',
      age: 60,
      price: 19.50,
      change: -0.39,
      percentageChange: -2.0,
      marketCap: 97500000,
      volume: 920,
      rating: 'Hold',
      nextProject: 'Batman: Fear State',
      recentWorks: ['Batman: Last Knight on Earth', 'Batman: Death Metal', 'Reborn'],
      yearsActive: 35,
      awards: 16,
      popularity: 91,
      avatar: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '9',
      name: 'Kelly Sue DeConnick',
      symbol: 'KSDC',
      role: 'Writer',
      age: 52,
      price: 17.50,
      change: 0.88,
      percentageChange: 5.3,
      marketCap: 87500000,
      volume: 820,
      rating: 'Buy',
      nextProject: 'Aquaman: Andromeda',
      recentWorks: ['Captain Marvel', 'Aquaman', 'Bitch Planet'],
      yearsActive: 18,
      awards: 9,
      popularity: 87,
      avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const roles = ['All', 'Writer', 'Artist', 'Cover Artist', 'Artist/Writer', 'Artist/Executive'];
  const ratings = ['All', 'Strong Buy', 'Buy', 'Hold', 'Sell'];

  const filteredCreators = mockCreators
    .filter(creator => {
      const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           creator.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'All' || creator.role === selectedRole;
      const matchesRating = selectedRating === 'All' || creator.rating === selectedRating;
      return matchesSearch && matchesRole && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'marketCap':
          return b.marketCap - a.marketCap;
        case 'price':
          return b.price - a.price;
        case 'change':
          return b.percentageChange - a.percentageChange;
        case 'popularity':
          return b.popularity - a.popularity;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[{ name: 'Creator Matrix' }]} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Creator Matrix</h1>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Calendar className="h-5 w-5" />
          <span className="text-sm">Real-time data</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators..."
              className="pl-10 pr-4 py-2 w-full bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 touch-target"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2 w-full touch-target"
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2 touch-target"
          >
            {ratings.map(rating => (
              <option key={rating} value={rating}>{rating}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2 touch-target"
          >
            <option value="marketCap">Market Cap</option>
            <option value="price">Price</option>
            <option value="change">% Change</option>
            <option value="popularity">Popularity</option>
          </select>

          <div className="text-sm text-gray-400 flex items-center">
            {filteredCreators.length} creators found
          </div>
        </div>
      </div>

      {/* Creators Grid - 3x3 Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {filteredCreators.slice(0, 9).map((creator) => (
          <CreatorCard 
            key={creator.id}
            creator={creator}
            onSelect={(id) => setSelectedCard(selectedCard === id ? null : id)}
            isSelected={selectedCard === creator.id}
          />
        ))}
      </div>

      {filteredCreators.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No creators found</h3>
          <p className="text-gray-400">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
}

export default CreatorMatrix;