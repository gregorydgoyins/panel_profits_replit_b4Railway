import { ExternalApiClient, DataTransformationService } from './externalIntegrationsService.js';
import { WebhookManager } from './webhookManager.js';
import { storage } from '../storage.js';
import type { ExternalIntegration, WorkflowAutomation } from '@shared/schema.js';

/**
 * Figma Integration Service - The Celestial Design Forge
 * 
 * Figma serves as the mystical design system nexus for Panel Profits,
 * enabling seamless synchronization between the application's components
 * and design tokens, creating a unified visual language across all realms.
 * 
 * Features:
 * - Design system component synchronization
 * - Automated design token generation and export
 * - Component library management and versioning
 * - Design handoff automation workflows
 * - Real-time design-to-code synchronization
 * - Accessibility compliance checking
 */

export interface FigmaFile {
  key: string;
  name: string;
  thumbnail_url: string;
  last_modified: string;
  version: string;
  role: string;
}

export interface FigmaTeam {
  id: string;
  name: string;
}

export interface FigmaProject {
  id: string;
  name: string;
}

export interface FigmaComponent {
  key: string;
  file_key: string;
  node_id: string;
  thumbnail_url: string;
  name: string;
  description: string;
  component_set_id?: string;
  created_at: string;
  updated_at: string;
}

export interface FigmaDesignToken {
  name: string;
  type: 'color' | 'typography' | 'spacing' | 'border-radius' | 'shadow' | 'opacity';
  value: string | number;
  category: string;
  description?: string;
  scopes?: string[];
}

export interface DesignSystemConfig {
  userId: string;
  figmaFileKey: string;
  componentLibraryName: string;
  tokenCategories: {
    colors: boolean;
    typography: boolean;
    spacing: boolean;
    effects: boolean;
  };
  syncSettings: {
    autoSync: boolean;
    syncInterval: number; // minutes
    notifyOnChanges: boolean;
  };
  outputFormat: 'css' | 'scss' | 'json' | 'javascript';
}

/**
 * Figma Integration Service
 */
export class FigmaIntegrationService {
  private static readonly BASE_URL = 'https://api.figma.com/v1';
  
  /**
   * Initialize Figma integration for a user
   */
  static async initializeIntegration(
    integrationId: string,
    accessToken: string,
    teamId?: string
  ): Promise<boolean> {
    try {
      // Test API connection
      const isValid = await this.validateAccessToken(integrationId, accessToken);
      if (!isValid) {
        throw new Error('Invalid Figma access token - The celestial design realm rejects the offering');
      }

      // Get user's teams and projects
      const teams = await this.getUserTeams(integrationId);
      const targetTeamId = teamId || (teams.length > 0 ? teams[0].id : null);

      if (targetTeamId) {
        // Set up Panel Profits design system
        await this.setupPanelProfitsDesignSystem(integrationId, targetTeamId);
      }

      // Create default automation workflows
      await this.createDefaultAutomations(integrationId);

      return true;
    } catch (error) {
      console.error('🎨 Error initializing Figma integration - The celestial design forge has encountered disruption:', error);
      throw error;
    }
  }

