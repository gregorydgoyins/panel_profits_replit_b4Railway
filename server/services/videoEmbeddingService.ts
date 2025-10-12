/**
 * Video Embedding Service
 * Generates and stores vector embeddings for YouTube video content
 * Enables semantic search across ComicGirl19 X-Men saga, NerdSync, and other video sources
 */

import { db } from '../databaseStorage';
import { videoContent } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { openaiService } from './openaiService';
import { pineconeService } from './pineconeService';

class VideoEmbeddingService {
  private readonly VIDEO_NAMESPACE = 'video_content';

  /**
   * Generate embedding text from video metadata and transcript
   */
  private generateEmbeddingText(video: any): string {
    const parts = [
      `Title: ${video.title}`,
      `Channel: ${video.channelName}`,
      video.description ? `Description: ${video.description}` : '',
      video.tags?.length ? `Tags: ${video.tags.join(', ')}` : '',
      video.transcript ? `Transcript: ${video.transcript.slice(0, 5000)}` : '', // First 5000 chars of transcript
    ];

    return parts.filter(Boolean).join('\n\n');
  }

  /**
   * Embed a single video and store in Pinecone
   */
  async embedVideo(videoId: string): Promise<boolean> {
    try {
      // Fetch video from database
      const videos = await db
        .select()
        .from(videoContent)
        .where(eq(videoContent.videoId, videoId))
        .limit(1);

      if (videos.length === 0) {
        console.error(`Video ${videoId} not found`);
        return false;
      }

      const video = videos[0];
      
      // Generate embedding text
      const embeddingText = this.generateEmbeddingText(video);
      
      // Generate embedding using OpenAI
      const embedding = await openaiService.generateEmbedding(embeddingText);
      
      if (!embedding) {
        console.error(`Failed to generate embedding for video ${videoId}`);
        return false;
      }

      // Store in Pinecone with metadata
      const result = await pineconeService.upsertVectors(
        [{
          id: `video_${videoId}`,
          values: embedding,
          metadata: {
            videoId: video.videoId,
            title: video.title,
            channelName: video.channelName,
            channelId: video.channelId,
            description: video.description || '',
            tags: video.tags || [],
            url: video.url,
            thumbnailUrl: video.thumbnailUrl || '',
            publishDate: video.publishDate?.toISOString(),
            duration: video.duration || 0,
            viewCount: video.viewCount || 0,
            likeCount: video.likeCount || 0,
            type: 'video',
          }
        }],
        this.VIDEO_NAMESPACE
      );

      if (result) {
        console.log(`✅ Embedded video: ${video.title}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Error embedding video ${videoId}:`, error);
      return false;
    }
  }

  /**
   * Embed all videos in the database
   */
  async embedAllVideos(): Promise<{ success: number; failed: number }> {
    try {
      const videos = await db.select().from(videoContent);
      
      console.log(`📹 Starting to embed ${videos.length} videos...`);
      
      let success = 0;
      let failed = 0;

      for (const video of videos) {
        const result = await this.embedVideo(video.videoId);
        if (result) {
          success++;
        } else {
          failed++;
        }

        // Rate limiting: 100ms delay between embeddings
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`✅ Embedding complete: ${success} success, ${failed} failed`);
      
      return { success, failed };
    } catch (error) {
      console.error('Error embedding videos:', error);
      return { success: 0, failed: 0 };
    }
  }

  /**
   * Search videos by semantic similarity
   */
  async searchVideos(query: string, topK: number = 10, filters?: {
    channelName?: string;
    tags?: string[];
  }): Promise<any[]> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await openaiService.generateEmbedding(query);
      
      if (!queryEmbedding) {
        console.error('Failed to generate query embedding');
        return [];
      }

      // Build Pinecone filter
      const pineconeFilter: any = { type: { $eq: 'video' } };
      
      if (filters?.channelName) {
        pineconeFilter.channelName = { $eq: filters.channelName };
      }
      
      if (filters?.tags && filters.tags.length > 0) {
        pineconeFilter.tags = { $in: filters.tags };
      }

      // Query Pinecone
      const results = await pineconeService.querySimilar(
        queryEmbedding,
        topK,
        this.VIDEO_NAMESPACE,
        pineconeFilter
      );

      if (!results) {
        return [];
      }

      // Format results
      return results.map((match: any) => ({
        videoId: match.metadata?.videoId,
        title: match.metadata?.title,
        channelName: match.metadata?.channelName,
        description: match.metadata?.description,
        url: match.metadata?.url,
        thumbnailUrl: match.metadata?.thumbnailUrl,
        tags: match.metadata?.tags || [],
        similarity: match.score,
        publishDate: match.metadata?.publishDate,
      }));
    } catch (error) {
      console.error('Error searching videos:', error);
      return [];
    }
  }

  /**
   * Get X-Men videos from ComicGirl19 using semantic search
   */
  async searchComicGirl19XMen(topK: number = 50): Promise<any[]> {
    return this.searchVideos(
      'X-Men mutants Marvel comics history characters storylines',
      topK,
      { channelName: 'ComicGirl19' }
    );
  }

  /**
   * Get NerdSync videos about specific topic
   */
  async searchNerdSync(topic: string, topK: number = 20): Promise<any[]> {
    return this.searchVideos(
      topic,
      topK,
      { channelName: 'NerdSync' }
    );
  }
}

export const videoEmbeddingService = new VideoEmbeddingService();
