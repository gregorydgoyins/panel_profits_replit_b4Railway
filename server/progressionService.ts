import type { DatabaseStorage } from './databaseStorage';
import type {
  UserComicCollection,
  InsertUserComicCollection,
  UserProgressionStatus,
  InsertUserProgressionStatus,
  UserHouseProgression,
  InsertUserHouseProgression,
  TradingToolUnlock,
  InsertTradingToolUnlock,
  ComicCollectionAchievement,
  UserAchievement,
  InsertUserAchievement,
  CollectionChallenge,
  UserChallengeParticipation,
  InsertUserChallengeParticipation,
  ComicIssueVariant,
  HouseProgressionPath
} from '@shared/schema';

// ============================================================================
// PROGRESSION TRACKING SERVICE - COMIC COLLECTION MECHANICS
// ============================================================================

export class ProgressionService {
  constructor(private storage: DatabaseStorage) {}

  // ===== COMIC COLLECTION TRACKING =====

  async addComicToCollection(
    userId: string, 
    variantId: string, 
    collectionData: Partial<InsertUserComicCollection>
  ): Promise<UserComicCollection> {
    try {
      // Get the variant details to understand what's being added
      const variant = await this.storage.getComicIssueVariant(variantId);
      if (!variant) {
        throw new Error('Comic variant not found');
      }

      // Check if user already owns this variant
      const existingCollection = await this.storage.getUserComicCollectionByVariant(userId, variantId);
      
      let collection: UserComicCollection;
      
      if (existingCollection) {
        // Update quantity if already owned
        collection = await this.storage.updateUserComicCollection(existingCollection.id, {
          quantity: (existingCollection.quantity || 1) + (collectionData.quantity || 1),
          ...collectionData
        });
      } else {
        // Add new item to collection
        collection = await this.storage.createUserComicCollection({
          userId,
          variantId,
          isFirstOwned: true,
          ...collectionData
        });

        // Track that this is a first-time ownership for progression calculations
        await this.updateProgressionAfterNewAcquisition(userId, variant, collection);
      }

      // Update overall progression status
      await this.recalculateUserProgression(userId);

      // Check for new achievements
      await this.checkAndAwardAchievements(userId);

      // Check for trading tool unlocks
      await this.checkAndUnlockTradingTools(userId);

      return collection;
    } catch (error) {
      console.error('Error adding comic to collection:', error);
      throw error;
    }
  }

  // ===== PROGRESSION CALCULATION =====

  async recalculateUserProgression(userId: string): Promise<UserProgressionStatus> {
    try {
      // Get all user's collections
      const collections = await this.storage.getUserComicCollections(userId);
      
      // Calculate collection statistics
      const stats = await this.calculateCollectionStats(collections);
      
      // Determine progression tier based on collection
      const progressionTier = this.calculateProgressionTier(stats);
      
      // Get progression title
      const progressionTitle = this.getProgressionTitle(progressionTier, stats);
      
      // Get existing progression or create new
      let progressionStatus = await this.storage.getUserProgressionStatus(userId);
      
      const updateData: Partial<InsertUserProgressionStatus> = {
        overallProgressionTier: progressionTier,
        progressionTitle,
        totalCollectionValue: stats.totalValue,
        totalIssuesOwned: stats.totalIssues,
        totalVariantsOwned: stats.totalVariants,
        standardCoversOwned: stats.standardCovers,
        variantCoversOwned: stats.variantCovers,
        rareVariantsOwned: stats.rareVariants,
        ultraRareVariantsOwned: stats.ultraRareVariants,
        legendaryVariantsOwned: stats.legendaryVariants,
        firstAppearancesOwned: stats.firstAppearances,
        deathIssuesOwned: stats.deathIssues,
        resurrectionIssuesOwned: stats.resurrectionIssues,
        keyStorylineIssuesOwned: stats.keyStorylineIssues,
        crossoverIssuesOwned: stats.crossoverIssues,
        creatorMilestonesCompleted: stats.creatorMilestones,
        iconicSplashPagesOwned: stats.iconicSplashPages,
        tradingToolsUnlocked: stats.tradingToolsUnlocked,
        maxTradingTier: progressionTier,
        lastProgressionUpdate: new Date()
      };

      if (progressionStatus) {
        progressionStatus = await this.storage.updateUserProgressionStatus(progressionStatus.id, updateData);
      } else {
        progressionStatus = await this.storage.createUserProgressionStatus({
          userId,
          ...updateData
        });
      }

      return progressionStatus;
    } catch (error) {
      console.error('Error recalculating user progression:', error);
      throw error;
    }
  }

