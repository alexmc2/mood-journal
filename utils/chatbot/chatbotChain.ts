import { metadata } from './../../app/layout';
// Chatbot version that uses a chain of runnables to process the question and return an answer.

import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import { RunnableSequence } from '@langchain/core/runnables';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { createClient } from '@supabase/supabase-js';
import { Client } from 'langsmith';
import { LangChainTracer } from 'langchain/callbacks';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { BufferMemory } from 'langchain/memory';
import { SupabaseHybridSearch } from '@langchain/community/retrievers/supabase';

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

const client = createClient(url, privateKey);

const langsmithClient = new Client();
const tracer = new LangChainTracer({
  projectName: 'Mood',
  client: langsmithClient,
});

function sanitizeInput(input: string) {
  // Escape template literals by replacing `$` with `\$`
  const sanitized = input.replace(/\$\{/g, '\\${');

  return sanitized;
}

export const qa = async (chatId: any, newMessage: string, userId: string) => {
  try {
    const sanitizedMessage = sanitizeInput(newMessage);

    const metadataFilter = {
      userId: userId,
      type: 'journal',
    };

    const embeddings = new OpenAIEmbeddings();

    const vectorStore = await SupabaseVectorStore.fromExistingIndex(
      embeddings,
      {
        client,
        tableName: 'documents',
        queryName: 'match_documents',
      }
    );

    // Fetch journals relevant to conversation
    const relevantDocs = await vectorStore.similaritySearch(
      sanitizedMessage,
      3,
      metadataFilter
    );
    console.log('Relevant docs:', relevantDocs);

    // Format the context and relevant documents
    const formattedRelevantDocs = relevantDocs
      .map(
        (doc) =>
          `Similarity Match (${doc.metadata.updatedAt}): ${doc.pageContent}`
      )
      .join('\n\n');

    console.log('formattedRelevantDocs', formattedRelevantDocs);

    // Long term chat memory.

    const metadataFilter2 = {
      userId: userId,
      type: 'message',
    };

    const metadataFilter3 = {
      userId: userId,
      type: 'bot',
    };

    const relevantPastChats = await vectorStore.similaritySearch(
      sanitizedMessage,
      3,
      metadataFilter2 || metadataFilter3
    );

    // filter out the current chat ID from the relevant past chats
    const filteredRelevantPastChats = relevantPastChats.filter(
      (doc) => doc.metadata.chatId !== chatId // Use the chatId from metadata for comparison
    );

    // Format the filtered relevant past chats for presentation
    const formattedRelevantPastChats = filteredRelevantPastChats
      .map(
        (doc) =>
          `Similarity Match (${doc.metadata.createdAt}): ${doc.pageContent}`
      )
      .join('\n\n');

    console.log('formattedRelevantPastChats', formattedRelevantPastChats);

    const fetchChatHistory = async (userId: string, chatId: any) => {
      let { data: chatHistory, error } = await client
        .from('documents')
        .select('*')
        .eq('userId', userId)
        .eq('chatId', chatId)
        .order('createdAt', { ascending: false }) // Order by createdAt in descending order
        .limit(6);

      if (error) {
        console.error('Error fetching chat history:', error);
        return [];
      }

      const reversedChatHistory = chatHistory?.reverse();

      const messageInstances = reversedChatHistory?.map((doc) => {
        if (doc.metadata.type === 'message') {
          return new HumanMessage(doc.content);
        } else {
          return new AIMessage(doc.content);
        }
      });

      return messageInstances;
    };

    const chatHistory = await fetchChatHistory(userId, chatId);

    console.log('chatHistory:', chatHistory);

    const chatHistoryString = (chatHistory ?? [])
      .map((message, index) => {
        const label =
          message.constructor.name === 'HumanMessage' ? 'Human' : 'AI';
        // Example of adding a simple structure enhancement
        return `${index + 1}. [${label}] ${message.content}`;
      })
      .join('\n\n');

    const chatModel = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo-0125',
      temperature: 0.8,
      verbose: true,
      streaming: true,
    });
    const memory = new BufferMemory({
      returnMessages: true,
      inputKey: 'sanitizedMessage',
      outputKey: 'output',
      memoryKey: 'chatHistory',
    });

    // Debugging memory loading
    console.log('Loading memory with chatHistory:', chatHistory);
    memory.loadMemoryVariables({
      chatHistory: chatHistory,
      sanitizedMessage: sanitizedMessage,
    });

    const historyAwarePrompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `Adopt the position of a wise and empathic friend and respond directly to the user's last message: \n\n HUMAN: {sanitizedMessage} \n\n Offer relevant and practical insights or guidance based on the content and flow of the chat.`,
      ],
      ['system', `${chatHistoryString}`],
      [
        'system',
        `Additional context:\n\nUser journal entries: \n\n${formattedRelevantDocs}\n\nSimilar past chats: \n\n${formattedRelevantPastChats}`,
      ],
      // Final instruction to the AI for generating a response based on all provided context
      [
        'system',
        "Consider the above conversation and additional context in your response if it is relevant. Consider the user's current mood as inferred from their recent journal entries or chat messages and respond in a way that matches this mood. For example, contemplative, playful, serious, or reflective. Offer guidance or advice that could help the user. Ask questions to encourage reflection, and show genuine interest in the user. Avoid excessive repetition, no matter what!",
        // "Consider the user's current mood as inferred from their recent journal entries or chat history and respond in a way that matches this mood, whether it be uplifting, contemplative, or supportive. Offer guidance or advice that is relevant and thoughtful, encouraging reflection where appropriate. Show genuine interest and avoid repetition.",
      ],
    ]);

    // Using LCEL

    const chain = RunnableSequence.from([
      {
        sanitizedMessage: (initialInput) => initialInput.sanitizedMessage,
        memory: () => memory.loadMemoryVariables({}),
      },
      {
        sanitizedMessage: (previousOutput) => previousOutput.sanitizedMessage,
        chatHistory: (previousOutput) => previousOutput.memory.chatHistory,
      },
      historyAwarePrompt,
      chatModel,
      new StringOutputParser(),
    ]);

    const response = await chain.invoke({
      chatHistory: chatHistoryString,
      sanitizedMessage: sanitizedMessage,
      callbacks: [tracer],
    });

    await memory.saveContext(
      { sanitizedMessage: sanitizedMessage },
      {
        output: response,
      }
    );

    return response;
  } catch (error) {
    console.error('Error in qa function:', error);

    throw error;
  }
};
