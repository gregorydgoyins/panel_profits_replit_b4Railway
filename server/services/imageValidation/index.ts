/**
 * Image Validation & Storage Infrastructure
 * 
 * Validates scraped comic images for quality, resolution, and relevance.
 * Manages storage associations between entities and their images.
 */

export {
  ImageValidator,
  ImageStorageManager,
  type ImageValidationResult,
  type ImageValidationConfig,
  type StoredImage
} from './ImageValidator';

export {
  ScraperImageIntegration,
  type ImageIntegrationConfig
} from './ScraperImageIntegration';
