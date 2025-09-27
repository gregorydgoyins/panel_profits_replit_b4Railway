import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { AssetStockList } from '../../components/asset/AssetStockList';
import { hangouts } from '../../data/locationData';

export function HangoutStockPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[
        { name: 'Locations', path: '/locations' },
        { name: 'Hangouts' }
      ]} />
      <AssetStockList 
        assets={hangouts}
        assetType="location"
        title="Hero Hangout Stocks"
        description="Invest in the headquarters, bases, and gathering places of superheroes. These locations are central to hero operations and often feature prominently in major storylines and adaptations."
      />
    </div>
  );
}

export default HangoutStockPage;