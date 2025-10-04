/**
 * Ticker Symbol Formatter Utility
 * Formats asset symbols for ticker display in proper nomenclature format
 * 
 * Format: SERIES.VOLUME.ISSUE (e.g., ASM.V1.15 for Amazing Spider-Man Vol 1 Issue #15)
 */

/**
 * Series abbreviation mapping for standardized ticker codes
 */
const SERIES_ABBREVIATIONS: Record<string, string> = {
  // Spider-Man
  'amazing spider-man': 'ASM',
  'amazing spiderman': 'ASM',
  'spectacular spider-man': 'SPEC',
  'ultimate spider-man': 'USM',
  'spider-man': 'SPDR',
  'spiderman': 'SPDR',
  
  // Batman
  'batman': 'BATM',
  'detective comics': 'DETC',
  'batman detective comics': 'DETC',
  'batman and robin': 'BATR',
  'dark knight': 'DKKN',
  
  // Superman
  'superman': 'SUPM',
  'action comics': 'ACTC',
  'superman action comics': 'ACTC',
  'man of steel': 'MOST',
  
  // X-Men
  'uncanny x-men': 'UXM',
  'x-men': 'XMEN',
  'astonishing x-men': 'AXM',
  'new x-men': 'NXM',
  
  // Avengers
  'avengers': 'AVNG',
  'new avengers': 'NAVG',
  'mighty avengers': 'MAVG',
  
  // Justice League
  'justice league': 'JLA',
  'justice league of america': 'JLA',
  
  // Wonder Woman
  'wonder woman': 'WW',
  'sensation comics': 'SENS',
  
  // Other Major Series
  'fantastic four': 'FF',
  'hulk': 'HULK',
  'incredible hulk': 'IHULK',
  'iron man': 'IRON',
  'captain america': 'CAP',
  'thor': 'THOR',
  'flash': 'FLSH',
  'green lantern': 'GL',
  'aquaman': 'AQUA',
  'daredevil': 'DD',
  'punisher': 'PNSH',
  'wolverine': 'WOLV',
  'deadpool': 'DPOOL',
  'spawn': 'SPWN',
  'walking dead': 'TWD',
  'saga': 'SAGA',
  'invincible': 'INVC',
};

/**
 * Parse comic name to extract series, volume, and issue
 */
function parseComicName(name: string): { series: string; volume?: string; issue?: string } {
  // Patterns:
  // "Amazing Spider-Man Vol 1 #15"
  // "Wonder Woman (Volume 2) #53"
  // "Batman #404"
  // "Detective Comics Vol. 1 Issue 27"
  
  // Extract volume - match "Vol 1", "Vol. 1", "Volume 1", "(Volume 2)", "V1", etc.
  const volMatch = name.match(/\(?\s*(?:vol(?:ume)?\.?|v)\s*(\d+)\)?/i);
  const volume = volMatch ? volMatch[1] : undefined;
  
  // Extract issue - match "#15", "Issue 15", etc.
  const issueMatch = name.match(/#(\d+)|issue\s+(\d+)/i);
  const issue = issueMatch ? (issueMatch[1] || issueMatch[2]) : undefined;
  
  // Get series name by removing extracted parts
  let series = name
    .replace(/\(?\s*(?:vol(?:ume)?\.?|v)\s*\d+\)?/gi, '')
    .replace(/#\d+/g, '')
    .replace(/issue\s+\d+/gi, '')
    .replace(/\(\d{4}\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return { series, volume, issue };
}

/**
 * Get standardized ticker code for a series name
 */
function getSeriesTicker(seriesName: string): string | null {
  if (!seriesName || !seriesName.trim()) {
    return null;
  }
  
  const normalized = seriesName.toLowerCase().trim();
  
  // Direct match
  if (SERIES_ABBREVIATIONS[normalized]) {
    return SERIES_ABBREVIATIONS[normalized];
  }
  
  // Fuzzy matching for variations
  for (const [key, ticker] of Object.entries(SERIES_ABBREVIATIONS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return ticker;
    }
  }
  
  return null;
}

/**
 * Clean and abbreviate a name for symbol use
 */
function cleanAndAbbreviate(name: string, maxLength: number = 6): string {
  // Replace hyphens, slashes, punctuation with spaces
  const spacedName = name.replace(/[-\/\.]/g, ' ');
  
  // Remove special characters, keep alphanumeric and spaces
  const cleaned = spacedName.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
  
  // Split into words
  const words = cleaned.split(/\s+/).filter(w => w.length > 0);
  
  if (words.length === 0) {
    return name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, maxLength) || 'ASSET';
  }
  
  // Single word: truncate
  if (words.length === 1) {
    return words[0].slice(0, maxLength);
  }
  
  // Multi-word: create acronym
  const acronym = words.map(w => w[0]).join('');
  if (acronym.length <= maxLength && acronym.length >= 3) {
    return acronym;
  }
  
  // First word + first letters of others
  const firstWord = words[0].slice(0, Math.min(4, maxLength - (words.length - 1)));
  const otherLetters = words.slice(1).map(w => w[0]).join('');
  return (firstWord + otherLetters).slice(0, maxLength);
}

/**
 * Check if symbol is already in proper format
 * Proper format: SERIES.V#.# or SERIES.V#.#ISSUE (e.g., ASM.V1.15 or ASM.V1.#15)
 */
function isProperTickerFormat(symbol: string): boolean {
  // Match: LETTERS.V#.# or LETTERS.V#.#NUMBER
  return /^[A-Z]{2,}\.V\d+\.\#?\d+/.test(symbol);
}

/**
 * Format asset symbol for ticker display
 * Converts any symbol/name combination into proper ticker nomenclature
 */
export function formatTickerSymbol(symbol: string, name: string): string {
  // If symbol is already in proper format, use it
  if (isProperTickerFormat(symbol)) {
    return symbol;
  }
  
  // Parse the name to extract series/volume/issue
  const parsed = parseComicName(name);
  
  // Get standardized ticker from mapping
  const standardTicker = getSeriesTicker(parsed.series);
  const seriesAbbrev = standardTicker || cleanAndAbbreviate(parsed.series, 6);
  
  // Build ticker symbol: SERIES.V#.ISSUE
  if (parsed.volume && parsed.issue) {
    return `${seriesAbbrev}.V${parsed.volume}.${parsed.issue}`;
  }
  
  // Default to V1 if only issue available
  if (parsed.issue) {
    return `${seriesAbbrev}.V1.${parsed.issue}`;
  }
  
  // Fallback: use existing symbol if it looks reasonable
  if (symbol && symbol.length <= 15 && /^[A-Z0-9\.]+$/.test(symbol)) {
    return symbol;
  }
  
  // Last resort: abbreviate the name
  return cleanAndAbbreviate(name, 10);
}
