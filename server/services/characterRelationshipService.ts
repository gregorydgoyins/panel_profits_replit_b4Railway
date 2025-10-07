import { db } from "@db";
import { assets, marvelLocations, marvelGadgets } from "@shared/schema";
import { eq, sql, inArray } from "drizzle-orm";

interface CharacterMapping {
  characterName: string;
  relatedNames: string[]; // Locations, gadgets, teams they're associated with
  teams?: string[];
  notableAppearances?: string[];
}

const CHARACTER_RELATIONSHIPS: CharacterMapping[] = [
  // Thor & Asgardian characters
  { 
    characterName: "Thor", 
    relatedNames: ["Asgard", "Mjolnir"],
    teams: ["Avengers"],
    notableAppearances: ["Ragnarok", "Infinity War", "Thor: God of Thunder"]
  },
  { 
    characterName: "Odin", 
    relatedNames: ["Asgard"],
    teams: [],
    notableAppearances: ["Ragnarok", "Journey into Mystery"]
  },
  { 
    characterName: "Loki", 
    relatedNames: ["Asgard"],
    teams: [],
    notableAppearances: ["Siege", "Infinity War", "Loki: Agent of Asgard"]
  },
  
  // Wakanda characters
  { 
    characterName: "Black Panther", 
    relatedNames: ["Wakanda", "Vibranium"],
    teams: ["Avengers"],
    notableAppearances: ["Black Panther", "Civil War", "Avengers"]
  },
  { 
    characterName: "T'Challa", 
    relatedNames: ["Wakanda", "Vibranium"],
    teams: ["Avengers"],
    notableAppearances: ["Black Panther"]
  },
  { 
    characterName: "Shuri", 
    relatedNames: ["Wakanda"],
    teams: [],
    notableAppearances: ["Black Panther"]
  },
  
  // Latveria & Doctor Doom
  { 
    characterName: "Doctor Doom", 
    relatedNames: ["Latveria"],
    teams: [],
    notableAppearances: ["Secret Wars", "Books of Doom", "Fantastic Four"]
  },
  
  // Atlantis characters
  { 
    characterName: "Namor", 
    relatedNames: ["Atlantis"],
    teams: ["Invaders", "Illuminati"],
    notableAppearances: ["Avengers vs X-Men", "Fear Itself"]
  },
  
  // Dark Dimension & mystical
  { 
    characterName: "Doctor Strange", 
    relatedNames: ["Eye of Agamotto", "Sanctum Sanctorum"],
    teams: ["Defenders", "Avengers", "Illuminati"],
    notableAppearances: ["Infinity War", "Doctor Strange: The Oath"]
  },
  { 
    characterName: "Dormammu", 
    relatedNames: ["The Dark Dimension"],
    teams: [],
    notableAppearances: ["Strange Tales", "Doctor Strange"]
  },
  
  // Avengers Tower & NYC heroes
  { 
    characterName: "Iron Man", 
    relatedNames: ["Avengers Tower", "Arc Reactor", "Iron Man Armor"],
    teams: ["Avengers", "Illuminati"],
    notableAppearances: ["Civil War", "Infinity War", "Iron Man: Extremis"]
  },
  { 
    characterName: "Tony Stark", 
    relatedNames: ["Avengers Tower", "Arc Reactor", "Iron Man Armor"],
    teams: ["Avengers", "Illuminati"],
    notableAppearances: ["Civil War", "Infinity War"]
  },
  { 
    characterName: "Captain America", 
    relatedNames: ["Avengers Tower", "Captain America's Shield"],
    teams: ["Avengers"],
    notableAppearances: ["Civil War", "Winter Soldier", "Secret Empire"]
  },
  { 
    characterName: "Steve Rogers", 
    relatedNames: ["Avengers Tower", "Captain America's Shield"],
    teams: ["Avengers"],
    notableAppearances: ["Civil War", "Winter Soldier"]
  },
  { 
    characterName: "Hulk", 
    relatedNames: ["Avengers Tower"],
    teams: ["Avengers", "Defenders"],
    notableAppearances: ["World War Hulk", "Planet Hulk", "Infinity War"]
  },
  { 
    characterName: "Bruce Banner", 
    relatedNames: ["Avengers Tower"],
    teams: ["Avengers"],
    notableAppearances: ["World War Hulk", "Infinity War"]
  },
  { 
    characterName: "Hawkeye", 
    relatedNames: ["Avengers Tower"],
    teams: ["Avengers"],
    notableAppearances: ["Civil War", "Hawkeye"]
  },
  { 
    characterName: "Black Widow", 
    relatedNames: ["Avengers Tower"],
    teams: ["Avengers", "S.H.I.E.L.D."],
    notableAppearances: ["Civil War", "Black Widow"]
  },
  
  // X-Mansion & X-Men
  { 
    characterName: "Professor X", 
    relatedNames: ["X-Mansion", "Cerebro"],
    teams: ["X-Men"],
    notableAppearances: ["House of M", "Deadly Genesis"]
  },
  { 
    characterName: "Charles Xavier", 
    relatedNames: ["X-Mansion", "Cerebro"],
    teams: ["X-Men", "Illuminati"],
    notableAppearances: ["House of M"]
  },
  { 
    characterName: "Wolverine", 
    relatedNames: ["X-Mansion"],
    teams: ["X-Men", "Avengers"],
    notableAppearances: ["Old Man Logan", "Weapon X", "House of M"]
  },
  { 
    characterName: "Cyclops", 
    relatedNames: ["X-Mansion"],
    teams: ["X-Men"],
    notableAppearances: ["Avengers vs X-Men", "House of M"]
  },
  { 
    characterName: "Storm", 
    relatedNames: ["X-Mansion"],
    teams: ["X-Men", "Avengers"],
    notableAppearances: ["House of M"]
  },
  { 
    characterName: "Jean Grey", 
    relatedNames: ["X-Mansion"],
    teams: ["X-Men"],
    notableAppearances: ["Dark Phoenix Saga", "House of M"]
  },
  
  // Negative Zone
  { 
    characterName: "Annihilus", 
    relatedNames: ["Negative Zone"],
    teams: [],
    notableAppearances: ["Annihilation"]
  },
  
  // Quantum Realm (not in locations, but showing pattern)
  { 
    characterName: "Ant-Man", 
    relatedNames: ["Pym Particles"],
    teams: ["Avengers"],
    notableAppearances: ["Civil War"]
  },
  
  // Spider-Man
  { 
    characterName: "Spider-Man", 
    relatedNames: ["Web-Shooters"],
    teams: ["Avengers", "Fantastic Four"],
    notableAppearances: ["Civil War", "Spider-Verse", "One More Day"]
  },
  { 
    characterName: "Peter Parker", 
    relatedNames: ["Web-Shooters"],
    teams: ["Avengers"],
    notableAppearances: ["Civil War", "Spider-Verse"]
  },
  
  // Infinity Stones
  { 
    characterName: "Thanos", 
    relatedNames: ["Infinity Gauntlet", "Tesseract"],
    teams: [],
    notableAppearances: ["Infinity Gauntlet", "Infinity War", "The Thanos Imperative"]
  },
  
  // Baxter Building & Fantastic Four
  { 
    characterName: "Mister Fantastic", 
    relatedNames: ["Baxter Building"],
    teams: ["Fantastic Four", "Illuminati"],
    notableAppearances: ["Secret Wars", "Civil War"]
  },
  { 
    characterName: "Reed Richards", 
    relatedNames: ["Baxter Building"],
    teams: ["Fantastic Four", "Illuminati"],
    notableAppearances: ["Secret Wars"]
  },
  { 
    characterName: "Invisible Woman", 
    relatedNames: ["Baxter Building"],
    teams: ["Fantastic Four"],
    notableAppearances: ["Secret Wars"]
  },
  { 
    characterName: "Human Torch", 
    relatedNames: ["Baxter Building"],
    teams: ["Fantastic Four"],
    notableAppearances: ["Secret Wars"]
  },
  { 
    characterName: "Thing", 
    relatedNames: ["Baxter Building"],
    teams: ["Fantastic Four"],
    notableAppearances: ["Secret Wars"]
  },
];

