import crypto from 'crypto';
import { storage } from '../storage.js';
import type { 
  ExternalIntegration, 
  InsertExternalIntegration,
  IntegrationWebhook,
  InsertIntegrationWebhook,
  IntegrationSyncLog,
  InsertIntegrationSyncLog,
  WorkflowAutomation,
  InsertWorkflowAutomation,
  WorkflowExecution,
  InsertWorkflowExecution,
  IntegrationAnalytics,
  InsertIntegrationAnalytics,
  ExternalUserMapping,
  InsertExternalUserMapping
} from '@shared/schema.js';

/**
 * External Integrations Service for Panel Profits Phase 8
 * 
 * Handles all external tool integrations including:
 * - Secure credential management with encryption
 * - Integration health monitoring and retry logic
 * - Webhook management for bidirectional communication
 * - Data transformation between Panel Profits and external tools
 * - Mystical RPG theming for integration management
 */

// Encryption configuration
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
// Ensure stable encryption key - fallback to a deterministic key for development
const ENCRYPTION_KEY = process.env.INTEGRATION_ENCRYPTION_KEY 
  ? Buffer.from(process.env.INTEGRATION_ENCRYPTION_KEY, 'hex')
  : Buffer.from('panel-profits-integration-key-32b'.padEnd(32, '0'), 'utf8');
const IV_LENGTH = 12; // For GCM, 96-bit IV is recommended

// Supported integration types
export const INTEGRATION_TYPES = {
  WEBFLOW: 'webflow',
  FIGMA: 'figma', 
  RELUME: 'relume',
  ZAPIER: 'zapier'
} as const;

export const INTEGRATION_CONFIGS = {
  [INTEGRATION_TYPES.WEBFLOW]: {
    name: 'Webflow',
    description: 'Sacred Realm of Dynamic Content Creation',
    authType: 'oauth',
    requiredScopes: ['sites:read', 'sites:write', 'cms:read', 'cms:write'],
    mysticalPower: 8,
    houseBonus: 'marketing',
    baseUrl: 'https://api.webflow.com',
    rateLimits: { requests: 1000, window: 3600 }, // 1000 requests per hour
  },
  [INTEGRATION_TYPES.FIGMA]: {
    name: 'Figma',
    description: 'Divine Workshop of Design Mastery',
    authType: 'oauth',
    requiredScopes: ['file_read', 'file_write'],
    mysticalPower: 9,
    houseBonus: 'design',
    baseUrl: 'https://api.figma.com',
    rateLimits: { requests: 500, window: 3600 }, // 500 requests per hour
  },
  [INTEGRATION_TYPES.RELUME]: {
    name: 'Relume',
    description: 'Cosmic Library of Component Wisdom',
    authType: 'api_key',
    requiredScopes: ['components:read', 'components:write'],
    mysticalPower: 7,
    houseBonus: 'wisdom',
    baseUrl: 'https://api.relume.io',
    rateLimits: { requests: 2000, window: 3600 }, // 2000 requests per hour
  },
  [INTEGRATION_TYPES.ZAPIER]: {
    name: 'Zapier',
    description: 'Ethereal Hub of Workflow Automation',
    authType: 'webhook',
    requiredScopes: ['webhooks:read', 'webhooks:write', 'zaps:read'],
    mysticalPower: 10,
    houseBonus: 'automation',
    baseUrl: 'https://zapier.com/api',
    rateLimits: { requests: 5000, window: 3600 }, // 5000 requests per hour
  },
} as const;

/**
 * Credential encryption and decryption utilities
 */
export class CredentialManager {
  /**
   * Encrypt sensitive credentials before storing in database
   */
  static encryptCredentials(credentials: any): string {
    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);
      cipher.setAAD(Buffer.from('panel-profits-integration'));
      
