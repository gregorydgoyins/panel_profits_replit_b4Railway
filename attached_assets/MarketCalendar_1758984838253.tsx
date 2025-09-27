import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Info, Star, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MarketEvent {
  id: string;
  title: string;
  date: Date;
  type: 'release' | 'movie' | 'convention' | 'announcement' | 'earnings';
  description: string;
  impact: 'high' | 'medium' | 'low';
  expectedDirection: 'up' | 'down' | 'neutral';
  relatedSymbols: Array<{
    symbol: string;
    name: string;
    type: 'character' | 'creator' | 'publisher' | 'bond' | 'fund';
  }>;
}

interface MarketCalendarProps {
  maxEvents?: number;
  showFilters?: boolean;
  compact?: boolean;
}

export function MarketCalendar({ maxEvents, showFilters = true, compact = false }: MarketCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedImpact, setSelectedImpact] = useState('all');
  const [viewMode, setViewMode] = useState<'month' | 'list'>('list');
  
  // Generate mock events for the next 6 months
  const generateMockEvents = (): MarketEvent[] => {
    const events: MarketEvent[] = [];
    const today = new Date();
    
    // Comic releases
    events.push({
      id: '1',
      title: 'Amazing Spider-Man #900',
      date: new Date(2024, 5, 15), // June 15, 2024
      type: 'release',
      description: 'Milestone 900th issue with multiple variant covers and special storyline.',
      impact: 'high',
      expectedDirection: 'up',
      relatedSymbols: [
        { symbol: 'ASM300', name: 'Amazing Spider-Man', type: 'character' },
        { symbol: 'SPDR', name: 'Spider-Man', type: 'character' },
        { symbol: 'MRVL', name: 'Marvel Entertainment', type: 'publisher' }
      ]
    });
    
    // Movie premiere
    events.push({
      id: '2',
      title: 'Venom 3 Theatrical Release',
      date: new Date(2024, 6, 12), // July 12, 2024
      type: 'movie',
      description: 'Third installment in the Venom franchise, expected to impact related comic values.',
      impact: 'high',
      expectedDirection: 'up',
      relatedSymbols: [
        { symbol: 'ASM300', name: 'Amazing Spider-Man #300', type: 'character' },
        { symbol: 'VNOM', name: 'Venom', type: 'character' },
        { symbol: 'MRVL', name: 'Marvel Entertainment', type: 'publisher' }
      ]
    });
    
    // Convention
    events.push({
      id: '3',
      title: 'San Diego Comic-Con',
      date: new Date(2024, 6, 25), // July 25, 2024
      type: 'convention',
      description: 'Major annual comic convention with multiple publisher announcements expected.',
      impact: 'high',
      expectedDirection: 'up',
      relatedSymbols: [
        { symbol: 'MRVL', name: 'Marvel Entertainment', type: 'publisher' },
        { symbol: 'DCCP', name: 'DC Comics', type: 'publisher' },
        { symbol: 'IMGC', name: 'Image Comics', type: 'publisher' }
      ]
    });
    
    // Publisher announcement
    events.push({
      id: '4',
      title: 'DC Comics Relaunch Announcement',
      date: new Date(2024, 7, 10), // August 10, 2024
      type: 'announcement',
      description: 'DC Comics expected to announce a line-wide relaunch with new #1 issues.',
      impact: 'medium',
      expectedDirection: 'up',
      relatedSymbols: [
        { symbol: 'DCCP', name: 'DC Comics', type: 'publisher' },
        { symbol: 'BATM', name: 'Batman', type: 'character' },
        { symbol: 'SUPR', name: 'Superman', type: 'character' }
      ]
    });
    
    // Earnings report
    events.push({
      id: '5',
      title: 'Marvel Entertainment Quarterly Earnings',
      date: new Date(2024, 7, 15), // August 15, 2024
      type: 'earnings',
      description: 'Q2 earnings report for Marvel Entertainment, expected to show strong performance.',
      impact: 'medium',
      expectedDirection: 'up',
      relatedSymbols: [
        { symbol: 'MRVL', name: 'Marvel Entertainment', type: 'publisher' },
        { symbol: 'MRVLB', name: 'Marvel Entertainment Bond', type: 'bond' }
      ]
    });
    
    // Creator announcement
    events.push({
      id: '6',
      title: 'Todd McFarlane New Project Announcement',
      date: new Date(2024, 8, 5), // September 5, 2024
      type: 'announcement',
      description: 'Todd McFarlane expected to announce a new major project.',
      impact: 'medium',
      expectedDirection: 'up',
      relatedSymbols: [
        { symbol: 'TMFS', name: 'Todd McFarlane', type: 'creator' },
        { symbol: 'IMGC', name: 'Image Comics', type: 'publisher' }
      ]
    });
    
    // Movie trailer
    events.push({
      id: '7',
      title: 'Batman: The Dark Knight Returns Trailer Release',
      date: new Date(2024, 8, 20), // September 20, 2024
      type: 'movie',
      description: 'First trailer for the animated adaptation of The Dark Knight Returns.',
      impact: 'medium',
      expectedDirection: 'up',
      relatedSymbols: [
        { symbol: 'BATM', name: 'Batman', type: 'character' },
        { symbol: 'DCCP', name: 'DC Comics', type: 'publisher' }
      ]
    });
    
    // Comic release
    events.push({
      id: '8',
      title: 'Spawn #350 Release',
      date: new Date(2024, 9, 10), // October 10, 2024
      type: 'release',
      description: 'Milestone 350th issue of Spawn with multiple variant covers.',
      impact: 'medium',
      expectedDirection: 'up',
      relatedSymbols: [
        { symbol: 'TMFS', name: 'Todd McFarlane', type: 'creator' },
        { symbol: 'IMGC', name: 'Image Comics', type: 'publisher' }
      ]
    });
    
    // Convention
    events.push({
      id: '9',
      title: 'New York Comic Con',
      date: new Date(2024, 9, 17), // October 17, 2024
      type: 'convention',
      description: 'Major East Coast comic convention with multiple publisher announcements expected.',
      impact: 'high',
      expectedDirection: 'up',
      relatedSymbols: [
        { symbol: 'MRVL', name: 'Marvel Entertainment', type: 'publisher' },
        { symbol: 'DCCP', name: 'DC Comics', type: 'publisher' },
        { symbol: 'IMGC', name: 'Image Comics', type: 'publisher' }
      ]
    });
    
    // Earnings report
    events.push({
      id: '10',
      title: 'DC Comics Quarterly Earnings',
      date: new Date(2024, 10, 15), // November 15, 2024
      type: 'earnings',
      description: 'Q3 earnings report for DC Comics.',
      impact: 'medium',
      expectedDirection: 'neutral',
      relatedSymbols: [
        { symbol: 'DCCP', name: 'DC Comics', type: 'publisher' },
        { symbol: 'DCCB', name: 'DC Comics Bond', type: 'bond' }
      ]
    });
    
    return events;
  };
  
  const allEvents = generateMockEvents();
  
  // Filter events based on selected filters
  const filteredEvents = allEvents
    .filter(event => {
      const matchesType = selectedEventType === 'all' || event.type === selectedEventType;
      const matchesImpact = selectedImpact === 'all' || event.impact === selectedImpact;
      return matchesType && matchesImpact;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, maxEvents);
  
  // Get impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-900/50 text-red-200 border-red-700/50';
      case 'medium': return 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50';
      case 'low': return 'bg-green-900/50 text-green-200 border-green-700/50';
      default: return 'bg-gray-900/50 text-gray-200 border-gray-700/50';
    }
  };
  
  // Get direction icon
  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return null;
    }
  };
  
  // Get event type icon
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'release': return '📚';
      case 'movie': return '🎬';
      case 'convention': return '🎪';
      case 'announcement': return '📢';
      case 'earnings': return '📊';
      default: return '📅';
    }
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Format month name
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // Check if date has events
  const hasEvents = (date: Date) => {
    return allEvents.some(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return allEvents.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();
    
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Generate calendar grid
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Market Calendar</h2>
        </div>
        
        {showFilters && (
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'month'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-indigo-600/20 hover:text-white'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-indigo-600/20 hover:text-white'
                }`}
              >
                List
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2 w-full"
            >
              <option value="all">All Event Types</option>
              <option value="release">Comic Releases</option>
              <option value="movie">Movies & TV</option>
              <option value="convention">Conventions</option>
              <option value="announcement">Announcements</option>
              <option value="earnings">Earnings Reports</option>
            </select>
          </div>
          
          <select
            value={selectedImpact}
            onChange={(e) => setSelectedImpact(e.target.value)}
            className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2"
          >
            <option value="all">All Impact Levels</option>
            <option value="high">High Impact</option>
            <option value="medium">Medium Impact</option>
            <option value="low">Low Impact</option>
          </select>
          
          <div className="text-right text-sm text-gray-400">
            {filteredEvents.length} events found
          </div>
        </div>
      )}
      
      {/* Month view */}
      {viewMode === 'month' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold text-white">{formatMonth(currentMonth)}</h3>
            <button
              onClick={nextMonth}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div 
                key={index} 
                className={`min-h-[80px] p-2 rounded-lg border ${
                  day 
                    ? hasEvents(day)
                      ? 'bg-indigo-900/20 border-indigo-700/30 hover:bg-indigo-900/30 cursor-pointer'
                      : 'bg-slate-700/30 border-slate-600/30'
                    : 'bg-transparent border-transparent'
                }`}
              >
                {day && (
                  <>
                    <div className="text-right text-sm font-medium text-gray-300 mb-1">
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {getEventsForDate(day).slice(0, 2).map(event => (
                        <div 
                          key={event.id} 
                          className="text-xs bg-slate-700/50 p-1 rounded truncate text-indigo-300"
                          title={event.title}
                        >
                          {event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title}
                        </div>
                      ))}
                      {getEventsForDate(day).length > 2 && (
                        <div className="text-xs text-gray-400 text-center">
                          +{getEventsForDate(day).length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* List view */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div 
                key={event.id} 
                className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700/70 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                      <h3 className="font-semibold text-white">{event.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {event.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(event.impact)}`}>
                      {event.impact.charAt(0).toUpperCase() + event.impact.slice(1)} Impact
                    </span>
                    {getDirectionIcon(event.expectedDirection)}
                  </div>
                </div>
                
                <p className="text-gray-300 mt-3">{event.description}</p>
                
                {event.relatedSymbols.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-400 mb-1">Related Assets:</p>
                    <div className="flex flex-wrap gap-2">
                      {event.relatedSymbols.map(symbol => (
                        <Link
                          key={symbol.symbol}
                          to={`/${symbol.type}/${symbol.symbol}`}
                          className="px-2 py-1 bg-slate-600/50 rounded text-xs text-indigo-300 hover:bg-slate-600 transition-colors"
                        >
                          {symbol.name} ({symbol.symbol})
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-3 flex justify-end">
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Add to Calendar</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-slate-700/30 rounded-lg">
              <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 mb-2">No events found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}
      
      {/* Info section */}
      {!compact && (
        <div className="mt-6 bg-indigo-900/20 p-4 rounded-lg border border-indigo-700/30">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-white mb-1">About Market Calendar</h3>
              <p className="text-sm text-gray-300">
                The Market Calendar tracks upcoming events that may impact comic asset prices. Use this tool to anticipate market movements and plan your trading strategy accordingly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketCalendar;