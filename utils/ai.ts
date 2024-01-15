import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Document } from 'langchain/document';
import {
  StructuredOutputParser,
  OutputFixingParser,
} from 'langchain/output_parsers';
import { ChatOpenAI } from '@langchain/openai';
import {
  BufferMemory,
  ChatMessageHistory,
  VectorStoreRetrieverMemory,
} from 'langchain/memory';

import { LLMChain } from 'langchain/chains';
import { UpstashRedisChatMessageHistory } from 'langchain/stores/message/upstash_redis';

import { RedisVectorStore } from '@langchain/community/vectorstores/redis';

import { z } from 'zod';
import { prisma } from './db';
import { Redis } from '@upstash/redis';

import { ConversationChain } from 'langchain/chains';
import { createClient } from 'redis';
import { RedisChatMessageHistory } from '@langchain/community/stores/message/ioredis';

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe('the mood of the person who wrote the journal entry.'),
    summary: z.string().describe('quick summary of the entire entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    negative: z
      .boolean()
      .describe(
        'is the journal entry negative? (i.e. does it contain negative emotions?).'
      ),
    color: z
      .string()
      .describe(
        'a hexidecimal color code that represents the mood of the entry. For example, use #008000 for envy. Use a wide variety of bright, interesting and vibrant colors for positive moods such as #84FCD3, #92ABEE, #BADBB7, #AB80E8, #D9ECF5, #E88CE7, #D5E080, #DBCCA6, #B586DE, #C88AB3, #F0E3FC, #E1AD80, #E5C198, #A9B9A7, #81FFC8, #DED2C9, #B5C9DA, #FACBCA, #FACEDA or #9ED4A3. Use somber colors for negative sentiments such as #2B2B2B, #5F5F5F, #5A5A5A, #1F1F1F, #222222, #1A1A1A, #535353, #3D3D3D, #555555, #383838, #724F5D, #364839, #021D18, #756B6C, #6D0213, #623436, #442C75, #2A096E, #074344, #28172E, #272954, #271A72, #0E0159, #291864, #51062E, #273C6C, #0E532C, #355328, #4C716B or #3E4F08. Do not just pick the first color - consider them all or choose your own interesting color. Do not change this unless the entry changes significantly.'
      ),
    sentimentScore: z
      .number()
      .describe(
        'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive. After giving the entry a sentiment score do not change this unless the sentiment of the entry changes significantly.'
      ),
  })
);

const getPrompt = async (content) => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      'Analyse the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({
    entry: content,
  });

  return input;
};

export const analyse = async (content: string) => {
  if (
    !content ||
    content.trim() === '' ||
    content === 'Write about your day...'
  ) {
    // Return a default analysis or skip the analysis
    return {
      mood: 'Neutral',
      subject: 'None',
      negative: false,
      summary: 'None',
      sentimentScore: 0,
      color: '#0101fe',
    };
  }
  const input = await getPrompt(content);
  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' });
  const output = await model.call(input);

  try {
    return parser.parse(output);
  } catch (e) {
    const fixParser = OutputFixingParser.fromLLM(
      new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' }),
      parser
    );
    const fix = await fixParser.parse(output);
    return fix;
  }
};

const chatParser = StructuredOutputParser.fromZodSchema(
  z.object({
    summary: z.string().describe('a quick summary of the chat.'),
    subject: z.string().describe('the main subject of the chat.'),
  })
);

const getChatSummaryPrompt = async (chatContent) => {
  const format_instructions = chatParser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      'Summarize the following chat conversation. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{chat}',
    inputVariables: ['chat'],
    partialVariables: { format_instructions },
  });

  return await prompt.format({ chat: chatContent });
};

