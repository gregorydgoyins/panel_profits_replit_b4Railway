import { Router } from 'express';
import { storage } from '../storage.js';
import { learningService } from '../services/comprehensiveLearningService.js';
import { isAuthenticated } from '../replitAuth.js';
import { z } from 'zod';
import {
  insertLearningPathSchema,
  insertSacredLessonSchema,
  insertMysticalSkillSchema,
  insertUserLessonProgressSchema,
  insertUserSkillUnlockSchema,
  insertTrialOfMasterySchema,
  insertUserTrialAttemptSchema,
  insertDivineCertificationSchema,
  insertUserCertificationSchema,
  insertLearningAnalyticsSchema
} from '@shared/schema.js';

const router = Router();

// ========================================================================================
// SACRED LEARNING PATHS ROUTES
// ========================================================================================

// Get all learning paths with optional filtering
router.get('/paths', async (req, res) => {
  try {
    const { houseId, difficultyLevel, isActive } = req.query;
    const filters = {
      houseId: houseId as string,
      difficultyLevel: difficultyLevel as string,
      isActive: isActive ? isActive === 'true' : undefined
    };
    
    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
    );
    
    const paths = await storage.getLearningPaths(Object.keys(filters).length > 0 ? filters : undefined);
    res.json(paths);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({ error: 'Failed to fetch sacred learning paths' });
  }
});

// Get learning paths by house
router.get('/paths/house/:houseId', async (req, res) => {
  try {
    const paths = await storage.getLearningPathsByHouse(req.params.houseId);
    res.json(paths);
  } catch (error) {
    console.error('Error fetching house learning paths:', error);
    res.status(500).json({ error: 'Failed to fetch house-specific paths' });
  }
});

// Get specific learning path
router.get('/paths/:id', async (req, res) => {
  try {
    const path = await storage.getLearningPath(req.params.id);
    if (!path) {
      return res.status(404).json({ error: 'Sacred path not found in the cosmic archives' });
    }
    res.json(path);
  } catch (error) {
    console.error('Error fetching learning path:', error);
    res.status(500).json({ error: 'Failed to retrieve sacred path' });
  }
});

// Create new learning path (admin only)
router.post('/paths', isAuthenticated, async (req: any, res) => {
  try {
    const validatedData = insertLearningPathSchema.parse(req.body);
    const path = await storage.createLearningPath(validatedData);
    res.status(201).json(path);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid path data', details: error.errors });
    }
    console.error('Error creating learning path:', error);
    res.status(500).json({ error: 'Failed to forge new sacred path' });
  }
});

// Update learning path (admin only)
router.patch('/paths/:id', isAuthenticated, async (req: any, res) => {
  try {
    const updateData = insertLearningPathSchema.partial().parse(req.body);
    const path = await storage.updateLearningPath(req.params.id, updateData);
    if (!path) {
      return res.status(404).json({ error: 'Sacred path not found' });
    }
    res.json(path);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid path data', details: error.errors });
    }
    console.error('Error updating learning path:', error);
    res.status(500).json({ error: 'Failed to modify sacred path' });
  }
});

// ========================================================================================
// SACRED LESSONS ROUTES
// ========================================================================================

// Get all sacred lessons with filtering
router.get('/lessons', async (req, res) => {
  try {
    const { houseId, pathId, lessonType, difficultyLevel, isActive } = req.query;
    const filters = {
      houseId: houseId as string,
      pathId: pathId as string,
      lessonType: lessonType as string,
      difficultyLevel: difficultyLevel as string,
      isActive: isActive ? isActive === 'true' : undefined
    };
    
    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
    );
    
    const lessons = await storage.getSacredLessons(Object.keys(filters).length > 0 ? filters : undefined);
    res.json(lessons);
  } catch (error) {
    console.error('Error fetching sacred lessons:', error);
    res.status(500).json({ error: 'Failed to retrieve sacred wisdom' });
  }
});

// Get lessons by learning path
router.get('/lessons/path/:pathId', async (req, res) => {
  try {
    const lessons = await storage.getLessonsByPath(req.params.pathId);
    res.json(lessons);
  } catch (error) {
    console.error('Error fetching path lessons:', error);
    res.status(500).json({ error: 'Failed to retrieve path lessons' });
  }
});

// Get lessons by house
router.get('/lessons/house/:houseId', async (req, res) => {
  try {
    const lessons = await storage.getLessonsByHouse(req.params.houseId);
    res.json(lessons);
  } catch (error) {
    console.error('Error fetching house lessons:', error);
    res.status(500).json({ error: 'Failed to retrieve house wisdom' });
  }
});

