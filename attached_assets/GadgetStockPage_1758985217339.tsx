import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { AssetStockList } from '../../components/asset/AssetStockList';
import { gadgets } from '../../data/gadgetData';

export function GadgetStockPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[{ name: 'Gadgets' }]} />
      <AssetStockList 
        assets={gadgets}
        assetType="gadget"
        title="Superhero Gadgets"
        description="Invest in the iconic tools, weapons, and technology used by heroes and villains. From Batman's utility belt to Iron Man's suit, these assets represent the cutting edge of comic book innovation."
      />
    </div>
  );
}

export default GadgetStockPage;