  private async calculateCollectionStats(collections: UserComicCollection[]) {
    const stats = {
      totalValue: 0,
      totalIssues: 0,
      totalVariants: 0,
      standardCovers: 0,
      variantCovers: 0,
      rareVariants: 0,
      ultraRareVariants: 0,
      legendaryVariants: 0,
      firstAppearances: 0,
      deathIssues: 0,
      resurrectionIssues: 0,
      keyStorylineIssues: 0,
      crossoverIssues: 0,
      creatorMilestones: 0,
      iconicSplashPages: 0,
      tradingToolsUnlocked: [] as string[]
    };

    for (const collection of collections) {
      if (!collection.contributesToProgression) continue;

      // Get variant details
      const variant = await this.storage.getComicIssueVariant(collection.variantId);
      if (!variant) continue;

      const quantity = collection.quantity || 1;
      stats.totalIssues += quantity;
      stats.totalValue += Number(variant.baseMarketValue) * quantity;

      // Count by cover type
      switch (variant.coverType) {
        case 'standard':
          stats.standardCovers += quantity;
          break;
        case 'variant':
          stats.variantCovers += quantity;
          break;
        case 'rare_variant':
          stats.rareVariants += quantity;
          break;
        case 'ultra_rare':
          stats.ultraRareVariants += quantity;
          break;
        case 'legendary':
          stats.legendaryVariants += quantity;
          break;
      }

      // Count by issue type
      switch (variant.issueType) {
        case 'first_appearance':
          stats.firstAppearances += quantity;
          break;
        case 'death':
          stats.deathIssues += quantity;
          break;
        case 'resurrection':
          stats.resurrectionIssues += quantity;
          break;
        case 'key_storyline':
          stats.keyStorylineIssues += quantity;
          break;
        case 'crossover':
          stats.crossoverIssues += quantity;
          break;
      }

      // Add trading tools unlocked by this variant
      if (variant.tradingToolsUnlocked) {
        stats.tradingToolsUnlocked.push(...variant.tradingToolsUnlocked);
      }
    }

    // Remove duplicate trading tools
    stats.tradingToolsUnlocked = Array.from(new Set(stats.tradingToolsUnlocked));
    stats.totalVariants = collections.length;

    return stats;
  }

  private calculateProgressionTier(stats: any): number {
    // Tier 1 - Rookie Collector: Basic collection
    if (stats.totalIssues < 10) return 1;
    
    // Tier 2 - Seasoned Reader: Has variants
    if (stats.variantCovers < 5 && stats.totalValue < 1000) return 2;
    
    // Tier 3 - Serious Collector: Has rare variants
    if (stats.rareVariants < 3 && stats.totalValue < 5000) return 3;
    
    // Tier 4 - Comic Connoisseur: Has ultra-rare variants
    if (stats.ultraRareVariants < 2 && stats.totalValue < 25000) return 4;
    
    // Tier 5 - Legendary Trader: Has legendary variants
    return 5;
  }

  private getProgressionTitle(tier: number, stats: any): string {
    const titles = {
      1: "Rookie Collector",
      2: "Seasoned Reader", 
      3: "Serious Collector",
      4: "Comic Connoisseur",
      5: "Legendary Trader"
    };
    return titles[tier as keyof typeof titles] || "Rookie Collector";
  }

  // ===== HOUSE PROGRESSION =====

