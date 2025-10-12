/**
 * YouTube Video API Routes
 * Endpoints for extracting and managing YouTube video content
 */

import { Router } from 'express';
import { youtubeVideoService } from '../services/youtubeVideoService';
import { youtubeApiService } from '../services/youtubeApiService';
import { videoEmbeddingService } from '../services/videoEmbeddingService';

const router = Router();

// Extract all videos from all channels using YouTube Data API v3
router.post('/extract', async (req, res) => {
  try {
    if (!youtubeApiService.isConfigured()) {
      // Fallback to RSS if no API key
      const result = await youtubeVideoService.fetchAndStoreAllVideos();
      return res.json({
        success: true,
        message: 'YouTube video extraction complete (RSS mode - limited to recent videos)',
        method: 'rss',
        data: result,
      });
    }

    // Use API for complete channel histories
    const results = await youtubeApiService.fetchAllChannels();
    
    res.json({
      success: true,
      message: 'YouTube video extraction complete (Full API mode)',
      method: 'api',
      channels: results,
    });
  } catch (error: any) {
    console.error('Error extracting YouTube videos:', error);
    res.status(500).json({
      error: 'Failed to extract videos',
      message: error.message,
    });
  }
});

// Get recent videos
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const videos = await youtubeVideoService.getRecentVideos(limit);
    
    res.json({
      success: true,
      count: videos.length,
      videos,
    });
  } catch (error: any) {
    console.error('Error fetching recent videos:', error);
    res.status(500).json({
      error: 'Failed to fetch videos',
      message: error.message,
    });
  }
});

// Get videos by channel
router.get('/channel/:channelName', async (req, res) => {
  try {
    const { channelName } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const videos = await youtubeVideoService.getVideosByChannel(channelName, limit);
    
    res.json({
      success: true,
      channel: channelName,
      count: videos.length,
      videos,
    });
  } catch (error: any) {
    console.error(`Error fetching ${req.params.channelName} videos:`, error);
    res.status(500).json({
      error: 'Failed to fetch channel videos',
      message: error.message,
    });
  }
});

// Get ComicGirl19 X-Men videos specifically
router.get('/comicgirl19/xmen', async (req, res) => {
  try {
    const videos = await youtubeVideoService.getComicGirl19XMenVideos();
    
    res.json({
      success: true,
      count: videos.length,
      description: 'X-Men history videos from ComicGirl19 (~100 videos, 6+ hours)',
      videos,
    });
  } catch (error: any) {
    console.error('Error fetching ComicGirl19 X-Men videos:', error);
    res.status(500).json({
      error: 'Failed to fetch X-Men videos',
      message: error.message,
    });
  }
});

// Extract ComicGirl19 full X-Men catalog via API
router.post('/comicgirl19/extract', async (req, res) => {
  try {
    if (!youtubeApiService.isConfigured()) {
      return res.status(400).json({
        error: 'YouTube API not configured',
        message: 'YouTube Data API key required for full channel extraction',
      });
    }

    const result = await youtubeApiService.fetchComicGirl19XMen();
    
    res.json({
      success: true,
      message: 'ComicGirl19 X-Men extraction complete',
      ...result,
    });
  } catch (error: any) {
    console.error('Error extracting ComicGirl19:', error);
    res.status(500).json({
      error: 'Failed to extract ComicGirl19 videos',
      message: error.message,
    });
  }
});

// Get NerdSync complete catalog
router.get('/nerdsync/catalog', async (req, res) => {
  try {
    const videos = await youtubeVideoService.getNerdSyncCatalog();
    
    res.json({
      success: true,
      count: videos.length,
      description: 'Complete NerdSync catalog - genius comic analysis',
      videos,
    });
  } catch (error: any) {
    console.error('Error fetching NerdSync catalog:', error);
    res.status(500).json({
      error: 'Failed to fetch NerdSync videos',
      message: error.message,
    });
  }
});

