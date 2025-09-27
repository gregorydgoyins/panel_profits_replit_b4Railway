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

// Submit prediction for Beat the AI challenge
router.post('/challenges/:challengeId/predictions', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { assetSymbol, predictedChange, userId, username } = req.body;

    // Mock user data for demo (replace with real authentication)
    const mockUserId = userId || 'user_' + Date.now();
    const mockUsername = username || `Trader${Math.floor(Math.random() * 1000)}`;

    console.log(`🎯 Prediction submitted: ${mockUsername} predicts ${predictedChange}% for ${assetSymbol} in challenge ${challengeId}`);

    res.json({
      success: true,
      prediction: {
        id: `prediction_${Date.now()}`,
        challengeId,
        userId: mockUserId,
        username: mockUsername,
        assetSymbol,
        predictedChange: parseFloat(predictedChange),
        submissionTime: new Date().toISOString(),
        score: null,
        isWinner: false
      },
      message: 'Prediction submitted successfully! 🎯'
    });

  } catch (error) {
    console.error('Error submitting prediction:', error);
    res.status(500).json({ error: 'Failed to submit prediction' });
  }
});

// Get Beat the AI leaderboard with live data
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    
    // Generate dynamic leaderboard with realistic data
    const mockLeaderboard = [
      { rank: 1, userId: 'user_001', username: "ComicGenius2024", totalScore: 2847, accuracy: 73.2, totalPredictions: 156, winnings: 12500 },
      { rank: 2, userId: 'user_002', username: "MarketMaster", totalScore: 2623, accuracy: 69.8, totalPredictions: 142, winnings: 8750 },
      { rank: 3, userId: 'user_003', username: "InvestorPro", totalScore: 2451, accuracy: 67.1, totalPredictions: 134, winnings: 6200 },
      { rank: 4, userId: 'user_004', username: "TradingWiz", totalScore: 2298, accuracy: 64.5, totalPredictions: 128, winnings: 4800 },
      { rank: 5, userId: 'user_005', username: "ComicCollector", totalScore: 2156, accuracy: 62.3, totalPredictions: 119, winnings: 3400 },
      { rank: 6, userId: 'user_006', username: "PanelPredictor", totalScore: 2034, accuracy: 59.7, totalPredictions: 113, winnings: 2600 },
      { rank: 7, userId: 'user_007', username: "AIChallenger", totalScore: 1923, accuracy: 58.1, totalPredictions: 107, winnings: 2100 },
      { rank: 8, userId: 'user_008', username: "MarketHawk", totalScore: 1845, accuracy: 56.4, totalPredictions: 101, winnings: 1700 },
      { rank: 9, userId: 'user_009', username: "InvestmentGuru", totalScore: 1767, accuracy: 54.8, totalPredictions: 95, winnings: 1400 },
      { rank: 10, userId: 'user_010', username: "ComicInvestor", totalScore: 1698, accuracy: 53.2, totalPredictions: 89, winnings: 1200 }
    ];

    console.log(`📊 Leaderboard requested, returning top ${Math.min(limit, mockLeaderboard.length)} entries`);
    
    res.json(mockLeaderboard.slice(0, limit));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get competition statistics
router.get('/stats', async (req, res) => {
  try {
    // Generate dynamic stats
    const baseStats = {
      activePlayers: 847,
      totalPrizesWon: 73250,
      aiWinRate: 68.5,
      activeChallenges: 3
    };

    // Add some variance to make it feel live
    const variance = Math.sin(Date.now() / 100000) * 0.1;
    const stats = {
      activePlayers: Math.round(baseStats.activePlayers + (baseStats.activePlayers * variance * 0.05)),
      totalPrizesWon: Math.round(baseStats.totalPrizesWon + (baseStats.totalPrizesWon * variance * 0.02)),
      aiWinRate: Math.round((baseStats.aiWinRate + (variance * 2)) * 10) / 10,
      activeChallenges: baseStats.activeChallenges
    };

    console.log(`📈 Competition stats requested: ${stats.activePlayers} players, $${stats.totalPrizesWon} won`);
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching competition stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;