  async updateHouseProgression(userId: string, houseId: string, experienceGained: number): Promise<UserHouseProgression> {
    try {
      let houseProgression = await this.storage.getUserHouseProgression(userId, houseId);
      
      if (!houseProgression) {
        // Create new house progression
        houseProgression = await this.storage.createUserHouseProgression({
          userId,
          houseId,
          experiencePoints: experienceGained,
          nextLevelRequiredXP: 100
        });
      } else {
        // Update existing progression
        const newXP = houseProgression.experiencePoints + experienceGained;
        const currentLevel = houseProgression.currentLevel;
        let newLevel = currentLevel;
        let remainingXP = newXP;
        
        // Check for level ups
        while (remainingXP >= houseProgression.nextLevelRequiredXP) {
          remainingXP -= houseProgression.nextLevelRequiredXP;
          newLevel++;
          
          // Calculate next level XP requirement (increases by 50% each level)
          const nextLevelXP = Math.floor(100 * Math.pow(1.5, newLevel - 1));
          
          houseProgression = await this.storage.updateUserHouseProgression(houseProgression.id, {
            currentLevel: newLevel,
            experiencePoints: remainingXP,
            nextLevelRequiredXP: nextLevelXP,
            progressionPercentage: Number(((remainingXP / nextLevelXP) * 100).toFixed(2)),
            levelsUnlocked: newLevel,
            totalXPEarned: houseProgression.totalXPEarned + experienceGained,
            lastLevelAchievedAt: newLevel > currentLevel ? new Date() : houseProgression.lastLevelAchievedAt,
            lastProgressionActivity: new Date()
          });

          // Award level-up achievements and unlock house-specific bonuses
          if (newLevel > currentLevel) {
            await this.awardLevelUpRewards(userId, houseId, newLevel);
          }
        }

        if (newLevel === currentLevel) {
          // Update XP without level change
          houseProgression = await this.storage.updateUserHouseProgression(houseProgression.id, {
            experiencePoints: remainingXP,
            progressionPercentage: Number(((remainingXP / houseProgression.nextLevelRequiredXP) * 100).toFixed(2)),
            totalXPEarned: houseProgression.totalXPEarned + experienceGained,
            lastProgressionActivity: new Date()
          });
        }
      }

      return houseProgression;
    } catch (error) {
      console.error('Error updating house progression:', error);
      throw error;
    }
  }

  // ===== ACHIEVEMENT SYSTEM =====

  async checkAndAwardAchievements(userId: string): Promise<UserAchievement[]> {
    try {
      const newAchievements: UserAchievement[] = [];
      
      // Get user's current collections and progression
      const collections = await this.storage.getUserComicCollections(userId);
      const progressionStatus = await this.storage.getUserProgressionStatus(userId);
      const existingAchievements = await this.storage.getUserAchievements(userId);
      
      // Get all available comic collection achievements
      const availableAchievements = await this.storage.getComicCollectionAchievements();
      
      for (const achievement of availableAchievements) {
        // Skip if user already has this achievement
        if (existingAchievements.some(ua => ua.achievementId === achievement.achievementId)) {
          continue;
        }

        // Check if user meets the requirements for this achievement
        const meetsRequirements = await this.checkAchievementRequirements(
          userId, 
          achievement, 
          collections, 
          progressionStatus
        );

        if (meetsRequirements) {
          // Award the achievement
          const userAchievement = await this.storage.createUserAchievement({
            userId,
            achievementId: achievement.achievementId,
            title: achievement.title,
            description: achievement.description,
            category: 'comic_collection',
            iconName: achievement.badgeIcon || 'trophy',
            badgeColor: achievement.badgeColor || 'gold',
            tier: achievement.tier,
            points: achievement.achievementPoints || 0,
            rarity: achievement.rarity,
            criteria: achievement.specificRequirements || {},
            progress: { completed: true, completedAt: new Date() }
          });

          newAchievements.push(userAchievement);

          // Apply achievement rewards
          await this.applyAchievementRewards(userId, achievement);
        }
      }

      return newAchievements;
    } catch (error) {
      console.error('Error checking and awarding achievements:', error);
      throw error;
    }
  }

  private async checkAchievementRequirements(
    userId: string,
    achievement: ComicCollectionAchievement,
    collections: UserComicCollection[],
    progressionStatus: UserProgressionStatus | null
  ): Promise<boolean> {
    if (!progressionStatus) return false;

    switch (achievement.requirementType) {
      case 'count':
        return this.checkCountRequirement(achievement, collections, progressionStatus);
      case 'value':
        return this.checkValueRequirement(achievement, progressionStatus);
      case 'rarity':
        return this.checkRarityRequirement(achievement, collections);
      case 'specific_issues':
        return await this.checkSpecificIssuesRequirement(achievement, collections);
      case 'storyline':
        return this.checkStorylineRequirement(achievement, collections);
      default:
        return false;
    }
  }

