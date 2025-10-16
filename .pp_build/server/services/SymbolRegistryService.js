"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.symbolRegistry = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Symbol Registry Service
 * Implements the comprehensive ticker nomenclature system
 *
 * Format: CORE.TYPE.DETAILS (max 16 chars)
 *
 * Asset Type Codes:
 * - Comics: CORE.V{volume}.#{issue}[.{era}]
 * - Characters/Heroes: CORE
 * - Villains: CORE.V
 * - Sidekicks: CORE.SK
 * - Bonds: CORE.B{coupon%}{maturity}
 * - Options: CORE.O{expiry}{C/P}{strike}
 * - Funds: CORE.F{class}{focus}
 * - ETFs: CORE.E{class}{focus}
 * - Derivatives: CORE.D{instrument}{tenor}
 * - Crypto: CORE.X
 * - NFTs: CORE.N{collectionId}[.{tokenId}]
 * - Gadgets: CORE.G{owner}{slot}
 * - Locations: CORE.L{country}{city}
 * - Pets: CORE.P{owner}
 * - Creators: CORE.C{initials}{role}
 */
// Era codes for comics
const ERA_CODES = {
    'golden': 'G', // 1938-1955
    'silver': 'S', // 1956-1970
    'bronze': 'B', // 1971-1985
    'modern': 'M', // 1986-present
};
// Role codes for creators
const ROLE_CODES = {
    'writer': 'W',
    'artist': 'A',
    'penciller': 'P',
    'inker': 'I',
    'colorist': 'C',
    'letterer': 'L',
    'editor': 'E',
};
// Instrument codes for derivatives
const INSTRUMENT_CODES = {
    'future': 'F',
    'swap': 'S',
    'forward': 'FW',
    'warrant': 'W',
};
class SymbolRegistry {
    constructor() {
        /**
         * Curated core symbol mappings for major series/characters
         * These prevent collisions and ensure consistency
         */
        this.coreSymbols = new Map([
            // Spider-Man Universe
            ['amazing spider-man', 'ASM'],
            ['spectacular spider-man', 'SPEC'],
            ['ultimate spider-man', 'USM'],
            ['spider-man', 'SM'],
            ['spider-man (miles morales)', 'SMM'],
            ['spider-gwen', 'SGW'],
            ['venom', 'VNM'],
            // Batman Universe
            ['batman', 'BAT'],
            ['detective comics', 'DET'],
            ['batman and robin', 'BR'],
            ['dark knight', 'DK'],
            ['batgirl', 'BG'],
            ['nightwing', 'NW'],
            ['robin', 'ROB'],
            // Superman Universe
            ['superman', 'SUP'],
            ['action comics', 'ACT'],
            ['man of steel', 'MOS'],
            ['supergirl', 'SG'],
            ['superboy', 'SB'],
            // X-Men Universe
            ['uncanny x-men', 'UXM'],
            ['x-men', 'XM'],
            ['astonishing x-men', 'AXM'],
            ['new x-men', 'NXM'],
            ['x-force', 'XF'],
            ['wolverine', 'WLV'],
            ['deadpool', 'DP'],
            // Avengers Universe
            ['avengers', 'AVG'],
            ['new avengers', 'NAV'],
            ['mighty avengers', 'MAV'],
            ['iron man', 'IM'],
            ['captain america', 'CAP'],
            ['thor', 'THR'],
            ['hulk', 'HLK'],
            ['black widow', 'BW'],
            ['hawkeye', 'HE'],
            // Justice League
            ['justice league', 'JL'],
            ['wonder woman', 'WW'],
            ['flash', 'FLH'],
            ['green lantern', 'GL'],
            ['aquaman', 'AQM'],
            // Other Major Series
            ['fantastic four', 'FF'],
            ['daredevil', 'DD'],
            ['punisher', 'PUN'],
            ['spawn', 'SPN'],
            ['walking dead', 'TWD'],
            ['saga', 'SAG'],
            ['invincible', 'INV'],
        ]);
    }
    /**
     * Normalize a name for lookup
     */
    normalize(name) {
        return name.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, ' ');
    }
    /**
     * Get core symbol with curated mapping or generate deterministic one
     */
    getCoreSymbol(name, maxLength = 6) {
        const normalized = this.normalize(name);
        // Check curated mappings first
        if (this.coreSymbols.has(normalized)) {
            return this.coreSymbols.get(normalized);
        }
        // Extract variant if present
        const variantMatch = name.match(/\(([^)]+)\)/);
        const baseName = variantMatch ? name.replace(/\s*\([^)]+\)/, '').trim() : name;
        // Try base name in curated mappings
        const normalizedBase = this.normalize(baseName);
        if (this.coreSymbols.has(normalizedBase)) {
            const base = this.coreSymbols.get(normalizedBase);
            if (variantMatch) {
                const variantCode = this.abbreviate(variantMatch[1], 2);
                return `${base}${variantCode}`.slice(0, maxLength);
            }
            return base;
        }
        // Generate deterministic abbreviation
        return this.abbreviate(baseName, maxLength);
    }
    /**
     * Create abbreviation from name
     */
    abbreviate(name, maxLength) {
        // Remove special chars, keep alphanumeric
        const clean = name.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
        const words = clean.split(/\s+/).filter(w => w.length > 0);
        if (words.length === 0) {
            // Fallback to hash
            return this.hashToCode(name, maxLength);
        }
        if (words.length === 1) {
            return words[0].slice(0, maxLength);
        }
        // Try acronym
        const acronym = words.map(w => w[0]).join('');
        if (acronym.length >= 2 && acronym.length <= maxLength) {
            return acronym;
        }
        // Use first word + initials
        const firstWord = words[0].slice(0, Math.max(2, maxLength - (words.length - 1)));
        const initials = words.slice(1).map(w => w[0]).join('');
        return (firstWord + initials).slice(0, maxLength);
    }
    /**
     * Generate phonetic hash code for collision resolution
     */
    hashToCode(input, length) {
        const hash = crypto_1.default.createHash('sha256').update(input).digest('hex');
        // Convert to base36 (0-9, A-Z) and uppercase
        const code = parseInt(hash.slice(0, 8), 16).toString(36).toUpperCase();
        return code.slice(0, length);
    }
    /**
     * Generate comic symbol
     * Format: CORE.V{volume}.#{issue}[.{era}]
     * Example: ASM.V1.#300.S (Amazing Spider-Man Vol 1 #300, Silver Age)
     */
    generateComicSymbol(params) {
        // Accept either series or title
        const name = params.series || params.title || 'COMIC';
        const core = this.getCoreSymbol(name, 4);
        const vol = params.volume || 1;
        const issue = params.issue || 1;
        let symbol = `${core}.V${vol}.#${issue}`;
        // Add era code if available and space permits
        if (params.era && symbol.length <= 13) {
            symbol += `.${ERA_CODES[params.era]}`;
        }
        return symbol.slice(0, 16);
    }
    /**
     * Generate character/hero symbol
     * Format: CORE
     */
    generateCharacterSymbol(params) {
        return this.getCoreSymbol(params.name, 10);
    }
    /**
     * Generate villain symbol
     * Format: CORE.V
     */
    generateVillainSymbol(params) {
        const core = this.getCoreSymbol(params.name, 8);
        return `${core}.V`.slice(0, 16);
    }
    /**
     * Generate sidekick symbol
     * Format: CORE.SK
     */
    generateSidekickSymbol(params) {
        const core = this.getCoreSymbol(params.name, 7);
        return `${core}.SK`.slice(0, 16);
    }
    /**
     * Generate bond symbol
     * Format: CORE.B{coupon%}{maturity}
     * Example: OSCORP.B5.5.25 (Oscorp 5.5% coupon, 2025 maturity)
     */
    generateBondSymbol(params) {
        const core = this.getCoreSymbol(params.issuer, 5);
        // Format coupon preserving decimal precision, removing trailing zeros
        const couponStr = params.couponRate.toString();
        const coupon = couponStr.includes('.')
            ? couponStr.replace(/\.?0+$/, '') // Remove trailing zeros
            : couponStr;
        const maturity = params.maturityYear.toString().slice(-2);
        return `${core}.B${coupon}.${maturity}`.slice(0, 16);
    }
    /**
     * Generate option symbol
     * Format: CORE.O{expiry}{C/P}{strike}
     * Example: SM.O0117C50 (Spider-Man Jan 17 Call $50)
     */
    generateOptionSymbol(params) {
        const core = this.getCoreSymbol(params.underlying, 4);
        // Parse and validate expiry
        let expiryCode = '';
        if (params.expiryDate) {
            expiryCode = params.expiryDate;
        }
        else if (params.expiry) {
            // Parse ISO format (2025-01-17) to MMDD using UTC to avoid timezone issues
            const date = new Date(params.expiry + 'T00:00:00Z');
            if (isNaN(date.getTime())) {
                throw new Error(`Invalid expiry date: ${params.expiry}`);
            }
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');
            expiryCode = month + day;
        }
        else {
            throw new Error('Option expiry is required (provide expiryDate or expiry)');
        }
        // Validate strike price
        const strikeValue = params.strikePrice ?? params.strike;
        if (strikeValue === undefined || strikeValue <= 0) {
            throw new Error('Option strike price is required and must be > 0');
        }
        const callPut = params.type === 'call' ? 'C' : 'P';
        const strike = Math.floor(strikeValue);
        return `${core}.O${expiryCode}${callPut}${strike}`.slice(0, 16);
    }
    /**
     * Generate fund symbol
     * Format: CORE.F{class}{focus}
     * Example: HERO.FGM (Hero Fund, Growth, Marvel)
     */
    generateFundSymbol(params) {
        const core = this.getCoreSymbol(params.name, 6);
        const classCode = params.fundClass?.charAt(0).toUpperCase() || 'B';
        const focusCode = params.focus?.charAt(0).toUpperCase() || '';
        return `${core}.F${classCode}${focusCode}`.slice(0, 16);
    }
    /**
     * Generate ETF symbol
     * Format: CORE.E{class}{focus}
     */
    generateETFSymbol(params) {
        const core = this.getCoreSymbol(params.name, 6);
        const classCode = params.etfClass?.charAt(0).toUpperCase() || 'B';
        const focusCode = params.focus?.charAt(0).toUpperCase() || '';
        return `${core}.E${classCode}${focusCode}`.slice(0, 16);
    }
    /**
     * Generate derivative symbol
     * Format: CORE.D{instrument}{tenor}
     * Example: SM.DF3M (Spider-Man Future, 3 months)
     */
    generateDerivativeSymbol(params) {
        const core = this.getCoreSymbol(params.underlying, 4);
        const instCode = INSTRUMENT_CODES[params.instrument];
        return `${core}.D${instCode}${params.tenor}`.slice(0, 16);
    }
    /**
     * Generate crypto symbol
     * Format: CORE.X
     */
    generateCryptoSymbol(params) {
        const core = this.getCoreSymbol(params.name, 8);
        return `${core}.X`.slice(0, 16);
    }
    /**
     * Generate NFT symbol
     * Format: CORE.N{collectionId}[.{tokenId}]
     * Example: BAYC.N1.5000 (Bored Ape #5000)
     */
    generateNFTSymbol(params) {
        const core = this.getCoreSymbol(params.collection, 4);
        const collId = params.collectionId || '1';
        let symbol = `${core}.N${collId}`;
        if (params.tokenId && symbol.length <= 10) {
            symbol += `.${params.tokenId}`;
        }
        return symbol.slice(0, 16);
    }
    /**
     * Generate gadget symbol
     * Format: CORE.G{owner}{slot}
     * Example: BAT.GB1 (Batmobile - Batman, slot 1)
     */
    generateGadgetSymbol(params) {
        const gadget = this.abbreviate(params.name, 4);
        const owner = this.getCoreSymbol(params.owner, 3);
        const slotNum = params.slot || 1;
        return `${gadget}.G${owner}${slotNum}`.slice(0, 16);
    }
    /**
     * Generate location symbol
     * Format: CORE.L{country}{city}
     * Example: GOTH.LUSNY (Gotham City, USA, New York) or METR.LUS (Metropolis, USA)
     */
    generateLocationSymbol(params) {
        const core = this.getCoreSymbol(params.name, 4);
        const countryCode = params.country ? this.abbreviate(params.country, 2) : 'US';
        const cityCode = params.city ? this.abbreviate(params.city, 2) : '';
        return `${core}.L${countryCode}${cityCode}`.slice(0, 16);
    }
    /**
     * Generate pet/sidekick animal symbol
     * Format: CORE.P{owner}
     * Example: KRYPTO.PSUP (Krypto - Superman's dog)
     */
    generatePetSymbol(params) {
        const core = this.getCoreSymbol(params.name, 6);
        const ownerCode = this.getCoreSymbol(params.owner, 3);
        return `${core}.P${ownerCode}`.slice(0, 16);
    }
    /**
     * Generate creator symbol
     * Format: CORE.C{initials}{role}
     * Example: LEE.CSW (Stan Lee - Creator, Writer)
     */
    generateCreatorSymbol(params) {
        // Parse name to get initials
        const nameParts = params.name.split(' ').filter(p => p.length > 0);
        const lastName = nameParts[nameParts.length - 1].toUpperCase();
        const initials = nameParts.slice(0, -1).map(p => p[0]).join('').toUpperCase();
        const core = lastName.slice(0, 4);
        const roleCode = params.role ? ROLE_CODES[params.role] : 'C';
        return `${core}.C${initials}${roleCode}`.slice(0, 16);
    }
    /**
     * Main entry point with collision detection
     */
    async generateSymbol(type, params, checkExists) {
        let symbol;
        switch (type.toLowerCase()) {
            case 'comic':
                symbol = this.generateComicSymbol(params);
                break;
            case 'character':
            case 'hero':
                symbol = this.generateCharacterSymbol(params);
                break;
            case 'villain':
                symbol = this.generateVillainSymbol(params);
                break;
            case 'sidekick':
                symbol = this.generateSidekickSymbol(params);
                break;
            case 'bond':
                symbol = this.generateBondSymbol(params);
                break;
            case 'option':
                symbol = this.generateOptionSymbol(params);
                break;
            case 'fund':
                symbol = this.generateFundSymbol(params);
                break;
            case 'etf':
                symbol = this.generateETFSymbol(params);
                break;
            case 'derivative':
                symbol = this.generateDerivativeSymbol(params);
                break;
            case 'crypto':
                symbol = this.generateCryptoSymbol(params);
                break;
            case 'nft':
                symbol = this.generateNFTSymbol(params);
                break;
            case 'gadget':
                symbol = this.generateGadgetSymbol(params);
                break;
            case 'location':
                symbol = this.generateLocationSymbol(params);
                break;
            case 'pet':
                symbol = this.generatePetSymbol(params);
                break;
            case 'creator':
                symbol = this.generateCreatorSymbol(params);
                break;
            default:
                // Fallback
                symbol = this.getCoreSymbol(params.name || 'UNKNOWN', 10);
        }
        // Collision prevention
        let finalSymbol = symbol;
        let counter = 1;
        while (await checkExists(finalSymbol)) {
            // Append numeric suffix
            const suffix = counter.toString();
            const maxCore = 16 - suffix.length - 1; // -1 for dot
            finalSymbol = `${symbol.slice(0, maxCore)}.${suffix}`;
            counter++;
            if (counter > 999) {
                throw new Error(`Unable to generate unique symbol for ${type}: ${params.name}`);
            }
        }
        return finalSymbol;
    }
}
exports.symbolRegistry = new SymbolRegistry();
