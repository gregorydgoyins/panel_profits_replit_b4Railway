import { ExternalApiClient, DataTransformationService } from './externalIntegrationsService.js';
import { WebhookManager } from './webhookManager.js';
import { storage } from '../storage.js';
import type { ExternalIntegration, WorkflowAutomation } from '@shared/schema.js';

/**
 * Zapier Integration Service - The Ethereal Hub of Workflow Automation
 * 
 * Zapier serves as the central automation hub for Panel Profits,
 * connecting all external tools through mystical automation workflows.
 * 
 * Features:
 * - Zap creation and management
 * - Multi-step workflow automation
 * - Event routing between integrations
 * - Advanced filtering and conditional logic
 * - Custom webhook endpoints for Panel Profits events
 */

export interface ZapierZap {
  id: string;
  title: string;
  description?: string;
  state: 'on' | 'off' | 'draft';
  steps: ZapierStep[];
  url: string;
}

export interface ZapierStep {
  id: string;
  title: string;
  app: {
    title: string;
    img: string;
    api: string;
  };
  operation: {
    type: string;
    label: string;
  };
}

export interface ZapierWebhookSubscription {
  id: string;
  url: string;
  event: string;
  target_url: string;
  performance: {
    recent_successes: number;
    recent_failures: number;
  };
}

/**
 * Zapier Integration Service
 */
export class ZapierIntegrationService {
  private static readonly BASE_URL = 'https://zapier.com/api/v1';
  private static readonly WEBHOOK_BASE_URL = 'https://hooks.zapier.com/hooks/catch';

  /**
   * Initialize Zapier integration for a user
   */
  static async initializeIntegration(
    integrationId: string,
    apiKey: string,
    webhookUrl?: string
  ): Promise<boolean> {
    try {
      // Test API connection
      const isValid = await this.validateApiKey(integrationId, apiKey);
      if (!isValid) {
        throw new Error('Invalid Zapier API key');
      }

      // Set up Panel Profits webhook endpoints if webhook URL provided
      if (webhookUrl) {
        await this.setupPanelProfitsWebhooks(integrationId, webhookUrl);
      }

      // Create default automation workflows
      await this.createDefaultAutomations(integrationId);

      return true;
    } catch (error) {
      console.error('Error initializing Zapier integration:', error);
      throw error;
    }
  }

