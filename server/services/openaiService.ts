import OpenAI from 'openai';

class OpenAIService {
  private client: OpenAI | null = null;

  async init() {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OPENAI_API_KEY not found');
      return;
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateEmbedding(text: string, model: string = "text-embedding-3-small"): Promise<number[] | null> {
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
    } catch (error) {
      console.error('❌ OpenAI embedding error:', error);
      return null;
    }
  }
}

export const openaiService = new OpenAIService();
