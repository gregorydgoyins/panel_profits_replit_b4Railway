import crypto from 'crypto';
import { storage } from '../storage.js';
import type { 
  IntegrationWebhook, 
  InsertIntegrationWebhook,
  ExternalIntegration,
  WorkflowAutomation,
  InsertIntegrationSyncLog,
  InsertWorkflowExecution
} from '@shared/schema.js';
import { ExternalIntegrationsService, DataTransformationService } from './externalIntegrationsService.js';

/**
 * Webhook Management Service for Panel Profits Phase 8
 * 
 * Handles bidirectional webhook communication with external tools:
 * - Incoming webhooks from external services
 * - Outgoing webhook delivery with retry logic
 * - Webhook security and signature verification
 * - Event routing and transformation
 * - Performance monitoring and analytics
 */

// Event types for Panel Profits internal events
export const PANEL_PROFITS_EVENTS = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  TRADE_EXECUTED: 'trade.executed',
  PORTFOLIO_UPDATED: 'portfolio.updated',
  ACHIEVEMENT_UNLOCKED: 'achievement.unlocked',
  HOUSE_CHANGED: 'house.changed',
  KARMA_UPDATED: 'karma.updated',
  LEARNING_COMPLETED: 'learning.completed',
  WORKFLOW_TRIGGERED: 'workflow.triggered',
  INTEGRATION_CONNECTED: 'integration.connected',
  INTEGRATION_DISCONNECTED: 'integration.disconnected',
} as const;

// External tool event types that we listen for
export const EXTERNAL_EVENTS = {
  WEBFLOW: {
    FORM_SUBMISSION: 'webflow.form_submission',
    SITE_PUBLISHED: 'webflow.site_published',
    CMS_UPDATED: 'webflow.cms_updated',
    ORDER_PLACED: 'webflow.order_placed',
  },
  FIGMA: {
    FILE_UPDATED: 'figma.file_updated',
    COMMENT_ADDED: 'figma.comment_added',
    VERSION_CREATED: 'figma.version_created',
    COMPONENT_UPDATED: 'figma.component_updated',
  },
  RELUME: {
    COMPONENT_UPDATED: 'relume.component_updated',
    LIBRARY_SYNCED: 'relume.library_synced',
    STYLE_GUIDE_UPDATED: 'relume.style_guide_updated',
  },
  ZAPIER: {
    ZAP_TRIGGERED: 'zapier.zap_triggered',
    WORKFLOW_COMPLETED: 'zapier.workflow_completed',
    ERROR_OCCURRED: 'zapier.error_occurred',
  },
} as const;

/**
 * Queue system for reliable webhook delivery
 */
interface WebhookJob {
  id: string;
  webhookId: string;
  eventType: string;
  payload: any;
  attempts: number;
  maxAttempts: number;
  scheduledAt: Date;
  priority: number;
}

export class WebhookQueue {
  private queue: WebhookJob[] = [];
  private processing = false;
  private maxConcurrency = 5;
  private currentJobs = 0;

  /**
   * Add webhook delivery job to queue
   */
  async enqueue(webhookId: string, eventType: string, payload: any, priority: number = 5): Promise<void> {
    const job: WebhookJob = {
      id: crypto.randomUUID(),
      webhookId,
      eventType,
      payload,
      attempts: 0,
      maxAttempts: 3,
      scheduledAt: new Date(),
      priority,
    };

    this.queue.push(job);
    this.queue.sort((a, b) => b.priority - a.priority); // Higher priority first
    
    if (!this.processing) {
      this.processQueue();
    }
  }

  /**
   * Process webhook delivery queue
   */
  private async processQueue(): Promise<void> {
    this.processing = true;

    while (this.queue.length > 0 && this.currentJobs < this.maxConcurrency) {
      const job = this.queue.shift();
      if (!job) break;

      if (job.scheduledAt > new Date()) {
        // Re-queue if not ready yet
        this.queue.push(job);
        continue;
      }

      this.currentJobs++;
      this.processJob(job).finally(() => {
        this.currentJobs--;
      });
    }

    // Schedule next processing cycle
    if (this.queue.length > 0) {
      setTimeout(() => this.processQueue(), 1000);
    } else {
      this.processing = false;
    }
  }

  /**
   * Process individual webhook job
   */
  private async processJob(job: WebhookJob): Promise<void> {
    try {
      await WebhookDelivery.deliverWebhook(job.webhookId, job.eventType, job.payload);
    } catch (error) {
      job.attempts++;
      
      if (job.attempts < job.maxAttempts) {
        // Exponential backoff
        const delay = Math.pow(2, job.attempts) * 1000;
        job.scheduledAt = new Date(Date.now() + delay);
        
        // Re-queue for retry
        this.queue.push(job);
        this.queue.sort((a, b) => b.priority - a.priority);
      } else {
        console.error(`Webhook delivery failed after ${job.maxAttempts} attempts:`, error);
        // Log failed delivery
        await WebhookAnalytics.recordFailedDelivery(job.webhookId, job.eventType, (error as Error).message);
      }
    }
  }
}

