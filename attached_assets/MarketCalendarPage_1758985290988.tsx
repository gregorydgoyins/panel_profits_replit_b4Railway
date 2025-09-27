import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MarketCalendar } from '../../components/markets/MarketCalendar';
import { Calendar } from 'lucide-react';

export function MarketCalendarPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[
        { name: 'Markets', path: '/markets' },
        { name: 'Market Calendar' }
      ]} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="h-8 w-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Market Calendar</h1>
        </div>
      </div>
      
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl mb-6">
        <p className="text-gray-300">
          The Market Calendar provides a comprehensive view of upcoming events that may impact comic asset prices. 
          From comic releases and movie premieres to conventions and earnings reports, stay informed about events 
          that could create trading opportunities or affect your portfolio.
        </p>
      </div>
      
      <MarketCalendar showFilters={true} />
    </div>
  );
}

export default MarketCalendarPage;