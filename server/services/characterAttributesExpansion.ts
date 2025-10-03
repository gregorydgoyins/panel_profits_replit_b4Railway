import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { assets } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';

const sql_connection = neon(process.env.DATABASE_URL!);
const db = drizzle(sql_connection);

interface SuperheroRow {
  name: string;
  real_name: string;
  full_name: string;
  overall_score: string;
  history_text: string;
  powers_text: string;
  intelligence_score: string;
  strength_score: string;
  speed_score: string;
  durability_score: string;
  power_score: string;
  combat_score: string;
  superpowers: string;
  alter_egos: string;
  aliases: string;
  place_of_birth: string;
  first_appearance: string;
  creator: string;
  alignment: string;
  occupation: string;
  base: string;
  teams: string;
  relatives: string;
  gender: string;
  type_race: string;
  height: string;
  weight: string;
  eye_color: string;
  hair_color: string;
  skin_color: string;
  img: string;
  [key: string]: string; // For all the has_* power flags
}

export class CharacterAttributesExpansionService {
  private safeParseArray(value: string | null | undefined): string[] {
    if (!value || value === '[]' || value === "['']") return [];
    try {
      // Handle Python-style lists with single quotes
      const cleaned = value
        .replace(/\['/g, '["')
        .replace(/'\]/g, '"]')
        .replace(/', '/g, '", "')
        .replace(/','/g, '","');
      return JSON.parse(cleaned);
    } catch {
      return [];
    }
  }

  async processSuperheroesDataset(csvPath: string): Promise<{ updated: number; notFound: number; errors: number }> {
    const csvContent = readFileSync(csvPath, 'utf-8');
    const records: SuperheroRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`🦸 Processing ${records.length} superheroes with attributes...`);

    let updated = 0;
    let notFound = 0;
    let errors = 0;

    for (const row of records) {
      try {
        // Extract power flags (all has_* fields)
        const powers: string[] = [];
        for (const key in row) {
          if (key.startsWith('has_') && row[key] === '1.0') {
            const powerName = key.replace('has_', '').replace(/_/g, ' ');
            powers.push(powerName);
          }
        }

        // Build comprehensive attributes object
        const attributes = {
          // Biography
          realName: row.real_name || null,
          fullName: row.full_name || null,
          history: row.history_text || null,
          powersDescription: row.powers_text || null,
          
          // Stats
          stats: {
            overall: parseInt(row.overall_score) || null,
            intelligence: parseInt(row.intelligence_score) || null,
            strength: parseInt(row.strength_score) || null,
            speed: parseInt(row.speed_score) || null,
            durability: parseInt(row.durability_score) || null,
            power: parseInt(row.power_score) || null,
            combat: parseInt(row.combat_score) || null
          },
          
          // Powers
          superpowers: this.safeParseArray(row.superpowers),
          powers: powers,
          
          // Identity
          alterEgos: this.safeParseArray(row.alter_egos),
          aliases: this.safeParseArray(row.aliases),
          
          // Background
          placeOfBirth: row.place_of_birth || null,
          firstAppearance: row.first_appearance || null,
          creator: row.creator || null,
          alignment: row.alignment || null, // Good, Bad, Neutral
          
          // Occupation & Affiliations
          occupation: row.occupation || null,
          base: row.base || null,
          teams: this.safeParseArray(row.teams),
          relatives: row.relatives || null,
          
          // Physical
          gender: row.gender || null,
          race: row.type_race || null,
          height: row.height || null,
          weight: row.weight || null,
          eyeColor: row.eye_color || null,
          hairColor: row.hair_color || null,
          skinColor: row.skin_color || null,
          
          // Source
          attributesSource: 'kaggle_superheroes_nlp'
        };

        // Try to find existing character by name
        const existingAssets = await db
          .select()
          .from(assets)
          .where(sql`LOWER(${assets.name}) = LOWER(${row.name})`)
          .limit(1);

        if (existingAssets.length > 0) {
          const asset = existingAssets[0];
          
          // Merge with existing metadata
          const updatedMetadata = {
            ...(asset.metadata as any || {}),
            characterAttributes: attributes
          };

          // Update imageUrl if we have one and asset doesn't
          const updates: any = {
            metadata: updatedMetadata,
            updatedAt: new Date()
          };

          if (row.img && !asset.imageUrl) {
            updates.imageUrl = row.img;
          }

          await db
            .update(assets)
            .set(updates)
            .where(eq(assets.id, asset.id));

          updated++;
          
          if (updated % 100 === 0) {
            console.log(`   ✅ Updated ${updated} characters with attributes`);
          }
        } else {
          notFound++;
        }
      } catch (error) {
        console.error(`Error processing ${row.name}:`, error);
        errors++;
      }
    }

    console.log(`✅ Attribute update complete: ${updated} updated, ${notFound} not found, ${errors} errors`);
    return { updated, notFound, errors };
  }
}
