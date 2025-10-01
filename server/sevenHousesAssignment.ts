/**
 * Panel Profits - Seven Houses Assignment System
 * Maps assets to houses based on alignment/publisher and sets influence/narrative weights
 */

import { db } from './databaseStorage';
import { assets, sevenHouses } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

interface HouseMapping {
  houseId: string;
  influencePercent: number;
  narrativeWeight: number;
  reason: string;
}

export class SevenHousesAssignmentService {
  /**
   * Map asset to appropriate house based on alignment and publisher
   */
  private determineHouse(asset: any): HouseMapping | null {
    const metadata = asset.metadata as any;
    const publisher = metadata?.publisher?.toLowerCase() || '';
    const alignment = metadata?.alignment?.toLowerCase() || '';
    const description = (asset.description || '').toLowerCase();
    const type = asset.type;

    // Marvel assets → House of Marvel
    if (publisher.includes('marvel')) {
      return {
        houseId: 'marvel-house',
        influencePercent: 85 + Math.random() * 10, // 85-95%
        narrativeWeight: 75 + Math.random() * 15, // 75-90%
        reason: 'Marvel Comics publisher'
      };
    }

    // DC assets → House of DC
    if (publisher.includes('dc')) {
      return {
        houseId: 'dc-house',
        influencePercent: 85 + Math.random() * 10,
        narrativeWeight: 75 + Math.random() * 15,
        reason: 'DC Comics publisher'
      };
    }

    // Villains → Dark House
    if (type === 'VIL' || alignment === 'evil' || alignment === 'bad') {
      return {
        houseId: 'dark-house',
        influencePercent: 70 + Math.random() * 20,
        narrativeWeight: 80 + Math.random() * 15,
        reason: 'Villain alignment'
      };
    }

    // Heroes → Light House
    if (type === 'HER' || alignment === 'good') {
      return {
        houseId: 'light-house',
        influencePercent: 70 + Math.random() * 20,
        narrativeWeight: 75 + Math.random() * 15,
        reason: 'Hero alignment'
      };
    }

    // Teams → Unity House
    if (type === 'TEM') {
      return {
        houseId: 'unity-house',
        influencePercent: 65 + Math.random() * 25,
        narrativeWeight: 70 + Math.random() * 20,
        reason: 'Team asset'
      };
    }

    // Creators → Artisan House
    if (type === 'CRT') {
      return {
        houseId: 'artisan-house',
        influencePercent: 90 + Math.random() * 10,
        narrativeWeight: 85 + Math.random() * 10,
        reason: 'Creator/artist asset'
      };
    }

    // Gadgets/Objects → Tech House
    if (type === 'GAD') {
      return {
        houseId: 'tech-house',
        influencePercent: 60 + Math.random() * 30,
        narrativeWeight: 65 + Math.random() * 25,
        reason: 'Gadget/technology asset'
      };
    }

    // Default: Neutral house for unclassified assets
    return {
      houseId: 'neutral-house',
      influencePercent: 50 + Math.random() * 30,
      narrativeWeight: 50 + Math.random() * 30,
      reason: 'Unclassified asset'
    };
  }

  /**
   * Calculate narrative weight based on asset characteristics
   */
  private calculateNarrativeWeight(asset: any, baseWeight: number): number {
    const metadata = asset.metadata as any;
    let weight = baseWeight;

    // Increase weight for popular assets
    const popularity = metadata?.popularity || 50;
    if (popularity > 80) {
      weight += 10;
    } else if (popularity > 60) {
      weight += 5;
    }

    // Increase weight for high market cap assets
    const marketCap = metadata?.estimatedMarketCap || 0;
    if (marketCap > 50000000) { // $50M+
      weight += 10;
    } else if (marketCap > 10000000) { // $10M+
      weight += 5;
    }

    // Key issues have higher narrative weight
    if (asset.type === 'KEY') {
      weight += 15;
    }

    return Math.min(weight, 100);
  }

  /**
   * Assign house to a single asset
   */
  async assignHouseToAsset(assetId: string): Promise<void> {
    const [asset] = await db.select().from(assets).where(eq(assets.id, assetId)).limit(1);
    
    if (!asset) {
      console.error(`Asset ${assetId} not found`);
      return;
    }

    const mapping = this.determineHouse(asset);
    
    if (!mapping) {
      return;
    }

    // Calculate final narrative weight
    const narrativeWeight = this.calculateNarrativeWeight(asset, mapping.narrativeWeight);

    try {
      await db.update(assets)
        .set({
          houseId: mapping.houseId,
          houseInfluencePercent: mapping.influencePercent.toFixed(2),
          narrativeWeight: narrativeWeight.toFixed(2),
          controlledSince: new Date()
        })
        .where(eq(assets.id, assetId));

      console.log(`✅ Assigned ${asset.symbol} to ${mapping.houseId} (${mapping.influencePercent.toFixed(0)}% influence, ${narrativeWeight.toFixed(0)}% narrative weight)`);
    } catch (error) {
      console.error(`Error assigning house to ${asset.symbol}:`, error);
    }
  }