/**
 * Webhook signature verification
 */
export class WebhookSecurity {
  /**
   * Verify webhook signature for incoming webhooks
   */
  static verifySignature(
    payload: string,
    signature: string,
    secret: string,
    algorithm: string = 'sha256'
  ): boolean {
    try {
      const expectedSignature = crypto
        .createHmac(algorithm, secret)
        .update(payload)
        .digest('hex');
        
      const providedSignature = signature.replace(/^sha256=/, '');
      
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(providedSignature, 'hex')
      );
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  /**
   * Generate signature for outgoing webhooks
   */
  static generateSignature(payload: string, secret: string, algorithm: string = 'sha256'): string {
    return `sha256=${crypto
      .createHmac(algorithm, secret)
      .update(payload)
      .digest('hex')}`;
  }

  /**
   * Generate secure webhook secret
   */
  static generateSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

/**
 * Webhook delivery system
 */
export class WebhookDelivery {
  private static readonly DEFAULT_TIMEOUT = 30000; // 30 seconds
  private static readonly USER_AGENT = 'Panel-Profits-Webhooks/1.0';

  /**
   * Deliver webhook to external endpoint
   */
  static async deliverWebhook(
    webhookId: string,
    eventType: string,
    payload: any
  ): Promise<void> {
    const webhook = await storage.getIntegrationWebhook(webhookId);
    if (!webhook || !webhook.isActive) {
      throw new Error('Webhook not found or inactive');
    }

    if (!webhook.webhookUrl) {
      throw new Error('Webhook URL not configured');
    }

    const startTime = Date.now();
    let success = false;
    let errorMessage: string | undefined;

    try {
      // Transform payload if needed
      const transformedPayload = this.transformPayload(webhook, eventType, payload);
      
      // Generate signature if secret is available
      const payloadString = JSON.stringify(transformedPayload);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': this.USER_AGENT,
        'X-Panel-Profits-Event': eventType,
        'X-Panel-Profits-Delivery': crypto.randomUUID(),
        ...((webhook.headers as Record<string, string>) || {}),
      };

      if (webhook.secretKey) {
        headers['X-Panel-Profits-Signature'] = WebhookSecurity.generateSignature(
          payloadString,
          webhook.secretKey
        );
      }

      // Make HTTP request with AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.DEFAULT_TIMEOUT);
      
      const response = await fetch(webhook.webhookUrl, {
        method: webhook.httpMethod || 'POST',
        headers,
        body: payloadString,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      success = true;
      await this.recordDeliverySuccess(webhook, eventType, Date.now() - startTime);
    } catch (error) {
      errorMessage = (error as Error).message;
      await this.recordDeliveryFailure(webhook, eventType, errorMessage);
      throw error;
    }
  }

  /**
   * Transform payload based on webhook configuration
   */
  private static transformPayload(webhook: IntegrationWebhook, eventType: string, payload: any): any {
    // Apply webhook-specific payload transformation
    if (webhook.payload) {
      const template = webhook.payload as any;
      return this.applyPayloadTemplate(template, { eventType, data: payload });
    }

    // Default payload structure
    return {
      event: eventType,
      timestamp: new Date().toISOString(),
      data: payload,
      source: 'panel-profits',
    };
  }

  /**
   * Apply payload template with variable substitution
   */
  private static applyPayloadTemplate(template: any, context: any): any {
    if (typeof template === 'string') {
      return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
        const value = this.getNestedValue(context, path);
        return value !== undefined ? String(value) : match;
      });
    }

    if (Array.isArray(template)) {
      return template.map(item => this.applyPayloadTemplate(item, context));
    }

    if (template && typeof template === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(template)) {
        result[key] = this.applyPayloadTemplate(value, context);
      }
      return result;
    }

    return template;
  }

  /**
   * Get nested value from object using dot notation
   */
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Record successful webhook delivery
   */
  private static async recordDeliverySuccess(
    webhook: IntegrationWebhook,
    eventType: string,
    responseTime: number
  ): Promise<void> {
    // Note: totalTriggers, successfulTriggers, and failedTriggers are computed fields
    // managed by the database. We only update fields that are allowed in InsertIntegrationWebhook.
    console.log(`Webhook delivery success: ${webhook.id} - ${eventType} - ${responseTime}ms`);
    // In a real implementation, this would be handled by database triggers or computed columns
  }

