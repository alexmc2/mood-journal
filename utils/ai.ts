import { OpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';

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
        'a hexidecimal color code that represents the mood of the entry. For example, Love (#FF0000), Envy (#008000), (Contentment (#A1E7E4), Guilt (#CD853F), Despair (#274A78), Regret (#008080), Resentment (#6A5ACD), Stress (#FF7F50) Do not change this unless the entry changes significantly.'
      ),
    sentimentScore: z
      .number()
      .describe(
        'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive. After giving the entry a sentiment score do not change this unless the sentiment of the entry changes significantly.'
      ),
  })
);

const getPrompt = async (content: string) => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      'Analyse the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! DO NOT analyze if the journal entry contains the default content: "Write about your day..." \n{format_instructions}\n{entry}',
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
const chatParser = StructuredOutputParser.fromZodSchema(
  z.object({
    summary: z.string().describe('a quick summary of the chat.'),
  })
);

const getChatSummaryPrompt = async (chatContent: string) => {
  const format_instructions = chatParser.getFormatInstructions();

const prompt = new PromptTemplate({
  template: `
Summarize the following chat conversation concisely, focusing on the main topics discussed. Ensure the summary is clear, concise, and directly addresses the chat content without including unnecessary details.

Example Summaries: Challenges faced over the day, Difficult discussion with a friend, Planning for the weekend. 

Format Instructions:
{format_instructions}

Chat Content:
{chat}
`,
  inputVariables: ['chat'],
  partialVariables: { format_instructions },
});


  return await prompt.format({ chat: chatContent });
};

export const chatSummary = async (chatContent: string) => {
  if (!chatContent || chatContent.trim() === '') {
    return {
      summary: 'No chat content available.',
    };
  }

  const input = await getChatSummaryPrompt(chatContent);
  const model = new OpenAI({
    temperature: 0,
    modelName: 'gpt-3.5-turbo-0125',
  });
  const output = await model.invoke(input);

  try {
    return chatParser.parse(output);
  } catch (e) {
    const fixParser = OutputFixingParser.fromLLM(
      new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo-0125' }),
      chatParser
    );
    const fix = await fixParser.parse(output);
    return fix;
  }
};

//'a hexidecimal color code that represents the mood of the entry. For example, Love (#FF0000), Envy (#008000), (Contentment (#DBCCA6), Playfulness (#B586DE), Affection (#C88AB3), Refreshed (#84FCD3), Calm (#92ABEE), Relaxed (#BADBB7), Inspired (#AB80E8), Peaceful (#D9ECF5), Optimistic (#D5E080), Serene (#F0E3FC), Warmth (#E1AD80), Comfort (#E5C198), Harmony (#A9B9A7), Invigorated (#81FFC8), Soothed (#DED2C9), Tranquil (#B5C9DA), Loved (#FACBCA), Delighted (#FACEDA), Hopeful (#9ED4A3), Anger (#B22222), Sadness (#4169E1), Anxiety (#DAA520), Jealousy (#556B2F), Fear (#483D8B), Guilt (#CD853F), Despair (#274A78), Regret (#008080), Resentment (#6A5ACD), Stress (#FF7F50) Do not change this unless the entry changes significantly.';
