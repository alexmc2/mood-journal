import { StringOutputParser } from '@langchain/core/output_parsers';
// Chatbot version that uses a chain of runnables to process the question and return an answer.

import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';

import { formatDocumentsAsString } from 'langchain/util/document';
import { Document } from '@langchain/core/documents';

import { RunnableSequence } from '@langchain/core/runnables';

import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';

import { createClient } from '@supabase/supabase-js';
import { SupabaseHybridSearch } from '@langchain/community/retrievers/supabase';

import { Client } from 'langsmith';
import { LangChainTracer } from 'langchain/callbacks';

import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from '@langchain/core/prompts';

import {
  BufferMemory,
  ConversationSummaryBufferMemory,
} from 'langchain/memory';

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

  // Add more sanitization rules as needed, e.g., escaping HTML tags, etc.
  // Example: .replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return sanitized;
}


export const runtime = 'edge';




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

    const retriever = vectorStore.asRetriever();

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
      .join('\n');

    console.log('formattedRelevantDocs', formattedRelevantDocs);

    // Long term chat memory

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

    // Format the context and relevant documents

    const formattedrelevantPastChats = relevantPastChats
      .map(
        (doc) =>
          `Similarity Match (${doc.metadata.createdAt}): ${doc.pageContent}`
      )
      .join('\n');

    // Recent chat history

    const fetchChatHistory = async (userId: string, chatId: any) => {
      let { data: chatHistory, error } = await client
        .from('documents')
        .select('*')
        .eq('userId', userId)
        .eq('chatId', chatId)
        .limit(10);

      if (error) {
        console.error('Error fetching chat history:', error);
        return [];
      }

      chatHistory?.sort((a, b) => {
        const aCreatedAt = new Date(a.metadata.createdAt).getTime();
        const bCreatedAt = new Date(b.metadata.createdAt).getTime();
        return aCreatedAt - bCreatedAt;
      });

      const messageInstances = chatHistory?.map((doc) => {
        if (doc.metadata.type === 'message') {
          return new HumanMessage(doc.content);
        } else {
          return new AIMessage(doc.content);
        }
      });

      return messageInstances;
    };

    const chatHistory = await fetchChatHistory(userId, chatId);
    console.log('chatHistory', chatHistory);

    const chatHistoryString = (chatHistory ?? [])
      .map((message) => {
        // Check the constructor name of the message object
        const label =
          message.constructor.name === 'HumanMessage' ? 'Human' : 'AI';
        return `${label}: ${message.content}`;
      })
      .join('\n');

    const chatModel = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo-0125',
      temperature: 0.6,
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
      // Instruction to the AI on how to approach the conversation
      [
        'system',
        "Adopt the position of a wise and empathic friend and respond directly to the user's latest message. Offer relevant and practical insights or guidance based on the content and flow of the chat. AI has access to historical chats and relevant journal entries and these can be used to provide background information. Only bring these up if they are relevant to current chat, no matter what! Compliment the user when appropriate.",
      ],

      // Placeholder for dynamically including the conversation history
      new MessagesPlaceholder('chatHistory'),

      // The user's latest message
      ['user', '{sanitizedMessage}'],
      ['system', chatHistoryString],

      // Providing additional context from similar documents and past chats
      [
        'system',
        `Additional context:\n\nUser journal entries: ${formattedRelevantDocs}\n\nSimilar past chats: ${formattedrelevantPastChats}`,
      ],

      // Final instruction to the AI for generating a response based on all provided context
      [
        'system',
        'Considering the above conversation and additional context, offer support, guidance, or advice that could help the user.',
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
      chatHistory: chatHistory,
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
