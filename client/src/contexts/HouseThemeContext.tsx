import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type MythologicalHouse = 
  | 'heroes'
  | 'wisdom'
  | 'power'
  | 'mystery'
  | 'elements'
  | 'time'
  | 'spirit';

export interface HouseTheme {
  id: MythologicalHouse;
  name: string;
  description: string;
  mythology: string;
  primaryColor: string;
  accentColor: string;
  iconName: string;
}

// Corporate firm names hide the mythology beneath
// Internal mythology: heroes=Roman, wisdom=Greek, power=Egyptian, mystery=Norse, elements=Celtic, time=Slavic, spirit=Japanese
export const MYTHOLOGICAL_HOUSES: Record<MythologicalHouse, HouseTheme> = {
  heroes: {
    id: 'heroes',
    name: 'GM Financial',
    description: 'Character options and futures specialists',
    mythology: 'Roman (Mars/Luna/Vesta)', // Sun: Mars, Moon: Luna, Soother: Vesta
    primaryColor: 'house-heroes',
    accentColor: 'house-heroes-accent',
    iconName: 'shield',
  },
  wisdom: {
    id: 'wisdom',
    name: 'Velos Agency',
    description: 'Creator bonds and intellectual property',
    mythology: 'Greek (Apollo/Selene/Hestia)', // Sun: Apollo, Moon: Selene, Soother: Hestia
    primaryColor: 'house-wisdom',
    accentColor: 'house-wisdom-accent',
    iconName: 'book-open',
  },
  power: {
    id: 'power',
    name: 'Horus Capital',
    description: 'Publisher stocks and franchise assets',
    mythology: 'Egyptian (Ra/Thoth/Isis)', // Sun: Ra, Moon: Thoth, Soother: Isis
    primaryColor: 'house-power',
    accentColor: 'house-power-accent',
    iconName: 'crown',
  },
  mystery: {
    id: 'mystery',
    name: 'Valkyrie Holdings',
    description: 'Rare issue derivatives and speculation',
    mythology: 'Norse (Sol/Mani/Frigg)', // Sun: Sol, Moon: Mani, Soother: Frigg
    primaryColor: 'house-mystery',
    accentColor: 'house-mystery-accent',
    iconName: 'zap',
  },
  elements: {
    id: 'elements',
    name: 'Evergreen Partners',
    description: 'Cross-universe diversified portfolios',
    mythology: 'Celtic (Lugh/Arianrhod/Brigid)', // Sun: Lugh, Moon: Arianrhod, Soother: Brigid
    primaryColor: 'house-elements',
    accentColor: 'house-elements-accent',
    iconName: 'flame',
  },
  time: {
    id: 'time',
    name: 'Aurora Investments',
    description: 'Historical price prediction markets',
    mythology: 'Slavic (Dazbog/Myesyats/Mokosh)', // Sun: Dazbog, Moon: Myesyats, Soother: Mokosh
    primaryColor: 'house-time',
    accentColor: 'house-time-accent',
    iconName: 'clock',
  },
  spirit: {
    id: 'spirit',
    name: 'Amaterasu Asset Management',
    description: 'Community sentiment and social trading',
    mythology: 'Japanese (Amaterasu/Tsukuyomi/Kannon)', // Sun: Amaterasu, Moon: Tsukuyomi, Soother: Kannon
    primaryColor: 'house-spirit',
    accentColor: 'house-spirit-accent',
    iconName: 'users',
  },
};

interface HouseThemeContextType {
  currentHouse: MythologicalHouse;
  setCurrentHouse: (house: MythologicalHouse) => void;
  houseTheme: HouseTheme;
  allHouses: HouseTheme[];
  getHouseTheme: (house: MythologicalHouse) => HouseTheme;
  applyHouseTheme: (house: MythologicalHouse) => void;
}

const HouseThemeContext = createContext<HouseThemeContextType | undefined>(undefined);

interface HouseThemeProviderProps {
  children: ReactNode;
  defaultHouse?: MythologicalHouse;
}

export function HouseThemeProvider({ 
  children, 
  defaultHouse = 'heroes' 
}: HouseThemeProviderProps) {
  const [currentHouse, setCurrentHouse] = useState<MythologicalHouse>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('panel-profits-house');
      return (saved as MythologicalHouse) || defaultHouse;
    }
    return defaultHouse;
  });

  const houseTheme = MYTHOLOGICAL_HOUSES[currentHouse];
  const allHouses = Object.values(MYTHOLOGICAL_HOUSES);

  const getHouseTheme = (house: MythologicalHouse): HouseTheme => {
    return MYTHOLOGICAL_HOUSES[house];
  };

  const applyHouseTheme = (house: MythologicalHouse) => {
    const theme = MYTHOLOGICAL_HOUSES[house];
    const root = document.documentElement;
    
    // Apply house-specific CSS custom properties to override defaults
    root.style.setProperty('--primary', `var(--house-${house}-primary)`);
    root.style.setProperty('--primary-foreground', `var(--house-${house}-primary-foreground)`);
    root.style.setProperty('--accent', `var(--house-${house}-accent)`);
    
    // Apply house background to cards for themed sections
    root.style.setProperty('--house-current-background', `var(--house-${house}-background)`);
    root.style.setProperty('--house-current-card', `var(--house-${house}-card)`);
    root.style.setProperty('--house-current-border', `var(--house-${house}-primary-border)`);
    
    // Save to localStorage
    localStorage.setItem('panel-profits-house', house);
    setCurrentHouse(house);
  };

  // Apply theme on mount and when house changes
  useEffect(() => {
    applyHouseTheme(currentHouse);
  }, [currentHouse]);

  const value: HouseThemeContextType = {
    currentHouse,
    setCurrentHouse: applyHouseTheme,
    houseTheme,
    allHouses,
    getHouseTheme,
    applyHouseTheme,
  };

  return (
    <HouseThemeContext.Provider value={value}>
      {children}
    </HouseThemeContext.Provider>
  );
}

export function useHouseTheme() {
  const context = useContext(HouseThemeContext);
  if (context === undefined) {
    throw new Error('useHouseTheme must be used within a HouseThemeProvider');
  }
  return context;
}