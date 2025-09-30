import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { noirJournalService } from '../services/noirJournalService';
import { isAuthenticated } from '../replitAuth';
import { z } from 'zod';

const router = Router();

// Schema for generate journal entry request
const generateEntrySchema = z.object({
  tradeId: z.string().optional(),
  entryType: z.enum(['trade', 'daily', 'milestone', 'confession']).optional(),
});

// Schema for get entries query params
const getEntriesSchema = z.object({
  entryType: z.string().optional(),
  limit: z.string().transform(Number).default('50'),
  offset: z.string().transform(Number).default('0'),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

/**
 * POST /api/journal/generate
 * Trigger AI generation of journal entry after trades
 */
router.post('/generate', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { tradeId, entryType } = generateEntrySchema.parse(req.body);

    // Get user's moral standing
    const moralStanding = await storage.getMoralStanding(userId);
    if (!moralStanding) {
      return res.status(404).json({ error: 'Moral standing not found' });
    }

    const corruptionLevel = parseFloat(moralStanding.corruptionLevel);

    // Generate based on entry type
    if (tradeId) {
      // Generate entry for specific trade
      const trade = await storage.getTrade(tradeId);
      if (!trade) {
        return res.status(404).json({ error: 'Trade not found' });
      }

      // Get victim if this was a profitable trade
      const victims = await storage.getVictimsByTrade(tradeId);
      const victim = victims[0]; // Use first victim for entry

      const entry = await noirJournalService.generateNoirEntry({
        trade,
        victim,
        corruptionLevel,
        userId,
      });

      return res.json(entry);
    } else if (entryType === 'daily') {
      // Generate daily summary
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get today's trades
      const allTrades = await storage.getTrades(userId, userId, 100); // Get recent trades
      const dailyTrades = allTrades.filter(t => new Date(t.executedAt) >= today);
      
      // Get today's victims
      const allVictims = await storage.getTradingVictims(userId, 100);
      const dailyVictims = allVictims.filter(v => new Date(v.createdAt) >= today);

      const entry = await noirJournalService.generateDailySummary(
        userId,
        dailyTrades,
        dailyVictims,
        corruptionLevel
      );

      return res.json(entry);
    } else {
      // Generate general noir observation
      const entry = await noirJournalService.generateNoirEntry({
        corruptionLevel,
        userId,
      });

      return res.json(entry);
    }
  } catch (error) {
    console.error('Failed to generate journal entry:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to generate journal entry' });
  }
});

/**
 * GET /api/journal/entries
 * Get user's journal entries with optional filters
 */
router.get('/entries', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const filters = getEntriesSchema.parse(req.query);
    
    const entries = await storage.getJournalEntries(userId, {
      entryType: filters.entryType,
      limit: filters.limit,
      offset: filters.offset,
      fromDate: filters.fromDate ? new Date(filters.fromDate) : undefined,
      toDate: filters.toDate ? new Date(filters.toDate) : undefined,
    });

    res.json(entries);
  } catch (error) {
    console.error('Failed to fetch journal entries:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid query parameters', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

/**
 * GET /api/journal/analysis
 * Get psychological analysis of the trader
 */
router.get('/analysis', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get existing profile or generate new one
    let profile = await storage.getPsychologicalProfile(userId);
    
    if (!profile) {
      // Generate new psychological profile
      const trades = await storage.getTrades(userId, userId, 100);
      const victims = await storage.getTradingVictims(userId, 100);
      const moralStanding = await storage.getMoralStanding(userId);
      
      if (!moralStanding) {
        return res.status(404).json({ error: 'Moral standing not found' });
      }

      profile = await noirJournalService.analyzeTraderPsychology(
        userId,
        trades,
        victims,
        moralStanding
      );
    }

    res.json(profile);
  } catch (error) {
    console.error('Failed to get psychological analysis:', error);
    res.status(500).json({ error: 'Failed to get psychological analysis' });
  }
});

/**
 * POST /api/journal/milestone
 * Generate corruption milestone entry
 */
router.post('/milestone', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { milestone } = z.object({ milestone: z.number() }).parse(req.body);

    // Get user's moral standing
    const moralStanding = await storage.getMoralStanding(userId);
    if (!moralStanding) {
      return res.status(404).json({ error: 'Moral standing not found' });
    }

    const corruptionLevel = parseFloat(moralStanding.corruptionLevel);

    // Generate milestone entry
    const entry = await noirJournalService.writeCorruptionNarrative(
      userId,
      corruptionLevel,
      milestone
    );

    res.json(entry);
  } catch (error) {
    console.error('Failed to generate milestone entry:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to generate milestone entry' });
  }
});

/**
 * POST /api/journal/confession
 * Generate shadow market confession
 */
router.post('/confession', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { shadowActivity } = req.body;

    // Get user's moral standing
    const moralStanding = await storage.getMoralStanding(userId);
    if (!moralStanding) {
      return res.status(404).json({ error: 'Moral standing not found' });
    }

    const corruptionLevel = parseFloat(moralStanding.corruptionLevel);

    // Generate shadow confession
    const entry = await noirJournalService.generateShadowConfession(
      userId,
      shadowActivity,
      corruptionLevel
    );

    res.json(entry);
  } catch (error) {
    console.error('Failed to generate confession:', error);
    res.status(500).json({ error: 'Failed to generate confession' });
  }
});

/**
 * GET /api/journal/latest
 * Get the latest journal entry
 */
router.get('/latest', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { entryType } = req.query;
    
    const entry = await storage.getLatestJournalEntry(
      userId,
      entryType as string | undefined
    );

    if (!entry) {
      return res.status(404).json({ error: 'No journal entries found' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Failed to fetch latest entry:', error);
    res.status(500).json({ error: 'Failed to fetch latest entry' });
  }
});

export default router;