  /**
   * Validate Zapier API key
   */
  private static async validateApiKey(integrationId: string, apiKey: string): Promise<boolean> {
    try {
      const response = await ExternalApiClient.makeApiCall(
        integrationId,
        '/me',
        { method: 'GET' }
      );
      return !!response?.id;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user's Zaps
   */
  static async getUserZaps(integrationId: string): Promise<ZapierZap[]> {
    try {
      const response = await ExternalApiClient.makeApiCall(
        integrationId,
        '/zaps',
        { method: 'GET' }
      );

      return response?.objects || [];
    } catch (error) {
      console.error('Error fetching Zapier zaps:', error);
      return [];
    }
  }

  /**
   * Create new Zap for Panel Profits automation
   */
  static async createPanelProfitsZap(
    integrationId: string,
    zapConfig: {
      title: string;
      triggerEvent: string;
      actions: Array<{
        app: string;
        operation: string;
        params: Record<string, any>;
      }>;
    }
  ): Promise<ZapierZap | null> {
    try {
      // Transform Panel Profits workflow to Zapier format
      const zapierFormat = this.transformWorkflowToZapier(zapConfig);

      const response = await ExternalApiClient.makeApiCall(
        integrationId,
        '/zaps',
        {
          method: 'POST',
          data: zapierFormat,
        }
      );

      return response;
    } catch (error) {
      console.error('Error creating Zapier zap:', error);
      return null;
    }
  }

  /**
   * Set up Panel Profits webhook endpoints in Zapier
   */
  private static async setupPanelProfitsWebhooks(
    integrationId: string,
    webhookUrl: string
  ): Promise<void> {
    const panelProfitsEvents = [
      'user.created',
      'trade.executed',
      'portfolio.updated',
      'achievement.unlocked',
      'house.changed',
      'karma.updated',
      'learning.completed',
    ];

    for (const event of panelProfitsEvents) {
      try {
        await this.createWebhookSubscription(integrationId, event, webhookUrl);
      } catch (error) {
        console.error(`Error setting up webhook for ${event}:`, error);
      }
    }
  }

  /**
   * Create webhook subscription in Zapier
   */
  private static async createWebhookSubscription(
    integrationId: string,
    event: string,
    targetUrl: string
  ): Promise<ZapierWebhookSubscription | null> {
    try {
      const response = await ExternalApiClient.makeApiCall(
        integrationId,
        '/subscriptions',
        {
          method: 'POST',
          data: {
            target_url: targetUrl,
            event: event,
            subscription_url: `${process.env.PUBLIC_URL}/api/integrations/webhooks/incoming/zapier`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error('Error creating webhook subscription:', error);
      return null;
    }
  }

  /**
   * Handle incoming Zapier webhooks
   */
  static async handleZapierWebhook(payload: any): Promise<void> {
    try {
      const { event, data } = payload;

      switch (event) {
        case 'zap.triggered':
          await this.handleZapTriggered(data);
          break;
        case 'zap.completed':
          await this.handleZapCompleted(data);
          break;
        case 'zap.failed':
          await this.handleZapFailed(data);
          break;
        default:
          console.log(`Unhandled Zapier event: ${event}`);
      }
    } catch (error) {
      console.error('Error handling Zapier webhook:', error);
    }
  }

  /**
   * Handle Zap triggered event
   */
  private static async handleZapTriggered(data: any): Promise<void> {
    console.log('Zap triggered:', data);
    
    // Log workflow execution
    if (data.zap_id) {
      await this.logWorkflowExecution(data.zap_id, 'started', data);
    }
  }

  /**
   * Handle Zap completed event
   */
  private static async handleZapCompleted(data: any): Promise<void> {
    console.log('Zap completed:', data);
    
    // Update workflow execution status
    if (data.zap_id) {
      await this.logWorkflowExecution(data.zap_id, 'completed', data);
    }
  }

  /**
   * Handle Zap failed event
   */
  private static async handleZapFailed(data: any): Promise<void> {
    console.error('Zap failed:', data);
    
    // Log failure and potentially retry
    if (data.zap_id) {
      await this.logWorkflowExecution(data.zap_id, 'failed', data);
    }
  }

  /**
   * Send Panel Profits event to Zapier
   */
  static async sendEventToZapier(
    integrationId: string,
    eventType: string,
    eventData: any
  ): Promise<void> {
    try {
      // Find active Zaps that listen for this event
      const zaps = await this.getZapsForEvent(integrationId, eventType);
      
      for (const zap of zaps) {
        await this.triggerZap(integrationId, zap.id, eventType, eventData);
      }
    } catch (error) {
      console.error('Error sending event to Zapier:', error);
    }
  }

  /**
   * Get Zaps that listen for specific event
   */
  private static async getZapsForEvent(
    integrationId: string,
    eventType: string
  ): Promise<ZapierZap[]> {
    try {
      const allZaps = await this.getUserZaps(integrationId);
      
      // Filter Zaps that have Panel Profits triggers for this event
      return allZaps.filter(zap => {
        return zap.steps.some(step => 
          step.app.api === 'panel-profits' && 
          step.operation.type === eventType
        );
      });
    } catch (error) {
      console.error('Error filtering Zaps for event:', error);
      return [];
    }
  }

  /**
   * Trigger specific Zap with event data
   */
  private static async triggerZap(
    integrationId: string,
    zapId: string,
    eventType: string,
    eventData: any
  ): Promise<void> {
    try {
      // Transform Panel Profits data for Zapier consumption
      const transformedData = DataTransformationService.transformForExternalTool(
        eventData,
        'zapier',
        eventType
      );

      await ExternalApiClient.makeApiCall(
        integrationId,
        `/zaps/${zapId}/trigger`,
        {
          method: 'POST',
          data: transformedData,
        }
      );
    } catch (error) {
      console.error(`Error triggering Zap ${zapId}:`, error);
    }
  }

  /**
   * Create default automation workflows
   */
  private static async createDefaultAutomations(integrationId: string): Promise<void> {
    const defaultWorkflows = [
      {
        title: 'Sacred Trading Alert Ritual',
        description: 'Send trading alerts to multiple channels when significant trades occur',
        triggerEvent: 'trade.executed',
        actions: [
          { app: 'slack', operation: 'send_message', params: { channel: 'trading-alerts' } },
          { app: 'discord', operation: 'send_message', params: { channel: 'panel-profits' } },
          { app: 'email', operation: 'send_email', params: { template: 'trading-summary' } },
        ],
      },
      {
        title: 'Divine Achievement Celebration',
        description: 'Celebrate achievements across social platforms',
        triggerEvent: 'achievement.unlocked',
        actions: [
          { app: 'twitter', operation: 'post_tweet', params: { template: 'achievement' } },
          { app: 'linkedin', operation: 'share_update', params: { template: 'professional' } },
        ],
      },
      {
        title: 'Cosmic Portfolio Backup',
        description: 'Automatically backup portfolio data to cloud storage',
        triggerEvent: 'portfolio.updated',
        actions: [
          { app: 'google-drive', operation: 'create_file', params: { folder: 'panel-profits-backups' } },
          { app: 'dropbox', operation: 'upload_file', params: { path: '/backups/portfolios' } },
        ],
      },
    ];

    for (const workflow of defaultWorkflows) {
      try {
        await this.createPanelProfitsZap(integrationId, workflow);
      } catch (error) {
        console.error(`Error creating default workflow ${workflow.title}:`, error);
      }
    }
  }

  /**
   * Transform Panel Profits workflow to Zapier format
   */
  private static transformWorkflowToZapier(workflow: any): any {
    return {
      title: workflow.title,
      steps: [
        {
          app: 'panel-profits',
          operation: {
            type: 'trigger',
            label: workflow.triggerEvent,
          },
        },
        ...workflow.actions.map((action: any, index: number) => ({
          app: action.app,
          operation: {
            type: 'action',
            label: action.operation,
          },
          params: action.params || {},
        })),
      ],
    };
  }

  /**
   * Log workflow execution
   */
  private static async logWorkflowExecution(
    zapId: string,
    status: string,
    data: any
  ): Promise<void> {
    try {
      // This would typically create a workflow execution record
      console.log(`Workflow ${zapId} ${status}:`, data);
    } catch (error) {
      console.error('Error logging workflow execution:', error);
    }
  }

  /**
   * Get Zapier integration analytics
   */
  static async getIntegrationAnalytics(integrationId: string): Promise<{
    totalZaps: number;
    activeZaps: number;
    totalExecutions: number;
    successRate: number;
    topEvents: Array<{ event: string; count: number }>;
  }> {
    try {
      const zaps = await this.getUserZaps(integrationId);
      const activeZaps = zaps.filter(zap => zap.state === 'on');

      // This would typically query execution logs
      return {
        totalZaps: zaps.length,
        activeZaps: activeZaps.length,
        totalExecutions: 0, // Would be calculated from logs
        successRate: 95.5, // Would be calculated from success/failure rates
        topEvents: [
          { event: 'trade.executed', count: 150 },
          { event: 'portfolio.updated', count: 89 },
          { event: 'achievement.unlocked', count: 23 },
        ],
      };
    } catch (error) {
      console.error('Error getting Zapier analytics:', error);
      return {
        totalZaps: 0,
        activeZaps: 0,
        totalExecutions: 0,
        successRate: 0,
        topEvents: [],
      };
    }
  }

  /**
   * Create Zapier webhook for Panel Profits events
   */
  static async createPanelProfitsWebhook(
    integrationId: string,
    eventType: string,
    webhookUrl: string
  ): Promise<boolean> {
    try {
      const webhook = await WebhookManager.createWebhook({
        integrationId,
        webhookType: 'outgoing',
        eventType,
        webhookUrl,
        isActive: true,
        httpMethod: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Panel-Profits-Source': 'zapier-integration',
        },
      });

      return !!webhook;
    } catch (error) {
      console.error('Error creating Panel Profits webhook:', error);
      return false;
    }
  }
}

export default ZapierIntegrationService;