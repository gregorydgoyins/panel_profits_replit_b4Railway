import React from 'react';
import { MarketCapWidget } from './stats/MarketCapWidget';
import { VolumeWidget } from './stats/VolumeWidget';
import { AIConfidenceWidget } from './stats/AIConfidenceWidget';
import { HotAssetsWidget } from './stats/HotAssetsWidget';
import { ActiveTradersWidget } from './stats/ActiveTradersWidget';

export function MarketOverviewStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
      <MarketCapWidget />
      <VolumeWidget />
      <ActiveTradersWidget />
      <AIConfidenceWidget />
      <HotAssetsWidget />
    </div>
  );
}

export default MarketOverviewStats;