import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { AssetStockList } from '../../components/asset/AssetStockList';

export function HenchmanStockPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[
        { name: 'Characters', path: '/characters' },
        { name: 'Henchmen' }
      ]} />
      <AssetStockList 
        assetType="character"
        category="henchman"
        title="Henchmen Stocks"
        description="Invest in the foot soldiers and minions of major supervillains. While individually less significant than their masters, henchmen stocks can offer surprising value due to their frequent appearances and collective importance to villain organizations."
        filters={{
          typeOptions: ['henchman'],
          typeLabel: 'Character Types'
        }}
      />
    </div>
  );
}

export default HenchmanStockPage;