// Get specific sacred lesson
router.get('/lessons/:id', async (req, res) => {
  try {
    const lesson = await storage.getSacredLesson(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: 'Sacred lesson has vanished from the ethereal plane' });
    }
    res.json(lesson);
  } catch (error) {
    console.error('Error fetching sacred lesson:', error);
    res.status(500).json({ error: 'Failed to retrieve sacred lesson' });
  }
});

// Search lessons
router.get('/lessons/search/:searchTerm', async (req, res) => {
  try {
    const { houseId, difficultyLevel } = req.query;
    const filters = {
      houseId: houseId as string,
      difficultyLevel: difficultyLevel as string
    };
    
    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
    );
    
    const lessons = await storage.searchLessons(
      req.params.searchTerm, 
      Object.keys(filters).length > 0 ? filters : undefined
    );
    res.json(lessons);
  } catch (error) {
    console.error('Error searching lessons:', error);
    res.status(500).json({ error: 'The cosmic search failed' });
  }
});

// Start a sacred lesson for user
router.post('/lessons/:id/start', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const progress = await learningService.startLesson(userId, req.params.id);
    res.status(201).json(progress);
  } catch (error) {
    console.error('Error starting lesson:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to begin sacred lesson' });
  }
});

// Complete a sacred lesson
router.post('/lessons/:id/complete', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { score, timeSpent } = req.body;
    
    if (typeof score !== 'number' || typeof timeSpent !== 'number') {
      return res.status(400).json({ error: 'Score and timeSpent must be provided as numbers' });
    }
    
    const progress = await learningService.completeLesson(userId, req.params.id, score, timeSpent);
    res.json(progress);
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to complete sacred lesson' });
  }
});

// Update lesson progress
router.patch('/lessons/:id/progress', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const progressData = req.body;
    
    const progress = await storage.updateLessonProgress(userId, req.params.id, progressData);
    res.json(progress);
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    res.status(500).json({ error: 'Failed to update sacred progress' });
  }
});

// ========================================================================================
// MYSTICAL SKILLS ROUTES
// ========================================================================================

// Get all mystical skills with filtering
router.get('/skills', async (req, res) => {
  try {
    const { houseId, skillCategory, tier, rarityLevel, isActive } = req.query;
    const filters = {
      houseId: houseId as string,
      skillCategory: skillCategory as string,
      tier: tier as string,
      rarityLevel: rarityLevel as string,
      isActive: isActive ? isActive === 'true' : undefined
    };
    
    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
    );
    
    const skills = await storage.getMysticalSkills(Object.keys(filters).length > 0 ? filters : undefined);
    res.json(skills);
  } catch (error) {
    console.error('Error fetching mystical skills:', error);
    res.status(500).json({ error: 'Failed to retrieve mystical abilities' });
  }
});

// Get skills by house
router.get('/skills/house/:houseId', async (req, res) => {
  try {
    const skills = await storage.getSkillsByHouse(req.params.houseId);
    res.json(skills);
  } catch (error) {
    console.error('Error fetching house skills:', error);
    res.status(500).json({ error: 'Failed to retrieve house abilities' });
  }
});

// Get skills by category
router.get('/skills/category/:category', async (req, res) => {
  try {
    const skills = await storage.getSkillsByCategory(req.params.category);
    res.json(skills);
  } catch (error) {
    console.error('Error fetching category skills:', error);
    res.status(500).json({ error: 'Failed to retrieve category abilities' });
  }
});

// Get skill tree for house
router.get('/skills/tree/:houseId?', async (req, res) => {
  try {
    const skillTree = await storage.getSkillTree(req.params.houseId);
    res.json(skillTree);
  } catch (error) {
    console.error('Error fetching skill tree:', error);
    res.status(500).json({ error: 'Failed to retrieve mystical skill tree' });
  }
});

// Get specific mystical skill
router.get('/skills/:id', async (req, res) => {
  try {
    const skill = await storage.getMysticalSkill(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Mystical skill has transcended to higher realms' });
    }
    res.json(skill);
  } catch (error) {
    console.error('Error fetching mystical skill:', error);
    res.status(500).json({ error: 'Failed to retrieve mystical skill' });
  }
});

// Check skill unlock eligibility
router.get('/skills/:id/eligibility', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const eligibility = await storage.checkSkillUnlockEligibility(userId, req.params.id);
    res.json(eligibility);
  } catch (error) {
    console.error('Error checking skill eligibility:', error);
    res.status(500).json({ error: 'Failed to divine eligibility' });
  }
});

