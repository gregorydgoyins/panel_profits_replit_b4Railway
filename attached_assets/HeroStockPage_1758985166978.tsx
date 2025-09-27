import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { AssetStockList } from '../../components/asset/AssetStockList';

export function HeroStockPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[
        { name: 'Characters', path: '/characters' },
        { name: 'Heroes' }
      ]} />
      <AssetStockList 
        assetType="character"
        title="Superhero Stocks"
        description="Invest in the most iconic superheroes from across the comic universe. These characters represent the pinnacle of heroism and typically offer stable growth with occasional spikes during major media adaptations."
      />
    </div>
  );
}

export default HeroStockPage;