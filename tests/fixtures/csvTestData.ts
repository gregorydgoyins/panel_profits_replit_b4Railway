import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

/**
 * Test Data Fixtures for Phase 2 CSV Ingestion Testing
 * Provides representative sample data for comprehensive testing
 */

export interface TestCharacterData {
  Character?: string;
  'Real Name'?: string;
  Affiliation?: string;
  Powers?: string;
  Role?: string;
  'Power Level'?: string;
  Name?: string;
  Universe?: string;
  Identity?: string;
  Gender?: string;
  Teams?: string;
}

export interface TestComicData {
  title?: string;
  series?: string;
  issue?: string;
  publisher?: string;
  year?: string;
  creators?: string;
}

export interface TestMovieData {
  movie?: string;
  boxOffice?: string;
  rating?: string;
  year?: string;
  characters?: string;
}

/**
 * Sample test data for various scenarios
 */
export const SAMPLE_CHARACTER_DATA: TestCharacterData[] = [
  // Heroes House - Should trigger heroic trading patterns
  {
    Character: 'test_spider-man',
    'Real Name': 'Peter Parker',
    Affiliation: 'Avengers',
    Powers: 'Spider sense, Wall crawling, Web shooting',
    Role: 'Hero',
    'Power Level': 'Medium'
  },
  {
    Character: 'test_superman',
    'Real Name': 'Clark Kent', 
    Affiliation: 'Justice League',
    Powers: 'Flight, Super strength, Heat vision',
    Role: 'Hero',
    'Power Level': 'High'
  },
  {
    Character: 'test_captain-america',
    'Real Name': 'Steve Rogers',
    Affiliation: 'Avengers',
    Powers: 'Enhanced strength, Shield mastery',
    Role: 'Hero', 
    'Power Level': 'Medium'
  },
  
  // Power House - Should trigger high volatility
  {
    Character: 'test_hulk',
    'Real Name': 'Bruce Banner',
    Affiliation: 'Avengers',
    Powers: 'Gamma radiation, Superhuman strength',
    Role: 'Hero',
    'Power Level': 'Extreme'
  },
  {
    Character: 'test_thor',
    'Real Name': 'Thor Odinson',
    Affiliation: 'Avengers',
    Powers: 'God powers, Weather manipulation, Mjolnir',
    Role: 'Hero',
    'Power Level': 'Cosmic'
  },
  {
    Character: 'test_phoenix',
    'Real Name': 'Jean Grey',
    Affiliation: 'X-Men',
    Powers: 'Telepathy, Cosmic force, Phoenix Force',
    Role: 'Hero',
    'Power Level': 'Omega'
  },
  
  // Wisdom House - Should trigger stable patterns
  {
    Character: 'test_doctor-strange',
    'Real Name': 'Stephen Strange',
    Affiliation: 'Avengers',
    Powers: 'Sorcery, Magic, Time manipulation',
    Role: 'Hero',
    'Power Level': 'High'
  },
  {
    Character: 'test_professor-x',
    'Real Name': 'Charles Xavier',
    Affiliation: 'X-Men',
    Powers: 'Telepathy, Mind control',
    Role: 'Hero',
    'Power Level': 'High'
  },
  
  // Mystery House - Should trigger chaotic patterns
  {
    Character: 'test_batman',
    'Real Name': 'Bruce Wayne',
    Affiliation: 'Justice League',
    Powers: 'Detective skills, Technology, Martial arts',
    Role: 'Hero',
    'Power Level': 'Human'
  },
  {
    Character: 'test_constantine',
    'Real Name': 'John Constantine',
    Affiliation: 'Hellblazer',
    Powers: 'Occult knowledge, Magic',
    Role: 'Antihero',
    'Power Level': 'Medium'
  },
  
  // Elements House - Should trigger elemental patterns
  {
    Character: 'test_storm',
    'Real Name': 'Ororo Munroe',
    Affiliation: 'X-Men',
    Powers: 'Weather control, Flight',
    Role: 'Hero',
    'Power Level': 'High'
  },
  {
    Character: 'test_aquaman',
    'Real Name': 'Arthur Curry',
    Affiliation: 'Justice League',
    Powers: 'Underwater breathing, Marine telepathy',
    Role: 'Hero',
    'Power Level': 'High'
  },
  
  // Time House - Should trigger temporal patterns
  {
    Character: 'test_flash',
    'Real Name': 'Barry Allen',
    Affiliation: 'Justice League',
    Powers: 'Super speed, Time travel',
    Role: 'Hero',
    'Power Level': 'High'
  },
  {
    Character: 'test_cable',
    'Real Name': 'Nathan Summers',
    Affiliation: 'X-Force',
    Powers: 'Time travel, Telepathy, Future knowledge',
    Role: 'Hero',
    'Power Level': 'High'
  },
  
  // Spirit House - Should trigger mystical patterns
  {
    Character: 'test_ghost-rider',
    'Real Name': 'Johnny Blaze',
    Affiliation: 'Supernatural',
    Powers: 'Supernatural fire, Penance stare',
    Role: 'Antihero',
    'Power Level': 'High'
  },
  {
    Character: 'test_deadman',
    'Real Name': 'Boston Brand',
    Affiliation: 'Justice League Dark',
    Powers: 'Ghost form, Possession',
    Role: 'Hero',
    'Power Level': 'Medium'
  },
  
  // Villains for testing cross-house interactions
  {
    Character: 'test_joker',
    'Real Name': 'Unknown',
    Affiliation: 'Legion of Doom',
    Powers: 'Chaos, Insanity toxins',
    Role: 'Villain',
    'Power Level': 'Human'
  },
  {
    Character: 'test_magneto',
    'Real Name': 'Erik Lehnsherr',
    Affiliation: 'Brotherhood',
    Powers: 'Magnetic manipulation',
    Role: 'Villain',
    'Power Level': 'Omega'
  },
  {
    Character: 'test_galactus',
    'Real Name': 'Galan',
    Affiliation: 'Cosmic Entities',
    Powers: 'Cosmic power, Planet consumption',
    Role: 'Villain',
    'Power Level': 'Cosmic'
  }
];

