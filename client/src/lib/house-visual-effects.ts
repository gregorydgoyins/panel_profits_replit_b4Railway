import { type MythologicalHouse } from "@/contexts/HouseThemeContext";

// ═══════════════════════════════════════════════════════════════════════════════════════
// HOUSE-SPECIFIC VISUAL EFFECTS LIBRARY
// Comprehensive animation, transition, and sound effect system for Seven Houses
// ═══════════════════════════════════════════════════════════════════════════════════════

export interface VisualEffect {
  name: string;
  duration: number;
  easing: string;
  keyframes: string;
  className: string;
}

export interface SoundEffect {
  name: string;
  audio?: string; // Path to audio file if available
  visual: string; // Visual representation of sound
  intensity: 'low' | 'medium' | 'high';
  duration: number;
}

export interface HouseEffectLibrary {
  animations: Record<string, VisualEffect>;
  soundEffects: Record<string, SoundEffect>;
  transitions: Record<string, VisualEffect>;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  particleEffects: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// HOUSE OF HEROES - Classic Four-Color Comic Effects
// ═══════════════════════════════════════════════════════════════════════════════════════

const HEROES_EFFECTS: HouseEffectLibrary = {
  animations: {
    speedLines: {
      name: 'heroes-speed-lines',
      duration: 600,
      easing: 'linear',
      keyframes: 'heroes-speed-lines',
      className: 'house-heroes-speed-lines',
    },
    impactBurst: {
      name: 'heroes-impact-burst',
      duration: 800,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      keyframes: 'heroes-impact-burst',
      className: 'house-heroes-impact-burst',
    },
    capeFlow: {
      name: 'heroes-cape-flow',
      duration: 2000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      keyframes: 'heroes-cape-flow',
      className: 'house-heroes-cape-flow',
    },
    heroicEntrance: {
      name: 'heroes-heroic-entrance',
      duration: 1200,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      keyframes: 'heroes-heroic-entrance',
      className: 'heroes-heroic-entrance',
    },
    victoryCelebration: {
      name: 'heroes-victory-celebration',
      duration: 1500,
      easing: 'ease-out',
      keyframes: 'heroes-victory-celebration',
      className: 'heroes-victory-celebration',
    },
  },
  soundEffects: {
    punch: { name: 'POW!', visual: 'POW!', intensity: 'high', duration: 800 },
    kick: { name: 'BAM!', visual: 'BAM!', intensity: 'high', duration: 700 },
    success: { name: 'KAPOW!', visual: 'KAPOW!', intensity: 'high', duration: 1000 },
    click: { name: 'CLICK', visual: 'CLICK', intensity: 'low', duration: 300 },
    victory: { name: 'TRIUMPH!', visual: 'TRIUMPH!', intensity: 'high', duration: 1200 },
  },
  transitions: {
    themeSwitch: {
      name: 'heroes-theme-switch',
      duration: 600,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      keyframes: 'heroes-theme-switch',
      className: 'heroes-theme-switch',
    },
  },
  colors: {
    primary: '#dc2626',
    secondary: '#2563eb', 
    accent: '#eab308',
    background: '#fef2f2',
  },
  particleEffects: {
    sparkles: { count: 20, colors: ['#dc2626', '#2563eb', '#eab308'] },
    lightRays: { count: 8, colors: ['#fbbf24'] },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// HOUSE OF WISDOM - Noir Investigation Effects
// ═══════════════════════════════════════════════════════════════════════════════════════

const WISDOM_EFFECTS: HouseEffectLibrary = {
  animations: {
    venetianBlinds: {
      name: 'wisdom-venetian-blinds',
      duration: 2000,
      easing: 'ease-in-out',
      keyframes: 'wisdom-blinds-sweep',
      className: 'house-wisdom-venetian-blinds',
    },
    spotlight: {
      name: 'wisdom-spotlight',
      duration: 3000,
      easing: 'ease-in-out',
      keyframes: 'wisdom-spotlight',
      className: 'house-wisdom-spotlight',
    },
    magnify: {
      name: 'wisdom-magnify',
      duration: 800,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      keyframes: 'wisdom-magnify',
      className: 'wisdom-magnify-effect',
    },
    typewriter: {
      name: 'wisdom-typewriter',
      duration: 1500,
      easing: 'steps(40, end)',
      keyframes: 'wisdom-typewriter',
      className: 'wisdom-typewriter-effect',
    },
    deduction: {
      name: 'wisdom-deduction',
      duration: 1000,
      easing: 'ease-out',
      keyframes: 'wisdom-deduction',
      className: 'wisdom-deduction-effect',
    },
  },
  soundEffects: {
    click: { name: 'CLICK', visual: 'CLICK', intensity: 'low', duration: 200 },
    reveal: { name: 'AHA!', visual: 'AHA!', intensity: 'medium', duration: 600 },
    investigate: { name: 'HMPH', visual: 'HMPH', intensity: 'low', duration: 400 },
    discovery: { name: 'EUREKA!', visual: 'EUREKA!', intensity: 'high', duration: 1000 },
    typewriter: { name: 'CLACK', visual: 'CLACK', intensity: 'low', duration: 100 },
  },
  transitions: {
    fadeInvestigation: {
      name: 'wisdom-fade-investigation',
      duration: 800,
      easing: 'ease-in-out',
      keyframes: 'wisdom-fade-investigation',
      className: 'wisdom-fade-investigation',
    },
  },
  colors: {
    primary: '#1d4ed8',
    secondary: '#64748b',
    accent: '#93c5fd',
    background: '#0f172a',
  },
  particleEffects: {
    documentPages: { count: 5, colors: ['#e2e8f0'] },
    magnifyingGlass: { count: 1, colors: ['#93c5fd'] },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// HOUSE OF POWER - Cosmic Splash Page Effects
// ═══════════════════════════════════════════════════════════════════════════════════════

const POWER_EFFECTS: HouseEffectLibrary = {
  animations: {
    energySurge: {
      name: 'power-energy-surge',
      duration: 2500,
      easing: 'ease-in-out',
      keyframes: 'power-energy-surge',
      className: 'house-power-energy-surge',
    },
    cosmicExplosion: {
      name: 'power-cosmic-explosion',
      duration: 1200,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      keyframes: 'power-cosmic-explosion',
      className: 'house-power-cosmic-explosion',
    },
    dimensionalRift: {
      name: 'power-dimensional-rift',
      duration: 3000,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      keyframes: 'power-dimensional-rift',
      className: 'power-dimensional-rift',
    },
    stellarFormation: {
      name: 'power-stellar-formation',
      duration: 4000,
      easing: 'ease-out',
      keyframes: 'power-stellar-formation',
      className: 'power-stellar-formation',
    },
    powerLevel: {
      name: 'power-level-surge',
      duration: 1000,
      easing: 'ease-out',
      keyframes: 'power-level-surge',
      className: 'power-level-surge',
    },
  },
  soundEffects: {
    energy: { name: 'ZAP!', visual: 'ZAP!', intensity: 'high', duration: 800 },
    cosmic: { name: 'BOOM!', visual: 'BOOM!', intensity: 'high', duration: 1000 },
    surge: { name: 'WOOSH', visual: 'WOOSH', intensity: 'medium', duration: 600 },
    explosion: { name: 'BLAST!', visual: 'BLAST!', intensity: 'high', duration: 1200 },
    dimensional: { name: 'VWORP', visual: 'VWORP', intensity: 'medium', duration: 900 },
  },
  transitions: {
    cosmicTransition: {
      name: 'power-cosmic-transition',
      duration: 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      keyframes: 'power-cosmic-transition',
      className: 'power-cosmic-transition',
    },
  },
  colors: {
    primary: '#7c3aed',
    secondary: '#4338ca',
    accent: '#fbbf24',
    background: '#1e1b4b',
  },
  particleEffects: {
    cosmicDust: { count: 50, colors: ['#7c3aed', '#4338ca', '#fbbf24'] },
    energyBolts: { count: 12, colors: ['#fbbf24'] },
    galaxySpiral: { count: 30, colors: ['#7c3aed', '#a855f7'] },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// HOUSE OF MYSTERY - Supernatural Mystery Effects
// ═══════════════════════════════════════════════════════════════════════════════════════

const MYSTERY_EFFECTS: HouseEffectLibrary = {
  animations: {
    mistReveal: {
      name: 'mystery-mist-reveal',
      duration: 4000,
      easing: 'ease-in-out',
      keyframes: 'mystery-mist-reveal',
      className: 'house-mystery-mist-reveal',
    },
    supernaturalGlow: {
      name: 'mystery-supernatural-glow',
      duration: 3000,
      easing: 'ease-in-out',
      keyframes: 'mystery-supernatural-glow',
      className: 'house-mystery-supernatural-glow',
    },
    realityDistortion: {
      name: 'mystery-reality-distortion',
      duration: 2000,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      keyframes: 'mystery-reality-distortion',
      className: 'mystery-reality-distortion',
    },
    occultSymbols: {
      name: 'mystery-occult-symbols',
      duration: 2500,
      easing: 'ease-in-out',
      keyframes: 'mystery-occult-symbols',
      className: 'mystery-occult-symbols',
    },
    mysticalReveal: {
      name: 'mystery-mystical-reveal',
      duration: 1800,
      easing: 'ease-out',
      keyframes: 'mystery-mystical-reveal',
      className: 'mystery-mystical-reveal',
    },
  },
  soundEffects: {
    whisper: { name: 'WHISPER', visual: 'whisper...', intensity: 'low', duration: 1500 },
    ethereal: { name: 'WHOOSH', visual: 'WHOOSH', intensity: 'medium', duration: 800 },
    mystical: { name: 'SHIMMER', visual: 'SHIMMER', intensity: 'medium', duration: 1000 },
    supernatural: { name: 'POOF!', visual: 'POOF!', intensity: 'high', duration: 900 },
    revelation: { name: 'REVEAL!', visual: 'REVEAL!', intensity: 'high', duration: 1200 },
  },
  transitions: {
    fadeToMystery: {
      name: 'mystery-fade-to-mystery',
      duration: 1200,
      easing: 'ease-in-out',
      keyframes: 'mystery-fade-to-mystery',
      className: 'mystery-fade-to-mystery',
    },
  },
  colors: {
    primary: '#059669',
    secondary: '#047857',
    accent: '#6ee7b7',
    background: '#064e3b',
  },
  particleEffects: {
    mysticalMist: { count: 25, colors: ['#059669', '#34d399'] },
    occultRunes: { count: 8, colors: ['#6ee7b7'] },
    supernaturalOrbs: { count: 15, colors: ['#059669', '#10b981'] },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// HOUSE OF ELEMENTS - Elemental Forces Effects
// ═══════════════════════════════════════════════════════════════════════════════════════

const ELEMENTS_EFFECTS: HouseEffectLibrary = {
  animations: {
    fireFlow: {
      name: 'elements-fire-flow',
      duration: 2000,
      easing: 'ease-in-out',
      keyframes: 'elements-fire-flow',
      className: 'house-elements-fire-flow',
    },
    waterFlow: {
      name: 'elements-water-flow',
      duration: 3000,
      easing: 'ease-in-out',
      keyframes: 'elements-water-flow',
      className: 'house-elements-water-flow',
    },
    earthFlow: {
      name: 'elements-earth-flow',
      duration: 4000,
      easing: 'ease-in-out',
      keyframes: 'elements-earth-flow',
      className: 'house-elements-earth-flow',
    },
    airFlow: {
      name: 'elements-air-flow',
      duration: 1500,
      easing: 'ease-in-out',
      keyframes: 'elements-air-flow',
      className: 'house-elements-air-flow',
    },
    seasonalCycle: {
      name: 'elements-seasonal-cycle',
      duration: 8000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      keyframes: 'elements-seasonal-cycle',
      className: 'elements-seasonal-cycle',
    },
  },
  soundEffects: {
    fire: { name: 'CRACKLE', visual: 'CRACKLE', intensity: 'medium', duration: 800 },
    water: { name: 'SPLASH', visual: 'SPLASH', intensity: 'medium', duration: 600 },
    earth: { name: 'RUMBLE', visual: 'RUMBLE', intensity: 'high', duration: 1000 },
    air: { name: 'WHOOSH', visual: 'WHOOSH', intensity: 'low', duration: 500 },
    nature: { name: 'FLOW', visual: 'FLOW', intensity: 'low', duration: 1200 },
  },
  transitions: {
    elementalShift: {
      name: 'elements-elemental-shift',
      duration: 1000,
      easing: 'ease-in-out',
      keyframes: 'elements-elemental-shift',
      className: 'elements-elemental-shift',
    },
  },
  colors: {
    primary: '#ea580c',
    secondary: '#eab308',
    accent: '#fed7aa',
    background: '#fff7ed',
  },
  particleEffects: {
    flames: { count: 20, colors: ['#ea580c', '#f97316'] },
    waterDroplets: { count: 30, colors: ['#0ea5e9', '#38bdf8'] },
    earthPebbles: { count: 15, colors: ['#a16207', '#ca8a04'] },
    airCurrents: { count: 25, colors: ['#e2e8f0', '#cbd5e1'] },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// HOUSE OF TIME - Temporal Distortion Effects
// ═══════════════════════════════════════════════════════════════════════════════════════

const TIME_EFFECTS: HouseEffectLibrary = {
  animations: {
    timeRipple: {
      name: 'time-ripple',
      duration: 2000,
      easing: 'ease-out',
      keyframes: 'time-ripple',
      className: 'house-time-ripple',
    },
    paradox: {
      name: 'time-paradox',
      duration: 3000,
      easing: 'linear',
      keyframes: 'time-paradox',
      className: 'house-time-paradox',
    },
    temporalRewind: {
      name: 'time-temporal-rewind',
      duration: 1500,
      easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
      keyframes: 'time-temporal-rewind',
      className: 'time-temporal-rewind',
    },
    chronometer: {
      name: 'time-chronometer',
      duration: 2000,
      easing: 'ease-in-out',
      keyframes: 'time-chronometer',
      className: 'time-chronometer',
    },
    timelineShift: {
      name: 'time-timeline-shift',
      duration: 1800,
      easing: 'ease-out',
      keyframes: 'time-timeline-shift',
      className: 'time-timeline-shift',
    },
  },
  soundEffects: {
    tick: { name: 'TICK', visual: 'TICK', intensity: 'low', duration: 100 },
    tock: { name: 'TOCK', visual: 'TOCK', intensity: 'low', duration: 100 },
    chime: { name: 'CHIME', visual: 'CHIME', intensity: 'medium', duration: 800 },
    rewind: { name: 'WHIRR', visual: 'WHIRR', intensity: 'medium', duration: 1200 },
    paradox: { name: 'VWORP', visual: 'VWORP', intensity: 'high', duration: 1500 },
  },
  transitions: {
    temporalShift: {
      name: 'time-temporal-shift',
      duration: 1000,
      easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
      keyframes: 'time-temporal-shift',
      className: 'time-temporal-shift',
    },
  },
  colors: {
    primary: '#64748b',
    secondary: '#eab308',
    accent: '#fbbf24',
    background: '#1e293b',
  },
  particleEffects: {
    clockGears: { count: 8, colors: ['#eab308', '#fbbf24'] },
    timeRipples: { count: 12, colors: ['#64748b', '#94a3b8'] },
    chronalEnergy: { count: 20, colors: ['#fbbf24'] },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// HOUSE OF SPIRIT - Mystical Ethereal Effects
// ═══════════════════════════════════════════════════════════════════════════════════════

const SPIRIT_EFFECTS: HouseEffectLibrary = {
  animations: {
    divineAura: {
      name: 'spirit-divine-aura',
      duration: 4000,
      easing: 'ease-in-out',
      keyframes: 'spirit-divine-aura',
      className: 'house-spirit-divine-aura',
    },
    energyFlow: {
      name: 'spirit-energy-flow',
      duration: 3000,
      easing: 'ease-in-out',
      keyframes: 'spirit-energy-flow',
      className: 'house-spirit-energy-flow',
    },
    transcendentGlow: {
      name: 'spirit-transcendent-glow',
      duration: 2500,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      keyframes: 'spirit-transcendent-glow',
      className: 'spirit-transcendent-glow',
    },
    spiritualAwakening: {
      name: 'spirit-spiritual-awakening',
      duration: 3500,
      easing: 'ease-out',
      keyframes: 'spirit-spiritual-awakening',
      className: 'spirit-spiritual-awakening',
    },
    karmaAdjustment: {
      name: 'spirit-karma-adjustment',
      duration: 2000,
      easing: 'ease-in-out',
      keyframes: 'spirit-karma-adjustment',
      className: 'spirit-karma-adjustment',
    },
  },
  soundEffects: {
    spiritual: { name: 'GLOW', visual: 'GLOW', intensity: 'low', duration: 1000 },
    transcendent: { name: 'SHINE', visual: 'SHINE', intensity: 'medium', duration: 1200 },
    divine: { name: 'RADIATE', visual: 'RADIATE', intensity: 'high', duration: 1500 },
    aura: { name: 'AURA', visual: 'AURA', intensity: 'medium', duration: 800 },
    enlightenment: { name: 'ENLIGHTEN', visual: 'ENLIGHTEN', intensity: 'high', duration: 2000 },
  },
  transitions: {
    spiritualTransition: {
      name: 'spirit-spiritual-transition',
      duration: 1200,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      keyframes: 'spirit-spiritual-transition',
      className: 'spirit-spiritual-transition',
    },
  },
  colors: {
    primary: '#0891b2',
    secondary: '#0d9488',
    accent: '#67e8f9',
    background: '#164e63',
  },
  particleEffects: {
    spiritualLight: { count: 30, colors: ['#0891b2', '#67e8f9'] },
    divineOrbs: { count: 15, colors: ['#fbbf24', '#67e8f9'] },
    karmaParticles: { count: 25, colors: ['#0891b2', '#0d9488'] },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// MASTER EFFECTS REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════════════

export const HOUSE_EFFECT_LIBRARIES: Record<MythologicalHouse, HouseEffectLibrary> = {
  heroes: HEROES_EFFECTS,
  wisdom: WISDOM_EFFECTS,
  power: POWER_EFFECTS,
  mystery: MYSTERY_EFFECTS,
  elements: ELEMENTS_EFFECTS,
  time: TIME_EFFECTS,
  spirit: SPIRIT_EFFECTS,
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS FOR VISUAL EFFECTS
// ═══════════════════════════════════════════════════════════════════════════════════════

export class HouseVisualEffectsManager {
  private static instance: HouseVisualEffectsManager;
  private activeEffects: Map<string, HTMLElement> = new Map();
  private soundQueue: SoundEffect[] = [];

  static getInstance(): HouseVisualEffectsManager {
    if (!this.instance) {
      this.instance = new HouseVisualEffectsManager();
    }
    return this.instance;
  }

  // Trigger house-specific animation
  triggerAnimation(
    element: HTMLElement,
    house: MythologicalHouse,
    animationName: string,
    options?: {
      intensity?: 'low' | 'medium' | 'high';
      duration?: number;
      onComplete?: () => void;
    }
  ): void {
    const library = HOUSE_EFFECT_LIBRARIES[house];
    const animation = library.animations[animationName];
    
    if (!animation) {
      console.warn(`Animation ${animationName} not found for house ${house}`);
      return;
    }

    const effectId = `${house}-${animationName}-${Date.now()}`;
    
    // Apply animation class
    element.classList.add(animation.className);
    
    // Store reference for cleanup
    this.activeEffects.set(effectId, element);
    
    // Handle completion
    setTimeout(() => {
      element.classList.remove(animation.className);
      this.activeEffects.delete(effectId);
      options?.onComplete?.();
    }, options?.duration || animation.duration);
  }

  // Trigger house-specific sound effect
  triggerSoundEffect(
    house: MythologicalHouse,
    soundName: string,
    targetElement?: HTMLElement,
    options?: {
      position?: { x: number; y: number };
      intensity?: 'low' | 'medium' | 'high';
      duration?: number;
    }
  ): void {
    const library = HOUSE_EFFECT_LIBRARIES[house];
    const sound = library.soundEffects[soundName];
    
    if (!sound) {
      console.warn(`Sound effect ${soundName} not found for house ${house}`);
      return;
    }

    this.displaySoundEffect(sound, targetElement, options);
  }

  // Display visual representation of sound effect
  private displaySoundEffect(
    sound: SoundEffect,
    targetElement?: HTMLElement,
    options?: any
  ): void {
    if (!targetElement) return;

    const soundElement = document.createElement('div');
    soundElement.className = 'absolute pointer-events-none z-50 animate-bounce';
    soundElement.style.cssText = `
      top: -2rem;
      left: 50%;
      transform: translateX(-50%);
      font-family: var(--font-comic-action);
      font-weight: bold;
      font-size: ${sound.intensity === 'high' ? '1.25rem' : sound.intensity === 'medium' ? '1rem' : '0.875rem'};
      color: ${this.getSoundEffectColor(sound.intensity)};
      text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.8);
      animation-duration: ${sound.duration}ms;
    `;
    soundElement.textContent = sound.visual;

    // Position relative to target element
    const container = targetElement.closest('.relative') || targetElement.parentElement;
    if (container) {
      container.style.position = 'relative';
      container.appendChild(soundElement);
      
      // Cleanup
      setTimeout(() => {
        soundElement.remove();
      }, sound.duration);
    }
  }

  private getSoundEffectColor(intensity: string): string {
    switch (intensity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  }

  // Trigger house transition effect
  triggerHouseTransition(
    fromHouse: MythologicalHouse,
    toHouse: MythologicalHouse,
    targetElement: HTMLElement,
    options?: {
      duration?: number;
      onComplete?: () => void;
    }
  ): void {
    const fromLibrary = HOUSE_EFFECT_LIBRARIES[fromHouse];
    const toLibrary = HOUSE_EFFECT_LIBRARIES[toHouse];
    
    // Apply transition out effect
    const outTransition = fromLibrary.transitions.themeSwitch || fromLibrary.transitions.fadeInvestigation;
    if (outTransition) {
      targetElement.classList.add('house-theme-switching');
      
      setTimeout(() => {
        // Apply new house styling
        targetElement.classList.remove(`house-${fromHouse}`);
        targetElement.classList.add(`house-${toHouse}`);
        
        // Apply transition in effect
        const inTransition = toLibrary.transitions.themeSwitch || toLibrary.transitions.fadeInvestigation;
        if (inTransition) {
          targetElement.classList.add(inTransition.className);
          
          setTimeout(() => {
            targetElement.classList.remove('house-theme-switching');
            targetElement.classList.remove(inTransition.className);
            options?.onComplete?.();
          }, inTransition.duration);
        }
      }, outTransition.duration / 2);
    }
  }

  // Get house effect library
  getHouseEffects(house: MythologicalHouse): HouseEffectLibrary {
    return HOUSE_EFFECT_LIBRARIES[house];
  }

  // Clean up all active effects
  cleanup(): void {
    this.activeEffects.forEach((element, effectId) => {
      // Remove animation classes
      element.className = element.className
        .split(' ')
        .filter(cls => !cls.startsWith('house-') || !cls.includes('effect'))
        .join(' ');
    });
    this.activeEffects.clear();
    this.soundQueue = [];
  }

  // Batch trigger multiple effects
  triggerEffectSequence(
    effects: Array<{
      type: 'animation' | 'sound' | 'transition';
      house: MythologicalHouse;
      name: string;
      element?: HTMLElement;
      delay?: number;
      options?: any;
    }>
  ): void {
    effects.forEach((effect, index) => {
      setTimeout(() => {
        switch (effect.type) {
          case 'animation':
            if (effect.element) {
              this.triggerAnimation(effect.element, effect.house, effect.name, effect.options);
            }
            break;
          case 'sound':
            this.triggerSoundEffect(effect.house, effect.name, effect.element, effect.options);
            break;
          case 'transition':
            // Handle transition logic
            break;
        }
      }, effect.delay || index * 200);
    });
  }
}

// Export singleton instance
export const houseEffects = HouseVisualEffectsManager.getInstance();

// Convenience functions for common effects
export const triggerHouseAnimation = (
  element: HTMLElement,
  house: MythologicalHouse,
  animation: string,
  options?: any
) => houseEffects.triggerAnimation(element, house, animation, options);

export const triggerHouseSound = (
  house: MythologicalHouse,
  sound: string,
  element?: HTMLElement,
  options?: any
) => houseEffects.triggerSoundEffect(house, sound, element, options);

export const triggerHouseTransition = (
  fromHouse: MythologicalHouse,
  toHouse: MythologicalHouse,
  element: HTMLElement,
  options?: any
) => houseEffects.triggerHouseTransition(fromHouse, toHouse, element, options);