  /**
   * Assign houses to all assets in the database
   */
  async assignHousesToAllAssets(): Promise<void> {
    console.log('🏛️ Starting Seven Houses assignment...\n');

    const allAssets = await db.select().from(assets);
    
    console.log(`Found ${allAssets.length} assets to assign to houses\n`);

    // Track assignments by house
    const houseStats: Record<string, number> = {};

    for (const asset of allAssets) {
      const mapping = this.determineHouse(asset);
      
      if (!mapping) continue;

      const narrativeWeight = this.calculateNarrativeWeight(asset, mapping.narrativeWeight);

      try {
        await db.update(assets)
          .set({
            houseId: mapping.houseId,
            houseInfluencePercent: mapping.influencePercent.toFixed(2),
            narrativeWeight: narrativeWeight.toFixed(2),
            controlledSince: new Date()
          })
          .where(eq(assets.id, asset.id));

        houseStats[mapping.houseId] = (houseStats[mapping.houseId] || 0) + 1;
      } catch (error) {
        console.error(`Error assigning house to ${asset.symbol}:`, error);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Seven Houses assignment complete!');
    console.log('='.repeat(60));
    console.log('\n📊 House Distribution:');
    Object.entries(houseStats).forEach(([houseId, count]) => {
      console.log(`   ${houseId}: ${count} assets`);
    });
  }

  /**
   * Initialize Seven Houses in database (if not already created)
   */
  async ensureHousesExist(): Promise<void> {
    const houses = [
      {
        id: 'marvel-house',
        name: 'House of Marvel',
        description: 'Controllers of the Marvel Universe assets',
        specialization: 'Marvel Comics',
        color: '#ED1D24',
        symbol: 'shield'
      },
      {
        id: 'dc-house',
        name: 'House of DC',
        description: 'Controllers of the DC Comics assets',
        specialization: 'DC Comics',
        color: '#0078F0',
        symbol: 'shield-check'
      },
      {
        id: 'dark-house',
        name: 'House of Shadows',
        description: 'Controllers of villain and antagonist assets',
        specialization: 'Villains & Antagonists',
        color: '#8B0000',
        symbol: 'skull'
      },
      {
        id: 'light-house',
        name: 'House of Light',
        description: 'Controllers of hero and protagonist assets',
        specialization: 'Heroes & Protagonists',
        color: '#FFD700',
        symbol: 'star'
      },
      {
        id: 'unity-house',
        name: 'House of Unity',
        description: 'Controllers of team and alliance assets',
        specialization: 'Teams & Alliances',
        color: '#4CAF50',
        symbol: 'users'
      },
      {
        id: 'artisan-house',
        name: 'House of Artisans',
        description: 'Controllers of creator and artist assets',
        specialization: 'Creators & Artists',
        color: '#9C27B0',
        symbol: 'palette'
      },
      {
        id: 'tech-house',
        name: 'House of Technology',
        description: 'Controllers of gadget and technology assets',
        specialization: 'Gadgets & Technology',
        color: '#00BCD4',
        symbol: 'cpu'
      },
      {
        id: 'neutral-house',
        name: 'House of Neutrality',
        description: 'Controllers of unaligned and neutral assets',
        specialization: 'Neutral Assets',
        color: '#9E9E9E',
        symbol: 'circle'
      }
    ];

    for (const house of houses) {
      try {
        const existing = await db.select().from(sevenHouses).where(eq(sevenHouses.id, house.id)).limit(1);
        
        if (existing.length === 0) {
          await db.insert(sevenHouses).values(house);
          console.log(`✅ Created house: ${house.name}`);
        }
      } catch (error) {
        console.error(`Error creating house ${house.name}:`, error);
      }
    }
  }

  /**
   * Update house statistics based on controlled assets
   */
  async updateHouseStatistics(): Promise<void> {
    console.log('\n📊 Updating house statistics...');

    const houses = await db.select().from(sevenHouses);

    for (const house of houses) {
      const controlledAssets = await db
        .select()
        .from(assets)
        .where(eq(assets.houseId, house.id));

      const totalMarketCap = controlledAssets.reduce((sum, asset) => {
        const metadata = asset.metadata as any;
        return sum + (metadata?.estimatedMarketCap || 0);
      }, 0);

      const avgInfluence = controlledAssets.reduce((sum, asset) => {
        return sum + parseFloat(asset.houseInfluencePercent || '0');
      }, 0) / (controlledAssets.length || 1);

      await db.update(sevenHouses)
        .set({
          controlledAssetsCount: controlledAssets.length,
          marketCap: totalMarketCap.toFixed(2),
          powerLevel: avgInfluence.toFixed(2)
        })
        .where(eq(sevenHouses.id, house.id));

      console.log(`  ✅ ${house.name}: ${controlledAssets.length} assets, $${(totalMarketCap / 1000000).toFixed(1)}M market cap`);
    }
  }
}

export const sevenHousesAssignment = new SevenHousesAssignmentService();
