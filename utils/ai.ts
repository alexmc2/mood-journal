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
        'a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness.'
      ),
    sentimentScore: z
      .number()
      .describe(
        'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.'
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
  if (!content || content.trim() === '') {
    // Return a default analysis or skip the analysis
    return {
      mood: 'N/A',
      summary: 'N/A',
      subject: 'N/A',
      negative: false,
      color: '#ffffff', // Default color or whatever makes sense in your context
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

export const qa = async (question: string, entries: any[]) => {
  try {
    const docs = entries.map((entry) => {
      return new Document({
        pageContent: entry.content,
        metadata: { id: entry.id, createdAt: entry.createdAt },
      });
    });

    const model = new OpenAI({ temperature: 0.4, modelName: 'gpt-3.5-turbo' });

    const chain = loadQARefineChain(model);

    const embeddings = new OpenAIEmbeddings();

    console.log('Docs:', docs);

    const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

    const relevantDocs = await store.similaritySearch(question);

    // Create a prompt template
    const prompt = new PromptTemplate({
      template: `As a friendly, wise and empathetic counselor, engage in a friendly conversation with the user. Offer thoughtful insights, understanding, and guidance. Respond to the user's question below in a clear and well-structured manner, using separate paragraphs to organize your thoughts. Do not preface your advice with a greeting. \n\nQuestion: {question}\n\nAnswer:`,
      inputVariables: ['question'],
    });

    const input = await prompt.format({ question });

    const res = await chain.call({
      input_documents: relevantDocs,
      question: input,
    });

    return res.output_text;
  } catch (error) {
    console.error('Error in qa function:', error);
    throw error; // Re-throw the error for higher-level handling
  }
};
