import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type MythologicalHouse = 
  | 'eternity'
  | 'conquest' 
  | 'heroes'
  | 'ragnarok'
  | 'balance'
  | 'ancestors'
  | 'karma';

export interface HouseTheme {
  id: MythologicalHouse;
  name: string;
  description: string;
  mythology: string;
  primaryColor: string;
  accentColor: string;
  iconName: string;
}

export const MYTHOLOGICAL_HOUSES: Record<MythologicalHouse, HouseTheme> = {
  eternity: {
    id: 'eternity',
    name: 'House of Eternity',
    description: 'Masters of time and ancient wisdom',
    mythology: 'Egyptian',
    primaryColor: 'house-eternity',
    accentColor: 'house-eternity-accent',
    iconName: 'pyramid',
  },
  conquest: {
    id: 'conquest',
    name: 'House of Conquest',
    description: 'Warriors of empire and dominion',
    mythology: 'Roman',
    primaryColor: 'house-conquest',
    accentColor: 'house-conquest-accent',
    iconName: 'sword',
  },
  heroes: {
    id: 'heroes',
    name: 'House of Heroes',
    description: 'Champions of honor and glory',
    mythology: 'Greek',
    primaryColor: 'house-heroes',
    accentColor: 'house-heroes-accent',
    iconName: 'shield',
  },
  ragnarok: {
    id: 'ragnarok',
    name: 'House of Ragnarok',
    description: 'Wielders of storm and fate',
    mythology: 'Norse',
    primaryColor: 'house-ragnarok',
    accentColor: 'house-ragnarok-accent',
    iconName: 'zap',
  },
  balance: {
    id: 'balance',
    name: 'House of Balance',
    description: 'Seekers of harmony and inner peace',
    mythology: 'Asian',
    primaryColor: 'house-balance',
    accentColor: 'house-balance-accent',
    iconName: 'yin-yang',
  },
  ancestors: {
    id: 'ancestors',
    name: 'House of Ancestors',
    description: 'Keepers of heritage and tribal wisdom',
    mythology: 'African',
    primaryColor: 'house-ancestors',
    accentColor: 'house-ancestors-accent',
    iconName: 'tree-palm',
  },
  karma: {
    id: 'karma',
    name: 'House of Karma',
    description: 'Guardians of cosmic balance and enlightenment',
    mythology: 'Indian',
    primaryColor: 'house-karma',
    accentColor: 'house-karma-accent',
    iconName: 'flower-lotus',
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