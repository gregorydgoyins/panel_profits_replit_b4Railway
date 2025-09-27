import React, { useState } from 'react';
import { Calendar, TrendingUp, Info, Star, Building2, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface IPOAnnouncement {
  id: string;
  name: string;
  symbol: string;
  type: 'character' | 'creator' | 'publisher' | 'fund';
  description: string;
  expectedDate: Date;
  estimatedValue: number;
  underwriters: string[];
  riskLevel: 'low' | 'medium' | 'high';
  popularity: number;
  status: 'upcoming' | 'active' | 'completed';
}

interface IPOAnnouncementsProps {
  maxItems?: number;
  showFilters?: boolean;
  compact?: boolean;
}

export function IPOAnnouncements({ maxItems = 5, showFilters = true, compact = false }: IPOAnnouncementsProps) {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('upcoming');
  const [selectedRisk, setSelectedRisk] = useState('all');
  
  // Mock IPO announcements
  const mockAnnouncements: IPOAnnouncement[] = [
    {
      id: '1',
      name: 'Sandman Universe',
      symbol: 'SNDM',
      type: 'character',
      description: 'Neil Gaiman\'s Sandman Universe characters and storylines, including Dream, Death, and the Endless.',
      expectedDate: new Date('2025-07-15'),
      estimatedValue: 85000000,
      underwriters: ['DC Comics', 'Vertigo Capital'],
      riskLevel: 'medium',
      popularity: 92,
      status: 'upcoming'
    },
    {
      id: '2',
      name: 'Donny Cates Collection',
      symbol: 'DCTC',
      type: 'creator',
      description: 'Portfolio of Donny Cates\' creator-owned properties and royalty streams from Marvel work.',
      expectedDate: new Date('2025-08-01'),
      estimatedValue: 45000000,
      underwriters: ['Image Securities', 'Marvel Ventures'],
      riskLevel: 'medium',
      popularity: 88,
      status: 'upcoming'
    },
    {
      id: '3',
      name: 'Boom! Studios',
      symbol: 'BOOM',
      type: 'publisher',
      description: 'Independent comic book and graphic novel publisher known for original series and licensed properties.',
      expectedDate: new Date('2025-06-30'),
      estimatedValue: 120000000,
      underwriters: ['Comic Capital Group', 'Indie Publishing Partners'],
      riskLevel: 'medium',
      popularity: 85,
      status: 'upcoming'
    },
    {
      id: '4',
      name: 'Golden Age Preservation Fund',
      symbol: 'GAPF',
      type: 'fund',
      description: 'Investment fund focused on acquiring and preserving high-grade Golden Age comics.',
      expectedDate: new Date('2025-07-01'),
      estimatedValue: 210000000,
      underwriters: ['Heritage Financial', 'Collector\'s Trust'],
      riskLevel: 'low',
      popularity: 90,
      status: 'upcoming'
    },
    {
      id: '5',
      name: 'Invincible Universe',
      symbol: 'INVN',
      type: 'character',
      description: 'Robert Kirkman\'s Invincible universe characters and storylines, including Invincible, Omni-Man, and supporting cast.',
      expectedDate: new Date('2025-08-15'),
      estimatedValue: 65000000,
      underwriters: ['Image Securities', 'Skybound Capital'],
      riskLevel: 'medium',
      popularity: 87,
      status: 'upcoming'
    },
    {
      id: '6',
      name: 'Valiant Entertainment',
      symbol: 'VLNT',
      type: 'publisher',
      description: 'Publisher of the Valiant Universe featuring characters like Bloodshot, X-O Manowar, and Harbinger.',
      expectedDate: new Date('2025-09-01'),
      estimatedValue: 95000000,
      underwriters: ['DMG Entertainment', 'Comic Capital Group'],
      riskLevel: 'high',
      popularity: 82,
      status: 'upcoming'
    },
    {
      id: '7',
      name: 'Modern Age Growth Fund',
      symbol: 'MAGF',
      type: 'fund',
      description: 'Aggressive growth fund focusing on Modern Age comics with high appreciation potential.',
      expectedDate: new Date('2025-07-20'),
      estimatedValue: 65000000,
      underwriters: ['New Age Investments', 'Future Comics LLC'],
      riskLevel: 'high',
      popularity: 84,
      status: 'upcoming'
    }
  ];
  
  // Filter announcements
  const filteredAnnouncements = mockAnnouncements
    .filter(announcement => {
      const matchesType = selectedType === 'all' || announcement.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || announcement.status === selectedStatus;
      const matchesRisk = selectedRisk === 'all' || announcement.riskLevel === selectedRisk;
      return matchesType && matchesStatus && matchesRisk;
    })
    .slice(0, maxItems);
  
  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'character': return <Users className="h-5 w-5 text-indigo-400" />;
      case 'creator': return <Users className="h-5 w-5 text-green-400" />;
      case 'publisher': return <Building2 className="h-5 w-5 text-yellow-400" />;
      case 'fund': return <BookOpen className="h-5 w-5 text-purple-400" />;
      default: return <Star className="h-5 w-5 text-indigo-400" />;
    }
  };
  
  // Get risk level color
  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-900/50 text-green-200 border-green-700/50';
      case 'medium': return 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50';
      case 'high': return 'bg-red-900/50 text-red-200 border-red-700/50';
      default: return 'bg-gray-900/50 text-gray-200 border-gray-700/50';
    }
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Upcoming IPOs</h2>
        </div>
        
        {showFilters && (
          <div className="flex items-center space-x-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2"
            >
              <option value="all">All Types</option>
              <option value="character">Characters</option>
              <option value="creator">Creators</option>
              <option value="publisher">Publishers</option>
              <option value="fund">Funds</option>
            </select>
            
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        )}
      </div>
      
      {!compact && (
        <div className="mb-6 bg-indigo-900/20 p-4 rounded-lg border border-indigo-700/30">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-indigo-200">
              Initial Public Offerings (IPOs) represent the first time a comic asset becomes available for public trading. 
              These offerings provide early access to potentially valuable assets but come with varying levels of risk.
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((ipo) => (
            <div 
              key={ipo.id} 
              className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700/70 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(ipo.type)}
                    <h3 className="font-semibold text-white">{ipo.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-sm text-gray-400">{ipo.symbol}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(ipo.riskLevel)}`}>
                      {ipo.riskLevel.charAt(0).toUpperCase() + ipo.riskLevel.slice(1)} Risk
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Calendar className="h-4 w-4 text-indigo-400" />
                    <p className="text-sm text-gray-300">
                      {ipo.expectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Est. Value: CC {(ipo.estimatedValue / 1000000).toFixed(1)}M</p>
                </div>
              </div>
              
              {!compact && (
                <>
                  <p className="text-sm text-gray-300 mt-3">{ipo.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-400">Underwriters</p>
                      <p className="text-sm text-gray-300">{ipo.underwriters.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Popularity</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-slate-600 rounded-full h-1.5">
                          <div 
                            className="bg-indigo-500 h-1.5 rounded-full"
                            style={{ width: `${ipo.popularity}%` }}
                          />
                        </div>
                        <span className="text-xs text-white">{ipo.popularity}%</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <div className="mt-3 flex justify-end">
                <button className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 text-sm">
                  <Star className="h-4 w-4" />
                  <span>Add to Watchlist</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-slate-700/30 rounded-lg">
            <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">No upcoming IPOs found</p>
            <p className="text-sm text-gray-500">Check back later for new offerings</p>
          </div>
        )}
      </div>
      
      {filteredAnnouncements.length > 0 && filteredAnnouncements.length < mockAnnouncements.length && (
        <div className="mt-6 text-center">
          <Link 
            to="/markets/ipos"
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <TrendingUp className="h-5 w-5" />
            <span>View All IPOs</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default IPOAnnouncements;