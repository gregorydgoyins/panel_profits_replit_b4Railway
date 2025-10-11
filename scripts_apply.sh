# scripts/apply-themed-tiles.sh
set -euo pipefail

ROOT_DIR="$(pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"

DASHBOARD_FILE="client/src/pages/DashboardPage.tsx"
HOOK_FILE="client/src/hooks/useRouteTheme.ts"
TILE_FILE="client/src/components/ThemedTile.tsx"
WIDGET_FILE="client/src/components/DashboardOutlookWidgetExample.tsx"
RIM_CSS="client/src/styles/rimlight.css"

# ---------- sanity ----------
[ -f "$DASHBOARD_FILE" ] || { echo "❌ $DASHBOARD_FILE not found"; exit 1; }
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "❌ not a git repo"; exit 1; }

# ---------- safety snapshot ----------
git add -A >/dev/null 2>&1 || true
git commit -m "wip: snapshot before apply-themed-tiles ($STAMP)" --no-verify >/dev/null 2>&1 || true
git branch "safety-$STAMP" >/dev/null 2>&1 || true
echo "🛟 safety branch created: safety-$STAMP"

# ---------- files: route theme hook ----------
mkdir -p "$(dirname "$HOOK_FILE")"
cat > "$HOOK_FILE" <<'TS'
// client/src/hooks/useRouteTheme.ts
export type ThemeColor =
  | 'white' | 'purple' | 'blue' | 'orange' | 'pink' | 'cyan' | 'green' | 'yellow';

export const ROUTE_THEME_MAP: Record<string, ThemeColor> = {
  '/dashboard': 'white',
  '/portfolio': 'yellow',
  '/trading': 'blue',
  '/terminal': 'blue',
  '/analytics': 'green',
  '/news': 'orange',
  '/learn': 'cyan',
  '/research': 'pink',
  '/assets': 'purple',
};

export function routeThemeFromPath(path?: string, fallback: ThemeColor = 'white'): ThemeColor {
  if (!path) return fallback;
  const first = '/' + path.split('/').filter(Boolean)[0];
  return ROUTE_THEME_MAP[first] ?? fallback;
}
TS
echo "✅ wrote $HOOK_FILE"

# ---------- files: rimlight css ----------
mkdir -p "$(dirname "$RIM_CSS")"
cat > "$RIM_CSS" <<'CSS'
/* client/src/styles/rimlight.css */
:root { --rim-alpha: .45; --glow-alpha: .5; }
.white-rimlight-hover       { transition: box-shadow .2s, border-color .2s; border: 1px solid transparent; }
.yellow-rimlight-hover      { transition: box-shadow .2s, border-color .2s; border: 1px solid transparent; }
.blue-rimlight-hover        { transition: box-shadow .2s, border-color .2s; border: 1px solid transparent; }
.green-rimlight-hover       { transition: box-shadow .2s, border-color .2s; border: 1px solid transparent; }
.orange-rimlight-hover      { transition: box-shadow .2s, border-color .2s; border: 1px solid transparent; }
.pink-rimlight-hover        { transition: box-shadow .2s, border-color .2s; border: 1px solid transparent; }
.purple-rimlight-hover      { transition: box-shadow .2s, border-color .2s; border: 1px solid transparent; }
.cyan-rimlight-hover        { transition: box-shadow .2s, border-color .2s; border: 1px solid transparent; }

.white-rimlight-hover:hover  { box-shadow: 0 0 0 1px rgba(255,255,255,var(--rim-alpha)), 0 0 18px rgba(255,255,255,var(--glow-alpha)); border-color: rgba(255,255,255,var(--rim-alpha)); }
.yellow-rimlight-hover:hover { box-shadow: 0 0 0 1px rgba(250,204,21,var(--rim-alpha)), 0 0 18px rgba(250,204,21,var(--glow-alpha)); border-color: rgba(250,204,21,var(--rim-alpha)); }
.blue-rimlight-hover:hover   { box-shadow: 0 0 0 1px rgba(59,130,246,var(--rim-alpha)), 0 0 18px rgba(59,130,246,var(--glow-alpha)); border-color: rgba(59,130,246,var(--rim-alpha)); }
.green-rimlight-hover:hover  { box-shadow: 0 0 0 1px rgba(34,197,94,var(--rim-alpha)), 0 0 18px rgba(34,197,94,var(--glow-alpha)); border-color: rgba(34,197,94,var(--rim-alpha)); }
.orange-rimlight-hover:hover { box-shadow: 0 0 0 1px rgba(249,115,22,var(--rim-alpha)), 0 0 18px rgba(249,115,22,var(--glow-alpha)); border-color: rgba(249,115,22,var(--rim-alpha)); }
.pink-rimlight-hover:hover   { box-shadow: 0 0 0 1px rgba(236,72,153,var(--rim-alpha)), 0 0 18px rgba(236,72,153,var(--glow-alpha)); border-color: rgba(236,72,153,var(--rim-alpha)); }
.purple-rimlight-hover:hover { box-shadow: 0 0 0 1px rgba(167,139,250,var(--rim-alpha)), 0 0 18px rgba(167,139,250,var(--glow-alpha)); border-color: rgba(167,139,250,var(--rim-alpha)); }
.cyan-rimlight-hover:hover   { box-shadow: 0 0 0 1px rgba(6,182,212,var(--rim-alpha)), 0 0 18px rgba(6,182,212,var(--glow-alpha)); border-color: rgba(6,182,212,var(--rim-alpha)); }

