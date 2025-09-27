import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { AssetStockList } from '../../components/asset/AssetStockList';

export function VillainStockPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[
        { name: 'Characters', path: '/characters' },
        { name: 'Villains' }
      ]} />
      <AssetStockList 
        assetType="character"
        title="Supervillain Stocks"
        description="Invest in the most notorious supervillains from the comic universe. These characters often show higher volatility but can offer significant returns, especially when featured as antagonists in major media productions."
      />
    </div>
  );
}

export default VillainStockPage;