export const SAMPLE_COMIC_DATA: TestComicData[] = [
  {
    title: 'Test Amazing Spider-Man',
    series: 'Amazing Spider-Man',
    issue: '1',
    publisher: 'Marvel',
    year: '2023',
    creators: 'Test Creator'
  },
  {
    title: 'Test Batman Detective Comics',
    series: 'Detective Comics',
    issue: '1000',
    publisher: 'DC',
    year: '2023',
    creators: 'Test Creator 2'
  },
  {
    title: 'Test X-Men',
    series: 'Uncanny X-Men',
    issue: '500',
    publisher: 'Marvel',
    year: '2023',
    creators: 'Test Creator 3'
  }
];

export const SAMPLE_MOVIE_DATA: TestMovieData[] = [
  {
    movie: 'Test Spider-Man Movie',
    boxOffice: '800000000',
    rating: '8.5',
    year: '2023',
    characters: 'Spider-Man,Green Goblin'
  },
  {
    movie: 'Test Avengers Movie',
    boxOffice: '2000000000',
    rating: '9.0',
    year: '2023',
    characters: 'Iron Man,Captain America,Thor,Hulk'
  },
  {
    movie: 'Test Batman Movie',
    boxOffice: '1000000000',
    rating: '8.8',
    year: '2023',
    characters: 'Batman,Joker'
  }
];

/**
 * Malformed data for error testing
 */
export const MALFORMED_CSV_DATA = {
  missingHeaders: [
    'test_character,test_power',
    'Spider-Man,Web shooting',
    'Batman' // Missing second column
  ].join('\n'),
  
  invalidData: [
    'Character,Power Level',
    'Test Hero,Invalid_Power_Level', // Invalid enum value
    'Test Hero 2,', // Missing required field
    '"Broken CSV,"With unescaped quotes"' // Malformed CSV
  ].join('\n'),
  
  largeFields: [
    'Character,Description',
    `Test Character,${'A'.repeat(10000)}` // Very large field
  ].join('\n'),
  
  unicodeIssues: [
    'Character,Name',
    'Test Héro,José María', // Unicode characters
    'Test 测试,中文名' // Chinese characters
  ].join('\n')
};

/**
 * Load test data from attached_assets directory
 */
