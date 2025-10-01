/**
 * NPC Trader Generator Service
 * 
 * Generates 1000 unique AI traders with diverse backgrounds, personalities,
 * and capital allocations for the Panel Profits trading simulation.
 */

import { generatePersonalityConfig, getAllArchetypes } from './npcPersonalityEngine';
import type { InsertNpcTrader, InsertNpcTraderStrategy, InsertNpcTraderPsychology } from '@shared/schema';

// Diverse first names from various cultural backgrounds
const FIRST_NAMES = [
  // Common Western
  'James', 'Michael', 'Robert', 'John', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher',
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
  'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Andrew', 'Kenneth', 'Joshua', 'Kevin',
  'Emily', 'Ashley', 'Kimberly', 'Donna', 'Michelle', 'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie',
  
  // Hispanic/Latino
  'Jose', 'Luis', 'Carlos', 'Juan', 'Jorge', 'Francisco', 'Miguel', 'Ricardo', 'Antonio', 'Pedro',
  'Maria', 'Carmen', 'Rosa', 'Ana', 'Elena', 'Isabel', 'Sofia', 'Lucia', 'Gabriela', 'Daniela',
  'Diego', 'Fernando', 'Alejandro', 'Manuel', 'Roberto', 'Eduardo', 'Javier', 'Rafael', 'Sergio', 'Andres',
  'Laura', 'Monica', 'Teresa', 'Adriana', 'Veronica', 'Claudia', 'Patricia', 'Alejandra', 'Beatriz', 'Silvia',
  
  // East Asian
  'Wei', 'Ming', 'Jun', 'Hao', 'Xin', 'Feng', 'Chen', 'Yang', 'Jian', 'Long',
  'Mei', 'Ling', 'Yan', 'Xia', 'Hui', 'Jing', 'Qing', 'Fang', 'Li', 'Yun',
  'Hiroshi', 'Takeshi', 'Kenji', 'Yuki', 'Haruto', 'Akira', 'Satoshi', 'Ryu', 'Kazuki', 'Daichi',
  'Sakura', 'Yui', 'Hana', 'Aoi', 'Rina', 'Kaori', 'Miho', 'Natsuki', 'Asuka', 'Kana',
  
  // South Asian
  'Raj', 'Amit', 'Vikram', 'Arjun', 'Sanjay', 'Rohan', 'Aditya', 'Krishna', 'Rahul', 'Nikhil',
  'Priya', 'Anjali', 'Kavita', 'Neha', 'Pooja', 'Sita', 'Radha', 'Deepa', 'Meera', 'Lata',
  'Hassan', 'Omar', 'Tariq', 'Nasir', 'Faisal', 'Kamal', 'Ibrahim', 'Rashid', 'Samir', 'Bilal',
  'Fatima', 'Aisha', 'Zara', 'Layla', 'Nadia', 'Amina', 'Yasmin', 'Hana', 'Sara', 'Maryam',
  
  // African
  'Kwame', 'Kofi', 'Jabari', 'Malik', 'Amari', 'Zuri', 'Ayodele', 'Chike', 'Sekou', 'Bandele',
  'Nia', 'Zola', 'Amara', 'Asha', 'Kioni', 'Imani', 'Safiya', 'Thandiwe', 'Kamaria', 'Makena',
  'Marcus', 'Tyrone', 'Jerome', 'Darius', 'Terrell', 'Jamal', 'DeShawn', 'Antoine', 'Isaiah', 'Malcolm',
  'Tanisha', 'Keisha', 'Shanice', 'Latoya', 'Tamika', 'Ebony', 'Jasmine', 'Monique', 'Tiffany', 'Candace',
  
  // European (non-English)
  'Pierre', 'Jean', 'Luc', 'Andre', 'Philippe', 'Marc', 'Antoine', 'Jacques', 'Claude', 'Olivier',
  'Marie', 'Sophie', 'Claire', 'Camille', 'Isabelle', 'Nathalie', 'Sylvie', 'Veronique', 'Cecile', 'Brigitte',
  'Hans', 'Lukas', 'Maximilian', 'Felix', 'Lars', 'Erik', 'Sven', 'Gunther', 'Klaus', 'Dieter',
  'Anna', 'Emma', 'Greta', 'Helga', 'Ingrid', 'Petra', 'Sabine', 'Ursula', 'Katrin', 'Monika',
  
  // Middle Eastern
  'Ahmed', 'Mohammed', 'Ali', 'Hassan', 'Hussein', 'Khalid', 'Youssef', 'Karim', 'Rami', 'Walid',
  'Fatima', 'Laila', 'Zahra', 'Amira', 'Noor', 'Huda', 'Rania', 'Salma', 'Dina', 'Lina',
  
  // Additional diverse names
  'Connor', 'Dylan', 'Tyler', 'Brandon', 'Austin', 'Nathan', 'Zachary', 'Logan', 'Cameron', 'Ryan',
  'Megan', 'Hannah', 'Samantha', 'Rachel', 'Nicole', 'Alexis', 'Victoria', 'Lauren', 'Brittany', 'Kayla',
  'Ivan', 'Dmitri', 'Sergei', 'Vladimir', 'Nikolai', 'Andrei', 'Pavel', 'Yuri', 'Boris', 'Viktor',
  'Natasha', 'Olga', 'Svetlana', 'Elena', 'Irina', 'Marina', 'Oksana', 'Tatiana', 'Yulia', 'Katya',
  
  // Modern/Professional names
  'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'Rowan', 'Dakota',
  'Alex', 'Sam', 'Blake', 'Drew', 'Cameron', 'Jesse', 'Harper', 'Skylar', 'Finley', 'Reese',
];

