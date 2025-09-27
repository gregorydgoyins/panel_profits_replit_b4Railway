import { Location } from '../types';

// All Locations Data
export const allLocations: Location[] = [
  {
    id: '1',
    name: 'Batcave',
    symbol: 'BTCV',
    locationType: 'hangout',
    price: 150,
    change: 7.50,
    percentageChange: 5.3,
    marketCap: 750000000,
    volume: 1200,
    rating: 'Strong Buy',
    firstAppearance: 'Batman #12 (1942)',
    publisher: 'DC',
    associatedCharacters: ['Batman', 'Robin', 'Alfred'],
    significance: 98,
    mediaAppearances: 45,
    description: 'Batman\'s secret headquarters beneath Wayne Manor, featuring advanced technology and the Batcomputer.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Fortress of Solitude',
    symbol: 'FTOS',
    locationType: 'hangout',
    price: 120,
    change: 6.00,
    percentageChange: 5.3,
    marketCap: 600000000,
    volume: 900,
    rating: 'Strong Buy',
    firstAppearance: 'Superman #17 (1942)',
    publisher: 'DC',
    associatedCharacters: ['Superman', 'Supergirl'],
    significance: 95,
    mediaAppearances: 38,
    description: 'Superman\'s Arctic stronghold containing Kryptonian artifacts and technology.',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'Hall of Justice',
    symbol: 'HALJ',
    locationType: 'hangout',
    price: 85,
    change: 4.25,
    percentageChange: 5.3,
    marketCap: 425000000,
    volume: 750,
    rating: 'Buy',
    firstAppearance: 'Super Friends (1973)',
    publisher: 'DC',
    associatedCharacters: ['Justice League', 'Superman', 'Batman', 'Wonder Woman'],
    significance: 85,
    mediaAppearances: 25,
    description: 'The public headquarters of the Justice League, a symbol of heroism and justice.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop'
  },
  // Villain Hideouts
  {
    id: '4',
    name: 'Legion of Doom Lair',
    symbol: 'LGDM',
    locationType: 'hideout',
    price: 95,
    change: -1.90,
    percentageChange: -2.0,
    marketCap: 475000000,
    volume: 850,
    rating: 'Hold',
    firstAppearance: 'Challenge of the Super Friends (1978)',
    publisher: 'DC',
    associatedCharacters: ['Lex Luthor', 'Grodd', 'Cheetah', 'Black Manta'],
    significance: 80,
    mediaAppearances: 22,
    description: 'The secret headquarters of the Legion of Doom, hidden in a swamp.',
    image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c726?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    name: 'Joker\'s Hideout',
    symbol: 'JKRH',
    locationType: 'hideout',
    price: 68,
    change: -1.36,
    percentageChange: -2.0,
    marketCap: 340000000,
    volume: 650,
    rating: 'Hold',
    firstAppearance: 'Batman #1 (1940)',
    publisher: 'DC',
    associatedCharacters: ['The Joker', 'Harley Quinn'],
    significance: 88,
    mediaAppearances: 30,
    description: 'The Joker\'s ever-changing secret lairs throughout Gotham City.',
    image: 'https://images.unsplash.com/photo-1574972788128-0818a68ee539?w=400&h=300&fit=crop'
  }
];

// Filter by location type
export const hangouts = allLocations.filter(loc => loc.locationType === 'hangout');
export const hideouts = allLocations.filter(loc => loc.locationType === 'hideout');

export default allLocations;