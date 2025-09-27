import React from 'react';
import { Calendar, Film, BookOpen, TrendingUp, Clock, Star, Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUpcomingEvents } from '../../hooks/useAssetMarketData';

interface UpcomingEventsWidgetProps {
  className?: string;
  maxEvents?: number;
}

export function UpcomingEventsWidget({ className = '', maxEvents = 4 }: UpcomingEventsWidgetProps) {
  const { events, isLoading, error } = useUpcomingEvents();

  if (isLoading) {
    return (
      <div className={`bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-6 h-6 bg-slate-700/50 rounded animate-pulse" />
          <div className="w-32 h-6 bg-slate-700/50 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-700/50 rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-slate-700/50 rounded animate-pulse" />
                <div className="w-1/2 h-3 bg-slate-700/50 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !events || events.length === 0) {
    return (
      <div className={`bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl ${className}`}>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No upcoming events</p>
        </div>
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'movie': return <Film className="h-5 w-5 text-purple-400" />;
      case 'release': return <BookOpen className="h-5 w-5 text-blue-400" />;
      case 'convention': return <Users className="h-5 w-5 text-green-400" />;
      case 'earnings': return <TrendingUp className="h-5 w-5 text-yellow-400" />;
      default: return <Calendar className="h-5 w-5 text-gray-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-900/30 border-red-700/30 text-red-200';
      case 'medium': return 'bg-yellow-900/30 border-yellow-700/30 text-yellow-200';
      case 'low': return 'bg-green-900/30 border-green-700/30 text-green-200';
      default: return 'bg-slate-700/30 border-slate-600/30 text-gray-300';
    }
  };

  const formatEventDate = (date: Date) => {
    const eventDate = new Date(date);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} days`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks`;
    return eventDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all hover:-translate-y-1 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-indigo-400" />
          <h3 className="text-xl font-bold text-white">Upcoming Events</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">Market Calendar</span>
        </div>
      </div>

      <div className="space-y-4">
        {(events || []).slice(0, maxEvents).map((event) => (
          <div 
            key={event.id}
            className={`p-4 rounded-lg border transition-all hover:shadow-lg ${getImpactColor(event.impact)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-slate-800/50">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-white text-sm">{event.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{formatEventDate(event.date)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(event.impact)}`}>
                        {event.impact.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Related Assets */}
                {event.relatedSymbols.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 mb-1">Related:</p>
                    <div className="flex flex-wrap gap-1">
                      {event.relatedSymbols.slice(0, 3).map((symbol, index) => (
                        <Link
                          key={index}
                          to={`/trading/${symbol.symbol}`}
                          className="px-2 py-1 bg-slate-600/50 text-gray-300 rounded text-xs hover:bg-slate-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {symbol.symbol}
                        </Link>
                      ))}
                      {event.relatedSymbols.length > 3 && (
                        <span className="px-2 py-1 bg-slate-600/50 text-gray-400 rounded text-xs">
                          +{event.relatedSymbols.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-600/30">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            <span className="text-indigo-400 font-medium">
              {(events || []).filter(e => e.impact === 'high').length}
            </span>
            <span> high-impact events this month</span>
          </div>
          <Link 
            to="/markets/calendar"
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            Full Calendar →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UpcomingEventsWidget;