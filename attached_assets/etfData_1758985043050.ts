import { Fund } from '../types';

// Comprehensive ETF data covering all market segments
export const allETFs: Fund[] = [
  // Broad Market ETFs
  {
    id: 'etf-1',
    name: 'Comic Market Total Index ETF',
    symbol: 'CMTI',
    type: 'index',
    nav: 45.20,
    change: 0.85,
    percentageChange: 1.91,
    aum: 2500000000,
    managementFee: 0.03,
    expenseRatio: 0.05,
    ytdReturn: 14.2,
    oneYearReturn: 18.5,
    threeYearReturn: 9.8,
    riskLevel: 'Low',
    manager: 'Panel Profits Asset Management',
    inceptionDate: '2018-01-15',
    description: 'Tracks the entire comic book market with broad diversification.',
    topHoldings: [
      { symbol: 'SPDR', name: 'Spider-Man', weight: 8.5 },
      { symbol: 'BATM', name: 'Batman', weight: 8.2 },
      { symbol: 'SUPR', name: 'Superman', weight: 7.8 },
      { symbol: 'WNDR', name: 'Wonder Woman', weight: 6.9 }
    ]
  },
  {
    id: 'etf-2',
    name: 'Golden Age Comics ETF',
    symbol: 'GOLD',
    type: 'themed',
    nav: 125.80,
    change: 0.85,
    percentageChange: 0.68,
    aum: 850000000,
    managementFee: 0.45,
    expenseRatio: 0.55,
    ytdReturn: 7.5,
    oneYearReturn: 12.2,
    threeYearReturn: 8.1,
    riskLevel: 'Low',
    manager: 'Heritage Investment Management',
    inceptionDate: '2019-03-15',
    description: 'Focuses exclusively on Golden Age comics (1938-1950).',
    topHoldings: [
      { symbol: 'ACM1', name: 'Action Comics #1', weight: 15.2 },
      { symbol: 'DTM27', name: 'Detective Comics #27', weight: 12.8 },
      { symbol: 'MRV1', name: 'Marvel Comics #1', weight: 10.5 },
      { symbol: 'WW1', name: 'Wonder Woman #1', weight: 8.9 }
    ]
  },
  {
    id: 'etf-3',
    name: 'Silver Age Heroes ETF',
    symbol: 'SLVH',
    type: 'themed',
    nav: 110.45,
    change: 1.65,
    percentageChange: 1.52,
    aum: 650000000,
    managementFee: 0.50,
    expenseRatio: 0.60,
    ytdReturn: 11.8,
    oneYearReturn: 16.3,
    threeYearReturn: 9.2,
    riskLevel: 'Medium',
    manager: 'Silver Age Capital',
    inceptionDate: '2019-06-01',
    description: 'Invests in Silver Age heroes and key storylines (1956-1970).',
    topHoldings: [
      { symbol: 'SPDR', name: 'Spider-Man', weight: 18.5 },
      { symbol: 'FF4T', name: 'Fantastic Four', weight: 16.2 },
      { symbol: 'XMNT', name: 'X-Men', weight: 14.8 },
      { symbol: 'HULK', name: 'Hulk', weight: 12.3 }
    ]
  },
  {
    id: 'etf-4',
    name: 'Marvel Cinematic Universe ETF',
    symbol: 'MCU',
    type: 'themed',
    nav: 95.30,
    change: 2.15,
    percentageChange: 2.31,
    aum: 1200000000,
    managementFee: 0.55,
    expenseRatio: 0.65,
    ytdReturn: 19.5,
    oneYearReturn: 24.8,
    threeYearReturn: 11.2,
    riskLevel: 'Medium',
    manager: 'Cinematic Assets Management',
    inceptionDate: '2020-01-10',
    description: 'Tracks Marvel characters with confirmed MCU appearances.',
    topHoldings: [
      { symbol: 'IRNM', name: 'Iron Man', weight: 15.8 },
      { symbol: 'CAPA', name: 'Captain America', weight: 14.2 },
      { symbol: 'THOR', name: 'Thor', weight: 13.5 },
      { symbol: 'BLKP', name: 'Black Panther', weight: 12.8 }
    ]
  },
  {
    id: 'etf-5',
    name: 'DC Extended Universe ETF',
    symbol: 'DCEU',
    type: 'themed',
    nav: 88.75,
    change: 1.20,
    percentageChange: 1.37,
    aum: 950000000,
    managementFee: 0.55,
    expenseRatio: 0.65,
    ytdReturn: 13.2,
    oneYearReturn: 17.9,
    threeYearReturn: 8.7,
    riskLevel: 'Medium',
    manager: 'DC Entertainment Funds',
    inceptionDate: '2020-03-15',
    description: 'Focuses on DC characters with movie and TV presence.',
    topHoldings: [
      { symbol: 'BATM', name: 'Batman', weight: 22.5 },
      { symbol: 'SUPR', name: 'Superman', weight: 18.3 },
      { symbol: 'WNDR', name: 'Wonder Woman', weight: 16.2 },
      { symbol: 'FLSH', name: 'Flash', weight: 12.4 }
    ]
  },
  {
    id: 'etf-6',
    name: 'Comic Villains ETF',
    symbol: 'EVIL',
    type: 'themed',
    nav: 72.60,
    change: -0.95,
    percentageChange: -1.29,
    aum: 380000000,
    managementFee: 0.65,
    expenseRatio: 0.75,
    ytdReturn: 8.9,
    oneYearReturn: 13.5,
    threeYearReturn: 6.8,
    riskLevel: 'High',
    manager: 'Dark Side Investments',
    inceptionDate: '2019-10-31',
    description: 'Invests in supervillains and antagonist characters.',
    topHoldings: [
      { symbol: 'JOKR', name: 'The Joker', weight: 20.5 },
      { symbol: 'LEXL', name: 'Lex Luthor', weight: 16.8 },
      { symbol: 'MAGN', name: 'Magneto', weight: 14.2 },
      { symbol: 'DOOM', name: 'Doctor Doom', weight: 12.5 }
    ]
  },
  {
    id: 'etf-7',
    name: 'Independent Comics ETF',
    symbol: 'INDE',
    type: 'index',
    nav: 67.85,
    change: 1.75,
    percentageChange: 2.65,
    aum: 420000000,
    managementFee: 0.70,
    expenseRatio: 0.80,
    ytdReturn: 16.8,
    oneYearReturn: 22.3,
    threeYearReturn: 10.5,
    riskLevel: 'High',
    manager: 'Independent Publishers Fund',
    inceptionDate: '2020-05-20',
    description: 'Diversified exposure to independent comic publishers.',
    topHoldings: [
      { symbol: 'IMGC', name: 'Image Comics', weight: 25.5 },
      { symbol: 'DKHS', name: 'Dark Horse', weight: 18.2 },
      { symbol: 'BOOM', name: 'Boom! Studios', weight: 15.8 },
      { symbol: 'IDW', name: 'IDW Publishing', weight: 12.5 }
    ]
  },
  {
    id: 'etf-8',
    name: 'Comic Creator Innovation ETF',
    symbol: 'INNO',
    type: 'themed',
    nav: 82.40,
    change: 2.30,
    percentageChange: 2.87,
    aum: 580000000,
    managementFee: 0.75,
    expenseRatio: 0.85,
    ytdReturn: 18.5,
    oneYearReturn: 25.8,
    threeYearReturn: 12.1,
    riskLevel: 'High',
    manager: 'Creator Capital Ventures',
    inceptionDate: '2021-01-15',
    description: 'Focuses on innovative creators and breakthrough artists.',
    topHoldings: [
      { symbol: 'TMFS', name: 'Todd McFarlane', weight: 12.8 },
      { symbol: 'JLES', name: 'Jim Lee', weight: 11.5 },
      { symbol: 'FSTS', name: 'Fiona Staples', weight: 10.2 },
      { symbol: 'SSNY', name: 'Scott Snyder', weight: 9.8 }
    ]
  },
  {
    id: 'etf-9',
    name: 'Bronze Age Classics ETF',
    symbol: 'BRNZ',
    type: 'themed',
    nav: 93.25,
    change: 1.15,
    percentageChange: 1.25,
    aum: 450000000,
    managementFee: 0.50,
    expenseRatio: 0.60,
    ytdReturn: 9.8,
    oneYearReturn: 14.2,
    threeYearReturn: 7.5,
    riskLevel: 'Medium',
    manager: 'Bronze Age Holdings',
    inceptionDate: '2019-08-15',
    description: 'Bronze Age comics from 1970-1985 era.',
    topHoldings: [
      { symbol: 'HLK181', name: 'Hulk #181', weight: 18.5 },
      { symbol: 'GSX1', name: 'Giant-Size X-Men #1', weight: 15.2 },
      { symbol: 'IIM55', name: 'Iron Man #55', weight: 12.8 },
      { symbol: 'NMUT98', name: 'New Mutants #98', weight: 11.5 }
    ]
  },
  {
    id: 'etf-10',
    name: 'Modern Age Growth ETF',
    symbol: 'MDRN',
    type: 'themed',
    nav: 78.90,
    change: 2.85,
    percentageChange: 3.74,
    aum: 720000000,
    managementFee: 0.65,
    expenseRatio: 0.75,
    ytdReturn: 21.5,
    oneYearReturn: 28.9,
    threeYearReturn: 14.8,
    riskLevel: 'High',
    manager: 'Modern Comics Capital',
    inceptionDate: '2020-09-10',
    description: 'Focuses on Modern Age comics with high growth potential.',
    topHoldings: [
      { symbol: 'WD1', name: 'Walking Dead #1', weight: 16.8 },
      { symbol: 'SAGA1', name: 'Saga #1', weight: 14.5 },
      { symbol: 'INV1', name: 'Invincible #1', weight: 12.2 },
      { symbol: 'KA1', name: 'Kick-Ass #1', weight: 10.8 }
    ]
  }
];