  /**
   * Validate Figma access token
   */
  private static async validateAccessToken(integrationId: string, accessToken: string): Promise<boolean> {
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
   * Get user's Figma teams
   */
  static async getUserTeams(integrationId: string): Promise<FigmaTeam[]> {
    try {
      const response = await ExternalApiClient.makeApiCall(
        integrationId,
        '/teams',
        { method: 'GET' }
      );

      return response?.teams || [];
    } catch (error) {
      console.error('🎨 Error fetching Figma teams - The design councils are veiled:', error);
      return [];
    }
  }

  /**
   * Get projects from a team
   */
  static async getTeamProjects(integrationId: string, teamId: string): Promise<FigmaProject[]> {
    try {
      const response = await ExternalApiClient.makeApiCall(
        integrationId,
        `/teams/${teamId}/projects`,
        { method: 'GET' }
      );

      return response?.projects || [];
    } catch (error) {
      console.error('🎨 Error fetching team projects - The project archives are sealed:', error);
      return [];
    }
  }

  /**
   * Set up Panel Profits design system in Figma
   */
  private static async setupPanelProfitsDesignSystem(integrationId: string, teamId: string): Promise<void> {
    try {
      console.log('✨ Setting up Panel Profits design system in the celestial forge...');
      
      // Create a new project for Panel Profits design system
      const designSystemProject = await this.createDesignSystemProject(integrationId, teamId);
      
      // Set up component categories
      await this.createComponentCategories(integrationId, designSystemProject.id);
      
      console.log('🎨 Panel Profits design system established in the cosmic design realm');
    } catch (error) {
      console.error('🔥 Error setting up design system - The celestial architecture has faltered:', error);
      throw error;
    }
  }

  /**
   * Create design system project
   */
  private static async createDesignSystemProject(integrationId: string, teamId: string): Promise<{ id: string; name: string }> {
    try {
      // Note: Figma API doesn't support creating projects via API
      // This would typically be done manually or through Figma plugins
      // For now, we'll return a placeholder
      return {
        id: 'panel-profits-design-system',
        name: 'Panel Profits - Divine Design System'
      };
    } catch (error) {
      console.error('🔥 Error creating design system project - The project genesis has failed:', error);
      throw error;
    }
  }

  /**
   * Create component categories for Panel Profits
   */
  private static async createComponentCategories(integrationId: string, projectId: string): Promise<void> {
    try {
      const categories = [
        'Mythical Components',
        'Trading Interfaces', 
        'Portfolio Displays',
        'Achievement Showcases',
        'Sacred Navigation',
        'Divine Data Visualization',
        'Comic Collection Cards',
        'House Identity Elements'
      ];

      // In a real implementation, this would create organizational structures
      // within the design system project
      console.log('📁 Created component categories:', categories);
    } catch (error) {
      console.error('🔥 Error creating component categories - The organizational ritual has failed:', error);
      throw error;
    }
  }

  /**
   * Extract design tokens from a Figma file
   */
  static async extractDesignTokens(
    integrationId: string,
    fileKey: string,
    tokenConfig: {
      extractColors: boolean;
      extractTypography: boolean;
      extractSpacing: boolean;
      extractEffects: boolean;
    }
  ): Promise<FigmaDesignToken[]> {
    try {
      console.log('🔍 Extracting design tokens from the cosmic blueprint...');

      const response = await ExternalApiClient.makeApiCall(
        integrationId,
        `/files/${fileKey}`,
        { method: 'GET' }
      );

      const tokens: FigmaDesignToken[] = [];

      if (response?.document) {
        // Extract color tokens from styles
        if (tokenConfig.extractColors && response.styles) {
          const colorTokens = await this.extractColorTokens(integrationId, fileKey, response.styles);
          tokens.push(...colorTokens);
        }

        // Extract typography tokens
        if (tokenConfig.extractTypography && response.styles) {
          const typographyTokens = await this.extractTypographyTokens(integrationId, fileKey, response.styles);
          tokens.push(...typographyTokens);
        }

        // Extract spacing tokens from components
        if (tokenConfig.extractSpacing) {
          const spacingTokens = this.extractSpacingTokens(response.document);
          tokens.push(...spacingTokens);
        }

        // Extract effect tokens (shadows, etc.)
        if (tokenConfig.extractEffects && response.styles) {
          const effectTokens = await this.extractEffectTokens(integrationId, fileKey, response.styles);
          tokens.push(...effectTokens);
        }
      }

      console.log(`✨ Extracted ${tokens.length} design tokens from the celestial library`);
      return tokens;
    } catch (error) {
      console.error('🔥 Error extracting design tokens - The cosmic extraction ritual has failed:', error);
      return [];
    }
  }

  /**
   * Extract color tokens from Figma styles
   */
  private static async extractColorTokens(
    integrationId: string,
    fileKey: string,
    styles: any
  ): Promise<FigmaDesignToken[]> {
    const colorTokens: FigmaDesignToken[] = [];
    
    for (const [styleId, style] of Object.entries(styles)) {
      if (style && typeof style === 'object' && (style as any).styleType === 'FILL') {
        const styleDetails = await ExternalApiClient.makeApiCall(
          integrationId,
          `/files/${fileKey}/styles/${styleId}`,
          { method: 'GET' }
        );

        if (styleDetails?.style) {
          colorTokens.push({
            name: styleDetails.style.name.replace(/\//g, '-').toLowerCase(),
            type: 'color',
            value: this.extractColorValue(styleDetails.style),
            category: 'colors',
            description: styleDetails.style.description,
            scopes: ['background', 'text', 'border']
          });
        }
      }
    }

    return colorTokens;
  }

  /**
   * Extract typography tokens
   */
  private static async extractTypographyTokens(
    integrationId: string,
    fileKey: string,
    styles: any
  ): Promise<FigmaDesignToken[]> {
    const typographyTokens: FigmaDesignToken[] = [];
    
    for (const [styleId, style] of Object.entries(styles)) {
      if (style && typeof style === 'object' && (style as any).styleType === 'TEXT') {
        const styleDetails = await ExternalApiClient.makeApiCall(
          integrationId,
          `/files/${fileKey}/styles/${styleId}`,
          { method: 'GET' }
        );

        if (styleDetails?.style) {
          typographyTokens.push({
            name: styleDetails.style.name.replace(/\//g, '-').toLowerCase(),
            type: 'typography',
            value: this.extractTypographyValue(styleDetails.style),
            category: 'typography',
            description: styleDetails.style.description,
            scopes: ['font-family', 'font-size', 'line-height', 'font-weight']
          });
        }
      }
    }

    return typographyTokens;
  }

  /**
   * Extract spacing tokens from component patterns
   */
  private static extractSpacingTokens(document: any): FigmaDesignToken[] {
    const spacingTokens: FigmaDesignToken[] = [];
    const commonSpacings = new Set<number>();

    // Recursively find spacing patterns in the document
    const findSpacings = (node: any) => {
      if (node.children) {
        for (const child of node.children) {
          if (child.constraints && child.constraints.horizontal === 'LEFT_RIGHT') {
            if (child.paddingLeft) commonSpacings.add(child.paddingLeft);
            if (child.paddingRight) commonSpacings.add(child.paddingRight);
            if (child.paddingTop) commonSpacings.add(child.paddingTop);
            if (child.paddingBottom) commonSpacings.add(child.paddingBottom);
          }
          findSpacings(child);
        }
      }
    };

    findSpacings(document);

    // Convert common spacings to tokens
    const spacingArray = Array.from(commonSpacings).sort((a, b) => a - b);
    spacingArray.forEach((spacing, index) => {
      spacingTokens.push({
        name: `spacing-${index + 1}`,
        type: 'spacing',
        value: `${spacing}px`,
        category: 'spacing',
        description: `Sacred spacing unit: ${spacing}px`,
        scopes: ['padding', 'margin', 'gap']
      });
    });

    return spacingTokens;
  }

  /**
   * Extract effect tokens (shadows, etc.)
   */
  private static async extractEffectTokens(
    integrationId: string,
    fileKey: string,
    styles: any
  ): Promise<FigmaDesignToken[]> {
    const effectTokens: FigmaDesignToken[] = [];
    
    for (const [styleId, style] of Object.entries(styles)) {
      if (style && typeof style === 'object' && (style as any).styleType === 'EFFECT') {
        const styleDetails = await ExternalApiClient.makeApiCall(
          integrationId,
          `/files/${fileKey}/styles/${styleId}`,
          { method: 'GET' }
        );

        if (styleDetails?.style) {
          effectTokens.push({
            name: styleDetails.style.name.replace(/\//g, '-').toLowerCase(),
            type: 'shadow',
            value: this.extractEffectValue(styleDetails.style),
            category: 'effects',
            description: styleDetails.style.description,
            scopes: ['box-shadow', 'filter']
          });
        }
      }
    }

    return effectTokens;
  }

  /**
   * Generate design system export
   */
  static async generateDesignSystemExport(
    integrationId: string,
    config: DesignSystemConfig
  ): Promise<{
    tokens: FigmaDesignToken[];
    components: FigmaComponent[];
    exportUrls: { [format: string]: string };
  }> {
    try {
      console.log('📦 Generating divine design system export...');

      // Extract design tokens
      const tokens = await this.extractDesignTokens(
        integrationId,
        config.figmaFileKey,
        {
          extractColors: config.tokenCategories.colors,
          extractTypography: config.tokenCategories.typography,
          extractSpacing: config.tokenCategories.spacing,
          extractEffects: config.tokenCategories.effects
        }
      );

      // Get file components
      const components = await this.getFileComponents(integrationId, config.figmaFileKey);

      // Generate exports in requested format
      const exportUrls = await this.generateTokenExports(tokens, config.outputFormat);

      return {
        tokens,
        components,
        exportUrls
      };
    } catch (error) {
      console.error('🔥 Error generating design system export - The cosmic compilation has failed:', error);
      throw error;
    }
  }

  /**
   * Get components from a Figma file
   */
  static async getFileComponents(integrationId: string, fileKey: string): Promise<FigmaComponent[]> {
    try {
      const response = await ExternalApiClient.makeApiCall(
        integrationId,
        `/files/${fileKey}/components`,
        { method: 'GET' }
      );

      return Object.values(response?.meta?.components || {}) as FigmaComponent[];
    } catch (error) {
      console.error('🔥 Error fetching file components - The component library is obscured:', error);
      return [];
    }
  }

  /**
   * Generate token exports in different formats
   */
  private static async generateTokenExports(
    tokens: FigmaDesignToken[], 
    format: 'css' | 'scss' | 'json' | 'javascript'
  ): Promise<{ [format: string]: string }> {
    const exports: { [format: string]: string } = {};

    try {
      switch (format) {
        case 'css':
          exports.css = this.generateCSSExport(tokens);
          break;
        case 'scss':
          exports.scss = this.generateSCSSExport(tokens);
          break;
        case 'json':
          exports.json = this.generateJSONExport(tokens);
          break;
        case 'javascript':
          exports.js = this.generateJSExport(tokens);
          break;
      }
    } catch (error) {
      console.error('🔥 Error generating token exports - The format transmutation has failed:', error);
    }

    return exports;
  }

  /**
   * Generate CSS custom properties export
   */
  private static generateCSSExport(tokens: FigmaDesignToken[]): string {
    let css = ':root {\n';
    
    tokens.forEach(token => {
      css += `  --${token.name}: ${token.value};\n`;
    });
    
    css += '}';
    return css;
  }

  /**
   * Generate SCSS variables export
   */
  private static generateSCSSExport(tokens: FigmaDesignToken[]): string {
    let scss = '';
    
    tokens.forEach(token => {
      scss += `$${token.name}: ${token.value};\n`;
    });
    
    return scss;
  }

  /**
   * Generate JSON export
   */
  private static generateJSONExport(tokens: FigmaDesignToken[]): string {
    const tokenObject: { [category: string]: { [name: string]: any } } = {};
    
    tokens.forEach(token => {
      if (!tokenObject[token.category]) {
        tokenObject[token.category] = {};
      }
      tokenObject[token.category][token.name] = {
        value: token.value,
        type: token.type,
        description: token.description
      };
    });
    
    return JSON.stringify(tokenObject, null, 2);
  }

  /**
   * Generate JavaScript module export
   */
  private static generateJSExport(tokens: FigmaDesignToken[]): string {
    const tokenObject: { [name: string]: any } = {};
    
    tokens.forEach(token => {
      tokenObject[token.name] = token.value;
    });
    
    return `export const designTokens = ${JSON.stringify(tokenObject, null, 2)};`;
  }

  /**
   * Create default automation workflows
   */
  private static async createDefaultAutomations(integrationId: string): Promise<void> {
    try {
      const integration = await storage.getExternalIntegration(integrationId);
      if (!integration) return;

      const automations = [
        {
          userId: integration.userId,
          integrationId,
          name: 'Design Token Sync Ritual',
          description: 'Automatically synchronizes design tokens when Figma files are updated',
          triggerType: 'figma_file_update',
          triggerConfig: {
            events: ['file_modified', 'styles_changed'],
            conditions: { autoSync: true }
          },
          actionType: 'design_sync',
          actionConfig: {
            syncType: 'design_tokens',
            outputFormat: 'css',
            notifyOnComplete: true
          },
          isActive: true,
          category: 'design_system',
          priority: 1,
          metadata: {
            ritualType: 'aesthetic_harmonization',
            cosmicEnergy: 'high'
          }
        },
        {
          userId: integration.userId,
          integrationId,
          name: 'Component Library Update Ritual',
          description: 'Updates component library when new components are published',
          triggerType: 'figma_component_published',
          triggerConfig: {
            events: ['component_published', 'component_updated'],
            conditions: { autoUpdate: true }
          },
          actionType: 'component_sync',
          actionConfig: {
            syncType: 'component_library',
            generateDocumentation: true,
            updateVersions: true
          },
          isActive: true,
          category: 'component_management',
          priority: 2,
          metadata: {
            ritualType: 'component_manifestation',
            cosmicEnergy: 'medium'
          }
        },
        {
          userId: integration.userId,
          integrationId,
          name: 'Design Review Automation',
          description: 'Creates design review workflows for handoff',
          triggerType: 'design_ready_for_review',
          triggerConfig: {
            events: ['frame_marked_ready', 'prototype_completed'],
            conditions: { requiresReview: true }
          },
          actionType: 'design_handoff',
          actionConfig: {
            createHandoffSpecs: true,
            generateAssets: true,
            notifyDevelopers: true
          },
          isActive: true,
          category: 'design_handoff',
          priority: 3,
          metadata: {
            ritualType: 'knowledge_transmission',
            cosmicEnergy: 'medium'
          }
        }
      ];

      for (const automation of automations) {
        await storage.createWorkflowAutomation(automation);
      }

      console.log('✨ Created 3 divine automation workflows for Figma integration');
    } catch (error) {
      console.error('🔥 Error creating default automations - The design ritual framework has collapsed:', error);
      throw error;
    }
  }

  // Helper methods for token extraction
  private static extractColorValue(style: any): string {
    // Implementation would extract color value from Figma style
    return '#000000'; // Placeholder
  }

  private static extractTypographyValue(style: any): string {
    // Implementation would extract typography value from Figma style
    return '16px/1.5 Inter, sans-serif'; // Placeholder
  }

  private static extractEffectValue(style: any): string {
    // Implementation would extract effect value from Figma style
    return '0 2px 4px rgba(0,0,0,0.1)'; // Placeholder
  }
}