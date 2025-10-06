import { Queue, Worker, QueueOptions, WorkerOptions, ConnectionOptions } from 'bullmq';
import { URL } from 'url';

// Support multiple Redis credential formats
function getRedisConfig(): ConnectionOptions {
  // Option 1: Full Redis URL (redis://...)
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl && (redisUrl.startsWith('redis://') || redisUrl.startsWith('rediss://'))) {
    console.log('📡 Using Redis URL connection');
    
    // Parse URL to extract credentials
    try {
      const parsedUrl = new URL(redisUrl);
      const config: ConnectionOptions = {
        host: parsedUrl.hostname,
        port: parseInt(parsedUrl.port) || 6379,
        password: parsedUrl.password || undefined,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      };

      // Add TLS for rediss:// protocol
      if (parsedUrl.protocol === 'rediss:') {
        config.tls = { rejectUnauthorized: false };
      }

      return config;
    } catch (error) {
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

  const config: ConnectionOptions = {
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

export const redisConnectionConfig = getRedisConfig();

export const defaultQueueOptions: QueueOptions = {
  connection: redisConnectionConfig,
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

export const defaultWorkerOptions: Omit<WorkerOptions, 'connection'> = {
  concurrency: 10,
  limiter: {
    max: 10,
    duration: 1000,
  },
};