// Diverse last names from various cultural backgrounds
const LAST_NAMES = [
  // Western/English
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris',
  'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres',
  'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell',
  
  // Hispanic/Latino
  'Lopez', 'Gonzalez', 'Hernandez', 'Perez', 'Sanchez', 'Ramirez', 'Cruz', 'Gomez', 'Morales', 'Reyes',
  'Jimenez', 'Diaz', 'Ruiz', 'Ortiz', 'Gutierrez', 'Mendez', 'Alvarez', 'Castro', 'Vargas', 'Romero',
  'Fernandez', 'Moreno', 'Silva', 'Medina', 'Delgado', 'Ramos', 'Vega', 'Soto', 'Aguilar', 'Castillo',
  
  // East Asian
  'Chen', 'Wang', 'Li', 'Zhang', 'Liu', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou',
  'Xu', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'He', 'Gao', 'Lin', 'Luo',
  'Tanaka', 'Suzuki', 'Takahashi', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato', 'Yoshida',
  'Kim', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim', 'Han',
  
  // South Asian
  'Patel', 'Singh', 'Kumar', 'Shah', 'Sharma', 'Gupta', 'Khan', 'Reddy', 'Chopra', 'Mehta',
  'Rao', 'Kapoor', 'Verma', 'Joshi', 'Nair', 'Iyer', 'Das', 'Bose', 'Menon', 'Desai',
  'Ali', 'Ahmed', 'Rahman', 'Hussein', 'Hassan', 'Malik', 'Siddiqui', 'Iqbal', 'Ansari', 'Hashmi',
  
  // African
  'Okafor', 'Eze', 'Nwosu', 'Okeke', 'Adeyemi', 'Oluwaseun', 'Mensah', 'Boateng', 'Koffi', 'Diallo',
  'Mbeki', 'Mwangi', 'Okoth', 'Kamau', 'Otieno', 'Wanjiru', 'Kimani', 'Njoroge', 'Mutua', 'Odhiambo',
  'Washington', 'Jefferson', 'Jackson', 'Franklin', 'Coleman', 'Henderson', 'Mitchell', 'Carter', 'Turner', 'Parker',
  
  // European (non-English)
  'Dubois', 'Bernard', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Lefevre', 'Leroy', 'Garnier', 'Rousseau',
  'Mueller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
  'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco',
  'Ivanov', 'Petrov', 'Sidorov', 'Kuznetsov', 'Sokolov', 'Popov', 'Lebedev', 'Kozlov', 'Novikov', 'Morozov',
  
  // Scandinavian
  'Johansson', 'Andersson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson', 'Persson', 'Svensson', 'Gustafsson',
  'Hansen', 'Nielsen', 'Jensen', 'Pedersen', 'Andersen', 'Christensen', 'Larsen', 'Sorensen', 'Rasmussen', 'Jorgensen',
  
  // Middle Eastern
  'Al-Rashid', 'Al-Masri', 'Al-Farsi', 'Al-Najjar', 'Al-Hamadi', 'Al-Mahmoud', 'Al-Sayed', 'Al-Qahtani', 'Al-Dosari', 'Al-Otaibi',
  
  // Additional professional surnames
  'Sterling', 'Morrison', 'Sullivan', 'Richards', 'Murphy', 'Cooper', 'Reed', 'Bailey', 'Bell', 'Ross',
  'Peterson', 'Cook', 'Rogers', 'Morgan', 'Brooks', 'Kelly', 'Howard', 'Ward', 'Cox', 'Richardson',
];