      const credentialString = JSON.stringify(credentials);
      let encrypted = cipher.update(credentialString, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
      console.error('Error encrypting credentials:', error);
      throw new Error('Failed to encrypt integration credentials');
    }
  }

  /**
   * Decrypt credentials when needed for API calls
   */
  static decryptCredentials(encryptedCredentials: string): any {
    try {
      const parts = encryptedCredentials.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted credential format');
      }

      const [ivHex, authTagHex, encrypted] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      
      const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);
      decipher.setAAD(Buffer.from('panel-profits-integration'));
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Error decrypting credentials:', error);
      throw new Error('Failed to decrypt integration credentials. This may indicate the encryption key has changed or the data is corrupted.');
    }
  }

  /**
   * Rotate API keys and credentials periodically
   */
  static async rotateCredentials(integrationId: string): Promise<boolean> {
    try {
      const integration = await storage.getExternalIntegration(integrationId);
      if (!integration) {
        throw new Error('Integration not found');
      }

      // Logic to refresh tokens based on integration type
      const config = INTEGRATION_CONFIGS[integration.integrationName as keyof typeof INTEGRATION_CONFIGS];
      if (!config) {
        throw new Error('Unknown integration type');
      }

      // For OAuth integrations, use refresh token
      if (config.authType === 'oauth') {
        const credentials = this.decryptCredentials(integration.encryptedCredentials!);
        const newCredentials = await this.refreshOAuthToken(integration.integrationName, credentials);
        
        await storage.updateExternalIntegration(integrationId, {
          encryptedCredentials: this.encryptCredentials(newCredentials),
          updatedAt: new Date(),
        });
      }

      return true;
    } catch (error) {
      console.error('Error rotating credentials:', error);
      return false;
    }
  }

  /**
   * Refresh OAuth tokens for supported integrations
   */
  private static async refreshOAuthToken(integrationType: string, credentials: any): Promise<any> {
    const config = INTEGRATION_CONFIGS[integrationType as keyof typeof INTEGRATION_CONFIGS];
    
    // Implementation would depend on specific OAuth flow for each integration
    // This is a placeholder for the actual OAuth refresh logic
    return credentials;
  }
}

/**
 * Integration Health Monitor
 */
export class IntegrationHealthMonitor {
  /**
   * Check health of all active integrations for a user
   */
  static async checkUserIntegrationsHealth(userId: string): Promise<void> {
    try {
      const integrations = await storage.getUserExternalIntegrations(userId);
      
      for (const integration of integrations) {
        if (integration.status === 'connected') {
          await this.checkIntegrationHealth(integration.id);
        }
      }
    } catch (error) {
      console.error('Error checking user integrations health:', error);
    }
  }

  /**
   * Check health of a specific integration
   */
  static async checkIntegrationHealth(integrationId: string): Promise<string> {
    try {
      const integration = await storage.getExternalIntegration(integrationId);
      if (!integration) {
        return 'unknown';
      }

      const config = INTEGRATION_CONFIGS[integration.integrationName as keyof typeof INTEGRATION_CONFIGS];
      if (!config) {
        return 'unknown';
      }

      // Perform health check based on integration type
      const healthResult = await this.performHealthCheck(integration, config);
      
      // Update integration health status
      await storage.updateExternalIntegration(integrationId, {
        healthStatus: healthResult.status,
        lastHealthCheck: new Date(),
        errorMessage: healthResult.error || null,
      });

      return healthResult.status;
    } catch (error) {
      console.error('Error checking integration health:', error);
      return 'unhealthy';
    }
  }

