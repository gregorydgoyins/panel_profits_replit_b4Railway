import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { AssetStockList } from '../../components/asset/AssetStockList';

export function CharacterStockPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[{ name: 'Characters' }]} />
      <AssetStockList 
        assetType="character"
        title="Comic Characters"
        description="Explore and trade stocks of iconic comic book characters, from legendary heroes to notorious villains."
        filters={{
          typeOptions: ['hero', 'villain', 'sidekick', 'henchman'],
          typeLabel: 'Character Types'
        }}
      />
    </div>
  );
}

export default CharacterStockPage;