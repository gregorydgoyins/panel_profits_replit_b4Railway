import { Fund } from '../types';

// All Funds Data
export const allFunds: Fund[] = [
  {
    id: '1',
    name: 'Superhero Universe Fund',
    symbol: 'SHUF',
    type: 'themed',
    nav: 126,
    change: 2,
    percentageChange: 1.9,
    aum: 450000000,
    managementFee: 0.75,
    expenseRatio: 0.85,
    ytdReturn: 12.5,
    oneYearReturn: 18.2,
    threeYearReturn: 8.7,
    riskLevel: 'Medium',
    manager: 'Comic Capital Management',
    inceptionDate: '2019-03-15',
    description: 'Diversified fund focusing on superhero characters across all publishers and eras.',
    topHoldings: [
      { symbol: 'SPDR', name: 'Spider-Man', weight: 12.5 },
      { symbol: 'BATM', name: 'Batman', weight: 11.8 },
      { symbol: 'SUPR', name: 'Superman', weight: 10.2 },
      { symbol: 'WNDR', name: 'Wonder Woman', weight: 8.9 }
    ]
  },
  {
    id: '2',
    name: 'Villain Portfolio Fund',
    symbol: 'VPFD',
    type: 'themed',
    nav: 98,
    change: 1,
    percentageChange: 1.3,
    aum: 280000000,
    managementFee: 0.85,
    expenseRatio: 0.95,
    ytdReturn: 8.5,
    oneYearReturn: 12.8,
    threeYearReturn: 6.2,
    riskLevel: 'High',
    manager: 'Dark Side Investments',
    inceptionDate: '2020-08-01',
    description: 'Concentrated fund investing in supervillain characters and anti-hero assets.',
    topHoldings: [
      { symbol: 'JOKR', name: 'The Joker', weight: 15.2 },
      { symbol: 'LEXL', name: 'Lex Luthor', weight: 12.8 },
      { symbol: 'MAGN', name: 'Magneto', weight: 11.5 },
      { symbol: 'DOOM', name: 'Doctor Doom', weight: 10.1 }
    ]
  },
  {
    id: '3',
    name: 'Creator Royalty Fund',
    symbol: 'CRRF',
    type: 'custom',
    nav: 157,
    change: 1,
    percentageChange: 0.6,
    aum: 320000000,
    managementFee: 1.25,
    expenseRatio: 1.35,
    ytdReturn: 15.8,
    oneYearReturn: 22.4,
    threeYearReturn: 12.1,
    riskLevel: 'High',
    manager: 'Creator Capital Ventures',
    inceptionDate: '2018-11-20',
    description: 'Fund investing in creator royalty streams and intellectual property rights.',
    topHoldings: [
      { symbol: 'TMFS', name: 'Todd McFarlane', weight: 18.5 },
      { symbol: 'JLES', name: 'Jim Lee', weight: 16.2 },
      { symbol: 'FSTS', name: 'Fiona Staples', weight: 14.8 },
      { symbol: 'SSNY', name: 'Scott Snyder', weight: 12.3 }
    ]
  }
];

// Filter by fund type
export const themedFunds = allFunds.filter(fund => fund.type === 'themed');
export const customFunds = allFunds.filter(fund => fund.type === 'custom');

export default allFunds;