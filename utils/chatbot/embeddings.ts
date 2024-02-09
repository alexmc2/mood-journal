import client from './supabaseClient'; // Import the Supabase client
import { OpenAIEmbeddings } from '@langchain/openai';

import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';


const embeddings = new OpenAIEmbeddings();



export async function generateEmbedding(text) {
  try {
    const response = await embeddings.embedQuery(text);
    return response;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}
