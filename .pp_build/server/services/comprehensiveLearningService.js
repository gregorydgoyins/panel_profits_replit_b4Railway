"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.learningService = exports.ComprehensiveLearningService = void 0;
const storage_js_1 = require("../storage.js");
const housesRoutes_js_1 = require("../routes/housesRoutes.js");
/**
 * Comprehensive Learning Service for Panel Profits Mythological Trading RPG
 *
 * Transforms financial education into an immersive mythological quest where
 * initiates discover ancient trading wisdom, unlock powerful abilities, and
 * ascend to become legendary masters of their chosen financial arts.
 */
class ComprehensiveLearningService {
    // ========================================================================================
    // SACRED LEARNING PATH MANAGEMENT
    // ========================================================================================
    /**
     * Creates house-specific learning paths aligned with Seven Houses specializations
     */
    async createHouseLearningPaths() {
        const paths = [];
        for (const [houseId, house] of Object.entries(housesRoutes_js_1.MYTHOLOGICAL_HOUSES)) {
            // Create paths for each difficulty level per house
            const difficultyLevels = ['initiate', 'adept', 'master', 'grandmaster'];
            for (const difficulty of difficultyLevels) {
                const pathData = {
                    name: `${house.name} - ${this.capitalizeDifficulty(difficulty)} Path`,
                    description: this.generatePathDescription(house, difficulty),
                    houseId,
                    specialization: house.specialization,
                    difficultyLevel: difficulty,
                    prerequisites: this.generatePathPrerequisites(houseId, difficulty),
                    estimatedHours: this.calculateEstimatedHours(difficulty),
                    experienceReward: this.calculateExperienceReward(difficulty),
                    karmaReward: this.calculateKarmaReward(difficulty),
                    sacredTitle: this.generateSacredTitle(house, difficulty),
                    mysticalDescription: this.generateMysticalDescription(house, difficulty),
                    pathIcon: house.icon,
                    pathColor: house.colors.primary,
                    lessonSequence: [], // Will be populated when lessons are created
                    unlockConditions: this.generateUnlockConditions(houseId, difficulty),
                    completionRewards: this.generateCompletionRewards(houseId, difficulty),
                    isActive: true,
                    displayOrder: difficultyLevels.indexOf(difficulty),
                };
                const path = await storage_js_1.storage.createLearningPath(pathData);
                paths.push(path);
            }
        }
        return paths;
    }
    /**
     * Creates sacred lessons with immersive RPG elements for each house
     */
    async createSacredLessons(pathId, houseId, difficultyLevel) {
        const house = housesRoutes_js_1.MYTHOLOGICAL_HOUSES[houseId];
        const lessons = [];
        const lessonTemplates = this.generateLessonTemplates(house, difficultyLevel);
        for (const [index, template] of lessonTemplates.entries()) {
            const lessonData = {
                title: template.title,
                description: template.description,
                houseId,
                pathId,
                lessonType: template.type,
                difficultyLevel,
                estimatedMinutes: template.estimatedMinutes,
                experienceReward: template.experienceReward,
                karmaReward: template.karmaReward,
                contentFormat: template.contentFormat,
                contentData: template.contentData,
                mediaUrls: template.mediaUrls,
                interactiveElements: template.interactiveElements,
                prerequisites: template.prerequisites,
                unlockConditions: template.unlockConditions,
                nextLessons: [], // Will be set after all lessons are created
                masteryThreshold: 80.00,
                allowRetakes: true,
                maxAttempts: 3,
                sacredTitle: template.sacredTitle,
                mysticalNarrative: template.mysticalNarrative,
                guidingSpirit: template.guidingSpirit,
                ritualDescription: template.ritualDescription,
                lessonIcon: template.icon,
                atmosphericEffects: template.atmosphericEffects,
                isActive: true,
                publishedAt: new Date(),
            };
            const lesson = await storage_js_1.storage.createSacredLesson(lessonData);
            lessons.push(lesson);
        }
        // Update lesson sequence in path
        const lessonIds = lessons.map(l => l.id);
        await storage_js_1.storage.updateLearningPath(pathId, { lessonSequence: lessonIds });
        // Set next lessons for progression
        for (let i = 0; i < lessons.length - 1; i++) {
            await storage_js_1.storage.updateSacredLesson(lessons[i].id, {
                nextLessons: [lessons[i + 1].id]
            });
        }
        return lessons;
    }
    /**
     * Creates mystical skills that unlock enhanced trading features
     */
    async createMysticalSkills() {
        const skills = [];
        for (const [houseId, house] of Object.entries(housesRoutes_js_1.MYTHOLOGICAL_HOUSES)) {
            const houseSkills = this.generateSkillsForHouse(house, houseId);
            for (const skillTemplate of houseSkills) {
                const skillData = {
                    name: skillTemplate.name,
                    description: skillTemplate.description,
                    houseId,
                    skillCategory: skillTemplate.category,
                    skillType: skillTemplate.type,
                    tier: skillTemplate.tier,
                    tradingPrivileges: skillTemplate.tradingPrivileges,
                    tradingBonuses: skillTemplate.tradingBonuses,
                    interfaceFeatures: skillTemplate.interfaceFeatures,
                    specialAbilities: skillTemplate.specialAbilities,
                    prerequisiteSkills: skillTemplate.prerequisiteSkills,
                    prerequisiteLessons: skillTemplate.prerequisiteLessons,
                    karmaRequirement: skillTemplate.karmaRequirement,
                    tradingPerformanceRequirement: skillTemplate.tradingPerformanceRequirement,
                    houseStandingRequirement: skillTemplate.houseStandingRequirement,
                    experienceCost: skillTemplate.experienceCost,
                    masteryLevels: skillTemplate.masteryLevels,
                    maxMasteryBonus: skillTemplate.maxMasteryBonus,
                    sacredName: skillTemplate.sacredName,
                    mysticalDescription: skillTemplate.mysticalDescription,
                    awakenRitual: skillTemplate.awakenRitual,
                    skillIcon: skillTemplate.icon,
                    skillAura: skillTemplate.aura,
                    rarityLevel: skillTemplate.rarity,
                    parentSkills: skillTemplate.parentSkills,
                    childSkills: skillTemplate.childSkills,
                    skillTreePosition: skillTemplate.treePosition,
                    isActive: true,
                };
                const skill = await storage_js_1.storage.createMysticalSkill(skillData);
                skills.push(skill);
            }
        }
        return skills;
    }
    /**
     * Creates trials of mastery for assessment and certification
     */
    async createTrialsOfMastery() {
        const trials = [];
        for (const [houseId, house] of Object.entries(housesRoutes_js_1.MYTHOLOGICAL_HOUSES)) {
            const trialTemplates = this.generateTrialsForHouse(house, houseId);
            for (const trialTemplate of trialTemplates) {
                const trialData = {
                    name: trialTemplate.name,
                    description: trialTemplate.description,
                    houseId,
                    trialType: trialTemplate.type,
                    difficultyLevel: trialTemplate.difficulty,
                    phases: trialTemplate.phases,
                    timeLimit: trialTemplate.timeLimit,
                    maxAttempts: trialTemplate.maxAttempts,
                    passingScore: trialTemplate.passingScore,
                    perfectScore: 100.00,
                    prerequisites: trialTemplate.prerequisites,
                    experienceReward: trialTemplate.experienceReward,
                    karmaReward: trialTemplate.karmaReward,
                    skillsUnlocked: trialTemplate.skillsUnlocked,
                    tradingPrivilegesGranted: trialTemplate.tradingPrivilegesGranted,
                    certificationsAwarded: trialTemplate.certificationsAwarded,
                    sacredTitle: trialTemplate.sacredTitle,
                    mythicalLore: trialTemplate.mythicalLore,
                    trialMaster: trialTemplate.trialMaster,
                    sacredLocation: trialTemplate.sacredLocation,
                    completionRitual: trialTemplate.completionRitual,
                    trialIcon: trialTemplate.icon,
                    atmosphericTheme: trialTemplate.theme,
                    isActive: true,
                };
                const trial = await storage_js_1.storage.createTrialOfMastery(trialData);
                trials.push(trial);
            }
        }
        return trials;
    }
    /**
     * Creates divine certifications with NFT-style achievement badges
     */
    async createDivineCertifications() {
        const certifications = [];
        for (const [houseId, house] of Object.entries(housesRoutes_js_1.MYTHOLOGICAL_HOUSES)) {
            const certTemplates = this.generateCertificationsForHouse(house, houseId);
            for (const certTemplate of certTemplates) {
                const certData = {
                    name: certTemplate.name,
                    description: certTemplate.description,
                    houseId,
                    certificationLevel: certTemplate.level,
                    category: certTemplate.category,
                    requirements: certTemplate.requirements,
                    prerequisiteCertifications: certTemplate.prerequisites,
                    minimumKarma: certTemplate.minimumKarma,
                    minimumHouseStanding: certTemplate.minimumHouseStanding,
                    badgeDesign: certTemplate.badgeDesign,
                    certificateTemplate: certTemplate.certificateTemplate,
                    publicTitle: certTemplate.publicTitle,
                    titleAbbreviation: certTemplate.titleAbbreviation,
                    prestigePoints: certTemplate.prestigePoints,
                    tradingBonuses: certTemplate.tradingBonuses,
                    exclusiveAccess: certTemplate.exclusiveAccess,
                    teachingPrivileges: certTemplate.teachingPrivileges,
                    leadershipPrivileges: certTemplate.leadershipPrivileges,
                    displayBorder: certTemplate.displayBorder,
                    glowEffect: certTemplate.glowEffect,
                    rarityLevel: certTemplate.rarityLevel,
                    limitedEdition: certTemplate.limitedEdition,
                    maxIssuances: certTemplate.maxIssuances,
                    currentIssuances: 0,
                    validityPeriod: certTemplate.validityPeriod,
                    renewalRequired: certTemplate.renewalRequired,
                    isActive: true,
                };
                const certification = await storage_js_1.storage.createDivineCertification(certData);
                certifications.push(certification);
            }
        }
        return certifications;
    }
    // ========================================================================================
    // USER PROGRESS AND SKILL MANAGEMENT
    // ========================================================================================
    /**
     * Starts a sacred lesson for a user with mystical ceremony
     */
    async startLesson(userId, lessonId) {
        const lesson = await storage_js_1.storage.getSacredLesson(lessonId);
        if (!lesson) {
            throw new Error('Sacred lesson not found in the cosmic archives');
        }
        // Check prerequisites
        const eligibility = await this.checkLessonEligibility(userId, lessonId);
        if (!eligibility.eligible) {
            throw new Error(`The spirits require more preparation: ${eligibility.missing.join(', ')}`);
        }
        const progressData = {
            userId,
            lessonId,
            pathId: lesson.pathId || undefined,
            status: 'in_progress',
            progressPercent: 0,
            currentSection: 1,
            sectionsCompleted: [],
            timeSpentMinutes: 0,
            attempts: 1,
            startedAt: new Date(),
            lastAccessedAt: new Date(),
        };
        const progress = await storage_js_1.storage.createUserLessonProgress(progressData);
        // Award initial experience for starting the lesson
        await this.updateUserExperience(userId, 10, 'lesson_started');
        return progress;
    }
    /**
     * Completes a sacred lesson with ceremonial rewards
     */
    async completeLesson(userId, lessonId, score, timeSpent) {
        const lesson = await storage_js_1.storage.getSacredLesson(lessonId);
        const progress = await storage_js_1.storage.getLessonProgress(userId, lessonId);
        if (!lesson || !progress) {
            throw new Error('The cosmic energies are misaligned - lesson or progress not found');
        }
        const masteryAchieved = score >= parseFloat(lesson.masteryThreshold.toString());
        const status = masteryAchieved ? 'mastered' : 'completed';
        const updateData = {
            status,
            progressPercent: 100,
            timeSpentMinutes: (progress.timeSpentMinutes || 0) + timeSpent,
            latestScore: score,
            bestScore: Math.max(score, parseFloat(progress.bestScore?.toString() || '0')),
            masteryAchieved,
            completedAt: new Date(),
            experienceAwarded: lesson.experienceReward,
            karmaAwarded: lesson.karmaReward,
        };
        const updatedProgress = await storage_js_1.storage.updateUserLessonProgress(progress.id, updateData);
        // Award experience and karma
        await this.updateUserExperience(userId, lesson.experienceReward, 'lesson_completed');
        await this.updateUserKarma(userId, lesson.karmaReward, 'lesson_mastery');
        // Check for skill unlocks
        const skillsUnlocked = await this.checkForSkillUnlocks(userId, lessonId);
        if (skillsUnlocked.length > 0) {
            await storage_js_1.storage.updateUserLessonProgress(progress.id, {
                skillsUnlocked: skillsUnlocked.map(s => s.id)
            });
        }
        // Update learning analytics
        await this.updateLearningAnalytics(userId);
        return updatedProgress;
    }
    /**
     * Unlocks a mystical skill with awakening ceremony
     */
    async unlockSkill(userId, skillId, unlockMethod) {
        const skill = await storage_js_1.storage.getMysticalSkill(skillId);
        if (!skill) {
            throw new Error('The mystical skill has vanished from the ethereal plane');
        }
        // Check if already unlocked
        const existingUnlock = await storage_js_1.storage.getUserSkillById(userId, skillId);
        if (existingUnlock) {
            throw new Error('This mystical power already flows through your being');
        }
        // Check eligibility
        const eligibility = await this.checkSkillUnlockEligibility(userId, skillId);
        if (!eligibility.eligible) {
            throw new Error(`The cosmic forces are not yet aligned: ${eligibility.missing.join(', ')}`);
        }
        const unlockData = {
            userId,
            skillId,
            unlockMethod,
            masteryLevel: 1,
            maxMasteryLevel: skill.masteryLevels,
            effectivenessBonus: 1.00,
            awakeningDate: new Date(),
            awakeningCeremonyCompleted: true,
            mysticalBond: 1.00,
        };
        const unlock = await storage_js_1.storage.createUserSkillUnlock(unlockData);
        // Update skill statistics
        await storage_js_1.storage.updateMysticalSkill(skillId, {
            timesUnlocked: (skill.timesUnlocked || 0) + 1,
        });
        // Apply trading privileges if any
        if (skill.tradingPrivileges) {
            await this.applyTradingPrivileges(userId, skill.tradingPrivileges);
        }
        // Update learning analytics
        await this.updateLearningAnalytics(userId);
        return unlock;
    }
    /**
     * Starts a trial of mastery for divine certification
     */
    async startTrial(userId, trialId) {
        const trial = await storage_js_1.storage.getTrialOfMastery(trialId);
        if (!trial) {
            throw new Error('The sacred trial has been lost to the cosmic winds');
        }
        // Check eligibility
        const eligibility = await this.checkTrialEligibility(userId, trialId);
        if (!eligibility.eligible) {
            throw new Error(`The trial masters deem you unready: ${eligibility.missing.join(', ')}`);
        }
        // Check attempt limit
        const existingAttempts = await storage_js_1.storage.getUserTrialAttempts(userId, { trialId, status: 'completed' });
        if (existingAttempts.length >= trial.maxAttempts) {
            throw new Error('You have exhausted your attempts at this sacred trial');
        }
        const attemptData = {
            userId,
            trialId,
            attemptNumber: existingAttempts.length + 1,
            status: 'in_progress',
            startedAt: new Date(),
        };
        const attempt = await storage_js_1.storage.createUserTrialAttempt(attemptData);
        // Update trial statistics
        await storage_js_1.storage.updateTrialOfMastery(trialId, {
            attemptCount: (trial.attemptCount || 0) + 1,
        });
        return attempt;
    }
    /**
     * Awards a divine certification with cosmic ceremony
     */
    async awardCertification(userId, certificationId, achievementMethod, verificationData) {
        const certification = await storage_js_1.storage.getDivineCertification(certificationId);
        if (!certification) {
            throw new Error('The divine certification has transcended to higher planes');
        }
        // Check if already earned
        const existing = await storage_js_1.storage.getUserCertifications(userId, { certificationId });
        if (existing.length > 0) {
            throw new Error('You already possess this divine blessing');
        }
        // Check limited edition constraints
        if (certification.limitedEdition && certification.maxIssuances) {
            if (certification.currentIssuances >= certification.maxIssuances) {
                throw new Error('This legendary certification is no longer available to mortals');
            }
        }
        // Generate unique certificate number
        const certificateNumber = `${certification.titleAbbreviation || 'CERT'}-${Date.now()}-${userId.slice(-6)}`;
        const certData = {
            userId,
            certificationId,
            achievementMethod,
            verificationData,
            certificateNumber,
            publicTitle: certification.publicTitle,
            ceremonyCompleted: true,
            ceremonyDate: new Date(),
            publicAnnouncement: true,
            status: 'active',
            validUntil: certification.validityPeriod ?
                new Date(Date.now() + certification.validityPeriod * 30 * 24 * 60 * 60 * 1000) : undefined,
            displayInProfile: true,
            awardedAt: new Date(),
        };
        const userCert = await storage_js_1.storage.createUserCertification(certData);
        // Update certification statistics
        await storage_js_1.storage.updateDivineCertification(certificationId, {
            currentIssuances: certification.currentIssuances + 1,
        });
        // Apply certification benefits
        if (certification.tradingBonuses) {
            await this.applyCertificationBonuses(userId, certification.tradingBonuses);
        }
        // Update learning analytics
        await this.updateLearningAnalytics(userId);
        return userCert;
    }
    // ========================================================================================
    // LEARNING ANALYTICS AND ADAPTIVE FEATURES
    // ========================================================================================
    /**
     * Generates comprehensive learning analytics for personalized experience
     */
    async updateLearningAnalytics(userId) {
        const user = await storage_js_1.storage.getUser(userId);
        if (!user) {
            throw new Error('The cosmic records show no trace of this entity');
        }
        // Gather comprehensive learning data
        const lessonProgresses = await storage_js_1.storage.getUserLessonProgresses(userId);
        const skillUnlocks = await storage_js_1.storage.getUserSkillUnlocks(userId);
        const trialAttempts = await storage_js_1.storage.getUserTrialAttempts(userId);
        const certifications = await storage_js_1.storage.getUserCertifications(userId);
        // Calculate analytics
        const completedLessons = lessonProgresses.filter(p => p.status === 'completed' || p.status === 'mastered');
        const avgScore = completedLessons.length > 0 ?
            completedLessons.reduce((sum, p) => sum + parseFloat(p.latestScore?.toString() || '0'), 0) / completedLessons.length : 0;
        const totalTimeSpent = lessonProgresses.reduce((sum, p) => sum + (p.timeSpentMinutes || 0), 0);
        const totalExperience = completedLessons.reduce((sum, p) => sum + (p.experienceAwarded || 0), 0);
        // Detect learning patterns
        const patterns = await this.detectLearningPatterns(userId);
        const recommendations = await this.generateLearningRecommendations(userId);
        const analyticsData = {
            userId,
            totalExperienceEarned: totalExperience,
            totalLessonsCompleted: completedLessons.length,
            totalSkillsUnlocked: skillUnlocks.length,
            totalTrialsPassed: trialAttempts.filter(a => a.passed).length,
            totalCertificationsEarned: certifications.length,
            lessonsPerWeek: this.calculateLessonsPerWeek(lessonProgresses),
            avgScoreAchieved: avgScore,
            learningStreak: this.calculateLearningStreak(lessonProgresses),
            longestLearningStreak: this.calculateLongestStreak(lessonProgresses),
            preferredLearningTime: patterns.preferredTime,
            avgSessionDuration: totalTimeSpent / Math.max(lessonProgresses.length, 1),
            primaryHouseMastery: this.calculateHouseMastery(user.houseId || '', lessonProgresses),
            secondaryHousesExplored: this.getSecondaryHouses(lessonProgresses),
            crossHouseProgress: this.calculateCrossHouseProgress(lessonProgresses),
            houseRank: await this.calculateHouseRank(userId),
            preferredLessonTypes: patterns.preferredContentTypes,
            learningStyleProfile: patterns.learningStyle,
            knowledgeGaps: recommendations.knowledgeGaps,
            strengthAreas: recommendations.strengthAreas,
            recommendedPaths: recommendations.recommendedPaths,
            motivationLevel: this.assessMotivationLevel(lessonProgresses),
            engagementTrend: this.calculateEngagementTrend(lessonProgresses),
            lastActiveDate: new Date(),
            totalTimeSpent,
            predictedCompletionDate: this.predictCompletionDate(userId, lessonProgresses),
            riskOfDropout: this.calculateDropoutRisk(lessonProgresses),
            recommendedInterventions: recommendations.interventions,
            nextCalculationDue: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        };
        // Upsert analytics
        const existing = await storage_js_1.storage.getLearningAnalytics(userId);
        if (existing) {
            return (await storage_js_1.storage.updateLearningAnalytics(userId, analyticsData));
        }
        else {
            return await storage_js_1.storage.createLearningAnalytics(analyticsData);
        }
    }
    /**
     * Generates personalized learning recommendations using AI-driven insights
     */
    async generateLearningRecommendations(userId) {
        const user = await storage_js_1.storage.getUser(userId);
        const analytics = await storage_js_1.storage.getLearningAnalytics(userId);
        const progresses = await storage_js_1.storage.getUserLessonProgresses(userId);
        const skills = await storage_js_1.storage.getUserSkillUnlocks(userId);
        // Analyze user's learning patterns and preferences
        const houseId = user?.houseId || 'wisdom'; // Default to wisdom house
        const completedLessons = progresses.filter(p => p.status === 'completed' || p.status === 'mastered');
        const strugglingLessons = progresses.filter(p => p.attempts > 2 || (p.latestScore && parseFloat(p.latestScore.toString()) < 70));
        // Identify knowledge gaps
        const knowledgeGaps = this.identifyKnowledgeGaps(completedLessons, strugglingLessons);
        // Identify strength areas
        const strengthAreas = this.identifyStrengthAreas(completedLessons);
        // Get recommended paths based on house and progress
        const recommendedPaths = await storage_js_1.storage.getLearningPathsByHouse(houseId);
        // Get suggested lessons based on current progress
        const suggestedLessons = await this.getSuggestedLessons(userId, houseId);
        // Get skills ready to unlock
        const skillsToUnlock = await this.getUnlockableSkills(userId);
        // Generate intervention recommendations
        const interventions = this.generateInterventions(analytics, progresses);
        return {
            recommendedPaths: recommendedPaths.slice(0, 3), // Top 3 paths
            suggestedLessons: suggestedLessons.slice(0, 5), // Top 5 lessons
            skillsToUnlock: skillsToUnlock.slice(0, 3), // Top 3 skills
            interventions,
            knowledgeGaps,
            strengthAreas,
            recommendedPaths: recommendedPaths.map(p => ({ id: p.id, name: p.name, progress: 0 })),
        };
    }
    // ========================================================================================
    // SKILL TREE AND PROGRESSION LOGIC
    // ========================================================================================
    /**
     * Gets the complete skill tree for a house with dependencies
     */
    async getSkillTree(houseId) {
        const filters = houseId ? { houseId, isActive: true } : { isActive: true };
        const skills = await storage_js_1.storage.getMysticalSkills(filters);
        const skillTree = [];
        for (const skill of skills) {
            const prerequisites = [];
            const unlocks = [];
            // Get prerequisite skills
            if (skill.prerequisiteSkills && skill.prerequisiteSkills.length > 0) {
                for (const prereqId of skill.prerequisiteSkills) {
                    const prereqSkill = skills.find(s => s.id === prereqId);
                    if (prereqSkill)
                        prerequisites.push(prereqSkill);
                }
            }
            // Get skills this unlocks
            if (skill.childSkills && skill.childSkills.length > 0) {
                for (const childId of skill.childSkills) {
                    const childSkill = skills.find(s => s.id === childId);
                    if (childSkill)
                        unlocks.push(childSkill);
                }
            }
            skillTree.push({
                ...skill,
                prerequisites,
                unlocks,
            });
        }
        return skillTree;
    }
    /**
     * Checks if a user is eligible to unlock a specific skill
     */
    async checkSkillUnlockEligibility(userId, skillId) {
        const skill = await storage_js_1.storage.getMysticalSkill(skillId);
        if (!skill) {
            return { eligible: false, requirements: {}, missing: ['Skill not found'] };
        }
        const user = await storage_js_1.storage.getUser(userId);
        const userSkills = await storage_js_1.storage.getUserSkillUnlocks(userId);
        const userLessons = await storage_js_1.storage.getUserLessonProgresses(userId);
        const requirements = {
            karma: skill.karmaRequirement || 0,
            prerequisiteSkills: skill.prerequisiteSkills || [],
            prerequisiteLessons: skill.prerequisiteLessons || [],
            houseStanding: skill.houseStandingRequirement,
            tradingPerformance: skill.tradingPerformanceRequirement,
        };
        const missing = [];
        // Check karma requirement
        if (user && (user.karma || 0) < requirements.karma) {
            missing.push(`Need ${requirements.karma - (user.karma || 0)} more karma`);
        }
        // Check prerequisite skills
        const unlockedSkillIds = userSkills.map(us => us.skillId);
        for (const prereqSkill of requirements.prerequisiteSkills) {
            if (!unlockedSkillIds.includes(prereqSkill)) {
                missing.push(`Missing prerequisite skill: ${prereqSkill}`);
            }
        }
        // Check prerequisite lessons
        const completedLessonIds = userLessons
            .filter(ul => ul.status === 'completed' || ul.status === 'mastered')
            .map(ul => ul.lessonId);
        for (const prereqLesson of requirements.prerequisiteLessons) {
            if (!completedLessonIds.includes(prereqLesson)) {
                missing.push(`Missing prerequisite lesson: ${prereqLesson}`);
            }
        }
        // Check house standing
        if (requirements.houseStanding && user?.houseId) {
            const houseRank = await this.calculateHouseRank(userId);
            const requiredRank = this.parseHouseStanding(requirements.houseStanding);
            if (houseRank > requiredRank) {
                missing.push(`Need house rank ${requiredRank} or better`);
            }
        }
        return {
            eligible: missing.length === 0,
            requirements,
            missing,
        };
    }
    // ========================================================================================
    // UTILITY METHODS FOR LEARNING SYSTEM
    // ========================================================================================
    capitalizeDifficulty(difficulty) {
        return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    }
    generatePathDescription(house, difficulty) {
        const descriptions = {
            initiate: `Begin your journey into the ${house.specialization} mysteries`,
            adept: `Deepen your understanding of ${house.specialization} mastery`,
            master: `Master the advanced arts of ${house.specialization}`,
            grandmaster: `Transcend mortal limits in ${house.specialization} wisdom`,
        };
        return descriptions[difficulty] || descriptions.initiate;
    }
    generatePathPrerequisites(houseId, difficulty) {
        const base = { houseId };
        switch (difficulty) {
            case 'adept': return { ...base, karma: 100, completedPaths: 1 };
            case 'master': return { ...base, karma: 500, completedPaths: 2 };
            case 'grandmaster': return { ...base, karma: 1000, completedPaths: 3 };
            default: return base;
        }
    }
    calculateEstimatedHours(difficulty) {
        const hours = { initiate: 10, adept: 20, master: 35, grandmaster: 50 };
        return hours[difficulty] || 10;
    }
    calculateExperienceReward(difficulty) {
        const rewards = { initiate: 1000, adept: 2500, master: 5000, grandmaster: 10000 };
        return rewards[difficulty] || 1000;
    }
    calculateKarmaReward(difficulty) {
        const rewards = { initiate: 50, adept: 125, master: 250, grandmaster: 500 };
        return rewards[difficulty] || 50;
    }
    generateSacredTitle(house, difficulty) {
        const titles = {
            initiate: `Path of the ${house.name} Novice`,
            adept: `Way of the ${house.name} Seeker`,
            master: `Journey of the ${house.name} Master`,
            grandmaster: `Ascension of the ${house.name} Grandmaster`,
        };
        return titles[difficulty] || titles.initiate;
    }
    generateMysticalDescription(house, difficulty) {
        return `Walk the sacred path of ${house.name}, where ancient wisdom meets modern trading mastery. ${house.description}`;
    }
    generateUnlockConditions(houseId, difficulty) {
        return {
            houseId,
            minimumKarma: this.calculateKarmaReward(difficulty) / 10,
            tradingLevel: difficulty,
        };
    }
    generateCompletionRewards(houseId, difficulty) {
        return {
            tradingPrivileges: this.getTradingPrivilegesForLevel(difficulty),
            bonuses: this.getBonusesForLevel(difficulty),
            titleUnlocked: `${difficulty} of ${houseId}`,
        };
    }
    getTradingPrivilegesForLevel(difficulty) {
        const privileges = {
            initiate: { basicTrading: true },
            adept: { basicTrading: true, advancedOrders: true },
            master: { basicTrading: true, advancedOrders: true, derivatives: true },
            grandmaster: { basicTrading: true, advancedOrders: true, derivatives: true, institutionalTools: true },
        };
        return privileges[difficulty] || privileges.initiate;
    }
    getBonusesForLevel(difficulty) {
        const bonuses = {
            initiate: { tradingFeeReduction: 0.05 },
            adept: { tradingFeeReduction: 0.10, analysisBonus: 0.10 },
            master: { tradingFeeReduction: 0.15, analysisBonus: 0.20, socialBonus: 0.10 },
            grandmaster: { tradingFeeReduction: 0.25, analysisBonus: 0.30, socialBonus: 0.20, karmaMultiplier: 1.5 },
        };
        return bonuses[difficulty] || bonuses.initiate;
    }
    // Additional placeholder methods that would need full implementation
    generateLessonTemplates(house, difficulty) { return []; }
    generateSkillsForHouse(house, houseId) { return []; }
    generateTrialsForHouse(house, houseId) { return []; }
    generateCertificationsForHouse(house, houseId) { return []; }
    async checkLessonEligibility(userId, lessonId) {
        return { eligible: true, missing: [] };
    }
    async updateUserExperience(userId, experience, reason) { }
    async updateUserKarma(userId, karma, reason) { }
    async checkForSkillUnlocks(userId, lessonId) { return []; }
    async applyTradingPrivileges(userId, privileges) { }
    async applyCertificationBonuses(userId, bonuses) { }
    async detectLearningPatterns(userId) {
        return { preferredTime: 'evening', preferredContentTypes: ['crystal_orb'], learningStyle: {} };
    }
    calculateLessonsPerWeek(progresses) { return 2.5; }
    calculateLearningStreak(progresses) { return 5; }
    calculateLongestStreak(progresses) { return 10; }
    calculateHouseMastery(houseId, progresses) { return 65.5; }
    getSecondaryHouses(progresses) { return ['mystery', 'elements']; }
    calculateCrossHouseProgress(progresses) { return {}; }
    async calculateHouseRank(userId) { return 42; }
    assessMotivationLevel(progresses) { return 4.2; }
    calculateEngagementTrend(progresses) { return 'increasing'; }
    predictCompletionDate(userId, progresses) {
        return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    }
    calculateDropoutRisk(progresses) { return 0.15; }
    identifyKnowledgeGaps(completed, struggling) { return {}; }
    identifyStrengthAreas(completed) { return {}; }
    async getSuggestedLessons(userId, houseId) { return []; }
    async getUnlockableSkills(userId) { return []; }
    generateInterventions(analytics, progresses) { return []; }
    parseHouseStanding(standing) { return 10; }
}
exports.ComprehensiveLearningService = ComprehensiveLearningService;
// Export singleton instance
exports.learningService = new ComprehensiveLearningService();