  private checkCountRequirement(
    achievement: ComicCollectionAchievement,
    collections: UserComicCollection[],
    progressionStatus: UserProgressionStatus
  ): boolean {
    if (!achievement.requiredCount) return false;

    switch (achievement.category) {
      case 'variant_collection':
        return progressionStatus.totalVariantsOwned >= achievement.requiredCount;
      case 'issue_type':
        // Check specific issue type counts based on achievement ID
        if (achievement.achievementId.includes('first_appearance')) {
          return progressionStatus.firstAppearancesOwned >= achievement.requiredCount;
        }
        if (achievement.achievementId.includes('death')) {
          return progressionStatus.deathIssuesOwned >= achievement.requiredCount;
        }
        if (achievement.achievementId.includes('resurrection')) {
          return progressionStatus.resurrectionIssuesOwned >= achievement.requiredCount;
        }
        return false;
      default:
        return progressionStatus.totalIssuesOwned >= achievement.requiredCount;
    }
  }

  private checkValueRequirement(
    achievement: ComicCollectionAchievement,
    progressionStatus: UserProgressionStatus
  ): boolean {
    if (!achievement.requiredValue) return false;
    return Number(progressionStatus.totalCollectionValue) >= Number(achievement.requiredValue);
  }

  private checkRarityRequirement(
    achievement: ComicCollectionAchievement,
    collections: UserComicCollection[]
  ): boolean {
    if (!achievement.requiredRarity) return false;
    
    const rarityMap = {
      'standard': 'standardCoversOwned',
      'variant': 'variantCoversOwned',
      'rare_variant': 'rareVariantsOwned',
      'ultra_rare': 'ultraRareVariantsOwned',
      'legendary': 'legendaryVariantsOwned'
    };

    // This would need the progression status to check rarity counts
    return true; // Simplified for now
  }

  private async checkSpecificIssuesRequirement(
    achievement: ComicCollectionAchievement,
    collections: UserComicCollection[]
  ): Promise<boolean> {
    if (!achievement.specificRequirements) return false;
    
    const requirements = achievement.specificRequirements as any;
    if (!requirements.requiredVariants) return false;

    const ownedVariantIds = collections.map(c => c.variantId);
    return requirements.requiredVariants.every((variantId: string) => 
      ownedVariantIds.includes(variantId)
    );
  }

  private checkStorylineRequirement(
    achievement: ComicCollectionAchievement,
    collections: UserComicCollection[]
  ): boolean {
    // Implementation for storyline completion checks
    return true; // Simplified for now
  }

  // ===== TRADING TOOL UNLOCKS =====

  async checkAndUnlockTradingTools(userId: string): Promise<TradingToolUnlock[]> {
    try {
      const progressionStatus = await this.storage.getUserProgressionStatus(userId);
      if (!progressionStatus) return [];

      const unlockedTools: TradingToolUnlock[] = [];
      const existingUnlocks = await this.storage.getTradingToolUnlocks(userId);
      
      // Define trading tool unlock requirements
      const toolRequirements = [
        {
          toolName: 'technical_analysis',
          toolCategory: 'advanced',
          requiredProgressionTier: 2,
          requiredVariantRarity: 'variant',
          toolDescription: 'Advanced charting and technical analysis tools',
          toolBenefits: ['Price trend analysis', 'Volume indicators', 'Support/resistance levels']
        },
        {
          toolName: 'options_trading',
          toolCategory: 'expert',
          requiredProgressionTier: 3,
          requiredVariantRarity: 'rare_variant',
          toolDescription: 'Options trading capabilities for advanced strategies',
          toolBenefits: ['Call/put options', 'Risk hedging', 'Advanced derivatives']
        },
        {
          toolName: 'margin_trading',
          toolCategory: 'expert',
          requiredProgressionTier: 4,
          requiredVariantRarity: 'ultra_rare',
          toolDescription: 'Margin trading for amplified positions',
          toolBenefits: ['Leveraged trading', 'Short selling', 'Advanced portfolio management']
        },
        {
          toolName: 'house_champion_bonuses',
          toolCategory: 'legendary',
          requiredProgressionTier: 5,
          requiredVariantRarity: 'legendary',
          toolDescription: 'Elite house champion trading bonuses',
          toolBenefits: ['Cross-house arbitrage', 'Cosmic trading access', 'Ultimate market insights']
        }
      ];

      for (const requirement of toolRequirements) {
        // Skip if already unlocked
        if (existingUnlocks.some(unlock => unlock.toolName === requirement.toolName && unlock.isUnlocked)) {
          continue;
        }

        // Check if user meets the requirements
        const meetsRequirements = progressionStatus.overallProgressionTier >= requirement.requiredProgressionTier &&
          this.hasRequiredVariantRarity(progressionStatus, requirement.requiredVariantRarity);

        if (meetsRequirements) {
          // Create or update the unlock
          let unlock = existingUnlocks.find(u => u.toolName === requirement.toolName);
          
          if (unlock) {
            unlock = await this.storage.updateTradingToolUnlock(unlock.id, {
              isUnlocked: true,
              unlockedAt: new Date(),
              unlockedBy: `progression_tier_${requirement.requiredProgressionTier}`
            });
          } else {
            unlock = await this.storage.createTradingToolUnlock({
              userId,
              ...requirement,
              isUnlocked: true,
              unlockedAt: new Date(),
              unlockedBy: `progression_tier_${requirement.requiredProgressionTier}`
            });
          }

          unlockedTools.push(unlock);
        }
      }

      return unlockedTools;
    } catch (error) {
      console.error('Error checking and unlocking trading tools:', error);
      throw error;
    }
  }