export const chatSummary = async (chatContent: string) => {
  if (!chatContent || chatContent.trim() === '') {
    return {
      summary: 'No chat content available.',
      subject: 'N/A',
    };
  }

  const input = await getChatSummaryPrompt(chatContent);
  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' });
  const output = await model.call(input);

  try {
    return chatParser.parse(output);
  } catch (e) {
    const fixParser = OutputFixingParser.fromLLM(
      new OpenAI({ temperature: 0.4, modelName: 'gpt-3.5-turbo' }),
      chatParser
    );
    const fix = await fixParser.parse(output);
    return fix;
  }
};

export const qa = async (chatId, newMessage, userId) => {
  try {
    //  Fetch recent chat history and user entries in parallel
    const [chatHistory, entries] = await Promise.all([
      prisma.message.findMany({
        where: { chatId: chatId },
        orderBy: { createdAt: 'desc' },

        select: { text: true, id: true, createdAt: true },
      }),
      prisma.journalEntry.findMany({
        where: { userId: userId },

        select: { content: true, id: true, createdAt: true },
      }),

    //   prisma.chat.findMany({
    //     where: { userId: userId },
    //     orderBy: { createdAt: 'desc' },

    //     select: { messages: true, id: true, createdAt: true },
    //   }),
    ]);

    // Create documents for embeddings from journal entries
    const docs = entries.map(
      (entry) =>
        new Document({
          pageContent: entry.content,
          metadata: { id: entry.id, createdAt: entry.createdAt },
        })
    );

    const chatDocs = chatHistory.map(
      (message) =>
        new Document({
          pageContent: message.text,
          metadata: { id: message.id, createdAt: message.createdAt },
        })
    );


    console.log('Type of newMessage:', typeof newMessage);
    console.log('Value of newMessage:', newMessage);

    // Initialize OpenAI Embeddings and Memory Vector Store

    const combinedDocs = [...chatDocs, ...docs];
    const embeddings = new OpenAIEmbeddings();
    const vectorStore = await MemoryVectorStore.fromDocuments(
      combinedDocs,
      embeddings
    );

    // Retrieve relevant documents
    const relevantDocs = await vectorStore.similaritySearch(newMessage);

    console.log('Type of relevantDocs:', typeof relevantDocs);
    console.log('Value of relevantDocs:', relevantDocs);

    // Initialize Memory-backed vector store as a retriever
    const memory = new VectorStoreRetrieverMemory({
      vectorStoreRetriever: vectorStore.asRetriever(10),
      memoryKey: 'history',
    });

    console.log('Type of memory:', typeof memory);
    console.log('Value of memory:', memory);

    // Load the memory context
    const context = await memory.loadMemoryVariables({ prompt: 'newMessage' });

    console.log('Type of context:', typeof context);
    console.log('Value of context:', context);

    // Initialize the LLM Chain with memory
    const model = new OpenAI({ temperature: 0.6, modelName: 'gpt-3.5-turbo' });
    const prompt = new PromptTemplate({
      template: `Using the information provided in the previous conversation and relevant documents, respond directly to the user's question. Offer relevant, and practical insights or guidance based on the user's ${newMessage}, ${relevantDocs} and the ${context.history} available. Ask questions and be interested in the user. Adopt the position of a wise and empathic therapist or friend but avoid role-playing or creating fictional scenarios. Address the user by name.

    Previous Conversation: ${context.history}

    Relevant Documents: ${relevantDocs}

    User's Question: ${newMessage}

    Response:`,
      inputVariables: ['newMessage', 'context', 'relevantDocs'],
    });

    const chain = new LLMChain({ llm: model, prompt, memory });

    // Call the GPT model with updated prompt
    const res = await chain.call({
      input: newMessage,
    });

    console.log('Response object:', res);
    console.log('Response text:', res.text);

    return res.text;
  } catch (error) {
    console.error('Error in qaChat function:', error);
    throw error;
  }
};

// export const qa = async (chatId, newMessage, userId) => {
//   try {
//     const client = createClient({
//       url: 'rediss://default:********@eu1-suitable-doberman-38495.upstash.io:38495',
//     });

