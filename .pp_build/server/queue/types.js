"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobType = exports.QueueName = void 0;
var QueueName;
(function (QueueName) {
    QueueName["PINECONE_EXPANSION"] = "pinecone-expansion";
    QueueName["MARVEL_CHARACTERS"] = "marvel-characters";
    QueueName["MARVEL_ISSUES"] = "marvel-issues";
    QueueName["COMIC_VINE_CHARACTERS"] = "comic-vine-characters";
    QueueName["COMIC_VINE_ISSUES"] = "comic-vine-issues";
    QueueName["ASSET_CREATION"] = "asset-creation";
    QueueName["ASSET_PRICING"] = "asset-pricing";
    QueueName["ENTITY_VERIFICATION"] = "entity-verification";
})(QueueName || (exports.QueueName = QueueName = {}));
var JobType;
(function (JobType) {
    JobType["EXPAND_PINECONE_BATCH"] = "expand-pinecone-batch";
    JobType["FETCH_MARVEL_CHARACTER"] = "fetch-marvel-character";
    JobType["FETCH_MARVEL_ISSUES"] = "fetch-marvel-issues";
    JobType["FETCH_COMIC_VINE_CHARACTER"] = "fetch-comic-vine-character";
    JobType["FETCH_COMIC_VINE_ISSUES"] = "fetch-comic-vine-issues";
    JobType["CREATE_ASSET"] = "create-asset";
    JobType["PRICE_ASSET"] = "price-asset";
    JobType["VERIFY_ENTITY"] = "verify-entity";
    JobType["VERIFY_ENTITY_BATCH"] = "verify-entity-batch";
})(JobType || (exports.JobType = JobType = {}));