export class CharacterRelationshipService {
  /**
   * Populate character relationships by linking characters to locations, gadgets, and teams
   */
  async populateRelationships(): Promise<{
    charactersUpdated: number;
    locationsUpdated: number;
    gadgetsUpdated: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let charactersUpdated = 0;
    let locationsUpdated = 0;
    let gadgetsUpdated = 0;

    console.log(`🔗 Starting character relationship population...`);

    for (const mapping of CHARACTER_RELATIONSHIPS) {
      try {
        await this.processCharacterMapping(mapping);
        charactersUpdated++;
      } catch (error) {
        const errorMsg = `Failed to process ${mapping.characterName}: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    // Now update locations and gadgets with their related characters (reverse mapping)
    try {
      const locationUpdateResult = await this.updateLocationRelationships();
      locationsUpdated = locationUpdateResult;
    } catch (error) {
      errors.push(`Failed to update location relationships: ${error}`);
    }

    try {
      const gadgetUpdateResult = await this.updateGadgetRelationships();
      gadgetsUpdated = gadgetUpdateResult;
    } catch (error) {
      errors.push(`Failed to update gadget relationships: ${error}`);
    }

    console.log(`✅ Relationship population complete!`);
    console.log(`   - Characters updated: ${charactersUpdated}`);
    console.log(`   - Locations updated: ${locationsUpdated}`);
    console.log(`   - Gadgets updated: ${gadgetsUpdated}`);
    if (errors.length > 0) {
      console.log(`   - Errors: ${errors.length}`);
    }

    return {
      charactersUpdated,
      locationsUpdated,
      gadgetsUpdated,
      errors,
    };
  }

  /**
   * Process a single character mapping
   */
  private async processCharacterMapping(mapping: CharacterMapping): Promise<void> {
    // Find the character by name
    const character = await db.query.assets.findFirst({
      where: (assets, { and, eq, ilike }) => 
        and(
          eq(assets.type, 'character'),
          ilike(assets.name, mapping.characterName)
        ),
    });

    if (!character) {
      console.log(`   ⚠️  Character not found: ${mapping.characterName}`);
      return;
    }

    const relatedAssetIds: string[] = [];

    // Find related locations and gadgets
    for (const relatedName of mapping.relatedNames) {
      // Check if it's a location
      const location = await db.query.marvelLocations.findFirst({
        where: (marvelLocations, { ilike }) => ilike(marvelLocations.name, relatedName),
      });

      if (location) {
        relatedAssetIds.push(location.id);
        continue;
      }

      // Check if it's a gadget
      const gadget = await db.query.marvelGadgets.findFirst({
        where: (marvelGadgets, { ilike }) => ilike(marvelGadgets.name, relatedName),
      });

      if (gadget) {
        relatedAssetIds.push(gadget.id);
        continue;
      }

      // It might be another character or asset
      const relatedAsset = await db.query.assets.findFirst({
        where: (assets, { ilike }) => ilike(assets.name, relatedName),
      });

      if (relatedAsset) {
        relatedAssetIds.push(relatedAsset.id);
      }
    }

    // Update the character with relationships
    await db.update(assets)
      .set({
        relatedAssetIds: relatedAssetIds.length > 0 ? relatedAssetIds : null,
        teamTags: mapping.teams && mapping.teams.length > 0 ? mapping.teams : null,
        notableAppearances: mapping.notableAppearances && mapping.notableAppearances.length > 0 
          ? mapping.notableAppearances 
          : null,
        updatedAt: new Date(),
      })
      .where(eq(assets.id, character.id));

    console.log(`   ✅ Updated ${character.name}: ${relatedAssetIds.length} relations, ${mapping.teams?.length || 0} teams`);
  }

  /**
   * Update locations with their related characters (reverse mapping)
   */
  private async updateLocationRelationships(): Promise<number> {
    let updated = 0;

    // Get all locations
    const locations = await db.select().from(marvelLocations);

    for (const location of locations) {
      // Find characters that reference this location
      const relatedCharacters = await db.query.assets.findMany({
        where: (assets, { and, eq, sql }) => 
          and(
            eq(assets.type, 'character'),
            sql`${location.id} = ANY(${assets.relatedAssetIds})`
          ),
      });

      if (relatedCharacters.length > 0) {
        const characterIds = relatedCharacters.map(c => c.id);
        await db.update(marvelLocations)
          .set({
            relatedCharacterIds: characterIds,
            updatedAt: new Date(),
          })
          .where(eq(marvelLocations.id, location.id));
        
        updated++;
        console.log(`   ✅ Location ${location.name}: linked ${characterIds.length} characters`);
      }
    }

    return updated;
  }

  /**
   * Update gadgets with their related characters (reverse mapping)
   */
  private async updateGadgetRelationships(): Promise<number> {
    let updated = 0;

    // Get all gadgets
    const gadgets = await db.select().from(marvelGadgets);

    for (const gadget of gadgets) {
      // Find characters that reference this gadget
      const relatedCharacters = await db.query.assets.findMany({
        where: (assets, { and, eq, sql }) => 
          and(
            eq(assets.type, 'character'),
            sql`${gadget.id} = ANY(${assets.relatedAssetIds})`
          ),
      });

      if (relatedCharacters.length > 0) {
        const characterIds = relatedCharacters.map(c => c.id);
        await db.update(marvelGadgets)
          .set({
            relatedCharacterIds: characterIds,
            updatedAt: new Date(),
          })
          .where(eq(marvelGadgets.id, gadget.id));
        
        updated++;
        console.log(`   ✅ Gadget ${gadget.name}: linked ${characterIds.length} characters`);
      }
    }

    return updated;
  }
}
