import crypto from 'crypto';

interface MarvelComic {
  id: number;
  title: string;
  description: string;
  modified: string;
  isbn: string;
  upc: string;
  diamondCode: string;
  ean: string;
  issn: string;
  format: string;
  pageCount: number;
  textObjects: Array<{
    type: string;
    language: string;
    text: string;
  }>;
  resourceURI: string;
  urls: Array<{
    type: string;
    url: string;
  }>;
  series: {
    resourceURI: string;
    name: string;
  };
  variants: Array<{
    resourceURI: string;
    name: string;
  }>;
  collections: Array<{
    resourceURI: string;
    name: string;
  }>;
  collectedIssues: Array<{
    resourceURI: string;
    name: string;
  }>;
  dates: Array<{
    type: string;
    date: string;
  }>;
  prices: Array<{
    type: string;
    price: number;
  }>;
  thumbnail: {
    path: string;
    extension: string;
  };
  images: Array<{
    path: string;
    extension: string;
  }>;
  creators: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
      role: string;
    }>;
    returned: number;
  };
  characters: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
    returned: number;
  };
}

interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  resourceURI: string;
  comics: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
    returned: number;
  };
  series: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
    returned: number;
  };
  stories: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
      type: string;
    }>;
    returned: number;
  };
  events: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
    returned: number;
  };
  urls: Array<{
    type: string;
    url: string;
  }>;
}

interface SuperHero {
  response: string;
  id: string;
  name: string;
  powerstats: {
    intelligence: string;
    strength: string;
    speed: string;
    durability: string;
    power: string;
    combat: string;
  };
  biography: {
    'full-name': string;
    'alter-egos': string;
    aliases: string[];
    'place-of-birth': string;
    'first-appearance': string;
    publisher: string;
    alignment: string;
  };
  appearance: {
    gender: string;
    race: string;
    height: string[];
    weight: string[];
    'eye-color': string;
    'hair-color': string;
  };
  work: {
    occupation: string;
    base: string;
  };
  connections: {
    'group-affiliation': string;
    relatives: string;
  };
  image: {
    url: string;
  };
}

interface ComicVineVolume {
  aliases: string;
  api_detail_url: string;
  count_of_issues: number;
  date_added: string;
  date_last_updated: string;
  deck: string;
  description: string;
  first_issue: {
    api_detail_url: string;
    id: number;
    name: string;
    issue_number: string;
  };
  id: number;
  image: {
    icon_url: string;
    medium_url: string;
    screen_url: string;
    screen_large_url: string;
    small_url: string;
    super_url: string;
    thumb_url: string;
    tiny_url: string;
    original_url: string;
    image_tags: string;
  };
  last_issue: {
    api_detail_url: string;
    id: number;
    name: string;
    issue_number: string;
  };
  name: string;
  publisher: {
    api_detail_url: string;
    id: number;
    name: string;
  };
  site_detail_url: string;
  start_year: string;
}

class ComicDataService {
  private marvelBaseUrl = 'https://gateway.marvel.com/v1/public';
  private superHeroBaseUrl = 'https://superheroapi.com/api';
  private comicVineBaseUrl = 'https://comicvine.gamespot.com/api';
  
  private marvelPublicKey = process.env.MARVEL_API_PUBLIC_KEY;
  private marvelPrivateKey = process.env.MARVEL_API_PRIVATE_KEY;
  private superHeroToken = process.env.SUPERHERO_API_TOKEN;
  private comicVineApiKey = process.env.COMIC_VINE_API_KEY;

  private generateMarvelAuth() {
    const timestamp = Date.now().toString();
    const hash = crypto
      .createHash('md5')
      .update(timestamp + this.marvelPrivateKey + this.marvelPublicKey)
      .digest('hex');
    
    return {
      ts: timestamp,
      apikey: this.marvelPublicKey,
      hash: hash
    };
  }