/**
 * Capital tier configuration
 */
interface CapitalTier {
  name: string;
  count: number;
  minCapital: number;
  maxCapital: number;
}

const CAPITAL_TIERS: CapitalTier[] = [
  { name: 'Whale', count: 10, minCapital: 50_000_000, maxCapital: 200_000_000 },
  { name: 'Large', count: 40, minCapital: 10_000_000, maxCapital: 49_000_000 },
  { name: 'Medium', count: 150, minCapital: 1_000_000, maxCapital: 9_900_000 },
  { name: 'Small', count: 300, minCapital: 100_000, maxCapital: 999_000 },
  { name: 'Micro', count: 500, minCapital: 10_000, maxCapital: 99_000 },
];

/**
 * Generate a random number within a range
 */
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a random integer within a range (inclusive)
 */
function randomIntInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Select a random element from an array
 */
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a unique trader name
 */
function generateUniqueName(existingNames: Set<string>): string {
  let attempts = 0;
  const maxAttempts = 1000;
  
  while (attempts < maxAttempts) {
    const firstName = randomElement(FIRST_NAMES);
    const lastName = randomElement(LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    
    if (!existingNames.has(name)) {
      existingNames.add(name);
      return name;
    }
    
    attempts++;
  }
  
  // Fallback: add a number if we can't generate unique name
  const firstName = randomElement(FIRST_NAMES);
  const lastName = randomElement(LAST_NAMES);
  const name = `${firstName} ${lastName} ${randomIntInRange(1, 9999)}`;
  existingNames.add(name);
  return name;
}

/**
 * Generate random preferred assets based on archetype
 */
function generatePreferredAssets(archetype: string): string[] {
  const assetCategories = {
    whale: ['characters', 'publishers', 'creators', 'etfs'],
    day_trader: ['characters', 'issues', 'options'],
    value_investor: ['characters', 'creators', 'publishers', 'bonds'],
    momentum_chaser: ['characters', 'issues', 'options'],
    contrarian: ['characters', 'issues', 'creators', 'publishers'],
    swing_trader: ['characters', 'issues', 'creators'],
    dividend_hunter: ['bonds', 'creators', 'publishers', 'etfs'],
    options_gambler: ['options', 'characters', 'issues'],
    index_hugger: ['etfs', 'publishers'],
    panic_seller: ['characters', 'issues', 'creators'],
  };
  
  const categories = assetCategories[archetype as keyof typeof assetCategories] || ['characters', 'issues'];
  
  // Return 2-4 random categories from the archetype's preferences
  const count = randomIntInRange(2, Math.min(4, categories.length));
  const shuffled = [...categories].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Complete NPC trader data structure
 */
export interface CompleteNPCTrader {
  trader: InsertNpcTrader;
  strategy: Omit<InsertNpcTraderStrategy, 'traderId'>;
  psychology: Omit<InsertNpcTraderPsychology, 'traderId'>;
}

/**
 * Generate NPC traders with diverse names, capitals, and personalities
 * 
 * @param count - Number of traders to generate (default: 1000)
 * @returns Array of complete NPC trader data
 */
export function generateNPCTraders(count: number = 1000): CompleteNPCTrader[] {
  const traders: CompleteNPCTrader[] = [];
  const existingNames = new Set<string>();
  const archetypes = getAllArchetypes();
  
  // Calculate how many traders per archetype
  const tradersPerArchetype = Math.floor(count / archetypes.length);
  const remainder = count % archetypes.length;
  
  // Build tier assignments
  const tierAssignments: CapitalTier[] = [];
  for (const tier of CAPITAL_TIERS) {
    for (let i = 0; i < tier.count && tierAssignments.length < count; i++) {
      tierAssignments.push(tier);
    }
  }
  
  // Shuffle tier assignments for randomness
  for (let i = tierAssignments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tierAssignments[i], tierAssignments[j]] = [tierAssignments[j], tierAssignments[i]];
  }
  
  let traderIndex = 0;
  
  // Generate traders for each archetype
  for (let archetypeIndex = 0; archetypeIndex < archetypes.length; archetypeIndex++) {
    const archetype = archetypes[archetypeIndex];
    
    // Add extra trader to first few archetypes if there's a remainder
    const numTradersForArchetype = tradersPerArchetype + (archetypeIndex < remainder ? 1 : 0);
    
    for (let i = 0; i < numTradersForArchetype && traderIndex < count; i++) {
      const name = generateUniqueName(existingNames);
      const tier = tierAssignments[traderIndex];
      const startingCapital = randomInRange(tier.minCapital, tier.maxCapital);
      
      // Generate personality configuration from personality engine
      const personality = generatePersonalityConfig(archetype);
      
      // Build trader data
      const trader: InsertNpcTrader = {
        name,
        personalityArchetype: archetype,
        riskTolerance: personality.riskTolerance.toString(),
        skillLevel: Math.round(personality.skillLevel),
        startingCapital: startingCapital.toFixed(2),
        currentCapital: startingCapital.toFixed(2),
        totalTrades: 0,
        winRate: '0.00',
        isActive: true,
      };
      
      // Build strategy data
      const strategy: Omit<InsertNpcTraderStrategy, 'traderId'> = {
        preferredAssets: generatePreferredAssets(archetype),
        holdingPeriodDays: Math.round(personality.holdingPeriod),
        positionSizingStrategy: 'percentage',
        maxPositionSize: personality.positionSizing.toFixed(2),
        stopLossPercent: personality.stopLoss.toFixed(2),
        takeProfitPercent: personality.takeProfit.toFixed(2),
      };
      
      // Build psychology data
      const psychology: Omit<InsertNpcTraderPsychology, 'traderId'> = {
        panicThreshold: personality.panicThreshold.toFixed(2),
        greedThreshold: personality.greedThreshold.toFixed(2),
        fomoSusceptibility: Math.round(personality.fomoSusceptibility / 10), // Scale to 1-10
        confidenceBias: Math.round((personality.skillLevel + personality.riskTolerance / 10) / 2), // Derived from skill and risk
        lossCutSpeed: personality.lossCutSpeed,
        newsReaction: personality.newsReaction,
      };
      
      traders.push({
        trader,
        strategy,
        psychology,
      });
      
      traderIndex++;
    }
  }
  
  return traders;
}

/**
 * Seed NPC traders to the database
 * 
 * @param db - Database instance with Drizzle ORM
 * @returns Summary of seeded traders
 */
export async function seedNPCTradersToDatabase(db: any): Promise<{
  success: boolean;
  tradersSeeded: number;
  strategiesSeeded: number;
  psychologiesSeeded: number;
  message: string;
  archetypeDistribution: Record<string, number>;
  capitalDistribution: Record<string, number>;
}> {
  try {
    const { npcTraders, npcTraderStrategies, npcTraderPsychology } = await import('@shared/schema');
    const { eq, count } = await import('drizzle-orm');
    
    // Check if NPCs already exist
    const existingCount = await db.select({ count: count() }).from(npcTraders);
    
    if (existingCount[0]?.count > 0) {
      return {
        success: false,
        tradersSeeded: 0,
        strategiesSeeded: 0,
        psychologiesSeeded: 0,
        message: `Database already contains ${existingCount[0].count} NPC traders. Skipping seeding to avoid duplicates.`,
        archetypeDistribution: {},
        capitalDistribution: {},
      };
    }
    
    // Generate 1000 traders
    console.log('🤖 Generating 1000 NPC traders...');
    const traders = generateNPCTraders(1000);
    
    // Track distributions for summary
    const archetypeDistribution: Record<string, number> = {};
    const capitalDistribution: Record<string, number> = {
      'Whale (>$50M)': 0,
      'Large ($10M-$49M)': 0,
      'Medium ($1M-$9.9M)': 0,
      'Small ($100K-$999K)': 0,
      'Micro ($10K-$99K)': 0,
    };
    
    // Insert traders and track their IDs
    console.log('💾 Inserting traders into database...');
    const insertedTraders: any[] = [];
    
    for (const npcData of traders) {
      // Insert trader
      const [insertedTrader] = await db.insert(npcTraders)
        .values(npcData.trader)
        .returning();
      
      insertedTraders.push(insertedTrader);
      
      // Insert strategy
      await db.insert(npcTraderStrategies).values({
        ...npcData.strategy,
        traderId: insertedTrader.id,
      });
      
      // Insert psychology
      await db.insert(npcTraderPsychology).values({
        ...npcData.psychology,
        traderId: insertedTrader.id,
      });
      
      // Track archetype distribution
      const archetype = npcData.trader.personalityArchetype;
      archetypeDistribution[archetype] = (archetypeDistribution[archetype] || 0) + 1;
      
      // Track capital distribution
      const capital = parseFloat(npcData.trader.startingCapital);
      if (capital >= 50_000_000) {
        capitalDistribution['Whale (>$50M)']++;
      } else if (capital >= 10_000_000) {
        capitalDistribution['Large ($10M-$49M)']++;
      } else if (capital >= 1_000_000) {
        capitalDistribution['Medium ($1M-$9.9M)']++;
      } else if (capital >= 100_000) {
        capitalDistribution['Small ($100K-$999K)']++;
      } else {
        capitalDistribution['Micro ($10K-$99K)']++;
      }
    }
    
    console.log('✅ NPC traders seeded successfully!');
    console.log('📊 Archetype distribution:', archetypeDistribution);
    console.log('💰 Capital distribution:', capitalDistribution);
    
    return {
      success: true,
      tradersSeeded: traders.length,
      strategiesSeeded: traders.length,
      psychologiesSeeded: traders.length,
      message: `Successfully seeded ${traders.length} NPC traders with strategies and psychology profiles.`,
      archetypeDistribution,
      capitalDistribution,
    };
    
  } catch (error) {
    console.error('❌ Error seeding NPC traders:', error);
    throw error;
  }
}

/**
 * Get summary statistics of generated traders (for testing/validation)
 */
export function getTradersSummary(traders: CompleteNPCTrader[]): {
  totalTraders: number;
  archetypeDistribution: Record<string, number>;
  capitalDistribution: Record<string, { count: number; totalCapital: number; avgCapital: number }>;
  skillDistribution: Record<number, number>;
} {
  const archetypeDistribution: Record<string, number> = {};
  const capitalTiers: Record<string, { count: number; totalCapital: number }> = {
    'Whale': { count: 0, totalCapital: 0 },
    'Large': { count: 0, totalCapital: 0 },
    'Medium': { count: 0, totalCapital: 0 },
    'Small': { count: 0, totalCapital: 0 },
    'Micro': { count: 0, totalCapital: 0 },
  };
  const skillDistribution: Record<number, number> = {};
  
  for (const { trader } of traders) {
    // Archetype distribution
    archetypeDistribution[trader.personalityArchetype] = 
      (archetypeDistribution[trader.personalityArchetype] || 0) + 1;
    
    // Capital distribution
    const capital = parseFloat(trader.startingCapital);
    let tier: string;
    if (capital >= 50_000_000) tier = 'Whale';
    else if (capital >= 10_000_000) tier = 'Large';
    else if (capital >= 1_000_000) tier = 'Medium';
    else if (capital >= 100_000) tier = 'Small';
    else tier = 'Micro';
    
    capitalTiers[tier].count++;
    capitalTiers[tier].totalCapital += capital;
    
    // Skill distribution
    skillDistribution[trader.skillLevel] = (skillDistribution[trader.skillLevel] || 0) + 1;
  }
  
  // Calculate averages
  const capitalDistribution: Record<string, { count: number; totalCapital: number; avgCapital: number }> = {};
  for (const [tier, data] of Object.entries(capitalTiers)) {
    capitalDistribution[tier] = {
      count: data.count,
      totalCapital: data.totalCapital,
      avgCapital: data.count > 0 ? data.totalCapital / data.count : 0,
    };
  }
  
  return {
    totalTraders: traders.length,
    archetypeDistribution,
    capitalDistribution,
    skillDistribution,
  };
}