.hover-elevate { transition: transform .15s ease, box-shadow .2s ease; }
.hover-elevate:hover { transform: translateY(-1px); }
CSS
echo "✅ wrote $RIM_CSS"

# ---------- files: ThemedTile + CTA ----------
mkdir -p "$(dirname "$TILE_FILE")"
cat > "$TILE_FILE" <<'TSX'
// client/src/components/ThemedTile.tsx
import React from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { routeThemeFromPath, type ThemeColor } from '@/hooks/useRouteTheme';
import '@/styles/rimlight.css';

type TileProps = {
  to?: string;
  title?: string;
  className?: string;
  rim?: 'inherit' | ThemeColor;   // 'inherit' = color from `to`
  forceTheme?: ThemeColor;        // force a color regardless of `to`
  children?: React.ReactNode;
  'data-testid'?: string;
};

function rimClass(theme: ThemeColor) {
  return `${theme}-rimlight-hover`;
}

export function ThemedTile({
  to,
  title,
  className,
  rim = 'inherit',
  forceTheme,
  children,
  ...rest
}: TileProps) {
  const theme: ThemeColor = forceTheme ?? (rim === 'inherit'
    ? routeThemeFromPath(to, 'white')
    : (rim as ThemeColor));

  const body = (
    <Card
      className={cn(
        '!bg-[#1A1F2E]',
        'white-rimlight-hover',   // subtle white outer rim everywhere
        rimClass(theme),          // destination-colored glow on hover
        'hover-elevate transition-all',
        className
      )}
      {...rest}
    >
      {title ? (
        <div className="px-3 pt-3 text-sm text-white/80 uppercase tracking-wide">{title}</div>
      ) : null}
      <div className="p-3">{children}</div>
    </Card>
  );
  return to ? <Link href={to}>{body}</Link> : body;
}

type CTAProps = {
  to: string;
  label: string;
  className?: string;
  forceTheme?: ThemeColor;
};
export function ThemedCTA({ to, label, className, forceTheme }: CTAProps) {
  const theme = forceTheme ?? routeThemeFromPath(to, 'white');
  return (
    <Link href={to}>
      <button
        className={cn(
          'mt-2 h-8 px-3 rounded text-sm uppercase tracking-wide',
          'border bg-black/30 hover:bg-black/40 transition-all',
          rimClass(theme),
          className
        )}
      >
        {label}
      </button>
    </Link>
  );
}
TSX
echo "✅ wrote $TILE_FILE"

# ---------- files: DashboardOutlook widget ----------
mkdir -p "$(dirname "$WIDGET_FILE")"
cat > "$WIDGET_FILE" <<'TSX'
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
TSX
echo "✅ wrote $WIDGET_FILE"

# ---------- patch: import + swap widget in Dashboard page ----------
cp "$DASHBOARD_FILE" "${DASHBOARD_FILE}.bak-${STAMP}"
echo "🧾 backup: ${DASHBOARD_FILE}.bak-${STAMP}"

# 1) import the example widget if not present
if ! grep -q "DashboardOutlookWidgetExample" "$DASHBOARD_FILE"; then
  # insert after the last import line
  LAST_IMPORT_LINE="$(grep -n '^import ' "$DASHBOARD_FILE" | tail -1 | cut -d: -f1)"
  awk -v il="$LAST_IMPORT_LINE" -v add="import DashboardOutlookWidgetExample from '@/components/DashboardOutlookWidgetExample';" '
    NR==il { print; print add; next } { print }
  ' "$DASHBOARD_FILE" > "${DASHBOARD_FILE}.tmp" && mv "${DASHBOARD_FILE}.tmp" "$DASHBOARD_FILE"
  echo "✅ added import for DashboardOutlookWidgetExample"
fi

# 2) also add ThemedTile import if you want to use it directly in this file later (harmless duplicate-safe)
if ! grep -q "from '@/components/ThemedTile'" "$DASHBOARD_FILE"; then
  LAST_IMPORT_LINE="$(grep -n '^import ' "$DASHBOARD_FILE" | tail -1 | cut -d: -f1)"
  awk -v il="$LAST_IMPORT_LINE" -v add="import { ThemedTile, ThemedCTA } from '@/components/ThemedTile';" '
    NR==il { print; print add; next } { print }
  ' "$DASHBOARD_FILE" > "${DASHBOARD_FILE}.tmp" && mv "${DASHBOARD_FILE}.tmp" "$DASHBOARD_FILE"
  echo "✅ added import for ThemedTile/ThemedCTA"
fi

# 3) replace the legacy Portfolio Outlook Card with the new component
if grep -q 'data-testid="widget-portfolio-outlook"' "$DASHBOARD_FILE"; then
  awk '
    BEGIN{skip=0}
    /data-testid="widget-portfolio-outlook"/ && /<Card/ && skip==0 {
      skip=1; print "      <DashboardOutlookWidgetExample />"; next
    }
    skip==1 {
      if ($0 ~ /<\/Card>/) { skip=0; next } else { next }
    }
    { print }
  ' "$DASHBOARD_FILE" > "${DASHBOARD_FILE}.tmp" && mv "${DASHBOARD_FILE}.tmp" "$DASHBOARD_FILE"
  echo "✅ swapped legacy Portfolio Outlook block -> <DashboardOutlookWidgetExample />"
else
  echo "ℹ️ could not find legacy widget by data-testid; leaving file as-is (import still added)"
fi

echo "🎉 done. Commit & reload your dev server if needed."