export class CSVTestDataLoader {
  private static readonly ATTACHED_ASSETS_PATH = path.join(process.cwd(), 'attached_assets');
  
  /**
   * Load a CSV file from attached_assets for testing
   */
  static async loadCSVFile(filename: string): Promise<any[]> {
    const filePath = path.join(this.ATTACHED_ASSETS_PATH, filename);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test CSV file not found: ${filePath}`);
    }
    
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const parser = parse({
        columns: true,
        skip_empty_lines: true,
        trim: true
      });
      
      parser.on('data', (data) => results.push(data));
      parser.on('error', reject);
      parser.on('end', () => resolve(results));
      
      fs.createReadStream(filePath).pipe(parser);
    });
  }
  
  /**
   * Get list of all CSV files in attached_assets
   */
  static getAvailableCSVFiles(): string[] {
    if (!fs.existsSync(this.ATTACHED_ASSETS_PATH)) {
      return [];
    }
    
    return fs.readdirSync(this.ATTACHED_ASSETS_PATH)
      .filter(file => file.endsWith('.csv'))
      .sort();
  }
  
  /**
   * Create temporary test CSV file
   */
  static async createTempCSV(data: any[], headers: string[], filename: string): Promise<string> {
    const tempDir = path.join(process.cwd(), 'tests', 'temp');
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const filePath = path.join(tempDir, filename);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header] || '').join(','))
    ].join('\n');
    
    fs.writeFileSync(filePath, csvContent, 'utf8');
    return filePath;
  }
  
  /**
   * Cleanup temporary CSV files
   */
  static cleanupTempCSVs(): void {
    const tempDir = path.join(process.cwd(), 'tests', 'temp');
    if (fs.existsSync(tempDir)) {
      fs.readdirSync(tempDir).forEach(file => {
        fs.unlinkSync(path.join(tempDir, file));
      });
    }
  }
  
  /**
   * Generate large dataset for load testing
   */
  static async generateLargeDataset(baseData: any[], targetSize: number): Promise<any[]> {
    const result = [];
    const baseCount = baseData.length;
    
    for (let i = 0; i < targetSize; i++) {
      const baseItem = baseData[i % baseCount];
      result.push({
        ...baseItem,
        // Add variation to make each item unique
        Character: `${baseItem.Character}_${i}`,
        'Real Name': `${baseItem['Real Name']} ${i}`,
        // Keep other properties the same for consistent house assignment testing
      });
    }
    
    return result;
  }
}

/**
 * Performance testing utilities
 */
export class PerformanceTestUtils {
  /**
   * Memory usage tracking
   */
  static getMemoryUsage(): { used: number; total: number; percentage: number } {
    const usage = process.memoryUsage();
    const total = usage.heapTotal;
    const used = usage.heapUsed;
    
    return {
      used: Math.round(used / 1024 / 1024), // MB
      total: Math.round(total / 1024 / 1024), // MB
      percentage: Math.round((used / total) * 100)
    };
  }
  
  /**
   * Create memory pressure for stress testing
   */
  static createMemoryPressure(sizeMB: number = 100): void {
    // Create large array to simulate memory pressure
    const largeArray = new Array(sizeMB * 1024 * 1024 / 8).fill(0);
    setTimeout(() => {
      // Release memory after short delay
      largeArray.length = 0;
    }, 1000);
  }
  
  /**
   * Benchmark a function's performance
   */
  static async benchmark<T>(
    name: string,
    fn: () => Promise<T>,
    iterations: number = 1
  ): Promise<{ result: T; avgTime: number; minTime: number; maxTime: number; totalTime: number }> {
    const times: number[] = [];
    let result: T;
    
    for (let i = 0; i < iterations; i++) {
      const start = process.hrtime.bigint();
      result = await fn();
      const end = process.hrtime.bigint();
      times.push(Number(end - start) / 1000000); // Convert to milliseconds
    }
    
    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const avgTime = totalTime / iterations;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    console.log(`🏃 Benchmark ${name}: avg=${avgTime.toFixed(2)}ms, min=${minTime.toFixed(2)}ms, max=${maxTime.toFixed(2)}ms`);
    
    return { result: result!, avgTime, minTime, maxTime, totalTime };
  }
}