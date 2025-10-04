import { storage } from '../storage';
import { symbolGeneratorService } from './SymbolGeneratorService';
import { unifiedPricingEngine } from './unifiedPricingEngine';

/**
 * Creator Affiliation Service
 * Manages creator-publisher relationships and generates assets per affiliation
 * Examples: LEE_STAN.MRVL, LEE_STAN.TIME, KIRBY_JACK.MRVL, KIRBY_JACK.DC
 */

export interface CreatorAffiliation {
  creatorName: string;
  publisherCode: string;
  publisherFullName: string;
  workCount?: number;
  notableWorks?: string[];
  yearsActive?: string;
}

export class CreatorAffiliationService {
  /**
   * Generate a creator asset for a specific publisher affiliation
   */
  async generateCreatorAsset(
    creatorName: string,
    publisherCode: string,
    metadata?: any
  ): Promise<{ asset: any; pricing: any }> {
    // Generate symbol using nomenclature system
    const symbol = symbolGeneratorService.generateCreatorSymbol(creatorName, publisherCode);
    
    // Calculate pricing using unified pricing engine
    const pricingResult = unifiedPricingEngine.calculatePrice({
      assetType: 'creator',
      name: creatorName,
      era: metadata?.era || 'silver',
      keyAppearances: metadata?.keyAppearances || 100,
      franchiseTier: metadata?.tier || 1,
      isVariant: false
    });

    // Create asset record
    const asset = {
      symbol,
      name: `${creatorName} (${publisherCode})`,
      type: 'creator',
      description: `${creatorName} - ${publisherCode} works`,
      metadata: {
        creatorName,
        publisherCode,
        source: 'creator_affiliation',
        ...metadata
      }
    };

    return { asset, pricing: pricingResult };
  }

  /**
   * Expand a creator into multiple assets (one per publisher affiliation)
   */
  async expandCreatorAffiliations(
    creatorName: string,
    affiliations: CreatorAffiliation[],
    metadata?: any
  ): Promise<{ inserted: number; symbols: string[] }> {
    const symbols: string[] = [];
    let inserted = 0;

    for (const affiliation of affiliations) {
      try {
        // Generate asset and pricing
        const { asset, pricing } = await this.generateCreatorAsset(
          creatorName,
          affiliation.publisherCode,
          { ...metadata, workCount: affiliation.workCount }
        );

        // Check if asset already exists
        const existing = await storage.getAssetBySymbol(asset.symbol);

        if (!existing) {
          // Insert asset
          const insertedAsset = await storage.createAsset(asset);

          // Insert pricing
          await storage.createAssetCurrentPrice({
            assetId: insertedAsset.id,
            currentPrice: pricing.sharePrice.toString(),
            totalMarketValue: pricing.totalMarketValue.toString(),
            totalFloat: pricing.totalFloat.toString(),
            source: 'mathematical'
          });

          symbols.push(asset.symbol);
          inserted++;
          console.log(`✓ Created asset: ${asset.symbol} ($${pricing.sharePrice})`);
        } else {
          console.log(`⊘ Asset exists: ${asset.symbol}`);
        }
      } catch (error) {
        console.error(`✗ Failed to create asset for ${creatorName} → ${affiliation.publisherCode}:`, error.message);
      }
    }

    return { inserted, symbols };
  }

  /**
   * Example: Expand Stan Lee
   */
  async expandStanLee(): Promise<any> {
    const affiliations: CreatorAffiliation[] = [
      {
        creatorName: 'Stan Lee',
        publisherCode: 'MRVL',
        publisherFullName: 'Marvel Comics',
        workCount: 1500,
        notableWorks: ['Amazing Spider-Man', 'Fantastic Four', 'X-Men', 'Avengers'],
        yearsActive: '1961-2018'
      },
      {
        creatorName: 'Stan Lee',
        publisherCode: 'TIME',
        publisherFullName: 'Timely Comics',
        workCount: 200,
        notableWorks: ['Captain America Comics', 'Young Allies'],
        yearsActive: '1940-1950'
      }
    ];

    return await this.expandCreatorAffiliations('Stan Lee', affiliations, {
      tier: 1,
      keyAppearances: 500
    });
  }

  /**
   * Example: Expand Jack Kirby
   */
  async expandJackKirby(): Promise<any> {
    const affiliations: CreatorAffiliation[] = [
      {
        creatorName: 'Jack Kirby',
        publisherCode: 'MRVL',
        publisherFullName: 'Marvel Comics',
        workCount: 1200,
        notableWorks: ['Fantastic Four', 'X-Men', 'Thor', 'Avengers'],
        yearsActive: '1961-1970'
      },
      {
        creatorName: 'Jack Kirby',
        publisherCode: 'DC',
        publisherFullName: 'DC Comics',
        workCount: 800,
        notableWorks: ['New Gods', 'Mister Miracle', 'Forever People'],
        yearsActive: '1970-1975'
      },
      {
        creatorName: 'Jack Kirby',
        publisherCode: 'TIME',
        publisherFullName: 'Timely Comics',
        workCount: 150,
        notableWorks: ['Captain America Comics', 'Young Allies'],
        yearsActive: '1940-1950'
      }
    ];

    return await this.expandCreatorAffiliations('Jack Kirby', affiliations, {
      tier: 1,
      keyAppearances: 400
    });
  }
}

export const creatorAffiliationService = new CreatorAffiliationService();
