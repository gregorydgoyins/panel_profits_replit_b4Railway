import { Router } from 'express';
import { isAuthenticated } from '../replitAuth.js';
import { storage } from '../storage.js';

const router = Router();

// Seven Mythological Houses Configuration
export const MYTHOLOGICAL_HOUSES = {
  heroes: {
    id: 'heroes',
    name: 'House of Heroes',
    description: 'Masters of character options and futures',
    specialization: 'Character Assets',
    bonuses: {
      characterTrades: 0.15, // +15% success on hero trades
      tradingFees: 0.95,     // 5% fee reduction
      earlyAccess: ['character_options', 'hero_futures']
    },
    karmaMultiplier: 1.2,
    colors: {
      primary: 'red-600',
      secondary: 'orange-500',
      accent: 'red-400'
    },
    icon: 'Shield'
  },
  wisdom: {
    id: 'wisdom',
    name: 'House of Wisdom',
    description: 'Scholars of creator bonds and intellectual property',
    specialization: 'Creator Assets',
    bonuses: {
      aiInsights: 0.25,      // +25% AI insight accuracy
      creatorTrades: 0.12,   // +12% success on creator assets
      researchSpeed: 0.30    // 30% faster research
    },
    karmaMultiplier: 1.15,
    colors: {
      primary: 'blue-600',
      secondary: 'indigo-500',
      accent: 'blue-400'
    },
    icon: 'BookOpen'
  },
  power: {
    id: 'power',
    name: 'House of Power',
    description: 'Rulers of publisher stocks and franchise NFTs',
    specialization: 'Publisher Assets',
    bonuses: {
      tradingLimits: 2.0,    // 2x higher trading limits
      premiumAccess: true,   // Access to institutional-grade features
      tradingFees: 0.85      // 15% fee reduction
    },
    karmaMultiplier: 1.0,    // Neutral karma (power comes with responsibility)
    colors: {
      primary: 'purple-600',
      secondary: 'violet-500',
      accent: 'purple-400'
    },
    icon: 'Crown'
  },
  mystery: {
    id: 'mystery',
    name: 'House of Mystery',
    description: 'Seers of rare issue derivatives and speculation tokens',
    specialization: 'Rare Assets',
    bonuses: {
      rareTrades: 0.20,      // +20% success on rare assets
      earlyAccess: ['exclusive_drops', 'limited_editions'],
      predictionAccuracy: 0.18 // +18% market prediction accuracy
    },
    karmaMultiplier: 1.25,
    colors: {
      primary: 'green-600',
      secondary: 'emerald-500',
      accent: 'green-400'
    },
    icon: 'Zap'
  },
  elements: {
    id: 'elements',
    name: 'House of Elements',
    description: 'Wielders of cross-universe asset baskets',
    specialization: 'Multi-Universe Assets',
    bonuses: {
      crossUniverseBonuses: 0.10, // +10% when trading across different universes
      portfolioBalance: 0.15,     // +15% portfolio optimization
      elementalStacking: true     // Bonuses stack across different comic universes
    },
    karmaMultiplier: 1.1,
    colors: {
      primary: 'amber-600',
      secondary: 'yellow-500',
      accent: 'amber-400'
    },
    icon: 'Flame'
  },
  time: {
    id: 'time',
    name: 'House of Time',
    description: 'Guardians of historical price prediction markets',
    specialization: 'Historical Assets',
    bonuses: {
      vintageAssets: 0.22,   // +22% success on vintage comics
      timeBasedKarma: 1.5,   // Time multiplies karma gains
      historicalInsights: 0.25 // +25% accuracy on historical price patterns
    },
    karmaMultiplier: 1.3,   // Time rewards patience
    colors: {
      primary: 'gray-600',
      secondary: 'slate-500',
      accent: 'gray-400'
    },
    icon: 'Clock'
  },
  spirit: {
    id: 'spirit',
    name: 'House of Spirit',
    description: 'Masters of community sentiment and social trading',
    specialization: 'Social Assets',
    bonuses: {
      socialTradingBonus: 0.18, // +18% when following community trends
      sentimentAccuracy: 0.20,  // +20% sentiment analysis accuracy
      communityKarma: 1.4       // Extra karma from community actions
    },
    karmaMultiplier: 1.25,
    colors: {
      primary: 'teal-600',
      secondary: 'cyan-500',
      accent: 'teal-400'
    },
    icon: 'Users'
  }
} as const;

// GET /api/houses - List all mythological houses
router.get('/', async (req, res) => {
  try {
    const houses = Object.values(MYTHOLOGICAL_HOUSES);
    res.json({
      success: true,
      houses: houses,
      count: houses.length
    });
  } catch (error) {
    console.error('Error fetching houses:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch houses' 
    });
  }
});