  /**
   * Perform actual health check against external API
   */
  private static async performHealthCheck(integration: ExternalIntegration, config: any): Promise<{ status: string; error?: string }> {
    try {
      const credentials = CredentialManager.decryptCredentials(integration.encryptedCredentials!);
      
      // Make a lightweight API call to test connectivity
      const response = await fetch(`${config.baseUrl}/health`, {
        method: 'GET',
        headers: this.buildAuthHeaders(integration.integrationName, credentials),
        timeout: 10000, // 10 second timeout
      });

      if (response.ok) {
        return { status: 'healthy' };
      } else if (response.status === 401 || response.status === 403) {
        return { status: 'unhealthy', error: 'Authentication failed' };
      } else if (response.status === 429) {
        return { status: 'degraded', error: 'Rate limit exceeded' };
      } else {
        return { status: 'unhealthy', error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { status: 'unhealthy', error: (error as Error).message };
    }
  }

  /**
   * Build authentication headers for API calls
   */
  private static buildAuthHeaders(integrationType: string, credentials: any): Record<string, string> {
    const config = INTEGRATION_CONFIGS[integrationType as keyof typeof INTEGRATION_CONFIGS];
    
    switch (config.authType) {
      case 'oauth':
        return {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json',
        };
      case 'api_key':
        return {
          'Authorization': `Bearer ${credentials.apiKey}`,
          'Content-Type': 'application/json',
        };
      default:
        return {
          'Content-Type': 'application/json',
        };
    }
  }
}

/**
 * External API Client with retry logic and rate limiting
 */
export class ExternalApiClient {
  private static rateLimitCache = new Map<string, { count: number; resetTime: number }>();

  /**
   * Make authenticated API call to external service
   */
  static async makeApiCall(
    integrationId: string,
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      data?: any;
      retries?: number;
      timeout?: number;
    } = {}
  ): Promise<any> {
    const { method = 'GET', data, retries = 3, timeout = 30000 } = options;

    try {
      const integration = await storage.getExternalIntegration(integrationId);
      if (!integration) {
        throw new Error('Integration not found');
      }

      const config = INTEGRATION_CONFIGS[integration.integrationName as keyof typeof INTEGRATION_CONFIGS];
      if (!config) {
        throw new Error('Unknown integration type');
      }

      // Check rate limits
      const rateLimitKey = `${integration.integrationName}:${integration.userId}`;
      if (!this.checkRateLimit(rateLimitKey, config.rateLimits)) {
        throw new Error('Rate limit exceeded');
      }

      const credentials = CredentialManager.decryptCredentials(integration.encryptedCredentials!);
      const url = `${config.baseUrl}${endpoint}`;
      
      const headers = IntegrationHealthMonitor['buildAuthHeaders'](integration.integrationName, credentials);

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const response = await fetch(url, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined,
            timeout,
          });

          // Update rate limit tracking
          this.updateRateLimitCache(rateLimitKey, response);

          if (!response.ok) {
            if (response.status === 429 && attempt < retries) {
              // Rate limited, wait and retry
              const retryAfter = parseInt(response.headers.get('Retry-After') || '1') * 1000;
              await new Promise(resolve => setTimeout(resolve, retryAfter));
              continue;
            }
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
          }

          const result = await response.json();
          
          // Log successful API call
          await this.logApiCall(integrationId, endpoint, method, 'success', response.status);
          
          return result;
        } catch (error) {
          if (attempt === retries) {
            // Log failed API call
            await this.logApiCall(integrationId, endpoint, method, 'error', 0, (error as Error).message);
            throw error;
          }
          
          // Exponential backoff
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    } catch (error) {
      console.error('External API call failed:', error);
      throw error;
    }
  }

  /**
   * Check if API call is within rate limits
   */
  private static checkRateLimit(key: string, limits: { requests: number; window: number }): boolean {
    const now = Date.now();
    const cached = this.rateLimitCache.get(key);
    
    if (!cached || now > cached.resetTime) {
      this.rateLimitCache.set(key, { count: 1, resetTime: now + (limits.window * 1000) });
      return true;
    }
    
    if (cached.count >= limits.requests) {
      return false;
    }
    
    cached.count++;
    return true;
  }

