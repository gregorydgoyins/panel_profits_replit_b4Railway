import { Router } from 'express';
import { z } from 'zod';
import { 
  pineconeExpansionQueue,
  marvelCharactersQueue,
  comicVineCharactersQueue,
  getAllQueueMetrics,
  pauseAllQueues,
  resumeAllQueues,
  clearAllQueues,
} from '../queue/queues';
import { acquisitionMonitoring } from '../services/supabaseMonitoring';
import type { 
  PineconeExpansionJob,
  MarvelCharacterJob,
  ComicVineCharacterJob,
} from '../queue/types';

const router = Router();

// Start Pinecone expansion
router.post('/start/pinecone', async (req, res) => {
  try {
    const schema = z.object({
      batchCount: z.number().min(1).max(1000).optional().default(10),
      batchSize: z.number().min(10).max(500).optional().default(100),
      namespace: z.string().optional(),
    });

    const { batchCount, batchSize, namespace } = schema.parse(req.body);

    // Queue multiple batches
    const jobs = [];
    for (let i = 0; i < batchCount; i++) {
      const job = await pineconeExpansionQueue.add(
        'pinecone-expansion',
        {
          batchStart: i * batchSize,
          batchSize,
          namespace,
        } as PineconeExpansionJob,
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
        }
      );
      jobs.push({ id: job.id, batchStart: i * batchSize, batchSize });
    }

    res.json({
      success: true,
      message: `Started ${batchCount} Pinecone expansion batches`,
      jobs,
      estimatedAssets: batchCount * batchSize * 3, // Rough estimate (chars + creators + comics)
    });
  } catch (error) {
    console.error('Failed to start Pinecone expansion:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Start Marvel character acquisition
router.post('/start/marvel', async (req, res) => {
  try {
    const schema = z.object({
      characterIds: z.array(z.number()).optional(),
      offset: z.number().min(0).optional().default(0),
      limit: z.number().min(1).max(100).optional().default(20),
    });

    const { characterIds, offset, limit } = schema.parse(req.body);

    // If specific character IDs provided, queue those
    // Otherwise, we'll need to fetch character list first
    res.json({
      success: true,
      message: 'Marvel acquisition not yet implemented',
      note: 'Will be implemented in next phase',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get acquisition metrics
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await acquisitionMonitoring.getAcquisitionMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Failed to get acquisition metrics:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get metrics history
router.get('/metrics/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const history = acquisitionMonitoring.getMetricsHistory(limit);
    res.json({ history });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get queue status
router.get('/queues', async (req, res) => {
  try {
    const queueMetrics = await getAllQueueMetrics();
    res.json({ queues: queueMetrics });
  } catch (error) {
    console.error('Failed to get queue metrics:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Pause all queues
router.post('/queues/pause', async (req, res) => {
  try {
    await pauseAllQueues();
    res.json({
      success: true,
      message: 'All queues paused',
    });
  } catch (error) {
    console.error('Failed to pause queues:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Resume all queues
router.post('/queues/resume', async (req, res) => {
  try {
    await resumeAllQueues();
    res.json({
      success: true,
      message: 'All queues resumed',
    });
  } catch (error) {
    console.error('Failed to resume queues:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Clear all queues (dangerous - for development only)
router.delete('/queues/clear', async (req, res) => {
  try {
    const confirmToken = req.query.confirm;
    if (confirmToken !== 'CLEAR_ALL_QUEUES') {
      return res.status(400).json({
        success: false,
        error: 'Confirmation token required. Add ?confirm=CLEAR_ALL_QUEUES to URL',
      });
    }

    await clearAllQueues();
    res.json({
      success: true,
      message: 'All queues cleared',
      warning: 'All pending jobs have been removed',
    });
  } catch (error) {
    console.error('Failed to clear queues:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get job details
router.get('/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const queueName = req.query.queue as string;

    if (!queueName) {
      return res.status(400).json({
        success: false,
        error: 'Queue name required',
      });
    }

    // Get job from appropriate queue
    let job;
    switch (queueName) {
      case 'pinecone-expansion':
        job = await pineconeExpansionQueue.getJob(jobId);
        break;
      case 'marvel-characters':
        job = await marvelCharactersQueue.getJob(jobId);
        break;
      case 'comic-vine-characters':
        job = await comicVineCharactersQueue.getJob(jobId);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid queue name',
        });
    }

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    const state = await job.getState();
    res.json({
      id: job.id,
      name: job.name,
      data: job.data,
      progress: job.progress,
      state,
      attemptsMade: job.attemptsMade,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      returnvalue: job.returnvalue,
      failedReason: job.failedReason,
    });
  } catch (error) {
    console.error('Failed to get job details:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