// GET /api/houses/:houseId - Get specific house details
router.get('/:houseId', async (req, res) => {
  try {
    const { houseId } = req.params;
    const house = MYTHOLOGICAL_HOUSES[houseId as keyof typeof MYTHOLOGICAL_HOUSES];
    
    if (!house) {
      return res.status(404).json({
        success: false,
        error: 'House not found'
      });
    }

    // Get house member count and rankings
    const memberCount = await storage.getHouseMemberCount(houseId);
    const topTraders = await storage.getHouseTopTraders(houseId, 10);

    res.json({
      success: true,
      house: {
        ...house,
        memberCount,
        topTraders
      }
    });
  } catch (error) {
    console.error('Error fetching house details:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch house details' 
    });
  }
});

// POST /api/houses/:houseId/join - Join a house (one-time selection)
router.post('/:houseId/join', isAuthenticated, async (req: any, res) => {
  try {
    const { houseId } = req.params;
    const userId = req.user.claims.sub;
    
    const house = MYTHOLOGICAL_HOUSES[houseId as keyof typeof MYTHOLOGICAL_HOUSES];
    if (!house) {
      return res.status(404).json({
        success: false,
        error: 'House not found'
      });
    }

    // Check if user already belongs to a house
    const user = await storage.getUser(userId);
    if (user?.houseId) {
      return res.status(400).json({
        success: false,
        error: 'You have already joined a house. House loyalty is permanent.'
      });
    }

    // Join the house
    await storage.updateUser(userId, { houseId });
    
    // Record house joining event for karma
    await storage.recordKarmaAction(userId, {
      type: 'house_joined',
      houseId,
      karmaChange: 100, // Bonus karma for joining
      description: `Joined ${house.name}`
    });

    res.json({
      success: true,
      message: `Welcome to ${house.name}! Your legendary journey begins.`,
      house: house,
      karmaBonus: 100
    });

  } catch (error) {
    console.error('Error joining house:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to join house' 
    });
  }
});

// GET /api/houses/:houseId/members - Get house member rankings
router.get('/:houseId/members', async (req, res) => {
  try {
    const { houseId } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const house = MYTHOLOGICAL_HOUSES[houseId as keyof typeof MYTHOLOGICAL_HOUSES];
    if (!house) {
      return res.status(404).json({
        success: false,
        error: 'House not found'
      });
    }

    const members = await storage.getHouseMembers(houseId, limit);
    const memberCount = await storage.getHouseMemberCount(houseId);

    res.json({
      success: true,
      house: house.name,
      members,
      memberCount,
      hasMore: members.length === limit
    });

  } catch (error) {
    console.error('Error fetching house members:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch house members' 
    });
  }
});

// GET /api/houses/:houseId/bonuses - Get current house trading bonuses
router.get('/:houseId/bonuses', isAuthenticated, async (req: any, res) => {
  try {
    const { houseId } = req.params;
    const userId = req.user.claims.sub;
    
    const house = MYTHOLOGICAL_HOUSES[houseId as keyof typeof MYTHOLOGICAL_HOUSES];
    if (!house) {
      return res.status(404).json({
        success: false,
        error: 'House not found'
      });
    }

    // Get user's karma to calculate dynamic bonuses
    const userKarma = await storage.getUserKarma(userId);
    
    // Calculate karma-modified bonuses
    const bonuses = {
      ...house.bonuses,
      karmaMultiplier: house.karmaMultiplier,
      currentKarmaBonus: Math.min(userKarma / 1000 * 0.05, 0.15), // Up to +15% bonus based on karma
      totalMultiplier: house.karmaMultiplier + (userKarma / 1000 * 0.05)
    };

    res.json({
      success: true,
      house: house.name,
      specialization: house.specialization,
      bonuses,
      userKarma
    });

  } catch (error) {
    console.error('Error fetching house bonuses:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch house bonuses' 
    });
  }
});

// GET /api/houses/my-house - Get user's house info
router.get('/my-house', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    
    if (!user?.houseId) {
      return res.json({
        success: true,
        hasHouse: false,
        message: 'Choose your house to unlock mystical trading powers'
      });
    }

    const house = MYTHOLOGICAL_HOUSES[user.houseId as keyof typeof MYTHOLOGICAL_HOUSES];
    if (!house) {
      return res.status(404).json({
        success: false,
        error: 'House configuration not found'
      });
    }

    // Get user's house rank and stats
    const houseRank = await storage.getUserHouseRank(userId);
    const memberCount = await storage.getHouseMemberCount(user.houseId);
    const userKarma = await storage.getUserKarma(userId);

    res.json({
      success: true,
      hasHouse: true,
      house: {
        ...house,
        memberCount,
        userRank: houseRank,
        userKarma
      }
    });

  } catch (error) {
    console.error('Error fetching user house:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user house' 
    });
  }
});

export default router;