/**
 * Image Validation Service
 * 
 * Validates scraped comic images for:
 * - Quality: Resolution, format, file size
 * - Relevance: Title matching, metadata verification
 * - Storage readiness: Optimized for display
 */

import sizeOf from 'image-size';

export interface ImageValidationResult {
  isValid: boolean;
  quality: 'high' | 'medium' | 'low' | 'rejected';
  issues: string[];
  metadata: {
    width?: number;
    height?: number;
    format?: string;
    sizeBytes?: number;
    aspectRatio?: number;
  };
  recommendations: string[];
}

export interface ImageValidationConfig {
  minWidth?: number;
  minHeight?: number;
  maxSizeBytes?: number;
  allowedFormats?: string[];
  minQualityScore?: number;
}

export class ImageValidator {
  private config: ImageValidationConfig;

  constructor(config?: ImageValidationConfig) {
    this.config = {
      minWidth: 300,
      minHeight: 400,
      maxSizeBytes: 10 * 1024 * 1024, // 10MB
      allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
      minQualityScore: 0.6,
      ...config
    };
  }

  /**
   * Validate image URL from scraper
   */
  async validateImageUrl(imageUrl: string, entityName?: string): Promise<ImageValidationResult> {
    const result: ImageValidationResult = {
      isValid: false,
      quality: 'rejected',
      issues: [],
      metadata: {},
      recommendations: []
    };

    try {
      // Fetch image metadata
      const response = await fetch(imageUrl, { 
        method: 'HEAD',
        headers: {
          'User-Agent': 'PanelProfitsBot/1.0 (Image Validator)'
        }
      });

      if (!response.ok) {
        result.issues.push(`HTTP ${response.status}: ${response.statusText}`);
        return result;
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !this.config.allowedFormats?.includes(contentType)) {
        result.issues.push(`Invalid format: ${contentType}. Expected ${this.config.allowedFormats?.join(', ')}`);
        result.recommendations.push('Convert to JPEG, PNG, or WebP format');
        return result;
      }

      // Check file size
      const contentLength = parseInt(response.headers.get('content-length') || '0');
      if (contentLength > (this.config.maxSizeBytes || Infinity)) {
        result.issues.push(`File too large: ${this.formatBytes(contentLength)}`);
        result.recommendations.push(`Compress image to under ${this.formatBytes(this.config.maxSizeBytes || 0)}`);
        return result;
      }

      result.metadata.format = contentType;
      result.metadata.sizeBytes = contentLength;

      // Download image to check actual dimensions
      const imageResponse = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'PanelProfitsBot/1.0 (Image Validator)'
        }
      });

      if (imageResponse.ok) {
        const buffer = Buffer.from(await imageResponse.arrayBuffer());
        
        try {
          const dimensions = sizeOf(buffer);
          result.metadata.width = dimensions.width;
          result.metadata.height = dimensions.height;
          
          if (dimensions.width && dimensions.height) {
            result.metadata.aspectRatio = dimensions.width / dimensions.height;
            
            // Check minimum dimensions
            if (dimensions.width < (this.config.minWidth || 0)) {
              result.issues.push(`Width too small: ${dimensions.width}px (min: ${this.config.minWidth}px)`);
              result.recommendations.push(`Use image with width >= ${this.config.minWidth}px`);
            }
            
            if (dimensions.height < (this.config.minHeight || 0)) {
              result.issues.push(`Height too small: ${dimensions.height}px (min: ${this.config.minHeight}px)`);
              result.recommendations.push(`Use image with height >= ${this.config.minHeight}px`);
            }
          }
        } catch (error) {
          result.issues.push('Failed to decode image dimensions');
        }
      }

      // Perform URL-based validation
      const urlValidation = this.validateImageUrlPattern(imageUrl, entityName);
      result.issues.push(...urlValidation.issues);
      result.recommendations.push(...urlValidation.recommendations);

      // Check relevance (title matching)
      if (entityName) {
        const relevanceCheck = this.checkRelevance(imageUrl, entityName);
        if (!relevanceCheck.isRelevant) {
          result.issues.push('Title mismatch detected');
          result.recommendations.push(relevanceCheck.suggestion || 'Verify image matches entity');
        }
      }

      // Determine quality score
      const qualityScore = this.calculateQualityScore(result);
      
      if (qualityScore >= 0.8) {
        result.quality = 'high';
        result.isValid = true;
      } else if (qualityScore >= 0.6) {
        result.quality = 'medium';
        result.isValid = true;
      } else if (qualityScore >= 0.4) {
        result.quality = 'low';
        result.isValid = false;
      } else {
        result.quality = 'rejected';
        result.isValid = false;
      }

      return result;

    } catch (error) {
      result.issues.push(`Fetch error: ${error instanceof Error ? error.message : String(error)}`);
      result.recommendations.push('Verify image URL is accessible');
      return result;
    }
  }

  /**
   * Validate image data from buffer
   */
  async validateImageBuffer(
    buffer: Buffer,
    filename?: string,
    entityName?: string
  ): Promise<ImageValidationResult> {
    const result: ImageValidationResult = {
      isValid: false,
      quality: 'rejected',
      issues: [],
      metadata: {},
      recommendations: []
    };

    try {
      // Check file size
      if (buffer.length > (this.config.maxSizeBytes || Infinity)) {
        result.issues.push(`File too large: ${this.formatBytes(buffer.length)}`);
        result.recommendations.push(`Compress to under ${this.formatBytes(this.config.maxSizeBytes || 0)}`);
        return result;
      }

      result.metadata.sizeBytes = buffer.length;

      // Detect image format from buffer header
      const format = this.detectImageFormat(buffer);
      if (!format) {
        result.issues.push('Unknown image format');
        result.recommendations.push('Use JPEG, PNG, or WebP format');
        return result;
      }

      result.metadata.format = format;

      // Check actual dimensions
      try {
        const dimensions = sizeOf(buffer);
        result.metadata.width = dimensions.width;
        result.metadata.height = dimensions.height;
        
        if (dimensions.width && dimensions.height) {
          result.metadata.aspectRatio = dimensions.width / dimensions.height;
          
          // Check minimum dimensions
          if (dimensions.width < (this.config.minWidth || 0)) {
            result.issues.push(`Width too small: ${dimensions.width}px (min: ${this.config.minWidth}px)`);
            result.recommendations.push(`Use image with width >= ${this.config.minWidth}px`);
          }
          
          if (dimensions.height < (this.config.minHeight || 0)) {
            result.issues.push(`Height too small: ${dimensions.height}px (min: ${this.config.minHeight}px)`);
            result.recommendations.push(`Use image with height >= ${this.config.minHeight}px`);
          }
        }
      } catch (error) {
        result.issues.push('Failed to decode image dimensions');
      }

      // Check relevance if entity name provided
      if (entityName && filename) {
        const relevanceCheck = this.checkRelevance(filename, entityName);
        if (!relevanceCheck.isRelevant) {
          result.issues.push('Filename mismatch detected');
          result.recommendations.push(relevanceCheck.suggestion || 'Verify image matches entity');
        }
      }

      // Calculate quality score
      const qualityScore = this.calculateQualityScore(result);
      
      if (qualityScore >= 0.8) {
        result.quality = 'high';
        result.isValid = true;
      } else if (qualityScore >= 0.6) {
        result.quality = 'medium';
        result.isValid = true;
      } else if (qualityScore >= 0.4) {
        result.quality = 'low';
        result.isValid = false;
      } else {
        result.quality = 'rejected';
        result.isValid = false;
      }

      return result;

    } catch (error) {
      result.issues.push(`Validation error: ${error instanceof Error ? error.message : String(error)}`);
      return result;
    }
  }

  /**
   * Batch validate multiple images
   */
  async validateBatch(
    imageUrls: Array<{ url: string; entityName?: string }>
  ): Promise<Map<string, ImageValidationResult>> {
    const results = new Map<string, ImageValidationResult>();
    
    // Validate in parallel with rate limiting
    const batchSize = 5;
    for (let i = 0; i < imageUrls.length; i += batchSize) {
      const batch = imageUrls.slice(i, i + batchSize);
      const promises = batch.map(({ url, entityName }) => 
        this.validateImageUrl(url, entityName).then(result => ({ url, result }))
      );
      
      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ url, result }) => {
        results.set(url, result);
      });
      
      // Rate limiting delay
      if (i + batchSize < imageUrls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  // Helper methods

  private validateImageUrlPattern(imageUrl: string, entityName?: string): { issues: string[]; recommendations: string[] } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for placeholder images
    const placeholderPatterns = [
      /placeholder/i,
      /default/i,
      /no-image/i,
      /missing/i,
      /unavailable/i,
      /coming-soon/i
    ];

    if (placeholderPatterns.some(pattern => pattern.test(imageUrl))) {
      issues.push('Placeholder image detected');
      recommendations.push('Find actual cover image');
    }

    // Check for low-resolution indicators
    const lowResPatterns = [
      /thumb/i,
      /small/i,
      /tiny/i,
      /_s\./i,
      /_xs\./i
    ];

    if (lowResPatterns.some(pattern => pattern.test(imageUrl))) {
      issues.push('Low resolution indicator in URL');
      recommendations.push('Use full-size image URL');
    }

    // Check URL protocol
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      issues.push('Invalid URL protocol');
      recommendations.push('Use https:// protocol');
    }

    return { issues, recommendations };
  }

  private detectImageFormat(buffer: Buffer): string | null {
    // Check magic numbers
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      return 'image/jpeg';
    }
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      return 'image/png';
    }
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
      // Check for WEBP
      if (buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
        return 'image/webp';
      }
    }
    return null;
  }

  private checkRelevance(
    imageSource: string,
    entityName: string
  ): { isRelevant: boolean; suggestion?: string } {
    const normalizedSource = imageSource.toLowerCase();
    const normalizedEntity = entityName.toLowerCase();
    
    // Extract meaningful words from entity name (remove common words)
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'of', 'in', 'to'];
    const entityWords = normalizedEntity
      .split(/[\s\-_]+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
    
    // Check if any entity words appear in the image source
    const matchCount = entityWords.filter(word => normalizedSource.includes(word)).length;
    const matchRatio = entityWords.length > 0 ? matchCount / entityWords.length : 0;
    
    // Considered relevant if >30% of words match
    const isRelevant = matchRatio >= 0.3;
    
    if (!isRelevant) {
      return {
        isRelevant: false,
        suggestion: `Image source doesn't match "${entityName}". Expected keywords: ${entityWords.join(', ')}`
      };
    }
    
    return { isRelevant: true };
  }

  private calculateQualityScore(result: ImageValidationResult): number {
    let score = 1.0;

    // Deduct for issues
    score -= result.issues.length * 0.2;

    // Deduct for small file size (might indicate low quality)
    if (result.metadata.sizeBytes && result.metadata.sizeBytes < 50000) {
      score -= 0.1;
    }

    // Deduct for low resolution
    if (result.metadata.width && result.metadata.width < 500) {
      score -= 0.15;
    }
    if (result.metadata.height && result.metadata.height < 500) {
      score -= 0.15;
    }

    // Bonus for high resolution
    if (result.metadata.width && result.metadata.width >= 1000) {
      score += 0.1;
    }
    if (result.metadata.height && result.metadata.height >= 1000) {
      score += 0.1;
    }

    // Deduct for recommendations
    score -= result.recommendations.length * 0.1;

    return Math.max(0, Math.min(1, score));
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

/**
 * Image Storage Manager
 * 
 * Manages validated images and their associations with entities
 */
export interface StoredImage {
  id: string;
  entityId: string;
  entityType: string;
  imageUrl: string;
  sourceId: string;
  quality: 'high' | 'medium' | 'low';
  metadata: {
    width?: number;
    height?: number;
    format?: string;
    sizeBytes?: number;
  };
  validatedAt: Date;
}

export class ImageStorageManager {
  private validator: ImageValidator;
  private images: Map<string, StoredImage>;

  constructor(validatorConfig?: ImageValidationConfig) {
    this.validator = new ImageValidator(validatorConfig);
    this.images = new Map();
  }

  /**
   * Store and validate image for entity
   */
  async storeImage(
    entityId: string,
    entityType: string,
    imageUrl: string,
    sourceId: string,
    entityName?: string
  ): Promise<StoredImage | null> {
    const validation = await this.validator.validateImageUrl(imageUrl, entityName);

    if (!validation.isValid) {
      console.warn(`⚠️ Image rejected for ${entityName || entityId}:`, validation.issues);
      return null;
    }

    const stored: StoredImage = {
      id: this.generateImageId(entityId, sourceId),
      entityId,
      entityType,
      imageUrl,
      sourceId,
      quality: validation.quality === 'rejected' ? 'low' : validation.quality,
      metadata: validation.metadata,
      validatedAt: new Date()
    };

    this.images.set(stored.id, stored);
    console.log(`✅ Stored ${validation.quality} quality image for ${entityName || entityId}`);
    
    return stored;
  }

  /**
   * Get best quality image for entity
   */
  getBestImageForEntity(entityId: string): StoredImage | null {
    const entityImages = Array.from(this.images.values())
      .filter(img => img.entityId === entityId)
      .sort((a, b) => {
        const qualityOrder = { high: 3, medium: 2, low: 1 };
        return qualityOrder[b.quality] - qualityOrder[a.quality];
      });

    return entityImages[0] || null;
  }

  /**
   * Get all images for entity
   */
  getImagesForEntity(entityId: string): StoredImage[] {
    return Array.from(this.images.values())
      .filter(img => img.entityId === entityId);
  }

  /**
   * Get validation statistics
   */
  getValidationStats(): {
    total: number;
    byQuality: Record<string, number>;
    bySources: Record<string, number>;
  } {
    const stats = {
      total: this.images.size,
      byQuality: { high: 0, medium: 0, low: 0 },
      bySources: {} as Record<string, number>
    };

    this.images.forEach(img => {
      stats.byQuality[img.quality]++;
      stats.bySources[img.sourceId] = (stats.bySources[img.sourceId] || 0) + 1;
    });

    return stats;
  }

  private generateImageId(entityId: string, sourceId: string): string {
    return `${entityId}-${sourceId}-${Date.now()}`;
  }
}
