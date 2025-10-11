export type ThemeKey =
  | 'portfolio'
  | 'trading'
  | 'analytics'
  | 'news'
  | 'research'
  | 'learn'
  | 'default';

export const THEME_BY_ROUTE: [RegExp, ThemeKey][] = [
  [/^\/portfolio(\/|$)/, 'portfolio'],
  [/^\/trading(\/|$)|^\/terminal(\/|$)/, 'trading'],
  [/^\/analytics(\/|$)/, 'analytics'],
  [/^\/news(\/|$)/, 'news'],
  [/^\/research(\/|$)/, 'research'],
  [/^\/learn(\/|$)/, 'learn'],
];

export const THEME_COLORS: Record<ThemeKey, { css: string; rim: string }> = {
  portfolio: { css: 'cyan',    rim: 'cyan-rimlight-hover' },
  trading:   { css: 'purple',  rim: 'purple-rimlight-hover' },
  analytics: { css: 'green',   rim: 'green-rimlight-hover' },
  news:      { css: 'blue',    rim: 'blue-rimlight-hover' },
  research:  { css: 'pink',    rim: 'pink-rimlight-hover' },
  learn:     { css: 'orange',  rim: 'orange-rimlight-hover' },
  default:   { css: 'white',   rim: 'white-rimlight-hover' },
};

export function themeForPath(path: string): ThemeKey {
  for (const [re, key] of THEME_BY_ROUTE) if (re.test(path)) return key;
  return 'default';
}
