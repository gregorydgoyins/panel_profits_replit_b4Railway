import { 
  Crown, 
  Shield, 
  BookOpen, 
  Zap, 
  Flame,
  Clock,
  Users,
  Sparkles,
  Mountain,
  Waves,
  Sun,
  Moon,
  Star,
  Eye,
  Target,
  Compass
} from 'lucide-react';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';

export const HOUSE_ICONS = {
  heroes: Shield,       // Character Assets - Shield representing heroic defense
  wisdom: BookOpen,     // Creator Assets - Book representing knowledge
  power: Crown,         // Publisher Assets - Crown representing authority
  mystery: Zap,         // Rare Assets - Lightning representing unpredictability
  elements: Flame,      // Multi-Universe Assets - Flame representing elements
  time: Clock,          // Historical Assets - Clock representing time
  spirit: Users,        // Social Assets - Users representing community
} as const;

// Alternative icons for variety in components
export const HOUSE_ALTERNATE_ICONS = {
  heroes: {
    primary: Shield,
    secondary: Star,
    tertiary: Sun,
  },
  wisdom: {
    primary: BookOpen,
    secondary: Eye,
    tertiary: Sparkles,
  },
  power: {
    primary: Crown,
    secondary: Mountain,
    tertiary: Target,
  },
  mystery: {
    primary: Zap,
    secondary: Moon,
    tertiary: Eye,
  },
  elements: {
    primary: Flame,
    secondary: Waves,
    tertiary: Mountain,
  },
  time: {
    primary: Clock,
    secondary: Sun,
    tertiary: Compass,
  },
  spirit: {
    primary: Users,
    secondary: Star,
    tertiary: Waves,
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
  heroes: 'text-house-heroes',
  wisdom: 'text-house-wisdom',
  power: 'text-house-power',
  mystery: 'text-house-mystery',
  elements: 'text-house-elements',
  time: 'text-house-time',
  spirit: 'text-house-spirit',
} as const;

export const HOUSE_BACKGROUND_CLASSES = {
  heroes: 'bg-house-heroes',
  wisdom: 'bg-house-wisdom',
  power: 'bg-house-power',
  mystery: 'bg-house-mystery',
  elements: 'bg-house-elements',
  time: 'bg-house-time',
  spirit: 'bg-house-spirit',
} as const;

export const HOUSE_BORDER_CLASSES = {
  heroes: 'border-house-heroes',
  wisdom: 'border-house-wisdom',
  power: 'border-house-power',
  mystery: 'border-house-mystery',
  elements: 'border-house-elements',
  time: 'border-house-time',
  spirit: 'border-house-spirit',
} as const;