  private hasRequiredVariantRarity(progressionStatus: UserProgressionStatus, requiredRarity: string): boolean {
    switch (requiredRarity) {
      case 'standard':
        return progressionStatus.standardCoversOwned > 0;
      case 'variant':
        return progressionStatus.variantCoversOwned > 0;
      case 'rare_variant':
        return progressionStatus.rareVariantsOwned > 0;
      case 'ultra_rare':
        return progressionStatus.ultraRareVariantsOwned > 0;
      case 'legendary':
        return progressionStatus.legendaryVariantsOwned > 0;
      default:
        return false;
    }
  }

  // ===== COLLECTION CHALLENGES =====

  async createCollectionChallenge(challengeData: Partial<CollectionChallenge>): Promise<CollectionChallenge> {
    try {
      return await this.storage.createCollectionChallenge({
        challengeTitle: challengeData.challengeTitle || 'New Collection Challenge',
        challengeDescription: challengeData.challengeDescription || 'Complete this collection challenge',
        challengeType: challengeData.challengeType || 'weekly',
        startDate: challengeData.startDate || new Date(),
        endDate: challengeData.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        challengeGoal: challengeData.challengeGoal || { type: 'collect_variants', target: 5 },
        targetMetric: challengeData.targetMetric || 'variants_collected',
        targetValue: challengeData.targetValue || 5,
        completionRewards: challengeData.completionRewards || { xp: 100, achievementPoints: 50 },
        ...challengeData
      });
    } catch (error) {
      console.error('Error creating collection challenge:', error);
      throw error;
    }
  }

  async participateInChallenge(userId: string, challengeId: string): Promise<UserChallengeParticipation> {
    try {
      // Check if user is already participating
      const existing = await this.storage.getUserChallengeParticipation(userId, challengeId);
      if (existing) {
        return existing;
      }

      // Create new participation record
      return await this.storage.createUserChallengeParticipation({
        userId,
        challengeId,
        participationStatus: 'active',
        currentProgress: 0,
        progressPercentage: 0
      });
    } catch (error) {
      console.error('Error participating in challenge:', error);
      throw error;
    }
  }

  // ===== HELPER METHODS =====

  private async updateProgressionAfterNewAcquisition(
    userId: string, 
    variant: ComicIssueVariant, 
    collection: UserComicCollection
  ): Promise<void> {
    // Award XP to relevant houses based on variant's house relevance
    if (variant.houseRelevance) {
      const houseRelevance = variant.houseRelevance as Record<string, number>;
      for (const [houseId, relevance] of Object.entries(houseRelevance)) {
        if (relevance > 0) {
          const xpGained = Math.floor(relevance * 10 * Number(variant.progressionMultiplier || 1));
          await this.updateHouseProgression(userId, houseId, xpGained);
        }
      }
    }

    // Award XP to primary house if specified
    if (variant.primaryHouse) {
      const baseXP = variant.progressionTier * 5;
      const multiplier = Number(variant.progressionMultiplier || 1);
      await this.updateHouseProgression(userId, variant.primaryHouse, Math.floor(baseXP * multiplier));
    }
  }

