import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { AssetStockList } from '../../components/asset/AssetStockList';
import { allLocations } from '../../data/locationData';

export function LocationStockPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[{ name: 'Locations' }]} />
      <AssetStockList 
        assets={allLocations}
        assetType="location"
        title="Comic Locations"
        description="Invest in iconic locations from the comic universe, from superhero headquarters to villain lairs. These assets often provide stable returns with lower volatility than character stocks."
        filters={{
          typeOptions: ['hangout', 'hideout'],
          typeLabel: 'Location Types'
        }}
      />
    </div>
  );
}

export default LocationStockPage;