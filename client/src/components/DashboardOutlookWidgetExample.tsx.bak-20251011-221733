// client/src/components/DashboardOutlookWidgetExample.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { ThemedTile, ThemedCTA } from '@/components/ThemedTile';

export default function DashboardOutlookWidgetExample() {
  return (
    <Card className="!bg-[#1A1F2E] white-rimlight-hover" data-testid="widget-portfolio-outlook">
      <div className="px-4 pt-4">
        <span style={{ fontWeight: 300 }}>Portfolio Outlook</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4">
        <ThemedTile title="Account Value" to="/portfolio/account-value">
          <div className="text-2xl font-semibold">$123,456</div>
          <div className="text-xs text-white/60">Total account value</div>
          <ThemedCTA to="/portfolio/account-value" label="Details" />
        </ThemedTile>

        <ThemedTile title="Day P/L" to="/portfolio/pnl">
          <div className="text-2xl font-semibold text-emerald-400">+$1,234</div>
          <div className="text-xs text-white/60">Today’s change</div>
          <ThemedCTA to="/portfolio/pnl" label="View P/L" />
        </ThemedTile>

        <ThemedTile title="Total Return" to="/portfolio/returns">
          <div className="text-2xl font-semibold">+12.7%</div>
          <div className="text-xs text-white/60">Since inception</div>
          <ThemedCTA to="/portfolio/returns" label="Details" />
        </ThemedTile>

        <ThemedTile title="Buying Power" to="/portfolio/buying-power">
          <div className="text-2xl font-semibold">$18,900</div>
          <div className="text-xs text-white/60">Available to trade</div>
          <ThemedCTA to="/portfolio/buying-power" label="Manage" />
        </ThemedTile>

        <ThemedTile title="Open Orders" to="/portfolio/orders">
          <div className="text-2xl font-semibold">7</div>
          <div className="text-xs text-white/60">Awaiting fill</div>
          <ThemedCTA to="/portfolio/orders" label="Orders" />
        </ThemedTile>

        <ThemedTile title="Positions" to="/portfolio/positions">
          <div className="text-2xl font-semibold">12</div>
          <div className="text-xs text-white/60">Active positions</div>
          <ThemedCTA to="/portfolio/positions" label="Positions" />
        </ThemedTile>
      </div>
    </Card>
  );
}