// Unlock a mystical skill
router.post('/skills/:id/unlock', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { unlockMethod } = req.body;
    
    if (!unlockMethod) {
      return res.status(400).json({ error: 'Unlock method must be specified' });
    }
    
    const unlock = await learningService.unlockSkill(userId, req.params.id, unlockMethod);
    res.status(201).json(unlock);
  } catch (error) {
    console.error('Error unlocking skill:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to awaken mystical ability' });
  }
});

// ========================================================================================
// USER PROGRESS ROUTES
// ========================================================================================

// Get user's lesson progress
router.get('/progress/lessons', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { pathId, status, lessonId } = req.query;
    const filters = {
      pathId: pathId as string,
      status: status as string,
      lessonId: lessonId as string
    };
    
    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
    );
    
    const progress = await storage.getUserLessonProgresses(
      userId, 
      Object.keys(filters).length > 0 ? filters : undefined
    );
    res.json(progress);
  } catch (error) {
    console.error('Error fetching user lesson progress:', error);
    res.status(500).json({ error: 'Failed to retrieve sacred progress' });
  }
});

// Get user's skill unlocks
router.get('/progress/skills', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { skillId, masteryLevel } = req.query;
    const filters = {
      skillId: skillId as string,
      masteryLevel: masteryLevel ? parseInt(masteryLevel as string) : undefined
    };
    
    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
    );
    
    const unlocks = await storage.getUserSkillUnlocks(
      userId, 
      Object.keys(filters).length > 0 ? filters : undefined
    );
    res.json(unlocks);
  } catch (error) {
    console.error('Error fetching user skill unlocks:', error);
    res.status(500).json({ error: 'Failed to retrieve mystical abilities' });
  }
});

// Get user's skill bonuses
router.get('/progress/bonuses', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const bonuses = await storage.getUserSkillBonuses(userId);
    res.json(bonuses);
  } catch (error) {
    console.error('Error fetching user skill bonuses:', error);
    res.status(500).json({ error: 'Failed to retrieve mystical bonuses' });
  }
});

// ========================================================================================
// TRIALS OF MASTERY ROUTES
// ========================================================================================

// Get all trials of mastery
router.get('/trials', async (req, res) => {
  try {
    const { houseId, trialType, difficultyLevel, isActive } = req.query;
    const filters = {
      houseId: houseId as string,
      trialType: trialType as string,
      difficultyLevel: difficultyLevel as string,
      isActive: isActive ? isActive === 'true' : undefined
    };
    
    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
    );
    
    const trials = await storage.getTrialsOfMastery(Object.keys(filters).length > 0 ? filters : undefined);
    res.json(trials);
  } catch (error) {
    console.error('Error fetching trials of mastery:', error);
    res.status(500).json({ error: 'Failed to retrieve sacred trials' });
  }
});

// Get trials by house
router.get('/trials/house/:houseId', async (req, res) => {
  try {
    const trials = await storage.getTrialsByHouse(req.params.houseId);
    res.json(trials);
  } catch (error) {
    console.error('Error fetching house trials:', error);
    res.status(500).json({ error: 'Failed to retrieve house trials' });
  }
});

// Get specific trial
router.get('/trials/:id', async (req, res) => {
  try {
    const trial = await storage.getTrialOfMastery(req.params.id);
    if (!trial) {
      return res.status(404).json({ error: 'Sacred trial has been lost to the cosmic winds' });
    }
    res.json(trial);
  } catch (error) {
    console.error('Error fetching trial:', error);
    res.status(500).json({ error: 'Failed to retrieve sacred trial' });
  }
});

// Check trial eligibility
router.get('/trials/:id/eligibility', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const eligibility = await storage.checkTrialEligibility(userId, req.params.id);
    res.json(eligibility);
  } catch (error) {
    console.error('Error checking trial eligibility:', error);
    res.status(500).json({ error: 'Failed to divine trial readiness' });
  }
});

// Start a trial
router.post('/trials/:id/start', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const attempt = await learningService.startTrial(userId, req.params.id);
    res.status(201).json(attempt);
  } catch (error) {
    console.error('Error starting trial:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to commence sacred trial' });
  }
});

// Get user's trial attempts
router.get('/trials/attempts', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { trialId, status, passed } = req.query;
    const filters = {
      trialId: trialId as string,
      status: status as string,
      passed: passed ? passed === 'true' : undefined
    };
    
    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
    );
    
    const attempts = await storage.getUserTrialAttempts(
      userId, 
      Object.keys(filters).length > 0 ? filters : undefined
    );
    res.json(attempts);
  } catch (error) {
    console.error('Error fetching trial attempts:', error);
    res.status(500).json({ error: 'Failed to retrieve trial history' });
  }
});

// ========================================================================================
// DIVINE CERTIFICATIONS ROUTES
// ========================================================================================

