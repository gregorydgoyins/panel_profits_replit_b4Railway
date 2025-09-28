import { 
  Crown, 
  Sword, 
  Shield, 
  Zap, 
  Flower2, 
  TreePalm, 
  Sparkles,
  Flame,
  Mountain,
  Waves,
  Sun,
  Moon,
  Star,
  Hexagon
} from 'lucide-react';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';

export const HOUSE_ICONS = {
  eternity: Crown,      // Egyptian - Crown representing pharaoh power
  conquest: Sword,      // Roman - Sword representing military might
  heroes: Shield,       // Greek - Shield representing heroic defense
  ragnarok: Zap,        // Norse - Lightning representing Thor's power
  balance: Flower2,     // Asian - Lotus flower representing harmony
  ancestors: TreePalm,  // African - Palm tree representing heritage
  karma: Sparkles,      // Indian - Sparkles representing cosmic energy
} as const;

// Alternative icons for variety in components
export const HOUSE_ALTERNATE_ICONS = {
  eternity: {
    primary: Crown,
    secondary: Sun,
    tertiary: Hexagon,
  },
  conquest: {
    primary: Sword,
    secondary: Flame,
    tertiary: Mountain,
  },
  heroes: {
    primary: Shield,
    secondary: Star,
    tertiary: Sun,
  },
  ragnarok: {
    primary: Zap,
    secondary: Mountain,
    tertiary: Waves,
  },
  balance: {
    primary: Flower2,
    secondary: Moon,
    tertiary: Waves,
  },
  ancestors: {
    primary: TreePalm,
    secondary: Mountain,
    tertiary: Sun,
  },
  karma: {
    primary: Sparkles,
    secondary: Star,
    tertiary: Moon,
  },
} as const;

export function getHouseIcon(house: MythologicalHouse, variant: 'primary' | 'secondary' | 'tertiary' = 'primary') {
  if (variant === 'primary') {
    return HOUSE_ICONS[house];
  }
  return HOUSE_ALTERNATE_ICONS[house][variant];
}

// House color mappings for icon styling
export const HOUSE_COLOR_CLASSES = {
  eternity: 'text-house-eternity',
  conquest: 'text-house-conquest',
  heroes: 'text-house-heroes',
  ragnarok: 'text-house-ragnarok',
  balance: 'text-house-balance',
  ancestors: 'text-house-ancestors',
  karma: 'text-house-karma',
} as const;

export const HOUSE_BACKGROUND_CLASSES = {
  eternity: 'bg-house-eternity',
  conquest: 'bg-house-conquest',
  heroes: 'bg-house-heroes',
  ragnarok: 'bg-house-ragnarok',
  balance: 'bg-house-balance',
  ancestors: 'bg-house-ancestors',
  karma: 'bg-house-karma',
} as const;

export const HOUSE_BORDER_CLASSES = {
  eternity: 'border-house-eternity',
  conquest: 'border-house-conquest',
  heroes: 'border-house-heroes',
  ragnarok: 'border-house-ragnarok',
  balance: 'border-house-balance',
  ancestors: 'border-house-ancestors',
  karma: 'border-house-karma',
} as const;