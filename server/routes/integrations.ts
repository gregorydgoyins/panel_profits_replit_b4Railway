import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage.js';
import { 
  insertExternalIntegrationSchema, 
  insertIntegrationWebhookSchema,
  insertWorkflowAutomationSchema,
  insertIntegrationSyncLogSchema 
} from '@shared/schema.js';
import { ExternalIntegrationsService, INTEGRATION_CONFIGS } from '../services/externalIntegrationsService.js';
import { WebhookManager } from '../services/webhookManager.js';

/**
 * API Routes for External Integrations - Phase 8
 * 
 * Divine Connections Chamber endpoints for managing:
 * - External tool integrations (Webflow, Figma, Relume, Zapier)
 * - Webhook configurations and management
 * - Workflow automation (Sacred Rituals and Divine Protocols)
 * - Integration analytics and monitoring
 */

const router = Router();

// =============================================
// EXTERNAL INTEGRATIONS ROUTES
// =============================================

/**
 * GET /api/integrations
 * Get all integrations for the authenticated user
 */
router.get('/', async (req, res) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const integrations = await storage.getUserExternalIntegrations(userId);
    
    // Transform for mystical presentation
    const divineConnections = integrations.map(integration => ({
      ...integration,
      mysticalName: INTEGRATION_CONFIGS[integration.integrationName as keyof typeof INTEGRATION_CONFIGS]?.description || integration.integrationDisplayName,
      divineStatus: integration.status === 'connected' ? 'Aligned' : 'Seeking Harmony',
      cosmicPower: INTEGRATION_CONFIGS[integration.integrationName as keyof typeof INTEGRATION_CONFIGS]?.mysticalPower || 5,
    }));

    res.json({
      divineConnections,
      totalConnections: integrations.length,
      activeConnections: integrations.filter(i => i.status === 'connected').length,
    });
  } catch (error) {
    console.error('Error fetching integrations:', error);
    res.status(500).json({ error: 'Failed to fetch divine connections' });
  }
});

/**
 * GET /api/integrations/:id
 * Get specific integration details
 */
router.get('/:id', async (req, res) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const integration = await storage.getExternalIntegration(req.params.id);
    if (!integration) {
      return res.status(404).json({ error: 'Divine connection not found' });
    }

    // Verify ownership
    if (integration.userId !== userId) {
      return res.status(403).json({ error: 'Access denied to this sacred realm' });
    }

    // Get integration analytics
    const analytics = await storage.getUserIntegrationAnalytics(userId, {
      integrationName: integration.integrationName,
    });

    res.json({
      integration: {
        ...integration,
        mysticalName: INTEGRATION_CONFIGS[integration.integrationName as keyof typeof INTEGRATION_CONFIGS]?.description,
        cosmicPower: INTEGRATION_CONFIGS[integration.integrationName as keyof typeof INTEGRATION_CONFIGS]?.mysticalPower,
        // Don't expose encrypted credentials
        encryptedCredentials: undefined,
      },
      analytics: analytics.slice(0, 7), // Last 7 days
    });
  } catch (error) {
    console.error('Error fetching integration:', error);
    res.status(500).json({ error: 'Failed to commune with divine realm' });
  }
});

/**
 * POST /api/integrations
 * Create new integration
 */
router.post('/', async (req, res) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Validate request body
    const validationSchema = insertExternalIntegrationSchema.extend({
      credentials: z.object({}).passthrough(), // Raw credentials to be encrypted
    });

    const { credentials, ...integrationData } = validationSchema.parse(req.body);

    // Check if integration type is supported
    if (!INTEGRATION_CONFIGS[integrationData.integrationName as keyof typeof INTEGRATION_CONFIGS]) {
      return res.status(400).json({ error: 'Unsupported divine realm' });
    }

    // Create integration with encrypted credentials
    const integration = await ExternalIntegrationsService.createIntegration(
      userId,
      integrationData.integrationName,
      credentials,
      integrationData.configuration || {}
    );

    res.status(201).json({
      message: 'Divine connection established successfully',
      integration: {
        ...integration,
        mysticalName: INTEGRATION_CONFIGS[integration.integrationName as keyof typeof INTEGRATION_CONFIGS]?.description,
        encryptedCredentials: undefined, // Don't expose encrypted credentials
      },
    });
  } catch (error) {
    console.error('Error creating integration:', error);
    res.status(500).json({ error: 'Failed to establish divine connection' });
  }
});

/**
 * PUT /api/integrations/:id
 * Update integration configuration
 */
