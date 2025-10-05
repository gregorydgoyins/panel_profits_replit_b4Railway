import type { Express } from "express";
import { storage } from "../storage";
import { comicDataService } from "../services/comicDataService";
import { z } from "zod";

export function registerComicCoverRoutes(app: Express) {
  // Get random comic covers from REAL Marvel API
  app.get("/api/comic-covers/random", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
      const comics = await comicDataService.fetchRandomComicCovers(limit);
      
      res.json({
        success: true,
        data: comics,
        count: comics.length
      });
    } catch (error) {
      console.error('Error fetching random comic covers:', error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch random comic covers",
        data: [],
        count: 0
      });
    }
  });

  // Get Comic of the Day with historical context
  app.get("/api/comic-covers/comic-of-the-day", async (req, res) => {
    try {
      const comic = await comicDataService.getComicOfTheDay();
      
      if (!comic) {
        return res.status(404).json({ 
          success: false, 
          error: "No comic of the day available",
          data: null
        });
      }
      
      res.json({
        success: true,
        data: comic
      });
    } catch (error) {
      console.error('Error fetching comic of the day:', error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch comic of the day",
        data: null
      });
    }
  });

  // Get Historical Significance details for a comic
  app.get("/api/comic-covers/historical-significance/:id", async (req, res) => {
    try {
      const comicId = parseInt(req.params.id);
      const comic = await comicDataService.getComicOfTheDay();
      
      if (!comic || comic.id !== comicId) {
        return res.status(404).json({ 
          success: false, 
          error: "Historical significance data not found",
          data: null
        });
      }
      
      // Extended historical significance data
      const historicalData = {
        comicId: comic.id,
        title: comic.title,
        series: comic.series,
        issueNumber: comic.issueNumber,
        coverUrl: comic.coverUrl,
        onsaleDate: comic.onsaleDate,
        significance: comic.significance,
        historicalContext: comic.historicalContext,
        fullAnalysis: `This groundbreaking issue represents a pivotal moment in comic book history. ${comic.historicalContext}\n\nThe creative team's innovative approach to storytelling set new standards for the medium, influencing countless creators who followed.`,
        culturalImpact: `The cultural resonance of this issue extends far beyond the comic book medium. It has been referenced in popular culture, adapted for screen, and continues to inspire new generations of readers and creators.`,
        marketImportance: `From an investment perspective, this issue has demonstrated exceptional value appreciation. Its historical significance, combined with limited availability, makes it a cornerstone piece for serious collectors.`,
        recommendation: `This comic is essential reading for anyone interested in understanding the evolution of sequential art and storytelling. Whether you're a collector, investor, or enthusiast, this issue deserves a place in your collection.`,
        keyPoints: [
          'First appearance of groundbreaking storytelling techniques',
          'Critical acclaim upon release, cementing its legendary status',
          'Exceptional value appreciation over time',
          'Cultural impact extending beyond the comic book medium',
          'Collectible significance recognized by industry experts'
        ],
        estimatedValue: comic.estimatedValue,
        printPrice: comic.printPrice
      };
      
      res.json({
        success: true,
        data: historicalData
      });
    } catch (error) {
      console.error('Error fetching historical significance:', error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch historical significance data",
        data: null
      });
    }
  });

  // Get Issue Detail for in-depth analysis
  app.get("/api/comic-covers/issue-detail/:id", async (req, res) => {
    try {
      const comicId = parseInt(req.params.id);
      const comic = await comicDataService.getComicOfTheDay();
      
      if (!comic || comic.id !== comicId) {
        return res.status(404).json({ 
          success: false, 
          error: "Issue details not found",
          data: null
        });
      }
      
      // Extended issue detail data
      const issueDetail = {
        comicId: comic.id,
        title: comic.title,
        series: comic.series,
        issueNumber: comic.issueNumber,
        coverUrl: comic.coverUrl,
        description: comic.description,
        onsaleDate: comic.onsaleDate,
        format: comic.format,
        pageCount: comic.pageCount,
        storyTitle: `The ${comic.title} Chronicles`,
        plotSummary: `${comic.description}\n\nThis issue explores deeper themes of heroism, sacrifice, and the human condition. The narrative weaves together multiple character arcs, creating a rich tapestry of storytelling that rewards both casual readers and dedicated fans alike.`,
        characterAnalysis: `The character development in this issue is exceptional. Each hero faces personal challenges that test not just their powers, but their principles. The protagonist's journey from doubt to determination forms the emotional core of the story, while supporting characters provide depth and nuance to the overall narrative.`,
        artStyle: `The visual presentation is stunning, with dynamic panel layouts and expressive character work. The artist's use of color and shadow creates atmosphere while maintaining clarity in the action sequences.`,
        writingQuality: `The dialogue feels natural and character-driven, with each voice distinctly their own. The pacing balances action with quieter character moments, creating a satisfying rhythm throughout the issue.`,
        themesAndMotifs: `Central themes include the weight of responsibility, the cost of heroism, and the importance of hope in dark times. Recurring visual motifs of light and shadow reinforce the story's exploration of moral complexity.`,
        notableQuotes: [
          'With great power comes great responsibility',
          'It\'s not about being perfect. It\'s about doing what\'s right.',
          'Heroes aren\'t born. They\'re made in moments of crisis.'
        ],
        collectorsNotes: `This issue is highly sought after by collectors for its pivotal story developments and iconic cover art. First printings in mint condition command premium prices in the market. Key factors affecting value include issue number significance, creator lineup, and historical importance to the overall series.`,
        estimatedValue: comic.estimatedValue,
        creators: comic.creators
      };
      
      res.json({
        success: true,
        data: issueDetail
      });
    } catch (error) {
      console.error('Error fetching issue details:', error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch issue details",
        data: null
      });
    }
  });

  // Get Order Desk data for trading
  app.get("/api/comic-covers/order-desk/:assetId", async (req, res) => {
    try {
      const assetId = parseInt(req.params.assetId);
      const comic = await comicDataService.getComicOfTheDay();
      
      if (!comic || comic.id !== assetId) {
        return res.status(404).json({ 
          success: false, 
          error: "Asset not found",
          data: null
        });
      }
      
      // Order desk data for trading
      const orderDeskData = {
        id: comic.id,
        title: comic.title,
        series: comic.series,
        issueNumber: comic.issueNumber,
        coverUrl: comic.coverUrl,
        currentPrice: comic.estimatedValue / 100, // Share price (assuming 100 shares per comic)
        estimatedValue: comic.estimatedValue,
        printPrice: comic.printPrice,
        symbol: `${comic.series.toUpperCase().substring(0, 5)}.V${comic.issueNumber}.#${comic.issueNumber}`
      };
      
      res.json({
        success: true,
        data: orderDeskData
      });
    } catch (error) {
      console.error('Error fetching order desk data:', error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch order desk data",
        data: null
      });
    }
  });

  // Get featured comics for homepage
  app.get("/api/comic-covers/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const featureType = req.query.type as string;
      
      const featured = await storage.getFeaturedComics({
        featureType,
        isActive: true,
        limit
      });

      // Transform to include cover URLs and metadata
      const transformedFeatured = featured.map(comic => ({
        ...comic,
        coverUrl: comic.featuredImageUrl,
        metadata: {
          publisher: comic.subtitle?.includes('Marvel') ? 'Marvel' : 'Comics',
          type: comic.featureType,
          displayOrder: comic.displayOrder
        }
      }));

      res.json({
        success: true,
        data: transformedFeatured,
        count: transformedFeatured.length
      });
    } catch (error) {
      console.error('Error fetching featured comics:', error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch featured comics",
        data: [],
        count: 0
      });
    }
  });

  // Get hero banner comics (top featured covers)
  app.get("/api/comic-covers/hero-banner", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      
      const heroComics = await storage.getFeaturedComics({
        featureType: 'hero_banner',
        isActive: true,
        limit
      });

      // If no specific hero banner comics, get top featured comics
      let comics = heroComics;
      if (comics.length === 0) {
        comics = await storage.getFeaturedComics({
          isActive: true,
          limit
        });
      }

      const transformedComics = comics.map(comic => ({
        id: comic.id,
        title: comic.title,
        subtitle: comic.subtitle || 'Featured Comic',
        description: comic.description || `Discover the legendary ${comic.title} series.`,
        coverUrl: comic.featuredImageUrl,
        seriesId: comic.seriesId,
        displayOrder: comic.displayOrder,
        type: 'hero_banner'
      }));

      res.json({
        success: true,
        data: transformedComics,
        count: transformedComics.length
      });
    } catch (error) {
      console.error('Error fetching hero banner comics:', error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch hero banner comics",
        data: [],
        count: 0
      });
    }
  });

  // Get trending comics covers
  app.get("/api/comic-covers/trending", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
      
      const trendingComics = await storage.getFeaturedComics({
        featureType: 'trending',
        isActive: true,
        limit
      });

      // If no trending comics, get classic comics
      let comics = trendingComics;
      if (comics.length === 0) {
        comics = await storage.getFeaturedComics({
          featureType: 'classic',
          isActive: true,
          limit
        });
      }

      const transformedComics = comics.map(comic => ({
        id: comic.id,
        title: comic.title,
        subtitle: comic.subtitle || 'Trending Now',
        coverUrl: comic.featuredImageUrl,
        seriesId: comic.seriesId,
        displayOrder: comic.displayOrder,
        type: 'trending'
      }));

      res.json({
        success: true,
        data: transformedComics,
        count: transformedComics.length
      });
    } catch (error) {
      console.error('Error fetching trending comics:', error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch trending comics",
        data: [],
        count: 0
      });
    }
  });

  // Get comic series with cover galleries
  app.get("/api/comic-covers/series", async (req, res) => {
    try {
      const publisher = req.query.publisher as string;
      const search = req.query.search as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      
      const series = await storage.getComicSeriesList({
        publisher,
        search,
        limit
      });

      // Filter series that have cover URLs
      const seriesWithCovers = series
        .filter(s => s.featuredCoverUrl || s.coversUrl)
        .map(series => ({
          id: series.id,
          seriesName: series.seriesName,
          publisher: series.publisher,
          year: series.year,
          description: series.description,
          coverUrl: series.featuredCoverUrl,
          galleryUrl: series.coversUrl,
          scansUrl: series.scansUrl,
          publishedPeriod: series.publishedPeriod,
          issueCount: series.issueCount
        }));

      res.json({
        success: true,
        data: seriesWithCovers,
        count: seriesWithCovers.length
      });
    } catch (error) {
      console.error('Error fetching comic series:', error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch comic series",
        data: [],
        count: 0
      });
    }
  });

  // Get cover statistics and metrics
  app.get("/api/comic-covers/stats", async (req, res) => {
    try {
      const metrics = await storage.getComicMetrics();
      const featuredCount = await storage.getFeaturedComicsCount();
      
      const stats = {
        totalSeries: metrics.totalSeries,
        totalCovers: metrics.totalCovers || 0,
        featuredComics: featuredCount,
        totalCreators: metrics.totalCreators,
        recentlyImported: 0 // Could be tracked with timestamps
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching cover stats:', error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch cover statistics",
        data: {
          totalSeries: 0,
          totalCovers: 0,
          featuredComics: 0,
          totalCreators: 0,
          recentlyImported: 0
        }
      });
    }
  });

  // Import comic covers from CSV
  app.post("/api/comic-covers/import", async (req, res) => {
    try {
      const { ComicDataImportService } = await import('../services/comicDataImportService.js');
      
      console.log('Starting comic cover import...');
      const results = await ComicDataImportService.importComicCoversFromCSV();
      
      res.json({
        success: true,
        message: 'Comic cover import completed',
        data: {
          imported: results.imported,
          errors: results.errors,
          coverStats: results.coverStats
        }
      });
    } catch (error) {
      console.error('Error importing comic covers:', error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to import comic covers",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

export default registerComicCoverRoutes;