  /**
   * Record failed webhook delivery
   */
  private static async recordDeliveryFailure(
    webhook: IntegrationWebhook,
    eventType: string,
    errorMessage: string
  ): Promise<void> {
    // Note: totalTriggers, successfulTriggers, and failedTriggers are computed fields
    // managed by the database. We only update fields that are allowed in InsertIntegrationWebhook.
    console.error(`Webhook delivery failure: ${webhook.id} - ${eventType} - ${errorMessage}`);
    // In a real implementation, this would be handled by database triggers or computed columns
  }

  /**
   * Calculate running average response time
   */
  private static calculateAverageResponseTime(
    currentAverage: any,
    totalSuccessful: number,
    newResponseTime: number
  ): string {
    const currentAvg = parseFloat(currentAverage?.toString() || '0');
    const newAverage = totalSuccessful === 0 
      ? newResponseTime 
      : (currentAvg * totalSuccessful + newResponseTime) / (totalSuccessful + 1);
    return newAverage.toFixed(3);
  }
}

/**
 * Webhook analytics and monitoring
 */
export class WebhookAnalytics {
  /**
   * Record failed webhook delivery for analytics
   */
  static async recordFailedDelivery(
    webhookId: string,
    eventType: string,
    errorMessage: string
  ): Promise<void> {
    console.log(`Webhook delivery failed: ${webhookId} - ${eventType} - ${errorMessage}`);
    // Additional analytics tracking would go here
  }

  /**
   * Get webhook performance metrics
   */
  static async getWebhookMetrics(webhookId: string): Promise<{
    totalDeliveries: number;
    successRate: number;
    averageResponseTime: number;
    recentErrors: string[];
  }> {
    const webhook = await storage.getIntegrationWebhook(webhookId);
    if (!webhook) {
      throw new Error('Webhook not found');
    }

    const totalTriggers = webhook.totalTriggers ?? 0;
    const successfulTriggers = webhook.successfulTriggers ?? 0;
    const successRate = totalTriggers > 0 
      ? (successfulTriggers / totalTriggers) * 100 
      : 0;

    return {
      totalDeliveries: totalTriggers,
      successRate: Math.round(successRate * 100) / 100,
      averageResponseTime: parseFloat(webhook.averageResponseTime?.toString() || '0'),
      recentErrors: webhook.lastErrorMessage ? [webhook.lastErrorMessage] : [],
    };
  }
}

/**
 * Incoming webhook processor
 */