router.put('/:id', async (req, res) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const integration = await storage.getExternalIntegration(req.params.id);
    if (!integration || integration.userId !== userId) {
      return res.status(404).json({ error: 'Divine connection not found' });
    }

    const updates = req.body;
    const updatedIntegration = await storage.updateExternalIntegration(req.params.id, updates);

    res.json({
      message: 'Divine connection harmonized successfully',
      integration: {
        ...updatedIntegration,
        encryptedCredentials: undefined,
      },
    });
  } catch (error) {
    console.error('Error updating integration:', error);
    res.status(500).json({ error: 'Failed to harmonize divine connection' });
  }
});

/**
 * DELETE /api/integrations/:id
 * Delete integration
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const integration = await storage.getExternalIntegration(req.params.id);
    if (!integration || integration.userId !== userId) {
      return res.status(404).json({ error: 'Divine connection not found' });
    }

    await storage.deleteExternalIntegration(req.params.id);

    res.json({ message: 'Divine connection has been peacefully severed' });
  } catch (error) {
    console.error('Error deleting integration:', error);
    res.status(500).json({ error: 'Failed to sever divine connection' });
  }
});

/**
 * POST /api/integrations/:id/test
 * Test integration connection
 */
router.post('/:id/test', async (req, res) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const integration = await storage.getExternalIntegration(req.params.id);
    if (!integration || integration.userId !== userId) {
      return res.status(404).json({ error: 'Divine connection not found' });
    }

    const result = await ExternalIntegrationsService.testConnection(req.params.id);

    res.json({
      success: result.success,
      message: result.success 
        ? 'Divine connection flows with cosmic energy!' 
        : 'The cosmic channels are blocked. Realignment needed.',
      details: result.message,
    });
  } catch (error) {
    console.error('Error testing integration:', error);
    res.status(500).json({ error: 'Failed to commune with divine realm' });
  }
});

/**
 * POST /api/integrations/:id/sync
 * Trigger data synchronization
 */
router.post('/:id/sync', async (req, res) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const integration = await storage.getExternalIntegration(req.params.id);
    if (!integration || integration.userId !== userId) {
      return res.status(404).json({ error: 'Divine connection not found' });
    }

    const { syncType = 'incremental', direction = 'bidirectional', dataType = 'all' } = req.body;

    const syncLog = await ExternalIntegrationsService.synchronizeData(
      req.params.id,
      syncType,
      direction,
      dataType
    );

    res.json({
      message: 'Sacred synchronization ritual has begun',
      syncLog: {
        ...syncLog,
        mysticalDescription: `${direction} harmony restoration through ${syncType} cosmic alignment`,
      },
    });
  } catch (error) {
    console.error('Error triggering sync:', error);
    res.status(500).json({ error: 'Sacred synchronization ritual failed' });
  }
});

// =============================================
// WEBHOOK MANAGEMENT ROUTES
// =============================================

/**
 * GET /api/integrations/:id/webhooks
 * Get webhooks for an integration
 */
router.get('/:id/webhooks', async (req, res) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const integration = await storage.getExternalIntegration(req.params.id);
    if (!integration || integration.userId !== userId) {
      return res.status(404).json({ error: 'Divine connection not found' });
    }

    const webhooks = await storage.getIntegrationWebhooks(req.params.id);

    res.json({
      webhooks: webhooks.map(webhook => ({
        ...webhook,
        secretKey: undefined, // Don't expose secret keys
        mysticalChannel: webhook.webhookType === 'incoming' ? 'Receiving Divine Messages' : 'Sending Sacred Signals',
      })),
    });
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    res.status(500).json({ error: 'Failed to read sacred channels' });
  }
});

/**
 * POST /api/integrations/:id/webhooks
 * Create webhook for integration
 */
router.post('/:id/webhooks', async (req, res) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const integration = await storage.getExternalIntegration(req.params.id);
    if (!integration || integration.userId !== userId) {
      return res.status(404).json({ error: 'Divine connection not found' });
    }

    const webhookData = insertIntegrationWebhookSchema.parse({
      ...req.body,
      integrationId: req.params.id,
    });

    const webhook = await WebhookManager.createWebhook(webhookData);

    res.status(201).json({
      message: 'Sacred communication channel established',
      webhook: {
        ...webhook,
        secretKey: undefined, // Don't expose secret key in response
      },
    });
  } catch (error) {
    console.error('Error creating webhook:', error);
    res.status(500).json({ error: 'Failed to establish sacred channel' });
  }
});

/**
 * POST /api/integrations/:id/webhooks/:webhookId/test
 * Test webhook delivery
 */
router.post('/:id/webhooks/:webhookId/test', async (req, res) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const integration = await storage.getExternalIntegration(req.params.id);
    if (!integration || integration.userId !== userId) {
      return res.status(404).json({ error: 'Divine connection not found' });
    }

    const result = await WebhookManager.testWebhook(req.params.webhookId);

    res.json({
      success: result.success,
      message: result.success 
        ? 'Sacred message delivered successfully!' 
        : 'Message failed to reach the divine realm',
      details: result.message,
    });
  } catch (error) {
    console.error('Error testing webhook:', error);
    res.status(500).json({ error: 'Failed to test sacred channel' });
  }
});

