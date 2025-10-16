"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiService = void 0;
const openai_1 = __importDefault(require("openai"));
class OpenAIService {
    constructor() {
        this.client = null;
    }
    async init() {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('⚠️ OPENAI_API_KEY not found');
            return;
        }
        this.client = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY
        });
    }
    async generateEmbedding(text, model = "text-embedding-3-small") {
        if (!this.client) {
            console.warn('⚠️ OpenAI not initialized');
            return null;
        }
        try {
            const response = await this.client.embeddings.create({
                model,
                input: text,
                dimensions: 1024 // Match Pinecone's dimension
            });
            return response.data[0].embedding;
        }
        catch (error) {
            console.error('❌ OpenAI embedding error:', error);
            return null;
        }
    }
}
exports.openaiService = new OpenAIService();
