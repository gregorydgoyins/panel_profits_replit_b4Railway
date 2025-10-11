import { useLocation } from 'wouter';
import { THEME_COLORS, themeForPath, ThemeKey } from '@/theme';

export function useRouteTheme(pathOverride?: string) {
  const [loc] = useLocation();
  const key: ThemeKey = themeForPath(pathOverride ?? loc);
  const { css, rim } = THEME_COLORS[key];
  return { key, css, rim };
}
