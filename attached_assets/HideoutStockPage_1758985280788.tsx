import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { AssetStockList } from '../../components/asset/AssetStockList';
import { hideouts } from '../../data/locationData';

export function HideoutStockPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[
        { name: 'Locations', path: '/locations' },
        { name: 'Hideouts' }
      ]} />
      <AssetStockList 
        assets={hideouts}
        assetType="location"
        title="Villain Hideout Stocks"
        description="Invest in the secret lairs, bases, and headquarters of supervillains. These locations often see dramatic value fluctuations based on storyline developments and can offer significant returns when featured in major media adaptations."
      />
    </div>
  );
}

export default HideoutStockPage;