  async fetchMarvelCharacters(limit = 100, offset = 0): Promise<MarvelCharacter[]> {
    try {
      const auth = this.generateMarvelAuth();
      const url = `${this.marvelBaseUrl}/characters?limit=${limit}&offset=${offset}&ts=${auth.ts}&apikey=${auth.apikey}&hash=${auth.hash}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code === 200) {
        return data.data.results;
      } else {
        console.error('Marvel API error:', data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching Marvel characters:', error);
      return [];
    }
  }

  async fetchMarvelComics(limit = 100, offset = 0): Promise<MarvelComic[]> {
    try {
      const auth = this.generateMarvelAuth();
      const url = `${this.marvelBaseUrl}/comics?limit=${limit}&offset=${offset}&format=comic&formatType=comic&noVariants=true&ts=${auth.ts}&apikey=${auth.apikey}&hash=${auth.hash}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code === 200) {
        return data.data.results;
      } else {
        console.error('Marvel API error:', data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching Marvel comics:', error);
      return [];
    }
  }

  async fetchSuperHero(characterName: string): Promise<SuperHero | null> {
    try {
      const url = `${this.superHeroBaseUrl}/${this.superHeroToken}/search/${encodeURIComponent(characterName)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.response === 'success' && data.results && data.results.length > 0) {
        return data.results[0];
      } else {
        console.log(`No SuperHero data found for: ${characterName}`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching SuperHero data:', error);
      return null;
    }
  }

  async fetchComicVineVolumes(limit = 100, offset = 0): Promise<ComicVineVolume[]> {
    try {
      const url = `${this.comicVineBaseUrl}/volumes/?api_key=${this.comicVineApiKey}&format=json&limit=${limit}&offset=${offset}&field_list=id,name,start_year,publisher,count_of_issues,image,description,deck`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error === 'OK') {
        return data.results;
      } else {
        console.error('Comic Vine API error:', data.error);
        return [];
      }
    } catch (error) {
      console.error('Error fetching Comic Vine volumes:', error);
      return [];
    }
  }

  async searchComicVineCharacter(characterName: string): Promise<any> {
    try {
      const url = `${this.comicVineBaseUrl}/search/?api_key=${this.comicVineApiKey}&format=json&query=${encodeURIComponent(characterName)}&resources=character&limit=10`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error === 'OK' && data.results && data.results.length > 0) {
        return data.results[0];
      } else {
        console.log(`No Comic Vine character found for: ${characterName}`);
        return null;
      }
    } catch (error) {
      console.error('Error searching Comic Vine character:', error);
      return null;
    }
  }

  // Transform APIs data into our trading asset format
  async generateTradingAssets(): Promise<any[]> {
    const assets: any[] = [];

    try {
      // Fetch Marvel characters
      console.log('Fetching Marvel characters...');
      const marvelCharacters = await this.fetchMarvelCharacters(50, 0);
      
      for (const character of marvelCharacters.slice(0, 20)) { // Limit to prevent rate limiting
        try {
          // Get additional data from SuperHero API
          const superHeroData = await this.fetchSuperHero(character.name);
          
          // Generate trading asset
          const asset = {
            symbol: this.generateSymbol(character.name),
            name: character.name,
            category: 'character',
            description: character.description || `${character.name} - Marvel superhero with incredible abilities`,
            price: this.generatePrice(character, superHeroData),
            change: (Math.random() - 0.5) * 10, // Random price change
            changePercent: (Math.random() - 0.5) * 5, // Random percentage change
            volume: Math.floor(Math.random() * 100000) + 10000,
            marketCap: this.calculateMarketCap(character, superHeroData),
            significance: this.calculateSignificance(character, superHeroData),
            image: this.getImageUrl(character.thumbnail),
            metadata: {
              marvelId: character.id,
              modified: character.modified,
              comicsAppeared: character.comics.available,
              seriesAppeared: character.series.available,
              powerStats: superHeroData?.powerstats || null,
              publisher: superHeroData?.biography?.publisher || 'Marvel Comics',
              firstAppearance: superHeroData?.biography?.['first-appearance'] || 'Unknown',
              alignment: superHeroData?.biography?.alignment || 'Unknown'
            }
          };

          assets.push(asset);
          
          // Small delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error processing character ${character.name}:`, error);
        }
      }

      // Fetch Marvel comics for creator/publisher assets
      console.log('Fetching Marvel comics...');
      const marvelComics = await this.fetchMarvelComics(30, 0);
      
      const creators = new Set<string>();
      const publishers = new Set<string>();
      
      for (const comic of marvelComics.slice(0, 15)) {
        try {
          // Extract creators
          comic.creators.items.forEach(creator => {
            if (creators.size < 10 && creator.name && creator.name !== 'Various') {
              creators.add(creator.name);
            }
          });

          // Marvel as publisher
          publishers.add('Marvel Comics');
          
          // Small delay
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error) {
          console.error(`Error processing comic ${comic.title}:`, error);
        }
      }