//     client.on('error', function (err) {
//       throw err;
//     });
//     await client.connect();

//     //  Fetch recent chat history and user entries in parallel
//     const [chatHistory, entries] = await Promise.all([
//       prisma.message.findMany({
//         where: { chatId: chatId },
//         orderBy: { createdAt: 'desc' },

//         select: { text: true, id: true, createdAt: true },
//       }),
//       prisma.journalEntry.findMany({
//         where: { userId: userId },

//         select: { content: true, id: true, createdAt: true },
//       }),
//     ]);

//     // Create documents for embeddings from journal entries
//     const docs = entries.map(
//       (entry) =>
//         new Document({
//           pageContent: entry.content,
//           metadata: { id: entry.id, createdAt: entry.createdAt },
//         })
//     );

//     const chatDocs = chatHistory.map(
//       (message) =>
//         new Document({
//           pageContent: message.text,
//           metadata: { id: message.id, createdAt: message.createdAt },
//         })
//     );

//     // Serialize chat history
//     const chatHistorySerialized = JSON.stringify(chatHistory);
//     // Save to Redis
//     await client.set(`${userId}_chatHistory`, chatHistorySerialized);

//     console.log('Type of newMessage:', typeof newMessage);
//     console.log('Value of newMessage:', newMessage);

//     const combinedDocs = [...chatDocs, ...docs];
//     const embeddings = new OpenAIEmbeddings();
//     const vectorStore = await RedisVectorStore.fromDocuments(
//       combinedDocs,
//       embeddings,
//       {
//         redisClient: client,
//         indexName: 'docs',
//         // You can include createIndexOptions if needed
//       }
//     );

//     // Retrieve relevant documents
//     const relevantDocs = await vectorStore.similaritySearch(newMessage, 10);

//     console.log('Type of relevantDocs:', typeof relevantDocs);
//     console.log('Value of relevantDocs:', relevantDocs);

//     // Initialize Memory-backed vector store as a retriever
//     // const memory = new VectorStoreRetrieverMemory({
//     //   vectorStoreRetriever: vectorStore.asRetriever(10),
//     //   memoryKey: 'history',
//     // });

//     const memory = new BufferMemory({
//       chatHistory: new UpstashRedisChatMessageHistory({
//         sessionId: new Date().toLocaleDateString(),
//         client: Redis.fromEnv(),
//       }),
//     });

//     console.log('Type of memory:', typeof memory);
//     console.log('Value of memory:', memory);

//     // Load the memory context
//     const context = await memory.loadMemoryVariables({ prompt: 'newMessage' });

//     console.log('Type of context:', typeof context);
//     console.log('Value of context:', context);

//     // Initialize the LLM Chain with memory
//     const model = new ChatOpenAI({
//       modelName: 'gpt-3.5-turbo',
//       streaming: true,
//       temperature: 0.6,
//     });

//     const prompt = new PromptTemplate({
//       template: `Using the information provided in the previous conversation and relevant documents, respond directly to the user's question. Offer relevant, and practical insights or guidance based on the user's ${newMessage}, ${relevantDocs} and the ${context.history} available. Ask questions and be interested in the user. Adopt the position of a wise and empathic therapist or friend but avoid role-playing or creating fictional scenarios. Address the user by name.

//     Previous Conversation: ${context.history}

//     Relevant Documents: ${relevantDocs}

//     User's Question: ${newMessage}

//     Response:`,
//       inputVariables: ['newMessage', 'context', 'relevantDocs'],
//     });

//     const chain = new ConversationChain({ llm: model, prompt, memory });

//     // Call the GPT model with updated prompt
//     const res = await chain.call({

//       input: newMessage,

//     });

//     console.log('Response object:', res);
//     console.log('Response text:', res.text);

//     return res.text;
//   } catch (error) {
//     console.error('Error in qaChat function:', error);
//     throw error;
//   }
// };