// Extract NerdSync complete catalog via API
router.post('/nerdsync/extract', async (req, res) => {
  try {
    if (!youtubeApiService.isConfigured()) {
      return res.status(400).json({
        error: 'YouTube API not configured',
        message: 'YouTube Data API key required for full channel extraction',
      });
    }

    const result = await youtubeApiService.fetchNerdSyncCatalog();
    
    res.json({
      success: true,
      message: 'NerdSync catalog extraction complete',
      ...result,
    });
  } catch (error: any) {
    console.error('Error extracting NerdSync:', error);
    res.status(500).json({
      error: 'Failed to extract NerdSync videos',
      message: error.message,
    });
  }
});

// Search videos by tags
router.get('/search', async (req, res) => {
  try {
    const tags = (req.query.tags as string)?.split(',') || [];
    const limit = parseInt(req.query.limit as string) || 20;
    
    if (tags.length === 0) {
      return res.status(400).json({
        error: 'No tags provided',
        message: 'Please provide tags as comma-separated values (e.g., ?tags=x-men,marvel)',
      });
    }
    
    const videos = await youtubeVideoService.searchVideosByTags(tags, limit);
    
    res.json({
      success: true,
      tags,
      count: videos.length,
      videos,
    });
  } catch (error: any) {
    console.error('Error searching videos:', error);
    res.status(500).json({
      error: 'Failed to search videos',
      message: error.message,
    });
  }
});

// ========================================
// VECTOR SEARCH ENDPOINTS (Pinecone)
// ========================================

// Embed all videos for semantic search
router.post('/embed/all', async (req, res) => {
  try {
    console.log('🔮 Starting video embedding process...');
    
    const result = await videoEmbeddingService.embedAllVideos();
    
    res.json({
      success: true,
      message: 'Video embedding complete',
      embedded: result.success,
      failed: result.failed,
      total: result.success + result.failed,
    });
  } catch (error: any) {
    console.error('Error embedding videos:', error);
    res.status(500).json({
      error: 'Failed to embed videos',
      message: error.message,
    });
  }
});

// Semantic search across all videos
router.get('/search/semantic', async (req, res) => {
  try {
    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 10;
    const channelName = req.query.channel as string;
    
    if (!query) {
      return res.status(400).json({
        error: 'No query provided',
        message: 'Please provide a search query (e.g., ?q=x-men mutant powers)',
      });
    }
    
    const filters: any = {};
    if (channelName) {
      filters.channelName = channelName;
    }
    
    const results = await videoEmbeddingService.searchVideos(query, limit, filters);
    
    res.json({
      success: true,
      query,
      count: results.length,
      results,
    });
  } catch (error: any) {
    console.error('Error in semantic search:', error);
    res.status(500).json({
      error: 'Failed to search videos',
      message: error.message,
    });
  }
});

// ComicGirl19 X-Men semantic search
router.get('/search/comicgirl19-xmen', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const results = await videoEmbeddingService.searchComicGirl19XMen(limit);
    
    res.json({
      success: true,
      description: 'ComicGirl19 X-Men videos via semantic search',
      count: results.length,
      results,
    });
  } catch (error: any) {
    console.error('Error searching ComicGirl19 X-Men:', error);
    res.status(500).json({
      error: 'Failed to search ComicGirl19 X-Men videos',
      message: error.message,
    });
  }
});

// NerdSync semantic search by topic
router.get('/search/nerdsync', async (req, res) => {
  try {
    const topic = req.query.topic as string;
    const limit = parseInt(req.query.limit as string) || 20;
    
    if (!topic) {
      return res.status(400).json({
        error: 'No topic provided',
        message: 'Please provide a topic (e.g., ?topic=batman detective comics)',
      });
    }
    
    const results = await videoEmbeddingService.searchNerdSync(topic, limit);
    
    res.json({
      success: true,
      topic,
      count: results.length,
      results,
    });
  } catch (error: any) {
    console.error('Error searching NerdSync:', error);
    res.status(500).json({
      error: 'Failed to search NerdSync videos',
      message: error.message,
    });
  }
});

export default router;