// =============================================
// WORKFLOW AUTOMATION ROUTES
// =============================================

/**
 * GET /api/integrations/workflows
 * Get user's workflow automations (Sacred Rituals)
 */
router.get('/workflows', async (req, res) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const workflows = await storage.getUserWorkflowAutomations(userId);

    res.json({
      sacredRituals: workflows.map(workflow => ({
        ...workflow,
        mysticalDescription: `${workflow.ritualType || 'Sacred'} ritual of ${workflow.category} mastery`,
        divineStatus: workflow.isActive ? 'Channeling Cosmic Energy' : 'Dormant in Sacred Meditation',
      })),
    });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({ error: 'Failed to commune with sacred rituals' });
  }
});

/**
 * POST /api/integrations/workflows
 * Create workflow automation
 */
router.post('/workflows', async (req, res) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const workflowData = insertWorkflowAutomationSchema.parse({
      ...req.body,
      userId,
    });

    const workflow = await storage.createWorkflowAutomation(workflowData);

    res.status(201).json({
      message: 'Sacred ritual has been inscribed in the cosmic tome',
      sacredRitual: {
        ...workflow,
        mysticalDescription: `${workflow.ritualType || 'Sacred'} ritual of ${workflow.category} mastery`,
      },
    });
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: 'Failed to inscribe sacred ritual' });
  }
});

/**
 * POST /api/integrations/workflows/:id/execute
 * Manually execute workflow
 */
router.post('/workflows/:id/execute', async (req, res) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const workflow = await storage.getWorkflowAutomation(req.params.id);
    if (!workflow || workflow.userId !== userId) {
      return res.status(404).json({ error: 'Sacred ritual not found' });
    }

    // Create execution record
    const execution = await storage.createWorkflowExecution({
      workflowId: req.params.id,
      executionId: crypto.randomUUID(),
      status: 'started',
      triggerSource: 'manual',
      triggerData: req.body,
      startedAt: new Date(),
    });

    res.json({
      message: 'Sacred ritual execution has commenced',
      execution: {
        ...execution,
        mysticalStatus: 'Channeling Divine Energy',
      },
    });
  } catch (error) {
    console.error('Error executing workflow:', error);
    res.status(500).json({ error: 'Sacred ritual execution failed' });
  }
});

// =============================================
// ANALYTICS AND MONITORING ROUTES
// =============================================

/**
 * GET /api/integrations/analytics
 * Get integration analytics dashboard
 */
router.get('/analytics', async (req, res) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { timeframe = 'daily' } = req.query;

    const analytics = await storage.getUserIntegrationAnalytics(userId, {
      timeframe: timeframe as string,
    });

    const integrations = await storage.getUserExternalIntegrations(userId);

    res.json({
      cosmicInsights: {
        totalConnections: integrations.length,
        activeConnections: integrations.filter(i => i.status === 'connected').length,
        totalSyncs: analytics.reduce((sum, a) => sum + (a.dataPointsSynced || 0), 0),
        karmaGenerated: analytics.reduce((sum, a) => sum + (a.karmaGenerated || 0), 0),
        mysticalPowerLevel: Math.min(10, Math.floor(analytics.length / 5) + 5),
      },
      analytics: analytics.slice(0, 30), // Last 30 data points
      connections: integrations.map(i => ({
        name: i.integrationDisplayName,
        status: i.status,
        health: i.healthStatus,
        mysticalName: INTEGRATION_CONFIGS[i.integrationName as keyof typeof INTEGRATION_CONFIGS]?.description,
      })),
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to read cosmic insights' });
  }
});

// =============================================
// WEBHOOK ENDPOINTS FOR EXTERNAL TOOLS
// =============================================

/**
 * POST /api/integrations/webhooks/incoming/:integrationName
 * Receive webhooks from external tools
 */
router.post('/webhooks/incoming/:integrationName', async (req, res) => {
  try {
    const { integrationName } = req.params;
    const headers = req.headers as Record<string, string>;
    const body = req.body;
    const rawBody = JSON.stringify(body);

    const result = await WebhookManager.processIncoming(
      integrationName,
      headers,
      body,
      rawBody
    );

    if (result.success) {
      res.json({ message: 'Divine message received and processed', status: 'blessed' });
    } else {
      res.status(400).json({ error: result.message, status: 'cosmic_interference' });
    }
  } catch (error) {
    console.error('Error processing incoming webhook:', error);
    res.status(500).json({ error: 'Failed to process divine message' });
  }
});

export default router;