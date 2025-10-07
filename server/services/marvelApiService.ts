import crypto from 'crypto';

interface MarvelApiResponse<T> {
  code: number;
  status: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: T[];
  };
}

interface MarvelComic {
  id: number;
  title: string;
  issueNumber: number;
  variantDescription: string;
  description: string;
  series: {
    resourceURI: string;
    name: string;
  };
  thumbnail: {
    path: string;
    extension: string;
  };
  images: Array<{
    path: string;
    extension: string;
  }>;
  dates: Array<{
    type: string;
    date: string;
  }>;
  characters: {
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  creators: {
    items: Array<{
      resourceURI: string;
      name: string;
      role: string;
    }>;
  };
  textObjects: Array<{
    type: string;
    language: string;
    text: string;
  }>;
  stories: {
    items: Array<{
      resourceURI: string;
      name: string;
      type: string;
    }>;
  };
  events: {
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
}

export class MarvelApiService {
  private publicKey: string;
  private privateKey: string;
  private baseUrl = 'https://gateway.marvel.com/v1/public';

  constructor() {
    this.publicKey = process.env.MARVEL_PUBLIC_KEY || '';
    this.privateKey = process.env.MARVEL_PRIVATE_KEY || '';
    
    if (!this.publicKey || !this.privateKey) {
      throw new Error('Marvel API keys not configured');
    }
  }

  private generateAuthParams(): { ts: string; apikey: string; hash: string } {
    const ts = Date.now().toString();
    const hash = crypto
      .createHash('md5')
      .update(ts + this.privateKey + this.publicKey)
      .digest('hex');

    return {
      ts,
      apikey: this.publicKey,
      hash,
    };
  }

  async fetchComics(params: {
    limit?: number;
    offset?: number;
    titleStartsWith?: string;
    format?: string;
    formatType?: string;
    noVariants?: boolean;
    hasDigitalIssue?: boolean;
    orderBy?: string;
  } = {}): Promise<MarvelApiResponse<MarvelComic>> {
    const authParams = this.generateAuthParams();
    const queryParams = new URLSearchParams({
      ...authParams,
      limit: (params.limit || 20).toString(),
      offset: (params.offset || 0).toString(),
      ...(params.titleStartsWith && { titleStartsWith: params.titleStartsWith }),
      ...(params.format && { format: params.format }),
      ...(params.formatType && { formatType: params.formatType }),
      ...(params.noVariants !== undefined && { noVariants: params.noVariants.toString() }),
      ...(params.hasDigitalIssue !== undefined && { hasDigitalIssue: params.hasDigitalIssue.toString() }),
      ...(params.orderBy && { orderBy: params.orderBy }),
    });

    const url = `${this.baseUrl}/comics?${queryParams}`;
    console.log('[Marvel API] Fetching comics:', url.replace(this.privateKey, '***'));

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Marvel API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async fetchComicById(comicId: number): Promise<MarvelComic> {
    const authParams = this.generateAuthParams();
    const queryParams = new URLSearchParams(authParams);

    const url = `${this.baseUrl}/comics/${comicId}?${queryParams}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Marvel API error: ${response.status} ${response.statusText}`);
    }

    const data: MarvelApiResponse<MarvelComic> = await response.json();
    if (data.data.results.length === 0) {
      throw new Error(`Comic ${comicId} not found`);
    }

    return data.data.results[0];
  }

  async downloadImage(imageUrl: string): Promise<Buffer> {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }
    
    return Buffer.from(await response.arrayBuffer());
  }

  getHighQualityImageUrl(thumbnail: { path: string; extension: string }): string {
    // Use Marvel's high-quality image variant instead of default thumbnail
    // Available variants: portrait_uncanny (300x450), portrait_incredible (216x324), detail (500+)
    // We'll use detail for highest quality
    return `${thumbnail.path}/detail.${thumbnail.extension}`;
  }
  
  getBestAvailableImage(comic: MarvelComic): string {
    // Prefer images array over thumbnail for best quality
    if (comic.images && comic.images.length > 0) {
      const bestImage = comic.images[0];
      return `${bestImage.path}/detail.${bestImage.extension}`;
    }
    return this.getHighQualityImageUrl(comic.thumbnail);
  }