      // Add creator assets
      for (const creatorName of Array.from(creators)) {
        const asset = {
          symbol: this.generateSymbol(creatorName, 'CR'),
          name: creatorName,
          category: 'creator',
          description: `${creatorName} - Comic book creator and artist`,
          price: Math.floor(Math.random() * 2000) + 500,
          change: (Math.random() - 0.5) * 8,
          changePercent: (Math.random() - 0.5) * 4,
          volume: Math.floor(Math.random() * 50000) + 5000,
          marketCap: Math.floor(Math.random() * 10000000) + 1000000,
          significance: Math.floor(Math.random() * 40) + 60,
          image: null,
          metadata: {
            type: 'creator',
            publisher: 'Marvel Comics'
          }
        };
        assets.push(asset);
      }

      // Add publisher assets
      for (const publisherName of Array.from(publishers)) {
        const asset = {
          symbol: this.generateSymbol(publisherName, 'PUB'),
          name: publisherName,
          category: 'publisher',
          description: `${publisherName} - Major comic book publisher`,
          price: Math.floor(Math.random() * 5000) + 2000,
          change: (Math.random() - 0.5) * 6,
          changePercent: (Math.random() - 0.5) * 3,
          volume: Math.floor(Math.random() * 200000) + 50000,
          marketCap: Math.floor(Math.random() * 50000000) + 10000000,
          significance: Math.floor(Math.random() * 20) + 80,
          image: null,
          metadata: {
            type: 'publisher'
          }
        };
        assets.push(asset);
      }

