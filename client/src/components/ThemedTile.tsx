import { Link } from 'wouter';
import { themeForPath, THEME_COLORS, ThemeKey } from '@/theme';
import { cn } from '@/lib/utils';

type TileProps = {
  to: string;
  className?: string;
  forceTheme?: ThemeKey;
  children: React.ReactNode;
};

export function ThemedTile({ to, className, forceTheme, children }: TileProps) {
  const key = forceTheme ?? themeForPath(to);
  const css = THEME_COLORS[key].css;
  return (
    <Link href={to}>
      <a data-theme={css} className={cn('tile block hover:rimlight-inner', className)}>
        {children}
      </a>
    </Link>
  );
}

type CTAProps = { to: string; className?: string; forceTheme?: ThemeKey; children: React.ReactNode; };
export function ThemedCTA({ to, className, forceTheme, children }: CTAProps) {
  const key = forceTheme ?? themeForPath(to);
  const css = THEME_COLORS[key].css;
  return (
    <Link href={to}>
      <a data-theme={css} className={cn('cta inline-flex items-center gap-2', className)}>
        {children}
      </a>
    </Link>
  );
}
