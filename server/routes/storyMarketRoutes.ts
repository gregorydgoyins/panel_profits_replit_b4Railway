import type { Express } from 'express';
import type { IStorage } from '../storage';

export function registerStoryMarketRoutes(app: Express, storage: IStorage) {

  // Get story-worthy assets with high narrative potential
  app.get('/api/market/story-assets', async (req, res) => {
    try {
      
      // Get all assets
      const assets = await storage.getAllAssets();
      
      // Get recent market data for each asset
      const storyAssets = await Promise.all(
        assets.slice(0, 12).map(async (asset) => {
          const marketData = await storage.getMarketDataByTimeframe(asset.id, '1d');
          const latestData = marketData[marketData.length - 1];
          
          if (!latestData) {
            return {
              id: asset.id,
              symbol: asset.symbol,
              name: asset.name,
              type: asset.type,
              currentPrice: 100,
              change24h: 0,
              marketCap: 0,
              storyRating: Math.floor(Math.random() * 5) + 1
            };
          }
          
          // Calculate story rating based on volatility and volume
          const change = parseFloat(latestData.percentChange || '0');
          const volume = latestData.volume || 0;
          const storyRating = Math.min(10, Math.floor(
            Math.abs(change) / 2 + (volume > 10000 ? 3 : 0) + Math.random() * 2
          ));
          
          return {
            id: asset.id,
            symbol: asset.symbol,
            name: asset.name,
            type: asset.type,
            currentPrice: parseFloat(latestData.close),
            change24h: change,
            marketCap: parseFloat(latestData.marketCap || '0'),
            storyRating: Math.max(1, storyRating)
          };
        })
      );
      
      // Sort by story rating
      storyAssets.sort((a, b) => b.storyRating - a.storyRating);
      
      res.json(storyAssets);
    } catch (error) {
      console.error('Error fetching story assets:', error);
      res.status(500).json({ error: 'Failed to fetch story assets' });
    }
  });

  // Get comic splash page data for an asset
  app.get('/api/market/comic-splash/:assetId', async (req, res) => {
    try {
      const { assetId } = req.params;
      const asset = await storage.getAsset(assetId);
      
      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      
      // Get market data
      const marketData = await storage.getMarketDataByTimeframe(assetId, '1h');
      
      // Transform into comic narrative
      const priceHistory = marketData.slice(-24).map((data, index) => {
        const price = parseFloat(data.close);
        const volume = data.volume || 0;
        const change = parseFloat(data.percentChange || '0');
        
        // Detect dramatic events
        let eventType = undefined;
        if (Math.abs(change) > 10) eventType = 'breakout';
        else if (Math.abs(change) > 5) eventType = 'volatility';
        else if (index > 0 && Math.sign(change) !== Math.sign(parseFloat(marketData[index - 1].percentChange || '0'))) {
          eventType = 'reversal';
        }
        
        return {
          timestamp: data.periodStart,
          price,
          volume,
          sentiment: change > 2 ? 'bullish' : change < -2 ? 'bearish' : 'neutral',
          eventType
        };
      });
      
      // Generate key moments
      const keyMoments = [];
      const significantChanges = marketData
        .filter(d => Math.abs(parseFloat(d.percentChange || '0')) > 5)
        .slice(-3);
      
      for (const data of significantChanges) {
        const change = parseFloat(data.percentChange || '0');
        keyMoments.push({
          time: data.periodStart,
          title: change > 0 ? 'SURGE OF POWER!' : 'CRITICAL HIT!',
          description: `${asset.name} ${change > 0 ? 'soars' : 'plummets'} ${Math.abs(change).toFixed(1)}%`,
          impact: Math.abs(change) > 10 ? 'high' : Math.abs(change) > 5 ? 'medium' : 'low',
          icon: change > 0 ? 'rocket' : 'explosion'
        });
      }
      
      // Determine narrative arc phase
      const latestChange = parseFloat(marketData[marketData.length - 1]?.percentChange || '0');
      const avgChange = marketData.reduce((acc, d) => acc + parseFloat(d.percentChange || '0'), 0) / marketData.length;
      
      let phase = 'origin';
      let title = 'The Beginning';
      let description = 'Every hero has an origin story...';
      
      if (latestChange > 10) {
        phase = 'climax';
        title = 'THE ULTIMATE SHOWDOWN!';
        description = 'Witness the epic battle for market supremacy!';
      } else if (latestChange > 5) {
        phase = 'rising';
        title = 'Rising Action';
        description = 'The hero gains strength and momentum...';
      } else if (latestChange < -10) {
        phase = 'falling';
        title = 'The Dark Hour';
        description = 'Even heroes must face their darkest moments...';
      } else if (Math.abs(avgChange) < 2) {
        phase = 'resolution';
        title = 'Finding Balance';
        description = 'The market seeks equilibrium in the eternal cycle...';
      }
      
      res.json({
        assetId: asset.id,
        assetName: asset.name,
        assetType: asset.type,
        currentPrice: parseFloat(marketData[marketData.length - 1]?.close || '100'),
        change24h: latestChange,
        volume24h: marketData.reduce((acc, d) => acc + (d.volume || 0), 0),
        priceHistory,
        keyMoments,
        narrativeArc: {
          title,
          phase,
          description
        }
      });
    } catch (error) {
      console.error('Error fetching comic splash data:', error);
      res.status(500).json({ error: 'Failed to fetch comic splash data' });
    }
  });

  // Get market events formatted as comic panels
  app.get('/api/market/comic-events', async (req, res) => {
    try {
      const events = await storage.getActiveMarketEvents();
      
      // Transform events into comic panels
      const panels = await Promise.all(
        events.slice(0, 8).map(async (event) => {
          // Get affected assets details
          const affectedAssets = await Promise.all(
            (event.affectedAssets || []).slice(0, 3).map(async (assetSymbol) => {
              const assets = await storage.getAllAssets();
              const asset = assets.find(a => a.symbol === assetSymbol);
              
              if (!asset) return null;
              
              const marketData = await storage.getMarketDataByTimeframe(asset.id, '1d');
              const latestData = marketData[marketData.length - 1];
              const change = parseFloat(latestData?.percentChange || '0');
              
              return {
                id: asset.id,
                name: asset.name,
                role: change > 0 ? 'hero' : change < 0 ? 'villain' : 'bystander' as const,
                changePercent: change
              };
            })
          );
          
          // Determine panel properties based on event
          const impactLevel = event.significance === 'high' ? 'critical' :
                            event.significance === 'medium' ? 'major' :
                            event.significance === 'low' ? 'moderate' : 'minor';
          
          const eventType = event.category?.includes('merger') ? 'alliance' :
                           event.category?.includes('conflict') ? 'battle' :
                           event.category?.includes('scandal') ? 'betrayal' :
                           event.category?.includes('launch') ? 'discovery' : 'prophecy';
          
          const visualStyle = impactLevel === 'critical' ? 'action' :
                             impactLevel === 'major' ? 'dramatic' :
                             eventType === 'discovery' ? 'mysterious' : 'epic';
          
          return {
            id: event.id,
            timestamp: event.eventDate || event.createdAt || new Date(),
            title: event.title.toUpperCase(),
            description: event.description || 'The market trembles with anticipation...',
            impact: impactLevel,
            type: eventType,
            affectedAssets: affectedAssets.filter(a => a !== null),
            visualStyle,
            panelLayout: impactLevel === 'critical' ? 'full' : 'split'
          };
        })
      );
      
      res.json({
        title: 'MARKET CHRONICLES',
        issue: new Date().getDate(),
        panels: panels.filter(p => p !== null),
        currentPage: 1,
        totalPages: Math.ceil(panels.length / 4)
      });
    } catch (error) {
      console.error('Error fetching comic events:', error);
      res.status(500).json({ error: 'Failed to fetch comic events' });
    }
  });

  // Get news formatted as comic dialogue
  app.get('/api/market/comic-news', async (req, res) => {
    try {
      const news = await storage.getAllMarketNews();
      
      // Transform news into comic dialogue
      const newsItems = news.slice(0, 20).map((item) => {
        const sentiment = parseFloat(item.sentimentScore || '0');
        const confidence = parseFloat(item.confidence || '0.5');
        
        // Determine dialogue type based on content
        let type: 'speech' | 'thought' | 'narration' | 'shout' | 'whisper' = 'speech';
        if (confidence > 0.8) type = 'shout';
        else if (confidence < 0.3) type = 'whisper';
        else if (item.source === 'analysis') type = 'thought';
        else if (item.source === 'system') type = 'narration';
        
        // Determine speaker based on sentiment and source - Watchmen characters
        let speaker = {
          name: 'Dr. Manhattan',
          role: 'oracle' as const,
        };
        
        if (sentiment > 0.5) {
          speaker = { name: 'Ozymandias', role: 'hero' as const }; // "Hero" who sacrifices millions
        } else if (sentiment < -0.5) {
          speaker = { name: 'The Comedian', role: 'villain' as const }; // Laughs at the horror
        } else if (item.source === 'community') {
          speaker = { name: 'Rorschach', role: 'crowd' as const }; // Voice of uncompromising truth
        } else if (item.source === 'official') {
          speaker = { name: 'Silk Spectre', role: 'narrator' as const }; // Inherited legacy
        }
        
        // Determine impact
        const impact = confidence > 0.7 ? 'high' : confidence > 0.4 ? 'medium' : 'low';
        
        // Visual effects for dramatic news
        let visualEffect = undefined;
        if (impact === 'high' && Math.abs(sentiment) > 0.7) {
          visualEffect = sentiment > 0 ? 'glow' : 'shake';
        } else if (type === 'shout') {
          visualEffect = 'pulse';
        }
        
        return {
          id: item.id,
          timestamp: item.createdAt || new Date(),
          headline: item.title,
          content: item.content.slice(0, 200) + (item.content.length > 200 ? '...' : ''),
          type,
          speaker,
          sentiment: sentiment > 0.3 ? 'bullish' :
                    sentiment < -0.3 ? 'bearish' :
                    confidence < 0.3 ? 'mysterious' : 'neutral',
          impact,
          relatedAssets: (item.tags || []).slice(0, 3),
          reactions: {
            likes: Math.floor(Math.random() * 500),
            dislikes: Math.floor(Math.random() * 100),
            shares: Math.floor(Math.random() * 200),
            views: Math.floor(Math.random() * 2000)
          },
          visualEffect
        };
      });
      
      // Find breaking news (most recent high-impact)
      const breakingNews = newsItems.find(item => item.impact === 'high');
      
      res.json({
        currentIssue: `Vol. ${new Date().getMonth() + 1}, Issue ${new Date().getDate()}`,
        newsItems,
        breakingNews
      });
    } catch (error) {
      console.error('Error fetching comic news:', error);
      res.status(500).json({ error: 'Failed to fetch comic news' });
    }
  });

  // Get market narrative summary
  app.get('/api/market/narrative', async (req, res) => {
    try {
      // Get overall market stats
      const assets = await storage.getAllAssets();
      const marketData = await Promise.all(
        assets.slice(0, 50).map(async (asset) => {
          const data = await storage.getMarketDataByTimeframe(asset.id, '1d');
          return data[data.length - 1];
        })
      );
      
      // Calculate market mood
      const avgChange = marketData.reduce((acc, d) => {
        return acc + (d ? parseFloat(d.percentChange || '0') : 0);
      }, 0) / marketData.length;
      
      const volatility = marketData.reduce((acc, d) => {
        return acc + (d ? Math.abs(parseFloat(d.percentChange || '0')) : 0);
      }, 0) / marketData.length;
      
      // Determine narrative elements
      let summary = '';
      let currentAct = 1;
      let mood: 'heroic' | 'tragic' | 'mysterious' = 'mysterious';
      let intensity = 5;
      
      if (avgChange > 5) {
        summary = 'The market gorges itself on false prosperity. Every profit is built on someone else\'s ruin. The smiley face badge grins while widows weep over portfolios. Nothing ever ends.';
        currentAct = 3;
        mood = 'heroic';
        intensity = 8;
      } else if (avgChange < -5) {
        summary = 'Blood in the streets. Not metaphorical - real human cost measured in foreclosures and suicides. The Comedian would laugh. Dr. Manhattan sees it all as inevitable atomic decay.';
        currentAct = 4;
        mood = 'tragic';
        intensity = 9;
      } else if (volatility > 8) {
        summary = 'The doomsday clock ticks closer to midnight. Every trade accelerates our collective destruction. Ozymandias has a plan, but at what cost? Who watches the market makers?';
        currentAct = 2;
        mood = 'mysterious';
        intensity = 10;
      } else {
        summary = 'Rorschach\'s journal: Market date ' + new Date().toDateString() + '. This city is afraid of me. I\'ve seen its true face. The accumulated filth of all their trades will foam up about their waists.';
        currentAct = 1;
        mood = 'mysterious';
        intensity = 3;
      }
      
      res.json({
        summary,
        currentAct,
        mood,
        intensity: Math.min(10, Math.max(1, intensity))
      });
    } catch (error) {
      console.error('Error fetching market narrative:', error);
      res.status(500).json({ error: 'Failed to fetch market narrative' });
    }
  });
}