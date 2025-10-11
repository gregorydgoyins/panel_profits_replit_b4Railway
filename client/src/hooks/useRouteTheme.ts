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
