"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allQueues = exports.entityVerificationQueue = exports.assetPricingQueue = exports.assetCreationQueue = exports.comicVineIssuesQueue = exports.comicVineCharactersQueue = exports.marvelIssuesQueue = exports.marvelCharactersQueue = exports.pineconeExpansionQueue = void 0;
exports.getQueueMetrics = getQueueMetrics;
exports.getAllQueueMetrics = getAllQueueMetrics;
exports.pauseAllQueues = pauseAllQueues;
exports.resumeAllQueues = resumeAllQueues;
exports.clearAllQueues = clearAllQueues;
const bullmq_1 = require("bullmq");
const config_1 = require("./config");
const types_1 = require("./types");
exports.pineconeExpansionQueue = new bullmq_1.Queue(types_1.QueueName.PINECONE_EXPANSION, config_1.defaultQueueOptions);
exports.marvelCharactersQueue = new bullmq_1.Queue(types_1.QueueName.MARVEL_CHARACTERS, config_1.defaultQueueOptions);
exports.marvelIssuesQueue = new bullmq_1.Queue(types_1.QueueName.MARVEL_ISSUES, config_1.defaultQueueOptions);
exports.comicVineCharactersQueue = new bullmq_1.Queue(types_1.QueueName.COMIC_VINE_CHARACTERS, config_1.defaultQueueOptions);
exports.comicVineIssuesQueue = new bullmq_1.Queue(types_1.QueueName.COMIC_VINE_ISSUES, config_1.defaultQueueOptions);
exports.assetCreationQueue = new bullmq_1.Queue(types_1.QueueName.ASSET_CREATION, config_1.defaultQueueOptions);
exports.assetPricingQueue = new bullmq_1.Queue(types_1.QueueName.ASSET_PRICING, config_1.defaultQueueOptions);
exports.entityVerificationQueue = new bullmq_1.Queue(types_1.QueueName.ENTITY_VERIFICATION, config_1.defaultQueueOptions);
exports.allQueues = [
    exports.pineconeExpansionQueue,
    exports.marvelCharactersQueue,
    exports.marvelIssuesQueue,
    exports.comicVineCharactersQueue,
    exports.comicVineIssuesQueue,
    exports.assetCreationQueue,
    exports.assetPricingQueue,
    exports.entityVerificationQueue,
];
async function getQueueMetrics(queueName) {
    const queue = exports.allQueues.find(q => q.name === queueName);
    if (!queue)
        return null;
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
async function getAllQueueMetrics() {
    const metrics = await Promise.all(exports.allQueues.map(q => getQueueMetrics(q.name)));
    return metrics.filter(m => m !== null);
}
async function pauseAllQueues() {
    await Promise.all(exports.allQueues.map(q => q.pause()));
}
async function resumeAllQueues() {
    await Promise.all(exports.allQueues.map(q => q.resume()));
}
async function clearAllQueues() {
    await Promise.all(exports.allQueues.map(q => q.obliterate({ force: true })));
}
