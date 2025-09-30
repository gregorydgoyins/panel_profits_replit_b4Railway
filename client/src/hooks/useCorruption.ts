import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

interface MoralState {
  corruption: number;
  soulWeight: 'unburdened' | 'tainted' | 'heavy' | 'crushing' | 'damned';
  victimCount: number;
  bloodMoney: number;
  canConfess: boolean;
}

export function useCorruption() {
  const { user } = useAuth();
  const [corruptionClass, setCorruptionClass] = useState('');
  const [glitchActive, setGlitchActive] = useState(false);

  // Fetch user's moral state
  const { data: moralState, isLoading } = useQuery<MoralState>({
    queryKey: ['/api/moral/state', user?.id],
    enabled: !!user?.id,
    refetchInterval: 10000, // Check every 10 seconds
  });

  // Apply corruption effects based on level
  useEffect(() => {
    if (!moralState) {
      setCorruptionClass('');
      return;
    }

    const corruption = moralState.corruption;
    
    // Determine corruption class
    if (corruption >= 80) {
      setCorruptionClass('corruption-extreme');
      // Trigger frequent glitches
      const glitchInterval = setInterval(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 200);
      }, 3000);
      return () => clearInterval(glitchInterval);
    } else if (corruption >= 60) {
      setCorruptionClass('corruption-high');
      // Trigger occasional glitches
      const glitchInterval = setInterval(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }, 5000);
      return () => clearInterval(glitchInterval);
    } else if (corruption >= 40) {
      setCorruptionClass('corruption-medium');
      // Trigger rare glitches
      const glitchInterval = setInterval(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 100);
      }, 10000);
      return () => clearInterval(glitchInterval);
    } else if (corruption >= 20) {
      setCorruptionClass('corruption-low');
    } else {
      setCorruptionClass('');
    }
  }, [moralState?.corruption]);

  // Apply corruption class to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all corruption classes
    root.classList.remove(
      'corruption-low',
      'corruption-medium', 
      'corruption-high',
      'corruption-extreme'
    );
    
    // Add current corruption class
    if (corruptionClass) {
      root.classList.add(corruptionClass);
    }

    // Apply glitch effect
    if (glitchActive) {
      root.classList.add('glitch-active');
    } else {
      root.classList.remove('glitch-active');
    }

    return () => {
      root.classList.remove(
        'corruption-low',
        'corruption-medium',
        'corruption-high', 
        'corruption-extreme',
        'glitch-active'
      );
    };
  }, [corruptionClass, glitchActive]);

  return {
    corruption: moralState?.corruption ?? 0,
    soulWeight: moralState?.soulWeight ?? 'unburdened',
    victimCount: moralState?.victimCount ?? 0,
    bloodMoney: moralState?.bloodMoney ?? 0,
    canConfess: moralState?.canConfess ?? false,
    corruptionClass,
    glitchActive,
    isLoading
  };
}

// Hook to track and display blood money with dripping effect
export function useBloodMoney() {
  const [showBloodDrip, setShowBloodDrip] = useState(false);
  const { bloodMoney } = useCorruption();
  
  // Trigger blood drip animation when blood money increases
  useEffect(() => {
    if (bloodMoney > 0) {
      setShowBloodDrip(true);
      const timer = setTimeout(() => setShowBloodDrip(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [bloodMoney]);

  return {
    bloodMoney,
    showBloodDrip,
    formattedBloodMoney: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(bloodMoney)
  };
}