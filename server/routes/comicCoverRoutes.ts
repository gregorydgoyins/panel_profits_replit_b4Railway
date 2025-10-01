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