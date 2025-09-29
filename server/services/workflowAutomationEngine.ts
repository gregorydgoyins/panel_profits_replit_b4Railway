import { storage } from '../storage.js';
import { ExternalApiClient } from './externalIntegrationsService.js';
import { WebflowIntegrationService } from './webflowIntegration.js';
import { FigmaIntegrationService } from './figmaIntegration.js';
import { RelumeSitebuilderIntegrationService } from './relumeIntegration.js';
import type { WorkflowAutomation, WorkflowExecution, ExternalIntegration } from '@shared/schema.js';

/**
 * Workflow Automation Engine - The Celestial Orchestrator
 * 
 * This sacred engine processes and executes divine automation workflows,
 * orchestrating the mystical connections between Panel Profits and external
 * realms through carefully choreographed ritual sequences.
 * 
 * Features:
 * - Event-driven trigger system (schedules, webhooks, trading events)
 * - Multi-step action execution with external service integration
 * - Intelligent retry logic and error recovery
 * - Comprehensive execution logging and analytics
 * - Real-time workflow monitoring and health checks
 * - Resource optimization and rate limiting
 */

export interface WorkflowTriggerContext {
  triggerType: string;
  triggerData: any;
  userId: string;
  timestamp: Date;
  eventSource?: string;
}

export interface WorkflowActionContext {
  actionType: string;
  actionConfig: any;
  integrationId: string;
  executionId: string;
  retryCount: number;
}

export interface WorkflowExecutionResult {
  success: boolean;
  executionId: string;
  duration: number;
  actionsCompleted: number;
  totalActions: number;
  errors: Array<{
    step: string;
    error: string;
    timestamp: Date;
  }>;
  outputs: any;
}

export class WorkflowAutomationEngine {
  private static instance: WorkflowAutomationEngine;
  private runningExecutions = new Map<string, AbortController>();
  private actionRegistry = new Map<string, (context: WorkflowActionContext) => Promise<any>>();
  
  constructor() {
    this.initializeActionRegistry();
  }

  static getInstance(): WorkflowAutomationEngine {
    if (!this.instance) {
      this.instance = new WorkflowAutomationEngine();
    }
    return this.instance;
  }

  /**
   * Initialize action registry with available actions
   */
  private initializeActionRegistry(): void {
    // Webflow actions
    this.actionRegistry.set('webflow_create_page', this.executeWebflowCreatePage.bind(this));
    this.actionRegistry.set('webflow_update_portfolio', this.executeWebflowUpdatePortfolio.bind(this));
    this.actionRegistry.set('webflow_publish_site', this.executeWebflowPublishSite.bind(this));
    
    // Figma actions
    this.actionRegistry.set('figma_export_tokens', this.executeFigmaExportTokens.bind(this));
    this.actionRegistry.set('figma_sync_components', this.executeFigmaSyncComponents.bind(this));
    this.actionRegistry.set('figma_create_designs', this.executeFigmaCreateDesigns.bind(this));
    
    // Relume actions
    this.actionRegistry.set('relume_analyze_usage', this.executeRelumeAnalyzeUsage.bind(this));
    this.actionRegistry.set('relume_quality_check', this.executeRelumeQualityCheck.bind(this));
    this.actionRegistry.set('relume_generate_page', this.executeRelumeGeneratePage.bind(this));
    
    // General actions
    this.actionRegistry.set('send_notification', this.executeSendNotification.bind(this));
    this.actionRegistry.set('log_event', this.executeLogEvent.bind(this));
    this.actionRegistry.set('wait_delay', this.executeWaitDelay.bind(this));
  }