  private async awardLevelUpRewards(userId: string, houseId: string, newLevel: number): Promise<void> {
    try {
      // Get house progression path for this level
      const progressionPath = await this.storage.getHouseProgressionPath(houseId, newLevel);
      if (!progressionPath) return;

      // Award achievement for reaching this level
      const achievementId = `house_${houseId}_level_${newLevel}`;
      const existingAchievement = await this.storage.getUserAchievementByAchievementId(userId, achievementId);
      
      if (!existingAchievement) {
        await this.storage.createUserAchievement({
          userId,
          achievementId,
          title: `${progressionPath.levelTitle} - ${houseId.charAt(0).toUpperCase() + houseId.slice(1)} House`,
          description: `Reached ${progressionPath.levelTitle} level in the ${houseId} house`,
          category: 'house_progression',
          iconName: progressionPath.badgeIcon || 'star',
          badgeColor: progressionPath.badgeColor || 'gold',
          tier: newLevel <= 2 ? 'bronze' : newLevel <= 3 ? 'silver' : 'gold',
          points: newLevel * 50,
          rarity: newLevel >= 4 ? 'legendary' : newLevel >= 3 ? 'epic' : 'rare'
        });
      }

      // Apply trading bonuses and unlock house-specific tools
      if (progressionPath.houseSpecificTools) {
        for (const toolName of progressionPath.houseSpecificTools) {
          const existingUnlock = await this.storage.getTradingToolUnlock(userId, toolName);
          if (!existingUnlock) {
            await this.storage.createTradingToolUnlock({
              userId,
              toolName,
              toolCategory: 'house_specific',
              requiredProgressionTier: newLevel,
              isUnlocked: true,
              unlockedAt: new Date(),
              unlockedBy: `house_${houseId}_level_${newLevel}`,
              toolDescription: `${houseId} house level ${newLevel} tool`,
              toolBenefits: [`${houseId} house specialization benefits`]
            });
          }
        }
      }
    } catch (error) {
      console.error('Error awarding level up rewards:', error);
    }
  }

  private async applyAchievementRewards(userId: string, achievement: ComicCollectionAchievement): Promise<void> {
    try {
      // Unlock trading tools if specified
      if (achievement.tradingToolsUnlocked) {
        for (const toolName of achievement.tradingToolsUnlocked) {
          const existingUnlock = await this.storage.getTradingToolUnlock(userId, toolName);
          if (!existingUnlock) {
            await this.storage.createTradingToolUnlock({
              userId,
              toolName,
              toolCategory: 'achievement_unlocked',
              requiredProgressionTier: 1,
              isUnlocked: true,
              unlockedAt: new Date(),
              unlockedBy: `achievement_${achievement.achievementId}`,
              toolDescription: `Unlocked by ${achievement.title} achievement`,
              toolBenefits: achievement.specialAbilities || []
            });
          }
        }
      }

      // Apply house progression bonuses
      if (achievement.houseProgressionBonus) {
        const bonuses = achievement.houseProgressionBonus as Record<string, number>;
        for (const [houseId, xpBonus] of Object.entries(bonuses)) {
          await this.updateHouseProgression(userId, houseId, xpBonus);
        }
      }
    } catch (error) {
      console.error('Error applying achievement rewards:', error);
    }
  }

  // ===== PUBLIC API METHODS =====

  async getUserProgressionDashboard(userId: string) {
    try {
      const [
        progressionStatus,
        collections,
        achievements,
        houseProgressions,
        tradingUnlocks,
        activeChallenges
      ] = await Promise.all([
        this.storage.getUserProgressionStatus(userId),
        this.storage.getUserComicCollections(userId),
        this.storage.getUserAchievements(userId),
        this.storage.getUserHouseProgressions(userId),
        this.storage.getTradingToolUnlocks(userId),
        this.storage.getActiveChallengesForUser(userId)
      ]);

      return {
        progressionStatus,
        collections,
        achievements,
        houseProgressions,
        tradingUnlocks,
        activeChallenges,
        summary: {
          totalCollectionValue: progressionStatus?.totalCollectionValue || 0,
          progressionTier: progressionStatus?.overallProgressionTier || 1,
          progressionTitle: progressionStatus?.progressionTitle || 'Rookie Collector',
          totalAchievements: achievements.length,
          unlockedTradingTools: tradingUnlocks.filter(t => t.isUnlocked).length,
          activeHouses: houseProgressions.length
        }
      };
    } catch (error) {
      console.error('Error getting user progression dashboard:', error);
      throw error;
    }
  }

  async getProgressionLeaderboard(category: string = 'overall', timeframe: string = 'all_time') {
    try {
      // Implementation for progression leaderboards
      return await this.storage.getProgressionLeaderboard(category, timeframe);
    } catch (error) {
      console.error('Error getting progression leaderboard:', error);
      throw error;
    }
  }
}