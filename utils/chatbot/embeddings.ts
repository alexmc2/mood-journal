import { OpenAIEmbeddings } from '@langchain/openai';

const embeddings = new OpenAIEmbeddings();

export async function generateEmbedding(text: string) {
  try {
    const response = await embeddings.embedQuery(text);
    return response;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}
