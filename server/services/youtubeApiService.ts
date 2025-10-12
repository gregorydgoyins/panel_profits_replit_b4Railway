/**
 * YouTube Data API v3 Service
 * Fetches complete channel histories, video metadata, and transcripts
 * Upgrades from RSS (15 videos) to full pagination (100+ videos per channel)
 */

import { db } from '../databaseStorage';
import { videoContent } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  channelName: string;
  channelId: string;
  publishDate: Date;
  duration: number;
  thumbnailUrl: string;
  url: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  transcript?: string;
}

export class YouTubeApiService {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || '';
  }

  /**
   * Check if API key is available
   */
  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  /**
   * Convert ISO 8601 duration to seconds
   */
  private parseDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);
    
    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Extract tags from title and description
   */
  private extractTags(title: string, description: string, tags: string[] = []): string[] {
    const text = (title + ' ' + description).toLowerCase();
    const extractedTags: string[] = [...tags];

    const patterns = [
      { pattern: /\b(x-men|xmen|mutant)\b/i, tag: 'x-men' },
      { pattern: /\b(marvel|mcu)\b/i, tag: 'marvel' },
      { pattern: /\b(dc|dceu)\b/i, tag: 'dc' },
      { pattern: /\b(batman|dark knight)\b/i, tag: 'batman' },
      { pattern: /\b(spider-man|spiderman)\b/i, tag: 'spider-man' },
      { pattern: /\b(comic|comics)\b/i, tag: 'comics' },
      { pattern: /\b(history|origin)\b/i, tag: 'history' },
      { pattern: /\b(review|analysis)\b/i, tag: 'analysis' },
      { pattern: /\b(investment|value|price)\b/i, tag: 'investment' },
      { pattern: /\b(collectible|grading|cgc)\b/i, tag: 'collectibles' },
      { pattern: /\b(wolverine|logan)\b/i, tag: 'wolverine' },
      { pattern: /\b(magneto|professor x)\b/i, tag: 'x-men-characters' },
      { pattern: /\b(avengers)\b/i, tag: 'avengers' },
      { pattern: /\b(first appearance|key issue)\b/i, tag: 'first-appearance' },
    ];

    for (const { pattern, tag } of patterns) {
      if (pattern.test(text) && !extractedTags.includes(tag)) {
        extractedTags.push(tag);
      }
    }

    return extractedTags.length > 0 ? extractedTags : ['general'];
  }

  /**
   * Get channel's uploads playlist ID
   */
  private async getUploadsPlaylistId(channelId: string): Promise<string | null> {
    try {
      const url = `${this.baseUrl}/channels?` + new URLSearchParams({
        key: this.apiKey,
        id: channelId,
        part: 'contentDetails',
      }).toString();

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || !data.items || data.items.length === 0) {
        return null;
      }

      return data.items[0].contentDetails.relatedPlaylists.uploads;
    } catch (error) {
      console.error('Error getting uploads playlist:', error);
      return null;
    }
  }

  /**
   * Fetch all videos from a channel (paginated - COMPLETE history via uploads playlist)
   * Uses playlistItems API which has no 500-video limit, unlike search API
   */
  async fetchChannelVideos(channelId: string, channelName: string, maxResults?: number): Promise<YouTubeVideo[]> {
    if (!this.isConfigured()) {
      console.warn('⚠️ YouTube API key not configured');
      return [];
    }

    const videos: YouTubeVideo[] = [];
    let pageToken: string | undefined;
    let fetchedCount = 0;

    try {
      // Step 1: Get the uploads playlist ID for this channel
      const uploadsPlaylistId = await this.getUploadsPlaylistId(channelId);
      
      if (!uploadsPlaylistId) {
        console.error(`Failed to get uploads playlist for ${channelName}`);
        return [];
      }

      console.log(`   Using uploads playlist: ${uploadsPlaylistId}`);

      do {
        // Step 2: Get video IDs from uploads playlist (no 500-video limit!)
        const playlistUrl = `${this.baseUrl}/playlistItems?` + new URLSearchParams({
          key: this.apiKey,
          playlistId: uploadsPlaylistId,
          part: 'contentDetails',
          maxResults: '50', // Max per request
          ...(pageToken ? { pageToken } : {}),
        }).toString();

        const playlistResponse = await fetch(playlistUrl);
        const playlistData = await playlistResponse.json();

        if (!playlistResponse.ok) {
          console.error('YouTube API error:', playlistData);
          break;
        }

        const videoIds = playlistData.items?.map((item: any) => item.contentDetails?.videoId).filter(Boolean) || [];
        
        if (videoIds.length === 0) break;

        // Step 3: Get video details (title, description, stats, duration)
        const detailsUrl = `${this.baseUrl}/videos?` + new URLSearchParams({
          key: this.apiKey,
          id: videoIds.join(','),
          part: 'snippet,contentDetails,statistics',
        }).toString();

        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();

        if (!detailsResponse.ok) {
          console.error('YouTube API details error:', detailsData);
          break;
        }

        // Parse video data
        for (const item of detailsData.items || []) {
          const snippet = item.snippet;
          const contentDetails = item.contentDetails;
          const statistics = item.statistics;

          videos.push({
            videoId: item.id,
            title: snippet.title,
            description: snippet.description || '',
            channelName,
            channelId,
            publishDate: new Date(snippet.publishedAt),
            duration: this.parseDuration(contentDetails.duration),
            thumbnailUrl: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
            url: `https://www.youtube.com/watch?v=${item.id}`,
            tags: this.extractTags(snippet.title, snippet.description || '', snippet.tags || []),
            viewCount: parseInt(statistics.viewCount || '0', 10),
            likeCount: parseInt(statistics.likeCount || '0', 10),
          });
        }

        fetchedCount += videoIds.length;
        pageToken = playlistData.nextPageToken;

        console.log(`   Fetched ${fetchedCount} videos from ${channelName}...`);

        // Respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

        // Stop if maxResults limit is set and reached
        if (maxResults && fetchedCount >= maxResults) {
          console.log(`   Reached maxResults limit of ${maxResults}`);
          break;
        }

      } while (pageToken); // Continue until no more pages - NO 500-VIDEO LIMIT!

      console.log(`✅ Fetched ${videos.length} total videos from ${channelName}`);
      return videos;

    } catch (error) {
      console.error(`❌ Error fetching ${channelName}:`, error);
      return videos;
    }
  }

  /**
   * Fetch transcript for a video using YouTube Transcript API
   * Note: This is a simplified version - full implementation would use youtube-transcript library
   */
  async fetchTranscript(videoId: string): Promise<string | null> {
    try {
      // For now, return null - transcript fetching requires additional library
      // TODO: Integrate youtube-transcript or similar library
      // const transcript = await getTranscript(videoId);
      // return transcript.map(t => t.text).join(' ');
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Store video in database
   */
  async storeVideo(video: YouTubeVideo): Promise<{ stored: boolean; id?: string }> {
    try {
      // Check if video already exists
      const existing = await db
        .select()
        .from(videoContent)
        .where(eq(videoContent.videoId, video.videoId))
        .limit(1);

      if (existing.length > 0) {
        // Update view/like counts if changed
        await db
          .update(videoContent)
          .set({
            viewCount: video.viewCount,
            likeCount: video.likeCount,
            updatedAt: new Date(),
          })
          .where(eq(videoContent.videoId, video.videoId));
        
        return { stored: false, id: existing[0].id };
      }

      // Insert new video
      const [newVideo] = await db
        .insert(videoContent)
        .values({
          videoId: video.videoId,
          title: video.title,
          description: video.description,
          channelName: video.channelName,
          channelId: video.channelId,
          publishDate: video.publishDate,
          duration: video.duration,
          thumbnailUrl: video.thumbnailUrl,
          url: video.url,
          tags: video.tags,
          viewCount: video.viewCount,
          likeCount: video.likeCount,
          transcript: video.transcript || null,
        })
        .returning({ id: videoContent.id });

      return { stored: true, id: newVideo.id };
    } catch (error) {
      console.error('❌ Error storing video:', error);
      return { stored: false };
    }
  }

  /**
   * Fetch and store complete channel history (unlimited by default)
   */
  async fetchAndStoreChannel(channelId: string, channelName: string, maxVideos?: number): Promise<{
    fetched: number;
    stored: number;
    updated: number;
  }> {
    console.log(`\n🎥 Fetching complete history for ${channelName}...`);
    
    const videos = await this.fetchChannelVideos(channelId, channelName, maxVideos);
    
    let stored = 0;
    let updated = 0;

    for (const video of videos) {
      const result = await this.storeVideo(video);
      if (result.stored) {
        stored++;
      } else {
        updated++;
      }
    }

    console.log(`✅ ${channelName}: ${stored} new, ${updated} updated`);

    return {
      fetched: videos.length,
      stored,
      updated,
    };
  }

  /**
   * Fetch ComicGirl19 complete X-Men saga (FULL catalog, no limits)
   */
  async fetchComicGirl19XMen(): Promise<{ fetched: number; stored: number }> {
    const result = await this.fetchAndStoreChannel(
      'UCCyTmNW8vJdGKXjL76eSDxA',
      'ComicGirl19'
      // No maxVideos - fetch complete channel history
    );

    return {
      fetched: result.fetched,
      stored: result.stored,
    };
  }

  /**
   * Fetch NerdSync complete catalog (FULL catalog, no limits)
   */
  async fetchNerdSyncCatalog(): Promise<{ fetched: number; stored: number }> {
    const result = await this.fetchAndStoreChannel(
      'UC3L_XqkuCG9m0HJWx8c2Z1A',
      'NerdSync'
      // No maxVideos - fetch complete channel history
    );

    return {
      fetched: result.fetched,
      stored: result.stored,
    };
  }

  /**
   * Fetch all priority channels (COMPLETE histories, no limits)
   */
  async fetchAllChannels(): Promise<Record<string, { fetched: number; stored: number; updated: number }>> {
    const channels = [
      { id: 'UCCyTmNW8vJdGKXjL76eSDxA', name: 'ComicGirl19' },
      { id: 'UC3L_XqkuCG9m0HJWx8c2Z1A', name: 'NerdSync' },
      { id: 'UCXMQWGhex2AgoN7pJW6G1sQ', name: 'ComicPOP' },
      { id: 'UCKxQmKgrkUv4S7P5w0pLayw', name: 'Comics Explained' },
      { id: 'UC9zC40MvM2mKTkmI3Fzgwfw', name: 'ComicTom101' },
      { id: 'UCsI1Cc-Yp8jOpDRh-qHwO5A', name: 'Nerdy By Nature' },
      { id: 'UCOlFZxj7ijVH5fBAP8qORdw', name: 'Comic Book Herald' },
    ];

    const results: Record<string, { fetched: number; stored: number; updated: number }> = {};

    for (const channel of channels) {
      // No maxVideos - fetch complete channel history
      results[channel.name] = await this.fetchAndStoreChannel(channel.id, channel.name);
      
      // Rate limiting between channels
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }
}

export const youtubeApiService = new YouTubeApiService();