  /**
   * Update rate limit cache based on response headers
   */
  private static updateRateLimitCache(key: string, response: Response): void {
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    
    if (remaining && reset) {
      const resetTime = parseInt(reset) * 1000;
      const count = Math.max(0, parseInt(remaining));
      this.rateLimitCache.set(key, { count, resetTime });
    }
  }

  /**
   * Log API call for analytics
   */
  private static async logApiCall(
    integrationId: string,
    endpoint: string,
    method: string,
    status: 'success' | 'error',
    httpStatus: number,
    errorMessage?: string
  ): Promise<void> {
    try {
      // This would be implemented to track API usage
      console.log(`API Call: ${method} ${endpoint} - ${status} (${httpStatus})`);
    } catch (error) {
      console.error('Error logging API call:', error);
    }
  }
}

/**
 * Data Transformation Service
 */
export class DataTransformationService {
  /**
   * Transform Panel Profits data for external tool consumption
   */
  static transformForExternalTool(
    data: any,
    targetIntegration: string,
    dataType: string
  ): any {
    const transformer = this.getTransformer(targetIntegration, dataType);
    return transformer(data);
  }

  /**
   * Transform external tool data for Panel Profits consumption
   */
  static transformFromExternalTool(
    data: any,
    sourceIntegration: string,
    dataType: string
  ): any {
    const transformer = this.getInverseTransformer(sourceIntegration, dataType);
    return transformer(data);
  }

  /**
   * Get transformer function for specific integration and data type
   */
  private static getTransformer(integration: string, dataType: string): (data: any) => any {
    const transformerKey = `${integration}_${dataType}`;
    
    const transformers: Record<string, (data: any) => any> = {
      'webflow_portfolio': (data) => ({
        name: data.name,
        description: data.description,
        totalValue: parseFloat(data.totalValue),
        holdings: data.holdings?.map((h: any) => ({
          asset: h.assetName,
          quantity: parseFloat(h.quantity),
          value: parseFloat(h.currentValue),
        })) || [],
      }),
      'figma_component': (data) => ({
        name: data.name,
        type: 'component',
        properties: data.metadata || {},
        variants: data.variants || [],
      }),
      'zapier_webhook': (data) => ({
        event_type: data.eventType,
        user_id: data.userId,
        data: data.payload,
        timestamp: new Date().toISOString(),
      }),
    };

    return transformers[transformerKey] || ((data) => data);
  }

  /**
   * Get inverse transformer for external data
   */
  private static getInverseTransformer(integration: string, dataType: string): (data: any) => any {
    // Inverse transformations for data coming from external tools
    const transformerKey = `${integration}_${dataType}_inverse`;
    
    const transformers: Record<string, (data: any) => any> = {
      'webflow_contact_inverse': (data) => ({
        userId: data.userId || null,
        email: data.email,
        firstName: data.name?.split(' ')[0] || '',
        lastName: data.name?.split(' ').slice(1).join(' ') || '',
        source: 'webflow',
        metadata: {
          webflowId: data.id,
          formName: data.formName,
        },
      }),
    };

    return transformers[transformerKey] || ((data) => data);
  }
}

/**
 * Main External Integrations Service
 */
export class ExternalIntegrationsService {
  /**
   * Initialize a new external integration
   */
  static async createIntegration(
    userId: string,
    integrationType: string,
    credentials: any,
    configuration: any = {}
  ): Promise<ExternalIntegration> {
    try {
      const config = INTEGRATION_CONFIGS[integrationType as keyof typeof INTEGRATION_CONFIGS];
      if (!config) {
        throw new Error('Unsupported integration type');
      }

      const encryptedCredentials = CredentialManager.encryptCredentials(credentials);
      
      const integrationData: InsertExternalIntegration = {
        userId,
        integrationName: integrationType,
        integrationDisplayName: config.name,
        status: 'pending',
        authType: config.authType,
        encryptedCredentials,
        authScopes: config.requiredScopes,
        configuration,
        healthStatus: 'unknown',
      };

      const integration = await storage.createExternalIntegration(integrationData);
      
      // Perform initial health check
      await IntegrationHealthMonitor.checkIntegrationHealth(integration.id);
      
      return integration;
    } catch (error) {
      console.error('Error creating integration:', error);
      throw error;
    }
  }