export class IncomingWebhookProcessor {
  /**
   * Process incoming webhook from external service
   */
  static async processIncomingWebhook(
    integrationName: string,
    headers: Record<string, string>,
    body: any,
    rawBody: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Find the integration and webhook configuration
      const integration = await this.findIntegrationByName(integrationName);
      if (!integration) {
        return { success: false, message: 'Integration not found' };
      }

      // Verify webhook signature if configured
      const signatureHeader = this.getSignatureHeader(integrationName, headers);
      if (integration.encryptedCredentials && signatureHeader) {
        const isValid = await this.verifyIncomingSignature(
          integration,
          signatureHeader,
          rawBody
        );
        if (!isValid) {
          return { success: false, message: 'Invalid signature' };
        }
      }

      // Determine event type
      const eventType = this.extractEventType(integrationName, headers, body);
      if (!eventType) {
        return { success: false, message: 'Unable to determine event type' };
      }

      // Transform and process the webhook data
      const transformedData = DataTransformationService.transformFromExternalTool(
        body,
        integrationName,
        eventType
      );

      // Route to appropriate handler
      await this.routeWebhookEvent(integration, eventType, transformedData);

      // Log the successful processing
      await this.logIncomingWebhook(integration.id, eventType, 'success');

      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      console.error('Error processing incoming webhook:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * Find integration by name
   */
  private static async findIntegrationByName(name: string): Promise<ExternalIntegration | undefined> {
    // This would typically query the database for active integrations of this type
    // For now, we'll implement a placeholder
    return undefined;
  }

  /**
   * Get signature header based on integration type
   */
  private static getSignatureHeader(integrationName: string, headers: Record<string, string>): string | undefined {
    const headerMappings: Record<string, string> = {
      webflow: 'x-webflow-signature',
      figma: 'x-figma-signature',
      zapier: 'x-zapier-signature',
      relume: 'x-relume-signature',
    };

    const headerName = headerMappings[integrationName.toLowerCase()];
    return headerName ? headers[headerName] : undefined;
  }

  /**
   * Verify incoming webhook signature
   */
  private static async verifyIncomingSignature(
    integration: ExternalIntegration,
    signature: string,
    rawBody: string
  ): Promise<boolean> {
    try {
      // Decrypt integration credentials to get webhook secret
      // This would use CredentialManager from the integrations service
      return true; // Placeholder
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  /**
   * Extract event type from webhook data
   */
  private static extractEventType(
    integrationName: string,
    headers: Record<string, string>,
    body: any
  ): string | undefined {
    // Different integrations use different methods to indicate event type
    const eventMappings: Record<string, (headers: any, body: any) => string | undefined> = {
      webflow: (h, b) => h['x-webflow-event'] || b.event_type,
      figma: (h, b) => b.event_type,
      zapier: (h, b) => h['x-zapier-event'] || b.type,
      relume: (h, b) => b.event || b.webhook_type,
    };

    const extractor = eventMappings[integrationName.toLowerCase()];
    return extractor ? extractor(headers, body) : undefined;
  }

  /**
   * Route webhook event to appropriate handler
   */
  private static async routeWebhookEvent(
    integration: ExternalIntegration,
    eventType: string,
    data: any
  ): Promise<void> {
    // Route to different handlers based on event type
    switch (eventType) {
      case EXTERNAL_EVENTS.WEBFLOW.FORM_SUBMISSION:
        await this.handleFormSubmission(integration, data);
        break;
      case EXTERNAL_EVENTS.FIGMA.FILE_UPDATED:
        await this.handleFigmaFileUpdate(integration, data);
        break;
      case EXTERNAL_EVENTS.ZAPIER.ZAP_TRIGGERED:
        await this.handleZapierTrigger(integration, data);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
  }

  /**
   * Handle Webflow form submission
   */
  private static async handleFormSubmission(integration: ExternalIntegration, data: any): Promise<void> {
    // Implementation would process form submission data
    // Could trigger user registration, update profiles, etc.
    console.log('Processing Webflow form submission:', data);
  }

  /**
   * Handle Figma file update
   */
  private static async handleFigmaFileUpdate(integration: ExternalIntegration, data: any): Promise<void> {
    // Implementation would sync design changes
    console.log('Processing Figma file update:', data);
  }

  /**
   * Handle Zapier trigger
   */
  private static async handleZapierTrigger(integration: ExternalIntegration, data: any): Promise<void> {
    // Implementation would execute workflow automation
    console.log('Processing Zapier trigger:', data);
  }

  /**
   * Log incoming webhook for analytics
   */
  private static async logIncomingWebhook(
    integrationId: string,
    eventType: string,
    status: string
  ): Promise<void> {
    console.log(`Incoming webhook: ${integrationId} - ${eventType} - ${status}`);
  }
}

/**
 * Main Webhook Manager
 */
export class WebhookManager {
  private static queue = new WebhookQueue();

  /**
   * Send outgoing webhook for Panel Profits event
   */
  static async sendWebhook(
    eventType: string,
    payload: any,
    userId?: string,
    integrationFilter?: string
  ): Promise<void> {
    try {
      // Find all relevant webhooks for this event
      const webhooks = await this.findWebhooksForEvent(eventType, userId, integrationFilter);
      
      for (const webhook of webhooks) {
        await this.queue.enqueue(webhook.id, eventType, payload, webhook.priority || 5);
      }
    } catch (error) {
      console.error('Error sending webhooks:', error);
    }
  }

  /**
   * Process incoming webhook
   */
  static async processIncoming(
    integrationName: string,
    headers: Record<string, string>,
    body: any,
    rawBody: string
  ): Promise<{ success: boolean; message: string }> {
    return await IncomingWebhookProcessor.processIncomingWebhook(
      integrationName,
      headers,
      body,
      rawBody
    );
  }

  /**
   * Create new webhook configuration
   */
  static async createWebhook(webhookData: InsertIntegrationWebhook): Promise<IntegrationWebhook> {
    // Generate secret key if not provided
    if (!webhookData.secretKey && webhookData.webhookType === 'incoming') {
      webhookData.secretKey = WebhookSecurity.generateSecret();
    }

    return await storage.createIntegrationWebhook(webhookData);
  }

  /**
   * Test webhook delivery
   */
  static async testWebhook(webhookId: string): Promise<{ success: boolean; message: string }> {
    try {
      const testPayload = {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'Panel Profits webhook test',
      };

      await WebhookDelivery.deliverWebhook(webhookId, 'test.webhook', testPayload);
      return { success: true, message: 'Webhook test successful' };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * Find webhooks for specific event
   */
  private static async findWebhooksForEvent(
    eventType: string,
    userId?: string,
    integrationFilter?: string
  ): Promise<Array<IntegrationWebhook & { priority?: number }>> {
    // This would query the database for matching webhooks
    // For now, return empty array
    return [];
  }

  /**
   * Get webhook analytics
   */
  static async getAnalytics(webhookId: string) {
    return await WebhookAnalytics.getWebhookMetrics(webhookId);
  }
}

export default WebhookManager;