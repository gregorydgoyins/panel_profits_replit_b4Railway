import { useContext } from 'react';
import { useHouseTheme as useHouseThemeContext } from '@/contexts/HouseThemeContext';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';

// Custom hook with additional utilities for house theme management
export function useHouseTheme() {
  const context = useHouseThemeContext();
  
  const getHouseColorClass = (house: MythologicalHouse, type: 'text' | 'bg' | 'border' = 'text') => {
    switch (type) {
      case 'text':
        return `text-house-${house}`;
      case 'bg':
        return `bg-house-${house}`;
      case 'border':
        return `border-house-${house}`;
      default:
        return `text-house-${house}`;
    }
  };

  const getCurrentHouseColorClass = (type: 'text' | 'bg' | 'border' = 'text') => {
    return getHouseColorClass(context.currentHouse, type);
  };

  const getHouseGradientClass = (house: MythologicalHouse) => {
    return `from-house-${house} to-house-${house}-accent`;
  };

  const getCurrentHouseGradientClass = () => {
    return getHouseGradientClass(context.currentHouse);
  };

  // Helper to check if a specific house is currently active
  const isHouseActive = (house: MythologicalHouse): boolean => {
    return context.currentHouse === house;
  };

  // Get themed button variant for current house
  const getHouseButtonVariant = (house?: MythologicalHouse) => {
    const targetHouse = house || context.currentHouse;
    // For house-specific buttons, we can use custom styling
    return 'default'; // Will be styled with house colors via CSS variables
  };

  // Get house-specific card styling
  const getHouseCardClass = (house?: MythologicalHouse) => {
    const targetHouse = house || context.currentHouse;
    return `bg-house-${targetHouse}-card border-house-${targetHouse}`;
  };

  return {
    ...context,
    getHouseColorClass,
    getCurrentHouseColorClass,
    getHouseGradientClass,
    getCurrentHouseGradientClass,
    isHouseActive,
    getHouseButtonVariant,
    getHouseCardClass,
  };
}

// Separate hook for just getting the current house without theme context
export function useCurrentHouse(): MythologicalHouse {
  const { currentHouse } = useHouseTheme();
  return currentHouse;
}

// Hook for getting all house themes for selection UI
export function useAllHouses() {
  const { allHouses } = useHouseTheme();
  return allHouses;
}