export enum QueueName {
  PINECONE_EXPANSION = 'pinecone-expansion',
  MARVEL_CHARACTERS = 'marvel-characters',
  MARVEL_ISSUES = 'marvel-issues',
  COMIC_VINE_CHARACTERS = 'comic-vine-characters',
  COMIC_VINE_ISSUES = 'comic-vine-issues',
  ASSET_CREATION = 'asset-creation',
  ASSET_PRICING = 'asset-pricing',
  ENTITY_VERIFICATION = 'entity-verification',
}

export enum JobType {
  EXPAND_PINECONE_BATCH = 'expand-pinecone-batch',
  FETCH_MARVEL_CHARACTER = 'fetch-marvel-character',
  FETCH_MARVEL_ISSUES = 'fetch-marvel-issues',
  FETCH_COMIC_VINE_CHARACTER = 'fetch-comic-vine-character',
  FETCH_COMIC_VINE_ISSUES = 'fetch-comic-vine-issues',
  CREATE_ASSET = 'create-asset',
  PRICE_ASSET = 'price-asset',
  VERIFY_ENTITY = 'verify-entity',
  VERIFY_ENTITY_BATCH = 'verify-entity-batch',
}

export interface PineconeExpansionJob {
  batchStart: number;
  batchSize: number;
  namespace?: string;
}

export interface MarvelCharacterJob {
  characterId: number;
  characterName?: string;
}

export interface MarvelIssuesJob {
  seriesId: number;
  seriesName?: string;
  offset?: number;
  limit?: number;
}

export interface ComicVineCharacterJob {
  characterId: number;
  characterName?: string;
}

export interface ComicVineIssuesJob {
  volumeId: number;
  volumeName?: string;
  offset?: number;
}

export interface AssetCreationJob {
  source: 'pinecone' | 'marvel' | 'comic_vine' | 'kaggle' | 'other';
  data: {
    name: string;
    symbol?: string;
    type: 'character' | 'creator' | 'comic' | 'series';
    metadata: Record<string, any>;
    publisher?: string;
    issueNumber?: string;
    variant?: string;
  };
}

export interface AssetPricingJob {
  assetId: number;
  symbol: string;
  type: 'character' | 'creator' | 'comic' | 'series';
  metadata: Record<string, any>;
}

export interface EntityVerificationJob {
  entityId: string;
  canonicalName: string;
  entityType: 'villain' | 'hero' | 'sidekick' | 'henchman' | 'location' | 'gadget' | 'other' | 'character' | 'creator' | 'comic' | 'series' | 'unknown';
  tableType?: 'narrative_entities' | 'assets' | 'creators';
  forceRefresh?: boolean;
  priority?: number;
}

export interface EntityVerificationBatchJob {
  entityIds: string[];
  batchSize?: number;
  skipRecentlyVerified?: boolean;
  maxAgeHours?: number;
}

export interface AcquisitionMetrics {
  totalAssets: number;
  newAssetsToday: number;
  assetsBySource: Record<string, number>;
  assetsByType: Record<string, number>;
  lastUpdate: Date;
  errors: number;
  pendingJobs: Record<string, number>;
}