  /**
   * Synchronize data between Panel Profits and external tool
   */
  static async synchronizeData(
    integrationId: string,
    syncType: 'full' | 'incremental',
    direction: 'import' | 'export' | 'bidirectional',
    dataType: string
  ): Promise<IntegrationSyncLog> {
    const syncStartTime = Date.now();
    
    try {
      const syncLogData: InsertIntegrationSyncLog = {
        integrationId,
        syncType,
        direction,
        status: 'started',
        dataType,
        startedAt: new Date(),
      };

      const syncLog = await storage.createIntegrationSyncLog(syncLogData);
      
      // Update status to in_progress
      await storage.updateIntegrationSyncLog(syncLog.id, {
        status: 'in_progress',
      });

      // Perform actual synchronization based on direction
      let recordsProcessed = 0;
      let recordsSuccessful = 0;
      let recordsFailed = 0;

      if (direction === 'export' || direction === 'bidirectional') {
        const exportResult = await this.exportDataToExternalTool(integrationId, dataType, syncType);
        recordsProcessed += exportResult.processed;
        recordsSuccessful += exportResult.successful;
        recordsFailed += exportResult.failed;
      }

      if (direction === 'import' || direction === 'bidirectional') {
        const importResult = await this.importDataFromExternalTool(integrationId, dataType, syncType);
        recordsProcessed += importResult.processed;
        recordsSuccessful += importResult.successful;
        recordsFailed += importResult.failed;
      }

      const syncEndTime = Date.now();
      const durationMs = syncEndTime - syncStartTime;

      // Update sync log with results
      const completedSyncLog = await storage.updateIntegrationSyncLog(syncLog.id, {
        status: recordsFailed > 0 ? 'completed' : 'completed',
        recordsProcessed,
        recordsSuccessful,
        recordsFailed,
        durationMs,
        completedAt: new Date(),
      });

      return completedSyncLog!;
    } catch (error) {
      // Update sync log with error
      await storage.updateIntegrationSyncLog(integrationId, {
        status: 'failed',
        errorMessage: (error as Error).message,
        completedAt: new Date(),
      });
      
      console.error('Sync failed:', error);
      throw error;
    }
  }

  /**
   * Export data from Panel Profits to external tool
   */
  private static async exportDataToExternalTool(
    integrationId: string,
    dataType: string,
    syncType: string
  ): Promise<{ processed: number; successful: number; failed: number }> {
    // Implementation would depend on specific data type and integration
    // This is a placeholder for the actual export logic
    return { processed: 0, successful: 0, failed: 0 };
  }

  /**
   * Import data from external tool to Panel Profits
   */
  private static async importDataFromExternalTool(
    integrationId: string,
    dataType: string,
    syncType: string
  ): Promise<{ processed: number; successful: number; failed: number }> {
    // Implementation would depend on specific data type and integration
    // This is a placeholder for the actual import logic
    return { processed: 0, successful: 0, failed: 0 };
  }

  /**
   * Get integration analytics for user
   */
  static async getIntegrationAnalytics(
    userId: string,
    timeframe: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<IntegrationAnalytics[]> {
    return await storage.getUserIntegrationAnalytics(userId, { timeframe });
  }

  /**
   * Test integration connection
   */
  static async testConnection(integrationId: string): Promise<{ success: boolean; message: string }> {
    try {
      const healthStatus = await IntegrationHealthMonitor.checkIntegrationHealth(integrationId);
      
      return {
        success: healthStatus === 'healthy',
        message: healthStatus === 'healthy' 
          ? 'Connection successful' 
          : `Connection failed: ${healthStatus}`,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }
}

export default ExternalIntegrationsService;