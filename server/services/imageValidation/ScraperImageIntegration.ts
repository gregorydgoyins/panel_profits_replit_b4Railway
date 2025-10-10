/**
 * Scraper Image Integration
 * 
 * Connects entity scrapers with image validation pipeline.
 * Automatically validates and stores images from scraper results.
 */

import { ImageValidator, ImageStorageManager, type StoredImage } from './ImageValidator';
import type { EntityData } from '../entityScrapers/BaseEntityScraper';

export interface ImageIntegrationConfig {
  autoValidate?: boolean;
  minQuality?: 'high' | 'medium' | 'low';
  maxImagesPerEntity?: number;
}

export class ScraperImageIntegration {
  private validator: ImageValidator;
  private storage: ImageStorageManager;
  private config: ImageIntegrationConfig;

  constructor(config?: ImageIntegrationConfig) {
    this.config = {
      autoValidate: true,
      minQuality: 'medium',
      maxImagesPerEntity: 5,
      ...config
    };
    
    this.validator = new ImageValidator();
    this.storage = new ImageStorageManager();
  }

  /**
   * Process entity data from scraper and validate images
   */
  async processScraperEntity(
    entity: EntityData,
    sourceId: string
  ): Promise<{
    entity: EntityData;
    validatedImages: StoredImage[];
    rejectedImages: string[];
  }> {
    const validatedImages: StoredImage[] = [];
    const rejectedImages: string[] = [];

    // Extract all image URLs from entity
    const imageUrls = this.extractImageUrls(entity);

    // Validate and store images
    for (const imageUrl of imageUrls) {
      if (!this.config.autoValidate) {
        continue;
      }

      const stored = await this.storage.storeImage(
        entity.entityId,
        entity.entityType,
        imageUrl,
        sourceId,
        entity.entityName
      );

      if (stored && this.meetsQualityThreshold(stored.quality)) {
        validatedImages.push(stored);
      } else {
        rejectedImages.push(imageUrl);
      }

      // Respect max images limit
      if (validatedImages.length >= (this.config.maxImagesPerEntity || Infinity)) {
        break;
      }
    }

    return {
      entity,
      validatedImages,
      rejectedImages
    };
  }

  /**
   * Batch process multiple entities from scraper results
   */
  async processBatch(
    entities: EntityData[],
    sourceId: string
  ): Promise<{
    processed: number;
    validatedImages: number;
    rejectedImages: number;
    entities: EntityData[];
  }> {
    let totalValidated = 0;
    let totalRejected = 0;

    for (const entity of entities) {
      const result = await this.processScraperEntity(entity, sourceId);
      totalValidated += result.validatedImages.length;
      totalRejected += result.rejectedImages.length;
    }

    return {
      processed: entities.length,
      validatedImages: totalValidated,
      rejectedImages: totalRejected,
      entities
    };
  }

  /**
   * Get best image for entity across all sources
   */
  getBestImageForEntity(entityId: string): StoredImage | null {
    return this.storage.getBestImageForEntity(entityId);
  }

  /**
   * Get validation statistics
   */
  getStats() {
    return this.storage.getValidationStats();
  }

  // Helper methods

  private extractImageUrls(entity: EntityData): string[] {
    const urls: string[] = [];

    // First appearance cover
    if (entity.firstAppearance?.coverUrl) {
      urls.push(entity.firstAppearance.coverUrl);
    }

    // Comic appearances covers
    if (entity.appearances) {
      for (const appearance of entity.appearances) {
        if (appearance.coverImageUrl) {
          urls.push(appearance.coverImageUrl);
        }
      }
    }

    // Source data images
    if (entity.sourceData?.coverUrl) {
      urls.push(entity.sourceData.coverUrl);
    }
    if (entity.sourceData?.imageUrl) {
      urls.push(entity.sourceData.imageUrl);
    }
    if (entity.sourceData?.images && Array.isArray(entity.sourceData.images)) {
      urls.push(...entity.sourceData.images);
    }

    // Remove duplicates
    return [...new Set(urls)];
  }

  private meetsQualityThreshold(quality: 'high' | 'medium' | 'low'): boolean {
    const qualityLevels = { high: 3, medium: 2, low: 1 };
    const threshold = qualityLevels[this.config.minQuality || 'medium'];
    return qualityLevels[quality] >= threshold;
  }
}
