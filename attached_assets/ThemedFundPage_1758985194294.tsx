import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { FundCard } from '../../components/fund/FundCard';
import { themedFunds } from '../../data/fundData';
import { Briefcase, Calendar } from 'lucide-react';

export function ThemedFundPage() {
  const [selectedCard, setSelectedCard] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[
        { name: 'Funds', path: '/funds' },
        { name: 'Themed Funds' }
      ]} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Briefcase className="h-8 w-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Themed Funds</h1>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Calendar className="h-5 w-5" />
          <span className="text-sm">Real-time data</span>
        </div>
      </div>

      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl">
        <p className="text-gray-300 mb-4">
          Themed funds are professionally managed investment vehicles that focus on specific comic book categories, characters, or concepts. These funds offer diversified exposure to thematic segments of the comic market with professional management and curation.
        </p>
      </div>

      {/* Funds Grid - 3x3 Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {themedFunds.slice(0, 9).map((fund) => (
          <FundCard 
            key={fund.id}
            fund={fund}
            onSelect={(id) => setSelectedCard(selectedCard === id ? null : id)}
            isSelected={selectedCard === fund.id}
          />
        ))}
      </div>
    </div>
  );
}

export default ThemedFundPage;