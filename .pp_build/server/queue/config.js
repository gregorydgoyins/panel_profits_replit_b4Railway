"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultWorkerOptions = exports.defaultQueueOptions = exports.redisConnectionConfig = void 0;
const url_1 = require("url");
// Support multiple Redis credential formats
function getRedisConfig() {
    // Option 1: Full Redis URL (redis://...)
    let redisUrl = process.env.REDIS_URL;
    // Handle Upstash format: "redis-cli --tls -u redis://..."
    if (redisUrl && redisUrl.includes('redis-cli')) {
        const match = redisUrl.match(/(rediss?:\/\/.+)/);
        if (match) {
            redisUrl = match[1];
            console.log('📡 Extracted Redis URL from CLI format');
        }
    }
    if (redisUrl && (redisUrl.startsWith('redis://') || redisUrl.startsWith('rediss://'))) {
        console.log('📡 Using Redis URL connection');
        // Parse URL to extract credentials
        try {
            const parsedUrl = new url_1.URL(redisUrl);
            // IMPORTANT: Use UPSTASH_REDIS_URL (the actual token) as password if available
            // The password in REDIS_URL may be masked in the environment
            const password = process.env.UPSTASH_REDIS_URL || parsedUrl.password || undefined;
            const config = {
                host: parsedUrl.hostname,
                port: parseInt(parsedUrl.port) || 6379,
                password,
                maxRetriesPerRequest: null,
                enableReadyCheck: false,
            };
            // Add TLS for rediss:// protocol OR if URL contains upstash.io
            if (parsedUrl.protocol === 'rediss:' || parsedUrl.hostname.includes('upstash.io')) {
                config.tls = { rejectUnauthorized: false };
                console.log('📡 TLS enabled for secure Redis connection');
            }
            console.log(`📡 Redis connected to: ${parsedUrl.hostname}:${config.port} (password length: ${password ? password.length : 0})`);
            return config;
        }
        catch (error) {
            console.error('❌ Failed to parse REDIS_URL:', error);
            // Fall through to individual credentials
        }
    }
    // Option 2: Individual credentials (Upstash native format)
    const host = process.env.REDIS_HOST || 'localhost';
    const port = parseInt(process.env.REDIS_PORT || '6379');
    const password = process.env.REDIS_PASSWORD;
    if (host !== 'localhost' || password) {
        console.log(`📡 Using Redis connection: ${host}:${port}`);
    }
    const config = {
        host,
        port,
        password,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    };
    // Upstash-specific: TLS for secure connections
    if (host.includes('upstash.io')) {
        config.tls = { rejectUnauthorized: false };
    }
    return config;
}
exports.redisConnectionConfig = getRedisConfig();
exports.defaultQueueOptions = {
    connection: exports.redisConnectionConfig,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
        removeOnComplete: {
            age: 86400, // Keep for 24 hours
            count: 1000,
        },
        removeOnFail: {
            age: 604800, // Keep failed for 7 days
            count: 5000,
        },
    },
};
exports.defaultWorkerOptions = {
    concurrency: 10,
    limiter: {
        max: 10,
        duration: 1000,
    },
};
