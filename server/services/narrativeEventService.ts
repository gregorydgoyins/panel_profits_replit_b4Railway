import { storage } from '../storage';
import { NarrativeEvent, InsertNarrativeEvent, Asset, MarketData } from '@shared/schema';
// WS_DISABLED: import { WebSocketServer } from 'ws';

// Event configuration constants
const EVENT_GENERATION_INTERVAL = { min: 30000, max: 60000 }; // 30-60 seconds
const EVENT_DURATIONS = {
  low: { min: 60, max: 180 },      // 1-3 minutes
  medium: { min: 180, max: 300 },  // 3-5 minutes
  high: { min: 300, max: 600 },    // 5-10 minutes
  catastrophic: { min: 600, max: 1800 } // 10-30 minutes
};

// Event templates for different types
const EVENT_TEMPLATES = {
  house_war: {
    titles: [
      "⚔️ House War: {house1} vs {house2}!",
      "🔥 Battle Royale: {house1} Strikes Against {house2}!",
      "💥 Territorial Dispute: {house1} Invades {house2} Markets!"
    ],
    descriptions: [
      "An epic battle erupts between {house1} and {house2}, sending shockwaves through their asset portfolios!",
      "{house1} launches a surprise offensive against {house2}, causing massive volatility in both territories!",
      "The ancient rivalry between {house1} and {house2} explodes into open warfare!"
    ],
    impactRange: { min: -15, max: 15 },
    soundEffects: ["CLASH!", "BOOM!", "WAR!", "BATTLE!"]
  },
  hero_falls: {
    titles: [
      "💀 Hero Falls: {character} Meets Their End!",
      "😱 Tragedy Strikes: {character} Is No More!",
      "⚰️ Dark Day: {character}'s Final Stand!"
    ],
    descriptions: [
      "In a shocking turn of events, {character} has fallen! Markets plunge as fans mourn.",
      "The unthinkable has happened - {character} is gone, sending related assets into freefall!",
      "Breaking: {character}'s demise rocks the market, triggering panic selling!"
    ],
    impactRange: { min: -30, max: -10 },
    soundEffects: ["CRASH!", "THUD!", "NOOO!", "TRAGEDY!"]
  },
  crossover_event: {
    titles: [
      "🌟 Crossover Event: {house1} × {house2} Unite!",
      "🤝 Historic Alliance: {house1} and {house2} Join Forces!",
      "✨ Mega Event: The {house1}-{house2} Collaboration!"
    ],
    descriptions: [
      "In an unprecedented move, {house1} and {house2} announce a major crossover event!",
      "Markets surge as {house1} and {house2} reveal their collaborative masterpiece!",
      "The impossible becomes reality as {house1} partners with {house2}!"
    ],
    impactRange: { min: 10, max: 35 },
    soundEffects: ["UNITE!", "TRIUMPH!", "AMAZING!", "WOW!"]
  },
  writer_scandal: {
    titles: [
      "📰 Writer Scandal: {creator} in Hot Water!",
      "😤 Controversy Alert: {creator} Under Fire!",
      "🔥 Breaking: {creator} Scandal Rocks Market!"
    ],
    descriptions: [
      "Shocking allegations surface against {creator}, causing their work's value to plummet!",
      "{creator}'s reputation takes a massive hit as controversy spreads like wildfire!",
      "Markets react negatively to breaking news about {creator}'s scandalous behavior!"
    ],
    impactRange: { min: -25, max: -5 },
    soundEffects: ["SCANDAL!", "SHOCK!", "GASP!", "OH NO!"]
  },
  movie_announcement: {
    titles: [
      "🎬 Movie Deal: {asset} Heads to Hollywood!",
      "🎥 Blockbuster Alert: {asset} Gets Film Adaptation!",
      "🌟 Silver Screen: {asset} Movie Announced!"
    ],
    descriptions: [
      "Major studios announce a {asset} movie franchise, sending prices to the moon!",
      "Hollywood comes calling! {asset} secured for a multi-film deal!",
      "Breaking: {asset} to become the next cinematic universe!"
    ],
    impactRange: { min: 20, max: 50 },
    soundEffects: ["ACTION!", "LIGHTS!", "CAMERA!", "BLOCKBUSTER!"]
  },
  reboot: {
    titles: [
      "🔄 Reboot Alert: {asset} Getting Fresh Start!",
      "♻️ Reset Button: {asset} Rebooted!",
      "🆕 New Beginning: {asset} Universe Reset!"
    ],
    descriptions: [
      "{asset} universe gets a complete reboot, creating market uncertainty!",
      "Everything changes as {asset} undergoes a total continuity reset!",
      "Markets wobble as {asset} wipes the slate clean with a full reboot!"
    ],
    impactRange: { min: -20, max: 20 },
    soundEffects: ["RESET!", "REBOOT!", "CHANGE!", "TRANSFORM!"]
  },
  supply_shock: {
    titles: [
      "📚 Supply Shock: {asset} Print Run Issues!",
      "⚠️ Scarcity Alert: {asset} Stock Running Low!",
      "🏃 Shortage: {asset} Becomes Ultra-Rare!"
    ],
    descriptions: [
      "Production issues create severe {asset} shortages, driving prices through the roof!",
      "Warehouse fire destroys {asset} inventory, creating instant scarcity!",
      "Distribution problems make {asset} nearly impossible to find!"
    ],
    impactRange: { min: 15, max: 40 },
    soundEffects: ["RARE!", "SCARCE!", "LIMITED!", "SHORTAGE!"]
  }
};

