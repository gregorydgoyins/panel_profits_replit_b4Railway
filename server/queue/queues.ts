import { Queue } from 'bullmq';
import { defaultQueueOptions } from './config';
import { QueueName } from './types';

export const pineconeExpansionQueue = new Queue(QueueName.PINECONE_EXPANSION, defaultQueueOptions);
export const marvelCharactersQueue = new Queue(QueueName.MARVEL_CHARACTERS, defaultQueueOptions);
export const marvelIssuesQueue = new Queue(QueueName.MARVEL_ISSUES, defaultQueueOptions);
export const comicVineCharactersQueue = new Queue(QueueName.COMIC_VINE_CHARACTERS, defaultQueueOptions);
export const comicVineIssuesQueue = new Queue(QueueName.COMIC_VINE_ISSUES, defaultQueueOptions);
export const assetCreationQueue = new Queue(QueueName.ASSET_CREATION, defaultQueueOptions);
export const assetPricingQueue = new Queue(QueueName.ASSET_PRICING, defaultQueueOptions);
export const entityVerificationQueue = new Queue(QueueName.ENTITY_VERIFICATION, defaultQueueOptions);

export const allQueues = [
  pineconeExpansionQueue,
  marvelCharactersQueue,
  marvelIssuesQueue,
  comicVineCharactersQueue,
  comicVineIssuesQueue,
  assetCreationQueue,
  assetPricingQueue,
  entityVerificationQueue,
];

export async function getQueueMetrics(queueName: QueueName) {
  const queue = allQueues.find(q => q.name === queueName);
  if (!queue) return null;

  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
  ]);

  return {
    name: queueName,
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed,
  };
}

export async function getAllQueueMetrics() {
  const metrics = await Promise.all(
    allQueues.map(q => getQueueMetrics(q.name as QueueName))
  );
  return metrics.filter(m => m !== null);
}

export async function pauseAllQueues() {
  await Promise.all(allQueues.map(q => q.pause()));
}

export async function resumeAllQueues() {
  await Promise.all(allQueues.map(q => q.resume()));
}

export async function clearAllQueues() {
  await Promise.all(allQueues.map(q => q.obliterate({ force: true })));
}
