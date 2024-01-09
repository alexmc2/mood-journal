import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { loadQARefineChain } from 'langchain/chains';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import dotenv from 'dotenv';
import { Document } from 'langchain/document';

import {
  StructuredOutputParser,
  OutputFixingParser,
} from 'langchain/output_parsers';

import { z } from 'zod';
import { prisma } from './db';

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

// export const qa = async (question: string, entries: any[]) => {
//   try {
//     const docs = entries.map((entry) => {
//       return new Document({
//         pageContent: entry.content,
//         metadata: { id: entry.id, createdAt: entry.createdAt },
//       });
//     });

//     const model = new OpenAI({ temperature: 0.4, modelName: 'gpt-3.5-turbo' });

//     const chain = loadQARefineChain(model);

//     const embeddings = new OpenAIEmbeddings();

//     console.log('Docs:', docs);

//     const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

//     const relevantDocs = await store.similaritySearch(question);

//     // Create a prompt template
//     const prompt = new PromptTemplate({
//       template: `As a friendly, wise and empathetic counselor, engage in a friendly conversation with the user. Offer thoughtful insights, understanding, and guidance. Respond to the user's question below in a clear and well-structured manner, using separate paragraphs to organize your thoughts. Do not preface your advice with a greeting. \n\nQuestion: {question}\n\nAnswer:`,
//       inputVariables: ['question'],
//     });

//     const input = await prompt.format({ question });

//     const res = await chain.call({
//       input_documents: relevantDocs,
//       question: input,
//     });

//     return res.output_text;
//   } catch (error) {
//     console.error('Error in qa function:', error);
//     throw error; // Re-throw the error for higher-level handling
//   }
// };

export const qa = async (chatId, newMessage, userId) => {
  try {
    // Fetch recent chat history
    const recentChatMessages = await prisma.message.findMany({
      where: { chatId: chatId },
      orderBy: { createdAt: 'desc' },
      take: 5, // Adjust the number as needed
    });

     const entries = await prisma.journalEntry.findMany({
       where: {
         userId: userId,
       },
     });

    // Convert entries to documents for embeddings (Retaining existing logic)
    const docs = entries.map((entry) => {
      return new Document({
        pageContent: entry.content,
        metadata: { id: entry.id, createdAt: entry.createdAt },
      });
    });

    // Existing logic for embeddings
    const embeddings = new OpenAIEmbeddings();
    const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
    const relevantDocs = await store.similaritySearch(newMessage);

    // Combine chat history and relevant documents in the GPT prompt
    const chatContext = recentChatMessages.map((m) => m.text).join('\n');
    const docContext = relevantDocs.map((doc) => doc.pageContent).join('\n\n');

    const prompt = new PromptTemplate({
      template: `Conversation:\n{chatContext}\n\nRelevant Information:\n{docContext}\n\nRAs a friendly, wise and empathetic counselor, engage in a friendly conversation with the user. Offer thoughtful insights, understanding, and guidance. Respond to the user's question below in a clear and well-structured manner, using separate paragraphs to organize your thoughts. Ask relevant, thought-provoking or insightful questions, where appropriate. Do not preface your advice with a greeting.:\nUser: {newMessage}\n\nResponse:`,
      inputVariables: ['chatContext', 'docContext', 'newMessage'],
    });

    const input = await prompt.format({ chatContext, docContext, newMessage });

    // Call the GPT model
    const model = new OpenAI({ temperature: 0.4, modelName: 'gpt-3.5-turbo' });
    const chain = loadQARefineChain(model);
    const res = await chain.call({
      input_documents: relevantDocs,
      question: input,
    });

    return res.output_text;
  } catch (error) {
    console.error('Error in qaChat function:', error);
    throw error;
  }
};