  extractSeriesName(seriesName: string): { series: string; volumeYear: number | null } {
    const volumeMatch = seriesName.match(/\((\d{4})\s*-\s*(?:\d{4}|Present)\)/i);
    if (volumeMatch) {
      const year = parseInt(volumeMatch[1]);
      const series = seriesName.replace(/\s*\(\d{4}\s*-\s*(?:\d{4}|Present)\)/i, '').trim();
      return { series, volumeYear: year };
    }
    return { series: seriesName, volumeYear: null };
  }

  extractIssueNumber(comic: MarvelComic): string {
    if (comic.issueNumber) {
      return comic.issueNumber.toString();
    }
    
    const match = comic.title.match(/#(\d+(?:\.\d+)?)/);
    if (match) {
      return match[1];
    }
    
    return '0';
  }

  extractVariant(comic: MarvelComic): string {
    if (comic.variantDescription) {
      const variant = comic.variantDescription
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '');
      return variant || 'variant';
    }
    return 'regular';
  }

  extractPublisher(comic: MarvelComic): string {
    return 'marvel';
  }

  isKeyIssue(comic: MarvelComic): { tier: number; tags: string[] } {
    const title = comic.title.toLowerCase();
    const description = (comic.description || '').toLowerCase();
    const issueNum = this.extractIssueNumber(comic);
    const tags: string[] = [];
    let tier = 3;

    // Combine all text for comprehensive analysis
    const allText = [
      title,
      description,
      ...(comic.textObjects || []).map(obj => obj.text.toLowerCase()),
      ...(comic.stories?.items || []).map(story => story.name.toLowerCase()),
    ].join(' ');

    // Tier 1: First appearances
    const firstAppearancePatterns = [
      /first appearance/i,
      /debut/i,
      /introduces/i,
      /origin of/i,
      /1st appearance/i,
      /first app\./i,
    ];
    
    if (firstAppearancePatterns.some(pattern => pattern.test(allText))) {
      tags.push('first_appearance');
      tier = 1;
    }

    // Tier 1: Deaths and major character changes
    const deathPatterns = [
      /death of/i,
      /dies/i,
      /killed/i,
      /final issue/i,
      /last stand/i,
    ];
    
    if (deathPatterns.some(pattern => pattern.test(allText))) {
      tags.push('death');
      tier = 1;
    }

    // Tier 1: Origins
    const originPatterns = [
      /origin/i,
      /how.*began/i,
      /born again/i,
      /year one/i,
    ];
    
    if (originPatterns.some(pattern => pattern.test(allText))) {
      tags.push('origin');
      tier = 1;
    }

    // Tier 1: First issues
    if (issueNum === '1') {
      tags.push('first_issue');
      tier = 1;
    }

    // Tier 1: Major events (from events array)
    if (comic.events && comic.events.items.length > 0) {
      tags.push('major_event');
      tier = Math.min(tier, 1);
      
      comic.events.items.forEach(event => {
        const eventName = event.name.toLowerCase();
        if (eventName.includes('crisis') || eventName.includes('war') || 
            eventName.includes('invasion') || eventName.includes('fall of')) {
          tier = 1;
        }
      });
    }

    // Tier 2: Milestone issues
    const milestoneIssues = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'];
    if (milestoneIssues.includes(issueNum)) {
      tags.push('milestone_issue');
      tier = Math.min(tier, 2);
    }

    // Tier 2: Annuals and special issues
    if (title.includes('annual') || title.includes('special')) {
      tags.push('annual_special');
      tier = Math.min(tier, 2);
    }

    // Tier 2: Team formations and crossovers
    const teamPatterns = [
      /assemble/i,
      /team.*forms/i,
      /joins the/i,
      /new.*team/i,
      /crossover/i,
    ];
    
    if (teamPatterns.some(pattern => pattern.test(allText))) {
      tags.push('team_formation');
      tier = Math.min(tier, 2);
    }

    // Variant covers (doesn't affect tier, just adds tag)
    if (comic.variantDescription) {
      tags.push('variant_cover');
    }

    // Character-specific key moments
    if (comic.characters && comic.characters.items.length >= 3) {
      tags.push('team_up');
    }

    return { tier, tags: [...new Set(tags)] };
  }

  extractFeaturedCharacters(comic: MarvelComic): string[] {
    return comic.characters.items.map(char => char.name);
  }
}
