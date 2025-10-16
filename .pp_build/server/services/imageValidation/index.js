"use strict";
/**
 * Image Validation & Storage Infrastructure
 *
 * Validates scraped comic images for quality, resolution, and relevance.
 * Manages storage associations between entities and their images.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperImageIntegration = exports.ImageStorageManager = exports.ImageValidator = void 0;
var ImageValidator_1 = require("./ImageValidator");
Object.defineProperty(exports, "ImageValidator", { enumerable: true, get: function () { return ImageValidator_1.ImageValidator; } });
Object.defineProperty(exports, "ImageStorageManager", { enumerable: true, get: function () { return ImageValidator_1.ImageStorageManager; } });
var ScraperImageIntegration_1 = require("./ScraperImageIntegration");
Object.defineProperty(exports, "ScraperImageIntegration", { enumerable: true, get: function () { return ScraperImageIntegration_1.ScraperImageIntegration; } });
