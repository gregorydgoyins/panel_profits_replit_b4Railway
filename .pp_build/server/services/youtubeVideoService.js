"use strict";
/**
 * YouTube Video Service
 * Extracts and stores video content from ComicGirl19, NerdSync, and other comic channels
 * Supports RSS feeds, metadata extraction, and transcript retrieval
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.youtubeVideoService = exports.YouTubeVideoService = void 0;
const databaseStorage_1 = require("../databaseStorage");
const schema_1 = require("@shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
const rss_parser_1 = __importDefault(require("rss-parser"));
// Target channels for comic content
const YOUTUBE_CHANNELS = [
    {
        name: 'ComicGirl19',
        channelId: 'UCCyTmNW8vJdGKXjL76eSDxA', // ComicGirl19 channel ID
        priority: 'high',
        description: 'X-Men history and comprehensive comic analysis - ~100 videos, 6+ hours of content',
    },
    {
        name: 'NerdSync',
        channelId: 'UC3L_XqkuCG9m0HJWx8c2Z1A', // NerdSync channel ID
        priority: 'high',
        description: 'Genius comic analysis without directly talking about comics - the Seinfeld of comic geekdom',
    },
    {
        name: 'ComicPOP',
        channelId: 'UCXMQWGhex2AgoN7pJW6G1sQ',
        priority: 'medium',
        description: 'Comic reviews and back issues',
    },
    {
        name: 'Comics Explained',
        channelId: 'UCKxQmKgrkUv4S7P5w0pLayw',
        priority: 'medium',
        description: 'In-depth comic storyline explanations',
    },
    {
        name: 'ComicTom101',
        channelId: 'UC9zC40MvM2mKTkmI3Fzgwfw',
        priority: 'medium',
        description: 'Comic book market analysis and news',
    },
    {
        name: 'Nerdy By Nature',
        channelId: 'UCsI1Cc-Yp8jOpDRh-qHwO5A',
        priority: 'medium',
        description: 'Comic book reviews and analysis',
    },
    {
        name: 'Comic Book Herald',
        channelId: 'UCOlFZxj7ijVH5fBAP8qORdw',
        priority: 'medium',
        description: 'Reading order guides and comic analysis',
    },
];
class YouTubeVideoService {
    constructor() {
        this.rssParser = new rss_parser_1.default({
            customFields: {
                item: [
                    ['media:group', 'media'],
                    ['yt:videoId', 'videoId'],
                    ['yt:channelId', 'channelId'],
                ],
            },
        });
    }
    /**
     * Get RSS feed URL for a YouTube channel
     */
    getRSSFeedUrl(channelId) {
        return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    }
    /**
     * Fetch videos from a channel via RSS
     */
    async fetchChannelVideos(channel) {
        try {
            const feedUrl = this.getRSSFeedUrl(channel.channelId);
            const feed = await this.rssParser.parseURL(feedUrl);
            const videos = feed.items.map(item => ({
                videoId: item.videoId || this.extractVideoId(item.link || ''),
                title: item.title || 'Untitled',
                description: item.contentSnippet || item.summary || '',
                channelName: channel.name,
                channelId: channel.channelId,
                publishDate: item.pubDate ? new Date(item.pubDate) : new Date(),
                thumbnailUrl: this.extractThumbnail(item),
                url: item.link || '',
                duration: this.extractDuration(item),
                tags: this.extractTags(item.title + ' ' + (item.contentSnippet || '')),
            }));
            console.log(`✅ Fetched ${videos.length} videos from ${channel.name}`);
            return videos;
        }
        catch (error) {
            console.error(`❌ Error fetching ${channel.name}:`, error);
            return [];
        }
    }
    /**
     * Extract video ID from YouTube URL
     */
    extractVideoId(url) {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        return match ? match[1] : '';
    }
    /**
     * Extract thumbnail URL from RSS item
     */
    extractThumbnail(item) {
        if (item.media?.['media:thumbnail']?.[0]?.$.url) {
            return item.media['media:thumbnail'][0].$.url;
        }
        if (item.enclosure?.url) {
            return item.enclosure.url;
        }
        const videoId = item.videoId || this.extractVideoId(item.link || '');
        if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        return null;
    }
    /**
     * Extract duration from RSS item (if available)
     */
    extractDuration(item) {
        if (item.media?.['media:content']?.[0]?.$.duration) {
            return parseInt(item.media['media:content'][0].$.duration, 10);
        }
        return null;
    }
    /**
     * Extract tags from video title and description
     */
    extractTags(text) {
        const lowerText = text.toLowerCase();
        const tags = [];
        const tagPatterns = [
            { pattern: /\b(x-men|xmen)\b/, tag: 'x-men' },
            { pattern: /\b(marvel|mcu)\b/, tag: 'marvel' },
            { pattern: /\b(dc|dceu)\b/, tag: 'dc' },
            { pattern: /\b(batman|dark knight)\b/, tag: 'batman' },
            { pattern: /\b(spider-man|spiderman)\b/, tag: 'spider-man' },
            { pattern: /\b(comic|comics)\b/, tag: 'comics' },
            { pattern: /\b(history|origin)\b/, tag: 'history' },
            { pattern: /\b(review|analysis)\b/, tag: 'analysis' },
            { pattern: /\b(investment|value)\b/, tag: 'investment' },
            { pattern: /\b(collectible|grading)\b/, tag: 'collectibles' },
        ];
        for (const { pattern, tag } of tagPatterns) {
            if (pattern.test(lowerText)) {
                tags.push(tag);
            }
        }
        return tags.length > 0 ? tags : ['general'];
    }
    /**
     * Store video in database (avoid duplicates)
     */
    async storeVideo(video) {
        try {
            // Check if video already exists
            const existing = await databaseStorage_1.db
                .select()
                .from(schema_1.videoContent)
                .where((0, drizzle_orm_1.eq)(schema_1.videoContent.videoId, video.videoId))
                .limit(1);
            if (existing.length > 0) {
                return { stored: false, id: existing[0].id };
            }
            // Store video
            const [newVideo] = await databaseStorage_1.db
                .insert(schema_1.videoContent)
                .values({
                videoId: video.videoId,
                title: video.title,
                description: video.description,
                channelName: video.channelName,
                channelId: video.channelId,
                publishDate: video.publishDate,
                thumbnailUrl: video.thumbnailUrl,
                url: video.url,
                duration: video.duration,
                tags: video.tags || [],
                transcript: video.transcript || null,
                viewCount: 0,
                likeCount: 0,
            })
                .returning({ id: schema_1.videoContent.id });
            return { stored: true, id: newVideo.id };
        }
        catch (error) {
            console.error('❌ Error storing video:', error);
            return { stored: false };
        }
    }
    /**
     * Fetch and store all videos from all channels
     */
    async fetchAndStoreAllVideos() {
        console.log('🎥 Starting YouTube video extraction...');
        let totalFetched = 0;
        let totalStored = 0;
        const byChannel = {};
        // Process high-priority channels first (ComicGirl19, NerdSync)
        const highPriority = YOUTUBE_CHANNELS.filter(c => c.priority === 'high');
        const mediumPriority = YOUTUBE_CHANNELS.filter(c => c.priority === 'medium');
        for (const channel of [...highPriority, ...mediumPriority]) {
            const videos = await this.fetchChannelVideos(channel);
            totalFetched += videos.length;
            byChannel[channel.name] = 0;
            for (const video of videos) {
                const result = await this.storeVideo(video);
                if (result.stored) {
                    totalStored++;
                    byChannel[channel.name]++;
                }
            }
            console.log(`   ${channel.name}: ${byChannel[channel.name]} new videos stored`);
        }
        console.log(`\n✅ YouTube Video Extraction Complete:`);
        console.log(`   Total Fetched: ${totalFetched}`);
        console.log(`   Total Stored: ${totalStored}`);
        return {
            totalFetched,
            totalStored,
            byChannel,
        };
    }
    /**
     * Get recent videos
     */
    async getRecentVideos(limit = 50) {
        try {
            const videos = await databaseStorage_1.db
                .select()
                .from(schema_1.videoContent)
                .orderBy((0, drizzle_orm_1.desc)(schema_1.videoContent.publishDate))
                .limit(limit);
            return videos;
        }
        catch (error) {
            console.error('❌ Error fetching videos:', error);
            return [];
        }
    }
    /**
     * Get videos by channel
     */
    async getVideosByChannel(channelName, limit = 50) {
        try {
            const videos = await databaseStorage_1.db
                .select()
                .from(schema_1.videoContent)
                .where((0, drizzle_orm_1.eq)(schema_1.videoContent.channelName, channelName))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.videoContent.publishDate))
                .limit(limit);
            return videos;
        }
        catch (error) {
            console.error('❌ Error fetching videos by channel:', error);
            return [];
        }
    }
    /**
     * Search videos by tags
     */
    async searchVideosByTags(tags, limit = 20) {
        try {
            const allVideos = await databaseStorage_1.db
                .select()
                .from(schema_1.videoContent)
                .orderBy((0, drizzle_orm_1.desc)(schema_1.videoContent.publishDate))
                .limit(500);
            const filtered = allVideos.filter(video => video.tags && video.tags.some(tag => tags.includes(tag)));
            return filtered.slice(0, limit);
        }
        catch (error) {
            console.error('❌ Error searching videos:', error);
            return [];
        }
    }
    /**
     * Get ComicGirl19 X-Men videos specifically
     */
    async getComicGirl19XMenVideos() {
        try {
            const videos = await this.getVideosByChannel('ComicGirl19', 200);
            // Filter for X-Men related content
            const xmenVideos = videos.filter(video => video.tags?.includes('x-men') ||
                video.title.toLowerCase().includes('x-men') ||
                video.description.toLowerCase().includes('x-men'));
            console.log(`📺 Found ${xmenVideos.length} X-Men videos from ComicGirl19`);
            return xmenVideos;
        }
        catch (error) {
            console.error('❌ Error fetching ComicGirl19 X-Men videos:', error);
            return [];
        }
    }
    /**
     * Get NerdSync complete catalog
     */
    async getNerdSyncCatalog() {
        try {
            const videos = await this.getVideosByChannel('NerdSync', 500);
            console.log(`📺 Found ${videos.length} videos from NerdSync`);
            return videos;
        }
        catch (error) {
            console.error('❌ Error fetching NerdSync catalog:', error);
            return [];
        }
    }
}
exports.YouTubeVideoService = YouTubeVideoService;
exports.youtubeVideoService = new YouTubeVideoService();
