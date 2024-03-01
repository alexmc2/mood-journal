import { OpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';

import {
  StructuredOutputParser,
  OutputFixingParser,
} from 'langchain/output_parsers';

import { z } from 'zod';
import { prisma } from './db';
import { Client } from 'langsmith';
import { LangChainTracer } from 'langchain/callbacks';

const langsmithClient = new Client();
const tracer = new LangChainTracer({
  projectName: 'Mood',
  client: langsmithClient,
});

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe(
        'the mood of the person who wrote the journal entry. If the entry only contains the default content: "Write about your day...", the mood should be "N/A".'
      ),
    summary: z
      .string()
      .describe(
        'quick summary of the entire entry. If the entry only contains the default content: "Write about your day...", the summary should be "None".'
      ),
    subject: z
      .string()
      .describe(
        'the subject of the journal entry. If the entry only contains the default content: "Write about your day...", the subject should be "None".'
      ),
    negative: z
      .boolean()
      .describe(
        'is the journal entry negative? (i.e. does it contain negative emotions?). If the entry only contains the default content: "Write about your day...", the negative should be N/A.'
      ),
    color: z
      .string()
      .describe(
        'a hexidecimal color code that represents the mood of the entry. For example,  Envy (#008000), Playfulness (#B586DE), Contentment (#A1E7E4), Guilt (#CD853F), Despair (#274A78). Do not change this unless the entry changes significantly.If the entry only contains the default content: "Write about your day...", the color should be "#F8F8F8".'
      ),
    sentimentScore: z
      .number()
      .describe(
        'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive. After giving the entry a sentiment score do not change this unless the sentiment of the entry changes significantly. If the entry only contains the default content: "Write about your day...", the sentiment score should be 0.'
      ),
  })
);

const getPrompt = async (content: string) => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      'Analyse the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n\n{format_instructions}\n\n{entry}. ',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({
    entry: content,
    callbacks: [tracer],
  });

  return input;
};

export const analyse = async (content: string) => {
  if (
    !content ||
    content.trim() === '' ||
    content === 'Write about your day...' ||
    content.length < 20
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
  const model = new OpenAI({
    temperature: 0.2,
    modelName: 'gpt-3.5-turbo-0125',
  });
  const output = await model.invoke(input);

  try {
    return parser.parse(output);
  } catch (e) {
    const fixParser = OutputFixingParser.fromLLM(
      new OpenAI({ temperature: 0.2, modelName: 'gpt-3.5-turbo-0125' }),
      parser
    );
    const fix = await fixParser.parse(output);
    return fix;
  }
};

//chat summary code for sidebar
// const chatParser = StructuredOutputParser.fromZodSchema(
//   z.object({
//     summary: z.string().describe('a quick summary of the chat.'),
//   })
// );

// const getChatSummaryPrompt = async (chatContent: string) => {
//   const format_instructions = chatParser.getFormatInstructions();

//   const prompt = new PromptTemplate({
//     template: `
// Summarize the following chat conversation concisely, focusing on the main topics discussed. Ensure the summary is clear, concise, and directly addresses the chat content without including unnecessary details.

// Example Summaries: Challenges faced over the day, Difficult discussion with a friend, Planning for the weekend.

// Format Instructions:
// {format_instructions}

// Chat Content:
// {chat}
// `,
//     inputVariables: ['chat'],
//     partialVariables: { format_instructions },
//   });

//   return await prompt.format({ chat: chatContent });
// };

// export const chatSummary = async (chatContent: string) => {
//   if (!chatContent || chatContent.trim() === '') {
//     return {
//       summary: 'No chat content available.',
//     };
//   }

//   const input = await getChatSummaryPrompt(chatContent);
//   const model = new OpenAI({
//     temperature: 0,
//     modelName: 'gpt-3.5-turbo-0125',
//   });
//   const output = await model.invoke(input);

//   try {
//     return chatParser.parse(output);
//   } catch (e) {
//     const fixParser = OutputFixingParser.fromLLM(
//       new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo-0125' }),
//       chatParser
//     );
//     const fix = await fixParser.parse(output);
//     return fix;
//   }
// };

//chat summary code for sidebar
const chatParser = StructuredOutputParser.fromZodSchema(
  z.object({
    summary: z.string().describe('a quick summary of the chat.'),
    subject: z.string().describe('the main subject of the chat.'),
  })
);

const getChatSummaryPrompt = async (chatContent: string) => {
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

//TODO: add Json schema to messages
// export const JsonMessageSchema = z.object({
//   id: z.string(),
//   type: z.enum(['text', 'code']),
//   content: z.string(),
//   language: z.string().optional(),
//   question: z.string().optional(),
//   answer: z.string().optional(),
// });

// export const JsonMessagesArraySchema = z.array(JsonMessageSchema);

// export type JSONMessage = z.infer<typeof JsonMessageSchema>;