      console.log(`Generated ${assets.length} trading assets from real comic data`);
      return assets;

    } catch (error) {
      console.error('Error generating trading assets:', error);
      return [];
    }
  }

  private generateSymbol(name: string, prefix?: string): string {
    // Generate trading symbol from name
    const cleanName = name.replace(/[^a-zA-Z\s]/g, '').trim();
    const words = cleanName.split(' ');
    
    let symbol = '';
    if (words.length === 1) {
      symbol = words[0].substring(0, 4).toUpperCase();
    } else if (words.length === 2) {
      symbol = (words[0].substring(0, 2) + words[1].substring(0, 2)).toUpperCase();
    } else {
      symbol = words.map(word => word.charAt(0)).join('').substring(0, 4).toUpperCase();
    }
    
    return prefix ? `${symbol}-${prefix}` : symbol;
  }

  private generatePrice(marvelChar: MarvelCharacter, superHero?: SuperHero | null): number {
    // Base price calculation based on character popularity/data
    let basePrice = 1000;
    
    // Factor in comics appeared
    if (marvelChar.comics.available > 100) basePrice += 1500;
    else if (marvelChar.comics.available > 50) basePrice += 1000;
    else if (marvelChar.comics.available > 20) basePrice += 500;
    
    // Factor in series appeared
    if (marvelChar.series.available > 10) basePrice += 800;
    else if (marvelChar.series.available > 5) basePrice += 400;
    
    // Factor in power stats if available
    if (superHero?.powerstats) {
      const avgPower = Object.values(superHero.powerstats)
        .map(stat => parseInt(stat) || 0)
        .reduce((sum, stat) => sum + stat, 0) / 6;
      basePrice += avgPower * 20;
    }
    
    // Add randomness
    const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
    
    return Math.floor(basePrice * randomFactor);
  }

  private calculateMarketCap(marvelChar: MarvelCharacter, superHero?: SuperHero | null): number {
    const basePrice = this.generatePrice(marvelChar, superHero);
    const multiplier = 500 + Math.floor(Math.random() * 2000); // 500-2500x
    return basePrice * multiplier;
  }

  private calculateSignificance(marvelChar: MarvelCharacter, superHero?: SuperHero | null): number {
    let significance = 50; // Base significance
    
    // Comics appeared factor
    significance += Math.min(marvelChar.comics.available / 2, 25);
    
    // Series appeared factor
    significance += Math.min(marvelChar.series.available * 2, 15);
    
    // Power level factor
    if (superHero?.powerstats) {
      const avgPower = Object.values(superHero.powerstats)
        .map(stat => parseInt(stat) || 0)
        .reduce((sum, stat) => sum + stat, 0) / 6;
      significance += avgPower / 10;
    }
    
    return Math.min(Math.max(significance, 0), 100);
  }

  private getImageUrl(thumbnail?: { path: string; extension: string }): string | null {
    if (!thumbnail || !thumbnail.path || !thumbnail.extension) {
      return null;
    }
    
    // Avoid placeholder images
    if (thumbnail.path.includes('image_not_available')) {
      return null;
    }
    
    return `${thumbnail.path}.${thumbnail.extension}`;
  }

  /**
   * Fetch random comic covers with metadata for widgets
   */
  async fetchRandomComicCovers(limit = 1): Promise<any[]> {
    try {
      const comics = await this.fetchMarvelComics(50, Math.floor(Math.random() * 500));
      
      // Filter comics with valid images and transform
      const validComics = comics
        .filter(comic => comic.thumbnail && !comic.thumbnail.path.includes('image_not_available'))
        .slice(0, limit)
        .map(comic => {
          // Calculate realistic pricing based on issue details
          const printPrice = comic.prices.find(p => p.type === 'printPrice')?.price || 3.99;
          const issueAge = comic.dates.find(d => d.type === 'onsaleDate')?.date;
          const yearsOld = issueAge ? new Date().getFullYear() - new Date(issueAge).getFullYear() : 0;
          
          // Pricing formula: older comics + key issues = higher value
          let estimatedValue = printPrice;
          if (yearsOld > 40) estimatedValue *= (20 + Math.random() * 80); // Golden/Silver Age
          else if (yearsOld > 20) estimatedValue *= (5 + Math.random() * 15); // Bronze Age
          else if (yearsOld > 10) estimatedValue *= (2 + Math.random() * 5); // Modern Age
          else estimatedValue *= (1 + Math.random() * 2); // Recent issues
          
          // Key issue multiplier (first appearances, #1s, etc.)
          const isFirstIssue = comic.title.includes('#1') || comic.issueNumber === 1;
          if (isFirstIssue) estimatedValue *= (2 + Math.random() * 3);
          
          const finalPrice = Math.floor(estimatedValue * 100) / 100;
          
          return {
            id: comic.id,
            title: comic.title,
            series: comic.series.name,
            issueNumber: comic.issueNumber || 1,
            coverUrl: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
            description: comic.description || comic.textObjects[0]?.text || `A legendary issue from ${comic.series.name}`,
            printPrice: printPrice,
            estimatedValue: finalPrice,
            onsaleDate: comic.dates.find(d => d.type === 'onsaleDate')?.date || null,
            creators: comic.creators.items.slice(0, 3).map(c => ({
              name: c.name,
              role: c.role
            })),
            pageCount: comic.pageCount,
            format: comic.format,
            upc: comic.upc,
            isbn: comic.isbn,
            // Historical context clues
            yearsOld,
            isFirstIssue,
            isKeyIssue: isFirstIssue || comic.variantDescription?.includes('1st appearance'),
          };
        });
      
      return validComics;
    } catch (error) {
      console.error('Error fetching random comic covers:', error);
      return [];
    }
  }

  /**
   * Fetch key issues - first appearances, #1s, significant events
   */
  async fetchKeyIssues(limit = 6): Promise<any[]> {
    try {
      // Fetch more comics to ensure we get enough key issues with covers
      const comics = await this.fetchRandomComicCovers(50);
      
      // Filter for key issues with valid cover images only
      const keyComics = comics.filter(c => 
        (c.isKeyIssue || c.isFirstIssue) && 
        c.coverUrl && 
        !c.coverUrl.includes('image_not_available')
      );
      
      return keyComics.slice(0, limit);
    } catch (error) {
      console.error('Error fetching key issues:', error);
      return [];
    }
  }

  /**
   * Get comic of the day with historical context
   */
  async getComicOfTheDay(): Promise<any | null> {
    try {
      const comics = await this.fetchRandomComicCovers(10);
      
      // Prefer key issues or older comics for "Comic of the Day"
      const keyComics = comics.filter(c => c.isKeyIssue || c.yearsOld > 20);
      const featured = keyComics.length > 0 ? keyComics[0] : comics[0];
      
      if (!featured) return null;
      
      // Add storytelling context
      const historicalContext = this.generateHistoricalContext(featured);
      
      return {
        ...featured,
        historicalContext,
        significance: featured.isFirstIssue ? 'First Issue' : featured.isKeyIssue ? 'Key Issue' : 'Classic Issue',
      };
    } catch (error) {
      console.error('Error fetching comic of the day:', error);
      return null;
    }
  }

  private generateHistoricalContext(comic: any): string {
    const contexts = [
      `When ${comic.series} debuted, comic book storytelling was forever changed. This issue represents a pivotal moment in ${comic.yearsOld > 40 ? 'Golden Age' : comic.yearsOld > 20 ? 'Bronze Age' : 'Modern'} comics.`,
      `This legendary ${comic.series} issue has become a cornerstone for collectors worldwide. Published ${comic.yearsOld} years ago, it defined an era.`,
      `${comic.creators[0]?.name || 'The creative team'}'s work on this issue set new standards for visual storytelling in comics.`,
      `A defining chapter in ${comic.series}, this issue captures the essence of what made the series a cultural phenomenon.`,
      `Collectors recognize this as a significant milestone in comic history—a must-have for serious investors.`,
    ];
    
    return contexts[Math.floor(Math.random() * contexts.length)];
  }

  /**
   * ==================================================
   * COMIC VINE API INTEGRATION
   * Fetches DC, Image, Dark Horse, IDW, manga, graphic novels
   * ==================================================
   */

  /**
   * Fetch publishers from Comic Vine (DC, Image, Dark Horse, etc.)
   */
  async fetchComicVinePublishers(limit = 20): Promise<any[]> {
    try {
      if (!this.comicVineApiKey) {
        console.warn('Comic Vine API key not configured');
        return [];
      }

      const url = `${this.comicVineBaseUrl}/publishers/?api_key=${this.comicVineApiKey}&format=json&limit=${limit}`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Panel Profits Trading Platform'
        }
      });

      if (!response.ok) {
        throw new Error(`Comic Vine API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error !== 'OK' || !data.results) {
        console.error('Comic Vine API returned error:', data.error);
        return [];
      }

      return data.results.map((publisher: any) => ({
        id: publisher.id,
        name: publisher.name,
        description: publisher.deck || publisher.description,
        imageUrl: publisher.image?.medium_url || publisher.image?.small_url,
        aliases: publisher.aliases,
        locationCity: publisher.location_city,
        locationState: publisher.location_state,
        metadata: {
          comicVineId: publisher.id,
          comicVineUrl: publisher.site_detail_url,
          apiUrl: publisher.api_detail_url,
        }
      }));
    } catch (error) {
      console.error('Error fetching Comic Vine publishers:', error);
      return [];
    }
  }

  /**
   * Fetch characters from Comic Vine (Batman, Joker, Spawn, etc.)
   */
  async fetchComicVineCharacters(publisherFilter?: string, limit = 50): Promise<any[]> {
    try {
      if (!this.comicVineApiKey) {
        console.warn('Comic Vine API key not configured');
        return [];
      }

      let url = `${this.comicVineBaseUrl}/characters/?api_key=${this.comicVineApiKey}&format=json&limit=${limit}`;
      
      if (publisherFilter) {
        url += `&filter=publisher:${publisherFilter}`;
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Panel Profits Trading Platform'
        }
      });

      if (!response.ok) {
        throw new Error(`Comic Vine API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error !== 'OK' || !data.results) {
        console.error('Comic Vine API returned error:', data.error);
        return [];
      }

      return data.results
        .filter((char: any) => char.image && !char.image.original_url?.includes('blank'))
        .map((character: any) => ({
          id: character.id,
          name: character.name,
          realName: character.real_name,
          description: character.deck || character.description,
          imageUrl: character.image?.medium_url || character.image?.small_url,
          firstAppearance: character.first_appeared_in_issue?.name,
          publisher: character.publisher?.name,
          origin: character.origin?.name,
          powers: character.powers?.map((p: any) => p.name) || [],
          aliases: character.aliases ? character.aliases.split('\n').filter(Boolean) : [],
          metadata: {
            comicVineId: character.id,
            gender: character.gender,
            countOfIssueAppearances: character.count_of_issue_appearances,
            comicVineUrl: character.site_detail_url,
          }
        }));
    } catch (error) {
      console.error('Error fetching Comic Vine characters:', error);
      return [];
    }
  }

  /**
   * Fetch comic series/volumes from Comic Vine
   */
  async fetchComicVineVolumes(publisherFilter?: string, limit = 50): Promise<any[]> {
    try {
      if (!this.comicVineApiKey) {
        console.warn('Comic Vine API key not configured');
        return [];
      }

      let url = `${this.comicVineBaseUrl}/volumes/?api_key=${this.comicVineApiKey}&format=json&limit=${limit}&sort=date_last_updated:desc`;
      
      if (publisherFilter) {
        url += `&filter=publisher:${publisherFilter}`;
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Panel Profits Trading Platform'
        }
      });

      if (!response.ok) {
        throw new Error(`Comic Vine API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error !== 'OK' || !data.results) {
        console.error('Comic Vine API returned error:', data.error);
        return [];
      }

      return data.results
        .filter((vol: any) => vol.image && !vol.image.original_url?.includes('blank'))
        .map((volume: any) => ({
          id: volume.id,
          name: volume.name,
          description: volume.deck || volume.description,
          imageUrl: volume.image?.medium_url || volume.image?.small_url,
          publisher: volume.publisher?.name,
          startYear: volume.start_year,
          issueCount: volume.count_of_issues,
          firstIssue: volume.first_issue,
          lastIssue: volume.last_issue,
          metadata: {
            comicVineId: volume.id,
            comicVineUrl: volume.site_detail_url,
            aliases: volume.aliases,
          }
        }));
    } catch (error) {
      console.error('Error fetching Comic Vine volumes:', error);
      return [];
    }
  }

  /**
   * Fetch specific comic issues from Comic Vine
   */
  async fetchComicVineIssues(volumeId?: number, limit = 50): Promise<any[]> {
    try {
      if (!this.comicVineApiKey) {
        console.warn('Comic Vine API key not configured');
        return [];
      }

      let url = `${this.comicVineBaseUrl}/issues/?api_key=${this.comicVineApiKey}&format=json&limit=${limit}&sort=date_last_updated:desc`;
      
      if (volumeId) {
        url += `&filter=volume:${volumeId}`;
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Panel Profits Trading Platform'
        }
      });

      if (!response.ok) {
        throw new Error(`Comic Vine API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error !== 'OK' || !data.results) {
        console.error('Comic Vine API returned error:', data.error);
        return [];
      }

      return data.results
        .filter((issue: any) => issue.image && !issue.image.original_url?.includes('blank'))
        .map((issue: any) => ({
          id: issue.id,
          name: issue.name || `Issue #${issue.issue_number}`,
          issueNumber: issue.issue_number,
          description: issue.deck || issue.description,
          imageUrl: issue.image?.medium_url || issue.image?.small_url,
          volumeName: issue.volume?.name,
          coverDate: issue.cover_date,
          storeDate: issue.store_date,
          metadata: {
            comicVineId: issue.id,
            comicVineUrl: issue.site_detail_url,
            hasStaffReview: issue.has_staff_review,
          }
        }));
    } catch (error) {
      console.error('Error fetching Comic Vine issues:', error);
      return [];
    }
  }

  /**
   * Fetch creators/people from Comic Vine (writers, artists)
   */
  async fetchComicVineCreators(limit = 50): Promise<any[]> {
    try {
      if (!this.comicVineApiKey) {
        console.warn('Comic Vine API key not configured');
        return [];
      }

      const url = `${this.comicVineBaseUrl}/people/?api_key=${this.comicVineApiKey}&format=json&limit=${limit}&sort=date_last_updated:desc`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Panel Profits Trading Platform'
        }
      });

      if (!response.ok) {
        throw new Error(`Comic Vine API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error !== 'OK' || !data.results) {
        console.error('Comic Vine API returned error:', data.error);
        return [];
      }

      return data.results
        .filter((person: any) => person.image && !person.image.original_url?.includes('blank'))
        .map((creator: any) => ({
          id: creator.id,
          name: creator.name,
          description: creator.deck || creator.description,
          imageUrl: creator.image?.medium_url || creator.image?.small_url,
          birthDate: creator.birth,
          hometown: creator.hometown,
          country: creator.country,
          aliases: creator.aliases ? creator.aliases.split('\n').filter(Boolean) : [],
          metadata: {
            comicVineId: creator.id,
            comicVineUrl: creator.site_detail_url,
            gender: creator.gender,
            countOfIssueAppearances: creator.count_of_issue_appearances,
          }
        }));
    } catch (error) {
      console.error('Error fetching Comic Vine creators:', error);
      return [];
    }
  }
}

export const comicDataService = new ComicDataService();