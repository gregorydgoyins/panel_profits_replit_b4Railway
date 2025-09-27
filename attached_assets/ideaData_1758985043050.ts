import { Idea } from '../types';

export const mockIdeas: Idea[] = [
  {
    id: 'idea-1',
    title: 'AI-Powered Price Prediction',
    content: 'Develop machine learning models to predict comic book price movements based on media announcements, creator activity, and market sentiment analysis.',
    tags: ['AI', 'prediction', 'machine-learning', 'pricing'],
    createdAt: new Date('2024-05-01T10:00:00Z'),
    updatedAt: new Date('2024-05-01T10:00:00Z'),
    sentiment: 'positive',
    priority: 9,
    category: 'technology'
  },
  {
    id: 'idea-2',
    title: 'Real-Time Market Sentiment Analysis',
    content: 'Implement natural language processing to analyze social media, news articles, and forum discussions for comic market sentiment indicators.',
    tags: ['sentiment', 'NLP', 'social-media', 'analytics'],
    createdAt: new Date('2024-05-02T14:30:00Z'),
    updatedAt: new Date('2024-05-02T14:30:00Z'),
    sentiment: 'positive',
    priority: 8,
    category: 'analytics'
  },
  {
    id: 'idea-3',
    title: 'Creator Performance Tracking',
    content: 'Build comprehensive tracking system for comic creators including project announcements, award wins, and market impact analysis.',
    tags: ['creators', 'tracking', 'performance', 'analytics'],
    createdAt: new Date('2024-05-03T09:15:00Z'),
    updatedAt: new Date('2024-05-03T09:15:00Z'),
    sentiment: 'positive',
    priority: 7,
    category: 'analytics'
  },
  {
    id: 'idea-4',
    title: 'Mobile Trading App',
    content: 'Develop native mobile application for iOS and Android with full trading capabilities, portfolio management, and push notifications for price alerts.',
    tags: ['mobile', 'trading', 'iOS', 'android', 'notifications'],
    createdAt: new Date('2024-05-04T16:45:00Z'),
    updatedAt: new Date('2024-05-04T16:45:00Z'),
    sentiment: 'positive',
    priority: 8,
    category: 'technology'
  },
  {
    id: 'idea-5',
    title: 'Cross-Publisher Event Impact Analysis',
    content: 'Analyze how crossover events between Marvel and DC affect individual character and creator stock prices, identifying arbitrage opportunities.',
    tags: ['crossover', 'events', 'arbitrage', 'analysis'],
    createdAt: new Date('2024-05-05T11:20:00Z'),
    updatedAt: new Date('2024-05-05T11:20:00Z'),
    sentiment: 'neutral',
    priority: 6,
    category: 'analytics'
  },
  {
    id: 'idea-6',
    title: 'Automated Risk Management System',
    content: 'Implement automated stop-loss orders, position sizing recommendations, and portfolio rebalancing based on predefined risk parameters.',
    tags: ['risk-management', 'automation', 'stop-loss', 'portfolio'],
    createdAt: new Date('2024-05-06T13:00:00Z'),
    updatedAt: new Date('2024-05-06T13:00:00Z'),
    sentiment: 'positive',
    priority: 9,
    category: 'risk'
  },
  {
    id: 'idea-7',
    title: 'Comic Convention Impact Predictor',
    content: 'Track comic convention announcements, guest appearances, and exclusive releases to predict short-term price movements.',
    tags: ['conventions', 'events', 'prediction', 'announcements'],
    createdAt: new Date('2024-05-07T08:30:00Z'),
    updatedAt: new Date('2024-05-07T08:30:00Z'),
    sentiment: 'positive',
    priority: 7,
    category: 'events'
  },
  {
    id: 'idea-8',
    title: 'Blockchain-Based Asset Verification',
    content: 'Implement blockchain technology to verify comic book authenticity, ownership history, and grading certificates.',
    tags: ['blockchain', 'verification', 'authenticity', 'security'],
    createdAt: new Date('2024-05-08T15:45:00Z'),
    updatedAt: new Date('2024-05-08T15:45:00Z'),
    sentiment: 'neutral',
    priority: 5,
    category: 'security'
  },
  {
    id: 'idea-9',
    title: 'Social Trading Features',
    content: 'Allow users to follow successful traders, copy their portfolios, and share trading strategies within the platform.',
    tags: ['social', 'copy-trading', 'community', 'strategies'],
    createdAt: new Date('2024-05-09T10:15:00Z'),
    updatedAt: new Date('2024-05-09T10:15:00Z'),
    sentiment: 'positive',
    priority: 6,
    category: 'social'
  },
  {
    id: 'idea-10',
    title: 'Advanced Options Calculator',
    content: 'Build sophisticated options pricing calculator with Greeks visualization, volatility surface analysis, and strategy comparison tools.',
    tags: ['options', 'calculator', 'greeks', 'volatility'],
    createdAt: new Date('2024-05-10T12:00:00Z'),
    updatedAt: new Date('2024-05-10T12:00:00Z'),
    sentiment: 'positive',
    priority: 8,
    category: 'trading'
  },
  {
    id: 'idea-11',
    title: 'Media Adaptation Alert System',
    content: 'Automatically track movie, TV, and streaming announcements to identify comics likely to see price increases.',
    tags: ['media', 'movies', 'TV', 'alerts', 'tracking'],
    createdAt: new Date('2024-05-11T09:30:00Z'),
    updatedAt: new Date('2024-05-11T09:30:00Z'),
    sentiment: 'positive',
    priority: 8,
    category: 'media'
  },
  {
    id: 'idea-12',
    title: 'Grading Service Integration',
    content: 'Integrate with CGC, CBCS, and other grading services to automatically update comic values based on new grades.',
    tags: ['grading', 'CGC', 'CBCS', 'integration', 'automation'],
    createdAt: new Date('2024-05-12T14:20:00Z'),
    updatedAt: new Date('2024-05-12T14:20:00Z'),
    sentiment: 'positive',
    priority: 7,
    category: 'integration'
  },
  {
    id: 'idea-13',
    title: 'Portfolio Diversification AI',
    content: 'Create AI assistant that provides personalized diversification recommendations based on user risk tolerance and market conditions.',
    tags: ['diversification', 'AI', 'recommendations', 'risk'],
    createdAt: new Date('2024-05-13T11:45:00Z'),
    updatedAt: new Date('2024-05-13T11:45:00Z'),
    sentiment: 'positive',
    priority: 8,
    category: 'portfolio'
  },
  {
    id: 'idea-14',
    title: 'Virtual Reality Trading Floor',
    content: 'Develop VR interface for immersive trading experience with 3D market visualizations and gesture-based trading.',
    tags: ['VR', 'virtual-reality', 'immersive', 'trading'],
    createdAt: new Date('2024-05-14T16:00:00Z'),
    updatedAt: new Date('2024-05-14T16:00:00Z'),
    sentiment: 'neutral',
    priority: 4,
    category: 'technology'
  },
  {
    id: 'idea-15',
    title: 'Comic Age Classification AI',
    content: 'Machine learning system to automatically classify comics by age, rarity, and significance using image recognition and metadata analysis.',
    tags: ['classification', 'AI', 'image-recognition', 'metadata'],
    createdAt: new Date('2024-05-15T13:10:00Z'),
    updatedAt: new Date('2024-05-15T13:10:00Z'),
    sentiment: 'positive',
    priority: 6,
    category: 'classification'
  },
  {
    id: 'idea-16',
    title: 'Tax Optimization Engine',
    content: 'Automated system to optimize trading decisions for tax efficiency, including wash sale prevention and loss harvesting strategies.',
    tags: ['tax', 'optimization', 'automation', 'efficiency'],
    createdAt: new Date('2024-05-16T10:25:00Z'),
    updatedAt: new Date('2024-05-16T10:25:00Z'),
    sentiment: 'positive',
    priority: 7,
    category: 'finance'
  },
  {
    id: 'idea-17',
    title: 'Community-Driven Price Discovery',
    content: 'Platform for collectors to submit price data and market observations to improve pricing accuracy for rare and unique comics.',
    tags: ['community', 'price-discovery', 'crowdsourcing', 'accuracy'],
    createdAt: new Date('2024-05-17T15:50:00Z'),
    updatedAt: new Date('2024-05-17T15:50:00Z'),
    sentiment: 'positive',
    priority: 6,
    category: 'community'
  },
  {
    id: 'idea-18',
    title: 'Economic Indicator Correlation',
    content: 'Analyze correlations between traditional economic indicators (inflation, interest rates) and comic book market performance.',
    tags: ['economics', 'correlation', 'indicators', 'analysis'],
    createdAt: new Date('2024-05-18T12:35:00Z'),
    updatedAt: new Date('2024-05-18T12:35:00Z'),
    sentiment: 'neutral',
    priority: 5,
    category: 'economics'
  },
  {
    id: 'idea-19',
    title: 'Gamification Trading Rewards',
    content: 'Implement achievement system, leaderboards, and trading challenges to increase user engagement and platform stickiness.',
    tags: ['gamification', 'rewards', 'achievements', 'engagement'],
    createdAt: new Date('2024-05-19T09:40:00Z'),
    updatedAt: new Date('2024-05-19T09:40:00Z'),
    sentiment: 'positive',
    priority: 6,
    category: 'engagement'
  },
  {
    id: 'idea-20',
    title: 'ESG Comic Investment Scoring',
    content: 'Develop Environmental, Social, and Governance scoring system for comic investments based on creator values and publisher practices.',
    tags: ['ESG', 'sustainability', 'governance', 'scoring'],
    createdAt: new Date('2024-05-20T14:15:00Z'),
    updatedAt: new Date('2024-05-20T14:15:00Z'),
    sentiment: 'neutral',
    priority: 4,
    category: 'ESG'
  }
];

export default mockIdeas;