// Get all divine certifications
router.get('/certifications', async (req, res) => {
  try {
    const { houseId, certificationLevel, category, rarityLevel, isActive } = req.query;
    const filters = {
      houseId: houseId as string,
      certificationLevel: certificationLevel as string,
      category: category as string,
      rarityLevel: rarityLevel as string,
      isActive: isActive ? isActive === 'true' : undefined
    };
    
    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
    );
    
    const certs = await storage.getDivineCertifications(Object.keys(filters).length > 0 ? filters : undefined);
    res.json(certs);
  } catch (error) {
    console.error('Error fetching divine certifications:', error);
    res.status(500).json({ error: 'Failed to retrieve divine blessings' });
  }
});

// Get certifications by house
router.get('/certifications/house/:houseId', async (req, res) => {
  try {
    const certs = await storage.getCertificationsByHouse(req.params.houseId);
    res.json(certs);
  } catch (error) {
    console.error('Error fetching house certifications:', error);
    res.status(500).json({ error: 'Failed to retrieve house blessings' });
  }
});

// Get user's certifications
router.get('/certifications/user', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { certificationId, status, displayInProfile } = req.query;
    const filters = {
      certificationId: certificationId as string,
      status: status as string,
      displayInProfile: displayInProfile ? displayInProfile === 'true' : undefined
    };
    
    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
    );
    
    const certs = await storage.getUserCertifications(
      userId, 
      Object.keys(filters).length > 0 ? filters : undefined
    );
    res.json(certs);
  } catch (error) {
    console.error('Error fetching user certifications:', error);
    res.status(500).json({ error: 'Failed to retrieve personal blessings' });
  }
});

// Check certification eligibility
router.get('/certifications/:id/eligibility', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const eligibility = await storage.checkCertificationEligibility(userId, req.params.id);
    res.json(eligibility);
  } catch (error) {
    console.error('Error checking certification eligibility:', error);
    res.status(500).json({ error: 'Failed to divine certification worthiness' });
  }
});

// ========================================================================================
// LEARNING ANALYTICS ROUTES
// ========================================================================================

// Get user's learning analytics
router.get('/analytics/user', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const analytics = await storage.getLearningAnalytics(userId);
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching learning analytics:', error);
    res.status(500).json({ error: 'Failed to retrieve cosmic insights' });
  }
});

// Get user's learning dashboard
router.get('/dashboard', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const dashboard = await storage.getUserLearningDashboard(userId);
    res.json(dashboard);
  } catch (error) {
    console.error('Error fetching learning dashboard:', error);
    res.status(500).json({ error: 'Failed to retrieve sacred dashboard' });
  }
});

// Get learning recommendations
router.get('/recommendations', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const recommendations = await learningService.generateLearningRecommendations(userId);
    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to divine cosmic guidance' });
  }
});

// Recalculate learning analytics
router.post('/analytics/recalculate', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const analytics = await learningService.updateLearningAnalytics(userId);
    res.json(analytics);
  } catch (error) {
    console.error('Error recalculating analytics:', error);
    res.status(500).json({ error: 'Failed to recalculate cosmic insights' });
  }
});

// ========================================================================================
// HOUSE-SPECIFIC LEARNING STATS
// ========================================================================================

// Get house learning statistics
router.get('/stats/house/:houseId', async (req, res) => {
  try {
    const stats = await storage.getHouseLearningStats(req.params.houseId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching house learning stats:', error);
    res.status(500).json({ error: 'Failed to retrieve house wisdom metrics' });
  }
});

// Get global learning statistics
router.get('/stats/global', async (req, res) => {
  try {
    const stats = await storage.getGlobalLearningStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching global learning stats:', error);
    res.status(500).json({ error: 'Failed to retrieve cosmic learning metrics' });
  }
});

// ========================================================================================
// ADMINISTRATIVE ROUTES (Future Implementation)
// ========================================================================================

// Initialize learning system with default content
router.post('/admin/initialize', isAuthenticated, async (req: any, res) => {
  try {
    // This would be protected by admin middleware in a full implementation
    const results = {
      paths: await learningService.createHouseLearningPaths(),
      skills: await learningService.createMysticalSkills(),
      trials: await learningService.createTrialsOfMastery(),
      certifications: await learningService.createDivineCertifications()
    };
    
    res.json({
      message: 'Learning system initialized with sacred wisdom',
      results: {
        pathsCreated: results.paths.length,
        skillsCreated: results.skills.length,
        trialsCreated: results.trials.length,
        certificationsCreated: results.certifications.length
      }
    });
  } catch (error) {
    console.error('Error initializing learning system:', error);
    res.status(500).json({ error: 'Failed to initialize sacred learning system' });
  }
});

export default router;