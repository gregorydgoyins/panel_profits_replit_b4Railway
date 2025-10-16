"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebflowIntegrationService = void 0;
const externalIntegrationsService_js_1 = require("./externalIntegrationsService.js");
const storage_js_1 = require("../storage.js");
/**
 * Webflow Integration Service
 */
class WebflowIntegrationService {
    /**
     * Initialize Webflow integration for a user
     */
    static async initializeIntegration(integrationId, apiToken, siteId) {
        try {
            // Test API connection
            const isValid = await this.validateApiToken(integrationId, apiToken);
            if (!isValid) {
                throw new Error('Invalid Webflow API token - The cosmic connection is disrupted');
            }
            // Get user's sites or create new site if needed
            const sites = await this.getUserSites(integrationId);
            let targetSiteId = siteId;
            if (!targetSiteId && sites.length === 0) {
                // Create a default Panel Profits portfolio site
                targetSiteId = await this.createPanelProfitsSite(integrationId);
            }
            else if (!targetSiteId) {
                targetSiteId = sites[0].id;
            }
            // Set up collections for Panel Profits data
            await this.setupPanelProfitsCollections(integrationId, targetSiteId);
            // Create default automation workflows
            await this.createDefaultAutomations(integrationId, targetSiteId);
            return true;
        }
        catch (error) {
            console.error('🔥 Error initializing Webflow integration - The divine forge has encountered disruption:', error);
            throw error;
        }
    }
    /**
     * Validate Webflow API token
     */
    static async validateApiToken(integrationId, apiToken) {
        try {
            const response = await externalIntegrationsService_js_1.ExternalApiClient.makeApiCall(integrationId, '/info', { method: 'GET' });
            return !!response?.users;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Get user's Webflow sites
     */
    static async getUserSites(integrationId) {
        try {
            const response = await externalIntegrationsService_js_1.ExternalApiClient.makeApiCall(integrationId, '/sites', { method: 'GET' });
            return response?.sites || [];
        }
        catch (error) {
            console.error('🔥 Error fetching Webflow sites - The divine realm is obscured:', error);
            return [];
        }
    }
    /**
     * Create a Panel Profits portfolio site
     */
    static async createPanelProfitsSite(integrationId) {
        try {
            const response = await externalIntegrationsService_js_1.ExternalApiClient.makeApiCall(integrationId, '/sites', {
                method: 'POST',
                body: JSON.stringify({
                    displayName: 'Panel Profits Divine Portfolio',
                    shortName: 'panel-profits-portfolio',
                    timezone: 'America/New_York'
                })
            });
            return response?.id;
        }
        catch (error) {
            console.error('🔥 Error creating Panel Profits site - The cosmic blueprint failed to manifest:', error);
            throw error;
        }
    }
    /**
     * Set up collections for Panel Profits data
     */
    static async setupPanelProfitsCollections(integrationId, siteId) {
        try {
            const collections = [
                {
                    displayName: 'Trading Achievements',
                    singularName: 'Achievement',
                    slug: 'achievements',
                    fields: [
                        { displayName: 'Title', slug: 'title', type: 'PlainText', required: true },
                        { displayName: 'Description', slug: 'description', type: 'RichText', required: false },
                        { displayName: 'Achievement Date', slug: 'achievement-date', type: 'DateTime', required: true },
                        { displayName: 'Achievement Type', slug: 'achievement-type', type: 'PlainText', required: true },
                        { displayName: 'Value', slug: 'value', type: 'Number', required: false },
                        { displayName: 'Icon', slug: 'icon', type: 'ImageRef', required: false }
                    ]
                },
                {
                    displayName: 'Portfolio Holdings',
                    singularName: 'Holding',
                    slug: 'holdings',
                    fields: [
                        { displayName: 'Asset Name', slug: 'asset-name', type: 'PlainText', required: true },
                        { displayName: 'Asset Image', slug: 'asset-image', type: 'ImageRef', required: false },
                        { displayName: 'Quantity', slug: 'quantity', type: 'Number', required: true },
                        { displayName: 'Current Value', slug: 'current-value', type: 'Number', required: true },
                        { displayName: 'Purchase Date', slug: 'purchase-date', type: 'DateTime', required: false },
                        { displayName: 'Performance', slug: 'performance', type: 'Number', required: false }
                    ]
                },
                {
                    displayName: 'Comic Collection',
                    singularName: 'Comic',
                    slug: 'comics',
                    fields: [
                        { displayName: 'Title', slug: 'title', type: 'PlainText', required: true },
                        { displayName: 'Cover Image', slug: 'cover-image', type: 'ImageRef', required: false },
                        { displayName: 'Issue Number', slug: 'issue-number', type: 'PlainText', required: false },
                        { displayName: 'Publisher', slug: 'publisher', type: 'PlainText', required: false },
                        { displayName: 'Grade', slug: 'grade', type: 'PlainText', required: false },
                        { displayName: 'Estimated Value', slug: 'estimated-value', type: 'Number', required: false }
                    ]
                }
            ];
            for (const collection of collections) {
                await externalIntegrationsService_js_1.ExternalApiClient.makeApiCall(integrationId, `/sites/${siteId}/collections`, {
                    method: 'POST',
                    body: JSON.stringify(collection)
                });
            }
        }
        catch (error) {
            console.error('🔥 Error setting up Panel Profits collections - The divine data vessels failed to form:', error);
            throw error;
        }
    }
    /**
     * Generate dynamic portfolio page for a user
     */
    static async generatePortfolioPage(integrationId, userId, config) {
        try {
            console.log('🎨 Generating divine portfolio page for user:', userId);
            // Get user data
            const user = await storage_js_1.storage.getUser(userId);
            if (!user) {
                throw new Error('Sacred trader not found in the realm');
            }
            // Get user's trading data
            const portfolios = await storage_js_1.storage.getPortfolios(userId);
            const holdings = await storage_js_1.storage.getHoldings(userId);
            // Get sites for this integration
            const sites = await this.getUserSites(integrationId);
            const targetSite = sites.find(site => site.name.includes(config.siteName)) || sites[0];
            if (!targetSite) {
                throw new Error('No divine site found for portfolio manifestation');
            }
            // Create portfolio items in collections
            await this.syncPortfolioData(integrationId, targetSite.id, {
                user,
                portfolios,
                holdings,
                config
            });
            return `${targetSite.previewUrl}/portfolio/${user.username || user.id}`;
        }
        catch (error) {
            console.error('🔥 Error generating portfolio page - The cosmic artisan has faltered:', error);
            throw error;
        }
    }
    /**
     * Synchronize Panel Profits data to Webflow collections
     */
    static async syncPortfolioData(integrationId, siteId, data) {
        try {
            const { user, portfolios, holdings, config } = data;
            // Get collections
            const collectionsResponse = await externalIntegrationsService_js_1.ExternalApiClient.makeApiCall(integrationId, `/sites/${siteId}/collections`, { method: 'GET' });
            const collections = collectionsResponse?.collections || [];
            const holdingsCollection = collections.find((c) => c.slug === 'holdings');
            const achievementsCollection = collections.find((c) => c.slug === 'achievements');
            // Sync holdings data
            if (holdingsCollection && config.sections.topHoldings) {
                for (const holding of holdings.slice(0, 10)) { // Top 10 holdings
                    const asset = await storage_js_1.storage.getAsset(holding.assetId);
                    if (asset) {
                        await externalIntegrationsService_js_1.ExternalApiClient.makeApiCall(integrationId, `/collections/${holdingsCollection.id}/items`, {
                            method: 'POST',
                            body: JSON.stringify({
                                fieldData: {
                                    'asset-name': asset.title,
                                    'quantity': holding.quantity,
                                    'current-value': holding.currentValue,
                                    'purchase-date': holding.purchaseDate?.toISOString(),
                                    'performance': holding.totalReturn
                                }
                            })
                        });
                    }
                }
            }
            // Sync achievements (if user has achievements)
            if (achievementsCollection && config.sections.achievements) {
                const userAchievements = await storage_js_1.storage.getUserAchievements(user.id);
                for (const achievement of userAchievements.slice(0, 5)) {
                    await externalIntegrationsService_js_1.ExternalApiClient.makeApiCall(integrationId, `/collections/${achievementsCollection.id}/items`, {
                        method: 'POST',
                        body: JSON.stringify({
                            fieldData: {
                                'title': achievement.title,
                                'description': achievement.description,
                                'achievement-date': achievement.unlockedAt?.toISOString(),
                                'achievement-type': achievement.category
                            }
                        })
                    });
                }
            }
        }
        catch (error) {
            console.error('🔥 Error syncing portfolio data - The divine synchronization ritual has failed:', error);
            throw error;
        }
    }
    /**
     * Create marketing page automation
     */
    static async createMarketingPage(integrationId, siteId, pageConfig) {
        try {
            const response = await externalIntegrationsService_js_1.ExternalApiClient.makeApiCall(integrationId, `/sites/${siteId}/pages`, {
                method: 'POST',
                body: JSON.stringify({
                    title: pageConfig.title,
                    slug: pageConfig.title.toLowerCase().replace(/\s+/g, '-'),
                    parentId: null,
                    isHomePage: false,
                    isFolder: false,
                    template: pageConfig.templateType,
                    seo: {
                        title: pageConfig.title,
                        description: pageConfig.content.substring(0, 160)
                    }
                })
            });
            return response?.url || '';
        }
        catch (error) {
            console.error('🔥 Error creating marketing page - The cosmic content weaver has stumbled:', error);
            throw error;
        }
    }
    /**
     * Set up automated content synchronization workflows
     */
    static async createDefaultAutomations(integrationId, siteId) {
        try {
            const integration = await storage_js_1.storage.getExternalIntegration(integrationId);
            if (!integration)
                return;
            const automations = [
                {
                    userId: integration.userId,
                    integrationId,
                    name: 'Portfolio Auto-Sync Ritual',
                    description: 'Automatically synchronizes portfolio changes to Webflow showcase',
                    triggerType: 'portfolio_update',
                    triggerConfig: {
                        events: ['holding_added', 'holding_removed', 'portfolio_performance_update'],
                        conditions: { minValueChange: 100 }
                    },
                    actionType: 'webflow_sync',
                    actionConfig: {
                        siteId,
                        syncType: 'holdings',
                        collections: ['holdings']
                    },
                    isActive: true,
                    category: 'portfolio_showcase',
                    priority: 1,
                    metadata: {
                        ritualType: 'divine_synchronization',
                        cosmicEnergy: 'high'
                    }
                },
                {
                    userId: integration.userId,
                    integrationId,
                    name: 'Achievement Showcase Ritual',
                    description: 'Displays new achievements on portfolio website',
                    triggerType: 'achievement_unlocked',
                    triggerConfig: {
                        events: ['new_achievement', 'milestone_reached'],
                        conditions: { displayInProfile: true }
                    },
                    actionType: 'webflow_sync',
                    actionConfig: {
                        siteId,
                        syncType: 'achievements',
                        collections: ['achievements'],
                        template: 'achievement_showcase'
                    },
                    isActive: true,
                    category: 'achievements',
                    priority: 2,
                    metadata: {
                        ritualType: 'glory_manifestation',
                        cosmicEnergy: 'medium'
                    }
                },
                {
                    userId: integration.userId,
                    integrationId,
                    name: 'Weekly Portfolio Report Ritual',
                    description: 'Generates weekly portfolio performance reports',
                    triggerType: 'schedule',
                    triggerConfig: {
                        cronExpression: '0 0 * * 1', // Every Monday at midnight
                        timezone: 'America/New_York'
                    },
                    actionType: 'webflow_report',
                    actionConfig: {
                        siteId,
                        reportType: 'weekly_performance',
                        emailNotification: true
                    },
                    isActive: true,
                    category: 'reporting',
                    priority: 3,
                    metadata: {
                        ritualType: 'temporal_chronicle',
                        cosmicEnergy: 'low'
                    }
                }
            ];
            for (const automation of automations) {
                await storage_js_1.storage.createWorkflowAutomation(automation);
            }
            console.log('✨ Created 3 divine automation workflows for Webflow integration');
        }
        catch (error) {
            console.error('🔥 Error creating default automations - The ritual framework has collapsed:', error);
            throw error;
        }
    }
    /**
     * Execute Webflow synchronization workflow
     */
    static async executeSync(integrationId, syncType, options) {
        try {
            console.log('🔄 Executing Webflow sync ritual:', { syncType, userId: options.userId });
            const sites = await this.getUserSites(integrationId);
            const targetSite = options.siteId
                ? sites.find(s => s.id === options.siteId)
                : sites[0];
            if (!targetSite) {
                throw new Error('No target site found for synchronization ritual');
            }
            switch (syncType) {
                case 'holdings':
                    await this.syncHoldingsData(integrationId, targetSite.id, options.userId);
                    break;
                case 'achievements':
                    await this.syncAchievementsData(integrationId, targetSite.id, options.userId);
                    break;
                case 'full_portfolio':
                    await this.syncFullPortfolio(integrationId, targetSite.id, options.userId);
                    break;
            }
            return true;
        }
        catch (error) {
            console.error('🔥 Error executing Webflow sync - The synchronization ritual has failed:', error);
            return false;
        }
    }
    static async syncHoldingsData(integrationId, siteId, userId) {
        const holdings = await storage_js_1.storage.getHoldings(userId);
        // Clear existing items and sync fresh data
        // Implementation details for holdings sync...
    }
    static async syncAchievementsData(integrationId, siteId, userId) {
        const achievements = await storage_js_1.storage.getUserAchievements(userId);
        // Implementation details for achievements sync...
    }
    static async syncFullPortfolio(integrationId, siteId, userId) {
        // Full portfolio synchronization including all collections
        await Promise.all([
            this.syncHoldingsData(integrationId, siteId, userId),
            this.syncAchievementsData(integrationId, siteId, userId)
        ]);
    }
    /**
     * Get portfolio website performance analytics
     */
    static async getWebsiteAnalytics(integrationId, siteId, timeframe = '30d') {
        try {
            // Webflow doesn't provide built-in analytics API
            // This would typically integrate with Google Analytics or similar
            return {
                pageViews: 0,
                uniqueVisitors: 0,
                averageSessionDuration: 0,
                topPages: []
            };
        }
        catch (error) {
            console.error('🔥 Error fetching website analytics - The cosmic metrics are obscured:', error);
            return {
                pageViews: 0,
                uniqueVisitors: 0,
                averageSessionDuration: 0,
                topPages: []
            };
        }
    }
}
exports.WebflowIntegrationService = WebflowIntegrationService;
WebflowIntegrationService.BASE_URL = 'https://api.webflow.com/v2';
