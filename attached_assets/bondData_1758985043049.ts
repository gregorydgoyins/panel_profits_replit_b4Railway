import { Bond } from '../types';

// All Bonds Data
export const allBonds: Bond[] = [
  {
    id: '1',
    name: 'Todd McFarlane Creative Bond',
    symbol: 'TMFB',
    type: 'creator',
    price: 11,
    change: 0,
    percentageChange: 2.0,
    yield: 4.2,
    maturity: '2029-12-31',
    creditRating: 'AA',
    issuer: 'McFarlane Entertainment',
    couponRate: 4.0,
    faceValue: 10,
    volume: 500,
    description: 'Bond backed by Todd McFarlane\'s intellectual property and royalty streams.',
    riskLevel: 'Low',
    interestFrequency: 'Semi-Annual'
  },
  {
    id: '2',
    name: 'Marvel Entertainment Bond',
    symbol: 'MRVLB',
    type: 'publisher',
    price: 10,
    change: 0,
    percentageChange: 0.8,
    yield: 3.2,
    maturity: '2027-03-15',
    creditRating: 'AAA',
    issuer: 'Marvel Entertainment',
    couponRate: 3.0,
    faceValue: 10,
    volume: 1200,
    description: 'Corporate bond issued by Marvel Entertainment for expansion and content development.',
    riskLevel: 'Low',
    interestFrequency: 'Semi-Annual'
  },
  {
    id: '3',
    name: 'DC Comics Corporate Bond',
    symbol: 'DCCB',
    type: 'publisher',
    price: 10,
    change: 0,
    percentageChange: 0.6,
    yield: 3.5,
    maturity: '2028-06-30',
    creditRating: 'AA',
    issuer: 'DC Comics',
    couponRate: 3.25,
    faceValue: 10,
    volume: 950,
    description: 'Corporate bond from DC Comics for digital transformation and new media ventures.',
    riskLevel: 'Low',
    interestFrequency: 'Semi-Annual'
  },
  {
    id: '4',
    name: 'Golden Age Comics Index Bond',
    symbol: 'GACB',
    type: 'specialty',
    price: 11,
    change: 0,
    percentageChange: 1.2,
    yield: 5.2,
    maturity: '2030-12-15',
    creditRating: 'A',
    issuer: 'Heritage Investment Trust',
    couponRate: 5.0,
    faceValue: 10,
    volume: 650,
    description: 'Bond linked to the performance of the Golden Age Comics Index.',
    riskLevel: 'Medium',
    interestFrequency: 'Quarterly'
  }
];

// Filter by bond type
export const creatorBonds = allBonds.filter(bond => bond.type === 'creator');
export const publisherBonds = allBonds.filter(bond => bond.type === 'publisher');
export const specialtyBonds = allBonds.filter(bond => bond.type === 'specialty');

export default allBonds;