// Seven Houses configuration
const SEVEN_HOUSES = [
  { id: 'sequential-securities', name: 'Sequential Securities' },
  { id: 'ink-blood', name: 'Ink & Blood' },
  { id: 'heroic-trust', name: 'Heroic Trust' },
  { id: 'narrative-capital', name: 'Narrative Capital' },
  { id: 'visual-holdings', name: 'Visual Holdings' },
  { id: 'vigilante-exchange', name: 'Vigilante Exchange' },
  { id: 'crossover-consortium', name: 'Crossover Consortium' }
];

export class NarrativeEventService {
  private wsServer: WebSocketServer | null = null;
  private eventTimer: NodeJS.Timeout | null = null;
  private activeEvents: Map<string, NodeJS.Timeout> = new Map();
  private isRunning: boolean = false;

  constructor() {}

  // Set WebSocket server for broadcasting
  setWebSocketServer(wsServer: WebSocketServer) {
    this.wsServer = wsServer;
  }

  // Start the event generation service
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('📖 Narrative Event Service started');
    this.scheduleNextEvent();
    this.checkActiveEvents();
  }

  // Stop the service
  stop() {
    this.isRunning = false;
    if (this.eventTimer) {
      clearTimeout(this.eventTimer);
      this.eventTimer = null;
    }
    // Clear all active event timers
    for (const timer of this.activeEvents.values()) {
      clearTimeout(timer);
    }
    this.activeEvents.clear();
    console.log('📖 Narrative Event Service stopped');
  }

  // Schedule the next event generation
  private scheduleNextEvent() {
    if (!this.isRunning) return;

    const delay = Math.random() * (EVENT_GENERATION_INTERVAL.max - EVENT_GENERATION_INTERVAL.min) + EVENT_GENERATION_INTERVAL.min;
    
    this.eventTimer = setTimeout(async () => {
      await this.generateEvent();
      this.scheduleNextEvent();
    }, delay);
  }

  // Get current market conditions
  private async getMarketConditions() {
    try {
      // Get recent market data for top assets
      const assets = await storage.getAssets({ type: 'character' });
      const topAssets = assets.slice(0, 10);
      
      let totalChange = 0;
      let positiveCount = 0;
      let negativeCount = 0;

      for (const asset of topAssets) {
        const marketData = await storage.getLatestMarketData(asset.id, '1h');
        if (marketData) {
          const change = Number(marketData.close) - Number(marketData.open);
          const changePercent = (change / Number(marketData.open)) * 100;
          totalChange += changePercent;
          if (changePercent > 0) positiveCount++;
          else if (changePercent < 0) negativeCount++;
        }
      }

      const avgChange = topAssets.length > 0 ? totalChange / topAssets.length : 0;
      
      // Determine market condition
      if (avgChange > 5) return 'bull_market';
      if (avgChange < -5) return 'bear_market';
      if (positiveCount > negativeCount * 1.5) return 'mild_bull';
      if (negativeCount > positiveCount * 1.5) return 'mild_bear';
      return 'sideways';
    } catch (error) {
      console.error('Error getting market conditions:', error);
      return 'sideways';
    }
  }

  // Generate a narrative event
  private async generateEvent() {
    try {
      const marketCondition = await this.getMarketConditions();
      const eventType = this.selectEventType(marketCondition);
      const template = EVENT_TEMPLATES[eventType];
      
      // Get random assets and houses
      const assets = await storage.getAssets();
      const randomAssets = this.getRandomElements(assets, Math.floor(Math.random() * 3) + 1);
      const randomHouses = this.getRandomElements(SEVEN_HOUSES, eventType === 'house_war' || eventType === 'crossover_event' ? 2 : 1);

      // Select severity based on market conditions
      const severity = this.selectSeverity(marketCondition);
      const duration = this.getRandomDuration(severity);
      
      // Generate impact percentage
      let impactPercentage = Math.random() * (template.impactRange.max - template.impactRange.min) + template.impactRange.min;
      
      // Adjust impact based on market conditions
      if (marketCondition === 'bull_market' && impactPercentage < 0) {
        impactPercentage *= 0.7; // Reduce negative impact in bull markets
      } else if (marketCondition === 'bear_market' && impactPercentage > 0) {
        impactPercentage *= 0.7; // Reduce positive impact in bear markets
      }

      // Create title and description with replacements
      const title = this.getRandomElement(template.titles)
        .replace('{house1}', randomHouses[0]?.name || 'Unknown House')
        .replace('{house2}', randomHouses[1]?.name || 'Mystery House')
        .replace('{character}', randomAssets[0]?.name || 'Unknown Hero')
        .replace('{creator}', 'Creator')
        .replace('{asset}', randomAssets[0]?.name || 'Asset');

      const description = this.getRandomElement(template.descriptions)
        .replace('{house1}', randomHouses[0]?.name || 'Unknown House')
        .replace('{house2}', randomHouses[1]?.name || 'Mystery House')
        .replace('{character}', randomAssets[0]?.name || 'Unknown Hero')
        .replace('{creator}', 'Creator')
        .replace('{asset}', randomAssets[0]?.name || 'Asset');

      const soundEffect = this.getRandomElement(template.soundEffects);
      
      // Determine chain reaction probability
      const chainReactionProbability = severity === 'catastrophic' ? 30 :
                                       severity === 'high' ? 15 :
                                       severity === 'medium' ? 5 : 0;

      // Create the event
      const event: InsertNarrativeEvent = {
        title,
        description,
        eventType,
        affectedHouses: randomHouses.map(h => h.id),
        affectedAssets: randomAssets.map(a => a.id),
        impactPercentage: String(impactPercentage.toFixed(2)),
        duration,
        severity,
        soundEffect,
        visualStyle: severity === 'catastrophic' ? 'catastrophic' : 
                    severity === 'high' ? 'explosion' :
                    severity === 'medium' ? 'dramatic' : 'subtle',
        narrative: description + ' The market watches with bated breath as this story unfolds.',
        isActive: true,
        startTime: new Date(),
        endTime: new Date(Date.now() + duration * 1000),
        triggerCondition: marketCondition,
        marketContext: { 
          condition: marketCondition,
          timestamp: new Date().toISOString(),
          affectedAssetCount: randomAssets.length
        },
        chainReactionProbability: String(chainReactionProbability)
      };

      const createdEvent = await storage.createNarrativeEvent(event);
      
      // Apply price impacts
      await this.applyPriceImpacts(createdEvent);
      
      // Broadcast event via WebSocket
      this.broadcastEvent(createdEvent);
      
      // Schedule event deactivation
      this.scheduleEventDeactivation(createdEvent);
      
      // Check for chain reactions
      if (Math.random() * 100 < chainReactionProbability) {
        setTimeout(() => this.generateChainReaction(createdEvent), 5000);
      }

      console.log(`📖 Generated narrative event: ${title} (${severity} severity, ${duration}s duration)`);
    } catch (error) {
      console.error('Error generating narrative event:', error);
    }
  }

  // Generate a chain reaction event
  private async generateChainReaction(parentEvent: NarrativeEvent) {
    // Generate a related event based on the parent
    console.log(`⛓️ Generating chain reaction from: ${parentEvent.title}`);
    // Similar to generateEvent but with parentEventId set
    // Implementation would follow similar pattern
  }

  // Apply price impacts to affected assets
  private async applyPriceImpacts(event: NarrativeEvent) {
    if (!event.affectedAssets) return;

    for (const assetId of event.affectedAssets) {
      try {
        // Get current price
        const currentData = await storage.getLatestMarketData(assetId, '1m');
        if (!currentData) continue;

        const currentPrice = Number(currentData.close);
        const impactPercent = Number(event.impactPercentage) / 100;
        const newPrice = currentPrice * (1 + impactPercent);

        // Create new market data point with the impact
        await storage.createMarketData({
          assetId,
          timeframe: '1m',
          periodStart: new Date(),
          open: String(currentPrice),
          high: String(Math.max(currentPrice, newPrice)),
          low: String(Math.min(currentPrice, newPrice)),
          close: String(newPrice),
          volume: String(Math.random() * 10000 + 1000), // Spike in volume during events
          trades: Math.floor(Math.random() * 100 + 50)
        });

        console.log(`💰 Applied ${impactPercent * 100}% price impact to asset ${assetId}`);
      } catch (error) {
        console.error(`Error applying price impact to asset ${assetId}:`, error);
      }
    }
  }

  // Broadcast event via WebSocket
  private broadcastEvent(event: NarrativeEvent) {
    if (!this.wsServer) return;

    const message = {
      type: 'narrative_event',
      data: event
    };

    this.wsServer.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(JSON.stringify(message));
      }
    });
  }

  // Schedule event deactivation
  private scheduleEventDeactivation(event: NarrativeEvent) {
    const timer = setTimeout(async () => {
      try {
        await storage.deactivateNarrativeEvent(event.id);
        this.activeEvents.delete(event.id);
        
        // Broadcast event end
        this.broadcastEvent({ ...event, isActive: false });
        
        console.log(`📖 Deactivated narrative event: ${event.title}`);
      } catch (error) {
        console.error('Error deactivating event:', error);
      }
    }, event.duration * 1000);

    this.activeEvents.set(event.id, timer);
  }

  // Check and reactivate any active events on startup
  private async checkActiveEvents() {
    try {
      const activeEvents = await storage.getActiveNarrativeEvents();
      
      for (const event of activeEvents) {
        if (event.endTime && new Date(event.endTime) > new Date()) {
          // Event is still active, schedule its deactivation
          const remainingTime = new Date(event.endTime).getTime() - Date.now();
          
          const timer = setTimeout(async () => {
            await storage.deactivateNarrativeEvent(event.id);
            this.activeEvents.delete(event.id);
            this.broadcastEvent({ ...event, isActive: false });
          }, remainingTime);
          
          this.activeEvents.set(event.id, timer);
          console.log(`📖 Resumed active event: ${event.title}`);
        } else {
          // Event should have ended, deactivate it
          await storage.deactivateNarrativeEvent(event.id);
        }
      }
    } catch (error) {
      console.error('Error checking active events:', error);
    }
  }

  // Helper methods
  private selectEventType(marketCondition: string): keyof typeof EVENT_TEMPLATES {
    const eventTypes = Object.keys(EVENT_TEMPLATES) as Array<keyof typeof EVENT_TEMPLATES>;
    
    // Bias event selection based on market conditions
    const weights = {
      bull_market: {
        crossover_event: 30,
        movie_announcement: 30,
        supply_shock: 15,
        house_war: 10,
        reboot: 10,
        hero_falls: 3,
        writer_scandal: 2
      },
      bear_market: {
        hero_falls: 25,
        writer_scandal: 20,
        house_war: 20,
        reboot: 15,
        supply_shock: 10,
        crossover_event: 5,
        movie_announcement: 5
      },
      sideways: {
        house_war: 20,
        reboot: 20,
        crossover_event: 15,
        movie_announcement: 15,
        hero_falls: 10,
        writer_scandal: 10,
        supply_shock: 10
      }
    };

    const condition = weights[marketCondition as keyof typeof weights] || weights.sideways;
    
    // Weighted random selection
    const totalWeight = Object.values(condition).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (const [event, weight] of Object.entries(condition)) {
      random -= weight;
      if (random <= 0) {
        return event as keyof typeof EVENT_TEMPLATES;
      }
    }
    
    return eventTypes[Math.floor(Math.random() * eventTypes.length)];
  }

  private selectSeverity(marketCondition: string): 'low' | 'medium' | 'high' | 'catastrophic' {
    const random = Math.random();
    
    if (marketCondition === 'bull_market' || marketCondition === 'bear_market') {
      // More extreme events during strong trends
      if (random < 0.1) return 'catastrophic';
      if (random < 0.3) return 'high';
      if (random < 0.6) return 'medium';
      return 'low';
    } else {
      // Fewer extreme events during sideways markets
      if (random < 0.05) return 'catastrophic';
      if (random < 0.2) return 'high';
      if (random < 0.5) return 'medium';
      return 'low';
    }
  }

  private getRandomDuration(severity: string): number {
    const range = EVENT_DURATIONS[severity as keyof typeof EVENT_DURATIONS];
    return Math.floor(Math.random() * (range.max - range.min) + range.min);
  }

  private getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, array.length));
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}

// Export singleton instance
export const narrativeEventService = new NarrativeEventService();