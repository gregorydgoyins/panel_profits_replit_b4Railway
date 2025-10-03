import { Queue, Worker, QueueOptions, WorkerOptions } from 'bullmq';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

export const redisConnectionConfig = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

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