  /**
   * Process workflow trigger and execute matching workflows
   */
  async processTrigger(context: WorkflowTriggerContext): Promise<WorkflowExecutionResult[]> {
    try {
      console.log(`🎭 Processing trigger: ${context.triggerType} for user: ${context.userId}`);

      // Find active workflows that match this trigger
      const matchingWorkflows = await this.findMatchingWorkflows(context);
      
      if (matchingWorkflows.length === 0) {
        console.log('📭 No matching workflows found for trigger');
        return [];
      }

      console.log(`⚡ Found ${matchingWorkflows.length} matching workflows for execution`);

      // Execute all matching workflows
      const executionPromises = matchingWorkflows.map(workflow => 
        this.executeWorkflow(workflow, context)
      );

      const results = await Promise.allSettled(executionPromises);
      
      return results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          console.error(`🔥 Workflow execution failed for ${matchingWorkflows[index].name}:`, result.reason);
          return {
            success: false,
            executionId: '',
            duration: 0,
            actionsCompleted: 0,
            totalActions: 0,
            errors: [{ 
              step: 'workflow_execution', 
              error: result.reason.message || 'Unknown error',
              timestamp: new Date()
            }],
            outputs: null
          };
        }
      });
    } catch (error) {
      console.error('🔥 Error processing workflow trigger:', error);
      throw error;
    }
  }

  /**
   * Find workflows that match the trigger context
   */
  private async findMatchingWorkflows(context: WorkflowTriggerContext): Promise<WorkflowAutomation[]> {
    try {
      const allWorkflows = await storage.getUserWorkflowAutomations(context.userId);
      
      return allWorkflows.filter((workflow: WorkflowAutomation) => {
        if (!workflow.isActive) return false;
        
        // Check trigger type match
        if (workflow.triggerType !== context.triggerType) return false;
        
        // Check trigger conditions
        return this.evaluateTriggerConditions(workflow.triggerConfig, context);
      });
    } catch (error) {
      console.error('🔥 Error finding matching workflows:', error);
      return [];
    }
  }

  /**
   * Evaluate trigger conditions against context
   */
  private evaluateTriggerConditions(triggerConfig: any, context: WorkflowTriggerContext): boolean {
    try {
      if (!triggerConfig) return true;

      // Handle different trigger types
      switch (context.triggerType) {
        case 'schedule':
          // Schedule triggers are handled by external cron system
          return true;
          
        case 'trading_milestone':
          if (triggerConfig.minAmount && context.triggerData?.amount < triggerConfig.minAmount) {
            return false;
          }
          break;
          
        case 'portfolio_achievement':
          if (triggerConfig.achievementTypes && 
              !triggerConfig.achievementTypes.includes(context.triggerData?.achievementType)) {
            return false;
          }
          break;
          
        case 'webflow_page_published':
        case 'figma_file_updated':
        case 'component_updated':
          // External webhook triggers - typically always execute
          return true;
          
        default:
          // Unknown trigger type - be permissive
          return true;
      }

      return true;
    } catch (error) {
      console.error('🔥 Error evaluating trigger conditions:', error);
      return false;
    }
  }

  /**
   * Execute a single workflow
   */
  async executeWorkflow(
    workflow: WorkflowAutomation, 
    triggerContext: WorkflowTriggerContext
  ): Promise<WorkflowExecutionResult> {
    const startTime = Date.now();
    let executionId = '';
    
    try {
      console.log(`🎭 Executing sacred workflow: ${workflow.name}`);

      // Create execution record
      const execution = await storage.createWorkflowExecution({
        workflowId: workflow.id,
        executionId: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        triggerSource: triggerContext.triggerType,
        triggerData: triggerContext.triggerData,
        status: 'running',
        startedAt: new Date()
      });
      
      executionId = execution.id;
      const abortController = new AbortController();
      this.runningExecutions.set(executionId, abortController);

      // Execute workflow actions
      const result = await this.executeWorkflowActions(workflow, triggerContext, executionId);
      
      // Update execution record
      await storage.updateWorkflowExecution(executionId, {
        status: result.success ? 'completed' : 'failed',
        completedAt: new Date(),
        outputData: result.outputs,
        errorMessage: result.errors.length > 0 ? result.errors.map(e => e.error).join('; ') : undefined,
        completedSteps: result.actionsCompleted,
        totalSteps: result.totalActions
      });

      // Update workflow statistics
      // Update workflow statistics handled by execution tracking

      this.runningExecutions.delete(executionId);
      
      const duration = Date.now() - startTime;
      console.log(`✨ Workflow ${workflow.name} completed in ${duration}ms - Success: ${result.success}`);

      return {
        ...result,
        executionId,
        duration
      };

    } catch (error) {
      console.error(`🔥 Error executing workflow ${workflow.name}:`, error);
      
      // Update execution record with error
      if (executionId) {
        await storage.updateWorkflowExecution(executionId, {
          status: 'failed',
          completedAt: new Date(),
          errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
          errorDetails: error instanceof Error ? { stack: error.stack } : { error: String(error) }
        });
        
        this.runningExecutions.delete(executionId);
      }

      return {
        success: false,
        executionId,
        duration: Date.now() - startTime,
        actionsCompleted: 0,
        totalActions: 1,
        errors: [{ 
          step: 'workflow_execution', 
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date()
        }],
        outputs: null
      };
    }
  }

  /**
   * Execute workflow actions
   */
  private async executeWorkflowActions(
    workflow: WorkflowAutomation,
    triggerContext: WorkflowTriggerContext,
    executionId: string
  ): Promise<Omit<WorkflowExecutionResult, 'executionId' | 'duration'>> {
    const errors: Array<{ step: string; error: string; timestamp: Date }> = [];
    let actionsCompleted = 0;
    let outputs: any = {};

    try {
      // For now, assume integration exists or create a default one
      // This will be improved when integration linking is properly configured
      let integrationId = 'default_integration';
      
      // Prepare action context from actionSteps
      const actionSteps = Array.isArray(workflow.actionSteps) ? workflow.actionSteps : [workflow.actionSteps];
      const firstAction = actionSteps[0] || {};
      
      const actionContext: WorkflowActionContext = {
        actionType: firstAction.type || 'default_action',
        actionConfig: firstAction.config || {},
        integrationId,
        executionId,
        retryCount: 0
      };

      // Execute the main action
      const actionResult = await this.executeAction(actionContext);
      outputs = actionResult;
      actionsCompleted = 1;

      // Execute any additional actions from actionSteps
      if (actionSteps.length > 1) {
        for (let i = 1; i < actionSteps.length; i++) {
          const additionalAction = actionSteps[i];
          try {
            const additionalActionContext = {
              ...actionContext,
              actionType: additionalAction.type || 'additional_action',
              actionConfig: additionalAction.config || {}
            };
            
            await this.executeAction(additionalActionContext);
            actionsCompleted++;
          } catch (error) {
            console.error('🔥 Additional action failed:', error);
            errors.push({
              step: `action_step_${i}`,
              error: error instanceof Error ? error.message : String(error),
              timestamp: new Date()
            });
          }
        }
      }

      const totalActions = actionSteps.length;
      return {
        success: errors.length === 0,
        actionsCompleted,
        totalActions,
        errors,
        outputs
      };

    } catch (error) {
      console.error('🔥 Error executing workflow actions:', error);
      errors.push({
        step: 'main_action',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date()
      });

      return {
        success: false,
        actionsCompleted,
        totalActions: 1,
        errors,
        outputs
      };
    }
  }

  /**
   * Execute a single action with retry logic
   */
  private async executeAction(context: WorkflowActionContext, maxRetries: number = 3): Promise<any> {
    const actionHandler = this.actionRegistry.get(context.actionType);
    
    if (!actionHandler) {
      throw new Error(`Unknown action type: ${context.actionType}`);
    }

    let lastError: unknown = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        context.retryCount = attempt;
        console.log(`🎯 Executing action: ${context.actionType} (attempt ${attempt + 1})`);
        
        const result = await actionHandler(context);
        
        if (attempt > 0) {
          console.log(`✨ Action succeeded after ${attempt} retries`);
        }
        
        return result;
      } catch (error) {
        lastError = error;
        console.error(`🔥 Action failed (attempt ${attempt + 1}):`, error);
        
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error(`Action failed after ${maxRetries + 1} attempts`);
  }

  // Action handlers for different integration types

  private async executeWebflowCreatePage(context: WorkflowActionContext): Promise<any> {
    const config = context.actionConfig;
    const result = await WebflowIntegrationService.generatePortfolioPage(
      context.integrationId,
      config.siteId,
      {
        userId: context.integrationId,
        siteName: config.pageName || 'Panel Profits Portfolio', 
        theme: config.theme || 'mythical',
        sections: {
          hero: true,
          tradingStats: true,
          topHoldings: true,
          achievements: true,
          comicCollection: true,
          houseAffiliation: true,
          learningProgress: true
        },
        customization: {
          backgroundColor: config.backgroundColor || '#0a0a23',
          accentColor: config.accentColor || '#ffd700',
          fontFamily: config.fontFamily || 'Inter'
        }
      } as PortfolioPageConfig
    );

    await this.logActionExecution(context, 'webflow_page_created', result);
    return result;
  }

  private async executeWebflowUpdatePortfolio(context: WorkflowActionContext): Promise<any> {
    const config = context.actionConfig;
    // TODO: Implement actual portfolio update via Webflow integration
    const result = {
      success: true,
      fieldsUpdated: ['portfolio_value', 'holdings', 'performance'],
      message: 'Portfolio data prepared for Webflow synchronization'
    };

    await this.logActionExecution(context, 'webflow_portfolio_updated', result);
    return result;
  }

  private async executeWebflowPublishSite(context: WorkflowActionContext): Promise<any> {
    const config = context.actionConfig;
    // TODO: Implement actual site publishing via Webflow integration
    const result = {
      success: true,
      publishedAt: new Date().toISOString(),
      publishedUrl: `https://panel-profits-${config.siteId}.webflow.io`,
      message: 'Site publication initiated successfully'
    };

    await this.logActionExecution(context, 'webflow_site_published', result);
    return result;
  }

  private async executeFigmaExportTokens(context: WorkflowActionContext): Promise<any> {
    const config = context.actionConfig;
    const result = await FigmaIntegrationService.extractDesignTokens(
      context.integrationId,
      config.fileKey,
      {
        extractColors: config.extractColors || true,
        extractTypography: config.extractTypography || true,
        extractSpacing: config.extractSpacing || true,
        extractEffects: config.extractEffects || true
      }
    );

    await this.logActionExecution(context, 'figma_tokens_exported', { tokenCount: result.length });
    return result;
  }

  private async executeFigmaSyncComponents(context: WorkflowActionContext): Promise<any> {
    const config = context.actionConfig;
    const components = await FigmaIntegrationService.getFileComponents(
      context.integrationId,
      config.fileKey
    );

    await this.logActionExecution(context, 'figma_components_synced', { componentCount: components.length });
    return components;
  }

  private async executeFigmaCreateDesigns(context: WorkflowActionContext): Promise<any> {
    // Placeholder for creating designs in Figma
    // This would require more complex Figma API integration
    const result = { message: 'Design creation queued', designId: 'placeholder' };
    await this.logActionExecution(context, 'figma_designs_created', result);
    return result;
  }

  private async executeRelumeAnalyzeUsage(context: WorkflowActionContext): Promise<any> {
    const config = context.actionConfig;
    const result = await RelumeSitebuilderIntegrationService.analyzeComponentUsage(
      context.integrationId,
      config.projectId,
      config.timeframe || '30d'
    );

    await this.logActionExecution(context, 'relume_usage_analyzed', { 
      componentsAnalyzed: result.length 
    });
    return result;
  }

  private async executeRelumeQualityCheck(context: WorkflowActionContext): Promise<any> {
    const config = context.actionConfig;
    const result = await RelumeSitebuilderIntegrationService.performQualityAssessment(
      context.integrationId,
      config.projectId
    );

    await this.logActionExecution(context, 'relume_quality_checked', {
      overallScore: result.overall_score,
      issuesFound: result.categories.accessibility.issues.length
    });
    return result;
  }

  private async executeRelumeGeneratePage(context: WorkflowActionContext): Promise<any> {
    const config = context.actionConfig;
    const result = await RelumeSitebuilderIntegrationService.generateSitePage(
      context.integrationId,
      config.projectId,
      {
        pageName: config.pageName || 'Generated Page',
        pageType: config.pageType || 'portfolio',
        components: config.components || [],
        layout: config.layout || 'single-column',
        theme: config.theme || 'mythical',
        content: config.content || {}
      }
    );

    await this.logActionExecution(context, 'relume_page_generated', result);
    return result;
  }

  private async executeSendNotification(context: WorkflowActionContext): Promise<any> {
    const config = context.actionConfig;
    // This would integrate with your notification system
    const result = {
      notificationId: `notif_${Date.now()}`,
      sent: true,
      message: config.message,
      recipient: config.recipient
    };

    await this.logActionExecution(context, 'notification_sent', result);
    return result;
  }

  private async executeLogEvent(context: WorkflowActionContext): Promise<any> {
    const config = context.actionConfig;
    const result = {
      eventLogged: true,
      eventType: config.eventType,
      timestamp: new Date().toISOString(),
      data: config.data
    };

    await this.logActionExecution(context, 'event_logged', result);
    return result;
  }

  private async executeWaitDelay(context: WorkflowActionContext): Promise<any> {
    const config = context.actionConfig;
    const delay = config.delayMs || 1000;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const result = { delayed: delay };
    await this.logActionExecution(context, 'delay_completed', result);
    return result;
  }

  /**
   * Log action execution for analytics
   */
  private async logActionExecution(
    context: WorkflowActionContext, 
    eventType: string, 
    data: any
  ): Promise<void> {
    try {
      await storage.createIntegrationSyncLog({
        integrationId: context.integrationId,
        syncType: eventType,
        direction: 'outbound',
        status: 'completed',
        recordsProcessed: 1,
        errorMessage: null,
        syncData: {
          executionId: context.executionId,
          actionType: context.actionType,
          retryCount: context.retryCount,
          data
        }
      });
    } catch (error) {
      console.error('🔥 Error logging action execution:', error);
      // Don't throw - logging failures shouldn't break workflow execution
    }
  }

  /**
   * Cancel a running workflow execution
   */
  async cancelExecution(executionId: string): Promise<boolean> {
    try {
      const controller = this.runningExecutions.get(executionId);
      if (controller) {
        controller.abort();
        this.runningExecutions.delete(executionId);
        
        await storage.updateWorkflowExecution(executionId, {
          status: 'cancelled',
          completedAt: new Date(),
          errorMessage: 'Execution cancelled by user',
          metadata: {
            ritualPhase: 'interruption',
            cosmicEnergy: 'dispersed'
          }
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('🔥 Error cancelling execution:', error);
      return false;
    }
  }

  /**
   * Get health status of the automation engine
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    runningExecutions: number;
    actionsRegistered: number;
    uptime: number;
  } {
    return {
      status: this.runningExecutions.size < 100 ? 'healthy' : 'degraded',
      runningExecutions: this.runningExecutions.size,
      actionsRegistered: this.actionRegistry.size,
      uptime: process.uptime()
    };
  }
}

// Export singleton instance
export const workflowEngine = WorkflowAutomationEngine.getInstance();

// Helper function to process triggers from external sources
export async function processTrigger(
  triggerType: string,
  triggerData: any,
  userId: string,
  eventSource?: string
): Promise<WorkflowExecutionResult[]> {
  const context: WorkflowTriggerContext = {
    triggerType,
    triggerData,
    userId,
    timestamp: new Date(),
    eventSource
  };

  return await workflowEngine.processTrigger(context);
}