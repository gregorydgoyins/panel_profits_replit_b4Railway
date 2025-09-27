import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { BondCard } from '../../components/bond/BondCard';
import { specialtyBonds } from '../../data/bondData';
import { Building2, Calendar } from 'lucide-react';

export function SpecialtyBondPage() {
  const [selectedCard, setSelectedCard] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[
        { name: 'Bonds', path: '/bonds' },
        { name: 'Specialty Bonds' }
      ]} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Specialty Bonds</h1>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Calendar className="h-5 w-5" />
          <span className="text-sm">Real-time data</span>
        </div>
      </div>

      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl">
        <p className="text-gray-300 mb-4">
          Specialty bonds are unique fixed-income securities with returns linked to specific segments of the comic book market or industry trends. These bonds offer targeted exposure to niche areas such as specific comic eras, media adaptations, or market indices.
        </p>
      </div>

      {/* Bonds Grid - 3x3 Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {specialtyBonds.slice(0, 9).map((bond) => (
          <BondCard 
            key={bond.id}
            bond={bond}
            onSelect={(id) => setSelectedCard(selectedCard === id ? null : id)}
            isSelected={selectedCard === bond.id}
          />
        ))}
      </div>
    </div>
  );
}

export default SpecialtyBondPage;