// Add 40 more ETFs to reach 50 total
const additionalETFs = Array.from({ length: 40 }, (_, i) => {
  const etfNumber = i + 11;
  const themes = [
    'Anime Manga', 'Horror Comics', 'Sci-Fi Universe', 'Western Comics',
    'Crime Noir', 'Romance Comics', 'War Comics', 'Space Opera',
    'Fantasy Realm', 'Steampunk Era', 'Cyberpunk Future', 'Post-Apocalyptic',
    'Superhero Teams', 'Solo Heroes', 'Anti-Heroes', 'Cosmic Powers',
    'Street Level', 'Magic Users', 'Tech Heroes', 'Mutants',
    'Aliens', 'Time Travelers', 'Dimensions', 'Multiverse',
    'Young Heroes', 'Legacy Heroes', 'International', 'Underground',
    'Retro Revival', 'Digital First', 'Webcomics', 'Graphic Novels',
    'Limited Series', 'Crossover Events', 'Variant Covers', 'Milestone Issues',
    'First Appearances', 'Final Issues', 'Anniversary Editions', 'Creator Spotlights'
  ];
  
  const theme = themes[i % themes.length];
  
  return {
    id: `etf-${etfNumber}`,
    name: `${theme} ETF`,
    symbol: `${theme.replace(/\s+/g, '').slice(0, 4).toUpperCase()}`,
    type: 'themed' as const,
    nav: 45 + Math.random() * 80,
    change: (Math.random() - 0.5) * 4,
    percentageChange: (Math.random() - 0.5) * 5,
    aum: 100000000 + Math.random() * 500000000,
    managementFee: 0.4 + Math.random() * 0.4,
    expenseRatio: 0.5 + Math.random() * 0.4,
    ytdReturn: (Math.random() - 0.2) * 25,
    oneYearReturn: (Math.random() - 0.1) * 30,
    threeYearReturn: (Math.random() - 0.1) * 15,
    riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
    manager: `${theme} Asset Management`,
    inceptionDate: `${2018 + Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    description: `Specialized ETF focusing on ${theme.toLowerCase()} segment of the comic market.`,
    topHoldings: [
      { symbol: 'SYM1', name: 'Top Holding 1', weight: 15 + Math.random() * 10 },
      { symbol: 'SYM2', name: 'Top Holding 2', weight: 10 + Math.random() * 8 },
      { symbol: 'SYM3', name: 'Top Holding 3', weight: 8 + Math.random() * 6 },
      { symbol: 'SYM4', name: 'Top Holding 4', weight: 6 + Math.random() * 4 }
    ]
  };
});

allETFs.push(...additionalETFs);

export default allETFs;