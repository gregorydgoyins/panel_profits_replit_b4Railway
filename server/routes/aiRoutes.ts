import express from 'express';
import { aiMarketIntelligence } from '../services/aiMarketIntelligence.js';
import type { ComicAssetData } from '../services/aiMarketIntelligence.js';

const router = express.Router();

/**
 * AI Market Intelligence Routes
 * Provides AI-powered predictions, insights, and challenges
 */

// Get AI price predictions
router.get('/predictions', async (req, res) => {
  console.log('🤖 AI Predictions endpoint called');
  
  try {
    // Generate demo data for AI predictions based on our scholarly framework
    const demoAssets: ComicAssetData[] = [
      {
        name: 'Action Comics #1',
        symbol: 'ACT1',
        currentPrice: 6000000,
        yearPublished: 1938,
        grade: '9.0',
        category: 'First Appearances',
        firstAppearance: true,
        publisher: 'DC Comics',
        recentSales: [5800000, 6200000, 5900000],
        marketCap: 6000000
      },
      {
        name: 'Detective Comics #27',
        symbol: 'DET27',
        currentPrice: 3500000,
        yearPublished: 1939,
        grade: '8.5',
        category: 'First Appearances',
        firstAppearance: true,
        publisher: 'DC Comics',
        recentSales: [3200000, 3600000, 3400000],
        marketCap: 3500000
      },
      {
        name: 'Amazing Fantasy #15',
        symbol: 'AF15',
        currentPrice: 425000,
        yearPublished: 1962,
        grade: '9.0',
        category: 'First Appearances',
        firstAppearance: true,
        publisher: 'Marvel Comics',
        recentSales: [400000, 450000, 420000],
        marketCap: 425000
      },
      {
        name: 'Fantastic Four #1',
        symbol: 'FF1',
        currentPrice: 285000,
        yearPublished: 1961,
        grade: '9.2',
        category: 'Team Origins',
        publisher: 'Marvel Comics',
        recentSales: [270000, 300000, 280000],
        marketCap: 285000
      },
      {
        name: 'X-Men #1',
        symbol: 'XMEN1',
        currentPrice: 195000,
        yearPublished: 1963,
        grade: '8.5',
        category: 'Team Origins',
        publisher: 'Marvel Comics',
        recentSales: [180000, 210000, 190000],
        marketCap: 195000
      }
    ];

    console.log('🤖 Generating AI predictions for', demoAssets.length, 'premium assets...');
    const predictions = await aiMarketIntelligence.generatePricePredictions(demoAssets);
    
    console.log('🤖 AI predictions generated successfully');
    res.json(predictions);
    
  } catch (error) {
    console.error('🤖 AI Predictions Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI predictions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get AI market insights
router.get('/insights', async (req, res) => {
  console.log('🤖 AI Market Insights endpoint called');
  
  try {
    const demoAssets: ComicAssetData[] = [
      {
        name: 'Action Comics #1',
        symbol: 'ACT1',
        currentPrice: 6000000,
        yearPublished: 1938,
        grade: '9.0',
        category: 'First Appearances',
        firstAppearance: true,
        publisher: 'DC Comics',
        marketCap: 6000000
      },
      {
        name: 'Marvel Comics #1',
        symbol: 'MAR1',
        currentPrice: 1200000,
        yearPublished: 1939,
        grade: '8.0',
        category: 'Golden Age',
        publisher: 'Marvel Comics',
        marketCap: 1200000
      },
      {
        name: 'Amazing Fantasy #15',
        symbol: 'AF15',
        currentPrice: 425000,
        yearPublished: 1962,
        grade: '9.0',
        category: 'First Appearances',
        firstAppearance: true,
        publisher: 'Marvel Comics',
        marketCap: 425000
      }
    ];

    console.log('🤖 Analyzing market for AI insights...');
    const insights = await aiMarketIntelligence.generateMarketInsights(demoAssets);
    
    console.log('🤖 AI market insights generated successfully');
    res.json(insights);
    
  } catch (error) {
    console.error('🤖 AI Insights Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI insights',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get Beat the AI challenges
router.get('/challenges', async (req, res) => {
  console.log('🤖 Beat the AI Challenges endpoint called');
  
  try {
    const challengeAssets: ComicAssetData[] = [
      {
        name: 'X-Men #1',
        symbol: 'XMEN1',
        currentPrice: 195000,
        yearPublished: 1963,
        grade: '8.5',
        category: 'Team Origins',
        publisher: 'Marvel Comics',
        marketCap: 195000
      },
      {
        name: 'Incredible Hulk #181',
        symbol: 'IH181',
        currentPrice: 165000,
        yearPublished: 1974,
        grade: '9.4',
        category: 'Character Debuts',
        publisher: 'Marvel Comics',
        marketCap: 165000
      },
      {
        name: 'Tales of Suspense #39',
        symbol: 'TOS39',
        currentPrice: 225000,
        yearPublished: 1963,
        grade: '8.0',
        category: 'First Appearances',
        firstAppearance: true,
        publisher: 'Marvel Comics',
        marketCap: 225000
      }
    ];

    console.log('🤖 Creating Beat the AI challenge...');
    const challenge = await aiMarketIntelligence.createBeatTheAIChallenge(challengeAssets);
    
    // Add some demo participants
    challenge.participantCount = 847;
    
    console.log('🤖 Beat the AI challenge created successfully');
    res.json([challenge]);
    
  } catch (error) {
    console.error('🤖 Beat the AI Challenge Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create AI challenge',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;